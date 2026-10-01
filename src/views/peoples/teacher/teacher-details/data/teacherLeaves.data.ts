/* -------------------------------- Stat cards ------------------------------- */

export interface LeaveStatCard {
  id: string;
  /** `stats-primary` | `stats-success` | `stats-warning` | `stats-info`. */
  variant: string;
  /** The three letters stacked in `.stats-avatars`. */
  avatars: string[];
  icon: string;
  value: string;
  label: string;
  /** The template's inline `style="width:NN%"` on `.stats-bar i`. */
  barWidth: string;
}

export const statCards: LeaveStatCard[] = [
  {
    id: 'requests',
    variant: 'stats-primary',
    avatars: ['A', 'B', 'C'],
    icon: 'ti ti-calendar-stats',
    value: '32',
    label: 'Total Leave Requests',
    barWidth: '64%',
  },
  {
    id: 'approved',
    variant: 'stats-success',
    avatars: ['A', 'B', 'C'],
    icon: 'ti ti-user-check',
    value: '22',
    label: 'Approved',
    barWidth: '69%',
  },
  {
    id: 'pending',
    variant: 'stats-warning',
    avatars: ['A', 'B', 'C'],
    icon: 'ti ti-clock-hour-4',
    value: '7',
    label: 'Pending',
    barWidth: '22%',
  },
  {
    id: 'rejected',
    variant: 'stats-info',
    avatars: ['A', 'B', 'C'],
    icon: 'ti ti-x',
    value: '3',
    label: 'Rejected',
    barWidth: '9%',
  },
];

/* ------------------------------ Leave balances ----------------------------- */

export interface LeaveBalance {
  id: string;
  /** Matches the "Leave Type" column and the Apply Leave dialog's options. */
  type: string;
  allocated: number;
  used: number;
}

/**
 * The template prints "Medical Leave (10)" / "Used : 5" / "Available : 5" — the
 * available figure is always `allocated - used`, so it is derived here.
 */
export const leaveBalances: LeaveBalance[] = [
  { id: 'medical', type: 'Medical Leave', allocated: 10, used: 5 },
  { id: 'casual', type: 'Casual Leave', allocated: 12, used: 1 },
  { id: 'maternity', type: 'Maternity Leave', allocated: 10, used: 0 },
  { id: 'paternity', type: 'Paternity Leave', allocated: 0, used: 0 },
];

/* -------------------------------- Leaves list ------------------------------ */

export type LeaveStatus = 'Approved' | 'Pending' | 'Rejected';

export interface LeaveRow {
  id: string;
  type: string;
  dateRange: string;
  days: string;
  appliedOn: string;
  status: LeaveStatus;
}

/** `badge-soft-*` modifier per status, as used in the template's table. */
export const leaveStatusClass: Record<LeaveStatus, string> = {
  Approved: 'badge-soft-success',
  Pending: 'badge-soft-pending',
  Rejected: 'badge-soft-danger',
};

export const leaveRows: LeaveRow[] = [
  {
    id: 'lv-1',
    type: 'Medical Leave',
    dateRange: '05 May 2024 - 09 may 2024',
    days: '5',
    appliedOn: '05 May 2024 ',
    status: 'Approved',
  },
  {
    id: 'lv-2',
    type: 'Casual Leave',
    dateRange: '07 May 2024 - 07 may 2024',
    days: '1',
    appliedOn: '07 May 2024 ',
    status: 'Approved',
  },
  {
    id: 'lv-3',
    type: 'Special Leave',
    dateRange: '09 May 2024 - 09 may 2024',
    days: '1',
    appliedOn: '09 May 2024 ',
    status: 'Pending',
  },
  {
    id: 'lv-4',
    type: 'Casual Leave',
    dateRange: '08 May 2024 - 08 may 2024',
    days: '1',
    appliedOn: '04 May 2024 ',
    status: 'Approved',
  },
  {
    id: 'lv-5',
    type: 'Medical Leave',
    dateRange: '08 May 2024 - 11 may 2024',
    days: '4',
    appliedOn: '08 May 2024 ',
    status: 'Pending',
  },
  {
    id: 'lv-6',
    type: 'Casual Leave',
    dateRange: '20 May 2024 - 20 may 2024',
    days: '1',
    appliedOn: '19 May 2024 ',
    status: 'Pending',
  },
];

/** The Apply Leave dialog's `#leave-type` options. */
export const leaveTypeOptions = [
  'Medical Leave',
  'Casual Leave',
  'Special Leave',
  'Maternity Leave',
];

