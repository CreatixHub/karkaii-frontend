import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import DateField from '@components/ui/DateField';
import Modal from '@components/ui/Modal';
import type { AlertType, HealthAlert, Severity } from '../data/alerts.data';
import {
  REGISTER_TIME,
  acknowledgedOf,
  affectedGroupChoices,
  audienceChoices,
  channelChoices,
  detailPairsOf,
  durationText,
  escalationReasons,
  escalationTargets,
  firstNotificationBadgeOf,
  firstNotificationLabelOf,
  followUpChoices,
  notificationBadge,
  notificationCountLabelOf,
  notificationStateOf,
  openMinutesOf,
  raisedLabelOf,
  releasedOf,
  reporterChoices,
  resolutionOutcomes,
  sentOf,
  severityBadge,
  severityChoices,
  statusBadge,
  statusOf,
  typeBadge,
  typeIcon,
  typeOptions,
  typeTint,
  windowHoursOf,
} from '../data/alerts.data';

export type AlertModalId = 'create' | 'edit' | 'send' | 'escalate' | 'resolve' | 'view';

export interface AlertDraft {
  severity: Severity;
  alertId: string;
  title: string;
  type: AlertType;
  raisedOn: string;
  raisedAt: string;
  summary: string;
  group: string;
  reporter: string;
  individuals: string;
  linkedVisit: string;
  medical: string;
  actions: string;
  monitorUntil: string;
  notes: string;
  publish: boolean;
  notify: boolean;
}

export const emptyDraft: AlertDraft = {
  severity: 'Medium', alertId: '', title: '', type: typeOptions[0],
  raisedOn: '31-07-2026', raisedAt: REGISTER_TIME, summary: '',
  group: affectedGroupChoices[0], reporter: reporterChoices[0],
  individuals: '', linkedVisit: '', medical: '', actions: '', monitorUntil: '',
  notes: '', publish: true, notify: true,
};

const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** "31 Jul 2026" → "31-07-2026", which is what the date inputs take. */
const toInputDate = (value: string): string => {
  if (!value) return '';
  const [day, month, year] = value.split(' ');
  const index = monthNames.indexOf(month);
  return index === -1 ? '' : `${day.padStart(2, '0')}-${String(index + 1).padStart(2, '0')}-${year}`;
};

/** "31-07-2026" → "31 Jul 2026", the way a row prints a date. */
export const toRowDate = (value: string): string => {
  if (!value) return '';
  const [day, month, year] = value.split('-');
  return monthNames[Number(month) - 1]
    ? `${Number(day)} ${monthNames[Number(month) - 1]} ${year}`
    : value;
};

export const draftOf = (row: HealthAlert): AlertDraft => ({
  severity: row.severity,
  alertId: row.id,
  title: row.title,
  type: row.type,
  raisedOn: toInputDate(row.raisedDate),
  raisedAt: row.raisedTime,
  summary: row.summary,
  group: affectedGroupChoices.find((option) => option === row.group) ?? affectedGroupChoices[0],
  reporter: reporterChoices.find((choice) => choice.startsWith(row.reporter)) ?? reporterChoices[0],
  individuals: row.individuals.map((person) => person.name).join(', '),
  linkedVisit: row.linkedVisit,
  medical: row.medical.join('\n'),
  actions: row.actions.map((action) => `${action.task} — ${action.owner}`).join('\n'),
  monitorUntil: toInputDate(row.monitorUntil),
  notes: row.notes,
  publish: row.published,
  notify: releasedOf(row).length > 0,
});

export interface NotifyPayload {
  channel: string;
  audience: string;
  sendAt: string;
  sentBy: string;
  message: string;
  requireAck: boolean;
  chase: boolean;
}

export interface EscalatePayload {
  target: string;
  severity: Severity;
  escalatedAt: string;
  escalatedBy: string;
  reason: string;
  notes: string;
  page: boolean;
  widen: boolean;
}

export interface ResolvePayload {
  outcome: string;
  resolvedAt: string;
  resolvedBy: string;
  followUp: string;
  summary: string;
  closingNotice: boolean;
  fileReport: boolean;
}

export interface AlertModalsProps {
  active: AlertModalId | null;
  row: HealthAlert | null;
  onClose: () => void;
  onCreate: (draft: AlertDraft) => void;
  onUpdate: (draft: AlertDraft) => void;
  onNotify: (payload: NotifyPayload) => void;
  onEscalate: (payload: EscalatePayload) => void;
  onResolve: (payload: ResolvePayload) => void;
  onOpen: (modal: AlertModalId) => void;
  onOpenPanel: () => void;
}

