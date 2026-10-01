import { all_routes } from '@/routes/all_routes';

const routes = all_routes;

export interface ReportStat {
  id: string;
  /** `stats-primary` | `stats-success` | `stats-warning` | `stats-info`. */
  variant: string;
  avatars: string[];
  icon: string;
  value: string;
  label: string;
  /** The inline `style="width:…"` on the `.stats-bar` fill. */
  barWidth: string;
}

export const statCards: ReportStat[] = [
  {
    id: 'total',
    variant: 'stats-primary',
    avatars: ['J', 'K', 'L'],
    icon: 'ti ti-users',
    value: '86',
    label: 'Total Teachers',
    barWidth: '78%',
  },
  {
    id: 'average',
    variant: 'stats-success',
    avatars: ['M', 'N', 'O'],
    icon: 'ti ti-user-check',
    value: '92.5%',
    label: 'Avg Attendance',
    barWidth: '92%',
  },
  {
    id: 'leave',
    variant: 'stats-warning',
    avatars: ['P', 'Q', 'R'],
    icon: 'ti ti-clock-hour-4',
    value: '7',
    label: 'On Leave',
    barWidth: '8%',
  },
  {
    id: 'absent',
    variant: 'stats-info',
    avatars: ['S', 'T', 'U'],
    icon: 'ti ti-user-off',
    value: '3',
    label: 'Absent Today',
    barWidth: '3%',
  },
];

export interface ReportTab {
  label: string;
  route: string;
}

/** The `.list-tab` rail shared by every attendance report. */
export const reportTabs: ReportTab[] = [
  { label: 'Attendance Report', route: routes.attendanceReport },
  { label: 'Students Attendance Type', route: routes.studentAttendanceType },
  { label: 'Daily Attendance', route: routes.dailyAttendance },
  { label: 'Student Day Wise', route: routes.studentDayWise },
  { label: 'Teacher Day Wise', route: routes.teacherDayWise },
  { label: 'Teacher Report', route: routes.teacherReport },
  { label: 'Staff Day Wise', route: routes.staffDayWise },
  { label: 'Staff Report', route: routes.staffReport },
];

/** The five `.attendance-type-list` entries above the grid. */
export interface AttendanceLegendItem {
  /** Also the `.attendance-range` background used inside the day grid. */
  tone: string;
  icon: string;
  label: string;
}

export const attendanceLegend: AttendanceLegendItem[] = [
  { tone: 'bg-success', icon: 'ti ti-checks', label: 'Present' },
  { tone: 'bg-danger', icon: 'ti ti-x', label: 'Absent' },
  { tone: 'bg-pending', icon: 'ti ti-clock-x', label: 'Late' },
  { tone: 'bg-dark', icon: 'ti ti-calendar-event', label: 'Halfday' },
  { tone: 'bg-info', icon: 'ti ti-clock-up', label: 'Holiday' },
];

export interface DayColumn {
  /** Two-digit day number rendered in `.day-num`. */
  num: string;
  /** Single-letter weekday. */
  day: string;
}

export const dayColumns: DayColumn[] = [
  { num: '01', day: 'M' },
  { num: '02', day: 'T' },
  { num: '03', day: 'W' },
  { num: '04', day: 'T' },
  { num: '05', day: 'F' },
  { num: '06', day: 'S' },
  { num: '07', day: 'S' },
  { num: '08', day: 'M' },
  { num: '09', day: 'T' },
  { num: '10', day: 'W' },
  { num: '11', day: 'T' },
  { num: '12', day: 'F' },
  { num: '13', day: 'S' },
  { num: '14', day: 'S' },
  { num: '15', day: 'M' },
  { num: '16', day: 'T' },
  { num: '17', day: 'W' },
  { num: '18', day: 'T' },
  { num: '19', day: 'F' },
  { num: '20', day: 'S' },
  { num: '21', day: 'S' },
  { num: '22', day: 'M' },
  { num: '23', day: 'T' },
];

/**
 * The month's day cells. The template gives every teacher the same run of
 * twenty-three `.attendance-range` swatches, so it is held once here.
 */
export const monthPattern: string[] = [
  'bg-success',
  'bg-dark',
  'bg-success',
  'bg-danger',
  'bg-success',
  'bg-info',
  'bg-info',
  'bg-success',
  'bg-success',
  'bg-success',
  'bg-success',
  'bg-pending',
  'bg-info',
  'bg-info',
  'bg-success',
  'bg-success',
  'bg-info',
  'bg-success',
  'bg-success',
  'bg-success',
  'bg-info',
  'bg-info',
  'bg-success',
];

export interface ReportRow {
  name: string;
  avatar: string;
  /** The `%` column: value plus the badge tone the template gives it. */
  percent: { value: number; className: string };
  /** Present / Late / Absent / Halfday / Holiday tallies. */
  present: number;
  late: number;
  absent: number;
  halfday: number;
  holiday: number;
  days: string[];
}

const row = (
  name: string,
  avatar: string,
  percent: number,
  percentClass: string,
  present: number,
  late: number,
  absent: number,
  halfday: number,
  holiday: number,
): ReportRow => ({
  name,
  avatar: `assets/img/teachers/${avatar}`,
  percent: { value: percent, className: percentClass },
  present,
  late,
  absent,
  halfday,
  holiday,
  days: monthPattern,
});

export const teachers: ReportRow[] = [
  row('Janet', 'teacher-01.jpg', 87, 'badge badge-soft-info', 22, 1, 1, 6, 1),
  row('Daniel', 'teacher-02.jpg', 95, 'badge badge-soft-info', 23, 1, 2, 6, 1),
  row('Hellana', 'teacher-03.jpg', 94, 'badge badge-soft-info', 23, 1, 3, 6, 1),
  row('Erickson', 'teacher-04.jpg', 45, 'badge badge-soft-danger', 16, 2, 1, 6, 1),
  row('Morgan', 'teacher-06.jpg', 100, 'badge badge-soft-success', 16, 2, 1, 6, 1),
  row('Aaron', 'teacher-07.jpg', 95, 'badge badge-soft-info', 21, 2, 1, 6, 2),
  row('Jacquelin', 'teacher-08.jpg', 99, 'badge badge-soft-info', 22, 0, 4, 6, 1),
  row('Raul', 'teacher-09.jpg', 98, 'badge badge-soft-info', 23, 0, 2, 6, 1),
  row('Elizabeth', 'teacher-10.jpg', 32, 'badge badge-soft-danger', 20, 3, 1, 6, 4),
  row('Edward', 'teacher-09.jpg', 97, 'badge badge-soft-info', 15, 1, 1, 6, 1),
];

/** The Filter panel's three fields. */
export const nameOptions = ['Select', 'Janet', 'Joann', 'Kathleen'];
export const monthOptions = ['Select', 'March', 'May'];
export const dateOptions = ['Date', '15 May 2024', '16 May 2024', '17 May 2024'];

/** The `bookingrange` input is a date-range plugin in the template. */
export const academicYears = [
  'Academic Year : 2024 / 2025',
  'Academic Year : 2023 / 2024',
  'Academic Year : 2022 / 2023',
];

export type ReportSortKey = 'asc' | 'desc' | 'viewed' | 'added';

export const sortOptions: { id: ReportSortKey; label: string }[] = [
  { id: 'asc', label: 'Ascending' },
  { id: 'desc', label: 'Descending' },
  { id: 'viewed', label: 'Recently Viewed' },
  { id: 'added', label: 'Recently Added' },
];
