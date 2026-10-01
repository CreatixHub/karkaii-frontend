import { dimensionCards } from '../data/productivity.data';

const IntelligenceCenter = () => (
  <div className="row g-4 mb-5">
    {dimensionCards.map((card) => (
      <div className="col-xl-4 col-md-6" key={card.id}>
        <div className="tch-facet-card">
          <span className={`tch-ring ${card.tone} aix-p-${card.score}`}>
            <i className={card.icon} />
          </span>
          <p className="tch-facet-title">{card.title}</p>

          <div className="tch-mini">
            <span>AI finding</span>
            <span>{card.finding}</span>
          </div>
          <div className="tch-mini">
            <span>Improvement suggestion</span>
            <span>{card.suggestion}</span>
          </div>
          <div className="tch-mini">
            <span>Teaching impact</span>
            <span>{card.impact}</span>
          </div>
          <div className="tch-mini mb-0">
            <span>Expected outcome</span>
            <span className="fw-medium">{card.outcome}</span>
          </div>
        </div>
      </div>
    ))}
  </div>
);

export default IntelligenceCenter;
