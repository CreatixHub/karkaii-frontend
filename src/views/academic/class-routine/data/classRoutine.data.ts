export type PeriodStatus =
  | 'Scheduled'
  | 'Completed'
  | 'Ongoing'
  | 'Substitute'
  | 'Cancelled'
  | 'Exam'
  | 'Holiday';

export type DayId = 'mon' | 'tue' | 'wed' | 'thu' | 'fri';

export type DensityId = 'compact' | 'default' | 'comfortable';

export type FilterKey = 'year' | 'class' | 'section' | 'teacher' | 'subject' | 'day';

export type ToolbarMenu = 'views' | 'filters' | 'columns' | null;

export type RoutineModalId = 'add' | 'edit' | 'view' | 'import' | 'delete';

export interface RoutineDay {
  id: DayId;
  label: string;
  date: string;
  periods: string;
}

export const routineDays: RoutineDay[] = [
  { id: 'mon', label: 'Monday', date: '21 Jul', periods: '6 periods' },
  { id: 'tue', label: 'Tuesday', date: '22 Jul', periods: '6 periods' },
  { id: 'wed', label: 'Wednesday', date: '23 Jul', periods: '6 periods' },
  { id: 'thu', label: 'Thursday', date: '24 Jul', periods: '6 periods' },
  { id: 'fri', label: 'Friday', date: '25 Jul', periods: '6 periods' },
];

export interface TimeSlot {
  /** `P1`… — the `.rt-pnum` badge. */
  pnum: string;
  /** The `data-rt-time` value the periods in this row carry. */
  time: string;
  start: string;
  end: string;
  duration: string;
}

export const timeSlots: TimeSlot[] = [
  { pnum: 'P1', time: '09:00 AM', start: '09:00 AM', end: '09:45 AM', duration: '45m' },
  { pnum: 'P2', time: '09:45 AM', start: '09:45 AM', end: '10:30 AM', duration: '45m' },
  { pnum: 'P3', time: '10:45 AM', start: '10:45 AM', end: '11:30 AM', duration: '45m' },
  { pnum: 'P4', time: '11:30 AM', start: '11:30 AM', end: '12:15 PM', duration: '45m' },
  { pnum: 'P5', time: '01:00 PM', start: '01:00 PM', end: '01:45 PM', duration: '45m' },
  { pnum: 'P6', time: '01:45 PM', start: '01:45 PM', end: '02:30 PM', duration: '45m' },
];

/** Full-width `.rt-break` rows, keyed by the slot they appear *before*. */
export const breakRows: Record<string, { icon: string; label: string }> = {
  'P3': { icon: 'ti ti-coffee', label: 'Short Break · 10:30 AM – 10:45 AM' },
  'P5': { icon: 'ti ti-tools-kitchen-2', label: 'Lunch Break · 12:15 PM – 01:00 PM' },
};

/** Short display form for the agenda's time gutter, e.g. "09:00" over "09:45". */
export const shortTime = (value: string) => value.replace(/\s?[AP]M$/, '');

/* -------------------------------------------------------------------------- */
/*                             Per-subject constants                          */
/* -------------------------------------------------------------------------- */

/** The template gives every card of a subject the same accent, objective and homework. */
interface SubjectMeta {
  accent: string;
  objective: string;
  homework: string;
}

const SUBJECTS: Record<string, SubjectMeta> = {
  English: { accent: 'bg-primary', objective: 'Tenses & sentence structure', homework: 'Workbook pg 24' },
  Mathematics: { accent: 'bg-success', objective: 'Quadratic equations', homework: 'Exercise 5.2' },
  Chemistry: { accent: 'bg-warning', objective: 'The periodic table', homework: 'Diagram set A' },
  Physics: { accent: 'bg-info', objective: 'Laws of motion', homework: 'Numericals 1–8' },
  Biology: { accent: 'bg-danger', objective: 'Cell structure', homework: 'Label worksheet' },
  Geography: { accent: 'bg-pink', objective: 'Landforms of the Earth', homework: 'Map exercise 3' },
  Computer: { accent: 'bg-dark', objective: 'Intro to Python', homework: 'Program: loops' },
  Economics: { accent: 'bg-teal', objective: 'Demand & supply', homework: 'Case study 2' },
  'Physical Ed': { accent: 'bg-secondary', objective: 'Athletics drills', homework: '—' },
  Finance: { accent: 'bg-purple', objective: 'Budgeting basics', homework: 'Reading pg 12' },
};

