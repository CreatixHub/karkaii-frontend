export type ReceiptStatus = 'Completed' | 'Pending Clearance' | 'Refunded' | 'Cancelled';

export interface FeeLine {
  label: string;
  /** Em dash where the template leaves a component unpriced. */
  amount: string;
}

export interface InfoLine {
  label: string;
  value: string;
}

export interface Receipt {
  id: string;
  receiptNo: string;
  invoiceNo: string;
  student: string;
  avatar: string;
  className: string;
  section: string;
  admissionNo: string;
  paymentDate: string;
  paymentTime: string;
  feeCategory: string;
  categoryTint: string;
  paymentMethod: string;
  referenceNo: string;
  collectedBy: string;
  /** The smaller line under the collector, e.g. "Accounts". */
  collectedByRole: string;
  status: ReceiptStatus;
  academicYear: string;
  /** Detail panel. */
  term: string;
  source: string;
  feeBreakdown: FeeLine[];
  paymentInfo: InfoLine[];
  fine: { label: string; note: string; amount: string } | null;
  discount: string | null;
  scholarship: string | null;
  notes: string;
}

export const statusPill: Record<ReceiptStatus, string> = {
  Completed: 'is-active',
  'Pending Clearance': 'is-pending',
  Refunded: 'is-archived',
  Cancelled: 'is-blocked',
};

export const statusBadge: Record<ReceiptStatus, string> = {
  Completed: 'badge badge-soft-success',
  'Pending Clearance': 'badge badge-soft-warning',
  Refunded: 'badge badge-soft-info',
  Cancelled: 'badge badge-soft-danger',
};

