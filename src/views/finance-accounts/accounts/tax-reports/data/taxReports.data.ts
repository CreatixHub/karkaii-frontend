export type TaxType = 'GST' | 'VAT' | 'TDS' | 'Professional Tax';
export type TaxStatus =
  | 'Ready'
  | 'Pending Filing'
  | 'Filed'
  | 'Under Review'
  | 'Overdue'
  | 'Draft'
  | 'Archived';

export interface DetailItem {
  label: string;
  value: string;
}

/** A row in the "Included Transactions" panel. */
export interface TaxTransaction {
  label: string;
  /** "68 invoices · $17,480" — count and value in the template's own wording. */
  meta: string;
}

/** A row in the "Export History" panel. */
export interface TaxExport {
  name: string;
  /** "PDF · 312 KB · 31 Jul 2026". */
  meta: string;
}

export interface TaxReport {
  id: string;
  name: string;
  /** The `dt-sub` under the name; equals the filing period. */
  filingPeriod: string;
  taxType: TaxType;
  taxTypeTint: string;
  financialYear: string;
  /** Kept as the template's literal — see the file header on why it is not derived. */
  taxAmount: number;
  generatedBy: string;
  generatedByDept: string;
  generatedDate: string;
  generatedTime: string;
  status: TaxStatus;
  returnForm: string;
  summary: DetailItem[];
  breakdown: DetailItem[];
  filing: DetailItem[];
  transactions: TaxTransaction[];
  exports: TaxExport[];
  notes: string;
}

export const statusPill: Record<TaxStatus, string> = {
  Ready: 'is-active',
  'Pending Filing': 'is-pending',
  Filed: 'is-active',
  'Under Review': 'is-review',
  Overdue: 'is-blocked',
  Draft: 'is-inactive',
  Archived: 'is-archived',
};

export const statusBadge: Record<TaxStatus, string> = {
  Ready: 'badge badge-soft-success',
  'Pending Filing': 'badge badge-soft-warning',
  Filed: 'badge badge-soft-success',
  'Under Review': 'badge badge-soft-info',
  Overdue: 'badge badge-soft-danger',
  Draft: 'badge badge-soft-secondary',
  Archived: 'badge badge-soft-dark',
};

export const taxTypeTint: Record<TaxType, string> = {
  GST: 'primary',
  VAT: 'info',
  TDS: 'warning',
  'Professional Tax': 'secondary',
};

