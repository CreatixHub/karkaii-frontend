import ImageWithBasePath from '@core/common/imageWithBasePath';
import { Counter, ProfileBar } from './primitives';
import type { ProfileAction } from '../data/studentProfileActions';
import { heroContacts, heroIdentity, heroRings } from '../data/studentProfile.data';

export interface ProfileHeroProps {
  revealed: boolean;
  onAction: (action: ProfileAction) => void;
}

const ProfileHero = ({ revealed, onAction }: ProfileHeroProps) => (
  <div className="card">
    <div className="card-body profile-hero accent-primary">
      <div className="hero-grid">
        <div className="hero-photo">
          <ImageWithBasePath src={heroIdentity.photo} alt={heroIdentity.name} />
          <span className="presence" title="Online" />
        </div>

        <div className="hero-id">
          <h2 className="hero-name justify-content-center justify-content-lg-start">
            {heroIdentity.name}{' '}
            <span className={`profile-badge ${heroIdentity.status.accent}`}>
              <span className="profile-dot" />
              {heroIdentity.status.label}
            </span>
          </h2>

          <div className="hero-meta">
            {heroIdentity.meta.map((item) => (
              <span key={item.label}>
                <i className={item.icon} />
                {item.label} <b>{item.value}</b>
              </span>
            ))}
          </div>

          <div className="badges">
            {heroIdentity.badges.map((badge) => (
              <span className={`profile-badge ${badge.accent}`} key={badge.label}>
                <i className={badge.icon} />
                {badge.label}
              </span>
            ))}
          </div>

          <div className="complete accent-success">
            <div className="complete-top">
              <span>Profile Completion</span>
              <b>
                <span>
                  <Counter value={heroIdentity.completion} suffix="%" revealed={revealed} />
                </span>
              </b>
            </div>
            <ProfileBar value={heroIdentity.completion} revealed={revealed} />
          </div>
        </div>

        <div className="hero-right">
          <div className="ring-group">
            {heroRings.map((ring) => (
              <div className={`profile-ring ${ring.accent}`} key={ring.id}>
                <div
                  className="ring-track"
                  style={{ ['--val' as string]: revealed ? ring.value : 0 }}
                >
                  <div className="profile-ring-hole">
                    <span>
                      <Counter value={ring.count} suffix={ring.suffix} revealed={revealed} />
                    </span>
                  </div>
                </div>
                <span className="ring-lbl">{ring.label}</span>
              </div>
            ))}
          </div>

          <div className="hero-side">
            <div className="qr-code" title="Student ID QR">
              <i className="ti ti-qrcode" />
            </div>
            <div className="contact-list">
              {heroContacts.map((contact) => (
                <button
                  type="button"
                  key={contact.id}
                  className={`profile-contact ${contact.className}`.trim()}
                  title={contact.title}
                  aria-label={contact.title}
                  onClick={() => onAction(contact.action)}
                >
                  <i className={contact.icon} />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default ProfileHero;
