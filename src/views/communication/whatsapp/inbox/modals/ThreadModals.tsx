import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import Modal from '@components/ui/Modal';
import type { Thread } from '../data/threads.data';
import {
  assigneeOptions,
  durationText,
  firstResponseLabelOf,
  hasReplied,
  isSessionOpen,
  labelBadge,
  labelOptions,
  sessionLabelOf,
  slaBadge,
  slaStateOf,
  slaSubLabelOf,
  teamOptions,
  waitingMinutesOf,
} from '../data/threads.data';

export type ThreadModalId = 'assign' | 'reply' | 'snooze' | 'resolve' | 'label';

export interface AssignPayload {
  assignee: string;
  team: string;
  note: string;
  notify: boolean;
}

export interface ReplyPayload {
  template: string;
  body: string;
  resolveAfter: boolean;
}

export interface SnoozePayload {
  until: string;
  reason: string;
}

export interface ResolvePayload {
  outcome: string;
  note: string;
  sendClosing: boolean;
}

export interface LabelPayload {
  label: string;
  flagged: boolean;
}

export interface ThreadModalsProps {
  active: ThreadModalId | null;
  row: Thread | null;
  onClose: () => void;
  onAssign: (payload: AssignPayload) => void;
  onReply: (payload: ReplyPayload) => void;
  onSnooze: (payload: SnoozePayload) => void;
  onResolve: (payload: ResolvePayload) => void;
  onLabel: (payload: LabelPayload) => void;
}

const Row = ({ label, value }: { label: string; value: ReactNode }) => (
  <div className="d-flex align-items-center justify-content-between gap-3 mb-2">
    <span className="fs-13 text-muted">{label}</span>
    <span className="fs-13 fw-medium text-end">{value}</span>
  </div>
);

const templateOptions = [
  'Fee Reminder', 'Attendance Alert', 'Exam Reminder', 'Holiday Notice', 'Emergency Alert',
];

const snoozeOptions = ['Later today', 'Tomorrow morning', 'In three days', 'Next Monday'];

const outcomeOptions = ['Answered in full', 'Passed to another team', 'No reply needed'];

