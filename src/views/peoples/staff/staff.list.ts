import { apiClient } from '@services/api/client';

/** One row of GET /api/staff (a teacher, with what they really teach). */
export interface StaffListItem {
  id: string | number;
  employeeNo: string;
  firstName: string;
  lastName: string | null;
  fullName: string | null;
  email: string | null;
  phone: string | null;
  status: string; // active | on_leave | suspended | left
  employmentType: string;
  joinedOn: string; // YYYY-MM-DD
  qualification: string | null;
  experienceYears: string | number | null;
  addressLine1: string | null;
  teaching: { classes: string[]; sections: string[]; subjects: string[] };
}

/** All teachers of the school (live from the database). */
export const listTeachers = (): Promise<StaffListItem[]> =>
  apiClient.get<StaffListItem[]>('/staff', { query: { staffType: 'teaching', limit: 100 } });

/** Removes a teacher (soft delete on the server: they disappear from every list). */
export const deleteTeacher = (id: string | number): Promise<unknown> => apiClient.delete(`/staff/${id}`);