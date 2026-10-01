export type SyllabusStatus = 'Published' | 'In Progress' | 'Completed' | 'Draft' | 'Archived';

export type ColumnId = 'syllabus' | 'details' | 'progress' | 'status';

export type DensityId = 'compact' | 'default' | 'comfortable';

export type FilterKey = 'year' | 'class' | 'section' | 'subject' | 'teacher' | 'term' | 'status';

export type SortKey = 'name' | 'teacher' | 'term' | 'progress' | 'hours' | 'status' | 'recent';

export type ToolbarMenu = 'views' | 'filters' | 'columns' | 'sort' | null;

export type SyllabusModalId = 'add' | 'edit' | 'view' | 'import' | 'delete';

export interface SyllabusRow {
  /** Syllabus code, used as the row key. */
  id: string;
  name: string;
  subtitle: string;
  year: string;
  className: string;
  tone: string;
  teacher: { name: string; avatar: string };
  term: string;
  units: number;
  topics: number;
  lessons: number;
  hours: number;
  percent: number;
  topicsDone: number;
  pending: number;
  meterClass: string;
  updated: string;
  due: string;
  status: SyllabusStatus;
  pillClass: string;
  /** Completed and Draft show a dot; the rest show an icon. */
  pillIcon: string | null;
  /** The template's `data-search` haystack, verbatim. */
  search: string;
}

const PILLS: Record<SyllabusStatus, { pillClass: string; pillIcon: string | null }> = {
  Published: { pillClass: 'is-new', pillIcon: 'ti ti-send' },
  'In Progress': { pillClass: 'is-pending', pillIcon: 'ti ti-progress' },
  Completed: { pillClass: 'is-active', pillIcon: null },
  Draft: { pillClass: 'is-inactive', pillIcon: null },
  Archived: { pillClass: 'is-archived', pillIcon: 'ti ti-archive' },
};

const row = (
  id: string,
  name: string,
  subtitle: string,
  year: string,
  className: string,
  tone: string,
  teacherName: string,
  avatarNo: string,
  term: string,
  units: number,
  topics: number,
  lessons: number,
  hours: number,
  percent: number,
  topicsDone: number,
  pending: number,
  meterClass: string,
  updated: string,
  due: string,
  status: SyllabusStatus,
  search: string,
): SyllabusRow => ({
  id,
  name,
  subtitle,
  year,
  className,
  tone,
  teacher: { name: teacherName, avatar: `assets/img/teachers/teacher-${avatarNo}.jpg` },
  term,
  units,
  topics,
  lessons,
  hours,
  percent,
  topicsDone,
  pending,
  meterClass,
  updated,
  due,
  status,
  ...PILLS[status],
  search,
});

