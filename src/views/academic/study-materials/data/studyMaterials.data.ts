export type MaterialStatus = 'Published' | 'Draft' | 'Archived';

export type ColumnId = 'material' | 'details' | 'stats' | 'status';

export type DensityId = 'compact' | 'default' | 'comfortable';

export type FilterKey =
  | 'year'
  | 'class'
  | 'section'
  | 'subject'
  | 'type'
  | 'teacher'
  | 'status'
  | 'date';

export type SortKey = 'name' | 'subject' | 'teacher' | 'date' | 'downloads' | 'status' | 'recent';

export type ToolbarMenu = 'views' | 'filters' | 'columns' | 'sort' | null;

export type MaterialModalId = 'add' | 'edit' | 'view' | 'import' | 'delete';

export interface MaterialRow {
  /** Material code, used as the row key. */
  id: string;
  title: string;
  subject: string;
  /** PDF / PPT / DOC / Video / Link / Audio. */
  type: string;
  typeBadge: string;
  typeIcon: string;
  /** `text-*` on the row's file-type tile. */
  tone: string;
  year: string;
  className: string;
  chapter: string;
  teacher: { name: string; avatar: string };
  date: string;
  downloads: number;
  size: string;
  status: MaterialStatus;
  pillClass: string;
  pillIcon: string;
  /** The template's `data-search` haystack, verbatim. */
  search: string;
}

const PILLS: Record<MaterialStatus, { pillClass: string; pillIcon: string }> = {
  Published: { pillClass: 'is-active', pillIcon: 'ti ti-circle-check' },
  Draft: { pillClass: 'is-pending', pillIcon: 'ti ti-pencil' },
  Archived: { pillClass: 'is-archived', pillIcon: 'ti ti-archive' },
};

const row = (
  id: string,
  title: string,
  subject: string,
  type: string,
  typeBadge: string,
  typeIcon: string,
  tone: string,
  year: string,
  className: string,
  chapter: string,
  teacherName: string,
  avatarNo: string,
  date: string,
  downloads: number,
  size: string,
  status: MaterialStatus,
  search: string,
): MaterialRow => ({
  id,
  title,
  subject,
  type,
  typeBadge,
  typeIcon: `ti ti-${typeIcon}`,
  tone,
  year,
  className,
  chapter,
  teacher: { name: teacherName, avatar: `assets/img/teachers/teacher-${avatarNo}.jpg` },
  date,
  downloads,
  size,
  status,
  ...PILLS[status],
  search,
});

