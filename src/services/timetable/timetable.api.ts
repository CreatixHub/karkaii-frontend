import { apiClient } from '@services/api/client';
import { ApiError } from '@services/api/errors';

export type Id = string | number;

export interface TimeSlot {
  id: Id;
  name: string;
  sequence: number;
  dayType: string;
  days: number[]; // 1 (Mon) - 7 (Sun)
  startsAt: string; // "09:00:00"
  endsAt: string;
  isBreak: boolean;
  isActive: boolean;
}

export interface SectionRow {
  id: Id;
  name: string;
  classId?: Id;
  className?: string;
}

/** "This teacher takes this subject in this section". */
export interface SectionTeacherRow {
  id: Id;
  sectionId: Id;
  sectionName: string;
  className: string;
  subjectId: Id;
  subjectName: string;
  academicYearId: Id;
  teacherId: Id;
  teacherName: string | null;
}

export interface TimetableEntry {
  id: Id;
  sectionId: Id;
  subjectId: Id | null;
  subjectName: string | null;
  title: string | null;
  source: 'manual' | 'planner';
  teacherId: Id | null;
  teacherName: string | null;
  timeSlotId: Id;
  dayOfWeek: number; // 1 (Mon) - 7 (Sun)
  classroomCode: string | null;
  classroomIds: Id[];
  classroomCodes: string[];
  status: string;
}

// The client may hand back the array itself or an envelope with the array in `data`.
function toList<T>(res: unknown): T[] {
  if (Array.isArray(res)) return res as T[];
  const data = (res as { data?: unknown } | null)?.data;
  return Array.isArray(data) ? (data as T[]) : [];
}

// Surface the server's own message (the app otherwise replaces most error text with generic copy).
function friendly(error: unknown, fallback: string): Error {
  if (error instanceof ApiError && [400, 401, 403, 409, 422, 429].includes(error.status)) {
    const details = error.details as { message?: unknown; errors?: { field?: string; message?: string }[] } | undefined;
    const first = details?.errors?.[0];
    const message =
      (typeof details?.message === 'string' && details.message) ||
      (first?.message ? `${first.field ? first.field + ': ' : ''}${first.message}` : '');
    if (message) return new Error(message);
    if (error.status === 403) return new Error('You do not have permission to do that.');
  }
  return error instanceof Error ? error : new Error(fallback);
}

export async function listTimeSlots(): Promise<TimeSlot[]> {
  return toList<TimeSlot>(await apiClient.get<unknown>('/time-slots'));
}

export async function createTimeSlot(input: {
  name: string;
  sequence: number;
  startsAt: string; // HH:MM
  endsAt: string;
  isBreak: boolean;
}): Promise<void> {
  try {
    await apiClient.post('/time-slots', input);
  } catch (error) {
    throw friendly(error, 'Could not create the period');
  }
}

export async function listAllSections(): Promise<SectionRow[]> {
  return toList<SectionRow>(await apiClient.get<unknown>('/sections', { query: { limit: 100 } }));
}

export async function listSectionTeachers(sectionId: Id, academicYearId: Id): Promise<SectionTeacherRow[]> {
  return toList<SectionTeacherRow>(
    await apiClient.get<unknown>('/section-teachers', {
      query: { sectionId: String(sectionId), academicYearId: String(academicYearId), limit: 100 },
    }),
  );
}

export async function listEntries(sectionId: Id, academicYearId: Id) {
  const schedule = await listEffectiveTimetable<TimetableEntry>({ sectionId, academicYearId });
  return { entries: schedule.entries, today: schedule.today, plannerManaged: schedule.plannerManaged };
}

export async function listEffectiveTimetable<T>(query: { sectionId?: Id; teacherId?: Id; academicYearId: Id }) {
  const filters = {
    ...query,
    status: 'active',
    onDate: 'today',
    limit: 500,
  };
  const { data, meta } = await apiClient.getEnvelope<T[]>('/timetable', { query: filters });
  const today = typeof meta?.today === 'string' ? meta.today : null;
  const pages = typeof meta?.pages === 'number' ? meta.pages : 1;
  const entries = [...data];
  for (let page = 2; page <= pages; page++) {
    const next = await apiClient.get<T[]>('/timetable', { query: { ...filters, onDate: today ?? 'today', page } });
    entries.push(...next);
  }
  return { entries, today, plannerManaged: meta?.plannerManaged === true };
}

export function schoolWeekday(isoDate: string | null): number | null {
  if (!isoDate) return null;
  const day = new Date(isoDate + 'T00:00:00Z').getUTCDay();
  return Number.isNaN(day) ? null : day || 7;
}

export async function createEntry(input: {
  sectionId: Id;
  subjectId: Id;
  teacherId: Id;
  timeSlotId: Id;
  dayOfWeek: number;
  academicYearId: string | number;
  effectiveFrom: string; // YYYY-MM-DD
}): Promise<void> {
  try {
    await apiClient.post('/timetable', input);
  } catch (error) {
    throw friendly(error, 'Could not add the lesson');
  }
}

export async function deleteEntry(id: Id): Promise<void> {
  try {
    await apiClient.delete(`/timetable/${id}`);
  } catch (error) {
    throw friendly(error, 'Could not remove the lesson');
  }
}