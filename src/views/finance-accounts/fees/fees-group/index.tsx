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
import type { FeeGroup } from './data/feesGroup.data';
import {
  academicYearOptions, assignedSummaryOf, classOptions, classesAndSectionsOf, descriptionOf,
  discountRules, feeCategoryOptions, feeGroupOptions, feeGroups as initialRows, frequencyOptions,
  lateFeeRules, money, paymentScheduleOf, remarksOf, searchIndexOf, sectionOptions, statusBadge,
  statusOptions, statusPill,
} from './data/feesGroup.data';

const routes = all_routes;

const filterFields: FilterField[] = [
  { id: 'academic-year', label: 'Academic Year', kind: 'select', chipLabel: 'Year', options: academicYearOptions },
  { id: 'fee-group', label: 'Fee Group', kind: 'select', chipLabel: 'Group', options: feeGroupOptions },
  { id: 'fee-category', label: 'Fee Category', kind: 'select', chipLabel: 'Category', options: feeCategoryOptions },
  { id: 'class', label: 'Class', kind: 'select', chipLabel: 'Class', options: classOptions },
  { id: 'section', label: 'Section', kind: 'select', chipLabel: 'Section', options: sectionOptions },
  { id: 'status', label: 'Status', kind: 'select', chipLabel: 'Status', options: statusOptions },
];

const sortOptions: SortOption[] = [
  { id: 'name', label: 'Fee Group (A–Z)', icon: 'ti ti-abc' },
  { id: 'category', label: 'Category', icon: 'ti ti-category' },
  { id: 'amount', label: 'Total Amount', icon: 'ti ti-cash' },
  { id: 'students', label: 'Assigned Students', icon: 'ti ti-users' },
  { id: 'recent', label: 'Recently updated', icon: 'ti ti-history' },
];

type GroupModalId = 'add' | 'edit' | 'view' | 'import' | 'delete' | 'assignClasses' | 'assignStudents';

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const dateKey = (value: string): number => {
  const [day, month, year] = value.split(' ');
  const index = months.indexOf(month);
  if (index === -1) return 0;
  return Number(year) * 10000 + (index + 1) * 100 + Number(day);
};

