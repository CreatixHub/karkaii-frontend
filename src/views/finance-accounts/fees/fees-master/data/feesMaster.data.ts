export type StructureStatus = 'Active' | 'Due soon' | 'Draft' | 'Completed';

/** `status-chip` modifier the template uses for each state. */
export const statusChip: Record<StructureStatus, string> = {
  Active: 'ok',
  'Due soon': 'warn',
  Draft: 'draft',
  Completed: 'ok',
};

export interface Installment {
  label: string;
  amount: string;
  due: string;
  /** "Collected", "94%", or a bare percentage — the template mixes both. */
  state: string;
}

export interface RecentPayment {
  student: string;
  meta: string;
  amount: string;
}

export interface FeeStructure {
  id: string;
  code: string;
  name: string;
  /** "Tuition · Grades I–X · Sections A–C" */
  subtitle: string;
  category: string;
  accent: string;
  icon: string;
  amount: string;
  /** "per student · term-wise" */
  cadence: string;
  frequency: string;
  installmentCount: number;
  applicableClasses: string;
  /** Second line of the table's Applicable Classes cell. */
  applicableNote: string;
  dueDate: string;
  /** "in 3 days", "closed" */
  dueNote: string;
  lateFee: string;
  assigned: number;
  concessions: string;
  /** Lakh strings — see the file header. */
  collected: string;
  pending: string;
  overdue: string;
  /** Numeric lakh values, used only for the derived collection percentage. */
  collectedLakh: number;
  pendingLakh: number;
  studentsPaid: number;
  invoicesOutstanding: number;
  overdueAccounts: number;
  status: StructureStatus;

  installments: Installment[];
  lateFeeRules: string[];
  /** Heading varies by structure: Applicable Classes / Routes / Blocks. */
  scopeHeading: string;
  scopeItems: string[];
  /** Heading varies: Discount & Scholarship / Discount / Scholarship / Concession. */
  discountHeading: string;
  discountRules: string[];
  recentPayments: RecentPayment[];
  /** Trailing footer text on the detail row, e.g. "Assigned students (1,240)". */
  footerNote: string;
  footerAction: string;
}

