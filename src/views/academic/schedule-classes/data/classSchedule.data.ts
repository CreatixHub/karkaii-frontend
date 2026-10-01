export type ClassStatus =
  | 'Scheduled'
  | 'Live'
  | 'Completed'
  | 'Cancelled'
  | 'Substitute'
  | 'Rescheduled'
  | 'Holiday';

export type DayId = 'mon' | 'tue' | 'wed' | 'thu' | 'fri';

export type DensityId = 'compact' | 'default' | 'comfortable';

export type FilterKey = 'year' | 'class' | 'section' | 'teacher' | 'subject' | 'room' | 'day' | 'status';

export type ToolbarMenu = 'views' | 'filters' | 'columns' | null;

/** The Day/Week/Agenda switch this page adds over the routine engine. */
export type ViewMode = 'day' | 'week' | 'agenda';

export type ScheduleModalId = 'add' | 'edit' | 'view' | 'import' | 'delete';

export interface ScheduleDay {
  id: DayId;
  label: string;
  date: string;
  periods: string;
}

export const scheduleDays: ScheduleDay[] = [
  { id: 'mon', label: 'Monday', date: '21 Jul', periods: '6 periods' },
  { id: 'tue', label: 'Tuesday', date: '22 Jul', periods: '6 periods' },
  { id: 'wed', label: 'Wednesday', date: '23 Jul', periods: '6 periods' },
  { id: 'thu', label: 'Thursday', date: '24 Jul', periods: '6 periods' },
  { id: 'fri', label: 'Friday', date: '25 Jul', periods: '6 periods' },
];

export interface TimeSlot {
  pnum: string;
  time: string;
  start: string;
  end: string;
  duration: string;
}

export const timeSlots: TimeSlot[] = [
  { pnum: 'P1', time: '09:00 AM', start: '09:00 AM', end: '09:45 AM', duration: '45m' },
  { pnum: 'P2', time: '09:45 AM', start: '09:45 AM', end: '10:30 AM', duration: '45m' },
  { pnum: 'P3', time: '10:45 AM', start: '10:45 AM', end: '11:30 AM', duration: '45m' },
  { pnum: 'P4', time: '11:30 AM', start: '11:30 AM', end: '12:15 PM', duration: '45m' },
  { pnum: 'P5', time: '01:00 PM', start: '01:00 PM', end: '01:45 PM', duration: '45m' },
  { pnum: 'P6', time: '01:45 PM', start: '01:45 PM', end: '02:30 PM', duration: '45m' },
];

export const breakRows: Record<string, { icon: string; label: string }> = {
  'P3': { icon: 'ti ti-coffee', label: 'Short Break · 10:30 AM – 10:45 AM' },
  'P5': { icon: 'ti ti-tools-kitchen-2', label: 'Lunch Break · 12:15 PM – 01:00 PM' },
};

export const shortTime = (value: string) => value.replace(/\s?[AP]M$/, '');

/* -------------------------------------------------------------------------- */
/*                             Per-subject constants                          */
/* -------------------------------------------------------------------------- */

interface SubjectMeta {
  accent: string;
  objective: string;
  homework: string;
}

const SUBJECTS: Record<string, SubjectMeta> = {
  English: { accent: 'bg-primary', objective: 'Tenses & sentence structure', homework: 'Workbook pg 24' },
  Mathematics: { accent: 'bg-success', objective: 'Quadratic equations', homework: 'Exercise 5.2' },
  Chemistry: { accent: 'bg-warning', objective: 'The periodic table', homework: 'Diagram set A' },
  Physics: { accent: 'bg-info', objective: 'Laws of motion', homework: 'Numericals 1–8' },
  Biology: { accent: 'bg-danger', objective: 'Cell structure', homework: 'Label worksheet' },
  Geography: { accent: 'bg-pink', objective: 'Landforms of the Earth', homework: 'Map exercise 3' },
  Computer: { accent: 'bg-dark', objective: 'Intro to Python', homework: 'Program: loops' },
  Economics: { accent: 'bg-teal', objective: 'Demand & supply', homework: 'Case study 2' },
  'Physical Ed': { accent: 'bg-secondary', objective: 'Athletics drills', homework: '—' },
  Finance: { accent: 'bg-purple', objective: 'Budgeting basics', homework: 'Reading pg 12' },
};

