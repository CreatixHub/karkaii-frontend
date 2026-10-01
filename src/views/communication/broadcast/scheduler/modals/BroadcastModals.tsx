import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import Modal from '@components/ui/Modal';
import type { Broadcast, Channel } from '../data/broadcasts.data';
import {
  REGISTER_DATE,
  audienceOptions,
  cancelScopeOptions,
  channelIcon,
  channelOptions,
  creditsOf,
  dayText,
  daysToDepartureOf,
  frequencyOptions,
  repeatEveryOptions,
  shiftDate,
  templateNames,
  timeZoneOptions,
  typeOptions,
  weekdayNames,
  weekdayOf,
} from '../data/broadcasts.data';

export type BroadcastModalId =
  | 'create' | 'schedule' | 'edit' | 'duplicate' | 'recurrence' | 'preview' | 'approve' | 'cancel';

export type Departure = 'Immediate' | 'Scheduled' | 'Recurring';

export interface ComposeDraft {
  title: string;
  type: string;
  description: string;
  body: string;
  audience: string;
  template: string;
  channels: Channel[];
}

export const emptyCompose: ComposeDraft = {
  title: '', type: typeOptions[0], description: '', body: '',
  audience: audienceOptions[0], template: '— None —',
  channels: ['Email', 'In-App'],
};

export const composeOf = (row: Broadcast): ComposeDraft => ({
  title: row.title,
  type: typeOptions.find((option) => option === row.category) ?? typeOptions[0],
  description: row.description,
  body: row.body
    .map((block) => [block.heading, ...block.paragraphs, ...block.bullets].filter(Boolean).join('\n'))
    .join('\n\n'),
  audience: audienceOptions.find((option) => row.audienceLabel.startsWith(option))
    ?? audienceOptions[0],
  template: '— None —',
  channels: row.channels,
});

export interface SchedulePayload {
  departure: Departure;
  sendDate: string;
  sendTime: string;
  timeZone: string;
  autoExpiry: string;
  requiresApproval: boolean;
  quietHours: boolean;
  skipWeekends: boolean;
}

export interface EditPayload {
  title: string;
  type: string;
  description: string;
  body: string;
  audience: string;
  autoExpiry: string;
  resubmit: boolean;
  keepSchedule: boolean;
}

export interface DuplicatePayload {
  title: string;
  copyAudience: boolean;
  copyChannels: boolean;
  copyRecurrence: boolean;
  copyAttachments: boolean;
}

export interface RecurrencePayload {
  frequency: string;
  every: string;
  days: string[];
  time: string;
  endsOn: string;
  skipEmpty: boolean;
  skipHolidays: boolean;
  approveEach: boolean;
}

export interface ApprovePayload {
  note: string;
  approved: boolean;
}

export interface CancelPayload {
  scope: string;
  notifyRequester: boolean;
  reason: string;
}

export interface BroadcastModalsProps {
  active: BroadcastModalId | null;
  row: Broadcast | null;
  onClose: () => void;
  onCompose: (draft: ComposeDraft, andSchedule: boolean) => void;
  onSchedule: (payload: SchedulePayload) => void;
  onEdit: (payload: EditPayload) => void;
  onDuplicate: (payload: DuplicatePayload) => void;
  onRecurrence: (payload: RecurrencePayload) => void;
  onApprove: (payload: ApprovePayload) => void;
  onCancel: (payload: CancelPayload) => void;
}

const Row = ({ label, value }: { label: string; value: ReactNode }) => (
  <div className="d-flex align-items-center justify-content-between gap-3 mb-2">
    <span className="fs-13 text-muted">{label}</span>
    <span className="fs-13 fw-medium text-end">{value}</span>
  </div>
);

const Switch = ({
  id, title, note, value, onChange, disabled = false,
}: {
  id: string; title: string; note: string; value: boolean;
  onChange: (next: boolean) => void; disabled?: boolean;
}) => (
  <div className="d-flex align-items-center justify-content-between border rounded p-2 mb-2">
    <div>
      <h6 className="fs-13 mb-0">{title}</h6>
      <span className="fs-12 text-muted">{note}</span>
    </div>
    <div className="form-check form-switch mb-0">
      <input
        className="form-check-input" type="checkbox" role="switch" id={id}
        disabled={disabled} checked={value && !disabled}
        onChange={(event) => onChange(event.target.checked)}
      />
      <label className="form-check-label visually-hidden" htmlFor={id}>{title}</label>
    </div>
  </div>
);

