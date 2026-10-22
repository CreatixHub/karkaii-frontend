import { timelineItems } from '../../data/alumniProfile.data';

const TimelinePane = () => (
  <div>
    <h5 className="mb-3">Timeline</h5>
    <div className="activity-timeline">
      {timelineItems.map((item, index) => (
        <div className="d-flex align-items-start" key={item.title}>
          <span className={`avatar avatar-sm ${item.bg} flex-shrink-0 rounded-circle me-2 text-white`}>
            <i className={item.icon} />
          </span>
          <div className={index < timelineItems.length - 1 ? 'pb-3 border-start ps-3 ms-2' : 'ps-3 ms-2'}>
            <h6 className="mb-1">{item.title}</h6>
            <p className="text-muted mb-0 fs-12">{item.when}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default TimelinePane;
