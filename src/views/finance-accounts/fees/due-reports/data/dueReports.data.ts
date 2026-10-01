export type DueStatus = 'Overdue' | 'Critical' | 'Due This Week' | 'Partially Paid' | 'Cleared';

export interface AmountLine {
  label: string;
  /** Em dash where the template leaves a line unpriced. */
  amount: string;
}

export interface PaymentEntry {
  when: string;
  amount: string;
}

export interface DueRow {
  id: string;
  student: string;
  roll: string;
  avatar: string;
  admissionNo: string;
  className: string;
  /** Section letter, split out so the Section filter can work. */
  section: string;
  feeCategory: string;
  /** Per-row badge tint the template gives the category. */
  categoryTint: string;
  invoiceNo: string;
  billed: number;
  paid: number;
  dueDate: string;
  status: DueStatus;
  academicYear: string;
  /** Detail panel. */
  feeBreakdown: AmountLine[];
  payments: PaymentEntry[];
  fine: { label: string; note: string; amount: string } | null;
  scholarship: string | null;
  guardian: { name: string; relation: string; mobile: string; email: string };
  notes: string;
}

export const statusPill: Record<DueStatus, string> = {
  Overdue: 'is-blocked',
  Critical: 'is-blocked',
  'Partially Paid': 'is-pending',
  'Due This Week': 'is-review',
  Cleared: 'is-active',
};

export const statusBadge: Record<DueStatus, string> = {
  Overdue: 'badge badge-soft-danger',
  Critical: 'badge badge-soft-danger',
  'Partially Paid': 'badge badge-soft-warning',
  'Due This Week': 'badge badge-soft-info',
  Cleared: 'badge badge-soft-success',
};

