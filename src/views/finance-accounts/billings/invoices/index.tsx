import { useCallback, useMemo, useState } from 'react';
import Modal from '@components/ui/Modal';
import ToastStack from '@components/ui/ToastStack';
import { ActionLink, CardWorkspaceShell, PageHeader, useWorkspace } from '@components/workspace';
import type {
  BulkAction, ColumnDef, FilterField, QuickFilter, SavedView, SortOption, WorkspaceMenu,
} from '@components/workspace';
import ImageWithBasePath from '@core/common/imageWithBasePath';
import { all_routes } from '@/routes/all_routes';
import { useReveal } from '@hooks/useReveal';
import { useToasts } from '@hooks/useToasts';
import type { Invoice, InvoiceStatus } from './data/invoices.data';
import {
  academicYearOptions, amountBandOf, amountRangeOptions, balanceOf, classOptions, collectorOptions,
  communicationsOf, dateRangeOptions, invoiceStatusOptions, invoices as initialRows, issueMonthOf,
  methodOptions, money, notesOf, paymentStatusOf, paymentStatusOptions, percentOf, receiptNoOf,
  statusBadge, statusPill, studentOptions, subtotalOf, timelineOf, totalOf,
} from './data/invoices.data';

const routes = all_routes;

const filterFields: FilterField[] = [
  { id: 'invoice-status', label: 'Invoice Status', kind: 'select', chipLabel: 'Status', options: invoiceStatusOptions },
  { id: 'payment-status', label: 'Payment Status', kind: 'select', chipLabel: 'Payment', options: paymentStatusOptions },
  { id: 'academic-year', label: 'Academic Year', kind: 'select', chipLabel: 'Year', options: academicYearOptions },
  { id: 'class', label: 'Class', kind: 'select', chipLabel: 'Class', options: classOptions },
  { id: 'student', label: 'Student', kind: 'select', chipLabel: 'Student', options: studentOptions },
  { id: 'date-range', label: 'Date Range', kind: 'select', chipLabel: 'Period', options: dateRangeOptions },
  { id: 'amount-range', label: 'Amount Range', kind: 'select', chipLabel: 'Amount', options: amountRangeOptions },
  { id: 'collector', label: 'Collector', kind: 'select', chipLabel: 'Collector', options: collectorOptions },
];

const sortOptions: SortOption[] = [
  { id: 'student', label: 'Student (A–Z)', icon: 'ti ti-abc' },
  { id: 'total', label: 'Total Amount', icon: 'ti ti-cash' },
  { id: 'outstanding', label: 'Outstanding', icon: 'ti ti-wallet' },
  { id: 'due', label: 'Due Date', icon: 'ti ti-calendar-due' },
  { id: 'recent', label: 'Recently updated', icon: 'ti ti-history' },
];

type InvoiceModalId =
  | 'view' | 'create' | 'edit' | 'collect' | 'history' | 'receipt' | 'email' | 'reminder'
  | 'preview' | 'delete';

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const dateKey = (value: string | null): number => {
  if (!value) return 0;
  const [day, month, year] = value.split(' ');
  const index = months.indexOf(month);
  if (index === -1) return 0;
  return Number(year) * 10000 + (index + 1) * 100 + Number(day);
};

