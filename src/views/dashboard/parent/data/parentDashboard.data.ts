/** Every dialog on this page, keyed by the id used in the source markup. */
export type ParentModalId =
  | 'timetable'
  | 'pay'
  | 'message'
  | 'meeting'
  | 'leave'
  | 'editParent';

/** Non-modal actions the HTML routed through `data-px-action`. */
export type ParentActionId =
  | 'track'
  | 'call_driver'
  | 'receipt'
  | 'mark_read'
  | 'report';

/* ------------------------------ Child switcher ----------------------------- */

export type ChildKey = 'Emma' | 'Liam';

export interface ChildContext {
  img: string;
  name: string;
  sub: string;
  teacher: string;
  checkin: string;
  bus: string;
}

/** Verbatim from `CHILDREN` in parent-portal.js. */
export const children: Record<ChildKey, ChildContext> = {
  Emma: {
    img: 'assets/img/students/student-01.jpg',
    name: 'Emma Daniel',
    sub: 'Grade 4 · Section A · Roll 12 · STU-1042',
    teacher: 'Ms. Teresa Susan',
    checkin: 'In school · 08:02 AM',
    bus: 'Route 12A · Seat 08',
  },
  Liam: {
    img: 'assets/img/students/student-02.jpg',
    name: 'Liam Daniel',
    sub: 'Grade 6 · Section B · Roll 07 · STU-1188',
    teacher: 'Mr. John Doe',
    checkin: 'In school · 07:56 AM',
    bus: 'Route 12A · Seat 09',
  },
};

export const childSwitcherOptions: {
  key: ChildKey;
  img: string;
  name: string;
  className: string;
}[] = [
  { key: 'Emma', img: 'assets/img/students/student-01.jpg', name: 'Emma Daniel', className: 'Grade 4 · A' },
  { key: 'Liam', img: 'assets/img/students/student-02.jpg', name: 'Liam Daniel', className: 'Grade 6 · B' },
];

/* -------------------------------- Command bar ------------------------------ */

export const parentIdentity = {
  avatar: 'assets/img/profiles/avatar-27.jpg',
  head: 'Parent Command Center',
  name: 'Robert Daniel',
  chips: [
    { icon: 'ti ti-id', label: 'PAR-2043' },
    { icon: 'ti ti-calendar', label: '2024–25' },
    { icon: 'ti ti-shield-check', label: 'Portal Active' },
  ],
};

export interface QuickBarAction {
  id: string;
  icon: string;
  label: string;
  primary?: boolean;
  modal?: ParentModalId;
  action?: ParentActionId;
}

export const quickBarActions: QuickBarAction[] = [
  { id: 'pay', icon: 'ti ti-cash', label: 'Pay Fees', primary: true, modal: 'pay' },
  { id: 'message', icon: 'ti ti-message', label: 'Message Teacher', modal: 'message' },
  { id: 'report', icon: 'ti ti-download', label: 'Report Card', action: 'report' },
  { id: 'track', icon: 'ti ti-bus', label: 'Track Bus', action: 'track' },
  { id: 'timetable', icon: 'ti ti-table', label: 'Timetable', modal: 'timetable' },
  { id: 'meeting', icon: 'ti ti-calendar-plus', label: 'Meeting', modal: 'meeting' },
  { id: 'leave', icon: 'ti ti-calendar-off', label: 'Request Leave', modal: 'leave' },
];

export interface GlanceStat {
  id: string;
  accent: string;
  icon: string;
  label: string;
  value: string;
  /** Animated count-up target; the template marked these `data-count`. */
  count?: number;
  suffix?: string;
}

