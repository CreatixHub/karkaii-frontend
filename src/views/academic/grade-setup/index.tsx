import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import ToastStack from '@components/ui/ToastStack';
import { all_routes } from '@/routes/all_routes';
import { useReveal } from '@hooks/useReveal';
import { useToasts } from '@hooks/useToasts';
import BulkActionBar from './components/BulkActionBar';
import GradesSkeleton from './components/GradesSkeleton';
import GradesToolbar from './components/GradesToolbar';
import type { FilterChip } from './components/GradesToolbar';
import GradesTable from './components/GradesTable';
import WorkspaceFooter from './components/WorkspaceFooter';
import GradesModals from './modals/GradesModals';
import type { GradeDraft } from './modals/GradesModals';
import type {
  BulkAction,
  ColumnId,
  DensityId,
  FilterKey,
  GradeModalId,
  GradeRow,
  GradeStatus,
  RowMenuItem,
  SortKey,
  ToolbarMenu,
} from './data/gradeSetup.data';
import {
  PILLS,
  actionToasts,
  advancedFilters,
  allColumns,
  exportActions,
  exportColumns,
  gradeRows,
  quickFilters,
  savedViews,
  strings,
} from './data/gradeSetup.data';

const routes = all_routes;

const REVEAL_MS = 850;
const REFRESH_MS = 700;

/** Facets whose option values are fragments of the `data-search` haystack. */
const HAYSTACK_FACETS: FilterKey[] = ['scale'];

interface Criteria {
  search: string;
  view: string;
  filters: Partial<Record<FilterKey, string>>;
}

const facetValue = (row: GradeRow, key: FilterKey): string => {
  switch (key) {
    case 'year':
      return row.year;
    case 'status':
      return row.status;
    case 'restype':
      return row.resultType;
    case 'scale':
    default:
      return row.scale;
  }
};

const matchRow = (row: GradeRow, { search, view, filters }: Criteria): boolean => {
  const term = search.trim().toLowerCase();
  if (term && !row.search.includes(term)) return false;
  if (view !== 'all' && row.status !== view) return false;

  return advancedFilters.every((field) => {
    const wanted = filters[field.key];
    if (!wanted) return true;
    if (HAYSTACK_FACETS.includes(field.key)) return row.search.includes(wanted.toLowerCase());
    return facetValue(row, field.key) === wanted;
  });
};

const sortValue = (row: GradeRow, key: SortKey): string | number => {
  switch (key) {
    case 'point':
      return row.pointValue;
    case 'min':
      return row.min;
    case 'updated':
      return Date.parse(row.updated) || 0;
    case 'status':
      return row.status.toLowerCase();
    case 'name':
    default:
      return row.name.toLowerCase();
  }
};

