export type AllocationStatus =
  | 'Active' | 'Returned' | 'Pending Return' | 'Overdue Return' | 'Damage Reported';

export type AssigneeType = 'Staff' | 'Teacher' | 'Student' | 'Department' | 'Classroom';

export type Condition = 'Excellent' | 'Good' | 'Fair' | 'Poor';

export type Category =
  | 'IT Equipment' | 'Lab Equipment' | 'Furniture' | 'Vehicle'
  | 'Office Equipment' | 'Kitchen Equipment' | 'Sports Equipment';

export type Department =
  | 'Academic' | 'Science' | 'Administration' | 'Library' | 'Hostel' | 'Transport' | 'Cafeteria';

/** Whoever holds the asset — a person carries a photo, a room or unit an icon. */
export interface Assignee {
  name: string;
  /** "Assistant Warden · EMP-2021-046" or "34 students · practical sessions". */
  reference: string;
  type: AssigneeType;
  avatar?: string;
  icon?: string;
  tint?: string;
}

export interface HistoryEntry {
  title: string;
  meta: string;
}

export interface AllocationDocument {
  name: string;
  meta: string;
}

/** Filed against an allocation; its presence is what sets the status. */
export interface DamageReport {
  type: string;
  severity: string;
  reportedOn: string;
  reference: string;
  estimate: number;
  liability: string;
}

export interface Allocation {
  id: string;
  assetId: string;
  assetName: string;
  /** Tabler icon for the asset cell; the tint follows the category. */
  icon: string;
  model: string;
  serial: string;
  /** How many pieces this allocation covers. */
  units: number;
  /** The asset's full holding, when the allocation is only part of it. */
  totalUnits?: number;
  /** "unit" on most rows; the sports kit counts in pieces. */
  unitNoun?: string;
  category: Category;

  assignee: Assignee;
  department: Department;
  location: string;
  /** "Room 204", "Lab 1", "Block B". */
  spot: string;

  /** "12 Apr 2023" — when the asset went out. */
  allocatedOn: string;
  /** Empty on a permanent allocation, which is what the template prints. */
  expectedReturn: string;
  /** Empty until the asset comes back. */
  actualReturn: string;
  condition: Condition;
  /** Filed damage, which overrides the date-driven status. */
  damage: DamageReport | null;

  history: HistoryEntry[];
  conditionNote: string;
  requestedBy: string;
  approvedBy: string;
  approvedOn: string;
  requestRef: string;
  approvalRoute: string;
  documents: AllocationDocument[];
  notes: string;

  /** The panel's own two lines. */
  lastVerified: string;
  nextVerification: string;
}

/* --------------------------------- Tints ----------------------------------- */

export const categoryTint: Record<Category, string> = {
  'IT Equipment': 'primary',
  'Lab Equipment': 'info',
  Furniture: 'purple',
  Vehicle: 'warning',
  'Office Equipment': 'secondary',
  'Kitchen Equipment': 'success',
  'Sports Equipment': 'warning',
};

/**
 * The template tints Academic two ways across its rows — success on the smart
 * board and the sports kit, primary on the student loan. One map settles it.
 */
export const departmentTint: Record<Department, string> = {
  Academic: 'success',
  Science: 'purple',
  Administration: 'success',
  Library: 'success',
  Hostel: 'info',
  Transport: 'warning',
  Cafeteria: 'info',
};

export const conditionTint: Record<Condition, string> = {
  Excellent: 'success',
  Good: 'primary',
  Fair: 'warning',
  Poor: 'danger',
};

export const statusPill: Record<AllocationStatus, string> = {
  Active: 'is-active',
  Returned: 'is-completed',
  'Pending Return': 'is-pending',
  'Overdue Return': 'is-blocked',
  'Damage Reported': 'is-review',
};

