/**
 * API-shaped student fixtures.
 *
 * Derived from the template's existing `Studentlist` so the mock data matches
 * what the current UI shows, then reshaped to the contract the backend is
 * expected to expose. Consumers only ever see `Student`.
 */

import { Studentlist } from '../core/data/json/studentList';
import type { Student } from '@services/students/students.types';
import type { LegacyStudentRecord } from './adapters/student.adapter';
import { toStudents } from './adapters/student.adapter';

export const studentsMockData: Student[] = toStudents(
  Studentlist as LegacyStudentRecord[],
);

/** Distinct class names, for populating filter dropdowns. */
export const studentClassOptions: string[] = Array.from(
  new Set(studentsMockData.map((student) => student.className)),
).sort();

/** Distinct sections, for populating filter dropdowns. */
export const studentSectionOptions: string[] = Array.from(
  new Set(studentsMockData.map((student) => student.section)),
).sort();
