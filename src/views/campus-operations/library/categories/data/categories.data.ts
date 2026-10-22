export type CategoryStatus = 'Active' | 'Limited' | 'Inactive' | 'Archived';
export type CategoryType = 'Physical' | 'Digital' | 'Restricted' | 'Reference only';

export interface Pair {
  label: string;
  value: string;
}

export interface Subcategory {
  name: string;
  count: string;
}

export interface Category {
  id: string;
  code: string;
  name: string;
  /** Theme colour behind the row avatar and the overview card. */
  tint: string;
  icon: string;
  /** Null for a root category. */
  parent: string | null;
  parentCode: string | null;
  description: string;
  total: number;
  available: number;
  /** What this category counts — books, titles or issues. */
  unit: 'books' | 'titles' | 'issues';
  /** Printed on the row, e.g. "A1 – A6", "Digital", "Vault". */
  shelf: string;
  /** The Shelf Location filter's value for this row. */
  shelfLocation: string;
  updated: string;
  status: CategoryStatus;
  type: CategoryType;
  createdOn: string;
  managedBy: string;
  loanPeriod: string;
  /** Panel block two — "Racks/Floor/Section/Capacity" or the digital variant. */
  shelfDetails: Pair[];
  /** Panel block three — borrow statistics, labelled per category type. */
  stats: Pair[];
  subcategories: Subcategory[];
  notes: string;
}

export const statusPill: Record<CategoryStatus, string> = {
  Active: 'is-active',
  Limited: 'is-pending',
  Inactive: 'is-inactive',
  Archived: 'is-archived',
};

export const statusBadge: Record<CategoryStatus, string> = {
  Active: 'badge badge-soft-success',
  Limited: 'badge badge-soft-warning',
  Inactive: 'badge badge-soft-secondary',
  Archived: 'badge badge-soft-secondary',
};

export const typeBadge: Record<CategoryType, string> = {
  Physical: 'badge badge-soft-primary',
  Digital: 'badge badge-soft-purple',
  Restricted: 'badge badge-soft-danger',
  'Reference only': 'badge badge-soft-info',
};

/* ------------------------------ Filter options ------------------------------ */

export const typeOptions: CategoryType[] = ['Physical', 'Digital', 'Restricted', 'Reference only'];

export const ROOT_ONLY = 'Root categories only';

export const parentOptions = [
  ROOT_ONLY, 'Academic Books', 'Reference Books', 'Fiction', 'Non-Fiction', 'Digital Resources',
];

export const statusOptions: CategoryStatus[] = ['Active', 'Limited', 'Inactive', 'Archived'];

export const bookCountOptions = ['Under 100', '100 – 500', '500 – 1,000', 'Over 1,000'];

export const shelfLocationOptions = [
  'Ground floor · A racks', 'Ground floor · B racks', 'First floor · C racks', 'Archive vault', 'Digital',
];

export const managedByOptions = ['Mary Winsler', 'Anita Rao', 'Head Librarian'];

export const loanPeriodOptions = ['7 days', '14 days', '21 days', 'Reference only', 'Not issuable'];

/* -------------------------------- Derivations ------------------------------- */

export const issued = (row: Category): number => row.total - row.available;

/** The template prints thousands with a separator. */
export const count = (value: number): string => value.toLocaleString('en-US');

export const availabilityPct = (row: Category): number =>
  row.total === 0 ? 0 : Math.round((row.available / row.total) * 100);

/**
 * The "Low Availability" quick filter. The template's badge counts the whole
 * 32-category library; here it means fewer than four in five copies on the
 * shelf, which is the line the shown rows fall either side of.
 */
export const lowAvailability = (row: Category): boolean => availabilityPct(row) < 80;

export const isRoot = (row: Category): boolean => row.parent === null;

export const bookCountBand = (row: Category): string => {
  if (row.total < 100) return 'Under 100';
  if (row.total <= 500) return '100 – 500';
  if (row.total <= 1000) return '500 – 1,000';
  return 'Over 1,000';
};

