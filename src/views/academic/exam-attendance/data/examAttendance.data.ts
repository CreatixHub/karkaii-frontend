import type { ToastVariant } from '@hooks/useToasts';

export type AttendanceStatus =
  | 'Present'
  | 'Absent'
  | 'Late'
  | 'Medical Leave'
  | 'Excused'
  | 'Under Review';

/** The verification badge in the Attendance column, and in the detail panel. */
export type VerificationStatus = 'Verified' | 'Pending' | 'Under Review';

export type ColumnId = 'student' | 'exam' | 'attendance' | 'status';

export type DensityId = 'compact' | 'default' | 'comfortable';

export type FilterKey =
  | 'year'
  | 'exam'
  | 'subject'
  | 'class'
  | 'section'
  | 'hall'
  | 'invigilator'
  | 'status'
  | 'date';

export type SortKey = 'name' | 'roll' | 'checkin' | 'date' | 'status' | 'recent';

export type ToolbarMenu = 'views' | 'filters' | 'columns' | 'sort' | null;

/**
 * The template ships `add_attendance`, `edit_attendance`, `view_attendance`,
 * `attendance_import` and `delete-modal`; normalised to one clean union.
 */
export type AttendanceModalId = 'add' | 'edit' | 'view' | 'import' | 'delete';

export interface AttendanceBadge {
  label: string;
  badge: string;
  icon: string;
}

export interface AttendanceRow {
  /** Admission number — unique per record, so it is the row key. */
  id: string;
  name: string;
  avatar: string;
  admissionNo: string;
  roll: number;
  className: string;
  section: string;
  exam: string;
  subject: string;
  /** Rendered date, e.g. "13 May 2024". */
  date: string;
  /** Parsed `date`; the engine's Exam Date sort ran through `new Date(...)` too. */
  timestamp: number;
  /** Academic session, derived from `date`. See the file header. */
  year: string;
  hall: string;
  seat: string;
  invigilator: { name: string; avatar: string };
  /** "—" on the rows that never checked in. */
  checkin: string;
  verification: VerificationStatus;
  /** The extra "Late Entry" badge the two late arrivals carry. */
  lateEntry: boolean;
  remarks: string;
  guardian: { name: string; phone: string };
  attachments: AttendanceBadge[];
  status: AttendanceStatus;
  pillClass: string;
  /** Present is the only status drawn with a dot instead of an icon. */
  pillIcon: string | null;
  /** The template's `data-search` haystack, verbatim. */
  search: string;
}

const PILLS: Record<AttendanceStatus, { pillClass: string; pillIcon: string | null }> = {
  Present: { pillClass: 'is-active', pillIcon: null },
  Absent: { pillClass: 'is-emergency', pillIcon: 'ti ti-x' },
  Late: { pillClass: 'is-pending', pillIcon: 'ti ti-clock-exclamation' },
  'Medical Leave': { pillClass: 'is-new', pillIcon: 'ti ti-heartbeat' },
  Excused: { pillClass: 'is-archived', pillIcon: 'ti ti-shield-check' },
  'Under Review': { pillClass: 'is-exam', pillIcon: 'ti ti-loader' },
};

/** Marking a record from the bulk bar or a row menu swaps its pill along with its status. */
export const statusPill = (status: AttendanceStatus) => PILLS[status];

export const verificationBadges: Record<VerificationStatus, AttendanceBadge> = {
  Verified: { label: 'Verified', badge: 'badge-soft-success', icon: 'ti ti-discount' },
  Pending: { label: 'Pending', badge: 'badge-soft-secondary', icon: 'ti ti-clock' },
  'Under Review': { label: 'Under Review', badge: 'badge-soft-info', icon: 'ti ti-loader' },
};

/** Nine of the ten records carry the same pair of attachment chips. */
const DEFAULT_ATTACHMENTS: AttendanceBadge[] = [
  { label: 'None', badge: 'badge-soft-secondary', icon: 'ti ti-file-off' },
  { label: 'Signature.png', badge: 'badge-soft-info', icon: 'ti ti-signature' },
];

const MEDICAL_ATTACHMENTS: AttendanceBadge[] = [
  { label: 'Medical.pdf', badge: 'badge-soft-primary', icon: 'ti ti-file-type-pdf' },
  { label: 'Signature.png', badge: 'badge-soft-info', icon: 'ti ti-signature' },
];

/** A school session opens in July, so anything before it belongs to the previous one. */
const sessionOf = (timestamp: number): string => {
  const when = new Date(timestamp);
  const start = when.getMonth() >= 6 ? when.getFullYear() : when.getFullYear() - 1;
  return `${start}/${start + 1}`;
};

