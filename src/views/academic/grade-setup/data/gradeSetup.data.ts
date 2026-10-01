import type { ToastVariant } from '@hooks/useToasts';

export type GradeStatus = 'Active' | 'Default' | 'Draft' | 'Archived';

export type ColumnId = 'grade' | 'range' | 'details' | 'status';

export type DensityId = 'compact' | 'default' | 'comfortable';

export type FilterKey = 'year' | 'scale' | 'status' | 'restype';

export type SortKey = 'name' | 'point' | 'min' | 'updated' | 'status' | 'recent';

export type ToolbarMenu = 'views' | 'filters' | 'columns' | 'sort' | null;

/**
 * The template's dialog ids were `add_grade`, `edit_grade`, `view_grade`, `grade_import`
 * and `delete-modal`; normalised to one clean union.
 */
export type GradeModalId = 'add' | 'edit' | 'view' | 'import' | 'delete';

export interface GradeRow {
  /** Slug built from the grade letter, used as the row key. */
  id: string;
  name: string;
  letter: string;
  /** Displayed with one decimal, exactly as the template printed it. */
  point: string;
  /** The same figure as a number, for sorting. */
  pointValue: number;
  scale: string;
  min: number;
  max: number;
  /** Drives the avatar tile, the letter badge and the result-type badge. */
  tone: string;
  /** The meter's own tone, which does not always track `tone`. */
  meterTone: string;
  resultType: string;
  remark: string;
  author: { name: string; avatar: string };
  updated: string;
  year: string;
  status: GradeStatus;
  pillClass: string;
  /** Default and Archived show an icon; Active and Draft show a dot. */
  pillIcon: string | null;
  linkedExams: string[];
  /** The template's `data-search` haystack, verbatim. */
  search: string;
}

export const PILLS: Record<GradeStatus, { pillClass: string; pillIcon: string | null }> = {
  Default: { pillClass: 'is-new', pillIcon: 'ti ti-star' },
  Active: { pillClass: 'is-active', pillIcon: null },
  Draft: { pillClass: 'is-inactive', pillIcon: null },
  Archived: { pillClass: 'is-archived', pillIcon: 'ti ti-archive' },
};

const row = (
  name: string,
  letter: string,
  point: string,
  scale: string,
  min: number,
  max: number,
  tone: string,
  meterTone: string,
  resultType: string,
  remark: string,
  authorName: string,
  avatarNo: string,
  updated: string,
  year: string,
  status: GradeStatus,
  linkedExams: string[],
  search: string,
): GradeRow => ({
  id: `grade-${letter.toLowerCase().replace('+', '-plus')}`,
  name,
  letter,
  point,
  pointValue: Number(point),
  scale,
  min,
  max,
  tone,
  meterTone,
  resultType,
  remark,
  author: { name: authorName, avatar: `assets/img/profiles/avatar-${avatarNo}.jpg` },
  updated,
  year,
  status,
  ...PILLS[status],
  linkedExams,
  search,
});

