export type Category =
  | 'Fees' | 'Attendance' | 'Examination' | 'Holiday' | 'Emergency'
  | 'PTA' | 'Transport' | 'Library' | 'Greetings' | 'Admissions' | 'Results';

export type Route = 'Transactional' | 'Promotional';

export type Encoding = 'GSM-7' | 'Unicode';

export type Status = 'Approved' | 'Pending registration' | 'Rejected' | 'Draft';

export interface SmsTemplate {
  id: string;
  name: string;
  category: Category;
  body: string;
  route: Route;
  encoding: Encoding;
  senderId: string;
  /** Empty until it has been submitted to the operator. */
  submittedOn: string;
  /** Empty until the registration comes back. */
  approvedOn: string;
  rejectedReason: string;
  updatedOn: string;
  updatedBy: string;
  /** Times this template has been sent from. */
  uses: number;
  lastUsed: string;
  shared: boolean;
}

/* --------------------------------- Tints ----------------------------------- */

export const statusBadge: Record<Status, string> = {
  Approved: 'badge badge-soft-success',
  'Pending registration': 'badge badge-soft-warning',
  Rejected: 'badge badge-soft-danger',
  Draft: 'badge badge-soft-secondary',
};

export const statusPill: Record<Status, string> = {
  Approved: 'is-completed',
  'Pending registration': 'is-pending',
  Rejected: 'is-blocked',
  Draft: 'is-review',
};

export const categoryBadge: Record<Category, string> = {
  Fees: 'badge badge-soft-warning',
  Attendance: 'badge badge-soft-info',
  Examination: 'badge badge-soft-secondary',
  Holiday: 'badge badge-soft-success',
  Emergency: 'badge badge-soft-danger',
  PTA: 'badge badge-soft-primary',
  Transport: 'badge badge-soft-info',
  Library: 'badge badge-soft-secondary',
  Greetings: 'badge badge-soft-purple',
  Admissions: 'badge badge-soft-primary',
  Results: 'badge badge-soft-success',
};

export const categoryIcon: Record<Category, string> = {
  Fees: 'ti ti-report-money',
  Attendance: 'ti ti-calendar-x',
  Examination: 'ti ti-file-certificate',
  Holiday: 'ti ti-beach',
  Emergency: 'ti ti-alert-triangle',
  PTA: 'ti ti-users',
  Transport: 'ti ti-bus',
  Library: 'ti ti-books',
  Greetings: 'ti ti-cake',
  Admissions: 'ti ti-user-plus',
  Results: 'ti ti-award',
};

export const routeBadge: Record<Route, string> = {
  Transactional: 'badge badge-soft-primary',
  Promotional: 'badge badge-soft-secondary',
};

/* ------------------------------ Filter options ------------------------------ */

export const categoryOptions: Category[] = [
  'Fees', 'Attendance', 'Examination', 'Holiday', 'Emergency',
  'PTA', 'Transport', 'Library', 'Greetings', 'Admissions', 'Results',
];

export const routeOptions: Route[] = ['Transactional', 'Promotional'];

export const statusOptions: Status[] = ['Approved', 'Pending registration', 'Rejected', 'Draft'];

export const encodingOptions: Encoding[] = ['GSM-7', 'Unicode'];

export const senderOptions = ['PRSKUL', 'PRSKOL', 'SCHOOL'];

export const authorOptions = ['Ms. Latha Rao', 'Ms. Divya Nair', 'Mr. Arun Prakash'];

/* ------------------------------- Derivations -------------------------------- */

export const REGISTER_DATE = '2 Aug 2026';

export const RATE_PER_SEGMENT = 0.3;

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

export const segmentSize = (encoding: Encoding): number => (encoding === 'GSM-7' ? 160 : 70);

/**
 * The merge values the estimate assumes — the longest on record, so a template
 * never costs more after sending than it said it would.
 */
