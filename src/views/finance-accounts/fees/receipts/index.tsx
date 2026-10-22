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
import ReceiptModals from './modals/ReceiptModals';
import type { ReceiptModalId } from './modals/ReceiptModals';
import type { Receipt } from './data/receipts.data';
import {
  amountPaid,
  money,
  receipts as initialRows,
  receiptDateTime,
  statusPill,
} from './data/receipts.data';

const routes = all_routes;

const filterFields: FilterField[] = [
  { id: 'receipt-no', label: 'Receipt No.', kind: 'date', chipLabel: 'Receipt', placeholder: 'RCP-2026-0000' },
  { id: 'payment-method', label: 'Payment Method', kind: 'select', chipLabel: 'Method', options: ['Cash', 'UPI', 'Card', 'Bank Transfer', 'Cheque', 'Online'] },
  { id: 'academic-year', label: 'Academic Year', kind: 'select', chipLabel: 'Academic Year', options: ['2026 / 2027', '2025 / 2026', '2024 / 2025'] },
  { id: 'status', label: 'Status', kind: 'select', chipLabel: 'Status', options: ['Completed', 'Pending Clearance', 'Cancelled', 'Refunded'] },
  { id: 'fee-category', label: 'Fee Category', kind: 'select', chipLabel: 'Category', options: ['Tuition Fee', 'Transport Fee', 'Hostel Fee', 'Exam Fee', 'Library Fee'] },
  { id: 'collected-by', label: 'Collected By', kind: 'select', chipLabel: 'Collector', options: ['Sarah Rose', 'Front Office', 'Mary Winsler', 'Parent Portal'] },
  { id: 'date-from', label: 'Date From', kind: 'date', chipLabel: 'From', placeholder: '01-07-2026' },
  { id: 'date-to', label: 'Date To', kind: 'date', chipLabel: 'To', placeholder: '31-07-2026' },
];

/** Counts are the template's own school-wide figures, not the eight-row sample. */
const savedViews: SavedView[] = [
  { id: 'all', label: 'All Receipts', icon: 'ti ti-layout-list', count: 1482 },
  { id: 'today', label: 'Today’s Collections', icon: 'ti ti-calendar-due', count: 34 },
  { id: 'cash', label: 'Cash Receipts', icon: 'ti ti-coin', count: 412 },
  { id: 'pending', label: 'Pending Clearance', icon: 'ti ti-clock', count: 9 },
  { id: 'cancelled', label: 'Cancelled & Refunded', icon: 'ti ti-receipt-off', count: 12 },
];

const quickFilters: QuickFilter[] = [
  { id: 'today', label: 'Today', icon: 'ti ti-calendar-due', count: 34 },
  { id: 'cash', label: 'Cash', icon: 'ti ti-coin', count: 412 },
  { id: 'online', label: 'Online', icon: 'ti ti-world', count: 986 },
  { id: 'pending', label: 'Pending Clearance', icon: 'ti ti-clock', count: 9 },
  { id: 'cancelled', label: 'Cancelled', icon: 'ti ti-receipt-off', count: 12 },
];

const sortOptions: SortOption[] = [
  { id: 'date', label: 'Payment date (newest)', icon: 'ti ti-clock' },
  { id: 'amount', label: 'Amount paid', icon: 'ti ti-currency-dollar' },
  { id: 'receipt', label: 'Receipt number', icon: 'ti ti-hash' },
  { id: 'student', label: 'Student name (A–Z)', icon: 'ti ti-abc' },
  { id: 'method', label: 'Payment method', icon: 'ti ti-credit-card' },
];

/** The most recent receipt date in the sample, used by the Today quick filter. */
const TODAY = '30 Jul 2026';

