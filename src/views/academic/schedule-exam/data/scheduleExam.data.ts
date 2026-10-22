export type ScheduleStatus =
  | 'Scheduled'
  | 'Ongoing'
  | 'Completed'
  | 'Postponed'
  | 'Draft'
  | 'Cancelled'
  | 'Archived';

export type PaperStatus = 'Ready' | 'In Review' | 'Not Ready';

export type ColumnId = 'schedule' | 'details' | 'mgmt' | 'status';

export type DensityId = 'compact' | 'default' | 'comfortable';

export type FilterKey =
  | 'year'
  | 'exam'
  | 'class'
  | 'section'
  | 'subject'
  | 'room'
  | 'invigilator'
  | 'status'
  | 'date';

export type SortKey = 'name' | 'subject' | 'teacher' | 'date' | 'students' | 'status' | 'recent';

export type ToolbarMenu = 'views' | 'filters' | 'columns' | 'sort' | null;

/** The template's ids were `add_exam_schedule`, `edit_exam_schedule`, `view_exam_schedule`,
 *  `exam_schedule_import` and `delete-modal`; normalised here to one lowercase union. */
export type ScheduleModalId = 'add' | 'edit' | 'view' | 'import' | 'delete';

export interface Person {
  name: string;
  avatar: string;
}

export interface ScheduleRow {
  /** Exam schedule code, used as the row key. */
  id: string;
  name: string;
  subject: string;
  /** Exam type badge copy — "Midterm", "Final Exam", "Unit Test"… */
  type: string;
  /** Bootstrap colour suffix shared by the avatar, the type badge and the class badge. */
  tone: string;
  icon: string;
  year: string;
  className: string;
  section: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: string;
  hall: string;
  /** Seats in the hall; the template always allocated exactly `students` of them. */
  capacity: number;
  invigilator: Person;
  coordinator: Person;
  totalMarks: number;
  passMarks: number;
  students: number;
  paperStatus: PaperStatus;
  remarks: string;
  status: ScheduleStatus;
  pillClass: string;
  /** Completed and Draft show a plain dot; every other status shows an icon. */
  pillIcon: string | null;
  /** The template's `data-search` haystack, verbatim. */
  search: string;
}

const PILLS: Record<ScheduleStatus, { pillClass: string; pillIcon: string | null }> = {
  Scheduled: { pillClass: 'is-new', pillIcon: 'ti ti-calendar-check' },
  Ongoing: { pillClass: 'is-pending', pillIcon: 'ti ti-progress' },
  Completed: { pillClass: 'is-active', pillIcon: null },
  Postponed: { pillClass: 'is-exam', pillIcon: 'ti ti-calendar-pause' },
  Draft: { pillClass: 'is-inactive', pillIcon: null },
  Cancelled: { pillClass: 'is-emergency', pillIcon: 'ti ti-ban' },
  Archived: { pillClass: 'is-archived', pillIcon: 'ti ti-archive' },
};

export const PAPER_BADGES: Record<PaperStatus, { badge: string; icon: string }> = {
  Ready: { badge: 'badge-soft-success', icon: 'ti ti-file-check' },
  'In Review': { badge: 'badge-soft-warning', icon: 'ti ti-file-pencil' },
  'Not Ready': { badge: 'badge-soft-secondary', icon: 'ti ti-file-dots' },
};

const person = (name: string, avatarNo: string): Person => ({
  name,
  avatar: `assets/img/teachers/teacher-${avatarNo}.jpg`,
});

interface ScheduleSeed {
  id: string;
  name: string;
  subject: string;
  type: string;
  tone: string;
  /** Tabler icon name without the `ti ti-` prefix. */
  icon: string;
  year: string;
  className: string;
  section: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: string;
  hall: string;
  capacity: number;
  invigilator: [string, string];
  coordinator: [string, string];
  totalMarks: number;
  passMarks: number;
  students: number;
  paperStatus: PaperStatus;
  remarks: string;
  status: ScheduleStatus;
  search: string;
}

