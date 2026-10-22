import { activityTimeline } from '../data/teacherDashboard.data';
import WidgetHeader from '../../shared/WidgetHeader';

const ActivityTimelineCard = () => (
  <div className="card-widget card-widget-body h-100 pb-2">
    <WidgetHeader icon="ti ti-timeline" title="Activity Timeline" />
    <div className="timeline-list position-relative">
      {activityTimeline.map((entry) => (
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
  </div>
);

export default ActivityTimelineCard;
