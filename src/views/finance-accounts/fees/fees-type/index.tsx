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
import type { FeeType } from './data/feesType.data';
import {
  academicYearOptions, applicableClassesOf, descriptionOf, discountConfiguration, feeCategoryOptions,
  feeTypeOptions, feeTypes as initialRows, frequencyOptions, lateFeeTextOf, money,
  paymentFrequencyTextOf, remarksOf, searchIndexOf, statusBadge, statusOptions, statusPill,
  taxOptions, taxTextOf,
} from './data/feesType.data';

const routes = all_routes;

const filterFields: FilterField[] = [
  { id: 'academic-year', label: 'Academic Year', kind: 'select', chipLabel: 'Year', options: academicYearOptions },
  { id: 'fee-type', label: 'Fee Type', kind: 'select', chipLabel: 'Type', options: feeTypeOptions },
  { id: 'fee-category', label: 'Fee Category', kind: 'select', chipLabel: 'Category', options: feeCategoryOptions },
  { id: 'collection-frequency', label: 'Collection Frequency', kind: 'select', chipLabel: 'Frequency', options: frequencyOptions },
  { id: 'tax-applicable', label: 'Tax Applicable', kind: 'select', chipLabel: 'Tax', options: taxOptions },
  { id: 'status', label: 'Status', kind: 'select', chipLabel: 'Status', options: statusOptions },
];

const sortOptions: SortOption[] = [
  { id: 'name', label: 'Fee Type (A–Z)', icon: 'ti ti-abc' },
  { id: 'category', label: 'Category', icon: 'ti ti-category' },
  { id: 'amount', label: 'Default Amount', icon: 'ti ti-cash' },
  { id: 'updated', label: 'Last Updated', icon: 'ti ti-history' },
  { id: 'status', label: 'Status', icon: 'ti ti-circle-check' },
];

type FeeTypeModalId = 'add' | 'edit' | 'view' | 'delete' | 'import' | 'assign' | 'print';

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const dateKey = (value: string): number => {
  const [day, month, year] = value.split(' ');
  const index = months.indexOf(month);
  if (index === -1) return 0;
  return Number(year) * 10000 + (index + 1) * 100 + Number(day);
};

