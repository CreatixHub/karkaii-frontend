export type Category = 'Utility' | 'Marketing' | 'Authentication';

export type State = 'Approved' | 'In review' | 'Rejected' | 'Paused' | 'Draft';

export type Quality = 'High' | 'Medium' | 'Low' | 'Not rated';

export type ButtonKind = 'None' | 'Visit website' | 'Call phone number' | 'Quick reply';

export interface WhatsappTemplate {
  id: string;
  /** The Meta name — lower case with underscores. */
  name: string;
  /** What the school calls it. */
  label: string;
  category: Category;
  languages: string[];

  header: string;
  body: string;
  footer: string;
  button: ButtonKind;
  /** Set when the template carries a stored header image. */
  headerMedia: string;

  /** Empty until it has been submitted. */
  submittedOn: string;
  approvedOn: string;
  rejectedReason: string;
  paused: boolean;

  quality: Quality;
  /** Broadcasts sent from this template. */
  uses: number;
  lastUsed: string;
  updatedOn: string;
  updatedBy: string;
}

/* --------------------------------- Tints ----------------------------------- */

export const stateBadge: Record<State, string> = {
  Approved: 'badge badge-soft-success',
  'In review': 'badge badge-soft-warning',
  Rejected: 'badge badge-soft-danger',
  Paused: 'badge badge-soft-secondary',
  Draft: 'badge badge-soft-secondary',
};

export const statePill: Record<State, string> = {
  Approved: 'is-completed',
  'In review': 'is-pending',
  Rejected: 'is-blocked',
  Paused: 'is-suspended',
  Draft: 'is-review',
};

export const stateIcon: Record<State, string> = {
  Approved: 'ti ti-circle-check',
  'In review': 'ti ti-hourglass',
  Rejected: 'ti ti-x',
  Paused: 'ti ti-player-pause',
  Draft: 'ti ti-pencil',
};

export const categoryBadge: Record<Category, string> = {
  Utility: 'badge badge-soft-primary',
  Marketing: 'badge badge-soft-purple',
  Authentication: 'badge badge-soft-info',
};

export const qualityBadge: Record<Quality, string> = {
  High: 'badge badge-soft-success',
  Medium: 'badge badge-soft-warning',
  Low: 'badge badge-soft-danger',
  'Not rated': 'badge badge-soft-secondary',
};

/* ------------------------------ Filter options ------------------------------ */

export const categoryOptions: Category[] = ['Utility', 'Marketing', 'Authentication'];

export const stateOptions: State[] = ['Approved', 'In review', 'Rejected', 'Paused', 'Draft'];

export const qualityOptions: Quality[] = ['High', 'Medium', 'Low', 'Not rated'];

export const languageOptions = ['English', 'Hindi', 'Tamil', 'Malayalam'];

export const buttonOptions: ButtonKind[] = [
  'None', 'Visit website', 'Call phone number', 'Quick reply',
];

export const authorOptions = ['Ms. Latha Rao', 'Ms. Divya Nair', 'Mr. Arun Prakash'];

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

export const dayText = (days: number): string =>
  `${Math.abs(days)} ${Math.abs(days) === 1 ? 'day' : 'days'}`;

/** The placeholders the body actually names. */
export const placeholdersOf = (row: WhatsappTemplate): string[] =>
  row.body.match(/\{\{\d+\}\}/g) ?? [];

export const variablesOf = (row: WhatsappTemplate): number => placeholdersOf(row).length;

/** Where the template stands with Meta. */
export const stateOf = (row: WhatsappTemplate): State => {
  if (row.rejectedReason) return 'Rejected';
  if (!row.submittedOn) return 'Draft';
  if (!row.approvedOn) return 'In review';
  return row.paused ? 'Paused' : 'Approved';
};

/** Only an approved, unpaused template may open a conversation. */
export const isUsable = (row: WhatsappTemplate): boolean => stateOf(row) === 'Approved';

export const reviewAgeOf = (row: WhatsappTemplate): number =>
  (row.submittedOn ? daysBetween(row.submittedOn, REGISTER_DATE) : 0);

export const statusSubLabelOf = (row: WhatsappTemplate): string => {
  const state = stateOf(row);
  if (state === 'Draft') return 'Never submitted';
  if (state === 'Rejected') return row.rejectedReason;
  if (state === 'In review') {
    const age = reviewAgeOf(row);
    return age <= 0 ? 'Submitted today' : `In review ${dayText(age)}`;
  }
  if (state === 'Paused') return 'Paused by Meta on quality';
  return `Approved ${row.approvedOn}`;
};