export const glanceStats: GlanceStat[] = [
  { id: 'attendance', accent: 'accent-success', icon: 'ti ti-circle-check', label: 'Attendance', value: 'Present' },
  { id: 'homework', accent: 'accent-warning', icon: 'ti ti-book', label: 'Homework', value: '1', suffix: 'due' },
  { id: 'fees', accent: 'accent-success', icon: 'ti ti-cash', label: 'Fees', value: '$0', suffix: 'due' },
  { id: 'exam', accent: 'accent-purple', icon: 'ti ti-hexagonal-prism-plus', label: 'Next Exam', value: '', count: 3, suffix: 'days' },
  { id: 'event', accent: 'accent-info', icon: 'ti ti-calendar-star', label: 'Event', value: 'Sci Fair' },
  { id: 'messages', accent: 'accent-pink', icon: 'ti ti-message-2', label: 'Messages', value: '', count: 2, suffix: 'new' },
];

/* -------------------------------- My children ------------------------------ */

export interface ChildCard {
  id: string;
  accent: string;
  ringValue: number;
  ringLabel: string;
  img: string;
  name: string;
  detail: string;
  tags: { label: string; className: string; icon?: string }[];
  headBadge: { label: string; icon: string; className: string };
  metrics: { label: string; value: string; suffix?: string }[];
  teacherRating: string;
}

export const childCards: ChildCard[] = [
  {
    id: 'emma',
    accent: 'accent-success',
    ringValue: 96,
    ringLabel: '96%',
    img: 'assets/img/students/student-01.jpg',
    name: 'Emma Daniel',
    detail: 'Grade 4 · Section A · Roll 35013',
    tags: [
      { label: 'Present today', className: 'accent-success badge-tag-dot' },
      { label: 'Top 5%', className: 'accent-purple', icon: 'ti ti-star' },
    ],
    headBadge: { label: '1 HW', icon: 'ti ti-book', className: 'accent-warning' },
    metrics: [
      { label: 'GPA', value: '8.8', suffix: '/10' },
      { label: 'Behavior', value: 'A' },
      { label: 'Rank', value: '3', suffix: 'rd' },
      { label: 'Next Exam', value: '3d' },
    ],
    teacherRating: 'Teacher 4.8',
  },
  {
    id: 'liam',
    accent: 'accent-info',
    ringValue: 91,
    ringLabel: '91%',
    img: 'assets/img/students/student-02.jpg',
    name: 'Liam Daniel',
    detail: 'Grade 6 · Section B · Roll 35098',
    tags: [
      { label: 'Present today', className: 'accent-success badge-tag-dot' },
      { label: 'Improving', className: 'accent-info', icon: 'ti ti-trending-up' },
    ],
    headBadge: { label: 'No HW', icon: 'ti ti-checks', className: 'accent-success' },
    metrics: [
      { label: 'GPA', value: '8.2', suffix: '/10' },
      { label: 'Behavior', value: 'A-' },
      { label: 'Rank', value: '7', suffix: 'th' },
      { label: 'Next Exam', value: '5d' },
    ],
    teacherRating: 'Teacher 4.6',
  },
];

/* ------------------------------ Subject vitals ----------------------------- */

export interface SubjectBlock {
  id: string;
  accent: string;
  icon: string;
  name: string;
  grade: string;
  sparkline: string;
  trend: string;
  /** English trends flat, so it uses the minus glyph rather than an arrow. */
  trendIcon: string;
  metrics: { icon: string; label: string; value: string }[];
  feedback: string;
  aiNote: string;
}

