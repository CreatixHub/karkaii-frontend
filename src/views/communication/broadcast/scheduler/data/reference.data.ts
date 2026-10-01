import type { Channel } from './broadcasts.data';

export interface ChannelCard {
  channel: Channel;
  note: string;
  state: string;
  stateTone: string;
  jobs: number;
  queue: string;
  health: string;
  healthTone: string;
  lastRun: string;
}

export const channelCards: ChannelCard[] = [
  {
    channel: 'Email', note: 'SMTP · mail.school.edu',
    state: 'Active', stateTone: 'is-live', jobs: 7,
    queue: '412 in flight, draining', health: 'Healthy', healthTone: 'is-live',
    lastRun: '29 Jul, 06:12 pm',
  },
  {
    channel: 'SMS', note: 'Reserved for urgent broadcasts',
    state: 'Active', stateTone: 'is-live', jobs: 2,
    queue: 'Empty · 8,540 credits left', health: 'Idle', healthTone: '',
    lastRun: '29 Jul, 06:14 pm',
  },
  {
    channel: 'WhatsApp', note: 'Business API · template messages',
    state: 'Template review', stateTone: 'is-high', jobs: 3,
    queue: '2 jobs held pending approval', health: 'Blocked', healthTone: 'is-urgent',
    lastRun: '26 Jul, 09:30 am',
  },
  {
    channel: 'Push Notification', note: 'Mobile app, opted-in devices',
    state: 'Active', stateTone: 'is-live', jobs: 5,
    queue: '2,104 registered devices', health: 'Healthy', healthTone: 'is-live',
    lastRun: '29 Jul, 06:12 pm',
  },
  {
    channel: 'In-App', note: 'Portal and app inbox',
    state: 'Active', stateTone: 'is-live', jobs: 9,
    queue: 'Writes instantly, never backs up', health: 'Idle', healthTone: '',
    lastRun: '29 Jul, 06:12 pm',
  },
  {
    channel: 'Website Banner', note: 'Public site, above the fold',
    state: 'Paused', stateTone: 'is-draft', jobs: 1,
    queue: 'Resumes with the admission notice', health: 'Held', healthTone: 'is-draft',
    lastRun: '21 Jul, 11:05 am',
  },
  {
    channel: 'Digital Notice Board', note: '14 screens across four blocks',
    state: 'Active', stateTone: 'is-live', jobs: 4,
    queue: '2 screens offline in the annexe', health: 'Degraded', healthTone: 'is-high',
    lastRun: '28 Jul, 07:00 am',
  },
];

export interface AudienceCard {
  icon: string;
  name: string;
  note: string;
  count: string;
  unit: string;
  status: string;
  statusTone: string;
  last: string;
}

