export type TemplateState = 'Approved' | 'In review' | 'Rejected';

export interface WhatsappTemplate {
  preview: string;
  category: string;
  name: string;
  state: TemplateState;
  languages: string;
  /** The tokens the body names, in the order they appear. */
  fields: string[];
  /** Set when Meta turned it back. */
  rejectedReason: string;
  action: 'edit' | 'copy';
}

/** A template's variable count is the number of placeholders it names. */
export const variablesOf = (row: WhatsappTemplate): number => row.fields.length;

export const templateStateBadge: Record<TemplateState, string> = {
  Approved: 'message-status-badge is-live',
  'In review': 'message-status-badge is-high',
  Rejected: 'message-status-badge is-urgent',
};

export const templateStateIcon: Record<TemplateState, string> = {
  Approved: 'ti ti-circle-check',
  'In review': 'ti ti-hourglass',
  Rejected: 'ti ti-x',
};

export const whatsappTemplates: WhatsappTemplate[] = [
  {
    preview: 'Admission confirmed for {{1}}', category: 'Admissions', name: 'Admission Confirmation',
    state: 'Approved', languages: 'English',
    fields: ['{{student_name}}', '{{class}}'], rejectedReason: '', action: 'edit',
  },
  {
    preview: 'Term fee of Rs. {{2}} is due…', category: 'Fees', name: 'Fee Reminder',
    state: 'Approved', languages: 'English, Hindi',
    fields: ['{{parent_name}}', '{{fee_amount}}', '{{due_date}}'], rejectedReason: '', action: 'copy',
  },
  {
    preview: '{{1}} was marked absent today', category: 'Attendance', name: 'Attendance Alert',
    state: 'Approved', languages: 'English',
    fields: ['{{student_name}}', '{{date}}'], rejectedReason: '', action: 'edit',
  },
  {
    preview: '{{1}} begins on {{2}}', category: 'Examination', name: 'Exam Reminder',
    state: 'Approved', languages: 'English',
    fields: ['{{exam_name}}', '{{date}}'], rejectedReason: '', action: 'copy',
  },
  {
    preview: 'PTA meeting on {{1}} at {{2}}', category: 'PTA', name: 'PTA Meeting',
    state: 'In review', languages: 'English',
    fields: ['{{date}}', '{{time}}', '{{slot}}'], rejectedReason: '', action: 'edit',
  },
  {
    preview: 'Happy birthday, {{1}}!', category: 'Greetings', name: 'Birthday Wishes',
    state: 'Approved', languages: 'English, Tamil',
    fields: ['{{student_name}}'], rejectedReason: '', action: 'copy',
  },
  {
    preview: 'School will remain closed on {{1}}', category: 'Holiday', name: 'Holiday Notice',
    state: 'Approved', languages: 'English, Hindi',
    fields: ['{{date}}', '{{reason}}'], rejectedReason: '', action: 'edit',
  },
  {
    preview: 'URGENT: {{1}}', category: 'Emergency', name: 'Emergency Alert',
    state: 'Approved', languages: 'English',
    fields: ['{{message}}'], rejectedReason: '', action: 'copy',
  },
  {
    preview: 'Route {{1}} is running late by {{2}}', category: 'Transport', name: 'Transport Delay',
    state: 'Approved', languages: 'English',
    fields: ['{{transport_route}}', '{{delay_mins}}'], rejectedReason: '', action: 'edit',
  },
  {
    preview: '{{1}} results are published', category: 'Results', name: 'Result Published',
    state: 'Rejected', languages: 'English',
    fields: ['{{exam_name}}', '{{link}}'],
    rejectedReason: 'Link domain unverified', action: 'edit',
  },
];

/* ---------------------------- The audience builder --------------------------- */

export interface BaseGroup {
  label: string;
  count: number;
  /** How many of them have opted out of WhatsApp. */
  optedOut: number;
}

export const baseGroups: BaseGroup[] = [
  { label: 'Parents', count: 1198, optedOut: 41 },
  { label: 'Students', count: 1204, optedOut: 0 },
  { label: 'Teachers', count: 184, optedOut: 0 },
  { label: 'Staff', count: 96, optedOut: 0 },
  { label: 'Transport Users', count: 612, optedOut: 8 },
];