const Receipts = () => {
  const [rows, setRows] = useState<Receipt[]>(initialRows);
  const [openMenu, setOpenMenu] = useState<WorkspaceMenu>(null);
  const [activeModal, setActiveModal] = useState<ReceiptModalId | null>(null);
  const [modalRow, setModalRow] = useState<Receipt | null>(null);
  const [panelRow, setPanelRow] = useState<Receipt | null>(null);

  const { toasts, push, dismiss } = useToasts();

  const openModal = useCallback((row: Receipt | null, modal: ReceiptModalId) => {
    setModalRow(row);
    setActiveModal(modal);
  }, []);

  const columns = useMemo<ColumnDef<Receipt>[]>(
    () => [
      {
        id: 'receiptNo',
        label: 'Receipt No.',
        sortable: true,
        toggleable: false,
        render: (row) => (
          <ActionLink className="fw-medium" onClick={() => openModal(row, 'view')}>
            {row.receiptNo}
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
              <div className="dt-sub">{row.className}</div>
            </div>
          </div>
        ),
      },
      { id: 'admissionNo', label: 'Admission No.', cellClassName: 'fs-13', render: (row) => row.admissionNo },
      {
        id: 'paymentDate',
        label: 'Payment Date',
        sortable: true,
        render: (row) => (
          <>
            <span className="d-block fs-13">{row.paymentDate}</span>
            <span className="fs-12 text-muted">{row.paymentTime}</span>
          </>
        ),
      },
      {
        id: 'feeCategory',
        label: 'Fee Category',
        render: (row) => <span className={`badge badge-soft-${row.categoryTint}`}>{row.feeCategory}</span>,
      },
      { id: 'paymentMethod', label: 'Payment Method', sortable: true, render: (row) => row.paymentMethod },
      {
        id: 'amountPaid',
        label: 'Amount Paid',
        sortable: true,
        align: 'end',
        cellClassName: 'fw-medium',
        render: (row) => money(amountPaid(row)),
      },
      { id: 'referenceNo', label: 'Reference No.', cellClassName: 'fs-13', render: (row) => row.referenceNo },
      {
        id: 'collectedBy',
        label: 'Collected By',
        render: (row) => (
          <>
            <span className="d-block fs-13">{row.collectedBy}</span>
            <span className="fs-12 text-muted">{row.collectedByRole}</span>
          </>
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

  const workspace = useWorkspace<Receipt>({
    rows,
    filterFields,
    columns,
    getId: (row) => row.id,
    search: (row, term) =>
      `${row.student} ${row.receiptNo} ${row.referenceNo} ${row.admissionNo}`.toLowerCase().includes(term),
    matches: (row, filters) => {
      if (filters['receipt-no'] && !row.receiptNo.toLowerCase().includes(filters['receipt-no'].toLowerCase()))
        return false;
      if (filters['payment-method'] && row.paymentMethod !== filters['payment-method']) return false;
      if (filters['academic-year'] && row.academicYear !== filters['academic-year']) return false;
      if (filters.status && row.status !== filters.status) return false;
      if (filters['fee-category'] && row.feeCategory !== filters['fee-category']) return false;
      if (filters['collected-by'] && row.collectedBy !== filters['collected-by']) return false;
      return true;
    },
    quickMatch: (row, quick) => {
      if (!quick) return true;
      if (quick === 'today') return row.paymentDate === TODAY;
      if (quick === 'cash') return row.paymentMethod === 'Cash';
      if (quick === 'online') return row.paymentMethod === 'Online' || row.paymentMethod === 'UPI';
      if (quick === 'pending') return row.status === 'Pending Clearance';
      if (quick === 'cancelled') return row.status === 'Cancelled' || row.status === 'Refunded';
      return true;
    },
    viewMatch: (row, view) => {
      if (view === 'today') return row.paymentDate === TODAY;
      if (view === 'cash') return row.paymentMethod === 'Cash';
      if (view === 'pending') return row.status === 'Pending Clearance';
      if (view === 'cancelled') return row.status === 'Cancelled' || row.status === 'Refunded';
      return true;
    },
    compare: (a, b, sort) => {
      switch (sort) {
        case 'amount':
          return amountPaid(b) - amountPaid(a) || a.student.localeCompare(b.student);
        case 'receipt':
          return b.receiptNo.localeCompare(a.receiptNo);
        case 'student':
          return a.student.localeCompare(b.student);
        case 'method':
          return a.paymentMethod.localeCompare(b.paymentMethod) || a.student.localeCompare(b.student);
        case 'date':
        default:
          return b.receiptNo.localeCompare(a.receiptNo);
      }
    },
    defaultSort: 'date',
    pageSize: 8,
  });

  /**
   * The template's tiles are school-wide figures across 1,482 receipts, so the
   * headline numbers stay as written; the per-tile amounts follow the sample so
   * cancelling a receipt is visible.
   */
  const summary = useMemo<SummaryItem[]>(() => {
    const active = rows.filter((row) => row.status === 'Completed');
    const cash = active.filter((row) => row.paymentMethod === 'Cash');
    const online = active.filter((row) => row.paymentMethod === 'Online' || row.paymentMethod === 'UPI');
    const voided = rows.filter((row) => row.status === 'Cancelled' || row.status === 'Refunded');
    const sum = (list: Receipt[]) => list.reduce((total, row) => total + amountPaid(row), 0);

    return [
      { id: 'total', tint: 'primary', icon: 'ti ti-receipt', label: 'Total Receipts', value: '1,482', hint: 'this academic year' },
      { id: 'today', tint: 'success', icon: 'ti ti-cash', label: 'Today’s Collections', value: money(sum(active.filter((row) => row.paymentDate === TODAY))), hint: `${active.filter((row) => row.paymentDate === TODAY).length} receipts` },
      { id: 'cash', tint: 'warning', icon: 'ti ti-coin', label: 'Cash Payments', value: money(sum(cash)), hint: `${cash.length} receipts` },
      { id: 'online', tint: 'info', icon: 'ti ti-world', label: 'Online Payments', value: money(sum(online)), hint: `${online.length} receipts` },
      { id: 'cancelled', tint: 'danger', icon: 'ti ti-receipt-off', label: 'Cancelled Receipts', value: String(voided.length), hint: `${money(sum(voided))} reversed` },
    ];
  }, [rows]);

  const cancelReceipt = useCallback(
    (reason: string) => {
      if (!modalRow) return;
      setRows((current) =>
        current.map((row) =>
          row.id === modalRow.id
            ? { ...row, status: 'Cancelled', notes: reason.trim() ? `Cancelled — ${reason.trim()}` : row.notes }
            : row,
        ),
      );
      setActiveModal(null);
      push(`${modalRow.receiptNo} cancelled`);
    },
    [modalRow, push],
  );

  const rowActions = (row: Receipt) => (
    <div className="dt-actions">
      <ActionLink className="dt-ib" ariaLabel="View receipt" onClick={() => setPanelRow(row)}>
        <i className="ti ti-eye" />
      </ActionLink>
      <ActionLink className="dt-ib" ariaLabel="Print receipt" onClick={() => openModal(row, 'print')}>
        <i className="ti ti-printer" />
      </ActionLink>
      <ActionLink className="dt-ib" ariaLabel="Email receipt" onClick={() => openModal(row, 'email')}>
        <i className="ti ti-mail" />
      </ActionLink>
      <ActionLink className="dt-ib danger" ariaLabel="Cancel receipt" onClick={() => openModal(row, 'cancel')}>
        <i className="ti ti-receipt-off" />
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

  const renderDetail = (row: Receipt) => (
    <div className="row g-3">
      <div className="col-lg-4 col-md-6">
        <h6 className="fs-13 mb-2">
          <i className="ti ti-receipt text-primary me-1" />
          Receipt Details
        </h6>
        {infoList([
          { label: 'Receipt No', value: row.receiptNo },
          { label: 'Invoice No', value: row.invoiceNo },
          { label: 'Issued On', value: receiptDateTime(row) },
          { label: 'Term', value: row.term },
          { label: 'Source', value: row.source },
        ])}
      </div>

      <div className="col-lg-4 col-md-6">
        <h6 className="fs-13 mb-2">
          <i className="ti ti-list text-info me-1" />
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
            <span>Amount Paid</span>
            <span>{money(amountPaid(row))}</span>
          </li>
        </ul>
      </div>

      <div className="col-lg-4 col-md-6">
        <h6 className="fs-13 mb-2">
          <i className="ti ti-credit-card text-success me-1" />
          Payment Information
        </h6>
        {infoList(row.paymentInfo)}
      </div>

      <div className="col-lg-4 col-md-6">
        <h6 className="fs-13 mb-2">
          <i className="ti ti-alert-triangle text-danger me-1" />
          Fine Collected
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
          <p className="fs-12 text-muted mb-0">No fine collected on this receipt.</p>
        )}
      </div>

      <div className="col-lg-4 col-md-6">
        <h6 className="fs-13 mb-2">
          <i className="ti ti-discount text-warning me-1" />
          Applied Discounts
        </h6>
        <p className="fs-12 text-muted mb-0">{row.discount ?? 'No discount applied.'}</p>
      </div>

      <div className="col-lg-4 col-md-6">
        <h6 className="fs-13 mb-2">
          <i className="ti ti-award text-secondary me-1" />
          Scholarship Adjustment
        </h6>
        <p className="fs-12 text-muted mb-0">
          {row.scholarship ?? 'No scholarship adjustment on this receipt.'}
        </p>
      </div>

      <div className="col-12">
        <h6 className="fs-13 mb-2">
          <i className="ti ti-note text-muted me-1" />
          Notes
        </h6>
        <p className="fs-13 text-muted mb-0">{row.notes}</p>
        <div className="d-flex flex-wrap gap-2 mt-3 pt-3 border-top">
          <button type="button" className="btn btn-primary btn-sm" onClick={() => openModal(row, 'print')}>
            <i className="ti ti-printer me-1" />
            Print
          </button>
          <button
            type="button"
            className="btn btn-outline-light bg-white btn-sm"
            onClick={() => openModal(row, 'email')}
          >
            <i className="ti ti-mail me-1" />
            Email
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
              <h3 className="page-title mb-1">Receipts</h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={routes.adminDashboard}>Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <Link to="#">Finance &amp; Accounts</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Receipts
                  </li>
                </ol>
              </nav>
            </div>
            <div className="d-flex my-xl-auto right-content align-items-center flex-wrap">
              <button
                type="button"
                className="btn btn-outline-light bg-white me-2 mb-2 d-inline-flex align-items-center"
                onClick={() => window.print()}
              >
                <i className="ti ti-printer me-1" />
                Print
              </button>
              <button
                type="button"
                className="btn btn-primary mb-2 d-inline-flex align-items-center"
                onClick={() => openModal(null, 'generate')}
              >
                <i className="ti ti-square-rounded-plus me-1" />
                Generate Receipt
              </button>
            </div>
          </div>
          {/* /Page Header */}

          <SummaryCard items={summary} />

          <div className="data-workspace page-toolbar-compact">
            <div className="card">
              <WorkspaceHeader
                searchPlaceholder="Search student, receipt or reference…"
                searchLabel="Search receipts"
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
                matchNoun="receipts"
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
                  push('Receipts refreshed');
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
                    <i className="ti ti-receipt-off fs-36" />
                  </span>
                  <h5 className="mb-1">No Receipts Found</h5>
                  <p className="text-muted mb-0">No receipt matches the selected filters.</p>
                </div>
              ) : null}

              <div className="card-footer d-flex align-items-center justify-content-between flex-wrap gap-2">
                <p className="mb-0 text-muted">
                  Showing {workspace.rangeStart} to {workspace.rangeEnd} of {workspace.visible.length} receipts
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

          {/* Receipt Details Offcanvas */}
          <Offcanvas
            open={panelRow !== null}
            onClose={() => setPanelRow(null)}
            title="Receipt Details"
            labelledById="receipt_panel_lbl"
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

                <div className="border rounded p-3 mb-3 d-flex justify-content-between align-items-center">
                  <span className="fw-medium">Amount Paid</span>
                  <h5 className="mb-0">{money(amountPaid(panelRow))}</h5>
                </div>

                <h6 className="fs-13 mb-2">Fee Breakdown</h6>
                <ul className="list-unstyled mb-3">
                  {panelRow.feeBreakdown.map((line) => (
                    <li className="d-flex justify-content-between py-1 fs-13 border-bottom" key={line.label}>
                      <span className="text-muted">{line.label}</span>
                      <span className="text-dark">{line.amount}</span>
                    </li>
                  ))}
                </ul>

                <h6 className="fs-13 mb-2">Payment Information</h6>
                <ul className="list-unstyled mb-3">
                  {panelRow.paymentInfo.map((item) => (
                    <li className="d-flex justify-content-between py-1 fs-13 border-bottom" key={item.label}>
                      <span className="text-muted">{item.label}</span>
                      <span className="text-dark">{item.value}</span>
                    </li>
                  ))}
                </ul>

                <div className="d-flex gap-2">
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
          {/* /Receipt Details Offcanvas */}
        </div>
      </div>
      {/* /Page Wrapper */}

      <ReceiptModals
        active={activeModal}
        row={modalRow}
        onClose={() => setActiveModal(null)}
        onToast={push}
        onCancelReceipt={cancelReceipt}
      />

      <ToastStack toasts={toasts} onDismiss={dismiss} id="rcToasts" />
    </>
  );
};

export default Receipts;
