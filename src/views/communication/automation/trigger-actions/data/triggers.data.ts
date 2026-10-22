export type EventType =
  | 'Record created' | 'Record updated' | 'Field changed' | 'Scheduled'
  | 'Date reached' | 'Threshold crossed' | 'Manual' | 'Webhook';

export type ActionType =
  | 'Send notification' | 'Create record' | 'Update field' | 'Assign task'
  | 'Call webhook' | 'Generate document' | 'Route for approval' | 'Write log';

export type Module =
  | 'Admissions' | 'Attendance' | 'Fees' | 'Examinations' | 'Library'
  | 'Transport' | 'Hostel' | 'HR' | 'Inventory' | 'AI';

export type Health = 'Healthy' | 'Degraded' | 'Failing' | 'Idle';

export type Status = 'Enabled' | 'Paused' | 'Draft';

export interface TriggerAction {
  id: string;
  name: string;
  description: string;

  module: Module;
  /** The event the system watches for. */
  event: EventType;
  eventSource: string;
  /** What it runs in response. */
  action: ActionType;
  actionTarget: string;

  /** The workflow this binding belongs to, where it belongs to one. */
  workflow: string;

  /** How many times the event has fired, and how many ran clean. */
  fired: number;
  succeeded: number;
  /** Total execution time across every run, in milliseconds. */
  totalMs: number;

  /** The day the binding was armed. */
  armedOn: string;
  lastFired: string;
  /** The error the last failure returned. */
  lastError: string;

  enabled: boolean;
  draft: boolean;
  owner: string;
  /** Runs without touching real records. */
  testMode: boolean;
}

/* --------------------------------- Tints ----------------------------------- */

export const healthBadge: Record<Health, string> = {
  Healthy: 'badge badge-soft-success',
  Degraded: 'badge badge-soft-warning',
  Failing: 'badge badge-soft-danger',
  Idle: 'badge badge-soft-secondary',
};

export const healthPill: Record<Health, string> = {
  Healthy: 'is-completed',
  Degraded: 'is-review',
  Failing: 'is-blocked',
  Idle: 'is-pending',
};

export const statusBadge: Record<Status, string> = {
  Enabled: 'badge badge-soft-success',
  Paused: 'badge badge-soft-secondary',
  Draft: 'badge badge-soft-warning',
};

export const eventIcon: Record<EventType, string> = {
  'Record created': 'ti ti-plus',
  'Record updated': 'ti ti-edit',
  'Field changed': 'ti ti-pencil',
  Scheduled: 'ti ti-clock',
  'Date reached': 'ti ti-calendar-event',
  'Threshold crossed': 'ti ti-chart-line',
  Manual: 'ti ti-hand-click',
  Webhook: 'ti ti-webhook',
};

export const actionIcon: Record<ActionType, string> = {
  'Send notification': 'ti ti-bell',
  'Create record': 'ti ti-folder-plus',
  'Update field': 'ti ti-pencil',
  'Assign task': 'ti ti-user-check',
  'Call webhook': 'ti ti-webhook',
  'Generate document': 'ti ti-file-text',
  'Route for approval': 'ti ti-route',
  'Write log': 'ti ti-list-details',
};

export const moduleIcon: Record<Module, string> = {
  Admissions: 'ti ti-user-plus',
  Attendance: 'ti ti-calendar-x',
  Fees: 'ti ti-report-money',
  Examinations: 'ti ti-file-certificate',
  Library: 'ti ti-books',
  Transport: 'ti ti-bus',
  Hostel: 'ti ti-building-community',
  HR: 'ti ti-id-badge-2',
  Inventory: 'ti ti-package',
  AI: 'ti ti-sparkles',
};

/* ------------------------------ Filter options ------------------------------ */

export const moduleOptions: Module[] = [
  'Admissions', 'Attendance', 'Fees', 'Examinations', 'Library',
  'Transport', 'Hostel', 'HR', 'Inventory', 'AI',
];

export const eventOptions: EventType[] = [
  'Record created', 'Record updated', 'Field changed', 'Scheduled',
  'Date reached', 'Threshold crossed', 'Manual', 'Webhook',
];

export const actionOptions: ActionType[] = [
  'Send notification', 'Create record', 'Update field', 'Assign task',
  'Call webhook', 'Generate document', 'Route for approval', 'Write log',
];

