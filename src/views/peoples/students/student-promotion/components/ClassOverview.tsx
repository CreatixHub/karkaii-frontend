import type { OverviewBlock } from '../data/studentPromotion.data';

export interface ClassOverviewProps {
  blocks: OverviewBlock[];
  readinessScore: number;
  readinessText: string;
  revealed: boolean;
}

const ClassOverview = ({ blocks, readinessScore, readinessText, revealed }: ClassOverviewProps) => (
  <div className="panel-block panel-block-body mb-3">
    <div className="tile-head mb-3">
      <h6 className="heading-row mb-0">
        <i className="ti ti-layout-grid" />
        Class Overview
      </h6>
      <span className="pill-tag eligible">
        <i className="ti ti-arrow-right" />
        Grade III-A &rarr; Grade IV
      </span>
    </div>
    <div className="overview-grid mb-3">
      {blocks.map((block) => (
        <div className={`overview-block ${block.tone}`} key={block.id}>
          <span className="ic">
            <i className={block.icon} />
          </span>
          <div className="tx">
            <b>{block.value}</b>
            <span>{block.label}</span>
          </div>
        </div>
      ))}
    </div>
    <div className="readiness">
      <div className="ring-graph" style={{ '--v': revealed ? readinessScore : 0 } as React.CSSProperties}>
        <div className="ring-hole">
          <span>{revealed ? readinessScore : 0}</span>
        </div>
      </div>
      <div className="readiness-text">
        <b>Promotion Readiness Score</b>
        <p>{readinessText}</p>
      </div>
    </div>
  </div>
);

export default ClassOverview;