const row = (seed: ScheduleSeed): ScheduleRow => ({
  ...seed,
  icon: `ti ti-${seed.icon}`,
  invigilator: person(seed.invigilator[0], seed.invigilator[1]),
  coordinator: person(seed.coordinator[0], seed.coordinator[1]),
  ...PILLS[seed.status],
});

export const scheduleRows: ScheduleRow[] = [
  row({
    id: 'ES240501',
    name: 'Midterm Examination',
    subject: 'Mathematics',
    type: 'Midterm',
    tone: 'primary',
    icon: 'math-symbols',
    year: '2024/2025',
    className: 'X',
    section: 'A',
    date: '13 May 2024',
    startTime: '09:30 AM',
    endTime: '11:30 AM',
    duration: '2h 00m',
    hall: 'Hall A · Room 204',
    capacity: 50,
    invigilator: ['Erickson', '01'],
    coordinator: ['Mori', '02'],
    totalMarks: 100,
    passMarks: 35,
    students: 42,
    paperStatus: 'In Review',
    remarks: 'Scheduled — hall tickets ready to publish.',
    status: 'Scheduled',
    search:
      'midterm examination es240501 midterm 2024/2025 class x sec a mathematics mori erickson scheduled 13 may 2024 hall a · room 204',
  }),
  row({
    id: 'ES240502',
    name: 'Final Examination',
    subject: 'Physics',
    type: 'Final Exam',
    tone: 'info',
    icon: 'atom',
    year: '2024/2025',
    className: 'XII',
    section: 'A',
    date: '18 Jul 2024',
    startTime: '10:30 AM',
    endTime: '12:30 PM',
    duration: '2h 00m',
    hall: 'Hall B · Room 301',
    capacity: 46,
    invigilator: ['James', '04'],
    coordinator: ['Joseph', '03'],
    totalMarks: 100,
    passMarks: 40,
    students: 38,
    paperStatus: 'Ready',
    remarks: 'Completed — results uploaded and verified.',
    status: 'Completed',
    search:
      'final examination es240502 final exam 2024/2025 class xii sec a physics joseph james completed 18 jul 2024 hall b · room 301',
  }),
  row({
    id: 'ES240503',
    name: 'Unit Test 3',
    subject: 'English',
    type: 'Unit Test',
    tone: 'success',
    icon: 'abc',
    year: '2024/2025',
    className: 'IX',
    section: 'B',
    date: '09 May 2024',
    startTime: '09:30 AM',
    endTime: '10:45 AM',
    duration: '1h 15m',
    hall: 'Room 108',
    capacity: 48,
    invigilator: ['Teresa', '05'],
    coordinator: ['Erickson', '01'],
    totalMarks: 50,
    passMarks: 18,
    students: 40,
    paperStatus: 'Ready',
    remarks: 'Exam in progress — invigilators on duty.',
    status: 'Ongoing',
    search:
      'unit test 3 es240503 unit test 2024/2025 class ix sec b english erickson teresa ongoing 09 may 2024 room 108',
  }),
  row({
    id: 'ES240504',
    name: 'Chapter Test — Acids & Bases',
    subject: 'Chemistry',
    type: 'Chapter Test',
    tone: 'warning',
    icon: 'flask',
    year: '2024/2025',
    className: 'XI',
    section: 'A',
    date: '20 May 2024',
    startTime: '11:00 AM',
    endTime: '12:00 PM',
    duration: '1h 00m',
    hall: 'Room 210',
    capacity: 44,
    invigilator: ['Hendrita', '06'],
    coordinator: ['James', '04'],
    totalMarks: 40,
    passMarks: 14,
    students: 36,
    paperStatus: 'Not Ready',
    remarks: 'Draft — hall allocation and question paper not finalised.',
    status: 'Draft',
    search:
      'chapter test — acids & bases es240504 chapter test 2024/2025 class xi sec a chemistry james hendrita draft 20 may 2024 room 210',
  }),
  row({
    id: 'ES240505',
    name: 'Practical Examination',
    subject: 'Biology',
    type: 'Practical',
    tone: 'danger',
    icon: 'dna',
    year: '2024/2025',
    className: 'XII',
    section: 'C',
    date: '07 May 2024',
    startTime: '09:00 AM',
    endTime: '11:00 AM',
    duration: '2h 00m',
    hall: 'Lab 2',
    capacity: 40,
    invigilator: ['Joseph', '03'],
    coordinator: ['Teresa', '05'],
    totalMarks: 30,
    passMarks: 12,
    students: 32,
    paperStatus: 'Ready',
    remarks: 'Postponed — new date to be confirmed with coordinator.',
    status: 'Postponed',
    search:
      'practical examination es240505 practical 2024/2025 class xii sec c biology teresa joseph postponed 07 may 2024 lab 2',
  }),
  row({
    id: 'ES240506',
    name: 'Quarterly Examination',
    subject: 'Computer Science',
    type: 'Quarterly',
    tone: 'dark',
    icon: 'code',
    year: '2024/2025',
    className: 'X',
    section: 'A',
    date: '26 Aug 2024',
    startTime: '09:00 AM',
    endTime: '12:00 PM',
    duration: '3h 00m',
    hall: 'Lab 1',
    capacity: 52,
    invigilator: ['Mori', '02'],
    coordinator: ['Hendrita', '06'],
    totalMarks: 100,
    passMarks: 35,
    students: 44,
    paperStatus: 'In Review',
    remarks: 'Scheduled — hall tickets ready to publish.',
    status: 'Scheduled',
    search:
      'quarterly examination es240506 quarterly 2024/2025 class x sec a computer science hendrita mori scheduled 26 aug 2024 lab 1',
  }),
  row({
    id: 'ES240507',
    name: 'Half Yearly Examination',
    subject: 'Geography',
    type: 'Half Yearly',
    tone: 'pink',
    icon: 'world',
    year: '2024/2025',
    className: 'VIII',
    section: 'B',
    date: '15 Nov 2024',
    startTime: '09:30 AM',
    endTime: '12:30 PM',
    duration: '3h 00m',
    hall: 'Hall A',
    capacity: 46,
    invigilator: ['Ramsey', '08'],
    coordinator: ['Jacquelin', '07'],
    totalMarks: 80,
    passMarks: 28,
    students: 38,
    paperStatus: 'Not Ready',
    remarks: 'Draft — hall allocation and question paper not finalised.',
    status: 'Draft',
    search:
      'half yearly examination es240507 half yearly 2024/2025 class viii sec b geography jacquelin ramsey draft 15 nov 2024 hall a',
  }),
  row({
    id: 'ES240508',
    name: 'Annual Examination',
    subject: 'Economics',
    type: 'Annual',
    tone: 'teal',
    icon: 'coin',
    year: '2024/2025',
    className: 'XI',
    section: 'A',
    date: '10 Mar 2025',
    startTime: '10:00 AM',
    endTime: '01:00 PM',
    duration: '3h 00m',
    hall: 'Hall C',
    capacity: 49,
    invigilator: ['Morgan', '10'],
    coordinator: ['Ramsey', '08'],
    totalMarks: 100,
    passMarks: 40,
    students: 41,
    paperStatus: 'In Review',
    remarks: 'Scheduled — hall tickets ready to publish.',
    status: 'Scheduled',
    search:
      'annual examination es240508 annual 2024/2025 class xi sec a economics ramsey morgan scheduled 10 mar 2025 hall c',
  }),
  row({
    id: 'ES240509',
    name: 'Oral Test — Civilisations',
    subject: 'History',
    type: 'Oral Test',
    tone: 'purple',
    icon: 'books',
    year: '2024/2025',
    className: 'VII',
    section: 'B',
    date: '03 Jul 2024',
    startTime: '12:30 PM',
    endTime: '01:30 PM',
    duration: '1h 00m',
    hall: 'Room 115',
    capacity: 47,
    invigilator: ['Aariv', '09'],
    coordinator: ['Morgan', '10'],
    totalMarks: 25,
    passMarks: 10,
    students: 39,
    paperStatus: 'Ready',
    remarks: 'Exam cancelled — hall and invigilators released.',
    status: 'Cancelled',
    search:
      'oral test — civilisations es240509 oral test 2024/2025 class vii sec b history morgan aariv cancelled 03 jul 2024 room 115',
  }),
  row({
    id: 'ES240510',
    name: 'Progress Test',
    subject: 'Physical Education',
    type: 'Progress Test',
    tone: 'secondary',
    icon: 'run',
    year: '2023/2024',
    className: 'VIII',
    section: 'A',
    date: '20 Jun 2024',
    startTime: '11:00 AM',
    endTime: '12:00 PM',
    duration: '1h 00m',
    hall: 'Ground',
    capacity: 48,
    invigilator: ['Jacquelin', '07'],
    coordinator: ['Aariv', '09'],
    totalMarks: 20,
    passMarks: 8,
    students: 40,
    paperStatus: 'Ready',
    remarks: 'Scheduled — hall tickets ready to publish.',
    status: 'Archived',
    search:
      'progress test es240510 progress test 2023/2024 class viii sec a physical education aariv jacquelin archived 20 jun 2024 ground',
  }),
];