export const audienceCards: AudienceCard[] = [
  {
    icon: 'ti ti-school', name: 'All Students', note: 'Nursery to Grade 12, enrolled',
    count: '1,286', unit: 'recipients', status: '3 queued', statusTone: 'is-live',
    last: 'Week ahead digest, 28 Jul',
  },
  {
    icon: 'ti ti-users', name: 'Parents', note: 'Primary guardian per student',
    count: '1,240', unit: 'recipients', status: '4 queued', statusTone: 'is-live',
    last: 'Rainfall closure, 29 Jul',
  },
  {
    icon: 'ti ti-chalkboard', name: 'Teachers', note: 'Teaching faculty, all departments',
    count: '184', unit: 'recipients', status: '2 queued', statusTone: 'is-live',
    last: 'Week ahead digest, 28 Jul',
  },
  {
    icon: 'ti ti-id-badge-2', name: 'Staff', note: 'Administration and support',
    count: '96', unit: 'recipients', status: 'None queued', statusTone: '',
    last: 'Rainfall closure, 29 Jul',
  },
  {
    icon: 'ti ti-sitemap', name: 'Departments', note: '12 groups, addressable singly',
    count: '268', unit: 'across 12 groups', status: '1 queued', statusTone: 'is-live',
    last: 'Lab safety refresher, 17 Jul',
  },
  {
    icon: 'ti ti-users-group', name: 'Classes', note: 'Grade-level, all sections at once',
    count: '14', unit: 'classes', status: '2 queued', statusTone: 'is-live',
    last: 'PTM slots, Grades 6–10, 18 Jul',
  },
  {
    icon: 'ti ti-layout-rows', name: 'Sections', note: 'A single section, or a set of them',
    count: '42', unit: 'sections', status: 'None queued', statusTone: '',
    last: 'Grade 9 test reschedule, 30 Jul',
  },
  {
    icon: 'ti ti-bus', name: 'Transport Users', note: 'Families on a bus route',
    count: '612', unit: 'recipients', status: '1 queued', statusTone: 'is-live',
    last: 'Route 7 timing change, 22 Jul',
  },
  {
    icon: 'ti ti-building-community', name: 'Hostel Students', note: 'Boarders and their local guardians',
    count: '284', unit: 'recipients', status: 'None queued', statusTone: '',
    last: 'Mess menu change, 20 Jul',
  },
  {
    icon: 'ti ti-books', name: 'Library Members', note: 'Anyone with an active borrowing card',
    count: '1,410', unit: 'recipients', status: '1 paused', statusTone: 'is-draft',
    last: 'Overdue reminder, 25 Jun',
  },
];

export interface ScheduleState {
  icon: string;
  name: string;
  count: number;
  schedule: string;
  tag: string;
  frequency: string;
  timeZone: string;
  expiry: string;
}

export const scheduleStates: ScheduleState[] = [
  {
    icon: 'ti ti-bolt', name: 'Immediate Delivery', count: 2,
    schedule: 'Leaves the moment it is approved', tag: 'Now',
    frequency: 'One-off', timeZone: "Sender's", expiry: '48 hours',
  },
  {
    icon: 'ti ti-clock', name: 'Scheduled Delivery', count: 9,
    schedule: 'Next departure 03 Aug, 06:45 am', tag: 'Dated',
    frequency: 'One-off', timeZone: 'IST +5:30', expiry: 'Per broadcast',
  },
  {
    icon: 'ti ti-repeat', name: 'Recurring Broadcast', count: 5,
    schedule: 'Weekly, monthly and yearly series', tag: 'Series',
    frequency: 'Mon · 25th · 15 Aug', timeZone: 'IST +5:30', expiry: 'End of term',
  },
  {
    icon: 'ti ti-pencil', name: 'Draft', count: 3,
    schedule: 'No departure set yet', tag: '—',
    frequency: 'Not set', timeZone: 'Not set', expiry: 'Discard after 90 days',
  },
  {
    icon: 'ti ti-player-pause', name: 'Paused', count: 2,
    schedule: 'Held; occurrences are skipped, not queued', tag: 'Held',
    frequency: 'Preserved', timeZone: 'IST +5:30', expiry: 'Unaffected',
  },
  {
    icon: 'ti ti-checks', name: 'Completed', count: 104,
    schedule: 'Delivered, nothing further queued', tag: 'Done',
    frequency: 'Closed', timeZone: 'As sent', expiry: 'Archive after 1 year',
  },
  {
    icon: 'ti ti-ban', name: 'Cancelled', count: 1,
    schedule: 'Stopped before departure; never sent', tag: 'Void',
    frequency: 'Cleared', timeZone: '—', expiry: 'Kept for audit',
  },
];

export interface BroadcastTemplate {
  preview: string;
  lines: number[];
  category: string;
  name: string;
  note: string;
  channels: Channel[];
  audience: string;
}

