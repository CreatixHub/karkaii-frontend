/**
 * Feature hook: admin dashboard aggregate.
 *
 * The whole dashboard is one read, so a rebuilt page gets a single
 * loading/error/retry surface instead of a dozen independent ones.
 */

import { useCallback } from 'react';
import { useQuery } from '@hooks/useQuery';
import { dashboardService } from '@services/dashboard/dashboard.service';
import type { AdminDashboard } from '@services/dashboard/dashboard.types';
import type { QueryResult } from '@/types/common.types';

export function useDashboard(): QueryResult<AdminDashboard> {
  const fetchDashboard = useCallback(
    (signal: AbortSignal) => dashboardService.getAdminDashboard(signal),
    [],
  );

  return useQuery<AdminDashboard>(fetchDashboard, []);
}