/* -------------------------------------------------------------------------- */
/*                          Copy derived from the row                         */
/* -------------------------------------------------------------------------- */

/** Re-pills a row when Publish or Archive moves it to another status. */
export const withStatus = (row: ScheduleRow, status: ScheduleStatus): ScheduleRow => ({
  ...row,
  status,
  ...PILLS[status],
});

/** The pass mark as a percentage of the total — the width of the detail panel's meter. */
export const passPercent = (row: ScheduleRow) => Math.round((row.passMarks / row.totalMarks) * 100);

/** The template painted the meter green at 35% and amber above it. */
export const meterTone = (row: ScheduleRow) =>
  passPercent(row) <= 35 ? 'meter-success' : 'meter-warning';

/** Only the first line varies per row; the other two are fixed advice. */
export const examInstructions = (row: ScheduleRow) => [
  `Report to ${row.hall} 15 minutes before ${row.startTime}.`,
  'Bring your hall ticket and school ID card.',
  'Electronic devices are strictly prohibited.',
];

export const hallDetails = (row: ScheduleRow) =>
  `${row.hall} · capacity ${row.capacity} seats · ${row.students} allocated · ${row.duration} session.`;

/** The View dialog spells the same instructions out as one sentence. */
export const viewInstructions = (row: ScheduleRow) =>
  `Report to ${row.hall} fifteen minutes before the start. Hall ticket and school ID required. Electronic devices prohibited.`;

