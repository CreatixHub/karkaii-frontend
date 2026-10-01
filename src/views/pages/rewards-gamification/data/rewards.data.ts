import type { Stat } from '../../shared/StatStrip';

/* ------------------------------------------------------------------ *
 * The programme                                                      *
 * ------------------------------------------------------------------ */

export const POINTS_ISSUED = '48.2K';
export const BADGE_COUNT = 36;
export const REDEEMED = 1240;
export const ACTIVE = 2140;
export const LEVELS = 5;

/* ------------------------------------------------------------------ *
 * The leaderboard                                                    *
 * ------------------------------------------------------------------ */

export type Level = 'Gold' | 'Silver';

export interface Student {
  id: string;
  name: string;
  photo: string;
  className: string;
  points: number;
}

/** Stated in the order the template prints them, which is points descending. */
export const STUDENTS: Student[] = [
  {
    id: 'janet',
    name: 'Janet Daniel',
    photo: 'assets/img/students/student-01.jpg',
    className: 'III-A',
    points: 2480,
  },
  {
    id: 'sophia',
    name: 'Sophia Reyes',
    photo: 'assets/img/students/student-03.jpg',
    className: 'III-A',
    points: 2210,
  },
  {
    id: 'mia',
    name: 'Mia Bennett',
    photo: 'assets/img/students/student-05.jpg',
    className: 'II-A',
    points: 1980,
  },
  {
    id: 'george',
    name: 'George Kettut',
    photo: 'assets/img/students/student-02.jpg',
    className: 'II-A',
    points: 1640,
  },
];

/** The leaderboard is the register sorted, not a second copy of it. */
export const LEADERBOARD = [...STUDENTS].sort((left, right) => right.points - left.points);

/** Two thousand points is where the template's badge turns from Silver to Gold. */
export const GOLD_AT = 2000;

export const levelOf = (student: Student): Level => (student.points >= GOLD_AT ? 'Gold' : 'Silver');

export const levelTint = (level: Level) => (level === 'Gold' ? 'primary' : 'info');

/**
 * Gold, silver and bronze for the top three; the rest print their rank plain.
 * `rank` is 1-based.
 */
export const rankTintOf = (rank: number): string | null =>
  ({ 1: 'bg-warning text-dark', 2: 'bg-secondary', 3: 'bg-danger' })[rank] ?? null;

export const points = (total: number) => total.toLocaleString('en-US');

/** The Top Student tile prints a first name, not a full one. */
export const topStudentOf = () => LEADERBOARD[0].name.split(' ')[0];

/* ------------------------------------------------------------------ *
 * The tiles                                                          *
 * ------------------------------------------------------------------ */

export const STATS: Stat[] = [
  { id: 'issued', label: 'Points Issued', value: POINTS_ISSUED, icon: 'ti ti-coin', tint: 'primary' },
  { id: 'badges', label: 'Badges', value: String(BADGE_COUNT), icon: 'ti ti-medal', tint: 'warning' },
  { id: 'top', label: 'Top Student', value: topStudentOf(), icon: 'ti ti-trophy', tint: 'success' },
  { id: 'redeemed', label: 'Redeemed', value: points(REDEEMED), icon: 'ti ti-gift', tint: 'info' },
  { id: 'active', label: 'Active', value: points(ACTIVE), icon: 'ti ti-users', tint: 'secondary' },
  { id: 'levels', label: 'Levels', value: String(LEVELS), icon: 'ti ti-stairs-up', tint: 'danger' },
];

/* ------------------------------------------------------------------ *
 * The badges                                                         *
 * ------------------------------------------------------------------ */

export interface Badge {
  id: string;
  label: string;
  icon: string;
  tint: string;
}

export const BADGES: Badge[] = [
  { id: 'top-scorer', label: 'Top Scorer', icon: 'ti ti-medal', tint: 'warning' },
  { id: 'attendance', label: 'Perfect Attend.', icon: 'ti ti-calendar-check', tint: 'success' },
  { id: 'bookworm', label: 'Bookworm', icon: 'ti ti-book', tint: 'primary' },
  { id: 'sports', label: 'Sports Star', icon: 'ti ti-run', tint: 'info' },
  { id: 'helper', label: 'Helper', icon: 'ti ti-heart-handshake', tint: 'danger' },
  { id: 'innovator', label: 'Innovator', icon: 'ti ti-bulb', tint: 'secondary' },
];

/* ------------------------------------------------------------------ *
 * The dialogs                                                        *
 * ------------------------------------------------------------------ */

/** The Award Points dialog lists students; it lists the ones the register has. */
export const AWARDABLE = STUDENTS.slice(0, 2).map((student) => student.name);

export const BADGE_ICONS = ['Medal', 'Trophy', 'Star'];

export const DEFAULT_AWARD = 10;
