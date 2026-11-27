import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { all_routes } from '@/routes/all_routes';
import { getCurrentAcademicYearId } from '@services/academic/years.api';
import { createPlannerApi, plannerMessage } from '@services/timetable/planner.api';
import type { PlannerState, StaffLookup } from '@services/timetable/planner.api';
import { WEEKLY_PERIOD_LIMIT as WEEKLY_LIMIT } from '../teacherForm/teachingProfile';

// Every teacher is measured against the same weekly limit (WEEKLY_LIMIT = 35), so free periods can be compared fairly.
type Level = 'over' | 'full' | 'free' | 'none';

interface Row {
  id: string;
  name: string;
  subject: string;
  assigned: number;
  free: number;
  /** The maximum saved on the teacher's profile, if any. The planner still enforces it. */
  ownMax: number | null;
  level: Level;
}

type LoadResult =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready'; state: PlannerState };

const STATUS: Record<Level, { label: (row: Row) => string; badge: string; bar: string }> = {
  over: { label: (r) => `Over by ${r.assigned - WEEKLY_LIMIT}`, badge: 'badge-soft-danger', bar: 'bg-danger' },
  full: { label: () => `At ${WEEKLY_LIMIT}`, badge: 'badge-soft-warning', bar: 'bg-warning' },
  free: { label: (r) => `${r.free} free`, badge: 'badge-soft-success', bar: 'bg-success' },
  none: { label: () => 'Not assigned yet', badge: 'badge-soft-secondary', bar: 'bg-secondary' },
};

function toRow(staff: StaffLookup, subjectNames: Map<string, string>): Row {
  const assigned = staff.plannedPeriods ?? 0;
  const level: Level = assigned > WEEKLY_LIMIT ? 'over' : assigned === WEEKLY_LIMIT ? 'full' : assigned === 0 ? 'none' : 'free';
  return {
    id: staff.id,
    name: staff.name,
    subject: (staff.primarySubjectId && subjectNames.get(staff.primarySubjectId)) || '—',
    assigned,
    free: Math.max(0, WEEKLY_LIMIT - assigned),
    ownMax: staff.maxPeriodsPerWeek ?? null,
    level,
  };
}

/** The fewest teachers who could cover every assigned period at the weekly limit. */
const staffNeeded = (totalPeriods: number) => Math.ceil(totalPeriods / WEEKLY_LIMIT);

/** Each teacher's periods against the common weekly limit, plus how many teachers the plan really needs. */
const TeacherWorkload = () => {
  const [result, setResult] = useState<LoadResult>({ status: 'loading' });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;
    void (async () => {
      try {
        const yearId = await getCurrentAcademicYearId();
        if (signal.aborted) return;
        const state = await createPlannerApi(yearId).getState(signal);
        if (!signal.aborted) setResult({ status: 'ready', state });
      } catch (error) {
        if (!signal.aborted) {
          setResult({ status: 'error', message: plannerMessage(error, 'Could not load teacher workload.') });
        }
      }
    })();
    return () => controller.abort();
  }, [attempt]);

  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="d-md-flex align-items-center justify-content-between flex-wrap gap-2 mb-3">
          <div className="mb-2">
            <h3 className="page-title mb-1">Teacher Workload</h3>
            <nav aria-label="Breadcrumb">
              <ol className="breadcrumb mb-0">
                <li className="breadcrumb-item"><Link to={all_routes.adminDashboard}>Dashboard</Link></li>
                <li className="breadcrumb-item"><Link to={all_routes.teacherGrid}>Teachers</Link></li>
                <li className="breadcrumb-item active" aria-current="page">Workload</li>
              </ol>
            </nav>
          </div>
          <Link to={all_routes.timetablePlanner} className="btn btn-outline-light bg-white">
            <i className="ti ti-table me-1" aria-hidden="true" />
            Open Timetable Planner
          </Link>
        </div>

        {result.status === 'loading' && (
          <div className="card"><div className="card-body text-center text-muted py-5" role="status">Loading teacher workload…</div></div>
        )}
        {result.status === 'error' && (
          <div className="alert alert-danger d-flex flex-wrap justify-content-between align-items-center gap-2" role="alert">
            <span>{result.message}</span>
            <button
              type="button"
              className="btn btn-sm btn-outline-danger"
              onClick={() => {
                setResult({ status: 'loading' });
                setAttempt((current) => current + 1);
              }}
            >
              Try again
            </button>
          </div>
        )}
        {result.status === 'ready' && <WorkloadSummary state={result.state} />}
      </div>
    </div>
  );
};

