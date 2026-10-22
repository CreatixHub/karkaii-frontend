const SELECTORS = 6;
const STAT_CELLS = 8;
const INFO_LINES = 6;
const BODY_ROWS = 8;

const SkeletonRow = () => (
  <div className="skeleton-row">
    <div className="skeleton skeleton-line skeleton-thin" />
    <div className="skeleton-cell">
      <div className="skeleton skeleton-avatar" />
      <div className="skeleton-stack">
        <div className="skeleton skeleton-line" />
        <div className="skeleton skeleton-line skeleton-thin" />
      </div>
    </div>
    <div className="skeleton skeleton-btn" />
    <div className="skeleton skeleton-btn" />
    <div className="skeleton skeleton-pill" />
    <div className="skeleton skeleton-line" />
    <div className="skeleton skeleton-pill" />
    <div className="skeleton-actions">
      <div className="skeleton skeleton-circle" />
    </div>
  </div>
);

const MarksEntrySkeleton = () => (
  <div className="skeleton-loader" aria-hidden="true">
    <div className="skeleton-head">
      <div className="skeleton-toolbar">
        {Array.from({ length: SELECTORS }, (_, index) => (
          <div className="skeleton skeleton-btn" key={index} />
        ))}
      </div>
      <div className="skeleton-quick">
        <div className="skeleton skeleton-search" />
        <div className="skeleton skeleton-btn ms-auto" />
        <div className="skeleton skeleton-btn" />
      </div>
    </div>

    <div className="skeleton-body d-flex flex-wrap gap-3">
      <div className="flex-fill">
        <div className="skeleton-grid">
          {Array.from({ length: STAT_CELLS }, (_, index) => (
            <div className="skeleton-stack" key={index}>
              <div className="skeleton skeleton-line skeleton-thin" />
              <div className="skeleton skeleton-line" />
            </div>
          ))}
        </div>
      </div>
      <div className="flex-fill">
        {Array.from({ length: INFO_LINES }, (_, index) => (
          <div className="skeleton skeleton-line mb-2" key={index} />
        ))}
      </div>
    </div>

    <div className="skeleton-body">
      <div className="skeleton-row skeleton-thead">
        {Array.from({ length: STAT_CELLS }, (_, index) => (
          <div
            className={`skeleton skeleton-head${index === STAT_CELLS - 1 ? ' skeleton-head-end' : ''}`}
            key={index}
          />
        ))}
      </div>
      {Array.from({ length: BODY_ROWS }, (_, index) => (
        <SkeletonRow key={index} />
      ))}
    </div>

    <div className="skeleton-foot">
      <div className="skeleton skeleton-line skeleton-foot-info" />
      <div className="skeleton-pager">
        {Array.from({ length: 3 }, (_, index) => (
          <div className="skeleton skeleton-page" key={index} />
        ))}
      </div>
    </div>
  </div>
);

export default MarksEntrySkeleton;
