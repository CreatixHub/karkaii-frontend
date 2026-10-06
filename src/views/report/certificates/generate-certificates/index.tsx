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
import GenerationModals from './modals/GenerationModals';
import type { GenerationModalId } from './modals/GenerationModals';
import type { Job } from './data/generation.data';
import {
  ACADEMIC_YEAR,
  academicYearOptions,
  agoOf,
  atCounterOf,
  AWAITING_PRINT,
  certificateTypeOptions,
  certificatesLabelOf,
  countAwaitingPrint,
  countByGeneration,
  countGeneratedOn,
  countIssued,
  detailActionsOf,
  FAILED_RUNS,
  GENERATED_TODAY,
  generatedByNoteOf,
  generatedOnNoteOf,
  generationNoteOf,
  generationPill,
  generationStatusOf,
  generationStatusOptions,
  issueBadge,
  issueEmptyNoteOf,
  issueNoteOf,
  issueStatusOf,
  issueStatusOptions,
  ISSUED_TOTAL,
  jobs as seededJobs,
  PENDING_APPROVAL,
  previewEmptyNoteOf,
  previewLineOf,
  printBadge,
  printNoteOf,
  printStatusOf,
  printStatusOptions,
  PRINTED_NOT_ISSUED,
  READY_TO_GENERATE,
  recipientsLabelOf,
  recipientTypeOptions,
  remainingLabelOf,
  RUN_DATE,
  searchIndexOf,
  shareOf,
  TOTAL_JOBS,
  TYPE_META,
} from './data/generation.data';

const routes = all_routes;

const filterFields: FilterField[] = [
  {
    id: 'type',
    label: 'Certificate Type',
    kind: 'select',
    chipLabel: 'Type',
    options: certificateTypeOptions,
  },
  {
    id: 'recipient',
    label: 'Recipient Type',
    kind: 'select',
    chipLabel: 'Recipient',
    options: recipientTypeOptions,
  },
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
    id: 'generation',
    label: 'Generation Status',
    kind: 'select',
    chipLabel: 'Generation',
    options: generationStatusOptions,
  },
  {
    id: 'print',
    label: 'Print Status',
    kind: 'select',
    chipLabel: 'Print',
    options: printStatusOptions,
  },
  {
    id: 'issue',
    label: 'Issue Status',
    kind: 'select',
    chipLabel: 'Issue',
    options: issueStatusOptions,
  },
  { id: 'from', label: 'From Date', kind: 'date', chipLabel: 'From', defaultValue: '01-07-2026' },
  { id: 'to', label: 'To Date', kind: 'date', chipLabel: 'To', defaultValue: '31-07-2026' },
];

const sortOptions: SortOption[] = [
  { id: 'ref', label: 'Job reference', icon: 'ti ti-hash' },
  { id: 'recipient', label: 'Recipient (A–Z)', icon: 'ti ti-abc' },
  { id: 'generated', label: 'Generated on', icon: 'ti ti-calendar-event' },
  { id: 'recipients', label: 'Recipients in the job', icon: 'ti ti-users' },
  { id: 'print', label: 'Print completion', icon: 'ti ti-printer' },
];

const savedViews: SavedView[] = [
  { id: 'all', label: 'All Jobs', icon: 'ti ti-layout-list', count: TOTAL_JOBS },
  { id: 'ready', label: 'Ready to Generate', icon: 'ti ti-player-play', count: READY_TO_GENERATE },
  { id: 'print', label: 'Awaiting Print', icon: 'ti ti-printer', count: AWAITING_PRINT },
  { id: 'unissued', label: 'Printed, Not Issued', icon: 'ti ti-inbox', count: PRINTED_NOT_ISSUED },
  { id: 'failed', label: 'Failed Runs', icon: 'ti ti-alert-triangle', count: FAILED_RUNS },
];

/**
 * The strip counts all 268 jobs, and the grid carries eight, so the five totals
 * are register figures. The issued share is read against the total rather than
 * typed a second time.
 */