export const subjectBlocks: SubjectBlock[] = [
  {
    id: 'maths', accent: 'accent-success', icon: 'ti ti-math-symbols', name: 'Mathematics',
    grade: 'A+', sparkline: 'M0,17 L13,15 L27,10 L40,7 L54,4',
    trend: '+6% this month', trendIcon: 'ti ti-trending-up',
    metrics: [
      { icon: 'ti ti-calendar-check', label: 'Attendance', value: '98%' },
      { icon: 'ti ti-book', label: 'Homework', value: '12/12 done' },
      { icon: 'ti ti-target-arrow', label: 'Weak area', value: 'Word problems' },
    ],
    feedback: 'Excellent grasp of concepts — Ms. Teresa',
    aiNote: 'Ready for advanced problem sets.',
  },
  {
    id: 'science', accent: 'accent-success', icon: 'ti ti-flask', name: 'Science',
    grade: 'A', sparkline: 'M0,14 L13,12 L27,13 L40,8 L54,6',
    trend: '+3% this month', trendIcon: 'ti ti-trending-up',
    metrics: [
      { icon: 'ti ti-calendar-check', label: 'Attendance', value: '95%' },
      { icon: 'ti ti-book', label: 'Homework', value: '10/11 done' },
      { icon: 'ti ti-target-arrow', label: 'Weak area', value: 'Lab reports' },
    ],
    feedback: 'Curious and engaged — Mr. John',
    aiNote: "Revise chapter 4 before Friday's exam.",
  },
  {
    id: 'english', accent: 'accent-warning', icon: 'ti ti-book', name: 'English',
    grade: 'C+', sparkline: 'M0,10 L13,12 L27,11 L40,13 L54,12',
    trend: 'Needs focus', trendIcon: 'ti ti-minus',
    metrics: [
      { icon: 'ti ti-calendar-check', label: 'Attendance', value: '92%' },
      { icon: 'ti ti-book', label: 'Homework', value: '7/10 done' },
      { icon: 'ti ti-target-arrow', label: 'Weak area', value: 'Essay writing' },
    ],
    feedback: 'Add more detail to writing — Ms. Rita',
    aiNote: '30 min daily reading recommended.',
  },
  {
    id: 'social', accent: 'accent-info', icon: 'ti ti-globe', name: 'Social',
    grade: 'B+', sparkline: 'M0,13 L13,11 L27,12 L40,9 L54,8',
    trend: '+2% this month', trendIcon: 'ti ti-trending-up',
    metrics: [
      { icon: 'ti ti-calendar-check', label: 'Attendance', value: '96%' },
      { icon: 'ti ti-book', label: 'Homework', value: '9/9 done' },
      { icon: 'ti ti-target-arrow', label: 'Weak area', value: 'Map work' },
    ],
    feedback: 'Great class participation — Mr. Alan',
    aiNote: 'On track — maintain momentum.',
  },
  {
    id: 'computer', accent: 'accent-purple', icon: 'ti ti-code', name: 'Computer',
    grade: 'A', sparkline: 'M0,15 L13,11 L27,9 L40,6 L54,5',
    trend: '+8% this month', trendIcon: 'ti ti-trending-up',
    metrics: [
      { icon: 'ti ti-calendar-check', label: 'Attendance', value: '99%' },
      { icon: 'ti ti-book', label: 'Homework', value: '8/8 done' },
      { icon: 'ti ti-target-arrow', label: 'Weak area', value: 'None' },
    ],
    feedback: 'Natural talent for coding — Ms. Nina',
    aiNote: 'Suggest the robotics club.',
  },
];

/* --------------------------------- Timeline -------------------------------- */

export interface PortalTimelineEntry {
  id: string;
  accent: string;
  time: string;
  period: string;
  title: string;
  detail: string;
  live?: boolean;
}

export const childTimeline: PortalTimelineEntry[] = [
  { id: 'pt1', accent: 'accent-success', time: '08:10', period: 'AM', title: 'Checked into school', detail: 'Gate 2 · face recognition' },
  { id: 'pt2', accent: 'accent-primary', time: '09:20', period: 'AM', title: 'Completed Mathematics Quiz', detail: 'Score 18/20 · Ms. Teresa' },
  { id: 'pt3', accent: 'accent-warning', time: '11:40', period: 'AM', title: 'Teacher uploaded homework', detail: 'Math · due tomorrow', live: true },
  { id: 'pt4', accent: 'accent-info', time: '12:30', period: 'PM', title: 'Library book issued', detail: 'The Solar System · due 24 Jul' },
  { id: 'pt5', accent: 'accent-purple', time: '02:10', period: 'PM', title: 'School bus departed', detail: 'Route 12 · ETA home 03:30 PM' },
];

