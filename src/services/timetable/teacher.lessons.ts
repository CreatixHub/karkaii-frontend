import { listEffectiveTimetable } from './timetable.api';

export interface TeacherLessonRow {
  id: string | number;
  dayOfWeek: number; // 1 (Mon) - 7 (Sun)
  subjectId: string | number | null;
  subjectName: string | null;
  title: string | null;
  source: 'manual' | 'planner';
  className: string;
  sectionName: string;
  timeSlotId: string | number;
  slotName: string;
  startsAt: string; // "09:00:00"
  endsAt: string;
  teacherId: string | number;
  classroomCode: string | null;
  classroomCodes: string[];
}

/** Active lessons in effect at the school today. Needs the timetable.view permission. */
export function listTeacherLessons(teacherId: string | number, academicYearId: string | number) {
  return listEffectiveTimetable<TeacherLessonRow>({ teacherId, academicYearId });
}