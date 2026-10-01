import ImageWithBasePath from '@core/common/imageWithBasePath';
import { ChipSet, MetaList } from './primitives';
import type { ProfileAction } from '../data/studentProfileActions';
import {
  address,
  aiInsights,
  hostelRows,
  languages,
  medicalDoctor,
  medicalNote,
  medicalRows,
  parentsAndGuardians,
  personalInformation,
  transportEta,
  transportRows,
} from '../data/studentProfile.data';

export interface ProfileSidebarProps {
  onAction: (action: ProfileAction) => void;
}

const ProfileSidebar = ({ onAction }: ProfileSidebarProps) => (
  <div className="col-xxl-4 col-xl-5">
    {/* Personal Information */}
    <div className="card">
      <div className="card-header">
        <h3 className="profile-card-title accent-primary fs-16 fw-medium">
          <span className="tab-icon">
            <i className="ti ti-user" />
          </span>
          Personal Information
        </h3>
      </div>
      <div className="card-body">
        <MetaList rows={personalInformation} />
        <div className="mt-3">
          <span className="meta-key text-uppercase" style={{ fontSize: 11, color: 'var(--sp-muted)' }}>
            Languages
          </span>
          <ChipSet chips={languages.map((label) => ({ label }))} className="mt-2" />
        </div>
        <div className="mt-3">
          <span className="meta-key text-uppercase" style={{ fontSize: 11, color: 'var(--sp-muted)' }}>
            Address
          </span>
          <p className="value mb-0 mt-1" style={{ fontWeight: 500 }}>
            {address}
          </p>
        </div>
      </div>
    </div>

    {/* Parent & Guardian */}
    <div className="card">
      <div className="card-header">
        <h4 className="profile-card-title accent-teal fs-16 fw-medium">
          <span className="tab-icon">
            <i className="ti ti-users" />
          </span>
          Parent &amp; Guardian
        </h4>
      </div>
      <div className="card-body">
        {parentsAndGuardians.map((person) => (
          <div className="profile-person" key={person.id}>
            {person.photo ? (
              <ImageWithBasePath src={person.photo} alt={person.name} />
            ) : (
              <span className="profile-contact" style={{ width: 46, height: 46, borderRadius: 12 }}>
                <i className={person.icon} />
              </span>
            )}
            <div>
              <div className="profile-person-name">{person.name}</div>
              {person.roles.map((role) => (
                <div className="person-role" key={role}>
                  {role}
                </div>
              ))}
            </div>
            {person.actions.length > 0 ? (
              <div className="person-actions">
                {person.actions.map((action) => (
                  <button
                    type="button"
                    key={action.id}
                    className={`profile-contact ${action.className}`.trim()}
                    title={action.title}
                    aria-label={action.title}
                    onClick={() => onAction(action.action as ProfileAction)}
                  >
                    <i className={action.icon} />
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </div>

    {/* Transport */}
    <div className="card">
      <div className="card-header">
        <h5 className="profile-card-title accent-info">
          <span className="tab-icon">
            <i className="ti ti-bus" />
          </span>
          Transport
        </h5>
      </div>
      <div className="card-body">
        <MetaList rows={transportRows} oneCol>
          <div>
            <span className="meta-key">GPS Status</span>
            <span className="value">
              <span className="profile-pill ok">
                <span className="profile-dot" />
                Live Tracking
              </span>
            </span>
          </div>
        </MetaList>

        <div className="transport-track">
          <div className="transport-track-map">
            <span className="transport-track-route" />
            <span className="transport-track-bus">
              <i className="ti ti-bus" />
            </span>
            <span className="transport-track-school">
              <i className="ti ti-school" />
            </span>
          </div>
          <div className="transport-track-info">
            <div className="transport-track-eta">
              <span className="profile-dot live" />
              <b>{transportEta.time}</b>
              <span>{transportEta.detail}</span>
            </div>
            <button
              type="button"
              className="profile-button profile-button-sm profile-button-primary w-100"
              onClick={() => onAction('track_bus')}
            >
              <i className="ti ti-map-2" />
              Track Bus Live
            </button>
          </div>
        </div>
      </div>
    </div>

    {/* Hostel */}
    <div className="card">
      <div className="card-header">
        <h5 className="profile-card-title accent-purple">
          <span className="tab-icon">
            <i className="ti ti-building" />
          </span>
          Hostel
        </h5>
      </div>
      <div className="card-body">
        <MetaList rows={hostelRows} oneCol />
      </div>
    </div>

    {/* Medical Record */}
    <div className="card">
      <div className="card-header">
        <h5 className="profile-card-title accent-danger">
          <span className="tab-icon">
            <i className="ti ti-heartbeat" />
          </span>
          Medical Record
        </h5>
      </div>
      <div className="card-body">
        <MetaList rows={medicalRows} oneCol>
          <div>
            <span className="meta-key">Vaccinations</span>
            <span className="value">
              <span className="profile-pill ok">
                <span className="profile-dot" />
                Up to date
              </span>
            </span>
          </div>
          <div>
            <span className="meta-key">{medicalDoctor.key}</span>
            <span className="value">{medicalDoctor.value}</span>
          </div>
        </MetaList>
        <div className="alert alert-light border mt-2 mb-0" style={{ fontSize: 12.5 }}>
          <i className="ti ti-notes me-1" />
          {medicalNote}
        </div>
      </div>
    </div>

    {/* AI Insights */}
    <div className="card">
      <div className="card-body">
        <div className="profile-insight">
          <div className="insight-head">
            <span className="profile-insight-badge">
              <i className="ti ti-sparkles" />
            </span>
            <div>
              <h5>AI Student Insights</h5>
              <span>Generated from 12-month activity</span>
            </div>
          </div>
          {aiInsights.map((insight) => (
            <div className="profile-insight-item" key={insight.id}>
              <div className="t">
                <i className={`${insight.icon} ${insight.iconClass}`} />
                {insight.title}
                {insight.risk ? (
                  <span className={insight.risk.className}>{insight.risk.label}</span>
                ) : null}
              </div>
              <p>
                {insight.body.map((part, index) =>
                  part.bold ? (
                    <b key={index}>{part.text}</b>
                  ) : (
                    <span key={index}>{part.text}</span>
                  ),
                )}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default ProfileSidebar;
