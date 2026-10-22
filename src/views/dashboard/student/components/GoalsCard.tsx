import InfoListRow from '../../shared/InfoListRow';
import WidgetHeader from '../../shared/WidgetHeader';
import type { StudentModalId } from '../data/studentDashboard.data';
import { activeTargets, goals } from '../data/studentDashboard.data';

export interface GoalsCardProps {
  onOpenModal: (modal: StudentModalId) => void;
}

const GoalsCard = ({ onOpenModal }: GoalsCardProps) => (
  <div className="card-widget card-widget-body h-100">
    <WidgetHeader icon="ti ti-target" title="Goals &amp; Targets">
      <button
        type="button"
        className="action-button action-button-sm d-inline-flex align-items-center text-nowrap text-decoration-none"
        onClick={() => onOpenModal('goal')}
      >
        <i className="ti ti-plus" />
        Set Goal
      </button>
    </WidgetHeader>

    <div className="goal-grid">
      {goals.map((goal) => (
        <div className="goal-item" key={goal.id}>
          <div
            className={`progress-ring ${goal.ringClass}`}
            style={{ '--v': goal.ring } as React.CSSProperties}
          >
            <div className="progress-ring-hole">
              <b>{goal.value}</b>
              <span>{goal.unit}</span>
            </div>
          </div>
          <b>{goal.title}</b>
          <span>{goal.detail}</span>
        </div>
      ))}
    </div>

    <h6 className="widget-subtitle mb-2 mt-3">
      <i className="ti ti-flag me-1" />
      Active Targets
    </h6>
    <div className="info-list d-flex flex-column">
      {activeTargets.map((row) => (
        <InfoListRow row={row} key={row.id} />
      ))}
    </div>
  </div>
);

export default GoalsCard;
