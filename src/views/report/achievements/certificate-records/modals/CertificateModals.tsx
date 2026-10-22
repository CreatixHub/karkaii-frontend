import { useEffect, useState } from 'react';
import Modal from '@components/ui/Modal';
import Offcanvas from '@components/ui/Offcanvas';
import DateField from '@components/ui/DateField';
import { ActionLink } from '@components/workspace';
import type { Certificate } from '../data/certificates.data';
import {
  checksLabelOf,
  holderOptions,
  ISSUE_ON,
  issuedAgoOf,
  issuerOptions,
  statusOf,
  statusPill,
  typeOf,
  typeOptions,
  validToOf,
  verificationOf,
  VERIFICATION_CHECKS,
} from '../data/certificates.data';

export type CertificateModalId =
  | 'generate'
  | 'edit'
  | 'approve'
  | 'verify'
  | 'reissue'
  | 'print'
  | 'view';

export interface CertificateModalsProps {
  active: CertificateModalId | null;
  onClose: () => void;
  row: Certificate | null;
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

const CertificateModals = ({
  active,
  onClose,
  row,
  panelOpen,
  onClosePanel,
  onToast,
}: CertificateModalsProps) => {
  const submit = (message: string) => (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onToast(message, 'success');
    onClose();
  };

  const [form, setForm] = useForm(
    {
      holder: row?.holder ?? '',
      holderType: row?.holderType ?? holderOptions[0],
      type: row ? typeOf(row.typeId).name : typeOptions[0],
      reason: row?.reason ?? '',
      issuedBy: row?.issuedBy ?? issuerOptions[0],
      issueOn: row?.issuedOn ?? ISSUE_ON,
    },
    active === 'generate' || active === 'edit',
  );

  const [approve, setApprove] = useForm(
    {
      decision: 'Approve and issue',
      issuedBy: row?.issuedBy ?? issuerOptions[0],
      issueOn: ISSUE_ON,
      note: '',
    },
    active === 'approve',
  );

  const [reissue, setReissue] = useForm(
    {
      reason: 'Correction to a printed detail',
      supersede: 'Supersede the original',
      issueOn: ISSUE_ON,
      notify: 'Notify the holder',
    },
    active === 'reissue',
  );

  const [print, setPrint] = useForm(
    {
      copies: '1',
      stock: 'School letterhead',
      collect: 'Front desk collection',
      log: 'Record the print on the certificate',
    },
    active === 'print',
  );

  return (
    <>
      <Modal
        open={active === 'generate' || active === 'edit'}
        onClose={onClose}
        title={active === 'edit' ? 'Edit Certificate' : 'Generate Certificate'}
        dialogClassName="modal-lg"
        onSubmit={submit(
          active === 'edit'
            ? 'Certificate updated. It still needs approval before it can be issued.'
            : 'Certificate drafted. It waits for approval before it is issued.',
        )}
        footer={
          <Footer
            icon={active === 'edit' ? 'ti ti-check' : 'ti ti-certificate'}
            label={active === 'edit' ? 'Save changes' : 'Generate draft'}
            onClose={onClose}
          />
        }
      >
        <div className="row g-3">
          <Field label="Holder" span="col-12">
            <input
              type="text"
              className="form-control"
              value={form.holder}
              onChange={(event) => setForm('holder')(event.target.value)}
              placeholder="Student or staff name"
            />
          </Field>
          <Field label="Holder type">
            <Select
              value={form.holderType}
              onChange={setForm('holderType')}
              options={holderOptions}
            />
          </Field>
          <Field label="Certificate type">
            <Select value={form.type} onChange={setForm('type')} options={typeOptions} />
          </Field>
          <Field label="Reason" span="col-12">
            <textarea
              rows={2}
              className="form-control"
              value={form.reason}
              onChange={(event) => setForm('reason')(event.target.value)}
              placeholder="What the certificate is for"
            />
          </Field>
          <Field label="Issued by">
            <Select value={form.issuedBy} onChange={setForm('issuedBy')} options={issuerOptions} />
          </Field>
          <Field label="Issue date">
            <DateField value={form.issueOn} onChange={setForm('issueOn')} />
          </Field>
        </div>
        <p className="fs-12 text-muted mb-0 mt-3">
          <i className="ti ti-info-circle me-1" />
          Generating creates a draft. Nothing is printed or made downloadable until it is approved.
        </p>
      </Modal>

      <Modal
        open={active === 'approve'}
        onClose={onClose}
        title="Approve Certificate"
        onSubmit={submit(`${approve.decision} — recorded against ${approve.issuedBy}.`)}
        footer={<Footer icon="ti ti-check" label="Record decision" onClose={onClose} />}
      >
        {row ? (
          <div className="mb-3">
            <Line label="Certificate" value={row.id} />
            <Line label="Holder" value={`${row.holder} · ${row.holderClass}`} />
            <Line label="Type" value={typeOf(row.typeId).name} />
            <Line label="Verification" value={checksLabelOf(row)} />
          </div>
        ) : null}
        <div className="row g-3">
          <Field label="Decision" span="col-12">
            <Select
              value={approve.decision}
              onChange={setApprove('decision')}
              options={['Approve and issue', 'Approve without issuing', 'Return for correction']}
            />
          </Field>
          <Field label="Issued by">
            <Select
              value={approve.issuedBy}
              onChange={setApprove('issuedBy')}
              options={issuerOptions}
            />
          </Field>
          <Field label="Issue date">
            <DateField value={approve.issueOn} onChange={setApprove('issueOn')} />
          </Field>
          <Field label="Note" span="col-12">
            <textarea
              rows={2}
              className="form-control"
              value={approve.note}
              onChange={(event) => setApprove('note')(event.target.value)}
              placeholder="Recorded against the certificate"
            />
          </Field>
        </div>
      </Modal>

      <Modal
        open={active === 'verify'}
        onClose={onClose}
        title="Verify Certificate"
        onSubmit={submit('Verification checks re-run.')}
        footer={<Footer icon="ti ti-shield-check" label="Re-run checks" onClose={onClose} />}
      >
        {row ? (
          <>
            <div className="mb-3">
              <Line label="Certificate" value={row.id} />
              <Line label="Holder" value={row.holder} />
              <Line label="Last checked" value={row.checkedOn ?? 'Never'} />
            </div>
            <h6 className="fs-14 mb-2">Checks</h6>
            {VERIFICATION_CHECKS.map((check, index) => (
              <Line
                key={check}
                label={check}
                value={
                  index < row.checksPassed ? (
                    <span className="badge badge-soft-success">Passed</span>
                  ) : (
                    <span className="badge badge-soft-warning">Not passed</span>
                  )
                }
              />
            ))}
            <p className="fs-12 text-muted mb-0 mt-3">
              <i className="ti ti-info-circle me-1" />A certificate reads Verified only when every
              check passes.
            </p>
          </>
        ) : null}
      </Modal>

      <Modal
        open={active === 'reissue'}
        onClose={onClose}
        title="Reissue Certificate"
        onSubmit={submit('Certificate reissued. The original has been superseded.')}
        footer={<Footer icon="ti ti-refresh" label="Reissue" onClose={onClose} />}
      >
        {row ? (
          <div className="mb-3">
            <Line label="Original" value={row.id} />
            <Line label="Issued" value={row.issuedOn ?? 'Not yet issued'} />
            <Line label="Downloads and prints" value={`${row.downloads} · ${row.prints}`} />
          </div>
        ) : null}
        <div className="row g-3">
          <Field label="Reason" span="col-12">
            <Select
              value={reissue.reason}
              onChange={setReissue('reason')}
              options={[
                'Correction to a printed detail',
                'Lost or damaged copy',
                'Change of holder name',
                'Administrative reissue',
              ]}
            />
          </Field>
          <Field label="Original record">
            <Select
              value={reissue.supersede}
              onChange={setReissue('supersede')}
              options={['Supersede the original', 'Revoke the original', 'Keep both live']}
            />
          </Field>
          <Field label="Issue date">
            <DateField value={reissue.issueOn} onChange={setReissue('issueOn')} />
          </Field>
          <Field label="Notify" span="col-12">
            <Select
              value={reissue.notify}
              onChange={setReissue('notify')}
              options={['Notify the holder', 'Notify holder and guardian', 'Do not notify']}
            />
          </Field>
        </div>
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
              options={['School letterhead', 'Certificate stock', 'Plain paper']}
            />
          </Field>
          <Field label="Collection">
            <Select
              value={print.collect}
              onChange={setPrint('collect')}
              options={['Front desk collection', 'Class teacher', 'Post to the address on file']}
            />
          </Field>
          <Field label="Record">
            <Select
              value={print.log}
              onChange={setPrint('log')}
              options={['Record the print on the certificate', 'Do not record']}
            />
          </Field>
        </div>
      </Modal>

      <Modal
        open={active === 'view'}
        onClose={onClose}
        title={row ? `${row.id} · ${row.holder}` : 'Certificate'}
        dialogClassName="modal-lg"
        footer={
          <ActionLink className="btn btn-light" onClick={onClose}>
            Close
          </ActionLink>
        }
      >
        {row ? (
          <>
            <div className="d-flex align-items-center gap-3 mb-3">
              <span
                className={`avatar avatar-lg bg-${typeOf(row.typeId).tint}-transparent text-${typeOf(row.typeId).tint} rounded`}
              >
                <i className={typeOf(row.typeId).icon} />
              </span>
              <div>
                <p className="fs-15 fw-medium mb-0">{typeOf(row.typeId).name}</p>
                <p className="fs-12 text-muted mb-0">{row.reason}</p>
              </div>
              <span className={`dt-pill ${statusPill(statusOf(row))} ms-auto`}>
                <span className="dt-pill-dot" />
                {statusOf(row)}
              </span>
            </div>
            <Line label="Holder" value={`${row.holder} · ${row.holderRef}`} />
            <Line label="Class or role" value={row.holderClass} />
            <Line label="Issued" value={row.issuedOn ?? 'Not yet issued'} />
            <Line label="Issued by" value={row.issuedBy ?? '—'} />
            <Line label="Valid to" value={validToOf(row) ?? 'No expiry'} />
            <Line label="Verification" value={`${verificationOf(row).label} · ${checksLabelOf(row)}`} />
            <Line label="Downloads" value={row.downloads} />
            <Line label="Prints" value={row.prints} />
          </>
        ) : null}
      </Modal>

      <Offcanvas
        open={panelOpen}
        onClose={onClosePanel}
        title={row ? `${row.id}` : 'Certificate'}
        titleAccessory={row ? <span className="fs-12 text-muted">{row.holder}</span> : undefined}
      >
        {row ? (
          <>
            <h6 className="fs-14 mb-2">Record</h6>
            <Line label="Type" value={typeOf(row.typeId).name} />
            <Line label="Reason" value={row.reason} />
            <Line label="Holder" value={`${row.holder} · ${row.holderRef}`} />
            <Line label="Class or role" value={row.holderClass} />

            <h6 className="fs-14 mt-4 mb-2">Issue</h6>
            <Line label="Issued" value={row.issuedOn ?? 'Not yet issued'} />
            <Line label="How long ago" value={issuedAgoOf(row)} />
            <Line label="Valid to" value={validToOf(row) ?? 'No expiry'} />
            <Line label="Issued by" value={row.issuedBy ?? '—'} />

            <h6 className="fs-14 mt-4 mb-2">Verification</h6>
            {VERIFICATION_CHECKS.map((check, index) => (
              <Line
                key={check}
                label={check}
                value={index < row.checksPassed ? 'Passed' : 'Not passed'}
              />
            ))}

            <h6 className="fs-14 mt-4 mb-2">Use</h6>
            <Line label="Downloads" value={row.downloads} />
            <Line label="Prints" value={row.prints} />
          </>
        ) : null}
      </Offcanvas>
    </>
  );
};

export default CertificateModals;
