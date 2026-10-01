import { all_routes } from '@/routes/all_routes';
import type { InfoRow } from '../../shared/types';

const routes = all_routes;

/* ----------------------------------- Hero ---------------------------------- */

export interface ProfileChip {
  icon: string;
  label: string;
}

export const teacherProfile = {
  name: 'Ms. Teresa Susan',
  photo: 'assets/img/teachers/teacher-01.jpg',
  chips: [
    { icon: 'ti ti-id-badge-2', label: 'TCH-1043' },
    { icon: 'ti ti-building', label: 'Science Dept.' },
    { icon: 'ti ti-award', label: 'Senior Teacher' },
    { icon: 'ti ti-home', label: 'Homeroom III-A' },
  ] as ProfileChip[],
};

export interface HeroStat {
  id: string;
  icon?: string;
  iconClass?: string;
  value: string;
  label: string;
  /** Renders a progress ring instead of an avatar icon. */
  ring?: number;
  ringClass?: string;
}

export const heroStats: HeroStat[] = [
  { id: 'schedule', icon: 'ti ti-calendar-time', iconClass: 'bg-primary-transparent', value: '6', label: "Today's Schedule" },
  { id: 'hours', icon: 'ti ti-clock-hour-4', iconClass: 'bg-info-transparent', value: '5h 20m', label: 'Teaching Hours' },
  { id: 'upcoming', icon: 'ti ti-arrow-forward-up', iconClass: 'bg-warning-transparent', value: '3', label: 'Upcoming Classes' },
  { id: 'attendance', icon: 'ti ti-user-check', iconClass: 'bg-success-transparent', value: '94%', label: 'Attendance Today' },
  { id: 'profile', ring: 88, ringClass: 'text-teal', value: 'Profile', label: 'Completion' },
  { id: 'ai', icon: 'ti ti-sparkles', iconClass: 'bg-purple-transparent', value: '9.2/10', label: 'AI Teaching Score' },
];

export interface QuickAction {
  id: string;
  icon: string;
  label: string;
  primary?: boolean;
  /** Modal this action opens, when it opens one. */
  modal?: TeacherModalId;
}

export const quickActions: QuickAction[] = [
  { id: 'attendance', icon: 'ti ti-clipboard-check', label: 'Take Attendance', primary: true, modal: 'quickAttendance' },
  { id: 'start', icon: 'ti ti-player-play', label: 'Start Class', modal: 'startClass' },
  { id: 'assignment', icon: 'ti ti-file-plus', label: 'Create Assignment', modal: 'homework' },
  { id: 'marks', icon: 'ti ti-writing', label: 'Enter Marks', modal: 'exams' },
  { id: 'meeting', icon: 'ti ti-calendar-plus', label: 'Schedule Meeting', modal: 'events' },
  { id: 'announce', icon: 'ti ti-speakerphone', label: 'Send Announcement', modal: 'announce' },
  { id: 'more', icon: 'ti ti-apps', label: 'More Actions', modal: 'quick' },
];

/* ------------------------------- KPI overview ------------------------------ */

/** Every dialog on this page, keyed by the id used in the source markup. */
export type TeacherModalId =
  | 'quickAttendance'
  | 'classes'
  | 'attendance'
  | 'homework'
  | 'exams'
  | 'performance'
  | 'messages'
  | 'notifications'
  | 'events'
  | 'profile'
  | 'quick'
  | 'announce'
  | 'startClass';

export interface KpiStat {
  id: string;
  icon: string;
  iconClass: string;
  delta: string;
  deltaIcon: string;
  deltaDirection: 'up' | 'down' | 'flat';
  value: string;
  /** Small suffix rendered inside the value, e.g. the "%" in "93%". */
  valueSuffix?: string;
  label: string;
  modal: TeacherModalId;
}