/** Teacher → the qualification the detail panel prints beside the name. */
const TEACHERS: Record<string, { avatar: string; qualification: string }> = {
  Erickson: { avatar: 'assets/img/teachers/teacher-01.jpg', qualification: 'M.A English' },
  Mori: { avatar: 'assets/img/teachers/teacher-02.jpg', qualification: 'M.Sc Maths' },
  Joseph: { avatar: 'assets/img/teachers/teacher-03.jpg', qualification: 'M.Sc Physics' },
  James: { avatar: 'assets/img/teachers/teacher-04.jpg', qualification: 'M.Sc Chemistry' },
  Teresa: { avatar: 'assets/img/teachers/teacher-05.jpg', qualification: 'M.Sc Botany' },
  Hendrita: { avatar: 'assets/img/teachers/teacher-06.jpg', qualification: 'MCA' },
  Jacquelin: { avatar: 'assets/img/teachers/teacher-07.jpg', qualification: 'M.A Geography' },
  Ramsey: { avatar: 'assets/img/teachers/teacher-08.jpg', qualification: 'M.A Economics' },
  Aariv: { avatar: 'assets/img/teachers/teacher-09.jpg', qualification: 'B.P.Ed' },
  Morgan: { avatar: 'assets/img/teachers/teacher-10.jpg', qualification: 'MBA Finance' },
};

/** Status → the `.dt-pill` modifier and glyph the template pairs with it. */
const PILLS: Record<PeriodStatus, { pillClass: string; pillIcon: string | null }> = {
  Scheduled: { pillClass: 'is-new', pillIcon: null },
  Completed: { pillClass: 'is-inactive', pillIcon: 'ti ti-check' },
  Ongoing: { pillClass: 'is-active', pillIcon: null },
  Substitute: { pillClass: 'is-pending', pillIcon: 'ti ti-user-shield' },
  Cancelled: { pillClass: 'is-emergency', pillIcon: 'ti ti-ban' },
  Exam: { pillClass: 'is-exam', pillIcon: 'ti ti-file-certificate' },
  Holiday: { pillClass: 'is-archived', pillIcon: 'ti ti-calendar-off' },
};

const REMARKS: Partial<Record<PeriodStatus, string>> = {
  Cancelled: 'Class cancelled — teacher on leave.',
  Substitute: 'Handled by a substitute teacher.',
};

const DEFAULT_REMARK = 'On track with the term syllabus.';

/* -------------------------------------------------------------------------- */
/*                                   Periods                                  */
/* -------------------------------------------------------------------------- */

export interface RoutinePeriod {
  id: string;
  dayId: DayId;
  day: string;
  /** The `data-rt-time` value, which is also the slot key. */
  time: string;
  subject: string;
  accent: string;
  teacher: { name: string; avatar: string; qualification: string } | null;
  room: string;
  students: number;
  status: PeriodStatus;
  pillClass: string;
  pillIcon: string | null;
  objective: string;
  homework: string;
  /** The template's `data-search` haystack, verbatim. */
  search: string;
}

const period = (
  dayId: DayId,
  day: string,
  time: string,
  subject: string,
  teacherName: string | null,
  room: string,
  students: number,
  status: PeriodStatus,
  search: string,
): RoutinePeriod => {
  const meta = SUBJECTS[subject] ?? { accent: 'bg-purple', objective: '—', homework: '—' };
  const pill = PILLS[status];
  return {
    id: `${dayId}-${time}`,
    dayId,
    day,
    time,
    subject,
    accent: meta.accent,
    teacher: teacherName ? { name: teacherName, ...TEACHERS[teacherName] } : null,
    room,
    students,
    status,
    pillClass: pill.pillClass,
    pillIcon: pill.pillIcon,
    objective: meta.objective,
    homework: meta.homework,
    search,
  };
};

