import { daysBetween, shortDate } from '../../../ai-insights/data/dates';

/** This page's clock. See the deviation note above. */
export const RUN_DATE = '31 Jul 2026';

export const ACADEMIC_YEAR = '2026-2027';

/* ------------------------------------------------------------------ *
 * The register-wide figures                                          *
 * ------------------------------------------------------------------ */

export const TOTAL_JOBS = 268;
export const READY_TO_GENERATE = 11;
export const GENERATED_TODAY = 24;
export const ISSUED_TOTAL = 196;
export const PENDING_APPROVAL = 9;
export const AWAITING_PRINT = 14;
export const PRINTED_NOT_ISSUED = 18;
export const FAILED_RUNS = 2;

/* ------------------------------------------------------------------ *
 * What the office issues                                             *
 * ------------------------------------------------------------------ */

export type RecipientType = 'Student' | 'Staff';

export type CertificateType =
  | 'Merit Certificate'
  | 'Participation Certificate'
  | 'Bonafide Certificate'
  | 'Transfer Certificate'
  | 'Service Certificate'
  | 'Course Completion';

export type GenerationStatus = 'Pending Approval' | 'Ready to Generate' | 'Generated' | 'Failed';
export type PrintStatus = 'Not Printed' | 'Print Queued' | 'Partly Printed' | 'Printed';
export type IssueStatus = 'Not Issued' | 'Partly Issued' | 'Issued';

export const TYPE_META: Record<CertificateType, { icon: string; tint: string }> = {
  'Merit Certificate': { icon: 'ti ti-award', tint: 'warning' },
  'Participation Certificate': { icon: 'ti ti-certificate', tint: 'info' },
  'Bonafide Certificate': { icon: 'ti ti-file-check', tint: 'primary' },
  'Transfer Certificate': { icon: 'ti ti-arrow-right-circle', tint: 'purple' },
  'Service Certificate': { icon: 'ti ti-briefcase', tint: 'success' },
  'Course Completion': { icon: 'ti ti-school', tint: 'danger' },
};

/** The layouts the office prints from, and what each is meant for. */
export const TEMPLATES = [
  { name: 'Junior certificate, A4 landscape', scope: 'Classes I to V', elements: 6, isDefault: true, tint: 'warning' },
  { name: 'Middle certificate, A4 landscape', scope: 'Classes VI to VIII', elements: 6, isDefault: true, tint: 'success' },
  { name: 'Senior certificate, A4 landscape', scope: 'Classes IX to XII', elements: 7, isDefault: true, tint: 'primary' },
  { name: 'Standard bonafide, A4 portrait', scope: 'Every class', elements: 5, isDefault: false, tint: 'info' },
  { name: 'Service certificate, letterhead', scope: 'Teaching and administration', elements: 5, isDefault: false, tint: 'purple' },
  { name: 'Merit card, A5', scope: 'Assembly awards', elements: 4, isDefault: false, tint: 'danger' },
];

export const SIGNATORIES = [
  'Mrs. Alice Ray · Chief Warden',
  'Principal',
  'Ms. Fatima Sheikh · Librarian',
  'Mr. Vikram Sethi · Science',
];

export const RUN_OPERATORS = ['Ms. Fatima Sheikh · School Office', 'Ms. Dana Ruiz · Front Office'];

export const PAPER_STOCKS = [
  'A4 landscape, certificate stock',
  'A4 portrait, letterhead',
  'A5 merit card',
];

export const COLLECTION_POINTS = [
  'School office, counter 2',
  'Class teacher',
  'With the term reports',
  'At the assembly',
];

/* ------------------------------------------------------------------ *
 * The register                                                       *
 * ------------------------------------------------------------------ */

export interface Entry {
  title: string;
  note: string;
}

export interface Attachment {
  name: string;
  note: string;
}

export interface Run {
  label: string;
  date: string;
  note: string;
  outcome: string;
}

