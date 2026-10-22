import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import ToastStack from '@components/ui/ToastStack';
import { all_routes } from '@/routes/all_routes';
import { useToasts } from '@hooks/useToasts';
import UsersModals from './modals/UsersModals';
import type { InviteValues } from './modals/UsersModals';
import UsersTable from './components/UsersTable';
import UsersToolbar from './components/UsersToolbar';
import type { FilterChip } from './components/UsersToolbar';
import type {
  BulkAction,
  ColumnId,
  DensityId,
  FilterKey,
  SortKey,
  ToolbarMenu,
  UserModalId,
  UserRow,
} from './data/users.data';
import {
  actionToasts,
  advancedFilters,
  allColumns,
  bulkActions,
  exportActions,
  headerBulkActions,
  pageSizes,
  quickFilters,
  savedViews,
  statsCards,
  userRows,
} from './data/users.data';

const routes = all_routes;

const facetValue = (row: UserRow, key: FilterKey): string => {
  switch (key) {
    case 'role':
      return row.role;
    case 'department':
      return row.department;
    case 'status':
      return row.status;
    case 'branch':
      return row.branch;
    case 'class':
      // Students carry their class in the department column.
      return row.department;
    case 'joined':
    default:
      return row.created;
  }
};

/**
 * "Date Joined" offers bare years (`2024`) against a full date (`12 Jan 2022`), so
 * it has to match as a substring — the template's engine compared each `data-filter`
 * value against the row's `data-search` haystack for exactly this reason. Every other
 * facet is a whole-value match.
 */
const matchesFacet = (row: UserRow, key: FilterKey, wanted: string) =>
  key === 'joined' ? row.created.includes(wanted) : facetValue(row, key) === wanted;

/** A saved view names a status; a quick filter may name a status *or* a role. */
const matchesView = (row: UserRow, view: string) =>
  view === 'all' || row.status === view || row.role === view;

const sortValue = (row: UserRow, key: SortKey): string | number => {
  switch (key) {
    case 'role':
      return row.role.toLowerCase();
    case 'department':
      return row.department.toLowerCase();
    case 'login':
      return new Date(row.lastLoginDate).getTime() || 0;
    case 'created':
      return new Date(row.created).getTime();
    case 'name':
    default:
      return row.name.toLowerCase();
  }
};