const TEACHERS: Record<string, { avatar: string; qualification: string }> = {
  Erickson: { avatar: 'assets/img/teachers/teacher-01.jpg', qualification: 'M.A English' },
  Mori: { avatar: 'assets/img/teachers/teacher-02.jpg', qualification: 'M.Sc Maths' },
  Joseph: { avatar: 'assets/img/teachers/teacher-03.jpg', qualification: 'M.Sc Physics' },
  James: { avatar: 'assets/img/teachers/teacher-04.jpg', qualification: 'M.Sc Chemistry' },
  Teresa: { avatar: 'assets/img/teachers/teacher-05.jpg', qualification: 'M.Sc Botany' },
  Hendrita: { avatar: 'assets/img/teachers/teacher-06.jpg', qualification: 'MCA' },
  Jacquelin: { avatar: 'assets/img/teachers/teacher-07.jpg', qualification: 'M.A Geography' },
  Ramsey: { avatar: 'assets/img/teachers/teacher-08.jpg', qualification: 'M.A Economics' },
  Aariv: { avatar: 'assets/img/teachers/teacher-09.jpg', qualification: 'B.P.Ed' },
  Morgan: { avatar: 'assets/img/teachers/teacher-10.jpg', qualification: 'MBA Finance' },
};

const PILLS: Record<ClassStatus, { pillClass: string; pillIcon: string | null }> = {
  Scheduled: { pillClass: 'is-new', pillIcon: null },
  Live: { pillClass: 'is-active', pillIcon: null },
  Completed: { pillClass: 'is-inactive', pillIcon: 'ti ti-check' },
  Cancelled: { pillClass: 'is-emergency', pillIcon: 'ti ti-ban' },
  Substitute: { pillClass: 'is-pending', pillIcon: 'ti ti-user-shield' },
  Rescheduled: { pillClass: 'is-exam', pillIcon: 'ti ti-calendar-repeat' },
  Holiday: { pillClass: 'is-archived', pillIcon: 'ti ti-calendar-off' },
};

const REMARKS: Partial<Record<ClassStatus, string>> = {
  Cancelled: 'Class cancelled — teacher on leave.',
  Substitute: 'Handled by a substitute teacher.',
  Rescheduled: 'Moved from its original slot.',
};

const DEFAULT_REMARK = 'On track with the term syllabus.';

/* -------------------------------------------------------------------------- */
/*                                   Classes                                  */
/* -------------------------------------------------------------------------- */

export interface ScheduledClass {
  id: string;
  dayId: DayId;
  day: string;
  time: string;
  subject: string;
  accent: string;
  teacher: { name: string; avatar: string; qualification: string } | null;
  room: string;
  students: number;
  status: ClassStatus;
  pillClass: string;
  pillIcon: string | null;
  objective: string;
  homework: string;
  search: string;
}

const entry = (
  dayId: DayId,
  day: string,
  time: string,
  subject: string,
  teacherName: string | null,
  room: string,
  students: number,
  status: ClassStatus,
  search: string,
): ScheduledClass => {
  const meta = SUBJECTS[subject] ?? { accent: 'bg-purple', objective: '—', homework: '—' };
  const pill = PILLS[status];
  return {
    id: `${dayId}-${time}`,
    dayId,
    day,
    time,
    subject,
    accent: meta.accent,
    teacher: teacherName ? { name: teacherName, ...TEACHERS[teacherName] } : null,
    room,
    students,
    status,
    pillClass: pill.pillClass,
    pillIcon: pill.pillIcon,
    objective: meta.objective,
    homework: meta.homework,
    search,
  };
};