export const kpiStats: KpiStat[] = [
  { id: 'classes', icon: 'ti ti-book', iconClass: 'bg-primary-transparent', delta: '1', deltaIcon: 'ti ti-arrow-up', deltaDirection: 'up', value: '6', label: "Today's Classes", modal: 'classes' },
  { id: 'present', icon: 'ti ti-user-check', iconClass: 'bg-success-transparent', delta: '3%', deltaIcon: 'ti ti-arrow-up', deltaDirection: 'up', value: '233', label: 'Students Present', modal: 'attendance' },
  { id: 'absent', icon: 'ti ti-user-x', iconClass: 'bg-danger-transparent', delta: '2', deltaIcon: 'ti ti-arrow-down', deltaDirection: 'down', value: '15', label: 'Students Absent', modal: 'attendance' },
  { id: 'pending', icon: 'ti ti-file-description', iconClass: 'bg-warning-transparent', delta: '0', deltaIcon: 'ti ti-minus', deltaDirection: 'flat', value: '8', label: 'Assignments Pending', modal: 'homework' },
  { id: 'submitted', icon: 'ti ti-checkbox', iconClass: 'bg-info-transparent', delta: '12', deltaIcon: 'ti ti-arrow-up', deltaDirection: 'up', value: '142', label: 'Homework Submitted', modal: 'homework' },
  { id: 'exams', icon: 'ti ti-hexagonal-prism-plus', iconClass: 'bg-purple-transparent', delta: '2', deltaIcon: 'ti ti-arrow-up', deltaDirection: 'up', value: '4', label: 'Upcoming Exams', modal: 'exams' },
  { id: 'messages', icon: 'ti ti-mail', iconClass: 'bg-pink-transparent', delta: '5', deltaIcon: 'ti ti-arrow-up', deltaDirection: 'up', value: '9', label: 'Parent Messages', modal: 'messages' },
  { id: 'leave', icon: 'ti ti-calendar-off', iconClass: 'bg-warning-transparent', delta: '0', deltaIcon: 'ti ti-minus', deltaDirection: 'flat', value: '3', label: 'Leave Requests', modal: 'attendance' },
  { id: 'avg', icon: 'ti ti-chart-pie', iconClass: 'bg-teal-transparent text-teal', delta: '1%', deltaIcon: 'ti ti-arrow-up', deltaDirection: 'up', value: '93', valueSuffix: '%', label: 'Avg Class Attendance', modal: 'attendance' },
  { id: 'hours', icon: 'ti ti-clock', iconClass: 'bg-info-transparent', delta: '0.5h', deltaIcon: 'ti ti-arrow-up', deltaDirection: 'up', value: '5.3', valueSuffix: 'h', label: 'Teaching Hours', modal: 'classes' },
];

/* --------------------------------- Timetable ------------------------------- */

export interface Lesson {
  id: string;
  time: string;
  duration: string;
  subject: string;
  borderClass: string;
  grade: string;
  room: string;
  students: string;
  status: { label: string; className: string; icon?: string };
  /** "Class" button, present on the live and next lessons. */
  startButton?: { className: string };
  attendanceModal?: TeacherModalId;
}

export const todaysLessons: Lesson[] = [
  {
    id: 'l1', time: '08:00', duration: '45 min', subject: 'Mathematics', borderClass: 'border-success',
    grade: 'Grade III-A', room: 'Room 204', students: '42 students',
    status: { label: 'Done', className: 'badge badge-soft-secondary', icon: 'ti ti-check' },
    attendanceModal: 'quickAttendance',
  },
  {
    id: 'l2', time: '09:00', duration: '45 min', subject: 'Science — Physics', borderClass: 'border-danger',
    grade: 'Grade IV-B', room: 'Lab 02', students: '38 students',
    status: { label: 'Live', className: 'badge badge-danger' },
    startButton: { className: 'action-button-success' },
  },
  {
    id: 'l3', time: '10:15', duration: '45 min', subject: 'Mathematics', borderClass: 'border-warning',
    grade: 'Grade V-A', room: 'Room 108', students: '40 students',
    status: { label: 'Next', className: 'badge badge-soft-warning', icon: 'ti ti-clock' },
    startButton: { className: '' },
  },
  {
    id: 'l4', time: '11:15', duration: '45 min', subject: 'Science — Chemistry', borderClass: 'border-info',
    grade: 'Grade VI-A', room: 'Lab 01', students: '36 students',
    status: { label: '11:15', className: 'badge badge-soft-warning', icon: 'ti ti-clock' },
  },
  {
    id: 'l5', time: '13:00', duration: '45 min', subject: 'Mathematics', borderClass: 'border-purple',
    grade: 'Grade IV-A', room: 'Room 204', students: '41 students',
    status: { label: '13:00', className: 'badge badge-soft-warning', icon: 'ti ti-clock' },
  },
  {
    id: 'l6', time: '14:00', duration: '45 min', subject: 'Homeroom / Mentoring', borderClass: 'border-teal',
    grade: 'Grade III-A', room: 'Room 204', students: '42 students',
    status: { label: '14:00', className: 'badge badge-soft-warning', icon: 'ti ti-clock' },
  },
];

