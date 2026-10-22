import { useCallback, useMemo, useState } from 'react';
import Modal from '@components/ui/Modal';
import Offcanvas from '@components/ui/Offcanvas';
import ToastStack from '@components/ui/ToastStack';
import { ActionLink, PageHeader, WorkspaceShell, useWorkspace } from '@components/workspace';
import type {
  ColumnDef, FilterField, QuickFilter, SavedView, SortOption, WorkspaceMenu,
} from '@components/workspace';
import ImageWithBasePath from '@core/common/imageWithBasePath';
import { all_routes } from '@/routes/all_routes';
import { useToasts } from '@hooks/useToasts';
import type { ApprovalStatus, Scholarship } from './data/scholarships.data';
import {
  coverageBand, money, programmes, scholarships as initialRows, statusBadge, statusPill,
} from './data/scholarships.data';

const routes = all_routes;

const filterFields: FilterField[] = [
  { id: 'scholarship-type', label: 'Scholarship Type', kind: 'select', chipLabel: 'Type', options: programmes.map((p) => p.id) },
  { id: 'academic-year', label: 'Academic Year', kind: 'select', chipLabel: 'Academic Year', options: ['2026 / 2027', '2025 / 2026', '2024 / 2025'] },
  { id: 'class', label: 'Class', kind: 'select', chipLabel: 'Class', options: ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'] },
  { id: 'approval-status', label: 'Approval Status', kind: 'select', chipLabel: 'Status', options: ['Approved', 'Pending', 'Under Review', 'Rejected', 'Renewal Due', 'Expired'] },
  { id: 'coverage', label: 'Coverage', kind: 'select', chipLabel: 'Coverage', options: ['Full waiver', '75% and above', '50% – 74%', 'Under 50%', 'Fixed amount'] },
  { id: 'renewal-status', label: 'Renewal Status', kind: 'select', chipLabel: 'Renewal', options: ['Eligible', 'Action required', 'Review pending', 'Ineligible'] },
  { id: 'effective-from', label: 'Effective From', kind: 'date', chipLabel: 'From', placeholder: '01-06-2026' },
  { id: 'effective-to', label: 'Effective To', kind: 'date', chipLabel: 'To', placeholder: '31-05-2027' },
];

/** Counts are the template's school-wide figures across 134 awards. */
const savedViews: SavedView[] = [
  { id: 'all', label: 'All Scholarships', icon: 'ti ti-layout-list', count: 134 },
  { id: 'Approved', label: 'Approved & Active', icon: 'ti ti-circle-check', count: 96 },
  { id: 'Pending', label: 'Awaiting Approval', icon: 'ti ti-clock', count: 18 },
  { id: 'Renewal Due', label: 'Renewal Due', icon: 'ti ti-calendar-repeat', count: 12 },
  { id: 'Expired', label: 'Expired', icon: 'ti ti-archive', count: 8 },
];

const quickFilters: QuickFilter[] = [
  { id: 'Approved', label: 'Approved', icon: 'ti ti-circle-check', count: 96 },
  { id: 'Pending', label: 'Pending', icon: 'ti ti-clock', count: 18 },
  { id: 'Renewal Due', label: 'Renewal Due', icon: 'ti ti-calendar-repeat', count: 12 },
  { id: 'Rejected', label: 'Rejected', icon: 'ti ti-circle-x', count: 5 },
  { id: 'Expired', label: 'Expired', icon: 'ti ti-archive', count: 8 },
];

const sortOptions: SortOption[] = [
  { id: 'student', label: 'Student name (A–Z)', icon: 'ti ti-abc' },
  { id: 'amount', label: 'Award amount', icon: 'ti ti-currency-dollar' },
  { id: 'coverage', label: 'Coverage', icon: 'ti ti-percentage' },
  { id: 'type', label: 'Scholarship type', icon: 'ti ti-category' },
  { id: 'updated', label: 'Recently updated', icon: 'ti ti-clock' },
];

type SchModalId = 'add' | 'edit' | 'view' | 'approve' | 'reject' | 'renew';

const Scholarships = () => {
  const [rows, setRows] = useState<Scholarship[]>(initialRows);
  const [openMenu, setOpenMenu] = useState<WorkspaceMenu>(null);
  const [programme, setProgramme] = useState<string | null>(null);
  const [activeModal, setActiveModal] = useState<SchModalId | null>(null);
  const [modalRow, setModalRow] = useState<Scholarship | null>(null);
  const [panelRow, setPanelRow] = useState<Scholarship | null>(null);
  const [note, setNote] = useState('');

  const { toasts, push, dismiss } = useToasts();

  const openModal = useCallback((row: Scholarship | null, modal: SchModalId) => {
    setModalRow(row);
    setActiveModal(modal);
    setNote('');
  }, []);

  const columns = useMemo<ColumnDef<Scholarship>[]>(
    () => [
      {
        id: 'scholarshipId', label: 'Scholarship ID', toggleable: false,
        render: (row) => <ActionLink className="fw-medium" onClick={() => openModal(row, 'view')}>{row.scholarshipId}</ActionLink>,
      },
      {
        id: 'student', label: 'Student', sortable: true,
        render: (row) => (
          <div className="dt-user">
            <span className="dt-avatar"><ImageWithBasePath src={row.avatar} alt={row.student} /></span>
            <div>
              <ActionLink className="dt-name" onClick={() => openModal(row, 'view')}>{row.student}</ActionLink>
              <div className="dt-sub">{row.admissionNo}</div>
            </div>
          </div>
        ),
      },
      { id: 'class', label: 'Class', render: (row) => row.className },
      { id: 'name', label: 'Scholarship Name', render: (row) => row.name },
      {
        id: 'type', label: 'Type', sortable: true,
        render: (row) => <span className={`badge badge-soft-${row.typeTint}`}>{row.type}</span>,
      },
      { id: 'coverage', label: 'Coverage', sortable: true, render: (row) => row.coverage },
      { id: 'amount', label: 'Award Amount', sortable: true, align: 'end', cellClassName: 'fw-medium', render: (row) => money(row.amount) },
      { id: 'academicYear', label: 'Academic Year', cellClassName: 'fs-13', render: (row) => row.academicYear },
      {
        id: 'status', label: 'Approval Status', toggleable: false,
        render: (row) => (
          <span className={`dt-pill ${statusPill[row.status]}`}>
            <span className="dt-pill-dot" />{row.status}
          </span>
        ),
      },
      { id: 'effectiveFrom', label: 'Effective Date', cellClassName: 'fs-13', render: (row) => row.effectiveFrom },
      { id: 'lastUpdated', label: 'Last Updated', cellClassName: 'fs-13 text-muted', render: (row) => row.lastUpdated },
    ],
    [openModal],
  );

  const workspace = useWorkspace<Scholarship>({
    rows, filterFields, columns,
    getId: (row) => row.id,
    search: (row, term) => `${row.student} ${row.scholarshipId} ${row.name}`.toLowerCase().includes(term),
    matches: (row, filters) => {
      if (programme && row.type !== programme) return false;
      if (filters['scholarship-type'] && row.type !== filters['scholarship-type']) return false;
      if (filters['academic-year'] && row.academicYear !== filters['academic-year']) return false;
      if (filters.class && !row.className.startsWith(filters.class)) return false;
      if (filters['approval-status'] && row.status !== filters['approval-status']) return false;
      if (filters.coverage && coverageBand(row) !== filters.coverage) return false;
      if (filters['renewal-status'] && row.renewalStatus !== filters['renewal-status']) return false;
      return true;
    },
    quickMatch: (row, quick) => !quick || row.status === quick,
    viewMatch: (row, view) => (view === 'all' ? true : row.status === view),
    compare: (a, b, sort) => {
      switch (sort) {
        case 'amount': return b.amount - a.amount || a.student.localeCompare(b.student);
        case 'coverage': return b.amount - a.amount;
        case 'type': return a.type.localeCompare(b.type) || a.student.localeCompare(b.student);
        case 'updated': return b.lastUpdated.localeCompare(a.lastUpdated);
        case 'student':
        default: return a.student.localeCompare(b.student);
      }
    },
    defaultSort: 'student',
    pageSize: 8,
  });

  const decide = useCallback(
    (status: ApprovalStatus, message: string) => {
      if (!modalRow) return;
      setRows((current) =>
        current.map((row) =>
          row.id === modalRow.id
            ? { ...row, status, lastUpdated: '30 Jul 2026', notes: note.trim() || row.notes }
            : row,
        ),
      );
      setActiveModal(null);
      push(message);
    },
    [modalRow, note, push],
  );

  const rowActions = (row: Scholarship) => (
    <div className="dt-actions">
      <ActionLink className="dt-ib" ariaLabel="View scholarship" onClick={() => setPanelRow(row)}>
        <i className="ti ti-eye" />
      </ActionLink>
      <ActionLink className="dt-ib" ariaLabel="Edit scholarship" onClick={() => openModal(row, 'edit')}>
        <i className="ti ti-edit" />
      </ActionLink>
      {row.status === 'Pending' || row.status === 'Under Review' ? (
        <>
          <ActionLink className="dt-ib success" ariaLabel="Approve" onClick={() => openModal(row, 'approve')}>
            <i className="ti ti-check" />
          </ActionLink>
          <ActionLink className="dt-ib danger" ariaLabel="Reject" onClick={() => openModal(row, 'reject')}>
            <i className="ti ti-x" />
          </ActionLink>
        </>
      ) : null}
      {row.status === 'Renewal Due' || row.status === 'Expired' ? (
        <ActionLink className="dt-ib success" ariaLabel="Renew" onClick={() => openModal(row, 'renew')}>
          <i className="ti ti-calendar-repeat" />
        </ActionLink>
      ) : null}
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

  const renderDetail = (row: Scholarship) => (
    <div className="row g-3">
      <div className="col-lg-4 col-md-6">
        <h6 className="fs-13 mb-2"><i className="ti ti-award text-primary me-1" />Award Details</h6>
        {infoList([
          { label: 'Scholarship', value: row.name },
          { label: 'Type', value: row.type },
          { label: 'Coverage', value: row.coverage },
          { label: 'Award Amount', value: money(row.amount) },
        ])}
      </div>
      <div className="col-lg-4 col-md-6">
        <h6 className="fs-13 mb-2"><i className="ti ti-checkup-list text-info me-1" />Approval</h6>
        {infoList([
          { label: 'Status', value: row.status },
          { label: 'Effective From', value: row.effectiveFrom },
          { label: 'Academic Year', value: row.academicYear },
          { label: 'Last Updated', value: row.lastUpdated },
        ])}
      </div>
      <div className="col-lg-4 col-md-6">
        <h6 className="fs-13 mb-2"><i className="ti ti-calendar-repeat text-success me-1" />Renewal</h6>
        {infoList([
          { label: 'Renewal Status', value: row.renewalStatus },
          { label: 'Sponsor', value: row.sponsor },
          { label: 'Student', value: row.student },
          { label: 'Class', value: row.className },
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
            title="Scholarships"
            section="Finance & Accounts"
            dashboardTo={routes.adminDashboard}
            actions={
              <>
                <button type="button" className="btn btn-outline-light bg-white me-2 mb-2 d-inline-flex align-items-center" onClick={() => push('Import is not wired to a backend yet', 'info')}>
                  <i className="ti ti-file-import me-1" />Import
                </button>
                <button type="button" className="btn btn-primary mb-2 d-inline-flex align-items-center" onClick={() => openModal(null, 'add')}>
                  <i className="ti ti-square-rounded-plus me-1" />Add Scholarship
                </button>
              </>
            }
          />

          <WorkspaceShell
            workspace={workspace}
            columns={columns}
            getId={(row) => row.id}
            totalCount={rows.length}
            searchPlaceholder="Search student, scholarship ID…"
            searchLabel="Search scholarships"
            savedViews={savedViews}
            filterFields={filterFields}
            quickFilters={quickFilters}
            sortOptions={sortOptions}
            noun="scholarships"
            openMenu={openMenu}
            onOpenMenu={setOpenMenu}
            onRefresh={() => { setRows(initialRows); push('Scholarships refreshed'); }}
            onSaveView={() => push('Current view saved')}
            onToast={push}
            onResetExtra={() => setProgramme(null)}
            renderDetail={renderDetail}
            renderActions={rowActions}
            emptyIcon="ti ti-award-off"
            emptyTitle="No Scholarships Found"
            emptyBody="No award matches the selected filters."
            beforeWorkspace={
              /* Programme cards — inert in the template; they filter the grid here. */
              <div className="row g-3 mb-3">
                {programmes.map((item) => (
                  <div className="col-xxl-3 col-lg-4 col-md-6 d-flex" key={item.id}>
                    <button
                      type="button"
                      className={`card flex-fill w-100 text-start border-0 p-0${programme === item.id ? ' card-selected' : ''}`}
                      aria-pressed={programme === item.id}
                      onClick={() => setProgramme((current) => (current === item.id ? null : item.id))}
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
            }
          />

          <Offcanvas open={panelRow !== null} onClose={() => setPanelRow(null)} title="Scholarship Details" labelledById="sch_panel_lbl">
            {panelRow ? (
              <>
                <div className="d-flex align-items-center gap-2 pb-3 mb-3 border-bottom">
                  <span className="avatar avatar-lg"><ImageWithBasePath src={panelRow.avatar} className="rounded" alt={panelRow.student} /></span>
                  <div>
                    <h6 className="mb-0">{panelRow.student}</h6>
                    <span className="fs-12 text-muted">{panelRow.scholarshipId} · {panelRow.className}</span>
                  </div>
                  <span className={`dt-pill ${statusPill[panelRow.status]} ms-auto`}>
                    <span className="dt-pill-dot" />{panelRow.status}
                  </span>
                </div>
                <div className="border rounded p-3 mb-3 d-flex justify-content-between align-items-center">
                  <span className="fw-medium">Award Amount</span>
                  <h5 className="mb-0">{money(panelRow.amount)}</h5>
                </div>
                {infoList([
                  { label: 'Scholarship', value: panelRow.name },
                  { label: 'Type', value: panelRow.type },
                  { label: 'Coverage', value: panelRow.coverage },
                  { label: 'Effective From', value: panelRow.effectiveFrom },
                  { label: 'Renewal', value: panelRow.renewalStatus },
                  { label: 'Sponsor', value: panelRow.sponsor },
                ])}
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
          title={mode === 'add' ? 'Add Scholarship' : 'Edit Scholarship'}
          dialogClassName="modal-lg"
          onSubmit={(e) => {
            e.preventDefault();
            push(mode === 'add' ? 'Scholarship added' : 'Scholarship updated');
            setActiveModal(null);
          }}
          footer={
            <>
              <button type="button" className="btn btn-light me-2" onClick={() => setActiveModal(null)}>Cancel</button>
              <button type="submit" className="btn btn-primary">{mode === 'add' ? 'Add Scholarship' : 'Save Changes'}</button>
            </>
          }
        >
          <div className="row">
            <div className="col-md-6"><div className="mb-3">
              <label className="form-label" htmlFor={`sc-student-${mode}`}>Student</label>
              <input type="text" className="form-control" id={`sc-student-${mode}`} defaultValue={mode === 'edit' ? modalRow?.student : ''} />
            </div></div>
            <div className="col-md-6"><div className="mb-3">
              <label className="form-label" htmlFor={`sc-type-${mode}`}>Scholarship Type</label>
              <select className="form-select" id={`sc-type-${mode}`} defaultValue={mode === 'edit' ? modalRow?.type : programmes[0].id}>
                {programmes.map((p) => <option key={p.id}>{p.id}</option>)}
              </select>
            </div></div>
            <div className="col-md-6"><div className="mb-3">
              <label className="form-label" htmlFor={`sc-coverage-${mode}`}>Coverage</label>
              <input type="text" className="form-control" placeholder="75% or $1,200" id={`sc-coverage-${mode}`} defaultValue={mode === 'edit' ? modalRow?.coverage : ''} />
            </div></div>
            <div className="col-md-6"><div className="mb-0">
              <label className="form-label" htmlFor={`sc-amount-${mode}`}>Award Amount</label>
              <input type="text" className="form-control" placeholder="0.00" id={`sc-amount-${mode}`} defaultValue={mode === 'edit' ? String(modalRow?.amount ?? '') : ''} />
            </div></div>
          </div>
        </Modal>
      ))}

      <Modal
        open={activeModal === 'view' && modalRow !== null}
        onClose={() => setActiveModal(null)}
        title="Scholarship Details"
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
                  <span className="badge bg-primary-transparent text-primary">{modalRow.scholarshipId}</span>
                  <span className={statusBadge[modalRow.status]}>{modalRow.status}</span>
                </div>
                <p className="mb-0 text-muted fs-13">{modalRow.name} · {modalRow.coverage}</p>
              </div>
            </div>
            {renderDetail(modalRow)}
          </>
        ) : null}
      </Modal>

      {([
        ['approve', 'Approve Scholarship', 'Approved', 'success', 'Approve'],
        ['reject', 'Reject Scholarship', 'Rejected', 'danger', 'Reject'],
        ['renew', 'Renew Scholarship', 'Approved', 'primary', 'Renew'],
      ] as [SchModalId, string, ApprovalStatus, string, string][]).map(([id, title, status, tone, cta]) => (
        <Modal
          key={id}
          open={activeModal === id && modalRow !== null}
          onClose={() => setActiveModal(null)}
          title={title}
          onSubmit={(e) => { e.preventDefault(); decide(status, `${modalRow?.scholarshipId} ${cta.toLowerCase()}d`); }}
          footer={
            <>
              <button type="button" className="btn btn-light me-2" onClick={() => setActiveModal(null)}>Cancel</button>
              <button type="submit" className={`btn btn-${tone}`}>{cta}</button>
            </>
          }
        >
          <p className="fs-13 mb-3">
            {cta} the {modalRow?.name} for <span className="fw-medium">{modalRow?.student}</span> (
            {money(modalRow?.amount ?? 0)})?
          </p>
          <div className="mb-0">
            <label className="form-label" htmlFor={`sc-note-${id}`}>Note</label>
            <textarea className="form-control" rows={3} id={`sc-note-${id}`} value={note} onChange={(e) => setNote(e.target.value)} />
          </div>
        </Modal>
      ))}

      <ToastStack toasts={toasts} onDismiss={dismiss} id="scToasts" />
    </>
  );
};

export default Scholarships;
