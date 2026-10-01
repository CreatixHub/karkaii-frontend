const STAT_CARDS = 4;
const FILTER_FIELDS = 4;
const TABLE_COLUMNS = 5;
const TABLE_ROWS = 8;

const cells = (count: number) =>
  Array.from({ length: count }, (_, index) => <div className="skeleton skeleton-line flex-fill" key={index} />);

const PerformanceSkeleton = () => (
  <div className="skeleton-loader" aria-hidden="true">
    <div className="row">
      {Array.from({ length: STAT_CARDS }, (_, index) => (
        <div className="col-xl-3 col-sm-6 d-flex" key={index}>
          <div className="card flex-fill">
            <div className="card-body d-flex align-items-center justify-content-between">
              <div className="flex-fill me-3">
                <div className="skeleton skeleton-line w-50 mb-2" />
                <div className="skeleton skeleton-line w-25" />
              </div>
              <span className="avatar avatar-lg skeleton rounded" />
            </div>
          </div>
        </div>
      ))}
    </div>

    <div className="card">
      <div className="card-body pb-0">
        <div className="row align-items-end g-3 mb-3">
          {Array.from({ length: FILTER_FIELDS }, (_, index) => (
            <div className="col-md-3" key={index}>
              <div className="skeleton skeleton-line w-50 mb-2" />
              <div className="skeleton skeleton-btn w-100" />
            </div>
          ))}
        </div>
      </div>
    </div>

    <div className="card">
      <div className="card-header d-flex align-items-center justify-content-between">
        <div className="skeleton skeleton-line w-25" />
        <div className="skeleton skeleton-pill" />
      </div>
      <div className="card-body p-0">
        <div className="d-flex gap-3 px-3 py-3 border-bottom">{cells(TABLE_COLUMNS)}</div>
        {Array.from({ length: TABLE_ROWS }, (_, index) => (
          <div className="d-flex gap-3 px-3 py-3 border-bottom" key={index}>
            {cells(TABLE_COLUMNS)}
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default PerformanceSkeleton;
