import { useCallback } from 'react';
import { useQuery } from '@hooks/useQuery';
import { reportsService } from '@services/reports/reports.service';
import type { SchoolStrength } from '@services/reports/reports.types';

export function useSchoolStrength() {
  const fetchStrength = useCallback(
    (signal: AbortSignal) => reportsService.getSchoolStrength(signal),
    [],
  );
  return useQuery<SchoolStrength>(fetchStrength, []);
}
