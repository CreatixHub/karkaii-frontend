import { daysBetween, shortDate } from '../../../ai-insights/data/dates';

/** This page's clock. See the deviation note above. */
export const RUN_DATE = '31 Jul 2026';

export const ACADEMIC_YEAR = '2026-2027';

/* ------------------------------------------------------------------ *
 * The register-wide figures                                          *
 * ------------------------------------------------------------------ */

export const TOTAL_REQUESTS = 46;
export const PENDING_APPROVAL = 6;
export const CLEARANCE_PENDING = 9;
export const ISSUED_TOTAL = 24;
export const READY_TOTAL = 4;
export const FEE_DUES_OUTSTANDING = 5;
export const REJECTED_TOTAL = 3;

/* ------------------------------------------------------------------ *
 * What a request is made of                                          *
 * ------------------------------------------------------------------ */

export type CheckStatus = 'Cleared' | 'Pending' | 'Blocked';
export type ClearanceStatus = CheckStatus;
export type ApprovalStatus = 'Awaiting Clearance' | 'Pending Approval' | 'Approved' | 'Rejected';
export type IssueStatus = 'Not Generated' | 'Generated' | 'Ready for Collection' | 'Collected';

export const LEAVING_REASONS = [
  'Relocation',
  'Board Change',
  'Completed Schooling',
  'Medical Reasons',
  'Parent Request',
  'Moving Abroad',
] as const;

export type LeavingReason = (typeof LEAVING_REASONS)[number];

export const REASON_TINT: Record<LeavingReason, string> = {
  Relocation: 'info',
  'Board Change': 'primary',
  'Completed Schooling': 'success',
  'Medical Reasons': 'danger',
  'Parent Request': 'warning',
  'Moving Abroad': 'purple',
};

/** The five departments a request has to clear, in the order the page lists them. */
export const DEPARTMENTS = ['Accounts', 'Library', 'Laboratory', 'Transport', 'Class Teacher'];

export const CLASS_LADDER = [
  'Class I',
  'Class II',
  'Class III',
  'Class IV',
  'Class V',
  'Class VI',
  'Class VII',
  'Class VIII',
  'Class IX',
  'Class X',
  'Class XI',
  'Class XII',
];

export const CONDUCT_OPTIONS = ['Excellent', 'Satisfactory', 'Needs improvement'];

export const SIGNATORIES = [
  'Mrs. Alice Ray · Chief Warden',
  'Principal',
  'Ms. Dana Ruiz · Front Office',
  'Mrs. Ellen Cruz · Class Teacher',
];

export const OFFICERS = ['Ms. Fatima Sheikh · School Office', 'Ms. Dana Ruiz · Front Office'];

export const COLLECTION_POINTS = [
  'School office, counter 2',
  'Class teacher',
  'Posted to the guardian',
];

export const REJECTION_REASONS = [
  'Not applicable · approving',
  'Term examination in progress',
  'Clearance not complete',
  'Receiving school not confirmed',
  'Duplicate request',
];

export interface Check {
  detail: string;
  status: CheckStatus;
}

export interface Due {
  item: string;
  amount: number;
}

export interface BookLoan {
  title: string;
  due: string;
}

export interface Request {
  tcNumber: string;
  student: string;
  admissionNo: string;
  className: string;
  section: string;
  house: string;
  admittedOn: string;
  guardian: string;
  contact: string;
  reason: LeavingReason;
  reasonDetail: string;
  requestedOn: string;
  /** Null while the student is still coming in. */
  lastAttendedOn: string | null;
  attendance: number;
  conduct: string;
  /**
   * The three departments that report in words. Accounts and Library are not
   * stored — they are read off the dues and the loans below, so settling a bill
   * clears the department it belongs to.
   */
  laboratory: Check;
  transport: Check;
  classTeacher: Check;
  dues: Due[];
  books: BookLoan[];
  approvedBy: string | null;
  approvedOn: string | null;
  rejectedBy: string | null;
  rejectedOn: string | null;
  generatedOn: string | null;
  printedOn: string | null;
  collectedOn: string | null;
  copies: number;
  receivingSchool: string | null;
  notes: string;
}

const cleared = (detail: string): Check => ({ detail, status: 'Cleared' });

