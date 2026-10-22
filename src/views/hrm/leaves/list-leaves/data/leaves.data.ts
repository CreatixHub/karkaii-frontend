export type LeaveStatus = 'Approved' | 'Pending' | 'Forwarded' | 'Rejected' | 'Cancelled';

export interface LeaveRequest {
  id: string;
  staffId: string;
  name: string;
  avatar: string;
  department: string;
  designation: string;
  leaveType: string;
  /** Per-row badge tint, as the template painted it. */
  tint: string;
  days: number;
  from: string;
  to: string;
  applied: string;
  approver: string;
  status: LeaveStatus;
  hasAttachment: boolean;
  branch: string;
  reason: string;
}

export const statusPill: Record<LeaveStatus, string> = {
  Approved: 'is-active',
  Pending: 'is-pending',
  Forwarded: 'is-new',
  Rejected: 'is-emergency',
  Cancelled: 'is-inactive',
};

export const statusBadge: Record<LeaveStatus, string> = {
  Approved: 'badge badge-soft-success',
  Pending: 'badge badge-soft-warning',
  Forwarded: 'badge badge-soft-info',
  Rejected: 'badge badge-soft-danger',
  Cancelled: 'badge badge-soft-secondary',
};

const R = (
  id: string,
  name: string,
  avatar: string,
  department: string,
  designation: string,
  leaveType: string,
  tint: string,
  days: number,
  from: string,
  to: string,
  applied: string,
  approver: string,
  status: LeaveStatus,
  hasAttachment: boolean,
  branch: string,
  reason: string,
): LeaveRequest => ({
  id: `LV-${id}`,
  staffId: `STF-${id}`,
  name,
  avatar: `assets/img/profiles/${avatar}`,
  department,
  designation,
  leaveType,
  tint,
  days,
  from,
  to,
  applied,
  approver,
  status,
  hasAttachment,
  branch,
  reason,
});

export const leaveRequests: LeaveRequest[] = [
  R('2001', 'Teresa Bru', 'avatar-01.jpg', 'Administration', 'Admin Officer', 'Casual Leave', 'primary', 2, '18 Jul 2026', '19 Jul 2026', '12 Jul 2026', 'Principal Office', 'Approved', true, 'Main Campus', 'Personal work at home.'),
  R('2002', 'Daniel Josua', 'avatar-02.jpg', 'Accounts', 'Accountant', 'Sick Leave', 'info', 3, '21 Jul 2026', '23 Jul 2026', '20 Jul 2026', 'Finance Head', 'Pending', true, 'Main Campus', 'Viral fever, advised rest.'),
  R('2003', 'Emily Clark', 'avatar-03.jpg', 'Library', 'Librarian', 'Earned Leave', 'success', 5, '01 Aug 2026', '05 Aug 2026', '15 Jul 2026', 'Academic Head', 'Approved', false, 'North Wing', 'Annual family holiday.'),
  R('2004', 'Jacob Ryan', 'avatar-04.jpg', 'Transport', 'Transport Coordinator', 'Casual Leave', 'warning', 1, '10 Jul 2026', '10 Jul 2026', '08 Jul 2026', 'Operations Head', 'Forwarded', false, 'Main Campus', 'Attending a family function.'),
  R('2005', 'Sophia Miller', 'avatar-05.jpg', 'Front Office', 'Receptionist', 'Maternity Leave', 'purple', 90, '01 Sep 2026', '30 Nov 2026', '01 Jul 2026', 'HR Head', 'Approved', true, 'Main Campus', 'Statutory maternity leave.'),
  R('2006', 'Michael Scott', 'avatar-06.jpg', 'IT Support', 'System Administrator', 'Sick Leave', 'teal', 2, '14 Jul 2026', '15 Jul 2026', '14 Jul 2026', 'IT Head', 'Pending', true, 'North Wing', 'Migraine, unable to attend.'),
  R('2007', 'Olivia Turner', 'avatar-07.jpg', 'Housekeeping', 'Supervisor', 'Casual Leave', 'pink', 2, '05 Jul 2026', '06 Jul 2026', '02 Jul 2026', 'Operations Head', 'Rejected', false, 'South Wing', 'Short notice, cover unavailable.'),
  R('2008', 'William Adams', 'avatar-08.jpg', 'Accounts', 'Cashier', 'Earned Leave', 'secondary', 5, '20 Aug 2026', '24 Aug 2026', '10 Jul 2026', 'Finance Head', 'Approved', false, 'Main Campus', 'Planned personal travel.'),
  R('2009', 'Ava Robinson', 'avatar-09.jpg', 'Administration', 'Clerk', 'Sick Leave', 'danger', 1, '22 Jul 2026', '22 Jul 2026', '22 Jul 2026', 'Admin Officer', 'Pending', true, 'Main Campus', 'Unwell, same-day intimation.'),
  R('2010', 'Ethan Wright', 'avatar-10.jpg', 'Security', 'Security Head', 'Casual Leave', 'secondary', 2, '28 Jun 2026', '29 Jun 2026', '25 Jun 2026', 'Operations Head', 'Cancelled', false, 'South Wing', 'Withdrawn by the employee.'),
];

/* -------------------------------- Balances --------------------------------- */

export interface BalanceRow {
  type: string;
  total: number;
  used: number;
}

