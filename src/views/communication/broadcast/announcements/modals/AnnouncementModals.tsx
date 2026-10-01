import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import DateField from '@components/ui/DateField';
import Modal from '@components/ui/Modal';
import ImageWithBasePath from '@core/common/imageWithBasePath';
import type { Announcement, Category, Channel, Priority } from '../data/announcements.data';
import {
  audienceOptions,
  categoryOptions,
  channelIcon,
  channelOptions,
  channelShort,
  priorityBadge,
  priorityOptions,
  statusBadge,
  statusOf,
  templateAudienceOptions,
  templateCategoryOptions,
  timeZoneOptions,
} from '../data/announcements.data';

export type AnnouncementModalId =
  | 'new' | 'schedule' | 'publish' | 'duplicate' | 'preview' | 'template';

export type ComposeIntent = 'draft' | 'schedule' | 'publish';

export interface ComposeDraft {
  title: string;
  category: Category;
  summary: string;
  body: string;
  audience: string;
  priority: Priority;
  expiry: string;
  channels: Channel[];
  ackRequired: boolean;
  allowComments: boolean;
}

export const emptyCompose: ComposeDraft = {
  title: '', category: 'Academic', summary: '', body: '',
  audience: audienceOptions[0], priority: 'Normal', expiry: '',
  channels: ['In-App', 'Email'], ackRequired: false, allowComments: true,
};

export const composeOf = (row: Announcement): ComposeDraft => ({
  title: row.title,
  category: row.category,
  summary: row.summary,
  body: row.body
    .map((block) => [block.heading, ...block.paragraphs, ...block.bullets.map((line) => `• ${line}`)]
      .filter(Boolean)
      .join('\n'))
    .join('\n\n'),
  audience: audienceOptions.find((option) => row.audienceLabel.startsWith(option)) ?? audienceOptions[0],
  priority: row.priority,
  expiry: toInputDate(row.expires),
  channels: row.deliveries.map((delivery) => delivery.channel),
  ackRequired: row.ackRequired,
  allowComments: row.allowComments,
});

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** "31 Jul 2026" → "31-07-2026", which is what the date inputs take. */
export function toInputDate(value: string): string {
  if (!value) return '';
  const [day, month, year] = value.split(' ');
  const index = months.indexOf(month);
  return index === -1 ? '' : `${day.padStart(2, '0')}-${String(index + 1).padStart(2, '0')}-${year}`;
}

/** "31-07-2026" → "31 Jul 2026", the way a card prints a date. */
export function toRowDate(value: string): string {
  if (!value) return '';
  const [day, month, year] = value.split('-');
  return months[Number(month) - 1] ? `${Number(day)} ${months[Number(month) - 1]} ${year}` : value;
}

export interface SchedulePayload {
  sendDate: string;
  sendTime: string;
  timeZone: string;
  autoExpiry: string;
  approval: boolean;
  skipWeekends: boolean;
  reminder: boolean;
}

export interface PublishPayload {
  channels: Channel[];
  notifyOnCompletion: boolean;
}

export interface DuplicatePayload {
  title: string;
  copyAudience: boolean;
  copyChannels: boolean;
  copyAttachments: boolean;
}

export interface TemplatePayload {
  name: string;
  category: Category;
  audience: string;
  priority: Priority;
  body: string;
  shared: boolean;
}

export interface AnnouncementModalsProps {
  active: AnnouncementModalId | null;
  row: Announcement | null;
  /**
   * Opens the composer already filled in — what "Use template" does, since a
   * template is a starting point rather than an announcement to edit.
   */
  seed?: ComposeDraft | null;
  onClose: () => void;
  onCompose: (draft: ComposeDraft, intent: ComposeIntent) => void;
  onSchedule: (payload: SchedulePayload) => void;
  onPublish: (payload: PublishPayload) => void;
  onDuplicate: (payload: DuplicatePayload) => void;
  onCreateTemplate: (payload: TemplatePayload) => void;
}

const Row = ({ label, value }: { label: string; value: ReactNode }) => (
  <div className="d-flex align-items-center justify-content-between gap-3 mb-2">
    <span className="fs-13 text-muted">{label}</span>
    <span className="fs-13 fw-medium text-end">{value}</span>
  </div>
);

