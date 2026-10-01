/**
 * The application's single HTTP client.
 *
 * No component, hook or page should ever call `fetch` directly — they call a
 * service, and the service calls this client. That keeps base URLs, auth
 * headers, timeouts and error normalization in exactly one place.
 *
 * The mock/real switch does NOT live here: this module is a pure HTTP concern.
 * Services decide whether to use their mock or HTTP implementation
 * (see `createService` in `services/api/create-service.ts`).
 */

import { env } from '@config/env';
import {
  CONTENT_TYPE_JSON,
  HEADERS,
  HTTP_STATUS,
} from '@constants/api.constants';
import type { ApiErrorPayload, QueryParams } from '@/types/api.types';
import {
  createHttpError,
  createTimeoutError,
  toApiError,
} from './errors';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface RequestOptions {
  /** Query-string parameters. `undefined` and `null` values are dropped. */
  query?: Record<string, unknown> | QueryParams;
  /** Extra headers merged over the defaults. */
  headers?: Record<string, string>;
  /** Per-request timeout override, in milliseconds. */
  timeoutMs?: number;
  /** Caller's abort signal, composed with the timeout signal. */
  signal?: AbortSignal;
  /** Skip the Authorization header (e.g. for the login call itself). */
  skipAuth?: boolean;
  /** Send the body as-is (FormData, Blob) instead of JSON-encoding it. */
  rawBody?: boolean;
}

type TokenProvider = () => string | null;
type UnauthorizedHandler = () => void;

/**
 * Flattens `QueryParams` (including its nested `filters`) plus arbitrary
 * key/value pairs into a query string, skipping empty values.
 */
function buildQueryString(query: RequestOptions['query']): string {
  if (!query) return '';

  const search = new URLSearchParams();

  const append = (key: string, value: unknown): void => {
    if (value === undefined || value === null || value === '') return;
    if (Array.isArray(value)) {
      value.forEach((item) => append(key, item));
      return;
    }
    search.append(key, String(value));
  };

  for (const [key, value] of Object.entries(query)) {
    if (key === 'filters' && value && typeof value === 'object') {
      for (const [filterKey, filterValue] of Object.entries(
        value as Record<string, unknown>,
      )) {
        append(filterKey, filterValue);
      }
      continue;
    }
    append(key, value);
  }

  const queryString = search.toString();
  return queryString ? `?${queryString}` : '';
}

