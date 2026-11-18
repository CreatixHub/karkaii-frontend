import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getStaffAssignments, getStaffTimetable } from '@services/staff/staff.profile';
import type { StaffAssignment, StaffTimetableEntry } from '@services/staff/staff.profile';
import type { RoutineDay, RoutineSlot, RoutineStatCard } from '../data/teacherRoutine.data';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const TIME_RE = /^\d{1,2}:\d{2}/;

/** First string value whose key passes `test` (the time-slot / room columns are read by name pattern). */
const pick = (
  obj: Record<string, unknown> | null | undefined,
  test: (key: string, value: string) => boolean,
): string => {
  if (!obj) return '';
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string' && test(key.toLowerCase(), value)) return value;
  }
  return '';
};

const to12h = (value: string): string => {
  const match = /^(\d{1,2}):(\d{2})/.exec(value);
  if (!match) return value;
  const hour = Number(match[1]);
  return `${hour % 12 || 12}:${match[2]} ${hour >= 12 ? 'PM' : 'AM'}`;
};

const timeLabel = (slot: Record<string, unknown>): string => {
  const start = pick(slot, (k, v) => k.includes('start') && TIME_RE.test(v));
  const end = pick(slot, (k, v) => k.includes('end') && TIME_RE.test(v));
  if (start && end) return `${to12h(start)} - ${to12h(end)}`;
  return pick(slot, (k) => k === 'name' || k === 'label') || 'Period';
};

const roomLabel = (entry: StaffTimetableEntry): string => {
  const name = pick(entry.classroom, (k) =>
    ['roomnumber', 'roomno', 'room_no', 'number', 'name', 'code', 'label'].includes(k),
  );
  if (name) return `Room No:${name}`;
  return entry.classroomId ? `Room No:${entry.classroomId}` : 'No room set';
};

const percent = (value: number, outOf: number) => `${Math.min(100, Math.round((value / outOf) * 100))}%`;

function buildWeek(entries: StaffTimetableEntry[]): RoutineDay[] {
  const maxDay = entries.some((e) => e.dayOfWeek === 7) ? 7 : 6;
  return DAYS.slice(0, maxDay).map((label, index) => {
    const slots: RoutineSlot[] = entries
      .filter((e) => e.dayOfWeek === index + 1)
      .map((e) => ({
        id: String(e.id),
        room: roomLabel(e),
        classSection: `${e.className}, ${e.sectionName}`,
        subject: String(e.subject?.name ?? ''),
        time: timeLabel(e.timeSlot),
      }));
    return { id: label.toLowerCase(), label, headingLevel: index === 0 ? 'h5' : 'h6', slots };
  });
}

function buildStats(entries: StaffTimetableEntry[], assignments: StaffAssignment[]): RoutineStatCard[] {
  const subjects = new Set<string>([
    ...assignments.map((a) => String(a.subject.id)),
    ...entries.map((e) => String(e.subject?.id ?? '')),
  ]);
  subjects.delete('');
  const sections = new Set<string>([
    ...assignments.map((a) => String(a.sectionId)),
    ...entries.map((e) => String(e.sectionId)),
  ]);
  const rooms = new Set(entries.map((e) => e.classroomId).filter((v) => v !== null).map(String));

  return [
    { id: 'periods', initials: ['T', 'C', 'H'], icon: 'ti ti-calendar-event', variant: 'stats-primary',
      value: String(entries.length), label: 'Total Periods / Week', barWidth: percent(entries.length, 40) },
    { id: 'subjects', initials: ['S', 'U', 'B'], icon: 'ti ti-book', variant: 'stats-success',
      value: String(subjects.size), label: 'Subjects Taught', barWidth: percent(subjects.size, 8) },
    { id: 'classes', initials: ['C', 'L', 'S'], icon: 'ti ti-users', variant: 'stats-warning',
      value: String(sections.size), label: 'Classes Assigned', barWidth: percent(sections.size, 10) },
    { id: 'rooms', initials: ['R', 'O', 'M'], icon: 'ti ti-door', variant: 'stats-info',
      value: String(rooms.size), label: 'Rooms Used', barWidth: percent(rooms.size, 10) },
  ];
}

export interface TeacherRoutineData {
  /** The teacher id from `?id=`; null when the page was opened without one (sample data is shown). */
  id: string | null;
  loading: boolean;
  error: string;
  week: RoutineDay[] | null;
  stats: RoutineStatCard[] | null;
  assignments: StaffAssignment[];
}

export function useTeacherRoutine(): TeacherRoutineData {
  const [params] = useSearchParams();
  const id = params.get('id');

  const [state, setState] = useState<Omit<TeacherRoutineData, 'id'>>({
    loading: Boolean(id),
    error: '',
    week: null,
    stats: null,
    assignments: [],
  });

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setState((s) => ({ ...s, loading: true, error: '' }));
    Promise.all([getStaffTimetable(id), getStaffAssignments(id)])
      .then(([entries, assignments]) => {
        if (cancelled) return;
        setState({
          loading: false,
          error: '',
          week: buildWeek(entries),
          stats: buildStats(entries, assignments),
          assignments,
        });
      })
      .catch(() => {
        if (!cancelled) setState((s) => ({ ...s, loading: false, error: 'Could not load this teacher.' }));
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  return { id, ...state };
}