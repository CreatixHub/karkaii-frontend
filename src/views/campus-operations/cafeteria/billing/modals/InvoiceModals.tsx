import { useEffect, useState } from 'react';
import DateField from '@components/ui/DateField';
import Modal from '@components/ui/Modal';
import ImageWithBasePath from '@core/common/imageWithBasePath';
import type { Invoice } from '../data/invoices.data';
import {
  balanceOf,
  billingPeriodOptions,
  breakdownPairsOf,
  collectedByOptions,
  compactOf,
  customerChoices,
  customerTypeOptions,
  discountOptions,
  generateStatusOptions,
  lineLabelOf,
  lineSummaryOf,
  money,
  netOf,
  paidOf,
  paperSizeOptions,
  paymentMethodOptions,
  receiptPairsOf,
  sourceOptions,
  statusBadge,
  taxOf,
  taxableOf,
  totalOf,
} from '../data/invoices.data';

export type InvoiceModalId = 'generate' | 'edit' | 'payment' | 'print' | 'email' | 'view';

export interface InvoiceDraft {
  customer: string;
  customerType: string;
  period: string;
  billingDate: string;
  dueDate: string;
  source: string;
  orders: string;
  lineItems: string;
  discountType: string;
  discount: string;
  taxRate: string;
  total: string;
  method: string;
  status: string;
  notes: string;
  email: boolean;
  ledger: boolean;
}

export const emptyDraft: InvoiceDraft = {
  customer: '', customerType: customerTypeOptions[0], period: billingPeriodOptions[0],
  billingDate: '31-07-2026', dueDate: '05-08-2026', source: sourceOptions[0], orders: '24',
  lineItems: '4', discountType: discountOptions[0], discount: '0.00', taxRate: '5', total: '0.00',
  method: paymentMethodOptions[0], status: generateStatusOptions[0], notes: '',
  email: true, ledger: true,
};

export const draftOf = (row: Invoice): InvoiceDraft => ({
  customer: customerChoices.find((choice) => choice.startsWith(row.customer)) ?? '',
  customerType: row.customerType,
  period: billingPeriodOptions[0],
  billingDate: '31-07-2026',
  dueDate: '05-08-2026',
  source: sourceOptions[0],
  orders: String(row.lines.reduce((total, line) => total + line.qty, 0)),
  lineItems: String(row.lines.length),
  discountType: row.discount === 0 ? 'No discount'
    : /staff/i.test(row.discountType) ? 'Staff subsidy'
      : /concession/i.test(row.discountType) ? 'Need-based concession' : 'Meal plan credit',
  discount: row.discount.toFixed(2),
  taxRate: String(row.taxRate),
  total: totalOf(row).toFixed(2),
  method: paymentMethodOptions.find((option) => row.method.startsWith(option)) ?? paymentMethodOptions[0],
  status: row.status,
  notes: row.notes,
  email: true,
  ledger: true,
});

export interface InvoiceModalsProps {
  active: InvoiceModalId | null;
  row: Invoice | null;
  onClose: () => void;
  onGenerate: (draft: InvoiceDraft) => void;
  onUpdate: (draft: InvoiceDraft) => void;
  onRecordPayment: (amount: string, date: string, reference: string, collectedBy: string) => void;
  onPrint: (size: string, copies: string) => void;
  onEmail: (to: string, subject: string) => void;
  onToast: (message: string, variant?: 'success' | 'danger' | 'info' | 'warning') => void;
  /** The View dialog hands off to Print and to the offcanvas. */
  onOpen: (modal: InvoiceModalId) => void;
  onOpenPanel: () => void;
}

/** The label/value line the dialogs share. */
const Row = ({ label, value, last = false }: { label: string; value: string; last?: boolean }) => (
  <div className={`d-flex align-items-center justify-content-between ${last ? 'mb-0' : 'mb-2'}`}>
    <span className="fs-13 text-muted">{label}</span>
    <span className="fs-13 fw-medium text-end">{value}</span>
  </div>
);