/* --------------------------------- Insights -------------------------------- */

export interface ParentInsight {
  id: string;
  accent: string;
  icon: string;
  title: string;
  /** Gauge fill percentage; animated from 0 on reveal. */
  gauge: number;
  body: { lead: string; rest: string };
  footNote: string;
  priority: { label: string; className: string };
}

export const parentInsights: ParentInsight[] = [
  { id: 'attendance', accent: 'accent-success', icon: 'ti ti-calendar-check', title: 'Attendance Risk', gauge: 12, body: { lead: 'Low risk.', rest: ' 96% attendance, above the 90% goal.' }, footNote: 'Keep it up', priority: { label: 'Low', className: 'priority-flag-low' } },
  { id: 'performance', accent: 'accent-primary', icon: 'ti ti-trending-up', title: 'Performance', gauge: 87, body: { lead: 'GPA rising to 9.2', rest: ' next term if English improves.' }, footNote: 'Support reading', priority: { label: 'Medium', className: 'priority-flag-medium' } },
  { id: 'reading', accent: 'accent-warning', icon: 'ti ti-book', title: 'Reading Progress', gauge: 64, body: { lead: '8 of 12 books', rest: ' — behind the reading target.' }, footNote: '30 min/day', priority: { label: 'High', className: 'priority-flag-high' } },
  { id: 'homework', accent: 'accent-info', icon: 'ti ti-checkbox', title: 'Homework', gauge: 88, body: { lead: 'Strong completion.', rest: ' 1 pending — Math, due tomorrow.' }, footNote: 'Remind tonight', priority: { label: 'Low', className: 'priority-flag-low' } },
  { id: 'exam', accent: 'accent-purple', icon: 'ti ti-hexagonal-prism-plus', title: 'Exam Readiness', gauge: 72, body: { lead: 'Science exam in 3 days.', rest: ' Revise chapter 4.' }, footNote: 'Revision plan', priority: { label: 'Medium', className: 'priority-flag-medium' } },
  { id: 'social', accent: 'accent-pink', icon: 'ti ti-users', title: 'Social Participation', gauge: 80, body: { lead: 'Active in clubs.', rest: ' Debate & science fair this month.' }, footNote: 'Encourage', priority: { label: 'Low', className: 'priority-flag-low' } },
];

/* ------------------------------ Communication ------------------------------ */

export interface MailRow {
  id: string;
  accent: string;
  avatar?: string;
  icon?: string;
  sender: string;
  tag?: { label: string; className: string };
  attachment?: boolean;
  preview: string;
  time: string;
  unread?: boolean;
  modal: ParentModalId;
}

export const mailRows: MailRow[] = [
  { id: 'ml1', accent: 'accent-primary', avatar: 'assets/img/teachers/teacher-01.jpg', sender: 'Ms. Teresa Susan', tag: { label: 'Math', className: 'accent-primary' }, preview: "Emma did great on today's quiz — 18/20!", time: '2m', unread: true, modal: 'message' },
  { id: 'ml2', accent: 'accent-danger', icon: 'ti ti-school', sender: "Principal's Office", attachment: true, preview: 'Term-end report cards are now available.', time: '1h', unread: true, modal: 'message' },
  { id: 'ml3', accent: 'accent-teal', icon: 'ti ti-calendar-plus', sender: 'PTA Meeting Invite', tag: { label: 'RSVP', className: 'accent-teal' }, preview: '28 Jul, 4:00 PM · Grade 4 parents', time: '3h', modal: 'meeting' },
  { id: 'ml4', accent: 'accent-purple', icon: 'ti ti-microphone', sender: 'Ms. Rita Owen', tag: { label: 'Voice · 0:42', className: 'accent-purple' }, preview: 'Voice message about the reading log…', time: '1d', modal: 'message' },
  { id: 'ml5', accent: 'accent-info', icon: 'ti ti-speakerphone', sender: 'School Announcement', preview: 'Annual Science Fair — 27 Jul, Auditorium.', time: '1d', modal: 'message' },
];

