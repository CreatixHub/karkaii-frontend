import { useCallback, useMemo, useState } from 'react';
import Modal from '@components/ui/Modal';
import Offcanvas from '@components/ui/Offcanvas';
import ToastStack from '@components/ui/ToastStack';
import { ActionLink, PageHeader, WorkspaceShell, useWorkspace } from '@components/workspace';
import type {
  ColumnDef, FilterField, QuickFilter, SavedView, SortOption, SummaryItem, WorkspaceMenu,
} from '@components/workspace';
import ImageWithBasePath from '@core/common/imageWithBasePath';
import { all_routes } from '@/routes/all_routes';
import { useToasts } from '@hooks/useToasts';
import type { OnlinePayment, PayStatus } from './data/onlinePayments.data';
import {
  amountBand, money, onlinePayments as initialRows, settlementOf, statusBadge, statusPill,
} from './data/onlinePayments.data';

const routes = all_routes;

const filterFields: FilterField[] = [
  { id: 'payment-gateway', label: 'Payment Gateway', kind: 'select', chipLabel: 'Gateway', options: ['RazorPay', 'Stripe', 'PayPal', 'PayU', 'Cashfree'] },
  { id: 'payment-method', label: 'Payment Method', kind: 'select', chipLabel: 'Method', options: ['UPI', 'Card', 'Net Banking', 'Wallet'] },
  { id: 'payment-status', label: 'Payment Status', kind: 'select', chipLabel: 'Status', options: ['Success', 'Pending', 'Failed', 'Refunded', 'Partially Refunded'] },
  { id: 'academic-year', label: 'Academic Year', kind: 'select', chipLabel: 'Academic Year', options: ['2026 / 2027', '2025 / 2026', '2024 / 2025'] },
  { id: 'settlement-status', label: 'Settlement Status', kind: 'select', chipLabel: 'Settlement', options: ['Settled', 'Awaiting settlement', 'Not applicable'] },
  { id: 'amount-range', label: 'Amount Range', kind: 'select', chipLabel: 'Amount', options: ['Under $250', '$250 – $1,000', '$1,000 – $2,500', 'Over $2,500'] },
  { id: 'date-from', label: 'Date From', kind: 'date', chipLabel: 'From', placeholder: '01-07-2026' },
  { id: 'date-to', label: 'Date To', kind: 'date', chipLabel: 'To', placeholder: '31-07-2026' },
];

/** Counts are the template's school-wide figures across 986 transactions. */
const savedViews: SavedView[] = [
  { id: 'all', label: 'All Payments', icon: 'ti ti-layout-list', count: 986 },
  { id: 'Success', label: 'Successful', icon: 'ti ti-circle-check', count: 912 },
  { id: 'Pending', label: 'Pending Capture', icon: 'ti ti-clock', count: 34 },
  { id: 'Failed', label: 'Failed Transactions', icon: 'ti ti-circle-x', count: 28 },
  { id: 'Refunded', label: 'Refunded', icon: 'ti ti-arrow-back-up', count: 12 },
];

const quickFilters: QuickFilter[] = [
  { id: 'Success', label: 'Successful', icon: 'ti ti-circle-check', count: 912 },
  { id: 'Pending', label: 'Pending', icon: 'ti ti-clock', count: 34 },
  { id: 'Failed', label: 'Failed', icon: 'ti ti-circle-x', count: 28 },
  { id: 'Refunded', label: 'Refunded', icon: 'ti ti-arrow-back-up', count: 12 },
  { id: 'awaiting', label: 'Awaiting Settlement', icon: 'ti ti-shield-check', count: 18 },
];

const sortOptions: SortOption[] = [
  { id: 'date', label: 'Transaction date (newest)', icon: 'ti ti-clock' },
  { id: 'amount', label: 'Paid amount', icon: 'ti ti-currency-dollar' },
  { id: 'gateway', label: 'Payment gateway', icon: 'ti ti-plug-connected' },
  { id: 'student', label: 'Student name (A–Z)', icon: 'ti ti-abc' },
  { id: 'status', label: 'Payment status', icon: 'ti ti-circle-check' },
];

type OPModalId = 'view' | 'receipt' | 'refund' | 'retry' | 'export';

