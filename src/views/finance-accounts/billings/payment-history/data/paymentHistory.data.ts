export type PaymentStatus =
  | 'Completed'
  | 'Partially Paid'
  | 'Pending Clearance'
  | 'Partially Refunded'
  | 'Refunded'
  | 'Cancelled';

export interface Payment {
  id: string;
  receiptNo: string;
  student: string;
  avatar: string;
  className: string;
  admissionNo: string;
  paymentDate: string;
  paymentTime: string;
  feeCategory: string;
  categoryTint: string;
  paymentMethod: string;
  amountPaid: number;
  balance: number;
  collectedBy: string;
  collectedByRole: string;
  status: PaymentStatus;
  academicYear: string;
  invoiceNo: string;
  notes: string;
}

export const statusPill: Record<PaymentStatus, string> = {
  Completed: 'is-active',
  'Partially Paid': 'is-pending',
  'Pending Clearance': 'is-review',
  'Partially Refunded': 'is-review',
  Refunded: 'is-archived',
  Cancelled: 'is-blocked',
};

export const statusBadge: Record<PaymentStatus, string> = {
  Completed: 'badge badge-soft-success',
  'Partially Paid': 'badge badge-soft-warning',
  'Pending Clearance': 'badge badge-soft-info',
  'Partially Refunded': 'badge badge-soft-info',
  Refunded: 'badge badge-soft-secondary',
  Cancelled: 'badge badge-soft-danger',
};

export const payments: Payment[] = [
  { id: 'RCP-2026-0521', receiptNo: 'RCP-2026-0521', student: 'Janet Daniel', avatar: 'assets/img/students/student-01.jpg', className: 'III A', admissionNo: 'AD9892434', paymentDate: '30 Jul 2026', paymentTime: '10:24 AM', feeCategory: 'Tuition Fee', categoryTint: 'primary', paymentMethod: 'Cash', amountPaid: 1900, balance: 0, collectedBy: 'Sarah Rose', collectedByRole: 'Accounts', status: 'Completed', academicYear: '2026 / 2027', invoiceNo: 'INV-2026-0441', notes: 'Full settlement of the overdue Term II invoice.' },
  { id: 'RCP-2026-0520', receiptNo: 'RCP-2026-0520', student: 'Kathleen Dison', avatar: 'assets/img/students/student-03.jpg', className: 'III A', admissionNo: 'AD9892432', paymentDate: '29 Jul 2026', paymentTime: '03:14 PM', feeCategory: 'Tuition Fee', categoryTint: 'primary', paymentMethod: 'UPI', amountPaid: 640, balance: 0, collectedBy: 'Parent Portal', collectedByRole: 'Online', status: 'Completed', academicYear: '2026 / 2027', invoiceNo: 'INV-2026-0332', notes: 'Balance settled online after the welfare concession.' },
  { id: 'RCP-2026-0519', receiptNo: 'RCP-2026-0519', student: 'Susan Boswell', avatar: 'assets/img/students/student-07.jpg', className: 'IV A', admissionNo: 'AD9892428', paymentDate: '29 Jul 2026', paymentTime: '11:08 AM', feeCategory: 'Tuition Fee', categoryTint: 'primary', paymentMethod: 'Card', amountPaid: 880, balance: 880, collectedBy: 'Sarah Rose', collectedByRole: 'Accounts', status: 'Partially Paid', academicYear: '2026 / 2027', invoiceNo: 'INV-2026-0418', notes: 'Part payment; balance held pending the merit scholarship renewal.' },
  { id: 'RCP-2026-0518', receiptNo: 'RCP-2026-0518', student: 'Joann Michael', avatar: 'assets/img/students/student-02.jpg', className: 'IV B', admissionNo: 'AD9892433', paymentDate: '23 Jul 2026', paymentTime: '01:32 PM', feeCategory: 'Transport Fee', categoryTint: 'success', paymentMethod: 'Wallet', amountPaid: 320, balance: 320, collectedBy: 'Front Office', collectedByRole: 'Counter', status: 'Partially Paid', academicYear: '2026 / 2027', invoiceNo: 'INV-2026-0438', notes: 'Term I instalment paid; Term II due 05 Aug 2026.' },
  { id: 'RCP-2026-0516', receiptNo: 'RCP-2026-0516', student: 'Ralph Claudia', avatar: 'assets/img/students/student-05.jpg', className: 'V A', admissionNo: 'AD9892430', paymentDate: '27 Jul 2026', paymentTime: '02:38 PM', feeCategory: 'Exam Fee', categoryTint: 'info', paymentMethod: 'Cheque', amountPaid: 310, balance: 310, collectedBy: 'Sarah Rose', collectedByRole: 'Accounts', status: 'Pending Clearance', academicYear: '2026 / 2027', invoiceNo: 'INV-2026-0447', notes: 'Cheque deposited 27 Jul; clears 02 Aug 2026.' },
  { id: 'RCP-2026-0514', receiptNo: 'RCP-2026-0514', student: 'Julie Scott', avatar: 'assets/img/students/student-06.jpg', className: 'VI A', admissionNo: 'AD9892429', paymentDate: '21 Jul 2026', paymentTime: '10:14 AM', feeCategory: 'Library Fee', categoryTint: 'secondary', paymentMethod: 'Wallet', amountPaid: 120, balance: 0, collectedBy: 'Mary Winsler', collectedByRole: 'Librarian', status: 'Partially Refunded', academicYear: '2026 / 2027', invoiceNo: 'INV-2026-0402', notes: 'Replacement charge reversed after the book was located.' },
  { id: 'RCP-2026-0509', receiptNo: 'RCP-2026-0509', student: 'Lisa Gourley', avatar: 'assets/img/students/student-04.jpg', className: 'II B', admissionNo: 'AD9892431', paymentDate: '24 Jul 2026', paymentTime: '04:55 PM', feeCategory: 'Hostel Fee', categoryTint: 'purple', paymentMethod: 'Online', amountPaid: 1050, balance: 2100, collectedBy: 'Parent Portal', collectedByRole: 'Online', status: 'Refunded', academicYear: '2026 / 2027', invoiceNo: 'INV-2026-0429', notes: 'Duplicate payment refunded to source on 26 Jul 2026.' },
  { id: 'RCP-2026-0503', receiptNo: 'RCP-2026-0503', student: 'Richard Soley', avatar: 'assets/img/students/student-08.jpg', className: 'V B', admissionNo: 'AD9892427', paymentDate: '22 Jul 2026', paymentTime: '10:02 AM', feeCategory: 'Transport Fee', categoryTint: 'success', paymentMethod: 'Cash', amountPaid: 270, balance: 560, collectedBy: 'Front Office', collectedByRole: 'Counter', status: 'Cancelled', academicYear: '2026 / 2027', invoiceNo: 'INV-2026-0396', notes: 'Cancelled — posted against the wrong student record.' },
];

export const money = (value: number): string => `$${value.toLocaleString('en-US')}`;
