export type Encoding = 'GSM-7' | 'Unicode';

export type Priority = 'Transactional — high' | 'Normal' | 'Promotional — low';

export type LogState = 'Delivered' | 'Failed' | 'Pending DLR' | 'Queued' | 'Rejected';

export interface RecipientGroup {
  id: string;
  icon: string;
  name: string;
  count: number;
  note: string;
  last: string;
  /** Which toolbar audience option this group answers to. */
  audience: string;
}

export interface SmsTemplate {
  preview: string;
  category: string;
  name: string;
  fields: string[];
  /** Characters at the longest merge expansion, as the template counts them. */
  characters: number;
  /** The template's own second action — edit or copy, alternating in the markup. */
  action: 'edit' | 'copy';
}

export interface MergeField {
  label: string;
  note: string;
  token: string;
  /** The longest value on record, which is what the estimate counts. */
  longest: string;
}

export interface LogEntry {
  title: string;
  icon: string;
  audience: string;
  detail: string;
  state: LogState;
  gateway: string;
  at: string;
  /** Set when the operator returned one. */
  reason: string;
  /** Failures inside an otherwise delivered bulk send. */
  failed: number;
}

export interface FailureReason {
  label: string;
  note: string;
  count: number;
}

export interface SentRecipient {
  name: string;
  note: string;
  mobile: string;
  state: 'Delivered' | 'Failed';
}

export interface HistoryEntry {
  title: string;
  meta: string;
  result: string;
}

export interface QuickAction {
  icon: string;
  title: string;
  note: string;
}

/* ------------------------------- Derivations -------------------------------- */

export const REGISTER_DATE = '2 Aug 2026';

/** The demo tariff the estimate quotes. */
export const RATE_PER_SEGMENT = 0.3;

/** The gateway's throughput, used for the bulk time estimate. */
export const MESSAGES_PER_MINUTE = 400;

export const CREDITS_AVAILABLE = 8540;

/** The whole roll, which the filter footer counts against. */
export const TOTAL_RECIPIENTS = 2940;

export const segmentSize = (encoding: Encoding): number => (encoding === 'GSM-7' ? 160 : 70);

/** A message of no length is still one segment once it is sent. */
export const segmentsOf = (length: number, encoding: Encoding): number =>
  Math.max(1, Math.ceil(length / segmentSize(encoding)));

/** What is left in the last segment. */
export const remainingOf = (length: number, encoding: Encoding): number =>
  segmentsOf(length, encoding) * segmentSize(encoding) - length;

export const mergeFields: MergeField[] = [
  { label: 'Student Name', note: 'Full name as enrolled', token: '{{student_name}}', longest: 'Aarav Menon' },
  { label: 'Parent Name', note: 'Primary guardian', token: '{{parent_name}}', longest: 'Rahul Menon' },
  { label: 'Class', note: '', token: '{{class}}', longest: '7' },
  { label: 'Section', note: '', token: '{{section}}', longest: 'B' },
  { label: 'Admission Number', note: '', token: '{{admission_no}}', longest: 'AD9892431' },
  { label: 'Fee Amount', note: 'Outstanding balance, formatted', token: '{{fee_amount}}', longest: '18,500' },
  { label: 'Exam Name', note: '', token: '{{exam_name}}', longest: 'Term-2 Examination' },
  { label: 'Attendance Percentage', note: 'Term to date', token: '{{attendance_pct}}', longest: '92%' },
  { label: 'Transport Route', note: '', token: '{{transport_route}}', longest: 'Route 11' },
  { label: 'Custom Variables', note: 'Any column from an imported file', token: '{{custom_1}}', longest: 'Value' },
];

/**
 * The body with every merge field replaced by its longest value on record.
 * A field with nothing on record resolves to an empty string, exactly as the
 * note under the merge-field list says.
 */
export const expandOf = (body: string): string =>
  mergeFields.reduce(
    (text, field) => text.split(field.token).join(field.longest),
    body,
  );

export const expandedLengthOf = (body: string): number => expandOf(body).length;

/** The tokens a body actually uses. */
export const usedFieldsOf = (body: string): string[] =>
  mergeFields.filter((field) => body.includes(field.token)).map((field) => field.token);

export const costOf = (recipients: number, segments: number): number =>
  Number((recipients * segments * RATE_PER_SEGMENT).toFixed(2));