export interface Job {
  ref: string;
  recipient: string;
  recipientType: RecipientType;
  scope: string;
  /** How many certificates the job covers. Every share is read against this. */
  recipients: number;
  sourceRecord: string;
  certificateType: CertificateType;
  template: string;
  signatory: string | null;
  approvedOn: string | null;
  generatedBy: string | null;
  generatedByRole: string | null;
  generatedOn: string | null;
  /** The last run the job attempted, if it ever started one. */
  run: Run | null;
  /** Records the last run could not use. Only a stopped run has any. */
  failedRecords: number;
  printed: number;
  issued: number;
  /** Copies to a sheet on a batch print; the remaining-sheets figure follows. */
  perSheet: number | null;
  printHistory: Entry[];
  issueTimeline: Entry[];
  attachments: Attachment[];
  notes: string;
  /** The line the certificate itself carries, once one exists. */
  citation: string | null;
  /** Who has not collected, where a printed copy is still at the counter. */
  outstanding: string | null;
  /** Since when it has been at the counter. */
  counterSince: string | null;
  /** Why an approved job has not run yet. */
  heldFor: string | null;
  /** What stopped a failed run. */
  blockedBy: string | null;
  /** Where a part-finished print run halted. */
  printStoppedAt: string | null;
}

const seeded: Job[] = [
  {
    ref: 'GEN-2026-0448',
    recipient: 'Science Exhibition winners',
    recipientType: 'Student',
    scope: 'Classes VIII to XI · placed entries',
    recipients: 3,
    sourceRecord: 'COMP-2026-0071 · Annual Science Exhibition 2026',
    certificateType: 'Merit Certificate',
    template: 'Senior certificate, A4 landscape',
    signatory: 'Mrs. Alice Ray',
    approvedOn: '17 Jul 2026',
    generatedBy: 'Ms. Fatima Sheikh',
    generatedByRole: 'School Office · Records',
    generatedOn: '18 Jul 2026',
    run: {
      label: 'Batch run CR-2026-041',
      date: '18 Jul 2026',
      note: '3 certificates generated',
      outcome: 'Completed',
    },
    failedRecords: 0,
    printed: 3,
    issued: 2,
    perSheet: null,
    printHistory: [
      { title: 'Batch print, A4 landscape', note: '18 Jul 2026 · 3 copies printed and sealed' },
    ],
    issueTimeline: [
      { title: 'Ananya Rao · X B', note: '19 Jul 2026' },
      { title: 'Rohan Desai · IX C', note: '19 Jul 2026' },
    ],
    attachments: [
      { name: 'Exhibition Result Sheet.pdf', note: 'Both judging panels · 108 KB' },
      { name: 'Merit Certificate Proof.pdf', note: 'Approved layout · 84 KB' },
    ],
    notes:
      'Third place certificate is still at the counter. Nikhil Menon of XI A has not collected it yet.',
    citation: 'Awarded for first place at the Annual Science Exhibition 2026.',
    outstanding: 'Nikhil Menon · XI A',
    counterSince: '18 Jul 2026',
    heldFor: null,
    blockedBy: null,
    printStoppedAt: null,
  },
  {
    ref: 'GEN-2026-0451',
    recipient: 'Junior Reading Challenge',
    recipientType: 'Student',
    scope: 'Classes I to IV · all entries',
    recipients: 122,
    sourceRecord: 'COMP-2026-0078 · Junior Reading Challenge Term 2',
    certificateType: 'Participation Certificate',
    template: 'Junior certificate, A4 landscape',
    signatory: 'Ms. Fatima Sheikh',
    approvedOn: '29 Jul 2026',
    generatedBy: 'Ms. Fatima Sheikh',
    generatedByRole: 'School Office · Records',
    generatedOn: '30 Jul 2026',
    run: {
      label: 'Batch run CR-2026-047',
      date: '30 Jul 2026',
      note: '122 certificates generated',
      outcome: 'Completed',
    },
    failedRecords: 0,
    printed: 96,
    issued: 0,
    perSheet: 8,
    printHistory: [
      { title: 'Batch print, sheet 1 to 12', note: '30 Jul 2026 · 96 copies printed' },
      { title: 'Sheets 13 to 16 held', note: '31 Jul 2026 · 26 copies queued, paper reload' },
    ],
    issueTimeline: [],
    attachments: [
      { name: 'Reading Log Summary.pdf', note: 'Junior section · 78 KB' },
      { name: 'Certificate Proof.pdf', note: 'Junior template · 72 KB' },
    ],
    notes:
      'Printing stopped at sheet 12 for a paper reload. The remaining copies go out with the term report pack.',
    citation: null,
    outstanding: null,
    counterSince: null,
    heldFor: null,
    blockedBy: null,
    printStoppedAt: 'Sheet 12 · paper reload',
  },
  {
    ref: 'GEN-2026-0455',
    recipient: 'Ananya Rao',
    recipientType: 'Student',
    scope: 'AD9887402 · Class X, Section B',
    recipients: 1,
    sourceRecord: 'ACH-2026-0218 · certificate CRT-2026-0412',
    certificateType: 'Merit Certificate',
    template: 'Senior certificate, A4 landscape',
    signatory: 'Mrs. Alice Ray',
    approvedOn: '20 Jul 2026',
    generatedBy: 'Ms. Fatima Sheikh',
    generatedByRole: 'School Office · Records',
    generatedOn: '22 Jul 2026',
    run: {
      label: 'Single certificate',
      date: '22 Jul 2026',
      note: 'CRT-2026-0412 generated',
      outcome: 'Completed',
    },
    failedRecords: 0,
    printed: 1,
    issued: 1,
    perSheet: null,
    printHistory: [
      { title: 'Original, signed and sealed', note: '22 Jul 2026 · 1 copy printed' },
      { title: 'Duplicate for the portfolio', note: '25 Jul 2026 · 1 copy printed' },
    ],
    issueTimeline: [{ title: 'Ananya Rao · X B', note: '23 Jul 2026' }],
    attachments: [{ name: 'Certificate CRT-2026-0412.pdf', note: 'Signed and sealed · 96 KB' }],
    notes:
      'Requested by the State Science Council. A duplicate was printed on 25 Jul for the school portfolio.',
    citation:
      'was awarded first place at the Annual Science Exhibition 2026 held on 16 and 17 July 2026.',
    outstanding: null,
    counterSince: null,
    heldFor: null,
    blockedBy: null,
    printStoppedAt: null,
  },
  {
    ref: 'GEN-2026-0459',
    recipient: 'Meera Iyer',
    recipientType: 'Student',
    scope: 'AD9893660 · Class V, Section A',
    recipients: 1,
    sourceRecord: 'ACH-2026-0226 · certificate CRT-2026-0421',
    certificateType: 'Merit Certificate',
    template: 'Junior certificate, A4 landscape',
    signatory: null,
    approvedOn: null,
    generatedBy: null,
    generatedByRole: null,
    generatedOn: null,
    run: null,
    failedRecords: 0,
    printed: 0,
    issued: 0,
    perSheet: null,
    printHistory: [],
    issueTimeline: [],
    attachments: [
      { name: 'Draft Certificate.pdf', note: 'Unsigned proof · 64 KB' },
      { name: 'Youth Festival Certificate.pdf', note: 'SCA-2026-0192 · external · 88 KB' },
    ],
    notes:
      'Waiting on the Chief Warden signature. Nothing generates from this job until the approval lands.',
    citation: null,
    outstanding: null,
    counterSince: null,
    heldFor: null,
    blockedBy: null,
    printStoppedAt: null,
  },
  {
    ref: 'GEN-2026-0462',
    recipient: 'Staff service certificates',
    recipientType: 'Staff',
    scope: 'Teaching and administration · on request',
    recipients: 4,
    sourceRecord: 'HR record · four open requests',
    certificateType: 'Service Certificate',
    template: 'Service certificate, letterhead',
    signatory: 'Mrs. Alice Ray',
    approvedOn: '30 Jul 2026',
    generatedBy: null,
    generatedByRole: null,
    generatedOn: null,
    run: null,
    failedRecords: 0,
    printed: 0,
    issued: 0,
    perSheet: null,
    printHistory: [],
    issueTimeline: [],
    attachments: [{ name: 'Service Record Extracts.pdf', note: 'Four staff members · 142 KB' }],
    notes: 'Approved and queued. The run is held for the letterhead stock arriving on 3 Aug.',
    citation: null,
    outstanding: null,
    counterSince: null,
    heldFor: 'Letterhead stock, 3 Aug',
    blockedBy: null,
    printStoppedAt: null,
  },
  {
    ref: 'GEN-2026-0465',
    recipient: 'Inter-House Chess Tournament',
    recipientType: 'Student',
    scope: 'All four houses · every entry',
    recipients: 52,
    sourceRecord: 'COMP-2026-0074 · results awaited',
    certificateType: 'Participation Certificate',
    template: 'Middle certificate, A4 landscape',
    signatory: null,
    approvedOn: null,
    generatedBy: null,
    generatedByRole: null,
    generatedOn: null,
    run: null,
    failedRecords: 0,
    printed: 0,
    issued: 0,
    perSheet: null,
    printHistory: [],
    issueTimeline: [],
    attachments: [{ name: 'Round Pairing Sheet.pdf', note: 'Six rounds · 44 KB' }],
    notes:
      'Cannot be approved until the arbiter countersigns the score sheets and the result is published.',
    citation: null,
    outstanding: null,
    counterSince: null,
    heldFor: null,
    blockedBy: null,
    printStoppedAt: null,
  },
  {
    ref: 'GEN-2026-0468',
    recipient: 'Bonafide request queue',
    recipientType: 'Student',
    scope: 'Six approved requests · mixed classes',
    recipients: 6,
    sourceRecord: 'Bonafide register · six approved requests',
    certificateType: 'Bonafide Certificate',
    template: 'Standard bonafide, A4 portrait',
    signatory: 'Ms. Dana Ruiz',
    approvedOn: '30 Jul 2026',
    generatedBy: 'Ms. Dana Ruiz',
    generatedByRole: 'Administration · Front Office',
    generatedOn: '31 Jul 2026',
    run: {
      label: 'Batch run CR-2026-049',
      date: '31 Jul 2026',
      note: '6 certificates generated',
      outcome: 'Completed',
    },
    failedRecords: 0,
    printed: 6,
    issued: 6,
    perSheet: null,
    printHistory: [
      { title: 'Batch print, A4 portrait', note: '31 Jul 2026 · 6 copies printed and sealed' },
    ],
    issueTimeline: [{ title: 'Handed over at counter 2', note: '31 Jul 2026' }],
    attachments: [{ name: 'Bonafide Batch Manifest.pdf', note: 'Six requests · 58 KB' }],
    notes: 'Same day turnaround. Every copy was collected at counter 2 before the office closed.',
    citation: null,
    outstanding: null,
    counterSince: null,
    heldFor: null,
    blockedBy: null,
    printStoppedAt: null,
  },
  {
    ref: 'GEN-2026-0470',
    recipient: 'Robotics Club completion',
    recipientType: 'Student',
    scope: 'Classes VII to X · club members',
    recipients: 18,
    sourceRecord: 'Robotics Club · summer module',
    certificateType: 'Course Completion',
    template: 'Senior certificate, A4 landscape',
    signatory: 'Mr. Vikram Sethi',
    approvedOn: '28 Jul 2026',
    generatedBy: 'Ms. Fatima Sheikh',
    generatedByRole: 'School Office · Records',
    generatedOn: null,
    run: {
      label: 'Batch run CR-2026-045',
      date: '29 Jul 2026',
      note: 'Stopped after 6 records failed validation',
      outcome: 'Stopped on validation',
    },
    failedRecords: 6,
    printed: 0,
    issued: 0,
    perSheet: null,
    printHistory: [],
    issueTimeline: [],
    attachments: [
      { name: 'Validation Report.pdf', note: 'Six records missing a completion date · 46 KB' },
    ],
    notes:
      'Six of the eighteen members have no module completion date on file. The club coordinator was asked to fill them in.',
    citation: null,
    outstanding: null,
    counterSince: null,
    heldFor: null,
    blockedBy: 'Missing completion date',
    printStoppedAt: null,
  },
];

