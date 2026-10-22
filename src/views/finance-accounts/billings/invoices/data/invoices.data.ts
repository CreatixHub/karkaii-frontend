export type InvoiceStatus = 'Paid' | 'Partial' | 'Unpaid' | 'Overdue' | 'Draft';

export interface LineItem {
  label: string;
  amount: number;
}

export interface Invoice {
  id: string;
  invoiceNo: string;
  student: string;
  admissionNo: string;
  avatar: string;
  className: string;
  section: string;
  academicYear: string;
  issuedDate: string;
  dueDate: string;
  /** The Billing column's chips; see the file header on why these are separate. */
  tags: string[];
  lineItems: LineItem[];
  discount: number;
  scholarship: number;
  tax: number;
  lateFee: number;
  paid: number;
  /** "No payment" on the three unpaid rows. */
  method: string;
  /** Null where the template prints an em dash. */
  lastPayment: string | null;
  collector: string | null;
  parentName: string;
  parentPhone: string;
  status: InvoiceStatus;
}

export const statusPill: Record<InvoiceStatus, string> = {
  Paid: 'is-active',
  Partial: 'is-review',
  Unpaid: 'is-pending',
  Overdue: 'is-blocked',
  Draft: 'is-inactive',
};

export const statusBadge: Record<InvoiceStatus, string> = {
  Paid: 'badge badge-soft-success',
  Partial: 'badge badge-soft-primary',
  Unpaid: 'badge badge-soft-warning',
  Overdue: 'badge badge-soft-danger',
  Draft: 'badge badge-soft-secondary',
};

