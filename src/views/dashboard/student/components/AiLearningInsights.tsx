import WidgetHeader from '../../shared/WidgetHeader';
import type { StudentModalId } from '../data/studentDashboard.data';
import { aiInsights } from '../data/studentDashboard.data';

export interface AiLearningInsightsProps {
  onOpenModal: (modal: StudentModalId) => void;
}

const AiLearningInsights = ({ onOpenModal }: AiLearningInsightsProps) => (
  <div className="card-widget card-widget-body insight-panel h-100 flow-list d-flex flex-column">
    <WidgetHeader
      icon="ti ti-sparkles"
      title="AI Learning Insights"
      as="h5"
      titleClassName="fs-15"
    >
      <span className="badge badge-sm badge-soft-purple d-inline-flex align-items-center gap-1 rounded-pill">
        <i className="ti ti-robot fs-14" />
        Preskool AI
      </span>
    </WidgetHeader>

    <div className="insight-score d-flex align-items-center flex-wrap">
      <div
        className="progress-ring progress-ring-sm text-purple flex-shrink-0"
        style={{ '--v': 91 } as React.CSSProperties}
      >
        <div className="progress-ring-hole text-center">
          <b>91</b>
          <span>Score</span>
        </div>
      </div>
      <div className="tx">
        <b>Learning Score: Excellent</b>
        <p>You&apos;re improving steadily. Focus on English to reach the top 5% this term.</p>
      </div>
    </div>

    <div>
      {aiInsights.map((insight) => (
        <div className="insight-item d-flex align-items-start" key={insight.id}>
          <span className={`avatar avatar-md avatar-icon ${insight.iconClass} flex-shrink-0`}>
            <i className={insight.icon} />
          </span>
          <div className="tx">
            <b>{insight.title}</b>
            <span>{insight.description}</span>
          </div>
        </div>
      ))}
    </div>

    <button
      type="button"
      className="action-button action-button-sm w-100 mt-2 flow-end d-inline-flex align-items-center justify-content-center text-nowrap text-decoration-none"
      onClick={() => onOpenModal('results')}
    >
      <i className="ti ti-report-analytics" />
      View Learning Report
    </button>
  </div>
);

export default AiLearningInsights;
