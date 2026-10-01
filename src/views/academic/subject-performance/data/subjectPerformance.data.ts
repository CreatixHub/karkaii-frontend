/* -------------------------------------------------------------------------- */
/*                                    Rows                                    */
/* -------------------------------------------------------------------------- */

/** The two options the Academic Year select offers — `subject-performance.html` L1525. */
export type AcademicYear = '2024 / 2025' | '2023 / 2024';

export const academicYears: AcademicYear[] = ['2024 / 2025', '2023 / 2024'];

export interface PerformanceRow {
  /** Stable row key; the template's rows carry no id of their own. */
  id: string;
  student: string;
  className: string;
  metric: string;
  /** The template prints "72%"; the number is kept so the column can sort and average. */
  score: number;
  grade: string;
  /** `.badge` modifier the template paired with this grade. */
  gradeBadge: string;
  academicYear: AcademicYear;
  /** ISO date, used by the Date Range filter and the "This Month" card. */
  recordedOn: string;
}

export const performanceRows: PerformanceRow[] = [
  {
    id: 'SP01',
    student: 'Aaron Cooper',
    className: 'Grade 9 · A',
    metric: 'Attendance',
    score: 72,
    grade: 'A+',
    gradeBadge: 'badge-soft-success',
    academicYear: '2024 / 2025',
    recordedOn: '2026-06-24',
  },
  {
    id: 'SP02',
    student: 'Bianca Reid',
    className: 'Grade 9 · B',
    metric: 'Mathematics',
    score: 75,
    grade: 'A',
    gradeBadge: 'badge-soft-success',
    academicYear: '2024 / 2025',
    recordedOn: '2026-06-29',
  },
  {
    id: 'SP03',
    student: 'Carlos Mendez',
    className: 'Grade 10 · A',
    metric: 'Science',
    score: 78,
    grade: 'B+',
    gradeBadge: 'badge-soft-info',
    academicYear: '2024 / 2025',
    recordedOn: '2026-07-02',
  },
  {
    id: 'SP04',
    student: 'Dana White',
    className: 'Grade 10 · B',
    metric: 'English',
    score: 81,
    grade: 'B',
    gradeBadge: 'badge-soft-warning',
    academicYear: '2024 / 2025',
    recordedOn: '2026-07-06',
  },
  {
    id: 'SP05',
    student: 'Ethan Brooks',
    className: 'Grade 11 · A',
    metric: 'Overall',
    score: 84,
    grade: 'A',
    gradeBadge: 'badge-soft-success',
    academicYear: '2024 / 2025',
    recordedOn: '2026-07-10',
  },
  {
    id: 'SP06',
    student: 'Fatima Noor',
    className: 'Grade 11 · B',
    metric: 'Physics',
    score: 87,
    grade: 'C',
    gradeBadge: 'badge-soft-danger',
    academicYear: '2024 / 2025',
    recordedOn: '2026-07-15',
  },
  {
    id: 'SP07',
    student: 'Grace Lee',
    className: 'Grade 12 · A',
    metric: 'Chemistry',
    score: 90,
    grade: 'A+',
    gradeBadge: 'badge-soft-success',
    academicYear: '2024 / 2025',
    recordedOn: '2026-07-20',
  },
  {
    id: 'SP08',
    student: 'Hassan Ali',
    className: 'Grade 12 · B',
    metric: 'Biology',
    score: 93,
    grade: 'B',
    gradeBadge: 'badge-soft-info',
    academicYear: '2024 / 2025',
    recordedOn: '2026-07-24',
  },
];

/* -------------------------------------------------------------------------- */
/*                                   Filters                                  */
/* -------------------------------------------------------------------------- */

/** First option of the Class select — `subject-performance.html` L1526. */
export const ALL_CLASSES = 'All Classes';

/**
 * The template hard-codes only two of the eight classes its own table renders, which
 * would leave six rows unreachable. The list is derived instead, keeping the template's
 * "All Classes" sentinel first and the rows' shipped order after it.
 */
export const classOptions: string[] = [
  ALL_CLASSES,
  ...Array.from(new Set(performanceRows.map((row) => row.className))),
];

/** Placeholder copy of the Date Range input — `subject-performance.html` L1527. */
export const dateRangePlaceholder = '01 Jul 2026 - 26 Jul 2026';

export interface DateRange {
  from: number;
  to: number;
}

const MONTHS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

const parseDay = (value: string): number | null => {
  const match = /^(\d{1,2})\s+([a-z]{3})[a-z]*\s+(\d{4})$/i.exec(value.trim());
  if (!match) return null;

  const month = MONTHS.indexOf(match[2].toLowerCase());
  if (month < 0) return null;

  return Date.UTC(Number(match[3]), month, Number(match[1]));
};

/**
 * Reads the "01 Jul 2026 - 26 Jul 2026" shape the input's placeholder advertises. The
 * template wired a daterangepicker here but never loaded its script (L1600 is an empty
 * comment), so the box is a plain text field and the range is parsed by hand. Both an
 * ASCII hyphen and an en dash separate the halves. `null` means "not a range".
 */
export const parseDateRange = (value: string): DateRange | null => {
  const halves = value.split(/\s[-–]\s/);
  if (halves.length !== 2) return null;

  const from = parseDay(halves[0]);
  const to = parseDay(halves[1]);
  if (from === null || to === null || from > to) return null;

  return { from, to };
};

