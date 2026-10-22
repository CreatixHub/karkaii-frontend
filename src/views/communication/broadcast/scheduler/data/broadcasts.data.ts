export type Status = 'Scheduled' | 'Draft' | 'Paused' | 'Completed' | 'Cancelled';

export type Approval =
  | 'Awaiting approval' | 'Approved' | 'Auto-approved' | 'Rejected' | 'Requires review';

export type Delivery =
  | 'Not started' | 'Queued' | 'Sending' | 'Delivered' | 'Partially delivered'
  | 'Failed' | 'Never sent';

export type Cadence = 'One-off' | 'Immediate' | 'Daily' | 'Weekly' | 'Monthly' | 'Yearly';

export type Channel =
  | 'Email' | 'SMS' | 'WhatsApp' | 'Push Notification'
  | 'In-App' | 'Website Banner' | 'Digital Notice Board';

export interface ApprovalStep {
  who: string;
  state: string;
  at: string;
  note: string;
}

export interface AudienceRow {
  label: string;
  note: string;
  value: string;
}

export interface ChannelState {
  channel: Channel;
  note: string;
  state: string;
}

export interface Attachment {
  name: string;
  meta: string;
}

export interface BodyBlock {
  heading: string;
  paragraphs: string[];
  bullets: string[];
}

export interface Broadcast {
  id: string;
  /** The `category` chip — the broadcast type, in the template's own words. */
  category: string;
  title: string;
  description: string;
  body: BodyBlock[];
  /** The reader's line above the title, e.g. "Fees · Parents with an outstanding balance". */
  readerLead: string;
  readerTitle: string;

  status: Status;
  approval: Approval;
  delivery: Delivery;

  /** "05 Aug 2026" — the departure, or the last send for a completed one. */
  sendDate: string;
  sendTime: string;
  timeZone: string;
  /** Empty unless the broadcast expires. */
  expires: string;

  cadence: Cadence;
  /** "Every Monday", "Monthly · 25th", "Yearly · 15 Aug" — empty for one-offs. */
  cadenceLabel: string;
  /** Runs already completed on a series. */
  sentTimes: number;
  /** Recipients actually reached, on a completed broadcast. */
  delivered: number;

  audienceLabel: string;
  audienceCount: number;
  audienceRows: AudienceRow[];

  channels: Channel[];
  channelStates: ChannelState[];

  attachments: Attachment[];

  createdBy: string;
  createdOn: string;
  /** Paused and cancelled broadcasts record who stopped them, and when. */
  heldSince: string;
  heldBy: string;

  approvalTrail: ApprovalStep[];
}

/* --------------------------------- Tints ----------------------------------- */

export const statusTone: Record<Status, string> = {
  Scheduled: '',
  Draft: ' is-draft',
  Paused: ' is-paused',
  Completed: ' is-sent',
  Cancelled: ' is-cancelled',
};

export const approvalBadge: Record<Approval, string> = {
  'Awaiting approval': 'message-status-badge is-high',
  Approved: 'message-status-badge is-live',
  'Auto-approved': 'message-status-badge is-live',
  Rejected: 'message-status-badge is-urgent',
  'Requires review': 'message-status-badge is-high',
};

export const approvalIcon: Record<Approval, string> = {
  'Awaiting approval': 'ti ti-hourglass',
  Approved: 'ti ti-circle-check',
  'Auto-approved': 'ti ti-circle-check',
  Rejected: 'ti ti-x',
  'Requires review': 'ti ti-eye-search',
};

/** Draft, paused and cancelled cards show the status instead of an approval. */
export const statusChipBadge: Record<Status, string> = {
  Scheduled: 'message-status-badge',
  Draft: 'message-status-badge is-draft',
  Paused: 'message-status-badge is-paused',
  Completed: 'message-status-badge is-live',
  Cancelled: 'message-status-badge is-urgent',
};

export const statusChipIcon: Record<Status, string> = {
  Scheduled: 'ti ti-clock',
  Draft: 'ti ti-pencil',
  Paused: 'ti ti-player-pause',
  Completed: 'ti ti-checks',
  Cancelled: 'ti ti-ban',
};

export const cadenceIcon: Record<Cadence, string> = {
  'One-off': 'ti ti-calendar-event',
  Immediate: 'ti ti-bolt',
  Daily: 'ti ti-repeat',
  Weekly: 'ti ti-repeat',
  Monthly: 'ti ti-repeat',
  Yearly: 'ti ti-repeat',
};

