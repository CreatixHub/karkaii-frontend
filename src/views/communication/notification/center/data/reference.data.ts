import type { Channel } from './notifications.data';

/* ------------------------------- The channels -------------------------------- */

export interface ChannelCard {
  channel: Channel;
  title: string;
  note: string;
  state: string;
  stateTone: string;
  lastSent: string;
  queue: string;
  queueHealth: string;
  queueTone: string;
  method: string;
  methodTag: string;
  configuration: string;
  configurationState: string;
  configurationTone: string;
  monthly: string;
}

export const channelCards: ChannelCard[] = [
  {
    channel: 'Email', title: 'Email Notifications',
    note: 'SMTP · mail.school.edu · DKIM signed',
    state: 'Active', stateTone: 'is-live', lastSent: '02 Aug, 10:15 am',
    queue: '412 in flight, draining normally', queueHealth: 'Healthy', queueTone: 'is-live',
    method: 'Batched at 200 per minute', methodTag: 'SMTP relay',
    configuration: 'SPF, DKIM and DMARC all pass',
    configurationState: 'Complete', configurationTone: 'is-live',
    monthly: '31 notifications this month',
  },
  {
    channel: 'Push', title: 'Push Notifications',
    note: 'Mobile app · 2,104 opted-in devices',
    state: 'Active', stateTone: 'is-live', lastSent: '02 Aug, 05:00 pm',
    queue: 'Delivers in seconds, rarely backs up', queueHealth: 'Idle', queueTone: '',
    method: 'FCM for Android, APNs for iOS', methodTag: 'Push service',
    configuration: 'APNs certificate expires 14 Nov',
    configurationState: 'Expires soon', configurationTone: 'is-high',
    monthly: '19 notifications this month',
  },
  {
    channel: 'Portal', title: 'Parent Communication',
    note: 'Parent portal inbox · acknowledgeable',
    state: 'Active', stateTone: 'is-live', lastSent: '02 Aug, 10:15 am',
    queue: 'Written instantly on publish', queueHealth: 'Idle', queueTone: '',
    method: 'Portal inbox with read receipt', methodTag: 'In-portal',
    configuration: '1,198 of 1,240 parents activated',
    configurationState: 'Complete', configurationTone: 'is-live',
    monthly: '24 communications this month',
  },
];

/* --------------------------- Parent communications --------------------------- */

export type ParentState = 'Active' | 'Queued' | 'Draft' | 'Restricted' | 'Confidential' | 'Priority route';

export interface ParentCommunication {
  icon: string;
  title: string;
  state: ParentState;
  /** The message a parent actually receives. */
  message: string;
  audience: string;
  schedule: string;
  channels: Channel[];
}

export const parentStateBadge: Record<ParentState, string> = {
  Active: 'message-status-badge is-live',
  Queued: 'message-status-badge is-scheduled',
  Draft: 'message-status-badge is-draft',
  Restricted: 'message-status-badge is-high',
  Confidential: 'message-status-badge is-high',
  'Priority route': 'message-status-badge is-urgent',
};

