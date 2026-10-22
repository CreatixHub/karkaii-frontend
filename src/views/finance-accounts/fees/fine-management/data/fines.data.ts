export type FineStatus = 'Paid' | 'Partially Paid' | 'Unpaid' | 'Overdue' | 'Waived';

export interface FinePayment {
  when: string;
  amount: number;
}

export interface Fine {
  id: string;
  fineId: string;
  student: string;
  avatar: string;
  admissionNo: string;
  rollNo: string;
  className: string;
  section: string;
  category: string;
  categoryTint: string;
  amount: number;
  dueDate: string;
  status: FineStatus;
  createdBy: string;
  createdByRole: string;
  /** Detail panel. */
  issuedOn: string;
  receiptNo: string;
  paymentMode: string;
  guardian: string;
  contact: string;
  payments: FinePayment[];
  waiver: string | null;
  remarks: string;
}

export const statusPill: Record<FineStatus, string> = {
  Paid: 'is-active',
  'Partially Paid': 'is-pending',
  Unpaid: 'is-inactive',
  Overdue: 'is-blocked',
  Waived: 'is-archived',
};

export const statusBadge: Record<FineStatus, string> = {
  Paid: 'badge badge-soft-success',
  'Partially Paid': 'badge badge-soft-warning',
  Unpaid: 'badge badge-soft-secondary',
  Overdue: 'badge badge-soft-danger',
  Waived: 'badge badge-soft-info',
};

export const fines: Fine[] = [
  {
    id: 'FN-2026-0231', fineId: 'FN-2026-0231', student: 'Janet Daniel', avatar: 'assets/img/students/student-01.jpg',
    admissionNo: 'AD9892434', rollNo: '35011', className: 'III A', section: 'A',
    category: 'Late Fee', categoryTint: 'warning', amount: 50, dueDate: '05 Aug 2026', status: 'Unpaid',
    createdBy: 'Sarah Rose', createdByRole: 'Accounts',
    issuedOn: '24 Jul 2026', receiptNo: '—', paymentMode: '—',
    guardian: 'Thomas Daniel', contact: '+1 546 8548 891', payments: [], waiver: null,
    remarks: 'Guardian informed by phone on 24 Jul. Committed to pay before the due date.',
  },
  {
    id: 'FN-2026-0230', fineId: 'FN-2026-0230', student: 'Joann Michael', avatar: 'assets/img/students/student-02.jpg',
    admissionNo: 'AD9892433', rollNo: '35102', className: 'IV B', section: 'B',
    category: 'Library Fine', categoryTint: 'info', amount: 12, dueDate: '28 Jul 2026', status: 'Paid',
    createdBy: 'Mary Winsler', createdByRole: 'Librarian',
    issuedOn: '18 Jul 2026', receiptNo: 'RCP-0509', paymentMode: 'Cash',
    guardian: 'Peter Michael', contact: '+1 546 8548 892',
    payments: [{ when: '18 Jul 2026 · Cash · RCP-0509', amount: 12 }], waiver: null,
    remarks: '“A Brief History of Time” returned with no damage. Fine settled at the counter.',
  },
  {
    id: 'FN-2026-0228', fineId: 'FN-2026-0228', student: 'Kathleen Dison', avatar: 'assets/img/students/student-03.jpg',
    admissionNo: 'AD9892432', rollNo: '35013', className: 'III A', section: 'A',
    category: 'Discipline Fine', categoryTint: 'danger', amount: 35, dueDate: '30 Jul 2026', status: 'Partially Paid',
    createdBy: 'James Hendriques', createdByRole: 'Class Teacher',
    issuedOn: '14 Jul 2026', receiptNo: 'RCP-0517', paymentMode: 'UPI',
    guardian: 'Robert Dison', contact: '+1 546 8548 893',
    payments: [{ when: '18 Jul 2026 · UPI · RCP-0517', amount: 20 }], waiver: null,
    remarks: 'Replacement cost split across two installments on guardian request.',
  },
  {
    id: 'FN-2026-0225', fineId: 'FN-2026-0225', student: 'Lisa Gourley', avatar: 'assets/img/students/student-04.jpg',
    admissionNo: 'AD9892431', rollNo: '35204', className: 'II B', section: 'B',
    category: 'Transport Fine', categoryTint: 'success', amount: 20, dueDate: '22 Jul 2026', status: 'Overdue',
    createdBy: 'Daniel Josua', createdByRole: 'Transport Head',
    issuedOn: '12 Jul 2026', receiptNo: '—', paymentMode: '—',
    guardian: 'Janet Gourley', contact: '+1 546 8548 894', payments: [], waiver: null,
    remarks: 'Second reminder sent on 26 Jul. Route 04 pass suspended until payment.',
  },
  {
    id: 'FN-2026-0223', fineId: 'FN-2026-0223', student: 'Ralph Claudia', avatar: 'assets/img/students/student-05.jpg',
    admissionNo: 'AD9892430', rollNo: '35505', className: 'V A', section: 'A',
    category: 'Exam Fine', categoryTint: 'primary', amount: 25, dueDate: '18 Jul 2026', status: 'Paid',
    createdBy: 'Erickson Gomez', createdByRole: 'Exam Cell',
    issuedOn: '10 Jul 2026', receiptNo: 'RCP-0498', paymentMode: 'Card',
    guardian: 'Claudia Ralph', contact: '+1 546 8548 895',
    payments: [{ when: '16 Jul 2026 · Card · RCP-0498', amount: 25 }], waiver: null,
    remarks: 'Re-exam scheduled for 05 Aug 2026, second period.',
  },
  {
    id: 'FN-2026-0219', fineId: 'FN-2026-0219', student: 'Julie Scott', avatar: 'assets/img/students/student-06.jpg',
    admissionNo: 'AD9892429', rollNo: '35606', className: 'VI A', section: 'A',
    category: 'Hostel Fine', categoryTint: 'purple', amount: 30, dueDate: '15 Jul 2026', status: 'Waived',
    createdBy: 'Aaron Grey', createdByRole: 'Warden',
    issuedOn: '08 Jul 2026', receiptNo: '—', paymentMode: '—',
    guardian: 'Andrew Scott', contact: '+1 546 8548 896', payments: [],
    waiver: 'Full waiver · $30 approved by Principal Office.',
    remarks: 'First offence. Written apology filed with the warden’s office.',
  },
  {
    id: 'FN-2026-0216', fineId: 'FN-2026-0216', student: 'Susan Boswell', avatar: 'assets/img/students/student-07.jpg',
    admissionNo: 'AD9892428', rollNo: '35407', className: 'IV A', section: 'A',
    category: 'Miscellaneous', categoryTint: 'secondary', amount: 8, dueDate: '25 Jul 2026', status: 'Overdue',
    createdBy: 'Sarah Rose', createdByRole: 'Accounts',
    issuedOn: '15 Jul 2026', receiptNo: '—', paymentMode: '—',
    guardian: 'Mark Boswell', contact: '+1 546 8548 897', payments: [], waiver: null,
    remarks: 'New ID card printed and held at the front office until payment.',
  },
  {
    id: 'FN-2026-0212', fineId: 'FN-2026-0212', student: 'Richard Soley', avatar: 'assets/img/students/student-08.jpg',
    admissionNo: 'AD9892427', rollNo: '35508', className: 'V B', section: 'B',
    category: 'Late Fee', categoryTint: 'warning', amount: 45, dueDate: '12 Jul 2026', status: 'Partially Paid',
    createdBy: 'Sarah Rose', createdByRole: 'Accounts',
    issuedOn: '02 Jul 2026', receiptNo: 'RCP-0481', paymentMode: 'Cash',
    guardian: 'Helen Soley', contact: '+1 546 8548 898',
    payments: [
      { when: '10 Jul 2026 · Cash · RCP-0475', amount: 20 },
      { when: '14 Jul 2026 · Cash · RCP-0481', amount: 15 },
    ],
    waiver: null,
    remarks: 'Balance of $10 promised with the Term-2 installment.',
  },
];

