export type Category =
  | 'Academic' | 'Attendance' | 'Fees' | 'Examination' | 'Homework' | 'Behaviour'
  | 'PTA' | 'Achievement' | 'Emergency' | 'Transport' | 'Medical' | 'Newsletter';

export type Priority = 'Urgent' | 'High' | 'Normal' | 'Low';

export type Channel = 'Email' | 'Push' | 'Portal';

export type Status = 'Sent' | 'Scheduled' | 'Draft' | 'Processing' | 'Failed' | 'Archived';

export interface Attachment {
  name: string;
  meta: string;
}

export interface Notification {
  id: string;
  category: Category;
  title: string;
  summary: string;

  audienceLabel: string;
  audience: number;

  priority: Priority;
  channels: Channel[];

  /** "29 Jul, 06:12 pm" — when it went, is going, or was drafted. */
  stamp: string;
  /** A recurring notification says how often rather than when. */
  recurrence: string;

  /** Zero until something has gone out. */
  delivered: number;
  read: number;
  acknowledged: number;
  ackRequired: boolean;

  scheduled: boolean;
  draft: boolean;
  archived: boolean;
  /** Set when the gateway returned a problem. */
  failure: string;

  attachments: Attachment[];
  createdBy: string;
  /** Notifications the system raises rather than a person. */
  automated: boolean;
}

/* --------------------------------- Tints ----------------------------------- */

export const priorityBadge: Record<Priority, string> = {
  Urgent: 'message-status-badge is-urgent',
  High: 'message-status-badge is-high',
  Normal: 'message-status-badge',
  Low: 'message-status-badge is-draft',
};

export const priorityIcon: Record<Priority, string> = {
  Urgent: 'ti ti-alert-triangle',
  High: 'ti ti-flame',
  Normal: 'ti ti-point',
  Low: 'ti ti-arrow-down',
};

export const statusBadge: Record<Status, string> = {
  Sent: 'message-status-badge is-live',
  Scheduled: 'message-status-badge is-scheduled',
  Draft: 'message-status-badge is-draft',
  Processing: 'message-status-badge is-high',
  Failed: 'message-status-badge is-urgent',
  Archived: 'message-status-badge is-draft',
};

export const statusIcon: Record<Status, string> = {
  Sent: 'ti ti-checks',
  Scheduled: 'ti ti-clock',
  Draft: 'ti ti-pencil',
  Processing: 'ti ti-loader',
  Failed: 'ti ti-x',
  Archived: 'ti ti-archive',
};

/** The `.message-note-item` modifier the card carries. */
export const cardToneOf = (row: Notification): string => {
  if (row.archived) return ' is-archived';
  if (row.draft) return ' is-draft';
  const priority = row.priority === 'Urgent' ? ' is-urgent' : row.priority === 'High' ? ' is-high' : '';
  return `${priority}${row.scheduled || row.draft ? '' : ' is-sent'}`;
};

export const channelIcon: Record<Channel, string> = {
  Email: 'ti ti-mail',
  Push: 'ti ti-bell',
  Portal: 'ti ti-users',
};

export const categoryIcon: Record<Category, string> = {
  Academic: 'ti ti-book',
  Attendance: 'ti ti-calendar-x',
  Fees: 'ti ti-report-money',
  Examination: 'ti ti-file-certificate',
  Homework: 'ti ti-notebook',
  Behaviour: 'ti ti-mood-search',
  PTA: 'ti ti-users-group',
  Achievement: 'ti ti-trophy',
  Emergency: 'ti ti-alert-triangle',
  Transport: 'ti ti-bus',
  Medical: 'ti ti-stethoscope',
  Newsletter: 'ti ti-news',
};

/* ------------------------------ Filter options ------------------------------ */

export const categoryOptions: Category[] = [
  'Academic', 'Attendance', 'Fees', 'Examination', 'Homework', 'Behaviour',
  'PTA', 'Achievement', 'Emergency', 'Transport', 'Medical',
];

export const channelFilterOptions = [
  'Email Notifications', 'Push Notifications', 'Parent Communication',
];

