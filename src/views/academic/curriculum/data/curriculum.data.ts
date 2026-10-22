export type CurriculumCategory = 'core' | 'elective';

export type CurriculumStatus = 'Published' | 'In Review' | 'Draft';

export type CurriculumModalId =
  | 'add'
  | 'edit'
  | 'details'
  | 'addUnit'
  | 'addLesson'
  | 'addActivity'
  | 'assignClasses'
  | 'import'
  | 'delete';

export type LayoutView = 'grid' | 'list';

export interface CurriculumCard {
  /** `data-cur-target` in the template. */
  id: string;
  name: string;
  /** "Grade 10 · Section A · Mathematics" */
  meta: string;
  category: CurriculumCategory;
  /** The type badge — Core or Elective. */
  typeLabel: string;
  typeBadge: string;
  status: CurriculumStatus;
  statusBadge: string;
  icon: string;
  tone: string;
  percent: number;
  /** `bg-*` on the progress bar, which does not track `tone`. */
  barClass: string;
  units: number;
  lessons: number;
  topics: number;
  updated: string;
  favorite: boolean;
}

export const curriculumCards: CurriculumCard[] = [
  {
    id: 'cur_0',
    name: 'Mathematics',
    meta: 'Grade 10 · Section A · Mathematics',
    category: 'core',
    typeLabel: 'Core',
    typeBadge: 'badge-soft-primary',
    status: 'Published',
    statusBadge: 'badge-soft-success',
    icon: 'ti ti-math',
    tone: 'primary',
    percent: 68,
    barClass: 'bg-success',
    units: 8,
    lessons: 32,
    topics: 96,
    updated: 'Updated 2h ago',
    favorite: true,
  },
  {
    id: 'cur_1',
    name: 'Physics',
    meta: 'Grade 11 · Section B · Physics',
    category: 'core',
    typeLabel: 'Core',
    typeBadge: 'badge-soft-primary',
    status: 'In Review',
    statusBadge: 'badge-soft-warning',
    icon: 'ti ti-atom',
    tone: 'info',
    percent: 45,
    barClass: 'bg-warning',
    units: 6,
    lessons: 24,
    topics: 60,
    updated: 'Updated 5h ago',
    favorite: false,
  },
  {
    id: 'cur_2',
    name: 'English Literature',
    meta: 'Grade 9 · Section A · English',
    category: 'core',
    typeLabel: 'Core',
    typeBadge: 'badge-soft-primary',
    status: 'Published',
    statusBadge: 'badge-soft-success',
    icon: 'ti ti-book',
    tone: 'success',
    percent: 82,
    barClass: 'bg-success',
    units: 7,
    lessons: 28,
    topics: 70,
    updated: 'Updated 1d ago',
    favorite: false,
  },
  {
    id: 'cur_3',
    name: 'Computer Science',
    meta: 'Grade 10 · Section B · Computing',
    category: 'elective',
    typeLabel: 'Elective',
    typeBadge: 'badge-soft-info',
    status: 'Draft',
    statusBadge: 'badge-soft-secondary',
    icon: 'ti ti-code',
    tone: 'warning',
    percent: 30,
    barClass: 'bg-info',
    units: 5,
    lessons: 20,
    topics: 48,
    updated: 'Updated 3d ago',
    favorite: false,
  },
  {
    id: 'cur_4',
    name: 'Biology',
    meta: 'Grade 11 · Section A · Biology',
    category: 'core',
    typeLabel: 'Core',
    typeBadge: 'badge-soft-primary',
    status: 'Published',
    statusBadge: 'badge-soft-success',
    icon: 'ti ti-dna',
    tone: 'teal',
    percent: 55,
    barClass: 'bg-success',
    units: 6,
    lessons: 26,
    topics: 64,
    updated: 'Updated 2d ago',
    favorite: true,
  },
  {
    id: 'cur_5',
    name: 'Chemistry',
    meta: 'Grade 12 · Section A · Chemistry',
    category: 'elective',
    typeLabel: 'Elective',
    typeBadge: 'badge-soft-info',
    status: 'Draft',
    statusBadge: 'badge-soft-secondary',
    icon: 'ti ti-flask',
    tone: 'danger',
    percent: 12,
    barClass: 'bg-danger',
    units: 9,
    lessons: 36,
    topics: 90,
    updated: 'Updated 4d ago',
    favorite: false,
  },
];

