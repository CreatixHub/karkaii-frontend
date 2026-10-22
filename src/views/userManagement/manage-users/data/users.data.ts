/* -------------------------------------------------------------------------- */
/*                                Summary cards                               */
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
  { id: 'total', variant: 'stats-primary', icon: 'ti ti-users', value: '1,248', label: 'Total Users', note: '+8.2% this month' },
  { id: 'active', variant: 'stats-success', icon: 'ti ti-user-check', value: '1,102', label: 'Active Users', note: '+5.1% this month' },
  {
    id: 'pending',
    variant: 'stats-warning',
    icon: 'ti ti-mail-forward',
    value: '42',
    label: 'Pending Invitations',
    note: '9 expiring soon',
  },
  { id: 'inactive', variant: 'stats-info', icon: 'ti ti-user-off', value: '146', label: 'Inactive Users', note: 'Admin locked 18' },
];

/* -------------------------------------------------------------------------- */
/*                                    Rows                                    */
/* -------------------------------------------------------------------------- */

export type UserStatus = 'Active' | 'Pending' | 'Inactive' | 'Suspended' | 'Blocked';

export interface UserRow {
  id: string;
  name: string;
  avatar: string;
  /** Adds the green `.dt-presence.on` dot when true. */
  online: boolean;
  /** Presence word under the name: Online, Offline, Away, Invited, Blocked. */
  presence: string;
  role: string;
  roleBadgeClass: string;
  roleIcon: string;
  department: string;
  email: string;
  phone: string;
  branch: string;
  status: UserStatus;
  /** `.dt-pill` modifier that pairs with `status`. */
  pillClass: string;
  /** "Never signed in" rows carry no time or relative label. */
  lastLoginDate: string;
  lastLoginTime: string;
  lastLoginRelative: string;
  created: string;
  /** The template's `data-search` attribute, verbatim. */
  search: string;
}

