export type SectionStatus = 'Active' | 'Full' | 'Inactive' | 'Archived';

export type ColumnId = 'section' | 'class' | 'students' | 'status';

export type DensityId = 'compact' | 'default' | 'comfortable';

export type FilterKey = 'year' | 'class' | 'section' | 'teacher' | 'shift' | 'status';

export type SortKey = 'name' | 'teacher' | 'students' | 'capacity' | 'status' | 'recent';

export type ToolbarMenu = 'views' | 'filters' | 'columns' | 'sort' | null;

export type SectionModalId = 'add' | 'edit' | 'view' | 'import' | 'delete';

export interface SectionRow {
  /** Section code, used as the row key. */
  id: string;
  name: string;
  className: string;
  year: string;
  teacher: { name: string; avatar: string };
  roomNo: string;
  floor: string;
  shift: string;
  medium: string;
  students: number;
  capacity: number;
  seatsLeft: number;
  /** `text-success` on all but the full sections, which the template paints danger. */
  seatsClass: string;
  meterClass: string;
  meterWidth: string;
  boys: number;
  girls: number;
  status: SectionStatus;
  pillClass: string;
  /** Active and Inactive show a dot; Full and Archived show an icon. */
  pillIcon: string | null;
  note: string;
  /** The template's `data-search` haystack, verbatim. */
  search: string;
}

const row = (
  id: string,
  name: string,
  className: string,
  year: string,
  teacherName: string,
  avatarNo: string,
  roomNo: string,
  floor: string,
  shift: string,
  medium: string,
  students: number,
  seatsClass: string,
  meterClass: string,
  meterWidth: string,
  boys: number,
  girls: number,
  status: SectionStatus,
  pillClass: string,
  pillIcon: string | null,
  note: string,
  search: string,
): SectionRow => ({
  id,
  name,
  className,
  year,
  teacher: { name: teacherName, avatar: `assets/img/teachers/teacher-${avatarNo}.jpg` },
  roomNo,
  floor,
  shift,
  medium,
  students,
  capacity: 45,
  seatsLeft: 45 - students,
  seatsClass,
  meterClass,
  meterWidth,
  boys,
  girls,
  status,
  pillClass,
  pillIcon,
  note,
  search,
});

const RUNNING = 'Running smoothly this term.';
const FULL_NOTE = 'Section at full capacity — no new admissions.';

export const sectionRows: SectionRow[] = [
  row('SE167645', 'Section A', 'III', '2024/2025', 'Teresa', '01', '101', '1', 'Morning', 'English', 42, 'text-success', 'meter-warning', '93%', 24, 18, 'Active', 'is-active', null, RUNNING, 'section a se167645 class iii 2024/2025 teresa room 101 floor 1 morning english active'),
  row('SE167644', 'Section B', 'III', '2024/2025', 'Daniel', '02', '102', '1', 'Morning', 'English', 40, 'text-success', 'meter-warning', '89%', 22, 18, 'Active', 'is-active', null, RUNNING, 'section b se167644 class iii 2024/2025 daniel room 102 floor 1 morning english active'),
  row('SE167643', 'Section A', 'IV', '2024/2025', 'Hellana', '03', '103', '2', 'Morning', 'English', 45, 'text-danger', 'meter-danger', '100%', 25, 20, 'Full', 'is-pending', 'ti ti-users-group', FULL_NOTE, 'section a se167643 class iv 2024/2025 hellana room 103 floor 2 morning english full'),
  row('SE167642', 'Section B', 'IV', '2024/2025', 'Morgan', '10', '104', '2', 'Afternoon', 'Hindi', 38, 'text-success', 'meter-success', '84%', 20, 18, 'Active', 'is-active', null, RUNNING, 'section b se167642 class iv 2024/2025 morgan room 104 floor 2 afternoon hindi active'),
  row('SE167641', 'Section A', 'V', '2024/2025', 'Erickson', '04', '105', '1', 'Morning', 'English', 44, 'text-success', 'meter-warning', '98%', 23, 21, 'Active', 'is-active', null, RUNNING, 'section a se167641 class v 2024/2025 erickson room 105 floor 1 morning english active'),
  row('SE167640', 'Section B', 'V', '2024/2025', 'Mori', '05', '106', '3', 'Afternoon', 'English', 30, 'text-success', 'meter-success', '67%', 16, 14, 'Inactive', 'is-inactive', null, 'Section temporarily inactive.', 'section b se167640 class v 2024/2025 mori room 106 floor 3 afternoon english inactive'),
  row('SE167639', 'Section A', 'VI', '2024/2025', 'Joseph', '06', '107', '2', 'Morning', 'English', 45, 'text-danger', 'meter-danger', '100%', 24, 21, 'Full', 'is-pending', 'ti ti-users-group', FULL_NOTE, 'section a se167639 class vi 2024/2025 joseph room 107 floor 2 morning english full'),
  row('SE167638', 'Section B', 'VI', '2024/2025', 'James', '07', '108', '2', 'Morning', 'Hindi', 41, 'text-success', 'meter-warning', '91%', 22, 19, 'Active', 'is-active', null, RUNNING, 'section b se167638 class vi 2024/2025 james room 108 floor 2 morning hindi active'),
  row('SE167637', 'Section A', 'VII', '2023/2024', 'Ramsey', '08', '109', '3', 'Afternoon', 'English', 36, 'text-success', 'meter-success', '80%', 19, 17, 'Archived', 'is-archived', 'ti ti-archive', 'Archived from a previous session.', 'section a se167637 class vii 2023/2024 ramsey room 109 floor 3 afternoon english archived'),
  row('SE167636', 'Section B', 'VII', '2024/2025', 'Jacquelin', '09', '110', '3', 'Morning', 'English', 43, 'text-success', 'meter-warning', '96%', 23, 20, 'Active', 'is-active', null, RUNNING, 'section b se167636 class vii 2024/2025 jacquelin room 110 floor 3 morning english active'),
];

