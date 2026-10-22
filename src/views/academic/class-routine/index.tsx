import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import ToastStack from '@components/ui/ToastStack';
import { all_routes } from '@/routes/all_routes';
import { useReveal } from '@hooks/useReveal';
import { useToasts } from '@hooks/useToasts';
import BulkActionBar from './components/BulkActionBar';
import InsightsPanel from './components/InsightsPanel';
import RoutineAgenda from './components/RoutineAgenda';
import RoutineGrid from './components/RoutineGrid';
import RoutineSkeleton from './components/RoutineSkeleton';
import RoutineToolbar from './components/RoutineToolbar';
import type { FilterChip } from './components/RoutineToolbar';
import WorkspaceFooter from './components/WorkspaceFooter';
import RoutineModals from './modals/RoutineModals';
import type { RoutineDraft } from './modals/RoutineModals';
import type {
  BulkAction,
  DayId,
  DensityId,
  FilterKey,
  RoutineModalId,
  RoutinePeriod,
  RowMenuItem,
  ToolbarMenu,
} from './data/classRoutine.data';
import {
  actionToasts,
  advancedFilters,
  allColumns,
  exportActions,
  quickFilters,
  routinePeriods,
  savedViews,
  weekOptions,
} from './data/classRoutine.data';

const routes = all_routes;

/** The engine reveals 850 ms after load, and 700 ms after a manual refresh. */
const REVEAL_MS = 850;
const REFRESH_MS = 700;

/** Facets whose option values are fragments of the `data-search` haystack. */
const HAYSTACK_FACETS: FilterKey[] = ['class', 'section'];

const facetValue = (row: RoutinePeriod, key: FilterKey): string => {
  switch (key) {
    case 'teacher':
      return row.teacher?.name ?? '';
    case 'subject':
      return row.subject;
    case 'day':
      return row.day;
    case 'year':
    default:
      // Every period in the template belongs to the current year.
      return '2024/2025';
  }
};

