import type { ApexOptions } from 'apexcharts';
import type { Stat } from '../../shared/StatStrip';

/* ------------------------------------------------------------------ *
 * The programme                                                      *
 * ------------------------------------------------------------------ */

export const SCHEMES = 14;
export const APPLICANTS = 248;
export const AWARDED = 162;
export const BUDGET = '$420K';
export const DISBURSED = '$286K';
export const PENDING = 34;

export const STATS: Stat[] = [
  { id: 'schemes', label: 'Schemes', value: String(SCHEMES), icon: 'ti ti-award', tint: 'primary' },
  { id: 'applicants', label: 'Applicants', value: String(APPLICANTS), icon: 'ti ti-users', tint: 'info' },
  { id: 'awarded', label: 'Awarded', value: String(AWARDED), icon: 'ti ti-circle-check', tint: 'success' },
  { id: 'budget', label: 'Budget', value: BUDGET, icon: 'ti ti-cash', tint: 'secondary' },
  { id: 'disbursed', label: 'Disbursed', value: DISBURSED, icon: 'ti ti-wallet', tint: 'warning' },
  { id: 'pending', label: 'Pending', value: String(PENDING), icon: 'ti ti-clock-hour-4', tint: 'danger' },
];

/* ------------------------------------------------------------------ *
 * The applications                                                   *
 * ------------------------------------------------------------------ */

export type AwardState = 'Awarded' | 'Pending' | 'Declined';

export interface Application {
  id: string;
  student: string;
  photo: string;
  className: string;
  scheme: string;
  amount: number;
  criteria: string;
  state: AwardState;
}

export const APPLICATIONS: Application[] = [
  {
    id: 'sophia',
    student: 'Sophia Reyes',
    photo: 'assets/img/students/student-03.jpg',
    className: 'III-A',
    scheme: 'Merit Excellence',
    amount: 1200,
    criteria: 'GPA 9.2',
    state: 'Awarded',
  },
  {
    id: 'george',
    student: 'George Kettut',
    photo: 'assets/img/students/student-02.jpg',
    className: 'II-A',
    scheme: 'Need-based Aid',
    amount: 1800,
    criteria: 'Income',
    state: 'Pending',
  },
  {
    id: 'janet',
    student: 'Janet Daniel',
    photo: 'assets/img/students/student-01.jpg',
    className: 'III-A',
    scheme: 'Sports Talent',
    amount: 900,
    criteria: 'State level',
    state: 'Awarded',
  },
];

export const money = (amount: number) => `$${amount.toLocaleString('en-US')}`;

export const stateTint = (state: AwardState) =>
  ({ Awarded: 'success', Pending: 'warning', Declined: 'danger' })[state];

export const SCHEME_TYPES = ['Merit', 'Need-based', 'Sports'];

/* ------------------------------------------------------------------ *
 * The chart                                                          *
 * ------------------------------------------------------------------ */

export const BY_SCHEME = [
  { scheme: 'Merit', budget: 120, disbursed: 100 },
  { scheme: 'Need-based', budget: 90, disbursed: 70 },
  { scheme: 'Sports', budget: 80, disbursed: 60 },
  { scheme: 'Arts', budget: 70, disbursed: 40 },
  { scheme: 'Staff Ward', budget: 60, disbursed: 16 },
];

export const budgetSeries = [
  { name: 'Budget', data: BY_SCHEME.map((row) => row.budget) },
  { name: 'Disbursed', data: BY_SCHEME.map((row) => row.disbursed) },
];

export const budgetOptions: ApexOptions = {
  chart: { type: 'bar', height: 300, toolbar: { show: false } },
  xaxis: { categories: BY_SCHEME.map((row) => row.scheme) },
  colors: ['#3577f1', '#0ca678'],
  plotOptions: { bar: { borderRadius: 4, columnWidth: '50%' } },
  dataLabels: { enabled: false },
  legend: { position: 'top' },
};

/** How much of the allocated budget has actually gone out. */
export const utilisationOf = () => {
  const budget = BY_SCHEME.reduce((total, row) => total + row.budget, 0);
  const disbursed = BY_SCHEME.reduce((total, row) => total + row.disbursed, 0);
  return Math.round((disbursed / budget) * 100);
};
