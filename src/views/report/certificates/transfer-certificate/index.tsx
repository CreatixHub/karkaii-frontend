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
import TransferModals from './modals/TransferModals';
import type { TransferModalId } from './modals/TransferModals';
import type { Request } from './data/transfer.data';
import {
  ACADEMIC_YEAR,
  academicYearOptions,
  agoOf,
  approvalNoteOf,
  approvalPill,
  approvalStatusOf,
  blocksApprovalOf,
  booksOnLoanOf,
  CLEARANCE_PENDING,
  classOptions,
  clearanceNoteOf,
  clearanceStatusOf,
  clearanceStatusOptions,
  clearanceTint,
  clearedCountOf,
  countByApproval,
  countByIssue,
  countPendingClearance,
  daysOpenOf,
  DEPARTMENTS,
  departmentsOf,
  detailActionsOf,
  FEE_DUES_OUTSTANDING,
  heldByOf,
  ISSUED_TOTAL,
  issueNoteOf,
  issueStatusOf,
  issueStatusOptions,
  money,
  openForOf,
  outstandingOf,
  PENDING_APPROVAL,
  previewEmptyNoteOf,
  printHistoryOf,
  promotionLineOf,
  reasonOptions,
  REASON_TINT,
  READY_TOTAL,
  requests as seededRequests,
  requestStatusOptions,
  searchIndexOf,
  sectionOptions,
  shareOf,
  timelineOf,
  TOTAL_REQUESTS,
  turnaroundLabelOf,
  verificationCodeOf,
} from './data/transfer.data';

const routes = all_routes;

const filterFields: FilterField[] = [
  { id: 'class', label: 'Class', kind: 'select', chipLabel: 'Class', options: classOptions },
  {
    id: 'year',
    label: 'Academic Year',
    kind: 'select',
    chipLabel: 'Academic year',
    options: academicYearOptions,
    defaultValue: '',
    initialValue: ACADEMIC_YEAR,
  },
  {
    id: 'request',
    label: 'Request Status',
    kind: 'select',
    chipLabel: 'Request',
    options: requestStatusOptions,
  },
  {
    id: 'clearance',
    label: 'Clearance Status',
    kind: 'select',
    chipLabel: 'Clearance',
    options: clearanceStatusOptions,
  },
  {
    id: 'reason',
    label: 'Leaving Reason',
    kind: 'select',
    chipLabel: 'Reason',
    options: reasonOptions,
  },
  {
    id: 'issue',
    label: 'Issue Status',
    kind: 'select',
    chipLabel: 'Issue',
    options: issueStatusOptions,
  },
  { id: 'section', label: 'Section', kind: 'select', chipLabel: 'Section', options: sectionOptions },
  { id: 'from', label: 'From Date', kind: 'date', chipLabel: 'From' },
];

const sortOptions: SortOption[] = [
  { id: 'tc', label: 'TC number', icon: 'ti ti-hash' },
  { id: 'student', label: 'Student name (A–Z)', icon: 'ti ti-abc' },
  { id: 'requested', label: 'Request date', icon: 'ti ti-calendar-event' },
  { id: 'clearance', label: 'Clearance status', icon: 'ti ti-checklist' },
  { id: 'open', label: 'Days open', icon: 'ti ti-clock' },
];

const savedViews: SavedView[] = [
  { id: 'all', label: 'All Requests', icon: 'ti ti-layout-list', count: TOTAL_REQUESTS },
  { id: 'clearance', label: 'Clearance Pending', icon: 'ti ti-checklist', count: CLEARANCE_PENDING },
  { id: 'signature', label: 'Awaiting Signature', icon: 'ti ti-clock', count: PENDING_APPROVAL },
  { id: 'ready', label: 'Ready for Collection', icon: 'ti ti-inbox', count: READY_TOTAL },
  { id: 'dues', label: 'Fee Dues Outstanding', icon: 'ti ti-cash', count: FEE_DUES_OUTSTANDING },
];

/**
 * The strip counts all 46 requests, not the eight the grid shows, so the five
 * totals stay register figures. The issued share derives from them.
 */
