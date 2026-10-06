import { all_routes } from '@/routes/all_routes';
import type { InfoRow } from './teacherDashboard.data';

const routes = all_routes;

/* ----------------------------- Quick attendance ---------------------------- */

export interface AttendanceStudent {
  id: string;
  name: string;
  roll: string;
  avatar: string;
}

export const quickAttendanceClasses = [
  'Grade III-A · Mathematics',
  'Grade IV-B · Physics',
  'Grade V-A · Mathematics',
  'Grade VI-A · Chemistry',
];

export const quickAttendanceStudents: AttendanceStudent[] = [
  { id: 'qa1', name: 'Janet Daniel', roll: 'Roll 35013', avatar: 'assets/img/students/student-01.jpg' },
  { id: 'qa2', name: 'Joann Michael', roll: 'Roll 35014', avatar: 'assets/img/students/student-02.jpg' },
  { id: 'qa3', name: 'Emeley Karen', roll: 'Roll 35015', avatar: 'assets/img/students/student-05.jpg' },
  { id: 'qa4', name: 'Aaron Kessler', roll: 'Roll 35017', avatar: 'assets/img/students/student-07.jpg' },
  { id: 'qa5', name: 'Daniel Josh', roll: 'Roll 35016', avatar: 'assets/img/students/student-09.jpg' },
  { id: 'qa6', name: 'Ella Simpson', roll: 'Roll 35018', avatar: 'assets/img/students/student-11.jpg' },
  { id: 'qa7', name: 'Marcus Lee', roll: 'Roll 35019', avatar: 'assets/img/students/student-13.jpg' },
  { id: 'qa8', name: 'Sophia Ray', roll: 'Roll 35020', avatar: 'assets/img/students/student-03.jpg' },
];

/* --------------------------- Attendance summary ---------------------------- */

export const attendanceTotals = [
  { id: 'present', value: '233', label: 'Present' },
  { id: 'absent', value: '15', label: 'Absent' },
  { id: 'overall', value: '94%', label: 'Overall' },
];

export const classWiseAttendance: InfoRow[] = [
  { id: 'cw1', icon: 'ti ti-users', iconClass: 'bg-primary-transparent', title: 'Grade III-A', subtitle: '40 of 42 present', endBadge: { label: '95%', className: 'badge-soft-success' } },
  { id: 'cw2', icon: 'ti ti-users', iconClass: 'bg-info-transparent', title: 'Grade IV-B', subtitle: '35 of 38 present', endBadge: { label: '92%', className: 'badge-soft-success' } },
  { id: 'cw3', icon: 'ti ti-users', iconClass: 'bg-warning-transparent', title: 'Grade V-A', subtitle: '37 of 40 present', endBadge: { label: '93%', className: 'badge-soft-success' } },
  { id: 'cw4', icon: 'ti ti-users', iconClass: 'bg-danger-transparent', title: 'Grade VI-A', subtitle: '33 of 36 present', endBadge: { label: '92%', className: 'badge-soft-success' } },
];

export const lateAndLeave: InfoRow[] = [
  { id: 'll1', avatar: 'assets/img/students/student-07.jpg', title: 'Aaron Kessler', subtitle: 'Late · +12m', endBadge: { label: 'Late', className: 'badge-soft-warning' } },
  { id: 'll2', avatar: 'assets/img/students/student-01.jpg', title: 'Janet Daniel', subtitle: 'Sick leave · 22–23 Jul', endBadge: { label: 'Leave', className: 'badge-soft-info' } },
];

/* -------------------------------- Homework --------------------------------- */

export const homeworkClasses = ['Grade III-A', 'Grade IV-B', 'Grade V-A', 'Grade VI-A'];

export const homeworkPending: InfoRow[] = [
  { id: 'hp1', icon: 'ti ti-math-symbols', iconClass: 'bg-warning-transparent', title: 'Algebra Worksheet 4', subtitle: 'Grade V-A · 34 of 40 submitted', endBadge: { label: 'Due today', className: 'badge-soft-warning' } },
  { id: 'hp2', icon: 'ti ti-atom-2', iconClass: 'bg-warning-transparent', title: "Newton's Laws — Lab Report", subtitle: 'Grade IV-B · 30 of 38 submitted', endBadge: { label: 'Tomorrow', className: 'badge-soft-warning' } },
  { id: 'hp3', icon: 'ti ti-flask', iconClass: 'bg-warning-transparent', title: 'Periodic Table Quiz', subtitle: 'Grade VI-A · 28 of 36 submitted', endBadge: { label: '2 days', className: 'badge-soft-warning' } },
];

/* ---------------------------------- Exams ---------------------------------- */

export const examSchedule: InfoRow[] = [
  { id: 'ex1', icon: 'ti ti-flask', iconClass: 'bg-purple-transparent', title: 'Chemistry — Term Test', subtitle: 'Grade VI-A · Lab 01 · 09:00 AM', endBadge: { label: 'Fri, 25 Jul', className: 'badge-soft-warning' } },
  { id: 'ex2', icon: 'ti ti-math-symbols', iconClass: 'bg-primary-transparent', title: 'Mathematics — Unit III', subtitle: 'Grade V-A · Room 108', endBadge: { label: '26 Jul', className: 'badge-soft-warning' } },
  { id: 'ex3', icon: 'ti ti-atom-2', iconClass: 'bg-info-transparent', title: 'Physics — Chapter 4', subtitle: 'Grade IV-B · Lab 02', endBadge: { label: '29 Jul', className: 'badge-soft-info' } },
  { id: 'ex4', icon: 'ti ti-math-symbols', iconClass: 'bg-teal-transparent', title: 'Mathematics — Unit II', subtitle: 'Grade III-A · Room 204', endBadge: { label: '02 Aug', className: 'badge-soft-info' } },
];