/** Joins the configured base URL with a path, avoiding duplicate slashes. */
function buildUrl(baseUrl: string, path: string, query: RequestOptions['query']): string {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${normalizedPath}${buildQueryString(query)}`;
}

/**
 * Composes the timeout signal with the caller's signal.
 * `AbortSignal.any` is used when available (all current browsers), with a
 * manual fallback so older targets still abort correctly.
 */
function composeSignals(
  timeoutController: AbortController,
  callerSignal: AbortSignal | undefined,
): AbortSignal {
  if (!callerSignal) return timeoutController.signal;

  if (typeof AbortSignal !== 'undefined' && 'any' in AbortSignal) {
    return AbortSignal.any([timeoutController.signal, callerSignal]);
  }

  if (callerSignal.aborted) {
    timeoutController.abort();
  } else {
    callerSignal.addEventListener('abort', () => timeoutController.abort(), {
      once: true,
    });
  }
  return timeoutController.signal;
}

/** Reads the response body, tolerating empty and non-JSON payloads. */
async function parseBody(response: Response): Promise<unknown> {
  if (response.status === HTTP_STATUS.NO_CONTENT) return null;

  const contentType = response.headers.get(HEADERS.CONTENT_TYPE) ?? '';
  const text = await response.text();
  if (!text) return null;

  if (contentType.includes('json')) {
    try {
      return JSON.parse(text) as unknown;
    } catch {
      // A malformed JSON body is still useful as diagnostic detail.
      return text;
    }
  }
  return text;
}

/**
 * Unwraps a `{ success, data }` envelope when the backend uses one, and
 * returns the body untouched otherwise. This keeps services working against
 * both conventions without changes.
 */
function unwrapEnvelope<T>(body: unknown): T {
  if (
    body !== null &&
    typeof body === 'object' &&
    'data' in body &&
    'success' in body
  ) {
    return (body as { data: T }).data;
  }
  return body as T;
}

class ApiClient {
  private baseUrl: string;
  private defaultTimeoutMs: number;
  private getToken: TokenProvider | null = null;
  private onUnauthorized: UnauthorizedHandler | null = null;

  constructor(baseUrl: string, defaultTimeoutMs: number) {
    this.baseUrl = baseUrl;
    this.defaultTimeoutMs = defaultTimeoutMs;
  }

  /**
   * Registers the source of the auth token. Called once by `AuthProvider`.
   * Using a callback keeps the client free of any dependency on the auth
   * module, which would otherwise be a circular import.
   */
  setAuthTokenProvider(provider: TokenProvider | null): void {
    this.getToken = provider;
  }

  /** Registers the handler invoked when the API returns 401. */
  setUnauthorizedHandler(handler: UnauthorizedHandler | null): void {
    this.onUnauthorized = handler;
  }

  get<T>(path: string, options?: RequestOptions): Promise<T> {
    return this.request<T>('GET', path, undefined, options);
  }

  post<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>('POST', path, body, options);
  }

  put<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>('PUT', path, body, options);
  }

  patch<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>('PATCH', path, body, options);
  }

  delete<T>(path: string, options?: RequestOptions): Promise<T> {
    return this.request<T>('DELETE', path, undefined, options);
  }

  private buildHeaders(
    options: RequestOptions | undefined,
    hasJsonBody: boolean,
  ): Record<string, string> {
    const headers: Record<string, string> = {
      [HEADERS.ACCEPT]: CONTENT_TYPE_JSON,
      ...options?.headers,
    };

    if (hasJsonBody && !headers[HEADERS.CONTENT_TYPE]) {
      headers[HEADERS.CONTENT_TYPE] = CONTENT_TYPE_JSON;
    }

    if (!options?.skipAuth && !headers[HEADERS.AUTHORIZATION]) {
      const token = this.getToken?.();
      if (token) {
        headers[HEADERS.AUTHORIZATION] = `Bearer ${token}`;
      }
    }

    return headers;
  }

  private async request<T>(
    method: HttpMethod,
    path: string,
    body: unknown,
    options?: RequestOptions,
  ): Promise<T> {
    const timeoutMs = options?.timeoutMs ?? this.defaultTimeoutMs;
    const timeoutController = new AbortController();
    const signal = composeSignals(timeoutController, options?.signal);

    let timedOut = false;
    const timeoutId = window.setTimeout(() => {
      timedOut = true;
      timeoutController.abort();
    }, timeoutMs);

    const sendRaw = options?.rawBody === true;
    const hasJsonBody = body !== undefined && !sendRaw;

    try {
      const response = await fetch(buildUrl(this.baseUrl, path, options?.query), {
        method,
        signal,
        headers: this.buildHeaders(options, hasJsonBody),
        body:
          body === undefined
            ? undefined
            : sendRaw
              ? (body as BodyInit)
              : JSON.stringify(body),
      });

      const payload = await parseBody(response);

      if (!response.ok) {
        if (response.status === HTTP_STATUS.UNAUTHORIZED) {
          this.onUnauthorized?.();
        }
        throw createHttpError(
          response.status,
          payload as ApiErrorPayload | undefined,
          payload,
        );
      }

      return unwrapEnvelope<T>(payload);
    } catch (error) {
      // A timeout surfaces as an AbortError; distinguish it from a caller
      // cancellation so the user sees an accurate message.
      if (timedOut) throw createTimeoutError(timeoutMs);
      throw toApiError(error);
    } finally {
      window.clearTimeout(timeoutId);
    }
  }
}

/** The shared client instance. Import this, do not construct your own. */
export const apiClient = new ApiClient(env.apiBaseUrl, env.apiTimeoutMs);

export type { ApiClient };
