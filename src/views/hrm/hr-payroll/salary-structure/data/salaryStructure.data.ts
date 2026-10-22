export type StructureStatus = 'Active' | 'Draft' | 'Inactive';

export interface LineItem {
  label: string;
  amount: number;
}

export interface SalaryStructure {
  id: string;
  code: string;
  name: string;
  category: string;
  department: string;
  frequency: string;
  tint: string;
  basic: number;
  earnings: LineItem[];
  deductions: LineItem[];
  /** The contractual structure carries none. */
  employer: LineItem[];
  designations: string[];
  frequencyNote: string;
  frequencySub: string;
  notes: string;
  effectiveFrom: string;
  lastUpdated: string;
  status: StructureStatus;
}

export const statusPill: Record<StructureStatus, string> = {
  Active: 'is-active',
  Draft: 'is-pending',
  Inactive: 'is-inactive',
};

export const salaryStructures: SalaryStructure[] = [
  {
    id: 'SS-001',
    code: 'SS-001',
    name: 'Senior Teacher Grade I',
    category: 'Teaching Staff',
    department: 'Languages',
    frequency: 'Monthly',
    tint: 'primary',
    basic: 4200,
    earnings: [
      { label: 'House Rent Allowance', amount: 680 },
      { label: 'Conveyance', amount: 220 },
      { label: 'Special Allowance', amount: 310 },
      { label: 'Academic Incentive', amount: 130 },
    ],
    deductions: [
      { label: 'Provident Fund', amount: 380 },
      { label: 'Professional Tax', amount: 90 },
      { label: 'Health Insurance', amount: 110 },
      { label: 'Welfare Fund', amount: 40 },
    ],
    employer: [
      { label: 'Provident Fund', amount: 380 },
      { label: 'Gratuity Reserve', amount: 202 },
      { label: 'Group Insurance', amount: 75 },
    ],
    designations: ['Senior Teacher', 'Subject Lead', 'Language Coordinator'],
    frequencyNote: 'Monthly · paid on the 28th',
    frequencySub: 'Pro-rated for mid-month joiners',
    notes:
      'Revised after the 2026 pay commission. Academic incentive is withheld if attendance falls below 85% in a cycle.',
    effectiveFrom: '01 Apr 2026',
    lastUpdated: '12 Jul 2026',
    status: 'Active',
  },
  {
    id: 'SS-002',
    code: 'SS-002',
    name: 'Assistant Teacher Grade II',
    category: 'Teaching Staff',
    department: 'Science',
    frequency: 'Monthly',
    tint: 'info',
    basic: 3100,
    earnings: [
      { label: 'House Rent Allowance', amount: 496 },
      { label: 'Conveyance', amount: 180 },
      { label: 'Special Allowance', amount: 264 },
    ],
    deductions: [
      { label: 'Provident Fund', amount: 280 },
      { label: 'Professional Tax', amount: 90 },
      { label: 'Health Insurance', amount: 85 },
    ],
    employer: [
      { label: 'Provident Fund', amount: 280 },
      { label: 'Gratuity Reserve', amount: 149 },
      { label: 'Group Insurance', amount: 75 },
    ],
    designations: ['Assistant Teacher', 'Lab Instructor'],
    frequencyNote: 'Monthly · paid on the 28th',
    frequencySub: 'Overtime settled in the following cycle',
    notes:
      'Applies from confirmation. Probationers draw 90% of this structure until the review is cleared.',
    effectiveFrom: '01 Apr 2026',
    lastUpdated: '12 Jul 2026',
    status: 'Active',
  },
  {
    id: 'SS-003',
    code: 'SS-003',
    name: 'Administrative Officer',
    category: 'Administrative',
    department: 'Administration',
    frequency: 'Monthly',
    tint: 'success',
    basic: 2750,
    earnings: [
      { label: 'House Rent Allowance', amount: 440 },
      { label: 'Conveyance', amount: 180 },
      { label: 'Special Allowance', amount: 190 },
    ],
    deductions: [
      { label: 'Provident Fund', amount: 248 },
      { label: 'Professional Tax', amount: 72 },
      { label: 'Health Insurance', amount: 75 },
    ],
    employer: [
      { label: 'Provident Fund', amount: 248 },
      { label: 'Gratuity Reserve', amount: 132 },
      { label: 'Group Insurance', amount: 60 },
    ],
    designations: ['Office Administrator', 'Admissions Officer'],
    frequencyNote: 'Monthly · paid on the 28th',
    frequencySub: 'Includes a fixed festival advance in October',
    notes: 'Shared across the front office and admissions desks. Weekend duty is compensated separately.',
    effectiveFrom: '01 Apr 2026',
    lastUpdated: '08 Jul 2026',
    status: 'Active',
  },
  {
    id: 'SS-004',
    code: 'SS-004',
    name: 'Support Staff Grade I',
    category: 'Support Staff',
    department: 'Administration',
    frequency: 'Bi-Weekly',
    tint: 'warning',
    basic: 1480,
    earnings: [
      { label: 'House Rent Allowance', amount: 236 },
      { label: 'Conveyance', amount: 120 },
      { label: 'Shift Allowance', amount: 64 },
    ],
    deductions: [
      { label: 'Provident Fund', amount: 133 },
      { label: 'Welfare Fund', amount: 52 },
    ],
    employer: [
      { label: 'Provident Fund', amount: 133 },
      { label: 'Group Insurance', amount: 45 },
    ],
    designations: ['Housekeeping', 'Security', 'Groundskeeping'],
    frequencyNote: 'Bi-weekly · every alternate Friday',
    frequencySub: 'Overtime paid at 1.5× the hourly rate',
    notes: 'Draft pending finance approval. Figures are indicative until the revision is signed off.',
    effectiveFrom: '01 Apr 2026',
    lastUpdated: '21 Jul 2026',
    status: 'Draft',
  },
  {
    id: 'SS-005',
    code: 'SS-005',
    name: 'Visiting Faculty',
    category: 'Non-Teaching Staff',
    department: 'Mathematics',
    frequency: 'Contractual',
    tint: 'secondary',
    basic: 1900,
    earnings: [
      { label: 'Session Allowance', amount: 120 },
      { label: 'Travel Reimbursement', amount: 60 },
    ],
    deductions: [{ label: 'Withholding Tax', amount: 95 }],
    employer: [],
    designations: ['Guest Lecturer', 'Exam Evaluator'],
    frequencyNote: 'Contractual · per engagement',
    frequencySub: 'Settled within 15 days of invoice',
    notes: 'Retired at the end of the 2025 session. Retained for historical payroll reference only.',
    effectiveFrom: '01 Jan 2026',
    lastUpdated: '02 Jun 2026',
    status: 'Inactive',
  },
];

