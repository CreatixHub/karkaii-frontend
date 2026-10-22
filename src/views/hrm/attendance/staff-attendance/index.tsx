import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import ToastStack from '@components/ui/ToastStack';
import { all_routes } from '@/routes/all_routes';
import { useToasts } from '@hooks/useToasts';
import StaffAttendanceRowView from './components/StaffAttendanceRow';
import StaffAttendanceToolbar from './components/StaffAttendanceToolbar';
import type { ActiveChip, ToolbarMenu } from './components/StaffAttendanceToolbar';
import StaffInspector from './components/StaffInspector';
import StaffAttendanceModals from './modals/StaffAttendanceModals';
import type {
  BulkActionId,
  ColumnId,
  SavedViewId,
  SortKey,
  StaffAttendanceModalId,
} from './data/staffAttendanceWorkspace.data';
import {
  DEFAULT_ATTENDANCE_DATE,
  filterChipTone,
  filterFields,
  PRESENT_BADGE,
  summaryTiles,
  toggleableColumns,
} from './data/staffAttendanceWorkspace.data';
import type { StaffAttendanceRow } from './data/staffAttendance.data';
import { checkInMinutes, checkInState, staffRoster, workedMinutes } from './data/staffAttendance.data';

const routes = all_routes;

const PAGE_SIZE = 8;

const EMPTY_FILTERS: Record<string, string> = {
  'attendance-date': DEFAULT_ATTENDANCE_DATE,
  'date-range': '',
  department: '',
  designation: '',
  'staff-type': '',
  campus: '',
  shift: '',
  'attendance-status': '',
  'check-in-status': '',
};

const ALL_COLUMNS = toggleableColumns.reduce<Record<ColumnId, boolean>>(
  (acc, column) => {
    acc[column.id] = true;
    return acc;
  },
  {} as Record<ColumnId, boolean>,
);

/** Only these facets narrow the grid; the two date fields scope the report. */
const matchesFilters = (row: StaffAttendanceRow, filters: Record<string, string>) => {
  if (filters.department && row.department !== filters.department) return false;
  if (filters.designation && row.designation !== filters.designation) return false;
  if (filters['staff-type'] && row.staffType !== filters['staff-type']) return false;
  if (filters.campus && row.campus !== filters.campus) return false;
  if (filters.shift && row.shift !== filters.shift) return false;
  if (filters['attendance-status'] && row.status !== filters['attendance-status']) return false;
  if (filters['check-in-status'] && checkInState(row) !== filters['check-in-status']) return false;
  return true;
};