interface RowInput {
  name: string;
  studentNo: string;
  admissionNo: string;
  roll: number;
  className: string;
  section: string;
  exam: string;
  subject: string;
  date: string;
  hall: string;
  seat: string;
  invigilator: string;
  invigilatorNo: string;
  checkin: string;
  verification: VerificationStatus;
  lateEntry?: boolean;
  remarks: string;
  guardian: string;
  phone: string;
  medical?: boolean;
  status: AttendanceStatus;
  search: string;
}

const row = (input: RowInput): AttendanceRow => {
  const timestamp = Date.parse(input.date);

  return {
    id: input.admissionNo,
    name: input.name,
    avatar: `assets/img/students/student-${input.studentNo}.jpg`,
    admissionNo: input.admissionNo,
    roll: input.roll,
    className: input.className,
    section: input.section,
    exam: input.exam,
    subject: input.subject,
    date: input.date,
    timestamp,
    year: sessionOf(timestamp),
    hall: input.hall,
    seat: input.seat,
    invigilator: {
      name: input.invigilator,
      avatar: `assets/img/teachers/teacher-${input.invigilatorNo}.jpg`,
    },
    checkin: input.checkin,
    verification: input.verification,
    lateEntry: input.lateEntry ?? false,
    remarks: input.remarks,
    guardian: { name: input.guardian, phone: input.phone },
    attachments: input.medical ? MEDICAL_ATTACHMENTS : DEFAULT_ATTACHMENTS,
    status: input.status,
    ...PILLS[input.status],
    search: input.search,
  };
};