export const healthOptions: Health[] = ['Healthy', 'Degraded', 'Failing', 'Idle'];

export const statusOptions: Status[] = ['Enabled', 'Paused', 'Draft'];

export const ownerOptions = ['Ms. Latha Rao', 'Mr. Arun Prakash', 'Ms. Divya Nair', 'System'];

/* ------------------------------- Derivations -------------------------------- */

export const REGISTER_DATE = '2 Aug 2026';

/** Where a binding stops being healthy, and where it starts failing. */
export const HEALTHY_RATE = 98;
export const DEGRADED_RATE = 90;

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const dateKey = (value: string): number => {
  if (!value) return 0;
  const [day, month, year] = value.split(' ');
  const index = months.indexOf(month);
  if (index === -1) return 0;
  return Number(year) * 10000 + (index + 1) * 100 + Number(day);
};

const dayNumber = (value: string): number => {
  if (!value) return 0;
  const [day, month, year] = value.split(' ');
  const index = months.indexOf(month);
  if (index === -1) return 0;
  return Math.round(Date.UTC(Number(year), index, Number(day)) / 86_400_000);
};

export const daysBetween = (from: string, to: string): number => dayNumber(to) - dayNumber(from);

export const dayText = (days: number): string =>
  `${Math.abs(days)} ${Math.abs(days) === 1 ? 'day' : 'days'}`;

export const hasFired = (row: TriggerAction): boolean => row.fired > 0;

export const failedOf = (row: TriggerAction): number => Math.max(0, row.fired - row.succeeded);

export const successRateOf = (row: TriggerAction): number =>
  (row.fired > 0 ? Math.round((row.succeeded / row.fired) * 100) : 0);

/** Where the binding sits, on its own success rate. */
export const healthOf = (row: TriggerAction): Health => {
  if (!hasFired(row)) return 'Idle';
  const rate = successRateOf(row);
  if (rate >= HEALTHY_RATE) return 'Healthy';
  return rate >= DEGRADED_RATE ? 'Degraded' : 'Failing';
};

export const healthSubLabelOf = (row: TriggerAction): string => {
  if (!hasFired(row)) return 'Never fired';
  const failed = failedOf(row);
  return failed === 0
    ? `${row.fired.toLocaleString()} clean runs`
    : `${failed} of ${row.fired.toLocaleString()} failed`;
};

/** Average execution time, which is where a slow binding shows itself. */
export const averageLatencyOf = (row: TriggerAction): number =>
  (row.fired > 0 ? Math.round(row.totalMs / row.fired) : 0);

export const latencyLabelOf = (row: TriggerAction): string => {
  if (!hasFired(row)) return '—';
  const ms = averageLatencyOf(row);
  return ms >= 1000 ? `${(ms / 1000).toFixed(1)}s` : `${ms}ms`;
};

/** Slow enough to be worth looking at before it starts timing out. */
export const isSlow = (row: TriggerAction): boolean => averageLatencyOf(row) >= 1000;

export const daysLiveOf = (row: TriggerAction): number =>
  Math.max(1, daysBetween(row.armedOn, REGISTER_DATE));

/** Fires a day, so a binding armed yesterday is not judged against one from January. */
export const firesPerDayOf = (row: TriggerAction): number =>
  (hasFired(row) ? Number((row.fired / daysLiveOf(row)).toFixed(1)) : 0);

export const statusOf = (row: TriggerAction): Status => {
  if (row.draft) return 'Draft';
  return row.enabled ? 'Enabled' : 'Paused';
};

export const lastFiredLabelOf = (row: TriggerAction): string => {
  if (!row.lastFired) return 'Never';
  const days = daysBetween(row.lastFired, REGISTER_DATE);
  if (days === 0) return 'Today';
  return days === 1 ? 'Yesterday' : `${dayText(days)} ago`;
};

/** The binding as one line: on this event, do this. */
export const bindingOf = (row: TriggerAction): string =>
  `On ${row.event.toLowerCase()} of ${row.eventSource} → ${row.action.toLowerCase()} · ${row.actionTarget}`;

