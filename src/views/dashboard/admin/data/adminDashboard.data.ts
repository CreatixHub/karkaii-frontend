import { all_routes } from '@/routes/all_routes';

const routes = all_routes;

/* ---------------------------------- Header --------------------------------- */

export interface DropdownItem {
  label: string;
  icon?: string;
  to?: string;
}

export const academicYearOptions: DropdownItem[] = [
  { label: 'AY 2025-26' },
  { label: 'AY 2024-26' },
  { label: 'AY 2023-24' },
];

export const dateRangeOptions: DropdownItem[] = [
  { label: 'Today' },
  { label: 'This Week' },
  { label: 'This Month' },
  { label: 'This Quarter' },
  { label: 'This Year' },
];

export const exportOptions: DropdownItem[] = [
  { label: 'Export as PDF', icon: 'ti ti-file-type-pdf' },
  { label: 'Export as Excel', icon: 'ti ti-file-type-xls' },
  { label: 'Print', icon: 'ti ti-printer' },
];

export const quickAddOptions: DropdownItem[] = [
  { label: 'Add Student', icon: 'ti ti-user-plus', to: routes.addStudent },
  { label: 'Add Teacher', icon: 'ti ti-chalkboard', to: routes.addTeacher },
  { label: 'New Admission', icon: 'ti ti-notebook', to: routes.addAdmission },
  { label: 'Collect Fees', icon: 'ti ti-report-money', to: routes.collectFees },
];

/* --------------------------------- Welcome --------------------------------- */

export interface KpiTile {
  id: string;
  icon: string;
  iconClass: string;
  value: string;
  label: string;
  delta: string;
  deltaIcon: string;
  deltaDirection: 'up' | 'down';
}

export const welcomeKpis: KpiTile[] = [
  {
    id: 'attendance',
    icon: 'ti ti-checkbox',
    iconClass: 'bg-success-transparent',
    value: '94.8%',
    label: "Today's Attendance",
    delta: '0.8%',
    deltaIcon: 'ti ti-trending-up',
    deltaDirection: 'up',
  },
  {
    id: 'admissions',
    icon: 'ti ti-user-plus',
    iconClass: 'bg-primary-transparent',
    value: '128',
    label: 'New Admissions',
    delta: '12',
    deltaIcon: 'ti ti-trending-up',
    deltaDirection: 'up',
  },
  {
    id: 'fees',
    icon: 'ti ti-currency-dollar',
    iconClass: 'bg-warning-transparent',
    value: '$48.6K',
    label: 'Fees Today',
    delta: '3.2%',
    deltaIcon: 'ti ti-trending-up',
    deltaDirection: 'up',
  },
  {
    id: 'exams',
    icon: 'ti ti-file-certificate',
    iconClass: 'bg-purple-transparent',
    value: '09',
    label: 'Upcoming Exams',
    delta: '2d',
    deltaIcon: 'ti ti-clock',
    deltaDirection: 'down',
  },
];

/* -------------------------------- Spotlight -------------------------------- */

export interface SpotlightStat {
  value: string;
  label: string;
}

export interface SpotlightCardData {
  id: string;
  variant: 'perf-green' | 'perf-blue';
  badgeLabel: string;
  badgeIcon: string;
  badgeClass: string;
  stars: number;
  /** Whether the final star is a half star. */
  halfStar: boolean;
  name: string;
  subtitle: string;
  subtitleIcon: string;
  achievement: string;
  achievementIcon: string;
  stats: SpotlightStat[];
  image: string;
}

