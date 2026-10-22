import { useState } from 'react';
import { Link } from 'react-router-dom';
import ImageWithBasePath from '@core/common/imageWithBasePath';
import { teacherProfile } from '../data/teacherProfile.data';

export interface TeacherDetailsSidebarProps {
  onCopy: (value: string) => void;
}

const TeacherDetailsSidebar = ({ onCopy }: TeacherDetailsSidebarProps) => {
  const [tab, setTab] = useState<'hostel' | 'transport'>('hostel');

  return (
    <div className="col-xxl-3 col-xl-4 theiaStickySidebar">
      <div className="card border-white card-hover">
        <div className="card-header">
          <div className="d-flex align-items-center flex-wrap row-gap-3">
            <div className="d-flex align-items-center justify-content-center avatar avatar-xxl border border-dashed me-2 flex-shrink-0 text-dark frames">
              <ImageWithBasePath src={teacherProfile.avatar} className="img-fluid" alt="img" />
            </div>
            <div>
              <h5 className="mb-1 text-truncate">{teacherProfile.name}</h5>
              <p className="text-primary mb-1">{teacherProfile.id}</p>
              <p>Joined : {teacherProfile.joinedShort}</p>
            </div>
          </div>
        </div>
        <div className="card-body">
          <h5 className="mb-3">Basic Information</h5>
          <dl className="row mb-0">
            <dt className="col-6 fw-medium text-dark mb-3">Class &amp; Section</dt>
            <dd className="col-6 mb-3">{teacherProfile.classSection}</dd>
            <dt className="col-6 fw-medium text-dark mb-3">Subject</dt>
            <dd className="col-6 mb-3">{teacherProfile.subject}</dd>
            <dt className="col-6 fw-medium text-dark mb-3">Gender</dt>
            <dd className="col-6 mb-3">{teacherProfile.gender}</dd>
            <dt className="col-6 fw-medium text-dark mb-3">Blood Group</dt>
            <dd className="col-6 mb-3">{teacherProfile.bloodGroup}</dd>
            <dt className="col-6 fw-medium text-dark mb-3">House</dt>
            <dd className="col-6 mb-3">{teacherProfile.house}</dd>
            <dt className="col-6 fw-medium text-dark mb-3">Language Known</dt>
            <dd className="col-6 mb-3">{teacherProfile.languageKnown}</dd>
            <dt className="col-6 fw-medium text-dark mb-0">Language</dt>
            <dd className="col-6 mb-0">
              {teacherProfile.languages.map((language, index) => (
                <span
                  className={`badge badge-light text-dark${
                    index < teacherProfile.languages.length - 1 ? ' me-2' : ''
                  }`}
                  key={language}
                >
                  {language}
                </span>
              ))}
            </dd>
          </dl>
        </div>
      </div>

      <div className="card border-white card-hover">
        <div className="card-body">
          <h5 className="mb-3">Primary Contact Info</h5>
          <div className="d-flex align-items-center mb-3">
            <span className="avatar avatar-md bg-light-300 rounded me-2 flex-shrink-0 text-default">
              <i className="ti ti-phone" />
            </span>
            <div>
              <span className="text-dark fw-medium mb-1">Phone Number</span>
              <p>{teacherProfile.phone}</p>
            </div>
          </div>
          <div className="d-flex align-items-center">
            <span className="avatar avatar-md bg-light-300 rounded me-2 flex-shrink-0 text-default">
              <i className="ti ti-mail" />
            </span>
            <div>
              <span className="text-dark fw-medium mb-1">Email Address</span>
              <p>{teacherProfile.email}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="card border-white card-hover">
        <div className="card-body pb-1">
          <h5 className="mb-3">PAN Number / ID Number</h5>
          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center mb-3">
              <span className="avatar avatar-md bg-light-300 rounded me-2 flex-shrink-0 text-default">
                <i className="ti ti-id" />
              </span>
              <div>
                <p className="text-dark">{teacherProfile.panNumber}</p>
              </div>
            </div>
            <button
              type="button"
              className="btn btn-primary btn-icon btn-sm mb-3"
              title="Copy ID number"
              aria-label="Copy ID number"
              onClick={() => onCopy(teacherProfile.panNumber)}
            >
              <i className="ti ti-copy" />
            </button>
          </div>
        </div>
      </div>

      <div className="card border-white card-hover">
        <div className="card-body pb-1">
          <ul className="nav nav-tabs nav-tabs-bottom mb-3">
            <li className="nav-item">
              <Link
                className={`nav-link${tab === 'hostel' ? ' active' : ''}`}
                to="#hostel"
                onClick={(event) => {
                  event.preventDefault();
                  setTab('hostel');
                }}
              >
                Hostel
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link${tab === 'transport' ? ' active' : ''}`}
                to="#transport"
                onClick={(event) => {
                  event.preventDefault();
                  setTab('transport');
                }}
              >
                Transportation
              </Link>
            </li>
          </ul>
          <div className="tab-content">
            <div className={`tab-pane fade${tab === 'hostel' ? ' show active' : ''}`} id="hostel">
              <div className="d-flex align-items-center mb-3">
                <span className="avatar avatar-md bg-light-300 rounded me-2 flex-shrink-0 text-default">
                  <i className="ti ti-building-fortress fs-16" />
                </span>
                <div>
                  <h6 className="mb-1">{teacherProfile.hostel.name}</h6>
                  <p className="text-primary">Room No : {teacherProfile.hostel.room}</p>
                </div>
              </div>
            </div>
            <div className={`tab-pane fade${tab === 'transport' ? ' show active' : ''}`} id="transport">
              <div className="d-flex align-items-center mb-3">
                <span className="avatar avatar-md bg-light-300 rounded me-2 flex-shrink-0 text-default">
                  <i className="ti ti-bus fs-16" />
                </span>
                <div>
                  <span className="fs-12 mb-1">Route</span>
                  <p className="text-dark">{teacherProfile.transport.route}</p>
                </div>
              </div>
              <div className="row">
                <div className="col-sm-6">
                  <div className="mb-3">
                    <span className="fs-12 mb-1">Bus Number</span>
                    <p className="text-dark">{teacherProfile.transport.busNumber}</p>
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="mb-3">
                    <span className="fs-12 mb-1">Pickup Point</span>
                    <p className="text-dark">{teacherProfile.transport.pickupPoint}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDetailsSidebar;
