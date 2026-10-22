import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import ImageWithBasePath from '@core/common/imageWithBasePath';
import ToastStack from '@components/ui/ToastStack';
import {
  ActionLink,
  ExportMenu,
  useWorkspace,
  WorkspaceHeader,
} from '@components/workspace';
import type {
  ColumnDef,
  ExportFormat,
  FilterField,
  QuickFilter,
  SavedView,
  SortOption,
  WorkspaceMenu,
} from '@components/workspace';
import { all_routes } from '@/routes/all_routes';
import { useToasts } from '@hooks/useToasts';
import EventModals from './modals/EventModals';
import type { EventModalId } from './modals/EventModals';
import type { SchoolEvent } from './data/events.data';
import {
  academicYearOptions,
  audienceOptions,
  AVATARS_SHOWN,
  bannerDateOf,
  branchOptions,
  buildMonth,
  capacityLabelOf,
  categoryOptions,
  countByCategory,
  EVENT_ACTIONS,
  EVENTS,
  monthOptions,
  MONTH_LABEL,
  moreParticipantsOf,
  organizerOptions,
  PARTICIPANT_FACES,
  participantsLabelOf,
  QUICK_CATEGORIES,
  registrationOf,
  registrationTint,
  searchIndexOf,
  typeOptions,
  venueOptions,
  WEEKDAYS,
} from './data/events.data';

const routes = all_routes;

const filterFields: FilterField[] = [
  { id: 'category', label: 'Category', kind: 'select', chipLabel: 'Category', options: categoryOptions },
  { id: 'type', label: 'Event Type', kind: 'select', chipLabel: 'Type', options: typeOptions },
  { id: 'audience', label: 'Audience', kind: 'select', chipLabel: 'Audience', options: audienceOptions },
  {
    id: 'organizer',
    label: 'Organizer',
    kind: 'select',
    chipLabel: 'Organizer',
    options: organizerOptions,
  },
  { id: 'venue', label: 'Venue', kind: 'select', chipLabel: 'Venue', options: venueOptions },
  { id: 'branch', label: 'Branch', kind: 'select', chipLabel: 'Branch', options: branchOptions },
  {
    id: 'year',
    label: 'Academic Year',
    kind: 'select',
    chipLabel: 'Year',
    options: academicYearOptions,
  },
  {
    id: 'month',
    label: 'Month',
    kind: 'select',
    chipLabel: 'Month',
    options: monthOptions,
    allLabel: 'Any',
  },
];

const savedViews: SavedView[] = [
  { id: 'all', label: 'All Events', icon: 'ti ti-layout-list', count: EVENTS.length },
  { id: 'sports', label: 'Sports', icon: 'ti ti-run', count: countByCategory(EVENTS, 'sports') },
  {
    id: 'academic',
    label: 'Academic',
    icon: 'ti ti-school',
    count: countByCategory(EVENTS, 'academic'),
  },
  {
    id: 'cultural',
    label: 'Cultural',
    icon: 'ti ti-masks-theater',
    count: countByCategory(EVENTS, 'cultural'),
  },
];

/** The three ways the workspace can show the month. */
const VIEWS: { id: 'calendar' | 'timeline' | 'grid'; label: string; icon: string }[] = [
  { id: 'calendar', label: 'Calendar view', icon: 'ti ti-calendar-month' },
  { id: 'timeline', label: 'Timeline view', icon: 'ti ti-timeline' },
  { id: 'grid', label: 'Grid view', icon: 'ti ti-layout-grid' },
];

const sortOptions: SortOption[] = [
  { id: 'date', label: 'Event date', icon: 'ti ti-calendar-event' },
  { id: 'title', label: 'Event name (A–Z)', icon: 'ti ti-abc' },
  { id: 'participants', label: 'Participants', icon: 'ti ti-users' },
  { id: 'venue', label: 'Venue', icon: 'ti ti-map-pin' },
];

