const STAT_CARDS = 4;
const FILTER_FIELDS = 4;
const BODY_ROWS = 6;

const COLUMNS = { gridTemplateColumns: 'repeat(5, minmax(0, 1fr))' };

const ProgressReportsSkeleton = () => (
  <div className="skeleton-loader" aria-hidden="true">
    <div className="row">
      {Array.from({ length: STAT_CARDS }, (_, index) => (
        <div className="col-xl-3 col-sm-6 mb-4" key={index}>
          <div className="skeleton skeleton-card" />
        </div>
      ))}
    </div>

    <div className="card">
      <div className="card-body pb-0">
        <div className="row align-items-end g-3 mb-3">
          {Array.from({ length: FILTER_FIELDS }, (_, index) => (
            <div className="col-md-3" key={index}>
              <div className="skeleton skeleton-line mb-2" style={{ width: 96 }} />
              <div className="skeleton skeleton-btn" style={{ width: '100%' }} />
            </div>
          ))}
        </div>
      </div>
    </div>

    <div className="card">
      <div className="card-header d-flex align-items-center justify-content-between">
        <div className="skeleton skeleton-line" style={{ width: 160 }} />
        <div className="skeleton skeleton-btn" style={{ width: 120, height: 30 }} />
      </div>
      <div className="card-body p-0">
        <div className="skeleton-row" style={COLUMNS}>
          {Array.from({ length: 5 }, (_, index) => (
            <div className="skeleton skeleton-line" key={index} style={{ width: '70%' }} />
          ))}
        </div>
        {Array.from({ length: BODY_ROWS }, (_, row) => (
          <div className="skeleton-row" key={row} style={COLUMNS}>
            <div className="skeleton skeleton-line" />
            <div className="skeleton skeleton-line" style={{ width: '80%' }} />
            <div className="skeleton skeleton-line" style={{ width: '70%' }} />
            <div className="skeleton skeleton-line" style={{ width: '40%' }} />
            <div className="skeleton skeleton-pill" />
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default ProgressReportsSkeleton;
