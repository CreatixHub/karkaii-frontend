import type { SummaryCard } from '../data/parentsList.data';
import { summaryCards } from '../data/parentsList.data';

export interface SummaryStripProps {
  selectedCount: number;
  filteredCount: number;
}

const valueFor = (card: SummaryCard, selectedCount: number, filteredCount: number) => {
  if (card.id === 'selected') return String(selectedCount);
  if (card.id === 'filtered') return String(filteredCount);
  return card.value;
};

const SummaryStrip = ({ selectedCount, filteredCount }: SummaryStripProps) => (
  <div className="summary-strip">
    {summaryCards.map((card) => (
      <div className={`summary-card ${card.accent}`} key={card.id}>
        <span className="summary-card-icon">
          <i className={card.icon} />
        </span>
        <div className="summary-card-value">{valueFor(card, selectedCount, filteredCount)}</div>
        <p className="summary-card-label">{card.label}</p>
        {card.spark ? (
          <div className="summary-card-spark">
            {card.spark.map((height, index) => (
              <span style={{ height: `${height}%` }} key={index} />
            ))}
          </div>
        ) : null}
      </div>
    ))}
  </div>
);

export default SummaryStrip;
