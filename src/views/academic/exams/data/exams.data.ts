import type { ToastVariant } from '@hooks/useToasts';

export type ExamStatus =
  | 'Scheduled'
  | 'Ongoing'
  | 'Completed'
  | 'Published'
  | 'Draft'
  | 'Cancelled'
  | 'Archived';

export type ExamPriority = 'High' | 'Medium' | 'Low';

/** Question-paper readiness, shown as a badge in the expanded detail panel. */
export type PaperStatus = 'Ready' | 'In Review' | 'Not Ready';

export type ColumnId = 'exam' | 'schedule' | 'details' | 'status';

export type DensityId = 'compact' | 'default' | 'comfortable';

export type FilterKey =
  | 'year'
  | 'type'
  | 'name'
  | 'class'
  | 'section'
  | 'subject'
  | 'teacher'
  | 'status'
  | 'date';

export type SortKey = 'name' | 'subject' | 'teacher' | 'date' | 'students' | 'status' | 'recent';

export type ToolbarMenu = 'views' | 'filters' | 'columns' | 'sort' | null;

/**
 * The template's dialog ids are `add_exam`, `edit_exam`, `view_exam`, `exam_import` and
 * `delete-modal`; normalised here so one `active` value drives every dialog.
 */
export type ExamModalId = 'add' | 'edit' | 'view' | 'import' | 'delete';

export interface ExamRow {
  /** Exam code, e.g. `EX240501` — used as the row key. */
  id: string;
  name: string;
  type: string;
  icon: string;
  /** Theme colour suffix shared by the avatar tint and the class badge. */
  tone: string;
  priority: ExamPriority;
  year: string;
  className: string;
  section: string;
  subject: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: string;
  room: string;
  teacher: { name: string; avatar: string };
  invigilator: string;
  totalMarks: number;
  passMarks: number;
  students: number;
  /** Seats in the allocated room; the template printed it beside the registered count. */
  capacity: number;
  paper: PaperStatus;
  /** `meter-success` or `meter-warning` on the marks-distribution bar. */
  meterTone: string;
  remark: string;
  status: ExamStatus;
  pillClass: string;
  /** Completed and Draft render a dot instead of an icon. */
  pillIcon: string | null;
  /** The template's `data-search` haystack, verbatim. */
  search: string;
}

/** The pill class and glyph each status renders with; also reused when a row's status changes. */
export const statusPill: Record<ExamStatus, { pillClass: string; pillIcon: string | null }> = {
  Scheduled: { pillClass: 'is-new', pillIcon: 'ti ti-calendar-check' },
  Ongoing: { pillClass: 'is-pending', pillIcon: 'ti ti-progress' },
  Completed: { pillClass: 'is-active', pillIcon: null },
  Published: { pillClass: 'is-exam', pillIcon: 'ti ti-send' },
  Draft: { pillClass: 'is-inactive', pillIcon: null },
  Cancelled: { pillClass: 'is-emergency', pillIcon: 'ti ti-ban' },
  Archived: { pillClass: 'is-archived', pillIcon: 'ti ti-archive' },
};

type ExamSeed = Omit<ExamRow, 'pillClass' | 'pillIcon'>;

const coordinator = (name: string, avatarNo: string) => ({
  name,
  avatar: `assets/img/teachers/teacher-${avatarNo}.jpg`,
});

