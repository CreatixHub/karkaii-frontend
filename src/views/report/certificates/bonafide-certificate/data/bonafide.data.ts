import { addDays, daysBetween } from '../../../ai-insights/data/dates';
import { RUN_DATE } from '../../../ai-insights/data/registers';

export { RUN_DATE };

export const ACADEMIC_YEAR = '2026-2027';

/** Requests on the register school-wide. */
export const TOTAL_REQUESTS = 164;

/**
 * The rest of the summary strip and the saved-view counts.
 *
 * These span all 164 requests and the grid carries eight, so they stay register
 * figures. The issued share the strip prints still derives from them.
 */
export const PENDING_TOTAL = 11;
export const ISSUED_TOTAL = 128;
export const READY_TOTAL = 9;
export const REISSUED_TOTAL = 14;
export const AWAITING_PRINT = 9;
export const REJECTED_TOTAL = 7;

/** The service target the office holds itself to, in days. */
export const SLA_DAYS = 5;

export type Approval = 'Pending Approval' | 'Approved' | 'Rejected';
export type CertificateState =
  | 'Awaiting Approval'
  | 'Approved'
  | 'Generated'
  | 'Ready for Collection'
  | 'Issued'
  | 'Reissued'
  | 'Rejected';

export const PURPOSES = [
  'Passport Application',
  'Bank Account Opening',
  'Scholarship Application',
  'Visa Application',
  'Bus Pass Renewal',
  'Sports Registration',
  'Income Proof',
];

export interface Request {
  id: string;
  student: string;
  house: string;
  section: string;
  admissionNo: string;
  className: string;
  purpose: string;
  purposeNote: string;
  /** The four dates a request passes through. Null means it has not got there. */
  requestedOn: string;
  approvedOn: string | null;
  generatedOn: string | null;
  issuedOn: string | null;
  approvedBy: string | null;
  approverRole: string | null;
  /** The certificate serial, once one exists. */
  serial: string | null;
  copies: number;
  /** Set only when the request was turned down. */
  rejectedNote?: string;
  /** Set when a replacement was issued. */
  reissued?: boolean;
}

