import { useCallback, useMemo, useState } from 'react';
import Modal from '@components/ui/Modal';
import ToastStack from '@components/ui/ToastStack';
import { PageHeader, QueueWorkspaceShell, useWorkspace } from '@components/workspace';
import type { ColumnDef, FilterField, SavedView, WorkspaceMenu } from '@components/workspace';
import ImageWithBasePath from '@core/common/imageWithBasePath';
import { all_routes } from '@/routes/all_routes';
import { useReveal } from '@hooks/useReveal';
import { useToasts } from '@hooks/useToasts';
import type { Expense, ExpenseStatus } from './data/expenses.data';
import {
  categoryOptions, dateRangeOptions, departmentOptions, expenseMonthOf, expenses as initialRows,
  methodOptions, money, ownerOptions, priorityBadge, priorityClass, priorityOptions, receiptsOf,
  searchIndexOf, statusIcon, statusOptions, statusPill, timelineOf,
} from './data/expenses.data';

const routes = all_routes;

const filterFields: FilterField[] = [
  { id: 'category', label: 'Category', kind: 'select', chipLabel: 'Category', options: categoryOptions },
  { id: 'department', label: 'Department', kind: 'select', chipLabel: 'Dept', options: departmentOptions },
  { id: 'expense-owner', label: 'Expense Owner', kind: 'select', chipLabel: 'Owner', options: ownerOptions },
  { id: 'approval-status', label: 'Approval Status', kind: 'select', chipLabel: 'Status', options: statusOptions },
  { id: 'payment-method', label: 'Payment Method', kind: 'select', chipLabel: 'Method', options: methodOptions },
  { id: 'date-range', label: 'Date Range', kind: 'select', chipLabel: 'Period', options: dateRangeOptions },
];

type ExpenseModalId =
  | 'add' | 'edit' | 'approve' | 'reject' | 'sendback' | 'reqdocs' | 'reviewer'
  | 'reimbursement' | 'payment' | 'receipt' | 'delete';

