export type AwardModalId = 'add' | 'edit' | 'upload' | 'nominate' | 'print' | 'view';

/** The register total the summary card and the footer both quote. */
export const TOTAL_ACHIEVEMENTS = 186;
export const ACADEMIC_YEAR = '2026-2027';

/* ----------------------------- Achievement summary -------------------------- */

export interface SummaryTile {
  id: string;
  icon: string;
  tint: string;
  label: string;
  value: string;
  /** The template mixes heading levels across the five tiles. */
  heading: 'h4' | 'h5' | 'h6';
  note: string;
}

export const summaryTiles: SummaryTile[] = [
  {
    id: 'total',
    icon: 'ti ti-trophy',
    tint: 'bg-primary-transparent text-primary',
    label: 'Total Awards',
    value: '186',
    heading: 'h4',
    note: 'academic year 2026-2027',
  },
  {
    id: 'academic',
    icon: 'ti ti-school',
    tint: 'bg-info-transparent text-info',
    label: 'Academic Awards',
    value: '74',
    heading: 'h5',
    note: '39% of all awards',
  },
  {
    id: 'sports',
    icon: 'ti ti-medal',
    tint: 'bg-success-transparent text-success',
    label: 'Sports Awards',
    value: '52',
    heading: 'h6',
    note: 'athletics, games and chess',
  },
  {
    id: 'cultural',
    icon: 'ti ti-music',
    tint: 'bg-purple-transparent text-purple',
    label: 'Cultural Awards',
    value: '38',
    heading: 'h6',
    note: 'music, dance and art',
  },
  {
    id: 'national',
    icon: 'ti ti-world',
    tint: 'bg-danger-transparent text-danger',
    label: 'National / International',
    value: '11',
    heading: 'h6',
    note: 'outside the district',
  },
];

/* --------------------------------- Toolbar ---------------------------------- */

export interface SavedView {
  id: string;
  icon: string;
  label: string;
  count: number;
}

export const savedViews: SavedView[] = [
  { id: 'all', icon: 'ti ti-layout-list', label: 'All Achievements', count: 186 },
  { id: 'national', icon: 'ti ti-world', label: 'National and International', count: 11 },
  { id: 'certificate-pending', icon: 'ti ti-certificate', label: 'Certificate Pending', count: 17 },
  { id: 'nominations', icon: 'ti ti-star', label: 'Open Nominations', count: 9 },
  { id: 'verification', icon: 'ti ti-clock', label: 'Awaiting Verification', count: 6 },
];

export interface FilterField {
  id: string;
  label: string;
  /** Native `<select>` in the template, so it stays native here. */
  allLabel?: string;
  options: string[];
}

export const filterFields: FilterField[] = [
  {
    id: 'achievement-category',
    label: 'Achievement Category',
    allLabel: 'All',
    options: [
      'Academic Excellence',
      'Sports',
      'Cultural',
      'Competition',
      'Certification',
      'Leadership',
    ],
  },
  {
    id: 'class',
    label: 'Class',
    allLabel: 'All',
    options: ['II B', 'IV A', 'V A', 'VI B', 'VII A', 'IX C', 'X B'],
  },
  {
    id: 'academic-year',
    label: 'Academic Year',
    options: ['2026-2027', '2025-2026', '2024-2025'],
  },
  {
    id: 'award-level',
    label: 'Award Level',
    allLabel: 'All',
    options: ['Class', 'School', 'District', 'State', 'National', 'International'],
  },
  {
    id: 'status',
    label: 'Status',
    allLabel: 'All',
    options: [
      'Certificate Issued',
      'Verified',
      'Pending Verification',
      'Nominated',
      'Not Approved',
    ],
  },
  {
    id: 'placing',
    label: 'Placing',
    allLabel: 'Any',
    options: ['Winner', 'Runner-Up', 'Third Place', 'Merit', 'Participation'],
  },
];

/** The chip rail names the academic year rather than repeating the field label. */
export const CHIP_LABELS: Record<string, string> = {
  'achievement-category': 'Achievement Category',
  class: 'Class',
  'academic-year': 'Academic year',
  'award-level': 'Award Level',
  status: 'Status',
  placing: 'Placing',
};

export interface ColumnSpec {
  id: string;
  label: string;
}

export const columns: ColumnSpec[] = [
  { id: 'id', label: 'Achievement ID' },
  { id: 'student', label: 'Student' },
  { id: 'admission', label: 'Admission No.' },
  { id: 'class', label: 'Class' },
  { id: 'title', label: 'Achievement Title' },
  { id: 'category', label: 'Category' },
  { id: 'level', label: 'Award Level' },
  { id: 'date', label: 'Award Date' },
  { id: 'issued', label: 'Issued By' },
  { id: 'status', label: 'Status' },
];

export type Density = 'compact' | 'default' | 'comfortable';

export interface DensityOption {
  id: Density;
  title: string;
  ariaLabel: string;
  icon: string;
}

