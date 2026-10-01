const ProfileSkeleton = () => (
  <div id="ad_skeleton">
    <div className="card mb-3">
      <div className="card-body">
        <div className="d-sm-flex align-items-center">
          <span className="avatar avatar-xxl skeleton rounded flex-shrink-0 me-sm-3 mb-3 mb-sm-0" />
          <div className="flex-fill w-100">
            <div className="skeleton skeleton-line w-25 mb-2" />
            <div className="skeleton skeleton-line w-50 mb-3" />
            <div className="d-flex gap-2">
              <span className="skeleton skeleton-btn" />
              <span className="skeleton skeleton-btn" />
              <span className="skeleton skeleton-btn" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div className="row g-3 mb-3">
      {[0, 1, 2, 3, 4, 5].map((index) => (
        <div className="col-xl-2 col-md-4 col-sm-6" key={index}>
          <div className="card mb-0">
            <div className="card-body p-3">
              <span className="avatar avatar-md skeleton rounded-circle flex-shrink-0 mb-2" />
              <div className="skeleton skeleton-line w-75 mb-2" />
              <div className="skeleton skeleton-line w-50" />
            </div>
          </div>
        </div>
      ))}
    </div>
    <div className="row">
      <div className="col-12 col-xxl-3 col-xl-4 mb-3 mb-xl-0">
        <div className="card mb-0">
          <div className="card-body">
            {[0, 1, 2, 3, 4, 5].map((index) => (
              <div
                className={`d-flex justify-content-between${index < 5 ? ' mb-3' : ''}`}
                key={index}
              >
                <span className="skeleton skeleton-line w-25" />
                <span className="skeleton skeleton-line w-25" />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="col-12 col-xxl-9 col-xl-8">
        <div className="card mb-0">
          <div className="card-body">
            <div className="skeleton skeleton-line w-25 mb-3" />
            <div className="skeleton skeleton-line w-100 mb-3" />
            <div className="d-flex gap-2 mb-3">
              <span className="skeleton skeleton-btn" />
              <span className="skeleton skeleton-btn" />
              <span className="skeleton skeleton-btn" />
              <span className="skeleton skeleton-btn" />
            </div>
            {[0, 1, 2, 3, 4, 5].map((index) => (
              <div
                className={`d-flex justify-content-between${index < 6 ? ' mb-3' : ''}`}
                key={index}
              >
                <span className="skeleton skeleton-line w-25" />
                <span className="skeleton skeleton-line w-25" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default ProfileSkeleton;
