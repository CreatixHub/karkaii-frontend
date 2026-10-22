import { apiClient } from '@services/api/client';
import { endpoints } from '@services/api/endpoints';
import type { DashboardService } from './dashboard.service';
import type { AdminDashboard } from './dashboard.types';

export const dashboardHttpService: DashboardService = {
  getAdminDashboard(signal?: AbortSignal) {
    return apiClient.get<AdminDashboard>(endpoints.dashboard.admin, { signal });
  },
};
