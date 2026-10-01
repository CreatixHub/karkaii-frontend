export type AlertType =
  | 'Contagious Illness' | 'Allergy Alert' | 'Chronic Condition'
  | 'Emergency Incident' | 'Health Advisory' | 'Medication Alert';

export type Severity = 'Critical' | 'High' | 'Medium' | 'Low';

export type AlertStatus = 'Draft' | 'Active' | 'Monitoring' | 'Escalated' | 'Resolved';

export type NotificationState =
  | 'All Acknowledged' | 'Partially Acknowledged' | 'Sent' | 'Queued' | 'Not Sent';

export interface Individual {
  name: string;
  /** The line the expander prints under the name. */
  detail: string;
  /** The View dialog's table columns. */
  seen: string;
  record: string;
  state: string;
  stateTint: string;
}

export interface ActionItem {
  task: string;
  owner: string;
}

export interface NotificationEntry {
  channel: string;
  audience: string;
  /** Empty while the message is still held with the draft. */
  at: string;
  recipients: number;
  acknowledged: number;
}

export interface Attachment {
  name: string;
  meta: string;
}

export interface Contact {
  icon: string;
  name: string;
  detail: string;
  state: string;
}

export interface HealthAlert {
  id: string;
  title: string;
  summary: string;
  type: AlertType;
  severity: Severity;

  group: string;
  scope: string;
  reporter: string;
  reporterRole: string;

  raisedDate: string;
  raisedTime: string;
  /** A draft has been written but not published, so nothing has gone out. */
  published: boolean;

  /** Set while the alert is being watched rather than closed. */
  monitorUntil: string;
  escalatedAt: string;
  escalatedTo: string;
  resolvedDate: string;
  resolvedAt: string;
  resolvedBy: string;

  linkedVisit: string;
  /** Cases counted against the notifiable threshold; 0 when it does not apply. */
  caseCount: number;

  individuals: Individual[];
  medical: string[];
  actions: ActionItem[];
  notifications: NotificationEntry[];
  attachments: Attachment[];
  contacts: Contact[];

  /** The timeline's opening line, in the words of the alert that raised it. */
  raisedNote: string;
  /** Its closing line; the meta under it is derived from the status. */
  closingNote: string;
  notes: string;
}

/* --------------------------------- Tints ----------------------------------- */

export const typeBadge: Record<AlertType, string> = {
  'Contagious Illness': 'badge badge-soft-warning',
  'Allergy Alert': 'badge badge-soft-purple',
  'Chronic Condition': 'badge badge-soft-info',
  'Emergency Incident': 'badge badge-soft-danger',
  'Health Advisory': 'badge badge-soft-primary',
  'Medication Alert': 'badge badge-soft-success',
};

export const typeIcon: Record<AlertType, string> = {
  'Contagious Illness': 'ti ti-virus',
  'Allergy Alert': 'ti ti-alert-circle',
  'Chronic Condition': 'ti ti-heartbeat',
  'Emergency Incident': 'ti ti-ambulance',
  'Health Advisory': 'ti ti-speakerphone',
  'Medication Alert': 'ti ti-pill',
};

export const typeTint: Record<AlertType, string> = {
  'Contagious Illness': 'warning',
  'Allergy Alert': 'purple',
  'Chronic Condition': 'info',
  'Emergency Incident': 'danger',
  'Health Advisory': 'primary',
  'Medication Alert': 'success',
};

export const severityBadge: Record<Severity, string> = {
  Critical: 'badge badge-soft-danger',
  High: 'badge badge-soft-warning',
  Medium: 'badge badge-soft-info',
  Low: 'badge badge-soft-success',
};

export const severityRank: Record<Severity, number> = {
  Critical: 0, High: 1, Medium: 2, Low: 3,
};

export const statusPill: Record<AlertStatus, string> = {
  Draft: 'is-pending',
  Active: 'is-active',
  Monitoring: 'is-review',
  Escalated: 'is-suspended',
  Resolved: 'is-completed',
};

export const statusBadge: Record<AlertStatus, string> = {
  Draft: 'badge badge-soft-secondary',
  Active: 'badge badge-soft-primary',
  Monitoring: 'badge badge-soft-info',
  Escalated: 'badge badge-soft-danger',
  Resolved: 'badge badge-soft-success',
};

export const notificationBadge: Record<NotificationState, string> = {
  'All Acknowledged': 'badge badge-soft-success',
  'Partially Acknowledged': 'badge badge-soft-warning',
  Sent: 'badge badge-soft-info',
  Queued: 'badge badge-soft-info',
  'Not Sent': 'badge badge-soft-secondary',
};

/* ------------------------------ Filter options ------------------------------ */

export const typeOptions: AlertType[] = [
  'Contagious Illness', 'Allergy Alert', 'Chronic Condition',
  'Emergency Incident', 'Health Advisory', 'Medication Alert',
];

export const severityOptions: Severity[] = ['Critical', 'High', 'Medium', 'Low'];

export const groupOptions = [
  'All students and staff', 'Single class', 'Teaching staff',
  'Guardians', 'Cafeteria', 'Games department',
];

export const statusOptions: AlertStatus[] = ['Draft', 'Active', 'Monitoring', 'Escalated', 'Resolved'];

export const notificationOptions = [
  'All acknowledged', 'Partially acknowledged', 'Sent', 'Queued', 'Not sent',
];

export const reporterOptions = [
  'Mrs. Sofia Alvarez', 'Ms. Meera Nair', 'Ms. Grace Otieno', 'Ms. Rosa Klein',
];