export const parentCommunications: ParentCommunication[] = [
  {
    icon: 'ti ti-book', title: 'Academic Updates', state: 'Active',
    message: "Aarav's term-2 progress report is now available in the portal. His class teacher has added a note on the science project.",
    audience: 'Parents · 1,240', schedule: 'On report publish', channels: ['Email', 'Portal'],
  },
  {
    icon: 'ti ti-calendar-x', title: 'Attendance Alerts', state: 'Active',
    message: 'Aarav Menon was marked absent for the full day on 02 August. If this is unexpected, please contact the class teacher.',
    audience: 'Parents of absentees', schedule: 'Daily, 10:15 am', channels: ['Push', 'Portal'],
  },
  {
    icon: 'ti ti-report-money', title: 'Fee Reminders', state: 'Queued',
    message: 'The term-2 fee of Rs. 18,500 is due on 10 August. Payment can be made through the portal or at the accounts counter.',
    audience: 'Parents with dues · 318', schedule: '05 Aug, 07:30 am',
    channels: ['Email', 'Push', 'Portal'],
  },
  {
    icon: 'ti ti-file-certificate', title: 'Exam Notifications', state: 'Active',
    message: 'Term-2 examinations begin on 12 August. Hall tickets are in the portal from Monday; the seating plan is attached.',
    audience: 'Students, Parents · 1,920', schedule: 'Sent 26 Jul',
    channels: ['Email', 'Push', 'Portal'],
  },
  {
    icon: 'ti ti-notebook', title: 'Homework Updates', state: 'Active',
    message: 'Three assignments were posted for 7-B today. Two are due on Friday and one on Monday next week.',
    audience: 'Parents by class', schedule: 'Daily, 06:00 pm', channels: ['Push', 'Portal'],
  },
  {
    icon: 'ti ti-mood-search', title: 'Behaviour Reports', state: 'Restricted',
    message: 'The class teacher would like to speak with you about an incident during the lunch break. Please call the office.',
    audience: 'Individual parents', schedule: 'Manual, teacher-initiated',
    channels: ['Email', 'Portal'],
  },
  {
    icon: 'ti ti-users-group', title: 'PTA Invitations', state: 'Queued',
    message: 'Your parent–teacher meeting slot is 09 August at 10:40 am, room 204. Please arrive five minutes early.',
    audience: 'Parents, 6–10 · 720', schedule: '08 Aug, 04:00 pm',
    channels: ['Email', 'Push', 'Portal'],
  },
  {
    icon: 'ti ti-trophy', title: 'Achievements', state: 'Draft',
    message: 'Congratulations — the senior quiz team placed first at the inter-school championship held on 30 July.',
    audience: 'Entire school · 2,940', schedule: 'Not set', channels: ['Email', 'Portal'],
  },
  {
    icon: 'ti ti-alert-triangle', title: 'Emergency Alerts', state: 'Priority route',
    message: 'The school will remain closed on Thursday, 30 July, following the district advisory. Buses will not run.',
    audience: 'Entire school · 2,940', schedule: 'Immediate, no approval',
    channels: ['Email', 'Push', 'Portal'],
  },
  {
    icon: 'ti ti-bus', title: 'Transport Notifications', state: 'Active',
    message: 'Route 7 is running approximately 20 minutes behind schedule this evening due to traffic on the ring road.',
    audience: 'Route families · 612', schedule: 'On driver report', channels: ['Push', 'Portal'],
  },
  {
    icon: 'ti ti-stethoscope', title: 'Medical Alerts', state: 'Confidential',
    message: 'Aarav visited the infirmary at 11:20 am with a headache and has been sent back to class after rest.',
    audience: 'Individual parents', schedule: 'On infirmary entry', channels: ['Email', 'Portal'],
  },
];

/* -------------------------------- Templates ---------------------------------- */

export interface NotificationTemplate {
  preview: string;
  lines: number[];
  category: string;
  name: string;
  channels: Channel[];
  fields: string[];
  /** Set where the template is restricted to one route. */
  restriction: string;
  action: 'edit' | 'copy';
}

/** Counted from the tokens the template names. */
export const variablesOf = (row: NotificationTemplate): number => row.fields.length;

