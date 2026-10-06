import { useEffect, useState } from 'react';
import { Fragment } from 'react';
import Modal from '@components/ui/Modal';
import Offcanvas from '@components/ui/Offcanvas';
import DateField from '@components/ui/DateField';
import { ActionLink } from '@components/workspace';
import type { Job } from '../data/generation.data';
import {
  ACADEMIC_YEAR,
  academicYearOptions,
  atCounterOf,
  auditOf,
  certificateTypeOptions,
  COLLECTION_POINTS,
  generationStatusOf,
  issueNoteOf,
  issueStatusOf,
  jobOptions,
  PAPER_STOCKS,
  passingOf,
  previewLineOf,
  printNoteOf,
  printStatusOf,
  recipientsLabelOf,
  recipientTypeOptions,
  remainingLabelOf,
  remainingOf,
  RUN_DATE,
  RUN_OPERATORS,
  shareOf,
  SIGNATORIES,
  templateOptions,
  TEMPLATES,
  TYPE_META,
  verificationCodeOf,
  workflowOf,
} from '../data/generation.data';

export type GenerationModalId =
  | 'generate'
  | 'bulk'
  | 'preview'
  | 'template'
  | 'print'
  | 'issue'
  | 'view';

export interface GenerationModalsProps {
  active: GenerationModalId | null;
  onClose: () => void;
  row: Job | null;
  panelOpen: boolean;
  onClosePanel: () => void;
  onToast: (message: string, variant?: 'success' | 'danger' | 'info' | 'warning') => void;
}

/* ----------------------------- Small helpers ----------------------------- */

const Field = ({
  label,
  children,
  span = 'col-md-6',
}: {
  label: string;
  children: React.ReactNode;
  span?: string;
}) => (
  <div className={span}>
    <label className="form-label">{label}</label>
    {children}
  </div>
);

const Select = ({
  options,
  value,
  onChange,
}: {
  options: string[];
  value: string;
  onChange: (value: string) => void;
}) => (
  <select className="form-select" value={value} onChange={(event) => onChange(event.target.value)}>
    {options.map((option) => (
      <option key={option}>{option}</option>
    ))}
  </select>
);

const Row = ({
  label,
  value,
  last = false,
}: {
  label: string;
  value: React.ReactNode;
  last?: boolean;
}) => (
  <div className={`d-flex align-items-center justify-content-between ${last ? 'mb-0' : 'mb-2'}`}>
    <span className="fs-13 text-muted">{label}</span>
    <span className="fs-13 fw-medium text-end">{value}</span>
  </div>
);

const Highlight = ({ label, value, tint }: { label: string; value: string; tint: string }) => (
  <div className="d-flex align-items-center justify-content-between pt-2 mt-2 border-top">
    <span className="fs-13 fw-medium">{label}</span>
    <span className={`fs-13 fw-semibold text-${tint}`}>{value}</span>
  </div>
);

const Tile = ({ title, note, icon, tint }: { title: string; note: string; icon: string; tint: string }) => (
  <div className="d-flex align-items-center gap-2 border rounded p-2 mb-2">
    <span className={`avatar avatar-sm bg-${tint}-transparent text-${tint} rounded flex-shrink-0`}>
      <i className={icon} />
    </span>
    <div className="flex-fill overflow-hidden">
      <h6 className="fs-13 mb-0 text-truncate">{title}</h6>
      <span className="fs-12 text-muted text-truncate d-block">{note}</span>
    </div>
  </div>
);

/** The bordered job card each dialog opens on. */
const JobCard = ({
  row,
  statusLabel,
  statusBadge,
  status,
  children,
}: {
  row: Job;
  statusLabel: string;
  statusBadge: string;
  status: string;
  children?: React.ReactNode;
}) => {
  const meta = TYPE_META[row.certificateType];
  return (
    <div className="border rounded p-3 mb-3">
      <div className="d-flex align-items-center mb-3">
        <span className={`avatar avatar-md bg-${meta.tint}-transparent text-${meta.tint} rounded flex-shrink-0`}>
          <i className={meta.icon} />
        </span>
        <div className="ms-2">
          <h5 className="fs-14 mb-0">{row.recipient}</h5>
          <span className="fs-12 text-muted">
            {row.ref} · {recipientsLabelOf(row)}
          </span>
        </div>
        <div className="ms-auto text-end">
          <span className="fs-12 text-muted d-block">{statusLabel}</span>
          <span className={`badge badge-soft-${statusBadge}`}>{status}</span>
        </div>
      </div>
      {children}
    </div>
  );
};

