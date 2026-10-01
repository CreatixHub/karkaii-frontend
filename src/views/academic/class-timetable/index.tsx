import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import ToastStack from '@components/ui/ToastStack';
import { all_routes } from '@/routes/all_routes';
import { useReveal } from '@hooks/useReveal';
import { useToasts } from '@hooks/useToasts';
import SchedulePanel from './components/SchedulePanel';
import TimetableSkeleton from './components/TimetableSkeleton';
import TimetableSlotCard from './components/TimetableSlotCard';
import TimetableToolbar from './components/TimetableToolbar';
import type { ToolbarMenu } from './components/TimetableToolbar';
import TimetableModals from './modals/TimetableModals';
import type {
  FilterKey,
  LayoutView,
  SlotMenuItem,
  TimetableModalId,
  TimetableSlot,
} from './data/classTimeTable.data';
import {
  actionToasts,
  classProfile,
  savedViews,
  statFacts,
  timetableWeek,
} from './data/classTimeTable.data';

const routes = all_routes;

/** `class-timetable.js`: 700 ms on first paint, 900 ms after a refresh. */
const REVEAL_MS = 700;
const REFRESH_MS = 900;

const ClassTimetable = () => {
  /* ---------------------------------- State --------------------------------- */
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<Partial<Record<FilterKey, string>>>({});
  const [savedView, setSavedView] = useState(savedViews[0].id);
  const [layout, setLayout] = useState<LayoutView>('grid');
  const [openMenu, setOpenMenu] = useState<ToolbarMenu>(null);
  const [slotMenuOpen, setSlotMenuOpen] = useState<string | null>(null);
  const [fullscreen, setFullscreen] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);

  const [week, setWeek] = useState(timetableWeek);

  const [activeModal, setActiveModal] = useState<TimetableModalId | null>(null);
  const [modalSlot, setModalSlot] = useState<TimetableSlot | null>(null);

  const [refreshing, setRefreshing] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);

  const { toasts, push, dismiss } = useToasts();
  const { loading: booting } = useReveal(REVEAL_MS);
  const loading = booting || refreshing;

  useEffect(() => {
    if (!fullscreen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setFullscreen(false);
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [fullscreen]);

  useEffect(() => {
    if (!slotMenuOpen) return;
    const handlePointerDown = () => setSlotMenuOpen(null);
    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, [slotMenuOpen]);

  /* -------------------------------- Filtering ------------------------------- */

  /** Filters narrow the slots inside each day; a day with none left is dropped. */
  const filteredWeek = useMemo(() => {
    const term = search.trim().toLowerCase();

    return week
      .map((day) => {
        if (filters.day && filters.day !== day.label) return { ...day, slots: [] };
        const slots = day.slots.filter((slot) => {
          const haystack = `${slot.subject} ${slot.teacher.name} ${slot.room} ${day.label}`.toLowerCase();
          if (term && !haystack.includes(term)) return false;
          if (filters.teacher && slot.teacher.name !== filters.teacher) return false;
          if (filters.subject && slot.subject !== filters.subject) return false;
          if (filters.room && slot.room !== filters.room) return false;
          return true;
        });
        return { ...day, slots };
      })
      .filter((day) => day.slots.length > 0);
  }, [week, search, filters]);

  const isEmpty = filteredWeek.length === 0;

  /* --------------------------------- Handlers ------------------------------- */

  const runAction = (id: string, fallback?: string) => push(actionToasts[id] ?? fallback ?? 'Action completed');

  const openModal = useCallback((modal: TimetableModalId, slot: TimetableSlot | null = null) => {
    setModalSlot(slot);
    setActiveModal(modal);
  }, []);
  const closeModal = () => setActiveModal(null);

  const resetFilters = () => {
    setFilters({});
    setSearch('');
    push(actionToasts.clear_filters);
  };

  const refresh = () => {
    setRefreshing(true);
    window.setTimeout(() => {
      setRefreshing(false);
      push(actionToasts.refresh);
    }, REFRESH_MS);
  };

  const handleSlotAction = (item: SlotMenuItem, slot: TimetableSlot) => {
    if (item.id === 'delete') {
      setWeek((current) =>
        current.map((day) => ({ ...day, slots: day.slots.filter((entry) => entry.id !== slot.id) })),
      );
      runAction('delete');
      return;
    }
    if (item.modal) openModal(item.modal, slot);
  };

  const savePeriod = (id: string, patch: { subject: string; teacher: string; room: string }) =>
    setWeek((current) =>
      current.map((day) => ({
        ...day,
        slots: day.slots.map((slot) =>
          slot.id === id
            ? {
                ...slot,
                subject: patch.subject,
                room: patch.room,
                teacher: { ...slot.teacher, name: patch.teacher },
              }
            : slot,
        ),
      })),
    );

  return (
    <>
      <div className="page-wrapper">
        <div className="content timetable-page">
          {/* Page Header */}
          <div className="d-md-flex d-block align-items-center justify-content-between flex-wrap gap-2 mb-3">
            <div className="my-auto mb-2">
              <h3 className="page-title mb-1">Academic Time Table</h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={routes.adminDashboard}>Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">Academic</li>
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
                onClick={() => setPanelOpen(true)}
              >
                <i className="ti ti-layout-sidebar-right-expand me-1" />
                Info Panel
              </button>
              <button
                type="button"
                className="btn btn-primary mb-2 d-inline-flex align-items-center"
                onClick={() => openModal('addTimeTable')}
              >
                <i className="ti ti-square-rounded-plus me-1" />
                Generate Timetable
              </button>
            </div>
          </div>
          {/* /Page Header */}

          {loading ? <TimetableSkeleton /> : null}

          {!loading ? (
            <div id="ctt_workspace">
              <TimetableToolbar
                search={search}
                onSearch={setSearch}
                filters={filters}
                onFilter={(key, value) => setFilters((current) => ({ ...current, [key]: value }))}
                onResetFilters={resetFilters}
                onApplyFilters={() => runAction('apply_filters')}
                savedView={savedView}
                onSavedView={(id) => {
                  setSavedView(id);
                  const label = savedViews.find((item) => item.id === id)?.label;
                  push(`Showing “${label ?? 'Full Week'}”.`, 'info');
                }}
                layout={layout}
                onLayout={setLayout}
                openMenu={openMenu}
                onOpenMenu={setOpenMenu}
                onImport={() => openModal('addTimeTable')}
                onExport={runAction}
                onPrint={() => window.print()}
                onRefresh={refresh}
                fullscreen={fullscreen}
                onToggleFullscreen={() => {
                  const next = !fullscreen;
                  setFullscreen(next);
                  push(next ? 'Entered fullscreen — press Esc to exit.' : 'Exited fullscreen.', 'info');
                }}
                onGenerate={() => openModal('addTimeTable')}
                onSaveView={() => runAction('save_view')}
              />

              {/* Academic Header */}
              <div className="card card-hover mb-3">
                <div className="card-body">
                  <div className="d-xl-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center mb-3 mb-xl-0 flex-wrap gap-2">
                      <span className="avatar avatar-lg bg-primary-transparent text-primary rounded me-3 flex-shrink-0">
                        <i className="ti ti-table fs-24" />
                      </span>
                      <div>
                        <h4 className="mb-1">{classProfile.title}</h4>
                        <div className="d-flex align-items-center flex-wrap gap-2">
                          <span className="badge badge-soft-primary">{classProfile.year}</span>
                          <span className="fs-13 text-muted d-inline-flex align-items-center">
                            <i className="ti ti-user me-1" />
                            Class Teacher:{' '}
                            <span className="text-dark fw-medium ms-1">{classProfile.classTeacher}</span>
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="d-flex align-items-center flex-wrap gap-4">
                      {statFacts.map((fact) => (
                        <div className="stat-fact" key={fact.label}>
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
              {/* /Academic Header */}

              {/* Timetable Grid */}
              {!isEmpty ? (
                <div className={`card${fullscreen ? ' card-fullscreen' : ''}`} id="ctt_card">
                  <div className="card-body">
                    <div
                      className={`timetable-grid${layout === 'list' ? ' timetable-list' : ''}`}
                      id="ctt_grid"
                      ref={gridRef}
                    >
                      {filteredWeek.map((day) => (
                        <div className="timetable-day" key={day.id}>
                          <div className="timetable-day-head">
                            <span>
                              <i className="ti ti-calendar-week me-1" />
                              {day.label}
                            </span>
                            <span className="timetable-day-count">{day.slots.length} periods</span>
                          </div>
                          {day.slots.map((slot) => (
                            <TimetableSlotCard
                              key={slot.id}
                              slot={slot}
                              menuOpen={slotMenuOpen === slot.id}
                              onOpenMenu={setSlotMenuOpen}
                              onAction={handleSlotAction}
                            />
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : null}
              {/* /Timetable Grid */}

              {/* Empty State */}
              {isEmpty ? (
                <div className="card mb-0" id="ctt_empty">
                  <div className="card-body text-center py-5">
                    <div className="empty-state-art">
                      <i className="ti ti-calendar-off" />
                    </div>
                    <h5 className="mb-1">No Timetable Available</h5>
                    <p className="text-muted mb-3">
                      This class does not have a timetable yet. Generate one to schedule subjects, teachers and
                      rooms across the week.
                    </p>
                    <button
                      type="button"
                      className="btn btn-primary d-inline-flex align-items-center mx-auto"
                      onClick={() => openModal('addTimeTable')}
                    >
                      <i className="ti ti-square-rounded-plus me-1" />
                      Generate Timetable
                    </button>
                  </div>
                </div>
              ) : null}
              {/* /Empty State */}
            </div>
          ) : null}
        </div>
      </div>

      <SchedulePanel
        open={panelOpen}
        onClose={() => setPanelOpen(false)}
        onSaveNote={(note) => push(note.trim() ? 'Note saved' : 'Add a note before saving')}
      />

      <TimetableModals
        active={activeModal}
        slot={modalSlot}
        onClose={closeModal}
        onToast={push}
        onSavePeriod={savePeriod}
        onEditFromDetails={() => setActiveModal('editPeriod')}
      />

      <ToastStack toasts={toasts} onDismiss={dismiss} id="cttToasts" />
    </>
  );
};

export default ClassTimetable;
