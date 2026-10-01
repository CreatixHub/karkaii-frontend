/* ------------------------------- The register ------------------------------ */

export const REGISTER_TOTAL = 2184;
export const ACADEMIC_YEAR = '2026-2027';
export const REPORT_RANGE = '01 Apr 2026 - 31 Jul 2026';

/** The register's own clock: 31 July 2026, as day-of-year from 1 April. */
export const REGISTER_DATE = '31 Jul 2026';

/** Late fee policy, printed on every record's panel. */
export const LATE_FEE_PER_DAY = 50;
export const GRACE_DAYS = 7;

/* --------------------------------- Shapes ---------------------------------- */

export type CollectionStatus = 'Paid' | 'Partially Paid' | 'Pending' | 'Overdue' | 'Waived';

export type PaymentMethod =
  | 'Cash'
  | 'UPI'
  | 'Net Banking'
  | 'Card'
  | 'Cheque'
  | 'Bank Transfer'
  | 'Not selected';

export interface Payment {
  amount: number;
  method: string;
  date: string;
  receipt?: string;
  note?: string;
}

export interface Installment {
  label: string;
  due: string;
  amount: number;
  /** Paid / Overdue / Upcoming / Part / Settled / Scheduled / Pending. */
  state: string;
}

export interface ListEntry {
  title: string;
  detail: string;
}

export interface NoteEntry {
  author: string;
  role: string;
  date: string;
  body: string;
}

export interface FeeRecord {
  id: string;
  student: string;
  image: string;
  admission: string;
  admitted: string;
  roll: string;
  guardian: string;
  /** The badge the grid puts beside the name, where the record carries one. */
  flags: string[];

  className: string;
  section: string;
  feeCategory: string;
  feeNote: string;
  plan: string;

  /** The billing. Everything in rupees is computed from these. */
  installment: number;
  installments: number;
  /**
   * The plan's annual total, where it covers more heads than this row bills —
   * a board year that adds an exam fee, or a plan carrying both tuition and
   * transport. Falls back to `installment × installments`.
   */
  annualFee?: number;
  /** What a percentage concession applies to, where that is not the whole plan. */
  concessionBase?: number;
  /** What this row bills, which is one installment on most records. */
  billed: number;
  paid: number;
  /** Written off against a grant or an approved waiver. */
  waived?: number;

  /** 5 means a five per cent concession on the annual fee. */
  concessionRate?: number;
  concessionLabel?: string;
  concessionNote?: string;
  scholarshipRate?: number;
  scholarshipLabel?: string;
  scholarshipNote?: string;
  approvedBy?: string;

  dueDate: string;
  /** Days from the due date to the register date; negative means still to come. */
  daysFromDue: number;
  /** An approved extension moves the due date, and with it the overdue count. */
  extensionTo?: string;
  extensionDays?: number;
  /** Set where the fine was charged and then written off. */
  fineWaived?: boolean;

  method: PaymentMethod;
  methodNote: string;
  receipt?: string;
  receiptDate?: string;
  statusNote: string;
  /** Days between the due date and the payment; negative means early. */
  paymentDelay: number;
  preferredMethod: string;

  payments: Payment[];
  schedule: Installment[];
  nextDue: string;
  breakdown: { label: string; amount: number | null; note?: string }[];
  receipts: ListEntry[];
  notes: NoteEntry[];
  noteTags: string[];
  audit: ListEntry[];
}

/* -------------------------------- The records ------------------------------ */