export const dueRows: DueRow[] = [
  {
    id: 'INV-2026-0441',
    student: 'Janet Daniel',
    roll: 'Roll 35011',
    avatar: 'assets/img/students/student-01.jpg',
    admissionNo: 'AD9892434',
    className: 'III A',
    section: 'A',
    feeCategory: 'Tuition Fee',
    categoryTint: 'primary',
    invoiceNo: 'INV-2026-0441',
    billed: 1850,
    paid: 0,
    dueDate: '05 Jul 2026',
    status: 'Overdue',
    academicYear: '2026 / 2027',
    feeBreakdown: [
      { label: 'Tuition Fee', amount: '$1,500' },
      { label: 'Exam Fee', amount: '$210' },
      { label: 'Library Fee', amount: '$140' },
    ],
    payments: [],
    fine: { label: 'Late Fee · FN-2026-0231', note: 'Term-2 tuition paid 12 days late', amount: '$50' },
    scholarship: null,
    guardian: { name: 'Thomas Daniel', relation: 'Father', mobile: '+1 546 8548 891', email: 'thomas.d@example.com' },
    notes: 'Guardian contacted on 24 Jul. Committed to settle before 05 Aug 2026.',
  },
  {
    id: 'INV-2026-0438',
    student: 'Joann Michael',
    roll: 'Roll 35102',
    avatar: 'assets/img/students/student-02.jpg',
    admissionNo: 'AD9892433',
    className: 'IV B',
    section: 'B',
    feeCategory: 'Transport Fee',
    categoryTint: 'success',
    invoiceNo: 'INV-2026-0438',
    billed: 640,
    paid: 320,
    dueDate: '18 Jul 2026',
    status: 'Partially Paid',
    academicYear: '2026 / 2027',
    feeBreakdown: [
      { label: 'Route 04 — Term I', amount: '$320' },
      { label: 'Route 04 — Term II', amount: '$320' },
      { label: 'Maintenance Levy', amount: '—' },
    ],
    payments: [{ when: '20 Jun 2026 · UPI · RCP-0462', amount: '$320' }],
    fine: null,
    scholarship: null,
    guardian: { name: 'Peter Michael', relation: 'Father', mobile: '+1 546 8548 892', email: 'peter.m@example.com' },
    notes: 'Term II instalment scheduled with the guardian for 05 Aug 2026.',
  },
  {
    id: 'INV-2026-0332',
    student: 'Kathleen Dison',
    roll: 'Roll 35013',
    avatar: 'assets/img/students/student-03.jpg',
    admissionNo: 'AD9892432',
    className: 'III A',
    section: 'A',
    feeCategory: 'Tuition Fee',
    categoryTint: 'primary',
    invoiceNo: 'INV-2026-0332',
    billed: 1840,
    paid: 1200,
    dueDate: '31 Jul 2026',
    status: 'Partially Paid',
    academicYear: '2026 / 2027',
    feeBreakdown: [
      { label: 'Tuition Fee', amount: '$1,400' },
      { label: 'Exam Fee', amount: '$260' },
      { label: 'Transport Fee', amount: '$180' },
    ],
    payments: [{ when: '12 Jun 2026 · Scholarship · SCH-2026-0115', amount: '$1,200' }],
    fine: null,
    scholarship: 'Need-Based · $1,200',
    guardian: { name: 'Robert Dison', relation: 'Father', mobile: '+1 546 8548 893', email: 'robert.d@example.com' },
    notes: 'Balance payable after the welfare concession. Due date not yet reached.',
  },
  {
    id: 'INV-2026-0429',
    student: 'Lisa Gourley',
    roll: 'Roll 35204',
    avatar: 'assets/img/students/student-04.jpg',
    admissionNo: 'AD9892431',
    className: 'II B',
    section: 'B',
    feeCategory: 'Hostel Fee',
    categoryTint: 'purple',
    invoiceNo: 'INV-2026-0429',
    billed: 2100,
    paid: 0,
    dueDate: '20 Jun 2026',
    status: 'Critical',
    academicYear: '2026 / 2027',
    feeBreakdown: [
      { label: 'Room Rent — Term I', amount: '$1,200' },
      { label: 'Mess Charges', amount: '$720' },
      { label: 'Laundry & Utilities', amount: '$180' },
    ],
    payments: [],
    fine: { label: 'Late Fee · FN-2026-0244', note: 'Hostel dues overdue past 30 days', amount: '$120' },
    scholarship: null,
    guardian: { name: 'Janet Gourley', relation: 'Mother', mobile: '+1 546 8548 894', email: 'janet.g@example.com' },
    notes: 'Escalated to the accounts head. Third reminder issued 26 Jul 2026.',
  },
  {
    id: 'INV-2026-0447',
    student: 'Ralph Claudia',
    roll: 'Roll 35505',
    avatar: 'assets/img/students/student-05.jpg',
    admissionNo: 'AD9892430',
    className: 'V A',
    section: 'A',
    feeCategory: 'Exam Fee',
    categoryTint: 'info',
    invoiceNo: 'INV-2026-0447',
    billed: 310,
    paid: 0,
    dueDate: '03 Aug 2026',
    status: 'Due This Week',
    academicYear: '2026 / 2027',
    feeBreakdown: [
      { label: 'Term II Exam Fee', amount: '$250' },
      { label: 'Practical Fee', amount: '$60' },
      { label: 'Re-exam Fee', amount: '—' },
    ],
    payments: [],
    fine: null,
    scholarship: null,
    guardian: { name: 'Claudia Ralph', relation: 'Mother', mobile: '+1 546 8548 895', email: 'claudia.r@example.com' },
    notes: 'First reminder queued for 01 Aug 2026.',
  },
  {
    id: 'INV-2026-0402',
    student: 'Julie Scott',
    roll: 'Roll 35606',
    avatar: 'assets/img/students/student-06.jpg',
    admissionNo: 'AD9892429',
    className: 'VI A',
    section: 'A',
    feeCategory: 'Library Fee',
    categoryTint: 'secondary',
    invoiceNo: 'INV-2026-0402',
    billed: 180,
    paid: 180,
    dueDate: '28 Jun 2026',
    status: 'Cleared',
    academicYear: '2026 / 2027',
    feeBreakdown: [
      { label: 'Annual Membership', amount: '$120' },
      { label: 'Late Return Charges', amount: '$60' },
      { label: 'Replacement', amount: '—' },
    ],
    payments: [
      { when: '26 Jun 2026 · Cash · RCP-0470', amount: '$120' },
      { when: '28 Jun 2026 · Cash · RCP-0473', amount: '$60' },
    ],
    fine: null,
    scholarship: null,
    guardian: { name: 'Andrew Scott', relation: 'Father', mobile: '+1 546 8548 896', email: 'andrew.s@example.com' },
    notes: 'Settled in full at the library counter. Receipt emailed to the guardian.',
  },
  {
    id: 'INV-2026-0418',
    student: 'Susan Boswell',
    roll: 'Roll 35407',
    avatar: 'assets/img/students/student-07.jpg',
    admissionNo: 'AD9892428',
    className: 'IV A',
    section: 'A',
    feeCategory: 'Tuition Fee',
    categoryTint: 'primary',
    invoiceNo: 'INV-2026-0418',
    billed: 1760,
    paid: 880,
    dueDate: '10 Jul 2026',
    status: 'Overdue',
    academicYear: '2026 / 2027',
    feeBreakdown: [
      { label: 'Tuition Fee', amount: '$1,440' },
      { label: 'Exam Fee', amount: '$220' },
      { label: 'Activity Fee', amount: '$100' },
    ],
    payments: [{ when: '08 Jul 2026 · Bank Transfer · RCP-0487', amount: '$880' }],
    fine: { label: 'Late Fee · FN-2026-0219', note: 'Instalment overdue by 20 days', amount: '$30' },
    scholarship: 'Merit · 75%',
    guardian: { name: 'Mark Boswell', relation: 'Father', mobile: '+1 546 8548 897', email: 'mark.b@example.com' },
    notes: 'Balance held pending the merit scholarship renewal decision.',
  },
  {
    id: 'INV-2026-0396',
    student: 'Richard Soley',
    roll: 'Roll 35508',
    avatar: 'assets/img/students/student-08.jpg',
    admissionNo: 'AD9892427',
    className: 'V B',
    section: 'B',
    feeCategory: 'Transport Fee',
    categoryTint: 'success',
    invoiceNo: 'INV-2026-0396',
    billed: 540,
    paid: 0,
    dueDate: '12 Jun 2026',
    status: 'Critical',
    academicYear: '2026 / 2027',
    feeBreakdown: [
      { label: 'Route 09 — Term I', amount: '$270' },
      { label: 'Route 09 — Term II', amount: '$270' },
      { label: 'Maintenance Levy', amount: '—' },
    ],
    payments: [],
    fine: { label: 'Late Fee · FN-2026-0252', note: 'Transport dues overdue past 45 days', amount: '$20' },
    scholarship: null,
    guardian: { name: 'Helen Soley', relation: 'Mother', mobile: '+1 546 8548 898', email: 'helen.s@example.com' },
    notes: 'Transport privileges suspended until the balance is cleared.',
  },
];

