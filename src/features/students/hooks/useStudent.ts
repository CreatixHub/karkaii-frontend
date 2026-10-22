/**
 * Feature hook: a single student by id.
 *
 * Stays idle until an id is provided, so it is safe to call from a detail page
 * whose route parameter may not be resolved yet.
 */

import { useCallback } from 'react';
import { useQuery } from '@hooks/useQuery';
import { studentsService } from '@services/students/students.service';
import type { Student } from '@services/students/students.types';
import type { QueryResult } from '@/types/common.types';

export function useStudent(id: string | undefined): QueryResult<Student> {
  const fetchStudent = useCallback(
    (signal: AbortSignal) => studentsService.getStudent(id as string, signal),
    [id],
  );

  return useQuery<Student>(fetchStudent, [id], { enabled: Boolean(id) });
}
