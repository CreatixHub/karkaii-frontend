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
import type { CollectStatus, FeeCollection, PaymentMethod } from './data/collectFees.data';
import {
  academicYearOptions, balanceOf, classOptions, collectionDateOptions, discountTextOf, dueDateOptions,
  feeCollections as initialRows, feeGroupOptions, feeTypeOptions, fineTextOf, installmentsOf, money,
  payableOf, paymentMethodOptions, paymentStatusOptions, percentOf, receiptLineOf, remarksOf,
  searchIndexOf, sectionOptions, statusBadge, statusPill, studentOptions, transactionRefOf,
} from './data/collectFees.data';

const routes = all_routes;

const filterFields: FilterField[] = [
  { id: 'academic-year', label: 'Academic Year', kind: 'select', chipLabel: 'Year', options: academicYearOptions },
  { id: 'fee-group', label: 'Fee Group', kind: 'select', chipLabel: 'Group', options: feeGroupOptions },
  { id: 'fee-type', label: 'Fee Type', kind: 'select', chipLabel: 'Type', options: feeTypeOptions },
  { id: 'class', label: 'Class', kind: 'select', chipLabel: 'Class', options: classOptions },
  { id: 'section', label: 'Section', kind: 'select', chipLabel: 'Section', options: sectionOptions },
  { id: 'student', label: 'Student', kind: 'select', chipLabel: 'Student', options: studentOptions },
  { id: 'payment-status', label: 'Payment Status', kind: 'select', chipLabel: 'Status', options: paymentStatusOptions },
  { id: 'payment-method', label: 'Payment Method', kind: 'select', chipLabel: 'Method', options: paymentMethodOptions },
  { id: 'due-date', label: 'Due Date', kind: 'select', chipLabel: 'Due', options: dueDateOptions },
  { id: 'collection-date', label: 'Collection Date', kind: 'select', chipLabel: 'Collected', options: collectionDateOptions },
];

const sortOptions: SortOption[] = [
  { id: 'name', label: 'Student Name (A–Z)', icon: 'ti ti-abc' },
  { id: 'total', label: 'Total Amount', icon: 'ti ti-cash' },
  { id: 'balance', label: 'Balance', icon: 'ti ti-wallet' },
  { id: 'due', label: 'Due Date', icon: 'ti ti-calendar-due' },
  { id: 'recent', label: 'Recently collected', icon: 'ti ti-history' },
];

type CollectModalId =
  | 'collect' | 'add' | 'import' | 'delete' | 'view' | 'discount' | 'waive' | 'refund' | 'send';

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const dateKey = (value: string | null): number => {
  if (!value) return 0;
  const [day, month, year] = value.split(' ');
  const index = months.indexOf(month);
  if (index === -1) return 0;
  return Number(year) * 10000 + (index + 1) * 100 + Number(day);
};

