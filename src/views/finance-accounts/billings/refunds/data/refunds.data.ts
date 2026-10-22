export type RefundStatus = 'Pending Approval' | 'Approved' | 'Processing' | 'Processed' | 'Rejected';

export interface Refund {
  id: string;
  refundId: string;
  student: string;
  avatar: string;
  className: string;
  admissionNo: string;
  receiptNo: string;
  invoiceNo: string;
  reason: string;
  reasonTint: string;
  amount: number;
  paymentMethod: string;
  refundMode: string;
  requestedDate: string;
  /** Em dash until the payout clears. */
  processedDate: string;
  status: RefundStatus;
  approvedBy: string;
  /** Date the approval or rejection was recorded; blank while pending. */
  decidedOn: string;
  notes: string;
}

export const statusPill: Record<RefundStatus, string> = {
  'Pending Approval': 'is-pending',
  Approved: 'is-review',
  Processing: 'is-suspended',
  Processed: 'is-active',
  Rejected: 'is-blocked',
};

export const statusBadge: Record<RefundStatus, string> = {
  'Pending Approval': 'badge badge-soft-warning',
  Approved: 'badge badge-soft-info',
  Processing: 'badge badge-soft-secondary',
  Processed: 'badge badge-soft-success',
  Rejected: 'badge badge-soft-danger',
};

export const refunds: Refund[] = [
  { id: 'REF-2026-0042', refundId: 'REF-2026-0042', student: 'Lisa Gourley', avatar: 'assets/img/students/student-04.jpg', className: 'II B', admissionNo: 'AD9892431', receiptNo: 'RCP-2026-0509', invoiceNo: 'INV-2026-0429', reason: 'Duplicate payment', reasonTint: 'info', amount: 1050, paymentMethod: 'Online', refundMode: 'Back to source', requestedDate: '24 Jul 2026', processedDate: '26 Jul 2026', status: 'Processed', approvedBy: 'Finance Manager', decidedOn: '25 Jul', notes: 'Duplicate gateway payment identified during reconciliation.' },
  { id: 'REF-2026-0041', refundId: 'REF-2026-0041', student: 'Julie Scott', avatar: 'assets/img/students/student-06.jpg', className: 'VI A', admissionNo: 'AD9892429', receiptNo: 'RCP-2026-0514', invoiceNo: 'INV-2026-0402', reason: 'Fee waived after payment', reasonTint: 'success', amount: 60, paymentMethod: 'Wallet', refundMode: 'Back to source', requestedDate: '23 Jul 2026', processedDate: '25 Jul 2026', status: 'Processed', approvedBy: 'Mary Winsler', decidedOn: '25 Jul', notes: 'Late return charge reversed after the book was located.' },
  { id: 'REF-2026-0046', refundId: 'REF-2026-0046', student: 'Joann Michael', avatar: 'assets/img/students/student-02.jpg', className: 'IV B', admissionNo: 'AD9892433', receiptNo: 'RCP-2026-0518', invoiceNo: 'INV-2026-0438', reason: 'Transport route discontinued', reasonTint: 'warning', amount: 160, paymentMethod: 'UPI', refundMode: 'Adjust against next term', requestedDate: '29 Jul 2026', processedDate: '—', status: 'Pending Approval', approvedBy: '—', decidedOn: '', notes: 'Route 04 withdrawn mid-term; pro-rata refund requested.' },
  { id: 'REF-2026-0045', refundId: 'REF-2026-0045', student: 'Ralph Claudia', avatar: 'assets/img/students/student-05.jpg', className: 'V A', admissionNo: 'AD9892430', receiptNo: 'RCP-2026-0516', invoiceNo: 'INV-2026-0447', reason: 'Cheque bounced', reasonTint: 'danger', amount: 310, paymentMethod: 'Cheque', refundMode: 'Bank transfer', requestedDate: '28 Jul 2026', processedDate: '—', status: 'Rejected', approvedBy: 'Accounts Head', decidedOn: '29 Jul', notes: 'No funds were received, so there is nothing to refund.' },
  { id: 'REF-2026-0044', refundId: 'REF-2026-0044', student: 'Susan Boswell', avatar: 'assets/img/students/student-07.jpg', className: 'IV A', admissionNo: 'AD9892428', receiptNo: 'RCP-2026-0519', invoiceNo: 'INV-2026-0418', reason: 'Scholarship applied retrospectively', reasonTint: 'purple', amount: 660, paymentMethod: 'Card', refundMode: 'Back to source', requestedDate: '28 Jul 2026', processedDate: '—', status: 'Approved', approvedBy: 'Finance Manager', decidedOn: '30 Jul', notes: 'Merit scholarship approved after payment; excess returned.' },
  { id: 'REF-2026-0043', refundId: 'REF-2026-0043', student: 'Richard Soley', avatar: 'assets/img/students/student-08.jpg', className: 'V B', admissionNo: 'AD9892427', receiptNo: 'RCP-2026-0503', invoiceNo: 'INV-2026-0396', reason: 'Receipt posted to wrong student', reasonTint: 'info', amount: 270, paymentMethod: 'Cash', refundMode: 'Cash reversal', requestedDate: '23 Jul 2026', processedDate: '23 Jul 2026', status: 'Processed', approvedBy: 'Accounts Head', decidedOn: '23 Jul', notes: 'Reversed and re-issued against the correct student record.' },
  { id: 'REF-2026-0047', refundId: 'REF-2026-0047', student: 'Kathleen Dison', avatar: 'assets/img/students/student-03.jpg', className: 'III A', admissionNo: 'AD9892432', receiptNo: 'RCP-2026-0520', invoiceNo: 'INV-2026-0332', reason: 'Excess amount collected', reasonTint: 'warning', amount: 120, paymentMethod: 'UPI', refundMode: 'Back to source', requestedDate: '30 Jul 2026', processedDate: '—', status: 'Processing', approvedBy: 'Finance Manager', decidedOn: '30 Jul', notes: 'Payout queued with the gateway.' },
  { id: 'REF-2026-0040', refundId: 'REF-2026-0040', student: 'Janet Daniel', avatar: 'assets/img/students/student-01.jpg', className: 'III A', admissionNo: 'AD9892434', receiptNo: 'RCP-2026-0489', invoiceNo: 'INV-2026-0388', reason: 'Student withdrawn', reasonTint: 'secondary', amount: 1480, paymentMethod: 'Bank Transfer', refundMode: 'Bank transfer', requestedDate: '18 Jul 2026', processedDate: '—', status: 'Pending Approval', approvedBy: '—', decidedOn: '', notes: 'Withdrawal confirmed; awaiting finance sign-off on the balance.' },
];

export const money = (value: number): string => `$${value.toLocaleString('en-US')}`;

/** The small line under the status pill, derived rather than stored. */
export const approvalLine = (row: Refund): string => {
  if (row.status === 'Pending Approval') return 'Awaiting review';
  if (row.status === 'Rejected') return `Rejected ${row.decidedOn}`;
  return `Approved ${row.decidedOn}`;
};

export const amountBand = (row: Refund): string => {
  if (row.amount < 100) return 'Under $100';
  if (row.amount <= 500) return '$100 – $500';
  if (row.amount <= 1500) return '$500 – $1,500';
  return 'Over $1,500';
};

export const refundTypeOptions = [
  'Duplicate payment',
  'Excess amount collected',
  'Fee waived after payment',
  'Scholarship applied retrospectively',
  'Student withdrawn',
  'Service discontinued',
  'Posted to wrong student',
];

export const refundModeOptions = [
  'Back to source',
  'Bank transfer',
  'Cash reversal',
  'Adjust against next term',
];