export const spotlightCards: SpotlightCardData[] = [
  {
    id: 'best-teacher',
    variant: 'perf-green',
    badgeLabel: 'Best Teacher',
    badgeIcon: 'ti ti-trophy',
    badgeClass: 'bg-white text-success',
    stars: 4,
    halfStar: true,
    name: 'Sarah Mitchell',
    subtitle: 'Physics Department',
    subtitleIcon: 'ti ti-atom',
    achievement: 'Teacher of the Year 2024',
    achievementIcon: 'ti ti-medal',
    stats: [
      { value: '4.9', label: 'Rating' },
      { value: '98%', label: 'Pass' },
      { value: '320', label: 'Students' },
    ],
    image: 'assets/img/performer/performer-01.png',
  },
  {
    id: 'top-student',
    variant: 'perf-blue',
    badgeLabel: 'Top Student',
    badgeIcon: 'ti ti-award',
    badgeClass: 'bg-white text-primary',
    stars: 5,
    halfStar: false,
    name: 'Emily Carter',
    subtitle: 'Grade XII-A · Science',
    subtitleIcon: 'ti ti-school',
    achievement: 'National Olympiad Gold',
    achievementIcon: 'ti ti-medal-2',
    stats: [
      { value: '3.98', label: 'GPA' },
      { value: '#1', label: 'Rank' },
      { value: '99%', label: 'Attendance' },
    ],
    image: 'assets/img/performer/student-performer-01.png',
  },
];

/* --------------------------- Class-wise distribution ----------------------- */

export interface DistributionRow {
  label: string;
  count: string;
  percent: string;
  /** Bar fill width, which is scaled for readability, not equal to percent. */
  width: string;
  meterClass: string;
}

export const classDistribution: DistributionRow[] = [
  { label: 'Pre-Primary (KG)', count: '312', percent: '9%', width: '22%', meterClass: 'meter-purple' },
  { label: 'Primary (I–V)', count: '1,180', percent: '32%', width: '92%', meterClass: 'meter-primary' },
  { label: 'Middle (VI–VIII)', count: '902', percent: '25%', width: '72%', meterClass: 'meter-info' },
  { label: 'Secondary (IX–X)', count: '748', percent: '20%', width: '60%', meterClass: 'meter-success' },
  { label: 'Senior (XI–XII)', count: '512', percent: '14%', width: '42%', meterClass: 'meter-warning' },
];

/* --------------------------- Attendance breakdown -------------------------- */

export interface AttendanceTile {
  id: string;
  icon: string;
  iconClass: string;
  value: string;
  label: string;
}

export const attendanceTiles: AttendanceTile[] = [
  { id: 'present', icon: 'ti ti-user-check', iconClass: 'bg-success-transparent', value: '3,464', label: 'Present · 94%' },
  { id: 'absent', icon: 'ti ti-user-x', iconClass: 'bg-danger-transparent', value: '190', label: 'Absent · 5%' },
  { id: 'leave', icon: 'ti ti-user-exclamation', iconClass: 'bg-warning-transparent', value: '64', label: 'On Leave · 1%' },
  { id: 'late', icon: 'ti ti-clock-hour-8', iconClass: 'bg-info-transparent', value: '37', label: 'Late · 1.0%' },
];

export interface GroupAttendance {
  label: string;
  icon: string;
  percent: string;
  meterClass: string;
}

export const attendanceByGroup: GroupAttendance[] = [
  { label: 'Students', icon: 'ti ti-users-group text-success', percent: '95%', meterClass: 'meter-success' },
  { label: 'Teachers', icon: 'ti ti-chalkboard text-primary', percent: '96%', meterClass: 'meter-primary' },
  { label: 'Staff', icon: 'ti ti-briefcase text-info', percent: '91%', meterClass: 'meter-info' },
];

/* ---------------------------- Parent engagement ---------------------------- */

export const engagementBreakdown: GroupAttendance[] = [
  { label: 'Highly Active', icon: 'ti ti-point-filled text-success', percent: '42%', meterClass: 'meter-success' },
  { label: 'Active', icon: 'ti ti-point-filled text-primary', percent: '36%', meterClass: 'meter-primary' },
  { label: 'Occasional / Inactive', icon: 'ti ti-point-filled text-warning', percent: '22%', meterClass: 'meter-warning' },
];

/* ------------------------------ Delivery channels -------------------------- */

export interface DeliveryChannel {
  id: string;
  label: string;
  icon: string;
  iconClass: string;
  color: string;
  data: number[];
  rate: string;
  sent: string;
}

