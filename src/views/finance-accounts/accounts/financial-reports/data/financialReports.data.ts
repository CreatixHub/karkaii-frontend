export type ReportStatus = 'Ready' | 'Generating' | 'Scheduled' | 'Failed' | 'Archived';
export type ReportFormat = 'PDF' | 'Excel' | 'CSV';

export interface DetailItem {
  label: string;
  value: string;
}

/** A ledger account referenced by a report's "Included Accounts" panel. */
export interface LedgerRef {
  name: string;
  code: string;
}

export interface ReportFile {
  name: string;
  /** "PDF · 486 KB", or the status text when the file does not exist yet. */
  meta: string;
  /** False for the generating and failed rows, which have nothing to download. */
  available: boolean;
}

export interface FinancialReport {
  id: string;
  name: string;
  /** The `dt-sub` under the name; equals the financial period. */
  period: string;
  category: string;
  categoryTint: string;
  generatedBy: string;
  generatedByDept: string;
  generatedOn: string;
  generatedAt: string;
  format: ReportFormat;
  status: ReportStatus;
  lastUpdated: string;
  summary: DetailItem[];
  filters: DetailItem[];
  accounts: LedgerRef[];
  files: ReportFile[];
  schedule: string;
  notes: string;
}

export const statusPill: Record<ReportStatus, string> = {
  Ready: 'is-active',
  Generating: 'is-pending',
  Scheduled: 'is-review',
  Failed: 'is-blocked',
  Archived: 'is-archived',
};

export const statusBadge: Record<ReportStatus, string> = {
  Ready: 'badge badge-soft-success',
  Generating: 'badge badge-soft-warning',
  Scheduled: 'badge badge-soft-info',
  Failed: 'badge badge-soft-danger',
  Archived: 'badge badge-soft-dark',
};

/** The template's per-format file icon, kept exactly as authored. */
export const formatIcon: Record<ReportFormat, string> = {
  PDF: 'ti ti-file-type-pdf text-danger',
  Excel: 'ti ti-file-type-xls text-success',
  CSV: 'ti ti-file-type-csv text-info',
};

