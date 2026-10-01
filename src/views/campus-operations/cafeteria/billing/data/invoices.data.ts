export type BillStatus = 'Paid' | 'Partially Paid' | 'Pending' | 'Overdue' | 'Waived';

export type CustomerType = 'Student' | 'Staff' | 'Visitor';

export interface BillLine {
  name: string;
  qty: number;
  price: number;
}

export interface PaymentEntry {
  /** "$52.29 · Wallet". */
  title: string;
  /** "31 Jul 2026 · PAY-2026-9931". */
  meta: string;
  amount: number;
}

export interface Invoice {
  id: string;
  customer: string;
  avatar: string;
  /** "II B · A-104" or "Chief Warden · EMP-2019-014". */
  customerLine: string;
  customerType: CustomerType;
  /** "31 Jul 2026" — when the invoice was raised. */
  billingDate: string;
  /** "01 – 31 Jul 2026" — the period it covers. */
  period: string;
  dueDate: string;
  lines: BillLine[];
  /** Discount in dollars; the type and basis explain it. */
  discount: number;
  discountType: string;
  discountBasis: string;
  /** Cafeteria service tax, 5% on every invoice in the template. */
  taxRate: number;
  taxCode: string;
  taxExemption: string;
  status: BillStatus;
  method: string;
  mealPlan: string;

  payments: PaymentEntry[];
  /** Printed instead of the payment list when nothing has been collected. */
  paymentsEmpty?: string;
  receiptNo: string;
  receiptStatus: string;
  paidOn: string;
  notes: string;
}

export const statusPill: Record<BillStatus, string> = {
  Paid: 'is-active',
  'Partially Paid': 'is-review',
  Pending: 'is-pending',
  Overdue: 'is-blocked',
  Waived: 'is-archived',
};

export const statusBadge: Record<BillStatus, string> = {
  Paid: 'badge badge-soft-success',
  'Partially Paid': 'badge badge-soft-info',
  Pending: 'badge badge-soft-warning',
  Overdue: 'badge badge-soft-danger',
  Waived: 'badge badge-soft-secondary',
};

export const customerTint: Record<CustomerType, string> = {
  Student: 'primary',
  Staff: 'success',
  Visitor: 'info',
};

/* ------------------------------ Filter options ------------------------------ */

export const customerTypeOptions: CustomerType[] = ['Student', 'Staff', 'Visitor'];

export const billingPeriodOptions = ['July 2026', 'June 2026', 'May 2026', 'Custom range'];

export const statusOptions: BillStatus[] = [
  'Paid', 'Partially Paid', 'Pending', 'Overdue', 'Waived',
];

export const paymentMethodOptions = ['Wallet', 'Card', 'UPI', 'Cash', 'Payroll deduction'];

export const discountOptions = [
  'Meal plan credit', 'Staff subsidy', 'Need-based concession', 'No discount',
];

export const netAmountOptions = [
  'Zero · fully waived', 'Under $25', '$25 – $60', 'Over $60',
];

/* --------------------------- Dialog option lists ----------------------------- */

export const customerChoices = [
  'Lisa Gourley · AD9892431 · Student',
  'Joann Michael · AD9892433 · Student',
  'Janet Daniel · AD9892434 · Student',
  'Mrs. Alice Ray · EMP-2019-014 · Staff',
  'Mr. David Kim · EMP-2020-027 · Staff',
];

export const sourceOptions = [
  'All cafeteria orders in the period', 'Selected orders only', 'Manual line items',
];

export const generateStatusOptions: BillStatus[] = ['Pending', 'Paid', 'Partially Paid', 'Waived'];

export const collectedByOptions = ['Accounts Office', 'Cafeteria Counter', 'Online Gateway'];

export const paperSizeOptions = ['A4 · PDF', 'A5 · PDF', 'Thermal · 80 mm'];

/* ------------------------------- Derivations -------------------------------- */

export const DASH = '—';

export const money = (value: number): string => `$${value.toFixed(2)}`;

/** The lines multiplied out — every other figure hangs off this one. */
export const totalOf = (row: Invoice): number =>
  Number(row.lines.reduce((total, line) => total + line.qty * line.price, 0).toFixed(2));

export const unitsOf = (row: Invoice): number =>
  row.lines.reduce((total, line) => total + line.qty, 0);

