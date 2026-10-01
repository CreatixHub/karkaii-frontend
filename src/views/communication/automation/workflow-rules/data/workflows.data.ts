export type Module =
  | 'Admissions' | 'Attendance' | 'Fees' | 'Examinations' | 'Library'
  | 'Transport' | 'Hostel' | 'HR' | 'Inventory' | 'AI';

export type TriggerType =
  | 'Record created' | 'Record updated' | 'Field changed' | 'Scheduled'
  | 'Date reached' | 'Threshold crossed' | 'Manual' | 'Webhook';

export type Priority = 'Critical' | 'High' | 'Normal' | 'Low';

export type Status = 'Enabled' | 'Disabled' | 'Draft' | 'Erroring';

export interface Condition {
  /** "invoice.status is unpaid" — the sentence fragment the card prints. */
  text: string;
  /** The value the condition turns on, shown in bold. */
  value: string;
  /** How this condition joins the previous one. */
  joiner: 'AND' | 'OR' | '';
}

export interface Action {
  icon: string;
  text: string;
  enabled: boolean;
}

export interface Workflow {
  id: string;
  icon: string;
  name: string;
  description: string;

  module: Module;
  triggerType: TriggerType;
  /** "a fee invoice passes its due_date" — the when. */
  trigger: string;
  triggerValue: string;
  triggerTail: string;

  conditions: Condition[];
  actions: Action[];
  /** The one-line summary of the actions the card prints. */
  actionSummary: string;

  priority: Priority;
  owner: string;
  modified: string;

  /** Runs this month, and how many of them failed. */
  runs: number;
  failures: number;
  /** Empty when the rule has never run. */
  lastRun: string;

  enabled: boolean;
  draft: boolean;
  /** The reason a rule is erroring or switched off. */
  note: string;
}

/* --------------------------------- Tints ----------------------------------- */

export const statusBadge: Record<Status, string> = {
  Enabled: 'rule-status-badge is-on',
  Disabled: 'rule-status-badge is-off',
  Draft: 'rule-status-badge is-draft',
  Erroring: 'rule-status-badge is-stop',
};

export const statusIcon: Record<Status, string> = {
  Enabled: 'ti ti-player-play',
  Disabled: 'ti ti-player-pause',
  Draft: 'ti ti-pencil',
  Erroring: 'ti ti-alert-triangle',
};

/** The `.rule` modifier the card carries. */
export const cardToneOf = (row: Workflow): string => {
  if (row.draft) return ' is-draft';
  if (row.failures > 0 && row.enabled) return ' is-error';
  return row.enabled ? '' : ' is-off';
};

