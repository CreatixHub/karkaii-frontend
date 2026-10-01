import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import ToastStack from '@components/ui/ToastStack';
import { all_routes } from '@/routes/all_routes';
import { useReveal } from '@hooks/useReveal';
import { useToasts } from '@hooks/useToasts';
import BulkActionBar from './components/BulkActionBar';
import ScheduleAgenda from './components/ScheduleAgenda';
import ScheduleGrid from './components/ScheduleGrid';
import ScheduleSkeleton from './components/ScheduleSkeleton';
import ScheduleToolbar from './components/ScheduleToolbar';
import type { FilterChip } from './components/ScheduleToolbar';
import WorkspaceFooter from './components/WorkspaceFooter';
import ScheduleModals from './modals/ScheduleModals';
import type { ScheduleDraft } from './modals/ScheduleModals';
import type {
  BulkAction,
  DayId,
  DensityId,
  FilterKey,
  RowMenuItem,
  ScheduleModalId,
  ScheduledClass,
  ToolbarMenu,
  ViewMode,
} from './data/classSchedule.data';
import {
  actionToasts,
  advancedFilters,
  allColumns,
  exportActions,
  quickFilters,
  savedViews,
  scheduledClasses,
  viewModeToasts,
  weekOptions,
} from './data/classSchedule.data';

const routes = all_routes;

const REVEAL_MS = 850;
const REFRESH_MS = 700;

/** Facets whose option values are fragments of the `data-search` haystack. */
const HAYSTACK_FACETS: FilterKey[] = ['class', 'section', 'room'];

const facetValue = (row: ScheduledClass, key: FilterKey): string => {
  switch (key) {
    case 'teacher':
      return row.teacher?.name ?? '';
    case 'subject':
      return row.subject;
    case 'day':
      return row.day;
    case 'status':
      return row.status;
    case 'year':
    default:
      return '2024/2025';
  }
};

