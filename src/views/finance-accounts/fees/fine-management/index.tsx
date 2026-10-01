import { useCallback, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Offcanvas from '@components/ui/Offcanvas';
import ToastStack from '@components/ui/ToastStack';
import {
  ActionLink,
  ExpandableTable,
  WorkspaceHeader,
  useWorkspace,
} from '@components/workspace';
import type {
  ColumnDef,
  FilterField,
  QuickFilter,
  SavedView,
  SortOption,
  WorkspaceMenu,
} from '@components/workspace';
import ImageWithBasePath from '@core/common/imageWithBasePath';
import { all_routes } from '@/routes/all_routes';
import { useToasts } from '@hooks/useToasts';
import FineModals from './modals/FineModals';
import type { FineDraft, FineModalId } from './modals/FineModals';
import type { Fine, FineStatus } from './data/fines.data';
import {
  daysOverdue,
  fineCategories,
  fines as initialRows,
  money,
  outstanding,
  outstandingBand,
  paidAmount,
  parseDate,
  statusPill,
} from './data/fines.data';

const routes = all_routes;

const filterFields: FilterField[] = [
  { id: 'fine-category', label: 'Fine Category', kind: 'select', chipLabel: 'Category', options: fineCategories.map((c) => c.label) },
  { id: 'payment-status', label: 'Payment Status', kind: 'select', chipLabel: 'Status', options: ['Paid', 'Partially Paid', 'Unpaid', 'Overdue', 'Waived'] },
  { id: 'class', label: 'Class', kind: 'select', chipLabel: 'Class', options: ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'] },
  { id: 'section', label: 'Section', kind: 'select', chipLabel: 'Section', options: ['A', 'B', 'C', 'D'] },
  { id: 'due-from', label: 'Due From', kind: 'date', chipLabel: 'Due from', placeholder: '01-07-2026' },
  { id: 'due-to', label: 'Due To', kind: 'date', chipLabel: 'Due to', placeholder: '31-08-2026' },
  { id: 'outstanding-amount', label: 'Outstanding Amount', kind: 'select', chipLabel: 'Outstanding', options: ['Fully cleared', 'Under $25', '$25 – $50', 'Over $50'] },
  { id: 'created-by', label: 'Created By', kind: 'select', chipLabel: 'Created by', options: ['Accounts', 'Class Teacher', 'Librarian', 'Warden', 'Transport Head', 'Exam Cell'] },
];

/** Counts are the template's school-wide figures across 96 fines. */
const savedViews: SavedView[] = [
  { id: 'all', label: 'All Fines', icon: 'ti ti-layout-list', count: 96 },
  { id: 'outstanding', label: 'Outstanding Dues', icon: 'ti ti-alert-circle', count: 34 },
  { id: 'overdue', label: 'Overdue Fines', icon: 'ti ti-clock-dollar', count: 11 },
  { id: 'cleared', label: 'Cleared This Month', icon: 'ti ti-circle-check', count: 38 },
  { id: 'waived', label: 'Waived Fines', icon: 'ti ti-discount-2', count: 6 },
];

const quickFilters: QuickFilter[] = [
  { id: 'outstanding', label: 'Outstanding', icon: 'ti ti-alert-circle', count: 34 },
  { id: 'Overdue', label: 'Overdue', icon: 'ti ti-clock-dollar', count: 11 },
  { id: 'Partially Paid', label: 'Partially Paid', icon: 'ti ti-progress', count: 12 },
  { id: 'Paid', label: 'Paid', icon: 'ti ti-circle-check', count: 45 },
  { id: 'Waived', label: 'Waived', icon: 'ti ti-discount-2', count: 6 },
];

const sortOptions: SortOption[] = [
  { id: 'student', label: 'Student name (A–Z)', icon: 'ti ti-abc' },
  { id: 'outstanding', label: 'Outstanding amount', icon: 'ti ti-currency-dollar' },
  { id: 'due', label: 'Due date', icon: 'ti ti-calendar-due' },
  { id: 'category', label: 'Fine category', icon: 'ti ti-category' },
  { id: 'issued', label: 'Recently issued', icon: 'ti ti-clock' },
];

const FineManagement = () => {
  const [rows, setRows] = useState<Fine[]>(initialRows);
  const [openMenu, setOpenMenu] = useState<WorkspaceMenu>(null);
  const [category, setCategory] = useState<string | null>(null);
  const [activeModal, setActiveModal] = useState<FineModalId | null>(null);
  const [modalRow, setModalRow] = useState<Fine | null>(null);
  const [panelRow, setPanelRow] = useState<Fine | null>(null);

  const { toasts, push, dismiss } = useToasts();

  const openModal = useCallback((row: Fine | null, modal: FineModalId) => {
    setModalRow(row);
    setActiveModal(modal);
  }, []);

  const columns = useMemo<ColumnDef<Fine>[]>(
    () => [
      {
        id: 'fineId',
        label: 'Fine ID',
        toggleable: false,
        render: (row) => (
          <ActionLink className="fw-medium" onClick={() => openModal(row, 'view')}>
            {row.fineId}
          </ActionLink>
        ),
      },
      {
        id: 'student',
        label: 'Student',
        sortable: true,
        render: (row) => (
          <div className="dt-user">
            <span className="dt-avatar">
              <ImageWithBasePath src={row.avatar} alt={row.student} />
            </span>
            <div>
              <ActionLink className="dt-name" onClick={() => openModal(row, 'view')}>
                {row.student}
              </ActionLink>
              <div className="dt-sub">{row.admissionNo}</div>
            </div>
          </div>
        ),
      },
      { id: 'class', label: 'Class', render: (row) => row.className },
      {
        id: 'category',
        label: 'Fine Category',
        sortable: true,
        render: (row) => <span className={`badge badge-soft-${row.categoryTint}`}>{row.category}</span>,
      },
      { id: 'amount', label: 'Fine Amount', align: 'end', render: (row) => money(row.amount) },
      {
        id: 'outstanding',
        label: 'Outstanding',
        sortable: true,
        align: 'end',
        cellClassName: 'fw-medium',
        render: (row) => money(outstanding(row)),
      },
      {
        id: 'dueDate',
        label: 'Due Date',
        sortable: true,
        render: (row) => (
          <>
            <span className="d-block fs-13">{row.dueDate}</span>
            {daysOverdue(row) > 0 ? (
              <span className="fs-12 text-danger">{daysOverdue(row)} days overdue</span>
            ) : null}
          </>
        ),
      },
      {
        id: 'status',
        label: 'Payment Status',
        toggleable: false,
        render: (row) => (
          <span className={`dt-pill ${statusPill[row.status]}`}>
            <span className="dt-pill-dot" />
            {row.status}
          </span>
        ),
      },
      {
        id: 'createdBy',
        label: 'Created By',
        render: (row) => (
          <>
            <span className="d-block fs-13">{row.createdBy}</span>
            <span className="fs-12 text-muted">{row.createdByRole}</span>
          </>
        ),
      },
    ],
    [openModal],
  );

  const workspace = useWorkspace<Fine>({
    rows,
    filterFields,
    columns,
    getId: (row) => row.id,
    search: (row, term) =>
      `${row.student} ${row.fineId} ${row.remarks} ${row.category}`.toLowerCase().includes(term),
    matches: (row, filters) => {
      if (category && row.category !== category) return false;
      if (filters['fine-category'] && row.category !== filters['fine-category']) return false;
      if (filters['payment-status'] && row.status !== filters['payment-status']) return false;
      if (filters.class && !row.className.startsWith(filters.class)) return false;
      if (filters.section && row.section !== filters.section) return false;
      if (filters['outstanding-amount'] && outstandingBand(row) !== filters['outstanding-amount']) return false;
      if (filters['created-by'] && row.createdByRole !== filters['created-by']) return false;
      return true;
    },
    quickMatch: (row, quick) => {
      if (!quick) return true;
      if (quick === 'outstanding') return outstanding(row) > 0;
      return row.status === quick;
    },
    viewMatch: (row, view) => {
      if (view === 'outstanding') return outstanding(row) > 0;
      if (view === 'overdue') return row.status === 'Overdue';
      if (view === 'cleared') return row.status === 'Paid';
      if (view === 'waived') return row.status === 'Waived';
      return true;
    },
    compare: (a, b, sort) => {
      switch (sort) {
        case 'outstanding':
          return outstanding(b) - outstanding(a) || a.student.localeCompare(b.student);
        case 'due':
          return parseDate(a.dueDate).getTime() - parseDate(b.dueDate).getTime();
        case 'category':
          return a.category.localeCompare(b.category) || a.student.localeCompare(b.student);
        case 'issued':
          return parseDate(b.issuedOn).getTime() - parseDate(a.issuedOn).getTime();
        case 'student':
        default:
          return a.student.localeCompare(b.student);
      }
    },
    defaultSort: 'student',
    pageSize: 8,
  });

  /* -------------------------------- Mutations ------------------------------- */

  const statusAfterPayment = (row: Fine, left: number): FineStatus => {
    if (left === 0) return 'Paid';
    return row.status === 'Overdue' ? 'Overdue' : 'Partially Paid';
  };

  const recordPayment = useCallback(
    (amount: number, method: string) => {
      if (!modalRow) return;
      if (amount <= 0) {
        push('Enter an amount greater than zero', 'warning');
        return;
      }
      setRows((current) =>
        current.map((row) => {
          if (row.id !== modalRow.id) return row;
          const capped = Math.min(amount, outstanding(row));
          const payments = [...row.payments, { when: `30 Jul 2026 · ${method}`, amount: capped }];
          const left = Math.max(0, row.amount - payments.reduce((t, p) => t + p.amount, 0));
          return { ...row, payments, paymentMode: method, status: statusAfterPayment(row, left) };
        }),
      );
      setActiveModal(null);
      push(`${money(amount)} recorded against ${modalRow.fineId}`);
    },
    [modalRow, push],
  );

  const waive = useCallback(
    (reason: string) => {
      if (!modalRow) return;
      setRows((current) =>
        current.map((row) =>
          row.id === modalRow.id
            ? {
                ...row,
                status: 'Waived',
                waiver: `Full waiver · ${money(outstanding(row))}${reason.trim() ? ` — ${reason.trim()}` : ''}`,
              }
            : row,
        ),
      );
      setActiveModal(null);
      push(`${modalRow.fineId} waived`);
    },
    [modalRow, push],
  );

  const createFine = useCallback(
    (draft: FineDraft) => {
      if (!draft.student.trim() || !draft.amount.trim()) {
        push('Give the fine a student and an amount', 'warning');
        return;
      }
      const meta = fineCategories.find((c) => c.label === draft.category);
      setRows((current) => [
        {
          id: `FN-${Date.now()}`,
          fineId: `FN-${Date.now()}`,
          student: draft.student.trim(),
          avatar: 'assets/img/students/student-01.jpg',
          admissionNo: '—',
          rollNo: '—',
          className: '—',
          section: '',
          category: draft.category,
          categoryTint: meta?.tint ?? 'secondary',
          amount: Number(draft.amount.replace(/[^0-9.]/g, '')) || 0,
          dueDate: draft.dueDate || '—',
          status: 'Unpaid',
          createdBy: 'Sarah Rose',
          createdByRole: 'Accounts',
          issuedOn: '30 Jul 2026',
          receiptNo: '—',
          paymentMode: '—',
          guardian: '—',
          contact: '—',
          payments: [],
          waiver: null,
          remarks: draft.remarks,
        },
        ...current,
      ]);
      setActiveModal(null);
      push(`Fine added for ${draft.student.trim()}`);
    },
    [push],
  );

  const updateFine = useCallback(
    (draft: FineDraft) => {
      if (!modalRow) return;
      const meta = fineCategories.find((c) => c.label === draft.category);
      setRows((current) =>
        current.map((row) =>
          row.id === modalRow.id
            ? {
                ...row,
                student: draft.student.trim() || row.student,
                category: draft.category,
                categoryTint: meta?.tint ?? row.categoryTint,
                amount: Number(draft.amount.replace(/[^0-9.]/g, '')) || row.amount,
                dueDate: draft.dueDate || row.dueDate,
                remarks: draft.remarks,
              }
            : row,
        ),
      );
      setActiveModal(null);
      push('Fine updated');
    },
    [modalRow, push],
  );

  const rowActions = (row: Fine) => (
    <div className="dt-actions">
      <ActionLink className="dt-ib" ariaLabel="View fine" onClick={() => openModal(row, 'view')}>
        <i className="ti ti-eye" />
      </ActionLink>
      <ActionLink className="dt-ib success" ariaLabel="Record payment" onClick={() => openModal(row, 'payment')}>
        <i className="ti ti-cash" />
      </ActionLink>
      <ActionLink className="dt-ib" ariaLabel="Edit fine" onClick={() => openModal(row, 'edit')}>
        <i className="ti ti-edit" />
      </ActionLink>
      <ActionLink className="dt-ib" ariaLabel="Open ledger" onClick={() => setPanelRow(row)}>
        <i className="ti ti-book" />
      </ActionLink>
    </div>
  );

  const infoList = (items: { label: string; value: string }[]) => (
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

  const renderDetail = (row: Fine) => (
    <div className="row g-3">
      <div className="col-lg-4 col-md-6">
        <h6 className="fs-13 mb-2">
          <i className="ti ti-file-invoice text-primary me-1" />
          Fine Details
        </h6>
        {infoList([
          { label: 'Issued On', value: row.issuedOn },
          { label: 'Issued By', value: `${row.createdBy} (${row.createdByRole})` },
          { label: 'Receipt No', value: row.receiptNo },
          { label: 'Payment Mode', value: row.paymentMode },
        ])}
      </div>
      <div className="col-lg-4 col-md-6">
        <h6 className="fs-13 mb-2">
          <i className="ti ti-user text-info me-1" />
          Student Information
        </h6>
        {infoList([
          { label: 'Roll No', value: row.rollNo },
          { label: 'Admission No', value: row.admissionNo },
          { label: 'Guardian', value: row.guardian },
          { label: 'Contact', value: row.contact },
        ])}
      </div>
      <div className="col-lg-4 col-md-6">
        <h6 className="fs-13 mb-2">
          <i className="ti ti-history text-success me-1" />
          Payment History
        </h6>
        {row.payments.length === 0 ? (
          <p className="fs-12 text-muted mb-0">
            {row.status === 'Waived' ? 'Waived in full.' : 'No payments recorded yet.'}
          </p>
        ) : (
          <ul className="list-unstyled mb-0">
            {row.payments.map((payment) => (
              <li className="d-flex justify-content-between py-1 fs-13 border-bottom" key={payment.when}>
                <span className="text-muted">{payment.when}</span>
                <span className="text-success">+{money(payment.amount)}</span>
              </li>
            ))}
            <li className="d-flex justify-content-between py-1 fs-13 fw-medium">
              <span>Collected</span>
              <span>{money(paidAmount(row))}</span>
            </li>
          </ul>
        )}
      </div>
      <div className="col-12">
        <h6 className="fs-13 mb-2">
          <i className="ti ti-discount-2 text-warning me-1" />
          Waiver &amp; Remarks
        </h6>
        <p className="fs-13 text-muted mb-0">{row.waiver ?? 'No waiver applied.'}</p>
        <p className="fs-13 text-muted mb-0">{row.remarks}</p>
        <div className="d-flex flex-wrap gap-2 mt-3 pt-3 border-top">
          {outstanding(row) > 0 ? (
            <button type="button" className="btn btn-primary btn-sm" onClick={() => openModal(row, 'payment')}>
              <i className="ti ti-cash me-1" />
              Record Payment
            </button>
          ) : null}
          <button type="button" className="btn btn-outline-light bg-white btn-sm" onClick={() => setPanelRow(row)}>
            <i className="ti ti-book me-1" />
            Open Ledger
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content">
          {/* Page Header */}
          <div className="d-md-flex d-block align-items-center justify-content-between flex-wrap gap-2 mb-3">
            <div className="my-auto mb-2">
              <h3 className="page-title mb-1">Fine Management</h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={routes.adminDashboard}>Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <Link to="#">Finance &amp; Accounts</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Fine Management
                  </li>
                </ol>
              </nav>
            </div>
            <div className="d-flex my-xl-auto right-content align-items-center flex-wrap">
              <button
                type="button"
                className="btn btn-outline-light bg-white me-2 mb-2 d-inline-flex align-items-center"
                onClick={() => push('Import is not wired to a backend yet', 'info')}
              >
                <i className="ti ti-file-import me-1" />
                Import
              </button>
              <button
                type="button"
                className="btn btn-primary mb-2 d-inline-flex align-items-center"
                onClick={() => openModal(null, 'add')}
              >
                <i className="ti ti-square-rounded-plus me-1" />
                Add Fine
              </button>
            </div>
          </div>
          {/* /Page Header */}

          {/* Fine Categories — inert cards in the template; they filter the grid here. */}
          <div className="row g-3 mb-3">
            {fineCategories.map((item) => (
              <div className="col-xxl-3 col-lg-4 col-md-6 d-flex" key={item.id}>
                <button
                  type="button"
                  className={`card flex-fill w-100 text-start border-0 p-0${category === item.id ? ' card-selected' : ''}`}
                  aria-pressed={category === item.id}
                  onClick={() => setCategory((current) => (current === item.id ? null : item.id))}
                >
                  <div className="card-body d-flex align-items-center">
                    <span className={`avatar avatar-lg bg-${item.tint}-transparent text-${item.tint} rounded me-2 flex-shrink-0`}>
                      <i className={`${item.icon} fs-20`} />
                    </span>
                    <div className="overflow-hidden">
                      <h6 className="mb-1 text-truncate">{item.label}</h6>
                      <span className="fs-12 text-muted d-block text-truncate">{item.summary}</span>
                    </div>
                  </div>
                </button>
              </div>
            ))}
          </div>

          <div className="data-workspace page-toolbar-compact">
            <div className="card">
              <WorkspaceHeader
                searchPlaceholder="Search student, fine ID or reason…"
                searchLabel="Search fines"
                search={workspace.search}
                onSearch={workspace.setSearch}
                savedViews={savedViews}
                view={workspace.view}
                onView={workspace.setView}
                onSaveView={() => push('Current view saved')}
                filterFields={filterFields}
                draft={workspace.draft}
                onDraftField={workspace.setDraftField}
                onApplyFilters={() => {
                  workspace.applyFilters();
                  push('Filters applied');
                }}
                onResetFilters={() => {
                  workspace.resetFilters();
                  setCategory(null);
                  push('Filters cleared');
                }}
                matchCount={workspace.visible.length}
                totalCount={rows.length}
                matchNoun="fines"
                columnOptions={columns
                  .filter((column) => column.toggleable !== false)
                  .map((column) => ({ id: column.id, label: column.label }))}
                columns={workspace.columns}
                onToggleColumn={workspace.toggleColumn}
                onShowAllColumns={workspace.showAllColumns}
                density={workspace.density}
                onDensity={workspace.setDensity}
                onRefresh={() => {
                  setRows(initialRows);
                  push('Fines refreshed');
                }}
                fullscreen={workspace.fullscreen}
                onFullscreen={workspace.toggleFullscreen}
                quickFilters={quickFilters}
                quick={workspace.quick}
                onQuick={workspace.toggleQuick}
                sortOptions={sortOptions}
                sort={workspace.sort}
                onSort={workspace.setSort}
                chips={workspace.chips}
                onClearChip={workspace.clearChip}
                openMenu={openMenu}
                onOpenMenu={setOpenMenu}
              />

              <ExpandableTable
                rows={workspace.shown}
                columns={workspace.visibleColumns}
                getId={(row) => row.id}
                selected={workspace.selected}
                onToggleSelect={workspace.toggleSelect}
                allShownSelected={workspace.allShownSelected}
                onToggleSelectAll={workspace.toggleSelectAll}
                expanded={workspace.expanded}
                onToggleExpand={workspace.toggleExpand}
                renderDetail={renderDetail}
                sort={workspace.sort}
                onSort={workspace.setSort}
                renderActions={rowActions}
              />

              {workspace.visible.length === 0 ? (
                <div className="workspace-empty-state text-center py-5">
                  <span className="avatar avatar-xxl bg-primary-transparent text-primary rounded-circle flex-shrink-0 mb-3">
                    <i className="ti ti-cash-off fs-36" />
                  </span>
                  <h5 className="mb-1">No Fines Found</h5>
                  <p className="text-muted mb-0">No fine matches the selected filters.</p>
                </div>
              ) : null}

              <div className="card-footer d-flex align-items-center justify-content-between flex-wrap gap-2">
                <p className="mb-0 text-muted">
                  Showing {workspace.rangeStart} to {workspace.rangeEnd} of {workspace.visible.length} fines
                </p>
                <nav>
                  <ul className="pagination mb-0">
                    <li className={`page-item${workspace.page === 1 ? ' disabled' : ''}`}>
                      <button type="button" className="page-link" onClick={() => workspace.setPage(Math.max(1, workspace.page - 1))}>
                        Previous
                      </button>
                    </li>
                    {Array.from({ length: workspace.pageCount }, (_, index) => index + 1).map((number) => (
                      <li className={`page-item${workspace.page === number ? ' active' : ''}`} key={number}>
                        <button type="button" className="page-link" onClick={() => workspace.setPage(number)}>
                          {number}
                        </button>
                      </li>
                    ))}
                    <li className={`page-item${workspace.page === workspace.pageCount ? ' disabled' : ''}`}>
                      <button type="button" className="page-link" onClick={() => workspace.setPage(Math.min(workspace.pageCount, workspace.page + 1))}>
                        Next
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          </div>

          {/* Fine Ledger Offcanvas */}
          <Offcanvas
            open={panelRow !== null}
            onClose={() => setPanelRow(null)}
            title="Fine Ledger"
            labelledById="fine_ledger_lbl"
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
                      {panelRow.fineId} · {panelRow.className}
                    </span>
                  </div>
                  <span className={`dt-pill ${statusPill[panelRow.status]} ms-auto`}>
                    <span className="dt-pill-dot" />
                    {panelRow.status}
                  </span>
                </div>

                <div className="row g-2 mb-3">
                  {[
                    { label: 'Fine', value: money(panelRow.amount) },
                    { label: 'Collected', value: money(paidAmount(panelRow)) },
                    { label: 'Outstanding', value: money(outstanding(panelRow)) },
                  ].map((tile) => (
                    <div className="col-4" key={tile.label}>
                      <div className="border rounded p-2 text-center">
                        <span className="fs-11 text-muted d-block">{tile.label}</span>
                        <h6 className="mb-0">{tile.value}</h6>
                      </div>
                    </div>
                  ))}
                </div>

                <h6 className="fs-13 mb-2">Payment History</h6>
                {panelRow.payments.length === 0 ? (
                  <p className="fs-12 text-muted">No payments recorded yet.</p>
                ) : (
                  <ul className="list-unstyled mb-3">
                    {panelRow.payments.map((payment) => (
                      <li className="d-flex justify-content-between py-1 fs-13 border-bottom" key={payment.when}>
                        <span className="text-muted">{payment.when}</span>
                        <span className="text-success">+{money(payment.amount)}</span>
                      </li>
                    ))}
                  </ul>
                )}

                <div className="d-flex gap-2">
                  {outstanding(panelRow) > 0 ? (
                    <button
                      type="button"
                      className="btn btn-primary flex-fill"
                      onClick={() => {
                        const row = panelRow;
                        setPanelRow(null);
                        openModal(row, 'payment');
                      }}
                    >
                      <i className="ti ti-cash me-1" />
                      Record Payment
                    </button>
                  ) : null}
                  {panelRow.status !== 'Waived' && outstanding(panelRow) > 0 ? (
                    <button
                      type="button"
                      className="btn btn-outline-light bg-white flex-fill"
                      onClick={() => {
                        const row = panelRow;
                        setPanelRow(null);
                        openModal(row, 'waive');
                      }}
                    >
                      <i className="ti ti-discount-2 me-1" />
                      Waive
                    </button>
                  ) : null}
                </div>
              </>
            ) : null}
          </Offcanvas>
          {/* /Fine Ledger Offcanvas */}
        </div>
      </div>
      {/* /Page Wrapper */}

      <FineModals
        active={activeModal}
        row={modalRow}
        onClose={() => setActiveModal(null)}
        onCreate={createFine}
        onUpdate={updateFine}
        onRecordPayment={recordPayment}
        onWaive={waive}
      />

      <ToastStack toasts={toasts} onDismiss={dismiss} id="fnToasts" />
    </>
  );
};

export default FineManagement;