export const gradeRows: GradeRow[] = [
  row('Outstanding', 'A+', '10.0', '10-Point', 91, 100, 'success', 'success', 'Grade Point', 'Exceptional performance across all assessments.', 'Kevin Larry', '27', '12 May 2024', '2024/2025', 'Default', ['Midterm', 'Final'], 'outstanding grade a+ 10.0 10-point grade point kevin larry default 91-100'),
  row('Excellent', 'A', '9.0', '10-Point', 81, 90, 'success', 'success', 'Grade Point', 'Excellent grasp of concepts with minor gaps.', 'Kevin Larry', '27', '12 May 2024', '2024/2025', 'Active', ['Midterm', 'Final'], 'excellent grade a 9.0 10-point grade point kevin larry active 81-90'),
  row('Very Good', 'B+', '8.0', '10-Point', 71, 80, 'primary', 'success', 'Grade Point', 'Very good understanding of the syllabus.', 'Teressa', '23', '10 May 2024', '2024/2025', 'Active', ['Unit Test 3'], 'very good grade b+ 8.0 10-point grade point teressa active 71-80'),
  row('Good', 'B', '7.0', '10-Point', 61, 70, 'primary', 'primary', 'Grade Point', 'Good performance meeting expectations.', 'Teressa', '23', '10 May 2024', '2024/2025', 'Active', ['Unit Test 3'], 'good grade b 7.0 10-point grade point teressa active 61-70'),
  row('Above Average', 'C+', '6.0', '10-Point', 51, 60, 'info', 'primary', 'Percentage', 'Above-average work with room to improve.', 'George', '25', '08 May 2024', '2024/2025', 'Active', ['Quarterly'], 'above average grade c+ 6.0 10-point percentage george active 51-60'),
  row('Average', 'C', '5.0', '10-Point', 41, 50, 'warning', 'primary', 'Percentage', 'Satisfactory but inconsistent performance.', 'George', '25', '08 May 2024', '2024/2025', 'Active', ['Quarterly'], 'average grade c 5.0 10-point percentage george active 41-50'),
  row('Below Average', 'D', '4.0', '10-Point', 33, 40, 'warning', 'warning', 'Percentage', 'Minimum passing grade — needs support.', 'Elisa', '01', '06 May 2024', '2024/2025', 'Active', ['Practical'], 'below average grade d 4.0 10-point percentage elisa active 33-40'),
  row('Needs Improvement', 'E', '3.0', '5-Point', 21, 32, 'danger', 'danger', 'Pass / Fail', 'Below passing threshold — remedial required.', 'Elisa', '01', '03 May 2024', '2024/2025', 'Draft', ['Practical'], 'needs improvement grade e 3.0 5-point pass / fail elisa draft 21-32'),
  row('Fail', 'F', '0.0', '5-Point', 0, 20, 'danger', 'danger', 'Pass / Fail', 'Did not meet the minimum passing criteria.', 'Kevin Larry', '27', '01 May 2024', '2024/2025', 'Active', ['Practical'], 'fail grade f 0.0 5-point pass / fail kevin larry active 0-20'),
  row('Honours (Legacy)', 'H', '9.5', 'Legacy', 85, 100, 'purple', 'success', 'Grade Point', 'Legacy honours band retained for archives.', 'Kevin Larry', '27', '18 Nov 2023', '2023/2024', 'Archived', ['Annual 2023'], 'honours (legacy) grade h 9.5 legacy grade point kevin larry archived 85-100'),
];

/* -------------------------------------------------------------------------- */
/*                        Copy the template derived per row                   */
/* -------------------------------------------------------------------------- */

/** The mark band's width, which the template wrote as the row's maximum mark. */
export const meterWidth = (row: GradeRow) => `${row.max}%`;

/** "9 pts" on the row, "9 pt span" in the detail panel. */
export const markSpan = (row: GradeRow) => row.max - row.min;

export const percentLabel = (row: GradeRow) => `${row.min}%–${row.max}%`;

export const gradeDescription = (row: GradeRow) =>
  `${row.remark} Awarded for marks between ${row.min} and ${row.max} on the ${row.scale} scale.`;

export const evaluationMethod = (row: GradeRow) =>
  `${row.resultType} · ${row.scale} grading · grade point ${row.point}.`;

/** 33 marks is the template's pass mark; bands below it get the fail wording. */
export const passingCriteria = (row: GradeRow) =>
  row.min >= 33
    ? 'Meets the passing threshold (33 marks minimum).'
    : 'Below the passing threshold — treated as a fail band.';

export const statusRemarks: Record<GradeStatus, string> = {
  Default: 'Default grade band applied to new result sheets.',
  Active: 'Active grade band used in current result processing.',
  Draft: 'Draft — not yet applied to live result sheets.',
  Archived: 'Archived — retained for historical results only.',
};

export const academicNotes = (row: GradeRow) =>
  `Created by ${row.author.name} · last updated ${row.updated}. Grade point ${row.point} on the ${row.scale} scale.`;

/** The View dialog's shorter description — it drops the "on the … scale" clause. */
export const viewDescription = (row: GradeRow) =>
  `${row.remark} Awarded for marks between ${row.min} and ${row.max}.`;

export const viewSubtitle = (row: GradeRow) =>
  `Grade ${row.letter} · Grade Point ${row.point} · ${row.min}–${row.max} marks · ${row.scale} scale`;

