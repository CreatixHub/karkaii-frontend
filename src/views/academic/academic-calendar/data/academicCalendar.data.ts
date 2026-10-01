export type CalendarView = 'month' | 'week' | 'day' | 'agenda';

export type CategoryId =
  | 'academic'
  | 'exam'
  | 'holiday'
  | 'sports'
  | 'cultural'
  | 'meeting'
  | 'admission'
  | 'fee';

export type CalendarModalId =
  | 'addEvent'
  | 'editEvent'
  | 'eventDetails'
  | 'assignParticipants'
  | 'calendarSettings'
  | 'reminderSettings'
  | 'recurringEvent'
  | 'importCalendar';

export interface EventCategory {
  id: CategoryId;
  /** The `for`/`id` the template gave the checkbox. */
  domId: string;
  label: string;
  dotClass: string;
  badgeClass: string;
  count: number;
  /** The `text-*` class the mini calendar uses for this category's dot. */
  dotText: string;
}

export const eventCategories: EventCategory[] = [
  { id: 'academic', domId: 'cat_academic', label: 'Academic Sessions', dotClass: 'bg-primary', badgeClass: 'badge-soft-primary', count: 12, dotText: 'text-primary' },
  { id: 'exam', domId: 'cat_exam', label: 'Examinations', dotClass: 'bg-danger', badgeClass: 'badge-soft-danger', count: 8, dotText: 'text-danger' },
  { id: 'holiday', domId: 'cat_holiday', label: 'Holidays & Vacation', dotClass: 'bg-warning', badgeClass: 'badge-soft-warning', count: 6, dotText: 'text-warning' },
  { id: 'sports', domId: 'cat_sports', label: 'Sports Events', dotClass: 'bg-success', badgeClass: 'badge-soft-success', count: 4, dotText: 'text-success' },
  { id: 'cultural', domId: 'cat_cultural', label: 'Cultural Programme', dotClass: 'bg-purple', badgeClass: 'badge-soft-purple', count: 3, dotText: 'text-purple' },
  { id: 'meeting', domId: 'cat_meeting', label: 'Meetings', dotClass: 'bg-teal', badgeClass: 'badge-soft-teal', count: 7, dotText: 'text-teal' },
  { id: 'admission', domId: 'cat_admission', label: 'Admissions', dotClass: 'bg-info', badgeClass: 'badge-soft-info', count: 5, dotText: 'text-info' },
  { id: 'fee', domId: 'cat_fee', label: 'Fee Collection', dotClass: 'bg-secondary', badgeClass: 'badge-soft-secondary', count: 4, dotText: 'text-secondary' },
];

export const allCategoriesOn: Record<CategoryId, boolean> = {
  academic: true,
  exam: true,
  holiday: true,
  sports: true,
  cultural: true,
  meeting: true,
  admission: true,
  fee: true,
};

/* -------------------------------------------------------------------------- */
/*                                 Month view                                 */
/* -------------------------------------------------------------------------- */

export interface CalendarEntry {
  id: string;
  label: string;
  category: CategoryId;
  /** `.calendar-entry` tone class, e.g. `bg-primary-transparent` or `bg-danger text-white`. */
  toneClass: string;
  icon?: string;
  /** The multi-day events take `.is-solid` plus a span modifier. */
  solid?: boolean;
  span?: 'start' | 'mid' | 'end';
}

export interface CalendarCell {
  day: number;
  /** Greyed-out leading and trailing days. */
  isOut?: boolean;
  isToday?: boolean;
  entries: CalendarEntry[];
}

const entry = (
  id: string,
  label: string,
  category: CategoryId,
  toneClass: string,
  icon?: string,
  solid?: boolean,
  span?: 'start' | 'mid' | 'end',
): CalendarEntry => ({ id, label, category, toneClass, icon, solid, span });