export const userRows: UserRow[] = [
  {
    id: 'U-1001',
    name: 'Kevin Larry',
    avatar: 'assets/img/profiles/avatar-27.jpg',
    online: true,
    presence: 'Online',
    role: 'Administrator',
    roleBadgeClass: 'badge-soft-primary',
    roleIcon: 'ti ti-shield-check',
    department: 'IT & Admin',
    email: 'kevin.larry@karkaii.com',
    phone: '+1 452 6589 214',
    branch: 'Main Campus',
    status: 'Active',
    pillClass: 'is-active',
    lastLoginDate: '25 Jul 2026',
    lastLoginTime: '09:12 AM',
    lastLoginRelative: '2 hours ago',
    created: '12 Jan 2022',
    search: 'kevin larry u-1001 administrator it admin kevin.larry@karkaii.com main campus active 2022 online',
  },
  {
    id: 'U-1002',
    name: 'Sarah Mitchell',
    avatar: 'assets/img/profiles/avatar-02.jpg',
    online: true,
    presence: 'Online',
    role: 'Teacher',
    roleBadgeClass: 'badge-soft-success',
    roleIcon: 'ti ti-user',
    department: 'Science',
    email: 'sarah.m@karkaii.com',
    phone: '+1 336 5540 118',
    branch: 'Main Campus',
    status: 'Active',
    pillClass: 'is-active',
    lastLoginDate: '25 Jul 2026',
    lastLoginTime: '08:40 AM',
    lastLoginRelative: '3 hours ago',
    created: '03 Mar 2022',
    search: 'sarah mitchell u-1002 teacher science sarah.m@karkaii.com main campus active 2022 online',
  },
  {
    id: 'U-1003',
    name: 'James Wilson',
    avatar: 'assets/img/profiles/avatar-03.jpg',
    online: false,
    presence: 'Invited',
    role: 'Accountant',
    roleBadgeClass: 'badge-soft-warning',
    roleIcon: 'ti ti-calculator',
    department: 'Finance',
    email: 'james.w@karkaii.com',
    phone: '+1 774 2201 907',
    branch: 'North Branch',
    status: 'Pending',
    pillClass: 'is-pending',
    lastLoginDate: '24 Jul 2026',
    lastLoginTime: '06:05 PM',
    lastLoginRelative: '1 day ago',
    created: '18 Jun 2023',
    search: 'james wilson u-1003 accountant finance james.w@karkaii.com north branch pending 2023',
  },
  {
    id: 'U-1004',
    name: 'Emily Clarke',
    avatar: 'assets/img/profiles/avatar-04.jpg',
    online: false,
    presence: 'Away',
    role: 'Librarian',
    roleBadgeClass: 'badge-soft-teal',
    roleIcon: 'ti ti-books',
    department: 'Library',
    email: 'emily.c@karkaii.com',
    phone: '+1 908 4471 662',
    branch: 'Main Campus',
    status: 'Active',
    pillClass: 'is-active',
    lastLoginDate: '25 Jul 2026',
    lastLoginTime: '07:15 AM',
    lastLoginRelative: '4 hours ago',
    created: '22 Sep 2022',
    search: 'emily clarke u-1004 librarian library emily.c@karkaii.com main campus active 2022',
  },
  {
    id: 'U-1005',
    name: 'Robert Fox',
    avatar: 'assets/img/profiles/avatar-05.jpg',
    online: false,
    presence: 'Offline',
    role: 'Parent',
    roleBadgeClass: 'badge-soft-purple',
    roleIcon: 'ti ti-users-group',
    department: '',
    email: 'robert.fox@example.com',
    phone: '+1 565 6466 545',
    branch: '',
    status: 'Inactive',
    pillClass: 'is-inactive',
    lastLoginDate: 'Never signed in',
    lastLoginTime: '',
    lastLoginRelative: '',
    created: '09 Nov 2023',
    search: 'robert fox u-1005 parent robert.fox@example.com inactive 2023',
  },
  {
    id: 'U-1006',
    name: 'Janet Doe',
    avatar: 'assets/img/students/student-01.jpg',
    online: true,
    presence: 'Online',
    role: 'Student',
    roleBadgeClass: 'badge-soft-info',
    roleIcon: 'ti ti-school',
    department: 'Class III',
    email: 'janet.d@karkaii.com',
    phone: '+1 445 1120 330',
    branch: 'West Branch',
    status: 'Active',
    pillClass: 'is-active',
    lastLoginDate: '25 Jul 2026',
    lastLoginTime: '06:50 AM',
    lastLoginRelative: '5 hours ago',
    created: '25 Mar 2024',
    search: 'janet doe u-1006 student class iii janet.d@karkaii.com west branch active 2024',
  },
  {
    id: 'U-1007',
    name: 'Marcus Lee',
    avatar: 'assets/img/profiles/avatar-07.jpg',
    online: false,
    presence: 'Offline',
    role: 'Transport',
    roleBadgeClass: 'badge-soft-secondary',
    roleIcon: 'ti ti-bus',
    department: 'Transport',
    email: 'marcus.l@karkaii.com',
    phone: '+1 220 8890 471',
    branch: 'South Branch',
    status: 'Suspended',
    pillClass: 'is-suspended',
    lastLoginDate: '20 Jul 2026',
    lastLoginTime: '04:30 PM',
    lastLoginRelative: '5 days ago',
    created: '14 Feb 2023',
    search: 'marcus lee u-1007 transport marcus.l@karkaii.com south branch suspended 2023',
  },
  {
    id: 'U-1008',
    name: 'Olivia Grant',
    avatar: 'assets/img/profiles/avatar-08.jpg',
    online: false,
    presence: 'Blocked',
    role: 'Receptionist',
    roleBadgeClass: 'badge-soft-skyblue',
    roleIcon: 'ti ti-bell',
    department: 'Front Office',
    email: 'olivia.g@karkaii.com',
    phone: '+1 661 3345 209',
    branch: 'Main Campus',
    status: 'Blocked',
    pillClass: 'is-blocked',
    lastLoginDate: '18 Jul 2026',
    lastLoginTime: '10:10 AM',
    lastLoginRelative: '7 days ago',
    created: '30 Aug 2023',
    search: 'olivia grant u-1008 receptionist front office olivia.g@karkaii.com main campus blocked 2023',
  },
];

/* -------------------------------------------------------------------------- */
/*                                Saved views                                 */
/* -------------------------------------------------------------------------- */

export interface SavedView {
  id: string;
  label: string;
  icon: string;
}

export const savedViews: SavedView[] = [
  { id: 'all', label: 'All Users', icon: 'ti ti-layout-list' },
  { id: 'Active', label: 'Active', icon: 'ti ti-circle-check' },
  { id: 'Pending', label: 'Pending', icon: 'ti ti-clock' },
  { id: 'Inactive', label: 'Inactive', icon: 'ti ti-circle-x' },
  { id: 'Blocked', label: 'Blocked', icon: 'ti ti-ban' },
];

/**
 * The quick rail mixes roles and statuses in one list — `data-usr-view` carries
 * either, and the engine matches whichever the row has.
 */
