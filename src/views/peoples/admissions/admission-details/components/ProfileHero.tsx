import { Link } from 'react-router-dom';
import { all_routes } from '@/routes/all_routes';
import ImageWithBasePath from '@core/common/imageWithBasePath';
import { moreActions, profile } from '../data/admissionDetails.data';

const routes = all_routes;

export interface ProfileHeroProps {
  moreOpen: boolean;
  onToggleMore: (open: boolean) => void;
  onMoreAction: (id: string) => void;
  onReject: () => void;
  onApprove: () => void;
  onEmail: () => void;
}

const ProfileHero = ({ moreOpen, onToggleMore, onMoreAction, onReject, onApprove, onEmail }: ProfileHeroProps) => (
  <div className="card card-hover mb-3">
    <div className="card-body">
      <div className="d-xl-flex align-items-start justify-content-between">
        <div className="d-sm-flex align-items-center">
          <span className="avatar avatar-xxl rounded flex-shrink-0 me-sm-3 mb-3 mb-sm-0">
            <ImageWithBasePath src={profile.avatar} className="img-fluid rounded" alt={profile.name} />
          </span>
          <div>
            <div className="d-flex align-items-center flex-wrap gap-2 mb-2">
              <h4 className="mb-0">{profile.name}</h4>
              <span className="badge bg-primary-transparent text-primary">{profile.admissionNo}</span>
              <span className={`badge ${profile.status.className} d-inline-flex align-items-center`}>
                <i className="ti ti-circle-filled fs-5 me-1" />
                {profile.status.label}
              </span>
            </div>
            <div className="d-flex align-items-center flex-wrap gap-3 gap-xl-4 text-muted fs-13 mb-3">
              <span>
                <i className="ti ti-school me-1" />
                Class Applied: <span className="text-dark fw-medium">{profile.classApplied}</span>
              </span>
              <span>
                <i className="ti ti-calendar-due me-1" />
                Academic Year: <span className="text-dark fw-medium">{profile.academicYear}</span>
              </span>
              <span>
                <i className="ti ti-clock me-1" />
                Applied: <span className="text-dark fw-medium">{profile.appliedDate}</span>
              </span>
              <span>
                <i className="ti ti-user me-1" />
                Parent: <span className="text-dark fw-medium">{profile.parentName}</span>
              </span>
              <span>
                <i className="ti ti-phone me-1" />
                <span className="text-dark fw-medium">{profile.parentPhone}</span>
              </span>
            </div>
            <div className="d-flex align-items-center flex-wrap gap-2">
              <a
                href={`tel:${profile.parentPhone.replace(/\s+/g, '')}`}
                className="btn btn-sm btn-outline-light bg-white d-inline-flex align-items-center"
              >
                <i className="ti ti-phone me-1" />
                Call
              </a>
              <button
                type="button"
                className="btn btn-sm btn-outline-light bg-white d-inline-flex align-items-center"
                onClick={onEmail}
              >
                <i className="ti ti-mail me-1" />
                Email
              </button>
              <button type="button" className="btn btn-sm btn-outline-light bg-white d-inline-flex align-items-center">
                <i className="ti ti-message-2 me-1" />
                Message
              </button>
              <button type="button" className="btn btn-sm btn-outline-light bg-white d-inline-flex align-items-center">
                <i className="ti ti-brand-whatsapp me-1" />
                WhatsApp
              </button>
            </div>
          </div>
        </div>
        <div className="d-flex align-items-center flex-wrap gap-2 mt-3 mt-xl-0">
          <Link to={routes.admissions} className="btn btn-outline-light bg-white d-inline-flex align-items-center">
            <i className="ti ti-arrow-left me-1" />
            Back
          </Link>
          <Link to={routes.addAdmission} className="btn btn-outline-light bg-white d-inline-flex align-items-center">
            <i className="ti ti-edit-circle me-1" />
            Edit
          </Link>
          <button
            type="button"
            className="btn btn-outline-light bg-white d-inline-flex align-items-center"
            onClick={() => window.print()}
          >
            <i className="ti ti-printer me-1" />
            Print
          </button>
          <div className="dropdown">
            <button
              type="button"
              className="btn btn-outline-light bg-white btn-icon"
              aria-label="More actions"
              aria-expanded={moreOpen}
              onClick={() => onToggleMore(!moreOpen)}
            >
              <i className="ti ti-dots-vertical" />
            </button>
            <ul className={`dropdown-menu dropdown-menu-end p-2${moreOpen ? ' show' : ''}`}>
              {moreActions.map((action) => (
                <li key={action.id}>
                  <button
                    type="button"
                    className="dropdown-item rounded-1"
                    onClick={() => {
                      onToggleMore(false);
                      onMoreAction(action.id);
                    }}
                  >
                    <i className={`${action.icon} me-2`} />
                    {action.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <button type="button" className="btn btn-danger d-inline-flex align-items-center" onClick={onReject}>
            <i className="ti ti-x me-1" />
            Reject
          </button>
          <button type="button" className="btn btn-primary d-inline-flex align-items-center" onClick={onApprove}>
            <i className="ti ti-check me-1" />
            Approve
          </button>
        </div>
      </div>
    </div>
  </div>
);

export default ProfileHero;