/* -------------------------------- Derivations ------------------------------- */

export const sum = (items: LineItem[]): number => items.reduce((total, item) => total + item.amount, 0);

export const totalEarnings = (structure: SalaryStructure): number => sum(structure.earnings);
export const totalDeductions = (structure: SalaryStructure): number => sum(structure.deductions);

/** Basic plus every earning, matching the template's Gross column. */
export const grossSalary = (structure: SalaryStructure): number => structure.basic + totalEarnings(structure);

export const netSalary = (structure: SalaryStructure): number =>
  grossSalary(structure) - totalDeductions(structure);

/** "$4,200" — the template's currency form. */
export const money = (value: number): string => `$${value.toLocaleString('en-US')}`;

/* -------------------------------- Workspace -------------------------------- */

export const categoryOptions = [
  'All Categories',
  'Teaching Staff',
  'Non-Teaching Staff',
  'Administrative',
  'Support Staff',
];

export const departmentOptions = [
  'All Departments',
  'Languages',
  'Science',
  'Mathematics',
  'Administration',
];

export const frequencyOptions = ['All Frequencies', 'Monthly', 'Bi-Weekly', 'Contractual'];

export const statusOptions = ['All Status', 'Active', 'Draft', 'Inactive'];

/** Dialog selects drop the "All …" lead option the toolbar filters use. */
export const formCategoryOptions = categoryOptions.slice(1);
export const formDepartmentOptions = departmentOptions.slice(1);
export const formFrequencyOptions = frequencyOptions.slice(1);
export const formStatusOptions = statusOptions.slice(1);

export const PAYROLL_CYCLE = 'Payroll Cycle · Apr 2026';

export type SortKey = 'name' | 'category' | 'department' | 'basic' | 'gross' | 'net' | 'effective';
