export type SubjectStatus = 'Active' | 'Published' | 'Draft' | 'Archived';

export type ColumnId = 'subject' | 'details' | 'curriculum' | 'status';

export type DensityId = 'compact' | 'default' | 'comfortable';

export type FilterKey = 'year' | 'class' | 'section' | 'category' | 'department' | 'teacher' | 'status';

export type SortKey = 'name' | 'category' | 'teacher' | 'periods' | 'credits' | 'units' | 'status' | 'recent';

export type ToolbarMenu = 'views' | 'filters' | 'columns' | 'sort' | null;

export type SubjectModalId = 'add' | 'edit' | 'view' | 'import' | 'delete';

export interface SubjectRow {
  /** Subject code, used as the row key. */
  id: string;
  name: string;
  category: string;
  categoryBadge: string;
  icon: string;
  iconTone: string;
  teacher: { name: string; avatar: string };
  className: string;
  section: string;
  year: string;
  department: string;
  periods: number;
  credits: number;
  units: number;
  lessons: number;
  assignments: number;
  exams: number;
  resources: number;
  updated: string;
  status: SubjectStatus;
  pillClass: string;
  /** Published and Archived show an icon; Active and Draft show a dot. */
  pillIcon: string | null;
  /** The template's `data-search` haystack, verbatim. */
  search: string;
}

const PILLS: Record<SubjectStatus, { pillClass: string; pillIcon: string | null }> = {
  Active: { pillClass: 'is-active', pillIcon: null },
  Published: { pillClass: 'is-new', pillIcon: 'ti ti-send' },
  Draft: { pillClass: 'is-inactive', pillIcon: null },
  Archived: { pillClass: 'is-archived', pillIcon: 'ti ti-archive' },
};

const row = (
  id: string,
  name: string,
  category: string,
  categoryBadge: string,
  icon: string,
  iconTone: string,
  teacherName: string,
  avatarNo: string,
  className: string,
  section: string,
  year: string,
  department: string,
  periods: number,
  credits: number,
  units: number,
  lessons: number,
  assignments: number,
  exams: number,
  resources: number,
  updated: string,
  status: SubjectStatus,
  search: string,
): SubjectRow => ({
  id,
  name,
  category,
  categoryBadge,
  icon: `ti ti-${icon}`,
  iconTone,
  teacher: { name: teacherName, avatar: `assets/img/teachers/teacher-${avatarNo}.jpg` },
  className,
  section,
  year,
  department,
  periods,
  credits,
  units,
  lessons,
  assignments,
  exams,
  resources,
  updated,
  status,
  ...PILLS[status],
  search,
});