export const statusBadge: Record<AllocationStatus, string> = {
  Active: 'badge badge-soft-success',
  Returned: 'badge badge-soft-secondary',
  'Pending Return': 'badge badge-soft-warning',
  'Overdue Return': 'badge badge-soft-danger',
  'Damage Reported': 'badge badge-soft-info',
};

export const typeBadge: Record<AssigneeType, string> = {
  Staff: 'badge badge-soft-primary',
  Teacher: 'badge badge-soft-primary',
  Student: 'badge badge-soft-info',
  Department: 'badge badge-soft-success',
  Classroom: 'badge badge-soft-purple',
};

/* ------------------------------ Filter options ------------------------------ */

export const categoryOptions: Category[] = [
  'IT Equipment', 'Lab Equipment', 'Furniture', 'Vehicle',
  'Office Equipment', 'Kitchen Equipment', 'Sports Equipment',
];

export const allocateToOptions: AssigneeType[] = [
  'Staff', 'Teacher', 'Student', 'Department', 'Classroom',
];

export const departmentOptions: Department[] = [
  'Academic', 'Science', 'Administration', 'Library', 'Hostel', 'Transport', 'Cafeteria',
];

export const statusOptions: AllocationStatus[] = [
  'Active', 'Returned', 'Pending Return', 'Overdue Return', 'Damage Reported',
];

export const conditionOptions: Condition[] = ['Excellent', 'Good', 'Fair', 'Poor'];

export const returnDueOptions = [
  'Overdue', 'Due within 7 days', 'Due within 30 days', 'No return date',
];

/* --------------------------- Dialog option lists ----------------------------- */

export const assetChoices = [
  'Interactive Smart Board 75" · AST-2026-0142',
  'Dell Latitude 5540 Laptop · AST-2026-0155',
  'Hostel Bunk Bed Set · AST-2026-0161',
  'Student Loan Chromebook · AST-2026-0182',
  'Sports Equipment Kit · AST-2026-0195',
];

export const assigneeChoices = [
  'Ms. Priya Raman · Staff',
  'Mrs. Alice Ray · Staff',
  'Mr. Ethan Brooks · Staff',
  'Lisa Gourley · Student · II B',
  'Class VI A · Classroom',
  'Everest Hostel · Department',
];

export const locationOptions = [
  'Main Block', 'Science Block', 'Library', 'Nightingale Hostel', 'Everest Hostel', 'Sports Ground',
];

export const approverOptions = [
  'Estates Manager', 'Department Head', 'Hostel Director', 'Sports Coordinator',
];

export const receivedByOptions = ['Estates Office', 'Library Desk', 'Department Head'];

export const returnToOptions = ['Main Block · Store', 'Original department', 'Repair queue'];

export const transferToOptions = [
  'Mr. David Kim · Staff', 'Ms. Priya Raman · Staff', 'Hostel Department', 'Main Block · Store',
];

export const newLocationOptions = [
  'Everest Hostel · Warden Office', 'Nightingale Hostel · Warden Office', 'Main Block · Store',
];

export const transferReasonOptions = [
  'Role change', 'Department restructure', 'Equipment rebalancing', 'Replacement issued',
];

export const damageTypeOptions = [
  'Mechanical failure', 'Physical damage', 'Water damage', 'Missing parts', 'Wear beyond use',
];

export const severityOptions = ['Critical · unusable', 'Major · degraded', 'Minor · cosmetic'];

export const liabilityOptions = [
  'School · fair wear and tear', 'Assignee · recoverable', 'Vendor · under warranty', 'Under review',
];

/* ------------------------------- Derivations -------------------------------- */

export const DASH = '—';

/** The day the template was captured; every "days" figure counts to it. */
export const REGISTER_DATE = '31 Jul 2026';

