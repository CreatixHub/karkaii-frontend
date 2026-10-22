import FuelConsumptionChart from '../charts/FuelConsumptionChart';

const SUMMARY = [
  { id: 'week', label: 'This Week', value: '3,284', unit: 'gal' },
  { id: 'avg', label: 'Avg / Route', value: '18.4', unit: 'gal' },
  { id: 'cost', label: 'Cost', value: '$11,540' },
];

const FuelConsumptionCard = () => (
  <div className="card flex-fill mb-4">
    <div className="card-header">
      <span className="stat-caption">Operations</span>
      <h4 className="card-title mb-0">Fuel Consumption Trend</h4>
    </div>
    <div className="card-body pb-0">
      <div className="d-flex align-items-center flex-wrap gap-4 mb-2">
        {SUMMARY.map((item) => (
          <div key={item.id}>
            <p className="stat-label mb-0">{item.label}</p>
            <h4 className="mb-0">
              {item.value}
              {item.unit ? <span className="fs-14 text-muted"> {item.unit}</span> : null}
            </h4>
          </div>
        ))}
      </div>
      <FuelConsumptionChart />
    </div>
  </div>
);

export default FuelConsumptionCard;
