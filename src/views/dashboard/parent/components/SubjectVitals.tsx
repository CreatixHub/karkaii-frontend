import { useState } from 'react';
import { subjectBlocks } from '../data/parentDashboard.data';
import PortalSection from './PortalSection';

export interface SubjectVitalsProps {
  childName: string;
}

const SubjectVitals = ({ childName }: SubjectVitalsProps) => {
  const [expanded, setExpanded] = useState<string | null>(null);

  const toggle = (id: string) =>
    setExpanded((current) => (current === id ? null : id));

  return (
    <>
      <PortalSection
        icon="ti ti-heartbeat"
        eyebrow={`${childName} · Academic Health`}
        title="Subject Vitals"
      >
        <span className="portal-sub">Tap a card to expand</span>
      </PortalSection>

      <div className="parent-subject-list">
        {subjectBlocks.map((subject) => {
          const isOpen = expanded === subject.id;

          return (
            <div
              key={subject.id}
              className={`subject-block overflow-hidden ${subject.accent}${isOpen ? ' expanded' : ''}`}
              role="button"
              tabIndex={0}
              aria-expanded={isOpen}
              onClick={(event) => {
                // Links and buttons inside the card keep their own behaviour.
                if ((event.target as HTMLElement).closest('a,button')) return;
                toggle(subject.id);
              }}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  toggle(subject.id);
                }
              }}
            >
              <div className="subject-head">
                <span className="avatar avatar-icon avatar-34 avatar-glyph-17 avatar-accent-soft d-flex">
                  <i className={subject.icon} />
                </span>
                <div className="subject-name">{subject.name}</div>
                <div className="subject-row d-flex align-items-center justify-content-between">
                  <span className="grade-mark">{subject.grade}</span>
                  <svg
                    className="sparkline-chart"
                    viewBox="0 0 54 22"
                    preserveAspectRatio="none"
                    aria-hidden="true"
                  >
                    <path className="sparkline-line" d={subject.sparkline} />
                  </svg>
                </div>
                <div className="trend-figure mt-1 d-inline-flex align-items-center">
                  <i className={subject.trendIcon} />
                  {subject.trend}
                </div>
              </div>

              <div className="subject-more overflow-hidden">
                <div className="subject-more-inner d-flex flex-column">
                  {subject.metrics.map((metric) => (
                    <div className="subject-metric justify-content-between" key={metric.label}>
                      <span className="subject-metric-label">
                        <i className={metric.icon} />
                        {metric.label}
                      </span>
                      <span className="subject-metric-value">{metric.value}</span>
                    </div>
                  ))}
                  <div className="feedback-note">
                    <b>Feedback:</b> {subject.feedback}
                  </div>
                  <div className="feedback-note feedback-note-accent">
                    <b>AI:</b> {subject.aiNote}
                  </div>
                </div>
              </div>

              <div className="subject-toggle d-flex align-items-center justify-content-center">
                <span>More</span>
                <i className="ti ti-chevron-down" />
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default SubjectVitals;
