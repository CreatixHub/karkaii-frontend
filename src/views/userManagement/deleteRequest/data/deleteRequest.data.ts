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
  { id: 'total', variant: 'stats-primary', icon: 'ti ti-user-x', value: '128', label: 'Total Requests', note: '+6 this week' },
  {
    id: 'pending',
    variant: 'stats-warning',
    icon: 'ti ti-clock-hour-4',
    value: '24',
    label: 'Pending Review',
    note: 'Awaiting action',
  },
  { id: 'approved', variant: 'stats-success', icon: 'ti ti-circle-check', value: '86', label: 'Approved', note: '67% of total' },
  { id: 'rejected', variant: 'stats-danger', icon: 'ti ti-circle-x', value: '18', label: 'Rejected', note: 'Policy declined' },
];

/* -------------------------------------------------------------------------- */
/*                                    Rows                                    */
/* -------------------------------------------------------------------------- */

export type RequestStatus = 'Pending' | 'Under Review' | 'Approved' | 'Rejected' | 'Completed' | 'Cancelled';

export type UserType = 'Student' | 'Teacher' | 'Parent' | 'Employee';

/** The reviewer cell is either an avatar + name, or an "Unassigned" badge. */
export interface Reviewer {
  name: string;
  avatar: string;
}

export interface DeleteRequestRow {
  /** Request ID, e.g. `DR-1001`. */
  id: string;
  name: string;
  avatar: string;
  /** Adds the green `.dt-presence.on` dot when true. */
  online: boolean;
  /** The user's account number shown under the name, e.g. `U461893`. */
  userId: string;
  email: string;
  userType: UserType;
  /** Class for students, department for staff; `—` where the template shows one. */
  department: string;
  reason: string;
  /** The `title` on `.closure-reason-text`, rendered as a tooltip. */
  reasonNote: string;
  requested: string;
  status: RequestStatus;
  /** `.dt-pill` modifier that pairs with `status`. */
  pillClass: string;
  /** `null` renders the `badge-soft-secondary` "Unassigned" badge instead. */
  reviewer: Reviewer | null;
  /** Empty string renders the muted em dash the template uses. */
  deletion: string;
  /** The template's `data-search` attribute, verbatim. */
  search: string;
}

