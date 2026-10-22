export type HolidayCategory = 'Public' | 'School' | 'Festival' | 'Examination' | 'Optional';

export interface Holiday {
  id: string;
  name: string;
  category: HolidayCategory;
  /** The template's `data-hol-type`, e.g. "Public Holiday". */
  type: string;
  /** Display form, exactly as the template wrote it: "01 Jan 2026". */
  start: string;
  end: string;
  /** "1 day" / "46 days" — the template's own wording, not recomputed. */
  duration: string;
  classes: string;
  branch: string;
  description: string;
  createdBy: string;
  createdOn: string;
}

export interface CategoryMeta {
  /** The `.cat-*` modifier the calendar events, rails and list rows share. */
  cls: string;
  /** Bootstrap tint used by badges and avatars. */
  tone: string;
  icon: string;
}

export const categoryMeta: Record<HolidayCategory, CategoryMeta> = {
  Public: { cls: 'cat-public', tone: 'danger', icon: 'ti ti-flag' },
  School: { cls: 'cat-school', tone: 'primary', icon: 'ti ti-school' },
  Festival: { cls: 'cat-festival', tone: 'warning', icon: 'ti ti-confetti' },
  Examination: { cls: 'cat-examination', tone: 'info', icon: 'ti ti-pencil' },
  Optional: { cls: 'cat-optional', tone: 'teal', icon: 'ti ti-star' },
};

export const categoryOrder: HolidayCategory[] = ['Public', 'School', 'Festival', 'Examination', 'Optional'];

/** The calendar legend abbreviates Examination and uses its own modifier. */
export const legendItems: { label: string; cls: string }[] = [
  { label: 'Public', cls: 'cat-public' },
  { label: 'School', cls: 'cat-school' },
  { label: 'Festival', cls: 'cat-festival' },
  { label: 'Exam', cls: 'cat-exam' },
  { label: 'Optional', cls: 'cat-optional' },
];

