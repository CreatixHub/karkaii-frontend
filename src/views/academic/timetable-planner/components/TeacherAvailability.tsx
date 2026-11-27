import { useEffect, useState } from 'react';
import { DAY_LONG, DAY_SHORT, plannerMessage } from '@services/timetable/planner.api';
import type { PlannerApi, TeacherAvailability as TeacherWeek, TeacherAvailabilityResult } from '@services/timetable/planner.api';

interface Props {
  api: PlannerApi;
  versionId: string;
  blockId: string;
  /** Changes whenever the draft changes, so the grids refresh after every placement. */
  updatedAt?: string;
  subjectName: string;
  /** Clicking a free period of a teacher already on the lesson asks the editor to place it there. */
  onPlace: (day: number, no: number) => void;
  disabled?: boolean;
}

const ROLE: Record<TeacherWeek['role'], string> = { assigned: 'On this lesson', primary: 'Primary', additional: 'Additional' };

const Week = ({ teacher, canPlace, onPlace }: { teacher: TeacherWeek; canPlace: boolean; onPlace: (day: number, no: number) => void }) => {
  const rows = Math.max(0, ...teacher.days.map((d) => d.periods.length));
  return (
    <div className="tp-who-week">
      <table aria-label={`${teacher.name}'s week`}>
        <thead>
          <tr>
            <th scope="col"><span className="visually-hidden">Period</span></th>
            {teacher.days.map((d) => <th key={d.day} scope="col">{DAY_SHORT[d.day]}</th>)}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }, (_, i) => (
            <tr key={i}>
              <th scope="row">{i + 1}</th>
              {teacher.days.map((d) => {
                const p = d.periods[i];
                if (!p) return <td key={d.day} className="none" />;
                const where = `${DAY_LONG[d.day]} period ${p.no}`;
                if (p.state === 'busy') return <td key={d.day} className="busy" title={`Teaching ${p.with ?? 'another class'}`} aria-label={`${where}: teaching ${p.with ?? 'another class'}`}>●</td>;
                if (p.state === 'blocked') return <td key={d.day} className="blocked" title="Day off" aria-label={`${where}: day off`}>✕</td>;
                return canPlace ? (
                  <td key={d.day} className="free">
                    <button type="button" aria-label={`Place here: ${where}`} title="Place here" onClick={() => onPlace(d.day, p.no)} />
                  </td>
                ) : (
                  <td key={d.day} className="free" aria-label={`${where}: free`} />
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

/** Who is free, busy or off when you place a lesson by hand. */
const TeacherAvailability = ({ api, versionId, blockId, updatedAt, subjectName, onPlace, disabled }: Props) => {
  const [result, setResult] = useState<TeacherAvailabilityResult | null>(null);
  const [error, setError] = useState('');
  const [showOthers, setShowOthers] = useState(false);

  useEffect(() => {
    let live = true;
    setError('');
    api.getTeacherAvailability(versionId, blockId)
      .then((next) => { if (live) setResult(next); })
      .catch((e) => { if (live) { setResult(null); setError(plannerMessage(e, 'Could not load who is free.')); } });
    return () => { live = false; };
  }, [api, versionId, blockId, updatedAt]);

  if (error) return <p className="text-muted fs-12 mb-0 mt-2" role="status">{error}</p>;
  if (!result) return <p className="text-muted fs-12 mb-0 mt-2" role="status">Checking who is free…</p>;

  const assigned = result.teachers.filter((t) => t.role === 'assigned');
  const others = result.teachers.filter((t) => t.role !== 'assigned');

  const header = (t: TeacherWeek) => (
    <div className="d-flex flex-wrap align-items-center gap-2 mb-1">
      <b className="fs-13">{t.name}</b>
      <span className="badge badge-soft-secondary">{ROLE[t.role]}</span>
      <span className={`fs-12 ${t.atMax ? 'text-danger fw-semibold' : 'text-muted'}`}>
        {t.max !== null ? `${t.planned}/${t.max} periods${t.atMax ? ' (full)' : ''}` : `${t.planned} periods`}
      </span>
    </div>
  );

  return (
    <div className="tp-who mt-2" aria-label="Teacher availability">
      <div className="text-muted fs-12 mb-2">
        <span className="tp-who-key free" /> free <span className="tp-who-key busy ms-2">●</span> teaching <span className="tp-who-key blocked ms-2">✕</span> day off
        {!disabled && assigned.length ? ' · click a free period to place the lesson there' : ''}
      </div>
      {assigned.length === 0 ? <p className="text-muted fs-12">This lesson has no teacher yet. Add one in the Teaching plan.</p> : null}
      <div className="d-flex flex-wrap gap-3">
        {assigned.map((t) => (
          <div key={t.id}>
            {header(t)}
            <Week teacher={t} canPlace={!disabled} onPlace={onPlace} />
          </div>
        ))}
      </div>
      {others.length > 0 ? (
        <div className="mt-2">
          <button type="button" className="btn btn-link btn-sm p-0" aria-expanded={showOthers} onClick={() => setShowOthers((s) => !s)}>
            {showOthers ? 'Hide' : 'Show'} {others.length} other teacher{others.length === 1 ? '' : 's'} who can teach {subjectName}
          </button>
          {showOthers ? (
            <>
              <p className="text-muted fs-12 mb-2">To use one of them, change the teacher in the Teaching plan.</p>
              <div className="d-flex flex-wrap gap-3">
                {others.map((t) => (
                  <div key={t.id}>
                    {header(t)}
                    <Week teacher={t} canPlace={false} onPlace={onPlace} />
                  </div>
                ))}
              </div>
            </>
          ) : null}
        </div>
      ) : null}
    </div>
  );
};

export default TeacherAvailability;