export const money = (value: number): string =>
  `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** Sortable key for the template's "12 Apr 2023" dates. */
export const dateKey = (value: string): number => {
  const [day, month, year] = value.split(' ');
  const index = months.indexOf(month);
  if (index === -1) return 0;
  return Number(year) * 10000 + (index + 1) * 100 + Number(day);
};

/** Days since the epoch, so two dates can simply be subtracted. */
const dayNumber = (value: string): number => {
  const [day, month, year] = value.split(' ');
  const index = months.indexOf(month);
  if (index === -1) return 0;
  return Math.round(Date.UTC(Number(year), index, Number(day)) / 86_400_000);
};

/** Whole days between two of the template's dates. */
export const daysBetween = (from: string, to: string): number =>
  dayNumber(to) - dayNumber(from);

/** Issue to return, or issue to today while the asset is still out. */
export const heldForOf = (row: Allocation): number =>
  Math.max(0, daysBetween(row.allocatedOn, row.actualReturn || REGISTER_DATE));

/** Negative once the return date has passed; zero on a permanent allocation. */
export const daysUntilDueOf = (row: Allocation): number =>
  row.expectedReturn ? daysBetween(REGISTER_DATE, row.expectedReturn) : 0;

export const daysOverdueOf = (row: Allocation): number =>
  row.actualReturn || !row.expectedReturn ? 0 : Math.max(0, -daysUntilDueOf(row));

/**
 * The status the pill prints. Every branch reads off the three dates and the
 * damage report, so the pill cannot contradict the Expected Return column.
 */
export const statusOf = (row: Allocation): AllocationStatus => {
  if (row.actualReturn) return 'Returned';
  if (row.damage) return 'Damage Reported';
  if (!row.expectedReturn) return 'Active';
  const days = daysUntilDueOf(row);
  if (days < 0) return 'Overdue Return';
  return days <= 30 ? 'Pending Return' : 'Active';
};

/** The second line under Expected Return. */
export const dueLabelOf = (row: Allocation): string => {
  if (row.actualReturn) return `Returned ${row.actualReturn}`;
  if (!row.expectedReturn) return 'Permanent allocation';
  const days = daysUntilDueOf(row);
  if (days < 0) return `${-days} days overdue`;
  if (days === 0) return 'Due today';
  return `Due in ${days} days`;
};

/** The tint that line carries. */
export const dueTintOf = (row: Allocation): string => {
  if (row.actualReturn) return 'text-success';
  if (!row.expectedReturn) return 'text-muted';
  const days = daysUntilDueOf(row);
  if (days < 0) return 'text-danger';
  return days <= 30 ? 'text-warning' : 'text-muted';
};

/** The date the condition was last looked at. */
export const checkedOnOf = (row: Allocation): string => row.actualReturn || REGISTER_DATE;

/** "4 of 20 units", "40 pieces", "1 unit". */
export const unitLineOf = (row: Allocation): string => {
  const noun = row.unitNoun ?? 'unit';
  if (row.totalUnits && row.totalUnits !== row.units) {
    return `${row.units} of ${row.totalUnits} ${noun}s`;
  }
  return `${row.units} ${noun}${row.units === 1 ? '' : 's'}`;
};

/** "ViewPro VB-750 · 1 unit" — the line under the asset name. */
export const assetLineOf = (row: Allocation): string => `${row.model} · ${unitLineOf(row)}`;

/** "Main Block · Room 204". */
export const placeOf = (row: Allocation): string => `${row.location} · ${row.spot}`;

/** "1,206 days" — the View dialog's own tile. */
export const heldLabelOf = (row: Allocation): string =>
  `${heldForOf(row).toLocaleString('en-US')} days`;

export const expectedLabelOf = (row: Allocation): string => row.expectedReturn || 'No return date';

export const returnedLabelOf = (row: Allocation): string => row.actualReturn || 'Not returned';

/** Verified on receipt, or still to be looked at. */
export const returnConditionOf = (row: Allocation): string =>
  row.actualReturn ? row.condition : 'To be verified';

export interface Pair {
  label: string;
  value: string;
}

export const assetPairsOf = (row: Allocation): Pair[] => [
  { label: 'Asset ID', value: row.assetId },
  { label: 'Asset', value: assetLineOf(row) },
  { label: 'Category', value: row.category },
  { label: 'Home Location', value: placeOf(row) },
  { label: 'Allocation ID', value: row.id },
];

export const assigneePairsOf = (row: Allocation): Pair[] => [
  { label: 'Assignee', value: row.assignee.name },
  { label: 'Type', value: row.assignee.type },
  { label: 'Reference', value: row.assignee.reference },
  { label: 'Department / Class', value: row.department },
  { label: 'Location', value: placeOf(row) },
];

export const returnPairsOf = (row: Allocation): Pair[] => [
  { label: 'Allocated On', value: row.allocatedOn },
  { label: 'Expected Return', value: expectedLabelOf(row) },
  { label: 'Actual Return', value: returnedLabelOf(row) },
  { label: 'Held For', value: heldLabelOf(row) },
  { label: 'Return Condition', value: returnConditionOf(row) },
];

export const approvalPairsOf = (row: Allocation): Pair[] => [
  { label: 'Requested By', value: row.requestedBy },
  { label: 'Approved By', value: row.approvedBy },
  { label: 'Approved On', value: row.approvedOn },
  { label: 'Request Ref', value: row.requestRef },
  { label: 'Approval Route', value: row.approvalRoute },
];

/** The View dialog's left block. */
export const detailPairsOf = (row: Allocation): Pair[] => [
  { label: 'Allocated Date', value: row.allocatedOn },
  { label: 'Expected Return', value: expectedLabelOf(row) },
  { label: 'Department', value: row.department },
  { label: 'Units', value: unitLineOf(row) },
];

export const viewApprovalPairsOf = (row: Allocation): Pair[] => [
  { label: 'Approved By', value: row.approvedBy },
  { label: 'Approved On', value: row.approvedOn },
  { label: 'Request Ref', value: row.requestRef },
  { label: 'Handover Form', value: row.documents.some((d) => /signed/i.test(d.meta)) ? 'Signed' : 'Not filed' },
];

/** The panel's asset block. */
export const panelAssetPairsOf = (row: Allocation): Pair[] => [
  { label: 'Category', value: row.category },
  { label: 'Model', value: row.model },
  { label: 'Serial No', value: row.serial },
  { label: 'Units', value: unitLineOf(row) },
];

export const schedulePairsOf = (row: Allocation): Pair[] => [
  { label: 'Expected Return', value: expectedLabelOf(row) },
  { label: 'Allocation Type', value: row.expectedReturn ? 'Fixed term' : 'Permanent fixture' },
  { label: 'Next Verification', value: row.nextVerification },
  { label: 'Reminder', value: row.expectedReturn ? 'Enabled' : 'Not applicable' },
];

export const conditionPairsOf = (row: Allocation): Pair[] => [
  { label: 'Grade', value: row.condition },
  { label: 'Checked', value: checkedOnOf(row) },
  { label: 'Damage', value: row.damage ? `${row.damage.type} · ${row.damage.reference}` : 'None' },
];

export interface AuditEntry extends HistoryEntry {
  icon: string;
  tint: string;
}

/**
 * The panel's audit trail. The template opens it with the record's creation and
 * then repeats the allocation history, so it is built rather than stored — a
 * move reads as a transfer, a check as a verification.
 */
export const auditOf = (row: Allocation): AuditEntry[] => [
  {
    icon: 'ti ti-plus', tint: 'primary',
    title: 'Allocation record created', meta: `${row.allocatedOn} · Estates Office`,
  },
  ...row.history.map((entry) => ({
    ...entry,
    icon: /relocat|transfer|moved|custodian/i.test(entry.title) ? 'ti ti-transfer'
      : /return|verif|check/i.test(entry.title) ? 'ti ti-clipboard-check'
        : /damage/i.test(entry.title) ? 'ti ti-alert-triangle' : 'ti ti-clipboard-list',
    tint: /damage/i.test(entry.title) ? 'danger'
      : /return|verif|check/i.test(entry.title) ? 'success' : 'primary',
  })),
  {
    icon: 'ti ti-clipboard-check', tint: 'success',
    title: `Condition verified — ${row.condition}`,
    meta: `${row.lastVerified} · Estates Office`,
  },
];

/* --------------------------------- Filters ---------------------------------- */

/**
 * The Return Due bands overlap — anything due within seven days is also due
 * within thirty — so this is a predicate rather than one band per row.
 */
export const matchesReturnDue = (row: Allocation, band: string): boolean => {
  if (band === 'No return date') return !row.expectedReturn;
  if (!row.expectedReturn || row.actualReturn) return false;
  const days = daysUntilDueOf(row);
  if (band === 'Overdue') return days < 0;
  if (band === 'Due within 7 days') return days >= 0 && days <= 7;
  if (band === 'Due within 30 days') return days >= 0 && days <= 30;
  return true;
};

export const searchIndexOf = (row: Allocation): string =>
  [
    row.id, row.assetId, row.assetName, row.model, row.serial, row.category,
    row.assignee.name, row.assignee.reference, row.assignee.type, row.department,
    row.location, row.spot, row.requestRef, statusOf(row), row.condition,
  ]
    .join(' ')
    .toLowerCase();

/* --------------------------------- Summary ---------------------------------- */

/**
 * The strip counts the whole allocation register — 312 records against the eight
 * this page lists — so the template's figures stand and the roster moves them.
 */
export const SUMMARY_TOTALS = {
  total: 312,
  year: '2026 / 2027 to date',
  active: 218,
  returned: 78,
  averageHeld: 'avg. 21 days held',
  pending: 11,
  overdue: 5,
  oldestLate: 'oldest 18 days late',
};

export const VIEW_TOTALS = {
  all: 312,
  active: 218,
  overdue: 5,
  studentLoans: 46,
  damage: 7,
};

/**
 * The template renders one committed chip, "Academic Year: 2026 / 2027", but the
 * filter panel has no Academic Year field. The two fields it does pre-fill are
 * the date window — 01-01-2026 to 31-07-2026 — so those open committed here and
 * Reset clears them.
 */
export const ALLOCATED_FROM = '01-01-2026';
export const ALLOCATED_TO = '31-07-2026';

/* ---------------------------------- Rows ------------------------------------ */

export const allocations: Allocation[] = [
  {
    id: 'ALL-2026-0311', assetId: 'AST-2026-0142',
    assetName: 'Interactive Smart Board 75"', icon: 'ti ti-device-desktop',
    model: 'ViewPro VB-750', serial: 'VB750-2023-0142', units: 1,
    category: 'IT Equipment',
    assignee: {
      name: 'Ms. Priya Raman', reference: 'Assistant Warden · EMP-2021-046',
      type: 'Staff', avatar: 'assets/img/teachers/teacher-06.jpg',
    },
    department: 'Academic', location: 'Main Block', spot: 'Room 204',
    allocatedOn: '12 Apr 2023', expectedReturn: '', actualReturn: '',
    condition: 'Good', damage: null,
    history: [
      { title: 'Allocated to Ms. Priya Raman', meta: '12 Apr 2023 · Room 204' },
      { title: 'Relocated from Room 118', meta: '04 Jan 2025 · Estates' },
    ],
    conditionNote: 'Panel and stylus in good order. Touch layer replaced under warranty in Sep 2024.',
    requestedBy: 'Ms. Priya Raman', approvedBy: 'Estates Manager', approvedOn: '11 Apr 2023',
    requestRef: 'REQ-2023-0141', approvalRoute: 'Department head → Estates',
    documents: [
      { name: 'Handover Form.pdf', meta: '12 Apr 2023 · signed · 72 KB' },
      { name: 'Condition Report.pdf', meta: '18 Mar 2026 · 118 KB' },
    ],
    notes: 'Permanent classroom fixture. No return date; reviewed at each annual asset verification.',
    lastVerified: '18 Mar 2026', nextVerification: '18 Mar 2027',
  },
  {
    id: 'ALL-2026-0318', assetId: 'AST-2026-0155',
    assetName: 'Dell Latitude 5540 Laptop', icon: 'ti ti-device-laptop',
    model: 'Latitude 5540', serial: 'DL5540-2025-0155', units: 1,
    category: 'IT Equipment',
    assignee: {
      name: 'Mrs. Alice Ray', reference: 'Chief Warden · EMP-2019-014',
      type: 'Staff', avatar: 'assets/img/teachers/teacher-01.jpg',
    },
    department: 'Administration', location: 'Main Block', spot: 'Admin Office',
    allocatedOn: '8 Apr 2025', expectedReturn: '31 Mar 2027', actualReturn: '',
    condition: 'Excellent', damage: null,
    history: [
      { title: 'Allocated to Mrs. Alice Ray', meta: '08 Apr 2025 · Admin Office' },
    ],
    conditionNote: 'No physical damage. Battery health 94% at the March 2026 check.',
    requestedBy: 'Mrs. Alice Ray', approvedBy: 'Estates Manager', approvedOn: '7 Apr 2025',
    requestRef: 'REQ-2025-0204', approvalRoute: 'Department head → Estates',
    documents: [
      { name: 'Handover Form.pdf', meta: '08 Apr 2025 · signed · 68 KB' },
      { name: 'Encryption Certificate.pdf', meta: '08 Apr 2025 · 54 KB' },
    ],
    notes: 'Holds hostel allocation records. Data wipe required before any transfer or return.',
    lastVerified: '18 Mar 2026', nextVerification: '18 Mar 2027',
  },
  {
    id: 'ALL-2026-0325', assetId: 'AST-2025-0088',
    assetName: 'Science Lab Microscope Set', icon: 'ti ti-microscope',
    model: 'OptiLab M200', serial: 'OPT-M200-LOT-0088', units: 4, totalUnits: 20,
    category: 'Lab Equipment',
    assignee: {
      name: 'Class VI A', reference: '34 students · practical sessions',
      type: 'Classroom', icon: 'ti ti-school', tint: 'purple',
    },
    department: 'Science', location: 'Science Block', spot: 'Lab 1',
    allocatedOn: '11 Feb 2026', expectedReturn: '27 Feb 2026', actualReturn: '27 Feb 2026',
    condition: 'Good', damage: null,
    history: [
      { title: '4 units loaned to Lab 1', meta: '11 Feb 2026 · Science' },
      { title: 'All 4 units returned', meta: '27 Feb 2026 · verified on receipt' },
    ],
    conditionNote: 'All four units returned complete with cases. Optics inspected and cleared.',
    requestedBy: 'Class VI A', approvedBy: 'Head of Science', approvedOn: '10 Feb 2026',
    requestRef: 'REQ-2026-0071', approvalRoute: 'Department head → Estates',
    documents: [
      { name: 'Loan Register.pdf', meta: '11 Feb 2026 · 62 KB' },
      { name: 'Return Checklist.pdf', meta: '27 Feb 2026 · 58 KB' },
    ],
    notes: 'Short-term loan for the Term II practical block. Returned on the due date.',
    lastVerified: '27 Feb 2026', nextVerification: '27 Feb 2027',
  },
  {
    id: 'ALL-2026-0332', assetId: 'AST-2023-0019',
    assetName: 'Library Photocopier', icon: 'ti ti-printer',
    model: 'CanonPro IR-2625', serial: 'CIR2625-2021-0019', units: 1,
    category: 'Office Equipment',
    assignee: {
      name: 'Ms. Carla Mendes', reference: 'Assistant Warden · EMP-2024-088',
      type: 'Staff', avatar: 'assets/img/teachers/teacher-10.jpg',
    },
    department: 'Library', location: 'Library', spot: 'Ground Floor',
    allocatedOn: '5 Jul 2026', expectedReturn: '31 Mar 2027', actualReturn: '',
    condition: 'Poor',
    damage: {
      type: 'Mechanical failure', severity: 'Critical · unusable', reportedOn: '29 Jul 2026',
      reference: 'DMG-2026-0044', estimate: 260, liability: 'School · fair wear and tear',
    },
    history: [
      { title: 'Custodian changed to Ms. Carla Mendes', meta: '05 Jul 2026 · Library' },
      { title: 'Damage reported — drum unit failure', meta: '29 Jul 2026 · DMG-2026-0044' },
    ],
    conditionNote: 'Drum unit failed on 29 Jul 2026. Out of warranty; repair quoted at $260.',
    requestedBy: 'Ms. Carla Mendes', approvedBy: 'Estates Manager', approvedOn: '4 Jul 2026',
    requestRef: 'REQ-2026-0288', approvalRoute: 'Department head → Estates',
    documents: [
      { name: 'Handover Form.pdf', meta: '05 Jul 2026 · signed · 70 KB' },
      { name: 'Damage Report.pdf', meta: '29 Jul 2026 · 96 KB' },
    ],
    notes: 'Repair quote of $260 exceeds sensible spend against a $400 book value. Retirement proposed.',
    lastVerified: '29 Jul 2026', nextVerification: '29 Jul 2027',
  },
  {
    id: 'ALL-2026-0338', assetId: 'AST-2026-0182',
    assetName: 'Student Loan Chromebook', icon: 'ti ti-device-laptop',
    model: 'Acer C734', serial: 'AC734-2026-0182', units: 1,
    category: 'IT Equipment',
    assignee: {
      name: 'Lisa Gourley', reference: 'II B · AD9892431',
      type: 'Student', avatar: 'assets/img/students/student-04.jpg',
    },
    department: 'Academic', location: 'Class II B', spot: 'A-104',
    allocatedOn: '15 Jun 2026', expectedReturn: '24 Jul 2026', actualReturn: '',
    condition: 'Good', damage: null,
    history: [
      { title: 'Issued under the student device loan scheme', meta: '15 Jun 2026 · Academic' },
      { title: 'Return reminder sent to the guardian', meta: '25 Jul 2026 · automated' },
    ],
    conditionNote: 'Reported working at issue. Condition to be verified on return.',
    requestedBy: 'Lisa Gourley', approvedBy: 'Class Teacher', approvedOn: '14 Jun 2026',
    requestRef: 'REQ-2026-0233', approvalRoute: 'Department head → Estates',
    documents: [
      { name: 'Loan Agreement.pdf', meta: '15 Jun 2026 · signed by guardian · 88 KB' },
      { name: 'Reminder Notice.pdf', meta: '25 Jul 2026 · 44 KB' },
    ],
    notes: 'Guardian Janet Gourley contacted on 25 Jul. Device to be handed in at the library desk.',
    lastVerified: '15 Jun 2026', nextVerification: '15 Jun 2027',
  },
  {
    id: 'ALL-2026-0344', assetId: 'AST-2026-0161',
    assetName: 'Hostel Bunk Bed Set', icon: 'ti ti-bed',
    model: 'SteelRest BR-2', serial: 'SR-BR2-LOT-0161', units: 8, totalUnits: 12,
    category: 'Furniture',
    assignee: {
      name: 'Everest Hostel', reference: 'Block B · boys wing',
      type: 'Department', icon: 'ti ti-building', tint: 'info',
    },
    department: 'Hostel', location: 'Everest Hostel', spot: 'Block B',
    allocatedOn: '2 Jun 2025', expectedReturn: '30 Jun 2026', actualReturn: '30 Jun 2026',
    condition: 'Good', damage: null,
    history: [
      { title: '8 units issued to Block B', meta: '02 Jun 2025 · Hostel' },
      { title: 'All 8 units returned to store', meta: '30 Jun 2026 · Estates' },
    ],
    conditionNote: 'Frames re-tightened on return. No welds cracked; all fixings present.',
    requestedBy: 'Everest Hostel', approvedBy: 'Hostel Director', approvedOn: '1 Jun 2025',
    requestRef: 'REQ-2025-0159', approvalRoute: 'Department head → Estates',
    documents: [
      { name: 'Issue Note.pdf', meta: '02 Jun 2025 · 64 KB' },
      { name: 'Return Note.pdf', meta: '30 Jun 2026 · 66 KB' },
    ],
    notes: 'Back in the Block A store as spare stock for the hostel waiting list.',
    lastVerified: '30 Jun 2026', nextVerification: '30 Jun 2027',
  },
  {
    id: 'ALL-2026-0351', assetId: 'AST-2026-0195',
    assetName: 'Sports Equipment Kit', icon: 'ti ti-ball-football',
    model: 'Mixed kit', serial: 'SPT-KIT-2026-0195', units: 40, unitNoun: 'piece',
    category: 'Sports Equipment',
    assignee: {
      name: 'Mr. Ethan Brooks', reference: 'Junior Warden · EMP-2023-071',
      type: 'Staff', avatar: 'assets/img/teachers/teacher-05.jpg',
    },
    department: 'Academic', location: 'Sports Ground', spot: 'Store 2',
    allocatedOn: '20 Jul 2026', expectedReturn: '20 Aug 2026', actualReturn: '',
    condition: 'Fair', damage: null,
    history: [
      { title: 'Issued for the inter-house tournament', meta: '20 Jul 2026 · Academic' },
    ],
    conditionNote: 'Two footballs and one net showing wear at issue. Noted on the issue checklist.',
    requestedBy: 'Mr. Ethan Brooks', approvedBy: 'Sports Coordinator', approvedOn: '19 Jul 2026',
    requestRef: 'REQ-2026-0271', approvalRoute: 'Department head → Estates',
    documents: [
      { name: 'Issue Checklist.pdf', meta: '20 Jul 2026 · 52 KB' },
      { name: 'Tournament Schedule.pdf', meta: '20 Jul 2026 · 76 KB' },
    ],
    notes: 'Kit needed back before the August inter-school fixture. Worn items to be replaced first.',
    lastVerified: '20 Jul 2026', nextVerification: '20 Jul 2027',
  },
  {
    id: 'ALL-2026-0356', assetId: 'AST-2026-0170',
    assetName: 'Commercial Refrigerator', icon: 'ti ti-fridge',
    model: 'ColdMax CR-800', serial: 'CM-CR800-2025-0170', units: 1,
    category: 'Kitchen Equipment',
    assignee: {
      name: 'Cafeteria Department', reference: 'Main kitchen team',
      type: 'Department', icon: 'ti ti-building', tint: 'info',
    },
    department: 'Cafeteria', location: 'Main Block', spot: 'Kitchen',
    allocatedOn: '11 Apr 2025', expectedReturn: '', actualReturn: '',
    condition: 'Excellent', damage: null,
    history: [
      { title: 'Installed in the main kitchen', meta: '11 Apr 2025 · Cafeteria' },
    ],
    conditionNote: 'Compressor under warranty to 31 Mar 2030. Temperature audit passed 01 Jul 2026.',
    requestedBy: 'Cafeteria Department', approvedBy: 'Estates Manager', approvedOn: '10 Apr 2025',
    requestRef: 'REQ-2025-0219', approvalRoute: 'Department head → Estates',
    documents: [
      { name: 'Installation Report.pdf', meta: '11 Apr 2025 · 92 KB' },
      { name: 'Temperature Audit.pdf', meta: '01 Jul 2026 · 86 KB' },
    ],
    notes: 'Fixed installation. Holds perishable stock for the daily cafeteria menu.',
    lastVerified: '01 Jul 2026', nextVerification: '01 Jul 2027',
  },
];
