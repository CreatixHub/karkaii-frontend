import BooksIssuedChart from '../charts/BooksIssuedChart';
import { libraryStats } from '../data/adminDashboard.library';

const BooksIssuedCard = () => (
  <div className="card flex-fill mb-4">
    <div className="card-header">
      <span className="stat-caption">Resources</span>
      <h4 className="card-title mb-0">Books Issued Trend</h4>
    </div>
    <div className="card-body d-flex flex-column">
      <div className="row g-3 mb-3">
        {libraryStats.map((stat) => (
          <div className="col-sm-6 col-lg-3" key={stat.id}>
            <div className="border rounded-3 p-3 h-100">
              <div className="d-flex align-items-center justify-content-between mb-1">
                <span className="stat-label">{stat.label}</span>
                {stat.badge ? (
                  <span className="badge badge-soft-success">
                    <i className="ti ti-arrow-up-right" />
                    {stat.badge}
                  </span>
                ) : (
                  <i className={stat.icon} />
                )}
              </div>
              <h4 className={`mb-0 fw-bold ${stat.valueClass ?? ''}`}>{stat.value}</h4>
            </div>
          </div>
        ))}
      </div>

      <div className="d-flex align-items-center justify-content-between mb-2 flex-wrap">
        <span className="stat-caption">12-Month Trend</span>
        <span className="stat-label">
          <span className="text-success fw-semibold">+5.4%</span> vs last year · 8,486 issued
        </span>
      </div>

      <div className="flex-grow-1 d-flex align-items-center">
        <BooksIssuedChart />
      </div>
    </div>
  </div>
);

export default BooksIssuedCard;