const FeesType = () => {
  const [rows, setRows] = useState<FeeType[]>(initialRows);
  const [openMenu, setOpenMenu] = useState<WorkspaceMenu>(null);
  const [activeModal, setActiveModal] = useState<FeeTypeModalId | null>(null);
  const [modalRow, setModalRow] = useState<FeeType | null>(null);
  const [bulkIds, setBulkIds] = useState<string[]>([]);

  const { loading } = useReveal();
  const { toasts, push, dismiss } = useToasts();

  const openModal = useCallback((row: FeeType | null, modal: FeeTypeModalId) => {
    setModalRow(row);
    setBulkIds([]);
    setActiveModal(modal);
  }, []);

  /* --------------------------------- Columns -------------------------------- */

  const columns = useMemo<ColumnDef<FeeType>[]>(
    () => [
      {
        id: 'type', label: 'Fee Type', toggleable: false, sortable: true,
        render: (row) => (
          <div className="dt-user">
            <ActionLink
              className={`dt-avatar d-inline-flex align-items-center justify-content-center bg-${row.tint}-transparent text-${row.tint}`}
              ariaLabel={`View ${row.name}`}
              onClick={() => openModal(row, 'view')}
            >
              <i className={`${row.icon} fs-20`} />
            </ActionLink>
            <div>
              <ActionLink className="dt-name" onClick={() => openModal(row, 'view')}>{row.name}</ActionLink>
              <div className="dt-sub">
                <span className="link-primary dt-code">{row.code}</span>
                <span className="dt-dot">·</span>
                <span className="dt-category">{row.category}</span>
              </div>
              <div className="d-flex flex-wrap gap-1 mt-1">
                <span className={`badge badge-soft-${row.tint}`}>
                  <i className="ti ti-tag me-1" />{row.category}
                </span>
              </div>
            </div>
          </div>
        ),
      },
      {
        id: 'config', label: 'Configuration',
        render: (row) => (
          <ul className="list-unstyled mb-0 fs-12">
            <li className="py-1">
              <span className="badge badge-soft-primary">
                <i className="ti ti-repeat me-1" /><span className="dt-freq">{row.frequency}</span>
              </span>{' '}
              <span className="badge badge-soft-success">
                <i className="ti ti-cash me-1" /><span className="dt-amount-val">{money(row.amount)}</span>
              </span>
            </li>
            <li className="d-flex flex-wrap gap-1 py-1">
              <span className={`badge badge-soft-${row.taxable ? 'success' : 'secondary'}`}>
                <i className={`ti ti-${row.taxable ? 'check' : 'minus'} me-1`} />{row.taxable ? 'Tax' : 'No Tax'}
              </span>{' '}
              <span className={`badge badge-soft-${row.refundable ? 'success' : 'secondary'}`}>
                <i className={`ti ti-${row.refundable ? 'check' : 'minus'} me-1`} />
                {row.refundable ? 'Refundable' : 'No Refundable'}
              </span>
            </li>
            <li className="py-1">
              <span className={`badge badge-soft-${row.lateFee ? 'success' : 'secondary'}`}>
                <i className={`ti ti-${row.lateFee ? 'check' : 'minus'} me-1`} />
                {row.lateFee ? 'Late Fee' : 'No Late Fee'}
              </span>
            </li>
          </ul>
        ),
      },
      {
        id: 'details', label: 'Academic Details',
        render: (row) => (
          <ul className="list-unstyled mb-0 fs-12">
            <li className="py-1 text-muted">
              <i className="ti ti-school me-1" />Classes <span className="fw-medium text-dark">{row.classes}</span>
            </li>
            <li className="py-1 text-muted">
              <i className="ti ti-calendar me-1" />Year <span className="fw-medium text-dark">{row.academicYear}</span>
            </li>
            <li className="d-flex align-items-center gap-1 py-1">
              <span className="avatar avatar-xs">
                <ImageWithBasePath src={row.avatar} className="rounded-circle flex-shrink-0" alt={row.createdBy} />
              </span>
              <span>
                <span className="text-muted">By</span>{' '}
                <span className="fw-medium text-dark dt-createdby">{row.createdBy}</span>
              </span>
            </li>
            <li className="py-1 text-muted">
              <i className="ti ti-history me-1" />Updated{' '}
              <span className="fw-medium text-dark">{row.updated}</span>
            </li>
          </ul>
        ),
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

  const workspace = useWorkspace<FeeType>({
    rows, filterFields, columns,
    getId: (row) => row.id,
    search: (row, term) => searchIndexOf(row).includes(term),
    matches: (row, filters) => {
      if (filters['academic-year'] && row.academicYear !== filters['academic-year']) return false;
      if (filters['fee-type'] && row.name !== filters['fee-type']) return false;
      if (filters['fee-category'] && row.category !== filters['fee-category']) return false;
      if (filters['collection-frequency'] && row.frequency !== filters['collection-frequency']) return false;
      if (filters['tax-applicable']) {
        const wantsTaxable = filters['tax-applicable'] === 'Taxable';
        if (row.taxable !== wantsTaxable) return false;
      }
      if (filters.status && row.status !== filters.status) return false;
      return true;
    },
    quickMatch: (row, quick) => !quick || row.status === quick,
    viewMatch: (row, view) => (view === 'all' ? true : row.status === view),
    compare: (a, b, sort) => {
      switch (sort) {
        case 'category': return a.category.localeCompare(b.category) || a.name.localeCompare(b.name);
        case 'amount': return b.amount - a.amount || a.name.localeCompare(b.name);
        case 'updated': return dateKey(b.updated) - dateKey(a.updated) || a.name.localeCompare(b.name);
        case 'status': return a.status.localeCompare(b.status) || a.name.localeCompare(b.name);
        case 'name':
        default: return a.name.localeCompare(b.name);
      }
    },
    defaultSort: 'name',
  });

  /** Counts follow the roster, so archiving a row moves them. */
  const countBy = useCallback(
    (status: FeeType['status']) => rows.filter((row) => row.status === status).length,
    [rows],
  );

  const savedViews = useMemo<SavedView[]>(
    () => [
      { id: 'all', label: 'All Fee Types', icon: 'ti ti-layout-list', count: rows.length },
      { id: 'Active', label: 'Active', icon: 'ti ti-circle-check', count: countBy('Active') },
      { id: 'Scheduled', label: 'Scheduled', icon: 'ti ti-calendar-check', count: countBy('Scheduled') },
      { id: 'Draft', label: 'Draft', icon: 'ti ti-pencil', count: countBy('Draft') },
      { id: 'Archived', label: 'Archived', icon: 'ti ti-archive', count: countBy('Archived') },
    ],
    [countBy, rows.length],
  );

  const quickFilters = useMemo<QuickFilter[]>(
    () => [
      { id: 'Active', label: 'Active', icon: 'ti ti-circle-check', count: countBy('Active') },
      { id: 'Scheduled', label: 'Scheduled', icon: 'ti ti-calendar-check', count: countBy('Scheduled') },
      { id: 'Draft', label: 'Draft', icon: 'ti ti-pencil', count: countBy('Draft') },
      { id: 'Archived', label: 'Archived', icon: 'ti ti-archive', count: countBy('Archived') },
    ],
    [countBy],
  );

  /* --------------------------------- Actions -------------------------------- */

  const archive = useCallback(
    (ids: string[]) => {
      setRows((current) =>
        current.map((row) => (ids.includes(row.id) ? { ...row, status: 'Archived' as const } : row)),
      );
      workspace.clearSelection();
      push(`${ids.length} fee ${ids.length === 1 ? 'type' : 'types'} archived`);
    },
    [push, workspace],
  );

  const remove = useCallback(() => {
    const ids = bulkIds.length > 0 ? bulkIds : modalRow ? [modalRow.id] : [];
    setRows((current) => current.filter((row) => !ids.includes(row.id)));
    workspace.clearSelection();
    setActiveModal(null);
    push(`${ids.length} fee ${ids.length === 1 ? 'type' : 'types'} deleted`);
  }, [bulkIds, modalRow, push, workspace]);

  const bulkActions = useMemo<BulkAction[]>(
    () => [
      { id: 'assign', label: 'Assign Classes', icon: 'ti ti-school', onClick: () => openModal(null, 'assign') },
      {
        id: 'export', label: 'Export Selected', icon: 'ti ti-file-export',
        onClick: (ids) => push(`${ids.length} fee types exported`),
      },
      { id: 'print', label: 'Print', icon: 'ti ti-printer', onClick: () => window.print() },
      { id: 'archive', label: 'Archive', icon: 'ti ti-archive', onClick: archive },
      {
        id: 'delete', label: 'Delete', icon: 'ti ti-trash', danger: true,
        onClick: (ids) => { setBulkIds(ids); setModalRow(null); setActiveModal('delete'); },
      },
    ],
    [archive, openModal, push],
  );

  const rowActions = (row: FeeType) => (
    <div className="dt-actions">
      <ActionLink className="dt-ib" title="View Fee Type" ariaLabel="View Fee Type" onClick={() => openModal(row, 'view')}>
        <i className="ti ti-eye" />
      </ActionLink>
      <ActionLink className="dt-ib" title="Edit" ariaLabel="Edit" onClick={() => openModal(row, 'edit')}>
        <i className="ti ti-edit" />
      </ActionLink>
      <ActionLink className="dt-ib" title="Assign Classes" ariaLabel="Assign Classes" onClick={() => openModal(row, 'assign')}>
        <i className="ti ti-school" />
      </ActionLink>
      <ActionLink className="dt-ib" title="Print" ariaLabel="Print" onClick={() => window.print()}>
        <i className="ti ti-printer" />
      </ActionLink>
      <ActionLink className="dt-ib" title="Delete" ariaLabel="Delete" onClick={() => openModal(row, 'delete')}>
        <i className="ti ti-trash" />
      </ActionLink>
    </div>
  );

  /* --------------------------------- Panels --------------------------------- */

  const ruleList = (row: FeeType) => (
    <ul className="list-unstyled fs-12 mb-3">
      <li className="d-flex align-items-center justify-content-between py-1">
        <span className="text-muted">Default Amount</span>
        <span className="fw-medium">{money(row.amount)}</span>
      </li>
      <li className="d-flex align-items-center justify-content-between py-1">
        <span className="text-muted">Frequency</span>
        <span className="fw-medium">{row.frequency}</span>
      </li>
      <li className="d-flex align-items-center justify-content-between py-1">
        <span className="text-muted">Refundable</span>
        <span className="fw-medium">{row.refundable ? 'Yes' : 'No'}</span>
      </li>
    </ul>
  );

  const renderDetail = (row: FeeType) => (
    <div className="dt-detail-inner">
      <div className="row g-4">
        <div className="col-xl-3 col-md-6">
          <h4 className="details-heading fs-15 fw-medium"><i className="ti ti-file-description" />Description</h4>
          <p className="fs-12 text-muted mb-3">{descriptionOf(row)}</p>
          <h5 className="details-heading fs-15"><i className="ti ti-school" />Applicable Classes</h5>
          <p className="fs-12 text-muted mb-0">{applicableClassesOf(row)}</p>
        </div>
        <div className="col-xl-3 col-md-6">
          <h6 className="details-heading"><i className="ti ti-list-details" />Fee Rules</h6>
          {ruleList(row)}
          <h6 className="details-heading"><i className="ti ti-discount" />Discount Configuration</h6>
          <p className="fs-12 text-muted mb-0">{discountConfiguration}</p>
        </div>
        <div className="col-xl-3 col-md-6">
          <h6 className="details-heading"><i className="ti ti-alarm" />Late Fee Configuration</h6>
          <p className="fs-12 text-muted mb-3">{lateFeeTextOf(row)}</p>
          <h6 className="details-heading"><i className="ti ti-receipt-tax" />Tax Details</h6>
          <p className="fs-12 text-muted mb-0">{taxTextOf(row)}</p>
        </div>
        <div className="col-xl-3 col-md-6">
          <h6 className="details-heading"><i className="ti ti-repeat" />Payment Frequency</h6>
          <p className="fs-12 text-muted mb-2">{paymentFrequencyTextOf(row)}</p>
          <h6 className="details-heading"><i className="ti ti-notes" />Remarks</h6>
          <p className="fs-12 text-muted mb-2">{remarksOf(row)}</p>
          <div className="d-flex gap-2">
            <button type="button" className="btn btn-outline-light bg-white btn-sm flex-fill" onClick={() => openModal(row, 'view')}>
              <i className="ti ti-eye me-1" />View
            </button>
            <button type="button" className="btn btn-outline-light bg-white btn-sm flex-fill" onClick={() => openModal(row, 'edit')}>
              <i className="ti ti-edit me-1" />Edit
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  /* ---------------------------------- Form ---------------------------------- */

  const feeTypeForm = (row: FeeType | null) => (
    <div className="row">
      <div className="col-md-6"><div className="mb-3">
        <label className="form-label" htmlFor="ft-name">Fee Type Name</label>
        <input type="text" className="form-control" id="ft-name" defaultValue={row?.name ?? ''} placeholder="Tuition Fee" />
      </div></div>
      <div className="col-md-6"><div className="mb-3">
        <label className="form-label" htmlFor="ft-code">Fee Code</label>
        <input type="text" className="form-control" id="ft-code" defaultValue={row?.code ?? ''} placeholder="FT2411" />
      </div></div>
      <div className="col-md-6"><div className="mb-3">
        <label className="form-label" htmlFor="ft-category">Fee Category</label>
        <select className="form-select" id="ft-category" defaultValue={row?.category ?? feeCategoryOptions[0]}>
          {feeCategoryOptions.map((option) => <option key={option}>{option}</option>)}
        </select>
      </div></div>
      <div className="col-md-6"><div className="mb-3">
        <label className="form-label" htmlFor="ft-frequency">Collection Frequency</label>
        <select className="form-select" id="ft-frequency" defaultValue={row?.frequency ?? frequencyOptions[0]}>
          {frequencyOptions.map((option) => <option key={option}>{option}</option>)}
        </select>
      </div></div>
      <div className="col-md-6"><div className="mb-3">
        <label className="form-label" htmlFor="ft-amount">Default Amount</label>
        <input type="text" className="form-control" id="ft-amount" defaultValue={row ? String(row.amount) : ''} placeholder="0.00" />
      </div></div>
      <div className="col-md-6"><div className="mb-3">
        <label className="form-label" htmlFor="ft-classes">Applicable Classes</label>
        <input type="text" className="form-control" id="ft-classes" defaultValue={row?.classes ?? ''} placeholder="I – XII" />
      </div></div>
      <div className="col-md-6"><div className="mb-3">
        <label className="form-label" htmlFor="ft-year">Academic Year</label>
        <select className="form-select" id="ft-year" defaultValue={row?.academicYear ?? academicYearOptions[0]}>
          {academicYearOptions.map((option) => <option key={option}>{option}</option>)}
        </select>
      </div></div>
      <div className="col-md-6"><div className="mb-0">
        <label className="form-label" htmlFor="ft-status">Status</label>
        <select className="form-select" id="ft-status" defaultValue={row?.status ?? statusOptions[0]}>
          {statusOptions.map((option) => <option key={option}>{option}</option>)}
        </select>
      </div></div>
    </div>
  );

  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <PageHeader
            title="Fees Type"
            section="Management"
            dashboardTo={routes.adminDashboard}
            actions={
              <>
                <button
                  type="button"
                  className="btn btn-outline-light bg-white fw-medium d-inline-flex align-items-center me-2 mb-2"
                  onClick={() => openModal(null, 'import')}
                >
                  <i className="ti ti-file-import me-2" />Import
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
                  <i className="ti ti-square-rounded-plus me-2" />Add Fees Type
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
            searchPlaceholder="Search fee types, code, category or author…"
            searchLabel="Search fee types"
            savedViews={savedViews}
            filterFields={filterFields}
            quickFilters={quickFilters}
            sortOptions={sortOptions}
            noun="fee types"
            openMenu={openMenu}
            onOpenMenu={setOpenMenu}
            onRefresh={() => { setRows(initialRows); push('Fee types refreshed'); }}
            onSaveView={() => push('Current view saved')}
            onToast={push}
            renderDetail={renderDetail}
            renderActions={rowActions}
            bulkActions={bulkActions}
            emptyIcon="ti ti-cash-off"
            emptyTitle="No fee types match your filters"
            emptyBody="Try adjusting your search terms or clearing the active filters to see more results."
            caption="Fee type list with configuration, academic details and status"
            selectAllLabel="Select all fee types"
            rowLabel={(row) => `Select ${row.name}`}
          />
        </div>
      </div>

      {/* Modals */}
      <Modal
        open={activeModal === 'add'}
        onClose={() => setActiveModal(null)}
        title="Add Fees Type"
        dialogClassName="modal-lg"
        onSubmit={(e) => { e.preventDefault(); setActiveModal(null); push('Fee type added'); }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={() => setActiveModal(null)}>Cancel</button>
            <button type="submit" className="btn btn-primary">Add Fees Type</button>
          </>
        }
      >
        {feeTypeForm(null)}
      </Modal>

      <Modal
        open={activeModal === 'edit' && modalRow !== null}
        onClose={() => setActiveModal(null)}
        title="Edit Fees Type"
        dialogClassName="modal-lg"
        onSubmit={(e) => { e.preventDefault(); setActiveModal(null); push(`${modalRow?.name} updated`); }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={() => setActiveModal(null)}>Cancel</button>
            <button type="submit" className="btn btn-primary">Save Changes</button>
          </>
        }
      >
        {feeTypeForm(modalRow)}
      </Modal>

      <Modal
        open={activeModal === 'view' && modalRow !== null}
        onClose={() => setActiveModal(null)}
        title="Fee Type Details"
        dialogClassName="modal-lg"
        footer={<button type="button" className="btn btn-light" onClick={() => setActiveModal(null)}>Close</button>}
      >
        {modalRow ? (
          <>
            <div className="d-flex align-items-center mb-3 pb-3 border-bottom">
              <span className={`avatar avatar-lg bg-${modalRow.tint}-transparent text-${modalRow.tint} rounded me-3 flex-shrink-0`}>
                <i className={`${modalRow.icon} fs-20`} />
              </span>
              <div>
                <div className="d-flex align-items-center gap-2 flex-wrap">
                  <h5 className="mb-0">{modalRow.name}</h5>
                  <span className={`badge badge-soft-${modalRow.tint}`}>{modalRow.category}</span>
                  <span className={statusBadge[modalRow.status]}>{modalRow.status}</span>
                </div>
                <p className="mb-0 text-muted fs-13">{modalRow.code} · {money(modalRow.amount)} · {modalRow.frequency}</p>
              </div>
            </div>
            {renderDetail(modalRow)}
          </>
        ) : null}
      </Modal>

      <Modal
        open={activeModal === 'assign'}
        onClose={() => setActiveModal(null)}
        title="Assign Classes"
        onSubmit={(e) => { e.preventDefault(); setActiveModal(null); push('Classes assigned'); }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={() => setActiveModal(null)}>Cancel</button>
            <button type="submit" className="btn btn-primary">Assign Classes</button>
          </>
        }
      >
        {modalRow ? <p className="fs-13 mb-3">Assign classes for <span className="fw-medium">{modalRow.name}</span>.</p> : null}
        <div className="mb-0">
          <label className="form-label" htmlFor="ft-assign">Applicable Classes</label>
          <input type="text" className="form-control" id="ft-assign" defaultValue={modalRow?.classes ?? ''} placeholder="I – XII" />
        </div>
      </Modal>

      <Modal
        open={activeModal === 'import'}
        onClose={() => setActiveModal(null)}
        title="Import Fee Types"
        onSubmit={(e) => { e.preventDefault(); setActiveModal(null); push('Fee types imported'); }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={() => setActiveModal(null)}>Cancel</button>
            <button type="submit" className="btn btn-primary">Import</button>
          </>
        }
      >
        <div className="mb-0">
          <label className="form-label" htmlFor="ft-import">CSV File</label>
          <input type="file" className="form-control" id="ft-import" accept=".csv" />
        </div>
      </Modal>

      <Modal
        open={activeModal === 'delete'}
        onClose={() => setActiveModal(null)}
        title="Delete Fee Type"
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
            ? `Delete ${bulkIds.length} selected fee types? This cannot be undone.`
            : `Delete ${modalRow?.name}? This cannot be undone.`}
        </p>
      </Modal>

      <ToastStack toasts={toasts} onDismiss={dismiss} id="ftToasts" />
    </>
  );
};

export default FeesType;
