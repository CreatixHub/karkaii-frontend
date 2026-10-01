import { summaryCards } from '../data/studentPerformance.data';

const SummaryStrip = () => (
  <div className="summary-strip">
    {summaryCards.map((card) => (
      <div className={`summary-card ${card.accent}`} key={card.id}>
        <span className="summary-card-icon">
          <i className={card.icon} />
        </span>
        <div className="summary-card-value">{card.value}</div>
        <p className="summary-card-label">{card.label}</p>
      </div>
    ))}
  </div>
);

export default SummaryStrip;
