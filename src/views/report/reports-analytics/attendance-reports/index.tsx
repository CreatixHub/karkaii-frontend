import { useCallback, useMemo, useState } from 'react';
import ToastStack from '@components/ui/ToastStack';
import {
  ActionLink,
  ReportPageHeader,
  ReportWorkspaceShell,
  useWorkspace,
} from '@components/workspace';
import type {
  ColumnDef,
  FilterField,
  QuickFilter,
  ReportBulkAction,
  ReportScope,
  SavedView,
  SortOption,
  SummaryStripItem,
  WorkspaceMenu,
} from '@components/workspace';
import ImageWithBasePath from '@core/common/imageWithBasePath';
import { all_routes } from '@/routes/all_routes';
import { useToasts } from '@hooks/useToasts';
import AttendanceModals from './modals/AttendanceModals';
import type { AttendanceModalId } from './modals/AttendanceModals';
import type { AttendanceRecord, RecordType } from './data/attendance.data';
import {
  academicYearOptions,
  attendancePctOf,
  attendanceRecords as seededRecords,
  averageDelayLabel,
  bandOf,
  bandOptions,
  classOf,
  classOptions,
  daysMarkedOf,
  departmentOf,
  departmentOptions,
  designationOf,
  designationOptions,
  effectivePresentOf,
  exceptionLabelOf,
  isLowAttendance,
  lateThresholdOf,
  leaveBalanceOf,
  ledgerNoteOf,
  monthPctOf,
  pctLabel,
  presentOf,
  rateBadgeOf,
  recordTypeOptions,
  REGISTER_TOTAL,
  REPORT_RANGE,
  searchIndexOf,
  sectionOf,
  sectionOptions,
  shiftOptions,
  statusFilterOptions,
  statusOf,
  statusPill,
  timelineTone,
  workingDaysNoteOf,
  workingDaysOf,
} from './data/attendance.data';

const routes = all_routes;

/**
 * Band 1's scope group, which narrows the grid rather than decorating it.
 *
 * The template checks Students and then renders students, teachers and staff
 * beneath it, so the radio contradicts the grid it sits above. An All choice
 * is added at the head and selected on load: the page opens on the same eight
 * rows the template shows, and picking one of the three then means something.
 */
const scopes: ReportScope[] = [
  { id: 'all', label: 'All', icon: 'ti ti-layout-list' },
  { id: 'Student', label: 'Students', icon: 'ti ti-users' },
  { id: 'Teacher', label: 'Teachers', icon: 'ti ti-chalkboard' },
  { id: 'Staff', label: 'Staff', icon: 'ti ti-briefcase' },
];

/**
 * Band 2 holds what the template calls narrowing the report down; the More
 * Filters menu holds, in its own words, "only what is not already a field
 * above". The two write into one draft.
 */
const filterFields: FilterField[] = [
  {
    id: 'date-range',
    label: 'Date Range',
    kind: 'daterange',
    surface: 'band',
    span: 'col-xxl-3 col-lg-4 col-md-6',
    chipLabel: 'Range',
    rangeFormat: 'd M Y',
    initialValue: REPORT_RANGE,
  },
  {
    id: 'academic-year',
    label: 'Academic Year',
    kind: 'select',
    surface: 'band',
    chipLabel: 'Year',
    options: academicYearOptions,
    defaultValue: academicYearOptions[0],
  },
  {
    id: 'working-days',
    label: 'Working Days',
    kind: 'select',
    surface: 'band',
    chipLabel: 'Basis',
    options: ['Term 1 · 96 days', 'July 2026 · 24 days', 'Half Yearly · 118 days', 'Custom range'],
    defaultValue: 'Term 1 · 96 days',
  },
  { id: 'shift', label: 'Shift', kind: 'select', surface: 'band', chipLabel: 'Shift', allLabel: 'All Shifts', options: shiftOptions },
  { id: 'class', label: 'Class', kind: 'select', surface: 'band', chipLabel: 'Class', allLabel: 'All Classes', options: classOptions },
  { id: 'section', label: 'Section', kind: 'select', surface: 'band', chipLabel: 'Section', allLabel: 'All Sections', options: sectionOptions },
  {
    id: 'department',
    label: 'Department',
    kind: 'select',
    surface: 'band',
    chipLabel: 'Dept',
    allLabel: 'All Departments',
    options: departmentOptions,
  },
  {
    id: 'designation',
    label: 'Designation',
    kind: 'select',
    surface: 'band',
    chipLabel: 'Role',
    allLabel: 'All Designations',
    options: designationOptions,
  },
  {
    id: 'attendance-status',
    label: 'Attendance Status',
    kind: 'select',
    surface: 'band',
    chipLabel: 'Status',
    allLabel: 'All Status',
    options: statusFilterOptions,
  },

  { id: 'record-type', label: 'Record Type', kind: 'select', chipLabel: 'Type', options: recordTypeOptions },
  { id: 'attendance-band', label: 'Attendance Band', kind: 'select', chipLabel: 'Band', options: bandOptions },
  { id: 'absent-days-from', label: 'Absent Days From', kind: 'number', chipLabel: 'Absent ≥', defaultValue: '0' },
  { id: 'absent-days-to', label: 'Absent Days To', kind: 'number', chipLabel: 'Absent ≤', defaultValue: '96' },
  { id: 'late-marks-from', label: 'Late Marks From', kind: 'number', chipLabel: 'Late ≥', defaultValue: '0' },
  { id: 'late-marks-to', label: 'Late Marks To', kind: 'number', chipLabel: 'Late ≤', defaultValue: '20' },
  {
    id: 'exceptions-only',
    label: 'Exceptions',
    kind: 'toggle',
    chipLabel: 'Exceptions',
    switchLabel: 'Only records with attendance exceptions',
  },
];

