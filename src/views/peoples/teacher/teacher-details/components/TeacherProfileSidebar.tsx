import { useTeacherProfile } from '../hooks/useTeacherProfile';

const TeacherProfileSidebar = () => {
  const { status, profile } = useTeacherProfile();

  if (status !== 'ready' || !profile) {
    return (
      <div className="col-xxl-3 col-xl-4 theiaStickySidebar">
        <div className="card border-white">
          <div className="card-body text-muted">
            {status === 'loading' ? 'Loading teacher…' : 'Teacher not available.'}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="col-xxl-3 col-xl-4 theiaStickySidebar">
      <div className="stickytopbar pb-4">
        <div className="card border-white">
          <div className="card-header">
            <div className="d-flex align-items-center flex-wrap row-gap-3">
              <div
                className="d-flex align-items-center justify-content-center avatar avatar-xxl border border-dashed me-2 flex-shrink-0 text-dark frames fw-bold"
                style={{ fontSize: 28 }}
              >
                {profile.initials}
              </div>
              <div>
                <h4 className="mb-1 text-truncate fs-16 fw-medium">{profile.name}</h4>
                <p className="text-primary mb-1">{profile.employeeNo}</p>
                <p>Joined : {profile.joinedOn}</p>
              </div>
            </div>
          </div>
          <div className="card-body">
            <h5 className="mb-3">Basic Information</h5>
            <dl className="row mb-0">
              <dt className="col-6 fw-medium text-dark mb-3">Class &amp; Section</dt>
              <dd className="col-6 mb-3">{profile.sectionsText}</dd>
              <dt className="col-6 fw-medium text-dark mb-3">Subject</dt>
              <dd className="col-6 mb-3">{profile.subjectsText}</dd>
              <dt className="col-6 fw-medium text-dark mb-3">Gender</dt>
              <dd className="col-6 mb-3">{profile.gender}</dd>
              <dt className="col-6 fw-medium text-dark mb-0">Blood Group</dt>
              <dd className="col-6 mb-0">{profile.bloodGroup}</dd>
            </dl>
          </div>
        </div>
        <div className="card border-white mb-0">
          <div className="card-body">
            <h5 className="mb-3">Primary Contact Info</h5>
            <div className="d-flex align-items-center mb-3">
              <span className="avatar avatar-md bg-light-300 rounded me-2 flex-shrink-0 text-default">
                <i className="ti ti-phone" />
              </span>
              <div>
                <span className="text-dark fw-medium mb-1">Phone Number</span>
                <p>{profile.phone}</p>
              </div>
            </div>
            <div className="d-flex align-items-center">
              <span className="avatar avatar-md bg-light-300 rounded me-2 flex-shrink-0 text-default">
                <i className="ti ti-mail" />
              </span>
              <div>
                <span className="text-dark fw-medium mb-1">Email Address</span>
                <p>{profile.email}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherProfileSidebar;