/* -------------------------------------------------------------------------- */
/*                                    Rows                                    */
/* -------------------------------------------------------------------------- */

export type DepartmentStatus = 'Active' | 'Inactive';

/** Not in the HTML — see the banner. Backs the "Department Type" facet. */
export type DepartmentType = 'Academic' | 'Administrative' | 'Support';

/** Bootstrap tone used for the card avatar, the pane header wash and the code badge. */
export type DepartmentTone = 'primary' | 'success' | 'info' | 'warning' | 'danger' | 'secondary' | 'purple';

export interface DepartmentRow {
  /** `data-dept-target` on the card / `id` on the pane, e.g. `dept_0`. */
  id: string;
  name: string;
  /** The muted code under the name, e.g. `D757248`. */
  code: string;
  /** Tabler icon on the card avatar and the pane header. */
  icon: string;
  tone: DepartmentTone;
  /** Head of Department name, shown as `HoD: …` on the card. */
  hod: string;
  hodAvatar: string;
  /** `24 Staff` badge — same number as Total Employees. */
  staff: number;
  /** `0 Teachers` badge — same number as Active Teachers. */
  teachers: number;
  status: DepartmentStatus;
  /** Pane header blurb (L1843 and siblings). */
  description: string;
  contact: string;
  location: string;
  established: string;
  totalEmployees: number;
  totalSubjects: number;
  assignedClasses: number;
  activeTeachers: number;
  extension: string;
  email: string;
  type: DepartmentType;
  /** Assembled lowercase haystack; the template had no `data-search`. */
  search: string;
}

