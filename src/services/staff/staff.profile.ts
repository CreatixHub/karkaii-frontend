import { apiClient } from '@services/api/client';

export interface StaffTimetableEntry {
  id: string | number;
  dayOfWeek: number; // 1 (Mon) - 7 (Sun)
  sectionId: string | number;
  sectionName: string;
  className: string;
  subject: Record<string, unknown>;
  timeSlot: Record<string, unknown>;
  classroomId: string | number | null;
  classroom: Record<string, unknown> | null;
}

export interface StaffAssignment {
  id: string | number;
  academicYearId: string | number;
  sectionId: string | number;
  sectionName: string;
  classId: string | number;
  className: string;
  subject: { id: string | number; name: string; code: string | null };
}

/** Admin view of one teacher: needs the staff.view permission. */
export const getStaffTimetable = (id: string): Promise<StaffTimetableEntry[]> =>
  apiClient.get<StaffTimetableEntry[]>(`/staff/${id}/timetable`);

export const getStaffAssignments = (id: string): Promise<StaffAssignment[]> =>
  apiClient.get<StaffAssignment[]>(`/staff/${id}/assignments`);