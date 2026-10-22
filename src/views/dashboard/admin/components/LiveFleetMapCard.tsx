import {
  FLEET_MAP_EMBED_URL,
  trackedVehicles,
} from '../data/adminDashboard.transport';

const LiveFleetMapCard = () => (
  <div className="card flex-fill mb-4">
    <div className="card-header">
      <span className="stat-caption">Tracking</span>
      <h4 className="card-title mb-0">Live Fleet Map</h4>
    </div>
    <div className="card-body pb-2">
      <div className="map-panel">
        <iframe
          title="Live fleet map"
          src={FLEET_MAP_EMBED_URL}
          height={200}
          style={{
            width: '100%',
            border: 0,
            borderRadius: 8,
            filter: 'contrast(1.1) brightness(0.9) hue-rotate(-10deg)',
          }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>

      <div className="d-flex align-items-center justify-content-between mt-3">
        <span className="badge badge-soft-success">
          <i className="ti ti-gps me-1" />
          GPS Online
        </span>
        <span className="chip chip-lg">
          <i className="ti ti-sun text-warning" />
          28°C · Clear
        </span>
      </div>

      <div className="d-flex align-items-center justify-content-between mt-3 mb-1 flex-wrap">
        <span className="stat-caption">Live Vehicles</span>
        <span className="stat-label">18 tracked · 4 schools nearby</span>
      </div>

      <div className="pb-1">
        {trackedVehicles.map((vehicle) => (
          <div className="data-list-item" key={vehicle.id}>
            <span className={`avatar avatar-icon avatar-md ${vehicle.iconClass}`}>
              <i className={vehicle.icon} />
            </span>
            <div className="data-list-body">
              <div className="data-list-title">{vehicle.route}</div>
              <span className="data-list-subtitle">
                <i className={vehicle.locationIcon} /> {vehicle.location}
              </span>
            </div>
            <span className={`badge ${vehicle.statusClass}`}>{vehicle.status}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default LiveFleetMapCard;
