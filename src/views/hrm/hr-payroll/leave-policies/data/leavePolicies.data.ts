export type PolicyStatus = 'Active' | 'Draft' | 'Inactive';

/** A run of copy where some words are emphasised, as the template's `<span class="fw-medium">`. */
export type Segment = string | { b: string };

export interface RuleLine {
  icon: string;
  tone: string;
  segments: Segment[];
}

export interface InfoTile {
  label: string;
  value?: string;
  /** The Exclusions tile prints badges instead of a value. */
  badges?: { label: string; tone: string }[];
}

export interface CardBadge {
  icon: string;
  label: string;
  tone: string;
}

export interface LeavePolicy {
  id: string;
  code: string;
  name: string;
  /** Drives the Leave Type filter. */
  type: string;
  icon: string;
  tint: string;
  status: PolicyStatus;
  /** "12", "As earned", "Unlimited" — the template mixes numbers and words. */
  allowance: string;
  /** Omitted where the allowance is already a phrase. */
  allowanceUnit?: string;
  /** Drives the Employee Category filter and the sheet's sub-heading. */
  audience: string;
  effectiveFrom: string;
  revision: number;
  badges: CardBadge[];
  eligibility: InfoTile[];
  entitlement: InfoTile[];
  carryForward: RuleLine[];
  encashment: RuleLine[];
}

export const statusBadge: Record<PolicyStatus, string> = {
  Active: 'badge badge-soft-success',
  Draft: 'badge badge-soft-warning',
  Inactive: 'badge badge-soft-danger',
};

const BORDERED = 'bordered';

const check = (segments: Segment[]): RuleLine => ({
  icon: 'ti ti-circle-check',
  tone: 'text-success',
  segments,
});

const warn = (segments: Segment[]): RuleLine => ({
  icon: 'ti ti-alert-circle',
  tone: 'text-warning',
  segments,
});

const info = (segments: Segment[]): RuleLine => ({
  icon: 'ti ti-info-circle',
  tone: 'text-info',
  segments,
});

const none = (what: string): RuleLine[] => [
  { icon: 'ti ti-circle-minus', tone: 'text-muted', segments: [what] },
];

