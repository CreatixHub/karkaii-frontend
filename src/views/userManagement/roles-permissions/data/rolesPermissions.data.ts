/* -------------------------------------------------------------------------- */
/*                                Overview cards                              */
/* -------------------------------------------------------------------------- */

export interface StatsCard {
  id: string;
  variant: string;
  icon: string;
  value: string;
  label: string;
  note: string;
}

export const statsCards: StatsCard[] = [
  { id: 'total', variant: 'stats-primary', icon: 'ti ti-shield-half', value: '14', label: 'Total Roles', note: '+2 this month' },
  { id: 'custom', variant: 'stats-purple', icon: 'ti ti-shield-cog', value: '6', label: 'Custom Roles', note: 'User defined' },
  { id: 'groups', variant: 'stats-success', icon: 'ti ti-key', value: '26', label: 'Permission Groups', note: 'Modules mapped' },
  {
    id: 'pending',
    variant: 'stats-warning',
    icon: 'ti ti-clock-check',
    value: '5',
    label: 'Pending Approvals',
    note: 'Needs review',
  },
];

/* -------------------------------------------------------------------------- */
/*                                    Roles                                   */
/* -------------------------------------------------------------------------- */

export type RoleStatus = 'Active' | 'Inactive';

export interface RoleRecord {
  id: string;
  name: string;
  description: string;
  icon: string;
  /** `role-icon-*` tone on the card badge. */
  tone: string;
  users: number;
  perms: number;
  /** `System Role` or `Custom Role`. */
  type: string;
  status: RoleStatus;
  /** The `data-rp-cat` values the category rail filters on. */
  categories: string[];
  /** Relative timestamp shown in the card meta row. */
  updated: string;
}

export const roles: RoleRecord[] = [
  {
    id: 'administrator',
    name: 'Administrator',
    description: 'Full, unrestricted access to every module, setting and user across the institution.',
    icon: 'ti ti-crown',
    tone: 'role-icon-primary',
    users: 12,
    perms: 248,
    type: 'System Role',
    status: 'Active',
    categories: ['system', 'recent'],
    updated: '2h ago',
  },
  {
    id: 'principal',
    name: 'Principal',
    description: 'Institution-wide oversight with access to academics, staff, finance and reports.',
    icon: 'ti ti-user-star',
    tone: 'role-icon-indigo',
    users: 2,
    perms: 214,
    type: 'System Role',
    status: 'Active',
    categories: ['system'],
    updated: '1d ago',
  },
  {
    id: 'vice-principal',
    name: 'Vice Principal',
    description: 'Supports the principal with academic and staff management privileges.',
    icon: 'ti ti-user-shield',
    tone: 'role-icon-indigo',
    users: 2,
    perms: 196,
    type: 'System Role',
    status: 'Active',
    categories: ['system'],
    updated: '3d ago',
  },
  {
    id: 'teacher',
    name: 'Teacher',
    description: 'Access to assigned classes, attendance, assignments, homework and grades.',
    icon: 'ti ti-chalkboard',
    tone: 'role-icon-success',
    users: 86,
    perms: 92,
    type: 'System Role',
    status: 'Active',
    categories: ['system', 'recent'],
    updated: '5h ago',
  },
  {
    id: 'class-teacher',
    name: 'Class Teacher',
    description: 'Extended teacher access for managing a class section and its students.',
    icon: 'ti ti-users-group',
    tone: 'role-icon-success',
    users: 24,
    perms: 104,
    type: 'Custom Role',
    status: 'Active',
    categories: ['custom', 'recent'],
    updated: '1d ago',
  },
  {
    id: 'student',
    name: 'Student',
    description: 'Read access to timetable, assignments, results, library and fees.',
    icon: 'ti ti-school',
    tone: 'role-icon-teal',
    users: 3256,
    perms: 28,
    type: 'System Role',
    status: 'Active',
    categories: ['system'],
    updated: '2d ago',
  },
  {
    id: 'parent',
    name: 'Parent',
    description: 'View child attendance, results, fees and school communication.',
    icon: 'ti ti-users',
    tone: 'role-icon-purple',
    users: 2890,
    perms: 22,
    type: 'System Role',
    status: 'Active',
    categories: ['system'],
    updated: '4d ago',
  },
  {
    id: 'accountant',
    name: 'Accountant',
    description: 'Manage fees, invoices, transactions and financial reports.',
    icon: 'ti ti-calculator',
    tone: 'role-icon-amber',
    users: 4,
    perms: 76,
    type: 'Custom Role',
    status: 'Active',
    categories: ['custom', 'recent'],
    updated: '6h ago',
  },
  {
    id: 'hr',
    name: 'HR',
    description: 'Manage staff records, payroll, leaves and departments.',
    icon: 'ti ti-briefcase',
    tone: 'role-icon-amber',
    users: 3,
    perms: 88,
    type: 'Custom Role',
    status: 'Active',
    categories: ['custom'],
    updated: '1d ago',
  },
  {
    id: 'librarian',
    name: 'Librarian',
    description: 'Manage library members, books, issue and returns.',
    icon: 'ti ti-books',
    tone: 'role-icon-teal',
    users: 2,
    perms: 54,
    type: 'Custom Role',
    status: 'Active',
    categories: ['custom'],
    updated: '2d ago',
  },
  {
    id: 'receptionist',
    name: 'Receptionist',
    description: 'Front-desk access to enquiries, visitors and communication.',
    icon: 'ti ti-bell',
    tone: 'role-icon-slate',
    users: 2,
    perms: 41,
    type: 'Custom Role',
    status: 'Inactive',
    categories: ['custom'],
    updated: '7d ago',
  },
  {
    id: 'transport-manager',
    name: 'Transport Manager',
    description: 'Manage routes, vehicles, drivers and transport assignments.',
    icon: 'ti ti-bus',
    tone: 'role-icon-slate',
    users: 1,
    perms: 48,
    type: 'Custom Role',
    status: 'Active',
    categories: ['custom'],
    updated: '3d ago',
  },
  {
    id: 'hostel-manager',
    name: 'Hostel Manager',
    description: 'Manage hostels, rooms, allotments and wardens.',
    icon: 'ti ti-building',
    tone: 'role-icon-slate',
    users: 1,
    perms: 46,
    type: 'Custom Role',
    status: 'Active',
    categories: ['custom'],
    updated: '5d ago',
  },
  {
    id: 'exam-controller',
    name: 'Exam Controller',
    description: 'Manage examinations, schedules, grades and results.',
    icon: 'ti ti-file-certificate',
    tone: 'role-icon-rose',
    users: 2,
    perms: 63,
    type: 'Custom Role',
    status: 'Active',
    categories: ['custom'],
    updated: '1d ago',
  },
];

