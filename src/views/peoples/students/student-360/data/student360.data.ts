import { all_routes } from '@/routes/all_routes';

const routes = all_routes;

/* --------------------------------- Identity -------------------------------- */

export interface IdentityDetail {
  label: string;
  value: string;
  /** The last pair drops its bottom margin in the template. */
  last?: boolean;
}

export interface StudentIdentity {
  photo: string;
  status: string;
  name: string;
  meta: string;
  details: IdentityDetail[];
}

export const identity: StudentIdentity = {
  photo: 'assets/img/students/student-01.jpg',
  status: 'Active',
  name: 'Janet Daniel',
  meta: 'AD9892434 · III-A',
  details: [
    { label: 'Roll No', value: '35013' },
    { label: 'Gender', value: 'Female' },
    { label: 'DOB', value: '10 Jan 2015' },
    { label: 'Parent', value: 'Antony Daniel' },
    { label: 'Phone', value: '+1 65465 21345' },
    { label: 'House', value: 'Blue', last: true },
  ],
};

/* ------------------------------- Quick actions ------------------------------ */

export interface QuickAction {
  id: string;
  icon: string;
  label: string;
  to: string;
  last?: boolean;
}

export const quickActions: QuickAction[] = [
  {
    id: 'attendance',
    icon: 'ti ti-calendar-stats',
    label: 'Attendance History',
    to: routes.studentAttendanceHistory,
  },
  { id: 'documents', icon: 'ti ti-files', label: 'Documents', to: routes.studentDocuments },
  { id: 'fees', icon: 'ti ti-report-money', label: 'Fees', to: routes.studentFees },
  {
    id: 'parent',
    icon: 'ti ti-mail',
    label: 'Contact Parent',
    to: routes.parentCommunication,
    last: true,
  },
];

/* ------------------------------- Stat cards -------------------------------- */

export interface Student360Stat {
  id: string;
  variant: string;
  iconClass: string;
  icon: string;
  badge?: { className: string; label: string };
  value: string;
  label: string;
  progress?: { className: string; width: string };
}

export const statCards: Student360Stat[] = [
  {
    id: 'attendance',
    variant: 'stat-success',
    iconClass: 'bg-success-transparent text-success',
    icon: 'ti ti-calendar-check',
    value: '93.5%',
    label: 'Attendance',
    progress: { className: 'bg-success', width: '93%' },
  },
  {
    id: 'gpa',
    variant: 'stat-primary',
    iconClass: 'bg-primary-transparent text-primary',
    icon: 'ti ti-award',
    badge: { className: 'badge-soft-success', label: 'A' },
    value: '8.6',
    label: 'GPA',
  },
  {
    id: 'fees',
    variant: 'stat-danger',
    iconClass: 'bg-danger-transparent text-danger',
    icon: 'ti ti-report-money',
    badge: { className: 'badge-soft-danger', label: 'Due' },
    value: '$450',
    label: 'Fee Balance',
  },
  {
    id: 'behavior',
    variant: 'stat-warning',
    iconClass: 'bg-warning-transparent text-warning',
    icon: 'ti ti-mood-smile',
    badge: { className: 'badge-soft-success', label: 'Good' },
    value: '82',
    label: 'Behavior Score',
  },
  {
    id: 'health',
    variant: 'stat-info',
    iconClass: 'bg-info-transparent text-info',
    icon: 'ti ti-heartbeat',
    badge: { className: 'badge-soft-success', label: 'OK' },
    value: '0',
    label: 'Health Alerts',
  },
  {
    id: 'documents',
    variant: 'stat-secondary',
    iconClass: 'bg-secondary-transparent text-secondary',
    icon: 'ti ti-files',
    value: '92%',
    label: 'Documents Complete',
    progress: { className: 'bg-secondary', width: '92%' },
  },
];

/* ----------------------------------- Tabs ---------------------------------- */

export type Student360Tab =
  | 's360-overview'
  | 's360-academics'
  | 's360-attendance'
  | 's360-fees'
  | 's360-behavior'
  | 's360-timeline';

