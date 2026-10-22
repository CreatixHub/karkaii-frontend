import type { BulkAction } from '../data/studentPromotion.data';

export interface PromotionBulkBarProps {
  count: number;
  actions: BulkAction[];
  onAction: (action: string) => void;
  onClear: () => void;
}

const PromotionBulkBar = ({ count, actions, onAction, onClear }: PromotionBulkBarProps) => (
  <div className={`bulk-bar-promotion${count > 0 ? ' show' : ''}`} id="pwBulkbar">
    <span className="bulk-bar-count-promotion">
      <b id="pwBulkCount">{count}</b>students selected
    </span>
    <div className="bulk-bar-actions-promotion">
      {actions.map((action) => (
        <button
          type="button"
          className={`block-button${action.variant !== 'default' ? ` ${action.variant}` : ''}`}
          key={action.id}
          onClick={() => onAction(action.action)}
        >
          <i className={action.icon} />
          {action.label}
        </button>
      ))}
      <span className="x" title="Clear" onClick={onClear}>
        <i className="ti ti-x" />
      </span>
    </div>
  </div>
);

export default PromotionBulkBar;