const ManageUsers = () => {
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

  const [roster, setRoster] = useState<UserRow[]>(userRows);
  const [selected, setSelected] = useState<string[]>([]);
  const [rowMenuOpen, setRowMenuOpen] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState('10');

  const [activeModal, setActiveModal] = useState<UserModalId | null>(null);
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

    const matches = roster.filter((row) => {
      if (term && !row.search.includes(term)) return false;
      if (!matchesView(row, view)) return false;
      return advancedFilters.every((field) => {
        const wanted = filters[field.key];
        return !wanted || matchesFacet(row, field.key, wanted);
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
  const pages = Array.from({ length: pageCount }, (_, index) => index + 1);

  useEffect(() => setPage(1), [search, view, filters, pageSize]);

  /* --------------------------------- Counts --------------------------------- */

  const countByView = useCallback(
    (id: string) => (id === 'all' ? roster.length : roster.filter((row) => matchesView(row, id)).length),
    [roster],
  );

  const viewCounts = useMemo(
    () =>
      savedViews.reduce<Record<string, number>>((acc, item) => {
        acc[item.id] = countByView(item.id);
        return acc;
      }, {}),
    [countByView],
  );

  const quickCounts = useMemo(
    () =>
      quickFilters.reduce<Record<string, number>>((acc, item) => {
        acc[item.id] = countByView(item.id);
        return acc;
      }, {}),
    [countByView],
  );

  const chips: FilterChip[] = useMemo(() => {
    const list: FilterChip[] = [];
    if (search) list.push({ id: 'search', label: `Search: "${search}"` });
    if (view !== 'all') list.push({ id: 'view', label: `View: ${view}` });
    advancedFilters.forEach((field) => {
      const value = filters[field.key];
      if (value) list.push({ id: field.key, label: `${field.label}: ${value}` });
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
      const message = actionToasts[id];
      if (message) push(message);
    },
    [push],
  );

  const refresh = () => {
    setRoster(userRows);
    setSelected([]);
    runAction('refresh');
  };

  /** Activate / Deactivate rewrite the status pill the same way the engine did. */
  const setStatus = (ids: string[], status: UserRow['status'], pillClass: string) =>
    setRoster((current) => current.map((row) => (ids.includes(row.id) ? { ...row, status, pillClass } : row)));

  const applyAction = (id: string, ids: string[]) => {
    if (id === 'activate') setStatus(ids, 'Active', 'is-active');
    if (id === 'deactivate') setStatus(ids, 'Inactive', 'is-inactive');
    if (id === 'print') window.print();
    runAction(id);
  };

  const handleBulkAction = (action: BulkAction) => {
    setBulkOpen(false);
    if (action.modal === 'delete') {
      setPendingDelete('bulk');
      setActiveModal('delete');
      return;
    }
    if (action.modal) {
      setActiveModal(action.modal);
      return;
    }
    applyAction(action.id, selected);
  };

  const handleAdd = (values: InviteValues) => {
    // Counting rows would reuse an id after a delete, so take the highest in use.
    const nextNumber = roster.reduce((max, row) => Math.max(max, Number(row.id.replace('U-', '')) || 0), 1008) + 1;
    setRoster((current) => [
      {
        ...current[0],
        id: `U-${nextNumber}`,
        name: `${values.firstName} ${values.lastName}`.trim(),
        avatar: 'assets/img/profiles/avatar-27.jpg',
        online: false,
        presence: values.sendInvite ? 'Invited' : 'Offline',
        role: values.role,
        department: '',
        email: values.email,
        branch: values.branch,
        status: 'Pending',
        pillClass: 'is-pending',
        lastLoginDate: 'Never signed in',
        lastLoginTime: '',
        lastLoginRelative: '',
        search: `${values.firstName} ${values.lastName} ${values.email} ${values.role}`.toLowerCase(),
      },
      ...current,
    ]);
    push(values.sendInvite ? 'User added and invitation sent.' : 'User added.');
  };

  const confirmDelete = () => {
    if (pendingDelete === 'bulk') {
      setRoster((current) => current.filter((row) => !selected.includes(row.id)));
      push(`${selected.length} user(s) deleted`);
      setSelected([]);
    } else if (pendingDelete) {
      setRoster((current) => current.filter((row) => row.id !== pendingDelete));
      push('User deleted');
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
            className="d-md-flex d-block align-items-center justify-content-between mb-4 flex-wrap gap-2"
            ref={headerRef}
          >
            <div className="my-auto mb-2">
              <h3 className="page-title mb-1">User Management</h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={routes.adminDashboard}>Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <Link to="#">Administration</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Users
                  </li>
                </ol>
              </nav>
            </div>
            <div className="d-flex my-xl-auto right-content align-items-center flex-wrap gap-2">
              <Link
                to="#"
                className="btn btn-outline-light bg-white fw-medium d-inline-flex align-items-center"
                onClick={() => setActiveModal('import')}
              >
                <i className="ti ti-file-import me-1" />
                Import
              </Link>

              <div className="dropdown">
                <Link
                  to="#"
                  className="dropdown-toggle btn btn-outline-light bg-white fw-medium d-inline-flex align-items-center"
                  aria-expanded={exportOpen}
                  onClick={() => setExportOpen((open) => !open)}
                >
                  <i className="ti ti-file-export me-1" />
                  Export
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

              <Link
                to="#"
                className="btn btn-primary d-inline-flex align-items-center"
                onClick={() => setActiveModal('invite')}
              >
                <i className="ti ti-square-rounded-plus me-1" />
                Add User
              </Link>
            </div>
          </div>
          {/* /Page Header */}

          {/* Summary analytics cards */}
          <div className="row g-3 mb-4">
            {statsCards.map((card) => (
              <div className="col-xxl-3 col-sm-6 d-flex" key={card.id}>
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
          {/* /Summary analytics cards */}

          <div>
            {/* Users List */}
            <div className="card mb-4">
              <div
                className={`data-workspace usr${fullscreen ? ' is-fullscreen card-fullscreen' : ''}`}
                id="usersWorkspace"
                data-density={density}
              >
                <UsersToolbar
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
                  onAction={(id) => applyAction(id, selected)}
                  fullscreen={fullscreen}
                  onToggleFullscreen={() => setFullscreen((value) => !value)}
                  onInvite={() => setActiveModal('invite')}
                />

                {/* Bulk action bar */}
                {selected.length > 0 ? (
                  <div className="bulk-selection" id="usrBulk" role="region" aria-label="Bulk actions">
                    <div className="bulk-selection-inner">
                      <span className="bulk-selection-count">
                        <b id="usrCount">{selected.length}</b> selected
                      </span>
                      <div className="d-flex flex-wrap gap-2">
                        {bulkActions.map((action) => (
                          <button
                            key={action.id}
                            type="button"
                            className={`btn btn-sm${action.danger ? ' text-danger' : ''}`}
                            onClick={() => handleBulkAction(action)}
                          >
                            <i className={`${action.icon} me-1`} />
                            {action.label}
                          </button>
                        ))}
                      </div>
                      <button
                        type="button"
                        className="bulk-selection-close"
                        aria-label="Clear selection"
                        onClick={() => setSelected([])}
                      >
                        <i className="ti ti-x" />
                      </button>
                    </div>
                  </div>
                ) : null}

                {pageRows.length > 0 ? (
                  <UsersTable
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
                    onEmail={(row) => push(`Email composer opened for ${row.name}`)}
                    onDelete={(row) => {
                      setPendingDelete(row.id);
                      setActiveModal('delete');
                    }}
                    onAction={(action, row) => applyAction(action, [row.id])}
                  />
                ) : null}

                {/* Empty state */}
                {filtered.length === 0 ? (
                  <div className="card-empty" id="usrEmpty">
                    <div className="card-empty-art">
                      <i className="ti ti-user-search" />
                    </div>
                    <h4 className="fs-16 fw-medium">No Users Found</h4>
                    <p>Adjust your filters or add a new user to see results here.</p>
                    <div className="d-flex justify-content-center gap-2">
                      <button type="button" className="btn btn-light" onClick={clearFilters}>
                        <i className="ti ti-rotate me-1" />
                        Reset filters
                      </button>
                      <button type="button" className="btn btn-primary" onClick={() => setActiveModal('invite')}>
                        <i className="ti ti-square-rounded-plus me-1" />
                        Add User
                      </button>
                    </div>
                  </div>
                ) : null}

                {/* Pagination footer */}
                <div className="card-foot">
                  <div className="card-foot-info">
                    Showing <span className="usr-range-from">{rangeFrom}</span>–
                    <span className="usr-range-to">{rangeTo}</span> of{' '}
                    <span className="usr-range-total">{filtered.length}</span> users
                  </div>
                  <div className="card-foot-size">
                    <label className="mb-0">Rows:</label>
                    <select
                      className="form-select"
                      aria-label="Rows per page"
                      value={pageSize}
                      onChange={(event) => setPageSize(event.target.value)}
                    >
                      {pageSizes.map((option) => (
                        <option value={option} key={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                  <nav className="card-pagination" aria-label="Users pagination">
                    <button
                      type="button"
                      className="card-page-btn"
                      aria-label="First page"
                      disabled={currentPage === 1}
                      onClick={() => setPage(1)}
                    >
                      <i className="ti ti-chevrons-left" />
                    </button>
                    <button
                      type="button"
                      className="card-page-btn"
                      aria-label="Previous page"
                      disabled={currentPage === 1}
                      onClick={() => setPage(currentPage - 1)}
                    >
                      <i className="ti ti-chevron-left" />
                    </button>
                    <span className="card-page-numbers">
                      {pages.map((number) => (
                        <button
                          key={number}
                          type="button"
                          className={`card-page-btn${number === currentPage ? ' active' : ''}`}
                          aria-current={number === currentPage ? 'page' : undefined}
                          onClick={() => setPage(number)}
                        >
                          {number}
                        </button>
                      ))}
                    </span>
                    <button
                      type="button"
                      className="card-page-btn"
                      aria-label="Next page"
                      disabled={currentPage === pageCount}
                      onClick={() => setPage(currentPage + 1)}
                    >
                      <i className="ti ti-chevron-right" />
                    </button>
                    <button
                      type="button"
                      className="card-page-btn"
                      aria-label="Last page"
                      disabled={currentPage === pageCount}
                      onClick={() => setPage(pageCount)}
                    >
                      <i className="ti ti-chevrons-right" />
                    </button>
                  </nav>
                </div>
              </div>
            </div>
            {/* /Users List */}
          </div>
        </div>
      </div>

      <UsersModals
        active={activeModal}
        onClose={() => setActiveModal(null)}
        onToast={push}
        onAdd={handleAdd}
        onConfirmDelete={confirmDelete}
      />

      <ToastStack toasts={toasts} onDismiss={dismiss} id="usrToasts" />
    </>
  );
};

export default ManageUsers;