export const feeStructures: FeeStructure[] = [
  {
    id: 'FS-2024-014', code: 'FS-2024-014', name: 'Term II Tuition Fee',
    subtitle: 'Tuition · Grades I–X · Sections A–C', category: 'Tuition',
    accent: 'primary', icon: 'ti ti-school',
    amount: '₹15,000', cadence: 'per student · term-wise', frequency: 'term-wise',
    installmentCount: 3, applicableClasses: 'Grade I–X', applicableNote: '3 sections',
    dueDate: '25 Dec 2024', dueNote: 'in 3 days',
    lateFee: '₹50 / day · cap ₹1,500', assigned: 1240, concessions: '86 students',
    collected: '₹15.2L', pending: '₹3.4L', overdue: '₹0.6L',
    collectedLakh: 15.2, pendingLakh: 3.4,
    studentsPaid: 1043, invoicesOutstanding: 197, overdueAccounts: 32,
    status: 'Active',
    installments: [
      { label: 'I', amount: '₹5,000', due: 'Due 10 Oct 2024', state: 'Collected' },
      { label: 'II', amount: '₹5,000', due: 'Due 15 Nov 2024', state: '94%' },
      { label: 'III', amount: '₹5,000', due: 'Due 25 Dec 2024', state: '52%' },
    ],
    lateFeeRules: [
      'Grace period of 5 days after due date',
      '₹50 per day thereafter, capped at ₹1,500',
      'Waived automatically for scholarship holders',
    ],
    scopeHeading: 'Applicable Classes',
    scopeItems: ['Grade I', 'Grade II', 'Grade III', 'Grade IV', 'Grade V', 'Grade VI', 'Grade VII', 'Grade VIII', 'Grade IX', 'Grade X'],
    discountHeading: 'Discount & Scholarship Rules',
    discountRules: [
      'Sibling discount — 5% from the second child',
      'Merit scholarship — 15% above 90% aggregate',
      'Staff ward — 25% flat concession',
      'Early payment — 2% if paid 10 days early',
    ],
    recentPayments: [
      { student: 'Janet Daniel', meta: 'Grade III-A · UPI', amount: '₹5,000' },
      { student: 'Joann Michael', meta: 'Grade III-A · Card', amount: '₹5,000' },
      { student: 'Emeley Karen', meta: 'Grade IV-B · Net banking', amount: '₹2,500' },
    ],
    footerNote: 'Assigned students (1,240)', footerAction: 'Remind 197',
  },
  {
    id: 'FS-2024-021', code: 'FS-2024-021', name: 'Transport Fee — Q4',
    subtitle: 'Transport · Routes 1–8 · All grades', category: 'Transport',
    accent: 'warning', icon: 'ti ti-bus',
    amount: '₹8,600', cadence: 'per student · quarterly', frequency: 'quarterly',
    installmentCount: 1, applicableClasses: 'All grades', applicableNote: 'routes 1–8',
    dueDate: '05 Jan 2025', dueNote: 'in 14 days',
    lateFee: '₹25 / day · cap ₹600', assigned: 486, concessions: '12 students',
    collected: '₹2.2L', pending: '₹1.9L', overdue: '₹0.2L',
    collectedLakh: 2.2, pendingLakh: 1.9,
    studentsPaid: 262, invoicesOutstanding: 224, overdueAccounts: 18,
    status: 'Due soon',
    installments: [{ label: 'I', amount: '₹8,600', due: 'Due 05 Jan 2025', state: '54%' }],
    lateFeeRules: [
      'Grace period of 3 days',
      '₹25 per day, capped at ₹600',
      'Route suspension after 30 days overdue',
    ],
    scopeHeading: 'Applicable Routes',
    scopeItems: ['Route 1', 'Route 2', 'Route 3', 'Route 4', 'Route 5', 'Route 6', 'Route 7', 'Route 8'],
    discountHeading: 'Discount Rules',
    discountRules: [
      'Sibling discount — 10% on the second child',
      'Short route — 20% under 4 km',
      'No scholarship applies to transport',
    ],
    recentPayments: [
      { student: 'Aaron Kessler', meta: 'Route 3 · UPI', amount: '₹8,600' },
      { student: 'Daniel Josh', meta: 'Route 5 · Cash', amount: '₹8,600' },
      { student: 'Ella Simpson', meta: 'Route 1 · Card', amount: '₹6,880' },
    ],
    footerNote: 'Assigned students (486)', footerAction: 'Remind 224',
  },
  {
    id: 'FS-2024-009', code: 'FS-2024-009', name: 'Hostel Fee — Term II',
    subtitle: 'Hostel · Blocks A–C · Grades VI–XII', category: 'Hostel',
    accent: 'info', icon: 'ti ti-building-community',
    amount: '₹46,500', cadence: 'per student · term-wise', frequency: 'term-wise',
    installmentCount: 2, applicableClasses: 'Grade VI–XII', applicableNote: 'blocks A–C',
    dueDate: '12 Jan 2025', dueNote: 'in 21 days',
    lateFee: '₹100 / day · cap ₹3,000', assigned: 210, concessions: '9 students',
    collected: '₹8.9L', pending: '₹0.9L', overdue: '₹0.1L',
    collectedLakh: 8.9, pendingLakh: 0.9,
    studentsPaid: 191, invoicesOutstanding: 19, overdueAccounts: 3,
    status: 'Active',
    installments: [
      { label: 'I', amount: '₹23,250', due: 'Due 15 Oct 2024', state: 'Collected' },
      { label: 'II', amount: '₹23,250', due: 'Due 12 Jan 2025', state: '82%' },
    ],
    lateFeeRules: [
      'Grace period of 7 days',
      '₹100 per day, capped at ₹3,000',
      'Mess charges billed separately',
    ],
    scopeHeading: 'Applicable Blocks',
    scopeItems: ['Block A · Boys', 'Block B · Girls', 'Block C · Senior', 'AC rooms', 'Non-AC rooms'],
    discountHeading: 'Scholarship Rules',
    discountRules: [
      'Merit boarders — 20% concession',
      'Sports quota — 30% concession',
      'Sibling sharing — 8% on room rent',
    ],
    recentPayments: [
      { student: 'Marcus Lee', meta: 'Block C · Net banking', amount: '₹23,250' },
      { student: 'Sophia Ray', meta: 'Block B · Cheque', amount: '₹23,250' },
      { student: 'Emeley Karen', meta: 'Block B · UPI', amount: '₹18,600' },
    ],
    footerNote: 'Assigned students (210)', footerAction: 'Remind 19',
  },
  {
    id: 'FS-2024-030', code: 'FS-2024-030', name: 'Board Exam Fee',
    subtitle: 'Exam · Grade X & XII · 2 sections', category: 'Exam',
    accent: 'success', icon: 'ti ti-file-certificate',
    amount: '₹3,200', cadence: 'per student · one-time', frequency: 'one-time',
    installmentCount: 1, applicableClasses: 'Grade X & XII', applicableNote: '2 sections',
    dueDate: '30 Nov 2024', dueNote: 'closed',
    lateFee: '₹500 flat board late-submission charge', assigned: 318, concessions: '—',
    collected: '₹9.6L', pending: '₹0.2L', overdue: '—',
    collectedLakh: 9.6, pendingLakh: 0.2,
    studentsPaid: 312, invoicesOutstanding: 6, overdueAccounts: 0,
    status: 'Completed',
    installments: [{ label: 'I', amount: '₹3,200', due: 'Due 30 Nov 2024', state: '98%' }],
    lateFeeRules: [
      '₹500 flat board late-submission charge',
      'Registration blocked after 15 days',
    ],
    scopeHeading: 'Applicable Classes',
    scopeItems: ['Grade X-A', 'Grade X-B', 'Grade XII-A', 'Grade XII-B'],
    discountHeading: 'Concession Rules',
    discountRules: ['Government quota — fully waived', 'Staff ward — 25% concession'],
    recentPayments: [
      { student: 'Janet Daniel', meta: 'Grade X-A · UPI', amount: '₹3,200' },
      { student: 'Marcus Lee', meta: 'Grade XII-A · Card', amount: '₹3,200' },
      { student: 'Joann Michael', meta: 'Grade X-B · Cash', amount: '₹3,200' },
    ],
    footerNote: 'Cycle closed · reconciled on 05 Dec 2024', footerAction: 'Download reconciliation',
  },
];