const seeded: Request[] = [
  {
    tcNumber: 'TC-2026-0085',
    student: 'Rohan Malhotra',
    admissionNo: 'AD9887190',
    className: 'Class V',
    section: 'Section A',
    house: 'Everest House',
    admittedOn: '11 Apr 2022',
    guardian: 'Mr. Sanjay Malhotra',
    contact: '+1 55 2210 7745',
    reason: 'Relocation',
    reasonDetail: 'Guardian transferred to another city',
    requestedOn: '5 Jul 2026',
    lastAttendedOn: '3 Jul 2026',
    attendance: 94,
    conduct: 'Satisfactory',
    laboratory: cleared('No breakage or apparatus pending'),
    transport: cleared('Bus pass surrendered 4 Jul 2026'),
    classTeacher: cleared('Progress record closed and signed'),
    dues: [],
    books: [],
    approvedBy: 'Mrs. Alice Ray',
    approvedOn: '8 Jul 2026',
    rejectedBy: null,
    rejectedOn: null,
    generatedOn: '9 Jul 2026',
    printedOn: '9 Jul 2026',
    collectedOn: '10 Jul 2026',
    copies: 2,
    receivingSchool: null,
    notes:
      'Duplicate copy issued at the guardian request for the receiving school and the family file.',
  },
  {
    tcNumber: 'TC-2026-0088',
    student: 'Aditi Nair',
    admissionNo: 'AD9890144',
    className: 'Class III',
    section: 'Section A',
    house: 'Nilgiri House',
    admittedOn: '6 Apr 2023',
    guardian: 'Mrs. Shalini Nair',
    contact: '+1 55 4482 1130',
    reason: 'Relocation',
    reasonDetail: 'Family moving to the north district',
    requestedOn: '12 Jul 2026',
    lastAttendedOn: '10 Jul 2026',
    attendance: 96,
    conduct: 'Excellent',
    laboratory: cleared('Not applicable for the junior section'),
    transport: cleared('Not a transport user'),
    classTeacher: cleared('Progress record closed and signed'),
    dues: [],
    books: [],
    approvedBy: 'Mrs. Ellen Cruz',
    approvedOn: '15 Jul 2026',
    rejectedBy: null,
    rejectedOn: null,
    generatedOn: '16 Jul 2026',
    printedOn: '16 Jul 2026',
    collectedOn: '18 Jul 2026',
    copies: 1,
    receivingSchool: 'North District Public School',
    notes:
      'Junior section TC. The receiving school confirmed admission before the certificate was collected.',
  },
  {
    tcNumber: 'TC-2026-0091',
    student: 'Vivaan Kapoor',
    admissionNo: 'AD9888021',
    className: 'Class VIII',
    section: 'Section B',
    house: 'Aravalli House',
    admittedOn: '8 Apr 2021',
    guardian: 'Mr. Rohit Kapoor',
    contact: '+1 55 6634 9902',
    reason: 'Board Change',
    reasonDetail: 'Moving to a school on a different examination board',
    requestedOn: '18 Jul 2026',
    lastAttendedOn: '17 Jul 2026',
    attendance: 91,
    conduct: 'Satisfactory',
    laboratory: cleared('Apparatus returned 19 Jul 2026'),
    transport: cleared('Bus pass surrendered 17 Jul 2026'),
    classTeacher: cleared('Progress record closed and signed'),
    dues: [],
    books: [],
    approvedBy: 'Mrs. Alice Ray',
    approvedOn: '21 Jul 2026',
    rejectedBy: null,
    rejectedOn: null,
    generatedOn: '22 Jul 2026',
    printedOn: '22 Jul 2026',
    collectedOn: null,
    copies: 1,
    receivingSchool: null,
    notes:
      'Printed and held at counter 2. The guardian was told on 22 Jul that the certificate is ready.',
  },
  {
    tcNumber: 'TC-2026-0094',
    student: 'Sara Fernandes',
    admissionNo: 'AD9886715',
    className: 'Class X',
    section: 'Section A',
    house: 'Everest House',
    admittedOn: '9 Apr 2019',
    guardian: 'Mrs. Lucia Fernandes',
    contact: '+1 55 7790 3318',
    reason: 'Completed Schooling',
    reasonDetail: 'Leaving after Class X for higher secondary elsewhere',
    requestedOn: '22 Jul 2026',
    lastAttendedOn: '21 Jul 2026',
    attendance: 93,
    conduct: 'Excellent',
    laboratory: cleared('Apparatus and breakage settled'),
    transport: cleared('Not a transport user'),
    classTeacher: cleared('Board result entered on the record'),
    dues: [],
    books: [],
    approvedBy: 'Mrs. Alice Ray',
    approvedOn: '24 Jul 2026',
    rejectedBy: null,
    rejectedOn: null,
    generatedOn: null,
    printedOn: null,
    collectedOn: null,
    copies: 1,
    receivingSchool: null,
    notes:
      'Approved and queued for generation. The board result line must be printed on the certificate.',
  },
  {
    tcNumber: 'TC-2026-0096',
    student: 'Arnav Bose',
    admissionNo: 'AD9891880',
    className: 'Class VI',
    section: 'Section C',
    house: 'Nilgiri House',
    admittedOn: '5 Apr 2022',
    guardian: 'Mr. Prasenjit Bose',
    contact: '+1 55 3345 8827',
    reason: 'Moving Abroad',
    reasonDetail: 'Family relocating overseas in September',
    requestedOn: '25 Jul 2026',
    lastAttendedOn: null,
    attendance: 89,
    conduct: 'Satisfactory',
    laboratory: cleared('Apparatus returned, charge raised to accounts'),
    transport: cleared('Bus pass surrendered 24 Jul 2026'),
    classTeacher: cleared('Progress record closed and signed'),
    dues: [
      { item: 'Term 2 tuition instalment', amount: 1200 },
      { item: 'Laboratory breakage charge', amount: 250 },
    ],
    books: [],
    approvedBy: null,
    approvedOn: null,
    rejectedBy: null,
    rejectedOn: null,
    generatedOn: null,
    printedOn: null,
    collectedOn: null,
    copies: 1,
    receivingSchool: null,
    notes:
      'Cannot go to approval until the accounts balance is settled. The guardian was sent a statement on 26 Jul.',
  },
  {
    tcNumber: 'TC-2026-0098',
    student: 'Diya Menon',
    admissionNo: 'AD9893014',
    className: 'Class IV',
    section: 'Section B',
    house: 'Aravalli House',
    admittedOn: '4 Apr 2024',
    guardian: 'Mr. Anand Menon',
    contact: '+1 55 5528 4471',
    reason: 'Parent Request',
    reasonDetail: 'Change of school at the guardian request',
    requestedOn: '27 Jul 2026',
    lastAttendedOn: null,
    attendance: 92,
    conduct: 'Excellent',
    laboratory: cleared('Not applicable for the junior section'),
    transport: cleared('Bus pass surrendered 27 Jul 2026'),
    classTeacher: cleared('Progress record closed and signed'),
    dues: [],
    books: [
      { title: 'Atlas of the World, junior edition', due: '14 Jul 2026' },
      { title: 'Stories from Around the World', due: '21 Jul 2026' },
    ],
    approvedBy: null,
    approvedOn: null,
    rejectedBy: null,
    rejectedOn: null,
    generatedOn: null,
    printedOn: null,
    collectedOn: null,
    copies: 1,
    receivingSchool: null,
    notes:
      'Two library books are still out. The librarian sent a reminder to the guardian on 28 Jul.',
  },
  {
    tcNumber: 'TC-2026-0101',
    student: 'Kabir Rathi',
    admissionNo: 'AD9889506',
    className: 'Class IX',
    section: 'Section A',
    house: 'Everest House',
    admittedOn: '8 Apr 2021',
    guardian: 'Mrs. Sunita Rathi',
    contact: '+1 55 8817 2260',
    reason: 'Medical Reasons',
    reasonDetail: 'Long term treatment, continuing schooling near the hospital',
    requestedOn: '29 Jul 2026',
    lastAttendedOn: '29 Jul 2026',
    attendance: 78,
    conduct: 'Satisfactory',
    laboratory: cleared('Apparatus returned 29 Jul 2026'),
    transport: cleared('Bus pass surrendered 29 Jul 2026'),
    classTeacher: cleared('Progress record closed and signed'),
    dues: [],
    books: [],
    approvedBy: null,
    approvedOn: null,
    rejectedBy: null,
    rejectedOn: null,
    generatedOn: null,
    printedOn: null,
    collectedOn: null,
    copies: 1,
    receivingSchool: null,
    notes:
      'Every department has cleared. Held only for the Chief Warden signature, expected on 1 Aug.',
  },
  {
    tcNumber: 'TC-2026-0103',
    student: 'Neha Gill',
    admissionNo: 'AD9892300',
    className: 'Class VII',
    section: 'Section B',
    house: 'Nilgiri House',
    admittedOn: '7 Apr 2023',
    guardian: 'Mr. Harpreet Gill',
    contact: '+1 55 9903 5514',
    reason: 'Parent Request',
    reasonDetail: 'Request raised during the half yearly examination window',
    requestedOn: '30 Jul 2026',
    lastAttendedOn: null,
    attendance: 88,
    conduct: 'Satisfactory',
    laboratory: cleared('Apparatus returned 30 Jul 2026'),
    transport: { detail: 'Bus pass still in use, not surrendered', status: 'Pending' },
    classTeacher: cleared('Progress record open until the term closes'),
    dues: [],
    books: [],
    approvedBy: null,
    approvedOn: null,
    rejectedBy: 'Ms. Dana Ruiz',
    rejectedOn: '31 Jul 2026',
    generatedOn: null,
    printedOn: null,
    collectedOn: null,
    copies: 1,
    receivingSchool: null,
    notes:
      'School policy issues a transfer certificate only after the term examination. The guardian may re-apply from 14 Aug.',
  },
];

