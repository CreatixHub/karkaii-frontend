export type AssignStatus = 'Assigned' | 'Pending' | 'Partially Paid' | 'Paid' | 'Overdue' | 'Cancelled';

export interface FeeAssignment {
  id: string;
  student: string;
  admissionNo: string;
  roll: number;
  className: string;
  section: string;
  avatar: string;
  feeGroup: string;
  feeType: string;
  academicYear: string;
  assignedDate: string;
  dueDate: string;
  total: number;
  discount: number;
  paid: number;
  status: AssignStatus;
}

export const statusPill: Record<AssignStatus, string> = {
  Assigned: 'is-scheduled',
  Pending: 'is-pending',
  'Partially Paid': 'is-review',
  Paid: 'is-active',
  Overdue: 'is-blocked',
  Cancelled: 'is-inactive',
};

export const statusBadge: Record<AssignStatus, string> = {
  Assigned: 'badge badge-soft-info',
  Pending: 'badge badge-soft-warning',
  'Partially Paid': 'badge badge-soft-primary',
  Paid: 'badge badge-soft-success',
  Overdue: 'badge badge-soft-danger',
  Cancelled: 'badge badge-soft-dark',
};

export const feeAssignments: FeeAssignment[] = [
  { id: 'FA01', student: 'Janet Daniel', admissionNo: 'AD202401', roll: 12, className: 'X', section: 'A', avatar: 'assets/img/students/student-01.jpg', feeGroup: 'Tuition Fees', feeType: 'Tuition', academicYear: '2024/2025', assignedDate: '01 Apr 2024', dueDate: '10 May 2024', total: 1250, discount: 125, paid: 1125, status: 'Paid' },
  { id: 'FA02', student: 'Joann Michael', admissionNo: 'AD202402', roll: 13, className: 'X', section: 'A', avatar: 'assets/img/students/student-02.jpg', feeGroup: 'Transport Fees', feeType: 'Route', academicYear: '2024/2025', assignedDate: '01 Apr 2024', dueDate: '10 May 2024', total: 480, discount: 0, paid: 240, status: 'Partially Paid' },
  { id: 'FA03', student: 'Kathleen Nolan', admissionNo: 'AD202403', roll: 8, className: 'IX', section: 'B', avatar: 'assets/img/students/student-03.jpg', feeGroup: 'Hostel Fees', feeType: 'Room', academicYear: '2024/2025', assignedDate: '01 Apr 2024', dueDate: '15 May 2024', total: 2100, discount: 210, paid: 0, status: 'Pending' },
  { id: 'FA04', student: 'Gifford Ramsey', admissionNo: 'AD202404', roll: 21, className: 'XII', section: 'A', avatar: 'assets/img/students/student-04.jpg', feeGroup: 'Examination Fees', feeType: 'Board Exam', academicYear: '2024/2025', assignedDate: '01 May 2024', dueDate: '20 May 2024', total: 320, discount: 0, paid: 0, status: 'Overdue' },
  { id: 'FA05', student: 'Lisa Gourley', admissionNo: 'AD202405', roll: 5, className: 'XII', section: 'C', avatar: 'assets/img/students/student-05.jpg', feeGroup: 'Library Fees', feeType: 'Membership', academicYear: '2024/2025', assignedDate: '01 Apr 2024', dueDate: '30 May 2024', total: 150, discount: 15, paid: 135, status: 'Paid' },
  { id: 'FA06', student: 'Ralph Claudia', admissionNo: 'AD202406', roll: 17, className: 'XI', section: 'A', avatar: 'assets/img/students/student-06.jpg', feeGroup: 'Sports & Activities', feeType: 'Sports', academicYear: '2024/2025', assignedDate: '01 Apr 2024', dueDate: '25 May 2024', total: 260, discount: 0, paid: 130, status: 'Partially Paid' },
  { id: 'FA07', student: 'Julie Scott', admissionNo: 'AD202407', roll: 3, className: 'VIII', section: 'B', avatar: 'assets/img/students/student-07.jpg', feeGroup: 'Laboratory Fees', feeType: 'Science Lab', academicYear: '2024/2025', assignedDate: '01 May 2024', dueDate: '18 May 2024', total: 340, discount: 34, paid: 0, status: 'Assigned' },
  { id: 'FA08', student: 'Hellen Warner', admissionNo: 'AD202408', roll: 9, className: 'XI', section: 'A', avatar: 'assets/img/students/student-08.jpg', feeGroup: 'Admission Fees', feeType: 'Admission', academicYear: '2024/2025', assignedDate: '01 Apr 2024', dueDate: '12 May 2024', total: 900, discount: 0, paid: 900, status: 'Paid' },
  { id: 'FA09', student: 'Andrew Fischer', admissionNo: 'AD202409', roll: 14, className: 'X', section: 'A', avatar: 'assets/img/students/student-09.jpg', feeGroup: 'Miscellaneous Fees', feeType: 'Uniform', academicYear: '2024/2025', assignedDate: '01 Apr 2024', dueDate: '22 May 2024', total: 180, discount: 18, paid: 60, status: 'Partially Paid' },
  { id: 'FA10', student: 'Karen Robinson', admissionNo: 'AD202410', roll: 6, className: 'VII', section: 'B', avatar: 'assets/img/students/student-10.jpg', feeGroup: 'Coaching Fees', feeType: 'Coaching', academicYear: '2023/2024', assignedDate: '01 Apr 2023', dueDate: '10 Apr 2024', total: 540, discount: 0, paid: 0, status: 'Cancelled' },
];

