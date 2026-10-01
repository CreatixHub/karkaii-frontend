import { useCallback, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Offcanvas from '@components/ui/Offcanvas';
import ToastStack from '@components/ui/ToastStack';
import {
  ActionLink,
  ExpandableTable,
  SummaryCard,
  WorkspaceHeader,
  useWorkspace,
} from '@components/workspace';
import type { ColumnDef, FilterField, QuickFilter, SavedView, SortOption, WorkspaceMenu } from '@components/workspace';
import type { SummaryItem } from '@components/workspace';
import ImageWithBasePath from '@core/common/imageWithBasePath';
import { all_routes } from '@/routes/all_routes';
import { useToasts } from '@hooks/useToasts';
import DueModals from './modals/DueModals';
import type { DueModalId } from './modals/DueModals';
import type { DueRow } from './data/dueReports.data';
import {
  ageingBucket,
  daysOverdue,
  daysOverdueLabel,
  dueRows as initialRows,
  money,
  netOutstanding,
  outstanding,
  parseDate,
  statusPill,
} from './data/dueReports.data';

const routes = all_routes;

const filterFields: FilterField[] = [
  { id: 'academic-year', label: 'Academic Year', kind: 'select', chipLabel: 'Academic Year', options: ['2026 / 2027', '2025 / 2026', '2024 / 2025'] },
  { id: 'fee-category', label: 'Fee Category', kind: 'select', chipLabel: 'Category', options: ['Tuition Fee', 'Transport Fee', 'Hostel Fee', 'Exam Fee', 'Library Fee', 'Activity Fee'] },
  { id: 'class', label: 'Class', kind: 'select', chipLabel: 'Class', options: ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'] },
  { id: 'section', label: 'Section', kind: 'select', chipLabel: 'Section', options: ['A', 'B', 'C', 'D'] },
  { id: 'due-status', label: 'Due Status', kind: 'select', chipLabel: 'Status', options: ['Overdue', 'Critical', 'Due This Week', 'Partially Paid', 'Cleared'] },
  { id: 'ageing-bucket', label: 'Ageing Bucket', kind: 'select', chipLabel: 'Ageing', options: ['1 – 15 days', '16 – 30 days', '31 – 60 days', 'Over 60 days'] },
  { id: 'due-from', label: 'Due Date From', kind: 'date', chipLabel: 'Due from', placeholder: '01-06-2026' },
  { id: 'due-to', label: 'Due Date To', kind: 'date', chipLabel: 'Due to', placeholder: '31-08-2026' },
];

/** Counts are the template's own school-wide figures, not the eight-row sample. */
const savedViews: SavedView[] = [
  { id: 'all', label: 'All Outstanding', icon: 'ti ti-layout-list', count: 212 },
  { id: 'overdue30', label: 'Overdue 30+ Days', icon: 'ti ti-alert-octagon', count: 76 },
  { id: 'week', label: 'Due This Week', icon: 'ti ti-calendar-due', count: 28 },
  { id: 'partial', label: 'Partial Payments', icon: 'ti ti-progress-check', count: 41 },
  { id: 'cleared', label: 'Cleared Invoices', icon: 'ti ti-circle-check', count: 318 },
];

const quickFilters: QuickFilter[] = [
  { id: 'Overdue', label: 'Overdue', icon: 'ti ti-alert-octagon', count: 76 },
  { id: 'Critical', label: 'Critical 60+', icon: 'ti ti-alarm', count: 19 },
  { id: 'Due This Week', label: 'Due This Week', icon: 'ti ti-calendar-due', count: 28 },
  { id: 'Partially Paid', label: 'Partially Paid', icon: 'ti ti-progress-check', count: 41 },
  { id: 'Cleared', label: 'Cleared', icon: 'ti ti-circle-check', count: 318 },
];

const sortOptions: SortOption[] = [
  { id: 'days', label: 'Days overdue (high → low)', icon: 'ti ti-alarm' },
  { id: 'outstanding', label: 'Outstanding amount', icon: 'ti ti-currency-dollar' },
  { id: 'due', label: 'Due date', icon: 'ti ti-calendar-due' },
  { id: 'student', label: 'Student name (A–Z)', icon: 'ti ti-abc' },
  { id: 'category', label: 'Fee category', icon: 'ti ti-category' },
];

const DueReports = () => {
  const [rows, setRows] = useState<DueRow[]>(initialRows);
  const [openMenu, setOpenMenu] = useState<WorkspaceMenu>(null);
  const [activeModal, setActiveModal] = useState<DueModalId | null>(null);
  const [modalRow, setModalRow] = useState<DueRow | null>(null);
  const [panelRow, setPanelRow] = useState<DueRow | null>(null);

  const { toasts, push, dismiss } = useToasts();

  const openModal = useCallback((row: DueRow | null, modal: DueModalId) => {
    setModalRow(row);
    setActiveModal(modal);
  }, []);

  /* --------------------------------- Columns -------------------------------- */

  const columns = useMemo<ColumnDef<DueRow>[]>(
    () => [
      {
        id: 'student',
        label: 'Student',
        sortable: true,
        toggleable: false,
        render: (row) => (
          <div className="dt-user">
            <span className="dt-avatar">
              <ImageWithBasePath src={row.avatar} alt={row.student} />
            </span>
            <div>
              <ActionLink className="dt-name" onClick={() => openModal(row, 'view')}>
                {row.student}
              </ActionLink>
              <div className="dt-sub">{row.roll}</div>
            </div>
          </div>
        ),
      },
      { id: 'admissionNo', label: 'Admission No.', cellClassName: 'fs-13', render: (row) => row.admissionNo },
      { id: 'class', label: 'Class', render: (row) => row.className },
      {
        id: 'feeCategory',
        label: 'Fee Category',
        sortable: true,
        render: (row) => <span className={`badge badge-soft-${row.categoryTint}`}>{row.feeCategory}</span>,
      },
      {
        id: 'invoiceNo',
        label: 'Invoice No.',
        render: (row) => (
          <ActionLink className="fw-medium" onClick={() => openModal(row, 'view')}>
            {row.invoiceNo}
          </ActionLink>
        ),
      },
      { id: 'billed', label: 'Due Amount', sortable: true, align: 'end', render: (row) => money(row.billed) },
      {
        id: 'paid',
        label: 'Paid Amount',
        sortable: true,
        align: 'end',
        cellClassName: 'text-success',
        render: (row) => money(row.paid),
      },
      {
        id: 'outstanding',
        label: 'Outstanding',
        sortable: true,
        align: 'end',
        cellClassName: 'fw-medium',
        render: (row) => money(outstanding(row)),
      },
      { id: 'dueDate', label: 'Due Date', sortable: true, cellClassName: 'fs-13', render: (row) => row.dueDate },
      {
        id: 'daysOverdue',
        label: 'Days Overdue',
        sortable: true,
        render: (row) =>
          daysOverdue(row) > 0 ? (
            <span className="badge badge-soft-danger">{daysOverdueLabel(row)}</span>
          ) : (
            '—'
          ),
      },
      {
        id: 'status',
        label: 'Status',
        toggleable: false,
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

  /* -------------------------------- Workspace ------------------------------- */

  const workspace = useWorkspace<DueRow>({
    rows,
    filterFields,
    columns,
    getId: (row) => row.id,
    search: (row, term) =>
      `${row.student} ${row.admissionNo} ${row.invoiceNo}`.toLowerCase().includes(term),
    matches: (row, filters) => {
      if (filters['academic-year'] && row.academicYear !== filters['academic-year']) return false;
      if (filters['fee-category'] && row.feeCategory !== filters['fee-category']) return false;
      if (filters.class && !row.className.startsWith(filters.class)) return false;
      if (filters.section && row.section !== filters.section) return false;
      if (filters['due-status'] && row.status !== filters['due-status']) return false;
      if (filters['ageing-bucket'] && ageingBucket(row) !== filters['ageing-bucket']) return false;
      return true;
    },
    quickMatch: (row, quick) => !quick || row.status === quick,
    viewMatch: (row, view) => {
      if (view === 'overdue30') return daysOverdue(row) >= 30;
      if (view === 'week') return row.status === 'Due This Week';
      if (view === 'partial') return row.status === 'Partially Paid';
      if (view === 'cleared') return row.status === 'Cleared';
      return true;
    },
    compare: (a, b, sort) => {
      switch (sort) {
        case 'outstanding':
          return outstanding(b) - outstanding(a) || a.student.localeCompare(b.student);
        case 'due':
          return parseDate(a.dueDate).getTime() - parseDate(b.dueDate).getTime();
        case 'student':
          return a.student.localeCompare(b.student);
        case 'category':
          return a.feeCategory.localeCompare(b.feeCategory) || a.student.localeCompare(b.student);
        case 'days':
        default:
          return daysOverdue(b) - daysOverdue(a) || a.student.localeCompare(b.student);
      }
    },
    defaultSort: 'days',
    pageSize: 8,
  });

  /* -------------------------------- Summary --------------------------------- */

  const summary = useMemo<SummaryItem[]>(() => {
    const totalOutstanding = rows.reduce((total, row) => total + outstanding(row), 0);
    const withDues = rows.filter((row) => outstanding(row) > 0);
    const overdue = rows.filter((row) => daysOverdue(row) > 0);
    const dueWeek = rows.filter((row) => row.status === 'Due This Week');
    const partial = rows.filter((row) => row.status === 'Partially Paid');
    const sum = (list: DueRow[]) => list.reduce((total, row) => total + outstanding(row), 0);

    return [
      { id: 'total', tint: 'danger', icon: 'ti ti-cash-off', label: 'Total Outstanding', value: money(totalOutstanding), hint: `${withDues.length} invoices` },
      { id: 'students', tint: 'primary', icon: 'ti ti-users', label: 'Students with Dues', value: String(withDues.length), hint: `across ${new Set(withDues.map((row) => row.className)).size} classes` },
      { id: 'overdue', tint: 'warning', icon: 'ti ti-alert-octagon', label: 'Overdue Amount', value: money(sum(overdue)), hint: `${overdue.length} invoices` },
      { id: 'week', tint: 'info', icon: 'ti ti-calendar-due', label: 'Due This Week', value: money(sum(dueWeek)), hint: `${dueWeek.length} invoices` },
      { id: 'partial', tint: 'success', icon: 'ti ti-progress-check', label: 'Partial Payments', value: money(sum(partial)), hint: `${partial.length} invoices` },
    ];
  }, [rows]);

  /* -------------------------------- Mutations ------------------------------- */

  const recordPayment = useCallback(
    (amount: number, method: string, reference: string) => {
      if (!modalRow) return;
      if (amount <= 0) {
        push('Enter an amount greater than zero', 'warning');
        return;
      }
      setRows((current) =>
        current.map((row) => {
          if (row.id !== modalRow.id) return row;
          const paid = Math.min(row.billed, row.paid + amount);
          const left = row.billed - paid;
          return {
            ...row,
            paid,
            status: left === 0 ? 'Cleared' : 'Partially Paid',
            payments: [
              ...row.payments,
              { when: `30 Jul 2026 · ${method}${reference ? ` · ${reference}` : ''}`, amount: money(amount) },
            ],
          };
        }),
      );
      setActiveModal(null);
      push(`${money(amount)} recorded against ${modalRow.invoiceNo}`);
    },
    [modalRow, push],
  );

  const rowActions = (row: DueRow) => (
    <div className="dt-actions">
      <ActionLink className="dt-ib" ariaLabel="View due details" onClick={() => openModal(row, 'view')}>
        <i className="ti ti-eye" />
      </ActionLink>
      <ActionLink className="dt-ib success" ariaLabel="Record payment" onClick={() => openModal(row, 'payment')}>
        <i className="ti ti-cash" />
      </ActionLink>
      <ActionLink className="dt-ib" ariaLabel="Send reminder" onClick={() => openModal(row, 'reminder')}>
        <i className="ti ti-bell" />
      </ActionLink>
      <ActionLink className="dt-ib" ariaLabel="Collection actions" onClick={() => setPanelRow(row)}>
        <i className="ti ti-wallet" />
      </ActionLink>
    </div>
  );

  const renderDetail = (row: DueRow) => (
    <div className="row g-3">
      <div className="col-lg-4 col-md-6">
        <h6 className="fs-13 mb-2">
          <i className="ti ti-receipt text-primary me-1" />
          Fee Breakdown
        </h6>
        <ul className="list-unstyled mb-0">
          {row.feeBreakdown.map((line) => (
            <li className="d-flex justify-content-between py-1 fs-13 border-bottom" key={line.label}>
              <span className="text-muted">{line.label}</span>
              <span className="text-dark">{line.amount}</span>
            </li>
          ))}
          <li className="d-flex justify-content-between py-1 fs-13 fw-medium">
            <span>Total Billed</span>
            <span>{money(row.billed)}</span>
          </li>
        </ul>
      </div>

      <div className="col-lg-4 col-md-6">
        <h6 className="fs-13 mb-2">
          <i className="ti ti-history text-info me-1" />
          Payment History
        </h6>
        {row.payments.length === 0 ? (
          <p className="fs-12 text-muted mb-0">No payments recorded against this invoice.</p>
        ) : (
          <ul className="list-unstyled mb-0">
            {row.payments.map((payment) => (
              <li className="d-flex justify-content-between py-1 fs-13 border-bottom" key={payment.when}>
                <span className="text-muted">{payment.when}</span>
                <span className="text-dark">{payment.amount}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="col-lg-4 col-md-6">
        <h6 className="fs-13 mb-2">
          <i className="ti ti-calculator text-warning me-1" />
          Outstanding Summary
        </h6>
        <ul className="list-unstyled mb-0">
          {[
            { label: 'Billed', value: money(row.billed) },
            { label: 'Collected', value: money(row.paid) },
            { label: 'Fine Added', value: row.fine ? row.fine.amount : '—' },
            { label: 'Net Outstanding', value: money(netOutstanding(row)) },
          ].map((item, index, arr) => (
            <li
              className={`d-flex justify-content-between py-1 fs-13${index === arr.length - 1 ? ' fw-medium' : ' border-bottom'}`}
              key={item.label}
            >
              <span className={index === arr.length - 1 ? undefined : 'text-muted'}>{item.label}</span>
              <span className="text-dark">{item.value}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="col-lg-4 col-md-6">
        <h6 className="fs-13 mb-2">
          <i className="ti ti-alert-triangle text-danger me-1" />
          Fine Details
        </h6>
        {row.fine ? (
          <div className="d-flex align-items-start justify-content-between">
            <div>
              <span className="fs-13 d-block">{row.fine.label}</span>
              <span className="fs-12 text-muted">{row.fine.note}</span>
            </div>
            <span className="fs-13 fw-medium">{row.fine.amount}</span>
          </div>
        ) : (
          <p className="fs-12 text-muted mb-0">No fine linked to this invoice.</p>
        )}
      </div>

      <div className="col-lg-4 col-md-6">
        <h6 className="fs-13 mb-2">
          <i className="ti ti-award text-success me-1" />
          Scholarship Adjustments
        </h6>
        <p className="fs-12 text-muted mb-0">{row.scholarship ?? 'No scholarship applied.'}</p>
      </div>

      <div className="col-lg-4 col-md-6">
        <h6 className="fs-13 mb-2">
          <i className="ti ti-user text-secondary me-1" />
          Parent Contact Information
        </h6>
        <ul className="list-unstyled mb-0">
          {[
            { label: 'Guardian', value: row.guardian.name },
            { label: 'Relation', value: row.guardian.relation },
            { label: 'Mobile', value: row.guardian.mobile },
            { label: 'Email', value: row.guardian.email },
          ].map((item, index, arr) => (
            <li
              className={`d-flex justify-content-between py-1 fs-13${index === arr.length - 1 ? '' : ' border-bottom'}`}
              key={item.label}
            >
              <span className="text-muted">{item.label}</span>
              <span className="text-dark">{item.value}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="col-12">
        <h6 className="fs-13 mb-2">
          <i className="ti ti-note text-muted me-1" />
          Internal Notes
        </h6>
        <p className="fs-13 text-muted mb-0">{row.notes}</p>
        <div className="d-flex flex-wrap gap-2 mt-3 pt-3 border-top">
          <button type="button" className="btn btn-primary btn-sm" onClick={() => openModal(row, 'payment')}>
            <i className="ti ti-cash me-1" />
            Record Payment
          </button>
          <button
            type="button"
            className="btn btn-outline-light bg-white btn-sm"
            onClick={() => openModal(row, 'reminder')}
          >
            <i className="ti ti-bell me-1" />
            Send Reminder
          </button>
          <button type="button" className="btn btn-outline-light bg-white btn-sm" onClick={() => setPanelRow(row)}>
            <i className="ti ti-wallet me-1" />
            Collection Actions
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
              <h3 className="page-title mb-1">Due Reports</h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={routes.adminDashboard}>Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <Link to="#">Finance &amp; Accounts</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Due Reports
                  </li>
                </ol>
              </nav>
            </div>
            <div className="d-flex my-xl-auto right-content align-items-center flex-wrap">
              <button
                type="button"
                className="btn btn-outline-light bg-white me-2 mb-2 d-inline-flex align-items-center"
                onClick={() => openModal(null, 'export')}
              >
                <i className="ti ti-file-export me-1" />
                Export Report
              </button>
              <button
                type="button"
                className="btn btn-primary mb-2 d-inline-flex align-items-center"
                onClick={() => {
                  if (workspace.selected.length === 0) {
                    push('Select at least one invoice first', 'warning');
                    return;
                  }
                  push(`${workspace.selected.length} reminders sent`);
                }}
              >
                <i className="ti ti-bell me-1" />
                Send Reminders
              </button>
            </div>
          </div>
          {/* /Page Header */}

          {/* Outstanding Summary */}
          <SummaryCard items={summary} />

          <div className="data-workspace page-toolbar-compact">
            <div className="card">
              <WorkspaceHeader
                searchPlaceholder="Search student, admission or invoice…"
                searchLabel="Search dues"
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
                  push('Filters cleared');
                }}
                matchCount={workspace.visible.length}
                totalCount={rows.length}
                matchNoun="invoices"
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
                  push('Due report refreshed');
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
                  <h5 className="mb-1">No Outstanding Dues Found</h5>
                  <p className="text-muted mb-0">No invoice matches the selected filters.</p>
                </div>
              ) : null}

              <div className="card-footer d-flex align-items-center justify-content-between flex-wrap gap-2">
                <p className="mb-0 text-muted">
                  Showing {workspace.rangeStart} to {workspace.rangeEnd} of {workspace.visible.length} invoices
                </p>
                <nav>
                  <ul className="pagination mb-0">
                    <li className={`page-item${workspace.page === 1 ? ' disabled' : ''}`}>
                      <button
                        type="button"
                        className="page-link"
                        onClick={() => workspace.setPage(Math.max(1, workspace.page - 1))}
                      >
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
                      <button
                        type="button"
                        className="page-link"
                        onClick={() => workspace.setPage(Math.min(workspace.pageCount, workspace.page + 1))}
                      >
                        Next
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          </div>

          {/* Collection Actions Offcanvas */}
          <Offcanvas
            open={panelRow !== null}
            onClose={() => setPanelRow(null)}
            title="Collection Actions"
            labelledById="collection_panel_lbl"
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
                      {panelRow.admissionNo} · {panelRow.className}
                    </span>
                  </div>
                  <span className={`dt-pill ${statusPill[panelRow.status]} ms-auto`}>
                    <span className="dt-pill-dot" />
                    {panelRow.status}
                  </span>
                </div>

                <div className="border rounded p-3 mb-3 d-flex justify-content-between align-items-center">
                  <span className="fw-medium">Net Outstanding</span>
                  <h5 className="mb-0">{money(netOutstanding(panelRow))}</h5>
                </div>

                <ul className="list-unstyled mb-3">
                  {[
                    { label: 'Invoice', value: panelRow.invoiceNo },
                    { label: 'Due Date', value: panelRow.dueDate },
                    { label: 'Days Overdue', value: daysOverdueLabel(panelRow) },
                    { label: 'Guardian', value: panelRow.guardian.name },
                    { label: 'Mobile', value: panelRow.guardian.mobile },
                  ].map((item, index, arr) => (
                    <li
                      className={`d-flex justify-content-between py-1 fs-13${index === arr.length - 1 ? '' : ' border-bottom'}`}
                      key={item.label}
                    >
                      <span className="text-muted">{item.label}</span>
                      <span className="text-dark">{item.value}</span>
                    </li>
                  ))}
                </ul>

                <div className="d-flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="btn btn-primary btn-sm flex-fill"
                    onClick={() => {
                      const row = panelRow;
                      setPanelRow(null);
                      openModal(row, 'payment');
                    }}
                  >
                    <i className="ti ti-cash me-1" />
                    Record Payment
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-light bg-white btn-sm flex-fill"
                    onClick={() => {
                      const row = panelRow;
                      setPanelRow(null);
                      openModal(row, 'reminder');
                    }}
                  >
                    <i className="ti ti-bell me-1" />
                    Reminder
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-light bg-white btn-sm flex-fill"
                    onClick={() => {
                      const row = panelRow;
                      setPanelRow(null);
                      openModal(row, 'statement');
                    }}
                  >
                    <i className="ti ti-file-text me-1" />
                    Statement
                  </button>
                </div>
              </>
            ) : null}
          </Offcanvas>
          {/* /Collection Actions Offcanvas */}
        </div>
      </div>
      {/* /Page Wrapper */}

      <DueModals
        active={activeModal}
        row={modalRow}
        onClose={() => setActiveModal(null)}
        onToast={push}
        onRecordPayment={recordPayment}
      />

      <ToastStack toasts={toasts} onDismiss={dismiss} id="drToasts" />
    </>
  );
};

export default DueReports;
