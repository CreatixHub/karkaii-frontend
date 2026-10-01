export type SlotTone =
  | 'danger'
  | 'primary'
  | 'success'
  | 'pending'
  | 'info'
  | 'light'
  | 'warning';

export type LayoutView = 'grid' | 'list';

export type TimetableModalId =
  | 'editPeriod'
  | 'replaceTeacher'
  | 'swapSchedule'
  | 'assignClassroom'
  | 'timetableDetails'
  | 'addTimeTable';

export interface TimetableSlot {
  id: string;
  subject: string;
  /** `bg-transparent-*` on the card. */
  tone: SlotTone;
  /** `text-*` on the subject glyph, which does not always match `tone`. */
  iconTone: string;
  icon: string;
  time: string;
  room: string;
  duration: string;
  teacher: { name: string; avatar: string };
}

export interface TimetableDay {
  id: string;
  label: string;
  count: string;
  slots: TimetableSlot[];
}

const slot = (
  id: string,
  subject: string,
  tone: SlotTone,
  iconTone: string,
  icon: string,
  time: string,
  room: string,
  teacherName: string,
  avatarNo: string,
): TimetableSlot => ({
  id,
  subject,
  tone,
  iconTone,
  icon: `ti ti-${icon}`,
  time,
  room,
  duration: '45 min',
  teacher: { name: teacherName, avatar: `assets/img/teachers/teacher-${avatarNo}.jpg` },
});

/** The seven period times, identical on every day. */
const P = [
  '09:00 - 09:45 AM',
  '09:45 - 10:30 AM',
  '10:45 - 11:30 AM',
  '11:30 - 12:15 PM',
  '01:30 - 02:15 PM',
  '02:15 - 03:00 PM',
  '03:15 - 04:00 PM',
];