const CollectFees = () => {
  const [rows, setRows] = useState<FeeCollection[]>(initialRows);
  const [openMenu, setOpenMenu] = useState<WorkspaceMenu>(null);
  const [activeModal, setActiveModal] = useState<CollectModalId | null>(null);
  const [modalRow, setModalRow] = useState<FeeCollection | null>(null);
  const [bulkIds, setBulkIds] = useState<string[]>([]);
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState<PaymentMethod>('UPI');

  const { loading } = useReveal();
  const { toasts, push, dismiss } = useToasts();

  const openModal = useCallback((row: FeeCollection | null, modal: CollectModalId) => {
    setModalRow(row);
    setBulkIds([]);
    setActiveModal(modal);
    if (modal === 'collect' && row) {
      setAmount(String(balanceOf(row)));
      setMethod(row.method ?? 'UPI');
    }
  }, []);

  const indexOf = useCallback((row: FeeCollection) => initialRows.findIndex((r) => r.id === row.id), []);

  const columns = useMemo<ColumnDef<FeeCollection>[]>(
    () => [
      {
        id: 'student', label: 'Student', toggleable: false, sortable: true,
        render: (row) => (
          <div className="dt-user">
            <span className="dt-avatar">
              <ImageWithBasePath src={row.avatar} alt={row.student} />
            </span>
            <div>
              <ActionLink className="dt-name" onClick={() => openModal(row, 'view')}>{row.student}</ActionLink>
              <div className="dt-sub">
                <span className="link-primary dt-code">{row.admissionNo}</span>
                <span className="dt-dot">·</span>
                <span>Roll {row.roll}</span>
              </div>
              <div className="d-flex flex-wrap gap-1 mt-1">
                <span className="badge badge-soft-primary">
                  <i className="ti ti-school me-1" />Class {row.className}-{row.section}
                </span>
              </div>
            </div>
          </div>
        ),
      },
      {
        id: 'fee', label: 'Fee Details',
        render: (row) => (
          <ul className="list-unstyled mb-0 fs-12">
            <li className="py-1">
              <span className="badge badge-soft-primary"><i className="ti ti-folder me-1" />{row.feeGroup}</span>{' '}
              <span className="badge badge-soft-info"><i className="ti ti-tag me-1" />{row.feeType}</span>
            </li>
            <li className="py-1 text-muted">
              <i className="ti ti-file-invoice me-1" />
              <span className="fw-medium text-dark">{row.invoiceNo}</span>
            </li>
            <li className="py-1 text-muted"><i className="ti ti-calendar me-1" />{row.academicYear}</li>
            <li className="py-1 text-muted">
              <i className="ti ti-calendar-due me-1" />Due{' '}
              <span className="fw-medium text-dark">{row.dueDate}</span>
            </li>
          </ul>
        ),
      },
      {
        id: 'payment', label: 'Payment Details', sortable: true,
        render: (row) => {
          const payable = payableOf(row);
          const percent = percentOf(row);
          return (
            <>
              <div className="d-flex align-items-center gap-2 mb-1">
                <span className="fw-medium">{money(row.paid)}</span>
                <span className="text-muted fs-12">/ {money(payable)}</span>
                <span className="badge badge-soft-secondary">{percent}%</span>
              </div>
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
                <li className="py-1 text-muted">Disc {money(row.discount)} · Fine {money(row.fine)}</li>
                <li className="py-1 text-muted">
                  Bal <span className="fw-medium text-dark">{money(balanceOf(row))}</span>
                </li>
                <li className="py-1 text-muted">{row.method ?? '—'} · {row.collectionDate ?? '—'}</li>
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

  const workspace = useWorkspace<FeeCollection>({
    rows, filterFields, columns,
    getId: (row) => row.id,
    search: (row, term) => searchIndexOf(row).includes(term),
    matches: (row, filters) => {
      if (filters['academic-year'] && row.academicYear !== filters['academic-year']) return false;
      if (filters['fee-group'] && row.feeGroup !== filters['fee-group']) return false;
      if (filters['fee-type'] && row.feeType !== filters['fee-type']) return false;
      if (filters.class && row.className !== filters.class) return false;
      if (filters.section && row.section !== filters.section) return false;
      if (filters.student && row.student !== filters.student) return false;
      if (filters['payment-status'] && row.status !== filters['payment-status']) return false;
      if (filters['payment-method'] && row.method !== filters['payment-method']) return false;
      if (filters['due-date'] && row.dueDate !== filters['due-date']) return false;
      if (filters['collection-date'] && row.collectionDate !== filters['collection-date']) return false;
      return true;
    },
    quickMatch: (row, quick) => !quick || row.status === quick,
    viewMatch: (row, view) => (view === 'all' ? true : row.status === view),
    compare: (a, b, sort) => {
      switch (sort) {
        case 'total': return payableOf(b) - payableOf(a) || a.student.localeCompare(b.student);
        case 'balance': return balanceOf(b) - balanceOf(a) || a.student.localeCompare(b.student);
        case 'due': return dateKey(a.dueDate) - dateKey(b.dueDate) || a.student.localeCompare(b.student);
        case 'recent': return dateKey(b.collectionDate) - dateKey(a.collectionDate) || a.student.localeCompare(b.student);
        case 'name':
        default: return a.student.localeCompare(b.student);
      }
    },
    defaultSort: 'name',
  });

  const countBy = useCallback(
    (status: CollectStatus) => rows.filter((row) => row.status === status).length,
    [rows],
  );

  const savedViews = useMemo<SavedView[]>(
    () => [
      { id: 'all', label: 'All Collections', icon: 'ti ti-layout-list', count: rows.length },
      { id: 'Paid', label: 'Paid', icon: 'ti ti-circle-check', count: countBy('Paid') },
      { id: 'Partially Paid', label: 'Partially Paid', icon: 'ti ti-progress', count: countBy('Partially Paid') },
      { id: 'Pending', label: 'Pending', icon: 'ti ti-clock', count: countBy('Pending') },
      { id: 'Overdue', label: 'Overdue', icon: 'ti ti-alert-triangle', count: countBy('Overdue') },
      { id: 'Refunded', label: 'Refunded', icon: 'ti ti-arrow-back-up', count: countBy('Refunded') },
    ],
    [countBy, rows.length],
  );

  const quickFilters = useMemo<QuickFilter[]>(
    () => [
      { id: 'Paid', label: 'Paid', icon: 'ti ti-circle-check', count: countBy('Paid') },
      { id: 'Partially Paid', label: 'Partially Paid', icon: 'ti ti-progress', count: countBy('Partially Paid') },
      { id: 'Pending', label: 'Pending', icon: 'ti ti-clock', count: countBy('Pending') },
      { id: 'Overdue', label: 'Overdue', icon: 'ti ti-alert-triangle', count: countBy('Overdue') },
      { id: 'Refunded', label: 'Refunded', icon: 'ti ti-arrow-back-up', count: countBy('Refunded') },
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
        const paid = Math.min(payableOf(row), row.paid + received);
        const status: CollectStatus = paid >= payableOf(row) ? 'Paid' : 'Partially Paid';
        return { ...row, paid, status, method, collectionDate: '10 May 2024' };
      }),
    );
    setActiveModal(null);
    push(`${money(received)} collected from ${modalRow.student}`);
  }, [amount, method, modalRow, push]);

  const waiveFine = useCallback(() => {
    if (!modalRow) return;
    setRows((current) => current.map((row) => (row.id === modalRow.id ? { ...row, fine: 0 } : row)));
    setActiveModal(null);
    push(`Fine waived for ${modalRow.student}`);
  }, [modalRow, push]);

  const issueRefund = useCallback(() => {
    if (!modalRow) return;
    setRows((current) =>
      current.map((row) => (row.id === modalRow.id ? { ...row, status: 'Refunded' as const } : row)),
    );
    setActiveModal(null);
    push(`Refund issued to ${modalRow.student}`);
  }, [modalRow, push]);

  const remove = useCallback(() => {
    const ids = bulkIds.length > 0 ? bulkIds : modalRow ? [modalRow.id] : [];
    setRows((current) => current.filter((row) => !ids.includes(row.id)));
    workspace.clearSelection();
    setActiveModal(null);
    push(`${ids.length} ${ids.length === 1 ? 'collection' : 'collections'} deleted`);
  }, [bulkIds, modalRow, push, workspace]);

  const bulkActions = useMemo<BulkAction[]>(
    () => [
      { id: 'collectAll', label: 'Collect Payments', icon: 'ti ti-cash', onClick: (ids) => push(`Collection started for ${ids.length} invoices`) },
      { id: 'printReceipts', label: 'Print Receipts', icon: 'ti ti-printer', onClick: () => window.print() },
      { id: 'downloadReceipts', label: 'Download Receipts', icon: 'ti ti-download', onClick: (ids) => push(`${ids.length} receipts downloaded`) },
      { id: 'sendReceipts', label: 'Send Receipts', icon: 'ti ti-send', onClick: (ids) => push(`${ids.length} receipts sent`) },
      { id: 'export', label: 'Export Selected', icon: 'ti ti-file-export', onClick: (ids) => push(`${ids.length} collections exported`) },
      {
        id: 'delete', label: 'Delete', icon: 'ti ti-trash', danger: true,
        onClick: (ids) => { setBulkIds(ids); setModalRow(null); setActiveModal('delete'); },
      },
    ],
    [push],
  );

  const rowActions = (row: FeeCollection) => (
    <div className="dt-actions">
      {balanceOf(row) > 0 && row.status !== 'Cancelled' ? (
        <ActionLink className="dt-ib success" title="Collect Payment" ariaLabel="Collect Payment" onClick={() => openModal(row, 'collect')}>
          <i className="ti ti-cash" />
        </ActionLink>
      ) : null}
      <ActionLink className="dt-ib" title="View Invoice" ariaLabel="View Invoice" onClick={() => openModal(row, 'view')}>
        <i className="ti ti-file-invoice" />
      </ActionLink>
      {row.fine > 0 ? (
        <ActionLink className="dt-ib" title="Waive Fine" ariaLabel="Waive Fine" onClick={() => openModal(row, 'waive')}>
          <i className="ti ti-discount-off" />
        </ActionLink>
      ) : null}
      {row.paid > 0 && row.status !== 'Refunded' ? (
        <ActionLink className="dt-ib" title="Issue Refund" ariaLabel="Issue Refund" onClick={() => openModal(row, 'refund')}>
          <i className="ti ti-arrow-back-up" />
        </ActionLink>
      ) : null}
      <ActionLink className="dt-ib" title="Download Receipt" ariaLabel="Download Receipt" onClick={() => push('Receipt downloaded')}>
        <i className="ti ti-download" />
      </ActionLink>
      <ActionLink className="dt-ib" title="Delete" ariaLabel="Delete" onClick={() => openModal(row, 'delete')}>
        <i className="ti ti-trash" />
      </ActionLink>
    </div>
  );

  /* --------------------------------- Panels --------------------------------- */

  const renderDetail = (row: FeeCollection) => {
    const index = indexOf(row);
    return (
      <div className="dt-detail-inner">
        <div className="row g-4">
          <div className="col-xl-3 col-md-6">
            <h4 className="details-heading fs-15 fw-medium"><i className="ti ti-user" />Student Information</h4>
            <ul className="list-unstyled fs-12 mb-3">
              <li className="d-flex align-items-center justify-content-between py-1">
                <span className="text-muted">Admission No</span><span className="fw-medium">{row.admissionNo}</span>
              </li>
              <li className="d-flex align-items-center justify-content-between py-1">
                <span className="text-muted">Class</span><span className="fw-medium">{row.className}-{row.section}</span>
              </li>
              <li className="d-flex align-items-center justify-content-between py-1">
                <span className="text-muted">Invoice</span><span className="fw-medium">{row.invoiceNo}</span>
              </li>
            </ul>
            <h5 className="details-heading fs-15"><i className="ti ti-list-details" />Fee Breakdown</h5>
            <ul className="list-unstyled fs-12 mb-0">
              <li className="d-flex align-items-center justify-content-between py-1">
                <span className="text-muted">{row.feeGroup}</span><span className="fw-medium">{money(row.total)}</span>
              </li>
              <li className="d-flex align-items-center justify-content-between py-1">
                <span className="text-muted">Discount</span><span className="fw-medium">- {money(row.discount)}</span>
              </li>
              <li className="d-flex align-items-center justify-content-between py-1">
                <span className="text-muted">Fine</span><span className="fw-medium">+ {money(row.fine)}</span>
              </li>
              <li className="d-flex align-items-center justify-content-between py-1 border-top">
                <span className="text-muted">Net Payable</span><span className="fw-medium">{money(payableOf(row))}</span>
              </li>
            </ul>
          </div>
          <div className="col-xl-3 col-md-6">
            <h6 className="details-heading"><i className="ti ti-calendar-repeat" />Installment Schedule</h6>
            <ul className="list-unstyled fs-12 mb-3">
              {installmentsOf(row).map((item) => (
                <li className="d-flex align-items-center justify-content-between py-1" key={item.label}>
                  <span className="text-muted">{item.label}</span>
                  <span className="fw-medium">{item.state}</span>
                </li>
              ))}
            </ul>
            <h6 className="details-heading"><i className="ti ti-discount" />Discount &amp; Scholarship</h6>
            <p className="fs-12 text-muted mb-0">{discountTextOf(row)}</p>
          </div>
          <div className="col-xl-3 col-md-6">
            <h6 className="details-heading"><i className="ti ti-alarm" />Fine Calculation</h6>
            <p className="fs-12 text-muted mb-3">{fineTextOf(row)}</p>
            <h6 className="details-heading"><i className="ti ti-receipt" />Complete Payment History</h6>
            <ul className="list-unstyled fs-12 mb-0">
              <li className="d-flex align-items-center justify-content-between py-1">
                <span className="text-muted">{receiptLineOf(row, index)}</span>
                <span className="fw-medium">{money(row.paid)}</span>
              </li>
            </ul>
          </div>
          <div className="col-xl-3 col-md-6">
            <h6 className="details-heading"><i className="ti ti-exchange" />Transaction Reference</h6>
            <p className="fs-12 text-muted mb-2">{transactionRefOf(row, index)}</p>
            <h6 className="details-heading"><i className="ti ti-notes" />Remarks</h6>
            <p className="fs-12 text-muted mb-2">{remarksOf(row)}</p>
            <div className="d-flex gap-2">
              <button type="button" className="btn btn-outline-light bg-white btn-sm flex-fill" onClick={() => openModal(row, 'view')}>
                <i className="ti ti-eye me-1" />View
              </button>
              {balanceOf(row) > 0 && row.status !== 'Cancelled' ? (
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

  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <PageHeader
            title="Collect Fees"
            section="Management"
            dashboardTo={routes.adminDashboard}
            actions={
              <>
                <button
                  type="button"
                  className="btn btn-outline-light bg-white fw-medium d-inline-flex align-items-center me-2 mb-2"
                  onClick={() => openModal(null, 'import')}
                >
                  <i className="ti ti-file-import me-2" />Import Payments
                </button>
                <button
                  type="button"
                  className="btn btn-outline-light bg-white fw-medium d-inline-flex align-items-center me-2 mb-2"
                  onClick={() => window.print()}
                >
                  <i className="ti ti-printer me-2" />Print Receipts
                </button>
                <button
                  type="button"
                  className="btn btn-primary d-flex align-items-center mb-2"
                  onClick={() => openModal(null, 'add')}
                >
                  <i className="ti ti-square-rounded-plus me-2" />Collect Payment
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
            searchPlaceholder="Search students, admission no, invoice or fee group…"
            searchLabel="Search collections"
            savedViews={savedViews}
            filterFields={filterFields}
            quickFilters={quickFilters}
            sortOptions={sortOptions}
            noun="collections"
            openMenu={openMenu}
            onOpenMenu={setOpenMenu}
            onRefresh={() => { setRows(initialRows); push('Collections refreshed'); }}
            onSaveView={() => push('Current view saved')}
            onToast={push}
            renderDetail={renderDetail}
            renderActions={rowActions}
            bulkActions={bulkActions}
            emptyIcon="ti ti-cash-off"
            emptyTitle="No collections match your filters"
            emptyBody="Try adjusting your search terms or clearing the active filters to see more results."
            caption="Fee collection list with student, fee details, payment details and status"
            selectAllLabel="Select all collections"
            rowLabel={(row) => `Select ${row.student}`}
          />
        </div>
      </div>

      {/* Modals */}
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
            <span className="fw-medium">{modalRow.student}</span> owes{' '}
            <span className="fw-medium">{money(balanceOf(modalRow))}</span> on {modalRow.invoiceNo}.
          </p>
        ) : null}
        <div className="row">
          <div className="col-md-6"><div className="mb-3">
            <label className="form-label" htmlFor="cf-amount">Amount Received</label>
            <input
              type="text" className="form-control" id="cf-amount"
              value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00"
            />
          </div></div>
          <div className="col-md-6"><div className="mb-0">
            <label className="form-label" htmlFor="cf-method">Payment Method</label>
            <select
              className="form-select" id="cf-method"
              value={method} onChange={(e) => setMethod(e.target.value as PaymentMethod)}
            >
              {paymentMethodOptions.map((option) => <option key={option}>{option}</option>)}
            </select>
          </div></div>
        </div>
      </Modal>

      <Modal
        open={activeModal === 'add'}
        onClose={() => setActiveModal(null)}
        title="Collect Payment"
        dialogClassName="modal-lg"
        onSubmit={(e) => { e.preventDefault(); setActiveModal(null); push('Payment recorded'); }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={() => setActiveModal(null)}>Cancel</button>
            <button type="submit" className="btn btn-primary">Record Payment</button>
          </>
        }
      >
        <div className="row">
          <div className="col-md-6"><div className="mb-3">
            <label className="form-label" htmlFor="cf-new-student">Student</label>
            <select className="form-select" id="cf-new-student" defaultValue={studentOptions[0]}>
              {studentOptions.map((option) => <option key={option}>{option}</option>)}
            </select>
          </div></div>
          <div className="col-md-6"><div className="mb-3">
            <label className="form-label" htmlFor="cf-new-group">Fee Group</label>
            <select className="form-select" id="cf-new-group" defaultValue={feeGroupOptions[0]}>
              {feeGroupOptions.map((option) => <option key={option}>{option}</option>)}
            </select>
          </div></div>
          <div className="col-md-6"><div className="mb-3">
            <label className="form-label" htmlFor="cf-new-amount">Amount</label>
            <input type="text" className="form-control" id="cf-new-amount" placeholder="0.00" />
          </div></div>
          <div className="col-md-6"><div className="mb-0">
            <label className="form-label" htmlFor="cf-new-method">Payment Method</label>
            <select className="form-select" id="cf-new-method" defaultValue={paymentMethodOptions[0]}>
              {paymentMethodOptions.map((option) => <option key={option}>{option}</option>)}
            </select>
          </div></div>
        </div>
      </Modal>

      <Modal
        open={activeModal === 'view' && modalRow !== null}
        onClose={() => setActiveModal(null)}
        title="Invoice Details"
        dialogClassName="modal-lg"
        footer={<button type="button" className="btn btn-light" onClick={() => setActiveModal(null)}>Close</button>}
      >
        {modalRow ? (
          <>
            <div className="d-flex align-items-center mb-3 pb-3 border-bottom">
              <span className="avatar avatar-lg me-3">
                <ImageWithBasePath src={modalRow.avatar} className="rounded" alt={modalRow.student} />
              </span>
              <div>
                <div className="d-flex align-items-center gap-2 flex-wrap">
                  <h5 className="mb-0">{modalRow.student}</h5>
                  <span className="badge bg-primary-transparent text-primary">{modalRow.invoiceNo}</span>
                  <span className={statusBadge[modalRow.status]}>{modalRow.status}</span>
                </div>
                <p className="mb-0 text-muted fs-13">
                  {modalRow.feeGroup} · {money(payableOf(modalRow))} payable · {money(balanceOf(modalRow))} balance
                </p>
              </div>
            </div>
            {renderDetail(modalRow)}
          </>
        ) : null}
      </Modal>

      <Modal
        open={activeModal === 'waive' && modalRow !== null}
        onClose={() => setActiveModal(null)}
        title="Waive Fine"
        onSubmit={(e) => { e.preventDefault(); waiveFine(); }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={() => setActiveModal(null)}>Cancel</button>
            <button type="submit" className="btn btn-primary">Waive Fine</button>
          </>
        }
      >
        <p className="fs-13 mb-0">
          Waive the <span className="fw-medium">{money(modalRow?.fine ?? 0)}</span> late fine on{' '}
          <span className="fw-medium">{modalRow?.invoiceNo}</span>? The net payable drops by the same amount.
        </p>
      </Modal>

      <Modal
        open={activeModal === 'refund' && modalRow !== null}
        onClose={() => setActiveModal(null)}
        title="Issue Refund"
        onSubmit={(e) => { e.preventDefault(); issueRefund(); }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={() => setActiveModal(null)}>Cancel</button>
            <button type="submit" className="btn btn-primary">Issue Refund</button>
          </>
        }
      >
        <p className="fs-13 mb-0">
          Refund <span className="fw-medium">{money(modalRow?.paid ?? 0)}</span> collected from{' '}
          <span className="fw-medium">{modalRow?.student}</span> against {modalRow?.invoiceNo}.
        </p>
      </Modal>

      <Modal
        open={activeModal === 'import'}
        onClose={() => setActiveModal(null)}
        title="Import Payments"
        onSubmit={(e) => { e.preventDefault(); setActiveModal(null); push('Payments imported'); }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={() => setActiveModal(null)}>Cancel</button>
            <button type="submit" className="btn btn-primary">Import</button>
          </>
        }
      >
        <div className="mb-0">
          <label className="form-label" htmlFor="cf-import">CSV File</label>
          <input type="file" className="form-control" id="cf-import" accept=".csv" />
        </div>
      </Modal>

      <Modal
        open={activeModal === 'delete'}
        onClose={() => setActiveModal(null)}
        title="Delete Collection"
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
            ? `Delete ${bulkIds.length} selected collections? This cannot be undone.`
            : `Delete ${modalRow?.invoiceNo}? This cannot be undone.`}
        </p>
      </Modal>

      <ToastStack toasts={toasts} onDismiss={dismiss} id="cfToasts" />
    </>
  );
};

export default CollectFees;
