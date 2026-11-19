/**
 * Loads the student grid from `GET /api/students`, one page at a time.
 *
 * `search` is debounced and sent as `q`; `status` is the backend status value
 * (active, inactive, alumni, transferred_out). "Load more" appends the next page.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { apiClient } from '@services/api/client';
import { endpoints } from '@services/api/endpoints';
import { toApiError } from '@services/api/errors';
import type { StudentCard } from '../data/students.data';
import { toStudentCard, withClassName } from '../data/studentMapper';
import { useAdmissionClasses } from './useAdmissionClasses';
import type { ApiStudentRow } from '../data/studentMapper';

// The backend allows at most 100 per page. 24 divides evenly into 2, 3 and 4 card columns.
const PAGE_LIMIT = 24;

export interface UseStudentRosterOptions {
  search: string;
  status?: string;
}

export function useStudentRoster({ search, status }: UseStudentRosterOptions) {
  const [rawItems, setItems] = useState<StudentCard[]>([]);
  const classByStudent = useAdmissionClasses();
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);
  const [debouncedSearch, setDebouncedSearch] = useState(search.trim());

  // Fill in the class from admissions whenever the students API did not send one.
  const items = useMemo(
    () => rawItems.map((student) => withClassName(student, classByStudent[student.id])),
    [rawItems, classByStudent],
  );

  const pageRef = useRef(1);
  const requestRef = useRef(0);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedSearch(search.trim()), 350);
    return () => window.clearTimeout(timer);
  }, [search]);

  const fetchPage = useCallback(
    async (page: number, append: boolean) => {
      const requestId = ++requestRef.current;
      setError(null);
      if (append) setLoadingMore(true);
      else setLoading(true);

      try {
        const res = await apiClient.getEnvelope<ApiStudentRow[]>(endpoints.students.list, {
          query: { page, limit: PAGE_LIMIT, q: debouncedSearch || undefined, status },
        });
        if (requestId !== requestRef.current) return;

        const rows = Array.isArray(res.data) ? res.data.map(toStudentCard) : [];
        setItems((current) => (append ? [...current, ...rows] : rows));
        setTotal(Number((res.meta as { total?: number } | undefined)?.total ?? rows.length));
        pageRef.current = page;
      } catch (raw) {
        if (requestId !== requestRef.current) return;
        const apiError = toApiError(raw);
        if (apiError.isCancelled) return;
        setError(apiError.message || 'Could not load students');
      } finally {
        if (requestId === requestRef.current) {
          setLoading(false);
          setLoadingMore(false);
        }
      }
    },
    [debouncedSearch, status],
  );

  // First page again whenever the search, the status or a manual refresh changes.
  useEffect(() => {
    void fetchPage(1, false);
  }, [fetchPage, reloadToken]);

  const loadMore = useCallback(() => {
    void fetchPage(pageRef.current + 1, true);
  }, [fetchPage]);

  const refetch = useCallback(() => setReloadToken((token) => token + 1), []);

  const removeLocal = useCallback((ids: string[]) => {
    setItems((current) => current.filter((student) => !ids.includes(student.id)));
    setTotal((current) => Math.max(0, current - ids.length));
  }, []);

  return {
    students: items,
    total,
    loading,
    loadingMore,
    error,
    hasMore: items.length < total,
    loadMore,
    refetch,
    removeLocal,
  };
}