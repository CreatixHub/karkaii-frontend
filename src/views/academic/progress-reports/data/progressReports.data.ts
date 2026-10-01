export type ProgressGrade = 'A+' | 'A' | 'B+' | 'B' | 'C';

/** Whether a report has been published to parents or is still awaiting review. */
export type ProgressStatus = 'Active' | 'Pending';

export interface ProgressReportRow {
  /** Slug of the student name — the template ships no record ids. */
  id: string;
  student: string;
  /** The printed Class label, e.g. `Grade 9 · A`. */
  className: string;
  classLevel: number;
  section: string;
  metric: string;
  /** Whole percent; the cell renders `{score}%` exactly as the template does. */
  score: number;
  grade: ProgressGrade;
  /** The row's badge classes, verbatim from the template. */
  gradeClass: string;
  status: ProgressStatus;
  /** ISO date, so range comparisons are plain string comparisons. */
  recordedOn: string;
  academicYear: string;
}

export const progressReportRows: ProgressReportRow[] = [
  {
    id: 'aaron-cooper',
    student: 'Aaron Cooper',
    className: 'Grade 9 · A',
    classLevel: 9,
    section: 'A',
    metric: 'Attendance',
    score: 72,
    grade: 'A+',
    gradeClass: 'badge badge-soft-success',
    status: 'Active',
    recordedOn: '2026-07-02',
    academicYear: '2024 / 2025',
  },
  {
    id: 'bianca-reid',
    student: 'Bianca Reid',
    className: 'Grade 9 · B',
    classLevel: 9,
    section: 'B',
    metric: 'Mathematics',
    score: 75,
    grade: 'A',
    gradeClass: 'badge badge-soft-success',
    status: 'Active',
    recordedOn: '2026-07-04',
    academicYear: '2024 / 2025',
  },
  {
    id: 'carlos-mendez',
    student: 'Carlos Mendez',
    className: 'Grade 10 · A',
    classLevel: 10,
    section: 'A',
    metric: 'Science',
    score: 78,
    grade: 'B+',
    gradeClass: 'badge badge-soft-info',
    status: 'Active',
    recordedOn: '2026-07-09',
    academicYear: '2024 / 2025',
  },
  {
    id: 'dana-white',
    student: 'Dana White',
    className: 'Grade 10 · B',
    classLevel: 10,
    section: 'B',
    metric: 'English',
    score: 81,
    grade: 'B',
    gradeClass: 'badge badge-soft-warning',
    status: 'Active',
    recordedOn: '2026-07-13',
    academicYear: '2024 / 2025',
  },
  {
    id: 'ethan-brooks',
    student: 'Ethan Brooks',
    className: 'Grade 11 · A',
    classLevel: 11,
    section: 'A',
    metric: 'Overall',
    score: 84,
    grade: 'A',
    gradeClass: 'badge badge-soft-success',
    status: 'Active',
    recordedOn: '2026-07-18',
    academicYear: '2024 / 2025',
  },
  {
    id: 'fatima-noor',
    student: 'Fatima Noor',
    className: 'Grade 11 · B',
    classLevel: 11,
    section: 'B',
    metric: 'Physics',
    score: 87,
    grade: 'C',
    gradeClass: 'badge badge-soft-danger',
    status: 'Pending',
    recordedOn: '2026-07-22',
    academicYear: '2024 / 2025',
  },
  {
    id: 'grace-lee',
    student: 'Grace Lee',
    className: 'Grade 12 · A',
    classLevel: 12,
    section: 'A',
    metric: 'Chemistry',
    score: 90,
    grade: 'A+',
    gradeClass: 'badge badge-soft-success',
    status: 'Active',
    recordedOn: '2026-06-26',
    academicYear: '2024 / 2025',
  },
  {
    id: 'hassan-ali',
    student: 'Hassan Ali',
    className: 'Grade 12 · B',
    classLevel: 12,
    section: 'B',
    metric: 'Biology',
    score: 93,
    grade: 'B',
    gradeClass: 'badge badge-soft-info',
    status: 'Pending',
    recordedOn: '2026-06-30',
    academicYear: '2024 / 2025',
  },
];

/* -------------------------------------------------------------------------- */
/*                               Summary cards                                */
/* -------------------------------------------------------------------------- */

export type StatCardId = 'total' | 'active' | 'pending' | 'month';

export interface ProgressStatCard {
  id: StatCardId;
  label: string;
  icon: string;
  /** Bootstrap tone, expanded to `bg-<tone>-transparent text-<tone>` on the avatar. */
  tone: string;
}

export const statCards: ProgressStatCard[] = [
  { id: 'total', label: 'Total Records', icon: 'ti ti-school', tone: 'primary' },
  { id: 'active', label: 'Active', icon: 'ti ti-circle-check', tone: 'success' },
  { id: 'pending', label: 'Pending', icon: 'ti ti-clock', tone: 'warning' },
  { id: 'month', label: 'This Month', icon: 'ti ti-calendar', tone: 'info' },
];

/**
 * The month "This Month" counts. The template's date-range placeholder puts the
 * page in July 2026, so the card is anchored there rather than to the real clock —
 * the dataset would otherwise fall out of the card the month after a build.
 */
export const REFERENCE_MONTH = '2026-07';

