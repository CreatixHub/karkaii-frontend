/**
 * Dependency-free form state, validation and submission.
 *
 * Implements the full API-ready form flow:
 *   values -> validate -> submit -> service -> success / error -> refresh UI
 *
 * Server-side validation is first-class: a 422 `ApiError` carrying
 * `fieldErrors` is mapped straight back onto the matching inputs, so the same
 * form works against mock and real backends without change.
 */

import { useCallback, useMemo, useRef, useState } from 'react';
import type { ApiError } from '@services/api/errors';
import { toApiError } from '@services/api/errors';
import type { ValidationSchema } from '@utils/validation';
import { validateValues } from '@utils/validation';

type FormErrors<TValues> = Partial<Record<keyof TValues, string>>;
type FormTouched<TValues> = Partial<Record<keyof TValues, boolean>>;

/** Any input-like element `handleChange` can read. */
type ChangeableElement = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;

export interface UseFormOptions<TValues extends Record<string, unknown>, TResult> {
  initialValues: TValues;
  validationSchema?: ValidationSchema<TValues>;
  /** The service call. Throwing an `ApiError` surfaces it as form state. */
  onSubmit: (values: TValues) => Promise<TResult>;
  onSuccess?: (result: TResult, values: TValues) => void;
  onError?: (error: ApiError) => void;
  /** Clear the fields after a successful submit. */
  resetOnSuccess?: boolean;
}

export interface UseFormResult<TValues extends Record<string, unknown>, TResult> {
  values: TValues;
  errors: FormErrors<TValues>;
  touched: FormTouched<TValues>;
  /** Non-field error (network failure, 500, ...) safe to display. */
  submitError: ApiError | null;
  isSubmitting: boolean;
  isSubmitted: boolean;
  isValid: boolean;
  isDirty: boolean;
  handleChange: (event: React.ChangeEvent<ChangeableElement>) => void;
  handleBlur: (event: React.FocusEvent<ChangeableElement>) => void;
  handleSubmit: (event?: React.FormEvent) => Promise<TResult | undefined>;
  setFieldValue: (field: keyof TValues, value: unknown) => void;
  setFieldError: (field: keyof TValues, message: string) => void;
  setValues: (values: TValues) => void;
  reset: (nextValues?: TValues) => void;
}

export function useForm<TValues extends Record<string, unknown>, TResult = void>(
  options: UseFormOptions<TValues, TResult>,
): UseFormResult<TValues, TResult> {
  const {
    initialValues,
    validationSchema,
    onSubmit,
    onSuccess,
    onError,
    resetOnSuccess = false,
  } = options;

  const [values, setValuesState] = useState<TValues>(initialValues);
  const [errors, setErrors] = useState<FormErrors<TValues>>({});
  const [touched, setTouched] = useState<FormTouched<TValues>>({});
  const [submitError, setSubmitError] = useState<ApiError | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const initialValuesRef = useRef(initialValues);
  const optionsRef = useRef({ onSubmit, onSuccess, onError, validationSchema });
  optionsRef.current = { onSubmit, onSuccess, onError, validationSchema };

  const isDirty = useMemo(
    () => JSON.stringify(values) !== JSON.stringify(initialValuesRef.current),
    [values],
  );

  const isValid = useMemo(() => {
    if (!validationSchema) return true;
    return Object.keys(validateValues(values, validationSchema)).length === 0;
  }, [values, validationSchema]);

  const setFieldValue = useCallback((field: keyof TValues, value: unknown) => {
    setValuesState((current) => ({ ...current, [field]: value }));
    // Clear the field's error as soon as the user edits it.
    setErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
  }, []);

  const setFieldError = useCallback((field: keyof TValues, message: string) => {
    setErrors((current) => ({ ...current, [field]: message }));
  }, []);

  const handleChange = useCallback(
    (event: React.ChangeEvent<ChangeableElement>) => {
      const target = event.target;
      const name = target.name as keyof TValues;
      if (!name) return;

      const value =
        target instanceof HTMLInputElement && target.type === 'checkbox'
          ? target.checked
          : target.value;

      setFieldValue(name, value);
    },
    [setFieldValue],
  );

  const handleBlur = useCallback(
    (event: React.FocusEvent<ChangeableElement>) => {
      const name = event.target.name as keyof TValues;
      if (!name) return;

      setTouched((current) => ({ ...current, [name]: true }));

      // Validate just this field so feedback appears as the user moves on.
      const schema = optionsRef.current.validationSchema;
      const validate = schema?.[name];
      if (!validate) return;

      setValuesState((currentValues) => {
        const message = validate(currentValues[name], currentValues);
        setErrors((current) => {
          const next = { ...current };
          if (message) next[name] = message;
          else delete next[name];
          return next;
        });
        return currentValues;
      });
    },
    [],
  );

  const reset = useCallback((nextValues?: TValues) => {
    const target = nextValues ?? initialValuesRef.current;
    initialValuesRef.current = target;
    setValuesState(target);
    setErrors({});
    setTouched({});
    setSubmitError(null);
    setIsSubmitting(false);
    setIsSubmitted(false);
  }, []);

  const handleSubmit = useCallback(
    async (event?: React.FormEvent): Promise<TResult | undefined> => {
      event?.preventDefault();
      setSubmitError(null);
      setIsSubmitted(true);

      const { validationSchema: schema, onSubmit: submit } = optionsRef.current;

      if (schema) {
        const validationErrors = validateValues(values, schema);
        if (Object.keys(validationErrors).length > 0) {
          setErrors(validationErrors);
          // Mark everything touched so all messages become visible at once.
          setTouched(
            Object.keys(values).reduce<FormTouched<TValues>>((acc, key) => {
              acc[key as keyof TValues] = true;
              return acc;
            }, {}),
          );
          return undefined;
        }
      }

      setIsSubmitting(true);
      try {
        const result = await submit(values);
        setIsSubmitting(false);
        optionsRef.current.onSuccess?.(result, values);
        if (resetOnSuccess) reset();
        return result;
      } catch (raw: unknown) {
        const apiError = toApiError(raw);
        setIsSubmitting(false);

        // Map server field errors back onto the inputs that caused them.
        if (apiError.fieldErrors) {
          setErrors(apiError.fieldErrors as FormErrors<TValues>);
        }
        // Only show the banner for errors that aren't purely field-level.
        if (!apiError.isValidationError || !apiError.fieldErrors) {
          setSubmitError(apiError);
        }

        optionsRef.current.onError?.(apiError);
        return undefined;
      }
    },
    [values, resetOnSuccess, reset],
  );

  const setValues = useCallback((next: TValues) => {
    setValuesState(next);
  }, []);

  return {
    values,
    errors,
    touched,
    submitError,
    isSubmitting,
    isSubmitted,
    isValid,
    isDirty,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
    setFieldError,
    setValues,
    reset,
  };
}