export const jobs: Job[] = seeded;

/* ------------------------------------------------------------------ *
 * What a job knows about itself                                      *
 * ------------------------------------------------------------------ */

/** The template floors its shares: 96 of 122 prints as 78, not 79. */
export const shareOf = (part: number, whole: number) =>
  whole === 0 ? 0 : Math.floor((part / whole) * 100);

/** How long ago something happened, said the way the grid says it. */
export const agoOf = (date: string | null) => {
  if (!date) return '—';
  const days = daysBetween(date, RUN_DATE);
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  return `${days} days ago`;
};

export const certificatesLabelOf = (row: Job) =>
  `${row.recipients} ${row.recipients === 1 ? 'certificate' : 'certificates'}`;

export const recipientsLabelOf = (row: Job) =>
  `${row.recipients} ${row.recipients === 1 ? 'recipient' : 'recipients'}`;

/** How far the job has actually got. */
export const generationStatusOf = (row: Job): GenerationStatus => {
  if (row.failedRecords > 0) return 'Failed';
  if (row.generatedOn) return 'Generated';
  if (row.approvedOn) return 'Ready to Generate';
  return 'Pending Approval';
};

export const generationPill = (status: GenerationStatus) =>
  ({
    'Pending Approval': 'is-review',
    'Ready to Generate': 'is-active',
    Generated: 'is-completed',
    Failed: 'is-blocked',
  })[status];

