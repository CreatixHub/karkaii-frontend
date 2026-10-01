/** The seven dialogs in `teacher-attendance.html`. */
export type AttendanceModalId =
  | 'mark'
  | 'edit'
  | 'details'
  | 'correction'
  | 'timetable'
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

export const filterFields: FilterField[] = [
  { id: 'attendance-date', label: 'Attendance Date', kind: 'date', placeholder: '26 Jul 2026' },
  { id: 'date-range', label: 'Date Range', kind: 'daterange', placeholder: '01 - 26 Jul' },
  { id: 'department', label: 'Department', kind: 'select', options: ['Science', 'Mathematics', 'Languages'] },
  { id: 'subject', label: 'Subject', kind: 'select', options: ['Physics', 'Algebra', 'English Lit.'] },
  { id: 'class-teacher', label: 'Class Teacher', kind: 'select', options: ['Grade 10-A', 'Grade 11-B'] },
  { id: 'designation', label: 'Designation', kind: 'select', options: ['Senior Teacher', 'Assistant Teacher'] },
  { id: 'campus', label: 'Campus', kind: 'select', options: ['Main Campus', 'North Campus'] },
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
  subject: 'Subject',
  'class-teacher': 'Class',
  designation: 'Designation',
  campus: 'Campus',
  'attendance-status': 'Status',
  'check-in-status': 'Check-in',
};

/** Chip tint per facet, matching the template's three sample chips. */
export const filterChipTone: Record<string, string> = {
  'attendance-date': 'primary',
  'date-range': 'primary',
  department: 'info',
  subject: 'info',
  'class-teacher': 'info',
  designation: 'info',
  campus: 'info',
  'attendance-status': 'success',
  'check-in-status': 'success',
};

export type SortKey = 'teacher' | 'checkin' | 'hours';

export const sortOptions: { id: SortKey; label: string; icon: string }[] = [
  { id: 'teacher', label: 'Teacher (A–Z)', icon: 'ti ti-abc' },
  { id: 'checkin', label: 'Check-In Time', icon: 'ti ti-login-2' },
  { id: 'hours', label: 'Working Hours', icon: 'ti ti-clock' },
];

export type SavedViewId = 'all' | 'absentees' | 'late';

export const savedViews: { id: SavedViewId; label: string; icon: string }[] = [
  { id: 'all', label: 'All Teachers', icon: 'ti ti-list' },
  { id: 'absentees', label: 'Absentees', icon: 'ti ti-user-x' },
  { id: 'late', label: 'Late Arrivals', icon: 'ti ti-clock-exclamation' },
];

export type BulkActionId = 'present' | 'absent' | 'approve' | 'export' | 'report' | 'print';

export const bulkActions: { id: BulkActionId; label: string; icon: string }[] = [
  { id: 'present', label: 'Mark Present', icon: 'ti ti-user-check' },
  { id: 'absent', label: 'Mark Absent', icon: 'ti ti-user-x' },
  { id: 'approve', label: 'Approve Attendance', icon: 'ti ti-circle-check' },
  { id: 'export', label: 'Export Selected', icon: 'ti ti-file-export' },
  { id: 'report', label: 'Generate Attendance Report', icon: 'ti ti-report' },
  { id: 'print', label: 'Print', icon: 'ti ti-printer' },
];

/** The eight columns the Columns menu can hide, in template order. */
export type ColumnId =
  | 'department'
  | 'subjects'
  | 'classes'
  | 'break'
  | 'overtime'
  | 'method'
  | 'recordedBy'
  | 'lastUpdated';

