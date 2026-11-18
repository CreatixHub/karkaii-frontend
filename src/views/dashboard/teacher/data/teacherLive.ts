import type { MyAssignment, MyTimetableEntry } from '@services/staff/staff.api';
import type { Lesson } from './teacherDashboard.data';
import { myClasses, todaysLessons } from './teacherDashboard.data';

export type MyClassCard = (typeof myClasses)[number];

const TIME_RE = /^\d{1,2}:\d{2}/;

/** First string value whose key passes `test` (time-slot and room columns are read by name pattern). */
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

const toMinutes = (value: string): number | null => {
  const m = /^(\d{1,2}):(\d{2})/.exec(value);
  return m ? Number(m[1]) * 60 + Number(m[2]) : null;
};

const to12h = (minutes: number): string => {
  const h = Math.floor(minutes / 60);
  const m = String(minutes % 60).padStart(2, '0');
  return `${h % 12 || 12}:${m} ${h >= 12 ? 'PM' : 'AM'}`;
};

const slotTimes = (entry: MyTimetableEntry) => {
  const start = toMinutes(pick(entry.timeSlot, (k, v) => k.includes('start') && TIME_RE.test(v)));
  const end = toMinutes(pick(entry.timeSlot, (k, v) => k.includes('end') && TIME_RE.test(v)));
  return { start, end };
};

const roomOf = (entry: MyTimetableEntry): string => {
  const classroom = (entry as { classroom?: Record<string, unknown> | null }).classroom;
  const name = pick(classroom, (k) =>
    ['roomnumber', 'roomno', 'room_no', 'number', 'name', 'code', 'label'].includes(k),
  );
  if (name) return `Room ${name}`;
  return entry.classroomId ? `Room ${entry.classroomId}` : 'No room set';
};

// Style templates are borrowed from the sample lessons so the cards keep their look.
const findTemplate = (needles: string[]): Lesson =>
  todaysLessons.find((l) => needles.some((n) => l.status.label.toLowerCase().includes(n))) ?? todaysLessons[0];

/** Today's periods for the signed-in teacher, earliest first. */
export function buildLessons(timetable: MyTimetableEntry[], now: Date = new Date()): Lesson[] {
  const today = now.getDay() === 0 ? 7 : now.getDay();
  const nowMin = now.getHours() * 60 + now.getMinutes();

  const done = findTemplate(['complete', 'done', 'finished']);
  const live = findTemplate(['live', 'now', 'progress', 'ongoing']);
  const next = findTemplate(['upcoming', 'next', 'later', 'scheduled']);

  return timetable
    .filter((e) => e.dayOfWeek === today)
    .map((e) => ({ e, ...slotTimes(e) }))
    .sort((a, b) => (a.start ?? 0) - (b.start ?? 0))
    .map(({ e, start, end }) => {
      let template = next;
      if (start !== null && end !== null) {
        if (nowMin >= end) template = done;
        else if (nowMin >= start) template = live;
      }
      return {
        ...template,
        id: String(e.id),
        time: start !== null ? to12h(start) : String(pick(e.timeSlot, (k) => k === 'name' || k === 'label') || 'Period'),
        duration: start !== null && end !== null ? `${end - start} min` : '',
        subject: String(e.subject?.name ?? ''),
        grade: `${e.className} - ${e.sectionName}`,
        room: roomOf(e),
        students: '—',
      };
    });
}

/** One card per "section + subject" the admin mapped to this teacher. */
export function buildClasses(assignments: MyAssignment[], timetable: MyTimetableEntry[]): MyClassCard[] {
  return assignments.map((a, index) => {
    const template = myClasses[index % myClasses.length];
    const periods = timetable.filter(
      (e) => String(e.sectionId) === String(a.sectionId) && String(e.subject?.id) === String(a.subject.id),
    ).length;
    return {
      ...template,
      id: String(a.id),
      grade: `${a.className} - ${a.sectionName}`,
      subject: a.subject.name,
      homeroom: false,
      stats: [
        { value: String(periods), label: 'Periods / Week' },
        { value: a.subject.code ?? '—', label: 'Subject Code' },
      ] as MyClassCard['stats'],
    };
  });
}