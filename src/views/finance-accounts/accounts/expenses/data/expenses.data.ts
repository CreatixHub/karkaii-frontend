export type ExpenseStatus = 'Pending' | 'In Review' | 'Approved' | 'Reimbursed' | 'Rejected';
export type ExpensePriority = 'High' | 'Medium' | 'Low';

export interface DiscussionEntry {
  author: string;
  /** "Employee" on the claimant's own messages; blank for staff roles. */
  role: string;
  timestamp: string;
  message: string;
  avatar: string | null;
}

export interface Expense {
  id: string;
  expenseId: string;
  title: string;
  amount: number;
  employee: string;
  employeeId: string;
  designation: string;
  department: string;
  category: string;
  categoryTint: string;
  expenseDate: string;
  submittedDate: string;
  vendor: string;
  method: string;
  reference: string;
  description: string;
  receipts: number;
  avatar: string;
  status: ExpenseStatus;
  priority: ExpensePriority;
  discussion: DiscussionEntry[];
}

export const statusPill: Record<ExpenseStatus, string> = {
  Pending: 'is-pending',
  'In Review': 'is-new',
  Approved: 'is-active',
  Reimbursed: 'is-completed',
  Rejected: 'is-blocked',
};

export const statusIcon: Record<ExpenseStatus, string> = {
  Pending: 'ti ti-clock',
  'In Review': 'ti ti-eye-search',
  Approved: 'ti ti-circle-check',
  Reimbursed: 'ti ti-wallet',
  Rejected: 'ti ti-circle-x',
};

export const statusBadge: Record<ExpenseStatus, string> = {
  Pending: 'badge badge-soft-warning',
  'In Review': 'badge badge-soft-info',
  Approved: 'badge badge-soft-success',
  Reimbursed: 'badge badge-soft-primary',
  Rejected: 'badge badge-soft-danger',
};

export const priorityBadge: Record<ExpensePriority, string> = {
  High: 'badge badge-soft-danger',
  Medium: 'badge badge-soft-warning',
  Low: 'badge badge-soft-secondary',
};

/** `pri-high` / `pri-medium` / `pri-low` on the queue card. */
export const priorityClass: Record<ExpensePriority, string> = {
  High: 'pri-high',
  Medium: 'pri-medium',
  Low: 'pri-low',
};

export const categoryTint: Record<string, string> = {
  Travel: 'primary',
  Supplies: 'info',
  Utilities: 'warning',
  Maintenance: 'teal',
  Events: 'purple',
  Training: 'success',
  Food: 'pink',
};

/** Only the first expense carries a thread in the template. */
const firstThread: DiscussionEntry[] = [
  {
    author: 'Finance Office', role: '', timestamp: '20 Jul 2026 · 03:12 PM',
    message: 'Please attach the toll receipts for the return trip before we proceed with the reimbursement.',
    avatar: null,
  },
  {
    author: 'Reporting Manager', role: '', timestamp: '20 Jul 2026 · 04:40 PM',
    message: 'Trip was pre-approved. Recommending approval once the toll receipt is uploaded.',
    avatar: null,
  },
  {
    author: 'Daniel Josua', role: 'Employee', timestamp: '21 Jul 2026 · 09:05 AM',
    message: 'Uploaded the toll receipt just now. Please review. Thank you.',
    avatar: 'assets/img/profiles/avatar-02.jpg',
  },
];

