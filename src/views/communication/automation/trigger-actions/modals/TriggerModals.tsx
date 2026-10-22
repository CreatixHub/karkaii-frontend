import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import Modal from '@components/ui/Modal';
import type { ActionType, EventType, Module, TriggerAction } from '../data/triggers.data';
import {
  actionOptions,
  averageLatencyOf,
  failedOf,
  firesPerDayOf,
  hasFired,
  healthBadge,
  healthOf,
  latencyLabelOf,
  moduleOptions,
  ownerOptions,
  successRateOf,
  eventOptions,
} from '../data/triggers.data';

export type TriggerModalId = 'create' | 'edit' | 'arm' | 'test' | 'delete';

export interface TriggerDraft {
  name: string;
  description: string;
  module: Module;
  event: EventType;
  eventSource: string;
  action: ActionType;
  actionTarget: string;
  owner: string;
  testMode: boolean;
}

export const emptyDraft: TriggerDraft = {
  name: '', description: '', module: 'Fees', event: 'Record created', eventSource: '',
  action: 'Send notification', actionTarget: '', owner: ownerOptions[0], testMode: true,
};

export const draftOf = (row: TriggerAction): TriggerDraft => ({
  name: row.name,
  description: row.description,
  module: row.module,
  event: row.event,
  eventSource: row.eventSource,
  action: row.action,
  actionTarget: row.actionTarget,
  owner: row.owner,
  testMode: row.testMode,
});

export interface ArmPayload {
  testMode: boolean;
  note: string;
}

export interface TestPayload {
  sample: string;
}

export interface TriggerModalsProps {
  active: TriggerModalId | null;
  row: TriggerAction | null;
  onClose: () => void;
  onCreate: (draft: TriggerDraft) => void;
  onUpdate: (draft: TriggerDraft) => void;
  onArm: (payload: ArmPayload) => void;
  onTest: (payload: TestPayload) => void;
  onDelete: () => void;
}

const Row = ({ label, value }: { label: string; value: ReactNode }) => (
  <div className="d-flex align-items-center justify-content-between gap-3 mb-2">
    <span className="fs-13 text-muted">{label}</span>
    <span className="fs-13 fw-medium text-end">{value}</span>
  </div>
);

const sampleOptions = [
  'The most recent matching record',
  'A record chosen at random',
  'The record that last failed',
];

