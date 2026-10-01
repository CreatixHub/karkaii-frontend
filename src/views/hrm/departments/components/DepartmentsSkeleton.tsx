const DepartmentsSkeleton = () => (
  <div id="dept_skeleton" aria-hidden="true">
    <div className="card is-loaded data-workspace classes-workspace mb-0">
      <div className="card-header border-bottom">
        <div className="skeleton-toolbar">
          <div className="skeleton skeleton-search" />
          <div className="skeleton skeleton-btn" />
          <div className="skeleton skeleton-btn" />
          <div className="skeleton skeleton-density ms-auto" />
          <div className="skeleton skeleton-ico" />
          <div className="skeleton skeleton-ico" />
        </div>
      </div>
      <div className="card-body">
        <div className="row g-3">
          <div className="col-xxl-4 col-lg-5">
            {[0, 1, 2].map((index) => (
              <div className={index === 2 ? 'card mb-0' : 'card mb-3'} key={index}>
                <div className="card-body">
                  <div className="d-flex gap-3">
                    <span className="skeleton skeleton-avatar" />
                    <div className="flex-fill">
                      <div className="skeleton skeleton-line w-75 mb-2" />
                      <div className="skeleton skeleton-line w-50" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="col-xxl-8 col-lg-7">
            <div className="card mb-0">
              <div className="card-body">
                <div className="d-flex gap-3 mb-4">
                  <span className="avatar avatar-xl skeleton rounded" />
                  <div className="flex-fill">
                    <div className="skeleton skeleton-line w-25 mb-2" />
                    <div className="skeleton skeleton-line w-75" />
                  </div>
                </div>
                <div className="row g-3 mb-4">
                  {[0, 1, 2].map((index) => (
                    <div className="col-4" key={index}>
                      <div className="skeleton skeleton-card" />
                    </div>
                  ))}
                </div>
                <div className="d-flex gap-3">
                  {[0, 1, 2].map((index) => (
                    <div className="skeleton skeleton-card flex-fill" key={index} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default DepartmentsSkeleton;
