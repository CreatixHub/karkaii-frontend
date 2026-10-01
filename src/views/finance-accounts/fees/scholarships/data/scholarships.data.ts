export type ApprovalStatus =
  | 'Approved'
  | 'Pending'
  | 'Under Review'
  | 'Rejected'
  | 'Renewal Due'
  | 'Expired';

export interface Scholarship {
  id: string;
  scholarshipId: string;
  student: string;
  avatar: string;
  admissionNo: string;
  className: string;
  name: string;
  type: string;
  typeTint: string;
  /** "100%", "$1,200", "Full Waiver" — the template's own wording. */
  coverage: string;
  amount: number;
  academicYear: string;
  status: ApprovalStatus;
  /** Em dash on the rejected row. */
  effectiveFrom: string;
  lastUpdated: string;
  renewalStatus: string;
  sponsor: string;
  notes: string;
}

export const statusPill: Record<ApprovalStatus, string> = {
  Approved: 'is-active',
  Pending: 'is-pending',
  'Under Review': 'is-review',
  Rejected: 'is-blocked',
  'Renewal Due': 'is-suspended',
  Expired: 'is-inactive',
};

export const statusBadge: Record<ApprovalStatus, string> = {
  Approved: 'badge badge-soft-success',
  Pending: 'badge badge-soft-warning',
  'Under Review': 'badge badge-soft-info',
  Rejected: 'badge badge-soft-danger',
  'Renewal Due': 'badge badge-soft-secondary',
  Expired: 'badge badge-soft-dark',
};

export const scholarships: Scholarship[] = [
  { id: 'SCH-2026-0118', scholarshipId: 'SCH-2026-0118', student: 'Janet Daniel', avatar: 'assets/img/students/student-01.jpg', admissionNo: 'AD9892434', className: 'III A', name: 'Merit Scholarship', type: 'Merit', typeTint: 'primary', coverage: '100%', amount: 1850, academicYear: '2026 / 2027', status: 'Approved', effectiveFrom: '01 Jun 2026', lastUpdated: '24 Jul 2026', renewalStatus: 'Eligible', sponsor: 'School Trust', notes: 'Top rank in the Term I assessment; full tuition waiver granted.' },
  { id: 'SCH-2026-0117', scholarshipId: 'SCH-2026-0117', student: 'Joann Michael', avatar: 'assets/img/students/student-02.jpg', admissionNo: 'AD9892433', className: 'IV B', name: 'Sports Scholarship', type: 'Sports', typeTint: 'success', coverage: '50%', amount: 780, academicYear: '2026 / 2027', status: 'Pending', effectiveFrom: '01 Jul 2026', lastUpdated: '26 Jul 2026', renewalStatus: 'Review pending', sponsor: 'Sports Council', notes: 'State-level selection; awaiting the sports committee sign-off.' },
  { id: 'SCH-2026-0115', scholarshipId: 'SCH-2026-0115', student: 'Kathleen Dison', avatar: 'assets/img/students/student-03.jpg', admissionNo: 'AD9892432', className: 'III A', name: 'Need-Based Scholarship', type: 'Need-Based', typeTint: 'warning', coverage: '$1,200', amount: 1200, academicYear: '2026 / 2027', status: 'Approved', effectiveFrom: '01 Jun 2026', lastUpdated: '18 Jul 2026', renewalStatus: 'Eligible', sponsor: 'Welfare Fund', notes: 'Income certificate verified; concession applied to the Term II invoice.' },
  { id: 'SCH-2026-0112', scholarshipId: 'SCH-2026-0112', student: 'Lisa Gourley', avatar: 'assets/img/students/student-04.jpg', admissionNo: 'AD9892431', className: 'II B', name: 'Government Scholarship', type: 'Government', typeTint: 'info', coverage: 'Full Waiver', amount: 2400, academicYear: '2026 / 2027', status: 'Approved', effectiveFrom: '15 Jun 2026', lastUpdated: '20 Jul 2026', renewalStatus: 'Eligible', sponsor: 'State Education Board', notes: 'State scheme; reimbursement claimed quarterly from the board.' },
  { id: 'SCH-2026-0109', scholarshipId: 'SCH-2026-0109', student: 'Ralph Claudia', avatar: 'assets/img/students/student-05.jpg', admissionNo: 'AD9892430', className: 'V A', name: 'Management Scholarship', type: 'Management', typeTint: 'purple', coverage: '25%', amount: 460, academicYear: '2026 / 2027', status: 'Under Review', effectiveFrom: '01 Aug 2026', lastUpdated: '28 Jul 2026', renewalStatus: 'Review pending', sponsor: 'Management Quota', notes: 'Referred to the principal office for the final concession percentage.' },
  { id: 'SCH-2026-0104', scholarshipId: 'SCH-2026-0104', student: 'Julie Scott', avatar: 'assets/img/students/student-06.jpg', admissionNo: 'AD9892429', className: 'VI A', name: 'Alumni Scholarship', type: 'Alumni', typeTint: 'pink', coverage: '$600', amount: 600, academicYear: '2026 / 2027', status: 'Rejected', effectiveFrom: '—', lastUpdated: '12 Jul 2026', renewalStatus: 'Ineligible', sponsor: 'Alumni Association', notes: 'Application did not meet the minimum attendance criterion.' },
  { id: 'SCH-2025-0098', scholarshipId: 'SCH-2025-0098', student: 'Susan Boswell', avatar: 'assets/img/students/student-07.jpg', admissionNo: 'AD9892428', className: 'IV A', name: 'Merit Scholarship', type: 'Merit', typeTint: 'primary', coverage: '75%', amount: 1320, academicYear: '2025 / 2026', status: 'Renewal Due', effectiveFrom: '01 Jun 2025', lastUpdated: '29 Jul 2026', renewalStatus: 'Action required', sponsor: 'School Trust', notes: 'Renewal window open; Term II results pending before re-approval.' },
  { id: 'SCH-2025-0091', scholarshipId: 'SCH-2025-0091', student: 'Richard Soley', avatar: 'assets/img/students/student-08.jpg', admissionNo: 'AD9892427', className: 'V B', name: 'Special Scholarship', type: 'Special', typeTint: 'secondary', coverage: '40%', amount: 540, academicYear: '2025 / 2026', status: 'Expired', effectiveFrom: '01 Jun 2025', lastUpdated: '30 Jun 2026', renewalStatus: 'Ineligible', sponsor: 'School Trust', notes: 'Lapsed at the end of the 2025 / 2026 session; not renewed.' },
];

