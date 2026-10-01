export interface StatBox {
  id: string;
  label: string;
  value: string;
  /** Either a trailing badge or a trailing icon, matching the template. */
  badge?: string;
  icon?: string;
  valueClass?: string;
}

export const libraryStats: StatBox[] = [
  { id: 'issued', label: 'Issued (Month)', value: '6,842', badge: '5.4%' },
  { id: 'returned', label: 'Returned', value: '6,120', icon: 'ti ti-book-download text-success' },
  { id: 'overdue', label: 'Overdue', value: '58', icon: 'ti ti-alarm text-danger', valueClass: 'text-danger' },
  { id: 'peak', label: 'Peak Day', value: 'Wed', icon: 'ti ti-calendar-star text-warning' },
];

export const availabilityStats: StatBox[] = [
  { id: 'issued', label: 'Issued', value: '2,684' },
  { id: 'reserved', label: 'Reserved', value: '754' },
  { id: 'low', label: 'Low Stock', value: '7', valueClass: 'text-danger' },
];

export interface CategoryAvailability {
  id: string;
  label: string;
  icon: string;
  percent: string;
  badgeClass: string;
}

export const categoryAvailability: CategoryAvailability[] = [
  { id: 'science', label: 'Science', icon: 'ti ti-atom text-primary', percent: '88%', badgeClass: 'badge-soft-success' },
  { id: 'maths', label: 'Maths', icon: 'ti ti-math text-info', percent: '76%', badgeClass: 'badge-soft-success' },
  { id: 'literature', label: 'Literature', icon: 'ti ti-book text-warning', percent: '64%', badgeClass: 'badge-soft-warning' },
  { id: 'coding', label: 'Coding', icon: 'ti ti-code text-danger', percent: '42%', badgeClass: 'badge-soft-danger' },
];

export interface BorrowedBook {
  id: string;
  rank: number;
  title: string;
  icon: string;
  avatarClass: string;
  category: string;
  categoryClass: string;
  grades: string;
  issues: string;
  meterClass: string;
  width: string;
  /** Highlighted rows carry the `is-top` modifier in the template. */
  isTop: boolean;
  extra?: { label: string; icon: string; className: string };
}

export const mostBorrowedBooks: BorrowedBook[] = [
  {
    id: 'b1',
    rank: 1,
    title: 'To Kill a Mockingbird',
    icon: 'ti ti-book-2',
    avatarClass: 'bg-warning-gradient',
    category: 'Literature',
    categoryClass: 'badge-soft-warning',
    grades: 'IX–X',
    issues: '86',
    meterClass: 'meter-warning',
    width: '100%',
    isTop: true,
    extra: { label: 'Trending', icon: 'ti ti-trending-up', className: 'badge badge-soft-success d-inline-flex align-items-center gap-1 rounded-pill' },
  },
  {
    id: 'b2',
    rank: 2,
    title: 'A Brief History of Time',
    icon: 'ti ti-atom',
    avatarClass: 'bg-primary-gradient',
    category: 'Science',
    categoryClass: 'badge-soft-primary',
    grades: 'XI–XII',
    issues: '74',
    meterClass: 'meter-primary',
    width: '86%',
    isTop: true,
    extra: { label: '+9', icon: 'ti ti-trending-up', className: 'badge badge-soft-success d-inline-flex align-items-center gap-1 rounded-pill' },
  },
  {
    id: 'b3',
    rank: 3,
    title: 'Introduction to Algorithms',
    icon: 'ti ti-code',
    avatarClass: 'bg-success-gradient',
    category: 'Programming',
    categoryClass: 'badge-soft-success',
    grades: 'XI–XII',
    issues: '61',
    meterClass: 'meter-success',
    width: '71%',
    isTop: true,
    extra: { label: '12 waiting', icon: 'ti ti-hourglass', className: 'chip chip-soft chip-sm chip-warning' },
  },
  {
    id: 'b4',
    rank: 4,
    title: 'The Great Gatsby',
    icon: 'ti ti-book',
    avatarClass: 'bg-warning-gradient',
    category: 'Literature',
    categoryClass: 'badge-soft-warning',
    grades: 'X',
    issues: '58',
    meterClass: 'meter-warning',
    width: '67%',
    isTop: false,
  },
  {
    id: 'b5',
    rank: 5,
    title: 'Calculus Made Easy',
    icon: 'ti ti-math',
    avatarClass: 'bg-info-gradient',
    category: 'Mathematics',
    categoryClass: 'badge-soft-info',
    grades: 'XII',
    issues: '47',
    meterClass: 'meter-info',
    width: '55%',
    isTop: false,
  },
];

export interface CategoryBubble {
  id: string;
  percent: string;
  label: string;
  className: string;
}

export const categoryBubbles: CategoryBubble[] = [
  { id: 'science', percent: '32%', label: 'Science', className: 'bg-primary-gradient bubble-01' },
  { id: 'maths', percent: '26%', label: 'Maths', className: 'bg-info-gradient bubble-02' },
  { id: 'coding', percent: '20%', label: 'Coding', className: 'bg-success-gradient bubble-03' },
  { id: 'lit', percent: '14%', label: 'Lit', className: 'bg-warning-gradient bubble-04' },
  { id: 'hist', percent: '8%', label: 'Hist', className: 'bg-purple-gradient bubble-05' },
];

export interface CategoryRow {
  id: string;
  label: string;
  dotClass: string;
  trend: string;
  trendIcon: string;
  trendClass: string;
  books: string;
}

export const categoryRows: CategoryRow[] = [
  { id: 'science', label: 'Science', dotClass: 'bg-primary', trend: '+6%', trendIcon: 'ti ti-trending-up', trendClass: 'badge-soft-success', books: '1,284 books' },
  { id: 'maths', label: 'Mathematics', dotClass: 'bg-info', trend: '+3%', trendIcon: 'ti ti-trending-up', trendClass: 'badge-soft-success', books: '1,043 books' },
  { id: 'programming', label: 'Programming', dotClass: 'bg-success', trend: '+11%', trendIcon: 'ti ti-trending-up', trendClass: 'badge-soft-success', books: '802 books' },
  { id: 'literature', label: 'Literature', dotClass: 'bg-warning', trend: '+2%', trendIcon: 'ti ti-trending-up', trendClass: 'badge-soft-success', books: '560 books' },
  { id: 'history', label: 'History', dotClass: 'bg-purple', trend: '-1%', trendIcon: 'ti ti-trending-down', trendClass: 'badge-soft-danger', books: '318 books' },
];

export const activeReaderAvatars = [
  'assets/img/profiles/avatar-02.jpg',
  'assets/img/profiles/avatar-06.jpg',
  'assets/img/profiles/avatar-13.jpg',
  'assets/img/profiles/avatar-19.jpg',
];