const Row = ({ label, value, last = false }: { label: string; value: ReactNode; last?: boolean }) => (
  <div className={`d-flex align-items-center justify-content-between ${last ? 'mb-0' : 'mb-2'}`}>
    <span className="fs-13 text-muted">{label}</span>
    <span className="fs-13 fw-medium text-end">{value}</span>
  </div>
);

const AlertStrip = ({ row, children }: { row: HealthAlert; children?: ReactNode }) => (
  <div className="d-flex align-items-center gap-2 border rounded p-2 mb-3">
    <span className={`avatar avatar-md bg-${typeTint[row.type]}-transparent text-${typeTint[row.type]} rounded flex-shrink-0`}>
      <i className={typeIcon[row.type]} />
    </span>
    <div className="flex-fill overflow-hidden">
      <h5 className="fs-14 mb-0 text-truncate">{row.title}</h5>
      <span className="fs-12 text-muted text-truncate d-block">{row.id} · {row.type}</span>
    </div>
    {children ?? <span className={statusBadge[statusOf(row)]}>{statusOf(row)}</span>}
  </div>
);

/* ---------------------------------- Form ----------------------------------- */

interface FormProps {
  draft: AlertDraft;
  onField: (field: keyof AlertDraft, value: string | boolean) => void;
  suffix: string;
  mode: 'create' | 'edit';
}

/** The window the chosen severity buys, printed as the choice is made. */
const windowForSeverity = (severity: Severity): number =>
  severity === 'Critical' ? 1 : severity === 'High' ? 4 : severity === 'Medium' ? 24 : 72;