export const audienceOptions = [
  'All Students', 'Parents', 'Teachers', 'Staff', 'Specific Classes',
  'Sections', 'Departments', 'Transport Users', 'Hostel Students', 'Custom Groups',
];

export const priorityOptions: Priority[] = ['Urgent', 'High', 'Normal', 'Low'];

export const statusOptions: Status[] = [
  'Sent', 'Scheduled', 'Draft', 'Processing', 'Failed', 'Archived',
];

export const readStatusOptions = [
  'Above 80% read', 'Below 50% read', 'Acknowledgement pending', 'Fully acknowledged',
];

export const authorOptions = [
  'Me', 'Ms. Latha Rao', 'Mr. Arun Prakash', 'Ms. Divya Nair', 'System',
];

/* ------------------------------- Derivations -------------------------------- */

export const REGISTER_DATE = '2 Aug 2026';

/**
 * The template's filter offers "Below 50 % read" but flags a notification at
 * 53 %, so this is where the line actually sits.
 */
export const LOW_READ_THRESHOLD = 60;

export const percent = (part: number, whole: number): number =>
  (whole > 0 ? Math.round((part / whole) * 100) : 0);

export const deliveryRateOf = (row: Notification): number => percent(row.delivered, row.audience);

export const readRateOf = (row: Notification): number => percent(row.read, row.audience);

export const acknowledgementRateOf = (row: Notification): number =>
  percent(row.acknowledged, row.audience);

export const hasGoneOut = (row: Notification): boolean => row.delivered > 0;

export const statusOf = (row: Notification): Status => {
  if (row.archived) return 'Archived';
  if (row.failure) return 'Failed';
  if (row.draft) return 'Draft';
  if (row.scheduled) return 'Scheduled';
  return hasGoneOut(row) ? 'Sent' : 'Processing';
};

/** The card's delivery figure, which is a dash until something has gone. */
export const deliveryLabelOf = (row: Notification): string =>
  (hasGoneOut(row) ? `${deliveryRateOf(row)}%` : '—');

export const readLabelOf = (row: Notification): string =>
  (hasGoneOut(row) ? `${readRateOf(row)}%` : '—');

export const isLowRead = (row: Notification): boolean =>
  hasGoneOut(row) && readRateOf(row) < LOW_READ_THRESHOLD;

export const isWellRead = (row: Notification): boolean =>
  hasGoneOut(row) && readRateOf(row) >= 80;

/** Acknowledgements still outstanding on a notification that asked for them. */
export const outstandingAckOf = (row: Notification): number =>
  (row.ackRequired ? Math.max(0, row.delivered - row.acknowledged) : 0);

export const needsAck = (row: Notification): boolean => outstandingAckOf(row) > 0;

/** The stamp line under the title, which changes with the status. */
export const stampLabelOf = (row: Notification): string => {
  const status = statusOf(row);
  if (row.recurrence) return row.recurrence;
  if (status === 'Draft') return `Drafted ${row.stamp}`;
  if (status === 'Scheduled') return `Sends ${row.stamp}`;
  return `Sent ${row.stamp}`;
};

export const stampIconOf = (row: Notification): string => {
  const status = statusOf(row);
  if (row.recurrence) return 'ti ti-repeat';
  if (status === 'Draft') return 'ti ti-pencil';
  return status === 'Scheduled' ? 'ti ti-clock' : 'ti ti-send';
};

export const attachmentLabelOf = (row: Notification): string => {
  const count = row.attachments.length;
  if (count === 0) return 'No attachments';
  return `${count} attachment${count === 1 ? '' : 's'}`;
};

/** The card's action set, which the status decides. */
export const primaryActionOf = (row: Notification): { id: string; icon: string; label: string } => {
  if (row.draft) return { id: 'schedule', icon: 'ti ti-clock-play', label: 'Schedule' };
  if (row.scheduled) return { id: 'schedule', icon: 'ti ti-clock-cog', label: 'Reschedule' };
  if (row.recurrence) return { id: 'rule', icon: 'ti ti-repeat', label: 'Rule' };
  if (row.archived) return { id: 'duplicate', icon: 'ti ti-copy', label: 'Reuse' };
  return { id: 'duplicate', icon: 'ti ti-copy', label: 'Duplicate' };
};

