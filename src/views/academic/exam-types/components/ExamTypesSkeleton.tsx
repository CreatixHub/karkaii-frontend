const CARD_COUNT = 12;
const QUICK_CHIPS = 6;
const ICON_BUTTONS = 5;

const SkeletonCard = () => (
  <div className="col-12 col-xxl-3 col-xl-4 col-md-6 d-flex">
    <div className="card flex-fill">
      <div className="card-body">
        <div className="d-flex align-items-start justify-content-between mb-3">
          <div className="d-flex align-items-center gap-2">
            <div className="skeleton skeleton-avatar" />
            <div className="skeleton-stack d-flex flex-column gap-2">
              <div className="skeleton skeleton-line" style={{ width: 110 }} />
              <div className="skeleton skeleton-line skeleton-thin" style={{ width: 140 }} />
            </div>
          </div>
          <div className="skeleton skeleton-line" style={{ width: 18 }} />
        </div>

        <div className="skeleton skeleton-line skeleton-thin mb-3" style={{ width: 150 }} />

        <div className="border rounded p-2 mb-3">
          <div className="row g-0 text-center">
            {Array.from({ length: 3 }, (_, index) => (
              <div className={index === 2 ? 'col-4' : 'col-4 border-end'} key={index}>
                <div className="d-flex flex-column align-items-center gap-2">
                  <div className="skeleton skeleton-line skeleton-thin" style={{ width: 42 }} />
                  <div className="skeleton skeleton-line" style={{ width: 30 }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="d-flex align-items-center justify-content-between mb-2">
          <div className="skeleton skeleton-line skeleton-thin" style={{ width: 66 }} />
          <div className="skeleton skeleton-line skeleton-thin" style={{ width: 32 }} />
        </div>
        <div className="skeleton" style={{ height: 6, borderRadius: 999 }} />
      </div>
    </div>
  </div>
);

const ExamTypesSkeleton = () => (
  <div className="skeleton-loader" aria-hidden="true">
    <div className="card">
      <div className="card-header border-bottom">
        <div className="d-flex align-items-center flex-wrap gap-2">
          <div className="skeleton" style={{ height: 34, width: 250, borderRadius: 8 }} />
          {Array.from({ length: 3 }, (_, index) => (
            <div className="skeleton skeleton-btn" style={{ height: 34, width: 112 }} key={index} />
          ))}
          <span className="flex-grow-1" />
          {Array.from({ length: ICON_BUTTONS }, (_, index) => (
            <div className="skeleton" style={{ height: 34, width: 34, borderRadius: 8 }} key={index} />
          ))}
        </div>
        <div className="d-flex align-items-center flex-wrap gap-2 mt-3">
          {Array.from({ length: QUICK_CHIPS }, (_, index) => (
            <div className="skeleton skeleton-pill" style={{ height: 30, width: 104 }} key={index} />
          ))}
          <span className="flex-grow-1" />
          <div className="skeleton skeleton-btn" style={{ height: 32, width: 88 }} />
        </div>
      </div>
      <div className="card-footer border-top-0">
        <div className="skeleton skeleton-line skeleton-thin" style={{ width: 380 }} />
      </div>
    </div>

    <div className="d-flex align-items-center justify-content-between mb-3">
      <div className="d-flex flex-column gap-2">
        <div className="skeleton skeleton-line" style={{ width: 190 }} />
        <div className="skeleton skeleton-line skeleton-thin" style={{ width: 320 }} />
      </div>
      <div className="skeleton skeleton-line skeleton-thin d-none d-sm-block" style={{ width: 120 }} />
    </div>

    <div className="row">
      {Array.from({ length: CARD_COUNT }, (_, index) => (
        <SkeletonCard key={index} />
      ))}
    </div>
  </div>
);

export default ExamTypesSkeleton;
