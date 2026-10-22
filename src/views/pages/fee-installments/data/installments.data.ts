import type { ApexOptions } from 'apexcharts';
import type { Stat } from '../../shared/StatStrip';

/* ------------------------------------------------------------------ *
 * The fee book                                                       *
 * ------------------------------------------------------------------ */

export const ACTIVE_PLANS = 36;
export const INSTALLMENTS_DUE = 248;
export const COLLECTED = '$1.9M';
export const OUTSTANDING = '$248K';
export const OVERDUE = 64;
export const LATE_FEES = '$12K';

/** Collected against billed, school-wide. */
export const COLLECTION_RATE = 88;

export const STATS: Stat[] = [
  {
    id: 'plans',
    label: 'Active Plans',
    value: String(ACTIVE_PLANS),
    icon: 'ti ti-calendar-dollar',
    tint: 'primary',
  },
  {
    id: 'due',
    label: 'Installments Due',
    value: String(INSTALLMENTS_DUE),
    icon: 'ti ti-clock-hour-4',
    tint: 'warning',
  },
  {
    id: 'collected',
    label: 'Collected',
    value: COLLECTED,
    icon: 'ti ti-cash',
    tint: 'success',
    badge: { label: `${COLLECTION_RATE}%`, tint: 'success' },
  },
  {
    id: 'outstanding',
    label: 'Outstanding',
    value: OUTSTANDING,
    icon: 'ti ti-alert-triangle',
    tint: 'danger',
  },
  { id: 'overdue', label: 'Overdue', value: String(OVERDUE), icon: 'ti ti-calendar-x', tint: 'secondary' },
  { id: 'late', label: 'Late Fees', value: LATE_FEES, icon: 'ti ti-receipt-tax', tint: 'info' },
];

/* ------------------------------------------------------------------ *
 * The plans                                                          *
 * ------------------------------------------------------------------ */

export interface Plan {
  id: string;
  name: string;
  className: string;
  installments: number;
  /** What the plan bills in total, and what has come in against it. */
  total: number;
  collected: number;
  active: boolean;
}

export const PLANS: Plan[] = [
  {
    id: 'annual',
    name: 'Class I - Annual (3)',
    className: 'I',
    installments: 3,
    total: 1500,
    collected: 1000,
    active: true,
  },
  {
    id: 'termly',
    name: 'Class III - Termly (2)',
    className: 'III',
    installments: 2,
    total: 1800,
    collected: 900,
    active: true,
  },
  {
    id: 'monthly',
    name: 'Class V - Monthly (10)',
    className: 'V',
    installments: 10,
    total: 2400,
    collected: 1680,
    active: true,
  },
];

export const money = (amount: number) => `$${amount.toLocaleString('en-US')}`;

/** The template floors its progress: 1,000 of 1,500 prints as 66%, not 67%. */
export const progressOf = (plan: Plan) =>
  plan.total === 0 ? 0 : Math.floor((plan.collected / plan.total) * 100);

/** Where the bar stops being green. */
export const HEALTHY_AT = 60;

export const progressTintOf = (plan: Plan) =>
  progressOf(plan) >= HEALTHY_AT ? 'success' : 'warning';

export const CLASSES = ['I', 'II', 'III'];

export const LATE_FEE_RULES = ['Flat $10/week', '2% per month', 'None'];

/* ------------------------------------------------------------------ *
 * The schedule dialog                                                *
 * ------------------------------------------------------------------ */

export interface ScheduleRow {
  number: number;
  dueOn: string;
  amount: number;
  paid: boolean;
}

export const SCHEDULE: ScheduleRow[] = [
  { number: 1, dueOn: '05 Apr 2026', amount: 500, paid: true },
  { number: 2, dueOn: '05 Aug 2026', amount: 500, paid: true },
  { number: 3, dueOn: '05 Dec 2026', amount: 500, paid: false },
];

/** A row says Paid or Due; nothing else is stored about its state. */
export const scheduleStatusOf = (row: ScheduleRow) => (row.paid ? 'Paid' : 'Due');

export const scheduleTintOf = (row: ScheduleRow) => (row.paid ? 'success' : 'warning');

/* ------------------------------------------------------------------ *
 * The chart                                                          *
 * ------------------------------------------------------------------ */

export const BY_INSTALLMENT = [
  { label: 'Installment 1', collected: 620, due: 80 },
  { label: 'Installment 2', collected: 540, due: 120 },
  { label: 'Installment 3', collected: 480, due: 160 },
  { label: 'Installment 4', collected: 410, due: 210 },
];

export const chartSeries = [
  { name: 'Collected', data: BY_INSTALLMENT.map((row) => row.collected) },
  { name: 'Due', data: BY_INSTALLMENT.map((row) => row.due) },
];

export const chartOptions: ApexOptions = {
  chart: { type: 'bar', height: 300, toolbar: { show: false } },
  xaxis: { categories: BY_INSTALLMENT.map((row) => row.label) },
  colors: ['#0ca678', '#e7515a'],
  plotOptions: { bar: { borderRadius: 4, columnWidth: '45%' } },
  dataLabels: { enabled: false },
  legend: { position: 'top' },
};
