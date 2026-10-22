const STAT_CARDS = 6;
const RANKING_ROWS = 6;

const AnalyticsSkeleton = () => (
  <div className="skeleton-loader" aria-hidden="true">
    <div className="row g-3 mb-1">
      {Array.from({ length: STAT_CARDS }, (_, index) => (
        <div className="col-xxl-2 col-lg-4 col-sm-6 d-flex" key={index}>
          <div className="card w-100 mb-0">
            <div className="card-body">
              <div className="d-flex align-items-start justify-content-between">
                <div className="skeleton skeleton-avatar" />
                <div className="skeleton skeleton-pill" style={{ width: 44 }} />
              </div>
              <div className="skeleton skeleton-line mt-3" style={{ height: 22, width: '60%' }} />
              <div className="skeleton skeleton-line" style={{ width: '80%' }} />
            </div>
          </div>
        </div>
      ))}
    </div>

    <div className="row mt-3">
      <div className="col-12 col-xl-8 d-flex">
        <div className="card flex-fill">
          <div className="card-header">
            <div className="skeleton skeleton-line" style={{ width: 200 }} />
          </div>
          <div className="card-body">
            <div className="skeleton" style={{ height: 300, borderRadius: 8 }} />
          </div>
        </div>
      </div>
      <div className="col-12 col-xl-4 d-flex">
        <div className="card flex-fill">
          <div className="card-header">
            <div className="skeleton skeleton-line" style={{ width: 130 }} />
          </div>
          <div className="card-body">
            <div className="skeleton" style={{ height: 280, borderRadius: 8 }} />
          </div>
        </div>
      </div>
    </div>

    <div className="row">
      <div className="col-12 col-xl-6 d-flex">
        <div className="card flex-fill">
          <div className="card-header">
            <div className="skeleton skeleton-line" style={{ width: 160 }} />
          </div>
          <div className="card-body">
            <div className="skeleton" style={{ height: 280, borderRadius: 8 }} />
          </div>
        </div>
      </div>
      <div className="col-12 col-xl-6 d-flex">
        <div className="card flex-fill">
          <div className="card-header">
            <div className="skeleton skeleton-line" style={{ width: 130 }} />
          </div>
          <div className="card-body p-3 py-2">
            <div className="skeleton skeleton-line mb-3" style={{ height: 16 }} />
            {Array.from({ length: RANKING_ROWS }, (_, index) => (
              <div className="d-flex align-items-center gap-3 mb-3" key={index}>
                <div className="skeleton skeleton-line" style={{ width: 32 }} />
                <div className="skeleton skeleton-line" style={{ width: 64 }} />
                <div className="skeleton skeleton-line" style={{ width: 64 }} />
                <div className="skeleton skeleton-line" style={{ width: 64 }} />
                <div className="skeleton skeleton-pill ms-auto" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default AnalyticsSkeleton;
