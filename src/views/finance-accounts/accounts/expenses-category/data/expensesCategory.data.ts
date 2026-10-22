export type CategoryStatus = 'Active' | 'Inactive';

export interface RecentExpense {
  title: string;
  owner: string;
  amount: string;
}

export interface ExpenseCategory {
  id: string;
  name: string;
  code: string;
  parent: string;
  description: string;
  budget: number;
  /** Per-claim ceiling before escalation. */
  perExpenseLimit: number;
  approval: string;
  tax: string;
  created: string;
  updated: string;
  /** Claims filed against this category. */
  count: number;
  spent: number;
  /** Drives `accent-*` on the card and the tint of its avatar. */
  accent: string;
  icon: string;
  departments: string[];
  expenseTypes: string[];
  recentExpenses: RecentExpense[];
  status: CategoryStatus;
}

export const statusPill: Record<CategoryStatus, string> = {
  Active: 'is-active',
  Inactive: 'is-inactive',
};

export const statusBadge: Record<CategoryStatus, string> = {
  Active: 'badge badge-soft-success',
  Inactive: 'badge badge-soft-secondary',
};

export const expenseCategories: ExpenseCategory[] = [
  {
    id: 'CAT-TRV', name: 'Travel & Transport', code: 'CAT-TRV', parent: 'Operations',
    description: 'Staff travel, field trips, local transport and fuel reimbursements.',
    budget: 6000, perExpenseLimit: 1000, approval: 'Required (2 levels)', tax: 'Applicable (5%)',
    created: '12 Jan 2025', updated: '20 Jul 2026', count: 24, spent: 4200,
    accent: 'primary', icon: 'ti ti-plane',
    departments: ['Administration', 'Transport', 'Sports'],
    expenseTypes: ['Field Trips', 'Fuel', 'Local Cab', 'Air Travel'],
    recentExpenses: [
      { title: 'Science Fair Travel', owner: 'Daniel Josua', amount: '$420' },
      { title: 'Sports Meet Transport', owner: 'Jacob Ryan', amount: '$260' },
    ],
    status: 'Active',
  },
  {
    id: 'CAT-SUP', name: 'Supplies & Materials', code: 'CAT-SUP', parent: 'Academics',
    description: 'Books, stationery, lab consumables and classroom materials.',
    budget: 8000, perExpenseLimit: 1500, approval: 'Required (1 level)', tax: 'Applicable (5%)',
    created: '12 Jan 2025', updated: '16 Jul 2026', count: 38, spent: 5100,
    accent: 'info', icon: 'ti ti-box',
    departments: ['Library', 'Science', 'Front Office'],
    expenseTypes: ['Books', 'Stationery', 'Lab Supplies'],
    recentExpenses: [
      { title: 'Library Books Purchase', owner: 'Emily Clark', amount: '$860' },
      { title: 'Sports Equipment', owner: 'William Adams', amount: '$720' },
    ],
    status: 'Active',
  },
  {
    id: 'CAT-UTL', name: 'Utilities', code: 'CAT-UTL', parent: 'Operations',
    description: 'Electricity, water, internet and telephone charges across campuses.',
    budget: 5000, perExpenseLimit: 2000, approval: 'Required (2 levels)', tax: 'Not Applicable',
    created: '12 Jan 2025', updated: '11 Jul 2026', count: 16, spent: 4800,
    accent: 'warning', icon: 'ti ti-bolt',
    departments: ['IT Support', 'Administration'],
    expenseTypes: ['Electricity', 'Water', 'Internet'],
    recentExpenses: [{ title: 'Electricity Bill — North Wing', owner: 'Michael Scott', amount: '$1,240' }],
    status: 'Active',
  },
  {
    id: 'CAT-MNT', name: 'Maintenance & Repairs', code: 'CAT-MNT', parent: 'Operations',
    description: 'Building upkeep, equipment servicing and repair work.',
    budget: 4500, perExpenseLimit: 1200, approval: 'Required (1 level)', tax: 'Applicable (5%)',
    created: '12 Jan 2025', updated: '09 Jul 2026', count: 21, spent: 2100,
    accent: 'teal', icon: 'ti ti-tools',
    departments: ['Maintenance', 'IT Support'],
    expenseTypes: ['Equipment Repair', 'Building', 'Plumbing'],
    recentExpenses: [{ title: 'Projector Repair', owner: 'Jacob Ryan', amount: '$180' }],
    status: 'Active',
  },
  {
    id: 'CAT-EVT', name: 'Events & Functions', code: 'CAT-EVT', parent: 'Academics',
    description: 'Annual day, cultural programmes, competitions and celebrations.',
    budget: 7000, perExpenseLimit: 2500, approval: 'Required (2 levels)', tax: 'Applicable (5%)',
    created: '12 Jan 2025', updated: '06 Jul 2026', count: 12, spent: 7400,
    accent: 'purple', icon: 'ti ti-confetti',
    departments: ['Front Office', 'Cultural'],
    expenseTypes: ['Decoration', 'Catering', 'Prizes'],
    recentExpenses: [{ title: 'Annual Day Decorations', owner: 'Sophia Miller', amount: '$640' }],
    status: 'Active',
  },
  {
    id: 'CAT-TRN', name: 'Training & Development', code: 'CAT-TRN', parent: 'HRM',
    description: 'Staff workshops, certifications and professional development.',
    budget: 5500, perExpenseLimit: 2000, approval: 'Required (1 level)', tax: 'Not Applicable',
    created: '12 Jan 2025', updated: '03 Jul 2026', count: 9, spent: 3000,
    accent: 'success', icon: 'ti ti-school',
    departments: ['Administration', 'Academics'],
    expenseTypes: ['Workshops', 'Certifications'],
    recentExpenses: [{ title: 'Staff Training Workshop', owner: 'Teresa Bru', amount: '$1,500' }],
    status: 'Active',
  },
  {
    id: 'CAT-FOD', name: 'Food & Catering', code: 'CAT-FOD', parent: 'Operations',
    description: 'Cafeteria supplies, staff refreshments and event catering.',
    budget: 3000, perExpenseLimit: 800, approval: 'Not Required', tax: 'Applicable (5%)',
    created: '12 Jan 2025', updated: '29 Jun 2026', count: 14, spent: 1200,
    accent: 'pink', icon: 'ti ti-tools-kitchen-2',
    departments: ['Housekeeping'],
    expenseTypes: ['Cafeteria', 'Refreshments'],
    recentExpenses: [{ title: 'Cafeteria Supplies', owner: 'Olivia Turner', amount: '$310' }],
    status: 'Inactive',
  },
];