/** The three views share a single set of per-event controls. */
const EventActions = ({
  event,
  onAction,
}: {
  event: SchoolEvent;
  onAction: (id: string, event: SchoolEvent) => void;
}) => (
  <div className="ev-actions">
    <ActionLink
      className="btn btn-icon btn-sm btn-outline-light bg-white"
      title="View Event"
      ariaLabel={`View ${event.id}`}
      onClick={() => onAction('view', event)}
    >
      <i className="ti ti-eye" />
    </ActionLink>
    <ActionLink
      className="btn btn-icon btn-sm btn-outline-light bg-white"
      title="Edit Event"
      ariaLabel={`Edit ${event.id}`}
      onClick={() => onAction('edit', event)}
    >
      <i className="ti ti-edit" />
    </ActionLink>
    <ActionLink
      className="btn btn-icon btn-sm btn-outline-light bg-white"
      title="Manage Registration"
      ariaLabel={`Registration ${event.id}`}
      onClick={() => onAction('registration', event)}
    >
      <i className="ti ti-clipboard-check" />
    </ActionLink>
  </div>
);

const Events = () => {
  const { toasts, push, dismiss } = useToasts();

  const [openMenu, setOpenMenu] = useState<WorkspaceMenu>(null);
  const [fullscreen, setFullscreen] = useState(false);
  /** Which of the three sections the workspace shows; the wrapper class does it. */
  const [view, setView] = useState<'calendar' | 'timeline' | 'grid'>('calendar');
  const [modal, setModal] = useState<EventModalId | null>(null);
  const [target, setTarget] = useState<SchoolEvent | null>(null);
  const [actionsFor, setActionsFor] = useState<string | null>(null);

  const openModal = (id: EventModalId, event: SchoolEvent | null) => {
    setTarget(event);
    setModal(id);
    setActionsFor(null);
  };

  const onAction = (id: string, event: SchoolEvent) => {
    if (id === 'view' || id === 'edit' || id === 'registration') {
      openModal(id as EventModalId, event);
      return;
    }
    if (id === 'participants') return openModal('participants', event);
    if (id === 'agenda') return openModal('agenda', event);
    if (id === 'delete') return openModal('delete', event);
    setActionsFor(null);
    push(`${EVENT_ACTIONS.find((action) => action.id === id)?.label ?? id} · ${event.title}`);
  };

  /* The calendar has no columns, but the workspace hook wants a column set to
     drive its Columns menu; the toolbar hides that menu instead. */
  const columns: ColumnDef<SchoolEvent>[] = useMemo(() => [], []);

  const workspace = useWorkspace<SchoolEvent>({
    rows: EVENTS,
    filterFields,
    columns,
    getId: (event) => event.id,
    search: (event, term) => searchIndexOf(event).includes(term),
    matches: (event, filters) => {
      if (filters.category && event.category !== filters.category) return false;
      if (filters.type && event.type !== filters.type) return false;
      if (filters.audience && event.audience !== filters.audience) return false;
      if (filters.organizer && event.organizer !== filters.organizer) return false;
      if (filters.venue && event.venue !== filters.venue) return false;
      return true;
    },
    quickMatch: (event, quick) => !quick || event.categoryKey === quick,
    viewMatch: (event, view) => view === 'all' || event.categoryKey === view,
    compare: (a, b, sort) => {
      if (sort === 'title') return a.title.localeCompare(b.title);
      if (sort === 'participants') return b.registered - a.registered;
      if (sort === 'venue') return a.venue.localeCompare(b.venue);
      return a.day - b.day;
    },
    defaultSort: 'date',
    pageSize: EVENTS.length,
  });

  const visible = workspace.visible;

  const quickFilters: QuickFilter[] = useMemo(
    () =>
      QUICK_CATEGORIES.map((entry) => ({
        id: entry.id,
        label: entry.label,
        icon: entry.icon,
        count: countByCategory(EVENTS, entry.id),
      })),
    [],
  );

  /** The month is built from whatever survives the filters. */
  const month = useMemo(() => buildMonth(visible), [visible]);

  return (
    <>
      <div className="page-wrapper">
        <div className="content content-two">
          <div className="d-md-flex d-block align-items-center justify-content-between flex-wrap gap-2 mb-3">
            <div className="my-auto mb-2">
              <h3 className="mb-1">Events</h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={routes.adminDashboard}>Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">Announcement</li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Events
                  </li>
                </ol>
              </nav>
            </div>
            <div className="d-flex my-xl-auto right-content align-items-center flex-wrap">
              <div className="me-2 mb-2">
                <ExportMenu
                  small
                  printLabel="Print Events"
                  onExport={(format: ExportFormat) => push(`Events exported as ${format.toUpperCase()}`)}
                />
              </div>
              <div className="mb-2">
                <ActionLink
                  className="btn btn-primary btn-sm d-flex align-items-center"
                  onClick={() => openModal('create', null)}
                >
                  <i className="ti ti-square-rounded-plus me-2" />
                  Create Event
                </ActionLink>
              </div>
            </div>
          </div>

          <div id="eventsWorkspace" className={`is-${view}${fullscreen ? ' ev-fullscreen' : ''}`}>
            <div className="card mb-3">
            <div className="data-workspace classes-workspace is-loaded" data-density="default">
              <WorkspaceHeader
                searchPlaceholder="Search events by name, venue, organizer or category…"
                searchLabel="Search events"
                search={workspace.search}
                onSearch={workspace.setSearch}
                savedViews={savedViews}
                view={workspace.view}
                onView={workspace.setView}
                onSaveView={() => push('Current view saved')}
                filterFields={filterFields}
                draft={workspace.draft}
                onDraftField={workspace.setDraftField}
                onApplyFilters={workspace.applyFilters}
                onResetFilters={workspace.resetFilters}
                matchCount={visible.length}
                totalCount={EVENTS.length}
                matchNoun="events"
                columnOptions={[]}
                columns={workspace.columns}
                onToggleColumn={workspace.toggleColumn}
                onShowAllColumns={workspace.showAllColumns}
                showColumns={false}
                showDensity
                densitySlot={
                  <div className="density-toggle" role="group" aria-label="View mode">
                    {VIEWS.map((entry) => (
                      <button
                        key={entry.id}
                        type="button"
                        className={view === entry.id ? 'active' : undefined}
                        title={entry.label}
                        aria-label={entry.label}
                        onClick={() => setView(entry.id)}
                      >
                        <i className={entry.icon} />
                      </button>
                    ))}
                  </div>
                }
                density={workspace.density}
                onDensity={workspace.setDensity}
                onRefresh={() => push('Events refreshed')}
                fullscreen={fullscreen}
                onFullscreen={() => setFullscreen(!fullscreen)}
                quickFilters={quickFilters}
                quick={workspace.quick}
                onQuick={workspace.toggleQuick}
                sortOptions={sortOptions}
                sort={workspace.sort}
                onSort={workspace.setSort}
                chips={workspace.chips}
                onClearChip={workspace.clearChip}
                openMenu={openMenu}
                onOpenMenu={setOpenMenu}
              />
            </div>
          </div>

          <div className="ev-live">
            <div className="ev-live-body">
              <div className="row g-3">
                <div className="col-12 col-xl-8">
                  {/* ------------------------- Calendar ------------------------ */}
                  <section className="ev-calendar-sec card mb-3 mb-xl-0">
                    <div className="card-body">
                      <div className="ev-cal-head">
                        <div className="ev-sec-head mb-0">
                          <span className="ev-sec-ic">
                            <i className="ti ti-calendar-month" />
                          </span>
                          <div>
                            <div className="ev-sec-title">Event Calendar</div>
                            <div className="ev-sec-sub">Tap an event chip to view details</div>
                          </div>
                        </div>
                        <div className="ev-cal-nav">
                          <button
                            type="button"
                            className="btn btn-icon btn-sm btn-outline-light bg-white"
                            aria-label="Previous month"
                            onClick={() => push('The register holds one month')}
                          >
                            <i className="ti ti-chevron-left" />
                          </button>
                          <span className="ev-cal-month">{MONTH_LABEL}</span>
                          <button
                            type="button"
                            className="btn btn-icon btn-sm btn-outline-light bg-white"
                            aria-label="Next month"
                            onClick={() => push('The register holds one month')}
                          >
                            <i className="ti ti-chevron-right" />
                          </button>
                        </div>
                      </div>
                      <div className="ev-cal">
                        {WEEKDAYS.map((day) => (
                          <div className="ev-dow" key={day}>
                            {day}
                          </div>
                        ))}
                        {month.map((cell, index) => (
                          <div
                            className={`ev-cell${cell.outside ? ' is-out ev-cell-empty' : ''}`}
                            key={`${cell.day}-${index}`}
                          >
                            <span className="ev-daynum">{cell.day}</span>
                            {cell.events.map((event) => (
                              <button
                                type="button"
                                className={`ev-chip cat-${event.categoryKey}`}
                                title={event.title}
                                key={event.id}
                                onClick={() => openModal('view', event)}
                              >
                                <span className="ev-chip-txt">{event.title}</span>
                              </button>
                            ))}
                          </div>
                        ))}
                      </div>
                    </div>
                  </section>

                  {/* ------------------------- Timeline ------------------------ */}
                  <section className="ev-timeline-sec card">
                    <div className="card-body">
                      <div className="ev-sec-head">
                        <span className="ev-sec-ic">
                          <i className="ti ti-timeline" />
                        </span>
                        <div>
                          <div className="ev-sec-title">Event Timeline</div>
                          <div className="ev-sec-sub">Chronological schedule for the month</div>
                        </div>
                      </div>
                      <ul className="ev-tl">
                        {visible.map((event) => {
                          const state = registrationOf(event);
                          return (
                            <li
                              className={`ev-tl-item cat-${event.categoryKey}`}
                              key={event.id}
                              tabIndex={0}
                              role="button"
                              aria-label={`Open event ${event.title}`}
                              onClick={() => openModal('view', event)}
                              onKeyDown={(keyEvent) => {
                                if (keyEvent.key !== 'Enter' && keyEvent.key !== ' ') return;
                                keyEvent.preventDefault();
                                openModal('view', event);
                              }}
                            >
                              <span className="ev-tl-dot" />
                              <div className="ev-tl-card">
                                <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
                                  <div>
                                    <span className="badge badge-soft-secondary mb-1">
                                      <i className={`${event.icon} me-1`} />
                                      {event.category}
                                    </span>
                                    <h4 className="mb-0 fs-15 fw-medium">{event.title}</h4>
                                  </div>
                                  <span className={`badge badge-soft-${registrationTint(state)}`}>
                                    {state}
                                  </span>
                                </div>
                                <div className="d-flex flex-wrap gap-3 fs-12 text-muted mt-2">
                                  <span>
                                    <i className="ti ti-calendar-event me-1" />
                                    {event.date}
                                  </span>
                                  <span>
                                    <i className="ti ti-clock me-1" />
                                    {event.time}
                                  </span>
                                  <span>
                                    <i className="ti ti-map-pin me-1" />
                                    {event.venue}
                                  </span>
                                  <span>
                                    <i className="ti ti-users me-1" />
                                    {participantsLabelOf(event)}
                                  </span>
                                </div>
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </section>
                </div>

                {/* --------------------- Upcoming feed ----------------------- */}
                <div className="col-12 col-xl-4 ev-events-sec">
                  <div className="ev-sec-head ev-events-title">
                    <span className="ev-sec-ic">
                      <i className="ti ti-calendar-star" />
                    </span>
                    <div>
                      <div className="ev-sec-title">Upcoming Events</div>
                      <div className="ev-sec-sub">{visible.length} events scheduled</div>
                    </div>
                  </div>
                  <div className="ev-feed">
                    {visible.map((event) => {
                      const state = registrationOf(event);
                      const banner = bannerDateOf(event);
                      return (
                        <article className={`ev-card cat-${event.categoryKey}`} key={event.id}>
                          <div className="ev-banner">
                            <i className={event.icon} />
                            <span className="ev-banner-badge">{event.category}</span>
                            <span className="ev-banner-date">
                              <b>{banner.day}</b>
                              <span>{banner.month}</span>
                            </span>
                          </div>
                          <div className="ev-card-body">
                            <h3 className="ev-card-title">{event.title}</h3>
                            <div className="ev-meta">
                              <span className="ev-meta-i">
                                <i className="ti ti-clock" />
                                {event.time}
                              </span>
                              <span className="ev-meta-i">
                                <i className="ti ti-map-pin" />
                                {event.venue}
                              </span>
                              <span className="ev-meta-i">
                                <i className="ti ti-user-star" />
                                {event.organizer}
                              </span>
                            </div>
                            <div className="d-flex align-items-center gap-2 mb-2">
                              <span className={`badge badge-soft-${registrationTint(state)}`}>
                                <i className="ti ti-clipboard-check me-1" />
                                {state}
                              </span>
                              <span className="fs-12 text-muted">
                                <i className="ti ti-users me-1" />
                                {capacityLabelOf(event)}
                              </span>
                            </div>
                            <div className="ev-foot">
                              <div className="ev-parts">
                                {PARTICIPANT_FACES.slice(0, AVATARS_SHOWN).map((face) => (
                                  <span className="avatar avatar-xs" key={face}>
                                    <ImageWithBasePath
                                      src={face}
                                      className="rounded-circle flex-shrink-0"
                                      alt="Participant"
                                    />
                                  </span>
                                ))}
                                <span className="ev-parts-more">+{moreParticipantsOf(event)}</span>
                              </div>
                              <div className="d-flex align-items-center gap-1">
                                <EventActions event={event} onAction={onAction} />
                                <div className={`dropdown${actionsFor === event.id ? ' show' : ''}`}>
                                  <ActionLink
                                    className="btn btn-icon btn-sm btn-outline-light bg-white"
                                    ariaLabel={`More actions for ${event.id}`}
                                    onClick={() =>
                                      setActionsFor(actionsFor === event.id ? null : event.id)
                                    }
                                  >
                                    <i className="ti ti-dots-vertical" />
                                  </ActionLink>
                                  <ul
                                    className={`dropdown-menu dropdown-menu-end p-2${
                                      actionsFor === event.id ? ' show' : ''
                                    }`}
                                  >
                                    {EVENT_ACTIONS.map((action) => (
                                      <li key={action.id}>
                                        <ActionLink
                                          className={`dropdown-item rounded-1${
                                            action.id === 'delete' ? ' text-danger' : ''
                                          }`}
                                          onClick={() => onAction(action.id, event)}
                                        >
                                          <i className={`${action.icon} me-2`} />
                                          {action.label}
                                        </ActionLink>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            </div>
                          </div>
                        </article>
                      );
                    })}

                    {visible.length === 0 ? (
                      <div className="ev-empty">
                        <span className="ev-empty-ic">
                          <i className="ti ti-calendar-off" />
                        </span>
                        <h4 className="fs-16 mb-1">No Events Scheduled</h4>
                        <p className="fs-13 text-muted mb-3">
                          No events match your search or filters. Try clearing the filters or create
                          a new event.
                        </p>
                        <ActionLink
                          className="btn btn-primary btn-sm"
                          onClick={() => openModal('create', null)}
                        >
                          Create Event
                        </ActionLink>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          </div>
          </div>
        </div>
      </div>

      <EventModals
        active={modal}
        onClose={() => setModal(null)}
        onOpen={setModal}
        event={target}
        onToast={push}
      />

      <ToastStack toasts={toasts} onDismiss={dismiss} id="eventsToasts" />
    </>
  );
};

export default Events;