export const departmentRows: DepartmentRow[] = [
  {
    id: 'dept_0',
    name: 'Admin',
    code: 'D757248',
    icon: 'ti ti-shield-cog',
    tone: 'primary',
    hod: 'Kevin Larry',
    hodAvatar: 'assets/img/profiles/avatar-27.jpg',
    staff: 24,
    teachers: 0,
    status: 'Active',
    description:
      'Oversees institutional administration, records, correspondence and compliance across the campus.',
    contact: '+1 46548 84400',
    location: 'Block A, Floor 1',
    established: '12 Jan 2015',
    totalEmployees: 24,
    totalSubjects: 0,
    assignedClasses: 0,
    activeTeachers: 0,
    extension: 'Ext. 101',
    email: 'admin@karkaii.com',
    type: 'Administrative',
    search: 'admin d757248 kevin larry active administrative admin@karkaii.com block a, floor 1',
  },
  {
    id: 'dept_1',
    name: 'Finance',
    code: 'D757247',
    icon: 'ti ti-report-money',
    tone: 'success',
    hod: 'Teresa Susan',
    hodAvatar: 'assets/img/profiles/avatar-23.jpg',
    staff: 14,
    teachers: 0,
    status: 'Active',
    description: 'Manages budgeting, fee collection, payroll, procurement and financial reporting.',
    contact: '+1 46548 84401',
    location: 'Block A, Floor 2',
    established: '12 Jan 2016',
    totalEmployees: 14,
    totalSubjects: 0,
    assignedClasses: 0,
    activeTeachers: 0,
    extension: 'Ext. 102',
    email: 'finance@karkaii.com',
    type: 'Administrative',
    search: 'finance d757247 teresa susan active administrative finance@karkaii.com block a, floor 2',
  },
  {
    id: 'dept_2',
    name: 'Academic',
    code: 'D757246',
    icon: 'ti ti-school',
    tone: 'info',
    hod: 'Daniel Josua',
    hodAvatar: 'assets/img/profiles/avatar-25.jpg',
    staff: 96,
    teachers: 72,
    status: 'Active',
    description: 'Drives curriculum planning, examinations, teaching quality and academic outcomes.',
    contact: '+1 46548 84402',
    location: 'Block A, Floor 3',
    established: '12 Jan 2017',
    totalEmployees: 96,
    totalSubjects: 14,
    assignedClasses: 24,
    activeTeachers: 72,
    extension: 'Ext. 103',
    email: 'academic@karkaii.com',
    type: 'Academic',
    search: 'academic d757246 daniel josua active academic academic@karkaii.com block a, floor 3',
  },
  {
    id: 'dept_3',
    name: 'Library',
    code: 'D757245',
    icon: 'ti ti-books',
    tone: 'warning',
    hod: 'Hellana Robert',
    hodAvatar: 'assets/img/profiles/avatar-01.jpg',
    staff: 8,
    teachers: 2,
    status: 'Active',
    description: 'Maintains the library catalogue, digital resources, issue-return and reading programs.',
    contact: '+1 46548 84403',
    location: 'Block A, Floor 1',
    established: '12 Jan 2018',
    totalEmployees: 8,
    totalSubjects: 0,
    assignedClasses: 0,
    activeTeachers: 2,
    extension: 'Ext. 104',
    email: 'library@karkaii.com',
    type: 'Support',
    search: 'library d757245 hellana robert active support library@karkaii.com block a, floor 1',
  },
  {
    id: 'dept_4',
    name: 'Health',
    code: 'D757244',
    icon: 'ti ti-heartbeat',
    tone: 'danger',
    hod: 'Morgan Lee',
    hodAvatar: 'assets/img/profiles/avatar-02.jpg',
    staff: 6,
    teachers: 0,
    status: 'Inactive',
    description: 'Runs the campus infirmary, medical records, health checks and wellness initiatives.',
    contact: '+1 46548 84404',
    location: 'Block A, Floor 2',
    established: '12 Jan 2019',
    totalEmployees: 6,
    totalSubjects: 0,
    assignedClasses: 0,
    activeTeachers: 0,
    extension: 'Ext. 105',
    email: 'health@karkaii.com',
    type: 'Support',
    search: 'health d757244 morgan lee inactive support health@karkaii.com block a, floor 2',
  },
  {
    id: 'dept_5',
    name: 'Transport',
    code: 'D757243',
    icon: 'ti ti-bus',
    tone: 'secondary',
    hod: 'Aaron Cole',
    hodAvatar: 'assets/img/profiles/avatar-03.jpg',
    staff: 18,
    teachers: 0,
    status: 'Active',
    description: 'Coordinates routes, vehicles, drivers and student pickup logistics.',
    contact: '+1 46548 84405',
    location: 'Block A, Floor 3',
    established: '12 Jan 2020',
    totalEmployees: 18,
    totalSubjects: 0,
    assignedClasses: 0,
    activeTeachers: 0,
    extension: 'Ext. 106',
    email: 'transport@karkaii.com',
    type: 'Support',
    search: 'transport d757243 aaron cole active support transport@karkaii.com block a, floor 3',
  },
  {
    id: 'dept_6',
    name: 'Hostel',
    code: 'D757242',
    icon: 'ti ti-building-fortress',
    tone: 'purple',
    hod: 'Nina Patel',
    hodAvatar: 'assets/img/profiles/avatar-05.jpg',
    staff: 22,
    teachers: 0,
    status: 'Active',
    description: 'Oversees residential blocks, wardens, mess and boarder welfare.',
    contact: '+1 46548 84406',
    location: 'Block A, Floor 1',
    established: '12 Jan 2015',
    totalEmployees: 22,
    totalSubjects: 0,
    assignedClasses: 0,
    activeTeachers: 0,
    extension: 'Ext. 107',
    email: 'hostel@karkaii.com',
    type: 'Support',
    search: 'hostel d757242 nina patel active support hostel@karkaii.com block a, floor 1',
  },
  {
    id: 'dept_7',
    name: 'Management',
    code: 'D757241',
    icon: 'ti ti-briefcase',
    tone: 'primary',
    hod: 'Alan Poe',
    hodAvatar: 'assets/img/profiles/avatar-06.jpg',
    staff: 12,
    teachers: 0,
    status: 'Active',
    description: 'Strategic leadership, HR policy, staff onboarding and institutional planning.',
    contact: '+1 46548 84407',
    location: 'Block A, Floor 2',
    established: '12 Jan 2016',
    totalEmployees: 12,
    totalSubjects: 0,
    assignedClasses: 0,
    activeTeachers: 0,
    extension: 'Ext. 108',
    email: 'management@karkaii.com',
    type: 'Administrative',
    search: 'management d757241 alan poe active administrative management@karkaii.com block a, floor 2',
  },
  {
    id: 'dept_8',
    name: 'Guidance',
    code: 'D757240',
    icon: 'ti ti-user-heart',
    tone: 'info',
    hod: 'Carla Reed',
    hodAvatar: 'assets/img/profiles/avatar-07.jpg',
    staff: 9,
    teachers: 4,
    status: 'Inactive',
    description: 'Provides counselling, career guidance and student support services.',
    contact: '+1 46548 84408',
    location: 'Block A, Floor 3',
    established: '12 Jan 2017',
    totalEmployees: 9,
    totalSubjects: 2,
    assignedClasses: 0,
    activeTeachers: 4,
    extension: 'Ext. 109',
    email: 'guidance@karkaii.com',
    type: 'Academic',
    search: 'guidance d757240 carla reed inactive academic guidance@karkaii.com block a, floor 3',
  },
  {
    id: 'dept_9',
    name: 'Sports',
    code: 'D757239',
    icon: 'ti ti-ball-football',
    tone: 'success',
    hod: 'Rita Owen',
    hodAvatar: 'assets/img/profiles/avatar-08.jpg',
    staff: 16,
    teachers: 6,
    status: 'Active',
    description: 'Manages physical education, coaching, tournaments and sports facilities.',
    contact: '+1 46548 84409',
    location: 'Block A, Floor 1',
    established: '12 Jan 2018',
    totalEmployees: 16,
    totalSubjects: 3,
    assignedClasses: 0,
    activeTeachers: 6,
    extension: 'Ext. 110',
    email: 'sports@karkaii.com',
    type: 'Academic',
    search: 'sports d757239 rita owen active academic sports@karkaii.com block a, floor 1',
  },
];

