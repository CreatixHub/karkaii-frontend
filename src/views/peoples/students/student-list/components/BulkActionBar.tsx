import type { BulkAction } from '../data/studentsList.data';
import { bulkActions } from '../data/studentsList.data';

export interface BulkActionBarProps {
  count: number;
  onAction: (action: BulkAction) => void;
  onClear: () => void;
}

const BulkActionBar = ({ count, onAction, onClear }: BulkActionBarProps) => {
  if (count === 0) return null;

  return (
    <div className="bulk-selection" id="clsBulk" role="region" aria-label="Bulk actions">
      <div className="bulk-selection-inner">
        <span className="bulk-selection-count">
          <b id="clsCount">{count}</b> selected
        </span>
        <div className="d-flex flex-wrap gap-2">
          {bulkActions.map((action) => (
            <button
              key={action.label}
              type="button"
              className={`btn btn-sm${action.danger ? ' text-danger' : ''}`}
              onClick={() => onAction(action)}
            >
              <i className={`${action.icon} me-1`} />
              {action.label}
            </button>
          ))}
        </div>
        <button
          type="button"
          className="bulk-selection-close"
          aria-label="Clear selection"
          onClick={onClear}
        >
          <i className="ti ti-x" />
        </button>
      </div>
    </div>
  );
};

export default BulkActionBar;
