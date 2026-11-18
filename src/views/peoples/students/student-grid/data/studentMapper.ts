import type { StudentCard } from './students.data';

/** One row of `GET /api/students` (the backend hides tenantId / deletedAt). */
export interface ApiStudentRow {
  id: string | number;
  admissionNo: string;
  firstName: string;
  lastName: string;
  fullName: string | null;
  dob: string | null;
  gender: string | null;
  status: string;
  admittedOn: string | null;
  houseName: string | null;
  primaryGuardianName: string | null;
  primaryGuardianPhone: string | null;
  fatherName: string | null;
  fatherPhone: string | null;
  motherName: string | null;
  motherPhone: string | null;
  className?: string | null;
  gradeLevel?: number | null;
  photoFileId?: string | number | null;
}

/** Shown for every student until real photos are available (photoFileId has no files table yet). */
const DEFAULT_AVATAR = 'assets/img/students/student-01.jpg';

/** Backend status -> label and colour used by the card. */
const STATUS_UI: Record<string, { label: string; color: string }> = {
  active: { label: 'Active', color: 'success' },
  inactive: { label: 'Inactive', color: 'danger' },
  alumni: { label: 'Graduated', color: 'info' },
  transferred_out: { label: 'Transfer', color: 'warning' },
  expelled: { label: 'Expelled', color: 'danger' },
};

/** Toolbar view / quick-filter id -> backend status value. */
export const VIEW_TO_STATUS: Record<string, string> = {
  Active: 'active',
  Inactive: 'inactive',
  Graduated: 'alumni',
  Transfer: 'transferred_out',
};

const toGender = (value: string | null): string => {
  const g = (value ?? '').trim().toLowerCase();
  if (['male', 'm', 'boy', 'man'].includes(g)) return 'Male';
  if (['female', 'f', 'girl', 'woman'].includes(g)) return 'Female';
  return g ? 'Other' : '\u2014';
};

const ageFrom = (dob: string | null): string => {
  if (!dob) return '\u2014';
  const born = new Date(dob);
  if (Number.isNaN(born.getTime())) return '\u2014';
  const now = new Date();
  let age = now.getFullYear() - born.getFullYear();
  const monthGap = now.getMonth() - born.getMonth();
  if (monthGap < 0 || (monthGap === 0 && now.getDate() < born.getDate())) age -= 1;
  return String(Math.max(age, 0));
};

const joinedLabel = (admittedOn: string | null): string => {
  if (!admittedOn) return '\u2014';
  const date = new Date(admittedOn);
  return Number.isNaN(date.getTime())
    ? '\u2014'
    : date.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' });
};

export function toStudentCard(row: ApiStudentRow): StudentCard {
  const name =
    (row.fullName && row.fullName.trim()) ||
    [row.firstName, row.lastName].filter(Boolean).join(' ') ||
    '\u2014';

  const parentName = row.primaryGuardianName || row.fatherName || row.motherName || '';
  const parentPhone = row.primaryGuardianPhone || row.fatherPhone || row.motherPhone || '';

  return {
    id: String(row.id),
    admissionNo: row.admissionNo,
    name,
    // "file:<id>" is an uploaded photo (AuthImage downloads it); otherwise the placeholder picture.
    avatar: row.photoFileId ? `file:${row.photoFileId}` : DEFAULT_AVATAR,
    presence: 'is-offline',
    gender: toGender(row.gender),
    year: '',
    meta: [row.className, row.houseName].filter(Boolean).join(' \u00b7 ') || '\u2014',
    status: STATUS_UI[row.status] ?? { label: row.status, color: 'secondary' },
    chips: [],
    roll: '',
    rank: '',
    age: ageFrom(row.dob),
    parent: {
      name: parentName || 'No parent on file',
      info: parentPhone ? `Parent \u00b7 ${parentPhone}` : '\u2014',
    },
    badges: [],
    className: row.className ?? '',
    section: '',
    gradeLevel: row.gradeLevel ?? undefined,
    joined: joinedLabel(row.admittedOn),
  };
}

/** Adds a class name (from admissions) to a card that has none, and refreshes its subtitle. */
export function withClassName(card: StudentCard, className?: string): StudentCard {
  if (card.className || !className) return card;
  const house = card.meta && card.meta !== '\u2014' ? card.meta : '';
  return { ...card, className, meta: [className, house].filter(Boolean).join(' \u00b7 ') };
}