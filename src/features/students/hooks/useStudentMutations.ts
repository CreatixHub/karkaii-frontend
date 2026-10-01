/**
 * Feature hook: student create / update / delete.
 *
 * Each mutation exposes its own loading and error state, and `onSuccess`
 * triggers the caller's refresh — completing the API-ready write flow:
 *
 *   Form -> validation -> submit -> service -> success/error -> refresh UI
 */

import { useCallback } from 'react';
import { useMutation } from '@hooks/useMutation';
import { studentsService } from '@services/students/students.service';
import type {
  CreateStudentPayload,
  Student,
  UpdateStudentPayload,
} from '@services/students/students.types';

export interface UseStudentMutationsOptions {
  /** Usually the list query's `refetch`. */
  onChanged?: () => void;
}

export function useStudentMutations(options: UseStudentMutationsOptions = {}) {
  const { onChanged } = options;

  const handleChanged = useCallback(() => {
    onChanged?.();
  }, [onChanged]);

  const createStudent = useMutation<[CreateStudentPayload], Student>(
    (payload) => studentsService.createStudent(payload),
    { onSuccess: handleChanged },
  );

  const updateStudent = useMutation<[string, UpdateStudentPayload], Student>(
    (id, payload) => studentsService.updateStudent(id, payload),
    { onSuccess: handleChanged },
  );

  const deleteStudent = useMutation<[string], void>(
    (id) => studentsService.deleteStudent(id),
    { onSuccess: handleChanged },
  );

  return {
    createStudent,
    updateStudent,
    deleteStudent,
    isMutating:
      createStudent.loading || updateStudent.loading || deleteStudent.loading,
  };
}