const StaffAttendance = () => {
  const [roster, setRoster] = useState<StaffAttendanceRow[]>(staffRoster);

  const [search, setSearch] = useState('');
  const [draft, setDraft] = useState<Record<string, string>>(EMPTY_FILTERS);
  const [filters, setFilters] = useState<Record<string, string>>(EMPTY_FILTERS);
  const [sort, setSort] = useState<SortKey>('staff');
  const [view, setView] = useState<SavedViewId>('all');
  const [columns, setColumns] = useState<Record<ColumnId, boolean>>(ALL_COLUMNS);
  const [density, setDensity] = useState<'compact' | 'default'>('default');
  const [openMenu, setOpenMenu] = useState<ToolbarMenu>(null);
  const [fullscreen, setFullscreen] = useState(false);
  const [loaded, setLoaded] = useState(true);
  const [page, setPage] = useState(1);

  const [selected, setSelected] = useState<string[]>([]);
  const [expanded, setExpanded] = useState<string[]>([]);
  const [rowMenu, setRowMenu] = useState<string | null>(null);
  const [inspected, setInspected] = useState<StaffAttendanceRow | null>(null);
  const [activeModal, setActiveModal] = useState<StaffAttendanceModalId | null>(null);
  const [modalRow, setModalRow] = useState<StaffAttendanceRow | null>(null);

  const { toasts, push, dismiss } = useToasts();

  /* --------------------------------- Filtering ------------------------------ */

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();

    const list = roster.filter((row) => {
      if (term) {
        const haystack = [row.name, row.id, row.designation, row.department].join(' ').toLowerCase();
        if (!haystack.includes(term)) return false;
      }
      if (view === 'absentees' && row.status !== 'Absent') return false;
      if (view === 'late' && row.status !== 'Late') return false;
      return matchesFilters(row, filters);
    });

    return [...list].sort((a, b) => {
      switch (sort) {
        case 'checkin':
          return checkInMinutes(a.checkIn) - checkInMinutes(b.checkIn) || a.name.localeCompare(b.name);
        case 'hours':
          return workedMinutes(b.workingHours) - workedMinutes(a.workingHours) || a.name.localeCompare(b.name);
        case 'staff':
        default:
          return a.name.localeCompare(b.name);
      }
    });
  }, [roster, search, view, filters, sort]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const shown = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  /* --------------------------------- Chips ---------------------------------- */

  const chips = useMemo<ActiveChip[]>(() => {
    const active: ActiveChip[] = [];
    filterFields.forEach((field) => {
      const value = filters[field.id];
      if (!value) return;
      active.push({ id: field.id, label: value, tone: filterChipTone[field.id] ?? 'primary' });
    });
    return active;
  }, [filters]);

  const applyFilters = useCallback(() => {
    setFilters(draft);
    setPage(1);
    setOpenMenu(null);
    push('Filters applied');
  }, [draft, push]);

  const resetFilters = useCallback(() => {
    setDraft(EMPTY_FILTERS);
    setFilters(EMPTY_FILTERS);
    setSearch('');
    setView('all');
    setPage(1);
    push('Filters cleared');
  }, [push]);

  const clearChip = useCallback((id: string) => {
    setDraft((current) => ({ ...current, [id]: '' }));
    setFilters((current) => ({ ...current, [id]: '' }));
    setPage(1);
  }, []);

  /* ------------------------------ Toolbar plumbing --------------------------- */

  // The template's refresh button had no script; here it replays the workspace.
  const refresh = useCallback(() => {
    setLoaded(false);
    window.setTimeout(() => {
      setRoster(staffRoster);
      setLoaded(true);
      push('Staff attendance refreshed');
    }, 600);
  }, [push]);

  const toggleFullscreen = useCallback(() => {
    if (document.fullscreenElement) document.exitFullscreen();
    else document.documentElement.requestFullscreen();
  }, []);

  useEffect(() => {
    const sync = () => setFullscreen(document.fullscreenElement !== null);
    document.addEventListener('fullscreenchange', sync);
    return () => document.removeEventListener('fullscreenchange', sync);
  }, []);

  const openModalFor = useCallback((row: StaffAttendanceRow | null, modal: StaffAttendanceModalId) => {
    setModalRow(row);
    setActiveModal(modal);
    setRowMenu(null);
  }, []);

  /* ------------------------------- Bulk actions ------------------------------ */

  const setStatusFor = useCallback((ids: string[], status: 'Present' | 'Absent') => {
    setRoster((current) =>
      current.map((row) =>
        ids.includes(row.id)
          ? {
              ...row,
              status,
              recordedBy: 'K. Larry',
              method: { label: 'Manual', icon: 'ti ti-writing' },
            }
          : row,
      ),
    );
  }, []);

  const runBulkAction = useCallback(
    (action: BulkActionId) => {
      if (action === 'print') {
        window.print();
        return;
      }
      if (selected.length === 0) {
        push('Select at least one staff member first', 'warning');
        return;
      }

      switch (action) {
        case 'present':
          setStatusFor(selected, 'Present');
          push(`${selected.length} marked present`);
          break;
        case 'absent':
          setStatusFor(selected, 'Absent');
          push(`${selected.length} marked absent`);
          break;
        case 'approve':
          push(`${selected.length} attendance records approved`);
          break;
        case 'export':
          push(`${selected.length} records queued for export`);
          break;
        case 'report':
          push('Attendance report generated');
          break;
      }
    },
    [selected, setStatusFor, push],
  );

  const confirmDelete = useCallback(() => {
    const doomed = modalRow ? [modalRow.id] : selected;
    setRoster((current) => current.filter((row) => !doomed.includes(row.id)));
    setSelected((current) => current.filter((id) => !doomed.includes(id)));
    setActiveModal(null);
    push(doomed.length > 1 ? `${doomed.length} records deleted` : 'Attendance record deleted');
  }, [modalRow, selected, push]);

  /* --------------------------------- Selection ------------------------------- */

  const allShownSelected = shown.length > 0 && shown.every((row) => selected.includes(row.id));

  const toggleSelectAll = () => {
    const ids = shown.map((row) => row.id);
    setSelected((current) =>
      allShownSelected ? current.filter((id) => !ids.includes(id)) : Array.from(new Set([...current, ...ids])),
    );
  };

  const toggleSelect = (id: string) =>
    setSelected((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));

  const toggleExpand = (id: string) =>
    setExpanded((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));

  const summaryValue = (id: string) =>
    id === 'date' ? filters['attendance-date'] || 'All dates' : summaryTiles.find((tile) => tile.id === id)?.value ?? '';

  const rangeStart = filtered.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const rangeEnd = Math.min(currentPage * PAGE_SIZE, filtered.length);

  return (
    <>
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content content-two">
          {/* Page Header */}
          <div className="d-md-flex d-block align-items-center justify-content-between flex-wrap gap-2 mb-3">
            <div className="my-auto mb-2">
              <h3 className="page-title mb-1">Staff Attendance</h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={routes.adminDashboard}>Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <Link to="#">HRM</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Staff Attendance
                  </li>
                </ol>
              </nav>
            </div>
            <div className="d-flex my-xl-auto right-content align-items-center flex-wrap">
              <span className="badge badge-soft-success d-inline-flex align-items-center me-2 mb-2">
                <i className="ti ti-circle-filled fs-6 me-1" />
                {PRESENT_BADGE}
              </span>
              <button
                type="button"
                className="btn btn-outline-light bg-white me-2 mb-2 d-inline-flex align-items-center"
                onClick={() => openModalFor(roster[0] ?? null, 'history')}
              >
                <i className="ti ti-history me-1" />
                History
              </button>
              <button
                type="button"
                className="btn btn-primary mb-2 d-inline-flex align-items-center"
                onClick={() => openModalFor(null, 'mark')}
              >
                <i className="ti ti-user-check me-1" />
                Mark Attendance
              </button>
            </div>
          </div>
          {/* /Page Header */}

          <div
            className={`card mb-0 data-workspace classes-workspace${loaded ? ' is-loaded' : ''}`}
            id="att_card"
            data-density={density === 'compact' ? 'compact' : undefined}
          >
            {/* Sticky Attendance Toolbar */}
            <StaffAttendanceToolbar
              search={search}
              onSearch={(value) => {
                setSearch(value);
                setPage(1);
              }}
              draft={draft}
              onDraft={(id, value) => setDraft((current) => ({ ...current, [id]: value }))}
              onApplyFilters={applyFilters}
              onResetFilters={resetFilters}
              sort={sort}
              onSort={setSort}
              view={view}
              onView={(next) => {
                setView(next);
                setPage(1);
              }}
              onSaveView={() => push('Current view saved')}
              selectedCount={selected.length}
              onBulkAction={runBulkAction}
              columns={columns}
              onToggleColumn={(id) => setColumns((current) => ({ ...current, [id]: !current[id] }))}
              density={density}
              onDensity={setDensity}
              onRefresh={refresh}
              onImport={() => openModalFor(null, 'mark')}
              onExport={(format) => push(format === 'pdf' ? 'Export as PDF started' : 'Export as Excel started')}
              onPrint={() => window.print()}
              fullscreen={fullscreen}
              onFullscreen={toggleFullscreen}
              onMark={() => openModalFor(null, 'mark')}
              openMenu={openMenu}
              onOpenMenu={setOpenMenu}
              chips={chips}
              onClearChip={clearChip}
              matchCount={filtered.length}
              totalCount={roster.length}
            />
            {/* /Sticky Attendance Toolbar */}

            {/* Attendance Summary Bar */}
            <div className="p-3 border-bottom">
              <div className="row g-3 align-items-center">
                {summaryTiles.map((tile) => (
                  <div className="col-xl col-md-3 col-6" key={tile.id}>
                    <div className="d-flex align-items-center gap-2 border-end-lg pe-xl-2">
                      <span className={`avatar avatar-md ${tile.tint} rounded flex-shrink-0`}>
                        <i className={`${tile.icon} fs-20`} />
                      </span>
                      <div>
                        <span className="fs-12 text-muted d-block">{tile.label}</span>
                        <span className="fw-semibold">{summaryValue(tile.id)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* /Attendance Summary Bar */}

            {/* Premium Attendance Grid */}
            <div className="data-table dt-cards">
              <table className="table">
                <thead>
                  <tr>
                    <th className="dt-pin">
                      <input
                        type="checkbox"
                        className="dt-check"
                        id="select-all"
                        aria-label="Select all staff"
                        checked={allShownSelected}
                        onChange={toggleSelectAll}
                      />
                    </th>
                    <th className="card-expand-toggle" />
                    <th>Staff Member</th>
                    {columns.department ? <th>Department</th> : null}
                    {columns.designation ? <th>Designation</th> : null}
                    {columns.shift ? <th>Shift</th> : null}
                    <th>Check-In</th>
                    <th>Check-Out</th>
                    <th>Working Hours</th>
                    {columns.break ? <th>Break</th> : null}
                    {columns.overtime ? <th>Overtime</th> : null}
                    <th>Attendance</th>
                    {columns.method ? <th>Method</th> : null}
                    {columns.recordedBy ? <th>Recorded By</th> : null}
                    {columns.lastUpdated ? <th>Last Updated</th> : null}
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {shown.map((row, index) => (
                    <StaffAttendanceRowView
                      key={row.id}
                      row={row}
                      index={index}
                      columns={columns}
                      selected={selected.includes(row.id)}
                      onToggleSelect={() => toggleSelect(row.id)}
                      expanded={expanded.includes(row.id)}
                      onToggleExpand={() => toggleExpand(row.id)}
                      menuOpen={rowMenu === row.id}
                      onToggleMenu={() => setRowMenu(rowMenu === row.id ? null : row.id)}
                      onInspect={() => {
                        setInspected(row);
                        setRowMenu(null);
                      }}
                      onOpenModal={(modal) => openModalFor(row, modal)}
                      onPrint={() => {
                        setRowMenu(null);
                        window.print();
                      }}
                      onDownload={() => {
                        setRowMenu(null);
                        push(`${row.name}'s attendance download started`);
                      }}
                    />
                  ))}
                </tbody>
              </table>
            </div>
            {/* /Premium Attendance Grid */}

            {/* Empty state */}
            <div className={`text-center py-5${filtered.length === 0 ? '' : ' d-none'}`} id="att_empty">
              <span className="avatar avatar-xxl bg-primary-transparent text-primary rounded-circle flex-shrink-0 mb-3">
                <i className="ti ti-calendar-off fs-36" />
              </span>
              <h5 className="mb-1">No Attendance Records Found</h5>
              <p className="text-muted mb-3">
                No staff attendance matches the selected filters. Adjust the filters or mark attendance for this
                date to get started.
              </p>
              <button
                type="button"
                className="btn btn-primary d-inline-flex align-items-center"
                onClick={() => openModalFor(null, 'mark')}
              >
                <i className="ti ti-user-check me-1" />
                Mark Attendance
              </button>
            </div>

            <div className="card-footer d-flex align-items-center justify-content-between flex-wrap gap-2">
              <p className="mb-0 text-muted">
                Showing {rangeStart} to {rangeEnd} of {filtered.length} staff
              </p>
              <nav>
                <ul className="pagination mb-0">
                  <li className={`page-item${currentPage === 1 ? ' disabled' : ''}`}>
                    <button
                      type="button"
                      className="page-link"
                      onClick={() => setPage((value) => Math.max(1, value - 1))}
                    >
                      Previous
                    </button>
                  </li>
                  {Array.from({ length: pageCount }, (_, index) => index + 1).map((number) => (
                    <li className={`page-item${currentPage === number ? ' active' : ''}`} key={number}>
                      <button type="button" className="page-link" onClick={() => setPage(number)}>
                        {number}
                      </button>
                    </li>
                  ))}
                  <li className={`page-item${currentPage === pageCount ? ' disabled' : ''}`}>
                    <button
                      type="button"
                      className="page-link"
                      onClick={() => setPage((value) => Math.min(pageCount, value + 1))}
                    >
                      Next
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          </div>

          {/* Attendance Inspector Offcanvas */}
          <StaffInspector
            row={inspected}
            onClose={() => setInspected(null)}
            onOpenModal={(modal) => {
              const row = inspected;
              setInspected(null);
              openModalFor(row, modal);
            }}
          />
          {/* /Attendance Inspector Offcanvas */}
        </div>
      </div>
      {/* /Page Wrapper */}

      {/* Modals */}
      <StaffAttendanceModals
        active={activeModal}
        row={modalRow ?? roster[0] ?? null}
        onClose={() => setActiveModal(null)}
        onToast={push}
        onOpenModal={setActiveModal}
        onConfirmDelete={confirmDelete}
      />
      {/* /Modals */}

      <ToastStack toasts={toasts} onDismiss={dismiss} id="attToast" />
    </>
  );
};

export default StaffAttendance;
