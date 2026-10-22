export interface FeeLine {
  category: string;
  categoryTint: string;
  icon: string;
  description: string;
  qty: number;
  amount: number;
  discount: number;
  tax: number;
}

export interface Payment {
  receiptNo: string;
  date: string;
  amount: number;
  method: string;
  transactionId: string;
  collectedBy: string;
  remarks: string;
}

export interface TimelineStep {
  title: string;
  meta: string;
  icon: string;
  done: boolean;
}

export interface ActivityEntry {
  title: string;
  meta: string;
}

export interface Attachment {
  name: string;
  meta: string;
  icon: string;
}

export interface InvoiceDetail {
  invoiceNo: string;
  organisation: string;
  documentType: string;
  status: string;
  invoiceDate: string;
  dueDate: string;
  academicYear: string;
  createdBy: string;
  lastUpdated: string;

  billingTerm: string;
  referenceNo: string;
  paymentTerms: string;
  currency: string;
  feeGroup: string;
  collector: string;
  branch: string;
  taxNo: string;

  student: string;
  admissionNo: string;
  className: string;
  section: string;
  guardian: string;
  contact: string;
  email: string;

  lines: FeeLine[];
  /** Adjustments applied below the line-item subtotal. */
  scholarship: number;
  previousBalance: number;
  lateFee: number;
  /** The template labels the tax row "Tax (9%)". */
  taxLabel: string;

  payments: Payment[];
  timeline: TimelineStep[];
  activity: ActivityEntry[];
  attachments: Attachment[];
}

export const invoiceDetail: InvoiceDetail = {
  invoiceNo: 'INV-2024-0192',
  organisation: 'Global International School',
  documentType: 'Tax Invoice',
  status: 'Partially Paid',
  invoiceDate: '24 Apr 2024',
  dueDate: '30 Apr 2024',
  academicYear: '2024 / 2025',
  createdBy: 'Kevin Larry',
  lastUpdated: '26 Apr 2024, 10:15 AM',

  billingTerm: 'Term 1 · 2024/2025',
  referenceNo: 'REF-88213',
  paymentTerms: 'Net 7 Days',
  currency: 'USD ($)',
  feeGroup: 'Standard Tuition',
  collector: 'Teresa Smith',
  branch: 'Main Campus',
  taxNo: 'GSTIN 29ABCDE',

  student: 'Janet Daniel',
  admissionNo: 'AD-1201',
  className: 'VII',
  section: 'A',
  guardian: 'Michael Daniel',
  contact: '+1 675 434 5665',
  email: 'michael.daniel@example.com',

  lines: [
    { category: 'Tuition Fee', categoryTint: 'primary', icon: 'ti ti-school', description: 'Semester tuition — Term 1', qty: 1, amount: 5000, discount: 300, tax: 450 },
    { category: 'Transport Fee', categoryTint: 'info', icon: 'ti ti-bus', description: 'Route 12 · Pickup Point B', qty: 1, amount: 2000, discount: 0, tax: 180 },
    { category: 'Hostel Fee', categoryTint: 'warning', icon: 'ti ti-building-community', description: 'Block A · Shared room', qty: 1, amount: 2000, discount: 100, tax: 171 },
    { category: 'Library Fee', categoryTint: 'teal', icon: 'ti ti-books', description: 'Annual membership', qty: 1, amount: 500, discount: 0, tax: 45 },
    { category: 'Exam Fee', categoryTint: 'pink', icon: 'ti ti-file-certificate', description: 'Term 1 examinations', qty: 1, amount: 500, discount: 0, tax: 54 },
  ],
  scholarship: 600,
  previousBalance: 250,
  lateFee: 100,
  taxLabel: 'Tax (9%)',

  payments: [
    { receiptNo: 'RCPT-5521', date: '25 Apr 2024', amount: 4000, method: 'Card', transactionId: 'TXN-9F2A17', collectedBy: 'Teresa Smith', remarks: 'Online gateway' },
    { receiptNo: 'RCPT-5518', date: '25 Apr 2024', amount: 2000, method: 'Bank Transfer', transactionId: 'TXN-77B0C4', collectedBy: 'Teresa Smith', remarks: 'Advance instalment' },
  ],

  timeline: [
    { title: 'Invoice Generated', meta: '24 Apr 2024, 09:10 AM · by Kevin Larry', icon: 'ti ti-file-text', done: true },
    { title: 'Reminder Sent', meta: '25 Apr 2024, 08:00 AM · Email + SMS', icon: 'ti ti-bell', done: true },
    { title: 'Payment Initiated', meta: '25 Apr 2024, 02:35 PM · Online gateway', icon: 'ti ti-credit-card', done: true },
    { title: 'Partial Payment Received', meta: '25 Apr 2024, 02:40 PM · $6,000.00 collected', icon: 'ti ti-cash', done: true },
    { title: 'Final Payment', meta: 'Pending · $4,250.00 outstanding', icon: 'ti ti-wallet', done: false },
    { title: 'Receipt Generated', meta: 'Awaiting full settlement', icon: 'ti ti-receipt', done: false },
  ],

  activity: [
    { title: 'Invoice created', meta: 'Kevin Larry · 24 Apr 2024, 09:10 AM' },
    { title: 'Invoice edited — scholarship applied', meta: 'Kevin Larry · 24 Apr 2024, 11:42 AM' },
    { title: 'Reminder sent to parent', meta: 'System · 25 Apr 2024, 08:00 AM' },
    { title: 'Payment received — $6,000.00', meta: 'Teresa Smith · 25 Apr 2024, 02:40 PM' },
    { title: 'Receipt RCPT-5521 generated', meta: 'System · 25 Apr 2024, 02:41 PM' },
    { title: 'Viewed by parent portal', meta: 'Michael Daniel · 26 Apr 2024, 10:15 AM' },
  ],

  attachments: [
    { name: 'Invoice-INV-2024-0192.pdf', meta: '248 KB · PDF', icon: 'ti ti-file-type-pdf' },
    { name: 'Payment-Receipt-5521.jpg', meta: '96 KB · Image', icon: 'ti ti-photo' },
    { name: 'Scholarship-Approval.docx', meta: '64 KB · Document', icon: 'ti ti-file-text' },
  ],
};

