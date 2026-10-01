/** Badge colour used by the status pill in each table. */
export type BadgeTone = 'badge-soft-success' | 'badge-soft-warning' | 'badge-soft-danger';

/** Weekly Routine row. */
export interface RoutineRow {
  id: string;
  day: string;
  subject: string;
  className: string;
  time: string;
  room: string;
}

export const routineRows: RoutineRow[] = [
  { id: 'mon-1', day: 'Monday', subject: 'Physics', className: 'III - A', time: '09:00 - 09:45 AM', room: 'Room 104' },
  { id: 'mon-2', day: 'Monday', subject: 'Physics', className: 'IV - B', time: '09:45 - 10:30 AM', room: 'Room 104' },
  { id: 'tue-1', day: 'Tuesday', subject: 'Physics', className: 'V - A', time: '11:30 - 12:15 PM', room: 'Room 105' },
  { id: 'wed-1', day: 'Wednesday', subject: 'Physics', className: 'III - B', time: '01:30 - 02:15 PM', room: 'Room 104' },
  { id: 'thu-1', day: 'Thursday', subject: 'Physics', className: 'VI - A', time: '09:00 - 09:45 AM', room: 'Room 105' },
  { id: 'fri-1', day: 'Friday', subject: 'Physics', className: 'IV - A', time: '10:45 - 11:30 AM', room: 'Room 101' },
];

/** One of the four stat tiles above the Leave History table. */
export interface AttendanceTile {
  id: string;
  icon: string;
  tone: string;
  label: string;
  value: string;
}

export const attendanceTiles: AttendanceTile[] = [
  {
    id: 'present',
    icon: 'ti ti-calendar-check',
    tone: 'bg-success-transparent text-success',
    label: 'Present',
    value: '218 Days',
  },
  {
    id: 'absent',
    icon: 'ti ti-calendar-x',
    tone: 'bg-danger-transparent text-danger',
    label: 'Absent',
    value: '6 Days',
  },
  {
    id: 'late',
    icon: 'ti ti-clock-hour-4',
    tone: 'bg-warning-transparent text-warning',
    label: 'Late',
    value: '3 Days',
  },
  {
    id: 'leave-balance',
    icon: 'ti ti-calendar-off',
    tone: 'bg-info-transparent text-info',
    label: 'Leave Balance',
    value: '12 Days',
  },
];

/** Leave History row. */
export interface LeaveRow {
  id: string;
  type: string;
  from: string;
  to: string;
  days: string;
  status: string;
  statusClass: BadgeTone;
}

export const leaveHistory: LeaveRow[] = [
  {
    id: 'lv-1',
    type: 'Casual Leave',
    from: '12 Mar 2026',
    to: '13 Mar 2026',
    days: '2',
    status: 'Approved',
    statusClass: 'badge-soft-success',
  },
  {
    id: 'lv-2',
    type: 'Sick Leave',
    from: '04 Feb 2026',
    to: '04 Feb 2026',
    days: '1',
    status: 'Approved',
    statusClass: 'badge-soft-success',
  },
  {
    id: 'lv-3',
    type: 'Casual Leave',
    from: '20 Jan 2026',
    to: '21 Jan 2026',
    days: '2',
    status: 'Rejected',
    statusClass: 'badge-soft-danger',
  },
  {
    id: 'lv-4',
    type: 'Earned Leave',
    from: '02 Dec 2025',
    to: '05 Dec 2025',
    days: '4',
    status: 'Pending',
    statusClass: 'badge-soft-warning',
  },
];

/** A line in the Earnings / Deductions breakdown. */
export interface SalaryLine {
  id: string;
  label: string;
  amount: string;
  /** The Net Pay line the template renders with a top border and green amount. */
  total?: boolean;
}

export const salaryEarnings: SalaryLine[] = [
  { id: 'basic', label: 'Basic', amount: '$3,200' },
  { id: 'hra', label: 'HRA', amount: '$800' },
  { id: 'allowances', label: 'Allowances', amount: '$450' },
];

export const salaryDeductions: SalaryLine[] = [
  { id: 'tax', label: 'Tax', amount: '$320' },
  { id: 'pf', label: 'Provident Fund', amount: '$260' },
  { id: 'net-pay', label: 'Net Pay', amount: '$4,670', total: true },
];

/** Recent Payslips row. */
export interface PayslipRow {
  id: string;
  month: string;
  netPay: string;
  paidOn: string;
  status: string;
  statusClass: BadgeTone;
}

export const payslips: PayslipRow[] = [
  {
    id: 'ps-jun-2026',
    month: 'June 2026',
    netPay: '$4,670',
    paidOn: '01 Jul 2026',
    status: 'Paid',
    statusClass: 'badge-soft-success',
  },
  {
    id: 'ps-may-2026',
    month: 'May 2026',
    netPay: '$4,670',
    paidOn: '01 Jun 2026',
    status: 'Paid',
    statusClass: 'badge-soft-success',
  },
  {
    id: 'ps-apr-2026',
    month: 'April 2026',
    netPay: '$4,670',
    paidOn: '01 May 2026',
    status: 'Paid',
    statusClass: 'badge-soft-success',
  },
];

/** Issued Books row. */
export interface IssuedBookRow {
  id: string;
  book: string;
  issueDate: string;
  dueDate: string;
  status: string;
  statusClass: BadgeTone;
}

export const issuedBooks: IssuedBookRow[] = [
  {
    id: 'bk-1',
    book: 'Concepts of Physics',
    issueDate: '02 Jun 2026',
    dueDate: '16 Jun 2026',
    status: 'Returned',
    statusClass: 'badge-soft-success',
  },
  {
    id: 'bk-2',
    book: 'Fundamentals of Optics',
    issueDate: '20 Jun 2026',
    dueDate: '04 Jul 2026',
    status: 'Issued',
    statusClass: 'badge-soft-warning',
  },
  {
    id: 'bk-3',
    book: 'Modern Lab Manual',
    issueDate: '28 Jun 2026',
    dueDate: '12 Jul 2026',
    status: 'Overdue',
    statusClass: 'badge-soft-danger',
  },
];
