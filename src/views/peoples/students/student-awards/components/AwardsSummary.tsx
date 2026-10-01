import type { SummaryTile } from '../data/awardsWorkspace.data';

export interface AwardsSummaryProps {
  tiles: SummaryTile[];
}

const AwardsSummary = ({ tiles }: AwardsSummaryProps) => (
  <div className="card">
    <div className="card-body">
      <div className="d-flex align-items-center flex-wrap gap-3">
        {tiles.map((tile, index) => (
          <Tile key={tile.id} tile={tile} divider={index > 0} />
        ))}
      </div>
    </div>
  </div>
);

const Tile = ({ tile, divider }: { tile: SummaryTile; divider: boolean }) => (
  <>
    {divider ? <div className="vr d-none d-xl-block" /> : null}
    <div className="d-flex align-items-center flex-fill overflow-hidden">
      <span className={`avatar avatar-md ${tile.tint} rounded flex-shrink-0`}>
        <i className={tile.icon} />
      </span>
      <div className="ms-2 overflow-hidden">
        <span className="fs-12 text-muted d-block text-truncate">{tile.label}</span>
        {tile.heading === 'h4' ? (
          <h4 className="fs-16 mb-0 fw-medium">{tile.value}</h4>
        ) : tile.heading === 'h5' ? (
          <h5 className="fs-16 mb-0">{tile.value}</h5>
        ) : (
          <h6 className="fs-16 mb-0">{tile.value}</h6>
        )}
        <span className="fs-12 text-muted d-block text-truncate">{tile.note}</span>
      </div>
    </div>
  </>
);

export default AwardsSummary;
