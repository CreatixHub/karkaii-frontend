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
import CompetitionModals from './modals/CompetitionModals';
import type { CompetitionModalId } from './modals/CompetitionModals';
import type { Competition } from './data/competitions.data';
import {
  ACADEMIC_YEAR,
  academicYearOptions,
  capacityPctOf,
  CATEGORY_META,
  categoryOptions,
  competitions as seededCompetitions,
  coordinatorOptions,
  countByStatus,
  dateLabelOf,
  durationLabelOf,
  eventTypeOptions,
  isUpcomingOf,
  participantsLabelOf,
  relativeLabelOf,
  searchIndexOf,
  statusNoteOf,
  statusOf,
  statusOptions,
  statusPill,
  TOTAL_COMPETITIONS,
  TOTAL_PARTICIPANTS,
  UPCOMING_EVENTS,
  ONGOING_EVENTS,
  COMPLETED_EVENTS,
  venueOptions,
} from './data/competitions.data';

const routes = all_routes;

const filterFields: FilterField[] = [
  { id: 'category', label: 'Competition Category', kind: 'select', chipLabel: 'Category', options: categoryOptions },
  { id: 'type', label: 'Event Type', kind: 'select', chipLabel: 'Type', options: eventTypeOptions },
  {
    id: 'year',
    label: 'Academic Year',
    kind: 'select',
    chipLabel: 'Year',
    options: academicYearOptions,
    defaultValue: '',
    initialValue: ACADEMIC_YEAR,
  },
  { id: 'status', label: 'Competition Status', kind: 'select', chipLabel: 'Status', options: statusOptions },
  { id: 'venue', label: 'Venue', kind: 'select', chipLabel: 'Venue', options: venueOptions },
  { id: 'coordinator', label: 'Coordinator', kind: 'select', chipLabel: 'Coordinator', options: coordinatorOptions },
  { id: 'from', label: 'From Date', kind: 'date', chipLabel: 'From' },
  { id: 'to', label: 'To Date', kind: 'date', chipLabel: 'To' },
];

const sortOptions: SortOption[] = [
  { id: 'id', label: 'Competition ID', icon: 'ti ti-hash' },
  { id: 'name', label: 'Competition name (A–Z)', icon: 'ti ti-abc' },
  { id: 'date', label: 'Event date', icon: 'ti ti-calendar' },
  { id: 'participants', label: 'Participants', icon: 'ti ti-users' },
  { id: 'status', label: 'Status', icon: 'ti ti-flag' },
];

const savedViews: SavedView[] = [
  { id: 'all', label: 'All Competitions', icon: 'ti ti-layout-list', count: TOTAL_COMPETITIONS },
  { id: 'upcoming', label: 'Upcoming Events', icon: 'ti ti-calendar-event', count: UPCOMING_EVENTS },
  { id: 'open', label: 'Registration Open', icon: 'ti ti-user-plus', count: 4 },
  { id: 'awaited', label: 'Results Awaited', icon: 'ti ti-trophy', count: 2 },
  { id: 'certificates', label: 'Certificates Pending', icon: 'ti ti-certificate', count: 5 },
];

