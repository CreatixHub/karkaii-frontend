/* -------------------------------- Stat cards ------------------------------- */

export interface SalaryStatCard {
  id: string;
  /** `stats-primary` | `stats-success` | `stats-warning` | `stats-info`. */
  variant: string;
  /** The three letters stacked in `.stats-avatars`. */
  avatars: string[];
  icon: string;
  value: string;
  label: string;
  /** The template's inline `style="width:NN%"` on `.stats-bar i`. */
  barWidth: string;
}

export const statCards: SalaryStatCard[] = [
  {
    id: 'net',
    variant: 'stats-primary',
    avatars: ['N', 'E', 'T'],
    icon: 'ti ti-currency-dollar',
    value: '$52,400',
    label: 'Net Salary',
    barWidth: '86%',
  },
  {
    id: 'gross',
    variant: 'stats-success',
    avatars: ['G', 'R', 'S'],
    icon: 'ti ti-wallet',
    value: '$58,000',
    label: 'Gross Salary',
    barWidth: '100%',
  },
  {
    id: 'deductions',
    variant: 'stats-warning',
    avatars: ['D', 'E', 'D'],
    icon: 'ti ti-report-money',
    value: '$5,600',
    label: 'Total Deductions',
    barWidth: '10%',
  },
  {
    id: 'leave',
    variant: 'stats-info',
    avatars: ['L', 'V', 'D'],
    icon: 'ti ti-calendar-event',
    value: '2 Days',
    label: 'Leave Deducted',
    barWidth: '20%',
  },
];

/* ----------------------------- Payroll summary ----------------------------- */

export interface SalaryTile {
  id: string;
  label: string;
  value: string;
  /** `bg-*-transparent` tint on the avatar. */
  tint: string;
  /** `text-*` colour on the avatar. */
  text: string;
  icon: string;
}

export const salaryTiles: SalaryTile[] = [
  {
    id: 'net',
    label: 'Total Net Salary',
    value: '$5,55,410',
    tint: 'bg-secondary-transparent',
    text: 'text-secondary',
    icon: 'ti ti-user-dollar',
  },
  {
    id: 'gross',
    label: 'Total Gross Salary',
    value: '$5,58,380',
    tint: 'bg-success-transparent',
    text: 'text-success',
    icon: 'ti ti-moneybag',
  },
  {
    id: 'deduction',
    label: 'Total Deduction',
    value: '$2,500',
    tint: 'bg-warning-transparent',
    text: 'text-warning',
    icon: 'ti ti-arrow-big-down-lines',
  },
];

/* ------------------------------- Payslip rows ------------------------------ */

export interface SalaryRow {
  /** Row key — the template repeats payroll id 8198 twice. */
  id: string;
  payrollId: string;
  salaryFor: string;
  date: string;
  method: string;
  netSalary: string;
}

export const salaryRows: SalaryRow[] = [
  { id: 'sal-1', payrollId: '8198', salaryFor: 'Apr - 2024', date: '04 May 2024', method: 'Cash', netSalary: '$20,000' },
  { id: 'sal-2', payrollId: '8197', salaryFor: 'Mar - 2024', date: '05 Apr 2024', method: 'Cheque', netSalary: '$19,000' },
  { id: 'sal-3', payrollId: '8196', salaryFor: 'Feb - 2024', date: '05 Mar 2024', method: 'Cash', netSalary: '$19,500' },
  { id: 'sal-4', payrollId: '8198', salaryFor: 'Jan - 2024', date: '06 Feb 2024', method: 'Cash', netSalary: '$20,000' },
  { id: 'sal-5', payrollId: '8194', salaryFor: 'Dec - 2023', date: '03 Jan 2024', method: 'Cheque', netSalary: '$19,480' },
  { id: 'sal-6', payrollId: '8193', salaryFor: 'Nov - 2023', date: '05 Dec 2023', method: 'Cheque', netSalary: '$19,480' },
  { id: 'sal-7', payrollId: '8192', salaryFor: 'Oct - 2023', date: '03 Nov 2023', method: 'Cheque', netSalary: '$19,480' },
  { id: 'sal-8', payrollId: '8191', salaryFor: 'Sep - 2023', date: '04 Oct 2023', method: 'Cheque', netSalary: '$18,000' },
  { id: 'sal-9', payrollId: '8190', salaryFor: 'Aug - 2023', date: '06 Sep 2023', method: 'Cheque', netSalary: '$20,000' },
  { id: 'sal-10', payrollId: '8189', salaryFor: 'Jul - 2023', date: '05 Aug 2023', method: 'Cheque', netSalary: '$20,000' },
];