const TriggerModals = ({
  active, row, onClose, onCreate, onUpdate, onArm, onTest, onDelete,
}: TriggerModalsProps) => {
  const [draft, setDraft] = useState<TriggerDraft>(emptyDraft);
  const [testMode, setTestMode] = useState(true);
  const [note, setNote] = useState('');
  const [sample, setSample] = useState(sampleOptions[0]);

  useEffect(() => {
    if (active === 'create') setDraft(emptyDraft);
    if (!row) return;
    if (active === 'edit') setDraft(draftOf(row));
    if (active === 'arm') {
      setTestMode(row.testMode);
      setNote('');
    }
    if (active === 'test') {
      setSample(row.lastError ? sampleOptions[2] : sampleOptions[0]);
    }
  }, [active, row]);

  const field = (key: keyof TriggerDraft, value: string | boolean) =>
    setDraft((current) => ({ ...current, [key]: value }));

  const form = (suffix: string) => (
    <div className="row g-3">
      <div className="col-md-8">
        <label className="form-label" htmlFor={`trg-name${suffix}`}>Binding name</label>
        <input
          type="text" className="form-control" id={`trg-name${suffix}`}
          placeholder="e.g. Invoice overdue → charge late fee"
          value={draft.name} onChange={(event) => field('name', event.target.value)}
        />
      </div>
      <div className="col-md-4">
        <label className="form-label" htmlFor={`trg-mod${suffix}`}>Module</label>
        <select
          className="form-select" id={`trg-mod${suffix}`}
          value={draft.module} onChange={(event) => field('module', event.target.value)}
        >
          {moduleOptions.map((option) => <option key={option}>{option}</option>)}
        </select>
      </div>
      <div className="col-12">
        <label className="form-label" htmlFor={`trg-desc${suffix}`}>Description</label>
        <textarea
          className="form-control" id={`trg-desc${suffix}`} rows={2}
          placeholder="What this binding reacts to, and why it exists."
          value={draft.description} onChange={(event) => field('description', event.target.value)}
        />
      </div>
      <div className="col-md-5">
        <label className="form-label" htmlFor={`trg-event${suffix}`}>Event</label>
        <select
          className="form-select" id={`trg-event${suffix}`}
          value={draft.event} onChange={(event) => field('event', event.target.value)}
        >
          {eventOptions.map((option) => <option key={option}>{option}</option>)}
        </select>
      </div>
      <div className="col-md-7">
        <label className="form-label" htmlFor={`trg-src${suffix}`}>Event source</label>
        <input
          type="text" className="form-control" id={`trg-src${suffix}`}
          placeholder={draft.event === 'Scheduled' ? 'e.g. 10:15 on school days' : 'e.g. invoice.due_date'}
          value={draft.eventSource} onChange={(event) => field('eventSource', event.target.value)}
        />
      </div>
      <div className="col-md-5">
        <label className="form-label" htmlFor={`trg-act${suffix}`}>Action</label>
        <select
          className="form-select" id={`trg-act${suffix}`}
          value={draft.action} onChange={(event) => field('action', event.target.value)}
        >
          {actionOptions.map((option) => <option key={option}>{option}</option>)}
        </select>
      </div>
      <div className="col-md-7">
        <label className="form-label" htmlFor={`trg-target${suffix}`}>Action target</label>
        <input
          type="text" className="form-control" id={`trg-target${suffix}`}
          placeholder="e.g. Parents of absentees"
          value={draft.actionTarget} onChange={(event) => field('actionTarget', event.target.value)}
        />
      </div>
      <div className="col-md-6">
        <label className="form-label" htmlFor={`trg-owner${suffix}`}>Owner</label>
        <select
          className="form-select" id={`trg-owner${suffix}`}
          value={draft.owner} onChange={(event) => field('owner', event.target.value)}
        >
          {ownerOptions.map((option) => <option key={option}>{option}</option>)}
        </select>
      </div>
      <div className="col-12">
        <div className="d-flex align-items-center justify-content-between border rounded p-2 mb-0">
          <div>
            <h6 className="fs-13 mb-0">Test mode</h6>
            <span className="fs-12 text-muted">
              The binding runs and logs, but touches no real records
            </span>
          </div>
          <div className="form-check form-switch mb-0">
            <input
              className="form-check-input" type="checkbox" role="switch" id={`trg-test${suffix}`}
              checked={draft.testMode} onChange={(event) => field('testMode', event.target.checked)}
            />
            <label className="form-check-label visually-hidden" htmlFor={`trg-test${suffix}`}>
              Test mode
            </label>
          </div>
        </div>
      </div>
      {/* The binding as it will read on the board. */}
      {draft.eventSource && draft.actionTarget ? (
        <div className="col-12">
          <div className="border rounded p-3">
            <h6 className="fs-13 mb-1">This binding reads as</h6>
            <p className="fs-13 text-muted mb-0">
              On {draft.event.toLowerCase()} of {draft.eventSource} → {draft.action.toLowerCase()} ·{' '}
              {draft.actionTarget}
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );

  return (
    <>
      {/* Create */}
      <Modal
        open={active === 'create'}
        onClose={onClose}
        title="Create binding"
        dialogClassName="modal-lg"
        onSubmit={(event) => { event.preventDefault(); onCreate(draft); }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Create disarmed</button>
          </>
        }
      >
        <p className="fs-12 text-muted mb-3">
          A new binding is created disarmed and in test mode. Arming it is a separate step.
        </p>
        {form('')}
      </Modal>

      {/* Edit */}
      <Modal
        open={active === 'edit' && row !== null}
        onClose={onClose}
        title="Edit binding"
        dialogClassName="modal-lg"
        onSubmit={(event) => { event.preventDefault(); onUpdate(draft); }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Save changes</button>
          </>
        }
      >
        {row ? (
          <>
            <p className="fs-12 text-muted mb-3">
              {row.id} · fired {row.fired.toLocaleString()} times
            </p>
            {/* Changing a live binding changes what it does to real records. */}
            {row.enabled && !row.testMode ? (
              <div className="alert alert-warning d-flex align-items-center gap-2 mb-3">
                <i className="ti ti-alert-triangle fs-16" />
                <span className="fs-13">
                  This binding is armed and firing about {firesPerDayOf(row)} times a day. A change
                  takes effect on the next event.
                </span>
              </div>
            ) : null}
            {form('-2')}
          </>
        ) : null}
      </Modal>

      {/* Arm / disarm */}
      <Modal
        open={active === 'arm' && row !== null}
        onClose={onClose}
        title={row?.enabled ? 'Pause binding' : 'Arm binding'}
        onSubmit={(event) => { event.preventDefault(); onArm({ testMode, note }); }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="submit" className={`btn ${row?.enabled ? 'btn-outline-light bg-white' : 'btn-primary'}`}>
              {row?.enabled ? 'Pause it' : 'Arm it'}
            </button>
          </>
        }
      >
        {row ? (
          <>
            <p className="fs-12 text-muted mb-3">
              {row.enabled
                ? 'A paused binding stays configured but stops reacting. Events that fire while it is paused are not queued.'
                : 'Once armed, the binding reacts to every matching event until it is paused again.'}
            </p>
            <div className="border rounded p-3 mb-3">
              <Row label="Binding" value={row.name} />
              <Row
                label="Reads as"
                value={`${row.event} · ${row.eventSource} → ${row.action}`}
              />
              {/* What arming it is actually about to start doing. */}
              <Row
                label="Historic rate"
                value={hasFired(row)
                  ? `${firesPerDayOf(row)} fires a day · ${row.fired.toLocaleString()} total`
                  : 'Never fired'}
              />
              <Row
                label="Health"
                value={<span className={healthBadge[healthOf(row)]}>{healthOf(row)}</span>}
              />
              {row.lastError ? <Row label="Last error" value={row.lastError} /> : null}
            </div>
            <div className="d-flex align-items-center justify-content-between border rounded p-2 mb-3">
              <div>
                <h6 className="fs-13 mb-0">Keep it in test mode</h6>
                <span className="fs-12 text-muted">
                  It will log every run without touching a record
                </span>
              </div>
              <div className="form-check form-switch mb-0">
                <input
                  className="form-check-input" type="checkbox" role="switch" id="trg-arm-test"
                  checked={testMode} onChange={(event) => setTestMode(event.target.checked)}
                />
                <label className="form-check-label visually-hidden" htmlFor="trg-arm-test">
                  Keep it in test mode
                </label>
              </div>
            </div>
            <div className="mb-0">
              <label className="form-label" htmlFor="trg-arm-note">Note</label>
              <textarea
                className="form-control" id="trg-arm-note" rows={2}
                placeholder="Recorded against the binding's history."
                value={note} onChange={(event) => setNote(event.target.value)}
              />
            </div>
          </>
        ) : null}
      </Modal>

      {/* Test */}
      <Modal
        open={active === 'test' && row !== null}
        onClose={onClose}
        title="Test this binding"
        onSubmit={(event) => { event.preventDefault(); onTest({ sample }); }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Run the test</button>
          </>
        }
      >
        {row ? (
          <>
            <p className="fs-12 text-muted mb-3">
              The action runs against a sample and reports what it would have done. Nothing is
              written and nobody is notified.
            </p>
            <div className="border rounded p-3 mb-3">
              <Row label="Event" value={`${row.event} · ${row.eventSource}`} />
              <Row label="Action" value={`${row.action} · ${row.actionTarget}`} />
              <Row
                label="Success rate"
                value={hasFired(row) ? `${successRateOf(row)}% of ${row.fired.toLocaleString()}` : 'Never fired'}
              />
              <Row label="Average latency" value={latencyLabelOf(row)} />
              {failedOf(row) > 0 ? (
                <Row label="Failures" value={`${failedOf(row)} · ${row.lastError}`} />
              ) : null}
            </div>
            <div className="mb-0">
              <label className="form-label" htmlFor="trg-sample">Run against</label>
              <select
                className="form-select" id="trg-sample"
                value={sample} onChange={(event) => setSample(event.target.value)}
              >
                {sampleOptions.map((option) => (
                  <option
                    key={option}
                    /* There is no failing record to replay if it has never failed. */
                    disabled={option === sampleOptions[2] && failedOf(row) === 0}
                  >
                    {option}
                  </option>
                ))}
              </select>
              {averageLatencyOf(row) >= 1000 ? (
                <span className="fs-12 text-muted">
                  This binding averages {latencyLabelOf(row)} — the test will take about as long.
                </span>
              ) : null}
            </div>
          </>
        ) : null}
      </Modal>

      {/* Delete */}
      <Modal
        open={active === 'delete' && row !== null}
        onClose={onClose}
        title=""
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="button" className="btn btn-danger" onClick={onDelete}>Delete binding</button>
          </>
        }
      >
        {row ? (
          <div className="text-center">
            <span className="avatar avatar-xl bg-danger-transparent text-danger rounded-circle mb-3">
              <i className="ti ti-trash fs-24" />
            </span>
            <h5 className="mb-2">Delete {row.name}?</h5>
            <p className="text-muted mb-0">
              {row.workflow
                ? `This binding belongs to the "${row.workflow}" workflow, which will stop reacting to ${row.eventSource}.`
                : 'This is a standalone binding — no workflow depends on it.'}
            </p>
          </div>
        ) : null}
      </Modal>
    </>
  );
};

export default TriggerModals;