export const withinRange = (row: PerformanceRow, range: DateRange): boolean => {
  const recorded = Date.parse(`${row.recordedOn}T00:00:00Z`);
  return recorded >= range.from && recorded <= range.to;
};

/* -------------------------------------------------------------------------- */
/*                                   Sorting                                  */
/* -------------------------------------------------------------------------- */

export type SortKey = 'student' | 'class' | 'metric' | 'score' | 'grade';

export interface PerformanceColumn {
  key: SortKey;
  label: string;
}

/** The five headers of the table — `subject-performance.html` L1540. */
export const performanceColumns: PerformanceColumn[] = [
  { key: 'student', label: 'Student' },
  { key: 'class', label: 'Class' },
  { key: 'metric', label: 'Metric' },
  { key: 'score', label: 'Score' },
  { key: 'grade', label: 'Grade' },
];

/** Best grade first, so a descending sort puts the strongest records on top. */
const GRADE_ORDER = ['A+', 'A', 'B+', 'B', 'C+', 'C', 'D', 'F'];

const gradeRank = (grade: string): number => {
  const index = GRADE_ORDER.indexOf(grade);
  return index < 0 ? GRADE_ORDER.length : index;
};

/**
 * "Grade 10 · A" must sort after "Grade 9 · B", which a plain string compare gets wrong,
 * so the year is weighted and the section rides along as its character code.
 */
const classRank = (className: string): number => {
  const match = /Grade\s+(\d+)\s*·\s*([A-Z])/.exec(className);
  if (!match) return Number.MAX_SAFE_INTEGER;
  return Number(match[1]) * 100 + match[2].charCodeAt(0);
};

export const compareRows = (a: PerformanceRow, b: PerformanceRow, key: SortKey): number => {
  switch (key) {
    case 'student':
      return a.student.localeCompare(b.student);
    case 'class':
      return classRank(a.className) - classRank(b.className);
    case 'metric':
      return a.metric.localeCompare(b.metric);
    case 'score':
      return a.score - b.score;
    case 'grade':
      return gradeRank(a.grade) - gradeRank(b.grade);
  }
};

/* -------------------------------------------------------------------------- */
/*                                Summary cards                               */
/* -------------------------------------------------------------------------- */

export type StatId = 'total' | 'active' | 'pending' | 'month';

export interface StatCard {
  id: StatId;
  label: string;
  icon: string;
  /** The `avatar` tone the template paired with the card. */
  tone: string;
}

/** The four cards, label / icon / tone verbatim — `subject-performance.html` L1476–1521. */
export const statCards: StatCard[] = [
  { id: 'total', label: 'Total Records', icon: 'ti ti-school', tone: 'bg-primary-transparent text-primary' },
  { id: 'active', label: 'Active', icon: 'ti ti-circle-check', tone: 'bg-success-transparent text-success' },
  { id: 'pending', label: 'Pending', icon: 'ti ti-clock', tone: 'bg-warning-transparent text-warning' },
  { id: 'month', label: 'This Month', icon: 'ti ti-calendar', tone: 'bg-info-transparent text-info' },
];

/** A record grades out at A or B; anything weaker is held back for review. */
const isPassing = (grade: string): boolean => grade.startsWith('A') || grade.startsWith('B');

/**
 * The month the newest record falls in, so "This Month" keeps one meaning while the
 * filters move underneath it. Taken from the full set, not the filtered one.
 */
const LATEST_MONTH = performanceRows
  .map((row) => row.recordedOn.slice(0, 7))
  .reduce((latest, month) => (month > latest ? month : latest), '');

/**
 * The template hard-coded 1,248 / 1,120 / 86 / 214 against an eight-row table. The counts
 * are read off the rows in view instead: how many records there are, how many graded a
 * pass, how many are held for review, and how many were recorded in the newest month.
 */
export const summarise = (rows: PerformanceRow[]): Record<StatId, number> => {
  const active = rows.filter((row) => isPassing(row.grade)).length;

  return {
    total: rows.length,
    active,
    pending: rows.length - active,
    month: rows.filter((row) => row.recordedOn.startsWith(LATEST_MONTH)).length,
  };
};

/* -------------------------------------------------------------------------- */
/*                             Actions and copy                               */
/* -------------------------------------------------------------------------- */

export interface ExportAction {
  id: string;
  label: string;
  icon: string;
}

/** The Export dropdown — `subject-performance.html` L1471. */
export const exportActions: ExportAction[] = [
  { id: 'pdf', label: 'PDF', icon: 'ti ti-file-type-pdf' },
  { id: 'excel', label: 'Excel', icon: 'ti ti-file-type-xls' },
];

/**
 * This page has no entry in `assets/js/tables.js`, so there is no shipped toast copy to
 * transcribe. These follow the wording the engine uses for the same actions elsewhere.
 */
export const actionToasts: Record<string, string> = {
  refresh: 'Subject performance refreshed.',
  pdf: 'PDF export queued for download.',
  excel: 'Excel workbook queued for download.',
  download: 'Preparing export…',
  reset: 'Filters cleared.',
  invalid_range: `Enter a date range like ${dateRangePlaceholder}.`,
};

export const strings = {
  applied: (shown: number, total: number, year: string) =>
    `Showing ${shown} of ${total} record(s) for ${year}.`,
  sorted: (label: string, ascending: boolean) =>
    `Sorted by ${label}, ${ascending ? 'ascending' : 'descending'}.`,
};