export const expenses: Expense[] = [
  { id: 'EXP-4101', expenseId: 'EXP-4101', title: 'Science Fair Travel Reimbursement', amount: 420, employee: 'Daniel Josua', employeeId: 'STF-2002', designation: 'Accountant', department: 'Accounts', category: 'Travel', categoryTint: 'primary', expenseDate: '18 Jul 2026', submittedDate: '20 Jul 2026', vendor: 'City Cabs', method: 'Bank Transfer', reference: 'REF-77801', description: 'Round-trip travel and local transport for accompanying students to the regional science fair.', receipts: 2, avatar: 'assets/img/profiles/avatar-02.jpg', status: 'Pending', priority: 'High', discussion: firstThread },
  { id: 'EXP-4102', expenseId: 'EXP-4102', title: 'Library Books Purchase', amount: 860, employee: 'Emily Clark', employeeId: 'STF-2003', designation: 'Librarian', department: 'Library', category: 'Supplies', categoryTint: 'info', expenseDate: '15 Jul 2026', submittedDate: '16 Jul 2026', vendor: 'Readwell Distributors', method: 'Cheque', reference: 'REF-77802', description: 'Purchase of 40 reference titles and periodicals for the senior section library.', receipts: 3, avatar: 'assets/img/profiles/avatar-03.jpg', status: 'In Review', priority: 'Medium', discussion: [] },
  { id: 'EXP-4103', expenseId: 'EXP-4103', title: 'Electricity Bill — North Wing', amount: 1240, employee: 'Michael Scott', employeeId: 'STF-2006', designation: 'System Administrator', department: 'IT Support', category: 'Utilities', categoryTint: 'warning', expenseDate: '10 Jul 2026', submittedDate: '11 Jul 2026', vendor: 'State Power Board', method: 'Bank Transfer', reference: 'REF-77803', description: 'Monthly electricity charges for the North Wing campus block.', receipts: 1, avatar: 'assets/img/profiles/avatar-06.jpg', status: 'Approved', priority: 'High', discussion: [] },
  { id: 'EXP-4104', expenseId: 'EXP-4104', title: 'Projector Repair', amount: 180, employee: 'Jacob Ryan', employeeId: 'STF-2004', designation: 'Coordinator', department: 'Transport', category: 'Maintenance', categoryTint: 'teal', expenseDate: '08 Jul 2026', submittedDate: '09 Jul 2026', vendor: 'TechFix Services', method: 'Cash', reference: 'REF-77804', description: 'Lamp replacement and servicing for the auditorium projector unit.', receipts: 2, avatar: 'assets/img/profiles/avatar-04.jpg', status: 'Reimbursed', priority: 'Low', discussion: [] },
  { id: 'EXP-4105', expenseId: 'EXP-4105', title: 'Annual Day Decorations', amount: 640, employee: 'Sophia Miller', employeeId: 'STF-2005', designation: 'Receptionist', department: 'Front Office', category: 'Events', categoryTint: 'purple', expenseDate: '05 Jul 2026', submittedDate: '06 Jul 2026', vendor: 'Festive Décor Co.', method: 'Bank Transfer', reference: 'REF-77805', description: 'Stage backdrop, lighting and floral arrangements for the annual day function.', receipts: 2, avatar: 'assets/img/profiles/avatar-05.jpg', status: 'Rejected', priority: 'Medium', discussion: [] },
  { id: 'EXP-4106', expenseId: 'EXP-4106', title: 'Staff Training Workshop', amount: 1500, employee: 'Teresa Bru', employeeId: 'STF-2001', designation: 'Admin Officer', department: 'Administration', category: 'Training', categoryTint: 'success', expenseDate: '02 Jul 2026', submittedDate: '03 Jul 2026', vendor: 'EduSkills Academy', method: 'Bank Transfer', reference: 'REF-77806', description: 'Two-day classroom management and digital tools workshop for teaching staff.', receipts: 4, avatar: 'assets/img/profiles/avatar-01.jpg', status: 'In Review', priority: 'High', discussion: [] },
  { id: 'EXP-4107', expenseId: 'EXP-4107', title: 'Cafeteria Supplies', amount: 310, employee: 'Olivia Turner', employeeId: 'STF-2007', designation: 'Supervisor', department: 'Housekeeping', category: 'Food', categoryTint: 'pink', expenseDate: '28 Jun 2026', submittedDate: '29 Jun 2026', vendor: 'FreshMart Wholesale', method: 'Cash', reference: 'REF-77807', description: 'Monthly pantry and cafeteria consumable supplies restock.', receipts: 1, avatar: 'assets/img/profiles/avatar-07.jpg', status: 'Pending', priority: 'Low', discussion: [] },
  { id: 'EXP-4108', expenseId: 'EXP-4108', title: 'Sports Equipment', amount: 720, employee: 'William Adams', employeeId: 'STF-2008', designation: 'Cashier', department: 'Accounts', category: 'Supplies', categoryTint: 'info', expenseDate: '24 Jun 2026', submittedDate: '25 Jun 2026', vendor: 'ProSport Gear', method: 'Cheque', reference: 'REF-77808', description: 'Footballs, cones and training kits for the physical education department.', receipts: 2, avatar: 'assets/img/profiles/avatar-08.jpg', status: 'Approved', priority: 'Medium', discussion: [] },
];

