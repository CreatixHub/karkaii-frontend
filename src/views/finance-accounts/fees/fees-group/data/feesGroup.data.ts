export type GroupStatus = 'Active' | 'Scheduled' | 'Draft' | 'Archived';
export type GroupCategory = 'Academic' | 'Transport' | 'Boarding' | 'Facility' | 'One-time' | 'Other';
export type GroupFrequency = 'Monthly' | 'Quarterly' | 'Term' | 'Annual' | 'One-time';

export interface FeeGroup {
  id: string;
  name: string;
  code: string;
  category: GroupCategory;
  tint: string;
  icon: string;
  academicYear: string;
  classes: string;
  /** "All", "A, B", "A" — the template's section wording. */
  sections: string;
  /** Named sample of the breakdown; see the file header on `feeItems`. */
  components: string[];
  /** Badge count on the row, which can exceed `components.length`. */
  feeItems: number;
  frequency: GroupFrequency;
  effectiveFrom: string;
  nextDue: string;
  amount: number;
  assignedStudents: number;
  createdBy: string;
  avatar: string;
  updated: string;
  status: GroupStatus;
}

export const statusPill: Record<GroupStatus, string> = {
  Active: 'is-active',
  Scheduled: 'is-scheduled',
  Draft: 'is-inactive',
  Archived: 'is-archived',
};

export const statusBadge: Record<GroupStatus, string> = {
  Active: 'badge badge-soft-success',
  Scheduled: 'badge badge-soft-info',
  Draft: 'badge badge-soft-secondary',
  Archived: 'badge badge-soft-dark',
};

export const feeGroups: FeeGroup[] = [
  { id: 'FG24001', name: 'Tuition Fees', code: 'FG24001', category: 'Academic', tint: 'primary', icon: 'ti ti-school', academicYear: '2024/2025', classes: 'I – XII', sections: 'All', components: ['Tuition', 'Development'], feeItems: 6, frequency: 'Monthly', effectiveFrom: '01 Apr 2024', nextDue: '05 May 2024', amount: 1250, assignedStudents: 840, createdBy: 'Kevin Larry', avatar: 'assets/img/profiles/avatar-27.jpg', updated: '12 May 2024', status: 'Active' },
  { id: 'FG24002', name: 'Transport Fees', code: 'FG24002', category: 'Transport', tint: 'info', icon: 'ti ti-bus', academicYear: '2024/2025', classes: 'I – XII', sections: 'All', components: ['Route', 'Fuel Surcharge'], feeItems: 3, frequency: 'Monthly', effectiveFrom: '01 Apr 2024', nextDue: '05 May 2024', amount: 480, assignedStudents: 420, createdBy: 'Teressa', avatar: 'assets/img/profiles/avatar-23.jpg', updated: '10 May 2024', status: 'Active' },
  { id: 'FG24003', name: 'Hostel Fees', code: 'FG24003', category: 'Boarding', tint: 'success', icon: 'ti ti-building-community', academicYear: '2024/2025', classes: 'VI – XII', sections: 'A, B', components: ['Room', 'Mess', 'Laundry'], feeItems: 5, frequency: 'Quarterly', effectiveFrom: '01 Apr 2024', nextDue: '05 May 2024', amount: 2100, assignedStudents: 180, createdBy: 'George', avatar: 'assets/img/profiles/avatar-25.jpg', updated: '08 May 2024', status: 'Active' },
  { id: 'FG24004', name: 'Examination Fees', code: 'FG24004', category: 'Academic', tint: 'warning', icon: 'ti ti-file-certificate', academicYear: '2024/2025', classes: 'IX – XII', sections: 'All', components: ['Board Exam', 'Practical'], feeItems: 4, frequency: 'Term', effectiveFrom: '01 May 2024', nextDue: '05 May 2024', amount: 320, assignedStudents: 360, createdBy: 'Elisa', avatar: 'assets/img/profiles/avatar-01.jpg', updated: '11 May 2024', status: 'Scheduled' },
  { id: 'FG24005', name: 'Library Fees', code: 'FG24005', category: 'Facility', tint: 'purple', icon: 'ti ti-books', academicYear: '2024/2025', classes: 'I – XII', sections: 'All', components: ['Membership', 'Security'], feeItems: 2, frequency: 'Annual', effectiveFrom: '01 Apr 2024', nextDue: '05 May 2024', amount: 150, assignedStudents: 840, createdBy: 'Kevin Larry', avatar: 'assets/img/profiles/avatar-27.jpg', updated: '06 May 2024', status: 'Active' },
  { id: 'FG24006', name: 'Sports & Activities', code: 'FG24006', category: 'Facility', tint: 'danger', icon: 'ti ti-run', academicYear: '2024/2025', classes: 'I – XII', sections: 'All', components: ['Sports', 'Club', 'Kit'], feeItems: 4, frequency: 'Annual', effectiveFrom: '01 Apr 2024', nextDue: '05 May 2024', amount: 260, assignedStudents: 610, createdBy: 'Teressa', avatar: 'assets/img/profiles/avatar-23.jpg', updated: '03 May 2024', status: 'Active' },
  { id: 'FG24007', name: 'Laboratory Fees', code: 'FG24007', category: 'Academic', tint: 'teal', icon: 'ti ti-flask', academicYear: '2024/2025', classes: 'VIII – XII', sections: 'A, B, C', components: ['Science', 'Computer Lab'], feeItems: 3, frequency: 'Term', effectiveFrom: '01 May 2024', nextDue: '05 May 2024', amount: 340, assignedStudents: 290, createdBy: 'George', avatar: 'assets/img/profiles/avatar-25.jpg', updated: '09 May 2024', status: 'Draft' },
  { id: 'FG24008', name: 'Admission Fees', code: 'FG24008', category: 'One-time', tint: 'pink', icon: 'ti ti-user-plus', academicYear: '2024/2025', classes: 'I – XII', sections: 'All', components: ['Admission', 'Registration'], feeItems: 2, frequency: 'One-time', effectiveFrom: '01 Apr 2024', nextDue: '05 May 2024', amount: 900, assignedStudents: 120, createdBy: 'Elisa', avatar: 'assets/img/profiles/avatar-01.jpg', updated: '01 May 2024', status: 'Active' },
  { id: 'FG24009', name: 'Miscellaneous Fees', code: 'FG24009', category: 'Other', tint: 'secondary', icon: 'ti ti-receipt', academicYear: '2024/2025', classes: 'I – XII', sections: 'All', components: ['ID Card', 'Diary', 'Uniform'], feeItems: 3, frequency: 'Annual', effectiveFrom: '01 Apr 2024', nextDue: '05 May 2024', amount: 180, assignedStudents: 840, createdBy: 'Kevin Larry', avatar: 'assets/img/profiles/avatar-27.jpg', updated: '04 May 2024', status: 'Active' },
  { id: 'FG24010', name: 'Special Coaching (Legacy)', code: 'FG24010', category: 'Academic', tint: 'dark', icon: 'ti ti-notebook', academicYear: '2023/2024', classes: 'XI – XII', sections: 'A', components: ['Coaching', 'Study Material'], feeItems: 2, frequency: 'Monthly', effectiveFrom: '01 Apr 2023', nextDue: '05 Nov 2024', amount: 540, assignedStudents: 60, createdBy: 'Kevin Larry', avatar: 'assets/img/profiles/avatar-27.jpg', updated: '18 Nov 2023', status: 'Archived' },
];

