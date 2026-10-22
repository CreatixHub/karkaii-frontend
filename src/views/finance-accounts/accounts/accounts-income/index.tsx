import { useCallback, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Modal from '@components/ui/Modal';
import ToastStack from '@components/ui/ToastStack';
import { PageHeader, QueueWorkspaceShell, useWorkspace } from '@components/workspace';
import type { ColumnDef, FilterField, SavedView, WorkspaceMenu } from '@components/workspace';
import ImageWithBasePath from '@core/common/imageWithBasePath';
import { all_routes } from '@/routes/all_routes';
import { useReveal } from '@hooks/useReveal';
import { useToasts } from '@hooks/useToasts';
import type { IncomeRecord, IncomeStatus } from './data/accountsIncome.data';
import {
  amountBandOf, amountRangeOptions, categoryOptions, collectedByOptions, dateRangeOptions,
  incomeRecords as initialRows, methodOptions, money, monthOf, payerNameOf, searchIndexOf,
  statusBadge, statusIcon, statusOptions, statusPill,
} from './data/accountsIncome.data';

const routes = all_routes;

const filterFields: FilterField[] = [
  { id: 'income-category', label: 'Income Category', kind: 'select', chipLabel: 'Category', options: categoryOptions },
  { id: 'payment-method', label: 'Payment Method', kind: 'select', chipLabel: 'Method', options: methodOptions },
  { id: 'collected-by', label: 'Collected By', kind: 'select', chipLabel: 'Collector', options: collectedByOptions },
  { id: 'status', label: 'Status', kind: 'select', chipLabel: 'Status', options: statusOptions },
  { id: 'date-range', label: 'Date Range', kind: 'select', chipLabel: 'Period', options: dateRangeOptions },
  { id: 'amount-range', label: 'Amount Range', kind: 'select', chipLabel: 'Amount', options: amountRangeOptions },
];

type IncomeModalId =
  | 'add' | 'edit' | 'details' | 'receipt' | 'payment' | 'attachment' | 'confirm' | 'refund' | 'delete';

const AccountsIncome = () => {
  const [rows, setRows] = useState<IncomeRecord[]>(initialRows);
  const [openMenu, setOpenMenu] = useState<WorkspaceMenu>(null);
  const [activeModal, setActiveModal] = useState<IncomeModalId | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(initialRows[0].id);

  const { loading } = useReveal();
  const { toasts, push, dismiss } = useToasts();

  const selected = rows.find((row) => row.id === selectedId) ?? null;

  const columns = useMemo<ColumnDef<IncomeRecord>[]>(
    () => [
      { id: 'category', label: 'Category', render: (row) => row.category },
      { id: 'method', label: 'Payment Method', render: (row) => row.method },
      { id: 'collector', label: 'Collected By', render: (row) => row.collectedBy },
      { id: 'status', label: 'Status', render: (row) => row.status },
    ],
    [],
  );

  const workspace = useWorkspace<IncomeRecord>({
    rows, filterFields, columns,
    getId: (row) => row.id,
    search: (row, term) => searchIndexOf(row).includes(term),
    matches: (row, filters) => {
      if (filters['income-category'] && row.category !== filters['income-category']) return false;
      if (filters['payment-method'] && row.method !== filters['payment-method']) return false;
      if (filters['collected-by'] && row.collectedBy !== filters['collected-by']) return false;
      if (filters.status && row.status !== filters.status) return false;
      if (filters['date-range'] && monthOf(row) !== filters['date-range']) return false;
      if (filters['amount-range'] && amountBandOf(row) !== filters['amount-range']) return false;
      return true;
    },
    viewMatch: (row, view) => (view === 'all' ? true : row.status === view),
    compare: (a, b) => b.receiptNo.localeCompare(a.receiptNo),
    defaultSort: 'recent',
    pageSize: 100,
  });

  const countBy = useCallback(
    (status: IncomeStatus) => rows.filter((row) => row.status === status).length,
    [rows],
  );

  const savedViews = useMemo<SavedView[]>(
    () => [
      { id: 'all', label: 'All Income', icon: 'ti ti-layout-list', count: rows.length },
      { id: 'Received', label: 'Received', icon: 'ti ti-download', count: countBy('Received') },
      { id: 'Confirmed', label: 'Confirmed', icon: 'ti ti-circle-check', count: countBy('Confirmed') },
      { id: 'Receipted', label: 'Receipted', icon: 'ti ti-receipt', count: countBy('Receipted') },
      { id: 'Pending', label: 'Pending', icon: 'ti ti-clock', count: countBy('Pending') },
      { id: 'Refunded', label: 'Refunded', icon: 'ti ti-arrow-back-up', count: countBy('Refunded') },
    ],
    [countBy, rows.length],
  );

  /** Total received, excluding refunds — the refunded row is money returned. */
  const totalReceived = useMemo(
    () => rows.filter((row) => row.status !== 'Refunded').reduce((sum, row) => sum + row.amount, 0),
    [rows],
  );

  /* --------------------------------- Actions -------------------------------- */

  const setStatus = useCallback(
    (status: IncomeStatus, message: string) => {
      if (!selected) return;
      setRows((current) => current.map((row) => (row.id === selected.id ? { ...row, status } : row)));
      setActiveModal(null);
      push(message);
    },
    [push, selected],
  );

  /* ---------------------------------- Cards --------------------------------- */

  const renderCard = (row: IncomeRecord, isSelected: boolean) => (
    <button
      type="button"
      className={`exp-card${isSelected ? ' active' : ''}`}
      onClick={() => setSelectedId(row.id)}
    >
      <div className="d-flex align-items-start justify-content-between gap-2 mb-2">
        <span className="exp-card-title">{row.title}</span>
        <span className="exp-card-amount">{money(row.amount)}</span>
      </div>
      <div className="d-flex align-items-center gap-2 mb-2">
        <span className="avatar avatar-sm">
          <ImageWithBasePath src={row.avatar} className="rounded-circle flex-shrink-0" alt={payerNameOf(row)} />
        </span>
        <div className="overflow-hidden">
          <span className="d-block fs-13 fw-medium text-truncate">{payerNameOf(row)}</span>
          <span className="exp-card-meta">{row.collectedBy} · {row.receiptNo}</span>
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
        <span className="exp-card-meta"><i className="ti ti-calendar me-1" />{row.date}</span>
        <span className="exp-card-meta"><i className="ti ti-credit-card me-1" />{row.method}</span>
      </div>
    </button>
  );

  /* --------------------------------- Detail --------------------------------- */

  const infoItem = (icon: string, label: string, value: React.ReactNode) => (
    <div className="col-sm-6 col-lg-4">
      <div className="exp-info-item">
        <span className="exp-info-label"><i className={`${icon} me-1`} />{label}</span>
        <span className="exp-info-val">{value}</span>
      </div>
    </div>
  );

  const renderDetail = (row: IncomeRecord) => (
    <>
      <div className="card">
        <div className="card-body">
          <div className="exp-hero pb-3 mb-3 border-bottom">
            <div className="d-flex align-items-center gap-3">
              <span className={`avatar avatar-lg bg-${row.categoryTint}-transparent text-${row.categoryTint} rounded flex-shrink-0`}>
                <i className={`${row.icon} fs-20`} />
              </span>
              <div>
                <h4 className="mb-1">{row.title}</h4>
                <span className="fs-13 text-muted">{row.payer} · {row.receiptNo}</span>
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
            <h5 className="mb-0 fs-15"><i className="ti ti-info-circle me-2 text-primary" />Income Information</h5>
            <div className="d-flex align-items-center gap-2">
              <button type="button" className="btn btn-icon btn-sm btn-outline-light bg-white" aria-label="Edit income" onClick={() => setActiveModal('edit')}>
                <i className="ti ti-edit" />
              </button>
              <button type="button" className="btn btn-icon btn-sm btn-outline-light bg-white text-danger" aria-label="Delete income" onClick={() => setActiveModal('delete')}>
                <i className="ti ti-trash" />
              </button>
            </div>
          </div>

          <div className="row g-3">
            {infoItem('ti ti-user', 'Received From', row.payer)}
            {infoItem('ti ti-tag', 'Category', row.category)}
            {infoItem('ti ti-calendar', 'Date', row.date)}
            {infoItem('ti ti-credit-card', 'Payment Method', row.method)}
            {infoItem('ti ti-hash', 'Reference No', row.reference)}
            {infoItem('ti ti-building', 'Collected By', row.collectedBy)}
            {infoItem('ti ti-receipt', 'Receipt No', row.receiptNo)}
            {infoItem(
              'ti ti-file-invoice',
              'Linked Invoice',
              row.invoiceNo ? (
                <Link to={routes.accountsInvoices} className="badge badge-soft-primary">
                  <i className="ti ti-file-invoice me-1" />{row.invoiceNo}
                </Link>
              ) : (
                <span className="badge badge-soft-secondary">
                  <i className="ti ti-file-off me-1" />No invoice
                </span>
              ),
            )}
            {infoItem('ti ti-paperclip', 'Attachments', `${row.receipts} file${row.receipts === 1 ? '' : 's'}`)}
            <div className="col-12">
              <div className="exp-info-item">
                <span className="exp-info-label"><i className="ti ti-align-left me-1" />Description</span>
                <span className="exp-info-val">{row.description}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-3">
        <div className="col-12 col-lg-6">
          <div className="card h-100 mb-0">
            <div className="card-header">
              <h6 className="mb-0"><i className="ti ti-checkup-list me-2 text-primary" />Receipt Actions</h6>
            </div>
            <div className="card-body">
              <div className="d-flex flex-wrap gap-2">
                {row.status === 'Pending' ? (
                  <button type="button" className="btn btn-success btn-sm" onClick={() => setActiveModal('confirm')}>
                    <i className="ti ti-check me-1" />Confirm Receipt
                  </button>
                ) : null}
                {row.status !== 'Receipted' && row.status !== 'Refunded' ? (
                  <button type="button" className="btn btn-primary btn-sm" onClick={() => setActiveModal('receipt')}>
                    <i className="ti ti-receipt me-1" />Issue Receipt
                  </button>
                ) : null}
                <button type="button" className="btn btn-outline-light bg-white btn-sm" onClick={() => setActiveModal('payment')}>
                  <i className="ti ti-credit-card me-1" />Payment Info
                </button>
                <button type="button" className="btn btn-outline-light bg-white btn-sm" onClick={() => setActiveModal('attachment')}>
                  <i className="ti ti-paperclip me-1" />Attachments
                </button>
                {row.status !== 'Refunded' ? (
                  <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => setActiveModal('refund')}>
                    <i className="ti ti-arrow-back-up me-1" />Refund
                  </button>
                ) : null}
                <button type="button" className="btn btn-outline-light bg-white btn-sm" onClick={() => window.print()}>
                  <i className="ti ti-printer me-1" />Print
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-6">
          <div className="card h-100 mb-0">
            <div className="card-header">
              <h6 className="mb-0"><i className="ti ti-wallet me-2 text-primary" />Payment Summary</h6>
            </div>
            <div className="card-body">
              <ul className="list-unstyled fs-13 mb-0">
                <li className="d-flex justify-content-between py-1 border-bottom">
                  <span className="text-muted">Amount</span><span className="fw-medium">{money(row.amount)}</span>
                </li>
                <li className="d-flex justify-content-between py-1 border-bottom">
                  <span className="text-muted">Method</span><span className="fw-medium">{row.method}</span>
                </li>
                <li className="d-flex justify-content-between py-1 border-bottom">
                  <span className="text-muted">Reference</span><span className="fw-medium">{row.reference}</span>
                </li>
                <li className="d-flex justify-content-between py-1">
                  <span className="text-muted">Status</span>
                  <span className={statusBadge[row.status]}>{row.status}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  const incomeForm = (row: IncomeRecord | null) => (
    <div className="row">
      <div className="col-md-6"><div className="mb-3">
        <label className="form-label" htmlFor="in-title">Income Title</label>
        <input type="text" className="form-control" id="in-title" defaultValue={row?.title ?? ''} placeholder="Income title" />
      </div></div>
      <div className="col-md-6"><div className="mb-3">
        <label className="form-label" htmlFor="in-amount">Amount</label>
        <input type="text" className="form-control" id="in-amount" defaultValue={row ? String(row.amount) : ''} placeholder="0.00" />
      </div></div>
      <div className="col-md-6"><div className="mb-3">
        <label className="form-label" htmlFor="in-category">Income Category</label>
        <select className="form-select" id="in-category" defaultValue={row?.category ?? categoryOptions[0]}>
          {categoryOptions.map((option) => <option key={option}>{option}</option>)}
        </select>
      </div></div>
      <div className="col-md-6"><div className="mb-3">
        <label className="form-label" htmlFor="in-payer">Received From</label>
        <input type="text" className="form-control" id="in-payer" defaultValue={row?.payer ?? ''} placeholder="Payer name" />
      </div></div>
      <div className="col-md-6"><div className="mb-3">
        <label className="form-label" htmlFor="in-method">Payment Method</label>
        <select className="form-select" id="in-method" defaultValue={row?.method ?? methodOptions[0]}>
          {methodOptions.map((option) => <option key={option}>{option}</option>)}
        </select>
      </div></div>
      <div className="col-md-6"><div className="mb-3">
        <label className="form-label" htmlFor="in-collector">Collected By</label>
        <select className="form-select" id="in-collector" defaultValue={row?.collectedBy ?? collectedByOptions[0]}>
          {collectedByOptions.map((option) => <option key={option}>{option}</option>)}
        </select>
      </div></div>
      <div className="col-md-6"><div className="mb-3">
        <label className="form-label" htmlFor="in-date">Date</label>
        <input type="text" className="form-control" id="in-date" defaultValue={row?.date ?? ''} placeholder="22-07-2026" />
      </div></div>
      <div className="col-md-6"><div className="mb-3">
        <label className="form-label" htmlFor="in-ref">Reference No</label>
        <input type="text" className="form-control" id="in-ref" defaultValue={row?.reference ?? ''} placeholder="TXN-00000" />
      </div></div>
      <div className="col-12"><div className="mb-0">
        <label className="form-label" htmlFor="in-desc">Description</label>
        <textarea className="form-control" rows={3} id="in-desc" defaultValue={row?.description ?? ''} />
      </div></div>
    </div>
  );

  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <PageHeader
            title="Income"
            section="Accounts"
            dashboardTo={routes.adminDashboard}
            actions={
              <button
                type="button"
                className="btn btn-primary d-flex align-items-center mb-2"
                onClick={() => setActiveModal('add')}
              >
                <i className="ti ti-square-rounded-plus me-2" />Add Income
              </button>
            }
          />

          <QueueWorkspaceShell
            workspace={workspace}
            columns={columns}
            getId={(row) => row.id}
            totalCount={rows.length}
            loading={loading}
            workspaceId="incomeWorkspace"
            searchPlaceholder="Search income, receipt no, payer or category…"
            searchLabel="Search income"
            savedViews={savedViews}
            filterFields={filterFields}
            noun="income records"
            openMenu={openMenu}
            onOpenMenu={setOpenMenu}
            onRefresh={() => { setRows(initialRows); push('Income refreshed'); }}
            onSaveView={() => push('Current view saved')}
            onToast={push}
            queueTitle="Income Records"
            queueIcon="ti ti-cash"
            queueLabel="Income records"
            queueClassName="exp-queue"
            renderCard={renderCard}
            selectedId={selectedId}
            renderDetail={renderDetail}
            emptyIcon="ti ti-cash"
            emptyTitle="No Income Selected"
            emptyBody="Select an income record from the list to review its payment details, receipt and linked invoice."
            emptyAction={
              <button type="button" className="btn btn-primary" onClick={() => setActiveModal('add')}>
                <i className="ti ti-square-rounded-plus me-1" />Add Income
              </button>
            }
          />
        </div>
      </div>

      {/* Modals */}
      <Modal
        open={activeModal === 'add'}
        onClose={() => setActiveModal(null)}
        title="Add Income"
        dialogClassName="modal-lg"
        onSubmit={(e) => { e.preventDefault(); setActiveModal(null); push('Income added'); }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={() => setActiveModal(null)}>Cancel</button>
            <button type="submit" className="btn btn-primary">Add Income</button>
          </>
        }
      >
        {incomeForm(null)}
      </Modal>

      <Modal
        open={activeModal === 'edit' && selected !== null}
        onClose={() => setActiveModal(null)}
        title="Edit Income"
        dialogClassName="modal-lg"
        onSubmit={(e) => { e.preventDefault(); setActiveModal(null); push(`${selected?.title} updated`); }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={() => setActiveModal(null)}>Cancel</button>
            <button type="submit" className="btn btn-primary">Save Changes</button>
          </>
        }
      >
        {incomeForm(selected)}
      </Modal>

      <Modal
        open={activeModal === 'confirm' && selected !== null}
        onClose={() => setActiveModal(null)}
        title="Confirm Receipt"
        onSubmit={(e) => { e.preventDefault(); setStatus('Confirmed', `${selected?.receiptNo} confirmed`); }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={() => setActiveModal(null)}>Cancel</button>
            <button type="submit" className="btn btn-success"><i className="ti ti-check me-1" />Confirm</button>
          </>
        }
      >
        <p className="fs-13 mb-0">
          Confirm <span className="fw-medium">{money(selected?.amount ?? 0)}</span> received from{' '}
          <span className="fw-medium">{selected ? payerNameOf(selected) : ''}</span>?
        </p>
      </Modal>

      <Modal
        open={activeModal === 'receipt' && selected !== null}
        onClose={() => setActiveModal(null)}
        title="Issue Receipt"
        onSubmit={(e) => { e.preventDefault(); setStatus('Receipted', `${selected?.receiptNo} issued`); }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={() => setActiveModal(null)}>Cancel</button>
            <button type="submit" className="btn btn-primary"><i className="ti ti-receipt me-1" />Issue Receipt</button>
          </>
        }
      >
        {selected ? (
          <div className="text-center py-4 border rounded">
            <span className={`avatar avatar-xl bg-${selected.categoryTint}-transparent text-${selected.categoryTint} rounded-circle mb-3 d-inline-flex align-items-center justify-content-center`}>
              <i className={`${selected.icon} fs-24`} />
            </span>
            <h5 className="mb-1">{money(selected.amount)}</h5>
            <p className="fs-13 text-muted mb-0">
              {selected.receiptNo} · {selected.category} · {selected.date}
            </p>
          </div>
        ) : null}
      </Modal>

      <Modal
        open={activeModal === 'payment' && selected !== null}
        onClose={() => setActiveModal(null)}
        title="Payment Information"
        footer={<button type="button" className="btn btn-light" onClick={() => setActiveModal(null)}>Close</button>}
      >
        <ul className="list-unstyled mb-0">
          <li className="d-flex justify-content-between py-1 border-bottom fs-13">
            <span className="text-muted">Amount</span><span>{money(selected?.amount ?? 0)}</span>
          </li>
          <li className="d-flex justify-content-between py-1 border-bottom fs-13">
            <span className="text-muted">Method</span><span>{selected?.method}</span>
          </li>
          <li className="d-flex justify-content-between py-1 border-bottom fs-13">
            <span className="text-muted">Reference</span><span>{selected?.reference}</span>
          </li>
          <li className="d-flex justify-content-between py-1 border-bottom fs-13">
            <span className="text-muted">Collected By</span><span>{selected?.collectedBy}</span>
          </li>
          <li className="d-flex justify-content-between py-1 fs-13">
            <span className="text-muted">Date</span><span>{selected?.date}</span>
          </li>
        </ul>
      </Modal>

      <Modal
        open={activeModal === 'attachment' && selected !== null}
        onClose={() => setActiveModal(null)}
        title="Attachments"
        footer={<button type="button" className="btn btn-light" onClick={() => setActiveModal(null)}>Close</button>}
      >
        {selected && selected.receipts > 0 ? (
          Array.from({ length: selected.receipts }, (_, index) => (
            <div className="d-flex align-items-center gap-2 border rounded p-2 mb-2" key={index}>
              <span className="avatar avatar-sm bg-primary-transparent text-primary rounded flex-shrink-0">
                <i className="ti ti-file-text" />
              </span>
              <div className="flex-fill overflow-hidden">
                <h6 className="fs-13 mb-0 text-truncate">{selected.receiptNo}-{index + 1}.pdf</h6>
                <span className="fs-12 text-muted">{selected.date}</span>
              </div>
              <button
                type="button"
                className="btn btn-icon btn-sm btn-outline-light bg-white"
                aria-label="Download attachment"
                onClick={() => push('Attachment downloaded')}
              >
                <i className="ti ti-download" />
              </button>
            </div>
          ))
        ) : (
          <p className="fs-13 text-muted mb-0">No attachments on this income record.</p>
        )}
      </Modal>

      <Modal
        open={activeModal === 'details' && selected !== null}
        onClose={() => setActiveModal(null)}
        title="Income Details"
        dialogClassName="modal-lg"
        footer={<button type="button" className="btn btn-light" onClick={() => setActiveModal(null)}>Close</button>}
      >
        {selected ? renderDetail(selected) : null}
      </Modal>

      <Modal
        open={activeModal === 'refund' && selected !== null}
        onClose={() => setActiveModal(null)}
        title="Refund Income"
        onSubmit={(e) => { e.preventDefault(); setStatus('Refunded', `${selected?.receiptNo} refunded`); }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={() => setActiveModal(null)}>Cancel</button>
            <button type="submit" className="btn btn-danger"><i className="ti ti-arrow-back-up me-1" />Refund</button>
          </>
        }
      >
        <p className="fs-13 mb-0">
          Refund <span className="fw-medium">{money(selected?.amount ?? 0)}</span> to{' '}
          <span className="fw-medium">{selected ? payerNameOf(selected) : ''}</span>? Total received drops to{' '}
          {money(totalReceived - (selected?.amount ?? 0))}.
        </p>
      </Modal>

      <Modal
        open={activeModal === 'delete' && selected !== null}
        onClose={() => setActiveModal(null)}
        title="Delete Income"
        onSubmit={(e) => {
          e.preventDefault();
          const id = selected?.id;
          setRows((current) => current.filter((row) => row.id !== id));
          setSelectedId(null);
          setActiveModal(null);
          push('Income record deleted');
        }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={() => setActiveModal(null)}>Cancel</button>
            <button type="submit" className="btn btn-danger">Yes, Delete</button>
          </>
        }
      >
        <p className="fs-13 mb-0">Delete {selected?.receiptNo}? This cannot be undone.</p>
      </Modal>

      <ToastStack toasts={toasts} onDismiss={dismiss} id="inToasts" />
    </>
  );
};

export default AccountsIncome;
