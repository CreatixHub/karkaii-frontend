import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import Modal from '@components/ui/Modal';
import type { Encoding, PreviewRecipient } from '../data/sms.data';
import {
  BULK_VALIDATION,
  CREDITS_AVAILABLE,
  MESSAGES_PER_MINUTE,
  RATE_PER_SEGMENT,
  SENT,
  costOf,
  countryCodeOptions,
  encodingOptions,
  expandedLengthOf,
  expiryOptions,
  failureReasons,
  mergeFields,
  minutesToSend,
  money,
  numberColumnOptions,
  previewRecipients,
  recurrenceOptions,
  renderFor,
  segmentsOf,
  senderOptions,
  sentRecipients,
  smsTemplates,
  successRateOf,
  templateCategoryOptions,
  timeZoneOptions,
  validationOf,
} from '../data/sms.data';

export type SmsModalId =
  | 'compose' | 'bulk' | 'schedule' | 'template' | 'preview'
  | 'import' | 'group' | 'confirm' | 'duplicate' | 'report';

export interface ComposeState {
  title: string;
  body: string;
  encoding: Encoding;
  senderId: string;
  recipients: number;
}

export interface SchedulePayload {
  sendDate: string;
  sendTime: string;
  timeZone: string;
  recurrence: string;
  quietHours: boolean;
  expiry: string;
  notify: boolean;
}

export interface TemplatePayload {
  name: string;
  category: string;
  body: string;
  senderId: string;
  routeType: string;
  shared: boolean;
}

export interface GroupPayload {
  name: string;
  description: string;
  dynamic: boolean;
  shared: boolean;
}

export interface BulkPayload {
  dropDuplicates: boolean;
  skipInvalid: boolean;
  honourDnd: boolean;
  saveGroup: boolean;
}

export interface ImportPayload {
  column: string;
  countryCode: string;
  hasHeader: boolean;
  mapFields: boolean;
}

export interface DuplicatePayload {
  title: string;
  copyRecipients: boolean;
  copyMergeFields: boolean;
  copyConfiguration: boolean;
  failedOnly: boolean;
}

export interface SmsModalsProps {
  active: SmsModalId | null;
  compose: ComposeState;
  onClose: () => void;
  onComposeSave: (title: string, body: string, encoding: Encoding, senderId: string) => void;
  onSchedule: (payload: SchedulePayload) => void;
  onSaveTemplate: (payload: TemplatePayload) => void;
  onCreateGroup: (payload: GroupPayload) => void;
  onValidateBulk: (payload: BulkPayload) => void;
  onImport: (payload: ImportPayload) => void;
  onSend: () => void;
  onDuplicate: (payload: DuplicatePayload) => void;
  onOpen: (modal: SmsModalId) => void;
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
  id, title, note, value, onChange,
}: {
  id: string; title: string; note: string; value: boolean; onChange: (next: boolean) => void;
}) => (
  <div className="d-flex align-items-center justify-content-between border rounded p-2 mb-2">
    <div>
      <h6 className="fs-13 mb-0">{title}</h6>
      <span className="fs-12 text-muted">{note}</span>
    </div>
    <div className="form-check form-switch mb-0">
      <input
        className="form-check-input" type="checkbox" role="switch" id={id}
        checked={value} onChange={(event) => onChange(event.target.checked)}
      />
      <label className="form-check-label visually-hidden" htmlFor={id}>{title}</label>
    </div>
  </div>
);

/** One preview card: the body resolved for a recipient, counted as sent. */
const PreviewCard = ({
  who, body, encoding, senderId,
}: { who: PreviewRecipient; body: string; encoding: Encoding; senderId: string }) => {
  const text = renderFor(body, who);
  return (
    <div className="border rounded p-3 mb-2">
      <div className="d-flex align-items-center justify-content-between mb-2">
        <span className="fs-12 fw-medium">{senderId}</span>
        <span className="fs-12 text-muted">{who.name}</span>
      </div>
      <p className="fs-13 mb-2">{text}</p>
      <span className="fs-12 text-muted">
        {text.length} chars · {segmentsOf(text.length, encoding)} segments
      </span>
    </div>
  );
};