const WorkloadSummary = ({ state }: { state: PlannerState }) => {
  const subjectNames = new Map(state.lookups.subjects.map((subject) => [subject.id, subject.name]));
  const rows = state.lookups.staff
    .filter((staff) => !staff.staffType || staff.staffType === 'teaching')
    .map((staff) => toRow(staff, subjectNames))
    .sort((a, b) => b.assigned - a.assigned || a.name.localeCompare(b.name));

  const assigned = rows.reduce((n, r) => n + r.assigned, 0);
  const needed = staffNeeded(assigned);
  const frees = rows.map((r) => WEEKLY_LIMIT - r.assigned);
  const totals = {
    assigned,
    needed,
    over: rows.filter((r) => r.level === 'over').length,
    averageFree: rows.length ? (frees.reduce((n, f) => n + f, 0) / rows.length) : 0,
    mostFree: frees.length ? Math.max(...frees) : 0,
    leastFree: frees.length ? Math.min(...frees) : 0,
  };

  const difference = rows.length - totals.needed;
  const staffChip =
    rows.length === 0
      ? null
      : difference > 0
        ? { badge: 'badge-soft-warning', icon: 'ti-users-plus', text: `Teaching staff count is high: ${rows.length} teachers, ${totals.needed} needed (${difference} more than needed)` }
        : difference < 0
          ? { badge: 'badge-soft-danger', icon: 'ti-user-exclamation', text: `Teaching staff count is low: ${rows.length} teachers, ${totals.needed} needed (${-difference} more needed)` }
          : { badge: 'badge-soft-success', icon: 'ti-circle-check', text: `Teaching staff count is right: ${rows.length} teachers, ${totals.needed} needed` };

  return (
    <>
      {staffChip || totals.over > 0 ? (
        <div className="d-flex flex-wrap gap-2 mb-3" role="status">
          {staffChip ? (
            <span className={`badge ${staffChip.badge} fs-13 py-2 px-3`} style={{ textTransform: 'none', whiteSpace: 'normal' }}>
              <i className={`ti ${staffChip.icon} me-1`} aria-hidden="true" />
              {staffChip.text}
            </span>
          ) : null}
          {totals.over > 0 ? (
            <span className="badge badge-soft-danger fs-13 py-2 px-3" style={{ textTransform: 'none', whiteSpace: 'normal' }}>
              <i className="ti ti-alert-triangle me-1" aria-hidden="true" />
              {totals.over} teacher{totals.over === 1 ? '' : 's'} over {WEEKLY_LIMIT} periods
            </span>
          ) : null}
        </div>
      ) : null}

      <div className="row g-3 mb-3">
        <div className="col-sm-6 col-lg-3">
          <div className="card mb-0"><div className="card-body py-3">
            <div className="text-muted fs-13">Teaching staff</div>
            <div className="fs-4 fw-semibold">{rows.length}</div>
          </div></div>
        </div>
        <div className="col-sm-6 col-lg-3">
          <div className="card mb-0"><div className="card-body py-3">
            <div className="text-muted fs-13">Teaching staff needed</div>
            <div className="fs-4 fw-semibold">{totals.needed}</div>
            <div className="text-muted fs-12">{totals.assigned} periods at {WEEKLY_LIMIT} each, rounded up</div>
          </div></div>
        </div>
        <div className="col-sm-6 col-lg-3">
          <div className="card mb-0"><div className="card-body py-3">
            <div className="text-muted fs-13">Periods assigned a week</div>
            <div className="fs-4 fw-semibold">{totals.assigned}</div>
            <div className="text-muted fs-12">of {rows.length * WEEKLY_LIMIT} possible at {WEEKLY_LIMIT} each</div>
          </div></div>
        </div>
        <div className="col-sm-6 col-lg-3">
          <div className="card mb-0"><div className="card-body py-3">
            <div className="text-muted fs-13">Free periods per teacher</div>
            <div className="fs-4 fw-semibold">{totals.averageFree.toFixed(1)} <span className="text-muted fs-14 fw-normal">on average</span></div>
            <div className="text-muted fs-12">from {totals.leastFree} to {totals.mostFree}; the closer, the more even</div>
          </div></div>
        </div>
      </div>

      <div className="card">
        <div className="table-responsive">
          <table className="table align-middle mb-0">
            <caption className="visually-hidden">Assigned and free periods for each teacher against a weekly limit of {WEEKLY_LIMIT}</caption>
            <thead className="table-light">
              <tr>
                <th scope="col">Teacher</th>
                <th scope="col">Primary subject</th>
                <th scope="col" className="text-end">Limit</th>
                <th scope="col" className="text-end">Assigned</th>
                <th scope="col" className="text-end">Free</th>
                <th scope="col" style={{ minWidth: 160 }}>Load</th>
                <th scope="col">Status</th>
                <th scope="col" className="text-end">Own max</th>
                <th scope="col"><span className="visually-hidden">Actions</span></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => {
                const status = STATUS[r.level];
                const pct = Math.min(100, Math.round((r.assigned / WEEKLY_LIMIT) * 100));
                const overOwnMax = r.ownMax !== null && r.assigned > r.ownMax;
                return (
                  <tr key={r.id}>
                    <th scope="row" className="fw-medium">{r.name}</th>
                    <td>{r.subject}</td>
                    <td className="text-end">{WEEKLY_LIMIT}</td>
                    <td className="text-end fw-semibold">{r.assigned}</td>
                    <td className="text-end">{r.free}</td>
                    <td>
                      <div className="progress" style={{ height: 8 }} role="progressbar" aria-label={`${r.name}: ${r.assigned} of ${WEEKLY_LIMIT} periods`} aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
                        <div className={`progress-bar ${status.bar}`} style={{ width: `${pct}%` }} />
                      </div>
                    </td>
                    <td><span className={`badge ${status.badge}`}>{status.label(r)}</span></td>
                    <td className="text-end text-muted">
                      {r.ownMax ?? '—'}
                      {overOwnMax ? (
                        <span className="badge badge-soft-warning ms-2" style={{ textTransform: 'none' }}>Over own max</span>
                      ) : null}
                    </td>
                    <td className="text-end">
                      <Link
                        to={`${all_routes.editTeacher}?id=${encodeURIComponent(r.id)}`}
                        className="btn btn-sm btn-outline-light bg-white"
                        aria-label={`Set weekly maximum for ${r.name}`}
                      >
                        Set max
                      </Link>
                    </td>
                  </tr>
                );
              })}
              {rows.length === 0 ? (
                <tr><td colSpan={9} className="text-center text-muted py-4">No teachers yet. Add one under Teachers.</td></tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
      <p className="text-muted fs-12 mt-2">
        Every teacher is measured against {WEEKLY_LIMIT} periods a week. Assigned is the periods a week the Teaching plan gives each teacher (class lessons only; classes left out of timetabling are not counted). &ldquo;Own max&rdquo; is the maximum saved on the teacher&apos;s profile, which the planner still enforces when you generate. Teaching staff needed is the fewest teachers who could cover every assigned period at {WEEKLY_LIMIT} each.
      </p>
    </>
  );
};

export default TeacherWorkload;
