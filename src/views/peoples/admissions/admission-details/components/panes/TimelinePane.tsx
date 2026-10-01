import { admissionTimeline } from '../../data/admissionDetails.data';

const toneClass: Record<string, string> = {
  success: 'bg-success text-white',
  primary: 'bg-primary text-white',
  pending: 'bg-light text-muted',
};

const TimelinePane = () => (
  <div>
    <h5 className="mb-3">Admission Timeline</h5>
    <div className="activity-timeline">
      {admissionTimeline.map((entry, index) => (
        <div className="d-flex align-items-start" key={entry.title}>
          <span className={`avatar avatar-sm ${toneClass[entry.tone]} flex-shrink-0 rounded-circle me-2`}>
            <i className={entry.icon} />
          </span>
          <div className={index === admissionTimeline.length - 1 ? 'ps-3 ms-2' : 'pb-3 border-start ps-3 ms-2'}>
            <h6 className={`mb-1${entry.tone === 'pending' ? ' text-muted' : ''}`}>{entry.title}</h6>
            <p className="text-muted mb-0 fs-12">{entry.meta}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default TimelinePane;
