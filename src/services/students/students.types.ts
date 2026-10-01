/**
 * The Student domain contract.
 *
 * This is API-shaped, not UI-shaped: camelCase fields, ISO dates, a real `id`,
 * and normalized enum values. It is deliberately different from the legacy
 * `core/data/json/studentList.tsx` structure (`AdmissionNo`, `"25 Mar 2024"`,
 * `imgSrc`), because THIS is the shape the backend will return and therefore
 * the shape new UI should be written against.
 */

import type { Timestamped } from '@/types/common.types';

export type Gender = 'male' | 'female' | 'other';
export type StudentStatus = 'active' | 'inactive';

export interface Student extends Partial<Timestamped> {
  id: string;
  admissionNumber: string;
  rollNumber: string;
  firstName: string;
  lastName: string;
  /** Convenience field; backends commonly return this alongside the parts. */
  fullName: string;
  className: string;
  section: string;
  gender: Gender;
  status: StudentStatus;
  /** ISO 8601 date, e.g. "2015-01-10". */
  dateOfBirth: string | null;
  /** ISO 8601 date the student joined. */
  joinedAt: string | null;
  /** Absolute or app-relative avatar path; null when unset. */
  avatarUrl: string | null;
}

/** Body sent to `POST /students`. Server-generated fields are excluded. */
export interface CreateStudentPayload {
  firstName: string;
  lastName: string;
  admissionNumber: string;
  rollNumber: string;
  className: string;
  section: string;
  gender: Gender;
  dateOfBirth: string | null;
  joinedAt?: string | null;
  status?: StudentStatus;
}

/** Body sent to `PATCH /students/:id`. Every field is optional. */
export type UpdateStudentPayload = Partial<CreateStudentPayload>;

/** Filters this collection supports, beyond the generic query params. */
export interface StudentFilters {
  className?: string;
  section?: string;
  gender?: Gender;
  status?: StudentStatus;
}
