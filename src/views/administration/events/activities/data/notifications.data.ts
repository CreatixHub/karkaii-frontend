/* ------------------------------------------------------------------ *
 * The account, all-time                                              *
 * ------------------------------------------------------------------ */

export const TOTAL_NOTIFICATIONS = 214;
export const TODAY_TOTAL = 34;
export const WEEK_TOTAL = 96;
export const IMPORTANT = 6;
export const ACTION_REQUIRED = 4;
export const UNREAD = 18;
export const LAST_UPDATED = '2 min';

/* ------------------------------------------------------------------ *
 * What a notification is                                             *
 * ------------------------------------------------------------------ */

export type Priority = 'critical' | 'high' | 'medium' | 'low';

export const PRIORITY_LABEL: Record<Priority, string> = {
  critical: 'Critical',
  high: 'High',
  medium: 'Medium',
  low: 'Low',
};

export interface Attachment {
  name: string;
}

export interface Notification {
  id: string;
  title: string;
  text: string;
  /** The extra line the AI-backed alerts carry under the body. */
  preview?: string;
  /** The module chip: its key drives the tint, its label the text. */
  moduleKey: string;
  module: string;
  priority: Priority;
  /** Who or what raised it, and where it came from. */
  actor: string;
  source: string;
  at: string;
  /** Which group the feed files it under. */
  group: string;
  /** A person's photograph, or a system tile with an icon. */
  photo?: string;
  systemIcon?: string;
  badgeIcon: string;
  unread: boolean;
  pinned?: boolean;
  attachments?: Attachment[];
}