/* ---------------------------------- Form ----------------------------------- */

interface FormProps {
  draft: InvoiceDraft;
  onField: (field: keyof InvoiceDraft, value: string | boolean) => void;
  suffix: string;
}

const InvoiceForm = ({ draft, onField, suffix }: FormProps) => {
  /** The chain the grid prints: total → taxable → tax → net. */
  const total = Number(draft.total) || 0;
  const discount = Number(draft.discount) || 0;
  const taxable = Math.max(0, total - discount);
  const tax = taxable * ((Number(draft.taxRate) || 0) / 100);

  return (
    <div className="row">
      <div className="col-md-6"><div className="mb-3">
        <label className="form-label" htmlFor={`inv-customer${suffix}`}>Customer</label>
        <select
          className="form-select" id={`inv-customer${suffix}`}
          value={draft.customer} onChange={(event) => onField('customer', event.target.value)}
        >
          <option value="">Select customer</option>
          {customerChoices.map((option) => <option key={option}>{option}</option>)}
        </select>
      </div></div>
      <div className="col-md-6"><div className="mb-3">
        <label className="form-label" htmlFor={`inv-type${suffix}`}>Customer Type</label>
        <select
          className="form-select" id={`inv-type${suffix}`}
          value={draft.customerType} onChange={(event) => onField('customerType', event.target.value)}
        >
          {customerTypeOptions.map((option) => <option key={option}>{option}</option>)}
        </select>
      </div></div>
      <div className="col-md-4"><div className="mb-3">
        <label className="form-label" htmlFor={`inv-period${suffix}`}>Billing Period</label>
        <select
          className="form-select" id={`inv-period${suffix}`}
          value={draft.period} onChange={(event) => onField('period', event.target.value)}
        >
          {billingPeriodOptions.map((option) => <option key={option}>{option}</option>)}
        </select>
      </div></div>
      <div className="col-md-4"><div className="mb-3">
        <label className="form-label" htmlFor={`inv-date${suffix}`}>Billing Date</label>
        <DateField
          id={`inv-date${suffix}`} value={draft.billingDate}
          onChange={(value) => onField('billingDate', value)}
        />
      </div></div>
      <div className="col-md-4"><div className="mb-3">
        <label className="form-label" htmlFor={`inv-due${suffix}`}>Due Date</label>
        <DateField
          id={`inv-due${suffix}`} value={draft.dueDate}
          onChange={(value) => onField('dueDate', value)}
        />
      </div></div>
      <div className="col-md-4"><div className="mb-3">
        <label className="form-label" htmlFor={`inv-source${suffix}`}>Source</label>
        <select
          className="form-select" id={`inv-source${suffix}`}
          value={draft.source} onChange={(event) => onField('source', event.target.value)}
        >
          {sourceOptions.map((option) => <option key={option}>{option}</option>)}
        </select>
      </div></div>
      <div className="col-md-4"><div className="mb-3">
        <label className="form-label" htmlFor={`inv-orders${suffix}`}>Orders Included</label>
        <input
          type="number" className="form-control" id={`inv-orders${suffix}`} min={0}
          value={draft.orders} onChange={(event) => onField('orders', event.target.value)}
        />
      </div></div>
      <div className="col-md-4"><div className="mb-3">
        <label className="form-label" htmlFor={`inv-lines${suffix}`}>Line Items</label>
        <input
          type="number" className="form-control" id={`inv-lines${suffix}`} min={0}
          value={draft.lineItems} onChange={(event) => onField('lineItems', event.target.value)}
        />
      </div></div>
      <div className="col-md-4"><div className="mb-3">
        <label className="form-label" htmlFor={`inv-total${suffix}`}>Total Amount</label>
        <div className="input-group">
          <span className="input-group-text">$</span>
          <input
            type="number" className="form-control" id={`inv-total${suffix}`} min={0} step="0.01"
            value={draft.total} onChange={(event) => onField('total', event.target.value)}
          />
        </div>
      </div></div>
      <div className="col-md-4"><div className="mb-3">
        <label className="form-label" htmlFor={`inv-discount-type${suffix}`}>Discount Type</label>
        <select
          className="form-select" id={`inv-discount-type${suffix}`}
          value={draft.discountType} onChange={(event) => onField('discountType', event.target.value)}
        >
          {discountOptions.map((option) => <option key={option}>{option}</option>)}
        </select>
      </div></div>
      <div className="col-md-4"><div className="mb-3">
        <label className="form-label" htmlFor={`inv-discount${suffix}`}>Discount Amount</label>
        <div className="input-group">
          <span className="input-group-text">−$</span>
          <input
            type="number" className="form-control" id={`inv-discount${suffix}`} min={0} step="0.01"
            value={draft.discount} onChange={(event) => onField('discount', event.target.value)}
          />
        </div>
      </div></div>
      <div className="col-md-4"><div className="mb-3">
        <label className="form-label" htmlFor={`inv-rate${suffix}`}>Tax Rate</label>
        <div className="input-group">
          <input
            type="number" className="form-control" id={`inv-rate${suffix}`} min={0} max={100}
            value={draft.taxRate} onChange={(event) => onField('taxRate', event.target.value)}
          />
          <span className="input-group-text">%</span>
        </div>
      </div></div>
      <div className="col-md-4"><div className="mb-3">
        <label className="form-label" htmlFor={`inv-taxable${suffix}`}>Taxable Amount</label>
        <div className="input-group">
          <span className="input-group-text">$</span>
          {/* Total less discount — not a figure of its own. */}
          <input type="text" className="form-control" id={`inv-taxable${suffix}`} value={taxable.toFixed(2)} readOnly />
        </div>
      </div></div>
      <div className="col-md-4"><div className="mb-3">
        <label className="form-label" htmlFor={`inv-tax${suffix}`}>Tax Charged</label>
        <div className="input-group">
          <span className="input-group-text">$</span>
          <input type="text" className="form-control" id={`inv-tax${suffix}`} value={tax.toFixed(2)} readOnly />
        </div>
      </div></div>
      <div className="col-md-4"><div className="mb-3">
        <label className="form-label" htmlFor={`inv-net${suffix}`}>Net Amount</label>
        <div className="input-group">
          <span className="input-group-text">$</span>
          <input type="text" className="form-control" id={`inv-net${suffix}`} value={(taxable + tax).toFixed(2)} readOnly />
        </div>
      </div></div>
      <div className="col-md-6"><div className="mb-3">
        <label className="form-label" htmlFor={`inv-method${suffix}`}>Payment Method</label>
        <select
          className="form-select" id={`inv-method${suffix}`}
          value={draft.method} onChange={(event) => onField('method', event.target.value)}
        >
          {paymentMethodOptions.map((option) => <option key={option}>{option}</option>)}
        </select>
      </div></div>
      <div className="col-md-6"><div className="mb-3">
        <label className="form-label" htmlFor={`inv-status${suffix}`}>Payment Status</label>
        <select
          className="form-select" id={`inv-status${suffix}`}
          value={draft.status} onChange={(event) => onField('status', event.target.value)}
        >
          {generateStatusOptions.map((option) => <option key={option}>{option}</option>)}
        </select>
      </div></div>
      <div className="col-md-12"><div className="mb-3">
        <label className="form-label" htmlFor={`inv-notes${suffix}`}>Internal Notes</label>
        <textarea
          className="form-control" rows={2} id={`inv-notes${suffix}`}
          placeholder="Visible to the accounts office"
          value={draft.notes} onChange={(event) => onField('notes', event.target.value)}
        />
      </div></div>
      <div className="col-md-12">
        <div className="form-check form-switch mb-2">
          <input
            className="form-check-input" type="checkbox" role="switch" id={`giEmail${suffix}`}
            checked={draft.email} onChange={(event) => onField('email', event.target.checked)}
          />
          <label className="form-check-label fs-13" htmlFor={`giEmail${suffix}`}>
            Email the invoice to the guardian on generation
          </label>
        </div>
        <div className="form-check form-switch mb-0">
          <input
            className="form-check-input" type="checkbox" role="switch" id={`giLedger${suffix}`}
            checked={draft.ledger} onChange={(event) => onField('ledger', event.target.checked)}
          />
          <label className="form-check-label fs-13" htmlFor={`giLedger${suffix}`}>
            Post the invoice to the accounts ledger
          </label>
        </div>
      </div>
    </div>
  );
};

