import { emptyState } from '../data/departments.data';

export interface DepartmentsEmptyStateProps {
  /** Opens the Add Department modal, as `data-bs-target="#add_department"` did. */
  onCreate: () => void;
}

const DepartmentsEmptyState = ({ onCreate }: DepartmentsEmptyStateProps) => (
  <div className="card mb-0" id="dept_empty">
    <div className="card-body text-center py-5">
      <span className="avatar avatar-xxl bg-primary-transparent text-primary rounded-circle flex-shrink-0 mx-auto mb-3">
        <i className={`${emptyState.icon} display-6`} />
      </span>
      <h5 className="mb-1">{emptyState.title}</h5>
      <p className="text-muted mb-3">{emptyState.message}</p>
      <button
        type="button"
        className="btn btn-primary d-inline-flex align-items-center mx-auto"
        onClick={onCreate}
      >
        <i className={`${emptyState.actionIcon} me-1`} />
        {emptyState.actionLabel}
      </button>
    </div>
  </div>
);

export default DepartmentsEmptyState;