/** 35 cells — `academic-calendar.html` L1784–1892. */
export const monthCells: CalendarCell[] = [
  { day: 28, isOut: true, entries: [] },
  { day: 29, isOut: true, entries: [] },
  { day: 30, isOut: true, entries: [] },
  { day: 1, entries: [entry('e1', 'Session Begins', 'academic', 'bg-primary-transparent', 'ti ti-flag-2')] },
  { day: 2, entries: [entry('e2', 'Admissions Open', 'admission', 'bg-info-transparent', 'ti ti-user-plus')] },
  { day: 3, entries: [entry('e3', 'Orientation Day', 'meeting', 'bg-teal-transparent', 'ti ti-presentation')] },
  { day: 4, entries: [] },

  { day: 5, entries: [] },
  { day: 6, entries: [entry('e4', 'Staff Meeting', 'meeting', 'bg-teal-transparent', 'ti ti-users')] },
  { day: 7, entries: [] },
  {
    day: 8,
    entries: [
      entry('e5', 'Parent Meeting', 'meeting', 'bg-warning-transparent', 'ti ti-users-group'),
      entry('e6', 'Term-1 Fee Due', 'fee', 'bg-secondary-transparent', 'ti ti-cash'),
    ],
  },
  { day: 9, entries: [] },
  { day: 10, entries: [entry('e7', 'Teacher Training', 'meeting', 'bg-teal-transparent', 'ti ti-school')] },
  { day: 11, entries: [] },

  { day: 12, entries: [] },
  {
    day: 13,
    entries: [entry('e8', 'Unit Test I', 'exam', 'bg-danger text-white', 'ti ti-file-certificate', true, 'start')],
  },
  { day: 14, entries: [entry('e9', 'Unit Test I', 'exam', 'bg-danger text-white', undefined, true, 'mid')] },
  { day: 15, entries: [entry('e10', 'Unit Test I', 'exam', 'bg-danger text-white', undefined, true, 'end')] },
  {
    day: 16,
    entries: [entry('e11', 'Assignment Due', 'academic', 'bg-warning-transparent', 'ti ti-clipboard-text')],
  },
  { day: 17, entries: [entry('e12', 'Practical Exam', 'exam', 'bg-purple-transparent', 'ti ti-microscope')] },
  { day: 18, entries: [] },

  { day: 19, entries: [entry('e13', 'Inter-House Sports', 'sports', 'bg-success-transparent', 'ti ti-run')] },
  { day: 20, entries: [entry('e14', 'Curriculum Review', 'academic', 'bg-primary-transparent', 'ti ti-books')] },
  { day: 21, entries: [] },
  {
    day: 22,
    entries: [entry('e15', 'Quarterly Exam', 'exam', 'bg-danger text-white', 'ti ti-hexagon-letter-q', true)],
  },
  { day: 23, entries: [entry('e16', 'Project Submission', 'academic', 'bg-warning-transparent', 'ti ti-folder')] },
  {
    day: 24,
    entries: [entry('e17', 'Cultural Programme', 'cultural', 'bg-purple-transparent', 'ti ti-masks-theater')],
  },
  { day: 25, entries: [] },

  { day: 26, isToday: true, entries: [] },
  { day: 27, entries: [entry('e18', 'Dept. Meeting', 'meeting', 'bg-teal-transparent', 'ti ti-users')] },
  { day: 28, entries: [entry('e19', 'Result Publication', 'sports', 'bg-success-transparent', 'ti ti-trophy')] },
  { day: 29, entries: [] },
  { day: 30, entries: [entry('e20', 'Summer Vacation', 'holiday', 'bg-warning', 'ti ti-beach', true, 'start')] },
  { day: 31, entries: [entry('e21', 'Summer Vacation', 'holiday', 'bg-warning', undefined, true, 'mid')] },
  { day: 1, isOut: true, entries: [entry('e22', 'Vacation', 'holiday', 'bg-warning', undefined, true, 'end')] },
];

export const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const miniDayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

export const currentMonthLabel = 'July 2026';

