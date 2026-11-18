import { apiClient } from '@services/api/client';

export interface TeacherLessonRow {
  id: string | number;
  dayOfWeek: number; // 1 (Mon) - 7 (Sun)
  subjectName: string;
  className: string;
  sectionName: string;
  slotName: string;
  startsAt: string; // "09:00:00"
  endsAt: string;
  teacherId: string | number;
}

function toList<T>(res: unknown): T[] {
  if (Array.isArray(res)) return res as T[];
  const data = (res as { data?: unknown } | null)?.data;
  return Array.isArray(data) ? (data as T[]) : [];
}

/** Every active lesson of one teacher (admin view). Needs the timetable.view permission. */
export async function listTeacherLessons(
  teacherId: string | number,
  academicYearId: string | number,
): Promise<TeacherLessonRow[]> {
  return toList<TeacherLessonRow>(
    await apiClient.get<unknown>('/timetable', {
      query: {
        teacherId: String(teacherId),
        academicYearId: String(academicYearId),
        status: 'active',
        limit: 500,
      },
    }),
  );
}