export const quickFilters: SavedView[] = [
  { id: 'all', label: 'All Users', icon: 'ti ti-users' },
  { id: 'Teacher', label: 'Teachers', icon: 'ti ti-user' },
  { id: 'Student', label: 'Students', icon: 'ti ti-school' },
  { id: 'Parent', label: 'Parents', icon: 'ti ti-users-group' },
  { id: 'Accountant', label: 'Accountants', icon: 'ti ti-calculator' },
  { id: 'Librarian', label: 'Librarians', icon: 'ti ti-books' },
  { id: 'Receptionist', label: 'Receptionists', icon: 'ti ti-bell' },
  { id: 'Transport', label: 'Transport Staff', icon: 'ti ti-bus' },
  { id: 'Inactive', label: 'Inactive', icon: 'ti ti-user-off' },
  { id: 'Blocked', label: 'Blocked', icon: 'ti ti-ban' },
];

/* -------------------------------------------------------------------------- */
/*                              Advanced filters                              */
/* -------------------------------------------------------------------------- */

export type FilterKey = 'role' | 'department' | 'status' | 'branch' | 'class' | 'joined';

export interface AdvancedFilter {
  inputId: string;
  key: FilterKey;
  /** The `data-filter` name, which the engine uses as the chip label. */
  label: string;
  options: string[];
}

export const advancedFilters: AdvancedFilter[] = [
  {
    inputId: 'role',
    key: 'role',
    label: 'Role',
    options: ['Administrator', 'Teacher', 'Student', 'Parent', 'Accountant', 'Librarian', 'Receptionist', 'Transport'],
  },
  {
    inputId: 'department',
    key: 'department',
    label: 'Department',
    options: ['IT & Admin', 'Science', 'Finance', 'Library', 'Transport', 'Front Office'],
  },
  {
    inputId: 'status',
    key: 'status',
    label: 'Status',
    options: ['Active', 'Inactive', 'Pending', 'Blocked', 'Suspended'],
  },
  {
    inputId: 'branch',
    key: 'branch',
    label: 'Branch',
    options: ['Main Campus', 'North Branch', 'South Branch', 'West Branch'],
  },
  {
    inputId: 'class',
    key: 'class',
    label: 'Class',
    options: ['Class I', 'Class II', 'Class III', 'Class IV', 'Class V'],
  },
  { inputId: 'date-joined', key: 'joined', label: 'Joined', options: ['2024', '2023', '2022'] },
];

/* -------------------------------------------------------------------------- */
/*                             Column visibility                              */
/* -------------------------------------------------------------------------- */

export type ColumnId =
  | 'user'
  | 'userid'
  | 'role'
  | 'department'
  | 'email'
  | 'phone'
  | 'branch'
  | 'status'
  | 'login'
  | 'created';

export interface ColumnDef {
  id: ColumnId;
  label: string;
}

/** The Columns menu; Status has no toggle in the template but the column exists. */
export const columnDefs: ColumnDef[] = [
  { id: 'user', label: 'Profile' },
  { id: 'userid', label: 'User ID' },
  { id: 'role', label: 'Role' },
  { id: 'department', label: 'Department' },
  { id: 'email', label: 'Email' },
  { id: 'phone', label: 'Phone' },
  { id: 'branch', label: 'Branch' },
  { id: 'login', label: 'Last Login' },
  { id: 'created', label: 'Created Date' },
];

export const allColumns: Record<ColumnId, boolean> = {
  user: true,
  userid: true,
  role: true,
  department: true,
  email: true,
  phone: true,
  branch: true,
  status: true,
  login: true,
  created: true,
};

/* -------------------------------------------------------------------------- */
/*                              Sort and headers                              */
/* -------------------------------------------------------------------------- */

export type SortKey = 'recent' | 'name' | 'role' | 'department' | 'login' | 'created';

export const sortOptions: { id: SortKey; label: string; icon: string }[] = [
  { id: 'recent', label: 'Recently updated', icon: 'ti ti-clock' },
  { id: 'name', label: 'Name (A–Z)', icon: 'ti ti-abc' },
  { id: 'role', label: 'Role', icon: 'ti ti-shield-half' },
  { id: 'department', label: 'Department', icon: 'ti ti-building' },
  { id: 'created', label: 'Created date', icon: 'ti ti-calendar' },
];

