import { adminDashboardMockData } from '@mocks/dashboard.mock';
import { mockRequest } from '@mocks/mock.utils';
import type { DashboardService } from './dashboard.service';
import type { AdminDashboard } from './dashboard.types';

export const dashboardMockService: DashboardService = {
  async getAdminDashboard(): Promise<AdminDashboard> {
    await mockRequest();
    return adminDashboardMockData;
  },
};
