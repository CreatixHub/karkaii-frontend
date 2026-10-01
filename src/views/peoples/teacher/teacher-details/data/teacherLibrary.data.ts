export type LibraryBookStatus = 'Returned' | 'Pending' | 'Overdue';

export interface LibraryBook {
  id: string;
  title: string;
  cover: string;
  /** "Book taken on" — the template's display string. */
  takenOn: string;
  /** The same date, sortable, so the period menu can filter for real. */
  takenOnISO: string;
  lastDate: string;
  lastDateISO: string;
  status: LibraryBookStatus;
}

export const issuedBooks: LibraryBook[] = [
  {
    id: 'book-01',
    title: 'The Small-Town Library',
    cover: 'assets/img/books/book-01.jpg',
    takenOn: '25 Jan 2024',
    takenOnISO: '2024-01-25',
    lastDate: '25 Jan 2024',
    lastDateISO: '2024-01-25',
    status: 'Returned',
  },
  {
    id: 'book-02',
    title: 'Apex Time',
    cover: 'assets/img/books/book-02.jpg',
    takenOn: '22 Jan 2024',
    takenOnISO: '2024-01-22',
    lastDate: '25 Jan 2024',
    lastDateISO: '2024-01-25',
    status: 'Returned',
  },
  {
    id: 'book-03',
    title: 'The Cobalt Guitar',
    cover: 'assets/img/books/book-03.jpg',
    takenOn: '30 Jan 2024',
    takenOnISO: '2024-01-30',
    lastDate: '10 Feb 2024',
    lastDateISO: '2024-02-10',
    status: 'Returned',
  },
  {
    id: 'book-04',
    title: 'Shard and the Tomb',
    cover: 'assets/img/books/book-04.jpg',
    takenOn: '10 Feb 2024',
    takenOnISO: '2024-02-10',
    lastDate: '20 Feb 2024',
    lastDateISO: '2024-02-20',
    status: 'Overdue',
  },
  {
    id: 'book-05',
    title: 'Shard and the Tomb 2',
    cover: 'assets/img/books/book-05.jpg',
    takenOn: '12 Feb 2024',
    takenOnISO: '2024-02-12',
    lastDate: '22 Feb 2024',
    lastDateISO: '2024-02-22',
    status: 'Pending',
  },
  {
    id: 'book-06',
    title: 'Plague of Fear',
    cover: 'assets/img/books/book-06.jpg',
    takenOn: '15 Feb 2024',
    takenOnISO: '2024-02-15',
    lastDate: '25 Feb 2024',
    lastDateISO: '2024-02-25',
    status: 'Pending',
  },
];

/* -------------------------------- Stat tiles ------------------------------- */

export interface LibraryStatCard {
  id: string;
  /** The three letters the template stacks inside `.stats-avatars`. */
  initials: [string, string, string];
  icon: string;
  variant: string;
  value: number;
  label: string;
  /** `<div class="stats-bar"><i style="width:60%"></i></div>` */
  barWidth: string;
}

/**
 * The template's four tiles, with the value counted off the roster. The bars
 * run on a ten-book scale, which is exactly what the shipped widths encode
 * (6 → 60%, 3 → 30%, 2 → 20%, 1 → 10%).
 */
export const buildLibraryStats = (books: LibraryBook[]): LibraryStatCard[] => {
  const countBy = (status: LibraryBookStatus) =>
    books.filter((book) => book.status === status).length;

  const tiles: Omit<LibraryStatCard, 'barWidth'>[] = [
    {
      id: 'issued',
      initials: ['L', 'I', 'B'],
      icon: 'ti ti-books',
      variant: 'stats-primary',
      value: books.length,
      label: 'Books Issued',
    },
    {
      id: 'returned',
      initials: ['L', 'I', 'B'],
      icon: 'ti ti-checks',
      variant: 'stats-success',
      value: countBy('Returned'),
      label: 'Books Returned',
    },
    {
      id: 'pending',
      initials: ['L', 'I', 'B'],
      icon: 'ti ti-clock-hour-4',
      variant: 'stats-warning',
      value: countBy('Pending'),
      label: 'Pending Returns',
    },
    {
      id: 'overdue',
      initials: ['L', 'I', 'B'],
      icon: 'ti ti-alert-triangle',
      variant: 'stats-info',
      value: countBy('Overdue'),
      label: 'Overdue Books',
    },
  ];

  return tiles.map((tile) => ({
    ...tile,
    barWidth: `${Math.min(100, tile.value * 10)}%`,
  }));
};

/* ------------------------------- Period menu ------------------------------- */

export const libraryPeriods = ['This Year', 'This Month', 'This Week'] as const;

export type LibraryPeriod = (typeof libraryPeriods)[number];

/** `2024-02-15` → a local `Date`, so week maths never crosses a timezone. */
const parseISO = (iso: string) => {
  const [year, month, day] = iso.split('-').map(Number);
  return new Date(year, (month ?? 1) - 1, day ?? 1);
};

/** Monday of the ISO week containing `date`. */
const startOfWeek = (date: Date) => {
  const start = new Date(date);
  start.setDate(start.getDate() - ((start.getDay() + 6) % 7));
  start.setHours(0, 0, 0, 0);
  return start;
};

/**
 * The template's period menu had no script. The roster runs Jan–Feb 2024, so
 * "this" is anchored on the most recent issue rather than on today's clock —
 * otherwise every option would return nothing.
 */
export const filterBooksByPeriod = (books: LibraryBook[], period: LibraryPeriod): LibraryBook[] => {
  if (books.length === 0) return books;

  const latest = books.reduce(
    (newest, book) => (book.takenOnISO > newest ? book.takenOnISO : newest),
    books[0].takenOnISO,
  );
  const anchor = parseISO(latest);

  if (period === 'This Year') {
    return books.filter((book) => parseISO(book.takenOnISO).getFullYear() === anchor.getFullYear());
  }

  if (period === 'This Month') {
    return books.filter((book) => {
      const taken = parseISO(book.takenOnISO);
      return (
        taken.getFullYear() === anchor.getFullYear() && taken.getMonth() === anchor.getMonth()
      );
    });
  }

  const weekStart = startOfWeek(anchor);
  return books.filter((book) => parseISO(book.takenOnISO) >= weekStart);
};

/* ------------------------------ Login Details ------------------------------ */

export interface LoginCredential {
  userType: string;
  userName: string;
  password: string;
}

export const libraryLoginCredentials: LoginCredential[] = [
  { userType: 'Teacher', userName: 'teacher20', password: 'teacher@53' },
  { userType: 'Parent', userName: 'parent53', password: 'parent@53' },
];