const OnlinePayments = () => {
  const [rows, setRows] = useState<OnlinePayment[]>(initialRows);
  const [openMenu, setOpenMenu] = useState<WorkspaceMenu>(null);
  const [activeModal, setActiveModal] = useState<OPModalId | null>(null);
  const [modalRow, setModalRow] = useState<OnlinePayment | null>(null);
  const [panelRow, setPanelRow] = useState<OnlinePayment | null>(null);
  const [refundReason, setRefundReason] = useState('');

  const { toasts, push, dismiss } = useToasts();

  const openModal = useCallback((row: OnlinePayment | null, modal: OPModalId) => {
    setModalRow(row);
    setActiveModal(modal);
    if (modal === 'refund') setRefundReason('');
  }, []);

  const columns = useMemo<ColumnDef<OnlinePayment>[]>(
    () => [
      {
        id: 'txnId', label: 'Transaction ID', toggleable: false,
        render: (row) => (
          <ActionLink className="fw-medium" onClick={() => openModal(row, 'view')}>{row.txnId}</ActionLink>
        ),
      },
      {
        id: 'student', label: 'Student', sortable: true,
        render: (row) => (
          <div className="dt-user">
            <span className="dt-avatar"><ImageWithBasePath src={row.avatar} alt={row.student} /></span>
            <div>
              <ActionLink className="dt-name" onClick={() => openModal(row, 'view')}>{row.student}</ActionLink>
              <div className="dt-sub">{row.className} • {row.admissionNo}</div>
            </div>
          </div>
        ),
      },
      {
        id: 'records', label: 'Invoice / Receipt No.',
        render: (row) => (
          <>
            <span className="d-block fs-13">{row.receiptNo}</span>
            <span className="fs-12 text-muted">{row.invoiceNo}</span>
          </>
        ),
      },
      {
        id: 'gateway', label: 'Payment Gateway', sortable: true,
        render: (row) => <span className={`badge badge-soft-${row.gatewayTint}`}>{row.gateway}</span>,
      },
      { id: 'method', label: 'Payment Method', render: (row) => row.method },
      { id: 'amount', label: 'Paid Amount', sortable: true, align: 'end', cellClassName: 'fw-medium', render: (row) => money(row.amount) },
      {
        id: 'charges', label: 'Gateway Charges', align: 'end', cellClassName: 'text-danger',
        render: (row) => (row.charges === null ? '—' : money(row.charges)),
      },
      {
        id: 'date', label: 'Transaction Date', sortable: true,
        render: (row) => (
          <>
            <span className="d-block fs-13">{row.date}</span>
            <span className="fs-12 text-muted">{row.time}</span>
          </>
        ),
      },
      {
        id: 'status', label: 'Payment Status', toggleable: false,
        render: (row) => (
          <span className={`dt-pill ${statusPill[row.status]}`}>
            <span className="dt-pill-dot" />{row.status}
          </span>
        ),
      },
      { id: 'referenceNo', label: 'Reference No.', cellClassName: 'fs-13', render: (row) => row.referenceNo },
    ],
    [openModal],
  );

  const workspace = useWorkspace<OnlinePayment>({
    rows, filterFields, columns,
    getId: (row) => row.id,
    search: (row, term) => `${row.student} ${row.txnId} ${row.referenceNo}`.toLowerCase().includes(term),
    matches: (row, filters) => {
      if (filters['payment-gateway'] && row.gateway !== filters['payment-gateway']) return false;
      if (filters['payment-method'] && row.method !== filters['payment-method']) return false;
      if (filters['payment-status'] && row.status !== filters['payment-status']) return false;
      if (filters['academic-year'] && row.academicYear !== filters['academic-year']) return false;
      if (filters['settlement-status'] && settlementOf(row) !== filters['settlement-status']) return false;
      if (filters['amount-range'] && amountBand(row) !== filters['amount-range']) return false;
      return true;
    },
    quickMatch: (row, quick) => {
      if (!quick) return true;
      if (quick === 'awaiting') return settlementOf(row) === 'Awaiting settlement';
      return row.status === quick;
    },
    viewMatch: (row, view) => (view === 'all' ? true : row.status === view),
    compare: (a, b, sort) => {
      switch (sort) {
        case 'amount': return b.amount - a.amount || a.student.localeCompare(b.student);
        case 'gateway': return a.gateway.localeCompare(b.gateway) || a.student.localeCompare(b.student);
        case 'student': return a.student.localeCompare(b.student);
        case 'status': return a.status.localeCompare(b.status) || a.student.localeCompare(b.student);
        case 'date':
        default: return b.txnId.localeCompare(a.txnId);
      }
    },
    defaultSort: 'date',
    pageSize: 8,
  });

  const summary = useMemo<SummaryItem[]>(() => {
    const ok = rows.filter((r) => r.status === 'Success');
    const pending = rows.filter((r) => r.status === 'Pending');
    const failed = rows.filter((r) => r.status === 'Failed');
    const refunded = rows.filter((r) => r.status === 'Refunded' || r.status === 'Partially Refunded');
    const sum = (list: OnlinePayment[]) => list.reduce((t, r) => t + r.amount, 0);

    return [
      { id: 'total', tint: 'primary', icon: 'ti ti-world', label: 'Total Online Payments', value: money(sum(rows)), hint: `${rows.length} transactions` },
      { id: 'ok', tint: 'success', icon: 'ti ti-circle-check', label: 'Successful', value: String(ok.length), hint: `${money(sum(ok))} settled` },
      { id: 'pending', tint: 'warning', icon: 'ti ti-clock', label: 'Pending', value: String(pending.length), hint: `${money(sum(pending))} in process` },
      { id: 'failed', tint: 'danger', icon: 'ti ti-circle-x', label: 'Failed', value: String(failed.length), hint: `${money(sum(failed))} not captured` },
      { id: 'refunded', tint: 'info', icon: 'ti ti-arrow-back-up', label: 'Refunded', value: String(refunded.length), hint: `${money(sum(refunded))} returned` },
    ];
  }, [rows]);

  const setStatus = useCallback(
    (status: PayStatus, message: string) => {
      if (!modalRow) return;
      setRows((current) => current.map((row) => (row.id === modalRow.id ? { ...row, status } : row)));
      setActiveModal(null);
      push(message);
    },
    [modalRow, push],
  );

  const rowActions = (row: OnlinePayment) => (
    <div className="dt-actions">
      <ActionLink className="dt-ib" ariaLabel="View transaction" onClick={() => setPanelRow(row)}>
        <i className="ti ti-eye" />
      </ActionLink>
      <ActionLink className="dt-ib" ariaLabel="Download receipt" onClick={() => openModal(row, 'receipt')}>
        <i className="ti ti-download" />
      </ActionLink>
      {row.status === 'Failed' ? (
        <ActionLink className="dt-ib success" ariaLabel="Retry payment" onClick={() => openModal(row, 'retry')}>
          <i className="ti ti-refresh" />
        </ActionLink>
      ) : (
        <ActionLink className="dt-ib danger" ariaLabel="Refund payment" onClick={() => openModal(row, 'refund')}>
          <i className="ti ti-arrow-back-up" />
        </ActionLink>
      )}
    </div>
  );

  const infoList = (items: { label: string; value: string }[]) => (
    <ul className="list-unstyled mb-0">
      {items.map((item, index) => (
        <li className={`d-flex justify-content-between py-1 fs-13${index === items.length - 1 ? '' : ' border-bottom'}`} key={item.label}>
          <span className="text-muted">{item.label}</span>
          <span className="text-dark">{item.value}</span>
        </li>
      ))}
    </ul>
  );

  const renderDetail = (row: OnlinePayment) => (
    <div className="row g-3">
      <div className="col-lg-4 col-md-6">
        <h6 className="fs-13 mb-2"><i className="ti ti-plug-connected text-primary me-1" />Gateway</h6>
        {infoList([
          { label: 'Gateway', value: row.gateway },
          { label: 'Method', value: row.method },
          { label: 'Reference No', value: row.referenceNo },
          { label: 'Settlement', value: settlementOf(row) },
        ])}
      </div>
      <div className="col-lg-4 col-md-6">
        <h6 className="fs-13 mb-2"><i className="ti ti-currency-dollar text-success me-1" />Amounts</h6>
        {infoList([
          { label: 'Paid Amount', value: money(row.amount) },
          { label: 'Gateway Charges', value: row.charges === null ? '—' : money(row.charges) },
          { label: 'Net Credited', value: row.charges === null ? '—' : money(row.amount - row.charges) },
          { label: 'Status', value: row.status },
        ])}
      </div>
      <div className="col-lg-4 col-md-6">
        <h6 className="fs-13 mb-2"><i className="ti ti-file-invoice text-info me-1" />Billing Records</h6>
        {infoList([
          { label: 'Receipt No', value: row.receiptNo },
          { label: 'Invoice No', value: row.invoiceNo },
          { label: 'Student', value: row.student },
          { label: 'Admission No', value: row.admissionNo },
        ])}
      </div>
      <div className="col-12">
        <h6 className="fs-13 mb-2"><i className="ti ti-note text-muted me-1" />Notes</h6>
        <p className="fs-13 text-muted mb-0">{row.notes}</p>
      </div>
    </div>
  );

  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <PageHeader
            title="Online Payments"
            section="Billing & Finance"
            dashboardTo={routes.adminDashboard}
            actions={
              <>
                <button type="button" className="btn btn-outline-light bg-white me-2 mb-2 d-inline-flex align-items-center" onClick={() => openModal(null, 'export')}>
                  <i className="ti ti-file-export me-1" />Export
                </button>
                <button type="button" className="btn btn-primary mb-2 d-inline-flex align-items-center" onClick={() => push('Report download started')}>
                  <i className="ti ti-download me-1" />Download Report
                </button>
              </>
            }
          />

          <WorkspaceShell
            workspace={workspace}
            columns={columns}
            getId={(row) => row.id}
            totalCount={rows.length}
            searchPlaceholder="Search student or transaction ID…"
            searchLabel="Search online payments"
            savedViews={savedViews}
            filterFields={filterFields}
            quickFilters={quickFilters}
            sortOptions={sortOptions}
            noun="transactions"
            openMenu={openMenu}
            onOpenMenu={setOpenMenu}
            onRefresh={() => { setRows(initialRows); push('Online payments refreshed'); }}
            onSaveView={() => push('Current view saved')}
            onToast={push}
            renderDetail={renderDetail}
            renderActions={rowActions}
            emptyIcon="ti ti-world-off"
            emptyTitle="No Online Payments Found"
            emptyBody="No transaction matches the selected filters."
            summary={summary}
          />

          <Offcanvas open={panelRow !== null} onClose={() => setPanelRow(null)} title="Payment Details" labelledById="pay_panel_lbl">
            {panelRow ? (
              <>
                <div className="d-flex align-items-center gap-2 pb-3 mb-3 border-bottom">
                  <span className="avatar avatar-lg"><ImageWithBasePath src={panelRow.avatar} className="rounded" alt={panelRow.student} /></span>
                  <div>
                    <h6 className="mb-0">{panelRow.student}</h6>
                    <span className="fs-12 text-muted">{panelRow.txnId}</span>
                  </div>
                  <span className={`dt-pill ${statusPill[panelRow.status]} ms-auto`}>
                    <span className="dt-pill-dot" />{panelRow.status}
                  </span>
                </div>
                <div className="border rounded p-3 mb-3 d-flex justify-content-between align-items-center">
                  <span className="fw-medium">Paid Amount</span>
                  <h5 className="mb-0">{money(panelRow.amount)}</h5>
                </div>
                {infoList([
                  { label: 'Gateway', value: panelRow.gateway },
                  { label: 'Method', value: panelRow.method },
                  { label: 'Charges', value: panelRow.charges === null ? '—' : money(panelRow.charges) },
                  { label: 'Settlement', value: settlementOf(panelRow) },
                  { label: 'Reference No', value: panelRow.referenceNo },
                ])}
                <div className="d-flex gap-2 mt-3">
                  <button type="button" className="btn btn-primary flex-fill" onClick={() => { const r = panelRow; setPanelRow(null); openModal(r, 'receipt'); }}>
                    <i className="ti ti-download me-1" />Receipt
                  </button>
                  {panelRow.status === 'Failed' ? (
                    <button type="button" className="btn btn-outline-light bg-white flex-fill" onClick={() => { const r = panelRow; setPanelRow(null); openModal(r, 'retry'); }}>
                      <i className="ti ti-refresh me-1" />Retry
                    </button>
                  ) : null}
                </div>
              </>
            ) : null}
          </Offcanvas>
        </div>
      </div>

      {/* Modals */}
      <Modal
        open={activeModal === 'view' && modalRow !== null}
        onClose={() => setActiveModal(null)}
        title="Transaction Details"
        dialogClassName="modal-lg"
        footer={<button type="button" className="btn btn-light" onClick={() => setActiveModal(null)}>Close</button>}
      >
        {modalRow ? (
          <>
            <div className="d-flex align-items-center mb-3 pb-3 border-bottom">
              <span className="avatar avatar-lg me-3"><ImageWithBasePath src={modalRow.avatar} className="rounded" alt={modalRow.student} /></span>
              <div>
                <div className="d-flex align-items-center gap-2">
                  <h5 className="mb-0">{modalRow.student}</h5>
                  <span className="badge bg-primary-transparent text-primary">{modalRow.txnId}</span>
                  <span className={statusBadge[modalRow.status]}>{modalRow.status}</span>
                </div>
                <p className="mb-0 text-muted fs-13">{modalRow.gateway} · {modalRow.method} · {modalRow.date}</p>
              </div>
            </div>
            {renderDetail(modalRow)}
          </>
        ) : null}
      </Modal>

      <Modal
        open={activeModal === 'receipt' && modalRow !== null}
        onClose={() => setActiveModal(null)}
        title="Download Receipt"
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={() => setActiveModal(null)}>Cancel</button>
            <button type="button" className="btn btn-primary" onClick={() => { push('Receipt download started'); setActiveModal(null); }}>
              <i className="ti ti-download me-1" />Download
            </button>
          </>
        }
      >
        <p className="fs-13 mb-0">
          Download the gateway receipt for <span className="fw-medium">{modalRow?.txnId}</span> ({money(modalRow?.amount ?? 0)}).
        </p>
      </Modal>

      <Modal
        open={activeModal === 'refund' && modalRow !== null}
        onClose={() => setActiveModal(null)}
        title="Refund Payment"
        onSubmit={(event) => { event.preventDefault(); setStatus('Refunded', `${modalRow?.txnId} refunded`); }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={() => setActiveModal(null)}>Cancel</button>
            <button type="submit" className="btn btn-danger"><i className="ti ti-arrow-back-up me-1" />Refund</button>
          </>
        }
      >
        {modalRow ? (
          <>
            <p className="fs-13 mb-3">
              Refund <span className="fw-medium">{money(modalRow.amount)}</span> to source for{' '}
              <span className="fw-medium">{modalRow.student}</span>?
            </p>
            <div className="mb-0">
              <label className="form-label" htmlFor="op-refund-reason">Reason</label>
              <textarea className="form-control" rows={3} id="op-refund-reason" value={refundReason} onChange={(e) => setRefundReason(e.target.value)} />
            </div>
          </>
        ) : null}
      </Modal>

      <Modal
        open={activeModal === 'retry' && modalRow !== null}
        onClose={() => setActiveModal(null)}
        title="Retry Payment"
        onSubmit={(event) => { event.preventDefault(); setStatus('Pending', `Retry initiated for ${modalRow?.txnId}`); }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={() => setActiveModal(null)}>Cancel</button>
            <button type="submit" className="btn btn-primary"><i className="ti ti-refresh me-1" />Retry</button>
          </>
        }
      >
        <p className="fs-13 mb-0">
          Send a fresh payment link to the guardian for <span className="fw-medium">{modalRow?.invoiceNo}</span>?
          The transaction moves to Pending until the gateway confirms.
        </p>
      </Modal>

      <Modal
        open={activeModal === 'export'}
        onClose={() => setActiveModal(null)}
        title="Export Transactions"
        onSubmit={(event) => { event.preventDefault(); push('Transaction export started'); setActiveModal(null); }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={() => setActiveModal(null)}>Cancel</button>
            <button type="submit" className="btn btn-primary"><i className="ti ti-file-export me-1" />Export</button>
          </>
        }
      >
        <div className="mb-0">
          <label className="form-label" htmlFor="op-format">Format</label>
          <select className="form-select" id="op-format" defaultValue="PDF">
            {['PDF', 'Excel', 'CSV'].map((option) => <option key={option}>{option}</option>)}
          </select>
        </div>
      </Modal>

      <ToastStack toasts={toasts} onDismiss={dismiss} id="opToasts" />
    </>
  );
};

export default OnlinePayments;
