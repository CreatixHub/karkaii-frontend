import { achievementBadges } from '../data/parentDashboard.data';
import PortalSection from './PortalSection';

const AchievementGallery = () => (
  <>
    <PortalSection icon="ti ti-trophy" eyebrow="Recognition" title="Achievement Gallery">
      <span className="portal-sub">Hover to reveal</span>
    </PortalSection>

    <div className="card card-flush">
      <div className="card-body">
        <div className="achievement-badges">
          {achievementBadges.map((badge) => (
            <div className={`achievement-badge ${badge.accent} position-relative text-center overflow-hidden`} key={badge.id}>
              <span className="avatar avatar-icon avatar-48 avatar-rounded avatar-glyph-24 avatar-medal d-flex mx-auto mb-2">
                <i className={badge.icon} />
              </span>
              <b>{badge.title}</b>
              <span>{badge.subtitle}</span>
              <div className="achievement-reveal position-absolute d-flex flex-column align-items-center justify-content-center">
                <b>{badge.revealTitle}</b>
                <span>{badge.revealDetail}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </>
);

export default AchievementGallery;
