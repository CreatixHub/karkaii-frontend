import { apiClient } from '@services/api/client';
import { endpoints } from '@services/api/endpoints';
import type { SchoolStrength } from './reports.types';

export const reportsService = {
  async getSchoolStrength(signal?: AbortSignal): Promise<SchoolStrength> {
    const res = await apiClient.get<SchoolStrength | { data: SchoolStrength }>(
      endpoints.reports.schoolStrength,
      { signal },
    );
    return 'data' in res ? res.data : res;
  },
};
