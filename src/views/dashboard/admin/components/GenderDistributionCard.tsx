import GenderDistributionChart from '../charts/GenderDistributionChart';
import { genderRows } from '../data/adminDashboard.data';

const GenderDistributionCard = () => (
  <div className="card flex-fill mb-4">
    <div className="card-header">
      <span className="stat-caption">Demographics</span>
      <h4 className="card-title mb-0">Gender Distribution</h4>
    </div>
    <div className="card-body">
      <GenderDistributionChart />

      <div className="text-center pt-3 mb-3">
        <div className="stat-value">3,654</div>
        <p className="stat-label mb-0">
          Total Students
          <span className="badge badge-soft-success ms-1">
            <i className="ti ti-arrow-up-right" />
            4.6% YoY
          </span>
        </p>
      </div>

      <div className="data-list data-list-cards data-list-cards-accent data-list-hover">
        {genderRows.map((row) => (
          <div className={`data-list-item ${row.accentClass}`} key={row.id}>
            <span className={`avatar avatar-icon avatar-md ${row.iconClass}`}>
              <i className={row.icon} />
            </span>
            <div className="data-list-body">
              <div className="d-flex align-items-center justify-content-between">
                <span className="data-list-title">{row.label}</span>
                <span className="data-list-title">{row.value}</span>
              </div>
              <div className={`meter ${row.meterClass} mt-1`}>
                <span style={{ width: row.width }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default GenderDistributionCard;