export const deliveryChannels: DeliveryChannel[] = [
  {
    id: 'sms',
    label: 'SMS',
    icon: 'ti ti-message-2',
    iconClass: 'bg-success-transparent',
    color: '#16a34a',
    data: [60, 72, 55, 84, 78, 92, 100],
    rate: '98.6%',
    sent: '8.9k sent',
  },
  {
    id: 'email',
    label: 'Email',
    icon: 'ti ti-mail-opened',
    iconClass: 'bg-primary-transparent',
    color: '#3d5ee1',
    data: [50, 66, 58, 70, 62, 80, 88],
    rate: '92.3%',
    sent: '6.2k sent',
  },
  {
    id: 'push',
    label: 'App Push',
    icon: 'ti ti-bell-ringing',
    iconClass: 'bg-warning-transparent',
    color: '#f39c12',
    data: [70, 64, 82, 76, 90, 86, 96],
    rate: '96.1%',
    sent: '5.1k sent',
  },
  {
    id: 'whatsapp',
    label: 'WhatsApp',
    icon: 'ti ti-brand-whatsapp',
    iconClass: 'bg-success-transparent',
    color: '#16a34a',
    data: [78, 84, 72, 90, 88, 95, 99],
    rate: '99.1%',
    sent: '4.4k sent',
  },
];

/* ------------------------------ Activity feed ------------------------------ */

export interface ActivityItem {
  id: string;
  kind: 'divider' | 'entry';
  /** Divider label, e.g. "Today". */
  dividerLabel?: string;
  icon?: string;
  iconClass?: string;
  /** Rendered as the item's headline; may contain a highlighted fragment. */
  title?: string;
  highlight?: string;
  titleSuffix?: string;
  time?: string;
  priority?: { label: string; className: string };
  badge?: { label: string; className: string };
  avatar?: string;
  /** True for the first entry, which uses a larger heading in the template. */
  isLead?: boolean;
}

export const activityFeed: ActivityItem[] = [
  { id: 'd1', kind: 'divider', dividerLabel: 'Today' },
  {
    id: 'a1',
    kind: 'entry',
    icon: 'ti ti-send',
    iconClass: 'bg-primary-transparent',
    title: 'Fee reminder circular sent to ',
    highlight: '412 parents',
    time: '20m',
    priority: { label: 'High', className: 'chip-danger' },
    badge: { label: 'Circular', className: 'badge-soft-primary' },
    isLead: true,
  },
  {
    id: 'a2',
    kind: 'entry',
    icon: 'ti ti-message-2',
    iconClass: 'bg-success-transparent',
    title: 'SMS batch delivered — ',
    highlight: '98.6%',
    titleSuffix: ' success',
    time: '1h',
    badge: { label: 'Delivered', className: 'badge-soft-success' },
  },
  {
    id: 'a3',
    kind: 'entry',
    icon: 'ti ti-calendar-event',
    iconClass: 'bg-info-transparent',
    avatar: 'assets/img/parents/parent-01.jpg',
    highlight: 'Robert Daniel',
    titleSuffix: ' requested a meeting',
    time: '2h',
    priority: { label: 'Med', className: 'chip-warning' },
    badge: { label: 'Meeting', className: 'badge-soft-info' },
  },
  { id: 'd2', kind: 'divider', dividerLabel: 'Yesterday' },
  {
    id: 'a4',
    kind: 'entry',
    icon: 'ti ti-speakerphone',
    iconClass: 'bg-warning-transparent',
    title: 'Sports Day circular published',
    time: '4:12 PM',
    badge: { label: 'Notice', className: 'badge-soft-warning' },
  },
  {
    id: 'a5',
    kind: 'entry',
    icon: 'ti ti-mail-forward',
    iconClass: 'bg-purple-transparent',
    avatar: 'assets/img/parents/parent-05.jpg',
    highlight: 'Steven Vance',
    titleSuffix: ' replied to newsletter',
    time: '11:03 AM',
    badge: { label: 'Email', className: 'badge-soft-primary' },
  },
  { id: 'd3', kind: 'divider', dividerLabel: 'Earlier' },
  {
    id: 'a6',
    kind: 'entry',
    icon: 'ti ti-checks',
    iconClass: 'bg-success-transparent',
    title: 'Term 1 report cards approved — ',
    highlight: '18 classes',
    time: '2 days ago',
    badge: { label: 'Approved', className: 'badge-soft-success' },
  },
];

/* ---------------------------- Parent messages ------------------------------ */