/* -------------------------------------------------------------------------- */
/*                                  Week view                                 */
/* -------------------------------------------------------------------------- */

export interface WeekColumn {
  label: string;
  /** Thursday is highlighted in the template's header. */
  highlight?: boolean;
}

export const weekColumns: WeekColumn[] = [
  { label: 'Sun 26' },
  { label: 'Mon 27' },
  { label: 'Tue 28' },
  { label: 'Wed 29' },
  { label: 'Thu 30', highlight: true },
  { label: 'Fri 31' },
  { label: 'Sat 1' },
];

export interface WeekRow {
  time: string;
  /** One slot per column; `null` where the template leaves the cell empty. */
  slots: (CalendarEntry | null)[];
}

export const weekRows: WeekRow[] = [
  {
    time: '09:00',
    slots: [
      null,
      entry('w1', 'Dept. Meeting', 'meeting', 'bg-teal-transparent'),
      entry('w2', 'Result Publish', 'sports', 'bg-success-transparent'),
      null,
      entry('w3', 'Vacation', 'holiday', 'bg-warning', undefined, true),
      null,
      null,
    ],
  },
  { time: '11:00', slots: [null, null, null, null, null, null, null] },
  {
    time: '14:00',
    slots: [null, entry('w4', 'Fee Reminder', 'fee', 'bg-warning-transparent'), null, null, null, null, null],
  },
];

/* -------------------------------------------------------------------------- */
/*                              Day and agenda views                          */
/* -------------------------------------------------------------------------- */

export const dayViewHeading = 'Sunday, 26 July 2026';
export const dayViewBadge = 'Weekend';

export interface AgendaItem {
  id: string;
  dayLabel: string;
  title: string;
  category: CategoryId;
  icon: string;
  iconClass: string;
  meta: { icon: string; text: string }[];
  badge: string;
  badgeClass: string;
  /** The template splits the agenda across two columns. */
  column: 0 | 1;
}

export const agendaItems: AgendaItem[] = [
  {
    id: 'ag1',
    dayLabel: 'Mon, 13 July',
    title: 'Unit Test I Begins',
    category: 'exam',
    icon: 'ti ti-file-certificate',
    iconClass: 'bg-danger-transparent text-danger',
    meta: [
      { icon: 'ti ti-clock', text: '09:00 AM - 12:00 PM' },
      { icon: 'ti ti-map-pin', text: 'Examination Hall' },
    ],
    badge: 'Examination',
    badgeClass: 'badge-soft-danger',
    column: 0,
  },
  {
    id: 'ag2',
    dayLabel: 'Wed, 22 July',
    title: 'Quarterly Examination',
    category: 'exam',
    icon: 'ti ti-hexagon-letter-q',
    iconClass: 'bg-danger-transparent text-danger',
    meta: [
      { icon: 'ti ti-clock', text: '09:00 AM - 01:00 PM' },
      { icon: 'ti ti-map-pin', text: 'Main Block' },
    ],
    badge: 'Examination',
    badgeClass: 'badge-soft-danger',
    column: 0,
  },
  {
    id: 'ag3',
    dayLabel: 'Fri, 24 July',
    title: 'Annual Cultural Programme',
    category: 'cultural',
    icon: 'ti ti-masks-theater',
    iconClass: 'bg-purple-transparent text-purple',
    meta: [
      { icon: 'ti ti-clock', text: '05:00 PM - 08:00 PM' },
      { icon: 'ti ti-map-pin', text: 'Auditorium' },
    ],
    badge: 'Cultural',
    badgeClass: 'badge-soft-purple',
    column: 1,
  },
  {
    id: 'ag4',
    dayLabel: 'Thu, 30 July',
    title: 'Summer Vacation Begins',
    category: 'holiday',
    icon: 'ti ti-beach',
    iconClass: 'bg-warning-transparent text-warning',
    meta: [
      { icon: 'ti ti-calendar', text: 'All Day' },
      { icon: 'ti ti-repeat', text: '30 Jul - 15 Aug' },
    ],
    badge: 'Holiday',
    badgeClass: 'badge-soft-warning',
    column: 1,
  },
];