const Footer = ({ icon, label, onClose }: { icon: string; label: string; onClose: () => void }) => (
  <>
    <ActionLink className="btn btn-light me-2" onClick={onClose}>
      Cancel
    </ActionLink>
    <button type="submit" className="btn btn-primary d-inline-flex align-items-center">
      <i className={`${icon} me-1`} />
      {label}
    </button>
  </>
);

const useForm = <T extends Record<string, string>>(defaults: T, open: boolean) => {
  const [values, setValues] = useState<T>(defaults);
  const initial = JSON.stringify(defaults);

  useEffect(() => {
    if (open) setValues(JSON.parse(initial) as T);
  }, [open, initial]);

  const set = (key: keyof T) => (value: string) =>
    setValues((current) => ({ ...current, [key]: value }));

  return [values, set] as const;
};

const Segment = ({
  name,
  label,
  options,
  value,
  onChange,
}: {
  name: string;
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
}) => (
  <div className="custom-btn-group custom-btn-group-fill mb-3" role="group" aria-label={label}>
    {options.map((option) => (
      <Fragment key={option}>
        <input
          type="radio"
          className="btn-check"
          name={name}
          id={`${name}-${option.replace(/\s+/g, '-').toLowerCase()}`}
          checked={value === option}
          onChange={() => onChange(option)}
        />
        <label className="btn" htmlFor={`${name}-${option.replace(/\s+/g, '-').toLowerCase()}`}>
          {option}
        </label>
      </Fragment>
    ))}
  </div>
);

const Check = ({
  id,
  label,
  checked,
  onChange,
  last = false,
}: {
  id: string;
  label: string;
  checked: boolean;
  onChange: () => void;
  last?: boolean;
}) => (
  <div className={`form-check ${last ? 'mb-0' : 'mb-2'}`}>
    <input className="form-check-input" type="checkbox" id={id} checked={checked} onChange={onChange} />
    <label className="form-check-label fs-13" htmlFor={id}>
      {label}
    </label>
  </div>
);

/* -------------------------------- Dialogs -------------------------------- */

