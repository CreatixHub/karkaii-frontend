import { useCallback, useMemo, useState } from 'react';
import Modal from '@components/ui/Modal';
import Offcanvas from '@components/ui/Offcanvas';
import ToastStack from '@components/ui/ToastStack';
import {
  ActionLink,
  PageHeader,
  WorkspaceShell,
  useWorkspace,
} from '@components/workspace';
import type {
  ColumnDef,
  FilterField,
  QuickFilter,
  SavedView,
  SortOption,
  SummaryItem,
  WorkspaceMenu,
} from '@components/workspace';
import ImageWithBasePath from '@core/common/imageWithBasePath';
import { all_routes } from '@/routes/all_routes';
import { useToasts } from '@hooks/useToasts';
import type { Payment } from './data/paymentHistory.data';
import { money, payments as initialRows, statusBadge, statusPill } from './data/paymentHistory.data';

const routes = all_routes;

const filterFields: FilterField[] = [
  { id: 'academic-year', label: 'Academic Year', kind: 'select', chipLabel: 'Academic Year', options: ['2026 / 2027', '2025 / 2026', '2024 / 2025'] },
  { id: 'fee-category', label: 'Fee Category', kind: 'select', chipLabel: 'Category', options: ['Tuition Fee', 'Transport Fee', 'Hostel Fee', 'Exam Fee', 'Library Fee', 'Activity Fee'] },
  { id: 'class', label: 'Class', kind: 'select', chipLabel: 'Class', options: ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'] },
  { id: 'payment-method', label: 'Payment Method', kind: 'select', chipLabel: 'Method', options: ['Cash', 'UPI', 'Card', 'Bank Transfer', 'Cheque', 'Wallet', 'Online'] },
  { id: 'payment-status', label: 'Payment Status', kind: 'select', chipLabel: 'Status', options: ['Completed', 'Partially Paid', 'Pending Clearance', 'Partially Refunded', 'Refunded', 'Cancelled'] },
  { id: 'collected-by', label: 'Collected By', kind: 'select', chipLabel: 'Collector', options: ['Sarah Rose', 'Front Office', 'Mary Winsler', 'Parent Portal'] },
  { id: 'date-from', label: 'Date From', kind: 'date', chipLabel: 'From', placeholder: '01-07-2026' },
  { id: 'date-to', label: 'Date To', kind: 'date', chipLabel: 'To', placeholder: '31-07-2026' },
];

/** Counts are the template's school-wide figures across 1,482 payments. */
const savedViews: SavedView[] = [
  { id: 'all', label: 'All Payments', icon: 'ti ti-layout-list', count: 1482 },
  { id: 'balance', label: 'With Balance Due', icon: 'ti ti-progress-check', count: 264 },
  { id: 'pending', label: 'Pending Clearance', icon: 'ti ti-clock', count: 9 },
  { id: 'refunded', label: 'Refunded & Cancelled', icon: 'ti ti-arrow-back-up', count: 23 },
];

const quickFilters: QuickFilter[] = [
  { id: 'balance', label: 'Balance Due', icon: 'ti ti-progress-check', count: 264 },
  { id: 'cash', label: 'Cash', icon: 'ti ti-coin', count: 412 },
  { id: 'online', label: 'Online', icon: 'ti ti-world', count: 986 },
  { id: 'refunded', label: 'Refunded', icon: 'ti ti-arrow-back-up', count: 23 },
];

const sortOptions: SortOption[] = [
  { id: 'date', label: 'Payment date (newest)', icon: 'ti ti-clock' },
  { id: 'amount', label: 'Amount paid', icon: 'ti ti-currency-dollar' },
  { id: 'balance', label: 'Balance outstanding', icon: 'ti ti-scale' },
  { id: 'student', label: 'Student name (A–Z)', icon: 'ti ti-abc' },
  { id: 'category', label: 'Fee category', icon: 'ti ti-category' },
];

type PaymentModalId = 'view' | 'print' | 'email' | 'statement' | 'export';

const PaymentHistory = () => {
  const [rows, setRows] = useState<Payment[]>(initialRows);
  const [openMenu, setOpenMenu] = useState<WorkspaceMenu>(null);
  const [activeModal, setActiveModal] = useState<PaymentModalId | null>(null);
  const [modalRow, setModalRow] = useState<Payment | null>(null);
  const [panelRow, setPanelRow] = useState<Payment | null>(null);
  const [email, setEmail] = useState('');

  const { toasts, push, dismiss } = useToasts();

  const openModal = useCallback((row: Payment | null, modal: PaymentModalId) => {
    setModalRow(row);
    setActiveModal(modal);
    if (modal === 'email' && row) setEmail(`${row.student.toLowerCase().replace(/\s+/g, '.')}@example.com`);
  }, []);

  const columns = useMemo<ColumnDef<Payment>[]>(
    () => [
      {
        id: 'receiptNo', label: 'Receipt No.', toggleable: false,
        render: (row) => (
          <ActionLink className="fw-medium" onClick={() => openModal(row, 'view')}>
            {row.receiptNo}
          </ActionLink>
        ),
      },
      {
        id: 'student', label: 'Student', sortable: true,
        render: (row) => (
          <div className="dt-user">
            <span className="dt-avatar">
              <ImageWithBasePath src={row.avatar} alt={row.student} />
            </span>
            <div>
              <ActionLink className="dt-name" onClick={() => openModal(row, 'view')}>
                {row.student}
              </ActionLink>
              <div className="dt-sub">{row.className}</div>
            </div>
          </div>
        ),
      },
      { id: 'admissionNo', label: 'Admission No.', cellClassName: 'fs-13', render: (row) => row.admissionNo },
      {
        id: 'paymentDate', label: 'Payment Date', sortable: true,
        render: (row) => (
          <>
            <span className="d-block fs-13">{row.paymentDate}</span>
            <span className="fs-12 text-muted">{row.paymentTime}</span>
          </>
        ),
      },
      {
        id: 'feeCategory', label: 'Fee Category',
        render: (row) => <span className={`badge badge-soft-${row.categoryTint}`}>{row.feeCategory}</span>,
      },
      { id: 'paymentMethod', label: 'Payment Method', render: (row) => row.paymentMethod },
      { id: 'amountPaid', label: 'Amount Paid', sortable: true, align: 'end', cellClassName: 'fw-medium', render: (row) => money(row.amountPaid) },
      {
        id: 'balance', label: 'Balance', sortable: true, align: 'end',
        render: (row) => (
          <span className={row.balance > 0 ? 'text-danger' : 'text-success'}>{money(row.balance)}</span>
        ),
      },
      {
        id: 'collectedBy', label: 'Collected By',
        render: (row) => (
          <>
            <span className="d-block fs-13">{row.collectedBy}</span>
            <span className="fs-12 text-muted">{row.collectedByRole}</span>
          </>
        ),
      },
      {
        id: 'status', label: 'Status', toggleable: false,
        render: (row) => (
          <span className={`dt-pill ${statusPill[row.status]}`}>
            <span className="dt-pill-dot" />
            {row.status}
          </span>
        ),
      },
    ],
    [openModal],
  );

  const workspace = useWorkspace<Payment>({
    rows,
    filterFields,
    columns,
    getId: (row) => row.id,
    search: (row, term) => `${row.student} ${row.receiptNo} ${row.admissionNo}`.toLowerCase().includes(term),
    matches: (row, filters) => {
      if (filters['academic-year'] && row.academicYear !== filters['academic-year']) return false;
      if (filters['fee-category'] && row.feeCategory !== filters['fee-category']) return false;
      if (filters.class && !row.className.startsWith(filters.class)) return false;
      if (filters['payment-method'] && row.paymentMethod !== filters['payment-method']) return false;
      if (filters['payment-status'] && row.status !== filters['payment-status']) return false;
      if (filters['collected-by'] && row.collectedBy !== filters['collected-by']) return false;
      return true;
    },
    quickMatch: (row, quick) => {
      if (!quick) return true;
      if (quick === 'balance') return row.balance > 0;
      if (quick === 'cash') return row.paymentMethod === 'Cash';
      if (quick === 'online') return ['Online', 'UPI', 'Wallet'].includes(row.paymentMethod);
      if (quick === 'refunded') return row.status === 'Refunded' || row.status === 'Partially Refunded';
      return true;
    },
    viewMatch: (row, view) => {
      if (view === 'balance') return row.balance > 0;
      if (view === 'pending') return row.status === 'Pending Clearance';
      if (view === 'refunded') return ['Refunded', 'Partially Refunded', 'Cancelled'].includes(row.status);
      return true;
    },
    compare: (a, b, sort) => {
      switch (sort) {
        case 'amount': return b.amountPaid - a.amountPaid || a.student.localeCompare(b.student);
        case 'balance': return b.balance - a.balance || a.student.localeCompare(b.student);
        case 'student': return a.student.localeCompare(b.student);
        case 'category': return a.feeCategory.localeCompare(b.feeCategory) || a.student.localeCompare(b.student);
        case 'date':
        default: return b.receiptNo.localeCompare(a.receiptNo);
      }
    },
    defaultSort: 'date',
    pageSize: 8,
  });

  /** Headline count stays the template's 1,482; the amounts follow the sample. */
  const summary = useMemo<SummaryItem[]>(() => {
    const settled = rows.filter((row) => row.status !== 'Cancelled');
    const cash = settled.filter((row) => row.paymentMethod === 'Cash');
    const online = settled.filter((row) => ['Online', 'UPI', 'Wallet'].includes(row.paymentMethod));
    const refunded = rows.filter((row) => row.status === 'Refunded' || row.status === 'Partially Refunded');
    const sum = (list: Payment[]) => list.reduce((total, row) => total + row.amountPaid, 0);

    return [
      { id: 'total', tint: 'primary', icon: 'ti ti-history', label: 'Total Payments', value: '1,482', hint: 'this academic year' },
      { id: 'collected', tint: 'success', icon: 'ti ti-cash-banknote', label: 'Amount Collected', value: money(sum(settled) - sum(refunded)), hint: 'net of refunds' },
      { id: 'cash', tint: 'warning', icon: 'ti ti-coin', label: 'Cash Payments', value: money(sum(cash)), hint: `${cash.length} payments` },
      { id: 'online', tint: 'info', icon: 'ti ti-world', label: 'Online Payments', value: money(sum(online)), hint: `${online.length} payments` },
      { id: 'refunded', tint: 'danger', icon: 'ti ti-arrow-back-up', label: 'Refunded', value: money(sum(refunded)), hint: `${refunded.length} payments` },
    ];
  }, [rows]);

  const rowActions = (row: Payment) => (
    <div className="dt-actions">
      <ActionLink className="dt-ib" ariaLabel="View payment" onClick={() => setPanelRow(row)}>
        <i className="ti ti-eye" />
      </ActionLink>
      <ActionLink className="dt-ib" ariaLabel="Print receipt" onClick={() => openModal(row, 'print')}>
        <i className="ti ti-printer" />
      </ActionLink>
      <ActionLink className="dt-ib" ariaLabel="Email receipt" onClick={() => openModal(row, 'email')}>
        <i className="ti ti-mail" />
      </ActionLink>
      <ActionLink className="dt-ib" ariaLabel="Download statement" onClick={() => openModal(row, 'statement')}>
        <i className="ti ti-file-text" />
      </ActionLink>
    </div>
  );

  const detailList = (items: { label: string; value: string }[]) => (
    <ul className="list-unstyled mb-0">
      {items.map((item, index) => (
        <li
          className={`d-flex justify-content-between py-1 fs-13${index === items.length - 1 ? '' : ' border-bottom'}`}
          key={item.label}
        >
          <span className="text-muted">{item.label}</span>
          <span className="text-dark">{item.value}</span>
        </li>
      ))}
    </ul>
  );

  const renderDetail = (row: Payment) => (
    <div className="row g-3">
      <div className="col-lg-4 col-md-6">
        <h6 className="fs-13 mb-2">
          <i className="ti ti-receipt text-primary me-1" />
          Payment Details
        </h6>
        {detailList([
          { label: 'Receipt No', value: row.receiptNo },
          { label: 'Invoice No', value: row.invoiceNo },
          { label: 'Paid On', value: `${row.paymentDate} · ${row.paymentTime}` },
          { label: 'Method', value: row.paymentMethod },
        ])}
      </div>
      <div className="col-lg-4 col-md-6">
        <h6 className="fs-13 mb-2">
          <i className="ti ti-scale text-info me-1" />
          Amounts
        </h6>
        {detailList([
          { label: 'Amount Paid', value: money(row.amountPaid) },
          { label: 'Balance', value: money(row.balance) },
          { label: 'Fee Category', value: row.feeCategory },
          { label: 'Academic Year', value: row.academicYear },
        ])}
      </div>
      <div className="col-lg-4 col-md-6">
        <h6 className="fs-13 mb-2">
          <i className="ti ti-user text-secondary me-1" />
          Collected By
        </h6>
        {detailList([
          { label: 'Collector', value: row.collectedBy },
          { label: 'Desk', value: row.collectedByRole },
          { label: 'Student', value: row.student },
          { label: 'Admission No', value: row.admissionNo },
        ])}
      </div>
      <div className="col-12">
        <h6 className="fs-13 mb-2">
          <i className="ti ti-note text-muted me-1" />
          Notes
        </h6>
        <p className="fs-13 text-muted mb-0">{row.notes}</p>
      </div>
    </div>
  );

  const receiptPreview = modalRow ? (
    <>
      <div className="d-flex align-items-center mb-3 pb-3 border-bottom">
        <span className="avatar avatar-lg me-3">
          <ImageWithBasePath src={modalRow.avatar} className="rounded" alt={modalRow.student} />
        </span>
        <div>
          <div className="d-flex align-items-center gap-2">
            <h5 className="mb-0">{modalRow.student}</h5>
            <span className="badge bg-primary-transparent text-primary">{modalRow.receiptNo}</span>
            <span className={statusBadge[modalRow.status]}>{modalRow.status}</span>
          </div>
          <p className="mb-0 text-muted fs-13">
            {modalRow.className} · {modalRow.feeCategory} · {modalRow.paymentDate}
          </p>
        </div>
      </div>
      {detailList([
        { label: 'Amount Paid', value: money(modalRow.amountPaid) },
        { label: 'Balance', value: money(modalRow.balance) },
        { label: 'Payment Method', value: modalRow.paymentMethod },
        { label: 'Collected By', value: modalRow.collectedBy },
      ])}
    </>
  ) : null;

  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <PageHeader
            title="Payment History"
            section="Billing & Finance"
            dashboardTo={routes.adminDashboard}
            actions={
              <>
                <button
                  type="button"
                  className="btn btn-outline-light bg-white me-2 mb-2 d-inline-flex align-items-center"
                  onClick={() => window.print()}
                >
                  <i className="ti ti-printer me-1" />
                  Print Statement
                </button>
                <button
                  type="button"
                  className="btn btn-primary mb-2 d-inline-flex align-items-center"
                  onClick={() => openModal(null, 'export')}
                >
                  <i className="ti ti-file-export me-1" />
                  Export
                </button>
              </>
            }
          />

          <WorkspaceShell
            workspace={workspace}
            columns={columns}
            getId={(row) => row.id}
            totalCount={rows.length}
            searchPlaceholder="Search student or receipt no…"
            searchLabel="Search payment history"
            savedViews={savedViews}
            filterFields={filterFields}
            quickFilters={quickFilters}
            sortOptions={sortOptions}
            noun="payments"
            openMenu={openMenu}
            onOpenMenu={setOpenMenu}
            onRefresh={() => {
              setRows(initialRows);
              push('Payment history refreshed');
            }}
            onSaveView={() => push('Current view saved')}
            onToast={push}
            renderDetail={renderDetail}
            renderActions={rowActions}
            emptyIcon="ti ti-history"
            emptyTitle="No Payments Found"
            emptyBody="No payment matches the selected filters."
            summary={summary}
          />

          {/* Payment Details Offcanvas */}
          <Offcanvas
            open={panelRow !== null}
            onClose={() => setPanelRow(null)}
            title="Payment Details"
            labelledById="ph_panel_lbl"
          >
            {panelRow ? (
              <>
                <div className="d-flex align-items-center gap-2 pb-3 mb-3 border-bottom">
                  <span className="avatar avatar-lg">
                    <ImageWithBasePath src={panelRow.avatar} className="rounded" alt={panelRow.student} />
                  </span>
                  <div>
                    <h6 className="mb-0">{panelRow.student}</h6>
                    <span className="fs-12 text-muted">
                      {panelRow.receiptNo} · {panelRow.className}
                    </span>
                  </div>
                  <span className={`dt-pill ${statusPill[panelRow.status]} ms-auto`}>
                    <span className="dt-pill-dot" />
                    {panelRow.status}
                  </span>
                </div>
                <div className="row g-2 mb-3">
                  {[
                    { label: 'Paid', value: money(panelRow.amountPaid) },
                    { label: 'Balance', value: money(panelRow.balance) },
                  ].map((tile) => (
                    <div className="col-6" key={tile.label}>
                      <div className="border rounded p-2 text-center">
                        <span className="fs-11 text-muted d-block">{tile.label}</span>
                        <h6 className="mb-0">{tile.value}</h6>
                      </div>
                    </div>
                  ))}
                </div>
                {detailList([
                  { label: 'Invoice No', value: panelRow.invoiceNo },
                  { label: 'Paid On', value: `${panelRow.paymentDate} · ${panelRow.paymentTime}` },
                  { label: 'Method', value: panelRow.paymentMethod },
                  { label: 'Collected By', value: panelRow.collectedBy },
                ])}
                <div className="d-flex gap-2 mt-3">
                  <button
                    type="button"
                    className="btn btn-primary flex-fill"
                    onClick={() => {
                      const row = panelRow;
                      setPanelRow(null);
                      openModal(row, 'print');
                    }}
                  >
                    <i className="ti ti-printer me-1" />
                    Print
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-light bg-white flex-fill"
                    onClick={() => {
                      const row = panelRow;
                      setPanelRow(null);
                      openModal(row, 'email');
                    }}
                  >
                    <i className="ti ti-mail me-1" />
                    Email
                  </button>
                </div>
              </>
            ) : null}
          </Offcanvas>
        </div>
      </div>

      {/* Modals — all five are read/print/export; none mutates a payment. */}
      <Modal
        open={activeModal === 'view' && modalRow !== null}
        onClose={() => setActiveModal(null)}
        title="Payment Details"
        dialogClassName="modal-lg"
        footer={
          <button type="button" className="btn btn-light" onClick={() => setActiveModal(null)}>
            Close
          </button>
        }
      >
        {receiptPreview}
      </Modal>

      <Modal
        open={activeModal === 'print' && modalRow !== null}
        onClose={() => setActiveModal(null)}
        title="Print Receipt"
        dialogClassName="modal-lg"
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={() => setActiveModal(null)}>
              Close
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                window.print();
                setActiveModal(null);
              }}
            >
              <i className="ti ti-printer me-1" />
              Print
            </button>
          </>
        }
      >
        {receiptPreview}
      </Modal>

      <Modal
        open={activeModal === 'email' && modalRow !== null}
        onClose={() => setActiveModal(null)}
        title="Email Receipt"
        onSubmit={(event) => {
          event.preventDefault();
          push(`Receipt emailed to ${email}`);
          setActiveModal(null);
        }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={() => setActiveModal(null)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <i className="ti ti-send me-1" />
              Send
            </button>
          </>
        }
      >
        <div className="mb-0">
          <label className="form-label" htmlFor="ph-email">
            Recipient
          </label>
          <input
            type="email"
            className="form-control"
            id="ph-email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>
      </Modal>

      <Modal
        open={activeModal === 'statement' && modalRow !== null}
        onClose={() => setActiveModal(null)}
        title="Download Statement"
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={() => setActiveModal(null)}>
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                push('Statement download started');
                setActiveModal(null);
              }}
            >
              <i className="ti ti-download me-1" />
              Download
            </button>
          </>
        }
      >
        <p className="fs-13 mb-0">
          Generate a payment statement for <span className="fw-medium">{modalRow?.student}</span> covering{' '}
          {modalRow?.academicYear}.
        </p>
      </Modal>

      <Modal
        open={activeModal === 'export'}
        onClose={() => setActiveModal(null)}
        title="Export History"
        onSubmit={(event) => {
          event.preventDefault();
          push('Payment history export started');
          setActiveModal(null);
        }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={() => setActiveModal(null)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <i className="ti ti-file-export me-1" />
              Export
            </button>
          </>
        }
      >
        <div className="mb-0">
          <label className="form-label" htmlFor="ph-format">
            Format
          </label>
          <select className="form-select" id="ph-format" defaultValue="PDF">
            {['PDF', 'Excel', 'CSV'].map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </div>
      </Modal>

      <ToastStack toasts={toasts} onDismiss={dismiss} id="phToasts" />
    </>
  );
};

export default PaymentHistory;