export const NOTIFICATIONS: Notification[] = [
  {
    id: 'ntf-1',
    title: 'Attendance dropped below the statutory threshold',
    text: 'Liam Walker has fallen to 71% attendance. A recovery plan is required within 11 days.',
    preview:
      'Predicted 63% by 18 July at 96% confidence · Route 04 identified as the shared cause.',
    moduleKey: 'attendance',
    module: 'Attendance',
    priority: 'critical',
    actor: 'Liam Walker',
    source: 'Attendance',
    at: '08:14',
    group: 'Today',
    photo: 'assets/img/students/student-04.jpg',
    badgeIcon: 'ti ti-alert-triangle',
    unread: true,
    pinned: true,
  },
  {
    id: 'ntf-2',
    title: 'Nightly AI analysis completed',
    text: '3,842 students scored across 14 signals. 14 newly entered prediction range, 23 improved.',
    moduleKey: 'system',
    module: 'System',
    priority: 'low',
    actor: 'System',
    source: 'AI Command Center',
    at: '06:15',
    group: 'Today',
    systemIcon: 'ti ti-cpu',
    badgeIcon: 'ti ti-sparkles',
    unread: true,
  },
  {
    id: 'ntf-3',
    title: 'Teena Mathew mentioned you in a case note',
    text: '“Can you approve the transport review for Route 04? It affects five of my students.”',
    moduleKey: 'transport',
    module: 'Transport',
    priority: 'high',
    actor: 'Teena Mathew',
    source: 'Transport',
    at: '09:32',
    group: 'Today',
    photo: 'assets/img/teachers/teacher-01.jpg',
    badgeIcon: 'ti ti-at',
    unread: true,
  },
  {
    id: 'ntf-4',
    title: 'Fee payment overdue by 34 days',
    text: 'Aarav Menon’s Term 2 balance of $3,100 remains outstanding. Hardship criteria appear to be met.',
    moduleKey: 'fees',
    module: 'Fees',
    priority: 'critical',
    actor: 'Mr. Ravi Menon',
    source: 'Fees',
    at: '11:48',
    group: 'Today',
    photo: 'assets/img/parents/parent-05.jpg',
    badgeIcon: 'ti ti-receipt',
    unread: true,
    attachments: [{ name: 'Invoice-2041.pdf' }, { name: 'Payment-history.xlsx' }],
  },
  {
    id: 'ntf-5',
    title: 'Timetable conflict flagged for review',
    text: 'Lab 2 is double-booked on Thursday period 3. Chemistry requires the fume extraction.',
    moduleKey: 'exams',
    module: 'Examinations',
    priority: 'high',
    actor: 'Daniel Josua',
    source: 'Scheduling',
    at: '10:05',
    group: 'Today',
    photo: 'assets/img/teachers/teacher-03.jpg',
    badgeIcon: 'ti ti-calendar-cog',
    unread: false,
  },
  {
    id: 'ntf-6',
    title: 'Science exhibition placing recorded',
    text: 'Second place in the inter-house science exhibition. Eligible for the regional nomination.',
    moduleKey: 'academic',
    module: 'Academic',
    priority: 'low',
    actor: 'Sophia Reyes',
    source: 'Academic',
    at: 'Yesterday, 16:20',
    group: 'Yesterday',
    photo: 'assets/img/students/student-03.jpg',
    badgeIcon: 'ti ti-award',
    unread: false,
  },
  {
    id: 'ntf-7',
    title: 'Three books overdue in Class VIII-A',
    text: 'Two students have books more than fourteen days overdue. Automatic reminders were sent.',
    moduleKey: 'library',
    module: 'Library',
    priority: 'medium',
    actor: 'Library',
    source: 'Library',
    at: 'Yesterday, 14:02',
    group: 'Yesterday',
    systemIcon: 'ti ti-books',
    badgeIcon: 'ti ti-clock',
    unread: false,
  },
  {
    id: 'ntf-8',
    title: 'Medical leave certificate uploaded',
    text: 'Maria Fernandes has filed a sixth medical leave this term, all certified.',
    moduleKey: 'medical',
    module: 'Medical',
    priority: 'medium',
    actor: 'Dr. Anjali Rao',
    source: 'Medical',
    at: 'Yesterday, 11:15',
    group: 'Yesterday',
    photo: 'assets/img/profiles/avatar-02.jpg',
    badgeIcon: 'ti ti-stethoscope',
    unread: false,
    attachments: [{ name: 'Certificate-1487.pdf' }],
  },
  {
    id: 'ntf-9',
    title: 'Unusual sign-in blocked',
    text: 'A sign-in attempt from an unrecognised device was blocked on a staff account.',
    moduleKey: 'security',
    module: 'Security',
    priority: 'high',
    actor: 'Security',
    source: 'Security',
    at: 'Tue, 22:41',
    group: 'This Week',
    systemIcon: 'ti ti-shield-lock',
    badgeIcon: 'ti ti-lock',
    unread: false,
  },
  {
    id: 'ntf-10',
    title: 'Workload above policy ceiling',
    text: 'Meera Joshi is assigned 31 periods against a ceiling of 26. Five periods need reassigning.',
    moduleKey: 'hr',
    module: 'HR',
    priority: 'high',
    actor: 'Meera Joshi',
    source: 'HR',
    at: 'Tue, 09:00',
    group: 'This Week',
    photo: 'assets/img/teachers/teacher-02.jpg',
    badgeIcon: 'ti ti-user-exclamation',
    unread: false,
  },
  {
    id: 'ntf-11',
    title: 'Room allocation completed for the term',
    text: 'All 214 hostel places are allocated. Four students remain on the waiting list.',
    moduleKey: 'hostel',
    module: 'Hostel',
    priority: 'low',
    actor: 'Hostel',
    source: 'Hostel',
    at: 'Mon, 15:30',
    group: 'This Week',
    systemIcon: 'ti ti-home',
    badgeIcon: 'ti ti-bed',
    unread: false,
  },
  {
    id: 'ntf-12',
    title: 'Term 2 exam schedule published',
    text: 'The full timetable is available to staff, students and parents in the portal.',
    moduleKey: 'exams',
    module: 'Examinations',
    priority: 'medium',
    actor: 'Examinations',
    source: 'Examinations',
    at: '24 Jul',
    group: 'Earlier',
    systemIcon: 'ti ti-file-certificate',
    badgeIcon: 'ti ti-calendar',
    unread: false,
    attachments: [{ name: 'Exam-schedule-T2.pdf' }],
  },
  {
    id: 'ntf-13',
    title: 'Scheduled maintenance completed',
    text: 'The platform was offline for 40 minutes on Sunday. No data was affected.',
    moduleKey: 'system',
    module: 'System',
    priority: 'low',
    actor: 'System',
    source: 'System',
    at: '21 Jul',
    group: 'Earlier',
    systemIcon: 'ti ti-server',
    badgeIcon: 'ti ti-tool',
    unread: false,
  },
];