/**
 * The detail panel's Subject List, timetable line and activity list are identical on all
 * ten rows in the template, so they are constants rather than per-row fields.
 */
export const subjectBadges: { label: string; badgeClass: string }[] = [
  { label: 'English', badgeClass: 'badge-soft-primary' },
  { label: 'Maths', badgeClass: 'badge-soft-success' },
  { label: 'Science', badgeClass: 'badge-soft-info' },
  { label: 'Social', badgeClass: 'badge-soft-warning' },
];

export const subjectOverflow = '+3';

export const weeklyTimetable = 'Mon–Fri · 6 periods/day';

export const upcomingActivities = ['Unit test — 28 Jul', 'PTM — 02 Aug'];

/** Hard-coded beside the teacher in the template's Section Details dialog. */
export const teacherQualification = 'M.Sc, B.Ed · 8 yrs';

/* -------------------------------------------------------------------------- */
/*                                  Toolbar                                   */
/* -------------------------------------------------------------------------- */

export interface SavedView {
  id: string;
  label: string;
  icon: string;
}

export const savedViews: SavedView[] = [
  { id: 'all', label: 'All Sections', icon: 'ti ti-layout-list' },
  { id: 'Active', label: 'Active', icon: 'ti ti-circle-check' },
  { id: 'Full', label: 'Full', icon: 'ti ti-users-group' },
  { id: 'Inactive', label: 'Inactive', icon: 'ti ti-circle-x' },
  { id: 'Archived', label: 'Archived', icon: 'ti ti-archive' },
];

export const quickFilters: SavedView[] = savedViews.slice(1);

export interface FilterOption {
  value: string;
  label: string;
}

export interface FilterField {
  key: FilterKey;
  /** Chip prefix — the template's `data-filter` value. */
  label: string;
  /** The filter panel's own label. Note the Shift facet is labelled "Capacity" in the
   *  template even though its options are Morning/Afternoon; kept as written. */
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
    domId: 'sec-academic-year',
    options: plain(['2024/2025', '2023/2024']),
  },
  {
    key: 'class',
    label: 'Class',
    panelLabel: 'Class',
    domId: 'sec-class',
    options: [
      { value: 'class iii', label: 'III' },
      { value: 'class iv', label: 'IV' },
      { value: 'class v', label: 'V' },
      { value: 'class vi', label: 'VI' },
      { value: 'class vii', label: 'VII' },
    ],
  },
  {
    key: 'section',
    label: 'Section',
    panelLabel: 'Section',
    domId: 'sec-section',
    options: plain(['Section A', 'Section B']),
  },
  {
    key: 'teacher',
    label: 'Teacher',
    panelLabel: 'Class Teacher',
    domId: 'sec-class-teacher',
    options: plain([
      'Teresa',
      'Daniel',
      'Hellana',
      'Morgan',
      'Erickson',
      'Mori',
      'Joseph',
      'James',
      'Ramsey',
      'Jacquelin',
    ]),
  },
  {
    key: 'shift',
    label: 'Shift',
    panelLabel: 'Capacity',
    domId: 'sec-capacity',
    options: plain(['Morning', 'Afternoon']),
  },
  {
    key: 'status',
    label: 'Status',
    panelLabel: 'Status',
    domId: 'sec-status',
    options: plain(['Active', 'Inactive', 'Full', 'Archived']),
  },
];

export const columnDefs: { id: ColumnId; label: string }[] = [
  { id: 'section', label: 'Section' },
  { id: 'class', label: 'Class Details' },
  { id: 'students', label: 'Student Details' },
  { id: 'status', label: 'Status' },
];

export const allColumns: Record<ColumnId, boolean> = {
  section: true,
  class: true,
  students: true,
  status: true,
};