const GenerationModals = ({
  active,
  onClose,
  row,
  panelOpen,
  onClosePanel,
  onToast,
}: GenerationModalsProps) => {
  const submit = (message: string) => (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onToast(message, 'success');
    onClose();
  };

  const [flags, setFlags] = useState<Record<string, boolean>>({
    validate: true,
    attach: true,
    stopOnFail: true,
    queuePrint: false,
    proof: false,
    seal: true,
    record: true,
    attachRecord: true,
    portal: false,
  });
  const toggle = (key: string) => () =>
    setFlags((current) => ({ ...current, [key]: !current[key] }));

  const [generate, setGenerate] = useForm(
    {
      ref: '',
      recipient: row?.recipient ?? '',
      recipientType: row?.recipientType ?? 'Student',
      certificateType: row?.certificateType ?? certificateTypeOptions[0],
      academicYear: ACADEMIC_YEAR,
      template: row?.template ?? templateOptions[0],
      source: row?.sourceRecord ?? '',
      scope: row?.scope ?? '',
      recipients: String(row?.recipients ?? 1),
      citation: row?.citation ?? '',
      signatory: SIGNATORIES[0],
      runDate: RUN_DATE,
      runBy: RUN_OPERATORS[0],
      printNow: 'Yes, queue the print run',
      collection: COLLECTION_POINTS[0],
      notes: '',
    },
    active === 'generate',
  );

  const [bulk, setBulk] = useForm(
    {
      scope: 'Previously Failed',
      job: row ? `${row.ref} · ${row.recipient}` : jobOptions[0],
      template: row?.template ?? templateOptions[0],
      runRef: '',
      runDate: RUN_DATE,
      runBy: RUN_OPERATORS[0],
      notes: row?.blockedBy
        ? 'Retry after the club coordinator fills in the six missing completion dates.'
        : '',
    },
    active === 'bulk',
  );

  const [template, setTemplate] = useForm(
    {
      applyTo: 'This Job',
      job: row ? `${row.ref} · ${row.recipient}` : jobOptions[0],
      template: row?.template ?? templateOptions[0],
      certificateType: row?.certificateType ?? certificateTypeOptions[0],
      why: 'Matches the recipient section and carries the signature block the certificate needs.',
    },
    active === 'template',
  );

  const [print, setPrint] = useForm(
    {
      scope: 'Remaining Only',
      job: row ? `${row.ref} · ${row.recipient}` : jobOptions[0],
      copies: '1 copy',
      printDate: RUN_DATE,
      printBy: RUN_OPERATORS[0],
      paper: PAPER_STOCKS[0],
      notes: row?.printStoppedAt
        ? 'Resume from sheet 13 after the paper reload. Sheets 1 to 12 are already sealed.'
        : '',
    },
    active === 'print',
  );

  const [issue, setIssue] = useForm(
    {
      handedTo: 'Student',
      job: row ? `${row.ref} · ${row.recipient}` : jobOptions[0],
      issueDate: RUN_DATE,
      issuedBy: RUN_OPERATORS[0],
      recipients: row?.outstanding ?? '',
      notes: 'Acknowledgement signed at counter 2 before the certificate was handed over.',
    },
    active === 'issue',
  );

  const meta = row ? TYPE_META[row.certificateType] : null;
  const status = row ? generationStatusOf(row) : 'Pending Approval';
  const printStatus = row ? printStatusOf(row) : 'Not Printed';
  const issueStatus = row ? issueStatusOf(row) : 'Not Issued';

  return (
    <>
      {/* ------------------------------ Generate ----------------------------- */}
      <Modal
        open={active === 'generate'}
        onClose={onClose}
        title="Generate Certificate"
        subtitle="Run a single job against its approved template"
        headerAvatar={{ icon: 'ti ti-player-play', tint: 'primary' }}
        dialogClassName="modal-lg"
        onSubmit={submit('Generation run queued. Every record is validated before a copy is made.')}
        footer={<Footer icon="ti ti-player-play" label="Run Generation" onClose={onClose} />}
      >
        {row ? (
          <JobCard
            row={row}
            statusLabel="Status"
            statusBadge={status === 'Ready to Generate' ? 'info' : 'secondary'}
            status={status}
          >
            <Row label="Template" value={row.template} />
            <Row label="Approved By" value={row.approvedOn ? `${row.signatory} · ${row.approvedOn}` : 'Not yet approved'} last />
            {row.heldFor ? <Highlight label="Held For" value={row.heldFor} tint="warning" /> : null}
          </JobCard>
        ) : null}
        <div className="row g-3">
          <Field label="Job Reference">
            <input
              type="text"
              className="form-control"
              value={generate.ref}
              onChange={(event) => setGenerate('ref')(event.target.value)}
              placeholder="Generated on save"
            />
          </Field>
          <Field label="Recipient or Group">
            <input
              type="text"
              className="form-control"
              value={generate.recipient}
              onChange={(event) => setGenerate('recipient')(event.target.value)}
              placeholder="e.g. Junior Reading Challenge"
            />
          </Field>
          <Field label="Recipient Type" span="col-md-4">
            <Select
              value={generate.recipientType}
              onChange={setGenerate('recipientType')}
              options={recipientTypeOptions}
            />
          </Field>
          <Field label="Certificate Type" span="col-md-4">
            <Select
              value={generate.certificateType}
              onChange={setGenerate('certificateType')}
              options={certificateTypeOptions}
            />
          </Field>
          <Field label="Academic Year" span="col-md-4">
            <Select
              value={generate.academicYear}
              onChange={setGenerate('academicYear')}
              options={academicYearOptions}
            />
          </Field>
          <div className="col-12">
            <h6 className="fs-14 mb-2">Template &amp; Source</h6>
          </div>
          <Field label="Template">
            <Select
              value={generate.template}
              onChange={setGenerate('template')}
              options={templateOptions}
            />
          </Field>
          <Field label="Source Record">
            <input
              type="text"
              className="form-control"
              value={generate.source}
              onChange={(event) => setGenerate('source')(event.target.value)}
            />
          </Field>
          <Field label="Scope">
            <input
              type="text"
              className="form-control"
              value={generate.scope}
              onChange={(event) => setGenerate('scope')(event.target.value)}
            />
          </Field>
          <Field label="Recipients">
            <input
              type="number"
              className="form-control"
              value={generate.recipients}
              onChange={(event) => setGenerate('recipients')(event.target.value)}
            />
          </Field>
          <Field label="Citation Line" span="col-12">
            <textarea
              className="form-control"
              rows={2}
              value={generate.citation}
              onChange={(event) => setGenerate('citation')(event.target.value)}
            />
          </Field>
          <div className="col-12">
            <h6 className="fs-14 mb-2">Approval &amp; Run</h6>
          </div>
          <Field label="Signatory">
            <Select
              value={generate.signatory}
              onChange={setGenerate('signatory')}
              options={SIGNATORIES}
            />
          </Field>
          <Field label="Run Date">
            <DateField value={generate.runDate} onChange={setGenerate('runDate')} />
          </Field>
          <Field label="Run By">
            <Select value={generate.runBy} onChange={setGenerate('runBy')} options={RUN_OPERATORS} />
          </Field>
          <Field label="Print Immediately">
            <Select
              value={generate.printNow}
              onChange={setGenerate('printNow')}
              options={['Yes, queue the print run', 'No, generate only']}
            />
          </Field>
          <Field label="Collection Point">
            <Select
              value={generate.collection}
              onChange={setGenerate('collection')}
              options={COLLECTION_POINTS}
            />
          </Field>
          <Field label="Internal Notes" span="col-12">
            <textarea
              className="form-control"
              rows={2}
              value={generate.notes}
              onChange={(event) => setGenerate('notes')(event.target.value)}
            />
          </Field>
          <div className="col-12">
            <Check
              id="gen-validate"
              label="Validate every record before the run starts"
              checked={flags.validate}
              onChange={toggle('validate')}
            />
            <Check
              id="gen-attach"
              label="Attach each certificate to the recipient record"
              checked={flags.attach}
              onChange={toggle('attach')}
              last
            />
          </div>
        </div>
      </Modal>

      {/* -------------------------------- Bulk ------------------------------- */}
      <Modal
        open={active === 'bulk'}
        onClose={onClose}
        title="Bulk Generate Certificates"
        onSubmit={submit('Batch run queued. The register updates as each record clears validation.')}
        footer={<Footer icon="ti ti-player-play" label="Run Batch" onClose={onClose} />}
      >
        {row && row.failedRecords > 0 ? (
          <p className="fs-13 text-muted mb-3">
            The last run of {row.ref} stopped after {row.failedRecords} of {row.recipients} records
            failed validation.
          </p>
        ) : null}
        {row ? (
          <JobCard
            row={row}
            statusLabel="Status"
            statusBadge={status === 'Failed' ? 'danger' : 'info'}
            status={status}
          >
            <Row label="Records Passing" value={`${passingOf(row)} of ${row.recipients}`} />
            <Row label="Blocked By" value={row.blockedBy ?? 'Nothing outstanding'} />
            <Row
              label="Last Run"
              value={row.run ? `${row.run.date} · ${row.run.label.replace('Batch run ', '')}` : 'No run yet'}
              last
            />
          </JobCard>
        ) : null}
        <p className="mb-2 fs-13 text-muted">Batch scope</p>
        <Segment
          name="bulk-scope"
          label="Batch scope"
          options={['All Records', 'Valid Only', 'Previously Failed']}
          value={bulk.scope}
          onChange={setBulk('scope')}
        />
        <div className="row g-3">
          <Field label="Job" span="col-12">
            <Select value={bulk.job} onChange={setBulk('job')} options={jobOptions} />
          </Field>
          <Field label="Template">
            <Select value={bulk.template} onChange={setBulk('template')} options={templateOptions} />
          </Field>
          <Field label="Run Reference">
            <input
              type="text"
              className="form-control"
              value={bulk.runRef}
              onChange={(event) => setBulk('runRef')(event.target.value)}
              placeholder="Generated on save"
            />
          </Field>
          <Field label="Run Date">
            <DateField value={bulk.runDate} onChange={setBulk('runDate')} />
          </Field>
          <Field label="Run By">
            <Select value={bulk.runBy} onChange={setBulk('runBy')} options={RUN_OPERATORS} />
          </Field>
          <Field label="Run Notes" span="col-12">
            <textarea
              className="form-control"
              rows={2}
              value={bulk.notes}
              onChange={(event) => setBulk('notes')(event.target.value)}
            />
          </Field>
          <div className="col-12">
            <Check
              id="bulk-stop"
              label="Stop the run if any record fails validation"
              checked={flags.stopOnFail}
              onChange={toggle('stopOnFail')}
            />
            <Check
              id="bulk-queue"
              label="Queue the print run as soon as generation finishes"
              checked={flags.queuePrint}
              onChange={toggle('queuePrint')}
              last
            />
          </div>
        </div>
      </Modal>

      {/* ------------------------------- Preview ----------------------------- */}
      <Modal
        open={active === 'preview'}
        onClose={onClose}
        title="Preview Certificate"
        footer={
          <>
            <ActionLink className="btn btn-light me-2" onClick={onClose}>
              Close
            </ActionLink>
            <button
              type="button"
              className="btn btn-primary d-inline-flex align-items-center"
              onClick={() => {
                onToast('Print job queued for this run');
                onClose();
              }}
            >
              <i className="ti ti-printer me-1" />
              Print This Job
            </button>
          </>
        }
      >
        {row && meta ? (
          <>
            <div className="border rounded p-4 mb-3">
              <div className="text-center mb-3 pb-3 border-bottom">
                <span className={`avatar avatar-lg bg-${meta.tint}-transparent text-${meta.tint} rounded mb-2`}>
                  <i className={`${meta.icon} fs-20`} />
                </span>
                <h5 className="fs-15 mb-1">Karkaii School</h5>
                <span className="fs-12 text-muted">
                  {row.certificateType} · {ACADEMIC_YEAR}
                </span>
              </div>
              <p className="fs-13 mb-3">
                This is to certify that <b>{row.recipient}</b> — {row.scope} —{' '}
                {row.citation ?? 'has no citation on file for this job yet.'}
              </p>
              <Row label="Template" value={row.template} />
              <Row label="Generated On" value={row.generatedOn ?? 'Not yet generated'} />
              <Row label="Signed By" value={row.signatory ?? 'Not yet assigned'} />
              <div className="d-flex align-items-center gap-2 border-top pt-3">
                <span className="avatar avatar-md bg-secondary-transparent text-secondary rounded flex-shrink-0">
                  <i className="ti ti-qrcode" />
                </span>
                <div className="overflow-hidden">
                  <span className="fs-12 text-muted d-block">Verification Code</span>
                  <span className="fs-13 fw-medium">
                    {verificationCodeOf(row) ?? 'Issued with the batch manifest'}
                  </span>
                </div>
                <span className={`badge badge-soft-${issueStatus === 'Issued' ? 'success' : 'secondary'} ms-auto`}>
                  {issueStatus}
                </span>
              </div>
            </div>
            <div className="d-flex align-items-center flex-wrap gap-2">
              <span className={`badge badge-soft-${meta.tint}`}>{row.certificateType}</span>
              <span className="badge badge-soft-secondary">
                {row.template.split(', ').slice(1).join(', ') || row.template}, 3 mm bleed
              </span>
              <span className={`badge badge-soft-${row.printed > 0 ? 'success' : 'secondary'}`}>
                {row.printed > 0 ? 'Signed and sealed' : 'Not printed yet'}
              </span>
            </div>
          </>
        ) : null}
      </Modal>

      {/* ------------------------------ Template ----------------------------- */}
      <Modal
        open={active === 'template'}
        onClose={onClose}
        title="Select Template"
        onSubmit={submit('Template applied. The next run prints from it.')}
        footer={<Footer icon="ti ti-layout" label="Apply Template" onClose={onClose} />}
      >
        {TEMPLATES.filter((entry) => entry.isDefault).map((entry) => (
          <div className="d-flex align-items-center gap-2 border rounded p-2 mb-2" key={entry.name}>
            <span className={`avatar avatar-md bg-${entry.tint}-transparent text-${entry.tint} rounded flex-shrink-0`}>
              <i className="ti ti-layout" />
            </span>
            <div className="flex-fill overflow-hidden">
              <h6 className="fs-13 mb-0">{entry.name}</h6>
              <span className="fs-12 text-muted">
                {entry.scope} · {entry.elements} placed elements
              </span>
            </div>
            <span className="badge badge-soft-info">Default</span>
          </div>
        ))}
        <p className="mb-2 fs-13 text-muted mt-3">Apply to</p>
        <Segment
          name="tpl-apply"
          label="Apply to"
          options={['This Job', 'All Of This Type', 'This Academic Year']}
          value={template.applyTo}
          onChange={setTemplate('applyTo')}
        />
        <div className="row g-3">
          <Field label="Job" span="col-12">
            <Select value={template.job} onChange={setTemplate('job')} options={jobOptions} />
          </Field>
          <Field label="Template">
            <Select
              value={template.template}
              onChange={setTemplate('template')}
              options={templateOptions}
            />
          </Field>
          <Field label="Certificate Type">
            <Select
              value={template.certificateType}
              onChange={setTemplate('certificateType')}
              options={certificateTypeOptions}
            />
          </Field>
          <Field label="Why This Template" span="col-12">
            <textarea
              className="form-control"
              rows={2}
              value={template.why}
              onChange={(event) => setTemplate('why')(event.target.value)}
            />
          </Field>
          <div className="col-12">
            <Check
              id="tpl-proof"
              label="Print a paper proof before the full run"
              checked={flags.proof}
              onChange={toggle('proof')}
              last
            />
          </div>
        </div>
      </Modal>

      {/* -------------------------------- Print ------------------------------ */}
      <Modal
        open={active === 'print'}
        onClose={onClose}
        title="Print Certificates"
        onSubmit={submit('Print run queued. The job print history records it.')}
        footer={<Footer icon="ti ti-printer" label="Print Certificates" onClose={onClose} />}
      >
        {row ? (
          <JobCard
            row={row}
            statusLabel="Print"
            statusBadge={printStatus === 'Printed' ? 'success' : printStatus === 'Partly Printed' ? 'warning' : 'secondary'}
            status={printStatus}
          >
            <Row label="Printed So Far" value={printNoteOf(row)} />
            <Row label="Stopped At" value={row.printStoppedAt ?? 'Nothing held'} last />
            <Highlight
              label="Remaining"
              value={remainingLabelOf(row)}
              tint={remainingOf(row) > 0 ? 'warning' : 'success'}
            />
          </JobCard>
        ) : null}
        <p className="mb-2 fs-13 text-muted">Print scope</p>
        <Segment
          name="print-scope"
          label="Print scope"
          options={['Remaining Only', 'Whole Job', 'Paper Proof']}
          value={print.scope}
          onChange={setPrint('scope')}
        />
        <div className="row g-3">
          <Field label="Job" span="col-12">
            <Select value={print.job} onChange={setPrint('job')} options={jobOptions} />
          </Field>
          <Field label="Copies Per Recipient">
            <Select
              value={print.copies}
              onChange={setPrint('copies')}
              options={['1 copy', '2 copies']}
            />
          </Field>
          <Field label="Print Date">
            <DateField value={print.printDate} onChange={setPrint('printDate')} />
          </Field>
          <Field label="Printed By">
            <Select value={print.printBy} onChange={setPrint('printBy')} options={RUN_OPERATORS} />
          </Field>
          <Field label="Paper">
            <Select value={print.paper} onChange={setPrint('paper')} options={PAPER_STOCKS} />
          </Field>
          <Field label="Print Notes" span="col-12">
            <textarea
              className="form-control"
              rows={2}
              value={print.notes}
              onChange={(event) => setPrint('notes')(event.target.value)}
            />
          </Field>
          <div className="col-12">
            <Check
              id="print-seal"
              label="Include the school seal, signature and QR code"
              checked={flags.seal}
              onChange={toggle('seal')}
            />
            <Check
              id="print-record"
              label="Record the run on the job print history"
              checked={flags.record}
              onChange={toggle('record')}
              last
            />
          </div>
        </div>
      </Modal>

      {/* -------------------------------- Issue ------------------------------ */}
      <Modal
        open={active === 'issue'}
        onClose={onClose}
        title="Issue Certificates"
        onSubmit={submit('Handover recorded. The issue timeline carries it.')}
        footer={<Footer icon="ti ti-circle-check" label="Issue Certificates" onClose={onClose} />}
      >
        {row ? (
          <JobCard
            row={row}
            statusLabel="Issue"
            statusBadge={issueStatus === 'Issued' ? 'success' : issueStatus === 'Partly Issued' ? 'warning' : 'secondary'}
            status={issueStatus}
          >
            <Row label="Issued So Far" value={issueNoteOf(row)} />
            <Row label="Outstanding" value={row.outstanding ?? `${atCounterOf(row)} at the counter`} />
            <Row label="At the Counter Since" value={row.counterSince ?? '—'} last />
          </JobCard>
        ) : null}
        <p className="mb-2 fs-13 text-muted">Handed to</p>
        <Segment
          name="issue-to"
          label="Handed to"
          options={['Student', 'Guardian', 'Class Teacher']}
          value={issue.handedTo}
          onChange={setIssue('handedTo')}
        />
        <div className="row g-3">
          <Field label="Job" span="col-12">
            <Select value={issue.job} onChange={setIssue('job')} options={jobOptions} />
          </Field>
          <Field label="Issue Date">
            <DateField value={issue.issueDate} onChange={setIssue('issueDate')} />
          </Field>
          <Field label="Issued By">
            <Select value={issue.issuedBy} onChange={setIssue('issuedBy')} options={RUN_OPERATORS} />
          </Field>
          <Field label="Recipients" span="col-12">
            <input
              type="text"
              className="form-control"
              value={issue.recipients}
              onChange={(event) => setIssue('recipients')(event.target.value)}
              placeholder="Who is collecting"
            />
          </Field>
          <Field label="Handover Notes" span="col-12">
            <textarea
              className="form-control"
              rows={2}
              value={issue.notes}
              onChange={(event) => setIssue('notes')(event.target.value)}
            />
          </Field>
          <div className="col-12">
            <Check
              id="issue-attach"
              label="Attach the certificate to the achievement record"
              checked={flags.attachRecord}
              onChange={toggle('attachRecord')}
            />
            <Check
              id="issue-portal"
              label="Share a copy through the guardian portal"
              checked={flags.portal}
              onChange={toggle('portal')}
              last
            />
          </div>
        </div>
      </Modal>

      {/* -------------------------------- View ------------------------------- */}
      <Modal
        open={active === 'view'}
        onClose={onClose}
        title={row?.ref ?? 'Generation job'}
        subtitle={
          row ? `${row.recipient} • ${recipientsLabelOf(row)} • ${ACADEMIC_YEAR}` : undefined
        }
        headerAvatar={{ icon: 'ti ti-certificate', tint: 'info' }}
        dialogClassName="modal-lg"
        footer={
          <>
            <ActionLink className="btn btn-light me-2" onClick={onClose}>
              Close
            </ActionLink>
            <button
              type="button"
              className="btn btn-primary d-inline-flex align-items-center"
              onClick={() => {
                onToast('Print run queued for the remaining copies');
                onClose();
              }}
            >
              <i className="ti ti-printer me-1" />
              Print Remaining
            </button>
          </>
        }
      >
        {row && meta ? (
          <div className="row g-4">
            <div className="col-md-12">
              <div className="d-flex align-items-center gap-2 border rounded p-3">
                <span className={`avatar avatar-lg bg-${meta.tint}-transparent text-${meta.tint} rounded flex-shrink-0`}>
                  <i className={meta.icon} />
                </span>
                <div className="flex-fill overflow-hidden">
                  <h5 className="fs-14 mb-0">{row.recipient}</h5>
                  <span className="fs-12 text-muted">{row.scope}</span>
                </div>
                <span className={`badge badge-soft-${printStatus === 'Printed' ? 'success' : 'warning'}`}>
                  {printStatus}
                </span>
              </div>
            </div>
            <div className="col-md-6">
              <h6 className="fs-14 mb-2">Job Detail</h6>
              <Row label="Certificate Type" value={row.certificateType} />
              <Row label="Template" value={row.template} />
              <Row label="Generated By" value={row.generatedBy ?? 'Not yet generated'} />
              <Row label="Source Record" value={row.sourceRecord} last />
            </div>
            <div className="col-md-6">
              <h6 className="fs-14 mb-2">Run Progress</h6>
              <Row
                label="Generation"
                value={`${row.generatedOn ? row.recipients : 0} of ${row.recipients}`}
              />
              <Row label="Printing" value={`${row.printed} of ${row.recipients}`} />
              <Row label="Issue" value={`${row.issued} of ${row.recipients}`} />
              <Row label="Remaining" value={remainingLabelOf(row)} last />
            </div>
            <div className="col-md-12">
              <h6 className="fs-14 mb-2">Run and Print History</h6>
              <div className="table-responsive">
                <table className="table table-nowrap mb-0">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Event</th>
                      <th>Detail</th>
                    </tr>
                  </thead>
                  <tbody>
                    {row.approvedOn ? (
                      <tr>
                        <td className="fs-13">{row.approvedOn}</td>
                        <td className="fs-13">Approved</td>
                        <td className="fs-13 text-muted">{row.signatory}</td>
                      </tr>
                    ) : null}
                    {row.run ? (
                      <tr>
                        <td className="fs-13">{row.run.date}</td>
                        <td className="fs-13">{row.generatedOn ? 'Generated' : 'Stopped'}</td>
                        <td className="fs-13 text-muted">
                          {row.run.label}, {row.run.note}
                        </td>
                      </tr>
                    ) : null}
                    {row.printHistory.map((entry) => (
                      <tr key={entry.title}>
                        <td className="fs-13">{entry.note.split(' · ')[0]}</td>
                        <td className="fs-13">Printed</td>
                        <td className="fs-13 text-muted">
                          {entry.title}, {entry.note.split(' · ').slice(1).join(' · ')}
                        </td>
                      </tr>
                    ))}
                    {row.issueTimeline.map((entry) => (
                      <tr key={entry.title}>
                        <td className="fs-13">{entry.note}</td>
                        <td className="fs-13">Issued</td>
                        <td className="fs-13 text-muted">{entry.title}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="col-md-6">
              <h6 className="fs-14 mb-2">Attachments</h6>
              {row.attachments.map((file) => (
                <Tile
                  key={file.name}
                  title={file.name}
                  note={file.note}
                  icon="ti ti-file-type-pdf"
                  tint="danger"
                />
              ))}
            </div>
            <div className="col-md-6">
              <h6 className="fs-14 mb-2">Internal Notes</h6>
              <p className="fs-13 text-muted mb-0">{row.notes}</p>
            </div>
          </div>
        ) : null}
      </Modal>

      {/* ---------------------------- Certificate panel ---------------------- */}
      <Offcanvas
        open={panelOpen}
        onClose={onClosePanel}
        title="Certificate Details"
        placement="end"
        labelledById="gcPanelLabel"
        footer={
          <div className="d-flex gap-2">
            <button
              type="button"
              className="btn btn-primary flex-fill d-inline-flex align-items-center justify-content-center"
              onClick={() => {
                onToast('Remaining copies queued for handover');
                onClosePanel();
              }}
            >
              <i className="ti ti-circle-check me-1" />
              Issue Remaining
            </button>
            <button
              type="button"
              className="btn btn-outline-light bg-white d-inline-flex align-items-center"
              onClick={() => {
                onClosePanel();
                onToast('Opening the certificate preview');
              }}
            >
              <i className="ti ti-file-description me-1" />
              Preview
            </button>
          </div>
        }
      >
        {row && meta ? (
          <>
            <h6 className="fs-14 mb-2">Recipient Profile</h6>
            <div className="d-flex align-items-center gap-2 border rounded p-2 mb-3">
              <span className={`avatar avatar-md bg-${meta.tint}-transparent text-${meta.tint} rounded flex-shrink-0`}>
                <i className={row.recipients === 1 ? 'ti ti-user' : 'ti ti-users'} />
              </span>
              <div className="flex-fill overflow-hidden">
                <h6 className="fs-13 mb-0 text-truncate">{row.recipient}</h6>
                <span className="fs-12 text-muted">
                  {row.ref} · {recipientsLabelOf(row)}
                </span>
              </div>
              <span className={`badge badge-soft-${issueStatus === 'Issued' ? 'success' : 'warning'}`}>
                {issueStatus}
              </span>
            </div>
            <Row label="Recipient Type" value={row.recipientType} />
            <Row label="Scope" value={row.scope} />
            <Row label="Source Record" value={row.sourceRecord} />
            <Row label="Academic Year" value={ACADEMIC_YEAR} last />

            <h6 className="fs-14 mb-2 mt-4">Certificate Information</h6>
            <Row label="Certificate Type" value={row.certificateType} />
            <Row label="Template" value={row.template} />
            <Row label="Generated On" value={row.generatedOn ?? 'Not yet generated'} />
            <Row label="Signed By" value={row.signatory ?? 'Not yet assigned'} />
            <Row
              label="Generated"
              value={`${row.generatedOn ? row.recipients : 0} / ${row.recipients}`}
            />
            <Row label="Printed" value={`${row.printed} / ${row.recipients}`} />
            <Row label="Issued" value={`${row.issued} / ${row.recipients}`} last />

            <h6 className="fs-14 mb-2 mt-4">Template Preview</h6>
            <div className="border rounded p-3 mb-3">
              <h6 className="fs-13 mb-1">{row.template}</h6>
              <span className="fs-12 text-muted d-block mb-2">{row.certificateType}</span>
              <p className="fs-13 text-muted mb-2">{row.citation ?? previewLineOf(row)}</p>
              <div className="d-flex align-items-center gap-2 border-top pt-2">
                <span className="avatar avatar-sm bg-secondary-transparent text-secondary rounded flex-shrink-0">
                  <i className="ti ti-qrcode" />
                </span>
                <span className="fs-12 text-muted text-truncate">
                  {row.ref} · {row.printed} {row.printed === 1 ? 'copy' : 'copies'}
                </span>
              </div>
            </div>

            <h6 className="fs-14 mb-2 mt-4">Approval Workflow</h6>
            <div className="table-responsive mb-3">
              <table className="table table-nowrap mb-0">
                <thead>
                  <tr>
                    <th>Stage</th>
                    <th>Owner</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {workflowOf(row).map((stage) => (
                    <tr key={stage.stage}>
                      <td className="fs-13">{stage.stage}</td>
                      <td className="fs-13 text-muted">{stage.owner}</td>
                      <td className="fs-13">{stage.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h6 className="fs-14 mb-2 mt-4">Print &amp; Download History</h6>
            {row.printHistory.length > 0 ? (
              row.printHistory.map((entry) => (
                <Tile
                  key={entry.title}
                  title={entry.title}
                  note={entry.note}
                  icon="ti ti-printer"
                  tint="purple"
                />
              ))
            ) : (
              <Tile
                title="Nothing printed yet"
                note="Starts once the job is generated"
                icon="ti ti-printer"
                tint="secondary"
              />
            )}
            {row.outstanding ? (
              <Tile
                title="Still at the counter"
                note={row.outstanding}
                icon="ti ti-inbox"
                tint="warning"
              />
            ) : null}

            <h6 className="fs-14 mb-2 mt-4">Audit Trail</h6>
            {auditOf(row).map((entry) => (
              <Tile
                key={entry.title}
                title={entry.title}
                note={entry.note}
                icon="ti ti-history"
                tint="info"
              />
            ))}
            <p className="fs-12 text-muted mb-0 mt-3">
              {shareOf(row.issued, row.recipients)}% of this job has reached its recipients.
            </p>
          </>
        ) : null}
      </Offcanvas>
    </>
  );
};

export default GenerationModals;
