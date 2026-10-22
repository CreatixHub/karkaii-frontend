import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import ImageWithBasePath from '@core/common/imageWithBasePath';
import { all_routes } from '@/routes/all_routes';
import { teacherProfile } from '../data/teacherProfile.data';
import type { HeroMoreAction } from '../data/teacherDetailsWorkspace.data';
import { heroMeta, heroMoreMenu } from '../data/teacherDetailsWorkspace.data';

const routes = all_routes;

export interface TeacherDetailsHeroProps {
  onSendMessage: () => void;
  onLoginDetails: () => void;
  onPrint: () => void;
  onMoreAction: (action: HeroMoreAction) => void;
}

const TeacherDetailsHero = ({
  onSendMessage,
  onLoginDetails,
  onPrint,
  onMoreAction,
}: TeacherDetailsHeroProps) => {
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!moreOpen) return;
    const handlePointerDown = (event: MouseEvent) => {
      if (!moreRef.current?.contains(event.target as Node)) setMoreOpen(false);
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMoreOpen(false);
    };
    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [moreOpen]);

  return (
    <div className="card card-hover mb-3">
      <div className="card-body">
        <div className="d-xl-flex align-items-start justify-content-between">
          <div className="d-sm-flex align-items-center flex-lg-nowrap flex-wrap gap-3">
            <span className="avatar avatar-xxl rounded flex-shrink-0 me-sm-3 mb-3 mb-sm-0">
              <ImageWithBasePath
                src={teacherProfile.avatar}
                className="img-fluid rounded"
                alt={teacherProfile.name}
              />
            </span>
            <div>
              <div className="d-flex align-items-center flex-wrap gap-2 mb-2">
                <h4 className="mb-0">{teacherProfile.name}</h4>
                <span className="badge bg-primary-transparent text-primary">{teacherProfile.id}</span>
                <span className="badge badge-soft-success d-inline-flex align-items-center">
                  <i className="ti ti-circle-filled fs-5 me-1" />
                  {teacherProfile.status}
                </span>
              </div>
              <div className="d-flex align-items-center flex-wrap gap-3 gap-xl-4 text-muted fs-13 mb-3">
                {heroMeta.map((item) => (
                  <span key={item.id}>
                    <i className={`${item.icon} me-1`} />
                    {item.label ? `${item.label}: ` : null}
                    <span className="text-dark fw-medium">{item.value}</span>
                  </span>
                ))}
              </div>
              <div className="d-flex align-items-center flex-wrap gap-2">
                <Link
                  to={routes.editTeacher}
                  className="btn btn-sm btn-outline-light bg-white d-inline-flex align-items-center"
                >
                  <i className="ti ti-edit me-1" />
                  Edit Profile
                </Link>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-light bg-white d-inline-flex align-items-center"
                  onClick={onSendMessage}
                >
                  <i className="ti ti-message-2 me-1" />
                  Send Message
                </button>
                <a
                  href={`mailto:${teacherProfile.email}`}
                  className="btn btn-sm btn-outline-light bg-white d-inline-flex align-items-center"
                >
                  <i className="ti ti-mail me-1" />
                  Email
                </a>
                <a
                  href="tel:+14654884498"
                  className="btn btn-sm btn-outline-light bg-white d-inline-flex align-items-center"
                >
                  <i className="ti ti-phone me-1" />
                  Call
                </a>
              </div>
            </div>
          </div>
          <div className="d-flex align-items-center flex-wrap gap-2 mt-3 mt-xl-0">
            <Link
              to={routes.editTeacher}
              className="btn btn-outline-light bg-white d-inline-flex align-items-center"
            >
              <i className="ti ti-edit-circle me-1" />
              Edit Teacher
            </Link>
            <button
              type="button"
              className="btn btn-outline-light bg-white d-inline-flex align-items-center"
              onClick={onLoginDetails}
            >
              <i className="ti ti-lock me-1" />
              Login Details
            </button>
            <button
              type="button"
              className="btn btn-outline-light bg-white d-inline-flex align-items-center"
              data-td-print
              onClick={onPrint}
            >
              <i className="ti ti-printer me-1" />
              Print Profile
            </button>
            <div className="dropdown" ref={moreRef}>
              <button
                type="button"
                className="btn btn-outline-light bg-white dropdown-toggle d-inline-flex align-items-center"
                aria-expanded={moreOpen}
                onClick={() => setMoreOpen((open) => !open)}
              >
                <i className="ti ti-dots me-1" />
                More
              </button>
              <ul className={`dropdown-menu dropdown-menu-end p-2${moreOpen ? ' show' : ''}`}>
                {heroMoreMenu.map((item) => (
                  <li key={item.id}>
                    {item.to ? (
                      <Link
                        className="dropdown-item rounded-1"
                        to={routes[item.to]}
                        onClick={() => setMoreOpen(false)}
                      >
                        <i className={`${item.icon} me-2`} />
                        {item.label}
                      </Link>
                    ) : (
                      <button
                        type="button"
                        className="dropdown-item rounded-1"
                        onClick={() => {
                          setMoreOpen(false);
                          if (item.action) onMoreAction(item.action);
                        }}
                      >
                        <i className={`${item.icon} me-2`} />
                        {item.label}
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDetailsHero;