const sortOptions: SortOption[] = [
  { id: 'name', label: 'Name (A–Z)', icon: 'ti ti-abc' },
  { id: 'code', label: 'ID / Admission no.', icon: 'ti ti-hash' },
  { id: 'percent', label: 'Attendance %', icon: 'ti ti-percentage' },
  { id: 'absent', label: 'Absent days', icon: 'ti ti-user-x' },
  { id: 'late', label: 'Late marks', icon: 'ti ti-clock-exclamation' },
  { id: 'last', label: 'Last attendance', icon: 'ti ti-calendar-event' },
];

const dateKey = (value: string) => {
  const months = 'Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec'.split(' ');
  const [day, month, year] = value.split(' ');
  return Number(year) * 10000 + (months.indexOf(month) + 1) * 100 + Number(day);
};

const AttendanceReports = () => {
  const [rows, setRows] = useState<AttendanceRecord[]>(seededRecords);
  const [scope, setScope] = useState('all');
  const [openMenu, setOpenMenu] = useState<WorkspaceMenu>(null);
  const [activeModal, setActiveModal] = useState<AttendanceModalId | null>(null);
  const [modalRow, setModalRow] = useState<AttendanceRecord | null>(null);
  const [analyticsOpen, setAnalyticsOpen] = useState(false);

  const { toasts, push, dismiss } = useToasts();

  const openModal = useCallback((record: AttendanceRecord | null, modal: AttendanceModalId) => {
    setModalRow(record);
    setActiveModal(modal);
  }, []);

  /* --------------------------------- Columns -------------------------------- */

  const columns = useMemo<ColumnDef<AttendanceRecord>[]>(
    () => [
      {
        id: 'name',
        label: 'Name',
        sortable: true,
        toggleable: false,
        render: (record) => (
          <div className="dt-user">
            <ActionLink className="dt-avatar" ariaLabel={`View ${record.name}`} onClick={() => openModal(record, 'history')}>
              <ImageWithBasePath src={record.image} alt={record.name} />
            </ActionLink>
            <div>
              <ActionLink className="dt-name" onClick={() => openModal(record, 'history')}>
                {record.name}
              </ActionLink>
              <div className="dt-sub flex-nowrap text-nowrap">
                <span>{record.role}</span>
                <span className="dt-dot">•</span>
                <span>{record.shift} shift</span>
              </div>
              {record.flag ? (
                <span className={`badge badge-soft-${record.flag.tint} mt-1`}>{record.flag.label}</span>
              ) : null}
            </div>
          </div>
        ),
      },
      {
        id: 'code',
        label: 'ID / Admission No.',
        sortable: true,
        cellClassName: 'text-nowrap',
        render: (record) => (
          <>
            <span className="fs-13 fw-medium d-block">{record.code}</span>
            <span className="fs-12 text-muted">{record.since}</span>
          </>
        ),
      },
      {
        id: 'type',
        label: 'Type',
        render: (record) => (
          <span
            className={`badge badge-soft-${
              record.type === 'Student' ? 'primary' : record.type === 'Teacher' ? 'info' : 'purple'
            }`}
          >
            <i className="ti ti-user me-1" />
            {record.type}
          </span>
        ),
      },
      {
        id: 'group',
        label: 'Class / Department',
        sortable: true,
        cellClassName: 'text-nowrap',
        render: (record) => (
          <>
            <span className="fs-13 fw-medium d-block">{record.group}</span>
            <span className="fs-12 text-muted">{record.groupNote}</span>
          </>
        ),
      },
      {
        id: 'unit',
        label: 'Section / Designation',
        cellClassName: 'text-nowrap',
        render: (record) => (
          <>
            <span className="fs-13 fw-medium d-block">{record.unit}</span>
            <span className="fs-12 text-muted">{record.unitNote}</span>
          </>
        ),
      },
      {
        id: 'working',
        label: 'Working Days',
        sortable: true,
        align: 'center',
        render: (record) => <span className="fs-13 fw-medium">{workingDaysOf(record)}</span>,
      },
      {
        id: 'present',
        label: 'Present',
        sortable: true,
        align: 'center',
        render: (record) => <span className="fs-13 fw-medium text-success">{presentOf(record)}</span>,
      },
      {
        id: 'absent',
        label: 'Absent',
        sortable: true,
        align: 'center',
        render: (record) => <span className="fs-13 fw-medium">{record.absent}</span>,
      },
      {
        id: 'late',
        label: 'Late',
        sortable: true,
        align: 'center',
        render: (record) => <span className="fs-13 fw-medium">{record.lateMarks}</span>,
      },
      {
        id: 'leave',
        label: 'Leave',
        align: 'center',
        render: (record) => <span className="fs-13 fw-medium">{record.leave}</span>,
      },
      {
        id: 'half',
        label: 'Half Day',
        align: 'center',
        render: (record) => <span className="fs-13 fw-medium">{record.halfDays}</span>,
      },
      {
        id: 'percent',
        label: 'Attendance %',
        sortable: true,
        cellClassName: 'text-nowrap',
        render: (record) => {
          const badge = rateBadgeOf(record);
          return (
            <>
              <span className="fs-13 fw-semibold d-block">{pctLabel(attendancePctOf(record))}</span>
              <span className={`badge badge-soft-${badge.tint}`}>{badge.label}</span>
            </>
          );
        },
      },
      {
        id: 'last',
        label: 'Last Attendance',
        sortable: true,
        render: (record) => (
          <>
            <span className="d-block fs-13 fw-medium text-nowrap">{record.lastDate}</span>
            <span className="fs-12 text-muted d-block text-nowrap">
              {record.lastState} · {record.lastNote}
            </span>
          </>
        ),
      },
      {
        id: 'status',
        label: 'Status',
        render: (record) => (
          <>
            <span className={`dt-pill ${statusPill[statusOf(record)]}`}>
              <span className="dt-pill-dot" />
              {statusOf(record)}
            </span>
            <span className="d-block fs-12 text-muted mt-1 text-nowrap">{exceptionLabelOf(record)}</span>
          </>
        ),
      },
    ],
    [openModal],
  );

  /* -------------------------------- Workspace ------------------------------- */

  const workspace = useWorkspace<AttendanceRecord>({
    rows,
    filterFields,
    columns,
    getId: (record) => record.id,
    search: (record, term) => searchIndexOf(record).includes(term),
    matches: (record, filters) => {
      if (filters.shift && !filters.shift.startsWith(record.shift)) return false;
      if (filters.class && classOf(record) !== filters.class) return false;
      if (filters.section && sectionOf(record) !== filters.section) return false;
      if (filters.department && departmentOf(record) !== filters.department) return false;
      if (filters.designation && designationOf(record) !== filters.designation) return false;
      if (filters['attendance-status'] && record.lastState !== filters['attendance-status']) return false;
      if (filters['record-type'] && record.type !== filters['record-type']) return false;
      if (filters['attendance-band'] && bandOf(record) !== filters['attendance-band']) return false;

      const absentFrom = Number(filters['absent-days-from'] || 0);
      const absentTo = Number(filters['absent-days-to'] || 999);
      if (record.absent < absentFrom || record.absent > absentTo) return false;

      const lateFrom = Number(filters['late-marks-from'] || 0);
      const lateTo = Number(filters['late-marks-to'] || 999);
      if (record.lateMarks < lateFrom || record.lateMarks > lateTo) return false;

      if (filters['exceptions-only'] && record.exceptions.length === 0) return false;

      /*
       * Band 1's scope narrows here rather than after the fact, so the pager,
       * the empty state and the summary strip all see the same rows.
       */
      if (scope !== 'all' && record.type !== (scope as RecordType)) return false;
      return true;
    },
    /*
     * The saved views and the quick rail read the same six narrowings, so a
     * record can be reached from either and the counts on both agree.
     */
    quickMatch: (record, quick) => matchesRail(record, quick),
    viewMatch: (record, view) => matchesRail(record, view === 'all' ? null : view),
    compare: (a, b, sort) => {
      switch (sort) {
        case 'code':
          return a.code.localeCompare(b.code);
        case 'percent':
          return attendancePctOf(b) - attendancePctOf(a) || a.name.localeCompare(b.name);
        case 'absent':
          return b.absent - a.absent || a.name.localeCompare(b.name);
        case 'late':
          return b.lateMarks - a.lateMarks || a.name.localeCompare(b.name);
        case 'last':
          return dateKey(b.lastDate) - dateKey(a.lastDate) || a.name.localeCompare(b.name);
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    },
    defaultSort: 'name',
    pageSize: 8,
  });

  /* ---------------------------- Views and the rail --------------------------- */

  const savedViews = useMemo<SavedView[]>(
    () => [
      { id: 'all', label: 'All Records', icon: 'ti ti-layout-list', count: rows.length },
      ...rails.map((rail) => ({ ...rail, count: rows.filter((record) => matchesRail(record, rail.id)).length })),
    ],
    [rows],
  );

  const quickFilters = useMemo<QuickFilter[]>(
    () =>
      [
        { id: 'all', label: 'All', icon: 'ti ti-layout-list' },
        ...rails,
        { id: 'late-pattern', label: 'Late Pattern', icon: 'ti ti-clock-exclamation' },
      ].map((rail) => ({
        ...rail,
        count: rows.filter((record) => matchesRail(record, rail.id === 'all' ? null : rail.id)).length,
      })),
    [rows],
  );

  /* ------------------------------ Summary strip ------------------------------ */

  /**
   * The strip describes the report, so it is computed from the rows the report
   * currently shows rather than from the register. Filter to Below 75% and
   * every tile follows. The register total stays in Band 1's badge, which is
   * where the template says what the report reads from.
   */
  const summary = useMemo<SummaryStripItem[]>(() => {
    const shown = workspace.visible;
    const sum = (read: (record: AttendanceRecord) => number) => shown.reduce((total, r) => total + read(r), 0);
    const working = sum(workingDaysOf);
    const effective = sum(effectivePresentOf);
    return [
      { id: 'total', accent: 'primary', icon: 'ti ti-database', value: `${shown.length}`, label: 'Total Records' },
      { id: 'present', accent: 'success', icon: 'ti ti-user-check', value: `${sum(presentOf)}`, label: 'Present' },
      { id: 'absent', accent: 'danger', icon: 'ti ti-user-x', value: `${sum((r) => r.absent)}`, label: 'Absent' },
      {
        id: 'late',
        accent: 'warning',
        icon: 'ti ti-clock-exclamation',
        value: `${sum((r) => r.lateMarks)}`,
        label: 'Late Arrivals',
      },
      { id: 'half', accent: 'slate', icon: 'ti ti-clock-half-2', value: `${sum((r) => r.halfDays)}`, label: 'Half Days' },
      { id: 'leave', accent: 'info', icon: 'ti ti-calendar-off', value: `${sum((r) => r.leave)}`, label: 'Leave' },
      {
        id: 'pct',
        accent: 'teal',
        icon: 'ti ti-percentage',
        value: working === 0 ? '—' : pctLabel(Math.round((effective / working) * 1000) / 10),
        label: 'Attendance %',
      },
      {
        id: 'low',
        accent: 'purple',
        icon: 'ti ti-alert-triangle',
        value: `${shown.filter(isLowAttendance).length}`,
        label: 'Low Attendance',
      },
    ];
  }, [workspace.visible]);

  /* -------------------------------- Mutations -------------------------------- */

  /** Closing an exception moves the pill, the strip and the analytics panel at once. */
  const closeException = useCallback((recordId: string, exception: string) => {
    setRows((current) =>
      current.map((record) =>
        record.id === recordId
          ? { ...record, exceptions: record.exceptions.filter((item) => item !== exception) }
          : record,
      ),
    );
  }, []);

  const bulkActions = useMemo<ReportBulkAction[]>(
    () => [
      { id: 'pdf', label: 'Bulk Export PDF', icon: 'ti ti-file-type-pdf', onClick: () => openModal(null, 'export') },
      { id: 'xls', label: 'Bulk Export Excel', icon: 'ti ti-file-type-xls', onClick: () => openModal(null, 'export') },
      { id: 'print', label: 'Print', icon: 'ti ti-printer', onClick: () => openModal(null, 'print') },
      { id: 'share', label: 'Share', icon: 'ti ti-share', onClick: () => openModal(null, 'share') },
      { id: 'compare', label: 'Compare', icon: 'ti ti-arrows-diff', onClick: () => openModal(null, 'compare') },
    ],
    [openModal],
  );

  /* --------------------------------- Detail ---------------------------------- */

  const renderDetail = (record: AttendanceRecord) => {
    const ledgerNote = ledgerNoteOf(record);
    const workingNote = workingDaysNoteOf(record);
    const threshold = lateThresholdOf(record);

    return (
      <div className="row g-4">
        <div className="col-xl-3 col-md-6">
          <h3 className="fs-14 mb-3 fw-medium">
            <i className="ti ti-timeline text-primary me-1" />
            Attendance Timeline
          </h3>
          {record.timeline.map((event) => {
            const tone = timelineTone(event.kind);
            return (
              <div className="d-flex align-items-center gap-2 border rounded p-2 mb-2" key={`${event.kind}-${event.date}`}>
                <span className={`avatar avatar-sm bg-${tone.tint}-transparent text-${tone.tint} rounded flex-shrink-0`}>
                  <i className={tone.icon} />
                </span>
                <div className="flex-fill overflow-hidden">
                  <h4 className="fs-13 mb-0 text-truncate fw-medium">{event.kind}</h4>
                  <span className="fs-12 text-muted text-truncate d-block">
                    {event.date} · {event.note}
                  </span>
                </div>
              </div>
            );
          })}
          <ActionLink className="fs-12 link-primary" onClick={() => openModal(record, 'history')}>
            View complete timeline
          </ActionLink>
        </div>

        <div className="col-xl-3 col-md-6">
          <h6 className="details-heading">
            <i className="ti ti-calendar-stats" />
            Monthly Attendance Summary
          </h6>
          <ul className="list-unstyled fs-12 mb-3">
            {record.months.map((month) => (
              <li className="d-flex align-items-center justify-content-between py-1" key={month.month}>
                <span className="text-muted">{month.month}</span>
                <span className="fw-medium">
                  {month.present} / {month.working} · {pctLabel(monthPctOf(month))}
                </span>
              </li>
            ))}
            <li className="d-flex align-items-center justify-content-between py-1 border-top mt-1 pt-2">
              <span className="text-muted">{ledgerNote.label}</span>
              <span className="fw-medium">
                {ledgerNote.value}
                {ledgerNote.hint ? <span className="text-muted ms-1">{ledgerNote.hint}</span> : null}
              </span>
            </li>
          </ul>

          <h6 className="details-heading">
            <i className="ti ti-chart-bar" />
            Weekly Attendance Pattern
          </h6>
          <ul className="list-unstyled fs-12 mb-0">
            {record.weekly.map((fact) => (
              <li className="d-flex align-items-center justify-content-between py-1" key={fact.label}>
                <span className="text-muted">{fact.label}</span>
                <span className="fw-medium">{fact.value}</span>
              </li>
            ))}
            <li className="d-flex align-items-center justify-content-between py-1">
              <span className="text-muted">{record.weeklyNote.label}</span>
              <span className="fw-medium">{record.weeklyNote.value}</span>
            </li>
          </ul>
        </div>

        <div className="col-xl-3 col-md-6">
          <h6 className="details-heading">
            <i className="ti ti-calendar-off" />
            Leave History
          </h6>
          {record.leaveHistory.map((entry) => (
            <div className="border rounded p-2 mb-2" key={entry.title}>
              <h6 className="fs-13 mb-0 fw-medium">{entry.title}</h6>
              <span className="fs-12 text-muted">{entry.detail}</span>
            </div>
          ))}
          <ul className="list-unstyled fs-12 mb-3">
            <li className="d-flex align-items-center justify-content-between py-1">
              <span className="text-muted">Leave Taken</span>
              <span className="fw-medium">
                {record.leave} {record.leave === 1 ? 'day' : 'days'}
              </span>
            </li>
            {record.type === 'Student' ? (
              <li className="d-flex align-items-center justify-content-between py-1">
                <span className="text-muted">Leave Balance</span>
                <span className="fw-medium">{leaveBalanceOf(record)} of 12 days</span>
              </li>
            ) : null}
            {record.leaveFacts.map((fact) => (
              <li className="d-flex align-items-center justify-content-between py-1" key={fact.label}>
                <span className="text-muted">{fact.label}</span>
                <span className="fw-medium">{fact.value}</span>
              </li>
            ))}
          </ul>

          <h6 className="details-heading">
            <i className="ti ti-clock-exclamation" />
            Late Arrival History
          </h6>
          <div className="border rounded p-2 mb-2">
            <h6 className="fs-13 mb-0 fw-medium">{record.lateLatest.title}</h6>
            <span className="fs-12 text-muted">{record.lateLatest.detail}</span>
          </div>
          <ul className="list-unstyled fs-12 mb-0">
            <li className="d-flex align-items-center justify-content-between py-1">
              <span className="text-muted">Total Late Marks</span>
              <span className="fw-medium">{record.lateMarks}</span>
            </li>
            <li className="d-flex align-items-center justify-content-between py-1">
              <span className="text-muted">Average Delay</span>
              <span className="fw-medium">{averageDelayLabel(record)}</span>
            </li>
            {threshold ? (
              <li className="d-flex align-items-center justify-content-between py-1">
                <span className="text-muted">{threshold.label}</span>
                <span className="fw-medium">
                  {threshold.value}
                  {threshold.hint ? <span className="text-muted ms-1">· {threshold.hint}</span> : null}
                </span>
              </li>
            ) : null}
            {record.lateFacts.map((fact) => (
              <li className="d-flex align-items-center justify-content-between py-1" key={fact.label}>
                <span className="text-muted">{fact.label}</span>
                <span className="fw-medium">{fact.value}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="col-xl-3 col-md-6">
          <h6 className="details-heading">
            <i className="ti ti-calendar-check" />
            Working Days Analysis
          </h6>
          <ul className="list-unstyled fs-12 mb-3">
            <li className="d-flex align-items-center justify-content-between py-1">
              <span className="text-muted">Working Days</span>
              <span className="fw-medium">{workingDaysOf(record)}</span>
            </li>
            <li className="d-flex align-items-center justify-content-between py-1">
              <span className="text-muted">Days Marked</span>
              <span className="fw-medium">
                {daysMarkedOf(record)} of {workingDaysOf(record)}
              </span>
            </li>
            <li className="d-flex align-items-center justify-content-between py-1">
              <span className="text-muted">{workingNote.label}</span>
              <span className="fw-medium">
                {workingNote.value}
                {workingNote.hint ? <span className="text-muted ms-1">{workingNote.hint}</span> : null}
              </span>
            </li>
            <li className="d-flex align-items-center justify-content-between py-1">
              <span className="text-muted">Effective Present</span>
              <span className="fw-medium">
                {effectivePresentOf(record)} of {workingDaysOf(record)}
              </span>
            </li>
          </ul>

          <h6 className="details-heading">
            <i className="ti ti-alert-triangle" />
            Attendance Exceptions
          </h6>
          {record.exceptions.length > 0 ? (
            <div className="d-flex flex-wrap gap-1 mb-2">
              {record.exceptions.map((exception) => (
                <span className="badge badge-soft-danger" key={exception}>
                  {exception}
                </span>
              ))}
            </div>
          ) : (
            <span className="badge badge-soft-success mb-2">No open exceptions</span>
          )}
          <div className="border rounded p-2 mb-2">
            <h6 className="fs-13 mb-0 fw-medium">{record.exceptionsNote.title}</h6>
            <span className="fs-12 text-muted">{record.exceptionsNote.detail}</span>
          </div>

          <h6 className="details-heading">
            <i className="ti ti-message-2" />
            Teacher / HR Remarks
          </h6>
          {record.remarks.map((remark) => (
            <div className="border rounded p-2 mb-2" key={`${remark.author}-${remark.date}`}>
              <h6 className="fs-13 mb-0 fw-medium">{remark.author}</h6>
              <span className="fs-12 text-muted d-block">
                {remark.role} · {remark.date}
              </span>
              <p className="fs-12 text-muted mb-0 mt-1">{remark.body}</p>
            </div>
          ))}

          <div className="d-flex gap-2 mt-3">
            <button
              type="button"
              className="btn btn-outline-light bg-white btn-sm flex-fill"
              onClick={() => openModal(record, 'history')}
            >
              <i className="ti ti-history me-1" />
              Complete History
            </button>
            <button type="button" className="btn btn-primary btn-sm flex-fill" onClick={() => setAnalyticsOpen(true)}>
              <i className="ti ti-chart-histogram me-1" />
              Analytics
            </button>
          </div>
        </div>
      </div>
    );
  };

  const rowActions = (record: AttendanceRecord) => (
    <div className="dt-actions">
      <ActionLink className="dt-ib" title="View complete history" ariaLabel="View complete history" onClick={() => openModal(record, 'history')}>
        <i className="ti ti-eye" />
      </ActionLink>
      <ActionLink className="dt-ib" title="Compare" ariaLabel="Compare" onClick={() => openModal(record, 'compare')}>
        <i className="ti ti-arrows-diff" />
      </ActionLink>
      <ActionLink className="dt-ib" title="Export" ariaLabel="Export" onClick={() => openModal(record, 'export')}>
        <i className="ti ti-download" />
      </ActionLink>
      <ActionLink className="dt-ib" title="Print" ariaLabel="Print" onClick={() => openModal(record, 'print')}>
        <i className="ti ti-printer" />
      </ActionLink>
      <ActionLink className="dt-ib" title="Share" ariaLabel="Share" onClick={() => openModal(record, 'share')}>
        <i className="ti ti-share" />
      </ActionLink>
    </div>
  );

  /** The line beside the chevron while Band 2 is collapsed. */
  const filterSummary = [
    workspace.filters['date-range'] || REPORT_RANGE,
    workspace.filters['working-days'] || 'Term 1 · 96 days',
    workspace.filters.shift || 'all shifts',
    workspace.filters.class || 'all classes',
  ].join(' · ');

  return (
    <>
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content">
          <ReportPageHeader
            title="Attendance Reports"
            section="Reports"
            dashboardTo={routes.adminDashboard}
            actions={
              <>
                <div className="me-2 mb-2">
                  <ActionLink
                    className="btn btn-outline-light bg-white fw-medium d-inline-flex align-items-center"
                    onClick={() => openModal(null, 'schedule')}
                  >
                    <i className="ti ti-calendar-time me-2" />
                    Schedule Reports
                  </ActionLink>
                </div>
                <div className="me-2 mb-2">
                  <ActionLink
                    className="btn btn-outline-light bg-white fw-medium d-inline-flex align-items-center"
                    onClick={() => openModal(null, 'compare')}
                  >
                    <i className="ti ti-arrows-diff me-2" />
                    Compare Reports
                  </ActionLink>
                </div>
                <div className="mb-2">
                  <ActionLink
                    className="btn btn-outline-light bg-white fw-medium d-inline-flex align-items-center"
                    onClick={() => setAnalyticsOpen(true)}
                  >
                    <i className="ti ti-chart-histogram me-2" />
                    Analytics
                  </ActionLink>
                </div>
              </>
            }
          />

          <ReportWorkspaceShell
            workspace={workspace}
            columns={columns}
            getId={(record) => record.id}
            totalCount={rows.length}
            workspaceId="attendanceReport"
            scopeLabel="Report on:"
            scopeAriaLabel="Report type"
            scopes={scopes}
            scope={scope}
            onScope={setScope}
            scopeCount={`${REGISTER_TOTAL.toLocaleString()} records`}
            bandActions={
              <>
                <ActionLink
                  className="btn btn-sm btn-primary d-inline-flex align-items-center"
                  onClick={() => openModal(null, 'generate')}
                >
                  <i className="ti ti-player-play me-1" />
                  Generate Report
                </ActionLink>
                <ActionLink
                  className="btn btn-sm btn-outline-light bg-white d-inline-flex align-items-center"
                  onClick={() => openModal(null, 'template')}
                >
                  <i className="ti ti-bookmark-plus me-1" />
                  Save Template
                </ActionLink>
                <ActionLink className="btn btn-sm btn-outline-light bg-white btn-icon" title="Export PDF" ariaLabel="Export PDF" onClick={() => openModal(null, 'export')}>
                  <i className="ti ti-file-type-pdf" />
                </ActionLink>
                <ActionLink className="btn btn-sm btn-outline-light bg-white btn-icon" title="Export Excel" ariaLabel="Export Excel" onClick={() => openModal(null, 'export')}>
                  <i className="ti ti-file-type-xls" />
                </ActionLink>
                <ActionLink className="btn btn-sm btn-outline-light bg-white btn-icon" title="Print" ariaLabel="Print" onClick={() => openModal(null, 'print')}>
                  <i className="ti ti-printer" />
                </ActionLink>
                <ActionLink className="btn btn-sm btn-outline-light bg-white btn-icon" title="Share" ariaLabel="Share" onClick={() => openModal(null, 'share')}>
                  <i className="ti ti-share" />
                </ActionLink>
              </>
            }
            searchLabel="Search records"
            searchPlaceholder="Name, admission no. or employee ID"
            filterSummary={filterSummary}
            filterFields={filterFields}
            savedViews={savedViews}
            quickFilters={quickFilters}
            sortOptions={sortOptions}
            noun="records"
            openMenu={openMenu}
            onOpenMenu={setOpenMenu}
            summary={summary}
            bulkActions={bulkActions}
            selectionNoun="record"
            caption="Attendance report for students, teachers and staff with working days, present, absent, late, leave, half day and attendance percentage"
            selectAllLabel="Select all records"
            renderDetail={renderDetail}
            renderActions={rowActions}
            footerInfoSuffix={`${REPORT_RANGE.replace(' - ', ' – ')} · ${
              rows.length > 0 ? workingDaysOf(rows[0]) : 96
            } working days`}
            emptyIcon="ti ti-calendar-off"
            emptyTitle="No records match this report"
            emptyBody="Widen the date range, clear a filter or switch the report scope to see more records."
            onRefresh={() => {
              setRows(seededRecords);
              push('Report refreshed');
            }}
            onSaveView={() => openModal(null, 'template')}
            onToast={push}
            onResetExtra={() => setScope('all')}
          />
        </div>
      </div>
      {/* /Page Wrapper */}

      <AttendanceModals
        active={activeModal}
        onClose={() => setActiveModal(null)}
        row={modalRow}
        rows={workspace.visible}
        selected={rows.filter((record) => workspace.selected.includes(record.id))}
        registerTotal={REGISTER_TOTAL}
        analyticsOpen={analyticsOpen}
        onCloseAnalytics={() => setAnalyticsOpen(false)}
        onToast={push}
        onCloseException={closeException}
      />

      <ToastStack toasts={toasts} onDismiss={dismiss} id="attendanceReportToasts" />
    </>
  );
};

/**
 * The six narrowings the saved views and the quick rail share.
 *
 * The template writes them twice with different counts; sharing one predicate
 * means the two rails can never disagree, and both follow the roster.
 */
const rails = [
  { id: 'Student', label: 'Students', icon: 'ti ti-users' },
  { id: 'Teacher', label: 'Teachers', icon: 'ti ti-chalkboard' },
  { id: 'Staff', label: 'Staff', icon: 'ti ti-briefcase' },
  { id: 'below-75', label: 'Below 75%', icon: 'ti ti-alert-triangle' },
  { id: 'perfect', label: 'Perfect', icon: 'ti ti-medal' },
];

function matchesRail(record: AttendanceRecord, rail: string | null): boolean {
  if (!rail) return true;
  switch (rail) {
    case 'Student':
    case 'Teacher':
    case 'Staff':
      return record.type === rail;
    case 'below-75':
      return attendancePctOf(record) < 75;
    case 'perfect':
      return attendancePctOf(record) >= 100;
    case 'late-pattern':
      return record.lateMarks >= 5;
    default:
      return true;
  }
}

export default AttendanceReports;
