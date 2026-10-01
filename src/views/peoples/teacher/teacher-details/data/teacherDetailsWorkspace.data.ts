/** A `label: value` pair rendered as a `.text-dark.fw-medium` line. */
export interface FieldRow {
  label: string;
  value: string;
}

/** One `<span>` in the hero's meta strip. Value-only rows omit `label`. */
export interface HeroMetaItem {
  id: string;
  icon: string;
  label?: string;
  value: string;
}

export const heroMeta: HeroMetaItem[] = [
  { id: 'designation', icon: 'ti ti-briefcase', label: 'Designation', value: 'Senior Teacher' },
  { id: 'department', icon: 'ti ti-building-community', label: 'Department', value: 'Science' },
  { id: 'qualification', icon: 'ti ti-certificate', label: 'Qualification', value: 'M.Sc, B.Ed' },
  { id: 'employment', icon: 'ti ti-file-certificate', label: 'Employment', value: 'Permanent' },
  { id: 'joined', icon: 'ti ti-calendar-check', label: 'Joined', value: '25 May 2024' },
  { id: 'experience', icon: 'ti ti-award', label: 'Experience', value: '9 yrs' },
  { id: 'email', icon: 'ti ti-mail', value: 'jan@example.com' },
  { id: 'phone', icon: 'ti ti-phone', value: '+1 46548 84498' },
  { id: 'office', icon: 'ti ti-map-pin', label: 'Office', value: '2nd Floor' },
];

/** Actions the hero's More menu fires that are not plain navigation. */
export type HeroMoreAction = 'idcard' | 'download';

/**
 * The seven More-dropdown rows. `to` is a route key on `all_routes`; the two
 * `javascript:void(0);` rows carry an `action` instead and become buttons.
 */
export interface HeroMoreItem {
  id: string;
  icon: string;
  label: string;
  to?: 'teachersRoutine' | 'classSubject' | 'teacherLeaves' | 'teacherSalary';
  action?: HeroMoreAction;
}

export const heroMoreMenu: HeroMoreItem[] = [
  { id: 'assign-class', icon: 'ti ti-table-options', label: 'Assign Class', to: 'teachersRoutine' },
  { id: 'assign-subject', icon: 'ti ti-book', label: 'Assign Subject', to: 'classSubject' },
  { id: 'view-timetable', icon: 'ti ti-calendar-time', label: 'View Timetable', to: 'teachersRoutine' },
  { id: 'attendance', icon: 'ti ti-calendar-check', label: 'Attendance', to: 'teacherLeaves' },
  { id: 'payroll', icon: 'ti ti-report-money', label: 'Payroll', to: 'teacherSalary' },
  { id: 'id-card', icon: 'ti ti-id', label: 'Generate ID Card', action: 'idcard' },
  { id: 'download-profile', icon: 'ti ti-file-type-pdf', label: 'Download Profile', action: 'download' },
];

/**
 * A Profile Summary card. `emphasis` marks the one card the template renders
 * with `<h5 class="mb-0 fs-15">` instead of `<h6 class="mb-0">`.
 */
export interface SummaryCard {
  id: string;
  icon: string;
  tone: string;
  label: string;
  value: string;
  emphasis?: boolean;
}

export const summaryCards: SummaryCard[] = [
  {
    id: 'subjects',
    icon: 'ti ti-book',
    tone: 'bg-primary-transparent text-primary',
    label: 'Teaching Subjects',
    value: 'Physics',
    emphasis: true,
  },
  {
    id: 'classes',
    icon: 'ti ti-clipboard-list',
    tone: 'bg-success-transparent text-success',
    label: 'Assigned Classes',
    value: '18 Classes',
  },
  {
    id: 'hours',
    icon: 'ti ti-clock-hour-9',
    tone: 'bg-info-transparent text-info',
    label: 'Weekly Teaching Hours',
    value: '36 hrs',
  },
  {
    id: 'attendance',
    icon: 'ti ti-calendar-event',
    tone: 'bg-warning-transparent text-warning',
    label: 'Attendance',
    value: '96%',
  },
  {
    id: 'rating',
    icon: 'ti ti-star',
    tone: 'bg-primary-transparent text-primary',
    label: 'Performance Rating',
    value: '4.8 / 5',
  },
  {
    id: 'leave-balance',
    icon: 'ti ti-calendar-off',
    tone: 'bg-danger-transparent text-danger',
    label: 'Leave Balance',
    value: '12 Days',
  },
  {
    id: 'upcoming',
    icon: 'ti ti-calendar-time',
    tone: 'bg-info-transparent text-info',
    label: 'Upcoming Classes',
    value: '4 Today',
  },
  {
    id: 'last-login',
    icon: 'ti ti-login-2',
    tone: 'bg-secondary-transparent text-secondary',
    label: 'Last Login',
    value: 'Today 09:10 AM',
  },
];

