import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import ImageWithBasePath from '@core/common/imageWithBasePath';
import Modal from '@components/ui/Modal';
import type { Conversation } from '../data/conversations.data';
import {
  canSendFreeForm,
  sessionHoursLeftOf,
  sessionLabelOf,
} from '../data/conversations.data';
import type { WhatsappTemplate } from '../data/reference.data';
import {
  BULK_VALIDATION,
  audienceOf,
  baseGroups,
  classNarrowOptions,
  conditionOptions,
  deliveryEstimateOf,
  mediaLibrary,
  templateStateBadge,
  validationOf,
  variablesOf,
  whatsappTemplates,
} from '../data/reference.data';

export type WhatsappModalId =
  | 'new' | 'broadcast' | 'bulk' | 'schedule' | 'preview'
  | 'template' | 'import' | 'group' | 'media';

export interface NewMessagePayload {
  to: string;
  template: string;
  body: string;
  language: string;
}

export interface BroadcastPayload {
  title: string;
  template: string;
  audience: string;
  language: string;
  attachHeader: boolean;
}

export interface BulkPayload {
  dropDuplicates: boolean;
  skipInvalid: boolean;
  saveGroup: boolean;
}

export interface SchedulePayload {
  sendDate: string;
  sendTime: string;
  timeZone: string;
  fallbackTemplate: string;
  quietHours: boolean;
  cancelOnReply: boolean;
  notify: boolean;
}

export interface TemplatePayload {
  name: string;
  category: string;
  language: string;
  header: string;
  body: string;
  footer: string;
  button: string;
}

export interface ImportPayload {
  column: string;
  countryCode: string;
  hasHeader: boolean;
  recordOptIn: boolean;
}

export interface GroupPayload {
  name: string;
  description: string;
  dynamic: boolean;
  shared: boolean;
}

export interface WhatsappModalsProps {
  active: WhatsappModalId | null;
  conversation: Conversation | null;
  onClose: () => void;
  onSend: (payload: NewMessagePayload) => void;
  onBroadcast: (payload: BroadcastPayload) => void;
  onBulk: (payload: BulkPayload) => void;
  onSchedule: (payload: SchedulePayload) => void;
  onCreateTemplate: (payload: TemplatePayload) => void;
  onImport: (payload: ImportPayload) => void;
  onCreateGroup: (payload: GroupPayload) => void;
  onAttach: (name: string) => void;
  onOpen: (modal: WhatsappModalId) => void;
}

