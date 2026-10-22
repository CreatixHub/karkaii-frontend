import type { Module, Workflow } from './workflows.data';

/* -------------------------------- Categories --------------------------------- */

export interface Category {
  icon: string;
  module: Module;
  note: string;
  /** Rules drafted against this module but not counted as live. */
  drafted: number;
}

export const categories: Category[] = [
  { icon: 'ti ti-user-plus', module: 'Admissions', note: 'Enrolment, documents, seat offers', drafted: 0 },
  { icon: 'ti ti-calendar-x', module: 'Attendance', note: 'Absence, lateness, leave', drafted: 0 },
  { icon: 'ti ti-report-money', module: 'Fees', note: 'Dues, late fees, receipts', drafted: 0 },
  { icon: 'ti ti-file-certificate', module: 'Examinations', note: 'Results, report cards, hall tickets', drafted: 0 },
  { icon: 'ti ti-books', module: 'Library', note: 'Loans, overdue, reservations', drafted: 0 },
  { icon: 'ti ti-bus', module: 'Transport', note: 'Routes, delays, fitness expiry', drafted: 0 },
  { icon: 'ti ti-building-community', module: 'Hostel', note: 'Allocation, curfew, mess', drafted: 0 },
  { icon: 'ti ti-id-badge-2', module: 'HR', note: 'Leave, payroll, probation', drafted: 0 },
  { icon: 'ti ti-package', module: 'Inventory', note: 'Stock levels, warranty, assets', drafted: 0 },
  { icon: 'ti ti-sparkles', module: 'AI', note: 'Risk scores, predictions', drafted: 2 },
];

/**
 * The template publishes a count per module — 6 admissions, 5 attendance, 7
 * fees and so on, 34 in all. This page lists eight of them, so each category's
 * figure is its published base moved by whatever the roster now holds.
 */
export const CATEGORY_BASE: Record<Module, number> = {
  Admissions: 6, Attendance: 5, Fees: 7, Examinations: 4, Library: 3,
  Transport: 3, Hostel: 2, HR: 4, Inventory: 2, AI: 0,
};

export const categoryCountsOf = (
  rows: Workflow[], seeded: Workflow[],
): Record<Module, number> => {
  const counts = { ...CATEGORY_BASE };
  (Object.keys(counts) as Module[]).forEach((module) => {
    const before = seeded.filter((row) => row.module === module && !row.draft).length;
    const now = rows.filter((row) => row.module === module && !row.draft).length;
    counts[module] = Math.max(0, counts[module] - before + now);
  });
  return counts;
};

/* --------------------------------- Templates --------------------------------- */

export interface WorkflowTemplate {
  icon: string;
  name: string;
  note: string;
  /** The trigger, as the card prints it. */
  trigger: string;
  triggerValue: string;
  actionSummary: string;
  module: string;
  conditions: number;
}

export const workflowTemplates: WorkflowTemplate[] = [
  {
    icon: 'ti ti-user-plus', name: 'Student Admission',
    note: 'Turns an approved application into an enrolled student, with roll number and fee ledger.',
    trigger: 'status becomes', triggerValue: 'approved',
    actionSummary: '5 actions in order', module: 'Admissions', conditions: 3,
  },
  {
    icon: 'ti ti-report-money', name: 'Fee Reminder',
    note: 'Reminds families a set number of days before the due date, once per invoice.',
    trigger: 'due_date', triggerValue: '− 5 days',
    actionSummary: 'notify on 3 channels', module: 'Fees', conditions: 2,
  },
  {
    icon: 'ti ti-calendar-x', name: 'Attendance Alert',
    note: 'Notifies a parent the same morning, after the register is locked rather than as it is marked.',
    trigger: 'register locks at', triggerValue: '10:15',
    actionSummary: 'notify parent', module: 'Attendance', conditions: 2,
  },
  {
    icon: 'ti ti-file-certificate', name: 'Exam Result',
    note: 'Generates report cards and publishes them once moderation has been signed off.',
    trigger: 'marks entry is locked', triggerValue: '',
    actionSummary: 'generate, publish, notify', module: 'Examinations', conditions: 2,
  },
  {
    icon: 'ti ti-cake', name: 'Birthday Wishes',
    note: 'Runs daily against the date of birth field. Skips students on leave or withdrawn.',
    trigger: 'daily at', triggerValue: '07:00',
    actionSummary: 'send greeting', module: 'HR & Students', conditions: 1,
  },
  {
    icon: 'ti ti-coin', name: 'Late Fee',
    note: 'Applies a percentage or flat charge once, the morning after the due date passes.',
    trigger: 'due_date', triggerValue: 'passes',
    actionSummary: 'charge, notify, flag', module: 'Fees', conditions: 2,
  },
  {
    icon: 'ti ti-route', name: 'Leave Approval',
    note: 'Routes a request by duration and remaining balance, escalating past the department head.',
    trigger: 'request is submitted', triggerValue: '',
    actionSummary: 'route to approver', module: 'HR', conditions: 2,
  },
  {
    icon: 'ti ti-certificate', name: 'Certificate Generation',
    note: 'Issues bonafide and transfer certificates once dues are cleared and the request is approved.',
    trigger: 'a request is approved', triggerValue: '',
    actionSummary: 'generate, sign, email', module: 'Admissions', conditions: 3,
  },
];