const seeds: ExamSeed[] = [
  {
    id: 'EX240501',
    name: 'Midterm Examination',
    type: 'Midterm',
    icon: 'ti ti-math-symbols',
    tone: 'primary',
    priority: 'High',
    year: '2024/2025',
    className: 'X',
    section: 'A',
    subject: 'Mathematics',
    date: '13 May 2024',
    startTime: '09:30 AM',
    endTime: '11:30 AM',
    duration: '2h 00m',
    room: 'Hall A · Room 204',
    teacher: coordinator('Mori', '02'),
    invigilator: 'Erickson',
    totalMarks: 100,
    passMarks: 35,
    students: 42,
    capacity: 50,
    paper: 'In Review',
    meterTone: 'success',
    remark: 'Scheduled — awaiting question paper approval.',
    status: 'Scheduled',
    search:
      'midterm examination ex240501 midterm 2024/2025 class x sec a mathematics mori erickson scheduled high 13 may 2024 hall a · room 204',
  },
  {
    id: 'EX240502',
    name: 'Final Examination',
    type: 'Final Exam',
    icon: 'ti ti-atom',
    tone: 'info',
    priority: 'High',
    year: '2024/2025',
    className: 'XII',
    section: 'A',
    subject: 'Physics',
    date: '18 Jul 2024',
    startTime: '10:30 AM',
    endTime: '12:30 PM',
    duration: '2h 00m',
    room: 'Hall B · Room 301',
    teacher: coordinator('Joseph', '03'),
    invigilator: 'James',
    totalMarks: 100,
    passMarks: 40,
    students: 38,
    capacity: 46,
    paper: 'Ready',
    meterTone: 'warning',
    remark: 'Published — hall tickets released to students.',
    status: 'Published',
    search:
      'final examination ex240502 final exam 2024/2025 class xii sec a physics joseph james published high 18 jul 2024 hall b · room 301',
  },
  {
    id: 'EX240503',
    name: 'Unit Test 3',
    type: 'Unit Test',
    icon: 'ti ti-abc',
    tone: 'success',
    priority: 'Medium',
    year: '2024/2025',
    className: 'IX',
    section: 'B',
    subject: 'English',
    date: '09 May 2024',
    startTime: '09:30 AM',
    endTime: '10:45 AM',
    duration: '1h 15m',
    room: 'Room 108',
    teacher: coordinator('Erickson', '01'),
    invigilator: 'Teresa',
    totalMarks: 50,
    passMarks: 18,
    students: 40,
    capacity: 48,
    paper: 'Ready',
    meterTone: 'warning',
    remark: 'Completed — results uploaded and verified.',
    status: 'Completed',
    search:
      'unit test 3 ex240503 unit test 2024/2025 class ix sec b english erickson teresa completed medium 09 may 2024 room 108',
  },
  {
    id: 'EX240504',
    name: 'Chapter Test — Acids & Bases',
    type: 'Chapter Test',
    icon: 'ti ti-flask',
    tone: 'warning',
    priority: 'Low',
    year: '2024/2025',
    className: 'XI',
    section: 'A',
    subject: 'Chemistry',
    date: '20 May 2024',
    startTime: '11:00 AM',
    endTime: '12:00 PM',
    duration: '1h 00m',
    room: 'Room 210',
    teacher: coordinator('James', '04'),
    invigilator: 'Hendrita',
    totalMarks: 40,
    passMarks: 14,
    students: 36,
    capacity: 44,
    paper: 'Not Ready',
    meterTone: 'success',
    remark: 'Draft — question paper and hall allocation not finalised.',
    status: 'Draft',
    search:
      'chapter test — acids & bases ex240504 chapter test 2024/2025 class xi sec a chemistry james hendrita draft low 20 may 2024 room 210',
  },
  {
    id: 'EX240505',
    name: 'Practical Examination',
    type: 'Practical',
    icon: 'ti ti-dna',
    tone: 'danger',
    priority: 'Medium',
    year: '2024/2025',
    className: 'XII',
    section: 'C',
    subject: 'Biology',
    date: '07 May 2024',
    startTime: '09:00 AM',
    endTime: '11:00 AM',
    duration: '2h 00m',
    room: 'Lab 2',
    teacher: coordinator('Teresa', '05'),
    invigilator: 'Joseph',
    totalMarks: 30,
    passMarks: 12,
    students: 32,
    capacity: 40,
    paper: 'Ready',
    meterTone: 'warning',
    remark: 'Exam in progress — invigilators on duty.',
    status: 'Ongoing',
    search:
      'practical examination ex240505 practical 2024/2025 class xii sec c biology teresa joseph ongoing medium 07 may 2024 lab 2',
  },
  {
    id: 'EX240506',
    name: 'Quarterly Examination',
    type: 'Quarterly',
    icon: 'ti ti-code',
    tone: 'dark',
    priority: 'High',
    year: '2024/2025',
    className: 'X',
    section: 'A',
    subject: 'Computer Science',
    date: '26 Aug 2024',
    startTime: '09:00 AM',
    endTime: '12:00 PM',
    duration: '3h 00m',
    room: 'Lab 1',
    teacher: coordinator('Hendrita', '06'),
    invigilator: 'Mori',
    totalMarks: 100,
    passMarks: 35,
    students: 44,
    capacity: 52,
    paper: 'In Review',
    meterTone: 'success',
    remark: 'Scheduled — awaiting question paper approval.',
    status: 'Scheduled',
    search:
      'quarterly examination ex240506 quarterly 2024/2025 class x sec a computer science hendrita mori scheduled high 26 aug 2024 lab 1',
  },
  {
    id: 'EX240507',
    name: 'Half Yearly Examination',
    type: 'Half Yearly',
    icon: 'ti ti-world',
    tone: 'pink',
    priority: 'Medium',
    year: '2024/2025',
    className: 'VIII',
    section: 'B',
    subject: 'Geography',
    date: '15 Nov 2024',
    startTime: '09:30 AM',
    endTime: '12:30 PM',
    duration: '3h 00m',
    room: 'Hall A',
    teacher: coordinator('Jacquelin', '07'),
    invigilator: 'Ramsey',
    totalMarks: 80,
    passMarks: 28,
    students: 38,
    capacity: 46,
    paper: 'Not Ready',
    meterTone: 'success',
    remark: 'Draft — question paper and hall allocation not finalised.',
    status: 'Draft',
    search:
      'half yearly examination ex240507 half yearly 2024/2025 class viii sec b geography jacquelin ramsey draft medium 15 nov 2024 hall a',
  },
  {
    id: 'EX240508',
    name: 'Annual Examination',
    type: 'Annual',
    icon: 'ti ti-coin',
    tone: 'teal',
    priority: 'High',
    year: '2024/2025',
    className: 'XI',
    section: 'A',
    subject: 'Economics',
    date: '10 Mar 2025',
    startTime: '10:00 AM',
    endTime: '01:00 PM',
    duration: '3h 00m',
    room: 'Hall C',
    teacher: coordinator('Ramsey', '08'),
    invigilator: 'Morgan',
    totalMarks: 100,
    passMarks: 40,
    students: 41,
    capacity: 49,
    paper: 'In Review',
    meterTone: 'warning',
    remark: 'Scheduled — awaiting question paper approval.',
    status: 'Scheduled',
    search:
      'annual examination ex240508 annual 2024/2025 class xi sec a economics ramsey morgan scheduled high 10 mar 2025 hall c',
  },
  {
    id: 'EX240509',
    name: 'Oral Test — Civilisations',
    type: 'Oral Test',
    icon: 'ti ti-books',
    tone: 'purple',
    priority: 'Low',
    year: '2024/2025',
    className: 'VII',
    section: 'B',
    subject: 'History',
    date: '03 Jul 2024',
    startTime: '12:30 PM',
    endTime: '01:30 PM',
    duration: '1h 00m',
    room: 'Room 115',
    teacher: coordinator('Morgan', '10'),
    invigilator: 'Aariv',
    totalMarks: 25,
    passMarks: 10,
    students: 39,
    capacity: 47,
    paper: 'Ready',
    meterTone: 'warning',
    remark: 'Exam cancelled — reschedule pending approval.',
    status: 'Cancelled',
    search:
      'oral test — civilisations ex240509 oral test 2024/2025 class vii sec b history morgan aariv cancelled low 03 jul 2024 room 115',
  },
  {
    id: 'EX240510',
    name: 'Progress Test',
    type: 'Progress Test',
    icon: 'ti ti-run',
    tone: 'secondary',
    priority: 'Low',
    year: '2023/2024',
    className: 'VIII',
    section: 'A',
    subject: 'Physical Education',
    date: '20 Jun 2024',
    startTime: '11:00 AM',
    endTime: '12:00 PM',
    duration: '1h 00m',
    room: 'Ground',
    teacher: coordinator('Aariv', '09'),
    invigilator: 'Jacquelin',
    totalMarks: 20,
    passMarks: 8,
    students: 40,
    capacity: 48,
    paper: 'Ready',
    meterTone: 'warning',
    // The template left the Scheduled remark on this archived row; kept verbatim.
    remark: 'Scheduled — awaiting question paper approval.',
    status: 'Archived',
    search:
      'progress test ex240510 progress test 2023/2024 class viii sec a physical education aariv jacquelin archived low 20 jun 2024 ground',
  },
];