export const notificationTemplates: NotificationTemplate[] = [
  {
    preview: '{{student_name}} was marked absent', lines: [88, 60],
    category: 'Attendance', name: 'Attendance Alert', channels: ['Push', 'Portal'],
    fields: ['{{student_name}}', '{{date}}'], restriction: '', action: 'edit',
  },
  {
    preview: 'Term fee of Rs. {{fee_amount}} is due', lines: [92, 72],
    category: 'Fees', name: 'Fee Reminder', channels: ['Email', 'Push', 'Portal'],
    fields: ['{{parent_name}}', '{{fee_amount}}', '{{due_date}}'], restriction: '', action: 'copy',
  },
  {
    preview: '{{exam_name}} results are published', lines: [72, 84],
    category: 'Examination', name: 'Exam Result', channels: ['Email', 'Portal'],
    fields: ['{{student_name}}', '{{exam_name}}'], restriction: '', action: 'edit',
  },
  {
    preview: '{{exam_name}} begins on {{date}}', lines: [84, 64],
    category: 'Examination', name: 'Exam Schedule', channels: ['Email', 'Push', 'Portal'],
    fields: ['{{exam_name}}', '{{date}}', '{{class}}'], restriction: '', action: 'copy',
  },
  {
    preview: 'School will remain closed on {{date}}', lines: [76, 88],
    category: 'Holiday', name: 'Holiday Notice', channels: ['Email', 'Push', 'Portal'],
    fields: ['{{date}}', '{{reason}}'], restriction: '', action: 'edit',
  },
  {
    preview: 'Your meeting slot is {{time}}', lines: [72, 96],
    category: 'PTA', name: 'PTA Meeting', channels: ['Email', 'Push', 'Portal'],
    fields: ['{{parent_name}}', '{{date}}', '{{time}}'], restriction: '', action: 'copy',
  },
  {
    preview: 'URGENT: {{message}}', lines: [96, 52],
    category: 'Emergency', name: 'Emergency Alert', channels: ['Email', 'Push', 'Portal'],
    fields: ['{{message}}'], restriction: '', action: 'edit',
  },
  {
    preview: 'Happy birthday, {{student_name}}!', lines: [56, 72],
    category: 'Greetings', name: 'Birthday Wishes', channels: ['Push', 'Portal'],
    fields: ['{{student_name}}'], restriction: '', action: 'copy',
  },
  {
    preview: 'Admission confirmed for {{name}}', lines: [84, 60],
    category: 'Admissions', name: 'Admission Confirmation', channels: ['Email', 'Portal'],
    fields: ['{{student_name}}', '{{class}}', '{{admission_no}}'], restriction: '', action: 'edit',
  },
  {
    preview: 'Route {{route}} is running late', lines: [64, 88],
    category: 'Transport', name: 'Transport Delay', channels: ['Push', 'Portal', 'Email'],
    fields: ['{{transport_route}}', '{{delay_mins}}'], restriction: '', action: 'copy',
  },
  {
    preview: '{{count}} assignments posted today', lines: [80, 56],
    category: 'Homework', name: 'Homework Reminder', channels: ['Push', 'Portal'],
    fields: ['{{class}}', '{{count}}', '{{due_date}}'], restriction: '', action: 'edit',
  },
  {
    preview: '{{student_name}} visited the infirmary', lines: [88, 64],
    category: 'Medical', name: 'Medical Alert', channels: ['Portal', 'Email', 'Push'],
    fields: ['{{student_name}}', '{{time}}', '{{reason}}'],
    restriction: 'Confidential · portal only', action: 'edit',
  },
];

/* ---------------------------- Recipient management --------------------------- */

export interface RecipientGroup {
  icon: string;
  name: string;
  note: string;
  count: string;
  unit: string;
  status: string;
  statusTone: string;
  last: string;
}