/** The dialog's "Leave Days" radio group. */
export const leaveDayOptions = ['Full day', 'First Half', 'Second Half'];

/* --------------------------- Attendance summary ---------------------------- */

export interface AttendanceTile {
  id: string;
  label: string;
  value: string;
  /** `bg-*-transparent` tint on the avatar. */
  tint: string;
  /** `text-*` colour on the avatar. */
  text: string;
  icon: string;
}

export const attendanceTiles: AttendanceTile[] = [
  {
    id: 'present',
    label: 'Total Present',
    value: '265',
    tint: 'bg-primary-transparent',
    text: 'text-primary',
    icon: 'ti ti-user-check',
  },
  {
    id: 'absent',
    label: 'Total Absent',
    value: '05',
    tint: 'bg-danger-transparent',
    text: 'text-danger',
    icon: 'ti ti-user-x',
  },
  {
    id: 'halfday',
    label: 'Half Day',
    value: '01',
    tint: 'bg-info-transparent',
    text: 'text-info',
    icon: 'ti ti-calendar-event',
  },
  {
    id: 'late',
    label: 'Late',
    value: '12',
    tint: 'bg-warning-transparent',
    text: 'text-warning',
    icon: 'ti ti-clock-x',
  },
];

/** The five chips above the attendance matrix. */
export const attendanceLegend = [
  { id: 'present', label: 'Present', tint: 'bg-success', icon: 'ti ti-checks' },
  { id: 'absent', label: 'Absent', tint: 'bg-danger', icon: 'ti ti-x' },
  { id: 'late', label: 'Late', tint: 'bg-pending', icon: 'ti ti-clock-x' },
  { id: 'halfday', label: 'Halfday', tint: 'bg-dark', icon: 'ti ti-calendar-event' },
  { id: 'holiday', label: 'Holiday', tint: 'bg-info', icon: 'ti ti-calendar-event' },
];

/* --------------------------- Attendance matrix ----------------------------- */

/**
 * A cell in the day × month matrix. `null` is the template's empty
 * `<span></span>` — a month that has not been recorded yet.
 */
export type AttendanceMark = 'success' | 'danger' | 'pending' | 'dark' | 'info' | null;

export interface AttendanceRow {
  day: string;
  /** One entry per month in `attendanceMonths`. */
  marks: AttendanceMark[];
  /** The template renders bare `<td></td>` cells for weekend/holiday rows. */
  blank?: boolean;
}

export const attendanceMonths = [
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
  'Jan',
  'Feb',
  'Mar',
  'Apr',
];

/** Which legend entry a mark belongs to — used by the matrix sort. */
export const markLabel: Record<Exclude<AttendanceMark, null>, string> = {
  success: 'Present',
  danger: 'Absent',
  pending: 'Late',
  dark: 'Halfday',
  info: 'Holiday',
};

const S: AttendanceMark = 'success';
const D: AttendanceMark = 'danger';
const P: AttendanceMark = 'pending';
const H: AttendanceMark = 'dark';

const blankRow = (day: string): AttendanceRow => ({
  day,
  marks: attendanceMonths.map(() => null),
  blank: true,
});

export const attendanceRows: AttendanceRow[] = [
  { day: '01', marks: [S, S, S, S, S, S, S, S, S, null, null] },
  { day: '02', marks: [S, S, S, S, S, S, S, S, S, null, null] },
  { day: '03', marks: [S, D, S, S, S, S, S, S, D, null, null] },
  { day: '04', marks: [S, S, S, S, S, S, S, S, S, null, null] },
  blankRow('05'),
  blankRow('06'),
  { day: '07', marks: [S, S, S, S, S, S, S, S, S, null, null] },
  { day: '08', marks: [S, S, S, S, S, S, S, S, S, null, null] },
  { day: '09', marks: [S, S, S, D, S, P, D, S, H, null, null] },
  blankRow('10'),
  blankRow('11'),
  { day: '12', marks: [S, S, S, S, S, S, S, S, S, null, null] },
  { day: '13', marks: [S, S, S, P, S, H, S, S, S, null, null] },
];

/* -------------------------------- Selectors -------------------------------- */

/** The attendance card's "Year : 2024 / 2025" dropdown. */
export const attendanceYears = ['2024 / 2025', '2023 / 2024', '2022 / 2023'];

/** The matrix card's "This Year" dropdown. */
export const attendanceRanges = ['This Year', 'This Month', 'This Week'];

/** The template's hardcoded freshness line above the refresh button. */
export const attendanceUpdatedOn = '25 May 2024';