const ThreadModals = ({
  active, row, onClose, onAssign, onReply, onSnooze, onResolve, onLabel,
}: ThreadModalsProps) => {
  const [assignee, setAssignee] = useState(assigneeOptions[0]);
  const [team, setTeam] = useState(teamOptions[0]);
  const [assignNote, setAssignNote] = useState('');
  const [notify, setNotify] = useState(true);

  const [template, setTemplate] = useState(templateOptions[0]);
  const [body, setBody] = useState('');
  const [resolveAfter, setResolveAfter] = useState(false);

  const [until, setUntil] = useState(snoozeOptions[1]);
  const [snoozeReason, setSnoozeReason] = useState('');

  const [outcome, setOutcome] = useState(outcomeOptions[0]);
  const [resolveNote, setResolveNote] = useState('');
  const [sendClosing, setSendClosing] = useState(false);

  const [label, setLabel] = useState(labelOptions[0]);
  const [flagged, setFlagged] = useState(false);

  useEffect(() => {
    if (!row) return;
    if (active === 'assign') {
      setAssignee(row.assignedTo === 'Unassigned' ? assigneeOptions[0] : row.assignedTo);
      setTeam(row.team);
      setAssignNote('');
    }
    if (active === 'reply') { setBody(''); setResolveAfter(false); }
    if (active === 'snooze') { setUntil(snoozeOptions[1]); setSnoozeReason(''); }
    if (active === 'resolve') { setOutcome(outcomeOptions[0]); setResolveNote(''); }
    if (active === 'label') { setLabel(row.label); setFlagged(row.flagged); }
  }, [active, row]);

  const sessionOpen = row ? isSessionOpen(row) : false;

  return (
    <>
      {/* Assign */}
      <Modal
        open={active === 'assign' && row !== null}
        onClose={onClose}
        title="Assign this thread"
        onSubmit={(event) => {
          event.preventDefault();
          onAssign({ assignee, team, note: assignNote, notify });
        }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Assign</button>
          </>
        }
      >
        {row ? (
          <>
            <div className="border rounded p-3 mb-3">
              <Row label="Contact" value={row.contact} />
              <Row label="Currently" value={row.assignedTo} />
              <Row
                label="Waiting"
                value={waitingMinutesOf(row) > 0 ? durationText(waitingMinutesOf(row)) : 'Not waiting'}
              />
              {/* The target this thread is measured against right now. */}
              <Row
                label="Against target"
                value={<span className={slaBadge[slaStateOf(row)]}>{slaSubLabelOf(row)}</span>}
              />
            </div>
            <div className="row g-3 mb-3">
              <div className="col-md-6">
                <label className="form-label" htmlFor="thr-assignee">Assign to</label>
                <select
                  className="form-select" id="thr-assignee"
                  value={assignee} onChange={(event) => setAssignee(event.target.value)}
                >
                  {assigneeOptions.map((option) => <option key={option}>{option}</option>)}
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label" htmlFor="thr-team">Team</label>
                <select
                  className="form-select" id="thr-team"
                  value={team} onChange={(event) => setTeam(event.target.value)}
                >
                  {teamOptions.map((option) => <option key={option}>{option}</option>)}
                </select>
              </div>
            </div>
            <div className="mb-3">
              <label className="form-label" htmlFor="thr-assign-note">Handover note</label>
              <textarea
                className="form-control" id="thr-assign-note" rows={2}
                placeholder="What the next person needs to know."
                value={assignNote} onChange={(event) => setAssignNote(event.target.value)}
              />
            </div>
            <div className="d-flex align-items-center justify-content-between border rounded p-2 mb-0">
              <div>
                <h6 className="fs-13 mb-0">Notify the assignee</h6>
                <span className="fs-12 text-muted">A push to their app inbox</span>
              </div>
              <div className="form-check form-switch mb-0">
                <input
                  className="form-check-input" type="checkbox" role="switch" id="thr-notify"
                  checked={notify} onChange={(event) => setNotify(event.target.checked)}
                />
                <label className="form-check-label visually-hidden" htmlFor="thr-notify">
                  Notify the assignee
                </label>
              </div>
            </div>
          </>
        ) : null}
      </Modal>

      {/* Reply */}
      <Modal
        open={active === 'reply' && row !== null}
        onClose={onClose}
        title="Reply"
        onSubmit={(event) => {
          event.preventDefault();
          onReply({ template, body, resolveAfter });
        }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">
              <i className="ti ti-send me-1" />Send reply
            </button>
          </>
        }
      >
        {row ? (
          <>
            <div className="border rounded p-3 mb-3">
              <Row label="Contact" value={`${row.contact} · ${row.phone}`} />
              <Row label="Channel" value={row.channel} />
              <Row label="Session window" value={sessionLabelOf(row)} />
              <Row label="First response" value={firstResponseLabelOf(row)} />
            </div>

            {/* The platform's rule, not a preference. */}
            {!sessionOpen ? (
              <div className="alert alert-warning d-flex align-items-center gap-2 mb-3">
                <i className="ti ti-lock fs-16" />
                <span className="fs-13">
                  The 24-hour window has closed on this thread. Only an approved template can be
                  sent.
                </span>
              </div>
            ) : null}

            <div className="mb-3">
              <label className="form-label" htmlFor="thr-template">Template</label>
              <select
                className="form-select" id="thr-template"
                value={template} onChange={(event) => setTemplate(event.target.value)}
              >
                {sessionOpen ? <option>— None, free reply —</option> : null}
                {templateOptions.map((option) => <option key={option}>{option}</option>)}
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label" htmlFor="thr-body">Message</label>
              <textarea
                className="form-control" id="thr-body" rows={4}
                placeholder={sessionOpen ? 'Write the reply…' : 'The template is sent as registered'}
                disabled={!sessionOpen}
                value={body} onChange={(event) => setBody(event.target.value)}
              />
            </div>
            <div className="d-flex align-items-center justify-content-between border rounded p-2 mb-0">
              <div>
                <h6 className="fs-13 mb-0">Resolve the thread after sending</h6>
                <span className="fs-12 text-muted">Closes it in the register</span>
              </div>
              <div className="form-check form-switch mb-0">
                <input
                  className="form-check-input" type="checkbox" role="switch" id="thr-resolve-after"
                  checked={resolveAfter} onChange={(event) => setResolveAfter(event.target.checked)}
                />
                <label className="form-check-label visually-hidden" htmlFor="thr-resolve-after">
                  Resolve after sending
                </label>
              </div>
            </div>
          </>
        ) : null}
      </Modal>

      {/* Snooze */}
      <Modal
        open={active === 'snooze' && row !== null}
        onClose={onClose}
        title="Snooze this thread"
        onSubmit={(event) => {
          event.preventDefault();
          onSnooze({ until, reason: snoozeReason });
        }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Snooze</button>
          </>
        }
      >
        {row ? (
          <>
            <p className="fs-12 text-muted mb-3">
              A snoozed thread drops out of the waiting list until it comes back. The reply target
              keeps running underneath.
            </p>
            <div className="mb-3">
              <label className="form-label" htmlFor="thr-until">Bring it back</label>
              <select
                className="form-select" id="thr-until"
                value={until} onChange={(event) => setUntil(event.target.value)}
              >
                {snoozeOptions.map((option) => <option key={option}>{option}</option>)}
              </select>
            </div>
            <div className="mb-0">
              <label className="form-label" htmlFor="thr-snooze-reason">Reason</label>
              <textarea
                className="form-control" id="thr-snooze-reason" rows={2}
                placeholder="What has to happen before this can be answered."
                value={snoozeReason} onChange={(event) => setSnoozeReason(event.target.value)}
              />
            </div>
          </>
        ) : null}
      </Modal>

      {/* Resolve */}
      <Modal
        open={active === 'resolve' && row !== null}
        onClose={onClose}
        title="Resolve this thread"
        onSubmit={(event) => {
          event.preventDefault();
          onResolve({ outcome, note: resolveNote, sendClosing });
        }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Resolve</button>
          </>
        }
      >
        {row ? (
          <>
            {/* Closing something nobody answered is worth saying out loud. */}
            {!hasReplied(row) ? (
              <div className="alert alert-warning d-flex align-items-center gap-2 mb-3">
                <i className="ti ti-alert-triangle fs-16" />
                <span className="fs-13">
                  Nobody has replied to this thread. Resolving it now closes it unanswered after
                  {' '}{durationText(waitingMinutesOf(row))}.
                </span>
              </div>
            ) : null}
            <div className="border rounded p-3 mb-3">
              <Row label="Contact" value={row.contact} />
              <Row label="First response" value={firstResponseLabelOf(row)} />
              <Row
                label="Against target"
                value={<span className={slaBadge[slaStateOf(row)]}>{slaStateOf(row)}</span>}
              />
              <Row label="Messages" value={row.messages} />
            </div>
            <div className="mb-3">
              <label className="form-label" htmlFor="thr-outcome">Outcome</label>
              <select
                className="form-select" id="thr-outcome"
                value={outcome} onChange={(event) => setOutcome(event.target.value)}
              >
                {outcomeOptions.map((option) => <option key={option}>{option}</option>)}
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label" htmlFor="thr-resolve-note">Closing note</label>
              <textarea
                className="form-control" id="thr-resolve-note" rows={2}
                placeholder="Recorded against the thread."
                value={resolveNote} onChange={(event) => setResolveNote(event.target.value)}
              />
            </div>
            <div className="d-flex align-items-center justify-content-between border rounded p-2 mb-0">
              <div>
                <h6 className="fs-13 mb-0">Send a closing message</h6>
                <span className="fs-12 text-muted">
                  {isSessionOpen(row) ? 'A short reply before closing' : 'Needs a template — the window has closed'}
                </span>
              </div>
              <div className="form-check form-switch mb-0">
                <input
                  className="form-check-input" type="checkbox" role="switch" id="thr-closing"
                  checked={sendClosing} onChange={(event) => setSendClosing(event.target.checked)}
                />
                <label className="form-check-label visually-hidden" htmlFor="thr-closing">
                  Send a closing message
                </label>
              </div>
            </div>
          </>
        ) : null}
      </Modal>

      {/* Label */}
      <Modal
        open={active === 'label' && row !== null}
        onClose={onClose}
        title="Label this thread"
        onSubmit={(event) => { event.preventDefault(); onLabel({ label, flagged }); }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Save</button>
          </>
        }
      >
        {row ? (
          <>
            <p className="fs-12 text-muted mb-3">
              A label routes the thread and groups it in the register. Flagging it brings it to a
              supervisor's attention.
            </p>
            <div className="mb-3">
              <span className="form-label d-block">Label</span>
              <div className="d-flex flex-wrap gap-3">
                {labelOptions.map((option) => (
                  <div className="form-check" key={option}>
                    <input
                      className="form-check-input" type="radio" name="thr-label"
                      id={`thr-label-${option}`} checked={label === option}
                      onChange={() => setLabel(option)}
                    />
                    <label className="form-check-label fs-13" htmlFor={`thr-label-${option}`}>
                      <span className={labelBadge[option] ?? 'badge badge-soft-secondary'}>{option}</span>
                    </label>
                  </div>
                ))}
              </div>
            </div>
            <div className="d-flex align-items-center justify-content-between border rounded p-2 mb-0">
              <div>
                <h6 className="fs-13 mb-0">Flag for review</h6>
                <span className="fs-12 text-muted">Shows in the supervisor's list</span>
              </div>
              <div className="form-check form-switch mb-0">
                <input
                  className="form-check-input" type="checkbox" role="switch" id="thr-flag"
                  checked={flagged} onChange={(event) => setFlagged(event.target.checked)}
                />
                <label className="form-check-label visually-hidden" htmlFor="thr-flag">
                  Flag for review
                </label>
              </div>
            </div>
          </>
        ) : null}
      </Modal>
    </>
  );
};

export default ThreadModals;