export const attendanceRows: AttendanceRow[] = [
  row({
    name: 'Janet Daniel', studentNo: '01', admissionNo: 'AD202401', roll: 12,
    className: 'X', section: 'A', exam: 'Midterm Examination', subject: 'Mathematics',
    date: '13 May 2024', hall: 'Hall A · Room 204', seat: 'A-14',
    invigilator: 'Erickson', invigilatorNo: '01', checkin: '09:22 AM',
    verification: 'Verified', remarks: 'On time.',
    guardian: 'Daniel Josef', phone: '+1 546 8548 623', status: 'Present',
    search: 'janet daniel ad202401 class x sec a roll 12 midterm examination mathematics hall a · room 204 a-14 erickson present 13 may 2024',
  }),
  row({
    name: 'Joann Michael', studentNo: '02', admissionNo: 'AD202402', roll: 13,
    className: 'X', section: 'A', exam: 'Midterm Examination', subject: 'Mathematics',
    date: '13 May 2024', hall: 'Hall A · Room 204', seat: 'A-15',
    invigilator: 'Erickson', invigilatorNo: '01', checkin: '09:41 AM',
    verification: 'Verified', lateEntry: true, remarks: 'Arrived 11 min late — traffic.',
    guardian: 'Michael Ross', phone: '+1 456 4568 748', status: 'Late',
    search: 'joann michael ad202402 class x sec a roll 13 midterm examination mathematics hall a · room 204 a-15 erickson late 13 may 2024',
  }),
  row({
    name: 'Kathleen Nolan', studentNo: '03', admissionNo: 'AD202403', roll: 8,
    className: 'IX', section: 'B', exam: 'Unit Test 3', subject: 'English',
    date: '09 May 2024', hall: 'Room 108', seat: 'C-04',
    invigilator: 'Teresa', invigilatorNo: '05', checkin: '—',
    verification: 'Pending', remarks: 'Did not report to the hall.',
    guardian: 'Nolan Pete', phone: '+1 549 5486 214', status: 'Absent',
    search: 'kathleen nolan ad202403 class ix sec b roll 8 unit test 3 english room 108 c-04 teresa absent 09 may 2024',
  }),
  row({
    name: 'Gifford Ramsey', studentNo: '04', admissionNo: 'AD202404', roll: 21,
    className: 'XII', section: 'A', exam: 'Final Examination', subject: 'Physics',
    date: '18 Jul 2024', hall: 'Hall B · Room 301', seat: 'B-09',
    invigilator: 'James', invigilatorNo: '04', checkin: '—',
    verification: 'Verified', remarks: 'Medical certificate submitted.',
    guardian: 'Ramsey Lee', phone: '+1 246 5464 447', medical: true, status: 'Medical Leave',
    search: 'gifford ramsey ad202404 class xii sec a roll 21 final examination physics hall b · room 301 b-09 james medical leave 18 jul 2024',
  }),
  row({
    name: 'Lisa Gourley', studentNo: '05', admissionNo: 'AD202405', roll: 5,
    className: 'XII', section: 'C', exam: 'Practical Examination', subject: 'Biology',
    date: '07 May 2024', hall: 'Lab 2', seat: 'L-02',
    invigilator: 'Joseph', invigilatorNo: '03', checkin: '08:57 AM',
    verification: 'Verified', remarks: 'Present for practical.',
    guardian: 'Gourley Amritraj', phone: '+1 594 5484 478', status: 'Present',
    search: 'lisa gourley ad202405 class xii sec c roll 5 practical examination biology lab 2 l-02 joseph present 07 may 2024',
  }),
  row({
    name: 'Ralph Claudia', studentNo: '06', admissionNo: 'AD202406', roll: 17,
    className: 'XI', section: 'A', exam: 'Chapter Test — Acids & Bases', subject: 'Chemistry',
    date: '20 May 2024', hall: 'Room 210', seat: 'D-11',
    invigilator: 'Hendrita', invigilatorNo: '06', checkin: '11:00 AM',
    verification: 'Under Review', remarks: 'Identity verification pending.',
    guardian: 'Claudia Puig', phone: '+1 654 6544 877', status: 'Under Review',
    search: 'ralph claudia ad202406 class xi sec a roll 17 chapter test — acids & bases chemistry room 210 d-11 hendrita under review 20 may 2024',
  }),
  row({
    name: 'Julie Scott', studentNo: '07', admissionNo: 'AD202407', roll: 3,
    className: 'VIII', section: 'B', exam: 'Half Yearly Examination', subject: 'Geography',
    date: '15 Nov 2024', hall: 'Hall A', seat: 'A-31',
    invigilator: 'Jacquelin', invigilatorNo: '07', checkin: '09:35 AM',
    verification: 'Verified', remarks: 'Prior permission for late start.',
    guardian: 'Scott Wagner', phone: '+1 321 6544 784', status: 'Excused',
    search: 'julie scott ad202407 class viii sec b roll 3 half yearly examination geography hall a a-31 jacquelin excused 15 nov 2024',
  }),
  row({
    name: 'Hellen Warner', studentNo: '08', admissionNo: 'AD202408', roll: 9,
    className: 'XI', section: 'A', exam: 'Annual Examination', subject: 'Economics',
    date: '10 Mar 2025', hall: 'Hall C', seat: 'C-22',
    invigilator: 'Ramsey', invigilatorNo: '08', checkin: '09:58 AM',
    verification: 'Verified', remarks: 'On time.',
    guardian: 'Warner Gonzalez', phone: '+1 236 6521 452', status: 'Present',
    search: 'hellen warner ad202408 class xi sec a roll 9 annual examination economics hall c c-22 ramsey present 10 mar 2025',
  }),
  row({
    name: 'Andrew Fischer', studentNo: '09', admissionNo: 'AD202409', roll: 14,
    className: 'X', section: 'A', exam: 'Quarterly Examination', subject: 'Computer Science',
    date: '26 Aug 2024', hall: 'Lab 1', seat: 'L-08',
    invigilator: 'Mori', invigilatorNo: '02', checkin: '09:12 AM',
    verification: 'Verified', lateEntry: true, remarks: 'Arrived 12 min late — bus delay.',
    guardian: 'Fischer Reid', phone: '+1 442 6587 512', status: 'Late',
    search: 'andrew fischer ad202409 class x sec a roll 14 quarterly examination computer science lab 1 l-08 mori late 26 aug 2024',
  }),
  row({
    name: 'Karen Robinson', studentNo: '10', admissionNo: 'AD202410', roll: 6,
    className: 'VII', section: 'B', exam: 'Oral Test — Civilisations', subject: 'History',
    date: '03 Jul 2024', hall: 'Room 115', seat: 'E-03',
    invigilator: 'Morgan', invigilatorNo: '10', checkin: '—',
    verification: 'Pending', remarks: 'Awaiting invigilator confirmation.',
    guardian: 'Robinson Blythe', phone: '+1 558 6521 447', status: 'Absent',
    search: 'karen robinson ad202410 class vii sec b roll 6 oral test — civilisations history room 115 e-03 morgan absent 03 jul 2024',
  }),
];

/* -------------------------------------------------------------------------- */
/*                       Copy the detail panel composes                       */
/* -------------------------------------------------------------------------- */

