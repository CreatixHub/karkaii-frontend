import { useEffect, useMemo, useState } from 'react';
import DateField from '@components/ui/DateField';
import Modal from '@components/ui/Modal';
import ImageWithBasePath from '@core/common/imageWithBasePath';
import type { HostelFee } from '../data/hostelFees.data';
import {
  academicYearOptions,
  chargePairsOf,
  collectedByOptions,
  concessionChoices,
  money,
  openFinesOf,
  paymentMethodOptions,
  placementOf,
  planChoices,
  planHostelOptions,
  planLineOf,
  planTermOptions,
  receiptFormatOptions,
  recordTermOptions,
  roomTypeOptions,
  statusBadge,
  studentLineOf,
  termOf,
} from '../data/hostelFees.data';

export type FeeModalId =
  | 'add-plan' | 'edit-plan' | 'assign-plan' | 'record-payment' | 'receipt' | 'view';

export interface PlanDraft {
  name: string;
  hostel: string;
  roomType: string;
  academicYear: string;
  term: string;
  rent: string;
  mess: string;
  maintenance: string;
  laundry: string;
  deposit: string;
  description: string;
}

export const emptyPlanDraft: PlanDraft = {
  name: '', hostel: planHostelOptions[0], roomType: roomTypeOptions[3],
  academicYear: academicYearOptions[0], term: planTermOptions[0],
  rent: '', mess: '', maintenance: '', laundry: '', deposit: '200.00', description: '',
};

export const planDraftOf = (row: HostelFee): PlanDraft => ({
  name: row.plan,
  hostel: row.hostel ? `${row.hostel} Hostel · ${row.hostel === 'Nightingale' ? 'Girls' : 'Boys'}` : planHostelOptions[0],
  roomType: row.roomType,
  academicYear: row.academicYear,
  term: row.paymentTerm,
  rent: row.breakdown.rent.toFixed(2),
  mess: row.breakdown.mess.toFixed(2),
  maintenance: row.breakdown.maintenance.toFixed(2),
  laundry: row.breakdown.laundry.toFixed(2),
  deposit: row.deposit.toFixed(2),
  description: '',
});

export interface FeeModalsProps {
  active: FeeModalId | null;
  row: HostelFee | null;
  onClose: () => void;
  onCreatePlan: (draft: PlanDraft) => void;
  onUpdatePlan: (draft: PlanDraft) => void;
  onAssignPlan: (plan: string, term: string, concession: string, value: string, due: string, payable: string) => void;
  onRecordPayment: (amount: string, term: string, method: string, date: string) => void;
  onGenerateReceipt: (format: string, sendTo: string) => void;
  onToast: (message: string, variant?: 'success' | 'danger' | 'info' | 'warning') => void;
  /** The View dialog hands off to Record Payment and Generate Receipt. */
  onOpen: (modal: FeeModalId) => void;
}

/* ---------------------------------- Form ----------------------------------- */

interface FormProps {
  draft: PlanDraft;
  onField: (field: keyof PlanDraft, value: string) => void;
  /** Keeps input ids unique between the Add and Edit dialogs. */
  suffix: string;
}

const money2 = (value: string): number => Number(value.replace(/[^0-9.]/g, '')) || 0;