/** "09:30 AM" + "11:30 AM" reads as "09:30–11:30 AM" in the dialog's subtitle. */
export const timeRange = (row: ScheduleRow) =>
  `${row.startTime.replace(/\s*(AM|PM)$/, '')}–${row.endTime}`;

/** Every row shipped the same two attachment chips. */
export const attachments: { label: string; badge: string; icon: string }[] = [
  { label: 'Blueprint.pdf', badge: 'badge-soft-primary', icon: 'ti ti-file-type-pdf' },
  { label: 'Seating.docx', badge: 'badge-soft-info', icon: 'ti ti-file-type-doc' },
];

/* -------------------------------------------------------------------------- */
/*                                  Toolbar                                   */
/* -------------------------------------------------------------------------- */

export interface SavedView {
  id: string;
  label: string;
  icon: string;
}

export const savedViews: SavedView[] = [
  { id: 'all', label: 'All Schedules', icon: 'ti ti-layout-list' },
  { id: 'Scheduled', label: 'Scheduled', icon: 'ti ti-calendar-check' },
  { id: 'Ongoing', label: 'Ongoing', icon: 'ti ti-progress' },
  { id: 'Completed', label: 'Completed', icon: 'ti ti-circle-check' },
  { id: 'Postponed', label: 'Postponed', icon: 'ti ti-calendar-pause' },
  { id: 'Draft', label: 'Draft', icon: 'ti ti-pencil' },
];

