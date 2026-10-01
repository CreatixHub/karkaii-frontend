import { Link } from 'react-router-dom';
import ImageWithBasePath from '@core/common/imageWithBasePath';
import { activityFeed, insights } from '../data/classRoutine.data';

export interface InsightsPanelProps {
  onAction: (id: string) => void;
}

const InsightsPanel = ({ onAction }: InsightsPanelProps) => (
  <div className="row">
    <div className="col-12 col-xl-7 d-flex">
      <div className="card flex-fill">
        <div className="card-header d-flex align-items-center justify-content-between">
          <h5 className="mb-0 d-flex align-items-center gap-2">
            <i className="ti ti-sparkles text-primary" />
            AI Schedule Insights
          </h5>
          <span className="badge badge-soft-primary">Beta</span>
        </div>
        <div className="card-body py-2">
          {insights.map((insight) => (
            <div className="rt-insight" key={insight.id}>
              <span className={`rt-insight-ic ${insight.iconClass}`}>
                <i className={insight.icon} />
              </span>
              <div className="flex-fill">
                <h6 className="mb-1 fs-13">{insight.title}</h6>
                {insight.body ? (
                  <p className={`fs-12 text-muted ${insight.meterClass ? 'mb-1' : 'mb-0'}`}>{insight.body}</p>
                ) : null}
                {insight.meterClass ? (
                  <div className={`meter ${insight.meterClass}`}>
                    <span style={{ width: insight.meterWidth }} />
                  </div>
                ) : null}
                {insight.chips ? (
                  <div className="d-flex flex-wrap gap-1 mt-1">
                    {insight.chips.map((chip) => (
                      <span className={`chip chip-soft ${chip.chipClass}`} key={chip.label}>
                        {chip.label}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>
              {insight.badge ? (
                <span className={`badge ${insight.badgeClass} flex-shrink-0`}>{insight.badge}</span>
              ) : null}
              {insight.action ? (
                <Link
                  to="#"
                  className="btn btn-primary btn-sm flex-shrink-0"
                  onClick={() => onAction(insight.action!.id)}
                >
                  {insight.action.label}
                </Link>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </div>

    <div className="col-12 col-xl-5 d-flex">
      <div className="card flex-fill">
        <div className="card-header d-flex align-items-center justify-content-between">
          <h5 className="mb-0 d-flex align-items-center gap-2">
            <i className="ti ti-history text-primary" />
            Recent Activities
          </h5>
          <Link to="#" className="link-primary fs-13">
            View all
          </Link>
        </div>
        <div className="card-body">
          <ul className="activity-feed activity-feed-roomy mb-0">
            {activityFeed.map((entry) =>
              entry.divider ? (
                <li className="activity-feed-divider" key={entry.id}>
                  <span>{entry.divider}</span>
                </li>
              ) : (
                <li key={entry.id}>
                  <span className={`avatar avatar-icon avatar-md ${entry.iconClass}`}>
                    <i className={entry.icon} />
                  </span>
                  <div className="d-flex align-items-start justify-content-between">
                    <div className={entry.avatar ? 'd-flex align-items-center' : undefined}>
                      {entry.avatar ? (
                        <Link to="#" className="avatar avatar-sm me-2 flex-shrink-0">
                          <ImageWithBasePath
                            src={entry.avatar}
                            className="rounded-circle flex-shrink-0"
                            alt="img"
                          />
                        </Link>
                      ) : null}
                      <div>
                        <h6 className="mb-1">
                          {entry.before}
                          <span className="fw-semibold">{entry.strong}</span>
                          {entry.after}
                        </h6>
                        <span className="chip chip-soft chip-muted">
                          <i className="ti ti-clock" />
                          {entry.time}
                        </span>
                      </div>
                    </div>
                    <span className={`badge ${entry.badgeClass} flex-shrink-0`}>{entry.badge}</span>
                  </div>
                </li>
              ),
            )}
          </ul>
        </div>
      </div>
    </div>
  </div>
);

export default InsightsPanel;
