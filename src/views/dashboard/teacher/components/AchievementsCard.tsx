import { achievements } from '../data/teacherDashboard.data';
import WidgetHeader from '../../shared/WidgetHeader';

const AchievementsCard = () => (
  <div className="card-widget card-widget-body h-100">
    <WidgetHeader icon="ti ti-medal" title="Achievements" />
    <div className="award-list">
      {achievements.map((award) => (
        <div className="award-item text-center" key={award.id}>
          <span className={`award-icon ${award.iconClass}`}>
            <i className={award.icon} />
          </span>
          <b>{award.title}</b>
          <span>{award.subtitle}</span>
        </div>
      ))}
    </div>
  </div>
);

export default AchievementsCard;