export interface ParentMessage {
  id: string;
  name: string;
  avatar: string;
  presence: 'is-online' | 'is-away';
  unread: boolean;
  time: string;
  subject: string;
  subjectBadge: { label: string; className: string };
  preview: string;
  meta: { label: string; icon: string; className: string }[];
  /** The third message offers an inline reply box instead of hover actions. */
  quickReply?: boolean;
}

export const parentMessages: ParentMessage[] = [
  {
    id: 'm1',
    name: 'Robert Daniel',
    avatar: 'assets/img/parents/parent-01.jpg',
    presence: 'is-online',
    unread: true,
    time: '2m',
    subject: 'Fee clarification for Term 2',
    subjectBadge: { label: 'High', className: 'badge-soft-danger' },
    preview: 'Could you please confirm the revised due date for the second term…',
    meta: [
      { label: '2 files', icon: 'ti ti-paperclip', className: 'chip-muted' },
      { label: 'SLA 1h left', icon: 'ti ti-alarm', className: 'chip-soft chip-warning' },
    ],
  },
  {
    id: 'm2',
    name: 'Linda Michael',
    avatar: 'assets/img/parents/parent-02.jpg',
    presence: 'is-away',
    unread: false,
    time: '1h',
    subject: 'Progress report received',
    subjectBadge: { label: 'Replied', className: 'badge-soft-success' },
    preview: 'Thank you for sharing the detailed progress report — very helpful…',
    meta: [
      { label: 'Replied in 42m', icon: 'ti ti-circle-check', className: 'chip-soft chip-info' },
    ],
  },
  {
    id: 'm3',
    name: 'Steven Vance',
    avatar: 'assets/img/parents/parent-05.jpg',
    presence: 'is-online',
    unread: true,
    time: '3h',
    subject: 'Sports day participation',
    subjectBadge: { label: 'Medium', className: 'badge-soft-warning' },
    preview: 'Will Rachel be able to join the annual sports day this year?',
    meta: [
      { label: '1 image', icon: 'ti ti-photo', className: 'chip-muted' },
      { label: 'SLA 4h left', icon: 'ti ti-alarm', className: 'chip-soft chip-info' },
    ],
    quickReply: true,
  },
];

/* --------------------------- Enrollment summary ---------------------------- */

export interface SummaryCard {
  id: string;
  label: string;
  value: string;
  badge: string;
  footnote: string;
  footnoteIcon: string;
}

export const enrollmentSummary: SummaryCard[] = [
  {
    id: 'total',
    label: 'Total Students',
    value: '3,654',
    badge: '4.6%',
    footnote: 'vs 3,493 last year',
    footnoteIcon: 'ti ti-point-filled text-primary',
  },
  {
    id: 'growth',
    label: 'Growth Rate',
    value: '4.6%',
    badge: '0.8%',
    footnote: 'Above 3.8% target',
    footnoteIcon: 'ti ti-point-filled text-success',
  },
  {
    id: 'admissions',
    label: 'New Admissions',
    value: '128',
    badge: '12',
    footnote: 'this term',
    footnoteIcon: 'ti ti-point-filled text-warning',
  },
];

/* --------------------------- Gender distribution --------------------------- */

export interface GenderRow {
  id: string;
  label: string;
  icon: string;
  iconClass: string;
  accentClass: string;
  meterClass: string;
  value: string;
  width: string;
}

export const genderRows: GenderRow[] = [
  {
    id: 'male',
    label: 'Male',
    icon: 'ti ti-gender-male',
    iconClass: 'bg-primary-transparent',
    accentClass: 'accent-primary',
    meterClass: 'meter-primary',
    value: '1,965 · 53.8%',
    width: '53.8%',
  },
  {
    id: 'female',
    label: 'Female',
    icon: 'ti ti-gender-female',
    iconClass: 'bg-pink-transparent',
    accentClass: 'accent-pink',
    meterClass: 'meter-pink',
    value: '1,689 · 46.2%',
    width: '46.2%',
  },
  {
    id: 'other',
    label: 'Other',
    icon: 'ti ti-friends',
    iconClass: 'bg-purple-transparent',
    accentClass: 'accent-purple',
    meterClass: 'meter-purple',
    value: '0 · 0.0%',
    width: '0%',
  },
];