/* ------------------------------- AI insights ------------------------------- */

export interface InsightItem {
  id: string;
  icon: string;
  iconClass: string;
  title: string;
  description: string;
}

export const aiInsights: InsightItem[] = [
  { id: 'engagement', icon: 'ti ti-activity', iconClass: 'bg-info-transparent', title: 'Class Engagement 89%', description: 'Highest in Grade IV-B interactive sessions' },
  { id: 'attendance', icon: 'ti ti-chart-arrows-vertical', iconClass: 'bg-success-transparent', title: 'Attendance Prediction 95%', description: 'Expected for tomorrow across all classes' },
  { id: 'forecast', icon: 'ti ti-target-arrow', iconClass: 'bg-warning-transparent', title: 'Performance Forecast +4%', description: 'Grade V-A trending upward in Mathematics' },
  { id: 'attention', icon: 'ti ti-alert-triangle', iconClass: 'bg-danger-transparent', title: '5 students need attention', description: 'Low homework completion in Grade IV-B' },
  { id: 'suggestion', icon: 'ti ti-bulb', iconClass: 'bg-purple-transparent', title: 'Suggested action', description: 'Run a revision quiz for Chemistry before Fri exam' },
];

/* ----------------------------- Class performance --------------------------- */

export interface PerformanceMetric {
  id: string;
  icon: string;
  iconClass: string;
  badge: string;
  badgeIcon?: string;
  value: string;
  label: string;
  percent: number;
}

export const performanceMetrics: PerformanceMetric[] = [
  { id: 'attendance', icon: 'ti ti-user-check', iconClass: 'bg-success-transparent', badge: '+2%', badgeIcon: 'ti ti-arrow-up', value: '93%', label: 'Average Attendance', percent: 93 },
  { id: 'marks', icon: 'ti ti-writing', iconClass: 'bg-primary-transparent', badge: '+5%', badgeIcon: 'ti ti-arrow-up', value: '84%', label: 'Average Marks', percent: 84 },
  { id: 'homework', icon: 'ti ti-checkbox', iconClass: 'bg-info-transparent', badge: '+7%', badgeIcon: 'ti ti-arrow-up', value: '88%', label: 'Homework Completion', percent: 88 },
  { id: 'engagement', icon: 'ti ti-activity', iconClass: 'bg-purple-transparent', badge: '+3%', badgeIcon: 'ti ti-arrow-up', value: '89%', label: 'Student Engagement', percent: 89 },
  { id: 'behavior', icon: 'ti ti-mood-happy', iconClass: 'bg-teal-transparent', badge: 'A', value: '91%', label: 'Behavior Score', percent: 91 },
];

/** Sparkline path for the 6-week performance trend tile. */
export const performanceTrendPaths = {
  area: 'M0,28 L20,24 L40,26 L60,16 L80,18 L100,9 L120,7 L120,34 L0,34 Z',
  line: 'M0,28 L20,24 L40,26 L60,16 L80,18 L100,9 L120,7',
};

/* -------------------------------- My classes ------------------------------- */

export interface TeacherClass {
  id: string;
  grade: string;
  subject: string;
  icon: string;
  headerClass: string;
  avatarClass: string;
  homeroom: boolean;
  stats: { value: string; label: string }[];
}

export const myClasses: TeacherClass[] = [
  { id: 'c1', grade: 'Grade III-A', subject: 'Mathematics', icon: 'ti ti-math-symbols', headerClass: 'bg-primary-transparent', avatarClass: 'bg-primary text-white', homeroom: true, stats: [{ value: '42', label: 'Students' }, { value: '93%', label: 'Attendance' }, { value: '84%', label: 'Avg Marks' }] },
  { id: 'c2', grade: 'Grade IV-B', subject: 'Science — Physics', icon: 'ti ti-atom-2', headerClass: 'bg-info-transparent', avatarClass: 'bg-info text-white', homeroom: false, stats: [{ value: '38', label: 'Students' }, { value: '90%', label: 'Attendance' }, { value: '81%', label: 'Avg Marks' }] },
  { id: 'c3', grade: 'Grade V-A', subject: 'Mathematics', icon: 'ti ti-math-symbols', headerClass: 'bg-warning-transparent', avatarClass: 'bg-warning text-white', homeroom: false, stats: [{ value: '40', label: 'Students' }, { value: '95%', label: 'Attendance' }, { value: '86%', label: 'Avg Marks' }] },
  { id: 'c4', grade: 'Grade VI-A', subject: 'Science — Chemistry', icon: 'ti ti-flask', headerClass: 'bg-danger-transparent', avatarClass: 'bg-danger text-white', homeroom: false, stats: [{ value: '36', label: 'Students' }, { value: '92%', label: 'Attendance' }, { value: '83%', label: 'Avg Marks' }] },
  { id: 'c5', grade: 'Grade IV-A', subject: 'Mathematics', icon: 'ti ti-math-symbols', headerClass: 'bg-purple-transparent', avatarClass: 'bg-purple text-white', homeroom: false, stats: [{ value: '41', label: 'Students' }, { value: '91%', label: 'Attendance' }, { value: '85%', label: 'Avg Marks' }] },
  { id: 'c6', grade: 'Grade III-A', subject: 'Homeroom Mentoring', icon: 'ti ti-users-group', headerClass: 'bg-teal-transparent', avatarClass: 'bg-teal text-white', homeroom: true, stats: [{ value: '42', label: 'Students' }, { value: '93%', label: 'Attendance' }, { value: '—', label: 'Mentoring' }] },
];