export const isFailing = (row: TriggerAction): boolean => healthOf(row) === 'Failing';
export const isIdle = (row: TriggerAction): boolean => healthOf(row) === 'Idle';
export const isPaused = (row: TriggerAction): boolean => statusOf(row) === 'Paused';
export const isDraft = (row: TriggerAction): boolean => statusOf(row) === 'Draft';
export const isTestMode = (row: TriggerAction): boolean => row.testMode;

export interface Pair {
  label: string;
  value: string;
}

export const bindingPairsOf = (row: TriggerAction): Pair[] => [
  { label: 'Reference', value: row.id },
  { label: 'Module', value: row.module },
  { label: 'Event', value: `${row.event} · ${row.eventSource}` },
  { label: 'Action', value: `${row.action} · ${row.actionTarget}` },
  { label: 'Workflow', value: row.workflow || 'Standalone binding' },
  { label: 'Owner', value: row.owner },
];

export const runPairsOf = (row: TriggerAction): Pair[] => [
  { label: 'Fired', value: row.fired.toLocaleString() },
  { label: 'Succeeded', value: row.succeeded.toLocaleString() },
  { label: 'Failed', value: String(failedOf(row)) },
  { label: 'Success rate', value: hasFired(row) ? `${successRateOf(row)}%` : '—' },
  { label: 'Average latency', value: latencyLabelOf(row) },
  { label: 'Fires a day', value: hasFired(row) ? String(firesPerDayOf(row)) : '—' },
];

export const lifePairsOf = (row: TriggerAction): Pair[] => [
  { label: 'Armed on', value: row.armedOn },
  { label: 'Days live', value: String(daysLiveOf(row)) },
  { label: 'Last fired', value: `${row.lastFired || 'Never'} · ${lastFiredLabelOf(row)}` },
  { label: 'Test mode', value: row.testMode ? 'On — no records touched' : 'Off' },
];

export const searchIndexOf = (row: TriggerAction): string =>
  [row.id, row.name, row.description, row.module, row.event, row.eventSource, row.action, row.actionTarget, row.workflow, row.owner]
    .join(' ')
    .toLowerCase();

/* --------------------------------- Summary ---------------------------------- */

export const TOTAL_COUNT = 42;

export const SUMMARY_TOTALS = {
  bindings: 42,
  enabled: 31,
  failing: 3,
  idle: 5,
};

/* ---------------------------------- Rows ------------------------------------ */

