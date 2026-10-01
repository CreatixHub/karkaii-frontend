import type { ApexOptions } from 'apexcharts';
import type { Stat } from '../../shared/StatStrip';

/* ------------------------------------------------------------------ *
 * The day, system-wide                                               *
 * ------------------------------------------------------------------ */

export const EVENTS_TODAY = 1284;
export const LOGINS = 642;
export const DATA_CHANGES = 418;
export const FAILED_LOGINS = 17;
export const EXPORTS = 54;
export const FLAGGED = 6;

export const STATS: Stat[] = [
  {
    id: 'events',
    label: 'Events Today',
    value: EVENTS_TODAY.toLocaleString('en-US'),
    icon: 'ti ti-history',
    tint: 'primary',
    badge: { label: 'Today', tint: 'success' },
  },
  { id: 'logins', label: 'Logins', value: String(LOGINS), icon: 'ti ti-login', tint: 'success' },
  {
    id: 'changes',
    label: 'Data Changes',
    value: String(DATA_CHANGES),
    icon: 'ti ti-edit',
    tint: 'info',
  },
  {
    id: 'failed',
    label: 'Failed Logins',
    value: String(FAILED_LOGINS),
    icon: 'ti ti-lock-x',
    tint: 'danger',
  },
  { id: 'exports', label: 'Exports', value: String(EXPORTS), icon: 'ti ti-file-export', tint: 'warning' },
  { id: 'flagged', label: 'Flagged', value: String(FLAGGED), icon: 'ti ti-flag', tint: 'secondary' },
];

/* ------------------------------------------------------------------ *
 * The trail                                                          *
 * ------------------------------------------------------------------ */

export type AuditAction = 'Updated' | 'Login' | 'Failed Login' | 'Exported' | 'Deleted' | 'Created';

export interface AuditEntry {
  id: string;
  user: string;
  photo: string;
  action: AuditAction;
  module: string;
  ip: string;
  at: string;
}

export const TRAIL: AuditEntry[] = [
  {
    id: 'kevin',
    user: 'Kevin Larry',
    photo: 'assets/img/profiles/avatar-27.jpg',
    action: 'Updated',
    module: 'Students',
    ip: '192.168.1.24',
    at: '08 Jul 2026, 10:24 AM',
  },
  {
    id: 'teena',
    user: 'Teena Mathew',
    photo: 'assets/img/profiles/avatar-23.jpg',
    action: 'Login',
    module: 'Auth',
    ip: '192.168.1.40',
    at: '08 Jul 2026, 09:02 AM',
  },
  {
    id: 'unknown',
    user: 'Unknown',
    photo: 'assets/img/profiles/avatar-25.jpg',
    action: 'Failed Login',
    module: 'Auth',
    ip: '203.0.113.9',
    at: '08 Jul 2026, 08:47 AM',
  },
  {
    id: 'daniel',
    user: 'Daniel Josua',
    photo: 'assets/img/profiles/avatar-01.jpg',
    action: 'Exported',
    module: 'Fees',
    ip: '192.168.1.31',
    at: '07 Jul 2026, 04:15 PM',
  },
];

/** The badge takes its colour from what the action actually is. */
export const actionTint = (action: AuditAction) =>
  ({
    Updated: 'info',
    Created: 'primary',
    Login: 'success',
    'Failed Login': 'danger',
    Exported: 'warning',
    Deleted: 'danger',
  })[action];

export const MODULES = ['Students', 'Fees', 'Users'];

export const RANGE = '08 Jul 2026';

/* ------------------------------------------------------------------ *
 * The detail dialog                                                  *
 * ------------------------------------------------------------------ */

export interface FieldChange {
  field: string;
  before: string;
  after: string;
}

export const DETAIL = {
  user: 'Kevin Larry (Administrator)',
  action: 'Updated student record',
  module: 'Students · AD9892434',
  ip: '192.168.1.24',
  changes: [
    { field: 'Phone', before: '+1 65465 21345', after: '+1 65465 99999' },
    { field: 'Section', before: 'A', after: 'B' },
  ] as FieldChange[],
};

/* ------------------------------------------------------------------ *
 * The charts                                                         *
 * ------------------------------------------------------------------ */

export const BY_MODULE = [
  { module: 'Students', events: 320 },
  { module: 'Fees', events: 280 },
  { module: 'Auth', events: 210 },
  { module: 'Users', events: 180 },
  { module: 'Exams', events: 140 },
  { module: 'Settings', events: 120 },
];

export const moduleSeries = [{ name: 'Events', data: BY_MODULE.map((row) => row.events) }];

export const moduleOptions: ApexOptions = {
  chart: { type: 'bar', height: 300, toolbar: { show: false } },
  xaxis: { categories: BY_MODULE.map((row) => row.module) },
  colors: ['#3577f1'],
  plotOptions: { bar: { borderRadius: 4, columnWidth: '45%' } },
  dataLabels: { enabled: false },
};

/** The donut is the day's own tiles, so it cannot disagree with them. */
export const BY_TYPE = [
  { label: 'Login', count: LOGINS, colour: '#0ca678' },
  { label: 'Update', count: DATA_CHANGES, colour: '#3577f1' },
  { label: 'Export', count: EXPORTS, colour: '#f39c12' },
  { label: 'Failed', count: FAILED_LOGINS, colour: '#e7515a' },
];

export const typeSeries = BY_TYPE.map((slice) => slice.count);

export const typeOptions: ApexOptions = {
  chart: { type: 'donut', height: 290 },
  labels: BY_TYPE.map((slice) => slice.label),
  colors: BY_TYPE.map((slice) => slice.colour),
  legend: { position: 'bottom' },
  dataLabels: { enabled: false },
};