export const money = (value: number): string => `$${value.toLocaleString('en-US')}`;

/** Buckets the mixed coverage strings back into the template's filter options. */
export const coverageBand = (row: Scholarship): string => {
  if (row.coverage.startsWith('$')) return 'Fixed amount';
  if (/full/i.test(row.coverage)) return 'Full waiver';
  const percent = Number(row.coverage.replace('%', ''));
  if (Number.isNaN(percent)) return 'Fixed amount';
  if (percent === 100) return 'Full waiver';
  if (percent >= 75) return '75% and above';
  if (percent >= 50) return '50% – 74%';
  return 'Under 50%';
};

export interface ScholarshipProgram {
  id: string;
  label: string;
  icon: string;
  tint: string;
  /** School-wide count from the template, spanning 134 awards not the eight shown. */
  summary: string;
}

export const programmes: ScholarshipProgram[] = [
  { id: 'Merit', label: 'Merit Scholarship', icon: 'ti ti-award', tint: 'primary', summary: '42 awarded' },
  { id: 'Sports', label: 'Sports Scholarship', icon: 'ti ti-run', tint: 'success', summary: '18 awarded' },
  { id: 'Need-Based', label: 'Need-Based Scholarship', icon: 'ti ti-heart-handshake', tint: 'warning', summary: '31 awarded' },
  { id: 'Government', label: 'Government Scholarship', icon: 'ti ti-building-bank', tint: 'info', summary: '24 awarded' },
  { id: 'Management', label: 'Management Scholarship', icon: 'ti ti-briefcase', tint: 'purple', summary: '9 awarded' },
  { id: 'Alumni', label: 'Alumni Scholarship', icon: 'ti ti-users-group', tint: 'pink', summary: '6 awarded' },
  { id: 'Special', label: 'Special Scholarship', icon: 'ti ti-star', tint: 'secondary', summary: '4 awarded' },
];