/* -------------------------------------------------------------------------- */
/*                            Detail pane definitions                         */
/* -------------------------------------------------------------------------- */

/**
 * The ten "Department Information" tiles (L1862–1923). Icon, tone and label are
 * constant across every pane; only the value changes, so the tiles are described
 * once and read off the row.
 */
export type DepartmentInfoKey =
  | 'hod'
  | 'contact'
  | 'location'
  | 'established'
  | 'totalEmployees'
  | 'totalSubjects'
  | 'assignedClasses'
  | 'activeTeachers'
  | 'extension'
  | 'email';

export interface DepartmentInfoField {
  key: DepartmentInfoKey;
  label: string;
  icon: string;
  tone: DepartmentTone;
}

export const departmentInfoFields: DepartmentInfoField[] = [
  { key: 'hod', label: 'Head of Department', icon: 'ti ti-user-star', tone: 'primary' },
  { key: 'contact', label: 'Contact Information', icon: 'ti ti-phone', tone: 'success' },
  { key: 'location', label: 'Location', icon: 'ti ti-map-pin', tone: 'info' },
  { key: 'established', label: 'Established Date', icon: 'ti ti-calendar', tone: 'warning' },
  { key: 'totalEmployees', label: 'Total Employees', icon: 'ti ti-users', tone: 'purple' },
  { key: 'totalSubjects', label: 'Total Subjects', icon: 'ti ti-book', tone: 'danger' },
  { key: 'assignedClasses', label: 'Assigned Classes', icon: 'ti ti-clipboard-list', tone: 'secondary' },
  { key: 'activeTeachers', label: 'Active Teachers', icon: 'ti ti-school', tone: 'info' },
  { key: 'extension', label: 'Office Extension', icon: 'ti ti-phone-plus', tone: 'primary' },
  { key: 'email', label: 'Department Email', icon: 'ti ti-mail', tone: 'success' },
];

