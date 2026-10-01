export type PayrollStatus = 'Paid' | 'Approved' | 'Processing' | 'Pending' | 'On Hold' | 'Unpaid';

export interface PayrollRow {
  id: string;
  name: string;
  avatar: string;
  department: string;
  designation: string;
  /** Filter-only facets; no column shows them. */
  campus: string;
  employeeType: string;
  month: string;
  basic: number;
  allowances: number;
  deductions: number;
  bonus: number;
  method: { label: string; icon: string };
  status: PayrollStatus;
  /** Em dash until the run is paid, as the template prints it. */
  paymentDate: string;
  lastUpdated: string;
}

export const statusPill: Record<PayrollStatus, string> = {
  Paid: 'is-active',
  Approved: 'is-active',
  Processing: 'is-new',
  Pending: 'is-pending',
  'On Hold': 'is-archived',
  Unpaid: 'is-inactive',
};

export const statusBadge: Record<PayrollStatus, string> = {
  Paid: 'badge badge-soft-success',
  Approved: 'badge badge-soft-success',
  Processing: 'badge badge-soft-info',
  Pending: 'badge badge-soft-warning',
  'On Hold': 'badge badge-soft-dark',
  Unpaid: 'badge badge-soft-danger',
};

const BANK = { label: 'Bank Transfer', icon: 'ti ti-building-bank' };
const CHEQUE = { label: 'Cheque', icon: 'ti ti-file-invoice' };
const CASH = { label: 'Cash', icon: 'ti ti-cash' };
const UPI = { label: 'UPI', icon: 'ti ti-device-mobile' };

export const payrollRows: PayrollRow[] = [
  { id: 'EMP-0101', name: 'Daniel Josua', avatar: 'assets/img/profiles/avatar-27.jpg', department: 'Administration', designation: 'Principal', campus: 'Main Campus', employeeType: 'Full-time', month: 'Jul 2026', basic: 4200, allowances: 820, deductions: 540, bonus: 300, method: BANK, status: 'Paid', paymentDate: '28 Jul 2026', lastUpdated: '28 Jul, 10:12 AM' },
  { id: 'EMP-0102', name: 'Aaron Finch', avatar: 'assets/img/profiles/avatar-02.jpg', department: 'Mathematics', designation: 'Senior Teacher', campus: 'Main Campus', employeeType: 'Full-time', month: 'Jul 2026', basic: 3100, allowances: 540, deductions: 390, bonus: 150, method: BANK, status: 'Paid', paymentDate: '28 Jul 2026', lastUpdated: '28 Jul, 10:14 AM' },
  { id: 'EMP-0103', name: 'Sarah Miller', avatar: 'assets/img/profiles/avatar-03.jpg', department: 'Science', designation: 'Lab Assistant', campus: 'North Campus', employeeType: 'Full-time', month: 'Jul 2026', basic: 2300, allowances: 360, deductions: 260, bonus: 0, method: CHEQUE, status: 'Processing', paymentDate: '—', lastUpdated: '28 Jul, 09:50 AM' },
  { id: 'EMP-0104', name: 'Marcus Reid', avatar: 'assets/img/profiles/avatar-05.jpg', department: 'Transport', designation: 'Driver', campus: 'Main Campus', employeeType: 'Contract', month: 'Jul 2026', basic: 1800, allowances: 420, deductions: 180, bonus: 120, method: CASH, status: 'Pending', paymentDate: '—', lastUpdated: '27 Jul, 06:20 PM' },
  { id: 'EMP-0105', name: 'Priya Nair', avatar: 'assets/img/profiles/avatar-06.jpg', department: 'Accounts', designation: 'Accountant', campus: 'Main Campus', employeeType: 'Full-time', month: 'Jul 2026', basic: 2900, allowances: 500, deductions: 350, bonus: 200, method: BANK, status: 'Approved', paymentDate: '—', lastUpdated: '28 Jul, 08:41 AM' },
  { id: 'EMP-0106', name: 'Elena Ross', avatar: 'assets/img/profiles/avatar-08.jpg', department: 'Library', designation: 'Librarian', campus: 'City Campus', employeeType: 'Full-time', month: 'Jul 2026', basic: 2400, allowances: 380, deductions: 280, bonus: 0, method: BANK, status: 'Paid', paymentDate: '28 Jul 2026', lastUpdated: '28 Jul, 10:02 AM' },
  { id: 'EMP-0107', name: 'Owen Blake', avatar: 'assets/img/profiles/avatar-11.jpg', department: 'Sports', designation: 'Coach', campus: 'North Campus', employeeType: 'Part-time', month: 'Jul 2026', basic: 1600, allowances: 240, deductions: 150, bonus: 80, method: UPI, status: 'On Hold', paymentDate: '—', lastUpdated: '26 Jul, 04:15 PM' },
  { id: 'EMP-0108', name: 'Nadia Khan', avatar: 'assets/img/profiles/avatar-12.jpg', department: 'Languages', designation: 'Teacher', campus: 'City Campus', employeeType: 'Full-time', month: 'Jul 2026', basic: 2800, allowances: 460, deductions: 330, bonus: 0, method: BANK, status: 'Unpaid', paymentDate: '—', lastUpdated: '25 Jul, 02:30 PM' },
];

export const netSalary = (row: PayrollRow): number =>
  row.basic + row.allowances - row.deductions + row.bonus;

export const grossSalary = (row: PayrollRow): number => row.basic + row.allowances + row.bonus;

export const money = (value: number): string => `$${value.toLocaleString('en-US')}`;