export const invoices: Invoice[] = [
  {
    id: 'INV-3301', invoiceNo: 'INV-3301', student: 'Janet Daniel', admissionNo: 'AD202401',
    avatar: 'assets/img/students/student-01.jpg', className: 'Grade 6', section: 'A',
    academicYear: '2025 / 2026', issuedDate: '01 Jul 2026', dueDate: '15 Jul 2026',
    tags: ['Tuition', 'Transport'],
    lineItems: [
      { label: 'Tuition', amount: 1220 },
      { label: 'Transport Fees', amount: 320 },
      { label: 'Library Charges', amount: 40 },
    ],
    discount: 60, scholarship: 0, tax: 0, lateFee: 0, paid: 1520,
    method: 'Bank Transfer', lastPayment: '12 Jul 2026', collector: 'Finance Office',
    parentName: 'Kathryn Daniel', parentPhone: '+1 546 8548 701', status: 'Paid',
  },
  {
    id: 'INV-3302', invoiceNo: 'INV-3302', student: 'Joann Michael', admissionNo: 'AD202402',
    avatar: 'assets/img/students/student-02.jpg', className: 'Grade 5', section: 'B',
    academicYear: '2025 / 2026', issuedDate: '01 Jul 2026', dueDate: '15 Jul 2026',
    tags: ['Tuition', 'Library'],
    lineItems: [
      { label: 'Tuition', amount: 1140 },
      { label: 'Library Charges', amount: 40 },
    ],
    discount: 0, scholarship: 0, tax: 0, lateFee: 0, paid: 600,
    method: 'Card', lastPayment: '10 Jul 2026', collector: 'Front Office',
    parentName: 'Peter Michael', parentPhone: '+1 546 8548 702', status: 'Partial',
  },
  {
    id: 'INV-3303', invoiceNo: 'INV-3303', student: 'Andrew Fischer', admissionNo: 'AD202409',
    avatar: 'assets/img/students/student-03.jpg', className: 'Grade 7', section: 'A',
    academicYear: '2025 / 2026', issuedDate: '01 Jul 2026', dueDate: '15 Jul 2026',
    tags: ['Tuition', 'Hostel'],
    lineItems: [
      { label: 'Tuition', amount: 1300 },
      { label: 'Hostel Fees', amount: 1500 },
    ],
    discount: 0, scholarship: 200, tax: 0, lateFee: 0, paid: 0,
    method: 'No payment', lastPayment: null, collector: null,
    parentName: 'Laura Fischer', parentPhone: '+1 546 8548 703', status: 'Unpaid',
  },
  {
    id: 'INV-3304', invoiceNo: 'INV-3304', student: 'Ralph Claudia', admissionNo: 'AD202406',
    avatar: 'assets/img/students/student-04.jpg', className: 'Grade 4', section: 'C',
    academicYear: '2025 / 2026', issuedDate: '01 Jun 2026', dueDate: '15 Jun 2026',
    tags: ['Tuition', 'Transport', 'Library'],
    lineItems: [
      { label: 'Tuition', amount: 1060 },
      { label: 'Transport Fees', amount: 280 },
      { label: 'Library Charges', amount: 40 },
    ],
    discount: 0, scholarship: 0, tax: 0, lateFee: 60, paid: 400,
    method: 'Cash', lastPayment: '18 Jun 2026', collector: 'Transport Desk',
    parentName: 'Diana Claudia', parentPhone: '+1 546 8548 704', status: 'Overdue',
  },
  {
    id: 'INV-3305', invoiceNo: 'INV-3305', student: 'Julie Scott', admissionNo: 'AD202405',
    avatar: 'assets/img/students/student-05.jpg', className: 'Grade 8', section: 'A',
    academicYear: '2025 / 2026', issuedDate: '01 Jul 2026', dueDate: '15 Jul 2026',
    tags: ['Tuition'],
    lineItems: [{ label: 'Tuition', amount: 1300 }],
    discount: 50, scholarship: 0, tax: 0, lateFee: 0, paid: 1250,
    method: 'Bank Transfer', lastPayment: '08 Jul 2026', collector: 'Finance Office',
    parentName: 'Marcus Scott', parentPhone: '+1 546 8548 705', status: 'Paid',
  },
  {
    id: 'INV-3306', invoiceNo: 'INV-3306', student: 'Susan Boswell', admissionNo: 'AD202411',
    avatar: 'assets/img/students/student-06.jpg', className: 'Grade 6', section: 'B',
    academicYear: '2025 / 2026', issuedDate: '01 Jul 2026', dueDate: '15 Jul 2026',
    tags: ['Tuition', 'Transport'],
    lineItems: [
      { label: 'Tuition', amount: 1360 },
      { label: 'Transport Fees', amount: 340 },
    ],
    discount: 0, scholarship: 100, tax: 0, lateFee: 0, paid: 800,
    method: 'Card', lastPayment: '11 Jul 2026', collector: 'Finance Office',
    parentName: 'Gordon Boswell', parentPhone: '+1 546 8548 706', status: 'Partial',
  },
  {
    id: 'INV-3307', invoiceNo: 'INV-3307', student: 'Richard Bruno', admissionNo: 'AD202413',
    avatar: 'assets/img/students/student-07.jpg', className: 'Grade 3', section: 'A',
    academicYear: '2025 / 2026', issuedDate: '01 Jun 2026', dueDate: '15 Jun 2026',
    tags: ['Tuition', 'Exam'],
    lineItems: [{ label: 'Tuition', amount: 1260 }],
    discount: 0, scholarship: 0, tax: 0, lateFee: 50, paid: 0,
    method: 'No payment', lastPayment: null, collector: null,
    parentName: 'Helen Bruno', parentPhone: '+1 546 8548 707', status: 'Overdue',
  },
  {
    id: 'INV-3308', invoiceNo: 'INV-3308', student: 'Thomas Patricia', admissionNo: 'AD202415',
    avatar: 'assets/img/students/student-08.jpg', className: 'Grade 5', section: 'A',
    academicYear: '2025 / 2026', issuedDate: '01 Jul 2026', dueDate: '15 Jul 2026',
    tags: ['Tuition', 'Transport', 'Hostel'],
    lineItems: [
      { label: 'Tuition', amount: 1500 },
      { label: 'Transport Fees', amount: 320 },
      { label: 'Hostel Fees', amount: 1500 },
    ],
    discount: 120, scholarship: 0, tax: 0, lateFee: 0, paid: 3200,
    method: 'Cheque', lastPayment: '09 Jul 2026', collector: 'Hostel Office',
    parentName: 'George Patricia', parentPhone: '+1 546 8548 708', status: 'Paid',
  },
  {
    id: 'INV-3309', invoiceNo: 'INV-3309', student: 'Aaron Kimberly', admissionNo: 'AD202418',
    avatar: 'assets/img/students/student-09.jpg', className: 'Grade 7', section: 'C',
    academicYear: '2025 / 2026', issuedDate: '22 Jul 2026', dueDate: '05 Aug 2026',
    tags: ['Tuition'],
    lineItems: [{ label: 'Tuition', amount: 1250 }],
    discount: 0, scholarship: 0, tax: 0, lateFee: 0, paid: 0,
    method: 'No payment', lastPayment: null, collector: null,
    parentName: 'Nancy Kimberly', parentPhone: '+1 546 8548 709', status: 'Draft',
  },
  {
    id: 'INV-3310', invoiceNo: 'INV-3310', student: 'Mark Williams', admissionNo: 'AD202420',
    avatar: 'assets/img/students/student-10.jpg', className: 'Grade 4', section: 'B',
    academicYear: '2025 / 2026', issuedDate: '01 Jul 2026', dueDate: '15 Jul 2026',
    tags: ['Tuition', 'Library'],
    lineItems: [
      { label: 'Tuition', amount: 1250 },
      { label: 'Library Charges', amount: 40 },
    ],
    discount: 0, scholarship: 0, tax: 0, lateFee: 0, paid: 645,
    method: 'Card', lastPayment: '13 Jul 2026', collector: 'Front Office',
    parentName: 'Rose Williams', parentPhone: '+1 546 8548 710', status: 'Partial',
  },
];

