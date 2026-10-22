/**
 * Feature hook for a login form.
 *
 * Combines `useForm` (validation + submission) with `useAuth` (session), so the login page only needs to
 * bind inputs and render errors — it contains no authentication logic of its own.
 *
 * After a successful sign-in the user is sent back to where they were headed (`location.state.from`, set by
 * `ProtectedRoute`) or, failing that, to the dashboard for their role.
 *
 * Standalone prototype mode (`VITE_USE_MOCK_API=true`): there is no server to check credentials against, so —
 * like the original template — "Sign In" always works, even with empty fields, and lands on the admin dashboard
 * (type e.g. `teacher@example.com`, `student@example.com` or `parent@example.com` to see another role's dashboard).
 */

import { useLocation, useNavigate } from 'react-router';
import { env } from '@config/env';
import { useAuth } from '@hooks/useAuth';
import { useForm } from '@hooks/useForm';
import type { UseFormResult } from '@hooks/useForm';
import { compose, email as emailRule, required } from '@utils/validation';
import type { ValidationSchema } from '@utils/validation';
import type { AuthUser } from '@services/auth/auth.types';
import { defaultDemoUser } from '@mocks/auth.mock';
import { roleHomeRoute } from '../roleHome';

export interface LoginFormValues extends Record<string, unknown> {
  email: string;
  password: string;
  rememberMe: boolean;
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

  const form = useForm<LoginFormValues, AuthUser>({
    initialValues: { email: initialEmail, password: '', rememberMe: true },
    // Standalone demo: nothing to validate against, so never block the click.
    validationSchema: standalone ? undefined : loginValidationSchema,
    // Against the real API, `login` rejects with an ApiError whose message is the server's ("Invalid email or
    // password", "Account temporarily locked...", ...); useForm exposes it as `submitError`.
    onSubmit: (values) =>
      login({
        email: values.email.trim() || (standalone ? defaultDemoUser.email : ''),
        password: values.password || (standalone ? 'demo' : ''),
        rememberMe: values.rememberMe,
      }),
    onSuccess: (user) => {
      const from = (location.state as { from?: string } | null)?.from;
      navigate(redirectTo ?? from ?? roleHomeRoute(user.role), { replace: true });
    },
  });

  return { form, isLoggingIn };
}
