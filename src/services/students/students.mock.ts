/**
 * Mock implementation of `StudentsService`.
 *
 * Backed by an in-memory copy of the fixtures, so creates/updates/deletes
 * persist for the lifetime of the page — which is what makes forms and tables
 * feel real without a backend. It rejects with the same `ApiError` values the
 * HTTP implementation produces.
 */

import { createNotFoundError, createValidationError } from '@services/api/errors';
import { studentsMockData } from '@mocks/students.mock';
import { mockRequest, nextId, queryCollection } from '@mocks/mock.utils';
import { nowIso } from '@utils/date.utils';
import type { PaginatedResponse, QueryParams } from '@/types/api.types';
import type { StudentsService } from './students.service';
import type {
  CreateStudentPayload,
  Student,
  UpdateStudentPayload,
} from './students.types';

/** Mutable working copy — the imported fixtures are never modified. */
let students: Student[] = studentsMockData.map((student) => ({ ...student }));

const SEARCHABLE_FIELDS: (keyof Student)[] = [
  'fullName',
  'admissionNumber',
  'rollNumber',
  'className',
  'section',
];

function findIndexById(id: string): number {
  return students.findIndex((student) => student.id === id);
}

function buildFullName(firstName: string, lastName: string): string {
  return [firstName, lastName].filter(Boolean).join(' ');
}

/** Mirrors the uniqueness constraint a real backend would enforce. */
function assertAdmissionNumberIsFree(admissionNumber: string, ignoreId?: string): void {
  const clash = students.some(
    (student) =>
      student.admissionNumber === admissionNumber && student.id !== ignoreId,
  );
  if (clash) {
    throw createValidationError({
      admissionNumber: 'This admission number is already in use.',
    });
  }
}

export const studentsMockService: StudentsService = {
  async getStudents(params?: QueryParams): Promise<PaginatedResponse<Student>> {
    await mockRequest();
    return queryCollection(students, params, SEARCHABLE_FIELDS);
  },

  async getStudent(id: string): Promise<Student> {
    await mockRequest();
    const student = students.find((item) => item.id === id);
    if (!student) throw createNotFoundError('Student');
    return { ...student };
  },

  async createStudent(payload: CreateStudentPayload): Promise<Student> {
    await mockRequest();
    assertAdmissionNumberIsFree(payload.admissionNumber);

    const timestamp = nowIso();
    const student: Student = {
      id: nextId(students.map((item) => item.id)),
      admissionNumber: payload.admissionNumber,
      rollNumber: payload.rollNumber,
      firstName: payload.firstName,
      lastName: payload.lastName,
      fullName: buildFullName(payload.firstName, payload.lastName),
      className: payload.className,
      section: payload.section,
      gender: payload.gender,
      status: payload.status ?? 'active',
      dateOfBirth: payload.dateOfBirth,
      joinedAt: payload.joinedAt ?? timestamp.slice(0, 10),
      avatarUrl: null,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    students = [student, ...students];
    return { ...student };
  },

  async updateStudent(id: string, payload: UpdateStudentPayload): Promise<Student> {
    await mockRequest();

    const index = findIndexById(id);
    if (index === -1) throw createNotFoundError('Student');

    if (payload.admissionNumber) {
      assertAdmissionNumberIsFree(payload.admissionNumber, id);
    }

    const current = students[index];
    const firstName = payload.firstName ?? current.firstName;
    const lastName = payload.lastName ?? current.lastName;

    const updated: Student = {
      ...current,
      ...payload,
      firstName,
      lastName,
      fullName: buildFullName(firstName, lastName),
      updatedAt: nowIso(),
    };

    students = students.map((item, i) => (i === index ? updated : item));
    return { ...updated };
  },

  async deleteStudent(id: string): Promise<void> {
    await mockRequest();
    if (findIndexById(id) === -1) throw createNotFoundError('Student');
    students = students.filter((student) => student.id !== id);
  },
};

/** Restores the fixtures. Intended for tests and Storybook-style resets. */
export function resetStudentsMock(): void {
  students = studentsMockData.map((student) => ({ ...student }));
}
