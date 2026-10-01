import { Counter } from './primitives';
import { overviewTiles } from '../data/studentProfile.data';

const ExecutiveOverview = ({ revealed }: { revealed: boolean }) => (
  <div className="profile-overview-grid mb-3">
    {overviewTiles.map((tile) => (
      <div className={`profile-overview ${tile.accent}`} key={tile.id}>
        <div className="overview-head">
          <span className="avatar avatar-icon avatar-md avatar-accent">
            <i className={tile.icon} />
          </span>
          <span className="overview-lbl">{tile.label}</span>
        </div>
        <div className="overview-val">
          {tile.count !== undefined ? (
            <Counter value={tile.count} suffix={tile.suffix} revealed={revealed} />
          ) : (
            tile.value
          )}
        </div>
        <div className={`overview-sub ${tile.sub.className}`.trim()}>
          <i className={tile.sub.icon} />
          {tile.sub.text}
        </div>
      </div>
    ))}
  </div>
);

export default ExecutiveOverview;