export const materialRows: MaterialRow[] = [
  row('SM240501', 'Algebra Fundamentals — Linear Equations', 'Mathematics', 'PDF', 'badge-soft-danger', 'file-type-pdf', 'danger', '2024/2025', 'X-A', 'Chapter 3 · Linear Equations in Two Variables', 'Erickson', '01', '03 May 2024', 186, '2.4 MB', 'Published', 'algebra fundamentals - linear equations sm240501 mathematics 2024/2025 class x sec a erickson published pdf 03 may 2024'),
  row('SM240502', 'Newton’s Laws of Motion — Explained', 'Physics', 'PPT', 'badge-soft-warning', 'file-type-ppt', 'warning', '2024/2025', 'XI-B', 'Unit 2 · Laws of Motion', 'James', '04', '10 May 2024', 224, '6.8 MB', 'Published', "newton's laws of motion - explained sm240502 physics 2024/2025 class xi sec b james published ppt 10 may 2024"),
  row('SM240503', 'Grammar & Composition Workbook', 'English', 'DOC', 'badge-soft-primary', 'file-type-doc', 'primary', '2024/2025', 'VI-A', 'Unit 5 · Tenses & Sentence Structure', 'Teresa', '05', '14 Jun 2024', 42, '860 KB', 'Draft', 'grammar & composition workbook sm240503 english 2024/2025 class vi sec a teresa draft doc 14 jun 2024'),
  row('SM240504', 'Periodic Table Explained — Trends & Groups', 'Chemistry', 'Video', 'badge-soft-info', 'video', 'info', '2024/2025', 'IX-C', 'Chapter 4 · Periodic Classification', 'Hendrita', '06', '21 Jun 2024', 301, '18 min · 142 MB', 'Published', 'periodic table explained - trends & groups sm240504 chemistry 2024/2025 class ix sec c hendrita published video 21 jun 2024'),
  row('SM240505', 'Human Digestive System — Structure & Function', 'Biology', 'PPT', 'badge-soft-warning', 'file-type-ppt', 'warning', '2023/2024', 'VIII-B', 'Chapter 6 · Life Processes', 'Joseph', '03', '08 Feb 2024', 57, '5.1 MB', 'Archived', 'human digestive system - structure & function sm240505 biology 2023/2024 class viii sec b joseph archived ppt 08 feb 2024'),
  row('SM240506', 'Introduction to Python Programming', 'Computer Science', 'PDF', 'badge-soft-danger', 'file-type-pdf', 'danger', '2024/2025', 'XII-A', 'Module 1 · Python Basics', 'Mori', '02', '02 Jul 2024', 412, '3.1 MB', 'Published', 'introduction to python programming sm240506 computer science 2024/2025 class xii sec a mori published pdf 02 jul 2024'),
  row('SM240507', 'World Map & Continents — Interactive Atlas', 'Geography', 'Link', 'badge-soft-success', 'link', 'success', '2024/2025', 'VII-A', 'Chapter 2 · Continents & Oceans', 'Ramsey', '08', '11 Jul 2024', 19, 'External resource', 'Draft', 'world map & continents - interactive atlas sm240507 geography 2024/2025 class vii sec a ramsey draft link 11 jul 2024'),
  row('SM240508', 'World War II — A Visual Timeline', 'History', 'DOC', 'badge-soft-primary', 'file-type-doc', 'primary', '2024/2025', 'X-B', 'Chapter 9 · The World at War', 'Morgan', '10', '19 Jul 2024', 133, '1.2 MB', 'Published', 'world war ii - a visual timeline sm240508 history 2024/2025 class x sec b morgan published doc 19 jul 2024'),
  row('SM240509', 'Trigonometry Formula Sheet', 'Mathematics', 'PDF', 'badge-soft-danger', 'file-type-pdf', 'danger', '2023/2024', 'XI-A', 'Chapter 8 · Trigonometric Identities', 'Aariv', '09', '26 Mar 2024', 268, '640 KB', 'Archived', 'trigonometry formula sheet sm240509 mathematics 2023/2024 class xi sec a aariv archived pdf 26 mar 2024'),
  row('SM240510', 'Listening Practice — Idioms & Phrases', 'English', 'Audio', 'badge-soft-purple', 'headphones', 'purple', '2024/2025', 'V-C', 'Unit 7 · Everyday Expressions', 'Jacquelin', '07', '05 Aug 2024', 34, '12 min · 9.6 MB', 'Draft', 'listening practice - idioms & phrases sm240510 english 2024/2025 class v sec c jacquelin draft audio 05 aug 2024'),
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
  { id: 'all', label: 'All Materials', icon: 'ti ti-layout-list' },
  { id: 'Published', label: 'Published', icon: 'ti ti-circle-check' },
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
  { key: 'year', label: 'Year', panelLabel: 'Academic Year', domId: 'sm-academic-year', options: plain(['2024/2025', '2023/2024']) },
  {
    key: 'class',
    label: 'Class',
    panelLabel: 'Class',
    domId: 'sm-class',
    options: [
      { value: 'class v', label: 'V' },
      { value: 'class vi', label: 'VI' },
      { value: 'class vii', label: 'VII' },
      { value: 'class viii', label: 'VIII' },
      { value: 'class ix', label: 'IX' },
      { value: 'class x', label: 'X' },
      { value: 'class xi', label: 'XI' },
      { value: 'class xii', label: 'XII' },
    ],
  },
  {
    key: 'section',
    label: 'Section',
    panelLabel: 'Section',
    domId: 'sm-section',
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
    domId: 'sm-subject',
    options: plain([
      'Mathematics',
      'Physics',
      'English',
      'Chemistry',
      'Biology',
      'Computer Science',
      'Geography',
      'History',
    ]),
  },
  {
    key: 'type',
    label: 'Type',
    panelLabel: 'Material Type',
    domId: 'sm-type',
    options: plain(['PDF', 'PPT', 'DOC', 'Video', 'Link', 'Audio']),
  },
  {
    key: 'teacher',
    label: 'Uploaded By',
    panelLabel: 'Uploaded By',
    domId: 'sm-teacher',
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
    panelLabel: 'Status',
    domId: 'sm-status',
    options: plain(['Published', 'Draft', 'Archived']),
  },
  {
    key: 'date',
    label: 'Date',
    panelLabel: 'Upload Date',
    domId: 'upload-date',
    options: [
      { value: 'feb 2024', label: 'February 2024' },
      { value: 'mar 2024', label: 'March 2024' },
      { value: 'may 2024', label: 'May 2024' },
      { value: 'jun 2024', label: 'June 2024' },
      { value: 'jul 2024', label: 'July 2024' },
      { value: 'aug 2024', label: 'August 2024' },
      { value: '2024', label: '2024' },
    ],
  },
];