export const priorityBadge: Record<Priority, string> = {
  Critical: 'badge badge-soft-danger',
  High: 'badge badge-soft-warning',
  Normal: 'badge badge-soft-secondary',
  Low: 'badge badge-soft-info',
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

export const statusOptions: Status[] = ['Enabled', 'Disabled', 'Draft', 'Erroring'];

export const triggerOptions: TriggerType[] = [
  'Record created', 'Record updated', 'Field changed', 'Scheduled',
  'Date reached', 'Threshold crossed', 'Manual', 'Webhook',
];

export const ownerOptions = [
  'Me', 'Ms. Latha Rao', 'Mr. Arun Prakash', 'Ms. Divya Nair', 'System', 'Mr. Suresh Babu',
];

export const priorityOptions: Priority[] = ['Critical', 'High', 'Normal', 'Low'];

export const lastRunOptions = ['Today', 'This week', 'Over 30 days ago', 'Never'];

/* --------------------------- Dialog option lists ----------------------------- */

export const triggerOnOptions = [
  'Fee invoice', 'Student record', 'Admission application', 'Attendance entry', 'Leave request',
];

export const collisionOptions = ['Import as a copy', 'Skip', 'Overwrite'];

export const exportFormatOptions = ['JSON', 'CSV summary'];

/* ------------------------------- Derivations -------------------------------- */

export const REGISTER_DATE = '2 Aug 2026';

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const dateKey = (value: string): number => {
  if (!value) return 0;
  const parts = value.split(' ');
  const [day, month, year] = parts.length === 3 ? parts : [...parts, '2026'];
  const index = months.indexOf(month);
  if (index === -1) return 0;
  return Number(year) * 10000 + (index + 1) * 100 + Number(day);
};

const dayNumber = (value: string): number => {
  if (!value) return 0;
  const parts = value.split(' ');
  const [day, month, year] = parts.length === 3 ? parts : [...parts, '2026'];
  const index = months.indexOf(month);
  if (index === -1) return 0;
  return Math.round(Date.UTC(Number(year), index, Number(day)) / 86_400_000);
};

export const daysBetween = (from: string, to: string): number => dayNumber(to) - dayNumber(from);

export const dayText = (days: number): string =>
  `${Math.abs(days)} ${Math.abs(days) === 1 ? 'day' : 'days'}`;

/** Counted from the rule itself, not stored beside it. */
export const conditionCountOf = (row: Workflow): number => row.conditions.length;

export const actionCountOf = (row: Workflow): number =>
  row.actions.filter((action) => action.enabled).length;

export const hasRun = (row: Workflow): boolean => row.runs > 0 || row.lastRun !== '';

export const failureRateOf = (row: Workflow): number =>
  (row.runs > 0 ? Math.round((row.failures / row.runs) * 100) : 0);

export const statusOf = (row: Workflow): Status => {
  if (row.draft) return 'Draft';
  if (!row.enabled) return 'Disabled';
  return row.failures > 0 ? 'Erroring' : 'Enabled';
};

/** What the card shows where a run count would go. */
export interface Health {
  icon: string;
  label: string;
  value: string;
  tail: string;
}

export const healthOf = (row: Workflow): Health => {
  if (row.failures > 0) {
    return {
      icon: 'ti ti-alert-triangle', label: '', value: String(row.failures), tail: ' failed runs',
    };
  }
  if (!hasRun(row)) {
    return { icon: 'ti ti-clock-off', label: 'Never run', value: '', tail: '' };
  }
  if (!row.enabled) {
    return { icon: 'ti ti-history', label: `Last run ${row.lastRun}`, value: '', tail: '' };
  }
  return {
    icon: 'ti ti-history', label: '', value: row.runs.toLocaleString(), tail: ' runs this month',
  };
};

/** The two the sidebar picks out: erroring, or enabled and never run. */
export const needsAttention = (row: Workflow): boolean =>
  (row.enabled && row.failures > 0) || (row.enabled && !hasRun(row));

export const attentionReasonOf = (row: Workflow): string => {
  if (row.failures > 0) return `${row.failures} failed runs · ${row.note || 'check the actions'}`;
  return 'Never run in 90 days · check the trigger';
};

export const isEnabled = (row: Workflow): boolean => statusOf(row) === 'Enabled';
export const isDisabled = (row: Workflow): boolean => statusOf(row) === 'Disabled';
export const isDraft = (row: Workflow): boolean => statusOf(row) === 'Draft';
export const isErroring = (row: Workflow): boolean => statusOf(row) === 'Erroring';
export const isCritical = (row: Workflow): boolean => row.priority === 'Critical';
export const neverRun = (row: Workflow): boolean => !hasRun(row);

/** The rule as one sentence, which is how the page says to read it. */
export const sentenceOf = (row: Workflow): string => {
  const when = `When ${row.trigger} ${row.triggerValue} ${row.triggerTail}`.replace(/\s+/g, ' ').trim();
  const If = row.conditions.map((condition) => `${condition.text} ${condition.value}`.trim()).join(', and ');
  return `${when}, if ${If}, then ${row.actionSummary}.`;
};

export interface Pair {
  label: string;
  value: string;
}

export const detailPairsOf = (row: Workflow): Pair[] => [
  { label: 'Reference', value: row.id },
  { label: 'Module', value: row.module },
  { label: 'Trigger type', value: row.triggerType },
  { label: 'Priority', value: row.priority },
  { label: 'Owner', value: row.owner },
  { label: 'Modified', value: row.modified },
];

export const runPairsOf = (row: Workflow): Pair[] => [
  { label: 'Runs this month', value: row.runs.toLocaleString() },
  { label: 'Failed runs', value: String(row.failures) },
  { label: 'Failure rate', value: row.runs > 0 ? `${failureRateOf(row)}%` : '—' },
  { label: 'Last run', value: row.lastRun || 'Never' },
  { label: 'Conditions', value: String(conditionCountOf(row)) },
  { label: 'Actions', value: `${actionCountOf(row)} of ${row.actions.length} enabled` },
];

export const searchIndexOf = (row: Workflow): string =>
  [row.id, row.name, row.description, row.module, row.trigger, row.actionSummary, row.owner, statusOf(row)]
    .join(' ')
    .toLowerCase();

/* --------------------------------- Summary ---------------------------------- */

export const TOTAL_COUNT = 34;

export const QUICK_TOTALS = {
  enabled: 26,
  disabled: 5,
  drafts: 3,
  failing: 2,
  neverRun: 4,
  critical: 3,
};

/* ---------------------------------- Rows ------------------------------------ */

export const workflows: Workflow[] = [
  {
    id: 'WFX-001', icon: 'ti ti-report-money', name: 'Late fee on overdue invoice',
    description: 'Applies the late fee once, the morning after the due date, and notifies the family the same hour.',
    module: 'Fees', triggerType: 'Date reached',
    trigger: 'a fee invoice passes its', triggerValue: 'due_date', triggerTail: '',
    conditions: [
      { text: 'status is', value: 'unpaid', joiner: '' },
      { text: 'no concession applies', value: '', joiner: 'AND' },
    ],
    actions: [
      { icon: 'ti ti-pencil', text: 'Add a 2% late fee to the invoice', enabled: true },
      { icon: 'ti ti-bell', text: 'Notify the parent on email and push', enabled: true },
      { icon: 'ti ti-flag', text: 'Flag the account for the accounts office', enabled: true },
    ],
    actionSummary: 'add 2% late fee, notify parent, flag the account',
    priority: 'High', owner: 'Ms. Divya Nair', modified: '30 Jul 2026',
    runs: 318, failures: 0, lastRun: '2 Aug 2026',
    enabled: true, draft: false, note: '',
  },
  {
    id: 'WFX-002', icon: 'ti ti-calendar-x', name: 'Absence alert to parents',
    description: 'Runs once the registers close, so a late-marked attendance correction never produces a false alert.',
    module: 'Attendance', triggerType: 'Scheduled',
    trigger: 'attendance is locked at', triggerValue: '10:15', triggerTail: 'each school day',
    conditions: [
      { text: 'student is marked', value: 'absent', joiner: '' },
      { text: 'no approved leave exists', value: '', joiner: 'AND' },
    ],
    actions: [
      { icon: 'ti ti-bell', text: 'Notify the parent on push', enabled: true },
      { icon: 'ti ti-users', text: 'Write to the parent portal inbox', enabled: true },
    ],
    actionSummary: 'notify the parent on push and the portal',
    priority: 'Normal', owner: 'System', modified: '12 Jun 2026',
    runs: 1204, failures: 0, lastRun: '2 Aug 2026',
    enabled: true, draft: false, note: '',
  },
  {
    id: 'WFX-003', icon: 'ti ti-user-plus', name: 'Admission approved → enrol student',
    description: 'Turns an approved application into an enrolled student record, allocates a roll number and opens the fee ledger.',
    module: 'Admissions', triggerType: 'Field changed',
    trigger: 'admission.status changes to', triggerValue: 'approved', triggerTail: '',
    conditions: [
      { text: 'all mandatory documents are verified', value: '', joiner: '' },
      { text: 'seat is available in', value: 'the applied class', joiner: 'AND' },
      { text: 'admission fee is', value: 'paid', joiner: 'AND' },
    ],
    actions: [
      { icon: 'ti ti-plus', text: 'Create the student record', enabled: true },
      { icon: 'ti ti-hash', text: 'Allocate a roll number', enabled: true },
      { icon: 'ti ti-book', text: 'Open the fee ledger', enabled: true },
      { icon: 'ti ti-bell', text: 'Notify the parent and the front office', enabled: true },
      { icon: 'ti ti-id-badge-2', text: 'Queue the ID card for printing', enabled: true },
    ],
    actionSummary: 'create student, allocate roll no., open ledger, notify',
    priority: 'Critical', owner: 'Ms. Latha Rao', modified: '28 Jul 2026',
    runs: 42, failures: 0, lastRun: '1 Aug 2026',
    enabled: true, draft: false, note: '',
  },
  {
    id: 'WFX-004', icon: 'ti ti-file-certificate', name: 'Publish exam result',
    description: 'Failing at the notify step — the Result Published template was rejected and has not been replaced.',
    module: 'Examinations', triggerType: 'Record updated',
    trigger: 'marks entry for an exam is locked', triggerValue: '', triggerTail: '',
    conditions: [
      { text: 'every subject has marks', value: '', joiner: '' },
      { text: 'moderation is signed off', value: '', joiner: 'AND' },
    ],
    actions: [
      { icon: 'ti ti-file-text', text: 'Generate the report cards', enabled: true },
      { icon: 'ti ti-upload', text: 'Publish them to the portal', enabled: true },
      { icon: 'ti ti-bell', text: 'Notify parents — template rejected', enabled: true },
    ],
    actionSummary: 'generate report cards, publish, notify parents',
    priority: 'High', owner: 'Mr. Arun Prakash', modified: '18 Jul 2026',
    runs: 12, failures: 4, lastRun: '18 Jul 2026',
    enabled: true, draft: false,
    note: 'the Result Published template was rejected and has not been replaced',
  },
  {
    id: 'WFX-005', icon: 'ti ti-books', name: 'Overdue book reminder',
    description: 'Disabled while the catalogue migration runs — the overdue list is unreliable until it finishes.',
    module: 'Library', triggerType: 'Date reached',
    trigger: 'a loan passes its return date by', triggerValue: '3 days', triggerTail: '',
    conditions: [
      { text: 'the book has not been renewed', value: '', joiner: '' },
    ],
    actions: [
      { icon: 'ti ti-bell', text: 'Notify the member', enabled: true },
      { icon: 'ti ti-chalkboard', text: 'Copy the class teacher', enabled: true },
    ],
    actionSummary: 'notify the member and the class teacher',
    priority: 'Low', owner: 'Mr. Suresh Babu', modified: '25 Jul 2026',
    runs: 0, failures: 0, lastRun: '25 Jun 2026',
    enabled: false, draft: false,
    note: 'the catalogue migration finishes on the eighth',
  },
  {
    id: 'WFX-006', icon: 'ti ti-id-badge-2', name: 'Leave request routing',
    description: 'Routes by duration — anything over three days skips the head of department and goes straight to the principal.',
    module: 'HR', triggerType: 'Record created',
    trigger: 'a staff leave request is submitted', triggerValue: '', triggerTail: '',
    conditions: [
      { text: 'days', value: '> 3', joiner: '' },
      { text: 'balance is insufficient', value: '', joiner: 'OR' },
    ],
    actions: [
      { icon: 'ti ti-route', text: 'Route to the principal', enabled: true },
      { icon: 'ti ti-bell', text: 'Notify HR', enabled: true },
      { icon: 'ti ti-lock', text: 'Hold the roster until it is decided', enabled: true },
    ],
    actionSummary: 'route to the principal, notify HR, hold the roster',
    priority: 'Normal', owner: 'Ms. Divya Nair', modified: '21 Jul 2026',
    runs: 67, failures: 0, lastRun: '31 Jul 2026',
    enabled: true, draft: false, note: '',
  },
  {
    id: 'WFX-007', icon: 'ti ti-bus', name: 'Bus delay notification',
    description: 'Fires from GPS rather than from the driver, so families hear about a delay before anyone reports it.',
    module: 'Transport', triggerType: 'Threshold crossed',
    trigger: 'a vehicle is', triggerValue: '> 10 min', triggerTail: 'behind its route schedule',
    conditions: [
      { text: 'the route is active', value: '', joiner: '' },
      { text: 'no alert was sent in the last hour', value: '', joiner: 'AND' },
    ],
    actions: [
      { icon: 'ti ti-bell', text: 'Notify the route families', enabled: true },
      { icon: 'ti ti-list-details', text: 'Log the delay against the route', enabled: true },
    ],
    actionSummary: 'notify route families, log the delay',
    priority: 'High', owner: 'Mr. Arun Prakash', modified: '22 Jul 2026',
    runs: 23, failures: 0, lastRun: '2 Aug 2026',
    enabled: true, draft: false, note: '',
  },
  {
    id: 'WFX-008', icon: 'ti ti-sparkles', name: 'At-risk student escalation',
    description: 'Drafted against the AI risk score. Held until the counselling team agrees the threshold and who is told first.',
    module: 'AI', triggerType: 'Threshold crossed',
    trigger: 'ai.risk_score crosses', triggerValue: '0.75', triggerTail: 'sustained for 7 days',
    conditions: [
      { text: 'no open case exists', value: '', joiner: '' },
      { text: 'the student is', value: 'enrolled', joiner: 'AND' },
    ],
    actions: [
      { icon: 'ti ti-folder-plus', text: 'Open a counselling case', enabled: true },
      { icon: 'ti ti-bell', text: 'Alert the coordinator', enabled: true },
    ],
    actionSummary: 'open a counselling case, alert the coordinator',
    priority: 'Critical', owner: 'Ms. Latha Rao', modified: '1 Aug 2026',
    runs: 0, failures: 0, lastRun: '',
    enabled: false, draft: true,
    note: 'the counselling team has not agreed the threshold',
  },
];
