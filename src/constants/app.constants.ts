/**
 * Application-wide constants that are not environment-specific.
 */

/** Default list-query settings applied when a caller does not specify them. */
export const DEFAULT_PAGE = 1;
export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [10, 25, 50, 100] as const;

/**
 * localStorage keys owned by the auth layer.
 * Namespaced so they cannot collide with the theme keys the template already
 * writes (`dataTheme`, `dataLayout`, ...).
 */
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'preskool.auth.accessToken',
  REFRESH_TOKEN: 'preskool.auth.refreshToken',
  USER: 'preskool.auth.user',
} as const;

/** Roles the application understands. Mirrors the four dashboards. */
export const USER_ROLE = {
  ADMIN: 'admin',
  TEACHER: 'teacher',
  STUDENT: 'student',
  PARENT: 'parent',
} as const;

export type UserRole = (typeof USER_ROLE)[keyof typeof USER_ROLE];

/** Date format tokens used when presenting API (ISO) dates to users. */
export const DATE_FORMATS = {
  /** e.g. 25 Mar 2024 — the format the existing template markup uses. */
  DISPLAY: 'DD MMM YYYY',
  DISPLAY_WITH_TIME: 'DD MMM YYYY, hh:mm A',
  /** Wire format for the API. */
  ISO_DATE: 'YYYY-MM-DD',
} as const;
