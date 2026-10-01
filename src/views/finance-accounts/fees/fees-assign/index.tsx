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
import type { AssignStatus, FeeAssignment } from './data/feesAssign.data';
import {
  academicYearOptions, assignmentStatusOptions, balanceOf, classOptions, discountTextOf,
  feeAssignments as initialRows, feeGroupOptions, feeTypeOptions, installmentsOf, lateFeeRules,
  money, payableOf, paymentStatusOptions, percentOf, receiptNoOf, remarksOf, searchIndexOf,
  sectionOptions, statusBadge, statusPill, studentOptions,
} from './data/feesAssign.data';

const routes = all_routes;

const filterFields: FilterField[] = [
  { id: 'academic-year', label: 'Academic Year', kind: 'select', chipLabel: 'Year', options: academicYearOptions },
  { id: 'fee-group', label: 'Fee Group', kind: 'select', chipLabel: 'Group', options: feeGroupOptions },
  { id: 'fee-type', label: 'Fee Type', kind: 'select', chipLabel: 'Type', options: feeTypeOptions },
  { id: 'class', label: 'Class', kind: 'select', chipLabel: 'Class', options: classOptions },
  { id: 'section', label: 'Section', kind: 'select', chipLabel: 'Section', options: sectionOptions },
  { id: 'student', label: 'Student', kind: 'select', chipLabel: 'Student', options: studentOptions },
  { id: 'assignment-status', label: 'Assignment Status', kind: 'select', chipLabel: 'Status', options: assignmentStatusOptions },
  { id: 'payment-status', label: 'Payment Status', kind: 'select', chipLabel: 'Payment', options: paymentStatusOptions },
];

const sortOptions: SortOption[] = [
  { id: 'name', label: 'Student Name (A–Z)', icon: 'ti ti-abc' },
  { id: 'total', label: 'Total Amount', icon: 'ti ti-cash' },
  { id: 'balance', label: 'Balance', icon: 'ti ti-wallet' },
  { id: 'due', label: 'Due Date', icon: 'ti ti-calendar-due' },
  { id: 'recent', label: 'Recently updated', icon: 'ti ti-history' },
];

type AssignModalId = 'add' | 'edit' | 'view' | 'import' | 'delete' | 'collect' | 'discount' | 'invoice';

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const dateKey = (value: string): number => {
  const [day, month, year] = value.split(' ');
  const index = months.indexOf(month);
  if (index === -1) return 0;
  return Number(year) * 10000 + (index + 1) * 100 + Number(day);
};

