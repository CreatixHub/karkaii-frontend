const SCOPE_FIELDS = 4;
const DETAIL_ROWS = 5;
const MARK_ROWS = 6;
const SUBJECT_ROWS = 6;

const rows = (count: number) => Array.from({ length: count }, (_, index) => index);

const ReportCardsSkeleton = () => (
  <div className="skeleton-loader" aria-hidden="true">
    {/* Selection toolbar */}
    <div className="card">
      <div className="card-body">
        <div className="row g-2 align-items-end">
          {rows(SCOPE_FIELDS).map((index) => (
            <div className="col-xxl-2 col-lg-4 col-sm-6" key={index}>
              <div className="skeleton skeleton-line skeleton-thin mb-2" style={{ width: '55%' }} />
              <div className="skeleton skeleton-btn" style={{ width: '100%' }} />
            </div>
          ))}
          <div className="col-xxl-4 col-lg-8">
            <div className="skeleton skeleton-line skeleton-thin mb-2" style={{ width: '30%' }} />
            <div className="skeleton skeleton-search" style={{ width: '100%' }} />
          </div>
        </div>
      </div>
    </div>

    <div className="row">
      {/* Student information */}
      <div className="col-xxl-3 col-xl-4">
        <div className="card">
          <div className="card-body">
            <div className="text-center pb-3 border-bottom">
              <div className="skeleton skeleton-photo mx-auto mb-2" />
              <div className="skeleton skeleton-line mx-auto mb-2" style={{ width: '55%' }} />
              <div className="skeleton skeleton-line skeleton-thin mx-auto" style={{ width: '70%' }} />
            </div>
          </div>
          <div className="card-body pt-0">
            {rows(DETAIL_ROWS).map((index) => (
              <div className="skeleton skeleton-line mb-2" key={index} />
            ))}
          </div>
        </div>
      </div>

      {/* The printable document */}
      <div className="col-xxl-9 col-xl-8 d-flex">
        <div className="card flex-fill">
          <div className="card-body">
            <div className="d-flex align-items-center gap-3 mb-3">
              <div className="skeleton skeleton-round" />
              <div className="flex-grow-1">
                <div className="skeleton skeleton-line mb-2" style={{ width: '240px' }} />
                <div className="skeleton skeleton-line skeleton-thin" style={{ width: '320px' }} />
              </div>
              <div className="skeleton skeleton-pill" />
            </div>

            <div className="skeleton skeleton-block mb-3" />

            {rows(MARK_ROWS).map((index) => (
              <div className="skeleton skeleton-line mb-2" key={index} />
            ))}

            <div className="skeleton-split">
              <div className="skeleton skeleton-tline" />
              <div className="skeleton skeleton-tline" />
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Subject performance */}
    <div className="card">
      <div className="card-body">
        {rows(SUBJECT_ROWS).map((index) => (
          <div className="skeleton skeleton-line mb-2" key={index} />
        ))}
      </div>
    </div>
  </div>
);

export default ReportCardsSkeleton;
