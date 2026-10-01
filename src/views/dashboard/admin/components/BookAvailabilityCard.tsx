import {
  availabilityStats,
  categoryAvailability,
} from '../data/adminDashboard.library';

const BookAvailabilityCard = () => (
  <div className="card flex-fill mb-4">
    <div className="card-header">
      <span className="stat-caption">Inventory</span>
      <h4 className="card-title mb-0">Book Availability</h4>
    </div>
    <div className="card-body d-flex flex-column">
      <div className="text-center pb-3 mb-3">
        <div className="gauge gauge-lg mx-auto mb-2 gauge-primary">
          <span className="gauge-value">81%</span>
        </div>
        <h5 className="mb-0">
          14,982 <span className="text-muted fw-normal fs-14">/ 18,420 titles</span>
        </h5>
        <span className="stat-label">Available across all shelves</span>
      </div>

      <div className="row g-2 mb-3">
        {availabilityStats.map((stat) => (
          <div className="col-sm-4" key={stat.id}>
            <div className="border rounded-3 p-2 text-center">
              <h6 className={`mb-0 ${stat.valueClass ?? ''}`}>{stat.value}</h6>
              <span className="stat-label">{stat.label}</span>
            </div>
          </div>
        ))}
      </div>

      <h6 className="stat-caption mb-2">Shelf Utilization</h6>
      <div className="mb-3">
        <div className="d-flex justify-content-between fs-13 mb-1">
          <span>Capacity used</span>
          <span className="fw-semibold">72%</span>
        </div>
        <div className="progress progress-sm">
          <div className="progress-bar bg-primary-gradient" style={{ width: '72%' }} />
        </div>
      </div>

      <h6 className="stat-caption mb-2">By Category</h6>
      <div className="row g-2 flex-grow-1 align-content-end">
        {categoryAvailability.map((category) => (
          <div className="col-sm-6" key={category.id}>
            <div className="border rounded-3 p-2 d-flex align-items-center justify-content-between">
              <span className="fs-13">
                <i className={`${category.icon} me-1`} />
                {category.label}
              </span>
              <span className={`badge ${category.badgeClass}`}>{category.percent}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default BookAvailabilityCard;
