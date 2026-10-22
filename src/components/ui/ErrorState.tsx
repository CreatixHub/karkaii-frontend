import { env } from '@config/env';
import type { ApiError } from '@services/api/errors';

export interface ErrorStateProps {
  error: ApiError | null;
  /** Wired to the caller's `refetch`. Hidden when omitted. */
  onRetry?: () => void;
  title?: string;
  className?: string;
}

const ErrorState = ({
  error,
  onRetry,
  title = 'Something went wrong',
  className = '',
}: ErrorStateProps) => {
  if (!error) return null;

  // Retrying a 403 or 404 will just fail again; only offer it when useful.
  const showRetry = Boolean(onRetry) && error.isRetryable;

  return (
    <div className={`text-center py-5 ${className}`} role="alert">
      <span
        className="avatar avatar-xl bg-danger-transparent text-danger rounded-circle mb-3 d-inline-flex align-items-center justify-content-center"
        aria-hidden="true"
      >
        <i className="ti ti-alert-triangle fs-24" />
      </span>
      <h5 className="mb-1">{title}</h5>
      <p className="text-muted mb-3">{error.message}</p>

      {showRetry ? (
        <button type="button" className="btn btn-primary" onClick={onRetry}>
          <i className="ti ti-refresh me-1" />
          Try Again
        </button>
      ) : null}

      {/* Diagnostics for developers only — never included in a production build. */}
      {env.isDevelopment && error.status > 0 ? (
        <p className="text-muted fs-12 mt-3 mb-0">
          Reference: {error.code} ({error.status})
        </p>
      ) : null}
    </div>
  );
};

export default ErrorState;
