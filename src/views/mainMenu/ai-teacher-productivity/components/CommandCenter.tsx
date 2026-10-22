import { engagementWave, stageActions, stageStats } from '../data/productivity.data';
import type { StageAction } from '../data/productivity.data';

export interface CommandCenterProps {
  onAction: (target: StageAction['target']) => void;
}

const CommandCenter = ({ onAction }: CommandCenterProps) => (
  <div className="tch-stage mb-5">
    <div className="tch-stage-inner">
      <div>
        <span className="tch-stage-badge">
          <i className="ti ti-sparkles" />
          Teaching Intelligence Engine
        </span>

        <h1 className="tch-stage-title">
          Engagement is the strongest it has been all year.{' '}
          <em>Four teachers are carrying it alone.</em>
        </h1>
        <p className="fs-14 text-muted lh-base mb-0">
          The engine reviewed 42 teaching timetables, 1,840 lesson records and 96 classroom
          observations, then wrote the reasoning behind every finding. It coaches; it does not
          appraise. Nothing here reaches a personnel file.
        </p>

        <div className="tch-stage-strip">
          {stageStats.map((stat) => (
            <span className="tch-stat" key={stat.label}>
              <span className="tch-lbl">{stat.label}</span>
              <b>
                {stat.value}
                <small>{stat.suffix}</small>
              </b>
            </span>
          ))}
        </div>

        <div className="d-flex flex-wrap gap-2 mt-4">
          {stageActions.map((action) => (
            <button
              type="button"
              className={action.className}
              key={action.target + action.label}
              onClick={() => onAction(action.target)}
            >
              <i className={`${action.icon} me-1`} />
              {action.label}
            </button>
          ))}
        </div>
      </div>

      <div className="tch-panel">
        <div className="d-flex align-items-center justify-content-between gap-2">
          <span className="tch-lbl">Classroom engagement · 24 weeks</span>
          <span className="tch-pill is-high">
            <i className="ti ti-trending-up" />
            +9 pts
          </span>
        </div>

        <div className="tch-wave">
          {engagementWave.map((point, index) => (
            <i className={`${point.tone ? `${point.tone} ` : ''}aix-p-${point.p}`} key={index} />
          ))}
        </div>
        <div className="tch-wave-axis">
          <span>Wk 04</span>
          <span>Wk 16</span>
          <span>Wk 27</span>
        </div>

        {/* The peak and dip counts are the engine's own, not a count of the bars. */}
        <div className="d-flex flex-wrap gap-2">
          <span className="tch-pill is-high">
            <i className="ti ti-arrow-up" />4 peaks
          </span>
          <span className="tch-pill is-mid">
            <i className="ti ti-arrow-down" />5 dips
          </span>
          <span className="tch-pill is-ai">
            <i className="ti ti-sparkles" />
            93% confidence
          </span>
        </div>

        <p className="fs-12 text-muted mb-0">
          Every dip falls in the week after a public holiday. The pattern is calendar-driven and
          recovers without intervention.
        </p>
      </div>
    </div>
  </div>
);

export default CommandCenter;
