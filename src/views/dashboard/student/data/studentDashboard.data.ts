import type { InfoRow } from '../../shared/types';

/** Every dialog on this page, keyed by the id used in the source markup. */
export type StudentModalId =
  | 'timetable'
  | 'assign'
  | 'results'
  | 'pay'
  | 'message'
  | 'leave'
  | 'join'
  | 'notes'
  | 'feedback'
  | 'goal'
  | 'meeting'
  | 'renew'
  | 'track'
  | 'library'
  | 'idcard'
  | 'examSchedule';

/** Shared row defaults — the student page tints every info row. */
const TERTIARY = 'bg-body-tertiary';
const ICON_WRAP = 'info-list-icon';
const ICON_MUTED = 'bg-body-secondary text-body-secondary';
const ICON_DANGER = 'bg-danger-transparent text-danger';

/** Builds an icon row with this page's defaults applied. */
function iconRow(
  id: string,
  icon: string,
  title: string,
  subtitle: string,
  extra: Partial<InfoRow> = {},
): InfoRow {
  return {
    id,
    icon,
    iconWrapClass: ICON_WRAP,
    iconClass: ICON_MUTED,
    itemClass: TERTIARY,
    title,
    subtitle,
    ...extra,
  };
}

/* ----------------------------------- Hero ---------------------------------- */

export const studentProfile = {
  name: 'Janet Daniel',
  photo: 'assets/img/students/student-01.jpg',
  greeting: 'Welcome back 👋',
  chips: [
    { icon: 'ti ti-id-badge-2', label: 'AD1256589' },
    { icon: 'ti ti-school', label: 'Class III-A' },
    { icon: 'ti ti-list-numbers', label: 'Roll 35013' },
    { icon: 'ti ti-flag', label: 'Red House' },
    { icon: 'ti ti-calendar', label: '2024-26' },
  ],
  badges: [
    { icon: 'ti ti-award', label: 'Scholarship 15%', className: 'bg-warning-transparent text-warning' },
    { icon: 'ti ti-bus', label: 'Transport · Route 12', className: 'bg-info-transparent text-info' },
    { icon: 'ti ti-building', label: 'Hostel · H-204', className: 'bg-purple-transparent text-purple' },
  ],
};

export interface HeroStat {
  id: string;
  icon?: string;
  iconClass?: string;
  value: string;
  valueSuffix?: string;
  label: string;
  ring?: number;
  ringClass?: string;
}

export const heroStats: HeroStat[] = [
  { id: 'attendance', icon: 'ti ti-calendar-check', iconClass: 'bg-success-transparent text-success', value: '92%', label: 'Attendance' },
  { id: 'gpa', icon: 'ti ti-award', iconClass: 'bg-primary-transparent text-primary', value: '8.8/10', label: 'Current GPA' },
  { id: 'ai', icon: 'ti ti-sparkles', iconClass: 'bg-purple-transparent text-purple', value: '91', label: 'AI Learning Score' },
  { id: 'profile', ring: 86, ringClass: 'text-teal', value: 'Profile', label: 'Completion' },
  { id: 'rank', icon: 'ti ti-medal', iconClass: 'bg-warning-transparent text-warning', value: 'Rank 3', valueSuffix: 'rd', label: 'of 42' },
  { id: 'books', icon: 'ti ti-books', iconClass: 'bg-info-transparent text-info', value: '3', label: 'Library Books' },
];

export interface QuickAction {
  id: string;
  icon: string;
  label: string;
  primary?: boolean;
  modal?: StudentModalId;
  /** Route target, for the one action that navigates instead of opening a dialog. */
  to?: string;
}

export const quickActions: QuickAction[] = [
  { id: 'timetable', icon: 'ti ti-table', label: 'View Timetable', primary: true, modal: 'timetable' },
  { id: 'assignments', icon: 'ti ti-file-description', label: 'Assignments', modal: 'assign' },
  { id: 'homework', icon: 'ti ti-book', label: 'Homework' },
  { id: 'results', icon: 'ti ti-certificate', label: 'Exam Results', modal: 'results' },
  { id: 'library', icon: 'ti ti-books', label: 'Library', modal: 'library' },
  { id: 'pay', icon: 'ti ti-cash', label: 'Pay Fees', modal: 'pay' },
  { id: 'message', icon: 'ti ti-message', label: 'Message Teacher', modal: 'message' },
  { id: 'leave', icon: 'ti ti-calendar-off', label: 'Request Leave', modal: 'leave' },
];

/* ------------------------------- KPI overview ------------------------------ */

export interface KpiStat {
  id: string;
  icon: string;
  iconClass: string;
  delta: string;
  deltaIcon: string;
  deltaDirection: 'up' | 'down' | 'flat';
  value: string;
  valueSuffix?: string;
  label: string;
  modal: StudentModalId;
}

