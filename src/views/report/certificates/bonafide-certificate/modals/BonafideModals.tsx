import { useEffect, useState } from 'react';
import Modal from '@components/ui/Modal';
import Offcanvas from '@components/ui/Offcanvas';
import DateField from '@components/ui/DateField';
import { ActionLink } from '@components/workspace';
import type { Request } from '../data/bonafide.data';
import {
  agoOf,
  approvalOf,
  approverOptions,
  classOptions,
  COLLECT_BY,
  issueNoteOf,
  purposeOptions,
  RUN_DATE,
  SLA_DAYS,
  stateNoteOf,
  stateOf,
  statePill,
  turnaroundLabelOf,
  turnaroundOf,
} from '../data/bonafide.data';

export type BonafideModalId =
  | 'new'
  | 'approve'
  | 'generate'
  | 'preview'
  | 'print'
  | 'reissue'
  | 'view';

export interface BonafideModalsProps {
  active: BonafideModalId | null;
  onClose: () => void;
  row: Request | null;
  panelOpen: boolean;
  onClosePanel: () => void;
  onToast: (message: string, variant?: 'success' | 'danger' | 'info' | 'warning') => void;
}

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

const Line = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="d-flex align-items-center justify-content-between py-2 border-bottom">
    <span className="fs-13 text-muted">{label}</span>
    <span className="fs-13 fw-medium text-end">{value}</span>
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

