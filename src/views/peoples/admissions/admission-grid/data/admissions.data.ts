import { all_routes } from '@/routes/all_routes';

const routes = all_routes;

/* -------------------------------------------------------------------------- */
/*                                    Rows                                     */
/* -------------------------------------------------------------------------- */

export interface StatusTag {
  label: string;
  className: string;
}

export interface DocumentTag {
  label: string;
  className: string;
  icon: string;
}

export interface AdmissionDetail {
  gender: string;
  dob: string;
  classApplied: string;
  academicYear: string;
  source: string;
  parentName: string;
  relationship: string;
  mobile: string;
  email: string;
  address: string;
  status: StatusTag;
  interview: string;
  feeStatus: StatusTag;
  counselor: string;
  previousSchool: string;
  documents: DocumentTag[];
}

export interface AdmissionRow {
  id: string;
  name: string;
  avatar: string;
  admissionNo: string;
  gender: string;
  statusKey: string;
  status: StatusTag;
  classApplied: string;
  parentName: string;
  parentAvatar: string;
  parentPhone: string;
  appliedDate: string;
  source: string;
  /** The template's `data-search` haystack, kept verbatim. */
  search: string;
  detail: AdmissionDetail;
}

const documentBadges: DocumentTag[] = [
  { label: 'Photograph', className: 'badge badge-soft-success', icon: 'ti ti-circle-check' },
  { label: 'Birth Certificate', className: 'badge badge-soft-success', icon: 'ti ti-circle-check' },
  { label: 'Transfer Certificate', className: 'badge badge-soft-warning', icon: 'ti ti-clock' },
  { label: 'Community Certificate', className: 'badge badge-soft-warning', icon: 'ti ti-clock' },
  { label: 'Mark Sheets', className: 'badge badge-soft-success', icon: 'ti ti-circle-check' },
  { label: 'Address Proof', className: 'badge badge-soft-danger', icon: 'ti ti-alert-circle' },
];