export const kpiStats: KpiStat[] = [
  { id: 'gpa', icon: 'ti ti-award', iconClass: 'bg-primary-transparent text-primary', delta: '0.3', deltaIcon: 'ti ti-arrow-up', deltaDirection: 'up', value: '8.8', valueSuffix: '/10', label: 'Current GPA', modal: 'results' },
  { id: 'attendance', icon: 'ti ti-calendar-check', iconClass: 'bg-success-transparent text-success', delta: '3%', deltaIcon: 'ti ti-arrow-up', deltaDirection: 'up', value: '92', valueSuffix: '%', label: 'Attendance', modal: 'timetable' },
  { id: 'pending', icon: 'ti ti-file-description', iconClass: 'bg-warning-transparent text-warning', delta: '1', deltaIcon: 'ti ti-arrow-down', deltaDirection: 'down', value: '4', label: 'Assignments Pending', modal: 'assign' },
  { id: 'homework', icon: 'ti ti-book', iconClass: 'bg-info-transparent text-info', delta: '0', deltaIcon: 'ti ti-minus', deltaDirection: 'flat', value: '2', label: 'Homework Due', modal: 'assign' },
  { id: 'exams', icon: 'ti ti-hexagonal-prism-plus', iconClass: 'bg-purple-transparent text-purple', delta: '2', deltaIcon: 'ti ti-arrow-up', deltaDirection: 'up', value: '3', label: 'Upcoming Exams', modal: 'results' },
  { id: 'books', icon: 'ti ti-books', iconClass: 'bg-teal-transparent text-teal', delta: '0', deltaIcon: 'ti ti-minus', deltaDirection: 'flat', value: '3', label: 'Library Books', modal: 'library' },
  { id: 'fee', icon: 'ti ti-cash', iconClass: 'bg-danger-transparent text-danger', delta: 'Due', deltaIcon: 'ti ti-arrow-down', deltaDirection: 'down', value: '$2000', label: 'Fee Due', modal: 'pay' },
  { id: 'achievements', icon: 'ti ti-trophy', iconClass: 'bg-warning-transparent text-warning', delta: '2', deltaIcon: 'ti ti-arrow-up', deltaDirection: 'up', value: '12', label: 'Achievements', modal: 'idcard' },
  { id: 'rank', icon: 'ti ti-medal', iconClass: 'bg-primary-transparent text-primary', delta: '1', deltaIcon: 'ti ti-arrow-up', deltaDirection: 'up', value: '3', valueSuffix: 'rd', label: 'Class Rank', modal: 'results' },
  { id: 'progress', icon: 'ti ti-chart-line', iconClass: 'bg-success-transparent text-success', delta: '6%', deltaIcon: 'ti ti-arrow-up', deltaDirection: 'up', value: '78', valueSuffix: '%', label: 'Learning Progress', modal: 'assign' },
];

/* -------------------------------- Schedule --------------------------------- */

export const scheduleSummary = [
  { id: 'completed', value: '1', label: 'Completed', borderClass: 'border-success' },
  { id: 'progress', value: '1', label: 'In Progress', borderClass: 'border-danger' },
  { id: 'upcoming', value: '5', label: 'Upcoming', borderClass: 'border-warning' },
  { id: 'time', value: '5h 15m', label: 'Class Time', borderClass: 'border-primary' },
];

export interface Lesson {
  id: string;
  time: string;
  duration: string;
  subject: string;
  borderClass: string;
  teacher: string;
  teacherIcon: string;
  room: string;
  roomIcon: string;
  status: { label: string; className: string; icon?: string };
  /** The live lesson offers a Join button instead of the notes shortcut. */
  join?: boolean;
  /** The lunch break row has no trailing action at all. */
  noAction?: boolean;
}

export const todaysLessons: Lesson[] = [
  { id: 'l1', time: '08:00', duration: '45 min', subject: 'Mathematics', borderClass: 'border-success', teacher: 'Ms. Teresa Susan', teacherIcon: 'ti ti-user', room: 'Room 204', roomIcon: 'ti ti-door', status: { label: 'Done', className: 'badge badge-soft-secondary', icon: 'ti ti-check' } },
  { id: 'l2', time: '09:00', duration: '45 min', subject: 'Science — Physics', borderClass: 'border-danger', teacher: 'Mr. John Doe', teacherIcon: 'ti ti-user', room: 'Lab 02', roomIcon: 'ti ti-door', status: { label: 'Live', className: 'badge badge-danger' }, join: true },
  { id: 'l3', time: '10:15', duration: '45 min', subject: 'English', borderClass: 'border-warning', teacher: 'Ms. Rita Owen', teacherIcon: 'ti ti-user', room: 'Room 108', roomIcon: 'ti ti-door', status: { label: 'Next', className: 'badge badge-soft-warning', icon: 'ti ti-clock' } },
  { id: 'l4', time: '11:15', duration: '45 min', subject: 'Geography', borderClass: 'border-info', teacher: 'Mr. Alan Poe', teacherIcon: 'ti ti-user', room: 'Room 110', roomIcon: 'ti ti-door', status: { label: '11:15', className: 'badge badge-soft-warning', icon: 'ti ti-clock' } },
  { id: 'l5', time: '12:00', duration: '45 min', subject: 'Lunch Break', borderClass: 'border-teal', teacher: 'Dining Hall', teacherIcon: 'ti ti-tools-kitchen-2', room: 'All classes', roomIcon: 'ti ti-users', status: { label: 'Break', className: 'badge badge-soft-secondary', icon: 'ti ti-coffee' }, noAction: true },
  { id: 'l6', time: '13:00', duration: '45 min', subject: 'Computer Science', borderClass: 'border-purple', teacher: 'Ms. Nina Patel', teacherIcon: 'ti ti-user', room: 'Lab 01', roomIcon: 'ti ti-door', status: { label: '13:00', className: 'badge badge-soft-warning', icon: 'ti ti-clock' } },
  { id: 'l7', time: '14:00', duration: '45 min', subject: 'Physical Education', borderClass: 'border-info', teacher: 'Mr. Dan Ruiz', teacherIcon: 'ti ti-user', room: 'Playground', roomIcon: 'ti ti-ball-football', status: { label: '14:00', className: 'badge badge-soft-warning', icon: 'ti ti-clock' } },
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
  { id: 'prediction', icon: 'ti ti-trending-up', iconClass: 'bg-success-transparent text-success', title: 'Performance Prediction +4%', description: 'GPA likely to rise to 9.2 next term' },
  { id: 'risk', icon: 'ti ti-alert-triangle', iconClass: 'bg-warning-transparent text-warning', title: 'Attendance Risk: Low', description: '92% — keep above 90% to stay on track' },
  { id: 'strong', icon: 'ti ti-star', iconClass: 'bg-primary-transparent text-primary', title: 'Strong Subjects', description: 'Mathematics & Science (A+)' },
  { id: 'weak', icon: 'ti ti-target-arrow', iconClass: 'bg-danger-transparent text-danger', title: 'Weak Topics', description: 'Essay writing, Reading comprehension' },
  { id: 'suggestion', icon: 'ti ti-bulb', iconClass: 'bg-info-transparent text-info', title: 'Study Suggestion', description: '30 min daily reading to boost English' },
  { id: 'window', icon: 'ti ti-clock-hour-4', iconClass: 'bg-purple-transparent text-purple', title: 'Best Study Window', description: 'You retain most between 6–8 PM' },
  { id: 'readiness', icon: 'ti ti-hexagonal-prism-plus', iconClass: 'bg-teal-transparent text-teal', title: 'Exam Readiness: 72%', description: 'Revise Science chapter 4 before Friday' },
];