/* ------------------------------- Performance ------------------------------- */

export const performanceTotals = [
  { id: 'attendance', value: '93%', label: 'Attendance' },
  { id: 'marks', value: '84%', label: 'Avg Marks' },
  { id: 'homework', value: '88%', label: 'Homework' },
  { id: 'engagement', value: '89%', label: 'Engagement' },
];

export const performanceTopPerformers: InfoRow[] = [
  { id: 'pt1', avatar: 'assets/img/students/student-01.jpg', title: 'Janet Daniel', subtitle: 'Grade III-A · 96%' },
  { id: 'pt2', avatar: 'assets/img/students/student-13.jpg', title: 'Marcus Lee', subtitle: 'Grade III-A · 96%' },
];

export const performanceAtRisk: InfoRow[] = [
  { id: 'pr1', avatar: 'assets/img/students/student-07.jpg', title: 'Aaron Kessler', subtitle: 'Below 60% · 2 subjects' },
  { id: 'pr2', avatar: 'assets/img/students/student-09.jpg', title: 'Daniel Josh', subtitle: 'Attendance 79%' },
];

/* --------------------------------- Messages -------------------------------- */

export const modalMessages: InfoRow[] = [
  { id: 'mm1', avatar: 'assets/img/profiles/avatar-27.jpg', title: 'Robert Daniel', titleBadge: { label: 'Parent', className: 'badge-soft-info' }, subtitle: "Thank you for the update on Janet's progress…", endNote: '2m' },
  { id: 'mm2', avatar: 'assets/img/profiles/avatar-23.jpg', title: 'Sarah Michael', titleBadge: { label: 'Meeting', className: 'badge-soft-warning' }, subtitle: 'Requesting a meeting regarding homework schedule…', endNote: '15m' },
  { id: 'mm3', avatar: 'assets/img/profiles/avatar-25.jpg', title: 'David Karen', subtitle: "Will Emeley's fee reminder affect her exams?", endNote: '1h' },
  { id: 'mm4', avatar: 'assets/img/profiles/avatar-01.jpg', title: 'Nina Patel', subtitle: 'Could you share the syllabus for next month?', endNote: '3h' },
];

/* ---------------------------------- Events --------------------------------- */

export const upcomingMeetings: InfoRow[] = [
  { id: 'um1', icon: 'ti ti-users-group', iconClass: 'bg-primary-transparent', title: 'Staff Meeting', subtitle: 'Today · 03:00 PM · Conference Hall', endBadge: { label: 'Today', className: 'badge-soft-warning' } },
  { id: 'um2', icon: 'ti ti-calendar-event', iconClass: 'bg-info-transparent', title: 'PTA Meeting', subtitle: '28 Jul · 04:00 PM · Grade IV parents', endBadge: { label: '28 Jul', className: 'badge-soft-info' } },
  { id: 'um3', icon: 'ti ti-confetti', iconClass: 'bg-success-transparent', title: 'Annual Science Fair', subtitle: '27 Jul · Auditorium', endBadge: { label: '27 Jul', className: 'badge-soft-success' } },
];

/* --------------------------------- Profile --------------------------------- */

export const profileDetails: InfoRow[] = [
  { id: 'pd1', icon: 'ti ti-id-badge-2', iconClass: 'bg-primary-transparent', title: 'Teacher ID', subtitle: 'TCH-1043' },
  { id: 'pd2', icon: 'ti ti-building', iconClass: 'bg-info-transparent', title: 'Department', subtitle: 'Science' },
  { id: 'pd3', icon: 'ti ti-home', iconClass: 'bg-teal-transparent', title: 'Homeroom', subtitle: 'Grade III-A' },
  { id: 'pd4', icon: 'ti ti-mail', iconClass: 'bg-warning-transparent', title: 'Email', subtitle: 'teresa.susan@karkaii.edu' },
  { id: 'pd5', icon: 'ti ti-phone', iconClass: 'bg-purple-transparent', title: 'Phone', subtitle: '+1 809 120 4045' },
];

/* ------------------------------ Quick actions ------------------------------ */

export interface QuickActionTile {
  id: string;
  icon: string;
  title: string;
  subtitle: string;
  /** Either navigates, or opens the quick-attendance dialog. */
  to?: string;
  opensAttendance?: boolean;
}

export const quickActionTiles: QuickActionTile[] = [
  { id: 'attendance', icon: 'ti ti-clipboard-check', title: 'Attendance', subtitle: "Take today's", opensAttendance: true },
  { id: 'marks', icon: 'ti ti-writing', title: 'Marks', subtitle: 'Upload / enter', to: routes.examResult },
  { id: 'homework', icon: 'ti ti-book', title: 'Homework', subtitle: 'Create', to: routes.classHomeWork },
  { id: 'lesson', icon: 'ti ti-notebook', title: 'Lesson Plan', subtitle: 'Manage', to: routes.classSyllabus },
  { id: 'material', icon: 'ti ti-files', title: 'Material', subtitle: 'Study files', to: routes.libraryBooks },
  { id: 'report', icon: 'ti ti-report-analytics', title: 'Report', subtitle: 'Generate', to: routes.studentPromotion },
  { id: 'calendar', icon: 'ti ti-calendar', title: 'Calendar', subtitle: 'Schedule', to: routes.calendar },
  { id: 'exams', icon: 'ti ti-hexagonal-prism-plus', title: 'Exams', subtitle: 'Schedule', to: routes.examSchedule },
];

/* ------------------------------- Announcement ------------------------------ */

export const announcementAudiences = [
  'All Parents',
  'Grade III-A Parents',
  'Grade IV-B Parents',
  'All Students',
];