export const columnDefs: { id: ColumnId; label: string }[] = [
  { id: 'material', label: 'Material' },
  { id: 'details', label: 'Academic Details' },
  { id: 'stats', label: 'Engagement' },
  { id: 'status', label: 'Status' },
];

export const allColumns: Record<ColumnId, boolean> = {
  material: true,
  details: true,
  stats: true,
  status: true,
};

export const densityOptions: { id: DensityId; icon: string; title: string }[] = [
  { id: 'compact', icon: 'ti ti-baseline-density-small', title: 'Compact' },
  { id: 'default', icon: 'ti ti-baseline-density-medium', title: 'Default' },
  { id: 'comfortable', icon: 'ti ti-baseline-density-large', title: 'Comfortable' },
];

export const sortOptions: { id: SortKey; label: string; icon: string }[] = [
  { id: 'name', label: 'Title (A–Z)', icon: 'ti ti-abc' },
  { id: 'subject', label: 'Subject', icon: 'ti ti-book' },
  { id: 'teacher', label: 'Uploaded by', icon: 'ti ti-user' },
  { id: 'date', label: 'Upload date', icon: 'ti ti-calendar-event' },
  { id: 'downloads', label: 'Downloads', icon: 'ti ti-download' },
  { id: 'recent', label: 'Recently uploaded', icon: 'ti ti-clock' },
];

/** All four headers carry `dt-sortable` in the template (L1631–1634). */
export const tableHeaders: { id: ColumnId; label: string; sort: SortKey | null }[] = [
  { id: 'material', label: 'Material', sort: 'name' },
  { id: 'details', label: 'Academic Details', sort: 'date' },
  { id: 'stats', label: 'Engagement', sort: 'downloads' },
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
  modal?: MaterialModalId;
  danger?: boolean;
}

export const bulkActions: BulkAction[] = [
  { id: 'assign_class', label: 'Assign to Class', icon: 'ti ti-users-plus' },
  { id: 'publish', label: 'Publish', icon: 'ti ti-send' },
  { id: 'download', label: 'Download', icon: 'ti ti-download' },
  { id: 'print', label: 'Print', icon: 'ti ti-printer' },
  { id: 'archive', label: 'Archive', icon: 'ti ti-archive' },
  { id: 'delete', label: 'Delete', icon: 'ti ti-trash', modal: 'delete', danger: true },
];

export interface RowMenuItem {
  id: string;
  label: string;
  icon: string;
  route?: string;
  modal?: MaterialModalId;
  danger?: boolean;
  divider?: boolean;
}

export const rowMenuItems: RowMenuItem[] = [
  { id: 'view', label: 'View Material', icon: 'ti ti-eye', modal: 'view' },
  { id: 'edit', label: 'Edit', icon: 'ti ti-edit', modal: 'edit' },
  { id: 'download', label: 'Download', icon: 'ti ti-download' },
  { id: 'share', label: 'Share', icon: 'ti ti-share-2' },
  { id: 'assign_class', label: 'Assign to Class', icon: 'ti ti-users-plus' },
  { id: 'duplicate', label: 'Duplicate', icon: 'ti ti-copy' },
  { id: 'publish', label: 'Publish/Unpublish', icon: 'ti ti-send' },
  { id: 'archive', label: 'Archive', icon: 'ti ti-archive' },
  { id: 'print', label: 'Print', icon: 'ti ti-printer' },
  { id: 'delete', label: 'Delete', icon: 'ti ti-trash-x', modal: 'delete', danger: true, divider: true },
];

/** `tables.js` L677–697, verbatim. */
export const actionToasts: Record<string, string> = {
  refresh: 'Study material list refreshed.',
  save_view: 'Current filters saved as a new view.',
  download: 'Material queued for download.',
  share: 'Share link copied for this material.',
  assign_class: 'Class assignment opened for this material.',
  duplicate: 'Material duplicated as a draft.',
  publish: 'Selected material visibility updated.',
  archive: 'Selected materials archived.',
  print: 'Sending the study material list to the printer…',
  export_excel: 'Excel workbook queued for download.',
  export_pdf: 'PDF export queued for download.',
  export_csv: 'Preparing export…',
  page: 'Loading the selected page…',
  clear_filters: 'Filters cleared.',
  reset_columns: 'All columns restored.',
};

export const strings = {
  recentSort: 'Showing the most recently uploaded materials first.',
  filterMatch: ' material(s) match the current filters.',
  viewMatch: ' material(s) in “',
};