export const leavePolicies: LeavePolicy[] = [
  {
    id: 'CL-01',
    code: 'CL-01',
    name: 'Casual Leave',
    type: 'Casual',
    icon: 'ti ti-calendar-plus',
    tint: 'primary',
    status: 'Active',
    allowance: '12',
    allowanceUnit: 'days per year',
    audience: 'All Employees',
    effectiveFrom: '01 Apr 2026',
    revision: 1,
    badges: [
      { icon: 'ti ti-users', label: 'All Employees', tone: BORDERED },
      { icon: 'ti ti-progress', label: '1 / month', tone: BORDERED },
      { icon: 'ti ti-arrow-forward-up', label: 'No carry forward', tone: 'danger' },
    ],
    eligibility: [
      { label: 'Employment Status', value: 'All employees' },
      { label: 'Minimum Service', value: 'None' },
      { label: 'Applicable To', value: 'Teaching & Non-Teaching' },
      { label: 'Exclusions', badges: [{ label: 'None', tone: 'secondary' }] },
    ],
    entitlement: [
      { label: 'Annual Entitlement', value: '12 days' },
      { label: 'Accrual Rate', value: '1 day each month' },
      { label: 'Application Limits', value: 'Half day to 3 days' },
      { label: 'Advance Notice', value: '1 working day' },
    ],
    carryForward: none('Unused casual leave lapses at the end of the policy year.'),
    encashment: none('Casual leave is not encashable.'),
  },
  {
    id: 'SL-02',
    code: 'SL-02',
    name: 'Sick Leave',
    type: 'Medical',
    icon: 'ti ti-first-aid-kit',
    tint: 'danger',
    status: 'Active',
    allowance: '10',
    allowanceUnit: 'days per year',
    audience: 'All Employees',
    effectiveFrom: '01 Apr 2026',
    revision: 1,
    badges: [
      { icon: 'ti ti-users', label: 'All Employees', tone: BORDERED },
      { icon: 'ti ti-file-text', label: 'Certificate 3d+', tone: BORDERED },
      { icon: 'ti ti-arrow-forward-up', label: 'Carry 5 days', tone: 'warning' },
    ],
    eligibility: [
      { label: 'Employment Status', value: 'All employees' },
      { label: 'Minimum Service', value: 'None' },
      { label: 'Applicable To', value: 'Teaching & Non-Teaching' },
      { label: 'Exclusions', badges: [{ label: 'None', tone: 'secondary' }] },
    ],
    entitlement: [
      { label: 'Annual Entitlement', value: '10 days' },
      { label: 'Accrual Rate', value: 'Credited up front' },
      { label: 'Application Limits', value: 'Half day to 10 days' },
      { label: 'Advance Notice', value: 'Same day intimation' },
    ],
    carryForward: [
      check(['Unused sick leave carries forward, capped at ', { b: '5 days' }, '.']),
      warn(['A medical certificate is required for absences of ', { b: '3 days' }, ' or more.']),
    ],
    encashment: none('Sick leave is not encashable.'),
  },
  {
    id: 'EL-03',
    code: 'EL-03',
    name: 'Earned Leave',
    type: 'Earned',
    icon: 'ti ti-sun',
    tint: 'success',
    status: 'Active',
    allowance: '18',
    allowanceUnit: 'days per year',
    audience: 'Confirmed Staff',
    effectiveFrom: '01 Apr 2026',
    revision: 4,
    badges: [
      { icon: 'ti ti-users', label: 'Confirmed Staff', tone: BORDERED },
      { icon: 'ti ti-progress', label: '1.5 / month', tone: BORDERED },
      { icon: 'ti ti-arrow-forward-up', label: 'Carry 30 days', tone: 'success' },
      { icon: 'ti ti-cash', label: 'Encashable', tone: 'success' },
    ],
    eligibility: [
      { label: 'Employment Status', value: 'Confirmed employees only' },
      { label: 'Minimum Service', value: '12 months completed' },
      { label: 'Applicable To', value: 'Teaching & Non-Teaching' },
      {
        label: 'Exclusions',
        badges: [
          { label: 'Probationers', tone: 'danger' },
          { label: 'Contract · pro rata', tone: 'warning' },
        ],
      },
    ],
    entitlement: [
      { label: 'Annual Entitlement', value: '18 days' },
      { label: 'Accrual Rate', value: '1.5 days each month' },
      { label: 'Application Limits', value: 'Half day to 10 days' },
      { label: 'Advance Notice', value: '7 working days' },
    ],
    carryForward: [
      check(['Unused leave carries into the next academic year, capped at ', { b: '30 days' }, '.']),
      check(['Carried balance stays valid until ', { b: '31 March' }, ', after which it lapses.']),
      warn(['Balances above the cap need written approval from the ', { b: 'HR Head' }, '.']),
    ],
    encashment: [
      check(['Up to ', { b: '10 days' }, ' may be encashed once per policy year.']),
      check(['A balance of ', { b: '15 days' }, ' must remain after encashment.']),
      info(['Calculated on ', { b: 'Basic + DA' }, ' and paid with the April salary.']),
    ],
  },
  {
    id: 'ML-04',
    code: 'ML-04',
    name: 'Maternity Leave',
    type: 'Statutory',
    icon: 'ti ti-baby-carriage',
    tint: 'pink',
    status: 'Active',
    allowance: '180',
    allowanceUnit: 'days per year',
    audience: 'Female Employees',
    effectiveFrom: '01 Apr 2026',
    revision: 1,
    badges: [
      { icon: 'ti ti-users', label: 'Female Employees', tone: BORDERED },
      { icon: 'ti ti-shield-check', label: 'Statutory', tone: BORDERED },
      { icon: 'ti ti-arrow-forward-up', label: 'No carry forward', tone: 'danger' },
    ],
    eligibility: [
      { label: 'Employment Status', value: 'Confirmed employees only' },
      { label: 'Minimum Service', value: '80 days completed' },
      { label: 'Applicable To', value: 'Female employees' },
      { label: 'Exclusions', badges: [{ label: 'Contract · pro rata', tone: 'warning' }] },
    ],
    entitlement: [
      { label: 'Annual Entitlement', value: '180 days' },
      { label: 'Accrual Rate', value: 'Statutory grant' },
      { label: 'Application Limits', value: 'Single continuous block' },
      { label: 'Advance Notice', value: '8 weeks' },
    ],
    carryForward: none('Statutory leave does not carry forward.'),
    encashment: none('Statutory leave is not encashable.'),
  },
  {
    id: 'PL-05',
    code: 'PL-05',
    name: 'Paternity Leave',
    type: 'Statutory',
    icon: 'ti ti-users',
    tint: 'info',
    status: 'Active',
    allowance: '15',
    allowanceUnit: 'days per year',
    audience: 'Male Employees',
    effectiveFrom: '01 Apr 2026',
    revision: 1,
    badges: [
      { icon: 'ti ti-users', label: 'Male Employees', tone: BORDERED },
      { icon: 'ti ti-shield-check', label: 'Statutory', tone: BORDERED },
      { icon: 'ti ti-arrow-forward-up', label: 'No carry forward', tone: 'danger' },
    ],
    eligibility: [
      { label: 'Employment Status', value: 'Confirmed employees only' },
      { label: 'Minimum Service', value: '6 months completed' },
      { label: 'Applicable To', value: 'Male employees' },
      { label: 'Exclusions', badges: [{ label: 'Probationers', tone: 'danger' }] },
    ],
    entitlement: [
      { label: 'Annual Entitlement', value: '15 days' },
      { label: 'Accrual Rate', value: 'Statutory grant' },
      { label: 'Application Limits', value: 'Up to 2 blocks' },
      { label: 'Advance Notice', value: '4 weeks' },
    ],
    carryForward: none('Statutory leave does not carry forward.'),
    encashment: none('Statutory leave is not encashable.'),
  },
  {
    id: 'CO-06',
    code: 'CO-06',
    name: 'Compensatory Off',
    type: 'Comp Off',
    icon: 'ti ti-clock-hour-8',
    tint: 'teal',
    status: 'Active',
    allowance: 'As earned',
    audience: 'Teaching Staff',
    effectiveFrom: '01 Apr 2026',
    revision: 1,
    badges: [
      { icon: 'ti ti-users', label: 'Teaching Staff', tone: BORDERED },
      { icon: 'ti ti-calendar-event', label: 'Working holidays', tone: BORDERED },
      { icon: 'ti ti-arrow-forward-up', label: 'Valid 90 days', tone: 'warning' },
    ],
    eligibility: [
      { label: 'Employment Status', value: 'All employees' },
      { label: 'Minimum Service', value: 'None' },
      { label: 'Applicable To', value: 'Teaching staff' },
      { label: 'Exclusions', badges: [{ label: 'Non-Teaching', tone: 'danger' }] },
    ],
    entitlement: [
      { label: 'Annual Entitlement', value: 'As earned' },
      { label: 'Accrual Rate', value: 'One day per working holiday' },
      { label: 'Application Limits', value: 'Half day to 2 days' },
      { label: 'Advance Notice', value: '2 working days' },
    ],
    carryForward: [check(['Earned comp off stays valid for ', { b: '90 days' }, ' from the date worked.'])],
    encashment: none('Compensatory off is not encashable.'),
  },
  {
    id: 'STL-07',
    code: 'STL-07',
    name: 'Study Leave',
    type: 'Special',
    icon: 'ti ti-book',
    tint: 'purple',
    status: 'Draft',
    allowance: '10',
    allowanceUnit: 'days per year',
    audience: 'Teaching Staff',
    effectiveFrom: '01 Apr 2026',
    revision: 1,
    badges: [
      { icon: 'ti ti-users', label: 'Teaching Staff', tone: BORDERED },
      { icon: 'ti ti-certificate', label: 'Exam or course', tone: BORDERED },
      { icon: 'ti ti-arrow-forward-up', label: 'No carry forward', tone: 'danger' },
    ],
    eligibility: [
      { label: 'Employment Status', value: 'Confirmed employees only' },
      { label: 'Minimum Service', value: '24 months completed' },
      { label: 'Applicable To', value: 'Teaching staff' },
      { label: 'Exclusions', badges: [{ label: 'Probationers', tone: 'danger' }] },
    ],
    entitlement: [
      { label: 'Annual Entitlement', value: '10 days' },
      { label: 'Accrual Rate', value: 'On approval' },
      { label: 'Application Limits', value: 'Half day to 10 days' },
      { label: 'Advance Notice', value: '30 days' },
    ],
    carryForward: none('Study leave does not carry forward.'),
    encashment: none('Study leave is not encashable.'),
  },
  {
    id: 'LOP-08',
    code: 'LOP-08',
    name: 'Loss of Pay',
    type: 'Unpaid',
    icon: 'ti ti-calendar-off',
    tint: 'secondary',
    status: 'Inactive',
    allowance: 'Unlimited',
    audience: 'All Employees',
    effectiveFrom: '01 Apr 2026',
    revision: 1,
    badges: [
      { icon: 'ti ti-users', label: 'All Employees', tone: BORDERED },
      { icon: 'ti ti-coin-off', label: 'Salary deducted', tone: BORDERED },
      { icon: 'ti ti-arrow-forward-up', label: 'Not applicable', tone: 'secondary' },
    ],
    eligibility: [
      { label: 'Employment Status', value: 'All employees' },
      { label: 'Minimum Service', value: 'None' },
      { label: 'Applicable To', value: 'Teaching & Non-Teaching' },
      { label: 'Exclusions', badges: [{ label: 'None', tone: 'secondary' }] },
    ],
    entitlement: [
      { label: 'Annual Entitlement', value: 'Unlimited' },
      { label: 'Accrual Rate', value: 'Not applicable' },
      { label: 'Application Limits', value: 'Half day upwards' },
      { label: 'Advance Notice', value: '7 working days' },
    ],
    carryForward: none('Not applicable to unpaid leave.'),
    encashment: none('Not applicable to unpaid leave.'),
  },
];