export const requests: Request[] = seeded;

/* ------------------------------------------------------------------ *
 * Money and dates                                                    *
 * ------------------------------------------------------------------ */

export const money = (amount: number) =>
  `$ ${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

/** The template floors its shares: 24 of 46 prints as 52%, not 53%. */
export const shareOf = (part: number, whole: number) =>
  whole === 0 ? 0 : Math.floor((part / whole) * 100);

export const agoOf = (date: string | null) => {
  if (!date) return '—';
  const days = daysBetween(date, RUN_DATE);
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  return `${days} days ago`;
};

/* ------------------------------------------------------------------ *
 * The clearance run                                                  *
 * ------------------------------------------------------------------ */

export const outstandingOf = (row: Request) =>
  row.dues.reduce((total, due) => total + due.amount, 0);

export const booksOnLoanOf = (row: Request) => row.books.length;

/** Accounts reports the dues; Library reports the loans. Neither is stored. */
export const accountsCheckOf = (row: Request): Check => {
  const balance = outstandingOf(row);
  if (balance === 0) return { detail: 'No outstanding balance', status: 'Cleared' };
  return {
    detail: `${money(balance)} outstanding across ${row.dues.length} items`,
    status: 'Blocked',
  };
};

export const libraryCheckOf = (row: Request): Check => {
  const loans = booksOnLoanOf(row);
  if (loans === 0) return { detail: 'All books returned', status: 'Cleared' };
  return { detail: `${loans} books not returned`, status: 'Blocked' };
};

/** The five departments, in the order the page lists them. */
export const departmentsOf = (row: Request): { name: string; check: Check }[] => [
  { name: 'Accounts', check: accountsCheckOf(row) },
  { name: 'Library', check: libraryCheckOf(row) },
  { name: 'Laboratory', check: row.laboratory },
  { name: 'Transport', check: row.transport },
  { name: 'Class Teacher', check: row.classTeacher },
];

export const clearedCountOf = (row: Request) =>
  departmentsOf(row).filter((entry) => entry.check.status === 'Cleared').length;

export const clearanceStatusOf = (row: Request): ClearanceStatus => {
  const checks = departmentsOf(row).map((entry) => entry.check.status);
  if (checks.includes('Blocked')) return 'Blocked';
  if (checks.includes('Pending')) return 'Pending';
  return 'Cleared';
};

export const clearanceTint = (status: ClearanceStatus) =>
  ({ Cleared: 'success', Pending: 'warning', Blocked: 'danger' })[status];

export const clearanceNoteOf = (row: Request) =>
  `${clearedCountOf(row)} of ${DEPARTMENTS.length} departments cleared`;

/** The department holding the request up, if any. */
export const heldByOf = (row: Request) =>
  departmentsOf(row).find((entry) => entry.check.status !== 'Cleared')?.name ?? null;

export const blocksApprovalOf = (row: Request) => clearanceStatusOf(row) !== 'Cleared';

/* ------------------------------------------------------------------ *
 * Approval and issue                                                 *
 * ------------------------------------------------------------------ */

export const approvalStatusOf = (row: Request): ApprovalStatus => {
  if (row.rejectedOn) return 'Rejected';
  if (row.approvedOn) return 'Approved';
  return blocksApprovalOf(row) ? 'Awaiting Clearance' : 'Pending Approval';
};

export const approvalPill = (status: ApprovalStatus) =>
  ({
    'Awaiting Clearance': 'is-pending',
    'Pending Approval': 'is-review',
    Approved: 'is-active',
    Rejected: 'is-blocked',
  })[status];

/** Days the request has been open, or the days it took to close. */
export const closedOnOf = (row: Request) => row.collectedOn ?? row.rejectedOn;

export const daysOpenOf = (row: Request) => {
  const closed = closedOnOf(row);
  return daysBetween(row.requestedOn, closed ?? RUN_DATE);
};

export const openForOf = (row: Request) =>
  closedOnOf(row) ? 'Closed' : `${daysOpenOf(row)} days`;

export const turnaroundLabelOf = (row: Request) => {
  const days = daysOpenOf(row);
  return closedOnOf(row) ? `Closed in ${days} days` : `Open ${days} days`;
};

export const approvalNoteOf = (row: Request) => {
  const status = approvalStatusOf(row);
  if (status === 'Rejected') return `Rejected ${shortDate(row.rejectedOn as string)}`;
  if (status === 'Approved') return `${row.approvedBy} · ${shortDate(row.approvedOn as string)}`;
  if (status === 'Awaiting Clearance') return `Held by ${heldByOf(row)}`;
  return `Cleared, waiting ${daysOpenOf(row)} days`;
};

export const issueStatusOf = (row: Request): IssueStatus => {
  if (row.collectedOn) return 'Collected';
  if (row.printedOn) return 'Ready for Collection';
  if (row.generatedOn) return 'Generated';
  return 'Not Generated';
};

/** The line under the issue date. */
export const issueNoteOf = (row: Request) => {
  if (row.collectedOn) return `${row.copies} ${row.copies === 1 ? 'copy' : 'copies'} issued`;
  if (row.printedOn) return `Printed ${shortDate(row.printedOn)}`;
  if (row.rejectedOn) return 'Rejected, nothing issued';
  if (row.approvedOn) return 'Generation queued';
  return 'Blocked before approval';
};

/** How long a printed certificate has been waiting at the counter. */
export const waitingAtCounterOf = (row: Request) =>
  row.printedOn && !row.collectedOn ? daysBetween(row.printedOn, RUN_DATE) : null;

/* ------------------------------------------------------------------ *
 * The certificate itself                                             *
 * ------------------------------------------------------------------ */

/** The TC number tagged with the last four of the admission number. */
export const verificationCodeOf = (row: Request) =>
  `${row.tcNumber}-${row.admissionNo.slice(-4)}`;

export const nextClassOf = (row: Request) => {
  const index = CLASS_LADDER.indexOf(row.className);
  if (index === -1 || index === CLASS_LADDER.length - 1) return null;
  return CLASS_LADDER[index + 1];
};

/** What the certificate says about where the student goes next. */
export const promotionLineOf = (row: Request) => {
  if (row.reason === 'Completed Schooling') return 'Passed the board examination';
  const next = nextClassOf(row);
  return next ? `Promoted to ${next}` : 'Term in progress';
};

/** The sentence the preview prints. */
export const citationOf = (row: Request) =>
  `, admission number ${row.admissionNo}, was a student of ${row.className}, ${row.section} and was admitted on ${row.admittedOn}.`;

export const previewEmptyNoteOf = (row: Request) => {
  if (row.rejectedOn) return 'Request was rejected';
  if (blocksApprovalOf(row)) return 'Blocked until clearance completes';
  return 'Generated after approval';
};

/* ------------------------------------------------------------------ *
 * The timelines                                                      *
 * ------------------------------------------------------------------ */

export interface Entry {
  title: string;
  note: string;
}

/** The approval timeline in the expanded detail. */
export const timelineOf = (row: Request): Entry[] => {
  const trail: Entry[] = [
    { title: 'Request raised', note: `${row.requestedOn} · ${row.reason}` },
  ];

  const status = clearanceStatusOf(row);
  if (status === 'Cleared') {
    trail.push({
      title: 'All departments cleared',
      note: `${clearedCountOf(row)} of ${DEPARTMENTS.length} signed off`,
    });
  } else {
    trail.push({
      title: status === 'Blocked' ? 'Clearance blocked' : 'Clearance pending',
      note: `Held by ${heldByOf(row)}`,
    });
  }

  if (row.rejectedOn) {
    trail.push({ title: `Rejected by ${row.rejectedBy}`, note: row.rejectedOn });
  } else if (row.approvedOn) {
    trail.push({ title: `Approved by ${row.approvedBy}`, note: row.approvedOn });
  } else {
    trail.push({
      title: 'Approval not reached',
      note: blocksApprovalOf(row)
        ? 'Clearance must complete first'
        : `Waiting ${daysOpenOf(row)} days`,
    });
  }

  if (row.generatedOn) trail.push({ title: 'Certificate generated', note: row.generatedOn });
  if (row.printedOn) trail.push({ title: 'Printed and sealed', note: row.printedOn });
  if (row.collectedOn) trail.push({ title: 'Collected at the counter', note: row.collectedOn });

  return trail;
};

/** The print and issue history in the expanded detail. */
export const printHistoryOf = (row: Request): Entry[] => {
  if (!row.generatedOn) {
    return [{ title: 'No print activity', note: 'Starts once the certificate is generated' }];
  }
  const history: Entry[] = [
    { title: 'Certificate generated', note: `${row.generatedOn} · school office` },
  ];
  if (row.printedOn) {
    history.push({
      title: `${row.copies} ${row.copies === 1 ? 'copy' : 'copies'} printed and sealed`,
      note: `${row.printedOn} · school office`,
    });
  }
  if (row.collectedOn) {
    history.push({ title: 'Collected by the guardian', note: `${row.collectedOn} · counter 2` });
  } else {
    const waiting = waitingAtCounterOf(row);
    if (waiting !== null) {
      history.push({ title: 'Held at counter 2', note: `${waiting} days waiting` });
    }
  }
  return history;
};

/** The audit history in the side panel. */
export const auditOf = (row: Request): Entry[] => {
  const trail: Entry[] = [
    { title: 'Request raised', note: `${row.requestedOn} · front office` },
  ];
  const held = heldByOf(row);
  if (held) {
    const balance = outstandingOf(row);
    trail.push({
      title: `${held} ${clearanceStatusOf(row) === 'Blocked' ? 'blocked' : 'held'} the clearance`,
      note: `${row.requestedOn} · ${balance > 0 ? `${money(balance)} outstanding` : `${booksOnLoanOf(row) || 1} item outstanding`}`,
    });
  }
  if (row.approvedOn) trail.push({ title: `Approved by ${row.approvedBy}`, note: `${row.approvedOn} · signatory` });
  if (row.rejectedOn) trail.push({ title: `Rejected by ${row.rejectedBy}`, note: `${row.rejectedOn} · front office` });
  if (row.collectedOn) trail.push({ title: 'Collected by the guardian', note: `${row.collectedOn} · counter 2` });
  return trail;
};

/** The four workflow stages the side panel prints. */
export const workflowOf = (row: Request) => {
  const clearance = clearanceStatusOf(row);
  const approval = approvalStatusOf(row);
  return [
    { stage: 'Request received', owner: 'Front office', status: 'Done' },
    {
      stage: 'Department clearance',
      owner: `${DEPARTMENTS.length} departments`,
      status: clearance === 'Cleared' ? 'Done' : clearance,
    },
    {
      stage: 'Signatory approval',
      owner: row.approvedBy ?? 'Chief Warden',
      status: approval === 'Approved' ? 'Done' : approval === 'Rejected' ? 'Rejected' : 'Waiting',
    },
    {
      stage: 'Generate and print',
      owner: 'School office',
      status: row.printedOn ? 'Done' : 'Waiting',
    },
  ];
};

/**
 * The buttons the expanded detail offers. The template gives each row a
 * different pair, and the pair is always the next thing the request needs — so
 * it is read off the progress rather than listed row by row.
 */
export interface DetailAction {
  label: string;
  icon: string;
  modal: 'new' | 'edit' | 'clearance' | 'approve' | 'generate' | 'print' | 'view';
  primary: boolean;
}

export const detailActionsOf = (row: Request): DetailAction[] => {
  if (blocksApprovalOf(row) && !row.rejectedOn) {
    return [
      { label: 'Verify Clearance', icon: 'ti ti-checklist', modal: 'clearance', primary: true },
      { label: 'Edit Request', icon: 'ti ti-edit', modal: 'edit', primary: false },
    ];
  }
  if (row.rejectedOn) {
    return [
      { label: 'View Details', icon: 'ti ti-eye', modal: 'view', primary: true },
      { label: 'Edit Request', icon: 'ti ti-edit', modal: 'edit', primary: false },
    ];
  }
  if (!row.approvedOn) {
    return [
      { label: 'Approve / Reject', icon: 'ti ti-gavel', modal: 'approve', primary: true },
      { label: 'View Details', icon: 'ti ti-eye', modal: 'view', primary: false },
    ];
  }
  if (!row.generatedOn) {
    return [
      { label: 'Generate TC', icon: 'ti ti-file-certificate', modal: 'generate', primary: true },
      { label: 'View Details', icon: 'ti ti-eye', modal: 'view', primary: false },
    ];
  }
  if (!row.collectedOn) {
    return [
      { label: 'Print Certificate', icon: 'ti ti-printer', modal: 'print', primary: true },
      { label: 'View Details', icon: 'ti ti-eye', modal: 'view', primary: false },
    ];
  }
  return [{ label: 'View Details', icon: 'ti ti-eye', modal: 'view', primary: true }];
};

export const searchIndexOf = (row: Request) =>
  [
    row.tcNumber,
    row.student,
    row.admissionNo,
    row.className,
    row.reason,
    row.guardian,
    approvalStatusOf(row),
  ]
    .join(' ')
    .toLowerCase();

/* ------------------------------------------------------------------ *
 * The filter options and the counts                                  *
 * ------------------------------------------------------------------ */

const distinct = (values: string[]) => [...new Set(values.filter(Boolean))];

export const classOptions = CLASS_LADDER.slice(2, 10);
export const academicYearOptions = ['2026-2027', '2025-2026', '2024-2025'];
export const requestStatusOptions: ApprovalStatus[] = [
  'Awaiting Clearance',
  'Pending Approval',
  'Approved',
  'Rejected',
];
export const clearanceStatusOptions: ClearanceStatus[] = ['Cleared', 'Pending', 'Blocked'];
export const reasonOptions = [...LEAVING_REASONS];
export const issueStatusOptions: IssueStatus[] = [
  'Not Generated',
  'Generated',
  'Ready for Collection',
  'Collected',
];
export const sectionOptions = distinct(requests.map((row) => row.section.replace('Section ', '')));

/** The request picker every dialog carries. */
export const requestOptions = requests.map((row) => `${row.tcNumber} · ${row.student}`);

export const countByApproval = (rows: Request[], status: ApprovalStatus) =>
  rows.filter((row) => approvalStatusOf(row) === status).length;

export const countByClearance = (rows: Request[], status: ClearanceStatus) =>
  rows.filter((row) => clearanceStatusOf(row) === status).length;

export const countPendingClearance = (rows: Request[]) =>
  rows.filter((row) => clearanceStatusOf(row) !== 'Cleared').length;

export const countByIssue = (rows: Request[], status: IssueStatus) =>
  rows.filter((row) => issueStatusOf(row) === status).length;

export const totalOutstanding = (rows: Request[]) =>
  rows.reduce((total, row) => total + outstandingOf(row), 0);

/** The date the dialogs propose. */
export const DECISION_ON = RUN_DATE;
