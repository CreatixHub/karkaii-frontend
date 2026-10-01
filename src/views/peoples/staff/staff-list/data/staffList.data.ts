/* -------------------------------------------------------------------------- */
/*                                    Rows                                     */
/* -------------------------------------------------------------------------- */

export type StaffStatus = 'Active' | 'On Leave' | 'Probation' | 'Suspended' | 'Inactive';

/** Today's attendance chip in the "Work Details" column. */
export type StaffAttendance = 'Present' | 'On Leave' | 'Absent';

export interface StaffRow {
  /** The `.dt-code` employee id, e.g. `STF-2001`; unique, so it doubles as the key. */
  id: string;
  name: string;
  avatar: string;
  department: string;
  /** The department badge accent; the template gives each department its own. */
  departmentClass: string;
  designation: string;
  email: string;
  phone: string;
  branch: string;
  employmentType: string;
  /** The employment-type badge accent — success/warning/secondary in the template. */
  employmentClass: string;
  joined: string;
  reportsTo: string;
  qualification: string;
  /** `.dt-exp-val`, sorted numerically by `tables.js`. */
  experience: number;
  attendance: StaffAttendance;
  /** The attendance badge accent that pairs with `attendance`. */
  attendanceClass: string;
  lastLogin: string;
  status: StaffStatus;
  /** `.dt-pill` modifier. */
  statusClass: string;
  /** Pill glyph; statuses without one print a `.dt-pill-dot` instead. */
  statusIcon?: string;
  gender: string;
  /* ------------------------------ Detail panel ------------------------------ */
  emergencyContact: string;
  emergencyPhone: string;
  attendanceMonth: string;
  performanceNote: string;
  remarks: string;
  /** The template's `data-search` haystack, kept verbatim. */
  search: string;
}