export const lastUsedLabelOf = (row: WhatsappTemplate): string => {
  if (!row.lastUsed) return 'Never used';
  const days = daysBetween(row.lastUsed, REGISTER_DATE);
  return days === 0 ? 'Used today' : `${dayText(days)} ago`;
};

/** A template Meta has rated poorly is at risk of being paused. */
export const isAtRisk = (row: WhatsappTemplate): boolean =>
  row.quality === 'Low' || row.quality === 'Medium' || row.paused;

export const isMultilingual = (row: WhatsappTemplate): boolean => row.languages.length > 1;

export interface Pair {
  label: string;
  value: string;
}

export const detailPairsOf = (row: WhatsappTemplate): Pair[] => [
  { label: 'Template name', value: row.name },
  { label: 'Category', value: row.category },
  { label: 'Languages', value: row.languages.join(', ') },
  { label: 'Button', value: row.button },
  { label: 'Header media', value: row.headerMedia || 'None' },
  { label: 'Variables', value: String(variablesOf(row)) },
];

export const reviewPairsOf = (row: WhatsappTemplate): Pair[] => [
  { label: 'State', value: stateOf(row) },
  { label: 'Submitted', value: row.submittedOn || 'Not submitted' },
  { label: 'Approved', value: row.approvedOn || '—' },
  { label: 'Quality rating', value: row.quality },
  { label: 'Last edited', value: `${row.updatedOn} · ${row.updatedBy}` },
];

export const usagePairsOf = (row: WhatsappTemplate): Pair[] => [
  { label: 'Broadcasts', value: String(row.uses) },
  { label: 'Last used', value: lastUsedLabelOf(row) },
  { label: 'Can be sent', value: isUsable(row) ? 'Yes' : 'No — not approved' },
];

export const searchIndexOf = (row: WhatsappTemplate): string =>
  [row.id, row.name, row.label, row.category, row.body, row.languages.join(' '), stateOf(row)]
    .join(' ')
    .toLowerCase();

/* --------------------------------- Summary ---------------------------------- */

export const TOTAL_COUNT = 10;

/* ---------------------------------- Rows ------------------------------------ */