export const syllabusRows: SyllabusRow[] = [
  row('ENG-301', 'English', 'English Language & Literature', '2024/2025', 'III, A', 'primary', 'Erickson', '01', 'Term 1', 6, 42, 88, 120, 90, 38, 4, 'meter-success', '2 days ago', '15 Aug 2025', 'Published', 'english english language & literature eng-301 2024/2025 class iii sec a erickson term 1 published'),
  row('MAT-401', 'Mathematics', 'Mathematics Core', '2024/2025', 'IV, B', 'success', 'Mori', '02', 'Term 1', 8, 56, 110, 140, 61, 34, 22, 'meter-warning', '5 hours ago', '20 Sep 2025', 'In Progress', 'mathematics mathematics core mat-401 2024/2025 class iv sec b mori term 1 in progress'),
  row('PHY-501', 'Physics', 'Physics Fundamentals', '2024/2025', 'V, A', 'info', 'Joseph', '03', 'Term 2', 7, 48, 96, 130, 100, 48, 0, 'meter-success', '1 week ago', '10 Jul 2025', 'Completed', 'physics physics fundamentals phy-501 2024/2025 class v sec a joseph term 2 completed'),
  row('CHE-502', 'Chemistry', 'Chemistry Essentials', '2024/2025', 'V, B', 'warning', 'James', '04', 'Term 2', 6, 40, 84, 118, 30, 12, 28, 'meter-danger', '1 day ago', '30 Oct 2025', 'Draft', 'chemistry chemistry essentials che-502 2024/2025 class v sec b james term 2 draft'),
  row('BIO-503', 'Biology', 'Biology & Life Sciences', '2024/2025', 'V, C', 'danger', 'Teresa', '05', 'Term 1', 7, 44, 90, 125, 91, 40, 4, 'meter-success', '3 days ago', '18 Aug 2025', 'Published', 'biology biology & life sciences bio-503 2024/2025 class v sec c teresa term 1 published'),
  row('CSC-601', 'Computer Science', 'Computer Science & Coding', '2024/2025', 'VI, A', 'dark', 'Hendrita', '06', 'Term 3', 5, 30, 70, 100, 20, 6, 24, 'meter-danger', '6 hours ago', '05 Nov 2025', 'In Progress', 'computer science computer science & coding csc-601 2024/2025 class vi sec a hendrita term 3 in progress'),
  row('GEO-302', 'Geography', 'World Geography', '2023/2024', 'III, B', 'pink', 'Jacquelin', '07', 'Term 2', 6, 38, 76, 96, 100, 38, 0, 'meter-success', '2 weeks ago', '12 Jun 2025', 'Archived', 'geography world geography geo-302 2023/2024 class iii sec b jacquelin term 2 archived'),
  row('ECO-701', 'Economics', 'Introduction to Economics', '2024/2025', 'VII, A', 'teal', 'Ramsey', '08', 'Term 1', 6, 36, 72, 108, 56, 20, 16, 'meter-warning', '4 days ago', '22 Sep 2025', 'In Progress', 'economics introduction to economics eco-701 2024/2025 class vii sec a ramsey term 1 in progress'),
  row('HIS-702', 'History', 'Modern World History', '2024/2025', 'VII, B', 'purple', 'Morgan', '10', 'Term 2', 7, 46, 82, 112, 96, 44, 2, 'meter-success', '1 day ago', '14 Aug 2025', 'Published', 'history modern world history his-702 2024/2025 class vii sec b morgan term 2 published'),
  row('FIN-801', 'Finance', 'Financial Literacy', '2024/2025', 'VIII, A', 'secondary', 'Aariv', '09', 'Term 3', 5, 28, 60, 90, 14, 4, 24, 'meter-danger', '8 hours ago', '28 Nov 2025', 'Draft', 'finance financial literacy fin-801 2024/2025 class viii sec a aariv term 3 draft'),
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
  { id: 'all', label: 'All Syllabi', icon: 'ti ti-layout-list' },
  { id: 'Published', label: 'Published', icon: 'ti ti-send' },
  { id: 'In Progress', label: 'In Progress', icon: 'ti ti-progress' },
  { id: 'Completed', label: 'Completed', icon: 'ti ti-circle-check' },
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
  { key: 'year', label: 'Year', panelLabel: 'Academic Year', domId: 'syl-academic-year', options: plain(['2024/2025', '2023/2024']) },
  {
    key: 'class',
    label: 'Class',
    panelLabel: 'Class',
    domId: 'syl-class',
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
    domId: 'syl-section',
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
    domId: 'syl-subject',
    options: plain([
      'English',
      'Mathematics',
      'Physics',
      'Chemistry',
      'Biology',
      'Computer Science',
      'Geography',
      'Economics',
      'History',
      'Finance',
    ]),
  },
  {
    key: 'teacher',
    label: 'Teacher',
    panelLabel: 'Teacher',
    domId: 'syl-teacher',
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
  { key: 'term', label: 'Term', panelLabel: 'Term', domId: 'syl-term', options: plain(['Term 1', 'Term 2', 'Term 3']) },
  {
    key: 'status',
    label: 'Status',
    panelLabel: 'Status',
    domId: 'syl-status',
    options: plain(['Published', 'In Progress', 'Completed', 'Draft', 'Archived']),
  },
];

export const columnDefs: { id: ColumnId; label: string }[] = [
  { id: 'syllabus', label: 'Syllabus' },
  { id: 'details', label: 'Academic Details' },
  { id: 'progress', label: 'Progress' },
  { id: 'status', label: 'Status' },
];

export const allColumns: Record<ColumnId, boolean> = {
  syllabus: true,
  details: true,
  progress: true,
  status: true,
};

export const densityOptions: { id: DensityId; icon: string; title: string }[] = [
  { id: 'compact', icon: 'ti ti-baseline-density-small', title: 'Compact' },
  { id: 'default', icon: 'ti ti-baseline-density-medium', title: 'Default' },
  { id: 'comfortable', icon: 'ti ti-baseline-density-large', title: 'Comfortable' },
];

export const sortOptions: { id: SortKey; label: string; icon: string }[] = [
  { id: 'name', label: 'Subject (A–Z)', icon: 'ti ti-abc' },
  { id: 'teacher', label: 'Teacher', icon: 'ti ti-user' },
  { id: 'term', label: 'Term', icon: 'ti ti-calendar' },
  { id: 'progress', label: 'Progress', icon: 'ti ti-progress' },
  { id: 'hours', label: 'Estimated hours', icon: 'ti ti-clock-hour-4' },
  { id: 'recent', label: 'Recently updated', icon: 'ti ti-clock' },
];

/** Academic Details is the one non-sortable header in the template. */
export const tableHeaders: { id: ColumnId; label: string; sort: SortKey | null }[] = [
  { id: 'syllabus', label: 'Syllabus', sort: 'name' },
  { id: 'details', label: 'Academic Details', sort: null },
  { id: 'progress', label: 'Progress', sort: 'progress' },
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
  modal?: SyllabusModalId;
  danger?: boolean;
}

export const bulkActions: BulkAction[] = [
  { id: 'assign_teacher', label: 'Assign Teacher', icon: 'ti ti-user-plus' },
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
  modal?: SyllabusModalId;
  danger?: boolean;
  divider?: boolean;
}

export const rowMenuItems: RowMenuItem[] = [
  { id: 'view', label: 'View Syllabus', icon: 'ti ti-eye', modal: 'view' },
  { id: 'edit', label: 'Edit', icon: 'ti ti-edit', modal: 'edit' },
  { id: 'topics', label: 'Topics', icon: 'ti ti-list-details', route: 'classHomeWork' },
  { id: 'lessons', label: 'Lessons', icon: 'ti ti-books', route: 'classTimetable' },
  { id: 'materials', label: 'Learning Materials', icon: 'ti ti-folder' },
  { id: 'assignments', label: 'Assignments', icon: 'ti ti-clipboard-list' },
  { id: 'exams', label: 'Exams', icon: 'ti ti-file-certificate', route: 'exam' },
  { id: 'students', label: 'Students', icon: 'ti ti-users', route: 'studentList' },
  { id: 'notes', label: 'Teacher Notes', icon: 'ti ti-notes' },
  { id: 'download_pdf', label: 'Download PDF', icon: 'ti ti-file-download' },
  { id: 'print', label: 'Print', icon: 'ti ti-printer' },
  { id: 'assign_teacher', label: 'Assign Teacher', icon: 'ti ti-user-plus', divider: true },
  { id: 'duplicate', label: 'Duplicate', icon: 'ti ti-copy' },
  { id: 'publish', label: 'Publish', icon: 'ti ti-send' },
  { id: 'archive', label: 'Archive', icon: 'ti ti-archive' },
  { id: 'delete', label: 'Delete', icon: 'ti ti-trash-x', modal: 'delete', danger: true },
];

/** `tables.js` L1709–1733, verbatim. */
export const actionToasts: Record<string, string> = {
  refresh: 'Syllabus list refreshed.',
  save_view: 'Current filters saved as a new view.',
  duplicate: 'Syllabus duplicated as a draft.',
  publish: 'Selected syllabi published.',
  assign_teacher: 'Teacher assignment opened for the selected syllabi.',
  topics: 'Topics opened for this syllabus.',
  lessons: 'Lessons opened for this syllabus.',
  materials: 'Learning materials opened for this syllabus.',
  assignments: 'Assignments opened for this syllabus.',
  exams: 'Exams opened for this syllabus.',
  notes: 'Teacher notes opened for this syllabus.',
  students: 'Students opened for this syllabus.',
  download_pdf: 'Syllabus PDF queued for download.',
  print: 'Sending the syllabus to the printer…',
  archive: 'Selected syllabi archived.',
  export_excel: 'Excel workbook queued for download.',
  export_pdf: 'PDF export queued for download.',
  export_csv: 'Preparing export…',
  page: 'Loading the selected page…',
  clear_filters: 'Filters cleared.',
  reset_columns: 'All columns restored.',
};

export const strings = {
  recentSort: 'Showing the most recently updated syllabi first.',
  filterMatch: ' syllabus(es) match the current filters.',
  viewMatch: ' syllabus(es) in “',
};