export const admissionRows: AdmissionRow[] = [
  {
    id: 'ADM202501',
    name: 'Aaralyn Maria',
    avatar: 'assets/img/students/student-01.jpg',
    admissionNo: 'ADM202501',
    gender: 'Female',
    statusKey: 'pending',
    status: { label: 'Pending', className: 'is-pending' },
    classApplied: 'Class I',
    parentName: 'Antony Maria',
    parentAvatar: 'assets/img/profiles/avatar-27.jpg',
    parentPhone: '+1 65465 21345',
    appliedDate: '02 Jul 2026',
    source: 'Website',
    search: 'aaralyn maria adm202501 class i antony maria pending +1 65465 21345 website',
    detail: {
      gender: 'Female',
      dob: '10 Jan 2018',
      classApplied: 'Class I',
      academicYear: '2024/2025',
      source: 'Website',
      parentName: 'Antony Maria',
      relationship: 'Father',
      mobile: '+1 65465 21345',
      email: 'antony@example.com',
      address: '24 Maple Street, Springfield, IL',
      status: { label: 'Pending', className: 'badge-soft-primary' },
      interview: 'Not Scheduled',
      feeStatus: { label: 'Unpaid', className: 'badge-soft-danger' },
      counselor: 'Teena Mathew',
      previousSchool: 'Little Angels Pre-School',
      documents: documentBadges,
    },
  },
  {
    id: 'ADM202502',
    name: 'Ethan Cole',
    avatar: 'assets/img/students/student-02.jpg',
    admissionNo: 'ADM202502',
    gender: 'Male',
    statusKey: 'review',
    status: { label: 'Under Review', className: 'is-review' },
    classApplied: 'Class II',
    parentName: 'Robert Cole',
    parentAvatar: 'assets/img/profiles/avatar-23.jpg',
    parentPhone: '+1 65465 87456',
    appliedDate: '28 Jun 2026',
    source: 'Referral',
    search: 'ethan cole adm202502 class ii robert cole under review +1 65465 87456 referral',
    detail: {
      gender: 'Male',
      dob: '22 Mar 2017',
      classApplied: 'Class II',
      academicYear: '2024/2025',
      source: 'Referral',
      parentName: 'Robert Cole',
      relationship: 'Father',
      mobile: '+1 65465 87456',
      email: 'robert@example.com',
      address: '118 Oak Avenue, Riverside, CA',
      status: { label: 'Under Review', className: 'badge-soft-primary' },
      interview: '28 Jul 2026',
      feeStatus: { label: 'Partial', className: 'badge-soft-warning' },
      counselor: 'Daniel Josua',
      previousSchool: 'Sunrise Public School',
      documents: documentBadges,
    },
  },
  {
    id: 'ADM202503',
    name: 'Sophia Reyes',
    avatar: 'assets/img/students/student-03.jpg',
    admissionNo: 'ADM202503',
    gender: 'Female',
    statusKey: 'approved',
    status: { label: 'Approved', className: 'is-active' },
    classApplied: 'Class III',
    parentName: 'Marcus Reyes',
    parentAvatar: 'assets/img/profiles/avatar-25.jpg',
    parentPhone: '+1 65465 99001',
    appliedDate: '20 Jun 2026',
    source: 'Walk-in',
    search: 'sophia reyes adm202503 class iii marcus reyes approved +1 65465 99001 walk-in',
    detail: {
      gender: 'Female',
      dob: '05 Sep 2016',
      classApplied: 'Class III',
      academicYear: '2024/2025',
      source: 'Walk-in',
      parentName: 'Marcus Reyes',
      relationship: 'Father',
      mobile: '+1 65465 99001',
      email: 'marcus@example.com',
      address: '76 Pine Road, Austin, TX',
      status: { label: 'Approved', className: 'badge-soft-success' },
      interview: '12 Jul 2026',
      feeStatus: { label: 'Paid', className: 'badge-soft-success' },
      counselor: 'Hellana Robert',
      previousSchool: 'Green Valley Academy',
      documents: documentBadges,
    },
  },
  {
    id: 'ADM202504',
    name: 'Liam Walker',
    avatar: 'assets/img/students/student-04.jpg',
    admissionNo: 'ADM202504',
    gender: 'Male',
    statusKey: 'rejected',
    status: { label: 'Rejected', className: 'is-blocked' },
    classApplied: 'Class IV',
    parentName: 'George Walker',
    parentAvatar: 'assets/img/profiles/avatar-01.jpg',
    parentPhone: '+1 65465 33221',
    appliedDate: '15 Jun 2026',
    source: 'Campaign',
    search: 'liam walker adm202504 class iv george walker rejected +1 65465 33221 campaign',
    detail: {
      gender: 'Male',
      dob: '14 Dec 2015',
      classApplied: 'Class IV',
      academicYear: '2024/2025',
      source: 'Campaign',
      parentName: 'George Walker',
      relationship: 'Father',
      mobile: '+1 65465 33221',
      email: 'george@example.com',
      address: '9 Birch Lane, Denver, CO',
      status: { label: 'Rejected', className: 'badge-soft-primary' },
      interview: 'No-Show',
      feeStatus: { label: 'Refunded', className: 'badge-soft-secondary' },
      counselor: 'Teena Mathew',
      previousSchool: 'St. Mary High School',
      documents: documentBadges,
    },
  },
  {
    id: 'ADM202505',
    name: 'Mia Bennett',
    avatar: 'assets/img/students/student-05.jpg',
    admissionNo: 'ADM202505',
    gender: 'Female',
    statusKey: 'waitlisted',
    status: { label: 'Waitlisted', className: 'is-new' },
    classApplied: 'Class II',
    parentName: 'Steven Bennett',
    parentAvatar: 'assets/img/profiles/avatar-02.jpg',
    parentPhone: '+1 65465 55667',
    appliedDate: '10 Jun 2026',
    source: 'Website',
    search: 'mia bennett adm202505 class ii steven bennett waitlisted +1 65465 55667 website',
    detail: {
      gender: 'Female',
      dob: '30 Apr 2017',
      classApplied: 'Class II',
      academicYear: '2024/2025',
      source: 'Website',
      parentName: 'Steven Bennett',
      relationship: 'Father',
      mobile: '+1 65465 55667',
      email: 'steven@example.com',
      address: '212 Cedar Court, Seattle, WA',
      status: { label: 'Waitlisted', className: 'badge-soft-primary' },
      interview: '30 Jul 2026',
      feeStatus: { label: 'Unpaid', className: 'badge-soft-danger' },
      counselor: 'Daniel Josua',
      previousSchool: 'Bright Kids School',
      documents: documentBadges,
    },
  },
  {
    id: 'ADM202506',
    name: 'Noah Diaz',
    avatar: 'assets/img/students/student-06.jpg',
    admissionNo: 'ADM202506',
    gender: 'Male',
    statusKey: 'enrolled',
    status: { label: 'Enrolled', className: 'is-completed' },
    classApplied: 'Class I',
    parentName: 'Patricia Diaz',
    parentAvatar: 'assets/img/profiles/avatar-03.jpg',
    parentPhone: '+1 65465 77882',
    appliedDate: '05 Jun 2026',
    source: 'Referral',
    search: 'noah diaz adm202506 class i patricia diaz enrolled +1 65465 77882 referral',
    detail: {
      gender: 'Male',
      dob: '18 Feb 2018',
      classApplied: 'Class I',
      academicYear: '2024/2025',
      source: 'Referral',
      parentName: 'Patricia Diaz',
      relationship: 'Father',
      mobile: '+1 65465 77882',
      email: 'patricia@example.com',
      address: '45 Elm Street, Portland, OR',
      status: { label: 'Enrolled', className: 'badge-soft-success' },
      interview: '05 Jul 2026',
      feeStatus: { label: 'Paid', className: 'badge-soft-success' },
      counselor: 'Hellana Robert',
      previousSchool: 'Happy Hearts Kinder',
      documents: documentBadges,
    },
  },
];

