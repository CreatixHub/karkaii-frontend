const ProfileSkeleton = () => (
  <div className="row">
    <div className="col-xxl-3 col-xl-4">
      <div className="card">
        <div className="card-body text-center">
          <span className="avatar avatar-xxl skeleton rounded-circle flex-shrink-0 mb-2" />
          <div className="skeleton skeleton-line w-50 mx-auto mb-2" />
          <div className="skeleton skeleton-line w-75 mx-auto mb-3" />
          <div className="skeleton skeleton-line w-100 mb-2" />
          <div className="skeleton skeleton-line w-100" />
        </div>
      </div>
      <div className="card mb-0">
        <div className="card-body">
          {[0, 1, 2].map((index) => (
            <div className={`d-flex justify-content-between${index < 2 ? ' mb-3' : ''}`} key={index}>
              <span className="skeleton skeleton-line w-50" />
              <span className="skeleton skeleton-line w-25" />
            </div>
          ))}
        </div>
      </div>
    </div>
    <div className="col-xxl-9 col-xl-8">
      <div className="card mb-0">
        <div className="card-body">
          <div className="d-flex gap-2 mb-3">
            {[0, 1, 2, 3, 4].map((index) => (
              <span className="skeleton skeleton-btn" key={index} />
            ))}
          </div>
          <div className="skeleton skeleton-line w-25 mb-3" />
          {[0, 1, 2, 3].map((index) => (
            <div className={`d-flex justify-content-between${index < 3 ? ' mb-3' : ''}`} key={index}>
              <span className="skeleton skeleton-line w-25" />
              <span className="skeleton skeleton-line w-50" />
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default ProfileSkeleton;
