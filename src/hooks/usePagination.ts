/**
 * Holds list-view query state (page, size, sort, search, filters) and produces
 * a memoized `QueryParams` object ready to hand to a service.
 *
 * The memoization matters: the returned `params` is used as a `useQuery`
 * dependency, so a new object identity on every render would refetch forever.
 */

import { useCallback, useMemo, useState } from 'react';
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from '@constants/app.constants';
import type {
  Pagination,
  QueryParams,
  QueryParamValue,
  SortOrder,
} from '@/types/api.types';

export interface UsePaginationOptions {
  initialPage?: number;
  initialPageSize?: number;
  initialSortBy?: string;
  initialSortOrder?: SortOrder;
  initialSearch?: string;
  initialFilters?: Record<string, QueryParamValue>;
}

export interface UsePaginationResult {
  params: QueryParams;
  page: number;
  pageSize: number;
  search: string;
  sortBy: string | undefined;
  sortOrder: SortOrder;
  filters: Record<string, QueryParamValue>;
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  /** Resets to page 1, since results change shape. */
  setSearch: (search: string) => void;
  /** Toggles direction when the same column is selected again. */
  setSort: (column: string) => void;
  setFilter: (key: string, value: QueryParamValue) => void;
  resetFilters: () => void;
  /** Derives page numbers/labels from a server `Pagination` object. */
  getPageRange: (pagination: Pagination | null | undefined) => number[];
}

export function usePagination(
  options: UsePaginationOptions = {},
): UsePaginationResult {
  const {
    initialPage = DEFAULT_PAGE,
    initialPageSize = DEFAULT_PAGE_SIZE,
    initialSortBy,
    initialSortOrder = 'asc',
    initialSearch = '',
    initialFilters = {},
  } = options;

  const [page, setPageState] = useState(initialPage);
  const [pageSize, setPageSizeState] = useState(initialPageSize);
  const [search, setSearchState] = useState(initialSearch);
  const [sortBy, setSortBy] = useState<string | undefined>(initialSortBy);
  const [sortOrder, setSortOrder] = useState<SortOrder>(initialSortOrder);
  const [filters, setFilters] =
    useState<Record<string, QueryParamValue>>(initialFilters);

  const setPage = useCallback((next: number) => {
    setPageState(Math.max(1, next));
  }, []);

  const setPageSize = useCallback((size: number) => {
    setPageSizeState(size);
    setPageState(1);
  }, []);

  const setSearch = useCallback((next: string) => {
    setSearchState(next);
    setPageState(1);
  }, []);

  const setSort = useCallback((column: string) => {
    setSortBy((currentColumn) => {
      setSortOrder((currentOrder) =>
        currentColumn === column && currentOrder === 'asc' ? 'desc' : 'asc',
      );
      return column;
    });
    setPageState(1);
  }, []);

  const setFilter = useCallback((key: string, value: QueryParamValue) => {
    setFilters((current) => ({ ...current, [key]: value }));
    setPageState(1);
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(initialFilters);
    setSearchState(initialSearch);
    setPageState(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Serialized so the identity only changes when a value actually changes.
  const filtersKey = JSON.stringify(filters);

  const params = useMemo<QueryParams>(
    () => ({
      page,
      pageSize,
      search: search || undefined,
      sortBy,
      sortOrder,
      filters: JSON.parse(filtersKey) as Record<string, QueryParamValue>,
    }),
    [page, pageSize, search, sortBy, sortOrder, filtersKey],
  );

  const getPageRange = useCallback(
    (pagination: Pagination | null | undefined): number[] => {
      if (!pagination || pagination.totalPages < 1) return [];
      return Array.from({ length: pagination.totalPages }, (_, i) => i + 1);
    },
    [],
  );

  return {
    params,
    page,
    pageSize,
    search,
    sortBy,
    sortOrder,
    filters,
    setPage,
    setPageSize,
    setSearch,
    setSort,
    setFilter,
    resetFilters,
    getPageRange,
  };
}