const summary: SummaryItem[] = [
  {
    id: 'total',
    tint: 'primary',
    icon: 'ti ti-certificate',
    label: 'Total Certificates',
    value: String(TOTAL_JOBS),
    hint: `academic year ${ACADEMIC_YEAR}`,
  },
  {
    id: 'ready',
    tint: 'info',
    icon: 'ti ti-player-play',
    label: 'Ready to Generate',
    value: String(READY_TO_GENERATE),
    hint: 'approved, awaiting a run',
  },
  {
    id: 'today',
    tint: 'purple',
    icon: 'ti ti-file-check',
    label: 'Generated Today',
    value: String(GENERATED_TODAY),
    hint: RUN_DATE,
  },
  {
    id: 'issued',
    tint: 'success',
    icon: 'ti ti-circle-check',
    label: 'Issued',
    value: String(ISSUED_TOTAL),
    hint: `${shareOf(ISSUED_TOTAL, TOTAL_JOBS)}% of the register`,
  },
  {
    id: 'pending',
    tint: 'warning',
    icon: 'ti ti-clock',
    label: 'Pending Approval',
    value: String(PENDING_APPROVAL),
    hint: 'held before generation',
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

const GenerateCertificates = () => {
  const [rows, setRows] = useState<Job[]>(seededJobs);
  const [openMenu, setOpenMenu] = useState<WorkspaceMenu>(null);
  const [activeModal, setActiveModal] = useState<GenerationModalId | null>(null);
  const [modalRow, setModalRow] = useState<Job | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);

  const { toasts, push, dismiss } = useToasts();

  const openModal = useCallback((row: Job | null, modal: GenerationModalId) => {
    setModalRow(row);
    setActiveModal(modal);
  }, []);

  const openPanel = useCallback((row: Job) => {
    setModalRow(row);
    setPanelOpen(true);
  }, []);

  const columns = useMemo<ColumnDef<Job>[]>(
    () => [
      {
        id: 'recipient',
        label: 'Student / Recipient',
        sortable: true,
        toggleable: false,
        render: (row) => {
          const meta = TYPE_META[row.certificateType];
          return (
            <div className="dt-user">
              <span
                className={`avatar avatar-md bg-${meta.tint}-transparent text-${meta.tint} rounded flex-shrink-0 me-2`}
              >
                <i className={row.recipients === 1 ? 'ti ti-user' : 'ti ti-users'} />
              </span>
              <div>
                <ActionLink className="dt-name" onClick={() => openModal(row, 'view')}>
                  {row.recipient}
                </ActionLink>
                <div className="dt-sub flex-nowrap text-nowrap">
                  {row.ref} · {recipientsLabelOf(row)}
                </div>
              </div>
            </div>
          );
        },
      },
      {
        id: 'type',
        label: 'Certificate Type',
        sortable: true,
        cellClassName: 'text-nowrap',
        render: (row) => {
          const meta = TYPE_META[row.certificateType];
          return (
            <>
              <span className={`badge badge-soft-${meta.tint}`}>
                <i className={`${meta.icon} me-1`} />
                {row.certificateType}
              </span>
              <span className="d-block fs-12 text-muted mt-1">{row.sourceRecord}</span>
            </>
          );
        },
      },
      {
        id: 'template',
        label: 'Template',
        sortable: true,
        cellClassName: 'text-nowrap',
        render: (row) => (
          <>
            <span className="fs-13 fw-medium d-block">{row.template}</span>
            <span className="fs-12 text-muted">Recipient: {row.recipientType}</span>
          </>
        ),
      },
      {
        id: 'year',
        label: 'Academic Year',
        render: () => <span className="badge badge-soft-secondary">{ACADEMIC_YEAR}</span>,
      },
      {
        id: 'generatedBy',
        label: 'Generated By',
        sortable: true,
        cellClassName: 'text-nowrap',
        render: (row) => (
          <>
            <span className="fs-13 fw-medium d-block">{row.generatedBy ?? '—'}</span>
            <span className="fs-12 text-muted">{generatedByNoteOf(row)}</span>
          </>
        ),
      },
      {
        id: 'generatedOn',
        label: 'Generated On',
        sortable: true,
        render: (row) => (
          <>
            <span className="d-block fs-13 fw-medium text-nowrap">{row.generatedOn ?? '—'}</span>
            <span className="fs-12 text-muted d-block text-nowrap">{generatedOnNoteOf(row)}</span>
            {row.generatedOn ? (
              <span className="fs-12 text-muted text-nowrap">{certificatesLabelOf(row)}</span>
            ) : null}
          </>
        ),
      },
      {
        id: 'print',
        label: 'Print Status',
        render: (row) => {
          const status = printStatusOf(row);
          return (
            <>
              <span className={`badge badge-soft-${printBadge(status)}`}>{status}</span>
              <span className="d-block fs-12 text-muted mt-1 text-nowrap">{printNoteOf(row)}</span>
            </>
          );
        },
      },
      {
        id: 'issue',
        label: 'Issue Status',
        render: (row) => {
          const status = issueStatusOf(row);
          return (
            <>
              <span className={`badge badge-soft-${issueBadge(status)}`}>{status}</span>
              <span className="d-block fs-12 text-muted mt-1 text-nowrap">{issueNoteOf(row)}</span>
            </>
          );
        },
      },
      {
        id: 'generation',
        label: 'Generation Status',
        render: (row) => {
          const status = generationStatusOf(row);
          return (
            <>
              <span className={`dt-pill ${generationPill(status)}`}>
                <span className="dt-pill-dot" />
                {status}
              </span>
              <span className="d-block fs-12 text-muted mt-1 text-nowrap">
                {generationNoteOf(row)}
              </span>
            </>
          );
        },
      },
    ],
    [openModal],
  );

  const quickFilters = useMemo<QuickFilter[]>(
    () => [
      { id: 'all', label: 'All', icon: 'ti ti-layout-list', count: TOTAL_JOBS },
      {
        id: 'ready',
        label: 'Ready',
        icon: 'ti ti-player-play',
        count: countByGeneration(rows, 'Ready to Generate'),
      },
      {
        id: 'today',
        label: 'Today',
        icon: 'ti ti-file-check',
        count: countGeneratedOn(rows, RUN_DATE),
      },
      {
        id: 'print',
        label: 'Awaiting Print',
        icon: 'ti ti-printer',
        count: countAwaitingPrint(rows),
      },
      { id: 'issued', label: 'Issued', icon: 'ti ti-circle-check', count: countIssued(rows) },
      {
        id: 'pending',
        label: 'Pending',
        icon: 'ti ti-clock',
        count: countByGeneration(rows, 'Pending Approval'),
      },
    ],
    [rows],
  );

  const workspace = useWorkspace<Job>({
    rows,
    filterFields,
    columns,
    getId: (row) => row.ref,
    search: (row, term) => searchIndexOf(row).includes(term),
    matches: (row, filters) => {
      if (filters.type && row.certificateType !== filters.type) return false;
      if (filters.recipient && row.recipientType !== filters.recipient) return false;
      if (filters.generation && generationStatusOf(row) !== filters.generation) return false;
      if (filters.print && printStatusOf(row) !== filters.print) return false;
      if (filters.issue && issueStatusOf(row) !== filters.issue) return false;
      return true;
    },
    quickMatch: (row, quick) => {
      if (!quick || quick === 'all') return true;
      if (quick === 'ready') return generationStatusOf(row) === 'Ready to Generate';
      if (quick === 'today') return row.generatedOn === RUN_DATE;
      if (quick === 'print') return row.generatedOn !== null && row.printed < row.recipients;
      if (quick === 'issued') return issueStatusOf(row) === 'Issued';
      if (quick === 'pending') return generationStatusOf(row) === 'Pending Approval';
      return true;
    },
    compare: (a, b, sort) => {
      if (sort === 'recipient') return a.recipient.localeCompare(b.recipient);
      if (sort === 'generated') return (b.generatedOn ?? '').localeCompare(a.generatedOn ?? '');
      if (sort === 'recipients') return b.recipients - a.recipients;
      if (sort === 'print') return shareOf(b.printed, b.recipients) - shareOf(a.printed, a.recipients);
      return a.ref.localeCompare(b.ref);
    },
    defaultSort: 'ref',
    defaultQuick: 'all',
    pageSize: 8,
  });

  const renderDetail = useCallback(
    (row: Job) => {
      const meta = TYPE_META[row.certificateType];
      return (
        <div className="row g-4">
          <div className="col-xl-3 col-md-6">
            <h6 className="fs-14 mb-3">
              <i className="ti ti-users text-primary me-1" />
              Recipient Information
            </h6>
            <Line label="Job Reference" value={row.ref} />
            <Line label="Recipient" value={row.recipient} />
            <Line label="Recipient Type" value={row.recipientType} />
            <Line label="Scope" value={row.scope} />
            <Line label="Recipients" value={certificatesLabelOf(row)} />
            <Line label="Source Record" value={row.sourceRecord} last />
          </div>

          <div className="col-xl-3 col-md-6">
            <h6 className="fs-14 mb-3">
              <i className="ti ti-certificate text-warning me-1" />
              Certificate Preview
            </h6>
            <div className="border rounded p-3">
              {row.generatedOn ? (
                <>
                  <div className="d-flex align-items-center gap-2 mb-3 pb-2 border-bottom">
                    <span
                      className={`avatar avatar-md bg-${meta.tint}-transparent text-${meta.tint} rounded flex-shrink-0`}
                    >
                      <i className={meta.icon} />
                    </span>
                    <div className="overflow-hidden">
                      <h6 className="fs-13 mb-0">Karkaii School</h6>
                      <span className="fs-12 text-muted">
                        {row.certificateType} · {ACADEMIC_YEAR}
                      </span>
                    </div>
                  </div>
                  <p className="fs-13 text-muted mb-3">
                    Generated for <b className="text-dark">{row.recipient}</b> — {previewLineOf(row)}
                  </p>
                  <Line label="Generated On" value={row.generatedOn} />
                  <Line label="Signed By" value={row.signatory ?? 'Not yet assigned'} last />
                  <div className="d-flex align-items-center gap-2 border-top pt-2 mt-2">
                    <span className="avatar avatar-sm bg-secondary-transparent text-secondary rounded flex-shrink-0">
                      <i className="ti ti-qrcode" />
                    </span>
                    <span className="fs-12 text-muted text-truncate">
                      {row.ref} · {row.printed} {row.printed === 1 ? 'copy' : 'copies'}
                    </span>
                  </div>
                </>
              ) : (
                <div className="text-center py-3">
                  <span className="avatar avatar-md bg-secondary-transparent text-secondary rounded mb-2">
                    <i className="ti ti-file-off" />
                  </span>
                  <h6 className="fs-13 mb-1">No certificate generated</h6>
                  <span className="fs-12 text-muted">{previewEmptyNoteOf(row)}</span>
                </div>
              )}
            </div>
          </div>

          <div className="col-xl-3 col-md-6">
            <h6 className="fs-14 mb-3">
              <i className="ti ti-layout text-info me-1" />
              Template Details
            </h6>
            <Line label="Certificate Type" value={row.certificateType} />
            <Line label="Template" value={row.template} />
            <Line label="Academic Year" value={ACADEMIC_YEAR} />
            <Line label="Signatory" value={row.signatory ?? 'Not yet assigned'} />
            <Line label="Approved On" value={row.approvedOn ?? 'Not approved'} />
            <Line label="Source Record" value={row.sourceRecord} last />
          </div>

          <div className="col-xl-3 col-md-6">
            <h6 className="fs-14 mb-3">
              <i className="ti ti-player-play text-purple me-1" />
              Generation History
            </h6>
            {row.run ? (
              <>
                <Tile
                  title={row.run.label}
                  note={`${row.run.date} · ${row.run.note}`}
                  icon="ti ti-player-play"
                  tint="info"
                />
                <Line label="Runs" value="1" />
                <Line label="Outcome" value={row.run.outcome} last />
              </>
            ) : (
              <Tile
                title="No run yet"
                note="Approve the job to queue a run"
                icon="ti ti-player-play"
                tint="secondary"
              />
            )}
          </div>

          <div className="col-xl-3 col-md-6">
            <h6 className="fs-14 mb-3">
              <i className="ti ti-printer text-danger me-1" />
              Print History
            </h6>
            {row.printHistory.length > 0 ? (
              <>
                {row.printHistory.map((entry) => (
                  <Tile
                    key={entry.title}
                    title={entry.title}
                    note={entry.note}
                    icon="ti ti-printer"
                    tint="purple"
                  />
                ))}
                <Line label="Printed" value={`${row.printed} of ${row.recipients}`} />
                <Line label="Completion" value={`${shareOf(row.printed, row.recipients)}%`} last />
              </>
            ) : (
              <Tile
                title="Nothing printed yet"
                note="Starts once the job is generated"
                icon="ti ti-printer"
                tint="secondary"
              />
            )}
          </div>

          <div className="col-xl-3 col-md-6">
            <h6 className="fs-14 mb-3">
              <i className="ti ti-circle-check text-success me-1" />
              Issue Timeline
            </h6>
            {row.issueTimeline.length > 0 ? (
              <>
                {row.issueTimeline.map((entry) => (
                  <Tile
                    key={entry.title}
                    title={entry.title}
                    note={entry.note}
                    icon="ti ti-circle-check"
                    tint="success"
                  />
                ))}
                <Line label="Issued" value={`${row.issued} of ${row.recipients}`} />
                <Line
                  label="At the Counter"
                  value={`${atCounterOf(row)} ${atCounterOf(row) === 1 ? 'copy' : 'copies'}`}
                  last
                />
              </>
            ) : (
              <Tile
                title="Not issued yet"
                note={issueEmptyNoteOf(row)}
                icon="ti ti-circle-check"
                tint="secondary"
              />
            )}
          </div>

          <div className="col-xl-3 col-md-6">
            <h6 className="fs-14 mb-3">
              <i className="ti ti-paperclip text-secondary me-1" />
              Attachments
            </h6>
            {row.attachments.map((file) => (
              <Tile
                key={file.name}
                title={file.name}
                note={file.note}
                icon="ti ti-file-type-pdf"
                tint="danger"
              />
            ))}
          </div>

          <div className="col-xl-3 col-md-6">
            <h6 className="fs-14 mb-3">
              <i className="ti ti-notes text-warning me-1" />
              Internal Notes
            </h6>
            <div className="d-flex align-items-center flex-wrap gap-2 mb-2">
              <span className={`badge badge-soft-${meta.tint}`}>{row.certificateType}</span>
              <span className="badge badge-soft-secondary">{recipientsLabelOf(row)}</span>
            </div>
            <p className="fs-13 text-muted">{row.notes}</p>
            <p className="fs-12 text-muted">{remainingLabelOf(row)} left to print.</p>
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
                <i className="ti ti-certificate me-1" />
                Certificate Panel
              </ActionLink>
            </div>
          </div>
        </div>
      );
    },
    [openModal, openPanel],
  );

  const rowActions = useCallback(
    (row: Job) => (
      <div className="dt-actions">
        <ActionLink className="dt-ib" ariaLabel="View details" onClick={() => openModal(row, 'view')}>
          <i className="ti ti-eye" />
        </ActionLink>
        <ActionLink
          className="dt-ib"
          ariaLabel="Preview certificate"
          onClick={() => openModal(row, 'preview')}
        >
          <i className="ti ti-file-description" />
        </ActionLink>
        <ActionLink
          className="dt-ib success"
          ariaLabel="Run generation"
          onClick={() => openModal(row, 'generate')}
        >
          <i className="ti ti-player-play" />
        </ActionLink>
        <ActionLink
          className="dt-ib"
          ariaLabel="Print certificates"
          onClick={() => openModal(row, 'print')}
        >
          <i className="ti ti-printer" />
        </ActionLink>
        <ActionLink
          className="dt-ib"
          ariaLabel="Issue certificates"
          onClick={() => openModal(row, 'issue')}
        >
          <i className="ti ti-circle-check" />
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
            title="Generate Certificates"
            section="Students"
            dashboardTo={routes.adminDashboard}
            actions={
              <>
                <div className="me-2 mb-2">
                  <ActionLink
                    className="btn btn-outline-light bg-white fw-medium d-inline-flex align-items-center"
                    onClick={() => openModal(null, 'template')}
                  >
                    <i className="ti ti-layout me-2" />
                    Select Template
                  </ActionLink>
                </div>
                <div className="me-2 mb-2">
                  <ExportMenu
                    printLabel="Print Generation Log"
                    onExport={(format: ExportFormat) => {
                      push(`Generation log exported as ${format.toUpperCase()}`);
                    }}
                  />
                </div>
                <div className="mb-2">
                  <ActionLink
                    className="btn btn-primary d-flex align-items-center"
                    onClick={() => openModal(null, 'bulk')}
                  >
                    <i className="ti ti-square-rounded-plus me-2" />
                    Generate Certificates
                  </ActionLink>
                </div>
              </>
            }
          />

          <WorkspaceShell
            workspace={workspace}
            columns={columns}
            getId={(row) => row.ref}
            totalCount={TOTAL_JOBS}
            workspaceId="generate-certificates"
            searchPlaceholder="Search recipient, job reference or certificate…"
            searchLabel="Search certificate generation queue"
            savedViews={savedViews}
            filterFields={filterFields}
            quickFilters={quickFilters}
            sortOptions={sortOptions}
            noun="jobs"
            openMenu={openMenu}
            onOpenMenu={setOpenMenu}
            footerVariant="card-foot"
            pageSizeOptions={[8, 25, 50, 100]}
            footerInfoSuffix={`register as at ${agoOf(RUN_DATE).toLowerCase()}`}
            onRefresh={() => {
              setRows(seededJobs);
              push('Generation queue refreshed');
            }}
            onSaveView={() => push('Current view saved')}
            onToast={push}
            renderDetail={renderDetail}
            renderActions={rowActions}
            emptyIcon="ti ti-file-off"
            emptyTitle="No jobs match your filters"
            emptyBody="Clear a filter or widen the certificate type to see more jobs."
            summary={summary}
          />
        </div>
      </div>

      <GenerationModals
        active={activeModal}
        onClose={() => setActiveModal(null)}
        row={modalRow}
        panelOpen={panelOpen}
        onClosePanel={() => setPanelOpen(false)}
        onToast={push}
      />

      <ToastStack toasts={toasts} onDismiss={dismiss} id="generateCertificatesToasts" />
    </>
  );
};

export default GenerateCertificates;