export const templates: WhatsappTemplate[] = [
  {
    id: 'WAT-01', name: 'admission_confirmation', label: 'Admission Confirmation',
    category: 'Utility', languages: ['English'],
    header: 'Admission confirmed',
    body: 'Admission confirmed for {{1}} in {{2}}. Reporting details follow by email.',
    footer: 'Karkaii', button: 'Visit website', headerMedia: '',
    submittedOn: '10 Feb 2026', approvedOn: '12 Feb 2026', rejectedReason: '', paused: false,
    quality: 'High', uses: 128, lastUsed: '30 Jul 2026',
    updatedOn: '12 Feb 2026', updatedBy: 'Ms. Latha Rao',
  },
  {
    id: 'WAT-02', name: 'fee_reminder_term2', label: 'Fee Reminder',
    category: 'Utility', languages: ['English', 'Hindi'],
    header: '',
    body: 'Dear {{1}}, the term fee of Rs. {{2}} is due on {{3}}. Pay via the parent portal to avoid a late fee.',
    footer: 'Karkaii', button: 'Visit website', headerMedia: 'fee-reminder-header.jpg',
    submittedOn: '08 Jan 2026', approvedOn: '10 Jan 2026', rejectedReason: '', paused: false,
    quality: 'High', uses: 32, lastUsed: '24 Jul 2026',
    updatedOn: '24 Jul 2026', updatedBy: 'Ms. Latha Rao',
  },
  {
    id: 'WAT-03', name: 'attendance_alert', label: 'Attendance Alert',
    category: 'Utility', languages: ['English'],
    header: '',
    body: '{{1}} was marked absent on {{2}}. If this is unexpected, please contact the class teacher.',
    footer: 'Karkaii', button: 'None', headerMedia: '',
    submittedOn: '12 Jan 2026', approvedOn: '14 Jan 2026', rejectedReason: '', paused: false,
    quality: 'High', uses: 486, lastUsed: '2 Aug 2026',
    updatedOn: '14 Jan 2026', updatedBy: 'Ms. Divya Nair',
  },
  {
    id: 'WAT-04', name: 'exam_reminder', label: 'Exam Reminder',
    category: 'Utility', languages: ['English'],
    header: 'Examination schedule',
    body: '{{1}} begins on {{2}}. Hall tickets are on the parent portal; report twenty minutes early.',
    footer: 'Karkaii', button: 'Visit website', headerMedia: 'exam-datesheet-banner.jpg',
    submittedOn: '15 Jan 2026', approvedOn: '17 Jan 2026', rejectedReason: '', paused: false,
    quality: 'High', uses: 18, lastUsed: '26 Jul 2026',
    updatedOn: '26 Jul 2026', updatedBy: 'Ms. Divya Nair',
  },
  {
    id: 'WAT-05', name: 'pta_meeting', label: 'PTA Meeting',
    category: 'Utility', languages: ['English'],
    header: '',
    body: 'PTA meeting on {{1}} at {{2}}. Your slot is {{3}}. Book or change it on the parent portal.',
    footer: 'Karkaii', button: 'Visit website', headerMedia: '',
    /* Submitted five days ago and still with Meta. */
    submittedOn: '28 Jul 2026', approvedOn: '', rejectedReason: '', paused: false,
    quality: 'Not rated', uses: 0, lastUsed: '',
    updatedOn: '28 Jul 2026', updatedBy: 'Ms. Divya Nair',
  },
  {
    id: 'WAT-06', name: 'birthday_wishes', label: 'Birthday Wishes',
    category: 'Marketing', languages: ['English', 'Tamil'],
    header: '',
    body: 'Happy birthday, {{1}}! Wishing you a wonderful year ahead from everyone at Karkaii.',
    footer: 'Karkaii', button: 'None', headerMedia: '',
    submittedOn: '02 Feb 2026', approvedOn: '05 Feb 2026', rejectedReason: '', paused: false,
    quality: 'Medium', uses: 214, lastUsed: '2 Aug 2026',
    updatedOn: '05 Feb 2026', updatedBy: 'Mr. Arun Prakash',
  },
  {
    id: 'WAT-07', name: 'holiday_notice', label: 'Holiday Notice',
    category: 'Utility', languages: ['English', 'Hindi'],
    header: '',
    body: 'School will remain closed on {{1}} for {{2}}. Classes resume the following working day.',
    footer: 'Karkaii', button: 'None', headerMedia: '',
    submittedOn: '05 Jan 2026', approvedOn: '07 Jan 2026', rejectedReason: '', paused: false,
    quality: 'High', uses: 9, lastUsed: '08 Jul 2026',
    updatedOn: '08 Jul 2026', updatedBy: 'Ms. Latha Rao',
  },
  {
    id: 'WAT-08', name: 'emergency_alert', label: 'Emergency Alert',
    category: 'Utility', languages: ['English'],
    header: 'URGENT',
    body: 'URGENT: {{1}} Please follow the school app for updates.',
    footer: 'Karkaii', button: 'None', headerMedia: '',
    submittedOn: '05 Jan 2026', approvedOn: '05 Jan 2026', rejectedReason: '', paused: false,
    quality: 'High', uses: 4, lastUsed: '29 Jul 2026',
    updatedOn: '29 Jul 2026', updatedBy: 'Ms. Latha Rao',
  },
  {
    id: 'WAT-09', name: 'transport_delay', label: 'Transport Delay',
    category: 'Utility', languages: ['English'],
    header: '',
    body: 'Route {{1}} is running late by {{2}} minutes this morning. The bus will reach your stop shortly.',
    footer: 'Karkaii', button: 'None', headerMedia: '',
    submittedOn: '18 Mar 2026', approvedOn: '20 Mar 2026', rejectedReason: '', paused: false,
    quality: 'High', uses: 63, lastUsed: '22 Jul 2026',
    updatedOn: '22 Jul 2026', updatedBy: 'Mr. Arun Prakash',
  },
  {
    id: 'WAT-10', name: 'result_published', label: 'Result Published',
    category: 'Utility', languages: ['English'],
    header: '',
    body: '{{1}} results are published. View the report card at {{2}}.',
    footer: 'Karkaii', button: 'Visit website', headerMedia: '',
    submittedOn: '16 Jul 2026', approvedOn: '',
    rejectedReason: 'Link domain unverified on the business account.',
    paused: false,
    quality: 'Not rated', uses: 0, lastUsed: '',
    updatedOn: '18 Jul 2026', updatedBy: 'Ms. Divya Nair',
  },
];
