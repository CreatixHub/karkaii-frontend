const SkeletonRow = () => (
  <div className="skeleton-row">
    <div className="skeleton skeleton-chev" />
    <div className="skeleton skeleton-check" />
    <div className="skeleton-cell">
      <div className="skeleton skeleton-avatar" />
      <div className="skeleton-stack">
        <div className="skeleton skeleton-line" />
        <div className="skeleton skeleton-line skeleton-thin" />
      </div>
    </div>
    <div className="skeleton-stack">
      <div className="skeleton skeleton-line" />
      <div className="skeleton skeleton-line skeleton-thin" />
    </div>
    <div className="skeleton-stack">
      <div className="skeleton skeleton-line" />
      <div className="skeleton skeleton-line skeleton-thin" />
    </div>
    <div className="skeleton skeleton-pill" />
    <div className="skeleton-actions">
      {[0, 1, 2, 3].map((index) => (
        <div className="skeleton skeleton-circle" key={index} />
      ))}
    </div>
  </div>
);

const StaffListSkeleton = () => (
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
        {[0, 1, 2, 3, 4].map((index) => (
          <div className="skeleton skeleton-chip" key={index} />
        ))}
      </div>
    </div>
    <div className="skeleton-body">
      <div className="skeleton-row skeleton-thead">
        <span />
        <div className="skeleton skeleton-check" />
        <div className="skeleton skeleton-head" />
        <div className="skeleton skeleton-head" />
        <div className="skeleton skeleton-head" />
        <div className="skeleton skeleton-head" />
        <div className="skeleton skeleton-head skeleton-head-end" />
      </div>
      {[0, 1, 2, 3, 4, 5].map((index) => (
        <SkeletonRow key={index} />
      ))}
    </div>
  </div>
);

export default StaffListSkeleton;
