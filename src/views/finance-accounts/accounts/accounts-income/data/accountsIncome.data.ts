export type IncomeStatus = 'Received' | 'Confirmed' | 'Receipted' | 'Pending' | 'Refunded';

export interface IncomeRecord {
  id: string;
  title: string;
  amount: number;
  category: string;
  categoryTint: string;
  icon: string;
  /** "Kathryn Daniel (Parent)" — payer and relationship, as authored. */
  payer: string;
  method: string;
  date: string;
  receiptNo: string;
  reference: string;
  description: string;
  collectedBy: string;
  avatar: string;
  /** Null on the two unlinked rows. */
  invoiceNo: string | null;
  receipts: number;
  status: IncomeStatus;
}

export const statusPill: Record<IncomeStatus, string> = {
  Received: 'is-new',
  Confirmed: 'is-active',
  Receipted: 'is-completed',
  Pending: 'is-pending',
  Refunded: 'is-archived',
};

export const statusIcon: Record<IncomeStatus, string> = {
  Received: 'ti ti-download',
  Confirmed: 'ti ti-circle-check',
  Receipted: 'ti ti-receipt',
  Pending: 'ti ti-clock',
  Refunded: 'ti ti-arrow-back-up',
};

export const statusBadge: Record<IncomeStatus, string> = {
  Received: 'badge badge-soft-info',
  Confirmed: 'badge badge-soft-success',
  Receipted: 'badge badge-soft-primary',
  Pending: 'badge badge-soft-warning',
  Refunded: 'badge badge-soft-secondary',
};

/** Tint and glyph per income category, matching the template's card accents. */
export const categoryStyle: Record<string, { tint: string; icon: string }> = {
  'Tuition Fees': { tint: 'primary', icon: 'ti ti-school' },
  'Admission Fees': { tint: 'success', icon: 'ti ti-user-plus' },
  'Transport Fees': { tint: 'info', icon: 'ti ti-bus' },
  'Hostel Fees': { tint: 'warning', icon: 'ti ti-building-community' },
  Donation: { tint: 'purple', icon: 'ti ti-heart-handshake' },
  'Library Fees': { tint: 'teal', icon: 'ti ti-books' },
  'Exam Fees': { tint: 'pink', icon: 'ti ti-file-certificate' },
  Miscellaneous: { tint: 'secondary', icon: 'ti ti-dots' },
};