export const recipientGroups: RecipientGroup[] = [
  {
    icon: 'ti ti-school', name: 'All Students', note: 'Nursery to Grade 12, enrolled',
    count: '1,286', unit: 'recipients', status: 'Active', statusTone: 'is-live',
    last: 'Exam datesheet, 26 Jul',
  },
  {
    icon: 'ti ti-users', name: 'Parents', note: 'Primary guardian per student',
    count: '1,240', unit: 'recipients', status: '42 portal inactive', statusTone: 'is-high',
    last: 'Absence alert, 02 Aug',
  },
  {
    icon: 'ti ti-chalkboard', name: 'Teachers', note: 'Teaching faculty, all departments',
    count: '184', unit: 'recipients', status: 'Active', statusTone: 'is-live',
    last: 'Staff briefing, 24 Jul',
  },
  {
    icon: 'ti ti-id-badge-2', name: 'Staff', note: 'Administration and support',
    count: '96', unit: 'recipients', status: 'Active', statusTone: 'is-live',
    last: 'Rainfall closure, 29 Jul',
  },
  {
    icon: 'ti ti-users-group', name: 'Specific Classes', note: 'Grade-level, all sections',
    count: '14', unit: 'classes', status: '1 queued', statusTone: 'is-scheduled',
    last: 'Grade 9 test change, 30 Jul',
  },
  {
    icon: 'ti ti-layout-rows', name: 'Sections', note: 'Individually addressable',
    count: '42', unit: 'sections', status: 'Active', statusTone: 'is-live',
    last: '7-B trip consent, 19 Jul',
  },
  {
    icon: 'ti ti-sitemap', name: 'Departments', note: '12 groups, 268 people',
    count: '268', unit: 'recipients', status: 'Active', statusTone: 'is-live',
    last: 'Lab safety, 17 Jul',
  },
  {
    icon: 'ti ti-bus', name: 'Transport Users', note: 'Families on a bus route',
    count: '612', unit: 'recipients', status: '1 queued', statusTone: 'is-scheduled',
    last: 'Route 7 delay, 02 Aug',
  },
];

/* ---------------------------- Delivery management ---------------------------- */

export interface DeliveryRule {
  icon: string;
  name: string;
  value: string;
  topLabel: string;
  topValue: string;
  topTag: string;
  bottomLabel: string;
  bottomValue: string;
}

export const deliveryRules: DeliveryRule[] = [
  {
    icon: 'ti ti-bolt', name: 'Immediate Delivery', value: '2',
    topLabel: 'Sends', topValue: 'The moment it is published', topTag: 'Now',
    bottomLabel: 'Bypasses quiet hours', bottomValue: 'Emergency only',
  },
  {
    icon: 'ti ti-clock', name: 'Scheduled Delivery', value: '5',
    topLabel: 'Next', topValue: '05 Aug, 07:30 am IST', topTag: 'Dated',
    bottomLabel: 'Quiet hours', bottomValue: 'Held until 7 am if earlier',
  },
  {
    icon: 'ti ti-repeat', name: 'Recurring Notifications', value: '6',
    topLabel: 'Patterns', topValue: 'Daily, weekly and on-event', topTag: 'Series',
    bottomLabel: 'Skips empty runs', bottomValue: 'On',
  },
  {
    icon: 'ti ti-flame', name: 'Priority Delivery', value: '3',
    topLabel: 'Jumps the queue', topValue: 'Urgent notifications only', topTag: 'Urgent',
    bottomLabel: 'Every channel at once', bottomValue: 'On',
  },
  {
    icon: 'ti ti-refresh', name: 'Retry Failed Messages', value: '18',
    topLabel: 'Attempts', topValue: 'Ten minutes apart', topTag: '2',
    bottomLabel: 'Then', bottomValue: 'Flag for manual resend',
  },
  {
    icon: 'ti ti-checks', name: 'Delivery Confirmation', value: '98%',
    topLabel: 'Written back per recipient', topValue: 'On', topTag: 'Retained',
    bottomLabel: 'For the audit trail', bottomValue: '1 year',
  },
  {
    icon: 'ti ti-eye-check', name: 'Read Receipt', value: '81%',
    topLabel: 'Email', topValue: 'Pixel-based, approximate', topTag: 'Indicative',
    bottomLabel: 'Portal and push', bottomValue: 'Exact, on open',
  },
  {
    icon: 'ti ti-checkbox', name: 'Acknowledgement', value: '3',
    topLabel: 'Outstanding', topValue: 'Across three notifications', topTag: '529 parents',
    bottomLabel: 'Follow-up', bottomValue: 'Class teachers call after 24h',
  },
];

/* --------------------------------- Activity ---------------------------------- */