/* -------------------------------------------------------------------------- */
/*                                  Toolbar                                   */
/* -------------------------------------------------------------------------- */

export interface SavedView {
  id: string;
  label: string;
  icon: string;
}

export const savedViews: SavedView[] = [
  { id: 'all', label: 'All Grades', icon: 'ti ti-layout-list' },
  { id: 'Active', label: 'Active', icon: 'ti ti-circle-check' },
  { id: 'Default', label: 'Default', icon: 'ti ti-star' },
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
  /** The `data-filter` attribute, which `tables.js` L208 printed as the chip's prefix. */
  label: string;
  panelLabel: string;
  domId: string;
  options: FilterOption[];
}

const plain = (values: string[]): FilterOption[] => values.map((value) => ({ value, label: value }));

export const advancedFilters: FilterField[] = [
  {
    key: 'year',
    label: 'Year',
    panelLabel: 'Academic Year',
    domId: 'gs-academic-year',
    options: plain(['2024/2025', '2023/2024']),
  },
  {
    key: 'scale',
    label: 'Scale',
    panelLabel: 'Grade Scale',
    domId: 'gs-grade-scale',
    options: plain(['10-Point', '5-Point', 'Legacy']),
  },
  {
    key: 'status',
    label: 'Status',
    panelLabel: 'Grade Status',
    domId: 'gs-grade-status',
    options: plain(['Active', 'Draft', 'Archived', 'Default']),
  },
  {
    key: 'restype',
    label: 'ResultType',
    panelLabel: 'Result Type',
    domId: 'gs-result-type',
    options: plain(['Grade Point', 'Percentage', 'Pass / Fail']),
  },
];

export const columnDefs: { id: ColumnId; label: string }[] = [
  { id: 'grade', label: 'Grade' },
  { id: 'range', label: 'Mark Range' },
  { id: 'details', label: 'Academic Details' },
  { id: 'status', label: 'Status' },
];

export const allColumns: Record<ColumnId, boolean> = {
  grade: true,
  range: true,
  details: true,
  status: true,
};

export const densityOptions: { id: DensityId; icon: string; title: string }[] = [
  { id: 'compact', icon: 'ti ti-baseline-density-small', title: 'Compact' },
  { id: 'default', icon: 'ti ti-baseline-density-medium', title: 'Default' },
  { id: 'comfortable', icon: 'ti ti-baseline-density-large', title: 'Comfortable' },
];

export const sortOptions: { id: SortKey; label: string; icon: string }[] = [
  { id: 'name', label: 'Grade Name (A–Z)', icon: 'ti ti-abc' },
  { id: 'point', label: 'Grade Point', icon: 'ti ti-star' },
  { id: 'min', label: 'Minimum Marks', icon: 'ti ti-arrow-down' },
  { id: 'updated', label: 'Last Updated', icon: 'ti ti-clock' },
  { id: 'recent', label: 'Recently updated', icon: 'ti ti-history' },
];

/** Academic Details is the one header the template left unsortable. */
export const tableHeaders: { id: ColumnId; label: string; sort: SortKey | null }[] = [
  { id: 'grade', label: 'Grade', sort: 'name' },
  { id: 'range', label: 'Mark Range', sort: 'min' },
  { id: 'details', label: 'Academic Details', sort: null },
  { id: 'status', label: 'Status', sort: 'status' },
];

export const pageSizes = ['10', '25', '50'];

/* -------------------------------------------------------------------------- */
/*                          Header, bulk bar and menus                        */
/* -------------------------------------------------------------------------- */

export const exportActions: { id: string; label: string; icon: string }[] = [
  { id: 'export_pdf', label: 'Export as PDF', icon: 'ti ti-file-type-pdf' },
  { id: 'export_excel', label: 'Export as Excel', icon: 'ti ti-file-type-xls' },
  { id: 'export_csv', label: 'Export as CSV', icon: 'ti ti-file-type-csv' },
];

/** `tables.js` L868–874 — one CSV column per grid column, in the same order. */
export const exportColumns: { label: string; value: (row: GradeRow) => string }[] = [
  { label: 'Grade', value: (row) => row.name },
  { label: 'Letter', value: (row) => row.letter },
  { label: 'Point', value: (row) => row.point },
  { label: 'Min Marks', value: (row) => String(row.min) },
  { label: 'Max Marks', value: (row) => String(row.max) },
  { label: 'Result Type', value: (row) => row.resultType },
  { label: 'Last Updated', value: (row) => row.updated },
  { label: 'Created By', value: (row) => row.author.name },
  { label: 'Status', value: (row) => row.status },
];

