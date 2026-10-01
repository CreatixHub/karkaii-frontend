/**
 * Transport-level types shared by every service and hook.
 *
 * These describe the *envelope* the backend is expected to speak. Keeping them
 * in one place means a change to the API contract is a single-file edit rather
 * than a sweep across every feature.
 */

/** Standard success envelope for a single resource. */
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

/** Pagination metadata returned alongside a list response. */
export interface Pagination {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

/** Standard success envelope for a paginated collection. */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: Pagination;
}

export type SortOrder = 'asc' | 'desc';

/** Primitive values acceptable as a filter or query-string parameter. */
export type QueryParamValue = string | number | boolean | null | undefined;

/**
 * Normalized list-query arguments. Services translate these into whatever
 * query-string convention the backend uses, so pages never build URLs.
 */
export interface QueryParams {
  page?: number;
  pageSize?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: SortOrder;
  filters?: Record<string, QueryParamValue>;
}

/** Field-level validation messages returned by a 422 response. */
export type FieldErrors = Record<string, string>;

/**
 * The error payload shape this application expects from the backend.
 * Every field is optional — a failing server may return anything at all.
 */
export interface ApiErrorPayload {
  message?: string;
  code?: string;
  errors?: FieldErrors;
  [key: string]: unknown;
}