export const taxReports: TaxReport[] = [
  {
    id: 'tx_01',
    name: 'GST Summary — July 2026',
    filingPeriod: 'Monthly · Jul 2026',
    taxType: 'GST',
    taxTypeTint: 'primary',
    financialYear: '2026 – 2027',
    taxAmount: 4820,
    generatedBy: 'Finance Manager',
    generatedByDept: 'Accounts',
    generatedDate: '31 Jul 2026',
    generatedTime: '07:40 PM',
    status: 'Pending Filing',
    returnForm: 'GSTR-3B',
    summary: [
      { label: 'Output Tax', value: '$3,146' },
      { label: 'Input Tax Credit', value: '$1,674' },
      { label: 'Net Payable', value: '$1,472' },
      { label: 'Taxable Value', value: '$26,218' },
    ],
    breakdown: [
      { label: 'CGST @ 9%', value: '$1,573' },
      { label: 'SGST @ 9%', value: '$1,573' },
      { label: 'IGST @ 18%', value: '—' },
      { label: 'Cess', value: '—' },
    ],
    filing: [
      { label: 'Return Form', value: 'GSTR-3B' },
      { label: 'Filing Due', value: '20 Aug 2026' },
      { label: 'GSTIN', value: '29ABCDE1234F1Z5' },
      { label: 'Filing Status', value: 'Not filed' },
    ],
    transactions: [
      { label: 'Transport service fees', meta: '68 invoices · $17,480' },
      { label: 'Hostel & mess charges', meta: '24 invoices · $6,300' },
      { label: 'Miscellaneous services', meta: '31 invoices · $2,438' },
    ],
    exports: [
      { name: 'gst-summary-jul-2026.pdf', meta: 'PDF · 312 KB · 31 Jul 2026' },
      { name: 'gst-summary-jul-2026.xlsx', meta: 'Excel · 148 KB · 31 Jul 2026' },
    ],
    notes: 'Tuition fee income is exempt and excluded. Only transport, hostel and ancillary services are taxable.',
  },
  {
    id: 'tx_02',
    name: 'GST Sales Report — July 2026',
    filingPeriod: 'Monthly · Jul 2026',
    taxType: 'GST',
    taxTypeTint: 'primary',
    financialYear: '2026 – 2027',
    taxAmount: 3146,
    generatedBy: 'Sarah Rose',
    generatedByDept: 'Accounts',
    generatedDate: '31 Jul 2026',
    generatedTime: '05:12 PM',
    status: 'Ready',
    returnForm: 'GSTR-1',
    summary: [
      { label: 'Taxable Sales', value: '$17,478' },
      { label: 'Exempt Sales', value: '$178,942' },
      { label: 'Output Tax', value: '$3,146' },
      { label: 'Invoices Covered', value: '123' },
    ],
    breakdown: [
      { label: 'CGST @ 9%', value: '$1,573' },
      { label: 'SGST @ 9%', value: '$1,573' },
      { label: 'Exempt Supplies', value: '$178,942' },
      { label: 'Nil Rated', value: '—' },
    ],
    filing: [
      { label: 'Return Form', value: 'GSTR-1' },
      { label: 'Filing Due', value: '11 Aug 2026' },
      { label: 'GSTIN', value: '29ABCDE1234F1Z5' },
      { label: 'Filing Status', value: 'Not filed' },
    ],
    transactions: [
      { label: 'Transport fee invoices', meta: '68 invoices · $17,480' },
      { label: 'Hostel service invoices', meta: '24 invoices · $6,300' },
      { label: 'Exempt tuition invoices', meta: '31 invoices · $178,942' },
    ],
    exports: [{ name: 'gst-sales-jul-2026.xlsx', meta: 'Excel · 226 KB · 31 Jul 2026' }],
    notes: 'Outward supply register reconciled against the fee collection report for the same period.',
  },
  {
    id: 'tx_03',
    name: 'GST Purchase Report — July 2026',
    filingPeriod: 'Monthly · Jul 2026',
    taxType: 'GST',
    taxTypeTint: 'primary',
    financialYear: '2026 – 2027',
    taxAmount: 1674,
    generatedBy: 'Sarah Rose',
    generatedByDept: 'Accounts',
    generatedDate: '31 Jul 2026',
    generatedTime: '05:28 PM',
    status: 'Ready',
    returnForm: 'GSTR-2B',
    summary: [
      { label: 'Taxable Purchases', value: '$9,300' },
      { label: 'Input Tax Credit', value: '$1,674' },
      { label: 'Ineligible ITC', value: '$142' },
      { label: 'Vendor Bills', value: '46' },
    ],
    breakdown: [
      { label: 'CGST @ 9%', value: '$837' },
      { label: 'SGST @ 9%', value: '$837' },
      { label: 'Ineligible Credit', value: '$142' },
      { label: 'Reverse Charge', value: '—' },
    ],
    filing: [
      { label: 'Return Form', value: 'GSTR-2B' },
      { label: 'Filing Due', value: '20 Aug 2026' },
      { label: 'GSTIN', value: '29ABCDE1234F1Z5' },
      { label: 'Filing Status', value: 'Auto-drafted' },
    ],
    transactions: [
      { label: 'Maintenance & repairs', meta: '18 bills · $4,200' },
      { label: 'Stationery & supplies', meta: '21 bills · $3,180' },
      { label: 'Bank & gateway charges', meta: '7 entries · $1,920' },
    ],
    exports: [{ name: 'gst-purchase-jul-2026.xlsx', meta: 'Excel · 194 KB · 31 Jul 2026' }],
    notes: 'Gateway charge credits held pending until the 4 unmapped statement lines are posted to LGR-5008.',
  },
  {
    id: 'tx_04',
    name: 'TDS Deducted — Payroll',
    filingPeriod: 'Monthly · Jul 2026',
    taxType: 'TDS',
    taxTypeTint: 'warning',
    financialYear: '2026 – 2027',
    taxAmount: 6420,
    generatedBy: 'Scheduler',
    generatedByDept: 'Automated',
    generatedDate: '29 Jul 2026',
    generatedTime: '06:00 AM',
    status: 'Filed',
    returnForm: 'Form 24Q',
    summary: [
      { label: 'Gross Salaries', value: '$48,620' },
      { label: 'TDS Deducted', value: '$6,420' },
      { label: 'Employees Covered', value: '84' },
      { label: 'Deposited', value: '$6,420' },
    ],
    breakdown: [
      { label: 'Section 192 · Salary', value: '$6,420' },
      { label: 'Section 194J · Professional', value: '—' },
      { label: 'Section 194C · Contract', value: '—' },
      { label: 'Surcharge / Cess', value: 'Included' },
    ],
    filing: [
      { label: 'Return Form', value: 'Form 24Q' },
      { label: 'Filing Due', value: '31 Oct 2026' },
      { label: 'TAN', value: 'BLRG12345E' },
      { label: 'Filing Status', value: 'Challan paid' },
    ],
    transactions: [
      { label: 'July payroll run PR-2026-07', meta: '84 employees · $48,620' },
      { label: 'Payroll bank debit TXN-2026-1175', meta: '1 entry · $48,620' },
    ],
    exports: [
      { name: 'tds-payroll-jul-2026.pdf', meta: 'PDF · 268 KB · 29 Jul 2026' },
      { name: 'tds-challan-jul-2026.pdf', meta: 'PDF · 96 KB · 30 Jul 2026' },
    ],
    notes: 'Challan CIN 0510302607260012 deposited on 30 Jul 2026. Quarterly return due after the September cycle.',
  },
  {
    id: 'tx_05',
    name: 'TDS on Vendor Payments',
    filingPeriod: 'Monthly · Jul 2026',
    taxType: 'TDS',
    taxTypeTint: 'warning',
    financialYear: '2026 – 2027',
    taxAmount: 412,
    generatedBy: 'Sarah Rose',
    generatedByDept: 'Accounts',
    generatedDate: '30 Jul 2026',
    generatedTime: '11:20 AM',
    status: 'Under Review',
    returnForm: 'Form 26Q',
    summary: [
      { label: 'Payments Made', value: '$18,640' },
      { label: 'TDS Deducted', value: '$412' },
      { label: 'Vendors Covered', value: '14' },
      { label: 'Deposited', value: '—' },
    ],
    breakdown: [
      { label: 'Section 194C · Contract', value: '$286' },
      { label: 'Section 194J · Professional', value: '$126' },
      { label: 'Section 194I · Rent', value: '—' },
      { label: 'Surcharge / Cess', value: 'Included' },
    ],
    filing: [
      { label: 'Return Form', value: 'Form 26Q' },
      { label: 'Filing Due', value: '31 Oct 2026' },
      { label: 'TAN', value: 'BLRG12345E' },
      { label: 'Filing Status', value: 'Pending review' },
    ],
    transactions: [
      { label: 'Maintenance contractors', meta: '8 bills · $14,300' },
      { label: 'Professional & audit fees', meta: '6 bills · $4,340' },
    ],
    exports: [{ name: 'tds-vendor-jul-2026.xlsx', meta: 'Excel · 112 KB · 30 Jul 2026' }],
    notes: 'Two vendor PAN records are unverified. Held for review before the challan is raised.',
  },
  {
    id: 'tx_06',
    name: 'Input Tax Credit Ledger',
    filingPeriod: 'Quarterly · Q1 2026 – 27',
    taxType: 'GST',
    taxTypeTint: 'primary',
    financialYear: '2026 – 2027',
    taxAmount: 4918,
    generatedBy: 'Finance Manager',
    generatedByDept: 'Accounts',
    generatedDate: '30 Jun 2026',
    generatedTime: '08:15 PM',
    status: 'Archived',
    returnForm: 'GSTR-3B',
    summary: [
      { label: 'Opening Credit', value: '$1,240' },
      { label: 'Credit Availed', value: '$4,918' },
      { label: 'Credit Utilised', value: '$4,206' },
      { label: 'Closing Credit', value: '$1,952' },
    ],
    breakdown: [
      { label: 'CGST Credit', value: '$2,459' },
      { label: 'SGST Credit', value: '$2,459' },
      { label: 'IGST Credit', value: '—' },
      { label: 'Reversed Credit', value: '$212' },
    ],
    filing: [
      { label: 'Return Form', value: 'GSTR-3B' },
      { label: 'Filed On', value: '18 Jul 2026' },
      { label: 'GSTIN', value: '29ABCDE1234F1Z5' },
      { label: 'Filing Status', value: 'Filed' },
    ],
    transactions: [
      { label: 'Vendor bills · Apr – Jun 2026', meta: '138 bills · $27,320' },
      { label: 'Credit reversals', meta: '4 entries · $212' },
    ],
    exports: [{ name: 'itc-ledger-q1-2026.pdf', meta: 'PDF · 340 KB · 30 Jun 2026' }],
    notes: 'Q1 credit ledger closed and filed. Reversals relate to ineligible personal-use expenses.',
  },
  {
    id: 'tx_07',
    name: 'Tax Adjustment — Refund Reversals',
    filingPeriod: 'Monthly · Jul 2026',
    taxType: 'GST',
    taxTypeTint: 'primary',
    financialYear: '2026 – 2027',
    taxAmount: 248,
    generatedBy: 'Sarah Rose',
    generatedByDept: 'Accounts',
    generatedDate: '30 Jul 2026',
    generatedTime: '03:05 PM',
    status: 'Draft',
    returnForm: 'GSTR-1 · Table 9B',
    summary: [
      { label: 'Refunds Issued', value: '$3,180' },
      { label: 'Tax Reversed', value: '$248' },
      { label: 'Credit Notes', value: '12' },
      { label: 'Net Adjustment', value: '−$248' },
    ],
    breakdown: [
      { label: 'CGST Reversed', value: '$124' },
      { label: 'SGST Reversed', value: '$124' },
      { label: 'IGST Reversed', value: '—' },
      { label: 'Adjustment Type', value: 'Credit note' },
    ],
    filing: [
      { label: 'Return Form', value: 'GSTR-1 · Table 9B' },
      { label: 'Filing Due', value: '11 Aug 2026' },
      { label: 'GSTIN', value: '29ABCDE1234F1Z5' },
      { label: 'Filing Status', value: 'Draft' },
    ],
    transactions: [
      { label: 'Duplicate hostel payment REF-2026-0042', meta: '1 credit note · $1,050' },
      { label: 'Transport pro-rata REF-2026-0046', meta: '1 credit note · $160' },
      { label: 'Other refunds', meta: '10 credit notes · $1,970' },
    ],
    exports: [{ name: 'tax-adjustment-jul-2026.csv', meta: 'CSV · 42 KB · 30 Jul 2026' }],
    notes: 'Draft pending confirmation that all July refunds have been processed to source.',
  },
  {
    id: 'tx_08',
    name: 'GST Summary — June 2026',
    filingPeriod: 'Monthly · Jun 2026',
    taxType: 'GST',
    taxTypeTint: 'primary',
    financialYear: '2026 – 2027',
    taxAmount: 4412,
    generatedBy: 'Finance Manager',
    generatedByDept: 'Accounts',
    generatedDate: '30 Jun 2026',
    generatedTime: '09:10 PM',
    status: 'Overdue',
    returnForm: 'GSTR-3B',
    summary: [
      { label: 'Output Tax', value: '$2,918' },
      { label: 'Input Tax Credit', value: '$1,506' },
      { label: 'Net Payable', value: '$1,412' },
      { label: 'Taxable Value', value: '$24,318' },
    ],
    breakdown: [
      { label: 'CGST @ 9%', value: '$1,459' },
      { label: 'SGST @ 9%', value: '$1,459' },
      { label: 'IGST @ 18%', value: '—' },
      { label: 'Late Fee Accrued', value: '$84' },
    ],
    filing: [
      { label: 'Return Form', value: 'GSTR-3B' },
      { label: 'Filing Due', value: '20 Jul 2026' },
      { label: 'GSTIN', value: '29ABCDE1234F1Z5' },
      { label: 'Filing Status', value: 'Overdue · 10 days' },
    ],
    transactions: [
      { label: 'Transport service fees', meta: '64 invoices · $16,120' },
      { label: 'Hostel & mess charges', meta: '22 invoices · $5,940' },
      { label: 'Miscellaneous services', meta: '28 invoices · $2,258' },
    ],
    exports: [{ name: 'gst-summary-jun-2026.pdf', meta: 'PDF · 308 KB · 30 Jun 2026' }],
    notes: 'Filing missed the 20 Jul due date. Late fee accruing at $8.40 per day; escalate to the Finance Manager.',
  },
];