/**
 * The fourth card is a Draft in the grid — Lab & Activity Fee — which has no
 * table row of its own. It is a structure that exists but has not been
 * published, so it carries expectations rather than collections.
 */
export const draftStructure: FeeStructure = {
  id: 'FS-2024-041', code: 'FS-2024-041', name: 'Lab & Activity Fee',
  subtitle: 'Activity · Grades VI–XII · All sections', category: 'Activity',
  accent: 'purple', icon: 'ti ti-flask',
  amount: '₹4,000', cadence: 'per student · annual', frequency: 'annual',
  installmentCount: 1, applicableClasses: 'Grade VI–XII', applicableNote: 'all sections',
  dueDate: '20 Jan 2025', dueNote: 'not published',
  lateFee: 'Not applicable', assigned: 720, concessions: '—',
  collected: 'Not yet published', pending: '₹2.9L expected', overdue: '—',
  collectedLakh: 0, pendingLakh: 2.9,
  studentsPaid: 0, invoicesOutstanding: 0, overdueAccounts: 0,
  status: 'Draft',
  installments: [{ label: 'I', amount: '₹4,000', due: 'Due 20 Jan 2025', state: 'Not raised' }],
  lateFeeRules: ['Not applicable while the structure is a draft'],
  scopeHeading: 'Applicable Classes',
  scopeItems: ['Grade VI', 'Grade VII', 'Grade VIII', 'Grade IX', 'Grade X', 'Grade XI', 'Grade XII'],
  discountHeading: 'Discount Rules',
  discountRules: ['Rules not yet configured'],
  recentPayments: [],
  footerNote: 'Assigned students (720)', footerAction: 'Publish structure',
};