/* -------------------------------- Derivations ------------------------------- */

/** Two-decimal money, as this page prints it — "$10,250.00", not "$10,250". */
export const money = (value: number): string =>
  `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export const lineTotal = (line: FeeLine): number => line.amount - line.discount + line.tax;

export const subtotalOf = (invoice: InvoiceDetail): number =>
  invoice.lines.reduce((sum, line) => sum + line.amount, 0);

export const totalDiscountOf = (invoice: InvoiceDetail): number =>
  invoice.lines.reduce((sum, line) => sum + line.discount, 0);

export const totalTaxOf = (invoice: InvoiceDetail): number =>
  invoice.lines.reduce((sum, line) => sum + line.tax, 0);

/** The Section Totals row: line items only, before the adjustments below. */
export const sectionTotalOf = (invoice: InvoiceDetail): number =>
  subtotalOf(invoice) - totalDiscountOf(invoice) + totalTaxOf(invoice);

export const grandTotalOf = (invoice: InvoiceDetail): number =>
  sectionTotalOf(invoice) - invoice.scholarship + invoice.previousBalance + invoice.lateFee;

export const amountPaidOf = (invoice: InvoiceDetail): number =>
  invoice.payments.reduce((sum, payment) => sum + payment.amount, 0);

export const pendingOf = (invoice: InvoiceDetail): number =>
  grandTotalOf(invoice) - amountPaidOf(invoice);

export const collectedPercentOf = (invoice: InvoiceDetail): number => {
  const total = grandTotalOf(invoice);
  return total === 0 ? 0 : Math.round((amountPaidOf(invoice) / total) * 100);
};

/* --------------------------------- Options ---------------------------------- */

export const methodOptions = ['Card', 'Bank Transfer', 'Cash', 'Cheque', 'UPI'];

/** The offline modes the Record Payment dialog offers. */
export const offlineModeOptions = ['Cash', 'Cheque', 'Bank Deposit', 'Demand Draft'];

/** The eight workflows the Quick Actions grid offers, in the template's order. */
export const quickActions: { id: string; icon: string; label: string }[] = [
  { id: 'generate_receipt', icon: 'ti ti-receipt', label: 'Generate Receipt' },
  { id: 'collect_payment', icon: 'ti ti-cash', label: 'Collect Payment' },
  { id: 'record_payment', icon: 'ti ti-writing', label: 'Record Payment' },
  { id: 'print_invoice', icon: 'ti ti-printer', label: 'Print Invoice' },
  { id: 'email_invoice', icon: 'ti ti-mail', label: 'Email Invoice' },
  { id: 'share_invoice', icon: 'ti ti-share', label: 'Share Invoice' },
  { id: 'send_reminder', icon: 'ti ti-bell', label: 'Send Reminder' },
  { id: 'duplicate', icon: 'ti ti-copy', label: 'Duplicate' },
];
