export type PayslipStatus = 'Paid' | 'Pending' | 'Processing';

export interface Payslip {
  id: string;
  name: string;
  avatar: string;
  department: string;
  designation: string;
  /** Filter-only facet; no column shows it. */
  employeeType: string;
  month: string;
  basic: number;
  allowances: number;
  deductions: number;
  method: { label: string; icon: string };
  /** Em dash while the run is unpaid, as the template prints it. */
  paymentDate: string;
  status: PayslipStatus;
  generatedBy: string;
  lastUpdated: string;
}

export const statusPill: Record<PayslipStatus, string> = {
  Paid: 'is-active',
  Pending: 'is-pending',
  Processing: 'is-new',
};

export const statusBadge: Record<PayslipStatus, string> = {
  Paid: 'badge badge-soft-success',
  Pending: 'badge badge-soft-warning',
  Processing: 'badge badge-soft-info',
};

const BANK = { label: 'Bank Transfer', icon: 'ti ti-building-bank' };
const CHEQUE = { label: 'Cheque', icon: 'ti ti-file-invoice' };
const CASH = { label: 'Cash', icon: 'ti ti-cash' };

export const payslips: Payslip[] = [
  { id: 'EMP-1001', name: 'Grace Lee', avatar: 'assets/img/profiles/avatar-27.jpg', department: 'Mathematics', designation: 'Senior Teacher', employeeType: 'Teaching', month: 'Jul 2026', basic: 3200, allowances: 1030, deductions: 480, method: BANK, paymentDate: '28 Jul 2026', status: 'Paid', generatedBy: 'K. Larry', lastUpdated: '28 Jul 2026' },
  { id: 'EMP-1002', name: 'Hassan Ali', avatar: 'assets/img/profiles/avatar-23.jpg', department: 'Science', designation: 'Physics Teacher', employeeType: 'Teaching', month: 'Jul 2026', basic: 3000, allowances: 880, deductions: 380, method: BANK, paymentDate: '28 Jul 2026', status: 'Paid', generatedBy: 'K. Larry', lastUpdated: '28 Jul 2026' },
  { id: 'EMP-1003', name: 'Olivia Park', avatar: 'assets/img/profiles/avatar-25.jpg', department: 'Languages', designation: 'English Teacher', employeeType: 'Teaching', month: 'Jul 2026', basic: 2900, allowances: 690, deductions: 450, method: BANK, paymentDate: '—', status: 'Pending', generatedBy: 'S. Reddy', lastUpdated: '26 Jul 2026' },
  { id: 'EMP-1004', name: 'Rohan Das', avatar: 'assets/img/profiles/avatar-01.jpg', department: 'Science', designation: 'Biology Teacher', employeeType: 'Teaching', month: 'Jul 2026', basic: 3100, allowances: 940, deductions: 400, method: CHEQUE, paymentDate: '—', status: 'Processing', generatedBy: 'S. Reddy', lastUpdated: '25 Jul 2026' },
  { id: 'EMP-1005', name: 'Ivy Chen', avatar: 'assets/img/profiles/avatar-02.jpg', department: 'Finance', designation: 'Accountant', employeeType: 'Administrative', month: 'Jul 2026', basic: 2600, allowances: 580, deductions: 300, method: BANK, paymentDate: '28 Jul 2026', status: 'Paid', generatedBy: 'K. Larry', lastUpdated: '28 Jul 2026' },
  { id: 'EMP-1006', name: 'Liam Scott', avatar: 'assets/img/profiles/avatar-05.jpg', department: 'Humanities', designation: 'History Teacher', employeeType: 'Teaching', month: 'Jul 2026', basic: 2800, allowances: 650, deductions: 370, method: BANK, paymentDate: '28 Jul 2026', status: 'Paid', generatedBy: 'K. Larry', lastUpdated: '28 Jul 2026' },
  { id: 'EMP-1007', name: 'Maria Gomez', avatar: 'assets/img/profiles/avatar-11.jpg', department: 'Library', designation: 'Librarian', employeeType: 'Support', month: 'Jul 2026', basic: 2200, allowances: 400, deductions: 250, method: CASH, paymentDate: '—', status: 'Pending', generatedBy: 'S. Reddy', lastUpdated: '24 Jul 2026' },
  { id: 'EMP-1008', name: 'Noah Bennett', avatar: 'assets/img/profiles/avatar-16.jpg', department: 'HR', designation: 'HR Executive', employeeType: 'Administrative', month: 'Jul 2026', basic: 2700, allowances: 630, deductions: 320, method: BANK, paymentDate: '28 Jul 2026', status: 'Paid', generatedBy: 'K. Larry', lastUpdated: '28 Jul 2026' },
];

export const netSalary = (row: Payslip): number => row.basic + row.allowances - row.deductions;

export const money = (value: number): string => `$${value.toLocaleString('en-US')}`;

/* -------------------------------- Workspace -------------------------------- */

export interface FilterField {
  id: string;
  label: string;
  options: string[];
  /** Month and Year have no "All" lead option in the template. */
  noAllOption?: boolean;
}