const SmsModals = ({
  active, compose, onClose, onComposeSave, onSchedule, onSaveTemplate, onCreateGroup,
  onValidateBulk, onImport, onSend, onDuplicate, onOpen,
}: SmsModalsProps) => {
  const [title, setTitle] = useState(compose.title);
  const [body, setBody] = useState(compose.body);
  const [encoding, setEncoding] = useState<Encoding>(compose.encoding);
  const [senderId, setSenderId] = useState(compose.senderId);
  const [templateChoice, setTemplateChoice] = useState('— None —');
  const [audience, setAudience] = useState('Parents');

  const [sendDate, setSendDate] = useState('05/08/2026');
  const [sendTime, setSendTime] = useState('07:30');
  const [timeZone, setTimeZone] = useState(timeZoneOptions[0]);
  const [recurrence, setRecurrence] = useState(recurrenceOptions[0]);
  const [quietHours, setQuietHours] = useState(true);
  const [expiry, setExpiry] = useState(expiryOptions[1]);
  const [notify, setNotify] = useState(true);

  const [templateName, setTemplateName] = useState('Fee Reminder');
  const [templateCategory, setTemplateCategory] = useState(templateCategoryOptions[0]);
  const [templateBody, setTemplateBody] = useState('');
  const [routeType, setRouteType] = useState('Transactional');
  const [templateShared, setTemplateShared] = useState(true);

  const [groupName, setGroupName] = useState('');
  const [groupDescription, setGroupDescription] = useState('');
  const [groupDynamic, setGroupDynamic] = useState(true);
  const [groupShared, setGroupShared] = useState(false);

  const [dropDuplicates, setDropDuplicates] = useState(true);
  const [skipInvalid, setSkipInvalid] = useState(true);
  const [honourDnd, setHonourDnd] = useState(true);
  const [saveGroup, setSaveGroup] = useState(false);

  const [column, setColumn] = useState(numberColumnOptions[0]);
  const [countryCode, setCountryCode] = useState(countryCodeOptions[0]);
  const [hasHeader, setHasHeader] = useState(true);
  const [mapFields, setMapFields] = useState(true);

  const [copyTitle, setCopyTitle] = useState('');
  const [copyRecipients, setCopyRecipients] = useState(true);
  const [copyMergeFields, setCopyMergeFields] = useState(true);
  const [copyConfiguration, setCopyConfiguration] = useState(true);
  const [failedOnly, setFailedOnly] = useState(false);

  useEffect(() => {
    if (active === 'compose') {
      setTitle(compose.title);
      setBody(compose.body);
      setEncoding(compose.encoding);
      setSenderId(compose.senderId);
    }
    if (active === 'template') setTemplateBody(compose.body);
    if (active === 'duplicate') setCopyTitle(`${compose.title} (copy)`);
  }, [active, compose]);

  /* The composer's own arithmetic, shared by every dialog that quotes it. */
  const length = expandedLengthOf(body);
  const segments = segmentsOf(length, encoding);
  const liveSegments = segmentsOf(expandedLengthOf(compose.body), compose.encoding);
  const totalSegments = compose.recipients * liveSegments;
  const cost = costOf(compose.recipients, liveSegments);
  const creditsAfter = CREDITS_AVAILABLE - totalSegments;

  /** The bulk figures follow the exclusion switches. */
  const validation = validationOf(
    BULK_VALIDATION.rows,
    dropDuplicates ? BULK_VALIDATION.duplicates : 0,
    skipInvalid ? BULK_VALIDATION.invalid : 0,
    honourDnd ? BULK_VALIDATION.dnd : 0,
  );

  return (
    <>
      {/* Compose SMS */}
      <Modal
        open={active === 'compose'}
        onClose={onClose}
        title="Compose SMS"
        onSubmit={(event) => {
          event.preventDefault();
          onComposeSave(title, body, encoding, senderId);
        }}
        footer={
          <>
            <button
              type="button" className="btn btn-light me-2"
              onClick={() => onComposeSave(title, body, encoding, senderId)}
            >
              Save draft
            </button>
            <button type="submit" className="btn btn-primary">Continue</button>
          </>
        }
      >
        <p className="fs-12 text-muted mb-3">160 characters to a segment on GSM-7, 70 on Unicode.</p>
        <div className="row g-3">
          <div className="col-md-7">
            <label className="form-label" htmlFor="sms-m-title">SMS title</label>
            <input
              type="text" className="form-control" id="sms-m-title"
              placeholder="Internal reference, not sent"
              value={title} onChange={(event) => setTitle(event.target.value)}
            />
          </div>
          <div className="col-md-5">
            <label className="form-label" htmlFor="sms-m-tpl">Template</label>
            <select
              className="form-select" id="sms-m-tpl"
              value={templateChoice}
              onChange={(event) => {
                setTemplateChoice(event.target.value);
                const found = smsTemplates.find((entry) => entry.name === event.target.value);
                if (found) setBody(found.preview);
              }}
            >
              <option>— None —</option>
              {smsTemplates.map((entry) => <option key={entry.name}>{entry.name}</option>)}
            </select>
          </div>
          <div className="col-12">
            <label className="form-label" htmlFor="sms-m-body">Message</label>
            <textarea
              className="form-control" id="sms-m-body" rows={4}
              placeholder="Type the message. Use merge fields for anything that differs per recipient."
              value={body} onChange={(event) => setBody(event.target.value)}
            />
          </div>
          <div className="col-12">
            <span className="fs-12 text-muted d-block mb-1">Insert a merge field</span>
            <div className="d-flex flex-wrap gap-2">
              {mergeFields.slice(0, 6).map((field) => (
                <button
                  type="button" className="btn btn-sm btn-outline-light bg-white" key={field.token}
                  onClick={() => setBody((current) => `${current}${field.token}`)}
                >
                  <i className="ti ti-plus me-1" />{field.token}
                </button>
              ))}
            </div>
          </div>
          <div className="col-md-4">
            <label className="form-label" htmlFor="sms-m-aud">Audience</label>
            <select
              className="form-select" id="sms-m-aud"
              value={audience} onChange={(event) => setAudience(event.target.value)}
            >
              {['Parents', 'All Students', 'Teachers', 'Staff', 'Custom group'].map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </div>
          <div className="col-md-4">
            <label className="form-label" htmlFor="sms-m-sender">Sender ID</label>
            <select
              className="form-select" id="sms-m-sender"
              value={senderId} onChange={(event) => setSenderId(event.target.value)}
            >
              {senderOptions.map((option) => <option key={option}>{option}</option>)}
            </select>
          </div>
          <div className="col-md-4">
            <label className="form-label" htmlFor="sms-m-enc">Encoding</label>
            <select
              className="form-select" id="sms-m-enc"
              value={encoding} onChange={(event) => setEncoding(event.target.value as Encoding)}
            >
              {encodingOptions.map((option) => <option key={option.id}>{option.id}</option>)}
            </select>
          </div>
          <div className="col-12">
            {/* Counted at the longest merge expansion, as the composer does. */}
            <span className="fs-12 text-muted">{length} characters · {segments} segments</span>
          </div>
        </div>
      </Modal>

      {/* Bulk SMS upload */}
      <Modal
        open={active === 'bulk'}
        onClose={onClose}
        title="Bulk SMS upload"
        onSubmit={(event) => {
          event.preventDefault();
          onValidateBulk({ dropDuplicates, skipInvalid, honourDnd, saveGroup });
        }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button
              type="button" className="btn btn-outline-light bg-white me-2"
              onClick={() => onOpen('preview')}
            >
              Preview bulk SMS
            </button>
            <button type="submit" className="btn btn-primary">Validate recipients</button>
          </>
        }
      >
        <p className="fs-12 text-muted mb-3">
          The file is validated before anything is billed. Nothing is sent from this step.
        </p>
        <div className="border rounded text-center p-4 mb-3">
          <span className="avatar avatar-lg bg-primary-transparent text-primary rounded-circle mb-2">
            <i className="ti ti-file-upload fs-20" />
          </span>
          <h6 className="fs-14 mb-1">Drop a recipient file here</h6>
          <p className="fs-12 text-muted mb-2">
            CSV or Excel, up to 5 MB and 20,000 rows. Column one must hold the mobile number; any
            further columns become merge fields.
          </p>
          <input type="file" className="form-control" aria-label="Recipient file" />
        </div>

        <Switch
          id="sms-b-dup" title="Drop duplicate numbers" note="Keeps the first occurrence"
          value={dropDuplicates} onChange={setDropDuplicates}
        />
        <Switch
          id="sms-b-inv" title="Skip invalid numbers" note="Wrong length or non-numeric"
          value={skipInvalid} onChange={setSkipInvalid}
        />
        <Switch
          id="sms-b-dnd" title="Honour the DND registry" note="Required on the promotional route"
          value={honourDnd} onChange={setHonourDnd}
        />
        <Switch
          id="sms-b-save" title="Save as a recipient group" note="Reusable for later sends"
          value={saveGroup} onChange={setSaveGroup}
        />

        {/* Every exclusion comes off the rows read. */}
        <div className="border rounded p-3 mt-3">
          <Row label="Rows read" value={validation.rows.toLocaleString()} />
          <Row label="Duplicate numbers" value={validation.duplicates.toLocaleString()} />
          <Row label="Invalid numbers" value={validation.invalid.toLocaleString()} />
          <Row label="DND registered" value={validation.dnd.toLocaleString()} />
          <Row
            label="Deliverable" note="After every exclusion"
            value={<b>{validation.deliverable.toLocaleString()}</b>}
          />
          <Row
            label="Estimated cost" note={`Demo rate ${money(RATE_PER_SEGMENT)} per segment`}
            value={money(costOf(validation.deliverable, liveSegments))}
          />
        </div>
      </Modal>

      {/* Schedule SMS */}
      <Modal
        open={active === 'schedule'}
        onClose={onClose}
        title="Schedule SMS"
        onSubmit={(event) => {
          event.preventDefault();
          onSchedule({ sendDate, sendTime, timeZone, recurrence, quietHours, expiry, notify });
        }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Schedule SMS</button>
          </>
        }
      >
        <p className="fs-12 text-muted mb-3">
          Credits are reserved at scheduling and released if the send is cancelled.
        </p>
        <div className="row g-3 mb-3">
          <div className="col-md-6">
            <label className="form-label" htmlFor="sms-s-date">Send date</label>
            <input
              type="text" className="form-control" id="sms-s-date"
              value={sendDate} onChange={(event) => setSendDate(event.target.value)}
            />
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="sms-s-time">Send time</label>
            <input
              type="time" className="form-control" id="sms-s-time"
              value={sendTime} onChange={(event) => setSendTime(event.target.value)}
            />
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="sms-s-tz">Time zone</label>
            <select
              className="form-select" id="sms-s-tz"
              value={timeZone} onChange={(event) => setTimeZone(event.target.value)}
            >
              {timeZoneOptions.map((option) => <option key={option}>{option}</option>)}
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="sms-s-rep">Recurrence</label>
            <select
              className="form-select" id="sms-s-rep"
              value={recurrence} onChange={(event) => setRecurrence(event.target.value)}
            >
              {recurrenceOptions.map((option) => <option key={option}>{option}</option>)}
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="sms-s-exp">Message expiry</label>
            <select
              className="form-select" id="sms-s-exp"
              value={expiry} onChange={(event) => setExpiry(event.target.value)}
            >
              {expiryOptions.map((option) => <option key={option}>{option}</option>)}
            </select>
            <span className="fs-12 text-muted">Dropped rather than delivered late</span>
          </div>
        </div>
        <Switch
          id="sms-s-qh" title="Respect quiet hours" note="Nothing leaves 9 pm to 7 am"
          value={quietHours} onChange={setQuietHours}
        />
        <Switch
          id="sms-s-nf" title="Notify me when it completes" note="A summary once the gateway finishes"
          value={notify} onChange={setNotify}
        />
        <p className="fs-13 text-muted mb-0 mt-2">
          {compose.recipients.toLocaleString()} recipients · {totalSegments.toLocaleString()} segments
        </p>
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
            senderId, routeType, shared: templateShared,
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
          A new template is submitted to the operator for registration and is unusable until
          approved.
        </p>
        <div className="row g-3 mb-3">
          <div className="col-md-6">
            <label className="form-label" htmlFor="sms-t-name">Template name</label>
            <input
              type="text" className="form-control" id="sms-t-name"
              value={templateName} onChange={(event) => setTemplateName(event.target.value)}
            />
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="sms-t-cat">Category</label>
            <select
              className="form-select" id="sms-t-cat"
              value={templateCategory} onChange={(event) => setTemplateCategory(event.target.value)}
            >
              {templateCategoryOptions.map((option) => <option key={option}>{option}</option>)}
            </select>
          </div>
          <div className="col-12">
            <label className="form-label" htmlFor="sms-t-body">Template body</label>
            <textarea
              className="form-control" id="sms-t-body" rows={4}
              value={templateBody} onChange={(event) => setTemplateBody(event.target.value)}
            />
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="sms-t-sender">Sender ID</label>
            <select
              className="form-select" id="sms-t-sender"
              value={senderId} onChange={(event) => setSenderId(event.target.value)}
            >
              {senderOptions.map((option) => <option key={option}>{option}</option>)}
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="sms-t-type">Route type</label>
            <select
              className="form-select" id="sms-t-type"
              value={routeType} onChange={(event) => setRouteType(event.target.value)}
            >
              <option>Transactional</option>
              <option>Promotional</option>
            </select>
          </div>
        </div>
        <Switch
          id="sms-t-sh" title="Available to all staff" note="Otherwise administrators only"
          value={templateShared} onChange={setTemplateShared}
        />
        {/* The template's own length, counted the way the gateway counts it. */}
        <p className="fs-13 text-muted mb-0 mt-2">
          {expandedLengthOf(templateBody)} characters ·{' '}
          {segmentsOf(expandedLengthOf(templateBody), encoding)} segments
        </p>
      </Modal>

      {/* Preview SMS */}
      <Modal
        open={active === 'preview'}
        onClose={onClose}
        title="Preview SMS"
        dialogClassName="modal-lg"
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Close</button>
            <button type="button" className="btn btn-primary" onClick={() => onOpen('confirm')}>
              <i className="ti ti-send me-1" />Send
            </button>
          </>
        }
      >
        <p className="fs-12 text-muted mb-3">Merge fields resolved against three real recipients.</p>
        {previewRecipients.map((who) => (
          <PreviewCard
            key={who.name} who={who} body={compose.body}
            encoding={compose.encoding} senderId={compose.senderId}
          />
        ))}
      </Modal>

      {/* Import recipients */}
      <Modal
        open={active === 'import'}
        onClose={onClose}
        title="Import recipients"
        onSubmit={(event) => {
          event.preventDefault();
          onImport({ column, countryCode, hasHeader, mapFields });
        }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Import contacts</button>
          </>
        }
      >
        <p className="fs-12 text-muted mb-3">
          Contacts only. No message is composed or sent from this step.
        </p>
        <div className="border rounded text-center p-4 mb-3">
          <span className="avatar avatar-lg bg-primary-transparent text-primary rounded-circle mb-2">
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
            <label className="form-label" htmlFor="sms-i-col">Number column</label>
            <select
              className="form-select" id="sms-i-col"
              value={column} onChange={(event) => setColumn(event.target.value)}
            >
              {numberColumnOptions.map((option) => <option key={option}>{option}</option>)}
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="sms-i-cc">Country code</label>
            <select
              className="form-select" id="sms-i-cc"
              value={countryCode} onChange={(event) => setCountryCode(event.target.value)}
            >
              {countryCodeOptions.map((option) => <option key={option}>{option}</option>)}
            </select>
            <span className="fs-12 text-muted">Prefixed where missing</span>
          </div>
        </div>
        <Switch
          id="sms-i-hdr" title="First row is a header" note="Skipped rather than dialled"
          value={hasHeader} onChange={setHasHeader}
        />
        <Switch
          id="sms-i-map" title="Map remaining columns as merge fields"
          note="Available as {{custom_1}} onwards"
          value={mapFields} onChange={setMapFields}
        />
      </Modal>

      {/* Create recipient group */}
      <Modal
        open={active === 'group'}
        onClose={onClose}
        title="Create recipient group"
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
          A dynamic group re-reads its filter at every send; a fixed one keeps today's members.
        </p>
        <div className="mb-3">
          <label className="form-label" htmlFor="sms-g-name">Group name</label>
          <input
            type="text" className="form-control" id="sms-g-name" placeholder="e.g. Parents with dues"
            value={groupName} onChange={(event) => setGroupName(event.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="sms-g-desc">Description</label>
          <textarea
            className="form-control" id="sms-g-desc" rows={2}
            placeholder="Who belongs in this group, and who does not."
            value={groupDescription} onChange={(event) => setGroupDescription(event.target.value)}
          />
        </div>
        <div className="border rounded p-2 mb-3">
          {/* Built from what the toolbar has selected right now. */}
          <Row
            label="Built from"
            value={`Current filters · ${compose.recipients.toLocaleString()}`}
          />
        </div>
        <Switch
          id="sms-g-dyn" title="Dynamic group" note="Re-reads the filter at every send"
          value={groupDynamic} onChange={setGroupDynamic}
        />
        <Switch
          id="sms-g-sh" title="Available to all staff" note="Otherwise only you can send to it"
          value={groupShared} onChange={setGroupShared}
        />
      </Modal>

      {/* Send confirmation */}
      <Modal
        open={active === 'confirm'}
        onClose={onClose}
        title="Send confirmation"
        onSubmit={(event) => { event.preventDefault(); onSend(); }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button
              type="button" className="btn btn-outline-light bg-white me-2"
              onClick={() => onOpen('preview')}
            >
              Preview first
            </button>
            <button type="submit" className="btn btn-primary">
              Send to {compose.recipients.toLocaleString()} recipients
            </button>
          </>
        }
      >
        <p className="fs-12 text-muted mb-3">
          SMS cannot be recalled once it leaves the gateway. Check the recipient count before
          confirming.
        </p>
        <div className="border rounded p-3">
          <Row label="Message" value={compose.title} />
          <Row
            label="Recipients" note="After duplicates and DND exclusions"
            value={compose.recipients.toLocaleString()}
          />
          <Row label="Segments each" value={`${liveSegments} · ${compose.encoding}`} />
          <Row label="Total segments" value={totalSegments.toLocaleString()} />
          <Row
            label="Estimated cost" note={`Demo rate ${money(RATE_PER_SEGMENT)} per segment`}
            value={money(cost)}
          />
          <Row
            label="Credits after send"
            value={`${creditsAfter.toLocaleString()} of ${CREDITS_AVAILABLE.toLocaleString()}`}
          />
          <Row label="Route" value={`Transactional · ${compose.senderId}`} />
        </div>
      </Modal>

      {/* Duplicate SMS */}
      <Modal
        open={active === 'duplicate'}
        onClose={onClose}
        title="Duplicate SMS"
        onSubmit={(event) => {
          event.preventDefault();
          onDuplicate({
            title: copyTitle, copyRecipients, copyMergeFields, copyConfiguration, failedOnly,
          });
        }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Duplicate</button>
          </>
        }
      >
        <p className="fs-12 text-muted mb-3">
          The copy opens in the composer as a draft. Delivery history is not carried over.
        </p>
        <div className="mb-3">
          <label className="form-label" htmlFor="sms-d-title">New title</label>
          <input
            type="text" className="form-control" id="sms-d-title"
            value={copyTitle} onChange={(event) => setCopyTitle(event.target.value)}
          />
        </div>
        <Switch
          id="sms-d-r" title="Copy recipients"
          note={`${compose.recipients.toLocaleString()} on the current selection`}
          value={copyRecipients} onChange={setCopyRecipients}
        />
        <Switch
          id="sms-d-m" title="Copy merge fields" note="The tokens used in the message"
          value={copyMergeFields} onChange={setCopyMergeFields}
        />
        <Switch
          id="sms-d-c" title="Copy delivery configuration" note="Route, gateway, retries and expiry"
          value={copyConfiguration} onChange={setCopyConfiguration}
        />
        <Switch
          id="sms-d-f" title="Send only to failed numbers"
          note={`${SENT.failedCount} from the original send`}
          value={failedOnly} onChange={setFailedOnly}
        />
      </Modal>

      {/* Delivery report */}
      <Modal
        open={active === 'report'}
        onClose={onClose}
        title="Delivery report"
        dialogClassName="modal-lg"
        footer={
          <button type="button" className="btn btn-light" onClick={onClose}>Close</button>
        }
      >
        <p className="fs-12 text-muted mb-3">
          {SENT.title} · {SENT.sentAt} · {SENT.gateway}
        </p>
        <div className="row g-3 mb-3">
          {[
            { label: 'Submitted', value: SENT.submitted.toLocaleString(), tint: 'primary' },
            { label: 'Delivered', value: SENT.delivered.toLocaleString(), tint: 'success' },
            { label: 'Failed', value: SENT.failedCount.toLocaleString(), tint: 'danger' },
            {
              label: 'Success',
              value: `${successRateOf(SENT.delivered, SENT.submitted)}%`,
              tint: 'info',
            },
          ].map((tile) => (
            <div className="col-md-3" key={tile.label}>
              <div className="border rounded p-3 text-center">
                <h4 className={`fs-20 mb-0 text-${tile.tint}`}>{tile.value}</h4>
                <span className="fs-12 text-muted">{tile.label}</span>
              </div>
            </div>
          ))}
        </div>

        <h6 className="fs-13 mb-2">
          Why the {SENT.failedCount} failed
        </h6>
        <div className="border rounded p-3 mb-3">
          {failureReasons.map((reason) => (
            <Row key={reason.label} label={reason.label} note={reason.note} value={reason.count} />
          ))}
        </div>

        <h6 className="fs-13 mb-2">The numbers that did not answer</h6>
        {sentRecipients.filter((who) => who.state === 'Failed').map((who) => (
          <div className="d-flex align-items-center gap-2 border rounded p-2 mb-2" key={who.name}>
            <span className="avatar avatar-sm bg-danger-transparent text-danger rounded flex-shrink-0">
              <i className="ti ti-phone" />
            </span>
            <div className="flex-fill overflow-hidden">
              <h6 className="fs-13 mb-0 text-truncate">{who.name}</h6>
              <span className="fs-12 text-muted text-truncate d-block">
                {who.mobile} · {who.note}
              </span>
            </div>
          </div>
        ))}
        <p className="fs-12 text-muted mb-0">
          At {MESSAGES_PER_MINUTE} messages a minute, a resend to these numbers takes{' '}
          {minutesToSend(SENT.failedCount)} minute.
        </p>
      </Modal>
    </>
  );
};

export default SmsModals;
