import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import ToastStack from '@components/ui/ToastStack';
import { all_routes } from '@/routes/all_routes';
import { useReveal } from '@hooks/useReveal';
import { useToasts } from '@hooks/useToasts';
import BulkActionBar from './components/BulkActionBar';
import MaterialsSkeleton from './components/MaterialsSkeleton';
import MaterialsTable from './components/MaterialsTable';
import MaterialsToolbar from './components/MaterialsToolbar';
import type { FilterChip } from './components/MaterialsToolbar';
import WorkspaceFooter from './components/WorkspaceFooter';
import MaterialsModals from './modals/MaterialsModals';
import type { MaterialDraft } from './modals/MaterialsModals';
import type {
  BulkAction,
  ColumnId,
  DensityId,
  FilterKey,
  MaterialModalId,
  MaterialRow,
  MaterialStatus,
  RowMenuItem,
  SortKey,
  ToolbarMenu,
} from './data/studyMaterials.data';
import {
  actionToasts,
  advancedFilters,
  allColumns,
  exportActions,
  materialRows,
  quickFilters,
  savedViews,
  sortOptions,
  strings,
  tableHeaders,
} from './data/studyMaterials.data';

const routes = all_routes;

const REVEAL_MS = 850;
/** `tables.js` L470 re-reveals the skeleton after 700 ms on refresh. */
const REFRESH_MS = 700;

/** Facets whose option values are fragments of the `data-search` haystack. */
const HAYSTACK_FACETS: FilterKey[] = ['class', 'section', 'date'];

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** The status pill pairs the template renders alongside each status word. */
const PILLS: Record<MaterialStatus, { pillClass: string; pillIcon: string }> = {
  Published: { pillClass: 'is-active', pillIcon: 'ti ti-circle-check' },
  Draft: { pillClass: 'is-pending', pillIcon: 'ti ti-pencil' },
  Archived: { pillClass: 'is-archived', pillIcon: 'ti ti-archive' },
};

/** File-type tile, badge and icon — the template paired all three off the material type. */
const TYPE_META: Record<string, { typeBadge: string; typeIcon: string; tone: string }> = {
  PDF: { typeBadge: 'badge-soft-danger', typeIcon: 'ti ti-file-type-pdf', tone: 'danger' },
  PPT: { typeBadge: 'badge-soft-warning', typeIcon: 'ti ti-file-type-ppt', tone: 'warning' },
  DOC: { typeBadge: 'badge-soft-primary', typeIcon: 'ti ti-file-type-doc', tone: 'primary' },
  Video: { typeBadge: 'badge-soft-info', typeIcon: 'ti ti-video', tone: 'info' },
  Link: { typeBadge: 'badge-soft-success', typeIcon: 'ti ti-link', tone: 'success' },
  Audio: { typeBadge: 'badge-soft-purple', typeIcon: 'ti ti-headphones', tone: 'purple' },
};

/** The Add/Edit dialogs offer "Document"; the grid's own label for it is "DOC". */
const normaliseType = (type: string): string => {
  if (type === 'Document') return 'DOC';
  return TYPE_META[type] ? type : 'PDF';
};

const typeMeta = (type: string) => TYPE_META[type] ?? TYPE_META.PDF;

const today = (): string => {
  const now = new Date();
  return `${String(now.getDate()).padStart(2, '0')} ${MONTHS[now.getMonth()]} ${now.getFullYear()}`;
};

/** "03 May 2024" → 20240503, so upload dates sort chronologically rather than as text. */
const dateValue = (value: string): number => {
  const [day, month, year] = value.split(' ');
  const index = MONTHS.findIndex((name) => name.toLowerCase() === (month ?? '').slice(0, 3).toLowerCase());
  return Number(year ?? 0) * 10000 + (index + 1) * 100 + Number(day ?? 0);
};

/**
 * Rebuilds the row's `data-search` haystack in the template's own order — title, code,
 * subject, year, class, section, uploader, status, type, date — so edited and added rows stay
 * searchable and filterable exactly like the shipped ones.
 */
const buildSearch = (row: MaterialRow): string => {
  const [className, section] = row.className.split('-');
  return `${row.title} ${row.id} ${row.subject} ${row.year} class ${className ?? ''} sec ${section ?? ''} ${
    row.teacher.name
  } ${row.status} ${row.type} ${row.date}`
    .replace(/\s+/g, ' ')
    .toLowerCase();
};

const facetValue = (row: MaterialRow, key: FilterKey): string => {
  switch (key) {
    case 'year':
      return row.year;
    case 'subject':
      return row.subject;
    case 'type':
      return row.type;
    case 'teacher':
      return row.teacher.name;
    case 'status':
      return row.status;
    case 'class':
      return row.className;
    case 'section':
    default:
      return row.className.split('-')[1] ?? '';
  }
};

