import ImageWithBasePath from '@core/common/imageWithBasePath';
import type { SpotlightCardData } from '../data/adminDashboard.data';

export interface SpotlightCardProps {
  data: SpotlightCardData;
}

const SpotlightCard = ({ data }: SpotlightCardProps) => (
  <div className={`card spotlight-card ${data.variant} flex-fill mb-4 p-3 d-flex flex-column`}>
    <div className="d-flex align-items-start justify-content-between">
      <span className={`badge ${data.badgeClass}`}>
        <i className={`${data.badgeIcon} me-1`} />
        {data.badgeLabel}
      </span>
      <span className="chip chip-warning">
        {Array.from({ length: data.stars }, (_, index) => (
          <i className="ti ti-star-filled" key={index} />
        ))}
        {data.halfStar ? <i className="ti ti-star-half-filled" /> : null}
      </span>
    </div>

    <div className="mt-2">
      <h4 className="mb-1 text-white fw-bold">{data.name}</h4>
      <p className="text-white opacity-75 fs-13">
        <i className={`${data.subtitleIcon} me-1`} />
        {data.subtitle}
      </p>
      <span className="chip chip-soft chip-on-media chip-lg">
        <i className={data.achievementIcon} />
        {data.achievement}
      </span>
    </div>

    <div className="d-flex align-items-end justify-content-between mt-auto">
      <div className="d-flex gap-2">
        {data.stats.map((stat) => (
          <div className="stat-tile stat-tile-on-media text-white text-center" key={stat.label}>
            <h5 className="mb-0 text-white fw-bold">{stat.value}</h5>
            <span className="fs-11 opacity-75">{stat.label}</span>
          </div>
        ))}
      </div>
      <ImageWithBasePath src={data.image} alt={data.name} className="spotlight-img" />
    </div>
  </div>
);

export default SpotlightCard;
