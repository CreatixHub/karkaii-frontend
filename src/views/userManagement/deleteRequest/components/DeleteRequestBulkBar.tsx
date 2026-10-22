import type { BulkAction } from '../data/deleteRequest.data';
import { bulkActions } from '../data/deleteRequest.data';

export interface DeleteRequestBulkBarProps {
  count: number;
  onAction: (action: BulkAction) => void;
  onClear: () => void;
}

const DeleteRequestBulkBar = ({ count, onAction, onClear }: DeleteRequestBulkBarProps) => (
  <div className="bulk-selection" id="darBulk" role="region" aria-label="Bulk actions">
    <div className="bulk-selection-inner">
      <span className="bulk-selection-count">
        <b id="darCount">{count}</b> selected
      </span>
      <div className="d-flex flex-wrap gap-2">
        {bulkActions.map((action) => (
          <button
            key={action.id}
            type="button"
            className={`btn btn-sm${action.danger ? ' text-danger' : ''}`}
            onClick={() => onAction(action)}
          >
            <i className={`${action.icon} me-1`} />
            {action.label}
          </button>
        ))}
      </div>
      <button type="button" className="bulk-selection-close" aria-label="Clear selection" onClick={onClear}>
        <i className="ti ti-x" />
      </button>
    </div>
  </div>
);

export default DeleteRequestBulkBar;
