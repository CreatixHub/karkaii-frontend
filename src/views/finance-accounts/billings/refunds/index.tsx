import { useCallback, useMemo, useState } from 'react';
import Modal from '@components/ui/Modal';
import Offcanvas from '@components/ui/Offcanvas';
import ToastStack from '@components/ui/ToastStack';
import { ActionLink, PageHeader, WorkspaceShell, useWorkspace } from '@components/workspace';
import type {
  ColumnDef, FilterField, QuickFilter, SavedView, SortOption, SummaryItem, WorkspaceMenu,
} from '@components/workspace';
import ImageWithBasePath from '@core/common/imageWithBasePath';
import { all_routes } from '@/routes/all_routes';
import { useToasts } from '@hooks/useToasts';
import type { Refund, RefundStatus } from './data/refunds.data';
import {
  amountBand, approvalLine, money, refundModeOptions, refunds as initialRows, refundTypeOptions,
  statusBadge, statusPill,
} from './data/refunds.data';

const routes = all_routes;

const filterFields: FilterField[] = [
  { id: 'refund-type', label: 'Refund Type', kind: 'select', chipLabel: 'Type', options: refundTypeOptions },
  { id: 'refund-status', label: 'Refund Status', kind: 'select', chipLabel: 'Status', options: ['Pending Approval', 'Approved', 'Processing', 'Processed', 'Rejected'] },
  { id: 'payment-method', label: 'Payment Method', kind: 'select', chipLabel: 'Method', options: ['Cash', 'UPI', 'Card', 'Bank Transfer', 'Cheque', 'Wallet', 'Online'] },
  { id: 'refund-mode', label: 'Refund Mode', kind: 'select', chipLabel: 'Mode', options: refundModeOptions },
  { id: 'approved-by', label: 'Approved By', kind: 'select', chipLabel: 'Approver', options: ['Finance Manager', 'Accounts Head', 'Principal Office', 'Mary Winsler'] },
  { id: 'amount-range', label: 'Amount Range', kind: 'select', chipLabel: 'Amount', options: ['Under $100', '$100 – $500', '$500 – $1,500', 'Over $1,500'] },
  { id: 'requested-from', label: 'Requested From', kind: 'date', chipLabel: 'From', placeholder: '01-07-2026' },
  { id: 'requested-to', label: 'Requested To', kind: 'date', chipLabel: 'To', placeholder: '31-07-2026' },
];

/** Counts are the template's school-wide figures across 64 requests. */
const savedViews: SavedView[] = [
  { id: 'all', label: 'All Refunds', icon: 'ti ti-layout-list', count: 64 },
  { id: 'Pending Approval', label: 'Awaiting My Approval', icon: 'ti ti-clock', count: 9 },
  { id: 'Approved', label: 'Approved — Not Paid', icon: 'ti ti-thumb-up', count: 6 },
  { id: 'Processed', label: 'Processed', icon: 'ti ti-circle-check', count: 43 },
  { id: 'Rejected', label: 'Rejected', icon: 'ti ti-circle-x', count: 6 },
];

const quickFilters: QuickFilter[] = [
  { id: 'Pending Approval', label: 'Pending Approval', icon: 'ti ti-clock', count: 9 },
  { id: 'Approved', label: 'Approved', icon: 'ti ti-thumb-up', count: 6 },
  { id: 'Processing', label: 'Processing', icon: 'ti ti-progress-check', count: 4 },
  { id: 'Processed', label: 'Processed', icon: 'ti ti-circle-check', count: 43 },
  { id: 'Rejected', label: 'Rejected', icon: 'ti ti-circle-x', count: 6 },
];

const sortOptions: SortOption[] = [
  { id: 'requested', label: 'Requested date (newest)', icon: 'ti ti-clock' },
  { id: 'amount', label: 'Refund amount', icon: 'ti ti-currency-dollar' },
  { id: 'status', label: 'Refund status', icon: 'ti ti-circle-check' },
  { id: 'student', label: 'Student name (A–Z)', icon: 'ti ti-abc' },
  { id: 'reason', label: 'Refund reason', icon: 'ti ti-category' },
];

type RefundModalId = 'create' | 'view' | 'approve' | 'reject' | 'process' | 'print';

