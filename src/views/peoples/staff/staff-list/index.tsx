import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import ToastStack from '@components/ui/ToastStack';
import { all_routes } from '@/routes/all_routes';
import { useReveal } from '@hooks/useReveal';
import { useToasts } from '@hooks/useToasts';
import BulkActionBar from './components/BulkActionBar';
import StaffListSkeleton from './components/StaffListSkeleton';
import StaffListToolbar from './components/StaffListToolbar';
import type { FilterChip, ToolbarMenu } from './components/StaffListToolbar';
import StaffTable from './components/StaffTable';
import WorkspaceFooter from './components/WorkspaceFooter';
import StaffListModals from './modals/StaffListModals';
import type {
  BulkAction,
  ColumnId,
  DensityId,
  FilterKey,
  SortKey,
  StaffListModalId,
  StaffRow,
} from './data/staffList.data';
import {
  actionToasts,
  advancedFilters,
  exportActions,
  quickFilters,
  savedViews,
  staffRows,
} from './data/staffList.data';

const routes = all_routes;

const ALL_COLUMNS: Record<ColumnId, boolean> = { staff: true, contact: true, work: true, status: true };

/**
 * The engine matches a facet by looking for its value in the row's `data-search`
 * haystack plus the rendered row text. Comparing against the same fields keeps the
 * substring semantics the Joining Date options depend on.
 */
const facetHaystack = (row: StaffRow, key: FilterKey): string => {
  switch (key) {
    case 'department':
      return row.department;
    case 'designation':
      return row.designation;
    case 'employment':
      return row.employmentType;
    case 'gender':
      return row.gender;
    case 'branch':
      return row.branch;
    case 'status':
      return row.status;
    case 'joining':
      return row.joined;
    case 'staffType':
    default:
      // No row carries a staff type, so the template returns nothing for it too.
      return '';
  }
};

const sortValue = (row: StaffRow, key: SortKey): string | number => {
  switch (key) {
    case 'department':
      return row.department.toLowerCase();
    case 'experience':
      return row.experience;
    case 'joindate':
      return new Date(row.joined).getTime();
    case 'status':
      return row.status.toLowerCase();
    case 'name':
    default:
      return row.name.toLowerCase();
  }
};