/* --------------------------- Academic performance -------------------------- */

export const gpaFacts = [
  { id: 'rank', value: '3', suffix: 'rd', label: 'Class Rank', borderClass: 'border-warning' },
  { id: 'avg', value: '84', suffix: '%', label: 'Avg Marks', borderClass: 'border-primary' },
  { id: 'predicted', value: '9.2', label: 'Predicted', borderClass: 'border-success' },
  { id: 'passed', value: '5', suffix: '/5', label: 'Subjects Passed', borderClass: 'border-info' },
];

export const gradeSpread = [
  { id: 'aplus', label: 'A+ · 1', width: '20%', colorClass: 'bg-success', title: 'A+ · 1 subject' },
  { id: 'a', label: 'A · 2', width: '40%', colorClass: 'bg-primary', title: 'A · 2 subjects' },
  { id: 'bplus', label: 'B+ · 1', width: '20%', colorClass: 'bg-info', title: 'B+ · 1 subject' },
  { id: 'cplus', label: 'C+ · 1', width: '20%', colorClass: 'bg-warning', title: 'C+ · 1 subject' },
];

export interface SubjectPerformance {
  id: string;
  name: string;
  teacher: string;
  icon: string;
  borderClass: string;
  iconClass: string;
  barClass: string;
  percent: string;
  /** Class-average marker position along the bar. */
  average: string;
  grade: string;
  gradeClass: string;
  delta: string;
  deltaIcon: string;
  deltaClass: string;
}

export const subjectPerformance: SubjectPerformance[] = [
  { id: 'maths', name: 'Mathematics', teacher: 'Ms. Teresa Susan', icon: 'ti ti-math-symbols', borderClass: 'border-success', iconClass: 'bg-success-transparent text-success', barClass: 'bg-success', percent: '94', average: '82%', grade: 'A+', gradeClass: 'bg-success-transparent text-success', delta: '3', deltaIcon: 'ti ti-arrow-up', deltaClass: 'text-success' },
  { id: 'science', name: 'Science', teacher: 'Mr. John Doe', icon: 'ti ti-flask', borderClass: 'border-success', iconClass: 'bg-success-transparent text-success', barClass: 'bg-success', percent: '91', average: '79%', grade: 'A', gradeClass: 'bg-success-transparent text-success', delta: '2', deltaIcon: 'ti ti-arrow-up', deltaClass: 'text-success' },
  { id: 'computer', name: 'Computer Science', teacher: 'Ms. Nina Patel', icon: 'ti ti-code', borderClass: 'border-purple', iconClass: 'bg-purple-transparent text-purple', barClass: 'bg-purple', percent: '89', average: '84%', grade: 'A', gradeClass: 'bg-purple-transparent text-purple', delta: '5', deltaIcon: 'ti ti-arrow-up', deltaClass: 'text-success' },
  { id: 'geography', name: 'Geography', teacher: 'Mr. Alan Poe', icon: 'ti ti-map-2', borderClass: 'border-info', iconClass: 'bg-info-transparent text-info', barClass: 'bg-info', percent: '85', average: '80%', grade: 'B+', gradeClass: 'bg-info-transparent text-info', delta: '0', deltaIcon: 'ti ti-minus', deltaClass: 'text-muted' },
  { id: 'english', name: 'English', teacher: 'Ms. Rita Owen', icon: 'ti ti-book', borderClass: 'border-warning', iconClass: 'bg-warning-transparent text-warning', barClass: 'bg-warning', percent: '68', average: '76%', grade: 'C+', gradeClass: 'bg-warning-transparent text-warning', delta: '4', deltaIcon: 'ti ti-arrow-down', deltaClass: 'text-danger' },
];

export const performanceSummary = [
  { id: 'strongest', key: 'Strongest', value: 'Mathematics', borderClass: 'border-success' },
  { id: 'needs', key: 'Needs work', value: 'English', borderClass: 'border-warning' },
  { id: 'above', key: 'Above class avg', value: '4 of 5', borderClass: 'border-primary' },
  { id: 'change', key: 'Term change', value: '+1.2%', borderClass: 'border-info' },
];

export const monthlyProgress = [
  { id: 'aug', value: '74', label: 'Aug', barClass: 'bg-primary', active: false },
  { id: 'sep', value: '80', label: 'Sep', barClass: 'bg-primary', active: false },
  { id: 'oct', value: '83', label: 'Oct', barClass: 'bg-primary', active: false },
  { id: 'nov', value: '86', label: 'Nov', barClass: 'bg-primary', active: false },
  { id: 'dec', value: '88', label: 'Dec', barClass: 'bg-purple', active: true },
];

export const trendSparklinePaths = {
  area: 'M0,42 L60,33 L120,28 L180,22 L240,16 L300,10 L300,60 L0,60 Z',
  line: 'M0,42 L60,33 L120,28 L180,22 L240,16 L300,10',
};

