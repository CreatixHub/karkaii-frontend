import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import ToastStack from '@components/ui/ToastStack';
import { all_routes } from '@/routes/all_routes';
import { useReveal } from '@hooks/useReveal';
import { useToasts } from '@hooks/useToasts';
import BulkActionBar from './components/BulkActionBar';
import SyllabusSkeleton from './components/SyllabusSkeleton';
import SyllabusToolbar from './components/SyllabusToolbar';
import type { FilterChip } from './components/SyllabusToolbar';
import SyllabusTable from './components/SyllabusTable';
import WorkspaceFooter from './components/WorkspaceFooter';
import SyllabusModals from './modals/SyllabusModals';
import type { SyllabusDraft } from './modals/SyllabusModals';
import type {
  BulkAction,
  ColumnId,
  DensityId,
  FilterKey,
  RowMenuItem,
  SortKey,
  SyllabusModalId,
  SyllabusRow,
  ToolbarMenu,
} from './data/classSyllabus.data';
import {
  actionToasts,
  advancedFilters,
  allColumns,
  exportActions,
  quickFilters,
  savedViews,
  strings,
  syllabusRows,
} from './data/classSyllabus.data';

const routes = all_routes;

const REVEAL_MS = 850;
const REFRESH_MS = 700;

/** Facets whose option values are fragments of the `data-search` haystack. */
const HAYSTACK_FACETS: FilterKey[] = ['class', 'section'];

const facetValue = (row: SyllabusRow, key: FilterKey): string => {
  switch (key) {
    case 'year':
      return row.year;
    case 'subject':
      return row.name;
    case 'teacher':
      return row.teacher.name;
    case 'term':
      return row.term;
    case 'status':
      return row.status;
    case 'class':
    case 'section':
    default:
      return row.className;
  }
};

const sortValue = (row: SyllabusRow, key: SortKey): string | number => {
  switch (key) {
    case 'teacher':
      return row.teacher.name.toLowerCase();
    case 'term':
      return row.term.toLowerCase();
    case 'progress':
      return row.percent;
    case 'hours':
      return row.hours;
    case 'status':
      return row.status.toLowerCase();
    case 'name':
    default:
      return row.name.toLowerCase();
  }
};