/** The category rail above the directory list. */
export const roleCategories: { id: string; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'system', label: 'System' },
  { id: 'custom', label: 'Custom' },
  { id: 'recent', label: 'Recently Updated' },
];

/** The kebab on every role card. */
export interface RoleMenuItem {
  id: string;
  label: string;
  icon: string;
  modal?: RolesModalId;
  action?: string;
  divider?: boolean;
  danger?: boolean;
}

export const roleMenuItems: RoleMenuItem[] = [
  { id: 'view', label: 'View', icon: 'ti ti-eye', action: 'view' },
  { id: 'edit', label: 'Edit', icon: 'ti ti-edit', modal: 'edit_role' },
  { id: 'clone', label: 'Clone', icon: 'ti ti-copy', action: 'clone' },
  { id: 'compare', label: 'Compare', icon: 'ti ti-git-compare', action: 'compare' },
  { id: 'delete', label: 'Delete', icon: 'ti ti-trash', modal: 'delete', divider: true, danger: true },
];

/* -------------------------------------------------------------------------- */
/*                             Permission matrix                              */
/* -------------------------------------------------------------------------- */

/** The ten switches every module repeats, in template order. */
export const permissionLabels = [
  'View',
  'Create',
  'Edit',
  'Delete',
  'Import',
  'Export',
  'Approve',
  'Print',
  'Download',
  'Manage',
];

export interface PermissionModule {
  /** `data-name` on the accordion item; also the search key. */
  id: string;
  label: string;
  icon: string;
  /** One flag per entry in `permissionLabels`. */
  enabled: boolean[];
}

const flags = (...values: number[]) => values.map((value) => value === 1);

