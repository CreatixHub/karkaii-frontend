export type Cadence = 'Every 15 minutes' | 'Hourly' | 'Daily' | 'Weekly' | 'Monthly' | 'Termly';

export type Category =
  | 'Notifications' | 'Reports' | 'Maintenance' | 'Backup' | 'Billing' | 'Sync';

export type Status = 'Scheduled' | 'Running' | 'Overdue' | 'Paused' | 'Failing';

export interface Task {
  id: string;
  name: string;
  description: string;
  category: Category;

  cadence: Cadence;
  /** "10:15" — the time of day the task runs at, where the cadence has one. */
  atTime: string;
  /** "Monday" or "1st", for weekly and monthly cadences. */
  onDay: string;

  /** Minutes since the last run started; -1 when it has never run. */
  lastRunAgo: number;
  /** Seconds the last run took. */
  lastDurationSec: number;
  /** Total seconds across every run, and how many there have been. */
  totalSec: number;
  runs: number;
  failures: number;

  /** Set while a run is in flight. */
  running: boolean;
  paused: boolean;
  /** What the last failure returned. */
  lastError: string;

  owner: string;
  /** What the task writes to or touches. */
  target: string;
  /** Whether a missed occurrence is run late or skipped. */
  catchUp: boolean;
}

/* --------------------------------- Tints ----------------------------------- */

export const statusBadge: Record<Status, string> = {
  Scheduled: 'badge badge-soft-info',
  Running: 'badge badge-soft-primary',
  Overdue: 'badge badge-soft-warning',
  Paused: 'badge badge-soft-secondary',
  Failing: 'badge badge-soft-danger',
};

export const statusPill: Record<Status, string> = {
  Scheduled: 'is-pending',
  Running: 'is-active',
  Overdue: 'is-review',
  Paused: 'is-suspended',
  Failing: 'is-blocked',
};

export const statusIcon: Record<Status, string> = {
  Scheduled: 'ti ti-clock',
  Running: 'ti ti-loader',
  Overdue: 'ti ti-alert-triangle',
  Paused: 'ti ti-player-pause',
  Failing: 'ti ti-x',
};

export const categoryBadge: Record<Category, string> = {
  Notifications: 'badge badge-soft-primary',
  Reports: 'badge badge-soft-info',
  Maintenance: 'badge badge-soft-secondary',
  Backup: 'badge badge-soft-success',
  Billing: 'badge badge-soft-warning',
  Sync: 'badge badge-soft-purple',
};

export const categoryIcon: Record<Category, string> = {
  Notifications: 'ti ti-bell',
  Reports: 'ti ti-report',
  Maintenance: 'ti ti-tool',
  Backup: 'ti ti-database',
  Billing: 'ti ti-report-money',
  Sync: 'ti ti-refresh',
};

export const cadenceIcon: Record<Cadence, string> = {
  'Every 15 minutes': 'ti ti-rotate',
  Hourly: 'ti ti-clock-hour-4',
  Daily: 'ti ti-calendar',
  Weekly: 'ti ti-calendar-week',
  Monthly: 'ti ti-calendar-month',
  Termly: 'ti ti-calendar-stats',
};

/* ------------------------------ Filter options ------------------------------ */

export const cadenceOptions: Cadence[] = [
  'Every 15 minutes', 'Hourly', 'Daily', 'Weekly', 'Monthly', 'Termly',
];

export const categoryOptions: Category[] = [
  'Notifications', 'Reports', 'Maintenance', 'Backup', 'Billing', 'Sync',
];

export const statusOptions: Status[] = ['Scheduled', 'Running', 'Overdue', 'Paused', 'Failing'];

export const ownerOptions = ['System', 'Ms. Latha Rao', 'Mr. Arun Prakash', 'Ms. Divya Nair'];

export const catchUpOptions = ['Run it late', 'Skip the occurrence'];

/* ------------------------------- Derivations -------------------------------- */

export const REGISTER_DATE = '2 Aug 2026';
export const REGISTER_TIME = '12:40';

/** How long a cadence waits between runs, in minutes. */
export const intervalOf = (cadence: Cadence): number => {
  if (cadence === 'Every 15 minutes') return 15;
  if (cadence === 'Hourly') return 60;
  if (cadence === 'Daily') return 1440;
  if (cadence === 'Weekly') return 10_080;
  if (cadence === 'Monthly') return 43_200;
  return 129_600;
};

export const durationText = (minutes: number): string => {
  const safe = Math.max(0, Math.round(minutes));
  if (safe < 60) return `${safe}m`;
  const hours = Math.floor(safe / 60);
  const mins = safe % 60;
  if (hours < 24) return mins === 0 ? `${hours}h` : `${hours}h ${String(mins).padStart(2, '0')}m`;
  const days = Math.floor(hours / 24);
  return `${days}d ${hours % 24}h`;
};

export const secondsText = (seconds: number): string => {
  if (seconds <= 0) return '—';
  if (seconds < 60) return `${seconds}s`;
  const mins = Math.floor(seconds / 60);
  const rest = seconds % 60;
  return rest === 0 ? `${mins}m` : `${mins}m ${rest}s`;
};

