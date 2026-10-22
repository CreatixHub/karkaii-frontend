import type { LifecycleEntry } from '../data/student360.data';

export interface TimelinePaneProps {
  entries: LifecycleEntry[];
}

const TimelinePane = ({ entries }: TimelinePaneProps) => (
  <div className="tab-pane fade show active" id="s360-timeline">
    <h5 className="mb-3">Student Lifecycle</h5>
    <div className="activity-timeline">
      {entries.map((entry) => (
        <div className="d-flex align-items-start" key={entry.id}>
          <span
            className={`avatar avatar-sm ${entry.tint} flex-shrink-0 rounded-circle me-2 text-white`}
          >
            <i className={entry.icon} />
          </span>
          <div className={`${entry.last ? '' : 'pb-3 border-start '}ps-3 ms-2`}>
            <h6 className="mb-1">{entry.title}</h6>
            <p className="text-muted mb-0 fs-12">{entry.detail}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default TimelinePane;