const BonafideModals = ({
  active,
  onClose,
  row,
  panelOpen,
  onClosePanel,
  onToast,
}: BonafideModalsProps) => {
  const submit = (message: string) => (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onToast(message, 'success');
    onClose();
  };

  const [request, setRequest] = useForm(
    {
      student: '',
      admissionNo: '',
      className: classOptions[0] ?? 'Class X',
      purpose: purposeOptions[0],
      note: '',
      requestedOn: RUN_DATE,
    },
    active === 'new',
  );

  const [approve, setApprove] = useForm(
    {
      decision: 'Approve',
      approver: row?.approvedBy ?? approverOptions[0] ?? '',
      approvedOn: RUN_DATE,
      note: '',
    },
    active === 'approve',
  );

  const [generate, setGenerate] = useForm(
    {
      template: 'Standard bonafide, A4 portrait',
      copies: '1',
      language: 'English',
      collectBy: COLLECT_BY,
    },
    active === 'generate',
  );

  const [print, setPrint] = useForm(
    {
      copies: String(Math.max(1, row?.copies ?? 1)),
      stock: 'School letterhead',
      collect: 'Front desk collection',
    },
    active === 'print',
  );

  const [reissue, setReissue] = useForm(
    {
      reason: 'Lost or damaged copy',
      copies: '1',
      issueOn: RUN_DATE,
    },
    active === 'reissue',
  );

  return (
    <>
      <Modal
        open={active === 'new'}
        onClose={onClose}
        title="New Bonafide Request"
        dialogClassName="modal-lg"
        onSubmit={submit('Request logged. It waits for approval before anything is generated.')}
        footer={<Footer icon="ti ti-plus" label="Log request" onClose={onClose} />}
      >
        <div className="row g-3">
          <Field label="Student" span="col-12">
            <input
              type="text"
              className="form-control"
              value={request.student}
              onChange={(event) => setRequest('student')(event.target.value)}
              placeholder="Student name"
            />
          </Field>
          <Field label="Admission number">
            <input
              type="text"
              className="form-control"
              value={request.admissionNo}
              onChange={(event) => setRequest('admissionNo')(event.target.value)}
            />
          </Field>
          <Field label="Class">
            <Select
              value={request.className}
              onChange={setRequest('className')}
              options={classOptions}
            />
          </Field>
          <Field label="Purpose">
            <Select
              value={request.purpose}
              onChange={setRequest('purpose')}
              options={purposeOptions}
            />
          </Field>
          <Field label="Requested on">
            <DateField value={request.requestedOn} onChange={setRequest('requestedOn')} />
          </Field>
          <Field label="Detail" span="col-12">
            <textarea
              rows={2}
              className="form-control"
              value={request.note}
              onChange={(event) => setRequest('note')(event.target.value)}
              placeholder="What the certificate is needed for"
            />
          </Field>
        </div>
        <p className="fs-12 text-muted mb-0 mt-3">
          <i className="ti ti-info-circle me-1" />
          The office aims to approve within {SLA_DAYS} days of the request.
        </p>
      </Modal>

      <Modal
        open={active === 'approve'}
        onClose={onClose}
        title="Approve Request"
        onSubmit={submit(`${approve.decision} recorded against ${approve.approver}.`)}
        footer={<Footer icon="ti ti-check" label="Record decision" onClose={onClose} />}
      >
        {row ? (
          <div className="mb-3">
            <Line label="Request" value={row.id} />
            <Line label="Student" value={`${row.student} · ${row.className}`} />
            <Line label="Purpose" value={row.purpose} />
            <Line label="Requested" value={`${row.requestedOn} · ${agoOf(row.requestedOn)}`} />
            <Line
              label="Open for"
              value={
                <span
                  className={`badge badge-soft-${(turnaroundOf(row) ?? 0) <= SLA_DAYS ? 'success' : 'warning'}`}
                >
                  {turnaroundLabelOf(row)}
                </span>
              }
            />
          </div>
        ) : null}
        <div className="row g-3">
          <Field label="Decision">
            <Select
              value={approve.decision}
              onChange={setApprove('decision')}
              options={['Approve', 'Reject', 'Return for more detail']}
            />
          </Field>
          <Field label="Approver">
            <Select
              value={approve.approver}
              onChange={setApprove('approver')}
              options={approverOptions}
            />
          </Field>
          <Field label="Decision date">
            <DateField value={approve.approvedOn} onChange={setApprove('approvedOn')} />
          </Field>
          <Field label="Note" span="col-12">
            <textarea
              rows={2}
              className="form-control"
              value={approve.note}
              onChange={(event) => setApprove('note')(event.target.value)}
              placeholder="Recorded against the request"
            />
          </Field>
        </div>
      </Modal>

      <Modal
        open={active === 'generate'}
        onClose={onClose}
        title="Generate Bonafide Certificate"
        onSubmit={submit('Certificate generated and queued for printing.')}
        footer={<Footer icon="ti ti-file-certificate" label="Generate" onClose={onClose} />}
      >
        {row && approvalOf(row) !== 'Approved' ? (
          <p className="fs-13 text-muted mb-3">
            <i className="ti ti-alert-circle me-1 text-warning" />
            This request has not been approved yet. Generating will do nothing until it is.
          </p>
        ) : null}
        <div className="row g-3">
          <Field label="Template" span="col-12">
            <Select
              value={generate.template}
              onChange={setGenerate('template')}
              options={[
                'Standard bonafide, A4 portrait',
                'Bilingual bonafide, A4 portrait',
                'Short form, half page',
              ]}
            />
          </Field>
          <Field label="Copies">
            <input
              type="text"
              className="form-control"
              value={generate.copies}
              onChange={(event) => setGenerate('copies')(event.target.value)}
            />
          </Field>
          <Field label="Language">
            <Select
              value={generate.language}
              onChange={setGenerate('language')}
              options={['English', 'Hindi', 'Bilingual']}
            />
          </Field>
          <Field label="Ready for collection by" span="col-12">
            <DateField value={generate.collectBy} onChange={setGenerate('collectBy')} />
          </Field>
        </div>
      </Modal>

      <Modal
        open={active === 'preview'}
        onClose={onClose}
        title="Preview Certificate"
        dialogClassName="modal-lg"
        footer={
          <ActionLink className="btn btn-light" onClick={onClose}>
            Close
          </ActionLink>
        }
      >
        {row ? (
          <div className="border rounded p-4">
            <p className="fs-13 text-muted mb-3 text-center">BONAFIDE CERTIFICATE</p>
            <p className="fs-14 mb-3">
              This is to certify that <strong>{row.student}</strong>, admission number{' '}
              <strong>{row.admissionNo}</strong>, is a bonafide student of{' '}
              <strong>{row.className}</strong> in this school for the academic year 2026-2027.
            </p>
            <p className="fs-14 mb-3">
              This certificate is issued on request for the purpose of{' '}
              <strong>{row.purpose.toLowerCase()}</strong>.
            </p>
            <div className="d-flex justify-content-between mt-4">
              <span className="fs-12 text-muted">{row.serial ?? 'Serial pending'}</span>
              <span className="fs-12 text-muted">{row.approvedBy ?? 'Awaiting approval'}</span>
            </div>
          </div>
        ) : null}
      </Modal>

      <Modal
        open={active === 'print'}
        onClose={onClose}
        title="Print Certificate"
        onSubmit={submit(`${print.copies} copy queued for printing.`)}
        footer={<Footer icon="ti ti-printer" label="Print" onClose={onClose} />}
      >
        <div className="row g-3">
          <Field label="Copies">
            <input
              type="text"
              className="form-control"
              value={print.copies}
              onChange={(event) => setPrint('copies')(event.target.value)}
            />
          </Field>
          <Field label="Stock">
            <Select
              value={print.stock}
              onChange={setPrint('stock')}
              options={['School letterhead', 'Plain paper']}
            />
          </Field>
          <Field label="Collection" span="col-12">
            <Select
              value={print.collect}
              onChange={setPrint('collect')}
              options={['Front desk collection', 'Class teacher', 'Post to the address on file']}
            />
          </Field>
        </div>
      </Modal>

      <Modal
        open={active === 'reissue'}
        onClose={onClose}
        title="Reissue Certificate"
        onSubmit={submit('Replacement issued and recorded against the request.')}
        footer={<Footer icon="ti ti-refresh" label="Reissue" onClose={onClose} />}
      >
        {row ? (
          <div className="mb-3">
            <Line label="Request" value={row.id} />
            <Line label="Serial" value={row.serial ?? 'None'} />
            <Line label="Copies already issued" value={row.copies} />
          </div>
        ) : null}
        <div className="row g-3">
          <Field label="Reason" span="col-12">
            <Select
              value={reissue.reason}
              onChange={setReissue('reason')}
              options={[
                'Lost or damaged copy',
                'Printing error',
                'Additional copy requested',
                'Correction to a detail',
              ]}
            />
          </Field>
          <Field label="Copies">
            <input
              type="text"
              className="form-control"
              value={reissue.copies}
              onChange={(event) => setReissue('copies')(event.target.value)}
            />
          </Field>
          <Field label="Issue date">
            <DateField value={reissue.issueOn} onChange={setReissue('issueOn')} />
          </Field>
        </div>
      </Modal>

      <Modal
        open={active === 'view'}
        onClose={onClose}
        title={row ? `${row.id} · ${row.student}` : 'Request'}
        dialogClassName="modal-lg"
        footer={
          <ActionLink className="btn btn-light" onClick={onClose}>
            Close
          </ActionLink>
        }
      >
        {row ? (
          <>
            <div className="d-flex align-items-center justify-content-between mb-3">
              <div>
                <p className="fs-15 fw-medium mb-0">{row.student}</p>
                <p className="fs-12 text-muted mb-0">
                  {row.admissionNo} · {row.className} · {row.house}
                </p>
              </div>
              <span className={`dt-pill ${statePill(stateOf(row))}`}>
                <span className="dt-pill-dot" />
                {stateOf(row)}
              </span>
            </div>
            <Line label="Purpose" value={row.purpose} />
            <Line label="Detail" value={row.purposeNote} />
            <Line label="Requested" value={`${row.requestedOn} · ${agoOf(row.requestedOn)}`} />
            <Line label="Turnaround" value={turnaroundLabelOf(row)} />
            <Line label="Approved" value={row.approvedOn ?? 'Not approved'} />
            <Line label="Approved by" value={row.approvedBy ?? '—'} />
            <Line label="Generated" value={row.generatedOn ?? 'Not generated'} />
            <Line label="Issued" value={row.issuedOn ?? 'Not issued'} />
            <Line label="Serial" value={row.serial ?? '—'} />
            <Line label="Copies" value={row.copies} />
          </>
        ) : null}
      </Modal>

      <Offcanvas
        open={panelOpen}
        onClose={onClosePanel}
        title={row?.id ?? 'Request'}
        titleAccessory={row ? <span className="fs-12 text-muted">{row.student}</span> : undefined}
      >
        {row ? (
          <>
            <h6 className="fs-14 mb-2">Student</h6>
            <Line label="Name" value={row.student} />
            <Line label="Admission number" value={row.admissionNo} />
            <Line label="Class" value={`${row.className} · ${row.section}`} />
            <Line label="House" value={row.house} />

            <h6 className="fs-14 mt-4 mb-2">Request</h6>
            <Line label="Purpose" value={row.purpose} />
            <Line label="Detail" value={row.purposeNote} />
            <Line label="Requested" value={row.requestedOn} />
            <Line label="Turnaround" value={turnaroundLabelOf(row)} />

            <h6 className="fs-14 mt-4 mb-2">Progress</h6>
            <Line label="Approved" value={row.approvedOn ?? 'Not yet'} />
            <Line label="Generated" value={row.generatedOn ?? 'Not yet'} />
            <Line label="Issued" value={row.issuedOn ?? 'Not yet'} />
            <Line label="Status" value={stateNoteOf(row)} />
            <Line label="Issue note" value={issueNoteOf(row)} />
          </>
        ) : null}
      </Offcanvas>
    </>
  );
};

export default BonafideModals;
