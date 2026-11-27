import { apiClient } from '@services/api/client';
import { ApiError } from '@services/api/errors';
import { listClasses } from '@services/admissions/admissions.api';
import type { SubjectType } from '@services/subjects/subjects.api';

export interface TeachingProfilePayload {
  primarySubjectId: string | null;
  additionalSubjectIds: string[];
  maxPeriodsPerWeek: number | null;
}

interface StaffTeachingProfile {
  primarySubjectId?: string | number | null;
  additionalSubjectIds?: (string | number)[];
  maxPeriodsPerWeek?: number | null;
}

/** POST /api/staff body for a teacher. Only fields the backend accepts (it rejects unknown ones). */
export interface CreateTeacherPayload extends Partial<TeachingProfilePayload> {
  employeeNo?: string;
  staffType: 'teaching';
  employmentType: 'full_time' | 'part_time' | 'contract' | 'visiting';
  firstName: string;
  lastName?: string;
  dob?: string; // YYYY-MM-DD
  gender?: string;
  bloodGroup?: string;
  maritalStatus?: string;
  fatherName?: string;
  email?: string;
  phone?: string;
  addressLine1?: string;
  joinedOn: string; // YYYY-MM-DD
  qualification?: string;
  experienceYears?: number;
  nationalId?: string;
  pan?: string;
  epfNo?: string;
  bankAccountName?: string;
  bankAccountNumber?: string;
  bankName?: string;
  bankBranch?: string;
  bankIfsc?: string;
  createLogin: boolean;
  /** Which classes + subjects this teacher takes (saved for every section of the class). Needs academicYearId. */
  academicYearId?: string | number;
  assignments?: { classId: string; subjectId: string }[];
}

export interface CreatedStaff extends StaffTeachingProfile {
  id: string | number;
  employeeNo: string;
  fullName: string | null;
  login?: { username: string; password: string };
}

/** The signed-in teacher's own record. */
export interface MyStaff {
  id: string | number;
  employeeNo: string;
  firstName: string;
  lastName: string | null;
  fullName: string | null;
  email: string | null;
  phone: string | null;
  dob: string | null;
  gender: string | null;
  bloodGroup: string | null;
  qualification: string | null;
  joinedOn: string;
  staffType: string;
  mustChangePassword?: boolean;
}

export interface MySection {
  id: string | number;
  name: string;
  classId: string | number;
  className: string;
  capacity: number;
  shift: string;
  medium: string | null;
}

export interface MyTimetableEntry {
  id: string | number;
  dayOfWeek: number; // 1 (Mon) - 7 (Sun)
  sectionId: string | number;
  sectionName: string;
  className: string;
  subjectId: string | number | null;
  subject: Record<string, unknown> | null;
  title: string | null;
  source: 'manual' | 'planner';
  timeSlot: Record<string, unknown>;
  classroomId: string | number | null;
  classroom?: { code: string | null } | null;
  classroomCodes?: string[];
}

export interface MyHomework {
  id: string | number;
  homeworkCode: string;
  title: string;
  description: string | null;
  homeworkType: string;
  priority: string;
  assignedOn: string;
  dueAt: string;
  maxMarks: string | null;
  status: string;
  sectionId: string | number;
  sectionName: string;
  className: string;
  subject: Record<string, unknown>;
}

/** One "this teacher takes this subject in this section" row. */
export interface MyAssignment {
  id: string | number;
  academicYearId: string | number;
  sectionId: string | number;
  sectionName: string;
  classId: string | number;
  className: string;
  subject: { id?: string | number; name?: string; code?: string } & Record<string, unknown>;
}

// ---- dropdown options for the Add Teacher form ----------------------------------------
export interface SelectOption {
  value: string;
  label: string;
}

interface SubjectRaw {
  id: string | number;
  name: string;
}

const byLabel = (a: SelectOption, b: SelectOption) => a.label.localeCompare(b.label, undefined, { numeric: true });

/** Every class of the school (the same list admission uses). */
export async function listClassOptions(): Promise<SelectOption[]> {
  const classes = await listClasses();
  return classes.map((c) => ({ value: String(c.id), label: c.name })).sort(byLabel);
}

/** Every subject of the school. */
export async function listSubjectOptions(): Promise<SelectOption[]> {
  const subjects = await apiClient.get<SubjectRaw[]>('/subjects', { query: { limit: 100 } });
  return subjects.map((s) => ({ value: String(s.id), label: s.name })).sort(byLabel);
}