export const cadenceTone: Record<Cadence, string> = {
  'One-off': 'recurrence is-once',
  Immediate: 'recurrence is-now',
  Daily: 'recurrence is-series',
  Weekly: 'recurrence is-series',
  Monthly: 'recurrence is-series',
  Yearly: 'recurrence is-series',
};

export const channelIcon: Record<Channel, string> = {
  Email: 'ti ti-mail',
  SMS: 'ti ti-message-2',
  WhatsApp: 'ti ti-brand-whatsapp',
  'Push Notification': 'ti ti-bell',
  'In-App': 'ti ti-app-window',
  'Website Banner': 'ti ti-layout-navbar',
  'Digital Notice Board': 'ti ti-device-tv',
};

/* ------------------------------ Filter options ------------------------------ */

export const typeOptions = [
  'Announcement', 'Email', 'SMS', 'WhatsApp',
  'Push notification', 'In-app broadcast', 'Notice board',
];

export const channelOptions: Channel[] = [
  'Email', 'SMS', 'WhatsApp', 'Push Notification',
  'In-App', 'Website Banner', 'Digital Notice Board',
];

export const audienceOptions = [
  'All Students', 'Parents', 'Teachers', 'Staff', 'Departments',
  'Classes', 'Sections', 'Transport Users', 'Hostel Students', 'Library Members',
];

export const statusOptions: Status[] = ['Scheduled', 'Draft', 'Paused', 'Completed', 'Cancelled'];

export const deliveryOptions: Delivery[] = [
  'Queued', 'Sending', 'Delivered', 'Partially delivered', 'Failed', 'Not started',
];

export const approvalOptions = [
  'Pending approval', 'Approved', 'Rejected', 'Requires review',
];

export const recurrenceOptions = ['One-off', 'Daily', 'Weekly', 'Monthly', 'Term-based'];

/* --------------------------- Dialog option lists ----------------------------- */

export const timeZoneOptions = ['IST (UTC +5:30)', 'GST (UTC +4:00)', 'UTC'];

export const templateNames = [
  'Holiday Announcement', 'Fee Reminder', 'Exam Notification', 'PTA Meeting',
  'Admission Notice', 'Emergency Alert', 'Sports Event', 'Newsletter', 'Birthday Wishes',
];

export const frequencyOptions = ['Daily', 'Weekly', 'Monthly', 'Yearly', 'Term-based'];

export const repeatEveryOptions = ['1 week', '2 weeks', '3 weeks', '4 weeks'];

export const weekdayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const cancelScopeOptions = ['This occurrence only', 'This and all future occurrences'];

/* ------------------------------- Derivations -------------------------------- */

export const REGISTER_DATE = '2 Aug 2026';

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

export const shiftDate = (value: string, days: number): string => {
  const [day, month, year] = value.split(' ');
  const index = months.indexOf(month);
  if (index === -1) return value;
  const moved = new Date(Date.UTC(Number(year), index, Number(day) + days));
  return `${moved.getUTCDate()} ${months[moved.getUTCMonth()]} ${moved.getUTCFullYear()}`;
};

export const dayText = (days: number): string =>
  `${Math.abs(days)} ${Math.abs(days) === 1 ? 'day' : 'days'}`;

/** "05 Aug" — the way the clock block and the facts abbreviate a date. */
export const shortDate = (value: string): string =>
  value ? value.split(' ').slice(0, 2).join(' ') : '';

/** Two digits, as the clock block prints the day. */
export const clockDay = (value: string): string =>
  value ? String(value.split(' ')[0]).padStart(2, '0') : '—';

const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const weekdayOf = (value: string): string => {
  const [day, month, year] = value.split(' ');
  const index = months.indexOf(month);
  if (index === -1) return '';
  return weekdays[new Date(Date.UTC(Number(year), index, Number(day))).getUTCDay()];
};

/** The next occurrence of a weekly series, counted from the register date. */
export const nextRunOf = (row: Broadcast): string => {
  if (row.cadence !== 'Weekly') return row.sendDate;
  const target = weekdays.indexOf(weekdayOf(row.sendDate));
  const today = weekdays.indexOf(weekdayOf(REGISTER_DATE));
  if (target === -1 || today === -1) return row.sendDate;
  const ahead = (target - today + 7) % 7 || 7;
  return shiftDate(REGISTER_DATE, ahead);
};

/** Days from the register date to the departure; negative once it has gone. */
export const daysToDepartureOf = (row: Broadcast): number =>
  daysBetween(REGISTER_DATE, row.sendDate);

/* ------------------------------- The card ---------------------------------- */

export interface Clock {
  big: string;
  small: string;
}