export const subjectRows: SubjectRow[] = [
  row('ENG-101', 'English', 'Languages', 'badge-soft-primary', 'abc', 'primary', 'Erickson', '01', 'III', 'A', '2024/2025', 'Languages', 6, 4, 6, 88, 12, 3, 24, '2 days ago', 'Active', 'english eng-101 languages class iii sec a 2024/2025 languages erickson active'),
  row('MAT-102', 'Mathematics', 'Core', 'badge-soft-success', 'math-symbols', 'success', 'Mori', '02', 'IV', 'B', '2024/2025', 'Mathematics', 7, 5, 8, 110, 16, 4, 30, '5 hours ago', 'Published', 'mathematics mat-102 core class iv sec b 2024/2025 mathematics mori published'),
  row('PHY-103', 'Physics', 'Science', 'badge-soft-info', 'atom', 'info', 'Joseph', '03', 'V', 'A', '2024/2025', 'Science', 6, 4, 7, 96, 14, 3, 28, '1 week ago', 'Active', 'physics phy-103 science class v sec a 2024/2025 science joseph active'),
  row('CHE-104', 'Chemistry', 'Science', 'badge-soft-warning', 'flask', 'warning', 'James', '04', 'V', 'B', '2024/2025', 'Science', 6, 4, 6, 84, 12, 3, 22, '1 day ago', 'Draft', 'chemistry che-104 science class v sec b 2024/2025 science james draft'),
  row('BIO-105', 'Biology', 'Science', 'badge-soft-danger', 'dna', 'danger', 'Teresa', '05', 'V', 'C', '2024/2025', 'Science', 5, 3, 7, 90, 10, 2, 26, '3 days ago', 'Published', 'biology bio-105 science class v sec c 2024/2025 science teresa published'),
  row('CSC-106', 'Computer Science', 'Technology', 'badge-soft-dark', 'code', 'dark', 'Hendrita', '06', 'VI', 'A', '2024/2025', 'Technology', 5, 3, 5, 70, 8, 2, 18, '6 hours ago', 'Active', 'computer science csc-106 technology class vi sec a 2024/2025 technology hendrita active'),
  row('GEO-107', 'Geography', 'Humanities', 'badge-soft-pink', 'world', 'pink', 'Jacquelin', '07', 'III', 'B', '2023/2024', 'Social Studies', 4, 2, 6, 76, 9, 2, 16, '2 weeks ago', 'Archived', 'geography geo-107 humanities class iii sec b 2023/2024 social studies jacquelin archived'),
  row('ECO-108', 'Economics', 'Humanities', 'badge-soft-teal', 'coin', 'teal', 'Ramsey', '08', 'VII', 'A', '2024/2025', 'Commerce', 5, 3, 6, 72, 11, 3, 20, '4 days ago', 'Active', 'economics eco-108 humanities class vii sec a 2024/2025 commerce ramsey active'),
  row('HIS-109', 'History', 'Humanities', 'badge-soft-purple', 'books', 'purple', 'Morgan', '10', 'VII', 'B', '2024/2025', 'Social Studies', 5, 3, 7, 82, 10, 2, 22, '1 day ago', 'Published', 'history his-109 humanities class vii sec b 2024/2025 social studies morgan published'),
  row('PED-110', 'Physical Education', 'Co-curricular', 'badge-soft-secondary', 'run', 'secondary', 'Aariv', '09', 'VIII', 'A', '2024/2025', 'Sports', 3, 2, 4, 40, 4, 1, 8, '8 hours ago', 'Draft', 'physical education ped-110 co-curricular class viii sec a 2024/2025 sports aariv draft'),
];

/** The detail panel's learning objectives are the same three lines on every row. */
export const learningObjectives = (subject: string) => [
  `Master core ${subject} concepts and skills.`,
  'Apply knowledge through assignments and projects.',
  'Prepare for term and final assessments.',
];

export const subjectDescription = (row: SubjectRow) =>
  `${row.name} (${row.category}) for Class ${row.className}-${row.section}, spanning ${row.units} units and ${row.lessons} lessons across the ${row.year} session.`;

/* -------------------------------------------------------------------------- */
/*                                  Toolbar                                   */
/* -------------------------------------------------------------------------- */

export interface SavedView {
  id: string;
  label: string;
  icon: string;
}

export const savedViews: SavedView[] = [
  { id: 'all', label: 'All Subjects', icon: 'ti ti-layout-list' },
  { id: 'Active', label: 'Active', icon: 'ti ti-circle-check' },
  { id: 'Published', label: 'Published', icon: 'ti ti-send' },
  { id: 'Draft', label: 'Draft', icon: 'ti ti-pencil' },
  { id: 'Archived', label: 'Archived', icon: 'ti ti-archive' },
];

export const quickFilters: SavedView[] = savedViews.slice(1);

export interface FilterOption {
  value: string;
  label: string;
}

export interface FilterField {
  key: FilterKey;
  label: string;
  panelLabel: string;
  domId: string;
  options: FilterOption[];
}

const plain = (values: string[]): FilterOption[] => values.map((value) => ({ value, label: value }));