const Syllabus = () => {
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

  const [roster, setRoster] = useState<SyllabusRow[]>(syllabusRows);
  const [selected, setSelected] = useState<string[]>([]);
  const [expanded, setExpanded] = useState<string[]>([]);
  const [rowMenuOpen, setRowMenuOpen] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState('10');

  const [activeModal, setActiveModal] = useState<SyllabusModalId | null>(null);
  const [modalSyllabus, setModalSyllabus] = useState<SyllabusRow | null>(null);
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
    const term = search.trim().toLowerCase();

    const matches = roster.filter((row) => {
      if (term && !row.search.includes(term)) return false;
      if (view !== 'all' && row.status !== view) return false;

      return advancedFilters.every((field) => {
        const wanted = filters[field.key];
        if (!wanted) return true;
        if (HAYSTACK_FACETS.includes(field.key)) return row.search.includes(wanted.toLowerCase());
        return facetValue(row, field.key) === wanted;
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

  const handleSort = (key: SortKey) => {
    if (sort === key) {
      setSortAsc((value) => !value);
      push(`Sorted by ${key} · ${sortAsc ? 'descending' : 'ascending'}`, 'info');
      return;
    }
    setSort(key);
    setSortAsc(true);
    push(key === 'recent' ? strings.recentSort : `Sorted by ${key} · ascending`, 'info');
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

  const openModal = useCallback((modal: SyllabusModalId, row: SyllabusRow | null = null) => {
    setModalSyllabus(row);
    setActiveModal(modal);
  }, []);
  const closeModal = () => setActiveModal(null);

  const runAction = (id: string, fallback?: string) => push(actionToasts[id] ?? fallback ?? 'Action completed');

  const setStatus = (ids: string[], status: SyllabusRow['status']) =>
    setRoster((current) =>
      current.map((row) =>
        ids.includes(row.id)
          ? {
              ...row,
              status,
              pillClass: status === 'Archived' ? 'is-archived' : 'is-new',
              pillIcon: status === 'Archived' ? 'ti ti-archive' : 'ti ti-send',
            }
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
    if (action.id === 'archive') {
      setStatus(selected, 'Archived');
      setSelected([]);
    }
    if (action.id === 'publish') setStatus(selected, 'Published');
    runAction(action.id);
  };

  const handleRowMenuAction = (item: RowMenuItem, row: SyllabusRow) => {
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
      setStatus([row.id], 'Archived');
      push(`${row.name} archived`);
      return;
    }
    if (item.id === 'publish') {
      setStatus([row.id], 'Published');
      push(`${row.name} published`);
      return;
    }
    runAction(item.id, `${item.label} — ${row.name}`);
  };

  const handleAdd = (draft: SyllabusDraft) => {
    const template = roster[0];
    const name = draft.group.trim() || 'New Syllabus';
    const className = draft.className === 'Select' ? template.className : `${draft.className}, ${draft.section}`;
    const id = `${name.slice(0, 3).toUpperCase()}-${900 + roster.length}`;

    setRoster((current) => [
      {
        ...template,
        id,
        name,
        subtitle: name,
        className,
        status: 'Draft',
        pillClass: 'is-inactive',
        pillIcon: null,
        percent: 0,
        topicsDone: 0,
        pending: template.topics,
        meterClass: 'meter-danger',
        updated: 'just now',
        search: `${name} ${id} ${template.year} class ${className}`.toLowerCase(),
      },
      ...current,
    ]);
    push(`${name} added successfully`);
  };

  const handleSave = (id: string, draft: SyllabusDraft) => {
    setRoster((current) =>
      current.map((row) =>
        row.id === id
          ? {
              ...row,
              name: draft.group || row.name,
              className:
                draft.className === 'Select' ? row.className : `${draft.className}, ${draft.section}`,
            }
          : row,
      ),
    );
    push('Syllabus updated');
  };

  const confirmDelete = () => {
    if (pendingDelete === 'bulk') {
      setRoster((current) => current.filter((row) => !selected.includes(row.id)));
      push(`${selected.length} syllabus(es) deleted`);
      setSelected([]);
    } else if (pendingDelete) {
      setRoster((current) => current.filter((row) => row.id !== pendingDelete));
      setSelected((current) => current.filter((item) => item !== pendingDelete));
      push('Syllabus deleted');
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
              <h3 className="page-title mb-1">Class Syllabus</h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={routes.adminDashboard}>Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <Link to="#">Academic</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Class Syllabus
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
                  Add Subject Group
                </Link>
              </div>
            </div>
          </div>
          {/* /Page Header */}

          {/* Syllabus List */}
          <div className="card">
            <div
              className={`data-workspace classes-workspace${loading ? '' : ' is-loaded'}${
                fullscreen ? ' is-fullscreen card-fullscreen' : ''
              }`}
              id="classWorkspace"
              data-density={density}
            >
              {!loading ? (
                <SyllabusToolbar
                  search={search}
                  onSearch={setSearch}
                  view={view}
                  onView={(next) => {
                    setView(next);
                    const label = savedViews.find((item) => item.id === next)?.label ?? 'All Syllabi';
                    push(`${tally(next)}${strings.viewMatch}${label}”.`, 'info');
                  }}
                  viewCounts={viewCounts}
                  quickCounts={quickCounts}
                  filters={filters}
                  onFilter={(key, value) => setFilters((current) => ({ ...current, [key]: value }))}
                  onResetFilters={resetFilters}
                  onApplyFilters={() => push(`${filtered.length}${strings.filterMatch}`)}
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

              {loading ? <SyllabusSkeleton /> : null}

              {!loading ? (
                <div className="live-content">
                  <BulkActionBar
                    count={selected.length}
                    onAction={handleBulkAction}
                    onClear={() => setSelected([])}
                  />

                  {pageRows.length > 0 ? (
                    <SyllabusTable
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
                      onView={(row) => openModal('view', row)}
                      onEdit={(row) => openModal('edit', row)}
                      onMenuAction={handleRowMenuAction}
                    />
                  ) : null}

                  <div className={`workspace-empty-state${filtered.length === 0 ? ' show' : ''}`} id="clsEmpty">
                    <div className="workspace-empty-art">
                      <i className="ti ti-mood-empty" />
                    </div>
                    <h5>No syllabi match your filters</h5>
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
                    onPage={setPage}
                  />
                </div>
              ) : null}

              <ToastStack toasts={toasts} onDismiss={dismiss} id="clsToasts" />
            </div>
          </div>
          {/* /Syllabus List */}
        </div>
      </div>

      <SyllabusModals
        active={activeModal}
        syllabus={modalSyllabus}
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

export default Syllabus;
