const HEAD_CELLS = 5;
const BODY_ROWS = 6;
const QUICK_CHIPS = 5;
const ACTION_DOTS = 4;

const SkeletonRow = () => (
  <div className="skeleton-row">
    <div className="skeleton skeleton-chev" />
    <div className="skeleton skeleton-check" />
    <div className="skeleton-cell">
      <div className="skeleton skeleton-avatar" />
      <div className="skeleton-stack">
        <div className="skeleton skeleton-line" />
        <div className="skeleton skeleton-line skeleton-thin" />
      </div>
    </div>
    <div className="skeleton-stack">
      <div className="skeleton skeleton-line" />
      <div className="skeleton skeleton-line skeleton-thin" />
    </div>
    <div className="skeleton-stack">
      <div className="skeleton skeleton-line" />
      <div className="skeleton skeleton-progress" />
    </div>
    <div className="skeleton skeleton-pill" />
    <div className="skeleton-actions">
      {Array.from({ length: ACTION_DOTS }, (_, index) => (
        <div className="skeleton skeleton-circle" key={index} />
      ))}
    </div>
  </div>
);

const ResultsSkeleton = () => (
  <div className="skeleton-loader" aria-hidden="true">
    <div className="skeleton-head">
      <div className="skeleton-toolbar">
        <div className="skeleton skeleton-search" />
        <div className="skeleton skeleton-btn" />
        <div className="skeleton skeleton-btn" />
        <div className="skeleton skeleton-btn" />
        <div className="skeleton skeleton-density ms-auto" />
        <div className="skeleton skeleton-ico" />
        <div className="skeleton skeleton-ico" />
      </div>
      <div className="skeleton-quick">
        {Array.from({ length: QUICK_CHIPS }, (_, index) => (
          <div className="skeleton skeleton-chip" key={index} />
        ))}
      </div>
    </div>

    <div className="skeleton-body">
      <div className="skeleton-row skeleton-thead">
        <span />
        <div className="skeleton skeleton-check" />
        {Array.from({ length: HEAD_CELLS }, (_, index) => (
          <div
            className={`skeleton skeleton-head${index === HEAD_CELLS - 1 ? ' skeleton-head-end' : ''}`}
            key={index}
          />
        ))}
      </div>
      {Array.from({ length: BODY_ROWS }, (_, index) => (
        <SkeletonRow key={index} />
      ))}
    </div>
  </div>
);

export default ResultsSkeleton;
