import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { apiClient } from '@services/api/client';
import { getStaffAssignments } from '@services/staff/staff.profile';
import { buildProfile } from '../data/teacherProfileLive';
import type { AssignmentLite, LiveProfile, StaffDetail } from '../data/teacherProfileLive';

export type ProfileStatus = 'loading' | 'ready' | 'error' | 'missing';

interface State {
  status: ProfileStatus;
  error: string;
  profile: LiveProfile | null;
}

/** The teacher named by `?id=` in the URL, loaded live from the database. */
export function useTeacherProfile() {
  const [params] = useSearchParams();
  const id = params.get('id');
  const [state, setState] = useState<State>({ status: id ? 'loading' : 'missing', error: '', profile: null });

  useEffect(() => {
    if (!id) {
      setState({ status: 'missing', error: '', profile: null });
      return;
    }
    let cancelled = false;
    setState({ status: 'loading', error: '', profile: null });

    Promise.all([
      apiClient.get<StaffDetail>(`/staff/${id}`),
      getStaffAssignments(id).catch(() => []),
    ])
      .then(([staff, assignments]) => {
        if (cancelled) return;
        setState({
          status: 'ready',
          error: '',
          profile: buildProfile(staff, assignments as unknown as AssignmentLite[]),
        });
      })
      .catch((e: unknown) => {
        if (cancelled) return;
        setState({
          status: 'error',
          error: e instanceof Error ? e.message : 'Could not load this teacher.',
          profile: null,
        });
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  return { id, ...state };
}