import ImageWithBasePath from '@core/common/imageWithBasePath';
import {
  maintenanceSummary,
  maintenanceTimeline,
} from '../data/adminDashboard.transport';

const SUMMARY_VALUE_CLASS: Record<string, string> = {
  critical: 'text-danger',
  health: 'text-success',
};

const MaintenanceTimelineCard = () => (
  <div className="card flex-fill mb-4">
    <div className="card-header">
      <span className="stat-caption">Schedule</span>
      <h4 className="card-title mb-0">Maintenance Timeline</h4>
    </div>
    <div className="card-body data-list data-list-cards data-list-cards-accent data-list-hover">
      <div className="row g-2 mb-3">
        {maintenanceSummary.map((item) => (
          <div className="col-4" key={item.id}>
            <div className="border rounded-3 p-2 text-center">
              <h6 className={`mb-0 ${SUMMARY_VALUE_CLASS[item.id] ?? ''}`}>{item.value}</h6>
              <span className="stat-label">{item.label}</span>
            </div>
          </div>
        ))}
      </div>

      {maintenanceTimeline.map((item) => (
        <div className={`data-list-item ${item.accentClass}`} key={item.id}>
          <span className={`avatar avatar-icon avatar-md ${item.iconClass}`}>
            <i className={item.icon} />
          </span>
          <div className="data-list-body">
            <div className="data-list-title text-truncate">{item.title}</div>
            <div className="data-list-meta">
              <span className={`badge ${item.statusClass}`}>{item.status}</span>
              <span className="chip chip-muted">
                <span className="avatar avatar-xs avatar-rounded">
                  <ImageWithBasePath src={item.technicianAvatar} alt={item.technician} />
                </span>
                {item.technician}
              </span>
            </div>
          </div>
          <div className="data-list-end">
            <div className="data-list-title">{item.date}</div>
            <span className="stat-label">{item.time}</span>
          </div>
        </div>
      ))}

      <div className="d-flex align-items-center justify-content-between border-top pt-3 mt-3">
        <span className="stat-label">
          <i className="ti ti-clock-hour-4 me-1" />
          Next service in 14h
        </span>
        <button type="button" className="btn btn-link link-primary fw-medium fs-13 p-0">
          Full schedule <i className="ti ti-arrow-right ms-1" />
        </button>
      </div>
    </div>
  </div>
);

export default MaintenanceTimelineCard;