export const incomeRecords: IncomeRecord[] = [
  { id: 'RCPT-5101', title: 'Term 2 Tuition Fees', amount: 1200, category: 'Tuition Fees', categoryTint: 'primary', icon: 'ti ti-school', payer: 'Kathryn Daniel (Parent)', method: 'Bank Transfer', date: '22 Jul 2026', receiptNo: 'RCPT-5101', reference: 'TXN-99201', description: 'Term 2 tuition fee payment for Janet Daniel, Grade 6-A.', collectedBy: 'Finance Office', avatar: 'assets/img/profiles/avatar-01.jpg', invoiceNo: 'INV-3301', receipts: 2, status: 'Confirmed' },
  { id: 'RCPT-5102', title: 'New Admission Fee', amount: 850, category: 'Admission Fees', categoryTint: 'success', icon: 'ti ti-user-plus', payer: 'Peter Michael (Parent)', method: 'Card', date: '21 Jul 2026', receiptNo: 'RCPT-5102', reference: 'TXN-99202', description: 'One-time admission fee for new enrolment, Grade 5-B.', collectedBy: 'Front Office', avatar: 'assets/img/profiles/avatar-02.jpg', invoiceNo: 'INV-3302', receipts: 1, status: 'Received' },
  { id: 'RCPT-5103', title: 'Transport Fee — Route North', amount: 320, category: 'Transport Fees', categoryTint: 'info', icon: 'ti ti-bus', payer: 'Laura Fischer (Parent)', method: 'Cash', date: '20 Jul 2026', receiptNo: 'RCPT-5103', reference: 'CSH-4471', description: 'Monthly transport fee for the North Line Express route.', collectedBy: 'Transport Desk', avatar: 'assets/img/profiles/avatar-03.jpg', invoiceNo: 'INV-3303', receipts: 1, status: 'Receipted' },
  { id: 'RCPT-5104', title: 'Hostel Fee — Q2', amount: 1500, category: 'Hostel Fees', categoryTint: 'warning', icon: 'ti ti-building-community', payer: 'Diana Claudia (Parent)', method: 'Bank Transfer', date: '18 Jul 2026', receiptNo: 'RCPT-5104', reference: 'TXN-99204', description: 'Quarter 2 hostel accommodation and mess charges.', collectedBy: 'Hostel Office', avatar: 'assets/img/profiles/avatar-04.jpg', invoiceNo: 'INV-3304', receipts: 3, status: 'Confirmed' },
  { id: 'RCPT-5105', title: 'Alumni Donation', amount: 5000, category: 'Donation', categoryTint: 'purple', icon: 'ti ti-heart-handshake', payer: 'Marcus Scott (Alumnus)', method: 'Cheque', date: '15 Jul 2026', receiptNo: 'RCPT-5105', reference: 'CHQ-8841', description: 'Voluntary donation towards the new science laboratory fund.', collectedBy: 'Finance Head', avatar: 'assets/img/profiles/avatar-05.jpg', invoiceNo: null, receipts: 1, status: 'Received' },
  { id: 'RCPT-5106', title: 'Library Membership Fee', amount: 180, category: 'Library Fees', categoryTint: 'teal', icon: 'ti ti-books', payer: 'Gordon Boswell (Parent)', method: 'Card', date: '12 Jul 2026', receiptNo: 'RCPT-5106', reference: 'TXN-99206', description: 'Annual library membership and security deposit.', collectedBy: 'Library Desk', avatar: 'assets/img/profiles/avatar-06.jpg', invoiceNo: 'INV-3306', receipts: 1, status: 'Receipted' },
  { id: 'RCPT-5107', title: 'Examination Fee', amount: 260, category: 'Exam Fees', categoryTint: 'pink', icon: 'ti ti-file-certificate', payer: 'Helen Bruno (Parent)', method: 'Bank Transfer', date: '09 Jul 2026', receiptNo: 'RCPT-5107', reference: 'TXN-99207', description: 'Half-yearly examination fee, Grade 3-A.', collectedBy: 'Exam Cell', avatar: 'assets/img/profiles/avatar-07.jpg', invoiceNo: 'INV-3307', receipts: 0, status: 'Pending' },
  { id: 'RCPT-5108', title: 'Miscellaneous — ID Card', amount: 40, category: 'Miscellaneous', categoryTint: 'secondary', icon: 'ti ti-dots', payer: 'George Patricia (Parent)', method: 'Cash', date: '05 Jul 2026', receiptNo: 'RCPT-5108', reference: 'CSH-4472', description: 'Replacement ID card fee, later refunded due to duplicate payment.', collectedBy: 'Front Office', avatar: 'assets/img/profiles/avatar-08.jpg', invoiceNo: null, receipts: 1, status: 'Refunded' },
];

/* -------------------------------- Derivations ------------------------------- */

export const money = (value: number): string => `$${value.toLocaleString('en-US')}`;

/** The template's three Amount Range buckets. */
export const amountBandOf = (row: IncomeRecord): string => {
  if (row.amount < 500) return 'Under $500';
  if (row.amount <= 2000) return '$500 – $2,000';
  return 'Over $2,000';
};

/** The Date Range filter matches the month, e.g. "Jul 2026". */
export const monthOf = (row: IncomeRecord): string => row.date.slice(3);

/** Payer name without the bracketed relationship. */
export const payerNameOf = (row: IncomeRecord): string => row.payer.replace(/\s*\(.*\)$/, '');

export const searchIndexOf = (row: IncomeRecord): string =>
  [row.title, row.receiptNo, row.payer, row.category, row.reference, row.status]
    .join(' ')
    .toLowerCase();

/* --------------------------------- Options ---------------------------------- */

export const categoryOptions = [
  'Tuition Fees', 'Admission Fees', 'Transport Fees', 'Hostel Fees', 'Donation', 'Library Fees',
  'Exam Fees', 'Miscellaneous',
];
export const methodOptions = ['Bank Transfer', 'Card', 'Cash', 'Cheque'];
export const collectedByOptions = [
  'Finance Office', 'Front Office', 'Transport Desk', 'Hostel Office', 'Finance Head',
  'Library Desk', 'Exam Cell',
];
export const statusOptions: IncomeStatus[] = ['Received', 'Confirmed', 'Receipted', 'Pending', 'Refunded'];
export const dateRangeOptions = ['Jul 2026', 'Jun 2026'];
export const amountRangeOptions = ['Under $500', '$500 – $2,000', 'Over $2,000'];
