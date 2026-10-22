import { useCallback, useMemo, useState } from 'react';
import ToastStack from '@components/ui/ToastStack';
import {
  ActionLink,
  ExportMenu,
  PageHeader,
  useWorkspace,
  WorkspaceShell,
} from '@components/workspace';
import type {
  ColumnDef,
  ExportFormat,
  FilterField,
  QuickFilter,
  SavedView,
  SortOption,
  SummaryItem,
  WorkspaceMenu,
} from '@components/workspace';
import { all_routes } from '@/routes/all_routes';
import { useToasts } from '@hooks/useToasts';
import BonafideModals from './modals/BonafideModals';
import type { BonafideModalId } from './modals/BonafideModals';
import type { Request } from './data/bonafide.data';
import {
  ACADEMIC_YEAR,
  academicYearOptions,
  agoOf,
  approvalOf,
  approvalOptions,
  approverOptions,
  classOptions,
  countByState,
  countOpen,
  isOpenOf,
  issueNoteOf,
  purposeOptions,
  requests as seededRequests,
  searchIndexOf,
  sectionOptions,
  stateNoteOf,
  stateOf,
  stateOptions,
  statePill,
  TOTAL_REQUESTS,
  PENDING_TOTAL,
  ISSUED_TOTAL,
  READY_TOTAL,
  REISSUED_TOTAL,
  AWAITING_PRINT,
  turnaroundLabelOf,
  withinSlaOf,
} from './data/bonafide.data';

const routes = all_routes;

const filterFields: FilterField[] = [
  { id: 'class', label: 'Class', kind: 'select', chipLabel: 'Class', options: classOptions },
  { id: 'section', label: 'Section', kind: 'select', chipLabel: 'Section', options: sectionOptions },
  {
    id: 'year',
    label: 'Academic Year',
    kind: 'select',
    chipLabel: 'Year',
    options: academicYearOptions,
    defaultValue: '',
    initialValue: ACADEMIC_YEAR,
  },
  { id: 'purpose', label: 'Purpose', kind: 'select', chipLabel: 'Purpose', options: purposeOptions },
  { id: 'approval', label: 'Approval Status', kind: 'select', chipLabel: 'Approval', options: approvalOptions },
  { id: 'state', label: 'Certificate Status', kind: 'select', chipLabel: 'Status', options: stateOptions },
  { id: 'approver', label: 'Approved By', kind: 'select', chipLabel: 'Approver', options: approverOptions },
  { id: 'from', label: 'From Date', kind: 'date', chipLabel: 'From' },
];

const sortOptions: SortOption[] = [
  { id: 'id', label: 'Request ID', icon: 'ti ti-hash' },
  { id: 'student', label: 'Student (A–Z)', icon: 'ti ti-abc' },
  { id: 'requested', label: 'Request date', icon: 'ti ti-calendar' },
  { id: 'turnaround', label: 'Days open', icon: 'ti ti-clock' },
  { id: 'state', label: 'Status', icon: 'ti ti-flag' },
];

const savedViews: SavedView[] = [
  { id: 'all', label: 'All Requests', icon: 'ti ti-layout-list', count: TOTAL_REQUESTS },
  { id: 'pending', label: 'Pending Approval', icon: 'ti ti-clock', count: PENDING_TOTAL },
  { id: 'ready', label: 'Ready for Collection', icon: 'ti ti-inbox', count: READY_TOTAL },
  { id: 'print', label: 'Awaiting Print', icon: 'ti ti-printer', count: AWAITING_PRINT },
  { id: 'reissued', label: 'Reissued', icon: 'ti ti-refresh', count: REISSUED_TOTAL },
];

