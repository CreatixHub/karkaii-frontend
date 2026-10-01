import CountUp from 'react-countup';
import type { KpiTile } from '../data/studentPromotion.data';

export interface KpiSummaryProps {
  tiles: KpiTile[];
  revealed: boolean;
}

const KpiSummary = ({ tiles, revealed }: KpiSummaryProps) => (
  <div className="kpi-tiles mb-3">
    {tiles.map((tile) => (
      <div className={`kpi-tile ${tile.tone}`} key={tile.id}>
        <div className="kpi-tile-top">
          <span className="kpi-tile-icon">
            <i className={tile.icon} />
          </span>
          <div>
            <div className="kpi-tile-label">{tile.label}</div>
            <div className="kpi-tile-value">
              {tile.kind === 'year' ? (
                <>
                  {tile.text}
                  <small>{tile.yearSuffix}</small>
                </>
              ) : tile.kind === 'text' ? (
                tile.text
              ) : revealed ? (
                <CountUp
                  end={tile.count ?? 0}
                  decimals={String(tile.count).split('.')[1]?.length ?? 0}
                  duration={1.1}
                />
              ) : (
                0
              )}
              {tile.kind === 'count' && tile.suffix ? <small>{tile.suffix}</small> : null}
            </div>
          </div>
        </div>
        {tile.footSub || tile.delta ? (
          <div className="kpi-tile-foot">
            {tile.footSub ? <span className="sub-label">{tile.footSub}</span> : null}
            {tile.delta ? (
              <span className={`kpi-tile-delta ${tile.delta.tone}`}>
                <i className={tile.delta.icon} />
                {tile.delta.label}
              </span>
            ) : null}
          </div>
        ) : null}
        {typeof tile.barWidth === 'number' ? (
          <div className="kpi-tile-bar">
            <span style={{ width: revealed ? `${tile.barWidth}%` : 0 }} />
          </div>
        ) : null}
        {tile.sparkline ? (
          <svg className="spark-graph" viewBox="0 0 120 30" preserveAspectRatio="none">
            <path className="ar" d="M0,24 L20,20 L40,22 L60,14 L80,15 L100,8 L120,6 L120,30 L0,30 Z" />
            <path className="ln" d="M0,24 L20,20 L40,22 L60,14 L80,15 L100,8 L120,6" />
          </svg>
        ) : null}
      </div>
    ))}
  </div>
);

export default KpiSummary;
