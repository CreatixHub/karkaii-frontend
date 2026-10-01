import type { InsightSegment } from '../data/attendanceAnalytics.data';
import { insightCards } from '../data/attendanceAnalytics.data';

const renderSegments = (segments: InsightSegment[]) =>
  segments.map((segment, index) =>
    typeof segment === 'string' ? (
      <span key={index}>{segment}</span>
    ) : (
      <b key={index}>{segment.bold}</b>
    ),
  );

export interface AttendanceInsightsProps {
  onAction: (value: string) => void;
  onOpenModal: (value: string) => void;
}

const AttendanceInsights = ({ onAction, onOpenModal }: AttendanceInsightsProps) => (
  <>
    <div className="section-bar">
      <div>
        <span className="eyebrow-text">
          <i className="ti ti-sparkles" />
          Predictive
        </span>
        <h3 className="section-bar-title">AI Attendance Insights</h3>
      </div>
      <span className="status-chip is-violet">
        <i className="ti ti-robot" />
        Preskool AI
      </span>
    </div>

    <div className="row g-3 mb-3">
      {insightCards.map((card) => (
        <div className="col-xl-4 col-md-6" key={card.id}>
          <article className={`insight-row is-${card.variant} h-100`}>
            <header>
              <span className="ic">
                <i className={card.icon} />
              </span>
              <b>{card.title}</b>
              <span className={`status-chip is-${card.badgeVariant}`}>{card.badge}</span>
            </header>
            <p>{renderSegments(card.paragraph)}</p>
            <div className="confidence-meter">
              <span className="tr">
                <span style={{ width: `${card.confidence}%` }} />
              </span>
              <b>{card.confidence}%</b>
            </div>
            <footer>
              <span className="sub-text">{card.footerNote}</span>
              <button
                type="button"
                className="toolbar-button toolbar-button-xs"
                onClick={() =>
                  card.footerButton.kind === 'modal'
                    ? onOpenModal(card.footerButton.value)
                    : onAction(card.footerButton.value)
                }
              >
                {card.footerButton.label}
              </button>
            </footer>
          </article>
        </div>
      ))}
    </div>
  </>
);

export default AttendanceInsights;