export const countStats = (rows: ProgressReportRow[]): Record<StatCardId, number> => ({
  total: rows.length,
  active: rows.filter((row) => row.status === 'Active').length,
  pending: rows.filter((row) => row.status === 'Pending').length,
  month: rows.filter((row) => row.recordedOn.startsWith(REFERENCE_MONTH)).length,
});

/* -------------------------------------------------------------------------- */
/*                                  Filters                                   */
/* -------------------------------------------------------------------------- */

/** L1525 — the first option is the one the template renders selected. */
export const academicYearOptions = ['2024 / 2025', '2023 / 2024'];

/** L1526 — "All Classes" is the pass-through option. */
export const classOptions = ['All Classes', 'Grade 10 · A', 'Grade 11 · B'];

export const ALL_CLASSES = classOptions[0];

/** L1527 — the placeholder doubles as the format the input parses. */
export const DATE_RANGE_PLACEHOLDER = '01 Jul 2026 - 26 Jul 2026';

export interface ProgressFilterState {
  academicYear: string;
  className: string;
  /** Free text in the template's own `DD Mon YYYY - DD Mon YYYY` shape; empty means "any date". */
  dateRange: string;
}

export const defaultFilters: ProgressFilterState = {
  academicYear: academicYearOptions[0],
  className: ALL_CLASSES,
  dateRange: '',
};

export interface DateRange {
  from: string;
  to: string;
}

const MONTHS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

/** `01 Jul 2026` → `2026-07-01`, or null when the text is not a date. */
const parseDate = (text: string): string | null => {
  const match = /^(\d{1,2})\s+([a-z]+)\s+(\d{4})$/i.exec(text.trim());
  if (!match) return null;

  const month = MONTHS.indexOf(match[2].slice(0, 3).toLowerCase());
  const day = Number(match[1]);
  if (month < 0 || day < 1 || day > 31) return null;

  return `${match[3]}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
};

/**
 * Parses the date-range input. The template wired no picker to it, so the field is
 * plain text and this accepts what the placeholder advertises. A reversed range is
 * normalised rather than rejected.
 */
export const parseDateRange = (text: string): DateRange | null => {
  const parts = text.split(/\s*-\s*/);
  if (parts.length !== 2) return null;

  const from = parseDate(parts[0]);
  const to = parseDate(parts[1]);
  if (!from || !to) return null;

  return from <= to ? { from, to } : { from: to, to: from };
};

export const filterRows = (rows: ProgressReportRow[], filters: ProgressFilterState): ProgressReportRow[] => {
  const range = parseDateRange(filters.dateRange);

  return rows.filter((row) => {
    if (row.academicYear !== filters.academicYear) return false;
    if (filters.className !== ALL_CLASSES && row.className !== filters.className) return false;
    if (range && (row.recordedOn < range.from || row.recordedOn > range.to)) return false;
    return true;
  });
};

/* -------------------------------------------------------------------------- */
/*                              Table and sorting                             */
/* -------------------------------------------------------------------------- */

export type SortKey = 'student' | 'class' | 'metric' | 'score' | 'grade';

export interface ProgressTableHeader {
  key: SortKey;
  label: string;
}

/** L1540 — the thead, in order. The template marked no header sortable; all five are here. */
export const tableHeaders: ProgressTableHeader[] = [
  { key: 'student', label: 'Student' },
  { key: 'class', label: 'Class' },
  { key: 'metric', label: 'Metric' },
  { key: 'score', label: 'Score' },
  { key: 'grade', label: 'Grade' },
];

/** Highest grade last, so a "descending" sort puts A+ on top. */
const GRADE_ORDER: Record<ProgressGrade, number> = {
  C: 0,
  B: 1,
  'B+': 2,
  A: 3,
  'A+': 4,
};

export const compareRows = (a: ProgressReportRow, b: ProgressReportRow, key: SortKey): number => {
  switch (key) {
    case 'student':
      return a.student.localeCompare(b.student);
    case 'class':
      return a.classLevel - b.classLevel || a.section.localeCompare(b.section);
    case 'metric':
      return a.metric.localeCompare(b.metric);
    case 'score':
      return a.score - b.score;
    case 'grade':
      return GRADE_ORDER[a.grade] - GRADE_ORDER[b.grade];
    default:
      return 0;
  }
};

/* -------------------------------------------------------------------------- */
/*                              Header actions                                */
/* -------------------------------------------------------------------------- */

/** L1471 — the Export dropdown's two entries. */
export const exportActions: { id: string; label: string; icon: string }[] = [
  { id: 'pdf', label: 'PDF', icon: 'ti ti-file-type-pdf' },
  { id: 'excel', label: 'Excel', icon: 'ti ti-file-type-xls' },
];

/**
 * Toast copy. This page has no `tables.js` entry to lift strings from, so the
 * wording follows the engine's house style used by the other Academic pages.
 */
export const actionToasts: Record<string, string> = {
  refresh: 'Progress reports refreshed.',
  pdf: 'Progress reports exported as PDF.',
  excel: 'Progress reports exported as Excel.',
  download: 'Preparing the progress report download.',
  invalid_range: `Enter a date range like ${DATE_RANGE_PLACEHOLDER}.`,
};