export const densityOptions: DensityOption[] = [
  {
    id: 'compact',
    title: 'Compact',
    ariaLabel: 'Compact rows',
    icon: 'ti ti-baseline-density-small',
  },
  {
    id: 'default',
    title: 'Default',
    ariaLabel: 'Default rows',
    icon: 'ti ti-baseline-density-medium',
  },
  {
    id: 'comfortable',
    title: 'Comfortable',
    ariaLabel: 'Comfortable rows',
    icon: 'ti ti-baseline-density-large',
  },
];

export interface QuickFilterSpec {
  id: string;
  icon: string;
  label: string;
  count: number;
}

export const quickFilters: QuickFilterSpec[] = [
  { id: 'all', icon: 'ti ti-layout-list', label: 'All', count: 186 },
  { id: 'Academic Excellence', icon: 'ti ti-school', label: 'Academic', count: 74 },
  { id: 'Sports', icon: 'ti ti-medal', label: 'Sports', count: 52 },
  { id: 'Cultural', icon: 'ti ti-music', label: 'Cultural', count: 38 },
  { id: 'National', icon: 'ti ti-world', label: 'National', count: 11 },
  { id: 'Nominated', icon: 'ti ti-star', label: 'Nominations', count: 9 },
];

export type SortKey = 'id' | 'student' | 'date' | 'level' | 'points';

export interface SortOption {
  id: SortKey;
  icon: string;
  label: string;
}

export const sortOptions: SortOption[] = [
  { id: 'id', icon: 'ti ti-hash', label: 'Achievement ID' },
  { id: 'student', icon: 'ti ti-abc', label: 'Student name (A–Z)' },
  { id: 'date', icon: 'ti ti-calendar-event', label: 'Award date' },
  { id: 'level', icon: 'ti ti-world', label: 'Award level' },
  { id: 'points', icon: 'ti ti-trophy', label: 'Recognition points' },
];

/* ------------------------------- Table header ------------------------------- */

export interface HeaderCell {
  id: string;
  label: string;
  sortable: boolean;
  /** The template marks Achievement ID as the current ascending sort. */
  asc?: boolean;
  className?: string;
}

export const headerCells: HeaderCell[] = [
  { id: 'id', label: 'Achievement ID', sortable: true, asc: true },
  { id: 'student', label: 'Student', sortable: true },
  { id: 'admission', label: 'Admission No.', sortable: true },
  { id: 'class', label: 'Class', sortable: true },
  { id: 'title', label: 'Achievement Title', sortable: true },
  { id: 'category', label: 'Category', sortable: true },
  { id: 'level', label: 'Award Level', sortable: true },
  { id: 'date', label: 'Award Date', sortable: true },
  { id: 'issued', label: 'Issued By', sortable: false },
  { id: 'status', label: 'Status', sortable: false },
];

/* ------------------------------- Dialog options ----------------------------- */

export const studentOptions = [
  'Ananya Rao · AD9887402 · X B',
  'Aarav Kumar · AD9891255 · VII A',
  'Meera Iyer · AD9893660 · V A',
  'Rohan Desai · AD9889014 · IX C',
  'Lisa Gourley · AD9892431 · II B',
  'Kabir Shah · AD9892008 · VI B',
  'Ishaan Verma · AD9894107 · IV A',
  'Tanvi Sharma · AD9893712 · V A',
];

export const categoryOptions = [
  'Academic Excellence',
  'Sports',
  'Cultural',
  'Competition',
  'Certification',
  'Leadership',
];

export const awardLevelOptions = [
  'Class',
  'School',
  'District',
  'State',
  'National',
  'International',
];

export const placingOptions = ['Winner', 'Runner-Up', 'Third Place', 'Merit', 'Participation'];

export const academicYearOptions = ['2026-2027', '2025-2026'];

export const mentorOptions = [
  'Mr. Vikram Sethi · Science',
  'Ms. Deepa Rawat · Physical Education',
  'Mrs. Kalpana Menon · Cultural',
  'Mr. Ethan Brooks · Mathematics',
  'Mrs. Ellen Cruz · Class Teacher',
  'Mr. Arjun Kale · Games',
];

export const verifierOptions = [
  'Mrs. Alice Ray · Chief Warden',
  'Mrs. Ellen Cruz · Class Teacher',
  'Mr. Ethan Brooks · Class Teacher',
];

export const achievementOptions = [
  'ACH-2026-0218 · Ananya Rao',
  'ACH-2026-0221 · Aarav Kumar',
  'ACH-2026-0226 · Meera Iyer',
  'ACH-2026-0231 · Rohan Desai',
  'ACH-2026-0235 · Lisa Gourley',
  'ACH-2026-0239 · Kabir Shah',
  'ACH-2026-0242 · Ishaan Verma',
  'ACH-2026-0244 · Tanvi Sharma',
];

export const copyOptions = ['1 copy', '2 copies', '3 copies'];

export const paperSizeOptions = ['A4 landscape', 'A4 portrait', 'A5 landscape'];

export const signatoryOptions = [
  'Principal',
  'Mrs. Alice Ray · Chief Warden',
  'Head of Department',
];

export const rowsPerPageOptions = ['8', '25', '50', '100'];
