import { actionTiles } from '../data/alumni.data';
import type { AlumniModalId } from '../data/alumni.data';

export interface ActionGridProps {
  onAction: (modal: AlumniModalId) => void;
}

const ActionGrid = ({ onAction }: ActionGridProps) => (
  <>
    <div className="section-header">
      <div>
        <h5 className="section-title">Community Actions</h5>
        <p className="section-subtitle">Everything the alumni office can start from here</p>
      </div>
      <span className="section-rule" />
    </div>

    <div className="row g-3 mb-2">
      {actionTiles.map((action) => (
        <div className="col-xxl-3 col-lg-4 col-md-6 d-flex" key={action.id}>
          <button type="button" className="action" onClick={() => onAction(action.modal)}>
            <span className="action-icon">
              <i className={action.icon} />
            </span>
            <i className="ti ti-arrow-right action-go" />
            <span className="action-title">{action.title}</span>
            <span className="action-desc">{action.desc}</span>
          </button>
        </div>
      ))}
    </div>
  </>
);

export default ActionGrid;