export const permissionModules: PermissionModule[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: 'ti ti-layout-dashboard',
    enabled: flags(1, 0, 0, 0, 0, 1, 0, 1, 1, 0),
  },
  { id: 'students', label: 'Students', icon: 'ti ti-school', enabled: flags(1, 1, 1, 1, 1, 1, 1, 1, 1, 1) },
  { id: 'admissions', label: 'Admissions', icon: 'ti ti-user-plus', enabled: flags(1, 1, 1, 1, 0, 1, 1, 1, 1, 1) },
  { id: 'teachers', label: 'Teachers', icon: 'ti ti-users', enabled: flags(1, 1, 1, 1, 1, 1, 0, 1, 1, 1) },
  { id: 'academics', label: 'Academics', icon: 'ti ti-book', enabled: flags(1, 1, 1, 0, 0, 1, 1, 1, 1, 1) },
  { id: 'attendance', label: 'Attendance', icon: 'ti ti-calendar-check', enabled: flags(1, 1, 1, 0, 1, 1, 1, 1, 1, 1) },
  { id: 'examinations', label: 'Examinations', icon: 'ti ti-certificate', enabled: flags(1, 1, 1, 1, 0, 1, 1, 1, 1, 1) },
  { id: 'finance', label: 'Finance', icon: 'ti ti-cash', enabled: flags(1, 1, 1, 1, 1, 1, 1, 1, 1, 1) },
];

/** The permission toolbar's buttons and the Presets dropdown. */
export const permissionActions: { id: string; label: string; icon: string }[] = [
  { id: 'expand', label: 'Expand All', icon: 'ti ti-arrows-down-up' },
  { id: 'collapse', label: 'Collapse All', icon: 'ti ti-arrows-up-down' },
  { id: 'select_all', label: 'Select All', icon: 'ti ti-checks' },
  { id: 'clear_all', label: 'Clear', icon: 'ti ti-square-off' },
];

export const permissionPresets: { id: string; label: string; icon: string }[] = [
  { id: 'read_only', label: 'Read Only', icon: 'ti ti-eye' },
  { id: 'editor', label: 'Editor', icon: 'ti ti-edit' },
  { id: 'manager', label: 'Manager', icon: 'ti ti-shield-check' },
  { id: 'full_access', label: 'Full Access', icon: 'ti ti-crown' },
];

/** Avatars stacked in the workspace header (L1885–1891). */
export const roleAvatars = [
  'assets/img/profiles/avatar-27.jpg',
  'assets/img/profiles/avatar-02.jpg',
  'assets/img/profiles/avatar-03.jpg',
  'assets/img/profiles/avatar-04.jpg',
];

/* -------------------------------------------------------------------------- */
/*                               User assignment                              */
/* -------------------------------------------------------------------------- */

export interface AssignedUser {
  name: string;
  email: string;
  avatar: string;
  department: string;
  role: string;
  roleBadgeClass: string;
  /** Assigned users offer Remove; unassigned ones offer Assign. */
  assigned: boolean;
}

export const assignedUsers: AssignedUser[] = [
  {
    name: 'Kevin Larry',
    email: 'kevin.larry@preskool.com',
    avatar: 'assets/img/profiles/avatar-27.jpg',
    department: 'IT & Admin',
    role: 'Administrator',
    roleBadgeClass: 'badge-soft-primary',
    assigned: true,
  },
  {
    name: 'Sarah Mitchell',
    email: 'sarah.m@preskool.com',
    avatar: 'assets/img/profiles/avatar-02.jpg',
    department: 'Science',
    role: 'Teacher',
    roleBadgeClass: 'badge-soft-success',
    assigned: false,
  },
  {
    name: 'James Wilson',
    email: 'james.w@preskool.com',
    avatar: 'assets/img/profiles/avatar-03.jpg',
    department: 'Finance',
    role: 'Accountant',
    roleBadgeClass: 'badge-soft-warning',
    assigned: false,
  },
  {
    name: 'Emily Clarke',
    email: 'emily.c@preskool.com',
    avatar: 'assets/img/profiles/avatar-04.jpg',
    department: 'Library',
    role: 'Librarian',
    roleBadgeClass: 'badge-soft-teal',
    assigned: true,
  },
  {
    name: 'Michael Chen',
    email: 'michael.chen@preskool.com',
    avatar: 'assets/img/profiles/avatar-05.jpg',
    department: 'Transport',
    role: 'Transport Manager',
    roleBadgeClass: 'badge-soft-info',
    assigned: true,
  },
  {
    name: 'Priya Sharma',
    email: 'priya.sharma@preskool.com',
    avatar: 'assets/img/profiles/avatar-06.jpg',
    department: 'Front Office',
    role: 'Receptionist',
    roleBadgeClass: 'badge-soft-secondary',
    assigned: false,
  },
  {
    name: 'Olivia Grant',
    email: 'olivia.grant@preskool.com',
    avatar: 'assets/img/profiles/avatar-07.jpg',
    department: 'Hostel',
    role: 'Hostel Manager',
    roleBadgeClass: 'badge-soft-purple',
    assigned: true,
  },
];

