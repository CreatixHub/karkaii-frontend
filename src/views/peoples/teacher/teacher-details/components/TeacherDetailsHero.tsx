import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { all_routes } from '@/routes/all_routes';
import type { HeroMoreAction } from '../data/teacherDetailsWorkspace.data';
import { heroMoreMenu } from '../data/teacherDetailsWorkspace.data';
import type { LiveProfile } from '../data/teacherProfileLive';

const routes = all_routes;

export interface TeacherDetailsHeroProps {
  profile: LiveProfile;
  onSendMessage: () => void;
  onLoginDetails: () => void;
  onPrint: () => void;
  onMoreAction: (action: HeroMoreAction) => void;
}

const TeacherDetailsHero = ({
  profile,
  onSendMessage,
  onLoginDetails,
  onPrint,
  onMoreAction,
}: TeacherDetailsHeroProps) => {
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);
  const editLink = `${routes.editTeacher}?id=${profile.id}`;

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

  // Only real facts about this teacher.
  const meta = [
    { id: 'qualification', icon: 'ti ti-school', label: 'Qualification', value: profile.qualification },
    { id: 'joined', icon: 'ti ti-calendar', label: 'Joined', value: profile.joinedOn },
    { id: 'phone', icon: 'ti ti-phone', label: 'Phone', value: profile.phone },
    { id: 'email', icon: 'ti ti-mail', label: 'Email', value: profile.email },
  ];

  return (
    <div className="card card-hover mb-3">
      <div className="card-body">
        <div className="d-xl-flex align-items-start justify-content-between">
          <div className="d-sm-flex align-items-center flex-lg-nowrap flex-wrap gap-3">
            {/* No photo is stored yet: show the teacher's initials. */}
            <span
              className="avatar avatar-xxl rounded flex-shrink-0 me-sm-3 mb-3 mb-sm-0 d-flex align-items-center justify-content-center fw-bold bg-light text-dark"
              style={{ fontSize: 32 }}
            >
              {profile.initials}
            </span>
            <div>
              <div className="d-flex align-items-center flex-wrap gap-2 mb-2">
                <h4 className="mb-0">{profile.name}</h4>
                <span className="badge bg-primary-transparent text-primary">{profile.employeeNo}</span>
                <span className={`badge ${profile.statusClass} d-inline-flex align-items-center`}>
                  <i className="ti ti-circle-filled fs-5 me-1" />
                  {profile.statusLabel}
                </span>
              </div>
              <div className="d-flex align-items-center flex-wrap gap-3 gap-xl-4 text-muted fs-13 mb-3">
                {meta.map((item) => (
                  <span key={item.id}>
                    <i className={`${item.icon} me-1`} />
                    {item.label}: <span className="text-dark fw-medium">{item.value}</span>
                  </span>
                ))}
              </div>
              <div className="d-flex align-items-center flex-wrap gap-2">
                <Link
                  to={editLink}
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
                {profile.hasEmail ? (
                  <a
                    href={`mailto:${profile.email}`}
                    className="btn btn-sm btn-outline-light bg-white d-inline-flex align-items-center"
                  >
                    <i className="ti ti-mail me-1" />
                    Email
                  </a>
                ) : null}
                {profile.hasPhone ? (
                  <a
                    href={`tel:${profile.phone}`}
                    className="btn btn-sm btn-outline-light bg-white d-inline-flex align-items-center"
                  >
                    <i className="ti ti-phone me-1" />
                    Call
                  </a>
                ) : null}
              </div>
            </div>
          </div>
          <div className="d-flex align-items-center flex-wrap gap-2 mt-3 mt-xl-0">
            <Link
              to={editLink}
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