/* -------------------------------- Derivations ------------------------------- */

export const money = (value: number): string => `$${value.toLocaleString('en-US')}`;

export const outstanding = (row: DueRow): number => row.billed - row.paid;

/**
 * The reference "today" implied by the template's own Days Overdue figures —
 * every overdue row is exactly (30 Jul 2026 − due date) days. Pinned rather than
 * read from the clock because the dataset is entirely 2026.
 */
export const REFERENCE_DATE = new Date(2026, 6, 30);

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const parseDate = (value: string): Date => {
  const [day, month, year] = value.trim().split(/\s+/);
  return new Date(Number(year), MONTHS.indexOf(month), Number(day));
};

const DAY_MS = 24 * 60 * 60 * 1000;

/** Whole days past due; 0 once cleared or still within term. */
export const daysOverdue = (row: DueRow): number => {
  if (outstanding(row) === 0) return 0;
  const diff = Math.round((REFERENCE_DATE.getTime() - parseDate(row.dueDate).getTime()) / DAY_MS);
  return diff > 0 ? diff : 0;
};

/** The template prints an em dash rather than "0 days". */
export const daysOverdueLabel = (row: DueRow): string => {
  const days = daysOverdue(row);
  return days > 0 ? `${days} days` : '—';
};

/** Detail-panel net outstanding, which the template inflates by the linked fine. */
export const netOutstanding = (row: DueRow): number => {
  const fine = row.fine ? Number(row.fine.amount.replace(/[^0-9.]/g, '')) : 0;
  return outstanding(row) + fine;
};

export const ageingBucket = (row: DueRow): string => {
  const days = daysOverdue(row);
  if (days === 0) return '';
  if (days <= 15) return '1 – 15 days';
  if (days <= 30) return '16 – 30 days';
  if (days <= 60) return '31 – 60 days';
  return 'Over 60 days';
};
