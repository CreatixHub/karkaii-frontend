/**
 * Live student totals per status, taken from `GET /api/students` itself
 * (one tiny request per status; the total is in `meta.total`).
 * It only needs the students permission, so it works wherever the grid works.
 */

import { useCallback, useEffect, useState } from 'react';
import { apiClient } from '@services/api/client';
import { endpoints } from '@services/api/endpoints';

const STATUSES = ['active', 'inactive', 'alumni', 'transferred_out', 'expelled'];

export function useStudentCounts() {
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [token, setToken] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      const entries = await Promise.all(
        STATUSES.map(async (status) => {
          try {
            const res = await apiClient.getEnvelope<unknown[]>(endpoints.students.list, {
              query: { page: 1, limit: 1, status },
            });
            const total = Number((res.meta as { total?: number } | undefined)?.total ?? 0);
            return [status, total] as const;
          } catch {
            return [status, 0] as const;
          }
        }),
      );
      if (!cancelled) setCounts(Object.fromEntries(entries));
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, [token]);

  const refetch = useCallback(() => setToken((current) => current + 1), []);

  return { counts, refetch };
}