export const financialReports: FinancialReport[] = [
  {
    id: 'rp_01',
    name: 'Profit & Loss Statement',
    period: '01 Apr – 31 Jul 2026',
    category: 'Profit & Loss',
    categoryTint: 'primary',
    generatedBy: 'Finance Manager',
    generatedByDept: 'Accounts',
    generatedOn: '30 Jul 2026',
    generatedAt: '06:20 PM',
    format: 'PDF',
    status: 'Ready',
    lastUpdated: '30 Jul 2026',
    summary: [
      { label: 'Total Income', value: '$212,180' },
      { label: 'Total Expenditure', value: '$365,322' },
      { label: 'Net Result', value: '$153,142 Deficit' },
      { label: 'Accounts Covered', value: '30' },
    ],
    filters: [
      { label: 'Financial Year', value: '2026 – 2027' },
      { label: 'Period', value: 'Q1 & Jul' },
      { label: 'Department', value: 'All' },
      { label: 'Cost Centre', value: 'All' },
    ],
    accounts: [
      { name: 'Fee Income', code: 'LGR-4001' },
      { name: 'Transport Income', code: 'LGR-4002' },
      { name: 'Salaries & Wages', code: 'LGR-5001' },
      { name: 'Scholarship Expense', code: 'LGR-5004' },
    ],
    files: [
      { name: 'profit-loss-jul-2026.pdf', meta: 'PDF · 486 KB', available: true },
      { name: 'profit-loss-jul-2026.xlsx', meta: 'Excel · 212 KB', available: true },
    ],
    schedule: 'Monthly on the 1st at 06:00 AM · next 01 Aug 2026',
    notes: 'Deficit is expected mid-year; Q2 fee cycle income is recognised from August.',
  },
  {
    id: 'rp_02',
    name: 'Trial Balance — July 2026',
    period: '01 Apr – 31 Jul 2026',
    category: 'Trial Balance',
    categoryTint: 'purple',
    generatedBy: 'Sarah Rose',
    generatedByDept: 'Accounts',
    generatedOn: '31 Jul 2026',
    generatedAt: '09:05 AM',
    format: 'Excel',
    status: 'Ready',
    lastUpdated: '31 Jul 2026',
    summary: [
      { label: 'Total Debit', value: '$318,640' },
      { label: 'Total Credit', value: '$318,640' },
      { label: 'Difference', value: '$0' },
      { label: 'Accounts Covered', value: '48' },
    ],
    filters: [
      { label: 'Financial Year', value: '2026 – 2027' },
      { label: 'As On', value: '31 Jul 2026' },
      { label: 'Department', value: 'All' },
      { label: 'Nil Balances', value: 'Excluded' },
    ],
    accounts: [
      { name: 'Operating Bank Account', code: 'LGR-1001' },
      { name: 'Payroll Bank Account', code: 'LGR-1002' },
      { name: 'Fees Received in Advance', code: 'LGR-2001' },
      { name: 'Fee Income', code: 'LGR-4001' },
    ],
    files: [{ name: 'trial-balance-jul-2026.xlsx', meta: 'Excel · 168 KB', available: true }],
    schedule: 'Monthly on the last day at 09:00 PM · next 31 Aug 2026',
    notes: 'Books balanced with nil difference. Four locked accounts included at their closing values.',
  },
  {
    id: 'rp_03',
    name: 'Fee Collection Report',
    period: '01 – 31 Jul 2026',
    category: 'Fee Collection',
    categoryTint: 'pink',
    generatedBy: 'Sarah Rose',
    generatedByDept: 'Accounts',
    generatedOn: '30 Jul 2026',
    generatedAt: '07:10 PM',
    format: 'PDF',
    status: 'Ready',
    lastUpdated: '30 Jul 2026',
    summary: [
      { label: 'Total Collected', value: '$196,420' },
      { label: 'Cash Collections', value: '$21,360' },
      { label: 'Online Collections', value: '$68,720' },
      { label: 'Receipts Issued', value: '1,482' },
    ],
    filters: [
      { label: 'Fee Category', value: 'All' },
      { label: 'Class', value: 'All' },
      { label: 'Payment Method', value: 'All' },
      { label: 'Grouped By', value: 'Fee Category' },
    ],
    accounts: [
      { name: 'Fee Income', code: 'LGR-4001' },
      { name: 'Transport Income', code: 'LGR-4002' },
      { name: 'Operating Bank Account', code: 'LGR-1001' },
    ],
    files: [
      { name: 'fee-collection-jul-2026.pdf', meta: 'PDF · 640 KB', available: true },
      { name: 'fee-collection-jul-2026.csv', meta: 'CSV · 94 KB', available: true },
    ],
    schedule: 'Weekly every Monday at 07:00 AM · next 03 Aug 2026',
    notes: 'Reconciled against the receipts register and the bank statement for the same period.',
  },
  {
    id: 'rp_04',
    name: 'Outstanding Dues — Ageing',
    period: 'As on 31 Jul 2026',
    category: 'Outstanding Dues',
    categoryTint: 'danger',
    generatedBy: 'Finance Manager',
    generatedByDept: 'Accounts',
    generatedOn: '29 Jul 2026',
    generatedAt: '11:42 AM',
    format: 'Excel',
    status: 'Ready',
    lastUpdated: '30 Jul 2026',
    summary: [
      { label: 'Total Outstanding', value: '$48,260' },
      { label: 'Overdue 30+ Days', value: '$21,940' },
      { label: 'Students with Dues', value: '184' },
      { label: 'Invoices Covered', value: '212' },
    ],
    filters: [
      { label: 'Ageing Buckets', value: '1–15, 16–30, 31–60, 60+' },
      { label: 'Class', value: 'All' },
      { label: 'Fee Category', value: 'All' },
      { label: 'Grouped By', value: 'Ageing Bucket' },
    ],
    accounts: [
      { name: 'Fees Receivable', code: 'LGR-1201' },
      { name: 'Fee Income', code: 'LGR-4001' },
      { name: 'Transport Income', code: 'LGR-4002' },
    ],
    files: [{ name: 'outstanding-ageing-jul-2026.xlsx', meta: 'Excel · 320 KB', available: true }],
    schedule: 'Weekly every Friday at 05:00 PM · next 31 Jul 2026',
    notes: 'Used by the collections desk for the weekly follow-up call list. Parent contacts included.',
  },
  {
    id: 'rp_05',
    name: 'Balance Sheet — Q1',
    period: '01 Apr – 30 Jun 2026',
    category: 'Balance Sheet',
    categoryTint: 'info',
    generatedBy: 'Finance Manager',
    generatedByDept: 'Accounts',
    generatedOn: '30 Jun 2026',
    generatedAt: '08:30 PM',
    format: 'PDF',
    status: 'Archived',
    lastUpdated: '01 Jul 2026',
    summary: [
      { label: 'Total Assets', value: '$286,420' },
      { label: 'Total Liabilities', value: '$62,880' },
      { label: 'Capital & Reserves', value: '$223,540' },
      { label: 'Accounts Covered', value: '26' },
    ],
    filters: [
      { label: 'As On', value: '30 Jun 2026' },
      { label: 'Financial Year', value: '2026 – 2027' },
      { label: 'Department', value: 'All' },
      { label: 'Comparatives', value: 'Prior year' },
    ],
    accounts: [
      { name: 'Operating Bank Account', code: 'LGR-1001' },
      { name: 'Payroll Bank Account', code: 'LGR-1002' },
      { name: 'Fees Received in Advance', code: 'LGR-2001' },
    ],
    files: [{ name: 'balance-sheet-q1-2026.pdf', meta: 'PDF · 512 KB', available: true }],
    schedule: 'Quarterly at period close · next 30 Sep 2026',
    notes: 'Locked after the Q1 close on 01 Jul 2026. Reopening requires Finance Manager authorisation.',
  },
  {
    id: 'rp_06',
    name: 'Cash Flow Statement',
    period: '01 Apr – 31 Jul 2026',
    category: 'Cash Flow',
    categoryTint: 'warning',
    generatedBy: 'Scheduler',
    generatedByDept: 'Automated',
    generatedOn: '30 Jul 2026',
    generatedAt: '06:00 AM',
    format: 'PDF',
    status: 'Generating',
    lastUpdated: '30 Jul 2026',
    summary: [
      { label: 'Opening Cash', value: '$207,380' },
      { label: 'Net Inflow', value: '$118,440' },
      { label: 'Net Outflow', value: '$48,620' },
      { label: 'Closing Cash', value: '$277,200' },
    ],
    filters: [
      { label: 'Method', value: 'Indirect' },
      { label: 'Financial Year', value: '2026 – 2027' },
      { label: 'Bank Accounts', value: 'All' },
      { label: 'Department', value: 'All' },
    ],
    accounts: [
      { name: 'Operating Bank Account', code: 'LGR-1001' },
      { name: 'Payroll Bank Account', code: 'LGR-1002' },
    ],
    files: [{ name: 'cash-flow-jul-2026.pdf', meta: 'Generating…', available: false }],
    schedule: 'Monthly on the 30th at 06:00 AM · running now',
    notes: 'Regenerating after the 30 Jul bank reconciliation. Expected to complete within 5 minutes.',
  },
  {
    id: 'rp_07',
    name: 'Expense Report — Cost Centre',
    period: '01 – 31 Jul 2026',
    category: 'Expense Report',
    categoryTint: 'secondary',
    generatedBy: 'Sarah Rose',
    generatedByDept: 'Accounts',
    generatedOn: '28 Jul 2026',
    generatedAt: '04:15 PM',
    format: 'CSV',
    status: 'Scheduled',
    lastUpdated: '28 Jul 2026',
    summary: [
      { label: 'Total Expenditure', value: '$53,422' },
      { label: 'Payroll', value: '$48,620' },
      { label: 'Scholarships', value: '$4,660' },
      { label: 'Bank Charges', value: '$142' },
    ],
    filters: [
      { label: 'Cost Centre', value: 'All' },
      { label: 'Expense Category', value: 'All' },
      { label: 'Vendor', value: 'All' },
      { label: 'Grouped By', value: 'Cost Centre' },
    ],
    accounts: [
      { name: 'Salaries & Wages', code: 'LGR-5001' },
      { name: 'Scholarship Expense', code: 'LGR-5004' },
      { name: 'Bank & Gateway Charges', code: 'LGR-5008' },
    ],
    files: [{ name: 'expense-cost-centre-jul-2026.csv', meta: 'CSV · 78 KB', available: true }],
    schedule: 'Monthly on the 1st at 08:00 AM · next 01 Aug 2026',
    notes: 'Bank and gateway charges are provisional until the 4 unmapped statement lines are posted.',
  },
  {
    id: 'rp_08',
    name: 'Income Statement — June',
    period: '01 – 30 Jun 2026',
    category: 'Income Statement',
    categoryTint: 'success',
    generatedBy: 'Scheduler',
    generatedByDept: 'Automated',
    generatedOn: '01 Jul 2026',
    generatedAt: '06:02 AM',
    format: 'Excel',
    status: 'Failed',
    lastUpdated: '01 Jul 2026',
    summary: [
      { label: 'Total Income', value: '—' },
      { label: 'Heads Covered', value: '—' },
      { label: 'Error Stage', value: 'Data extract' },
      { label: 'Retry Attempts', value: '2 of 3' },
    ],
    filters: [
      { label: 'Financial Year', value: '2026 – 2027' },
      { label: 'Period', value: 'June 2026' },
      { label: 'Department', value: 'All' },
      { label: 'Grouped By', value: 'Income Head' },
    ],
    accounts: [
      { name: 'Fee Income', code: 'LGR-4001' },
      { name: 'Transport Income', code: 'LGR-4002' },
      { name: 'Hostel Income', code: 'LGR-4003' },
    ],
    files: [{ name: 'income-statement-jun-2026.xlsx', meta: 'Not generated', available: false }],
    schedule: 'Paused after 2 failed attempts · manual run required',
    notes: 'Extract failed while the June period was mid-close. Re-run once the ledger lock is released.',
  },
];