const seeded: Request[] = [
  {
    id: 'REQ-2026-0341',
    student: 'Ananya Rao',
    house: 'Everest House',
    section: 'Section B',
    admissionNo: 'AD9887402',
    className: 'Class X',
    purpose: 'Passport Application',
    purposeNote: 'Passport application for the student',
    requestedOn: '20 Jul 2026',
    approvedOn: '23 Jul 2026',
    generatedOn: '23 Jul 2026',
    issuedOn: '23 Jul 2026',
    approvedBy: 'Mrs. Alice Ray',
    approverRole: 'Chief Warden · Administration',
    serial: 'BON-2026-0294',
    copies: 1,
  },
  {
    id: 'REQ-2026-0347',
    student: 'Rohan Desai',
    house: 'Everest House',
    section: 'Section C',
    admissionNo: 'AD9889014',
    className: 'Class IX',
    purpose: 'Scholarship Application',
    purposeNote: 'National Mathematics Foundation award',
    requestedOn: '24 Jul 2026',
    approvedOn: '27 Jul 2026',
    generatedOn: '27 Jul 2026',
    issuedOn: '27 Jul 2026',
    approvedBy: 'Mr. Ethan Brooks',
    approverRole: 'Class Teacher · Mathematics',
    serial: 'BON-2026-0301',
    copies: 2,
  },
  {
    id: 'REQ-2026-0352',
    student: 'Aarav Kumar',
    house: 'Nilgiri House',
    section: 'Section A',
    admissionNo: 'AD9891255',
    className: 'Class VII',
    purpose: 'Sports Registration',
    purposeNote: 'State athletics trial entry',
    requestedOn: '27 Jul 2026',
    approvedOn: '29 Jul 2026',
    generatedOn: '30 Jul 2026',
    issuedOn: null,
    approvedBy: 'Ms. Deepa Rawat',
    approverRole: 'Physical Education Teacher · Athletics',
    serial: 'BON-2026-0308',
    copies: 1,
  },
  {
    id: 'REQ-2026-0356',
    student: 'Lisa Gourley',
    house: 'Aravalli House',
    section: 'Section B',
    admissionNo: 'AD9892431',
    className: 'Class II',
    purpose: 'Bank Account Opening',
    purposeNote: 'Minor savings account in the student’s name',
    requestedOn: '29 Jul 2026',
    approvedOn: '30 Jul 2026',
    generatedOn: '31 Jul 2026',
    issuedOn: null,
    approvedBy: 'Mrs. Ellen Cruz',
    approverRole: 'Class Teacher · II B',
    serial: 'BON-2026-0312',
    copies: 0,
  },
  {
    id: 'REQ-2026-0359',
    student: 'Kabir Sethi',
    house: 'Nilgiri House',
    section: 'Section A',
    admissionNo: 'AD9876203',
    className: 'Class VIII',
    purpose: 'Visa Application',
    purposeNote: 'Student exchange programme, six weeks',
    requestedOn: '30 Jul 2026',
    approvedOn: null,
    generatedOn: null,
    issuedOn: null,
    approvedBy: null,
    approverRole: null,
    serial: null,
    copies: 0,
  },
  {
    id: 'REQ-2026-0361',
    student: 'Maria Fernandes',
    house: 'Aravalli House',
    section: 'Section C',
    admissionNo: 'AD9881077',
    className: 'Class IX',
    purpose: 'Bus Pass Renewal',
    purposeNote: 'Municipal transport concession renewal',
    requestedOn: '31 Jul 2026',
    approvedOn: null,
    generatedOn: null,
    issuedOn: null,
    approvedBy: null,
    approverRole: null,
    serial: null,
    copies: 0,
  },
  {
    id: 'REQ-2026-0338',
    student: 'Liam Walker',
    house: 'Everest House',
    section: 'Section B',
    admissionNo: 'AD9885210',
    className: 'Class IV',
    purpose: 'Passport Application',
    purposeNote: 'Replacement after a printing error',
    requestedOn: '14 Jul 2026',
    approvedOn: '15 Jul 2026',
    generatedOn: '15 Jul 2026',
    issuedOn: '16 Jul 2026',
    approvedBy: 'Mrs. Alice Ray',
    approverRole: 'Chief Warden · Administration',
    serial: 'BON-2026-0288',
    copies: 2,
    reissued: true,
  },
  {
    id: 'REQ-2026-0333',
    student: 'Nikhil Menon',
    house: 'Nilgiri House',
    section: 'Section A',
    admissionNo: 'AD9884411',
    className: 'Class VI',
    purpose: 'Income Proof',
    purposeNote: 'Requested for a scheme the school does not certify',
    requestedOn: '09 Jul 2026',
    approvedOn: null,
    generatedOn: null,
    issuedOn: null,
    approvedBy: 'Mrs. Alice Ray',
    approverRole: 'Chief Warden · Administration',
    serial: null,
    copies: 0,
    rejectedNote: 'Declined 11 Jul — the school does not certify household income',
  },
];

export const requests: Request[] = seeded;

/* ------------------------------------------------------------------ *
 * What a request knows about itself                                  *
 * ------------------------------------------------------------------ */

/** How long ago something happened, said the way the grid says it. */
export const agoOf = (date: string | null) => {
  if (!date) return '—';
  const days = daysBetween(date, RUN_DATE);
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  return `${days} days ago`;
};

/** Days the request has been open, or the days it took to approve. */
export const turnaroundOf = (row: Request) => {
  if (row.rejectedNote) return null;
  if (!row.approvedOn) return daysBetween(row.requestedOn, RUN_DATE);
  return daysBetween(row.requestedOn, row.approvedOn);
};

/** The line under the request date. */
export const turnaroundLabelOf = (row: Request) => {
  const days = turnaroundOf(row);
  if (days === null) return 'Closed without approval';
  if (!row.approvedOn) return `Open ${days} days`;
  return `${days} days · ${days <= SLA_DAYS ? 'within' : 'outside'} SLA`;
};

