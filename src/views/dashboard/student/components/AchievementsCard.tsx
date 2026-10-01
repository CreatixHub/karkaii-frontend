import InfoListRow from '../../shared/InfoListRow';
import WidgetHeader from '../../shared/WidgetHeader';
import {
  achievementTimeline,
  achievements,
  nextMilestones,
} from '../data/studentDashboard.data';

const AchievementsCard = () => (
  <div className="card-widget card-widget-body h-100">
    <WidgetHeader icon="ti ti-trophy" title="Achievements">
      <span className="badge badge-soft-warning">
        <i className="ti ti-star me-1" />
        Top Performer
      </span>
    </WidgetHeader>

    <div className="award-list mb-3">
      {achievements.map((award) => (
        <div className="award-item" key={award.id}>
          <span className={`award-icon ${award.iconClass}`}>
            <i className={award.icon} />
          </span>
          <b>{award.title}</b>
          <span>{award.detail}</span>
        </div>
      ))}
    </div>

    <h6 className="widget-subtitle mb-2">
      <i className="ti ti-sparkles me-1" />
      Recent Achievement Timeline
    </h6>
    <div className="timeline-list position-relative">
      {achievementTimeline.map((entry) => (
        <div className="timeline-item d-flex position-relative" key={entry.id}>
          <span className={`timeline-icon ${entry.iconClass} flex-shrink-0`}>
            <i className={entry.icon} />
          </span>
          <div className="timeline-body">
            <b>{entry.title}</b>
            <p>{entry.detail}</p>
          </div>
          <span className="timeline-time ms-auto">{entry.time}</span>
        </div>
      ))}
    </div>

    <h6 className="widget-subtitle mb-2 mt-3">
      <i className="ti ti-target me-1" />
      Next Milestones
    </h6>
    <div className="info-list d-flex flex-column">
      {nextMilestones.map((row) => (
        <InfoListRow row={row} key={row.id} small />
      ))}
    </div>
  </div>
);

export default AchievementsCard;
