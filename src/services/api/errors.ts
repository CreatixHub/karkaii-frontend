/**
 * Centralized API error handling.
 *
 * Every failure in the data layer — HTTP status, network drop, timeout, bad
 * JSON, or a mock service rejecting — is normalized into a single `ApiError`.
 * UI code therefore only ever has to handle one error type, and always has a
 * safe message to render.
 */

import {
  ERROR_CODE,
  errorCodeForStatus,
  messageForErrorCode,
} from '@constants/api.constants';
import type { ErrorCode } from '@constants/api.constants';
import type { ApiErrorPayload, FieldErrors } from '@/types/api.types';

export interface ApiErrorOptions {
  /** HTTP status, or 0 when the request never reached the server. */
  status?: number;
  code?: ErrorCode;
  /** Raw server payload. Kept for logging — never render this to users. */
  details?: unknown;
  /** Field-level messages from a 422 response. */
  fieldErrors?: FieldErrors;
  cause?: unknown;
}

/**
 * `erasableSyntaxOnly` forbids constructor parameter properties, so fields are
 * declared and assigned explicitly.
 */
export class ApiError extends Error {
  readonly status: number;
  readonly code: ErrorCode;
  readonly details?: unknown;
  readonly fieldErrors?: FieldErrors;

  constructor(message: string, options: ApiErrorOptions = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = options.status ?? 0;
    this.code = options.code ?? ERROR_CODE.UNKNOWN;
    this.details = options.details;
    this.fieldErrors = options.fieldErrors;

    // Restores the prototype chain when targeting ES2020 down-level classes,
    // so `instanceof ApiError` is reliable.
    Object.setPrototypeOf(this, ApiError.prototype);
  }

  /** The request never reached the server. */
  get isNetworkError(): boolean {
    return this.code === ERROR_CODE.NETWORK;
  }

  /** The request was aborted because it exceeded the configured timeout. */
  get isTimeout(): boolean {
    return this.code === ERROR_CODE.TIMEOUT;
  }

  /** The caller aborted the request (unmount, superseded query). */
  get isCancelled(): boolean {
    return this.code === ERROR_CODE.CANCELLED;
  }

  /** The session is missing or expired — callers should sign the user out. */
  get isUnauthorized(): boolean {
    return this.code === ERROR_CODE.UNAUTHORIZED;
  }

  /** The server rejected the payload with field-level messages. */
  get isValidationError(): boolean {
    return this.code === ERROR_CODE.VALIDATION;
  }

  /** Transient failures that are worth offering a retry for. */
  get isRetryable(): boolean {
    return (
      this.isNetworkError ||
      this.isTimeout ||
      this.code === ERROR_CODE.SERVER ||
      this.code === ERROR_CODE.RATE_LIMITED
    );
  }
}

/**
 * The backend reports field problems as `errors: [{ field, message }]` (see formatZodError in
 * server/src/utils/validation.js); forms want `{ [field]: message }`. Accepts both shapes.
 */
export function normalizeFieldErrors(raw: unknown): FieldErrors | undefined {
  if (!raw || typeof raw !== 'object') return undefined;
  if (Array.isArray(raw)) {
    const out: FieldErrors = {};
    for (const item of raw) {
      if (item && typeof item === 'object' && 'field' in item && 'message' in item) {
        const { field, message } = item as { field: unknown; message: unknown };
        // first message per field wins; nested paths ("items.0.qty") are kept as-is
        if (typeof field === 'string' && typeof message === 'string' && !(field in out)) out[field] = message;
      }
    }
    return Object.keys(out).length ? out : undefined;
  }
  return raw as FieldErrors;
}

/** Builds an `ApiError` from an HTTP response and its parsed body. */
export function createHttpError(
  status: number,
  payload: ApiErrorPayload | undefined,
  fallbackDetails?: unknown,
): ApiError {
  const fieldErrors = normalizeFieldErrors(payload?.errors);
  // The server answers invalid input with 400 (and a duplicate with 409); with field errors attached it is a
  // validation failure as far as the UI is concerned, whatever the status.
  const code = fieldErrors && status === 400 ? ERROR_CODE.VALIDATION : errorCodeForStatus(status);
  return new ApiError(messageForErrorCode(code), {
    status,
    code,
    details: payload ?? fallbackDetails,
    fieldErrors,
  });
}

export function createNetworkError(cause?: unknown): ApiError {
  return new ApiError(messageForErrorCode(ERROR_CODE.NETWORK), {
    status: 0,
    code: ERROR_CODE.NETWORK,
    details: cause,
  });
}

export function createTimeoutError(timeoutMs: number): ApiError {
  return new ApiError(messageForErrorCode(ERROR_CODE.TIMEOUT), {
    status: 0,
    code: ERROR_CODE.TIMEOUT,
    details: { timeoutMs },
  });
}

export function createCancelledError(): ApiError {
  return new ApiError(messageForErrorCode(ERROR_CODE.CANCELLED), {
    status: 0,
    code: ERROR_CODE.CANCELLED,
  });
}

export function createNotFoundError(resource = 'Resource'): ApiError {
  return new ApiError(messageForErrorCode(ERROR_CODE.NOT_FOUND), {
    status: 404,
    code: ERROR_CODE.NOT_FOUND,
    details: { resource },
  });
}

export function createValidationError(
  fieldErrors: FieldErrors,
  message?: string,
): ApiError {
  return new ApiError(message ?? messageForErrorCode(ERROR_CODE.VALIDATION), {
    status: 422,
    code: ERROR_CODE.VALIDATION,
    fieldErrors,
  });
}

/**
 * Coerces anything thrown into an `ApiError`, so `catch` blocks never have to
 * inspect `unknown`.
 */
export function toApiError(error: unknown): ApiError {
  if (error instanceof ApiError) return error;

  if (error instanceof DOMException && error.name === 'AbortError') {
    return createCancelledError();
  }

  if (error instanceof TypeError) {
    // `fetch` rejects with a TypeError when the network is unreachable,
    // DNS fails, or CORS blocks the request.
    return createNetworkError(error);
  }

  return new ApiError(messageForErrorCode(ERROR_CODE.UNKNOWN), {
    code: ERROR_CODE.UNKNOWN,
    details: error,
  });
}

/**
 * The message safe to display in the UI. Use this rather than `error.message`
 * on a raw `unknown`, and never surface `error.details`.
 */
export function getUserMessage(error: unknown): string {
  return toApiError(error).message;
}
