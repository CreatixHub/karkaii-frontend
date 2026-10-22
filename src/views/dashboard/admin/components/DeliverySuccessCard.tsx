import DeliveryTrendChart from '../charts/DeliveryTrendChart';
import MiniBarChart from '../charts/MiniBarChart';
import { deliveryChannels } from '../data/adminDashboard.data';

const QUEUE_TILES = [
  { id: 'failed', value: '142', label: 'Failed', className: 'text-danger' },
  { id: 'pending', value: '68', label: 'Pending', className: 'text-warning' },
  { id: 'queue', value: '213', label: 'Queue', className: 'text-primary' },
];

const DeliverySuccessCard = () => (
  <div className="card flex-fill mb-4">
    <div className="card-header">
      <span className="stat-caption">Delivery</span>
      <h4 className="card-title mb-0">Delivery Success</h4>
    </div>
    <div className="card-body d-flex flex-column data-list data-list-dashed">
      <div className="text-center mb-3">
        <div className="gauge mx-auto mb-2 gauge-success">
          <span className="gauge-value">95.6%</span>
        </div>
        <p className="stat-label mb-0">
          Overall Success Rate
          <span className="badge badge-soft-success ms-1">
            <i className="ti ti-arrow-up-right" />
            1.2%
          </span>
        </p>
      </div>

      {deliveryChannels.map((channel) => (
        <div className="data-list-item" key={channel.id}>
          <span className={`avatar avatar-icon avatar-md ${channel.iconClass}`}>
            <i className={channel.icon} />
          </span>
          <span className="data-list-title flex-shrink-0">{channel.label}</span>
          <MiniBarChart color={channel.color} data={channel.data} />
          <span className="data-list-end stat-label">
            {channel.rate}
            <small>{channel.sent}</small>
          </span>
        </div>
      ))}

      <div className="mt-3">
        <div className="d-flex align-items-center justify-content-between mb-1">
          <span className="stat-caption">7-Day Delivery</span>
          <span className="stat-label">24.6k delivered</span>
        </div>
        <DeliveryTrendChart />
      </div>

      <div className="row g-2 mt-auto">
        {QUEUE_TILES.map((tile) => (
          <div className="col-4" key={tile.id}>
            <div className="stat-tile stat-tile-plain">
              <div className={`stat-value stat-value-xs ${tile.className}`}>{tile.value}</div>
              <span className="stat-label stat-label-sm">{tile.label}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="insight-card justify-content-between mt-2">
        <span className="fs-13">
          <i className="ti ti-clock-hour-4 text-primary me-1" />
          Avg. Response
        </span>
        <span className="badge badge-soft-success">1h 12m</span>
      </div>
    </div>
  </div>
);

export default DeliverySuccessCard;