export const staffRows: StaffRow[] = [
  {
    id: 'STF-2001',
    name: 'Teresa Bru',
    avatar: 'assets/img/profiles/avatar-01.jpg',
    department: 'Administration',
    departmentClass: 'badge-soft-primary',
    designation: 'Admin Officer',
    email: 'teresa.bru@example.com',
    phone: '+1 546 8548 801',
    branch: 'Main Campus',
    employmentType: 'Full Time',
    employmentClass: 'badge-soft-success',
    joined: '12 Jun 2019',
    reportsTo: 'Principal Office',
    qualification: 'MBA',
    experience: 9,
    attendance: 'Present',
    attendanceClass: 'badge-soft-success',
    lastLogin: 'Today 08:12 AM',
    status: 'Active',
    statusClass: 'is-active',
    gender: 'Female',
    emergencyContact: 'Next of Kin · Family',
    emergencyPhone: '+1 546 8548 899',
    attendanceMonth: '21 / 23 days',
    performanceNote: 'Last review rated Exceeds Expectations. Next review due next quarter.',
    remarks: 'Active and in good standing.',
    search:
      'teresa bru stf-2001 administration admin officer teresa.bru@example.com +1 546 8548 801 main campus full time active female',
  },
  {
    id: 'STF-2002',
    name: 'Daniel Josua',
    avatar: 'assets/img/profiles/avatar-02.jpg',
    department: 'Accounts',
    departmentClass: 'badge-soft-info',
    designation: 'Accountant',
    email: 'daniel.josua@example.com',
    phone: '+1 546 8548 802',
    branch: 'Main Campus',
    employmentType: 'Full Time',
    employmentClass: 'badge-soft-success',
    joined: '18 Feb 2020',
    reportsTo: 'Finance Head',
    qualification: 'M.Com',
    experience: 7,
    attendance: 'Present',
    attendanceClass: 'badge-soft-success',
    lastLogin: 'Today 08:40 AM',
    status: 'Active',
    statusClass: 'is-active',
    gender: 'Male',
    emergencyContact: 'Next of Kin · Family',
    emergencyPhone: '+1 546 8548 899',
    attendanceMonth: '21 / 23 days',
    performanceNote: 'Last review rated Exceeds Expectations. Next review due next quarter.',
    remarks: 'Active and in good standing.',
    search:
      'daniel josua stf-2002 accounts accountant daniel.josua@example.com +1 546 8548 802 main campus full time active male',
  },
  {
    id: 'STF-2003',
    name: 'Emily Clark',
    avatar: 'assets/img/profiles/avatar-03.jpg',
    department: 'Library',
    departmentClass: 'badge-soft-success',
    designation: 'Librarian',
    email: 'emily.clark@example.com',
    phone: '+1 546 8548 803',
    branch: 'North Wing',
    employmentType: 'Full Time',
    employmentClass: 'badge-soft-success',
    joined: '05 Oct 2018',
    reportsTo: 'Academic Head',
    qualification: 'MLIS',
    experience: 11,
    attendance: 'On Leave',
    attendanceClass: 'badge-soft-warning',
    lastLogin: 'Yesterday 04:20 PM',
    status: 'On Leave',
    statusClass: 'is-pending',
    statusIcon: 'ti ti-plane-departure',
    gender: 'Female',
    emergencyContact: 'Next of Kin · Family',
    emergencyPhone: '+1 546 8548 899',
    attendanceMonth: '21 / 23 days',
    performanceNote: 'Last review rated Outstanding. Next review due next quarter.',
    remarks: 'On approved leave; back on the scheduled date.',
    search:
      'emily clark stf-2003 library librarian emily.clark@example.com +1 546 8548 803 north wing full time on leave female',
  },
  {
    id: 'STF-2004',
    name: 'Jacob Ryan',
    avatar: 'assets/img/profiles/avatar-04.jpg',
    department: 'Transport',
    departmentClass: 'badge-soft-warning',
    designation: 'Transport Coordinator',
    email: 'jacob.ryan@example.com',
    phone: '+1 546 8548 804',
    branch: 'Main Campus',
    employmentType: 'Contract',
    employmentClass: 'badge-soft-warning',
    joined: '20 May 2021',
    reportsTo: 'Operations Head',
    qualification: 'B.A.',
    experience: 5,
    attendance: 'Present',
    attendanceClass: 'badge-soft-success',
    lastLogin: 'Today 07:55 AM',
    status: 'Active',
    statusClass: 'is-active',
    gender: 'Male',
    emergencyContact: 'Next of Kin · Family',
    emergencyPhone: '+1 546 8548 899',
    attendanceMonth: '21 / 23 days',
    performanceNote: 'Last review rated Meets Expectations. Next review due next quarter.',
    remarks: 'Active and in good standing.',
    search:
      'jacob ryan stf-2004 transport transport coordinator jacob.ryan@example.com +1 546 8548 804 main campus contract active male',
  },
  {
    id: 'STF-2005',
    name: 'Sophia Miller',
    avatar: 'assets/img/profiles/avatar-05.jpg',
    department: 'Front Office',
    departmentClass: 'badge-soft-purple',
    designation: 'Receptionist',
    email: 'sophia.miller@example.com',
    phone: '+1 546 8548 805',
    branch: 'South Wing',
    employmentType: 'Full Time',
    employmentClass: 'badge-soft-success',
    joined: '14 Sep 2022',
    reportsTo: 'Admin Officer',
    qualification: 'B.Com',
    experience: 3,
    attendance: 'Present',
    attendanceClass: 'badge-soft-success',
    lastLogin: 'Today 08:05 AM',
    status: 'Probation',
    statusClass: 'is-new',
    statusIcon: 'ti ti-hourglass',
    gender: 'Female',
    emergencyContact: 'Next of Kin · Family',
    emergencyPhone: '+1 546 8548 899',
    attendanceMonth: '21 / 23 days',
    performanceNote: 'Last review rated Meets Expectations. Next review due next quarter.',
    remarks: 'On probation — confirmation review pending.',
    search:
      'sophia miller stf-2005 front office receptionist sophia.miller@example.com +1 546 8548 805 south wing full time probation female',
  },
  {
    id: 'STF-2006',
    name: 'Michael Scott',
    avatar: 'assets/img/profiles/avatar-06.jpg',
    department: 'IT Support',
    departmentClass: 'badge-soft-teal',
    designation: 'System Administrator',
    email: 'michael.scott@example.com',
    phone: '+1 546 8548 806',
    branch: 'Main Campus',
    employmentType: 'Full Time',
    employmentClass: 'badge-soft-success',
    joined: '03 Jan 2017',
    reportsTo: 'IT Head',
    qualification: 'B.Tech',
    experience: 14,
    attendance: 'Present',
    attendanceClass: 'badge-soft-success',
    lastLogin: 'Today 07:30 AM',
    status: 'Active',
    statusClass: 'is-active',
    gender: 'Male',
    emergencyContact: 'Next of Kin · Family',
    emergencyPhone: '+1 546 8548 899',
    attendanceMonth: '21 / 23 days',
    performanceNote: 'Last review rated Outstanding. Next review due next quarter.',
    remarks: 'Active and in good standing.',
    search:
      'michael scott stf-2006 it support system administrator michael.scott@example.com +1 546 8548 806 main campus full time active male',
  },
  {
    id: 'STF-2007',
    name: 'Olivia Turner',
    avatar: 'assets/img/profiles/avatar-07.jpg',
    department: 'Housekeeping',
    departmentClass: 'badge-soft-pink',
    designation: 'Supervisor',
    email: 'olivia.turner@example.com',
    phone: '+1 546 8548 807',
    branch: 'North Wing',
    employmentType: 'Part Time',
    employmentClass: 'badge-soft-secondary',
    joined: '01 Mar 2023',
    reportsTo: 'Operations Head',
    qualification: 'Diploma',
    experience: 4,
    attendance: 'Absent',
    attendanceClass: 'badge-soft-danger',
    lastLogin: '22 Jul 2026 05:10 PM',
    status: 'Active',
    statusClass: 'is-active',
    gender: 'Female',
    emergencyContact: 'Next of Kin · Family',
    emergencyPhone: '+1 546 8548 899',
    attendanceMonth: '21 / 23 days',
    performanceNote: 'Last review rated Meets Expectations. Next review due next quarter.',
    remarks: 'Active and in good standing.',
    search:
      'olivia turner stf-2007 housekeeping supervisor olivia.turner@example.com +1 546 8548 807 north wing part time active female',
  },
  {
    id: 'STF-2008',
    name: 'William Adams',
    avatar: 'assets/img/profiles/avatar-08.jpg',
    department: 'Accounts',
    departmentClass: 'badge-soft-secondary',
    designation: 'Cashier',
    email: 'william.adams@example.com',
    phone: '+1 546 8548 808',
    branch: 'Main Campus',
    employmentType: 'Full Time',
    employmentClass: 'badge-soft-success',
    joined: '12 Jul 2015',
    reportsTo: 'Finance Head',
    qualification: 'B.Com',
    experience: 15,
    attendance: 'Present',
    attendanceClass: 'badge-soft-success',
    lastLogin: 'Today 08:22 AM',
    status: 'Active',
    statusClass: 'is-active',
    gender: 'Male',
    emergencyContact: 'Next of Kin · Family',
    emergencyPhone: '+1 546 8548 899',
    attendanceMonth: '21 / 23 days',
    performanceNote: 'Last review rated Outstanding. Next review due next quarter.',
    remarks: 'Active and in good standing.',
    search:
      'william adams stf-2008 accounts cashier william.adams@example.com +1 546 8548 808 main campus full time active male',
  },
  {
    id: 'STF-2009',
    name: 'Ava Robinson',
    avatar: 'assets/img/profiles/avatar-09.jpg',
    department: 'Administration',
    departmentClass: 'badge-soft-danger',
    designation: 'Clerk',
    email: 'ava.robinson@example.com',
    phone: '+1 546 8548 809',
    branch: 'South Wing',
    employmentType: 'Contract',
    employmentClass: 'badge-soft-warning',
    joined: '19 Apr 2014',
    reportsTo: 'Admin Officer',
    qualification: 'B.A.',
    experience: 16,
    attendance: 'On Leave',
    attendanceClass: 'badge-soft-warning',
    lastLogin: '20 Jul 2026 03:40 PM',
    status: 'Suspended',
    statusClass: 'is-emergency',
    statusIcon: 'ti ti-ban',
    gender: 'Female',
    emergencyContact: 'Next of Kin · Family',
    emergencyPhone: '+1 546 8548 899',
    attendanceMonth: '21 / 23 days',
    performanceNote: 'Last review rated Outstanding. Next review due next quarter.',
    remarks: 'Suspended — pending internal review.',
    search:
      'ava robinson stf-2009 administration clerk ava.robinson@example.com +1 546 8548 809 south wing contract suspended female',
  },
  {
    id: 'STF-2010',
    name: 'Ethan Wright',
    avatar: 'assets/img/profiles/avatar-10.jpg',
    department: 'Security',
    departmentClass: 'badge-soft-secondary',
    designation: 'Security Head',
    email: 'ethan.wright@example.com',
    phone: '+1 546 8548 810',
    branch: 'Main Campus',
    employmentType: 'Full Time',
    employmentClass: 'badge-soft-success',
    joined: '09 Jan 2013',
    reportsTo: 'Operations Head',
    qualification: 'High School',
    experience: 17,
    attendance: 'Absent',
    attendanceClass: 'badge-soft-danger',
    lastLogin: '18 Nov 2025 09:10 AM',
    status: 'Inactive',
    statusClass: 'is-inactive',
    gender: 'Male',
    emergencyContact: 'Next of Kin · Family',
    emergencyPhone: '+1 546 8548 899',
    attendanceMonth: '21 / 23 days',
    performanceNote: 'Last review rated Outstanding. Next review due next quarter.',
    remarks: 'Inactive — separated from service, retained for records.',
    search:
      'ethan wright stf-2010 security security head ethan.wright@example.com +1 546 8548 810 main campus full time inactive male',
  },
];