export const progressHighlights = [
  { id: 'best', icon: 'ti ti-arrow-up-right', borderClass: 'border-success', iconClass: 'bg-success-transparent text-success', title: 'Best month', detail: 'December · 88% average', badge: 'Peak', badgeClass: 'badge-soft-success' },
  { id: 'jump', icon: 'ti ti-rocket', borderClass: 'border-purple', iconClass: 'bg-purple-transparent text-purple', title: 'Biggest jump', detail: 'Computer Science · +5 points', badge: '+5', badgeClass: 'badge-soft-info' },
  { id: 'consistency', icon: 'ti ti-activity', borderClass: 'border-primary', iconClass: 'bg-primary-transparent text-primary', title: 'Consistency', detail: 'Improved every month since Aug', badge: '5/5', badgeClass: 'badge-soft-success' },
];

/* -------------------------------- Assignments ------------------------------ */

export interface AssignmentTab {
  id: string;
  label: string;
  count?: string;
  rows: InfoRow[];
  /** Rows in these tabs carry an Upload button. */
  upload?: boolean;
  /** Rows in this tab carry a Feedback button. */
  feedback?: boolean;
}

export const assignmentTabs: AssignmentTab[] = [
  {
    id: 'pending',
    label: 'Pending',
    count: '4',
    upload: true,
    rows: [
      iconRow('ap1', 'ti ti-math-symbols', 'Algebra Worksheet 4', 'Mathematics · Ms. Teresa Susan', { endBadge: { label: 'Due today', className: 'badge-soft-warning' } }),
      iconRow('ap2', 'ti ti-book', 'Essay: My Favourite Season', 'English · Ms. Rita Owen', { endBadge: { label: 'Tomorrow', className: 'badge-soft-warning' } }),
      iconRow('ap3', 'ti ti-map-2', 'Map Study — Continents', 'Geography · Mr. Alan Poe', { endBadge: { label: '2 days', className: 'badge-soft-warning' } }),
      iconRow('ap4', 'ti ti-code', 'Scratch Animation Project', 'Computer · Ms. Nina Patel', { endBadge: { label: '3 days', className: 'badge-soft-warning' } }),
      iconRow('ap5', 'ti ti-flask', 'Plant Observation Journal', 'Science · Mr. John Doe', { endBadge: { label: '4 days', className: 'badge-soft-info' } }),
      iconRow('ap6', 'ti ti-books', 'Reading Log — Week 4', 'English · Ms. Rita Owen', { endBadge: { label: '5 days', className: 'badge-soft-info' } }),
    ],
  },
  {
    id: 'submitted',
    label: 'Submitted',
    rows: [
      iconRow('as1', 'ti ti-checkbox', 'Fractions Practice Set', 'Mathematics · submitted 2 days ago', { endBadge: { label: 'Submitted', className: 'badge-soft-success' } }),
      iconRow('as2', 'ti ti-checkbox', 'Plant Life Cycle Diagram', 'Science · submitted 3 days ago', { endBadge: { label: 'Submitted', className: 'badge-soft-success' } }),
      iconRow('as3', 'ti ti-checkbox', 'Continents Quiz Sheet', 'Geography · submitted 4 days ago', { endBadge: { label: 'Submitted', className: 'badge-soft-success' } }),
      iconRow('as4', 'ti ti-checkbox', 'Poem Recitation Audio', 'English · submitted 5 days ago', { endBadge: { label: 'Submitted', className: 'badge-soft-success' } }),
      iconRow('as5', 'ti ti-checkbox', 'Scratch Sprite Exercise', 'Computer · submitted 6 days ago', { endBadge: { label: 'Submitted', className: 'badge-soft-success' } }),
    ],
  },
  {
    id: 'overdue',
    label: 'Overdue',
    upload: true,
    rows: [
      iconRow('ao1', 'ti ti-alert-triangle', 'Reading Log — Week 3', 'English · 1 day overdue', { iconClass: ICON_DANGER, itemClass: `border-danger ${TERTIARY}`, endBadge: { label: 'Overdue', className: 'badge-soft-danger' } }),
      iconRow('ao2', 'ti ti-alert-triangle', 'Leaf Collection Sheet', 'Science · 2 days overdue', { iconClass: ICON_DANGER, itemClass: `border-danger ${TERTIARY}`, endBadge: { label: 'Overdue', className: 'badge-soft-danger' } }),
      iconRow('ao3', 'ti ti-clock-exclamation', 'Times Table Drill 7', 'Mathematics · grace period ends today', { endBadge: { label: 'Grace', className: 'badge-soft-warning' } }),
      iconRow('ao4', 'ti ti-info-circle', 'Late submission policy', '5% deducted per day, up to 3 days'),
    ],
  },
  {
    id: 'graded',
    label: 'Graded',
    feedback: true,
    rows: [
      iconRow('ag1', 'ti ti-award', 'Unit Test II — Maths', 'Grade A+ · 94%'),
      iconRow('ag2', 'ti ti-award', 'Science Quiz 3', 'Grade A · 89%'),
      iconRow('ag3', 'ti ti-award', 'Map Skills Worksheet', 'Geography · Grade B+ · 85%'),
      iconRow('ag4', 'ti ti-award', 'Book Report — Week 2', 'English · Grade C+ · 68%'),
      iconRow('ag5', 'ti ti-award', 'Scratch Sprite Exercise', 'Computer · Grade A · 90%'),
    ],
  },
  {
    id: 'deadlines',
    label: 'Deadlines',
    rows: [
      iconRow('ad1', 'ti ti-calendar-due', 'Term Project — Solar System', 'Science · Group work', { endBadge: { label: '30 Jul', className: 'badge-soft-info' } }),
      iconRow('ad2', 'ti ti-calendar-due', 'Book Review Submission', 'English · Library book', { endBadge: { label: '02 Aug', className: 'badge-soft-info' } }),
      iconRow('ad3', 'ti ti-calendar-due', 'Scratch Game Prototype', 'Computer · Individual', { endBadge: { label: '05 Aug', className: 'badge-soft-info' } }),
      iconRow('ad4', 'ti ti-calendar-due', 'Field Trip Report', 'Geography · after 08 Aug visit', { endBadge: { label: '12 Aug', className: 'badge-soft-info' } }),
      iconRow('ad5', 'ti ti-bell-ringing', 'Reminders are on', "You'll be alerted 2 days before each deadline"),
    ],
  },
];