/** "4 · 61 units" — the panel's line-item summary. */
export const lineSummaryOf = (row: Invoice): string =>
  `${row.lines.length} · ${unitsOf(row)} units`;

export const taxableOf = (row: Invoice): number =>
  Number(Math.max(0, totalOf(row) - row.discount).toFixed(2));

export const taxOf = (row: Invoice): number =>
  Number((taxableOf(row) * (row.taxRate / 100)).toFixed(2));

export const netOf = (row: Invoice): number =>
  Number((taxableOf(row) + taxOf(row)).toFixed(2));

export const paidOf = (row: Invoice): number =>
  Number(row.payments.reduce((total, entry) => total + entry.amount, 0).toFixed(2));

export const balanceOf = (row: Invoice): number =>
  Number(Math.max(0, netOf(row) - paidOf(row)).toFixed(2));

/** The discount as a share of the total, the way the panel prints it. */
export const discountRateOf = (row: Invoice): string => {
  const total = totalOf(row);
  return `${total === 0 ? '0.0' : ((row.discount / total) * 100).toFixed(1)}%`;
};

export const discountLabel = (row: Invoice): string =>
  row.discount > 0 ? `−${money(row.discount)}` : DASH;

/** The payment method decides its own icon. */
export const methodIcon = (method: string): string => {
  if (/payroll/i.test(method)) return 'ti ti-briefcase';
  if (/card/i.test(method)) return 'ti ti-credit-card';
  if (/upi/i.test(method)) return 'ti ti-device-mobile';
  if (/cash/i.test(method)) return 'ti ti-cash';
  if (/not applicable|waiv/i.test(method)) return 'ti ti-discount';
  return 'ti ti-wallet';
};

export const summaryPairsOf = (row: Invoice): { label: string; value: string }[] => [
  { label: 'Invoice No', value: row.id },
  { label: 'Billing Period', value: row.period },
  { label: 'Meal Plan', value: row.mealPlan },
  { label: 'Line Items', value: lineSummaryOf(row) },
  { label: 'Due Date', value: row.dueDate },
];

export const breakdownPairsOf = (row: Invoice): { label: string; value: string }[] => [
  { label: 'Total Amount', value: money(totalOf(row)) },
  { label: 'Discount', value: `−${money(row.discount)}` },
  { label: 'Taxable Amount', value: money(taxableOf(row)) },
  { label: 'Tax Charged', value: money(taxOf(row)) },
  { label: 'Net Amount', value: money(netOf(row)) },
];

export const discountPairsOf = (row: Invoice): { label: string; value: string }[] => [
  { label: 'Type', value: row.discountType },
  { label: 'Basis', value: row.discountBasis },
  { label: 'Discount Value', value: money(row.discount) },
  { label: 'Effective Rate', value: discountRateOf(row) },
];

export const taxPairsOf = (row: Invoice): { label: string; value: string }[] => [
  { label: 'Tax Rate', value: `${row.taxRate}% · cafeteria service tax` },
  { label: 'Taxable Amount', value: money(taxableOf(row)) },
  { label: 'Tax Charged', value: money(taxOf(row)) },
  { label: 'Tax Code', value: row.taxCode },
  { label: 'Exemption', value: row.taxExemption },
];

export const receiptPairsOf = (row: Invoice): { label: string; value: string }[] => [
  { label: 'Receipt No', value: row.receiptNo },
  { label: 'Status', value: row.receiptStatus },
  { label: 'Paid On', value: row.paidOn },
  { label: 'Amount Settled', value: money(paidOf(row)) },
];

export const lineLabelOf = (line: BillLine): string => `${line.qty} × ${money(line.price)}`;

/** "CB-2026-0418 · July 2026" — the line the dialogs print. */
export const compactOf = (row: Invoice): string => `${row.id} · ${row.period}`;

export interface AuditEntry {
  title: string;
  meta: string;
}

/** The panel's audit trail, built from the invoice's own history. */
export const auditOf = (row: Invoice): AuditEntry[] => {
  const entries: AuditEntry[] = [
    { title: 'Invoice raised', meta: `${row.billingDate} · ${lineSummaryOf(row)}` },
    { title: `${row.discountType} applied`, meta: `${money(row.discount)} · ${discountRateOf(row)}` },
  ];
  row.payments.forEach((payment) => entries.push({ title: payment.title, meta: payment.meta }));
  if (row.payments.length === 0) {
    entries.push({ title: 'Awaiting settlement', meta: `${money(balanceOf(row))} outstanding` });
  }
  return entries;
};

