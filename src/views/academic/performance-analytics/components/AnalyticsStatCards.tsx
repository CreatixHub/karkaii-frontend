import type { StatCard } from '../data/performanceAnalytics.data';

export interface AnalyticsStatCardsProps {
  cards: StatCard[];
}

const AnalyticsStatCards = ({ cards }: AnalyticsStatCardsProps) => (
  <div className="row g-3 mb-1">
    {cards.map((card) => (
      <div className="col-xxl-2 col-lg-4 col-sm-6 d-flex" key={card.id}>
        <div className={`card stat-card ${card.variant} w-100`}>
          <div className="card-body">
            <div className="d-flex align-items-start justify-content-between">
              <span className={`stat-icon ${card.iconClass}`}>
                <i className={card.icon} />
              </span>
              {card.badge ? (
                <span className={`badge ${card.badge.className} fs-11`}>{card.badge.label}</span>
              ) : null}
            </div>
            <h3 className="stat-value mt-3 mb-0">{card.value}</h3>
            <p className="mb-0 text-muted fs-13">{card.label}</p>
          </div>
        </div>
      </div>
    ))}
  </div>
);

export default AnalyticsStatCards;
