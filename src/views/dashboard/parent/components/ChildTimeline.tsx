import { childTimeline } from '../data/parentDashboard.data';
import PortalSection from './PortalSection';

export interface ChildTimelineProps {
  childName: string;
}

const ChildTimeline = ({ childName }: ChildTimelineProps) => (
  <>
    <PortalSection
      icon="ti ti-timeline"
      eyebrow="Today"
      title={`${childName}'s Timeline`}
    >
      <span className="parent-live-flag">LIVE</span>
    </PortalSection>

    <div className="card card-flush">
      <div className="card-body">
        <div className="portal-timeline-track position-relative">
          {childTimeline.map((entry) => (
            <div
              className={`portal-timeline ${entry.accent}${entry.live ? ' live' : ''} position-relative`}
              key={entry.id}
            >
              <div className="portal-timeline-time text-end">
                {entry.time}
                <small>{entry.period}</small>
              </div>
              <div className="portal-timeline-body position-relative">
                <span className="portal-timeline-dot position-absolute" />
                <b>{entry.title}</b>
                <p>{entry.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </>
);

export default ChildTimeline;