export const classNarrowOptions = ['All classes', 'Grades 6–10', 'Grade 12 only'];

/** What each narrowing leaves of a base group. */
export const classShare: Record<string, number> = {
  'All classes': 1,
  'Grades 6–10': 0.62,
  'Grade 12 only': 0.11,
};

export const conditionOptions = [
  'No condition', 'Has an outstanding fee', 'Absent today', 'On a bus route',
];

/**
 * The conditions that narrow to a fixed list rather than a share — the fee
 * ledger holds 359 families before opt-outs, which is what leaves 318.
 */
export const conditionCount: Record<string, number> = {
  'No condition': -1,
  'Has an outstanding fee': 359,
  'Absent today': 46,
  'On a bus route': 612,
};

export interface Audience {
  base: number;
  narrowed: number;
  optedOut: number;
  result: number;
}

/** Base group, narrowed by class and condition, less the opt-outs. */
export const audienceOf = (group: string, narrowClass: string, condition: string): Audience => {
  const found = baseGroups.find((entry) => entry.label === group) ?? baseGroups[0];
  const byClass = Math.round(found.count * (classShare[narrowClass] ?? 1));
  const fixed = conditionCount[condition] ?? -1;
  const narrowed = fixed >= 0 ? Math.min(byClass, fixed) : byClass;
  const optedOut = Math.min(found.optedOut, narrowed);
  return { base: found.count, narrowed, optedOut, result: Math.max(0, narrowed - optedOut) };
};

/* -------------------------------- Bulk upload -------------------------------- */

export const BULK_FILE = 'alumni-2026.csv';
export const BULK_UPLOADED = '03 Jun';

/** Messages the API accepts a second, which sets the delivery estimate. */
export const MESSAGES_PER_SECOND = 80;

export interface Validation {
  rows: number;
  duplicates: number;
  unregistered: number;
  deliverable: number;
}

export const validationOf = (
  rows: number, duplicates: number, unregistered: number,
): Validation => ({
  rows, duplicates, unregistered,
  deliverable: Math.max(0, rows - duplicates - unregistered),
});

export const BULK_VALIDATION = validationOf(1204, 41, 37);

/** "Under 1 min", or the minutes it will actually take. */
export const deliveryEstimateOf = (recipients: number): string => {
  const seconds = Math.ceil(recipients / MESSAGES_PER_SECOND);
  if (seconds < 60) return 'Under 1 min';
  return `${Math.ceil(seconds / 60)} min`;
};

/* ------------------------------ Recipient groups ----------------------------- */

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
    icon: 'ti ti-school', name: 'Students', note: 'With a WhatsApp number on record',
    count: '1,204', unit: 'recipients', status: 'Active', statusTone: 'is-live',
    last: 'Exam reminder, 26 Jul',
  },
  {
    icon: 'ti ti-users', name: 'Parents', note: 'Primary guardian per student',
    count: '1,198', unit: 'recipients', status: '41 opted out', statusTone: 'is-high',
    last: 'Fee reminder, 24 Jul',
  },
  {
    icon: 'ti ti-chalkboard', name: 'Teachers', note: 'All departments',
    count: '184', unit: 'recipients', status: 'Active', statusTone: 'is-live',
    last: 'Staff meeting, 24 Jul',
  },
  {
    icon: 'ti ti-id-badge-2', name: 'Staff', note: 'Administration and support',
    count: '96', unit: 'recipients', status: 'Active', statusTone: 'is-live',
    last: 'Rainfall closure, 29 Jul',
  },
  {
    icon: 'ti ti-users-group', name: 'Classes', note: 'Grade-level, all sections',
    count: '14', unit: 'groups', status: 'Active', statusTone: 'is-live',
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
    last: 'Route 7 timing, 22 Jul',
  },
  {
    icon: 'ti ti-building-community', name: 'Hostel Students', note: 'And local guardians',
    count: '284', unit: 'recipients', status: 'Active', statusTone: 'is-live',
    last: 'Mess menu change, 20 Jul',
  },
  {
    icon: 'ti ti-books', name: 'Library Members', note: 'Active borrowing card',
    count: '1,410', unit: 'recipients', status: 'Paused', statusTone: 'is-draft',
    last: 'Overdue reminder, 25 Jun',
  },
  {
    icon: 'ti ti-bookmarks', name: 'Custom Groups', note: 'Built in the audience builder',
    count: '7', unit: 'groups · 1,842 people', status: 'Active', statusTone: 'is-live',
    last: 'Parents with dues, 24 Jul',
  },
];

