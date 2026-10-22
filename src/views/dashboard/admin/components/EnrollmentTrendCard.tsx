import EnrollmentTrendChart from '../charts/EnrollmentTrendChart';
import { enrollmentSummary } from '../data/adminDashboard.data';

const EnrollmentTrendCard = () => (
  <div className="card flex-fill mb-4">
    <div className="card-header">
      <span className="stat-caption">Insights</span>
      <h4 className="card-title mb-0">Enrollment &amp; Growth Trend</h4>
    </div>
    <div className="card-body">
      <div className="row g-3 mb-3">
        {enrollmentSummary.map((card) => (
          <div className="col-sm-4" key={card.id}>
            <div className="border rounded-3 p-3 h-100">
              <div className="d-flex align-items-center justify-content-between mb-1">
                <span className="stat-label">{card.label}</span>
                <span className="badge badge-soft-success">
                  <i className="ti ti-arrow-up-right" />
                  {card.badge}
                </span>
              </div>
              <h3 className="mb-0 fw-bold">{card.value}</h3>
              <span className="stat-label">
                <i className={`${card.footnoteIcon} me-1`} />
                {card.footnote}
              </span>
            </div>
          </div>
        ))}
      </div>

      <EnrollmentTrendChart />

      <div className="insight-card mt-2">
        <span className="avatar avatar-icon avatar-md bg-info-transparent me-2 flex-shrink-0">
          <i className="ti ti-bulb" />
        </span>
        <p className="mb-0 fs-13">
          Enrollments are up <span className="fw-semibold text-dark">18%</span> vs last term,
          outpacing graduations by <span className="fw-semibold text-dark">2.1×</span> — capacity
          utilisation now at <span className="fw-semibold text-dark">86%</span>.
        </p>
      </div>
    </div>
  </div>
);

export default EnrollmentTrendCard;
