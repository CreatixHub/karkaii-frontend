import ImageWithBasePath from '@core/common/imageWithBasePath';
import { engagementStats, profile, socialLinks } from '../data/alumniProfile.data';

const ProfileSidebar = () => (
  <div className="col-xxl-3 col-xl-4 theiaStickySidebar">
    <div className="card">
      <div className="card-header text-center">
        <div className="d-flex flex-column align-items-center">
          <span className="avatar avatar-xxl rounded-circle flex-shrink-0 mb-2">
            <ImageWithBasePath src={profile.avatar} className="img-fluid rounded-circle flex-shrink-0" alt="img" />
          </span>
          <span className="badge badge-soft-success d-inline-flex align-items-center mb-1">
            <i className="ti ti-circle-filled fs-5 me-1" />
            {profile.statusLabel}
          </span>
          <h4 className="mb-1 fs-16 fw-medium">{profile.name}</h4>
          <p className="text-primary mb-0">{profile.batchLine}</p>
        </div>
      </div>
      <div className="card-body">
        <h5 className="mb-2 fs-15">Current Role</h5>
        <div className="d-flex align-items-center mb-3">
          <span className="avatar avatar-md bg-light-300 rounded me-2 flex-shrink-0 text-default">
            <i className="ti ti-briefcase" />
          </span>
          <div>
            <p className="mb-0 text-dark">{profile.currentRole}</p>
            <span className="fs-12 text-muted">{profile.currentOrg}</span>
          </div>
        </div>
        <h6 className="mb-2">Contact</h6>
        <p className="fs-13 mb-2">
          <i className="ti ti-phone me-2" />
          {profile.phone}
        </p>
        <p className="fs-13 mb-3">
          <i className="ti ti-mail me-2" />
          {profile.email}
        </p>
        <h6 className="mb-2">Social</h6>
        <div className="d-flex align-items-center">
          {socialLinks.map((link) => (
            <a
              href="#"
              key={link.id}
              className="btn btn-outline-light bg-white btn-icon rounded-circle flex-shrink-0 me-2"
              onClick={(event) => event.preventDefault()}
            >
              <i className={link.icon} />
            </a>
          ))}
        </div>
      </div>
    </div>
    <div className="card mb-0">
      <div className="card-header">
        <h6 className="mb-0">Engagement</h6>
      </div>
      <div className="card-body">
        {engagementStats.map((stat, index) => (
          <div
            className={`d-flex align-items-center justify-content-between${index < engagementStats.length - 1 ? ' mb-3' : ''}`}
            key={stat.id}
          >
            <span className="fs-13">{stat.label}</span>
            <span className={`badge ${stat.badgeClass}`}>{stat.value}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default ProfileSidebar;