/* -------------------------------- Derivations ------------------------------- */

export const money = (value: number): string => `$${value.toLocaleString('en-US')}`;

/** The template's sentence, including its "a academic" article bug. */
export const descriptionOf = (row: FeeGroup): string =>
  `${row.name} — a ${row.category.toLowerCase()} fee group billed ${row.frequency.toLowerCase()}, effective ${row.effectiveFrom} for classes ${row.classes}.`;

export const classesAndSectionsOf = (row: FeeGroup): string =>
  `Classes ${row.classes} · Sections ${row.sections}.`;

export const paymentScheduleOf = (row: FeeGroup): string =>
  `${row.frequency} collection · next due ${row.nextDue}.`;

export const assignedSummaryOf = (row: FeeGroup): string =>
  `${row.assignedStudents} students across ${row.classes} · total ${money(row.amount)} per cycle.`;

const remarksByStatus: Record<GroupStatus, string> = {
  Active: 'Active fee group used in current collections.',
  Scheduled: 'Scheduled — activates on the effective date.',
  Draft: 'Draft — not yet applied to fee groups.',
  Archived: 'Archived — retained for historical billing only.',
};

export const remarksOf = (row: FeeGroup): string => remarksByStatus[row.status];

/** Identical on all ten rows. */
export const discountRules = 'Sibling 10% · Merit scholarship 15% · Staff ward 20%.';
export const lateFeeRules = '$5 per day after the due date, capped at 10% of the fee.';

export const searchIndexOf = (row: FeeGroup): string =>
  [row.name, row.code, row.category, row.frequency, row.academicYear, row.createdBy, row.status, ...row.components]
    .join(' ')
    .toLowerCase();

/* --------------------------------- Options ---------------------------------- */

export const academicYearOptions = ['2024/2025', '2023/2024'];
export const feeGroupOptions = feeGroups.map((row) => row.name);
export const feeCategoryOptions: GroupCategory[] = [
  'Academic', 'Transport', 'Boarding', 'Facility', 'One-time', 'Other',
];
export const classOptions = ['I – XII', 'VI – XII', 'IX – XII', 'VIII – XII', 'XI – XII'];
export const sectionOptions = ['All', 'A, B', 'A, B, C'];
export const statusOptions: GroupStatus[] = ['Active', 'Draft', 'Scheduled', 'Archived'];
export const frequencyOptions: GroupFrequency[] = ['Monthly', 'Quarterly', 'Term', 'Annual', 'One-time'];