export const filterFields: FilterField[] = [
  { id: 'payroll-month', label: 'Payroll Month', options: ['July', 'June', 'May'], noAllOption: true },
  { id: 'payroll-year', label: 'Payroll Year', options: ['2026', '2025'], noAllOption: true },
  { id: 'department', label: 'Department', options: ['Science', 'Mathematics', 'Languages', 'Finance'] },
  { id: 'employee-type', label: 'Employee Type', options: ['Teaching', 'Administrative', 'Support'] },
  { id: 'designation', label: 'Designation', options: ['Senior Teacher', 'Accountant', 'Librarian'] },
  { id: 'status', label: 'Status', options: ['Paid', 'Pending', 'Processing'] },
  { id: 'payment-method', label: 'Payment Method', options: ['Bank Transfer', 'Cheque', 'Cash'] },
];

export const filterChipLabels: Record<string, string> = {
  'payroll-month': 'Month',
  'payroll-year': 'Year',
  department: 'Dept',
  'employee-type': 'Type',
  designation: 'Designation',
  status: 'Status',
  'payment-method': 'Method',
};

export const filterChipTone: Record<string, string> = {
  'payroll-month': 'primary',
  'payroll-year': 'primary',
  department: 'info',
  'employee-type': 'info',
  designation: 'info',
  status: 'success',
  'payment-method': 'warning',
};

export type SortKey = 'employee' | 'net' | 'updated';

export const sortOptions: { id: SortKey; label: string; icon: string }[] = [
  { id: 'employee', label: 'Employee (A–Z)', icon: 'ti ti-abc' },
  { id: 'net', label: 'Net Salary', icon: 'ti ti-cash' },
  { id: 'updated', label: 'Last Updated', icon: 'ti ti-clock' },
];

export type SavedViewId = 'all' | 'pending' | 'paid';

export const savedViews: { id: SavedViewId; label: string; icon: string }[] = [
  { id: 'all', label: 'All Payslips', icon: 'ti ti-list' },
  { id: 'pending', label: 'Pending Only', icon: 'ti ti-file-alert' },
  { id: 'paid', label: 'Paid Only', icon: 'ti ti-file-check' },
];

export type BulkActionId = 'email' | 'download' | 'print' | 'archive';

export const bulkActions: { id: BulkActionId; label: string; icon: string }[] = [
  { id: 'email', label: 'Email Payslips', icon: 'ti ti-mail' },
  { id: 'download', label: 'Download PDFs', icon: 'ti ti-download' },
  { id: 'print', label: 'Print', icon: 'ti ti-printer' },
  { id: 'archive', label: 'Archive', icon: 'ti ti-archive' },
];

export type ColumnId =
  | 'department'
  | 'designation'
  | 'allowances'
  | 'deductions'
  | 'method'
  | 'generatedBy'
  | 'lastUpdated';

export const toggleableColumns: { id: ColumnId; label: string }[] = [
  { id: 'department', label: 'Department' },
  { id: 'designation', label: 'Designation' },
  { id: 'allowances', label: 'Allowances' },
  { id: 'deductions', label: 'Deductions' },
  { id: 'method', label: 'Payment Method' },
  { id: 'generatedBy', label: 'Generated By' },
  { id: 'lastUpdated', label: 'Last Updated' },
];

/**
 * The template's summary bar. "Processed" and "Pending" are school-wide figures
 * across 128 employees, not the eight-row sample, so they stay as written; the
 * period and last-run stamps likewise.
 */
export const summaryTiles = [
  { id: 'period', tint: 'bg-primary-transparent text-primary', icon: 'ti ti-calendar-month', label: 'Payroll Period', value: 'July 2026' },
  { id: 'total', tint: 'bg-secondary-transparent text-secondary', icon: 'ti ti-users', label: 'Total Employees', value: '128' },
  { id: 'processed', tint: 'bg-success-transparent text-success', icon: 'ti ti-file-check', label: 'Processed Payslips', value: '112' },
  { id: 'pending', tint: 'bg-warning-transparent text-warning', icon: 'ti ti-file-alert', label: 'Pending Payslips', value: '16' },
  { id: 'payment', tint: 'bg-info-transparent text-info', icon: 'ti ti-wallet', label: 'Payment Status', value: 'Partially Paid' },
  { id: 'lastrun', tint: 'bg-secondary-transparent text-secondary', icon: 'ti ti-clock-check', label: 'Last Payroll Run', value: '28 Jul 2026' },
];

/** Earnings and deduction components used by the breakdown dialogs. */
export const earningComponents = (row: Payslip) => [
  { label: 'Basic Salary', amount: row.basic },
  { label: 'House Rent Allowance', amount: Math.round(row.allowances * 0.55) },
  { label: 'Conveyance', amount: Math.round(row.allowances * 0.2) },
  { label: 'Special Allowance', amount: row.allowances - Math.round(row.allowances * 0.55) - Math.round(row.allowances * 0.2) },
];

export const deductionComponents = (row: Payslip) => [
  { label: 'Provident Fund', amount: Math.round(row.deductions * 0.6) },
  { label: 'Professional Tax', amount: Math.round(row.deductions * 0.2) },
  { label: 'Health Insurance', amount: row.deductions - Math.round(row.deductions * 0.6) - Math.round(row.deductions * 0.2) },
];

export const PAYROLL_PERIOD = 'July 2026';