const ClassRoutine = () => {
  /* ---------------------------------- State --------------------------------- */
  const [search, setSearch] = useState('');
  const [view, setView] = useState('all');
  const [filters, setFilters] = useState<Partial<Record<FilterKey, string>>>({});
  const [columns, setColumns] = useState<Record<DayId, boolean>>(allColumns);
  const [density, setDensity] = useState<DensityId>('default');
  const [openMenu, setOpenMenu] = useState<ToolbarMenu>(null);
  const [exportOpen, setExportOpen] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);

  const [roster, setRoster] = useState<RoutinePeriod[]>(routinePeriods);
  const [selected, setSelected] = useState<string[]>([]);
  const [expanded, setExpanded] = useState<string[]>([]);
  const [cardMenuOpen, setCardMenuOpen] = useState<string | null>(null);
  const [week, setWeek] = useState(weekOptions[0]);

  const [activeModal, setActiveModal] = useState<RoutineModalId | null>(null);
  const [modalPeriod, setModalPeriod] = useState<RoutinePeriod | null>(null);
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

  /** The grid only shows the days still toggled on, so its count differs. */
  const gridPeriods = useMemo(
    () => filtered.filter((row) => columns[row.dayId]),
    [filtered, columns],
  );
  const blank = gridPeriods.length === 0;

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
        const option = field.options.find((item) => item.value === value);
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

  const toggleSelect = (id: string) =>
    setSelected((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));

  const toggleExpand = (id: string) =>
    setExpanded((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));

  const gridIds = gridPeriods.map((row) => row.id);
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

  const openModal = useCallback((modal: RoutineModalId, row: RoutinePeriod | null = null) => {
    setModalPeriod(row);
    setActiveModal(modal);
  }, []);
  const closeModal = () => setActiveModal(null);

  const runAction = (id: string, fallback?: string) => push(actionToasts[id] ?? fallback ?? 'Action completed');

  const cancelPeriods = (ids: string[]) =>
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

  const handleCardAction = (item: RowMenuItem, row: RoutinePeriod) => {
    if (item.modal === 'delete') {
      setPendingDelete(row.id);
      openModal('delete');
      return;
    }
    if (item.modal) {
      openModal(item.modal, row);
      return;
    }
    if (item.id === 'print') {
      window.print();
      return;
    }
    if (item.id === 'cancel_class') {
      cancelPeriods([row.id]);
      runAction('cancel_class');
      return;
    }
    runAction(item.id, `${item.label} — ${row.subject}`);
  };

  const handleAdd = (draft: RoutineDraft) => {
    const day = draft.day === 'Wedneshday' ? 'Wednesday' : draft.day;
    push(
      draft.teacher === 'Select'
        ? 'Period added to the routine'
        : `${draft.teacher} added to the ${day} routine`,
    );
  };

  const handleSave = (id: string, draft: RoutineDraft) => {
    setRoster((current) =>
      current.map((row) =>
        row.id === id
          ? {
              ...row,
              room: draft.room === 'Select' ? row.room : draft.room,
              status: draft.active ? (row.status === 'Cancelled' ? 'Scheduled' : row.status) : 'Cancelled',
              pillClass: draft.active
                ? row.status === 'Cancelled'
                  ? 'is-new'
                  : row.pillClass
                : 'is-emergency',
              pillIcon: draft.active ? (row.status === 'Cancelled' ? null : row.pillIcon) : 'ti ti-ban',
            }
          : row,
      ),
    );
    push('Period updated');
  };

  const confirmDelete = () => {
    if (pendingDelete === 'bulk') {
      setRoster((current) => current.filter((row) => !selected.includes(row.id)));
      push(`${selected.length} period(s) deleted`);
      setSelected([]);
    } else if (pendingDelete) {
      setRoster((current) => current.filter((row) => row.id !== pendingDelete));
      setSelected((current) => current.filter((item) => item !== pendingDelete));
      push('Period deleted');
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
              <h3 className="page-title mb-1">Class Routine</h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={routes.adminDashboard}>Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <Link to="#">Academic</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Class Routine
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
                          runAction(action.id);
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
                  Add Class Routine
                </Link>
              </div>
            </div>
          </div>
          {/* /Page Header */}

          {/* Class Routine Workspace */}
          <div className="card">
            <div
              className={`data-workspace classes-workspace${loading ? '' : ' is-loaded'}${
                fullscreen ? ' is-fullscreen card-fullscreen' : ''
              }`}
              id="classWorkspace"
              data-density={density}
            >
              {!loading ? (
                <RoutineToolbar
                  search={search}
                  onSearch={setSearch}
                  view={view}
                  onView={(next) => {
                    setView(next);
                    const label = [...savedViews, ...quickFilters].find((item) => item.id === next)?.label;
                    push(`${tally(next)} period(s) in “${label ?? 'Full Week'}”.`, 'info');
                  }}
                  viewCounts={viewCounts}
                  quickCounts={quickCounts}
                  filters={filters}
                  onFilter={(key, value) => setFilters((current) => ({ ...current, [key]: value }))}
                  onResetFilters={resetFilters}
                  onApplyFilters={() => push(`${gridPeriods.length} period(s) match the current filters.`)}
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
                  matchCount={gridPeriods.length}
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

              {loading ? <RoutineSkeleton /> : null}

              {!loading ? (
                <div className="live-content">
                  <BulkActionBar
                    count={selected.length}
                    onAction={handleBulkAction}
                    onClear={() => setSelected([])}
                  />

                  <RoutineGrid
                    periods={gridPeriods}
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

                  <RoutineAgenda periods={filtered} blank={blank} />

                  <div className={`workspace-empty-state${blank ? ' show' : ''}`} id="clsEmpty">
                    <div className="workspace-empty-art">
                      <i className="ti ti-calendar-off" />
                    </div>
                    <h5>No periods match your filters</h5>
                    <p>Try adjusting your search terms or clearing the active filters to see the full routine.</p>
                    <button type="button" className="btn btn-primary" onClick={resetFilters}>
                      <i className="ti ti-rotate me-1" />
                      Reset filters
                    </button>
                  </div>

                  <WorkspaceFooter
                    shown={gridPeriods.length}
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
          {/* /Class Routine Workspace */}

          {/* Insights + Activity */}
          <InsightsPanel onAction={runAction} />
          {/* /Insights + Activity */}
        </div>
      </div>

      <RoutineModals
        active={activeModal}
        period={modalPeriod}
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

export default ClassRoutine;
