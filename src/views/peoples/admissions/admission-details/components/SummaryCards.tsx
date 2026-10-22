import ImageWithBasePath from '@core/common/imageWithBasePath';
import type { SummaryCard } from '../data/admissionDetails.data';
import { summaryCards } from '../data/admissionDetails.data';

const Tile = ({ card }: { card: SummaryCard }) => (
  <div className="col-xl-2 col-md-4 col-sm-6 d-flex">
    <div className="card card-hover w-100 mb-0">
      <div className="card-body p-3">
        {card.avatar ? (
          <span className="avatar avatar-md rounded-circle flex-shrink-0 mb-2">
            <ImageWithBasePath src={card.avatar} className="rounded-circle flex-shrink-0" alt={card.value} />
          </span>
        ) : (
          <span className={`avatar avatar-md ${card.accent} rounded-circle flex-shrink-0 mb-2`}>
            <i className={`${card.icon} fs-20`} />
          </span>
        )}
        <p className="mb-1 text-muted fs-12">{card.label}</p>
        {card.kind === 'badge' ? (
          <span className={`badge ${card.valueClassName} d-inline-flex align-items-center`}>
            <i className="ti ti-circle-filled fs-5 me-1" />
            {card.value}
          </span>
        ) : (
          <h6 className="mb-0">{card.value}</h6>
        )}
      </div>
    </div>
  </div>
);

const SummaryCards = () => (
  <div className="row g-3 mb-3">
    {summaryCards.map((card) => (
      <Tile card={card} key={card.id} />
    ))}
  </div>
);

export default SummaryCards;
