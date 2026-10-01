import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import ToastStack from '@components/ui/ToastStack';
import { all_routes } from '@/routes/all_routes';
import { useReveal } from '@hooks/useReveal';
import { useToasts } from '@hooks/useToasts';
import BulkActionBar from './components/BulkActionBar';
import ClassesContextMenu from './components/ClassesContextMenu';
import ClassesSkeleton from './components/ClassesSkeleton';
import ClassesToolbar from './components/ClassesToolbar';
import type { FilterChip } from './components/ClassesToolbar';
import ClassesTable from './components/ClassesTable';
import WorkspaceFooter from './components/WorkspaceFooter';
import ClassesModals from './modals/ClassesModals';
import type { ClassDraft } from './modals/ClassesModals';
import type {
  BulkAction,
  ClassRow,
  ClassesModalId,
  ColumnId,
  DensityId,
  FilterKey,
  RowMenuItem,
  SortKey,
  ToolbarMenu,
} from './data/classes.data';
import {
  actionToasts,
  advancedFilters,
  allColumns,
  classRows,
  exportActions,
  filterFieldLabels,
  quickFilters,
  savedViews,
} from './data/classes.data';

const routes = all_routes;

/** `classes.js` reveals the workspace 850 ms after load. */
const REVEAL_MS = 850;
/** ...and 700 ms after a manual refresh. */
const REFRESH_MS = 700;

/** Facets whose option values are fragments of the `data-search` haystack. */
const HAYSTACK_FACETS: FilterKey[] = ['category', 'teacher', 'room', 'year'];

/** The section letter, parsed out of "Class I · Section A". */
const sectionOf = (row: ClassRow) => row.name.split('Section ')[1] ?? '';

/** "Under 25" / "25–35" / "Over 35" against the real strength. */
const matchesStrength = (row: ClassRow, band: string) => {
  if (band === 'Under 25') return row.students < 25;
  if (band === 'Over 35') return row.students > 35;
  return row.students >= 25 && row.students <= 35;
};

const sortValue = (row: ClassRow, key: SortKey): string | number => {
  switch (key) {
    case 'strength':
      return row.students;
    case 'cat':
      return row.category.toLowerCase();
    case 'teacher':
      return row.teacher?.name.toLowerCase() ?? '';
    case 'status':
      return row.status;
    case 'name':
    default:
      return row.name.toLowerCase();
  }
};

