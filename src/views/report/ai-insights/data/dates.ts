const MONTHS = 'Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec'.split(' ');

/** `02 Jul 2026` to a UTC timestamp. UTC throughout, so no zone can shift a day. */
export const parseDate = (value: string) => {
  const [day, month, year] = value.split(' ');
  return Date.UTC(Number(year), MONTHS.indexOf(month), Number(day));
};

/** A UTC timestamp back to `02 Jul 2026`. */
export const formatDate = (stamp: number) => {
  const date = new Date(stamp);
  const day = String(date.getUTCDate()).padStart(2, '0');
  return `${day} ${MONTHS[date.getUTCMonth()]} ${date.getUTCFullYear()}`;
};

/** Whole days between two `d MMM yyyy` dates. Negative when `to` is the earlier. */
export const daysBetween = (from: string, to: string) =>
  Math.round((parseDate(to) - parseDate(from)) / 86400000);

/** `d MMM yyyy` plus a number of days, as `d MMM yyyy`. */
export const addDays = (from: string, days: number) =>
  formatDate(parseDate(from) + days * 86400000);

/** `02 Jul 2026` without the year, for timelines that stay inside one. */
export const shortDate = (value: string) => value.split(' ').slice(0, 2).join(' ');