/** The document chips every detail panel prints, identical across all ten rows. */
export const detailDocumentBadges: { label: string; accent: string }[] = [
  { label: 'ID Proof', accent: 'badge-soft-success' },
  { label: 'Resume', accent: 'badge-soft-info' },
  { label: 'Contract', accent: 'badge-soft-warning' },
  { label: 'Certificates', accent: 'badge-soft-secondary' },
];

/* -------------------------------------------------------------------------- */
/*                                Summary strip                                */
/* -------------------------------------------------------------------------- */

export interface SummaryCard {
  id: string;
  accent: string;
  icon: string;
  value: string;
  label: string;
  /** Only the last card carries a sparkline, as on the sibling list pages. */
  spark?: number[];
}

/**
 * `staffs.html` is the one list template that ships **without** a summary strip
 * — its skeleton has no `.skeleton-summary` block either. These tiles follow
 * the sibling list pages (`parents.html`, `teacher-list.html`) so the workspace
 * reads consistently; every figure is the tally of the ten seeded rows, and
 * "Selected"/"Filtered Results" are supplied live by `SummaryStrip`.
 */
export const summaryCards: SummaryCard[] = [
  { id: 'total', accent: 'accent-primary', icon: 'ti ti-users', value: '10', label: 'Total Staff' },
  { id: 'selected', accent: 'accent-purple', icon: 'ti ti-checkbox', value: '0', label: 'Selected' },
  { id: 'active', accent: 'accent-success', icon: 'ti ti-user-check', value: '6', label: 'Active' },
  { id: 'leave', accent: 'accent-warning', icon: 'ti ti-plane-departure', value: '1', label: 'On Leave' },
  { id: 'probation', accent: 'accent-info', icon: 'ti ti-hourglass', value: '1', label: 'Probation' },
  { id: 'suspended', accent: 'accent-danger', icon: 'ti ti-ban', value: '1', label: 'Suspended' },
  { id: 'inactive', accent: 'accent-slate', icon: 'ti ti-user-off', value: '1', label: 'Inactive' },
  {
    id: 'filtered',
    accent: 'accent-teal',
    icon: 'ti ti-filter',
    value: '10',
    label: 'Filtered Results',
    spark: [40, 65, 50, 80, 70, 95],
  },
];

