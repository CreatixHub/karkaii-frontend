import { useEffect, useMemo, useRef, useState, type CSSProperties, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import ImageWithBasePath from '@core/common/imageWithBasePath';
import Modal from '@components/ui/Modal';
import ToastStack from '@components/ui/ToastStack';
import { ActionLink } from '@components/workspace';
import { all_routes } from '@/routes/all_routes';
import { useToasts } from '@hooks/useToasts';
import type { InvoiceDetail, Payment } from './data/invoiceDetails.data';
import {
  amountPaidOf,
  collectedPercentOf,
  grandTotalOf,
  invoiceDetail as initialInvoice,
  lineTotal,
  methodOptions,
  money,
  offlineModeOptions,
  pendingOf,
  quickActions,
  sectionTotalOf,
  subtotalOf,
  totalDiscountOf,
  totalTaxOf,
} from './data/invoiceDetails.data';

const routes = all_routes;

/** Every dialog the template ships, by the id it gives it. */
type InvoiceDialog =
  | 'collect'
  | 'record'
  | 'receipt'
  | 'reminder'
  | 'email'
  | 'payment_details'
  | 'receipt_preview'
  | 'print'
  | null;

/** The bars carry their fill as a width, the way the template's script sets it. */
const fill = (percent: number): CSSProperties => ({ width: `${percent}%` });

/** The little icon tint the attachment list gives each kind of file. */
const fileTone = (icon: string) =>
  icon.includes('pdf') ? 'is-pdf' : icon.includes('photo') ? 'is-img' : 'is-doc';

const InvoiceDetails = () => {
  const { toasts, push, dismiss } = useToasts();

  const [invoice, setInvoice] = useState<InvoiceDetail>(initialInvoice);
  /** The template also ships an empty state for an invoice that is not there. */
  const [missing, setMissing] = useState(false);
  const [dialog, setDialog] = useState<InvoiceDialog>(null);
  const [moreOpen, setMoreOpen] = useState(false);
  const [inspected, setInspected] = useState<Payment | null>(null);

  const moreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!moreOpen) return;
    const handlePointerDown = (event: MouseEvent) => {
      if (!moreRef.current?.contains(event.target as Node)) setMoreOpen(false);
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMoreOpen(false);
    };
    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [moreOpen]);

  const totals = useMemo(
    () => ({
      subtotal: subtotalOf(invoice),
      discount: totalDiscountOf(invoice),
      tax: totalTaxOf(invoice),
      section: sectionTotalOf(invoice),
      grand: grandTotalOf(invoice),
      paid: amountPaidOf(invoice),
      pending: pendingOf(invoice),
      collected: collectedPercentOf(invoice),
    }),
    [invoice],
  );

  /* ------------------------------- Payments ------------------------------- */

  const [collect, setCollect] = useState({
    amount: '',
    method: methodOptions[0],
    date: '',
    reference: '',
    remarks: '',
  });
  const [record, setRecord] = useState({
    amount: '',
    mode: offlineModeOptions[0],
    date: '',
    reference: '',
    collectedBy: invoice.collector,
    remarks: '',
  });

  useEffect(() => {
    if (dialog === 'collect') {
      setCollect({
        amount: String(totals.pending),
        method: methodOptions[0],
        date: '',
        reference: '',
        remarks: '',
      });
    }
    if (dialog === 'record') {
      setRecord({
        amount: '',
        mode: offlineModeOptions[0],
        date: '',
        reference: '',
        collectedBy: invoice.collector,
        remarks: '',
      });
    }
  }, [dialog, totals.pending, invoice.collector]);

  /** A payment recorded here joins the register, and every total follows it. */
  const addPayment = (payment: Omit<Payment, 'receiptNo'>) => {
    const next = invoice.payments.length + 1;
    setInvoice((current) => ({
      ...current,
      payments: [
        {
          receiptNo: `RCPT-${5521 + next}`,
          ...payment,
        },
        ...current.payments,
      ],
    }));
  };

  const submitCollect = (event: FormEvent) => {
    event.preventDefault();
    const amount = Number(collect.amount) || 0;
    addPayment({
      date: collect.date || invoice.lastUpdated.split(',')[0],
      amount,
      method: collect.method,
      transactionId: collect.reference || '—',
      collectedBy: invoice.collector,
      remarks: collect.remarks || 'Collected online',
    });
    push(`${money(amount)} collected`);
    setDialog(null);
  };

  const submitRecord = (event: FormEvent) => {
    event.preventDefault();
    const amount = Number(record.amount) || 0;
    addPayment({
      date: record.date || invoice.lastUpdated.split(',')[0],
      amount,
      method: record.mode,
      transactionId: record.reference || '—',
      collectedBy: record.collectedBy,
      remarks: record.remarks || 'Recorded offline',
    });
    push(`${money(amount)} recorded`);
    setDialog(null);
  };

  /* -------------------------------- Actions ------------------------------- */

  /** What each quick action does, keyed by the id the template gives it. */
  const runAction = (id: string) => {
    const asDialog: Record<string, InvoiceDialog> = {
      generate_receipt: 'receipt',
      collect_payment: 'collect',
      record_payment: 'record',
      print_invoice: 'print',
      email_invoice: 'email',
      send_reminder: 'reminder',
    };
    if (asDialog[id]) {
      setDialog(asDialog[id]);
      return;
    }
    if (id === 'share_invoice') push('Share link copied');
    if (id === 'duplicate') push(`${invoice.invoiceNo} duplicated as a draft`);
  };

  if (missing) {
    return (
      <div className="page-wrapper">
        <div className="content content-two">
          <div id="invoiceWorkspace">
          <div className="iv-empty">
            <span className="iv-empty-ic mb-3">
              <i className="ti ti-file-invoice" />
            </span>
            <h4 className="mb-1 fs-16 fw-medium">No Invoice Data Available</h4>
            <p className="text-muted mb-3">
              This invoice could not be found or has been removed. Head back to the billing center
              to pick another invoice.
            </p>
            <Link to={routes.invoice} className="btn btn-primary">
              <i className="ti ti-arrow-left me-1" />
              Back to Invoices
            </Link>
          </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="page-wrapper">
        <div className="content content-two">
          {/* Page Header */}
          <div className="d-md-flex d-block align-items-center justify-content-between flex-wrap gap-2 mb-3">
            <div className="my-auto mb-2">
              <h3 className="page-title mb-1">Invoice</h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={routes.adminDashboard}>Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <Link to={routes.invoice}>Finance &amp; Accounts</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    View Invoice
                  </li>
                </ol>
              </nav>
            </div>
          </div>
          {/* /Page Header */}

          <div id="invoiceWorkspace">
          {/* Sticky action bar */}
          <div className="iv-actionbar card mb-3">
            <div className="card-body py-2 px-3 d-flex flex-wrap align-items-center justify-content-between gap-2 w-100">
              <div className="d-flex align-items-center gap-3">
                <Link
                  to={routes.invoice}
                  className="btn btn-outline-light bg-white btn-icon"
                  aria-label="Back to invoices"
                  title="Back to invoices"
                >
                  <i className="ti ti-arrow-left" />
                </Link>
                <div>
                  <div className="d-flex align-items-center gap-2">
                    <span className="iv-ab-title">{invoice.invoiceNo}</span>
                    <span className="badge badge-soft-warning d-inline-flex align-items-center">
                      <i className="ti ti-clock-hour-4 me-1" />
                      {invoice.status}
                    </span>
                  </div>
                  <span className="iv-ab-sub">
                    Grand total {money(totals.grand)} · {money(totals.pending)} pending
                  </span>
                </div>
              </div>

              <div className="iv-ab-actions">
                <button
                  type="button"
                  className="btn btn-outline-light bg-white btn-icon"
                  aria-label="Refresh"
                  title="Refresh"
                  onClick={() => {
                    setInvoice(initialInvoice);
                    push('Invoice reloaded');
                  }}
                >
                  <i className="ti ti-refresh" />
                </button>
                <button
                  type="button"
                  className="btn btn-outline-light bg-white"
                  onClick={() => setDialog('print')}
                >
                  <i className="ti ti-printer me-1" />
                  Print
                </button>
                <button
                  type="button"
                  className="btn btn-outline-light bg-white"
                  onClick={() => push(`${invoice.invoiceNo}.pdf downloaded`)}
                >
                  <i className="ti ti-download me-1" />
                  Download
                </button>
                <div className="dropdown" ref={moreRef}>
                  <button
                    type="button"
                    className="btn btn-outline-light bg-white"
                    aria-expanded={moreOpen}
                    onClick={() => setMoreOpen((current) => !current)}
                  >
                    <i className="ti ti-dots-vertical me-1" />
                    More
                  </button>
                  <ul className={`dropdown-menu dropdown-menu-end${moreOpen ? ' show' : ''}`}>
                    <li>
                      <Link className="dropdown-item" to={routes.addInvoice}>
                        <i className="ti ti-edit me-2" />
                        Edit Invoice
                      </Link>
                    </li>
                    <li>
                      <ActionLink
                        className="dropdown-item"
                        onClick={() => {
                          setMoreOpen(false);
                          runAction('duplicate');
                        }}
                      >
                        <i className="ti ti-copy me-2" />
                        Duplicate
                      </ActionLink>
                    </li>
                    <li>
                      <ActionLink
                        className="dropdown-item"
                        onClick={() => {
                          setMoreOpen(false);
                          runAction('share_invoice');
                        }}
                      >
                        <i className="ti ti-share me-2" />
                        Share Link
                      </ActionLink>
                    </li>
                    <li>
                      <ActionLink
                        className="dropdown-item"
                        onClick={() => {
                          setMoreOpen(false);
                          setDialog('record');
                        }}
                      >
                        <i className="ti ti-arrow-back-up me-2" />
                        Refund Payment
                      </ActionLink>
                    </li>
                    <li>
                      <hr className="dropdown-divider" />
                    </li>
                    <li>
                      <ActionLink
                        className="dropdown-item text-danger"
                        onClick={() => {
                          setMoreOpen(false);
                          setMissing(true);
                        }}
                      >
                        <i className="ti ti-archive me-2" />
                        Archive
                      </ActionLink>
                    </li>
                  </ul>
                </div>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => setDialog('collect')}
                >
                  <i className="ti ti-cash me-1" />
                  Collect Payment
                </button>
              </div>
            </div>
          </div>
          {/* /Sticky action bar */}

          {/* Live workspace */}
          <div className="iv-live">
            {/* Invoice hero */}
            <div className="iv-hero mb-3">
              <div className="iv-hero-glow" aria-hidden="true" />
              <div className="iv-hero-grid">
                <div className="iv-hero-left">
                  <div className="iv-hero-brand">
                    <span className="iv-hero-logo">
                      <i className="ti ti-building-bank" />
                    </span>
                    <div>
                      <span className="iv-hero-eyebrow">
                        {invoice.organisation} · {invoice.documentType}
                      </span>
                      <div className="iv-hero-no">{invoice.invoiceNo}</div>
                    </div>
                    <span className="iv-hero-status">{invoice.status}</span>
                  </div>

                  <div className="iv-hero-meta">
                    {[
                      { icon: 'ti ti-calendar-plus', label: 'Invoice Date', value: invoice.invoiceDate },
                      { icon: 'ti ti-calendar-due', label: 'Due Date', value: invoice.dueDate, tone: 'text-danger' },
                      { icon: 'ti ti-school', label: 'Academic Year', value: invoice.academicYear },
                      { icon: 'ti ti-user-edit', label: 'Created By', value: invoice.createdBy },
                      { icon: 'ti ti-clock-edit', label: 'Last Updated', value: invoice.lastUpdated },
                    ].map((entry) => (
                      <div className="iv-hero-mi" key={entry.label}>
                        <span className="iv-hero-mi-label">
                          <i className={entry.icon} />
                          {entry.label}
                        </span>
                        <span className={`iv-hero-mi-val${entry.tone ? ` ${entry.tone}` : ''}`}>
                          {entry.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="iv-hero-due">
                  <span className="iv-hero-due-label">Amount Due</span>
                  <span className="iv-hero-due-val">{money(totals.pending)}</span>
                  <div className="iv-hero-due-bar">
                    <span className="iv-hero-due-fill" style={fill(totals.collected)} />
                  </div>
                  <span className="iv-hero-due-sub">
                    {money(totals.paid)} paid of {money(totals.grand)} · {totals.collected}%
                  </span>
                  <div className="iv-hero-due-actions">
                    <button
                      type="button"
                      className="btn btn-light btn-sm flex-fill"
                      onClick={() => push(`${invoice.invoiceNo}.pdf downloaded`)}
                    >
                      <i className="ti ti-download me-1" />
                      PDF
                    </button>
                    <button
                      type="button"
                      className="btn btn-white btn-sm flex-fill"
                      onClick={() => setDialog('collect')}
                    >
                      <i className="ti ti-cash me-1" />
                      Pay Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
            {/* /Invoice hero */}

            <div className="row g-3">
              {/* Left column */}
              <div className="col-12 col-xl-8">
                {/* Invoice information */}
                <div className="card iv-card mb-3">
                  <div className="card-body">
                    <div className="iv-cardhead">
                      <span className="iv-cardhead-ic">
                        <i className="ti ti-info-circle" />
                      </span>
                      <div>
                        <div className="iv-cardhead-title">Invoice Information</div>
                        <div className="iv-cardhead-sub">Billing period &amp; reference details</div>
                      </div>
                    </div>
                    <div className="row g-3">
                      {[
                        ['Billing Term', invoice.billingTerm],
                        ['Reference No', invoice.referenceNo],
                        ['Payment Terms', invoice.paymentTerms],
                        ['Currency', invoice.currency],
                        ['Fee Group', invoice.feeGroup],
                        ['Collector', invoice.collector],
                        ['Branch', invoice.branch],
                        ['Tax No', invoice.taxNo],
                      ].map(([label, value]) => (
                        <div className="col-sm-6 col-md-3" key={label}>
                          <div className="iv-info-item">
                            <span className="iv-info-label">{label}</span>
                            <span className="iv-info-val">{value}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Fee breakdown */}
                <div className="card iv-card mb-3">
                  <div className="card-body">
                    <div className="iv-cardhead">
                      <span className="iv-cardhead-ic">
                        <i className="ti ti-list-details" />
                      </span>
                      <div>
                        <div className="iv-cardhead-title">Fee Breakdown</div>
                        <div className="iv-cardhead-sub">
                          Itemised charges for this billing period
                        </div>
                      </div>
                    </div>
                    <div className="table-responsive">
                      <table className="table iv-fee-table align-middle mb-0">
                        <thead>
                          <tr>
                            <th>Fee Category</th>
                            <th>Description</th>
                            <th className="text-center">Qty</th>
                            <th className="text-end">Amount</th>
                            <th className="text-end">Discount</th>
                            <th className="text-end">Tax</th>
                            <th className="text-end">Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {invoice.lines.map((line) => (
                            <tr key={line.category}>
                              <td>
                                <span className="iv-fee-cat">{line.category}</span>
                              </td>
                              <td>
                                <span className="iv-fee-desc">{line.description}</span>
                              </td>
                              <td className="text-center">{line.qty}</td>
                              <td className="text-end">{money(line.amount)}</td>
                              <td className="text-end text-success">-{money(line.discount)}</td>
                              <td className="text-end">{money(line.tax)}</td>
                              <td className="text-end fw-semibold">{money(lineTotal(line))}</td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot>
                          <tr>
                            <td colSpan={3} className="text-end text-muted">
                              Section Totals
                            </td>
                            <td className="text-end">{money(totals.subtotal)}</td>
                            <td className="text-end text-success">-{money(totals.discount)}</td>
                            <td className="text-end">{money(totals.tax)}</td>
                            <td className="text-end">{money(totals.section)}</td>
                          </tr>
                          <tr>
                            <td colSpan={6} className="text-end fw-semibold">
                              Grand Total
                            </td>
                            <td className="text-end fw-bold text-primary">{money(totals.grand)}</td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Payment timeline */}
                <div className="card iv-card mb-3">
                  <div className="card-body">
                    <div className="iv-cardhead">
                      <span className="iv-cardhead-ic">
                        <i className="ti ti-timeline-event" />
                      </span>
                      <div>
                        <div className="iv-cardhead-title">Payment Timeline</div>
                        <div className="iv-cardhead-sub">Progress from generation to receipt</div>
                      </div>
                    </div>
                    <ul className="iv-tl">
                      {invoice.timeline.map((step) => (
                        <li className={`iv-tl-step${step.done ? ' is-done' : ''}`} key={step.title}>
                          <span className="iv-tl-ic">
                            <i className={step.icon} />
                          </span>
                          <div className="iv-tl-body">
                            <div className="iv-tl-title">{step.title}</div>
                            <div className="iv-tl-meta">{step.meta}</div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Payment history */}
                <div className="card iv-card mb-3">
                  <div className="card-body">
                    <div className="iv-cardhead">
                      <span className="iv-cardhead-ic">
                        <i className="ti ti-receipt" />
                      </span>
                      <div>
                        <div className="iv-cardhead-title">Payment History</div>
                        <div className="iv-cardhead-sub">Collected payments against this invoice</div>
                      </div>
                    </div>
                    <div className="table-responsive">
                      <table className="table iv-fee-table align-middle mb-0">
                        <thead>
                          <tr>
                            <th>Receipt No</th>
                            <th>Payment Date</th>
                            <th className="text-end">Amount</th>
                            <th>Method</th>
                            <th>Transaction ID</th>
                            <th>Collected By</th>
                            <th>Remarks</th>
                          </tr>
                        </thead>
                        <tbody>
                          {invoice.payments.map((payment) => (
                            <tr key={payment.receiptNo}>
                              <td>
                                <ActionLink
                                  className="iv-fee-cat"
                                  onClick={() => {
                                    setInspected(payment);
                                    setDialog('payment_details');
                                  }}
                                >
                                  {payment.receiptNo}
                                </ActionLink>
                              </td>
                              <td>{payment.date}</td>
                              <td className="text-end fw-semibold">{money(payment.amount)}</td>
                              <td>{payment.method}</td>
                              <td>{payment.transactionId}</td>
                              <td>{payment.collectedBy}</td>
                              <td>{payment.remarks}</td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot>
                          <tr>
                            <td colSpan={2} className="text-end text-muted">
                              Total Collected
                            </td>
                            <td className="text-end fw-bold text-success">{money(totals.paid)}</td>
                            <td colSpan={4} />
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Attachments */}
                <div className="card iv-card mb-3">
                  <div className="card-body">
                    <div className="iv-cardhead">
                      <span className="iv-cardhead-ic">
                        <i className="ti ti-paperclip" />
                      </span>
                      <div>
                        <div className="iv-cardhead-title">Attachments</div>
                        <div className="iv-cardhead-sub">Receipts &amp; documents</div>
                      </div>
                    </div>
                    <div className="d-flex flex-column gap-2">
                      {invoice.attachments.map((file) => (
                        <div className="iv-file" key={file.name}>
                          <span className={`iv-file-ic ${fileTone(file.icon)}`}>
                            <i className={file.icon} />
                          </span>
                          <div className="flex-fill">
                            <div className="iv-file-name">{file.name}</div>
                            <div className="iv-file-meta">{file.meta}</div>
                          </div>
                          <div className="d-flex gap-1">
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-light bg-white btn-icon"
                              aria-label={`Preview ${file.name}`}
                              title="Preview"
                              onClick={() => setDialog('receipt_preview')}
                            >
                              <i className="ti ti-eye" />
                            </button>
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-light bg-white btn-icon"
                              aria-label={`Download ${file.name}`}
                              title="Download"
                              onClick={() => push(`${file.name} downloaded`)}
                            >
                              <i className="ti ti-download" />
                            </button>
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-light bg-white btn-icon"
                              aria-label={`Print ${file.name}`}
                              title="Print"
                              onClick={() => window.print()}
                            >
                              <i className="ti ti-printer" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Activity timeline */}
                <div className="card iv-card mb-3 mb-xl-0">
                  <div className="card-body">
                    <div className="iv-cardhead">
                      <span className="iv-cardhead-ic">
                        <i className="ti ti-history" />
                      </span>
                      <div>
                        <div className="iv-cardhead-title">Activity Timeline</div>
                        <div className="iv-cardhead-sub">Full audit trail for this invoice</div>
                      </div>
                    </div>
                    <ul className="iv-tl">
                      {invoice.activity.map((entry) => (
                        <li className="iv-tl-step is-done" key={entry.title}>
                          <span className="iv-tl-ic">
                            <i className="ti ti-point" />
                          </span>
                          <div className="iv-tl-body">
                            <div className="iv-tl-title">{entry.title}</div>
                            <div className="iv-tl-meta">{entry.meta}</div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
              {/* /Left column */}

              {/* Right column */}
              <div className="col-12 col-xl-4">
                <div className="iv-detail-sticky">
                {/* Student profile */}
                <div className="card iv-card mb-3">
                  <div className="card-body">
                    <div className="iv-cardhead">
                      <span className="iv-cardhead-ic">
                        <i className="ti ti-user" />
                      </span>
                      <div>
                        <div className="iv-cardhead-title">Student</div>
                        <div className="iv-cardhead-sub">Billed to</div>
                      </div>
                    </div>
                    <div className="iv-profile mb-3">
                      <span className="avatar avatar-lg rounded">
                        <ImageWithBasePath
                          src="assets/img/profiles/avatar-01.jpg"
                          alt={invoice.student}
                        />
                      </span>
                      <div>
                        <h5 className="mb-0 fs-15">{invoice.student}</h5>
                        <span className="text-muted fs-12">
                          Admission No · {invoice.admissionNo}
                        </span>
                      </div>
                    </div>
                    <div className="iv-profile-info">
                      <div className="iv-info-item">
                        <span className="iv-info-label">Class</span>
                        <span className="iv-info-val">{invoice.className}</span>
                      </div>
                      <div className="iv-info-item">
                        <span className="iv-info-label">Section</span>
                        <span className="iv-info-val">{invoice.section}</span>
                      </div>
                      <div className="iv-info-item">
                        <span className="iv-info-label">Parent / Guardian</span>
                        <span className="iv-info-val">{invoice.guardian}</span>
                      </div>
                      <div className="iv-info-item">
                        <span className="iv-info-label">Contact</span>
                        <span className="iv-info-val">{invoice.contact}</span>
                      </div>
                      <div className="iv-info-item iv-info-full">
                        <span className="iv-info-label">Email</span>
                        <span className="iv-info-val">{invoice.email}</span>
                      </div>
                    </div>
                    <div className="d-flex gap-2 mt-3">
                      <Link
                        to={routes.studentDetail}
                        className="btn btn-outline-light bg-white btn-sm flex-fill"
                      >
                        <i className="ti ti-id me-1" />
                        Profile
                      </Link>
                      <button
                        type="button"
                        className="btn btn-outline-light bg-white btn-sm flex-fill"
                        onClick={() => setDialog('reminder')}
                      >
                        <i className="ti ti-bell me-1" />
                        Remind
                      </button>
                    </div>
                  </div>
                </div>

                {/* Financial summary */}
                <div className="card iv-card mb-3">
                  <div className="card-body">
                    <div className="iv-cardhead">
                      <span className="iv-cardhead-ic">
                        <i className="ti ti-calculator" />
                      </span>
                      <div>
                        <div className="iv-cardhead-title">Financial Summary</div>
                        <div className="iv-cardhead-sub">Billing totals</div>
                      </div>
                    </div>
                    <ul className="iv-sum mb-3">
                      <li className="iv-sum-row">
                        <span className="iv-sum-label">Total Amount</span>
                        <span className="iv-sum-val">{money(totals.subtotal)}</span>
                      </li>
                      <li className="iv-sum-row is-minus">
                        <span className="iv-sum-label">Discount</span>
                        <span className="iv-sum-val">-{money(totals.discount)}</span>
                      </li>
                      <li className="iv-sum-row is-minus">
                        <span className="iv-sum-label">Scholarship</span>
                        <span className="iv-sum-val">-{money(invoice.scholarship)}</span>
                      </li>
                      <li className="iv-sum-row is-add">
                        <span className="iv-sum-label">{invoice.taxLabel}</span>
                        <span className="iv-sum-val">+{money(totals.tax)}</span>
                      </li>
                      <li className="iv-sum-row is-add">
                        <span className="iv-sum-label">Previous Balance</span>
                        <span className="iv-sum-val">+{money(invoice.previousBalance)}</span>
                      </li>
                      <li className="iv-sum-row is-add">
                        <span className="iv-sum-label">Late Fee</span>
                        <span className="iv-sum-val">+{money(invoice.lateFee)}</span>
                      </li>
                      <li className="iv-sum-row">
                        <span className="iv-sum-label">Amount Paid</span>
                        <span className="iv-sum-val text-success">{money(totals.paid)}</span>
                      </li>
                      <li className="iv-sum-row">
                        <span className="iv-sum-label">Pending Amount</span>
                        <span className="iv-sum-val text-danger">{money(totals.pending)}</span>
                      </li>
                    </ul>
                    <div className="d-flex align-items-center justify-content-between mb-1">
                      <span className="fs-12 text-muted">Collected {totals.collected}%</span>
                      <span className="fs-12 text-muted">
                        {money(totals.paid)} / {money(totals.grand)}
                      </span>
                    </div>
                    <div className="iv-paybar mb-3">
                      <span className="iv-paybar-fill" style={fill(totals.collected)} />
                    </div>
                    <div className="iv-sum-total">
                      <span className="iv-sum-total-label">Grand Total</span>
                      <span className="iv-sum-total-val">{money(totals.grand)}</span>
                    </div>
                  </div>
                </div>

                {/* Quick actions */}
                <div className="card iv-card mb-0">
                  <div className="card-body">
                    <div className="iv-cardhead">
                      <span className="iv-cardhead-ic">
                        <i className="ti ti-bolt" />
                      </span>
                      <div>
                        <div className="iv-cardhead-title">Quick Actions</div>
                        <div className="iv-cardhead-sub">Billing workflows</div>
                      </div>
                    </div>
                    <div className="iv-qa">
                      {quickActions.map((action) => (
                        <button
                          type="button"
                          className="iv-qa-btn"
                          key={action.id}
                          onClick={() => runAction(action.id)}
                        >
                          <span className="iv-qa-ic">
                            <i className={action.icon} />
                          </span>
                          <span className="iv-qa-lbl">{action.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                </div>
              </div>
              {/* /Right column */}
            </div>
          </div>
          {/* /Live workspace */}
          </div>
        </div>
      </div>

      {/* Collect Payment */}
      <Modal
        open={dialog === 'collect'}
        onClose={() => setDialog(null)}
        title="Collect Payment"
        subtitle={`Outstanding balance: ${money(totals.pending)}`}
        onSubmit={submitCollect}
        footer={
          <>
            <ActionLink className="btn btn-light me-2" onClick={() => setDialog(null)}>
              Cancel
            </ActionLink>
            <button type="submit" className="btn btn-primary">
              Collect Payment
            </button>
          </>
        }
      >
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label" htmlFor="iv-collect-amount">
              Amount <span className="text-danger">*</span>
            </label>
            <div className="input-group">
              <span className="input-group-text">$</span>
              <input
                type="number"
                className="form-control"
                id="iv-collect-amount"
                required
                value={collect.amount}
                onChange={(event) =>
                  setCollect((current) => ({ ...current, amount: event.target.value }))
                }
              />
            </div>
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="iv-collect-method">
              Payment Method <span className="text-danger">*</span>
            </label>
            <select
              className="form-select"
              id="iv-collect-method"
              value={collect.method}
              onChange={(event) =>
                setCollect((current) => ({ ...current, method: event.target.value }))
              }
            >
              {methodOptions.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="iv-collect-date">
              Payment Date <span className="text-danger">*</span>
            </label>
            <input
              type="date"
              className="form-control"
              id="iv-collect-date"
              required
              value={collect.date}
              onChange={(event) =>
                setCollect((current) => ({ ...current, date: event.target.value }))
              }
            />
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="iv-collect-ref">
              Transaction / Reference No
            </label>
            <input
              type="text"
              className="form-control"
              id="iv-collect-ref"
              value={collect.reference}
              onChange={(event) =>
                setCollect((current) => ({ ...current, reference: event.target.value }))
              }
            />
          </div>
          <div className="col-12">
            <label className="form-label" htmlFor="iv-collect-remarks">
              Remarks
            </label>
            <textarea
              className="form-control"
              rows={2}
              id="iv-collect-remarks"
              value={collect.remarks}
              onChange={(event) =>
                setCollect((current) => ({ ...current, remarks: event.target.value }))
              }
            />
          </div>
        </div>
      </Modal>

      {/* Record Offline Payment */}
      <Modal
        open={dialog === 'record'}
        onClose={() => setDialog(null)}
        title="Record Offline Payment"
        onSubmit={submitRecord}
        footer={
          <>
            <ActionLink className="btn btn-light me-2" onClick={() => setDialog(null)}>
              Cancel
            </ActionLink>
            <button type="submit" className="btn btn-primary">
              Record Payment
            </button>
          </>
        }
      >
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label" htmlFor="iv-record-amount">
              Amount <span className="text-danger">*</span>
            </label>
            <div className="input-group">
              <span className="input-group-text">$</span>
              <input
                type="number"
                className="form-control"
                id="iv-record-amount"
                required
                value={record.amount}
                onChange={(event) =>
                  setRecord((current) => ({ ...current, amount: event.target.value }))
                }
              />
            </div>
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="iv-record-mode">
              Mode <span className="text-danger">*</span>
            </label>
            <select
              className="form-select"
              id="iv-record-mode"
              value={record.mode}
              onChange={(event) =>
                setRecord((current) => ({ ...current, mode: event.target.value }))
              }
            >
              {offlineModeOptions.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="iv-record-date">
              Payment Date <span className="text-danger">*</span>
            </label>
            <input
              type="date"
              className="form-control"
              id="iv-record-date"
              required
              value={record.date}
              onChange={(event) =>
                setRecord((current) => ({ ...current, date: event.target.value }))
              }
            />
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="iv-record-ref">
              Reference No
            </label>
            <input
              type="text"
              className="form-control"
              id="iv-record-ref"
              value={record.reference}
              onChange={(event) =>
                setRecord((current) => ({ ...current, reference: event.target.value }))
              }
            />
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="iv-record-by">
              Collected By
            </label>
            <input
              type="text"
              className="form-control"
              id="iv-record-by"
              value={record.collectedBy}
              onChange={(event) =>
                setRecord((current) => ({ ...current, collectedBy: event.target.value }))
              }
            />
          </div>
          <div className="col-12">
            <label className="form-label" htmlFor="iv-record-remarks">
              Remarks
            </label>
            <textarea
              className="form-control"
              rows={2}
              id="iv-record-remarks"
              value={record.remarks}
              onChange={(event) =>
                setRecord((current) => ({ ...current, remarks: event.target.value }))
              }
            />
          </div>
        </div>
      </Modal>

      {/* Generate Receipt */}
      <Modal
        open={dialog === 'receipt'}
        onClose={() => setDialog(null)}
        title="Generate Receipt"
        subtitle={`For ${money(totals.paid)} collected against ${invoice.invoiceNo}`}
        onSubmit={(event) => {
          event.preventDefault();
          push('Receipt generated');
          setDialog(null);
        }}
        footer={
          <>
            <ActionLink className="btn btn-light me-2" onClick={() => setDialog(null)}>
              Cancel
            </ActionLink>
            <button type="submit" className="btn btn-primary">
              Generate Receipt
            </button>
          </>
        }
      >
        <ul className="iv-sum mb-0">
          <li className="iv-sum-row">
            <span className="iv-sum-label">Grand Total</span>
            <span className="iv-sum-val">{money(totals.grand)}</span>
          </li>
          <li className="iv-sum-row">
            <span className="iv-sum-label">Amount Paid</span>
            <span className="iv-sum-val text-success">{money(totals.paid)}</span>
          </li>
          <li className="iv-sum-row">
            <span className="iv-sum-label">Pending Amount</span>
            <span className="iv-sum-val text-danger">{money(totals.pending)}</span>
          </li>
        </ul>
      </Modal>

      {/* Send Reminder */}
      <Modal
        open={dialog === 'reminder'}
        onClose={() => setDialog(null)}
        title="Send Reminder"
        subtitle={`To ${invoice.guardian} · ${invoice.email}`}
        onSubmit={(event) => {
          event.preventDefault();
          push(`Reminder sent to ${invoice.guardian}`);
          setDialog(null);
        }}
        footer={
          <>
            <ActionLink className="btn btn-light me-2" onClick={() => setDialog(null)}>
              Cancel
            </ActionLink>
            <button type="submit" className="btn btn-primary">
              Send Reminder
            </button>
          </>
        }
      >
        <div className="mb-3">
          <label className="form-label" htmlFor="iv-reminder-channel-select">
            Channel
          </label>
          <select className="form-select" id="iv-reminder-channel-select" defaultValue="Email + SMS">
            <option>Email + SMS</option>
            <option>Email only</option>
            <option>SMS only</option>
          </select>
        </div>
        <div className="mb-0">
          <label className="form-label" htmlFor="iv-reminder-message">
            Message
          </label>
          <textarea
            className="form-control"
            rows={3}
            id="iv-reminder-message"
            defaultValue={`${money(totals.pending)} remains outstanding on ${invoice.invoiceNo}, due ${invoice.dueDate}.`}
          />
        </div>
      </Modal>

      {/* Email Invoice */}
      <Modal
        open={dialog === 'email'}
        onClose={() => setDialog(null)}
        title="Email Invoice"
        subtitle={invoice.invoiceNo}
        onSubmit={(event) => {
          event.preventDefault();
          push(`${invoice.invoiceNo} emailed to ${invoice.email}`);
          setDialog(null);
        }}
        footer={
          <>
            <ActionLink className="btn btn-light me-2" onClick={() => setDialog(null)}>
              Cancel
            </ActionLink>
            <button type="submit" className="btn btn-primary">
              Send Invoice
            </button>
          </>
        }
      >
        <div className="mb-3">
          <label className="form-label" htmlFor="iv-email-recipient">
            To
          </label>
          <input
            type="email"
            className="form-control"
            id="iv-email-recipient"
            defaultValue={invoice.email}
          />
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="iv-email-subject">
            Subject
          </label>
          <input
            type="text"
            className="form-control"
            id="iv-email-subject"
            defaultValue={`Invoice ${invoice.invoiceNo} · ${money(totals.pending)} due`}
          />
        </div>
        <div className="mb-0">
          <label className="form-label" htmlFor="iv-email-message">
            Message
          </label>
          <textarea className="form-control" rows={3} id="iv-email-message" />
        </div>
      </Modal>

      {/* Payment Details */}
      <Modal
        open={dialog === 'payment_details'}
        onClose={() => setDialog(null)}
        title="Payment Details"
        subtitle={inspected?.receiptNo}
        footer={
          <ActionLink className="btn btn-light" onClick={() => setDialog(null)}>
            Close
          </ActionLink>
        }
      >
        {inspected ? (
          <div className="iv-profile-info">
            {[
              ['Receipt No', inspected.receiptNo],
              ['Payment Date', inspected.date],
              ['Amount', money(inspected.amount)],
              ['Method', inspected.method],
              ['Transaction ID', inspected.transactionId],
              ['Collected By', inspected.collectedBy],
            ].map(([label, value]) => (
              <div className="iv-info-item" key={label}>
                <span className="iv-info-label">{label}</span>
                <span className="iv-info-val">{value}</span>
              </div>
            ))}
            <div className="iv-info-item iv-info-full">
              <span className="iv-info-label">Remarks</span>
              <span className="iv-info-val">{inspected.remarks}</span>
            </div>
          </div>
        ) : null}
      </Modal>

      {/* Receipt Preview */}
      <Modal
        open={dialog === 'receipt_preview'}
        onClose={() => setDialog(null)}
        title="Receipt Preview"
        subtitle={invoice.invoiceNo}
        footer={
          <>
            <ActionLink className="btn btn-light me-2" onClick={() => setDialog(null)}>
              Close
            </ActionLink>
            <button type="button" className="btn btn-primary" onClick={() => window.print()}>
              <i className="ti ti-printer me-1" />
              Print
            </button>
          </>
        }
      >
        <div className="iv-empty">
          <span className="iv-empty-ic mb-3">
            <i className="ti ti-file-invoice" />
          </span>
          <h4 className="mb-1 fs-16 fw-medium">{invoice.invoiceNo}</h4>
          <p className="text-muted mb-0">
            {money(totals.paid)} collected of {money(totals.grand)} · {totals.collected}%
          </p>
        </div>
      </Modal>

      {/* Print Invoice */}
      <Modal
        open={dialog === 'print'}
        onClose={() => setDialog(null)}
        title="Print Invoice"
        subtitle={invoice.invoiceNo}
        onSubmit={(event) => {
          event.preventDefault();
          setDialog(null);
          window.print();
        }}
        footer={
          <>
            <ActionLink className="btn btn-light me-2" onClick={() => setDialog(null)}>
              Cancel
            </ActionLink>
            <button type="submit" className="btn btn-primary">
              <i className="ti ti-printer me-1" />
              Print
            </button>
          </>
        }
      >
        <div className="mb-0">
          <label className="form-label" htmlFor="iv-print-copies">
            Copies
          </label>
          <input type="number" className="form-control" id="iv-print-copies" defaultValue={1} />
        </div>
      </Modal>

      <ToastStack toasts={toasts} onDismiss={dismiss} id="invoiceDetailsToasts" />
    </>
  );
};

export default InvoiceDetails;
