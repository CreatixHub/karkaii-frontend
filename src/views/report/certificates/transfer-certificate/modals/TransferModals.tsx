import { Fragment, useEffect, useState } from 'react';
import Modal from '@components/ui/Modal';
import Offcanvas from '@components/ui/Offcanvas';
import DateField from '@components/ui/DateField';
import { ActionLink } from '@components/workspace';
import type { Request } from '../data/transfer.data';
import {
  approvalStatusOf,
  blocksApprovalOf,
  booksOnLoanOf,
  citationOf,
  classOptions,
  clearanceNoteOf,
  clearanceStatusOf,
  clearanceStatusOptions,
  clearanceTint,
  clearedCountOf,
  COLLECTION_POINTS,
  CONDUCT_OPTIONS,
  daysOpenOf,
  DECISION_ON,
  DEPARTMENTS,
  departmentsOf,
  heldByOf,
  issueStatusOf,
  money,
  nextClassOf,
  OFFICERS,
  openForOf,
  outstandingOf,
  previewEmptyNoteOf,
  promotionLineOf,
  reasonOptions,
  REASON_TINT,
  REJECTION_REASONS,
  requestOptions,
  sectionOptions,
  SIGNATORIES,
  auditOf,
  verificationCodeOf,
  waitingAtCounterOf,
  workflowOf,
} from '../data/transfer.data';

export type TransferModalId =
  | 'new'
  | 'edit'
  | 'clearance'
  | 'approve'
  | 'generate'
  | 'print'
  | 'view';