/** Cards show all five; the detail table lists only the four published ones. */
export const allStructures: FeeStructure[] = [
  feeStructures[0], feeStructures[1], feeStructures[2], draftStructure, feeStructures[3],
];

/* ------------------------------ Command hero -------------------------------- */

export const commandMeta = {
  academicYear: 'AY 2024–2025',
  categoryCount: '12 Fee Categories',
  activeStructures: '28 Active Structures',
  pendingApprovals: '32 Pending Approvals',
  collectedToday: 86400,
  receiptsToday: 41,
  /** School-wide split across all 28 structures — see the file header. */
  targetPercent: 96,
  segments: [
    { id: 'a', label: 'Collected ₹24.1L', width: 72 },
    { id: 'b', label: 'Partially paid ₹6.0L', width: 18 },
    { id: 'c', label: 'Overdue ₹2.0L', width: 6 },
    { id: 'd', label: 'Not raised ₹1.3L', width: 4 },
  ],
};

export interface UpcomingCollection {
  day: string;
  month: string;
  title: string;
  meta: string;
  value: string;
  accent: string;
}

export const upcomingCollections: UpcomingCollection[] = [
  { day: '25', month: 'Dec', title: 'Term II Tuition', meta: 'Grades I–X · 1,240 students', value: '₹18.6L', accent: 'danger' },
  { day: '05', month: 'Jan', title: 'Transport Q4', meta: '8 routes · 486 students', value: '₹4.2L', accent: 'warning' },
  { day: '12', month: 'Jan', title: 'Hostel Term II', meta: 'Block A–C · 210 students', value: '₹9.8L', accent: 'info' },
  { day: '20', month: 'Jan', title: 'Lab & Activity Fee', meta: 'Grades VI–XII · 720 students', value: '₹2.9L', accent: 'purple' },
];

/* -------------------------------- Live feed --------------------------------- */

export interface TimelineEvent {
  time: string;
  title: string;
  detail: string;
  accent: string;
}

export const paymentTimeline: TimelineEvent[] = [
  { time: '10:42', title: 'Payment received · ₹15,000', detail: 'Janet Daniel · Grade III-A · UPI · receipt RC-88421', accent: 'success' },
  { time: '10:15', title: 'Invoice generated · 240 students', detail: 'Term II Tuition · batch INV-2024-0912', accent: 'primary' },
  { time: '09:38', title: 'Reminder sent · 197 guardians', detail: 'SMS + email · Term II Tuition installment III', accent: 'info' },
  { time: '09:02', title: 'Late fee applied · ₹12,400', detail: '32 accounts past the 5-day grace period', accent: 'warning' },
  { time: 'Yst', title: 'Scholarship approved · 15%', detail: 'Marcus Lee · Grade XII-A · merit scholarship', accent: 'purple' },
  { time: 'Yst', title: 'Refund processed · ₹8,600', detail: 'Aaron Kessler · transport route change', accent: 'danger' },
];

export interface ActivityEntry {
  avatar: string;
  actor: string;
  action: string;
  subject: string;
  time: string;
  chip: string;
  chipClass: string;
}

