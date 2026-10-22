import { apiClient } from '@services/api/client';
import { endpoints } from '@services/api/endpoints';
import { ApiError } from '@services/api/errors';
import { ERROR_CODE } from '@constants/api.constants';
import type { UserRole } from '@constants/app.constants';
import type { AuthService } from './auth.service';
import type {
  AuthSession,
  AuthUser,
  ForgotPasswordPayload,
  LoginCredentials,
  ResetPasswordPayload,
} from './auth.types';

/** A user document exactly as server/src/models/User.js returns it (secrets are stripped server-side). */
interface BackendUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string | null;
  phone?: string | null;
}

/** Roles with unrestricted UI access. The server still enforces every permission on every request. */
const FULL_ACCESS_ROLES: ReadonlySet<string> = new Set(['superadmin', 'admin']);

/** Backend user -> the frontend's `AuthUser` (renames `avatar`, derives `permissions` from the role). */
function toAuthUser(u: BackendUser): AuthUser {
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    permissions: FULL_ACCESS_ROLES.has(u.role) ? ['*'] : [],
    avatarUrl: u.avatar ?? null,
  };
}

interface LoginResponse {
  accessToken?: string;
  user?: BackendUser;
  /** Present instead of a session when the account has two-step verification switched on. */
  requires2FA?: boolean;
  challenge?: string;
}

function toSession(r: LoginResponse): AuthSession {
  if (r.requires2FA) {
    // The two-step screen is not wired yet; fail clearly instead of "signing in" with no token.
    throw new ApiError('Two-step verification is enabled on this account but is not available yet. Ask an administrator to turn it off.', {
      status: 403,
      code: ERROR_CODE.FORBIDDEN,
    });
  }
  if (!r.accessToken || !r.user) {
    throw new ApiError('The server returned an unexpected sign-in response.', { status: 502, code: ERROR_CODE.SERVER });
  }
  return { accessToken: r.accessToken, user: toAuthUser(r.user) };
}

/**
 * The client deliberately replaces server error text with generic copy (it may leak internals on a 5xx).
 * For sign-in the 4xx messages are written for users ("Invalid email or password", "Account temporarily
 * locked...", "Your account is inactive...") and the generic copy would be wrong - e.g. a bad password
 * must not say "your session has expired" - so those, and only those, are passed through.
 */
function withServerMessage(error: unknown): never {
  if (error instanceof ApiError && [400, 401, 403, 429].includes(error.status)) {
    const message = (error.details as { message?: unknown } | undefined)?.message;
    if (typeof message === 'string' && message) {
      throw new ApiError(message, { status: error.status, code: error.code, details: error.details, fieldErrors: error.fieldErrors });
    }
  }
  throw error;
}

export const authHttpService: AuthService = {
  async login(credentials: LoginCredentials) {
    // `skipAuth` — there is no session yet, so no Authorization header.
    // Only email + password are sent: `rememberMe` is a client-side storage choice, not part of the API.
    try {
      const response = await apiClient.post<LoginResponse>(
        endpoints.auth.login,
        { email: credentials.email, password: credentials.password },
        { skipAuth: true, skipRefresh: true },
      );
      return toSession(response);
    } catch (error) {
      return withServerMessage(error);
    }
  },

  logout() {
    return apiClient.post<void>(endpoints.auth.logout, undefined, { skipRefresh: true });
  },

  async getCurrentUser(signal?: AbortSignal) {
    return toAuthUser(await apiClient.get<BackendUser>(endpoints.auth.me, { signal }));
  },

  async refresh() {
    // The refresh token is the httpOnly `rt` cookie; there is no body. `skipRefresh` stops this call refreshing itself.
    const response = await apiClient.post<LoginResponse>(endpoints.auth.refresh, undefined, {
      skipAuth: true,
      skipRefresh: true,
    });
    return toSession(response);
  },

  forgotPassword(payload: ForgotPasswordPayload) {
    return apiClient.post<void>(endpoints.auth.forgotPassword, payload, {
      skipAuth: true,
      skipRefresh: true,
    });
  },

  resetPassword(payload: ResetPasswordPayload) {
    return apiClient.post<void>(endpoints.auth.resetPassword, payload, {
      skipAuth: true,
      skipRefresh: true,
    });
  },
};
