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
  SignupCredentials,
} from './auth.types';

export interface AuthService {
  login(credentials: LoginCredentials): Promise<AuthSession>;
  /** Creates the person's account only — no school yet. Follow with `createOrganization` + `switchOrganization`. */
  signup(credentials: SignupCredentials): Promise<AuthSession>;
  /** Creates a school and makes the signed-in person its owner. Call `switchOrganization` after this to act in it. */
  createOrganization(payload: { name: string; slug: string }): Promise<void>;
  /** Makes `slug` the active school for the session; returns a new session scoped to it. */
  switchOrganization(slug: string): Promise<AuthSession>;
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