export interface Pair {
  label: string;
  value: string;
}

export const detailPairsOf = (row: Notification): Pair[] => [
  { label: 'Reference', value: row.id },
  { label: 'Category', value: row.category },
  { label: 'Priority', value: row.priority },
  { label: 'Audience', value: `${row.audienceLabel} · ${row.audience.toLocaleString()}` },
  { label: 'Channels', value: row.channels.join(', ') },
  { label: 'Created by', value: row.automated ? `${row.createdBy} · automation` : row.createdBy },
];

export const reachPairsOf = (row: Notification): Pair[] => [
  { label: 'Delivered', value: hasGoneOut(row) ? `${row.delivered.toLocaleString()} · ${deliveryRateOf(row)}%` : 'Not sent' },
  { label: 'Read', value: hasGoneOut(row) ? `${row.read.toLocaleString()} · ${readRateOf(row)}%` : '—' },
  {
    label: 'Acknowledged',
    value: row.ackRequired
      ? `${row.acknowledged.toLocaleString()} · ${acknowledgementRateOf(row)}%`
      : 'Not required',
  },
  {
    label: 'Outstanding',
    value: row.ackRequired ? outstandingAckOf(row).toLocaleString() : '—',
  },
];

export const searchIndexOf = (row: Notification): string =>
  [row.id, row.title, row.summary, row.category, row.audienceLabel, row.createdBy, statusOf(row)]
    .join(' ')
    .toLowerCase();

/* --------------------------------- Summary ---------------------------------- */

/** The period holds 62 notifications; this page lists eight of them. */
export const TOTAL_COUNT = 62;

export const QUICK_TOTALS = {
  email: 31,
  push: 19,
  parent: 24,
  scheduled: 5,
  lowRead: 4,
  needsAck: 3,
};

export const PERIOD = '01 Jul 2026 - 02 Aug 2026';

/* ---------------------------------- Rows ------------------------------------ */