export const holidays: Holiday[] = [
  {
    id: 'HOL-01',
    name: "New Year's Day",
    category: 'Public',
    type: 'Public Holiday',
    start: '01 Jan 2026',
    end: '01 Jan 2026',
    duration: '1 day',
    classes: 'All Classes',
    branch: 'All Branches',
    description: 'Public holiday marking the new year.',
    createdBy: 'HR Office',
    createdOn: '01 Jan 2025',
  },
  {
    id: 'HOL-02',
    name: 'Republic Day',
    category: 'Public',
    type: 'Public Holiday',
    start: '26 Jan 2026',
    end: '26 Jan 2026',
    duration: '1 day',
    classes: 'All Classes',
    branch: 'All Branches',
    description: 'National holiday with a flag-hoisting ceremony at the main campus.',
    createdBy: 'HR Office',
    createdOn: '26 Jan 2025',
  },
  {
    id: 'HOL-03',
    name: 'Holi',
    category: 'Festival',
    type: 'Festival Holiday',
    start: '03 Mar 2026',
    end: '03 Mar 2026',
    duration: '1 day',
    classes: 'All Classes',
    branch: 'All Branches',
    description: 'Festival of colours.',
    createdBy: 'HR Office',
    createdOn: '03 Mar 2025',
  },
  {
    id: 'HOL-04',
    name: 'Good Friday',
    category: 'Public',
    type: 'Public Holiday',
    start: '03 Apr 2026',
    end: '03 Apr 2026',
    duration: '1 day',
    classes: 'All Classes',
    branch: 'All Branches',
    description: 'Public holiday.',
    createdBy: 'HR Office',
    createdOn: '03 Apr 2025',
  },
  {
    id: 'HOL-05',
    name: 'Summer Break',
    category: 'School',
    type: 'School Holiday',
    start: '01 May 2026',
    end: '15 Jun 2026',
    duration: '46 days',
    classes: 'All Classes',
    branch: 'All Branches',
    description: 'Annual summer vacation for all classes.',
    createdBy: 'HR Office',
    createdOn: '01 May 2025',
  },
  {
    id: 'HOL-06',
    name: "Teachers' Training",
    category: 'School',
    type: 'School Holiday',
    start: '03 Aug 2026',
    end: '03 Aug 2026',
    duration: '1 day',
    classes: 'All Classes',
    branch: 'Main Campus',
    description: 'Staff development day — no classes for students.',
    createdBy: 'HR Office',
    createdOn: '03 Aug 2025',
  },
  {
    id: 'HOL-07',
    name: 'Raksha Bandhan',
    category: 'Festival',
    type: 'Festival Holiday',
    start: '09 Aug 2026',
    end: '09 Aug 2026',
    duration: '1 day',
    classes: 'All Classes',
    branch: 'All Branches',
    description: 'Festival celebrating the bond between siblings.',
    createdBy: 'HR Office',
    createdOn: '09 Aug 2025',
  },
  {
    id: 'HOL-08',
    name: 'Independence Day',
    category: 'Public',
    type: 'Public Holiday',
    start: '15 Aug 2026',
    end: '15 Aug 2026',
    duration: '1 day',
    classes: 'All Classes',
    branch: 'All Branches',
    description: 'National holiday with a flag-hoisting ceremony and cultural programme.',
    createdBy: 'HR Office',
    createdOn: '15 Aug 2025',
  },
  {
    id: 'HOL-09',
    name: 'Janmashtami',
    category: 'Festival',
    type: 'Festival Holiday',
    start: '19 Aug 2026',
    end: '19 Aug 2026',
    duration: '1 day',
    classes: 'All Classes',
    branch: 'All Branches',
    description: 'Festival marking the birth of Lord Krishna.',
    createdBy: 'HR Office',
    createdOn: '19 Aug 2025',
  },
  {
    id: 'HOL-10',
    name: 'Half-Yearly Exam Break',
    category: 'Examination',
    type: 'Examination Holiday',
    start: '24 Aug 2026',
    end: '26 Aug 2026',
    duration: '3 days',
    classes: 'Grade 6 - Grade 10',
    branch: 'All Branches',
    description: 'Study break between half-yearly examination sessions.',
    createdBy: 'HR Office',
    createdOn: '24 Aug 2025',
  },
  {
    id: 'HOL-11',
    name: 'Onam',
    category: 'Optional',
    type: 'Optional Holiday',
    start: '28 Aug 2026',
    end: '28 Aug 2026',
    duration: '1 day',
    classes: 'All Classes',
    branch: 'South Wing',
    description: 'Optional regional festival holiday.',
    createdBy: 'HR Office',
    createdOn: '28 Aug 2025',
  },
  {
    id: 'HOL-12',
    name: 'Gandhi Jayanti',
    category: 'Public',
    type: 'Public Holiday',
    start: '02 Oct 2026',
    end: '02 Oct 2026',
    duration: '1 day',
    classes: 'All Classes',
    branch: 'All Branches',
    description: 'National holiday.',
    createdBy: 'HR Office',
    createdOn: '02 Oct 2025',
  },
  {
    id: 'HOL-13',
    name: 'Diwali Break',
    category: 'Festival',
    type: 'Festival Holiday',
    start: '07 Nov 2026',
    end: '11 Nov 2026',
    duration: '5 days',
    classes: 'All Classes',
    branch: 'All Branches',
    description: 'Festival of lights vacation.',
    createdBy: 'HR Office',
    createdOn: '07 Nov 2025',
  },
  {
    id: 'HOL-14',
    name: 'Christmas',
    category: 'Public',
    type: 'Public Holiday',
    start: '25 Dec 2026',
    end: '25 Dec 2026',
    duration: '1 day',
    classes: 'All Classes',
    branch: 'All Branches',
    description: 'Public holiday.',
    createdBy: 'HR Office',
    createdOn: '25 Dec 2025',
  },
];

/* --------------------------------- Dates ---------------------------------- */

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

/** "03 Aug 2026" → Date, at local midnight so day arithmetic stays exact. */
export const parseDate = (value: string): Date => {
  const [day, month, year] = value.trim().split(/\s+/);
  return new Date(Number(year), MONTHS.indexOf(month), Number(day));
};

export const formatDate = (date: Date): string =>
  `${String(date.getDate()).padStart(2, '0')} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`;

export const monthTitle = (date: Date): string => `${MONTH_NAMES[date.getMonth()]} ${date.getFullYear()}`;

export const weekdayOf = (value: string): string => WEEKDAYS[parseDate(value).getDay()];

/** Single day prints once; a span prints "start – end" with the template's en dash. */
export const dateRangeLabel = (holiday: Holiday): string =>
  holiday.start === holiday.end ? holiday.start : `${holiday.start} – ${holiday.end}`;

/**
 * The template's relative badges ("in 1w", "7mo ago") are only consistent with a
 * reference of 25 Jul 2026, so the page pins that rather than using the real clock —
 * the whole dataset is 2026 and a live date would render every badge nonsense.
 */
export const REFERENCE_DATE = new Date(2026, 6, 25);

const DAY_MS = 24 * 60 * 60 * 1000;

