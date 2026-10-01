export type BookStatus = 'Available' | 'Issued' | 'Reserved' | 'Maintenance' | 'Lost' | 'Archived';

export interface Book {
  id: string;
  /** The template's `dt-code`, e.g. "BK-1001". */
  code: string;
  title: string;
  isbn: string;
  /** Printed in full on the row badge ("1st Edition"), trimmed in the panel. */
  edition: string;
  author: string;
  category: string;
  language: string;
  publisher: string;
  shelf: string;
  total: number;
  available: number;
  issued: number;
  reserved: number;
  added: string;
  status: BookStatus;
}

export const statusPill: Record<BookStatus, string> = {
  Available: 'is-active',
  Issued: 'is-new',
  Reserved: 'is-exam',
  Maintenance: 'is-pending',
  Lost: 'is-emergency',
  Archived: 'is-archived',
};

/**
 * Only Available draws the plain dot; every other status leads its pill with an
 * icon instead. Null means "render the dot".
 */
export const statusIcon: Record<BookStatus, string | null> = {
  Available: null,
  Issued: 'ti ti-book',
  Reserved: 'ti ti-bookmark',
  Maintenance: 'ti ti-tool',
  Lost: 'ti ti-alert-triangle',
  Archived: 'ti ti-archive',
};

export const statusBadge: Record<BookStatus, string> = {
  Available: 'badge badge-soft-success',
  Issued: 'badge badge-soft-primary',
  Reserved: 'badge badge-soft-warning',
  Maintenance: 'badge badge-soft-info',
  Lost: 'badge badge-soft-danger',
  Archived: 'badge badge-soft-secondary',
};

/* ------------------------------ Filter options ------------------------------ */

export const categoryOptions = ['Fiction', 'Science', 'History', 'Computer Science', 'Biography', 'Children'];

export const authorOptions = [
  'Alex Michaelides', 'Stephen Hawking', 'Harper Lee', 'Yuval Noah Harari', 'Thomas H. Cormen',
  'Antoine de Saint-Exupéry', 'F. Scott Fitzgerald', 'Carl Sagan', 'A.P.J. Abdul Kalam', 'Vishnu Sharma',
];

export const publisherOptions = [
  'Celadon Books', 'Bantam', 'Harper Perennial', 'Harper', 'MIT Press',
  'Gallimard', 'Scribner', 'Ballantine', 'Universities Press', 'Om Books',
];

export const languageOptions = ['English', 'French', 'Hindi'];

export const shelfOptions = ['A1-04', 'C2-11', 'A1-09', 'D3-02', 'E1-15', 'A2-07', 'A1-12', 'C2-03', 'B1-08', 'F2-01'];

export const availabilityOptions = ['In Stock', 'Out of Stock'];

export const statusOptions: BookStatus[] = ['Available', 'Issued', 'Reserved', 'Maintenance', 'Lost', 'Archived'];

export const dateAddedOptions = [
  '12 Jan 2024', '08 Feb 2024', '20 Jan 2024', '02 Mar 2024', '15 Feb 2024',
  '28 Feb 2024', '05 Jan 2024', '18 Mar 2024', '22 Feb 2024', '10 Dec 2023',
];

export const editionOptions = [
  '1st Edition', '3rd Edition', '10th Edition', '50th Anniv Edition',
  'Reissue Edition', 'Reprint Edition', 'Classic Edition',
];

/* ------------------------------- Derivations -------------------------------- */

/** The template's percentage, rounded exactly as it prints it. */
export const availabilityPct = (row: Book): number =>
  row.total === 0 ? 0 : Math.round((row.available / row.total) * 100);

/** Drives both the `%` label and the meter fill. */
export const availabilityTint = (row: Book): 'success' | 'warning' | 'danger' => {
  const pct = availabilityPct(row);
  if (pct === 0) return 'danger';
  return pct >= 50 ? 'success' : 'warning';
};

/** Lost and Archived copies grey out, even though their percentage is zero. */
export const meterTint = (row: Book): string =>
  row.status === 'Lost' || row.status === 'Archived' ? 'secondary' : availabilityTint(row);

export const inStock = (row: Book): boolean => row.available > 0;

export const stockLabel = (row: Book): string => (inStock(row) ? 'In Stock' : 'Out of Stock');

/** "1st Edition" reads as "1st" inside the panel's sentences. */
export const editionShort = (row: Book): string => row.edition.replace(/\s*Edition$/, '');

export const descriptionOf = (row: Book): string =>
  `${row.title} by ${row.author} — a ${row.category.toLowerCase()} title (${editionShort(row)} edition) shelved at ${row.shelf}.`;

export const authorInfoOf = (row: Book): string =>
  `${row.author} · ${row.category} author · ${row.language} edition.`;

export const copyInfoOf = (row: Book): string =>
  `${row.total} total · ${row.available} available · ${row.issued} issued · ${row.reserved} reserved.`;

export const borrowingHistoryOf = (row: Book): string =>
  row.issued === 0 ? 'No copies currently on loan.' : `${row.issued} copies currently out · avg 12-day loan.`;

export const reservationQueueOf = (row: Book): string =>
  row.reserved === 0 ? 'No active reservations.' : `${row.reserved} member(s) waiting in the reservation queue.`;

export const fineInfoOf = (row: Book): string =>
  row.status === 'Lost'
    ? '$2/day overdue fine · replacement cost charged for lost copy.'
    : '$2/day overdue fine · no fines on current loans.';