const PlanForm = ({ draft, onField, suffix }: FormProps) => {
  /** The plan total is the four charges; the template let it drift. */
  const total = money2(draft.rent) + money2(draft.mess) + money2(draft.maintenance) + money2(draft.laundry);

  return (
    <div className="row">
      <div className="col-md-12"><div className="mb-3">
        <label className="form-label" htmlFor={`fee-plan-name${suffix}`}>Fee Plan Name</label>
        <input
          type="text" className="form-control" id={`fee-plan-name${suffix}`}
          placeholder="e.g. Standard Four Sharing"
          value={draft.name} onChange={(event) => onField('name', event.target.value)}
        />
      </div></div>
      <div className="col-md-6"><div className="mb-3">
        <label className="form-label" htmlFor={`plan-hostel${suffix}`}>Hostel</label>
        <select
          className="form-select" id={`plan-hostel${suffix}`}
          value={draft.hostel} onChange={(event) => onField('hostel', event.target.value)}
        >
          {planHostelOptions.map((option) => <option key={option}>{option}</option>)}
        </select>
      </div></div>
      <div className="col-md-6"><div className="mb-3">
        <label className="form-label" htmlFor={`plan-room-type${suffix}`}>Room Type</label>
        <select
          className="form-select" id={`plan-room-type${suffix}`}
          value={draft.roomType} onChange={(event) => onField('roomType', event.target.value)}
        >
          {roomTypeOptions.map((option) => <option key={option}>{option}</option>)}
        </select>
      </div></div>
      <div className="col-md-6"><div className="mb-3">
        <label className="form-label" htmlFor={`plan-year${suffix}`}>Academic Year</label>
        <select
          className="form-select" id={`plan-year${suffix}`}
          value={draft.academicYear} onChange={(event) => onField('academicYear', event.target.value)}
        >
          {academicYearOptions.map((option) => <option key={option}>{option}</option>)}
        </select>
      </div></div>
      <div className="col-md-6"><div className="mb-3">
        <label className="form-label" htmlFor={`plan-term${suffix}`}>Payment Term</label>
        <select
          className="form-select" id={`plan-term${suffix}`}
          value={draft.term} onChange={(event) => onField('term', event.target.value)}
        >
          {planTermOptions.map((option) => <option key={option}>{option}</option>)}
        </select>
      </div></div>
      {([
        { key: 'rent', label: 'Room Rent' },
        { key: 'mess', label: 'Mess Charges' },
        { key: 'maintenance', label: 'Maintenance' },
        { key: 'laundry', label: 'Laundry' },
        { key: 'deposit', label: 'Security Deposit' },
      ] as { key: keyof PlanDraft; label: string }[]).map((charge) => (
        <div className="col-md-4" key={charge.key}><div className="mb-3">
          <label className="form-label" htmlFor={`plan-${charge.key}${suffix}`}>{charge.label}</label>
          <div className="input-group">
            <span className="input-group-text">$</span>
            <input
              type="number" className="form-control" id={`plan-${charge.key}${suffix}`} min={0}
              value={draft[charge.key] as string}
              onChange={(event) => onField(charge.key, event.target.value)}
            />
          </div>
        </div></div>
      ))}
      <div className="col-md-4"><div className="mb-3">
        <label className="form-label" htmlFor={`plan-total${suffix}`}>Annual Fee</label>
        <div className="input-group">
          <span className="input-group-text">$</span>
          {/* The four charges added up, not a seventh figure to keep in step. */}
          <input
            type="text" className="form-control" id={`plan-total${suffix}`}
            value={total.toFixed(2)} readOnly
          />
        </div>
      </div></div>
      <div className="col-md-12"><div className="mb-0">
        <label className="form-label" htmlFor={`plan-description${suffix}`}>Description</label>
        <textarea
          className="form-control" rows={2} id={`plan-description${suffix}`}
          placeholder="Shown on the invoice and the fee register"
          value={draft.description} onChange={(event) => onField('description', event.target.value)}
        />
      </div></div>
    </div>
  );
};

/* --------------------------------- Modals ---------------------------------- */

