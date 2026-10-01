/**
 * The only module permitted to read or write auth tokens.
 *
 * Centralizing this means swapping localStorage for cookies, sessionStorage or
 * an in-memory-only strategy later is a single-file change.
 *
 * Security notes:
 *  - Tokens in localStorage are readable by any script on the origin, so they
 *    are vulnerable to XSS. For production, prefer httpOnly cookies issued by
 *    the backend; in that case `getAccessToken` returns null and the client
 *    simply sends credentials instead. Both paths are supported.
 *  - A `persist: false` login keeps the token in memory only, so it disappears
 *    when the tab closes.
 */

import { STORAGE_KEYS } from '@constants/app.constants';
import type { AuthUser } from './auth.types';

/** Used when `rememberMe` is false, and as a fallback if storage is blocked. */
let inMemoryAccessToken: string | null = null;
let inMemoryRefreshToken: string | null = null;

/** Private-mode browsers can throw on access; never let that crash the app. */
function safeGet(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSet(key: string, value: string): void {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Storage unavailable — the in-memory copy still serves this session.
  }
}

function safeRemove(key: string): void {
  try {
    window.localStorage.removeItem(key);
  } catch {
    // Nothing to do.
  }
}

export const tokenStorage = {
  getAccessToken(): string | null {
    return inMemoryAccessToken ?? safeGet(STORAGE_KEYS.ACCESS_TOKEN);
  },

  getRefreshToken(): string | null {
    return inMemoryRefreshToken ?? safeGet(STORAGE_KEYS.REFRESH_TOKEN);
  },

  /**
   * @param persist When false the token is held in memory only and is lost on
   * reload — the correct behaviour for a "do not remember me" login.
   */
  setTokens(
    accessToken: string,
    refreshToken?: string,
    persist = true,
  ): void {
    inMemoryAccessToken = accessToken;
    inMemoryRefreshToken = refreshToken ?? null;

    if (!persist) return;

    safeSet(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
    if (refreshToken) safeSet(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
  },

  /** Caches the user so a reload can render immediately, before `me` resolves. */
  setUser(user: AuthUser, persist = true): void {
    if (!persist) return;
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
  },

  hasSession(): boolean {
    return this.getAccessToken() !== null;
  },
};
