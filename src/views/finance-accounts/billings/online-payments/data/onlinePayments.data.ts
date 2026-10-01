export type PayStatus = 'Success' | 'Pending' | 'Failed' | 'Refunded' | 'Partially Refunded';

export interface OnlinePayment {
  id: string;
  txnId: string;
  student: string;
  avatar: string;
  className: string;
  admissionNo: string;
  receiptNo: string;
  invoiceNo: string;
  gateway: string;
  gatewayTint: string;
  method: string;
  amount: number;
  /** Null where the template prints an em dash — nothing was captured. */
  charges: number | null;
  date: string;
  time: string;
  status: PayStatus;
  referenceNo: string;
  academicYear: string;
  notes: string;
}

export const statusPill: Record<PayStatus, string> = {
  Success: 'is-active',
  Pending: 'is-pending',
  Failed: 'is-blocked',
  Refunded: 'is-archived',
  'Partially Refunded': 'is-review',
};

export const statusBadge: Record<PayStatus, string> = {
  Success: 'badge badge-soft-success',
  Pending: 'badge badge-soft-warning',
  Failed: 'badge badge-soft-danger',
  Refunded: 'badge badge-soft-secondary',
  'Partially Refunded': 'badge badge-soft-info',
};

export const onlinePayments: OnlinePayment[] = [
  { id: 'PAY-70052117', txnId: 'PAY-70052117', student: 'Kathleen Dison', avatar: 'assets/img/students/student-03.jpg', className: 'III A', admissionNo: 'AD9892432', receiptNo: 'RCP-2026-0520', invoiceNo: 'INV-2026-0332', gateway: 'RazorPay', gatewayTint: 'primary', method: 'UPI', amount: 640, charges: 6.4, date: '29 Jul 2026', time: '03:14 PM', status: 'Success', referenceNo: 'UPI-88213470', academicYear: '2026 / 2027', notes: 'Captured and settled the same day.' },
  { id: 'PAY-70052094', txnId: 'PAY-70052094', student: 'Susan Boswell', avatar: 'assets/img/students/student-07.jpg', className: 'IV A', admissionNo: 'AD9892428', receiptNo: 'RCP-2026-0519', invoiceNo: 'INV-2026-0418', gateway: 'Stripe', gatewayTint: 'purple', method: 'Card', amount: 880, charges: 12.32, date: '29 Jul 2026', time: '11:06 AM', status: 'Success', referenceNo: 'CARD-6621991', academicYear: '2026 / 2027', notes: 'Part payment against the Term II tuition invoice.' },
  { id: 'PAY-70052041', txnId: 'PAY-70052041', student: 'Ralph Claudia', avatar: 'assets/img/students/student-05.jpg', className: 'V A', admissionNo: 'AD9892430', receiptNo: '—', invoiceNo: 'INV-2026-0447', gateway: 'PayU', gatewayTint: 'warning', method: 'Net Banking', amount: 310, charges: null, date: '28 Jul 2026', time: '07:22 PM', status: 'Pending', referenceNo: 'NB-4471880', academicYear: '2026 / 2027', notes: 'Awaiting bank confirmation; no receipt issued yet.' },
  { id: 'PAY-70051968', txnId: 'PAY-70051968', student: 'Janet Daniel', avatar: 'assets/img/students/student-01.jpg', className: 'III A', admissionNo: 'AD9892434', receiptNo: '—', invoiceNo: 'INV-2026-0441', gateway: 'RazorPay', gatewayTint: 'primary', method: 'UPI', amount: 1900, charges: null, date: '27 Jul 2026', time: '09:48 AM', status: 'Failed', referenceNo: 'UPI-88210094', academicYear: '2026 / 2027', notes: 'Payment declined by the issuing bank. Settled later at the counter.' },
  { id: 'PAY-70051822', txnId: 'PAY-70051822', student: 'Lisa Gourley', avatar: 'assets/img/students/student-04.jpg', className: 'II B', admissionNo: 'AD9892431', receiptNo: 'RCP-2026-0509', invoiceNo: 'INV-2026-0429', gateway: 'Stripe', gatewayTint: 'purple', method: 'Card', amount: 1050, charges: 14.7, date: '24 Jul 2026', time: '04:55 PM', status: 'Refunded', referenceNo: 'PAY-70051822', academicYear: '2026 / 2027', notes: 'Duplicate payment refunded to source on 26 Jul 2026.' },
  { id: 'PAY-70051744', txnId: 'PAY-70051744', student: 'Joann Michael', avatar: 'assets/img/students/student-02.jpg', className: 'IV B', admissionNo: 'AD9892433', receiptNo: 'RCP-2026-0518', invoiceNo: 'INV-2026-0438', gateway: 'Cashfree', gatewayTint: 'success', method: 'Wallet', amount: 320, charges: 3.84, date: '23 Jul 2026', time: '01:30 PM', status: 'Success', referenceNo: 'WLT-2210447', academicYear: '2026 / 2027', notes: 'Term I transport instalment.' },
  { id: 'PAY-70051610', txnId: 'PAY-70051610', student: 'Julie Scott', avatar: 'assets/img/students/student-06.jpg', className: 'VI A', admissionNo: 'AD9892429', receiptNo: 'RCP-2026-0514', invoiceNo: 'INV-2026-0402', gateway: 'PayPal', gatewayTint: 'info', method: 'Wallet', amount: 180, charges: 5.4, date: '21 Jul 2026', time: '10:12 AM', status: 'Partially Refunded', referenceNo: 'PPL-9930118', academicYear: '2026 / 2027', notes: 'Replacement charge reversed after the book was located.' },
  { id: 'PAY-70051503', txnId: 'PAY-70051503', student: 'Richard Soley', avatar: 'assets/img/students/student-08.jpg', className: 'V B', admissionNo: 'AD9892427', receiptNo: '—', invoiceNo: 'INV-2026-0396', gateway: 'RazorPay', gatewayTint: 'primary', method: 'Net Banking', amount: 560, charges: null, date: '20 Jul 2026', time: '05:41 PM', status: 'Failed', referenceNo: 'NB-4470221', academicYear: '2026 / 2027', notes: 'Session timed out before the bank redirect completed.' },
];

export const money = (value: number): string =>
  `$${value.toLocaleString('en-US', { maximumFractionDigits: 2 })}`;

/** Settlement follows payment status; the template lists it as its own filter. */
export const settlementOf = (row: OnlinePayment): string => {
  if (row.status === 'Success') return 'Settled';
  if (row.status === 'Pending') return 'Awaiting settlement';
  return 'Not applicable';
};

export const amountBand = (row: OnlinePayment): string => {
  if (row.amount < 250) return 'Under $250';
  if (row.amount <= 1000) return '$250 – $1,000';
  if (row.amount <= 2500) return '$1,000 – $2,500';
  return 'Over $2,500';
};
