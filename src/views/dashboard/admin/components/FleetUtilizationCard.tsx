import FleetUtilizationChart from '../charts/FleetUtilizationChart';
import {
  fleetGauges,
  fleetStatus,
  fleetTiles,
} from '../data/adminDashboard.transport';

const FleetUtilizationCard = () => (
  <div className="card flex-fill mb-4">
    <div className="card-header">
      <span className="stat-caption">Fleet</span>
      <h4 className="card-title mb-0">Fleet Utilization</h4>
    </div>
    <div className="card-body d-flex flex-column">
      <div className="row g-2 mb-3">
        {fleetTiles.map((tile) => (
          <div className="col-sm-4" key={tile.id}>
            <div className="border rounded-3 p-2 text-center">
              <h6 className="mb-0">
                {tile.value}
                {tile.suffix ? (
                  <span className="fs-11 text-muted fw-normal">{tile.suffix}</span>
                ) : null}
              </h6>
              <span className="stat-label">{tile.label}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="d-flex align-items-center justify-content-between mb-1">
        <span className="stat-caption">Fleet Status</span>
        <span className="stat-label">48 vehicles</span>
      </div>
      <div className="meter meter-lg meter-segmented mb-2">
        {fleetStatus.map((segment) => (
          <span className={segment.colorClass} style={{ width: segment.width }} key={segment.id} />
        ))}
      </div>
      <div className="d-flex flex-wrap gap-3 mb-3">
        {fleetStatus.map((segment) => (
          <span className="chip" key={segment.id}>
            <i className={segment.colorClass} />
            {segment.label} <b>{segment.count}</b>
          </span>
        ))}
      </div>

      <div className="row text-center g-2 mb-3">
        {fleetGauges.map((gauge) => (
          <div className="col-4" key={gauge.id}>
            <div className={`gauge mx-auto mb-2 ${gauge.gaugeClass} gauge-sm`}>
              <span className="gauge-value fs-14">{gauge.value}</span>
            </div>
            <p className="stat-label mb-0">{gauge.label}</p>
          </div>
        ))}
      </div>

      <div className="d-flex align-items-center justify-content-between mb-1">
        <span className="stat-caption">7-Day Utilization</span>
        <span className="stat-label">
          <span className="text-success fw-semibold">+4.2%</span> vs last week
        </span>
      </div>
      <FleetUtilizationChart />

      <div className="d-flex align-items-center justify-content-between border rounded-3 p-2 mt-auto">
        <span className="fs-13">
          <i className="ti ti-steering-wheel text-primary me-1" />
          Drivers Available
        </span>
        <span className="fw-semibold">39 / 45</span>
      </div>
    </div>
  </div>
);

export default FleetUtilizationCard;