/**
 * The four "Assigned Staff" cards (L1925–1962). The template repeats the identical
 * block inside all ten panes, so the list is shared rather than per-department.
 */
export interface AssignedStaff {
  name: string;
  avatar: string;
  role: string;
  subject: string;
  status: string;
  /** `badge-soft-success` for Active, `badge-soft-warning` for On Leave. */
  statusClass: string;
  phone: string;
  /** `href="tel:…"`, digits only. */
  tel: string;
}

export const assignedStaff: AssignedStaff[] = [
  {
    name: 'Teresa Susan',
    avatar: 'assets/img/teachers/teacher-01.jpg',
    role: 'Senior Teacher',
    subject: 'Physics',
    status: 'Active',
    statusClass: 'badge-soft-success',
    phone: '+1 46548 84498',
    tel: '+14654884498',
  },
  {
    name: 'John Doe',
    avatar: 'assets/img/teachers/teacher-02.jpg',
    role: 'Coordinator',
    subject: 'Science',
    status: 'Active',
    statusClass: 'badge-soft-success',
    phone: '+1 46548 11223',
    tel: '+14654811223',
  },
  {
    name: 'Hellana Robert',
    avatar: 'assets/img/teachers/teacher-03.jpg',
    role: 'Teacher',
    subject: 'English',
    status: 'On Leave',
    statusClass: 'badge-soft-warning',
    phone: '+1 46548 55667',
    tel: '+14654855667',
  },
  {
    name: 'Morgan Lee',
    avatar: 'assets/img/teachers/teacher-05.jpg',
    role: 'Assistant',
    subject: 'Maths',
    status: 'Active',
    statusClass: 'badge-soft-success',
    phone: '+1 46548 99001',
    tel: '+14654899001',
  },
];

/** The five "Subjects" tiles (L1964–1995); shared across every pane, like the staff. */
export interface DepartmentSubject {
  name: string;
  code: string;
  teachers: number;
  tone: DepartmentTone;
}

export const departmentSubjects: DepartmentSubject[] = [
  { name: 'Mathematics', code: 'MTH-101', teachers: 6, tone: 'primary' },
  { name: 'Physics', code: 'PHY-102', teachers: 4, tone: 'info' },
  { name: 'Chemistry', code: 'CHM-103', teachers: 3, tone: 'success' },
  { name: 'English', code: 'ENG-104', teachers: 5, tone: 'warning' },
  { name: 'Computer Science', code: 'CSC-105', teachers: 4, tone: 'danger' },
];

/* -------------------------------------------------------------------------- */
/*                                   Modals                                   */
/* -------------------------------------------------------------------------- */

/**
 * The six modals at L3488–3654. `delete` is the template's `#delete-modal`; the rest
 * keep their markup ids verbatim.
 */
export type DepartmentModalId =
  | 'assign_staff'
  | 'assign_subjects'
  | 'department_details'
  | 'add_department'
  | 'edit_department'
  | 'delete';

/* -------------------------------------------------------------------------- */
/*                                Saved views                                 */
/* -------------------------------------------------------------------------- */

export interface SavedView {
  id: string;
  label: string;
  icon: string;
}

/** The "Saved Views" dropdown (L1527–1537); `all` is the template's active entry. */
export const savedViews: SavedView[] = [
  { id: 'all', label: 'All Departments', icon: 'ti ti-layout-grid' },
  { id: 'academic', label: 'Academic Only', icon: 'ti ti-school' },
  { id: 'inactive', label: 'Inactive', icon: 'ti ti-circle-x' },
];

/** The trailing "Save current view" entry, kept separate because a divider precedes it. */
export const saveViewAction: SavedView = { id: 'save_view', label: 'Save current view', icon: 'ti ti-plus' };