export const densityOptions: { id: DensityId; icon: string; title: string }[] = [
  { id: 'compact', icon: 'ti ti-baseline-density-small', title: 'Compact' },
  { id: 'default', icon: 'ti ti-baseline-density-medium', title: 'Default' },
  { id: 'comfortable', icon: 'ti ti-baseline-density-large', title: 'Comfortable' },
];

export const sortOptions: { id: SortKey; label: string; icon: string }[] = [
  { id: 'name', label: 'Section (A–Z)', icon: 'ti ti-abc' },
  { id: 'teacher', label: 'Class Teacher', icon: 'ti ti-user' },
  { id: 'students', label: 'Total Students', icon: 'ti ti-users' },
  { id: 'capacity', label: 'Capacity', icon: 'ti ti-layout-grid' },
  { id: 'recent', label: 'Recently created', icon: 'ti ti-clock' },
];

/** Class Details is the one non-sortable header in the template. */
export const tableHeaders: { id: ColumnId; label: string; sort: SortKey | null }[] = [
  { id: 'section', label: 'Section', sort: 'name' },
  { id: 'class', label: 'Class Details', sort: null },
  { id: 'students', label: 'Student Details', sort: 'students' },
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
  modal?: SectionModalId;
  danger?: boolean;
}

export const bulkActions: BulkAction[] = [
  { id: 'assign_teacher', label: 'Assign Teacher', icon: 'ti ti-user-plus' },
  { id: 'assign_room', label: 'Assign Classroom', icon: 'ti ti-door' },
  { id: 'update_capacity', label: 'Update Capacity', icon: 'ti ti-adjustments' },
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
  modal?: SectionModalId;
  danger?: boolean;
  divider?: boolean;
}

export const rowMenuItems: RowMenuItem[] = [
  { id: 'view', label: 'View Section', icon: 'ti ti-eye', modal: 'view' },
  { id: 'edit', label: 'Edit', icon: 'ti ti-edit', modal: 'edit' },
  { id: 'students', label: 'Students', icon: 'ti ti-users', route: 'studentList' },
  { id: 'class_teacher', label: 'Class Teacher', icon: 'ti ti-user', route: 'teacherDetails' },
  { id: 'attendance', label: 'Attendance', icon: 'ti ti-calendar-check', route: 'studentAttendance' },
  { id: 'timetable', label: 'Timetable', icon: 'ti ti-table', route: 'classTimetable' },
  { id: 'syllabus', label: 'Syllabus', icon: 'ti ti-book-2', route: 'classSyllabus' },
  { id: 'assignments', label: 'Assignments', icon: 'ti ti-clipboard-list' },
  { id: 'exams', label: 'Exams', icon: 'ti ti-file-certificate', route: 'exam' },
  { id: 'announcements', label: 'Announcements', icon: 'ti ti-speakerphone', route: 'noticeBoard' },
  { id: 'reports', label: 'Reports', icon: 'ti ti-chart-bar', route: 'classAnalytics' },
  { id: 'print', label: 'Print', icon: 'ti ti-printer' },
  { id: 'assign_teacher', label: 'Assign Teacher', icon: 'ti ti-user-plus', divider: true },
  { id: 'assign_room', label: 'Assign Classroom', icon: 'ti ti-door' },
  { id: 'duplicate', label: 'Duplicate', icon: 'ti ti-copy' },
  { id: 'archive', label: 'Archive', icon: 'ti ti-archive' },
  { id: 'delete', label: 'Delete', icon: 'ti ti-trash-x', modal: 'delete', danger: true },
];

/** `tables.js` L1518–1539, verbatim. */
export const actionToasts: Record<string, string> = {
  refresh: 'Section list refreshed.',
  save_view: 'Current filters saved as a new view.',
  duplicate: 'Section duplicated as a draft.',
  assign_teacher: 'Teacher assignment opened for the selected sections.',
  assign_room: 'Classroom assignment opened for the selected sections.',
  update_capacity: 'Capacity update opened for the selected sections.',
  students: 'Students opened for this section.',
  attendance: 'Attendance opened for this section.',
  timetable: 'Timetable opened for this section.',
  syllabus: 'Syllabus opened for this section.',
  assignments: 'Assignments opened for this section.',
  exams: 'Exams opened for this section.',
  announcements: 'Announcements opened for this section.',
  reports: 'Section report opened.',
  notes: 'Academic notes opened for this section.',
  print: 'Sending the section list to the printer…',
  archive: 'Selected sections archived.',
  export_excel: 'Excel workbook queued for download.',
  export_pdf: 'PDF export queued for download.',
  export_csv: 'Preparing export…',
  page: 'Loading the selected page…',
  clear_filters: 'Filters cleared.',
  reset_columns: 'All columns restored.',
};

export const strings = {
  recentSort: 'Showing the most recently created sections first.',
  filterMatch: ' section(s) match the current filters.',
  viewMatch: ' section(s) in “',
};