const FeeModals = ({
  active, row, onClose, onCreatePlan, onUpdatePlan, onAssignPlan, onRecordPayment,
  onGenerateReceipt, onToast, onOpen,
}: FeeModalsProps) => {
  const [draft, setDraft] = useState<PlanDraft>(emptyPlanDraft);
  const [plan, setPlan] = useState('');
  const [assignYear, setAssignYear] = useState(academicYearOptions[0]);
  const [assignTerm, setAssignTerm] = useState(planTermOptions[0]);
  const [concession, setConcession] = useState(concessionChoices[0]);
  const [concessionValue, setConcessionValue] = useState('0');
  const [firstDue, setFirstDue] = useState('05-08-2026');
  const [payable, setPayable] = useState('');
  const [amount, setAmount] = useState('');
  const [paymentDate, setPaymentDate] = useState('05-08-2026');
  const [method, setMethod] = useState(paymentMethodOptions[0]);
  const [reference, setReference] = useState('');
  const [term, setTerm] = useState(recordTermOptions[0]);
  const [collectedBy, setCollectedBy] = useState(collectedByOptions[0]);
  const [remarks, setRemarks] = useState('');
  const [format, setFormat] = useState(receiptFormatOptions[0]);
  const [receiptDate, setReceiptDate] = useState('31-07-2026');
  const [sendTo, setSendTo] = useState('');

  /** Each opening seeds from the row being acted on. */
  useEffect(() => {
    if (active === 'add-plan') setDraft(emptyPlanDraft);
    else if (active === 'edit-plan' && row) setDraft(planDraftOf(row));

    if (active === 'assign-plan' && row) {
      setPlan(`${row.plan} · ${money(row.fee)}`);
      setAssignYear(row.academicYear);
      setAssignTerm(row.paymentTerm);
      setConcession(row.concession === 'None' ? concessionChoices[0] : row.concession);
      setConcessionValue('0');
      setFirstDue('05-08-2026');
      setPayable(row.fee.toFixed(2));
    }
    if (active === 'record-payment' && row) {
      setAmount(row.due && row.due > 0 ? row.due.toFixed(2) : (row.fee / 2).toFixed(2));
      setPaymentDate('05-08-2026');
      setMethod(paymentMethodOptions[0]);
      setReference('');
      setTerm(termOf(row) === 'Term I' ? 'Term I' : recordTermOptions[0]);
      setCollectedBy(collectedByOptions[0]);
      setRemarks('');
    }
    if (active === 'receipt' && row) {
      setFormat(receiptFormatOptions[0]);
      setReceiptDate('31-07-2026');
      // The template mails the guardian; the address follows the row's own.
      setSendTo(`${row.guardian.split(' ')[0].toLowerCase()}.${row.guardian.split(' ').pop()?.[0].toLowerCase()}@example.com`);
    }
  }, [active, row]);

  const field = (key: keyof PlanDraft, value: string) =>
    setDraft((current) => ({ ...current, [key]: value }));

  /** The receipt number the template prints, built from the row's invoice. */
  const receiptNo = useMemo(
    () => (row ? `RCP-${row.invoice.replace(/^INV-/, '') || '2026-0318'}` : 'RCP-2026-0318'),
    [row],
  );

  return (
    <>
      {/* Add Hostel Fee Plan */}
      <Modal
        open={active === 'add-plan'}
        onClose={onClose}
        title="Add Hostel Fee Plan"
        dialogClassName="modal-lg"
        onSubmit={(event) => { event.preventDefault(); onCreatePlan(draft); }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Add Fee Plan</button>
          </>
        }
      >
        <PlanForm draft={draft} onField={field} suffix="" />
      </Modal>

      {/* Edit Fee Plan */}
      <Modal
        open={active === 'edit-plan' && row !== null}
        onClose={onClose}
        title="Edit Fee Plan"
        dialogClassName="modal-lg"
        onSubmit={(event) => { event.preventDefault(); onUpdatePlan(draft); }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Save Changes</button>
          </>
        }
      >
        <PlanForm draft={draft} onField={field} suffix="-2" />
      </Modal>

      {/* Assign Fee Plan */}
      <Modal
        open={active === 'assign-plan' && row !== null}
        onClose={onClose}
        title="Assign Fee Plan"
        onSubmit={(event) => {
          event.preventDefault();
          onAssignPlan(plan, assignTerm, concession, concessionValue, firstDue, payable);
        }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Assign Fee Plan</button>
          </>
        }
      >
        {row ? (
          <>
            <div className="border rounded p-3 mb-3">
              <div className="d-flex align-items-center">
                <span className="avatar avatar-md rounded flex-shrink-0">
                  <ImageWithBasePath src={row.avatar} className="rounded" alt={row.student} />
                </span>
                <div className="ms-2">
                  <h5 className="fs-14 mb-0">{row.student}</h5>
                  <span className="fs-12 text-muted">{placementOf(row)}</span>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-12"><div className="mb-3">
                <label className="form-label" htmlFor="fee-plan-2">Fee Plan</label>
                <select
                  className="form-select" id="fee-plan-2"
                  value={plan} onChange={(event) => setPlan(event.target.value)}
                >
                  {planChoices.map((option) => <option key={option}>{option}</option>)}
                </select>
              </div></div>
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="academic-year-4">Academic Year</label>
                <select
                  className="form-select" id="academic-year-4"
                  value={assignYear} onChange={(event) => setAssignYear(event.target.value)}
                >
                  {academicYearOptions.map((option) => <option key={option}>{option}</option>)}
                </select>
              </div></div>
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="payment-term-4">Payment Term</label>
                <select
                  className="form-select" id="payment-term-4"
                  value={assignTerm} onChange={(event) => setAssignTerm(event.target.value)}
                >
                  {planTermOptions.map((option) => <option key={option}>{option}</option>)}
                </select>
              </div></div>
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="concession-2">Concession</label>
                <select
                  className="form-select" id="concession-2"
                  value={concession} onChange={(event) => setConcession(event.target.value)}
                >
                  {concessionChoices.map((option) => <option key={option}>{option}</option>)}
                </select>
              </div></div>
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="concession-value">Concession Value</label>
                <div className="input-group">
                  <span className="input-group-text">%</span>
                  <input
                    type="number" className="form-control" id="concession-value" min={0} max={100}
                    value={concessionValue} onChange={(event) => setConcessionValue(event.target.value)}
                  />
                </div>
              </div></div>
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="first-due-date">First Due Date</label>
                <DateField id="first-due-date" value={firstDue} onChange={setFirstDue} />
              </div></div>
              <div className="col-md-6"><div className="mb-0">
                <label className="form-label" htmlFor="payable-amount">Payable Amount</label>
                <div className="input-group">
                  <span className="input-group-text">$</span>
                  <input
                    type="number" className="form-control" id="payable-amount" min={0}
                    value={payable} onChange={(event) => setPayable(event.target.value)}
                  />
                </div>
              </div></div>
            </div>
          </>
        ) : null}
      </Modal>

      {/* Record Payment */}
      <Modal
        open={active === 'record-payment' && row !== null}
        onClose={onClose}
        title="Record Payment"
        onSubmit={(event) => {
          event.preventDefault();
          onRecordPayment(amount, term, method, paymentDate);
        }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Record Payment</button>
          </>
        }
      >
        {row ? (
          <>
            <div className="border rounded p-3 mb-3">
              <div className="d-flex align-items-center">
                <span className="avatar avatar-md rounded flex-shrink-0">
                  <ImageWithBasePath src={row.avatar} className="rounded" alt={row.student} />
                </span>
                <div className="ms-2">
                  <h5 className="fs-14 mb-0">{row.student}</h5>
                  <span className="fs-12 text-muted">{row.invoice} · {row.plan}</span>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="amount">Amount</label>
                <div className="input-group">
                  <span className="input-group-text">$</span>
                  <input
                    type="number" className="form-control" id="amount" min={0}
                    value={amount} onChange={(event) => setAmount(event.target.value)}
                  />
                </div>
              </div></div>
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="payment-date">Payment Date</label>
                <DateField id="payment-date" value={paymentDate} onChange={setPaymentDate} />
              </div></div>
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="payment-method">Payment Method</label>
                <select
                  className="form-select" id="payment-method"
                  value={method} onChange={(event) => setMethod(event.target.value)}
                >
                  {paymentMethodOptions.map((option) => <option key={option}>{option}</option>)}
                </select>
              </div></div>
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="reference-no">Reference No.</label>
                <input
                  type="text" className="form-control" id="reference-no"
                  placeholder="Transaction or cheque number"
                  value={reference} onChange={(event) => setReference(event.target.value)}
                />
              </div></div>
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="payment-term-5">Payment Term</label>
                <select
                  className="form-select" id="payment-term-5"
                  value={term} onChange={(event) => setTerm(event.target.value)}
                >
                  {recordTermOptions.map((option) => <option key={option}>{option}</option>)}
                </select>
              </div></div>
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="collected-by">Collected By</label>
                <select
                  className="form-select" id="collected-by"
                  value={collectedBy} onChange={(event) => setCollectedBy(event.target.value)}
                >
                  {collectedByOptions.map((option) => <option key={option}>{option}</option>)}
                </select>
              </div></div>
              <div className="col-md-12"><div className="mb-0">
                <label className="form-label" htmlFor="remarks">Remarks</label>
                <textarea
                  className="form-control" rows={2} id="remarks"
                  placeholder="Recorded against the payment history"
                  value={remarks} onChange={(event) => setRemarks(event.target.value)}
                />
              </div></div>
            </div>
          </>
        ) : null}
      </Modal>

      {/* Generate Receipt */}
      <Modal
        open={active === 'receipt' && row !== null}
        onClose={onClose}
        title="Generate Receipt"
        onSubmit={(event) => { event.preventDefault(); onGenerateReceipt(format, sendTo); }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">
              <i className="ti ti-receipt me-1" />Generate Receipt
            </button>
          </>
        }
      >
        {row ? (
          <>
            <div className="border rounded p-3 mb-3">
              <div className="d-flex align-items-center">
                <span className="avatar avatar-md bg-primary-transparent text-primary rounded flex-shrink-0">
                  <i className="ti ti-receipt" />
                </span>
                <div className="ms-2">
                  <h5 className="fs-14 mb-0">{receiptNo}</h5>
                  <span className="fs-12 text-muted">{row.student} · {row.admission}</span>
                </div>
                <span className={`${statusBadge[row.status]} ms-auto`}>{row.status}</span>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="receipt-format">Receipt Format</label>
                <select
                  className="form-select" id="receipt-format"
                  value={format} onChange={(event) => setFormat(event.target.value)}
                >
                  {receiptFormatOptions.map((option) => <option key={option}>{option}</option>)}
                </select>
              </div></div>
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="receipt-date">Receipt Date</label>
                <DateField id="receipt-date" value={receiptDate} onChange={setReceiptDate} />
              </div></div>
              <div className="col-md-12"><div className="mb-0">
                <label className="form-label" htmlFor="send-to">Send To</label>
                <input
                  type="email" className="form-control" id="send-to"
                  value={sendTo} onChange={(event) => setSendTo(event.target.value)}
                />
              </div></div>
            </div>
          </>
        ) : null}
      </Modal>

      {/* View Fee Details */}
      <Modal
        open={active === 'view' && row !== null}
        onClose={onClose}
        title={row?.invoice ?? 'Fee Details'}
        dialogClassName="modal-lg"
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={() => onOpen('receipt')}>
              <i className="ti ti-receipt me-1" />Generate Receipt
            </button>
            <button type="button" className="btn btn-primary" onClick={() => onOpen('record-payment')}>
              <i className="ti ti-cash me-1" />Record Payment
            </button>
          </>
        }
      >
        {row ? (
          <>
            <p className="mb-3 fs-12 text-muted">{planLineOf(row)}</p>
            <div className="d-flex align-items-center flex-wrap gap-2 mb-3">
              <span className="avatar avatar-lg rounded flex-shrink-0">
                <ImageWithBasePath src={row.avatar} className="rounded" alt={row.student} />
              </span>
              <div>
                <h5 className="mb-0 fs-15">{row.student}</h5>
                <span className="fs-12 text-muted">{studentLineOf(row)}</span>
              </div>
              <span className={`${statusBadge[row.status]} ms-auto`}>{row.status}</span>
            </div>

            <h6 className="fs-13 mb-2">Charge Breakdown</h6>
            <div className="border rounded p-3 mb-3">
              {chargePairsOf(row).map((pair) => (
                <div className="d-flex align-items-center justify-content-between mb-2" key={pair.label}>
                  <span className="fs-13 text-muted">{pair.label}</span>
                  <span className="fs-13 fw-medium">{pair.value}</span>
                </div>
              ))}
              <div className="d-flex align-items-center justify-content-between mb-0 pt-2 border-top">
                <span className="fs-13 text-muted">Annual Total</span>
                <span className="fs-13 fw-semibold">{money(row.fee)}</span>
              </div>
            </div>

            <h6 className="fs-13 mb-2">Payment Schedule</h6>
            <div className="border rounded p-3 mb-3">
              {row.payments.length === 0 ? (
                <p className="fs-13 text-muted mb-2">{row.paymentsEmpty}</p>
              ) : (
                row.payments.map((entry) => (
                  <div className="d-flex align-items-center justify-content-between mb-2" key={entry.title}>
                    <span className="fs-13 text-muted">{entry.title}</span>
                    <span
                      className={`badge badge-soft-${
                        /refund/i.test(entry.meta) ? 'info'
                          : /overdue/i.test(entry.meta) ? 'danger'
                            : /paid/i.test(entry.meta) ? 'success' : 'warning'
                      }`}
                    >
                      {entry.meta}
                    </span>
                  </div>
                ))
              )}
              <div className="d-flex align-items-center justify-content-between mb-0">
                <span className="fs-13 text-muted">Security Deposit</span>
                <span className="fs-13 fw-medium">{money(row.deposit)} held</span>
              </div>
            </div>

            <h6 className="fs-13 mb-2">Fines &amp; Adjustments</h6>
            {row.fines.length === 0 ? (
              <p className="fs-13 text-muted mb-0">{row.finesEmpty}</p>
            ) : (
              row.fines.map((fine) => (
                <div className="d-flex align-items-center gap-2 border rounded p-2 mb-2" key={fine.title}>
                  <span className="avatar avatar-sm bg-danger-transparent text-danger rounded flex-shrink-0">
                    <i className="ti ti-alert-triangle" />
                  </span>
                  <div className="flex-fill overflow-hidden">
                    <h6 className="fs-13 mb-0">{fine.title}</h6>
                    <span className="fs-12 text-muted">{fine.meta}</span>
                  </div>
                  <span className="fs-13 fw-medium">{money(openFinesOf(row))}</span>
                </div>
              ))
            )}

            <button
              type="button" className="btn btn-link p-0 fs-12 mt-2"
              onClick={() => onToast(`Fee statement printed for ${row.student}`, 'info')}
            >
              Print the statement
            </button>
          </>
        ) : null}
      </Modal>
    </>
  );
};

export default FeeModals;
