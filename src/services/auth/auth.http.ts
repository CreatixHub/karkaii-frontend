import { apiClient } from '@services/api/client';
import { endpoints } from '@services/api/endpoints';
import type { AuthService } from './auth.service';
import type {
  AuthSession,
  AuthUser,
  ForgotPasswordPayload,
  LoginCredentials,
  ResetPasswordPayload,
} from './auth.types';

export const authHttpService: AuthService = {
  login(credentials: LoginCredentials) {
    // `skipAuth` — there is no session yet, so no Authorization header.
    return apiClient.post<AuthSession>(endpoints.auth.login, credentials, {
      skipAuth: true,
    });
  },

  logout() {
    return apiClient.post<void>(endpoints.auth.logout);
  },

  getCurrentUser(signal?: AbortSignal) {
    return apiClient.get<AuthUser>(endpoints.auth.me, { signal });
  },

  refresh() {
    return apiClient.post<AuthSession>(endpoints.auth.refresh, undefined, {
      skipAuth: true,
    });
  },

  forgotPassword(payload: ForgotPasswordPayload) {
    return apiClient.post<void>(endpoints.auth.forgotPassword, payload, {
      skipAuth: true,
    });
  },

  resetPassword(payload: ResetPasswordPayload) {
    return apiClient.post<void>(endpoints.auth.resetPassword, payload, {
      skipAuth: true,
    });
  },
};
