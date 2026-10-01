/**
 * Conversion between API dates (ISO 8601) and the display format the existing
 * template markup uses ("25 Mar 2024").
 *
 * `moment` is already a dependency, but these helpers are dependency-free and
 * cheap; keeping them here means the presentation format is defined once.
 */

const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
] as const;

const MONTH_INDEX: Record<string, number> = MONTHS.reduce<Record<string, number>>(
  (acc, month, index) => {
    acc[month.toLowerCase()] = index;
    return acc;
  },
  {},
);

/** Parses "25 Mar 2024" into an ISO date string ("2024-03-25"). */
export function displayDateToIso(value: string | undefined | null): string | null {
  if (!value) return null;

  const match = /^(\d{1,2})\s+([A-Za-z]{3,})\s+(\d{4})$/.exec(value.trim());
  if (!match) {
    // Already ISO, or some other format — let Date decide.
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime())
      ? null
      : parsed.toISOString().slice(0, 10);
  }

  const [, day, monthName, year] = match;
  const monthIndex = MONTH_INDEX[monthName.slice(0, 3).toLowerCase()];
  if (monthIndex === undefined) return null;

  const month = String(monthIndex + 1).padStart(2, '0');
  return `${year}-${month}-${day.padStart(2, '0')}`;
}

/** Formats an ISO date as "25 Mar 2024" for display. */
export function formatDisplayDate(iso: string | undefined | null): string {
  if (!iso) return '';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  const day = String(date.getUTCDate()).padStart(2, '0');
  return `${day} ${MONTHS[date.getUTCMonth()]} ${date.getUTCFullYear()}`;
}

/** Formats an ISO timestamp as "25 Mar 2024, 02:30 PM". */
export function formatDisplayDateTime(iso: string | undefined | null): string {
  if (!iso) return '';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';

  const hours24 = date.getHours();
  const suffix = hours24 >= 12 ? 'PM' : 'AM';
  const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12;
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${formatDisplayDate(iso)}, ${String(hours12).padStart(2, '0')}:${minutes} ${suffix}`;
}

/** Current time as an ISO string — the wire format for all timestamps. */
export function nowIso(): string {
  return new Date().toISOString();
}
