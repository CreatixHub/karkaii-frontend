const TeacherGridSkeleton = ({ hidden }: { hidden: boolean }) => (
  <div className={`skeleton-loader${hidden ? ' hidden' : ''}`} aria-hidden="true">
    <div className="skeleton-head">
      <div className="skeleton-toolbar">
        <div className="skeleton skeleton-search" />
        <div className="skeleton skeleton-btn" />
        <div className="skeleton skeleton-btn" />
        <div className="skeleton skeleton-btn" />
        <div className="skeleton skeleton-ico ms-auto" />
        <div className="skeleton skeleton-ico" />
        <div className="skeleton skeleton-ico" />
      </div>
      <div className="skeleton-quick">
        <div className="skeleton skeleton-chip" />
        <div className="skeleton skeleton-chip" />
        <div className="skeleton skeleton-chip" />
        <div className="skeleton skeleton-chip" />
        <div className="skeleton skeleton-chip" />
        <div className="skeleton skeleton-btn ms-auto" />
      </div>
    </div>

    <div className="skeleton-summary">
      {Array.from({ length: 8 }, (_, index) => (
        <div className="skeleton skeleton-card" key={index} />
      ))}
    </div>

    <div className="skeleton-body">
      <div className="row g-3">
        {Array.from({ length: 8 }, (_, index) => (
          <div className="col-xxl-4 col-md-6" key={index}>
            <div className="card">
              <div className="card-body">
                <div className="d-flex align-items-center gap-2 mb-3">
                  <div className="skeleton skeleton-avatar" />
                  <div className="flex-fill">
                    <div className="skeleton skeleton-line" />
                    <div className="skeleton skeleton-line skeleton-thin" />
                  </div>
                </div>
                <div className="skeleton skeleton-line mb-2" />
                <div className="skeleton skeleton-line skeleton-thin mb-3" />
                <div className="d-flex align-items-center justify-content-between">
                  <div className="skeleton skeleton-btn" />
                  <div className="skeleton skeleton-btn" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>

    <div className="skeleton-foot">
      <div className="skeleton skeleton-line skeleton-foot-info" />
      <div className="skeleton skeleton-foot-size" />
      <div className="skeleton-pager">
        {Array.from({ length: 8 }, (_, index) => (
          <div className="skeleton skeleton-page" key={index} />
        ))}
      </div>
    </div>
  </div>
);

export default TeacherGridSkeleton;
