import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import ToastStack from '@components/ui/ToastStack';
import { all_routes } from '@/routes/all_routes';
import { useReveal } from '@hooks/useReveal';
import { useToasts } from '@hooks/useToasts';
import BulkActionBar from './components/BulkActionBar';
import GuardianListSkeleton from './components/GuardianListSkeleton';
import GuardianListToolbar from './components/GuardianListToolbar';
import type { FilterChip } from './components/GuardianListToolbar';
import GuardianTable from './components/GuardianTable';
import WorkspaceFooter from './components/WorkspaceFooter';
import GuardianListModals from './modals/GuardianListModals';
import type {
  BulkAction,
  ColumnId,
  DensityId,
  FilterKey,
  GuardianListModalId,
  GuardianRow,
  RowMenuItem,
  SortKey,
  ToolbarMenu,
} from './data/guardiansList.data';
import {
  actionToasts,
  advancedFilters,
  allColumns,
  exportActions,
  guardianRows,
  quickFilters,
  savedViews,
} from './data/guardiansList.data';

const routes = all_routes;

/** Facets whose option values are fragments of the `data-search` haystack. */
const HAYSTACK_FACETS: FilterKey[] = ['class', 'section', 'transport', 'registered'];

const facetValue = (row: GuardianRow, key: FilterKey): string => {
  switch (key) {
    case 'relationship':
      return row.relationship;
    case 'occupation':
      return row.occupation;
    case 'student':
      return row.child.name;
    case 'status':
      return row.status;
    case 'year':
      return row.year;
    case 'class':
      return row.classKey;
    case 'section':
      return row.sectionKey;
    case 'transport':
      return row.transportKey;
    case 'registered':
    default:
      return row.registered;
  }
};

const sortValue = (row: GuardianRow, key: SortKey): string | number => {
  switch (key) {
    case 'relationship':
      return row.relationship.toLowerCase();
    case 'student':
      return row.child.name.toLowerCase();
    case 'children':
      return row.childrenCount;
    case 'status':
      return row.status.toLowerCase();
    case 'name':
    default:
      return row.name.toLowerCase();
  }
};

