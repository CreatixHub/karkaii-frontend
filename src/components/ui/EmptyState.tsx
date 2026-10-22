import type { ReactNode } from 'react';

export interface EmptyStateProps {
  title?: string;
  description?: string;
  /** Tabler icon class, matching the icon set the template already loads. */
  icon?: string;
  /** Optional call to action, e.g. an "Add Student" button. */
  action?: ReactNode;
  className?: string;
}

const EmptyState = ({
  title = 'No records found',
  description = 'There is nothing to show here yet.',
  icon = 'ti ti-inbox',
  action,
  className = '',
}: EmptyStateProps) => (
  <div className={`text-center py-5 ${className}`}>
    <span
      className="avatar avatar-xl bg-light text-muted rounded-circle mb-3 d-inline-flex align-items-center justify-content-center"
      aria-hidden="true"
    >
      <i className={`${icon} fs-24`} />
    </span>
    <h5 className="mb-1">{title}</h5>
    {description ? <p className="text-muted mb-3">{description}</p> : null}
    {action}
  </div>
);

export default EmptyState;
