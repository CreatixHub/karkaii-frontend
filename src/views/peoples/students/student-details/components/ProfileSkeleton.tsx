const ProfileSkeleton = () => (
  <div className="skeleton-loader" aria-hidden="true">
    <div className="card">
      <div className="card-body">
        <div className="d-flex align-items-center gap-3 flex-wrap">
          <div className="skeleton skeleton-photo" />
          <div className="flex-grow-1">
            <div className="skeleton skeleton-line mb-2" style={{ width: 220, height: 20 }} />
            <div className="skeleton skeleton-line mb-2" style={{ width: 320 }} />
            <div className="skeleton skeleton-line" style={{ width: 180, height: 10 }} />
          </div>
          <div className="d-flex gap-3">
            <div className="skeleton skeleton-ring" />
            <div className="skeleton skeleton-ring" />
            <div className="skeleton skeleton-ring" />
          </div>
        </div>
      </div>
    </div>

    <div className="row g-3 mb-3">
      {[0, 1, 2, 3].map((index) => (
        <div className="col-md-3" key={index}>
          <div className="skeleton skeleton-ov" />
        </div>
      ))}
    </div>

    <div className="row g-3">
      <div className="col-12 col-xxl-4">
        <div className="card">
          <div className="card-body">
            <div className="skeleton skeleton-card" />
          </div>
        </div>
      </div>
      <div className="col-12 col-xxl-8">
        <div className="card">
          <div className="card-body">
            <div className="skeleton skeleton-chart mb-3" />
            <div className="skeleton skeleton-line mb-2" style={{ width: '80%' }} />
            <div className="skeleton skeleton-line" style={{ width: '60%' }} />
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default ProfileSkeleton;
