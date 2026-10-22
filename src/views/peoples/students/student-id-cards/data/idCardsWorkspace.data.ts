export interface SummaryStat {
  id: string;
  tint: string;
  icon: string;
  label: string;
  value: string;
  /** The template varies the heading level per tile; kept so the markup matches. */
  tag: 'h4' | 'h5' | 'h6';
  valueClass: string;
  hint: string;
}

/** The five tiles in the "ID Card Summary" card. */
export const summaryStats: SummaryStat[] = [
  {
    id: 'students',
    tint: 'bg-primary-transparent text-primary',
    icon: 'ti ti-users',
    label: 'Total Students',
    value: '1,248',
    tag: 'h4',
    valueClass: 'fs-16 mb-0 fw-medium',
    hint: 'on roll for 2026-2027',
  },
  {
    id: 'generated',
    tint: 'bg-info-transparent text-info',
    icon: 'ti ti-id',
    label: 'Cards Generated',
    value: '1,196',
    tag: 'h5',
    valueClass: 'fs-16 mb-0',
    hint: '95% of the roll',
  },
  {
    id: 'printed',
    tint: 'bg-purple-transparent text-purple',
    icon: 'ti ti-printer',
    label: 'Printed',
    value: '1,164',
    tag: 'h6',
    valueClass: 'fs-16 mb-0',
    hint: 'of 1,196 generated',
  },
  {
    id: 'issued',
    tint: 'bg-success-transparent text-success',
    icon: 'ti ti-circle-check',
    label: 'Issued',
    value: '1,131',
    tag: 'h6',
    valueClass: 'fs-16 mb-0',
    hint: 'handed to the student',
  },
  {
    id: 'pending',
    tint: 'bg-warning-transparent text-warning',
    icon: 'ti ti-clock',
    label: 'Pending Issue',
    value: '33',
    tag: 'h6',
    valueClass: 'fs-16 mb-0',
    hint: 'printed, waiting at the office',
  },
];

export interface SavedView {
  id: string;
  label: string;
  icon: string;
  count: string;
}

/** Saved views, with the counts the template printed against them. */
export const savedViews: SavedView[] = [
  { id: 'all', label: 'All Cards', icon: 'ti ti-layout-list', count: '1,196' },
  { id: 'pending', label: 'Pending Issue', icon: 'ti ti-clock', count: '33' },
  { id: 'awaiting', label: 'Awaiting Print', icon: 'ti ti-printer', count: '32' },
  { id: 'noPhoto', label: 'Photograph Missing', icon: 'ti ti-photo-off', count: '52' },
  { id: 'replacements', label: 'Replacements', icon: 'ti ti-refresh', count: '27' },
];

export interface FilterField {
  id: string;
  label: string;
  /** Omitted when the field has no "All" choice, as with Academic Year. */
  all?: boolean;
  options: string[];
}

/** The eight controls in the advanced filter panel, in template order. */
export const filterFields: FilterField[] = [
  {
    id: 'class',
    label: 'Class',
    all: true,
    options: ['Class II', 'Class IV', 'Class V', 'Class VI', 'Class VII', 'Class IX', 'Class X'],
  },
  { id: 'section', label: 'Section', all: true, options: ['A', 'B', 'C'] },
  { id: 'academic-year', label: 'Academic Year', options: ['2026-2027', '2025-2026', '2024-2025'] },
  {
    id: 'card-status',
    label: 'Card Status',
    all: true,
    options: ['Not Generated', 'Print Queued', 'Printed', 'Reprinted', 'Superseded'],
  },
  {
    id: 'issue-status',
    label: 'Issue Status',
    all: true,
    options: [
      'Issued',
      'Replacement Issued',
      'Ready to Issue',
      'Pending Print',
      'Reported Lost',
      'Blocked',
    ],
  },
  { id: 'house', label: 'House', all: true, options: ['Everest', 'Nilgiri', 'Aravalli', 'Vindhya'] },
];

export interface ColumnOption {
  id: string;
  label: string;
}

/** The nine toggleable columns. */
export const columnOptions: ColumnOption[] = [
  { id: 'student', label: 'Student' },
  { id: 'admissionNo', label: 'Admission No.' },
  { id: 'class', label: 'Class' },
  { id: 'section', label: 'Section' },
  { id: 'cardNumber', label: 'Card Number' },
  { id: 'generatedOn', label: 'Generated On' },
  { id: 'issueDate', label: 'Issue Date' },
  { id: 'cardStatus', label: 'Card Status' },
  { id: 'issueStatus', label: 'Issue Status' },
];

export type Density = 'compact' | 'default' | 'comfortable';

export interface DensityOption {
  id: Density;
  icon: string;
  title: string;
  label: string;
}

export const densityOptions: DensityOption[] = [
  { id: 'compact', icon: 'ti ti-baseline-density-small', title: 'Compact', label: 'Compact rows' },
  { id: 'default', icon: 'ti ti-baseline-density-medium', title: 'Default', label: 'Default rows' },
  {
    id: 'comfortable',
    icon: 'ti ti-baseline-density-large',
    title: 'Comfortable',
    label: 'Comfortable rows',
  },
];

export interface QuickFilter {
  id: string;
  label: string;
  icon: string;
  count: string;
}

/** Quick filter rail, with the template's counts. */
export const quickFilters: QuickFilter[] = [
  { id: 'all', label: 'All', icon: 'ti ti-layout-list', count: '1,196' },
  { id: 'printed', label: 'Printed', icon: 'ti ti-printer', count: '1,164' },
  { id: 'issued', label: 'Issued', icon: 'ti ti-circle-check', count: '1,131' },
  { id: 'pending', label: 'Pending', icon: 'ti ti-clock', count: '33' },
  { id: 'replacements', label: 'Replacements', icon: 'ti ti-refresh', count: '27' },
  { id: 'noPhoto', label: 'No Photo', icon: 'ti ti-photo-off', count: '52' },
];

export type SortKey = 'card' | 'name' | 'class' | 'generated' | 'issue';

export const sortOptions: { id: SortKey; label: string; icon: string }[] = [
  { id: 'card', label: 'Card number', icon: 'ti ti-hash' },
  { id: 'name', label: 'Student name (A–Z)', icon: 'ti ti-abc' },
  { id: 'class', label: 'Class and section', icon: 'ti ti-school' },
  { id: 'generated', label: 'Generated on', icon: 'ti ti-calendar-event' },
  { id: 'issue', label: 'Issue status', icon: 'ti ti-circle-check' },
];

/** Rows-per-page choices in the card footer. */
export const pageSizes = ['8', '25', '50', '100'];

/** The page buttons the template rendered; the roll is far bigger than the demo rows. */
export const pageNumbers = ['1', '2', '3'];

export const lastPage = '150';

/** Headline totals the toolbar and footer quote. */
export const totalCards = '1,196';

export const academicYear = '2026-2027';

export const defaultFromDate = '01-06-2026';

export const defaultToDate = '31-07-2026';