export const examRows: ExamRow[] = seeds.map((seed) => ({ ...seed, ...statusPill[seed.status] }));

/* -------------------------------------------------------------------------- */
/*                          Derived copy for the panels                       */
/* -------------------------------------------------------------------------- */

export const priorityBadge: Record<ExamPriority, string> = {
  High: 'badge-soft-danger',
  Medium: 'badge-soft-warning',
  Low: 'badge-soft-success',
};

export const paperBadge: Record<PaperStatus, { badge: string; icon: string }> = {
  Ready: { badge: 'badge-soft-success', icon: 'ti ti-file-check' },
  'In Review': { badge: 'badge-soft-warning', icon: 'ti ti-file-pencil' },
  'Not Ready': { badge: 'badge-soft-secondary', icon: 'ti ti-file-dots' },
};

/** Every row's first two instructions are fixed; only the venue and start time move. */
export const examInstructions = (row: ExamRow) => [
  `Report to ${row.room} 15 minutes before ${row.startTime}.`,
  'Bring your hall ticket and school ID card.',
  'Electronic devices are strictly prohibited.',
];

export const syllabusCoverage = (row: ExamRow) =>
  `${row.subject} — full ${row.type.toLowerCase()} syllabus for Class ${row.className}. ${row.totalMarks} marks paper.`;

