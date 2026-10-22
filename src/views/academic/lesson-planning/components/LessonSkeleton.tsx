const CARDS = 6;
const CHIPS = 3;

const rows = (count: number) => Array.from({ length: count }, (_, index) => index);

const LessonSkeleton = () => (
  <div className="skeleton-loader" aria-hidden="true">
    <div className="card">
      <div className="card-body">
        <div className="skeleton-toolbar">
          <div className="skeleton skeleton-search" />
          <div className="skeleton skeleton-btn" />
          <div className="skeleton skeleton-btn" />
          <div className="skeleton skeleton-btn ms-auto" />
          <div className="skeleton skeleton-ico" />
          <div className="skeleton skeleton-ico" />
        </div>
        <div className="skeleton-quick">
          {rows(CHIPS).map((index) => (
            <div className="skeleton skeleton-chip" key={index} />
          ))}
        </div>
      </div>
    </div>

    <div className="row">
      {rows(CARDS).map((index) => (
        <div className="col-12 col-xl-4 col-md-6" key={index}>
          <div className="card">
            <div className="card-body">
              <div className="d-flex align-items-center gap-3 mb-3">
                <div className="skeleton skeleton-avatar" />
                <div className="flex-grow-1">
                  <div className="skeleton skeleton-line mb-2" style={{ width: '70%' }} />
                  <div className="skeleton skeleton-line skeleton-thin" style={{ width: '50%' }} />
                </div>
                <div className="skeleton skeleton-pill" />
              </div>
              <div className="skeleton skeleton-line mb-2" />
              <div className="skeleton skeleton-line skeleton-thin mb-3" style={{ width: '85%' }} />
              <div className="skeleton skeleton-block mb-3" />
              <div className="d-flex gap-2">
                <div className="skeleton skeleton-btn flex-fill" />
                <div className="skeleton skeleton-btn flex-fill" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default LessonSkeleton;