/* --------------------------- Dialog option lists ----------------------------- */

export const severityChoices: { severity: Severity; label: string }[] = [
  { severity: 'Low', label: 'Low · 72h' },
  { severity: 'Medium', label: 'Medium · 24h' },
  { severity: 'High', label: 'High · 4h' },
  { severity: 'Critical', label: 'Critical · 1h' },
];

export const affectedGroupChoices = [
  'All students and staff', 'Class V A', 'Class IX C', 'Class IV A', 'Class X B',
  'All teaching staff', 'Guardians · all classes', 'Cafeteria', 'Games department',
];

export const reporterChoices = [
  'Mrs. Sofia Alvarez · Senior Nurse',
  'Ms. Meera Nair · School Nurse',
  'Ms. Grace Otieno · Nurse Assistant',
  'Ms. Rosa Klein · Cafeteria Manager',
];

export const channelChoices = [
  { id: 'SMS', icon: 'ti ti-message' },
  { id: 'Email', icon: 'ti ti-mail' },
  { id: 'Push', icon: 'ti ti-bell' },
  { id: 'Call', icon: 'ti ti-phone' },
];

export const audienceChoices = [
  'Guardians of the affected class', 'Guardians of all students', 'All teaching staff',
  'Emergency response team', 'Principal and Chief Warden',
];

export const escalationTargets = [
  { id: 'Principal', icon: 'ti ti-user' },
  { id: 'Response Team', icon: 'ti ti-users' },
  { id: 'District Office', icon: 'ti ti-building' },
];

export const escalationReasons = [
  'Case count reached the notifiable threshold',
  'Patient condition deteriorating',
  'Exposure beyond the original group',
  'External authority requires notice',
];

export const resolutionOutcomes = [
  { id: 'Risk Cleared', icon: 'ti ti-circle-check' },
  { id: 'Handed to Clinic', icon: 'ti ti-medical-cross' },
  { id: 'Move to Monitoring', icon: 'ti ti-eye' },
];

export const followUpChoices = [
  'Yes · clinic review booked', 'Yes · monitor the group', 'No further action',
];

/* ------------------------------- Derivations -------------------------------- */

export const REGISTER_DATE = '31 Jul 2026';
export const REGISTER_TIME = '15:40';

export const minutesOf = (time: string): number => {
  const [hours, mins] = time.split(':').map(Number);
  return Number.isFinite(hours) && Number.isFinite(mins) ? hours * 60 + mins : 0;
};

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const dateKey = (value: string): number => {
  const [day, month, year] = value.split(' ');
  const index = months.indexOf(month);
  if (index === -1) return 0;
  return Number(year) * 10000 + (index + 1) * 100 + Number(day);
};

const dayNumber = (value: string): number => {
  const [day, month, year] = value.split(' ');
  const index = months.indexOf(month);
  if (index === -1) return 0;
  return Math.round(Date.UTC(Number(year), index, Number(day)) / 86_400_000);
};

export const daysBetween = (from: string, to: string): number => dayNumber(to) - dayNumber(from);

export const shiftDate = (value: string, days: number): string => {
  const [day, month, year] = value.split(' ');
  const index = months.indexOf(month);
  if (index === -1) return value;
  const moved = new Date(Date.UTC(Number(year), index, Number(day) + days));
  return `${moved.getUTCDate()} ${months[moved.getUTCMonth()]} ${moved.getUTCFullYear()}`;
};

export const dayText = (days: number): string =>
  `${Math.abs(days)} ${Math.abs(days) === 1 ? 'day' : 'days'}`;

/** A moment on the register, counted in minutes so gaps cross midnight. */
const momentOf = (date: string, time: string): number => dayNumber(date) * 1440 + minutesOf(time);

const NOW = momentOf(REGISTER_DATE, REGISTER_TIME);

/**
 * The three shapes the template writes a gap in: `5d 7h`, `4h 05m` and `25m`.
 */
