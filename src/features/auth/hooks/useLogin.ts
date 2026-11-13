/**
 * Feature hook for a login form.
 *
 * Combines `useForm` (validation + submission) with `useAuth` (session), so the login page only needs to
 * bind inputs and render errors - it contains no authentication logic of its own.
 *
 * After a successful sign-in the user goes to: `redirectTo`, else the dashboard of the role they picked in
 * "Sign in as", else where they were headed (`location.state.from`, set by `ProtectedRoute`), else the
 * dashboard for their main role.
 *
 * `role` is the optional "Sign in as" choice. Empty = use the person's main role. The server refuses a role
 * the person does not hold (owners and admins may pick any).
 *
 * Standalone prototype mode (`VITE_USE_MOCK_API=true`): there is no server to check credentials against, so -
 * like the original template - "Sign In" always works, even with empty fields, and lands on the admin dashboard
 * (type e.g. `teacher@example.com`, `student@example.com` or `parent@example.com` to see another role's dashboard).
 */

import { useRef } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { env } from '@config/env';
import { useAuth } from '@hooks/useAuth';
import { useForm } from '@hooks/useForm';
import type { UseFormResult } from '@hooks/useForm';
import { compose, email as emailRule, required } from '@utils/validation';
import type { ValidationSchema } from '@utils/validation';
import type { UserRole } from '@constants/app.constants';
import type { AuthUser } from '@services/auth/auth.types';
import { defaultDemoUser } from '@mocks/auth.mock';
import { roleHomeRoute } from '../roleHome';

export interface LoginFormValues extends Record<string, unknown> {
  email: string;
  password: string;
  rememberMe: boolean;
  /** "Sign in as" - empty string means "use my main role". */
  role: string;
}

// Only "is it filled in" is checked for the password: the server owns the real rules, and enforcing a
// length here would reject (with a misleading message) a perfectly valid existing password.
const loginValidationSchema: ValidationSchema<LoginFormValues> = {
  email: compose(required('Email is required'), emailRule()),
  password: required('Password is required'),
};

export interface UseLoginOptions {
  /** Overrides the default destination (the user's role dashboard). */
  redirectTo?: string;
  initialEmail?: string;
}

export interface UseLoginResult {
  form: UseFormResult<LoginFormValues, AuthUser>;
  /** True while the credentials are being checked. */
  isLoggingIn: boolean;
}

export function useLogin(options: UseLoginOptions = {}): UseLoginResult {
  const { redirectTo, initialEmail = '' } = options;
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoggingIn } = useAuth();
  const standalone = env.useMockApi;
  // The role picked in "Sign in as" for the attempt in flight (onSuccess only receives the user).
  const chosenRole = useRef('');

  const form = useForm<LoginFormValues, AuthUser>({
    initialValues: { email: initialEmail, password: '', rememberMe: true, role: '' },
    // Standalone demo: nothing to validate against, so never block the click.
    validationSchema: standalone ? undefined : loginValidationSchema,
    // Against the real API, `login` rejects with an ApiError whose message is the server's ("Invalid email or
    // password", "You don't have access as teacher", ...); useForm exposes it as `submitError`.
    onSubmit: (values) => {
      console.log('LOGIN-DEBUG submit', { roleInForm: values.role });
      chosenRole.current = values.role;
      return login({
        email: values.email.trim() || (standalone ? defaultDemoUser.email : ''),
        password: values.password || (standalone ? 'demo' : ''),
        ...(values.role ? { role: values.role as UserRole } : {}),
      });
    },
    onSuccess: (user) => {
      const from = (location.state as { from?: string } | null)?.from;
      const picked = chosenRole.current ? roleHomeRoute(chosenRole.current as UserRole) : undefined;
      console.log('LOGIN-DEBUG success', { chosen: chosenRole.current, serverRole: user.role, picked, from });
      navigate(redirectTo ?? picked ?? from ?? roleHomeRoute(user.role), { replace: true });
    },
  });

  return { form, isLoggingIn };
}