/** Category Rules, as the View dialog prints them. */
export const lends = (row: Category): boolean =>
  row.loanPeriod !== 'Reference only' && row.loanPeriod !== 'Not issuable';

export const maxPerMember = (row: Category): string => (lends(row) ? '3 books' : '—');
export const renewalsAllowed = (row: Category): string => (lends(row) ? '2' : '—');
export const reservations = (row: Category): string => (lends(row) ? 'Allowed' : 'Not allowed');

export const parentLabel = (row: Category): string => row.parent ?? 'Root category';

export const searchIndexOf = (row: Category): string =>
  `${row.name} ${row.code} ${row.description} ${parentLabel(row)} ${row.shelf}`.toLowerCase();

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const dateKey = (value: string): number => {
  const [day, month, year] = value.split(' ');
  const index = months.indexOf(month);
  if (index === -1) return 0;
  return Number(year) * 10000 + (index + 1) * 100 + Number(day);
};

/* ----------------------------------- Rows ----------------------------------- */

export const categories: Category[] = [
  {
    id: 'CAT-001', code: 'CAT-001', name: 'Academic Books', tint: 'primary', icon: 'ti ti-book',
    parent: null, parentCode: null,
    description: 'Curriculum-aligned textbooks and guides for all classes.',
    total: 1842, available: 1516, unit: 'books',
    shelf: 'A1 – A6', shelfLocation: 'Ground floor · A racks',
    updated: '30 Jul 2026', status: 'Active', type: 'Physical',
    createdOn: '01 Apr 2024', managedBy: 'Mary Winsler', loanPeriod: '14 days',
    shelfDetails: [
      { label: 'Racks', value: 'A1 – A6' },
      { label: 'Floor', value: 'Ground floor' },
      { label: 'Section', value: 'Academic wing' },
      { label: 'Capacity', value: '2,000 books' },
    ],
    stats: [
      { label: 'Issued This Month', value: '486' },
      { label: 'Currently Issued', value: '326' },
      { label: 'Overdue Returns', value: '18' },
      { label: 'Most Borrowed', value: 'Concepts of Physics' },
    ],
    subcategories: [
      { name: 'Science & Technology', count: '628 books' },
      { name: 'Mathematics', count: '412 books' },
      { name: 'Languages & Literature', count: '486 books' },
      { name: 'Social Studies', count: '316 books' },
    ],
    notes: 'Highest circulation category. Restock request raised for Mathematics titles ahead of Term II exams.',
  },
  {
    id: 'CAT-002', code: 'CAT-002', name: 'Reference Books', tint: 'info', icon: 'ti ti-bookmarks',
    parent: null, parentCode: null,
    description: 'Encyclopaedias, dictionaries and atlases for in-library use.',
    total: 624, available: 612, unit: 'books',
    shelf: 'B1 – B3', shelfLocation: 'Ground floor · B racks',
    updated: '28 Jul 2026', status: 'Active', type: 'Physical',
    createdOn: '01 Apr 2024', managedBy: 'Mary Winsler', loanPeriod: 'Reference only',
    shelfDetails: [
      { label: 'Racks', value: 'B1 – B3' },
      { label: 'Floor', value: 'Ground floor' },
      { label: 'Section', value: 'Reading room' },
      { label: 'Capacity', value: '800 books' },
    ],
    stats: [
      { label: 'Issued This Month', value: '0' },
      { label: 'In-Library Reads', value: '284' },
      { label: 'Overdue Returns', value: '0' },
      { label: 'Most Consulted', value: 'World Atlas' },
    ],
    subcategories: [
      { name: 'Journals', count: '148 issues' },
      { name: 'Magazines', count: '92 issues' },
      { name: 'Encyclopaedias', count: '186 volumes' },
      { name: 'Atlases & Maps', count: '198 items' },
    ],
    notes: 'Reference-only category. Staff may issue for up to 3 days with the head librarian’s approval.',
  },
  {
    id: 'CAT-003', code: 'CAT-003', name: 'Fiction', tint: 'success', icon: 'ti ti-books',
    parent: null, parentCode: null,
    description: 'Novels, short stories and young-adult fiction for leisure reading.',
    total: 968, available: 704, unit: 'books',
    shelf: 'C1 – C5', shelfLocation: 'First floor · C racks',
    updated: '29 Jul 2026', status: 'Active', type: 'Physical',
    createdOn: '01 Apr 2024', managedBy: 'Anita Rao', loanPeriod: '21 days',
    shelfDetails: [
      { label: 'Racks', value: 'C1 – C5' },
      { label: 'Floor', value: 'First floor' },
      { label: 'Section', value: 'Reading lounge' },
      { label: 'Capacity', value: '1,200 books' },
    ],
    stats: [
      { label: 'Issued This Month', value: '412' },
      { label: 'Currently Issued', value: '264' },
      { label: 'Overdue Returns', value: '24' },
      { label: 'Most Borrowed', value: 'Percy Jackson Series' },
    ],
    subcategories: [
      { name: 'Young Adult', count: '386 books' },
      { name: 'Classics', count: '242 books' },
      { name: 'Mystery & Thriller', count: '198 books' },
      { name: 'Fantasy', count: '142 books' },
    ],
    notes: 'Highest overdue rate in the library. Reminder cycle shortened to 3 days for this category.',
  },
  {
    id: 'CAT-004', code: 'CAT-004', name: 'Non-Fiction', tint: 'warning', icon: 'ti ti-file-text',
    parent: null, parentCode: null,
    description: 'Biographies, history, science writing and general knowledge.',
    total: 712, available: 598, unit: 'books',
    shelf: 'C6 – C8', shelfLocation: 'First floor · C racks',
    updated: '26 Jul 2026', status: 'Active', type: 'Physical',
    createdOn: '01 Apr 2024', managedBy: 'Anita Rao', loanPeriod: '21 days',
    shelfDetails: [
      { label: 'Racks', value: 'C6 – C8' },
      { label: 'Floor', value: 'First floor' },
      { label: 'Section', value: 'Reading lounge' },
      { label: 'Capacity', value: '900 books' },
    ],
    stats: [
      { label: 'Issued This Month', value: '188' },
      { label: 'Currently Issued', value: '114' },
      { label: 'Overdue Returns', value: '6' },
      { label: 'Most Borrowed', value: 'Sapiens' },
    ],
    subcategories: [
      { name: 'Biographies', count: '246 books' },
      { name: 'Popular Science', count: '212 books' },
      { name: 'History & Culture', count: '168 books' },
      { name: 'Self Development', count: '86 books' },
    ],
    notes: 'Steady circulation. New arrivals shelved on C8 pending catalogue entry.',
  },
  {
    id: 'CAT-005', code: 'CAT-005', name: 'Digital Resources', tint: 'purple', icon: 'ti ti-world',
    parent: null, parentCode: null,
    description: 'E-books, audiobooks and subscribed online research databases.',
    total: 386, available: 386, unit: 'titles',
    shelf: 'Digital', shelfLocation: 'Digital',
    updated: '30 Jul 2026', status: 'Active', type: 'Digital',
    createdOn: '15 Jun 2025', managedBy: 'Mary Winsler', loanPeriod: '7 days · concurrent',
    shelfDetails: [
      { label: 'Storage', value: 'Cloud hosted' },
      { label: 'Access', value: 'Student portal' },
      { label: 'Section', value: 'Not applicable' },
      { label: 'Capacity', value: 'Unlimited' },
    ],
    stats: [
      { label: 'Accessed This Month', value: '1,284' },
      { label: 'Active Sessions', value: '46' },
      { label: 'Overdue Returns', value: '—' },
      { label: 'Most Accessed', value: 'Britannica Online' },
    ],
    subcategories: [
      { name: 'E-Books', count: '242 titles' },
      { name: 'Audiobooks', count: '86 titles' },
      { name: 'Research Databases', count: '4 subscriptions' },
      { name: 'Video Lectures', count: '54 titles' },
    ],
    notes: 'Subscription renewal for JSTOR falls due on 15 Sep 2026. Budget approval pending.',
  },
  {
    id: 'CAT-006', code: 'CAT-006', name: 'Journals', tint: 'pink', icon: 'ti ti-news',
    parent: 'Reference Books', parentCode: 'CAT-002',
    description: 'Peer-reviewed academic periodicals and subject journals.',
    total: 148, available: 142, unit: 'issues',
    shelf: 'B2', shelfLocation: 'Ground floor · B racks',
    updated: '24 Jul 2026', status: 'Active', type: 'Physical',
    createdOn: '10 Aug 2024', managedBy: 'Mary Winsler', loanPeriod: 'Reference only',
    shelfDetails: [
      { label: 'Racks', value: 'B2' },
      { label: 'Floor', value: 'Ground floor' },
      { label: 'Section', value: 'Reading room' },
      { label: 'Capacity', value: '200 issues' },
    ],
    stats: [
      { label: 'Issued This Month', value: '0' },
      { label: 'In-Library Reads', value: '96' },
      { label: 'Overdue Returns', value: '0' },
      { label: 'Most Consulted', value: 'Journal of School Science' },
    ],
    subcategories: [
      { name: 'Science Journals', count: '62 issues' },
      { name: 'Education Journals', count: '48 issues' },
      { name: 'Humanities Journals', count: '38 issues' },
    ],
    notes: 'Back issues older than five years are moved to the archive each August.',
  },
  {
    id: 'CAT-007', code: 'CAT-007', name: 'Magazines', tint: 'secondary', icon: 'ti ti-report',
    parent: 'Reference Books', parentCode: 'CAT-002',
    description: 'General interest and children’s periodicals, current issues only.',
    total: 92, available: 78, unit: 'issues',
    shelf: 'B3', shelfLocation: 'Ground floor · B racks',
    updated: '20 Jul 2026', status: 'Limited', type: 'Physical',
    createdOn: '10 Aug 2024', managedBy: 'Anita Rao', loanPeriod: '3 days',
    shelfDetails: [
      { label: 'Racks', value: 'B3' },
      { label: 'Floor', value: 'Ground floor' },
      { label: 'Section', value: 'Reading room' },
      { label: 'Capacity', value: '150 issues' },
    ],
    stats: [
      { label: 'Issued This Month', value: '64' },
      { label: 'Currently Issued', value: '14' },
      { label: 'Overdue Returns', value: '4' },
      { label: 'Most Borrowed', value: 'National Geographic Kids' },
    ],
    subcategories: [
      { name: 'Children’s Magazines', count: '42 issues' },
      { name: 'Science Digest', count: '28 issues' },
      { name: 'General Interest', count: '22 issues' },
    ],
    notes: 'Marked limited — three subscriptions lapsed in July and are awaiting renewal approval.',
  },
  {
    id: 'CAT-008', code: 'CAT-008', name: 'Rare & Archived', tint: 'danger', icon: 'ti ti-archive',
    parent: null, parentCode: null,
    description: 'Out-of-print, damaged and historically significant titles.',
    total: 214, available: 0, unit: 'books',
    shelf: 'Vault', shelfLocation: 'Archive vault',
    updated: '30 Jun 2026', status: 'Archived', type: 'Restricted',
    createdOn: '01 Apr 2024', managedBy: 'Head Librarian', loanPeriod: 'Not issuable',
    shelfDetails: [
      { label: 'Storage', value: 'Archive vault' },
      { label: 'Floor', value: 'Basement' },
      { label: 'Section', value: 'Restricted access' },
      { label: 'Capacity', value: '400 books' },
    ],
    stats: [
      { label: 'Issued This Month', value: '0' },
      { label: 'Currently Issued', value: '0' },
      { label: 'Overdue Returns', value: '0' },
      { label: 'Viewing Requests', value: '3' },
    ],
    subcategories: [
      { name: 'Rare Editions', count: '86 books' },
      { name: 'Damaged — Repair Queue', count: '72 books' },
      { name: 'Withdrawn Titles', count: '56 books' },
    ],
    notes: 'Access by written request only. Repair queue to be reviewed with the binding vendor in August.',
  },
];