export const notifications: Notification[] = [
  {
    id: 'NTF-2026-0142', category: 'Emergency',
    title: 'School closed Thursday due to heavy rainfall',
    summary: 'District advisory issued this evening. Buses will not run and the hostel mess is on a holiday schedule.',
    audienceLabel: 'Entire school', audience: 2940,
    priority: 'Urgent', channels: ['Email', 'Push', 'Portal'],
    stamp: '29 Jul, 06:12 pm', recurrence: '',
    delivered: 2911, read: 2684, acknowledged: 2411, ackRequired: true,
    scheduled: false, draft: false, archived: false, failure: '',
    attachments: [{ name: 'District advisory 29-07-2026.pdf', meta: 'PDF · 412 KB' }],
    createdBy: 'Ms. Latha Rao', automated: false,
  },
  {
    id: 'NTF-2026-0134', category: 'Fees',
    title: 'Second term fee due by 10 August',
    summary: 'Sent only to families with an outstanding balance. Concession holders were excluded automatically.',
    audienceLabel: 'Parents with dues', audience: 318,
    priority: 'High', channels: ['Email', 'Push', 'Portal'],
    stamp: '24 Jul, 07:30 am', recurrence: '',
    delivered: 312, read: 229, acknowledged: 0, ackRequired: false,
    scheduled: false, draft: false, archived: false,
    failure: 'Six email addresses hard-bounced — mailbox does not exist. Portal copies were delivered.',
    attachments: [{ name: 'Fee annexure term 2.pdf', meta: 'PDF · 88 KB' }],
    createdBy: 'Ms. Divya Nair', automated: false,
  },
  {
    id: 'NTF-2026-0151', category: 'Attendance',
    title: 'Daily absence alert — 02 August',
    summary: 'Runs every school morning at 10:15 once the registers close. One message per absent student.',
    audienceLabel: 'Parents of absentees', audience: 47,
    priority: 'Normal', channels: ['Push', 'Portal', 'Email'],
    stamp: '02 Aug, 10:15 am', recurrence: 'Daily, school days',
    delivered: 47, read: 41, acknowledged: 0, ackRequired: false,
    scheduled: false, draft: false, archived: false, failure: '',
    attachments: [],
    createdBy: 'System', automated: true,
  },
  {
    id: 'NTF-2026-0138', category: 'Examination',
    title: 'Term-2 datesheet and hall tickets',
    summary: 'Hall tickets are available in the portal from Monday. Seating plans attached class by class.',
    audienceLabel: 'Students, Parents', audience: 1920,
    priority: 'High', channels: ['Email', 'Push', 'Portal'],
    stamp: '26 Jul, 09:02 am', recurrence: '',
    delivered: 1882, read: 1402, acknowledged: 1180, ackRequired: true,
    scheduled: false, draft: false, archived: false, failure: '',
    attachments: [
      { name: 'Term-2 timetable.pdf', meta: 'PDF · 128 KB' },
      { name: 'Seating plan Grades 6-10.pdf', meta: 'PDF · 246 KB' },
      { name: 'Examination rules.pdf', meta: 'PDF · 64 KB' },
    ],
    createdBy: 'Mr. Arun Prakash', automated: false,
  },
  {
    id: 'NTF-2026-0147', category: 'PTA',
    title: 'Parent–teacher meeting is tomorrow',
    summary: "Reminder sent the afternoon before, with each parent's booked slot merged in from the portal.",
    audienceLabel: 'Parents, 6–10', audience: 720,
    priority: 'Normal', channels: ['Push', 'Portal', 'Email'],
    stamp: '08 Aug, 04:00 pm', recurrence: '',
    delivered: 0, read: 0, acknowledged: 0, ackRequired: false,
    scheduled: true, draft: false, archived: false, failure: '',
    attachments: [],
    createdBy: 'Ms. Divya Nair', automated: false,
  },
  {
    id: 'NTF-2026-0153', category: 'Achievement',
    title: 'Inter-school quiz — first place',
    summary: 'Awaiting the photographs from the event before publishing. Names verified against the entry list.',
    audienceLabel: 'Entire school', audience: 2940,
    priority: 'Low', channels: ['Email', 'Push'],
    stamp: '01 Aug', recurrence: '',
    delivered: 0, read: 0, acknowledged: 0, ackRequired: false,
    scheduled: false, draft: true, archived: false, failure: '',
    attachments: [
      { name: 'Quiz results.pdf', meta: 'PDF · 42 KB' },
      { name: 'Team entry list.pdf', meta: 'PDF · 28 KB' },
    ],
    createdBy: 'Ms. Latha Rao', automated: false,
  },
  {
    id: 'NTF-2026-0155', category: 'Transport',
    title: 'Route 7 running 20 minutes late',
    summary: 'Push only — a delay notice read an hour later is worse than useless, so email was deliberately excluded.',
    audienceLabel: 'Route 7 families', audience: 84,
    priority: 'High', channels: ['Push', 'Portal'],
    stamp: '02 Aug, 05:00 pm', recurrence: '',
    delivered: 79, read: 75, acknowledged: 0, ackRequired: false,
    scheduled: false, draft: false, archived: false, failure: '',
    attachments: [],
    createdBy: 'Mr. Arun Prakash', automated: false,
  },
  {
    id: 'NTF-2026-0108', category: 'Newsletter',
    title: 'July newsletter — library week',
    summary: 'Read by barely half the school. Worth shortening before the August edition goes out.',
    audienceLabel: 'Entire school', audience: 2940,
    priority: 'Low', channels: ['Email', 'Portal'],
    stamp: '02 Jul, 08:00 am', recurrence: '',
    delivered: 2852, read: 1558, acknowledged: 0, ackRequired: false,
    scheduled: false, draft: false, archived: true, failure: '',
    attachments: [{ name: 'July newsletter.pdf', meta: 'PDF · 2.1 MB' }],
    createdBy: 'Mr. Suresh Babu', automated: false,
  },
];