const BonafideCertificate = () => {
  const [rows, setRows] = useState<Request[]>(seededRequests);
  const [openMenu, setOpenMenu] = useState<WorkspaceMenu>(null);
  const [activeModal, setActiveModal] = useState<BonafideModalId | null>(null);
  const [modalRow, setModalRow] = useState<Request | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);

  const { toasts, push, dismiss } = useToasts();

  const openModal = useCallback((row: Request | null, modal: BonafideModalId) => {
    setModalRow(row);
    setActiveModal(modal);
  }, []);

  const openPanel = useCallback((row: Request) => {
    setModalRow(row);
    setPanelOpen(true);
  }, []);

  const columns = useMemo<ColumnDef<Request>[]>(
    () => [
      {
        id: 'id',
        label: 'Request ID',
        sortable: true,
        toggleable: false,
        render: (row) => (
          <ActionLink className="fw-medium" onClick={() => openPanel(row)}>
            {row.id}
          </ActionLink>
        ),
      },
      {
        id: 'student',
        label: 'Student',
        sortable: true,
        toggleable: false,
        render: (row) => (
          <div className="dt-user">
            <span className="avatar avatar-md bg-primary-transparent text-primary rounded flex-shrink-0 me-2">
              <i className="ti ti-user" />
            </span>
            <div>
              <ActionLink className="dt-name" onClick={() => openModal(row, 'view')}>
                {row.student}
              </ActionLink>
              <div className="dt-sub flex-nowrap text-nowrap">
                {row.house} · {row.section}
              </div>
            </div>
          </div>
        ),
      },
      {
        id: 'admission',
        label: 'Admission No.',
        render: (row) => <span className="fs-13 text-muted">{row.admissionNo}</span>,
      },
      {
        id: 'class',
        label: 'Class',
        render: (row) => <span className="fs-13 text-muted">{row.className}</span>,
      },
      {
        id: 'purpose',
        label: 'Purpose',
        sortable: true,
        cellClassName: 'text-nowrap',
        render: (row) => (
          <>
            <span className="fs-13 fw-medium d-block">{row.purpose}</span>
            <span className="fs-12 text-muted">{row.purposeNote}</span>
          </>
        ),
      },
      {
        id: 'requested',
        label: 'Requested On',
        sortable: true,
        render: (row) => (
          <>
            <span className="d-block fs-13 fw-medium text-nowrap">{row.requestedOn}</span>
            <span className="fs-12 text-muted d-block text-nowrap">{agoOf(row.requestedOn)}</span>
            <span
              className={`fs-12 text-nowrap ${withinSlaOf(row) ? 'text-success' : 'text-muted'}`}
            >
              {turnaroundLabelOf(row)}
            </span>
          </>
        ),
      },
      {
        id: 'approver',
        label: 'Approved By',
        cellClassName: 'text-nowrap',
        render: (row) => (
          <>
            <span className="fs-13 fw-medium d-block">{row.approvedBy ?? '—'}</span>
            <span className="fs-12 text-muted">{row.approverRole ?? 'Awaiting approval'}</span>
          </>
        ),
      },
      {
        id: 'state',
        label: 'Certificate Status',
        render: (row) => {
          const state = stateOf(row);
          return (
            <>
              <span className={`dt-pill ${statePill(state)}`}>
                <span className="dt-pill-dot" />
                {state}
              </span>
              <span className="d-block fs-12 text-muted mt-1 text-nowrap">{stateNoteOf(row)}</span>
            </>
          );
        },
      },
      {
        id: 'issued',
        label: 'Issue Date',
        render: (row) => (
          <>
            <span className="d-block fs-13 fw-medium text-nowrap">{row.issuedOn ?? '—'}</span>
            <span className="fs-12 text-muted d-block text-nowrap">
              {row.issuedOn ? agoOf(row.issuedOn) : issueNoteOf(row)}
            </span>
            {row.serial ? <span className="fs-12 text-muted text-nowrap">{row.serial}</span> : null}
          </>
        ),
      },
    ],
    [openModal, openPanel],
  );

  const quickFilters = useMemo<QuickFilter[]>(
    () => [
      { id: 'all', label: 'All', icon: 'ti ti-layout-list', count: TOTAL_REQUESTS },
      { id: 'pending', label: 'Pending', icon: 'ti ti-clock', count: countByState(rows, 'Awaiting Approval') },
      { id: 'progress', label: 'In Progress', icon: 'ti ti-printer', count: countOpen(rows) },
      { id: 'ready', label: 'Ready', icon: 'ti ti-inbox', count: countByState(rows, 'Ready for Collection') },
      { id: 'issued', label: 'Issued', icon: 'ti ti-file-check', count: countByState(rows, 'Issued') },
      { id: 'rejected', label: 'Rejected', icon: 'ti ti-circle-x', count: countByState(rows, 'Rejected') },
    ],
    [rows],
  );

  const workspace = useWorkspace<Request>({
    rows,
    filterFields,
    columns,
    getId: (row) => row.id,
    search: (row, term) => searchIndexOf(row).includes(term),
    matches: (row, filters) => {
      if (filters.class && row.className !== filters.class) return false;
      if (filters.section && !row.section.endsWith(filters.section)) return false;
      if (filters.purpose && row.purpose !== filters.purpose) return false;
      if (filters.approval && approvalOf(row) !== filters.approval) return false;
      if (filters.state && stateOf(row) !== filters.state) return false;
      if (filters.approver && row.approvedBy !== filters.approver) return false;
      return true;
    },
    quickMatch: (row, quick) => {
      if (!quick || quick === 'all') return true;
      if (quick === 'pending') return stateOf(row) === 'Awaiting Approval';
      if (quick === 'progress') return isOpenOf(row);
      if (quick === 'ready') return stateOf(row) === 'Ready for Collection';
      if (quick === 'issued') return stateOf(row) === 'Issued';
      if (quick === 'rejected') return stateOf(row) === 'Rejected';
      return true;
    },
    compare: (a, b, sort) => {
      if (sort === 'student') return a.student.localeCompare(b.student);
      if (sort === 'requested') return b.requestedOn.localeCompare(a.requestedOn);
      if (sort === 'state') return stateOf(a).localeCompare(stateOf(b));
      return a.id.localeCompare(b.id);
    },
    defaultSort: 'id',
    defaultQuick: 'all',
    pageSize: 8,
  });

  /**
   * The strip counts all 164 requests, not the eight the grid shows, so the
   * five totals stay register figures. The issued share derives from them.
   */
  const summary: SummaryItem[] = [
    {
      id: 'total',
      tint: 'primary',
      icon: 'ti ti-file-description',
      label: 'Total Requests',
      value: String(TOTAL_REQUESTS),
      hint: `academic year ${ACADEMIC_YEAR}`,
    },
    {
      id: 'pending',
      tint: 'warning',
      icon: 'ti ti-clock',
      label: 'Pending Approval',
      value: String(PENDING_TOTAL),
      hint: 'waiting on a signatory',
    },
    {
      id: 'issued',
      tint: 'success',
      icon: 'ti ti-file-check',
      label: 'Certificates Issued',
      value: String(ISSUED_TOTAL),
      hint: `${Math.round((ISSUED_TOTAL / TOTAL_REQUESTS) * 100)}% of all requests`,
    },
    {
      id: 'ready',
      tint: 'info',
      icon: 'ti ti-inbox',
      label: 'Ready for Collection',
      value: String(READY_TOTAL),
      hint: 'printed, at the office counter',
    },
    {
      id: 'reissued',
      tint: 'purple',
      icon: 'ti ti-refresh',
      label: 'Reissued',
      value: String(REISSUED_TOTAL),
      hint: `of ${ISSUED_TOTAL} issued certificates`,
    },
  ];

  const renderDetail = useCallback(
    (row: Request) => (
      <div className="row g-4">
        <div className="col-md-4">
          <h6 className="fs-14 mb-2">Request</h6>
          <p className="fs-13 text-muted mb-1">{row.purpose}</p>
          <p className="fs-13 text-muted mb-1">{row.purposeNote}</p>
          <p className="fs-13 text-muted mb-0">Logged {row.requestedOn}</p>
        </div>
        <div className="col-md-4">
          <h6 className="fs-14 mb-2">Progress</h6>
          <p className="fs-13 text-muted mb-1">Approved: {row.approvedOn ?? 'not yet'}</p>
          <p className="fs-13 text-muted mb-1">Generated: {row.generatedOn ?? 'not yet'}</p>
          <p className="fs-13 text-muted mb-0">Issued: {row.issuedOn ?? 'not yet'}</p>
        </div>
        <div className="col-md-4">
          <h6 className="fs-14 mb-2">Outcome</h6>
          <p className="fs-13 text-muted mb-1">{turnaroundLabelOf(row)}</p>
          <p className="fs-13 text-muted mb-1">{stateNoteOf(row)}</p>
          <p className="fs-13 text-muted mb-0">{row.serial ?? 'No serial yet'}</p>
        </div>
      </div>
    ),
    [],
  );

  const rowActions = useCallback(
    (row: Request) => (
      <div className="dt-actions">
        <ActionLink className="dt-ib" ariaLabel="View request" onClick={() => openModal(row, 'view')}>
          <i className="ti ti-eye" />
        </ActionLink>
        <ActionLink
          className="dt-ib success"
          ariaLabel="Approve request"
          onClick={() => openModal(row, 'approve')}
        >
          <i className="ti ti-check" />
        </ActionLink>
        <ActionLink
          className="dt-ib"
          ariaLabel="Generate certificate"
          onClick={() => openModal(row, 'generate')}
        >
          <i className="ti ti-file-certificate" />
        </ActionLink>
        <ActionLink className="dt-ib" ariaLabel="Preview" onClick={() => openModal(row, 'preview')}>
          <i className="ti ti-file-search" />
        </ActionLink>
        <ActionLink className="dt-ib" ariaLabel="Print" onClick={() => openModal(row, 'print')}>
          <i className="ti ti-printer" />
        </ActionLink>
      </div>
    ),
    [openModal],
  );

  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <PageHeader
            title="Bonafide Certificate"
            section="Certificates"
            dashboardTo={routes.adminDashboard}
            actions={
              <>
                <div className="me-2 mb-2">
                  <ExportMenu
                    printLabel="Print Request Register"
                    onExport={(format: ExportFormat) => {
                      push(`Bonafide requests exported as ${format.toUpperCase()}`);
                    }}
                  />
                </div>
                <div className="mb-2">
                  <ActionLink
                    className="btn btn-primary d-flex align-items-center"
                    onClick={() => openModal(null, 'new')}
                  >
                    <i className="ti ti-square-rounded-plus me-2" />
                    New Request
                  </ActionLink>
                </div>
              </>
            }
          />

          <WorkspaceShell
            workspace={workspace}
            columns={columns}
            getId={(row) => row.id}
            totalCount={TOTAL_REQUESTS}
            workspaceId="bonafide"
            searchPlaceholder="Request, student, admission number or purpose…"
            searchLabel="Search requests"
            savedViews={savedViews}
            filterFields={filterFields}
            quickFilters={quickFilters}
            sortOptions={sortOptions}
            noun="requests"
            openMenu={openMenu}
            onOpenMenu={setOpenMenu}
            footerVariant="card-foot"
            pageSizeOptions={[8, 25, 50, 100]}
            footerInfoSuffix={`academic year ${ACADEMIC_YEAR}`}
            onRefresh={() => {
              setRows(seededRequests);
              push('Requests refreshed');
            }}
            onSaveView={() => push('Current view saved')}
            onToast={push}
            renderDetail={renderDetail}
            renderActions={rowActions}
            emptyIcon="ti ti-file-off"
            emptyTitle="No requests match your filters"
            emptyBody="Clear a filter or widen the purpose to see more requests."
            summary={summary}
          />
        </div>
      </div>

      <BonafideModals
        active={activeModal}
        onClose={() => setActiveModal(null)}
        row={modalRow}
        panelOpen={panelOpen}
        onClosePanel={() => setPanelOpen(false)}
        onToast={push}
      />

      <ToastStack toasts={toasts} onDismiss={dismiss} id="bonafideToasts" />
    </>
  );
};

export default BonafideCertificate;
