import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import Modal from '@components/ui/Modal';
import type { Cadence, Category, Task } from '../data/tasks.data';
import {
  averageDurationOf,
  cadenceOptions,
  categoryOptions,
  driftLabelOf,
  dueLabelOf,
  hasRun,
  intervalOf,
  lastRunLabelOf,
  ownerOptions,
  scheduleLabelOf,
  secondsText,
  statusBadge,
  statusOf,
  successRateOf,
} from '../data/tasks.data';

export type TaskModalId = 'create' | 'schedule' | 'run' | 'pause' | 'history';

export interface TaskDraft {
  name: string;
  description: string;
  category: Category;
  cadence: Cadence;
  atTime: string;
  onDay: string;
  owner: string;
  target: string;
  catchUp: boolean;
}

export const emptyDraft: TaskDraft = {
  name: '', description: '', category: 'Maintenance', cadence: 'Daily',
  atTime: '02:00', onDay: 'Monday', owner: ownerOptions[0], target: '', catchUp: true,
};

export const draftOf = (row: Task): TaskDraft => ({
  name: row.name,
  description: row.description,
  category: row.category,
  cadence: row.cadence,
  atTime: row.atTime || '02:00',
  onDay: row.onDay || 'Monday',
  owner: row.owner,
  target: row.target,
  catchUp: row.catchUp,
});

export interface RunPayload {
  reason: string;
  dryRun: boolean;
}

export interface PausePayload {
  reason: string;
  resumeOn: string;
}

export interface TaskModalsProps {
  active: TaskModalId | null;
  row: Task | null;
  onClose: () => void;
  onCreate: (draft: TaskDraft) => void;
  onSchedule: (draft: TaskDraft) => void;
  onRun: (payload: RunPayload) => void;
  onPause: (payload: PausePayload) => void;
}

const Row = ({ label, value }: { label: string; value: ReactNode }) => (
  <div className="d-flex align-items-center justify-content-between gap-3 mb-2">
    <span className="fs-13 text-muted">{label}</span>
    <span className="fs-13 fw-medium text-end">{value}</span>
  </div>
);

const dayOptions = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const monthDayOptions = ['1st', '15th', 'last day'];

/** How many times a cadence runs in a week — the number a dropdown hides. */
const runsPerWeek = (cadence: Cadence): number =>
  Math.round((7 * 1440) / intervalOf(cadence) * 10) / 10;

