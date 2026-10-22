/**
 * HTTP implementation of `StudentsService`.
 *
 * Already complete — it becomes live the moment `VITE_USE_MOCK_API=false` and
 * `VITE_API_BASE_URL` point at a real backend. No UI change is required.
 */

import { apiClient } from '@services/api/client';
import { endpoints } from '@services/api/endpoints';
import type { PaginatedResponse, QueryParams } from '@/types/api.types';
import type { StudentsService } from './students.service';
import type {
  CreateStudentPayload,
  Student,
  UpdateStudentPayload,
} from './students.types';

export const studentsHttpService: StudentsService = {
  getStudents(params?: QueryParams, signal?: AbortSignal) {
    return apiClient.get<PaginatedResponse<Student>>(endpoints.students.list, {
      query: params,
      signal,
    });
  },

  getStudent(id: string, signal?: AbortSignal) {
    return apiClient.get<Student>(endpoints.students.detail(id), { signal });
  },

  createStudent(payload: CreateStudentPayload) {
    return apiClient.post<Student>(endpoints.students.create, payload);
  },

  updateStudent(id: string, payload: UpdateStudentPayload) {
    return apiClient.patch<Student>(endpoints.students.update(id), payload);
  },

  deleteStudent(id: string) {
    return apiClient.delete<void>(endpoints.students.remove(id));
  },
};