const Invoices = () => {
  const [rows, setRows] = useState<Invoice[]>(initialRows);
  const [openMenu, setOpenMenu] = useState<WorkspaceMenu>(null);
  const [activeModal, setActiveModal] = useState<InvoiceModalId | null>(null);
  const [modalRow, setModalRow] = useState<Invoice | null>(null);
  const [bulkIds, setBulkIds] = useState<string[]>([]);
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState(methodOptions[0]);

  const { loading } = useReveal();
  const { toasts, push, dismiss } = useToasts();

  const openModal = useCallback((row: Invoice | null, modal: InvoiceModalId) => {
    setModalRow(row);
    setBulkIds([]);
    setActiveModal(modal);
    if (modal === 'collect' && row) {
      setAmount(String(balanceOf(row)));
      setMethod(row.method === 'No payment' ? methodOptions[0] : row.method);
    }
  }, []);

  const columns = useMemo<ColumnDef<Invoice>[]>(
    () => [
      {
        id: 'invoice', label: 'Invoice', toggleable: false, sortable: true,
        render: (row) => (
          <div className="dt-user">
            <span className="dt-avatar">
              <ImageWithBasePath src={row.avatar} alt={row.student} />
            </span>
            <div>
              <ActionLink className="dt-name" onClick={() => openModal(row, 'view')}>{row.invoiceNo}</ActionLink>
              <div className="dt-sub">
                <span>{row.student}</span>
                <span className="dt-dot">·</span>
                <span className="link-primary dt-code">{row.admissionNo}</span>
              </div>
            </div>
          </div>
        ),
      },
      {
        id: 'academic', label: 'Academic',
        render: (row) => (
          <ul className="list-unstyled mb-0 fs-12">
            <li className="py-1">
              <span className="badge badge-soft-primary"><i className="ti ti-school me-1" />{row.className}</span>
            </li>
            <li className="py-1 text-muted">Section <span className="fw-medium text-dark">{row.section}</span></li>
            <li className="py-1 text-muted"><i className="ti ti-calendar me-1" />{row.academicYear}</li>
          </ul>
        ),
      },
      {
        id: 'billing', label: 'Billing',
        render: (row) => (
          <ul className="list-unstyled mb-0 fs-12">
            <li className="py-1 text-muted">
              Issued <span className="fw-medium text-dark">{row.issuedDate}</span>
            </li>
            <li className="py-1 text-muted">
              Due <span className="fw-medium text-dark">{row.dueDate}</span>
            </li>
            <li className="d-flex flex-wrap gap-1 py-1">
              {row.tags.map((tag) => (
                <span className="badge badge-soft-secondary" key={tag}>{tag}</span>
              ))}
            </li>
          </ul>
        ),
      },
      {
        id: 'financial', label: 'Financial', sortable: true,
        render: (row) => (
          <ul className="list-unstyled mb-0 fs-12">
            <li className="py-1 text-muted">
              Total <span className="fw-medium text-dark">{money(totalOf(row))}</span>
            </li>
            <li className="py-1 text-muted">
              Paid <span className="fw-medium text-dark">{money(row.paid)}</span>
            </li>
            <li className="py-1 text-muted">
              Due <span className="fw-medium text-dark">{money(balanceOf(row))}</span>
            </li>
          </ul>
        ),
      },
      {
        id: 'payment', label: 'Payment',
        render: (row) => {
          const percent = percentOf(row);
          return (
            <>
              <div className="progress progress-xs mb-2" style={{ height: 4 }}>
                <div
                  className={`progress-bar bg-${percent === 100 ? 'success' : 'primary'}`}
                  style={{ width: `${percent}%` }}
                  role="progressbar"
                  aria-valuenow={percent}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`${percent}% collected`}
                />
              </div>
              <ul className="list-unstyled mb-0 fs-12">
                <li className="py-1 text-muted">{row.method}</li>
                <li className="py-1 text-muted">Last {row.lastPayment ?? '—'}</li>
                <li className="py-1 text-muted">{row.collector ?? '—'}</li>
              </ul>
            </>
          );
        },
      },
      {
        id: 'status', label: 'Status', toggleable: false, sortable: true,
        render: (row) => (
          <span className={`dt-pill ${statusPill[row.status]}`}>
            <span className="dt-pill-dot" />{row.status}
          </span>
        ),
      },
    ],
    [openModal],
  );

  const workspace = useWorkspace<Invoice>({
    rows, filterFields, columns,
    getId: (row) => row.id,
    search: (row, term) => `${row.invoiceNo} ${row.student} ${row.admissionNo} ${row.method} ${row.collector ?? ''}`.toLowerCase().includes(term),
    matches: (row, filters) => {
      if (filters['invoice-status'] && row.status !== filters['invoice-status']) return false;
      if (filters['payment-status'] && paymentStatusOf(row) !== filters['payment-status']) return false;
      if (filters['academic-year'] && row.academicYear !== filters['academic-year']) return false;
      if (filters.class && row.className !== filters.class) return false;
      if (filters.student && row.student !== filters.student) return false;
      if (filters['date-range'] && issueMonthOf(row) !== filters['date-range']) return false;
      if (filters['amount-range'] && amountBandOf(row) !== filters['amount-range']) return false;
      if (filters.collector && row.collector !== filters.collector) return false;
      return true;
    },
    quickMatch: (row, quick) => !quick || row.status === quick,
    viewMatch: (row, view) => (view === 'all' ? true : row.status === view),
    compare: (a, b, sort) => {
      switch (sort) {
        case 'total': return totalOf(b) - totalOf(a) || a.student.localeCompare(b.student);
        case 'outstanding': return balanceOf(b) - balanceOf(a) || a.student.localeCompare(b.student);
        case 'due': return dateKey(a.dueDate) - dateKey(b.dueDate) || a.student.localeCompare(b.student);
        case 'recent': return dateKey(b.lastPayment) - dateKey(a.lastPayment) || a.student.localeCompare(b.student);
        case 'student':
        default: return a.student.localeCompare(b.student);
      }
    },
    defaultSort: 'student',
  });

  const countBy = useCallback(
    (status: InvoiceStatus) => rows.filter((row) => row.status === status).length,
    [rows],
  );

  const savedViews = useMemo<SavedView[]>(
    () => [
      { id: 'all', label: 'All Invoices', icon: 'ti ti-layout-list', count: rows.length },
      { id: 'Paid', label: 'Paid', icon: 'ti ti-circle-check', count: countBy('Paid') },
      { id: 'Partial', label: 'Partially Paid', icon: 'ti ti-progress', count: countBy('Partial') },
      { id: 'Unpaid', label: 'Unpaid', icon: 'ti ti-clock', count: countBy('Unpaid') },
      { id: 'Overdue', label: 'Overdue', icon: 'ti ti-alert-triangle', count: countBy('Overdue') },
    ],
    [countBy, rows.length],
  );

  const quickFilters = useMemo<QuickFilter[]>(
    () => [
      { id: 'Paid', label: 'Paid', icon: 'ti ti-circle-check', count: countBy('Paid') },
      { id: 'Partial', label: 'Partial', icon: 'ti ti-progress', count: countBy('Partial') },
      { id: 'Unpaid', label: 'Unpaid', icon: 'ti ti-clock', count: countBy('Unpaid') },
      { id: 'Overdue', label: 'Overdue', icon: 'ti ti-alert-triangle', count: countBy('Overdue') },
      { id: 'Draft', label: 'Draft', icon: 'ti ti-pencil', count: countBy('Draft') },
    ],
    [countBy],
  );

  /* --------------------------------- Actions -------------------------------- */

  const collect = useCallback(() => {
    if (!modalRow) return;
    const received = Number(amount);
    if (!Number.isFinite(received) || received <= 0) {
      push('Enter a payment amount', 'danger');
      return;
    }
    setRows((current) =>
      current.map((row) => {
        if (row.id !== modalRow.id) return row;
        const paid = Math.min(totalOf(row), row.paid + received);
        const status: InvoiceStatus = paid >= totalOf(row) ? 'Paid' : 'Partial';
        return { ...row, paid, status, method, lastPayment: '22 Jul 2026', collector: row.collector ?? 'Finance Office' };
      }),
    );
    setActiveModal(null);
    push(`${money(received)} collected against ${modalRow.invoiceNo}`);
  }, [amount, method, modalRow, push]);

  const archive = useCallback(
    (ids: string[]) => {
      setRows((current) => current.filter((row) => !ids.includes(row.id)));
      workspace.clearSelection();
      push(`${ids.length} ${ids.length === 1 ? 'invoice' : 'invoices'} archived`);
    },
    [push, workspace],
  );

  const remove = useCallback(() => {
    const ids = bulkIds.length > 0 ? bulkIds : modalRow ? [modalRow.id] : [];
    setRows((current) => current.filter((row) => !ids.includes(row.id)));
    workspace.clearSelection();
    setActiveModal(null);
    push(`${ids.length} ${ids.length === 1 ? 'invoice' : 'invoices'} deleted`);
  }, [bulkIds, modalRow, push, workspace]);

  const bulkActions = useMemo<BulkAction[]>(
    () => [
      { id: 'receipts', label: 'Generate Receipts', icon: 'ti ti-receipt', onClick: (ids) => push(`${ids.length} receipts generated`) },
      { id: 'reminders', label: 'Send Payment Reminders', icon: 'ti ti-bell', onClick: (ids) => push(`${ids.length} reminders sent`) },
      { id: 'export', label: 'Export Selected', icon: 'ti ti-file-export', onClick: (ids) => push(`${ids.length} invoices exported`) },
      { id: 'print', label: 'Print', icon: 'ti ti-printer', onClick: () => window.print() },
      { id: 'archive', label: 'Archive', icon: 'ti ti-archive', onClick: archive },
      {
        id: 'delete', label: 'Delete', icon: 'ti ti-trash', danger: true,
        onClick: (ids) => { setBulkIds(ids); setModalRow(null); setActiveModal('delete'); },
      },
    ],
    [archive, push],
  );

  const rowActions = (row: Invoice) => (
    <div className="dt-actions">
      <ActionLink className="dt-ib" title="View Invoice" ariaLabel="View Invoice" onClick={() => openModal(row, 'view')}>
        <i className="ti ti-eye" />
      </ActionLink>
      <ActionLink className="dt-ib" title="Edit Invoice" ariaLabel="Edit Invoice" onClick={() => openModal(row, 'edit')}>
        <i className="ti ti-edit" />
      </ActionLink>
      {balanceOf(row) > 0 ? (
        <ActionLink className="dt-ib success" title="Collect Payment" ariaLabel="Collect Payment" onClick={() => openModal(row, 'collect')}>
          <i className="ti ti-cash" />
        </ActionLink>
      ) : null}
      <ActionLink className="dt-ib" title="Payment History" ariaLabel="Payment History" onClick={() => openModal(row, 'history')}>
        <i className="ti ti-history" />
      </ActionLink>
      <ActionLink className="dt-ib" title="Email Invoice" ariaLabel="Email Invoice" onClick={() => openModal(row, 'email')}>
        <i className="ti ti-mail" />
      </ActionLink>
      <ActionLink className="dt-ib" title="Delete" ariaLabel="Delete" onClick={() => openModal(row, 'delete')}>
        <i className="ti ti-trash" />
      </ActionLink>
    </div>
  );

  /* --------------------------------- Panels --------------------------------- */

  const summaryList = (row: Invoice) => (
    <ul className="list-unstyled fs-12 mb-0">
      <li className="d-flex align-items-center justify-content-between py-1">
        <span className="text-muted">Invoice</span><span className="fw-medium">{row.invoiceNo}</span>
      </li>
      <li className="d-flex align-items-center justify-content-between py-1">
        <span className="text-muted">Issued / Due</span>
        <span className="fw-medium">{row.issuedDate} · {row.dueDate}</span>
      </li>
      <li className="d-flex align-items-center justify-content-between py-1">
        <span className="text-muted">Status</span>
        <span className={statusBadge[row.status]}>{row.status}</span>
      </li>
    </ul>
  );

  const renderDetail = (row: Invoice) => {
    const receipt = receiptNoOf(row);
    return (
      <div className="dt-detail-inner">
        <div className="row g-4">
          <div className="col-xl-3 col-md-6">
            <h4 className="details-heading fs-15 fw-medium"><i className="ti ti-file-invoice" />Invoice Summary</h4>
            {summaryList(row)}
            <h5 className="details-heading fs-15 mt-3"><i className="ti ti-list-details" />Fee Breakdown</h5>
            <ul className="list-unstyled fs-12 mb-0">
              {row.lineItems.map((item) => (
                <li className="d-flex align-items-center justify-content-between py-1" key={item.label}>
                  <span className="text-muted">{item.label}</span>
                  <span className="fw-medium">{money(item.amount)}</span>
                </li>
              ))}
              <li className="d-flex align-items-center justify-content-between py-1 border-top">
                <span className="text-muted">Subtotal</span>
                <span className="fw-medium">{money(subtotalOf(row))}</span>
              </li>
            </ul>
          </div>
          <div className="col-xl-3 col-md-6">
            <h6 className="details-heading"><i className="ti ti-discount" />Discounts &amp; Scholarships</h6>
            <ul className="list-unstyled fs-12 mb-3">
              <li className="d-flex align-items-center justify-content-between py-1">
                <span className="text-muted">Discount</span>
                <span className="fw-medium">{row.discount > 0 ? `-${money(row.discount)}` : '—'}</span>
              </li>
              <li className="d-flex align-items-center justify-content-between py-1">
                <span className="text-muted">Scholarship</span>
                <span className="fw-medium">{row.scholarship > 0 ? `-${money(row.scholarship)}` : '—'}</span>
              </li>
            </ul>
            <h6 className="details-heading"><i className="ti ti-receipt-tax" />Tax &amp; Late Fees</h6>
            <ul className="list-unstyled fs-12 mb-0">
              <li className="d-flex align-items-center justify-content-between py-1">
                <span className="text-muted">Tax</span><span className="fw-medium">{money(row.tax)}</span>
              </li>
              <li className="d-flex align-items-center justify-content-between py-1">
                <span className="text-muted">Late Fees</span><span className="fw-medium">{money(row.lateFee)}</span>
              </li>
              <li className="d-flex align-items-center justify-content-between py-1 border-top">
                <span className="text-muted">Total</span><span className="fw-medium">{money(totalOf(row))}</span>
              </li>
            </ul>
          </div>
          <div className="col-xl-3 col-md-6">
            <h6 className="details-heading"><i className="ti ti-timeline" />Payment Timeline</h6>
            <ul className="list-unstyled fs-12 mb-3">
              {timelineOf(row).map((event) => (
                <li className="py-1 text-muted" key={event}>
                  <i className="ti ti-point me-1" />{event}
                </li>
              ))}
            </ul>
            <h6 className="details-heading"><i className="ti ti-receipt" />Receipts</h6>
            <p className="fs-12 text-muted mb-0">{receipt ?? 'No receipts yet.'}</p>
          </div>
          <div className="col-xl-3 col-md-6">
            <h6 className="details-heading"><i className="ti ti-user" />Parent Contact</h6>
            <p className="fs-12 text-muted mb-2">
              <span className="fw-medium text-dark">{row.parentName}</span><br />{row.parentPhone}
            </p>
            <h6 className="details-heading"><i className="ti ti-mail" />Communication History</h6>
            <ul className="list-unstyled fs-12 mb-2">
              {communicationsOf(row).map((event) => (
                <li className="py-1 text-muted" key={event}>
                  <i className="ti ti-point me-1" />{event}
                </li>
              ))}
            </ul>
            <h6 className="details-heading"><i className="ti ti-notes" />Notes</h6>
            <p className="fs-12 text-muted mb-2">{notesOf(row)}</p>
            <div className="d-flex gap-2">
              <button type="button" className="btn btn-outline-light bg-white btn-sm flex-fill" onClick={() => openModal(row, 'view')}>
                <i className="ti ti-eye me-1" />View
              </button>
              {balanceOf(row) > 0 ? (
                <button type="button" className="btn btn-primary btn-sm flex-fill" onClick={() => openModal(row, 'collect')}>
                  <i className="ti ti-cash me-1" />Collect
                </button>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const invoiceForm = (row: Invoice | null) => (
    <div className="row">
      <div className="col-md-6"><div className="mb-3">
        <label className="form-label" htmlFor="iv-student">Student</label>
        <select className="form-select" id="iv-student" defaultValue={row?.student ?? studentOptions[0]}>
          {studentOptions.map((option) => <option key={option}>{option}</option>)}
        </select>
      </div></div>
      <div className="col-md-6"><div className="mb-3">
        <label className="form-label" htmlFor="iv-class">Class</label>
        <select className="form-select" id="iv-class" defaultValue={row?.className ?? classOptions[0]}>
          {classOptions.map((option) => <option key={option}>{option}</option>)}
        </select>
      </div></div>
      <div className="col-md-6"><div className="mb-3">
        <label className="form-label" htmlFor="iv-issued">Issue Date</label>
        <input type="text" className="form-control" id="iv-issued" defaultValue={row?.issuedDate ?? ''} placeholder="01-07-2026" />
      </div></div>
      <div className="col-md-6"><div className="mb-3">
        <label className="form-label" htmlFor="iv-due">Due Date</label>
        <input type="text" className="form-control" id="iv-due" defaultValue={row?.dueDate ?? ''} placeholder="15-07-2026" />
      </div></div>
      <div className="col-md-6"><div className="mb-3">
        <label className="form-label" htmlFor="iv-discount">Discount</label>
        <input type="text" className="form-control" id="iv-discount" defaultValue={row ? String(row.discount) : ''} placeholder="0.00" />
      </div></div>
      <div className="col-md-6"><div className="mb-3">
        <label className="form-label" htmlFor="iv-scholarship">Scholarship</label>
        <input type="text" className="form-control" id="iv-scholarship" defaultValue={row ? String(row.scholarship) : ''} placeholder="0.00" />
      </div></div>
      <div className="col-md-6"><div className="mb-3">
        <label className="form-label" htmlFor="iv-collector">Collector</label>
        <select className="form-select" id="iv-collector" defaultValue={row?.collector ?? collectorOptions[0]}>
          {collectorOptions.map((option) => <option key={option}>{option}</option>)}
        </select>
      </div></div>
      <div className="col-md-6"><div className="mb-0">
        <label className="form-label" htmlFor="iv-status">Invoice Status</label>
        <select className="form-select" id="iv-status" defaultValue={row?.status ?? invoiceStatusOptions[0]}>
          {invoiceStatusOptions.map((option) => <option key={option}>{option}</option>)}
        </select>
      </div></div>
    </div>
  );

  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <PageHeader
            title="Invoices"
            section="Accounts"
            dashboardTo={routes.adminDashboard}
            actions={
              <>
                <button
                  type="button"
                  className="btn btn-outline-light bg-white fw-medium d-inline-flex align-items-center me-2 mb-2"
                  onClick={() => window.print()}
                >
                  <i className="ti ti-printer me-2" />Print
                </button>
                <button
                  type="button"
                  className="btn btn-primary d-flex align-items-center mb-2"
                  onClick={() => openModal(null, 'create')}
                >
                  <i className="ti ti-square-rounded-plus me-2" />Create Invoice
                </button>
              </>
            }
          />

          <CardWorkspaceShell
            workspace={workspace}
            columns={columns}
            getId={(row) => row.id}
            totalCount={rows.length}
            loading={loading}
            workspaceId="classWorkspace"
            searchPlaceholder="Search invoice no, student, admission, method or collector…"
            searchLabel="Search invoices"
            savedViews={savedViews}
            filterFields={filterFields}
            quickFilters={quickFilters}
            sortOptions={sortOptions}
            noun="invoices"
            openMenu={openMenu}
            onOpenMenu={setOpenMenu}
            onRefresh={() => { setRows(initialRows); push('Invoices refreshed'); }}
            onSaveView={() => push('Current view saved')}
            onToast={push}
            renderDetail={renderDetail}
            renderActions={rowActions}
            bulkActions={bulkActions}
            emptyIcon="ti ti-file-off"
            emptyTitle="No invoices match your filters"
            emptyBody="Try adjusting your search terms or clearing the active filters to see more results."
            caption="Invoice list with academic, billing, financial and payment details"
            selectAllLabel="Select all invoices"
            rowLabel={(row) => `Select ${row.invoiceNo}`}
          />
        </div>
      </div>

      {/* Modals */}
      <Modal
        open={activeModal === 'view' && modalRow !== null}
        onClose={() => setActiveModal(null)}
        title="View Invoice"
        dialogClassName="modal-lg"
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={() => setActiveModal(null)}>Close</button>
            <button type="button" className="btn btn-primary" onClick={() => setActiveModal('preview')}>
              <i className="ti ti-file-text me-1" />Preview
            </button>
          </>
        }
      >
        {modalRow ? (
          <>
            <div className="d-flex align-items-center mb-3 pb-3 border-bottom">
              <span className="avatar avatar-lg me-3">
                <ImageWithBasePath src={modalRow.avatar} className="rounded" alt={modalRow.student} />
              </span>
              <div>
                <div className="d-flex align-items-center gap-2 flex-wrap">
                  <h5 className="mb-0">{modalRow.invoiceNo}</h5>
                  <span className="badge bg-primary-transparent text-primary">{modalRow.student}</span>
                  <span className={statusBadge[modalRow.status]}>{modalRow.status}</span>
                </div>
                <p className="mb-0 text-muted fs-13">
                  {money(totalOf(modalRow))} total · {money(balanceOf(modalRow))} due
                </p>
              </div>
            </div>
            {renderDetail(modalRow)}
          </>
        ) : null}
      </Modal>

      <Modal
        open={activeModal === 'create'}
        onClose={() => setActiveModal(null)}
        title="Create Invoice"
        dialogClassName="modal-lg"
        onSubmit={(e) => { e.preventDefault(); setActiveModal(null); push('Invoice created'); }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={() => setActiveModal(null)}>Cancel</button>
            <button type="submit" className="btn btn-primary">Create Invoice</button>
          </>
        }
      >
        {invoiceForm(null)}
      </Modal>

      <Modal
        open={activeModal === 'edit' && modalRow !== null}
        onClose={() => setActiveModal(null)}
        title="Edit Invoice"
        dialogClassName="modal-lg"
        onSubmit={(e) => { e.preventDefault(); setActiveModal(null); push(`${modalRow?.invoiceNo} updated`); }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={() => setActiveModal(null)}>Cancel</button>
            <button type="submit" className="btn btn-primary">Save Changes</button>
          </>
        }
      >
        {invoiceForm(modalRow)}
      </Modal>

      <Modal
        open={activeModal === 'collect' && modalRow !== null}
        onClose={() => setActiveModal(null)}
        title="Collect Payment"
        onSubmit={(e) => { e.preventDefault(); collect(); }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={() => setActiveModal(null)}>Cancel</button>
            <button type="submit" className="btn btn-primary"><i className="ti ti-cash me-1" />Collect Payment</button>
          </>
        }
      >
        {modalRow ? (
          <p className="fs-13 mb-3">
            <span className="fw-medium">{modalRow.invoiceNo}</span> has{' '}
            <span className="fw-medium">{money(balanceOf(modalRow))}</span> outstanding.
          </p>
        ) : null}
        <div className="row">
          <div className="col-md-6"><div className="mb-3">
            <label className="form-label" htmlFor="iv-amount">Amount Received</label>
            <input type="text" className="form-control" id="iv-amount" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" />
          </div></div>
          <div className="col-md-6"><div className="mb-0">
            <label className="form-label" htmlFor="iv-method">Payment Method</label>
            <select className="form-select" id="iv-method" value={method} onChange={(e) => setMethod(e.target.value)}>
              {methodOptions.map((option) => <option key={option}>{option}</option>)}
            </select>
          </div></div>
        </div>
      </Modal>

      <Modal
        open={activeModal === 'history' && modalRow !== null}
        onClose={() => setActiveModal(null)}
        title="Payment History"
        footer={<button type="button" className="btn btn-light" onClick={() => setActiveModal(null)}>Close</button>}
      >
        {modalRow ? (
          <ul className="list-unstyled mb-0">
            {timelineOf(modalRow).map((event) => (
              <li className="d-flex align-items-center py-2 border-bottom fs-13" key={event}>
                <i className="ti ti-point text-primary me-2" />{event}
              </li>
            ))}
          </ul>
        ) : null}
      </Modal>

      <Modal
        open={activeModal === 'receipt' && modalRow !== null}
        onClose={() => setActiveModal(null)}
        title="Generate Receipt"
        onSubmit={(e) => { e.preventDefault(); setActiveModal(null); push('Receipt generated'); }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={() => setActiveModal(null)}>Cancel</button>
            <button type="submit" className="btn btn-primary">Generate Receipt</button>
          </>
        }
      >
        <p className="fs-13 mb-0">
          Generate {receiptNoOf(modalRow ?? initialRows[0]) ?? 'a receipt'} for{' '}
          <span className="fw-medium">{modalRow?.student}</span> covering {money(modalRow?.paid ?? 0)}.
        </p>
      </Modal>

      <Modal
        open={activeModal === 'email' && modalRow !== null}
        onClose={() => setActiveModal(null)}
        title="Email Invoice"
        onSubmit={(e) => { e.preventDefault(); setActiveModal(null); push(`${modalRow?.invoiceNo} emailed`); }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={() => setActiveModal(null)}>Cancel</button>
            <button type="submit" className="btn btn-primary"><i className="ti ti-mail me-1" />Send</button>
          </>
        }
      >
        <div className="mb-3">
          <label className="form-label" htmlFor="iv-email-to">To</label>
          <input type="text" className="form-control" id="iv-email-to" defaultValue={modalRow?.parentName ?? ''} />
        </div>
        <div className="mb-0">
          <label className="form-label" htmlFor="iv-email-note">Message</label>
          <textarea className="form-control" rows={3} id="iv-email-note" defaultValue={`Please find invoice ${modalRow?.invoiceNo ?? ''} attached.`} />
        </div>
      </Modal>

      <Modal
        open={activeModal === 'reminder' && modalRow !== null}
        onClose={() => setActiveModal(null)}
        title="Send Reminder"
        onSubmit={(e) => { e.preventDefault(); setActiveModal(null); push('Reminder sent'); }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={() => setActiveModal(null)}>Cancel</button>
            <button type="submit" className="btn btn-primary"><i className="ti ti-bell me-1" />Send Reminder</button>
          </>
        }
      >
        <p className="fs-13 mb-0">
          Remind <span className="fw-medium">{modalRow?.parentName}</span> that{' '}
          {money(balanceOf(modalRow ?? initialRows[0]))} is outstanding on {modalRow?.invoiceNo}.
        </p>
      </Modal>

      <Modal
        open={activeModal === 'preview' && modalRow !== null}
        onClose={() => setActiveModal(null)}
        title="Invoice Preview"
        dialogClassName="modal-lg"
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={() => setActiveModal(null)}>Close</button>
            <button type="button" className="btn btn-primary" onClick={() => { window.print(); setActiveModal(null); }}>
              <i className="ti ti-printer me-1" />Print
            </button>
          </>
        }
      >
        {modalRow ? (
          <>
            <div className="d-flex justify-content-between align-items-start mb-3 pb-3 border-bottom">
              <div>
                <h5 className="mb-1">{modalRow.invoiceNo}</h5>
                <p className="fs-13 text-muted mb-0">
                  {modalRow.student} · {modalRow.className} {modalRow.section}
                </p>
              </div>
              <span className={statusBadge[modalRow.status]}>{modalRow.status}</span>
            </div>
            <table className="table table-sm mb-3">
              <thead>
                <tr><th>Item</th><th className="text-end">Amount</th></tr>
              </thead>
              <tbody>
                {modalRow.lineItems.map((item) => (
                  <tr key={item.label}>
                    <td>{item.label}</td>
                    <td className="text-end">{money(item.amount)}</td>
                  </tr>
                ))}
                <tr>
                  <td className="fw-medium">Subtotal</td>
                  <td className="text-end fw-medium">{money(subtotalOf(modalRow))}</td>
                </tr>
                {modalRow.discount > 0 ? (
                  <tr><td>Discount</td><td className="text-end">-{money(modalRow.discount)}</td></tr>
                ) : null}
                {modalRow.scholarship > 0 ? (
                  <tr><td>Scholarship</td><td className="text-end">-{money(modalRow.scholarship)}</td></tr>
                ) : null}
                {modalRow.lateFee > 0 ? (
                  <tr><td>Late Fees</td><td className="text-end">+{money(modalRow.lateFee)}</td></tr>
                ) : null}
                <tr className="border-top">
                  <td className="fw-medium">Total</td>
                  <td className="text-end fw-medium">{money(totalOf(modalRow))}</td>
                </tr>
              </tbody>
            </table>
            {summaryList(modalRow)}
          </>
        ) : null}
      </Modal>

      <Modal
        open={activeModal === 'delete'}
        onClose={() => setActiveModal(null)}
        title="Delete Invoice"
        onSubmit={(e) => { e.preventDefault(); remove(); }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={() => setActiveModal(null)}>Cancel</button>
            <button type="submit" className="btn btn-danger">Yes, Delete</button>
          </>
        }
      >
        <p className="fs-13 mb-0">
          {bulkIds.length > 0
            ? `Delete ${bulkIds.length} selected invoices? This cannot be undone.`
            : `Delete ${modalRow?.invoiceNo}? This cannot be undone.`}
        </p>
      </Modal>

      <ToastStack toasts={toasts} onDismiss={dismiss} id="ivToasts" />
    </>
  );
};

export default Invoices;
