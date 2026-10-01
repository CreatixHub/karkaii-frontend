/* -------------------------------------------------------------------------- */
/*                                 Saved views                                */
/* -------------------------------------------------------------------------- */

export interface SavedView {
  id: string;
  label: string;
  icon: string;
}

export const savedViews: SavedView[] = [
  { id: 'all', label: 'All Guardians', icon: 'ti ti-layout-list' },
  { id: 'active', label: 'Active Guardians', icon: 'ti ti-circle-check' },
  { id: 'new', label: 'New This Month', icon: 'ti ti-sparkles' },
  { id: 'verified', label: 'Verified', icon: 'ti ti-discount' },
  { id: 'pending', label: 'Pending Verification', icon: 'ti ti-clock-hour-4' },
];

/* -------------------------------------------------------------------------- */
/*                                Quick filters                               */
/* -------------------------------------------------------------------------- */

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

/* -------------------------------------------------------------------------- */
/*                              Advanced filters                              */
/* -------------------------------------------------------------------------- */

export type FilterKey = 'relationship' | 'student' | 'class' | 'section' | 'status' | 'branch' | 'dateJoined';

export interface AdvancedFilterField {
  /** `id` on the template's `<select>`, kept so labels still bind correctly. */
  inputId: string;
  id: FilterKey;
  label: string;
  options: string[];
  /** Full-width date range rather than a select — only Date Joined. */
  type?: 'select' | 'dateRange';
}

export const advancedFilters: AdvancedFilterField[] = [
  {
    inputId: 'relationship',
    id: 'relationship',
    label: 'Relationship',
    options: ['Father', 'Mother', 'Grandparent', 'Relative', 'Caretaker', 'Legal Guardian'],
  },
  { inputId: 'student', id: 'student', label: 'Student', options: ['Janet', 'Joann', 'Kathleen'] },
  { inputId: 'class', id: 'class', label: 'Class', options: ['III', 'IV', 'V'] },
  { inputId: 'section', id: 'section', label: 'Section', options: ['A', 'B', 'C'] },
  { inputId: 'status', id: 'status', label: 'Status', options: ['Active', 'Inactive', 'Verified', 'Pending'] },
  { inputId: 'branch', id: 'branch', label: 'Branch', options: ['Primary Campus', 'North Branch', 'West Branch'] },
  { inputId: 'date-joined', id: 'dateJoined', label: 'Date Joined', options: [], type: 'dateRange' },
];

/* -------------------------------------------------------------------------- */
/*                             Column visibility                              */
/* -------------------------------------------------------------------------- */

/** Card sections the Columns menu can hide. `lastLogin` ships unchecked. */
export type ColumnId = 'occupation' | 'branch' | 'performance' | 'lastLogin';

export interface ColumnDef {
  id: ColumnId;
  label: string;
}

export const columnDefs: ColumnDef[] = [
  { id: 'occupation', label: 'Occupation' },
  { id: 'branch', label: 'Branch' },
  { id: 'performance', label: 'Performance' },
  { id: 'lastLogin', label: 'Last Login' },
];

export const defaultColumns: Record<ColumnId, boolean> = {
  occupation: true,
  branch: true,
  performance: true,
  lastLogin: false,
};

export const allColumns: Record<ColumnId, boolean> = {
  occupation: true,
  branch: true,
  performance: true,
  lastLogin: true,
};

/* -------------------------------------------------------------------------- */
/*                                   Density                                  */
/* -------------------------------------------------------------------------- */

export type DensityId = 'compact' | 'default' | 'comfortable';

export interface DensityOption {
  id: DensityId;
  title: string;
  icon: string;
}

export const densityOptions: DensityOption[] = [
  { id: 'compact', title: 'Compact', icon: 'ti ti-baseline-density-small' },
  { id: 'default', title: 'Default', icon: 'ti ti-baseline-density-medium' },
  { id: 'comfortable', title: 'Comfortable', icon: 'ti ti-baseline-density-large' },
];

/* -------------------------------------------------------------------------- */
/*                                    Sort                                    */
/* -------------------------------------------------------------------------- */

export type SortKey = 'name' | 'students' | 'branch' | 'recent';

export interface SortOption {
  id: SortKey;
  label: string;
  icon: string;
}

export const sortOptions: SortOption[] = [
  { id: 'name', label: 'Guardian name (A–Z)', icon: 'ti ti-abc' },
  { id: 'students', label: 'Student count', icon: 'ti ti-users' },
  { id: 'branch', label: 'Branch', icon: 'ti ti-building' },
  { id: 'recent', label: 'Recently added', icon: 'ti ti-clock' },
];

/* -------------------------------------------------------------------------- */
/*                              Menus and modals                              */
/* -------------------------------------------------------------------------- */

export type ToolbarMenu = 'views' | 'filters' | 'columns' | 'sort' | null;

export type GuardianModalId = 'import' | 'add' | 'edit' | 'viewDetails' | 'delete';

export interface ExportAction {
  id: string;
  label: string;
  icon: string;
}

export const exportActions: ExportAction[] = [
  { id: 'pdf', label: 'Export as PDF', icon: 'ti ti-file-type-pdf' },
  { id: 'excel', label: 'Export as Excel', icon: 'ti ti-file-type-xls' },
];

/** The Child multi-select in Add/Edit Guardian (`guardian-grid.html` L2646). */
export const childOptions = [
  { value: 'Janet', label: 'Janet' },
  { value: 'Joann', label: 'Joann' },
  { value: 'Kathleen', label: 'Kathleen' },
  { value: 'Gifford', label: 'Gifford' },
];