const StaffList = () => {
  /* ---------------------------------- State --------------------------------- */
  const [search, setSearch] = useState('');
  const [view, setView] = useState('all');
  const [filters, setFilters] = useState<Partial<Record<FilterKey, string>>>({});
  const [columns, setColumns] = useState<Record<ColumnId, boolean>>(ALL_COLUMNS);
  const [density, setDensity] = useState<DensityId>('default');
  const [sort, setSort] = useState<SortKey>('recent');
  const [sortAsc, setSortAsc] = useState(true);
  const [openMenu, setOpenMenu] = useState<ToolbarMenu>(null);
  const [exportOpen, setExportOpen] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);

  const [roster, setRoster] = useState<StaffRow[]>(staffRows);
  const [selected, setSelected] = useState<string[]>([]);
  const [expanded, setExpanded] = useState<string[]>([]);
  const [rowMenuOpen, setRowMenuOpen] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState('10');

  const [activeModal, setActiveModal] = useState<StaffListModalId | null>(null);
  const [modalStaff, setModalStaff] = useState<StaffRow | null>(null);
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
        return facetHaystack(row, field.key).toLowerCase().includes(wanted.toLowerCase());
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

  const chips: FilterChip[] = useMemo(
    () =>
      advancedFilters
        .filter((field) => filters[field.key])
        .map((field) => ({ key: field.key, label: `${field.label}: ${filters[field.key]}` })),
    [filters],
  );

  /* --------------------------------- Handlers ------------------------------- */

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

  const toggleExpand = (id: string) =>
    setExpanded((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));

  const pageIds = pageRows.map((row) => row.id);
  const allChecked = pageIds.length > 0 && pageIds.every((id) => selected.includes(id));
  const someChecked = pageIds.some((id) => selected.includes(id));

  const toggleAll = (checked: boolean) =>
    setSelected((current) =>
      checked ? Array.from(new Set([...current, ...pageIds])) : current.filter((id) => !pageIds.includes(id)),
    );

  /** Raises the engine's toast for a `data-cls-action`; unknown ids stay silent. */
  const runAction = useCallback(
    (id: string) => {
      const toast = actionToasts[id];
      if (toast) push(toast.message, toast.variant);
    },
    [push],
  );

  const refresh = () => {
    setRefreshing(true);
    window.setTimeout(() => {
      setRefreshing(false);
      runAction('refresh');
    }, 500);
  };

  const openModal = useCallback((modal: StaffListModalId, row: StaffRow | null = null) => {
    setModalStaff(row);
    setActiveModal(modal);
  }, []);
  const closeModal = () => setActiveModal(null);

  const archive = (ids: string[]) => {
    setRoster((current) =>
      current.map((row) =>
        ids.includes(row.id)
          ? { ...row, status: 'Inactive', statusClass: 'is-inactive', statusIcon: undefined }
          : row,
      ),
    );
  };

  const handleBulkAction = (action: BulkAction) => {
    if (action.modal === 'delete') {
      setPendingDelete('bulk');
      openModal('delete');
      return;
    }
    if (action.modal) {
      openModal(action.modal, roster.find((row) => row.id === selected[0]) ?? null);
      if (action.action) runAction(action.action);
      return;
    }
    if (action.action === 'print_profile') {
      window.print();
    }
    if (action.action === 'archive') {
      archive(selected);
      setSelected([]);
    }
    if (action.action) runAction(action.action);
  };

  const handleRowAction = (action: string, row: StaffRow) => {
    if (action === 'print_profile') window.print();
    if (action === 'archive') archive([row.id]);
    runAction(action);
  };

  const handleAdd = (values: { name: string; employeeId: string; department: string; designation: string; email: string; mobile: string; employmentType: string; joiningDate: string }) => {
    const template = roster[0];
    setRoster((current) => [
      {
        ...template,
        id: values.employeeId.trim() || `STF-${2011 + current.length - staffRows.length}`,
        name: values.name,
        department: values.department,
        designation: values.designation,
        email: values.email || template.email,
        phone: values.mobile || template.phone,
        employmentType: values.employmentType,
        joined: values.joiningDate || template.joined,
        status: 'Probation',
        statusClass: 'is-probation',
        statusIcon: 'ti ti-hourglass',
        search: `${values.name} ${values.employeeId} ${values.department} ${values.designation} ${values.email}`.toLowerCase(),
      },
      ...current,
    ]);
    push('New staff member added.');
  };

  const handleSave = (
    id: string,
    values: { name: string; department: string; designation: string; email: string; mobile: string; employmentType: string; joiningDate: string },
  ) => {
    setRoster((current) =>
      current.map((row) =>
        row.id === id
          ? {
              ...row,
              name: values.name,
              department: values.department,
              designation: values.designation,
              email: values.email || row.email,
              phone: values.mobile || row.phone,
              employmentType: values.employmentType,
              joined: values.joiningDate || row.joined,
            }
          : row,
      ),
    );
    push('Staff details updated.');
  };

  const handleAssign = (id: string, values: { department: string; designation: string }) => {
    setRoster((current) =>
      current.map((row) =>
        row.id === id ? { ...row, department: values.department, designation: values.designation } : row,
      ),
    );
    push('Department assigned to the staff member.');
  };

  const confirmDelete = () => {
    if (pendingDelete === 'bulk') {
      setRoster((current) => current.filter((row) => !selected.includes(row.id)));
      push(`${selected.length} staff member(s) deleted.`);
      setSelected([]);
    } else if (pendingDelete) {
      setRoster((current) => current.filter((row) => row.id !== pendingDelete));
      push('Staff member deleted.');
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
              <h3 className="page-title mb-1">Staff</h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={routes.adminDashboard}>Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <Link to="#">HRM</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Staff
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
                  Import Staff
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
                  Export Staff
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
              <div className="me-2 mb-2">
                <Link
                  to="#"
                  className="btn btn-outline-light bg-white btn-sm fw-medium d-inline-flex align-items-center"
                  onClick={() => {
                    window.print();
                    runAction('print_profile');
                  }}
                >
                  <i className="ti ti-printer me-2" />
                  Print Staff List
                </Link>
              </div>
              <div className="mb-2">
                <Link to="#" className="btn btn-primary btn-sm d-flex align-items-center" onClick={() => openModal('add')}>
                  <i className="ti ti-square-rounded-plus me-2" />
                  Add Staff
                </Link>
              </div>
            </div>
          </div>
          {/* /Page Header */}

          {/* Staff Workspace */}
          <div className="card">
            <div
              className={`data-workspace classes-workspace${loading ? '' : ' is-loaded'}${
                fullscreen ? ' is-fullscreen card-fullscreen' : ''
              }`}
              id="classWorkspace"
              data-density={density}
            >
              {!loading ? (
                <StaffListToolbar
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
                  onResetColumns={() => setColumns(ALL_COLUMNS)}
                  density={density}
                  onDensity={setDensity}
                  matchCount={filtered.length}
                  totalCount={roster.length}
                  sort={sort}
                  onSort={handleSort}
                  openMenu={openMenu}
                  onOpenMenu={setOpenMenu}
                  chips={chips}
                  onClearChip={(key) => setFilters((current) => ({ ...current, [key]: '' }))}
                  onRefresh={refresh}
                  onPrint={() => {
                    window.print();
                    runAction('print_profile');
                  }}
                  fullscreen={fullscreen}
                  onToggleFullscreen={() => setFullscreen((value) => !value)}
                  onSaveView={() => runAction('save_view')}
                />
              ) : null}

              {loading ? <StaffListSkeleton /> : null}

              {!loading ? (
                <div className="live-content">
                  <BulkActionBar count={selected.length} onAction={handleBulkAction} onClear={() => setSelected([])} />

                  {pageRows.length > 0 ? (
                    <StaffTable
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
                      onModal={(modal, row) => {
                        if (modal === 'delete') {
                          setPendingDelete(row.id);
                          openModal('delete', row);
                          return;
                        }
                        openModal(modal, row);
                      }}
                      onAction={handleRowAction}
                    />
                  ) : null}

                  <div className={`workspace-empty-state${filtered.length === 0 ? ' show' : ''}`} id="clsEmpty">
                    <span className="avatar avatar-xl bg-soft-primary text-primary rounded-circle mb-3">
                      <i className="ti ti-users-off fs-24" />
                    </span>
                    <h5 className="mb-1">No staff match your filters</h5>
                    <p className="text-muted mb-3">Try adjusting your search or filters.</p>
                    <button type="button" className="btn btn-light btn-sm" onClick={clearFilters}>
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
          {/* /Staff Workspace */}
        </div>
      </div>

      <StaffListModals
        active={activeModal}
        staff={modalStaff}
        onClose={closeModal}
        onSwitch={(modal) => setActiveModal(modal)}
        onToast={push}
        onAdd={handleAdd}
        onSave={handleSave}
        onAssign={handleAssign}
        onConfirmDelete={confirmDelete}
      />

      <ToastStack toasts={toasts} onDismiss={dismiss} id="clsToasts" />
    </>
  );
};

export default StaffList;
