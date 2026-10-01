/** The nine dialogs in `students.html`. */
export type StudentModalId =
  | 'collectFees'
  | 'delete'
  | 'attendance'
  | 'fees'
  | 'result'
  | 'timetable'
  | 'library'
  | 'leaves'
  | 'promote';

export interface SavedView {
  id: string;
  label: string;
  icon: string;
}

export const savedViews: SavedView[] = [
  { id: 'all', label: 'All Students', icon: 'ti ti-layout-grid' },
  { id: 'Active', label: 'Active', icon: 'ti ti-circle-check' },
  { id: 'Inactive', label: 'Inactive', icon: 'ti ti-circle-x' },
  { id: 'Graduated', label: 'Graduated', icon: 'ti ti-certificate' },
  { id: 'Transfer', label: 'Transfer', icon: 'ti ti-transfer' },
];

export interface QuickFilter {
  id: string;
  label: string;
  icon: string;
}

export const quickFilters: QuickFilter[] = [
  { id: 'Active', label: 'Active', icon: 'ti ti-user-check' },
  { id: 'Inactive', label: 'Inactive', icon: 'ti ti-user-off' },
  { id: 'Graduated', label: 'Graduated', icon: 'ti ti-certificate' },
  { id: 'Transfer', label: 'Transfer', icon: 'ti ti-transfer' },
  { id: 'Leave', label: 'On Leave', icon: 'ti ti-plane-departure' },
];

export type SortKey = 'name' | 'status' | 'class' | 'join' | 'recent';

export const sortOptions: { id: SortKey; label: string; icon: string }[] = [
  { id: 'name', label: 'Student name (A–Z)', icon: 'ti ti-abc' },
  { id: 'status', label: 'Status', icon: 'ti ti-flag' },
  { id: 'class', label: 'Class', icon: 'ti ti-school' },
  { id: 'join', label: 'Date of join', icon: 'ti ti-calendar' },
  { id: 'recent', label: 'Recently added', icon: 'ti ti-clock' },
];

/** Fields in the advanced filter panel, in template order. */
export interface AdvancedFilter {
  id: string;
  label: string;
  options: string[];
}

export const advancedFilters: AdvancedFilter[] = [
  { id: 'class', label: 'Class', options: ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'] },
  { id: 'section', label: 'Section', options: ['A', 'B', 'C'] },
  { id: 'gender', label: 'Gender', options: ['Male', 'Female'] },
  { id: 'status', label: 'Status', options: ['Active', 'Inactive', 'Transfer', 'Graduated', 'Suspended', 'Leave'] },
  { id: 'transport', label: 'Transport', options: ['Yes', 'No'] },
  { id: 'hostel', label: 'Hostel', options: ['Yes', 'No'] },
  { id: 'scholarship', label: 'Scholarship', options: ['Yes', 'No'] },
  { id: 'year', label: 'Academic Year', options: ['2024/2025', '2023/2024'] },
];

export const academicYears = ['2024 / 2025', '2023 / 2024', '2022 / 2023'];
