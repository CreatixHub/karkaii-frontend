import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import ToastStack from '@components/ui/ToastStack';
import { all_routes } from '@/routes/all_routes';
import { useReveal } from '@hooks/useReveal';
import { useToasts } from '@hooks/useToasts';
import BulkActionBar from './components/BulkActionBar';
import StudentListSkeleton from './components/StudentListSkeleton';
import StudentListToolbar from './components/StudentListToolbar';
import type { FilterChip, ToolbarMenu } from './components/StudentListToolbar';
import StudentTable from './components/StudentTable';
import SummaryStrip from './components/SummaryStrip';
import WorkspaceFooter from './components/WorkspaceFooter';
import StudentListModals from './modals/StudentListModals';
import type {
  BulkAction,
  ColumnId,
  DensityId,
  FilterKey,
  RowMenuItem,
  SortKey,
  StudentListModalId,
  StudentRow,
} from './data/studentsList.data';
import {
  actionToasts,
  advancedFilters,
  exportActions,
  quickFilters,
  savedViews,
  sortOptions,
  studentRows,
  tableHeaders,
} from './data/studentsList.data';

const routes = all_routes;

const ALL_COLUMNS: Record<ColumnId, boolean> = {
  student: true,
  status: true,
  class: true,
  section: true,
  gender: true,
  join: true,
};

const CLASS_ORDER = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];

/** The engine compares "Date of Join" as a date, everything else as text. */
const sortValue = (row: StudentRow, key: SortKey): string | number => {
  switch (key) {
    case 'status':
      return row.status.toLowerCase();
    case 'class':
      return CLASS_ORDER.indexOf(row.level);
    case 'section':
      return row.section.toLowerCase();
    case 'gender':
      return row.gender.toLowerCase();
    case 'join':
      return new Date(row.join).getTime() || 0;
    case 'name':
    default:
      return row.name.toLowerCase();
  }
};

