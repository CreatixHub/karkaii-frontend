export interface MetricTile {
  id: string;
  value: string;
  label: string;
  color: string;
}

export interface BadgeCell {
  label: string;
  className: string;
}

/* ------------------------------- Attendance ------------------------------- */

export const attendanceTiles: MetricTile[] = [
  { id: 'present', value: '182', label: 'Present', color: 'success' },
  { id: 'absent', value: '8', label: 'Absent', color: 'danger' },
  { id: 'late', value: '4', label: 'Late', color: 'warning' },
  { id: 'working', value: '194', label: 'Working Days', color: 'primary' },
];

export const attendanceStatuses = ['Present', 'Absent', 'Late', 'Half Day'];

export interface AttendanceRecord {
  date: string;
  status: BadgeCell;
  remark: string;
}

export const attendanceRecords: AttendanceRecord[] = [
  { date: '21 Jul 2026', status: { label: 'Present', className: 'badge-soft-success' }, remark: '—' },
  { date: '20 Jul 2026', status: { label: 'Late', className: 'badge-soft-warning' }, remark: 'Bus delay' },
  { date: '19 Jul 2026', status: { label: 'Absent', className: 'badge-soft-danger' }, remark: 'Sick leave' },
  { date: '18 Jul 2026', status: { label: 'Present', className: 'badge-soft-success' }, remark: '—' },
];

/* ---------------------------------- Fees ---------------------------------- */

export const feeTiles: MetricTile[] = [
  { id: 'total', value: '$2,400', label: 'Total Fees', color: 'primary' },
  { id: 'paid', value: '$1,800', label: 'Paid', color: 'success' },
  { id: 'pending', value: '$600', label: 'Pending', color: 'danger' },
];

export interface FeeTerm {
  term: string;
  amount: string;
  due: string;
  status: BadgeCell;
}

export const feeTerms: FeeTerm[] = [
  { term: 'Term 1', amount: '$800', due: '10 Apr 2026', status: { label: 'Paid', className: 'badge-soft-success' } },
  { term: 'Term 2', amount: '$800', due: '10 Aug 2026', status: { label: 'Paid', className: 'badge-soft-success' } },
  { term: 'Term 3', amount: '$600', due: '10 Dec 2026', status: { label: 'Pending', className: 'badge-soft-warning' } },
];

export const paymentMethods = ['Cash', 'Card', 'Bank Transfer', 'UPI'];

/* --------------------------------- Result --------------------------------- */

export const examOptions = ['Term 1 Examination', 'Mid Term', 'Term 2 Examination'];

export interface ResultRow {
  subject: string;
  max: string;
  obtained: string;
  grade: string;
  result: BadgeCell;
}

export const resultRows: ResultRow[] = [
  { subject: 'English', max: '100', obtained: '88', grade: 'A', result: { label: 'Pass', className: 'badge-soft-success' } },
  { subject: 'Mathematics', max: '100', obtained: '92', grade: 'A+', result: { label: 'Pass', className: 'badge-soft-success' } },
  { subject: 'Science', max: '100', obtained: '84', grade: 'A', result: { label: 'Pass', className: 'badge-soft-success' } },
  { subject: 'Social Studies', max: '100', obtained: '79', grade: 'B+', result: { label: 'Pass', className: 'badge-soft-success' } },
  { subject: 'Computer', max: '100', obtained: '94', grade: 'A+', result: { label: 'Pass', className: 'badge-soft-success' } },
];

export const resultTotal = { max: '500', obtained: '437', grade: 'A', percentage: '87.4%' };

/* -------------------------------- Timetable -------------------------------- */

export const timetableSlots = ['09:00', '10:00', '11:00', '12:00', '01:30'];

export interface TimetableRow {
  day: string;
  periods: string[];
  /** Index of the lunch column, rendered muted. */
  breakIndex: number;
}

export const timetableRows: TimetableRow[] = [
  { day: 'Mon', periods: ['English', 'Maths', 'Science', 'Lunch', 'Computer'], breakIndex: 3 },
  { day: 'Tue', periods: ['Maths', 'Social', 'English', 'Lunch', 'Art'], breakIndex: 3 },
  { day: 'Wed', periods: ['Science', 'English', 'Maths', 'Lunch', 'PE'], breakIndex: 3 },
  { day: 'Thu', periods: ['Social', 'Computer', 'Science', 'Lunch', 'Music'], breakIndex: 3 },
  { day: 'Fri', periods: ['English', 'Maths', 'Library', 'Lunch', 'Sports'], breakIndex: 3 },
];

/* --------------------------------- Library --------------------------------- */

export interface IssuedBook {
  book: string;
  issued: string;
  due: string;
  status: BadgeCell;
}

export const issuedBooks: IssuedBook[] = [
  { book: 'Atomic Habits', issued: '02 Jul 2026', due: '16 Jul 2026', status: { label: 'Overdue', className: 'badge-soft-danger' } },
  { book: 'The Jungle Book', issued: '14 Jul 2026', due: '28 Jul 2026', status: { label: 'On Time', className: 'badge-soft-success' } },
];

/* --------------------------------- Leaves ---------------------------------- */

export interface LeaveRow {
  type: string;
  from: string;
  to: string;
  days: string;
  status: BadgeCell;
}

export const leaveRows: LeaveRow[] = [
  { type: 'Sick Leave', from: '19 Jul 2026', to: '19 Jul 2026', days: '1', status: { label: 'Approved', className: 'badge-soft-success' } },
  { type: 'Casual Leave', from: '02 Jun 2026', to: '03 Jun 2026', days: '2', status: { label: 'Approved', className: 'badge-soft-success' } },
  { type: 'Medical', from: '25 Jul 2026', to: '26 Jul 2026', days: '2', status: { label: 'Pending', className: 'badge-soft-warning' } },
];

export const leaveTypes = ['Sick Leave', 'Casual Leave', 'Medical', 'Other'];

/* --------------------------------- Promote --------------------------------- */

export const promoteClasses = ['IV - A', 'IV - B', 'V - A'];
export const promoteYears = ['2026 / 2027', '2027 / 2028'];
export const promoteResults = ['Passed', 'On Probation'];

/* ------------------------------- Collect Fees ------------------------------ */

export const feesGroups = ['Class 1 General', 'Monthly Fees', 'Admission-Fees', 'Class 1- I Installment'];
export const feesTypes = ['Tuition Fees', 'Monthly Fees', 'Admission Fees', 'Bus Fees'];
export const collectPaymentTypes = ['Paytm', 'Cash On Delivery'];