/** Per-class action icons; the routes replace the template's .html links. */
export const classActions = [
  { id: 'homework', icon: 'ti ti-book', title: 'Homework', to: routes.classHomeWork },
  { id: 'marks', icon: 'ti ti-writing', title: 'Marks', to: routes.examResult },
  { id: 'timetable', icon: 'ti ti-table', title: 'Timetable', to: routes.classTimetable },
];

/* ------------------------------- Assignments ------------------------------- */

/** Re-exported so existing teacher imports keep resolving from this module. */
export type { InfoRow } from '../../shared/types';

export interface AssignmentTab {
  id: string;
  label: string;
  count?: string;
  rows: InfoRow[];
}

export const assignmentTabs: AssignmentTab[] = [
  {
    id: 'pending',
    label: 'Pending Review',
    count: '8',
    rows: [
      { id: 'p1', icon: 'ti ti-math-symbols', iconClass: 'bg-warning-transparent', title: 'Algebra Worksheet 4', subtitle: 'Grade V-A · 34 of 40 submitted', endBadge: { label: 'Review', className: 'badge-soft-warning' }, endNote: 'Due today' },
      { id: 'p2', icon: 'ti ti-atom-2', iconClass: 'bg-warning-transparent', title: "Newton's Laws — Lab Report", subtitle: 'Grade IV-B · 30 of 38 submitted', endBadge: { label: 'Review', className: 'badge-soft-warning' }, endNote: 'Due tomorrow' },
      { id: 'p3', icon: 'ti ti-flask', iconClass: 'bg-warning-transparent', title: 'Periodic Table Quiz', subtitle: 'Grade VI-A · 28 of 36 submitted', endBadge: { label: 'Review', className: 'badge-soft-warning' }, endNote: '2 days' },
      { id: 'p4', icon: 'ti ti-ruler-2', iconClass: 'bg-warning-transparent', title: 'Geometry Practice Sheet', subtitle: 'Grade IV-A · 33 of 41 submitted', endBadge: { label: 'Review', className: 'badge-soft-warning' }, endNote: '3 days' },
      { id: 'p5', icon: 'ti ti-atom', iconClass: 'bg-warning-transparent', title: 'Energy & Work — Assignment', subtitle: 'Grade IV-B · 35 of 38 submitted', endBadge: { label: 'Review', className: 'badge-soft-warning' }, endNote: '4 days' },
    ],
  },
  {
    id: 'submitted',
    label: 'Submitted',
    rows: [
      { id: 's1', icon: 'ti ti-checkbox', iconClass: 'bg-success-transparent', title: 'Fractions Practice Set', subtitle: 'Grade III-A · 42 of 42 submitted', endBadge: { label: 'Complete', className: 'badge-soft-success' } },
      { id: 's2', icon: 'ti ti-checkbox', iconClass: 'bg-success-transparent', title: 'Motion Concepts Sheet', subtitle: 'Grade IV-A · 39 of 41 submitted', endBadge: { label: '95%', className: 'badge-soft-success' } },
      { id: 's3', icon: 'ti ti-checkbox', iconClass: 'bg-success-transparent', title: 'Multiplication Drill', subtitle: 'Grade V-A · 40 of 40 submitted', endBadge: { label: 'Complete', className: 'badge-soft-success' } },
      { id: 's4', icon: 'ti ti-checkbox', iconClass: 'bg-success-transparent', title: 'Acids & Bases Notes', subtitle: 'Grade VI-A · 34 of 36 submitted', endBadge: { label: '94%', className: 'badge-soft-success' } },
    ],
  },
  {
    id: 'late',
    label: 'Late',
    rows: [
      { id: 'la1', avatar: 'assets/img/students/student-07.jpg', title: 'Aaron Kessler', subtitle: 'Algebra Worksheet 4 · 2 days late', endBadge: { label: 'Late', className: 'badge-soft-danger' } },
      { id: 'la2', avatar: 'assets/img/students/student-09.jpg', title: 'Daniel Josh', subtitle: 'Lab Report · 1 day late', endBadge: { label: 'Late', className: 'badge-soft-danger' } },
      { id: 'la3', avatar: 'assets/img/students/student-03.jpg', title: 'Sophia Ray', subtitle: 'Periodic Table Quiz · 3 days late', endBadge: { label: 'Late', className: 'badge-soft-danger' } },
      { id: 'la4', avatar: 'assets/img/students/student-11.jpg', title: 'Ella Simpson', subtitle: 'Geometry Sheet · 1 day late', endBadge: { label: 'Late', className: 'badge-soft-danger' } },
    ],
  },
  {
    id: 'upcoming',
    label: 'Deadlines',
    rows: [
      { id: 'u1', icon: 'ti ti-calendar-due', iconClass: 'bg-info-transparent', title: 'Chapter 6 Assessment', subtitle: 'Grade V-A · Mathematics', endBadge: { label: '25 Jul', className: 'badge-soft-info' } },
      { id: 'u2', icon: 'ti ti-calendar-due', iconClass: 'bg-info-transparent', title: 'Chemistry Practical', subtitle: 'Grade VI-A · Lab 01', endBadge: { label: '28 Jul', className: 'badge-soft-info' } },
      { id: 'u3', icon: 'ti ti-calendar-due', iconClass: 'bg-info-transparent', title: 'Physics Project Submission', subtitle: 'Grade IV-B · Group work', endBadge: { label: '30 Jul', className: 'badge-soft-info' } },
      { id: 'u4', icon: 'ti ti-calendar-due', iconClass: 'bg-info-transparent', title: 'Mental Maths Challenge', subtitle: 'Grade III-A · Homeroom', endBadge: { label: '02 Aug', className: 'badge-soft-info' } },
    ],
  },
  {
    id: 'graded',
    label: 'Graded',
    rows: [
      { id: 'g1', icon: 'ti ti-award', iconClass: 'bg-teal-transparent', title: 'Unit Test II — Mathematics', subtitle: 'Grade III-A · avg 84%', endBadge: { label: 'Published', className: 'badge-soft-success' } },
      { id: 'g2', icon: 'ti ti-award', iconClass: 'bg-teal-transparent', title: 'Physics Quiz 3', subtitle: 'Grade IV-B · avg 79%', endBadge: { label: 'Published', className: 'badge-soft-success' } },
      { id: 'g3', icon: 'ti ti-award', iconClass: 'bg-teal-transparent', title: 'Chemistry Quiz 2', subtitle: 'Grade VI-A · avg 82%', endBadge: { label: 'Published', className: 'badge-soft-success' } },
      { id: 'g4', icon: 'ti ti-award', iconClass: 'bg-teal-transparent', title: 'Algebra Test 1', subtitle: 'Grade V-A · avg 87%', endBadge: { label: 'Published', className: 'badge-soft-success' } },
    ],
  },
];

