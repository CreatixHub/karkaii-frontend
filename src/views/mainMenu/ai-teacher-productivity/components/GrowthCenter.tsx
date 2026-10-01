import { growthBadges } from '../data/productivity.data';

const GrowthCenter = () => (
  <div className="row g-4 mb-5">
    {growthBadges.map((badge) => (
      <div className="col-xl-3 col-md-6" key={badge.id}>
        <div className="tch-badge">
          <span className={`tch-medal ${badge.tone}`}>
            <i className={badge.icon} />
          </span>
          <span className="tch-badge-fig">{badge.figure}</span>
          <p className="tch-badge-title">{badge.title}</p>
          <p className="fs-12 text-muted mb-0">{badge.caption}</p>
        </div>
      </div>
    ))}
  </div>
);

export default GrowthCenter;