export const triggerActions: TriggerAction[] = [
  {
    id: 'TRG-001', name: 'Invoice overdue → charge late fee',
    description: 'Fires the morning after an invoice passes its due date and applies the standing 2% charge.',
    module: 'Fees', event: 'Date reached', eventSource: 'invoice.due_date',
    action: 'Update field', actionTarget: 'invoice.late_fee',
    workflow: 'Late fee on overdue invoice',
    fired: 318, succeeded: 318, totalMs: 47_700,
    armedOn: '12 Jan 2026', lastFired: '2 Aug 2026', lastError: '',
    enabled: true, draft: false, owner: 'Ms. Divya Nair', testMode: false,
  },
  {
    id: 'TRG-002', name: 'Register locked → notify absentees',
    description: 'Waits for the attendance lock rather than the marking, so a correction never produces a false alert.',
    module: 'Attendance', event: 'Scheduled', eventSource: '10:15 on school days',
    action: 'Send notification', actionTarget: 'Parents of absentees',
    workflow: 'Absence alert to parents',
    fired: 1204, succeeded: 1204, totalMs: 96_320,
    armedOn: '06 Jan 2026', lastFired: '2 Aug 2026', lastError: '',
    enabled: true, draft: false, owner: 'System', testMode: false,
  },
  {
    id: 'TRG-003', name: 'Admission approved → create student',
    description: 'The heaviest binding on the system — it writes four records and queues a fifth.',
    module: 'Admissions', event: 'Field changed', eventSource: 'admission.status',
    action: 'Create record', actionTarget: 'student + ledger + roll no.',
    workflow: 'Admission approved → enrol student',
    fired: 42, succeeded: 42, totalMs: 63_000,
    armedOn: '15 Jan 2026', lastFired: '1 Aug 2026', lastError: '',
    enabled: true, draft: false, owner: 'Ms. Latha Rao', testMode: false,
  },
  {
    id: 'TRG-004', name: 'Results published → notify parents',
    description: 'Failing since the Result Published template was rejected — the notification step throws every time.',
    module: 'Examinations', event: 'Record updated', eventSource: 'exam.marks_locked',
    action: 'Send notification', actionTarget: 'Students, Parents',
    workflow: 'Publish exam result',
    fired: 12, succeeded: 8, totalMs: 9_600,
    armedOn: '20 Jan 2026', lastFired: '18 Jul 2026',
    lastError: 'Template REJECTED by provider — link domain unverified.',
    enabled: true, draft: false, owner: 'Mr. Arun Prakash', testMode: false,
  },
  {
    id: 'TRG-005', name: 'Loan overdue → remind member',
    description: 'Paused with the catalogue migration; the overdue list it reads is unreliable until that finishes.',
    module: 'Library', event: 'Date reached', eventSource: 'loan.due_date + 3d',
    action: 'Send notification', actionTarget: 'Member and class teacher',
    workflow: 'Overdue book reminder',
    fired: 96, succeeded: 96, totalMs: 7_680,
    armedOn: '10 Feb 2026', lastFired: '25 Jun 2026', lastError: '',
    enabled: false, draft: false, owner: 'Mr. Suresh Babu', testMode: false,
  },
  {
    id: 'TRG-006', name: 'Leave submitted → route for approval',
    description: 'Routes by duration and balance, escalating past the department head where either exceeds the rule.',
    module: 'HR', event: 'Record created', eventSource: 'leave_request',
    action: 'Route for approval', actionTarget: 'Principal or HOD',
    workflow: 'Leave request routing',
    fired: 67, succeeded: 66, totalMs: 20_100,
    armedOn: '02 Feb 2026', lastFired: '31 Jul 2026',
    lastError: 'Approver on leave — routed to the fallback after a retry.',
    enabled: true, draft: false, owner: 'Ms. Divya Nair', testMode: false,
  },
  {
    id: 'TRG-007', name: 'Vehicle behind schedule → alert families',
    description: 'Reads the GPS feed rather than a driver report, so it fires before anyone calls in.',
    module: 'Transport', event: 'Threshold crossed', eventSource: 'vehicle.delay > 10 min',
    action: 'Send notification', actionTarget: 'Route families',
    workflow: 'Bus delay notification',
    fired: 23, succeeded: 23, totalMs: 2_990,
    armedOn: '18 Mar 2026', lastFired: '2 Aug 2026', lastError: '',
    enabled: true, draft: false, owner: 'Mr. Arun Prakash', testMode: false,
  },
  {
    id: 'TRG-008', name: 'Stock below reorder level → raise request',
    description: 'Armed in April and has not fired since — worth checking whether the reorder level is set at all.',
    module: 'Inventory', event: 'Threshold crossed', eventSource: 'stock.available < reorder_level',
    action: 'Create record', actionTarget: 'purchase_request',
    workflow: 'Stock reorder alert',
    fired: 0, succeeded: 0, totalMs: 0,
    armedOn: '04 Apr 2026', lastFired: '', lastError: '',
    enabled: true, draft: false, owner: 'Mr. Arun Prakash', testMode: false,
  },
  {
    id: 'TRG-009', name: 'Risk score crosses threshold → open case',
    description: 'Drafted against the AI risk score and held until the counselling team agrees the threshold.',
    module: 'AI', event: 'Threshold crossed', eventSource: 'ai.risk_score > 0.75',
    action: 'Create record', actionTarget: 'counselling_case',
    workflow: 'At-risk student escalation',
    fired: 0, succeeded: 0, totalMs: 0,
    armedOn: '1 Aug 2026', lastFired: '', lastError: '',
    enabled: false, draft: true, owner: 'Ms. Latha Rao', testMode: true,
  },
  {
    id: 'TRG-010', name: 'Fee paid → post receipt to ledger',
    description: 'The slowest binding on the board — it waits on the payment gateway before it writes anything.',
    module: 'Fees', event: 'Webhook', eventSource: 'gateway.payment_success',
    action: 'Call webhook', actionTarget: 'ledger.post_receipt',
    workflow: '',
    fired: 592, succeeded: 578, totalMs: 1_006_400,
    armedOn: '08 Jan 2026', lastFired: '1 Aug 2026',
    lastError: 'Gateway timeout after 8s — the receipt was posted on retry.',
    enabled: true, draft: false, owner: 'System', testMode: false,
  },
];