/** The line under the generation pill. */
export const generationNoteOf = (row: Job) => {
  const status = generationStatusOf(row);
  if (status === 'Failed') return 'Validation stopped the run';
  if (status === 'Generated') return `${row.generatedBy} · ${shortDate(row.generatedOn as string)}`;
  if (status === 'Ready to Generate') return `Approved by ${row.signatory}`;
  return 'Awaiting a signatory';
};

/** Printed against recipients — the template never stores this. */
export const printStatusOf = (row: Job): PrintStatus => {
  if (row.printed === 0) return row.printStoppedAt ? 'Print Queued' : 'Not Printed';
  if (row.printed >= row.recipients) return 'Printed';
  return 'Partly Printed';
};

export const printBadge = (status: PrintStatus) =>
  ({
    'Not Printed': 'secondary',
    'Print Queued': 'info',
    'Partly Printed': 'warning',
    Printed: 'success',
  })[status];

export const printNoteOf = (row: Job) => {
  if (row.printed === 0) return 'Nothing generated yet';
  return `${row.printed} of ${row.recipients} · ${shareOf(row.printed, row.recipients)}%`;
};

export const issueStatusOf = (row: Job): IssueStatus => {
  if (row.issued === 0) return 'Not Issued';
  if (row.issued >= row.recipients) return 'Issued';
  return 'Partly Issued';
};

