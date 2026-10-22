/**
 * Converts the legacy UI-shaped student records into API-shaped `Student`
 * objects.
 *
 * This adapter exists so the mock dataset is derived from the data the
 * template already ships rather than hand-authored twice. It is also the
 * pattern to follow for every other domain: the *legacy* shape stays untouched
 * for the existing pages, and the *API* shape is what new code consumes.
 *
 * When the real backend arrives this file is simply deleted along with the
 * mock service — nothing else references it.
 */

import { displayDateToIso } from '@utils/date.utils';
import type { Gender, Student, StudentStatus } from '@services/students/students.types';

/** The legacy record shape from `core/data/json/studentList.tsx`. */
export interface LegacyStudentRecord {
  key: string;
  AdmissionNo: string;
  RollNo: string;
  name: string;
  class: string;
  section: string;
  gender: string;
  status: string;
  DateofJoin: string;
  DOB: string;
  imgSrc: string;
  result?: string;
  promotion?: number;
}

function toGender(value: string): Gender {
  const normalized = value.trim().toLowerCase();
  if (normalized === 'male' || normalized === 'female') return normalized;
  return 'other';
}

function toStatus(value: string): StudentStatus {
  return value.trim().toLowerCase() === 'active' ? 'active' : 'inactive';
}

/** Splits "Janet Daniel" into parts; a single token becomes the first name. */
function splitName(fullName: string): { firstName: string; lastName: string } {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) return { firstName: parts[0], lastName: '' };
  return {
    firstName: parts.slice(0, -1).join(' '),
    lastName: parts[parts.length - 1],
  };
}

export function toStudent(record: LegacyStudentRecord): Student {
  const { firstName, lastName } = splitName(record.name);

  return {
    id: String(record.key),
    admissionNumber: record.AdmissionNo,
    rollNumber: record.RollNo,
    firstName,
    lastName,
    fullName: record.name,
    className: record.class,
    section: record.section,
    gender: toGender(record.gender),
    status: toStatus(record.status),
    dateOfBirth: displayDateToIso(record.DOB),
    joinedAt: displayDateToIso(record.DateofJoin),
    avatarUrl: record.imgSrc || null,
  };
}

export function toStudents(records: LegacyStudentRecord[]): Student[] {
  return records.map(toStudent);
}
