import type { PerformanceModalId } from '../data/studentPerformance.data';
import { bulkActions } from '../data/studentPerformance.data';

export interface SelectionToolbarProps {
  count: number;
  onOpenModal: (modal: PerformanceModalId) => void;
  onAction: (label: string) => void;
}

const SelectionToolbar = ({ count, onOpenModal, onAction }: SelectionToolbarProps) => (
  <div className={`selection-toolbar ${count > 0 ? 'show' : ''}`}>
    <span className="selection-toolbar-count">
      <span className="selection-toolbar-badge">{count}</span>students selected
    </span>
    <div className="selection-toolbar-actions">
      {bulkActions.map((action) => (
        <button
          key={action.id}
          type="button"
          className="btn btn-sm btn-outline-light bg-white"
          onClick={() => (action.modal ? onOpenModal(action.modal) : onAction(action.label))}
        >
          <i className={`${action.icon} me-1`} />
          {action.label}
        </button>
      ))}
    </div>
  </div>
);

export default SelectionToolbar;
