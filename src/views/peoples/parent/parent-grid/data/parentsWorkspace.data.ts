export interface SavedView {
  id: string;
  label: string;
  icon: string;
}

export const savedViews: SavedView[] = [
  { id: 'all', label: 'All Parents', icon: 'ti ti-layout-list' },
  { id: 'active', label: 'Active Parents', icon: 'ti ti-circle-check' },
  { id: 'new', label: 'New This Month', icon: 'ti ti-sparkles' },
  { id: 'verified', label: 'Verified', icon: 'ti ti-discount' },
  { id: 'pending', label: 'Pending Verification', icon: 'ti ti-clock-hour-4' },
];

export interface QuickFilter {
  id: string;
  label: string;
  icon: string;
}

export const quickFilters: QuickFilter[] = [
  { id: 'active', label: 'Active', icon: 'ti ti-circle-check' },
  { id: 'new', label: 'New', icon: 'ti ti-sparkles' },
  { id: 'inactive', label: 'Inactive', icon: 'ti ti-circle-x' },
  { id: 'verified', label: 'Verified', icon: 'ti ti-discount' },
  { id: 'pending', label: 'Pending', icon: 'ti ti-clock-hour-4' },
];

export interface AdvancedFilterField {
  id: string;
  label: string;
  options: string[];
}

export const advancedFilters: AdvancedFilterField[] = [
  { id: 'parentType', label: 'Parent Type', options: ['Father', 'Mother', 'Guardian'] },
  { id: 'student', label: 'Student', options: ['Janet', 'Joann', 'Kathleen'] },
  { id: 'class', label: 'Class', options: ['III', 'IV', 'V'] },
  { id: 'section', label: 'Section', options: ['A', 'B', 'C'] },
  { id: 'status', label: 'Status', options: ['Active', 'Inactive', 'Verified', 'Pending'] },
  { id: 'branch', label: 'Branch', options: ['Primary Campus', 'North Branch', 'West Branch'] },
];

export type SortKey = 'name' | 'students' | 'branch' | 'recent';

export const sortOptions: { id: SortKey; label: string; icon: string }[] = [
  { id: 'name', label: 'Parent name (A–Z)', icon: 'ti ti-abc' },
  { id: 'students', label: 'Student count', icon: 'ti ti-users' },
  { id: 'branch', label: 'Branch', icon: 'ti ti-building' },
  { id: 'recent', label: 'Recently added', icon: 'ti ti-clock' },
];

export type ToolbarMenu = 'views' | 'filter' | 'sort' | null;

export type ParentModalId = 'import' | 'add' | 'edit' | 'viewDetails' | 'delete';
