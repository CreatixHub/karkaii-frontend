import type { ApexOptions } from 'apexcharts';
import type { Stat } from '../../shared/StatStrip';

/* ------------------------------------------------------------------ *
 * The read                                                           *
 * ------------------------------------------------------------------ */

export const AVG_SENTIMENT = 82;
export const POSITIVE = 64;
export const NEUTRAL = 26;

/** Whatever is neither positive nor neutral. */
export const NEGATIVE = 100 - POSITIVE - NEUTRAL;

export const CONCERNS = 18;
export const ANALYZED = 2140;

export const STATS: Stat[] = [
  {
    id: 'sentiment',
    label: 'Avg Sentiment',
    value: String(AVG_SENTIMENT),
    icon: 'ti ti-mood-smile',
    tint: 'primary',
  },
  {
    id: 'positive',
    label: 'Positive',
    value: `${POSITIVE}%`,
    icon: 'ti ti-mood-happy',
    tint: 'success',
  },
  {
    id: 'neutral',
    label: 'Neutral',
    value: `${NEUTRAL}%`,
    icon: 'ti ti-mood-neutral',
    tint: 'warning',
  },
  {
    id: 'negative',
    label: 'Negative',
    value: `${NEGATIVE}%`,
    icon: 'ti ti-mood-sad',
    tint: 'danger',
  },
  {
    id: 'concerns',
    label: 'Concerns Flagged',
    value: String(CONCERNS),
    icon: 'ti ti-flag',
    tint: 'info',
  },
  {
    id: 'analyzed',
    label: 'Analyzed',
    value: ANALYZED.toLocaleString('en-US'),
    icon: 'ti ti-users',
    tint: 'secondary',
  },
];

/* ------------------------------------------------------------------ *
 * The conduct radar                                                  *
 * ------------------------------------------------------------------ */

export const DIMENSIONS = [
  { label: 'Focus', score: 80 },
  { label: 'Conduct', score: 65 },
  { label: 'Teamwork', score: 72 },
  { label: 'Regularity', score: 58 },
  { label: 'Positivity', score: 85 },
];

export const radarSeries = [{ name: 'Score', data: DIMENSIONS.map((entry) => entry.score) }];

export const radarOptions: ApexOptions = {
  chart: { type: 'radar', height: 300, toolbar: { show: false } },
  labels: DIMENSIONS.map((entry) => entry.label),
  colors: ['#3577f1'],
  dataLabels: { enabled: false },
};

/* ------------------------------------------------------------------ *
 * The flagged students                                               *
 * ------------------------------------------------------------------ */

export type Trend = 'Declining' | 'Watch' | 'Improving';

export interface Flag {
  id: string;
  student: string;
  signal: string;
  trend: Trend;
}

export const trendTint = (trend: Trend) =>
  ({ Declining: 'danger', Watch: 'warning', Improving: 'success' })[trend];

/**
 * What the row's button offers follows from the trend: a declining student goes
 * to the risk read, one on watch gets an incident logged.
 */
export const actionOf = (trend: Trend): { label: string; target: 'risk' | 'discipline' } =>
  trend === 'Declining'
    ? { label: 'Review', target: 'risk' }
    : { label: 'Log', target: 'discipline' };

export const FLAGS: Flag[] = [
  {
    id: 'george',
    student: 'George Kettut',
    signal: 'Withdrawn in class',
    trend: 'Declining',
  },
  {
    id: 'liam',
    student: 'Liam Walker',
    signal: 'Frequent conflicts',
    trend: 'Watch',
  },
];
