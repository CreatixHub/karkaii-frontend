/**
 * HTTP status codes, error codes and the user-facing copy shown for each.
 *
 * `erasableSyntaxOnly` is enabled in tsconfig, so `enum` is unavailable —
 * `as const` objects with derived union types serve the same purpose.
 */

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
} as const;

/** Stable, machine-readable error codes used across the app. */
export const ERROR_CODE = {
  BAD_REQUEST: 'BAD_REQUEST',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  CONFLICT: 'CONFLICT',
  VALIDATION: 'VALIDATION_ERROR',
  RATE_LIMITED: 'RATE_LIMITED',
  SERVER: 'SERVER_ERROR',
  NETWORK: 'NETWORK_ERROR',
  TIMEOUT: 'TIMEOUT',
  CANCELLED: 'CANCELLED',
  UNKNOWN: 'UNKNOWN_ERROR',
} as const;

export type ErrorCode = (typeof ERROR_CODE)[keyof typeof ERROR_CODE];

/**
 * User-safe messages. These are deliberately generic: raw server text may leak
 * stack traces, table names or internal hostnames, so it is kept in
 * `ApiError.details` for logging and never rendered.
 */
export const ERROR_MESSAGES: Record<ErrorCode, string> = {
  [ERROR_CODE.BAD_REQUEST]:
    'We could not process that request. Please check the details and try again.',
  [ERROR_CODE.UNAUTHORIZED]: 'Your session has expired. Please sign in again.',
  [ERROR_CODE.FORBIDDEN]: 'You do not have permission to perform this action.',
  [ERROR_CODE.NOT_FOUND]: 'We could not find what you were looking for.',
  [ERROR_CODE.CONFLICT]:
    'This conflicts with existing data. Please refresh and try again.',
  [ERROR_CODE.VALIDATION]: 'Please correct the highlighted fields and try again.',
  [ERROR_CODE.RATE_LIMITED]:
    'Too many requests. Please wait a moment and try again.',
  [ERROR_CODE.SERVER]:
    'Something went wrong on our end. Please try again shortly.',
  [ERROR_CODE.NETWORK]:
    'Unable to reach the server. Please check your connection and try again.',
  [ERROR_CODE.TIMEOUT]: 'The request took too long. Please try again.',
  [ERROR_CODE.CANCELLED]: 'The request was cancelled.',
  [ERROR_CODE.UNKNOWN]: 'An unexpected error occurred. Please try again.',
};

/** Maps an HTTP status code onto the application's error code. */
export function errorCodeForStatus(status: number): ErrorCode {
  switch (status) {
    case HTTP_STATUS.BAD_REQUEST:
      return ERROR_CODE.BAD_REQUEST;
    case HTTP_STATUS.UNAUTHORIZED:
      return ERROR_CODE.UNAUTHORIZED;
    case HTTP_STATUS.FORBIDDEN:
      return ERROR_CODE.FORBIDDEN;
    case HTTP_STATUS.NOT_FOUND:
      return ERROR_CODE.NOT_FOUND;
    case HTTP_STATUS.CONFLICT:
      return ERROR_CODE.CONFLICT;
    case HTTP_STATUS.UNPROCESSABLE_ENTITY:
      return ERROR_CODE.VALIDATION;
    case HTTP_STATUS.TOO_MANY_REQUESTS:
      return ERROR_CODE.RATE_LIMITED;
    default:
      return status >= 500 ? ERROR_CODE.SERVER : ERROR_CODE.UNKNOWN;
  }
}

/** The user-safe message for an error code. */
export function messageForErrorCode(code: ErrorCode): string {
  return ERROR_MESSAGES[code] ?? ERROR_MESSAGES[ERROR_CODE.UNKNOWN];
}

/** Header names used by the client. */
export const HEADERS = {
  CONTENT_TYPE: 'Content-Type',
  ACCEPT: 'Accept',
  AUTHORIZATION: 'Authorization',
} as const;

export const CONTENT_TYPE_JSON = 'application/json';