const BroadcastModals = ({
  active, row, onClose, onCompose, onSchedule, onEdit, onDuplicate, onRecurrence,
  onApprove, onCancel,
}: BroadcastModalsProps) => {
  const [draft, setDraft] = useState<ComposeDraft>(emptyCompose);

  const [departure, setDeparture] = useState<Departure>('Scheduled');
  const [sendDate, setSendDate] = useState('05/08/2026');
  const [sendTime, setSendTime] = useState('07:30');
  const [timeZone, setTimeZone] = useState(timeZoneOptions[0]);
  const [autoExpiry, setAutoExpiry] = useState('11/08/2026');
  const [requiresApproval, setRequiresApproval] = useState(true);
  const [quietHours, setQuietHours] = useState(true);
  const [skipWeekends, setSkipWeekends] = useState(false);

  const [editTitle, setEditTitle] = useState('');
  const [editType, setEditType] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editBody, setEditBody] = useState('');
  const [editAudience, setEditAudience] = useState('');
  const [editExpiry, setEditExpiry] = useState('');
  const [resubmit, setResubmit] = useState(true);
  const [keepSchedule, setKeepSchedule] = useState(true);

  const [copyTitle, setCopyTitle] = useState('');
  const [copyAudience, setCopyAudience] = useState(true);
  const [copyChannels, setCopyChannels] = useState(true);
  const [copyRecurrence, setCopyRecurrence] = useState(false);
  const [copyAttachments, setCopyAttachments] = useState(false);

  const [frequency, setFrequency] = useState(frequencyOptions[1]);
  const [every, setEvery] = useState(repeatEveryOptions[0]);
  const [days, setDays] = useState<string[]>(['Mon']);
  const [recurrenceTime, setRecurrenceTime] = useState('06:45');
  const [endsOn, setEndsOn] = useState('End of term');
  const [skipEmpty, setSkipEmpty] = useState(true);
  const [skipHolidays, setSkipHolidays] = useState(true);
  const [approveEach, setApproveEach] = useState(false);

  const [reviewerNote, setReviewerNote] = useState('');

  const [scope, setScope] = useState(cancelScopeOptions[0]);
  const [notifyRequester, setNotifyRequester] = useState(true);
  const [reason, setReason] = useState('');

  useEffect(() => {
    if (active === 'create') setDraft(emptyCompose);
    if (!row) return;
    if (active === 'edit') {
      const compose = composeOf(row);
      setEditTitle(compose.title);
      setEditType(row.category);
      setEditDescription(compose.description);
      setEditBody(compose.body);
      setEditAudience(row.audienceLabel);
      setEditExpiry(row.expires);
      setResubmit(row.approval === 'Approved');
      setKeepSchedule(true);
    }
    if (active === 'duplicate') {
      setCopyTitle(`${row.title} (copy)`);
      setCopyRecurrence(row.cadence !== 'One-off' && row.cadence !== 'Immediate');
      setCopyAttachments(false);
    }
    if (active === 'recurrence') {
      setFrequency(row.cadence === 'One-off' || row.cadence === 'Immediate' ? 'Weekly' : row.cadence);
      setDays([weekdayOf(row.sendDate)]);
      setRecurrenceTime(row.sendTime.replace(/\s?[ap]m/i, ''));
    }
    if (active === 'approve') setReviewerNote('');
    if (active === 'cancel') {
      setScope(cancelScopeOptions[0]);
      setReason('');
    }
  }, [active, row]);

  const field = (key: keyof ComposeDraft, value: string | Channel[]) =>
    setDraft((current) => ({ ...current, [key]: value }));

  const toggleChannel = (channel: Channel) =>
    setDraft((current) => ({
      ...current,
      channels: current.channels.includes(channel)
        ? current.channels.filter((entry) => entry !== channel)
        : [...current.channels, channel],
    }));

  const toggleDay = (day: string) =>
    setDays((current) => (current.includes(day)
      ? current.filter((entry) => entry !== day)
      : [...current, day]));

  /**
   * The next run the rule in front of the user produces, counted from the
   * register date rather than printed as a fixed line.
   */
  const nextRunLabel = (() => {
    if (frequency !== 'Weekly' || days.length === 0) return `${frequency} · from ${REGISTER_DATE}`;
    const order = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = order.indexOf(weekdayOf(REGISTER_DATE));
    const ahead = days
      .map((day) => ((order.indexOf(day) - today + 7) % 7) || 7)
      .sort((a, b) => a - b)[0];
    const date = shiftDate(REGISTER_DATE, ahead);
    return `${weekdayOf(date)} ${date}, ${recurrenceTime}`;
  })();

  return (
    <>
      {/* Create broadcast */}
      <Modal
        open={active === 'create'}
        onClose={onClose}
        title="Create broadcast"
        dialogClassName="modal-lg"
        onSubmit={(event) => { event.preventDefault(); onCompose(draft, true); }}
        footer={
          <>
            <button
              type="button" className="btn btn-light me-2"
              onClick={() => onCompose(draft, false)}
            >
              Save as draft
            </button>
            <button type="submit" className="btn btn-primary">Continue to schedule</button>
          </>
        }
      >
        <p className="fs-12 text-muted mb-3">Write it here; scheduling and approval come next.</p>
        <div className="row g-3">
          <div className="col-md-8">
            <label className="form-label" htmlFor="bsc-c-title">Broadcast title</label>
            <input
              type="text" className="form-control" id="bsc-c-title"
              placeholder="e.g. Final reminder — second term fee"
              value={draft.title} onChange={(event) => field('title', event.target.value)}
            />
          </div>
          <div className="col-md-4">
            <label className="form-label" htmlFor="bsc-c-type">Broadcast type</label>
            <select
              className="form-select" id="bsc-c-type"
              value={draft.type} onChange={(event) => field('type', event.target.value)}
            >
              {typeOptions.map((option) => <option key={option}>{option}</option>)}
            </select>
          </div>
          <div className="col-12">
            <label className="form-label" htmlFor="bsc-c-desc">Short description</label>
            <input
              type="text" className="form-control" id="bsc-c-desc"
              placeholder="One sentence, shown on the card"
              value={draft.description} onChange={(event) => field('description', event.target.value)}
            />
          </div>
          <div className="col-12">
            <label className="form-label" htmlFor="bsc-c-body">Message</label>
            <textarea
              className="form-control" id="bsc-c-body" rows={6}
              placeholder="Write the full broadcast…"
              value={draft.body} onChange={(event) => field('body', event.target.value)}
            />
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="bsc-c-aud">Target audience</label>
            <select
              className="form-select" id="bsc-c-aud"
              value={draft.audience} onChange={(event) => field('audience', event.target.value)}
            >
              {audienceOptions.map((option) => <option key={option}>{option}</option>)}
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="bsc-c-tpl">Start from template</label>
            <select
              className="form-select" id="bsc-c-tpl"
              value={draft.template} onChange={(event) => field('template', event.target.value)}
            >
              <option>— None —</option>
              {templateNames.map((option) => <option key={option}>{option}</option>)}
            </select>
          </div>
          <div className="col-12">
            <span className="form-label d-block">Delivery channels</span>
            <div className="d-flex flex-wrap gap-3">
              {channelOptions.map((channel) => (
                <div className="form-check" key={channel}>
                  <input
                    className="form-check-input" type="checkbox" id={`bsc-c-${channel}`}
                    checked={draft.channels.includes(channel)}
                    onChange={() => toggleChannel(channel)}
                  />
                  <label className="form-check-label fs-13" htmlFor={`bsc-c-${channel}`}>
                    <i className={`${channelIcon[channel]} me-1`} />{channel}
                  </label>
                </div>
              ))}
            </div>
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="bsc-c-cover">Cover image</label>
            <input type="file" className="form-control" id="bsc-c-cover" />
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="bsc-c-files">Attachments</label>
            <input type="file" className="form-control" id="bsc-c-files" />
          </div>
        </div>
      </Modal>

      {/* Schedule broadcast */}
      <Modal
        open={active === 'schedule'}
        onClose={onClose}
        title="Schedule broadcast"
        onSubmit={(event) => {
          event.preventDefault();
          onSchedule({
            departure, sendDate, sendTime, timeZone, autoExpiry,
            requiresApproval, quietHours, skipWeekends,
          });
        }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Add to schedule</button>
          </>
        }
      >
        <p className="fs-12 text-muted mb-3">
          A broadcast unapproved thirty minutes before its send time is held, not sent late.
        </p>
        {row ? (
          <div className="border rounded p-2 mb-3">
            <h6 className="fs-13 mb-0">{row.title}</h6>
            <span className="fs-12 text-muted">
              {row.category} · {row.audienceLabel} · {row.audienceCount.toLocaleString()}
            </span>
          </div>
        ) : null}

        <div className="mb-3">
          <span className="form-label d-block">Delivery</span>
          <div className="d-flex flex-wrap gap-3">
            {(['Immediate', 'Scheduled', 'Recurring'] as Departure[]).map((option) => (
              <div className="form-check" key={option}>
                <input
                  className="form-check-input" type="radio" name="bsc-departure"
                  id={`bsc-when-${option}`} checked={departure === option}
                  onChange={() => setDeparture(option)}
                />
                <label className="form-check-label fs-13" htmlFor={`bsc-when-${option}`}>{option}</label>
              </div>
            ))}
          </div>
        </div>

        <div className="row g-3 mb-3">
          <div className="col-md-6">
            <label className="form-label" htmlFor="bsc-s-date">Send date</label>
            <input
              type="text" className="form-control" id="bsc-s-date"
              /* An immediate broadcast leaves on approval, so there is no date. */
              disabled={departure === 'Immediate'}
              value={departure === 'Immediate' ? 'On approval' : sendDate}
              onChange={(event) => setSendDate(event.target.value)}
            />
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="bsc-s-time">Send time</label>
            <input
              type="time" className="form-control" id="bsc-s-time"
              disabled={departure === 'Immediate'}
              value={sendTime} onChange={(event) => setSendTime(event.target.value)}
            />
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="bsc-s-tz">Time zone</label>
            <select
              className="form-select" id="bsc-s-tz"
              value={timeZone} onChange={(event) => setTimeZone(event.target.value)}
            >
              {timeZoneOptions.map((option) => <option key={option}>{option}</option>)}
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="bsc-s-exp">Auto expiry</label>
            <input
              type="text" className="form-control" id="bsc-s-exp"
              value={autoExpiry} onChange={(event) => setAutoExpiry(event.target.value)}
            />
          </div>
        </div>

        <Switch
          id="bsc-s-ap" title="Requires approval" note="Reviewer signs off before departure"
          value={requiresApproval} onChange={setRequiresApproval}
        />
        <Switch
          id="bsc-s-qh" title="Respect quiet hours" note="Nothing leaves between 9 pm and 7 am"
          value={quietHours} onChange={setQuietHours}
        />
        <Switch
          id="bsc-s-wk" title="Skip weekends" note="Moves to the next working morning"
          value={skipWeekends} onChange={setSkipWeekends}
        />
      </Modal>

      {/* Edit broadcast */}
      <Modal
        open={active === 'edit' && row !== null}
        onClose={onClose}
        title="Edit broadcast"
        onSubmit={(event) => {
          event.preventDefault();
          onEdit({
            title: editTitle, type: editType, description: editDescription, body: editBody,
            audience: editAudience, autoExpiry: editExpiry, resubmit, keepSchedule,
          });
        }}
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
              Editing an approved broadcast returns it to the approval queue.
            </p>
            <div className="row g-3 mb-3">
              <div className="col-md-8">
                <label className="form-label" htmlFor="bsc-e-title">Broadcast title</label>
                <input
                  type="text" className="form-control" id="bsc-e-title"
                  value={editTitle} onChange={(event) => setEditTitle(event.target.value)}
                />
              </div>
              <div className="col-md-4">
                <label className="form-label" htmlFor="bsc-e-type">Broadcast type</label>
                <input
                  type="text" className="form-control" id="bsc-e-type"
                  value={editType} onChange={(event) => setEditType(event.target.value)}
                />
              </div>
              <div className="col-12">
                <label className="form-label" htmlFor="bsc-e-desc">Short description</label>
                <input
                  type="text" className="form-control" id="bsc-e-desc"
                  value={editDescription} onChange={(event) => setEditDescription(event.target.value)}
                />
              </div>
              <div className="col-12">
                <label className="form-label" htmlFor="bsc-e-body">Message</label>
                <textarea
                  className="form-control" id="bsc-e-body" rows={5}
                  value={editBody} onChange={(event) => setEditBody(event.target.value)}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label" htmlFor="bsc-e-aud">Target audience</label>
                <input
                  type="text" className="form-control" id="bsc-e-aud"
                  value={editAudience} onChange={(event) => setEditAudience(event.target.value)}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label" htmlFor="bsc-e-exp">Auto expiry</label>
                <input
                  type="text" className="form-control" id="bsc-e-exp"
                  value={editExpiry} onChange={(event) => setEditExpiry(event.target.value)}
                />
              </div>
            </div>
            <Switch
              id="bsc-e-re" title="Resubmit for approval"
              note="Required after any change to the message"
              value={resubmit} onChange={setResubmit}
            />
            <Switch
              id="bsc-e-ks" title="Keep the existing schedule"
              note={row.status === 'Draft' ? 'This broadcast has no schedule yet' : `${row.sendDate}, ${row.sendTime} ${row.timeZone}`}
              value={keepSchedule} onChange={setKeepSchedule}
              disabled={row.status === 'Draft'}
            />
          </>
        ) : null}
      </Modal>

      {/* Duplicate broadcast */}
      <Modal
        open={active === 'duplicate' && row !== null}
        onClose={onClose}
        title="Duplicate broadcast"
        onSubmit={(event) => {
          event.preventDefault();
          onDuplicate({
            title: copyTitle, copyAudience, copyChannels, copyRecurrence, copyAttachments,
          });
        }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Duplicate</button>
          </>
        }
      >
        {row ? (
          <>
            <p className="fs-12 text-muted mb-3">
              The copy is created as an unscheduled draft. Delivery history is not carried over.
            </p>
            <div className="mb-3">
              <label className="form-label" htmlFor="bsc-d-title">New title</label>
              <input
                type="text" className="form-control" id="bsc-d-title"
                value={copyTitle} onChange={(event) => setCopyTitle(event.target.value)}
              />
            </div>
            <Switch
              id="bsc-d-a" title="Copy audience"
              note={`${row.audienceLabel} · ${row.audienceCount.toLocaleString()}`}
              value={copyAudience} onChange={setCopyAudience}
            />
            <Switch
              id="bsc-d-c" title="Copy channels" note={row.channels.join(', ')}
              value={copyChannels} onChange={setCopyChannels}
            />
            <Switch
              id="bsc-d-r" title="Copy recurrence rule"
              note={row.cadenceLabel || 'This broadcast is a one-off'}
              value={copyRecurrence} onChange={setCopyRecurrence}
              disabled={!row.cadenceLabel}
            />
            <Switch
              id="bsc-d-f" title="Copy attachments"
              note={row.attachments.length > 0
                ? `${row.attachments.length} file${row.attachments.length === 1 ? '' : 's'}`
                : 'Nothing attached'}
              value={copyAttachments} onChange={setCopyAttachments}
              disabled={row.attachments.length === 0}
            />
          </>
        ) : null}
      </Modal>

      {/* Configure recurrence */}
      <Modal
        open={active === 'recurrence'}
        onClose={onClose}
        title="Configure recurrence"
        onSubmit={(event) => {
          event.preventDefault();
          onRecurrence({
            frequency, every, days, time: recurrenceTime, endsOn,
            skipEmpty, skipHolidays, approveEach,
          });
        }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Save rule</button>
          </>
        }
      >
        <p className="fs-12 text-muted mb-3">
          Each occurrence is queued separately, so a single run can be skipped without breaking the
          series.
        </p>
        <div className="row g-3 mb-3">
          <div className="col-md-6">
            <label className="form-label" htmlFor="bsc-r-freq">Frequency</label>
            <select
              className="form-select" id="bsc-r-freq"
              value={frequency} onChange={(event) => setFrequency(event.target.value)}
            >
              {frequencyOptions.map((option) => <option key={option}>{option}</option>)}
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="bsc-r-every">Repeat every</label>
            <select
              className="form-select" id="bsc-r-every"
              /* Only a weekly rule repeats in weeks. */
              disabled={frequency !== 'Weekly'}
              value={every} onChange={(event) => setEvery(event.target.value)}
            >
              {repeatEveryOptions.map((option) => <option key={option}>{option}</option>)}
            </select>
          </div>
        </div>

        <div className="mb-3">
          <span className="form-label d-block">On these days</span>
          <div className="d-flex flex-wrap gap-3">
            {weekdayNames.map((day) => (
              <div className="form-check" key={day}>
                <input
                  className="form-check-input" type="checkbox" id={`bsc-r-${day}`}
                  disabled={frequency !== 'Weekly' && frequency !== 'Daily'}
                  checked={days.includes(day)}
                  onChange={() => toggleDay(day)}
                />
                <label className="form-check-label fs-13" htmlFor={`bsc-r-${day}`}>{day}</label>
              </div>
            ))}
          </div>
        </div>

        <div className="row g-3 mb-3">
          <div className="col-md-6">
            <label className="form-label" htmlFor="bsc-r-time">Time</label>
            <input
              type="time" className="form-control" id="bsc-r-time"
              value={recurrenceTime} onChange={(event) => setRecurrenceTime(event.target.value)}
            />
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="bsc-r-end">Series ends</label>
            <input
              type="text" className="form-control" id="bsc-r-end"
              value={endsOn} onChange={(event) => setEndsOn(event.target.value)}
            />
          </div>
        </div>

        <Switch
          id="bsc-r-se" title="Skip empty runs" note="Nothing goes out if there is no content"
          value={skipEmpty} onChange={setSkipEmpty}
        />
        <Switch
          id="bsc-r-sh" title="Skip school holidays" note="Reads the academic calendar"
          value={skipHolidays} onChange={setSkipHolidays}
        />
        <Switch
          id="bsc-r-ae" title="Approve each occurrence" note="Off means the series is approved once"
          value={approveEach} onChange={setApproveEach}
        />

        {/* The run the rule above actually produces. */}
        <p className="fs-13 text-muted mb-0 mt-2">Next run · {nextRunLabel}</p>
      </Modal>

      {/* Preview broadcast */}
      <Modal
        open={active === 'preview' && row !== null}
        onClose={onClose}
        title="Preview broadcast"
        dialogClassName="modal-lg"
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Close</button>
            <button
              type="button" className="btn btn-primary"
              onClick={() => onSchedule({
                departure: 'Scheduled', sendDate, sendTime, timeZone, autoExpiry,
                requiresApproval, quietHours, skipWeekends,
              })}
            >
              Schedule this
            </button>
          </>
        }
      >
        {row ? (
          <>
            <p className="fs-12 text-muted mb-3">As a parent sees it in the portal inbox.</p>
            <span className="fs-12 text-muted d-block mb-1">{row.readerLead}</span>
            <h5 className="fs-16 mb-2">{row.readerTitle}</h5>
            {row.body.map((block) => (
              <div key={block.heading || block.paragraphs[0]}>
                {block.heading ? <h6 className="fs-13 mt-3 mb-1">{block.heading}</h6> : null}
                {block.paragraphs.map((paragraph) => (
                  <p className="fs-13 text-muted mb-2" key={paragraph}>{paragraph}</p>
                ))}
                {block.bullets.length > 0 ? (
                  <ul className="fs-13 text-muted mb-2 ps-3">
                    {block.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}
                  </ul>
                ) : null}
              </div>
            ))}
            {/* The footer line is this broadcast's real state. */}
            <p className="fs-12 text-muted mb-0 mt-3">
              {row.status === 'Draft' ? 'Draft · not yet scheduled'
                : row.status === 'Completed' ? `Sent ${row.sendDate}, ${row.sendTime}`
                  : row.status === 'Cancelled' ? 'Cancelled · never sent'
                    : `${row.status} · ${row.sendDate}, ${row.sendTime} ${row.timeZone}`}
            </p>
          </>
        ) : null}
      </Modal>

      {/* Approve broadcast */}
      <Modal
        open={active === 'approve' && row !== null}
        onClose={onClose}
        title="Approve broadcast"
        onSubmit={(event) => {
          event.preventDefault();
          onApprove({ note: reviewerNote, approved: true });
        }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button
              type="button" className="btn btn-outline-light bg-white me-2"
              onClick={() => onApprove({ note: reviewerNote, approved: false })}
            >
              Reject
            </button>
            <button type="submit" className="btn btn-primary">Approve &amp; schedule</button>
          </>
        }
      >
        {row ? (
          <>
            <p className="fs-12 text-muted mb-3">
              Approving releases it to the schedule. It will leave at the time below without further
              review.
            </p>
            <div className="border rounded p-3 mb-3">
              <Row label="Broadcast" value={row.title} />
              <Row label="Requested by" value={`${row.createdBy} · ${row.createdOn.split(',')[0]}`} />
              <Row label="Departs" value={`${row.sendDate}, ${row.sendTime} ${row.timeZone}`} />
              <Row
                label="Audience"
                value={`${row.audienceLabel} · ${row.audienceCount.toLocaleString()}`}
              />
              <Row
                label="Channels"
                value={(
                  <span className="d-inline-flex gap-1">
                    {row.channels.map((channel) => (
                      <i className={channelIcon[channel]} key={channel} title={channel} />
                    ))}
                  </span>
                )}
              />
              {/* One credit per SMS recipient, nothing when SMS is not selected. */}
              <div className="d-flex align-items-center justify-content-between gap-3 mb-0">
                <span className="fs-13 text-muted">Estimated credits</span>
                <span className="fs-13 fw-medium">
                  {creditsOf(row) > 0 ? `${creditsOf(row).toLocaleString()} SMS` : 'No SMS selected'}
                </span>
              </div>
            </div>
            <div className="mb-0">
              <label className="form-label" htmlFor="bsc-ap-note">
                Reviewer note <span className="text-muted fs-12">(optional)</span>
              </label>
              <textarea
                className="form-control" id="bsc-ap-note" rows={2}
                placeholder="Recorded in the approval history."
                value={reviewerNote} onChange={(event) => setReviewerNote(event.target.value)}
              />
            </div>
          </>
        ) : null}
      </Modal>

      {/* Cancel broadcast */}
      <Modal
        open={active === 'cancel' && row !== null}
        onClose={onClose}
        title="Cancel broadcast"
        onSubmit={(event) => {
          event.preventDefault();
          onCancel({ scope, notifyRequester, reason });
        }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Keep scheduled</button>
            <button type="submit" className="btn btn-danger">Cancel broadcast</button>
          </>
        }
      >
        {row ? (
          <>
            <p className="fs-12 text-muted mb-3">
              Cancelling stops it permanently. To hold a series temporarily, pause it instead.
            </p>
            <div className="border rounded p-3 mb-3">
              <h6 className="fs-13 mb-2">{row.title}</h6>
              <p className="fs-12 text-muted mb-1">
                <i className="ti ti-clock me-1" />Departs {row.sendDate}, {row.sendTime}
                {' · '}
                {daysToDepartureOf(row) > 0 ? `in ${dayText(daysToDepartureOf(row))}` : 'already past'}
              </p>
              <p className="fs-12 text-muted mb-0">
                <i className="ti ti-users me-1" />
                {row.audienceCount.toLocaleString()} recipients across {row.channels.length} channels
              </p>
            </div>
            <div className="mb-3">
              <label className="form-label" htmlFor="bsc-x-scope">Scope</label>
              <select
                className="form-select" id="bsc-x-scope"
                /* A one-off has no series to cancel beyond itself. */
                disabled={!row.cadenceLabel}
                value={scope} onChange={(event) => setScope(event.target.value)}
              >
                {cancelScopeOptions.map((option) => <option key={option}>{option}</option>)}
              </select>
            </div>
            <Switch
              id="bsc-x-n" title="Notify the requester" note={row.createdBy}
              value={notifyRequester} onChange={setNotifyRequester}
            />
            <div className="mb-0">
              <label className="form-label" htmlFor="bsc-x-why">
                Reason <span className="text-muted fs-12">(recorded in the audit trail)</span>
              </label>
              <textarea
                className="form-control" id="bsc-x-why" rows={2}
                placeholder="Why this broadcast is being cancelled."
                value={reason} onChange={(event) => setReason(event.target.value)}
              />
            </div>
          </>
        ) : null}
      </Modal>
    </>
  );
};

export default BroadcastModals;