export const routinePeriods: RoutinePeriod[] = [
  // P1 · 09:00 AM
  period('mon', 'Monday', '09:00 AM', 'English', 'Erickson', '101', 42, 'Completed', 'monday english erickson room 101 completed iii a 09:00 am'),
  period('tue', 'Tuesday', '09:00 AM', 'Mathematics', 'Mori', '102', 40, 'Scheduled', 'tuesday mathematics mori room 102 scheduled iii a 09:00 am'),
  period('wed', 'Wednesday', '09:00 AM', 'Chemistry', 'James', '104', 39, 'Scheduled', 'wednesday chemistry james room 104 scheduled iii a 09:00 am'),
  period('thu', 'Thursday', '09:00 AM', 'Physics', 'Joseph', '103', 38, 'Scheduled', 'thursday physics joseph room 103 scheduled iii a 09:00 am'),
  period('fri', 'Friday', '09:00 AM', 'Biology', 'Teresa', '105', 41, 'Scheduled', 'friday biology teresa room 105 scheduled iii a 09:00 am'),

  // P2 · 09:45 AM
  period('mon', 'Monday', '09:45 AM', 'Mathematics', 'Mori', '102', 40, 'Completed', 'monday mathematics mori room 102 completed iii a 09:45 am'),
  period('tue', 'Tuesday', '09:45 AM', 'English', 'Erickson', '101', 42, 'Scheduled', 'tuesday english erickson room 101 scheduled iii a 09:45 am'),
  period('wed', 'Wednesday', '09:45 AM', 'Biology', 'Teresa', '105', 41, 'Substitute', 'wednesday biology teresa room 105 substitute iii a 09:45 am'),
  period('thu', 'Thursday', '09:45 AM', 'Geography', 'Jacquelin', '106', 37, 'Scheduled', 'thursday geography jacquelin room 106 scheduled iii a 09:45 am'),
  period('fri', 'Friday', '09:45 AM', 'Computer', 'Hendrita', '108', 36, 'Scheduled', 'friday computer hendrita room 108 scheduled iii a 09:45 am'),

  // P3 · 10:45 AM
  period('mon', 'Monday', '10:45 AM', 'Physics', 'Joseph', '103', 38, 'Ongoing', 'monday physics joseph room 103 ongoing iii a 10:45 am'),
  period('tue', 'Tuesday', '10:45 AM', 'Geography', 'Jacquelin', '106', 37, 'Scheduled', 'tuesday geography jacquelin room 106 scheduled iii a 10:45 am'),
  period('wed', 'Wednesday', '10:45 AM', 'Mathematics', 'Mori', '102', 40, 'Scheduled', 'wednesday mathematics mori room 102 scheduled iii a 10:45 am'),
  period('thu', 'Thursday', '10:45 AM', 'English', 'Erickson', '101', 42, 'Scheduled', 'thursday english erickson room 101 scheduled iii a 10:45 am'),
  period('fri', 'Friday', '10:45 AM', 'Chemistry', 'James', '104', 39, 'Exam', 'friday chemistry james room 104 exam iii a 10:45 am'),

  // P4 · 11:30 AM
  period('mon', 'Monday', '11:30 AM', 'Chemistry', 'James', '104', 39, 'Scheduled', 'monday chemistry james room 104 scheduled iii a 11:30 am'),
  period('tue', 'Tuesday', '11:30 AM', 'Physics', 'Joseph', '103', 38, 'Scheduled', 'tuesday physics joseph room 103 scheduled iii a 11:30 am'),
  period('wed', 'Wednesday', '11:30 AM', 'English', 'Erickson', '101', 42, 'Scheduled', 'wednesday english erickson room 101 scheduled iii a 11:30 am'),
  period('thu', 'Thursday', '11:30 AM', 'Mathematics', 'Mori', '102', 40, 'Cancelled', 'thursday mathematics mori room 102 cancelled iii a 11:30 am'),
  period('fri', 'Friday', '11:30 AM', 'Physics', 'Joseph', '103', 38, 'Scheduled', 'friday physics joseph room 103 scheduled iii a 11:30 am'),

  // P5 · 01:00 PM — the template leaves Friday empty in this row
  period('mon', 'Monday', '01:00 PM', 'Biology', 'Teresa', '105', 41, 'Scheduled', 'monday biology teresa room 105 scheduled iii a 01:00 pm'),
  period('tue', 'Tuesday', '01:00 PM', 'Economics', 'Ramsey', '110', 35, 'Scheduled', 'tuesday economics ramsey room 110 scheduled iii a 01:00 pm'),
  period('wed', 'Wednesday', '01:00 PM', 'Computer', 'Hendrita', '108', 36, 'Scheduled', 'wednesday computer hendrita room 108 scheduled iii a 01:00 pm'),
  period('thu', 'Thursday', '01:00 PM', 'Chemistry', 'James', '104', 39, 'Scheduled', 'thursday chemistry james room 104 scheduled iii a 01:00 pm'),

  // P6 · 01:45 PM
  period('mon', 'Monday', '01:45 PM', 'Computer', 'Hendrita', '108', 36, 'Scheduled', 'monday computer hendrita room 108 scheduled iii a 01:45 pm'),
  period('tue', 'Tuesday', '01:45 PM', 'Physical Ed', 'Aariv', 'Ground', 44, 'Scheduled', 'tuesday physical ed aariv room ground scheduled iii a 01:45 pm'),
  period('wed', 'Wednesday', '01:45 PM', 'Finance', 'Morgan', '109', 34, 'Scheduled', 'wednesday finance morgan room 109 scheduled iii a 01:45 pm'),
  period('thu', 'Thursday', '01:45 PM', 'Biology', 'Teresa', '105', 41, 'Scheduled', 'thursday biology teresa room 105 scheduled iii a 01:45 pm'),
  period('fri', 'Friday', '01:45 PM', 'Foundation Day', null, '', 0, 'Holiday', 'friday holiday foundation day iii a'),
];