/** Reproduces the template's badge wording: days, then weeks, then months. */
export const relativeLabel = (value: string): { text: string; past: boolean } => {
  const days = Math.round((parseDate(value).getTime() - REFERENCE_DATE.getTime()) / DAY_MS);
  const magnitude = Math.abs(days);
  const past = days < 0;

  let text: string;
  if (magnitude < 7) text = `${magnitude}d`;
  else if (magnitude < 30) text = `${Math.round(magnitude / 7)}w`;
  else text = `${Math.round(magnitude / 30)}mo`;

  return { text: past ? `${text} ago` : `in ${text}`, past };
};

/** True when `date` falls anywhere inside the holiday's span, ends included. */
export const covers = (holiday: Holiday, date: Date): boolean => {
  const time = date.getTime();
  return time >= parseDate(holiday.start).getTime() && time <= parseDate(holiday.end).getTime();
};

export interface CalendarCell {
  date: Date;
  day: number;
  /** Belongs to a neighbouring month — the template's `.is-out`. */
  outside: boolean;
  weekend: boolean;
  events: Holiday[];
}

/**
 * The six-week grid behind `.hol-cal`, always 42 cells so the layout never jumps.
 * The template hand-wrote these for August 2026 only; deriving them is what lets
 * the prev / next / Today buttons do anything.
 */
export const buildCalendar = (month: Date, visible: Holiday[]): CalendarCell[] => {
  const first = new Date(month.getFullYear(), month.getMonth(), 1);
  const start = new Date(first);
  start.setDate(first.getDate() - first.getDay());

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(start.getFullYear(), start.getMonth(), start.getDate() + index);
    const weekday = date.getDay();
    return {
      date,
      day: date.getDate(),
      outside: date.getMonth() !== month.getMonth(),
      weekend: weekday === 0 || weekday === 6,
      events: visible.filter((holiday) => covers(holiday, date)),
    };
  });
};

/* -------------------------------- Workspace -------------------------------- */

export const yearOptions = ['2026', '2025', '2027'];
export const academicYearOptions = ['2025 / 2026', '2024 / 2025'];
export const branchOptions = ['Main Campus', 'North Wing', 'South Wing'];
export const categoryFilterOptions = ['Public', 'School', 'Festival', 'Examination', 'Optional'];

export const savedViews: { id: string; label: string; icon: string }[] = [
  { id: 'all', label: 'All Holidays', icon: 'ti ti-layout-list' },
  { id: 'Public', label: 'Public Holidays', icon: 'ti ti-flag' },
  { id: 'Festival', label: 'Festival Holidays', icon: 'ti ti-confetti' },
  { id: 'Examination', label: 'Examination Holidays', icon: 'ti ti-pencil' },
  { id: 'Optional', label: 'Optional Holidays', icon: 'ti ti-star' },
];

/** The quick-filter rail under the toolbar; "Exam" is abbreviated as the template has it. */
export const quickFilters: { id: HolidayCategory; label: string; icon: string }[] = [
  { id: 'Public', label: 'Public', icon: 'ti ti-flag' },
  { id: 'School', label: 'School', icon: 'ti ti-school' },
  { id: 'Festival', label: 'Festival', icon: 'ti ti-confetti' },
  { id: 'Examination', label: 'Exam', icon: 'ti ti-pencil' },
  { id: 'Optional', label: 'Optional', icon: 'ti ti-star' },
];

/**
 * Quick Statistics keeps the template's school-wide figures. They deliberately
 * exceed the fourteen records on this page (24 total, 8 public) because the
 * template counts every academic year, not just the one on screen.
 */
export const quickStats = [
  { id: 'total', modifier: 'hol-stat--primary', icon: 'ti ti-calendar-event', value: '24', label: 'Total Holidays' },
  { id: 'upcoming', modifier: 'hol-stat--success', icon: 'ti ti-calendar-up', value: '9', label: 'Upcoming' },
  { id: 'optional', modifier: 'hol-stat--teal', icon: 'ti ti-star', value: '4', label: 'Optional' },
  { id: 'public', modifier: 'hol-stat--danger', icon: 'ti ti-flag', value: '8', label: 'Public' },
];

/** The calendar opens on August 2026, the month the template drew. */
export const DEFAULT_MONTH = new Date(2026, 7, 1);

export const ACADEMIC_YEAR = '2025 / 2026';

/** The attachment shown in the offcanvas and the notice dialog. */
export const noticeFile = { name: 'holiday-notice.pdf', size: '142 KB', issuedBy: 'HR Office' };