export const quickFilters: SavedView[] = savedViews.slice(1);

export interface FilterOption {
  value: string;
  label: string;
}

export interface FilterField {
  key: FilterKey;
  /** Chip prefix — the template used the `data-filter` attribute for this. */
  label: string;
  panelLabel: string;
  domId: string;
  /** The Date Range facet is the only full-width control in the panel. */
  wide?: boolean;
  placeholder: string;
  options: FilterOption[];
}

const plain = (values: string[]): FilterOption[] => values.map((value) => ({ value, label: value }));

export const advancedFilters: FilterField[] = [
  {
    key: 'year',
    label: 'Year',
    panelLabel: 'Academic Year',
    domId: 'se-academic-year',
    placeholder: 'All',
    options: plain(['2024/2025', '2023/2024']),
  },
  {
    key: 'exam',
    label: 'Exam',
    panelLabel: 'Exam',
    domId: 'se-exam',
    placeholder: 'All',
    options: plain([
      'Midterm Examination',
      'Final Examination',
      'Unit Test 3',
      'Chapter Test — Acids & Bases',
      'Practical Examination',
      'Quarterly Examination',
      'Half Yearly Examination',
      'Annual Examination',
      'Oral Test — Civilisations',
      'Progress Test',
    ]),
  },
  {
    key: 'class',
    label: 'Class',
    panelLabel: 'Class',
    domId: 'se-class',
    placeholder: 'All',
    options: [
      { value: 'class x', label: 'X' },
      { value: 'class xii', label: 'XII' },
      { value: 'class ix', label: 'IX' },
      { value: 'class xi', label: 'XI' },
      { value: 'class viii', label: 'VIII' },
      { value: 'class vii', label: 'VII' },
    ],
  },
  {
    key: 'section',
    label: 'Section',
    panelLabel: 'Section',
    domId: 'se-section',
    placeholder: 'All',
    options: [
      { value: 'sec a', label: 'A' },
      { value: 'sec b', label: 'B' },
      { value: 'sec c', label: 'C' },
    ],
  },
  {
    key: 'subject',
    label: 'Subject',
    panelLabel: 'Subject',
    domId: 'se-subject',
    placeholder: 'All',
    options: plain([
      'Mathematics',
      'Physics',
      'English',
      'Chemistry',
      'Biology',
      'Computer Science',
      'Geography',
      'Economics',
      'History',
      'Physical Education',
    ]),
  },
  {
    key: 'room',
    label: 'Room',
    panelLabel: 'Exam Hall',
    domId: 'se-exam-hall',
    placeholder: 'All',
    options: plain([
      'Hall A · Room 204',
      'Hall B · Room 301',
      'Room 108',
      'Room 210',
      'Lab 2',
      'Lab 1',
      'Hall A',
      'Hall C',
      'Room 115',
      'Ground',
    ]),
  },
  {
    key: 'invigilator',
    label: 'Invigilator',
    panelLabel: 'Invigilator',
    domId: 'se-invigilator',
    placeholder: 'All',
    options: plain([
      'Erickson',
      'James',
      'Teresa',
      'Hendrita',
      'Joseph',
      'Mori',
      'Ramsey',
      'Morgan',
      'Aariv',
      'Jacquelin',
    ]),
  },
  {
    key: 'status',
    label: 'Status',
    panelLabel: 'Schedule Status',
    domId: 'se-schedule-status',
    placeholder: 'All',
    options: plain([
      'Draft',
      'Scheduled',
      'Ongoing',
      'Completed',
      'Postponed',
      'Cancelled',
      'Archived',
    ]),
  },
  {
    key: 'date',
    label: 'Date',
    panelLabel: 'Date Range',
    domId: 'se-date-range',
    wide: true,
    placeholder: 'Any date',
    options: [
      { value: 'may 2024', label: 'May 2024' },
      { value: 'jun 2024', label: 'June 2024' },
      { value: 'jul 2024', label: 'July 2024' },
      { value: '2024', label: '2024' },
      { value: '2025', label: '2025' },
    ],
  },
];