/** The block at the top left: a date, a cadence, or nothing at all. */
export const clockOf = (row: Broadcast): Clock => {
  if (row.status === 'Paused') return { big: '—', small: 'Paused' };
  if (row.cadence === 'Weekly') return { big: weekdayOf(row.sendDate), small: 'Weekly' };
  if (row.status === 'Cancelled') return { big: clockDay(row.heldSince), small: 'Cancelled' };
  return { big: clockDay(row.sendDate), small: row.sendDate.split(' ')[1] };
};

/** The two lines beside it. */
export const departureTimeOf = (row: Broadcast): string => {
  if (row.status === 'Paused') return `Was ${row.cadenceLabel.replace('Monthly · ', '')} monthly`;
  if (row.status === 'Cancelled') return 'Cancelled';
  return row.sendTime;
};

export const departureLabelOf = (row: Broadcast): string => {
  if (row.status === 'Paused') return `Held since ${shortDate(row.heldSince)} · by ${row.heldBy}`;
  if (row.status === 'Draft') return 'Not scheduled · draft only';
  if (row.status === 'Cancelled') {
    return `Was ${shortDate(row.sendDate)}, ${row.sendTime} · by ${row.heldBy}`;
  }
  if (row.status === 'Completed') {
    const ago = -daysToDepartureOf(row);
    return `Sent ${ago === 0 ? 'today' : `${dayText(ago)} ago`} · ${row.cadence === 'Immediate' ? 'immediate' : 'scheduled'}`;
  }
  if (row.cadence === 'Weekly') return `${row.timeZone} · next ${shortDate(nextRunOf(row))}`;
  const days = daysToDepartureOf(row);
  const when = days === 0 ? 'today' : days === 1 ? 'tomorrow' : `in ${dayText(days)}`;
  return `${row.timeZone} · ${when}`;
};

export interface Fact {
  icon: string;
  label: string;
  strong: string;
  tail: string;
}

/** The card's second fact, which the status decides. */
export const secondFactOf = (row: Broadcast): Fact => {
  if (row.status === 'Completed' && row.delivered > 0) {
    return {
      icon: 'ti ti-checks', label: 'Delivered ',
      strong: row.delivered.toLocaleString(), tail: '',
    };
  }
  if (row.sentTimes > 0) {
    return { icon: 'ti ti-history', label: 'Sent ', strong: String(row.sentTimes), tail: ' times' };
  }
  if (row.expires) {
    return { icon: 'ti ti-calendar-off', label: 'Expires ', strong: shortDate(row.expires), tail: '' };
  }
  const count = row.attachments.length;
  if (count === 0) {
    return { icon: 'ti ti-paperclip', label: 'No attachments', strong: '', tail: '' };
  }
  return {
    icon: 'ti ti-paperclip', label: '', strong: String(count),
    tail: ` attachment${count === 1 ? '' : 's'}`,
  };
};

export const recurrenceLabelOf = (row: Broadcast): string =>
  row.cadenceLabel || row.cadence;

/** The chip that follows the recurrence: an approval, or the status itself. */
export const stateChipOf = (row: Broadcast): { badge: string; icon: string; label: string } => {
  if (row.status === 'Draft' || row.status === 'Paused' || row.status === 'Cancelled') {
    return {
      badge: statusChipBadge[row.status],
      icon: statusChipIcon[row.status],
      label: row.status,
    };
  }
  return {
    badge: approvalBadge[row.approval],
    icon: approvalIcon[row.approval],
    label: row.approval,
  };
};

/** One credit per SMS recipient; nothing when SMS is not selected. */
export const creditsOf = (row: Broadcast): number =>
  (row.channels.includes('SMS') ? row.audienceCount : 0);

export interface CardAction {
  id: 'view' | 'edit' | 'recurrence' | 'duplicate' | 'schedule' | 'resume' | 'pause' | 'cancel';
  icon: string;
  label: string;
}

/**
 * The buttons the card offers. The template varies these per card — Resume on
 * the paused series, Schedule on the draft, Recreate on the cancelled one —
 * and every variation follows from the status.
 */
