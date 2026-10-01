import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import ToastStack from '@components/ui/ToastStack';
import ImageWithBasePath from '@core/common/imageWithBasePath';
import { all_routes } from '@/routes/all_routes';
import { useToasts } from '@hooks/useToasts';
import SchedulePanel from './components/SchedulePanel';
import TimetableSkeleton from './components/TimetableSkeleton';
import TimetableSlotCard from './components/TimetableSlotCard';
import TimetableToolbar from './components/TimetableToolbar';
import type { ToolbarMenu } from './components/TimetableToolbar';
import AddTimeTableModal from './modals/AddTimeTableModal';
import TimeTableModals from './modals/TimeTableModals';
import type { ActiveSession, TimetableModalId } from './modals/TimeTableModals';
import type {
  CalendarViewId,
  SavedViewId,
  TimetableSlot,
} from './data/teacherTimeTable.data';
import {
  savedViews,
  statFacts,
  teacherProfile,
  timetableWeek,
} from './data/teacherTimeTable.data';

const routes = all_routes;

/** The Filters panel offers departments; the grid carries subjects. */
const DEPARTMENT_SUBJECTS: Record<string, string[]> = {
  Science: ['Physics', 'Science'],
  Mathematics: ['Maths'],
  Languages: [],
};

/** Which day columns each Week View mode shows. */
const daysFor = (view: CalendarViewId, ids: string[]) => {
  if (view === 'day') return ids.slice(0, 1);
  if (view === 'workWeek') return ids.slice(0, 5);
  return ids;
};

const searchHaystack = (slot: TimetableSlot, day: string) =>
  [
    day,
    slot.subject,
    slot.time,
    ...slot.metas.map((meta) => meta.label),
    ...slot.badges.map((badge) => badge.label),
    slot.soloBadge?.label ?? '',
  ]
    .join(' ')
    .toLowerCase();