/* ------------------------------ Exam & grading ----------------------------- */

export const examStats = [
  { id: 'upcoming', value: '4', label: 'Upcoming Exams' },
  { id: 'pending', value: '26', label: 'Marks Pending' },
  { id: 'gpa', value: '3.6', label: 'Average GPA' },
  { id: 'top', value: 'V-A', label: 'Top Class' },
];

export const upcomingExams: InfoRow[] = [
  { id: 'e1', icon: 'ti ti-flask', iconClass: 'bg-purple-transparent', title: 'Chemistry — Term Test', subtitle: 'Grade VI-A', endBadge: { label: 'Fri', className: 'badge-soft-warning' } },
  { id: 'e2', icon: 'ti ti-math-symbols', iconClass: 'bg-primary-transparent', title: 'Mathematics — Unit III', subtitle: 'Grade V-A', endBadge: { label: '26 Jul', className: 'badge-soft-warning' } },
];

export const studentsNeedingAttention: InfoRow[] = [
  { id: 'a1', avatar: 'assets/img/students/student-07.jpg', title: 'Aaron Kessler', subtitle: 'Below 60% · 2 subjects', endBadge: { label: 'At risk', className: 'badge-soft-danger' } },
];

/* ----------------------------- Attendance centre --------------------------- */

export const attendanceSplit = [
  { id: 'today', value: '94%', label: 'Today', percent: 94, barClass: 'bg-success' },
  { id: 'week', value: '92%', label: 'This Week', percent: 92, barClass: 'bg-primary' },
  { id: 'month', value: '91%', label: 'This Month', percent: 91, barClass: 'bg-info' },
];

