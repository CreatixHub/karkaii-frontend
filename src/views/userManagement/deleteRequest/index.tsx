import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import ToastStack from '@components/ui/ToastStack';
import { all_routes } from '@/routes/all_routes';
import { useToasts } from '@hooks/useToasts';
import ApprovalWorkflow from './components/ApprovalWorkflow';
import DeleteRequestBulkBar from './components/DeleteRequestBulkBar';
import DeleteRequestEmpty from './components/DeleteRequestEmpty';
import DeleteRequestFooter from './components/DeleteRequestFooter';
import DeleteRequestTable from './components/DeleteRequestTable';
import DeleteRequestToolbar from './components/DeleteRequestToolbar';
import type { FilterChip } from './components/DeleteRequestToolbar';
import DeleteRequestModals from './modals/DeleteRequestModals';
import type {
  BulkAction,
  ColumnId,
  DeleteRequestModalId,
  DeleteRequestRow,
  DensityId,
  FilterKey,
  SortKey,
  ToolbarMenu,
} from './data/deleteRequest.data';
import {
  actionToasts,
  advancedFilters,
  allColumns,
  deleteRequestRows,
  exportActions,
  headerBulkActions,
  quickFilters,
  savedViews,
  statsCards,
  textOnlyViews,
} from './data/deleteRequest.data';

const routes = all_routes;

/**
 * `Type`, `Status` and `Department` are whole-value matches against their column.
 *
 * The other three are not: the template's engine matched each `data-filter` value
 * against the row's `data-search` haystack *plus the rendered row text*, so
 * `Date` ("2024") hits the visible Requested/Deletion dates and `Approval`
 * ("Unassigned") hits the reviewer badge. Those are matched as substrings here.
 *
 * `Branch` has no field and no rendered text on any row, so it legitimately matches
 * nothing — the same as the template.
 */
const matchesFacet = (row: DeleteRequestRow, key: FilterKey, wanted: string): boolean => {
  const needle = wanted.toLowerCase();

  switch (key) {
    case 'Type':
      return row.userType === wanted;
    case 'Status':
      return row.status === wanted;
    case 'Department':
      return row.department === wanted;
    case 'Date':
      return `${row.requested} ${row.deletion}`.toLowerCase().includes(needle);
    case 'Approval':
      return (row.reviewer?.name ?? 'Unassigned').toLowerCase().includes(needle);
    case 'Branch':
    default:
      return row.search.includes(needle);
  }
};

/** A view id names a status, a user type, or one of the two free-text tags. */
const matchesView = (row: DeleteRequestRow, view: string) => {
  if (view === 'all') return true;
  if (textOnlyViews.includes(view)) return row.search.includes(view);
  return row.status === view || row.userType === view;
};

const sortValue = (row: DeleteRequestRow, key: SortKey): string | number => {
  switch (key) {
    case 'usertype':
      return row.userType.toLowerCase();
    case 'requested':
      return new Date(row.requested).getTime();
    case 'name':
    default:
      return row.name.toLowerCase();
  }
};