const Grades = () => {
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

  const [roster, setRoster] = useState<GradeRow[]>(gradeRows);
  const [selected, setSelected] = useState<string[]>([]);
  const [expanded, setExpanded] = useState<string[]>([]);
  const [rowMenuOpen, setRowMenuOpen] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState('10');

  const [activeModal, setActiveModal] = useState<GradeModalId | null>(null);
  const [modalGrade, setModalGrade] = useState<GradeRow | null>(null);
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
    if (!rowMenuOpen) return;
    const handlePointerDown = () => setRowMenuOpen(null);
    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, [rowMenuOpen]);

  /* -------------------------------- Filtering ------------------------------- */

  const filtered = useMemo(() => {
    const matches = roster.filter((row) => matchRow(row, { search, view, filters }));

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

  /**
   * `tables.js` re-ran `applyFilters()` and toasted its return value, so the count always
   * reflected the change that had just happened. React state has not settled yet at that
   * point, so the pending criteria are counted directly.
   */
  const countWith = useCallback(
    (override: Partial<Criteria>) =>
      roster.filter((row) => matchRow(row, { search, view, filters, ...override })).length,
    [roster, search, view, filters],
  );

  /* --------------------------------- Paging --------------------------------- */

  const size = Number(pageSize);
  const pageCount = Math.max(1, Math.ceil(filtered.length / size));
  const currentPage = Math.min(page, pageCount);
  const pageRows = filtered.slice((currentPage - 1) * size, currentPage * size);
  const rangeFrom = filtered.length === 0 ? 0 : (currentPage - 1) * size + 1;
  const rangeTo = Math.min(currentPage * size, filtered.length);

  useEffect(() => setPage(1), [search, view, filters, pageSize]);

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
        // `tables.js` L208 printed the raw `data-filter` key, not the panel's label.
        list.push({ id: field.key, label: `${field.label}: ${value}` });
        return list;
      }, []),
    [filters],
  );

  /* --------------------------------- Actions -------------------------------- */

  const runAction = (id: string, fallback?: string) => {
    const toast = actionToasts[id];
    if (toast) push(toast.message, toast.variant);
    else push(fallback ?? 'Action completed');
  };

  /** `tables.js` L394–414 — one CSV column per grid column, in the same order. */
  const downloadCsv = (rows: GradeRow[]) => {
    const lines = [
      exportColumns.map((column) => column.label),
      ...rows.map((row) => exportColumns.map((column) => column.value(row))),
    ];
    const csv = lines
      .map((line) => line.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');

    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = strings.csvFile;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.setTimeout(() => URL.revokeObjectURL(url), 1500);
  };

  const exportCsv = (rows: GradeRow[]) => {
    runAction('export_csv');
    downloadCsv(rows);
  };

  const printList = () => {
    runAction('print');
    window.print();
  };

  const resetFilters = () => {
    setSearch('');
    setView('all');
    setFilters({});
    runAction('clear_filters');
  };

  const handleSort = (key: SortKey, label: string) => {
    if (sort === key) {
      // A header click on the active column flips the direction.
      setSortAsc((value) => !value);
      push(`Sorted by ${label} · ${sortAsc ? 'descending' : 'ascending'}`, 'info');
      return;
    }
    setSort(key);
    setSortAsc(true);
    push(key === 'recent' ? strings.recentSort : `Sorted by ${label} · ascending`, 'info');
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
      runAction('refresh');
    }, REFRESH_MS);
  };

  const openModal = useCallback((modal: GradeModalId, row: GradeRow | null = null) => {
    setModalGrade(row);
    setActiveModal(modal);
  }, []);
  const closeModal = () => setActiveModal(null);

  const setStatus = (ids: string[], status: GradeStatus) =>
    setRoster((current) =>
      current.map((row) => (ids.includes(row.id) ? { ...row, status, ...PILLS[status] } : row)),
    );

  /** Only one band can be the default scale, so the incumbent falls back to Active. */
  const setDefault = (ids: string[]) =>
    setRoster((current) =>
      current.map((row) => {
        if (ids.includes(row.id)) return { ...row, status: 'Default' as GradeStatus, ...PILLS.Default };
        if (row.status === 'Default') return { ...row, status: 'Active' as GradeStatus, ...PILLS.Active };
        return row;
      }),
    );

  const handleBulkAction = (action: BulkAction) => {
    if (action.modal === 'delete') {
      setPendingDelete('bulk');
      openModal('delete');
      return;
    }
    if (action.id === 'print') {
      printList();
      return;
    }
    if (action.id === 'export_csv') {
      exportCsv(roster.filter((row) => selected.includes(row.id)));
      return;
    }
    if (action.id === 'archive') {
      setStatus(selected, 'Archived');
      setSelected([]);
    }
    if (action.id === 'set_default') setDefault(selected);
    runAction(action.id);
  };

  const handleRowMenuAction = (item: RowMenuItem, row: GradeRow) => {
    if (item.modal === 'delete') {
      setPendingDelete(row.id);
      openModal('delete');
      return;
    }
    if (item.modal) {
      openModal(item.modal, row);
      runAction(item.id, `${item.label} — ${row.name}`);
      return;
    }
    if (item.id === 'print') {
      printList();
      return;
    }
    if (item.id === 'export_csv') {
      exportCsv([row]);
      return;
    }
    if (item.id === 'archive') {
      setStatus([row.id], 'Archived');
    }
    if (item.id === 'set_default') {
      setDefault([row.id]);
    }
    if (item.id === 'duplicate') {
      const copy: GradeRow = {
        ...row,
        id: `${row.id}-copy-${roster.length + 1}`,
        name: `${row.name} (Copy)`,
        status: 'Draft',
        ...PILLS.Draft,
        updated: 'just now',
        search: `${row.search} draft copy`,
      };
      setRoster((current) => [copy, ...current]);
    }
    runAction(item.id, `${item.label} — ${row.name}`);
  };

  const handleAdd = (draft: GradeDraft) => {
    const letter = draft.grade.trim().toUpperCase() || 'N';
    const min = draft.marksFrom === 'Select' ? 0 : Number(draft.marksFrom);
    const max = draft.marksUpto === 'Select' ? 100 : Number(draft.marksUpto);
    const point = draft.gradePoints === 'Select' ? '0.0' : Number(draft.gradePoints).toFixed(1);
    const status: GradeStatus = draft.status === 'Inactive' ? 'Draft' : 'Active';
    const name = `Grade ${letter}`;
    const remark = draft.description.trim() || 'Newly added grade band.';

    const base = `grade-${letter.toLowerCase().replace('+', '-plus')}`;
    const id = roster.some((row) => row.id === base) ? `${base}-${roster.length + 1}` : base;

    const template = roster[0];
    setRoster((current) => [
      {
        ...template,
        id,
        name,
        letter,
        point,
        pointValue: Number(point),
        min,
        max,
        remark,
        updated: 'just now',
        status,
        ...PILLS[status],
        search: `${name} grade ${letter} ${point} ${template.scale} ${template.resultType} ${template.author.name} ${status} ${min}-${max}`.toLowerCase(),
      },
      ...current,
    ]);
    push(`${name} added successfully`);
  };

  const handleSave = (id: string, draft: GradeDraft) => {
    setRoster((current) =>
      current.map((row) =>
        row.id === id
          ? {
              ...row,
              letter: draft.grade.trim().toUpperCase() || row.letter,
              remark: draft.description.trim() || row.remark,
              min: draft.marksFrom === 'Select' ? row.min : Number(draft.marksFrom),
              max: draft.marksUpto === 'Select' ? row.max : Number(draft.marksUpto),
            }
          : row,
      ),
    );
    push('Grade updated');
  };

  const confirmDelete = () => {
    if (pendingDelete === 'bulk') {
      setRoster((current) => current.filter((row) => !selected.includes(row.id)));
      push(`${selected.length} grade(s) deleted`);
      setSelected([]);
    } else if (pendingDelete) {
      setRoster((current) => current.filter((row) => row.id !== pendingDelete));
      setSelected((current) => current.filter((item) => item !== pendingDelete));
      push('Grade deleted');
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
              <h3 className="page-title mb-1">Grade</h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={routes.adminDashboard}>Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <Link to="#">Academic</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Grade
                  </li>
                </ol>
              </nav>
            </div>
            {/* Page-level actions. Grid tools (search, filters, columns,
                density, refresh) live in the workspace toolbar instead. */}
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
                          if (action.id === 'export_csv') exportCsv(filtered);
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
              <div className="me-2 mb-2">
                <Link
                  to="#"
                  className="btn btn-outline-light bg-white btn-sm fw-medium d-inline-flex align-items-center"
                  onClick={printList}
                >
                  <i className="ti ti-printer me-2" />
                  Print
                </Link>
              </div>
              <div className="mb-2">
                <Link
                  to="#"
                  className="btn btn-primary btn-sm d-flex align-items-center"
                  onClick={() => openModal('add')}
                >
                  <i className="ti ti-square-rounded-plus me-2" />
                  Add Grade
                </Link>
              </div>
            </div>
          </div>
          {/* /Page Header */}

          {/* Grade Workspace */}
          <div className="card">
            <div
              className={`data-workspace classes-workspace${loading ? '' : ' is-loaded'}${
                fullscreen ? ' is-fullscreen card-fullscreen' : ''
              }`}
              id="classWorkspace"
              data-density={density}
            >
              {!loading ? (
                <GradesToolbar
                  search={search}
                  onSearch={setSearch}
                  view={view}
                  onView={(next) => {
                    setView(next);
                    const label = savedViews.find((item) => item.id === next)?.label ?? 'All Grades';
                    push(`${countWith({ view: next })}${strings.viewMatch}${label}”.`, 'info');
                  }}
                  viewCounts={viewCounts}
                  quickCounts={quickCounts}
                  filters={filters}
                  onFilter={(key, value) => {
                    const next = { ...filters, [key]: value };
                    setFilters(next);
                    push(`${countWith({ filters: next })}${strings.filterMatch}`, 'info');
                  }}
                  onResetFilters={resetFilters}
                  onApplyFilters={() => push(`${filtered.length}${strings.applyMatch}`)}
                  columns={columns}
                  onColumn={(id, visible) => {
                    setColumns((current) => ({ ...current, [id]: visible }));
                    push(`${visible ? 'Showing' : 'Hiding'} the ${id} column.`, 'info');
                  }}
                  onResetColumns={() => {
                    setColumns(allColumns);
                    runAction('reset_columns');
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
                  onPrint={printList}
                  fullscreen={fullscreen}
                  onToggleFullscreen={() => {
                    const next = !fullscreen;
                    setFullscreen(next);
                    push(next ? 'Entered fullscreen — press Esc to exit.' : 'Exited fullscreen.', 'info');
                  }}
                  onSaveView={() => runAction('save_view')}
                />
              ) : null}

              {loading ? <GradesSkeleton /> : null}

              {!loading ? (
                <div className="live-content">
                  <BulkActionBar
                    count={selected.length}
                    onAction={handleBulkAction}
                    onClear={() => setSelected([])}
                  />

                  {pageRows.length > 0 ? (
                    <GradesTable
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
                      onView={(row) => {
                        openModal('view', row);
                        runAction('view');
                      }}
                      onEdit={(row) => openModal('edit', row)}
                      onMenuAction={handleRowMenuAction}
                    />
                  ) : null}

                  <div className={`workspace-empty-state${filtered.length === 0 ? ' show' : ''}`} id="clsEmpty">
                    <div className="workspace-empty-art">
                      <i className="ti ti-award-off" />
                    </div>
                    <h5>No grades match your filters</h5>
                    <p>Try adjusting your search terms or clearing the active filters to see more results.</p>
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
                    onPage={(next) => {
                      setPage(next);
                      runAction('page');
                    }}
                  />
                </div>
              ) : null}

              <ToastStack toasts={toasts} onDismiss={dismiss} id="clsToasts" />
            </div>
          </div>
          {/* /Grade Workspace */}
        </div>
      </div>

      <GradesModals
        active={activeModal}
        grade={modalGrade}
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

export default Grades;
