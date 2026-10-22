export type FeeStatus = 'Active' | 'Scheduled' | 'Draft' | 'Archived';
export type FeeCategory = 'Academic' | 'Transport' | 'Boarding' | 'Facility' | 'One-time' | 'Other';
export type FeeFrequency = 'Monthly' | 'Quarterly' | 'Term' | 'Annual' | 'One-time';

export interface FeeType {
  id: string;
  name: string;
  code: string;
  category: FeeCategory;
  /** Per-row, not per-category — see the file header. */
  tint: string;
  icon: string;
  frequency: FeeFrequency;
  amount: number;
  /** "I – XII", the template's en-dashed class range. */
  classes: string;
  academicYear: string;
  createdBy: string;
  avatar: string;
  updated: string;
  status: FeeStatus;
  taxable: boolean;
  refundable: boolean;
  lateFee: boolean;
}

export const statusPill: Record<FeeStatus, string> = {
  Active: 'is-active',
  Scheduled: 'is-scheduled',
  Draft: 'is-inactive',
  Archived: 'is-archived',
};

export const statusBadge: Record<FeeStatus, string> = {
  Active: 'badge badge-soft-success',
  Scheduled: 'badge badge-soft-info',
  Draft: 'badge badge-soft-secondary',
  Archived: 'badge badge-soft-dark',
};

export const feeTypes: FeeType[] = [
  { id: 'FT2401', name: 'Tuition Fee', code: 'FT2401', category: 'Academic', tint: 'primary', icon: 'ti ti-school', frequency: 'Monthly', amount: 1250, classes: 'I – XII', academicYear: '2024/2025', createdBy: 'Kevin Larry', avatar: 'assets/img/profiles/avatar-27.jpg', updated: '12 May 2024', status: 'Active', taxable: true, refundable: false, lateFee: true },
  { id: 'FT2402', name: 'Transport Fee', code: 'FT2402', category: 'Transport', tint: 'info', icon: 'ti ti-bus', frequency: 'Monthly', amount: 480, classes: 'I – XII', academicYear: '2024/2025', createdBy: 'Teressa', avatar: 'assets/img/profiles/avatar-23.jpg', updated: '10 May 2024', status: 'Active', taxable: true, refundable: false, lateFee: true },
  { id: 'FT2403', name: 'Hostel Fee', code: 'FT2403', category: 'Boarding', tint: 'success', icon: 'ti ti-building-community', frequency: 'Quarterly', amount: 2100, classes: 'VI – XII', academicYear: '2024/2025', createdBy: 'George', avatar: 'assets/img/profiles/avatar-25.jpg', updated: '08 May 2024', status: 'Active', taxable: false, refundable: true, lateFee: true },
  { id: 'FT2404', name: 'Exam Fee', code: 'FT2404', category: 'Academic', tint: 'warning', icon: 'ti ti-file-certificate', frequency: 'Term', amount: 320, classes: 'IX – XII', academicYear: '2024/2025', createdBy: 'Elisa', avatar: 'assets/img/profiles/avatar-01.jpg', updated: '11 May 2024', status: 'Scheduled', taxable: false, refundable: false, lateFee: false },
  { id: 'FT2405', name: 'Library Fee', code: 'FT2405', category: 'Facility', tint: 'purple', icon: 'ti ti-books', frequency: 'Annual', amount: 150, classes: 'I – XII', academicYear: '2024/2025', createdBy: 'Kevin Larry', avatar: 'assets/img/profiles/avatar-27.jpg', updated: '06 May 2024', status: 'Active', taxable: false, refundable: true, lateFee: false },
  { id: 'FT2406', name: 'Sports Fee', code: 'FT2406', category: 'Facility', tint: 'danger', icon: 'ti ti-run', frequency: 'Annual', amount: 260, classes: 'I – XII', academicYear: '2024/2025', createdBy: 'Teressa', avatar: 'assets/img/profiles/avatar-23.jpg', updated: '03 May 2024', status: 'Active', taxable: true, refundable: false, lateFee: false },
  { id: 'FT2407', name: 'Laboratory Fee', code: 'FT2407', category: 'Academic', tint: 'teal', icon: 'ti ti-flask', frequency: 'Term', amount: 340, classes: 'VIII – XII', academicYear: '2024/2025', createdBy: 'George', avatar: 'assets/img/profiles/avatar-25.jpg', updated: '09 May 2024', status: 'Draft', taxable: false, refundable: false, lateFee: true },
  { id: 'FT2408', name: 'Admission Fee', code: 'FT2408', category: 'One-time', tint: 'pink', icon: 'ti ti-user-plus', frequency: 'One-time', amount: 900, classes: 'I – XII', academicYear: '2024/2025', createdBy: 'Elisa', avatar: 'assets/img/profiles/avatar-01.jpg', updated: '01 May 2024', status: 'Active', taxable: true, refundable: false, lateFee: false },
  { id: 'FT2409', name: 'Uniform Fee', code: 'FT2409', category: 'Other', tint: 'secondary', icon: 'ti ti-shirt', frequency: 'Annual', amount: 180, classes: 'I – XII', academicYear: '2024/2025', createdBy: 'Kevin Larry', avatar: 'assets/img/profiles/avatar-27.jpg', updated: '04 May 2024', status: 'Active', taxable: true, refundable: true, lateFee: false },
  { id: 'FT2410', name: 'Coaching Fee (Legacy)', code: 'FT2410', category: 'Academic', tint: 'dark', icon: 'ti ti-notebook', frequency: 'Monthly', amount: 540, classes: 'XI – XII', academicYear: '2023/2024', createdBy: 'Kevin Larry', avatar: 'assets/img/profiles/avatar-27.jpg', updated: '18 Nov 2023', status: 'Archived', taxable: false, refundable: false, lateFee: true },
];