const summary: SummaryItem[] = [
  {
    id: 'total',
    tint: 'primary',
    icon: 'ti ti-file-export',
    label: 'Total Requests',
    value: String(TOTAL_REQUESTS),
    hint: `academic year ${ACADEMIC_YEAR}`,
  },
  {
    id: 'approval',
    tint: 'warning',
    icon: 'ti ti-clock',
    label: 'Pending Approval',
    value: String(PENDING_APPROVAL),
    hint: 'cleared, awaiting a signature',
  },
  {
    id: 'clearance',
    tint: 'danger',
    icon: 'ti ti-checklist',
    label: 'Clearance Pending',
    value: String(CLEARANCE_PENDING),
    hint: 'dues or books outstanding',
  },
  {
    id: 'issued',
    tint: 'success',
    icon: 'ti ti-file-check',
    label: 'Certificates Issued',
    value: String(ISSUED_TOTAL),
    hint: `${shareOf(ISSUED_TOTAL, TOTAL_REQUESTS)}% of all requests`,
  },
  {
    id: 'ready',
    tint: 'info',
    icon: 'ti ti-inbox',
    label: 'Ready for Collection',
    value: String(READY_TOTAL),
    hint: 'printed, at the office counter',
  },
];

/* ----------------------------- Detail helpers ---------------------------- */

const Line = ({ label, value, last = false }: { label: string; value: string; last?: boolean }) => (
  <div className={`d-flex align-items-center justify-content-between ${last ? 'mb-0' : 'mb-2'}`}>
    <span className="fs-13 text-muted">{label}</span>
    <span className="fs-13 fw-medium text-end">{value}</span>
  </div>
);

const Tile = ({
  title,
  note,
  icon,
  tint,
}: {
  title: string;
  note: string;
  icon: string;
  tint: string;
}) => (
  <div className="d-flex align-items-center gap-2 border rounded p-2 mb-2">
    <span className={`avatar avatar-sm bg-${tint}-transparent text-${tint} rounded flex-shrink-0`}>
      <i className={icon} />
    </span>
    <div className="flex-fill overflow-hidden">
      <h6 className="fs-13 mb-0 text-truncate">{title}</h6>
      <span className="fs-12 text-muted text-truncate d-block">{note}</span>
    </div>
  </div>
);

