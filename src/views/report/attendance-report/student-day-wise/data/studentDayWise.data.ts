import { all_routes } from '@/routes/all_routes';

const routes = all_routes;

export interface DayWiseStat {
  id: string;
  /** `stats-primary` | `stats-success` | `stats-warning` | `stats-info`. */
  variant: string;
  icon: string;
  value: string;
  label: string;
  subtitle: string;
  badge: string;
}

export const statCards: DayWiseStat[] = [
  {
    id: 'total',
    variant: 'stats-primary',
    icon: 'ti ti-users',
    value: '320',
    label: 'Total Students',
    subtitle: 'Enrolled this term',
    badge: '+4%',
  },
  {
    id: 'present',
    variant: 'stats-success',
    icon: 'ti ti-user-check',
    value: '278',
    label: 'Present Today',
    subtitle: 'Marked before 9 AM',
    badge: '+2%',
  },
  {
    id: 'late',
    variant: 'stats-warning',
    icon: 'ti ti-clock-hour-4',
    value: '12',
    label: 'Late Arrivals',
    subtitle: 'After 9:15 AM',
    badge: '+0.5%',
  },
  {
    id: 'absent',
    variant: 'stats-info',
    icon: 'ti ti-x',
    value: '30',
    label: 'Absent Today',
    subtitle: 'Leave & unmarked',
    badge: '+1.1%',
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
  id: string;
  admissionNo: string;
  rollNo: string;
  name: string;
  avatar: string;
  attendance: {
    label: string;
    /** The badge classes the template gives each status. */
    className: string;
  };
}

const PRESENT = { label: 'Present', className: 'badge badge-soft-success' };

export const students: DayWiseRow[] = [
  { id: '1', admissionNo: 'AD9892434', rollNo: '35013', name: 'Janet', avatar: 'assets/img/students/student-01.jpg', attendance: PRESENT },
  { id: '2', admissionNo: 'AD9892433', rollNo: '35012', name: 'Joann', avatar: 'assets/img/students/student-02.jpg', attendance: PRESENT },
  {
    id: '3',
    admissionNo: 'AD9892432',
    rollNo: '35011',
    name: 'Kathleen',
    avatar: 'assets/img/students/student-03.jpg',
    attendance: { label: 'Half Day', className: 'badge text-dark bg-transparent-dark' },
  },
  { id: '4', admissionNo: 'AD9892431', rollNo: '35010', name: 'Gifford', avatar: 'assets/img/students/student-04.jpg', attendance: PRESENT },
  {
    id: '5',
    admissionNo: 'AD9892430',
    rollNo: '35009',
    name: 'Lisa',
    avatar: 'assets/img/students/student-05.jpg',
    attendance: { label: 'Absent', className: 'badge badge-soft-danger' },
  },
  {
    id: '6',
    admissionNo: 'AD9892429',
    rollNo: '35008',
    name: 'Ralph',
    avatar: 'assets/img/students/student-06.jpg',
    attendance: { label: 'Late', className: 'badge badge-soft-pending' },
  },
  { id: '7', admissionNo: 'AD9892428', rollNo: '35007', name: 'Julie', avatar: 'assets/img/students/student-07.jpg', attendance: PRESENT },
  { id: '8', admissionNo: 'AD9892427', rollNo: '35006', name: 'Ryan', avatar: 'assets/img/students/student-08.jpg', attendance: PRESENT },
  {
    id: '9',
    admissionNo: 'AD9892426',
    rollNo: '35005',
    name: 'Susan',
    avatar: 'assets/img/students/student-09.jpg',
    attendance: { label: 'Absent', className: 'badge badge-soft-danger' },
  },
  { id: '10', admissionNo: 'AD9892425', rollNo: '35004', name: 'Richard', avatar: 'assets/img/students/student-10.jpg', attendance: PRESENT },
];

export interface DayWiseFilters {
  className: string;
  section: string;
  date: string;
}

export const classOptions = ['Class', 'I', 'II', 'III'];
export const sectionOptions = ['Section', 'A', 'B', 'C'];
export const attendanceDates = ['Attendance Date', '15 May 2024', '16 May 2024', '17 May 2024'];

export const EMPTY_FILTERS: DayWiseFilters = {
  className: classOptions[0],
  section: sectionOptions[0],
  date: attendanceDates[0],
};

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