// The app replaces most server error text with generic copy; surface the server's own message instead.
function friendly(error: unknown, fallback: string): Error {
  if (error instanceof ApiError && [400, 401, 403, 409, 422, 429].includes(error.status)) {
    const details = error.details as { message?: unknown; errors?: { field?: string; message?: string }[] } | undefined;
    const first = details?.errors?.[0];
    const message =
      (typeof details?.message === 'string' && details.message) ||
      (first?.message ? `${first.field ? first.field + ': ' : ''}${first.message}` : '');
    if (message) return new Error(message);
  }
  return error instanceof Error ? error : new Error(fallback);
}

export async function createTeacher(payload: CreateTeacherPayload): Promise<CreatedStaff> {
  try {
    return await apiClient.post<CreatedStaff>('/staff', payload);
  } catch (error) {
    throw friendly(error, 'Could not add the teacher');
  }
}

export const getMyStaff = (): Promise<MyStaff> => apiClient.get<MyStaff>('/staff/me');
export const getMySections = (): Promise<MySection[]> => apiClient.get<MySection[]>('/staff/me/sections');
export const getMyTimetable = (): Promise<MyTimetableEntry[]> =>
  apiClient.get<MyTimetableEntry[]>('/staff/me/timetable');
export const getMyTimetableSchedule = () => apiClient.getEnvelope<MyTimetableEntry[]>('/staff/me/timetable');
export const getMyHomework = (): Promise<MyHomework[]> => apiClient.get<MyHomework[]>('/staff/me/homework');
export const getMyAssignments = (): Promise<MyAssignment[]> =>
  apiClient.get<MyAssignment[]>('/staff/me/assignments');

// ---- Quick setup: add a subject from the Add Teacher form -------------------------------
export type SubjectKind = SubjectType;

export async function createSubjectQuick(input: { code: string; name: string; subjectType: SubjectKind }) {
  try {
    return await apiClient.post('/subjects', input);
  } catch (error) {
    throw friendly(error, 'Could not add the subject');
  }
}

// ---- Edit Teacher ------------------------------------------------------------------------
/** GET /api/staff/:id. The PAN, national id and bank account number are never returned. */
export interface StaffRecord extends StaffTeachingProfile {
  id: string | number;
  employeeNo: string;
  status: string;
  employmentType: string;
  firstName: string;
  lastName: string | null;
  dob: string | null;
  gender: string | null;
  bloodGroup: string | null;
  maritalStatus: string | null;
  fatherName: string | null;
  email: string | null;
  phone: string | null;
  addressLine1: string | null;
  joinedOn: string | null;
  qualification: string | null;
  experienceYears: string | number | null;
  epfNo: string | null;
  bankAccountName: string | null;
  bankName: string | null;
  bankBranch: string | null;
  bankIfsc: string | null;
  hasNationalId?: boolean;
  hasPan?: boolean;
  hasBankAccount?: boolean;
}

/** PATCH body: only the keys being changed; null clears an optional field. */
export interface UpdateTeacherPayload extends Partial<TeachingProfilePayload> {
  [field: string]: string | number | string[] | null | undefined;
}

export const getStaffRecord = (id: string | number): Promise<StaffRecord> =>
  apiClient.get<StaffRecord>(`/staff/${id}`);

export const listStaffAssignments = (id: string | number, academicYearId?: string | number): Promise<MyAssignment[]> =>
  apiClient.get<MyAssignment[]>(`/staff/${id}/assignments`, { query: { academicYearId } });

export async function updateTeacher(id: string | number, payload: UpdateTeacherPayload): Promise<StaffRecord> {
  try {
    return await apiClient.patch<StaffRecord>(`/staff/${id}`, payload);
  } catch (error) {
    throw friendly(error, 'Could not save the changes');
  }
}

export async function addTeacherAssignments(
  id: string | number,
  academicYearId: string | number,
  assignments: { classId: string; subjectId: string }[],
): Promise<void> {
  try {
    await apiClient.post(`/staff/${id}/assignments`, { academicYearId, assignments });
  } catch (error) {
    throw friendly(error, 'Could not add the classes and subjects');
  }
}

export async function removeTeacherAssignment(
  id: string | number,
  classId: string | number,
  subjectId: string | number,
  academicYearId?: string | number,
): Promise<void> {
  try {
    await apiClient.delete(`/staff/${id}/assignments/${classId}/${subjectId}`, { query: { academicYearId } });
  } catch (error) {
    throw friendly(error, 'Could not remove that class and subject');
  }
}