export const roomAllocation = (row: ExamRow) =>
  `${row.room} · capacity ${row.capacity} seats · ${row.students} allocated.`;

export const passPercent = (row: ExamRow) => Math.round((row.passMarks / row.totalMarks) * 100);

/** The View dialog condensed "09:30 AM – 11:30 AM" into "09:30–11:30 AM". */
export const timeRange = (row: ExamRow) => `${row.startTime.replace(/\s(AM|PM)$/, '')}–${row.endTime}`;

export const viewInstructions = (row: ExamRow) =>
  `Report to ${row.room} fifteen minutes before the start. Hall ticket and school ID required. Electronic devices prohibited.`;

/** Both attachment chips are the same on every row in the template. */
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
  { id: 'all', label: 'All Exams', icon: 'ti ti-layout-list' },
  { id: 'Scheduled', label: 'Scheduled', icon: 'ti ti-calendar-check' },
  { id: 'Ongoing', label: 'Ongoing', icon: 'ti ti-progress' },
  { id: 'Completed', label: 'Completed', icon: 'ti ti-circle-check' },
  { id: 'Published', label: 'Published', icon: 'ti ti-send' },
  { id: 'Draft', label: 'Draft', icon: 'ti ti-pencil' },
];

export const quickFilters: SavedView[] = savedViews.slice(1);

export interface FilterOption {
  value: string;
  label: string;
}

export interface FilterField {
  key: FilterKey;
  /** Shown on the chip; the template used the `data-filter` attribute for this. */
  label: string;
  panelLabel: string;
  domId: string;
  /** The Date Range facet spans the full width of the filter panel. */
  wide?: boolean;
  /** "All" on every facet except Date Range, which reads "Any date". */
  allLabel?: string;
  options: FilterOption[];
}

const plain = (values: string[]): FilterOption[] => values.map((value) => ({ value, label: value }));

