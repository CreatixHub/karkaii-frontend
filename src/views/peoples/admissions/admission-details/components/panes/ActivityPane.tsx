import { activityHistory } from '../../data/admissionDetails.data';

const ActivityPane = () => (
  <div>
    <h5 className="mb-3">Activity History</h5>
    <div className="activity-timeline">
      {activityHistory.map((entry, index) => (
        <div className="d-flex align-items-start" key={entry.title}>
          <span className={`avatar avatar-sm ${entry.iconAccent} flex-shrink-0 rounded-circle me-2`}>
            <i className={entry.icon} />
          </span>
          <div className={index === activityHistory.length - 1 ? 'ps-3 ms-2' : 'pb-3 border-start ps-3 ms-2'}>
            <h6 className="mb-1">{entry.title}</h6>
            <p className="text-muted mb-0 fs-12">{entry.meta}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default ActivityPane;