/* ----------------------------------- Bus ----------------------------------- */

export const busRoute = {
  fill: '52%',
  stops: [
    { id: 'school', label: 'School', left: '8%', completed: true },
    { id: 'oak', label: 'Oak Ave', left: '36%', completed: true },
    { id: 'maple', label: 'Maple St', left: '64%', completed: false },
    { id: 'home', label: 'Home', left: '92%', completed: false },
  ],
  eta: '07:41 AM',
  speed: '32 km/h · on time',
};

export const busCells = [
  { id: 'bus', accent: 'accent-primary', icon: 'ti ti-bus', value: 'BUS-04 · Route 12', label: 'Downtown loop' },
  { id: 'driver', accent: 'accent-teal', icon: 'ti ti-user', value: 'Michael Doe', label: 'Driver · +1 4587 220' },
  { id: 'pickup', accent: 'accent-success', icon: 'ti ti-clock', value: '07:45 AM', label: 'Pickup time' },
  { id: 'drop', accent: 'accent-warning', icon: 'ti ti-clock-hour-3', value: '03:30 PM', label: 'Drop time' },
];

/* ------------------------------ Homework board ----------------------------- */

export interface TaskCard {
  id: string;
  accent: string;
  subject: string;
  subjectIcon: string;
  title: string;
  meta: { icon?: string; label: string; grade?: boolean }[];
}

export interface TaskColumn {
  id: string;
  accent: string;
  title: string;
  count: string;
  cards: TaskCard[];
}

export const taskBoard: TaskColumn[] = [
  {
    id: 'todo', accent: 'accent-warning', title: 'To Do', count: '2',
    cards: [
      { id: 'tc1', accent: 'accent-primary', subject: 'Math', subjectIcon: 'ti ti-math-symbols', title: 'Algebra Worksheet 4', meta: [{ icon: 'ti ti-user', label: 'Ms. Teresa' }, { icon: 'ti ti-clock', label: 'Tomorrow' }] },
      { id: 'tc2', accent: 'accent-warning', subject: 'English', subjectIcon: 'ti ti-book', title: 'Essay: Favourite Season', meta: [{ icon: 'ti ti-user', label: 'Ms. Rita' }, { icon: 'ti ti-paperclip', label: '1 file' }] },
    ],
  },
  {
    id: 'progress', accent: 'accent-primary', title: 'In Progress', count: '1',
    cards: [
      { id: 'tc3', accent: 'accent-info', subject: 'Social', subjectIcon: 'ti ti-globe', title: 'Map Study — Continents', meta: [{ icon: 'ti ti-user', label: 'Mr. Alan' }, { icon: 'ti ti-clock', label: '2 days' }] },
    ],
  },
  {
    id: 'submitted', accent: 'accent-info', title: 'Submitted', count: '2',
    cards: [
      { id: 'tc4', accent: 'accent-success', subject: 'Math', subjectIcon: 'ti ti-math-symbols', title: 'Fractions Practice', meta: [{ icon: 'ti ti-check', label: 'Submitted' }, { icon: 'ti ti-clock', label: '2d ago' }] },
      { id: 'tc5', accent: 'accent-success', subject: 'Science', subjectIcon: 'ti ti-flask', title: 'Plant Life Cycle', meta: [{ icon: 'ti ti-check', label: 'Submitted' }, { icon: 'ti ti-clock', label: '3d ago' }] },
    ],
  },
  {
    id: 'reviewed', accent: 'accent-success', title: 'Reviewed', count: '2',
    cards: [
      { id: 'tc6', accent: 'accent-success', subject: 'Math', subjectIcon: 'ti ti-math-symbols', title: 'Unit Test II', meta: [{ label: 'A+ · 94%', grade: true }, { icon: 'ti ti-message-2', label: 'Feedback' }] },
      { id: 'tc7', accent: 'accent-warning', subject: 'English', subjectIcon: 'ti ti-book', title: 'Reading Log W3', meta: [{ label: 'B · 78%', grade: true }, { icon: 'ti ti-message-2', label: 'Feedback' }] },
    ],
  },
];