export const feeRecords: FeeRecord[] = [
  {
    id: 'RCP-2026-1841',
    student: 'Ananya Rao',
    image: 'assets/img/students/student-01.jpg',
    admission: 'AD9887402',
    admitted: 'Admitted Jun 2019',
    roll: 'Roll 14',
    guardian: 'Mr. Rakesh Rao',
    flags: [],
    className: 'Class X',
    section: 'B',
    feeCategory: 'Tuition Fee',
    feeNote: 'Term 2 · Jul 2026',
    plan: 'Senior · 4 installments',
    installment: 86000,
    installments: 4,
    billed: 86000,
    paid: 86000,
    concessionRate: 5,
    concessionLabel: 'Sibling discount · 5%',
    concessionNote: 'Applied on tuition',
    approvedBy: 'Mr. Rajiv Menon',
    dueDate: '10 Jul 2026',
    daysFromDue: 21,
    method: 'UPI',
    methodNote: 'Gateway · 4 Jul 2026',
    receipt: 'RCP-2026-1841',
    receiptDate: '4 Jul 2026',
    statusNote: 'Settled in full',
    paymentDelay: -6,
    preferredMethod: 'Online',
    payments: [
      { amount: 86000, method: 'UPI', date: '4 Jul 2026', receipt: 'RCP-2026-1841' },
      { amount: 86000, method: 'Net Banking', date: '8 Apr 2026', receipt: 'RCP-2026-0412' },
    ],
    schedule: [
      { label: 'Term 1', due: '10 Apr', amount: 86000, state: 'Paid' },
      { label: 'Term 2', due: '10 Jul', amount: 86000, state: 'Paid' },
      { label: 'Term 3', due: '10 Oct', amount: 86000, state: 'Upcoming' },
      { label: 'Term 4', due: '10 Jan', amount: 86000, state: 'Upcoming' },
    ],
    nextDue: '10 Oct 2026',
    breakdown: [{ label: 'Current Balance', amount: 0 }],
    receipts: [
      { title: 'RCP-2026-1841', detail: '4 Jul 2026 · emailed' },
      { title: 'RCP-2026-0412', detail: '8 Apr 2026 · printed' },
    ],
    notes: [
      {
        author: 'Ms. Fatima Sheikh',
        role: 'Accounts',
        date: '5 Jul 2026',
        body: 'Term 2 settled ahead of the due date. Sibling discount carried forward correctly.',
      },
    ],
    noteTags: ['Auto-debit enrolled', 'Receipt emailed'],
    audit: [
      { title: 'Payment recorded', detail: '4 Jul 2026 · payment gateway' },
      { title: 'Receipt emailed to guardian', detail: '4 Jul 2026 · system' },
    ],
  },

  {
    id: 'RCP-2026-1602',
    student: 'Rohan Verma',
    image: 'assets/img/students/student-02.jpg',
    admission: 'AD9892518',
    admitted: 'Admitted Jun 2020',
    roll: 'Roll 09',
    guardian: 'Mrs. Sunita Verma',
    flags: ['Defaulter'],
    className: 'Class IX',
    section: 'C',
    feeCategory: 'Tuition + Transport',
    feeNote: 'Term 2 · Jul 2026',
    plan: 'Senior + transport',
    installment: 104000,
    installments: 4,
    billed: 104000,
    paid: 42000,
    dueDate: '10 Jul 2026',
    daysFromDue: 21,
    method: 'Cash',
    methodNote: 'Counter 1 · 12 Jun 2026',
    receipt: 'RCP-2026-1602',
    receiptDate: 'Part payment',
    statusNote: '2 reminders sent',
    paymentDelay: 18,
    preferredMethod: 'Cash at counter',
    payments: [
      { amount: 42000, method: 'Cash', date: '12 Jun 2026', receipt: 'RCP-2026-1602', note: 'part' },
      { amount: 104000, method: 'Cash', date: '18 Apr 2026', receipt: 'RCP-2026-0518' },
    ],
    schedule: [
      { label: 'Term 1', due: '10 Apr', amount: 104000, state: 'Paid' },
      { label: 'Term 2', due: '10 Jul', amount: 104000, state: 'Overdue' },
      { label: 'Term 3', due: '10 Oct', amount: 104000, state: 'Upcoming' },
      { label: 'Term 4', due: '10 Jan', amount: 104000, state: 'Upcoming' },
    ],
    nextDue: 'Immediate',
    breakdown: [
      { label: 'Tuition Balance', amount: 44000 },
      { label: 'Transport Balance', amount: 18000 },
    ],
    receipts: [
      { title: 'RCP-2026-1602', detail: '12 Jun 2026 · part payment' },
      { title: 'RCP-2026-0518', detail: '18 Apr 2026 · printed' },
    ],
    notes: [
      {
        author: 'Mr. Rajiv Menon',
        role: 'Accounts Head',
        date: '28 Jul 2026',
        body: 'Guardian has asked to clear the balance in two parts by 20 Aug. Awaiting approval.',
      },
    ],
    noteTags: ['Escalated', 'Instalment plan requested'],
    audit: [
      { title: 'Second reminder sent', detail: '25 Jul 2026 · SMS and email' },
      { title: 'Flagged as defaulter', detail: '24 Jul 2026 · system rule' },
    ],
  },

  {
    id: 'RCP-2026-1855',
    student: 'Meera Iyer',
    image: 'assets/img/students/student-03.jpg',
    admission: 'AD9893660',
    admitted: 'Admitted Jun 2022',
    roll: 'Roll 21',
    guardian: 'Mrs. Lakshmi Iyer',
    flags: [],
    className: 'Class V',
    section: 'A',
    feeCategory: 'Tuition Fee',
    feeNote: 'Term 2 · Jul 2026',
    plan: 'Junior · 4 installments',
    installment: 64000,
    installments: 4,
    billed: 64000,
    paid: 64000,
    dueDate: '10 Jul 2026',
    daysFromDue: 21,
    method: 'Net Banking',
    methodNote: 'Gateway · 9 Jul 2026',
    receipt: 'RCP-2026-1855',
    receiptDate: '9 Jul 2026',
    statusNote: 'Settled in full',
    paymentDelay: -1,
    preferredMethod: 'Net banking',
    payments: [
      { amount: 64000, method: 'Net Banking', date: '9 Jul 2026', receipt: 'RCP-2026-1855' },
      { amount: 64000, method: 'Net Banking', date: '9 Apr 2026', receipt: 'RCP-2026-0446' },
    ],
    schedule: [
      { label: 'Term 1', due: '10 Apr', amount: 64000, state: 'Paid' },
      { label: 'Term 2', due: '10 Jul', amount: 64000, state: 'Paid' },
      { label: 'Term 3', due: '10 Oct', amount: 64000, state: 'Upcoming' },
      { label: 'Term 4', due: '10 Jan', amount: 64000, state: 'Upcoming' },
    ],
    nextDue: '10 Oct 2026',
    breakdown: [{ label: 'Current Balance', amount: 0 }],
    receipts: [
      { title: 'RCP-2026-1855', detail: '9 Jul 2026 · emailed' },
      { title: 'RCP-2026-0446', detail: '9 Apr 2026 · emailed' },
    ],
    notes: [
      {
        author: 'Ms. Fatima Sheikh',
        role: 'Accounts',
        date: '10 Jul 2026',
        body: 'Merit concession paperwork raised for Term 3 on the strength of the Term 1 result.',
      },
    ],
    noteTags: ['Auto-debit enrolled', 'Concession pending'],
    audit: [
      { title: 'Payment recorded', detail: '9 Jul 2026 · payment gateway' },
      { title: 'Concession application raised', detail: '10 Jul 2026 · Ms. Fatima Sheikh' },
    ],
  },

  {
    id: 'RCP-2026-1733',
    student: 'Kabir Nair',
    image: 'assets/img/students/student-04.jpg',
    admission: 'AD9893745',
    admitted: 'Admitted Jun 2021',
    roll: 'Roll 07',
    guardian: 'Mr. Suresh Nair',
    flags: ['Hostel'],
    className: 'Class VII',
    section: 'B',
    feeCategory: 'Tuition + Hostel',
    feeNote: 'Term 2 · Jul 2026',
    plan: 'Middle + hostel',
    installment: 132000,
    installments: 4,
    billed: 132000,
    paid: 88000,
    scholarshipRate: 10,
    scholarshipLabel: 'Sports quota · 10%',
    scholarshipNote: 'District athletics',
    approvedBy: 'Principal · 2 Jun 2026',
    dueDate: '10 Jul 2026',
    daysFromDue: 21,
    extensionTo: '15 Aug 2026',
    extensionDays: 36,
    fineWaived: true,
    method: 'Cheque',
    methodNote: 'Counter 2 · 8 Jul 2026',
    receipt: 'RCP-2026-1733',
    receiptDate: '8 Jul 2026',
    statusNote: 'Plan approved',
    paymentDelay: 2,
    preferredMethod: 'Cheque at counter',
    payments: [
      { amount: 88000, method: 'Cheque', date: '8 Jul 2026', receipt: 'RCP-2026-1733', note: 'cleared' },
      { amount: 132000, method: 'Cheque', date: '11 Apr 2026', receipt: 'RCP-2026-0489' },
    ],
    schedule: [
      { label: 'Term 1', due: '10 Apr', amount: 132000, state: 'Paid' },
      { label: 'Term 2', due: '10 Jul', amount: 132000, state: 'Part' },
      { label: 'Balance', due: '15 Aug', amount: 44000, state: 'Scheduled' },
      { label: 'Term 3', due: '10 Oct', amount: 132000, state: 'Upcoming' },
    ],
    nextDue: '15 Aug 2026',
    breakdown: [
      { label: 'Tuition Balance', amount: 0 },
      { label: 'Hostel Balance', amount: 44000 },
    ],
    receipts: [
      { title: 'RCP-2026-1733', detail: '8 Jul 2026 · part payment' },
      { title: 'RCP-2026-0489', detail: '11 Apr 2026 · printed' },
    ],
    notes: [
      {
        author: 'Mr. Rajiv Menon',
        role: 'Accounts Head',
        date: '12 Jul 2026',
        body: 'Hostel balance deferred to 15 Aug against the sports quota award letter. Fine waived.',
      },
    ],
    noteTags: ['Extension approved', 'Fine waived'],
    audit: [
      { title: 'Due date extended to 15 Aug', detail: '12 Jul 2026 · Mr. Rajiv Menon' },
      { title: 'Late fine waived', detail: '12 Jul 2026' },
    ],
  },

  {
    id: 'RCP-2026-1790',
    student: 'Aaradhya Sharma',
    image: 'assets/img/students/student-06.jpg',
    admission: 'AD9892434',
    admitted: 'Admitted Jun 2019',
    roll: 'Roll 18',
    guardian: 'Mr. Rakesh Sharma',
    flags: [],
    className: 'Class X',
    section: 'B',
    feeCategory: 'Examination Fee',
    feeNote: 'Board · 2026-2027',
    plan: 'Senior · board year',
    installment: 12000,
    installments: 1,
    annualFee: 356000,
    billed: 12000,
    paid: 12000,
    dueDate: '5 Jul 2026',
    daysFromDue: 26,
    method: 'Card',
    methodNote: 'Gateway · 3 Jul 2026',
    receipt: 'RCP-2026-1790',
    receiptDate: '3 Jul 2026',
    statusNote: 'Board fee cleared',
    paymentDelay: -2,
    preferredMethod: 'Card and UPI',
    payments: [
      { amount: 12000, method: 'Card', date: '3 Jul 2026', receipt: 'RCP-2026-1790', note: 'exam fee' },
      { amount: 86000, method: 'UPI', date: '6 Jul 2026', receipt: 'RCP-2026-1847', note: 'tuition' },
    ],
    schedule: [
      { label: 'Exam Fee', due: '5 Jul', amount: 12000, state: 'Paid' },
      { label: 'Term 1', due: '10 Apr', amount: 86000, state: 'Paid' },
      { label: 'Term 2', due: '10 Jul', amount: 86000, state: 'Paid' },
      { label: 'Term 3', due: '10 Oct', amount: 86000, state: 'Upcoming' },
    ],
    nextDue: '10 Oct 2026',
    breakdown: [
      { label: 'Current Balance', amount: 0 },
      { label: 'Board Fee Status', amount: null, note: 'Remitted to board' },
    ],
    receipts: [
      { title: 'RCP-2026-1790', detail: '3 Jul 2026 · exam fee' },
      { title: 'RCP-2026-1847', detail: '6 Jul 2026 · tuition' },
    ],
    notes: [
      {
        author: 'Ms. Fatima Sheikh',
        role: 'Accounts',
        date: '6 Jul 2026',
        body: 'Board exam fee collected ahead of the 5 Jul cutoff and remitted in the 8 Jul batch.',
      },
    ],
    noteTags: ['Board remittance done', 'Receipt emailed'],
    audit: [
      { title: 'Exam fee recorded', detail: '3 Jul 2026 · payment gateway' },
      { title: 'Remitted to examination board', detail: '8 Jul 2026 · batch BRD-2026-04' },
    ],
  },

  {
    id: 'PEND-AD9893801',
    student: 'Ishaan Gupta',
    image: 'assets/img/students/student-09.jpg',
    admission: 'AD9893801',
    admitted: 'Admitted Jun 2020',
    roll: 'Roll 26',
    guardian: 'Mr. Anil Gupta',
    flags: ['Awaiting Payment'],
    className: 'Class IX',
    section: 'A',
    feeCategory: 'Tuition Fee',
    feeNote: 'Term 2 · Jul 2026',
    plan: 'Senior · 4 installments',
    installment: 86000,
    installments: 4,
    billed: 86000,
    paid: 0,
    concessionRate: 15,
    concessionLabel: 'Staff ward · 15%',
    concessionNote: 'Applied on tuition',
    approvedBy: 'Principal · 1 Apr 2026',
    dueDate: '10 Aug 2026',
    daysFromDue: -10,
    method: 'Not selected',
    methodNote: 'Payment link sent',
    statusNote: 'Within due date',
    paymentDelay: 4,
    preferredMethod: 'UPI',
    payments: [{ amount: 86000, method: 'UPI', date: '14 Apr 2026', receipt: 'RCP-2026-0521' }],
    schedule: [
      { label: 'Term 1', due: '10 Apr', amount: 86000, state: 'Paid' },
      { label: 'Term 2', due: '10 Aug', amount: 86000, state: 'Pending' },
      { label: 'Term 3', due: '10 Oct', amount: 86000, state: 'Upcoming' },
      { label: 'Term 4', due: '10 Jan', amount: 86000, state: 'Upcoming' },
    ],
    nextDue: '10 Aug 2026',
    breakdown: [{ label: 'Tuition Balance', amount: 86000 }],
    receipts: [{ title: 'RCP-2026-0521', detail: '14 Apr 2026 · emailed' }],
    notes: [
      {
        author: 'Ms. Fatima Sheikh',
        role: 'Accounts',
        date: '24 Jul 2026',
        body: 'Term 2 shifted to 10 Aug on the staff ward cycle. Payment link sent to the guardian.',
      },
    ],
    noteTags: ['Staff ward cycle', 'Link sent'],
    audit: [
      { title: 'Due date set to 10 Aug', detail: '1 Apr 2026 · staff ward schedule' },
      { title: 'Payment link sent', detail: '24 Jul 2026 · SMS and email' },
    ],
  },

  {
    id: 'RCP-2026-1812',
    student: 'Diya Menon',
    image: 'assets/img/students/student-10.jpg',
    admission: 'AD9893866',
    admitted: 'Admitted Jun 2021',
    roll: 'Roll 11',
    guardian: 'Mrs. Radha Menon',
    flags: ['Scholarship'],
    className: 'Class VII',
    section: 'A',
    feeCategory: 'Tuition Fee',
    feeNote: 'Term 2 · Jul 2026',
    plan: 'Middle · trust funded',
    installment: 92000,
    installments: 4,
    billed: 92000,
    paid: 46000,
    waived: 46000,
    scholarshipRate: 50,
    scholarshipLabel: 'Trust funded · 50%',
    scholarshipNote: 'Shiksha Trust · SCH-2026-0074',
    approvedBy: 'Valid until 31 Mar 2027',
    dueDate: '10 Jul 2026',
    daysFromDue: 21,
    method: 'Bank Transfer',
    methodNote: 'Trust grant · 7 Jul 2026',
    receipt: 'RCP-2026-1812',
    receiptDate: '7 Jul 2026',
    statusNote: '50% trust funded',
    paymentDelay: -3,
    preferredMethod: 'Grant plus UPI',
    payments: [
      { amount: 46000, method: 'Trust grant', date: '7 Jul 2026', receipt: 'RCP-2026-1812' },
      { amount: 46000, method: 'UPI', date: '7 Jul 2026', receipt: 'RCP-2026-1813', note: 'guardian share' },
    ],
    schedule: [
      { label: 'Term 1', due: '10 Apr', amount: 92000, state: 'Settled' },
      { label: 'Term 2', due: '10 Jul', amount: 92000, state: 'Settled' },
      { label: 'Term 3', due: '10 Oct', amount: 92000, state: 'Upcoming' },
      { label: 'Term 4', due: '10 Jan', amount: 92000, state: 'Upcoming' },
    ],
    nextDue: 'Grant renewal 1 Oct 2026',
    breakdown: [
      { label: 'Guardian Balance', amount: 0 },
      { label: 'Grant Receivable', amount: 0, note: 'credited' },
    ],
    receipts: [
      { title: 'RCP-2026-1812', detail: '7 Jul 2026 · grant' },
      { title: 'RCP-2026-1813', detail: '7 Jul 2026 · guardian' },
    ],
    notes: [
      {
        author: 'Mr. Rajiv Menon',
        role: 'Accounts Head',
        date: '8 Jul 2026',
        body: 'Trust tranche credited on 7 Jul against SCH-2026-0074. Renewal file due 1 Oct.',
      },
    ],
    noteTags: ['Trust funded', 'Renewal due Oct'],
    audit: [
      { title: 'Trust tranche credited', detail: '7 Jul 2026' },
      { title: 'Term 2 marked settled', detail: '7 Jul 2026 · Ms. Fatima Sheikh' },
    ],
  },

  {
    id: 'RCP-2026-1520',
    student: 'Arnav Deshmukh',
    image: 'assets/img/students/student-11.jpg',
    admission: 'AD9893910',
    admitted: 'Admitted Jun 2022',
    roll: 'Roll 32',
    guardian: 'Mr. Prakash Deshmukh',
    flags: ['Defaulter', 'Transport'],
    className: 'Class VIII',
    section: 'C',
    feeCategory: 'Transport Fee',
    feeNote: 'Route 4 · Term 2',
    plan: 'Middle + transport',
    installment: 28000,
    installments: 3,
    annualFee: 352000,
    concessionBase: 264000,
    billed: 28000,
    paid: 14000,
    concessionRate: 5,
    concessionLabel: 'Sibling discount · 5%',
    concessionNote: 'Tuition only · does not apply to transport',
    dueDate: '20 Jun 2026',
    daysFromDue: 41,
    method: 'UPI',
    methodNote: 'Gateway · 2 Jun 2026',
    receipt: 'RCP-2026-1520',
    receiptDate: 'Part payment',
    statusNote: 'Transport suspended',
    paymentDelay: 26,
    preferredMethod: 'UPI',
    payments: [
      { amount: 14000, method: 'UPI', date: '2 Jun 2026', receipt: 'RCP-2026-1520', note: 'part' },
      { amount: 28000, method: 'UPI', date: '15 Apr 2026', receipt: 'RCP-2026-0533' },
    ],
    schedule: [
      { label: 'Transport T1', due: '20 Apr', amount: 28000, state: 'Paid' },
      { label: 'Transport T2', due: '20 Jun', amount: 28000, state: 'Overdue' },
      { label: 'Transport T3', due: '20 Sep', amount: 28000, state: 'Upcoming' },
      { label: 'Tuition T2', due: '10 Jul', amount: 66000, state: 'Paid' },
    ],
    nextDue: 'Immediate',
    breakdown: [
      { label: 'Transport Balance', amount: 14000 },
      { label: 'Tuition Balance', amount: 0 },
    ],
    receipts: [
      { title: 'RCP-2026-1520', detail: '2 Jun 2026 · part payment' },
      { title: 'RCP-2026-0533', detail: '15 Apr 2026 · emailed' },
    ],
    notes: [
      {
        author: 'Mr. Suresh Pillai',
        role: 'Transport Manager',
        date: '28 Jul 2026',
        body: 'Route 4 seat released from 1 Aug. Reinstated once the balance and fine are cleared.',
      },
    ],
    noteTags: ['Service suspended', 'Third reminder due'],
    audit: [
      { title: 'Transport service suspended', detail: '28 Jul 2026 · Mr. Suresh Pillai' },
      { title: 'Second reminder sent', detail: '20 Jul 2026 · SMS and email' },
    ],
  },
];

