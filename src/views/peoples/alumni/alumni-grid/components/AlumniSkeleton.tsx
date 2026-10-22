const TileSkeleton = () => (
  <div className="col-12 col-xxl-4 col-xl-6 d-flex">
    <div className="tile w-100">
      <div className="d-flex align-items-center gap-2 mb-3">
        <span className="skeleton skeleton-avatar skeleton-round" />
        <div className="flex-fill">
          <div className="skeleton skeleton-line w-75 mb-2" />
          <div className="skeleton skeleton-line w-50" />
        </div>
      </div>
      <div className="skeleton skeleton-line w-100 mb-2" />
      <div className="skeleton skeleton-line w-100 mb-2" />
      <div className="skeleton skeleton-line w-75" />
    </div>
  </div>
);

const AlumniSkeleton = () => (
  <div className="skeleton-loader" aria-hidden="true">
    <div className="row g-3 mb-4">
      {[0, 1, 2, 3, 4, 5].map((index) => (
        <TileSkeleton key={index} />
      ))}
    </div>
  </div>
);

export default AlumniSkeleton;