/** The order the feed groups arrive in. */
export const GROUPS = ['Today', 'Yesterday', 'This Week', 'Earlier'];

export const inGroup = (rows: Notification[], group: string) =>
  rows.filter((row) => row.group === group);

/** "5 notifications" — the group, counted rather than typed. */
export const groupCountLabel = (rows: Notification[], group: string) => {
  const count = inGroup(rows, group).length;
  return `${count} ${count === 1 ? 'notification' : 'notifications'}`;
};

/** The row's rail comes from its own state, not a class written beside it. */
export const rowModifiersOf = (row: Notification) =>
  [row.unread ? 'is-unread' : '', row.priority === 'critical' ? 'is-critical' : '', row.pinned ? 'is-pinned' : '']
    .filter(Boolean)
    .join(' ');

export const searchIndexOf = (row: Notification) =>
  [row.title, row.text, row.module, row.actor, row.source, PRIORITY_LABEL[row.priority]]
    .join(' ')
    .toLowerCase();

/* ------------------------------------------------------------------ *
 * The filter toolbar                                                 *
 * ------------------------------------------------------------------ */

export const TYPES = ['Alert', 'Reminder', 'Approval', 'Announcement', 'System'];
export const PRIORITIES: Priority[] = ['critical', 'high', 'medium', 'low'];
export const MODULES = [
  'Academic',
  'Attendance',
  'Fees',
  'Examinations',
  'Library',
  'Transport',
  'Medical',
];
export const PEOPLE = ['Teena Mathew', 'Daniel Josua', 'System', 'Mentions of me'];
export const RANGES = ['Last 7 days', 'Today', 'Last 30 days', 'This term'];
export const STATUSES = ['Unread', 'Read', 'Pinned', 'Archived'];

/** Notifications still unread in the feed, as against the account's own count. */
export const unreadIn = (rows: Notification[]) => rows.filter((row) => row.unread).length;

export const pinnedIn = (rows: Notification[]) => rows.filter((row) => row.pinned).length;

export const criticalIn = (rows: Notification[]) =>
  rows.filter((row) => row.priority === 'critical').length;

export const mentionsIn = (rows: Notification[]) =>
  rows.filter((row) => row.badgeIcon === 'ti ti-at').length;

/**
 * The tab strip. The first four count what the feed actually holds; the last
 * two span the account, which the feed does not show, so they stay figures.
 */
export const tabsFor = (rows: Notification[]) => [
  { id: 'unread', label: 'Unread', icon: 'ti ti-mail', count: unreadIn(rows) },
  { id: 'important', label: 'Important', icon: 'ti ti-flag', count: criticalIn(rows) },
  { id: 'mentioned', label: 'Mentioned', icon: 'ti ti-at', count: mentionsIn(rows) },
  { id: 'requires', label: 'Requires', icon: 'ti ti-checkbox', count: ACTION_REQUIRED },
  { id: 'archived', label: 'Archived', icon: 'ti ti-archive' },
  { id: 'today', label: 'Today', icon: 'ti ti-calendar', count: TODAY_TOTAL, quiet: true },
  { id: 'week', label: 'This Week', icon: 'ti ti-calendar-week', count: WEEK_TOTAL, quiet: true },
];

/* ------------------------------------------------------------------ *
 * Categories                                                         *
 * ------------------------------------------------------------------ */

export interface Category {
  name: string;
  icon: string;
  unread: number;
  priority: Priority;
  latest: string;
}