/** The two policy/reminder rows render in the compact variant. */
export const compactAssignmentRowIds = ['ao4', 'ad5'];

/* ------------------------------- Exam center ------------------------------- */

export const examCountdown = {
  title: 'Science — Term Test',
  detail: 'Fri, 25 Jul · Lab 01 · 09:00 AM',
  days: '3',
};

export const upcomingExams: InfoRow[] = [
  iconRow('ue1', 'ti ti-flask', 'Science — Term Test', 'Lab 01 · 09:00 AM', { endBadge: { label: 'Fri', className: 'badge-soft-warning' } }),
  iconRow('ue2', 'ti ti-math-symbols', 'Mathematics — Unit III', 'Room 108 · 10:00 AM', { endBadge: { label: '26 Jul', className: 'badge-soft-warning' } }),
  iconRow('ue3', 'ti ti-book', 'English — Literature', 'Room 108 · 11:30 AM', { endBadge: { label: '29 Jul', className: 'badge-soft-warning' } }),
];

export const latestResults: InfoRow[] = [
  iconRow('lr1', 'ti ti-trophy', 'Unit Test II', '460 / 500 · Grade A+'),
  iconRow('lr2', 'ti ti-flask', 'Science Quiz 3', '89 / 100 · Grade A'),
];

/* ----------------------------- Attendance centre --------------------------- */

export const attendanceSplit = [
  { id: 'today', value: '100%', label: 'Today', percent: 100, barClass: 'bg-success' },
  { id: 'week', value: '92%', label: 'This Week', percent: 92, barClass: 'bg-primary' },
  { id: 'month', value: '91%', label: 'This Month', percent: 91, barClass: 'bg-info' },
];

/**
 * 30-day heatmap. The template uses `l1`–`l4` intensity classes and `ab` for an
 * absent day, so the cells are stored as those class names directly.
 */
export const attendanceHeatCells: string[] = [
  'l4', 'l3', 'l4', 'l2', 'ab', 'l3', 'l4', 'l4', 'l2', 'l3',
  'l4', 'l1', 'l3', 'l4', 'l4', 'ab', 'l2', 'l4', 'l3', 'l4',
  'l3', 'l4', 'l4', 'l2', 'l3', 'l4', 'l1', 'l4', 'l3', 'l4',
];

export const attendanceSummaryTiles: InfoRow[] = [
  iconRow('at1', 'ti ti-clock-exclamation', '2 Late', 'arrivals this month'),
  iconRow('at2', 'ti ti-calendar-off', '3 Leaves', 'taken · sick/family'),
];

export const subjectAttendance = [
  { id: 'maths', name: 'Mathematics', percent: '97%', width: '97%', barClass: 'bg-success', ratio: '34/35', ratioClass: 'bg-success-transparent text-success' },
  { id: 'science', name: 'Science', percent: '94%', width: '94%', barClass: 'bg-success', ratio: '33/35', ratioClass: 'bg-success-transparent text-success' },
  { id: 'geography', name: 'Geography', percent: '91%', width: '91%', barClass: 'bg-info', ratio: '32/35', ratioClass: 'bg-info-transparent text-info' },
  { id: 'english', name: 'English', percent: '86%', width: '86%', barClass: 'bg-warning', ratio: '30/35', ratioClass: 'bg-warning-transparent text-warning' },
];

/* -------------------------------- Fee summary ------------------------------ */

export const feeLegend = [
  { id: 'total', label: 'Total Fees', value: '$9,000', keyClass: 'bg-primary' },
  { id: 'paid', label: 'Paid', value: '$6,500', keyClass: 'bg-success' },
  { id: 'pending', label: 'Pending', value: '$2,000', keyClass: 'bg-warning' },
  { id: 'overdue', label: 'Overdue', value: '$500', keyClass: 'bg-danger' },
];

/** Donut arc lengths, taken verbatim from the SVG in the template. */
export const feeDonutSegments = [
  { id: 'paid', className: 'text-success', dashArray: '242 339.3', dashOffset: '0' },
  { id: 'pending', className: 'text-warning', dashArray: '72 339.3', dashOffset: '-245' },
  { id: 'overdue', className: 'text-danger', dashArray: '16 339.3', dashOffset: '-321' },
];

export const feeDiscounts = [
  { id: 'scholarship', icon: 'ti ti-award', label: 'Scholarship 15%', className: 'badge-soft-success' },
  { id: 'sibling', icon: 'ti ti-discount', label: 'Sibling 5%', className: 'badge-soft-info' },
];

export const paymentHistory: InfoRow[] = [
  iconRow('ph1', 'ti ti-circle-check', 'Term I Tuition', 'Paid 05 Sep · Card ••••4521'),
  iconRow('ph2', 'ti ti-alert-circle', 'Transport Fee — Q3', 'Overdue since 10 Jul', { iconClass: ICON_DANGER, itemClass: `border-danger ${TERTIARY}`, endBadge: { label: '$500', className: 'badge-soft-danger' } }),
];

/* ----------------------------- Learning progress --------------------------- */