export const recentActivity: ActivityEntry[] = [
  { avatar: 'assets/img/profiles/avatar-27.jpg', actor: 'Robert Daniel', action: 'created fee structure', subject: 'Lab & Activity Fee', time: 'Today · 11:04', chip: 'Created', chipClass: 'soft' },
  { avatar: 'assets/img/profiles/avatar-23.jpg', actor: 'Sarah Michael', action: 'updated amount on', subject: 'Transport Fee Q4', time: 'Today · 10:20', chip: 'Updated', chipClass: 'info' },
  { avatar: 'assets/img/profiles/avatar-25.jpg', actor: 'David Karen', action: 'generated', subject: '240 invoices', time: 'Today · 10:15', chip: 'Invoiced', chipClass: 'ok' },
  { avatar: 'assets/img/profiles/avatar-19.jpg', actor: 'Linda Kessler', action: 'approved a', subject: '25% staff-ward discount', time: 'Today · 09:47', chip: 'Approved', chipClass: 'ok' },
];

export interface NotificationGroup {
  label: string;
  items: {
    title: string;
    detail: string;
    icon: string;
    accent: string;
    chip: string;
    chipClass: string;
  }[];
}

export const notifications: NotificationGroup[] = [
  {
    label: 'Due today',
    items: [
      { title: 'Term II Tuition — installment III', detail: '₹18.6L across 1,240 students', icon: 'ti ti-calendar-due', accent: 'danger', chip: 'Today', chipClass: 'bad' },
    ],
  },
  {
    label: 'Pending approval',
    items: [
      { title: '32 concession requests', detail: '₹3.8L total · oldest waiting 6 days', icon: 'ti ti-discount-2', accent: 'purple', chip: 'Review', chipClass: 'warn' },
      { title: '9 scholarship renewals', detail: 'Merit quota · Grades XI–XII', icon: 'ti ti-award', accent: 'info', chip: '9', chipClass: 'info' },
    ],
  },
  {
    label: 'Alerts',
    items: [
      { title: '4 payments failed', detail: 'Gateway timeout · auto-retry scheduled', icon: 'ti ti-credit-card-off', accent: 'warning', chip: 'Retry', chipClass: 'warn' },
    ],
  },
];

/* -------------------------------- Derivations ------------------------------- */

/**
 * The card meter. Matches the template on all three published cards:
 * 15.2/(15.2+3.4) → 82, 2.2/(2.2+1.9) → 54, 8.9/(8.9+0.9) → 91.
 */
export const collectionPercentOf = (row: FeeStructure): number => {
  const total = row.collectedLakh + row.pendingLakh;
  return total === 0 ? 0 : Math.round((row.collectedLakh / total) * 100);
};

export const studentsPendingOf = (row: FeeStructure): number => row.assigned - row.studentsPaid;

/* --------------------------------- Options ---------------------------------- */

export const yearOptions = ['2024–2025', '2023–2024'];
export const categoryOptions = ['All categories', 'Tuition', 'Transport', 'Hostel', 'Exam', 'Activity'];
export const classOptions = ['All classes', 'Grade I–V', 'Grade VI–X', 'Grade XI–XII'];
export const sectionOptions = ['All', 'A', 'B', 'C'];
export const frequencyOptions = ['Any', 'One-time', 'Monthly', 'Quarterly', 'Term-wise', 'Annual'];
export const statusOptions = ['Any status', 'Active', 'Draft', 'Paused', 'Archived'];
export const modeOptions = ['All modes', 'Online', 'Cash', 'Cheque', 'UPI'];

export interface SavedViewDef {
  id: string;
  label: string;
  icon: string;
  count: number;
}

/** School-wide counts across all 28 structures. */
export const savedViewDefs: SavedViewDef[] = [
  { id: 'all', label: 'All Structures', icon: 'ti ti-layout-list', count: 28 },
  { id: 'due', label: 'Due This Month', icon: 'ti ti-alarm', count: 7 },
  { id: 'risk', label: 'At Risk', icon: 'ti ti-alert-triangle', count: 4 },
  { id: 'draft', label: 'Drafts', icon: 'ti ti-pencil', count: 3 },
  { id: 'archive', label: 'Archived', icon: 'ti ti-archive', count: 11 },
];

/** The four chips the template renders pre-applied. */
export const initialChips = [
  'Scholarship: Included',
  'Transport: Route 1–8',
  'Hostel: Block A',
  'Due: This month',
];
