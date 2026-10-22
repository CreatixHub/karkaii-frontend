/**
 * Dependency-free form validation.
 *
 * A validator returns an error message, or `null` when the value is valid.
 * Rules compose, and a schema is a plain object mapping field name to rule —
 * so no validation library is needed and rules are trivially unit-testable.
 */

export type Validator<TValues = Record<string, unknown>> = (
  value: unknown,
  values: TValues,
) => string | null;

export type ValidationSchema<TValues> = Partial<
  Record<keyof TValues, Validator<TValues>>
>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Permissive on formatting, strict on digit count.
const PHONE_PATTERN = /^[+]?[\d\s()-]{7,20}$/;

function isEmpty(value: unknown): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim() === '';
  if (Array.isArray(value)) return value.length === 0;
  return false;
}

export function required<T>(message = 'This field is required'): Validator<T> {
  return (value) => (isEmpty(value) ? message : null);
}

export function email<T>(message = 'Enter a valid email address'): Validator<T> {
  return (value) => {
    if (isEmpty(value)) return null;
    return EMAIL_PATTERN.test(String(value)) ? null : message;
  };
}

export function phone<T>(message = 'Enter a valid phone number'): Validator<T> {
  return (value) => {
    if (isEmpty(value)) return null;
    return PHONE_PATTERN.test(String(value)) ? null : message;
  };
}

export function minLength<T>(length: number, message?: string): Validator<T> {
  return (value) => {
    if (isEmpty(value)) return null;
    return String(value).length >= length
      ? null
      : (message ?? `Must be at least ${length} characters`);
  };
}

export function maxLength<T>(length: number, message?: string): Validator<T> {
  return (value) => {
    if (isEmpty(value)) return null;
    return String(value).length <= length
      ? null
      : (message ?? `Must be no more than ${length} characters`);
  };
}

export function pattern<T>(regex: RegExp, message: string): Validator<T> {
  return (value) => {
    if (isEmpty(value)) return null;
    return regex.test(String(value)) ? null : message;
  };
}

export function numeric<T>(message = 'Enter a valid number'): Validator<T> {
  return (value) => {
    if (isEmpty(value)) return null;
    return Number.isFinite(Number(value)) ? null : message;
  };
}

export function min<T>(limit: number, message?: string): Validator<T> {
  return (value) => {
    if (isEmpty(value)) return null;
    return Number(value) >= limit ? null : (message ?? `Must be at least ${limit}`);
  };
}

export function max<T>(limit: number, message?: string): Validator<T> {
  return (value) => {
    if (isEmpty(value)) return null;
    return Number(value) <= limit ? null : (message ?? `Must be at most ${limit}`);
  };
}

/** Cross-field rule, e.g. confirm-password must equal password. */
export function matches<T>(field: keyof T, message: string): Validator<T> {
  return (value, values) =>
    value === (values as Record<string, unknown>)[field as string]
      ? null
      : message;
}

/** Runs rules left to right and returns the first failure. */
export function compose<T>(...validators: Validator<T>[]): Validator<T> {
  return (value, values) => {
    for (const validate of validators) {
      const error = validate(value, values);
      if (error) return error;
    }
    return null;
  };
}

/** Validates a whole value object, returning a field -> message map. */
export function validateValues<TValues extends Record<string, unknown>>(
  values: TValues,
  schema: ValidationSchema<TValues>,
): Partial<Record<keyof TValues, string>> {
  const errors: Partial<Record<keyof TValues, string>> = {};

  for (const key of Object.keys(schema) as (keyof TValues)[]) {
    const validate = schema[key];
    if (!validate) continue;
    const error = validate(values[key], values);
    if (error) errors[key] = error;
  }

  return errors;
}
