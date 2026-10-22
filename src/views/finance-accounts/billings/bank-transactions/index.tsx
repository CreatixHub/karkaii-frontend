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
import { all_routes } from '@/routes/all_routes';
import { useToasts } from '@hooks/useToasts';
import TransactionModals from './modals/TransactionModals';
import type { TxnDraft, TxnModalId } from './modals/TransactionModals';
import type { BankTxn, ReconStatus } from './data/bankTransactions.data';
import {
  accountKey,
  accountOptions,
  amountBand,
  bankTransactions as initialRows,
  linkedBand,
  money,
  statusPill,
  txnType,
} from './data/bankTransactions.data';

const routes = all_routes;

const filterFields: FilterField[] = [
  { id: 'bank-account', label: 'Bank Account', kind: 'select', chipLabel: 'Account', options: accountOptions },
  { id: 'transaction-type', label: 'Transaction Type', kind: 'select', chipLabel: 'Type', options: ['Credit', 'Debit'] },
  { id: 'payment-method', label: 'Payment Method', kind: 'select', chipLabel: 'Method', options: ['Cash', 'UPI', 'Card', 'Bank Transfer', 'Cheque', 'Online', 'Auto Debit', 'Bulk Transfer'] },
  { id: 'reconciliation-status', label: 'Reconciliation Status', kind: 'select', chipLabel: 'Recon', options: ['Reconciled', 'Pending', 'In Clearing', 'Unmatched'] },
  { id: 'amount-range', label: 'Amount Range', kind: 'select', chipLabel: 'Amount', options: ['Under $500', '$500 – $2,000', '$2,000 – $10,000', 'Over $10,000'] },
  { id: 'linked-record', label: 'Linked Record', kind: 'select', chipLabel: 'Linked', options: ['Linked to receipt', 'Linked to invoice', 'Linked to payroll', 'Not linked'] },
  { id: 'date-from', label: 'Date From', kind: 'date', chipLabel: 'From', placeholder: '01-07-2026' },
  { id: 'date-to', label: 'Date To', kind: 'date', chipLabel: 'To', placeholder: '31-07-2026' },
];

/** Counts are the template's school-wide figures across 946 transactions. */
const savedViews: SavedView[] = [
  { id: 'all', label: 'All Transactions', icon: 'ti ti-layout-list', count: 946 },
  { id: 'pending', label: 'Pending Reconciliation', icon: 'ti ti-clock', count: 38 },
  { id: 'unmatched', label: 'Unmatched Credits', icon: 'ti ti-alert-triangle', count: 11 },
  { id: 'debits', label: 'Debits This Month', icon: 'ti ti-arrow-up-right', count: 64 },
  { id: 'reconciled', label: 'Reconciled', icon: 'ti ti-checks', count: 908 },
];

const quickFilters: QuickFilter[] = [
  { id: 'Pending', label: 'Pending', icon: 'ti ti-clock', count: 38 },
  { id: 'Unmatched', label: 'Unmatched', icon: 'ti ti-alert-triangle', count: 11 },
  { id: 'credits', label: 'Credits', icon: 'ti ti-arrow-down-left', count: 612 },
  { id: 'debits', label: 'Debits', icon: 'ti ti-arrow-up-right', count: 334 },
  { id: 'Reconciled', label: 'Reconciled', icon: 'ti ti-checks', count: 908 },
];

const sortOptions: SortOption[] = [
  { id: 'date', label: 'Transaction date (newest)', icon: 'ti ti-clock' },
  { id: 'amount', label: 'Amount', icon: 'ti ti-currency-dollar' },
  { id: 'account', label: 'Bank account', icon: 'ti ti-building-bank' },
  { id: 'txnId', label: 'Transaction ID', icon: 'ti ti-hash' },
  { id: 'status', label: 'Reconciliation status', icon: 'ti ti-checks' },
];

