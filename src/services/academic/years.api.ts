import { env } from '@config/env';
import { delay } from '@mocks/mock.utils';
import { apiClient } from '@services/api/client';
import { endpoints } from '@services/api/endpoints';

export interface AcademicYear {
  id: string;
  name: string;
  startsOn: string; // YYYY-MM-DD
  endsOn: string; // YYYY-MM-DD
  isCurrent: boolean;
}

/** What `VITE_USE_MOCK_API=true` answers with, so pages that need a year still work without a backend. */
const MOCK_CURRENT_YEAR: AcademicYear = {
  id: '1',
  name: '2026-27',
  startsOn: '2026-06-01',
  endsOn: '2027-03-31',
  isCurrent: true,
};

/** The school's current academic year (any signed-in member may read it). */
export async function getCurrentAcademicYear(): Promise<AcademicYear> {
  if (env.useMockApi) {
    await delay();
    return MOCK_CURRENT_YEAR;
  }
  const year = await apiClient.get<AcademicYear>(endpoints.academicYears.current);
  return { ...year, id: String(year.id) };
}

// One request is shared by every caller (in flight or finished). A failed request is forgotten so the next call
// can retry. `generation` changes on every reset, so an answer that arrives after a sign-out never refills the cache.
let currentYearIdPromise: Promise<string> | null = null;
let generation = 0;

/** The current academic year's id, fetched once and then served from memory. */
export function getCurrentAcademicYearId(): Promise<string> {
  if (!currentYearIdPromise) {
    const startedIn = generation;
    const request = getCurrentAcademicYear().then((year) => year.id);
    currentYearIdPromise = request;
    request.catch(() => {
      if (generation === startedIn && currentYearIdPromise === request) currentYearIdPromise = null;
    });
  }
  return currentYearIdPromise;
}

/** Forgets the cached year (and ignores any request still in flight). Call on sign-out and sign-in. */
export function resetAcademicYearCache(): void {
  generation += 1;
  currentYearIdPromise = null;
}
