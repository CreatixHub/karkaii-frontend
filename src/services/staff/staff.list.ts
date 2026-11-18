import { apiClient } from '@services/api/client';

export interface StaffListItem {
  id: string | number;
  employeeNo: string;
  firstName: string;
  lastName: string | null;
  fullName: string;
  email: string | null;
  phone: string | null;
  status: string;
  employmentType: string;
  joinedOn: string | null;
  qualification: string | null;
  experienceYears: number | string | null;
  addressLine1: string | null;
  teaching: {
    classes: string[];
    sections: string[];
    subjects: string[];
  };
}

const EMPTY_TEACHING = { classes: [], sections: [], subjects: [] };

/** The school's teachers, from GET /api/staff?staffType=teaching. */
export async function listTeachers(): Promise<StaffListItem[]> {
  const res = (await apiClient.get('/staff', {
    query: { staffType: 'teaching', limit: 100 },
  })) as unknown;

  // The client may hand back the array itself or an envelope with the array in `data`.
  const rows: StaffListItem[] = Array.isArray(res)
    ? (res as StaffListItem[])
    : Array.isArray((res as { data?: unknown })?.data)
      ? ((res as { data: StaffListItem[] }).data)
      : [];

  return rows.map((row) => ({
    ...row,
    teaching: { ...EMPTY_TEACHING, ...(row.teaching ?? {}) },
  }));
}

/** Removes one teacher on the server. */
export async function deleteTeacher(id: string | number): Promise<void> {
  await apiClient.delete(`/staff/${id}`);
}