const Row = ({ label, note, value }: { label: string; note?: string; value: ReactNode }) => (
  <div className="d-flex align-items-center justify-content-between gap-3 mb-2">
    <span className="fs-13 text-muted">
      {label}
      {note ? <span className="d-block fs-12">{note}</span> : null}
    </span>
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

/** Approved templates only — Meta refuses anything else at the gateway. */
const usableTemplates = (): WhatsappTemplate[] =>
  whatsappTemplates.filter((entry) => entry.state === 'Approved');

const WhatsappModals = ({
  active, conversation, onClose, onSend, onBroadcast, onBulk, onSchedule, onCreateTemplate,
  onImport, onCreateGroup, onAttach, onOpen,
}: WhatsappModalsProps) => {
  const [to, setTo] = useState('');
  const [template, setTemplate] = useState('— None, session reply —');
  const [body, setBody] = useState('');
  const [language, setLanguage] = useState('English');

  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastTemplate, setBroadcastTemplate] = useState(usableTemplates()[0]?.name ?? '');
  const [baseGroup, setBaseGroup] = useState(baseGroups[0].label);
  const [narrowClass, setNarrowClass] = useState(classNarrowOptions[0]);
  const [condition, setCondition] = useState(conditionOptions[1]);
  const [attachHeader, setAttachHeader] = useState(true);

  const [dropDuplicates, setDropDuplicates] = useState(true);
  const [skipInvalid, setSkipInvalid] = useState(true);
  const [saveGroup, setSaveGroup] = useState(false);

  const [sendDate, setSendDate] = useState('05/08/2026');
  const [sendTime, setSendTime] = useState('07:30');
  const [timeZone, setTimeZone] = useState('IST (UTC +5:30)');
  const [fallbackTemplate, setFallbackTemplate] = useState('Fee Reminder');
  const [quietHours, setQuietHours] = useState(true);
  const [cancelOnReply, setCancelOnReply] = useState(true);
  const [notify, setNotify] = useState(true);

  const [templateName, setTemplateName] = useState('');
  const [templateCategory, setTemplateCategory] = useState('Utility');
  const [templateLanguage, setTemplateLanguage] = useState('English');
  const [templateHeader, setTemplateHeader] = useState('');
  const [templateBody, setTemplateBody] = useState('');
  const [templateFooter, setTemplateFooter] = useState('Preskool');
  const [templateButton, setTemplateButton] = useState('None');

  const [column, setColumn] = useState('Column A — whatsapp');
  const [countryCode, setCountryCode] = useState('+91 India');
  const [hasHeader, setHasHeader] = useState(true);
  const [recordOptIn, setRecordOptIn] = useState(true);

  const [groupName, setGroupName] = useState('');
  const [groupDescription, setGroupDescription] = useState('');
  const [groupDynamic, setGroupDynamic] = useState(true);
  const [groupShared, setGroupShared] = useState(false);

  const [selectedMedia, setSelectedMedia] = useState('');

  const sessionOpen = conversation ? canSendFreeForm(conversation) : false;

  useEffect(() => {
    if (active === 'new' && conversation) {
      setTo(`${conversation.name} · ${conversation.phone}`);
      setBody('');
      // A closed session cannot carry free text, so a template is preselected.
      setTemplate(canSendFreeForm(conversation) ? '— None, session reply —' : usableTemplates()[0]?.name ?? '');
    }
  }, [active, conversation]);

  const audience = audienceOf(baseGroup, narrowClass, condition);

  const validation = validationOf(
    BULK_VALIDATION.rows,
    dropDuplicates ? BULK_VALIDATION.duplicates : 0,
    skipInvalid ? BULK_VALIDATION.unregistered : 0,
  );

  /** The mapping the chosen template implies, in its own variable order. */
  const variableMapping = (() => {
    const found = whatsappTemplates.find((entry) => entry.name === broadcastTemplate);
    if (!found) return '';
    return found.fields
      .map((field, index) => `{{${index + 1}}} = ${field.replace(/[{}]/g, '')}`)
      .join('   ');
  })();

  return (
    <>
      {/* New message */}
      <Modal
        open={active === 'new'}
        onClose={onClose}
        title="New message"
        onSubmit={(event) => {
          event.preventDefault();
          onSend({ to, template, body, language });
        }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button
              type="button" className="btn btn-outline-light bg-white me-2"
              onClick={() => onOpen('schedule')}
            >
              Schedule…
            </button>
            <button type="submit" className="btn btn-primary">Send</button>
          </>
        }
      >
        <p className="fs-12 text-muted mb-3">
          Outside an open 24-hour session, only an approved template can start a conversation.
        </p>
        <div className="row g-3">
          <div className="col-12">
            <label className="form-label" htmlFor="wa-n-to">To</label>
            <input
              type="text" className="form-control" id="wa-n-to"
              placeholder="Search a contact or type a number"
              value={to} onChange={(event) => setTo(event.target.value)}
            />
          </div>
          <div className="col-md-8">
            <label className="form-label" htmlFor="wa-n-tpl">Template</label>
            <select
              className="form-select" id="wa-n-tpl"
              value={template} onChange={(event) => setTemplate(event.target.value)}
            >
              {/* A session reply is only on offer while the window is open. */}
              {sessionOpen ? <option>— None, session reply —</option> : null}
              {usableTemplates().map((entry) => <option key={entry.name}>{entry.name}</option>)}
            </select>
          </div>
          <div className="col-md-4">
            <label className="form-label" htmlFor="wa-n-lang">Language</label>
            <select
              className="form-select" id="wa-n-lang"
              value={language} onChange={(event) => setLanguage(event.target.value)}
            >
              {['English', 'Hindi', 'Tamil', 'Malayalam'].map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </div>
          <div className="col-12">
            <label className="form-label" htmlFor="wa-n-body">Message</label>
            <textarea
              className="form-control" id="wa-n-body" rows={4}
              placeholder={sessionOpen ? 'Write the message…' : 'The template body is sent as registered'}
              disabled={!sessionOpen}
              value={body} onChange={(event) => setBody(event.target.value)}
            />
          </div>
          <div className="col-12">
            <span className="fs-12 text-muted d-block mb-1">Insert a variable</span>
            <div className="d-flex flex-wrap gap-2">
              {['{{student_name}}', '{{parent_name}}', '{{class}}', '{{fee_amount}}'].map((token) => (
                <button
                  type="button" className="btn btn-sm btn-outline-light bg-white" key={token}
                  disabled={!sessionOpen}
                  onClick={() => setBody((current) => `${current}${token}`)}
                >
                  <i className="ti ti-plus me-1" />{token}
                </button>
              ))}
            </div>
          </div>
          <div className="col-12">
            <label className="form-label" htmlFor="wa-n-media">Attach media</label>
            <input type="file" className="form-control" id="wa-n-media" />
          </div>
          <div className="col-12">
            {/* The window, read off the conversation rather than assumed. */}
            <span className={`message-status-badge ${sessionOpen ? 'is-live' : 'is-urgent'}`}>
              <i className={sessionOpen ? 'ti ti-lock-open' : 'ti ti-lock'} />
              {conversation
                ? sessionOpen
                  ? `Session open — free-form reply allowed for ${sessionHoursLeftOf(conversation)}h`
                  : 'Session closed — an approved template is required'
                : 'No conversation selected'}
            </span>
          </div>
        </div>
      </Modal>

      {/* New broadcast */}
      <Modal
        open={active === 'broadcast'}
        onClose={onClose}
        title="New broadcast"
        dialogClassName="modal-lg"
        onSubmit={(event) => {
          event.preventDefault();
          onBroadcast({
            title: broadcastTitle, template: broadcastTemplate,
            audience: baseGroup, language, attachHeader,
          });
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
            <button type="submit" className="btn btn-primary">Send broadcast</button>
          </>
        }
      >
        <p className="fs-12 text-muted mb-3">
          Each recipient receives it as a private message, not a group thread.
        </p>
        <div className="row g-3 mb-3">
          <div className="col-md-7">
            <label className="form-label" htmlFor="wa-b-title">Broadcast title</label>
            <input
              type="text" className="form-control" id="wa-b-title"
              placeholder="Internal reference, not sent"
              value={broadcastTitle} onChange={(event) => setBroadcastTitle(event.target.value)}
            />
          </div>
          <div className="col-md-5">
            <label className="form-label" htmlFor="wa-b-tpl">
              Template <span className="text-danger">*</span>
            </label>
            <select
              className="form-select" id="wa-b-tpl"
              value={broadcastTemplate} onChange={(event) => setBroadcastTemplate(event.target.value)}
            >
              {/* Only approved templates may open a conversation. */}
              {usableTemplates().map((entry) => <option key={entry.name}>{entry.name}</option>)}
            </select>
          </div>
          <div className="col-md-4">
            <label className="form-label" htmlFor="wa-b-base">Base group</label>
            <select
              className="form-select" id="wa-b-base"
              value={baseGroup} onChange={(event) => setBaseGroup(event.target.value)}
            >
              {baseGroups.map((entry) => <option key={entry.label}>{entry.label}</option>)}
            </select>
          </div>
          <div className="col-md-4">
            <label className="form-label" htmlFor="wa-b-class">Narrow by class</label>
            <select
              className="form-select" id="wa-b-class"
              value={narrowClass} onChange={(event) => setNarrowClass(event.target.value)}
            >
              {classNarrowOptions.map((option) => <option key={option}>{option}</option>)}
            </select>
          </div>
          <div className="col-md-4">
            <label className="form-label" htmlFor="wa-b-cond">Narrow by condition</label>
            <select
              className="form-select" id="wa-b-cond"
              value={condition} onChange={(event) => setCondition(event.target.value)}
            >
              {conditionOptions.map((option) => <option key={option}>{option}</option>)}
            </select>
          </div>
          <div className="col-12">
            <label className="form-label" htmlFor="wa-b-vars">Variable mapping</label>
            <textarea
              className="form-control" id="wa-b-vars" rows={2}
              value={variableMapping} readOnly
            />
            <span className="fs-12 text-muted">
              Generated from {broadcastTemplate} — {variablesOf(
                whatsappTemplates.find((entry) => entry.name === broadcastTemplate)
                ?? whatsappTemplates[0],
              )} variables
            </span>
          </div>
        </div>

        <Switch
          id="wa-b-hdr" title="Attach the template header image"
          note="Reuses the stored media ID" value={attachHeader} onChange={setAttachHeader}
        />
        <div className="d-flex align-items-center justify-content-between border rounded p-2 mb-3">
          <div>
            <h6 className="fs-13 mb-0">Skip anyone who has opted out</h6>
            <span className="fs-12 text-muted">Required by policy, cannot be disabled</span>
          </div>
          <span className="message-status-badge is-live">Always on</span>
        </div>

        {/* The audience builder's own arithmetic. */}
        <div className="border rounded p-3">
          <Row label="Base group" value={audience.base.toLocaleString()} />
          <Row label="After narrowing" value={audience.narrowed.toLocaleString()} />
          <Row label="Opted out" note="Excluded by policy" value={`−${audience.optedOut}`} />
          <Row label="Estimated recipients" value={<b>{audience.result.toLocaleString()}</b>} />
        </div>
      </Modal>

      {/* Bulk upload */}
      <Modal
        open={active === 'bulk'}
        onClose={onClose}
        title="Bulk upload"
        onSubmit={(event) => {
          event.preventDefault();
          onBulk({ dropDuplicates, skipInvalid, saveGroup });
        }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button
              type="button" className="btn btn-outline-light bg-white me-2"
              onClick={() => onOpen('preview')}
            >
              Preview
            </button>
            <button type="submit" className="btn btn-primary">Validate</button>
          </>
        }
      >
        <p className="fs-12 text-muted mb-3">
          Numbers are checked against the WhatsApp network before anything is sent.
        </p>
        <div className="border rounded text-center p-4 mb-3">
          <span className="avatar avatar-lg bg-success-transparent text-success rounded-circle mb-2">
            <i className="ti ti-file-upload fs-20" />
          </span>
          <h6 className="fs-14 mb-1">Drop a recipient file here</h6>
          <p className="fs-12 text-muted mb-2">
            CSV or Excel, up to 5 MB. Column one holds the number with country code; further columns
            map to template variables.
          </p>
          <input type="file" className="form-control" aria-label="Recipient file" />
        </div>
        <Switch
          id="wa-bu-dup" title="Drop duplicate numbers" note="Keeps the first occurrence"
          value={dropDuplicates} onChange={setDropDuplicates}
        />
        <Switch
          id="wa-bu-inv" title="Skip numbers not on WhatsApp" note="Checked against the network"
          value={skipInvalid} onChange={setSkipInvalid}
        />
        <Switch
          id="wa-bu-save" title="Save as a recipient group" note="Reusable for later broadcasts"
          value={saveGroup} onChange={setSaveGroup}
        />
        <div className="border rounded p-3 mt-3">
          <Row label="Rows read" value={validation.rows.toLocaleString()} />
          <Row label="Duplicate numbers" value={validation.duplicates} />
          <Row label="Not on WhatsApp" value={validation.unregistered} />
          <Row label="Estimated recipients" value={<b>{validation.deliverable.toLocaleString()}</b>} />
          <Row
            label="Estimated delivery" note="At 80 messages a second"
            value={deliveryEstimateOf(validation.deliverable)}
          />
        </div>
      </Modal>

      {/* Schedule message */}
      <Modal
        open={active === 'schedule'}
        onClose={onClose}
        title="Schedule message"
        onSubmit={(event) => {
          event.preventDefault();
          onSchedule({
            sendDate, sendTime, timeZone, fallbackTemplate, quietHours, cancelOnReply, notify,
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
          If the session has closed by the send time, the scheduled message falls back to its
          template.
        </p>
        {conversation ? (
          <div className="border rounded p-2 mb-3">
            <h6 className="fs-13 mb-0">{conversation.name}</h6>
            <span className="fs-12 text-muted">{sessionLabelOf(conversation)}</span>
          </div>
        ) : null}
        <div className="row g-3 mb-3">
          <div className="col-md-6">
            <label className="form-label" htmlFor="wa-s-date">Send date</label>
            <input
              type="text" className="form-control" id="wa-s-date"
              value={sendDate} onChange={(event) => setSendDate(event.target.value)}
            />
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="wa-s-time">Send time</label>
            <input
              type="time" className="form-control" id="wa-s-time"
              value={sendTime} onChange={(event) => setSendTime(event.target.value)}
            />
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="wa-s-tz">Time zone</label>
            <select
              className="form-select" id="wa-s-tz"
              value={timeZone} onChange={(event) => setTimeZone(event.target.value)}
            >
              {['IST (UTC +5:30)', 'GST (UTC +4:00)', 'UTC'].map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="wa-s-fb">Fallback template</label>
            <select
              className="form-select" id="wa-s-fb"
              value={fallbackTemplate} onChange={(event) => setFallbackTemplate(event.target.value)}
            >
              {usableTemplates().map((entry) => <option key={entry.name}>{entry.name}</option>)}
              <option>None — do not send</option>
            </select>
          </div>
        </div>
        <Switch
          id="wa-s-qh" title="Respect quiet hours" note="Nothing leaves 9 pm to 7 am"
          value={quietHours} onChange={setQuietHours}
        />
        <Switch
          id="wa-s-cx" title="Cancel if the contact replies first"
          note="A reply reopens the session anyway"
          value={cancelOnReply} onChange={setCancelOnReply}
        />
        <Switch
          id="wa-s-nf" title="Notify me when it sends" note="A summary once the API confirms"
          value={notify} onChange={setNotify}
        />
      </Modal>

      {/* Preview broadcast */}
      <Modal
        open={active === 'preview'}
        onClose={onClose}
        title="Preview broadcast"
        dialogClassName="modal-lg"
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Close</button>
            <button type="button" className="btn btn-primary" onClick={() => onOpen('broadcast')}>
              Back to the broadcast
            </button>
          </>
        }
      >
        <p className="fs-12 text-muted mb-3">
          {broadcastTemplate} template, resolved against three real recipients.
        </p>
        {[
          { name: 'Rahul Menon', student: 'Aarav Menon', amount: '18,500' },
          { name: 'Sneha Iyer', student: 'Diya Iyer', amount: '16,200' },
          { name: 'Vikram Rao', student: 'Ishaan Rao', amount: '21,400' },
        ].map((who) => (
          <div className="border rounded p-3 mb-2" key={who.name}>
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="fs-12 fw-medium">Preskool</span>
              <span className="fs-12 text-muted">{who.name}</span>
            </div>
            {/* The registered wording with this recipient's values in it. */}
            <p className="fs-13 mb-2">
              Dear {who.name}, the term-2 fee of Rs. {who.amount} for {who.student} is due on
              {' '}10 Aug. Pay via the parent portal to avoid a late fee.
            </p>
            <span className="fs-12 text-muted">Delivers 07:30 am</span>
          </div>
        ))}
        <p className="fs-12 text-muted mb-0">
          {audience.result.toLocaleString()} recipients on the current audience.
        </p>
      </Modal>

      {/* Create template */}
      <Modal
        open={active === 'template'}
        onClose={onClose}
        title="Create template"
        dialogClassName="modal-lg"
        onSubmit={(event) => {
          event.preventDefault();
          onCreateTemplate({
            name: templateName, category: templateCategory, language: templateLanguage,
            header: templateHeader, body: templateBody, footer: templateFooter,
            button: templateButton,
          });
        }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Submit for review</button>
          </>
        }
      >
        <p className="fs-12 text-muted mb-3">
          Submitted to Meta for review. Approval usually takes a few minutes but can take a day.
        </p>
        <div className="row g-3 mb-3">
          <div className="col-md-5">
            <label className="form-label" htmlFor="wa-t-name">Template name</label>
            <input
              type="text" className="form-control" id="wa-t-name" placeholder="fee_reminder_term2"
              value={templateName} onChange={(event) => setTemplateName(event.target.value)}
            />
          </div>
          <div className="col-md-4">
            <label className="form-label" htmlFor="wa-t-cat">Category</label>
            <select
              className="form-select" id="wa-t-cat"
              value={templateCategory} onChange={(event) => setTemplateCategory(event.target.value)}
            >
              {['Utility', 'Marketing', 'Authentication'].map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </div>
          <div className="col-md-3">
            <label className="form-label" htmlFor="wa-t-lang">Language</label>
            <select
              className="form-select" id="wa-t-lang"
              value={templateLanguage} onChange={(event) => setTemplateLanguage(event.target.value)}
            >
              {['English', 'Hindi', 'Tamil', 'Malayalam'].map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </div>
          <div className="col-12">
            <label className="form-label" htmlFor="wa-t-hdr">
              Header <span className="text-muted fs-12">(optional)</span>
            </label>
            <input
              type="text" className="form-control" id="wa-t-hdr" placeholder="Text shown above the body"
              value={templateHeader} onChange={(event) => setTemplateHeader(event.target.value)}
            />
          </div>
          <div className="col-12">
            <label className="form-label" htmlFor="wa-t-body">Body</label>
            <textarea
              className="form-control" id="wa-t-body" rows={4}
              placeholder="Use {{1}}, {{2}} for variables. Meta rejects bodies that are purely promotional under the Utility category."
              value={templateBody} onChange={(event) => setTemplateBody(event.target.value)}
            />
            {/* Counted from the placeholders the body actually names. */}
            <span className="fs-12 text-muted">
              {(templateBody.match(/\{\{\d+\}\}/g) ?? []).length} variables
            </span>
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="wa-t-foot">
              Footer <span className="text-muted fs-12">(optional)</span>
            </label>
            <input
              type="text" className="form-control" id="wa-t-foot"
              value={templateFooter} onChange={(event) => setTemplateFooter(event.target.value)}
            />
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="wa-t-btn">Button</label>
            <select
              className="form-select" id="wa-t-btn"
              value={templateButton} onChange={(event) => setTemplateButton(event.target.value)}
            >
              {['None', 'Visit website', 'Call phone number', 'Quick reply'].map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </div>
          <div className="col-12">
            <label className="form-label" htmlFor="wa-t-media">Header media</label>
            <input type="file" className="form-control" id="wa-t-media" />
          </div>
        </div>
        <span className={templateStateBadge['In review']}>
          <i className="ti ti-hourglass" />Unusable until approved
        </span>
      </Modal>

      {/* Import contacts */}
      <Modal
        open={active === 'import'}
        onClose={onClose}
        title="Import contacts"
        onSubmit={(event) => {
          event.preventDefault();
          onImport({ column, countryCode, hasHeader, recordOptIn });
        }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Import contacts</button>
          </>
        }
      >
        <p className="fs-12 text-muted mb-3">Contacts only. Nothing is messaged from this step.</p>
        <div className="border rounded text-center p-4 mb-3">
          <span className="avatar avatar-lg bg-success-transparent text-success rounded-circle mb-2">
            <i className="ti ti-table-import fs-20" />
          </span>
          <h6 className="fs-14 mb-1">Choose a CSV or Excel file</h6>
          <p className="fs-12 text-muted mb-2">
            Download the template first if you are unsure of the column order — a mismatched header
            is the most common import failure.
          </p>
          <input type="file" className="form-control" aria-label="Contact file" />
        </div>
        <div className="row g-3 mb-3">
          <div className="col-md-6">
            <label className="form-label" htmlFor="wa-i-col">Number column</label>
            <select
              className="form-select" id="wa-i-col"
              value={column} onChange={(event) => setColumn(event.target.value)}
            >
              {['Column A — whatsapp', 'Column B', 'Column C'].map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="wa-i-cc">Country code</label>
            <select
              className="form-select" id="wa-i-cc"
              value={countryCode} onChange={(event) => setCountryCode(event.target.value)}
            >
              {['+91 India', '+971 UAE', '+44 UK'].map((option) => <option key={option}>{option}</option>)}
            </select>
            <span className="fs-12 text-muted">Prefixed where missing</span>
          </div>
        </div>
        <Switch
          id="wa-i-hdr" title="First row is a header" note="Skipped rather than messaged"
          value={hasHeader} onChange={setHasHeader}
        />
        <Switch
          id="wa-i-opt" title="Record opt-in consent" note="Required before any template send"
          value={recordOptIn} onChange={setRecordOptIn}
        />
      </Modal>

      {/* Create group */}
      <Modal
        open={active === 'group'}
        onClose={onClose}
        title="Create group"
        onSubmit={(event) => {
          event.preventDefault();
          onCreateGroup({
            name: groupName, description: groupDescription,
            dynamic: groupDynamic, shared: groupShared,
          });
        }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Create group</button>
          </>
        }
      >
        <p className="fs-12 text-muted mb-3">
          A recipient group for broadcasts — not a WhatsApp group chat. Members never see each
          other.
        </p>
        <div className="mb-3">
          <label className="form-label" htmlFor="wa-g-name">Group name</label>
          <input
            type="text" className="form-control" id="wa-g-name" placeholder="e.g. Parents with dues"
            value={groupName} onChange={(event) => setGroupName(event.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="wa-g-desc">Description</label>
          <textarea
            className="form-control" id="wa-g-desc" rows={2}
            placeholder="Who belongs in this group, and who does not."
            value={groupDescription} onChange={(event) => setGroupDescription(event.target.value)}
          />
        </div>
        <div className="border rounded p-2 mb-3">
          <Row label="Built from" value={`Audience builder · ${audience.result.toLocaleString()}`} />
        </div>
        <Switch
          id="wa-g-dyn" title="Dynamic group" note="Re-reads the filter at every broadcast"
          value={groupDynamic} onChange={setGroupDynamic}
        />
        <Switch
          id="wa-g-sh" title="Available to all staff" note="Otherwise only you can broadcast to it"
          value={groupShared} onChange={setGroupShared}
        />
      </Modal>

      {/* Attach media */}
      <Modal
        open={active === 'media'}
        onClose={onClose}
        title="Attach media"
        onSubmit={(event) => { event.preventDefault(); onAttach(selectedMedia); }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={!selectedMedia}>
              Attach selected
            </button>
          </>
        }
      >
        <p className="fs-12 text-muted mb-3">
          Pick from the library to reuse a stored media ID, or upload something new.
        </p>
        <div className="border rounded text-center p-4 mb-3">
          <span className="avatar avatar-lg bg-success-transparent text-success rounded-circle mb-2">
            <i className="ti ti-cloud-upload fs-20" />
          </span>
          <h6 className="fs-14 mb-1">Upload a new file</h6>
          <p className="fs-12 text-muted mb-2">
            Images up to 5 MB, documents up to 100 MB, video up to 16 MB. WhatsApp rejects anything
            larger.
          </p>
          <input type="file" className="form-control" aria-label="Media file" />
        </div>
        <h6 className="fs-13 mb-2">Or pick from the library</h6>
        {mediaLibrary.filter((item) => !item.locked).slice(0, 4).map((item) => (
          <button
            type="button"
            className={`d-flex align-items-center gap-2 border rounded p-2 mb-2 w-100 text-start bg-white${selectedMedia === item.name ? ' border-primary' : ''}`}
            key={item.name}
            onClick={() => setSelectedMedia(item.name)}
          >
            <span className="avatar avatar-sm rounded flex-shrink-0">
              {item.image
                ? <ImageWithBasePath src={item.image} alt={item.name} className="rounded" />
                : <i className={item.icon} />}
            </span>
            <div className="flex-fill overflow-hidden">
              <h6 className="fs-13 mb-0 text-truncate">{item.name}</h6>
              <span className="fs-12 text-muted text-truncate d-block">{item.kind} · {item.meta}</span>
            </div>
            {selectedMedia === item.name ? <i className="ti ti-circle-check text-primary" /> : null}
          </button>
        ))}
      </Modal>
    </>
  );
};

export default WhatsappModals;
