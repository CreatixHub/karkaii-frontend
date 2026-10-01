/**
 * Mock authentication.
 *
 * Accepts any password by design — this is a static template, and there is no
 * credential checking to be done client-side. The token it issues is an
 * obviously-fake opaque string, never a real or realistic JWT, so it can never
 * be mistaken for a genuine credential.
 */

import { createValidationError, createNotFoundError } from '@services/api/errors';
import { defaultDemoUser, demoUsers } from '@mocks/auth.mock';
import { mockRequest } from '@mocks/mock.utils';
import { tokenStorage } from './token-storage';
import type { AuthService } from './auth.service';
import type {
  AuthSession,
  AuthUser,
  ForgotPasswordPayload,
  LoginCredentials,
  ResetPasswordPayload,
} from './auth.types';

const MOCK_TOKEN_PREFIX = 'mock-access-token';

function issueToken(userId: string): string {
  return `${MOCK_TOKEN_PREFIX}.${userId}.${Date.now()}`;
}

function findUserByEmail(email: string): AuthUser {
  const match = demoUsers.find(
    (user) => user.email.toLowerCase() === email.trim().toLowerCase(),
  );
  return match ?? defaultDemoUser;
}

export const authMockService: AuthService = {
  async login(credentials: LoginCredentials): Promise<AuthSession> {
    await mockRequest();

    // Shape-level validation only, mirroring what the server would reject.
    const fieldErrors: Record<string, string> = {};
    if (!credentials.email?.trim()) fieldErrors.email = 'Email is required';
    if (!credentials.password) fieldErrors.password = 'Password is required';
    if (Object.keys(fieldErrors).length > 0) {
      throw createValidationError(fieldErrors);
    }

    const user = findUserByEmail(credentials.email);
    const expiresAt = new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString();

    return { user, accessToken: issueToken(user.id), expiresAt };
  },

  async logout(): Promise<void> {
    await mockRequest();
  },

  async getCurrentUser(): Promise<AuthUser> {
    await mockRequest();

    // Restore the cached user so a page reload keeps the session.
    const cached = tokenStorage.getUser();
    if (cached) return cached;

    // A token with no cached user means the session is unusable.
    if (!tokenStorage.hasSession()) throw createNotFoundError('Session');
    return defaultDemoUser;
  },

  async refresh(): Promise<AuthSession> {
    await mockRequest();

    const user = tokenStorage.getUser() ?? defaultDemoUser;
    const expiresAt = new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString();

    return { user, accessToken: issueToken(user.id), expiresAt };
  },

  async forgotPassword(payload: ForgotPasswordPayload): Promise<void> {
    await mockRequest();
    if (!payload.email?.trim()) {
      throw createValidationError({ email: 'Email is required' });
    }
  },

  async resetPassword(payload: ResetPasswordPayload): Promise<void> {
    await mockRequest();
    if (!payload.password) {
      throw createValidationError({ password: 'Password is required' });
    }
  },
};
