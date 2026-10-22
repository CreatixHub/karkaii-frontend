import ImageWithBasePath from '@core/common/imageWithBasePath';
import { liveRoutes } from '../data/adminDashboard.transport';

const LiveRouteStatusCard = () => (
  <div className="card flex-fill mb-4">
    <div className="card-header">
      <span className="stat-caption">Live</span>
      <h4 className="card-title mb-0">Live Route Status</h4>
    </div>
    <div className="card-body data-list data-list-cards data-list-cards-accent data-list-hover">
      {liveRoutes.map((route) => (
        <div
          className={`data-list-item flex-column align-items-stretch ${route.accentClass}`}
          key={route.id}
        >
          <div className="d-flex align-items-center justify-content-between">
            <span className="data-list-title">
              <i className={route.icon} />
              {route.route}
            </span>
            <span className={`chip chip-lg ${route.stateClass}`}>
              <span className="status-dot status-dot-sm status-dot-pulse" />
              {route.state}
            </span>
          </div>

          <div className="d-flex align-items-center gap-2">
            <span className="avatar avatar-sm flex-shrink-0">
              <ImageWithBasePath src={route.driverAvatar} alt={route.driver} />
            </span>
            <span className="data-list-title">
              {route.driver}
              <br />
              <span className="stat-label">{route.driverRole}</span>
            </span>
            <span className={route.tag.className}>
              <i className={route.tag.icon} />
              {route.tag.label}
            </span>
          </div>

          <div className="stat-grid">
            {route.stats.map((stat) => (
              <div className="stat-tile stat-tile-plain" key={stat.label}>
                <b>{stat.value}</b>
                <span className="d-block">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default LiveRouteStatusCard;