/* ------------------------------ Broadcast queue ------------------------------ */

export type BroadcastState =
  | 'Draft' | 'Scheduled' | 'Processing' | 'Sent' | 'Delivered' | 'Failed' | 'Cancelled';

export interface QueuedBroadcast {
  state: BroadcastState;
  template: string;
  title: string;
  note: string;
  audience: string;
  audienceCount: string;
  /** Either a schedule or a delivery figure, depending on the state. */
  metaLabel: string;
  metaValue: string;
  stamp: string;
  /** The template this broadcast names is still in review, so it cannot leave. */
  blocked: boolean;
}

export const broadcastStateBadge: Record<BroadcastState, string> = {
  Draft: 'message-status-badge is-draft',
  Scheduled: 'message-status-badge is-scheduled',
  Processing: 'message-status-badge is-high',
  Sent: 'message-status-badge is-live',
  Delivered: 'message-status-badge is-live',
  Failed: 'message-status-badge is-urgent',
  Cancelled: 'message-status-badge is-urgent',
};

export const broadcastStateIcon: Record<BroadcastState, string> = {
  Draft: 'ti ti-pencil',
  Scheduled: 'ti ti-clock',
  Processing: 'ti ti-loader',
  Sent: 'ti ti-send',
  Delivered: 'ti ti-checks',
  Failed: 'ti ti-x',
  Cancelled: 'ti ti-ban',
};

/** The second button, read off the state. */
export const broadcastActionOf = (row: QueuedBroadcast): string => {
  if (row.blocked) return 'View';
  if (row.state === 'Draft') return 'Schedule';
  if (row.state === 'Scheduled') return 'Reschedule';
  if (row.state === 'Processing') return 'View';
  if (row.state === 'Failed') return 'Fix template';
  if (row.state === 'Cancelled') return 'Recreate';
  return 'Duplicate';
};

export const broadcastQueue: QueuedBroadcast[] = [
  {
    state: 'Draft', template: 'Admission Notice', title: 'Admissions open for 2027 – 2028',
    note: 'Applications for Nursery through Grade 9 open on 1 September. Held until the fee annexure is signed.',
    audience: 'Parents', audienceCount: '1,198',
    metaLabel: 'Schedule', metaValue: 'Not set', stamp: 'Edited 01 Aug', blocked: false,
  },
  {
    state: 'Scheduled', template: 'Fee Reminder', title: 'Term-2 fee closes in five days',
    note: 'Final reminder to families with an outstanding balance, sent on the morning of the fifth.',
    audience: 'Parents with dues', audienceCount: '318',
    metaLabel: 'Schedule', metaValue: '05 Aug, 07:30 am', stamp: 'Credits reserved', blocked: false,
  },
  {
    state: 'Processing', template: 'Transport Delay', title: 'Route 7 running 20 minutes late',
    note: 'Sending now to families on route 7. 62 of 84 delivered so far.',
    audience: 'Route 7', audienceCount: '84',
    metaLabel: 'Delivery', metaValue: '62 / 84', stamp: 'Started 02 Aug, 05:00 pm', blocked: false,
  },
  {
    state: 'Sent', template: 'Exam Reminder', title: 'Term-2 datesheet and hall tickets',
    note: 'Sent to students and parents in Grades 6 to 12 with the datesheet attached.',
    audience: 'Students, Parents', audienceCount: '1,920',
    metaLabel: 'Delivery', metaValue: '1,884 delivered', stamp: '26 Jul, 09:02 am', blocked: false,
  },
  {
    state: 'Delivered', template: 'Emergency Alert', title: 'School closed Thursday — heavy rainfall',
    note: 'Sent immediately on the district advisory. Read by 91% within the hour.',
    audience: 'Entire school', audienceCount: '2,940',
    metaLabel: 'Delivery', metaValue: '2,918 · 2,684 read', stamp: '29 Jul, 06:12 pm', blocked: false,
  },
  {
    state: 'Failed', template: 'Result Published', title: 'Term-1 results are now available',
    note: "Rejected before sending — the template's link domain is not verified on the business account.",
    audience: 'Parents', audienceCount: '1,198',
    metaLabel: 'Delivery', metaValue: '0 sent', stamp: '18 Jul, 04:00 pm', blocked: false,
  },
  {
    state: 'Cancelled', template: 'Sports Event', title: 'Inter-house athletics trials',
    note: 'Cancelled with the closure. To be recreated once the trials are re-dated for September.',
    audience: 'Students, Teachers', audienceCount: '1,388',
    metaLabel: 'Schedule', metaValue: 'Was 30 Jul, 09:00 am', stamp: 'Cancelled 28 Jul', blocked: false,
  },
  {
    state: 'Scheduled', template: 'PTA Meeting', title: 'Parent–teacher meeting is tomorrow',
    note: 'Held until the PTA Meeting template clears review. Will not send unapproved.',
    audience: 'Parents, 6–10', audienceCount: '720',
    metaLabel: 'Schedule', metaValue: '08 Aug, 04:00 pm', stamp: 'Template in review', blocked: true,
  },
];

