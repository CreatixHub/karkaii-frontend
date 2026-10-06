import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import Modal from '@components/ui/Modal';
import type { Category, Channel, Notification, Priority } from '../data/notifications.data';
import {
  audienceOptions,
  categoryOptions,
  channelIcon,
  deliveryRateOf,
  priorityOptions,
  readRateOf,
} from '../data/notifications.data';
import { notificationTemplates, parentCommunications } from '../data/reference.data';

export type NotificationModalId =
  | 'create' | 'email' | 'push' | 'parent' | 'schedule'
  | 'preview' | 'template' | 'duplicate' | 'import' | 'export';

/** What a push payload may carry before the handset cuts it off. */
export const PUSH_TITLE_LIMIT = 40;
export const PUSH_BODY_LIMIT = 120;

export interface CreateDraft {
  title: string;
  category: Category;
  description: string;
  body: string;
  audience: string;
  priority: Priority;
  template: string;
  channels: Channel[];
  expiry: string;
  ackRequired: boolean;
  trackReads: boolean;
}

export const emptyCreate: CreateDraft = {
  title: '', category: 'Academic', description: '', body: '',
  audience: audienceOptions[1], priority: 'Normal', template: '— None —',
  channels: ['Email', 'Portal'], expiry: '', ackRequired: false, trackReads: true,
};

export interface EmailPayload {
  subject: string;
  from: string;
  preheader: string;
  body: string;
  audience: string;
  trackOpens: boolean;
}

export interface PushPayload {
  title: string;
  body: string;
  audience: string;
  onTap: string;
  sound: boolean;
}

export interface ParentPayload {
  title: string;
  type: string;
  body: string;
  recipients: string;
  when: string;
  alsoSend: boolean;
  allowReplies: boolean;
  ackRequired: boolean;
  confidential: boolean;
}

export interface SchedulePayload {
  delivery: string;
  sendDate: string;
  sendTime: string;
  timeZone: string;
  expiry: string;
  quietHours: boolean;
  retry: boolean;
  remindUnread: boolean;
}

export interface TemplatePayload {
  name: string;
  category: string;
  body: string;
  channels: Channel[];
  shared: boolean;
}

export interface DuplicatePayload {
  title: string;
  copyAudience: boolean;
  copyChannels: boolean;
  copyAttachments: boolean;
  unreadOnly: boolean;
}

export interface ImportPayload {
  matchExisting: boolean;
  dropDuplicates: boolean;
}

export interface ExportPayload {
  scope: string;
  format: string;
  includeRead: boolean;
}

