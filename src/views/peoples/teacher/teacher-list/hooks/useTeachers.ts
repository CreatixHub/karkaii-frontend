import { useCallback, useEffect, useState } from 'react';
import { listTeachers } from '@services/staff/staff.list';
import { toTeacher } from '../data/teacherLive';
import type { Teacher } from '../data/teachers.data';

export type TeachersStatus = 'loading' | 'ready' | 'error';

/** Live teachers of the school from the database. */
export function useTeachers() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [status, setStatus] = useState<TeachersStatus>('loading');
  const [error, setError] = useState('');

  const reload = useCallback(async () => {
    setStatus('loading');
    setError('');
    try {
      const rows = await listTeachers();
      setTeachers(rows.map(toTeacher));
      setStatus('ready');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not load the teachers.');
      setStatus('error');
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  return { teachers, status, error, reload };
}