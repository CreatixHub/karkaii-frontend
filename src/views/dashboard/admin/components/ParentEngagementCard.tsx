import ParentEngagementChart from '../charts/ParentEngagementChart';
import { engagementBreakdown } from '../data/adminDashboard.data';

const SUMMARY_TILES = [
  { id: 'active', value: '2,851', label: 'Active' },
  { id: 'meetings', value: '24', label: 'Meetings' },
  { id: 'response', value: '1h 12m', label: 'Response' },
];

const ParentEngagementCard = () => (
  <div className="card flex-fill mb-4">
    <div className="card-header">
      <span className="stat-caption">Reach</span>
      <h4 className="card-title mb-0">Parent Engagement</h4>
    </div>
    <div className="card-body d-flex flex-column">
      <ParentEngagementChart />

      <div className="text-center pt-3">
        <h2 className="mb-0 fw-bold">78%</h2>
        <p className="stat-label mb-2">
          Overall Engagement Score
          <span className="badge badge-soft-success ms-1">
            <i className="ti ti-arrow-up-right" />
            3.4%
          </span>
        </p>
      </div>

      <div className="mt-1">
        {engagementBreakdown.map((band, index) => (
          <div
            className={index === engagementBreakdown.length - 1 ? 'mb-0' : 'mb-2'}
            key={band.label}
          >
            <div className="d-flex align-items-center justify-content-between fs-13 mb-1">
              <span>
                <i className={`${band.icon} me-1 fs-18`} />
                {band.label}
              </span>
              <span className="fw-semibold">{band.percent}</span>
            </div>
            <div className={`meter ${band.meterClass}`}>
              <span style={{ width: band.percent }} />
            </div>
          </div>
        ))}
      </div>

      <div className="row g-2 mt-auto pt-3">
        {SUMMARY_TILES.map((tile) => (
          <div className="col-4" key={tile.id}>
            <div className="border rounded-3 p-2 text-center">
              <h5 className="mb-0 fs-16 fw-medium">{tile.value}</h5>
              <span className="stat-label">{tile.label}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default ParentEngagementCard;