/* ------------------------------ Report catalogue ----------------------------- */

export interface TaxReportCard {
  id: string;
  label: string;
  icon: string;
  tint: string;
  period: string;
  /** "$4,820", or "2 pending" on the filing card. */
  value: string;
}

/** The eight "Generate" cards above the grid. */
export const taxReportCards: TaxReportCard[] = [
  { id: 'GST Summary', label: 'GST Summary', icon: 'ti ti-report-money', tint: 'primary', period: 'Jul 2026', value: '$4,820' },
  { id: 'GST Sales Report', label: 'GST Sales Report', icon: 'ti ti-receipt', tint: 'success', period: 'Jul 2026', value: '$3,146' },
  { id: 'GST Purchase Report', label: 'GST Purchase Report', icon: 'ti ti-file-invoice', tint: 'info', period: 'Jul 2026', value: '$1,674' },
  { id: 'Tax Collected', label: 'Tax Collected', icon: 'ti ti-percentage', tint: 'warning', period: 'Jul 2026', value: '$3,146' },
  { id: 'Tax Paid', label: 'Tax Paid', icon: 'ti ti-cash', tint: 'danger', period: 'Jul 2026', value: '$1,472' },
  { id: 'Input Tax Credit', label: 'Input Tax Credit', icon: 'ti ti-arrows-left-right', tint: 'purple', period: 'Jul 2026', value: '$1,674' },
  { id: 'Tax Adjustment', label: 'Tax Adjustment', icon: 'ti ti-scale', tint: 'pink', period: 'Q1 2026 – 27', value: '$248' },
  { id: 'Tax Filing', label: 'Tax Filing', icon: 'ti ti-shield-check', tint: 'secondary', period: 'Due 20 Aug', value: '2 pending' },
];

/* -------------------------------- Derivations ------------------------------- */

export const money = (value: number): string => `$${value.toLocaleString('en-US')}`;

/* --------------------------------- Options ---------------------------------- */

export const taxTypeOptions: TaxType[] = ['GST', 'VAT', 'TDS', 'Professional Tax'];
export const financialYearOptions = ['2026 – 2027', '2025 – 2026', '2024 – 2025'];
export const filingPeriodOptions = ['Monthly', 'Quarterly', 'Half-Yearly', 'Annual'];
export const statusOptions: TaxStatus[] = [
  'Ready', 'Pending Filing', 'Filed', 'Under Review', 'Overdue', 'Draft', 'Archived',
];
export const returnFormOptions = ['GSTR-1', 'GSTR-2B', 'GSTR-3B', 'Form 24Q', 'Form 26Q'];
export const generatedByOptions = ['Finance Manager', 'Sarah Rose', 'Accounts Head', 'Scheduler'];