export const hallSummary = (record: AttendanceRow) =>
  `${record.hall} · Seat ${record.seat} · ${record.exam} (${record.subject}) on ${record.date}.`;

/** The template printed the same history line under every row. */
export const attendanceHistory = 'Present in 8 of the last 10 exams · 1 late · 1 absence recorded.';

export const invigilatorNote = (record: AttendanceRow) =>
  `${record.invigilator.name}: ${record.remarks}`;

/** The check-in chip turns red once a record has no arrival time at all. */
export const checkinBadge = (record: AttendanceRow): AttendanceBadge =>
  record.checkin === '—'
    ? { label: 'No check-in', badge: 'badge-soft-danger', icon: 'ti ti-login-2' }
    : { label: record.checkin, badge: 'badge-soft-secondary', icon: 'ti ti-login-2' };

/* -------------------------------------------------------------------------- */
/*                                  Toolbar                                   */
/* -------------------------------------------------------------------------- */

export interface SavedView {
  id: string;
  label: string;
  icon: string;
}

export const savedViews: SavedView[] = [
  { id: 'all', label: 'All Records', icon: 'ti ti-layout-list' },
  { id: 'Present', label: 'Present', icon: 'ti ti-user-check' },
  { id: 'Absent', label: 'Absent', icon: 'ti ti-user-x' },
  { id: 'Late', label: 'Late', icon: 'ti ti-clock-exclamation' },
  { id: 'Medical Leave', label: 'Medical Leave', icon: 'ti ti-heartbeat' },
  { id: 'Under Review', label: 'Under Review', icon: 'ti ti-loader' },
];

/** The quick bar abbreviates Medical Leave to "Medical"; the ids still match. */
export const quickFilters: SavedView[] = [
  { id: 'Present', label: 'Present', icon: 'ti ti-user-check' },
  { id: 'Absent', label: 'Absent', icon: 'ti ti-user-x' },
  { id: 'Late', label: 'Late', icon: 'ti ti-clock-exclamation' },
  { id: 'Medical Leave', label: 'Medical', icon: 'ti ti-heartbeat' },
  { id: 'Under Review', label: 'Under Review', icon: 'ti ti-loader' },
];

export interface FilterOption {
  value: string;
  label: string;
}

export interface FilterField {
  key: FilterKey;
  /** Used on the chip, and it is the `data-filter` value the engine read. */
  label: string;
  panelLabel: string;
  domId: string;
  /** Exam Date spans the whole row in the filter panel. */
  wide?: boolean;
  /** Exam Date's neutral option reads "Any date" rather than "All". */
  allLabel?: string;
  options: FilterOption[];
}

const plain = (values: string[]): FilterOption[] => values.map((value) => ({ value, label: value }));

export const advancedFilters: FilterField[] = [
  {
    key: 'year',
    label: 'Year',
    panelLabel: 'Academic Year',
    domId: 'ea-academic-year',
    options: plain(['2024/2025', '2023/2024']),
  },
  {
    key: 'exam',
    label: 'Exam',
    panelLabel: 'Exam',
    domId: 'ea-exam',
    options: plain([
      'Midterm Examination',
      'Unit Test 3',
      'Final Examination',
      'Practical Examination',
      'Chapter Test — Acids & Bases',
      'Half Yearly Examination',
      'Annual Examination',
      'Quarterly Examination',
      'Oral Test — Civilisations',
    ]),
  },
  {
    key: 'subject',
    label: 'Subject',
    panelLabel: 'Subject',
    domId: 'ea-subject',
    options: plain([
      'Mathematics',
      'English',
      'Physics',
      'Biology',
      'Chemistry',
      'Geography',
      'Economics',
      'Computer Science',
      'History',
    ]),
  },
  {
    key: 'class',
    label: 'Class',
    panelLabel: 'Class',
    domId: 'ea-class',
    options: [
      { value: 'class x', label: 'X' },
      { value: 'class ix', label: 'IX' },
      { value: 'class xii', label: 'XII' },
      { value: 'class xi', label: 'XI' },
      { value: 'class viii', label: 'VIII' },
      { value: 'class vii', label: 'VII' },
    ],
  },
  {
    key: 'section',
    label: 'Section',
    panelLabel: 'Section',
    domId: 'ea-section',
    options: [
      { value: 'sec a', label: 'A' },
      { value: 'sec b', label: 'B' },
      { value: 'sec c', label: 'C' },
    ],
  },
  {
    key: 'hall',
    label: 'Hall',
    panelLabel: 'Exam Hall',
    domId: 'ea-exam-hall',
    options: plain([
      'Hall A · Room 204',
      'Room 108',
      'Hall B · Room 301',
      'Lab 2',
      'Room 210',
      'Hall A',
      'Hall C',
      'Lab 1',
      'Room 115',
    ]),
  },
  {
    key: 'invigilator',
    label: 'Invigilator',
    panelLabel: 'Invigilator',
    domId: 'ea-invigilator',
    options: plain([
      'Erickson',
      'Teresa',
      'James',
      'Joseph',
      'Hendrita',
      'Jacquelin',
      'Ramsey',
      'Mori',
      'Morgan',
    ]),
  },
  {
    key: 'status',
    label: 'Status',
    panelLabel: 'Attendance Status',
    domId: 'ea-attendance-status',
    options: plain(['Present', 'Absent', 'Late', 'Medical Leave', 'Excused', 'Under Review']),
  },
  {
    key: 'date',
    label: 'Date',
    panelLabel: 'Exam Date',
    domId: 'ea-exam-date',
    wide: true,
    allLabel: 'Any date',
    options: plain([
      '13 May 2024',
      '09 May 2024',
      '18 Jul 2024',
      '07 May 2024',
      '20 May 2024',
      '15 Nov 2024',
      '10 Mar 2025',
      '26 Aug 2024',
      '03 Jul 2024',
    ]),
  },
];