export const money = (amount: number): string =>
  `₹${amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

/** Rounded, as the composer strip prints it. */
export const roundMoney = (amount: number): string => `₹${Math.floor(amount).toLocaleString('en-IN')}`;

export interface Validation {
  rows: number;
  duplicates: number;
  invalid: number;
  dnd: number;
  deliverable: number;
}

/** Every exclusion comes off the rows read; what is left is deliverable. */
export const validationOf = (
  rows: number, duplicates: number, invalid: number, dnd: number,
): Validation => ({
  rows, duplicates, invalid, dnd,
  deliverable: Math.max(0, rows - duplicates - invalid - dnd),
});

export const minutesToSend = (messages: number): number =>
  Math.max(1, Math.ceil(messages / MESSAGES_PER_MINUTE));

export const successRateOf = (delivered: number, submitted: number): number =>
  submitted > 0 ? Math.round((delivered / submitted) * 100) : 0;

/* ------------------------------ Filter options ------------------------------ */

export const audienceOptions = [
  'All Students', 'Parents', 'Teachers', 'Staff',
  'Transport Users', 'Hostel Students', 'Library Members', 'Custom Groups',
];

export const classOptions = ['Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'];

export const sectionOptions = ['A', 'B', 'C', 'D'];

export const departmentOptions = [
  'Science', 'Mathematics', 'Languages', 'Accounts', 'Transport', 'Library', 'Administration',
];

export const templateOptions = [
  'Attendance Alert', 'Fee Reminder', 'Exam Notification', 'Holiday Notice',
  'Emergency Alert', 'PTA Meeting', 'Result Published', 'Transport Delay',
];

export const priorityOptions: Priority[] = ['Transactional — high', 'Normal', 'Promotional — low'];

export const deliveryStatusOptions = [
  'Delivered', 'Sent', 'Queued', 'Pending DLR', 'Failed', 'Rejected by DND',
];

export const languageOptions = ['English', 'Hindi', 'Tamil', 'Malayalam', 'Kannada'];

export const senderOptions = ['PRSKUL', 'PRSKOL', 'SCHOOL'];

export const encodingOptions: { id: Encoding; label: string }[] = [
  { id: 'GSM-7', label: 'GSM-7 — 160 per segment' },
  { id: 'Unicode', label: 'Unicode — 70 per segment' },
];

export const gatewayOptions = ['Primary — Kaleyra', 'Fallback — Twilio', 'Bulk — MSG91'];

export const templateCategoryOptions = [
  'Fees', 'Attendance', 'Examination', 'Holiday', 'Emergency', 'PTA', 'Transport', 'Library', 'Greetings',
];

export const expiryOptions = ['4 hours', '24 hours', '48 hours'];

export const recurrenceOptions = ['One-off', 'Daily', 'Weekly', 'Monthly'];

export const countryCodeOptions = ['+91 India', '+971 UAE', '+44 UK'];

export const numberColumnOptions = ['Column A — mobile', 'Column B', 'Column C'];

export const timeZoneOptions = ['IST (UTC +5:30)', 'GST (UTC +4:00)', 'UTC'];

/** The chips above the composer, which start it from a template. */
export const templateStarters = [
  { icon: 'ti ti-calendar-x', name: 'Attendance Alert' },
  { icon: 'ti ti-report-money', name: 'Fee Reminder' },
  { icon: 'ti ti-file-certificate', name: 'Exam Notification' },
  { icon: 'ti ti-beach', name: 'Holiday Notice' },
  { icon: 'ti ti-alert-triangle', name: 'Emergency Alert' },
];

/* --------------------------------- The rows --------------------------------- */

export const recipientGroups: RecipientGroup[] = [
  {
    id: 'students', icon: 'ti ti-school', name: 'All Students', count: 1286,
    note: 'with a mobile on record', last: 'Exam circular, 26 Jul', audience: 'All Students',
  },
  {
    id: 'parents', icon: 'ti ti-users', name: 'Parents', count: 1240,
    note: 'primary guardian', last: 'Rainfall closure, 29 Jul', audience: 'Parents',
  },
  {
    id: 'teachers', icon: 'ti ti-chalkboard', name: 'Teachers', count: 184,
    note: 'all departments', last: 'Staff meeting, 24 Jul', audience: 'Teachers',
  },
  {
    id: 'staff', icon: 'ti ti-id-badge-2', name: 'Staff', count: 96,
    note: 'admin and support', last: 'Rainfall closure, 29 Jul', audience: 'Staff',
  },
  {
    id: 'classes', icon: 'ti ti-users-group', name: 'Classes', count: 14,
    note: 'grade-level groups', last: 'Grade 9 test change, 30 Jul', audience: 'All Students',
  },
  {
    id: 'sections', icon: 'ti ti-layout-rows', name: 'Sections', count: 42,
    note: 'individually addressable', last: '7-B trip consent, 19 Jul', audience: 'All Students',
  },
  {
    id: 'departments', icon: 'ti ti-sitemap', name: 'Departments', count: 12,
    note: '268 people', last: 'Lab safety, 17 Jul', audience: 'Teachers',
  },
  {
    id: 'transport', icon: 'ti ti-bus', name: 'Transport Users', count: 612,
    note: 'families on a route', last: 'Route 7 timing, 22 Jul', audience: 'Transport Users',
  },
  {
    id: 'hostel', icon: 'ti ti-building-community', name: 'Hostel Students', count: 284,
    note: 'and local guardians', last: 'Mess menu change, 20 Jul', audience: 'Hostel Students',
  },
  {
    id: 'library', icon: 'ti ti-books', name: 'Library Members', count: 1410,
    note: 'active borrowing card', last: 'Overdue reminder, 25 Jun', audience: 'Library Members',
  },
  {
    id: 'custom', icon: 'ti ti-bookmarks', name: 'Custom Groups', count: 318,
    note: '“Parents with dues”', last: 'First reminder, 24 Jul', audience: 'Custom Groups',
  },
  {
    id: 'manual', icon: 'ti ti-keyboard', name: 'Manual Numbers', count: 0,
    note: 'typed in one by one', last: 'Vendor reminder, 11 Jul', audience: 'Custom Groups',
  },
  {
    id: 'imported', icon: 'ti ti-file-import', name: 'Imported Contacts', count: 0,
    note: 'from CSV or Excel', last: 'Alumni list, 03 Jun', audience: 'Custom Groups',
  },
];

/** The group the composer opens on, which is what makes the strip read 318. */
export const DEFAULT_SELECTION = ['custom'];

export const smsTemplates: SmsTemplate[] = [
  {
    preview: '{{student_name}} was marked absent…', category: 'Attendance', name: 'Attendance Alert',
    fields: ['{{student_name}}', '{{date}}'], characters: 118, action: 'edit',
  },
  {
    preview: 'Term fee of Rs. {{fee_amount}} is due…', category: 'Fees', name: 'Fee Reminder',
    fields: ['{{parent_name}}', '{{fee_amount}}', '{{due_date}}'], characters: 187, action: 'copy',
  },
  {
    preview: '{{exam_name}} begins on {{date}}…', category: 'Examination', name: 'Exam Notification',
    fields: ['{{exam_name}}', '{{class}}', '{{date}}'], characters: 142, action: 'edit',
  },
  {
    preview: 'School will remain closed on…', category: 'Holiday', name: 'Holiday Notice',
    fields: ['{{date}}', '{{reason}}'], characters: 106, action: 'copy',
  },
  {
    preview: 'URGENT: {{message}}', category: 'Emergency', name: 'Emergency Alert',
    fields: ['{{message}}'], characters: 92, action: 'edit',
  },
  {
    preview: 'PTA meeting on {{date}} at {{time}}', category: 'PTA', name: 'PTA Meeting',
    fields: ['{{parent_name}}', '{{date}}', '{{time}}'], characters: 134, action: 'copy',
  },
  {
    preview: 'Happy birthday, {{student_name}}!', category: 'Greetings', name: 'Birthday Wishes',
    fields: ['{{student_name}}'], characters: 88, action: 'edit',
  },
  {
    preview: 'Admission confirmed for…', category: 'Admissions', name: 'Admission Confirmation',
    fields: ['{{student_name}}', '{{class}}', '{{admission_no}}'], characters: 156, action: 'copy',
  },
  {
    preview: '{{exam_name}} results are published', category: 'Results', name: 'Result Published',
    fields: ['{{student_name}}', '{{exam_name}}'], characters: 128, action: 'edit',
  },
  {
    preview: 'Route {{route}} is running late…', category: 'Transport', name: 'Transport Delay',
    fields: ['{{transport_route}}', '{{delay_mins}}'], characters: 114, action: 'copy',
  },
  {
    preview: 'Payment of Rs. {{amount}} received', category: 'Fees', name: 'Payment Confirmation',
    fields: ['{{fee_amount}}', '{{receipt_no}}'], characters: 144, action: 'edit',
  },
  {
    preview: '{{book}} is overdue since…', category: 'Library', name: 'Library Reminder',
    fields: ['{{student_name}}', '{{book}}', '{{due_date}}'], characters: 132, action: 'copy',
  },
];

/** The body the composer opens with — the fee reminder, 187 characters expanded. */
export const DEFAULT_BODY = 'Dear {{parent_name}}, the term-2 fee of Rs. {{fee_amount}} for {{student_name}} ({{class}}-{{section}}) is due on 10 Aug. Pay via the parent portal to avoid a late fee. - Karkaii';

export const DEFAULT_TITLE = 'Term-2 fee — final reminder';

/** The three recipients the preview resolves against. */
export interface PreviewRecipient {
  name: string;
  parentName: string;
  studentName: string;
  className: string;
  section: string;
  feeAmount: string;
  mobile: string;
  note: string;
}

export const previewRecipients: PreviewRecipient[] = [
  {
    name: 'Rahul Menon', parentName: 'Rahul Menon', studentName: 'Aarav Menon',
    className: '7', section: 'B', feeAmount: '18,500',
    mobile: '+91 98…43', note: 'Parent of Aarav Menon, 7-B',
  },
  {
    name: 'Sneha Iyer', parentName: 'Sneha Iyer', studentName: 'Diya Iyer',
    className: '4', section: 'A', feeAmount: '16,200',
    mobile: '+91 90…17', note: 'Parent of Diya Iyer, 4-A',
  },
  {
    name: 'Ayesha Khan', parentName: 'Ayesha Khan', studentName: 'Zoya Sheikh',
    className: '6', section: 'B', feeAmount: '15,400',
    mobile: '+91 87…02', note: 'Parent of Zoya Sheikh, 6-B',
  },
];

/** One recipient's values substituted into the body. */
export const renderFor = (body: string, who: PreviewRecipient): string =>
  body
    .split('{{parent_name}}').join(who.parentName)
    .split('{{student_name}}').join(who.studentName)
    .split('{{class}}').join(who.className)
    .split('{{section}}').join(who.section)
    .split('{{fee_amount}}').join(who.feeAmount)
    .split('{{admission_no}}').join('AD9892431')
    .split('{{due_date}}').join('10 Aug');

/* --------------------------------- Bulk ------------------------------------ */

export const BULK_FILE = 'alumni-2026.csv';
export const BULK_UPLOADED = '03 Jun';
export const BULK_VALIDATION = validationOf(1204, 41, 18, 23);

/* --------------------------------- Logs ------------------------------------- */

export const logStateBadge: Record<LogState, string> = {
  Delivered: 'message-status-badge is-live',
  Failed: 'message-status-badge is-urgent',
  'Pending DLR': 'message-status-badge is-high',
  Queued: 'message-status-badge is-scheduled',
  Rejected: 'message-status-badge is-urgent',
};

export const logStateIcon: Record<LogState, string> = {
  Delivered: 'ti ti-checks',
  Failed: 'ti ti-x',
  'Pending DLR': 'ti ti-clock',
  Queued: 'ti ti-hourglass',
  Rejected: 'ti ti-phone-off',
};

export const logs: LogEntry[] = [
  {
    title: 'Rainfall closure — school shut Thursday', icon: 'ti ti-users',
    audience: 'Entire school', detail: '2,940 recipients · bulk',
    state: 'Delivered', gateway: 'Kaleyra', at: '29 Jul 2026, 06:14 pm', reason: '', failed: 0,
  },
  {
    title: 'Term-2 fee reminder', icon: 'ti ti-user',
    audience: 'Mr. Rahul Menon', detail: 'Parent · +91 98…43',
    state: 'Failed', gateway: 'Kaleyra', at: '24 Jul 2026, 07:31 am',
    reason: 'Absent subscriber — handset unreachable for 24 hours. Two retries exhausted.',
    failed: 1,
  },
  {
    title: 'Exam circular — Term-2 datesheet', icon: 'ti ti-school',
    audience: 'Students, Grades 6–12', detail: '1,920 recipients · bulk',
    state: 'Delivered', gateway: 'MSG91', at: '26 Jul 2026, 09:02 am', reason: '', failed: 0,
  },
  {
    title: 'Attendance alert — absent today', icon: 'ti ti-user',
    audience: 'Ms. Sneha Iyer', detail: 'Parent · +91 90…17',
    state: 'Pending DLR', gateway: 'Kaleyra', at: '02 Aug 2026, 10:15 am', reason: '', failed: 0,
  },
  {
    title: 'Library overdue reminder', icon: 'ti ti-user',
    audience: 'Ayesha Khan', detail: 'Student · +91 87…02',
    state: 'Rejected', gateway: 'MSG91', at: '25 Jun 2026, 09:00 am',
    reason: 'Number on the DND registry and this send used the promotional route.',
    failed: 1,
  },
  {
    title: 'Route 7 pickup timing change', icon: 'ti ti-bus',
    audience: 'Transport users, Route 7', detail: '84 recipients · bulk',
    state: 'Queued', gateway: 'Kaleyra', at: '02 Aug 2026, 05:00 pm', reason: '', failed: 0,
  },
  {
    title: 'Payment received — receipt 40219', icon: 'ti ti-user',
    audience: 'Mr. Vikram Rao', detail: 'Parent · +91 99…58',
    state: 'Delivered', gateway: 'Twilio', at: '01 Aug 2026, 02:47 pm', reason: '', failed: 0,
  },
  {
    title: 'PTA meeting slots now open', icon: 'ti ti-users',
    audience: 'Parents, Grades 6–10', detail: '720 recipients · bulk',
    state: 'Delivered', gateway: 'Kaleyra', at: '18 Jul 2026, 11:20 am', reason: '', failed: 11,
  },
];

export const LOG_DELIVERED = 2908;
export const LOG_FAILED = 18;

/* ------------------------------ The sent send ------------------------------- */

/** The send the reader and the delivery report open on. */
export const SENT = {
  title: 'Term-2 fee reminder',
  template: 'Fee Reminder',
  submitted: 910,
  delivered: 892,
  failedCount: 18,
  pending: 0,
  segments: 2,
  senderId: 'PRSKUL',
  gateway: 'Kaleyra',
  sentBy: 'Ms. Latha Rao',
  sentAt: '24 Jul 2026, 07:30 am',
  leftGateway: '07:30:04 am',
  lastDlr: '07:34:51 am',
  language: 'English',
  encoding: 'GSM-7' as Encoding,
  priority: 'Transactional',
  expiry: '24 hours',
  retries: '2 attempts, 10 min apart',
  timeZone: 'IST (UTC +5:30)',
};

export const failureReasons: FailureReason[] = [
  { label: 'Absent subscriber', note: 'Handset unreachable for 24 hours', count: 9 },
  { label: 'Invalid number', note: 'Disconnected or never issued', count: 5 },
  { label: 'DND registry', note: 'Would need the transactional route', count: 3 },
  { label: 'Operator rejected', note: 'Sender ID not permitted on that circle', count: 1 },
];

export const sentRecipients: SentRecipient[] = [
  { name: 'Mr. Rahul Menon', note: 'Parent of Aarav Menon, 7-B', mobile: '+91 98…43', state: 'Delivered' },
  { name: 'Ms. Sneha Iyer', note: 'Parent of Diya Iyer, 4-A', mobile: '+91 90…17', state: 'Delivered' },
  { name: 'Mr. Vikram Rao', note: 'Parent of Ishaan Rao, 10-C', mobile: '+91 99…58', state: 'Delivered' },
  { name: 'Mrs. Fatima Sheikh', note: 'Parent of Zoya Sheikh, 6-B', mobile: '+91 87…02', state: 'Failed' },
  { name: 'Mr. Joseph Thomas', note: 'Parent of Ann Thomas, 9-A', mobile: '+91 94…76', state: 'Failed' },
];

export const sendHistory: HistoryEntry[] = [
  { title: 'Term-2 fee reminder', meta: '24 Jul 2026 · 2 segments', result: '892 / 910' },
  { title: 'Term-2 fee due notice', meta: '08 Jul 2026 · 2 segments', result: '904 / 910' },
  { title: 'Term-1 final reminder', meta: '05 Jun 2026 · 2 segments', result: '874 / 902' },
  { title: 'Payment confirmations', meta: 'Rolling · 1 segment each', result: '592 sent' },
];

/* ------------------------------ Quick actions ------------------------------- */

export const quickActions: QuickAction[] = [
  { icon: 'ti ti-message-2', title: 'Compose SMS', note: 'Write and send a single message' },
  { icon: 'ti ti-users-plus', title: 'Bulk SMS', note: 'Send to an uploaded list' },
  { icon: 'ti ti-file-import', title: 'Import Recipients', note: 'CSV or Excel, validated on upload' },
  { icon: 'ti ti-template', title: 'Manage Templates', note: 'Twelve approved templates' },
  { icon: 'ti ti-history', title: 'View SMS Logs', note: 'Full history and delivery reports' },
  { icon: 'ti ti-bookmarks', title: 'Create Recipient Group', note: 'Save a filter as a reusable group' },
  { icon: 'ti ti-clock-play', title: 'Schedule SMS', note: 'Set a send date, time and zone' },
  { icon: 'ti ti-settings', title: 'SMS Settings', note: 'Gateways, sender IDs and credits' },
];

/* --------------------------------- Filters ---------------------------------- */

export const searchIndexOf = (row: RecipientGroup): string =>
  [row.name, row.note, row.audience, row.last].join(' ').toLowerCase();
