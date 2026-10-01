const TimetableSkeleton = () => (
  <div id="ctt_skeleton" aria-hidden="true">
    <div className="card is-loaded data-workspace classes-workspace mb-3">
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
    </div>
    <div className="card mb-3">
      <div className="card-body">
        <div className="d-flex flex-wrap gap-4">
          <div className="skeleton skeleton-avatar" />
          <div className="flex-fill">
            <div className="skeleton skeleton-line w-25 mb-2" />
            <div className="skeleton skeleton-line w-50" />
          </div>
          <div className="d-flex gap-2">
            <span className="skeleton skeleton-btn" />
            <span className="skeleton skeleton-btn" />
          </div>
        </div>
      </div>
    </div>
    <div className="card mb-0">
      <div className="card-body">
        <div className="d-flex gap-3 overflow-hidden">
          {[0, 1, 2, 3].map((column) => (
            <div className="flex-fill" key={column}>
              <div className="skeleton skeleton-line mb-3" />
              <div className="skeleton skeleton-card mb-3" />
              <div className="skeleton skeleton-card mb-3" />
              <div className="skeleton skeleton-card" />
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default TimetableSkeleton;
