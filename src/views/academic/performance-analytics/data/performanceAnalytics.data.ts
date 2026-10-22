/** The four classes the ranking table names; roman numerals as the template writes them. */
export type ClassLevel = 'II' | 'III' | 'IV' | 'V';

/** `all` is the template's own "All Classes" default. */
export type ClassFilterValue = 'all' | ClassLevel;

export type TrendDirection = 'up' | 'down';

export interface ClassTrend {
  direction: TrendDirection;
  /** Points gained or lost against the previous term. */
  value: number;
}

export interface ClassCohort {
  id: ClassLevel;
  /** The label the ranking table prints, e.g. `III-A`. */
  label: string;
  /** Students in the class — the weight behind every aggregate on the page. */
  strength: number;
  avgPercent: number;
  attendance: number;
  trend: ClassTrend;
  gpa: number;
  gpaDelta: number;
  passRate: number;
  passDelta: number;
  atRisk: number;
  /** Year-on-year improvement, the template's `+4.6%` card. */
  improvement: number;
}

/**
 * Avg % / attendance / trend are read straight off the ranking table; the rest
 * are the class-level figures the six stat cards aggregate.
 */
export const classCohorts: ClassCohort[] = [
  {
    id: 'II',
    label: 'II-A',
    strength: 152,
    avgPercent: 89.1,
    attendance: 91,
    trend: { direction: 'up', value: 0.5 },
    gpa: 7.9,
    gpaDelta: 1.7,
    passRate: 88,
    passDelta: 1.0,
    atRisk: 42,
    improvement: 3.9,
  },
  {
    id: 'III',
    label: 'III-A',
    strength: 208,
    avgPercent: 94.2,
    attendance: 96,
    trend: { direction: 'up', value: 2.1 },
    gpa: 8.9,
    gpaDelta: 2.4,
    passRate: 94,
    passDelta: 1.7,
    atRisk: 22,
    improvement: 5.2,
  },
  {
    id: 'IV',
    label: 'IV-C',
    strength: 176,
    avgPercent: 90.6,
    attendance: 93,
    trend: { direction: 'down', value: 0.8 },
    gpa: 8.2,
    gpaDelta: 2.0,
    passRate: 90,
    passDelta: 1.3,
    atRisk: 34,
    improvement: 4.3,
  },
  {
    id: 'V',
    label: 'V-B',
    strength: 184,
    avgPercent: 92.8,
    attendance: 94,
    trend: { direction: 'up', value: 1.4 },
    gpa: 8.6,
    gpaDelta: 2.2,
    passRate: 92,
    passDelta: 1.5,
    atRisk: 30,
    improvement: 4.8,
  },
];

const cohortById = new Map(classCohorts.map((cohort) => [cohort.id, cohort]));

/* -------------------------------- Ranking --------------------------------- */

export interface RankingRow {
  id: string;
  rank: number;
  classId: ClassLevel;
}

/** `performance-analytics.html` L1497–1502, ranks 1–6, duplicates and all. */
export const rankingRows: RankingRow[] = [
  { id: 'pa-rank-1', rank: 1, classId: 'III' },
  { id: 'pa-rank-2', rank: 2, classId: 'V' },
  { id: 'pa-rank-3', rank: 3, classId: 'IV' },
  { id: 'pa-rank-4', rank: 4, classId: 'II' },
  { id: 'pa-rank-5', rank: 5, classId: 'V' },
  { id: 'pa-rank-6', rank: 6, classId: 'IV' },
];

/** A ranking row flattened with its cohort, ready for the table cells. */
export interface RankingRowView {
  id: string;
  rank: number;
  classId: ClassLevel;
  label: string;
  avgPercent: number;
  attendance: number;
  trend: ClassTrend;
}

/* --------------------------------- Filter --------------------------------- */

export interface ClassFilterOption {
  value: ClassFilterValue;
  label: string;
}

/**
 * The template's dropdown offers `All Classes` and `Class III` (L1473). Those two
 * labels are kept verbatim and the remaining three classes named by the ranking
 * table follow the same wording, so the filter can actually reach every row.
 */
export const classFilterOptions: ClassFilterOption[] = [
  { value: 'all', label: 'All Classes' },
  { value: 'II', label: 'Class II' },
  { value: 'III', label: 'Class III' },
  { value: 'IV', label: 'Class IV' },
  { value: 'V', label: 'Class V' },
];

export const labelForFilter = (value: ClassFilterValue): string =>
  classFilterOptions.find((option) => option.value === value)?.label ?? 'All Classes';

/** The cohorts a filter keeps — all four, or the single class it names. */
export const cohortsFor = (value: ClassFilterValue): ClassCohort[] => {
  if (value === 'all') return classCohorts;
  const cohort = cohortById.get(value);
  return cohort ? [cohort] : [];
};

/** The ranking rows a filter keeps, joined to their cohort for rendering. */
export const rankingViewFor = (value: ClassFilterValue): RankingRowView[] =>
  rankingRows
    .filter((row) => value === 'all' || row.classId === value)
    .map((row) => {
      const cohort = cohortById.get(row.classId);
      return {
        id: row.id,
        rank: row.rank,
        classId: row.classId,
        label: cohort?.label ?? row.classId,
        avgPercent: cohort?.avgPercent ?? 0,
        attendance: cohort?.attendance ?? 0,
        trend: cohort?.trend ?? { direction: 'up', value: 0 },
      };
    });

/* ------------------------------- Aggregates -------------------------------- */

