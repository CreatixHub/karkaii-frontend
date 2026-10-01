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
import type { AuthUser, LoginCredentials } from '@services/auth/auth.types';
import { AuthContext } from './auth-context';
import type { AuthContextValue, AuthStatus } from './auth-context';

export interface AuthProviderProps {
  children: ReactNode;
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

  // Teach the API client where to find the token and what to do on a 401.
  // Done via callbacks so `client.ts` has no dependency on the auth module.
  useEffect(() => {
    apiClient.setAuthTokenProvider(() => tokenStorage.getAccessToken());
    apiClient.setUnauthorizedHandler(() => clearSession());

    return () => {
      apiClient.setAuthTokenProvider(null);
      apiClient.setUnauthorizedHandler(null);
    };
  }, [clearSession]);

  // Bootstrap: restore a session from storage on first load.
  useEffect(() => {
    if (!env.authEnabled) {
      setStatus('unauthenticated');
      return;
    }

    if (!tokenStorage.hasSession()) {
      setStatus('unauthenticated');
      return;
    }

    const controller = new AbortController();

    authService
      .getCurrentUser(controller.signal)
      .then((currentUser) => {
        if (!mountedRef.current) return;
        setUser(currentUser);
        setStatus('authenticated');
      })
      .catch(() => {
        // A stored token that no longer works is treated as no session.
        if (!mountedRef.current) return;
        clearSession();
      });

    return () => controller.abort();
  }, [clearSession]);

  const login = useCallback(
    async (credentials: LoginCredentials): Promise<boolean> => {
      setIsLoggingIn(true);
      setError(null);

      try {
        const session = await authService.login(credentials);
        const persist = credentials.rememberMe ?? true;

        tokenStorage.setTokens(session.accessToken, session.refreshToken, persist);
        tokenStorage.setUser(session.user, persist);

        if (mountedRef.current) {
          setUser(session.user);
          setStatus('authenticated');
          setIsLoggingIn(false);
        }
        return true;
      } catch (raw: unknown) {
        const apiError = toApiError(raw);
        if (mountedRef.current) {
          setError(apiError);
          setIsLoggingIn(false);
        }
        return false;
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