export interface BulkAction {
  id: string;
  label: string;
  icon: string;
  modal?: GradeModalId;
  danger?: boolean;
}

export const bulkActions: BulkAction[] = [
  { id: 'set_default', label: 'Set as Default', icon: 'ti ti-star' },
  { id: 'export_csv', label: 'Export Selected', icon: 'ti ti-file-export' },
  { id: 'print', label: 'Print', icon: 'ti ti-printer' },
  { id: 'archive', label: 'Archive', icon: 'ti ti-archive' },
  { id: 'delete', label: 'Delete', icon: 'ti ti-trash', modal: 'delete', danger: true },
];

export interface RowMenuItem {
  id: string;
  label: string;
  icon: string;
  route?: string;
  modal?: GradeModalId;
  danger?: boolean;
  divider?: boolean;
}

export const rowMenuItems: RowMenuItem[] = [
  { id: 'view', label: 'View Grade', icon: 'ti ti-eye', modal: 'view' },
  { id: 'edit', label: 'Edit', icon: 'ti ti-edit', modal: 'edit' },
  { id: 'preview', label: 'Preview Grade Scale', icon: 'ti ti-eye-search' },
  { id: 'result_settings', label: 'Result Settings', icon: 'ti ti-settings' },
  { id: 'reports', label: 'Reports', icon: 'ti ti-report-analytics', route: 'examResult' },
  { id: 'print', label: 'Print', icon: 'ti ti-printer' },
  { id: 'duplicate', label: 'Duplicate Grade', icon: 'ti ti-copy', divider: true },
  { id: 'set_default', label: 'Set as Default', icon: 'ti ti-star' },
  { id: 'export_csv', label: 'Export', icon: 'ti ti-file-export' },
  { id: 'archive', label: 'Archive', icon: 'ti ti-archive' },
  { id: 'delete', label: 'Delete', icon: 'ti ti-trash-x', modal: 'delete', danger: true },
];

export interface ActionToast {
  message: string;
  variant: ToastVariant;
}

/**
 * `tables.js` L875–889 verbatim, plus the three the engine hard-codes for every page:
 * `export_csv` (L426), `reset_columns` (L453) and `clear_filters` (L465).
 */
export const actionToasts: Record<string, ActionToast> = {
  refresh: { message: 'Grade list refreshed.', variant: 'success' },
  save_view: { message: 'Current filters saved as a new view.', variant: 'success' },
  duplicate: { message: 'Grade duplicated as a draft.', variant: 'success' },
  set_default: { message: 'Grade set as the default scale.', variant: 'success' },
  view: { message: 'Grade details opened.', variant: 'info' },
  preview: { message: 'Grade scale preview opened.', variant: 'info' },
  result_settings: { message: 'Result settings opened for this grade.', variant: 'info' },
  reports: { message: 'Grade report opened.', variant: 'info' },
  print: { message: 'Sending the grade list to the printer…', variant: 'info' },
  archive: { message: 'Selected grades archived.', variant: 'success' },
  export_excel: { message: 'Excel workbook queued for download.', variant: 'info' },
  export_pdf: { message: 'PDF export queued for download.', variant: 'info' },
  export_csv: { message: 'Preparing export…', variant: 'info' },
  page: { message: 'Loading the selected page…', variant: 'info' },
  clear_filters: { message: 'Filters cleared.', variant: 'success' },
  reset_columns: { message: 'All columns restored.', variant: 'success' },
};

/**
 * `tables.js` L891. The template reused the exams page's wording here — "exams" rather
 * than "grades" — and that copy is kept verbatim.
 */
export const strings = {
  recentSort: 'Showing the most recently updated exams first.',
  filterMatch: ' exams match the current filters.',
  viewMatch: ' exams in “',
  csvFile: 'grade.csv',
  applyMatch: ' exams match the current filters.',
};

export const importSuccess = 'File queued — 10 grades validated.';
