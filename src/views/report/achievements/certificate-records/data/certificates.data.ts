import { addDays, daysBetween } from '../../../ai-insights/data/dates';
import { RUN_DATE } from '../../../ai-insights/data/registers';

export { RUN_DATE };

export const ACADEMIC_YEAR = '2026-2027';

/** Certificates on the register school-wide. */
export const TOTAL_CERTIFICATES = 412;

/**
 * The rest of the summary strip and the saved-view counts.
 *
 * These span the whole register of 412 and the grid carries eight, so they
 * cannot come off `certificates`. The shares the strip prints still derive:
 * the issued percentage and the verified-of-issued line are read against these
 * rather than typed a second time.
 */
export const ISSUED_TOTAL = 356;
export const PENDING_APPROVAL = 18;
export const VERIFIED_TOTAL = 341;
export const REISSUED = 23;
export const SUPERSEDED = 17;

export type Holder = 'Student' | 'Staff';
export type Status =
  | 'Pending Approval'
  | 'Approved'
  | 'Issued'
  | 'Reissued'
  | 'Superseded'
  | 'Revoked';

/** The certificate kinds the office issues, and how long each runs. */
export const CERTIFICATE_TYPES = [
  { id: 'merit', name: 'Merit Certificate', icon: 'ti ti-award', tint: 'warning', validYears: 5 },
  { id: 'participation', name: 'Participation Certificate', icon: 'ti ti-confetti', tint: 'info', validYears: 5 },
  { id: 'service', name: 'Service Certificate', icon: 'ti ti-briefcase', tint: 'teal', validYears: 5 },
  { id: 'bonafide', name: 'Bonafide Certificate', icon: 'ti ti-file-check', tint: 'primary', validYears: 1 },
  { id: 'transfer', name: 'Transfer Certificate', icon: 'ti ti-arrow-right-circle', tint: 'purple', validYears: 0 },
  { id: 'character', name: 'Character Certificate', icon: 'ti ti-user-check', tint: 'success', validYears: 3 },
];

export const typeOf = (id: string) =>
  CERTIFICATE_TYPES.find((entry) => entry.id === id) ?? CERTIFICATE_TYPES[0];

/** The checks a certificate has to pass before it can be called verified. */
export const VERIFICATION_CHECKS = ['Record match', 'Signature on file', 'Serial registered'];

export interface Certificate {
  id: string;
  holder: string;
  holderRef: string;
  holderClass: string;
  holderType: Holder;
  typeId: string;
  reason: string;
  /** The day it was signed, or null when it has not been. */
  issuedOn: string | null;
  issuedBy: string | null;
  issuerRole: string | null;
  /** How many of the checks have passed, and when they were last run. */
  checksPassed: number;
  checkedOn: string | null;
  downloads: number;
  prints: number;
  /** Set when the record is not simply issued. */
  state?: 'Revoked' | 'Superseded' | 'Reissued';
  stateNote?: string;
  /** When it was drafted, for anything not yet issued. */
  draftedOn?: string;
}

