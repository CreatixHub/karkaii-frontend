/**
 * Mock authentication.
 *
 * Accepts any password by design — this is a static template, and there is no
 * credential checking to be done client-side. The token it issues is an
 * obviously-fake opaque string, never a real or realistic JWT, so it can never
 * be mistaken for a genuine credential.
 */

import { ApiError, createValidationError, createNotFoundError } from '@services/api/errors';
import { ERROR_CODE } from '@constants/api.constants';
import { USER_ROLE } from '@constants/app.constants';
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
  SignupCredentials,
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

  async signup(credentials: SignupCredentials): Promise<AuthSession> {
    await mockRequest();

    const fieldErrors: Record<string, string> = {};
    if (!credentials.fullName?.trim() || credentials.fullName.trim().length < 2) {
      fieldErrors.fullName = 'Name must be at least 2 characters';
    }
    if (!credentials.email?.trim()) fieldErrors.email = 'Email is required';
    if (!credentials.password || credentials.password.length < 10) {
      fieldErrors.password = 'Password must be at least 10 characters';
    }
    if (!credentials.schoolName?.trim()) fieldErrors.schoolName = 'School name is required';
    if (Object.keys(fieldErrors).length > 0) throw createValidationError(fieldErrors);

    if (demoUsers.some((u) => u.email.toLowerCase() === credentials.email.trim().toLowerCase())) {
      throw new ApiError('An account with this email already exists', { status: 409, code: ERROR_CODE.CONFLICT });
    }

    // Standalone demo: the new person is immediately the admin of their own (fictional) school.
    const user: AuthUser = {
      id: `demo-${Date.now()}`,
      name: credentials.fullName.trim(),
      email: credentials.email.trim().toLowerCase(),
      role: USER_ROLE.ADMIN,
      permissions: ['*'],
      avatarUrl: null,
    };
    const expiresAt = new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString();
    return { user, accessToken: issueToken(user.id), expiresAt };
  },

  async createOrganization(): Promise<void> {
    await mockRequest(); // no multi-tenancy in standalone mode: nothing to create
  },

  async switchOrganization(): Promise<AuthSession> {
    await mockRequest();
    const user = tokenStorage.getUser() ?? defaultDemoUser;
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