/* -------------------------------------------------------------------------- */
/*                                 Navigation rail                            */
/* -------------------------------------------------------------------------- */

export interface NavFilter {
  id: 'all' | CurriculumCategory;
  label: string;
  icon: string;
  badge: string;
  badgeClass: string;
}

export const navFilters: NavFilter[] = [
  { id: 'all', label: 'All Curriculum', icon: 'ti ti-stack-2', badge: '6', badgeClass: 'badge-soft-primary' },
  { id: 'core', label: 'Core Subjects', icon: 'ti ti-book-2', badge: '4', badgeClass: 'badge-soft-secondary' },
  { id: 'elective', label: 'Electives', icon: 'ti ti-bulb', badge: '2', badgeClass: 'badge-soft-secondary' },
];

export interface NavGroup {
  title: string;
  items: { label: string; icon: string; badge?: string; jumpTo?: string; meta?: string }[];
}

/** The rail's remaining list-groups — visual only in the template, kept as such. */
export const navGroups: NavGroup[] = [
  {
    title: 'Academic Years',
    items: [
      { label: '2024 / 2025', icon: 'ti ti-calendar-star' },
      { label: '2023 / 2024', icon: 'ti ti-calendar' },
    ],
  },
  {
    title: 'Grades',
    items: [
      { label: 'Grade 9', icon: 'ti ti-number-9-small', badge: '1' },
      { label: 'Grade 10', icon: 'ti ti-number-0', badge: '2' },
      { label: 'Grade 11', icon: 'ti ti-number-1', badge: '2' },
      { label: 'Grade 12', icon: 'ti ti-number-2', badge: '1' },
    ],
  },
  {
    title: 'Classes',
    items: [
      { label: 'Section A', icon: 'ti ti-users-group' },
      { label: 'Section B', icon: 'ti ti-users-group' },
    ],
  },
  {
    title: 'Departments',
    items: [
      { label: 'Science', icon: 'ti ti-flask' },
      { label: 'Mathematics', icon: 'ti ti-math' },
      { label: 'Languages', icon: 'ti ti-language' },
      { label: 'Computing', icon: 'ti ti-device-desktop' },
    ],
  },
  {
    title: 'Subject Groups',
    items: [
      { label: 'STEM', icon: 'ti ti-atom' },
      { label: 'Humanities', icon: 'ti ti-book' },
    ],
  },
];

/** These two groups jump to a card rather than just toggling `.active`. */
export const recentlyUpdated: NavGroup = {
  title: 'Recently Updated',
  items: [
    { label: 'Mathematics', icon: 'ti ti-math', jumpTo: 'cur_0', meta: '2h' },
    { label: 'English Lit.', icon: 'ti ti-book', jumpTo: 'cur_2', meta: '1d' },
  ],
};

export const favouriteNav: NavGroup = {
  title: 'Favorites',
  items: [
    { label: 'Mathematics', icon: 'ti ti-star-filled text-warning', jumpTo: 'cur_0' },
    { label: 'Biology', icon: 'ti ti-star-filled text-warning', jumpTo: 'cur_4' },
  ],
};

/* -------------------------------------------------------------------------- */
/*                                   Toolbar                                  */
/* -------------------------------------------------------------------------- */

export type FilterKey = 'year' | 'type' | 'grade' | 'class' | 'subject' | 'department';

export interface FilterField {
  key: FilterKey;
  label: string;
  domId: string;
  options: string[];
}

