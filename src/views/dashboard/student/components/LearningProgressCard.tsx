import WidgetHeader from '../../shared/WidgetHeader';
import {
  learningProgress,
  streakTiles,
  studyStreak,
} from '../data/studentDashboard.data';

const LearningProgressCard = () => (
  <div className="card-widget card-widget-body h-100">
    <WidgetHeader icon="ti ti-progress" title="Learning Progress">
      <span className="badge badge-soft-success">
        <i className="ti ti-flame me-1" />
        14-day streak
      </span>
    </WidgetHeader>

    <div className="progress-list mb-3 d-flex flex-column">
      {learningProgress.map((item) => (
        <div className="progress-list-item" key={item.id}>
          <div className="top">
            <span>
              <span className={`ic ${item.iconClass}`}>
                <i className={item.icon} />
              </span>
              {item.label}
            </span>
            <b>{item.value}</b>
          </div>
          <div className="progress progress-sm">
            <div className={`progress-bar ${item.barClass}`} style={{ width: item.width }} />
          </div>
        </div>
      ))}
    </div>

    <h6 className="widget-subtitle mb-2">
      <i className="ti ti-flame me-1" />
      Study Streak (last 14 days)
    </h6>
    <div className="streak-list d-flex flex-wrap">
      {studyStreak.map((studied, index) => (
        <span
          key={index}
          className={studied ? 'bg-success text-white' : undefined}
        >
          {studied ? <i className="ti ti-check" /> : null}
        </span>
      ))}
    </div>

    <div className="row g-2 mt-3">
      {streakTiles.map((tile) => (
        <div className="col-4" key={tile.id}>
          <div className={`metric-tile metric-tile-sm ${tile.borderClass}`}>
            <div className="metric-tile-value">{tile.value}</div>
            <div className="metric-tile-label">{tile.label}</div>
          </div>
        </div>
      ))}
    </div>

    <div className="insight-note bg-success-transparent mt-3">
      <i className="ti ti-trending-up text-success" />
      <span>
        You studied <b>18% more</b> than last week. Keep the streak alive — 16 more days
        unlocks the 30-day badge.
      </span>
    </div>
  </div>
);

export default LearningProgressCard;
