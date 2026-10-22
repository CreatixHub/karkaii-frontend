export interface StatCard {
  id: string;
  label: string;
  value: string;
  icon: string;
  className: string;
}

export const statCards: StatCard[] = [
  { id: 'total', label: 'Total Records', value: '1,248', icon: 'ti ti-settings-cog', className: 'bg-primary-transparent text-primary' },
  { id: 'active', label: 'Active', value: '1,120', icon: 'ti ti-circle-check', className: 'bg-success-transparent text-success' },
  { id: 'pending', label: 'Pending', value: '86', icon: 'ti ti-clock', className: 'bg-warning-transparent text-warning' },
  { id: 'month', label: 'This Month', value: '214', icon: 'ti ti-calendar', className: 'bg-info-transparent text-info' },
];

export type BranchStatus =
  | 'Active'
  | 'Pending'
  | 'Completed'
  | 'Inactive'
  | 'Scheduled';

export interface Branch {
  id: string;
  name: string;
  students: number;
  staff: number;
  revenue: string;
  status: BranchStatus;
  /** Avatar tint, cycling exactly as the template's eight rows do. */
  avatarClass: string;
}

/** Names of the eight rows the HTML renders, in order. */
const VISIBLE_NAMES = [
  'Aaron Cooper',
  'Bianca Reid',
  'Carlos Mendez',
  'Dana White',
  'Ethan Brooks',
  'Fatima Noor',
  'Grace Lee',
  'Hassan Ali',
];

/** Filler names for pages two to six, continuing the alphabet. */
const EXTRA_NAMES = [
  'Isabel Ortiz', 'Jamal Rivers', 'Katie Nolan', 'Liam Foster', 'Maya Sinclair',
  'Noah Bennett', 'Olivia Grant', 'Priya Raman', 'Quentin Hale', 'Rosa Delgado',
  'Samuel Yates', 'Tara Whitfield', 'Umar Farooq', 'Vera Lindqvist', 'Wesley Adams',
  'Ximena Rojas', 'Yusuf Demir', 'Zara Malik', 'Adrian Vasquez', 'Beatrice Cole',
  'Caleb Duarte', 'Delphine Marchand', 'Elias Novak', 'Freya Sandberg', 'Gabriel Otieno',
  'Hana Kobayashi', 'Ibrahim Toure', 'Julia Costa', 'Kofi Mensah', 'Lucia Ferrari',
  'Mateo Silva', 'Nadia Haddad', 'Oscar Lindgren', 'Petra Kovacs', 'Rafael Moreno',
  'Sofia Petrova', 'Tomas Almeida', 'Ulla Virtanen', 'Victor Nwosu', 'Wilma Eriksson',
];

const STATUS_CYCLE: BranchStatus[] = [
  'Active',
  'Pending',
  'Completed',
  'Active',
  'Inactive',
  'Scheduled',
  'Active',
  'Pending',
];

const AVATAR_CYCLE = [
  'bg-primary-transparent text-primary',
  'bg-success-transparent text-success',
  'bg-info-transparent text-info',
  'bg-warning-transparent text-warning',
  'bg-danger-transparent text-danger',
  'bg-secondary-transparent text-secondary',
  'bg-primary-transparent text-primary',
  'bg-success-transparent text-success',
];

const ALL_NAMES = [...VISIBLE_NAMES, ...EXTRA_NAMES];

export const branches: Branch[] = ALL_NAMES.map((name, index) => ({
  id: `br-${index + 1}`,
  name,
  students: 12 + index * 7,
  staff: 12 + index * 7,
  revenue: `$${(1200 + index * 137).toLocaleString()}`,
  status: STATUS_CYCLE[index % STATUS_CYCLE.length],
  avatarClass: AVATAR_CYCLE[index % AVATAR_CYCLE.length],
}));

/** Badge styling per status, taken from the template's eight rows. */
export const STATUS_BADGE: Record<BranchStatus, string> = {
  Active: 'badge-soft-success',
  Pending: 'badge-soft-warning',
  Completed: 'badge-soft-info',
  Inactive: 'badge-soft-danger',
  Scheduled: 'badge-soft-secondary',
};

/** Options in the header filter; "All Status" clears it. */
export const STATUS_FILTER_OPTIONS = ['All Status', 'Active', 'Pending', 'Inactive'];

/** Options in the modals' status field. */
export const STATUS_FORM_OPTIONS = ['Active', 'Pending', 'Inactive'];

export const ROWS_PER_PAGE_OPTIONS = [8, 25, 50, 100];

export const exportOptions = [
  { id: 'pdf', label: 'PDF', icon: 'ti ti-file-type-pdf' },
  { id: 'excel', label: 'Excel', icon: 'ti ti-file-type-xls' },
];
