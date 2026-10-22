import { parentInsights } from '../data/parentDashboard.data';
import PortalSection from './PortalSection';

export interface ParentInsightsProps {
  revealed: boolean;
}

const ParentInsights = ({ revealed }: ParentInsightsProps) => (
  <>
    <PortalSection icon="ti ti-sparkles" eyebrow="Predictive" title="Parent Insights">
      <span className="badge badge-tag accent-purple d-inline-flex align-items-center text-nowrap">
        <i className="ti ti-robot" />
        AI
      </span>
    </PortalSection>

    <div className="parent-insight-list">
      {parentInsights.map((insight) => (
        <div className={`parent-insight-row ${insight.accent}`} key={insight.id}>
          <div className="insight-row-top d-flex align-items-center">
            <span className="avatar avatar-icon avatar-32 avatar-r-9 avatar-glyph-16 avatar-accent-soft">
              <i className={insight.icon} />
            </span>
            <b>{insight.title}</b>
          </div>

          <div className="confidence-gauge d-flex align-items-center">
            <span className="confidence-gauge-bar overflow-hidden">
              <span style={{ width: revealed ? `${insight.gauge}%` : 0 }} />
            </span>
            <b>{insight.gauge}%</b>
          </div>

          <p>
            <b>{insight.body.lead}</b>
            {insight.body.rest}
          </p>

          <div className="insight-row-foot d-flex align-items-center justify-content-between">
            <span className="portal-sub">{insight.footNote}</span>
            <span className={`priority-flag ${insight.priority.className}`}>
              {insight.priority.label}
            </span>
          </div>
        </div>
      ))}
    </div>
  </>
);

export default ParentInsights;