/** Column headers in template order; `sort` doubles as the `data-usr-sort` key. */
export const tableHeaders: { id: ColumnId; label: string; sort?: SortKey; resize?: boolean }[] = [
  { id: 'user', label: 'Profile', sort: 'name', resize: true },
  { id: 'userid', label: 'User ID' },
  { id: 'role', label: 'Role', sort: 'role', resize: true },
  { id: 'department', label: 'Department', sort: 'department', resize: true },
  { id: 'email', label: 'Email' },
  { id: 'phone', label: 'Phone' },
  { id: 'branch', label: 'Branch' },
  { id: 'status', label: 'Status' },
  { id: 'login', label: 'Last Login', sort: 'login' },
  { id: 'created', label: 'Created', sort: 'created' },
];

export type DensityId = 'compact' | 'default' | 'comfortable';

export const densityOptions: { id: DensityId; title: string; ariaLabel: string; icon: string }[] = [
  { id: 'compact', title: 'Compact', ariaLabel: 'Compact rows', icon: 'ti ti-baseline-density-small' },
  { id: 'default', title: 'Default', ariaLabel: 'Default rows', icon: 'ti ti-baseline-density-medium' },
  { id: 'comfortable', title: 'Comfortable', ariaLabel: 'Comfortable rows', icon: 'ti ti-baseline-density-large' },
];

/* -------------------------------------------------------------------------- */
/*                          Exports, paging and modals                        */
/* -------------------------------------------------------------------------- */

export const exportActions: { id: string; label: string; icon: string }[] = [
  { id: 'export_pdf', label: 'Export as PDF', icon: 'ti ti-file-type-pdf' },
  { id: 'export_excel', label: 'Export as Excel', icon: 'ti ti-file-type-xls' },
  { id: 'export_csv', label: 'Export as CSV', icon: 'ti ti-file-type-csv' },
];

export const pageSizes = ['10', '25', '50', '100'];

export type UserModalId = 'invite' | 'import' | 'delete';

export type ToolbarMenu = 'views' | 'filters' | 'columns' | 'sort' | null;

/* -------------------------------------------------------------------------- */
/*                                Bulk actions                                */
/* -------------------------------------------------------------------------- */

export interface BulkAction {
  id: string;
  label: string;
  icon: string;
  modal?: UserModalId;
  danger?: boolean;
}

/** The page-header Bulk Actions menu. */
export const headerBulkActions: BulkAction[] = [
  { id: 'activate', label: 'Activate', icon: 'ti ti-user-check' },
  { id: 'deactivate', label: 'Deactivate', icon: 'ti ti-user-off' },
  { id: 'assign_role', label: 'Assign Role', icon: 'ti ti-shield-half' },
  { id: 'export_csv', label: 'Export Selected', icon: 'ti ti-download' },
  { id: 'delete', label: 'Delete Selected', icon: 'ti ti-trash', modal: 'delete', danger: true },
];

/** The `#usrBulk` bar that appears once rows are checked. */
export const bulkActions: BulkAction[] = [
  { id: 'activate', label: 'Activate', icon: 'ti ti-user-check' },
  { id: 'deactivate', label: 'Deactivate', icon: 'ti ti-user-off' },
  { id: 'assign_role', label: 'Assign Role', icon: 'ti ti-shield-half' },
  { id: 'reset_password', label: 'Reset Password', icon: 'ti ti-key' },
  { id: 'send_email', label: 'Send Email', icon: 'ti ti-mail', modal: 'invite' },
  { id: 'export_csv', label: 'Export', icon: 'ti ti-download' },
  { id: 'delete', label: 'Bulk Delete', icon: 'ti ti-trash', modal: 'delete', danger: true },
];

/** Toast copy for every `data-usr-action` the template fires. */
export const actionToasts: Record<string, string> = {
  refresh: 'User list refreshed',
  save_view: 'Current view saved',
  activate: 'Selected users activated',
  deactivate: 'Selected users deactivated',
  assign_role: 'Role assignment opened',
  reset_password: 'Password reset link sent',
  export_csv: 'Exported as CSV',
  export_pdf: 'Exported as PDF',
  export_excel: 'Exported as Excel',
  print: 'Sending the user list to the printer…',
};

/* -------------------------------------------------------------------------- */
/*                                Dialog content                              */
/* -------------------------------------------------------------------------- */

export const roleOptions = [
  'Administrator',
  'Teacher',
  'Student',
  'Parent',
  'Accountant',
  'Librarian',
  'Receptionist',
  'Transport',
];

export const branchOptions = ['Main Campus', 'North Branch', 'South Branch', 'West Branch'];