const Competitions = () => {
  const [rows, setRows] = useState<Competition[]>(seededCompetitions);
  const [openMenu, setOpenMenu] = useState<WorkspaceMenu>(null);
  const [activeModal, setActiveModal] = useState<CompetitionModalId | null>(null);
  const [modalRow, setModalRow] = useState<Competition | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);

  const { toasts, push, dismiss } = useToasts();

  const openModal = useCallback((row: Competition | null, modal: CompetitionModalId) => {
    setModalRow(row);
    setActiveModal(modal);
  }, []);

  const openPanel = useCallback((row: Competition) => {
    setModalRow(row);
    setPanelOpen(true);
  }, []);

  /* --------------------------------- Columns -------------------------------- */

  const columns = useMemo<ColumnDef<Competition>[]>(
    () => [
      {
        id: 'id',
        label: 'Competition ID',
        sortable: true,
        toggleable: false,
        render: (row) => (
          <ActionLink className="fw-medium" onClick={() => openPanel(row)}>
            {row.id}
          </ActionLink>
        ),
      },
      {
        id: 'name',
        label: 'Competition Name',
        sortable: true,
        toggleable: false,
        render: (row) => {
          const meta = CATEGORY_META[row.category];
          return (
            <div className="dt-user">
              <span
                className={`avatar avatar-md bg-${meta.tint}-transparent text-${meta.tint} rounded flex-shrink-0 me-2`}
              >
                <i className={meta.icon} />
              </span>
              <div>
                <ActionLink className="dt-name" onClick={() => openModal(row, 'view')}>
                  {row.name}
                </ActionLink>
                <div className="dt-sub flex-nowrap text-nowrap">
                  {row.coordinator} · {durationLabelOf(row)}
                </div>
              </div>
            </div>
          );
        },
      },
      {
        id: 'category',
        label: 'Category',
        sortable: true,
        render: (row) => (
          <span className={`badge badge-soft-${CATEGORY_META[row.category].tint}`}>
            <i className={`${CATEGORY_META[row.category].icon} me-1`} />
            {row.category}
          </span>
        ),
      },
      {
        id: 'type',
        label: 'Event Type',
        sortable: true,
        render: (row) => <span className="badge badge-soft-warning">{row.eventType}</span>,
      },
      {
        id: 'date',
        label: 'Event Date',
        sortable: true,
        render: (row) => (
          <>
            <span className="d-block fs-13 fw-medium text-nowrap">{dateLabelOf(row)}</span>
            <span className="fs-12 text-muted d-block text-nowrap">{durationLabelOf(row)}</span>
            <span className="fs-12 text-muted text-nowrap">{relativeLabelOf(row)}</span>
          </>
        ),
      },
      {
        id: 'venue',
        label: 'Venue',
        cellClassName: 'text-nowrap',
        render: (row) => (
          <>
            <span className="fs-13 fw-medium d-block">{row.venue}</span>
            <span className="fs-12 text-muted">{row.venueNote}</span>
          </>
        ),
      },
      {
        id: 'participants',
        label: 'Participants',
        sortable: true,
        render: (row) => {
          const pct = capacityPctOf(row);
          return (
            <>
              <span className="d-block fs-13 fw-medium text-nowrap">
                {participantsLabelOf(row)}
              </span>
              <span className="fs-12 text-muted d-block text-nowrap">
                {row.groups === 0 ? 'Registration not open' : `${row.groups} groups entered`}
              </span>
              {pct !== null ? (
                <span className="fs-12 text-muted text-nowrap">{pct}% of capacity</span>
              ) : null}
            </>
          );
        },
      },
      {
        id: 'coordinator',
        label: 'Coordinator',
        cellClassName: 'text-nowrap',
        render: (row) => (
          <>
            <span className="fs-13 fw-medium d-block">{row.coordinator}</span>
            <span className="fs-12 text-muted">{row.coordinatorRole}</span>
          </>
        ),
      },
      {
        id: 'status',
        label: 'Status',
        render: (row) => {
          const status = statusOf(row);
          return (
            <>
              <span className={`dt-pill ${statusPill(status)}`}>
                <span className="dt-pill-dot" />
                {status}
              </span>
              <span className="d-block fs-12 text-muted mt-1 text-nowrap">
                {statusNoteOf(row)}
              </span>
            </>
          );
        },
      },
    ],
    [openModal, openPanel],
  );

  /* --------------------------------- Filters -------------------------------- */

  const quickFilters = useMemo<QuickFilter[]>(
    () => [
      { id: 'all', label: 'All', icon: 'ti ti-layout-list', count: TOTAL_COMPETITIONS },
      { id: 'upcoming', label: 'Upcoming', icon: 'ti ti-calendar-event', count: rows.filter(isUpcomingOf).length },
      { id: 'ongoing', label: 'Ongoing', icon: 'ti ti-player-play', count: countByStatus(rows, 'Ongoing') },
      { id: 'completed', label: 'Completed', icon: 'ti ti-circle-check', count: countByStatus(rows, 'Completed') },
      { id: 'drafts', label: 'Drafts', icon: 'ti ti-pencil', count: countByStatus(rows, 'Draft') },
      { id: 'cancelled', label: 'Cancelled', icon: 'ti ti-ban', count: countByStatus(rows, 'Cancelled') },
    ],
    [rows],
  );

  const workspace = useWorkspace<Competition>({
    rows,
    filterFields,
    columns,
    getId: (row) => row.id,
    search: (row, term) => searchIndexOf(row).includes(term),
    matches: (row, filters) => {
      if (filters.category && row.category !== filters.category) return false;
      if (filters.type && row.eventType !== filters.type) return false;
      if (filters.status && statusOf(row) !== filters.status) return false;
      if (filters.venue && !row.venue.startsWith(filters.venue)) return false;
      if (filters.coordinator && row.coordinator !== filters.coordinator) return false;
      return true;
    },
    quickMatch: (row, quick) => {
      if (!quick || quick === 'all') return true;
      if (quick === 'upcoming') return isUpcomingOf(row);
      if (quick === 'ongoing') return statusOf(row) === 'Ongoing';
      if (quick === 'completed') return statusOf(row) === 'Completed';
      if (quick === 'drafts') return statusOf(row) === 'Draft';
      if (quick === 'cancelled') return statusOf(row) === 'Cancelled';
      return true;
    },
    compare: (a, b, sort) => {
      if (sort === 'name') return a.name.localeCompare(b.name);
      if (sort === 'date') return a.startsOn.localeCompare(b.startsOn);
      if (sort === 'participants') return (b.entrants ?? 0) - (a.entrants ?? 0);
      if (sort === 'status') return statusOf(a).localeCompare(statusOf(b));
      return a.id.localeCompare(b.id);
    },
    defaultSort: 'id',
    defaultQuick: 'all',
    pageSize: 8,
  });

  /* --------------------------------- Summary -------------------------------- */

  /**
   * The strip counts the whole calendar, not the eight events the grid shows,
   * so the four totals are register figures. The completed share is derived
   * against the total rather than written out twice.
   */
  const summary: SummaryItem[] = [
    {
      id: 'total',
      tint: 'primary',
      icon: 'ti ti-trophy',
      label: 'Total Competitions',
      value: String(TOTAL_COMPETITIONS),
      hint: `academic year ${ACADEMIC_YEAR}`,
    },
    {
      id: 'upcoming',
      tint: 'info',
      icon: 'ti ti-calendar-event',
      label: 'Upcoming Events',
      value: String(UPCOMING_EVENTS),
      hint: 'scheduled and open',
    },
    {
      id: 'ongoing',
      tint: 'warning',
      icon: 'ti ti-player-play',
      label: 'Ongoing Competitions',
      value: String(ONGOING_EVENTS),
      hint: 'running right now',
    },
    {
      id: 'completed',
      tint: 'success',
      icon: 'ti ti-circle-check',
      label: 'Completed Events',
      value: String(COMPLETED_EVENTS),
      hint: `of ${TOTAL_COMPETITIONS} on the calendar`,
    },
    {
      id: 'participants',
      tint: 'purple',
      icon: 'ti ti-users',
      label: 'Total Participants',
      value: TOTAL_PARTICIPANTS.toLocaleString('en-IN'),
      hint: 'entries across all events',
    },
  ];

  const renderDetail = useCallback(
    (row: Competition) => (
      <div className="row g-4">
        <div className="col-md-4">
          <h6 className="fs-14 mb-2">Event</h6>
          <p className="fs-13 text-muted mb-1">{dateLabelOf(row)}</p>
          <p className="fs-13 text-muted mb-1">{durationLabelOf(row)}</p>
          <p className="fs-13 text-muted mb-0">{row.venue}</p>
        </div>
        <div className="col-md-4">
          <h6 className="fs-14 mb-2">Entries</h6>
          <p className="fs-13 text-muted mb-1">{participantsLabelOf(row)} registered</p>
          <p className="fs-13 text-muted mb-1">{row.groups} groups</p>
          <p className="fs-13 text-muted mb-0">{capacityPctOf(row) ?? 0}% of capacity</p>
        </div>
        <div className="col-md-4">
          <h6 className="fs-14 mb-2">Results</h6>
          {row.placements.length === 0 ? (
            <p className="fs-13 text-muted mb-0">Not yet recorded.</p>
          ) : (
            row.placements.map((placement) => (
              <p className="fs-13 text-muted mb-1" key={placement.place}>
                {placement.place} · {placement.student} ({placement.className}) — {placement.score}/
                {placement.outOf}
              </p>
            ))
          )}
        </div>
      </div>
    ),
    [],
  );

  const rowActions = useCallback(
    (row: Competition) => (
      <div className="dt-actions">
        <ActionLink className="dt-ib" ariaLabel="View competition" onClick={() => openModal(row, 'view')}>
          <i className="ti ti-eye" />
        </ActionLink>
        <ActionLink className="dt-ib" ariaLabel="Edit competition" onClick={() => openModal(row, 'edit')}>
          <i className="ti ti-edit" />
        </ActionLink>
        <ActionLink
          className="dt-ib success"
          ariaLabel="Register participants"
          onClick={() => openModal(row, 'register')}
        >
          <i className="ti ti-user-plus" />
        </ActionLink>
        <ActionLink className="dt-ib" ariaLabel="Assign judges" onClick={() => openModal(row, 'judges')}>
          <i className="ti ti-gavel" />
        </ActionLink>
        <ActionLink
          className="dt-ib"
          ariaLabel="Publish results"
          onClick={() => openModal(row, 'publish')}
        >
          <i className="ti ti-send" />
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
            title="Competitions"
            section="Students"
            dashboardTo={routes.adminDashboard}
            actions={
              <>
                <div className="me-2 mb-2">
                  <ActionLink
                    className="btn btn-outline-light bg-white fw-medium d-inline-flex align-items-center"
                    onClick={() => openModal(null, 'publish')}
                  >
                    <i className="ti ti-send me-2" />
                    Publish Results
                  </ActionLink>
                </div>
                <div className="me-2 mb-2">
                  <ExportMenu
                    printLabel="Print Competition List"
                    onExport={(format: ExportFormat) => {
                      push(`Competitions exported as ${format.toUpperCase()}`);
                    }}
                  />
                </div>
                <div className="mb-2">
                  <ActionLink
                    className="btn btn-primary d-flex align-items-center"
                    onClick={() => openModal(null, 'create')}
                  >
                    <i className="ti ti-square-rounded-plus me-2" />
                    Add Competition
                  </ActionLink>
                </div>
              </>
            }
          />

          <WorkspaceShell
            workspace={workspace}
            columns={columns}
            getId={(row) => row.id}
            totalCount={TOTAL_COMPETITIONS}
            workspaceId="competitions"
            searchPlaceholder="Competition, category, venue or coordinator…"
            searchLabel="Search competitions"
            savedViews={savedViews}
            filterFields={filterFields}
            quickFilters={quickFilters}
            sortOptions={sortOptions}
            noun="competitions"
            openMenu={openMenu}
            onOpenMenu={setOpenMenu}
            footerVariant="card-foot"
            pageSizeOptions={[8, 25, 50, 100]}
            footerInfoSuffix={`academic year ${ACADEMIC_YEAR}`}
            onRefresh={() => {
              setRows(seededCompetitions);
              push('Competitions refreshed');
            }}
            onSaveView={() => push('Current view saved')}
            onToast={push}
            renderDetail={renderDetail}
            renderActions={rowActions}
            emptyIcon="ti ti-trophy-off"
            emptyTitle="No competitions match your filters"
            emptyBody="Clear a filter or widen the category to see more competitions."
            summary={summary}
          />
        </div>
      </div>

      <CompetitionModals
        active={activeModal}
        onClose={() => setActiveModal(null)}
        row={modalRow}
        rows={workspace.visible}
        panelOpen={panelOpen}
        onClosePanel={() => setPanelOpen(false)}
        onToast={push}
      />

      <ToastStack toasts={toasts} onDismiss={dismiss} id="competitionsToasts" />
    </>
  );
};

export default Competitions;
