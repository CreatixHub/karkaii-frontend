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

/**
 * The grid now loads real applications from the API (see admissions.live.ts).
 * This stays exported (empty) so any older import keeps compiling.
 */
export const admissionRows: AdmissionRow[] = [];

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

/** Values are placeholders; the grid computes the real numbers from the API rows. */
export const summaryCards: SummaryCard[] = [
  { id: 'total', accent: 'bg-primary-transparent text-primary', icon: 'ti ti-file-description', value: '0', label: 'Total Applications' },
  { id: 'pending', accent: 'bg-warning-transparent text-warning', icon: 'ti ti-clock-hour-4', value: '0', label: 'Pending Review' },
  { id: 'review', accent: 'bg-info-transparent text-info', icon: 'ti ti-file-search', value: '0', label: 'Under Review' },
  { id: 'interviews', accent: 'bg-purple-transparent text-purple', icon: 'ti ti-calendar-event', value: '0', label: 'Interviews' },
  { id: 'feePending', accent: 'bg-danger-transparent text-danger', icon: 'ti ti-cash-off', value: '0', label: 'Fee Pending' },
  { id: 'approved', accent: 'bg-success-transparent text-success', icon: 'ti ti-circle-check', value: '0', label: 'Approved' },
  { id: 'enrolled', accent: 'bg-teal-transparent text-teal', icon: 'ti ti-user-check', value: '0', label: 'Enrolled' },
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
  { inputId: 'admission-status', key: 'status', fieldLabel: 'Admission Status', label: 'Status', options: ['Pending', 'Under Review', 'Approved', 'Rejected', 'Waitlisted', 'Enrolled'] },
  { inputId: 'class-applied', key: 'class', fieldLabel: 'Class Applied', label: 'Class', options: ['Class I', 'Class II', 'Class III', 'Class IV', 'Class V'] },
  { inputId: 'source-2', key: 'source', fieldLabel: 'Source', label: 'Source', options: ['Walk-in', 'Website', 'Referral', 'Other'] },
  { inputId: 'gender', key: 'gender', fieldLabel: 'Gender', label: 'Gender', options: ['Male', 'Female', 'Other'] },
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
  /** When true the row id is appended as `?id=` to `to`. */
  withId?: boolean;
  modal?: AdmissionModalId;
  action?: string;
  danger?: boolean;
  dividerBefore?: boolean;
}

export const rowMenu: RowMenuItem[] = [
  { label: 'View Application', icon: 'ti ti-eye', to: routes.admissionDetails, withId: true },
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