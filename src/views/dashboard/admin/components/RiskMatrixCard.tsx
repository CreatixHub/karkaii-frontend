import RiskMatrixChart from '../charts/RiskMatrixChart';

const RISK_BANDS = [
  { id: 'low', label: 'Low', count: '2,851', percent: '78%', dotClass: 'bg-success' },
  { id: 'medium', label: 'Medium', count: '642', percent: '18%', dotClass: 'bg-warning' },
  { id: 'high', label: 'High', count: '161', percent: '4%', dotClass: 'bg-danger' },
];

const RiskMatrixCard = () => (
  <div className="card flex-fill mb-4">
    <div className="card-header">
      <span className="stat-caption">Heat</span>
      <h4 className="card-title mb-0">Performance Risk Matrix</h4>
    </div>
    <div className="card-body d-flex flex-column">
      <div className="d-flex align-items-center justify-content-between mb-3 pb-3">
        <div>
          <h3 className="mb-0 fw-bold">3,654</h3>
          <span className="stat-label">Students Assessed</span>
        </div>
        <span className="badge badge-soft-success">
          <i className="ti ti-shield-check me-1" />
          78% Healthy
        </span>
      </div>

      <div className="progress progress-md mb-2">
        <div className="progress-bar bg-success" style={{ width: '78%' }} />
        <div className="progress-bar bg-warning" style={{ width: '18%' }} />
        <div className="progress-bar bg-danger" style={{ width: '4%' }} />
      </div>

      <div className="flex-grow-1 mt-2">
        <RiskMatrixChart />
        <div className="d-flex align-items-center justify-content-center flex-wrap gap-3 mt-1">
          {RISK_BANDS.map((band) => (
            <span className="chip chip-lg" key={band.id}>
              <span className={`status-dot status-dot-lg ${band.dotClass}`} />
              {band.label} <b>{band.count}</b>
              <small>{band.percent}</small>
            </span>
          ))}
        </div>
      </div>

      <div className="insight-card justify-content-between mt-3">
        <span className="fs-13">
          <i className="ti ti-clipboard-check text-success me-1" />
          Intervention Plans Active
        </span>
        <span className="badge badge-soft-success">142 Students</span>
      </div>
    </div>
  </div>
);

export default RiskMatrixCard;