const FeesGroup = () => {
  const [rows, setRows] = useState<FeeGroup[]>(initialRows);
  const [openMenu, setOpenMenu] = useState<WorkspaceMenu>(null);
  const [activeModal, setActiveModal] = useState<GroupModalId | null>(null);
  const [modalRow, setModalRow] = useState<FeeGroup | null>(null);
  const [bulkIds, setBulkIds] = useState<string[]>([]);

  const { loading } = useReveal();
  const { toasts, push, dismiss } = useToasts();

  const openModal = useCallback((row: FeeGroup | null, modal: GroupModalId) => {
    setModalRow(row);
    setBulkIds([]);
    setActiveModal(modal);
  }, []);

  const columns = useMemo<ColumnDef<FeeGroup>[]>(
    () => [
      {
        id: 'group', label: 'Fee Group', toggleable: false, sortable: true,
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
                <span className="badge badge-soft-secondary">
                  <i className="ti ti-calendar me-1" />{row.academicYear}
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
            <li className="py-1 text-muted">
              <i className="ti ti-school me-1" />Classes{' '}
              <span className="fw-medium text-dark">{row.classes}</span> · Sec {row.sections}
            </li>
            <li className="py-1 text-muted">
              <i className="ti ti-list-details me-1" />{row.components.join(', ')}
            </li>
            <li className="py-1 text-muted">
              <i className="ti ti-repeat me-1" />Frequency{' '}
              <span className="fw-medium text-dark">{row.frequency}</span>
            </li>
            <li className="py-1 text-muted">
              <i className="ti ti-calendar-event me-1" />Effective{' '}
              <span className="fw-medium text-dark">{row.effectiveFrom}</span>
            </li>
          </ul>
        ),
      },
      {
        id: 'details', label: 'Details', sortable: true,
        render: (row) => (
          <ul className="list-unstyled mb-0 fs-12">
            <li className="py-1">
              <span className="badge badge-soft-primary">
                <i className="ti ti-list-numbers me-1" />{row.feeItems} Fee Items
              </span>{' '}
              <span className="badge badge-soft-success">
                <i className="ti ti-cash me-1" />{money(row.amount)}
              </span>
            </li>
            <li className="py-1 text-muted">
              <i className="ti ti-users me-1" />Assigned{' '}
              <span className="fw-medium text-dark">{row.assignedStudents}</span> students
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

  const workspace = useWorkspace<FeeGroup>({
    rows, filterFields, columns,
    getId: (row) => row.id,
    search: (row, term) => searchIndexOf(row).includes(term),
    matches: (row, filters) => {
      if (filters['academic-year'] && row.academicYear !== filters['academic-year']) return false;
      if (filters['fee-group'] && row.name !== filters['fee-group']) return false;
      if (filters['fee-category'] && row.category !== filters['fee-category']) return false;
      if (filters.class && row.classes !== filters.class) return false;
      if (filters.section && row.sections !== filters.section) return false;
      if (filters.status && row.status !== filters.status) return false;
      return true;
    },
    quickMatch: (row, quick) => !quick || row.status === quick,
    viewMatch: (row, view) => (view === 'all' ? true : row.status === view),
    compare: (a, b, sort) => {
      switch (sort) {
        case 'category': return a.category.localeCompare(b.category) || a.name.localeCompare(b.name);
        case 'amount': return b.amount - a.amount || a.name.localeCompare(b.name);
        case 'students': return b.assignedStudents - a.assignedStudents || a.name.localeCompare(b.name);
        case 'recent': return dateKey(b.updated) - dateKey(a.updated) || a.name.localeCompare(b.name);
        case 'name':
        default: return a.name.localeCompare(b.name);
      }
    },
    defaultSort: 'name',
  });

  const countBy = useCallback(
    (status: FeeGroup['status']) => rows.filter((row) => row.status === status).length,
    [rows],
  );

  const savedViews = useMemo<SavedView[]>(
    () => [
      { id: 'all', label: 'All Fee Groups', icon: 'ti ti-layout-list', count: rows.length },
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

  const setStatus = useCallback(
    (ids: string[], status: FeeGroup['status'], message: string) => {
      setRows((current) => current.map((row) => (ids.includes(row.id) ? { ...row, status } : row)));
      workspace.clearSelection();
      push(message);
    },
    [push, workspace],
  );

  const remove = useCallback(() => {
    const ids = bulkIds.length > 0 ? bulkIds : modalRow ? [modalRow.id] : [];
    setRows((current) => current.filter((row) => !ids.includes(row.id)));
    workspace.clearSelection();
    setActiveModal(null);
    push(`${ids.length} fee ${ids.length === 1 ? 'group' : 'groups'} deleted`);
  }, [bulkIds, modalRow, push, workspace]);

  const bulkActions = useMemo<BulkAction[]>(
    () => [
      { id: 'assignClasses', label: 'Assign Classes', icon: 'ti ti-school', onClick: () => openModal(null, 'assignClasses') },
      { id: 'assignStudents', label: 'Assign Students', icon: 'ti ti-users', onClick: () => openModal(null, 'assignStudents') },
      {
        id: 'publish', label: 'Publish', icon: 'ti ti-send',
        onClick: (ids) => setStatus(ids, 'Active', `${ids.length} fee groups published`),
      },
      {
        id: 'export', label: 'Export Selected', icon: 'ti ti-file-export',
        onClick: (ids) => push(`${ids.length} fee groups exported`),
      },
      { id: 'print', label: 'Print', icon: 'ti ti-printer', onClick: () => window.print() },
      {
        id: 'archive', label: 'Archive', icon: 'ti ti-archive',
        onClick: (ids) => setStatus(ids, 'Archived', `${ids.length} fee groups archived`),
      },
      {
        id: 'delete', label: 'Delete', icon: 'ti ti-trash', danger: true,
        onClick: (ids) => { setBulkIds(ids); setModalRow(null); setActiveModal('delete'); },
      },
    ],
    [openModal, push, setStatus],
  );

  const rowActions = (row: FeeGroup) => (
    <div className="dt-actions">
      <ActionLink className="dt-ib" title="View Fee Group" ariaLabel="View Fee Group" onClick={() => openModal(row, 'view')}>
        <i className="ti ti-eye" />
      </ActionLink>
      <ActionLink className="dt-ib" title="Edit" ariaLabel="Edit" onClick={() => openModal(row, 'edit')}>
        <i className="ti ti-edit" />
      </ActionLink>
      <ActionLink className="dt-ib" title="Assign Classes" ariaLabel="Assign Classes" onClick={() => openModal(row, 'assignClasses')}>
        <i className="ti ti-school" />
      </ActionLink>
      <ActionLink className="dt-ib" title="Assign Students" ariaLabel="Assign Students" onClick={() => openModal(row, 'assignStudents')}>
        <i className="ti ti-users" />
      </ActionLink>
      <ActionLink className="dt-ib" title="Delete" ariaLabel="Delete" onClick={() => openModal(row, 'delete')}>
        <i className="ti ti-trash" />
      </ActionLink>
    </div>
  );

  /* --------------------------------- Panels --------------------------------- */

  const renderDetail = (row: FeeGroup) => (
    <div className="dt-detail-inner">
      <div className="row g-4">
        <div className="col-xl-3 col-md-6">
          <h4 className="details-heading fs-15 fw-medium"><i className="ti ti-file-description" />Fee Description</h4>
          <p className="fs-12 text-muted mb-3">{descriptionOf(row)}</p>
          <h5 className="details-heading fs-15"><i className="ti ti-list-details" />Fee Breakdown</h5>
          <ul className="list-unstyled fs-12 mb-0">
            {row.components.map((component) => (
              <li className="d-flex align-items-center justify-content-between py-1" key={component}>
                <span className="text-muted">{component}</span>
                <span className="fw-medium">Included</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="col-xl-3 col-md-6">
          <h6 className="details-heading"><i className="ti ti-school" />Applicable Classes &amp; Sections</h6>
          <p className="fs-12 text-muted mb-3">{classesAndSectionsOf(row)}</p>
          <h6 className="details-heading"><i className="ti ti-calendar-event" />Payment Schedule</h6>
          <p className="fs-12 text-muted mb-0">{paymentScheduleOf(row)}</p>
        </div>
        <div className="col-xl-3 col-md-6">
          <h6 className="details-heading"><i className="ti ti-discount" />Discount Rules</h6>
          <p className="fs-12 text-muted mb-3">{discountRules}</p>
          <h6 className="details-heading"><i className="ti ti-alarm" />Late Fee Rules</h6>
          <p className="fs-12 text-muted mb-0">{lateFeeRules}</p>
        </div>
        <div className="col-xl-3 col-md-6">
          <h6 className="details-heading"><i className="ti ti-users" />Assigned Students Summary</h6>
          <p className="fs-12 text-muted mb-2">{assignedSummaryOf(row)}</p>
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

  const groupForm = (row: FeeGroup | null) => (
    <div className="row">
      <div className="col-md-6"><div className="mb-3">
        <label className="form-label" htmlFor="fg-name">Fee Group Name</label>
        <input type="text" className="form-control" id="fg-name" defaultValue={row?.name ?? ''} placeholder="Tuition Fees" />
      </div></div>
      <div className="col-md-6"><div className="mb-3">
        <label className="form-label" htmlFor="fg-code">Group Code</label>
        <input type="text" className="form-control" id="fg-code" defaultValue={row?.code ?? ''} placeholder="FG24011" />
      </div></div>
      <div className="col-md-6"><div className="mb-3">
        <label className="form-label" htmlFor="fg-category">Fee Category</label>
        <select className="form-select" id="fg-category" defaultValue={row?.category ?? feeCategoryOptions[0]}>
          {feeCategoryOptions.map((option) => <option key={option}>{option}</option>)}
        </select>
      </div></div>
      <div className="col-md-6"><div className="mb-3">
        <label className="form-label" htmlFor="fg-frequency">Collection Frequency</label>
        <select className="form-select" id="fg-frequency" defaultValue={row?.frequency ?? frequencyOptions[0]}>
          {frequencyOptions.map((option) => <option key={option}>{option}</option>)}
        </select>
      </div></div>
      <div className="col-md-6"><div className="mb-3">
        <label className="form-label" htmlFor="fg-class">Class</label>
        <select className="form-select" id="fg-class" defaultValue={row?.classes ?? classOptions[0]}>
          {classOptions.map((option) => <option key={option}>{option}</option>)}
        </select>
      </div></div>
      <div className="col-md-6"><div className="mb-3">
        <label className="form-label" htmlFor="fg-section">Section</label>
        <select className="form-select" id="fg-section" defaultValue={row?.sections ?? sectionOptions[0]}>
          {sectionOptions.map((option) => <option key={option}>{option}</option>)}
        </select>
      </div></div>
      <div className="col-md-6"><div className="mb-3">
        <label className="form-label" htmlFor="fg-amount">Total Amount</label>
        <input type="text" className="form-control" id="fg-amount" defaultValue={row ? String(row.amount) : ''} placeholder="0.00" />
      </div></div>
      <div className="col-md-6"><div className="mb-0">
        <label className="form-label" htmlFor="fg-status">Status</label>
        <select className="form-select" id="fg-status" defaultValue={row?.status ?? statusOptions[0]}>
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
            title="Fees Group"
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
                  <i className="ti ti-square-rounded-plus me-2" />Add Fees Group
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
            searchPlaceholder="Search fee groups, code, category or author…"
            searchLabel="Search fee groups"
            savedViews={savedViews}
            filterFields={filterFields}
            quickFilters={quickFilters}
            sortOptions={sortOptions}
            noun="fee groups"
            openMenu={openMenu}
            onOpenMenu={setOpenMenu}
            onRefresh={() => { setRows(initialRows); push('Fee groups refreshed'); }}
            onSaveView={() => push('Current view saved')}
            onToast={push}
            renderDetail={renderDetail}
            renderActions={rowActions}
            bulkActions={bulkActions}
            emptyIcon="ti ti-cash-off"
            emptyTitle="No fee groups match your filters"
            emptyBody="Try adjusting your search terms or clearing the active filters to see more results."
            caption="Fee group list with configuration, details and status"
            selectAllLabel="Select all fee groups"
            rowLabel={(row) => `Select ${row.name}`}
          />
        </div>
      </div>

      {/* Modals */}
      <Modal
        open={activeModal === 'add'}
        onClose={() => setActiveModal(null)}
        title="Add Fees Group"
        dialogClassName="modal-lg"
        onSubmit={(e) => { e.preventDefault(); setActiveModal(null); push('Fee group added'); }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={() => setActiveModal(null)}>Cancel</button>
            <button type="submit" className="btn btn-primary">Add Fees Group</button>
          </>
        }
      >
        {groupForm(null)}
      </Modal>

      <Modal
        open={activeModal === 'edit' && modalRow !== null}
        onClose={() => setActiveModal(null)}
        title="Edit Fees Group"
        dialogClassName="modal-lg"
        onSubmit={(e) => { e.preventDefault(); setActiveModal(null); push(`${modalRow?.name} updated`); }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={() => setActiveModal(null)}>Cancel</button>
            <button type="submit" className="btn btn-primary">Save Changes</button>
          </>
        }
      >
        {groupForm(modalRow)}
      </Modal>

      <Modal
        open={activeModal === 'view' && modalRow !== null}
        onClose={() => setActiveModal(null)}
        title="Fee Group Details"
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
                <p className="mb-0 text-muted fs-13">
                  {modalRow.code} · {money(modalRow.amount)} · {modalRow.assignedStudents} students
                </p>
              </div>
            </div>
            {renderDetail(modalRow)}
          </>
        ) : null}
      </Modal>

      <Modal
        open={activeModal === 'assignClasses'}
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
        <div className="row">
          <div className="col-md-6"><div className="mb-3">
            <label className="form-label" htmlFor="fg-assign-class">Class</label>
            <select className="form-select" id="fg-assign-class" defaultValue={modalRow?.classes ?? classOptions[0]}>
              {classOptions.map((option) => <option key={option}>{option}</option>)}
            </select>
          </div></div>
          <div className="col-md-6"><div className="mb-0">
            <label className="form-label" htmlFor="fg-assign-section">Section</label>
            <select className="form-select" id="fg-assign-section" defaultValue={modalRow?.sections ?? sectionOptions[0]}>
              {sectionOptions.map((option) => <option key={option}>{option}</option>)}
            </select>
          </div></div>
        </div>
      </Modal>

      <Modal
        open={activeModal === 'assignStudents'}
        onClose={() => setActiveModal(null)}
        title="Assign Students"
        onSubmit={(e) => { e.preventDefault(); setActiveModal(null); push('Students assigned'); }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={() => setActiveModal(null)}>Cancel</button>
            <button type="submit" className="btn btn-primary">Assign Students</button>
          </>
        }
      >
        {modalRow ? (
          <p className="fs-13 mb-3">
            <span className="fw-medium">{modalRow.name}</span> currently covers {modalRow.assignedStudents} students.
          </p>
        ) : null}
        <div className="mb-0">
          <label className="form-label" htmlFor="fg-assign-students">Class</label>
          <select className="form-select" id="fg-assign-students" defaultValue={classOptions[0]}>
            {classOptions.map((option) => <option key={option}>{option}</option>)}
          </select>
        </div>
      </Modal>

      <Modal
        open={activeModal === 'import'}
        onClose={() => setActiveModal(null)}
        title="Import Fee Groups"
        onSubmit={(e) => { e.preventDefault(); setActiveModal(null); push('Fee groups imported'); }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={() => setActiveModal(null)}>Cancel</button>
            <button type="submit" className="btn btn-primary">Import</button>
          </>
        }
      >
        <div className="mb-3">
          <label className="form-label" htmlFor="fg-import">CSV File</label>
          <input type="file" className="form-control" id="fg-import" accept=".csv" />
        </div>
        <div className="mb-0">
          <label className="form-label" htmlFor="fg-import-mode">Import mode</label>
          <select className="form-select" id="fg-import-mode" defaultValue="Update existing by code">
            <option>Update existing by code</option>
            <option>Create and update</option>
          </select>
        </div>
      </Modal>

      <Modal
        open={activeModal === 'delete'}
        onClose={() => setActiveModal(null)}
        title="Delete Fee Group"
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
            ? `Delete ${bulkIds.length} selected fee groups? This cannot be undone.`
            : `Delete ${modalRow?.name}? This cannot be undone.`}
        </p>
      </Modal>

      <ToastStack toasts={toasts} onDismiss={dismiss} id="fgToasts" />
    </>
  );
};

export default FeesGroup;