export const columnDefs: { id: ColumnId; label: string }[] = [
  { id: 'student', label: 'Student' },
  { id: 'exam', label: 'Exam Details' },
  { id: 'attendance', label: 'Attendance' },
  { id: 'status', label: 'Status' },
];

export const allColumns: Record<ColumnId, boolean> = {
  student: true,
  exam: true,
  attendance: true,
  status: true,
};

export const densityOptions: { id: DensityId; icon: string; title: string }[] = [
  { id: 'compact', icon: 'ti ti-baseline-density-small', title: 'Compact' },
  { id: 'default', icon: 'ti ti-baseline-density-medium', title: 'Default' },
  { id: 'comfortable', icon: 'ti ti-baseline-density-large', title: 'Comfortable' },
];

export const sortOptions: { id: SortKey; label: string; icon: string }[] = [
  { id: 'name', label: 'Student Name (A–Z)', icon: 'ti ti-abc' },
  { id: 'roll', label: 'Roll Number', icon: 'ti ti-list-numbers' },
  { id: 'checkin', label: 'Check-in Time', icon: 'ti ti-login-2' },
  { id: 'date', label: 'Exam Date', icon: 'ti ti-calendar' },
  { id: 'recent', label: 'Recently updated', icon: 'ti ti-clock' },
];

/** Every header on this page sorts; the key matches the column it sits over. */
export const tableHeaders: { id: ColumnId; label: string; sort: SortKey }[] = [
  { id: 'student', label: 'Student', sort: 'name' },
  { id: 'exam', label: 'Exam Details', sort: 'date' },
  { id: 'attendance', label: 'Attendance', sort: 'checkin' },
  { id: 'status', label: 'Status', sort: 'status' },
];

export const pageSizes = ['10', '25', '50'];

/* -------------------------------------------------------------------------- */
/*                          Header, bulk bar and menus                        */
/* -------------------------------------------------------------------------- */

/** The header dropdown offers three; Print is its own button beside it. */
export const exportActions: { id: string; label: string; icon: string }[] = [
  { id: 'export_pdf', label: 'Export as PDF', icon: 'ti ti-file-type-pdf' },
  { id: 'export_excel', label: 'Export as Excel', icon: 'ti ti-file-type-xls' },
  { id: 'export_csv', label: 'Export as CSV', icon: 'ti ti-file-type-csv' },
];

export interface BulkAction {
  id: string;
  label: string;
  icon: string;
  modal?: AttendanceModalId;
  danger?: boolean;
}

export const bulkActions: BulkAction[] = [
  { id: 'mark_present', label: 'Mark Present', icon: 'ti ti-user-check' },
  { id: 'mark_absent', label: 'Mark Absent', icon: 'ti ti-user-x' },
  { id: 'mark_late', label: 'Mark Late', icon: 'ti ti-clock-exclamation' },
  { id: 'verify', label: 'Verify Attendance', icon: 'ti ti-discount' },
  { id: 'export_csv', label: 'Export Selected', icon: 'ti ti-file-export' },
  { id: 'print', label: 'Print', icon: 'ti ti-printer' },
  { id: 'delete', label: 'Delete', icon: 'ti ti-trash', modal: 'delete', danger: true },
];

