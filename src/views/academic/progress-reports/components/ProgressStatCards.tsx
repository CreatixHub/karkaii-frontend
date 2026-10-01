import type { ProgressStatCard, StatCardId } from '../data/progressReports.data';

export interface ProgressStatCardsProps {
  cards: ProgressStatCard[];
  values: Record<StatCardId, number>;
}

const ProgressStatCards = ({ cards, values }: ProgressStatCardsProps) => (
  <div className="row">
    {cards.map((card) => (
      <div className="col-xl-3 col-sm-6 d-flex" key={card.id}>
        <div className="card flex-fill">
          <div className="card-body d-flex align-items-center justify-content-between">
            <div>
              <p className="mb-1">{card.label}</p>
              <h4 className="mb-0">{values[card.id].toLocaleString()}</h4>
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

export default ProgressStatCards;