export const issueBadge = (status: IssueStatus) =>
  ({ 'Not Issued': 'secondary', 'Partly Issued': 'warning', Issued: 'success' })[status];

export const issueNoteOf = (row: Job) => {
  if (row.issued > 0) return `${row.issued} of ${row.recipients} · ${shareOf(row.issued, row.recipients)}%`;
  return row.printed > 0 ? 'Held at the office' : 'Nothing printed yet';
};

/** The line under Generated By. */
export const generatedByNoteOf = (row: Job) => row.generatedByRole ?? 'Not yet generated';

/** The line under Generated On. */
export const generatedOnNoteOf = (row: Job) => {
  if (row.generatedOn) return agoOf(row.generatedOn);
  if (generationStatusOf(row) === 'Failed' && row.run) return `Run stopped ${shortDate(row.run.date)}`;
  if (row.approvedOn) return `Approved ${shortDate(row.approvedOn)}`;
  return 'Not yet approved';
};

/** Copies printed but not handed over. */
export const atCounterOf = (row: Job) => row.printed - row.issued;

/** Copies still to print. */
export const remainingOf = (row: Job) => row.recipients - row.printed;

/** What the print dialog calls the outstanding work. */
export const remainingLabelOf = (row: Job) => {
  const copies = remainingOf(row);
  if (copies <= 0) return 'Nothing outstanding';
  if (!row.perSheet) return `${copies} ${copies === 1 ? 'copy' : 'copies'}`;
  const sheets = Math.ceil(copies / row.perSheet);
  return `${copies} copies · ${sheets} ${sheets === 1 ? 'sheet' : 'sheets'}`;
};