const longest: Record<string, string> = {
  '{{student_name}}': 'Aarav Menon',
  '{{parent_name}}': 'Rahul Menon',
  '{{class}}': '7',
  '{{section}}': 'B',
  '{{admission_no}}': 'AD9892431',
  '{{fee_amount}}': '18,500',
  '{{due_date}}': '10 Aug',
  '{{date}}': '10 Aug 2026',
  '{{time}}': '09:00 am',
  '{{exam_name}}': 'Term-2 Examination',
  '{{reason}}': 'regional public holiday',
  '{{message}}': 'the school will close at 12:30 pm today',
  '{{amount}}': '18,500',
  '{{receipt_no}}': '40219',
  '{{book}}': 'The Wind in the Willows',
  '{{route}}': 'Route 11',
  '{{transport_route}}': 'Route 11',
  '{{delay_mins}}': '20',
};

export const expandOf = (body: string): string =>
  Object.entries(longest).reduce((text, [token, value]) => text.split(token).join(value), body);

export const lengthOf = (row: SmsTemplate): number => expandOf(row.body).length;

export const segmentsOf = (length: number, encoding: Encoding): number =>
  Math.max(1, Math.ceil(length / segmentSize(encoding)));

export const templateSegmentsOf = (row: SmsTemplate): number =>
  segmentsOf(lengthOf(row), row.encoding);

export const remainingOf = (row: SmsTemplate): number =>
  templateSegmentsOf(row) * segmentSize(row.encoding) - lengthOf(row);

/** What one recipient costs on this template. */
export const costPerSendOf = (row: SmsTemplate): number =>
  Number((templateSegmentsOf(row) * RATE_PER_SEGMENT).toFixed(2));

