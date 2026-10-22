import ImageWithBasePath from '@core/common/imageWithBasePath';
import { activityFeed } from '../data/adminDashboard.data';

const ActivityTimelineCard = () => (
  <div className="card flex-fill mb-4">
    <div className="card-header">
      <span className="stat-caption">Realtime</span>
      <h4 className="card-title mb-0">Activity Timeline</h4>
    </div>
    <div className="card-body d-flex flex-column">
      <ul className="activity-feed activity-feed-roomy mb-3">
        {activityFeed.map((item) => {
          if (item.kind === 'divider') {
            return (
              <li className="activity-feed-divider" key={item.id}>
                <span>{item.dividerLabel}</span>
              </li>
            );
          }

          const Heading = item.isLead ? 'h5' : 'h6';

          return (
            <li key={item.id}>
              <span className={`avatar avatar-icon avatar-md ${item.iconClass}`}>
                <i className={item.icon} />
              </span>
              <div className="d-flex align-items-start justify-content-between">
                <div className={item.avatar ? 'd-flex align-items-center' : undefined}>
                  {item.avatar ? (
                    <span className="avatar avatar-sm me-2 flex-shrink-0">
                      <ImageWithBasePath
                        src={item.avatar}
                        className="rounded-circle flex-shrink-0"
                        alt={item.highlight ?? 'Parent'}
                      />
                    </span>
                  ) : null}
                  <div>
                    <Heading className={`mb-1${item.isLead ? ' fs-15' : ''}`}>
                      {item.title}
                      {item.highlight ? (
                        <span className="fw-semibold">{item.highlight}</span>
                      ) : null}
                      {item.titleSuffix}
                    </Heading>
                    <div className="d-flex align-items-center gap-2">
                      <span className="badge bg-light text-dark d-inline-flex align-items-center gap-1 rounded-pill">
                        <i className="ti ti-clock" />
                        {item.time}
                      </span>
                      {item.priority ? (
                        <span className={`chip chip-square chip-soft ${item.priority.className}`}>
                          <i className="ti ti-flag-3-filled" />
                          {item.priority.label}
                        </span>
                      ) : null}
                    </div>
                  </div>
                </div>
                {item.badge ? (
                  <span className={`badge ${item.badge.className} flex-shrink-0`}>
                    {item.badge.label}
                  </span>
                ) : null}
              </div>
            </li>
          );
        })}
      </ul>

      <div className="mt-auto pt-3 border-top text-center">
        <button type="button" className="btn btn-link link-primary fw-medium fs-13 p-0">
          View All Activity <i className="ti ti-arrow-right ms-1" />
        </button>
      </div>
    </div>
  </div>
);

export default ActivityTimelineCard;
