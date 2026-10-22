const HolidaySkeleton = () => (
  <div className="skeleton-loader" aria-hidden="true">
    <div className="row g-3">
      <div className="col-12 col-xl-8">
        <div className="card">
          <div className="card-body">
            <div className="skeleton skeleton-line" />
            <div className="skeleton skeleton-line skeleton-thin" />
            <div className="skeleton skeleton-line" />
            <div className="skeleton skeleton-line skeleton-thin" />
            <div className="skeleton skeleton-line" />
          </div>
        </div>
      </div>
      <div className="col-12 col-xl-4">
        <div className="card mb-3">
          <div className="card-body">
            <div className="skeleton skeleton-line" />
            <div className="skeleton skeleton-line skeleton-thin" />
            <div className="skeleton skeleton-line skeleton-thin" />
          </div>
        </div>
        <div className="card">
          <div className="card-body">
            <div className="skeleton skeleton-line" />
            <div className="skeleton skeleton-line skeleton-thin" />
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default HolidaySkeleton;