/* -------------------------------------------------------------------------- */
/*                               Quick filters                                */
/* -------------------------------------------------------------------------- */

/**
 * The `.quick-filters` chip strip (L1576–1581). These are removable summary chips in
 * the template rather than toggles, so each carries the badge tone it renders with.
 */
export interface QuickFilter {
  id: string;
  label: string;
  /** e.g. `badge-soft-primary`. */
  badgeClass: string;
  /** Tone class on the chip's remove link, e.g. `text-primary`. */
  removeClass: string;
}

export const quickFilters: QuickFilter[] = [
  {
    id: 'academic-year',
    label: 'Academic Year : 2024 / 2025',
    badgeClass: 'badge-soft-primary',
    removeClass: 'text-primary',
  },
  { id: 'status', label: 'Status : Active', badgeClass: 'badge-soft-success', removeClass: 'text-success' },
];

/* -------------------------------------------------------------------------- */
/*                              Advanced filters                              */
/* -------------------------------------------------------------------------- */

export type FilterKey = 'type' | 'head' | 'status' | 'staffCount';

export interface AdvancedFilterOption {
  value: string;
  label: string;
}

export interface AdvancedFilter {
  /** `id` on the template's `<select>`, reused for the label's `htmlFor`. */
  inputId: string;
  key: FilterKey;
  label: string;
  options: AdvancedFilterOption[];
}

const plain = (values: string[]): AdvancedFilterOption[] => values.map((value) => ({ value, label: value }));

/** The Filters dropdown (L1506–1517) — four selects laid out two per row. */
export const advancedFilters: AdvancedFilter[] = [
  {
    inputId: 'department-type',
    key: 'type',
    label: 'Department Type',
    options: plain(['Academic', 'Administrative', 'Support']),
  },
  {
    inputId: 'department-head',
    key: 'head',
    label: 'Department Head',
    options: plain(['Kevin Larry', 'Teresa Susan', 'Daniel Josua']),
  },
  {
    inputId: 'status',
    key: 'status',
    label: 'Status',
    options: plain(['Active', 'Inactive']),
  },
  {
    inputId: 'staff-count',
    key: 'staffCount',
    label: 'Staff Count',
    options: plain(['Under 10', '10 – 25', 'Over 25']),
  },
];

/** Maps a staff head-count onto the "Staff Count" facet's three bands. */
export const staffCountBand = (staff: number): string => {
  if (staff < 10) return 'Under 10';
  if (staff <= 25) return '10 – 25';
  return 'Over 25';
};

/* -------------------------------------------------------------------------- */
/*                               Card fields                                  */
/* -------------------------------------------------------------------------- */

/**
 * The "Fields" dropdown (L1549–1557). The template hides `.dept-f-*` spans on the
 * master cards; there is no table, so these are card fields rather than columns.
 */
export type ColumnId = 'staff' | 'teachers' | 'hod';

export interface ColumnDef {
  id: ColumnId;
  label: string;
}

export const columnDefs: ColumnDef[] = [
  { id: 'staff', label: 'Staff count' },
  { id: 'teachers', label: 'Teachers count' },
  { id: 'hod', label: 'Head of Department' },
];

export const allColumns: Record<ColumnId, boolean> = {
  staff: true,
  teachers: true,
  hod: true,
};

/* -------------------------------------------------------------------------- */
/*                                    Sort                                    */
/* -------------------------------------------------------------------------- */

export type SortKey = 'name' | 'staff' | 'recent';

export interface SortOption {
  id: SortKey;
  label: string;
  icon: string;
}

/** The Sort dropdown (L1518–1526); `name` is the template's active entry. */
export const sortOptions: SortOption[] = [
  { id: 'name', label: 'Name (A–Z)', icon: 'ti ti-abc' },
  { id: 'staff', label: 'Staff count', icon: 'ti ti-users' },
  { id: 'recent', label: 'Recently added', icon: 'ti ti-clock' },
];

