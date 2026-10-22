const DAYS = 6;
const SLOTS = 4;

const TimetableSkeleton = () => (
  <div className="skeleton-loader" aria-hidden="true">
    <div className="skeleton-head">
      <div className="skeleton-toolbar">
        <div className="skeleton skeleton-search" />
        <div className="skeleton skeleton-btn" />
        <div className="skeleton skeleton-btn" />
        <div className="skeleton skeleton-density ms-auto" />
        <div className="skeleton skeleton-ico" />
        <div className="skeleton skeleton-ico" />
      </div>
    </div>
    <div className="skeleton-body d-flex gap-2">
      {Array.from({ length: DAYS }, (_, day) => (
        <div className="flex-fill" key={day}>
          <div className="skeleton skeleton-head mb-2" />
          {Array.from({ length: SLOTS }, (_, index) => (
            <div className="skeleton-stack mb-2" key={index}>
              <div className="skeleton skeleton-line" />
              <div className="skeleton skeleton-line skeleton-thin" />
              <div className="skeleton skeleton-pill" />
            </div>
          ))}
        </div>
      ))}
    </div>
  </div>
);

export default TimetableSkeleton;