export const scheduledClasses: ScheduledClass[] = [
  entry('mon', 'Monday', '09:00 AM', 'English', 'Erickson', '101', 42, 'Completed', 'monday english erickson room 101 completed class iii sec a 09:00 am'),
  entry('tue', 'Tuesday', '09:00 AM', 'Mathematics', 'Mori', '102', 40, 'Scheduled', 'tuesday mathematics mori room 102 scheduled class iii sec a 09:00 am'),
  entry('wed', 'Wednesday', '09:00 AM', 'Chemistry', 'James', '104', 39, 'Scheduled', 'wednesday chemistry james room 104 scheduled class iii sec a 09:00 am'),
  entry('thu', 'Thursday', '09:00 AM', 'Physics', 'Joseph', '103', 38, 'Scheduled', 'thursday physics joseph room 103 scheduled class iii sec a 09:00 am'),
  entry('fri', 'Friday', '09:00 AM', 'Biology', 'Teresa', '105', 41, 'Scheduled', 'friday biology teresa room 105 scheduled class iii sec a 09:00 am'),

  entry('mon', 'Monday', '09:45 AM', 'Mathematics', 'Mori', '102', 40, 'Completed', 'monday mathematics mori room 102 completed class iii sec a 09:45 am'),
  entry('tue', 'Tuesday', '09:45 AM', 'English', 'Erickson', '101', 42, 'Scheduled', 'tuesday english erickson room 101 scheduled class iii sec a 09:45 am'),
  entry('wed', 'Wednesday', '09:45 AM', 'Biology', 'Teresa', '105', 41, 'Substitute', 'wednesday biology teresa room 105 substitute class iii sec a 09:45 am'),
  entry('thu', 'Thursday', '09:45 AM', 'Geography', 'Jacquelin', '106', 37, 'Scheduled', 'thursday geography jacquelin room 106 scheduled class iii sec a 09:45 am'),
  entry('fri', 'Friday', '09:45 AM', 'Computer', 'Hendrita', '108', 36, 'Scheduled', 'friday computer hendrita room 108 scheduled class iii sec a 09:45 am'),

  entry('mon', 'Monday', '10:45 AM', 'Physics', 'Joseph', '103', 38, 'Live', 'monday physics joseph room 103 live class iii sec a 10:45 am'),
  entry('tue', 'Tuesday', '10:45 AM', 'Geography', 'Jacquelin', '106', 37, 'Rescheduled', 'tuesday geography jacquelin room 106 rescheduled class iii sec a 10:45 am'),
  entry('wed', 'Wednesday', '10:45 AM', 'Mathematics', 'Mori', '102', 40, 'Scheduled', 'wednesday mathematics mori room 102 scheduled class iii sec a 10:45 am'),
  entry('thu', 'Thursday', '10:45 AM', 'English', 'Erickson', '101', 42, 'Scheduled', 'thursday english erickson room 101 scheduled class iii sec a 10:45 am'),
  entry('fri', 'Friday', '10:45 AM', 'Chemistry', 'James', '104', 39, 'Scheduled', 'friday chemistry james room 104 scheduled class iii sec a 10:45 am'),

  entry('mon', 'Monday', '11:30 AM', 'Chemistry', 'James', '104', 39, 'Scheduled', 'monday chemistry james room 104 scheduled class iii sec a 11:30 am'),
  entry('tue', 'Tuesday', '11:30 AM', 'Physics', 'Joseph', '103', 38, 'Scheduled', 'tuesday physics joseph room 103 scheduled class iii sec a 11:30 am'),
  entry('wed', 'Wednesday', '11:30 AM', 'English', 'Erickson', '101', 42, 'Scheduled', 'wednesday english erickson room 101 scheduled class iii sec a 11:30 am'),
  entry('thu', 'Thursday', '11:30 AM', 'Mathematics', 'Mori', '102', 40, 'Cancelled', 'thursday mathematics mori room 102 cancelled class iii sec a 11:30 am'),
  entry('fri', 'Friday', '11:30 AM', 'Physics', 'Joseph', '103', 38, 'Scheduled', 'friday physics joseph room 103 scheduled class iii sec a 11:30 am'),

  // The template leaves Friday empty in the P5 row.
  entry('mon', 'Monday', '01:00 PM', 'Biology', 'Teresa', '105', 41, 'Scheduled', 'monday biology teresa room 105 scheduled class iii sec a 01:00 pm'),
  entry('tue', 'Tuesday', '01:00 PM', 'Economics', 'Ramsey', '110', 35, 'Scheduled', 'tuesday economics ramsey room 110 scheduled class iii sec a 01:00 pm'),
  entry('wed', 'Wednesday', '01:00 PM', 'Computer', 'Hendrita', '108', 36, 'Scheduled', 'wednesday computer hendrita room 108 scheduled class iii sec a 01:00 pm'),
  entry('thu', 'Thursday', '01:00 PM', 'Chemistry', 'James', '104', 39, 'Scheduled', 'thursday chemistry james room 104 scheduled class iii sec a 01:00 pm'),

  entry('mon', 'Monday', '01:45 PM', 'Computer', 'Hendrita', '108', 36, 'Scheduled', 'monday computer hendrita room 108 scheduled class iii sec a 01:45 pm'),
  entry('tue', 'Tuesday', '01:45 PM', 'Physical Ed', 'Aariv', 'Ground', 44, 'Scheduled', 'tuesday physical ed aariv room ground scheduled class iii sec a 01:45 pm'),
  entry('wed', 'Wednesday', '01:45 PM', 'Finance', 'Morgan', '109', 34, 'Scheduled', 'wednesday finance morgan room 109 scheduled class iii sec a 01:45 pm'),
  entry('thu', 'Thursday', '01:45 PM', 'Biology', 'Teresa', '105', 41, 'Scheduled', 'thursday biology teresa room 105 scheduled class iii sec a 01:45 pm'),
  entry('fri', 'Friday', '01:45 PM', 'Foundation Day', null, '', 0, 'Holiday', 'friday holiday foundation day iii a'),
];