const TaskModals = ({ active, row, onClose, onCreate, onSchedule, onRun, onPause }: TaskModalsProps) => {
  const [draft, setDraft] = useState<TaskDraft>(emptyDraft);
  const [reason, setReason] = useState('');
  const [dryRun, setDryRun] = useState(false);
  const [pauseReason, setPauseReason] = useState('');
  const [resumeOn, setResumeOn] = useState('When I resume it');

  useEffect(() => {
    if (active === 'create') setDraft(emptyDraft);
    if (!row) return;
    if (active === 'schedule') setDraft(draftOf(row));
    if (active === 'run') { setReason(''); setDryRun(false); }
    if (active === 'pause') { setPauseReason(''); setResumeOn('When I resume it'); }
  }, [active, row]);

  const field = (key: keyof TaskDraft, value: string | boolean) =>
    setDraft((current) => ({ ...current, [key]: value }));

  const weekly = runsPerWeek(draft.cadence);

  const form = (suffix: string) => (
    <div className="row g-3">
      <div className="col-md-8">
        <label className="form-label" htmlFor={`tsk-name${suffix}`}>Task name</label>
        <input
          type="text" className="form-control" id={`tsk-name${suffix}`}
          placeholder="e.g. Nightly database backup"
          value={draft.name} onChange={(event) => field('name', event.target.value)}
        />
      </div>
      <div className="col-md-4">
        <label className="form-label" htmlFor={`tsk-cat${suffix}`}>Category</label>
        <select
          className="form-select" id={`tsk-cat${suffix}`}
          value={draft.category} onChange={(event) => field('category', event.target.value)}
        >
          {categoryOptions.map((option) => <option key={option}>{option}</option>)}
        </select>
      </div>
      <div className="col-12">
        <label className="form-label" htmlFor={`tsk-desc${suffix}`}>Description</label>
        <textarea
          className="form-control" id={`tsk-desc${suffix}`} rows={2}
          placeholder="What this task does, and what depends on it having run."
          value={draft.description} onChange={(event) => field('description', event.target.value)}
        />
      </div>
      <div className="col-md-4">
        <label className="form-label" htmlFor={`tsk-cad${suffix}`}>Cadence</label>
        <select
          className="form-select" id={`tsk-cad${suffix}`}
          value={draft.cadence} onChange={(event) => field('cadence', event.target.value)}
        >
          {cadenceOptions.map((option) => <option key={option}>{option}</option>)}
        </select>
        {/* What the cadence actually amounts to over a week. */}
        <span className="fs-12 text-muted">
          {weekly >= 1 ? `${weekly.toLocaleString()} runs a week` : 'Less than once a week'}
        </span>
      </div>
      <div className="col-md-4">
        <label className="form-label" htmlFor={`tsk-time${suffix}`}>At</label>
        <input
          type="time" className="form-control" id={`tsk-time${suffix}`}
          /* A sub-hourly cadence has no time of day to sit in. */
          disabled={draft.cadence === 'Every 15 minutes' || draft.cadence === 'Hourly'}
          value={draft.atTime} onChange={(event) => field('atTime', event.target.value)}
        />
      </div>
      <div className="col-md-4">
        <label className="form-label" htmlFor={`tsk-day${suffix}`}>On</label>
        <select
          className="form-select" id={`tsk-day${suffix}`}
          disabled={draft.cadence !== 'Weekly' && draft.cadence !== 'Monthly'}
          value={draft.onDay} onChange={(event) => field('onDay', event.target.value)}
        >
          {(draft.cadence === 'Monthly' ? monthDayOptions : dayOptions)
            .map((option) => <option key={option}>{option}</option>)}
        </select>
      </div>
      <div className="col-md-6">
        <label className="form-label" htmlFor={`tsk-target${suffix}`}>Target</label>
        <input
          type="text" className="form-control" id={`tsk-target${suffix}`}
          placeholder="e.g. Offsite storage"
          value={draft.target} onChange={(event) => field('target', event.target.value)}
        />
      </div>
      <div className="col-md-6">
        <label className="form-label" htmlFor={`tsk-owner${suffix}`}>Owner</label>
        <select
          className="form-select" id={`tsk-owner${suffix}`}
          value={draft.owner} onChange={(event) => field('owner', event.target.value)}
        >
          {ownerOptions.map((option) => <option key={option}>{option}</option>)}
        </select>
      </div>
      <div className="col-12">
        <div className="d-flex align-items-center justify-content-between border rounded p-2 mb-0">
          <div>
            <h6 className="fs-13 mb-0">Run a missed occurrence late</h6>
            <span className="fs-12 text-muted">
              Otherwise the slot is skipped and the task waits for the next one
            </span>
          </div>
          <div className="form-check form-switch mb-0">
            <input
              className="form-check-input" type="checkbox" role="switch" id={`tsk-catch${suffix}`}
              checked={draft.catchUp} onChange={(event) => field('catchUp', event.target.checked)}
            />
            <label className="form-check-label visually-hidden" htmlFor={`tsk-catch${suffix}`}>
              Run a missed occurrence late
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Create */}
      <Modal
        open={active === 'create'}
        onClose={onClose}
        title="Create scheduled task"
        dialogClassName="modal-lg"
        onSubmit={(event) => { event.preventDefault(); onCreate(draft); }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Create task</button>
          </>
        }
      >
        <p className="fs-12 text-muted mb-3">
          A new task starts paused and runs for the first time when you resume it.
        </p>
        {form('')}
      </Modal>

      {/* Reschedule */}
      <Modal
        open={active === 'schedule' && row !== null}
        onClose={onClose}
        title="Change the schedule"
        dialogClassName="modal-lg"
        onSubmit={(event) => { event.preventDefault(); onSchedule(draft); }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Save schedule</button>
          </>
        }
      >
        {row ? (
          <>
            <div className="border rounded p-3 mb-3">
              <Row label="Task" value={row.name} />
              <Row label="Currently" value={scheduleLabelOf(row)} />
              <Row label="Next run" value={dueLabelOf(row)} />
              <Row label="Average duration" value={secondsText(averageDurationOf(row))} />
            </div>
            {/* Moving between cadences changes the load by orders of magnitude. */}
            {draft.cadence !== row.cadence ? (
              <div className="alert alert-light border d-flex align-items-start gap-2 mb-3">
                <i className="ti ti-info-circle fs-16 mt-1" />
                <span className="fs-13">
                  {runsPerWeek(row.cadence).toLocaleString()} runs a week becomes{' '}
                  {weekly.toLocaleString()}. At {secondsText(averageDurationOf(row))} a run, that is
                  about {secondsText(Math.round(averageDurationOf(row) * weekly))} of work a week.
                </span>
              </div>
            ) : null}
            {form('-2')}
          </>
        ) : null}
      </Modal>

      {/* Run now */}
      <Modal
        open={active === 'run' && row !== null}
        onClose={onClose}
        title="Run it now"
        onSubmit={(event) => { event.preventDefault(); onRun({ reason, dryRun }); }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">
              {dryRun ? 'Dry run' : 'Run now'}
            </button>
          </>
        }
      >
        {row ? (
          <>
            <p className="fs-12 text-muted mb-3">
              An out-of-band run does not move the schedule — the next occurrence still falls where
              it would have.
            </p>
            <div className="border rounded p-3 mb-3">
              <Row label="Task" value={row.name} />
              <Row label="Writes to" value={row.target} />
              {/* What it is about to do, and how long it usually takes. */}
              <Row label="Usually takes" value={secondsText(averageDurationOf(row))} />
              <Row label="Last run" value={`${lastRunLabelOf(row)} · ${secondsText(row.lastDurationSec)}`} />
              <Row label="Drift" value={driftLabelOf(row)} />
              <Row
                label="Status"
                value={<span className={statusBadge[statusOf(row)]}>{statusOf(row)}</span>}
              />
            </div>
            {row.lastError ? (
              <div className="alert alert-warning d-flex align-items-start gap-2 mb-3">
                <i className="ti ti-alert-triangle fs-16 mt-1" />
                <span className="fs-13">
                  The last run failed: {row.lastError} Running it again may fail the same way.
                </span>
              </div>
            ) : null}
            <div className="d-flex align-items-center justify-content-between border rounded p-2 mb-3">
              <div>
                <h6 className="fs-13 mb-0">Dry run</h6>
                <span className="fs-12 text-muted">Reports what it would do, writes nothing</span>
              </div>
              <div className="form-check form-switch mb-0">
                <input
                  className="form-check-input" type="checkbox" role="switch" id="tsk-dry"
                  checked={dryRun} onChange={(event) => setDryRun(event.target.checked)}
                />
                <label className="form-check-label visually-hidden" htmlFor="tsk-dry">Dry run</label>
              </div>
            </div>
            <div className="mb-0">
              <label className="form-label" htmlFor="tsk-reason">Reason</label>
              <textarea
                className="form-control" id="tsk-reason" rows={2}
                placeholder="Recorded in the run history."
                value={reason} onChange={(event) => setReason(event.target.value)}
              />
            </div>
          </>
        ) : null}
      </Modal>

      {/* Pause */}
      <Modal
        open={active === 'pause' && row !== null}
        onClose={onClose}
        title={row?.paused ? 'Resume the task' : 'Pause the task'}
        onSubmit={(event) => { event.preventDefault(); onPause({ reason: pauseReason, resumeOn }); }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="submit" className={`btn ${row?.paused ? 'btn-primary' : 'btn-outline-light bg-white'}`}>
              {row?.paused ? 'Resume it' : 'Pause it'}
            </button>
          </>
        }
      >
        {row ? (
          <>
            <p className="fs-12 text-muted mb-3">
              {row.paused
                ? 'The task returns to its cadence. The first run happens at the next slot.'
                : `A paused task queues nothing. ${row.catchUp ? 'Missed occurrences will run late when it resumes.' : 'Missed occurrences are skipped entirely.'}`}
            </p>
            <div className="border rounded p-3 mb-3">
              <Row label="Task" value={row.name} />
              <Row label="Cadence" value={scheduleLabelOf(row)} />
              <Row label="Next run" value={dueLabelOf(row)} />
              <Row
                label="Success rate"
                value={hasRun(row) ? `${successRateOf(row)}% of ${row.runs.toLocaleString()}` : 'Never run'}
              />
            </div>
            {!row.paused ? (
              <div className="mb-3">
                <label className="form-label" htmlFor="tsk-resume">Resume</label>
                <select
                  className="form-select" id="tsk-resume"
                  value={resumeOn} onChange={(event) => setResumeOn(event.target.value)}
                >
                  {['When I resume it', 'Tomorrow morning', 'In a week', 'At the start of next term']
                    .map((option) => <option key={option}>{option}</option>)}
                </select>
              </div>
            ) : null}
            <div className="mb-0">
              <label className="form-label" htmlFor="tsk-pause-reason">Reason</label>
              <textarea
                className="form-control" id="tsk-pause-reason" rows={2}
                placeholder="Why it is being held, and what has to happen first."
                value={pauseReason} onChange={(event) => setPauseReason(event.target.value)}
              />
            </div>
          </>
        ) : null}
      </Modal>

      {/* History */}
      <Modal
        open={active === 'history' && row !== null}
        onClose={onClose}
        title="Run history"
        dialogClassName="modal-lg"
        footer={<button type="button" className="btn btn-light" onClick={onClose}>Close</button>}
      >
        {row ? (
          <>
            <p className="fs-12 text-muted mb-3">
              {row.name} · {scheduleLabelOf(row)}
            </p>
            <div className="row g-3 mb-3">
              {[
                { label: 'Runs', value: row.runs.toLocaleString(), tint: 'primary' },
                {
                  label: 'Success',
                  value: hasRun(row) ? `${successRateOf(row)}%` : '—',
                  tint: 'success',
                },
                { label: 'Failures', value: String(row.failures), tint: 'danger' },
                { label: 'Average', value: secondsText(averageDurationOf(row)), tint: 'info' },
              ].map((tile) => (
                <div className="col-md-3" key={tile.label}>
                  <div className="border rounded p-3 text-center">
                    <h5 className={`fs-16 mb-0 text-${tile.tint}`}>{tile.value}</h5>
                    <span className="fs-12 text-muted">{tile.label}</span>
                  </div>
                </div>
              ))}
            </div>

            <h6 className="fs-13 mb-2">The last run</h6>
            <div className="border rounded p-3 mb-3">
              <Row label="Started" value={lastRunLabelOf(row)} />
              <Row label="Took" value={secondsText(row.lastDurationSec)} />
              {/* Against its own average, not a fixed expectation. */}
              <Row label="Against average" value={driftLabelOf(row)} />
              <Row label="Result" value={row.lastError ? 'Failed' : 'Completed'} />
            </div>

            {row.lastError ? (
              <>
                <h6 className="fs-13 mb-2">What it returned</h6>
                <div className="alert alert-light border d-flex align-items-start gap-2 mb-0">
                  <i className="ti ti-alert-circle fs-16 mt-1" />
                  <span className="fs-13">{row.lastError}</span>
                </div>
              </>
            ) : (
              <p className="fs-13 text-muted mb-0">
                Nothing came back from the last run — it completed cleanly.
              </p>
            )}
          </>
        ) : null}
      </Modal>
    </>
  );
};

export default TaskModals;
