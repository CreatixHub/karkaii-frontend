import CommunicationTrendChart from '../charts/CommunicationTrendChart';

const LEGEND = [
  { label: 'SMS', className: 'text-primary' },
  { label: 'Email', className: 'text-info' },
  { label: 'App', className: 'text-success' },
];

const CommunicationTrendCard = () => (
  <div className="card flex-fill mb-4">
    <div className="card-header">
      <span className="stat-caption">Engagement</span>
      <h4 className="card-title mb-0">Weekly Communication Trend</h4>
    </div>
    <div className="card-body pb-0">
      <div className="d-flex align-items-center flex-wrap gap-4 mb-2">
        <div>
          <p className="stat-label mb-0">Total Sent</p>
          <h4 className="mb-0">
            8,942 <span className="badge badge-soft-success fs-11 align-middle">+6.2%</span>
          </h4>
        </div>
        <div className="d-flex align-items-center gap-3">
          {LEGEND.map((item) => (
            <span className="d-inline-flex align-items-center fs-13" key={item.label}>
              <i className={`ti ti-point-filled ${item.className} me-1 fs-18`} />
              {item.label}
            </span>
          ))}
        </div>
      </div>
      <CommunicationTrendChart />
    </div>
  </div>
);

export default CommunicationTrendCard;
