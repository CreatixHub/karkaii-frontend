const HEAD_CELLS = 5;
const BODY_ROWS = 6;
const ACTION_DOTS = 4;
const PAGER_BUTTONS = 4;

const SkeletonRow = () => (
  <div className="skeleton-row">
    <div className="skeleton skeleton-chev" />
    <div className="skeleton skeleton-check" />
    <div className="skeleton-cell">
      <div className="skeleton skeleton-avatar skeleton-square" />
      <div className="skeleton-stack">
        <div className="skeleton skeleton-line" />
        <div className="skeleton skeleton-line skeleton-thin" />
      </div>
    </div>
    <div className="skeleton-stack">
      <div className="skeleton skeleton-line" />
      <div className="skeleton skeleton-line skeleton-thin" />
    </div>
    <div className="skeleton-actions">
      <div className="skeleton skeleton-pill" />
      <div className="skeleton skeleton-pill" />
    </div>
    <div className="skeleton skeleton-pill" />
    <div className="skeleton-actions">
      {Array.from({ length: ACTION_DOTS }, (_, index) => (
        <div className="skeleton skeleton-circle" key={index} />
      ))}
    </div>
  </div>
);

const ClassroomsSkeleton = () => (
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
        {Array.from({ length: 5 }, (_, index) => (
          <div className="skeleton skeleton-chip" key={index} />
        ))}
        <div className="skeleton skeleton-btn ms-auto" />
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

    <div className="skeleton-foot">
      <div className="skeleton skeleton-line skeleton-foot-info" />
      <div className="skeleton skeleton-foot-size" />
      <div className="skeleton-pager">
        {Array.from({ length: PAGER_BUTTONS }, (_, index) => (
          <div className="skeleton skeleton-page" key={index} />
        ))}
      </div>
    </div>
  </div>
);

export default ClassroomsSkeleton;