/* -------------------------------- Workspace -------------------------------- */

export const leaveTypeOptions = ['All Types', 'Casual', 'Medical', 'Earned', 'Statutory', 'Unpaid'];

export const employeeCategoryOptions = [
  'All Employees',
  'Teaching Staff',
  'Non-Teaching Staff',
  'Confirmed Staff',
  'Probationers',
];

export const statusOptions = ['All Status', 'Active', 'Draft', 'Inactive'];

export const POLICY_YEAR = 'Policy Year 2026 – 2027';

/** Shared across every policy in the template's wording. */
export const approvalSteps = [
  { badge: 'Step 1', tone: 'primary', title: 'Reporting Manager', note: 'Verifies workload cover' },
  { badge: 'Step 2', tone: 'primary', title: 'Department Head', note: 'Confirms substitute plan' },
  { badge: 'Step 3', tone: 'primary', title: 'HR Department', note: 'Updates the leave ledger' },
  { badge: 'Escalation', tone: 'warning', title: 'After 48 hours', note: 'Auto-routed to the Principal' },
];

export const requiredDocuments = [
  { icon: 'ti ti-file-check', label: 'Leave Application · Mandatory', tone: 'danger' },
  { icon: 'ti ti-clipboard-text', label: 'Handover Note · Mandatory', tone: 'danger' },
  { icon: 'ti ti-signature', label: 'Manager Endorsement · Mandatory', tone: 'danger' },
  { icon: 'ti ti-chalkboard', label: 'Substitute Teacher Plan · Teaching staff', tone: 'warning' },
  { icon: 'ti ti-plane', label: 'Travel Declaration · Optional', tone: 'secondary' },
];

export const policyAlert =
  'Leave balances are recalculated on 01 April each year. Unapproved applications older than 30 days are withdrawn automatically.';

export const policyNotes = [
  'Leave cannot be availed during declared examination weeks without written approval from the Principal.',
  'Sandwich holidays falling between two leave days are counted as leave for earned leave applications.',
  'Employees serving notice period are not eligible for carry forward or encashment.',
  'Policy revisions are published by the HR department and take effect from the next academic year.',
];