const seeded: Certificate[] = [
  {
    id: 'CRT-2026-0412',
    holder: 'Ananya Rao',
    holderRef: 'AD9887402',
    holderClass: 'Class X B',
    holderType: 'Student',
    typeId: 'merit',
    reason: 'First place, Annual Science Exhibition 2026',
    issuedOn: '22 Jul 2026',
    issuedBy: 'Ms. Fatima Sheikh',
    issuerRole: 'School Office · Records',
    checksPassed: 3,
    checkedOn: '24 Jul 2026',
    downloads: 3,
    prints: 2,
  },
  {
    id: 'CRT-2026-0418',
    holder: 'Lisa Gourley',
    holderRef: 'AD9892431',
    holderClass: 'Class IX A',
    holderType: 'Student',
    typeId: 'participation',
    reason: 'Class choir, Annual Day 2026',
    issuedOn: '30 Jul 2026',
    issuedBy: 'Ms. Fatima Sheikh',
    issuerRole: 'School Office · Records',
    checksPassed: 3,
    checkedOn: '30 Jul 2026',
    downloads: 1,
    prints: 1,
  },
  {
    id: 'CRT-2026-0421',
    holder: 'Meera Iyer',
    holderRef: 'AD9893660',
    holderClass: 'Class V A',
    holderType: 'Student',
    typeId: 'merit',
    reason: 'First place, Regional Youth Science Fair',
    issuedOn: null,
    issuedBy: null,
    issuerRole: null,
    checksPassed: 1,
    checkedOn: null,
    downloads: 0,
    prints: 0,
    draftedOn: '28 Jul 2026',
  },
  {
    id: 'CRT-2026-0405',
    holder: 'Mr. Ethan Brooks',
    holderRef: 'EMP-2019-034',
    holderClass: 'Class Teacher · Quiz club',
    holderType: 'Staff',
    typeId: 'service',
    reason: 'Seven years of continuous service',
    issuedOn: '22 Jul 2026',
    issuedBy: 'Ms. Dana Ruiz',
    issuerRole: 'Administration · HR desk',
    checksPassed: 3,
    checkedOn: '24 Jul 2026',
    downloads: 2,
    prints: 1,
  },
  {
    id: 'CRT-2026-0398',
    holder: 'Liam Walker',
    holderRef: 'AD9885210',
    holderClass: 'Class IV B',
    holderType: 'Student',
    typeId: 'bonafide',
    reason: 'Passport application, requested by guardian',
    issuedOn: '14 Jul 2026',
    issuedBy: 'Mrs. Alice Ray',
    issuerRole: 'School Office · Front desk',
    checksPassed: 3,
    checkedOn: '14 Jul 2026',
    downloads: 4,
    prints: 2,
  },
  {
    id: 'CRT-2026-0389',
    holder: 'Maria Fernandes',
    holderRef: 'AD9881077',
    holderClass: 'Class IX C',
    holderType: 'Student',
    typeId: 'transfer',
    reason: 'Relocation, family moving district',
    issuedOn: '08 Jul 2026',
    issuedBy: 'Mrs. Alice Ray',
    issuerRole: 'School Office · Front desk',
    checksPassed: 3,
    checkedOn: '09 Jul 2026',
    downloads: 2,
    prints: 3,
    state: 'Reissued',
    stateNote: 'Reissued 20 Jul after a spelling correction',
  },
  {
    id: 'CRT-2026-0377',
    holder: 'Kabir Sethi',
    holderRef: 'AD9876203',
    holderClass: 'Class VIII A',
    holderType: 'Student',
    typeId: 'character',
    reason: 'Scholarship application, regional STEM award',
    issuedOn: '02 Jul 2026',
    issuedBy: 'Ms. Dana Ruiz',
    issuerRole: 'Administration · HR desk',
    checksPassed: 2,
    checkedOn: '03 Jul 2026',
    downloads: 1,
    prints: 0,
  },
  {
    id: 'CRT-2026-0361',
    holder: 'Rohan Desai',
    holderRef: 'AD9871554',
    holderClass: 'Class IX C',
    holderType: 'Student',
    typeId: 'merit',
    reason: 'Second place, Inter-House Debate 2026',
    issuedOn: '18 Jun 2026',
    issuedBy: 'Ms. Fatima Sheikh',
    issuerRole: 'School Office · Records',
    checksPassed: 3,
    checkedOn: '18 Jun 2026',
    downloads: 0,
    prints: 1,
    state: 'Revoked',
    stateNote: 'Withdrawn 26 Jun — placement corrected on review',
  },
];

export const certificates: Certificate[] = seeded;

/* ------------------------------------------------------------------ *
 * What a certificate knows about itself                              *
 * ------------------------------------------------------------------ */

/** The day it stops being valid, or null when it never expires or never issued. */
export const validToOf = (row: Certificate) => {
  const years = typeOf(row.typeId).validYears;
  if (!row.issuedOn || years === 0) return null;
  return addDays(row.issuedOn, years * 365);
};

