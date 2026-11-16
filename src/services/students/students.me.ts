import { apiClient } from '@services/api/client';

/** GET /api/students/me - the signed-in student's own record (and nobody else's). */
export interface MyStudent {
  id: string | number;
  admissionNo: string;
  firstName: string;
  lastName: string;
  fullName: string | null;
  dob: string;
  gender: string | null;
  bloodGroup: string | null;
  status: string;
  houseName: string | null;
  houseColor: string | null;
  guardians: { fullName: string; relation: string; isPrimary: boolean }[];
}

export function getMyStudent(): Promise<MyStudent> {
  return apiClient.get<MyStudent>('/students/me');
}