const TransferCertificate = () => {
  const [rows, setRows] = useState<Request[]>(seededRequests);
  const [openMenu, setOpenMenu] = useState<WorkspaceMenu>(null);
  const [activeModal, setActiveModal] = useState<TransferModalId | null>(null);
  const [modalRow, setModalRow] = useState<Request | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);

  const { toasts, push, dismiss } = useToasts();

  const openModal = useCallback((row: Request | null, modal: TransferModalId) => {
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
        id: 'tc',
        label: 'TC Number',
        sortable: true,
        toggleable: false,
        render: (row) => (
          <ActionLink className="fw-medium" onClick={() => openPanel(row)}>
            {row.tcNumber}
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
            <span
              className={`avatar avatar-md bg-${REASON_TINT[row.reason]}-transparent text-${REASON_TINT[row.reason]} rounded flex-shrink-0 me-2`}
            >
              <i className="ti ti-user" />
            </span>
            <div>
              <ActionLink className="dt-name" onClick={() => openModal(row, 'view')}>
                {row.student}
              </ActionLink>
              <div className="dt-sub flex-nowrap text-nowrap">Admitted {row.admittedOn}</div>
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
        render: (row) => (
          <>
            <span className="badge badge-soft-secondary">{row.className}</span>
            <span className="d-block fs-12 text-muted mt-1">{row.section}</span>
          </>
        ),
      },
      {
        id: 'requested',
        label: 'Request Date',
        sortable: true,
        render: (row) => (
          <>
            <span className="d-block fs-13 fw-medium text-nowrap">{row.requestedOn}</span>
            <span className="fs-12 text-muted d-block text-nowrap">{agoOf(row.requestedOn)}</span>
            <span className="fs-12 text-muted text-nowrap">{turnaroundLabelOf(row)}</span>
          </>
        ),
      },
      {
        id: 'reason',
        label: 'Leaving Reason',
        cellClassName: 'text-nowrap',
        render: (row) => (
          <>
            <span className={`badge badge-soft-${REASON_TINT[row.reason]}`}>{row.reason}</span>
            <span className="d-block fs-12 text-muted mt-1">{row.reasonDetail}</span>
          </>
        ),
      },
      {
        id: 'clearance',
        label: 'Clearance Status',
        sortable: true,
        render: (row) => (
          <>
            <span className={`badge badge-soft-${clearanceTint(clearanceStatusOf(row))}`}>
              {clearanceStatusOf(row)}
            </span>
            <span className="d-block fs-12 text-muted mt-1 text-nowrap">
              {clearanceNoteOf(row)}
            </span>
          </>
        ),
      },
      {
        id: 'approval',
        label: 'Approval Status',
        render: (row) => {
          const status = approvalStatusOf(row);
          return (
            <>
              <span className={`dt-pill ${approvalPill(status)}`}>
                <span className="dt-pill-dot" />
                {status}
              </span>
              <span className="d-block fs-12 text-muted mt-1 text-nowrap">
                {approvalNoteOf(row)}
              </span>
            </>
          );
        },
      },
      {
        id: 'issue',
        label: 'Issue Date',
        render: (row) => (
          <>
            <span className="d-block fs-13 fw-medium text-nowrap">{row.collectedOn ?? '—'}</span>
            <span className="fs-12 text-muted d-block text-nowrap">
              {row.collectedOn ? agoOf(row.collectedOn) : issueNoteOf(row)}
            </span>
            {row.collectedOn ? (
              <span className="fs-12 text-muted text-nowrap">{issueNoteOf(row)}</span>
            ) : null}
          </>
        ),
      },
    ],
    [openModal, openPanel],
  );

  const quickFilters = useMemo<QuickFilter[]>(
    () => [
      { id: 'all', label: 'All', icon: 'ti ti-layout-list', count: TOTAL_REQUESTS },
      {
        id: 'clearance',
        label: 'Clearance',
        icon: 'ti ti-checklist',
        count: countPendingClearance(rows),
      },
      {
        id: 'approval',
        label: 'Approval',
        icon: 'ti ti-clock',
        count: countByApproval(rows, 'Pending Approval'),
      },
      {
        id: 'ready',
        label: 'Ready',
        icon: 'ti ti-inbox',
        count: countByIssue(rows, 'Ready for Collection'),
      },
      {
        id: 'issued',
        label: 'Issued',
        icon: 'ti ti-file-check',
        count: countByIssue(rows, 'Collected'),
      },
      {
        id: 'rejected',
        label: 'Rejected',
        icon: 'ti ti-circle-x',
        count: countByApproval(rows, 'Rejected'),
      },
    ],
    [rows],
  );

  const workspace = useWorkspace<Request>({
    rows,
    filterFields,
    columns,
    getId: (row) => row.tcNumber,
    search: (row, term) => searchIndexOf(row).includes(term),
    matches: (row, filters) => {
      if (filters.class && row.className !== filters.class) return false;
      if (filters.section && !row.section.endsWith(filters.section)) return false;
      if (filters.request && approvalStatusOf(row) !== filters.request) return false;
      if (filters.clearance && clearanceStatusOf(row) !== filters.clearance) return false;
      if (filters.reason && row.reason !== filters.reason) return false;
      if (filters.issue && issueStatusOf(row) !== filters.issue) return false;
      return true;
    },
    quickMatch: (row, quick) => {
      if (!quick || quick === 'all') return true;
      if (quick === 'clearance') return clearanceStatusOf(row) !== 'Cleared';
      if (quick === 'approval') return approvalStatusOf(row) === 'Pending Approval';
      if (quick === 'ready') return issueStatusOf(row) === 'Ready for Collection';
      if (quick === 'issued') return issueStatusOf(row) === 'Collected';
      if (quick === 'rejected') return approvalStatusOf(row) === 'Rejected';
      return true;
    },
    compare: (a, b, sort) => {
      if (sort === 'student') return a.student.localeCompare(b.student);
      if (sort === 'requested') return b.requestedOn.localeCompare(a.requestedOn);
      if (sort === 'clearance') return clearedCountOf(b) - clearedCountOf(a);
      if (sort === 'open') return daysOpenOf(b) - daysOpenOf(a);
      return a.tcNumber.localeCompare(b.tcNumber);
    },
    defaultSort: 'tc',
    defaultQuick: 'all',
    pageSize: 8,
  });

  const renderDetail = useCallback(
    (row: Request) => (
      <div className="row g-4">
        <div className="col-xl-3 col-md-6">
          <h6 className="fs-14 mb-3">
            <i className="ti ti-user text-primary me-1" />
            Student Profile
          </h6>
          <Line label="Student" value={row.student} />
          <Line label="Admission No." value={row.admissionNo} />
          <Line
            label="Class & Section"
            value={`${row.className.replace('Class ', '')} · ${row.section}`}
          />
          <Line label="Date of Admission" value={row.admittedOn} />
          <Line label="Guardian" value={row.guardian} />
          <Line label="Contact" value={row.contact} last />
        </div>

        <div className="col-xl-3 col-md-6">
          <h6 className="fs-14 mb-3">
            <i className="ti ti-file-export text-info me-1" />
            Request Details
          </h6>
          <Line label="TC Number" value={row.tcNumber} />
          <Line label="Leaving Reason" value={row.reason} />
          <Line label="Detail" value={row.reasonDetail} />
          <Line label="Requested On" value={row.requestedOn} />
          <Line label="Last Attended" value={row.lastAttendedOn ?? 'Still attending'} />
          <Line label="Open For" value={openForOf(row)} last />
        </div>

        <div className="col-xl-3 col-md-6">
          <h6 className="fs-14 mb-3">
            <i className="ti ti-checklist text-warning me-1" />
            Department Clearance
          </h6>
          {departmentsOf(row).map((entry) => (
            <div
              className="d-flex align-items-center gap-2 border rounded p-2 mb-2"
              key={entry.name}
            >
              <div className="flex-fill overflow-hidden">
                <h6 className="fs-13 mb-0 text-truncate">{entry.name}</h6>
                <span className="fs-12 text-muted text-truncate d-block">{entry.check.detail}</span>
              </div>
              <span className={`badge badge-soft-${clearanceTint(entry.check.status)}`}>
                {entry.check.status}
              </span>
            </div>
          ))}
        </div>

        <div className="col-xl-3 col-md-6">
          <h6 className="fs-14 mb-3">
            <i className="ti ti-cash text-danger me-1" />
            Fee &amp; Library Clearance
          </h6>
          {row.dues.length === 0 && row.books.length === 0 ? (
            <Tile
              title="Nothing outstanding"
              note="Accounts and library both clear"
              icon="ti ti-circle-check"
              tint="success"
            />
          ) : (
            <>
              {row.dues.map((due) => (
                <Tile
                  key={due.item}
                  title={due.item}
                  note={money(due.amount)}
                  icon="ti ti-cash"
                  tint="danger"
                />
              ))}
              {row.books.map((book) => (
                <Tile
                  key={book.title}
                  title={book.title}
                  note={`due ${book.due}`}
                  icon="ti ti-book"
                  tint="warning"
                />
              ))}
            </>
          )}
          <Line label="Outstanding Balance" value={money(outstandingOf(row))} />
          <Line label="Books On Loan" value={String(booksOnLoanOf(row))} last={!blocksApprovalOf(row)} />
          {blocksApprovalOf(row) ? <Line label="Blocks Approval" value="Yes" last /> : null}
        </div>

        <div className="col-xl-3 col-md-6">
          <h6 className="fs-14 mb-3">
            <i className="ti ti-timeline text-purple me-1" />
            Approval Timeline
          </h6>
          {timelineOf(row).map((entry) => (
            <Tile
              key={entry.title}
              title={entry.title}
              note={entry.note}
              icon="ti ti-point"
              tint="info"
            />
          ))}
        </div>

        <div className="col-xl-3 col-md-6">
          <h6 className="fs-14 mb-3">
            <i className="ti ti-certificate text-success me-1" />
            Certificate Preview
          </h6>
          {row.generatedOn ? (
            <div className="border rounded p-3">
              <h6 className="fs-13 mb-1">Transfer Certificate</h6>
              <span className="fs-12 text-muted d-block mb-2">{row.tcNumber}</span>
              <p className="fs-13 text-muted mb-3">
                This is to certify that <b className="text-dark">{row.student}</b>, admission number{' '}
                {row.admissionNo}, was a student of {row.className}, {row.section} and was admitted
                on {row.admittedOn}.
              </p>
              <Line label="Last Attended" value={row.lastAttendedOn ?? 'Still attending'} />
              <Line label="Promotion" value={promotionLineOf(row)} />
              <Line label="Conduct" value={row.conduct} last />
              <div className="d-flex align-items-center gap-2 border-top pt-2 mt-2">
                <span className="avatar avatar-sm bg-secondary-transparent text-secondary rounded flex-shrink-0">
                  <i className="ti ti-qrcode" />
                </span>
                <span className="fs-12 text-muted text-truncate">{verificationCodeOf(row)}</span>
              </div>
            </div>
          ) : (
            <Tile
              title="No certificate generated"
              note={previewEmptyNoteOf(row)}
              icon="ti ti-file-off"
              tint="secondary"
            />
          )}
        </div>

        <div className="col-xl-3 col-md-6">
          <h6 className="fs-14 mb-3">
            <i className="ti ti-printer text-info me-1" />
            Print &amp; Issue History
          </h6>
          {printHistoryOf(row).map((entry) => (
            <Tile
              key={entry.title}
              title={entry.title}
              note={entry.note}
              icon="ti ti-printer"
              tint={row.generatedOn ? 'purple' : 'secondary'}
            />
          ))}
        </div>

        <div className="col-xl-3 col-md-6">
          <h6 className="fs-14 mb-3">
            <i className="ti ti-notes text-warning me-1" />
            Internal Notes
          </h6>
          <div className="d-flex align-items-center flex-wrap gap-2 mb-2">
            <span className={`badge badge-soft-${REASON_TINT[row.reason]}`}>{row.reason}</span>
            <span className={`badge badge-soft-${clearanceTint(clearanceStatusOf(row))}`}>
              Clearance {clearanceStatusOf(row)}
            </span>
          </div>
          <p className="fs-13 text-muted">{row.notes}</p>
          <p className="fs-12 text-muted">
            {heldByOf(row) ? `Held by ${heldByOf(row)}.` : `${DEPARTMENTS.length} of ${DEPARTMENTS.length} signed off.`}
          </p>
          <div className="d-flex align-items-center flex-wrap gap-2">
            {detailActionsOf(row).map((action) => (
              <ActionLink
                key={action.label}
                className={
                  action.primary
                    ? 'btn btn-primary btn-sm d-inline-flex align-items-center'
                    : 'btn btn-outline-light bg-white btn-sm d-inline-flex align-items-center'
                }
                onClick={() => openModal(row, action.modal)}
              >
                <i className={`${action.icon} me-1`} />
                {action.label}
              </ActionLink>
            ))}
            <ActionLink
              className="btn btn-outline-light bg-white btn-sm d-inline-flex align-items-center"
              onClick={() => openPanel(row)}
            >
              <i className="ti ti-file-export me-1" />
              TC Panel
            </ActionLink>
          </div>
        </div>
      </div>
    ),
    [openModal, openPanel],
  );

  const rowActions = useCallback(
    (row: Request) => (
      <div className="dt-actions">
        <ActionLink className="dt-ib" ariaLabel="View request" onClick={() => openModal(row, 'view')}>
          <i className="ti ti-eye" />
        </ActionLink>
        <ActionLink
          className="dt-ib"
          ariaLabel="Verify clearance"
          onClick={() => openModal(row, 'clearance')}
        >
          <i className="ti ti-checklist" />
        </ActionLink>
        <ActionLink
          className="dt-ib success"
          ariaLabel="Approve or reject"
          onClick={() => openModal(row, 'approve')}
        >
          <i className="ti ti-gavel" />
        </ActionLink>
        <ActionLink
          className="dt-ib"
          ariaLabel="Generate certificate"
          onClick={() => openModal(row, 'generate')}
        >
          <i className="ti ti-file-certificate" />
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
            title="Transfer Certificate"
            section="Students"
            dashboardTo={routes.adminDashboard}
            actions={
              <>
                <div className="me-2 mb-2">
                  <ExportMenu
                    printLabel="Print TC Register"
                    onExport={(format: ExportFormat) => {
                      push(`Transfer certificate register exported as ${format.toUpperCase()}`);
                    }}
                  />
                </div>
                <div className="mb-2">
                  <ActionLink
                    className="btn btn-primary d-flex align-items-center"
                    onClick={() => openModal(null, 'new')}
                  >
                    <i className="ti ti-square-rounded-plus me-2" />
                    New TC Request
                  </ActionLink>
                </div>
              </>
            }
          />

          <WorkspaceShell
            workspace={workspace}
            columns={columns}
            getId={(row) => row.tcNumber}
            totalCount={TOTAL_REQUESTS}
            workspaceId="transfer-certificate"
            searchPlaceholder="Search TC number, student or admission number…"
            searchLabel="Search transfer certificate requests"
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
            emptyBody="Clear a filter or widen the leaving reason to see more requests."
            summary={summary}
          />
        </div>
      </div>

      <TransferModals
        active={activeModal}
        onClose={() => setActiveModal(null)}
        row={modalRow}
        panelOpen={panelOpen}
        onClosePanel={() => setPanelOpen(false)}
        onToast={push}
      />

      <ToastStack toasts={toasts} onDismiss={dismiss} id="transferCertificateToasts" />
    </>
  );
};

export default TransferCertificate;
