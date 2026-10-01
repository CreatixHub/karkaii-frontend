/** The eight cards in the `.summary-strip`, in template order. */
export interface SummaryCard {
  id: string;
  accent: string;
  icon: string;
  /** The figure the template hardcoded; live cards override it from the roster. */
  value: string;
  label: string;
  /** Only the "Avg Rating" card ships a sparkline. */
  spark?: string[];
}

export const summaryCards: SummaryCard[] = [
  { id: 'total', accent: 'accent-primary', icon: 'ti ti-users', value: '248', label: 'Total Teachers' },
  { id: 'selected', accent: 'accent-purple', icon: 'ti ti-checkbox', value: '0', label: 'Selected' },
  { id: 'active', accent: 'accent-success', icon: 'ti ti-user-check', value: '8', label: 'Active' },
  { id: 'inactive', accent: 'accent-slate', icon: 'ti ti-user-off', value: '3', label: 'Inactive' },
  { id: 'new', accent: 'accent-warning', icon: 'ti ti-user-plus', value: '32', label: 'New This Year' },
  { id: 'graduated', accent: 'accent-info', icon: 'ti ti-book', value: '8', label: 'Subjects' },
  { id: 'filtered', accent: 'accent-teal', icon: 'ti ti-filter', value: '11', label: 'Filtered Results' },
  {
    id: 'stats',
    accent: 'accent-danger',
    icon: 'ti ti-star',
    value: '4.6',
    label: 'Avg Rating',
    spark: ['40%', '65%', '50%', '80%', '70%', '95%'],
  },
];

/**
 * The four "Summary Metrics" rows are identical on every card apart from their
 * percentage and bar colour, so the labels live here once.
 */
export const metricFields: { label: string; icon: string }[] = [
  { label: 'Attendance Rate', icon: 'ti ti-calendar-check' },
  { label: 'Class Performance', icon: 'ti ti-chart-line' },
  { label: 'Assignment Completion', icon: 'ti ti-checklist' },
  { label: 'Parent Communication', icon: 'ti ti-message-2' },
];

export interface TeacherMetric {
  value: number;
  /** `bg-success` / `bg-warning` / `bg-danger`, as the template wrote it. */
  bar: string;
}

export interface TeacherCard {
  /** Unique row key — the template repeats T849127 on two different cards. */
  key: string;
  /** Employee id printed in the card header. */
  id: string;
  name: string;
  avatar: string;
  /** The template adds `online` to the avatar of every card but the inactive ones. */
  online: boolean;
  status: 'Active' | 'Inactive';
  statusBadge: string;
  employment: { label: string; className: string };
  department: string;
  qualification: string;
  subject: string;
  classes: string;
  /** Parsed out of `classes` so the Class filter can match a single level. */
  classLevels: string[];
  phone: string;
  email: string;
  experience: string;
  branch: string;
  lastLogin: string;
  joined: string;
  /** Not marked on the cards; needed by the Academic Year filter. */
  year: string;
  /**
   * The template's own `data-search` haystack — kept verbatim so the toolbar
   * search matches exactly what the template's script would have matched.
   */
  search: string;
  /** The template's first two cards use a larger heading than the rest. */
  heading: { tag: 'h4' | 'h5' | 'h6'; className: string };
  metrics: TeacherMetric[];
}