export interface RowMenuItem {
  id: string;
  label: string;
  icon: string;
  /** A key of `all_routes`; those entries also fired a toast in the template. */
  route?: string;
  modal?: AttendanceModalId;
  danger?: boolean;
  divider?: boolean;
}

export const rowMenuItems: RowMenuItem[] = [
  { id: 'view', label: 'View Details', icon: 'ti ti-eye', modal: 'view' },
  { id: 'edit', label: 'Edit Attendance', icon: 'ti ti-edit', modal: 'edit' },
  { id: 'verify', label: 'Verify Attendance', icon: 'ti ti-discount' },
  { id: 'profile', label: 'Student Profile', icon: 'ti ti-user', route: 'studentDetail' },
  { id: 'exam_info', label: 'Exam Information', icon: 'ti ti-file-certificate', route: 'exam' },
  { id: 'seat', label: 'Seat Allocation', icon: 'ti ti-armchair' },
  { id: 'remarks', label: 'Remarks', icon: 'ti ti-message-2' },
  { id: 'print', label: 'Print Record', icon: 'ti ti-printer' },
  { id: 'mark_present', label: 'Mark Present', icon: 'ti ti-user-check', divider: true },
  { id: 'mark_absent', label: 'Mark Absent', icon: 'ti ti-user-x' },
  { id: 'mark_late', label: 'Mark Late', icon: 'ti ti-clock-exclamation' },
  { id: 'medical_leave', label: 'Medical Leave', icon: 'ti ti-heartbeat' },
  { id: 'export_csv', label: 'Export', icon: 'ti ti-file-export' },
  { id: 'delete', label: 'Delete', icon: 'ti ti-trash-x', modal: 'delete', danger: true },
];

/** `tables.js` L556–575, verbatim; the last three are the engine's own hard-coded copy. */
export const actionToasts: Record<string, string> = {
  refresh: 'Attendance list refreshed.',
  save_view: 'Current filters saved as a new view.',
  view: 'Attendance details opened.',
  verify: 'Attendance marked as verified.',
  profile: 'Student profile opened.',
  exam_info: 'Exam information opened.',
  seat: 'Seat allocation opened.',
  remarks: 'Remarks opened for this record.',
  mark_present: 'Marked present.',
  mark_absent: 'Marked absent.',
  mark_late: 'Marked late.',
  medical_leave: 'Marked as medical leave.',
  reports: 'Attendance report opened.',
  print: 'Sending the attendance record to the printer…',
  archive: 'Selected records archived.',
  export_excel: 'Excel workbook queued for download.',
  export_pdf: 'PDF export queued for download.',
  export_csv: 'Preparing export…',
  page: 'Loading the selected page…',
  clear_filters: 'Filters cleared.',
  reset_columns: 'All columns restored.',
};

/**
 * `PAGE_CONFIG` pairs each message with a tone; anything omitted here is a success.
 * The engine's "warn" is this app's "warning".
 */
export const actionToastVariants: Record<string, ToastVariant> = {
  view: 'info',
  profile: 'info',
  exam_info: 'info',
  seat: 'info',
  remarks: 'info',
  mark_absent: 'warning',
  mark_late: 'warning',
  medical_leave: 'info',
  reports: 'info',
  print: 'info',
  export_excel: 'info',
  export_pdf: 'info',
  export_csv: 'info',
  page: 'info',
};

/** `tables.js` L548–555 — the CSV export columns, in grid order. */
export const csvColumns: { label: string; value: (record: AttendanceRow) => string }[] = [
  { label: 'Student', value: (record) => record.name },
  { label: 'Admission No', value: (record) => record.admissionNo },
  { label: 'Class', value: (record) => record.className },
  { label: 'Roll', value: (record) => String(record.roll) },
  { label: 'Exam', value: (record) => record.exam },
  { label: 'Subject', value: (record) => record.subject },
  { label: 'Hall', value: (record) => record.hall },
  { label: 'Seat', value: (record) => record.seat },
  { label: 'Invigilator', value: (record) => record.invigilator.name },
  { label: 'Check-in', value: (record) => record.checkin },
  { label: 'Status', value: (record) => record.status },
];

/** `tables.js` L577, in the engine's order of use. */
export const strings = {
  recentSort: 'Showing the most recently updated exams first.',
  filterMatch: ' exams match the current filters.',
  viewMatch: ' exams in “',
  csvFile: 'exam-attendance.csv',
};
