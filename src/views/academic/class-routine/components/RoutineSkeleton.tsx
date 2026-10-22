const DAY_COLUMNS = 5;
const SLOT_ROWS = 6;

const RoutineSkeleton = () => (
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
        <div className="skeleton skeleton-head" />
        {Array.from({ length: DAY_COLUMNS }, (_, index) => (
          <div
            className={`skeleton skeleton-head${index === DAY_COLUMNS - 1 ? ' skeleton-head-end' : ''}`}
            key={index}
          />
        ))}
      </div>
      {Array.from({ length: SLOT_ROWS }, (_, row) => (
        <div className="skeleton-row" key={row}>
          <div className="skeleton skeleton-line skeleton-thin" />
          {Array.from({ length: DAY_COLUMNS }, (_, column) => (
            <div className="skeleton-stack" key={column}>
              <div className="skeleton skeleton-line" />
              <div className="skeleton skeleton-line skeleton-thin" />
              <div className="skeleton skeleton-pill" />
            </div>
          ))}
        </div>
      ))}
    </div>

    <div className="skeleton-foot">
      <div className="skeleton skeleton-line skeleton-foot-info" />
      <div className="skeleton skeleton-foot-size" />
      <div className="skeleton-pager">
        {Array.from({ length: 3 }, (_, index) => (
          <div className="skeleton skeleton-page" key={index} />
        ))}
      </div>
    </div>
  </div>
);

export default RoutineSkeleton;