const ScheduleClasses = () => {
  /* ---------------------------------- State --------------------------------- */
  const [search, setSearch] = useState('');
  const [view, setView] = useState('all');
  const [filters, setFilters] = useState<Partial<Record<FilterKey, string>>>({});
  const [columns, setColumns] = useState<Record<DayId, boolean>>(allColumns);
  const [density, setDensity] = useState<DensityId>('default');
  const [viewMode, setViewMode] = useState<ViewMode>('week');
  const [openMenu, setOpenMenu] = useState<ToolbarMenu>(null);
  const [exportOpen, setExportOpen] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);

  const [roster, setRoster] = useState<ScheduledClass[]>(scheduledClasses);
  const [selected, setSelected] = useState<string[]>([]);
  const [expanded, setExpanded] = useState<string[]>([]);
  const [cardMenuOpen, setCardMenuOpen] = useState<string | null>(null);
  const [week, setWeek] = useState(weekOptions[0]);

  const [activeModal, setActiveModal] = useState<ScheduleModalId | null>(null);
  const [modalItem, setModalItem] = useState<ScheduledClass | null>(null);
  const [pendingDelete, setPendingDelete] = useState<string | 'bulk' | null>(null);

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

  useEffect(() => {
    if (!cardMenuOpen) return;
    const handlePointerDown = () => setCardMenuOpen(null);
    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, [cardMenuOpen]);

  /* -------------------------------- Filtering ------------------------------- */

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();

    return roster.filter((row) => {
      if (term && !row.search.includes(term)) return false;
      if (view !== 'all' && row.status !== view) return false;

      return advancedFilters.every((field) => {
        const wanted = filters[field.key];
        if (!wanted) return true;
        if (HAYSTACK_FACETS.includes(field.key)) return row.search.includes(wanted.toLowerCase());
        return facetValue(row, field.key) === wanted;
      });
    });
  }, [roster, search, view, filters]);

  const gridItems = useMemo(() => filtered.filter((row) => columns[row.dayId]), [filtered, columns]);
  const blank = gridItems.length === 0;

  /* --------------------------------- Counts --------------------------------- */

  const tally = useCallback(
    (id: string) => (id === 'all' ? roster.length : roster.filter((row) => row.status === id).length),
    [roster],
  );

  const viewCounts = useMemo(
    () =>
      savedViews.reduce<Record<string, number>>((acc, item) => {
        acc[item.id] = tally(item.id);
        return acc;
      }, {}),
    [tally],
  );

  const quickCounts = useMemo(
    () =>
      quickFilters.reduce<Record<string, number>>((acc, item) => {
        acc[item.id] = tally(item.id);
        return acc;
      }, {}),
    [tally],
  );

  const chips: FilterChip[] = useMemo(
    () =>
      advancedFilters.reduce<FilterChip[]>((list, field) => {
        const value = filters[field.key];
        if (!value) return list;
        const option = field.options.find((entry) => entry.value === value);
        list.push({ id: field.key, label: `${field.label}: ${option?.label ?? value}` });
        return list;
      }, []),
    [filters],
  );

  /* --------------------------------- Handlers ------------------------------- */

  const resetFilters = () => {
    setSearch('');
    setView('all');
    setFilters({});
    push(actionToasts.clear_filters);
  };

  /** Day mode pins the Day facet to Monday, exactly as the engine did (L399–401). */
  const changeViewMode = (mode: ViewMode) => {
    setViewMode(mode);
    setFilters((current) => ({ ...current, day: mode === 'day' ? 'Monday' : '' }));
    push(viewModeToasts[mode], 'info');
  };

  const toggleSelect = (id: string) =>
    setSelected((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));

  const toggleExpand = (id: string) =>
    setExpanded((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));

  const gridIds = gridItems.map((row) => row.id);
  const allChecked = gridIds.length > 0 && gridIds.every((id) => selected.includes(id));
  const someChecked = gridIds.some((id) => selected.includes(id));

  const toggleAll = (checked: boolean) =>
    setSelected((current) =>
      checked ? Array.from(new Set([...current, ...gridIds])) : current.filter((id) => !gridIds.includes(id)),
    );

  const refresh = () => {
    setRefreshing(true);
    window.setTimeout(() => {
      setRefreshing(false);
      push(actionToasts.refresh);
    }, REFRESH_MS);
  };

  const openModal = useCallback((modal: ScheduleModalId, row: ScheduledClass | null = null) => {
    setModalItem(row);
    setActiveModal(modal);
  }, []);
  const closeModal = () => setActiveModal(null);

  const runAction = (id: string, fallback?: string) => push(actionToasts[id] ?? fallback ?? 'Action completed');

  const cancelClasses = (ids: string[]) =>
    setRoster((current) =>
      current.map((row) =>
        ids.includes(row.id)
          ? { ...row, status: 'Cancelled', pillClass: 'is-emergency', pillIcon: 'ti ti-ban' }
          : row,
      ),
    );

  const handleBulkAction = (action: BulkAction) => {
    if (action.modal === 'delete') {
      setPendingDelete('bulk');
      openModal('delete');
      return;
    }
    if (action.id === 'print') {
      window.print();
      return;
    }
    runAction(action.id);
  };

  const handleCardAction = (menuItem: RowMenuItem, row: ScheduledClass) => {
    if (menuItem.modal === 'delete') {
      setPendingDelete(row.id);
      openModal('delete');
      return;
    }
    if (menuItem.modal) {
      openModal(menuItem.modal, row);
      return;
    }
    if (menuItem.id === 'print') {
      window.print();
      return;
    }
    if (menuItem.id === 'cancel_class') {
      cancelClasses([row.id]);
      runAction('cancel_class');
      return;
    }
    runAction(menuItem.id, `${menuItem.label} — ${row.subject}`);
  };

  const handleAdd = (draft: ScheduleDraft) => {
    push(
      draft.startTime === 'Select'
        ? 'Class added to the schedule'
        : `Class scheduled for ${draft.startTime}`,
    );
  };

  const handleSave = (id: string, draft: ScheduleDraft) => {
    // The template's Edit form carries no field that maps onto a card, so the
    // schedule is untouched and only the confirmation differs.
    push(draft.type === 'Select' ? 'Schedule updated' : `${draft.type} schedule updated`);
    void id;
  };

  const confirmDelete = () => {
    if (pendingDelete === 'bulk') {
      setRoster((current) => current.filter((row) => !selected.includes(row.id)));
      push(`${selected.length} class(es) deleted`);
      setSelected([]);
    } else if (pendingDelete) {
      setRoster((current) => current.filter((row) => row.id !== pendingDelete));
      setSelected((current) => current.filter((item) => item !== pendingDelete));
      push('Class deleted');
    }
    setPendingDelete(null);
    closeModal();
  };

  const stepWeek = (direction: -1 | 1) => {
    const index = weekOptions.indexOf(week);
    const next = weekOptions[index + direction];
    if (next) setWeek(next);
    push('Loading the selected week…', 'info');
  };

  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          {/* Page Header */}
          <div className="d-md-flex d-block align-items-center justify-content-between flex-wrap gap-2 mb-3">
            <div className="my-auto mb-2">
              <h3 className="page-title mb-1">Schedule Classes</h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={routes.adminDashboard}>Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <Link to="#">Academic</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Schedule Classes
                  </li>
                </ol>
              </nav>
            </div>
            <div className="d-flex my-xl-auto right-content align-items-center flex-wrap">
              <div className="me-2 mb-2">
                <Link
                  to="#"
                  className="btn btn-outline-light bg-white btn-sm fw-medium d-inline-flex align-items-center"
                  onClick={() => openModal('import')}
                >
                  <i className="ti ti-file-import me-2" />
                  Import
                </Link>
              </div>
              <div className="dropdown me-2 mb-2" ref={exportRef}>
                <Link
                  to="#"
                  className="dropdown-toggle btn btn-outline-light bg-white btn-sm fw-medium d-inline-flex align-items-center"
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
                  className="btn btn-primary btn-sm d-flex align-items-center"
                  onClick={() => openModal('add')}
                >
                  <i className="ti ti-square-rounded-plus me-2" />
                  Schedule Class
                </Link>
              </div>
            </div>
          </div>
          {/* /Page Header */}

          {/* Schedule Workspace */}
          <div className="card">
            <div
              className={`data-workspace classes-workspace${loading ? '' : ' is-loaded'}${
                fullscreen ? ' is-fullscreen card-fullscreen' : ''
              }`}
              id="classWorkspace"
              data-density={density}
              data-view={viewMode}
            >
              {!loading ? (
                <ScheduleToolbar
                  search={search}
                  onSearch={setSearch}
                  view={view}
                  onView={(next) => {
                    setView(next);
                    const label = [...savedViews, ...quickFilters].find((entry) => entry.id === next)?.label;
                    push(`${tally(next)} class(es) in “${label ?? 'Full Week'}”.`, 'info');
                  }}
                  viewCounts={viewCounts}
                  quickCounts={quickCounts}
                  filters={filters}
                  onFilter={(key, value) => setFilters((current) => ({ ...current, [key]: value }))}
                  onResetFilters={resetFilters}
                  onApplyFilters={() => push(`${gridItems.length} class(es) match the current filters.`)}
                  columns={columns}
                  onColumn={(id, visible) => {
                    setColumns((current) => ({ ...current, [id]: visible }));
                    push(`${visible ? 'Showing' : 'Hiding'} ${id}.`, 'info');
                  }}
                  onResetColumns={() => {
                    setColumns(allColumns);
                    push(actionToasts.reset_columns);
                  }}
                  density={density}
                  onDensity={setDensity}
                  viewMode={viewMode}
                  onViewMode={changeViewMode}
                  matchCount={gridItems.length}
                  totalCount={roster.length}
                  openMenu={openMenu}
                  onOpenMenu={setOpenMenu}
                  chips={chips}
                  onClearChip={(id) => setFilters((current) => ({ ...current, [id]: '' }))}
                  onRefresh={refresh}
                  fullscreen={fullscreen}
                  onToggleFullscreen={() => {
                    const next = !fullscreen;
                    setFullscreen(next);
                    push(next ? 'Entered fullscreen — press Esc to exit.' : 'Exited fullscreen.', 'info');
                  }}
                  onSaveView={() => runAction('save_view')}
                />
              ) : null}

              {loading ? <ScheduleSkeleton /> : null}

              {!loading ? (
                <div className="live-content">
                  <BulkActionBar
                    count={selected.length}
                    onAction={handleBulkAction}
                    onClear={() => setSelected([])}
                  />

                  {/* Week mode shows the grid; Day and Agenda show the timeline only. */}
                  {viewMode === 'week' ? (
                    <ScheduleGrid
                      items={gridItems}
                      columns={columns}
                      blank={blank}
                      selected={selected}
                      onToggleSelect={toggleSelect}
                      allChecked={allChecked}
                      someChecked={someChecked}
                      onToggleAll={toggleAll}
                      expanded={expanded}
                      onToggleExpand={toggleExpand}
                      openMenu={cardMenuOpen}
                      onOpenMenu={setCardMenuOpen}
                      onAction={handleCardAction}
                    />
                  ) : null}

                  <ScheduleAgenda items={filtered} blank={blank} viewMode={viewMode} />

                  <div className={`workspace-empty-state${blank ? ' show' : ''}`} id="clsEmpty">
                    <div className="workspace-empty-art">
                      <i className="ti ti-calendar-off" />
                    </div>
                    <h5>No classes match your filters</h5>
                    <p>Try adjusting your search terms or clearing the active filters to see the full schedule.</p>
                    <button type="button" className="btn btn-primary" onClick={resetFilters}>
                      <i className="ti ti-rotate me-1" />
                      Reset filters
                    </button>
                  </div>

                  <WorkspaceFooter
                    shown={gridItems.length}
                    total={roster.length}
                    week={week}
                    onWeek={setWeek}
                    onStepWeek={stepWeek}
                  />
                </div>
              ) : null}

              <ToastStack toasts={toasts} onDismiss={dismiss} id="clsToasts" />
            </div>
          </div>
          {/* /Schedule Workspace */}
        </div>
      </div>

      <ScheduleModals
        active={activeModal}
        item={modalItem}
        selectedCount={pendingDelete === 'bulk' ? selected.length : 1}
        onClose={closeModal}
        onToast={push}
        onAdd={handleAdd}
        onSave={handleSave}
        onConfirmDelete={confirmDelete}
        onEditFromView={() => setActiveModal('edit')}
      />
    </>
  );
};

export default ScheduleClasses;
