const SELECTION_FIELDS = 5;
const DETAIL_ROWS = 8;
const SCHEDULE_ROWS = 5;
const SIDEBAR_ROWS = 7;
const ACTION_BUTTONS = 5;

const rows = (count: number) => Array.from({ length: count }, (_, index) => index);

const AdmitCardSkeleton = () => (
  <div className="skeleton-loader" aria-hidden="true">
    {/* Toolbar */}
    <div className="card">
      <div className="card-body">
        <div className="skeleton-toolbar">
          <div className="skeleton skeleton-search" />
          <div className="skeleton skeleton-btn" />
          <div className="skeleton skeleton-btn" />
          <div className="skeleton skeleton-btn ms-auto" />
          <div className="skeleton skeleton-btn" />
          <div className="skeleton skeleton-ico" />
          <div className="skeleton skeleton-ico" />
        </div>
        <div className="skeleton-quick">
          {rows(5).map((index) => (
            <div className="skeleton skeleton-chip" key={index} />
          ))}
        </div>
      </div>
    </div>

    {/* Student & exam selection */}
    <div className="card">
      <div className="card-body">
        <div className="row g-3">
          {rows(SELECTION_FIELDS).map((index) => (
            <div className="col-xxl-2 col-lg-4 col-sm-6" key={index}>
              <div className="skeleton skeleton-line skeleton-thin mb-2" style={{ width: '55%' }} />
              <div className="skeleton skeleton-btn" style={{ width: '100%' }} />
            </div>
          ))}
        </div>
      </div>
    </div>

    <div className="row g-3">
      {/* The card document */}
      <div className="col-12 col-xxl-8 col-xl-7">
        <div className="card">
          <div className="card-body">
            <div className="d-flex align-items-center gap-3 mb-3">
              <div className="skeleton skeleton-round" />
              <div className="flex-grow-1">
                <div className="skeleton skeleton-line mb-2" style={{ width: '240px' }} />
                <div className="skeleton skeleton-line skeleton-thin" style={{ width: '320px' }} />
              </div>
              <div className="skeleton skeleton-pill" />
            </div>

            <div className="row g-3 mb-3">
              <div className="col-12 col-lg-8">
                {rows(DETAIL_ROWS).map((index) => (
                  <div className="skeleton skeleton-line mb-2" key={index} />
                ))}
              </div>
              <div className="col-12 col-lg-4">
                <div className="skeleton skeleton-photo mb-3" />
                <div className="skeleton skeleton-card" />
              </div>
            </div>

            <div className="skeleton skeleton-block mb-3" />

            {rows(SCHEDULE_ROWS).map((index) => (
              <div className="skeleton skeleton-line mb-2" key={index} />
            ))}

            <div className="skeleton-split">
              <div className="skeleton skeleton-tline" />
              <div className="skeleton skeleton-tline" />
            </div>
          </div>
        </div>
      </div>

      {/* Student information and quick actions */}
      <div className="col-12 col-xxl-4 col-xl-5">
        <div className="card">
          <div className="card-body">
            <div className="d-flex align-items-center gap-3 mb-3">
              <div className="skeleton skeleton-avatar" />
              <div className="flex-grow-1">
                <div className="skeleton skeleton-line mb-2" style={{ width: '60%' }} />
                <div className="skeleton skeleton-line skeleton-thin" style={{ width: '80%' }} />
              </div>
            </div>
            {rows(SIDEBAR_ROWS).map((index) => (
              <div className="skeleton skeleton-line mb-2" key={index} />
            ))}
          </div>
        </div>
        <div className="card">
          <div className="card-body">
            <div className="d-flex flex-wrap gap-2">
              {rows(ACTION_BUTTONS).map((index) => (
                <div className="skeleton skeleton-btn" key={index} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default AdmitCardSkeleton;