export const toggleableColumns: { id: ColumnId; label: string }[] = [
  { id: 'department', label: 'Department' },
  { id: 'subjects', label: 'Subjects' },
  { id: 'classes', label: 'Assigned Classes' },
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
    label: 'Total Teachers',
    value: '86',
  },
  {
    id: 'present',
    tint: 'bg-success-transparent text-success',
    icon: 'ti ti-user-check',
    label: 'Present',
    value: '68',
  },
  {
    id: 'absent',
    tint: 'bg-danger-transparent text-danger',
    icon: 'ti ti-user-x',
    label: 'Absent',
    value: '7',
  },
  {
    id: 'late',
    tint: 'bg-warning-transparent text-warning',
    icon: 'ti ti-clock-exclamation',
    label: 'Late Arrival',
    value: '5',
  },
];

export const DEFAULT_ATTENDANCE_DATE = '26 Jul 2026';

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

/* --------------------------------- Modals ---------------------------------- */

export const attendanceStatusOptions = ['Present', 'Absent', 'Late', 'On Leave', 'Half Day'];
export const attendanceMethodOptions = ['Manual', 'Biometric', 'RFID'];
export const teacherOptions = ['Grace Lee (EMP-T01)', 'Hassan Ali (EMP-T02)', 'Olivia Park (EMP-T03)'];

export interface TimetableSlot {
  period: string;
  time: string;
  className: string;
  subject: string;
  badge: { label: string; className: string };
}

export const assignedTimetable: TimetableSlot[] = [
  { period: 'P1', time: '08:00', className: 'Grade 10-A', subject: 'Algebra', badge: { label: 'Held', className: 'badge badge-soft-success' } },
  { period: 'P2', time: '08:45', className: '—', subject: 'Free Period', badge: { label: 'Free', className: 'badge badge-soft-secondary' } },
  { period: 'P3', time: '09:30', className: 'Grade 11-B', subject: 'Calculus', badge: { label: 'Held', className: 'badge badge-soft-success' } },
  { period: 'P4', time: '10:15', className: '—', subject: 'Free Period', badge: { label: 'Free', className: 'badge badge-soft-secondary' } },
  { period: 'P5', time: '11:00', className: 'Grade 10-A', subject: 'Geometry', badge: { label: 'Held', className: 'badge badge-soft-success' } },
  { period: 'P6', time: '11:45', className: 'Grade 11-B', subject: 'Statistics', badge: { label: 'Held', className: 'badge badge-soft-success' } },
];

export const historyTiles = [
  { value: '21', label: 'Present', className: 'text-success' },
  { value: '1', label: 'Absent', className: 'text-danger' },
  { value: '2', label: 'Late', className: 'text-warning' },
  { value: '93%', label: 'Rate', className: 'text-primary' },
];

export interface HistoryRow {
  date: string;
  checkIn: string;
  checkOut: string;
  hours: string;
  classes: string;
  badge: { label: string; className: string };
}

export const historyRows: HistoryRow[] = [
  { date: '26 Jul', checkIn: '08:02', checkOut: '03:32', hours: '7h 30m', classes: '4', badge: { label: 'Present', className: 'badge badge-soft-success' } },
  { date: '25 Jul', checkIn: '07:58', checkOut: '03:31', hours: '7h 33m', classes: '5', badge: { label: 'Present', className: 'badge badge-soft-success' } },
  { date: '24 Jul', checkIn: '08:20', checkOut: '03:30', hours: '7h 10m', classes: '4', badge: { label: 'Late', className: 'badge badge-soft-warning' } },
  { date: '23 Jul', checkIn: '—', checkOut: '—', hours: '0h', classes: '0', badge: { label: 'Leave', className: 'badge badge-soft-info' } },
  { date: '22 Jul', checkIn: '08:01', checkOut: '03:33', hours: '7h 32m', classes: '5', badge: { label: 'Present', className: 'badge badge-soft-success' } },
];

/** The Attendance Correction dialog's read-only "Original" column. */
export const correctionOriginal = [
  { label: 'Check-In', value: '08:25 AM' },
  { label: 'Check-Out', value: '03:35 PM' },
  { label: 'Status', value: 'Late' },
];

export const correctionReason = 'Biometric sync delay — verified with staff-room gate log.';