export const actionsOf = (row: Broadcast): CardAction[] => {
  const view: CardAction = { id: 'view', icon: 'ti ti-eye', label: 'View' };
  if (row.status === 'Paused') {
    return [view, { id: 'resume', icon: 'ti ti-player-play', label: 'Resume' }];
  }
  if (row.status === 'Draft') {
    return [view, { id: 'schedule', icon: 'ti ti-clock-play', label: 'Schedule' }];
  }
  if (row.status === 'Completed') {
    return [view, { id: 'duplicate', icon: 'ti ti-copy', label: 'Duplicate' }];
  }
  if (row.status === 'Cancelled') {
    return [view, { id: 'duplicate', icon: 'ti ti-copy', label: 'Recreate' }];
  }
  if (row.cadence !== 'One-off' && row.cadence !== 'Immediate') {
    return [
      view,
      { id: 'recurrence', icon: 'ti ti-repeat', label: 'Configure recurrence' },
      { id: 'edit', icon: 'ti ti-edit', label: 'Edit' },
      { id: 'pause', icon: 'ti ti-player-pause', label: 'Pause series' },
      { id: 'cancel', icon: 'ti ti-ban', label: 'Cancel series' },
    ];
  }
  return [
    view,
    { id: 'edit', icon: 'ti ti-edit', label: 'Edit' },
    { id: 'duplicate', icon: 'ti ti-copy', label: 'Duplicate' },
    { id: 'pause', icon: 'ti ti-player-pause', label: 'Pause' },
    { id: 'cancel', icon: 'ti ti-ban', label: 'Cancel' },
  ];
};

/* --------------------------------- Reader ----------------------------------- */

export interface Pair {
  label: string;
  value: string;
}

export const detailPairsOf = (row: Broadcast): Pair[] => [
  { label: 'Broadcast type', value: row.category },
  { label: 'Created', value: `${row.createdOn}` },
  { label: 'Created by', value: row.createdBy },
  { label: 'Delivery status', value: row.delivery },
  {
    label: 'Estimated credits',
    value: creditsOf(row) > 0 ? `${creditsOf(row).toLocaleString()} SMS` : 'No SMS on this broadcast',
  },
];

export const schedulePairsOf = (row: Broadcast): Pair[] => [
  { label: 'Send date', value: row.status === 'Draft' ? 'Not set' : row.sendDate },
  { label: 'Send time', value: row.sendTime },
  { label: 'Time zone', value: row.timeZone || 'Not set' },
  { label: 'Auto expiry', value: row.expires || 'Per broadcast' },
  {
    label: row.status === 'Completed' ? 'Departed' : 'Departs',
    value: row.status === 'Draft' ? 'Not scheduled'
      : row.status === 'Completed' ? `${dayText(-daysToDepartureOf(row))} ago`
        : `in ${dayText(daysToDepartureOf(row))}`,
  },
];

/* --------------------------------- Filters ---------------------------------- */

export const searchIndexOf = (row: Broadcast): string =>
  [
    row.id, row.title, row.description, row.category, row.audienceLabel,
    row.createdBy, row.status, row.approval, row.delivery, recurrenceLabelOf(row),
  ]
    .join(' ')
    .toLowerCase();

/* --------------------------------- Summary ---------------------------------- */

/**
 * The rail counts the whole term — 26 broadcasts against the eight this page
 * lists — so the template's figures stand and the register moves them.
 */
export const QUICK_TOTALS = {
  scheduled: 9,
  recurring: 5,
  awaiting: 4,
  paused: 2,
  drafts: 3,
  cancelled: 1,
};

export const TOTAL_COUNT = 26;

/** The template's committed chip is the window it opens on. */
export const PERIOD = '02 Aug 2026 - 30 Sep 2026';

/* ---------------------------------- Rows ------------------------------------ */