/* -------------------------------------------------------------------------- */
/*                                   Toolbar                                   */
/* -------------------------------------------------------------------------- */

export interface SavedView {
  id: string;
  label: string;
  icon: string;
}

export const savedViews: SavedView[] = [
  { id: 'all', label: 'All Staff', icon: 'ti ti-layout-list' },
  { id: 'Active', label: 'Active', icon: 'ti ti-circle-check' },
  { id: 'On Leave', label: 'On Leave', icon: 'ti ti-plane-departure' },
  { id: 'Probation', label: 'Probation', icon: 'ti ti-hourglass' },
  { id: 'Suspended', label: 'Suspended', icon: 'ti ti-ban' },
];

/** The quick-filter rail adds Inactive, which the saved-view menu leaves out. */
export const quickFilters: SavedView[] = [
  { id: 'Active', label: 'Active', icon: 'ti ti-circle-check' },
  { id: 'On Leave', label: 'On Leave', icon: 'ti ti-plane-departure' },
  { id: 'Probation', label: 'Probation', icon: 'ti ti-hourglass' },
  { id: 'Suspended', label: 'Suspended', icon: 'ti ti-ban' },
  { id: 'Inactive', label: 'Inactive', icon: 'ti ti-circle-off' },
];

/** One key per `[data-filter]` select in the advanced filter panel. */
export type FilterKey =
  | 'department'
  | 'designation'
  | 'staffType'
  | 'employment'
  | 'gender'
  | 'branch'
  | 'status'
  | 'joining';