/* -------------------------------- Derivations ------------------------------- */

export const money = (value: number): string => `$${value.toLocaleString('en-US')}`;

export const paidAmount = (row: Fine): number =>
  row.payments.reduce((total, payment) => total + payment.amount, 0);

/** Waived fines carry no balance regardless of payments. */
export const outstanding = (row: Fine): number =>
  row.status === 'Waived' ? 0 : Math.max(0, row.amount - paidAmount(row));

/** The overdue banner under the due date, present only on overdue rows. */
export const REFERENCE_DATE = new Date(2026, 6, 30);

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const parseDate = (value: string): Date => {
  const [day, month, year] = value.trim().split(/\s+/);
  return new Date(Number(year), MONTHS.indexOf(month), Number(day));
};

export const daysOverdue = (row: Fine): number => {
  if (row.status !== 'Overdue') return 0;
  const diff = Math.round((REFERENCE_DATE.getTime() - parseDate(row.dueDate).getTime()) / 86400000);
  return diff > 0 ? diff : 0;
};

export const outstandingBand = (row: Fine): string => {
  const value = outstanding(row);
  if (value === 0) return 'Fully cleared';
  if (value < 25) return 'Under $25';
  if (value <= 50) return '$25 – $50';
  return 'Over $50';
};

/* ------------------------------ Category cards ------------------------------ */

export interface FineCategory {
  id: string;
  label: string;
  icon: string;
  tint: string;
  /** School-wide counts from the template, spanning 96 fines not the eight shown. */
  summary: string;
}

export const fineCategories: FineCategory[] = [
  { id: 'Late Fee', label: 'Late Fee', icon: 'ti ti-clock-dollar', tint: 'warning', summary: '32 fines · $1,240 due' },
  { id: 'Library Fine', label: 'Library Fine', icon: 'ti ti-books', tint: 'info', summary: '18 fines · $164 due' },
  { id: 'Transport Fine', label: 'Transport Fine', icon: 'ti ti-bus', tint: 'success', summary: '9 fines · $170 due' },
  { id: 'Hostel Fine', label: 'Hostel Fine', icon: 'ti ti-building', tint: 'purple', summary: '6 fines · $120 due' },
  { id: 'Discipline Fine', label: 'Discipline Fine', icon: 'ti ti-gavel', tint: 'danger', summary: '11 fines · $385 due' },
  { id: 'Exam Fine', label: 'Exam Fine', icon: 'ti ti-file-certificate', tint: 'pink', summary: '14 fines · $325 due' },
  { id: 'Uniform Fine', label: 'Uniform Fine', icon: 'ti ti-shirt', tint: 'info', summary: '5 fines · $60 due' },
  { id: 'Miscellaneous', label: 'Miscellaneous', icon: 'ti ti-coins', tint: 'secondary', summary: '7 fines · $56 due' },
];