/* -------------------------------- Derivations ------------------------------- */

export const money = (value: number): string => `$${value.toLocaleString('en-US')}`;

/**
 * The template's own sentence, article bug and all — it writes "a" before every
 * category, giving "a academic fee". Preserved deliberately.
 */
export const descriptionOf = (row: FeeType): string =>
  `${row.name} — a ${row.category.toLowerCase()} fee billed ${row.frequency.toLowerCase()} at ${money(row.amount)}, applicable to classes ${row.classes}.`;

export const applicableClassesOf = (row: FeeType): string =>
  `Classes ${row.classes} · ${row.academicYear}.`;

export const lateFeeTextOf = (row: FeeType): string =>
  row.lateFee
    ? '$5 per day after due date, capped at 10% of the fee.'
    : 'No late fee applied to this fee type.';

export const taxTextOf = (row: FeeType): string =>
  row.taxable ? 'GST 5% applicable · tax-inclusive invoice.' : 'Exempt from tax · no GST charged.';

export const paymentFrequencyTextOf = (row: FeeType): string =>
  `${row.frequency} collection cycle · created by ${row.createdBy} · updated ${row.updated}.`;

const remarksByStatus: Record<FeeStatus, string> = {
  Active: 'Active fee type used in current collections.',
  Scheduled: 'Scheduled — activates on the effective date.',
  Draft: 'Draft — not yet applied to fee groups.',
  Archived: 'Archived — retained for historical billing only.',
};

export const remarksOf = (row: FeeType): string => remarksByStatus[row.status];

/** Identical on all ten rows in the template, so it is a constant, not a field. */
export const discountConfiguration = 'Sibling 10% · Merit 15% · Staff ward 20%.';

/** The template's search index: name, code, category, frequency, year, author. */
export const searchIndexOf = (row: FeeType): string =>
  [
    row.name, row.code, row.category, row.frequency, row.academicYear, row.createdBy, row.status,
    row.taxable ? 'taxable' : 'non-taxable',
    row.refundable ? 'refundable' : 'non-refundable',
  ]
    .join(' ')
    .toLowerCase();

/* --------------------------------- Options ---------------------------------- */

export const academicYearOptions = ['2024/2025', '2023/2024'];
export const feeTypeOptions = feeTypes.map((row) => row.name);
export const feeCategoryOptions: FeeCategory[] = [
  'Academic', 'Transport', 'Boarding', 'Facility', 'One-time', 'Other',
];
export const frequencyOptions: FeeFrequency[] = ['Monthly', 'Quarterly', 'Term', 'Annual', 'One-time'];
export const taxOptions = ['Taxable', 'Non-taxable'];
export const statusOptions: FeeStatus[] = ['Active', 'Draft', 'Scheduled', 'Archived'];