export const hasRun = (row: Task): boolean => row.lastRunAgo >= 0;

/** Minutes until the next occurrence; negative once it is overdue. */
export const dueInOf = (row: Task): number => {
  if (!hasRun(row)) return 0;
  return intervalOf(row.cadence) - row.lastRunAgo;
};

export const isOverdue = (row: Task): boolean =>
  !row.paused && !row.running && hasRun(row) && dueInOf(row) < 0;

export const dueLabelOf = (row: Task): string => {
  if (row.paused) return 'Paused — nothing queued';
  if (row.running) return 'Running now';
  if (!hasRun(row)) return 'Due at its next slot';
  const due = dueInOf(row);
  return due >= 0 ? `Due in ${durationText(due)}` : `Overdue by ${durationText(-due)}`;
};

export const lastRunLabelOf = (row: Task): string => {
  if (!hasRun(row)) return 'Never run';
  return row.lastRunAgo === 0 ? 'Just now' : `${durationText(row.lastRunAgo)} ago`;
};

export const statusOf = (row: Task): Status => {
  if (row.paused) return 'Paused';
  if (row.running) return 'Running';
  if (row.lastError) return 'Failing';
  return isOverdue(row) ? 'Overdue' : 'Scheduled';
};

export const successRateOf = (row: Task): number =>
  (row.runs > 0 ? Math.round(((row.runs - row.failures) / row.runs) * 100) : 0);

/** The mean run time across every run so far. */
export const averageDurationOf = (row: Task): number =>
  (row.runs > 0 ? Math.round(row.totalSec / row.runs) : 0);

/**
 * How far the last run drifted from the average, as a percentage. A job that
 * suddenly takes twice as long is the first sign of trouble, and this is what
 * makes that visible before it starts timing out.
 */
export const driftOf = (row: Task): number => {
  const average = averageDurationOf(row);
  if (average === 0 || !hasRun(row)) return 0;
  return Math.round(((row.lastDurationSec - average) / average) * 100);
};

export const isDrifting = (row: Task): boolean => Math.abs(driftOf(row)) >= 50;

export const driftLabelOf = (row: Task): string => {
  if (!hasRun(row) || averageDurationOf(row) === 0) return '—';
  const drift = driftOf(row);
  if (drift === 0) return 'On average';
  return drift > 0 ? `${drift}% slower` : `${-drift}% faster`;
};

/** The cadence written out, with the slot it runs in. */
export const scheduleLabelOf = (row: Task): string => {
  if (row.cadence === 'Every 15 minutes' || row.cadence === 'Hourly') return row.cadence;
  if (row.cadence === 'Daily') return `Daily at ${row.atTime}`;
  if (row.cadence === 'Weekly') return `${row.onDay}s at ${row.atTime}`;
  if (row.cadence === 'Monthly') return `${row.onDay} of the month at ${row.atTime}`;
  return `Each term · ${row.onDay}`;
};

export const isFailing = (row: Task): boolean => statusOf(row) === 'Failing';
export const isPaused = (row: Task): boolean => row.paused;
export const isRunning = (row: Task): boolean => row.running;
export const isFrequent = (row: Task): boolean => intervalOf(row.cadence) <= 60;

export interface Pair {
  label: string;
  value: string;
}

export const schedulePairsOf = (row: Task): Pair[] => [
  { label: 'Reference', value: row.id },
  { label: 'Category', value: row.category },
  { label: 'Cadence', value: scheduleLabelOf(row) },
  { label: 'Next run', value: dueLabelOf(row) },
  { label: 'On a missed slot', value: row.catchUp ? 'Run it late' : 'Skip the occurrence' },
  { label: 'Owner', value: row.owner },
];

export const runPairsOf = (row: Task): Pair[] => [
  { label: 'Runs', value: row.runs.toLocaleString() },
  { label: 'Failures', value: String(row.failures) },
  { label: 'Success rate', value: row.runs > 0 ? `${successRateOf(row)}%` : '—' },
  { label: 'Last run', value: lastRunLabelOf(row) },
  { label: 'Last duration', value: secondsText(row.lastDurationSec) },
  { label: 'Average duration', value: secondsText(averageDurationOf(row)) },
  { label: 'Drift', value: driftLabelOf(row) },
];

export const searchIndexOf = (row: Task): string =>
  [row.id, row.name, row.description, row.category, row.cadence, row.target, row.owner, statusOf(row)]
    .join(' ')
    .toLowerCase();

/* --------------------------------- Summary ---------------------------------- */

export const TOTAL_COUNT = 28;

export const SUMMARY_TOTALS = {
  tasks: 28,
  scheduled: 21,
  overdue: 2,
  failing: 1,
};

/* ---------------------------------- Rows ------------------------------------ */