const GuardianList = () => {
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

  const [roster, setRoster] = useState<GuardianRow[]>(guardianRows);
  const [selected, setSelected] = useState<string[]>([]);
  const [expanded, setExpanded] = useState<string[]>([]);
  const [rowMenuOpen, setRowMenuOpen] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState('10');

  const [activeModal, setActiveModal] = useState<GuardianListModalId | null>(null);
  const [modalGuardian, setModalGuardian] = useState<GuardianRow | null>(null);
  const [pendingDelete, setPendingDelete] = useState<string | 'bulk' | null>(null);

  const [refreshing, setRefreshing] = useState(false);
  const exportRef = useRef<HTMLDivElement>(null);

  const { toasts, push, dismiss } = useToasts();
  // `tables.js` reveals the workspace 850ms after load.
  const { loading: booting } = useReveal(850);
  const loading = booting || refreshing;

  useEffect(() => {
    if (!exportOpen) return;
    const handlePointerDown = (event: MouseEvent) => {
      if (!exportRef.current?.contains(event.target as Node)) setExportOpen(false);
    };
    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, [exportOpen]);

  /* -------------------------------- Filtering ------------------------------- */

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();

    const matches = roster.filter((row) => {
      if (term && !row.search.includes(term)) return false;
      if (view !== 'all' && row.status !== view) return false;
      return advancedFilters.every((field) => {
        const wanted = filters[field.key];
        if (!wanted) return true;
        const value = facetValue(row, field.key);
        return HAYSTACK_FACETS.includes(field.key)
          ? row.search.includes(wanted.toLowerCase()) || value === wanted
          : value === wanted;
      });
    });

    // "Recently added" is the order the rows ship in, so it never re-sorts.
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

  const countByStatus = useCallback(
    (status: string) => roster.filter((row) => row.status === status).length,
    [roster],
  );

  const viewCounts = useMemo(
    () =>
      savedViews.reduce<Record<string, number>>((acc, item) => {
        acc[item.id] = item.id === 'all' ? roster.length : countByStatus(item.id);
        return acc;
      }, {}),
    [roster, countByStatus],
  );

  const quickCounts = useMemo(
    () =>
      quickFilters.reduce<Record<string, number>>((acc, item) => {
        acc[item.id] = countByStatus(item.id);
        return acc;
      }, {}),
    [countByStatus],
  );

  const chips: FilterChip[] = useMemo(() => {
    const list: FilterChip[] = [];
    if (search) list.push({ id: 'search', label: `Search: "${search}"` });
    if (view !== 'all') list.push({ id: 'view', label: `View: ${view}` });
    advancedFilters.forEach((field) => {
      const value = filters[field.key];
      if (!value) return;
      const option = field.options.find((item) => item.value === value);
      list.push({ id: field.key, label: `${field.label}: ${option?.label ?? value}` });
    });
    return list;
  }, [search, view, filters]);

  /* --------------------------------- Handlers ------------------------------- */

  const clearChip = (id: string) => {
    if (id === 'search') setSearch('');
    else if (id === 'view') setView('all');
    else setFilters((current) => ({ ...current, [id]: '' }));
  };

  const resetFilters = () => {
    setSearch('');
    setView('all');
    setFilters({});
  };

  const handleSort = (key: SortKey) => {
    if (sort === key) setSortAsc((value) => !value);
    else {
      setSort(key);
      setSortAsc(true);
    }
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
    }, 500);
  };

  const openModal = useCallback((modal: GuardianListModalId, row: GuardianRow | null = null) => {
    setModalGuardian(row);
    setActiveModal(modal);
  }, []);
  const closeModal = () => setActiveModal(null);

  /** Toast copy for the actions the template fired but never implemented. */
  const runAction = (id: string, fallback?: string) => push(actionToasts[id] ?? fallback ?? 'Action completed');

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
      setRoster((current) =>
        current.map((row) =>
          selected.includes(row.id)
            ? { ...row, status: 'Archived', pillClass: 'is-archived', pillIcon: 'ti ti-archive', pillLabel: 'Archived' }
            : row,
        ),
      );
      setSelected([]);
    }
    runAction(action.id);
  };

  const handleRowMenuAction = (item: RowMenuItem, row: GuardianRow) => {
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
      setRoster((current) =>
        current.map((entry) =>
          entry.id === row.id
            ? {
                ...entry,
                status: 'Archived',
                pillClass: 'is-archived',
                pillIcon: 'ti ti-archive',
                pillLabel: 'Archived',
              }
            : entry,
        ),
      );
      push(`${row.name} archived`);
      return;
    }
    runAction(item.action ?? item.id, `${item.label} — ${row.name}`);
  };

  const handleAdd = (values: { name: string; phone: string; email: string; children: string[] }) => {
    const template = roster[0];
    setRoster((current) => [
      {
        ...template,
        id: `G${153736 + current.length - guardianRows.length}`,
        name: values.name,
        phone: values.phone || template.phone,
        email: values.email || template.email,
        childrenCount: values.children.length || 1,
        status: 'Pending Verification',
        pillClass: 'is-pending',
        pillIcon: 'ti ti-clock-hour-4',
        pillLabel: 'Pending',
        search: `${values.name} ${values.email} ${values.phone}`.toLowerCase(),
      },
      ...current,
    ]);
    push(`${values.name} added successfully`);
  };

  const handleSave = (id: string, values: { name: string; phone: string; email: string; children: string[] }) => {
    setRoster((current) =>
      current.map((row) =>
        row.id === id
          ? {
              ...row,
              name: values.name,
              phone: values.phone || row.phone,
              email: values.email || row.email,
              childrenCount: values.children.length || row.childrenCount,
            }
          : row,
      ),
    );
    push('Guardian details updated');
  };

  const confirmDelete = () => {
    if (pendingDelete === 'bulk') {
      setRoster((current) => current.filter((row) => !selected.includes(row.id)));
      push(`${selected.length} guardian(s) deleted`);
      setSelected([]);
    } else if (pendingDelete) {
      setRoster((current) => current.filter((row) => row.id !== pendingDelete));
      push('Guardian deleted');
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
              <h3 className="page-title mb-1">Guardian</h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={routes.adminDashboard}>Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">People</li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Guardian
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
                  Add Guardian
                </Link>
              </div>
            </div>
          </div>
          {/* /Page Header */}

          {/* Guardians List */}
          <div className="card">
            <div
              className={`data-workspace classes-workspace${loading ? '' : ' is-loaded'}${
                fullscreen ? ' is-fullscreen card-fullscreen' : ''
              }`}
              id="classWorkspace"
              data-density={density}
            >
              {!loading ? (
                <GuardianListToolbar
                  search={search}
                  onSearch={setSearch}
                  view={view}
                  onView={setView}
                  viewCounts={viewCounts}
                  quickCounts={quickCounts}
                  filters={filters}
                  onFilter={(key, value) => setFilters((current) => ({ ...current, [key]: value }))}
                  onResetFilters={resetFilters}
                  columns={columns}
                  onColumn={(id, visible) => setColumns((current) => ({ ...current, [id]: visible }))}
                  onResetColumns={() => setColumns(allColumns)}
                  density={density}
                  onDensity={setDensity}
                  matchCount={filtered.length}
                  totalCount={roster.length}
                  sort={sort}
                  onSort={handleSort}
                  openMenu={openMenu}
                  onOpenMenu={setOpenMenu}
                  chips={chips}
                  onClearChip={clearChip}
                  onRefresh={refresh}
                  fullscreen={fullscreen}
                  onToggleFullscreen={() => setFullscreen((value) => !value)}
                  onSaveView={() => runAction('save_view')}
                />
              ) : null}

              {loading ? <GuardianListSkeleton /> : null}

              {!loading ? (
                <div className="live-content">
                  <BulkActionBar
                    count={selected.length}
                    onAction={handleBulkAction}
                    onClear={() => setSelected([])}
                  />

                  {pageRows.length > 0 ? (
                    <GuardianTable
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
                      onDelete={(row) => {
                        setPendingDelete(row.id);
                        openModal('delete');
                      }}
                      onMessage={(row) => push(`Message composer opened for ${row.name}`)}
                      onCall={(row) => push(`Calling ${row.name} on ${row.phone}`)}
                      onMenuAction={handleRowMenuAction}
                    />
                  ) : null}

                  <div className={`workspace-empty-state${filtered.length === 0 ? ' show' : ''}`} id="clsEmpty">
                    <span className="avatar avatar-xl bg-soft-primary text-primary rounded-circle mb-3">
                      <i className="ti ti-users-off fs-24" />
                    </span>
                    <h5 className="mb-1">No guardians found</h5>
                    <p className="text-muted mb-3">Try adjusting your search or filters.</p>
                    <button type="button" className="btn btn-light btn-sm" onClick={resetFilters}>
                      Clear all filters
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
            </div>
          </div>
          {/* /Guardians List */}
        </div>
      </div>

      <GuardianListModals
        active={activeModal}
        guardian={modalGuardian}
        onClose={closeModal}
        onToast={push}
        onAdd={handleAdd}
        onSave={handleSave}
        onConfirmDelete={confirmDelete}
      />

      <ToastStack toasts={toasts} onDismiss={dismiss} id="clsToasts" />
    </>
  );
};

export default GuardianList;
