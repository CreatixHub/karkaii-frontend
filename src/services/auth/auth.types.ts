/**
 * Authentication domain contract.
 */

import type { UserRole } from '@constants/app.constants';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  /** Fine-grained permissions, e.g. "students.create". */
  permissions: string[];
  avatarUrl: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
  /** Persist the session across browser restarts. */
  rememberMe?: boolean;
}

/** What a successful `POST /auth/login` returns. */
export interface AuthSession {
  user: AuthUser;
  accessToken: string;
  /** Optional: only present when the backend issues refresh tokens. */
  refreshToken?: string;
  /** ISO 8601 expiry of the access token. */
  expiresAt?: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  token: string;
  password: string;
}