export const CATEGORIES: Category[] = [
  { name: 'Academic', icon: 'ti ti-school', unread: 4, priority: 'medium', latest: 'Science exhibition placing recorded' },
  { name: 'Attendance', icon: 'ti ti-calendar-stats', unread: 6, priority: 'critical', latest: 'Liam Walker below threshold' },
  { name: 'Fees', icon: 'ti ti-report-money', unread: 3, priority: 'critical', latest: '$3,100 overdue by 34 days' },
  { name: 'Examinations', icon: 'ti ti-file-certificate', unread: 2, priority: 'high', latest: 'Lab 2 double-booked Thursday' },
  { name: 'Library', icon: 'ti ti-books', unread: 1, priority: 'medium', latest: 'Three books overdue in VIII-A' },
  { name: 'Transport', icon: 'ti ti-bus', unread: 2, priority: 'high', latest: 'Route 04 review requested' },
  { name: 'Hostel', icon: 'ti ti-home', unread: 0, priority: 'low', latest: 'Room allocation completed' },
  { name: 'Medical', icon: 'ti ti-stethoscope', unread: 1, priority: 'medium', latest: 'Sixth certified leave this term' },
  { name: 'HR', icon: 'ti ti-users', unread: 2, priority: 'high', latest: 'Workload above policy ceiling' },
  { name: 'Security', icon: 'ti ti-shield-lock', unread: 1, priority: 'high', latest: 'Unusual sign-in blocked' },
  { name: 'System', icon: 'ti ti-server', unread: 0, priority: 'low', latest: 'Maintenance completed Sunday' },
  { name: 'Communication', icon: 'ti ti-message-2', unread: 3, priority: 'medium', latest: '14 parent summaries drafted' },
];

/** Unread across every module — the same eighteen the headline names. */
export const CATEGORY_UNREAD = CATEGORIES.reduce((total, row) => total + row.unread, 0);

/* ------------------------------------------------------------------ *
 * The priority centre                                                *
 * ------------------------------------------------------------------ */

export interface PriorityBand {
  priority: Priority;
  window: string;
  pending: number;
  latest: string;
  latestAt: string;
}

export const PRIORITY_BANDS: PriorityBand[] = [
  {
    priority: 'critical',
    window: 'Within 1 hour',
    pending: 4,
    latest: 'Attendance below threshold · Liam Walker',
    latestAt: '08:14 today',
  },
  {
    priority: 'high',
    window: 'Same day',
    pending: 7,
    latest: 'Workload above policy ceiling · Meera Joshi',
    latestAt: 'Tue, 09:00',
  },
  {
    priority: 'medium',
    window: 'Within 3 days',
    pending: 12,
    latest: 'Three books overdue in Class VIII-A',
    latestAt: 'Yesterday, 14:02',
  },
  {
    priority: 'low',
    window: 'No deadline',
    pending: 31,
    latest: 'Scheduled maintenance completed',
    latestAt: '21 Jul',
  },
];

/* ------------------------------------------------------------------ *
 * Quick actions, timeline, insights                                  *
 * ------------------------------------------------------------------ */

export interface QuickAction {
  label: string;
  note: string;
  icon: string;
}

export const QUICK_ACTIONS: QuickAction[] = [
  { label: 'Reply', note: 'Respond in the originating module', icon: 'ti ti-message-reply' },
  { label: 'Notify Parent', note: 'Draft and send a guardian message', icon: 'ti ti-mail' },
  { label: 'Approve', note: 'Clear the four items awaiting a decision', icon: 'ti ti-check' },
  { label: 'Reject', note: 'Decline with a recorded reason', icon: 'ti ti-x' },
  { label: 'View Details', note: 'Open the full notification workspace', icon: 'ti ti-eye' },
  { label: 'Generate Report', note: 'Summarise this week’s notifications', icon: 'ti ti-report' },
  { label: 'Share', note: 'Send to a colleague or a channel', icon: 'ti ti-share' },
  { label: 'Forward', note: 'Pass to the right owner', icon: 'ti ti-arrow-forward' },
  { label: 'Assign', note: 'Give the item a named owner', icon: 'ti ti-user-plus' },
];

export interface DeliveryStep {
  title: string;
  at: string;
  note: string;
  done: boolean;
}

export const DELIVERY: DeliveryStep[] = [
  {
    title: 'Notification Created',
    at: '08:14',
    note: 'Raised by the attendance engine when the threshold was crossed.',
    done: true,
  },
  {
    title: 'Delivered',
    at: '08:14',
    note: 'In-app, email and push. SMS suppressed by quiet hours.',
    done: true,
  },
  {
    title: 'Viewed',
    at: '08:31',
    note: 'Opened by Teena Mathew, then by the attendance office.',
    done: true,
  },
  {
    title: 'Action Taken',
    at: 'Pending',
    note: 'A recovery plan has been drafted and is awaiting approval.',
    done: false,
  },
  {
    title: 'Completed',
    at: 'Pending',
    note: 'Closes when the plan is approved and the case is assigned.',
    done: false,
  },
];

