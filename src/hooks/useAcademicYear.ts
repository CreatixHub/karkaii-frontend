/**
 * The school's current academic year id, for pages that load or save year-scoped data.
 *
 * Wait for `yearId` before sending any request that needs it; `loading` is true until it is known and `error`
 * holds a message if it could not be loaded. The year is fetched once per session (see `years.api.ts`).
 */

import { useEffect, useState } from 'react';
import { env } from '@config/env';
import { getCurrentAcademicYearId } from '@services/academic/years.api';
import { useAuth } from './useAuth';

export interface UseAcademicYearResult {
  yearId: string | null;
  loading: boolean;
  error: string;
}

export function useAcademicYear(): UseAcademicYearResult {
  const { status } = useAuth();
  // Without a session the request would only be refused; wait until the user is signed in.
  const enabled = env.useMockApi || !env.authEnabled || status === 'authenticated';
  const [yearId, setYearId] = useState<string | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!enabled) return;
    let active = true;
    getCurrentAcademicYearId().then(
      (id) => {
        if (active) {
          setError('');
          setYearId(id);
        }
      },
      (e: unknown) => {
        if (active) setError(e instanceof Error ? e.message : 'Could not load the academic year.');
      },
    );
    return () => {
      active = false;
    };
  }, [enabled]);

  return { yearId, loading: yearId === null && error === '', error };
}