export const receipts: Receipt[] = [
  {
    id: 'RCP-2026-0521',
    receiptNo: 'RCP-2026-0521',
    invoiceNo: 'INV-2026-0441',
    student: 'Janet Daniel',
    avatar: 'assets/img/students/student-01.jpg',
    className: 'III A',
    section: 'A',
    admissionNo: 'AD9892434',
    paymentDate: '30 Jul 2026',
    paymentTime: '10:24 AM',
    feeCategory: 'Tuition Fee',
    categoryTint: 'primary',
    paymentMethod: 'Cash',
    referenceNo: 'CASH-0521',
    collectedBy: 'Sarah Rose',
    collectedByRole: 'Accounts',
    status: 'Completed',
    academicYear: '2026 / 2027',
    term: 'Term II',
    source: 'Counter payment',
    feeBreakdown: [
      { label: 'Tuition Fee', amount: '$1,500' },
      { label: 'Exam Fee', amount: '$210' },
      { label: 'Library Fee', amount: '$140' },
      { label: 'Late Fine', amount: '$50' },
    ],
    paymentInfo: [
      { label: 'Payment Mode', value: 'Cash' },
      { label: 'Reference No', value: 'CASH-0521' },
      { label: 'Counter', value: 'Accounts Desk 02' },
      { label: 'Cleared On', value: '30 Jul 2026' },
    ],
    fine: { label: 'Late Fee · FN-2026-0231', note: 'Term-2 tuition paid 12 days late', amount: '$50' },
    discount: null,
    scholarship: null,
    notes: 'Full settlement of the overdue Term II invoice. Receipt handed over at the counter.',
  },
  {
    id: 'RCP-2026-0520',
    receiptNo: 'RCP-2026-0520',
    invoiceNo: 'INV-2026-0332',
    student: 'Kathleen Dison',
    avatar: 'assets/img/students/student-03.jpg',
    className: 'III A',
    section: 'A',
    admissionNo: 'AD9892432',
    paymentDate: '29 Jul 2026',
    paymentTime: '03:12 PM',
    feeCategory: 'Tuition Fee',
    categoryTint: 'primary',
    paymentMethod: 'UPI',
    referenceNo: 'UPI-88213470',
    collectedBy: 'Parent Portal',
    collectedByRole: 'Online',
    status: 'Completed',
    academicYear: '2026 / 2027',
    term: 'Term II',
    source: 'Parent portal',
    feeBreakdown: [
      { label: 'Tuition Fee', amount: '$400' },
      { label: 'Exam Fee', amount: '$120' },
      { label: 'Transport Fee', amount: '$120' },
      { label: 'Late Fine', amount: '—' },
    ],
    paymentInfo: [
      { label: 'Payment Mode', value: 'UPI' },
      { label: 'Reference No', value: 'UPI-88213470' },
      { label: 'Gateway', value: 'RazorPay' },
      { label: 'Cleared On', value: '29 Jul 2026' },
    ],
    fine: null,
    discount: null,
    scholarship: 'Need-Based · $1,200 already adjusted before this payment.',
    notes: 'Balance payable after the welfare concession. Settled online by the guardian.',
  },
  {
    id: 'RCP-2026-0519',
    receiptNo: 'RCP-2026-0519',
    invoiceNo: 'INV-2026-0418',
    student: 'Susan Boswell',
    avatar: 'assets/img/students/student-07.jpg',
    className: 'IV A',
    section: 'A',
    admissionNo: 'AD9892428',
    paymentDate: '29 Jul 2026',
    paymentTime: '11:05 AM',
    feeCategory: 'Tuition Fee',
    categoryTint: 'primary',
    paymentMethod: 'Bank Transfer',
    referenceNo: 'NEFT-4471209',
    collectedBy: 'Sarah Rose',
    collectedByRole: 'Accounts',
    status: 'Completed',
    academicYear: '2026 / 2027',
    term: 'Term II',
    source: 'Bank transfer',
    feeBreakdown: [
      { label: 'Tuition Fee', amount: '$720' },
      { label: 'Exam Fee', amount: '$110' },
      { label: 'Activity Fee', amount: '$50' },
      { label: 'Late Fine', amount: '—' },
    ],
    paymentInfo: [
      { label: 'Payment Mode', value: 'Bank Transfer' },
      { label: 'Reference No', value: 'NEFT-4471209' },
      { label: 'Bank', value: 'First National · 8842' },
      { label: 'Cleared On', value: '29 Jul 2026' },
    ],
    fine: null,
    discount: 'Sibling Discount · 5% applied on the tuition component.',
    scholarship: 'Merit · 75% renewal pending — not applied to this receipt.',
    notes: 'Part payment received. Balance held pending the merit scholarship renewal.',
  },
  {
    id: 'RCP-2026-0518',
    receiptNo: 'RCP-2026-0518',
    invoiceNo: 'INV-2026-0438',
    student: 'Joann Michael',
    avatar: 'assets/img/students/student-02.jpg',
    className: 'IV B',
    section: 'B',
    admissionNo: 'AD9892433',
    paymentDate: '28 Jul 2026',
    paymentTime: '09:47 AM',
    feeCategory: 'Transport Fee',
    categoryTint: 'success',
    paymentMethod: 'Card',
    referenceNo: 'CARD-6621884',
    collectedBy: 'Front Office',
    collectedByRole: 'Counter',
    status: 'Completed',
    academicYear: '2026 / 2027',
    term: 'Term I',
    source: 'POS terminal',
    feeBreakdown: [
      { label: 'Route 04 — Term I', amount: '$320' },
      { label: 'Maintenance Levy', amount: '—' },
      { label: 'Bus Pass', amount: '—' },
      { label: 'Late Fine', amount: '—' },
    ],
    paymentInfo: [
      { label: 'Payment Mode', value: 'Card' },
      { label: 'Reference No', value: 'CARD-6621884' },
      { label: 'Terminal', value: 'POS-01 · Visa 4412' },
      { label: 'Cleared On', value: '28 Jul 2026' },
    ],
    fine: null,
    discount: null,
    scholarship: null,
    notes: 'Term I transport instalment. Term II due on 05 Aug 2026.',
  },
  {
    id: 'RCP-2026-0516',
    receiptNo: 'RCP-2026-0516',
    invoiceNo: 'INV-2026-0447',
    student: 'Ralph Claudia',
    avatar: 'assets/img/students/student-05.jpg',
    className: 'V A',
    section: 'A',
    admissionNo: 'AD9892430',
    paymentDate: '27 Jul 2026',
    paymentTime: '02:38 PM',
    feeCategory: 'Exam Fee',
    categoryTint: 'info',
    paymentMethod: 'Cheque',
    referenceNo: 'CHQ-220148',
    collectedBy: 'Sarah Rose',
    collectedByRole: 'Accounts',
    status: 'Pending Clearance',
    academicYear: '2026 / 2027',
    term: 'Term II',
    source: 'Cheque deposit',
    feeBreakdown: [
      { label: 'Term II Exam Fee', amount: '$250' },
      { label: 'Practical Fee', amount: '$60' },
      { label: 'Re-exam Fee', amount: '—' },
      { label: 'Late Fine', amount: '—' },
    ],
    paymentInfo: [
      { label: 'Payment Mode', value: 'Cheque' },
      { label: 'Cheque No', value: 'CHQ-220148' },
      { label: 'Drawn On', value: 'Union Bank' },
      { label: 'Expected Clearing', value: '02 Aug 2026' },
    ],
    fine: null,
    discount: null,
    scholarship: null,
    notes: 'Cheque deposited on 27 Jul 2026. Receipt confirms on clearance.',
  },
  {
    id: 'RCP-2026-0514',
    receiptNo: 'RCP-2026-0514',
    invoiceNo: 'INV-2026-0402',
    student: 'Julie Scott',
    avatar: 'assets/img/students/student-06.jpg',
    className: 'VI A',
    section: 'A',
    admissionNo: 'AD9892429',
    paymentDate: '26 Jul 2026',
    paymentTime: '12:10 PM',
    feeCategory: 'Library Fee',
    categoryTint: 'secondary',
    paymentMethod: 'Cash',
    referenceNo: 'CASH-0514',
    collectedBy: 'Mary Winsler',
    collectedByRole: 'Librarian',
    status: 'Completed',
    academicYear: '2026 / 2027',
    term: 'Annual',
    source: 'Counter payment',
    feeBreakdown: [
      { label: 'Annual Membership', amount: '$120' },
      { label: 'Late Return Charges', amount: '$60' },
      { label: 'Replacement', amount: '—' },
      { label: 'Late Fine', amount: '—' },
    ],
    paymentInfo: [
      { label: 'Payment Mode', value: 'Cash' },
      { label: 'Reference No', value: 'CASH-0514' },
      { label: 'Counter', value: 'Library Desk' },
      { label: 'Cleared On', value: '26 Jul 2026' },
    ],
    fine: { label: 'Library Fine · FN-2026-0230', note: 'Book returned 8 days overdue', amount: '$60' },
    discount: null,
    scholarship: null,
    notes: 'Settled in full at the library counter. Receipt emailed to the guardian.',
  },
  {
    id: 'RCP-2026-0509',
    receiptNo: 'RCP-2026-0509',
    invoiceNo: 'INV-2026-0429',
    student: 'Lisa Gourley',
    avatar: 'assets/img/students/student-04.jpg',
    className: 'II B',
    section: 'B',
    admissionNo: 'AD9892431',
    paymentDate: '24 Jul 2026',
    paymentTime: '04:55 PM',
    feeCategory: 'Hostel Fee',
    categoryTint: 'purple',
    paymentMethod: 'Online',
    referenceNo: 'PAY-70051822',
    collectedBy: 'Parent Portal',
    collectedByRole: 'Online',
    status: 'Refunded',
    academicYear: '2026 / 2027',
    term: 'Term I',
    source: 'Payment gateway',
    feeBreakdown: [
      { label: 'Room Rent — Term I', amount: '$600' },
      { label: 'Mess Charges', amount: '$360' },
      { label: 'Laundry & Utilities', amount: '$90' },
      { label: 'Late Fine', amount: '—' },
    ],
    paymentInfo: [
      { label: 'Payment Mode', value: 'Online' },
      { label: 'Reference No', value: 'PAY-70051822' },
      { label: 'Gateway', value: 'Stripe' },
      { label: 'Refunded On', value: '26 Jul 2026' },
    ],
    fine: null,
    discount: null,
    scholarship: null,
    notes:
      'Duplicate payment identified during reconciliation. Full amount refunded to source on 26 Jul 2026.',
  },
  {
    id: 'RCP-2026-0503',
    receiptNo: 'RCP-2026-0503',
    invoiceNo: 'INV-2026-0396',
    student: 'Richard Soley',
    avatar: 'assets/img/students/student-08.jpg',
    className: 'V B',
    section: 'B',
    admissionNo: 'AD9892427',
    paymentDate: '22 Jul 2026',
    paymentTime: '10:02 AM',
    feeCategory: 'Transport Fee',
    categoryTint: 'success',
    paymentMethod: 'Cash',
    referenceNo: 'CASH-0503',
    collectedBy: 'Front Office',
    collectedByRole: 'Counter',
    status: 'Cancelled',
    academicYear: '2026 / 2027',
    term: 'Term I',
    source: 'Counter payment',
    feeBreakdown: [
      { label: 'Route 09 — Term I', amount: '$270' },
      { label: 'Maintenance Levy', amount: '—' },
      { label: 'Bus Pass', amount: '—' },
      { label: 'Late Fine', amount: '—' },
    ],
    paymentInfo: [
      { label: 'Payment Mode', value: 'Cash' },
      { label: 'Reference No', value: 'CASH-0503' },
      { label: 'Counter', value: 'Front Office' },
      { label: 'Cancelled On', value: '23 Jul 2026' },
    ],
    fine: null,
    discount: null,
    scholarship: null,
    notes: 'Cancelled — posted against the wrong student record. Re-issued as RCP-2026-0506.',
  },
];

/* -------------------------------- Derivations ------------------------------- */

export const money = (value: number): string => `$${value.toLocaleString('en-US')}`;

const parseAmount = (value: string): number => Number(value.replace(/[^0-9.]/g, '')) || 0;

/** Amount Paid is the sum of the breakdown; all eight rows reconcile. */
export const amountPaid = (row: Receipt): number =>
  row.feeBreakdown.reduce((total, line) => total + parseAmount(line.amount), 0);

export const receiptDateTime = (row: Receipt): string => `${row.paymentDate} · ${row.paymentTime}`;