export const columnDefs: { id: ColumnId; label: string }[] = [
  { id: 'schedule', label: 'Exam Schedule' },
  { id: 'details', label: 'Schedule Details' },
  { id: 'mgmt', label: 'Management' },
  { id: 'status', label: 'Status' },
];

export const allColumns: Record<ColumnId, boolean> = {
  schedule: true,
  details: true,
  mgmt: true,
  status: true,
};

export const densityOptions: { id: DensityId; icon: string; title: string }[] = [
  { id: 'compact', icon: 'ti ti-baseline-density-small', title: 'Compact' },
  { id: 'default', icon: 'ti ti-baseline-density-medium', title: 'Default' },
  { id: 'comfortable', icon: 'ti ti-baseline-density-large', title: 'Comfortable' },
];

export const sortOptions: { id: SortKey; label: string; icon: string }[] = [
  { id: 'name', label: 'Exam Name (A–Z)', icon: 'ti ti-abc' },
  { id: 'subject', label: 'Subject', icon: 'ti ti-book' },
  { id: 'teacher', label: 'Invigilator', icon: 'ti ti-shield-check' },
  { id: 'date', label: 'Exam Date', icon: 'ti ti-calendar' },
  { id: 'students', label: 'Registered Students', icon: 'ti ti-users' },
  { id: 'recent', label: 'Recently updated', icon: 'ti ti-clock' },
];

/** Unlike most pages every header here is sortable. */
export const tableHeaders: { id: ColumnId; label: string; sort: SortKey }[] = [
  { id: 'schedule', label: 'Exam Schedule', sort: 'name' },
  { id: 'details', label: 'Schedule Details', sort: 'date' },
  { id: 'mgmt', label: 'Management', sort: 'students' },
  { id: 'status', label: 'Status', sort: 'status' },
];

export const pageSizes = ['10', '25', '50'];

/* -------------------------------------------------------------------------- */
/*                          Header, bulk bar and menus                        */
/* -------------------------------------------------------------------------- */

/** The header dropdown offers three formats; Print is its own button beside it. */
export const exportActions: { id: string; label: string; icon: string }[] = [
  { id: 'export_pdf', label: 'Export as PDF', icon: 'ti ti-file-type-pdf' },
  { id: 'export_excel', label: 'Export as Excel', icon: 'ti ti-file-type-xls' },
  { id: 'export_csv', label: 'Export as CSV', icon: 'ti ti-file-type-csv' },
];

export interface BulkAction {
  id: string;
  label: string;
  icon: string;
  modal?: ScheduleModalId;
  danger?: boolean;
}

export const bulkActions: BulkAction[] = [
  { id: 'assign_invigilators', label: 'Assign Invigilators', icon: 'ti ti-shield-check' },
  { id: 'allocate_halls', label: 'Allocate Exam Halls', icon: 'ti ti-building' },
  { id: 'publish_schedule', label: 'Publish Schedule', icon: 'ti ti-send' },
  { id: 'hall_tickets', label: 'Generate Hall Tickets', icon: 'ti ti-ticket' },
  { id: 'export_csv', label: 'Export Selected', icon: 'ti ti-file-export' },
  { id: 'print', label: 'Print', icon: 'ti ti-printer' },
  { id: 'archive', label: 'Archive', icon: 'ti ti-archive' },
  { id: 'delete', label: 'Delete', icon: 'ti ti-trash', modal: 'delete', danger: true },
];

