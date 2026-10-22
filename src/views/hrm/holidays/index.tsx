import { useCallback, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import ToastStack from '@components/ui/ToastStack';
import { all_routes } from '@/routes/all_routes';
import { useReveal } from '@hooks/useReveal';
import { useToasts } from '@hooks/useToasts';
import HolidayCalendar from './components/HolidayCalendar';
import HolidayDetails from './components/HolidayDetails';
import HolidayListView from './components/HolidayListView';
import HolidaySidebar from './components/HolidaySidebar';
import HolidaySkeleton from './components/HolidaySkeleton';
import HolidayToolbar from './components/HolidayToolbar';
import type { ActiveChip, HolidayFilters, HolidayView, ToolbarMenu } from './components/HolidayToolbar';
import HolidayModals from './modals/HolidayModals';
import type { HolidayDraft, HolidayModalId } from './modals/HolidayModals';
import { emptyDraft } from './modals/HolidayModals';
import type { Holiday, HolidayCategory } from './data/holidays.data';
import {
  ACADEMIC_YEAR,
  buildCalendar,
  categoryOrder,
  DEFAULT_MONTH,
  formatDate,
  holidays as initialHolidays,
  parseDate,
  REFERENCE_DATE,
} from './data/holidays.data';

const routes = all_routes;

const DEFAULT_FILTERS: HolidayFilters = {
  year: '2026',
  academicYear: ACADEMIC_YEAR,
  category: '',
  branch: '',
};

const CHIP_META: Record<keyof HolidayFilters, { label: string; tone: string }> = {
  year: { label: 'Year', tone: 'primary' },
  academicYear: { label: 'Academic Year', tone: 'primary' },
  category: { label: 'Category', tone: 'info' },
  branch: { label: 'Branch', tone: 'success' },
};

/** A holiday counts as "in" a branch when it is school-wide or matches exactly. */
const matchesBranch = (holiday: Holiday, branch: string) =>
  !branch || holiday.branch === branch || holiday.branch === 'All Branches';

const Holidays = () => {
  const [roster, setRoster] = useState<Holiday[]>(initialHolidays);

  const [search, setSearch] = useState('');
  const [draft, setDraft] = useState<HolidayFilters>(DEFAULT_FILTERS);
  const [filters, setFilters] = useState<HolidayFilters>(DEFAULT_FILTERS);
  const [quickCategory, setQuickCategory] = useState<HolidayCategory | null>(null);
  const [savedView, setSavedView] = useState('all');
  const [view, setView] = useState<HolidayView>('calendar');
  const [openMenu, setOpenMenu] = useState<ToolbarMenu>(null);
  const [month, setMonth] = useState<Date>(DEFAULT_MONTH);

  const [selected, setSelected] = useState<Holiday | null>(null);
  const [activeModal, setActiveModal] = useState<HolidayModalId | null>(null);
  const [modalHoliday, setModalHoliday] = useState<Holiday | null>(null);
  const [addSeed, setAddSeed] = useState<HolidayDraft>(emptyDraft);

  // `.classes-workspace` is gated in _classes.scss: without `is-loaded` on the
  // root it sets `display: none` on BOTH `.card-header` and `.live-content`, so
  // the page renders as a blank frame. The template's script added the class on
  // reveal; useReveal drives it here.
  const { loading } = useReveal();
  const { toasts, push, dismiss } = useToasts();

  /* --------------------------------- Filtering ------------------------------ */

  const visible = useMemo(() => {
    const term = search.trim().toLowerCase();

    return roster.filter((holiday) => {
      if (term) {
        const haystack = [holiday.name, holiday.category, holiday.type, holiday.branch, holiday.description]
          .join(' ')
          .toLowerCase();
        if (!haystack.includes(term)) return false;
      }
      // Saved Views and the quick rail are both category narrowings.
      if (savedView !== 'all' && holiday.category !== savedView) return false;
      if (quickCategory && holiday.category !== quickCategory) return false;
      if (filters.category && holiday.category !== filters.category) return false;
      if (!matchesBranch(holiday, filters.branch)) return false;
      return true;
    });
  }, [roster, search, savedView, quickCategory, filters]);

  const cells = useMemo(() => buildCalendar(month, visible), [month, visible]);

  const upcoming = useMemo(
    () => visible.filter((holiday) => parseDate(holiday.start) >= REFERENCE_DATE).slice(0, 5),
    [visible],
  );

  const recent = useMemo(
    () => visible.filter((holiday) => parseDate(holiday.start) < REFERENCE_DATE).slice(0, 4),
    [visible],
  );

  const counts = useMemo(() => {
    const tally = Object.fromEntries(categoryOrder.map((category) => [category, 0])) as Record<
      HolidayCategory,
      number
    >;
    roster.forEach((holiday) => {
      tally[holiday.category] += 1;
    });
    return tally;
  }, [roster]);

  /* --------------------------------- Chips ---------------------------------- */

  const chips = useMemo<ActiveChip[]>(
    () =>
      (Object.keys(CHIP_META) as (keyof HolidayFilters)[])
        .filter((key) => filters[key] && filters[key] !== DEFAULT_FILTERS[key])
        .map((key) => ({ id: key, label: CHIP_META[key].label, value: filters[key], tone: CHIP_META[key].tone })),
    [filters],
  );

  const applyFilters = useCallback(() => {
    setFilters(draft);
    setOpenMenu(null);
    push('Filters applied');
  }, [draft, push]);

  const resetFilters = useCallback(() => {
    setDraft(DEFAULT_FILTERS);
    setFilters(DEFAULT_FILTERS);
    setSearch('');
    setQuickCategory(null);
    setSavedView('all');
    push('Filters cleared');
  }, [push]);

  const clearChip = useCallback((id: keyof HolidayFilters) => {
    setDraft((current) => ({ ...current, [id]: DEFAULT_FILTERS[id] }));
    setFilters((current) => ({ ...current, [id]: DEFAULT_FILTERS[id] }));
  }, []);

  /* ------------------------------ Month navigation --------------------------- */

  const shiftMonth = (delta: number) =>
    setMonth((current) => new Date(current.getFullYear(), current.getMonth() + delta, 1));

  const goToday = () => {
    setMonth(new Date(REFERENCE_DATE.getFullYear(), REFERENCE_DATE.getMonth(), 1));
    push('Jumped to the current month');
  };

  /* --------------------------------- Records -------------------------------- */

  const openDetails = (holiday: Holiday) => setSelected(holiday);

  const openModal = (modal: HolidayModalId, holiday: Holiday | null = null) => {
    setModalHoliday(holiday);
    setActiveModal(modal);
  };

  const openAddFor = (date: Date) => {
    setAddSeed({ ...emptyDraft, date: formatDate(date) });
    setModalHoliday(null);
    setActiveModal('add');
  };

  const createHoliday = useCallback(
    (values: HolidayDraft) => {
      if (!values.title.trim() || !values.date.trim()) {
        push('Give the holiday a title and a date', 'warning');
        return;
      }
      const record: Holiday = {
        id: `HOL-${Date.now()}`,
        name: values.title.trim(),
        category: 'School',
        type: 'School Holiday',
        start: values.date.trim(),
        end: values.date.trim(),
        duration: '1 day',
        classes: 'All Classes',
        branch: 'All Branches',
        description: values.description.trim(),
        createdBy: 'HR Office',
        createdOn: formatDate(REFERENCE_DATE),
      };
      setRoster((current) => [...current, record]);
      setActiveModal(null);
      push(`${record.name} added`);
    },
    [push],
  );

  const updateHoliday = useCallback(
    (values: HolidayDraft) => {
      if (!modalHoliday) return;
      setRoster((current) =>
        current.map((holiday) =>
          holiday.id === modalHoliday.id
            ? {
                ...holiday,
                name: values.title.trim() || holiday.name,
                start: values.date.trim() || holiday.start,
                end: values.date.trim() || holiday.end,
                description: values.description,
              }
            : holiday,
        ),
      );
      setSelected(null);
      setActiveModal(null);
      push('Holiday updated');
    },
    [modalHoliday, push],
  );

  const confirmDelete = useCallback(() => {
    if (!modalHoliday) {
      setActiveModal(null);
      return;
    }
    setRoster((current) => current.filter((holiday) => holiday.id !== modalHoliday.id));
    setSelected(null);
    setActiveModal(null);
    push(`${modalHoliday.name} deleted`);
  }, [modalHoliday, push]);

  const refresh = useCallback(() => {
    setRoster(initialHolidays);
    push('Holiday calendar refreshed');
  }, [push]);

  return (
    <>
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content content-two">
          {/* Page Header */}
          <div className="d-md-flex d-block align-items-center justify-content-between flex-wrap gap-2 mb-3">
            <div className="my-auto mb-2">
              <h3 className="page-title mb-1">Holiday Calendar</h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={routes.adminDashboard}>Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <Link to="#">HRM</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Holidays
                  </li>
                </ol>
              </nav>
            </div>
            <div className="d-flex my-xl-auto right-content align-items-center flex-wrap">
              <div className="me-2 mb-2">
                <button
                  type="button"
                  className="btn btn-outline-light bg-white btn-sm fw-medium d-inline-flex align-items-center"
                  onClick={() => openModal('import')}
                >
                  <i className="ti ti-file-import me-2" />
                  Import Calendar
                </button>
              </div>
              <div className="dropdown me-2 mb-2">
                <button
                  type="button"
                  className="dropdown-toggle btn btn-outline-light bg-white btn-sm fw-medium d-inline-flex align-items-center"
                  aria-expanded={openMenu === 'export'}
                  onClick={() => setOpenMenu(openMenu === 'export' ? null : 'export')}
                >
                  <i className="ti ti-file-export me-2" />
                  Export Calendar
                </button>
                <ul className={`dropdown-menu dropdown-menu-end p-3${openMenu === 'export' ? ' show' : ''}`}>
                  {[
                    { id: 'pdf', icon: 'ti ti-file-type-pdf', label: 'Export as PDF' },
                    { id: 'excel', icon: 'ti ti-file-type-xls', label: 'Export as Excel' },
                    { id: 'ics', icon: 'ti ti-calendar', label: 'Export as .ics' },
                  ].map((option) => (
                    <li key={option.id}>
                      <button
                        type="button"
                        className="dropdown-item rounded-1"
                        onClick={() => {
                          setOpenMenu(null);
                          push(`${option.label} started`);
                        }}
                      >
                        <i className={`${option.icon} me-1`} />
                        {option.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="me-2 mb-2">
                <button
                  type="button"
                  className="btn btn-outline-light bg-white btn-sm fw-medium d-inline-flex align-items-center"
                  onClick={() => window.print()}
                >
                  <i className="ti ti-printer me-2" />
                  Print Calendar
                </button>
              </div>
              <div className="mb-2">
                <button
                  type="button"
                  className="btn btn-primary btn-sm d-flex align-items-center"
                  onClick={() => {
                    setAddSeed(emptyDraft);
                    openModal('add');
                  }}
                >
                  <i className="ti ti-square-rounded-plus me-2" />
                  Add Holiday
                </button>
              </div>
            </div>
          </div>
          {/* /Page Header */}

          {/* Holiday Workspace */}
          <div
            className={`data-workspace classes-workspace${loading ? '' : ' is-loaded'}`}
            id="holidayWorkspace"
          >
            <HolidayToolbar
              search={search}
              onSearch={setSearch}
              draft={draft}
              onDraft={(key, value) => setDraft((current) => ({ ...current, [key]: value }))}
              onApplyFilters={applyFilters}
              onResetFilters={resetFilters}
              quickCategory={quickCategory}
              onQuickCategory={setQuickCategory}
              savedView={savedView}
              onSavedView={setSavedView}
              onSaveView={() => push('Current view saved')}
              view={view}
              onView={setView}
              onRefresh={refresh}
              onPrint={() => window.print()}
              openMenu={openMenu}
              onOpenMenu={setOpenMenu}
              chips={chips}
              onClearChip={clearChip}
              matchCount={visible.length}
            />

            {loading ? (
              <HolidaySkeleton />
            ) : (
              <div className="live-content">
                <div className="row g-3">
                  {/* Calendar / List */}
                  <div className="col-12 col-xl-8">
                    {view === 'calendar' ? (
                      <HolidayCalendar
                        month={month}
                        cells={cells}
                        onPrevMonth={() => shiftMonth(-1)}
                        onNextMonth={() => shiftMonth(1)}
                        onToday={goToday}
                        onAdd={openAddFor}
                        onOpen={openDetails}
                      />
                    ) : (
                      <HolidayListView
                        holidays={visible}
                        onOpen={openDetails}
                        onEdit={(holiday) => openModal('edit', holiday)}
                      />
                    )}
                  </div>

                  {/* Right rail */}
                  <div className="col-12 col-xl-4">
                    <HolidaySidebar
                      upcoming={upcoming}
                      recent={recent}
                      counts={counts}
                      activeCategory={quickCategory}
                      onOpen={openDetails}
                      onCategory={(category) =>
                        setQuickCategory((current) => (current === category ? null : category))
                      }
                      onViewAll={() => setView('list')}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
          {/* /Holiday Workspace */}

          {/* Holiday Details Offcanvas */}
          <HolidayDetails
            holiday={selected}
            onClose={() => setSelected(null)}
            onEdit={() => openModal('edit', selected)}
            onDuplicate={() => {
              setAddSeed(
                selected
                  ? { title: `${selected.name} (copy)`, date: selected.start, description: selected.description, active: true }
                  : emptyDraft,
              );
              openModal('add', selected);
            }}
            onNotice={() => openModal('notice', selected)}
            onDelete={() => openModal('delete', selected)}
            onPrint={() => window.print()}
            onShare={() => push('Share link copied')}
            onArchive={() => push(`${selected?.name ?? 'Holiday'} archived`)}
            onDownloadNotice={() => push('Holiday notice download started')}
          />
          {/* /Holiday Details Offcanvas */}
        </div>
      </div>
      {/* /Page Wrapper */}

      {/* Modals */}
      <HolidayModals
        active={activeModal}
        holiday={modalHoliday}
        addSeed={addSeed}
        onClose={() => setActiveModal(null)}
        onToast={push}
        onCreate={createHoliday}
        onUpdate={updateHoliday}
        onConfirmDelete={confirmDelete}
        onPrint={() => window.print()}
      />
      {/* /Modals */}

      <ToastStack toasts={toasts} onDismiss={dismiss} id="clsToasts" />
    </>
  );
};

export default Holidays;