/* -------------------------------------------------------------------------- */
/*                                   Left rail                                */
/* -------------------------------------------------------------------------- */

export interface MiniDay {
  day: number;
  isOut?: boolean;
  isToday?: boolean;
  /** The `text-*` class of the dot, when the day has an event. */
  dot?: string;
  category?: CategoryId;
}

/** `academic-calendar.html` L1654–1658. */
export const miniDays: MiniDay[] = [
  { day: 28, isOut: true },
  { day: 29, isOut: true },
  { day: 30, isOut: true },
  { day: 1, dot: 'text-primary', category: 'academic' },
  { day: 2, dot: 'text-info', category: 'admission' },
  { day: 3, dot: 'text-teal', category: 'meeting' },
  { day: 4 },

  { day: 5 },
  { day: 6, dot: 'text-teal', category: 'meeting' },
  { day: 7 },
  { day: 8, dot: 'text-warning', category: 'meeting' },
  { day: 9 },
  { day: 10, dot: 'text-teal', category: 'meeting' },
  { day: 11 },

  { day: 12 },
  { day: 13, dot: 'text-danger', category: 'exam' },
  { day: 14, dot: 'text-danger', category: 'exam' },
  { day: 15, dot: 'text-danger', category: 'exam' },
  { day: 16, dot: 'text-warning', category: 'academic' },
  { day: 17, dot: 'text-purple', category: 'exam' },
  { day: 18 },

  { day: 19, dot: 'text-success', category: 'sports' },
  { day: 20, dot: 'text-primary', category: 'academic' },
  { day: 21 },
  { day: 22, dot: 'text-danger', category: 'exam' },
  { day: 23, dot: 'text-warning', category: 'academic' },
  { day: 24, dot: 'text-purple', category: 'cultural' },
  { day: 25 },

  { day: 26, isToday: true },
  { day: 27, dot: 'text-teal', category: 'meeting' },
  { day: 28, dot: 'text-success', category: 'sports' },
  { day: 29 },
  { day: 30, dot: 'text-warning', category: 'holiday' },
  { day: 31, dot: 'text-warning', category: 'holiday' },
  { day: 1, isOut: true },
];

export const sessionOptions = ['2026 / 2027 (Current)', '2025 / 2026', '2024 / 2025'];

export const sessionProgress = { label: 'Term 1 of 3', barClass: 'w-25', value: 18 };

export interface CheckFilter {
  id: string;
  label: string;
  checked: boolean;
}

export const statusFilters: CheckFilter[] = [
  { id: 'st_scheduled', label: 'Scheduled', checked: true },
  { id: 'st_ongoing', label: 'Ongoing', checked: true },
  { id: 'st_completed', label: 'Completed', checked: false },
];

export const priorityFilters: CheckFilter[] = [
  { id: 'pr_high', label: 'High', checked: true },
  { id: 'pr_normal', label: 'Normal', checked: true },
];

/* -------------------------------------------------------------------------- */
/*                                   Toolbar                                  */
/* -------------------------------------------------------------------------- */

export const savedViews: { id: string; label: string; icon: string }[] = [
  { id: 'all', label: 'All Academic Events', icon: 'ti ti-star' },
  { id: 'exams', label: 'Examination Timeline', icon: 'ti ti-file-certificate' },
  { id: 'holidays', label: 'Holidays & Vacations', icon: 'ti ti-beach' },
  { id: 'fees', label: 'Fee Deadlines', icon: 'ti ti-report-money' },
];