/** Whether the approval landed inside the service target. */
export const withinSlaOf = (row: Request) => {
  const days = turnaroundOf(row);
  return days !== null && row.approvedOn !== null && days <= SLA_DAYS;
};

/** The approval decision the register holds. */
export const approvalOf = (row: Request): Approval => {
  if (row.rejectedNote) return 'Rejected';
  return row.approvedOn ? 'Approved' : 'Pending Approval';
};

/**
 * Where the certificate has actually got to.
 *
 * The furthest date reached, rather than a stored word — so a record cannot
 * read Issued while its issue date is empty.
 */
export const stateOf = (row: Request): CertificateState => {
  if (row.rejectedNote) return 'Rejected';
  if (row.issuedOn) return row.reissued ? 'Reissued' : 'Issued';
  if (row.generatedOn) return row.copies > 0 ? 'Ready for Collection' : 'Generated';
  if (row.approvedOn) return 'Approved';
  return 'Awaiting Approval';
};

export const statePill = (state: CertificateState) =>
  ({
    'Awaiting Approval': 'is-pending',
    Approved: 'is-review',
    Generated: 'is-new',
    'Ready for Collection': 'is-active',
    Issued: 'is-completed',
    Reissued: 'is-new',
    Rejected: 'is-blocked',
  })[state];

/** The line under the state pill. */
export const stateNoteOf = (row: Request) => {
  const state = stateOf(row);
  if (row.rejectedNote) return row.rejectedNote;
  if (state === 'Issued' || state === 'Reissued') {
    return `${row.copies} ${row.copies === 1 ? 'copy' : 'copies'} issued`;
  }
  if (state === 'Ready for Collection') {
    return `Printed ${row.generatedOn?.split(' ').slice(0, 2).join(' ')} · at the counter`;
  }
  if (state === 'Generated') return `${row.serial} · not printed`;
  if (state === 'Approved') return 'Awaiting generation';
  return 'With the approver';
};

/** The line under the issue date. */
export const issueNoteOf = (row: Request) => {
  if (row.issuedOn) return row.serial ?? '';
  if (row.generatedOn) return row.copies > 0 ? 'At the office counter' : 'Printing queued';
  return 'Not yet generated';
};

/** Whether the request is still moving. */
export const isOpenOf = (row: Request) => !row.issuedOn && !row.rejectedNote;

export const searchIndexOf = (row: Request) =>
  [row.id, row.student, row.admissionNo, row.className, row.purpose, row.serial ?? '', stateOf(row)]
    .join(' ')
    .toLowerCase();

/* ------------------------------------------------------------------ *
 * The filter options                                                 *
 * ------------------------------------------------------------------ */

const distinct = (values: string[]) => [...new Set(values.filter(Boolean))].sort();

export const classOptions = distinct(requests.map((row) => row.className));
export const sectionOptions = ['A', 'B', 'C'];
export const purposeOptions = PURPOSES;
export const approvalOptions: Approval[] = ['Pending Approval', 'Approved', 'Rejected'];
export const stateOptions: CertificateState[] = [
  'Awaiting Approval',
  'Approved',
  'Generated',
  'Ready for Collection',
  'Issued',
  'Reissued',
  'Rejected',
];
export const academicYearOptions = ['2026-2027', '2025-2026', '2024-2025'];
export const approverOptions = distinct(requests.map((row) => row.approvedBy ?? ''));

export const countByState = (rows: Request[], state: CertificateState) =>
  rows.filter((row) => stateOf(row) === state).length;

export const countOpen = (rows: Request[]) => rows.filter(isOpenOf).length;

export const totalCopies = (rows: Request[]) =>
  rows.reduce((total, row) => total + row.copies, 0);

/** Of the requests that were approved, how many landed inside the target. */
export const slaRateOf = (rows: Request[]) => {
  const approved = rows.filter((row) => row.approvedOn !== null);
  if (approved.length === 0) return null;
  return Math.round((approved.filter(withinSlaOf).length / approved.length) * 100);
};

/** The date the dialogs propose. */
export const COLLECT_BY = addDays(RUN_DATE, 3);