const Expenses = () => {
  const [rows, setRows] = useState<Expense[]>(initialRows);
  const [openMenu, setOpenMenu] = useState<WorkspaceMenu>(null);
  const [activeModal, setActiveModal] = useState<ExpenseModalId | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(initialRows[0].id);
  const [note, setNote] = useState('');
  const [comment, setComment] = useState('');
  const [reviewer, setReviewer] = useState(ownerOptions[0]);

  const { loading } = useReveal();
  const { toasts, push, dismiss } = useToasts();

  const openModal = useCallback((modal: ExpenseModalId) => {
    setNote('');
    setActiveModal(modal);
  }, []);

  /** No grid on this page; the Columns menu drives which card fields show. */
  const columns = useMemo<ColumnDef<Expense>[]>(
    () => [
      { id: 'category', label: 'Category', render: (row) => row.category },
      { id: 'status', label: 'Status', render: (row) => row.status },
      { id: 'priority', label: 'Priority', render: (row) => row.priority },
      { id: 'submitted', label: 'Submitted', render: (row) => row.submittedDate },
    ],
    [],
  );

  const workspace = useWorkspace<Expense>({
    rows, filterFields, columns,
    getId: (row) => row.id,
    search: (row, term) => searchIndexOf(row).includes(term),
    matches: (row, filters) => {
      if (filters.category && row.category !== filters.category) return false;
      if (filters.department && row.department !== filters.department) return false;
      if (filters['expense-owner'] && row.employee !== filters['expense-owner']) return false;
      if (filters['approval-status'] && row.status !== filters['approval-status']) return false;
      if (filters['payment-method'] && row.method !== filters['payment-method']) return false;
      if (filters['date-range'] && expenseMonthOf(row) !== filters['date-range']) return false;
      return true;
    },
    viewMatch: (row, view) => (view === 'all' ? true : row.status === view),
    compare: (a, b) => b.expenseId.localeCompare(a.expenseId),
    defaultSort: 'recent',
    pageSize: 100,
  });

  const selected = rows.find((row) => row.id === selectedId) ?? null;

  const countBy = useCallback(
    (status: ExpenseStatus) => rows.filter((row) => row.status === status).length,
    [rows],
  );

  const savedViews = useMemo<SavedView[]>(
    () => [
      { id: 'all', label: 'All Expenses', icon: 'ti ti-layout-list', count: rows.length },
      { id: 'Pending', label: 'Pending Approval', icon: 'ti ti-clock', count: countBy('Pending') },
      { id: 'In Review', label: 'In Review', icon: 'ti ti-eye-search', count: countBy('In Review') },
      { id: 'Approved', label: 'Approved', icon: 'ti ti-circle-check', count: countBy('Approved') },
      { id: 'Reimbursed', label: 'Reimbursed', icon: 'ti ti-wallet', count: countBy('Reimbursed') },
      { id: 'Rejected', label: 'Rejected', icon: 'ti ti-circle-x', count: countBy('Rejected') },
    ],
    [countBy, rows.length],
  );

  /* --------------------------------- Actions -------------------------------- */

  const decide = useCallback(
    (status: ExpenseStatus, message: string) => {
      if (!selected) return;
      setRows((current) => current.map((row) => (row.id === selected.id ? { ...row, status } : row)));
      setActiveModal(null);
      push(message);
    },
    [push, selected],
  );

  const postComment = useCallback(() => {
    if (!selected || !comment.trim()) return;
    setRows((current) =>
      current.map((row) =>
        row.id === selected.id
          ? {
              ...row,
              discussion: [
                ...row.discussion,
                {
                  author: 'Finance Office', role: '', timestamp: '22 Jul 2026 · 10:00 AM',
                  message: comment.trim(), avatar: null,
                },
              ],
            }
          : row,
      ),
    );
    setComment('');
    push('Comment posted');
  }, [comment, push, selected]);

  /* ---------------------------------- Cards --------------------------------- */

  const renderCard = (row: Expense, isSelected: boolean) => (
    <button
      type="button"
      className={`exp-card ${priorityClass[row.priority]}${isSelected ? ' active' : ''}`}
      onClick={() => setSelectedId(row.id)}
    >
      <div className="d-flex align-items-start justify-content-between gap-2 mb-2">
        <span className="exp-card-title">{row.title}</span>
        <span className="exp-card-amount">{money(row.amount)}</span>
      </div>
      <div className="d-flex align-items-center gap-2 mb-2">
        <span className="avatar avatar-sm">
          <ImageWithBasePath src={row.avatar} className="rounded-circle flex-shrink-0" alt={row.employee} />
        </span>
        <div className="overflow-hidden">
          <span className="d-block fs-13 fw-medium text-truncate">{row.employee}</span>
          <span className="exp-card-meta">{row.department} · {row.expenseId}</span>
        </div>
      </div>
      <div className="d-flex align-items-center justify-content-between flex-wrap gap-1">
        <span className={`badge badge-soft-${row.categoryTint}`}>
          <i className="ti ti-tag me-1" />{row.category}
        </span>
        <span className={`dt-pill ${statusPill[row.status]}`}>
          <i className={statusIcon[row.status]} />{row.status}
        </span>
      </div>
      <div className="d-flex align-items-center justify-content-between mt-2 pt-2 border-top">
        <span className="exp-card-meta"><i className="ti ti-clock me-1" />Submitted {row.submittedDate}</span>
        <span className={priorityBadge[row.priority]}>
          <i className="ti ti-flag-3 me-1" />{row.priority}
        </span>
      </div>
    </button>
  );

  /* --------------------------------- Detail --------------------------------- */

  const infoItem = (icon: string, label: string, value: string) => (
    <div className="col-sm-6 col-lg-4">
      <div className="exp-info-item">
        <span className="exp-info-label"><i className={`${icon} me-1`} />{label}</span>
        <span className="exp-info-val">{value}</span>
      </div>
    </div>
  );

  const renderDetail = (row: Expense) => (
    <>
      <div className="card">
        <div className="card-body">
          <div className="exp-hero pb-3 mb-3 border-bottom">
            <div className="d-flex align-items-center gap-3">
              <span className="avatar avatar-lg">
                <ImageWithBasePath src={row.avatar} className="rounded-circle flex-shrink-0" alt={row.employee} />
              </span>
              <div>
                <h4 className="mb-1">{row.title}</h4>
                <span className="fs-13 text-muted">
                  {row.employee} · {row.employeeId} · {row.designation}
                </span>
              </div>
            </div>
            <div className="text-md-end">
              <span className="exp-hero-amount">{money(row.amount)}</span>
              <div className="d-flex align-items-center gap-1 mt-1 justify-content-md-end">
                <span className={`dt-pill ${statusPill[row.status]}`}>
                  <i className={statusIcon[row.status]} />{row.status}
                </span>
              </div>
            </div>
          </div>

          <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3">
            <h5 className="mb-0 fs-15"><i className="ti ti-info-circle me-2 text-primary" />Expense Information</h5>
            <div className="d-flex align-items-center gap-2">
              <span className={priorityBadge[row.priority]}>
                <i className="ti ti-flag-3 me-1" />{row.priority} priority
              </span>
              <button
                type="button"
                className="btn btn-icon btn-sm btn-outline-light bg-white"
                aria-label="Edit expense"
                onClick={() => openModal('edit')}
              >
                <i className="ti ti-edit" />
              </button>
              <button
                type="button"
                className="btn btn-icon btn-sm btn-outline-light bg-white text-danger"
                aria-label="Delete expense"
                onClick={() => openModal('delete')}
              >
                <i className="ti ti-trash" />
              </button>
            </div>
          </div>

          <div className="row g-3">
            {infoItem('ti ti-user', 'Employee', `${row.employee} · ${row.employeeId}`)}
            {infoItem('ti ti-building', 'Department', row.department)}
            {infoItem('ti ti-tag', 'Category', row.category)}
            {infoItem('ti ti-calendar', 'Expense Date', row.expenseDate)}
            {infoItem('ti ti-building-store', 'Vendor', row.vendor)}
            {infoItem('ti ti-credit-card', 'Payment Method', row.method)}
            {infoItem('ti ti-hash', 'Reference No', row.reference)}
            <div className="col-12">
              <div className="exp-info-item">
                <span className="exp-info-label"><i className="ti ti-align-left me-1" />Description</span>
                <span className="exp-info-val">{row.description}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header d-flex align-items-center justify-content-between">
          <h6 className="mb-0">
            <i className="ti ti-paperclip me-2 text-primary" />Receipts{' '}
            <span className="badge badge-soft-secondary ms-1">{row.receipts}</span>
          </h6>
          <button
            type="button"
            className="btn btn-outline-light bg-white btn-sm"
            onClick={() => push('All receipts downloaded')}
          >
            <i className="ti ti-download me-1" />Download All
          </button>
        </div>
        <div className="card-body">
          <div className="row g-2">
            {receiptsOf(row).map((file) => (
              <div className="col-sm-6" key={file.name}>
                <div className="exp-receipt">
                  <span className="exp-receipt-ic"><i className={file.icon} /></span>
                  <div className="flex-fill overflow-hidden">
                    <span className="d-block fs-13 fw-medium text-truncate">{file.name}</span>
                    <span className="fs-12 text-muted">{file.meta}</span>
                  </div>
                  <div className="d-flex gap-1">
                    <button
                      type="button"
                      className="btn btn-icon btn-sm btn-outline-light bg-white"
                      aria-label="Zoom receipt"
                      onClick={() => openModal('receipt')}
                    >
                      <i className="ti ti-zoom-in" />
                    </button>
                    <button
                      type="button"
                      className="btn btn-icon btn-sm btn-outline-light bg-white"
                      aria-label="Download receipt"
                      onClick={() => push(`${file.name} downloaded`)}
                    >
                      <i className="ti ti-download" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="row g-3">
        <div className="col-12 col-lg-6">
          <div className="card h-100 mb-0">
            <div className="card-header">
              <h6 className="mb-0"><i className="ti ti-timeline-event me-2 text-primary" />Approval Timeline</h6>
            </div>
            <div className="card-body">
              <ul className="exp-tl">
                {timelineOf(row).map((step) => (
                  <li className={`exp-tl-step${step.done ? ' is-done' : ''}`} key={step.title}>
                    <span className="exp-tl-ic"><i className={step.icon} /></span>
                    <div>
                      <span className="exp-tl-title d-block">{step.title}</span>
                      <span className="exp-tl-meta">{step.meta}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-6">
          <div className="card h-100 mb-0">
            <div className="card-header">
              <h6 className="mb-0"><i className="ti ti-checkup-list me-2 text-primary" />Approval Actions</h6>
            </div>
            <div className="card-body">
              <div className="d-flex flex-wrap gap-2">
                <button type="button" className="btn btn-success btn-sm" onClick={() => openModal('approve')}>
                  <i className="ti ti-check me-1" />Approve
                </button>
                <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => openModal('reject')}>
                  <i className="ti ti-x me-1" />Reject
                </button>
                <button type="button" className="btn btn-outline-light bg-white btn-sm" onClick={() => openModal('sendback')}>
                  <i className="ti ti-arrow-back me-1" />Send Back
                </button>
                <button type="button" className="btn btn-outline-light bg-white btn-sm" onClick={() => openModal('reqdocs')}>
                  <i className="ti ti-file-plus me-1" />Request Docs
                </button>
                <button type="button" className="btn btn-outline-light bg-white btn-sm" onClick={() => openModal('reviewer')}>
                  <i className="ti ti-user-plus me-1" />Assign Reviewer
                </button>
                <button type="button" className="btn btn-outline-light bg-white btn-sm" onClick={() => openModal('payment')}>
                  <i className="ti ti-wallet me-1" />Mark Reimbursed
                </button>
                <button type="button" className="btn btn-outline-light bg-white btn-sm" onClick={() => push('Report downloaded')}>
                  <i className="ti ti-file-download me-1" />Download PDF
                </button>
                <button type="button" className="btn btn-outline-light bg-white btn-sm" onClick={() => window.print()}>
                  <i className="ti ti-printer me-1" />Print
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card mt-3 mb-0">
        <div className="card-header">
          <h6 className="mb-0"><i className="ti ti-message-circle me-2 text-primary" />Discussion</h6>
        </div>
        <div className="card-body">
          {row.discussion.length === 0 ? (
            <p className="fs-13 text-muted mb-3">No comments on this expense yet.</p>
          ) : (
            row.discussion.map((entry, index) => (
              <div className="d-flex gap-2 mb-3" key={`${entry.author}-${index}`}>
                {entry.avatar ? (
                  <span className="avatar avatar-sm flex-shrink-0">
                    <ImageWithBasePath src={entry.avatar} className="rounded-circle" alt={entry.author} />
                  </span>
                ) : (
                  <span className="avatar avatar-sm bg-primary-transparent text-primary rounded-circle flex-shrink-0">
                    <i className="ti ti-user" />
                  </span>
                )}
                <div className="flex-fill">
                  <div className="d-flex align-items-center gap-2 flex-wrap">
                    <span className="fs-13 fw-medium">{entry.author}</span>
                    {entry.role ? <span className="badge badge-soft-secondary">{entry.role}</span> : null}
                    <span className="fs-12 text-muted">{entry.timestamp}</span>
                  </div>
                  <p className="fs-13 text-muted mb-0">{entry.message}</p>
                </div>
              </div>
            ))
          )}
          <form
            className="exp-comment-form d-flex gap-2"
            onSubmit={(e) => { e.preventDefault(); postComment(); }}
          >
            <input
              type="text"
              className="form-control"
              placeholder="Write a comment…"
              aria-label="Write a comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <button type="submit" className="btn btn-primary flex-shrink-0">
              <i className="ti ti-send" />
            </button>
          </form>
        </div>
      </div>
    </>
  );

  const expenseForm = (row: Expense | null) => (
    <div className="row">
      <div className="col-md-6"><div className="mb-3">
        <label className="form-label" htmlFor="ex-title">Expense Title</label>
        <input type="text" className="form-control" id="ex-title" defaultValue={row?.title ?? ''} placeholder="Expense title" />
      </div></div>
      <div className="col-md-6"><div className="mb-3">
        <label className="form-label" htmlFor="ex-amount">Amount</label>
        <input type="text" className="form-control" id="ex-amount" defaultValue={row ? String(row.amount) : ''} placeholder="0.00" />
      </div></div>
      <div className="col-md-6"><div className="mb-3">
        <label className="form-label" htmlFor="ex-category">Category</label>
        <select className="form-select" id="ex-category" defaultValue={row?.category ?? categoryOptions[0]}>
          {categoryOptions.map((option) => <option key={option}>{option}</option>)}
        </select>
      </div></div>
      <div className="col-md-6"><div className="mb-3">
        <label className="form-label" htmlFor="ex-dept">Department</label>
        <select className="form-select" id="ex-dept" defaultValue={row?.department ?? departmentOptions[0]}>
          {departmentOptions.map((option) => <option key={option}>{option}</option>)}
        </select>
      </div></div>
      <div className="col-md-6"><div className="mb-3">
        <label className="form-label" htmlFor="ex-vendor">Vendor</label>
        <input type="text" className="form-control" id="ex-vendor" defaultValue={row?.vendor ?? ''} placeholder="Vendor name" />
      </div></div>
      <div className="col-md-6"><div className="mb-3">
        <label className="form-label" htmlFor="ex-method">Payment Method</label>
        <select className="form-select" id="ex-method" defaultValue={row?.method ?? methodOptions[0]}>
          {methodOptions.map((option) => <option key={option}>{option}</option>)}
        </select>
      </div></div>
      <div className="col-md-6"><div className="mb-3">
        <label className="form-label" htmlFor="ex-date">Expense Date</label>
        <input type="text" className="form-control" id="ex-date" defaultValue={row?.expenseDate ?? ''} placeholder="18-07-2026" />
      </div></div>
      <div className="col-md-6"><div className="mb-3">
        <label className="form-label" htmlFor="ex-priority">Priority</label>
        <select className="form-select" id="ex-priority" defaultValue={row?.priority ?? priorityOptions[0]}>
          {priorityOptions.map((option) => <option key={option}>{option}</option>)}
        </select>
      </div></div>
      <div className="col-12"><div className="mb-0">
        <label className="form-label" htmlFor="ex-desc">Description</label>
        <textarea className="form-control" rows={3} id="ex-desc" defaultValue={row?.description ?? ''} />
      </div></div>
    </div>
  );

  const noteModal = (
    id: ExpenseModalId,
    title: string,
    label: string,
    button: string,
    buttonClass: string,
    onConfirm: () => void,
  ) => (
    <Modal
      open={activeModal === id && selected !== null}
      onClose={() => setActiveModal(null)}
      title={title}
      onSubmit={(e) => { e.preventDefault(); onConfirm(); }}
      footer={
        <>
          <button type="button" className="btn btn-light me-2" onClick={() => setActiveModal(null)}>Cancel</button>
          <button type="submit" className={buttonClass}>{button}</button>
        </>
      }
    >
      <p className="fs-13 mb-3">
        <span className="fw-medium">{selected?.title}</span> · {money(selected?.amount ?? 0)} ·{' '}
        {selected?.employee}
      </p>
      <div className="mb-0">
        <label className="form-label" htmlFor={`ex-${id}-note`}>{label}</label>
        <textarea
          className="form-control"
          rows={3}
          id={`ex-${id}-note`}
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </div>
    </Modal>
  );

  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <PageHeader
            title="Expenses"
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
                  onClick={() => openModal('add')}
                >
                  <i className="ti ti-square-rounded-plus me-2" />Add Expense
                </button>
              </>
            }
          />

          <QueueWorkspaceShell
            workspace={workspace}
            columns={columns}
            getId={(row) => row.id}
            totalCount={rows.length}
            loading={loading}
            workspaceId="expenseWorkspace"
            searchPlaceholder="Search expenses, employee, vendor or category…"
            searchLabel="Search expenses"
            savedViews={savedViews}
            filterFields={filterFields}
            noun="expenses"
            openMenu={openMenu}
            onOpenMenu={setOpenMenu}
            onRefresh={() => { setRows(initialRows); push('Expenses refreshed'); }}
            onSaveView={() => push('Current view saved')}
            onToast={push}
            queueTitle="Approval Queue"
            queueIcon="ti ti-inbox"
            queueLabel="Expense approval queue"
            queueClassName="exp-queue"
            renderCard={renderCard}
            selectedId={selectedId}
            renderDetail={renderDetail}
            emptyIcon="ti ti-file-dollar"
            emptyTitle="No Expense Selected"
            emptyBody="Select an expense from the approval queue to review its details, receipts and approval workflow."
            emptyAction={
              <button type="button" className="btn btn-primary" onClick={() => openModal('add')}>
                <i className="ti ti-square-rounded-plus me-1" />Add Expense
              </button>
            }
          />
        </div>
      </div>

      {/* Modals */}
      <Modal
        open={activeModal === 'add'}
        onClose={() => setActiveModal(null)}
        title="Add Expense"
        dialogClassName="modal-lg"
        onSubmit={(e) => { e.preventDefault(); setActiveModal(null); push('Expense added'); }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={() => setActiveModal(null)}>Cancel</button>
            <button type="submit" className="btn btn-primary">Add Expense</button>
          </>
        }
      >
        {expenseForm(null)}
      </Modal>

      <Modal
        open={activeModal === 'edit' && selected !== null}
        onClose={() => setActiveModal(null)}
        title="Edit Expense"
        dialogClassName="modal-lg"
        onSubmit={(e) => { e.preventDefault(); setActiveModal(null); push(`${selected?.title} updated`); }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={() => setActiveModal(null)}>Cancel</button>
            <button type="submit" className="btn btn-primary">Save Changes</button>
          </>
        }
      >
        {expenseForm(selected)}
      </Modal>

      {noteModal('approve', 'Approve Expense', 'Approver Note', 'Approve', 'btn btn-success',
        () => decide('Approved', `${selected?.expenseId} approved`))}
      {noteModal('reject', 'Reject Expense', 'Reason for Rejection', 'Reject', 'btn btn-danger',
        () => decide('Rejected', `${selected?.expenseId} rejected`))}
      {noteModal('sendback', 'Send Back Expense', 'Note to Employee', 'Send Back', 'btn btn-primary',
        () => decide('Pending', `${selected?.expenseId} sent back`))}
      {noteModal('reqdocs', 'Request Documents', 'Documents Required', 'Request Docs', 'btn btn-primary',
        () => decide('In Review', `Documents requested for ${selected?.expenseId}`))}

      <Modal
        open={activeModal === 'reviewer' && selected !== null}
        onClose={() => setActiveModal(null)}
        title="Assign Reviewer"
        onSubmit={(e) => { e.preventDefault(); setActiveModal(null); push(`${reviewer} assigned as reviewer`); }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={() => setActiveModal(null)}>Cancel</button>
            <button type="submit" className="btn btn-primary">Assign Reviewer</button>
          </>
        }
      >
        <div className="mb-0">
          <label className="form-label" htmlFor="ex-reviewer">Reviewer</label>
          <select className="form-select" id="ex-reviewer" value={reviewer} onChange={(e) => setReviewer(e.target.value)}>
            {ownerOptions.map((option) => <option key={option}>{option}</option>)}
          </select>
        </div>
      </Modal>

      <Modal
        open={activeModal === 'payment' && selected !== null}
        onClose={() => setActiveModal(null)}
        title="Mark Reimbursed"
        onSubmit={(e) => { e.preventDefault(); decide('Reimbursed', `${selected?.expenseId} marked reimbursed`); }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={() => setActiveModal(null)}>Cancel</button>
            <button type="submit" className="btn btn-primary"><i className="ti ti-wallet me-1" />Mark Reimbursed</button>
          </>
        }
      >
        <p className="fs-13 mb-3">
          Disburse <span className="fw-medium">{money(selected?.amount ?? 0)}</span> to{' '}
          <span className="fw-medium">{selected?.employee}</span>.
        </p>
        <div className="mb-0">
          <label className="form-label" htmlFor="ex-pay-method">Payment Method</label>
          <select className="form-select" id="ex-pay-method" defaultValue={selected?.method ?? methodOptions[0]}>
            {methodOptions.map((option) => <option key={option}>{option}</option>)}
          </select>
        </div>
      </Modal>

      <Modal
        open={activeModal === 'receipt' && selected !== null}
        onClose={() => setActiveModal(null)}
        title="Receipt Preview"
        dialogClassName="modal-lg"
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={() => setActiveModal(null)}>Close</button>
            <button type="button" className="btn btn-primary" onClick={() => push('Receipt downloaded')}>
              <i className="ti ti-download me-1" />Download
            </button>
          </>
        }
      >
        <div className="text-center py-4 border rounded">
          <span className="avatar avatar-xl bg-primary-transparent text-primary rounded-circle mb-3 d-inline-flex align-items-center justify-content-center">
            <i className="ti ti-file-type-pdf fs-24" />
          </span>
          <h6 className="mb-1">{selected?.title}</h6>
          <p className="fs-13 text-muted mb-0">
            {selected?.receipts} receipt{selected?.receipts === 1 ? '' : 's'} · {selected?.reference}
          </p>
        </div>
      </Modal>

      <Modal
        open={activeModal === 'reimbursement' && selected !== null}
        onClose={() => setActiveModal(null)}
        title="Reimbursement Details"
        footer={<button type="button" className="btn btn-light" onClick={() => setActiveModal(null)}>Close</button>}
      >
        <ul className="list-unstyled mb-0">
          <li className="d-flex justify-content-between py-1 border-bottom fs-13">
            <span className="text-muted">Amount</span><span>{money(selected?.amount ?? 0)}</span>
          </li>
          <li className="d-flex justify-content-between py-1 border-bottom fs-13">
            <span className="text-muted">Method</span><span>{selected?.method}</span>
          </li>
          <li className="d-flex justify-content-between py-1 fs-13">
            <span className="text-muted">Reference</span><span>{selected?.reference}</span>
          </li>
        </ul>
      </Modal>

      <Modal
        open={activeModal === 'delete' && selected !== null}
        onClose={() => setActiveModal(null)}
        title="Delete Expense"
        onSubmit={(e) => {
          e.preventDefault();
          const id = selected?.id;
          setRows((current) => current.filter((row) => row.id !== id));
          setSelectedId(null);
          setActiveModal(null);
          push('Expense deleted');
        }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={() => setActiveModal(null)}>Cancel</button>
            <button type="submit" className="btn btn-danger">Yes, Delete</button>
          </>
        }
      >
        <p className="fs-13 mb-0">Delete {selected?.title}? This cannot be undone.</p>
      </Modal>

      <ToastStack toasts={toasts} onDismiss={dismiss} id="exToasts" />
    </>
  );
};

export default Expenses;
