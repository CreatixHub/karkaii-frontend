/**
 * Generic asynchronous read hook.
 *
 * This is the single place the application manages loading/data/error state
 * for reads. A page calls a feature hook, the feature hook calls this, and this
 * calls a service — so swapping mock data for a real API changes nothing here
 * or above.
 *
 * Correctness details that matter:
 *  - The fetcher is held in a ref and the effect keys on `deps` only, so an
 *    inline arrow function does not cause an infinite refetch loop.
 *  - Every run carries an incrementing request id and its own AbortController,
 *    so React 19 StrictMode's double-invoked effects and out-of-order responses
 *    can never write stale data.
 *  - Cancellations are swallowed rather than surfaced as errors.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import type { ApiError } from '@services/api/errors';
import { toApiError } from '@services/api/errors';
import type { QueryResult, RequestStatus } from '@/types/common.types';

export interface UseQueryOptions<T> {
  /** When false the fetch is skipped and the hook stays idle. */
  enabled?: boolean;
  /** Seed value rendered before the first fetch resolves. */
  initialData?: T;
  /** Keep the previous data on screen while a refetch runs. */
  keepPreviousData?: boolean;
  onSuccess?: (data: T) => void;
  onError?: (error: ApiError) => void;
}

interface QueryState<T> {
  data: T | null;
  error: ApiError | null;
  status: RequestStatus;
  isRefetching: boolean;
}

export function useQuery<T>(
  fetcher: (signal: AbortSignal) => Promise<T>,
  deps: unknown[] = [],
  options: UseQueryOptions<T> = {},
): QueryResult<T> {
  const {
    enabled = true,
    initialData,
    keepPreviousData = false,
    onSuccess,
    onError,
  } = options;

  const [state, setState] = useState<QueryState<T>>({
    data: initialData ?? null,
    error: null,
    status: enabled ? 'loading' : 'idle',
    isRefetching: false,
  });

  // Latest-value refs: these change every render but must not retrigger the
  // effect, so they are read through refs rather than listed as dependencies.
  const fetcherRef = useRef(fetcher);
  const onSuccessRef = useRef(onSuccess);
  const onErrorRef = useRef(onError);
  fetcherRef.current = fetcher;
  onSuccessRef.current = onSuccess;
  onErrorRef.current = onError;

  const requestIdRef = useRef(0);
  const mountedRef = useRef(true);
  // Bumped by refetch() to re-run the effect without changing `deps`.
  const [refetchToken, setRefetchToken] = useState(0);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (!enabled) {
      setState((prev) => ({ ...prev, status: 'idle', isRefetching: false }));
      return;
    }

    const requestId = ++requestIdRef.current;
    const controller = new AbortController();

    setState((prev) => ({
      data: keepPreviousData ? prev.data : null,
      error: null,
      status: 'loading',
      isRefetching: prev.status === 'success',
    }));

    fetcherRef
      .current(controller.signal)
      .then((result) => {
        // Ignore responses from superseded or aborted requests.
        if (!mountedRef.current || requestId !== requestIdRef.current) return;
        setState({
          data: result,
          error: null,
          status: 'success',
          isRefetching: false,
        });
        onSuccessRef.current?.(result);
      })
      .catch((raw: unknown) => {
        if (!mountedRef.current || requestId !== requestIdRef.current) return;
        const error = toApiError(raw);
        // An aborted request is an expected lifecycle event, not a failure.
        if (error.isCancelled || controller.signal.aborted) return;
        setState((prev) => ({
          data: keepPreviousData ? prev.data : null,
          error,
          status: 'error',
          isRefetching: false,
        }));
        onErrorRef.current?.(error);
      });

    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, keepPreviousData, refetchToken, ...deps]);

  const refetch = useCallback(() => {
    setRefetchToken((token) => token + 1);
  }, []);

  return {
    data: state.data,
    error: state.error,
    status: state.status,
    loading: state.status === 'loading',
    isRefetching: state.isRefetching,
    refetch,
  };
}