export const timetableWeek: TimetableDay[] = [
  {
    id: 'mon',
    label: 'Monday',
    count: '7 periods',
    slots: [
      slot('mon-1', 'Maths', 'danger', 'danger', 'math-symbols', P[0], 'Room 101', 'Jacquelin', '07'),
      slot('mon-2', 'English', 'primary', 'primary', 'abc', P[1], 'Room 102', 'Hellana', '03'),
      slot('mon-3', 'Computer', 'success', 'success', 'device-laptop', P[2], 'Lab 1', 'Daniel', '02'),
      slot('mon-4', 'Spanish', 'pending', 'warning', 'language', P[3], 'Room 103', 'Erickson', '03'),
      slot('mon-5', 'Science', 'info', 'info', 'atom-2', P[4], 'Lab 2', 'Morgan', '05'),
      slot('mon-6', 'Chemistry', 'light', 'secondary', 'flask', P[5], 'Lab 3', 'Aaron', '06'),
      slot('mon-7', 'Physics', 'warning', 'warning', 'atom', P[6], 'Room 104', 'Teresa', '01'),
    ],
  },
  {
    id: 'tue',
    label: 'Tuesday',
    count: '7 periods',
    slots: [
      slot('tue-1', 'Spanish', 'pending', 'warning', 'language', P[0], 'Room 103', 'Erickson', '03'),
      slot('tue-2', 'Physics', 'warning', 'warning', 'atom', P[1], 'Room 104', 'Teresa', '01'),
      slot('tue-3', 'Chemistry', 'light', 'secondary', 'flask', P[2], 'Lab 3', 'Aaron', '06'),
      slot('tue-4', 'Maths', 'danger', 'danger', 'math-symbols', P[3], 'Room 101', 'Jacquelin', '07'),
      slot('tue-5', 'Computer', 'success', 'success', 'device-laptop', P[4], 'Lab 1', 'Daniel', '02'),
      slot('tue-6', 'English', 'primary', 'primary', 'abc', P[5], 'Room 102', 'Hellana', '03'),
      slot('tue-7', 'Science', 'info', 'info', 'atom-2', P[6], 'Lab 2', 'Morgan', '05'),
    ],
  },
  {
    id: 'wed',
    label: 'Wednesday',
    count: '7 periods',
    slots: [
      slot('wed-1', 'Computer', 'success', 'success', 'device-laptop', P[0], 'Lab 1', 'Daniel', '02'),
      slot('wed-2', 'Science', 'info', 'info', 'atom-2', P[1], 'Lab 2', 'Morgan', '05'),
      slot('wed-3', 'Maths', 'danger', 'danger', 'math-symbols', P[2], 'Room 101', 'Jacquelin', '07'),
      slot('wed-4', 'Chemistry', 'light', 'secondary', 'flask', P[3], 'Lab 3', 'Aaron', '06'),
      slot('wed-5', 'Physics', 'warning', 'warning', 'atom', P[4], 'Room 104', 'Teresa', '01'),
      slot('wed-6', 'English', 'primary', 'primary', 'abc', P[5], 'Room 102', 'Hellana', '03'),
      slot('wed-7', 'Spanish', 'pending', 'warning', 'language', P[6], 'Room 103', 'Erickson', '03'),
    ],
  },
  {
    id: 'thu',
    label: 'Thursday',
    count: '7 periods',
    slots: [
      slot('thu-1', 'Physics', 'warning', 'warning', 'atom', P[0], 'Room 104', 'Teresa', '01'),
      slot('thu-2', 'Computer', 'success', 'success', 'device-laptop', P[1], 'Lab 1', 'Daniel', '02'),
      slot('thu-3', 'English', 'primary', 'primary', 'abc', P[2], 'Room 102', 'Hellana', '03'),
      slot('thu-4', 'Science', 'info', 'info', 'atom-2', P[3], 'Lab 2', 'Morgan', '05'),
      slot('thu-5', 'Spanish', 'pending', 'warning', 'language', P[4], 'Room 103', 'Erickson', '03'),
      slot('thu-6', 'Chemistry', 'light', 'secondary', 'flask', P[5], 'Lab 3', 'Aaron', '06'),
      slot('thu-7', 'Maths', 'danger', 'danger', 'math-symbols', P[6], 'Room 101', 'Jacquelin', '07'),
    ],
  },
  {
    id: 'fri',
    label: 'Friday',
    count: '7 periods',
    slots: [
      slot('fri-1', 'English', 'primary', 'primary', 'abc', P[0], 'Room 102', 'Hellana', '03'),
      slot('fri-2', 'Spanish', 'pending', 'warning', 'language', P[1], 'Room 103', 'Erickson', '03'),
      slot('fri-3', 'Physics', 'warning', 'warning', 'atom', P[2], 'Room 104', 'Teresa', '01'),
      slot('fri-4', 'Chemistry', 'light', 'secondary', 'flask', P[3], 'Lab 3', 'Aaron', '06'),
      slot('fri-5', 'Maths', 'danger', 'danger', 'math-symbols', P[4], 'Room 101', 'Jacquelin', '07'),
      slot('fri-6', 'Computer', 'success', 'success', 'device-laptop', '02:15 - 3:00 PM', 'Lab 1', 'Daniel', '02'),
      slot('fri-7', 'Science', 'info', 'info', 'atom-2', P[6], 'Lab 2', 'Morgan', '05'),
    ],
  },
  {
    id: 'sat',
    label: 'Saturday',
    count: '7 periods',
    slots: [
      slot('sat-1', 'English', 'primary', 'primary', 'abc', P[0], 'Room 102', 'Hellana', '03'),
      slot('sat-2', 'Spanish', 'pending', 'warning', 'language', P[1], 'Room 103', 'Erickson', '03'),
      slot('sat-3', 'Physics', 'warning', 'warning', 'atom', P[2], 'Room 104', 'Teresa', '01'),
      slot('sat-4', 'Chemistry', 'light', 'secondary', 'flask', P[3], 'Lab 3', 'Aaron', '06'),
      slot('sat-5', 'Maths', 'danger', 'danger', 'math-symbols', P[4], 'Room 101', 'Jacquelin', '07'),
      slot('sat-6', 'Computer', 'success', 'success', 'device-laptop', '02:15 - 3:00 PM', 'Lab 1', 'Daniel', '02'),
      slot('sat-7', 'Science', 'info', 'info', 'atom-2', P[6], 'Lab 2', 'Morgan', '05'),
    ],
  },
];

/* -------------------------------------------------------------------------- */
/*                              Academic header                               */
/* -------------------------------------------------------------------------- */

export const classProfile = {
  title: 'Class III - Section A',
  year: '2024 / 2025',
  classTeacher: 'Ms. Teresa Susan',
};

export interface StatFact {
  icon: string;
  iconClass: string;
  value: string;
  label: string;
}

export const statFacts: StatFact[] = [
  { icon: 'ti ti-book', iconClass: 'bg-success-transparent text-success', value: '7', label: 'Total Subjects' },
  { icon: 'ti ti-clock-hour-9', iconClass: 'bg-info-transparent text-info', value: '42', label: 'Weekly Periods' },
  { icon: 'ti ti-calendar-week', iconClass: 'bg-warning-transparent text-warning', value: '6', label: 'Working Days' },
  {
    icon: 'ti ti-history',
    iconClass: 'bg-secondary-transparent text-secondary',
    value: '18 Jul 2026',
    label: 'Last Updated',
  },
];