/* ---------------------------- Derived detail copy --------------------------- */

export const attendanceSummary = (row: RoutinePeriod) =>
  row.students ? `${row.students - 2}/${row.students} present` : '—';

export const roomInformation = (row: RoutinePeriod) => (row.room ? `Room ${row.room} · Block A` : '—');

export const subjectDetails = (row: RoutinePeriod) => `${row.subject} · Core`;

export const teachingResources = (row: RoutinePeriod) => `Slides deck, Textbook, ${row.homework}`;

export const assignmentLine = (row: RoutinePeriod) => `Homework — ${row.homework}`;

export const remarkFor = (row: RoutinePeriod) => REMARKS[row.status] ?? DEFAULT_REMARK;

/* -------------------------------------------------------------------------- */
/*                                  Toolbar                                   */
/* -------------------------------------------------------------------------- */

export interface SavedView {
  id: string;
  label: string;
  icon: string;
}

export const savedViews: SavedView[] = [
  { id: 'all', label: 'Full Week', icon: 'ti ti-layout-grid' },
  { id: 'Ongoing', label: 'Ongoing', icon: 'ti ti-player-play' },
  { id: 'Scheduled', label: 'Scheduled', icon: 'ti ti-calendar' },
  { id: 'Substitute', label: 'Substitute', icon: 'ti ti-user-shield' },
  { id: 'Exam', label: 'Exam', icon: 'ti ti-file-certificate' },
];

/** The quick bar swaps Exam's neighbour for Cancelled. */
export const quickFilters: SavedView[] = [
  { id: 'Ongoing', label: 'Ongoing', icon: 'ti ti-player-play' },
  { id: 'Scheduled', label: 'Scheduled', icon: 'ti ti-calendar' },
  { id: 'Substitute', label: 'Substitute', icon: 'ti ti-user-shield' },
  { id: 'Cancelled', label: 'Cancelled', icon: 'ti ti-ban' },
  { id: 'Exam', label: 'Exam', icon: 'ti ti-file-certificate' },
];

export interface FilterOption {
  value: string;
  label: string;
}

export interface FilterField {
  key: FilterKey;
  /** Chip prefix — the template's `data-filter` value. */
  label: string;
  domId: string;
  options: FilterOption[];
}

const plain = (values: string[]): FilterOption[] => values.map((value) => ({ value, label: value }));

