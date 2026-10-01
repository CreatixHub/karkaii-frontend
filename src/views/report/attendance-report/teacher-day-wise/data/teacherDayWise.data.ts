import { all_routes } from '@/routes/all_routes';

const routes = all_routes;

export interface DayWiseStat {
  id: string;
  /** `stats-primary` | `stats-success` | `stats-warning` | `stats-info`. */
  variant: string;
  /** The three initials stacked in `.stats-avatars`. */
  avatars: string[];
  icon: string;
  value: string;
  label: string;
  /** The inline `style="width:…"` on the `.stats-bar` fill. */
  barWidth: string;
}

export const statCards: DayWiseStat[] = [
  {
    id: 'total',
    variant: 'stats-primary',
    avatars: ['A', 'B', 'C'],
    icon: 'ti ti-users',
    value: '65',
    label: 'Total Teachers',
    barWidth: '82%',
  },
  {
    id: 'present',
    variant: 'stats-success',
    avatars: ['D', 'E', 'F'],
    icon: 'ti ti-user-check',
    value: '54',
    label: 'Present Today',
    barWidth: '83%',
  },
  {
    id: 'late',
    variant: 'stats-warning',
    avatars: ['G', 'H', 'I'],
    icon: 'ti ti-clock-hour-4',
    value: '6',
    label: 'Late Arrivals',
    barWidth: '9%',
  },
  {
    id: 'rate',
    variant: 'stats-info',
    avatars: ['J', 'K', 'L'],
    icon: 'ti ti-percentage',
    value: '92%',
    label: 'Attendance Rate',
    barWidth: '92%',
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

export interface DayWiseRow {
  /** Employee id, e.g. `T849127`. */
  id: string;
  name: string;
  avatar: string;
  subject: string;
  attendance: {
    label: string;
    /** The badge classes the template gives each status. */
    className: string;
  };
}

const PRESENT = { label: 'Present', className: 'badge badge-soft-success' };

export const teachers: DayWiseRow[] = [
  { id: 'T849127', name: 'Teresa', avatar: 'assets/img/teachers/teacher-01.jpg', subject: 'Physics', attendance: PRESENT },
  { id: 'T849126', name: 'Daniel', avatar: 'assets/img/teachers/teacher-02.jpg', subject: 'Computer', attendance: PRESENT },
  {
    id: 'T849125',
    name: 'Hellana',
    avatar: 'assets/img/teachers/teacher-03.jpg',
    subject: 'English',
    attendance: { label: 'Absent', className: 'badge badge-soft-danger' },
  },
  { id: 'T849124', name: 'Erickson', avatar: 'assets/img/teachers/teacher-04.jpg', subject: 'Spanish', attendance: PRESENT },
  {
    id: 'T849123',
    name: 'Morgan',
    avatar: 'assets/img/teachers/teacher-05.jpg',
    subject: 'Env Science',
    attendance: { label: 'Half Day', className: 'badge text-dark bg-transparent-dark' },
  },
  { id: 'T849122', name: 'Aaron', avatar: 'assets/img/teachers/teacher-06.jpg', subject: 'Chemistry', attendance: PRESENT },
  { id: 'T849121', name: 'Jacquelin', avatar: 'assets/img/teachers/teacher-07.jpg', subject: 'Maths', attendance: PRESENT },
  {
    id: 'T849120',
    name: 'Raul',
    avatar: 'assets/img/teachers/teacher-08.jpg',
    subject: 'Biology',
    attendance: { label: 'Late', className: 'badge badge-soft-pending' },
  },
  { id: 'T849119', name: 'Elizabeth', avatar: 'assets/img/teachers/teacher-09.jpg', subject: 'Economics', attendance: PRESENT },
  { id: 'T849118', name: 'Edward', avatar: 'assets/img/teachers/teacher-10.jpg', subject: 'Finance', attendance: PRESENT },
];

/** The Filter panel's only field. */
export const attendanceDates = ['Date', '15 May 2024', '16 May 2024', '17 May 2024'];

/** The `bookingrange` input is a date-range plugin in the template. */
export const academicYears = [
  'Academic Year : 2024 / 2025',
  'Academic Year : 2023 / 2024',
  'Academic Year : 2022 / 2023',
];

export type DayWiseSortKey = 'asc' | 'desc' | 'viewed' | 'added';

export const sortOptions: { id: DayWiseSortKey; label: string }[] = [
  { id: 'asc', label: 'Ascending' },
  { id: 'desc', label: 'Descending' },
  { id: 'viewed', label: 'Recently Viewed' },
  { id: 'added', label: 'Recently Added' },
];