/* -------------------------------------------------------------------------- */
/*                            Summary analytics cards                          */
/* -------------------------------------------------------------------------- */

export interface SummaryCard {
  id: string;
  accent: string;
  icon: string;
  value: string;
  label: string;
}

export const summaryCards: SummaryCard[] = [
  { id: 'total', accent: 'bg-primary-transparent text-primary', icon: 'ti ti-file-description', value: '3,654', label: 'Total Applications' },
  { id: 'pending', accent: 'bg-warning-transparent text-warning', icon: 'ti ti-clock-hour-4', value: '218', label: 'Pending Review' },
  { id: 'review', accent: 'bg-info-transparent text-info', icon: 'ti ti-file-search', value: '142', label: 'Under Review' },
  { id: 'interviews', accent: 'bg-purple-transparent text-purple', icon: 'ti ti-calendar-event', value: '96', label: 'Interviews' },
  { id: 'feePending', accent: 'bg-danger-transparent text-danger', icon: 'ti ti-cash-off', value: '74', label: 'Fee Pending' },
  { id: 'approved', accent: 'bg-success-transparent text-success', icon: 'ti ti-circle-check', value: '2,845', label: 'Approved' },
  { id: 'enrolled', accent: 'bg-teal-transparent text-teal', icon: 'ti ti-user-check', value: '2,613', label: 'Enrolled' },
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
  { id: 'all', label: 'All Applications', icon: 'ti ti-layout-list' },
  { id: 'pending', label: 'Pending Review', icon: 'ti ti-clock-hour-4' },
  { id: 'review', label: 'Under Review', icon: 'ti ti-file-search' },
  { id: 'approved', label: 'Approved', icon: 'ti ti-circle-check' },
  { id: 'waitlisted', label: 'Waitlisted', icon: 'ti ti-hourglass' },
];

export const quickFilters: SavedView[] = [
  { id: 'pending', label: 'Pending', icon: 'ti ti-clock-hour-4' },
  { id: 'review', label: 'Under Review', icon: 'ti ti-file-search' },
  { id: 'approved', label: 'Approved', icon: 'ti ti-circle-check' },
  { id: 'waitlisted', label: 'Waitlisted', icon: 'ti ti-hourglass' },
  { id: 'rejected', label: 'Rejected', icon: 'ti ti-circle-x' },
];