/** Records the last run could actually use. */
export const passingOf = (row: Job) => row.recipients - row.failedRecords;

/**
 * The verification code the preview prints.
 *
 * It is the certificate reference on the source record, tagged with the last
 * four of the recipient's admission number — so only a single-recipient job
 * generated against a certificate record has one.
 */
export const verificationCodeOf = (row: Job) => {
  const certificate = /\b(CRT-\d{4}-\d{4})\b/.exec(row.sourceRecord)?.[1];
  const admission = /\bAD(\d+)\b/.exec(row.scope)?.[1];
  if (!certificate || !admission || row.recipients !== 1) return null;
  return `${certificate}-${admission.slice(-4)}`;
};

/** The sentence the detail panel prints over the certificate preview. */
export const previewLineOf = (row: Job) =>
  `${row.scope} — from the ${row.template.toLowerCase()}.`;

/** What the preview box says when there is nothing to show yet. */
export const previewEmptyNoteOf = (row: Job) => {
  if (generationStatusOf(row) === 'Failed') return 'Validation stopped the run';
  return row.approvedOn ? 'Prints on the next run' : 'Prints once the job is approved';
};

export const issueEmptyNoteOf = (row: Job) =>
  row.printed > 0 ? 'Held at the office counter' : 'Available once the copies are printed';

export const isCompleteOf = (row: Job) =>
  row.issued >= row.recipients && row.recipients > 0;

/**
 * The buttons the expanded detail offers.
 *
 * The template gives each row a different pair, and the pair is always the next
 * thing the job needs — so it is read off the progress rather than listed row
 * by row.
 */
export interface DetailAction {
  label: string;
  icon: string;
  modal: 'generate' | 'bulk' | 'print' | 'issue' | 'preview' | 'template' | 'view';
  primary: boolean;
}

export const detailActionsOf = (row: Job): DetailAction[] => {
  const status = generationStatusOf(row);
  if (status === 'Failed') {
    return [
      { label: 'Retry Batch', icon: 'ti ti-refresh', modal: 'bulk', primary: true },
      { label: 'View Details', icon: 'ti ti-eye', modal: 'view', primary: false },
    ];
  }
  if (status === 'Pending Approval') {
    return [
      { label: 'Select Template', icon: 'ti ti-layout', modal: 'template', primary: true },
      { label: 'Preview', icon: 'ti ti-file-description', modal: 'preview', primary: false },
    ];
  }
  if (status === 'Ready to Generate') {
    return [
      { label: 'Run Generation', icon: 'ti ti-player-play', modal: 'generate', primary: true },
      { label: 'Select Template', icon: 'ti ti-layout', modal: 'template', primary: false },
    ];
  }
  if (row.printed < row.recipients) {
    return [
      { label: 'Print Certificates', icon: 'ti ti-printer', modal: 'print', primary: true },
      { label: 'Preview', icon: 'ti ti-file-description', modal: 'preview', primary: false },
    ];
  }
  if (row.issued < row.recipients) {
    return [
      { label: 'Issue Certificates', icon: 'ti ti-circle-check', modal: 'issue', primary: true },
      { label: 'View Details', icon: 'ti ti-eye', modal: 'view', primary: false },
    ];
  }
  return [{ label: 'View Details', icon: 'ti ti-eye', modal: 'view', primary: true }];
};

/** The four stages the side panel prints, with where the job has got to. */
export const workflowOf = (row: Job) => {
  const counter = atCounterOf(row);
  return [
    {
      stage: 'Result verified',
      owner: row.recipientType === 'Staff' ? 'HR office' : 'Judging panels',
      status: row.approvedOn ? 'Done' : 'Pending',
    },
    {
      stage: 'Job approved',
      owner: row.signatory ?? 'Not yet assigned',
      status: row.approvedOn ? 'Done' : 'Pending',
    },
    {
      stage: 'Generated and printed',
      owner: 'School office',
      status: row.printed >= row.recipients && row.generatedOn ? 'Done' : 'Pending',
    },
    {
      stage: 'Handover at the counter',
      owner: 'School office',
      status: counter > 0 ? `${counter} outstanding` : row.issued > 0 ? 'Done' : 'Pending',
    },
  ];
};