export const broadcastTemplates: BroadcastTemplate[] = [
  {
    preview: 'School will remain closed on…', lines: [92, 72, 84],
    category: 'Holiday Announcement', name: 'Holiday Announcement',
    note: 'Closure date, reason, and what happens to buses, the mess and scheduled tests.',
    channels: ['In-App', 'Email', 'Push Notification', 'Digital Notice Board'],
    audience: 'Entire school',
  },
  {
    preview: 'Fee for the term is due by…', lines: [76, 88, 52],
    category: 'Fee Reminder', name: 'Fee Reminder',
    note: 'Amount, due date, payment routes and the late fee that follows. Skips paid families.',
    channels: ['Email', 'SMS', 'WhatsApp'],
    audience: 'Parents with dues',
  },
  {
    preview: 'Term examinations begin on…', lines: [84, 96, 60],
    category: 'Exam Notification', name: 'Exam Notification',
    note: 'Datesheet, hall ticket instructions, reporting time and prohibited items.',
    channels: ['In-App', 'Email', 'WhatsApp'],
    audience: 'Students, Parents',
  },
  {
    preview: 'Meeting slots are now open', lines: [72, 96, 60],
    category: 'PTA Meeting', name: 'PTA Meeting',
    note: 'Slot booking window, venue, and the reminder that follows the afternoon before.',
    channels: ['In-App', 'Push Notification', 'WhatsApp'],
    audience: 'Parents',
  },
  {
    preview: 'Admissions open for the session', lines: [88, 56, 84],
    category: 'Admission Notice', name: 'Admission Notice',
    note: 'Grades open, application window, documents required and the fee annexure.',
    channels: ['Email', 'Website Banner', 'In-App'],
    audience: 'Website, Parents',
  },
  {
    preview: 'Immediate notice to all families', lines: [96, 64, 80],
    category: 'Emergency Alert', name: 'Emergency Alert',
    note: 'Short, acknowledged, sent immediately on every channel and exempt from the approval queue.',
    channels: ['In-App', 'Email', 'SMS', 'Push Notification'],
    audience: 'Entire school',
  },
  {
    preview: 'Registrations are open for…', lines: [68, 92, 76],
    category: 'Sports Event', name: 'Sports Event',
    note: 'Event list, house allocation, kit requirements and the registration cut-off.',
    channels: ['In-App', 'Digital Notice Board', 'Email'],
    audience: 'Students, Teachers',
  },
  {
    preview: 'This month at the school', lines: [92, 80, 64],
    category: 'Newsletter', name: 'Newsletter',
    note: 'A monthly round-up assembled from the calendar, with sections for each department.',
    channels: ['Email', 'In-App'],
    audience: 'Entire school',
  },
  {
    preview: 'Wishing you a very happy…', lines: [56, 84, 48],
    category: 'Birthday Wishes', name: 'Birthday Wishes',
    note: 'Runs daily at 7:00 am against the date of birth field, one message per student.',
    channels: ['In-App', 'Push Notification', 'WhatsApp'],
    audience: 'Students, Parents',
  },
];

export type QueueState =
  | 'Pending approval' | 'Requires review' | 'Approved' | 'Scheduled' | 'Rejected';

export interface QueueItem {
  state: QueueState;
  title: string;
  requestedBy: string;
  /** "Scheduled 05 Aug, 07:30 am", or the date a rejected one was to leave. */
  when: string;
  whenLabel: string;
  /** The reviewer, or the note a rejection carries. */
  reviewer: string;
  reviewerLabel: string;
  reviewerIcon: string;
}

export const queueBadge: Record<QueueState, string> = {
  'Pending approval': 'message-status-badge is-high',
  'Requires review': 'message-status-badge is-high',
  Approved: 'message-status-badge is-live',
  Scheduled: 'message-status-badge is-live',
  Rejected: 'message-status-badge is-urgent',
};

export const queueIcon: Record<QueueState, string> = {
  'Pending approval': 'ti ti-hourglass',
  'Requires review': 'ti ti-eye-search',
  Approved: 'ti ti-circle-check',
  Scheduled: 'ti ti-clock',
  Rejected: 'ti ti-x',
};