/* -------------------------------- Derivations ------------------------------- */

export const money = (value: number): string => `$${value.toLocaleString('en-US')}`;

export const subtotalOf = (row: Invoice): number =>
  row.lineItems.reduce((sum, item) => sum + item.amount, 0);

/** Grid Total. Verified against all ten rows — see the file header. */
export const totalOf = (row: Invoice): number =>
  subtotalOf(row) - row.discount - row.scholarship + row.tax + row.lateFee;

export const balanceOf = (row: Invoice): number => totalOf(row) - row.paid;

export const percentOf = (row: Invoice): number => {
  const total = totalOf(row);
  return total === 0 ? 0 : Math.round((row.paid / total) * 100);
};

/** INV-3301 → RCPT-3301; the three unpaid rows have none. */
export const receiptNoOf = (row: Invoice): string | null =>
  row.paid > 0 ? row.invoiceNo.replace('INV-', 'RCPT-') : null;

export const timelineOf = (row: Invoice): string[] => {
  const events = [`Invoice issued ${row.issuedDate}`];
  if (row.paid > 0 && row.lastPayment) events.push(`${money(row.paid)} received ${row.lastPayment}`);
  else events.push('Awaiting payment');
  if (balanceOf(row) > 0 && row.paid > 0) events.push(`${money(balanceOf(row))} balance due`);
  return events;
};

/** Overdue invoices carry a reminder, stamped with the due date. */
export const communicationsOf = (row: Invoice): string[] => {
  const log = [`Invoice emailed ${row.issuedDate}`];
  if (row.status === 'Overdue') log.push(`Reminder sent ${row.dueDate}`);
  return log;
};

export const notesOf = (row: Invoice): string => {
  switch (row.status) {
    case 'Paid': return 'Fully paid and receipted.';
    case 'Partial': return 'Partial payment received; balance pending.';
    case 'Overdue': return 'Overdue — follow up with the parent for the balance.';
    case 'Draft': return 'Draft invoice — not yet issued.';
    case 'Unpaid':
    default: return 'Issued, awaiting first payment.';
  }
};

/** The Payment Status filter buckets by how much of the total is settled. */
export const paymentStatusOf = (row: Invoice): string => {
  if (row.paid === 0) return 'Not Paid';
  return balanceOf(row) === 0 ? 'Fully Paid' : 'Part Paid';
};

/** The Amount Range filter's three bands. */
export const amountBandOf = (row: Invoice): string => {
  const total = totalOf(row);
  if (total < 1500) return 'Under $1,500';
  if (total <= 3000) return '$1,500 – $3,000';
  return 'Over $3,000';
};

/** The Date Range filter matches the issue month, e.g. "Jul 2026". */
export const issueMonthOf = (row: Invoice): string => row.issuedDate.slice(3);

export const searchIndexOf = (row: Invoice): string =>
  [row.invoiceNo, row.student, row.admissionNo, row.method, row.collector ?? '', row.className]
    .join(' ')
    .toLowerCase();

/* --------------------------------- Options ---------------------------------- */

export const invoiceStatusOptions: InvoiceStatus[] = ['Paid', 'Partial', 'Unpaid', 'Overdue', 'Draft'];
export const paymentStatusOptions = ['Fully Paid', 'Part Paid', 'Not Paid'];
export const academicYearOptions = ['2025 / 2026', '2024 / 2025'];
export const classOptions = ['Grade 6', 'Grade 5', 'Grade 7', 'Grade 4', 'Grade 8', 'Grade 3'];
export const studentOptions = invoices.map((row) => row.student);
export const dateRangeOptions = ['Jul 2026', 'Jun 2026'];
export const amountRangeOptions = ['Under $1,500', '$1,500 – $3,000', 'Over $3,000'];
export const collectorOptions = ['Finance Office', 'Front Office', 'Transport Desk', 'Hostel Office'];
export const methodOptions = ['Bank Transfer', 'Card', 'Cash', 'Cheque', 'UPI'];
