import { useEffect, useState } from 'react';
import { getMyAssignments, getMyStaff, getMyTimetable } from '@services/staff/staff.api';
import type { MyAssignment, MyStaff, MyTimetableEntry } from '@services/staff/staff.api';

/**
 * loading: still fetching.
 * ready:   this login is a teacher with a staff record; the arrays are that teacher's own data (possibly empty).
 * sample:  no staff record (for example an admin previewing the teacher dashboard) or the request failed.
 */
export type TeachingStatus = 'loading' | 'ready' | 'sample';

export interface MyTeaching {
  status: TeachingStatus;
  me: MyStaff | null;
  timetable: MyTimetableEntry[];
  assignments: MyAssignment[];
}

export function useMyTeaching(): MyTeaching {
  const [state, setState] = useState<MyTeaching>({
    status: 'loading',
    me: null,
    timetable: [],
    assignments: [],
  });

  useEffect(() => {
    let cancelled = false;
    Promise.all([getMyStaff(), getMyTimetable(), getMyAssignments()])
      .then(([me, timetable, assignments]) => {
        if (!cancelled) setState({ status: 'ready', me, timetable, assignments });
      })
      .catch(() => {
        if (!cancelled) setState((s) => ({ ...s, status: 'sample' }));
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}