/** How long ago it was issued, said the way the grid says it. */
export const issuedAgoOf = (row: Certificate) => {
  if (!row.issuedOn) return row.draftedOn ? `Drafted ${row.draftedOn.split(' ').slice(0, 2).join(' ')}` : '—';
  const days = daysBetween(row.issuedOn, RUN_DATE);
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  return `${days} days ago`;
};

/** Whether every check has passed. */
export const isVerifiedOf = (row: Certificate) =>
  row.checksPassed >= VERIFICATION_CHECKS.length && row.checkedOn !== null;

/** The verification badge a certificate carries. */
export const verificationOf = (row: Certificate) => {
  if (!row.issuedOn) return { label: 'Pending', tint: 'secondary' };
  if (isVerifiedOf(row)) return { label: 'Verified', tint: 'success' };
  if (row.checksPassed === 0) return { label: 'Failed', tint: 'danger' };
  return { label: 'Pending', tint: 'warning' };
};

/** The line beneath it. */
export const checksLabelOf = (row: Certificate) =>
  `${row.checksPassed} of ${VERIFICATION_CHECKS.length} checks passed`;

/**
 * The status, read off the record.
 *
 * Revoked, Superseded and Reissued are stored because nothing else implies
 * them. Everything else follows from whether it has been signed.
 */
export const statusOf = (row: Certificate): Status => {
  if (row.state) return row.state;
  if (!row.issuedOn) return isVerifiedOf(row) ? 'Approved' : 'Pending Approval';
  return 'Issued';
};

export const statusPill = (status: Status) =>
  ({
    'Pending Approval': 'is-pending',
    Approved: 'is-review',
    Issued: 'is-completed',
    Reissued: 'is-new',
    Superseded: 'is-inactive',
    Revoked: 'is-blocked',
  })[status];

/** The line beneath the status pill. */
export const statusNoteOf = (row: Certificate) => {
  if (row.stateNote) return row.stateNote;
  const status = statusOf(row);
  if (status === 'Issued') return `${row.downloads} downloads · ${row.prints} prints`;
  if (row.draftedOn) return `Drafted ${row.draftedOn.split(' ').slice(0, 2).join(' ')}`;
  return '';
};

/** Whether the certificate has actually left the office. */
export const isIssuedOf = (row: Certificate) => row.issuedOn !== null && !row.state;

/** Everything the search box should reach. */
export const searchIndexOf = (row: Certificate) =>
  [
    row.id,
    row.holder,
    row.holderRef,
    row.holderClass,
    typeOf(row.typeId).name,
    row.reason,
    row.issuedBy ?? '',
    statusOf(row),
  ]
    .join(' ')
    .toLowerCase();

/* ------------------------------------------------------------------ *
 * The filter options, read off the register                          *
 * ------------------------------------------------------------------ */

const distinct = (values: string[]) => [...new Set(values.filter(Boolean))].sort();

export const typeOptions = CERTIFICATE_TYPES.map((entry) => entry.name);
export const holderOptions: Holder[] = ['Student', 'Staff'];
export const statusOptions: Status[] = [
  'Pending Approval',
  'Approved',
  'Issued',
  'Reissued',
  'Superseded',
  'Revoked',
];
export const verificationOptions = ['Verified', 'Pending', 'Failed'];
export const issuerOptions = distinct(certificates.map((row) => row.issuedBy ?? ''));
export const academicYearOptions = ['2026-2027', '2025-2026', '2024-2025'];

export const countByStatus = (rows: Certificate[], status: Status) =>
  rows.filter((row) => statusOf(row) === status).length;

export const countVerified = (rows: Certificate[]) => rows.filter(isVerifiedOf).length;

export const totalDownloads = (rows: Certificate[]) =>
  rows.reduce((total, row) => total + row.downloads, 0);
export const totalPrints = (rows: Certificate[]) =>
  rows.reduce((total, row) => total + row.prints, 0);

/** The date the dialogs propose. */
export const ISSUE_ON = RUN_DATE;
