/**
 * The one place that knows how the backend (server/) speaks.
 *
 * The frontend's generic types (`QueryParams`, `PaginatedResponse`) use friendly names; the Express API uses
 * its own: `limit` not `pageSize`, `q` not `search`, `sort=-field` not `sortBy`+`sortOrder`, and
 * `meta.pages` not `pagination.totalPages`. Everything that crosses that boundary goes through here, so a
 * change to either side is a one-file edit and no page ever builds a query string by hand.
 */

import type { Envelope } from './client';
import type { PaginatedResponse, Pagination, QueryParams } from '@/types/api.types';

/** Query-string keys with special meaning to the backend's list endpoints (see server/src/utils/apiFeatures.js). */
export interface BackendListQuery {
  page?: number;
  limit?: number;
  q?: string;
  sort?: string;
  /** `only` = the trash, `include` = live + trash. Honoured only for users allowed to restore. */
  deleted?: 'only' | 'include';
  [filter: string]: unknown;
}

/** The backend caps `limit` at 200. */
export const MAX_PAGE_SIZE = 200;

/**
 * QueryParams -> backend query string params. Filters pass through as `field=value`
 * (an array or comma list becomes an IN; `field_gte` / `_lte` / `_gt` / `_lt` / `_ne` are range operators).
 */
export function toBackendQuery(params?: QueryParams, extra?: Partial<BackendListQuery>): BackendListQuery {
  const query: BackendListQuery = {};
  if (params?.page) query.page = params.page;
  if (params?.pageSize) query.limit = Math.min(params.pageSize, MAX_PAGE_SIZE);
  if (params?.search) query.q = params.search.trim();
  if (params?.sortBy) query.sort = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;
  if (params?.filters) {
    for (const [key, value] of Object.entries(params.filters)) {
      if (value !== undefined && value !== null && value !== '') query[key] = value;
    }
  }
  return { ...query, ...extra };
}

interface BackendMeta {
  page?: number;
  limit?: number;
  total?: number;
  pages?: number;
}

/** Backend list envelope -> the frontend's `PaginatedResponse`. */
export function toPaginated<T>(envelope: Envelope<T[]>, fallbackPageSize = 10): PaginatedResponse<T> {
  const meta = (envelope.meta ?? {}) as BackendMeta;
  const rows = envelope.data ?? [];
  const pagination: Pagination = {
    page: meta.page ?? 1,
    pageSize: meta.limit ?? fallbackPageSize,
    total: meta.total ?? rows.length,
    totalPages: meta.pages ?? 1,
  };
  return { data: rows, pagination };
}