/**
 * 30-day attendance heatmap. `level` 1–4 maps onto the green scale in the
 * legend; `absent` paints the red swatch. The HTML shipped an empty `#tdHeat`
 * container with no script, so the values are authored here instead.
 */
export interface HeatCell {
  day: number;
  level: 1 | 2 | 3 | 4;
  absent?: boolean;
}

export const attendanceHeatCells: HeatCell[] = [
  4, 3, 4, 2, 4, 1, 3, 4, 4, 2, 3, 4, 1, 4, 3, 4, 4, 2, 4, 3, 1, 4, 4, 3, 4, 2, 4, 3, 4, 4,
].map((level, index) => ({
  day: index + 1,
  level: level as HeatCell['level'],
  // Two absent days, matching the legend's "Absent day" swatch.
  absent: index === 12 || index === 20,
}));

export const attendanceSummaryTiles = [
  { id: 'late', icon: 'ti ti-clock-exclamation', value: '3 Late', label: 'students today' },
  { id: 'leave', icon: 'ti ti-calendar-off', value: '3 Leave', label: 'requests pending' },
];

export const lateStudents: InfoRow[] = [
  { id: 'ls1', avatar: 'assets/img/students/student-07.jpg', title: 'Aaron Kessler', subtitle: 'Grade III-A · arrived 08:12 AM', endBadge: { label: '+12m', className: 'badge-soft-warning' } },
  { id: 'ls2', avatar: 'assets/img/students/student-09.jpg', title: 'Daniel Josh', subtitle: 'Grade IV-B · arrived 08:07 AM', endBadge: { label: '+7m', className: 'badge-soft-warning' } },
  { id: 'ls3', avatar: 'assets/img/students/student-03.jpg', title: 'Sophia Ray', subtitle: 'Grade V-A · arrived 08:05 AM', endBadge: { label: '+5m', className: 'badge-soft-warning' } },
];

export interface LeaveRequest {
  id: string;
  avatar: string;
  name: string;
  detail: string;
}

export const leaveRequests: LeaveRequest[] = [
  { id: 'lr1', avatar: 'assets/img/students/student-01.jpg', name: 'Janet Daniel', detail: 'Sick leave · 22–23 Jul' },
  { id: 'lr2', avatar: 'assets/img/students/student-11.jpg', name: 'Ella Simpson', detail: 'Family function · 24 Jul' },
  { id: 'lr3', avatar: 'assets/img/students/student-13.jpg', name: 'Marcus Lee', detail: 'Medical · 25 Jul' },
];

/* --------------------------- Parent communication -------------------------- */

export const communicationStats = [
  { id: 'unread', value: '9', label: 'Unread', borderClass: 'border-danger' },
  { id: 'meetings', value: '3', label: 'Meeting requests', borderClass: 'border-warning' },
  { id: 'response', value: '94%', label: 'Response rate', borderClass: 'border-success' },
  { id: 'reply', value: '12m', label: 'Avg reply', borderClass: 'border-info' },
];