/* ------------------------------ Report catalogue ----------------------------- */

export interface ReportType {
  id: string;
  label: string;
  icon: string;
  tint: string;
  blurb: string;
  lastGenerated: string;
}

/** The eight "Quick Generate" cards above the grid. */
export const reportTypes: ReportType[] = [
  { id: 'Profit & Loss', label: 'Profit & Loss', icon: 'ti ti-report-money', tint: 'primary', blurb: 'Statement of income and expenditure for the selected period.', lastGenerated: '30 Jul 2026' },
  { id: 'Balance Sheet', label: 'Balance Sheet', icon: 'ti ti-scale', tint: 'info', blurb: 'Assets, liabilities and capital position as on a given date.', lastGenerated: '30 Jun 2026' },
  { id: 'Income Statement', label: 'Income Statement', icon: 'ti ti-file-text', tint: 'success', blurb: 'Head-wise income recognised across all fee and other heads.', lastGenerated: '28 Jul 2026' },
  { id: 'Cash Flow', label: 'Cash Flow', icon: 'ti ti-arrows-left-right', tint: 'warning', blurb: 'Operating, investing and financing movement of funds.', lastGenerated: '30 Jun 2026' },
  { id: 'Trial Balance', label: 'Trial Balance', icon: 'ti ti-book', tint: 'purple', blurb: 'Debit and credit totals of every ledger account.', lastGenerated: '31 Jul 2026' },
  { id: 'Fee Collection', label: 'Fee Collection', icon: 'ti ti-receipt', tint: 'pink', blurb: 'Collections by fee category, class and payment method.', lastGenerated: '30 Jul 2026' },
  { id: 'Outstanding Dues', label: 'Outstanding Dues', icon: 'ti ti-alert-triangle', tint: 'danger', blurb: 'Ageing analysis of unpaid invoices by student and class.', lastGenerated: '29 Jul 2026' },
  { id: 'Expense Report', label: 'Expense Report', icon: 'ti ti-cash', tint: 'secondary', blurb: 'Expenditure by category, cost centre and vendor.', lastGenerated: '28 Jul 2026' },
];

/* --------------------------------- Options ---------------------------------- */

export const reportTypeOptions = reportTypes.map((type) => type.label);
export const financialYearOptions = ['2026 – 2027', '2025 – 2026', '2024 – 2025'];
export const departmentOptions = ['Accounts', 'Academic', 'Transport', 'Hostel', 'Library', 'Payroll'];
export const statusOptions: ReportStatus[] = ['Ready', 'Generating', 'Scheduled', 'Failed', 'Archived'];
export const formatOptions: ReportFormat[] = ['PDF', 'Excel', 'CSV'];
export const generatedByOptions = ['Finance Manager', 'Sarah Rose', 'Accounts Head', 'Scheduler'];