export interface AdvancedFilter {
  /** The `id`/`for` pair the template gives the control. */
  inputId: string;
  key: FilterKey;
  /** The visible `<label>` copy. */
  fieldLabel: string;
  /** The `data-filter` name, which the engine uses as the chip label. */
  label: string;
  /** The empty option's copy — "All" everywhere except Joining Date. */
  anyLabel: string;
  /**
   * `value` is what the engine matches; `label` is what the option prints. They
   * differ only for Joining Date, whose values are date substrings.
   */
  options: { value: string; label: string }[];
}

const plain = (values: string[]) => values.map((value) => ({ value, label: value }));

export const advancedFilters: AdvancedFilter[] = [
  {
    inputId: 'department',
    key: 'department',
    fieldLabel: 'Department',
    label: 'Department',
    anyLabel: 'All',
    options: plain([
      'Administration',
      'Accounts',
      'Library',
      'Transport',
      'Front Office',
      'IT Support',
      'Housekeeping',
      'Security',
    ]),
  },
  {
    inputId: 'designation',
    key: 'designation',
    fieldLabel: 'Designation',
    label: 'Designation',
    anyLabel: 'All',
    options: plain([
      'Admin Officer',
      'Accountant',
      'Librarian',
      'Transport Coordinator',
      'Receptionist',
      'System Administrator',
      'Supervisor',
      'Cashier',
      'Clerk',
      'Security Head',
    ]),
  },
  {
    inputId: 'staff-type',
    key: 'staffType',
    fieldLabel: 'Staff Type',
    label: 'StaffType',
    anyLabel: 'All',
    options: plain(['Non-Teaching', 'Support']),
  },
  {
    inputId: 'employment-type',
    key: 'employment',
    fieldLabel: 'Employment Type',
    label: 'Employment',
    anyLabel: 'All',
    options: plain(['Full Time', 'Contract', 'Part Time']),
  },
  {
    inputId: 'gender',
    key: 'gender',
    fieldLabel: 'Gender',
    label: 'Gender',
    anyLabel: 'All',
    options: plain(['Male', 'Female']),
  },
  {
    inputId: 'branch',
    key: 'branch',
    fieldLabel: 'Branch',
    label: 'Branch',
    anyLabel: 'All',
    options: plain(['Main Campus', 'North Wing', 'South Wing']),
  },
  {
    inputId: 'status',
    key: 'status',
    fieldLabel: 'Status',
    label: 'Status',
    anyLabel: 'All',
    options: plain(['Active', 'On Leave', 'Probation', 'Suspended', 'Inactive']),
  },
  {
    inputId: 'joining-date',
    key: 'joining',
    fieldLabel: 'Joining Date',
    label: 'Joining',
    anyLabel: 'Any',
    options: [
      { value: '2023', label: '2023 & later' },
      { value: '2020', label: '2020 – 2022' },
      { value: '201', label: 'Before 2020' },
    ],
  },
];

export type ColumnId = 'staff' | 'contact' | 'work' | 'status';

export interface ColumnDef {
  id: ColumnId;
  label: string;
}

export const columnDefs: ColumnDef[] = [
  { id: 'staff', label: 'Staff' },
  { id: 'contact', label: 'Contact Details' },
  { id: 'work', label: 'Work Details' },
  { id: 'status', label: 'Status' },
];

export type DensityId = 'compact' | 'default' | 'comfortable';

export interface DensityOption {
  id: DensityId;
  title: string;
  ariaLabel: string;
  icon: string;
}

export const densityOptions: DensityOption[] = [
  { id: 'compact', title: 'Compact', ariaLabel: 'Compact rows', icon: 'ti ti-baseline-density-small' },
  { id: 'default', title: 'Default', ariaLabel: 'Default rows', icon: 'ti ti-baseline-density-medium' },
  { id: 'comfortable', title: 'Comfortable', ariaLabel: 'Comfortable rows', icon: 'ti ti-baseline-density-large' },
];