const Refunds = () => {
  const [rows, setRows] = useState<Refund[]>(initialRows);
  const [openMenu, setOpenMenu] = useState<WorkspaceMenu>(null);
  const [activeModal, setActiveModal] = useState<RefundModalId | null>(null);
  const [modalRow, setModalRow] = useState<Refund | null>(null);
  const [panelRow, setPanelRow] = useState<Refund | null>(null);
  const [note, setNote] = useState('');
  const [mode, setMode] = useState(refundModeOptions[0]);

  const { toasts, push, dismiss } = useToasts();

  const openModal = useCallback((row: Refund | null, modal: RefundModalId) => {
    setModalRow(row);
    setActiveModal(modal);
    setNote('');
    if (modal === 'process' && row) setMode(row.refundMode);
  }, []);

  const columns = useMemo<ColumnDef<Refund>[]>(
    () => [
      {
        id: 'refundId', label: 'Refund ID', toggleable: false,
        render: (row) => <ActionLink className="fw-medium" onClick={() => openModal(row, 'view')}>{row.refundId}</ActionLink>,
      },
      {
        id: 'student', label: 'Student', sortable: true,
        render: (row) => (
          <div className="dt-user">
            <span className="dt-avatar"><ImageWithBasePath src={row.avatar} alt={row.student} /></span>
            <div>
              <ActionLink className="dt-name" onClick={() => openModal(row, 'view')}>{row.student}</ActionLink>
              <div className="dt-sub">{row.className} • {row.admissionNo}</div>
            </div>
          </div>
        ),
      },
      {
        id: 'records', label: 'Receipt / Invoice No.',
        render: (row) => (
          <>
            <span className="d-block fs-13">{row.receiptNo}</span>
            <span className="fs-12 text-muted">{row.invoiceNo}</span>
          </>
        ),
      },
      {
        id: 'reason', label: 'Refund Reason', sortable: true,
        render: (row) => <span className={`badge badge-soft-${row.reasonTint}`}>{row.reason}</span>,
      },
      { id: 'amount', label: 'Refund Amount', sortable: true, align: 'end', cellClassName: 'fw-medium', render: (row) => money(row.amount) },
      { id: 'paymentMethod', label: 'Payment Method', render: (row) => row.paymentMethod },
      { id: 'requestedDate', label: 'Requested Date', sortable: true, cellClassName: 'fs-13', render: (row) => row.requestedDate },
      { id: 'processedDate', label: 'Processed Date', cellClassName: 'fs-13', render: (row) => row.processedDate },
      {
        id: 'status', label: 'Refund Status', toggleable: false,
        render: (row) => (
          <>
            <span className={`dt-pill ${statusPill[row.status]}`}>
              <span className="dt-pill-dot" />{row.status}
            </span>
            <span className="fs-12 text-muted d-block mt-1">{approvalLine(row)}</span>
          </>
        ),
      },
      { id: 'approvedBy', label: 'Approved By', render: (row) => row.approvedBy },
    ],
    [openModal],
  );

  const workspace = useWorkspace<Refund>({
    rows, filterFields, columns,
    getId: (row) => row.id,
    search: (row, term) => `${row.student} ${row.refundId} ${row.reason}`.toLowerCase().includes(term),
    matches: (row, filters) => {
      if (filters['refund-type'] && row.reason !== filters['refund-type']) return false;
      if (filters['refund-status'] && row.status !== filters['refund-status']) return false;
      if (filters['payment-method'] && row.paymentMethod !== filters['payment-method']) return false;
      if (filters['refund-mode'] && row.refundMode !== filters['refund-mode']) return false;
      if (filters['approved-by'] && row.approvedBy !== filters['approved-by']) return false;
      if (filters['amount-range'] && amountBand(row) !== filters['amount-range']) return false;
      return true;
    },
    quickMatch: (row, quick) => !quick || row.status === quick,
    viewMatch: (row, view) => (view === 'all' ? true : row.status === view),
    compare: (a, b, sort) => {
      switch (sort) {
        case 'amount': return b.amount - a.amount || a.student.localeCompare(b.student);
        case 'status': return a.status.localeCompare(b.status) || a.student.localeCompare(b.student);
        case 'student': return a.student.localeCompare(b.student);
        case 'reason': return a.reason.localeCompare(b.reason) || a.student.localeCompare(b.student);
        case 'requested':
        default: return b.refundId.localeCompare(a.refundId);
      }
    },
    defaultSort: 'requested',
    pageSize: 8,
  });

  const summary = useMemo<SummaryItem[]>(() => {
    const pending = rows.filter((r) => r.status === 'Pending Approval');
    const approved = rows.filter((r) => r.status === 'Approved');
    const processed = rows.filter((r) => r.status === 'Processed');
    const rejected = rows.filter((r) => r.status === 'Rejected');
    const sum = (list: Refund[]) => list.reduce((t, r) => t + r.amount, 0);

    return [
      { id: 'total', tint: 'primary', icon: 'ti ti-arrow-back-up', label: 'Total Refund Requests', value: String(rows.length), hint: 'this academic year' },
      { id: 'pending', tint: 'warning', icon: 'ti ti-clock', label: 'Pending Approval', value: String(pending.length), hint: `${money(sum(pending))} requested` },
      { id: 'approved', tint: 'info', icon: 'ti ti-thumb-up', label: 'Approved', value: String(approved.length), hint: `${money(sum(approved))} awaiting payout` },
      { id: 'processed', tint: 'success', icon: 'ti ti-circle-check', label: 'Processed', value: String(processed.length), hint: `${money(sum(processed))} returned` },
      { id: 'rejected', tint: 'danger', icon: 'ti ti-circle-x', label: 'Rejected', value: String(rejected.length), hint: `${money(sum(rejected))} declined` },
    ];
  }, [rows]);

  const decide = useCallback(
    (status: RefundStatus, message: string, extra?: Partial<Refund>) => {
      if (!modalRow) return;
      setRows((current) =>
        current.map((row) =>
          row.id === modalRow.id
            ? {
                ...row,
                status,
                approvedBy: row.approvedBy === '—' ? 'Finance Manager' : row.approvedBy,
                decidedOn: row.decidedOn || '30 Jul',
                notes: note.trim() || row.notes,
                ...extra,
              }
            : row,
        ),
      );
      setActiveModal(null);
      push(message);
    },
    [modalRow, note, push],
  );

  const rowActions = (row: Refund) => (
    <div className="dt-actions">
      <ActionLink className="dt-ib" ariaLabel="View refund" onClick={() => setPanelRow(row)}>
        <i className="ti ti-eye" />
      </ActionLink>
      {row.status === 'Pending Approval' ? (
        <>
          <ActionLink className="dt-ib success" ariaLabel="Approve refund" onClick={() => openModal(row, 'approve')}>
            <i className="ti ti-check" />
          </ActionLink>
          <ActionLink className="dt-ib danger" ariaLabel="Reject refund" onClick={() => openModal(row, 'reject')}>
            <i className="ti ti-x" />
          </ActionLink>
        </>
      ) : null}
      {row.status === 'Approved' || row.status === 'Processing' ? (
        <ActionLink className="dt-ib success" ariaLabel="Process payout" onClick={() => openModal(row, 'process')}>
          <i className="ti ti-cash" />
        </ActionLink>
      ) : null}
      <ActionLink className="dt-ib" ariaLabel="Print refund receipt" onClick={() => openModal(row, 'print')}>
        <i className="ti ti-printer" />
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

  const renderDetail = (row: Refund) => (
    <div className="row g-3">
      <div className="col-lg-4 col-md-6">
        <h6 className="fs-13 mb-2"><i className="ti ti-arrow-back-up text-primary me-1" />Refund Details</h6>
        {infoList([
          { label: 'Refund ID', value: row.refundId },
          { label: 'Reason', value: row.reason },
          { label: 'Refund Mode', value: row.refundMode },
          { label: 'Amount', value: money(row.amount) },
        ])}
      </div>
      <div className="col-lg-4 col-md-6">
        <h6 className="fs-13 mb-2"><i className="ti ti-checkup-list text-info me-1" />Approval</h6>
        {infoList([
          { label: 'Status', value: row.status },
          { label: 'Approved By', value: row.approvedBy },
          { label: 'Decision', value: approvalLine(row) },
          { label: 'Processed On', value: row.processedDate },
        ])}
      </div>
      <div className="col-lg-4 col-md-6">
        <h6 className="fs-13 mb-2"><i className="ti ti-file-invoice text-success me-1" />Source Payment</h6>
        {infoList([
          { label: 'Receipt No', value: row.receiptNo },
          { label: 'Invoice No', value: row.invoiceNo },
          { label: 'Paid By', value: row.paymentMethod },
          { label: 'Requested On', value: row.requestedDate },
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
            title="Refunds"
            section="Billing & Finance"
            dashboardTo={routes.adminDashboard}
            actions={
              <button type="button" className="btn btn-primary mb-2 d-inline-flex align-items-center" onClick={() => openModal(null, 'create')}>
                <i className="ti ti-square-rounded-plus me-1" />Process Refund
              </button>
            }
          />

          <WorkspaceShell
            workspace={workspace}
            columns={columns}
            getId={(row) => row.id}
            totalCount={rows.length}
            searchPlaceholder="Search student or refund ID…"
            searchLabel="Search refunds"
            savedViews={savedViews}
            filterFields={filterFields}
            quickFilters={quickFilters}
            sortOptions={sortOptions}
            noun="refunds"
            openMenu={openMenu}
            onOpenMenu={setOpenMenu}
            onRefresh={() => { setRows(initialRows); push('Refunds refreshed'); }}
            onSaveView={() => push('Current view saved')}
            onToast={push}
            renderDetail={renderDetail}
            renderActions={rowActions}
            emptyIcon="ti ti-arrow-back-up"
            emptyTitle="No Refunds Found"
            emptyBody="No refund request matches the selected filters."
            summary={summary}
          />

          <Offcanvas open={panelRow !== null} onClose={() => setPanelRow(null)} title="Refund Details" labelledById="rf_panel_lbl">
            {panelRow ? (
              <>
                <div className="d-flex align-items-center gap-2 pb-3 mb-3 border-bottom">
                  <span className="avatar avatar-lg"><ImageWithBasePath src={panelRow.avatar} className="rounded" alt={panelRow.student} /></span>
                  <div>
                    <h6 className="mb-0">{panelRow.student}</h6>
                    <span className="fs-12 text-muted">{panelRow.refundId}</span>
                  </div>
                  <span className={`dt-pill ${statusPill[panelRow.status]} ms-auto`}>
                    <span className="dt-pill-dot" />{panelRow.status}
                  </span>
                </div>
                <div className="border rounded p-3 mb-3 d-flex justify-content-between align-items-center">
                  <span className="fw-medium">Refund Amount</span>
                  <h5 className="mb-0">{money(panelRow.amount)}</h5>
                </div>
                {infoList([
                  { label: 'Reason', value: panelRow.reason },
                  { label: 'Refund Mode', value: panelRow.refundMode },
                  { label: 'Requested', value: panelRow.requestedDate },
                  { label: 'Processed', value: panelRow.processedDate },
                  { label: 'Approved By', value: panelRow.approvedBy },
                ])}
                {panelRow.status === 'Pending Approval' ? (
                  <div className="d-flex gap-2 mt-3">
                    <button type="button" className="btn btn-primary flex-fill" onClick={() => { const r = panelRow; setPanelRow(null); openModal(r, 'approve'); }}>
                      <i className="ti ti-check me-1" />Approve
                    </button>
                    <button type="button" className="btn btn-outline-danger flex-fill" onClick={() => { const r = panelRow; setPanelRow(null); openModal(r, 'reject'); }}>
                      <i className="ti ti-x me-1" />Reject
                    </button>
                  </div>
                ) : null}
              </>
            ) : null}
          </Offcanvas>
        </div>
      </div>

      {/* Modals */}
      <Modal
        open={activeModal === 'create'}
        onClose={() => setActiveModal(null)}
        title="Process Refund"
        dialogClassName="modal-lg"
        onSubmit={(e) => { e.preventDefault(); push('Refund request created'); setActiveModal(null); }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={() => setActiveModal(null)}>Cancel</button>
            <button type="submit" className="btn btn-primary">Create Request</button>
          </>
        }
      >
        <div className="row">
          <div className="col-md-6"><div className="mb-3">
            <label className="form-label" htmlFor="rf-receipt">Receipt No.</label>
            <input type="text" className="form-control" id="rf-receipt" placeholder="RCP-2026-0000" />
          </div></div>
          <div className="col-md-6"><div className="mb-3">
            <label className="form-label" htmlFor="rf-amount">Refund Amount</label>
            <input type="text" className="form-control" id="rf-amount" placeholder="0.00" />
          </div></div>
          <div className="col-md-6"><div className="mb-3">
            <label className="form-label" htmlFor="rf-reason">Refund Reason</label>
            <select className="form-select" id="rf-reason" defaultValue={refundTypeOptions[0]}>
              {refundTypeOptions.map((o) => <option key={o}>{o}</option>)}
            </select>
          </div></div>
          <div className="col-md-6"><div className="mb-0">
            <label className="form-label" htmlFor="rf-mode">Refund Mode</label>
            <select className="form-select" id="rf-mode" defaultValue={refundModeOptions[0]}>
              {refundModeOptions.map((o) => <option key={o}>{o}</option>)}
            </select>
          </div></div>
        </div>
      </Modal>

      <Modal
        open={activeModal === 'view' && modalRow !== null}
        onClose={() => setActiveModal(null)}
        title="Refund Request"
        dialogClassName="modal-lg"
        footer={<button type="button" className="btn btn-light" onClick={() => setActiveModal(null)}>Close</button>}
      >
        {modalRow ? (
          <>
            <div className="d-flex align-items-center mb-3 pb-3 border-bottom">
              <span className="avatar avatar-lg me-3"><ImageWithBasePath src={modalRow.avatar} className="rounded" alt={modalRow.student} /></span>
              <div>
                <div className="d-flex align-items-center gap-2">
                  <h5 className="mb-0">{modalRow.student}</h5>
                  <span className="badge bg-primary-transparent text-primary">{modalRow.refundId}</span>
                  <span className={statusBadge[modalRow.status]}>{modalRow.status}</span>
                </div>
                <p className="mb-0 text-muted fs-13">{modalRow.reason} · {money(modalRow.amount)}</p>
              </div>
            </div>
            {renderDetail(modalRow)}
          </>
        ) : null}
      </Modal>

      <Modal
        open={activeModal === 'approve' && modalRow !== null}
        onClose={() => setActiveModal(null)}
        title="Approve Refund"
        onSubmit={(e) => { e.preventDefault(); decide('Approved', `${modalRow?.refundId} approved`); }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={() => setActiveModal(null)}>Cancel</button>
            <button type="submit" className="btn btn-success"><i className="ti ti-check me-1" />Approve</button>
          </>
        }
      >
        <p className="fs-13 mb-3">
          Approve <span className="fw-medium">{money(modalRow?.amount ?? 0)}</span> for{' '}
          <span className="fw-medium">{modalRow?.student}</span>?
        </p>
        <div className="mb-0">
          <label className="form-label" htmlFor="rf-approve-note">Approver Note</label>
          <textarea className="form-control" rows={3} id="rf-approve-note" value={note} onChange={(e) => setNote(e.target.value)} />
        </div>
      </Modal>

      <Modal
        open={activeModal === 'reject' && modalRow !== null}
        onClose={() => setActiveModal(null)}
        title="Reject Refund"
        onSubmit={(e) => { e.preventDefault(); decide('Rejected', `${modalRow?.refundId} rejected`); }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={() => setActiveModal(null)}>Cancel</button>
            <button type="submit" className="btn btn-danger"><i className="ti ti-x me-1" />Reject</button>
          </>
        }
      >
        <div className="mb-0">
          <label className="form-label" htmlFor="rf-reject-note">Reason for Rejection</label>
          <textarea className="form-control" rows={3} id="rf-reject-note" value={note} onChange={(e) => setNote(e.target.value)} />
        </div>
      </Modal>

      <Modal
        open={activeModal === 'process' && modalRow !== null}
        onClose={() => setActiveModal(null)}
        title="Process Refund Payout"
        onSubmit={(e) => {
          e.preventDefault();
          decide('Processed', `${modalRow?.refundId} paid out`, { processedDate: '30 Jul 2026', refundMode: mode });
        }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={() => setActiveModal(null)}>Cancel</button>
            <button type="submit" className="btn btn-primary"><i className="ti ti-cash me-1" />Process Payout</button>
          </>
        }
      >
        <p className="fs-13 mb-3">
          Pay out <span className="fw-medium">{money(modalRow?.amount ?? 0)}</span> to{' '}
          <span className="fw-medium">{modalRow?.student}</span>.
        </p>
        <div className="mb-0">
          <label className="form-label" htmlFor="rf-process-mode">Refund Mode</label>
          <select className="form-select" id="rf-process-mode" value={mode} onChange={(e) => setMode(e.target.value)}>
            {refundModeOptions.map((o) => <option key={o}>{o}</option>)}
          </select>
        </div>
      </Modal>

      <Modal
        open={activeModal === 'print' && modalRow !== null}
        onClose={() => setActiveModal(null)}
        title="Print Refund Receipt"
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={() => setActiveModal(null)}>Close</button>
            <button type="button" className="btn btn-primary" onClick={() => { window.print(); setActiveModal(null); }}>
              <i className="ti ti-printer me-1" />Print
            </button>
          </>
        }
      >
        {modalRow ? infoList([
          { label: 'Refund ID', value: modalRow.refundId },
          { label: 'Student', value: modalRow.student },
          { label: 'Amount', value: money(modalRow.amount) },
          { label: 'Mode', value: modalRow.refundMode },
          { label: 'Status', value: modalRow.status },
        ]) : null}
      </Modal>

      <ToastStack toasts={toasts} onDismiss={dismiss} id="rfToasts" />
    </>
  );
};

export default Refunds;