/** What kind of record the job was raised from. */
export const sourceKindOf = (row: Job) => {
  if (row.sourceRecord.startsWith('COMP-')) return 'competition result';
  if (row.sourceRecord.startsWith('ACH-')) return 'achievement record';
  if (row.sourceRecord.startsWith('Bonafide')) return 'bonafide register';
  if (row.sourceRecord.startsWith('HR ')) return 'HR request';
  return 'club record';
};

/** The reference the source record carries, where it names one. */
export const sourceRefOf = (row: Job) => row.sourceRecord.split(' · ')[0];

/**
 * The audit trail the side panel prints: what created the job, what the run
 * did, and where the certificates ended up. Each line is the register's own
 * dates, so a job that moves rewrites its own trail.
 */
export const auditOf = (row: Job): Entry[] => {
  const trail: Entry[] = [
    {
      title: `Job created from the ${sourceKindOf(row)}`,
      note: `${row.approvedOn ?? 'Not yet approved'} · automated`,
    },
  ];
  if (row.run) {
    const finished = row.run.outcome === 'Completed';
    trail.push({
      title: `${row.run.label} ${finished ? 'completed' : 'stopped'}`,
      note: `${row.run.date} · ${finished ? certificatesLabelOf(row) : row.run.note.toLowerCase()}`,
    });
  }
  if (row.issueTimeline.length > 0) {
    trail.push({
      title: `Linked to ${sourceRefOf(row)}`,
      note: `${row.issueTimeline[0].note} · automated`,
    });
  }
  return trail;
};

export const searchIndexOf = (row: Job) =>
  [
    row.ref,
    row.recipient,
    row.certificateType,
    row.template,
    row.sourceRecord,
    row.generatedBy ?? '',
    generationStatusOf(row),
  ]
    .join(' ')
    .toLowerCase();

/* ------------------------------------------------------------------ *
 * The filter options and the counts                                  *
 * ------------------------------------------------------------------ */

export const certificateTypeOptions: CertificateType[] = [
  'Merit Certificate',
  'Participation Certificate',
  'Bonafide Certificate',
  'Transfer Certificate',
  'Service Certificate',
  'Course Completion',
];

export const recipientTypeOptions: RecipientType[] = ['Student', 'Staff'];
export const academicYearOptions = ['2026-2027', '2025-2026', '2024-2025'];
export const generationStatusOptions: GenerationStatus[] = [
  'Pending Approval',
  'Ready to Generate',
  'Generated',
  'Failed',
];
export const printStatusOptions: PrintStatus[] = [
  'Not Printed',
  'Print Queued',
  'Partly Printed',
  'Printed',
];
export const issueStatusOptions: IssueStatus[] = ['Not Issued', 'Partly Issued', 'Issued'];
export const templateOptions = TEMPLATES.map((entry) => entry.name);

/** The job picker every dialog carries. */
export const jobOptions = jobs.map((row) => `${row.ref} · ${row.recipient}`);

export const countByGeneration = (rows: Job[], status: GenerationStatus) =>
  rows.filter((row) => generationStatusOf(row) === status).length;

export const countAwaitingPrint = (rows: Job[]) =>
  rows.filter((row) => row.generatedOn !== null && row.printed < row.recipients).length;

export const countIssued = (rows: Job[]) =>
  rows.filter((row) => issueStatusOf(row) === 'Issued').length;

export const countGeneratedOn = (rows: Job[], date: string) =>
  rows.filter((row) => row.generatedOn === date).length;

export const totalRecipients = (rows: Job[]) =>
  rows.reduce((total, row) => total + row.recipients, 0);

export const totalPrinted = (rows: Job[]) => rows.reduce((total, row) => total + row.printed, 0);

export const totalIssued = (rows: Job[]) => rows.reduce((total, row) => total + row.issued, 0);

/** The date the dialogs propose. */
export const RUN_ON = RUN_DATE;
