/**
 * Dashboard service contract.
 *
 * Demonstrates the non-paginated variant of the service pattern: one aggregate
 * read rather than a collection.
 */

import { createService } from '@services/api/create-service';
import { dashboardHttpService } from './dashboard.http';
import { dashboardMockService } from './dashboard.mock';
import type { AdminDashboard } from './dashboard.types';

export interface DashboardService {
  getAdminDashboard(signal?: AbortSignal): Promise<AdminDashboard>;
}

export const dashboardService: DashboardService = createService(
  dashboardMockService,
  dashboardHttpService,
);