export const advancedFilters: FilterField[] = [
  { key: 'year', label: 'Academic Year', domId: 'cur-academic-year', options: ['2024 / 2025', '2023 / 2024', '2022 / 2023'] },
  { key: 'type', label: 'Curriculum Type', domId: 'cur-type', options: ['Core', 'Elective', 'Co-curricular', 'Remedial'] },
  { key: 'grade', label: 'Grade', domId: 'cur-grade', options: ['Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'] },
  { key: 'class', label: 'Class', domId: 'cur-class', options: ['A', 'B', 'C'] },
  {
    key: 'subject',
    label: 'Subject',
    domId: 'cur-subject',
    options: ['Mathematics', 'Physics', 'English', 'Computer Science', 'Biology', 'Chemistry'],
  },
  { key: 'department', label: 'Department', domId: 'cur-department', options: ['Science', 'Mathematics', 'Languages', 'Computing'] },
];

export interface FilterChip {
  id: string;
  label: string;
  badgeClass: string;
  linkClass: string;
}

/** The template ships three chips already applied. */
export const initialChips: FilterChip[] = [
  { id: 'year', label: 'Academic Year : 2024 / 2025', badgeClass: 'badge-soft-primary', linkClass: 'text-primary' },
  { id: 'type', label: 'Type : Core', badgeClass: 'badge-soft-info', linkClass: 'text-info' },
  { id: 'status', label: 'Status : Published', badgeClass: 'badge-soft-success', linkClass: 'text-success' },
];

export interface CardMenuItem {
  id: string;
  label: string;
  icon: string;
  modal?: CurriculumModalId;
  danger?: boolean;
  divider?: boolean;
}

export const cardMenuItems: CardMenuItem[] = [
  { id: 'view', label: 'View', icon: 'ti ti-eye', modal: 'details' },
  { id: 'edit', label: 'Edit', icon: 'ti ti-edit', modal: 'edit' },
  { id: 'assign', label: 'Assign Classes', icon: 'ti ti-users', modal: 'assignClasses' },
  { id: 'duplicate', label: 'Duplicate', icon: 'ti ti-copy', divider: true },
  { id: 'archive', label: 'Archive', icon: 'ti ti-archive' },
  { id: 'delete', label: 'Delete', icon: 'ti ti-trash', modal: 'delete', danger: true },
];

/** The offcanvas's quick-action row. */
export const detailActions: CardMenuItem[] = [
  { id: 'view', label: 'View', icon: 'ti ti-eye', modal: 'details' },
  { id: 'edit', label: 'Edit', icon: 'ti ti-edit', modal: 'edit' },
  { id: 'assign_teacher', label: 'Assign Teacher', icon: 'ti ti-user-plus', modal: 'assignClasses' },
  { id: 'assign_class', label: 'Assign Class', icon: 'ti ti-users', modal: 'assignClasses' },
  { id: 'duplicate', label: 'Duplicate', icon: 'ti ti-copy' },
  { id: 'publish', label: 'Publish', icon: 'ti ti-discount' },
  { id: 'archive', label: 'Archive', icon: 'ti ti-archive' },
  { id: 'print', label: 'Print', icon: 'ti ti-printer' },
  { id: 'download', label: 'Download PDF', icon: 'ti ti-download' },
];

/**
 * `curriculum.js` ships no toast table, so this copy mirrors the phrasing the other
 * Academic workspaces use for the same actions.
 */
export const actionToasts: Record<string, string> = {
  refresh: 'Curriculum refreshed.',
  duplicate: 'Curriculum duplicated as a draft.',
  archive: 'Curriculum archived.',
  publish: 'Curriculum published.',
  print: 'Sending the curriculum to the printer…',
  download: 'PDF export queued for download.',
  assign_teacher: 'Teacher assignment opened for this curriculum.',
  assign_class: 'Class assignment opened for this curriculum.',
  clear_filters: 'Filters cleared.',
  apply_filters: 'Filters applied.',
  save_view: 'Current filters saved as a new view.',
};
