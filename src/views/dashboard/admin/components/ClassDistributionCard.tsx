import { classDistribution } from '../data/adminDashboard.data';

const ClassDistributionCard = () => (
  <div className="card flex-fill mb-4">
    <div className="card-header">
      <span className="stat-caption">Capacity</span>
      <h4 className="card-title mb-0">Class-wise Distribution</h4>
    </div>
    <div className="card-body d-flex flex-column">
      <div className="d-flex align-items-center justify-content-between mb-3 pb-3">
        <div>
          <h3 className="mb-0 fw-bold">3,654</h3>
          <span className="stat-label">Total Students Enrolled</span>
        </div>
        <span className="badge badge-soft-success">
          <i className="ti ti-arrow-up-right" />
          4.6% YoY
        </span>
      </div>

      <div className="flex-grow-1 d-flex flex-column justify-content-between">
        {classDistribution.map((row) => (
          <div key={row.label}>
            <div className="d-flex justify-content-between fs-13 mb-1">
              <span>{row.label}</span>
              <span className="fw-semibold">
                {row.count} · {row.percent}
              </span>
            </div>
            <div className={`meter ${row.meterClass}`}>
              <span style={{ width: row.width }} />
            </div>
          </div>
        ))}
      </div>

      <div className="row g-2 mt-3">
        <div className="col-6">
          <div className="border rounded-3 p-2 text-center">
            <h4 className="mb-0 fs-15 fw-medium">114</h4>
            <span className="stat-label">Sections</span>
          </div>
        </div>
        <div className="col-6">
          <div className="border rounded-3 p-2 text-center">
            <h5 className="mb-0 fs-15">32</h5>
            <span className="stat-label">Avg. Class Size</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default ClassDistributionCard;
