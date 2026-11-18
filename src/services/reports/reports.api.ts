import { apiClient } from '@services/api/client';

export interface GenderCount {
  male: number;
  female: number;
  other: number;
  unknown: number;
}

export type GenderKey = 'male' | 'female' | 'other' | 'unknown';

export interface ClassStrength extends GenderCount {
  classId: string;
  name: string;
  total: number;
}

export interface FacultyMember {
  id: string;
  employeeNo: string;
  name: string;
  staffType: string;
  employmentType: string;
  gender: GenderKey;
  status: string;
}

export interface StudentMember {
  id: string;
  admissionNo: string;
  name: string;
  gender: GenderKey;
  classId: string | null;
  className: string | null;
}

export interface SchoolStrength {
  generatedAt: string;
  faculty: {
    total: number;
    teaching: number;
    nonTeaching: number;
    byGender: GenderCount;
    teachingByGender: GenderCount;
    nonTeachingByGender: GenderCount;
    byEmploymentType: Record<string, number>;
    byStatus: Record<string, number>;
    list: FacultyMember[];
  };
  students: {
    total: number;
    byGender: GenderCount;
    byStatus: Record<string, number>;
    classes: ClassStrength[];
    unassigned: GenderCount & { total: number };
    list: StudentMember[];
  };
}

export const getSchoolStrength = (): Promise<SchoolStrength> =>
  apiClient.get<SchoolStrength>('/reports/school-strength');