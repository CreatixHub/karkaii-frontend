import type { ApexOptions } from 'apexcharts';
import type { Stat } from '../../shared/StatStrip';

/* ------------------------------------------------------------------ *
 * The delivery trend                                                 *
 * ------------------------------------------------------------------ */

export const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

/** Percent delivered, one point a day. */
export const DELIVERY = [94, 96, 95, 97, 96, 98, 96];

/** Today is the last day on the chart. */
export const DELIVERED = DELIVERY[DELIVERY.length - 1];

export const trendSeries = [{ name: 'Delivered %', data: DELIVERY }];

export const trendOptions: ApexOptions = {
  chart: { type: 'line', height: 300, toolbar: { show: false } },
  xaxis: { categories: DAYS },
  colors: ['#0ca678'],
  stroke: { curve: 'smooth', width: 3 },
  dataLabels: { enabled: false },
  yaxis: { max: 100 },
};

/* ------------------------------------------------------------------ *
 * The day                                                            *
 * ------------------------------------------------------------------ */

export const SENT_TODAY = 3240;
export const SCHEDULED = 7;
export const SUGGESTIONS = 12;
export const BEST_SEND_TIME = '3PM';
export const CREDITS = 8420;

const count = (total: number) => total.toLocaleString('en-US');

export const STATS: Stat[] = [
  { id: 'sent', label: 'Sent Today', value: count(SENT_TODAY), icon: 'ti ti-send', tint: 'primary' },
  {
    id: 'delivered',
    label: 'Delivered',
    value: `${DELIVERED}%`,
    icon: 'ti ti-circle-check',
    tint: 'success',
  },
  { id: 'scheduled', label: 'Scheduled', value: String(SCHEDULED), icon: 'ti ti-clock', tint: 'info' },
  {
    id: 'suggestions',
    label: 'Suggestions',
    value: String(SUGGESTIONS),
    icon: 'ti ti-bulb',
    tint: 'warning',
  },
  {
    id: 'best-time',
    label: 'Best Send Time',
    value: BEST_SEND_TIME,
    icon: 'ti ti-clock-hour-4',
    tint: 'secondary',
  },
  { id: 'credits', label: 'Credits', value: count(CREDITS), icon: 'ti ti-coins', tint: 'danger' },
];

/* ------------------------------------------------------------------ *
 * The drafting panel                                                 *
 * ------------------------------------------------------------------ */

export const CHANNELS = ['SMS', 'Email', 'Push'];

/** The draft the template ships showing, before anything is asked of it. */
export const SAMPLE_DRAFT =
  'Dear Parent, reminder: PTM on Sat 10 AM. Please confirm attendance.';

export const INTENT_PLACEHOLDER = 'e.g. Remind parents about PTM';

/**
 * What the assistant writes back. With nothing asked it returns the sample the
 * template prints; with an intent it works that intent into the same shape.
 */
export const draftFor = (intent: string, channel: string) => {
  const asked = intent.trim();
  if (asked === '') return SAMPLE_DRAFT;
  return `Dear Parent, ${asked.charAt(0).toLowerCase()}${asked.slice(1)}. Sent by ${channel}; please confirm.`;
};
