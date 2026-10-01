/**
 * Authentication service contract.
 *
 * All authentication logic lives behind this interface — no component ever
 * performs a login request itself.
 */

import { createService } from '@services/api/create-service';
import { authHttpService } from './auth.http';
import { authMockService } from './auth.mock';
import type {
  AuthSession,
  AuthUser,
  ForgotPasswordPayload,
  LoginCredentials,
  ResetPasswordPayload,
} from './auth.types';

export interface AuthService {
  login(credentials: LoginCredentials): Promise<AuthSession>;
  logout(): Promise<void>;
  getCurrentUser(signal?: AbortSignal): Promise<AuthUser>;
  refresh(): Promise<AuthSession>;
  forgotPassword(payload: ForgotPasswordPayload): Promise<void>;
  resetPassword(payload: ResetPasswordPayload): Promise<void>;
}

export const authService: AuthService = createService(
  authMockService,
  authHttpService,
);