export const recentMessages: InfoRow[] = [
  { id: 'rm1', avatar: 'assets/img/profiles/avatar-27.jpg', title: 'Robert Daniel', titleBadge: { label: 'Parent', className: 'badge-soft-info' }, subtitleUnread: true, subtitle: "Thank you for the update on Janet's progress…", endBadge: { label: '', className: 'badge-soft-danger status-dot-inline' }, endNote: '2m' },
  { id: 'rm2', avatar: 'assets/img/profiles/avatar-23.jpg', title: 'Sarah Michael', titleBadge: { label: 'Meeting', className: 'badge-soft-warning' }, subtitleUnread: true, subtitle: 'Requesting a meeting regarding homework…', endBadge: { label: '', className: 'badge-soft-danger status-dot-inline' }, endNote: '15m' },
  { id: 'rm3', avatar: 'assets/img/profiles/avatar-25.jpg', title: 'David Karen', subtitleUnread: true, subtitle: "Will Emeley's fee reminder affect exams?", endNote: '1h' },
  { id: 'rm4', avatar: 'assets/img/profiles/avatar-19.jpg', title: 'Linda Kessler', titleBadge: { label: 'Urgent', className: 'badge-soft-danger' }, subtitleUnread: true, subtitle: 'Aaron will be absent for the unit test…', endBadge: { label: '', className: 'badge-soft-danger status-dot-inline' }, endNote: '3h' },
  { id: 'rm5', avatar: 'assets/img/profiles/avatar-21.jpg', title: 'Priya Raman', subtitleUnread: true, subtitle: 'Could you share the revision plan for Term II?', endNote: '1d' },
];

export const announcements: InfoRow[] = [
  { id: 'an1', icon: 'ti ti-confetti', iconClass: 'bg-purple-transparent', title: 'Annual Science Fair', subtitle: 'Sent to all Grade VI parents · 2 days ago', endBadge: { label: 'Sent', className: 'badge-soft-success' } },
  { id: 'an2', icon: 'ti ti-calendar-event', iconClass: 'bg-teal-transparent', title: 'PTA Meeting — 28 Jul', subtitle: 'Grade III-A parents · 34 of 42 confirmed', endBadge: { label: 'Sent', className: 'badge-soft-success' } },
  { id: 'an3', icon: 'ti ti-file-text', iconClass: 'bg-warning-transparent', title: 'Term II Report Cards', subtitle: 'Scheduled for 30 Jul · 42 recipients', endBadge: { label: 'Draft', className: 'badge-soft-warning' } },
];

/* ----------------------------- Student insights ---------------------------- */

export const topPerformers: InfoRow[] = [
  { id: 'tp1', avatar: 'assets/img/students/student-01.jpg', title: 'Janet Daniel', subtitle: 'Grade III-A · 96%', endBadge: { label: 'Rank 1', className: 'badge-soft-success' } },
  { id: 'tp2', avatar: 'assets/img/students/student-13.jpg', title: 'Marcus Lee', subtitle: 'Grade III-A · 96%', endBadge: { label: 'Rank 2', className: 'badge-soft-success' } },
];

export const studentsAtRisk: InfoRow[] = [
  { id: 'sr1', avatar: 'assets/img/students/student-07.jpg', title: 'Aaron Kessler', subtitle: 'Grade III-A · academic + attendance', endBadge: { label: 'Risk', className: 'badge-soft-danger' } },
];

export const lowAttendance: InfoRow[] = [
  { id: 'la1', avatar: 'assets/img/students/student-09.jpg', title: 'Daniel Josh', subtitle: '79% · below threshold', endBadge: { label: '79%', className: 'badge-soft-warning' } },
];

export const behaviorAlerts: InfoRow[] = [
  { id: 'ba1', icon: 'ti ti-trophy', iconClass: 'bg-purple-transparent', title: 'Joann Michael', subtitle: 'Won Math Olympiad — Gold', endBadge: { label: '🏅', className: 'badge-soft-success' } },
  { id: 'ba2', icon: 'ti ti-cake', iconClass: 'bg-pink-transparent', title: 'Ella Simpson', subtitle: 'Birthday today 🎂' },
];

/* ------------------------------- Achievements ------------------------------ */

export const achievements = [
  { id: 'rated', icon: 'ti ti-trophy', iconClass: 'bg-warning text-white', title: 'Top Rated', subtitle: 'Teacher · 4.9★' },
  { id: 'attendance', icon: 'ti ti-calendar-check', iconClass: 'bg-success text-white', title: 'Best Attendance', subtitle: '3 months' },
  { id: 'recognition', icon: 'ti ti-star', iconClass: 'bg-purple text-white', title: 'Recognition', subtitle: 'July 2025' },
  { id: 'courses', icon: 'ti ti-school', iconClass: 'bg-info text-white', title: 'Courses', subtitle: '12 completed' },
  { id: 'certificates', icon: 'ti ti-certificate', iconClass: 'bg-teal text-white', title: 'Certificates', subtitle: '8 earned' },
  { id: 'performance', icon: 'ti ti-flame', iconClass: 'bg-pink text-white', title: 'Performance', subtitle: 'Top 6%' },
];

/* --------------------------------- Calendar -------------------------------- */