export const broadcasts: Broadcast[] = [
  {
    id: 'BSC-2026-0051',
    category: 'Fee Reminder',
    title: 'Final reminder — second term fee closes in five days',
    description: 'Goes only to families with an outstanding balance on the morning of the fifth. Sponsors and concession holders are excluded automatically.',
    readerLead: 'Fees · Parents with an outstanding balance',
    readerTitle: 'Second term fee closes on 10 August',
    body: [
      {
        heading: '',
        paragraphs: [
          "This is the final reminder for the second term fee. Our records show an outstanding balance against your ward's account as of this morning. If payment has been made in the last twenty-four hours, please disregard this message.",
        ],
        bullets: [],
      },
      {
        heading: 'How to pay',
        paragraphs: [],
        bullets: [
          'Online through the parent portal, by card, net banking or UPI — receipts are issued immediately.',
          'At the accounts counter, 9:00 am to 2:00 pm on working days.',
          'By cheque, drawn in favour of the school and submitted at the front office.',
        ],
      },
      {
        heading: 'After the due date',
        paragraphs: [
          'A late fee applies from 11 August. Families holding an approved concession or scholarship are excluded from this reminder and from the late fee.',
          'For a payment plan, please write to the accounts office before the due date rather than after it.',
        ],
        bullets: [],
      },
    ],
    status: 'Scheduled', approval: 'Awaiting approval', delivery: 'Not started',
    sendDate: '5 Aug 2026', sendTime: '07:30 am', timeZone: 'IST (UTC +5:30)',
    expires: '11 Aug 2026',
    cadence: 'One-off', cadenceLabel: '', sentTimes: 0, delivered: 0,
    audienceLabel: 'Parents with dues', audienceCount: 318,
    audienceRows: [
      { label: 'Parents with dues', note: 'Read at send time, not now', value: '318' },
      { label: 'Concession holders', note: 'Excluded', value: '−74' },
      { label: 'Unreachable', note: 'No email or mobile on record', value: '6' },
    ],
    channels: ['Email', 'SMS', 'WhatsApp', 'In-App'],
    channelStates: [
      { channel: 'Email', note: 'Primary guardian address', state: 'Queued' },
      { channel: 'SMS', note: '318 credits reserved', state: 'Queued' },
      { channel: 'WhatsApp', note: 'Template awaiting review', state: 'Blocked' },
      { channel: 'In-App', note: 'Portal inbox', state: 'Queued' },
    ],
    attachments: [{ name: 'Term-2 fee structure 2026.pdf', meta: 'PDF · 286 KB' }],
    createdBy: 'Ms. Latha Rao', createdOn: '28 Jul 2026, 04:12 pm',
    heldSince: '', heldBy: '',
    approvalTrail: [
      {
        who: 'Ms. Latha Rao', state: 'Submitted', at: '28 Jul, 04:12 pm',
        note: 'Submitted for approval with the same wording as last term, dates updated. SMS is included because the June reminder reached only 61% by email alone.',
      },
      {
        who: 'Ms. Divya Nair', state: 'Accounts cleared', at: '29 Jul, 10:05 am',
        note: 'Balance list verified against the ledger this morning. 318 families, concession holders excluded. Cleared from the accounts side.',
      },
      {
        who: 'Principal', state: 'Pending', at: 'Due by 05 Aug, 07:00 am',
        note: 'Not yet reviewed. If this is not approved half an hour before the send time, the broadcast is held rather than sent late.',
      },
    ],
  },
  {
    id: 'BSC-2026-0048',
    category: 'PTA Meeting',
    title: 'Reminder — parent–teacher meeting is tomorrow',
    description: "Sent the afternoon before, with each parent's booked slot merged into the message body from the portal.",
    readerLead: 'Academic · Parents of Grades 6 to 10',
    readerTitle: 'Parent–teacher meeting tomorrow, 9:00 am to 1:00 pm',
    body: [
      {
        heading: '',
        paragraphs: [
          'Your parent–teacher meeting slot is tomorrow. Slots run twenty minutes with the class teacher, and subject teachers are available in the hall throughout the morning.',
        ],
        bullets: [],
      },
      {
        heading: 'Before you come',
        paragraphs: [],
        bullets: [
          'Your booked slot is shown at the top of this message, merged from the portal.',
          'Bring the term report, which was issued on 24 July.',
          'Unbooked slots are released to walk-ins after 11:00 am.',
        ],
      },
    ],
    status: 'Scheduled', approval: 'Approved', delivery: 'Queued',
    sendDate: '8 Aug 2026', sendTime: '04:00 pm', timeZone: 'IST (UTC +5:30)',
    expires: '',
    cadence: 'One-off', cadenceLabel: '', sentTimes: 0, delivered: 0,
    audienceLabel: 'Parents, Grades 6–10', audienceCount: 720,
    audienceRows: [
      { label: 'Parents, Grades 6–10', note: 'Read at send time, not now', value: '720' },
      { label: 'Slots booked', note: 'Merged into the message body', value: '612' },
    ],
    channels: ['In-App', 'Push Notification', 'WhatsApp'],
    channelStates: [
      { channel: 'In-App', note: 'Portal inbox', state: 'Queued' },
      { channel: 'Push Notification', note: 'Opted-in devices', state: 'Queued' },
      { channel: 'WhatsApp', note: 'Slot merge template', state: 'Queued' },
    ],
    attachments: [],
    createdBy: 'Ms. Divya Nair', createdOn: '26 Jul 2026, 11:40 am',
    heldSince: '', heldBy: '',
    approvalTrail: [
      {
        who: 'Ms. Divya Nair', state: 'Submitted', at: '26 Jul, 11:40 am',
        note: 'Same reminder as last term with the slot merge field added.',
      },
      {
        who: 'Vice Principal', state: 'Approved', at: '28 Jul, 09:15 am',
        note: 'Approved. No SMS needed — the app reached 94% of this group in July.',
      },
    ],
  },
  {
    id: 'BSC-2026-0044',
    category: 'Holiday Announcement',
    title: 'Independence Day — flag hoisting at 8:00 am',
    description: 'Goes to everyone at once, three days ahead, with the bus timing change carried in the same message.',
    readerLead: 'Holiday · Entire school',
    readerTitle: 'Independence Day — flag hoisting at 8:00 am',
    body: [
      {
        heading: '',
        paragraphs: [
          'The school will observe Independence Day on Friday, 15 August. Flag hoisting begins promptly at 8:00 am on the main ground, followed by the house march past and a short cultural programme.',
        ],
        bullets: [],
      },
      {
        heading: 'Who should attend',
        paragraphs: [],
        bullets: [
          'House captains, the band and the NCC contingent are expected in full uniform by 7:30 am.',
          'Attendance is optional for all other students; parents are welcome.',
          'Buses run a single morning trip at 7:00 am and a return trip at 10:30 am.',
        ],
      },
    ],
    status: 'Scheduled', approval: 'Approved', delivery: 'Queued',
    sendDate: '12 Aug 2026', sendTime: '08:00 am', timeZone: 'IST (UTC +5:30)',
    expires: '16 Aug 2026',
    cadence: 'Yearly', cadenceLabel: 'Yearly · 15 Aug', sentTimes: 0, delivered: 0,
    audienceLabel: 'Entire school', audienceCount: 2940,
    audienceRows: [
      { label: 'Entire school', note: 'Deduplicated across groups', value: '2,940' },
    ],
    channels: ['In-App', 'Email', 'Push Notification', 'Digital Notice Board'],
    channelStates: [
      { channel: 'In-App', note: 'Portal inbox', state: 'Queued' },
      { channel: 'Email', note: 'All groups', state: 'Queued' },
      { channel: 'Push Notification', note: 'Opted-in devices', state: 'Queued' },
      { channel: 'Digital Notice Board', note: '14 screens', state: 'Queued' },
    ],
    attachments: [],
    createdBy: 'Ms. Latha Rao', createdOn: '24 Jul 2026, 03:20 pm',
    heldSince: '', heldBy: '',
    approvalTrail: [
      {
        who: 'Ms. Latha Rao', state: 'Submitted', at: '24 Jul, 03:20 pm',
        note: 'Yearly series, dates rolled forward from 2025.',
      },
      {
        who: 'Principal', state: 'Approved', at: '30 Jul, 10:00 am',
        note: 'Approved for the series, not just this occurrence.',
      },
    ],
  },
  {
    id: 'BSC-2026-0031',
    category: 'Newsletter',
    title: 'Week ahead — timetable changes and events digest',
    description: 'Assembled from the calendar every Monday morning. Skips weeks with no entries rather than sending an empty digest.',
    readerLead: 'Newsletter · Entire school',
    readerTitle: 'The week ahead',
    body: [
      {
        heading: '',
        paragraphs: [
          'This digest is assembled from the school calendar every Monday morning and covers the week to come: timetable changes, events, deadlines and the games schedule.',
        ],
        bullets: [],
      },
      {
        heading: 'How it is built',
        paragraphs: [],
        bullets: [
          'Entries come from the academic calendar and the events board.',
          'A week with no entries is skipped rather than sent empty.',
          'Departments can add an item until 6:00 am on the Monday.',
        ],
      },
    ],
    status: 'Scheduled', approval: 'Approved', delivery: 'Delivered',
    sendDate: '3 Aug 2026', sendTime: '06:45 am', timeZone: 'IST (UTC +5:30)',
    expires: '',
    cadence: 'Weekly', cadenceLabel: 'Every Monday', sentTimes: 31, delivered: 0,
    audienceLabel: 'Entire school', audienceCount: 2940,
    audienceRows: [
      { label: 'Entire school', note: 'Deduplicated across groups', value: '2,940' },
    ],
    channels: ['Email', 'In-App', 'SMS'],
    channelStates: [
      { channel: 'Email', note: 'All groups', state: 'Queued' },
      { channel: 'In-App', note: 'Portal inbox', state: 'Queued' },
      { channel: 'SMS', note: 'Headlines only', state: 'Queued' },
    ],
    attachments: [],
    createdBy: 'Ms. Divya Nair', createdOn: '06 Jan 2026, 09:00 am',
    heldSince: '', heldBy: '',
    approvalTrail: [
      {
        who: 'Ms. Divya Nair', state: 'Submitted', at: '06 Jan, 09:00 am',
        note: 'Series approved once for the year; occurrences do not need individual sign-off.',
      },
      {
        who: 'Principal', state: 'Approved', at: '07 Jan, 11:20 am',
        note: 'Approved for the academic year.',
      },
    ],
  },
  {
    id: 'BSC-2026-0027',
    category: 'Library',
    title: 'Overdue book reminder for library members',
    description: 'Paused while the catalogue migration runs — the overdue list is unreliable until it finishes on the eighth.',
    readerLead: 'Library · Members with an overdue title',
    readerTitle: 'Overdue books — please return this week',
    body: [
      {
        heading: '',
        paragraphs: [
          'Our records show one or more overdue titles against your borrowing card. Please return them to the senior library this week.',
        ],
        bullets: [],
      },
    ],
    status: 'Paused', approval: 'Requires review', delivery: 'Not started',
    sendDate: '25 Aug 2026', sendTime: '09:00 am', timeZone: 'IST (UTC +5:30)',
    expires: '',
    cadence: 'Monthly', cadenceLabel: 'Monthly · 25th', sentTimes: 11, delivered: 0,
    audienceLabel: 'Library members', audienceCount: 1410,
    audienceRows: [
      { label: 'Library members', note: 'Active borrowing card', value: '1,410' },
      { label: 'With an overdue title', note: 'Read at send time', value: '63' },
    ],
    channels: ['Email', 'In-App'],
    channelStates: [
      { channel: 'Email', note: 'Member address', state: 'Held' },
      { channel: 'In-App', note: 'Portal inbox', state: 'Held' },
    ],
    attachments: [],
    createdBy: 'Mr. Suresh Babu', createdOn: '25 Jun 2026, 08:30 am',
    heldSince: '25 Jul 2026', heldBy: 'Ms. Divya Nair',
    approvalTrail: [
      {
        who: 'Mr. Suresh Babu', state: 'Submitted', at: '25 Jun, 08:30 am',
        note: 'Monthly series against the overdue list.',
      },
      {
        who: 'Ms. Divya Nair', state: 'Paused', at: '25 Jul, 02:00 pm',
        note: 'Held while the catalogue migration runs. The overdue list is unreliable until it finishes on the eighth.',
      },
    ],
  },
  {
    id: 'BSC-2026-0055',
    category: 'Admission Notice',
    title: 'Admissions open for the 2027 – 2028 session',
    description: 'Held back until the fee annexure is signed. The website banner goes up the same morning the broadcast leaves.',
    readerLead: 'Admissions · Website, Parents',
    readerTitle: 'Admissions open for the 2027 – 2028 session',
    body: [
      {
        heading: '',
        paragraphs: [
          'Applications for Nursery through Grade 9 open on 1 September and close on 15 October. Forms are submitted through the school website; no paper application is accepted this year.',
        ],
        bullets: [],
      },
      {
        heading: 'What you will need',
        paragraphs: [],
        bullets: [
          'Birth certificate and two recent photographs of the applicant.',
          "The last two years' report cards, for Grade 1 and above.",
          'A transfer certificate from the previous school, at the time of admission rather than application.',
          'Sibling and staff-ward priority applies as set out in the admission policy, which is attached.',
        ],
      },
    ],
    status: 'Draft', approval: 'Requires review', delivery: 'Not started',
    sendDate: '1 Sep 2026', sendTime: '09:00 am', timeZone: '',
    expires: '',
    cadence: 'One-off', cadenceLabel: '', sentTimes: 0, delivered: 0,
    audienceLabel: 'Website, Parents', audienceCount: 1240,
    audienceRows: [
      { label: 'Parents', note: 'Primary guardian per student', value: '1,240' },
      { label: 'Website banner', note: 'Public site', value: 'Above the fold' },
    ],
    channels: ['Email', 'In-App', 'Website Banner'],
    channelStates: [
      { channel: 'Email', note: 'Not scheduled', state: 'Not started' },
      { channel: 'In-App', note: 'Not scheduled', state: 'Not started' },
      { channel: 'Website Banner', note: 'Goes up on the send morning', state: 'Not started' },
    ],
    attachments: [
      { name: 'Prospectus draft.pdf', meta: 'PDF · 1.2 MB' },
      { name: 'Fee annexure draft.pdf', meta: 'PDF · 96 KB' },
    ],
    createdBy: 'Ms. Latha Rao', createdOn: '01 Aug 2026, 04:05 pm',
    heldSince: '', heldBy: '',
    approvalTrail: [
      {
        who: 'Ms. Latha Rao', state: 'Drafted', at: '01 Aug, 04:05 pm',
        note: 'Held until the fee annexure is signed by the principal.',
      },
    ],
  },
  {
    id: 'BSC-2026-0042',
    category: 'Emergency Alert',
    title: 'School closed Thursday due to heavy rainfall',
    description: 'Sent immediately on the district advisory, bypassing the approval queue under the emergency rule.',
    readerLead: 'Emergency · Entire school',
    readerTitle: 'School closed Thursday due to heavy rainfall',
    body: [
      {
        heading: '',
        paragraphs: [
          "Following the district administration's advisory, the school will remain closed on Thursday, 30 July 2026. The decision applies to all sections and to the hostel day programme.",
        ],
        bullets: [],
      },
      {
        heading: 'What this means',
        paragraphs: [],
        bullets: [
          'No school buses will run on any route.',
          'The hostel mess operates on a holiday schedule; boarders remain on campus.',
          'The Grade 9 unit test moves to Monday, 3 August, same period.',
        ],
      },
    ],
    status: 'Completed', approval: 'Auto-approved', delivery: 'Delivered',
    sendDate: '29 Jul 2026', sendTime: '06:12 pm', timeZone: 'IST (UTC +5:30)',
    expires: '',
    cadence: 'Immediate', cadenceLabel: 'Immediate', sentTimes: 0, delivered: 2918,
    audienceLabel: 'Entire school', audienceCount: 2940,
    audienceRows: [
      { label: 'Entire school', note: 'Deduplicated across groups', value: '2,940' },
      { label: 'Delivered', note: 'Across four channels', value: '2,918' },
    ],
    channels: ['In-App', 'Email', 'SMS', 'Push Notification'],
    channelStates: [
      { channel: 'In-App', note: 'Delivered 06:12 pm', state: 'Delivered' },
      { channel: 'Email', note: 'Delivered 06:12 pm', state: 'Delivered' },
      { channel: 'SMS', note: 'Delivered 06:14 pm', state: 'Delivered' },
      { channel: 'Push Notification', note: 'Delivered 06:12 pm', state: 'Delivered' },
    ],
    attachments: [{ name: 'District advisory 29-07-2026.pdf', meta: 'PDF · 412 KB' }],
    createdBy: 'Ms. Latha Rao', createdOn: '29 Jul 2026, 06:10 pm',
    heldSince: '', heldBy: '',
    approvalTrail: [
      {
        who: 'Ms. Latha Rao', state: 'Sent immediately', at: '29 Jul, 06:12 pm',
        note: 'Emergency rule applied — the approval queue is bypassed for a district advisory.',
      },
    ],
  },
  {
    id: 'BSC-2026-0039',
    category: 'Sports Event',
    title: 'Inter-house athletics trials on the main ground',
    description: 'Cancelled with the closure. A replacement broadcast will be drafted once the trials are re-dated for September.',
    readerLead: 'Sports · Students and teachers',
    readerTitle: 'Inter-house athletics trials',
    body: [
      {
        heading: '',
        paragraphs: [
          'Trials for the inter-house athletics team were to be held on the main ground. They are cancelled with the weather closure and will be re-dated for September.',
        ],
        bullets: [],
      },
    ],
    status: 'Cancelled', approval: 'Rejected', delivery: 'Never sent',
    sendDate: '30 Jul 2026', sendTime: '09:00 am', timeZone: 'IST (UTC +5:30)',
    expires: '',
    cadence: 'One-off', cadenceLabel: '', sentTimes: 0, delivered: 0,
    audienceLabel: 'Students, Teachers', audienceCount: 1470,
    audienceRows: [
      { label: 'Students, Teachers', note: 'Across all sections', value: '1,470' },
    ],
    channels: ['In-App', 'Email'],
    channelStates: [
      { channel: 'In-App', note: 'Cancelled before departure', state: 'Never sent' },
      { channel: 'Email', note: 'Cancelled before departure', state: 'Never sent' },
    ],
    attachments: [{ name: 'Trials event list.pdf', meta: 'PDF · 64 KB' }],
    createdBy: 'Mr. Arun Prakash', createdOn: '22 Jul 2026, 10:15 am',
    heldSince: '28 Jul 2026', heldBy: 'the principal',
    approvalTrail: [
      {
        who: 'Mr. Arun Prakash', state: 'Submitted', at: '22 Jul, 10:15 am',
        note: 'Trials scheduled for the 30th on the main ground.',
      },
      {
        who: 'Principal', state: 'Cancelled', at: '28 Jul, 05:00 pm',
        note: 'Cancelled with the closure. A replacement will be drafted once the trials are re-dated.',
      },
    ],
  },
];