/** "Profile Details" card — the template's own curly apostrophe and spacing. */
export const profileDetails: FieldRow[] = [
  { label: 'Father’s Name', value: 'Francis Saviour' },
  { label: 'Mother Name', value: 'Stella Bruce' },
  { label: 'DOB', value: '25 Jan 1992' },
  { label: 'Martial Status', value: 'Single' },
  { label: 'Qualification', value: 'MBA' },
  { label: 'Experience', value: '2  Years' },
];

/** One card in the Documents grid. */
export interface DocumentCard {
  id: string;
  name: string;
  date: string;
  status: string;
  statusClass: string;
}

export const documents: DocumentCard[] = [
  {
    id: 'resume',
    name: 'Resume.pdf',
    date: '12 May 2024',
    status: 'Verified',
    statusClass: 'badge-soft-success',
  },
  {
    id: 'joining-letter',
    name: 'Joining Letter.pdf',
    date: '25 May 2024',
    status: 'Pending',
    statusClass: 'badge-soft-warning',
  },
];

/** The two rows of the Address card. */
export interface AddressRow {
  id: string;
  icon: string;
  label: string;
  value: string;
}

export const addresses: AddressRow[] = [
  {
    id: 'current',
    icon: 'ti ti-map-pin-up',
    label: 'Current Address',
    value: '3495 Red Hawk Road, Buffalo Lake, MN 55314',
  },
  {
    id: 'permanent',
    icon: 'ti ti-map-pins',
    label: 'Permanent Address',
    value: '3495 Red Hawk Road, Buffalo Lake, MN 55314',
  },
];

export const previousSchool: FieldRow[] = [
  { label: 'Previous School Name', value: 'Oxford Matriculation, USA' },
  { label: 'School Address', value: '1852 Barnes Avenue, Cincinnati, OH 45202' },
  { label: 'Phone Number', value: '+1 35676 45556' },
];

export const bankDetails: FieldRow[] = [
  { label: 'Bank Name', value: 'Bank of America' },
  { label: 'Branch', value: 'Cincinnati' },
  { label: 'IFSC', value: 'BOA83209832' },
];

export const workDetails: FieldRow[] = [
  { label: 'Contract Type', value: 'Permanent' },
  { label: 'Shift', value: 'Morning' },
  { label: 'Work Location', value: '2nd Floor' },
];

export const socialMedia: FieldRow[] = [
  { label: 'Facebook', value: 'www.facebook.com' },
  { label: 'Twitter', value: 'www.twitter.com' },
  { label: 'Linkedin', value: 'www.linkedin.com' },
  { label: 'Youtube', value: 'www.youtube.com' },
  { label: 'Instagram', value: 'www.instagram.com' },
];

export const otherInfo =
  "Depending on the specific needs of your organization or system, additional information may be collected or tracked. It's important to ensure that any data collected complies with privacy regulations and policies to protect students' sensitive information.";

/** A row of the Login Details dialog's credential table. */
export interface LoginCredential {
  userType: string;
  userName: string;
  password: string;
}

export const loginCredentials: LoginCredential[] = [
  { userType: 'Teacher', userName: 'teacher20', password: 'teacher@53' },
  { userType: 'Parent', userName: 'parent53', password: 'parent@53' },
];

/** Body of the file the More menu's "Download Profile" writes. */
export const PROFILE_TEXT = `PRESKOOL ACADEMY - TEACHER PROFILE
====================================
Name         : Teresa (T849126)
Designation  : Senior Teacher
Department   : Science
Qualification: M.Sc, B.Ed
Employment   : Permanent
Joined       : 25 May 2024
Experience   : 9 yrs
Email        : jan@example.com
Phone        : +1 46548 84498
Office       : 2nd Floor
====================================
System-generated profile export.
`;
