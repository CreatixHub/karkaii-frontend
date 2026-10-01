import { useCallback, useMemo, useState } from 'react';
import Modal from '@components/ui/Modal';
import Offcanvas from '@components/ui/Offcanvas';
import ToastStack from '@components/ui/ToastStack';
import { ActionLink, PageHeader, WorkspaceShell, useWorkspace } from '@components/workspace';
import type {
  ColumnDef, FilterField, QuickFilter, SavedView, SortOption, SummaryItem, WorkspaceMenu,
} from '@components/workspace';
import { all_routes } from '@/routes/all_routes';
import { useToasts } from '@hooks/useToasts';
import type { LedgerAccount } from './data/ledger.data';
import {
  balanceTypeOf, closingBalance, costCentreOptions, ledgerAccounts as initialRows,
  ledgerGroupOptions, money, statusBadge, statusPill, typeTint,
} from './data/ledger.data';

const routes = all_routes;

const filterFields: FilterField[] = [
  { id: 'account-type', label: 'Account Type', kind: 'select', chipLabel: 'Type', options: ['Asset', 'Liability', 'Income', 'Expense', 'Equity'] },
  { id: 'ledger-group', label: 'Ledger Group', kind: 'select', chipLabel: 'Group', options: ledgerGroupOptions },
  { id: 'financial-year', label: 'Financial Year', kind: 'select', chipLabel: 'FY', options: ['2026 – 2027', '2025 – 2026', '2024 – 2025'] },
  { id: 'status', label: 'Status', kind: 'select', chipLabel: 'Status', options: ['Active', 'Inactive', 'Unposted', 'Locked'] },
  { id: 'balance-type', label: 'Balance Type', kind: 'select', chipLabel: 'Balance', options: ['Debit balance', 'Credit balance', 'Nil balance'] },
  { id: 'cost-centre', label: 'Cost Centre', kind: 'select', chipLabel: 'Cost centre', options: costCentreOptions },
  { id: 'period-from', label: 'Period From', kind: 'date', chipLabel: 'From', placeholder: '01-04-2026' },
  { id: 'period-to', label: 'Period To', kind: 'date', chipLabel: 'To', placeholder: '31-07-2026' },
];

/** Counts are the template's school-wide figures across 48 accounts. */
const savedViews: SavedView[] = [
  { id: 'all', label: 'All Accounts', icon: 'ti ti-layout-list', count: 48 },
  { id: 'income', label: 'Income Accounts', icon: 'ti ti-report-money', count: 9 },
  { id: 'expense', label: 'Expense Accounts', icon: 'ti ti-cash', count: 21 },
  { id: 'bank', label: 'Bank & Cash', icon: 'ti ti-building-bank', count: 6 },
  { id: 'unposted', label: 'Unposted Entries', icon: 'ti ti-alert-triangle', count: 4 },
];

const quickFilters: QuickFilter[] = [
  { id: 'Active', label: 'Active', icon: 'ti ti-checks', count: 44 },
  { id: 'income', label: 'Income', icon: 'ti ti-report-money', count: 9 },
  { id: 'expense', label: 'Expense', icon: 'ti ti-cash', count: 21 },
  { id: 'bank', label: 'Bank & Cash', icon: 'ti ti-building-bank', count: 6 },
  { id: 'Unposted', label: 'Unposted', icon: 'ti ti-alert-triangle', count: 4 },
];

const sortOptions: SortOption[] = [
  { id: 'code', label: 'Ledger code', icon: 'ti ti-hash' },
  { id: 'name', label: 'Account name (A–Z)', icon: 'ti ti-abc' },
  { id: 'closing', label: 'Closing balance', icon: 'ti ti-scale' },
  { id: 'group', label: 'Ledger group', icon: 'ti ti-folder' },
  { id: 'last', label: 'Last transaction', icon: 'ti ti-clock' },
];

type LedgerModalId = 'add' | 'edit' | 'view' | 'transactions' | 'export' | 'print';