/* -------------------------------------------------------------------------- */
/*                                  Toolbar                                   */
/* -------------------------------------------------------------------------- */

export type FilterKey = 'year' | 'class' | 'section' | 'teacher' | 'subject' | 'room' | 'day';

export interface FilterField {
  key: FilterKey;
  label: string;
  domId: string;
  options: string[];
  /** The Academic Year select has no "All" placeholder in the template. */
  noAll?: boolean;
}

export const advancedFilters: FilterField[] = [
  { key: 'year', label: 'Academic Year', domId: 'ctt-academic-year', options: ['2024 / 2025', '2023 / 2024'], noAll: true },
  { key: 'class', label: 'Class', domId: 'ctt-class', options: ['I', 'II', 'III'] },
  { key: 'section', label: 'Section', domId: 'ctt-section', options: ['A', 'B', 'C'] },
  { key: 'teacher', label: 'Teacher', domId: 'ctt-teacher', options: ['Jacquelin', 'Hellana', 'Daniel'] },
  { key: 'subject', label: 'Subject', domId: 'ctt-subject', options: ['Maths', 'Science', 'Physics'] },
  { key: 'room', label: 'Room', domId: 'ctt-room', options: ['Room 101', 'Lab 1', 'Lab 2'] },
  { key: 'day', label: 'Day', domId: 'ctt-day', options: ['Monday', 'Tuesday', 'Wednesday'] },
];

export const savedViews: { id: string; label: string; icon: string }[] = [
  { id: 'week', label: 'Class III - A (Full Week)', icon: 'ti ti-layout-grid' },
  { id: 'teacher', label: 'By Teacher', icon: 'ti ti-user' },
  { id: 'room', label: 'By Room', icon: 'ti ti-door' },
];

export const exportOptions: { id: string; label: string; icon: string }[] = [
  { id: 'export_pdf', label: 'Export as PDF', icon: 'ti ti-file-type-pdf' },
  { id: 'export_excel', label: 'Export as Excel', icon: 'ti ti-file-type-xls' },
];

export interface SlotMenuItem {
  id: string;
  label: string;
  icon: string;
  modal?: TimetableModalId;
  danger?: boolean;
  divider?: boolean;
}

/** The per-slot overflow menu — `class-time-table.html` L1590–1598. */
export const slotMenuItems: SlotMenuItem[] = [
  { id: 'edit', label: 'Edit Period', icon: 'ti ti-edit', modal: 'editPeriod' },
  { id: 'replace', label: 'Replace Teacher', icon: 'ti ti-user-x', modal: 'replaceTeacher' },
  { id: 'swap', label: 'Swap Period', icon: 'ti ti-arrows-exchange', modal: 'swapSchedule' },
  { id: 'assign', label: 'Assign Classroom', icon: 'ti ti-door', modal: 'assignClassroom' },
  { id: 'details', label: 'View Details', icon: 'ti ti-eye', modal: 'timetableDetails' },
  { id: 'delete', label: 'Delete', icon: 'ti ti-trash', danger: true, divider: true },
];

/**
 * `class-timetable.js` ships no toast table, so this copy mirrors the phrasing the other
 * Academic workspaces use for the same actions.
 */
export const actionToasts: Record<string, string> = {
  refresh: 'Timetable refreshed.',
  save_view: 'Current filters saved as a new view.',
  export_pdf: 'PDF export queued for download.',
  export_excel: 'Excel workbook queued for download.',
  print: 'Sending the timetable to the printer…',
  clear_filters: 'Filters cleared.',
  apply_filters: 'Filters applied.',
  delete: 'Period removed from the timetable.',
};

/* -------------------------------------------------------------------------- */
/*                              Schedule info panel                           */
/* -------------------------------------------------------------------------- */

export interface DetailRow {
  label: string;
  value: string;
}

export const periodDetailRows: DetailRow[] = [
  { label: 'Class', value: 'Class III - Section A' },
  { label: 'Subject', value: 'Maths' },
  { label: 'Teacher', value: 'Jacquelin' },
  { label: 'Room', value: 'Room 101' },
  { label: 'Time', value: '09:00 - 09:45 AM' },
  { label: 'Duration', value: '45 min' },
];

export const editSubjects = ['Maths', 'English', 'Science', 'Physics', 'Chemistry', 'Computer', 'Spanish'];
export const editTeachers = ['Jacquelin', 'Hellana', 'Daniel', 'Erickson', 'Morgan', 'Aaron', 'Teresa'];
export const editRooms = ['Room 101', 'Room 102', 'Room 103', 'Room 104', 'Lab 1', 'Lab 2', 'Lab 3'];
export const swapDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
export const swapPeriods = P;
