import type { AiAction, AiInsightCard } from '../data/studentPromotion.data';

export interface AiInsightsProps {
  cards: AiInsightCard[];
  actions: AiAction[];
  onAction: (action: string) => void;
}

const AiInsights = ({ cards, actions, onAction }: AiInsightsProps) => (
  <div className="panel-block panel-block-body promotion-ai mb-3 promotion-tone-purple">
    <div className="tile-head mb-3">
      <h6 className="heading-row mb-0">
        <i className="ti ti-sparkles" />
        AI Promotion Insights
      </h6>
      <span className="promotion-ai-badge">
        <i className="ti ti-robot" />
        Preskool AI
      </span>
    </div>
    <div className="promotion-ai-grid mb-3">
      {cards.map((card) => (
        <div className={`promotion-ai-card ${card.tone}`} key={card.id}>
          <span className="ic">
            <i className={card.icon} />
          </span>
          <div className="tx">
            <b>{card.title}</b>
            <p>{card.text}</p>
          </div>
        </div>
      ))}
    </div>
    <div className="promotion-ai-actions">
      {actions.map((action) => (
        <div className="promotion-ai-action" key={action.id}>
          <i className={action.icon} />
          {action.text}
          <button
            type="button"
            className={`promotion-button promotion-button-sm${action.primary ? ' promotion-button-primary' : ''}`}
            onClick={() => onAction(action.action)}
          >
            <i className={action.buttonIcon} />
            {action.buttonLabel}
          </button>
        </div>
      ))}
    </div>
  </div>
);

export default AiInsights;
