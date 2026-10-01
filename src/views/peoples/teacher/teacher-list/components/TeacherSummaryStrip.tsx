import type { SummaryCard } from '../data/teacherWorkspace.data';
import { summaryCards } from '../data/teacherWorkspace.data';

export interface TeacherSummaryStripProps {
  /** Live values keyed by the card's `data-sum` attribute. */
  values: Record<string, number>;
}

const valueOf = (card: SummaryCard, values: Record<string, number>) =>
  card.id in values ? values[card.id] : card.value;

const TeacherSummaryStrip = ({ values }: TeacherSummaryStripProps) => (
  <div className="summary-strip">
    {summaryCards.map((card) => (
      <div className={`summary-card ${card.accent}`} data-sum={card.id} key={card.id}>
        <span className="summary-card-icon">
          <i className={card.icon} />
        </span>
        <div className="summary-card-value">{valueOf(card, values)}</div>
        <p className="summary-card-label">{card.label}</p>
        {card.spark ? (
          <div className="summary-card-spark">
            {card.spark.map((height, index) => (
              <span style={{ height }} key={`${height}-${index}`} />
            ))}
          </div>
        ) : null}
      </div>
    ))}
  </div>
);

export default TeacherSummaryStrip;
