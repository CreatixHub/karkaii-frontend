const SKELETON_ROWS = [0, 1, 2, 3, 4, 5];

export interface TeacherListSkeletonProps {
  /** False once the workspace has "loaded" — adds the template's `hidden`. */
  visible: boolean;
}

const TeacherListSkeleton = ({ visible }: TeacherListSkeletonProps) => (
  <div className={`skeleton-loader${visible ? '' : ' hidden'}`} aria-hidden="true">
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
        <div className="skeleton skeleton-chip" />
        <div className="skeleton skeleton-chip" />
        <div className="skeleton skeleton-chip" />
        <div className="skeleton skeleton-chip" />
        <div className="skeleton skeleton-chip" />
        <div className="skeleton skeleton-btn ms-auto" />
      </div>
    </div>
    <div className="skeleton-summary">
      <div className="skeleton skeleton-card" />
      <div className="skeleton skeleton-card" />
      <div className="skeleton skeleton-card" />
      <div className="skeleton skeleton-card" />
      <div className="skeleton skeleton-card" />
      <div className="skeleton skeleton-card" />
      <div className="skeleton skeleton-card" />
      <div className="skeleton skeleton-card" />
    </div>
    <div className="skeleton-body">
      <div className="skeleton-row skeleton-thead">
        <span />
        <div className="skeleton skeleton-check" />
        <div className="skeleton skeleton-head" />
        <div className="skeleton skeleton-head" />
        <div className="skeleton skeleton-head" />
        <div className="skeleton skeleton-head" />
        <div className="skeleton skeleton-head" />
        <div className="skeleton skeleton-head skeleton-head-end" />
      </div>
      {SKELETON_ROWS.map((row) => (
        <div className="skeleton-row" key={row}>
          <div className="skeleton skeleton-chev" />
          <div className="skeleton skeleton-check" />
          <div className="skeleton-cell">
            <div className="skeleton skeleton-avatar" />
            <div className="skeleton-stack">
              <div className="skeleton skeleton-line" />
              <div className="skeleton skeleton-line skeleton-thin" />
            </div>
          </div>
          <div className="skeleton skeleton-pill" />
          <div className="skeleton skeleton-line" />
          <div className="skeleton-cell">
            <div className="skeleton skeleton-avatar skeleton-round" />
            <div className="skeleton-stack">
              <div className="skeleton skeleton-line" />
              <div className="skeleton skeleton-line skeleton-thin" />
            </div>
          </div>
          <div className="skeleton skeleton-line" />
          <div className="skeleton-actions">
            <div className="skeleton skeleton-circle" />
            <div className="skeleton skeleton-circle" />
            <div className="skeleton skeleton-circle" />
            <div className="skeleton skeleton-circle" />
            <div className="skeleton skeleton-circle" />
          </div>
        </div>
      ))}
    </div>
    <div className="skeleton-foot">
      <div className="skeleton skeleton-line skeleton-foot-info" />
      <div className="skeleton skeleton-foot-size" />
      <div className="skeleton-pager">
        <div className="skeleton skeleton-page" />
        <div className="skeleton skeleton-page" />
        <div className="skeleton skeleton-page" />
        <div className="skeleton skeleton-page" />
        <div className="skeleton skeleton-page" />
        <div className="skeleton skeleton-page" />
        <div className="skeleton skeleton-page" />
        <div className="skeleton skeleton-page" />
      </div>
    </div>
  </div>
);

export default TeacherListSkeleton;