/** The quick bar maps onto the same categories, plus an "All" reset. */
export const quickFilters: { id: 'all' | CategoryId; label: string; icon: string; count: number }[] = [
  { id: 'all', label: 'All', icon: 'ti ti-list', count: 42 },
  { id: 'holiday', label: 'Holidays', icon: 'ti ti-beach', count: 6 },
  { id: 'exam', label: 'Exams', icon: 'ti ti-file-certificate', count: 8 },
  { id: 'academic', label: 'Events', icon: 'ti ti-confetti', count: 9 },
  { id: 'meeting', label: 'Meetings', icon: 'ti ti-users', count: 7 },
  { id: 'admission', label: 'Admissions', icon: 'ti ti-user-plus', count: 5 },
  { id: 'fee', label: 'Fee Deadlines', icon: 'ti ti-report-money', count: 4 },
  { id: 'sports', label: 'Sports', icon: 'ti ti-run', count: 4 },
  { id: 'cultural', label: 'Cultural', icon: 'ti ti-masks-theater', count: 3 },
];

export type FilterKey =
  | 'year'
  | 'campus'
  | 'department'
  | 'class'
  | 'section'
  | 'category'
  | 'type'
  | 'status';

export interface FilterField {
  key: FilterKey;
  label: string;
  domId: string;
  options: string[];
}

export const advancedFilters: FilterField[] = [
  { key: 'year', label: 'Academic Year', domId: 'acal-academic-year', options: ['2026 / 2027', '2025 / 2026', '2024 / 2025'] },
  { key: 'campus', label: 'Campus', domId: 'acal-campus', options: ['All Campuses', 'Main Campus', 'North Branch', 'West Branch'] },
  { key: 'department', label: 'Department', domId: 'acal-department', options: ['All Departments', 'Primary', 'Secondary', 'Senior Secondary'] },
  { key: 'class', label: 'Class', domId: 'acal-class', options: ['All Classes', 'Class IX', 'Class X', 'Class XI', 'Class XII'] },
  { key: 'section', label: 'Section', domId: 'acal-section', options: ['All', 'A', 'B', 'C'] },
  {
    key: 'category',
    label: 'Event Category',
    domId: 'acal-event-category',
    options: ['All Categories', 'Academic', 'Examination', 'Holiday', 'Sports', 'Cultural', 'Meetings', 'Admissions', 'Fee Collection'],
  },
  { key: 'type', label: 'Event Type', domId: 'acal-event-type', options: ['All Types', 'Single Day', 'Multi-day', 'Recurring'] },
  { key: 'status', label: 'Status', domId: 'acal-status', options: ['All', 'Scheduled', 'Ongoing', 'Completed', 'Cancelled'] },
];

/** The template ships three chips pre-applied. */
export const initialChips = ['Class X', 'Examination', 'Main Campus'];

export const viewTabs: { id: CalendarView; label: string }[] = [
  { id: 'month', label: 'Month' },
  { id: 'week', label: 'Week' },
  { id: 'day', label: 'Day' },
  { id: 'agenda', label: 'Agenda' },
];

export const exportActions: { id: string; label: string; icon: string }[] = [
  { id: 'export_pdf', label: 'Export as PDF', icon: 'ti ti-file-type-pdf' },
  { id: 'export_excel', label: 'Export as Excel', icon: 'ti ti-file-type-xls' },
  { id: 'export_ical', label: 'Export as iCal (.ics)', icon: 'ti ti-calendar-share' },
  { id: 'print', label: 'Print', icon: 'ti ti-printer' },
];

/**
 * This page shipped no engine, so there is no toast table to transcribe. The copy below
 * mirrors the phrasing the other Academic workspaces use for the same actions.
 */
export const actionToasts: Record<string, string> = {
  refresh: 'Calendar refreshed.',
  save_view: 'Current filters saved as a new view.',
  export_pdf: 'PDF export queued for download.',
  export_excel: 'Excel workbook queued for download.',
  export_ical: 'iCal file queued for download.',
  print: 'Sending the calendar to the printer…',
  clear_filters: 'Filters cleared.',
  today: 'Jumped to today.',
  apply_filters: 'Filters applied.',
};