export const advancedFilters: FilterField[] = [
  {
    key: 'year',
    label: 'Year',
    panelLabel: 'Academic Year',
    domId: 'exm-academic-year',
    options: plain(['2024/2025', '2023/2024']),
  },
  {
    key: 'type',
    label: 'Type',
    panelLabel: 'Exam Type',
    domId: 'exm-exam-type',
    options: plain([
      'Midterm',
      'Final Exam',
      'Unit Test',
      'Chapter Test',
      'Practical',
      'Quarterly',
      'Half Yearly',
      'Annual',
      'Oral Test',
      'Progress Test',
    ]),
  },
  {
    key: 'name',
    label: 'Name',
    panelLabel: 'Exam Name',
    domId: 'exm-exam-name',
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
    domId: 'exm-class',
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
    domId: 'exm-section',
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
    domId: 'exm-subject',
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
    key: 'teacher',
    label: 'Teacher',
    panelLabel: 'Teacher',
    domId: 'exm-teacher',
    options: plain([
      'Mori',
      'Joseph',
      'Erickson',
      'James',
      'Teresa',
      'Hendrita',
      'Jacquelin',
      'Ramsey',
      'Morgan',
      'Aariv',
    ]),
  },
  {
    key: 'status',
    label: 'Status',
    panelLabel: 'Exam Status',
    domId: 'exm-exam-status',
    options: plain([
      'Draft',
      'Scheduled',
      'Ongoing',
      'Completed',
      'Published',
      'Cancelled',
      'Archived',
    ]),
  },
  {
    key: 'date',
    label: 'Date',
    panelLabel: 'Date Range',
    domId: 'exm-date-range',
    wide: true,
    allLabel: 'Any date',
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
  { id: 'exam', label: 'Exam' },
  { id: 'schedule', label: 'Schedule' },
  { id: 'details', label: 'Exam Details' },
  { id: 'status', label: 'Status' },
];

export const allColumns: Record<ColumnId, boolean> = {
  exam: true,
  schedule: true,
  details: true,
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
  { id: 'teacher', label: 'Coordinator', icon: 'ti ti-user' },
  { id: 'date', label: 'Exam Date', icon: 'ti ti-calendar' },
  { id: 'students', label: 'Registered Students', icon: 'ti ti-users' },
  { id: 'recent', label: 'Recently updated', icon: 'ti ti-clock' },
];

/** Every grid header on this page is sortable, unlike most of the other list pages. */
export const tableHeaders: { id: ColumnId; label: string; sort: SortKey }[] = [
  { id: 'exam', label: 'Exam', sort: 'name' },
  { id: 'schedule', label: 'Schedule', sort: 'date' },
  { id: 'details', label: 'Exam Details', sort: 'students' },
  { id: 'status', label: 'Status', sort: 'status' },
];

export const pageSizes = ['10', '25', '50'];

/* -------------------------------------------------------------------------- */
/*                          Header, bulk bar and menus                        */
/* -------------------------------------------------------------------------- */

/**
 * The header's Export dropdown carries only the three file formats — the template gave
 * Print its own button beside the dropdown (L1481–1483) rather than a menu entry.
 */
export const exportActions: { id: string; label: string; icon: string }[] = [
  { id: 'export_pdf', label: 'Export as PDF', icon: 'ti ti-file-type-pdf' },
  { id: 'export_excel', label: 'Export as Excel', icon: 'ti ti-file-type-xls' },
  { id: 'export_csv', label: 'Export as CSV', icon: 'ti ti-file-type-csv' },
];

export interface BulkAction {
  id: string;
  label: string;
  icon: string;
  modal?: ExamModalId;
  danger?: boolean;
}

export const bulkActions: BulkAction[] = [
  { id: 'assign_invigilators', label: 'Assign Invigilators', icon: 'ti ti-shield-check' },
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
  /** Key into `all_routes`; these entries were real links in the template. */
  route?: string;
  modal?: ExamModalId;
  danger?: boolean;
  divider?: boolean;
}

export const rowMenuItems: RowMenuItem[] = [
  { id: 'view', label: 'View Exam', icon: 'ti ti-eye', modal: 'view' },
  { id: 'edit', label: 'Edit', icon: 'ti ti-edit', modal: 'edit' },
  { id: 'schedule', label: 'Exam Schedule', icon: 'ti ti-calendar-time', route: 'examSchedule' },
  { id: 'question_paper', label: 'Question Paper', icon: 'ti ti-file-text' },
  { id: 'hall_allocation', label: 'Hall Allocation', icon: 'ti ti-building' },
  { id: 'invigilators', label: 'Invigilators', icon: 'ti ti-shield-check' },
  { id: 'attendance', label: 'Attendance', icon: 'ti ti-user-check', route: 'examAttendance' },
  { id: 'results', label: 'Results', icon: 'ti ti-chart-bar', route: 'examResult' },
  { id: 'mark_entry', label: 'Mark Entry', icon: 'ti ti-writing' },
  { id: 'reports', label: 'Reports', icon: 'ti ti-report-analytics' },
  { id: 'print', label: 'Print', icon: 'ti ti-printer' },
  { id: 'duplicate', label: 'Duplicate Exam', icon: 'ti ti-copy', divider: true },
  { id: 'publish', label: 'Publish', icon: 'ti ti-send' },
  { id: 'reschedule', label: 'Reschedule', icon: 'ti ti-calendar-plus' },
  { id: 'archive', label: 'Archive', icon: 'ti ti-archive' },
  { id: 'delete', label: 'Delete', icon: 'ti ti-trash-x', modal: 'delete', danger: true },
];

/** The five inline icon buttons in the Actions cell, before the overflow menu. */
export const rowQuickActions: RowMenuItem[] = [
  { id: 'view', label: 'View Exam', icon: 'ti ti-eye', modal: 'view' },
  { id: 'edit', label: 'Edit', icon: 'ti ti-edit', modal: 'edit' },
  { id: 'schedule', label: 'Exam Schedule', icon: 'ti ti-calendar-time', route: 'examSchedule' },
  { id: 'question_paper', label: 'Question Paper', icon: 'ti ti-file-text' },
  { id: 'results', label: 'Results', icon: 'ti ti-chart-bar', route: 'examResult' },
];

export interface ActionToast {
  message: string;
  variant: ToastVariant;
}

/**
 * `tables.js` L717–740, verbatim. The last three are not in `PAGE_CONFIG` — the engine
 * hard-codes them in its action router (L426, L453, L465) for every page.
 */
export const actionToasts: Record<string, ActionToast> = {
  refresh: { message: 'Exam list refreshed.', variant: 'success' },
  save_view: { message: 'Current filters saved as a new view.', variant: 'success' },
  duplicate: { message: 'Exam duplicated as a draft.', variant: 'success' },
  publish: { message: 'Selected exams published.', variant: 'success' },
  publish_schedule: { message: 'Exam schedule published to portals.', variant: 'success' },
  reschedule: { message: 'Reschedule opened for the selected exams.', variant: 'info' },
  view: { message: 'Exam details opened.', variant: 'info' },
  schedule: { message: 'Exam schedule opened.', variant: 'info' },
  question_paper: { message: 'Question paper opened for this exam.', variant: 'info' },
  hall_allocation: { message: 'Hall allocation opened for this exam.', variant: 'info' },
  invigilators: { message: 'Invigilator assignment opened.', variant: 'info' },
  assign_invigilators: {
    message: 'Invigilator assignment opened for the selected exams.',
    variant: 'info',
  },
  attendance: { message: 'Exam attendance opened.', variant: 'info' },
  results: { message: 'Exam results opened.', variant: 'info' },
  mark_entry: { message: 'Mark entry opened for this exam.', variant: 'info' },
  hall_tickets: { message: 'Hall tickets queued for generation.', variant: 'info' },
  reports: { message: 'Exam report opened.', variant: 'info' },
  print: { message: 'Sending the exam schedule to the printer…', variant: 'info' },
  archive: { message: 'Selected exams archived.', variant: 'success' },
  export_excel: { message: 'Excel workbook queued for download.', variant: 'info' },
  export_pdf: { message: 'PDF export queued for download.', variant: 'info' },
  page: { message: 'Loading the selected page…', variant: 'info' },
  export_csv: { message: 'Preparing export…', variant: 'info' },
  clear_filters: { message: 'Filters cleared.', variant: 'success' },
  reset_columns: { message: 'All columns restored.', variant: 'success' },
};

/**
 * `tables.js` L710–716 — one CSV column per grid column, in the same order. The engine
 * read each value out of the DOM through these selectors; here they read the row.
 */
export const csvColumns: { label: string; value: (row: ExamRow) => string }[] = [
  { label: 'Exam', value: (row) => row.name },
  { label: 'Code', value: (row) => row.id },
  { label: 'Type', value: (row) => row.type },
  { label: 'Class', value: (row) => row.className },
  { label: 'Subject', value: (row) => row.subject },
  { label: 'Date', value: (row) => row.date },
  { label: 'Room', value: (row) => row.room },
  { label: 'Total Marks', value: (row) => String(row.totalMarks) },
  { label: 'Students', value: (row) => String(row.students) },
  { label: 'Status', value: (row) => row.status },
];

/** `tables.js` L742 — the engine's `strings` array for this page, in order of use. */
export const strings = {
  recentSort: 'Showing the most recently updated exams first.',
  filterMatch: ' exams match the current filters.',
  viewMatch: ' exams in “',
  csvFile: 'exam.csv',
};
