import { summaryCards } from '../data/teachers.data';

export interface SummaryStripProps {
  /** Keyed by `data-sum`; a missing key falls back to the template's figure. */
  values: Record<string, string>;
}

const SummaryStrip = ({ values }: SummaryStripProps) => (
  <div className="summary-strip">
    {summaryCards.map((card) => (
      <div className={`summary-card ${card.accent}`} data-sum={card.id} key={card.id}>
        <span className="summary-card-icon">
          <i className={card.icon} />
        </span>
        <div className="summary-card-value">{values[card.id] ?? card.value}</div>
        <p className="summary-card-label">{card.label}</p>
        {card.spark ? (
          <div className="summary-card-spark">
            {card.spark.map((height) => (
              <span style={{ height }} key={height} />
            ))}
          </div>
        ) : null}
      </div>
    ))}
  </div>
);

export default SummaryStrip;
