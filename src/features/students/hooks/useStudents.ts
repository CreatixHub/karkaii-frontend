/**
 * Feature hook: paginated, searchable, filterable student list.
 *
 * This is the layer a page talks to. It returns `data / loading / error /
 * refetch` plus list controls, and knows nothing about HTTP or mocks.
 *
 *   Page -> useStudents -> studentsService -> mock (now) | API (later)
 */

import { useCallback } from 'react';
import { useQuery } from '@hooks/useQuery';
import { usePagination } from '@hooks/usePagination';
import { studentsService } from '@services/students/students.service';
import type { Student } from '@services/students/students.types';
import type { PaginatedResponse, QueryParamValue } from '@/types/api.types';
import type { ApiError } from '@services/api/errors';

export interface UseStudentsOptions {
  pageSize?: number;
  initialSearch?: string;
  initialFilters?: Record<string, QueryParamValue>;
  /** Skip fetching until a precondition is met. */
  enabled?: boolean;
}

export interface UseStudentsResult {
  students: Student[];
  pagination: PaginatedResponse<Student>['pagination'] | null;
  loading: boolean;
  error: ApiError | null;
  isEmpty: boolean;
  refetch: () => void;

  page: number;
  pageSize: number;
  search: string;
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  setSearch: (search: string) => void;
  setSort: (column: string) => void;
  setFilter: (key: string, value: QueryParamValue) => void;
  resetFilters: () => void;
}

export function useStudents(options: UseStudentsOptions = {}): UseStudentsResult {
  const { pageSize: initialPageSize, initialSearch, initialFilters, enabled = true } = options;

  const listControls = usePagination({
    initialPageSize,
    initialSearch,
    initialFilters,
  });

  const { params } = listControls;

  const fetchStudents = useCallback(
    (signal: AbortSignal) => studentsService.getStudents(params, signal),
    [params],
  );

  const query = useQuery<PaginatedResponse<Student>>(fetchStudents, [params], {
    enabled,
    // Avoids a full-page spinner on every page change or keystroke.
    keepPreviousData: true,
  });

  return {
    students: query.data?.data ?? [],
    pagination: query.data?.pagination ?? null,
    loading: query.loading,
    error: query.error,
    isEmpty: query.status === 'success' && (query.data?.data.length ?? 0) === 0,
    refetch: query.refetch,

    page: listControls.page,
    pageSize: listControls.pageSize,
    search: listControls.search,
    setPage: listControls.setPage,
    setPageSize: listControls.setPageSize,
    setSearch: listControls.setSearch,
    setSort: listControls.setSort,
    setFilter: listControls.setFilter,
    resetFilters: listControls.resetFilters,
  };
}
