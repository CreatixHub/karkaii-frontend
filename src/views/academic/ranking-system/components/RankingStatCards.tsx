import type { SummaryCard } from '../data/rankingSystem.data';

export interface RankingStatCardsProps {
  cards: SummaryCard[];
}

const RankingStatCards = ({ cards }: RankingStatCardsProps) => (
  <div className="row">
    {cards.map((card) => (
      <div className="col-xl-3 col-sm-6 d-flex" key={card.id}>
        <div className="card flex-fill">
          <div className="card-body d-flex align-items-center justify-content-between">
            <div>
              <p className="mb-1">{card.label}</p>
              <h4 className="mb-0">{card.value}</h4>
            </div>
            <span className={`avatar avatar-lg bg-${card.tone}-transparent text-${card.tone} rounded`}>
              <i className={`${card.icon} fs-24`} />
            </span>
          </div>
        </div>
      </div>
    ))}
  </div>
);

export default RankingStatCards;
