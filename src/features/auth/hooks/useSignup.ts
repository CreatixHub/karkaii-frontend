/**
 * Feature hook for the registration form.
 *
 * Combines `useForm` (validation + submission) with `useAuth` (session), so the register page only needs to
 * bind inputs and render errors. On success the person's account AND their school already exist
 * (`AuthProvider.signup` performs the whole chain). That call also signs the new owner in, so this hook
 * signs them out again and sends them to the login page, with `state.registered` set so the login page can
 * show a "Registered successfully" message.
 *
 * Standalone prototype mode (`VITE_USE_MOCK_API=true`): there is no server, so sign-up never fails validation
 * beyond basic shape checks.
 */

import { useNavigate } from 'react-router';
import { useAuth } from '@hooks/useAuth';
import { useForm } from '@hooks/useForm';
import type { UseFormResult } from '@hooks/useForm';
import { compose, email as emailRule, matches, minLength, required } from '@utils/validation';
import type { ValidationSchema } from '@utils/validation';
import type { AuthUser } from '@services/auth/auth.types';
import { all_routes } from '@/routes/all_routes';

export interface SignupFormValues extends Record<string, unknown> {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  schoolName: string;
  agreeToTerms: boolean;
}

const signupValidationSchema: ValidationSchema<SignupFormValues> = {
  fullName: compose(required('Name is required'), minLength(2, 'Name must be at least 2 characters')),
  email: compose(required('Email is required'), emailRule()),
  // The server enforces 10-128; this just saves a round trip for the obvious case.
  password: compose(required('Password is required'), minLength(10, 'Password must be at least 10 characters')),
  confirmPassword: compose(required('Please confirm your password'), matches('password', 'Passwords do not match')),
  schoolName: compose(required('School name is required'), minLength(2, 'School name must be at least 2 characters')),
  agreeToTerms: required('You must agree to the terms to continue'),
};

export interface UseSignupResult {
  form: UseFormResult<SignupFormValues, AuthUser>;
  isSigningUp: boolean;
}

export function useSignup(): UseSignupResult {
  const navigate = useNavigate();
  const { signup, logout, isSigningUp } = useAuth();

  const form = useForm<SignupFormValues, AuthUser>({
    initialValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      schoolName: '',
      agreeToTerms: false,
    },
    validationSchema: signupValidationSchema,
    onSubmit: (values) =>
      signup({
        fullName: values.fullName,
        email: values.email,
        password: values.password,
        schoolName: values.schoolName,
      }),
    // The new owner is signed in by `signup`; clear that session and send them to the login page,
    // which shows a "Registered successfully" message when it sees `state.registered`.
    onSuccess: () => {
      void Promise.resolve(logout()).finally(() =>
        navigate(all_routes.login, { replace: true, state: { registered: true } }),
      );
    },
  });

  return { form, isSigningUp };
}