export type FilterKey = 'year' | 'status' | 'class' | 'interview' | 'payment' | 'source' | 'counselor' | 'gender';

export interface AdvancedFilter {
  inputId: string;
  key: FilterKey;
  fieldLabel: string;
  label: string;
  options: string[];
}

export const advancedFilters: AdvancedFilter[] = [
  { inputId: 'academic-year', key: 'year', fieldLabel: 'Academic Year', label: 'Year', options: ['2024/2025', '2023/2024'] },
  { inputId: 'admission-status', key: 'status', fieldLabel: 'Admission Status', label: 'Status', options: ['Pending', 'Under Review', 'Approved', 'Rejected', 'Waitlisted', 'Enrolled'] },
  { inputId: 'class-applied', key: 'class', fieldLabel: 'Class Applied', label: 'Class', options: ['Class I', 'Class II', 'Class III', 'Class IV'] },
  { inputId: 'interview', key: 'interview', fieldLabel: 'Interview', label: 'Interview', options: ['Not Scheduled', 'Scheduled', 'Completed', 'No-Show'] },
  { inputId: 'payment', key: 'payment', fieldLabel: 'Payment', label: 'Payment', options: ['Unpaid', 'Partial', 'Paid'] },
  { inputId: 'source-2', key: 'source', fieldLabel: 'Source', label: 'Source', options: ['Walk-in', 'Website', 'Referral', 'Campaign'] },
  { inputId: 'counselor', key: 'counselor', fieldLabel: 'Counselor', label: 'Counselor', options: ['Teena Mathew', 'Daniel Josua', 'Hellana Robert'] },
  { inputId: 'gender', key: 'gender', fieldLabel: 'Gender', label: 'Gender', options: ['Male', 'Female'] },
];

export type ColumnId = 'applicant' | 'status' | 'class' | 'parent' | 'applied';

export interface ColumnDef {
  id: ColumnId;
  label: string;
}