/** One note per status, exactly as the template writes them. */
export const notesOf = (row: Book): string => {
  switch (row.status) {
    case 'Maintenance':
      return 'Copies under repair · rebinding in progress.';
    case 'Lost':
      return 'Reported lost · investigation open.';
    case 'Archived':
      return 'Archived edition · superseded by a newer print.';
    default:
      return 'Catalogued and available for circulation.';
  }
};

/** Mirrors the template's `data-search` attribute. */
export const searchIndexOf = (row: Book): string =>
  [
    row.title, row.isbn, row.code, row.author, row.category,
    row.publisher, row.language, row.shelf, row.status, stockLabel(row),
  ]
    .join(' ')
    .toLowerCase();

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** Sortable key for the template's "12 Jan 2024" dates. */
export const dateKey = (value: string): number => {
  const [day, month, year] = value.split(' ');
  const index = months.indexOf(month);
  if (index === -1) return 0;
  return Number(year) * 10000 + (index + 1) * 100 + Number(day);
};

/* ---------------------------------- Rows ------------------------------------ */

export const books: Book[] = [
  {
    id: 'BK-1001', code: 'BK-1001', title: 'The Silent Patient', isbn: '978-1250301697',
    edition: '1st Edition', author: 'Alex Michaelides', category: 'Fiction', language: 'English',
    publisher: 'Celadon Books', shelf: 'A1-04',
    total: 6, available: 4, issued: 2, reserved: 0, added: '12 Jan 2024', status: 'Available',
  },
  {
    id: 'BK-1002', code: 'BK-1002', title: 'A Brief History of Time', isbn: '978-0553380163',
    edition: '10th Edition', author: 'Stephen Hawking', category: 'Science', language: 'English',
    publisher: 'Bantam', shelf: 'C2-11',
    total: 5, available: 0, issued: 5, reserved: 2, added: '08 Feb 2024', status: 'Issued',
  },
  {
    id: 'BK-1003', code: 'BK-1003', title: 'To Kill a Mockingbird', isbn: '978-0061120084',
    edition: '50th Anniv Edition', author: 'Harper Lee', category: 'Fiction', language: 'English',
    publisher: 'Harper Perennial', shelf: 'A1-09',
    total: 8, available: 3, issued: 4, reserved: 1, added: '20 Jan 2024', status: 'Reserved',
  },
  {
    id: 'BK-1004', code: 'BK-1004', title: 'Sapiens: A Brief History', isbn: '978-0062316097',
    edition: '1st Edition', author: 'Yuval Noah Harari', category: 'History', language: 'English',
    publisher: 'Harper', shelf: 'D3-02',
    total: 7, available: 5, issued: 2, reserved: 0, added: '02 Mar 2024', status: 'Available',
  },
  {
    id: 'BK-1005', code: 'BK-1005', title: 'Introduction to Algorithms', isbn: '978-0262033848',
    edition: '3rd Edition', author: 'Thomas H. Cormen', category: 'Computer Science', language: 'English',
    publisher: 'MIT Press', shelf: 'E1-15',
    total: 4, available: 0, issued: 3, reserved: 0, added: '15 Feb 2024', status: 'Maintenance',
  },
  {
    id: 'BK-1006', code: 'BK-1006', title: 'Le Petit Prince', isbn: '978-2070612758',
    edition: 'Reissue Edition', author: 'Antoine de Saint-Exupéry', category: 'Fiction', language: 'French',
    publisher: 'Gallimard', shelf: 'A2-07',
    total: 3, available: 2, issued: 1, reserved: 0, added: '28 Feb 2024', status: 'Available',
  },
  {
    id: 'BK-1007', code: 'BK-1007', title: 'The Great Gatsby', isbn: '978-0743273565',
    edition: 'Reprint Edition', author: 'F. Scott Fitzgerald', category: 'Fiction', language: 'English',
    publisher: 'Scribner', shelf: 'A1-12',
    total: 6, available: 0, issued: 0, reserved: 0, added: '05 Jan 2024', status: 'Lost',
  },
  {
    id: 'BK-1008', code: 'BK-1008', title: 'Cosmos', isbn: '978-0345539434',
    edition: 'Reprint Edition', author: 'Carl Sagan', category: 'Science', language: 'English',
    publisher: 'Ballantine', shelf: 'C2-03',
    total: 5, available: 3, issued: 2, reserved: 1, added: '18 Mar 2024', status: 'Reserved',
  },
  {
    id: 'BK-1009', code: 'BK-1009', title: 'Wings of Fire', isbn: '978-8173711466',
    edition: '1st Edition', author: 'A.P.J. Abdul Kalam', category: 'Biography', language: 'English',
    publisher: 'Universities Press', shelf: 'B1-08',
    total: 10, available: 7, issued: 3, reserved: 0, added: '22 Feb 2024', status: 'Available',
  },
  {
    id: 'BK-1010', code: 'BK-1010', title: 'Panchatantra Tales', isbn: '978-8175994980',
    edition: 'Classic Edition', author: 'Vishnu Sharma', category: 'Children', language: 'Hindi',
    publisher: 'Om Books', shelf: 'F2-01',
    total: 12, available: 0, issued: 0, reserved: 0, added: '10 Dec 2023', status: 'Archived',
  },
];