/* ----------------------------- Conditions builder ---------------------------- */

export interface BuilderCondition {
  id: string;
  field: string;
  operator: string;
  value: string;
  /** How this condition joins the one above it. */
  joiner: 'AND' | 'OR';
}

export interface BuilderGroup {
  id: string;
  label: string;
  conditions: BuilderCondition[];
}

export const operatorsFor = (field: string): string[] => {
  if (field.endsWith('balance') || field.endsWith('score') || field.endsWith('days')) {
    return ['is greater than', 'is less than', 'equals', 'is between'];
  }
  if (field.endsWith('concession')) return ['is empty', 'is not empty', 'is'];
  return ['is', 'is not', 'is empty', 'is any of'];
};

export const valuesFor = (field: string): string[] => {
  if (field === 'invoice.status') return ['unpaid', 'partially paid', 'paid', 'written off'];
  if (field === 'student.status') return ['withdrawn', 'on leave', 'alumni'];
  return [];
};

export const availableVariables = [
  'student.name', 'student.class', 'student.concession',
  'invoice.balance', 'invoice.due_date', 'parent.email', 'today()',
];

/** The builder as it opens — the late-fee rule's own four conditions. */
export const initialGroups: BuilderGroup[] = [
  {
    id: 'G1', label: 'Group 1 — the invoice itself',
    conditions: [
      { id: 'C1', field: 'invoice.status', operator: 'is', value: 'unpaid', joiner: 'AND' },
      { id: 'C2', field: 'invoice.balance', operator: 'is greater than', value: '0', joiner: 'AND' },
    ],
  },
  {
    id: 'G2', label: 'Group 2 — exclusions',
    conditions: [
      { id: 'C3', field: 'student.concession', operator: 'is empty', value: '', joiner: 'AND' },
      { id: 'C4', field: 'student.status', operator: 'is not', value: 'withdrawn', joiner: 'AND' },
    ],
  },
];

export const countConditions = (groups: BuilderGroup[]): number =>
  groups.reduce((total, group) => total + group.conditions.length, 0);

/**
 * What the groups actually mean, written out. The template leaves the reader to
 * work the brackets out from the layout; this says it.
 */
export const describeGroups = (groups: BuilderGroup[]): string => {
  const parts = groups
    .filter((group) => group.conditions.length > 0)
    .map((group) => {
      const inner = group.conditions
        .map((condition, index) => {
          const text = `${condition.field} ${condition.operator}${condition.value ? ` ${condition.value}` : ''}`;
          return index === 0 ? text : `${condition.joiner} ${text}`;
        })
        .join(' ');
      return groups.length > 1 ? `(${inner})` : inner;
    });
  return parts.length === 0 ? 'No conditions — the rule runs on every trigger.' : parts.join(' AND ');
};

/**
 * How many records the conditions match right now. The template prints a fixed
 * "318 of 1,240"; here it narrows as conditions are added, because each one can
 * only ever exclude more.
 */
export const RECORD_POOL = 1240;

export const matchesOf = (groups: BuilderGroup[]): number => {
  const conditions = countConditions(groups);
  if (conditions === 0) return RECORD_POOL;
  // The four conditions the builder opens with leave 318 of the 1,240.
  const share = [1, 0.62, 0.44, 0.31, 0.256][Math.min(conditions, 4)] ?? 0.2;
  return Math.round(RECORD_POOL * share);
};

/* ------------------------------- Quick actions -------------------------------- */

export interface QuickAction {
  icon: string;
  title: string;
  note: string;
}

export const quickActions: QuickAction[] = [
  { icon: 'ti ti-plus', title: 'Create Workflow', note: 'Start from a blank rule' },
  { icon: 'ti ti-file-import', title: 'Import Rules', note: 'From JSON, or another branch' },
  { icon: 'ti ti-template', title: 'Manage Templates', note: 'Eight ready-made workflows' },
  { icon: 'ti ti-settings', title: 'Workflow Settings', note: 'Run limits, retries and logging' },
];