export const columnDefs: ColumnDef[] = [
  { id: 'applicant', label: 'Applicant' },
  { id: 'status', label: 'Status' },
  { id: 'class', label: 'Class Applied' },
  { id: 'parent', label: 'Parent' },
  { id: 'applied', label: 'Applied Date' },
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

export type SortKey = 'name' | 'status' | 'class' | 'parent' | 'recent';

export interface SortOption {
  id: SortKey;
  label: string;
  icon: string;
}

export const sortOptions: SortOption[] = [
  { id: 'name', label: 'Applicant name (A–Z)', icon: 'ti ti-abc' },
  { id: 'status', label: 'Status', icon: 'ti ti-flag' },
  { id: 'class', label: 'Class applied', icon: 'ti ti-category' },
  { id: 'parent', label: 'Parent name', icon: 'ti ti-user' },
  { id: 'recent', label: 'Recently updated', icon: 'ti ti-clock' },
];

/** Column headers, in template order; `sort` doubles as the `data-adm-sort` key. */
export const tableHeaders: { id: ColumnId; label: string; sort: SortKey }[] = [
  { id: 'applicant', label: 'Applicant', sort: 'name' },
  { id: 'status', label: 'Status', sort: 'status' },
  { id: 'class', label: 'Class Applied', sort: 'class' },
  { id: 'parent', label: 'Parent', sort: 'parent' },
  { id: 'applied', label: 'Applied Date', sort: 'recent' },
];

export const exportActions: { id: string; label: string; icon: string }[] = [
  { id: 'export_pdf', label: 'Export as PDF', icon: 'ti ti-file-type-pdf' },
  { id: 'export_excel', label: 'Export as Excel', icon: 'ti ti-file-type-xls' },
  { id: 'export_csv', label: 'Export as CSV', icon: 'ti ti-file-type-csv' },
  { id: 'print', label: 'Print', icon: 'ti ti-printer' },
];

export const pageSizes = ['10', '25', '50', '100'];

/* -------------------------------------------------------------------------- */
/*                                Row / bulk menus                             */
/* -------------------------------------------------------------------------- */

/** The dialogs shipped with `admissions.html`. */
export type AdmissionModalId =
  | 'newAdmission'
  | 'documentVerification'
  | 'admissionLetter'
  | 'communicationHistory'
  | 'collectFees'
  | 'rejectApplication'
  | 'waitlistApplication'
  | 'scheduleInterview'
  | 'assignStaff'
  | 'sendEmail'
  | 'sendSms'
  | 'importApplications'
  | 'delete';

export interface RowMenuItem {
  label: string;
  icon: string;
  to?: string;
  modal?: AdmissionModalId;
  action?: string;
  danger?: boolean;
  dividerBefore?: boolean;
}

export const rowMenu: RowMenuItem[] = [
  { label: 'View Application', icon: 'ti ti-eye', to: routes.admissionDetails },
  { label: 'Edit Application', icon: 'ti ti-edit', to: routes.addAdmission },
  { label: 'Verify Documents', icon: 'ti ti-file-check', modal: 'documentVerification' },
  { label: 'Schedule Interview', icon: 'ti ti-calendar-event', modal: 'scheduleInterview' },
  { label: 'Approve Admission', icon: 'ti ti-check', action: 'approve' },
  { label: 'Reject Application', icon: 'ti ti-x', modal: 'rejectApplication' },
  { label: 'Move to Waitlist', icon: 'ti ti-hourglass', modal: 'waitlistApplication' },
  { label: 'Admission Letter', icon: 'ti ti-file-text', modal: 'admissionLetter' },
  { label: 'Collect Fee', icon: 'ti ti-cash', modal: 'collectFees' },
  { label: 'Student Profile', icon: 'ti ti-user-circle', to: routes.studentDetail },
  { label: 'Communication', icon: 'ti ti-history', modal: 'communicationHistory' },
  { label: 'Duplicate', icon: 'ti ti-copy', action: 'duplicate', dividerBefore: true },
  { label: 'Print', icon: 'ti ti-printer', action: 'print' },
  { label: 'Archive', icon: 'ti ti-archive', action: 'archive' },
  { label: 'Delete', icon: 'ti ti-trash-x', modal: 'delete', danger: true },
];

export interface BulkAction {
  label: string;
  icon: string;
  modal?: AdmissionModalId;
  action?: string;
  danger?: boolean;
}

export const bulkActions: BulkAction[] = [
  { label: 'Approve', icon: 'ti ti-check', action: 'approve' },
  { label: 'Assign Counselor', icon: 'ti ti-user-plus', modal: 'assignStaff' },
  { label: 'Schedule Interviews', icon: 'ti ti-calendar-plus', modal: 'scheduleInterview' },
  { label: 'Email', icon: 'ti ti-mail', modal: 'sendEmail' },
  { label: 'Send SMS', icon: 'ti ti-message', modal: 'sendSms' },
  { label: 'Export', icon: 'ti ti-download', action: 'export_csv' },
  { label: 'Print', icon: 'ti ti-printer', action: 'print' },
  { label: 'Archive', icon: 'ti ti-archive', action: 'archive' },
  { label: 'Delete', icon: 'ti ti-trash', modal: 'delete', danger: true },
];

/**
 * `admissions.js` toast copy, keyed by `data-adm-action`. Actions absent from
 * the registry raise no toast, exactly as the engine does.
 */
export const actionToasts: Record<string, { message: string; variant: 'success' | 'info' }> = {
  refresh: { message: 'Application list refreshed.', variant: 'success' },
  save_view: { message: 'Current filters saved as a new view.', variant: 'success' },
  duplicate: { message: 'Application duplicated as a draft.', variant: 'success' },
  approve: { message: 'Selected applications approved.', variant: 'success' },
  print: { message: 'Sending the application list to the printer…', variant: 'info' },
  archive: { message: 'Selected applications archived.', variant: 'success' },
  export_excel: { message: 'Excel workbook queued for download.', variant: 'info' },
  export_pdf: { message: 'PDF export queued for download.', variant: 'info' },
  export_csv: { message: 'Preparing export…', variant: 'info' },
  page: { message: 'Loading the selected page…', variant: 'info' },
};