/* --------------------------------- Filters ---------------------------------- */

export const methodBandOf = (row: Invoice): string => {
  if (/payroll/i.test(row.method)) return 'Payroll deduction';
  if (/card/i.test(row.method)) return 'Card';
  if (/upi/i.test(row.method)) return 'UPI';
  if (/cash/i.test(row.method)) return 'Cash';
  return 'Wallet';
};

export const discountBandOf = (row: Invoice): string => {
  if (row.discount === 0) return 'No discount';
  if (/staff/i.test(row.discountType)) return 'Staff subsidy';
  if (/concession|need/i.test(row.discountType)) return 'Need-based concession';
  return 'Meal plan credit';
};

export const netBandOf = (row: Invoice): string => {
  const net = netOf(row);
  if (net === 0) return 'Zero · fully waived';
  if (net < 25) return 'Under $25';
  if (net <= 60) return '$25 – $60';
  return 'Over $60';
};

/** July's run is everything billed in July; the rest name their own month. */
export const periodBandOf = (row: Invoice): string => {
  const match = /([A-Za-z]{3})\s+(\d{4})$/.exec(row.period);
  if (!match) return 'Custom range';
  const months: Record<string, string> = { Jul: 'July', Jun: 'June', May: 'May' };
  return months[match[1]] ? `${months[match[1]]} ${match[2]}` : 'Custom range';
};

export const searchIndexOf = (row: Invoice): string =>
  [
    row.id, row.customer, row.customerLine, row.customerType, row.period, row.status,
    row.method, row.mealPlan, row.receiptNo, row.lines.map((line) => line.name).join(' '),
  ]
    .join(' ')
    .toLowerCase();

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** Sortable key for the template's "31 Jul 2026" dates. */
export const dateKey = (value: string): number => {
  const [day, month, year] = value.split(' ');
  const index = months.indexOf(month);
  if (index === -1) return 0;
  return Number(year) * 10000 + (index + 1) * 100 + Number(day);
};

/** Days past the due date, which the sort menu orders by. */
export const daysOverdueOf = (row: Invoice): number => {
  if (row.status !== 'Overdue') return 0;
  const today = dateKey('31 Jul 2026');
  const due = dateKey(row.dueDate);
  return due === 0 ? 0 : Math.max(0, today - due);
};

/* --------------------------------- Summary ---------------------------------- */

/**
 * The strip counts the whole July run — 214 invoices against the eight this
 * page lists — so the template's figures stand and the roster moves them.
 */
export const SUMMARY_TOTALS = {
  bills: 214,
  run: 'July 2026 billing run',
  paid: 168,
  paidShare: 78,
  pending: 32,
  dueBy: '07 Aug',
  overdue: 11,
  outstanding: 284.6,
  collectedToday: 176.82,
  settledToday: 3,
};

/** The billing period the template shows as its one filter chip. */
export const BILLING_PERIOD = 'July 2026';

/* ---------------------------------- Rows ------------------------------------ */