/**
 * Classes differ in size, so every headline number is weighted by strength — an
 * unweighted mean would let the smallest class pull the school average around.
 */
const weightedMean = (cohorts: ClassCohort[], pick: (cohort: ClassCohort) => number): number => {
  const strength = cohorts.reduce((total, cohort) => total + cohort.strength, 0);
  if (strength === 0) return 0;
  return cohorts.reduce((total, cohort) => total + pick(cohort) * cohort.strength, 0) / strength;
};

/** Baselines the chart offsets are measured against: the whole-school figures. */
const BASELINE_AVG_PERCENT = weightedMean(classCohorts, (cohort) => cohort.avgPercent);
const BASELINE_ATTENDANCE = weightedMean(classCohorts, (cohort) => cohort.attendance);

export interface ChartOffsets {
  /** Whole points to shift the trend and radar scores by. */
  marks: number;
  /** Whole points to shift the scatter's attendance axis by. */
  attendance: number;
}

/**
 * How far the selected class sits from the school as a whole, rounded to whole
 * points because the template's series are whole numbers. `all` shifts nothing.
 */
export const chartOffsetsFor = (value: ClassFilterValue): ChartOffsets => {
  if (value === 'all') return { marks: 0, attendance: 0 };
  const cohort = cohortById.get(value);
  if (!cohort) return { marks: 0, attendance: 0 };
  return {
    marks: Math.round(cohort.avgPercent - BASELINE_AVG_PERCENT),
    attendance: Math.round(cohort.attendance - BASELINE_ATTENDANCE),
  };
};

/* ------------------------------- Stat cards -------------------------------- */

export interface StatBadge {
  label: string;
  className: string;
}

export interface StatCard {
  id: string;
  label: string;
  value: string;
  icon: string;
  iconClass: string;
  variant: string;
  badge?: StatBadge;
}

const oneDecimal = (value: number) => value.toFixed(1);

/** The template writes its deltas as `+2.1`; a fall would read `-2.1`. */
const signed = (value: number) => `${value < 0 ? '-' : '+'}${Math.abs(value).toFixed(1)}`;

const deltaBadge = (value: number): StatBadge => ({
  label: signed(value),
  className: value < 0 ? 'badge-soft-danger' : 'badge-soft-success',
});

/**
 * The six cards of `performance-analytics.html` L1479–1484, in the template's
 * order, with every figure recomputed from the cohorts still in scope. Icons,
 * accent classes and captions are the template's.
 */
export const buildStatCards = (cohorts: ClassCohort[]): StatCard[] => {
  const gpa = weightedMean(cohorts, (cohort) => cohort.gpa);
  const attendance = weightedMean(cohorts, (cohort) => cohort.attendance);
  const passRate = weightedMean(cohorts, (cohort) => cohort.passRate);
  const improvement = weightedMean(cohorts, (cohort) => cohort.improvement);
  const gpaDelta = weightedMean(cohorts, (cohort) => cohort.gpaDelta);
  const passDelta = weightedMean(cohorts, (cohort) => cohort.passDelta);
  const atRisk = cohorts.reduce((total, cohort) => total + cohort.atRisk, 0);
  const topClass = cohorts.reduce<ClassCohort | null>(
    (best, cohort) => (best && best.avgPercent >= cohort.avgPercent ? best : cohort),
    null,
  );

  return [
    {
      id: 'pa-stat-gpa',
      label: 'Avg GPA',
      value: oneDecimal(gpa),
      icon: 'ti ti-award',
      iconClass: 'bg-primary-transparent text-primary',
      variant: 'stat-primary',
      badge: deltaBadge(gpaDelta),
    },
    {
      id: 'pa-stat-attendance',
      label: 'Attendance %',
      value: `${oneDecimal(attendance)}%`,
      icon: 'ti ti-calendar-check',
      iconClass: 'bg-info-transparent text-info',
      variant: 'stat-info',
    },
    {
      id: 'pa-stat-pass',
      label: 'Pass %',
      value: `${oneDecimal(passRate)}%`,
      icon: 'ti ti-checks',
      iconClass: 'bg-success-transparent text-success',
      variant: 'stat-success',
      badge: deltaBadge(passDelta),
    },
    {
      id: 'pa-stat-risk',
      label: 'At-risk Students',
      value: String(atRisk),
      icon: 'ti ti-alert-triangle',
      iconClass: 'bg-danger-transparent text-danger',
      variant: 'stat-danger',
    },
    {
      id: 'pa-stat-top',
      label: 'Top Class',
      value: topClass?.label ?? '—',
      icon: 'ti ti-trophy',
      iconClass: 'bg-secondary-transparent text-secondary',
      variant: 'stat-secondary',
    },
    {
      id: 'pa-stat-improvement',
      label: 'Improvement',
      value: `${signed(improvement)}%`,
      icon: 'ti ti-trending-up',
      iconClass: 'bg-warning-transparent text-warning',
      variant: 'stat-warning',
      badge: { label: 'YoY', className: 'badge-soft-success' },
    },
  ];
};

/* --------------------------------- Toasts ---------------------------------- */

/**
 * `tables.js` has no `PAGE_CONFIG` entry for this page — it is a report, not one
 * of the workspace tables — so the copy below follows the same voice as the
 * entries that do exist.
 */
export const actionToasts: Record<string, string> = {
  print: 'Sending performance analytics to the printer…',
  export: 'Performance analytics export queued for download.',
};

export const scopeToast = (label: string): string =>
  label === 'All Classes'
    ? 'Analytics reset to all classes.'
    : `Analytics scoped to ${label}.`;
