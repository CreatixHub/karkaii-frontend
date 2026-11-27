import { apiClient } from '@services/api/client';
import { ApiError } from '@services/api/errors';

export const SUBJECT_TYPES = [
  { value: 'core', label: 'Core' },
  { value: 'language', label: 'Language' },
  { value: 'elective', label: 'Elective' },
  { value: 'co_curricular', label: 'Co-curricular' },
  { value: 'practical', label: 'Practicals' },
] as const;

export type SubjectType = (typeof SUBJECT_TYPES)[number]['value'];
export type SubjectStatus = 'active' | 'inactive';

export interface SubjectRecord {
  id: string | number;
  code: string;
  name: string;
  subjectType: SubjectType;
  credits: string | number | null;
  status: SubjectStatus;
}

export interface ClassRecord {
  id: string | number;
  name: string;
  code?: string;
  gradeLevel?: number;
  status?: string;
}

/** One "this class teaches this subject" row (GET /classes/:id/subjects). */
export interface ClassSubjectRow {
  subjectId: string | number;
  code: string;
  name: string;
  isElective: boolean;
  periodsPerWeek: number | null;
  displayOrder: number;
  examMarks: string | number;
  internalMarks: string | number;
  passMarks: string | number | null;
}

export interface ClassSubjectInput {
  subjectId: string;
  isElective: boolean;
  periodsPerWeek: number | null;
  displayOrder: number;
  examMarks: number;
  internalMarks: number;
  passMarks: number | null;
}

export interface SubjectPayload {
  code: string;
  name: string;
  subjectType: SubjectType;
  credits: number | null;
  status: SubjectStatus;
}

// Surface the server's own message instead of generic copy.
function friendly(error: unknown, fallback: string): Error {
  if (error instanceof ApiError && [400, 401, 403, 404, 409, 422, 429].includes(error.status)) {
    const details = error.details as { message?: unknown; errors?: { field?: string; message?: string }[] } | undefined;
    const first = details?.errors?.[0];
    const message =
      (typeof details?.message === 'string' && details.message) ||
      (first?.message ? `${first.field ? first.field + ': ' : ''}${first.message}` : '');
    if (message) return new Error(message);
  }
  return error instanceof Error ? error : new Error(fallback);
}

function toList<T>(res: unknown): T[] {
  if (Array.isArray(res)) return res as T[];
  const data = (res as { data?: unknown } | null)?.data;
  return Array.isArray(data) ? (data as T[]) : [];
}

export async function listAllSubjects(): Promise<SubjectRecord[]> {
  return toList<SubjectRecord>(await apiClient.get<unknown>('/subjects', { query: { limit: 100 } }));
}

export async function listAllClasses(): Promise<ClassRecord[]> {
  return toList<ClassRecord>(await apiClient.get<unknown>('/classes', { query: { limit: 100 } }));
}

export async function listClassSubjects(classId: string | number): Promise<ClassSubjectRow[]> {
  return toList<ClassSubjectRow>(await apiClient.get<unknown>(`/classes/${classId}/subjects`));
}

export async function setClassSubjects(classId: string | number, subjects: ClassSubjectInput[]): Promise<void> {
  try {
    await apiClient.put(`/classes/${classId}/subjects`, { subjects });
  } catch (error) {
    throw friendly(error, 'Could not save the class subjects');
  }
}

export async function createSubject(payload: SubjectPayload): Promise<void> {
  try {
    await apiClient.post('/subjects', payload);
  } catch (error) {
    throw friendly(error, 'Could not add the subject');
  }
}

export async function updateSubject(id: string | number, payload: SubjectPayload): Promise<void> {
  try {
    await apiClient.patch(`/subjects/${id}`, payload);
  } catch (error) {
    throw friendly(error, 'Could not save the subject');
  }
}

export async function deleteSubject(id: string | number): Promise<void> {
  try {
    await apiClient.delete(`/subjects/${id}`);
  } catch (error) {
    throw friendly(error, 'Could not delete the subject');
  }
}