const TeacherTimeTable = () => {
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [dateRange, setDateRange] = useState('');
  const [calendarView, setCalendarView] = useState<CalendarViewId>('week');
  const [savedView, setSavedView] = useState<SavedViewId>('full');
  const [layout, setLayout] = useState<'grid' | 'list'>('grid');
  const [fullscreen, setFullscreen] = useState(false);
  const [openMenu, setOpenMenu] = useState<ToolbarMenu>(null);

  const [panelOpen, setPanelOpen] = useState(false);
  const [slotMenu, setSlotMenu] = useState<string | null>(null);
  const [activeModal, setActiveModal] = useState<TimetableModalId | null>(null);
  const [session, setSession] = useState<ActiveSession | null>(null);

  const { toasts, push, dismiss } = useToasts();
  const location = useLocation();
  const navigate = useNavigate();

  /* -------------------------- Skeleton, as the script did ------------------- */

  // `class-timetable.js` flashed the skeleton for 700ms on first paint.
  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 700);
    return () => window.clearTimeout(timer);
  }, []);

  const refresh = useCallback(() => {
    setLoading(true);
    window.setTimeout(() => {
      setLoading(false);
      push('Timetable refreshed');
    }, 900);
  }, [push]);

  // The script cleared `.card-fullscreen` on Escape; so does this.
  useEffect(() => {
    if (!fullscreen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setFullscreen(false);
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [fullscreen]);

  // Close the open card menu on an outside click, as Bootstrap's dropdown does.
  useEffect(() => {
    if (!slotMenu) return;
    const close = () => setSlotMenu(null);
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [slotMenu]);

  // The template's orphaned Change Classroom dialog, reachable by fragment.
  useEffect(() => {
    if (location.hash === '#change_classroom') setActiveModal('changeClassroom');
  }, [location.hash]);

  /* -------------------------------- Filtering ------------------------------- */

  const week = useMemo(() => {
    const term = search.trim().toLowerCase();
    const badge = savedViews.find((view) => view.id === savedView)?.badge;
    const department = filters.department ?? '';
    const subject = filters.subject ?? '';
    const visible = daysFor(
      calendarView,
      timetableWeek.map((day) => day.id),
    );

    return timetableWeek
      .filter((day) => visible.includes(day.id))
      .map((day) => ({
        ...day,
        slots: day.slots.filter((slot) => {
          if (term && !searchHaystack(slot, day.name).includes(term)) return false;
          if (badge && slot.soloBadge?.label !== badge) return false;
          if (subject && slot.subject !== subject) return false;
          if (department && !(DEPARTMENT_SUBJECTS[department] ?? []).includes(slot.subject)) {
            return false;
          }
          return true;
        }),
      }))
      .filter((day) => day.slots.length > 0);
  }, [search, savedView, filters.department, filters.subject, calendarView]);

  const resetFilters = useCallback(() => {
    setFilters({});
    setDateRange('');
    setSearch('');
    setSavedView('full');
    setCalendarView('week');
  }, []);

  /* -------------------------------- Dialogs -------------------------------- */

  const openModalFor = useCallback(
    (modal: TimetableModalId, slot: TimetableSlot) => {
      const day = timetableWeek.find((item) => item.slots.some((entry) => entry.id === slot.id));
      setSession({
        slot,
        day: day?.name ?? '',
        period: day ? day.slots.findIndex((entry) => entry.id === slot.id) + 1 : 1,
      });
      setActiveModal(modal);
    },
    [],
  );

  const closeModal = useCallback(() => {
    setActiveModal(null);
    if (location.hash) navigate(location.pathname, { replace: true });
  }, [location.hash, location.pathname, navigate]);

  return (
    <>
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content timetable-page content-two">
          {/* Page Header */}
          <div className="d-md-flex d-block align-items-center justify-content-between flex-wrap gap-2 mb-3">
            <div className="my-auto mb-2">
              <h3 className="page-title mb-1">Teacher Time Table</h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={routes.adminDashboard}>Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <Link to={routes.teacherGrid}>Teachers</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Time Table
                  </li>
                </ol>
              </nav>
            </div>
            <div className="d-flex my-xl-auto right-content align-items-center flex-wrap">
              <button
                type="button"
                className="btn btn-outline-light bg-white me-2 mb-2 d-inline-flex align-items-center"
                aria-controls="ctt_panel"
                aria-expanded={panelOpen}
                onClick={() => setPanelOpen(true)}
              >
                <i className="ti ti-layout-sidebar-right-expand me-1" />
                Info Panel
              </button>
              <button
                type="button"
                className="btn btn-primary mb-2 d-inline-flex align-items-center"
                onClick={() => setActiveModal('addTimeTable')}
              >
                <i className="ti ti-square-rounded-plus me-1" />
                Assign Timetable
              </button>
            </div>
          </div>
          {/* /Page Header */}

          {/* Skeleton Loader */}
          {loading ? <TimetableSkeleton /> : null}
          {/* /Skeleton Loader */}

          {!loading ? (
            <div id="ctt_workspace">
              {/* Premium Scheduling Toolbar */}
              <TimetableToolbar
                search={search}
                onSearch={setSearch}
                filters={filters}
                onFilter={(id, value) =>
                  setFilters((current) => ({ ...current, [id]: value }))
                }
                dateRange={dateRange}
                onDateRange={setDateRange}
                onResetFilters={resetFilters}
                calendarView={calendarView}
                onCalendarView={setCalendarView}
                savedView={savedView}
                onSavedView={setSavedView}
                onSaveCurrentView={() => push('Current view saved')}
                layout={layout}
                onLayout={setLayout}
                onExport={(id) => push(id === 'pdf' ? 'Export PDF started' : 'Export Excel started')}
                onRefresh={refresh}
                fullscreen={fullscreen}
                onFullscreen={() => setFullscreen((on) => !on)}
                onAssign={() => setActiveModal('addTimeTable')}
                openMenu={openMenu}
                onOpenMenu={setOpenMenu}
              />
              {/* /Premium Scheduling Toolbar */}

              {/* Teacher Profile Header */}
              <div className="card card-hover mb-3">
                <div className="card-body">
                  <div className="d-xl-flex align-items-center justify-content-between">
                    <div className="d-sm-flex align-items-center mb-3 mb-xl-0">
                      <span className="avatar avatar-xxl rounded flex-shrink-0 me-sm-3 mb-3 mb-sm-0">
                        <ImageWithBasePath
                          src={teacherProfile.avatar}
                          className="img-fluid rounded"
                          alt={teacherProfile.name}
                        />
                      </span>
                      <div>
                        <div className="d-flex align-items-center flex-wrap gap-2 mb-2">
                          <h4 className="mb-0">{teacherProfile.name}</h4>
                          <span className="badge bg-primary-transparent text-primary">
                            {teacherProfile.code}
                          </span>
                          <span className="badge badge-soft-success d-inline-flex align-items-center">
                            <i className="ti ti-circle-filled fs-5 me-1" />
                            {teacherProfile.status}
                          </span>
                        </div>
                        <div className="d-flex align-items-center flex-wrap gap-3 gap-xl-4 text-muted fs-13 mb-3">
                          {teacherProfile.facts.map((fact) => (
                            <span key={fact.label}>
                              <i className={fact.icon} />
                              {fact.label}: <span className="text-dark fw-medium">{fact.value}</span>
                            </span>
                          ))}
                        </div>
                        <div className="d-flex align-items-center flex-wrap gap-2">
                          <a
                            href={`tel:${teacherProfile.phone}`}
                            className="btn btn-sm btn-outline-light bg-white d-inline-flex align-items-center"
                          >
                            <i className="ti ti-phone me-1" />
                            Call
                          </a>
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-light bg-white d-inline-flex align-items-center"
                            onClick={() => setActiveModal('meetingDetails')}
                          >
                            <i className="ti ti-mail me-1" />
                            Message
                          </button>
                          <Link
                            to={routes.teacherDetails}
                            className="btn btn-sm btn-outline-light bg-white d-inline-flex align-items-center"
                          >
                            <i className="ti ti-user me-1" />
                            Profile
                          </Link>
                        </div>
                      </div>
                    </div>
                    <div className="d-flex align-items-center flex-wrap gap-4">
                      {statFacts.map((fact) => (
                        <div className="stat-fact" key={fact.id}>
                          <span className={`stat-fact-icon ${fact.iconClass}`}>
                            <i className={fact.icon} />
                          </span>
                          <div>
                            <div className="stat-fact-value">{fact.value}</div>
                            <div className="stat-fact-label">{fact.label}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              {/* /Teacher Profile Header */}

              {/* Schedule Grid */}
              {week.length > 0 ? (
                <div className={`card mb-0${fullscreen ? ' card-fullscreen' : ''}`} id="ctt_card">
                  <div className="card-body">
                    <div
                      className={`timetable-grid${layout === 'list' ? ' timetable-list' : ''}`}
                      id="ctt_grid"
                    >
                      {week.map((day) => (
                        <div className="timetable-day" key={day.id}>
                          <div className="timetable-day-head">
                            <span>
                              <i className="ti ti-calendar-week me-1" />
                              {day.name}
                            </span>
                            <span className="timetable-day-count">{day.slots.length} periods</span>
                          </div>
                          {day.slots.map((slot) => (
                            <TimetableSlotCard
                              key={slot.id}
                              slot={slot}
                              menuOpen={slotMenu === slot.id}
                              onToggleMenu={setSlotMenu}
                              onOpenModal={openModalFor}
                            />
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : null}
              {/* /Schedule Grid */}

              {/* Empty State */}
              {week.length === 0 ? (
                <div className="card mb-0" id="ctt_empty">
                  <div className="card-body text-center py-5">
                    <div className="empty-state-art">
                      <i className="ti ti-calendar-off" />
                    </div>
                    <h5 className="mb-1">No Teaching Schedule Found</h5>
                    <p className="text-muted mb-3">
                      This teacher has no assigned periods yet. Assign a timetable to schedule
                      classes, duties and meetings across the week.
                    </p>
                    <button
                      type="button"
                      className="btn btn-primary d-inline-flex align-items-center mx-auto"
                      onClick={() => setActiveModal('addTimeTable')}
                    >
                      <i className="ti ti-square-rounded-plus me-1" />
                      Assign Timetable
                    </button>
                  </div>
                </div>
              ) : null}
              {/* /Empty State */}
            </div>
          ) : null}
          {/* /ctt_workspace */}
        </div>
      </div>
      {/* /Page Wrapper */}

      {/* Info Panel Offcanvas */}
      <SchedulePanel open={panelOpen} onClose={() => setPanelOpen(false)} onToast={push} />
      {/* /Info Panel Offcanvas */}

      {/* Session dialogs */}
      <TimeTableModals
        active={activeModal}
        session={session}
        onClose={closeModal}
        onOpen={setActiveModal}
        onToast={push}
      />

      {/* Add Class Time Table */}
      <AddTimeTableModal
        open={activeModal === 'addTimeTable'}
        onClose={closeModal}
        onToast={push}
      />
      {/* /Add Class Time Table */}

      <ToastStack toasts={toasts} onDismiss={dismiss} id="tttToast" />
    </>
  );
};

export default TeacherTimeTable;