/* ------------------------------- Media library ------------------------------- */

export interface MediaItem {
  icon: string;
  image: string;
  kind: string;
  name: string;
  meta: string;
  /** A template's own header image cannot be attached elsewhere. */
  locked: boolean;
}

export const mediaLibrary: MediaItem[] = [
  {
    icon: '', image: 'assets/img/blogs/blog-02.jpg', kind: 'Image',
    name: 'exam-datesheet-banner.jpg', meta: 'JPG · 412 KB · used 4 times', locked: false,
  },
  {
    icon: 'ti ti-file-type-pdf', image: '', kind: 'PDF',
    name: 'fee-structure-term-2.pdf', meta: 'PDF · 286 KB · used 6 times', locked: false,
  },
  {
    icon: 'ti ti-video', image: '', kind: 'Video',
    name: 'annual-day-invite.mp4', meta: 'MP4 · 8.4 MB · used once', locked: false,
  },
  {
    icon: 'ti ti-file-description', image: '', kind: 'Document',
    name: 'transport-routes-2026.docx', meta: 'DOCX · 118 KB · used twice', locked: false,
  },
  {
    icon: 'ti ti-microphone', image: '', kind: 'Voice',
    name: 'principal-message.ogg', meta: 'OGG · 0:48 · used once', locked: false,
  },
  {
    icon: '', image: 'assets/img/events/event-01.jpg', kind: 'Image',
    name: 'sports-meet-poster.jpg', meta: 'JPG · 604 KB · used 3 times', locked: false,
  },
  {
    icon: 'ti ti-link', image: '', kind: 'Link',
    name: 'portal.school.edu/fees', meta: 'Verified domain · used 9 times', locked: false,
  },
  {
    icon: 'ti ti-template', image: '', kind: 'Template',
    name: 'fee-reminder-header.jpg', meta: 'Bound to Fee Reminder · locked', locked: true,
  },
];

/* ------------------------------- Quick actions ------------------------------- */

export interface QuickAction {
  icon: string;
  title: string;
  note: string;
}

export const quickActions: QuickAction[] = [
  { icon: 'ti ti-message-2', title: 'Send Message', note: 'Start a one-to-one conversation' },
  { icon: 'ti ti-users-plus', title: 'Bulk Messaging', note: 'Send to an uploaded list' },
  { icon: 'ti ti-speakerphone', title: 'Create Broadcast', note: 'One template to a whole group' },
  { icon: 'ti ti-file-import', title: 'Import Contacts', note: 'CSV or Excel, validated on upload' },
  { icon: 'ti ti-template', title: 'Manage Templates', note: 'Ten registered with Meta' },
  { icon: 'ti ti-inbox', title: 'View Inbox', note: '214 conversations, 6 unread' },
  { icon: 'ti ti-users-group', title: 'Recipient Groups', note: 'Eleven addressable groups' },
  { icon: 'ti ti-settings', title: 'WhatsApp Settings', note: 'Business account, number and limits' },
];
