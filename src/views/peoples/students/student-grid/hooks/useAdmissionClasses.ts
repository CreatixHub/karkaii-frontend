/**
 * Maps studentId -> class name using the existing `GET /api/admissions` list,
 * so the grid can show each student's class without any backend change.
 *
 * Admissions are read 100 at a time (the backend maximum) until all are loaded.
 * Field names are read defensively (className / class.name / classId lookups).
 */

import { useEffect, useState } from 'react';
import { apiClient } from '@services/api/client';
import { endpoints } from '@services/api/endpoints';

type Loose = Record<string, unknown>;

const text = (value: unknown): string => (typeof value === 'string' ? value.trim() : '');

function classNameOf(row: Loose): string {
  const nested = (row.class ?? row.classInfo ?? row.admissionClass) as Loose | undefined;
  return (
    text(row.className) ||
    text(row.class_name) ||
    text(row.classApplied) ||
    text(row.appliedClass) ||
    text(row.gradeName) ||
    (nested && typeof nested === 'object' ? text(nested.name) : '') ||
    (typeof row.class === 'string' ? text(row.class) : '')
  );
}

export function useAdmissionClasses() {
  const [classByStudent, setClassByStudent] = useState<Record<string, string>>({});

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      const map: Record<string, string> = {};
      const limit = 100;
      try {
        for (let page = 1; page <= 50; page += 1) {
          const res = await apiClient.getEnvelope<Loose[]>(endpoints.admissions.list, {
            query: { page, limit },
          });
          const rows = Array.isArray(res.data) ? res.data : [];
          for (const row of rows) {
            const studentId = row.studentId ?? row.student_id;
            const name = classNameOf(row);
            if (studentId != null && name) map[String(studentId)] = name;
          }
          const pages = Number((res.meta as { pages?: number } | undefined)?.pages ?? 1);
          if (rows.length < limit || page >= pages) break;
        }
      } catch {
        // No class info available; cards simply keep showing a dash.
      }
      if (!cancelled) setClassByStudent(map);
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  return classByStudent;
}