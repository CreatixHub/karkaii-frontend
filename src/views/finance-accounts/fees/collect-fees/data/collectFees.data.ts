export type CollectStatus =
  | 'Paid'
  | 'Partially Paid'
  | 'Pending'
  | 'Overdue'
  | 'Refunded'
  | 'Cancelled';

export type PaymentMethod = 'UPI' | 'Cash' | 'Card' | 'Bank Transfer' | 'Cheque';

export interface FeeCollection {
  id: string;
  student: string;
  admissionNo: string;
  roll: number;
  className: string;
  section: string;
  avatar: string;
  feeGroup: string;
  feeType: string;
  invoiceNo: string;
  academicYear: string;
  dueDate: string;
  total: number;
  discount: number;
  fine: number;
  paid: number;
  /** Null on the rows the template renders as an em dash. */
  method: PaymentMethod | null;
  collectionDate: string | null;
  status: CollectStatus;
}

export const statusPill: Record<CollectStatus, string> = {
  Paid: 'is-active',
  'Partially Paid': 'is-review',
  Pending: 'is-pending',
  Overdue: 'is-blocked',
  Refunded: 'is-archived',
  Cancelled: 'is-inactive',
};

export const statusBadge: Record<CollectStatus, string> = {
  Paid: 'badge badge-soft-success',
  'Partially Paid': 'badge badge-soft-primary',
  Pending: 'badge badge-soft-warning',
  Overdue: 'badge badge-soft-danger',
  Refunded: 'badge badge-soft-info',
  Cancelled: 'badge badge-soft-dark',
};

export const feeCollections: FeeCollection[] = [
  { id: 'FC01', student: 'Janet Daniel', admissionNo: 'AD202401', roll: 12, className: 'X', section: 'A', avatar: 'assets/img/students/student-01.jpg', feeGroup: 'Tuition Fees', feeType: 'Tuition', invoiceNo: 'INV-24001', academicYear: '2024/2025', dueDate: '10 May 2024', total: 1250, discount: 125, fine: 0, paid: 1125, method: 'UPI', collectionDate: '05 May 2024', status: 'Paid' },
  { id: 'FC02', student: 'Joann Michael', admissionNo: 'AD202402', roll: 13, className: 'X', section: 'A', avatar: 'assets/img/students/student-02.jpg', feeGroup: 'Transport Fees', feeType: 'Route', invoiceNo: 'INV-24002', academicYear: '2024/2025', dueDate: '10 May 2024', total: 480, discount: 0, fine: 0, paid: 240, method: 'Cash', collectionDate: '06 May 2024', status: 'Partially Paid' },
  { id: 'FC03', student: 'Kathleen Nolan', admissionNo: 'AD202403', roll: 8, className: 'IX', section: 'B', avatar: 'assets/img/students/student-03.jpg', feeGroup: 'Hostel Fees', feeType: 'Room', invoiceNo: 'INV-24003', academicYear: '2024/2025', dueDate: '15 May 2024', total: 2100, discount: 210, fine: 0, paid: 0, method: null, collectionDate: null, status: 'Pending' },
  { id: 'FC04', student: 'Gifford Ramsey', admissionNo: 'AD202404', roll: 21, className: 'XII', section: 'A', avatar: 'assets/img/students/student-04.jpg', feeGroup: 'Examination Fees', feeType: 'Board Exam', invoiceNo: 'INV-24004', academicYear: '2024/2025', dueDate: '20 May 2024', total: 320, discount: 0, fine: 25, paid: 0, method: null, collectionDate: null, status: 'Overdue' },
  { id: 'FC05', student: 'Lisa Gourley', admissionNo: 'AD202405', roll: 5, className: 'XII', section: 'C', avatar: 'assets/img/students/student-05.jpg', feeGroup: 'Library Fees', feeType: 'Membership', invoiceNo: 'INV-24005', academicYear: '2024/2025', dueDate: '30 May 2024', total: 150, discount: 15, fine: 0, paid: 135, method: 'Card', collectionDate: '04 May 2024', status: 'Paid' },
  { id: 'FC06', student: 'Ralph Claudia', admissionNo: 'AD202406', roll: 17, className: 'XI', section: 'A', avatar: 'assets/img/students/student-06.jpg', feeGroup: 'Sports & Activities', feeType: 'Sports', invoiceNo: 'INV-24006', academicYear: '2024/2025', dueDate: '25 May 2024', total: 260, discount: 0, fine: 0, paid: 130, method: 'UPI', collectionDate: '07 May 2024', status: 'Partially Paid' },
  { id: 'FC07', student: 'Julie Scott', admissionNo: 'AD202407', roll: 3, className: 'VIII', section: 'B', avatar: 'assets/img/students/student-07.jpg', feeGroup: 'Laboratory Fees', feeType: 'Science Lab', invoiceNo: 'INV-24007', academicYear: '2024/2025', dueDate: '18 May 2024', total: 340, discount: 34, fine: 0, paid: 306, method: 'Bank Transfer', collectionDate: '09 May 2024', status: 'Paid' },
  { id: 'FC08', student: 'Hellen Warner', admissionNo: 'AD202408', roll: 9, className: 'XI', section: 'A', avatar: 'assets/img/students/student-08.jpg', feeGroup: 'Admission Fees', feeType: 'Admission', invoiceNo: 'INV-24008', academicYear: '2024/2025', dueDate: '12 May 2024', total: 900, discount: 0, fine: 0, paid: 450, method: 'Cheque', collectionDate: '03 May 2024', status: 'Partially Paid' },
  { id: 'FC09', student: 'Andrew Fischer', admissionNo: 'AD202409', roll: 14, className: 'X', section: 'A', avatar: 'assets/img/students/student-09.jpg', feeGroup: 'Miscellaneous Fees', feeType: 'Uniform', invoiceNo: 'INV-24009', academicYear: '2024/2025', dueDate: '22 May 2024', total: 180, discount: 0, fine: 0, paid: 180, method: 'Cash', collectionDate: '02 May 2024', status: 'Refunded' },
  { id: 'FC10', student: 'Karen Robinson', admissionNo: 'AD202410', roll: 6, className: 'VII', section: 'B', avatar: 'assets/img/students/student-10.jpg', feeGroup: 'Coaching Fees', feeType: 'Coaching', invoiceNo: 'INV-24010', academicYear: '2023/2024', dueDate: '10 Apr 2024', total: 540, discount: 0, fine: 0, paid: 0, method: null, collectionDate: null, status: 'Cancelled' },
];