/** The leave-balance table inside each row's detail panel. */
export const balancesFor = (row: LeaveRequest): BalanceRow[] => [
  { type: 'Casual Leave', total: 12, used: row.leaveType === 'Casual Leave' ? row.days : 4 },
  { type: 'Sick Leave', total: 10, used: row.leaveType === 'Sick Leave' ? row.days : 2 },
  { type: 'Earned Leave', total: 18, used: row.leaveType === 'Earned Leave' ? row.days : 6 },
];

export const historyFor = (row: LeaveRequest) => [
  { type: row.leaveType, from: row.from, to: row.to, days: row.days, approver: row.approver, status: row.status },
  { type: 'Casual Leave', from: '02 May 2026', to: '02 May 2026', days: 1, approver: row.approver, status: 'Approved' as LeaveStatus },
  { type: 'Sick Leave', from: '18 Mar 2026', to: '19 Mar 2026', days: 2, approver: row.approver, status: 'Approved' as LeaveStatus },
];

/* -------------------------------- Workspace -------------------------------- */

export interface FilterField {
  id: string;
  label: string;
  kind: 'select' | 'date';
  options?: string[];
}

export const filterFields: FilterField[] = [
  { id: 'employee', label: 'Employee', kind: 'select', options: leaveRequests.map((row) => row.name) },
  { id: 'department', label: 'Department', kind: 'select', options: ['Administration', 'Accounts', 'Library', 'Transport', 'Front Office', 'IT Support', 'Housekeeping', 'Security'] },
  { id: 'leave-type', label: 'Leave Type', kind: 'select', options: ['Casual Leave', 'Sick Leave', 'Earned Leave', 'Maternity Leave'] },
  { id: 'leave-status', label: 'Leave Status', kind: 'select', options: ['Approved', 'Pending', 'Forwarded', 'Rejected', 'Cancelled'] },
  { id: 'approval-status', label: 'Approval Status', kind: 'select', options: ['Approved', 'Awaiting Approval', 'Rejected'] },
  { id: 'branch', label: 'Branch', kind: 'select', options: ['Main Campus', 'North Wing', 'South Wing'] },
  { id: 'from-date', label: 'From Date', kind: 'date' },
  { id: 'to-date', label: 'To Date', kind: 'date' },
];

export const filterChipLabels: Record<string, string> = {
  employee: 'Employee',
  department: 'Dept',
  'leave-type': 'Type',
  'leave-status': 'Status',
  'approval-status': 'Approval',
  branch: 'Branch',
  'from-date': 'From',
  'to-date': 'To',
};

export const filterChipTone: Record<string, string> = {
  employee: 'info',
  department: 'info',
  'leave-type': 'info',
  'leave-status': 'success',
  'approval-status': 'success',
  branch: 'info',
  'from-date': 'primary',
  'to-date': 'primary',
};

/** Approval status is not stored separately; it follows the leave status. */
export const approvalStatusOf = (status: LeaveStatus): string => {
  if (status === 'Approved') return 'Approved';
  if (status === 'Rejected' || status === 'Cancelled') return 'Rejected';
  return 'Awaiting Approval';
};

export const leaveTypeOptions = ['Casual Leave', 'Sick Leave', 'Earned Leave', 'Maternity Leave'];

export type SortKey = 'employee' | 'applied' | 'days';

export const sortOptions: { id: SortKey; label: string; icon: string }[] = [
  { id: 'employee', label: 'Employee (A–Z)', icon: 'ti ti-abc' },
  { id: 'applied', label: 'Applied Date', icon: 'ti ti-calendar' },
  { id: 'days', label: 'Duration', icon: 'ti ti-sum' },
];

export type SavedViewId = 'all' | 'pending' | 'approved';

export const savedViews: { id: SavedViewId; label: string; icon: string }[] = [
  { id: 'all', label: 'All Leaves', icon: 'ti ti-list' },
  { id: 'pending', label: 'Pending Approval', icon: 'ti ti-clock' },
  { id: 'approved', label: 'Approved Leaves', icon: 'ti ti-circle-check' },
];

export type BulkActionId = 'approve' | 'reject' | 'export' | 'print';

export const bulkActions: { id: BulkActionId; label: string; icon: string }[] = [
  { id: 'approve', label: 'Approve Selected', icon: 'ti ti-circle-check' },
  { id: 'reject', label: 'Reject Selected', icon: 'ti ti-circle-x' },
  { id: 'export', label: 'Export Selected', icon: 'ti ti-file-export' },
  { id: 'print', label: 'Print', icon: 'ti ti-printer' },
];

/** Header tiles, derived from the roster rather than hard-coded. */
export const summaryOf = (rows: LeaveRequest[]) => [
  { id: 'total', tint: 'bg-primary-transparent text-primary', icon: 'ti ti-calendar-stats', label: 'Total Requests', value: String(rows.length) },
  { id: 'approved', tint: 'bg-success-transparent text-success', icon: 'ti ti-circle-check', label: 'Approved', value: String(rows.filter((r) => r.status === 'Approved').length) },
  { id: 'pending', tint: 'bg-warning-transparent text-warning', icon: 'ti ti-clock', label: 'Pending', value: String(rows.filter((r) => r.status === 'Pending').length) },
  { id: 'rejected', tint: 'bg-danger-transparent text-danger', icon: 'ti ti-circle-x', label: 'Rejected', value: String(rows.filter((r) => r.status === 'Rejected').length) },
  { id: 'days', tint: 'bg-info-transparent text-info', icon: 'ti ti-sum', label: 'Leave Days', value: String(rows.reduce((total, r) => total + r.days, 0)) },
];