const AlertForm = ({ draft, onField, suffix, mode }: FormProps) => (
  <>
    {mode === 'create' ? (
      <div className="mb-3">
        <span className="form-label d-block">Severity · sets the response window</span>
        <div className="d-flex flex-wrap gap-3">
          {severityChoices.map((choice) => (
            <div className="form-check" key={choice.severity}>
              <input
                className="form-check-input" type="radio" name="alert-severity"
                id={`cha-${choice.severity}${suffix}`} checked={draft.severity === choice.severity}
                onChange={() => onField('severity', choice.severity)}
              />
              <label className="form-check-label fs-13" htmlFor={`cha-${choice.severity}${suffix}`}>
                {choice.label}
              </label>
            </div>
          ))}
        </div>
      </div>
    ) : null}

    <div className="row">
      <div className="col-md-4"><div className="mb-3">
        <label className="form-label" htmlFor={`ha-id${suffix}`}>Alert ID</label>
        <input
          type="text" className="form-control" id={`ha-id${suffix}`} placeholder="Generated on save"
          value={draft.alertId} onChange={(event) => onField('alertId', event.target.value)}
        />
      </div></div>
      <div className="col-md-8"><div className="mb-3">
        <label className="form-label" htmlFor={`ha-title${suffix}`}>Alert Title</label>
        <input
          type="text" className="form-control" id={`ha-title${suffix}`}
          placeholder="e.g. Sore throat cluster in Class V A"
          value={draft.title} onChange={(event) => onField('title', event.target.value)}
        />
      </div></div>
      <div className="col-md-4"><div className="mb-3">
        <label className="form-label" htmlFor={`ha-type${suffix}`}>Alert Type</label>
        <select
          className="form-select" id={`ha-type${suffix}`}
          value={draft.type} onChange={(event) => onField('type', event.target.value)}
        >
          {typeOptions.map((option) => <option key={option}>{option}</option>)}
        </select>
      </div></div>
      <div className="col-md-4"><div className="mb-3">
        <label className="form-label" htmlFor={`ha-raised-on${suffix}`}>Raised On</label>
        <DateField
          id={`ha-raised-on${suffix}`} value={draft.raisedOn}
          onChange={(next) => onField('raisedOn', next)}
        />
      </div></div>
      <div className="col-md-4"><div className="mb-3">
        <label className="form-label" htmlFor={`ha-raised-at${suffix}`}>Raised At</label>
        <input
          type="time" className="form-control" id={`ha-raised-at${suffix}`}
          value={draft.raisedAt} onChange={(event) => onField('raisedAt', event.target.value)}
        />
        {/* What the severity commits the health room to. */}
        <span className="fs-12 text-muted">
          {windowForSeverity(draft.severity)} hour response window
        </span>
      </div></div>
      <div className="col-md-12"><div className="mb-3">
        <label className="form-label" htmlFor={`ha-summary${suffix}`}>Alert Summary</label>
        <textarea
          className="form-control" rows={2} id={`ha-summary${suffix}`}
          placeholder="One or two sentences that will appear on the notification"
          value={draft.summary} onChange={(event) => onField('summary', event.target.value)}
        />
      </div></div>
    </div>

    <h6 className="fs-13 mb-2">Scope &amp; Ownership</h6>
    <div className="row">
      <div className="col-md-6"><div className="mb-3">
        <label className="form-label" htmlFor={`ha-group${suffix}`}>Affected Group</label>
        <select
          className="form-select" id={`ha-group${suffix}`}
          value={draft.group} onChange={(event) => onField('group', event.target.value)}
        >
          {affectedGroupChoices.map((option) => <option key={option}>{option}</option>)}
        </select>
      </div></div>
      <div className="col-md-6"><div className="mb-3">
        <label className="form-label" htmlFor={`ha-reporter${suffix}`}>Reported By</label>
        <select
          className="form-select" id={`ha-reporter${suffix}`}
          value={draft.reporter} onChange={(event) => onField('reporter', event.target.value)}
        >
          {reporterChoices.map((option) => <option key={option}>{option}</option>)}
        </select>
      </div></div>
      <div className="col-md-6"><div className="mb-3">
        <label className="form-label" htmlFor={`ha-individuals${suffix}`}>Affected Individuals</label>
        <input
          type="text" className="form-control" id={`ha-individuals${suffix}`}
          placeholder="Names or class, comma separated"
          value={draft.individuals} onChange={(event) => onField('individuals', event.target.value)}
        />
      </div></div>
      <div className="col-md-6"><div className="mb-3">
        <label className="form-label" htmlFor={`ha-link${suffix}`}>Linked Medical Visit</label>
        <input
          type="text" className="form-control" id={`ha-link${suffix}`}
          placeholder="e.g. MV-2026-0518 or VIS-2026-0426"
          value={draft.linkedVisit} onChange={(event) => onField('linkedVisit', event.target.value)}
        />
      </div></div>
    </div>

    <h6 className="fs-13 mb-2">Medical Information &amp; Actions</h6>
    <div className="row">
      <div className="col-md-12"><div className="mb-3">
        <label className="form-label" htmlFor={`ha-medical${suffix}`}>Symptoms and Medical Information</label>
        <textarea
          className="form-control" rows={2} id={`ha-medical${suffix}`}
          placeholder="One observation per line"
          value={draft.medical} onChange={(event) => onField('medical', event.target.value)}
        />
      </div></div>
      <div className="col-md-12"><div className="mb-3">
        <label className="form-label" htmlFor={`ha-actions${suffix}`}>Recommended Actions</label>
        <textarea
          className="form-control" rows={2} id={`ha-actions${suffix}`}
          placeholder="One action per line, as “task — owner”"
          value={draft.actions} onChange={(event) => onField('actions', event.target.value)}
        />
      </div></div>
      <div className="col-md-6"><div className="mb-3">
        <label className="form-label" htmlFor={`ha-monitor${suffix}`}>Monitor Until</label>
        <DateField
          id={`ha-monitor${suffix}`} value={draft.monitorUntil}
          onChange={(next) => onField('monitorUntil', next)}
        />
        <span className="fs-12 text-muted">Leave empty to keep the alert standing</span>
      </div></div>
      <div className="col-md-6"><div className="mb-3">
        <label className="form-label" htmlFor={`ha-attachment${suffix}`}>Attachment</label>
        <input type="file" className="form-control" id={`ha-attachment${suffix}`} />
      </div></div>
      <div className="col-md-12"><div className="mb-3">
        <label className="form-label" htmlFor={`ha-notes${suffix}`}>Internal Notes</label>
        <textarea
          className="form-control" rows={2} id={`ha-notes${suffix}`}
          placeholder="Visible to the health room and administration only"
          value={draft.notes} onChange={(event) => onField('notes', event.target.value)}
        />
      </div></div>
      <div className="col-md-12">
        {mode === 'create' ? (
          <>
            <div className="form-check form-switch mb-2">
              <input
                className="form-check-input" type="checkbox" role="switch" id={`chaPublish${suffix}`}
                checked={draft.publish} onChange={(event) => onField('publish', event.target.checked)}
              />
              <label className="form-check-label fs-13" htmlFor={`chaPublish${suffix}`}>
                Publish immediately rather than saving as a draft
              </label>
            </div>
            <div className="form-check form-switch mb-0">
              <input
                className="form-check-input" type="checkbox" role="switch" id={`chaNotify${suffix}`}
                /* Nothing goes out while the alert is still a draft. */
                disabled={!draft.publish}
                checked={draft.notify && draft.publish}
                onChange={(event) => onField('notify', event.target.checked)}
              />
              <label className="form-check-label fs-13" htmlFor={`chaNotify${suffix}`}>
                Send the first notification as soon as it is published
              </label>
            </div>
          </>
        ) : (
          <div className="form-check form-switch mb-0">
            <input
              className="form-check-input" type="checkbox" role="switch" id={`ehaAudit${suffix}`}
              checked={draft.notify} onChange={(event) => onField('notify', event.target.checked)}
            />
            <label className="form-check-label fs-13" htmlFor={`ehaAudit${suffix}`}>
              Record this amendment on the audit trail
            </label>
          </div>
        )}
      </div>
    </div>
  </>
);