/* -------------------------------- Formatting ------------------------------- */

/** Indian digit grouping: 1,04,000 rather than 104,000. */
export const rupees = (amount: number) => `₹${amount.toLocaleString('en-IN')}`;

/** Lakh and crore, as the summary strip and the analysis panel use them. */
export const shortRupees = (amount: number) => {
  if (Math.abs(amount) >= 10000000) return `₹${(amount / 10000000).toFixed(2)}Cr`;
  if (Math.abs(amount) >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
  return rupees(amount);
};

/* ------------------------------- Derivations ------------------------------- */

const round1 = (value: number) => Math.round(value * 10) / 10;

/** What the plan bills across the year, before any concession. */
export const annualFeeOf = (row: FeeRecord) => row.annualFee ?? row.installment * row.installments;

export const concessionOf = (row: FeeRecord) =>
  row.concessionRate
    ? Math.round(((row.concessionBase ?? annualFeeOf(row)) * row.concessionRate) / 100)
    : 0;

export const scholarshipOf = (row: FeeRecord) =>
  row.scholarshipRate ? Math.round((annualFeeOf(row) * row.scholarshipRate) / 100) : 0;

/** The figure the ledger raises before the concession is credited against it. */
export const grossAnnualOf = (row: FeeRecord) => annualFeeOf(row) + concessionOf(row);

export const guardianShareOf = (row: FeeRecord) => annualFeeOf(row) - scholarshipOf(row);

export const paidToDateOf = (row: FeeRecord) =>
  row.payments.reduce((total, payment) => total + payment.amount, 0);

/** What this row still owes, after anything written off. */
export const balanceOf = (row: FeeRecord) => Math.max(0, row.billed - row.paid - (row.waived ?? 0));

export const futureInstallmentsOf = (row: FeeRecord) =>
  Math.max(0, annualFeeOf(row) - paidToDateOf(row) - balanceOf(row));

/* --------------------------- Due dates and fines --------------------------- */

/** An approved extension moves the due date, and the overdue count with it. */
export const daysOverdueOf = (row: FeeRecord) => {
  if (balanceOf(row) === 0) return 0;
  const shifted = row.daysFromDue - (row.extensionDays ?? 0);
  return Math.max(0, shifted);
};

export const isOverdueOf = (row: FeeRecord) => daysOverdueOf(row) > 0;

/** Days still to run before the effective due date; zero once it has passed. */
export const daysUntilDueOf = (row: FeeRecord) => Math.max(0, -(row.daysFromDue - (row.extensionDays ?? 0)));

/**
 * The late fee.
 *
 * The grace period runs from the due date, so only the days beyond it are
 * chargeable — which is exactly how Arnav Deshmukh's panel explains his ₹1,700
 * as "34 chargeable days" against 41 days overdue.
 */
export const chargeableDaysOf = (row: FeeRecord) => Math.max(0, daysOverdueOf(row) - GRACE_DAYS);

export const fineOf = (row: FeeRecord) =>
  row.fineWaived ? 0 : chargeableDaysOf(row) * LATE_FEE_PER_DAY;

/** What was charged before any waiver, for the record that shows both. */
export const fineChargedOf = (row: FeeRecord) => chargeableDaysOf(row) * LATE_FEE_PER_DAY;

export const fineWaivedOf = (row: FeeRecord) => (row.fineWaived ? fineChargedOf(row) : 0);

export const totalPayableOf = (row: FeeRecord) => balanceOf(row) + fineOf(row);

/** Whether grace still has days left on it. */
export const graceLabelOf = (row: FeeRecord) => {
  if (!isOverdueOf(row)) return `${GRACE_DAYS} days`;
  return daysOverdueOf(row) > GRACE_DAYS ? 'Exhausted' : `${GRACE_DAYS - daysOverdueOf(row)} days left`;
};

/* ---------------------------------- Status --------------------------------- */

/**
 * The record's own state.
 *
 * Nothing owed with a waiver against it is Waived and without one is Paid;
 * anything owed past its effective due date is Overdue, which is why an approved
 * extension leaves a part-paid record merely Partially Paid.
 */
export const statusOf = (row: FeeRecord): CollectionStatus => {
  if (balanceOf(row) === 0) return (row.waived ?? 0) > 0 ? 'Waived' : 'Paid';
  if (isOverdueOf(row)) return 'Overdue';
  return row.paid > 0 ? 'Partially Paid' : 'Pending';
};

export const statusPill: Record<CollectionStatus, string> = {
  Paid: 'is-completed',
  'Partially Paid': 'is-pending',
  Pending: 'is-review',
  Overdue: 'is-blocked',
  Waived: 'is-active',
};

export const statusTint: Record<CollectionStatus, string> = {
  Paid: 'success',
  'Partially Paid': 'warning',
  Pending: 'info',
  Overdue: 'danger',
  Waived: 'secondary',
};

/** The line under the due date, which says how the date stands right now. */
export const dueNoteOf = (row: FeeRecord) => {
  if (isOverdueOf(row)) return `${daysOverdueOf(row)} days overdue`;
  if (balanceOf(row) > 0) {
    const days = daysUntilDueOf(row);
    return days === 0 ? 'Due today' : `Due in ${days} ${days === 1 ? 'day' : 'days'}`;
  }
  if (row.paymentDelay <= -3) return `Paid ${-row.paymentDelay} days early`;
  return 'Paid on time';
};

/** The overdue band the More Filters panel offers. */
export const overdueBandOf = (row: FeeRecord) => {
  const days = daysOverdueOf(row);
  if (days === 0) return '';
  if (days <= 15) return '1 – 15 days';
  if (days <= 30) return '16 – 30 days';
  if (days <= 60) return '31 – 60 days';
  return 'Over 60 days';
};

/**
 * How reliably the guardian pays, from the average delay across their payments.
 * Early or same-week is excellent; anything past a fortnight is poor.
 */
export const paymentRatingOf = (row: FeeRecord) => {
  if (row.paymentDelay <= 5) return 'Excellent';
  if (row.paymentDelay <= 12) return 'Good';
  return 'Poor';
};

export const ratingTint: Record<string, string> = {
  Excellent: 'success',
  Good: 'info',
  Poor: 'danger',
};

export const averageDelayLabelOf = (row: FeeRecord) =>
  row.paymentDelay <= 0 ? 'Paid early' : `${row.paymentDelay} days`;

/* -------------------------------- The filters ------------------------------- */

export const classLabelOf = (row: FeeRecord) => `${row.className} ${row.section}`;

export const searchIndexOf = (row: FeeRecord) =>
  [row.student, row.admission, classLabelOf(row), row.feeCategory, row.guardian, row.receipt ?? '']
    .join(' ')
    .toLowerCase();

export const academicYearOptions = ['2026-2027', '2025-2026', '2024-2025'];
export const categoryOptions = [
  'Tuition Fee',
  'Transport Fee',
  'Hostel Fee',
  'Examination Fee',
  'Library Fee',
  'Lab Fee',
  'Admission Fee',
];
export const methodOptions = [
  'Cash',
  'UPI',
  'Net Banking',
  'Credit / Debit Card',
  'Cheque',
  'Bank Transfer',
  'Demand Draft',
];
export const classOptions = ['Class V', 'Class VII', 'Class VIII', 'Class IX', 'Class X'];
export const sectionOptions = ['A', 'B', 'C', 'D'];
export const statusOptions: CollectionStatus[] = ['Paid', 'Partially Paid', 'Pending', 'Overdue', 'Waived'];
export const installmentOptions = [
  'Term 1 · Apr 2026',
  'Term 2 · Jul 2026',
  'Term 3 · Oct 2026',
  'Term 4 · Jan 2027',
];
export const counterOptions = [
  'Ms. Fatima Sheikh · Counter 1',
  'Mr. Rajiv Menon · Counter 2',
  'Online payment gateway',
];
export const overdueOptions = ['1 – 15 days', '16 – 30 days', '31 – 60 days', 'Over 60 days'];
export const concessionOptions = ['Sibling discount', 'Staff ward', 'Merit concession', 'Need based'];
export const scholarshipOptions = ['Government merit', 'Sports quota', 'Trust funded', 'None'];
export const fineOptions = ['Fine charged', 'Fine waived', 'No fine'];

/** Which concession type the record carries, for the filter. */
export const concessionTypeOf = (row: FeeRecord) =>
  row.concessionLabel ? row.concessionLabel.split(' · ')[0] : '';

export const scholarshipTypeOf = (row: FeeRecord) =>
  row.scholarshipLabel ? row.scholarshipLabel.split(' · ')[0] : 'None';

export const fineStateOf = (row: FeeRecord) => {
  if (row.fineWaived) return 'Fine waived';
  return fineOf(row) > 0 ? 'Fine charged' : 'No fine';
};

/** Which counter took the money, for the Collected By filter. */
export const counterOf = (row: FeeRecord) => {
  if (row.methodNote.startsWith('Counter 1')) return counterOptions[0];
  if (row.methodNote.startsWith('Counter 2')) return counterOptions[1];
  if (row.methodNote.startsWith('Gateway') || row.methodNote.startsWith('Trust')) return counterOptions[2];
  return '';
};

/* ------------------------------ Report figures ----------------------------- */

/** Collected over billed, which is the rate the strip and the panel both print. */
export const collectionRateOf = (records: FeeRecord[]) => {
  const billed = records.reduce((total, row) => total + row.billed, 0);
  if (billed === 0) return null;
  const collected = records.reduce((total, row) => total + row.paid + (row.waived ?? 0), 0);
  return round1((collected / billed) * 100);
};
