/**
 * Feature hook for a login form.
 *
 * Combines `useForm` (validation + submission) with `useAuth` (session), so a
 * rebuilt login page only needs to bind inputs and render errors — it contains
 * no authentication logic of its own.
 *
 * Usage in a rebuilt login page:
 *
 *   const { form } = useLogin({ redirectTo: routes.adminDashboard });
 *   <form onSubmit={form.handleSubmit}>
 *     <input name="email" value={form.values.email} onChange={form.handleChange} />
 *     {form.touched.email && form.errors.email && <span>{form.errors.email}</span>}
 *   </form>
 */

import { useNavigate } from 'react-router';
import { useAuth } from '@hooks/useAuth';
import { useForm } from '@hooks/useForm';
import type { UseFormResult } from '@hooks/useForm';
import { compose, email as emailRule, minLength, required } from '@utils/validation';
import type { ValidationSchema } from '@utils/validation';

export interface LoginFormValues extends Record<string, unknown> {
  email: string;
  password: string;
  rememberMe: boolean;
}

const loginValidationSchema: ValidationSchema<LoginFormValues> = {
  email: compose(required('Email is required'), emailRule()),
  password: compose(
    required('Password is required'),
    minLength(6, 'Password must be at least 6 characters'),
  ),
};

export interface UseLoginOptions {
  /** Route to navigate to after a successful sign-in. */
  redirectTo: string;
  initialEmail?: string;
}

export interface UseLoginResult {
  form: UseFormResult<LoginFormValues, boolean>;
  /** True while the credentials are being checked. */
  isLoggingIn: boolean;
}

export function useLogin(options: UseLoginOptions): UseLoginResult {
  const { redirectTo, initialEmail = '' } = options;
  const navigate = useNavigate();
  const { login, isLoggingIn } = useAuth();

  const form = useForm<LoginFormValues, boolean>({
    initialValues: { email: initialEmail, password: '', rememberMe: true },
    validationSchema: loginValidationSchema,
    onSubmit: async (values) => {
      const succeeded = await login({
        email: values.email,
        password: values.password,
        rememberMe: values.rememberMe,
      });

      // `login` reports failure by returning false; surface it as a thrown
      // error so `useForm` renders it like any other submission failure.
      if (!succeeded) {
        throw new Error('Invalid email or password.');
      }
      return true;
    },
    onSuccess: () => {
      navigate(redirectTo, { replace: true });
    },
  });

  return { form, isLoggingIn };
}