/* --------------------------------- Modals ---------------------------------- */

const AlertModals = ({
  active, row, onClose, onCreate, onUpdate, onNotify, onEscalate, onResolve, onOpen, onOpenPanel,
}: AlertModalsProps) => {
  const [draft, setDraft] = useState<AlertDraft>(emptyDraft);

  const [channel, setChannel] = useState(channelChoices[0].id);
  const [audience, setAudience] = useState(audienceChoices[0]);
  const [sendAt, setSendAt] = useState(REGISTER_TIME);
  const [sentBy, setSentBy] = useState(reporterChoices[0]);
  const [message, setMessage] = useState('');
  const [requireAck, setRequireAck] = useState(true);
  const [chase, setChase] = useState(true);

  const [target, setTarget] = useState(escalationTargets[0].id);
  const [newSeverity, setNewSeverity] = useState<Severity>('Critical');
  const [escalatedAt, setEscalatedAt] = useState(REGISTER_TIME);
  const [escalatedBy, setEscalatedBy] = useState(reporterChoices[0]);
  const [reason, setReason] = useState(escalationReasons[0]);
  const [escalationNotes, setEscalationNotes] = useState('');
  const [pageTeam, setPageTeam] = useState(true);
  const [widen, setWiden] = useState(false);

  const [outcome, setOutcome] = useState(resolutionOutcomes[0].id);
  const [resolvedAt, setResolvedAt] = useState(REGISTER_TIME);
  const [resolvedBy, setResolvedBy] = useState(reporterChoices[0]);
  const [followUp, setFollowUp] = useState(followUpChoices[0]);
  const [resolutionSummary, setResolutionSummary] = useState('');
  const [closingNotice, setClosingNotice] = useState(true);
  const [fileReport, setFileReport] = useState(true);

  useEffect(() => {
    if (active === 'create') setDraft(emptyDraft);
    else if (active === 'edit' && row) setDraft(draftOf(row));

    if (!row) return;
    const reporter = reporterChoices.find((choice) => choice.startsWith(row.reporter)) ?? reporterChoices[0];
    if (active === 'send') {
      setChannel(channelChoices[0].id);
      setAudience(audienceChoices[0]);
      setSendAt(REGISTER_TIME);
      setSentBy(reporter);
      setMessage(row.summary);
    }
    if (active === 'escalate') {
      setTarget(escalationTargets[0].id);
      setNewSeverity('Critical');
      setEscalatedAt(REGISTER_TIME);
      setEscalatedBy(reporter);
      setReason(escalationReasons[0]);
      setEscalationNotes('');
    }
    if (active === 'resolve') {
      setOutcome(resolutionOutcomes[0].id);
      setResolvedAt(REGISTER_TIME);
      setResolvedBy(reporter);
      setFollowUp(followUpChoices[0]);
      setResolutionSummary('');
    }
  }, [active, row]);

  const field = (key: keyof AlertDraft, value: string | boolean) =>
    setDraft((current) => ({ ...current, [key]: value }));

  return (
    <>
      {/* Create Health Alert */}
      <Modal
        open={active === 'create'}
        onClose={onClose}
        title="Create Health Alert"
        dialogClassName="modal-lg"
        onSubmit={(event) => { event.preventDefault(); onCreate(draft); }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Create Health Alert</button>
          </>
        }
      >
        <p className="fs-12 text-muted mb-3">Raise an advisory and choose who needs to be told</p>
        <AlertForm draft={draft} onField={field} suffix="" mode="create" />
      </Modal>

      {/* Edit Alert */}
      <Modal
        open={active === 'edit' && row !== null}
        onClose={onClose}
        title="Edit Alert"
        dialogClassName="modal-lg"
        onSubmit={(event) => { event.preventDefault(); onUpdate(draft); }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Save Changes</button>
          </>
        }
      >
        {row ? (
          <>
            <p className="fs-12 text-muted mb-3">
              {row.id}  •  {row.title}  •  {statusOf(row).toLowerCase()}
            </p>
            {/* The warning belongs to any alert that has not gone out yet. */}
            {!row.published ? (
              <div className="alert alert-warning d-flex align-items-center gap-2 mb-3">
                <i className="ti ti-alert-triangle fs-16" />
                <span className="fs-13">
                  This alert is still a draft. Nothing has been sent to guardians or staff yet.
                </span>
              </div>
            ) : null}
            <AlertForm draft={draft} onField={field} suffix="-2" mode="edit" />
          </>
        ) : null}
      </Modal>

      {/* Send Notification */}
      <Modal
        open={active === 'send' && row !== null}
        onClose={onClose}
        title="Send Notification"
        onSubmit={(event) => {
          event.preventDefault();
          onNotify({ channel, audience, sendAt, sentBy, message, requireAck, chase });
        }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">
              <i className="ti ti-send me-1" />Send Notification
            </button>
          </>
        }
      >
        {row ? (
          <>
            <AlertStrip row={row}>
              <span className={severityBadge[row.severity]}>{row.severity}</span>
            </AlertStrip>
            <div className="border rounded p-3 mb-3">
              <Row label="Audience" value={row.scope} />
              <Row label="Already Sent" value={notificationCountLabelOf(row)} />
              <Row
                label="First Notification"
                value={
                  <span className={firstNotificationBadgeOf(row)}>{firstNotificationLabelOf(row)}</span>
                }
                last
              />
            </div>

            <div className="mb-3">
              <span className="form-label d-block">Channel</span>
              <div className="d-flex flex-wrap gap-3">
                {channelChoices.map((choice) => (
                  <div className="form-check" key={choice.id}>
                    <input
                      className="form-check-input" type="radio" name="notify-channel"
                      id={`snd-${choice.id}`} checked={channel === choice.id}
                      onChange={() => setChannel(choice.id)}
                    />
                    <label className="form-check-label fs-13" htmlFor={`snd-${choice.id}`}>
                      <i className={`${choice.icon} me-1`} />{choice.id}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="row">
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="ha-audience">Audience</label>
                <select
                  className="form-select" id="ha-audience"
                  value={audience} onChange={(event) => setAudience(event.target.value)}
                >
                  {audienceChoices.map((option) => <option key={option}>{option}</option>)}
                </select>
              </div></div>
              <div className="col-md-3"><div className="mb-3">
                <label className="form-label" htmlFor="ha-send-at">Send At</label>
                <input
                  type="time" className="form-control" id="ha-send-at"
                  value={sendAt} onChange={(event) => setSendAt(event.target.value)}
                />
              </div></div>
              <div className="col-md-3"><div className="mb-3">
                <label className="form-label" htmlFor="ha-sent-by">Sent By</label>
                <select
                  className="form-select" id="ha-sent-by"
                  value={sentBy} onChange={(event) => setSentBy(event.target.value)}
                >
                  {reporterChoices.map((option) => <option key={option}>{option}</option>)}
                </select>
              </div></div>
              <div className="col-md-12"><div className="mb-3">
                <label className="form-label" htmlFor="ha-message">Message</label>
                <textarea
                  className="form-control" rows={3} id="ha-message"
                  value={message} onChange={(event) => setMessage(event.target.value)}
                />
              </div></div>
              <div className="col-md-12">
                <div className="form-check form-switch mb-2">
                  <input
                    className="form-check-input" type="checkbox" role="switch" id="sndAck"
                    checked={requireAck} onChange={(event) => setRequireAck(event.target.checked)}
                  />
                  <label className="form-check-label fs-13" htmlFor="sndAck">
                    Require an acknowledgement from each recipient
                  </label>
                </div>
                <div className="form-check form-switch mb-0">
                  <input
                    className="form-check-input" type="checkbox" role="switch" id="sndChase"
                    /* Nothing to chase when no acknowledgement was asked for. */
                    disabled={!requireAck}
                    checked={chase && requireAck} onChange={(event) => setChase(event.target.checked)}
                  />
                  <label className="form-check-label fs-13" htmlFor="sndChase">
                    Resend to anyone who has not acknowledged within two hours
                  </label>
                </div>
              </div>
            </div>
          </>
        ) : null}
      </Modal>

      {/* Escalate Alert */}
      <Modal
        open={active === 'escalate' && row !== null}
        onClose={onClose}
        title="Escalate Alert"
        onSubmit={(event) => {
          event.preventDefault();
          onEscalate({
            target, severity: newSeverity, escalatedAt, escalatedBy,
            reason, notes: escalationNotes, page: pageTeam, widen,
          });
        }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-danger">
              <i className="ti ti-arrow-up me-1" />Escalate Alert
            </button>
          </>
        }
      >
        {row ? (
          <>
            <div className="alert alert-warning d-flex align-items-center gap-2 mb-3">
              <i className="ti ti-alert-triangle fs-16" />
              <span className="fs-13">
                Escalating raises the severity to {newSeverity.toLowerCase()} and pages the emergency
                response team immediately.
              </span>
            </div>

            <AlertStrip row={row} />
            <div className="border rounded p-3 mb-3">
              <Row
                label="Current Severity"
                value={<span className={severityBadge[row.severity]}>{row.severity}</span>}
              />
              <Row label="Response Window" value={`${windowHoursOf(row)} hours`} />
              <Row label="Notifiable Threshold" value="5 cases in one class in 7 days" />
              <Row
                label="Current Count"
                value={row.caseCount > 0 ? `${row.caseCount} cases` : 'Not a case count alert'}
                last
              />
            </div>

            <div className="mb-3">
              <span className="form-label d-block">Escalate to</span>
              <div className="d-flex flex-wrap gap-3">
                {escalationTargets.map((choice) => (
                  <div className="form-check" key={choice.id}>
                    <input
                      className="form-check-input" type="radio" name="escalate-target"
                      id={`esc-${choice.id}`} checked={target === choice.id}
                      onChange={() => setTarget(choice.id)}
                    />
                    <label className="form-check-label fs-13" htmlFor={`esc-${choice.id}`}>
                      <i className={`${choice.icon} me-1`} />{choice.id}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="row">
              <div className="col-md-4"><div className="mb-3">
                <label className="form-label" htmlFor="ha-new-severity">New Severity</label>
                <select
                  className="form-select" id="ha-new-severity"
                  value={newSeverity}
                  onChange={(event) => setNewSeverity(event.target.value as Severity)}
                >
                  <option>Critical</option>
                  <option>High</option>
                </select>
                {/* The window the new severity buys. */}
                <span className="fs-12 text-muted">
                  {windowForSeverity(newSeverity)} hour response window
                </span>
              </div></div>
              <div className="col-md-4"><div className="mb-3">
                <label className="form-label" htmlFor="ha-escalated-at">Escalated At</label>
                <input
                  type="time" className="form-control" id="ha-escalated-at"
                  value={escalatedAt} onChange={(event) => setEscalatedAt(event.target.value)}
                />
              </div></div>
              <div className="col-md-4"><div className="mb-3">
                <label className="form-label" htmlFor="ha-escalated-by">Escalated By</label>
                <select
                  className="form-select" id="ha-escalated-by"
                  value={escalatedBy} onChange={(event) => setEscalatedBy(event.target.value)}
                >
                  {reporterChoices.map((option) => <option key={option}>{option}</option>)}
                </select>
              </div></div>
              <div className="col-md-12"><div className="mb-3">
                <label className="form-label" htmlFor="ha-reason">Reason for Escalation</label>
                <select
                  className="form-select" id="ha-reason"
                  value={reason} onChange={(event) => setReason(event.target.value)}
                >
                  {escalationReasons.map((option) => <option key={option}>{option}</option>)}
                </select>
              </div></div>
              <div className="col-md-12"><div className="mb-3">
                <label className="form-label" htmlFor="ha-escalation-notes">Escalation Notes</label>
                <textarea
                  className="form-control" rows={2} id="ha-escalation-notes"
                  placeholder="Written to the resolution timeline"
                  value={escalationNotes} onChange={(event) => setEscalationNotes(event.target.value)}
                />
              </div></div>
              <div className="col-md-12">
                <div className="form-check form-switch mb-2">
                  <input
                    className="form-check-input" type="checkbox" role="switch" id="escPage"
                    checked={pageTeam} onChange={(event) => setPageTeam(event.target.checked)}
                  />
                  <label className="form-check-label fs-13" htmlFor="escPage">
                    Page the emergency response team immediately
                  </label>
                </div>
                <div className="form-check form-switch mb-0">
                  <input
                    className="form-check-input" type="checkbox" role="switch" id="escWiden"
                    checked={widen} onChange={(event) => setWiden(event.target.checked)}
                  />
                  <label className="form-check-label fs-13" htmlFor="escWiden">
                    Widen the notification to all guardians in the year group
                  </label>
                </div>
              </div>
            </div>
          </>
        ) : null}
      </Modal>

      {/* Resolve Alert */}
      <Modal
        open={active === 'resolve' && row !== null}
        onClose={onClose}
        title="Resolve Alert"
        onSubmit={(event) => {
          event.preventDefault();
          onResolve({
            outcome, resolvedAt, resolvedBy, followUp,
            summary: resolutionSummary, closingNotice, fileReport,
          });
        }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">
              <i className="ti ti-circle-check me-1" />Resolve Alert
            </button>
          </>
        }
      >
        {row ? (
          <>
            <AlertStrip row={row} />
            <div className="border rounded p-3 mb-3">
              <Row label="Raised" value={raisedLabelOf(row)} />
              <Row label="Notifications" value={`${sentOf(row)} sent · ${acknowledgedOf(row)} acknowledged`} />
              <Row
                label="Open For"
                value={row.published ? durationText(openMinutesOf(row)) : 'Not published'}
                last
              />
            </div>

            <div className="mb-3">
              <span className="form-label d-block">Resolution outcome</span>
              <div className="d-flex flex-wrap gap-3">
                {resolutionOutcomes.map((choice) => (
                  <div className="form-check" key={choice.id}>
                    <input
                      className="form-check-input" type="radio" name="resolve-outcome"
                      id={`res-${choice.id}`} checked={outcome === choice.id}
                      onChange={() => setOutcome(choice.id)}
                    />
                    <label className="form-check-label fs-13" htmlFor={`res-${choice.id}`}>
                      <i className={`${choice.icon} me-1`} />{choice.id}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="row">
              <div className="col-md-4"><div className="mb-3">
                <label className="form-label" htmlFor="ha-resolved-at">Resolved At</label>
                <input
                  type="time" className="form-control" id="ha-resolved-at"
                  value={resolvedAt} onChange={(event) => setResolvedAt(event.target.value)}
                />
              </div></div>
              <div className="col-md-4"><div className="mb-3">
                <label className="form-label" htmlFor="ha-resolved-by">Resolved By</label>
                <select
                  className="form-select" id="ha-resolved-by"
                  value={resolvedBy} onChange={(event) => setResolvedBy(event.target.value)}
                >
                  {reporterChoices.map((option) => <option key={option}>{option}</option>)}
                </select>
              </div></div>
              <div className="col-md-4"><div className="mb-3">
                <label className="form-label" htmlFor="ha-follow-up">Follow-Up Required</label>
                <select
                  className="form-select" id="ha-follow-up"
                  value={followUp} onChange={(event) => setFollowUp(event.target.value)}
                >
                  {followUpChoices.map((option) => <option key={option}>{option}</option>)}
                </select>
              </div></div>
              <div className="col-md-12"><div className="mb-3">
                <label className="form-label" htmlFor="ha-resolution">Resolution Summary</label>
                <textarea
                  className="form-control" rows={2} id="ha-resolution"
                  placeholder="Written to the resolution timeline"
                  value={resolutionSummary}
                  onChange={(event) => setResolutionSummary(event.target.value)}
                />
              </div></div>
              <div className="col-md-12">
                <div className="form-check form-switch mb-2">
                  <input
                    className="form-check-input" type="checkbox" role="switch" id="resClose"
                    /* Nobody was told, so there is nobody to send a closing notice to. */
                    disabled={releasedOf(row).length === 0}
                    checked={closingNotice && releasedOf(row).length > 0}
                    onChange={(event) => setClosingNotice(event.target.checked)}
                  />
                  <label className="form-check-label fs-13" htmlFor="resClose">
                    Send a closing notice to everyone who was alerted
                  </label>
                </div>
                <div className="form-check form-switch mb-0">
                  <input
                    className="form-check-input" type="checkbox" role="switch" id="resFile"
                    checked={fileReport} onChange={(event) => setFileReport(event.target.checked)}
                  />
                  <label className="form-check-label fs-13" htmlFor="resFile">
                    File the incident report with the safety record
                  </label>
                </div>
              </div>
            </div>
          </>
        ) : null}
      </Modal>

      {/* View Alert */}
      <Modal
        open={active === 'view' && row !== null}
        onClose={onClose}
        title={row?.id ?? 'Health alert'}
        dialogClassName="modal-lg"
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={() => onOpen('send')}>
              <i className="ti ti-send me-1" />Send Notification
            </button>
            <button type="button" className="btn btn-primary" onClick={onOpenPanel}>
              <i className="ti ti-alert-circle me-1" />Open Alert Panel
            </button>
          </>
        }
      >
        {row ? (
          <>
            <p className="fs-12 text-muted mb-3">
              {row.title}  •  {row.raisedDate}
            </p>

            <AlertStrip row={row} />

            <div className="row g-3 mb-3">
              {[
                { icon: 'ti ti-flag', tint: 'warning', label: 'Severity', value: row.severity },
                {
                  icon: 'ti ti-clock', tint: 'info', label: 'Response',
                  value: `${firstNotificationLabelOf(row).split(' · ')[0]} of ${windowHoursOf(row)}h`,
                },
                {
                  icon: 'ti ti-send', tint: 'success', label: 'Acknowledged',
                  value: `${acknowledgedOf(row)} of ${sentOf(row)}`,
                },
                {
                  icon: 'ti ti-eye', tint: 'primary', label: row.monitorUntil ? 'Review Until' : 'Status',
                  value: row.monitorUntil || statusOf(row),
                },
              ].map((tile) => (
                <div className="col-md-3" key={tile.label}>
                  <div className="border rounded p-3 d-flex align-items-center gap-2">
                    <span className={`avatar avatar-sm bg-${tile.tint}-transparent text-${tile.tint} rounded flex-shrink-0`}>
                      <i className={tile.icon} />
                    </span>
                    <div className="overflow-hidden">
                      <span className="fs-12 text-muted d-block text-truncate">{tile.label}</span>
                      <h6 className="fs-14 mb-0 text-truncate">{tile.value}</h6>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="row g-3">
              <div className="col-md-6">
                <h6 className="fs-13 mb-2">Alert Detail</h6>
                <div className="border rounded p-3">
                  <Row label="Type" value={<span className={typeBadge[row.type]}>{row.type}</span>} />
                  <Row label="Raised" value={raisedLabelOf(row)} />
                  <Row
                    label="Cases"
                    value={row.caseCount > 0 ? `${row.caseCount} in seven days` : 'Not counted'}
                  />
                  <Row label="Index Case" value={row.linkedVisit || 'None linked'} last />
                </div>
              </div>
              <div className="col-md-6">
                <h6 className="fs-13 mb-2">Notification Summary</h6>
                <div className="border rounded p-3">
                  {releasedOf(row).map((entry) => (
                    <Row
                      key={`${entry.channel}-${entry.audience}`}
                      label={`${entry.channel} to ${entry.audience}`}
                      value={`${entry.acknowledged} of ${entry.recipients} acknowledged`}
                    />
                  ))}
                  <Row
                    label="Status"
                    value={
                      <span className={notificationBadge[notificationStateOf(row)]}>
                        {notificationStateOf(row)}
                      </span>
                    }
                  />
                  <Row label="Chase Due" value={row.published ? 'See the panel' : 'Held with the draft'} last />
                </div>
              </div>
            </div>

            <h6 className="fs-13 mb-2 mt-3">Affected Individuals</h6>
            <div className="table-responsive">
              <table className="table table-nowrap mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Student</th>
                    <th>Seen</th>
                    <th>Record</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {row.individuals.map((person) => (
                    <tr key={person.name}>
                      <td className="fs-13">{person.name}</td>
                      <td className="fs-13">{person.seen}</td>
                      <td className="fs-13">{person.record}</td>
                      <td><span className={person.stateTint}>{person.state}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h6 className="fs-13 mb-2 mt-3">Recommended Actions</h6>
            {row.actions.map((action) => (
              <div className="d-flex align-items-center gap-2 border rounded p-2 mb-2" key={action.task}>
                <span className="avatar avatar-sm bg-warning-transparent text-warning rounded flex-shrink-0">
                  <i className="ti ti-checkbox" />
                </span>
                <div className="flex-fill overflow-hidden">
                  <h6 className="fs-13 mb-0">{action.task}</h6>
                  <span className="fs-12 text-muted d-block">Owner: {action.owner}</span>
                </div>
              </div>
            ))}

            <h6 className="fs-13 mb-2 mt-3">Alert Detail Summary</h6>
            <div className="border rounded p-3 mb-3">
              {detailPairsOf(row).map((pair, index, all) => (
                <Row key={pair.label} label={pair.label} value={pair.value} last={index === all.length - 1} />
              ))}
            </div>

            <h6 className="fs-13 mb-2">Internal Notes</h6>
            <p className="fs-13 text-muted mb-0">{row.notes}</p>
          </>
        ) : null}
      </Modal>
    </>
  );
};

export default AlertModals;