export type SortKey = 'name' | 'department' | 'experience' | 'joindate' | 'status' | 'recent';

export interface SortOption {
  id: SortKey;
  label: string;
  icon: string;
}

/** The Sort menu; `status` is header-only, so it is absent here. */
export const sortOptions: SortOption[] = [
  { id: 'name', label: 'Employee Name (A–Z)', icon: 'ti ti-abc' },
  { id: 'department', label: 'Department', icon: 'ti ti-building' },
  { id: 'experience', label: 'Experience', icon: 'ti ti-briefcase' },
  { id: 'joindate', label: 'Joining Date', icon: 'ti ti-calendar-event' },
  { id: 'recent', label: 'Recently updated', icon: 'ti ti-clock' },
];

/** Column headers, in template order; `sort` doubles as the `data-cls-sort` key. */
export const tableHeaders: { id: ColumnId; label: string; sort?: SortKey; resize: boolean }[] = [
  { id: 'staff', label: 'Staff', sort: 'name', resize: true },
  { id: 'contact', label: 'Contact Details', sort: 'joindate', resize: true },
  { id: 'work', label: 'Work Details', sort: 'experience', resize: true },
  { id: 'status', label: 'Status', sort: 'status', resize: true },
];

/** The page-header Export dropdown. Printing sits beside it as its own button. */
export const exportActions: { id: string; label: string; icon: string }[] = [
  { id: 'export_pdf', label: 'Export as PDF', icon: 'ti ti-file-type-pdf' },
  { id: 'export_excel', label: 'Export as Excel', icon: 'ti ti-file-type-xls' },
  { id: 'export_csv', label: 'Export as CSV', icon: 'ti ti-file-type-csv' },
];

export const pageSizes = ['10', '25', '50'];

/* -------------------------------------------------------------------------- */
/*                                Bulk actions                                 */
/* -------------------------------------------------------------------------- */

/** The nine dialogs shipped with `staffs.html`. */
export type StaffListModalId =
  | 'add'
  | 'edit'
  | 'profile'
  | 'assign'
  | 'documents'
  | 'attendance'
  | 'performance'
  | 'import'
  | 'delete';

export interface BulkAction {
  label: string;
  icon: string;
  modal?: StaffListModalId;
  action?: string;
  danger?: boolean;
}

export const bulkActions: BulkAction[] = [
  { label: 'Assign Department', icon: 'ti ti-building-community', modal: 'assign' },
  { label: 'Export Selected', icon: 'ti ti-file-export', action: 'export_csv' },
  { label: 'Print Profiles', icon: 'ti ti-printer', action: 'print_profile' },
  { label: 'Archive', icon: 'ti ti-archive', action: 'archive' },
  { label: 'Delete', icon: 'ti ti-trash', modal: 'delete', danger: true },
];

/**
 * Toast copy for `data-cls-action` hooks, keyed by action id — the `staffs.html`
 * block of `assets/js/tables.js`, verbatim. Actions absent from the registry
 * raise no toast. `export_csv` is the one addition: the template downloads
 * `staffs.csv` without announcing it.
 */
export const actionToasts: Record<string, { message: string; variant: 'success' | 'info' | 'warning' }> = {
  refresh: { message: 'Staff list refreshed.', variant: 'success' },
  save_view: { message: 'Current filters saved as a new view.', variant: 'success' },
  view: { message: 'Staff profile opened.', variant: 'info' },
  attendance: { message: 'Attendance history opened.', variant: 'info' },
  payroll: { message: 'Payroll details opened.', variant: 'info' },
  leave: { message: 'Leave history opened.', variant: 'info' },
  assign_dept: { message: 'Department assignment opened.', variant: 'info' },
  documents: { message: 'Staff documents opened.', variant: 'info' },
  performance: { message: 'Performance review opened.', variant: 'info' },
  transfer: { message: 'Department transfer opened.', variant: 'info' },
  reset_cred: { message: 'Credential reset opened.', variant: 'warning' },
  export_profile: { message: 'Staff profile export queued.', variant: 'info' },
  print_profile: { message: 'Staff profile queued for printing.', variant: 'info' },
  duplicate: { message: 'Staff duplicated as a draft.', variant: 'success' },
  archive: { message: 'Selected staff archived.', variant: 'success' },
  print: { message: 'Sending the staff list to the printer…', variant: 'info' },
  export_excel: { message: 'Excel workbook queued for download.', variant: 'info' },
  export_pdf: { message: 'PDF export queued for download.', variant: 'info' },
  export_csv: { message: 'Preparing export…', variant: 'info' },
  page: { message: 'Loading the selected page…', variant: 'info' },
};

