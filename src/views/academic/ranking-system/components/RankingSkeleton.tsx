const STAT_TILES = 4;
const GRID_CARDS = 6;

const SkeletonStat = () => (
  <div className="col-xl-3 col-sm-6 d-flex">
    <div className="card flex-fill">
      <div className="card-body d-flex align-items-center justify-content-between">
        <div className="skeleton-stack flex-fill me-3">
          <div className="skeleton skeleton-line skeleton-thin" />
          <div className="skeleton skeleton-line" />
        </div>
        <div className="skeleton skeleton-avatar" />
      </div>
    </div>
  </div>
);

const SkeletonCard = () => (
  <div className="col-xl-4 col-md-6 d-flex">
    <div className="card flex-fill">
      <div className="card-body">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <div className="skeleton skeleton-avatar" />
          <div className="skeleton skeleton-pill" />
        </div>
        <div className="skeleton-stack mb-3">
          <div className="skeleton skeleton-line" />
          <div className="skeleton skeleton-line skeleton-thin" />
        </div>
        <div className="skeleton-stack mb-3">
          <div className="skeleton skeleton-line skeleton-thin" />
          <div className="skeleton skeleton-line skeleton-thin" />
        </div>
        <div className="d-flex align-items-center gap-2">
          <div className="skeleton skeleton-btn flex-fill" />
          <div className="skeleton skeleton-circle" />
        </div>
      </div>
    </div>
  </div>
);

const RankingSkeleton = () => (
  <div className="skeleton-loader" aria-hidden="true">
    <div className="row">
      {Array.from({ length: STAT_TILES }, (_, index) => (
        <SkeletonStat key={index} />
      ))}
    </div>
    <div className="row">
      {Array.from({ length: GRID_CARDS }, (_, index) => (
        <SkeletonCard key={index} />
      ))}
    </div>
  </div>
);

export default RankingSkeleton;
