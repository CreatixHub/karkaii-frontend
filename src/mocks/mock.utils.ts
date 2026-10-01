/**
 * Helpers that make mock services behave like a real API.
 *
 * The point is that pages exercise the *same* code paths they will use in
 * production: an awaited promise, a real loading state, server-shaped
 * pagination envelopes, and genuine `ApiError` rejections. That is what makes
 * the eventual switch to HTTP a no-op for the UI.
 */

import { env } from '@config/env';
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from '@constants/app.constants';
import { ERROR_CODE, messageForErrorCode } from '@constants/api.constants';
import { ApiError } from '@services/api/errors';
import type {
  PaginatedResponse,
  Pagination,
  QueryParams,
  QueryParamValue,
} from '@/types/api.types';

/** Simulates network latency so loading states are visible in development. */
export function delay(ms: number = env.mockLatencyMs): Promise<void> {
  if (ms <= 0) return Promise.resolve();
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

/**
 * Randomly fails according to `VITE_MOCK_ERROR_RATE`, so error states can be
 * exercised without a backend. Disabled (rate 0) by default.
 */
export function maybeFail(): void {
  if (env.mockErrorRate <= 0) return;
  if (Math.random() >= env.mockErrorRate) return;

  throw new ApiError(messageForErrorCode(ERROR_CODE.SERVER), {
    status: 500,
    code: ERROR_CODE.SERVER,
    details: { simulated: true },
  });
}

/** Awaits the simulated latency and applies simulated failures. */
export async function mockRequest(): Promise<void> {
  await delay();
  maybeFail();
}

/** Case-insensitive substring match across the given fields. */
export function applySearch<T>(
  items: T[],
  search: string | undefined,
  fields: (keyof T)[],
): T[] {
  if (!search || !search.trim()) return items;

  const needle = search.trim().toLowerCase();
  return items.filter((item) =>
    fields.some((field) => {
      const value = item[field];
      if (value === null || value === undefined) return false;
      return String(value).toLowerCase().includes(needle);
    }),
  );
}

/**
 * Exact-match filtering. Keys map onto entity fields; `undefined`, `null` and
 * empty strings mean "no filter", which mirrors how the query string behaves.
 */
export function applyFilters<T>(
  items: T[],
  filters: Record<string, QueryParamValue> | undefined,
): T[] {
  if (!filters) return items;

  const active = Object.entries(filters).filter(
    ([, value]) => value !== undefined && value !== null && value !== '',
  );
  if (active.length === 0) return items;

  return items.filter((item) =>
    active.every(([key, value]) => {
      const field = (item as Record<string, unknown>)[key];
      return String(field).toLowerCase() === String(value).toLowerCase();
    }),
  );
}

/** Stable sort by a field, comparing numbers numerically and text naturally. */
export function applySort<T>(
  items: T[],
  sortBy: string | undefined,
  sortOrder: 'asc' | 'desc' = 'asc',
): T[] {
  if (!sortBy) return items;

  const direction = sortOrder === 'desc' ? -1 : 1;

  return [...items].sort((a, b) => {
    const left = (a as Record<string, unknown>)[sortBy];
    const right = (b as Record<string, unknown>)[sortBy];

    if (left === right) return 0;
    if (left === null || left === undefined) return 1;
    if (right === null || right === undefined) return -1;

    if (typeof left === 'number' && typeof right === 'number') {
      return (left - right) * direction;
    }

    return (
      String(left).localeCompare(String(right), undefined, { numeric: true }) *
      direction
    );
  });
}

/** Builds the pagination envelope a real API would return. */
export function buildPagination(
  total: number,
  page: number,
  pageSize: number,
): Pagination {
  return {
    page,
    pageSize,
    total,
    totalPages: pageSize > 0 ? Math.ceil(total / pageSize) : 0,
  };
}

/** Slices a page out of an already filtered/sorted collection. */
export function paginate<T>(items: T[], params: QueryParams = {}): PaginatedResponse<T> {
  const page = Math.max(1, params.page ?? DEFAULT_PAGE);
  const pageSize = Math.max(1, params.pageSize ?? DEFAULT_PAGE_SIZE);
  const start = (page - 1) * pageSize;

  return {
    data: items.slice(start, start + pageSize),
    pagination: buildPagination(items.length, page, pageSize),
  };
}

/**
 * The standard mock list pipeline: search -> filter -> sort -> paginate.
 * Mock services call this so every collection behaves consistently.
 */
export function queryCollection<T>(
  items: T[],
  params: QueryParams | undefined,
  searchFields: (keyof T)[],
): PaginatedResponse<T> {
  const searched = applySearch(items, params?.search, searchFields);
  const filtered = applyFilters(searched, params?.filters);
  const sorted = applySort(filtered, params?.sortBy, params?.sortOrder);
  return paginate(sorted, params);
}

/** Generates the next sequential id for a mock collection. */
export function nextId(existingIds: string[], prefix = ''): string {
  const highest = existingIds.reduce((max, id) => {
    const numeric = Number(id.replace(/\D/g, ''));
    return Number.isFinite(numeric) && numeric > max ? numeric : max;
  }, 0);
  return `${prefix}${highest + 1}`;
}
