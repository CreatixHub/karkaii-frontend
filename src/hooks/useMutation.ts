/**
 * Generic write hook — the counterpart to `useQuery` for create/update/delete.
 *
 * `mutate` returns a discriminated result rather than throwing, so callers can
 * branch on success without a try/catch. The thrown error is still normalized
 * to `ApiError` and exposed as state for rendering.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import type { ApiError } from '@services/api/errors';
import { toApiError } from '@services/api/errors';

export interface UseMutationOptions<TResult> {
  onSuccess?: (result: TResult) => void;
  onError?: (error: ApiError) => void;
  /** Runs after either outcome — useful for closing a modal. */
  onSettled?: () => void;
}

export type MutationOutcome<TResult> =
  | { ok: true; data: TResult }
  | { ok: false; error: ApiError };

export interface UseMutationResult<TArgs extends unknown[], TResult> {
  mutate: (...args: TArgs) => Promise<MutationOutcome<TResult>>;
  data: TResult | null;
  error: ApiError | null;
  loading: boolean;
  /** True once a mutation has completed successfully. */
  isSuccess: boolean;
  reset: () => void;
}

export function useMutation<TArgs extends unknown[], TResult>(
  mutator: (...args: TArgs) => Promise<TResult>,
  options: UseMutationOptions<TResult> = {},
): UseMutationResult<TArgs, TResult> {
  const [data, setData] = useState<TResult | null>(null);
  const [error, setError] = useState<ApiError | null>(null);
  const [loading, setLoading] = useState(false);

  const mutatorRef = useRef(mutator);
  const optionsRef = useRef(options);
  mutatorRef.current = mutator;
  optionsRef.current = options;

  const mountedRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const mutate = useCallback(
    async (...args: TArgs): Promise<MutationOutcome<TResult>> => {
      setLoading(true);
      setError(null);

      try {
        const result = await mutatorRef.current(...args);
        if (mountedRef.current) {
          setData(result);
          setLoading(false);
        }
        optionsRef.current.onSuccess?.(result);
        optionsRef.current.onSettled?.();
        return { ok: true, data: result };
      } catch (raw: unknown) {
        const apiError = toApiError(raw);
        if (mountedRef.current) {
          setError(apiError);
          setLoading(false);
        }
        optionsRef.current.onError?.(apiError);
        optionsRef.current.onSettled?.();
        return { ok: false, error: apiError };
      }
    },
    [],
  );

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return { mutate, data, error, loading, isSuccess: data !== null, reset };
}