export interface TabSpec {
  id: Student360Tab;
  label: string;
}

export const tabs: TabSpec[] = [
  { id: 's360-overview', label: 'Overview' },
  { id: 's360-academics', label: 'Academics' },
  { id: 's360-attendance', label: 'Attendance' },
  { id: 's360-fees', label: 'Fees' },
  { id: 's360-behavior', label: 'Behavior' },
  { id: 's360-timeline', label: 'Timeline' },
];

/* --------------------------------- Academics -------------------------------- */

export interface ExamResult {
  id: string;
  exam: string;
  subject: string;
  marks: string;
  grade: { label: string; className: string };
}

export const examResults: ExamResult[] = [
  {
    id: 'mid-maths',
    exam: 'Mid Term',
    subject: 'Maths',
    marks: '92/100',
    grade: { label: 'A', className: 'badge-soft-success' },
  },
  {
    id: 'mid-science',
    exam: 'Mid Term',
    subject: 'Science',
    marks: '88/100',
    grade: { label: 'A', className: 'badge-soft-success' },
  },
  {
    id: 'mid-english',
    exam: 'Mid Term',
    subject: 'English',
    marks: '79/100',
    grade: { label: 'B+', className: 'badge-soft-info' },
  },
];

/* -------------------------------- Attendance -------------------------------- */

export interface AttendanceTile {
  id: string;
  value: string;
  label: string;
  className: string;
}

export const attendanceTiles: AttendanceTile[] = [
  { id: 'present', value: '168', label: 'Present', className: 'text-success' },
  { id: 'absent', value: '7', label: 'Absent', className: 'text-danger' },
  { id: 'late', value: '4', label: 'Late', className: 'text-warning' },
  { id: 'leave', value: '3', label: 'Leave', className: 'text-info' },
];

/* ----------------------------------- Fees ----------------------------------- */

export interface FeeTransaction {
  id: string;
  receipt: string;
  type: string;
  amount: string;
  date: string;
  status: { label: string; className: string };
}

export const feeTransactions: FeeTransaction[] = [
  {
    id: 'RCPT-1201',
    receipt: 'RCPT-1201',
    type: 'Term 1',
    amount: '$1,500',
    date: '02 Apr 2026',
    status: { label: 'Paid', className: 'badge-soft-success' },
  },
  {
    id: 'RCPT-1330',
    receipt: 'RCPT-1330',
    type: 'Term 2',
    amount: '$1,050',
    date: '—',
    status: { label: 'Partial', className: 'badge-soft-warning' },
  },
];

/* --------------------------------- Behavior --------------------------------- */

export interface BehaviorEntry {
  id: string;
  tint: string;
  icon: string;
  text: string;
  meta: string;
  last?: boolean;
}

export const behaviorEntries: BehaviorEntry[] = [
  {
    id: 'merit',
    tint: 'bg-soft-success',
    icon: 'ti ti-plus',
    text: '+5 merit — Helped a classmate',
    meta: 'Teena Mathew · 2 days ago',
  },
  {
    id: 'late',
    tint: 'bg-soft-warning',
    icon: 'ti ti-alert-triangle',
    text: 'Late submission — Science homework',
    meta: 'Daniel Josua · 1 week ago',
    last: true,
  },
];

/* --------------------------------- Timeline --------------------------------- */

export interface LifecycleEntry {
  id: string;
  tint: string;
  icon: string;
  title: string;
  detail: string;
  last?: boolean;
}

export const lifecycleEntries: LifecycleEntry[] = [
  {
    id: 'admitted',
    tint: 'bg-success',
    icon: 'ti ti-user-plus',
    title: 'Admitted to Class I',
    detail: 'Jun 2022',
  },
  {
    id: 'promoted',
    tint: 'bg-info',
    icon: 'ti ti-arrow-ramp-right-2',
    title: 'Promoted to Class III',
    detail: 'Apr 2024',
  },
  {
    id: 'olympiad',
    tint: 'bg-warning',
    icon: 'ti ti-award',
    title: 'Science Olympiad — Rank 2',
    detail: 'Feb 2026',
    last: true,
  },
];