export const invoices: Invoice[] = [
  {
    id: 'CB-2026-0418', customer: 'Lisa Gourley', avatar: 'assets/img/students/student-04.jpg',
    customerLine: 'II B · A-104', customerType: 'Student',
    billingDate: '31 Jul 2026', period: '01 – 31 Jul 2026', dueDate: '31 Jul 2026',
    lines: [
      { name: 'Vegetable Pulao', qty: 20, price: 1.8 },
      { name: 'Masala Dosa', qty: 15, price: 1.2 },
      { name: 'Grilled Paneer Wrap', qty: 8, price: 1.5 },
      { name: 'Fresh Fruit Smoothie', qty: 18, price: 1.1 },
    ],
    discount: 36, discountType: 'Meal plan lunch credit',
    discountBasis: '20 lunches × $1.80 covered by the plan',
    taxRate: 5, taxCode: 'CAF-GST-05', taxExemption: 'None',
    status: 'Paid', method: 'Wallet', mealPlan: 'Standard Student Weekly',
    payments: [
      { title: '$52.29 · Wallet', meta: '31 Jul 2026 · PAY-2026-9931', amount: 52.29 },
    ],
    receiptNo: 'RCP-2026-0418',
    receiptStatus: 'Issued 31 Jul 2026 · emailed to the guardian',
    paidOn: '31 Jul 2026',
    notes: 'Meal plan covered every lunch in July. Only the extras were billed.',
  },
  {
    id: 'CB-2026-0419', customer: 'Joann Michael', avatar: 'assets/img/students/student-02.jpg',
    customerLine: 'IV B · B-118', customerType: 'Student',
    billingDate: '31 Jul 2026', period: '01 – 31 Jul 2026', dueDate: '05 Aug 2026',
    lines: [
      { name: 'Vegetable Pulao', qty: 22, price: 1.8 },
      { name: 'Grilled Paneer Wrap', qty: 20, price: 1.5 },
      { name: 'Masala Dosa', qty: 20, price: 1.2 },
      { name: 'Fresh Fruit Smoothie', qty: 12, price: 1.1 },
    ],
    discount: 39.6, discountType: 'Meal plan lunch credit',
    discountBasis: '22 lunches × $1.80 covered by the plan',
    taxRate: 5, taxCode: 'CAF-GST-05', taxExemption: 'None',
    status: 'Partially Paid', method: 'Wallet', mealPlan: 'Standard Student Weekly',
    payments: [
      { title: '$40.00 · Wallet', meta: '28 Jul 2026 · PAY-2026-9918', amount: 40 },
    ],
    receiptNo: 'RCP-2026-0419',
    receiptStatus: 'Part receipt issued · final receipt on settlement',
    paidOn: '28 Jul 2026',
    notes: 'Ordered extra portions for visiting family. Balance to clear by 05 Aug.',
  },
  {
    id: 'CB-2026-0420', customer: 'Mrs. Alice Ray', avatar: 'assets/img/teachers/teacher-01.jpg',
    customerLine: 'Chief Warden · EMP-2019-014', customerType: 'Staff',
    billingDate: '31 Jul 2026', period: '01 – 31 Jul 2026', dueDate: '07 Aug 2026',
    lines: [
      { name: 'Vegetable Pulao', qty: 18, price: 2.1 },
      { name: 'Grilled Paneer Wrap', qty: 14, price: 1.8 },
    ],
    discount: 6, discountType: 'Staff subsidy',
    discountBasis: 'Flat $6.00 monthly staff subsidy',
    taxRate: 5, taxCode: 'CAF-GST-05', taxExemption: 'None',
    status: 'Pending', method: 'Payroll Deduction', mealPlan: 'Staff Lunch Plan',
    payments: [], paymentsEmpty: 'No payment recorded — settles with the August payroll run.',
    receiptNo: 'Not issued',
    receiptStatus: 'Raised once the payroll deduction posts',
    paidOn: '—',
    notes: 'Staff bills settle against payroll; nothing is collected at the counter.',
  },
  {
    id: 'CB-2026-0409', customer: 'Richard Soley', avatar: 'assets/img/students/student-08.jpg',
    customerLine: 'V B · C-012', customerType: 'Student',
    billingDate: '31 Jul 2026', period: '01 – 30 Jun 2026', dueDate: '15 Jul 2026',
    lines: [
      { name: 'Masala Dosa', qty: 12, price: 1.2 },
      { name: 'Fresh Fruit Smoothie', qty: 4, price: 1.1 },
    ],
    discount: 0, discountType: 'No discount applied',
    discountBasis: 'Not enrolled on a meal plan',
    taxRate: 5, taxCode: 'CAF-GST-05', taxExemption: 'None',
    status: 'Overdue', method: 'Wallet · blocked', mealPlan: 'Not enrolled',
    payments: [], paymentsEmpty: 'No payment recorded — wallet blocked on 26 Jul 2026.',
    receiptNo: 'Not issued',
    receiptStatus: 'Raised on settlement',
    paidOn: '—',
    notes: 'Cafeteria wallet blocked while $1,800 stays open on INV-2026-0474. 16 days overdue.',
  },
  {
    id: 'CB-2026-0421', customer: 'Janet Daniel', avatar: 'assets/img/students/student-01.jpg',
    customerLine: 'III A · C-115', customerType: 'Student',
    billingDate: '31 Jul 2026', period: '01 – 31 Jul 2026', dueDate: '31 Jul 2026',
    lines: [
      { name: 'Masala Dosa', qty: 20, price: 1.2 },
      { name: 'Fresh Fruit Smoothie', qty: 20, price: 1.1 },
      { name: 'Vegetable Pulao', qty: 10, price: 1.8 },
    ],
    discount: 0, discountType: 'No discount applied',
    discountBasis: 'Pay per meal — no plan enrolment',
    taxRate: 5, taxCode: 'CAF-GST-05', taxExemption: 'None',
    status: 'Paid', method: 'Card', mealPlan: 'Not enrolled',
    payments: [
      { title: '$67.20 · Card ending 4471', meta: '31 Jul 2026 · PAY-2026-9933', amount: 67.2 },
    ],
    receiptNo: 'RCP-2026-0421',
    receiptStatus: 'Issued 31 Jul 2026 · emailed to the guardian',
    paidOn: '31 Jul 2026',
    notes: 'Highest à la carte spend this month. Guardian asked about switching to a meal plan.',
  },
  {
    id: 'CB-2026-0422', customer: 'Mr. David Kim', avatar: 'assets/img/teachers/teacher-04.jpg',
    customerLine: 'Warden · EMP-2020-027', customerType: 'Staff',
    billingDate: '31 Jul 2026', period: '01 – 31 Jul 2026', dueDate: '31 Jul 2026',
    lines: [
      { name: 'Grilled Paneer Wrap', qty: 22, price: 1.8 },
      { name: 'Vegetable Pulao', qty: 10, price: 2.1 },
    ],
    discount: 6, discountType: 'Staff subsidy',
    discountBasis: 'Flat $6.00 monthly staff subsidy',
    taxRate: 5, taxCode: 'CAF-GST-05', taxExemption: 'None',
    status: 'Paid', method: 'Card', mealPlan: 'Staff Lunch Plan',
    payments: [
      { title: '$57.33 · Card ending 8823', meta: '31 Jul 2026 · PAY-2026-9934', amount: 57.33 },
    ],
    receiptNo: 'RCP-2026-0422',
    receiptStatus: 'Issued 31 Jul 2026 · emailed to the warden',
    paidOn: '31 Jul 2026',
    notes: 'Settled at the counter rather than waiting for the payroll cycle.',
  },
  {
    id: 'CB-2026-0423', customer: 'Julie Scott', avatar: 'assets/img/students/student-06.jpg',
    customerLine: 'VI A · B-208', customerType: 'Student',
    billingDate: '31 Jul 2026', period: '01 – 31 Jul 2026', dueDate: '05 Aug 2026',
    lines: [
      { name: 'Vegetable Pulao', qty: 18, price: 1.8 },
      { name: 'Whole Wheat Sandwich', qty: 10, price: 0.9 },
      { name: 'Fresh Fruit Smoothie', qty: 14, price: 1.1 },
    ],
    discount: 32.4, discountType: 'Meal plan lunch credit',
    discountBasis: '18 lunches × $1.80 covered by the plan',
    taxRate: 5, taxCode: 'CAF-GST-05', taxExemption: 'None',
    status: 'Pending', method: 'UPI', mealPlan: 'Standard Student Weekly',
    payments: [], paymentsEmpty: 'No payment recorded — invoice emailed 31 Jul 2026.',
    receiptNo: 'Not issued',
    receiptStatus: 'Raised on settlement',
    paidOn: '—',
    notes: 'Invoice emailed to the guardian on 31 Jul. Balance due 05 Aug.',
  },
  {
    id: 'CB-2026-0424', customer: 'Kathleen Dison', avatar: 'assets/img/students/student-03.jpg',
    customerLine: 'III A · not assigned', customerType: 'Student',
    billingDate: '31 Jul 2026', period: '01 – 31 Jul 2026', dueDate: '—',
    lines: [
      { name: 'Vegetable Pulao', qty: 6, price: 1.8 },
      { name: 'Fresh Fruit Smoothie', qty: 4, price: 1.1 },
    ],
    discount: 15.2, discountType: 'Need-based concession',
    discountBasis: '100% waiver approved by accounts',
    taxRate: 5, taxCode: 'CAF-GST-05', taxExemption: 'Fully waived invoice',
    status: 'Waived', method: 'Not applicable', mealPlan: 'Not enrolled · waiting list',
    payments: [], paymentsEmpty: 'Nothing payable — the full amount was waived.',
    receiptNo: 'RCP-2026-0424',
    receiptStatus: 'Zero-value receipt issued for the record',
    paidOn: '—',
    notes: 'Need-based concession under review for hostel fees applies to cafeteria billing too.',
  },
];
