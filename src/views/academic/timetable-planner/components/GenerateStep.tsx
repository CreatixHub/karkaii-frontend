import { useEffect, useState } from 'react';
import { env } from '@config/env';
import { useAuth } from '@hooks/useAuth';
import { plannerMessage } from '@services/timetable/planner.api';
import type { EmptyPeriod, Readiness, VersionDetail } from '@services/timetable/planner.api';
import TimetableEditor from './TimetableEditor';
import { STEPS } from '../types';
import type { StepId, StepProps } from '../types';

const BLOCKER_STEP: Partial<Record<string, StepId>> = {
  bell: 'bell',
  length: 'bell',
  section_capacity: 'plan',
  teacher_capacity: 'setup',
  teacher_max: 'plan',
  subject_shortage: 'plan',
  room_capacity: 'setup',
};

const STATUS: Record<string, string> = { draft: 'badge-soft-warning', published: 'badge-soft-success', archived: 'badge-soft-secondary' };

const EMPTY_KIND: Record<EmptyPeriod['kind'], { label: string; badge: string }> = {
  gap: { label: 'Hole in the day', badge: 'badge-soft-danger' },
  late_start: { label: 'Late start', badge: 'badge-soft-danger' },
  unfilled: { label: 'Plan too light', badge: 'badge-soft-warning' },
  blank: { label: 'No lessons', badge: 'badge-soft-warning' },
};

/** Toast text: how many empty periods there are and the exact fix for the first few. */
function emptyPeriodsToast(items: EmptyPeriod[], lead: string): string {
  const shown = items.slice(0, 3);
  const more = items.length - shown.length;
  const lines = shown.map((item) => `• ${item.message}\n   Fix: ${item.fix}`);
  return [`${lead} ${items.length} empty-period issue${items.length === 1 ? '' : 's'} to fix:`, ...lines, more > 0 ? `+ ${more} more, listed under the timetable.` : ''].filter(Boolean).join('\n');
}