/* --------------------------------- Finance --------------------------------- */

export const financeSegments = [
  { id: 'paid', color: '#16a34a', flex: 65 },
  { id: 'pending', color: '#d97706', flex: 22 },
  { id: 'overdue', color: '#e11d48', flex: 6 },
  { id: 'rest', color: 'var(--px-inset)', flex: 7 },
];

export interface PaymentLine {
  id: string;
  accent: string;
  icon: string;
  title: string;
  detail: string;
  amount: string;
  badge?: { label: string; className: string };
  receipt?: boolean;
}

export const paymentLines: PaymentLine[] = [
  { id: 'pl1', accent: 'accent-warning', icon: 'ti ti-calendar-due', title: 'Term II Tuition', detail: 'Upcoming · due 25 Dec 2024', amount: '$2,000', badge: { label: 'Due', className: 'accent-warning' } },
  { id: 'pl2', accent: 'accent-success', icon: 'ti ti-circle-check', title: 'Term I Tuition', detail: 'Paid 05 Sep · Card ····4521', amount: '$3,000', receipt: true },
  { id: 'pl3', accent: 'accent-success', icon: 'ti ti-circle-check', title: 'Admission Fee', detail: 'Paid 18 Mar · Bank transfer', amount: '$3,500', receipt: true },
];

/* --------------------------------- Exam hub -------------------------------- */

export const examCountdown = [
  { id: 'days', count: 3, label: 'Days' },
  { id: 'hrs', count: 14, label: 'Hrs' },
  { id: 'min', count: 20, label: 'Min' },
];

export const examReadiness = [
  { id: 'science', accent: 'accent-success', subject: 'Science', filled: 4, percent: '80%' },
  { id: 'maths', accent: 'accent-primary', subject: 'Maths', filled: 5, percent: '92%' },
  { id: 'english', accent: 'accent-warning', subject: 'English', filled: 2, percent: '55%' },
];

/* ------------------------------- Achievements ------------------------------ */

export const achievementBadges = [
  { id: 'olympiad', accent: 'accent-warning', icon: 'ti ti-medal', title: 'Math Olympiad', subtitle: 'Certificate', revealTitle: 'Gold · 1st place', revealDetail: 'Inter-school, Dec 2024' },
  { id: 'sprint', accent: 'accent-success', icon: 'ti ti-run', title: '100m Sprint', subtitle: 'Sports', revealTitle: 'Gold Medal', revealDetail: 'Annual Sports Day' },
  { id: 'debate', accent: 'accent-purple', icon: 'ti ti-microphone-2', title: 'Debate', subtitle: 'Competition', revealTitle: 'Runner-up', revealDetail: 'Regional finals 2024' },
  { id: 'bookworm', accent: 'accent-info', icon: 'ti ti-book', title: 'Bookworm', subtitle: 'Reading', revealTitle: '50 books read', revealDetail: 'Library reading challenge' },
  { id: 'perfect', accent: 'accent-primary', icon: 'ti ti-calendar-check', title: 'Perfect Month', subtitle: 'Attendance', revealTitle: '100% · October', revealDetail: 'No absences' },
  { id: 'monitor', accent: 'accent-pink', icon: 'ti ti-star', title: 'Class Monitor', subtitle: 'Leadership', revealTitle: 'Elected leader', revealDetail: 'Term II 2024–25' },
];

/* ---------------------------------- Agenda --------------------------------- */