/* -------------------------------- Derivations ------------------------------- */

export const money = (value: number): string => `$${value.toLocaleString('en-US')}`;

/** Budget utilisation; can exceed 100 — see the file header. */
export const utilisationOf = (row: ExpenseCategory): number =>
  row.budget === 0 ? 0 : Math.round((row.spent / row.budget) * 100);

export const remainingOf = (row: ExpenseCategory): number => row.budget - row.spent;

/** Over-budget categories get the danger bar, near-budget the warning one. */
export const utilisationTint = (percent: number): string => {
  if (percent > 100) return 'danger';
  if (percent >= 90) return 'warning';
  return 'success';
};

export const searchIndexOf = (row: ExpenseCategory): string =>
  [row.name, row.code, row.parent, row.status, ...row.departments].join(' ').toLowerCase();

/* --------------------------------- Options ---------------------------------- */

export const parentOptions = ['Operations', 'Academics', 'HRM'];
export const departmentOptions = [
  'Administration', 'Transport', 'Sports', 'Library', 'Science', 'Front Office', 'IT Support',
  'Maintenance', 'Cultural', 'Academics', 'Housekeeping',
];
export const statusOptions: CategoryStatus[] = ['Active', 'Inactive'];
export const budgetOptions = ['$3,000', '$5,000', '$6,000', '$7,000', '$8,000'];
export const approvalOptions = ['Not Required', 'Required (1 level)', 'Required (2 levels)'];
export const taxOptions = ['Applicable (5%)', 'Not Applicable'];