/** The Payroll Breakdown dialog's component table. */
export const componentsOf = (row: PayrollRow) => [
  { label: 'Basic Salary', type: 'Earning', amount: row.basic },
  { label: 'Allowances', type: 'Earning', amount: row.allowances },
  { label: 'Bonus', type: 'Earning', amount: row.bonus },
  { label: 'Deductions', type: 'Deduction', amount: row.deductions },
];

/* -------------------------------- Workspace -------------------------------- */

export interface FilterField {
  id: string;
  label: string;
  options: string[];
}

export const filterFields: FilterField[] = [
  { id: 'payroll-month', label: 'Payroll Month', options: ['July 2026', 'June 2026', 'May 2026'] },
  { id: 'payroll-year', label: 'Payroll Year', options: ['2026', '2025', '2024'] },
  { id: 'campus', label: 'Campus', options: ['Main Campus', 'North Campus', 'City Campus'] },
  { id: 'department', label: 'Department', options: ['Administration', 'Mathematics', 'Science', 'Transport', 'Accounts', 'Library', 'Sports', 'Languages'] },
  { id: 'designation', label: 'Designation', options: ['Principal', 'Senior Teacher', 'Teacher', 'Accountant', 'Librarian', 'Driver', 'Coach', 'Lab Assistant'] },
  { id: 'employee-type', label: 'Employee Type', options: ['Full-time', 'Part-time', 'Contract'] },
  { id: 'payment-status', label: 'Payment Status', options: ['Paid', 'Unpaid', 'Pending', 'On Hold'] },
  { id: 'payroll-status', label: 'Payroll Status', options: ['Approved', 'Processing', 'Pending', 'Draft'] },
  { id: 'payment-method', label: 'Payment Method', options: ['Bank Transfer', 'Cheque', 'Cash', 'UPI'] },
];

export const filterChipLabels: Record<string, string> = {
  'payroll-month': 'Month',
  'payroll-year': 'Year',
  campus: 'Campus',
  department: 'Dept',
  designation: 'Designation',
  'employee-type': 'Type',
  'payment-status': 'Payment',
  'payroll-status': 'Payroll',
  'payment-method': 'Method',
};

export const filterChipTone: Record<string, string> = {
  'payroll-month': 'primary',
  'payroll-year': 'primary',
  campus: 'info',
  department: 'info',
  designation: 'info',
  'employee-type': 'info',
  'payment-status': 'success',
  'payroll-status': 'success',
  'payment-method': 'warning',
};

export type SortKey = 'employee' | 'net' | 'paymentDate' | 'department';

export const sortOptions: { id: SortKey; label: string; icon: string }[] = [
  { id: 'employee', label: 'Employee (A–Z)', icon: 'ti ti-abc' },
  { id: 'net', label: 'Net Salary', icon: 'ti ti-cash' },
  { id: 'paymentDate', label: 'Payment Date', icon: 'ti ti-calendar' },
  { id: 'department', label: 'Department', icon: 'ti ti-building' },
];

export type SavedViewId = 'all' | 'pending' | 'unpaid';

export const savedViews: { id: SavedViewId; label: string; icon: string }[] = [
  { id: 'all', label: 'All Employees', icon: 'ti ti-list' },
  { id: 'pending', label: 'Pending Payroll', icon: 'ti ti-clock' },
  { id: 'unpaid', label: 'Unpaid Employees', icon: 'ti ti-alert-circle' },
];

export type BulkActionId = 'process' | 'approve' | 'generate' | 'email' | 'export' | 'print';

export const bulkActions: { id: BulkActionId; label: string; icon: string }[] = [
  { id: 'process', label: 'Process Payroll', icon: 'ti ti-player-play' },
  { id: 'approve', label: 'Approve Payroll', icon: 'ti ti-circle-check' },
  { id: 'generate', label: 'Generate Payslips', icon: 'ti ti-file-text' },
  { id: 'email', label: 'Email Payslips', icon: 'ti ti-mail' },
  { id: 'export', label: 'Export Selected', icon: 'ti ti-file-export' },
  { id: 'print', label: 'Print Payroll', icon: 'ti ti-printer' },
];

export type ColumnId =
  | 'department'
  | 'designation'
  | 'basic'
  | 'allowances'
  | 'deductions'
  | 'bonus'
  | 'method'
  | 'lastUpdated';

export const toggleableColumns: { id: ColumnId; label: string }[] = [
  { id: 'department', label: 'Department' },
  { id: 'designation', label: 'Designation' },
  { id: 'basic', label: 'Basic Salary' },
  { id: 'allowances', label: 'Allowances' },
  { id: 'deductions', label: 'Deductions' },
  { id: 'bonus', label: 'Bonus' },
  { id: 'method', label: 'Payment Method' },
  { id: 'lastUpdated', label: 'Last Updated' },
];

/** School-wide figures from the template, unchanged: they span 128 employees. */
export const summaryTiles = [
  { id: 'period', tint: 'bg-primary-transparent text-primary', icon: 'ti ti-calendar-month', label: 'Payroll Period', value: 'Jul 2026' },
  { id: 'total', tint: 'bg-secondary-transparent text-secondary', icon: 'ti ti-users', label: 'Total Employees', value: '128' },
  { id: 'processed', tint: 'bg-success-transparent text-success', icon: 'ti ti-file-check', label: 'Processed Payroll', value: '96' },
  { id: 'pending', tint: 'bg-warning-transparent text-warning', icon: 'ti ti-file-alert', label: 'Pending Payroll', value: '32' },
  { id: 'lastrun', tint: 'bg-info-transparent text-info', icon: 'ti ti-clock-check', label: 'Last Payroll Run', value: '28 Jul 2026' },
];

export const PAGE_SIZE = 8;
