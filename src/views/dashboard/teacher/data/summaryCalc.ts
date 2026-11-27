import type { MyHomework, MyStaff, MyTimetableEntry } from '@services/staff/staff.api';
import type { Lesson } from './teacherDashboard.data';

const toMinutes = (value: unknown): number | null => {
  if (typeof value !== 'string') return null;
  const m = /^(\d{1,2}):(\d{2})/.exec(value.trim());
  return m ? Number(m[1]) * 60 + Number(m[2]) : null;
};

const pick = (obj: Record<string, unknown>, keys: string[]): unknown => {
  for (const k of keys) if (obj[k] !== undefined && obj[k] !== null) return obj[k];
  return undefined;
};

/** Start and end of a period, in minutes after midnight (null when the time slot has no readable times). */
export function slotTimes(slot: Record<string, unknown>): { start: number; end: number } | null {
  const start = toMinutes(pick(slot, ['startsAt', 'starts_at', 'startTime', 'start_time', 'start', 'from']));
  const end = toMinutes(pick(slot, ['endsAt', 'ends_at', 'endTime', 'end_time', 'end', 'to']));
  return start !== null && end !== null && end > start ? { start, end } : null;
}

/** The entries of today (the timetable uses 1 = Monday ... 7 = Sunday). */
export function todaysEntries(timetable: MyTimetableEntry[], now: Date): MyTimetableEntry[] {
  const day = now.getDay() === 0 ? 7 : now.getDay();
  return timetable.filter((e) => e.dayOfWeek === day);
}

export interface TodayTotals {
  periods: number;
  upcoming: number;
  /** null when no period of today has readable times */
  minutes: number | null;
}

export function todayTotals(timetable: MyTimetableEntry[], now: Date): TodayTotals {
  const today = todaysEntries(timetable, now);
  const nowMin = now.getHours() * 60 + now.getMinutes();
  let minutes = 0;
  let timed = 0;
  let upcoming = 0;
  for (const entry of today) {
    const t = slotTimes(entry.timeSlot);
    if (!t) continue;
    timed += 1;
    minutes += t.end - t.start;
    if (t.start > nowMin) upcoming += 1;
  }
  return { periods: today.length, upcoming: timed > 0 ? upcoming : 0, minutes: timed > 0 ? minutes : null };
}

/** 320 -> "5h 20m" */
export function formatDuration(minutes: number | null): string {
  if (minutes === null) return '—';
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? (m > 0 ? `${h}h ${m}m` : `${h}h`) : `${m}m`;
}

/** Assignments whose due date has not passed yet. */
export function pendingAssignments(homework: MyHomework[], now: Date): number {
  return homework.filter((h) => new Date(h.dueAt).getTime() >= now.getTime()).length;
}

/** How much of the teacher's own record is filled in (0-100). */
export function profileCompletion(staff: MyStaff | null): number {
  if (!staff) return 0;
  const fields = [staff.phone, staff.email, staff.dob, staff.gender, staff.bloodGroup, staff.qualification];
  const filled = fields.filter((v) => v !== null && v !== undefined && String(v).trim() !== '').length;
  return Math.round((filled / fields.length) * 100);
}

export function initials(name: string): string {
  return (
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? '')
      .join('') || '?'
  );
}

const hhmm = (minutes: number) =>
  `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`;

/**
 * Today's real lessons, in time order, as the cards of "Today's Timetable".
 * Status: Done (finished), Live (running now), Next (the first one still to come), otherwise its start time.
 */
export function buildTodaysLessons(timetable: MyTimetableEntry[], now: Date): Lesson[] {
  const nowMin = now.getHours() * 60 + now.getMinutes();

  const rows = todaysEntries(timetable, now)
    .map((entry) => ({ entry, times: slotTimes(entry.timeSlot) }))
    .sort((a, b) => (a.times?.start ?? 0) - (b.times?.start ?? 0));

  let nextTaken = false;

  return rows.map(({ entry, times }) => {
    const subjectName =
      (pick(entry.subject ?? {}, ['name', 'subjectName', 'code']) as string | undefined) ?? entry.title ?? 'Lesson';
    const grade = [entry.className, entry.sectionName].filter(Boolean).join(' - ') || '—';

    const lesson: Lesson = {
      id: String(entry.id),
      time: times ? hhmm(times.start) : '—',
      duration: times ? `${times.end - times.start} min` : '',
      subject: subjectName,
      borderClass: 'border-info',
      grade,
      // Rooms and class sizes are not stored yet.
      room: '—',
      students: '—',
      status: { label: 'Scheduled', className: 'badge badge-soft-warning', icon: 'ti ti-clock' },
    };

    if (!times) return lesson;

    if (times.end <= nowMin) {
      lesson.borderClass = 'border-success';
      lesson.status = { label: 'Done', className: 'badge badge-soft-secondary', icon: 'ti ti-check' };
      lesson.attendanceModal = 'quickAttendance';
    } else if (times.start <= nowMin) {
      lesson.borderClass = 'border-danger';
      lesson.status = { label: 'Live', className: 'badge badge-danger' };
      lesson.startButton = { className: 'action-button-success' };
    } else if (!nextTaken) {
      nextTaken = true;
      lesson.borderClass = 'border-warning';
      lesson.status = { label: 'Next', className: 'badge badge-soft-warning', icon: 'ti ti-clock' };
      lesson.startButton = { className: '' };
    } else {
      lesson.status = { label: hhmm(times.start), className: 'badge badge-soft-warning', icon: 'ti ti-clock' };
    }
    return lesson;
  });
}