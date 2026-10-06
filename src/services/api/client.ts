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
  ApiError,
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
  /** Never try a silent token refresh for this call (used by the refresh call itself). */
  skipRefresh?: boolean;
}

/** A success envelope with its metadata kept (pagination lives in `meta`). */
export interface Envelope<T> {
  data: T;
  meta?: Record<string, unknown>;
  message?: string;
}

type TokenProvider = () => string | null;
type UnauthorizedHandler = () => void;
/** Resolves true when a new access token is now available (the caller then retries once). */
type RefreshHandler = () => Promise<boolean>;

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

/** Splits a `{ success, data, meta, message }` body into its parts; a bare body becomes `{ data }`. */
function toEnvelope<T>(body: unknown): Envelope<T> {
  if (body !== null && typeof body === 'object' && 'success' in body) {
    const b = body as { data?: T; meta?: Record<string, unknown>; message?: string };
    return { data: b.data as T, meta: b.meta, message: b.message };
  }
  return { data: body as T };
}

class ApiClient {
  private baseUrl: string;
  private defaultTimeoutMs: number;
  private getToken: TokenProvider | null = null;
  private onUnauthorized: UnauthorizedHandler | null = null;
  private refreshHandler: RefreshHandler | null = null;
  /** Shared by every request that hits a 401 at the same moment, so the (single-use) refresh token is spent once. */
  private refreshInFlight: Promise<boolean> | null = null;

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

  /** Registers the handler invoked when the API returns 401 and a silent refresh did not recover the session. */
  setUnauthorizedHandler(handler: UnauthorizedHandler | null): void {
    this.onUnauthorized = handler;
  }

  /**
   * Registers how to obtain a fresh access token (the AuthProvider calls `POST /auth/refresh`).
   * Access tokens are short-lived (15 min on the server), so without this every user would be
   * signed out mid-session.
   */
  setRefreshHandler(handler: RefreshHandler | null): void {
    this.refreshHandler = handler;
  }

  get<T>(path: string, options?: RequestOptions): Promise<T> {
    return this.request<T>('GET', path, undefined, options);
  }

  /** Like `get`, but keeps `meta` (pagination) instead of discarding it with the envelope. */
  async getEnvelope<T>(path: string, options?: RequestOptions): Promise<Envelope<T>> {
    const payload = await this.execute('GET', path, undefined, options);
    return toEnvelope<T>(payload);
  }

  /** Like `post`/`patch`/..., but keeps the whole envelope (some endpoints return `message` + counts beside `data`). */
  async sendEnvelope<T>(
    method: 'POST' | 'PUT' | 'PATCH' | 'DELETE',
    path: string,
    body?: unknown,
    options?: RequestOptions,
  ): Promise<Envelope<T>> {
    const payload = await this.execute(method, path, body, options);
    return toEnvelope<T>(payload);
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
    return unwrapEnvelope<T>(await this.execute(method, path, body, options));
  }

  /** One refresh at a time; concurrent 401s all wait for the same attempt. */
  private refreshOnce(): Promise<boolean> {
    if (!this.refreshHandler) return Promise.resolve(false);
    if (!this.refreshInFlight) {
      this.refreshInFlight = this.refreshHandler()
        .catch(() => false)
        .finally(() => {
          this.refreshInFlight = null;
        });
    }
    return this.refreshInFlight;
  }

  /**
   * Sends the request and returns the parsed body. On a 401 for an authenticated call it first tries a
   * silent token refresh and replays the request once; only if that fails is the user signed out.
   */
  private async execute(
    method: HttpMethod,
    path: string,
    body: unknown,
    options?: RequestOptions,
  ): Promise<unknown> {
    try {
      return await this.send(method, path, body, options);
    } catch (error) {
      const canRefresh =
        error instanceof ApiError &&
        error.status === HTTP_STATUS.UNAUTHORIZED &&
        !options?.skipAuth &&
        !options?.skipRefresh &&
        this.refreshHandler !== null;

      if (!canRefresh) {
        if (error instanceof ApiError && error.status === HTTP_STATUS.UNAUTHORIZED && !options?.skipRefresh) {
          this.onUnauthorized?.();
        }
        throw error;
      }

      if (await this.refreshOnce()) {
        // New token is stored; buildHeaders reads it again. `skipRefresh` prevents an endless 401 loop.
        return this.send(method, path, body, { ...options, skipRefresh: true });
      }
      this.onUnauthorized?.();
      throw error;
    }
  }

  private async send(
    method: HttpMethod,
    path: string,
    body: unknown,
    options?: RequestOptions,
  ): Promise<unknown> {
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
        // The refresh token is an httpOnly cookie; it must travel with the request (and be accepted back).
        credentials: 'include',
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
        throw createHttpError(
          response.status,
          payload as ApiErrorPayload | undefined,
          payload,
        );
      }

      return payload;
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
