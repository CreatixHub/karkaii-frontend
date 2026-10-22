/**
 * The seven dialogs in `staff-attendance.html` (L2140–2256).
 *
 * `details` and `shift` ship in the template with no trigger at all — nothing
 * carries `data-bs-target="#attendance_details"` or `#shift_details`. Both are
 * reachable here: `details` from the staff-name click, `shift` from the Shift
 * badge, which is how the equivalent orphan opened in the teacher port.
 */
export type StaffAttendanceModalId =
  | 'mark'
  | 'edit'
  | 'details'
  | 'correction'
  | 'shift'
  | 'history'
  | 'delete';

/* -------------------------------- Toolbar --------------------------------- */

export type FilterKind = 'date' | 'daterange' | 'select';

export interface FilterField {
  /** Matches the template's `id`, which is also the state key. */
  id: string;
  label: string;
  kind: FilterKind;
  /** Placeholder for the two plugin inputs. */
  placeholder?: string;
  options?: string[];
}

/** The nine fields of the template's filter panel, L1489–1497. */
export const filterFields: FilterField[] = [
  { id: 'attendance-date', label: 'Attendance Date', kind: 'date', placeholder: '26 Jul 2026' },
  { id: 'date-range', label: 'Date Range', kind: 'daterange', placeholder: '01 - 26 Jul' },
  { id: 'department', label: 'Department', kind: 'select', options: ['Science', 'Mathematics', 'Languages'] },
  { id: 'designation', label: 'Designation', kind: 'select', options: ['Senior Teacher', 'Accountant', 'Librarian'] },
  { id: 'staff-type', label: 'Staff Type', kind: 'select', options: ['Teaching', 'Administrative', 'Support'] },
  { id: 'campus', label: 'Campus', kind: 'select', options: ['Main Campus', 'North Campus'] },
  { id: 'shift', label: 'Shift', kind: 'select', options: ['Morning', 'General', 'Evening'] },
  {
    id: 'attendance-status',
    label: 'Attendance Status',
    kind: 'select',
    options: ['Present', 'Absent', 'Late', 'On Leave'],
  },
  {
    id: 'check-in-status',
    label: 'Check-in Status',
    kind: 'select',
    options: ['Checked In', 'Not Checked In', 'Checked Out'],
  },
];

/** Short labels for the quick-filter chip rail. */
export const filterChipLabels: Record<string, string> = {
  'attendance-date': 'Date',
  'date-range': 'Range',
  department: 'Dept',
  designation: 'Designation',
  'staff-type': 'Type',
  campus: 'Campus',
  shift: 'Shift',
  'attendance-status': 'Status',
  'check-in-status': 'Check-in',
};

/** Chip tint per facet, matching the template's three sample chips (L1565–1567). */
export const filterChipTone: Record<string, string> = {
  'attendance-date': 'primary',
  'date-range': 'primary',
  department: 'info',
  designation: 'info',
  'staff-type': 'info',
  campus: 'info',
  shift: 'info',
  'attendance-status': 'success',
  'check-in-status': 'success',
};

export type SortKey = 'staff' | 'checkin' | 'hours';

export const sortOptions: { id: SortKey; label: string; icon: string }[] = [
  { id: 'staff', label: 'Staff (A–Z)', icon: 'ti ti-abc' },
  { id: 'checkin', label: 'Check-In Time', icon: 'ti ti-login-2' },
  { id: 'hours', label: 'Working Hours', icon: 'ti ti-clock' },
];

export type SavedViewId = 'all' | 'absentees' | 'late';

export const savedViews: { id: SavedViewId; label: string; icon: string }[] = [
  { id: 'all', label: 'All Staff', icon: 'ti ti-list' },
  { id: 'absentees', label: 'Absentees', icon: 'ti ti-user-x' },
  { id: 'late', label: 'Late Arrivals', icon: 'ti ti-clock-exclamation' },
];

export type BulkActionId = 'present' | 'absent' | 'approve' | 'export' | 'print' | 'report';

/** Template order, L1526–1531 — Print sits above Generate Report here. */
export const bulkActions: { id: BulkActionId; label: string; icon: string }[] = [
  { id: 'present', label: 'Mark Present', icon: 'ti ti-user-check' },
  { id: 'absent', label: 'Mark Absent', icon: 'ti ti-user-x' },
  { id: 'approve', label: 'Approve Attendance', icon: 'ti ti-circle-check' },
  { id: 'export', label: 'Export Selected', icon: 'ti ti-file-export' },
  { id: 'print', label: 'Print', icon: 'ti ti-printer' },
  { id: 'report', label: 'Generate Report', icon: 'ti ti-report' },
];

/** The eight columns the Columns menu can hide, in template order (L1538–1545). */
export type ColumnId =
  | 'department'
  | 'designation'
  | 'shift'
  | 'break'
  | 'overtime'
  | 'method'
  | 'recordedBy'
  | 'lastUpdated';

export const toggleableColumns: { id: ColumnId; label: string }[] = [
  { id: 'department', label: 'Department' },
  { id: 'designation', label: 'Designation' },
  { id: 'shift', label: 'Shift' },
  { id: 'break', label: 'Break' },
  { id: 'overtime', label: 'Overtime' },
  { id: 'method', label: 'Method' },
  { id: 'recordedBy', label: 'Recorded By' },
  { id: 'lastUpdated', label: 'Last Updated' },
];