/* -------------------------------- Derivations ------------------------------- */

export const money = (value: number): string => `$${value.toLocaleString('en-US')}`;

/** Net payable: the concession comes off, the late fine goes on. */
export const payableOf = (row: FeeCollection): number => row.total - row.discount + row.fine;

export const balanceOf = (row: FeeCollection): number => payableOf(row) - row.paid;

export const percentOf = (row: FeeCollection): number => {
  const payable = payableOf(row);
  return payable === 0 ? 0 : Math.round((row.paid / payable) * 100);
};

const serial = (index: number): string => String(index + 1).padStart(3, '0');

export const transactionRefOf = (row: FeeCollection, index: number): string =>
  row.paid > 0 && row.method && row.collectionDate
    ? `TXN24${serial(index)} · ${row.method} · ${row.collectionDate}`
    : 'No transaction recorded yet.';

export const receiptLineOf = (row: FeeCollection, index: number): string =>
  row.paid > 0 && row.method
    ? `Receipt #RC24${String(index + 1).padStart(2, '0')} · ${row.method}`
    : 'No payments yet';

/** Every discount in the template is exactly 10% of the total. */
export const discountTextOf = (row: FeeCollection): string =>
  row.discount > 0
    ? `${money(row.discount)} discount (10%) · merit scholarship applied.`
    : 'No discount or scholarship on this invoice.';

export const fineTextOf = (row: FeeCollection): string =>
  row.fine > 0
    ? `${money(row.fine)} late fine — $5/day since ${row.dueDate}.`
    : 'No fine — payment within the due window.';

export const remarksOf = (row: FeeCollection): string => {
  switch (row.status) {
    case 'Paid': return 'Fully collected and reconciled.';
    case 'Partially Paid': return `Part payment received — balance ${money(balanceOf(row))} pending.`;
    case 'Overdue': return 'Overdue — fine accruing, reminder sent.';
    case 'Refunded': return 'Amount refunded to the guardian.';
    case 'Cancelled': return 'Invoice cancelled — no collection due.';
    case 'Pending':
    default: return 'Awaiting first payment.';
  }
};

export const installmentsOf = (row: FeeCollection): { label: string; state: string }[] => [
  { label: 'Installment 1', state: row.paid > 0 ? 'Paid' : `Due ${row.dueDate}` },
  { label: 'Installment 2', state: balanceOf(row) === 0 ? 'Paid' : `Due ${row.dueDate}` },
];

export const searchIndexOf = (row: FeeCollection): string =>
  [row.student, row.admissionNo, row.invoiceNo, row.feeGroup, row.feeType, row.className, row.status]
    .join(' ')
    .toLowerCase();

/* --------------------------------- Options ---------------------------------- */

export const academicYearOptions = ['2024/2025', '2023/2024'];
export const feeGroupOptions = [
  'Tuition Fees', 'Transport Fees', 'Hostel Fees', 'Examination Fees', 'Library Fees',
  'Sports & Activities', 'Laboratory Fees', 'Admission Fees', 'Miscellaneous Fees', 'Coaching Fees',
];
export const feeTypeOptions = [
  'Tuition', 'Route', 'Room', 'Board Exam', 'Membership', 'Sports', 'Science Lab', 'Admission',
  'Uniform', 'Coaching',
];
export const classOptions = ['X', 'IX', 'XII', 'XI', 'VIII', 'VII'];
export const sectionOptions = ['A', 'B', 'C'];
export const studentOptions = feeCollections.map((row) => row.student);
export const paymentStatusOptions: CollectStatus[] = [
  'Paid', 'Partially Paid', 'Pending', 'Overdue', 'Refunded', 'Cancelled',
];
export const paymentMethodOptions: PaymentMethod[] = ['UPI', 'Cash', 'Card', 'Bank Transfer', 'Cheque'];
export const dueDateOptions = [
  '10 May 2024', '15 May 2024', '20 May 2024', '30 May 2024', '25 May 2024', '18 May 2024',
  '12 May 2024', '22 May 2024', '10 Apr 2024',
];
export const collectionDateOptions = [
  '05 May 2024', '06 May 2024', '04 May 2024', '07 May 2024', '09 May 2024', '03 May 2024', '02 May 2024',
];
