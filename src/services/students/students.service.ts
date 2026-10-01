/**
 * The Students service contract and the exported instance.
 *
 * Components and hooks import ONLY `studentsService` and never the concrete
 * implementations, so they cannot tell whether data came from a mock or the
 * network. Switching is a one-line configuration change.
 */

import { createService } from '@services/api/create-service';
import type { PaginatedResponse, QueryParams } from '@/types/api.types';
import { studentsHttpService } from './students.http';
import { studentsMockService } from './students.mock';
import type {
  CreateStudentPayload,
  Student,
  UpdateStudentPayload,
} from './students.types';

export interface StudentsService {
  getStudents(
    params?: QueryParams,
    signal?: AbortSignal,
  ): Promise<PaginatedResponse<Student>>;
  getStudent(id: string, signal?: AbortSignal): Promise<Student>;
  createStudent(payload: CreateStudentPayload): Promise<Student>;
  updateStudent(id: string, payload: UpdateStudentPayload): Promise<Student>;
  deleteStudent(id: string): Promise<void>;
}

export const studentsService: StudentsService = createService(
  studentsMockService,
  studentsHttpService,
);
