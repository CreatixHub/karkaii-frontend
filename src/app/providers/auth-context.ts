/**
 * The auth context object, kept in its own module so that `AuthProvider.tsx`
 * exports only a component. That satisfies the `react-refresh/only-export-
 * components` lint rule and keeps fast refresh working.
 */

import { createContext } from 'react';
import type { UserRole } from '@constants/app.constants';
import type { ApiError } from '@services/api/errors';
import type { AuthUser, LoginCredentials } from '@services/auth/auth.types';

export type AuthStatus =
  /** Restoring a stored session; nothing should render behind a guard yet. */
  | 'initializing'
  | 'authenticated'
  | 'unauthenticated';

export interface AuthContextValue {
  user: AuthUser | null;
  status: AuthStatus;
  isAuthenticated: boolean;
  /** True while a login request is in flight. */
  isLoggingIn: boolean;
  error: ApiError | null;
  /** Resolves with the signed-in user; rejects with an `ApiError` (also exposed as `error`) when sign-in fails. */
  login: (credentials: LoginCredentials) => Promise<AuthUser>;
  logout: () => Promise<void>;
  hasRole: (role: UserRole | UserRole[]) => boolean;
  hasPermission: (permission: string) => boolean;
  clearError: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
