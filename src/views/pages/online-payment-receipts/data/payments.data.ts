import type { ApexOptions } from 'apexcharts';
import type { Stat } from '../../shared/StatStrip';

/* ------------------------------------------------------------------ *
 * The day                                                            *
 * ------------------------------------------------------------------ */

export const COLLECTION = '$42.6K';
export const SUCCESS_RATE = 97.2;
export const FAILED = 14;
export const REFUNDS = '$1.2K';
export const PENDING_SETTLEMENT = '$8.4K';
export const RECEIPTS_ISSUED = 318;

export const STATS: Stat[] = [
  {
    id: 'collection',
    label: 'Online Collection',
    value: COLLECTION,
    icon: 'ti ti-credit-card',
    tint: 'primary',
    badge: { label: 'Today', tint: 'success' },
  },
  {
    id: 'rate',
    label: 'Success Rate',
    value: `${SUCCESS_RATE}%`,
    icon: 'ti ti-circle-check',
    tint: 'success',
  },
  { id: 'failed', label: 'Failed', value: String(FAILED), icon: 'ti ti-alert-triangle', tint: 'danger' },
  { id: 'refunds', label: 'Refunds', value: REFUNDS, icon: 'ti ti-arrow-back-up', tint: 'warning' },
  {
    id: 'settlement',
    label: 'Pending Settlement',
    value: PENDING_SETTLEMENT,
    icon: 'ti ti-building-bank',
    tint: 'info',
  },
  {
    id: 'receipts',
    label: 'Receipts Issued',
    value: String(RECEIPTS_ISSUED),
    icon: 'ti ti-receipt',
    tint: 'secondary',
  },
];

/* ------------------------------------------------------------------ *
 * The transactions                                                   *
 * ------------------------------------------------------------------ */

export type PaymentState = 'Success' | 'Failed' | 'Refunded';

export interface Transaction {
  id: string;
  student: string;
  photo: string;
  amount: number;
  mode: string;
  date: string;
  state: PaymentState;
}

export const TRANSACTIONS: Transaction[] = [
  {
    id: 'TXN-88213',
    student: 'Janet Daniel',
    photo: 'assets/img/students/student-01.jpg',
    amount: 1500,
    mode: 'Card',
    date: '08 Jul 2026',
    state: 'Success',
  },
  {
    id: 'TXN-88214',
    student: 'George Kettut',
    photo: 'assets/img/students/student-02.jpg',
    amount: 900,
    mode: 'UPI',
    date: '08 Jul 2026',
    state: 'Failed',
  },
  {
    id: 'TXN-88210',
    student: 'Sophia Reyes',
    photo: 'assets/img/students/student-03.jpg',
    amount: 600,
    mode: 'Net Banking',
    date: '07 Jul 2026',
    state: 'Refunded',
  },
];

export const money = (amount: number) => `$${amount.toLocaleString('en-US')}`;

export const stateTint = (state: PaymentState) =>
  ({ Success: 'success', Failed: 'danger', Refunded: 'warning' })[state];

/** A payment that never went through has no receipt to print. */
export const hasReceiptOf = (row: Transaction) => row.state !== 'Failed';

export const STATES: PaymentState[] = ['Success', 'Failed', 'Refunded'];

export const RANGE = '01 Jul 2026 - 08 Jul 2026';

export const GATEWAYS = ['Stripe', 'Razorpay', 'PayPal'];

/* ------------------------------------------------------------------ *
 * The receipt                                                        *
 * ------------------------------------------------------------------ */

export const RECEIPT = {
  school: 'Karkaii International',
  title: 'Fee Payment Receipt',
  number: 'RCPT-88213',
  student: TRANSACTIONS[0].student,
  amount: money(TRANSACTIONS[0].amount),
  status: 'Paid',
};

/* ------------------------------------------------------------------ *
 * The charts                                                         *
 * ------------------------------------------------------------------ */

export const TREND_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export const trendSeries = [{ name: 'Collection ($K)', data: [28, 34, 31, 42, 38, 46, 43] }];

export const trendOptions: ApexOptions = {
  chart: { type: 'area', height: 300, toolbar: { show: false } },
  xaxis: { categories: TREND_DAYS },
  colors: ['#3577f1'],
  stroke: { curve: 'smooth', width: 3 },
  fill: { type: 'gradient', gradient: { opacityFrom: 0.4, opacityTo: 0.05 } },
  dataLabels: { enabled: false },
};

export const MODES = [
  { label: 'Card', share: 48, colour: '#3577f1' },
  { label: 'UPI', share: 26, colour: '#0ca678' },
  { label: 'Net Banking', share: 18, colour: '#f39c12' },
  { label: 'Wallet', share: 8, colour: '#6c757d' },
];

export const modeSeries = MODES.map((mode) => mode.share);

export const modeOptions: ApexOptions = {
  chart: { type: 'donut', height: 290 },
  labels: MODES.map((mode) => mode.label),
  colors: MODES.map((mode) => mode.colour),
  legend: { position: 'bottom' },
  dataLabels: { enabled: false },
};

/** The mode shares are percentages, so they add to a hundred. */
export const MODE_TOTAL = modeSeries.reduce((total, share) => total + share, 0);