export interface RowMenuItem {
  id: string;
  label: string;
  icon: string;
  /** A key of `all_routes`; the template linked these entries at a real page. */
  route?: string;
  modal?: ScheduleModalId;
  danger?: boolean;
  divider?: boolean;
}

export const rowMenuItems: RowMenuItem[] = [
  { id: 'view', label: 'View Schedule', icon: 'ti ti-eye', modal: 'view' },
  { id: 'edit', label: 'Edit', icon: 'ti ti-edit', modal: 'edit' },
  { id: 'hall_allocation', label: 'Hall Allocation', icon: 'ti ti-building' },
  { id: 'invigilators', label: 'Assign Invigilator', icon: 'ti ti-shield-check' },
  { id: 'attendance', label: 'Attendance', icon: 'ti ti-user-check', route: 'examAttendance' },
  { id: 'question_paper', label: 'Question Paper', icon: 'ti ti-file-text' },
  { id: 'results', label: 'Results', icon: 'ti ti-chart-bar', route: 'examResult' },
  { id: 'student_list', label: 'Student List', icon: 'ti ti-users', route: 'studentList' },
  { id: 'print', label: 'Print Schedule', icon: 'ti ti-printer' },
  { id: 'duplicate', label: 'Duplicate Schedule', icon: 'ti ti-copy', divider: true },
  { id: 'reschedule', label: 'Reschedule', icon: 'ti ti-calendar-plus' },
  { id: 'publish', label: 'Publish', icon: 'ti ti-send' },
  { id: 'archive', label: 'Archive', icon: 'ti ti-archive' },
  { id: 'delete', label: 'Delete', icon: 'ti ti-trash-x', modal: 'delete', danger: true },
];

/**
 * `tables.js` L640–662, verbatim, plus the three messages the engine hard-codes for every
 * page (`export_csv`, `clear_filters`, `reset_columns` — L426, L453, L465).
 */
export const actionToasts: Record<string, string> = {
  refresh: 'Exam schedule refreshed.',
  save_view: 'Current filters saved as a new view.',
  duplicate: 'Schedule duplicated as a draft.',
  publish: 'Selected schedules published.',
  publish_schedule: 'Exam schedule published to portals.',
  reschedule: 'Reschedule opened for the selected exams.',
  view: 'Schedule details opened.',
  question_paper: 'Question paper opened for this exam.',
  hall_allocation: 'Hall allocation opened for this exam.',
  allocate_halls: 'Hall allocation opened for the selected exams.',
  invigilators: 'Invigilator assignment opened.',
  assign_invigilators: 'Invigilator assignment opened for the selected exams.',
  attendance: 'Exam attendance opened.',
  results: 'Exam results opened.',
  student_list: 'Registered student list opened for this exam.',
  hall_tickets: 'Hall tickets queued for generation.',
  print: 'Sending the exam schedule to the printer…',
  archive: 'Selected schedules archived.',
  export_excel: 'Excel workbook queued for download.',
  export_pdf: 'PDF export queued for download.',
  export_csv: 'Preparing export…',
  page: 'Loading the selected page…',
  clear_filters: 'Filters cleared.',
  reset_columns: 'All columns restored.',
};

/**
 * `tables.js` L664 — the engine's per-page wording, in its order of use. Its fourth slot is
 * the CSV filename, `exam-schedule.csv`, whose eleven columns (L632–639) are Exam, Code,
 * Subject, Type, Class, Date, Hall, Invigilator, Total Marks, Students and Status. Exporting
 * pushes the queued-download toast here, as it does on the other converted list pages, so
 * the filename itself has nothing to bind to.
 */
export const strings = {
  recentSort: 'Showing the most recently updated exams first.',
  filterMatch: ' exams match the current filters.',
  viewMatch: ' exams in “',
  applyMatch: ' exams match the current filters.',
};