export const learningProgress = [
  { id: 'course', icon: 'ti ti-school', iconClass: 'bg-primary-transparent text-primary', label: 'Course Completion', value: '78%', width: '78%', barClass: 'bg-primary' },
  { id: 'reading', icon: 'ti ti-book', iconClass: 'bg-success-transparent text-success', label: 'Reading Progress', value: '64%', width: '64%', barClass: 'bg-success' },
  { id: 'assignments', icon: 'ti ti-checkbox', iconClass: 'bg-info-transparent text-info', label: 'Assignment Completion', value: '88%', width: '88%', barClass: 'bg-info' },
  { id: 'hours', icon: 'ti ti-clock', iconClass: 'bg-warning-transparent text-warning', label: 'Weekly Study Hours', value: '12 / 15h', width: '80%', barClass: 'bg-warning' },
  { id: 'videos', icon: 'ti ti-video', iconClass: 'bg-purple-transparent text-purple', label: 'Video Lessons Watched', value: '32 / 40', width: '80%', barClass: 'bg-purple' },
  { id: 'quizzes', icon: 'ti ti-help-circle', iconClass: 'bg-teal-transparent text-teal', label: 'Practice Quizzes Passed', value: '18 / 25', width: '72%', barClass: 'bg-teal' },
];

/** 14-day streak; `false` is the one missed day in the template. */
export const studyStreak: boolean[] = [
  true, true, true, true, false, true, true, true, true, true, true, true, true, true,
];

export const streakTiles = [
  { id: 'streak', value: '14', label: 'Day Streak', borderClass: 'border-primary' },
  { id: 'total', value: '96h', label: 'Total Study', borderClass: 'border-success' },
  { id: 'avg', value: '2.1h', label: 'Daily Avg', borderClass: 'border-warning' },
];

/* ----------------------------------- Goals --------------------------------- */

export const goals = [
  { id: 'attendance', ring: 92, ringClass: 'text-success', value: '92%', unit: 'Attend', title: 'Attendance', detail: 'Goal 95%' },
  { id: 'academic', ring: 88, ringClass: 'text-primary', value: '8.8', unit: 'GPA', title: 'Academic', detail: 'Target 9.5' },
  { id: 'study', ring: 80, ringClass: 'text-warning', value: '12h', unit: 'of 15', title: 'Study Target', detail: 'Weekly' },
  { id: 'assignments', ring: 88, ringClass: 'text-info', value: '88%', unit: 'Done', title: 'Assignments', detail: 'Completion' },
  { id: 'reading', ring: 64, ringClass: 'text-teal', value: '64%', unit: 'Read', title: 'Reading', detail: '8 of 12 books' },
  { id: 'course', ring: 78, ringClass: 'text-purple', value: '78%', unit: 'Course', title: 'Course', detail: 'Completion' },
];

export const activeTargets: InfoRow[] = [
  iconRow('gt1', 'ti ti-calendar-check', 'Reach 95% attendance', '3 more present days needed', { endBadge: { label: 'On track', className: 'badge-soft-success' } }),
  iconRow('gt2', 'ti ti-book', 'Lift English above 75%', 'Currently 68% · 7 points to go', { endBadge: { label: 'Behind', className: 'badge-soft-warning' } }),
  iconRow('gt3', 'ti ti-award', 'GPA 9.5 by Term III', 'At 8.8 · predicted 9.2', { endBadge: { label: 'In progress', className: 'badge-soft-info' } }),
];

/* ------------------------------- Achievements ------------------------------ */

export const achievements = [
  { id: 'olympiad', icon: 'ti ti-medal', iconClass: 'bg-warning', title: 'Math Olympiad', detail: 'Gold · 2024' },
  { id: 'certificates', icon: 'ti ti-certificate', iconClass: 'bg-info', title: 'Certificates', detail: '8 earned' },
  { id: 'sprint', icon: 'ti ti-run', iconClass: 'bg-success', title: '100m Sprint', detail: 'Gold · Sports' },
  { id: 'debate', icon: 'ti ti-microphone-2', iconClass: 'bg-purple', title: 'Debate', detail: '2nd place' },
  { id: 'badges', icon: 'ti ti-badges', iconClass: 'bg-danger', title: 'Badges', detail: '6 earned' },
  { id: 'fair', icon: 'ti ti-flask', iconClass: 'bg-teal', title: 'Science Fair', detail: '1st place' },
];

export interface TimelineEntry {
  id: string;
  icon: string;
  iconClass: string;
  title: string;
  detail: string;
  time: string;
}

export const achievementTimeline: TimelineEntry[] = [
  { id: 'at1', icon: 'ti ti-medal', iconClass: 'bg-warning-transparent text-warning', title: 'Won 1st place — Math Olympiad', detail: 'Inter-School · Academic', time: '05 Dec' },
  { id: 'at2', icon: 'ti ti-calendar-check', iconClass: 'bg-success-transparent text-success', title: 'Perfect Attendance Award', detail: 'October · Certificate', time: '01 Nov' },
  { id: 'at3', icon: 'ti ti-run', iconClass: 'bg-info-transparent text-info', title: 'Gold — 100m Sprint', detail: 'Annual Sports Day', time: '18 Oct' },
  { id: 'at4', icon: 'ti ti-microphone-2', iconClass: 'bg-purple-transparent text-purple', title: 'Runner-up — Inter-class Debate', detail: 'Regional finals · Public speaking', time: '28 Sep' },
  { id: 'at5', icon: 'ti ti-star', iconClass: 'bg-danger-transparent text-danger', title: 'Elected Class Monitor', detail: 'Term II · Leadership', time: '02 Sep' },
];

export const nextMilestones: InfoRow[] = [
  iconRow('nm1', 'ti ti-flame', '30-day study streak', '14 of 30 days completed', { endBadge: { label: '16 to go', className: 'badge-soft-warning' } }),
  iconRow('nm2', 'ti ti-books', 'Bookworm badge', 'Read 12 books this term', { endBadge: { label: '8 / 12', className: 'badge-soft-info' } }),
];