export interface TransferModalsProps {
  active: TransferModalId | null;
  onClose: () => void;
  row: Request | null;
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

const Tile = ({
  title,
  note,
  icon,
  tint,
}: {
  title: string;
  note: string;
  icon: string;
  tint: string;
}) => (
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

/** The bordered request card each dialog opens on. */
const RequestCard = ({
  row,
  rows,
  children,
}: {
  row: Request;
  rows: { label: string; value: string }[];
  children?: React.ReactNode;
}) => (
  <div className="border rounded p-3 mb-3">
    <div className="d-flex align-items-center mb-3">
      <span
        className={`avatar avatar-md bg-${REASON_TINT[row.reason]}-transparent text-${REASON_TINT[row.reason]} rounded flex-shrink-0`}
      >
        <i className="ti ti-user" />
      </span>
      <div className="ms-2">
        <h5 className="fs-14 mb-0">{row.student}</h5>
        <span className="fs-12 text-muted">
          {row.tcNumber} · {row.className} · {row.section}
        </span>
      </div>
      <div className="ms-auto text-end">
        <span className="fs-12 text-muted d-block">Clearance</span>
        <span className={`badge badge-soft-${clearanceTint(clearanceStatusOf(row))}`}>
          {clearedCountOf(row)} of {DEPARTMENTS.length} cleared
        </span>
      </div>
    </div>
    {rows.map((entry, index) => (
      <Row key={entry.label} label={entry.label} value={entry.value} last={index === rows.length - 1} />
    ))}
    {children}
  </div>
);

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
    {options.map((option) => {
      const id = `${name}-${option.replace(/\s+/g, '-').toLowerCase()}`;
      return (
        <Fragment key={option}>
          <input
            type="radio"
            className="btn-check"
            name={name}
            id={id}
            checked={value === option}
            onChange={() => onChange(option)}
          />
          <label className="btn" htmlFor={id}>
            {option}
          </label>
        </Fragment>
      );
    })}
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
    <input
      className="form-check-input"
      type="checkbox"
      id={id}
      checked={checked}
      onChange={onChange}
    />
    <label className="form-check-label fs-13" htmlFor={id}>
      {label}
    </label>
  </div>
);

/** The clearance checklist, printed the same way in three places. */
const ClearanceTable = ({ row }: { row: Request }) => (
  <div className="table-responsive mb-3">
    <table className="table table-nowrap mb-0">
      <thead>
        <tr>
          <th>Department</th>
          <th>Detail</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {departmentsOf(row).map((entry) => (
          <tr key={entry.name}>
            <td className="fs-13">{entry.name}</td>
            <td className="fs-13 text-muted">{entry.check.detail}</td>
            <td>
              <span className={`badge badge-soft-${clearanceTint(entry.check.status)}`}>
                {entry.check.status}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

/* -------------------------------- Dialogs -------------------------------- */

const TransferModals = ({
  active,
  onClose,
  row,
  panelOpen,
  onClosePanel,
  onToast,
}: TransferModalsProps) => {
  const submit = (message: string) => (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onToast(message, 'success');
    onClose();
  };

  const [flags, setFlags] = useState<Record<string, boolean>>({
    startRun: true,
    sendStatement: false,
    audit: true,
    sendToApproval: true,
    tellGuardian: true,
    generateAfter: true,
    markLeft: true,
    qr: true,
    archive: false,
    seal: true,
    closeRequest: true,
  });
  const toggle = (key: string) => () => setFlags((current) => ({ ...current, [key]: !current[key] }));

  const editing = active === 'edit';

  const [form, setForm] = useForm(
    {
      tcNumber: editing ? (row?.tcNumber ?? '') : '',
      student: editing ? (row?.student ?? '') : '',
      admissionNo: editing ? (row?.admissionNo ?? '') : '',
      className: row?.className ?? classOptions[0],
      section: row ? row.section.replace('Section ', '') : sectionOptions[0],
      reason: row?.reason ?? reasonOptions[0],
      requestedBy: 'Guardian',
      reasonDetail: editing ? (row?.reasonDetail ?? '') : '',
      requestedOn: editing ? (row?.requestedOn ?? DECISION_ON) : DECISION_ON,
      lastAttended: row?.lastAttendedOn ?? DECISION_ON,
      receivingSchool: row?.receivingSchool ?? '',
      attendance: row ? `${row.attendance}%` : '',
      conduct: row?.conduct ?? CONDUCT_OPTIONS[0],
      promotion: row ? promotionLineOf(row) : 'Promoted to the next class',
      signatory: SIGNATORIES[0],
      copies: row ? `${row.copies} ${row.copies === 1 ? 'copy' : 'copies'}` : '1 copy',
      collection: COLLECTION_POINTS[0],
      notes: editing ? (row?.notes ?? '') : '',
    },
    active === 'new' || active === 'edit',
  );

  const [clearance, setClearance] = useForm(
    {
      department: row ? (heldByOf(row) ?? DEPARTMENTS[0]) : DEPARTMENTS[0],
      request: row ? `${row.tcNumber} · ${row.student}` : requestOptions[0],
      status: 'Cleared',
      verifiedOn: DECISION_ON,
      note: 'Both titles returned at the circulation desk. No overdue charge applied.',
    },
    active === 'clearance',
  );

  const [decision, setDecision] = useForm(
    {
      decision: 'Approve',
      request: row ? `${row.tcNumber} · ${row.student}` : requestOptions[0],
      signatory: SIGNATORIES[0],
      decidedOn: DECISION_ON,
      rejection: REJECTION_REASONS[0],
      remarks: row
        ? `All ${DEPARTMENTS.length} departments cleared. Certificate to state the ${promotionLineOf(row).toLowerCase()} and the attendance figure.`
        : '',
    },
    active === 'approve',
  );

  const [generate, setGenerate] = useForm(
    {
      template: 'Standard',
      request: row ? `${row.tcNumber} · ${row.student}` : requestOptions[0],
      generatedOn: DECISION_ON,
      signatory: SIGNATORIES[0],
      promotion: row ? promotionLineOf(row) : '',
      conduct: row?.conduct ?? CONDUCT_OPTIONS[0],
    },
    active === 'generate',
  );

  const [print, setPrint] = useForm(
    {
      job: 'Original',
      request: row ? `${row.tcNumber} · ${row.student}` : requestOptions[0],
      copies: row ? `${row.copies} ${row.copies === 1 ? 'copy' : 'copies'}` : '1 copy',
      printedOn: DECISION_ON,
      printedBy: OFFICERS[0],
      handedTo: 'Guardian',
      notes:
        'Original checked against the admission record before handover. Acknowledgement signed at counter 2.',
    },
    active === 'print',
  );

  const balance = row ? outstandingOf(row) : 0;

  return (
    <>
      {/* ---------------------------- New / Edit ----------------------------- */}
      <Modal
        open={active === 'new' || active === 'edit'}
        onClose={onClose}
        title={editing ? 'Edit Request' : 'New TC Request'}
        subtitle={
          editing && row
            ? `${row.tcNumber} • ${row.student} • ${approvalStatusOf(row).toLowerCase()}`
            : 'Open a transfer certificate request and start the clearance run'
        }
        headerAvatar={{ icon: editing ? 'ti ti-edit' : 'ti ti-file-export', tint: 'primary' }}
        dialogClassName="modal-lg"
        onSubmit={submit(
          editing ? 'Request updated.' : 'Request raised. Every department has been notified.',
        )}
        footer={
          <Footer
            icon={editing ? 'ti ti-check' : 'ti ti-plus'}
            label={editing ? 'Save Changes' : 'Raise Request'}
            onClose={onClose}
          />
        }
      >
        {editing && row && blocksApprovalOf(row) ? (
          <div className="alert alert-warning fs-13" role="alert">
            {heldByOf(row)} has blocked this request.{' '}
            {balance > 0
              ? `${money(balance)} is outstanding across ${row.dues.length} items.`
              : `${booksOnLoanOf(row)} library items are still out.`}
          </div>
        ) : (
          <p className="fs-13 text-muted">
            Raising a request notifies every department. Approval cannot be given until all of them
            have cleared.
          </p>
        )}
        {!editing ? (
          <>
            <p className="mb-2 fs-13 text-muted">Leaving reason</p>
            <Segment
              name="tc-reason"
              label="Leaving reason"
              options={['Relocation', 'Board Change', 'Completed', 'Abroad']}
              value={form.reason.startsWith('Completed') ? 'Completed' : form.reason === 'Moving Abroad' ? 'Abroad' : form.reason}
              onChange={setForm('reason')}
            />
          </>
        ) : null}
        <div className="row g-3">
          <Field label="TC Number">
            <input
              type="text"
              className="form-control"
              value={form.tcNumber}
              onChange={(event) => setForm('tcNumber')(event.target.value)}
              placeholder="Generated on save"
            />
          </Field>
          <Field label="Student">
            <input
              type="text"
              className="form-control"
              value={form.student}
              onChange={(event) => setForm('student')(event.target.value)}
            />
          </Field>
          <Field label="Admission No." span="col-md-4">
            <input
              type="text"
              className="form-control"
              value={form.admissionNo}
              onChange={(event) => setForm('admissionNo')(event.target.value)}
            />
          </Field>
          <Field label="Class" span="col-md-4">
            <Select value={form.className} onChange={setForm('className')} options={classOptions} />
          </Field>
          <Field label="Section" span="col-md-4">
            <Select value={form.section} onChange={setForm('section')} options={sectionOptions} />
          </Field>

          <div className="col-12">
            <h6 className="fs-14 mb-2">Leaving Details</h6>
          </div>
          <Field label="Leaving Reason">
            <Select value={form.reason} onChange={setForm('reason')} options={reasonOptions} />
          </Field>
          <Field label="Requested By">
            <Select
              value={form.requestedBy}
              onChange={setForm('requestedBy')}
              options={['Guardian', 'Student', 'Class Teacher']}
            />
          </Field>
          <Field label="Reason Detail" span="col-12">
            <textarea
              className="form-control"
              rows={2}
              value={form.reasonDetail}
              onChange={(event) => setForm('reasonDetail')(event.target.value)}
            />
          </Field>
          <Field label="Request Date">
            <DateField value={form.requestedOn} onChange={setForm('requestedOn')} />
          </Field>
          <Field label="Last Attended">
            <DateField value={form.lastAttended} onChange={setForm('lastAttended')} />
          </Field>
          <Field label="Receiving School" span="col-12">
            <input
              type="text"
              className="form-control"
              value={form.receivingSchool}
              onChange={(event) => setForm('receivingSchool')(event.target.value)}
            />
          </Field>

          <div className="col-12">
            <h6 className="fs-14 mb-2">Academic Record</h6>
          </div>
          <Field label="Attendance" span="col-md-4">
            <input
              type="text"
              className="form-control"
              value={form.attendance}
              onChange={(event) => setForm('attendance')(event.target.value)}
            />
          </Field>
          <Field label="Conduct" span="col-md-4">
            <Select value={form.conduct} onChange={setForm('conduct')} options={CONDUCT_OPTIONS} />
          </Field>
          <Field label="Promotion Status" span="col-md-4">
            <Select
              value={form.promotion}
              onChange={setForm('promotion')}
              options={[
                form.promotion,
                'Promoted to the next class',
                'Passed the board examination',
                'Term in progress',
              ].filter((value, index, list) => list.indexOf(value) === index)}
            />
          </Field>

          <div className="col-12">
            <h6 className="fs-14 mb-2">Approval &amp; Issue</h6>
          </div>
          <Field label="Signatory" span="col-md-4">
            <Select value={form.signatory} onChange={setForm('signatory')} options={SIGNATORIES} />
          </Field>
          <Field label="Copies" span="col-md-4">
            <Select
              value={form.copies}
              onChange={setForm('copies')}
              options={['1 copy', '2 copies', '3 copies']}
            />
          </Field>
          <Field label="Collection" span="col-md-4">
            <Select
              value={form.collection}
              onChange={setForm('collection')}
              options={COLLECTION_POINTS}
            />
          </Field>
          <Field label="Supporting Document" span="col-12">
            <input type="file" className="form-control" />
          </Field>
          <Field label="Internal Notes" span="col-12">
            <textarea
              className="form-control"
              rows={2}
              value={form.notes}
              onChange={(event) => setForm('notes')(event.target.value)}
            />
          </Field>
          <div className="col-12">
            {editing ? (
              <Check
                id="tc-audit"
                label="Record this amendment on the audit history"
                checked={flags.audit}
                onChange={toggle('audit')}
                last
              />
            ) : (
              <>
                <Check
                  id="tc-start"
                  label="Start the department clearance run on save"
                  checked={flags.startRun}
                  onChange={toggle('startRun')}
                />
                <Check
                  id="tc-statement"
                  label="Send the guardian a dues and library statement"
                  checked={flags.sendStatement}
                  onChange={toggle('sendStatement')}
                  last
                />
              </>
            )}
          </div>
        </div>
      </Modal>

      {/* ---------------------------- Clearance ------------------------------ */}
      <Modal
        open={active === 'clearance'}
        onClose={onClose}
        title="Verify Clearance"
        dialogClassName="modal-lg"
        onSubmit={submit('Clearance saved. The request moves as soon as every department clears.')}
        footer={<Footer icon="ti ti-checklist" label="Save Clearance" onClose={onClose} />}
      >
        {row ? (
          <>
            <RequestCard
              row={row}
              rows={[
                { label: 'Outstanding Balance', value: money(outstandingOf(row)) },
                {
                  label: 'Books On Loan',
                  value: `${booksOnLoanOf(row)} ${booksOnLoanOf(row) === 1 ? 'title' : 'titles'}`,
                },
                {
                  label: 'Blocks Approval',
                  value: blocksApprovalOf(row)
                    ? `Yes, until the ${(heldByOf(row) ?? '').toLowerCase()} clears`
                    : 'No, every department has cleared',
                },
              ]}
            />
            <ClearanceTable row={row} />
          </>
        ) : null}
        <div className="row g-3">
          <Field label="Department">
            <Select
              value={clearance.department}
              onChange={setClearance('department')}
              options={DEPARTMENTS}
            />
          </Field>
          <Field label="Request">
            <Select
              value={clearance.request}
              onChange={setClearance('request')}
              options={requestOptions}
            />
          </Field>
          <Field label="New Status">
            <Select
              value={clearance.status}
              onChange={setClearance('status')}
              options={clearanceStatusOptions}
            />
          </Field>
          <Field label="Verified On">
            <DateField value={clearance.verifiedOn} onChange={setClearance('verifiedOn')} />
          </Field>
          <Field label="Clearance Note" span="col-12">
            <textarea
              className="form-control"
              rows={2}
              value={clearance.note}
              onChange={(event) => setClearance('note')(event.target.value)}
            />
          </Field>
          <div className="col-12">
            <Check
              id="clr-approve"
              label="Send to approval once every department has cleared"
              checked={flags.sendToApproval}
              onChange={toggle('sendToApproval')}
            />
            <Check
              id="clr-tell"
              label="Tell the guardian what is still outstanding"
              checked={flags.tellGuardian}
              onChange={toggle('tellGuardian')}
              last
            />
          </div>
        </div>
      </Modal>

      {/* ----------------------------- Approve ------------------------------- */}
      <Modal
        open={active === 'approve'}
        onClose={onClose}
        title="Approve / Reject Request"
        onSubmit={submit('Decision saved.')}
        footer={<Footer icon="ti ti-gavel" label="Save Decision" onClose={onClose} />}
      >
        {row ? (
          <RequestCard
            row={row}
            rows={[
              { label: 'Requested On', value: row.requestedOn },
              { label: 'Attendance', value: `${row.attendance}%` },
              { label: 'Open For', value: openForOf(row) },
            ]}
          />
        ) : null}
        <p className="mb-2 fs-13 text-muted">Decision</p>
        <Segment
          name="tc-decision"
          label="Decision"
          options={['Approve', 'Hold', 'Reject']}
          value={decision.decision}
          onChange={setDecision('decision')}
        />
        <div className="row g-3">
          <Field label="Request" span="col-12">
            <Select
              value={decision.request}
              onChange={setDecision('request')}
              options={requestOptions}
            />
          </Field>
          <Field label="Signatory">
            <Select
              value={decision.signatory}
              onChange={setDecision('signatory')}
              options={SIGNATORIES}
            />
          </Field>
          <Field label="Decision Date">
            <DateField value={decision.decidedOn} onChange={setDecision('decidedOn')} />
          </Field>
          <Field label="Rejection Reason" span="col-12">
            <Select
              value={decision.rejection}
              onChange={setDecision('rejection')}
              options={REJECTION_REASONS}
            />
          </Field>
          <Field label="Decision Remarks" span="col-12">
            <textarea
              className="form-control"
              rows={2}
              value={decision.remarks}
              onChange={(event) => setDecision('remarks')(event.target.value)}
            />
          </Field>
          <div className="col-12">
            <Check
              id="dec-generate"
              label="Generate the certificate straight after approval"
              checked={flags.generateAfter}
              onChange={toggle('generateAfter')}
            />
            <Check
              id="dec-left"
              label="Mark the student as left on the class roll"
              checked={flags.markLeft}
              onChange={toggle('markLeft')}
              last
            />
          </div>
        </div>
      </Modal>

      {/* ----------------------------- Generate ------------------------------ */}
      <Modal
        open={active === 'generate'}
        onClose={onClose}
        title="Generate Transfer Certificate"
        onSubmit={submit('Certificate generated and queued for printing.')}
        footer={<Footer icon="ti ti-file-certificate" label="Generate Certificate" onClose={onClose} />}
      >
        {row ? (
          <RequestCard
            row={row}
            rows={[
              {
                label: 'Approved By',
                value: row.approvedOn ? `${row.approvedBy} · ${row.approvedOn}` : 'Not approved',
              },
              { label: 'Date of Admission', value: row.admittedOn },
              { label: 'Last Attended', value: row.lastAttendedOn ?? 'Still attending' },
            ]}
          />
        ) : null}
        <p className="mb-2 fs-13 text-muted">Certificate template</p>
        <Segment
          name="tc-template"
          label="Certificate template"
          options={['Standard', 'With Board Result', 'With Attendance']}
          value={generate.template}
          onChange={setGenerate('template')}
        />
        <div className="row g-3">
          <Field label="Request" span="col-12">
            <Select
              value={generate.request}
              onChange={setGenerate('request')}
              options={requestOptions}
            />
          </Field>
          <Field label="Generation Date">
            <DateField value={generate.generatedOn} onChange={setGenerate('generatedOn')} />
          </Field>
          <Field label="Signatory">
            <Select
              value={generate.signatory}
              onChange={setGenerate('signatory')}
              options={SIGNATORIES}
            />
          </Field>
          <Field label="Promotion Line">
            <input
              type="text"
              className="form-control"
              value={generate.promotion}
              onChange={(event) => setGenerate('promotion')(event.target.value)}
            />
          </Field>
          <Field label="Conduct">
            <Select
              value={generate.conduct}
              onChange={setGenerate('conduct')}
              options={CONDUCT_OPTIONS}
            />
          </Field>
          {row ? (
            <Field label="Certificate Wording" span="col-12">
              <textarea
                className="form-control"
                rows={3}
                readOnly
                value={`This is to certify that ${row.student}${citationOf(row)} Last attended ${
                  row.lastAttendedOn ?? 'still attending'
                }. Conduct: ${generate.conduct.toLowerCase()}.`}
              />
            </Field>
          ) : null}
          <div className="col-12">
            <Check
              id="gen-qr"
              label="Print a QR code linked to the verification page"
              checked={flags.qr}
              onChange={toggle('qr')}
            />
            <Check
              id="gen-archive"
              label="Archive the student record after issue"
              checked={flags.archive}
              onChange={toggle('archive')}
              last
            />
          </div>
        </div>
      </Modal>

      {/* ------------------------------- Print ------------------------------- */}
      <Modal
        open={active === 'print'}
        onClose={onClose}
        title="Print Certificate"
        onSubmit={submit('Print job queued and recorded on the request history.')}
        footer={<Footer icon="ti ti-printer" label="Print Certificate" onClose={onClose} />}
      >
        {row ? (
          <RequestCard
            row={row}
            rows={[
              { label: 'Status', value: issueStatusOf(row) },
              { label: 'Generated', value: row.generatedOn ?? 'Not yet generated' },
              {
                label: 'Printed',
                value: row.printedOn
                  ? `${row.printedOn} · ${row.copies} ${row.copies === 1 ? 'copy' : 'copies'}`
                  : 'Nothing printed',
              },
              {
                label: 'At the Counter',
                value:
                  waitingAtCounterOf(row) === null
                    ? 'Not at the counter'
                    : `${waitingAtCounterOf(row)} days`,
              },
            ]}
          />
        ) : null}
        <p className="mb-2 fs-13 text-muted">Print job</p>
        <Segment
          name="tc-print"
          label="Print job"
          options={['Original', 'Duplicate', 'Unsigned Proof']}
          value={print.job}
          onChange={setPrint('job')}
        />
        <div className="row g-3">
          <Field label="Request" span="col-12">
            <Select value={print.request} onChange={setPrint('request')} options={requestOptions} />
          </Field>
          <Field label="Copies">
            <Select
              value={print.copies}
              onChange={setPrint('copies')}
              options={['1 copy', '2 copies', '3 copies']}
            />
          </Field>
          <Field label="Print Date">
            <DateField value={print.printedOn} onChange={setPrint('printedOn')} />
          </Field>
          <Field label="Printed By">
            <Select value={print.printedBy} onChange={setPrint('printedBy')} options={OFFICERS} />
          </Field>
          <Field label="Handed To">
            <Select
              value={print.handedTo}
              onChange={setPrint('handedTo')}
              options={['Guardian', 'Student', 'Posted to the guardian']}
            />
          </Field>
          <Field label="Handover Notes" span="col-12">
            <textarea
              className="form-control"
              rows={2}
              value={print.notes}
              onChange={(event) => setPrint('notes')(event.target.value)}
            />
          </Field>
          <div className="col-12">
            <Check
              id="prt-seal"
              label="Include the school seal, signature and QR code"
              checked={flags.seal}
              onChange={toggle('seal')}
            />
            <Check
              id="prt-close"
              label="Close the request once the certificate is collected"
              checked={flags.closeRequest}
              onChange={toggle('closeRequest')}
              last
            />
          </div>
        </div>
      </Modal>

      {/* -------------------------------- View ------------------------------- */}
      <Modal
        open={active === 'view'}
        onClose={onClose}
        title={row?.tcNumber ?? 'Transfer certificate'}
        subtitle={row ? `${row.student} • ${row.className}, ${row.section} • ${row.reason}` : undefined}
        headerAvatar={{ icon: 'ti ti-file-export', tint: 'primary' }}
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
                onToast('Print job queued for this certificate');
                onClose();
              }}
            >
              <i className="ti ti-printer me-1" />
              Print Certificate
            </button>
          </>
        }
      >
        {row ? (
          <div className="row g-4">
            <div className="col-12">
              <div className="d-flex align-items-center gap-2 border rounded p-3">
                <span
                  className={`avatar avatar-lg bg-${REASON_TINT[row.reason]}-transparent text-${REASON_TINT[row.reason]} rounded flex-shrink-0`}
                >
                  <i className="ti ti-user" />
                </span>
                <div className="flex-fill overflow-hidden">
                  <h5 className="fs-14 mb-0">{row.student}</h5>
                  <span className="fs-12 text-muted">
                    {row.admissionNo} · admitted {row.admittedOn} · {row.house}
                  </span>
                </div>
                <span className={`badge badge-soft-${clearanceTint(clearanceStatusOf(row))}`}>
                  {issueStatusOf(row)}
                </span>
              </div>
            </div>
            <div className="col-md-6">
              <h6 className="fs-14 mb-2">Request Detail</h6>
              <Row label="Requested" value={row.requestedOn} />
              <Row label="Leaving Reason" value={row.reason} />
              <Row label="Last Attended" value={row.lastAttendedOn ?? 'Still attending'} />
              <Row label="Approved By" value={row.approvedBy ?? 'Not yet approved'} />
              <Row label="Collected" value={row.collectedOn ?? 'Not collected'} last />
            </div>
            <div className="col-md-6">
              <h6 className="fs-14 mb-2">Academic Summary</h6>
              <Row label="Clearance" value={`${clearedCountOf(row)} of ${DEPARTMENTS.length}`} />
              <Row label="Attendance" value={`${row.attendance}%`} />
              <Row label="Conduct" value={row.conduct} />
              <Row label="Promotion" value={promotionLineOf(row)} />
              <Row label="Outstanding" value={money(outstandingOf(row))} last />
            </div>
            <div className="col-12">
              <h6 className="fs-14 mb-2">Clearance Checklist</h6>
              <ClearanceTable row={row} />
            </div>
            <div className="col-12">
              <h6 className="fs-14 mb-2">Request Lifecycle</h6>
              {auditOf(row).map((entry) => (
                <Tile
                  key={entry.title}
                  title={entry.title}
                  note={entry.note}
                  icon="ti ti-history"
                  tint="info"
                />
              ))}
            </div>
            <div className="col-12">
              <h6 className="fs-14 mb-2">Internal Notes</h6>
              <p className="fs-13 text-muted mb-0">{row.notes}</p>
            </div>
          </div>
        ) : null}
      </Modal>

      {/* ------------------------------- TC panel ---------------------------- */}
      <Offcanvas
        open={panelOpen}
        onClose={onClosePanel}
        title="Transfer Certificate Details"
        placement="end"
        labelledById="tcPanelLabel"
        footer={
          <div className="d-flex gap-2">
            <button
              type="button"
              className="btn btn-primary flex-fill d-inline-flex align-items-center justify-content-center"
              onClick={() => {
                onToast('Clearance opened for verification');
                onClosePanel();
              }}
            >
              <i className="ti ti-checklist me-1" />
              Verify Clearance
            </button>
            <button
              type="button"
              className="btn btn-outline-light bg-white d-inline-flex align-items-center"
              onClick={() => {
                onClosePanel();
                onToast('Opening the request for editing');
              }}
            >
              <i className="ti ti-edit me-1" />
              Edit
            </button>
          </div>
        }
      >
        {row ? (
          <>
            <h6 className="fs-14 mb-2">Student Information</h6>
            <div className="d-flex align-items-center gap-2 border rounded p-2 mb-3">
              <span
                className={`avatar avatar-md bg-${REASON_TINT[row.reason]}-transparent text-${REASON_TINT[row.reason]} rounded flex-shrink-0`}
              >
                <i className="ti ti-user" />
              </span>
              <div className="flex-fill overflow-hidden">
                <h6 className="fs-13 mb-0 text-truncate">{row.student}</h6>
                <span className="fs-12 text-muted">
                  {row.admissionNo} · {row.className} · {row.section}
                </span>
              </div>
              <span className={`badge badge-soft-${clearanceTint(clearanceStatusOf(row))}`}>
                {clearanceStatusOf(row)}
              </span>
            </div>
            <Row label="TC Number" value={row.tcNumber} />
            <Row label="Date of Admission" value={row.admittedOn} />
            <Row label="Guardian" value={row.guardian} />
            <Row label="Leaving Reason" value={row.reason} last />

            <h6 className="fs-14 mb-2 mt-4">Academic Summary</h6>
            <Row label="Attendance" value={`${row.attendance}%`} />
            <Row label="Conduct" value={row.conduct} />
            <Row
              label="Promotion"
              value={(nextClassOf(row) ?? 'Term in progress').replace('Class ', '')}
              last
            />

            <h6 className="fs-14 mb-2 mt-4">Clearance Checklist</h6>
            <ClearanceTable row={row} />

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

            <h6 className="fs-14 mb-2 mt-4">Certificate Details</h6>
            {row.generatedOn ? (
              <div className="border rounded p-3 mb-3">
                <h6 className="fs-13 mb-1">Transfer Certificate</h6>
                <span className="fs-12 text-muted d-block mb-2">{row.tcNumber}</span>
                <p className="fs-13 text-muted mb-2">
                  This is to certify that <b className="text-dark">{row.student}</b>
                  {citationOf(row)}
                </p>
                <div className="d-flex align-items-center gap-2 border-top pt-2">
                  <span className="avatar avatar-sm bg-secondary-transparent text-secondary rounded flex-shrink-0">
                    <i className="ti ti-qrcode" />
                  </span>
                  <span className="fs-12 text-muted text-truncate">{verificationCodeOf(row)}</span>
                </div>
              </div>
            ) : (
              <Tile
                title="No certificate generated"
                note={previewEmptyNoteOf(row)}
                icon="ti ti-file-off"
                tint="secondary"
              />
            )}

            <h6 className="fs-14 mb-2 mt-4">Collection Information</h6>
            <Row label="Collect From" value={COLLECTION_POINTS[0]} />
            <Row label="Who May Collect" value="Registered guardian" />
            <Row
              label="Copies Requested"
              value={`${row.copies} ${row.copies === 1 ? 'copy' : 'copies'}`}
            />
            <Row
              label="Status"
              value={row.printedOn ? 'Ready at the counter' : 'Not ready'}
              last
            />

            <h6 className="fs-14 mb-2 mt-4">Audit History</h6>
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
              {clearanceNoteOf(row)} · {openForOf(row) === 'Closed' ? 'closed' : `open ${daysOpenOf(row)} days`}.
            </p>
          </>
        ) : null}
      </Offcanvas>
    </>
  );
};

export default TransferModals;
