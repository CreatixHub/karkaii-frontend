import type { Stat } from '../../shared/StatStrip';

/* ------------------------------------------------------------------ *
 * The month the page is read in                                      *
 * ------------------------------------------------------------------ */

/** Cards carry a month, not a day, so the whole page works in months. */
export const RUN_MONTH = '2026-08';

/** A card inside six months of its last month is the one the tile counts. */
export const EXPIRING_WITHIN = 6;

const monthIndex = (month: string) => {
  const [year, index] = month.split('-').map(Number);
  return year * 12 + (index - 1);
};

export const monthsUntil = (month: string) => monthIndex(month) - monthIndex(RUN_MONTH);

const MONTH_NAMES = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

export const monthLabel = (month: string) => {
  const [year, index] = month.split('-').map(Number);
  return `${MONTH_NAMES[index - 1]} ${year}`;
};

/* ------------------------------------------------------------------ *
 * The programme                                                      *
 * ------------------------------------------------------------------ */

export const ACTIVE = 5980;
export const EXPIRING = 86;
export const REPRINTS = 54;
export const TEMPLATE_COUNT = 4;
export const QR_SCANS = '18.4K';

/** Every card the school has printed, however it stands now. */
export const ISSUED = ACTIVE + EXPIRING + REPRINTS;

const count = (total: number) => total.toLocaleString('en-US');

export const STATS: Stat[] = [
  { id: 'issued', label: 'Issued', value: count(ISSUED), icon: 'ti ti-id', tint: 'primary' },
  { id: 'active', label: 'Active', value: count(ACTIVE), icon: 'ti ti-circle-check', tint: 'success' },
  {
    id: 'expiring',
    label: 'Expiring',
    value: count(EXPIRING),
    icon: 'ti ti-clock-exclamation',
    tint: 'warning',
  },
  { id: 'reprints', label: 'Reprints', value: count(REPRINTS), icon: 'ti ti-reload', tint: 'danger' },
  {
    id: 'templates',
    label: 'Templates',
    value: String(TEMPLATE_COUNT),
    icon: 'ti ti-template',
    tint: 'info',
  },
  { id: 'scans', label: 'QR Scans', value: QR_SCANS, icon: 'ti ti-qrcode', tint: 'secondary' },
];

/* ------------------------------------------------------------------ *
 * The issued cards                                                   *
 * ------------------------------------------------------------------ */

export type CardStatus = 'Active' | 'Expiring' | 'Expired';

export interface IdCard {
  id: string;
  student: string;
  photo: string;
  admissionNo: string;
  className: string;
  /** The last month the card is good for, as `YYYY-MM`. */
  validTill: string;
  bloodGroup: string;
}

export const CARDS: IdCard[] = [
  {
    id: 'janet',
    student: 'Janet Daniel',
    photo: 'assets/img/students/student-01.jpg',
    admissionNo: 'AD9892434',
    className: 'III-A',
    validTill: '2027-03',
    bloodGroup: 'O+',
  },
  {
    id: 'george',
    student: 'George Kettut',
    photo: 'assets/img/students/student-02.jpg',
    admissionNo: 'AD9892421',
    className: 'II-A',
    validTill: '2026-08',
    bloodGroup: 'B+',
  },
  {
    id: 'sophia',
    student: 'Sophia Reyes',
    photo: 'assets/img/students/student-03.jpg',
    admissionNo: 'AD9892440',
    className: 'III-A',
    validTill: '2027-03',
    bloodGroup: 'A+',
  },
];

export const statusOf = (card: IdCard): CardStatus => {
  const months = monthsUntil(card.validTill);
  if (months < 0) return 'Expired';
  return months <= EXPIRING_WITHIN ? 'Expiring' : 'Active';
};

export const statusTint = (status: CardStatus) =>
  ({ Active: 'success', Expiring: 'warning', Expired: 'danger' })[status];

/** The preview card is the first one in the register, not a copy of it. */
export const PREVIEW = CARDS[0];

export const SCHOOL_NAME = 'Karkaii International';

/* ------------------------------------------------------------------ *
 * The dialog                                                         *
 * ------------------------------------------------------------------ */

/** The Issue dialog lists students; it lists the ones the register has. */
export const ISSUABLE = [CARDS[0].student, CARDS[1].student];

export const TEMPLATES = ['Standard Blue', 'Minimal'];