export const advancedFilters: FilterField[] = [
  { key: 'year', label: 'Year', panelLabel: 'Academic Year', domId: 'sub-academic-year', options: plain(['2024/2025', '2023/2024']) },
  {
    key: 'class',
    label: 'Class',
    panelLabel: 'Class',
    domId: 'sub-class',
    options: [
      { value: 'class iii', label: 'III' },
      { value: 'class iv', label: 'IV' },
      { value: 'class v', label: 'V' },
      { value: 'class vi', label: 'VI' },
      { value: 'class vii', label: 'VII' },
      { value: 'class viii', label: 'VIII' },
    ],
  },
  {
    key: 'section',
    label: 'Section',
    panelLabel: 'Section',
    domId: 'sub-section',
    options: [
      { value: 'sec a', label: 'A' },
      { value: 'sec b', label: 'B' },
      { value: 'sec c', label: 'C' },
    ],
  },
  {
    key: 'category',
    label: 'Category',
    panelLabel: 'Category',
    domId: 'sub-category',
    options: plain(['Core', 'Languages', 'Science', 'Humanities', 'Technology', 'Co-curricular']),
  },
  {
    key: 'department',
    label: 'Department',
    panelLabel: 'Department',
    domId: 'sub-department',
    options: plain(['Languages', 'Mathematics', 'Science', 'Technology', 'Social Studies', 'Commerce', 'Sports']),
  },
  {
    key: 'teacher',
    label: 'Teacher',
    panelLabel: 'Teacher',
    domId: 'sub-teacher',
    options: plain([
      'Erickson',
      'Mori',
      'Joseph',
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
    panelLabel: 'Status',
    domId: 'sub-status',
    options: plain(['Active', 'Published', 'Draft', 'Archived']),
  },
];

export const columnDefs: { id: ColumnId; label: string }[] = [
  { id: 'subject', label: 'Subject' },
  { id: 'details', label: 'Academic Details' },
  { id: 'curriculum', label: 'Curriculum' },
  { id: 'status', label: 'Status' },
];

export const allColumns: Record<ColumnId, boolean> = {
  subject: true,
  details: true,
  curriculum: true,
  status: true,
};

export const densityOptions: { id: DensityId; icon: string; title: string }[] = [
  { id: 'compact', icon: 'ti ti-baseline-density-small', title: 'Compact' },
  { id: 'default', icon: 'ti ti-baseline-density-medium', title: 'Default' },
  { id: 'comfortable', icon: 'ti ti-baseline-density-large', title: 'Comfortable' },
];

export const sortOptions: { id: SortKey; label: string; icon: string }[] = [
  { id: 'name', label: 'Subject (A–Z)', icon: 'ti ti-abc' },
  { id: 'category', label: 'Category', icon: 'ti ti-category' },
  { id: 'teacher', label: 'Teacher', icon: 'ti ti-user' },
  { id: 'periods', label: 'Periods per week', icon: 'ti ti-clock-hour-4' },
  { id: 'credits', label: 'Credits', icon: 'ti ti-award' },
  { id: 'units', label: 'Units', icon: 'ti ti-stack-2' },
  { id: 'recent', label: 'Recently updated', icon: 'ti ti-clock' },
];

/** Academic Details and Curriculum are the non-sortable headers in the template. */
export const tableHeaders: { id: ColumnId; label: string; sort: SortKey | null }[] = [
  { id: 'subject', label: 'Subject', sort: 'name' },
  { id: 'details', label: 'Academic Details', sort: null },
  { id: 'curriculum', label: 'Curriculum', sort: null },
  { id: 'status', label: 'Status', sort: 'status' },
];

export const pageSizes = ['10', '25', '50', '100'];

/* -------------------------------------------------------------------------- */
/*                          Header, bulk bar and menus                        */
/* -------------------------------------------------------------------------- */

export const exportActions: { id: string; label: string; icon: string }[] = [
  { id: 'export_pdf', label: 'Export as PDF', icon: 'ti ti-file-type-pdf' },
  { id: 'export_excel', label: 'Export as Excel', icon: 'ti ti-file-type-xls' },
  { id: 'export_csv', label: 'Export as CSV', icon: 'ti ti-file-type-csv' },
  { id: 'print', label: 'Print', icon: 'ti ti-printer' },
];

export interface BulkAction {
  id: string;
  label: string;
  icon: string;
  modal?: SubjectModalId;
  danger?: boolean;
}

export const bulkActions: BulkAction[] = [
  { id: 'assign_teacher', label: 'Assign Teacher', icon: 'ti ti-user-plus' },
  { id: 'assign_class', label: 'Assign Classes', icon: 'ti ti-school' },
  { id: 'publish', label: 'Publish', icon: 'ti ti-send' },
  { id: 'export_csv', label: 'Export', icon: 'ti ti-download' },
  { id: 'print', label: 'Print', icon: 'ti ti-printer' },
  { id: 'archive', label: 'Archive', icon: 'ti ti-archive' },
  { id: 'delete', label: 'Delete', icon: 'ti ti-trash', modal: 'delete', danger: true },
];

export interface RowMenuItem {
  id: string;
  label: string;
  icon: string;
  route?: string;
  modal?: SubjectModalId;
  danger?: boolean;
  divider?: boolean;
}

export const rowMenuItems: RowMenuItem[] = [
  { id: 'view', label: 'View Subject', icon: 'ti ti-eye', modal: 'view' },
  { id: 'edit', label: 'Edit', icon: 'ti ti-edit', modal: 'edit' },
  { id: 'classes', label: 'Assigned Classes', icon: 'ti ti-school', route: 'classes' },
  { id: 'teachers', label: 'Assigned Teachers', icon: 'ti ti-users', route: 'teacherList' },
  { id: 'syllabus', label: 'Syllabus', icon: 'ti ti-book-2', route: 'classSyllabus' },
  { id: 'lesson_plans', label: 'Lesson Plans', icon: 'ti ti-notebook' },
  { id: 'assignments', label: 'Assignments', icon: 'ti ti-clipboard-list' },
  { id: 'exams', label: 'Exams', icon: 'ti ti-file-certificate', route: 'exam' },
  { id: 'attendance', label: 'Attendance', icon: 'ti ti-calendar-check', route: 'studentAttendance' },
  { id: 'materials', label: 'Study Materials', icon: 'ti ti-folder' },
  { id: 'reports', label: 'Reports', icon: 'ti ti-chart-bar', route: 'classAnalytics' },
  { id: 'print', label: 'Print', icon: 'ti ti-printer' },
  { id: 'assign_teacher', label: 'Assign Teacher', icon: 'ti ti-user-plus', divider: true },
  { id: 'assign_class', label: 'Assign Class', icon: 'ti ti-school' },
  { id: 'duplicate', label: 'Duplicate Subject', icon: 'ti ti-copy' },
  { id: 'publish', label: 'Publish', icon: 'ti ti-send' },
  { id: 'archive', label: 'Archive', icon: 'ti ti-archive' },
  { id: 'delete', label: 'Delete', icon: 'ti ti-trash-x', modal: 'delete', danger: true },
];

/** `tables.js` L1667–1690, verbatim. */
export const actionToasts: Record<string, string> = {
  refresh: 'Subject list refreshed.',
  save_view: 'Current filters saved as a new view.',
  duplicate: 'Subject duplicated as a draft.',
  publish: 'Selected subjects published.',
  assign_teacher: 'Teacher assignment opened for the selected subjects.',
  assign_class: 'Class assignment opened for the selected subjects.',
  classes: 'Assigned classes opened for this subject.',
  teachers: 'Assigned teachers opened for this subject.',
  syllabus: 'Syllabus opened for this subject.',
  lesson_plans: 'Lesson plans opened for this subject.',
  assignments: 'Assignments opened for this subject.',
  exams: 'Exams opened for this subject.',
  attendance: 'Attendance opened for this subject.',
  materials: 'Study materials opened for this subject.',
  reports: 'Subject report opened.',
  print: 'Sending the subject list to the printer…',
  archive: 'Selected subjects archived.',
  export_excel: 'Excel workbook queued for download.',
  export_pdf: 'PDF export queued for download.',
  export_csv: 'Preparing export…',
  page: 'Loading the selected page…',
  clear_filters: 'Filters cleared.',
  reset_columns: 'All columns restored.',
};

export const strings = {
  recentSort: 'Showing the most recently updated subjects first.',
  filterMatch: ' subject(s) match the current filters.',
  viewMatch: ' subject(s) in “',
};