const AnnouncementModals = ({
  active, row, seed, onClose, onCompose, onSchedule, onPublish, onDuplicate, onCreateTemplate,
}: AnnouncementModalsProps) => {
  const [draft, setDraft] = useState<ComposeDraft>(emptyCompose);

  const [sendDate, setSendDate] = useState('12-08-2026');
  const [sendTime, setSendTime] = useState('08:00');
  const [timeZone, setTimeZone] = useState(timeZoneOptions[0]);
  const [autoExpiry, setAutoExpiry] = useState('16-08-2026');
  const [approval, setApproval] = useState(true);
  const [skipWeekends, setSkipWeekends] = useState(false);
  const [reminder, setReminder] = useState(true);

  const [publishChannels, setPublishChannels] = useState<Channel[]>([]);
  const [notifyOnCompletion, setNotifyOnCompletion] = useState(true);

  const [copyTitle, setCopyTitle] = useState('');
  const [copyAudience, setCopyAudience] = useState(true);
  const [copyChannels, setCopyChannels] = useState(true);
  const [copyAttachments, setCopyAttachments] = useState(false);

  const [templateName, setTemplateName] = useState('');
  const [templateCategory, setTemplateCategory] = useState<Category>('Holiday');
  const [templateAudience, setTemplateAudience] = useState(templateAudienceOptions[0]);
  const [templatePriority, setTemplatePriority] = useState<Priority>('Normal');
  const [templateBody, setTemplateBody] = useState('');
  const [templateShared, setTemplateShared] = useState(true);

  useEffect(() => {
    if (active === 'new') setDraft(seed ?? (row ? composeOf(row) : emptyCompose));
    if (!row) return;
    if (active === 'publish') setPublishChannels(row.deliveries.map((delivery) => delivery.channel));
    if (active === 'duplicate') {
      setCopyTitle(`${row.title} (copy)`);
      setCopyAudience(true);
      setCopyChannels(true);
      setCopyAttachments(false);
    }
    if (active === 'schedule') {
      setSendDate(toInputDate(row.dated) || '12-08-2026');
      setSendTime('08:00');
      setAutoExpiry(toInputDate(row.expires) || '16-08-2026');
    }
    if (active === 'template') {
      setTemplateName('');
      setTemplateCategory(row.category);
      setTemplatePriority(row.priority);
      setTemplateBody(row.summary);
    }
  }, [active, row, seed]);

  const field = (key: keyof ComposeDraft, value: string | boolean | Channel[]) =>
    setDraft((current) => ({ ...current, [key]: value }));

  const toggleChannel = (channel: Channel) =>
    setDraft((current) => ({
      ...current,
      channels: current.channels.includes(channel)
        ? current.channels.filter((entry) => entry !== channel)
        : [...current.channels, channel],
    }));

  const togglePublishChannel = (channel: Channel) =>
    setPublishChannels((current) => (current.includes(channel)
      ? current.filter((entry) => entry !== channel)
      : [...current, channel]));

  /** SMS is the only channel the template charges for. */
  const credits = row && publishChannels.includes('SMS') ? row.audienceTotal : 0;

  return (
    <>
      {/* New announcement */}
      <Modal
        open={active === 'new'}
        onClose={onClose}
        title="New announcement"
        dialogClassName="modal-lg"
        onSubmit={(event) => { event.preventDefault(); onCompose(draft, 'publish'); }}
        footer={
          <>
            <button
              type="button" className="btn btn-light me-2"
              onClick={() => onCompose(draft, 'draft')}
            >
              Save as draft
            </button>
            <button
              type="button" className="btn btn-outline-light bg-white me-2"
              onClick={() => onCompose(draft, 'schedule')}
            >
              Schedule…
            </button>
            <button type="submit" className="btn btn-primary">Publish now</button>
          </>
        }
      >
        <p className="fs-12 text-muted mb-3">Write it once; the channels below decide how it travels.</p>
        <div className="row g-3">
          <div className="col-md-8">
            <label className="form-label" htmlFor="cmx-n-title">Title</label>
            <input
              type="text" className="form-control" id="cmx-n-title"
              placeholder="e.g. School closed Thursday due to heavy rainfall"
              value={draft.title} onChange={(event) => field('title', event.target.value)}
            />
          </div>
          <div className="col-md-4">
            <label className="form-label" htmlFor="cmx-n-cat">Category</label>
            <select
              className="form-select" id="cmx-n-cat"
              value={draft.category} onChange={(event) => field('category', event.target.value)}
            >
              {categoryOptions.map((option) => <option key={option}>{option}</option>)}
            </select>
          </div>
          <div className="col-12">
            <label className="form-label" htmlFor="cmx-n-sum">Summary</label>
            <input
              type="text" className="form-control" id="cmx-n-sum"
              placeholder="One or two sentences shown on the card and in the push notification."
              value={draft.summary} onChange={(event) => field('summary', event.target.value)}
            />
          </div>
          <div className="col-12">
            <label className="form-label" htmlFor="cmx-n-body">Message</label>
            <textarea
              className="form-control" id="cmx-n-body" rows={6}
              placeholder="Write the full announcement…"
              value={draft.body} onChange={(event) => field('body', event.target.value)}
            />
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="cmx-n-aud">Audience</label>
            <select
              className="form-select" id="cmx-n-aud"
              value={draft.audience} onChange={(event) => field('audience', event.target.value)}
            >
              {audienceOptions.map((option) => <option key={option}>{option}</option>)}
            </select>
          </div>
          <div className="col-md-3">
            <label className="form-label" htmlFor="cmx-n-pri">Priority</label>
            <select
              className="form-select" id="cmx-n-pri"
              value={draft.priority} onChange={(event) => field('priority', event.target.value)}
            >
              {priorityOptions.map((option) => <option key={option}>{option}</option>)}
            </select>
          </div>
          <div className="col-md-3">
            <label className="form-label" htmlFor="cmx-n-exp">Expiry date</label>
            <DateField id="cmx-n-exp" value={draft.expiry} onChange={(next) => field('expiry', next)} />
          </div>

          <div className="col-12">
            <span className="form-label d-block">Delivery channels</span>
            <div className="d-flex flex-wrap gap-3">
              {channelOptions.map((channel) => (
                <div className="form-check" key={channel}>
                  <input
                    className="form-check-input" type="checkbox" id={`cmx-n-${channel}`}
                    checked={draft.channels.includes(channel)}
                    onChange={() => toggleChannel(channel)}
                  />
                  <label className="form-check-label fs-13" htmlFor={`cmx-n-${channel}`}>
                    <i className={`${channelIcon[channel]} me-1`} />{channel}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="col-md-6">
            <label className="form-label" htmlFor="cmx-n-cover">Cover image</label>
            <input type="file" className="form-control" id="cmx-n-cover" />
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="cmx-n-files">Attachments</label>
            <input type="file" className="form-control" id="cmx-n-files" />
          </div>

          <div className="col-12">
            <div className="d-flex align-items-center justify-content-between border rounded p-2 mb-2">
              <div>
                <h6 className="fs-13 mb-0">Require acknowledgement</h6>
                <span className="fs-12 text-muted">Recipients confirm they have read it</span>
              </div>
              <div className="form-check form-switch mb-0">
                <input
                  className="form-check-input" type="checkbox" role="switch" id="cmx-n-ack"
                  checked={draft.ackRequired}
                  onChange={(event) => field('ackRequired', event.target.checked)}
                />
                <label className="form-check-label visually-hidden" htmlFor="cmx-n-ack">
                  Require acknowledgement
                </label>
              </div>
            </div>
            <div className="d-flex align-items-center justify-content-between border rounded p-2 mb-0">
              <div>
                <h6 className="fs-13 mb-0">Allow comments</h6>
                <span className="fs-12 text-muted">Replies appear in the announcement thread</span>
              </div>
              <div className="form-check form-switch mb-0">
                <input
                  className="form-check-input" type="checkbox" role="switch" id="cmx-n-com"
                  checked={draft.allowComments}
                  onChange={(event) => field('allowComments', event.target.checked)}
                />
                <label className="form-check-label visually-hidden" htmlFor="cmx-n-com">
                  Allow comments
                </label>
              </div>
            </div>
          </div>
        </div>
      </Modal>

      {/* Schedule announcement */}
      <Modal
        open={active === 'schedule'}
        onClose={onClose}
        title="Schedule announcement"
        onSubmit={(event) => {
          event.preventDefault();
          onSchedule({ sendDate, sendTime, timeZone, autoExpiry, approval, skipWeekends, reminder });
        }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Add to queue</button>
          </>
        }
      >
        <p className="fs-12 text-muted mb-3">
          It stays in the queue until the send time, and only goes out if approved by then.
        </p>
        {row ? (
          <div className="border rounded p-2 mb-3">
            <h6 className="fs-13 mb-0">{row.title}</h6>
            <span className="fs-12 text-muted">{row.category} · {row.audienceLabel}</span>
          </div>
        ) : null}
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label" htmlFor="cmx-s-date">Send date</label>
            <DateField id="cmx-s-date" value={sendDate} onChange={setSendDate} />
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="cmx-s-time">Send time</label>
            <input
              type="time" className="form-control" id="cmx-s-time"
              value={sendTime} onChange={(event) => setSendTime(event.target.value)}
            />
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="cmx-s-tz">Time zone</label>
            <select
              className="form-select" id="cmx-s-tz"
              value={timeZone} onChange={(event) => setTimeZone(event.target.value)}
            >
              {timeZoneOptions.map((option) => <option key={option}>{option}</option>)}
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="cmx-s-exp">Auto-expiry</label>
            <DateField id="cmx-s-exp" value={autoExpiry} onChange={setAutoExpiry} />
          </div>
          <div className="col-12">
            {[
              {
                id: 'cmx-s-ap', title: 'Approval required',
                note: 'Principal signs off before it leaves the queue',
                value: approval, set: setApproval,
              },
              {
                id: 'cmx-s-wk', title: 'Skip weekends',
                note: 'Moves to the next working morning',
                value: skipWeekends, set: setSkipWeekends,
              },
              {
                id: 'cmx-s-rm', title: 'Send a reminder',
                note: 'Repeats once if unread after 24 hours',
                value: reminder, set: setReminder,
              },
            ].map((toggle, index, all) => (
              <div
                className={`d-flex align-items-center justify-content-between border rounded p-2 ${index === all.length - 1 ? 'mb-0' : 'mb-2'}`}
                key={toggle.id}
              >
                <div>
                  <h6 className="fs-13 mb-0">{toggle.title}</h6>
                  <span className="fs-12 text-muted">{toggle.note}</span>
                </div>
                <div className="form-check form-switch mb-0">
                  <input
                    className="form-check-input" type="checkbox" role="switch" id={toggle.id}
                    checked={toggle.value} onChange={(event) => toggle.set(event.target.checked)}
                  />
                  <label className="form-check-label visually-hidden" htmlFor={toggle.id}>
                    {toggle.title}
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Modal>

      {/* Publish announcement */}
      <Modal
        open={active === 'publish' && row !== null}
        onClose={onClose}
        title="Publish announcement"
        onSubmit={(event) => {
          event.preventDefault();
          onPublish({ channels: publishChannels, notifyOnCompletion });
        }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">
              Publish to {row ? row.audienceTotal.toLocaleString() : 0} recipients
            </button>
          </>
        }
      >
        {row ? (
          <>
            <div className="alert alert-warning d-flex align-items-center gap-2 mb-3">
              <i className="ti ti-alert-triangle fs-16" />
              <span className="fs-13">
                Once sent, SMS and push cannot be recalled. In-app and website copies can be edited
                afterwards.
              </span>
            </div>

            <div className="border rounded p-3 mb-3">
              <Row label="Announcement" value={row.title} />
              <Row
                label="Audience"
                value={`${row.audienceLabel} · ${row.audienceTotal.toLocaleString()}`}
              />
              <Row
                label="Channels"
                value={
                  <span className="d-inline-flex gap-1">
                    {publishChannels.length === 0 ? 'None selected' : publishChannels.map((channel) => (
                      <i className={channelIcon[channel]} key={channel} title={channelShort[channel]} />
                    ))}
                  </span>
                }
              />
              {/* SMS is the only channel that costs credits. */}
              <div className="d-flex align-items-center justify-content-between gap-3 mb-0">
                <span className="fs-13 text-muted">
                  Estimated credits
                  <span className="d-block fs-12">
                    {publishChannels.includes('SMS') ? 'One credit per SMS recipient' : 'SMS is not selected'}
                  </span>
                </span>
                <span className="fs-13 fw-medium">{credits.toLocaleString()}</span>
              </div>
            </div>

            <div className="mb-3">
              <span className="form-label d-block">Channels to publish on</span>
              <div className="d-flex flex-wrap gap-3">
                {channelOptions.map((channel) => (
                  <div className="form-check" key={channel}>
                    <input
                      className="form-check-input" type="checkbox" id={`cmx-p-${channel}`}
                      checked={publishChannels.includes(channel)}
                      onChange={() => togglePublishChannel(channel)}
                    />
                    <label className="form-check-label fs-13" htmlFor={`cmx-p-${channel}`}>
                      <i className={`${channelIcon[channel]} me-1`} />{channel}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="d-flex align-items-center justify-content-between border rounded p-2 mb-0">
              <div>
                <h6 className="fs-13 mb-0">Notify me on completion</h6>
                <span className="fs-12 text-muted">A summary once every channel has finished</span>
              </div>
              <div className="form-check form-switch mb-0">
                <input
                  className="form-check-input" type="checkbox" role="switch" id="cmx-p-n"
                  checked={notifyOnCompletion}
                  onChange={(event) => setNotifyOnCompletion(event.target.checked)}
                />
                <label className="form-check-label visually-hidden" htmlFor="cmx-p-n">
                  Notify on completion
                </label>
              </div>
            </div>
          </>
        ) : null}
      </Modal>

      {/* Duplicate announcement */}
      <Modal
        open={active === 'duplicate' && row !== null}
        onClose={onClose}
        title="Duplicate announcement"
        onSubmit={(event) => {
          event.preventDefault();
          onDuplicate({ title: copyTitle, copyAudience, copyChannels, copyAttachments });
        }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Duplicate</button>
          </>
        }
      >
        <p className="fs-12 text-muted mb-3">
          The copy is created as a draft. Delivery history and read status are not carried over.
        </p>
        <div className="mb-3">
          <label className="form-label" htmlFor="cmx-d-title">New title</label>
          <input
            type="text" className="form-control" id="cmx-d-title"
            value={copyTitle} onChange={(event) => setCopyTitle(event.target.value)}
          />
        </div>
        {[
          { id: 'cmx-d-a', title: 'Copy audience', note: row?.audienceLabel ?? '', value: copyAudience, set: setCopyAudience },
          {
            id: 'cmx-d-c', title: 'Copy channels',
            note: row ? row.deliveries.map((delivery) => channelShort[delivery.channel]).join(', ') : '',
            value: copyChannels, set: setCopyChannels,
          },
          {
            id: 'cmx-d-f', title: 'Copy attachments',
            note: row && row.attachments.length > 0
              ? `${row.attachments.length} file${row.attachments.length === 1 ? '' : 's'}`
              : 'Nothing attached',
            value: copyAttachments, set: setCopyAttachments,
          },
        ].map((toggle, index, all) => (
          <div
            className={`d-flex align-items-center justify-content-between border rounded p-2 ${index === all.length - 1 ? 'mb-0' : 'mb-2'}`}
            key={toggle.id}
          >
            <div>
              <h6 className="fs-13 mb-0">{toggle.title}</h6>
              <span className="fs-12 text-muted">{toggle.note}</span>
            </div>
            <div className="form-check form-switch mb-0">
              <input
                className="form-check-input" type="checkbox" role="switch" id={toggle.id}
                /* Nothing to carry over when the notice has no attachment. */
                disabled={toggle.id === 'cmx-d-f' && (row?.attachments.length ?? 0) === 0}
                checked={toggle.value} onChange={(event) => toggle.set(event.target.checked)}
              />
              <label className="form-check-label visually-hidden" htmlFor={toggle.id}>{toggle.title}</label>
            </div>
          </div>
        ))}
      </Modal>

      {/* Preview announcement */}
      <Modal
        open={active === 'preview' && row !== null}
        onClose={onClose}
        title="Preview announcement"
        dialogClassName="modal-lg"
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Close</button>
            <button
              type="button" className="btn btn-primary"
              onClick={() => onPublish({ channels: row?.deliveries.map((d) => d.channel) ?? [], notifyOnCompletion })}
            >
              Publish now
            </button>
          </>
        }
      >
        {row ? (
          <>
            <p className="fs-12 text-muted mb-3">As a parent sees it in the portal inbox.</p>
            <div className="message-preview border rounded overflow-hidden mb-3">
              <ImageWithBasePath src={row.cover} alt={row.coverAlt} className="img-fluid w-100" />
              <div className="p-3">
                <span className="fs-12 text-muted d-block mb-1">{row.category} · {row.audienceLabel}</span>
                <h5 className="fs-16 mb-2">{row.title}</h5>
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
              </div>
            </div>
            <div className="d-flex align-items-center flex-wrap gap-2">
              <span className={priorityBadge[row.priority]}>{row.priority}</span>
              <span className={statusBadge[statusOf(row)]}>{statusOf(row)}</span>
              {/* The footer line is the record's own, not a fixed August date. */}
              <span className="fs-12 text-muted ms-auto">
                {statusOf(row) === 'Scheduled'
                  ? `Scheduled for ${row.dated}, ${row.datedAt}`
                  : statusOf(row) === 'Draft'
                    ? `Drafted ${row.dated}, ${row.datedAt}`
                    : `Published ${row.dated}, ${row.datedAt}`}
              </span>
            </div>
          </>
        ) : null}
      </Modal>

      {/* Create template */}
      <Modal
        open={active === 'template'}
        onClose={onClose}
        title="Create template"
        onSubmit={(event) => {
          event.preventDefault();
          onCreateTemplate({
            name: templateName, category: templateCategory, audience: templateAudience,
            priority: templatePriority, body: templateBody, shared: templateShared,
          });
        }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Create template</button>
          </>
        }
      >
        <p className="fs-12 text-muted mb-3">
          Save a notice the school sends every year so only the dates change next time.
        </p>
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label" htmlFor="cmx-t-name">Template name</label>
            <input
              type="text" className="form-control" id="cmx-t-name" placeholder="e.g. Holiday Notice"
              value={templateName} onChange={(event) => setTemplateName(event.target.value)}
            />
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="cmx-t-cat">Category</label>
            <select
              className="form-select" id="cmx-t-cat"
              value={templateCategory}
              onChange={(event) => setTemplateCategory(event.target.value as Category)}
            >
              {templateCategoryOptions.map((option) => <option key={option}>{option}</option>)}
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="cmx-t-aud">Default audience</label>
            <select
              className="form-select" id="cmx-t-aud"
              value={templateAudience} onChange={(event) => setTemplateAudience(event.target.value)}
            >
              {templateAudienceOptions.map((option) => <option key={option}>{option}</option>)}
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="cmx-t-pri">Default priority</label>
            <select
              className="form-select" id="cmx-t-pri"
              value={templatePriority}
              onChange={(event) => setTemplatePriority(event.target.value as Priority)}
            >
              {priorityOptions.map((option) => <option key={option}>{option}</option>)}
            </select>
          </div>
          <div className="col-12">
            <label className="form-label" htmlFor="cmx-t-body">Template body</label>
            <textarea
              className="form-control" id="cmx-t-body" rows={5}
              placeholder="Use {{date}}, {{class}} and {{amount}} as placeholders."
              value={templateBody} onChange={(event) => setTemplateBody(event.target.value)}
            />
          </div>
          <div className="col-12">
            <div className="d-flex align-items-center justify-content-between border rounded p-2 mb-0">
              <div>
                <h6 className="fs-13 mb-0">Available to all staff</h6>
                <span className="fs-12 text-muted">Otherwise only administrators can use it</span>
              </div>
              <div className="form-check form-switch mb-0">
                <input
                  className="form-check-input" type="checkbox" role="switch" id="cmx-t-sh"
                  checked={templateShared} onChange={(event) => setTemplateShared(event.target.checked)}
                />
                <label className="form-check-label visually-hidden" htmlFor="cmx-t-sh">
                  Available to all staff
                </label>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default AnnouncementModals;
