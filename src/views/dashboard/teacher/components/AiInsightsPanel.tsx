import { aiInsights } from '../data/teacherDashboard.data';
import WidgetHeader from '../../shared/WidgetHeader';

const AiInsightsPanel = () => (
  <div className="card-widget card-widget-body insight-panel h-100">
    <WidgetHeader icon="ti ti-sparkles" title="AI Teaching Insights" as="h5" titleClassName="fs-15">
      <span className="insight-badge d-inline-flex align-items-center">
        <i className="ti ti-robot" />
        Preskool AI
      </span>
    </WidgetHeader>

    <div className="insight-score d-flex align-items-center">
      <div
        className="progress-ring text-purple"
        style={{ '--v': 92, width: 72, height: 72 } as React.CSSProperties}
      >
        <div
          className="progress-ring-hole text-center"
          style={{ width: 54, height: 54 }}
        >
          <b style={{ fontSize: 16 }}>92</b>
          <span>Score</span>
        </div>
      </div>
      <div className="tx">
        <b>Teaching Effectiveness: Excellent</b>
        <p>Class engagement up 8% this week. You&apos;re in the top 6% of the department.</p>
      </div>
    </div>

    <div>
      {aiInsights.map((insight) => (
        <div className="insight-item d-flex align-items-start" key={insight.id}>
          <span className={`avatar avatar-md flex-shrink-0 ${insight.iconClass}`}>
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
      className="action-button action-button-sm w-100 mt-2 d-inline-flex align-items-center justify-content-center text-nowrap text-decoration-none"
    >
      <i className="ti ti-report-analytics" />
      View Full AI Report
    </button>
  </div>
);

export default AiInsightsPanel;