/* -------------------------------- Derivations ------------------------------- */

export const money = (value: number): string => `$${value.toLocaleString('en-US')}`;

/** Net payable after the concession. */
export const payableOf = (row: FeeAssignment): number => row.total - row.discount;

export const balanceOf = (row: FeeAssignment): number => payableOf(row) - row.paid;

/** Collection percentage, floored as the template shows it (37% on $60/$162). */
export const percentOf = (row: FeeAssignment): number => {
  const payable = payableOf(row);
  return payable === 0 ? 0 : Math.round((row.paid / payable) * 100);
};

/** "RC2401" for rows with a payment; the six paid rows all match their index. */
export const receiptNoOf = (row: FeeAssignment, index: number): string | null =>
  row.paid > 0 ? `RC24${String(index + 1).padStart(2, '0')}` : null;

/** Every discount in the template is exactly 10% of the total. */
export const discountTextOf = (row: FeeAssignment): string =>
  row.discount > 0
    ? `${money(row.discount)} applied (10%) · sibling concession.`
    : 'No discount applied to this assignment.';

export const remarksOf = (row: FeeAssignment): string => {
  switch (row.status) {
    case 'Paid': return 'Fully paid and reconciled.';
    case 'Partially Paid': return `Part payment received — balance ${money(balanceOf(row))} pending.`;
    case 'Overdue': return 'Payment overdue — reminder sent to guardian.';
    case 'Cancelled': return 'Assignment cancelled — fee reversed from the ledger.';
    case 'Assigned':
    case 'Pending':
    default: return 'Fee assigned — awaiting first payment.';
  }
};

/**
 * The template's schedule. Installment 1 reads "Paid" on every row, including
 * the four with nothing received — reproduced as authored, see the file header.
 */
export const installmentsOf = (row: FeeAssignment): { label: string; state: string }[] => [
  { label: 'Installment 1', state: 'Paid' },
  { label: 'Installment 2', state: balanceOf(row) === 0 ? 'Paid' : `Due ${row.dueDate}` },
];

/** Identical on all ten rows. */
export const lateFeeRules = '$5 per day after due date, capped at 10% of the fee.';

export const searchIndexOf = (row: FeeAssignment): string =>
  [row.student, row.admissionNo, row.feeGroup, row.feeType, row.className, row.section, row.status]
    .join(' ')
    .toLowerCase();

/* --------------------------------- Options ---------------------------------- */

export const academicYearOptions = ['2024/2025', '2023/2024'];
export const feeGroupOptions = [
  'Tuition Fees', 'Transport Fees', 'Hostel Fees', 'Examination Fees', 'Library Fees',
  'Sports & Activities', 'Laboratory Fees', 'Admission Fees', 'Miscellaneous Fees', 'Coaching Fees',
];
export const feeTypeOptions = [
  'Tuition', 'Route', 'Room', 'Board Exam', 'Membership', 'Sports', 'Science Lab', 'Admission',
  'Uniform', 'Coaching',
];
export const classOptions = ['X', 'IX', 'XII', 'XI', 'VIII', 'VII'];
export const sectionOptions = ['A', 'B', 'C'];
export const studentOptions = feeAssignments.map((row) => row.student);
export const assignmentStatusOptions: AssignStatus[] = [
  'Assigned', 'Pending', 'Partially Paid', 'Paid', 'Overdue', 'Cancelled',
];
export const paymentStatusOptions = ['Paid', 'Partially Paid', 'Pending', 'Overdue'];