const DeleteRequest = () => {
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
  const [bulkOpen, setBulkOpen] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);

  const [rows, setRows] = useState<DeleteRequestRow[]>(deleteRequestRows);
  const [selected, setSelected] = useState<string[]>([]);
  const [rowMenuOpen, setRowMenuOpen] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState('10');

  const [activeModal, setActiveModal] = useState<DeleteRequestModalId | null>(null);
  const [pendingDelete, setPendingDelete] = useState<string | 'bulk' | null>(null);

  const headerRef = useRef<HTMLDivElement>(null);
  const { toasts, push, dismiss } = useToasts();

  useEffect(() => {
    if (!exportOpen && !bulkOpen) return;
    const handlePointerDown = (event: MouseEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) {
        setExportOpen(false);
        setBulkOpen(false);
      }
    };
    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, [exportOpen, bulkOpen]);

  /* -------------------------------- Filtering ------------------------------- */

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();

    const matches = rows.filter((row) => {
      if (term && !row.search.includes(term)) return false;
      if (!matchesView(row, view)) return false;
      return advancedFilters.every((field) => {
        const wanted = filters[field.key];
        return !wanted || matchesFacet(row, field.key, wanted);
      });
    });

    if (sort === 'recent') return matches;

    return [...matches].sort((a, b) => {
      const left = sortValue(a, sort);
      const right = sortValue(b, sort);
      if (left < right) return sortAsc ? -1 : 1;
      if (left > right) return sortAsc ? 1 : -1;
      return 0;
    });
  }, [rows, search, view, filters, sort, sortAsc]);

  /* --------------------------------- Paging --------------------------------- */

  const size = Number(pageSize);
  const pageCount = Math.max(1, Math.ceil(filtered.length / size));
  const currentPage = Math.min(page, pageCount);
  const pageRows = filtered.slice((currentPage - 1) * size, currentPage * size);
  const rangeFrom = filtered.length === 0 ? 0 : (currentPage - 1) * size + 1;
  const rangeTo = Math.min(currentPage * size, filtered.length);

  useEffect(() => setPage(1), [search, view, filters, pageSize]);

  /* --------------------------------- Counts --------------------------------- */

  const countByView = useCallback(
    (id: string) => (id === 'all' ? rows.length : rows.filter((row) => matchesView(row, id)).length),
    [rows],
  );

  const viewCounts = useMemo(
    () => savedViews.reduce<Record<string, number>>((acc, item) => ({ ...acc, [item.id]: countByView(item.id) }), {}),
    [countByView],
  );

  const quickCounts = useMemo(
    () => quickFilters.reduce<Record<string, number>>((acc, item) => ({ ...acc, [item.id]: countByView(item.id) }), {}),
    [countByView],
  );

  const chips: FilterChip[] = useMemo(() => {
    const list: FilterChip[] = [];
    if (search) list.push({ id: 'search', label: `Search: "${search}"` });
    if (view !== 'all') list.push({ id: 'view', label: `View: ${view}` });
    advancedFilters.forEach((field) => {
      const value = filters[field.key];
      if (value) list.push({ id: field.key, label: `${field.key}: ${value}` });
    });
    return list;
  }, [search, view, filters]);

  /* --------------------------------- Handlers ------------------------------- */

  const clearChip = (id: string) => {
    if (id === 'search') setSearch('');
    else if (id === 'view') setView('all');
    else setFilters((current) => ({ ...current, [id]: '' }));
  };

  const clearFilters = () => {
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

  const pageIds = pageRows.map((row) => row.id);
  const allChecked = pageIds.length > 0 && pageIds.every((id) => selected.includes(id));
  const someChecked = pageIds.some((id) => selected.includes(id));

  const toggleAll = (checked: boolean) =>
    setSelected((current) =>
      checked ? Array.from(new Set([...current, ...pageIds])) : current.filter((id) => !pageIds.includes(id)),
    );

  const runAction = useCallback(
    (id: string) => {
      const toast = actionToasts[id];
      if (toast) push(toast.message, toast.tone);
    },
    [push],
  );

  /** Approve / Reject rewrite the status pill the way the engine did. */
  const setStatus = (ids: string[], status: DeleteRequestRow['status'], pillClass: string) =>
    setRows((current) => current.map((row) => (ids.includes(row.id) ? { ...row, status, pillClass } : row)));

  const applyAction = (id: string, ids: string[]) => {
    if (id === 'approve' || id === 'bulk_approve') setStatus(ids, 'Approved', 'is-active');
    if (id === 'reject' || id === 'bulk_reject') setStatus(ids, 'Rejected', 'is-inactive');
    if (id === 'print') window.print();
    if (id === 'refresh') {
      setRows(deleteRequestRows);
      setSelected([]);
    }
    runAction(id);
  };

  const handleBulkAction = (action: BulkAction) => {
    setBulkOpen(false);
    if (action.modal === 'delete') {
      setPendingDelete('bulk');
      setActiveModal('delete');
      return;
    }
    applyAction(action.id, selected);
  };

  const confirmDelete = () => {
    if (pendingDelete === 'bulk') {
      setRows((current) => current.filter((row) => !selected.includes(row.id)));
      push(`${selected.length} request(s) deleted permanently`);
      setSelected([]);
    } else if (pendingDelete) {
      setRows((current) => current.filter((row) => row.id !== pendingDelete));
      push('Request deleted permanently');
    }
    setPendingDelete(null);
    setActiveModal(null);
  };

  return (
    <>
      <div className={`page-wrapper${fullscreen ? ' workspace-fullscreen' : ''}`}>
        <div className="content">
          {/* Page Header */}
          <div
            className="d-md-flex d-block align-items-center justify-content-between flex-wrap gap-2 mb-4"
            ref={headerRef}
          >
            <div className="my-auto mb-2">
              <h3 className="page-title mb-1">Delete Account Requests</h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={routes.adminDashboard}>Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <Link to="#">Administration</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Delete Account Requests
                  </li>
                </ol>
              </nav>
            </div>
            <div className="d-flex my-xl-auto right-content align-items-center flex-wrap gap-2">
              <div className="dropdown">
                <Link
                  to="#"
                  className="dropdown-toggle btn btn-outline-light bg-white fw-medium d-inline-flex align-items-center"
                  aria-expanded={exportOpen}
                  onClick={() => setExportOpen((open) => !open)}
                >
                  <i className="ti ti-file-export me-1" />
                  Export Requests
                </Link>
                <ul className={`dropdown-menu dropdown-menu-end p-2${exportOpen ? ' show' : ''}`}>
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

              <div className="dropdown">
                <Link
                  to="#"
                  className="dropdown-toggle btn btn-outline-light bg-white fw-medium d-inline-flex align-items-center"
                  aria-expanded={bulkOpen}
                  onClick={() => setBulkOpen((open) => !open)}
                >
                  <i className="ti ti-settings-bolt me-1" />
                  Bulk Actions
                </Link>
                <ul className={`dropdown-menu dropdown-menu-end p-2${bulkOpen ? ' show' : ''}`}>
                  {headerBulkActions.map((action) => (
                    <li key={action.id}>
                      {action.danger ? <hr className="dropdown-divider" /> : null}
                      <Link
                        to="#"
                        className={`dropdown-item rounded-1${action.danger ? ' text-danger' : ''}`}
                        onClick={() => handleBulkAction(action)}
                      >
                        <i className={`${action.icon} me-2`} />
                        {action.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <Link to="#" className="btn btn-outline-light bg-white fw-medium d-inline-flex align-items-center">
                <i className="ti ti-settings me-1" />
                Settings
              </Link>
            </div>
          </div>
          {/* /Page Header */}

          {/* Overview cards */}
          <div className="row g-3 mb-4">
            {statsCards.map((card) => (
              <div className="col-xl-3 col-sm-6 d-flex" key={card.id}>
                <div className={`stats-card stats-card-directory ${card.variant}`}>
                  <span className="stats-avatar stats-icon">
                    <i className={card.icon} />
                  </span>
                  <div>
                    <h3 className="stats-value mb-0">{card.value}</h3>
                    <p className="stats-label">{card.label}</p>
                    <span className="stats-role">{card.note}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* /Overview cards */}

          <div className="card mb-4">
            <div
              className={`data-workspace dar${fullscreen ? ' is-fullscreen card-fullscreen' : ''}`}
              id="delReqWorkspace"
              data-density={density}
            >
              <DeleteRequestToolbar
                search={search}
                onSearch={setSearch}
                view={view}
                onView={setView}
                viewCounts={viewCounts}
                quickCounts={quickCounts}
                filters={filters}
                onFilter={(key, value) => setFilters((current) => ({ ...current, [key]: value }))}
                onClearFilters={clearFilters}
                columns={columns}
                onColumn={(id, visible) => setColumns((current) => ({ ...current, [id]: visible }))}
                onResetColumns={() => {
                  setColumns(allColumns);
                  runAction('reset_columns');
                }}
                density={density}
                onDensity={setDensity}
                matchCount={filtered.length}
                totalCount={rows.length}
                openMenu={openMenu}
                onOpenMenu={setOpenMenu}
                chips={chips}
                onClearChip={clearChip}
                onAction={(id) => applyAction(id, selected)}
                fullscreen={fullscreen}
                onToggleFullscreen={() => setFullscreen((value) => !value)}
              />

              {selected.length > 0 ? (
                <DeleteRequestBulkBar
                  count={selected.length}
                  onAction={handleBulkAction}
                  onClear={() => setSelected([])}
                />
              ) : null}

              {pageRows.length > 0 ? (
                <DeleteRequestTable
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
                  openMenu={rowMenuOpen}
                  onOpenMenu={setRowMenuOpen}
                  onAction={(action, row) => applyAction(action, [row.id])}
                  onDelete={(row) => {
                    setPendingDelete(row.id);
                    setActiveModal('delete');
                  }}
                />
              ) : null}

              {filtered.length === 0 ? <DeleteRequestEmpty onResetFilters={clearFilters} /> : null}

              <DeleteRequestFooter
                rangeFrom={rangeFrom}
                rangeTo={rangeTo}
                total={filtered.length}
                pageSize={pageSize}
                onPageSize={setPageSize}
                currentPage={currentPage}
                pageCount={pageCount}
                onPage={setPage}
              />
            </div>
          </div>

          <ApprovalWorkflow />
        </div>
      </div>

      <DeleteRequestModals active={activeModal} onClose={() => setActiveModal(null)} onConfirmDelete={confirmDelete} />

      <ToastStack toasts={toasts} onDismiss={dismiss} id="darToasts" />
    </>
  );
};

export default DeleteRequest;