/* -------------------------------- Derivations ------------------------------- */

export const money = (value: number): string => `$${value.toLocaleString('en-US')}`;

export interface ReceiptFile {
  name: string;
  icon: string;
  meta: string;
}

/**
 * The template alternates PDF and image placeholders and stamps each with the
 * expense's submitted date; the count comes from the queue card.
 */
export const receiptsOf = (row: Expense): ReceiptFile[] =>
  Array.from({ length: row.receipts }, (_, index) => {
    const isPdf = index % 2 === 0;
    return {
      name: `receipt-${index + 1}.${isPdf ? 'pdf' : 'jpg'}`,
      icon: isPdf ? 'ti ti-file-type-pdf' : 'ti ti-photo',
      meta: `${isPdf ? '248 KB' : '512 KB'} · ${row.submittedDate}`,
    };
  });

/** The five fixed stages of the template's approval timeline. */
export interface TimelineStep {
  title: string;
  meta: string;
  icon: string;
  done: boolean;
}

const stageOrder: ExpenseStatus[] = ['Pending', 'In Review', 'Approved', 'Reimbursed'];

export const timelineOf = (row: Expense): TimelineStep[] => {
  // Rejected claims stop after the manager review stage.
  const reached = row.status === 'Rejected' ? 1 : stageOrder.indexOf(row.status);
  return [
    { title: 'Expense Submitted', meta: `${row.employee} · ${row.submittedDate}`, icon: 'ti ti-file-text', done: true },
    { title: 'Manager Review', meta: 'Reporting Manager', icon: 'ti ti-user-check', done: reached >= 1 },
    { title: 'Finance Review', meta: 'Finance Office', icon: 'ti ti-calculator', done: reached >= 2 },
    { title: 'Approved', meta: 'Finance Head', icon: 'ti ti-circle-check', done: reached >= 2 },
    { title: 'Reimbursed', meta: 'Payment disbursed', icon: 'ti ti-wallet', done: reached >= 3 },
  ];
};

export const searchIndexOf = (row: Expense): string =>
  [row.title, row.employee, row.department, row.category, row.vendor, row.status]
    .join(' ')
    .toLowerCase();

/** The Date Range filter matches the expense month, e.g. "Jul 2026". */
export const expenseMonthOf = (row: Expense): string => row.expenseDate.slice(3);

/* --------------------------------- Options ---------------------------------- */

export const categoryOptions = ['Travel', 'Supplies', 'Utilities', 'Maintenance', 'Events', 'Training', 'Food'];
export const departmentOptions = [
  'Accounts', 'Library', 'IT Support', 'Transport', 'Front Office', 'Administration', 'Housekeeping',
];
export const ownerOptions = expenses.map((row) => row.employee);
export const statusOptions: ExpenseStatus[] = ['Pending', 'In Review', 'Approved', 'Reimbursed', 'Rejected'];
export const methodOptions = ['Bank Transfer', 'Cheque', 'Cash'];
export const dateRangeOptions = ['Jul 2026', 'Jun 2026'];
export const priorityOptions: ExpensePriority[] = ['High', 'Medium', 'Low'];