const Classes = () => {
  /* ---------------------------------- State --------------------------------- */
  const [search, setSearch] = useState('');
  const [view, setView] = useState('all');
  const [filters, setFilters] = useState<Partial<Record<FilterKey, string>>>({});
  const [columns, setColumns] = useState<Record<ColumnId, boolean>>(allColumns);
  const [density, setDensity] = useState<DensityId>('default');
  const [sort, setSort] = useState<SortKey>('recent');
  const [sortAsc, setSortAsc] = useState(true);
  const [openMenu, setOpenMenu] = useState<ToolbarMenu>(null);
  const [exportOpen, setExportOpen] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);

  const [roster, setRoster] = useState<ClassRow[]>(classRows);
  const [selected, setSelected] = useState<string[]>([]);
  const [expanded, setExpanded] = useState<string[]>([]);
  const [rowMenuOpen, setRowMenuOpen] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState('10');

  const [activeModal, setActiveModal] = useState<ClassesModalId | null>(null);
  const [modalRow, setModalRow] = useState<ClassRow | null>(null);
  const [pendingDelete, setPendingDelete] = useState<string | 'bulk' | null>(null);

  const [context, setContext] = useState<{ row: ClassRow | null; x: number; y: number }>({
    row: null,
    x: 0,
    y: 0,
  });

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

  // Escape leaves fullscreen, matching `classes.js` L378–380.
  useEffect(() => {
    if (!fullscreen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setFullscreen(false);
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [fullscreen]);

  // The row overflow menu closes on any outside click.
  useEffect(() => {
    if (!rowMenuOpen) return;
    const handlePointerDown = () => setRowMenuOpen(null);
    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, [rowMenuOpen]);

  /* -------------------------------- Filtering ------------------------------- */

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();

    const matches = roster.filter((row) => {
      if (term && !row.search.includes(term)) return false;
      // "unassigned" is the one quick filter that is not a status.
      if (view === 'unassigned' && row.teacher) return false;
      if (view !== 'all' && view !== 'unassigned' && row.status !== view) return false;

      return advancedFilters.every((field) => {
        const wanted = filters[field.key];
        if (!wanted) return true;
        if (field.key === 'section') return sectionOf(row) === wanted;
        if (field.key === 'strength') return matchesStrength(row, wanted);
        // "Fully assigned" and friends have no counterpart in the row data, so the
        // template's substring match against the haystack is all there is to do.
        if (field.key === 'subjects') return row.search.includes(wanted.toLowerCase());
        if (HAYSTACK_FACETS.includes(field.key)) return row.search.includes(wanted.toLowerCase());
        return row.status === wanted.toLowerCase();
      });
    });

    // "Recently updated" is the order the rows ship in, so it never re-sorts.
    if (sort === 'recent') return matches;

    return [...matches].sort((a, b) => {
      const left = sortValue(a, sort);
      const right = sortValue(b, sort);
      if (left < right) return sortAsc ? -1 : 1;
      if (left > right) return sortAsc ? 1 : -1;
      return 0;
    });
  }, [roster, search, view, filters, sort, sortAsc]);

  /* --------------------------------- Paging --------------------------------- */

  const size = Number(pageSize);
  const pageCount = Math.max(1, Math.ceil(filtered.length / size));
  const currentPage = Math.min(page, pageCount);
  const pageRows = filtered.slice((currentPage - 1) * size, currentPage * size);
  const rangeFrom = filtered.length === 0 ? 0 : (currentPage - 1) * size + 1;
  const rangeTo = Math.min(currentPage * size, filtered.length);

  // Any change that shrinks the result set should bring the reader back to page 1.
  useEffect(() => setPage(1), [search, view, filters, pageSize]);

  /* --------------------------------- Counts --------------------------------- */

  const tally = useCallback(
    (id: string) => {
      if (id === 'all') return roster.length;
      if (id === 'unassigned') return roster.filter((row) => !row.teacher).length;
      return roster.filter((row) => row.status === id).length;
    },
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
        // The template's chip read "<data-filter>: <value>", not the panel label.
        if (value) list.push({ id: field.key, label: `${field.label}: ${value}` });
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

  const handleSort = (key: SortKey) => {
    if (sort === key) {
      setSortAsc((value) => !value);
      push(`Sorted by ${key} · ${sortAsc ? 'descending' : 'ascending'}`, 'info');
      return;
    }
    setSort(key);
    setSortAsc(true);
    push(
      key === 'recent'
        ? 'Showing the most recently updated classes first.'
        : `Sorted by ${key} · ascending`,
      'info',
    );
  };

  const toggleSelect = (id: string) =>
    setSelected((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));

  const toggleExpand = (id: string) =>
    setExpanded((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));

  const pageIds = pageRows.map((row) => row.id);
  const allChecked = pageIds.length > 0 && pageIds.every((id) => selected.includes(id));
  const someChecked = pageIds.some((id) => selected.includes(id));

  const toggleAll = (checked: boolean) =>
    setSelected((current) =>
      checked ? Array.from(new Set([...current, ...pageIds])) : current.filter((id) => !pageIds.includes(id)),
    );

  const refresh = () => {
    setRefreshing(true);
    window.setTimeout(() => {
      setRefreshing(false);
      push(actionToasts.refresh);
    }, REFRESH_MS);
  };

  const openModal = useCallback((modal: ClassesModalId, row: ClassRow | null = null) => {
    setModalRow(row);
    setActiveModal(modal);
  }, []);
  const closeModal = () => setActiveModal(null);

  /** Toast copy for the actions the template fired but never implemented. */
  const runAction = (id: string, fallback?: string) => push(actionToasts[id] ?? fallback ?? 'Action completed');

  const archive = (ids: string[]) =>
    setRoster((current) =>
      current.map((row) =>
        ids.includes(row.id)
          ? { ...row, status: 'archived', statusLabel: 'Archived', pillClass: 's-inactive' }
          : row,
      ),
    );

  const handleBulkAction = (action: BulkAction) => {
    if (action.modal === 'delete') {
      setPendingDelete('bulk');
      openModal('delete');
      return;
    }
    if (action.modal) {
      openModal(action.modal);
      return;
    }
    if (action.id === 'print') {
      window.print();
      return;
    }
    if (action.id === 'archive') {
      archive(selected);
      setSelected([]);
    }
    runAction(action.id);
  };

  const handleRowMenuAction = (item: RowMenuItem, row: ClassRow) => {
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
    if (item.id === 'archive') {
      archive([row.id]);
      push(`${row.name} archived`);
      return;
    }
    runAction(item.id, `${item.label} — ${row.name}`);
  };

  const handleAdd = (draft: ClassDraft) => {
    const template = roster[0];
    // Counting rows would reuse a code after a delete, so take the highest in use.
    const nextNumber =
      roster.reduce((max, row) => Math.max(max, Number(row.id.split('-')[2]) || 0), 0) + 1;
    const name = draft.name.trim() || 'New Class';
    const section = draft.section === 'Select' ? 'A' : draft.section;
    const students = Number(draft.students) || 0;

    setRoster((current) => [
      {
        ...template,
        id: `CLS-2024-${String(nextNumber).padStart(3, '0')}`,
        name: `Class ${name} · Section ${section}`,
        numeral: name,
        students,
        status: draft.active ? 'active' : 'inactive',
        statusLabel: draft.active ? 'Active' : 'Inactive',
        pillClass: draft.active ? 's-active' : 's-inactive',
        search: `class ${name} - section ${section} ${template.category} ${students}`.toLowerCase(),
      },
      ...current,
    ]);
    push(`Class ${name} · Section ${section} added successfully`);
  };

  const handleSave = (id: string, draft: ClassDraft) => {
    setRoster((current) =>
      current.map((row) =>
        row.id === id
          ? {
              ...row,
              name: `Class ${draft.name || row.numeral} · Section ${draft.section}`,
              numeral: draft.name || row.numeral,
              students: Number(draft.students) || row.students,
              status: draft.active ? 'active' : 'inactive',
              statusLabel: draft.active ? 'Active' : 'Inactive',
              pillClass: draft.active ? 's-active' : 's-inactive',
            }
          : row,
      ),
    );
    push('Class updated');
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

  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          {/* Page Header */}
          <div className="d-md-flex d-block align-items-center justify-content-between flex-wrap gap-2 mb-3">
            <div className="my-auto mb-2">
              <h3 className="page-title mb-1">Classes List</h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={routes.adminDashboard}>Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <Link to="#">Classes </Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    All Classes
                  </li>
                </ol>
              </nav>
            </div>
            {/* Page-level actions. Grid-level actions (search, filters, columns,
                export, refresh, density) live in the workspace toolbar instead. */}
            <div className="d-flex my-xl-auto right-content align-items-center flex-wrap">
              <div className="me-2 mb-2">
                <Link
                  to="#"
                  className="btn btn-outline-light bg-white fw-medium d-inline-flex align-items-center"
                  onClick={() => openModal('import')}
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
                  onClick={() => openModal('add')}
                >
                  <i className="ti ti-square-rounded-plus me-2" />
                  Add Class
                </Link>
              </div>
            </div>
          </div>
          {/* /Page Header */}

          {/* Classes List */}
          <div className="card">
            <div
              className={`data-workspace classes-workspace${loading ? '' : ' is-loaded'}${
                fullscreen ? ' is-fullscreen card-fullscreen' : ''
              }`}
              id="classWorkspace"
              data-density={density}
            >
              {!loading ? (
                <ClassesToolbar
                  search={search}
                  onSearch={setSearch}
                  view={view}
                  onView={(next) => {
                    setView(next);
                    const label = [...savedViews, ...quickFilters].find((item) => item.id === next)?.label;
                    push(`${tally(next)} class(es) in “${label ?? 'All Classes'}”.`, 'info');
                  }}
                  viewCounts={viewCounts}
                  quickCounts={quickCounts}
                  filters={filters}
                  onFilter={(key, value) => {
                    setFilters((current) => ({ ...current, [key]: value }));
                    push(`Filtering by ${filterFieldLabels[key]}.`, 'info');
                  }}
                  onResetFilters={resetFilters}
                  onApplyFilters={() => push(`${filtered.length} class(es) match the current filters.`)}
                  columns={columns}
                  onColumn={(id, visible) => {
                    setColumns((current) => ({ ...current, [id]: visible }));
                    push(`${visible ? 'Showing' : 'Hiding'} the ${id} column.`, 'info');
                  }}
                  onResetColumns={() => {
                    setColumns(allColumns);
                    push(actionToasts.reset_columns);
                  }}
                  density={density}
                  onDensity={setDensity}
                  matchCount={filtered.length}
                  totalCount={roster.length}
                  sort={sort}
                  onSort={handleSort}
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

              {loading ? <ClassesSkeleton /> : null}

              {!loading ? (
                <div className="live-content">
                  <BulkActionBar
                    count={selected.length}
                    onAction={handleBulkAction}
                    onClear={() => setSelected([])}
                  />

                  {pageRows.length > 0 ? (
                    <ClassesTable
                      rows={pageRows}
                      columns={columns}
                      sort={sort}
                      sortAsc={sortAsc}
                      onSort={handleSort}
                      selected={selected}
                      onToggleSelect={toggleSelect}
                      allChecked={allChecked}
                      someChecked={someChecked}
                      onToggleAll={toggleAll}
                      expanded={expanded}
                      onToggleExpand={toggleExpand}
                      openMenu={rowMenuOpen}
                      onOpenMenu={setRowMenuOpen}
                      onView={(item) => openModal('view', item)}
                      onEdit={(item) => openModal('edit', item)}
                      onMenuAction={handleRowMenuAction}
                      onContextMenu={(item, x, y) => setContext({ row: item, x, y })}
                    />
                  ) : null}

                  <div
                    className={`workspace-empty-state${filtered.length === 0 ? ' show' : ''}`}
                    id="clsEmpty"
                  >
                    <div className="workspace-empty-art">
                      <i className="ti ti-mood-empty" />
                    </div>
                    <h5>No classes match your filters</h5>
                    <p>
                      Try adjusting your search terms or clearing the active filters to see more results.
                    </p>
                    <button type="button" className="btn btn-primary" onClick={resetFilters}>
                      <i className="ti ti-rotate me-1" />
                      Reset filters
                    </button>
                  </div>

                  <WorkspaceFooter
                    rangeFrom={rangeFrom}
                    rangeTo={rangeTo}
                    total={filtered.length}
                    pageSize={pageSize}
                    onPageSize={setPageSize}
                    page={currentPage}
                    pageCount={pageCount}
                    onPage={setPage}
                  />
                </div>
              ) : null}

              <ClassesContextMenu
                row={context.row}
                x={context.x}
                y={context.y}
                onClose={() => setContext((current) => ({ ...current, row: null }))}
                onAction={handleRowMenuAction}
              />

              <ToastStack toasts={toasts} onDismiss={dismiss} id="clsToasts" />
            </div>
          </div>
          {/* /Classes List */}
        </div>
      </div>

      <ClassesModals
        active={activeModal}
        row={modalRow}
        selectedCount={pendingDelete === 'bulk' ? selected.length : 1}
        onClose={closeModal}
        onToast={push}
        onAdd={handleAdd}
        onSave={handleSave}
        onConfirmDelete={confirmDelete}
      />
    </>
  );
};

export default Classes;