const Ledger = () => {
  const [rows, setRows] = useState<LedgerAccount[]>(initialRows);
  const [openMenu, setOpenMenu] = useState<WorkspaceMenu>(null);
  const [activeModal, setActiveModal] = useState<LedgerModalId | null>(null);
  const [modalRow, setModalRow] = useState<LedgerAccount | null>(null);
  const [panelRow, setPanelRow] = useState<LedgerAccount | null>(null);

  const { toasts, push, dismiss } = useToasts();

  const openModal = useCallback((row: LedgerAccount | null, modal: LedgerModalId) => {
    setModalRow(row);
    setActiveModal(modal);
  }, []);

  const signed = (row: LedgerAccount) => `${money(closingBalance(row))} ${row.side}`;

  const columns = useMemo<ColumnDef<LedgerAccount>[]>(
    () => [
      {
        id: 'code', label: 'Ledger Code', sortable: true, toggleable: false,
        render: (row) => <ActionLink className="fw-medium" onClick={() => openModal(row, 'view')}>{row.code}</ActionLink>,
      },
      {
        id: 'name', label: 'Account Name', sortable: true,
        render: (row) => (
          <>
            <ActionLink className="dt-name" onClick={() => openModal(row, 'view')}>{row.name}</ActionLink>
            <div className="dt-sub">{row.code}</div>
          </>
        ),
      },
      { id: 'group', label: 'Ledger Group', sortable: true, render: (row) => row.group },
      {
        id: 'type', label: 'Account Type',
        render: (row) => <span className={`badge badge-soft-${typeTint[row.type]}`}>{row.type}</span>,
      },
      {
        id: 'opening', label: 'Opening Balance', align: 'end',
        render: (row) => `${money(row.opening)} ${row.side}`,
      },
      { id: 'debit', label: 'Total Debit', align: 'end', cellClassName: 'text-danger', render: (row) => money(row.debit) },
      { id: 'credit', label: 'Total Credit', align: 'end', cellClassName: 'text-success', render: (row) => money(row.credit) },
      {
        id: 'closing', label: 'Closing Balance', sortable: true, align: 'end', cellClassName: 'fw-medium',
        render: (row) => signed(row),
      },
      {
        id: 'last', label: 'Last Transaction', sortable: true,
        render: (row) => (
          <>
            <span className="d-block fs-13">{row.lastTransaction}</span>
            <span className="fs-12 text-muted">{row.lastTransactionAgo}</span>
          </>
        ),
      },
      {
        id: 'status', label: 'Status', toggleable: false,
        render: (row) => (
          <span className={`dt-pill ${statusPill[row.status]}`}>
            <span className="dt-pill-dot" />{row.status}
          </span>
        ),
      },
    ],
    [openModal],
  );

  const workspace = useWorkspace<LedgerAccount>({
    rows, filterFields, columns,
    getId: (row) => row.id,
    search: (row, term) => `${row.name} ${row.code} ${row.group}`.toLowerCase().includes(term),
    matches: (row, filters) => {
      if (filters['account-type'] && row.type !== filters['account-type']) return false;
      if (filters['ledger-group'] && row.group !== filters['ledger-group']) return false;
      if (filters['financial-year'] && row.financialYear !== filters['financial-year']) return false;
      if (filters.status && row.status !== filters.status) return false;
      if (filters['balance-type'] && balanceTypeOf(row) !== filters['balance-type']) return false;
      if (filters['cost-centre'] && row.costCentre !== filters['cost-centre']) return false;
      return true;
    },
    quickMatch: (row, quick) => {
      if (!quick) return true;
      if (quick === 'income') return row.type === 'Income';
      if (quick === 'expense') return row.type === 'Expense';
      if (quick === 'bank') return row.group === 'Bank Accounts';
      return row.status === quick;
    },
    viewMatch: (row, view) => {
      if (view === 'income') return row.type === 'Income';
      if (view === 'expense') return row.type === 'Expense';
      if (view === 'bank') return row.group === 'Bank Accounts';
      if (view === 'unposted') return row.status === 'Unposted';
      return true;
    },
    compare: (a, b, sort) => {
      switch (sort) {
        case 'name': return a.name.localeCompare(b.name);
        case 'closing': return closingBalance(b) - closingBalance(a);
        case 'group': return a.group.localeCompare(b.group) || a.name.localeCompare(b.name);
        case 'last': return b.lastTransaction.localeCompare(a.lastTransaction);
        case 'code':
        default: return a.code.localeCompare(b.code);
      }
    },
    defaultSort: 'code',
    pageSize: 8,
  });

  const summary = useMemo<SummaryItem[]>(() => {
    const debitSide = rows.filter((r) => r.side === 'Dr');
    const creditSide = rows.filter((r) => r.side === 'Cr');
    const active = rows.filter((r) => r.status === 'Active');
    const locked = rows.filter((r) => r.status === 'Locked');
    const bank = rows.filter((r) => r.group === 'Bank Accounts');
    const sum = (list: LedgerAccount[]) => list.reduce((t, r) => t + closingBalance(r), 0);
    const groups = new Set(rows.map((r) => r.group)).size;

    return [
      { id: 'total', tint: 'primary', icon: 'ti ti-book', label: 'Total Ledger Accounts', value: String(rows.length), hint: `${groups} groups` },
      { id: 'debit', tint: 'danger', icon: 'ti ti-arrow-up-right', label: 'Debit Balance', value: money(sum(debitSide)), hint: 'assets & expenses' },
      { id: 'credit', tint: 'success', icon: 'ti ti-arrow-down-left', label: 'Credit Balance', value: money(sum(creditSide)), hint: 'income & liabilities' },
      { id: 'active', tint: 'info', icon: 'ti ti-checks', label: 'Active Accounts', value: String(active.length), hint: `${locked.length} locked` },
      { id: 'closing', tint: 'warning', icon: 'ti ti-scale', label: 'Closing Balance', value: money(sum(bank)), hint: 'as on 31 Jul 2026' },
    ];
  }, [rows]);

  const rowActions = (row: LedgerAccount) => (
    <div className="dt-actions">
      <ActionLink className="dt-ib" ariaLabel="View account" onClick={() => setPanelRow(row)}>
        <i className="ti ti-eye" />
      </ActionLink>
      <ActionLink className="dt-ib" ariaLabel="View transactions" onClick={() => openModal(row, 'transactions')}>
        <i className="ti ti-list" />
      </ActionLink>
      <ActionLink className="dt-ib" ariaLabel="Edit account" onClick={() => openModal(row, 'edit')}>
        <i className="ti ti-edit" />
      </ActionLink>
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

  const renderDetail = (row: LedgerAccount) => (
    <div className="row g-3">
      <div className="col-lg-4 col-md-6">
        <h6 className="fs-13 mb-2"><i className="ti ti-book text-primary me-1" />Account</h6>
        {infoList([
          { label: 'Ledger Code', value: row.code },
          { label: 'Group', value: row.group },
          { label: 'Type', value: row.type },
          { label: 'Cost Centre', value: row.costCentre },
        ])}
      </div>
      <div className="col-lg-4 col-md-6">
        <h6 className="fs-13 mb-2"><i className="ti ti-scale text-success me-1" />Movements</h6>
        {infoList([
          { label: 'Opening', value: `${money(row.opening)} ${row.side}` },
          { label: 'Total Debit', value: money(row.debit) },
          { label: 'Total Credit', value: money(row.credit) },
          { label: 'Closing', value: signed(row) },
        ])}
      </div>
      <div className="col-lg-4 col-md-6">
        <h6 className="fs-13 mb-2"><i className="ti ti-clock text-info me-1" />Period</h6>
        {infoList([
          { label: 'Financial Year', value: row.financialYear },
          { label: 'Last Transaction', value: row.lastTransaction },
          { label: 'Balance Type', value: balanceTypeOf(row) },
          { label: 'Status', value: row.status },
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
            title="General Ledger"
            section="Accounts"
            dashboardTo={routes.adminDashboard}
            actions={
              <>
                <button type="button" className="btn btn-outline-light bg-white me-2 mb-2 d-inline-flex align-items-center" onClick={() => openModal(null, 'print')}>
                  <i className="ti ti-printer me-1" />Print Ledger
                </button>
                <button type="button" className="btn btn-outline-light bg-white me-2 mb-2 d-inline-flex align-items-center" onClick={() => openModal(null, 'export')}>
                  <i className="ti ti-file-export me-1" />Export
                </button>
                <button type="button" className="btn btn-primary mb-2 d-inline-flex align-items-center" onClick={() => openModal(null, 'add')}>
                  <i className="ti ti-square-rounded-plus me-1" />Add Ledger Account
                </button>
              </>
            }
          />

          <WorkspaceShell
            workspace={workspace}
            columns={columns}
            getId={(row) => row.id}
            totalCount={rows.length}
            searchPlaceholder="Search account name or ledger code…"
            searchLabel="Search ledger accounts"
            savedViews={savedViews}
            filterFields={filterFields}
            quickFilters={quickFilters}
            sortOptions={sortOptions}
            noun="accounts"
            openMenu={openMenu}
            onOpenMenu={setOpenMenu}
            onRefresh={() => { setRows(initialRows); push('Ledger refreshed'); }}
            onSaveView={() => push('Current view saved')}
            onToast={push}
            renderDetail={renderDetail}
            renderActions={rowActions}
            emptyIcon="ti ti-book-off"
            emptyTitle="No Ledger Accounts Found"
            emptyBody="No account matches the selected filters."
            summary={summary}
          />

          <Offcanvas open={panelRow !== null} onClose={() => setPanelRow(null)} title="Account Details" labelledById="lg_panel_lbl">
            {panelRow ? (
              <>
                <div className="d-flex align-items-center justify-content-between pb-3 mb-3 border-bottom">
                  <div>
                    <h6 className="mb-0">{panelRow.name}</h6>
                    <span className="fs-12 text-muted">{panelRow.code} · {panelRow.group}</span>
                  </div>
                  <span className={`dt-pill ${statusPill[panelRow.status]}`}>
                    <span className="dt-pill-dot" />{panelRow.status}
                  </span>
                </div>
                <div className="border rounded p-3 mb-3 d-flex justify-content-between align-items-center">
                  <span className="fw-medium">Closing Balance</span>
                  <h5 className="mb-0">{signed(panelRow)}</h5>
                </div>
                {infoList([
                  { label: 'Opening', value: `${money(panelRow.opening)} ${panelRow.side}` },
                  { label: 'Total Debit', value: money(panelRow.debit) },
                  { label: 'Total Credit', value: money(panelRow.credit) },
                  { label: 'Cost Centre', value: panelRow.costCentre },
                  { label: 'Financial Year', value: panelRow.financialYear },
                ])}
                <button
                  type="button"
                  className="btn btn-primary w-100 mt-3"
                  onClick={() => { const r = panelRow; setPanelRow(null); openModal(r, 'transactions'); }}
                >
                  <i className="ti ti-list me-1" />View Transactions
                </button>
              </>
            ) : null}
          </Offcanvas>
        </div>
      </div>

      {/* Modals */}
      {(['add', 'edit'] as const).map((mode) => (
        <Modal
          key={mode}
          open={activeModal === mode && (mode === 'add' || modalRow !== null)}
          onClose={() => setActiveModal(null)}
          title={mode === 'add' ? 'Add Ledger Account' : 'Edit Ledger Account'}
          dialogClassName="modal-lg"
          onSubmit={(e) => { e.preventDefault(); push(mode === 'add' ? 'Ledger account added' : 'Ledger account updated'); setActiveModal(null); }}
          footer={
            <>
              <button type="button" className="btn btn-light me-2" onClick={() => setActiveModal(null)}>Cancel</button>
              <button type="submit" className="btn btn-primary">{mode === 'add' ? 'Add Account' : 'Save Changes'}</button>
            </>
          }
        >
          <div className="row">
            <div className="col-md-6"><div className="mb-3">
              <label className="form-label" htmlFor={`lg-name-${mode}`}>Account Name</label>
              <input type="text" className="form-control" id={`lg-name-${mode}`} defaultValue={mode === 'edit' ? modalRow?.name : ''} />
            </div></div>
            <div className="col-md-6"><div className="mb-3">
              <label className="form-label" htmlFor={`lg-code-${mode}`}>Ledger Code</label>
              <input type="text" className="form-control" placeholder="LGR-0000" id={`lg-code-${mode}`} defaultValue={mode === 'edit' ? modalRow?.code : ''} />
            </div></div>
            <div className="col-md-6"><div className="mb-3">
              <label className="form-label" htmlFor={`lg-group-${mode}`}>Ledger Group</label>
              <select className="form-select" id={`lg-group-${mode}`} defaultValue={mode === 'edit' ? modalRow?.group : ledgerGroupOptions[0]}>
                {ledgerGroupOptions.map((o) => <option key={o}>{o}</option>)}
              </select>
            </div></div>
            <div className="col-md-6"><div className="mb-0">
              <label className="form-label" htmlFor={`lg-type-${mode}`}>Account Type</label>
              <select className="form-select" id={`lg-type-${mode}`} defaultValue={mode === 'edit' ? modalRow?.type : 'Asset'}>
                {['Asset', 'Liability', 'Income', 'Expense', 'Equity'].map((o) => <option key={o}>{o}</option>)}
              </select>
            </div></div>
          </div>
        </Modal>
      ))}

      <Modal
        open={activeModal === 'view' && modalRow !== null}
        onClose={() => setActiveModal(null)}
        title="Ledger Account"
        dialogClassName="modal-lg"
        footer={<button type="button" className="btn btn-light" onClick={() => setActiveModal(null)}>Close</button>}
      >
        {modalRow ? (
          <>
            <div className="d-flex align-items-center justify-content-between mb-3 pb-3 border-bottom">
              <div>
                <div className="d-flex align-items-center gap-2">
                  <h5 className="mb-0">{modalRow.name}</h5>
                  <span className="badge bg-primary-transparent text-primary">{modalRow.code}</span>
                  <span className={statusBadge[modalRow.status]}>{modalRow.status}</span>
                </div>
                <p className="mb-0 text-muted fs-13">{modalRow.group} · {modalRow.type}</p>
              </div>
              <h5 className="mb-0">{signed(modalRow)}</h5>
            </div>
            {renderDetail(modalRow)}
          </>
        ) : null}
      </Modal>

      <Modal
        open={activeModal === 'transactions' && modalRow !== null}
        onClose={() => setActiveModal(null)}
        title="Account Transactions"
        dialogClassName="modal-lg"
        footer={<button type="button" className="btn btn-light" onClick={() => setActiveModal(null)}>Close</button>}
      >
        {modalRow ? (
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr><th>Particulars</th><th className="text-end">Debit</th><th className="text-end">Credit</th><th className="text-end">Balance</th></tr>
              </thead>
              <tbody>
                <tr>
                  <td>Opening Balance</td><td className="text-end">—</td><td className="text-end">—</td>
                  <td className="text-end">{money(modalRow.opening)} {modalRow.side}</td>
                </tr>
                <tr>
                  <td>Period Movements</td>
                  <td className="text-end text-danger">{money(modalRow.debit)}</td>
                  <td className="text-end text-success">{money(modalRow.credit)}</td>
                  <td className="text-end">—</td>
                </tr>
                <tr>
                  <td className="fw-medium">Closing Balance</td><td className="text-end">—</td><td className="text-end">—</td>
                  <td className="text-end fw-medium">{signed(modalRow)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        ) : null}
      </Modal>

      {([
        ['export', 'Export Ledger', 'Ledger export started', 'ti ti-file-export', 'Export'],
        ['print', 'Print Ledger', 'Ledger sent to print', 'ti ti-printer', 'Print'],
      ] as [LedgerModalId, string, string, string, string][]).map(([id, title, msg, icon, cta]) => (
        <Modal
          key={id}
          open={activeModal === id}
          onClose={() => setActiveModal(null)}
          title={title}
          onSubmit={(e) => {
            e.preventDefault();
            if (id === 'print') window.print();
            push(msg);
            setActiveModal(null);
          }}
          footer={
            <>
              <button type="button" className="btn btn-light me-2" onClick={() => setActiveModal(null)}>Cancel</button>
              <button type="submit" className="btn btn-primary"><i className={`${icon} me-1`} />{cta}</button>
            </>
          }
        >
          <div className="mb-0">
            <label className="form-label" htmlFor={`lg-${id}-scope`}>Scope</label>
            <select className="form-select" id={`lg-${id}-scope`} defaultValue="Current filters">
              {['Current filters', 'All accounts', 'Bank & cash only'].map((o) => <option key={o}>{o}</option>)}
            </select>
          </div>
        </Modal>
      ))}

      <ToastStack toasts={toasts} onDismiss={dismiss} id="lgToasts" />
    </>
  );
};

export default Ledger;