/** The buttons an approval row offers, read off its state. */
export const queueActionsOf = (item: QueueItem): { label: string; icon: string; tone: string }[] => {
  if (item.state === 'Pending approval' || item.state === 'Requires review') {
    return [
      { label: 'Approve', icon: 'ti ti-check', tone: 'btn-primary' },
      { label: 'Reject', icon: 'ti ti-x', tone: 'btn-outline-light bg-white' },
      { label: 'View', icon: '', tone: 'btn-outline-light bg-white' },
    ];
  }
  if (item.state === 'Approved') {
    return [
      { label: 'View', icon: '', tone: 'btn-outline-light bg-white' },
      { label: 'Reschedule', icon: '', tone: 'btn-outline-light bg-white' },
    ];
  }
  if (item.state === 'Scheduled') {
    return [
      { label: 'View', icon: '', tone: 'btn-outline-light bg-white' },
      { label: 'Cancel', icon: 'ti ti-ban', tone: 'btn-outline-light bg-white' },
    ];
  }
  return [
    { label: 'View', icon: '', tone: 'btn-outline-light bg-white' },
    { label: 'Revise & resubmit', icon: '', tone: 'btn-outline-light bg-white' },
  ];
};

export const approvalQueue: QueueItem[] = [
  {
    state: 'Pending approval',
    title: 'Final reminder — second term fee closes in five days',
    requestedBy: 'Ms. Latha Rao',
    when: '05 Aug, 07:30 am', whenLabel: 'Scheduled',
    reviewer: 'Principal', reviewerLabel: 'Reviewer', reviewerIcon: 'ti ti-user-check',
  },
  {
    state: 'Requires review',
    title: 'Overdue book reminder for library members',
    requestedBy: 'Mr. Suresh Babu',
    when: '25 Aug, 09:00 am', whenLabel: 'Scheduled',
    reviewer: 'Ms. Divya Nair', reviewerLabel: 'Reviewer', reviewerIcon: 'ti ti-user-check',
  },
  {
    state: 'Approved',
    title: 'Independence Day — flag hoisting at 8:00 am',
    requestedBy: 'Ms. Latha Rao',
    when: '12 Aug, 08:00 am', whenLabel: 'Scheduled',
    reviewer: 'Principal on 30 Jul', reviewerLabel: 'Approved by', reviewerIcon: 'ti ti-user-check',
  },
  {
    state: 'Scheduled',
    title: 'Reminder — parent–teacher meeting is tomorrow',
    requestedBy: 'Ms. Divya Nair',
    when: '08 Aug, 04:00 pm', whenLabel: 'Scheduled',
    reviewer: 'Vice Principal on 28 Jul', reviewerLabel: 'Approved by', reviewerIcon: 'ti ti-user-check',
  },
  {
    state: 'Rejected',
    title: 'Uniform supplier discount offer for parents',
    requestedBy: 'Mr. Arun Prakash',
    when: '02 Aug, 10:00 am', whenLabel: 'Was',
    reviewer: '“Commercial content is not broadcast to parents.”',
    reviewerLabel: '', reviewerIcon: 'ti ti-message-circle',
  },
  {
    state: 'Pending approval',
    title: 'Route 11 pickup point change from Monday',
    requestedBy: 'Mr. Arun Prakash',
    when: '06 Aug, 05:00 pm', whenLabel: 'Scheduled',
    reviewer: 'Transport head', reviewerLabel: 'Reviewer', reviewerIcon: 'ti ti-user-check',
  },
];

export interface QuickAction {
  icon: string;
  title: string;
  note: string;
}

export const quickActions: QuickAction[] = [
  { icon: 'ti ti-speakerphone', title: 'Create Broadcast', note: 'Write a new message and route it' },
  { icon: 'ti ti-clock-play', title: 'Schedule Campaign', note: 'Set a departure date, time and zone' },
  { icon: 'ti ti-template', title: 'Manage Templates', note: 'Nine reusable broadcasts' },
  { icon: 'ti ti-users-group', title: 'Audience Groups', note: 'Ten addressable groups' },
  { icon: 'ti ti-repeat', title: 'Recurring Rules', note: 'Five active series' },
  { icon: 'ti ti-settings', title: 'Broadcast Settings', note: 'Quiet hours, limits and approvals' },
];
