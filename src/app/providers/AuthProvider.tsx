/**
 * Owns all authentication state for the application.
 *
 * Responsibilities:
 *  - restore a stored session on mount (bootstrap)
 *  - expose login / logout and role & permission checks
 *  - register the API client's token provider and 401 handler
 *
 * Redux is intentionally left alone here: it holds theme and sidebar UI state,
 * while auth — which needs an async bootstrap and is read by route guards —
 * lives in context.
 *
 * While `VITE_AUTH_ENABLED` is false the provider settles immediately into an
 * unauthenticated state and nothing is gated, which is exactly how the static
 * template behaves today.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { env } from '@config/env';
import type { UserRole } from '@constants/app.constants';
import { apiClient } from '@services/api/client';
import type { ApiError } from '@services/api/errors';
import { toApiError } from '@services/api/errors';
import { authService } from '@services/auth/auth.service';
import { tokenStorage } from '@services/auth/token-storage';
import type { AuthSession, AuthUser, LoginCredentials } from '@services/auth/auth.types';
import { AuthContext } from './auth-context';
import type { AuthContextValue, AuthStatus } from './auth-context';

export interface AuthProviderProps {
  children: ReactNode;
}

/** Module-level so every component instance and effect run shares it (see `refreshSession`). */
let refreshInFlight: Promise<boolean> | null = null;

const sleep = (ms: number) => new Promise<void>((resolve) => window.setTimeout(resolve, ms));

/**
 * Trades the httpOnly refresh cookie for a new access token and stores it.
 * A 409 means another tab/request rotated the cookie a moment ago: the browser's cookie jar already holds the
 * new one, so waiting briefly and trying again succeeds without signing anyone out.
 */
async function exchangeRefreshCookie(onSession: (session: AuthSession) => void): Promise<boolean> {
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      const session = await authService.refresh();
      const persist = tokenStorage.isPersisted();
      tokenStorage.setTokens(session.accessToken, undefined, persist);
      tokenStorage.setUser(session.user, persist);
      onSession(session);
      return true;
    } catch (raw: unknown) {
      const error = toApiError(raw);
      if (error.status === 409 && attempt < 2) {
        await sleep(300 * (attempt + 1));
        continue;
      }
      return false;
    }
  }
  return false;
}

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [status, setStatus] = useState<AuthStatus>(
    env.authEnabled ? 'initializing' : 'unauthenticated',
  );
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const mountedRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  /** Clears local session state. Also used as the 401 handler. */
  const clearSession = useCallback(() => {
    tokenStorage.clear();
    if (!mountedRef.current) return;
    setUser(null);
    setStatus('unauthenticated');
  }, []);

  /**
   * Exchanges the httpOnly refresh cookie for a new access token (the server rotates the cookie each time).
   * Used by the API client when a request gets a 401, and on reload when only the cookie survived.
   */
  const refreshSession = useCallback((): Promise<boolean> => {
    // The refresh token is single-use, so only ONE exchange may run at a time across the whole app - React
    // StrictMode's double-invoked startup effect and the API client's 401 handler would otherwise race and the
    // server would see a replayed token. Everyone awaits the same promise.
    if (!refreshInFlight) {
      refreshInFlight = exchangeRefreshCookie(
        (session) => {
          if (!mountedRef.current) return;
          setUser(session.user);
          setStatus('authenticated');
        },
      ).finally(() => {
        refreshInFlight = null;
      });
    }
    return refreshInFlight;
  }, []);

  // Teach the API client where to find the token, how to renew it and what to do when the session is truly over.
  // Done via callbacks so `client.ts` has no dependency on the auth module.
  useEffect(() => {
    apiClient.setAuthTokenProvider(() => tokenStorage.getAccessToken());
    apiClient.setRefreshHandler(refreshSession);
    apiClient.setUnauthorizedHandler(() => clearSession());

    return () => {
      apiClient.setAuthTokenProvider(null);
      apiClient.setRefreshHandler(null);
      apiClient.setUnauthorizedHandler(null);
    };
  }, [clearSession, refreshSession]);

  // Bootstrap: restore a session on first load.
  useEffect(() => {
    if (!env.authEnabled) {
      setStatus('unauthenticated');
      return;
    }

    const hasToken = tokenStorage.hasSession();
    if (!hasToken && !tokenStorage.canRestoreSession()) {
      setStatus('unauthenticated');
      return;
    }

    const controller = new AbortController();

    // A stored token may be expired; the client refreshes it transparently on the 401. With no token at all
    // (e.g. a reload after a non-remembered sign-in) the refresh cookie is used directly.
    const restore = hasToken
      ? authService.getCurrentUser(controller.signal).then((currentUser) => {
          if (!mountedRef.current) return;
          setUser(currentUser);
          setStatus('authenticated');
        })
      : refreshSession().then((ok) => {
          if (!ok && mountedRef.current) clearSession();
        });

    restore.catch((raw: unknown) => {
      // Our own cleanup aborts the request (unmount, StrictMode's double effect): that says nothing about the
      // session and must never sign anyone out.
      if (controller.signal.aborted || toApiError(raw).isCancelled) return;
      // A stored token that no longer works (and could not be refreshed) is treated as no session.
      if (!mountedRef.current) return;
      clearSession();
    });

    return () => controller.abort();
  }, [clearSession, refreshSession]);

  const login = useCallback(
    async (credentials: LoginCredentials): Promise<AuthUser> => {
      setIsLoggingIn(true);
      setError(null);

      try {
        const session = await authService.login(credentials);
        const persist = credentials.rememberMe ?? true;

        tokenStorage.clear(); // never mix a previous account's leftovers with this session
        tokenStorage.setTokens(session.accessToken, session.refreshToken, persist);
        tokenStorage.setUser(session.user, persist);
        if (!persist) tokenStorage.markEphemeralSession();

        if (mountedRef.current) {
          setUser(session.user);
          setStatus('authenticated');
          setIsLoggingIn(false);
        }
        return session.user;
      } catch (raw: unknown) {
        const apiError = toApiError(raw);
        if (mountedRef.current) {
          setError(apiError);
          setIsLoggingIn(false);
        }
        throw apiError; // the caller (a form) shows `apiError.message`
      }
    },
    [],
  );

  const logout = useCallback(async (): Promise<void> => {
    try {
      await authService.logout();
    } catch {
      // Sign the user out locally even if the server call fails — leaving
      // them "logged in" because the network hiccuped would be worse.
    } finally {
      clearSession();
    }
  }, [clearSession]);

  const hasRole = useCallback(
    (role: UserRole | UserRole[]): boolean => {
      if (!user) return false;
      return Array.isArray(role) ? role.includes(user.role) : user.role === role;
    },
    [user],
  );

  const hasPermission = useCallback(
    (permission: string): boolean => {
      if (!user) return false;
      // "*" is the superuser wildcard.
      return (
        user.permissions.includes('*') || user.permissions.includes(permission)
      );
    },
    [user],
  );

  const clearError = useCallback(() => setError(null), []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      status,
      isAuthenticated: status === 'authenticated',
      isLoggingIn,
      error,
      login,
      logout,
      hasRole,
      hasPermission,
      clearError,
    }),
    [
      user,
      status,
      isLoggingIn,
      error,
      login,
      logout,
      hasRole,
      hasPermission,
      clearError,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
