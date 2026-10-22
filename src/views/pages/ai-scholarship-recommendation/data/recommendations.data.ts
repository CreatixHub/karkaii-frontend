import type { ApexOptions } from 'apexcharts';
import type { Stat } from '../../shared/StatStrip';
import {
  APPLICANTS,
  BUDGET,
  PENDING,
} from '../../scholarship-management/data/scholarships.data';

/* ------------------------------------------------------------------ *
 * The match distribution                                             *
 * ------------------------------------------------------------------ */

export const MATCH_MIX = [
  { scheme: 'Merit', count: 42, colour: '#3577f1' },
  { scheme: 'Need-based', count: 30, colour: '#0ca678' },
  { scheme: 'Sports', count: 14, colour: '#f39c12' },
];

/** Every student the model put forward, whatever scheme it put them forward for. */
export const RECOMMENDED = MATCH_MIX.reduce((total, row) => total + row.count, 0);

export const matchSeries = MATCH_MIX.map((row) => row.count);

export const matchOptions: ApexOptions = {
  chart: { type: 'donut', height: 290 },
  labels: MATCH_MIX.map((row) => row.scheme),
  colors: MATCH_MIX.map((row) => row.colour),
  legend: { position: 'bottom' },
  dataLabels: { enabled: false },
};

/* ------------------------------------------------------------------ *
 * The matches                                                        *
 * ------------------------------------------------------------------ */

export interface Match {
  id: string;
  student: string;
  scheme: string;
  /** How well the model thinks the student fits the scheme, as a percentage. */
  fit: number;
  amount: number;
}

export const MATCHES: Match[] = [
  { id: 'sophia', student: 'Sophia Reyes', scheme: 'Merit Excellence', fit: 96, amount: 1200 },
  { id: 'george', student: 'George Kettut', scheme: 'Need-based Aid', fit: 92, amount: 1800 },
  { id: 'mia', student: 'Mia Bennett', scheme: 'Sports Talent', fit: 84, amount: 900 },
];

/** Ninety is where the template's fit badge turns from amber to green. */
export const STRONG_AT = 90;

export const fitTint = (fit: number) => (fit >= STRONG_AT ? 'success' : 'warning');

/** How well the shortlist fits overall. */
export const MATCH_SCORE = Math.round(
  MATCHES.reduce((total, row) => total + row.fit, 0) / MATCHES.length,
);

export const money = (amount: number) => `$${amount.toLocaleString('en-US')}`;

/* ------------------------------------------------------------------ *
 * The tiles                                                          *
 * ------------------------------------------------------------------ */

export const AWARDED = 62;

export const STATS: Stat[] = [
  { id: 'eligible', label: 'Eligible', value: String(APPLICANTS), icon: 'ti ti-users', tint: 'primary' },
  {
    id: 'recommended',
    label: 'Recommended',
    value: String(RECOMMENDED),
    icon: 'ti ti-bulb',
    tint: 'success',
  },
  { id: 'awarded', label: 'Awarded', value: String(AWARDED), icon: 'ti ti-circle-check', tint: 'info' },
  { id: 'budget', label: 'Budget', value: BUDGET, icon: 'ti ti-cash', tint: 'secondary' },
  {
    id: 'match',
    label: 'Match Score',
    value: `${MATCH_SCORE}%`,
    icon: 'ti ti-percentage',
    tint: 'warning',
  },
  {
    id: 'pending',
    label: 'Pending',
    value: String(PENDING),
    icon: 'ti ti-clock-hour-4',
    tint: 'danger',
  },
];
