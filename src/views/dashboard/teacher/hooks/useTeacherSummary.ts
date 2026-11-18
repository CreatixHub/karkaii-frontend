import { useEffect, useState } from 'react';
import { getMyHomework, getMyStaff, getMyTimetable } from '@services/staff/staff.api';
import type { MyHomework, MyStaff, MyTimetableEntry } from '@services/staff/staff.api';

export interface TeacherSummary {
  status: 'loading' | 'ready' | 'error';
  staff: MyStaff | null;
  /** null = could not be loaded (shown as "—", never as 0) */
  timetable: MyTimetableEntry[] | null;
  homework: MyHomework[] | null;
}

type Loaded = Omit<TeacherSummary, 'status'>;

// The hero and the KPI cards mount together: share one request. The short expiry keeps a
// different teacher signing in on the same tab from ever seeing the previous teacher's data.
let shared: Promise<Loaded> | null = null;

function load(): Promise<Loaded> {
  if (!shared) {
    shared = Promise.all([
      getMyStaff(),
      getMyTimetable().catch(() => null),
      getMyHomework().catch(() => null),
    ]).then(([staff, timetable, homework]) => ({ staff, timetable, homework }));
    shared.catch(() => {
      shared = null;
    });
    window.setTimeout(() => {
      shared = null;
    }, 3000);
  }
  return shared;
}

/** The signed-in teacher's own record, timetable and homework (live from the database). */
export function useTeacherSummary(): TeacherSummary {
  const [state, setState] = useState<TeacherSummary>({
    status: 'loading',
    staff: null,
    timetable: null,
    homework: null,
  });

  useEffect(() => {
    let cancelled = false;
    load()
      .then((data) => {
        if (!cancelled) setState({ status: 'ready', ...data });
      })
      .catch(() => {
        if (!cancelled) setState({ status: 'error', staff: null, timetable: null, homework: null });
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}