export const teachers: TeacherCard[] = [
  {
    key: 'tea-1',
    id: 'T849127',
    name: 'Teresa',
    avatar: 'assets/img/teachers/teacher-01.jpg',
    online: true,
    status: 'Active',
    statusBadge: 'badge-soft-success',
    employment: { label: 'Full Time', className: 'badge-soft-info' },
    department: 'Science Dept.',
    qualification: 'M.Sc, B.Ed',
    subject: 'Physics',
    classes: 'III A',
    classLevels: ['III'],
    phone: '+1 82392 37359',
    email: 'teresa@example.com',
    experience: '8 yrs',
    branch: 'Primary Campus',
    lastLogin: 'Last login 2 hrs ago',
    joined: 'Joined 12 Jun 2019',
    year: '2024/2025',
    search: 'teresa t849127 iii a physics teresa@example.com active +1 82392 37359',
    heading: { tag: 'h4', className: 'text-dark text-truncate mb-0 fs-15 fw-medium' },
    metrics: [
      { value: 96, bar: 'bg-success' },
      { value: 92, bar: 'bg-success' },
      { value: 90, bar: 'bg-success' },
      { value: 88, bar: 'bg-success' },
    ],
  },
  {
    key: 'tea-2',
    id: 'T849126',
    name: 'Daniel',
    avatar: 'assets/img/teachers/teacher-02.jpg',
    online: true,
    status: 'Active',
    statusBadge: 'badge-soft-success',
    employment: { label: 'Full Time', className: 'badge-soft-info' },
    department: 'Computer Science Dept.',
    qualification: 'MCA',
    subject: 'Computer',
    classes: 'II (A)',
    classLevels: ['II'],
    phone: '+1 56752 86742',
    email: 'daniel@example.com',
    experience: '6 yrs',
    branch: 'North Branch',
    lastLogin: 'Last login 2 hrs ago',
    joined: 'Joined 12 Jun 2019',
    year: '2024/2025',
    search: 'daniel t849126 ii a computer daniel@example.com active +1 56752 86742',
    heading: { tag: 'h5', className: 'text-dark text-truncate mb-0 fs-15' },
    metrics: [
      { value: 93, bar: 'bg-success' },
      { value: 88, bar: 'bg-success' },
      { value: 84, bar: 'bg-success' },
      { value: 80, bar: 'bg-success' },
    ],
  },
  {
    key: 'tea-3',
    id: 'T849125',
    name: 'Hellana',
    avatar: 'assets/img/teachers/teacher-03.jpg',
    online: false,
    status: 'Inactive',
    statusBadge: 'badge-soft-secondary',
    employment: { label: 'Part Time', className: 'badge-soft-warning' },
    department: 'Languages Dept.',
    qualification: 'M.A, B.Ed',
    subject: 'English',
    classes: 'VI (A)',
    classLevels: ['VI'],
    phone: '+1 23566 52683',
    email: 'hellana@example.com',
    experience: '10 yrs',
    branch: 'Primary Campus',
    lastLogin: 'Last login 2 hrs ago',
    joined: 'Joined 12 Jun 2019',
    year: '2024/2025',
    search: 'hellana t849125 vi a english hellana@example.com inactive +1 23566 52683',
    heading: { tag: 'h6', className: 'text-dark text-truncate mb-0' },
    metrics: [
      { value: 70, bar: 'bg-warning' },
      { value: 64, bar: 'bg-warning' },
      { value: 58, bar: 'bg-warning' },
      { value: 60, bar: 'bg-warning' },
    ],
  },
  {
    key: 'tea-4',
    id: 'T849124',
    name: 'Erickson',
    avatar: 'assets/img/teachers/teacher-06.jpg',
    online: false,
    status: 'Inactive',
    statusBadge: 'badge-soft-secondary',
    employment: { label: 'Contract', className: 'badge-soft-purple' },
    department: 'Science Dept.',
    qualification: 'M.Sc',
    subject: 'Chemistry',
    classes: 'I (A)',
    classLevels: ['I'],
    phone: '+1 26267 80542',
    email: 'aaron@example.com',
    experience: '4 yrs',
    branch: 'West Branch',
    lastLogin: 'Last login 2 hrs ago',
    joined: 'Joined 12 Jun 2019',
    year: '2024/2025',
    search: 'erickson t849124 i a chemistry aaron@example.com inactive +1 26267 80542',
    heading: { tag: 'h6', className: 'text-dark text-truncate mb-0' },
    metrics: [
      { value: 55, bar: 'bg-warning' },
      { value: 48, bar: 'bg-danger' },
      { value: 42, bar: 'bg-danger' },
      { value: 50, bar: 'bg-warning' },
    ],
  },
  {
    key: 'tea-5',
    id: 'T849121',
    name: 'Morgan',
    avatar: 'assets/img/teachers/teacher-07.jpg',
    online: true,
    status: 'Active',
    statusBadge: 'badge-soft-success',
    employment: { label: 'Full Time', className: 'badge-soft-info' },
    department: 'Mathematics Dept.',
    qualification: 'M.Sc, B.Ed',
    subject: 'Maths',
    classes: 'IV',
    classLevels: ['IV'],
    phone: '+1 77502 54845',
    email: 'jacquelin@example.com',
    experience: '12 yrs',
    branch: 'Primary Campus',
    lastLogin: 'Last login 2 hrs ago',
    joined: 'Joined 12 Jun 2019',
    year: '2024/2025',
    search: 'morgan t849121 iv maths jacquelin@example.com active +1 77502 54845',
    heading: { tag: 'h6', className: 'text-dark text-truncate mb-0' },
    metrics: [
      { value: 98, bar: 'bg-success' },
      { value: 95, bar: 'bg-success' },
      { value: 93, bar: 'bg-success' },
      { value: 90, bar: 'bg-success' },
    ],
  },
  {
    key: 'tea-6',
    id: 'T849122',
    name: 'Aaron',
    avatar: 'assets/img/teachers/teacher-06.jpg',
    online: true,
    status: 'Active',
    statusBadge: 'badge-soft-success',
    employment: { label: 'Full Time', className: 'badge-soft-info' },
    department: 'Science Dept.',
    qualification: 'M.Sc',
    subject: 'Chemistry',
    classes: 'I (A)',
    classLevels: ['I'],
    phone: '+1 26267 80542',
    email: 'aaron@example.com',
    experience: '5 yrs',
    branch: 'North Branch',
    lastLogin: 'Last login 2 hrs ago',
    joined: 'Joined 12 Jun 2019',
    year: '2024/2025',
    search: 'aaron t849122 i a chemistry aaron@example.com active +1 26267 80542',
    heading: { tag: 'h6', className: 'text-dark text-truncate mb-0' },
    metrics: [
      { value: 91, bar: 'bg-success' },
      { value: 86, bar: 'bg-success' },
      { value: 82, bar: 'bg-success' },
      { value: 84, bar: 'bg-success' },
    ],
  },
  {
    key: 'tea-7',
    id: 'T849127',
    name: 'Daniel',
    avatar: 'assets/img/teachers/teacher-09.jpg',
    online: true,
    status: 'Active',
    statusBadge: 'badge-soft-success',
    employment: { label: 'Full Time', className: 'badge-soft-info' },
    department: 'Mathematics Dept.',
    qualification: 'M.Sc',
    subject: 'Maths',
    classes: 'IV',
    classLevels: ['IV'],
    phone: '+1 77502 54845',
    email: 'jacquelin@example.com',
    experience: '7 yrs',
    branch: 'West Branch',
    lastLogin: 'Last login 2 hrs ago',
    joined: 'Joined 12 Jun 2019',
    year: '2024/2025',
    search: 'daniel t849127 iv maths jacquelin@example.com active +1 77502 54845',
    heading: { tag: 'h6', className: 'text-dark text-truncate mb-0' },
    metrics: [
      { value: 89, bar: 'bg-success' },
      { value: 90, bar: 'bg-success' },
      { value: 85, bar: 'bg-success' },
      { value: 82, bar: 'bg-success' },
    ],
  },
  {
    key: 'tea-8',
    id: 'T849120',
    name: 'Raul',
    avatar: 'assets/img/students/student-10.jpg',
    online: false,
    status: 'Inactive',
    statusBadge: 'badge-soft-secondary',
    employment: { label: 'Visiting Faculty', className: 'badge-soft-secondary' },
    department: 'Science Dept.',
    qualification: 'M.Sc, B.Ed',
    subject: 'Biology',
    classes: 'IX',
    classLevels: ['IX'],
    phone: '+1 67845 78784',
    email: 'raul@example.com',
    experience: '9 yrs',
    branch: 'Primary Campus',
    lastLogin: 'Last login 2 hrs ago',
    joined: 'Joined 12 Jun 2019',
    year: '2024/2025',
    search: 'raul t849120 ix biology raul@example.com inactive +1 67845 78784',
    heading: { tag: 'h6', className: 'text-dark text-truncate mb-0' },
    metrics: [
      { value: 62, bar: 'bg-warning' },
      { value: 58, bar: 'bg-warning' },
      { value: 55, bar: 'bg-warning' },
      { value: 52, bar: 'bg-warning' },
    ],
  },
  {
    key: 'tea-9',
    id: 'T849119',
    name: 'Elizabeth',
    avatar: 'assets/img/students/student-11.jpg',
    online: true,
    status: 'Active',
    statusBadge: 'badge-soft-success',
    employment: { label: 'Full Time', className: 'badge-soft-info' },
    department: 'Commerce Dept.',
    qualification: 'M.A',
    subject: 'Economics',
    classes: 'VII',
    classLevels: ['VII'],
    phone: '+1 97846 84518',
    email: 'elizabeth@example.com',
    experience: '11 yrs',
    branch: 'North Branch',
    lastLogin: 'Last login 2 hrs ago',
    joined: 'Joined 12 Jun 2019',
    year: '2024/2025',
    search: 'elizabeth t849119 vii economics elizabeth@example.com active +1 97846 84518',
    heading: { tag: 'h6', className: 'text-dark text-truncate mb-0' },
    metrics: [
      { value: 94, bar: 'bg-success' },
      { value: 91, bar: 'bg-success' },
      { value: 88, bar: 'bg-success' },
      { value: 86, bar: 'bg-success' },
    ],
  },
  {
    key: 'tea-10',
    id: 'T849118',
    name: 'Edward',
    avatar: 'assets/img/teachers/teacher-03.jpg',
    online: true,
    status: 'Active',
    statusBadge: 'badge-soft-success',
    employment: { label: 'Full Time', className: 'badge-soft-info' },
    department: 'Commerce Dept.',
    qualification: 'MBA',
    subject: 'Finance',
    classes: 'IX (C) , X (C)',
    classLevels: ['IX', 'X'],
    phone: '+1 56187 87489',
    email: 'edward@example.com',
    experience: '14 yrs',
    branch: 'Primary Campus',
    lastLogin: 'Last login 2 hrs ago',
    joined: 'Joined 12 Jun 2019',
    year: '2024/2025',
    search: 'edward t849118 ix c x c finance edward@example.com active +1 56187 87489',
    heading: { tag: 'h6', className: 'text-dark text-truncate mb-0' },
    metrics: [
      { value: 97, bar: 'bg-success' },
      { value: 94, bar: 'bg-success' },
      { value: 92, bar: 'bg-success' },
      { value: 91, bar: 'bg-success' },
    ],
  },
  {
    key: 'tea-11',
    id: 'T849117',
    name: 'Maria',
    avatar: 'assets/img/teachers/teacher-04.jpg',
    online: true,
    status: 'Active',
    statusBadge: 'badge-soft-success',
    employment: { label: 'Part Time', className: 'badge-soft-warning' },
    department: 'Languages Dept.',
    qualification: 'M.A, B.Ed',
    subject: 'English',
    classes: 'I (A)',
    classLevels: ['I'],
    phone: '+1 97846 84518',
    email: 'maria@example.com',
    experience: '6 yrs',
    branch: 'West Branch',
    lastLogin: 'Last login 2 hrs ago',
    joined: 'Joined 12 Jun 2019',
    year: '2024/2025',
    search: 'maria t849117 i a english maria@example.com active +1 97846 84518',
    heading: { tag: 'h6', className: 'text-dark text-truncate mb-0' },
    metrics: [
      { value: 90, bar: 'bg-success' },
      { value: 85, bar: 'bg-success' },
      { value: 80, bar: 'bg-success' },
      { value: 83, bar: 'bg-success' },
    ],
  },
];