const StudentList = () => {
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

  const [roster, setRoster] = useState<StudentRow[]>(studentRows);
  const [selected, setSelected] = useState<string[]>([]);
  const [expanded, setExpanded] = useState<string[]>([]);
  const [rowMenuOpen, setRowMenuOpen] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState('10');

  const [activeModal, setActiveModal] = useState<StudentListModalId | null>(null);
  const [modalStudent, setModalStudent] = useState<StudentRow | null>(null);
  const [modalContext, setModalContext] = useState('');

  const [refreshing, setRefreshing] = useState(false);

  const workspaceRef = useRef<HTMLDivElement>(null);
  const { toasts, push, dismiss } = useToasts();
  // `tables.js` reveals the workspace 850ms after load.
  const { loading: booting } = useReveal(850);
  const loading = booting || refreshing;

  /* -------------------------------- Filtering ------------------------------- */

  const facet = useCallback((row: StudentRow, key: FilterKey) => {
    switch (key) {
      case 'level':
        return row.level;
      case 'section':
        return row.section;
      case 'gender':
        return row.gender;
      case 'status':
        return row.status;
      case 'transport':
        return row.transport;
      case 'hostel':
        return row.hostel;
      case 'scholarship':
        return row.scholarship;
      case 'year':
      default:
        return row.year;
    }
  }, []);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();

    const matches = roster.filter((row) => {
      if (term && !row.search.includes(term)) return false;
      if (view !== 'all' && row.status !== view) return false;
      return advancedFilters.every((field) => {
        const wanted = filters[field.key];
        return !wanted || facet(row, field.key) === wanted;
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
  }, [roster, search, view, filters, sort, sortAsc, facet]);

  const size = Number(pageSize);
  const pageCount = Math.max(1, Math.ceil(filtered.length / size));
  const currentPage = Math.min(page, pageCount);
  const visibleRows = filtered.slice((currentPage - 1) * size, currentPage * size);

  useEffect(() => {
    setPage(1);
  }, [search, view, filters, pageSize]);

  /* --------------------------- Derived toolbar data ------------------------- */

  const viewCounts = useMemo(() => {
    const tally = (id: string) =>
      id === 'all' ? roster.length : roster.filter((row) => row.status === id).length;
    const counts: Record<string, number> = {};
    savedViews.forEach((item) => {
      counts[item.id] = tally(item.id);
    });
    quickFilters.forEach((item) => {
      counts[item.id] = tally(item.id);
    });
    return counts;
  }, [roster]);

  const chips: FilterChip[] = useMemo(
    () =>
      advancedFilters
        .filter((field) => filters[field.key])
        .map((field) => ({ key: field.key, label: `${field.label}: ${filters[field.key]}` })),
    [filters],
  );

  const selectedOnPage = visibleRows.filter((row) => selected.includes(row.id)).length;
  const allChecked = visibleRows.length > 0 && selectedOnPage === visibleRows.length;
  const someChecked = selectedOnPage > 0;

  /* -------------------------------- Behaviour ------------------------------- */

  const toast = useCallback(
    (id: string) => {
      const entry = actionToasts[id];
      if (entry) push(entry.message, entry.variant);
    },
    [push],
  );

  const refresh = useCallback(() => {
    setRefreshing(true);
    window.setTimeout(() => {
      setRefreshing(false);
      toast('refresh');
    }, 700);
  }, [toast]);

  const exportCsv = useCallback(() => {
    const header = ['Student', 'Admission No', 'Status', 'Class', 'Section', 'Gender', 'Date of Join'];
    const lines = [header, ...filtered.map((row) => [
      row.name,
      row.admissionNo,
      row.status,
      row.level,
      row.section,
      row.gender,
      row.join,
    ])];
    const csv = lines
      .map((line) => line.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'students.csv';
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1500);
  }, [filtered]);

  const runAction = useCallback(
    (id: string) => {
      toast(id);
      if (id === 'export_csv') exportCsv();
      if (id === 'print') window.print();
    },
    [toast, exportCsv],
  );

  const clearFilters = useCallback(() => {
    setSearch('');
    setFilters({});
    setView('all');
    push('Filters cleared.');
  }, [push]);

  const applyFilter = useCallback(
    (key: FilterKey, value: string) => {
      setFilters((current) => {
        const next = { ...current, [key]: value };
        const term = search.trim().toLowerCase();
        const hits = roster.filter((row) => {
          if (term && !row.search.includes(term)) return false;
          if (view !== 'all' && row.status !== view) return false;
          return advancedFilters.every((field) => !next[field.key] || facet(row, field.key) === next[field.key]);
        }).length;
        push(`${hits} student(s) match the current filters.`, 'info');
        return next;
      });
    },
    [search, view, roster, facet, push],
  );

  const changeView = useCallback(
    (next: string) => {
      setView(next);
      const label =
        savedViews.find((item) => item.id === next)?.label ??
        quickFilters.find((item) => item.id === next)?.label ??
        next;
      const term = search.trim().toLowerCase();
      const hits = roster.filter((row) => {
        if (term && !row.search.includes(term)) return false;
        if (next !== 'all' && row.status !== next) return false;
        return advancedFilters.every((field) => !filters[field.key] || facet(row, field.key) === filters[field.key]);
      }).length;
      push(`${hits} student(s) in “${label}”.`, 'info');
    },
    [search, roster, filters, facet, push],
  );

  const toggleColumn = useCallback(
    (id: ColumnId, visible: boolean) => {
      setColumns((current) => ({ ...current, [id]: visible }));
      push(`${visible ? 'Showing' : 'Hiding'} the ${id} column.`, 'info');
    },
    [push],
  );

  const resetColumns = useCallback(() => {
    setColumns(ALL_COLUMNS);
    push('All columns restored.');
  }, [push]);

  const sortFromMenu = useCallback(
    (key: SortKey) => {
      setSort(key);
      setSortAsc(true);
      if (key === 'recent') {
        push('Showing the most recently updated students first.', 'info');
        return;
      }
      const label = sortOptions.find((option) => option.id === key)?.label ?? key;
      push(`Sorted by ${label} · ascending`, 'info');
    },
    [push],
  );

  const sortFromHeader = useCallback(
    (key: SortKey) => {
      const asc = sort === key ? !sortAsc : true;
      setSort(key);
      setSortAsc(asc);
      const label = tableHeaders.find((header) => header.sort === key)?.label ?? key;
      push(`Sorted by ${label} · ${asc ? 'ascending' : 'descending'}`, 'info');
    },
    [sort, sortAsc, push],
  );

  const toggleFullscreen = useCallback(() => {
    const next = !fullscreen;
    try {
      if (next) workspaceRef.current?.requestFullscreen?.().catch(() => undefined);
      else if (document.fullscreenElement) document.exitFullscreen();
    } catch {
      /* the browser may block the request; the class still styles the panel */
    }
    setFullscreen(next);
    push(next ? 'Entered fullscreen — press Esc to exit.' : 'Exited fullscreen.', 'info');
  }, [fullscreen, push]);

  // Leaving native fullscreen with Escape has to restore the button state too.
  useEffect(() => {
    const sync = () => {
      if (!document.fullscreenElement) setFullscreen(false);
    };
    document.addEventListener('fullscreenchange', sync);
    return () => document.removeEventListener('fullscreenchange', sync);
  }, []);

  // Close the export menu and the row overflow menu on an outside click.
  useEffect(() => {
    if (!exportOpen && !rowMenuOpen) return;
    const close = () => {
      setExportOpen(false);
      setRowMenuOpen(null);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [exportOpen, rowMenuOpen]);

  /* ------------------------------ Row plumbing ------------------------------ */

  const toggleSelect = useCallback((id: string) => {
    setSelected((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  }, []);

  const toggleAll = useCallback(
    (checked: boolean) => {
      const ids = visibleRows.map((row) => row.id);
      setSelected((current) =>
        checked
          ? Array.from(new Set([...current, ...ids]))
          : current.filter((id) => !ids.includes(id)),
      );
    },
    [visibleRows],
  );

  const toggleExpand = useCallback((id: string) => {
    setExpanded((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  }, []);

  const openModal = useCallback(
    (modal: StudentListModalId, row: StudentRow | null, context = '') => {
      setModalStudent(row);
      setModalContext(context);
      setActiveModal(modal);
    },
    [],
  );

  const handleRowMenu = useCallback(
    (row: StudentRow, item: RowMenuItem) => {
      setRowMenuOpen(null);
      if (item.modal) openModal(item.modal, row, item.label);
      else if (item.action) runAction(item.action);
    },
    [openModal, runAction],
  );

  const handleBulkAction = useCallback(
    (action: BulkAction) => {
      if (action.modal) openModal(action.modal, null, action.label);
      else if (action.action) runAction(action.action);
    },
    [openModal, runAction],
  );

  const confirmDelete = useCallback(() => {
    const doomed = modalStudent ? [modalStudent.id] : selected;
    setRoster((current) => current.filter((row) => !doomed.includes(row.id)));
    setSelected((current) => current.filter((id) => !doomed.includes(id)));
    setActiveModal(null);
    push(doomed.length > 1 ? `${doomed.length} students deleted.` : 'Student deleted.');
  }, [modalStudent, selected, push]);

  // The generic confirm dialog backs the row menu's Suspend entry.
  const confirmAction = useCallback(() => {
    const target = modalStudent;
    setActiveModal(null);
    if (!target) return;
    setRoster((current) =>
      current.map((row) =>
        row.id === target.id
          ? { ...row, status: 'Suspended', statusClass: 'is-suspended' }
          : row,
      ),
    );
    push(`${target.name} suspended.`);
  }, [modalStudent, push]);

  const rangeFrom = filtered.length === 0 ? 0 : (currentPage - 1) * size + 1;
  const rangeTo = Math.min(currentPage * size, filtered.length);

  return (
    <>
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content">
          {/* Page Header */}
          <div className="d-md-flex d-block align-items-center justify-content-between flex-wrap gap-2 mb-3">
            <div className="my-auto mb-2">
              <h3 className="page-title mb-1">Students List</h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={routes.adminDashboard}>Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">Students</li>
                  <li className="breadcrumb-item active" aria-current="page">
                    All Students
                  </li>
                </ol>
              </nav>
            </div>
            {/* Page-level actions. Grid-level actions (search, filters, columns,
                refresh, density) live in the workspace toolbar instead. */}
            <div className="d-flex my-xl-auto right-content align-items-center flex-wrap">
              <div className="me-2 mb-2">
                <button
                  type="button"
                  className="btn btn-outline-light bg-white btn-sm fw-medium d-inline-flex align-items-center"
                  onClick={() => openModal('import', null)}
                >
                  <i className="ti ti-file-import me-2" />
                  Import
                </button>
              </div>
              <div className="dropdown me-2 mb-2">
                <button
                  type="button"
                  className="dropdown-toggle btn btn-outline-light bg-white btn-sm fw-medium d-inline-flex align-items-center"
                  aria-expanded={exportOpen}
                  onMouseDown={(event) => event.stopPropagation()}
                  onClick={() => setExportOpen((open) => !open)}
                >
                  <i className="ti ti-file-export me-2" />
                  Export
                </button>
                <ul className={`dropdown-menu dropdown-menu-end p-3${exportOpen ? ' show' : ''}`}>
                  {exportActions.map((item) => (
                    <li key={item.id}>
                      <button
                        type="button"
                        className="dropdown-item rounded-1"
                        onClick={() => {
                          setExportOpen(false);
                          runAction(item.id);
                        }}
                      >
                        <i className={`${item.icon} me-2`} />
                        {item.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mb-2">
                <Link
                  to={routes.addStudent}
                  className="btn btn-primary btn-sm d-flex align-items-center"
                >
                  <i className="ti ti-square-rounded-plus me-2" />
                  Add Student
                </Link>
              </div>
            </div>
          </div>
          {/* /Page Header */}

          {/* Students List */}
          <div className="card">
            <div
              className={`data-workspace classes-workspace${loading ? '' : ' is-loaded'}${
                fullscreen ? ' is-fullscreen card-fullscreen' : ''
              }`}
              id="classWorkspace"
              data-density={density}
              ref={workspaceRef}
            >
              {/* ===================== TOOLBAR ===================== */}
              {!loading ? (
                <StudentListToolbar
                  search={search}
                  onSearch={setSearch}
                  view={view}
                  onView={changeView}
                  viewCounts={viewCounts}
                  filters={filters}
                  onFilter={applyFilter}
                  onApplyFilters={() =>
                    push(`${filtered.length} student(s) match the current filters.`)
                  }
                  onClearFilters={clearFilters}
                  columns={columns}
                  onColumn={toggleColumn}
                  onResetColumns={resetColumns}
                  density={density}
                  onDensity={setDensity}
                  onRefresh={refresh}
                  fullscreen={fullscreen}
                  onFullscreen={toggleFullscreen}
                  sort={sort}
                  onSort={sortFromMenu}
                  openMenu={openMenu}
                  onOpenMenu={setOpenMenu}
                  chips={chips}
                  onClearChip={(key) => applyFilter(key, '')}
                  matchCount={filtered.length}
                  totalCount={roster.length}
                  onSaveView={() => openModal('saveView', null)}
                />
              ) : null}

              {/* ===================== SKELETON LOADING ===================== */}
              {loading ? <StudentListSkeleton /> : null}

              {/* ===================== LIVE CONTENT ===================== */}
              {!loading ? (
                <div className="live-content">
                  {/* Summary strip */}
                  <SummaryStrip selectedCount={selected.length} filteredCount={filtered.length} />

                  <BulkActionBar
                    count={selected.length}
                    onAction={handleBulkAction}
                    onClear={() => setSelected([])}
                  />

                  {/* Table */}
                  {filtered.length > 0 ? (
                    <StudentTable
                      rows={visibleRows}
                      columns={columns}
                      sort={sort}
                      sortAsc={sortAsc}
                      onSort={sortFromHeader}
                      selected={selected}
                      onToggleSelect={toggleSelect}
                      allChecked={allChecked}
                      someChecked={someChecked}
                      onToggleAll={toggleAll}
                      expanded={expanded}
                      onToggleExpand={toggleExpand}
                      openMenu={rowMenuOpen}
                      onOpenMenu={setRowMenuOpen}
                      onRowMenu={handleRowMenu}
                      onMessage={(row) => openModal('message', row, 'Message Parent')}
                    />
                  ) : null}

                  {/* Empty state */}
                  <div
                    className={`workspace-empty-state${filtered.length === 0 ? ' show' : ''}`}
                    id="clsEmpty"
                  >
                    <div className="workspace-empty-art">
                      <i className="ti ti-mood-empty" />
                    </div>
                    <h5>No students match your filters</h5>
                    <p>
                      Try adjusting your search terms or clearing the active filters to see more
                      results.
                    </p>
                    <button type="button" className="btn btn-primary" onClick={clearFilters}>
                      <i className="ti ti-rotate me-1" />
                      Reset filters
                    </button>
                  </div>

                  {/* Pagination footer */}
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
            </div>
          </div>
          {/* /Students List */}
        </div>
      </div>
      {/* /Page Wrapper */}

      <StudentListModals
        active={activeModal}
        student={modalStudent}
        selectedCount={selected.length}
        context={modalContext}
        onClose={() => setActiveModal(null)}
        onToast={push}
        onConfirmDelete={confirmDelete}
        onConfirmAction={confirmAction}
      />

      <ToastStack toasts={toasts} onDismiss={dismiss} id="sw_toasts" />
    </>
  );
};

export default StudentList;