/* -------------------------------------------------------------------------- */
/*                                   Density                                  */
/* -------------------------------------------------------------------------- */

/** Only two steps here — `departments.js` toggles `py-2` on the master card bodies. */
export type DensityId = 'compact' | 'default';

export const densityOptions: { id: DensityId; title: string; icon: string }[] = [
  { id: 'compact', title: 'Compact', icon: 'ti ti-baseline-density-small' },
  { id: 'default', title: 'Default', icon: 'ti ti-baseline-density-medium' },
];

/* -------------------------------------------------------------------------- */
/*                             Exports and toolbar                            */
/* -------------------------------------------------------------------------- */

/** The Export icon dropdown (L1565–1571) — PDF and Excel only, no CSV. */
export const exportActions: { id: string; label: string; icon: string }[] = [
  { id: 'export_pdf', label: 'Export as PDF', icon: 'ti ti-file-type-pdf' },
  { id: 'export_excel', label: 'Export as Excel', icon: 'ti ti-file-type-xls' },
];

export type ToolbarMenu = 'filters' | 'sort' | 'views' | 'bulk' | 'fields' | 'export' | null;

/** Placeholder and shortcut hint on `#deptSearch` (L1501–1505). */
export const searchPlaceholder = 'Search department, code or head…';
export const searchShortcut = '⌘K';

/* -------------------------------------------------------------------------- */
/*                                Bulk actions                                */
/* -------------------------------------------------------------------------- */

export interface BulkAction {
  id: string;
  label: string;
  icon: string;
  modal?: DepartmentModalId;
  danger?: boolean;
}

/**
 * The six entries shared by the "Bulk Actions" dropdown (L1538–1548) and the
 * `#dept_bulk` bar (L1588–1599). The dropdown labels "Export Selected" where the bar
 * labels "Export"; `barLabel` carries that variant.
 */
export const bulkActions: (BulkAction & { barLabel?: string })[] = [
  { id: 'assign_head', label: 'Assign Head', icon: 'ti ti-user-star', modal: 'assign_staff' },
  { id: 'change_status', label: 'Change Status', icon: 'ti ti-toggle-left' },
  { id: 'export_selected', label: 'Export Selected', barLabel: 'Export', icon: 'ti ti-file-export' },
  { id: 'print', label: 'Print', icon: 'ti ti-printer' },
  { id: 'archive', label: 'Archive', icon: 'ti ti-archive' },
  { id: 'delete', label: 'Delete', icon: 'ti ti-trash', modal: 'delete', danger: true },
];

/** Toast copy for every toolbar, bulk and row action that has no modal of its own. */
export const actionToasts: Record<string, string> = {
  assign_head: 'Head assignment opened',
  change_status: 'Status updated for the selected departments',
  export_selected: 'Selected departments exported',
  export_pdf: 'Exported as PDF',
  export_excel: 'Exported as Excel',
  print: 'Print view opened',
  archive: 'Selected departments archived',
  duplicate: 'Department duplicated',
  save_view: 'Current view saved',
  refresh: 'Department list refreshed',
  import: 'Import opened',
  fullscreen: 'Fullscreen toggled',
  settings: 'Department settings opened',
};

/* -------------------------------------------------------------------------- */
/*                                  Row menus                                 */
/* -------------------------------------------------------------------------- */

export interface RowMenuItem {
  id: string;
  label: string;
  icon: string;
  modal?: DepartmentModalId;
  /** Fires a toast from `actionToasts` when no modal is set. */
  action?: string;
  /** Renders `<hr class="dropdown-divider">` before the item. */
  divider?: boolean;
  danger?: boolean;
}