export interface CalendarEvent {
  id: string;
  day: string;
  month: string;
  dateClass: string;
  title: string;
  detail: string;
  badge?: { label: string; className: string };
}

export const calendarEvents: CalendarEvent[] = [
  { id: 'ce1', day: '21', month: 'Jul', dateClass: 'bg-primary-transparent', title: 'Staff Meeting', detail: '03:00 PM · Conference Hall', badge: { label: 'Today', className: 'badge-soft-warning' } },
  { id: 'ce2', day: '25', month: 'Jul', dateClass: 'bg-purple-transparent', title: 'Chapter 6 Assessment', detail: 'Grade V-A · Exam' },
  { id: 'ce3', day: '27', month: 'Jul', dateClass: 'bg-success-transparent', title: 'Annual Science Fair', detail: 'School Activity · Auditorium' },
  { id: 'ce4', day: '28', month: 'Jul', dateClass: 'bg-info-transparent', title: 'PTA Meeting', detail: 'Grade IV parents · 04:00 PM' },
  { id: 'ce5', day: '01', month: 'Aug', dateClass: 'bg-danger-transparent', title: 'Independence Day', detail: 'Holiday · School closed' },
  { id: 'ce6', day: '04', month: 'Aug', dateClass: 'bg-warning-transparent', title: 'Unit III Exam — Maths', detail: 'Grade V-A · 09:00 AM' },
];

/* ----------------------------- Activity timeline --------------------------- */

export interface TimelineEntry {
  id: string;
  icon: string;
  iconClass: string;
  title: string;
  detail: string;
  time: string;
}

export const activityTimeline: TimelineEntry[] = [
  { id: 't1', icon: 'ti ti-clipboard-check', iconClass: 'bg-success-transparent', title: 'Attendance submitted', detail: 'Grade III-A · Mathematics', time: '09:05' },
  { id: 't2', icon: 'ti ti-file-plus', iconClass: 'bg-primary-transparent', title: 'Assignment created', detail: 'Algebra Worksheet 4 · Grade V-A', time: '08:40' },
  { id: 't3', icon: 'ti ti-award', iconClass: 'bg-purple-transparent', title: 'Marks published', detail: 'Unit Test II · Grade III-A', time: 'Yst' },
  { id: 't4', icon: 'ti ti-send', iconClass: 'bg-pink-transparent', title: 'Message sent', detail: 'To Robert Daniel (Parent)', time: 'Yst' },
  { id: 't5', icon: 'ti ti-calendar-plus', iconClass: 'bg-info-transparent', title: 'Meeting scheduled', detail: 'PTA · Grade IV · 28 Jul', time: 'Yst' },
  { id: 't6', icon: 'ti ti-calendar-check', iconClass: 'bg-teal-transparent', title: 'Leave approved', detail: 'Student leave · Emeley Karen', time: '2d' },
  { id: 't7', icon: 'ti ti-upload', iconClass: 'bg-warning-transparent', title: 'Study material uploaded', detail: 'Chemistry notes · Grade VI-A', time: '2d' },
  { id: 't8', icon: 'ti ti-speakerphone', iconClass: 'bg-info-transparent', title: 'Announcement posted', detail: 'Annual Science Fair · all parents', time: '3d' },
];

/* ------------------------------- Notifications ----------------------------- */

export const notifications: InfoRow[] = [
  { id: 'n1', icon: 'ti ti-urgent', iconClass: 'bg-danger-transparent', title: 'Urgent: Fire drill 11:30 AM', subtitle: 'All staff to assembly ground' },
  { id: 'n2', icon: 'ti ti-user-star', iconClass: 'bg-primary-transparent', title: 'Message from Principal', subtitle: 'Re: term-end grade submission' },
  { id: 'n3', icon: 'ti ti-news', iconClass: 'bg-info-transparent', title: 'School Circular #48', subtitle: 'Updated exam calendar released' },
  { id: 'n4', icon: 'ti ti-hexagonal-prism-plus', iconClass: 'bg-purple-transparent', title: 'Exam alert', subtitle: 'Chemistry test Friday — prepare marks sheet' },
  { id: 'n5', icon: 'ti ti-calendar-time', iconClass: 'bg-warning-transparent', title: 'Meeting reminder', subtitle: 'Staff meeting today 03:00 PM' },
  { id: 'n6', icon: 'ti ti-settings', iconClass: 'bg-teal-transparent', title: 'System', subtitle: 'Gradebook backup completed' },
];
