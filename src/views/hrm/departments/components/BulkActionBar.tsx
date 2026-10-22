import type { BulkAction } from '../data/departments.data';
import { bulkActions } from '../data/departments.data';

export interface BulkActionBarProps {
  count: number;
  onAction: (action: BulkAction) => void;
}

const BulkActionBar = ({ count, onAction }: BulkActionBarProps) => {
  if (count === 0) return null;

  return (
    <div id="dept_bulk" className="d-flex align-items-center justify-content-between bg-light rounded p-2 mb-3">
      <span>
        <span className="fw-semibold dept-selected-count">{count}</span> selected
      </span>
      <div className="d-flex gap-2 flex-wrap">
        {bulkActions.map((action) => (
          <button
            key={action.id}
            type="button"
            className={action.danger ? 'btn btn-sm btn-outline-danger' : 'btn btn-sm btn-outline-light bg-white'}
            onClick={() => onAction(action)}
          >
            <i className={`${action.icon} me-1`} />
            {action.barLabel ?? action.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default BulkActionBar;
