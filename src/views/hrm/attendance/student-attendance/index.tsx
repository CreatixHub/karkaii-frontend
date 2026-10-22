import { useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { all_routes } from '@/routes/all_routes';
import { useReveal } from '@hooks/useReveal';
import { useToasts } from '@hooks/useToasts';
import ToastStack from '@components/ui/ToastStack';
import AttendanceFilterBar from './components/AttendanceFilterBar';
import AttendanceRegisterTable from './components/AttendanceRegisterTable';
import type { SortDir, SortKey } from './components/AttendanceRegisterTable';
import AttendanceAnalyticsPanel from './components/AttendanceAnalyticsPanel';
import AttendanceInsights from './components/AttendanceInsights';
import AttendanceOperationsPanel from './components/AttendanceOperationsPanel';
import AttendanceBulkBar from './components/AttendanceBulkBar';
import AttendanceModals from './modals/AttendanceModals';
import type { AttendanceRecord, FilterChip, StudentAttendanceModalId } from './data/attendanceRegister.data';
import { attendanceRecords, defaultFilterDate, initialFilterChips } from './data/attendanceRegister.data';

const routes = all_routes;

const COLUMN_LABEL: Record<SortKey, string> = {
  name: 'Student',
  status: 'Status',
  pct: 'Attendance %',
};

/** `exportCsv()` from the template's script, ported to build the same file from React state. */
const exportRegisterCsv = (records: AttendanceRecord[]) => {
  const heads = [
    'Student',
    'Admission No',
    'Roll No',
    'Class',
    'Section',
    'Status',
    'Check-in',
    'Check-out',
    'Late (min)',
    'Leave',
    'Attendance %',
    'Remarks',
  ];
  const rows = records.map((record) => [
    record.name,
    record.admissionNo,
    record.rollNo,
    record.klass,
    record.section,
    record.status.label,
    record.checkIn ? `${record.checkIn.time} ${record.checkIn.note}` : '—',
    record.checkOut ? `${record.checkOut.time} ${record.checkOut.note}` : '—',
    record.lateMin ?? '—',
    record.leave?.label ?? '—',
    record.pct.value,
    record.remark.text,
  ]);
  const csv = [heads, ...rows]
    .map((line) => line.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    .join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'attendance-register.csv';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.setTimeout(() => URL.revokeObjectURL(url), 1500);
};

const StudentAttendance = () => {
  const { loading, revealed } = useReveal(850);
  const { toasts, push, dismiss } = useToasts();

  const [exportOpen, setExportOpen] = useState(false);

  // Smart filter bar
  const [activeView, setActiveView] = useState('today');
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [date, setDate] = useState(defaultFilterDate);
  const [chips, setChips] = useState<FilterChip[]>(initialFilterChips);

  // Register workspace
  const [records] = useState<AttendanceRecord[]>(attendanceRecords);
  const [statusOverride, setStatusOverride] = useState<Record<number, string>>({});
  const [gridSearch, setGridSearch] = useState('');
  const [dense, setDense] = useState(false);
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortDir, setSortDir] = useState<SortDir | null>(null);
  const [selected, setSelected] = useState<number[]>([]);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [rowsPerPage, setRowsPerPage] = useState('5');

  // Analytics / operations
  const [range, setRange] = useState<'week' | 'month' | 'term'>('week');
  const [leaveTab, setLeaveTab] = useState<'pending' | 'approved' | 'rejected'>('pending');

  // Modals
  const [activeModal, setActiveModal] = useState<StudentAttendanceModalId | null>(null);

  const searchInputRef = useRef<HTMLInputElement>(null);

  // `attSearch` and `attGridSearch` both filter `tbody tr.record-row` in the template.
  const visibleRecords = useMemo(() => {
    const mainTerm = search.trim().toLowerCase();
    const gridTerm = gridSearch.trim().toLowerCase();
    if (!mainTerm && !gridTerm) return records;

    const haystackOf = (record: AttendanceRecord) =>
      [record.name, record.admissionNo, record.rollNo, record.klass, record.section, record.status.label]
        .join(' ')
        .toLowerCase();

    return records.filter((record) => {
      const haystack = haystackOf(record);
      return (!mainTerm || haystack.includes(mainTerm)) && (!gridTerm || haystack.includes(gridTerm));
    });
  }, [records, search, gridSearch]);

  const decoratedRecords = useMemo(
    () => visibleRecords.map((record) => ({ ...record, statusAttr: statusOverride[record.id] ?? record.statusAttr })),
    [visibleRecords, statusOverride],
  );

  const refresh = () => push('Register refreshed.');

  const openModal = (id: string) => setActiveModal(id as StudentAttendanceModalId);
  const closeModal = () => setActiveModal(null);

  const toggleSelect = (id: number) =>
    setSelected((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));

  const toggleSelectAll = () =>
    setSelected((current) =>
      current.length === decoratedRecords.length ? [] : decoratedRecords.map((record) => record.id),
    );

  const clearSelection = () => setSelected([]);

  const handleSort = (key: SortKey) => {
    const nextDir: SortDir = sortKey === key && sortDir === 'asc' ? 'desc' : 'asc';
    setSortKey(key);
    setSortDir(nextDir);
    push(`Sorted by ${COLUMN_LABEL[key]} · ${nextDir === 'asc' ? 'ascending' : 'descending'}.`, 'info');
  };

  const handleView = (id: string) => {
    setActiveView(id);
    const label = id.charAt(0).toUpperCase() + id.slice(1);
    push(`Showing "${label}".`, 'info');
  };

  const handleRemoveChip = (id: string) => {
    setChips((current) => current.filter((chip) => chip.id !== id));
    push('Filter removed.', 'info');
  };

  const handleClearAll = () => {
    setChips([]);
    setSearch('');
    setGridSearch('');
    push('All filters cleared.');
  };

  const handleToggleDense = () => {
    setDense((current) => {
      const next = !current;
      push(next ? 'Compact row density applied.' : 'Comfortable row density applied.', 'info');
      return next;
    });
  };

  const handleExport = () => {
    push('Preparing export…', 'info');
    exportRegisterCsv(decoratedRecords);
  };

  const handleBulk = (status: 'present' | 'absent') => {
    setStatusOverride((current) => {
      const next = { ...current };
      selected.forEach((id) => {
        next[id] = status;
      });
      return next;
    });
    push(`${selected.length} student(s) marked ${status}.`);
    clearSelection();
  };

  const handleDrawerAction = (kind: 'mark' | 'export' | 'leave' | 'notify' | 'doc', id: number) => {
    if (kind === 'notify') return openModal('att_notify');
    if (kind === 'leave') return openModal('att_leave');
    if (kind === 'export') {
      push('Preparing export…', 'info');
      return exportRegisterCsv(decoratedRecords);
    }
    if (kind === 'doc') return push('Opening the supporting document…', 'info');
    void id;
    return push('Status updated for this student.');
  };

  return (
    <div className="page-wrapper">
      <div className="content content-two">
        {/* Page Header */}
        <div className="d-md-flex d-block align-items-center justify-content-between flex-wrap gap-2 mb-3">
          <div className="my-auto mb-2">
            <h3 className="page-title mb-1">Student Attendance</h3>
            <nav>
              <ol className="breadcrumb mb-0">
                <li className="breadcrumb-item">
                  <Link to={routes.adminDashboard}>Dashboard</Link>
                </li>
                <li className="breadcrumb-item">
                  <Link to="#">Report</Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  Student Attendance
                </li>
              </ol>
            </nav>
          </div>
          <div className="d-flex my-xl-auto right-content align-items-center flex-wrap">
            <div className="pe-1 mb-2">
              <button
                type="button"
                className="btn btn-outline-light bg-white btn-icon me-1"
                aria-label="Refresh"
                title="Refresh"
                onClick={refresh}
              >
                <i className="ti ti-refresh" />
              </button>
            </div>
            <div className="pe-1 mb-2">
              <button
                type="button"
                className="btn btn-outline-light bg-white btn-icon me-1"
                aria-label="Print"
                title="Print"
                onClick={() => window.print()}
              >
                <i className="ti ti-printer" />
              </button>
            </div>
            <div className="dropdown me-2 mb-2">
              <button
                type="button"
                className="dropdown-toggle btn btn-light fw-medium d-inline-flex align-items-center"
                aria-expanded={exportOpen}
                onMouseDown={(event) => event.stopPropagation()}
                onClick={() => setExportOpen((open) => !open)}
              >
                <i className="ti ti-file-export me-2" />
                Export
              </button>
              <ul className={`dropdown-menu dropdown-menu-end p-3${exportOpen ? ' show' : ''}`}>
                <li>
                  <button
                    type="button"
                    className="dropdown-item rounded-1"
                    onClick={() => {
                      setExportOpen(false);
                      push('Preparing export…', 'info');
                    }}
                  >
                    <i className="ti ti-file-type-pdf me-1" />
                    Export as PDF
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    className="dropdown-item rounded-1"
                    onClick={() => {
                      setExportOpen(false);
                      push('Preparing export…', 'info');
                      exportRegisterCsv(decoratedRecords);
                    }}
                  >
                    <i className="ti ti-file-type-xls me-1" />
                    Export as Excel{' '}
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
        {/* /Page Header */}

        {/* ===== ATTENDANCE COMMAND CENTER ===== */}
        <div className={`student-attendance${loading ? ' loading' : ''}`} id="attCenter">
          {loading ? (
            <div className="skeleton-loader" aria-hidden="true">
              <div className="skeleton skeleton-hero" />
              <div className="skeleton skeleton-filters" />
              <div className="row g-3 mb-3">
                <div className="col-12 col-lg-8">
                  <div className="skeleton skeleton-grid" />
                </div>
                <div className="col-12 col-lg-4">
                  <div className="skeleton skeleton-side" />
                </div>
              </div>
              <div className="row g-3">
                <div className="col-12 col-lg-4">
                  <div className="skeleton skeleton-block" />
                </div>
                <div className="col-12 col-lg-4">
                  <div className="skeleton skeleton-block" />
                </div>
                <div className="col-12 col-lg-4">
                  <div className="skeleton skeleton-block" />
                </div>
              </div>
            </div>
          ) : null}

          {!loading ? (
            <div className={`live-flag${revealed ? ' is-revealed' : ''}`}>
              <AttendanceFilterBar
                activeView={activeView}
                onView={handleView}
                onSaveView={() => push('Current filters saved as a new view.')}
                search={search}
                onSearch={setSearch}
                searchInputRef={searchInputRef}
                filters={filters}
                onFilterChange={(id, value) => setFilters((current) => ({ ...current, [id]: value }))}
                date={date}
                onDateChange={setDate}
                onOpenAdvanced={() => openModal('att_advanced')}
                chips={chips}
                onRemoveChip={handleRemoveChip}
                onClearAll={handleClearAll}
              />

              <AttendanceRegisterTable
                records={decoratedRecords}
                gridSearch={gridSearch}
                onGridSearch={setGridSearch}
                dense={dense}
                onToggleDense={handleToggleDense}
                onColumns={() => push('Column visibility panel opened.', 'info')}
                onExport={handleExport}
                sortKey={sortKey}
                sortDir={sortDir}
                onSort={handleSort}
                selected={selected}
                onToggleSelect={toggleSelect}
                onToggleSelectAll={toggleSelectAll}
                expandedId={expandedId}
                onToggleExpand={(id) => setExpandedId((current) => (current === id ? null : id))}
                onMark={() => push('Status updated for this student.')}
                onMore={() => push('More actions…', 'info')}
                onOpenNotify={() => openModal('att_notify')}
                onOpenLeave={() => openModal('att_leave')}
                onDrawerAction={handleDrawerAction}
                onPage={() => push('Loading page…', 'info')}
                rowsPerPage={rowsPerPage}
                onRowsPerPage={setRowsPerPage}
              />

              <AttendanceAnalyticsPanel range={range} onRange={setRange} />

              <AttendanceInsights
                onAction={(value) => {
                  const messages: Record<string, [string, 'success' | 'info' | 'warning' | 'danger']> = {
                    risk: ['Opening the at-risk list — 8 students below 75%.', 'info'],
                    explain: ['Prediction uses 6 weeks of attendance, weekday patterns and transport delays.', 'info'],
                    reschedule: ['Route 07 pickup moved 10 minutes earlier.', 'success'],
                    apply_plan: ['Improvement plan applied — 3 actions scheduled.', 'success'],
                  };
                  const entry = messages[value];
                  if (entry) push(entry[0], entry[1]);
                }}
                onOpenModal={openModal}
              />

              <AttendanceOperationsPanel
                leaveTab={leaveTab}
                onLeaveTab={(tab) => {
                  setLeaveTab(tab);
                  push(`Showing "${tab.charAt(0).toUpperCase()}${tab.slice(1)}".`, 'info');
                }}
                onOpenLeaveModal={() => openModal('att_leave')}
                onApprove={() => push('Leave request approved.')}
                onReject={() => push('Leave request rejected.', 'warning')}
                onFullLog={() => push('Opening the full attendance audit log…', 'info')}
                onMarkAllRead={() => push('All notifications marked as read.')}
              />
            </div>
          ) : null}

          <AttendanceBulkBar
            count={selected.length}
            onMarkPresent={() => handleBulk('present')}
            onMarkAbsent={() => handleBulk('absent')}
            onApproveLeave={() => push('Leave request approved.')}
            onRejectLeave={() => push('Leave request rejected.', 'warning')}
            onSendSms={() => openModal('att_notify')}
            onExport={handleExport}
            onPrint={() => push('Sending the attendance register to the printer…', 'info')}
            onClose={clearSelection}
          />

          <ToastStack toasts={toasts} onDismiss={dismiss} id="attToasts" />
        </div>
        {/* /Attendance Command Center */}
      </div>

      <AttendanceModals active={activeModal} onClose={closeModal} onToast={push} />
    </div>
  );
};

export default StudentAttendance;