export interface ActivityEntry {
  title: string;
  icon: string;
  audience: string;
  recipients: number;
  channels: string;
  delivered: number;
  read: number;
  /** Set where something came back from the gateway. */
  note: string;
  acknowledged: number;
  stamp: string;
  by: string;
  /** Whether the entry offers a resend rather than a copy. */
  resendable: boolean;
}

/** Delivery and read, as percentages of the recipients. */
export const activityRateOf = (row: ActivityEntry): { delivered: number; read: number } => ({
  delivered: row.recipients > 0 ? Math.round((row.delivered / row.recipients) * 100) : 0,
  read: row.recipients > 0 ? Math.round((row.read / row.recipients) * 100) : 0,
});

export const activity: ActivityEntry[] = [
  {
    title: 'Daily absence alert — 02 August', icon: 'ti ti-users',
    audience: 'Parents of absentees', recipients: 47, channels: 'Push, Portal',
    delivered: 47, read: 41, note: '', acknowledged: 0,
    stamp: '02 Aug, 10:15 am', by: 'System', resendable: false,
  },
  {
    title: 'Route 7 running 20 minutes late', icon: 'ti ti-bus',
    audience: 'Route 7 families', recipients: 84, channels: 'Push, Portal',
    delivered: 79, read: 75, note: '', acknowledged: 0,
    stamp: '02 Aug, 05:00 pm', by: 'Mr. Arun Prakash', resendable: false,
  },
  {
    title: 'Term-2 fee reminder', icon: 'ti ti-mail',
    audience: 'Parents with dues', recipients: 318, channels: 'Email, Push, Portal',
    delivered: 312, read: 229,
    note: 'Six email addresses hard-bounced — mailbox does not exist. Portal copies were delivered.',
    acknowledged: 0,
    stamp: '24 Jul, 07:30 am', by: 'Ms. Divya Nair', resendable: true,
  },
  {
    title: 'School closed Thursday — rainfall', icon: 'ti ti-alert-triangle',
    audience: 'Entire school', recipients: 2940, channels: 'all channels',
    delivered: 2911, read: 2684, note: '', acknowledged: 2411,
    stamp: '29 Jul, 06:12 pm', by: 'Ms. Latha Rao', resendable: false,
  },
  {
    title: 'Term-2 datesheet and hall tickets', icon: 'ti ti-file-certificate',
    audience: 'Students, Parents', recipients: 1920, channels: 'Email, Push, Portal',
    delivered: 1882, read: 1402, note: '', acknowledged: 1180,
    stamp: '26 Jul, 09:02 am', by: 'Mr. Arun Prakash', resendable: false,
  },
  {
    title: 'July newsletter — library week', icon: 'ti ti-news',
    audience: 'Entire school', recipients: 2940, channels: 'Email only',
    delivered: 2852, read: 1558, note: '', acknowledged: 0,
    stamp: '02 Jul, 08:00 am', by: 'Mr. Suresh Babu', resendable: false,
  },
];

/* ------------------------------- Quick actions -------------------------------- */

export interface QuickAction {
  icon: string;
  title: string;
  note: string;
}

export const quickActions: QuickAction[] = [
  { icon: 'ti ti-square-rounded-plus', title: 'Create Notification', note: 'Write one and route it' },
  { icon: 'ti ti-mail', title: 'Email Notification', note: 'Composed for the inbox' },
  { icon: 'ti ti-bell', title: 'Push Notification', note: 'One line, opted-in devices' },
  { icon: 'ti ti-users', title: 'Parent Communication', note: 'Portal inbox, acknowledgeable' },
  { icon: 'ti ti-template', title: 'Manage Templates', note: 'Twelve reusable notifications' },
  { icon: 'ti ti-file-import', title: 'Import Recipients', note: 'CSV or Excel, validated' },
  { icon: 'ti ti-file-export', title: 'Export Report', note: 'Delivery and read, per notification' },
  { icon: 'ti ti-settings', title: 'Notification Settings', note: 'Channels, quiet hours and retries' },
];
