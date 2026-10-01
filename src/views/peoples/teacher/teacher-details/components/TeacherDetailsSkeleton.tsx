const TeacherDetailsSkeleton = () => (
  <div id="td_skeleton" aria-hidden="true">
    <div className="card mb-3">
      <div className="card-body">
        <div className="d-sm-flex align-items-center gap-3">
          <span className="avatar avatar-xxl skeleton rounded flex-shrink-0" />
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
      {[0, 1, 2, 3].map((index) => (
        <div className="col-xl-3 col-md-6" key={index}>
          <div className="card mb-0">
            <div className="card-body p-3">
              <span className="skeleton skeleton-avatar rounded-circle flex-shrink-0 mb-2" />
              <div className="skeleton skeleton-line w-75 mb-2" />
              <div className="skeleton skeleton-line w-50" />
            </div>
          </div>
        </div>
      ))}
    </div>

    <div className="row">
      <div className="col-xxl-3 col-xl-4">
        <div className="card">
          <div className="card-body">
            <div className="skeleton skeleton-line mb-3" />
            <div className="skeleton skeleton-line w-75 mb-3" />
            <div className="skeleton skeleton-line w-50" />
          </div>
        </div>
      </div>
      <div className="col-xxl-9 col-xl-8">
        <div className="card">
          <div className="card-body">
            <div className="skeleton skeleton-line w-25 mb-3" />
            <div className="skeleton skeleton-card mb-3" />
            <div className="skeleton skeleton-card" />
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default TeacherDetailsSkeleton;