const GenerateStep = ({ api, state, reload, notify, go, setEdits }: StepProps) => {
  const { hasPermission } = useAuth();
  const canCreate = !env.authEnabled || hasPermission('timetable.create');
  const canDelete = !env.authEnabled || hasPermission('timetable.delete');
  const canManage = !env.authEnabled || hasPermission('timetable.manage');
  const [readiness, setReadiness] = useState<Readiness | null>(null);
  const [readinessError, setReadinessError] = useState('');
  const [retry, setRetry] = useState(0);
  const [detail, setDetail] = useState<VersionDetail | null>(null);
  const [budget, setBudget] = useState(3000);
  const [name, setName] = useState('');
  const [busy, setBusy] = useState(false);
  const [showDetail, setShowDetail] = useState(false);

  useEffect(() => {
    let live = true;
    setReadiness(null);
    setReadinessError('');
    api.getReadiness()
      .then((result) => { if (live) setReadiness(result); })
      .catch((error) => { if (live) setReadinessError(plannerMessage(error, 'Could not check generation readiness.')); });
    return () => {
      live = false;
    };
  }, [api, state.lessons, state.bell, state.rules, state.availability, state.rooms, state.lookups.staff, state.lookups.sections, retry]);

  useEffect(() => {
    setEdits(busy ? { saving: true } : null);
    return () => setEdits(null);
  }, [busy, setEdits]);

  const run = async (task: () => Promise<unknown>, done?: string) => {
    if (busy) return;
    setBusy(true);
    try {
      await task();
      if (done) notify(done, 'success');
    } catch (error) {
      notify(plannerMessage(error), 'danger');
    } finally {
      setBusy(false);
    }
  };

  const createDraft = () =>
    run(async () => {
      const next = await api.generate({ budgetMs: budget, name: name.trim() || undefined });
      setDetail(next);
      setName('');
      await reload();
      const lead = next.unplaced.length
        ? `Generated, but ${next.unplaced.length} lesson${next.unplaced.length === 1 ? '' : 's'} could not be placed (open one below to see why).`
        : `Every lesson placed in ${((next.generation?.ms ?? 0) / 1000).toFixed(1)}s.`;
      const empties = next.emptyPeriods ?? [];
      if (empties.length) notify(emptyPeriodsToast(empties, lead), 'warning', 20000);
      else notify(lead, next.unplaced.length ? 'warning' : 'success');
    });

  const createManually = () =>
    run(async () => {
      const next = await api.createBlankVersion(name.trim() || undefined);
      setDetail(next);
      setName('');
      await reload();
      notify('Blank timetable created. Select a lesson to see who is free.', 'success');
    });

  const hasPlan = state.lessons.length > 0;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-start mb-3 flex-wrap gap-2">
        <div>
          <h5 className="mb-1">Generate &amp; edit</h5>
          <p className="text-muted mb-0 fs-13">Check the plan, generate a draft, adjust it by hand, then publish.</p>
        </div>
      </div>

      {!hasPlan ? (
        <div className="alert alert-info d-flex align-items-center justify-content-between gap-2">
          <span>Add lessons to the teaching plan before creating a timetable.</span>
          <button type="button" className="btn btn-sm btn-outline-primary" onClick={() => go('plan')}>Open teaching plan</button>
        </div>
      ) : null}

      <div className="card mb-3">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-start flex-wrap gap-2">
            <div>
              <h6 className="mb-1">Ready to generate?</h6>
              {readiness ? (
                <div className="fs-13 text-muted">
                  {readiness.summary.sections} classes · {readiness.summary.periods} periods to place · {readiness.summary.teachers} teachers · {readiness.summary.days} days
                </div>
              ) : null}
            </div>
            {readiness ? (
              <span className={`badge ${readiness.ok ? 'badge-soft-success' : 'badge-soft-danger'}`}>
                {readiness.ok ? (readiness.warnings.length ? `Ready, ${readiness.warnings.length} warning${readiness.warnings.length === 1 ? '' : 's'}` : 'No problems found') : `${readiness.blocking.length} problem${readiness.blocking.length === 1 ? '' : 's'} to fix`}
              </span>
            ) : null}
          </div>

          {!readiness ? (
            <div className="mt-2" role="status">
              {readinessError ? (
                <>
                  <span className="text-danger">{readinessError}</span>{' '}
                  <button type="button" className="btn btn-link btn-sm" onClick={() => setRetry((n) => n + 1)}>Retry check</button>
                </>
              ) : 'Checking generation requirements…'}
            </div>
          ) : null}
          {readiness?.blocking.length ? (
            <ul className="mt-3 mb-0 text-danger fs-13">
              {readiness.blocking.map((b, i) => (
                <li key={i}>
                  {b.message}{' '}
                  <button type="button" className="btn btn-link btn-sm p-0" onClick={() => go(BLOCKER_STEP[b.code] ?? 'plan')}>
                    Open {STEPS.find((step) => step.id === (BLOCKER_STEP[b.code] ?? 'plan'))?.label}
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
          {readiness?.warnings.length ? (
            <>
              <button type="button" className="btn btn-link btn-sm p-0 mt-2" onClick={() => setShowDetail((s) => !s)}>
                {showDetail ? 'Hide' : 'Show'} {readiness.warnings.length} warning{readiness.warnings.length === 1 ? '' : 's'}
              </button>
              {showDetail ? (
                <ul className="mt-2 mb-0 text-warning-emphasis fs-13">
                  {readiness.warnings.map((w, i) => (
                    <li key={i}>
                      {w.message}
                      {BLOCKER_STEP[w.code] ? (
                        <>
                          {' '}
                          <button type="button" className="btn btn-link btn-sm p-0" onClick={() => go(BLOCKER_STEP[w.code] ?? 'plan')}>
                            Open {STEPS.find((step) => step.id === BLOCKER_STEP[w.code])?.label}
                          </button>
                        </>
                      ) : null}
                    </li>
                  ))}
                </ul>
              ) : null}
            </>
          ) : null}

          <hr />
          <div className="d-flex gap-2 flex-wrap align-items-end">
            <div>
              <label className="form-label fs-12 mb-1" htmlFor="draft-name">Name (optional)</label>
              <input id="draft-name" className="form-control form-control-sm" placeholder="Term 1" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
              <label className="form-label fs-12 mb-1" htmlFor="draft-effort">How hard to search</label>
              <select id="draft-effort" className="form-select form-select-sm" value={budget} onChange={(e) => setBudget(Number(e.target.value))}>
                <option value={1000}>Quick (1s)</option>
                <option value={3000}>Standard (3s)</option>
                <option value={10000}>Thorough (10s)</option>
              </select>
            </div>
            <button type="button" className="btn btn-primary" disabled={busy || !canCreate || !hasPlan || !readiness?.ok} onClick={() => void createDraft()}>
              <i className="ti ti-bolt me-1" />
              {busy ? 'Generating…' : 'Generate timetable'}
            </button>
            <button type="button" className="btn btn-outline-primary" disabled={busy || !canCreate || !hasPlan || !readiness?.ok} onClick={() => void createManually()}>
              <i className="ti ti-hand-click me-1" />
              Create manually
            </button>
          </div>
          <div className="text-muted fs-12 mt-2">
            Every run places lessons without clashes, then improves balance and gaps for the time you choose. Each run becomes a separate draft, so you can compare. Or start with an empty timetable and place lessons yourself; you can auto-fill the rest later.
          </div>
        </div>
      </div>

      {state.versions.length > 0 ? (
        <div className="card mb-3">
          <div className="table-responsive">
            <table className="table align-middle mb-0">
              <thead>
                <tr><th>Timetable</th><th>Status</th><th>Lessons</th><th>Updated</th><th /></tr>
              </thead>
              <tbody>
                {state.versions.map((v) => (
                  <tr key={v.id} className={detail?.version.id === v.id ? 'table-active' : ''}>
                    <td><b>{v.name}</b></td>
                    <td><span className={`badge ${STATUS[v.status] ?? ''}`}>{v.status}</span></td>
                    <td>{v.lessonCount}</td>
                    <td className="fs-13 text-muted">{v.updatedAt ? new Date(v.updatedAt).toLocaleString() : '—'}</td>
                    <td className="text-end text-nowrap">
                      <button type="button" className="btn btn-sm btn-outline-primary me-1" disabled={busy} onClick={() => void run(async () => setDetail(await api.getVersion(v.id)))}>{v.status === 'draft' ? 'Open & edit' : 'View'}</button>
                      <button type="button" className="btn btn-sm btn-outline-light bg-white me-1" disabled={busy || !canCreate} onClick={() => void run(async () => { const copy = await api.duplicateVersion(v.id); setDetail(copy); await reload(); }, 'Copied to a new draft.')}>Copy</button>
                      <button type="button" className="btn btn-sm btn-link text-danger" disabled={busy || !canDelete || v.status !== 'draft'} aria-label={`Delete ${v.name}`} onClick={() => { if (window.confirm(`Delete "${v.name}"?`)) void run(async () => { await api.deleteVersion(v.id); if (detail?.version.id === v.id) setDetail(null); await reload(); }, 'Deleted.'); }}>
                        <i className="ti ti-trash" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}

      {detail ? (
        <div>
          <h6 className="mb-2">{detail.version.name}</h6>
          {detail.emptyPeriods?.length ? (
            <div className="card mb-3" role="region" aria-label="Empty periods to fix">
              <div className="card-body">
                <h6 className="mb-1">Empty periods to fix ({detail.emptyPeriods.length})</h6>
                <p className="text-muted fs-12 mb-2">Each line says what is empty and the exact change that fills it. Holes and late starts are fixed by dragging lessons below; the others need a change to the plan.</p>
                <ul className="list-unstyled mb-0 fs-13">
                  {detail.emptyPeriods.map((item, i) => (
                    <li key={`${item.sectionId}-${item.kind}-${item.day ?? 'w'}-${item.period ?? i}`} className="py-2 border-top">
                      <span className={`badge ${EMPTY_KIND[item.kind].badge} me-2`}>{EMPTY_KIND[item.kind].label}</span>
                      <b>{item.message}</b>
                      <div className="text-muted mt-1">Fix: {item.fix}</div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : null}
          <TimetableEditor
            key={detail.version.id}
            api={api}
            busy={busy}
            setBusy={setBusy}
            canCreate={canCreate}
            canManage={canManage}
            detail={detail}
            state={state}
            notify={notify}
            onChange={setDetail}
            reloadState={reload}
          />
        </div>
      ) : null}
    </div>
  );
};

export default GenerateStep;