export const advancedFilters: FilterField[] = [
  { key: 'year', label: 'Year', domId: 'rt-academic-year', options: plain(['2024/2025', '2023/2024']) },
  {
    key: 'class',
    label: 'Class',
    domId: 'rt-class',
    options: [
      { value: 'iii', label: 'III' },
      { value: 'iv', label: 'IV' },
      { value: 'v', label: 'V' },
    ],
  },
  {
    key: 'section',
    label: 'Section',
    domId: 'rt-section',
    options: [
      { value: 'iii a', label: 'A' },
      { value: 'iii b', label: 'B' },
    ],
  },
  {
    key: 'teacher',
    label: 'Teacher',
    domId: 'rt-teacher',
    options: plain([
      'Erickson',
      'Mori',
      'Joseph',
      'James',
      'Teresa',
      'Hendrita',
      'Jacquelin',
      'Ramsey',
      'Aariv',
      'Morgan',
    ]),
  },
  {
    key: 'subject',
    label: 'Subject',
    domId: 'rt-subject',
    options: plain([
      'English',
      'Mathematics',
      'Physics',
      'Chemistry',
      'Biology',
      'Computer',
      'Geography',
      'Economics',
      'Physical Ed',
      'Finance',
    ]),
  },
  {
    key: 'day',
    label: 'Day',
    domId: 'rt-day',
    options: plain(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']),
  },
];

/** "Columns" on this page are the weekday grid columns. */
export const columnDefs: { id: DayId; label: string }[] = routineDays.map((day) => ({
  id: day.id,
  label: day.label,
}));

export const allColumns: Record<DayId, boolean> = {
  mon: true,
  tue: true,
  wed: true,
  thu: true,
  fri: true,
};

export const densityOptions: { id: DensityId; icon: string; title: string }[] = [
  { id: 'compact', icon: 'ti ti-baseline-density-small', title: 'Compact' },
  { id: 'default', icon: 'ti ti-baseline-density-medium', title: 'Default' },
  { id: 'comfortable', icon: 'ti ti-baseline-density-large', title: 'Comfortable' },
];

/** The footer's "Week" select replaces the usual rows-per-page control. */
export const weekOptions = ['21 – 26 Jul 2025', '14 – 19 Jul 2025', '28 Jul – 02 Aug 2025'];

/* -------------------------------------------------------------------------- */
/*                          Header, bulk bar and menus                        */
/* -------------------------------------------------------------------------- */

export const exportActions: { id: string; label: string; icon: string }[] = [
  { id: 'export_pdf', label: 'Export as PDF', icon: 'ti ti-file-type-pdf' },
  { id: 'export_excel', label: 'Export as Excel', icon: 'ti ti-file-type-xls' },
  { id: 'export_csv', label: 'Export as CSV', icon: 'ti ti-file-type-csv' },
];

export interface BulkAction {
  id: string;
  label: string;
  icon: string;
  modal?: RoutineModalId;
  danger?: boolean;
}

export const bulkActions: BulkAction[] = [
  { id: 'assign_teacher', label: 'Assign Teachers', icon: 'ti ti-user-plus' },
  { id: 'assign_class', label: 'Assign Classes', icon: 'ti ti-school' },
  { id: 'assign_room', label: 'Assign Rooms', icon: 'ti ti-door' },
  { id: 'swap', label: 'Swap Periods', icon: 'ti ti-arrows-exchange' },
  { id: 'publish', label: 'Publish', icon: 'ti ti-send' },
  { id: 'export_csv', label: 'Export', icon: 'ti ti-download' },
  { id: 'print', label: 'Print', icon: 'ti ti-printer' },
  { id: 'delete', label: 'Delete', icon: 'ti ti-trash', modal: 'delete', danger: true },
];

export interface RowMenuItem {
  id: string;
  label: string;
  icon: string;
  modal?: RoutineModalId;
  danger?: boolean;
  divider?: boolean;
}

/** The per-card overflow menu inside `.rt-detail`. */
export const cardMenuItems: RowMenuItem[] = [
  { id: 'assign_teacher', label: 'Assign Teacher', icon: 'ti ti-user-plus' },
  { id: 'assign_room', label: 'Change Room', icon: 'ti ti-door' },
  { id: 'assignments', label: 'Assignments', icon: 'ti ti-clipboard-list' },
  { id: 'notes', label: 'Teaching Notes', icon: 'ti ti-notes' },
  { id: 'print', label: 'Print', icon: 'ti ti-printer' },
  { id: 'duplicate', label: 'Duplicate Period', icon: 'ti ti-copy', divider: true },
  { id: 'swap', label: 'Swap Period', icon: 'ti ti-arrows-exchange' },
  { id: 'cancel_class', label: 'Cancel Class', icon: 'ti ti-ban' },
  { id: 'archive', label: 'Archive', icon: 'ti ti-archive' },
  { id: 'delete', label: 'Delete', icon: 'ti ti-trash-x', modal: 'delete', danger: true },
];

/** The five icon buttons above that menu. */
export const cardQuickActions: RowMenuItem[] = [
  { id: 'view', label: 'View Routine', icon: 'ti ti-eye', modal: 'view' },
  { id: 'edit', label: 'Edit Period', icon: 'ti ti-edit', modal: 'edit' },
  { id: 'lesson_plan', label: 'Lesson Plan', icon: 'ti ti-notebook' },
  { id: 'attendance', label: 'Attendance', icon: 'ti ti-calendar-check' },
  { id: 'homework', label: 'Homework', icon: 'ti ti-book' },
];

/* -------------------------------------------------------------------------- */
/*                         Insights and activity panels                       */
/* -------------------------------------------------------------------------- */

export interface Insight {
  id: string;
  icon: string;
  iconClass: string;
  title: string;
  body?: string;
  /** Present on the three insights that show a progress bar. */
  meterClass?: string;
  meterWidth?: string;
  badge?: string;
  badgeClass?: string;
  /** The Subject Distribution insight shows chips instead of a paragraph. */
  chips?: { label: string; chipClass: string }[];
  /** The AI Recommendations insight ends in an action button. */
  action?: { id: string; label: string };
}

/** `class-routine.html` L3662–3710. */
export const insights: Insight[] = [
  {
    id: 'workload',
    icon: 'ti ti-briefcase',
    iconClass: 'bg-primary-transparent text-primary',
    title: 'Teacher Workload',
    body: 'Mori (Maths) is the busiest at 24 of 26 weekly periods.',
    meterClass: 'meter-warning',
    meterWidth: '92%',
    badge: '92%',
    badgeClass: 'badge-soft-warning',
  },
  {
    id: 'rooms',
    icon: 'ti ti-door',
    iconClass: 'bg-info-transparent text-info',
    title: 'Room Utilization',
    body: 'Room 103 is used in 82% of available slots this week.',
    meterClass: 'meter-info',
    meterWidth: '82%',
    badge: '82%',
    badgeClass: 'badge-soft-info',
  },
  {
    id: 'conflicts',
    icon: 'ti ti-alert-triangle',
    iconClass: 'bg-danger-transparent text-danger',
    title: 'Schedule Conflicts',
    body: '1 clash found — Thursday P4 was cancelled and needs a substitute.',
    badge: '1 conflict',
    badgeClass: 'badge-soft-danger',
  },
  {
    id: 'free',
    icon: 'ti ti-clock-pause',
    iconClass: 'bg-success-transparent text-success',
    title: 'Free Period Analysis',
    body: '1 free period this week — Friday P5 is open for revision or clubs.',
    badge: '1 free',
    badgeClass: 'badge-soft-success',
  },
  {
    id: 'distribution',
    icon: 'ti ti-chart-donut',
    iconClass: 'bg-purple-transparent text-purple',
    title: 'Subject Distribution',
    chips: [
      { label: 'English 5', chipClass: 'chip-primary' },
      { label: 'Maths 5', chipClass: 'chip-success' },
      { label: 'Science 8', chipClass: 'chip-info' },
      { label: 'Others 6', chipClass: 'chip-secondary' },
    ],
  },
  {
    id: 'ai',
    icon: 'ti ti-bulb',
    iconClass: 'bg-warning-transparent text-warning',
    title: 'AI Recommendations',
    body: "Balance Friday's afternoon load by swapping P5 with a Maths block, and assign a substitute for Thursday P4.",
    action: { id: 'swap', label: 'Apply' },
  },
];

export interface ActivityEntry {
  id: string;
  /** A divider row instead of an entry, e.g. "Today". */
  divider?: string;
  icon?: string;
  iconClass?: string;
  avatar?: string;
  /** Rendered with the `fw-semibold` fragment already split out. */
  before?: string;
  strong?: string;
  after?: string;
  time?: string;
  badge?: string;
  badgeClass?: string;
}

/** `class-routine.html` L3721–3737. */
export const activityFeed: ActivityEntry[] = [
  { id: 'd1', divider: 'Today' },
  {
    id: 'a1',
    icon: 'ti ti-refresh',
    iconClass: 'bg-primary-transparent',
    before: 'Routine updated for ',
    strong: 'Class III-A',
    time: '15m',
    badge: 'Updated',
    badgeClass: 'badge-soft-primary',
  },
  {
    id: 'a2',
    icon: 'ti ti-user-plus',
    iconClass: 'bg-success-transparent',
    avatar: 'assets/img/teachers/teacher-02.jpg',
    strong: 'Mori',
    after: ' assigned to Maths · Tue P1',
    time: '1h',
    badge: 'Teacher',
    badgeClass: 'badge-soft-success',
  },
  {
    id: 'a3',
    icon: 'ti ti-door',
    iconClass: 'bg-info-transparent',
    before: 'Room changed ',
    strong: '104 → 103',
    after: ' for Physics',
    time: '2h',
    badge: 'Room',
    badgeClass: 'badge-soft-info',
  },
  { id: 'd2', divider: 'Yesterday' },
  {
    id: 'a4',
    icon: 'ti ti-arrows-exchange',
    iconClass: 'bg-warning-transparent',
    before: 'Period swapped — ',
    strong: 'Wed P2 ↔ P4',
    time: '4:12 PM',
    badge: 'Swap',
    badgeClass: 'badge-soft-warning',
  },
  {
    id: 'a5',
    icon: 'ti ti-notebook',
    iconClass: 'bg-purple-transparent',
    avatar: 'assets/img/teachers/teacher-05.jpg',
    strong: 'Teresa',
    after: ' added a lesson plan for Biology',
    time: '11:03 AM',
    badge: 'Lesson',
    badgeClass: 'badge-soft-primary',
  },
  { id: 'd3', divider: 'Earlier' },
  {
    id: 'a6',
    icon: 'ti ti-send',
    iconClass: 'bg-success-transparent',
    before: 'Weekly routine ',
    strong: 'published',
    after: ' to teachers & students',
    time: '2 days ago',
    badge: 'Published',
    badgeClass: 'badge-soft-success',
  },
];

/** `class-routine-workspace.js` L312–333, verbatim. */
export const actionToasts: Record<string, string> = {
  refresh: 'Routine refreshed.',
  save_view: 'Current filters saved as a new view.',
  publish: 'Routine published to teachers and students.',
  assign_teacher: 'Teacher assignment opened for the selected periods.',
  assign_class: 'Class assignment opened for the selected periods.',
  assign_room: 'Classroom assignment opened for the selected periods.',
  swap: 'Swap-period workspace opened for the selected periods.',
  update_subject: 'Subject update opened for the selected periods.',
  duplicate: 'Period duplicated as a draft.',
  cancel_class: 'Selected class marked as cancelled.',
  lesson_plan: 'Lesson plan opened.',
  attendance: 'Attendance opened for this period.',
  homework: 'Homework opened for this period.',
  assignments: 'Assignments opened for this period.',
  notes: 'Teaching notes opened for this period.',
  reports: 'Routine report opened.',
  print: 'Sending the routine to the printer…',
  archive: 'Selected periods archived.',
  export_excel: 'Excel workbook queued for download.',
  export_pdf: 'PDF export queued for download.',
  export_csv: 'Preparing export…',
  clear_filters: 'Filters cleared.',
  reset_columns: 'All days restored.',
};
