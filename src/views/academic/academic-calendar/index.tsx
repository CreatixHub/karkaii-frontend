import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import ToastStack from '@components/ui/ToastStack';
import { all_routes } from '@/routes/all_routes';
import { useReveal } from '@hooks/useReveal';
import { useToasts } from '@hooks/useToasts';
import CalendarSidebar from './components/CalendarSidebar';
import CalendarToolbar from './components/CalendarToolbar';
import type { FilterChip } from './components/CalendarToolbar';
import CalendarViews from './components/CalendarViews';
import CalendarModals from './modals/CalendarModals';
import type {
  CalendarModalId,
  CalendarView,
  CategoryId,
  CheckFilter,
  FilterKey,
} from './data/academicCalendar.data';
import {
  actionToasts,
  advancedFilters,
  agendaItems,
  allCategoriesOn,
  exportActions,
  initialChips,
  monthCells,
  priorityFilters as priorityDefaults,
  sessionOptions,
  statusFilters as statusDefaults,
} from './data/academicCalendar.data';

const routes = all_routes;

/** The rail and board reveal together; no engine set a delay, so the shared 850 ms. */
const REVEAL_MS = 850;
const REFRESH_MS = 700;

const AcademicCalendar = () => {
  /* ---------------------------------- State --------------------------------- */
  const [view, setView] = useState<CalendarView>('month');
  const [search, setSearch] = useState('');
  const [categories, setCategories] = useState<Record<CategoryId, boolean>>(allCategoriesOn);
  const [quick, setQuick] = useState<'all' | CategoryId>('all');
  const [filters, setFilters] = useState<Partial<Record<FilterKey, string>>>({});
  const [openMenu, setOpenMenu] = useState<'views' | 'filters' | null>(null);
  const [exportOpen, setExportOpen] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);

  const [session, setSession] = useState(sessionOptions[0]);
  const [statusFilters, setStatusFilters] = useState<CheckFilter[]>(statusDefaults);
  const [priorityFilters, setPriorityFilters] = useState<CheckFilter[]>(priorityDefaults);
  const [filtersOpen, setFiltersOpen] = useState(true);

  // The template ships three chips already applied.
  const [extraChips, setExtraChips] = useState<string[]>(initialChips);

  const [activeModal, setActiveModal] = useState<CalendarModalId | null>(null);
  const [eventTitle, setEventTitle] = useState('');

  const [refreshing, setRefreshing] = useState(false);
  const exportRef = useRef<HTMLDivElement>(null);

  const { toasts, push, dismiss } = useToasts();
  const { loading: booting } = useReveal(REVEAL_MS);
  const loading = booting || refreshing;

  useEffect(() => {
    if (!exportOpen) return;
    const handlePointerDown = (event: MouseEvent) => {
      if (!exportRef.current?.contains(event.target as Node)) setExportOpen(false);
    };
    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, [exportOpen]);

  useEffect(() => {
    if (!fullscreen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setFullscreen(false);
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [fullscreen]);

  /* --------------------------------- Counts --------------------------------- */

  /** How many entries survive the category toggles and the search term. */
  const matchCount = useMemo(() => {
    const term = search.trim().toLowerCase();
    const boardHits = monthCells.reduce(
      (total, cell) =>
        total +
        cell.entries.filter(
          (item) => categories[item.category] && (!term || item.label.toLowerCase().includes(term)),
        ).length,
      0,
    );
    const agendaHits = agendaItems.filter(
      (item) => categories[item.category] && (!term || item.title.toLowerCase().includes(term)),
    ).length;
    return view === 'agenda' ? agendaHits : boardHits;
  }, [categories, search, view]);

  const chips: FilterChip[] = useMemo(() => {
    const list: FilterChip[] = extraChips.map((label) => ({ id: `preset:${label}`, label }));
    advancedFilters.forEach((field) => {
      const value = filters[field.key];
      // The first option of each select is the "All" placeholder, so it is not a chip.
      if (value && value !== field.options[0]) list.push({ id: field.key, label: value });
    });
    return list;
  }, [extraChips, filters]);

  /* --------------------------------- Handlers ------------------------------- */

  const runAction = (id: string, fallback?: string) => push(actionToasts[id] ?? fallback ?? 'Action completed');

  const openModal = useCallback((modal: CalendarModalId) => setActiveModal(modal), []);
  const closeModal = () => setActiveModal(null);

  const resetFilters = () => {
    setFilters({});
    setExtraChips([]);
    setSearch('');
    setCategories(allCategoriesOn);
    setQuick('all');
    push(actionToasts.clear_filters);
  };

  const clearChip = (id: string) => {
    if (id.startsWith('preset:')) {
      const label = id.slice('preset:'.length);
      setExtraChips((current) => current.filter((chip) => chip !== label));
      return;
    }
    setFilters((current) => ({ ...current, [id]: '' }));
  };

  /**
   * The quick bar and the category checkboxes filter the same axis, so a quick pick
   * narrows to that one category and "All" turns them all back on.
   */
  const handleQuick = (id: 'all' | CategoryId) => {
    setQuick(id);
    if (id === 'all') {
      setCategories(allCategoriesOn);
      return;
    }
    setCategories(
      (Object.keys(allCategoriesOn) as CategoryId[]).reduce(
        (acc, key) => ({ ...acc, [key]: key === id }),
        {} as Record<CategoryId, boolean>,
      ),
    );
  };

  const handleCategory = (id: CategoryId, on: boolean) => {
    setCategories((current) => ({ ...current, [id]: on }));
    // Toggling by hand leaves the quick bar showing no single selection.
    setQuick('all');
  };

  const refresh = () => {
    setRefreshing(true);
    window.setTimeout(() => {
      setRefreshing(false);
      push(actionToasts.refresh);
    }, REFRESH_MS);
  };

  const openEvent = (title: string) => {
    setEventTitle(title);
    openModal('eventDetails');
  };

  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          {/* Page Header */}
          <div className="d-md-flex d-block align-items-center justify-content-between flex-wrap gap-2 mb-3">
            <div className="my-auto mb-2">
              <h3 className="page-title mb-1">Academic Calendar</h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={routes.adminDashboard}>Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <Link to="#">Academic</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Academic Calendar
                  </li>
                </ol>
              </nav>
            </div>
            <div className="d-flex my-xl-auto right-content align-items-center flex-wrap">
              <div className="me-2 mb-2">
                <Link
                  to="#"
                  className="btn btn-outline-light bg-white fw-medium d-inline-flex align-items-center"
                  onClick={() => openModal('importCalendar')}
                >
                  <i className="ti ti-file-import me-2" />
                  Import
                </Link>
              </div>
              <div className="dropdown me-2 mb-2" ref={exportRef}>
                <Link
                  to="#"
                  className="dropdown-toggle btn btn-outline-light bg-white fw-medium d-inline-flex align-items-center"
                  aria-expanded={exportOpen}
                  onClick={() => setExportOpen((open) => !open)}
                >
                  <i className="ti ti-file-export me-2" />
                  Export
                </Link>
                <ul className={`dropdown-menu dropdown-menu-end p-3${exportOpen ? ' show' : ''}`}>
                  {exportActions.map((action) => (
                    <li key={action.id}>
                      <Link
                        to="#"
                        className="dropdown-item rounded-1"
                        onClick={() => {
                          setExportOpen(false);
                          if (action.id === 'print') window.print();
                          else runAction(action.id);
                        }}
                      >
                        <i className={`${action.icon} me-2`} />
                        {action.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mb-2">
                <Link
                  to="#"
                  className="btn btn-primary d-flex align-items-center"
                  onClick={() => openModal('addEvent')}
                >
                  <i className="ti ti-square-rounded-plus me-2" />
                  Add Event
                </Link>
              </div>
            </div>
          </div>
          {/* /Page Header */}

          {/* Toolbar */}
          <CalendarToolbar
            search={search}
            onSearch={setSearch}
            view={view}
            onView={setView}
            quick={quick}
            onQuick={handleQuick}
            filters={filters}
            onFilter={(key, value) => setFilters((current) => ({ ...current, [key]: value }))}
            onResetFilters={resetFilters}
            onApplyFilters={() => push(`${matchCount} events match`)}
            matchCount={matchCount}
            openMenu={openMenu}
            onOpenMenu={setOpenMenu}
            chips={chips}
            onClearChip={clearChip}
            onClearChips={resetFilters}
            onRefresh={refresh}
            fullscreen={fullscreen}
            onToggleFullscreen={() => {
              const next = !fullscreen;
              setFullscreen(next);
              push(next ? 'Entered fullscreen — press Esc to exit.' : 'Exited fullscreen.', 'info');
            }}
            onSaveView={() => runAction('save_view')}
            onToday={() => runAction('today')}
            onStep={(direction) =>
              push(direction === 1 ? 'Showing the next period.' : 'Showing the previous period.', 'info')
            }
          />
          {/* /Toolbar */}

          {/* Workspace */}
          <div className={`row${fullscreen ? ' card-fullscreen' : ''}`}>
            <CalendarSidebar
              categories={categories}
              onCategory={handleCategory}
              session={session}
              onSession={setSession}
              statusFilters={statusFilters}
              onStatusFilter={(id, on) =>
                setStatusFilters((current) =>
                  current.map((filter) => (filter.id === id ? { ...filter, checked: on } : filter)),
                )
              }
              priorityFilters={priorityFilters}
              onPriorityFilter={(id, on) =>
                setPriorityFilters((current) =>
                  current.map((filter) => (filter.id === id ? { ...filter, checked: on } : filter)),
                )
              }
              onApplyFilters={() => runAction('apply_filters')}
              onManageCategories={() => openModal('calendarSettings')}
              filtersOpen={filtersOpen}
              onToggleFilters={() => setFiltersOpen((open) => !open)}
            />

            {/* Center Calendar */}
            <div className="col-12 col-xl-9 col-lg-8">
              {loading ? (
                <div className="card">
                  <div className="card-body">
                    <div className="skeleton-loader" aria-hidden="true">
                      <div className="skeleton-body">
                        {Array.from({ length: 6 }, (_, row) => (
                          <div className="skeleton-row" key={row}>
                            {Array.from({ length: 7 }, (_, cell) => (
                              <div className="skeleton skeleton-line" key={cell} />
                            ))}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <CalendarViews
                  view={view}
                  categories={categories}
                  search={search}
                  onOpenEvent={openEvent}
                  onAddEvent={() => openModal('addEvent')}
                />
              )}
            </div>
            {/* /Center Calendar */}
          </div>
          {/* /Workspace */}
        </div>
      </div>

      <CalendarModals active={activeModal} eventTitle={eventTitle} onClose={closeModal} onToast={push} />

      <ToastStack toasts={toasts} onDismiss={dismiss} id="acalToasts" />
    </>
  );
};

export default AcademicCalendar;