/* ---------------------------- Derived detail copy --------------------------- */

export const attendanceSummary = (row: ScheduledClass) =>
  row.students ? `${row.students - 2}/${row.students} present` : '—';

export const roomInformation = (row: ScheduledClass) => (row.room ? `Room ${row.room} · Block A` : '—');

export const subjectDetails = (row: ScheduledClass) => `${row.subject} · Core`;

export const teachingResources = (row: ScheduledClass) => `Slides deck, Textbook, ${row.homework}`;

export const assignmentLine = (row: ScheduledClass) => `Homework — ${row.homework}`;

export const remarkFor = (row: ScheduledClass) => REMARKS[row.status] ?? DEFAULT_REMARK;

/* -------------------------------------------------------------------------- */
/*                                  Toolbar                                   */
/* -------------------------------------------------------------------------- */

export interface SavedView {
  id: string;
  label: string;
  icon: string;
}

export const savedViews: SavedView[] = [
  { id: 'all', label: 'Full Week', icon: 'ti ti-layout-grid' },
  { id: 'Live', label: 'Live Now', icon: 'ti ti-player-play' },
  { id: 'Scheduled', label: 'Scheduled', icon: 'ti ti-calendar' },
  { id: 'Substitute', label: 'Substitute', icon: 'ti ti-user-shield' },
  { id: 'Cancelled', label: 'Cancelled', icon: 'ti ti-ban' },
];

export const quickFilters: SavedView[] = [
  { id: 'Live', label: 'Live', icon: 'ti ti-player-play' },
  { id: 'Scheduled', label: 'Scheduled', icon: 'ti ti-calendar' },
  { id: 'Substitute', label: 'Substitute', icon: 'ti ti-user-shield' },
  { id: 'Rescheduled', label: 'Rescheduled', icon: 'ti ti-calendar-repeat' },
  { id: 'Cancelled', label: 'Cancelled', icon: 'ti ti-ban' },
];

export const viewModes: { id: ViewMode; icon: string; title: string }[] = [
  { id: 'day', icon: 'ti ti-calendar-event', title: 'Day view' },
  { id: 'week', icon: 'ti ti-calendar-week', title: 'Week view' },
  { id: 'agenda', icon: 'ti ti-list', title: 'Agenda view' },
];

export interface FilterOption {
  value: string;
  label: string;
}

export interface FilterField {
  key: FilterKey;
  label: string;
  panelLabel: string;
  domId: string;
  options: FilterOption[];
}

const plain = (values: string[]): FilterOption[] => values.map((value) => ({ value, label: value }));

