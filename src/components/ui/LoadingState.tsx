export interface LoadingStateProps {
  /** Message shown under the spinner. */
  message?: string;
  /** Vertical padding preset. */
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const PADDING: Record<NonNullable<LoadingStateProps['size']>, string> = {
  sm: 'py-3',
  md: 'py-5',
  lg: 'py-5 my-5',
};

const LoadingState = ({
  message = 'Loading...',
  size = 'md',
  className = '',
}: LoadingStateProps) => (
  <div
    className={`d-flex flex-column align-items-center justify-content-center text-center ${PADDING[size]} ${className}`}
    role="status"
    aria-live="polite"
  >
    <div className="spinner-border text-primary" aria-hidden="true">
      <span className="visually-hidden">Loading</span>
    </div>
    {message ? <p className="text-muted mb-0 mt-3">{message}</p> : null}
  </div>
);

export default LoadingState;