export const deleteRequestRows: DeleteRequestRow[] = [
  {
    id: 'DR-1001',
    name: 'Janet Doe',
    avatar: 'assets/img/students/student-01.jpg',
    online: true,
    userId: 'U461893',
    email: 'janet.d@karkaii.com',
    userType: 'Student',
    department: 'Class III',
    reason: 'Graduated',
    reasonNote: 'Student has graduated and completed all enrolled courses.',
    requested: '25 Mar 2024',
    status: 'Approved',
    pillClass: 'is-active',
    reviewer: { name: 'Sarah Mitchell', avatar: 'assets/img/profiles/avatar-02.jpg' },
    deletion: '10 Apr 2024',
    search: 'dr-1001 janet doe u461893 janet.d@karkaii.com student class iii graduated approved recent',
  },
  {
    id: 'DR-1002',
    name: 'Joann Smith',
    avatar: 'assets/img/students/student-02.jpg',
    online: false,
    userId: 'U461892',
    email: 'joann.s@karkaii.com',
    userType: 'Student',
    department: 'Class IV',
    reason: 'Duplicate Account',
    reasonNote: 'Duplicate student profile created during a bulk import.',
    requested: '18 Mar 2024',
    status: 'Pending',
    pillClass: 'is-pending',
    reviewer: null,
    deletion: '',
    search: 'dr-1002 joann smith u461892 joann.s@karkaii.com student class iv duplicate account pending recent high priority',
  },
  {
    id: 'DR-1003',
    name: 'Marcus Lee',
    avatar: 'assets/img/profiles/avatar-07.jpg',
    online: false,
    userId: 'U461887',
    email: 'marcus.l@karkaii.com',
    userType: 'Employee',
    department: 'Transport',
    reason: 'Employee Left',
    reasonNote: 'Staff member resigned; offboarding currently in progress.',
    requested: '14 Mar 2024',
    status: 'Under Review',
    pillClass: 'is-review',
    reviewer: { name: 'James Wilson', avatar: 'assets/img/profiles/avatar-03.jpg' },
    deletion: '28 Mar 2024',
    search: 'dr-1003 marcus lee u461887 marcus.l@karkaii.com employee transport employee left under review recent',
  },
  {
    id: 'DR-1004',
    name: 'Robert Fox',
    avatar: 'assets/img/profiles/avatar-05.jpg',
    online: false,
    userId: 'U461889',
    email: 'robert.fox@example.com',
    userType: 'Parent',
    department: '—',
    reason: 'Privacy Concern',
    reasonNote: 'Parent requested account closure citing personal privacy concerns.',
    requested: '27 Feb 2024',
    status: 'Rejected',
    pillClass: 'is-blocked',
    reviewer: { name: 'Kevin Larry', avatar: 'assets/img/profiles/avatar-27.jpg' },
    deletion: '',
    search: 'dr-1004 robert fox u461889 robert.fox@example.com parent — privacy concern rejected high priority',
  },
  {
    id: 'DR-1005',
    name: 'Emily Clarke',
    avatar: 'assets/img/profiles/avatar-04.jpg',
    online: false,
    userId: 'U461884',
    email: 'emily.c@karkaii.com',
    userType: 'Employee',
    department: 'Library',
    reason: 'No Longer Required',
    reasonNote: 'Temporary library assistant contract has ended.',
    requested: '13 Feb 2024',
    status: 'Completed',
    pillClass: 'is-completed',
    reviewer: { name: 'Kevin Larry', avatar: 'assets/img/profiles/avatar-27.jpg' },
    deletion: '20 Feb 2024',
    search: 'dr-1005 emily clarke u461884 emily.c@karkaii.com employee library no longer required completed ',
  },
  {
    id: 'DR-1006',
    name: 'Olivia Grant',
    avatar: 'assets/img/profiles/avatar-08.jpg',
    online: false,
    userId: 'U461886',
    email: 'olivia.g@karkaii.com',
    userType: 'Employee',
    department: 'Front Office',
    reason: 'Privacy Concern',
    reasonNote:
      'Formal data-protection erasure request submitted under GDPR Article 17 for all stored personal records.',
    requested: '11 Feb 2024',
    status: 'Under Review',
    pillClass: 'is-review',
    reviewer: { name: 'Sarah Mitchell', avatar: 'assets/img/profiles/avatar-02.jpg' },
    deletion: '25 Feb 2024',
    search: 'dr-1006 olivia grant u461886 olivia.g@karkaii.com employee front office privacy concern under review high priority',
  },
  {
    id: 'DR-1007',
    name: 'Ryan Cooper',
    avatar: 'assets/img/profiles/avatar-09.jpg',
    online: true,
    userId: 'U461885',
    email: 'ryan.c@karkaii.com',
    userType: 'Teacher',
    department: 'Science',
    reason: 'Other',
    reasonNote: 'Requested removal of a legacy test account.',
    requested: '24 Jan 2024',
    status: 'Cancelled',
    pillClass: 'is-inactive',
    reviewer: null,
    deletion: '',
    search: 'dr-1007 ryan cooper u461885 ryan.c@karkaii.com teacher science other cancelled ',
  },
  {
    id: 'DR-1008',
    name: 'Susan Ray',
    avatar: 'assets/img/profiles/avatar-10.jpg',
    online: false,
    userId: 'U461883',
    email: 'susan.r@karkaii.com',
    userType: 'Parent',
    department: '—',
    reason: 'Duplicate Account',
    reasonNote: 'Two parent accounts are linked to the same student record.',
    requested: '19 Jan 2024',
    status: 'Pending',
    pillClass: 'is-pending',
    reviewer: null,
    deletion: '',
    search: 'dr-1008 susan ray u461883 susan.r@karkaii.com parent — duplicate account pending ',
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
  { id: 'all', label: 'All Requests', icon: 'ti ti-layout-list' },
  { id: 'Pending', label: 'Pending', icon: 'ti ti-clock' },
  { id: 'Approved', label: 'Approved', icon: 'ti ti-circle-check' },
  { id: 'Rejected', label: 'Rejected', icon: 'ti ti-circle-x' },
];

/**
 * The quick rail mixes statuses, user types and two free-text tags — `recent` and
 * `high` have no column of their own, so the engine falls back to the row's
 * `data-search` haystack for them. The React build must match on `search` too.
 */
export const quickFilters: SavedView[] = [
  { id: 'all', label: 'All Requests', icon: 'ti ti-list' },
  { id: 'Pending', label: 'Pending', icon: 'ti ti-clock' },
  { id: 'Approved', label: 'Approved', icon: 'ti ti-circle-check' },
  { id: 'Rejected', label: 'Rejected', icon: 'ti ti-circle-x' },
  { id: 'Student', label: 'Students', icon: 'ti ti-school' },
  { id: 'Teacher', label: 'Teachers', icon: 'ti ti-user' },
  { id: 'Parent', label: 'Parents', icon: 'ti ti-users-group' },
  { id: 'Employee', label: 'Employees', icon: 'ti ti-briefcase' },
  { id: 'recent', label: 'Recent', icon: 'ti ti-history' },
  { id: 'high', label: 'High Priority', icon: 'ti ti-flag' },
];

/** Quick filters with no field of their own; matched against `search`. */
export const textOnlyViews = ['recent', 'high'];

/* -------------------------------------------------------------------------- */
/*                              Advanced filters                              */
/* -------------------------------------------------------------------------- */

export type FilterKey = 'Type' | 'Status' | 'Department' | 'Branch' | 'Date' | 'Approval';

export interface AdvancedFilter {
  inputId: string;
  key: FilterKey;
  /** Visible `<label>` copy; `key` doubles as the `data-filter` name and chip label. */
  label: string;
  /** The first `<option>`, which carries an empty value. */
  placeholder: string;
  options: string[];
}

export const advancedFilters: AdvancedFilter[] = [
  {
    inputId: 'user-type',
    key: 'Type',
    label: 'User Type',
    placeholder: 'All',
    options: ['Student', 'Teacher', 'Parent', 'Employee'],
  },
  {
    inputId: 'status',
    key: 'Status',
    label: 'Status',
    placeholder: 'All',
    options: ['Pending', 'Under Review', 'Approved', 'Rejected', 'Completed', 'Cancelled'],
  },
  {
    inputId: 'department',
    key: 'Department',
    label: 'Department',
    placeholder: 'All',
    options: ['Science', 'Transport', 'Library', 'Front Office'],
  },
  {
    inputId: 'branch',
    key: 'Branch',
    label: 'Branch',
    placeholder: 'All',
    options: ['Main Campus', 'North Branch', 'West Branch'],
  },
  {
    inputId: 'request-date',
    key: 'Date',
    label: 'Request Date',
    placeholder: 'Any Time',
    options: ['2024', '2023'],
  },
  {
    inputId: 'approval-status',
    key: 'Approval',
    label: 'Approval Status',
    placeholder: 'All',
    options: ['Manager', 'Administrator', 'Unassigned'],
  },
];

/* -------------------------------------------------------------------------- */
/*                             Column visibility                              */
/* -------------------------------------------------------------------------- */

export type ColumnId =
  | 'reqid'
  | 'user'
  | 'usertype'
  | 'department'
  | 'reason'
  | 'requested'
  | 'status'
  | 'reviewer'
  | 'deletion';

export interface ColumnDef {
  id: ColumnId;
  label: string;
}

/**
 * The Columns menu. Status has no toggle in the template but the column exists,
 * and `deletion` is labelled "Deletion Date" here while its header reads
 * "Expected Deletion" — both kept as the template wrote them.
 */
export const columnDefs: ColumnDef[] = [
  { id: 'reqid', label: 'Request ID' },
  { id: 'user', label: 'User' },
  { id: 'usertype', label: 'User Type' },
  { id: 'department', label: 'Department' },
  { id: 'reason', label: 'Reason' },
  { id: 'requested', label: 'Requested On' },
  { id: 'reviewer', label: 'Reviewer' },
  { id: 'deletion', label: 'Deletion Date' },
];

export const allColumns: Record<ColumnId, boolean> = {
  reqid: true,
  user: true,
  usertype: true,
  department: true,
  reason: true,
  requested: true,
  status: true,
  reviewer: true,
  deletion: true,
};

/* -------------------------------------------------------------------------- */
/*                              Sort and headers                              */
/* -------------------------------------------------------------------------- */

export type SortKey = 'recent' | 'name' | 'usertype' | 'requested';

/**
 * This page has no Sort dropdown — only three sortable `<th>` cells — so the
 * list below exists for parity with the engine's keys, `recent` being the order
 * the rows ship in.
 */
export const sortOptions: { id: SortKey; label: string; icon: string }[] = [
  { id: 'recent', label: 'Recently updated', icon: 'ti ti-clock' },
  { id: 'name', label: 'User (A–Z)', icon: 'ti ti-abc' },
  { id: 'usertype', label: 'User Type', icon: 'ti ti-users' },
  { id: 'requested', label: 'Requested On', icon: 'ti ti-calendar' },
];

/** Column headers in template order; `sort` doubles as the `data-dar-sort` key. */
export const tableHeaders: { id: ColumnId; label: string; sort?: SortKey; resize?: boolean }[] = [
  { id: 'reqid', label: 'Request ID' },
  { id: 'user', label: 'User', sort: 'name', resize: true },
  { id: 'usertype', label: 'User Type', sort: 'usertype' },
  { id: 'department', label: 'Department' },
  { id: 'reason', label: 'Reason' },
  { id: 'requested', label: 'Requested On', sort: 'requested' },
  { id: 'status', label: 'Status' },
  { id: 'reviewer', label: 'Reviewer' },
  { id: 'deletion', label: 'Expected Deletion' },
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

/** The page-header "Export Requests" menu. */
export const exportActions: { id: string; label: string; icon: string }[] = [
  { id: 'export_pdf', label: 'Export as PDF', icon: 'ti ti-file-type-pdf' },
  { id: 'export_excel', label: 'Export as Excel', icon: 'ti ti-file-type-xls' },
  { id: 'export_csv', label: 'Export as CSV', icon: 'ti ti-file-type-csv' },
];

export const pageSizes = ['10', '25', '50'];

/** `delete-account.html` ships exactly one dialog: the delete confirmation. */
export type DeleteRequestModalId = 'delete';

export type ToolbarMenu = 'views' | 'filters' | 'columns' | null;

/* -------------------------------------------------------------------------- */
/*                                Bulk actions                                */
/* -------------------------------------------------------------------------- */

export interface BulkAction {
  id: string;
  label: string;
  icon: string;
  modal?: DeleteRequestModalId;
  danger?: boolean;
}

/** The page-header "Bulk Actions" menu. */
export const headerBulkActions: BulkAction[] = [
  { id: 'bulk_approve', label: 'Approve Selected', icon: 'ti ti-circle-check' },
  { id: 'bulk_reject', label: 'Reject Selected', icon: 'ti ti-circle-x' },
  { id: 'export_csv', label: 'Export Selected', icon: 'ti ti-download' },
  { id: 'delete', label: 'Delete Permanently', icon: 'ti ti-trash', modal: 'delete', danger: true },
];

/** The `#darBulk` bar that appears once rows are checked. */
export const bulkActions: BulkAction[] = [
  { id: 'bulk_approve', label: 'Bulk Approve', icon: 'ti ti-circle-check' },
  { id: 'bulk_reject', label: 'Bulk Reject', icon: 'ti ti-circle-x' },
  { id: 'more_info', label: 'Request Info', icon: 'ti ti-info-circle' },
  { id: 'export_csv', label: 'Export', icon: 'ti ti-download' },
  { id: 'delete', label: 'Delete', icon: 'ti ti-trash', modal: 'delete', danger: true },
];

/* -------------------------------------------------------------------------- */
/*                                 Row actions                                */
/* -------------------------------------------------------------------------- */

export interface RowMenuItem {
  /** Unique key; two entries share the `review` action but not this id. */
  id: string;
  label: string;
  icon: string;
  /** The `data-dar-action` the template fires, when it fires one. */
  action?: string;
  /** Set on the entry that links to `profile.html` instead of firing an action. */
  profileLink?: boolean;
  modal?: DeleteRequestModalId;
  /** Extra text colour the template puts on the item. */
  className?: string;
  /** Renders `<hr className="dropdown-divider" />` above the item. */
  divider?: boolean;
}

/** The per-row overflow menu, in template order. */
export const rowMenuItems: RowMenuItem[] = [
  { id: 'view', label: 'View Request', icon: 'ti ti-eye', action: 'review' },
  { id: 'details', label: 'Review Details', icon: 'ti ti-file-search', action: 'review' },
  { id: 'approve', label: 'Approve', icon: 'ti ti-circle-check', action: 'approve', className: 'text-success' },
  { id: 'reject', label: 'Reject', icon: 'ti ti-circle-x', action: 'reject', className: 'text-warning' },
  { id: 'more_info', label: 'Request More Information', icon: 'ti ti-info-circle', action: 'more_info' },
  { id: 'profile', label: 'View User Profile', icon: 'ti ti-user-circle', profileLink: true },
  { id: 'download', label: 'Download Report', icon: 'ti ti-download', action: 'download' },
  {
    id: 'delete',
    label: 'Delete Permanently',
    icon: 'ti ti-trash-x',
    modal: 'delete',
    className: 'text-danger',
    divider: true,
  },
];

/** The two inline `.dt-ib` buttons that sit before the overflow menu. */
export const rowQuickActions: { id: string; title: string; icon: string; variant: string }[] = [
  { id: 'approve', title: 'Approve', icon: 'ti ti-circle-check', variant: 'success' },
  { id: 'reject', title: 'Reject', icon: 'ti ti-circle-x', variant: 'danger' },
];

/* -------------------------------------------------------------------------- */
/*                                   Toasts                                   */
/* -------------------------------------------------------------------------- */

/** `useToasts` has no `warn`/`error`; the engine's tones map onto these. */
export type ToastTone = 'success' | 'info' | 'warning' | 'danger';

export interface ActionToast {
  message: string;
  tone: ToastTone;
}

/** Toast copy for every `data-dar-action` the workspace script fires. */
export const actionToasts: Record<string, ActionToast> = {
  refresh: { message: 'Request list refreshed.', tone: 'success' },
  save_view: { message: 'Current filters saved as a new view.', tone: 'success' },
  approve: { message: 'Delete request approved and sent for scheduling.', tone: 'success' },
  reject: { message: 'Delete request rejected.', tone: 'warning' },
  bulk_approve: { message: 'Selected requests approved.', tone: 'success' },
  bulk_reject: { message: 'Selected requests rejected.', tone: 'warning' },
  more_info: { message: 'Requested more information from the submitter.', tone: 'info' },
  download: { message: 'Request report queued for download.', tone: 'info' },
  review: { message: 'Opening the review workspace…', tone: 'info' },
  print: { message: 'Sending the request list to the printer…', tone: 'info' },
  export_csv: { message: 'Preparing export…', tone: 'info' },
  export_excel: { message: 'Excel workbook queued for download.', tone: 'info' },
  export_pdf: { message: 'PDF export queued for download.', tone: 'info' },
  page: { message: 'Loading the selected page…', tone: 'info' },
  clear_filters: { message: 'Filters cleared.', tone: 'success' },
  reset_columns: { message: 'All columns restored.', tone: 'success' },
};

/* -------------------------------------------------------------------------- */
/*                             Approval workflow                              */
/* -------------------------------------------------------------------------- */

export type WorkflowState = 'is-done' | 'is-active' | 'is-pending';

export interface WorkflowStep {
  id: string;
  state: WorkflowState;
  icon: string;
  title: string;
  /** Date + time, or the word "Pending". */
  meta: string;
  /** The reviewer named under the step. */
  reviewer: string;
  /** `ti ti-user` for people, `ti ti-robot` for automated steps. */
  reviewerIcon: string;
}

/** The workflow panel is pinned to a single request in the template. */
export const workflowRequestId = 'DR-1003';

export const workflowSteps: WorkflowStep[] = [
  {
    id: 'submitted',
    state: 'is-done',
    icon: 'ti ti-check',
    title: 'Request Submitted',
    meta: '14 Mar 2024 · 09:12 AM',
    reviewer: 'Marcus Lee',
    reviewerIcon: 'ti ti-user',
  },
  {
    id: 'review',
    state: 'is-active',
    icon: 'ti ti-eye',
    title: 'Under Review',
    meta: '15 Mar 2024 · 10:40 AM',
    reviewer: 'James Wilson',
    reviewerIcon: 'ti ti-user',
  },
  {
    id: 'manager',
    state: 'is-pending',
    icon: 'ti ti-user-check',
    title: 'Manager Approval',
    meta: 'Pending',
    reviewer: 'Sarah Mitchell',
    reviewerIcon: 'ti ti-user',
  },
  {
    id: 'admin',
    state: 'is-pending',
    icon: 'ti ti-shield-check',
    title: 'Admin Approval',
    meta: 'Pending',
    reviewer: 'Kevin Larry',
    reviewerIcon: 'ti ti-user',
  },
  {
    id: 'scheduled',
    state: 'is-pending',
    icon: 'ti ti-calendar-time',
    title: 'Deletion Scheduled',
    meta: 'Pending',
    reviewer: 'System',
    reviewerIcon: 'ti ti-robot',
  },
  {
    id: 'completed',
    state: 'is-pending',
    icon: 'ti ti-circle-check',
    title: 'Completed',
    meta: 'Pending',
    reviewer: 'System',
    reviewerIcon: 'ti ti-robot',
  },
];

/* -------------------------------------------------------------------------- */
/*                               Warning panel                                */
/* -------------------------------------------------------------------------- */

export interface WarningNotice {
  id: string;
  icon: string;
  /** Copy before the bold run. */
  lead: string;
  /** The bold run itself. */
  strong: string;
  /** Copy after the bold run. */
  tail: string;
}

export const warningNotices: WarningNotice[] = [
  {
    id: 'access',
    icon: 'ti ti-lock-off text-warning',
    lead: 'Deleting an account will ',
    strong: 'permanently remove access',
    tail: ' to all school systems and services.',
  },
  {
    id: 'retention',
    icon: 'ti ti-shield-lock text-warning',
    lead: 'Personal data may be ',
    strong: 'anonymized',
    tail: ' and retained only where legally required.',
  },
  {
    id: 'irreversible',
    icon: 'ti ti-alert-hexagon text-danger',
    lead: 'This action ',
    strong: 'cannot be undone',
    tail: ' after final confirmation and scheduling.',
  },
];