/* ------------------------------ Summary bar -------------------------------- */

export interface SummaryTile {
  id: string;
  tint: string;
  icon: string;
  label: string;
  /** School-wide figure printed by the template; the grid ships a sample page. */
  value: string;
}

export const summaryTiles: SummaryTile[] = [
  {
    id: 'date',
    tint: 'bg-primary-transparent text-primary',
    icon: 'ti ti-calendar-event',
    label: 'Attendance Date',
    value: '26 Jul 2026',
  },
  {
    id: 'total',
    tint: 'bg-secondary-transparent text-secondary',
    icon: 'ti ti-users',
    label: 'Total Staff',
    value: '128',
  },
  {
    id: 'present',
    tint: 'bg-success-transparent text-success',
    icon: 'ti ti-user-check',
    label: 'Present',
    value: '98',
  },
  {
    id: 'absent',
    tint: 'bg-danger-transparent text-danger',
    icon: 'ti ti-user-x',
    label: 'Absent',
    value: '12',
  },
  {
    id: 'late',
    tint: 'bg-warning-transparent text-warning',
    icon: 'ti ti-clock-exclamation',
    label: 'Late Arrival',
    value: '8',
  },
];

export const DEFAULT_ATTENDANCE_DATE = '26 Jul 2026';

/** The header badge beside History / Mark Attendance. */
export const PRESENT_BADGE = '98 Present';

/** The template's footer total, which the sample page of eight sits inside. */
export const TOTAL_STAFF = 128;

/* ------------------------------- Inspector --------------------------------- */

export const inspectorWeek = [
  { day: 'Mon', className: 'badge badge-soft-success' },
  { day: 'Tue', className: 'badge badge-soft-success' },
  { day: 'Wed', className: 'badge badge-soft-warning' },
  { day: 'Thu', className: 'badge badge-soft-success' },
  { day: 'Fri', className: 'badge badge-soft-success' },
  { day: 'Sat', className: 'badge badge-soft-secondary' },
  { day: 'Sun', className: 'badge badge-soft-light text-muted' },
];

export const inspectorHistory = [
  { when: '25 Jul · 07:58 – 15:31', badge: { label: 'Present', className: 'badge badge-soft-success' } },
  { when: '24 Jul · 08:20 – 15:30', badge: { label: 'Late', className: 'badge badge-soft-warning' } },
  { when: '23 Jul · —', badge: { label: 'Leave', className: 'badge badge-soft-info' } },
];

/** Shift window printed in the inspector's "Assigned Shift" row, per shift. */
export const shiftWindow: Record<string, string> = {
  Morning: 'Morning · 08:00–15:30',
  General: 'General · 09:00–17:00',
  Evening: 'Evening · 13:00–20:00',
};

/* --------------------------------- Modals ---------------------------------- */

export const attendanceStatusOptions = ['Present', 'Absent', 'Late', 'On Leave', 'Half Day'];
export const attendanceMethodOptions = ['Manual', 'Biometric', 'RFID'];
export const shiftOptions = ['Morning', 'General', 'Evening'];
export const staffOptions = ['Grace Lee (EMP-1001)', 'Hassan Ali (EMP-1002)', 'Olivia Park (EMP-1003)'];

/** The Attendance Correction dialog's read-only "Original" column (L2202). */
export const correctionOriginal = [
  { label: 'Check-In', value: '08:25 AM' },
  { label: 'Check-Out', value: '03:35 PM' },
  { label: 'Status', value: 'Late' },
];

export const correctionReason = 'Biometric sync delay — verified with gate log.';

/** The Shift Details dialog, L2217 — one shift, described in full. */
export const shiftDetails = {
  name: 'Morning Shift',
  window: '08:00 AM – 03:30 PM',
  left: [
    { label: 'Start Time', value: '08:00 AM' },
    { label: 'End Time', value: '03:30 PM' },
    { label: 'Grace Period', value: '10 min' },
  ],
  right: [
    { label: 'Break', value: '45 min' },
    { label: 'Working Days', value: 'Mon – Sat' },
    { label: 'Assigned Staff', value: '86' },
  ],
};

export const historyTiles = [
  { value: '21', label: 'Present', className: 'text-success' },
  { value: '1', label: 'Absent', className: 'text-danger' },
  { value: '2', label: 'Late', className: 'text-warning' },
  { value: '92%', label: 'Rate', className: 'text-primary' },
];

export interface HistoryRow {
  date: string;
  checkIn: string;
  checkOut: string;
  hours: string;
  badge: { label: string; className: string };
}

export const historyRows: HistoryRow[] = [
  { date: '26 Jul', checkIn: '08:02', checkOut: '03:32', hours: '7h 30m', badge: { label: 'Present', className: 'badge badge-soft-success' } },
  { date: '25 Jul', checkIn: '07:58', checkOut: '03:31', hours: '7h 33m', badge: { label: 'Present', className: 'badge badge-soft-success' } },
  { date: '24 Jul', checkIn: '08:20', checkOut: '03:30', hours: '7h 10m', badge: { label: 'Late', className: 'badge badge-soft-warning' } },
  { date: '23 Jul', checkIn: '—', checkOut: '—', hours: '0h', badge: { label: 'Leave', className: 'badge badge-soft-info' } },
  { date: '22 Jul', checkIn: '08:01', checkOut: '03:33', hours: '7h 32m', badge: { label: 'Present', className: 'badge badge-soft-success' } },
];