export interface NotificationModalsProps {
  active: NotificationModalId | null;
  row: Notification | null;
  matchCount: number;
  onClose: () => void;
  onCreate: (draft: CreateDraft, intent: 'draft' | 'schedule' | 'send') => void;
  onEmail: (payload: EmailPayload) => void;
  onPush: (payload: PushPayload) => void;
  onParent: (payload: ParentPayload) => void;
  onSchedule: (payload: SchedulePayload) => void;
  onSaveTemplate: (payload: TemplatePayload) => void;
  onDuplicate: (payload: DuplicatePayload) => void;
  onImport: (payload: ImportPayload) => void;
  onExport: (payload: ExportPayload) => void;
  onOpen: (modal: NotificationModalId) => void;
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

const channelChoices: { id: Channel; label: string }[] = [
  { id: 'Email', label: 'Email notification' },
  { id: 'Push', label: 'Push notification' },
  { id: 'Portal', label: 'Parent communication' },
];

const NotificationModals = ({
  active, row, matchCount, onClose, onCreate, onEmail, onPush, onParent, onSchedule,
  onSaveTemplate, onDuplicate, onImport, onExport, onOpen,
}: NotificationModalsProps) => {
  const [draft, setDraft] = useState<CreateDraft>(emptyCreate);

  const [subject, setSubject] = useState('');
  const [from, setFrom] = useState('notifications@school.edu');
  const [preheader, setPreheader] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [emailAudience, setEmailAudience] = useState('Parents');
  const [trackOpens, setTrackOpens] = useState(true);

  const [pushTitle, setPushTitle] = useState('Route 7 running late');
  const [pushBody, setPushBody] = useState(
    'Route 7 is approximately 20 minutes behind schedule this evening due to traffic.',
  );
  const [pushAudience, setPushAudience] = useState('Route 7 families');
  const [onTap, setOnTap] = useState('Transport page');
  const [sound, setSound] = useState(false);

  const [parentTitle, setParentTitle] = useState('');
  const [parentType, setParentType] = useState(parentCommunications[0].title);
  const [parentBody, setParentBody] = useState('');
  const [parentRecipients, setParentRecipients] = useState('All parents');
  const [parentWhen, setParentWhen] = useState('Immediately');
  const [alsoSend, setAlsoSend] = useState(true);
  const [allowReplies, setAllowReplies] = useState(true);
  const [parentAck, setParentAck] = useState(false);
  const [confidential, setConfidential] = useState(false);

  const [delivery, setDelivery] = useState('Scheduled');
  const [sendDate, setSendDate] = useState('05/08/2026');
  const [sendTime, setSendTime] = useState('07:30');
  const [timeZone, setTimeZone] = useState('IST (UTC +5:30)');
  const [expiry, setExpiry] = useState('11/08/2026');
  const [quietHours, setQuietHours] = useState(true);
  const [retry, setRetry] = useState(true);
  const [remindUnread, setRemindUnread] = useState(false);

  const [templateName, setTemplateName] = useState('');
  const [templateCategory, setTemplateCategory] = useState('Fees');
  const [templateBody, setTemplateBody] = useState('');
  const [templateChannels, setTemplateChannels] = useState<Channel[]>(['Email', 'Push', 'Portal']);
  const [templateShared, setTemplateShared] = useState(true);

  const [copyTitle, setCopyTitle] = useState('');
  const [copyAudience, setCopyAudience] = useState(true);
  const [copyChannels, setCopyChannels] = useState(true);
  const [copyAttachments, setCopyAttachments] = useState(false);
  const [unreadOnly, setUnreadOnly] = useState(false);

  const [matchExisting, setMatchExisting] = useState(true);
  const [dropDuplicates, setDropDuplicates] = useState(true);

  const [exportScope, setExportScope] = useState('Current filters');
  const [exportFormat, setExportFormat] = useState('CSV');
  const [includeRead, setIncludeRead] = useState(true);

  useEffect(() => {
    if (active === 'create') setDraft(emptyCreate);
    if (!row) return;
    if (active === 'duplicate') {
      setCopyTitle(`${row.title} (copy)`);
      setUnreadOnly(false);
    }
    if (active === 'template') {
      setTemplateName(row.title);
      setTemplateBody(row.summary);
      setTemplateChannels(row.channels);
    }
    if (active === 'email') {
      setSubject(row.title);
      setEmailBody(row.summary);
      setEmailAudience(row.audienceLabel);
    }
    if (active === 'parent') {
      setParentTitle(row.title);
      setParentBody(row.summary);
    }
  }, [active, row]);

  const field = (key: keyof CreateDraft, value: string | boolean | Channel[]) =>
    setDraft((current) => ({ ...current, [key]: value }));

  const toggleChannel = (channel: Channel) =>
    setDraft((current) => ({
      ...current,
      channels: current.channels.includes(channel)
        ? current.channels.filter((entry) => entry !== channel)
        : [...current.channels, channel],
    }));

  const toggleTemplateChannel = (channel: Channel) =>
    setTemplateChannels((current) => (current.includes(channel)
      ? current.filter((entry) => entry !== channel)
      : [...current, channel]));

  /** How many recipients did not open it — what an unread-only resend targets. */
  const unreadCount = row ? Math.max(0, row.delivered - row.read) : 0;

  const templateVariables = (templateBody.match(/\{\{[a-z_]+\}\}/g) ?? []).length;

  return (
    <>
      {/* Create notification */}
      <Modal
        open={active === 'create'}
        onClose={onClose}
        title="Create notification"
        dialogClassName="modal-lg"
        onSubmit={(event) => { event.preventDefault(); onCreate(draft, 'send'); }}
        footer={
          <>
            <button
              type="button" className="btn btn-light me-2"
              onClick={() => onCreate(draft, 'draft')}
            >
              Save draft
            </button>
            <button
              type="button" className="btn btn-outline-light bg-white me-2"
              onClick={() => onCreate(draft, 'schedule')}
            >
              Schedule…
            </button>
            <button type="submit" className="btn btn-primary">Send now</button>
          </>
        }
      >
        <p className="fs-12 text-muted mb-3">
          Write it once; the channels below decide how it reaches people.
        </p>
        <div className="row g-3">
          <div className="col-md-8">
            <label className="form-label" htmlFor="nc-c-title">Title</label>
            <input
              type="text" className="form-control" id="nc-c-title"
              placeholder="e.g. Second term fee due by 10 August"
              value={draft.title} onChange={(event) => field('title', event.target.value)}
            />
          </div>
          <div className="col-md-4">
            <label className="form-label" htmlFor="nc-c-cat">Category</label>
            <select
              className="form-select" id="nc-c-cat"
              value={draft.category} onChange={(event) => field('category', event.target.value)}
            >
              {categoryOptions.map((option) => <option key={option}>{option}</option>)}
            </select>
          </div>
          <div className="col-12">
            <label className="form-label" htmlFor="nc-c-desc">Short description</label>
            <input
              type="text" className="form-control" id="nc-c-desc"
              placeholder="One sentence, shown on the card"
              value={draft.description} onChange={(event) => field('description', event.target.value)}
            />
          </div>
          <div className="col-12">
            <label className="form-label" htmlFor="nc-c-body">Message</label>
            <textarea
              className="form-control" id="nc-c-body" rows={5}
              placeholder="Write the full notification…"
              value={draft.body} onChange={(event) => field('body', event.target.value)}
            />
          </div>
          <div className="col-12">
            <span className="fs-12 text-muted d-block mb-1">Insert a variable</span>
            <div className="d-flex flex-wrap gap-2">
              {['{{student_name}}', '{{parent_name}}', '{{class}}', '{{fee_amount}}', '{{due_date}}']
                .map((token) => (
                  <button
                    type="button" className="btn btn-sm btn-outline-light bg-white" key={token}
                    onClick={() => field('body', `${draft.body}${token}`)}
                  >
                    <i className="ti ti-plus me-1" />{token}
                  </button>
                ))}
            </div>
          </div>
          <div className="col-md-4">
            <label className="form-label" htmlFor="nc-c-aud">Target audience</label>
            <select
              className="form-select" id="nc-c-aud"
              value={draft.audience} onChange={(event) => field('audience', event.target.value)}
            >
              {audienceOptions.map((option) => <option key={option}>{option}</option>)}
            </select>
          </div>
          <div className="col-md-4">
            <label className="form-label" htmlFor="nc-c-pri">Priority</label>
            <select
              className="form-select" id="nc-c-pri"
              value={draft.priority} onChange={(event) => field('priority', event.target.value)}
            >
              {priorityOptions.map((option) => <option key={option}>{option}</option>)}
            </select>
          </div>
          <div className="col-md-4">
            <label className="form-label" htmlFor="nc-c-tpl">Template</label>
            <select
              className="form-select" id="nc-c-tpl"
              value={draft.template}
              onChange={(event) => {
                field('template', event.target.value);
                const found = notificationTemplates.find((entry) => entry.name === event.target.value);
                if (found) field('body', found.preview);
              }}
            >
              <option>— None —</option>
              {notificationTemplates.map((entry) => <option key={entry.name}>{entry.name}</option>)}
            </select>
          </div>
          <div className="col-12">
            <span className="form-label d-block">Delivery channels</span>
            <div className="d-flex flex-wrap gap-3">
              {channelChoices.map((choice) => (
                <div className="form-check" key={choice.id}>
                  <input
                    className="form-check-input" type="checkbox" id={`nc-c-${choice.id}`}
                    checked={draft.channels.includes(choice.id)}
                    onChange={() => toggleChannel(choice.id)}
                  />
                  <label className="form-check-label fs-13" htmlFor={`nc-c-${choice.id}`}>
                    <i className={`${channelIcon[choice.id]} me-1`} />{choice.label}
                  </label>
                </div>
              ))}
            </div>
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="nc-c-files">Attachments</label>
            <input type="file" className="form-control" id="nc-c-files" />
            {/* Only email carries files. */}
            {!draft.channels.includes('Email') ? (
              <span className="fs-12 text-muted">
                Email is not selected — attachments will not be delivered
              </span>
            ) : null}
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="nc-c-exp">Expiry</label>
            <input
              type="text" className="form-control" id="nc-c-exp" placeholder="dd/mm/yyyy"
              value={draft.expiry} onChange={(event) => field('expiry', event.target.value)}
            />
          </div>
          <div className="col-12">
            <Switch
              id="nc-c-ack" title="Require acknowledgement"
              note="Recipients confirm they have read it"
              value={draft.ackRequired} onChange={(next) => field('ackRequired', next)}
            />
            <Switch
              id="nc-c-rr" title="Track read receipts"
              note="Exact on portal and push, indicative on email"
              value={draft.trackReads} onChange={(next) => field('trackReads', next)}
            />
          </div>
        </div>
      </Modal>

      {/* Email */}
      <Modal
        open={active === 'email'}
        onClose={onClose}
        title="Send email notification"
        dialogClassName="modal-lg"
        onSubmit={(event) => {
          event.preventDefault();
          onEmail({ subject, from, preheader, body: emailBody, audience: emailAudience, trackOpens });
        }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Save draft</button>
            <button
              type="button" className="btn btn-outline-light bg-white me-2"
              onClick={() => onOpen('preview')}
            >
              Preview
            </button>
            <button type="submit" className="btn btn-primary">Send email</button>
          </>
        }
      >
        <p className="fs-12 text-muted mb-3">
          The only channel that carries attachments and long-form content.
        </p>
        <div className="row g-3">
          <div className="col-md-7">
            <label className="form-label" htmlFor="nc-e-subject">Subject</label>
            <input
              type="text" className="form-control" id="nc-e-subject"
              placeholder="Shown in the inbox list"
              value={subject} onChange={(event) => setSubject(event.target.value)}
            />
          </div>
          <div className="col-md-5">
            <label className="form-label" htmlFor="nc-e-from">From</label>
            <select
              className="form-select" id="nc-e-from"
              value={from} onChange={(event) => setFrom(event.target.value)}
            >
              {['notifications@school.edu', 'accounts@school.edu', 'principal@school.edu']
                .map((option) => <option key={option}>{option}</option>)}
            </select>
          </div>
          <div className="col-12">
            <label className="form-label" htmlFor="nc-e-pre">
              Preheader <span className="text-muted fs-12">(the grey line after the subject)</span>
            </label>
            <input
              type="text" className="form-control" id="nc-e-pre"
              placeholder="A sentence the inbox shows before the message is opened"
              value={preheader} onChange={(event) => setPreheader(event.target.value)}
            />
          </div>
          <div className="col-12">
            <label className="form-label" htmlFor="nc-e-body">Message</label>
            <textarea
              className="form-control" id="nc-e-body" rows={6}
              placeholder="Write the email…"
              value={emailBody} onChange={(event) => setEmailBody(event.target.value)}
            />
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="nc-e-aud">Audience</label>
            <select
              className="form-select" id="nc-e-aud"
              value={emailAudience} onChange={(event) => setEmailAudience(event.target.value)}
            >
              {[emailAudience, 'Parents', 'All Students', 'Teachers', 'Staff']
                .filter((option, index, all) => all.indexOf(option) === index)
                .map((option) => <option key={option}>{option}</option>)}
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="nc-e-files">Attachments</label>
            <input type="file" className="form-control" id="nc-e-files" />
          </div>
          <div className="col-12">
            <Switch
              id="nc-e-track" title="Track opens"
              note="Pixel-based, so read rate is indicative"
              value={trackOpens} onChange={setTrackOpens}
            />
          </div>
        </div>
      </Modal>

      {/* Push */}
      <Modal
        open={active === 'push'}
        onClose={onClose}
        title="Send push notification"
        onSubmit={(event) => {
          event.preventDefault();
          onPush({ title: pushTitle, body: pushBody, audience: pushAudience, onTap, sound });
        }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Send push</button>
          </>
        }
      >
        <p className="fs-12 text-muted mb-3">
          Two lines on most handsets. Anything longer is truncated by the operating system, not by
          us.
        </p>
        <div className="row g-3 mb-3">
          <div className="col-12">
            <label className="form-label" htmlFor="nc-p-title">
              Title <span className="text-muted fs-12">(max {PUSH_TITLE_LIMIT} characters)</span>
            </label>
            <input
              type="text" className="form-control" id="nc-p-title"
              maxLength={PUSH_TITLE_LIMIT}
              value={pushTitle} onChange={(event) => setPushTitle(event.target.value)}
            />
          </div>
          <div className="col-12">
            <label className="form-label" htmlFor="nc-p-body">
              Body <span className="text-muted fs-12">(max {PUSH_BODY_LIMIT} characters)</span>
            </label>
            <textarea
              className="form-control" id="nc-p-body" rows={3}
              maxLength={PUSH_BODY_LIMIT}
              value={pushBody} onChange={(event) => setPushBody(event.target.value)}
            />
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="nc-p-aud">Audience</label>
            <select
              className="form-select" id="nc-p-aud"
              value={pushAudience} onChange={(event) => setPushAudience(event.target.value)}
            >
              {['Route 7 families', 'Parents', 'All Students', 'Teachers']
                .map((option) => <option key={option}>{option}</option>)}
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="nc-p-tap">On tap, open</label>
            <select
              className="form-select" id="nc-p-tap"
              value={onTap} onChange={(event) => setOnTap(event.target.value)}
            >
              {['Transport page', 'Notification detail', 'Portal home']
                .map((option) => <option key={option}>{option}</option>)}
            </select>
          </div>
        </div>
        <Switch
          id="nc-p-snd" title="Play a sound" note="Off for anything below urgent"
          value={sound} onChange={setSound}
        />

        <h6 className="fs-13 mb-2 mt-3">As it lands</h6>
        <div className="border rounded p-3 mb-2">
          <div className="d-flex align-items-center justify-content-between mb-1">
            <span className="fs-12 fw-medium">Karkaii</span>
            <span className="fs-12 text-muted">now</span>
          </div>
          <h6 className="fs-13 mb-1">{pushTitle}</h6>
          <p className="fs-13 text-muted mb-0">{pushBody}</p>
        </div>
        <div className="d-flex align-items-center justify-content-between">
          <span className="fs-12 text-muted">2,104 devices · delivers in seconds</span>
          {/* Counted as typed, against the handset's own limits. */}
          <span className={`fs-12 ${pushTitle.length >= PUSH_TITLE_LIMIT || pushBody.length >= PUSH_BODY_LIMIT ? 'text-danger' : 'text-muted'}`}>
            {pushTitle.length} / {PUSH_TITLE_LIMIT} title · {pushBody.length} / {PUSH_BODY_LIMIT} body
          </span>
        </div>
      </Modal>

      {/* Parent communication */}
      <Modal
        open={active === 'parent'}
        onClose={onClose}
        title="Create parent communication"
        dialogClassName="modal-lg"
        onSubmit={(event) => {
          event.preventDefault();
          onParent({
            title: parentTitle, type: parentType, body: parentBody,
            recipients: parentRecipients, when: parentWhen,
            alsoSend, allowReplies, ackRequired: parentAck, confidential,
          });
        }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Save draft</button>
            <button type="submit" className="btn btn-primary">Send to parents</button>
          </>
        }
      >
        <p className="fs-12 text-muted mb-3">
          Lands in the parent portal inbox, where it can be acknowledged and replied to.
        </p>
        <div className="row g-3 mb-3">
          <div className="col-md-6">
            <label className="form-label" htmlFor="nc-pc-title">Title</label>
            <input
              type="text" className="form-control" id="nc-pc-title"
              placeholder="e.g. Term-2 progress report published"
              value={parentTitle} onChange={(event) => setParentTitle(event.target.value)}
            />
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="nc-pc-type">Communication type</label>
            <select
              className="form-select" id="nc-pc-type"
              value={parentType} onChange={(event) => setParentType(event.target.value)}
            >
              {parentCommunications.map((entry) => <option key={entry.title}>{entry.title}</option>)}
            </select>
          </div>
          <div className="col-12">
            <label className="form-label" htmlFor="nc-pc-body">Message</label>
            <textarea
              className="form-control" id="nc-pc-body" rows={5}
              placeholder="Write to parents directly. Personal details are resolved per recipient."
              value={parentBody} onChange={(event) => setParentBody(event.target.value)}
            />
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="nc-pc-aud">Recipients</label>
            <select
              className="form-select" id="nc-pc-aud"
              value={parentRecipients} onChange={(event) => setParentRecipients(event.target.value)}
            >
              {['All parents', 'Parents by class', 'Parents by section', 'Individual parents', 'Custom group']
                .map((option) => <option key={option}>{option}</option>)}
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="nc-pc-when">When</label>
            <select
              className="form-select" id="nc-pc-when"
              value={parentWhen} onChange={(event) => setParentWhen(event.target.value)}
            >
              {['Immediately', 'Scheduled', 'On an event trigger']
                .map((option) => <option key={option}>{option}</option>)}
            </select>
          </div>
        </div>
        <Switch
          id="nc-pc-alt" title="Also send by email and push" note="Portal copy is always written"
          value={alsoSend} onChange={setAlsoSend}
          /* A confidential note stays in the portal. */
          disabled={confidential}
        />
        <Switch
          id="nc-pc-rep" title="Allow replies"
          note="Replies land in the parent communication inbox"
          value={allowReplies} onChange={setAllowReplies}
        />
        <Switch
          id="nc-pc-ack" title="Require acknowledgement" note="Parents confirm they have read it"
          value={parentAck} onChange={setParentAck}
        />
        <Switch
          id="nc-pc-conf" title="Confidential"
          note="Excluded from exports and bulk reports — and from email and push"
          value={confidential} onChange={setConfidential}
        />
      </Modal>

      {/* Schedule */}
      <Modal
        open={active === 'schedule'}
        onClose={onClose}
        title="Schedule notification"
        onSubmit={(event) => {
          event.preventDefault();
          onSchedule({
            delivery, sendDate, sendTime, timeZone, expiry, quietHours, retry, remindUnread,
          });
        }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Schedule</button>
          </>
        }
      >
        <p className="fs-12 text-muted mb-3">
          Quiet hours are respected unless the notification is marked urgent.
        </p>
        <div className="mb-3">
          <span className="form-label d-block">Delivery</span>
          <div className="d-flex flex-wrap gap-3">
            {['Immediate', 'Scheduled', 'Recurring', 'On event'].map((option) => (
              <div className="form-check" key={option}>
                <input
                  className="form-check-input" type="radio" name="nc-delivery"
                  id={`nc-w-${option}`} checked={delivery === option}
                  onChange={() => setDelivery(option)}
                />
                <label className="form-check-label fs-13" htmlFor={`nc-w-${option}`}>{option}</label>
              </div>
            ))}
          </div>
        </div>
        <div className="row g-3 mb-3">
          <div className="col-md-6">
            <label className="form-label" htmlFor="nc-s-date">Send date</label>
            <input
              type="text" className="form-control" id="nc-s-date"
              /* An immediate notification has no date of its own. */
              disabled={delivery === 'Immediate'}
              value={delivery === 'Immediate' ? 'On publish' : sendDate}
              onChange={(event) => setSendDate(event.target.value)}
            />
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="nc-s-time">Send time</label>
            <input
              type="time" className="form-control" id="nc-s-time"
              disabled={delivery === 'Immediate'}
              value={sendTime} onChange={(event) => setSendTime(event.target.value)}
            />
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="nc-s-tz">Time zone</label>
            <select
              className="form-select" id="nc-s-tz"
              value={timeZone} onChange={(event) => setTimeZone(event.target.value)}
            >
              {['IST (UTC +5:30)', 'GST (UTC +4:00)', 'UTC'].map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="nc-s-exp">Expiry</label>
            <input
              type="text" className="form-control" id="nc-s-exp"
              value={expiry} onChange={(event) => setExpiry(event.target.value)}
            />
          </div>
        </div>
        <Switch
          id="nc-s-qh" title="Respect quiet hours" note="Nothing leaves 9 pm to 7 am"
          value={quietHours} onChange={setQuietHours}
        />
        <Switch
          id="nc-s-rt" title="Retry failed deliveries" note="Twice, ten minutes apart"
          value={retry} onChange={setRetry}
        />
        <Switch
          id="nc-s-rm" title="Remind those who have not read" note="Once, after 24 hours"
          value={remindUnread} onChange={setRemindUnread}
        />
      </Modal>

      {/* Preview */}
      <Modal
        open={active === 'preview' && row !== null}
        onClose={onClose}
        title="Preview notification"
        dialogClassName="modal-lg"
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Close</button>
            <button
              type="button" className="btn btn-outline-light bg-white me-2"
              onClick={() => onOpen('schedule')}
            >
              Schedule
            </button>
            <button type="button" className="btn btn-primary" onClick={onClose}>
              Send to {row ? row.audience.toLocaleString() : 0}
            </button>
          </>
        }
      >
        {row ? (
          <>
            <p className="fs-12 text-muted mb-3">
              The same notification as it appears on each of the three channels.
            </p>

            <h6 className="fs-13 mb-2">Email &amp; parent portal</h6>
            <div className="border rounded p-3 mb-3">
              <span className="fs-12 text-muted d-block mb-1">
                {row.category} · {row.audienceLabel}
              </span>
              <h6 className="fs-15 mb-2">{row.title}</h6>
              <p className="fs-13 text-muted mb-0">{row.summary}</p>
            </div>

            <h6 className="fs-13 mb-2">Push notification</h6>
            <div className="border rounded p-3 mb-3">
              <div className="d-flex align-items-center justify-content-between mb-1">
                <span className="fs-12 fw-medium">Karkaii</span>
                <span className="fs-12 text-muted">{row.stamp.split(', ')[1] ?? 'now'}</span>
              </div>
              {/* Cut to what a handset shows, from the same copy. */}
              <h6 className="fs-13 mb-1">{row.title.slice(0, PUSH_TITLE_LIMIT)}</h6>
              <p className="fs-13 text-muted mb-0">{row.summary.slice(0, PUSH_BODY_LIMIT)}</p>
            </div>

            <div className="border rounded p-3">
              <Row label="Recipients" value={row.audience.toLocaleString()} />
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
              <Row
                label="Estimated delivery"
                value={row.audience > 1000 ? 'Under 2 minutes' : 'Under 30 seconds'}
              />
              {row.delivered > 0 ? (
                <Row
                  label="Last time"
                  value={`${deliveryRateOf(row)}% delivered · ${readRateOf(row)}% read`}
                />
              ) : null}
            </div>
          </>
        ) : null}
      </Modal>

      {/* Save as template */}
      <Modal
        open={active === 'template'}
        onClose={onClose}
        title="Save as template"
        onSubmit={(event) => {
          event.preventDefault();
          onSaveTemplate({
            name: templateName, category: templateCategory, body: templateBody,
            channels: templateChannels, shared: templateShared,
          });
        }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Save template</button>
          </>
        }
      >
        <p className="fs-12 text-muted mb-3">
          A template carries the channels it was written for — a push body has to survive being read
          in one line.
        </p>
        <div className="row g-3 mb-3">
          <div className="col-md-7">
            <label className="form-label" htmlFor="nc-t-name">Template name</label>
            <input
              type="text" className="form-control" id="nc-t-name"
              value={templateName} onChange={(event) => setTemplateName(event.target.value)}
            />
          </div>
          <div className="col-md-5">
            <label className="form-label" htmlFor="nc-t-cat">Category</label>
            <select
              className="form-select" id="nc-t-cat"
              value={templateCategory} onChange={(event) => setTemplateCategory(event.target.value)}
            >
              {['Fees', 'Attendance', 'Examination', 'Holiday', 'PTA', 'Emergency', 'Transport', 'Homework', 'Medical', 'Greetings']
                .map((option) => <option key={option}>{option}</option>)}
            </select>
          </div>
          <div className="col-12">
            <label className="form-label" htmlFor="nc-t-body">Body</label>
            <textarea
              className="form-control" id="nc-t-body" rows={4}
              value={templateBody} onChange={(event) => setTemplateBody(event.target.value)}
            />
          </div>
          <div className="col-12">
            <span className="form-label d-block">Written for</span>
            <div className="d-flex flex-wrap gap-3">
              {channelChoices.map((choice) => (
                <div className="form-check" key={choice.id}>
                  <input
                    className="form-check-input" type="checkbox" id={`nc-t-${choice.id}`}
                    checked={templateChannels.includes(choice.id)}
                    onChange={() => toggleTemplateChannel(choice.id)}
                  />
                  <label className="form-check-label fs-13" htmlFor={`nc-t-${choice.id}`}>
                    <i className={`${channelIcon[choice.id]} me-1`} />{choice.id}
                  </label>
                </div>
              ))}
            </div>
            {/* Push has a hard limit; a long body will not survive it. */}
            {templateChannels.includes('Push') && templateBody.length > PUSH_BODY_LIMIT ? (
              <span className="fs-12 text-danger">
                {templateBody.length} characters — a push body is cut at {PUSH_BODY_LIMIT}
              </span>
            ) : null}
          </div>
        </div>
        <Switch
          id="nc-t-sh" title="Available to all staff" note="Otherwise administrators only"
          value={templateShared} onChange={setTemplateShared}
        />
        {/* Counted from the tokens in the body. */}
        <p className="fs-13 text-muted mb-0 mt-2">
          {templateVariables} variable{templateVariables === 1 ? '' : 's'} detected
        </p>
      </Modal>

      {/* Duplicate */}
      <Modal
        open={active === 'duplicate' && row !== null}
        onClose={onClose}
        title="Duplicate notification"
        onSubmit={(event) => {
          event.preventDefault();
          onDuplicate({
            title: copyTitle, copyAudience, copyChannels, copyAttachments, unreadOnly,
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
              The copy is created as a draft. Delivery and read history are not carried over.
            </p>
            <div className="mb-3">
              <label className="form-label" htmlFor="nc-d-title">New title</label>
              <input
                type="text" className="form-control" id="nc-d-title"
                value={copyTitle} onChange={(event) => setCopyTitle(event.target.value)}
              />
            </div>
            <Switch
              id="nc-d-a" title="Copy audience"
              note={`${row.audienceLabel} · ${row.audience.toLocaleString()}`}
              value={copyAudience} onChange={setCopyAudience}
            />
            <Switch
              id="nc-d-c" title="Copy channels" note={row.channels.join(', ')}
              value={copyChannels} onChange={setCopyChannels}
            />
            <Switch
              id="nc-d-f" title="Copy attachments"
              note={row.attachments.length > 0
                ? `${row.attachments.length} file${row.attachments.length === 1 ? '' : 's'}`
                : 'Nothing attached'}
              value={copyAttachments} onChange={setCopyAttachments}
              disabled={row.attachments.length === 0}
            />
            {/* Counted from what was delivered but never opened. */}
            <Switch
              id="nc-d-u" title="Send only to those who did not read"
              note={unreadCount > 0 ? `${unreadCount.toLocaleString()} recipients` : 'Everyone opened it'}
              value={unreadOnly} onChange={setUnreadOnly}
              disabled={unreadCount === 0}
            />
          </>
        ) : null}
      </Modal>

      {/* Import */}
      <Modal
        open={active === 'import'}
        onClose={onClose}
        title="Import recipients"
        onSubmit={(event) => {
          event.preventDefault();
          onImport({ matchExisting, dropDuplicates });
        }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Import</button>
          </>
        }
      >
        <p className="fs-12 text-muted mb-3">Contacts only. Nothing is notified from this step.</p>
        <div className="border rounded text-center p-4 mb-3">
          <span className="avatar avatar-lg bg-primary-transparent text-primary rounded-circle mb-2">
            <i className="ti ti-table-import fs-20" />
          </span>
          <h6 className="fs-14 mb-1">Choose a CSV or Excel file</h6>
          <p className="fs-12 text-muted mb-2">
            Email address in column one, mobile in column two. Any further columns become variables
            available to templates.
          </p>
          <input type="file" className="form-control" aria-label="Recipient file" />
        </div>
        <Switch
          id="nc-i-m" title="Match against existing records" note="By email, then by mobile"
          value={matchExisting} onChange={setMatchExisting}
        />
        <Switch
          id="nc-i-d" title="Drop duplicates" note="Keeps the first occurrence"
          value={dropDuplicates} onChange={setDropDuplicates}
        />
      </Modal>

      {/* Export */}
      <Modal
        open={active === 'export'}
        onClose={onClose}
        title="Export delivery report"
        onSubmit={(event) => {
          event.preventDefault();
          onExport({ scope: exportScope, format: exportFormat, includeRead });
        }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Export</button>
          </>
        }
      >
        <div className="row g-3 mb-3">
          <div className="col-md-6">
            <label className="form-label" htmlFor="nc-x-scope">Scope</label>
            <select
              className="form-select" id="nc-x-scope"
              value={exportScope} onChange={(event) => setExportScope(event.target.value)}
            >
              <option>Current filters</option>
              <option>The whole period</option>
              <option>Low read rate only</option>
            </select>
            {exportScope === 'Current filters' ? (
              <span className="fs-12 text-muted">{matchCount} notifications match</span>
            ) : null}
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="nc-x-format">Format</label>
            <select
              className="form-select" id="nc-x-format"
              value={exportFormat} onChange={(event) => setExportFormat(event.target.value)}
            >
              <option>CSV</option>
              <option>Excel</option>
              <option>PDF</option>
            </select>
          </div>
        </div>
        <Switch
          id="nc-x-read" title="Include read and acknowledgement figures"
          note="Confidential communications are excluded either way"
          value={includeRead} onChange={setIncludeRead}
        />
      </Modal>
    </>
  );
};

export default NotificationModals;