export const assignmentStats: { label: string; value: string; suffix?: string }[] = [
  { label: 'Total Assigned', value: '186' },
  { label: 'Roles In Use', value: '11', suffix: '/ 14' },
  { label: 'Pending Invites', value: '4' },
  { label: 'Unassigned Staff', value: '7' },
];

export const assignmentFilters: { id: string; ariaLabel: string; options: string[] }[] = [
  { id: 'departments', ariaLabel: 'All Departments', options: ['All Departments', 'Science', 'Finance', 'Library'] },
  { id: 'branches', ariaLabel: 'All Branches', options: ['All Branches', 'Main Campus', 'North Branch'] },
  { id: 'status', ariaLabel: 'All Status', options: ['All Status', 'Active', 'Inactive'] },
];

/* -------------------------------------------------------------------------- */
/*                            Security and audit                              */
/* -------------------------------------------------------------------------- */

export const securityScore = 82;

export const securityRows: { label: string; icon: string; value: string }[] = [
  { label: 'Critical Permissions', icon: 'ti ti-alert-hexagon text-danger', value: '14' },
  { label: 'High Risk Roles', icon: 'ti ti-shield-bolt text-warning', value: '3' },
  { label: 'Inactive Roles', icon: 'ti ti-circle-off text-muted', value: '2' },
  { label: 'Pending Reviews', icon: 'ti ti-clock-exclamation text-primary', value: '5' },
  { label: 'Last Security Audit', icon: 'ti ti-calendar-check text-success', value: '2 days ago' },
];

export interface AuditEntry {
  id: string;
  dot: string;
  icon: string;
  /** Rendered with `<b>` around the emphasised names, so it ships in parts. */
  parts: { text: string; bold?: boolean }[];
  meta: string;
}

export const auditEntries: AuditEntry[] = [
  {
    id: 'a1',
    dot: 'bg-primary',
    icon: 'ti ti-key',
    parts: [{ text: 'Permission changed on ' }, { text: 'Teacher', bold: true }],
    meta: 'by Kevin Larry · 25 Jul 2026, 09:12 AM',
  },
  {
    id: 'a2',
    dot: 'bg-success',
    icon: 'ti ti-user-plus',
    parts: [
      { text: 'User ' },
      { text: 'Sarah Mitchell', bold: true },
      { text: ' assigned to ' },
      { text: 'Teacher', bold: true },
    ],
    meta: 'by Kevin Larry · 24 Jul 2026, 06:05 PM',
  },
  {
    id: 'a3',
    dot: 'bg-warning',
    icon: 'ti ti-edit',
    parts: [{ text: 'Role ' }, { text: 'Accountant', bold: true }, { text: ' updated' }],
    meta: 'by System · 22 Jul 2026, 11:40 AM',
  },
  {
    id: 'a4',
    dot: 'bg-danger',
    icon: 'ti ti-user-minus',
    parts: [
      { text: 'User ' },
      { text: 'Olivia Grant', bold: true },
      { text: ' removed from ' },
      { text: 'Receptionist', bold: true },
    ],
    meta: 'by Kevin Larry · 20 Jul 2026, 04:30 PM',
  },
];

/* -------------------------------------------------------------------------- */
/*                             Header and dialogs                             */
/* -------------------------------------------------------------------------- */

export const exportActions: { id: string; label: string; icon: string }[] = [
  { id: 'export_pdf', label: 'Export as PDF', icon: 'ti ti-file-type-pdf' },
  { id: 'export_excel', label: 'Export as Excel', icon: 'ti ti-file-type-xls' },
  { id: 'export_csv', label: 'Export as CSV', icon: 'ti ti-file-type-csv' },
];

export type RolesModalId = 'add_role' | 'edit_role' | 'delete';

/** Toast copy for every `data-rp-action` the template fires. */
export const actionToasts: Record<string, string> = {
  clone: 'Role cloned as a draft',
  import: 'Import opened',
  compare: 'Role comparison opened',
  view: 'Role details opened',
  assign: 'User assignment opened',
  remove: 'User removed from the role',
  expand: 'All modules expanded',
  collapse: 'All modules collapsed',
  select_all: 'All permissions enabled',
  clear_all: 'All permissions cleared',
  export_pdf: 'Exported as PDF',
  export_excel: 'Exported as Excel',
  export_csv: 'Exported as CSV',
};