/** The kebab menu on every master card (L1618 and siblings). */
export const rowMenuItems: RowMenuItem[] = [
  { id: 'view', label: 'View', icon: 'ti ti-eye', modal: 'department_details' },
  { id: 'edit', label: 'Edit', icon: 'ti ti-edit', modal: 'edit_department' },
  { id: 'assign_staff', label: 'Assign Staff', icon: 'ti ti-user-plus', modal: 'assign_staff' },
  { id: 'assign_subjects', label: 'Assign Subjects', icon: 'ti ti-book', modal: 'assign_subjects' },
  { id: 'duplicate', label: 'Duplicate', icon: 'ti ti-copy', action: 'duplicate', divider: true },
  { id: 'archive', label: 'Archive', icon: 'ti ti-archive', action: 'archive' },
  { id: 'delete', label: 'Delete', icon: 'ti ti-trash', modal: 'delete', danger: true },
];

/** The round icon buttons in the detail pane header (L1847–1852). */
export interface DetailAction {
  id: string;
  title: string;
  icon: string;
  modal?: DepartmentModalId;
  action?: string;
}

export const detailActions: DetailAction[] = [
  { id: 'view', title: 'View', icon: 'ti ti-eye', modal: 'department_details' },
  { id: 'edit', title: 'Edit', icon: 'ti ti-edit', modal: 'edit_department' },
  { id: 'assign_staff', title: 'Assign Staff', icon: 'ti ti-user-plus', modal: 'assign_staff' },
  { id: 'assign_subjects', title: 'Assign Subjects', icon: 'ti ti-book', modal: 'assign_subjects' },
  { id: 'settings', title: 'Department Settings', icon: 'ti ti-settings', modal: 'edit_department' },
  { id: 'print', title: 'Print', icon: 'ti ti-printer', action: 'print' },
];

/** The kebab beside those buttons (L1853–1856). */
export const detailMenuItems: RowMenuItem[] = [
  { id: 'duplicate', label: 'Duplicate', icon: 'ti ti-copy', action: 'duplicate' },
  { id: 'archive', label: 'Archive', icon: 'ti ti-archive', action: 'archive' },
  { id: 'delete', label: 'Delete', icon: 'ti ti-trash', modal: 'delete', danger: true },
];

/* -------------------------------------------------------------------------- */
/*                              Modal option lists                            */
/* -------------------------------------------------------------------------- */

/** Assign Staff modal (L3489–3505). */
export const assignStaffDepartments = ['Admin', 'Finance', 'Academic'];
export const assignStaffRoles = ['Head of Department', 'Coordinator', 'Member'];
export const assignStaffOptions = ['Teresa Susan', 'John Doe', 'Hellana Robert', 'Morgan Lee'];

/** Assign Subjects modal (L3509–3522). */
export const assignSubjectsDepartments = ['Academic', 'Sports', 'Guidance'];
export const assignSubjectsOptions = ['Mathematics', 'Physics', 'Chemistry', 'English', 'Computer Science'];

/**
 * The Department Details modal's summary list (L3535–3543). It is a shorter set than
 * the pane's ten tiles and it renames three of them; the template hard-codes Admin's
 * values, including a Location ("Block A, Ground Floor") that disagrees with the
 * pane's "Block A, Floor 1" — the row's `location` is the value used here.
 */
export const departmentDetailRows: { key: DepartmentInfoKey; label: string }[] = [
  { key: 'hod', label: 'Head of Department' },
  { key: 'contact', label: 'Contact' },
  { key: 'location', label: 'Location' },
  { key: 'established', label: 'Established' },
  { key: 'totalEmployees', label: 'Total Employees' },
  { key: 'extension', label: 'Office Extension' },
  { key: 'email', label: 'Department Email' },
];

/* -------------------------------------------------------------------------- */
/*                                 Empty state                                */
/* -------------------------------------------------------------------------- */

/** `#dept_empty` (L1822–1829). */
export const emptyState = {
  icon: 'ti ti-building-off',
  title: 'No Departments Found',
  message: 'Create a department to organize staff, subjects and academic ownership across the campus.',
  actionLabel: 'Create Department',
  actionIcon: 'ti ti-square-rounded-plus',
};