export const money = (amount: number): string =>
  `₹${amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

/** The merge fields the body actually names. */
export const fieldsOf = (row: SmsTemplate): string[] =>
  Object.keys(longest).filter((token) => row.body.includes(token));

export const fieldCountOf = (row: SmsTemplate): number => fieldsOf(row).length;

/**
 * Where the template stands with the operator: drafted, submitted, approved or
 * turned back. An edit after approval is a resubmission, which is why the
 * approval date is cleared rather than kept.
 */
export const statusOf = (row: SmsTemplate): Status => {
  if (row.rejectedReason) return 'Rejected';
  if (!row.submittedOn) return 'Draft';
  return row.approvedOn ? 'Approved' : 'Pending registration';
};

export const statusSubLabelOf = (row: SmsTemplate): string => {
  const status = statusOf(row);
  if (status === 'Draft') return 'Not submitted';
  if (status === 'Rejected') return row.rejectedReason;
  if (status === 'Pending registration') {
    const waiting = daysBetween(row.submittedOn, REGISTER_DATE);
    return waiting <= 0 ? 'Submitted today' : `Waiting ${dayText(waiting)}`;
  }
  return `Registered ${row.approvedOn}`;
};

/** Only an approved template can be sent from. */
export const isUsable = (row: SmsTemplate): boolean => statusOf(row) === 'Approved';

export const isMultiSegment = (row: SmsTemplate): boolean => templateSegmentsOf(row) > 1;

export const lastUsedLabelOf = (row: SmsTemplate): string => {
  if (!row.lastUsed) return 'Never sent';
  const days = daysBetween(row.lastUsed, REGISTER_DATE);
  if (days === 0) return 'Sent today';
  return `${dayText(days)} ago`;
};

export interface Pair {
  label: string;
  value: string;
}

export const detailPairsOf = (row: SmsTemplate): Pair[] => [
  { label: 'Template ID', value: row.id },
  { label: 'Category', value: row.category },
  { label: 'Route', value: row.route },
  { label: 'Sender ID', value: row.senderId },
  { label: 'Encoding', value: row.encoding },
  { label: 'Available to', value: row.shared ? 'All staff' : 'Administrators only' },
];

export const usagePairsOf = (row: SmsTemplate): Pair[] => [
  { label: 'Characters', value: `${lengthOf(row)} at longest expansion` },
  { label: 'Segments', value: String(templateSegmentsOf(row)) },
  { label: 'Left in last segment', value: String(remainingOf(row)) },
  { label: 'Cost per recipient', value: money(costPerSendOf(row)) },
  { label: 'Merge fields', value: String(fieldCountOf(row)) },
  { label: 'Sends', value: `${row.uses} · ${lastUsedLabelOf(row)}` },
];

export const registrationPairsOf = (row: SmsTemplate): Pair[] => [
  { label: 'Status', value: statusOf(row) },
  { label: 'Submitted', value: row.submittedOn || 'Not submitted' },
  { label: 'Approved', value: row.approvedOn || '—' },
  { label: 'Last edited', value: `${row.updatedOn} · ${row.updatedBy}` },
];

export const searchIndexOf = (row: SmsTemplate): string =>
  [row.id, row.name, row.category, row.body, row.route, row.senderId, statusOf(row)]
    .join(' ')
    .toLowerCase();

/* --------------------------------- Summary ---------------------------------- */

export const TOTAL_COUNT = 12;

/* ---------------------------------- Rows ------------------------------------ */

export const templates: SmsTemplate[] = [
  {
    id: 'TPL-001', name: 'Attendance Alert', category: 'Attendance',
    body: '{{student_name}} was marked absent for {{date}}. If this is unexpected, please contact the class teacher. - Preskool',
    route: 'Transactional', encoding: 'GSM-7', senderId: 'PRSKUL',
    submittedOn: '12 Jan 2026', approvedOn: '14 Jan 2026', rejectedReason: '',
    updatedOn: '14 Jan 2026', updatedBy: 'Ms. Divya Nair',
    uses: 486, lastUsed: '2 Aug 2026', shared: true,
  },
  {
    id: 'TPL-002', name: 'Fee Reminder', category: 'Fees',
    body: 'Dear {{parent_name}}, the term-2 fee of Rs. {{fee_amount}} for {{student_name}} ({{class}}-{{section}}) is due on {{due_date}}. Pay via the parent portal to avoid a late fee. - Preskool',
    route: 'Transactional', encoding: 'GSM-7', senderId: 'PRSKUL',
    submittedOn: '08 Jan 2026', approvedOn: '10 Jan 2026', rejectedReason: '',
    updatedOn: '24 Jul 2026', updatedBy: 'Ms. Latha Rao',
    uses: 32, lastUsed: '24 Jul 2026', shared: true,
  },
  {
    id: 'TPL-003', name: 'Exam Notification', category: 'Examination',
    body: '{{exam_name}} begins on {{date}} for {{class}}. Hall tickets are on the parent portal. Report twenty minutes early with your ID card. - Preskool',
    route: 'Transactional', encoding: 'GSM-7', senderId: 'PRSKUL',
    submittedOn: '15 Jan 2026', approvedOn: '17 Jan 2026', rejectedReason: '',
    updatedOn: '26 Jul 2026', updatedBy: 'Ms. Divya Nair',
    uses: 18, lastUsed: '26 Jul 2026', shared: true,
  },
  {
    id: 'TPL-004', name: 'Holiday Notice', category: 'Holiday',
    body: 'School will remain closed on {{date}} for {{reason}}. Classes resume the following working day. - Preskool',
    route: 'Transactional', encoding: 'GSM-7', senderId: 'PRSKUL',
    submittedOn: '05 Jan 2026', approvedOn: '07 Jan 2026', rejectedReason: '',
    updatedOn: '08 Jul 2026', updatedBy: 'Ms. Latha Rao',
    uses: 9, lastUsed: '08 Jul 2026', shared: true,
  },
  {
    id: 'TPL-005', name: 'Emergency Alert', category: 'Emergency',
    body: 'URGENT: {{message}} Please follow the school app for updates. - Preskool',
    route: 'Transactional', encoding: 'GSM-7', senderId: 'PRSKUL',
    submittedOn: '05 Jan 2026', approvedOn: '05 Jan 2026', rejectedReason: '',
    updatedOn: '29 Jul 2026', updatedBy: 'Ms. Latha Rao',
    uses: 4, lastUsed: '29 Jul 2026', shared: true,
  },
  {
    id: 'TPL-006', name: 'PTA Meeting', category: 'PTA',
    body: 'Dear {{parent_name}}, the PTA meeting is on {{date}} at {{time}}. Book your slot on the parent portal. - Preskool',
    route: 'Transactional', encoding: 'GSM-7', senderId: 'PRSKUL',
    submittedOn: '20 Jan 2026', approvedOn: '22 Jan 2026', rejectedReason: '',
    updatedOn: '18 Jul 2026', updatedBy: 'Ms. Divya Nair',
    uses: 14, lastUsed: '18 Jul 2026', shared: true,
  },
  {
    id: 'TPL-007', name: 'Birthday Wishes', category: 'Greetings',
    body: 'Happy birthday, {{student_name}}! Wishing you a wonderful year ahead. - Preskool',
    route: 'Promotional', encoding: 'GSM-7', senderId: 'PRSKOL',
    submittedOn: '02 Feb 2026', approvedOn: '05 Feb 2026', rejectedReason: '',
    updatedOn: '05 Feb 2026', updatedBy: 'Mr. Arun Prakash',
    uses: 214, lastUsed: '2 Aug 2026', shared: true,
  },
  {
    id: 'TPL-008', name: 'Admission Confirmation', category: 'Admissions',
    body: 'Admission confirmed for {{student_name}} in {{class}}. Admission number {{admission_no}}. Reporting details follow by email. - Preskool',
    route: 'Transactional', encoding: 'GSM-7', senderId: 'PRSKUL',
    submittedOn: '10 Feb 2026', approvedOn: '12 Feb 2026', rejectedReason: '',
    updatedOn: '12 Feb 2026', updatedBy: 'Ms. Latha Rao',
    uses: 128, lastUsed: '30 Jul 2026', shared: false,
  },
  {
    id: 'TPL-009', name: 'Result Published', category: 'Results',
    body: '{{exam_name}} results are published for {{student_name}}. View the report card on the parent portal. - Preskool',
    route: 'Transactional', encoding: 'GSM-7', senderId: 'PRSKUL',
    submittedOn: '28 Jul 2026', approvedOn: '', rejectedReason: '',
    updatedOn: '28 Jul 2026', updatedBy: 'Ms. Divya Nair',
    uses: 0, lastUsed: '', shared: true,
  },
  {
    id: 'TPL-010', name: 'Transport Delay', category: 'Transport',
    body: '{{transport_route}} is running late by {{delay_mins}} minutes this morning. The bus will reach your stop shortly. - Preskool',
    route: 'Transactional', encoding: 'GSM-7', senderId: 'PRSKUL',
    submittedOn: '18 Mar 2026', approvedOn: '20 Mar 2026', rejectedReason: '',
    updatedOn: '22 Jul 2026', updatedBy: 'Mr. Arun Prakash',
    uses: 63, lastUsed: '22 Jul 2026', shared: true,
  },
  {
    id: 'TPL-011', name: 'Payment Confirmation', category: 'Fees',
    body: 'Payment of Rs. {{amount}} received against receipt {{receipt_no}}. Thank you. - Preskool',
    route: 'Transactional', encoding: 'GSM-7', senderId: 'PRSKUL',
    submittedOn: '08 Jan 2026', approvedOn: '10 Jan 2026', rejectedReason: '',
    updatedOn: '01 Aug 2026', updatedBy: 'Mr. Arun Prakash',
    uses: 592, lastUsed: '1 Aug 2026', shared: true,
  },
  {
    id: 'TPL-012', name: 'Library Reminder', category: 'Library',
    body: '{{book}} borrowed by {{student_name}} is overdue since {{due_date}}. Please return it to the senior library this week to avoid a fine. - Preskool',
    route: 'Promotional', encoding: 'GSM-7', senderId: 'PRSKOL',
    submittedOn: '25 Jun 2026', approvedOn: '', rejectedReason: 'Promotional route not permitted for overdue notices; resubmit on the transactional route.',
    updatedOn: '25 Jun 2026', updatedBy: 'Mr. Arun Prakash',
    uses: 11, lastUsed: '25 Jun 2026', shared: false,
  },
];