/* --------------------------------- Modals ---------------------------------- */

const InvoiceModals = ({
  active, row, onClose, onGenerate, onUpdate, onRecordPayment, onPrint, onEmail,
  onToast, onOpen, onOpenPanel,
}: InvoiceModalsProps) => {
  const [draft, setDraft] = useState<InvoiceDraft>(emptyDraft);
  const [amount, setAmount] = useState('0.00');
  const [paymentDate, setPaymentDate] = useState('31-07-2026');
  const [reference, setReference] = useState('');
  const [collectedBy, setCollectedBy] = useState(collectedByOptions[0]);
  const [remarks, setRemarks] = useState('');
  const [issueReceipt, setIssueReceipt] = useState(true);
  const [notifyGuardian, setNotifyGuardian] = useState(true);

  const [paperSize, setPaperSize] = useState(paperSizeOptions[0]);
  const [copies, setCopies] = useState('1');
  const [withItems, setWithItems] = useState(true);
  const [withTax, setWithTax] = useState(true);
  const [withSignature, setWithSignature] = useState(false);

  const [to, setTo] = useState('');
  const [cc, setCc] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [attachPdf, setAttachPdf] = useState(true);
  const [payLink, setPayLink] = useState(true);

  /** Each opening seeds from the row being acted on, or a blank sheet. */
  useEffect(() => {
    if (active === 'generate') setDraft(emptyDraft);
    else if (active === 'edit' && row) setDraft(draftOf(row));

    if (active === 'payment' && row) {
      // What is still owing, which is nothing on a settled or waived invoice.
      setAmount(balanceOf(row).toFixed(2));
      setPaymentDate('31-07-2026');
      setReference('');
      setCollectedBy(collectedByOptions[0]);
      setRemarks('');
    }
    if (active === 'print') {
      setPaperSize(paperSizeOptions[0]);
      setCopies('1');
    }
    if (active === 'email' && row) {
      setTo(`${row.customer.split(' ')[0].toLowerCase()}@example.com`);
      setCc('');
      setSubject(`Cafeteria invoice ${row.id} for ${row.period}`);
      setMessage('');
    }
  }, [active, row]);

  const field = (key: keyof InvoiceDraft, value: string | boolean) =>
    setDraft((current) => ({ ...current, [key]: value }));

  return (
    <>
      {/* Generate Invoice */}
      <Modal
        open={active === 'generate'}
        onClose={onClose}
        title="Generate Invoice"
        dialogClassName="modal-lg"
        onSubmit={(event) => { event.preventDefault(); onGenerate(draft); }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Generate Invoice</button>
          </>
        }
      >
        <InvoiceForm draft={draft} onField={field} suffix="" />
      </Modal>

      {/* Edit Invoice */}
      <Modal
        open={active === 'edit' && row !== null}
        onClose={onClose}
        title="Edit Invoice"
        dialogClassName="modal-lg"
        onSubmit={(event) => { event.preventDefault(); onUpdate(draft); }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Save Changes</button>
          </>
        }
      >
        <InvoiceForm draft={draft} onField={field} suffix="-2" />
      </Modal>

      {/* Record Payment */}
      <Modal
        open={active === 'payment' && row !== null}
        onClose={onClose}
        title="Record Payment"
        onSubmit={(event) => {
          event.preventDefault();
          onRecordPayment(amount, paymentDate, reference, collectedBy);
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
            <div className="d-flex align-items-center gap-2 border rounded p-2 mb-3">
              <span className="avatar avatar-md rounded flex-shrink-0">
                <ImageWithBasePath src={row.avatar} className="rounded" alt={row.customer} />
              </span>
              <div className="flex-fill overflow-hidden">
                <h5 className="fs-14 mb-0">{row.customer}</h5>
                <span className="fs-12 text-muted">{compactOf(row)}</span>
              </div>
              <span className={statusBadge[row.status]}>{row.status}</span>
            </div>

            <div className="border rounded p-3 mb-3">
              <Row label="Net Amount" value={money(netOf(row))} />
              <Row label="Already Settled" value={money(paidOf(row))} />
              <Row label="Balance" value={money(balanceOf(row))} last />
            </div>

            {balanceOf(row) === 0 ? (
              <div className="alert alert-light border d-flex align-items-center gap-2 mb-3">
                <i className="ti ti-info-circle fs-16" />
                <span className="fs-13">
                  Nothing is outstanding on this invoice — it is {row.status.toLowerCase()}.
                </span>
              </div>
            ) : null}

            <div className="row">
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="payment-amount">Amount</label>
                <div className="input-group">
                  <span className="input-group-text">$</span>
                  <input
                    type="number" className="form-control" id="payment-amount" min={0} step="0.01"
                    value={amount} onChange={(event) => setAmount(event.target.value)}
                  />
                </div>
              </div></div>
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="payment-date">Payment Date</label>
                <DateField id="payment-date" value={paymentDate} onChange={setPaymentDate} />
              </div></div>
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="reference-no">Reference No.</label>
                <input
                  type="text" className="form-control" id="reference-no"
                  placeholder="Transaction reference"
                  value={reference} onChange={(event) => setReference(event.target.value)}
                />
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
              <div className="col-md-12"><div className="mb-3">
                <label className="form-label" htmlFor="payment-remarks">Remarks</label>
                <textarea
                  className="form-control" rows={2} id="payment-remarks"
                  placeholder="Recorded against the invoice"
                  value={remarks} onChange={(event) => setRemarks(event.target.value)}
                />
              </div></div>
              <div className="col-md-12">
                <div className="form-check form-switch mb-2">
                  <input
                    className="form-check-input" type="checkbox" role="switch" id="rpReceipt"
                    checked={issueReceipt} onChange={(event) => setIssueReceipt(event.target.checked)}
                  />
                  <label className="form-check-label fs-13" htmlFor="rpReceipt">
                    Issue the final receipt on settlement
                  </label>
                </div>
                <div className="form-check form-switch mb-0">
                  <input
                    className="form-check-input" type="checkbox" role="switch" id="rpNotify"
                    checked={notifyGuardian} onChange={(event) => setNotifyGuardian(event.target.checked)}
                  />
                  <label className="form-check-label fs-13" htmlFor="rpNotify">
                    Email the receipt to the guardian
                  </label>
                </div>
              </div>
            </div>
          </>
        ) : null}
      </Modal>

      {/* Print Invoice */}
      <Modal
        open={active === 'print' && row !== null}
        onClose={onClose}
        title="Print Invoice"
        onSubmit={(event) => { event.preventDefault(); onPrint(paperSize, copies); }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">
              <i className="ti ti-printer me-1" />Print Invoice
            </button>
          </>
        }
      >
        {row ? (
          <>
            <div className="d-flex align-items-center gap-2 border rounded p-2 mb-3">
              <span className="avatar avatar-md bg-primary-transparent text-primary rounded flex-shrink-0">
                <i className="ti ti-file-invoice" />
              </span>
              <div className="flex-fill overflow-hidden">
                <h5 className="fs-14 mb-0">{row.id}</h5>
                <span className="fs-12 text-muted">{row.customer} · {row.period}</span>
              </div>
              <span className={statusBadge[row.status]}>{row.status}</span>
            </div>
            <div className="row">
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="paper-size">Paper Size</label>
                <select
                  className="form-select" id="paper-size"
                  value={paperSize} onChange={(event) => setPaperSize(event.target.value)}
                >
                  {paperSizeOptions.map((option) => <option key={option}>{option}</option>)}
                </select>
              </div></div>
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="copies">Copies</label>
                <input
                  type="number" className="form-control" id="copies" min={1}
                  value={copies} onChange={(event) => setCopies(event.target.value)}
                />
              </div></div>
              <div className="col-md-12">
                <div className="form-check form-switch mb-2">
                  <input
                    className="form-check-input" type="checkbox" role="switch" id="piItems"
                    checked={withItems} onChange={(event) => setWithItems(event.target.checked)}
                  />
                  <label className="form-check-label fs-13" htmlFor="piItems">
                    Include the itemised order breakdown
                  </label>
                </div>
                <div className="form-check form-switch mb-2">
                  <input
                    className="form-check-input" type="checkbox" role="switch" id="piTax"
                    checked={withTax} onChange={(event) => setWithTax(event.target.checked)}
                  />
                  <label className="form-check-label fs-13" htmlFor="piTax">
                    Show the tax summary and tax code
                  </label>
                </div>
                <div className="form-check form-switch mb-0">
                  <input
                    className="form-check-input" type="checkbox" role="switch" id="piSign"
                    checked={withSignature} onChange={(event) => setWithSignature(event.target.checked)}
                  />
                  <label className="form-check-label fs-13" htmlFor="piSign">
                    Add the digital signature of the accounts officer
                  </label>
                </div>
              </div>
            </div>
          </>
        ) : null}
      </Modal>

      {/* Email Invoice */}
      <Modal
        open={active === 'email' && row !== null}
        onClose={onClose}
        title="Email Invoice"
        onSubmit={(event) => { event.preventDefault(); onEmail(to, subject); }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">
              <i className="ti ti-mail me-1" />Send Invoice
            </button>
          </>
        }
      >
        {row ? (
          <>
            <div className="d-flex align-items-center gap-2 border rounded p-2 mb-3">
              <span className="avatar avatar-md bg-warning-transparent text-warning rounded flex-shrink-0">
                <i className="ti ti-mail" />
              </span>
              <div className="flex-fill overflow-hidden">
                <h5 className="fs-14 mb-0">{row.customer}</h5>
                <span className="fs-12 text-muted">
                  {row.id} · {money(balanceOf(row))} due {row.dueDate}
                </span>
              </div>
              <span className={statusBadge[row.status]}>{row.status}</span>
            </div>
            <div className="row">
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="email-to">To</label>
                <input
                  type="email" className="form-control" id="email-to"
                  value={to} onChange={(event) => setTo(event.target.value)}
                />
              </div></div>
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="email-cc">Cc</label>
                <input
                  type="email" className="form-control" id="email-cc" placeholder="Optional"
                  value={cc} onChange={(event) => setCc(event.target.value)}
                />
              </div></div>
              <div className="col-md-12"><div className="mb-3">
                <label className="form-label" htmlFor="email-subject">Subject</label>
                <input
                  type="text" className="form-control" id="email-subject"
                  value={subject} onChange={(event) => setSubject(event.target.value)}
                />
              </div></div>
              <div className="col-md-12"><div className="mb-3">
                <label className="form-label" htmlFor="email-message">Message</label>
                <textarea
                  className="form-control" rows={3} id="email-message"
                  placeholder="Shown above the invoice summary"
                  value={message} onChange={(event) => setMessage(event.target.value)}
                />
              </div></div>
              <div className="col-md-12">
                <div className="form-check form-switch mb-2">
                  <input
                    className="form-check-input" type="checkbox" role="switch" id="emPdf"
                    checked={attachPdf} onChange={(event) => setAttachPdf(event.target.checked)}
                  />
                  <label className="form-check-label fs-13" htmlFor="emPdf">
                    Attach the invoice as a PDF
                  </label>
                </div>
                <div className="form-check form-switch mb-0">
                  <input
                    className="form-check-input" type="checkbox" role="switch" id="emLink"
                    checked={payLink} onChange={(event) => setPayLink(event.target.checked)}
                  />
                  <label className="form-check-label fs-13" htmlFor="emLink">
                    Include a secure payment link
                  </label>
                </div>
              </div>
            </div>
          </>
        ) : null}
      </Modal>

      {/* View Invoice */}
      <Modal
        open={active === 'view' && row !== null}
        onClose={onClose}
        title={row?.id ?? 'Invoice'}
        dialogClassName="modal-lg"
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={() => onOpen('print')}>
              <i className="ti ti-printer me-1" />Print
            </button>
            <button type="button" className="btn btn-primary" onClick={onOpenPanel}>
              <i className="ti ti-file-invoice me-1" />Open Billing Panel
            </button>
          </>
        }
      >
        {row ? (
          <>
            <p className="mb-3 fs-12 text-muted">
              {row.customer}  •  {row.period}  •  {lineSummaryOf(row)}
            </p>

            <div className="row g-3 mb-3">
              {[
                { label: 'Total', value: money(totalOf(row)) },
                { label: 'Discount', value: `−${money(row.discount)}` },
                { label: `Tax @ ${row.taxRate}%`, value: money(taxOf(row)) },
                { label: 'Net', value: money(netOf(row)) },
              ].map((tile) => (
                <div className="col-md-3" key={tile.label}>
                  <div className="border rounded p-3">
                    <span className="fs-12 text-muted d-block">{tile.label}</span>
                    <h6 className="fs-14 mb-0 text-truncate">{tile.value}</h6>
                  </div>
                </div>
              ))}
            </div>

            <h6 className="fs-13 mb-2">Billed Items</h6>
            {row.lines.map((line) => (
              <div className="d-flex align-items-center gap-2 border rounded p-2 mb-2" key={line.name}>
                <span className="avatar avatar-sm bg-primary-transparent text-primary rounded flex-shrink-0">
                  <i className="ti ti-tools-kitchen-2" />
                </span>
                <div className="flex-fill overflow-hidden">
                  <h6 className="fs-13 mb-0 text-truncate">{line.name}</h6>
                  <span className="fs-12 text-muted">{lineLabelOf(line)}</span>
                </div>
                <span className="fs-13 fw-medium">{money(line.qty * line.price)}</span>
              </div>
            ))}

            <h6 className="fs-13 mb-2 mt-3">Billing Summary</h6>
            <div className="border rounded p-3 mb-3">
              {breakdownPairsOf(row).map((pair, index, all) => (
                <Row key={pair.label} label={pair.label} value={pair.value} last={index === all.length - 1} />
              ))}
            </div>

            <h6 className="fs-13 mb-2">Payment History</h6>
            {row.payments.length === 0 ? (
              <p className="fs-13 text-muted mb-3">{row.paymentsEmpty}</p>
            ) : (
              row.payments.map((payment) => (
                <div className="d-flex align-items-center gap-2 border rounded p-2 mb-2" key={payment.meta}>
                  <span className="avatar avatar-sm bg-success-transparent text-success rounded flex-shrink-0">
                    <i className="ti ti-cash" />
                  </span>
                  <div className="flex-fill overflow-hidden">
                    <h6 className="fs-13 mb-0 text-truncate">{payment.title}</h6>
                    <span className="fs-12 text-muted">{payment.meta}</span>
                  </div>
                </div>
              ))
            )}

            <div className="border rounded p-3 mt-3">
              {receiptPairsOf(row).map((pair, index, all) => (
                <Row key={pair.label} label={pair.label} value={pair.value} last={index === all.length - 1} />
              ))}
            </div>

            <button
              type="button" className="btn btn-link p-0 fs-12 mt-2"
              onClick={() => onToast(`${row.id} · ${money(taxableOf(row))} taxable statement printed`, 'info')}
            >
              Print the tax statement
            </button>
          </>
        ) : null}
      </Modal>
    </>
  );
};

export default InvoiceModals;
