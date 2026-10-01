import type { ReactNode } from 'react';
import type { ApiError } from '@services/api/errors';
import EmptyState from './EmptyState';
import ErrorState from './ErrorState';
import LoadingState from './LoadingState';

export interface QueryStateProps<T> {
  data: T | null;
  loading: boolean;
  error: ApiError | null;
  /** Wired to the query's `refetch`. */
  onRetry?: () => void;
  children: (data: T) => ReactNode;

  /** Replaces the default spinner (e.g. with a `TableSkeleton`). */
  loadingFallback?: ReactNode;
  /** Replaces the default empty state. */
  emptyFallback?: ReactNode;
  emptyTitle?: string;
  emptyDescription?: string;
  /** Custom emptiness test. Defaults to "null, or an empty array". */
  isEmpty?: (data: T) => boolean;
  /**
   * Keep showing existing data during a refetch instead of flashing the
   * spinner. Pair with `useQuery`'s `keepPreviousData`.
   */
  showLoadingOverData?: boolean;
}

function defaultIsEmpty<T>(data: T): boolean {
  if (data === null || data === undefined) return true;
  if (Array.isArray(data)) return data.length === 0;
  return false;
}

function QueryState<T>({
  data,
  loading,
  error,
  onRetry,
  children,
  loadingFallback,
  emptyFallback,
  emptyTitle,
  emptyDescription,
  isEmpty = defaultIsEmpty,
  showLoadingOverData = false,
}: QueryStateProps<T>) {
  if (loading && (data === null || !showLoadingOverData)) {
    return <>{loadingFallback ?? <LoadingState />}</>;
  }

  // An error only takes over the view when there is nothing to show;
  // otherwise stale-but-useful data stays on screen.
  if (error && data === null) {
    return <ErrorState error={error} onRetry={onRetry} />;
  }

  if (data === null || isEmpty(data)) {
    return (
      <>
        {emptyFallback ?? (
          <EmptyState title={emptyTitle} description={emptyDescription} />
        )}
      </>
    );
  }

  return <>{children(data)}</>;
}

export default QueryState;
