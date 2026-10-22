import type { ApexOptions } from 'apexcharts';
import type { Stat } from '../../shared/StatStrip';

/* ------------------------------------------------------------------ *
 * The month, school-wide                                             *
 * ------------------------------------------------------------------ */

export const INCIDENTS = 42;
export const MERITS = 318;
export const DEMERITS = 64;
export const OPEN_CASES = 7;
export const REPEAT_OFFENDERS = 5;
export const AVERAGE_SCORE = 82;

/** Where the template calls the average score "Good". */
export const GOOD_SCORE = 75;

export const STATS: Stat[] = [
  {
    id: 'incidents',
    label: 'Incidents',
    value: String(INCIDENTS),
    icon: 'ti ti-alert-triangle',
    tint: 'danger',
    badge: { label: 'Month', tint: 'danger' },
  },
  { id: 'merits', label: 'Merits', value: String(MERITS), icon: 'ti ti-thumb-up', tint: 'success' },
  {
    id: 'demerits',
    label: 'Demerits',
    value: String(DEMERITS),
    icon: 'ti ti-thumb-down',
    tint: 'warning',
  },
  {
    id: 'open',
    label: 'Open Cases',
    value: String(OPEN_CASES),
    icon: 'ti ti-folder-open',
    tint: 'info',
  },
  {
    id: 'repeat',
    label: 'Repeat Offenders',
    value: String(REPEAT_OFFENDERS),
    icon: 'ti ti-repeat',
    tint: 'secondary',
  },
  {
    id: 'score',
    label: 'Avg Behavior Score',
    value: String(AVERAGE_SCORE),
    icon: 'ti ti-mood-smile',
    tint: 'primary',
    badge: {
      label: AVERAGE_SCORE >= GOOD_SCORE ? 'Good' : 'Watch',
      tint: AVERAGE_SCORE >= GOOD_SCORE ? 'success' : 'warning',
    },
  },
];

/* ------------------------------------------------------------------ *
 * The incident log                                                   *
 * ------------------------------------------------------------------ */

export type Severity = 'Merit' | 'Minor' | 'Major';

export interface Incident {
  id: string;
  student: string;
  photo: string;
  className: string;
  category: string;
  /** Points awarded or deducted. The severity follows from this. */
  points: number;
  action: string;
  date: string;
}

export const INCIDENT_LOG: Incident[] = [
  {
    id: 'liam',
    student: 'Liam Walker',
    photo: 'assets/img/students/student-04.jpg',
    className: 'IV-B',
    category: 'Late to class',
    points: -2,
    action: 'Warning',
    date: '08 Jul 2026',
  },
  {
    id: 'janet',
    student: 'Janet Daniel',
    photo: 'assets/img/students/student-01.jpg',
    className: 'III-A',
    category: 'Helped classmate',
    points: 5,
    action: 'Appreciation',
    date: '07 Jul 2026',
  },
  {
    id: 'george',
    student: 'George Kettut',
    photo: 'assets/img/students/student-02.jpg',
    className: 'II-A',
    category: 'Disruptive behavior',
    points: -5,
    action: 'Parent meeting',
    date: '06 Jul 2026',
  },
];

/** Where a deduction stops being minor. */
export const MAJOR_AT = -4;

/** The severity is the points, read: a gain is a merit, a big loss is major. */
export const severityOf = (row: Incident): Severity => {
  if (row.points > 0) return 'Merit';
  return row.points <= MAJOR_AT ? 'Major' : 'Minor';
};

export const severityTint = (severity: Severity) =>
  ({ Merit: 'success', Minor: 'warning', Major: 'danger' })[severity];

/** Points print with their sign, and take the colour of their direction. */
export const pointsLabelOf = (row: Incident) =>
  row.points > 0 ? `+${row.points}` : String(row.points);

export const pointsClassOf = (row: Incident) =>
  row.points > 0 ? 'text-success' : 'text-danger';

export const SEVERITIES: Severity[] = ['Minor', 'Major'];

export const CATEGORIES = ['Late to class', 'Disruptive behavior', 'Uniform violation'];

/* ------------------------------------------------------------------ *
 * The charts                                                         *
 * ------------------------------------------------------------------ */

export const TREND_MONTHS = ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];

export const trendSeries = [
  { name: 'Merits', data: [60, 72, 68, 80, 75, 90] },
  { name: 'Demerits', data: [14, 10, 16, 9, 12, 8] },
];

export const trendOptions: ApexOptions = {
  chart: { type: 'line', height: 300, toolbar: { show: false } },
  xaxis: { categories: TREND_MONTHS },
  colors: ['#0ca678', '#e7515a'],
  stroke: { curve: 'smooth', width: 3 },
  dataLabels: { enabled: false },
  legend: { position: 'top' },
};

export const TYPE_BREAKDOWN = [
  { label: 'Late', count: 18, colour: '#f39c12' },
  { label: 'Disruptive', count: 12, colour: '#e7515a' },
  { label: 'Uniform', count: 8, colour: '#3577f1' },
  { label: 'Other', count: 4, colour: '#6c757d' },
];

export const typesSeries = TYPE_BREAKDOWN.map((slice) => slice.count);

export const typesOptions: ApexOptions = {
  chart: { type: 'donut', height: 290 },
  labels: TYPE_BREAKDOWN.map((slice) => slice.label),
  colors: TYPE_BREAKDOWN.map((slice) => slice.colour),
  legend: { position: 'bottom' },
  dataLabels: { enabled: false },
};

/** The donut's slices add to the month's incident count. */
export const BREAKDOWN_TOTAL = typesSeries.reduce((total, count) => total + count, 0);