const BankTransactions = () => {
  const [rows, setRows] = useState<BankTxn[]>(initialRows);
  const [openMenu, setOpenMenu] = useState<WorkspaceMenu>(null);
  const [activeModal, setActiveModal] = useState<TxnModalId | null>(null);
  const [modalRow, setModalRow] = useState<BankTxn | null>(null);
  const [panelRow, setPanelRow] = useState<BankTxn | null>(null);

  const { toasts, push, dismiss } = useToasts();

  const openModal = useCallback((row: BankTxn | null, modal: TxnModalId) => {
    setModalRow(row);
    setActiveModal(modal);
  }, []);

  const columns = useMemo<ColumnDef<BankTxn>[]>(
    () => [
      {
        id: 'txnId',
        label: 'Transaction ID',
        toggleable: false,
        render: (row) => (
          <ActionLink className="fw-medium" onClick={() => openModal(row, 'view')}>
            {row.txnId}
          </ActionLink>
        ),
      },
      {
        id: 'date',
        label: 'Date',
        sortable: true,
        render: (row) => (
          <>
            <span className="d-block fs-13">{row.date}</span>
            <span className="fs-12 text-muted">{row.time}</span>
          </>
        ),
      },
      {
        id: 'account',
        label: 'Bank Account',
        sortable: true,
        render: (row) => (
          <>
            <span className="d-block fs-13">{row.account}</span>
            <span className="fs-12 text-muted">{row.accountMask}</span>
          </>
        ),
      },
      { id: 'description', label: 'Description', render: (row) => row.description },
      { id: 'referenceNo', label: 'Reference No.', cellClassName: 'fs-13', render: (row) => row.referenceNo },
      {
        id: 'type',
        label: 'Transaction Type',
        render: (row) => (
          <span className={`badge badge-soft-${txnType(row) === 'Credit' ? 'success' : 'danger'}`}>
            {txnType(row)}
          </span>
        ),
      },
      { id: 'paymentMethod', label: 'Payment Method', render: (row) => row.paymentMethod },
      {
        id: 'credit',
        label: 'Credit',
        align: 'end',
        cellClassName: 'text-success',
        render: (row) => (txnType(row) === 'Credit' ? money(row.amount) : '—'),
      },
      {
        id: 'debit',
        label: 'Debit',
        align: 'end',
        cellClassName: 'text-danger',
        render: (row) => (txnType(row) === 'Debit' ? money(row.amount) : '—'),
      },
      {
        id: 'balance',
        label: 'Balance',
        sortable: true,
        align: 'end',
        cellClassName: 'fw-medium',
        render: (row) => money(row.balance),
      },
      {
        id: 'status',
        label: 'Reconciliation Status',
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

  const workspace = useWorkspace<BankTxn>({
    rows,
    filterFields,
    columns,
    getId: (row) => row.id,
    search: (row, term) =>
      `${row.txnId} ${row.description} ${row.referenceNo}`.toLowerCase().includes(term),
    matches: (row, filters) => {
      if (filters['bank-account'] && accountKey(row) !== filters['bank-account']) return false;
      if (filters['transaction-type'] && txnType(row) !== filters['transaction-type']) return false;
      if (filters['payment-method'] && row.paymentMethod !== filters['payment-method']) return false;
      if (filters['reconciliation-status'] && row.status !== filters['reconciliation-status']) return false;
      if (filters['amount-range'] && amountBand(row) !== filters['amount-range']) return false;
      if (filters['linked-record'] && linkedBand(row) !== filters['linked-record']) return false;
      return true;
    },
    quickMatch: (row, quick) => {
      if (!quick) return true;
      if (quick === 'credits') return txnType(row) === 'Credit';
      if (quick === 'debits') return txnType(row) === 'Debit';
      return row.status === quick;
    },
    viewMatch: (row, view) => {
      if (view === 'pending') return row.status === 'Pending';
      if (view === 'unmatched') return row.status === 'Unmatched';
      if (view === 'debits') return txnType(row) === 'Debit';
      if (view === 'reconciled') return row.status === 'Reconciled';
      return true;
    },
    compare: (a, b, sort) => {
      switch (sort) {
        case 'amount':
          return Math.abs(b.amount) - Math.abs(a.amount);
        case 'account':
          return a.account.localeCompare(b.account) || b.txnId.localeCompare(a.txnId);
        case 'txnId':
          return b.txnId.localeCompare(a.txnId);
        case 'status':
          return a.status.localeCompare(b.status) || b.txnId.localeCompare(a.txnId);
        case 'date':
        default:
          return b.txnId.localeCompare(a.txnId);
      }
    },
    defaultSort: 'date',
    pageSize: 8,
  });

  /** Headline count stays the template's 946; the rest follow the sample. */
  const summary = useMemo<SummaryItem[]>(() => {
    const credits = rows.filter((row) => txnType(row) === 'Credit');
    const debits = rows.filter((row) => txnType(row) === 'Debit');
    const pending = rows.filter((row) => row.status === 'Pending' || row.status === 'Unmatched');
    const reconciled = rows.filter((row) => row.status === 'Reconciled');
    const sum = (list: BankTxn[]) => list.reduce((total, row) => total + Math.abs(row.amount), 0);
    const pct = rows.length === 0 ? 0 : Math.round((reconciled.length / rows.length) * 100);

    return [
      { id: 'total', tint: 'primary', icon: 'ti ti-arrows-exchange', label: 'Total Transactions', value: '946', hint: 'this financial year' },
      { id: 'credits', tint: 'success', icon: 'ti ti-arrow-down-left', label: 'Total Credits', value: money(sum(credits)), hint: `${credits.length} entries` },
      { id: 'debits', tint: 'danger', icon: 'ti ti-arrow-up-right', label: 'Total Debits', value: money(sum(debits)), hint: `${debits.length} entries` },
      { id: 'pending', tint: 'warning', icon: 'ti ti-clock', label: 'Pending Reconciliation', value: String(pending.length), hint: `${money(sum(pending))} unmatched` },
      { id: 'reconciled', tint: 'info', icon: 'ti ti-checks', label: 'Reconciled', value: String(reconciled.length), hint: `${pct}% matched` },
    ];
  }, [rows]);

  const reconcile = useCallback(
    (status: ReconStatus, note: string) => {
      if (!modalRow) return;
      setRows((current) =>
        current.map((row) =>
          row.id === modalRow.id ? { ...row, status, notes: note.trim() || row.notes } : row,
        ),
      );
      setActiveModal(null);
      push(`${modalRow.txnId} marked ${status}`);
    },
    [modalRow, push],
  );

  const createTxn = useCallback(
    (draft: TxnDraft) => {
      if (!draft.description.trim() || !draft.amount.trim()) {
        push('Give the transaction a description and an amount', 'warning');
        return;
      }
      const value = Number(draft.amount.replace(/[^0-9.]/g, '')) || 0;
      const [account, mask] = draft.account.split(' · ');
      setRows((current) => [
        {
          id: `TXN-${Date.now()}`,
          txnId: `TXN-${Date.now()}`,
          date: draft.date || '30 Jul 2026',
          time: '—',
          account,
          accountMask: `•••• ${mask ?? ''}`.trim(),
          description: draft.description.trim(),
          referenceNo: draft.reference.trim() || '—',
          paymentMethod: draft.method,
          amount: draft.type === 'Debit' ? -value : value,
          balance: current[0]?.balance ?? 0,
          status: 'Pending',
          details: [],
          bankReference: [],
          linked: null,
          student: null,
          notes: 'Manually added entry, awaiting reconciliation.',
        },
        ...current,
      ]);
      setActiveModal(null);
      push('Transaction added');
    },
    [push],
  );

  const updateTxn = useCallback(
    (draft: TxnDraft) => {
      if (!modalRow) return;
      const value = Number(draft.amount.replace(/[^0-9.]/g, '')) || Math.abs(modalRow.amount);
      setRows((current) =>
        current.map((row) =>
          row.id === modalRow.id
            ? {
                ...row,
                description: draft.description.trim() || row.description,
                referenceNo: draft.reference.trim() || row.referenceNo,
                paymentMethod: draft.method,
                amount: draft.type === 'Debit' ? -value : value,
                date: draft.date || row.date,
              }
            : row,
        ),
      );
      setActiveModal(null);
      push('Transaction updated');
    },
    [modalRow, push],
  );

  const rowActions = (row: BankTxn) => (
    <div className="dt-actions">
      <ActionLink className="dt-ib" ariaLabel="View transaction" onClick={() => setPanelRow(row)}>
        <i className="ti ti-eye" />
      </ActionLink>
      <ActionLink className="dt-ib" ariaLabel="Edit transaction" onClick={() => openModal(row, 'edit')}>
        <i className="ti ti-edit" />
      </ActionLink>
      <ActionLink className="dt-ib success" ariaLabel="Reconcile" onClick={() => openModal(row, 'reconcile')}>
        <i className="ti ti-checks" />
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

  const renderDetail = (row: BankTxn) => (
    <div className="row g-3">
      <div className="col-lg-3 col-md-6">
        <h6 className="fs-13 mb-2">
          <i className="ti ti-file-invoice text-primary me-1" />
          Transaction Details
        </h6>
        {infoList(row.details)}
      </div>
      <div className="col-lg-3 col-md-6">
        <h6 className="fs-13 mb-2">
          <i className="ti ti-building-bank text-info me-1" />
          Bank Reference
        </h6>
        {infoList(row.bankReference)}
      </div>
      <div className="col-lg-3 col-md-6">
        <h6 className="fs-13 mb-2">
          <i className="ti ti-link text-success me-1" />
          Linked Receipt / Invoice
        </h6>
        {row.linked ? (
          <>
            <span className="fs-13 d-block fw-medium">{row.linked.title}</span>
            <span className="fs-12 text-muted">{row.linked.note}</span>
          </>
        ) : (
          <p className="fs-12 text-muted mb-0">No billing record linked to this transaction.</p>
        )}
      </div>
      <div className="col-lg-3 col-md-6">
        <h6 className="fs-13 mb-2">
          <i className="ti ti-user text-secondary me-1" />
          Student Information
        </h6>
        {row.student ? (
          <>
            <span className="fs-13 d-block fw-medium">{row.student.name}</span>
            <span className="fs-12 text-muted">{row.student.meta}</span>
          </>
        ) : (
          <p className="fs-12 text-muted mb-0">Not a student-linked transaction.</p>
        )}
      </div>
      <div className="col-12">
        <h6 className="fs-13 mb-2">
          <i className="ti ti-note text-muted me-1" />
          Notes
        </h6>
        <p className="fs-13 text-muted mb-0">{row.notes}</p>
        <div className="d-flex flex-wrap gap-2 mt-3 pt-3 border-top">
          <button type="button" className="btn btn-primary btn-sm" onClick={() => openModal(row, 'reconcile')}>
            <i className="ti ti-checks me-1" />
            Reconcile
          </button>
          <button type="button" className="btn btn-outline-light bg-white btn-sm" onClick={() => setPanelRow(row)}>
            <i className="ti ti-eye me-1" />
            Open Details
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
              <h3 className="page-title mb-1">Bank Transactions</h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={routes.adminDashboard}>Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <Link to="#">Billing &amp; Finance</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Bank Transactions
                  </li>
                </ol>
              </nav>
            </div>
            <div className="d-flex my-xl-auto right-content align-items-center flex-wrap">
              <button
                type="button"
                className="btn btn-outline-light bg-white me-2 mb-2 d-inline-flex align-items-center"
                onClick={() => openModal(null, 'import')}
              >
                <i className="ti ti-file-import me-1" />
                Import Statement
              </button>
              <button
                type="button"
                className="btn btn-primary mb-2 d-inline-flex align-items-center"
                onClick={() => openModal(null, 'add')}
              >
                <i className="ti ti-square-rounded-plus me-1" />
                Add Transaction
              </button>
            </div>
          </div>
          {/* /Page Header */}

          <SummaryCard items={summary} />

          <div className="data-workspace page-toolbar-compact">
            <div className="card">
              <WorkspaceHeader
                searchPlaceholder="Search transaction, reference or UTR…"
                searchLabel="Search transactions"
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
                matchNoun="transactions"
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
                  push('Transactions refreshed');
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
                    <i className="ti ti-arrows-exchange fs-36" />
                  </span>
                  <h5 className="mb-1">No Transactions Found</h5>
                  <p className="text-muted mb-0">No transaction matches the selected filters.</p>
                </div>
              ) : null}

              <div className="card-footer d-flex align-items-center justify-content-between flex-wrap gap-2">
                <p className="mb-0 text-muted">
                  Showing {workspace.rangeStart} to {workspace.rangeEnd} of {workspace.visible.length} transactions
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

          {/* Transaction Details Offcanvas */}
          <Offcanvas
            open={panelRow !== null}
            onClose={() => setPanelRow(null)}
            title="Transaction Details"
            labelledById="txn_panel_lbl"
          >
            {panelRow ? (
              <>
                <div className="d-flex align-items-center justify-content-between pb-3 mb-3 border-bottom">
                  <div>
                    <h6 className="mb-0">{panelRow.txnId}</h6>
                    <span className="fs-12 text-muted">
                      {panelRow.date} · {panelRow.time}
                    </span>
                  </div>
                  <span className={`dt-pill ${statusPill[panelRow.status]}`}>
                    <span className="dt-pill-dot" />
                    {panelRow.status}
                  </span>
                </div>

                <div className="border rounded p-3 mb-3 d-flex justify-content-between align-items-center">
                  <span className="fw-medium">{txnType(panelRow)}</span>
                  <h5 className={`mb-0 ${txnType(panelRow) === 'Credit' ? 'text-success' : 'text-danger'}`}>
                    {txnType(panelRow) === 'Credit' ? '+' : '−'}
                    {money(panelRow.amount)}
                  </h5>
                </div>

                <h6 className="fs-13 mb-2">Transaction Details</h6>
                <ul className="list-unstyled mb-3">
                  {panelRow.details.map((item) => (
                    <li className="d-flex justify-content-between py-1 fs-13 border-bottom" key={item.label}>
                      <span className="text-muted">{item.label}</span>
                      <span className="text-dark">{item.value}</span>
                    </li>
                  ))}
                </ul>

                <h6 className="fs-13 mb-2">Bank Reference</h6>
                <ul className="list-unstyled mb-3">
                  {panelRow.bankReference.map((item) => (
                    <li className="d-flex justify-content-between py-1 fs-13 border-bottom" key={item.label}>
                      <span className="text-muted">{item.label}</span>
                      <span className="text-dark">{item.value}</span>
                    </li>
                  ))}
                </ul>

                <button
                  type="button"
                  className="btn btn-primary w-100"
                  onClick={() => {
                    const row = panelRow;
                    setPanelRow(null);
                    openModal(row, 'reconcile');
                  }}
                >
                  <i className="ti ti-checks me-1" />
                  Reconcile
                </button>
              </>
            ) : null}
          </Offcanvas>
          {/* /Transaction Details Offcanvas */}
        </div>
      </div>
      {/* /Page Wrapper */}

      <TransactionModals
        active={activeModal}
        row={modalRow}
        onClose={() => setActiveModal(null)}
        onToast={push}
        onCreate={createTxn}
        onUpdate={updateTxn}
        onReconcile={reconcile}
      />

      <ToastStack toasts={toasts} onDismiss={dismiss} id="btToasts" />
    </>
  );
};

export default BankTransactions;
