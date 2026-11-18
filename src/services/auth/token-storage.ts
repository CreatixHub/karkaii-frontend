/**
 * The only module permitted to read or write auth tokens.
 *
 * Session rule: a sign-in belongs to ONE browser tab. Everything lives in
 * sessionStorage (per tab, gone when the tab closes), so a new tab or a pasted
 * link never inherits a session and always starts at the login page. A reload
 * of the same tab keeps the session.
 *
 * The server's httpOnly refresh cookie is shared by all tabs, so it must never
 * restore a session by itself: `canRestoreSession()` only says yes when THIS tab
 * has signed in.
 */

import { STORAGE_KEYS } from '@constants/app.constants';
import type { AuthUser } from './auth.types';

const TAB_SESSION_KEY = 'karkaii.auth.tab-session';

let inMemoryAccessToken: string | null = null;
let inMemoryRefreshToken: string | null = null;

/** Storage can throw in private mode; never let that crash the app. */
function safeGet(key: string): string | null {
  try {
    return window.sessionStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSet(key: string, value: string): void {
  try {
    window.sessionStorage.setItem(key, value);
  } catch {
    // The in-memory copy still serves this page load.
  }
}

function safeRemove(key: string): void {
  try {
    window.sessionStorage.removeItem(key);
  } catch {
    // Nothing to do.
  }
}

/** Sign-ins from older versions of the app were kept in localStorage; remove them once. */
function dropLegacyLocalStorage(): void {
  try {
    window.localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    window.localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    window.localStorage.removeItem(STORAGE_KEYS.USER);
  } catch {
    // Nothing to do.
  }
}
dropLegacyLocalStorage();

export const tokenStorage = {
  getAccessToken(): string | null {
    return inMemoryAccessToken ?? safeGet(STORAGE_KEYS.ACCESS_TOKEN);
  },

  getRefreshToken(): string | null {
    return inMemoryRefreshToken ?? safeGet(STORAGE_KEYS.REFRESH_TOKEN);
  },

  /** `_persist` is accepted for compatibility ("Remember me" no longer widens a session beyond its tab). */
  setTokens(accessToken: string, refreshToken?: string, _persist = true): void {
    inMemoryAccessToken = accessToken;
    inMemoryRefreshToken = refreshToken ?? null;
    safeSet(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
    if (refreshToken) safeSet(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
    safeSet(TAB_SESSION_KEY, '1');
  },

  /** Caches the user so a reload of this tab can render immediately, before `me` resolves. */
  setUser(user: AuthUser, _persist = true): void {
    safeSet(STORAGE_KEYS.USER, JSON.stringify(user));
  },

  getUser(): AuthUser | null {
    const raw = safeGet(STORAGE_KEYS.USER);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as AuthUser;
    } catch {
      return null;
    }
  },

  /** Removes every trace of the session. Called on logout and on 401. */
  clear(): void {
    inMemoryAccessToken = null;
    inMemoryRefreshToken = null;
    safeRemove(STORAGE_KEYS.ACCESS_TOKEN);
    safeRemove(STORAGE_KEYS.REFRESH_TOKEN);
    safeRemove(STORAGE_KEYS.USER);
    safeRemove(TAB_SESSION_KEY);
    dropLegacyLocalStorage();
  },

  hasSession(): boolean {
    return this.getAccessToken() !== null;
  },

  /** Kept for compatibility: every sign-in is per-tab now. */
  isPersisted(): boolean {
    return false;
  },

  /** Kept for compatibility: `setTokens` already marks this tab. */
  markEphemeralSession(): void {
    safeSet(TAB_SESSION_KEY, '1');
  },

  /**
   * Whether the app may restore a session on start-up (from the refresh cookie or the cached user).
   * True only for a tab that signed in itself, so a new tab always lands on the login page.
   */
  canRestoreSession(): boolean {
    return safeGet(TAB_SESSION_KEY) === '1';
  },
};