export interface Insight {
  title: string;
  text: string;
  icon: string;
}

export const INSIGHTS: Insight[] = [
  {
    title: 'Most Active Module',
    text: 'Attendance has generated 96 notifications this week, more than the next three modules combined. Sixty-one of them relate to the same term-start dip.',
    icon: 'ti ti-chart-bar',
  },
  {
    title: 'Frequently Triggered',
    text: 'The overdue-book reminder has fired 34 times this term. Raising the grace period from 7 to 14 days would remove most of them without changing returns.',
    icon: 'ti ti-repeat',
  },
  {
    title: 'Recent Announcements',
    text: 'Four announcements published this week: the exam schedule, a fee reminder, the PTA meeting and Monday’s maintenance window.',
    icon: 'ti ti-speakerphone',
  },
  {
    title: 'Pending Actions',
    text: 'Four items are waiting on you: one attendance plan, one transport review, one workload reassignment and one fee adjustment.',
    icon: 'ti ti-checkbox',
  },
  {
    title: 'Upcoming Events',
    text: 'PTA meeting on 14 August, exam period from 18 August, and the science exhibition deadline on 12 September.',
    icon: 'ti ti-calendar-event',
  },
  {
    title: 'System Messages',
    text: 'No incidents in the last 30 days. The next maintenance window is Sunday 10 August, 02:00 to 04:00.',
    icon: 'ti ti-server',
  },
];

/* ------------------------------------------------------------------ *
 * Delivery preferences and announcements                             *
 * ------------------------------------------------------------------ */

export interface Preference {
  channel: string;
  behaviour: string;
  icon: string;
}

export const PREFERENCES: Preference[] = [
  { channel: 'Email', behaviour: 'Daily digest at 07:00', icon: 'ti ti-mail' },
  { channel: 'SMS', behaviour: 'Critical alerts only', icon: 'ti ti-message' },
  { channel: 'Push', behaviour: 'All priorities', icon: 'ti ti-bell' },
  { channel: 'In-App', behaviour: 'Everything, always on', icon: 'ti ti-app-window' },
  { channel: 'WhatsApp', behaviour: 'Parent messages only', icon: 'ti ti-brand-whatsapp' },
  { channel: 'Emergency Alerts', behaviour: 'Bypasses quiet hours', icon: 'ti ti-urgent' },
  { channel: 'Digest', behaviour: 'Weekly summary on Friday', icon: 'ti ti-news' },
];

export interface Announcement {
  kind: string;
  audience: string;
  title: string;
  text: string;
  publishedOn: string;
}

export const ANNOUNCEMENTS: Announcement[] = [
  {
    kind: 'Holiday Notice',
    audience: 'All',
    title: 'School closed 15 August',
    text: 'Independence Day. Classes resume Monday 18 August as normal.',
    publishedOn: '28 Jul',
  },
  {
    kind: 'Exam Schedule',
    audience: 'Students, Parents',
    title: 'Term 2 exams begin 18 August',
    text: 'The full timetable is in the portal. Seating plans follow next week.',
    publishedOn: '24 Jul',
  },
  {
    kind: 'Fee Reminder',
    audience: 'Parents',
    title: 'Term 2 fees due 31 August',
    text: 'Instalment plans are available on request. No late fee before 15 September.',
    publishedOn: '26 Jul',
  },
  {
    kind: 'PTA Meeting',
    audience: 'Parents, Staff',
    title: 'Parent-teacher meeting, 14 August',
    text: 'Evening slots from 5pm. Booking opens Monday in the parent portal.',
    publishedOn: '29 Jul',
  },
  {
    kind: 'Sports Event',
    audience: 'Students',
    title: 'Inter-house athletics, 22 August',
    text: 'Trials next Tuesday. All year groups welcome to enter.',
    publishedOn: '27 Jul',
  },
  {
    kind: 'System Maintenance',
    audience: 'All',
    title: 'Portal offline Sunday 02:00–04:00',
    text: 'Routine maintenance. No action is needed from staff or families.',
    publishedOn: '25 Jul',
  },
];

/** Announcements published in the last week — what the insight card counts. */
export const ANNOUNCEMENTS_THIS_WEEK = 4;