export const tasks: Task[] = [
  {
    id: 'TSK-01', name: 'Daily absence alert',
    description: 'Runs once the attendance registers lock and notifies the parent of every absent student.',
    category: 'Notifications', cadence: 'Daily', atTime: '10:15', onDay: '',
    /* Ran at 10:15 this morning, so it is two and a half hours old. */
    lastRunAgo: 145, lastDurationSec: 78, totalSec: 16_380, runs: 210, failures: 0,
    running: false, paused: false, lastError: '',
    owner: 'System', target: 'Parents of absentees', catchUp: false,
  },
  {
    id: 'TSK-02', name: 'Fee ledger reconciliation',
    description: 'Matches gateway settlements against the ledger and flags anything that does not reconcile.',
    category: 'Billing', cadence: 'Daily', atTime: '01:00', onDay: '',
    lastRunAgo: 700, lastDurationSec: 412, totalSec: 78_400, runs: 205, failures: 2,
    running: false, paused: false, lastError: '',
    owner: 'System', target: 'Fee ledger', catchUp: true,
  },
  {
    id: 'TSK-03', name: 'Nightly database backup',
    description: 'Full snapshot to offsite storage, verified by checksum before the previous night is rotated out.',
    category: 'Backup', cadence: 'Daily', atTime: '02:30', onDay: '',
    lastRunAgo: 610, lastDurationSec: 1_840, totalSec: 340_000, runs: 200, failures: 0,
    running: false, paused: false, lastError: '',
    owner: 'System', target: 'Offsite storage', catchUp: true,
  },
  {
    id: 'TSK-04', name: 'Portal session cleanup',
    description: 'Clears expired sessions and stale upload temp files. Cheap enough to run on the quarter hour.',
    category: 'Maintenance', cadence: 'Every 15 minutes', atTime: '', onDay: '',
    lastRunAgo: 5, lastDurationSec: 3, totalSec: 25_920, runs: 8_640, failures: 0,
    running: false, paused: false, lastError: '',
    owner: 'System', target: 'Session store', catchUp: false,
  },
  {
    id: 'TSK-05', name: 'Weekly digest to staff',
    description: 'Assembles the week-ahead digest from the calendar and sends it before the Monday briefing.',
    category: 'Notifications', cadence: 'Weekly', atTime: '06:45', onDay: 'Monday',
    /* Ran a week ago and is now a few hours past its slot. */
    lastRunAgo: 10_320, lastDurationSec: 96, totalSec: 3_040, runs: 31, failures: 0,
    running: false, paused: false, lastError: '',
    owner: 'Ms. Divya Nair', target: 'All teaching staff', catchUp: true,
  },
  {
    id: 'TSK-06', name: 'Attendance report build',
    description: 'Pre-builds the monthly attendance report so the reports page opens instantly on the first.',
    category: 'Reports', cadence: 'Monthly', atTime: '03:00', onDay: '1st',
    lastRunAgo: 2_020, lastDurationSec: 1_260, totalSec: 8_400, runs: 7, failures: 0,
    running: false, paused: false, lastError: '',
    owner: 'System', target: 'Report cache', catchUp: true,
  },
  {
    id: 'TSK-07', name: 'Library catalogue sync',
    description: 'Failing since the migration started — the source catalogue returns a partial index.',
    category: 'Sync', cadence: 'Hourly', atTime: '', onDay: '',
    lastRunAgo: 40, lastDurationSec: 12, totalSec: 21_600, runs: 1_800, failures: 46,
    running: false, paused: false,
    lastError: 'Source returned a partial index — 412 of 1,204 titles. Aborted before writing.',
    owner: 'Mr. Suresh Babu', target: 'Library catalogue', catchUp: false,
  },
  {
    id: 'TSK-08', name: 'Transport GPS poll',
    description: 'Polls the vehicle tracker so the delay bindings have something recent to read.',
    category: 'Sync', cadence: 'Every 15 minutes', atTime: '', onDay: '',
    lastRunAgo: 2, lastDurationSec: 8, totalSec: 60_480, runs: 8_640, failures: 12,
    running: true, paused: false, lastError: '',
    owner: 'System', target: 'Vehicle tracker', catchUp: false,
  },
  {
    id: 'TSK-09', name: 'Overdue book sweep',
    description: 'Paused with the catalogue migration; it would produce an unreliable overdue list until that finishes.',
    category: 'Maintenance', cadence: 'Daily', atTime: '07:00', onDay: '',
    lastRunAgo: 55_000, lastDurationSec: 42, totalSec: 6_720, runs: 160, failures: 0,
    running: false, paused: true, lastError: '',
    owner: 'Mr. Suresh Babu', target: 'Loan records', catchUp: false,
  },
  {
    id: 'TSK-10', name: 'Term rollover',
    description: 'Closes the term, rolls forward balances and archives the completed timetable. Runs once a term.',
    category: 'Maintenance', cadence: 'Termly', atTime: '23:00', onDay: 'last working day',
    lastRunAgo: 129_600, lastDurationSec: 3_600, totalSec: 10_500, runs: 3, failures: 0,
    running: false, paused: false, lastError: '',
    owner: 'Ms. Latha Rao', target: 'Academic year', catchUp: true,
  },
];
