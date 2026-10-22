/** The two dialogs `teachers.html` ships after the page wrapper. */
export type TeacherModalId = 'delete' | 'import';

export interface SavedView {
  id: string;
  label: string;
  icon: string;
}

/** `data-cls-view` on the Saved Views menu, in template order. */
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

/** `data-cls-view` on the quick-filter rail. */
export const quickFilters: QuickFilter[] = [
  { id: 'Active', label: 'Active', icon: 'ti ti-user-check' },
  { id: 'Inactive', label: 'Inactive', icon: 'ti ti-user-off' },
];

export type SortKey = 'name' | 'subject' | 'recent';

/** `data-cls-sort` on the Sort menu; the template ships "recent" as active. */
export const sortOptions: { id: SortKey; label: string; icon: string }[] = [
  { id: 'name', label: 'Teacher name (A–Z)', icon: 'ti ti-abc' },
  { id: 'subject', label: 'Subject', icon: 'ti ti-book' },
  { id: 'recent', label: 'Recently updated', icon: 'ti ti-clock' },
];

/**
 * The four selects in the advanced filter panel. `id` is the template's own
 * `id` attribute, `key` its `data-filter` value — the chip rail labels itself
 * from `key`, exactly as the template's script did.
 */
export interface AdvancedFilter {
  id: string;
  key: string;
  label: string;
  options: string[];
}

export const advancedFilters: AdvancedFilter[] = [
  {
    id: 'class',
    key: 'Class',
    label: 'Class',
    options: ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'],
  },
  {
    id: 'subject',
    key: 'Subject',
    label: 'Subject',
    options: ['Physics', 'Maths', 'Chemistry', 'English', 'Biology', 'Computer', 'Economics', 'Finance'],
  },
  { id: 'status', key: 'Status', label: 'Status', options: ['Active', 'Inactive'] },
  { id: 'academic-year', key: 'Year', label: 'Academic Year', options: ['2024/2025', '2023/2024'] },
];

/** `.workspace-footer-size` — the template's rows-per-page choices. */
export const rowsPerPageOptions = [10, 25, 50, 100];

export interface MenuAction {
  id: string;
  label: string;
  icon: string;
}

/** The Export dropdown in the page header. */
export const exportActions: MenuAction[] = [
  { id: 'export_pdf', label: 'Export as PDF', icon: 'ti ti-file-type-pdf' },
  { id: 'export_excel', label: 'Export as Excel', icon: 'ti ti-file-type-xls' },
  { id: 'export_csv', label: 'Export as CSV', icon: 'ti ti-file-type-csv' },
  { id: 'print', label: 'Print', icon: 'ti ti-printer' },
];

/** The Bulk Actions dropdown in the page header (delete is a separate entry). */
export const bulkMenuActions: MenuAction[] = [
  { id: 'message', label: 'Send Message', icon: 'ti ti-message' },
  { id: 'email', label: 'Send Email', icon: 'ti ti-mail' },
  { id: 'assign_class', label: 'Assign Class', icon: 'ti ti-users-group' },
  { id: 'timetable', label: 'Timetable', icon: 'ti ti-table' },
];

/** The buttons inside the `.bulk-selection` bar, minus Delete. */
export const bulkBarActions: MenuAction[] = [
  { id: 'message', label: 'Message', icon: 'ti ti-message' },
  { id: 'email', label: 'Email', icon: 'ti ti-mail' },
  { id: 'assign_class', label: 'Assign Class', icon: 'ti ti-users-group' },
  { id: 'timetable', label: 'Timetable', icon: 'ti ti-table' },
  { id: 'export_csv', label: 'Export', icon: 'ti ti-download' },
  { id: 'print', label: 'Print', icon: 'ti ti-printer' },
];

/**
 * The messages `assets/js/teacher-grid-workspace.js` raised per `data-cls-action`,
 * kept so every menu entry the template shipped still gives feedback here.
 */
export const actionToasts: Record<string, string> = {
  refresh: 'Teacher list refreshed.',
  save_view: 'Current filters saved as a new view.',
  assign_class: 'Class assignment workspace opened for the selected teachers.',
  timetable: 'Timetable opened for the selected teachers.',
  message: 'Message composer opened for the selected teachers.',
  email: 'Email composer opened for the selected teachers.',
  print: 'Sending the teacher list to the printer…',
  export_csv: 'Preparing export…',
  export_excel: 'Excel workbook queued for download.',
  export_pdf: 'PDF export queued for download.',
  page: 'Loading the selected page…',
};

/** The ten accordion sections of the `#teacher_profile` offcanvas, in order. */
export interface ProfileSection {
  id: string;
  label: string;
  icon: string;
}

export const profileSections: ProfileSection[] = [
  { id: 'tp_info', label: 'Teacher Information', icon: 'ti ti-user-circle' },
  { id: 'tp_prof', label: 'Professional Details', icon: 'ti ti-briefcase' },
  { id: 'tp_classes', label: 'Assigned Classes', icon: 'ti ti-users-group' },
  { id: 'tp_subjects', label: 'Assigned Subjects', icon: 'ti ti-book' },
  { id: 'tp_contact', label: 'Contact Details', icon: 'ti ti-address-book' },
  { id: 'tp_qual', label: 'Qualifications', icon: 'ti ti-certificate' },
  { id: 'tp_exp', label: 'Experience', icon: 'ti ti-timeline' },
  { id: 'tp_att', label: 'Attendance Summary', icon: 'ti ti-calendar-check' },
  { id: 'tp_act', label: 'Recent Activities', icon: 'ti ti-activity' },
  { id: 'tp_docs', label: 'Uploaded Documents', icon: 'ti ti-files' },
];

/** Import modes offered by the `#teacher_import` dialog. */
export const importModes = [
  'Create new teachers',
  'Update existing by teacher ID',
  'Create and update',
];