export const advancedFilters: FilterField[] = [
  {
    key: 'year',
    label: 'Year',
    panelLabel: 'Academic Year',
    domId: 'sch-academic-year',
    options: plain(['2024/2025', '2023/2024']),
  },
  {
    key: 'class',
    label: 'Class',
    panelLabel: 'Class',
    domId: 'sch-class',
    options: [
      { value: 'class iii', label: 'III' },
      { value: 'class iv', label: 'IV' },
      { value: 'class v', label: 'V' },
    ],
  },
  {
    key: 'section',
    label: 'Section',
    panelLabel: 'Section',
    domId: 'sch-section',
    options: [
      { value: 'sec a', label: 'A' },
      { value: 'sec b', label: 'B' },
    ],
  },
  {
    key: 'teacher',
    label: 'Teacher',
    panelLabel: 'Teacher',
    domId: 'sch-teacher',
    options: plain([
      'Erickson',
      'Mori',
      'Joseph',
      'James',
      'Teresa',
      'Hendrita',
      'Jacquelin',
      'Ramsey',
      'Aariv',
      'Morgan',
    ]),
  },
  {
    key: 'subject',
    label: 'Subject',
    panelLabel: 'Subject',
    domId: 'sch-subject',
    options: plain([
      'English',
      'Mathematics',
      'Physics',
      'Chemistry',
      'Biology',
      'Computer',
      'Geography',
      'Economics',
      'Physical Ed',
      'Finance',
    ]),
  },
  {
    key: 'room',
    label: 'Room',
    panelLabel: 'Classroom',
    domId: 'sch-classroom',
    options: [
      { value: 'room 101', label: 'Room 101' },
      { value: 'room 102', label: 'Room 102' },
      { value: 'room 103', label: 'Room 103' },
      { value: 'room 104', label: 'Room 104' },
      { value: 'room 105', label: 'Room 105' },
    ],
  },
  {
    key: 'day',
    label: 'Day',
    panelLabel: 'Day',
    domId: 'sch-day',
    options: plain(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']),
  },
  {
    key: 'status',
    label: 'Status',
    panelLabel: 'Status',
    domId: 'sch-status',
    options: plain(['Scheduled', 'Live', 'Completed', 'Cancelled', 'Substitute', 'Rescheduled', 'Holiday']),
  },
];

export const columnDefs: { id: DayId; label: string }[] = scheduleDays.map((day) => ({
  id: day.id,
  label: day.label,
}));

export const allColumns: Record<DayId, boolean> = {
  mon: true,
  tue: true,
  wed: true,
  thu: true,
  fri: true,
};

export const densityOptions: { id: DensityId; icon: string; title: string }[] = [
  { id: 'compact', icon: 'ti ti-baseline-density-small', title: 'Compact' },
  { id: 'default', icon: 'ti ti-baseline-density-medium', title: 'Default' },
  { id: 'comfortable', icon: 'ti ti-baseline-density-large', title: 'Comfortable' },
];

export const weekOptions = ['21 – 26 Jul 2025', '14 – 19 Jul 2025', '28 Jul – 02 Aug 2025'];

/* -------------------------------------------------------------------------- */
/*                          Header, bulk bar and menus                        */
/* -------------------------------------------------------------------------- */

export const exportActions: { id: string; label: string; icon: string }[] = [
  { id: 'export_pdf', label: 'Export as PDF', icon: 'ti ti-file-type-pdf' },
  { id: 'export_excel', label: 'Export as Excel', icon: 'ti ti-file-type-xls' },
  { id: 'export_csv', label: 'Export as CSV', icon: 'ti ti-file-type-csv' },
  { id: 'print', label: 'Print Schedule', icon: 'ti ti-printer' },
];

export interface BulkAction {
  id: string;
  label: string;
  icon: string;
  modal?: ScheduleModalId;
  danger?: boolean;
}

export const bulkActions: BulkAction[] = [
  { id: 'assign_teacher', label: 'Assign Teacher', icon: 'ti ti-user-plus' },
  { id: 'assign_room', label: 'Assign Classroom', icon: 'ti ti-door' },
  { id: 'publish', label: 'Publish Schedule', icon: 'ti ti-send' },
  { id: 'reschedule', label: 'Reschedule', icon: 'ti ti-calendar-repeat' },
  { id: 'export_csv', label: 'Export', icon: 'ti ti-download' },
  { id: 'print', label: 'Print', icon: 'ti ti-printer' },
  { id: 'archive', label: 'Archive', icon: 'ti ti-archive' },
  { id: 'delete', label: 'Delete', icon: 'ti ti-trash', modal: 'delete', danger: true },
];

export interface RowMenuItem {
  id: string;
  label: string;
  icon: string;
  route?: string;
  modal?: ScheduleModalId;
  danger?: boolean;
  divider?: boolean;
}

export const cardQuickActions: RowMenuItem[] = [
  { id: 'view', label: 'View Schedule', icon: 'ti ti-eye', modal: 'view' },
  { id: 'edit', label: 'Edit Class', icon: 'ti ti-edit', modal: 'edit' },
  { id: 'attendance', label: 'Take Attendance', icon: 'ti ti-calendar-check' },
  { id: 'lesson_plan', label: 'Lesson Plan', icon: 'ti ti-notebook' },
  { id: 'homework', label: 'Homework', icon: 'ti ti-book' },
];

export const cardMenuItems: RowMenuItem[] = [
  { id: 'assign_teacher', label: 'Assign Teacher', icon: 'ti ti-user-plus' },
  { id: 'assign_room', label: 'Assign Classroom', icon: 'ti ti-door' },
  { id: 'assignments', label: 'Assignments', icon: 'ti ti-clipboard-list' },
  { id: 'notes', label: 'Class Notes', icon: 'ti ti-notes' },
  { id: 'students', label: 'Students', icon: 'ti ti-users', route: 'studentList' },
  { id: 'reports', label: 'Reports', icon: 'ti ti-chart-bar', route: 'classAnalytics' },
  { id: 'print', label: 'Print', icon: 'ti ti-printer' },
  { id: 'duplicate', label: 'Duplicate Schedule', icon: 'ti ti-copy', divider: true },
  { id: 'reschedule', label: 'Reschedule', icon: 'ti ti-calendar-repeat' },
  { id: 'swap', label: 'Swap Class', icon: 'ti ti-arrows-exchange' },
  { id: 'cancel_class', label: 'Cancel Class', icon: 'ti ti-ban' },
  { id: 'archive', label: 'Archive', icon: 'ti ti-archive' },
  { id: 'delete', label: 'Delete', icon: 'ti ti-trash-x', modal: 'delete', danger: true },
];

/** `schedule-workspace.js` L313–334, verbatim. */
export const actionToasts: Record<string, string> = {
  refresh: 'Schedule refreshed.',
  save_view: 'Current filters saved as a new view.',
  publish: 'Schedule published to teachers and students.',
  assign_teacher: 'Teacher assignment opened for the selected classes.',
  assign_class: 'Class assignment opened for the selected classes.',
  assign_room: 'Classroom assignment opened for the selected classes.',
  swap: 'Swap-class workspace opened for the selected classes.',
  reschedule: 'Reschedule workspace opened for the selected classes.',
  duplicate: 'Schedule duplicated as a draft.',
  cancel_class: 'Selected class marked as cancelled.',
  lesson_plan: 'Lesson plan opened.',
  attendance: 'Attendance opened for this class.',
  homework: 'Homework opened for this class.',
  assignments: 'Assignments opened for this class.',
  students: 'Student list opened for this class.',
  notes: 'Class notes opened for this class.',
  reports: 'Schedule report opened.',
  print: 'Sending the schedule to the printer…',
  archive: 'Selected classes archived.',
  export_excel: 'Excel workbook queued for download.',
  export_pdf: 'PDF export queued for download.',
  export_csv: 'Preparing export…',
  clear_filters: 'Filters cleared.',
  reset_columns: 'All days restored.',
};

/** `schedule-workspace.js` L402 — the copy for each view-mode switch. */
export const viewModeToasts: Record<ViewMode, string> = {
  day: "Day view — showing Monday's classes.",
  week: 'Week view.',
  agenda: 'Agenda view.',
};