const sortValue = (row: MaterialRow, key: SortKey): string | number => {
  switch (key) {
    case 'subject':
      return row.subject.toLowerCase();
    case 'teacher':
      return row.teacher.name.toLowerCase();
    case 'date':
      return dateValue(row.date);
    case 'downloads':
      return row.downloads;
    case 'status':
      return row.status.toLowerCase();
    case 'name':
    case 'recent':
    default:
      return row.title.toLowerCase();
  }
};

const sortLabel = (key: SortKey): string =>
  sortOptions.find((option) => option.id === key)?.label ??
  tableHeaders.find((header) => header.sort === key)?.label ??
  key;

const StudyMaterials = () => {
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

  const [roster, setRoster] = useState<MaterialRow[]>(materialRows);
  const [selected, setSelected] = useState<string[]>([]);
  const [expanded, setExpanded] = useState<string[]>([]);
  const [rowMenuOpen, setRowMenuOpen] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState('10');

  const [activeModal, setActiveModal] = useState<MaterialModalId | null>(null);
  const [activeRow, setActiveRow] = useState<MaterialRow | null>(null);
  const [pendingDelete, setPendingDelete] = useState<string | 'bulk' | null>(null);

  const [refreshing, setRefreshing] = useState(false);
  const exportRef = useRef<HTMLDivElement>(null);
  /** Material codes run SM240501–SM240510, so anything new continues the sequence. */
  const nextCode = useRef(materialRows.length + 1);

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
        // The trailing space keeps "class x" off the XI and XII rows.
        if (HAYSTACK_FACETS.includes(field.key)) {
          return `${row.search} `.includes(`${wanted.toLowerCase()} `);
        }
        return facetValue(row, field.key) === wanted;
      });
    });

    // "Recently uploaded" is the order the rows ship in, so it never re-sorts.
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

  const runAction = (id: string, fallback?: string) => push(actionToasts[id] ?? fallback ?? 'Action completed');

  const resetFilters = () => {
    setSearch('');
    setView('all');
    setFilters({});
    push(actionToasts.clear_filters);
  };

  const handleSort = (key: SortKey) => {
    if (sort === key) {
      const next = !sortAsc;
      setSortAsc(next);
      push(
        key === 'recent'
          ? strings.recentSort
          : `Sorted by ${sortLabel(key)} · ${next ? 'ascending' : 'descending'}`,
        'info',
      );
      return;
    }
    setSort(key);
    setSortAsc(true);
    push(key === 'recent' ? strings.recentSort : `Sorted by ${sortLabel(key)} · ascending`, 'info');
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

  const openModal = useCallback((modal: MaterialModalId, row: MaterialRow | null = null) => {
    setActiveRow(row);
    setActiveModal(modal);
  }, []);
  const closeModal = () => setActiveModal(null);

  const printList = () => {
    push(actionToasts.print, 'info');
    window.print();
  };

  const setStatus = (ids: string[], status: MaterialStatus) =>
    setRoster((current) =>
      current.map((row) =>
        ids.includes(row.id)
          ? { ...row, status, ...PILLS[status], search: buildSearch({ ...row, status }) }
          : row,
      ),
    );

  const makeCode = () => `SM2405${String(nextCode.current++).padStart(2, '0')}`;

  /** `tables.js` toasted "Material duplicated as a draft." — the copy actually appears here. */
  const duplicate = (row: MaterialRow) => {
    const copy: MaterialRow = {
      ...row,
      id: makeCode(),
      title: `${row.title} (Copy)`,
      status: 'Draft',
      ...PILLS.Draft,
      downloads: 0,
      date: today(),
    };
    setRoster((current) => {
      const index = current.findIndex((item) => item.id === row.id);
      const next = [...current];
      next.splice(index + 1, 0, { ...copy, search: buildSearch(copy) });
      return next;
    });
    runAction('duplicate');
  };

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
    if (action.id === 'archive') {
      setStatus(selected, 'Archived');
      setSelected([]);
    }
    if (action.id === 'publish') setStatus(selected, 'Published');
    runAction(action.id);
  };

  const handleRowMenuAction = (item: RowMenuItem, row: MaterialRow) => {
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
      printList();
      return;
    }
    if (item.id === 'duplicate') {
      duplicate(row);
      return;
    }
    if (item.id === 'archive') {
      setStatus([row.id], 'Archived');
      runAction('archive');
      return;
    }
    if (item.id === 'publish') {
      // The menu entry reads "Publish/Unpublish", so it flips between the two.
      setStatus([row.id], row.status === 'Published' ? 'Draft' : 'Published');
      runAction('publish');
      return;
    }
    runAction(item.id, `${item.label} — ${row.title}`);
  };

  const handleAdd = (draft: MaterialDraft) => {
    const type = normaliseType(draft.type);
    const status: MaterialStatus = draft.visibility === 'Published' ? 'Published' : 'Draft';
    const className = draft.className === 'Select' ? 'X' : draft.className;
    const section = draft.section === 'Select' ? 'A' : draft.section;
    const uploader = roster[0]?.teacher ?? { name: 'Erickson', avatar: 'assets/img/teachers/teacher-01.jpg' };

    const created: MaterialRow = {
      id: makeCode(),
      title: draft.title.trim() || 'Untitled Material',
      subject: draft.subject === 'Select' ? 'Mathematics' : draft.subject,
      type,
      ...typeMeta(type),
      year: roster[0]?.year ?? '2024/2025',
      className: `${className}-${section}`,
      chapter: draft.chapter.trim() || 'Chapter 1',
      teacher: uploader,
      date: today(),
      downloads: 0,
      size: '—',
      status,
      ...PILLS[status],
      search: '',
    };

    setRoster((current) => [{ ...created, search: buildSearch(created) }, ...current]);
    push(`${created.title} added successfully.`);
  };

  const handleSave = (id: string, draft: MaterialDraft) => {
    const type = normaliseType(draft.type);
    const status: MaterialStatus = draft.visibility === 'Published' ? 'Published' : 'Draft';

    setRoster((current) =>
      current.map((row) => {
        if (row.id !== id) return row;
        const className = draft.className === 'Select' ? row.className.split('-')[0] : draft.className;
        const section = draft.section === 'Select' ? row.className.split('-')[1] : draft.section;
        const next: MaterialRow = {
          ...row,
          title: draft.title.trim() || row.title,
          subject: draft.subject === 'Select' ? row.subject : draft.subject,
          type,
          ...typeMeta(type),
          className: `${className}-${section}`,
          chapter: draft.chapter.trim() || row.chapter,
          status,
          ...PILLS[status],
        };
        return { ...next, search: buildSearch(next) };
      }),
    );
    push('Study material updated.');
  };

  const confirmDelete = () => {
    if (pendingDelete === 'bulk') {
      setRoster((current) => current.filter((row) => !selected.includes(row.id)));
      push(`${selected.length} material(s) deleted.`);
      setSelected([]);
    } else if (pendingDelete) {
      setRoster((current) => current.filter((row) => row.id !== pendingDelete));
      setSelected((current) => current.filter((item) => item !== pendingDelete));
      push('Study material deleted.');
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
              <h3 className="page-title mb-1">Study Materials</h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={routes.adminDashboard}>Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <Link to="#">Academic</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Study Materials
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
                  {exportActions
                    .filter((action) => action.id !== 'print')
                    .map((action) => (
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
                  Add Study Material
                </Link>
              </div>
            </div>
          </div>
          {/* /Page Header */}

          {/* Study Materials Workspace */}
          <div className="card">
            <div
              className={`data-workspace classes-workspace${loading ? '' : ' is-loaded'}${
                fullscreen ? ' is-fullscreen card-fullscreen' : ''
              }`}
              id="classWorkspace"
              data-density={density}
            >
              {!loading ? (
                <MaterialsToolbar
                  search={search}
                  onSearch={setSearch}
                  view={view}
                  onView={(next) => {
                    setView(next);
                    const label = savedViews.find((item) => item.id === next)?.label ?? 'All Materials';
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

              {loading ? <MaterialsSkeleton /> : null}

              {!loading ? (
                <div className="live-content">
                  <BulkActionBar
                    count={selected.length}
                    onAction={handleBulkAction}
                    onClear={() => setSelected([])}
                  />

                  {pageRows.length > 0 ? (
                    <MaterialsTable
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

                  {/* Empty state */}
                  <div className={`workspace-empty-state${filtered.length === 0 ? ' show' : ''}`} id="clsEmpty">
                    <div className="workspace-empty-art">
                      <i className="ti ti-files-off" />
                    </div>
                    <h5>No study materials match your filters</h5>
                    <p>Try adjusting your search terms or clearing the active filters to see more results.</p>
                    <button type="button" className="btn btn-primary" onClick={resetFilters}>
                      <i className="ti ti-rotate me-1" />
                      Reset filters
                    </button>
                  </div>

                  {/* Footer */}
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
                      push(actionToasts.page, 'info');
                    }}
                  />
                </div>
              ) : null}

              <ToastStack toasts={toasts} onDismiss={dismiss} id="clsToasts" />
            </div>
          </div>
          {/* /Study Materials Workspace */}
        </div>
      </div>

      <MaterialsModals
        active={activeModal}
        material={activeRow}
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

export default StudyMaterials;