/* -------------------------------------------------------------------------- */
/*                                Dialog content                               */
/* -------------------------------------------------------------------------- */

/** Shared `<select>` option lists — Add Staff, Edit Staff and Assign all reuse them. */
export const departmentOptions = [
  'Administration',
  'Accounts',
  'Library',
  'Transport',
  'Front Office',
  'IT Support',
  'Housekeeping',
  'Security',
];

export const designationOptions = [
  'Admin Officer',
  'Accountant',
  'Librarian',
  'Transport Coordinator',
  'Receptionist',
  'System Administrator',
  'Supervisor',
  'Cashier',
  'Clerk',
  'Security Head',
];

/** Add/Edit Staff order the employment types differently to the filter panel. */
export const employmentTypeOptions = ['Full Time', 'Part Time', 'Contract'];

export const importModes = ['Create new staff', 'Update existing by employee ID', 'Create and update'];

/** The Document Management table. */
export interface StaffDocument {
  label: string;
  icon: string;
  reference: string;
  uploaded: string;
  status: string;
  statusClass: string;
}

export const documentRows: StaffDocument[] = [
  {
    label: 'ID Proof',
    icon: 'ti ti-id me-1 text-primary',
    reference: 'ID-77890123',
    uploaded: '12 Jun 2019',
    status: 'Verified',
    statusClass: 'badge-soft-success',
  },
  {
    label: 'Resume',
    icon: 'ti ti-file-cv me-1 text-info',
    reference: 'CV-2019-441',
    uploaded: '10 Jun 2019',
    status: 'Verified',
    statusClass: 'badge-soft-success',
  },
  {
    label: 'Employment Contract',
    icon: 'ti ti-file-text me-1 text-warning',
    reference: 'EMP-2019-0091',
    uploaded: '12 Jun 2019',
    status: 'Signed',
    statusClass: 'badge-soft-success',
  },
  {
    label: 'Certificates',
    icon: 'ti ti-certificate me-1 text-success',
    reference: 'CRT-MBA-2016',
    uploaded: '12 Jun 2019',
    status: 'Pending',
    statusClass: 'badge-soft-warning',
  },
];

/** The four tallies above the Attendance Summary table. */
export const attendanceTotals: { label: string; icon: string; accent: string }[] = [
  { label: 'Present 21', icon: 'ti ti-calendar-check', accent: 'badge-soft-success' },
  { label: 'Absent 1', icon: 'ti ti-calendar-x', accent: 'badge-soft-danger' },
  { label: 'Leave 1', icon: 'ti ti-plane-departure', accent: 'badge-soft-warning' },
  { label: 'Late 2', icon: 'ti ti-clock', accent: 'badge-soft-info' },
];

export interface AttendanceEntry {
  date: string;
  checkIn: string;
  checkOut: string;
  status: string;
  statusClass: string;
}

export const attendanceRows: AttendanceEntry[] = [
  { date: '22 Jul 2026', checkIn: '08:12 AM', checkOut: '04:35 PM', status: 'Present', statusClass: 'badge-soft-success' },
  { date: '21 Jul 2026', checkIn: '08:40 AM', checkOut: '04:30 PM', status: 'Late', statusClass: 'badge-soft-info' },
  { date: '20 Jul 2026', checkIn: '—', checkOut: '—', status: 'Leave', statusClass: 'badge-soft-warning' },
  { date: '19 Jul 2026', checkIn: '08:05 AM', checkOut: '04:32 PM', status: 'Present', statusClass: 'badge-soft-success' },
];

/** The Performance Details dialog. */
export const performanceOverall = { label: 'Overall Rating', value: 'Exceeds Expectations', accent: 'badge-soft-success' };

export const performanceScores: { label: string; value: string }[] = [
  { label: 'Punctuality', value: '4.6 / 5' },
  { label: 'Collaboration', value: '4.4 / 5' },
  { label: 'Task Ownership', value: '4.7 / 5' },
  { label: 'Last Review', value: 'Q1 2026' },
];

export const performanceNote = 'Next performance review is due next quarter.';