/* -------------------------------- My teachers ------------------------------ */

export const myTeachers: InfoRow[] = [
  { id: 'mt1', avatar: 'assets/img/teachers/teacher-01.jpg', avatarDot: 'online', itemClass: TERTIARY, title: 'Ms. Teresa Susan', subtitle: 'Mathematics' },
  { id: 'mt2', avatar: 'assets/img/teachers/teacher-02.jpg', avatarDot: 'offline', itemClass: `border-danger ${TERTIARY}`, title: 'Mr. John Doe', subtitle: 'Science · Physics' },
  { id: 'mt3', avatar: 'assets/img/teachers/teacher-03.jpg', avatarDot: 'online', itemClass: TERTIARY, title: 'Ms. Rita Owen', subtitle: 'English' },
  { id: 'mt4', avatar: 'assets/img/teachers/teacher-05.jpg', avatarDot: 'online', itemClass: TERTIARY, title: 'Ms. Nina Patel', subtitle: 'Computer Science' },
  { id: 'mt5', avatar: 'assets/img/teachers/teacher-04.jpg', avatarDot: 'online', itemClass: TERTIARY, title: 'Mr. Alan Poe', subtitle: 'Geography' },
  { id: 'mt6', avatar: 'assets/img/teachers/teacher-06.jpg', avatarDot: 'offline', itemClass: TERTIARY, title: 'Ms. Carla Reed', subtitle: 'Class Teacher · III-A' },
];

export const officeHours: InfoRow[] = [
  iconRow('oh1', 'ti ti-calendar', 'Ms. Teresa Susan', 'Tue & Thu · 03:30–04:15 PM', { endBadge: { label: 'Open', className: 'badge-soft-success' } }),
  iconRow('oh2', 'ti ti-calendar', 'Mr. John Doe', 'Wed · 02:00–03:00 PM', { iconClass: ICON_DANGER, itemClass: `border-danger ${TERTIARY}`, endBadge: { label: 'Full', className: 'badge-soft-warning' } }),
  iconRow('oh3', 'ti ti-calendar', 'Ms. Rita Owen', 'Fri · 03:30–04:30 PM', { endBadge: { label: 'Open', className: 'badge-soft-success' } }),
];

/* ------------------------------- Communication ----------------------------- */

export const communicationMessages: InfoRow[] = [
  { id: 'cm1', avatar: 'assets/img/teachers/teacher-01.jpg', itemClass: TERTIARY, title: 'Ms. Teresa Susan', subtitle: 'Great work on your algebra test!', subtitleUnread: true, endBadge: { label: '', className: 'badge-danger status-dot-inline' }, endNote: '2m' },
  iconRow('cm2', 'ti ti-speakerphone', 'School Announcement', 'Annual Science Fair on 27 Jul', { subtitleUnread: true, endBadge: { label: '', className: 'badge-danger status-dot-inline' }, endNote: '1h' }),
  { id: 'cm3', avatar: 'assets/img/teachers/teacher-03.jpg', itemClass: TERTIARY, title: 'Homework Feedback', subtitle: 'Reading log needs more detail', subtitleUnread: true, endNote: '3h' },
  iconRow('cm4', 'ti ti-calendar-plus', 'Meeting Request', 'Counsellor · career guidance', { subtitleUnread: true, endNote: '1d' }),
  { id: 'cm5', avatar: 'assets/img/teachers/teacher-05.jpg', itemClass: TERTIARY, title: 'Ms. Nina Patel', subtitle: 'Scratch project files uploaded', subtitleUnread: true, endNote: '2d' },
  iconRow('cm6', 'ti ti-alert-circle', 'Fee Reminder', 'Term II tuition due 25 Dec', { iconClass: ICON_DANGER, itemClass: `border-danger ${TERTIARY}`, subtitleUnread: true, endNote: '3d' }),
  { id: 'cm7', avatar: 'assets/img/teachers/teacher-02.jpg', itemClass: TERTIARY, title: 'Mr. John Doe', subtitle: 'Lab safety form needs a signature', subtitleUnread: true, endNote: '4d' },
  iconRow('cm8', 'ti ti-bus', 'Transport Notice', 'Route 12 timing changed to 07:20', { subtitleUnread: true, endNote: '5d' }),
];

/* ---------------------------------- Library -------------------------------- */

export const libraryTiles = [
  { id: 'issued', value: '3', label: 'Issued', borderClass: 'border-primary' },
  { id: 'due', value: '1', label: 'Due Soon', borderClass: 'border-warning' },
  { id: 'overdue', value: '0', label: 'Overdue', borderClass: 'border-danger' },
];

export const libraryBooks: InfoRow[] = [
  iconRow('lb1', 'ti ti-book-2', 'The Solar System', 'Due 24 Jul'),
  iconRow('lb2', 'ti ti-book-2', "Grimm's Fairy Tales", 'Due 02 Aug', { endBadge: { label: 'Issued', className: 'badge-soft-success' } }),
  iconRow('lb3', 'ti ti-bookmark', 'Reserved: Atlas of World', 'Ready 26 Jul', { endBadge: { label: 'Reserved', className: 'badge-soft-info' } }),
  iconRow('lb4', 'ti ti-book-2', "Charlotte's Web", 'Due 08 Aug', { endBadge: { label: 'Issued', className: 'badge-soft-success' } }),
  iconRow('lb5', 'ti ti-history', 'Returned: Tales of India', 'On time · 12 Jul', { endBadge: { label: 'Returned', className: 'badge-soft-success' } }),
];

/** Only the first book offers a Renew action. */
export const renewableBookId = 'lb1';