const FeesAssign = () => {
  const [rows, setRows] = useState<FeeAssignment[]>(initialRows);
  const [openMenu, setOpenMenu] = useState<WorkspaceMenu>(null);
  const [activeModal, setActiveModal] = useState<AssignModalId | null>(null);
  const [modalRow, setModalRow] = useState<FeeAssignment | null>(null);
  const [bulkIds, setBulkIds] = useState<string[]>([]);
  const [amount, setAmount] = useState('');

  const { loading } = useReveal();
  const { toasts, push, dismiss } = useToasts();

  const openModal = useCallback((row: FeeAssignment | null, modal: AssignModalId) => {
    setModalRow(row);
    setBulkIds([]);
    setActiveModal(modal);
    if (modal === 'collect' && row) setAmount(String(balanceOf(row)));
  }, []);

  /** Index in the source roster, which is what the receipt number keys off. */
  const indexOf = useCallback((row: FeeAssignment) => initialRows.findIndex((r) => r.id === row.id), []);

  const columns = useMemo<ColumnDef<FeeAssignment>[]>(
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
        id: 'assign', label: 'Fee Assignment',
        render: (row) => (
          <ul className="list-unstyled mb-0 fs-12">
            <li className="py-1">
              <span className="badge badge-soft-primary"><i className="ti ti-folder me-1" />{row.feeGroup}</span>{' '}
              <span className="badge badge-soft-info"><i className="ti ti-tag me-1" />{row.feeType}</span>
            </li>
            <li className="py-1 text-muted">
              <i className="ti ti-calendar me-1" />{row.academicYear}
            </li>
            <li className="py-1 text-muted">
              <i className="ti ti-calendar-plus me-1" />Assigned{' '}
              <span className="fw-medium text-dark">{row.assignedDate}</span>
            </li>
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
                <li className="py-1 text-muted">Total {money(row.total)} · Disc {money(row.discount)}</li>
                <li className="py-1 text-muted">
                  Bal <span className="fw-medium text-dark">{money(balanceOf(row))}</span>
                </li>
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

  const workspace = useWorkspace<FeeAssignment>({
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
      if (filters['assignment-status'] && row.status !== filters['assignment-status']) return false;
      if (filters['payment-status'] && row.status !== filters['payment-status']) return false;
      return true;
    },
    // The rail's "Partial" chip carries the id "Partially Paid".
    quickMatch: (row, quick) => !quick || row.status === quick,
    viewMatch: (row, view) => (view === 'all' ? true : row.status === view),
    compare: (a, b, sort) => {
      switch (sort) {
        case 'total': return b.total - a.total || a.student.localeCompare(b.student);
        case 'balance': return balanceOf(b) - balanceOf(a) || a.student.localeCompare(b.student);
        case 'due': return dateKey(a.dueDate) - dateKey(b.dueDate) || a.student.localeCompare(b.student);
        case 'recent': return dateKey(b.assignedDate) - dateKey(a.assignedDate) || a.student.localeCompare(b.student);
        case 'name':
        default: return a.student.localeCompare(b.student);
      }
    },
    defaultSort: 'name',
  });

  const countBy = useCallback(
    (status: AssignStatus) => rows.filter((row) => row.status === status).length,
    [rows],
  );

  const savedViews = useMemo<SavedView[]>(
    () => [
      { id: 'all', label: 'All Assignments', icon: 'ti ti-layout-list', count: rows.length },
      { id: 'Assigned', label: 'Assigned', icon: 'ti ti-clipboard-check', count: countBy('Assigned') },
      { id: 'Pending', label: 'Pending', icon: 'ti ti-clock', count: countBy('Pending') },
      { id: 'Partially Paid', label: 'Partially Paid', icon: 'ti ti-progress', count: countBy('Partially Paid') },
      { id: 'Paid', label: 'Paid', icon: 'ti ti-circle-check', count: countBy('Paid') },
      { id: 'Overdue', label: 'Overdue', icon: 'ti ti-alert-triangle', count: countBy('Overdue') },
    ],
    [countBy, rows.length],
  );

  const quickFilters = useMemo<QuickFilter[]>(
    () => [
      { id: 'Assigned', label: 'Assigned', icon: 'ti ti-clipboard-check', count: countBy('Assigned') },
      { id: 'Pending', label: 'Pending', icon: 'ti ti-clock', count: countBy('Pending') },
      { id: 'Partially Paid', label: 'Partially Paid', icon: 'ti ti-progress', count: countBy('Partially Paid') },
      { id: 'Paid', label: 'Paid', icon: 'ti ti-circle-check', count: countBy('Paid') },
      { id: 'Overdue', label: 'Overdue', icon: 'ti ti-alert-triangle', count: countBy('Overdue') },
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
        const status: AssignStatus = paid >= payableOf(row) ? 'Paid' : 'Partially Paid';
        return { ...row, paid, status };
      }),
    );
    setActiveModal(null);
    push(`${money(received)} collected from ${modalRow.student}`);
  }, [amount, modalRow, push]);

  const cancelAssignment = useCallback(
    (ids: string[]) => {
      setRows((current) =>
        current.map((row) => (ids.includes(row.id) ? { ...row, status: 'Cancelled' as const } : row)),
      );
      workspace.clearSelection();
      push(`${ids.length} ${ids.length === 1 ? 'assignment' : 'assignments'} cancelled`);
    },
    [push, workspace],
  );

  const remove = useCallback(() => {
    const ids = bulkIds.length > 0 ? bulkIds : modalRow ? [modalRow.id] : [];
    setRows((current) => current.filter((row) => !ids.includes(row.id)));
    workspace.clearSelection();
    setActiveModal(null);
    push(`${ids.length} ${ids.length === 1 ? 'assignment' : 'assignments'} deleted`);
  }, [bulkIds, modalRow, push, workspace]);

  const bulkActions = useMemo<BulkAction[]>(
    () => [
      { id: 'assign', label: 'Assign Fees', icon: 'ti ti-clipboard-plus', onClick: () => openModal(null, 'add') },
      { id: 'collectAll', label: 'Collect Payments', icon: 'ti ti-cash', onClick: (ids) => push(`Collection started for ${ids.length} assignments`) },
      { id: 'invoices', label: 'Generate Invoices', icon: 'ti ti-file-invoice', onClick: (ids) => push(`${ids.length} invoices generated`) },
      { id: 'export', label: 'Export Selected', icon: 'ti ti-file-export', onClick: (ids) => push(`${ids.length} assignments exported`) },
      { id: 'print', label: 'Print', icon: 'ti ti-printer', onClick: () => window.print() },
      { id: 'cancel', label: 'Cancel Assignment', icon: 'ti ti-ban', onClick: cancelAssignment },
      {
        id: 'delete', label: 'Delete', icon: 'ti ti-trash', danger: true,
        onClick: (ids) => { setBulkIds(ids); setModalRow(null); setActiveModal('delete'); },
      },
    ],
    [cancelAssignment, openModal, push],
  );

  const rowActions = (row: FeeAssignment) => (
    <div className="dt-actions">
      <ActionLink className="dt-ib" title="View Assignment" ariaLabel="View Assignment" onClick={() => openModal(row, 'view')}>
        <i className="ti ti-eye" />
      </ActionLink>
      <ActionLink className="dt-ib" title="Edit Assignment" ariaLabel="Edit Assignment" onClick={() => openModal(row, 'edit')}>
        <i className="ti ti-edit" />
      </ActionLink>
      {balanceOf(row) > 0 && row.status !== 'Cancelled' ? (
        <ActionLink className="dt-ib success" title="Collect Payment" ariaLabel="Collect Payment" onClick={() => openModal(row, 'collect')}>
          <i className="ti ti-cash" />
        </ActionLink>
      ) : null}
      <ActionLink className="dt-ib" title="Generate Invoice" ariaLabel="Generate Invoice" onClick={() => openModal(row, 'invoice')}>
        <i className="ti ti-file-invoice" />
      </ActionLink>
      <ActionLink className="dt-ib" title="Delete" ariaLabel="Delete" onClick={() => openModal(row, 'delete')}>
        <i className="ti ti-trash" />
      </ActionLink>
    </div>
  );

  /* --------------------------------- Panels --------------------------------- */

  const renderDetail = (row: FeeAssignment) => {
    const receipt = receiptNoOf(row, indexOf(row));
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
                <span className="text-muted">Roll No</span><span className="fw-medium">{row.roll}</span>
              </li>
            </ul>
            <h5 className="details-heading fs-15"><i className="ti ti-list-details" />Assigned Fee Breakdown</h5>
            <ul className="list-unstyled fs-12 mb-0">
              <li className="d-flex align-items-center justify-content-between py-1">
                <span className="text-muted">{row.feeGroup}</span><span className="fw-medium">{money(row.total)}</span>
              </li>
              <li className="d-flex align-items-center justify-content-between py-1">
                <span className="text-muted">Discount</span><span className="fw-medium">- {money(row.discount)}</span>
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
            <h6 className="details-heading"><i className="ti ti-discount" />Discount Details</h6>
            <p className="fs-12 text-muted mb-0">{discountTextOf(row)}</p>
          </div>
          <div className="col-xl-3 col-md-6">
            <h6 className="details-heading"><i className="ti ti-alarm" />Late Fee Rules</h6>
            <p className="fs-12 text-muted mb-3">{lateFeeRules}</p>
            <h6 className="details-heading"><i className="ti ti-receipt" />Payment History</h6>
            <ul className="list-unstyled fs-12 mb-0">
              <li className="d-flex align-items-center justify-content-between py-1">
                <span className="text-muted">{receipt ? `Receipt #${receipt}` : 'No payments yet'}</span>
                <span className="fw-medium">{money(row.paid)}</span>
              </li>
            </ul>
          </div>
          <div className="col-xl-3 col-md-6">
            <h6 className="details-heading"><i className="ti ti-notes" />Remarks</h6>
            <p className="fs-12 text-muted mb-2">{remarksOf(row)}</p>
            <h6 className="details-heading"><i className="ti ti-paperclip" />Attachments</h6>
            <p className="fs-12 text-muted mb-2">
              {receipt ? `Receipt #${receipt} · PDF` : 'No attachments for this assignment.'}
            </p>
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

  const assignForm = (row: FeeAssignment | null) => (
    <div className="row">
      <div className="col-md-6"><div className="mb-3">
        <label className="form-label" htmlFor="fa-student">Student</label>
        <select className="form-select" id="fa-student" defaultValue={row?.student ?? studentOptions[0]}>
          {studentOptions.map((option) => <option key={option}>{option}</option>)}
        </select>
      </div></div>
      <div className="col-md-6"><div className="mb-3">
        <label className="form-label" htmlFor="fa-group">Fee Group</label>
        <select className="form-select" id="fa-group" defaultValue={row?.feeGroup ?? feeGroupOptions[0]}>
          {feeGroupOptions.map((option) => <option key={option}>{option}</option>)}
        </select>
      </div></div>
      <div className="col-md-6"><div className="mb-3">
        <label className="form-label" htmlFor="fa-type">Fee Type</label>
        <select className="form-select" id="fa-type" defaultValue={row?.feeType ?? feeTypeOptions[0]}>
          {feeTypeOptions.map((option) => <option key={option}>{option}</option>)}
        </select>
      </div></div>
      <div className="col-md-6"><div className="mb-3">
        <label className="form-label" htmlFor="fa-year">Academic Year</label>
        <select className="form-select" id="fa-year" defaultValue={row?.academicYear ?? academicYearOptions[0]}>
          {academicYearOptions.map((option) => <option key={option}>{option}</option>)}
        </select>
      </div></div>
      <div className="col-md-6"><div className="mb-3">
        <label className="form-label" htmlFor="fa-total">Total Amount</label>
        <input type="text" className="form-control" id="fa-total" defaultValue={row ? String(row.total) : ''} placeholder="0.00" />
      </div></div>
      <div className="col-md-6"><div className="mb-3">
        <label className="form-label" htmlFor="fa-discount">Discount</label>
        <input type="text" className="form-control" id="fa-discount" defaultValue={row ? String(row.discount) : ''} placeholder="0.00" />
      </div></div>
      <div className="col-md-6"><div className="mb-3">
        <label className="form-label" htmlFor="fa-due">Due Date</label>
        <input type="text" className="form-control" id="fa-due" defaultValue={row?.dueDate ?? ''} placeholder="10-05-2024" />
      </div></div>
      <div className="col-md-6"><div className="mb-0">
        <label className="form-label" htmlFor="fa-status">Assignment Status</label>
        <select className="form-select" id="fa-status" defaultValue={row?.status ?? assignmentStatusOptions[0]}>
          {assignmentStatusOptions.map((option) => <option key={option}>{option}</option>)}
        </select>
      </div></div>
    </div>
  );

  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <PageHeader
            title="Fees Assign"
            section="Management"
            dashboardTo={routes.adminDashboard}
            actions={
              <>
                <button
                  type="button"
                  className="btn btn-outline-light bg-white fw-medium d-inline-flex align-items-center me-2 mb-2"
                  onClick={() => openModal(null, 'import')}
                >
                  <i className="ti ti-file-import me-2" />Import Assignments
                </button>
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
                  onClick={() => openModal(null, 'add')}
                >
                  <i className="ti ti-square-rounded-plus me-2" />Assign Fees
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
            searchPlaceholder="Search students, admission no, fee group or type…"
            searchLabel="Search assignments"
            savedViews={savedViews}
            filterFields={filterFields}
            quickFilters={quickFilters}
            sortOptions={sortOptions}
            noun="assignments"
            openMenu={openMenu}
            onOpenMenu={setOpenMenu}
            onRefresh={() => { setRows(initialRows); push('Assignments refreshed'); }}
            onSaveView={() => push('Current view saved')}
            onToast={push}
            renderDetail={renderDetail}
            renderActions={rowActions}
            bulkActions={bulkActions}
            emptyIcon="ti ti-clipboard-off"
            emptyTitle="No assignments match your filters"
            emptyBody="Try adjusting your search terms or clearing the active filters to see more results."
            caption="Fee assignment list with student, assignment, payment details and status"
            selectAllLabel="Select all assignments"
            rowLabel={(row) => `Select ${row.student}`}
          />
        </div>
      </div>

      {/* Modals */}
      <Modal
        open={activeModal === 'add'}
        onClose={() => setActiveModal(null)}
        title="Assign Fees"
        dialogClassName="modal-lg"
        onSubmit={(e) => { e.preventDefault(); setActiveModal(null); push('Fees assigned'); }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={() => setActiveModal(null)}>Cancel</button>
            <button type="submit" className="btn btn-primary">Assign Fees</button>
          </>
        }
      >
        {assignForm(null)}
      </Modal>

      <Modal
        open={activeModal === 'edit' && modalRow !== null}
        onClose={() => setActiveModal(null)}
        title="Edit Assignment"
        dialogClassName="modal-lg"
        onSubmit={(e) => { e.preventDefault(); setActiveModal(null); push(`${modalRow?.student}'s assignment updated`); }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={() => setActiveModal(null)}>Cancel</button>
            <button type="submit" className="btn btn-primary">Save Changes</button>
          </>
        }
      >
        {assignForm(modalRow)}
      </Modal>

      <Modal
        open={activeModal === 'view' && modalRow !== null}
        onClose={() => setActiveModal(null)}
        title="Assignment Details"
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
                  <span className="badge bg-primary-transparent text-primary">{modalRow.admissionNo}</span>
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
            <span className="fw-medium">{money(balanceOf(modalRow))}</span> on {modalRow.feeGroup}.
          </p>
        ) : null}
        <div className="mb-0">
          <label className="form-label" htmlFor="fa-collect">Amount Received</label>
          <input
            type="text"
            className="form-control"
            id="fa-collect"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
          />
        </div>
      </Modal>

      <Modal
        open={activeModal === 'invoice' && modalRow !== null}
        onClose={() => setActiveModal(null)}
        title="Generate Invoice"
        onSubmit={(e) => { e.preventDefault(); setActiveModal(null); push(`Invoice generated for ${modalRow?.student}`); }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={() => setActiveModal(null)}>Cancel</button>
            <button type="submit" className="btn btn-primary">Generate Invoice</button>
          </>
        }
      >
        {modalRow ? (
          <p className="fs-13 mb-0">
            Generate an invoice for <span className="fw-medium">{modalRow.student}</span> covering{' '}
            {modalRow.feeGroup} at {money(payableOf(modalRow))}.
          </p>
        ) : null}
      </Modal>

      <Modal
        open={activeModal === 'import'}
        onClose={() => setActiveModal(null)}
        title="Import Assignments"
        onSubmit={(e) => { e.preventDefault(); setActiveModal(null); push('Assignments imported'); }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={() => setActiveModal(null)}>Cancel</button>
            <button type="submit" className="btn btn-primary">Import</button>
          </>
        }
      >
        <div className="mb-0">
          <label className="form-label" htmlFor="fa-import">CSV File</label>
          <input type="file" className="form-control" id="fa-import" accept=".csv" />
        </div>
      </Modal>

      <Modal
        open={activeModal === 'delete'}
        onClose={() => setActiveModal(null)}
        title="Delete Assignment"
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
            ? `Delete ${bulkIds.length} selected assignments? This cannot be undone.`
            : `Delete ${modalRow?.student}'s assignment? This cannot be undone.`}
        </p>
      </Modal>

      <ToastStack toasts={toasts} onDismiss={dismiss} id="faToasts" />
    </>
  );
};

export default FeesAssign;
