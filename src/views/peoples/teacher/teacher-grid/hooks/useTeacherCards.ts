import { useCallback, useEffect, useState } from 'react';
import { listTeachers } from '@services/staff/staff.list';
import { toTeacherCard } from '../data/teacherCardLive';
import type { TeacherCard } from '../data/teachers.data';

export type CardsStatus = 'loading' | 'ready' | 'error';

/** The school's real teachers, loaded from the database. */
export function useTeacherCards() {
  const [teachers, setTeachers] = useState<TeacherCard[]>([]);
  const [status, setStatus] = useState<CardsStatus>('loading');
  const [error, setError] = useState('');

  const reload = useCallback(async () => {
    setStatus('loading');
    setError('');
    try {
      const rows = await listTeachers();
      setTeachers(rows.map(toTeacherCard));
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