export const agendaGroups = [
  {
    id: 'today', label: 'Today · 21 Jul',
    items: [{ id: 'ag1', accent: 'accent-info', time: '01:00 PM', title: 'Computer Science Class', detail: 'Lab 01 · Ms. Nina' }],
  },
  {
    id: 'week', label: 'This Week',
    items: [
      { id: 'ag2', accent: 'accent-purple', time: '25 Jul', title: 'Science Term Test', detail: 'Exam · Lab 01' },
      { id: 'ag3', accent: 'accent-success', time: '27 Jul', title: 'Annual Science Fair', detail: 'Competition · Auditorium' },
      { id: 'ag4', accent: 'accent-teal', time: '28 Jul', title: 'PTA Meeting', detail: 'Grade 4 parents · 4:00 PM' },
    ],
  },
  {
    id: 'upcoming', label: 'Upcoming',
    items: [
      { id: 'ag5', accent: 'accent-warning', time: '30 Jul', title: 'Sports Day', detail: 'All houses · Ground' },
      { id: 'ag6', accent: 'accent-danger', time: '01 Aug', title: 'Independence Day', detail: 'Holiday · School closed' },
    ],
  },
];

/* ------------------------------ Notifications ------------------------------ */

export const notificationGroups = [
  {
    id: 'today', label: 'Today',
    items: [
      { id: 'nf1', accent: 'accent-danger', icon: 'ti ti-urgent', title: 'Emergency Notice', detail: 'Fire drill completed — all students safe.', time: '11:30' },
      { id: 'nf2', accent: 'accent-warning', icon: 'ti ti-book', title: 'Homework Due', detail: 'Algebra Worksheet 4 · due tomorrow', time: '11:40' },
      { id: 'nf3', accent: 'accent-pink', icon: 'ti ti-message', title: 'New teacher message', detail: 'Ms. Teresa: great quiz result!', time: '09:22' },
    ],
  },
  {
    id: 'yesterday', label: 'Yesterday',
    items: [
      { id: 'nf4', accent: 'accent-purple', icon: 'ti ti-hexagonal-prism-plus', title: 'Exam Alert', detail: 'Science Term Test on Friday', time: '04:10' },
      { id: 'nf5', accent: 'accent-info', icon: 'ti ti-bus', title: 'Transport update', detail: 'Bus arrived home at 03:32 PM', time: '03:32' },
    ],
  },
  {
    id: 'earlier', label: 'Earlier',
    items: [
      { id: 'nf6', accent: 'accent-success', icon: 'ti ti-cash', title: 'Fee Reminder', detail: 'Term II tuition due 25 Dec', time: '2d' },
    ],
  },
];

/* ------------------------------- File exports ------------------------------ */

/** Verbatim from `reportCard()` in parent-portal.js. */
export const REPORT_CARD_BODY = `PRESKOOL ACADEMY - REPORT CARD (Term II 2024-26)
Student: Emma Daniel - Grade 4-A
Parent: Robert Daniel (PAR-2043)

Mathematics   94%   A+
Science       91%   A
English       68%   C+
Social        85%   B+
Computer      90%   A

GPA: 8.8/10 | Rank: 3/42 | Attendance: 96% | Behaviour: A
Result: PASS (Distinction) | Class Teacher: Ms. Teresa Susan
`;

/** Verbatim from `receipt()` in parent-portal.js. */
export const RECEIPT_BODY = `PRESKOOL ACADEMY - FEE RECEIPT
Student: Emma Daniel - Grade 4-A
Paid: $3,000 (Term I Tuition)
Date: 05 Sep 2024 | Method: Card ****4521
Status: PAID - Confirmed
`;

/** Toast copy, verbatim from the `TOAST` map in parent-portal.js. */
export const ACTION_TOASTS: Record<string, { message: string; variant: 'success' | 'info' }> = {
  track: { message: 'Live bus tracking — 1.2 km away, ETA 07:41.', variant: 'info' },
  call_driver: { message: 'Calling driver — Michael Doe.', variant: 'info' },
  receipt: { message: 'Downloading receipt…', variant: 'success' },
  mark_read: { message: 'All notifications marked as read.', variant: 'success' },
  report: { message: 'Downloading report card…', variant: 'info' },
};