export const readingChallenge = {
  icon: 'ti ti-books',
  iconClass: 'bg-teal-transparent text-teal',
  label: '8 of 12 books read',
  value: '64%',
  width: '64%',
  barClass: 'bg-teal',
};

export const recommendedBook: InfoRow = iconRow(
  'rb1',
  'ti ti-book',
  'Matilda',
  'Fiction · popular in Grade III',
);

/* --------------------------------- Transport ------------------------------- */

export const routeProgress = { fill: '52%', busPosition: '52%' };

export const routeStops = [
  { id: 'school', label: 'School', state: 'done' },
  { id: 'oak', label: 'Oak Ave', state: 'done' },
  { id: 'maple', label: 'Maple St', state: 'now' },
  { id: 'home', label: 'Home', state: '' },
];

export const transportDetails = [
  { id: 'bus', icon: 'ti ti-bus', iconClass: 'bg-primary-transparent text-primary', value: 'BUS-04', label: 'Bus Number' },
  { id: 'route', icon: 'ti ti-route', iconClass: 'bg-info-transparent text-info', value: 'Route 12', label: 'Downtown' },
  { id: 'pickup', icon: 'ti ti-clock', iconClass: 'bg-success-transparent text-success', value: '07:45 AM', label: 'Pickup Time' },
  { id: 'drop', icon: 'ti ti-clock-hour-3', iconClass: 'bg-warning-transparent text-warning', value: '03:30 PM', label: 'Drop Time' },
  { id: 'driver', icon: 'ti ti-user', iconClass: 'bg-teal-transparent text-teal', value: 'Michael Doe', label: 'Driver' },
  { id: 'eta', icon: 'ti ti-map-pin', iconClass: 'bg-danger-transparent text-danger', value: '1.2 km away', label: 'ETA 07:41' },
  { id: 'attendant', icon: 'ti ti-user-shield', iconClass: 'bg-purple-transparent text-purple', value: 'Anita Sharma', label: 'Attendant' },
  { id: 'seat', icon: 'ti ti-armchair', iconClass: 'bg-warning-transparent text-warning', value: 'Seat 08', label: 'Window · Row 4' },
];

export const recentTrips: InfoRow[] = [
  iconRow('rt1', 'ti ti-check', 'Today · Morning pickup', 'Boarded 07:41 · on time', { endBadge: { label: 'On time', className: 'badge-soft-success' } }),
  iconRow('rt2', 'ti ti-clock-exclamation', 'Yesterday · Evening drop', 'Reached home 03:48 PM', { endBadge: { label: '+18 min', className: 'badge-soft-warning' } }),
  iconRow('rt3', 'ti ti-check', 'Yesterday · Morning pickup', 'Boarded 07:39 · on time', { endBadge: { label: 'On time', className: 'badge-soft-success' } }),
];

/* --------------------------------- Calendar -------------------------------- */

export interface CalendarEvent {
  id: string;
  day: string;
  month: string;
  title: string;
  detail: string;
  badge?: { label: string; className: string };
}

export const calendarEvents: CalendarEvent[] = [
  { id: 'ce1', day: '21', month: 'Jul', title: 'Computer Science Class', detail: '01:00 PM · Lab 01', badge: { label: 'Today', className: 'badge-soft-warning' } },
  { id: 'ce2', day: '25', month: 'Jul', title: 'Science Term Test', detail: 'Exam · Lab 01' },
  { id: 'ce3', day: '26', month: 'Jul', title: 'Maths Assignment Due', detail: 'Deadline · Unit III' },
  { id: 'ce4', day: '27', month: 'Jul', title: 'Annual Science Fair', detail: 'Competition · Auditorium' },
  { id: 'ce5', day: '28', month: 'Jul', title: 'PTA Meeting', detail: 'Parents · 4:00 PM' },
];

/* ----------------------------- Activity timeline --------------------------- */

export const activityTimeline: TimelineEntry[] = [
  { id: 'ac1', icon: 'ti ti-login-2', iconClass: 'bg-info-transparent text-info', title: 'Checked into school', detail: 'Gate 2 · face recognition', time: '08:02' },
  { id: 'ac2', icon: 'ti ti-checkbox', iconClass: 'bg-success-transparent text-success', title: 'Assignment submitted', detail: 'Fractions Practice · Maths', time: '09:05' },
  { id: 'ac3', icon: 'ti ti-video', iconClass: 'bg-danger-transparent text-danger', title: 'Joined live class', detail: 'Science — Physics · Lab 02', time: '09:10' },
  { id: 'ac4', icon: 'ti ti-award', iconClass: 'bg-primary-transparent text-primary', title: 'Exam result published', detail: 'Unit Test II · Grade A+', time: 'Yst' },
  { id: 'ac5', icon: 'ti ti-calendar-check', iconClass: 'bg-info-transparent text-info', title: 'Attendance marked', detail: 'Present · all classes', time: 'Yst' },
  { id: 'ac6', icon: 'ti ti-cash', iconClass: 'bg-warning-transparent text-warning', title: 'Fee payment', detail: '$3,000 · Term I Tuition', time: '2d' },
];

/* ------------------------------- Notifications ----------------------------- */

export const notifications: InfoRow[] = [
  iconRow('nt1', 'ti ti-hexagonal-prism-plus', 'Exam Alert', 'Science Term Test on Friday'),
  iconRow('nt2', 'ti ti-file-alert', 'Assignment Reminder', 'Algebra Worksheet 4 due today'),
  iconRow('nt3', 'ti ti-cash', 'Fee Due Alert', '$2,000 pending · due 25 Dec', { iconClass: ICON_DANGER, itemClass: `border-danger ${TERTIARY}` }),
  iconRow('nt4', 'ti ti-calendar-check', 'Attendance Alert', 'You were marked present today'),
  iconRow('nt5', 'ti ti-news', 'School Circular #48', 'Updated exam calendar released'),
];