export const durationText = (minutes: number): string => {
  const safe = Math.max(0, minutes);
  const days = Math.floor(safe / 1440);
  const hours = Math.floor((safe % 1440) / 60);
  const mins = safe % 60;
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${String(mins).padStart(2, '0')}m`;
  return `${mins}m`;
};

/** Critical one hour, High four, Medium a day, Low three days. */
export const windowHoursOf = (row: HealthAlert): number => {
  if (row.severity === 'Critical') return 1;
  if (row.severity === 'High') return 4;
  return row.severity === 'Medium' ? 24 : 72;
};

export const windowLabelOf = (row: HealthAlert): string => `${windowHoursOf(row)} hour window`;

export const raisedAtOf = (row: HealthAlert): number => momentOf(row.raisedDate, row.raisedTime);

export const isResolved = (row: HealthAlert): boolean => row.resolvedAt !== '';

/** How long the alert ran: to its resolution, or to the register clock. */
export const openMinutesOf = (row: HealthAlert): number => {
  const closed = isResolved(row) ? momentOf(row.resolvedDate, row.resolvedAt) : NOW;
  return Math.max(0, closed - raisedAtOf(row));
};

/** `31 Jul 2026 15:15`. */
export const raisedLabelOf = (row: HealthAlert): string => `${row.raisedDate} ${row.raisedTime}`;

/** The second line of the Created On column. */
export const ageLabelOf = (row: HealthAlert): string => {
  const days = daysBetween(row.raisedDate, REGISTER_DATE);
  if (days === 0) return 'Today';
  return days === 1 ? 'Yesterday' : `${dayText(days)} ago`;
};

/** Its third line: nothing to count while the alert is still a draft. */
export const openLabelOf = (row: HealthAlert): string => {
  if (!row.published) return 'Not published';
  const length = durationText(openMinutesOf(row));
  return isResolved(row) ? `Closed in ${length}` : `Open ${length}`;
};

export const openTintOf = (row: HealthAlert): string => {
  if (!row.published) return 'text-muted';
  if (isResolved(row)) return 'text-success';
  return openMinutesOf(row) > windowHoursOf(row) * 60 ? 'text-danger' : 'text-warning';
};

/* ------------------------------ Notifications ------------------------------- */

/** Only the messages that actually went out; a draft holds all of its own. */
export const releasedOf = (row: HealthAlert): NotificationEntry[] =>
  row.notifications.filter((entry) => entry.at !== '');

export const sentOf = (row: HealthAlert): number =>
  releasedOf(row).reduce((total, entry) => total + entry.recipients, 0);

export const acknowledgedOf = (row: HealthAlert): number =>
  releasedOf(row).reduce((total, entry) => total + entry.acknowledged, 0);

/** Minutes from raising the alert to the first message leaving; −1 if none has. */
export const firstNotificationOf = (row: HealthAlert): number => {
  const released = releasedOf(row);
  if (released.length === 0) return -1;
  const first = Math.min(
    ...released.map((entry) => momentOf(row.raisedDate, entry.at)),
  );
  // A message sent after midnight belongs to the following day.
  const gap = first - raisedAtOf(row);
  return gap < 0 ? gap + 1440 : gap;
};

export const firstNotificationLabelOf = (row: HealthAlert): string => {
  const gap = firstNotificationOf(row);
  if (gap < 0) return 'Not sent';
  const within = gap <= windowHoursOf(row) * 60;
  return `${durationText(gap)} · ${within ? 'within target' : 'over target'}`;
};

export const firstNotificationBadgeOf = (row: HealthAlert): string => {
  const gap = firstNotificationOf(row);
  if (gap < 0) return 'badge badge-soft-secondary';
  return gap <= windowHoursOf(row) * 60 ? 'badge badge-soft-success' : 'badge badge-soft-danger';
};

/**
 * A draft holds its notifications, so it reads Not Sent; a published alert with
 * nothing away yet is Queued, and after that the acknowledgements decide.
 */
export const notificationStateOf = (row: HealthAlert): NotificationState => {
  if (releasedOf(row).length === 0) return row.published ? 'Queued' : 'Not Sent';
  const sent = sentOf(row);
  const acknowledged = acknowledgedOf(row);
  if (acknowledged === 0) return 'Sent';
  return acknowledged >= sent ? 'All Acknowledged' : 'Partially Acknowledged';
};

/** The line under the Notification Status badge. */
export const notificationSubLabelOf = (row: HealthAlert): string => {
  const state = notificationStateOf(row);
  if (state === 'Not Sent') return 'Held with the draft';
  if (state === 'Queued') return `${row.notifications.length} messages queued`;
  return `${acknowledgedOf(row)} of ${sentOf(row)} acknowledged`;
};

/** `30 messages · 25 acknowledged`, the way the Send dialog counts them. */
export const notificationCountLabelOf = (row: HealthAlert): string =>
  releasedOf(row).length === 0
    ? 'Nothing sent yet'
    : `${sentOf(row)} messages · ${acknowledgedOf(row)} acknowledged`;

/** Guardians still to answer, and when the resend falls due. */
export const outstandingOf = (row: HealthAlert): number => sentOf(row) - acknowledgedOf(row);

export const chaseDueOf = (row: HealthAlert): string => {
  const gap = firstNotificationOf(row);
  if (gap < 0 || outstandingOf(row) === 0) return 'Nothing outstanding';
  const at = raisedAtOf(row) + gap + 120;
  const clock = `${String(Math.floor((at % 1440) / 60)).padStart(2, '0')}:${String(at % 60).padStart(2, '0')}`;
  return `${clock} · ${outstandingOf(row)} to answer`;
};

/* --------------------------------- Status ----------------------------------- */

export const statusOf = (row: HealthAlert): AlertStatus => {
  if (!row.published) return 'Draft';
  if (isResolved(row)) return 'Resolved';
  if (row.escalatedAt) return 'Escalated';
  return row.monitorUntil ? 'Monitoring' : 'Active';
};

export const statusSubLabelOf = (row: HealthAlert): string => {
  const status = statusOf(row);
  if (status === 'Draft') return 'Awaiting approval';
  if (status === 'Resolved') return `Resolved ${row.resolvedAt} · ${row.resolvedDate}`;
  if (status === 'Escalated') return `Escalated ${row.escalatedAt}`;
  if (status === 'Monitoring') return `Review until ${row.monitorUntil}`;
  return 'Standing alert on the register';
};

/* ---------------------------------- Cards ----------------------------------- */

export interface Pair {
  label: string;
  value: string;
}

export const detailPairsOf = (row: HealthAlert): Pair[] => [
  { label: 'Alert ID', value: row.id },
  { label: 'Alert Type', value: row.type },
  { label: 'Severity', value: row.severity },
  { label: 'Response Window', value: `${windowHoursOf(row)} hours` },
  { label: 'First Notification', value: firstNotificationLabelOf(row) },
  { label: 'Raised By', value: row.reporter },
];

export const overviewPairsOf = (row: HealthAlert): Pair[] => [
  { label: 'Alert Type', value: row.type },
  { label: 'Severity', value: row.severity },
  { label: 'Raised By', value: row.reporter },
  { label: 'Linked Visit', value: row.linkedVisit || 'None' },
  { label: 'Raised', value: raisedLabelOf(row) },
  { label: 'Response', value: firstNotificationOf(row) < 0 ? 'Not sent' : durationText(firstNotificationOf(row)) },
  { label: isResolved(row) ? 'Closed in' : 'Open', value: durationText(openMinutesOf(row)) },
];

export const notificationPairsOf = (row: HealthAlert): Pair[] => [
  ...releasedOf(row).map((entry) => ({
    label: `${entry.channel} · ${entry.audience}`,
    value: `${entry.acknowledged} of ${entry.recipients} acknowledged`,
  })),
  { label: 'Status', value: notificationStateOf(row) },
  { label: 'Chase Due', value: chaseDueOf(row) },
];

export interface TrailEntry {
  icon: string;
  tint: string;
  title: string;
  meta: string;
}

/**
 * The resolution timeline: the alert being raised, the first message leaving,
 * and where the alert stands now.
 */
export const trailOf = (row: HealthAlert): TrailEntry[] => {
  const entries: TrailEntry[] = [
    {
      icon: typeIcon[row.type], tint: typeTint[row.type],
      title: row.raisedNote, meta: raisedLabelOf(row),
    },
  ];
  const released = releasedOf(row);
  if (released.length > 0) {
    const first = released.reduce(
      (earliest, entry) => (minutesOf(entry.at) < minutesOf(earliest.at) ? entry : earliest),
      released[0],
    );
    entries.push({
      icon: 'ti ti-send', tint: 'success',
      title: `${first.audience} notified`,
      meta: `${row.raisedDate} ${first.at} · ${durationText(firstNotificationOf(row))} after the alert`,
    });
  } else {
    entries.push({
      icon: 'ti ti-clock', tint: 'warning',
      title: 'Notification queued but not released',
      meta: row.published ? 'Waiting on the send' : 'Held with the draft',
    });
  }
  const status = statusOf(row);
  entries.push({
    icon: status === 'Resolved' ? 'ti ti-circle-check'
      : status === 'Escalated' ? 'ti ti-arrow-up'
        : status === 'Draft' ? 'ti ti-clock' : 'ti ti-eye',
    tint: status === 'Resolved' ? 'success'
      : status === 'Escalated' ? 'danger'
        : status === 'Draft' ? 'secondary' : 'info',
    title: row.closingNote,
    meta: status === 'Resolved' ? `${row.resolvedDate} ${row.resolvedAt}`
      : status === 'Escalated' ? `${row.raisedDate} ${row.escalatedAt} · ${row.escalatedTo}`
        : status === 'Monitoring' ? `Review until ${row.monitorUntil}`
          : status === 'Draft' ? 'Not yet published' : 'Reviewed each term',
  });
  return entries;
};

/** The panel's audit trail, built from the same record. */
export const auditOf = (row: HealthAlert): TrailEntry[] => {
  const entries: TrailEntry[] = [
    {
      icon: 'ti ti-plus', tint: 'primary',
      title: row.published ? 'Alert created and published' : 'Alert drafted',
      meta: `${raisedLabelOf(row)} · ${row.reporter}`,
    },
  ];
  if (row.linkedVisit) {
    entries.push({
      icon: 'ti ti-link', tint: 'info',
      title: `Linked to medical visit ${row.linkedVisit}`,
      meta: `${row.raisedTime} · automated`,
    });
  }
  entries.push({
    icon: 'ti ti-send',
    tint: releasedOf(row).length === 0 ? 'secondary' : 'success',
    title: notificationCountLabelOf(row),
    meta: firstNotificationLabelOf(row),
  });
  if (row.escalatedAt) {
    entries.push({
      icon: 'ti ti-arrow-up', tint: 'danger',
      title: `Escalated to the ${row.escalatedTo}`,
      meta: `${row.escalatedAt} · severity ${row.severity.toLowerCase()}`,
    });
  }
  if (isResolved(row)) {
    entries.push({
      icon: 'ti ti-circle-check', tint: 'success',
      title: `Resolved by ${row.resolvedBy}`,
      meta: `${row.resolvedDate} ${row.resolvedAt} · open ${durationText(openMinutesOf(row))}`,
    });
  }
  return entries;
};

/* --------------------------------- Filters ---------------------------------- */

export const searchIndexOf = (row: HealthAlert): string =>
  [
    row.id, row.title, row.summary, row.type, row.severity, row.group, row.scope,
    row.reporter, statusOf(row), notificationStateOf(row),
  ]
    .join(' ')
    .toLowerCase();

/* --------------------------------- Summary ---------------------------------- */

/**
 * The strip counts the whole term — 49 alerts against the eight this page lists
 * — so the template's figures stand and the register moves them.
 */
export const SUMMARY_TOTALS = {
  active: 9,
  high: 4,
  critical: 2,
  resolved: 37,
  notifications: 428,
  total: 49,
};

export const VIEW_TOTALS = {
  all: 49,
  active: 9,
  critical: 2,
  drafts: 3,
  contagious: 6,
};

export const QUICK_TOTALS = {
  all: 49,
  active: 9,
  critical: 2,
  high: 4,
  drafts: 3,
  resolved: 37,
};

/** The template's one committed chip is the window it opens on. */
export const PERIOD_FROM = '15-07-2026';
export const PERIOD_TO = '31-07-2026';

/* ---------------------------------- Rows ------------------------------------ */

export const healthAlerts: HealthAlert[] = [
  {
    id: 'HA-2026-0142',
    title: 'Sore throat cluster in Class V A',
    summary: 'Three students from the same class seen with sore throat and fever inside one week.',
    type: 'Contagious Illness', severity: 'High',
    group: 'Class V A', scope: '24 students and 2 teachers',
    reporter: 'Ms. Meera Nair', reporterRole: 'School Nurse · NUR-2021-004',
    raisedDate: '31 Jul 2026', raisedTime: '15:15', published: true,
    monitorUntil: '7 Aug 2026', escalatedAt: '', escalatedTo: '',
    resolvedDate: '', resolvedAt: '', resolvedBy: '',
    linkedVisit: 'VIS-2026-0426', caseCount: 3,
    individuals: [
      {
        name: 'Meera Iyer', detail: 'Class V A · VIS-2026-0426 · fever 38.4 C',
        seen: '31 Jul 2026', record: 'VIS-2026-0426',
        state: 'In sick room', stateTint: 'badge badge-soft-warning',
      },
      {
        name: 'Tanvi Sharma', detail: 'Class V A · sore throat, seen 29 Jul',
        seen: '29 Jul 2026', record: 'VIS-2026-0398',
        state: 'Recovered', stateTint: 'badge badge-soft-success',
      },
      {
        name: 'Dev Anand', detail: 'Class V A · sore throat, seen 28 Jul',
        seen: '28 Jul 2026', record: 'VIS-2026-0391',
        state: 'Recovered', stateTint: 'badge badge-soft-success',
      },
    ],
    medical: [
      'Fever between 38.0 and 38.6 C on presentation',
      'Red throat with no visible exudate in all three cases',
      'Throat swab sent for the index case, result awaited',
    ],
    actions: [
      { task: 'Screen the whole class at the morning assembly', owner: 'Ms. Meera Nair' },
      { task: 'Keep symptomatic students out of shared activities', owner: 'Mrs. Ellen Cruz' },
      { task: 'Extra cleaning of desks and door handles in Room A-104', owner: 'Estates Office' },
    ],
    notifications: [
      { channel: 'SMS', audience: 'Guardians of Class V A', at: '15:25', recipients: 24, acknowledged: 19 },
      { channel: 'Email', audience: 'Class V A teaching team', at: '15:25', recipients: 6, acknowledged: 6 },
    ],
    attachments: [
      { name: 'Class V A Screening Sheet.pdf', meta: 'Raised 31 Jul 2026 · 58 KB' },
      { name: 'Infection Control Checklist.pdf', meta: 'School health policy · 74 KB' },
    ],
    contacts: [
      {
        icon: 'ti ti-phone', name: 'Mrs. Janet Iyer',
        detail: 'Mother · guardian of the index case', state: 'Reached 15:25',
      },
    ],
    raisedNote: 'Alert raised after the third case',
    closingNote: 'Class placed under observation',
    notes: 'Not a notifiable outbreak at three cases. The threshold for informing the district office is five in one class within seven days.',
  },
  {
    id: 'HA-2026-0139',
    title: 'Asthma emergency in Class IX C',
    summary: 'Moderate acute asthma not settling after two nebulisers. Ambulance transfer under way.',
    type: 'Emergency Incident', severity: 'Critical',
    group: 'Class IX C', scope: '1 student · whole campus response',
    reporter: 'Mrs. Sofia Alvarez', reporterRole: 'Senior Nurse · NUR-2019-002',
    raisedDate: '31 Jul 2026', raisedTime: '15:22', published: true,
    monitorUntil: '', escalatedAt: '15:30', escalatedTo: 'Principal',
    resolvedDate: '', resolvedAt: '', resolvedBy: '',
    linkedVisit: 'MV-2026-0518', caseCount: 0,
    individuals: [
      {
        name: 'Rohan Desai', detail: 'Class IX C · MV-2026-0518 · saturation 93%',
        seen: '31 Jul 2026', record: 'MV-2026-0518',
        state: 'Referred', stateTint: 'badge badge-soft-danger',
      },
    ],
    medical: [
      'Audible wheeze with speech in short phrases on arrival',
      'Peak expiratory flow at 58 percent of personal best',
      'Reliever inhaler was not carried to school',
    ],
    actions: [
      { task: 'Continue oxygen and nebulisers until the ambulance arrives', owner: 'Mrs. Sofia Alvarez' },
      { task: 'Clear Lane 1 and hold the barrier open for the ambulance', owner: 'Main Gate' },
      { task: 'Hold the asthma register open for the clinic handover', owner: 'Administration' },
    ],
    notifications: [
      { channel: 'Phone call', audience: 'Guardian · Mr. Nikhil Desai', at: '15:24', recipients: 1, acknowledged: 1 },
      { channel: 'Push', audience: 'Emergency response team', at: '15:26', recipients: 8, acknowledged: 8 },
      { channel: 'Email', audience: 'Principal and Chief Warden', at: '15:30', recipients: 2, acknowledged: 2 },
    ],
    attachments: [
      { name: 'Asthma Action Plan.pdf', meta: 'Filed 12 Apr 2026 · 82 KB' },
      { name: 'Clinic Referral REF-2026-0091.pdf', meta: 'Raised 15:20 · 44 KB' },
    ],
    contacts: [
      { icon: 'ti ti-phone', name: 'Mr. Nikhil Desai', detail: 'Father · +1 55 7745 1102', state: 'Reached 15:24' },
      { icon: 'ti ti-ambulance', name: 'Riverside Clinic', detail: 'Dr. Anil Menon · REF-2026-0091', state: 'En route' },
    ],
    raisedNote: 'Emergency alert raised',
    closingNote: 'Escalated to the Principal',
    notes: 'Spare reliever inhalers to be stocked in the health room. Policy change to be tabled at the next safety meeting.',
  },
  {
    id: 'HA-2026-0121',
    title: 'Peanut allergy risk in the Grade IV lunch service',
    summary: 'A tray of peanut based dessert was plated next to the Grade IV nut free service line.',
    type: 'Allergy Alert', severity: 'High',
    group: 'Cafeteria and Class IV A', scope: '31 students and 6 catering staff',
    reporter: 'Ms. Rosa Klein', reporterRole: 'Cafeteria Manager · Cafeteria',
    raisedDate: '26 Jul 2026', raisedTime: '08:40', published: true,
    monitorUntil: '', escalatedAt: '', escalatedTo: '',
    resolvedDate: '', resolvedAt: '', resolvedBy: '',
    linkedVisit: '', caseCount: 0,
    individuals: [
      {
        name: 'Ishaan Verma', detail: 'Class IV A · documented peanut allergy',
        seen: '26 Jul 2026', record: 'Allergy register',
        state: 'No exposure', stateTint: 'badge badge-soft-success',
      },
      {
        name: 'Riya Menon', detail: 'Class IV A · documented tree nut allergy',
        seen: '26 Jul 2026', record: 'Allergy register',
        state: 'No exposure', stateTint: 'badge badge-soft-success',
      },
      {
        name: 'Catering line 2', detail: 'Six staff briefed on the separation rule',
        seen: '26 Jul 2026', record: 'Kitchen briefing',
        state: 'Briefed', stateTint: 'badge badge-soft-info',
      },
    ],
    medical: [
      'Both students carry adrenaline auto injectors held in the health room',
      'No exposure or reaction recorded on the day',
      'Allergy register reviewed and reprinted for the kitchen wall',
    ],
    actions: [
      { task: 'Move all nut based desserts to a separate service trolley', owner: 'Ms. Rosa Klein' },
      { task: 'Re-brief the catering team on the allergy register', owner: 'Mrs. Sofia Alvarez' },
      { task: 'Install nut free signage above the Grade IV line', owner: 'Estates Office' },
    ],
    notifications: [
      { channel: 'Email', audience: 'Guardians of Class IV A', at: '13:50', recipients: 31, acknowledged: 22 },
      { channel: 'Notice', audience: 'Catering and kitchen staff', at: '13:50', recipients: 6, acknowledged: 6 },
    ],
    attachments: [
      { name: 'Allergy Register Extract.pdf', meta: 'Class IV A · 46 KB' },
      { name: 'Kitchen Briefing Note.pdf', meta: 'Signed by six staff · 52 KB' },
    ],
    contacts: [],
    raisedNote: 'Allergy risk reported by the kitchen',
    closingNote: 'Standing alert kept open on the register',
    notes: 'The notification went out five hours after the report, past the four hour target for a high priority alert. Kitchen to raise allergy alerts directly with the health room in future.',
  },
  {
    id: 'HA-2026-0126',
    title: 'Medication consent forms outstanding',
    summary: 'Fourteen students have no signed consent on file for over the counter medication.',
    type: 'Medication Alert', severity: 'Low',
    group: 'Guardians · all classes', scope: '14 students without a signed form',
    reporter: 'Mrs. Sofia Alvarez', reporterRole: 'Senior Nurse · NUR-2019-002',
    raisedDate: '28 Jul 2026', raisedTime: '09:15', published: true,
    monitorUntil: '5 Aug 2026', escalatedAt: '', escalatedTo: '',
    resolvedDate: '', resolvedAt: '', resolvedBy: '',
    linkedVisit: '', caseCount: 0,
    individuals: [
      {
        name: 'Class VI B', detail: 'Four consent forms outstanding',
        seen: '28 Jul 2026', record: 'Consent audit',
        state: '4 outstanding', stateTint: 'badge badge-soft-warning',
      },
      {
        name: 'Class VII A', detail: 'Six consent forms outstanding',
        seen: '28 Jul 2026', record: 'Consent audit',
        state: '6 outstanding', stateTint: 'badge badge-soft-warning',
      },
      {
        name: 'Class IX C', detail: 'Four consent forms outstanding',
        seen: '28 Jul 2026', record: 'Consent audit',
        state: '4 outstanding', stateTint: 'badge badge-soft-warning',
      },
    ],
    medical: [
      'No medication may be given without a signed guardian consent',
      'Affected students can still receive first aid and rest',
      'Emergency treatment is not blocked by a missing consent form',
    ],
    actions: [
      { task: 'Send the consent form home with the weekly folder', owner: 'Class teachers' },
      { task: 'Chase by SMS if the form is not returned by 5 Aug', owner: 'Administration' },
      { task: 'Flag affected students on the sick room screen', owner: 'Health room' },
    ],
    notifications: [
      { channel: 'SMS', audience: 'Guardians without a signed form', at: '13:20', recipients: 14, acknowledged: 9 },
      { channel: 'Email', audience: 'Class teachers', at: '13:20', recipients: 12, acknowledged: 12 },
    ],
    attachments: [
      { name: 'Medication Consent Form.pdf', meta: 'School template · 34 KB' },
      { name: 'Outstanding Consent List.pdf', meta: 'Fourteen students · 28 KB' },
    ],
    contacts: [],
    raisedNote: 'Consent audit completed',
    closingNote: 'Monitoring until the deadline',
    notes: 'Five forms returned since the reminder. The remaining nine are chased through the class teachers each Friday.',
  },
  {
    id: 'HA-2026-0144',
    title: 'Heat advisory for outdoor physical training',
    summary: 'Two students seen with heat related dizziness after the same afternoon PT session.',
    type: 'Health Advisory', severity: 'Medium',
    group: 'All students · Games department', scope: 'Outdoor sessions only',
    reporter: 'Ms. Grace Otieno', reporterRole: 'Nurse Assistant · NUR-2023-011',
    raisedDate: '31 Jul 2026', raisedTime: '15:35', published: false,
    monitorUntil: '', escalatedAt: '', escalatedTo: '',
    resolvedDate: '', resolvedAt: '', resolvedBy: '',
    linkedVisit: 'VIS-2026-0431', caseCount: 2,
    individuals: [
      {
        name: 'Kabir Shah', detail: 'Class VI B · VIS-2026-0431 · dizziness after PT',
        seen: '31 Jul 2026', record: 'VIS-2026-0431',
        state: 'Recovered', stateTint: 'badge badge-soft-success',
      },
      {
        name: 'Aditya Nair', detail: 'Class VI B · light headed, rested in the shade',
        seen: '31 Jul 2026', record: 'Health room log',
        state: 'Recovered', stateTint: 'badge badge-soft-success',
      },
    ],
    medical: [
      'Both students were light headed on standing with warm dry skin',
      'Neither had eaten breakfast before the session',
      'Recovery was complete with rest, fluids and leg elevation',
    ],
    actions: [
      { task: 'Move afternoon drills to the shaded court until further notice', owner: 'Games department' },
      { task: 'Remind students to carry a filled water bottle', owner: 'Class teachers' },
      { task: 'Keep oral rehydration salts at the games field', owner: 'Health room' },
    ],
    notifications: [
      { channel: 'SMS', audience: 'Guardians of all students', at: '', recipients: 214, acknowledged: 0 },
      { channel: 'Email', audience: 'Games department and class teachers', at: '', recipients: 18, acknowledged: 0 },
    ],
    attachments: [
      { name: 'Heat Advisory Draft.pdf', meta: 'Drafted 15:35 · 30 KB' },
    ],
    contacts: [],
    raisedNote: 'Advisory drafted after the second case',
    closingNote: 'Awaiting approval from the Chief Warden',
    notes: 'Draft held for the Chief Warden to approve before it goes to guardians. The games department has already been told verbally.',
  },
  {
    id: 'HA-2026-0133',
    title: 'Laboratory glassware injury in Class X B',
    summary: 'A student sustained a deep forearm laceration from broken glassware during a practical.',
    type: 'Emergency Incident', severity: 'High',
    group: 'Class X B · Science block', scope: '1 student · laboratory closed for review',
    reporter: 'Mrs. Sofia Alvarez', reporterRole: 'Senior Nurse · NUR-2019-002',
    raisedDate: '31 Jul 2026', raisedTime: '10:55', published: true,
    monitorUntil: '', escalatedAt: '', escalatedTo: '',
    resolvedDate: '31 Jul 2026', resolvedAt: '11:40', resolvedBy: 'Mrs. Sofia Alvarez',
    linkedVisit: 'MV-2026-0511', caseCount: 0,
    individuals: [
      {
        name: 'Ananya Rao', detail: 'Class X B · MV-2026-0511 · referred for sutures',
        seen: '31 Jul 2026', record: 'MV-2026-0511',
        state: 'Referred', stateTint: 'badge badge-soft-danger',
      },
    ],
    medical: [
      'Laceration approximately 4 cm with clean edges, bleeding controlled',
      'Tetanus immunisation confirmed current, booster 2024',
      'Full movement of the wrist and fingers preserved',
    ],
    actions: [
      { task: 'Withdraw the cracked glassware batch from all laboratories', owner: 'Science department' },
      { task: 'Escort the student to Riverside Clinic', owner: 'Mrs. Sofia Alvarez' },
      { task: 'Sharps sweep of Laboratory 2 before the next session', owner: 'Estates Office' },
    ],
    notifications: [
      { channel: 'Phone call', audience: 'Guardian · Mrs. Kavita Rao', at: '11:00', recipients: 1, acknowledged: 1 },
      { channel: 'Email', audience: 'Science department and Administration', at: '11:05', recipients: 9, acknowledged: 9 },
    ],
    attachments: [
      { name: 'Incident Report HA-2026-0133.pdf', meta: 'Raised 10:55 · 62 KB' },
      { name: 'Glassware Withdrawal Note.pdf', meta: 'Science department · 40 KB' },
    ],
    contacts: [
      { icon: 'ti ti-phone', name: 'Mrs. Kavita Rao', detail: 'Mother · met the student at the clinic', state: 'Reached 11:00' },
      { icon: 'ti ti-ambulance', name: 'Riverside Clinic', detail: 'Sutures and dressing', state: 'Handover complete' },
    ],
    raisedNote: 'Incident alert raised',
    closingNote: 'Alert resolved after the transfer',
    notes: 'Glassware batch withdrawn the same morning. A handling briefing is scheduled for Class X B before the next practical.',
  },
  {
    id: 'HA-2026-0115',
    title: 'Cafeteria batch recall · chilled dessert',
    summary: 'Supplier recalled a chilled dessert batch over a cold chain failure during delivery.',
    type: 'Health Advisory', severity: 'Critical',
    group: 'All students and staff', scope: 'Lunch service withdrawn for one day',
    reporter: 'Ms. Rosa Klein', reporterRole: 'Cafeteria Manager · Cafeteria',
    raisedDate: '20 Jul 2026', raisedTime: '12:30', published: true,
    monitorUntil: '', escalatedAt: '12:45', escalatedTo: 'Principal',
    resolvedDate: '20 Jul 2026', resolvedAt: '18:00', resolvedBy: 'Ms. Rosa Klein',
    linkedVisit: '', caseCount: 0,
    individuals: [
      {
        name: 'Whole school lunch service', detail: 'Dessert withdrawn before service',
        seen: '20 Jul 2026', record: 'Service log',
        state: 'No exposure', stateTint: 'badge badge-soft-success',
      },
      {
        name: 'Cafeteria team', detail: 'Six staff involved in the withdrawal',
        seen: '20 Jul 2026', record: 'Quarantine log',
        state: 'Briefed', stateTint: 'badge badge-soft-info',
      },
      {
        name: 'FreshLine Foods', detail: 'Supplier SUP-2023-008 issued the recall',
        seen: '20 Jul 2026', record: 'SUP-2023-008',
        state: 'Confirmed', stateTint: 'badge badge-soft-secondary',
      },
    ],
    medical: [
      'No student or staff member consumed the recalled batch',
      'No gastrointestinal complaints reported in the following 48 hours',
      'Health room asked to log any related symptoms for one week',
    ],
    actions: [
      { task: 'Withdraw and quarantine the batch before service', owner: 'Ms. Rosa Klein' },
      { task: 'Confirm the recall in writing with the supplier', owner: 'Administration' },
      { task: 'Watch for gastrointestinal complaints for seven days', owner: 'Health room' },
    ],
    notifications: [
      { channel: 'Push', audience: 'All staff', at: '12:38', recipients: 96, acknowledged: 88 },
      { channel: 'SMS', audience: 'Guardians of all students', at: '12:40', recipients: 214, acknowledged: 190 },
      { channel: 'Email', audience: 'Principal and Chief Warden', at: '12:45', recipients: 2, acknowledged: 2 },
    ],
    attachments: [
      { name: 'Supplier Recall Notice.pdf', meta: 'FreshLine Foods · 70 KB' },
      { name: 'Batch Quarantine Log.pdf', meta: 'Signed by the cafeteria manager · 48 KB' },
    ],
    contacts: [
      { icon: 'ti ti-building', name: 'FreshLine Foods', detail: 'Supplier SUP-2023-008', state: 'Recall confirmed' },
    ],
    raisedNote: 'Supplier recall received',
    closingNote: 'Batch quarantined and alert closed',
    notes: 'Cold chain checks added to the goods inward routine at the service gate from 21 Jul.',
  },
  {
    id: 'HA-2026-0108',
    title: 'Chronic condition register update',
    summary: 'Termly refresh of the asthma, epilepsy and severe allergy register for teaching staff.',
    type: 'Chronic Condition', severity: 'Medium',
    group: 'All teaching staff', scope: '11 students on the register',
    reporter: 'Mrs. Sofia Alvarez', reporterRole: 'Senior Nurse · NUR-2019-002',
    raisedDate: '18 Jul 2026', raisedTime: '10:00', published: true,
    monitorUntil: '', escalatedAt: '', escalatedTo: '',
    resolvedDate: '24 Jul 2026', resolvedAt: '16:30', resolvedBy: 'Mrs. Sofia Alvarez',
    linkedVisit: '', caseCount: 0,
    individuals: [
      {
        name: 'Asthma register', detail: 'Six students including Class IX C',
        seen: '18 Jul 2026', record: 'Care plans on file',
        state: '6 students', stateTint: 'badge badge-soft-info',
      },
      {
        name: 'Epilepsy register', detail: 'Two students with individual care plans',
        seen: '18 Jul 2026', record: 'Care plans on file',
        state: '2 students', stateTint: 'badge badge-soft-info',
      },
      {
        name: 'Severe allergy register', detail: 'Three students carrying auto injectors',
        seen: '18 Jul 2026', record: 'Care plans on file',
        state: '3 students', stateTint: 'badge badge-soft-info',
      },
    ],
    medical: [
      'Each student on the register has a signed care plan on file',
      'Emergency medication locations confirmed with the health room',
      'Care plans reviewed with the guardians before publication',
    ],
    actions: [
      { task: 'Read and acknowledge the updated register', owner: 'Class teachers' },
      { task: 'Refresh the emergency medication cupboard labels', owner: 'Health room' },
      { task: 'File the acknowledgements with the safety record', owner: 'Administration' },
    ],
    notifications: [
      { channel: 'Email', audience: 'All teaching staff', at: '11:30', recipients: 64, acknowledged: 64 },
      { channel: 'Notice', audience: 'Staff room noticeboard', at: '11:30', recipients: 1, acknowledged: 1 },
    ],
    attachments: [
      { name: 'Chronic Condition Register.pdf', meta: 'Term 2 · 118 KB' },
      { name: 'Staff Acknowledgement Sheet.pdf', meta: 'Sixty four signatures · 92 KB' },
    ],
    contacts: [],
    raisedNote: 'Register refresh started',
    closingNote: 'All acknowledgements received',
    notes: 'Every teaching member acknowledged within six days. The register is refreshed at the start of each term.',
  },
];
