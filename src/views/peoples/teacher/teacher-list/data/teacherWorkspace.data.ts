/** The three dialogs that follow the page wrapper in `teacher-list.html`. */
export type TeacherModalId = 'login' | 'delete' | 'import';

export interface SavedView {
  id: string;
  label: string;
  icon: string;
}

export const savedViews: SavedView[] = [
  { id: 'all', label: 'All Teachers', icon: 'ti ti-layout-list' },
  { id: 'Active', label: 'Active', icon: 'ti ti-circle-check' },
  { id: 'Inactive', label: 'Inactive', icon: 'ti ti-circle-x' },
];

export interface QuickFilter {
  id: string;
  label: string;
  icon: string;
}

export const quickFilters: QuickFilter[] = [
  { id: 'Active', label: 'Active', icon: 'ti ti-user-check' },
  { id: 'Inactive', label: 'Inactive', icon: 'ti ti-user-off' },
];

/** Fields in the advanced filter panel — `data-filter` value is the id. */
export interface AdvancedFilter {
  id: string;
  /** `data-filter` attribute value, and the chip's label. */
  facet: string;
  label: string;
  options: string[];
}

export const advancedFilters: AdvancedFilter[] = [
  {
    id: 'class',
    facet: 'Class',
    label: 'Class',
    options: ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'],
  },
  {
    id: 'subject',
    facet: 'Subject',
    label: 'Subject',
    options: [
      'Physics',
      'Maths',
      'Chemistry',
      'English',
      'Biology',
      'Computer',
      'Economics',
      'Finance',
    ],
  },
  { id: 'status', facet: 'Status', label: 'Status', options: ['Active', 'Inactive'] },
  {
    id: 'academic-year',
    facet: 'Year',
    label: 'Academic Year',
    options: ['2024/2025', '2023/2024'],
  },
];

/** Every `data-cls-sort` value used by the headers and the sort menu. */
export type SortKey = 'name' | 'status' | 'class' | 'subject' | 'join' | 'recent';

export const sortOptions: { id: SortKey; label: string; icon: string }[] = [
  { id: 'name', label: 'Teacher name (A–Z)', icon: 'ti ti-abc' },
  { id: 'subject', label: 'Subject', icon: 'ti ti-book' },
  { id: 'recent', label: 'Recently updated', icon: 'ti ti-clock' },
];

/** Toggleable columns — the `data-cls-col` value is the id. */
export type ColumnKey = 'teacher' | 'status' | 'class' | 'subject' | 'email' | 'phone' | 'join';

export const columnOptions: { id: ColumnKey; label: string }[] = [
  { id: 'teacher', label: 'Teacher' },
  { id: 'status', label: 'Status' },
  { id: 'class', label: 'Class' },
  { id: 'subject', label: 'Subject' },
  { id: 'email', label: 'Email' },
  { id: 'phone', label: 'Phone' },
  { id: 'join', label: 'Date of Join' },
];

export const allColumnsVisible: Record<ColumnKey, boolean> = {
  teacher: true,
  status: true,
  class: true,
  subject: true,
  email: true,
  phone: true,
  join: true,
};

export type Density = 'compact' | 'default' | 'comfortable';

export const densityOptions: { id: Density; label: string; icon: string; aria: string }[] = [
  { id: 'compact', label: 'Compact', icon: 'ti ti-baseline-density-small', aria: 'Compact rows' },
  { id: 'default', label: 'Default', icon: 'ti ti-baseline-density-medium', aria: 'Default rows' },
  {
    id: 'comfortable',
    label: 'Comfortable',
    icon: 'ti ti-baseline-density-large',
    aria: 'Comfortable rows',
  },
];

/**
 * CSV column order, matching the `cols` map `assets/js/tables.js` registers for
 * `teacher-list.html`.
 */
export const csvColumns = [
  'Teacher',
  'ID',
  'Status',
  'Class',
  'Subject',
  'Email',
  'Phone',
  'Date of Join',
];

/**
 * Toast copy, lifted from the `teacher-list.html` entry in
 * `assets/js/tables.js` so the wording matches the template exactly.
 */
export const actionToasts: Record<string, [string, 'success' | 'info']> = {
  refresh: ['Teacher list refreshed.', 'success'],
  save_view: ['Current filters saved as a new view.', 'success'],
  message: ['Message composer opened for the selected teachers.', 'info'],
  email: ['Email composer opened for the selected teachers.', 'info'],
  assign_class: ['Class assignment opened for the selected teachers.', 'info'],
  timetable: ['Timetable opened for the selected teachers.', 'info'],
  print: ['Sending the teacher list to the printer…', 'info'],
  export_excel: ['Excel workbook queued for download.', 'info'],
  export_pdf: ['PDF export queued for download.', 'info'],
  page: ['Loading the selected page…', 'info'],
};

/** The eight `.summary-card` tiles of the summary strip. */
export interface SummaryCard {
  /** `data-sum` attribute. */
  id: string;
  accent: string;
  icon: string;
  label: string;
  /** Fixed value where the roster cannot supply one. */
  value?: string;
  /** `.summary-card-spark` bar heights, on the "Avg Rating" tile only. */
  spark?: string[];
}

export const summaryCards: SummaryCard[] = [
  { id: 'total', accent: 'accent-primary', icon: 'ti ti-users', label: 'Total Teachers', value: '248' },
  { id: 'selected', accent: 'accent-purple', icon: 'ti ti-checkbox', label: 'Selected' },
  { id: 'active', accent: 'accent-success', icon: 'ti ti-user-check', label: 'Active' },
  { id: 'inactive', accent: 'accent-slate', icon: 'ti ti-user-off', label: 'Inactive' },
  { id: 'new', accent: 'accent-warning', icon: 'ti ti-user-plus', label: 'New This Year', value: '32' },
  { id: 'graduated', accent: 'accent-info', icon: 'ti ti-book', label: 'Subjects' },
  { id: 'filtered', accent: 'accent-teal', icon: 'ti ti-filter', label: 'Filtered Results' },
  {
    id: 'stats',
    accent: 'accent-danger',
    icon: 'ti ti-star',
    label: 'Avg Rating',
    value: '4.6',
    spark: ['40%', '65%', '50%', '80%', '70%', '95%'],
  },
];

/** Rows-per-page choices in the footer. */
export const pageSizes = [10, 25, 50, 100];
