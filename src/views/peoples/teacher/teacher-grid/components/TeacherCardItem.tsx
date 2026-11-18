import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { all_routes } from '@/routes/all_routes';
import type { TeacherCard } from '../data/teachers.data';
import { ActionLink } from '@components/workspace';

const routes = all_routes;

export interface TeacherCardItemProps {
  teacher: TeacherCard;
  selected: boolean;
  onToggleSelect: (key: string) => void;
  menuOpen: boolean;
  onToggleMenu: (key: string | null) => void;
  onProfile: (teacher: TeacherCard) => void;
  onDelete: (teacher: TeacherCard) => void;
  onDownload: (teacher: TeacherCard) => void;
}

const TeacherCardItem = ({
  teacher,
  selected,
  onToggleSelect,
  menuOpen,
  onToggleMenu,
  onProfile,
  onDelete,
  onDownload,
}: TeacherCardItemProps) => {
  const menuRef = useRef<HTMLDivElement>(null);

  // Every link opens THIS teacher.
  const fullProfile = `${routes.teacherDetails}?id=${teacher.key}`;
  const editLink = `${routes.editTeacher}?id=${teacher.key}`;
  const timetableLink = `${routes.teachersRoutine}?id=${teacher.key}`;
  const hasEmail = teacher.email !== '—';

  useEffect(() => {
    if (!menuOpen) return;
    const close = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) onToggleMenu(null);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [menuOpen, onToggleMenu]);

  const closeThen = (run: () => void) => () => {
    onToggleMenu(null);
    run();
  };

  return (
    <div
      className={`col-12 col-xxl-4 col-md-6 d-flex dt-row${selected ? ' dt-selected' : ''}`}
      data-cls-status={teacher.status}
      data-search={teacher.search}
    >
      <div className="card flex-fill mb-0">
        <div className="card-header d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center">
            <input
              type="checkbox"
              className="dt-check row-select-cell me-2"
              aria-label={`Select ${teacher.name}`}
              checked={selected}
              onChange={() => onToggleSelect(teacher.key)}
            />
            <button
              type="button"
              className="link-primary fw-medium border-0 bg-transparent p-0"
              onClick={() => onProfile(teacher)}
            >
              {teacher.id}
            </button>
          </div>
          <div className="d-flex align-items-center">
            <span className={`badge ${teacher.statusBadge} d-inline-flex align-items-center me-2`}>
              <i className="ti ti-circle-filled fs-8 me-1" />
              {teacher.status}
            </span>
            <div className="dropdown" ref={menuRef}>
              <button
                type="button"
                className="btn btn-white btn-icon btn-sm d-flex align-items-center justify-content-center rounded-circle flex-shrink-0 p-0"
                aria-expanded={menuOpen}
                aria-label={`${teacher.name} actions`}
                onClick={() => onToggleMenu(menuOpen ? null : teacher.key)}
              >
                <i className="ti ti-dots-vertical fs-14" />
              </button>
              <ul className={`dropdown-menu dropdown-menu-end p-3${menuOpen ? ' show' : ''}`}>
                <li>
                  <button
                    type="button"
                    className="dropdown-item rounded-1"
                    onClick={closeThen(() => onProfile(teacher))}
                  >
                    <i className="ti ti-eye me-2" />
                    View Details
                  </button>
                </li>
                <li>
                  <Link className="dropdown-item rounded-1" to={fullProfile} onClick={() => onToggleMenu(null)}>
                    <i className="ti ti-user me-2" />
                    Full Profile
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item rounded-1" to={editLink} onClick={() => onToggleMenu(null)}>
                    <i className="ti ti-edit-circle me-2" />
                    Edit Teacher
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item rounded-1" to={timetableLink} onClick={() => onToggleMenu(null)}>
                    <i className="ti ti-table me-2" />
                    View Timetable
                  </Link>
                </li>
                {hasEmail ? (
                  <li>
                    <a className="dropdown-item rounded-1" href={`mailto:${teacher.email}`}>
                      <i className="ti ti-mail me-2" />
                      Send Email
                    </a>
                  </li>
                ) : null}
                <li>
                  <button
                    type="button"
                    className="dropdown-item rounded-1"
                    onClick={closeThen(() => onDownload(teacher))}
                  >
                    <i className="ti ti-download me-2" />
                    Download Profile
                  </button>
                </li>
                <li>
                  <hr className="dropdown-divider my-2" />
                </li>
                <li>
                  <button
                    type="button"
                    className="dropdown-item rounded-1 text-danger"
                    onClick={closeThen(() => onDelete(teacher))}
                  >
                    <i className="ti ti-trash-x me-2" />
                    Delete
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="card-body">
          <div className="bg-light-300 rounded-2 p-3 mb-3">
            <div className="d-flex align-items-center">
              {/* No photo is stored yet: show the teacher's initials. */}
              <button
                type="button"
                className="avatar avatar-lg flex-shrink-0 border-0 rounded-circle bg-light fw-bold text-dark d-flex align-items-center justify-content-center"
                aria-label={`View ${teacher.name}'s profile`}
                onClick={() => onProfile(teacher)}
              >
                {teacher.initials}
              </button>
              <div className="ms-2 overflow-hidden">
                <div className="d-flex align-items-center flex-wrap gap-1 mb-1">
                  <h5 className="text-dark text-truncate mb-0 fs-15 fw-medium">
                    <ActionLink
                      className="dt-name text-dark border-0 bg-transparent p-0"
                      onClick={() => onProfile(teacher)}
                    >
                      {teacher.name}
                    </ActionLink>
                  </h5>
                  <span className={`badge ${teacher.employment.className}`}>{teacher.employment.label}</span>
                </div>
                <span className="fs-12 text-muted d-block">
                  <i className="ti ti-certificate me-1" />
                  {teacher.qualification}
                </span>
              </div>
            </div>
          </div>

          <div className="row g-2 mb-0">
            <div className="col-12 col-sm-6">
              <p className="mb-0 fs-12">Subject</p>
              <p className="text-dark mb-0">
                <span className="badge badge-soft-info" data-cls-col="subject">
                  {teacher.subject}
                </span>
              </p>
            </div>
            <div className="col-12 col-sm-6">
              <p className="mb-0 fs-12">Classes</p>
              <p className="text-dark text-truncate mb-0" data-cls-col="class">
                <i className="ti ti-users text-muted me-1" />
                {teacher.classes}
              </p>
            </div>
            <div className="col-12 col-sm-6">
              <p className="mb-0 fs-12">Phone</p>
              <p className="text-dark text-truncate mb-0" data-cls-col="phone">
                <i className="ti ti-phone text-muted me-1" />
                {teacher.phone}
              </p>
            </div>
            <div className="col-12 col-sm-6">
              <p className="mb-0 fs-12">Email</p>
              <p className="text-dark text-truncate mb-0" data-cls-col="email">
                <i className="ti ti-mail text-muted me-1" />
                {teacher.email}
              </p>
            </div>
            <div className="col-12 col-sm-6">
              <p className="mb-0 fs-12">Experience</p>
              <p className="text-dark mb-0">
                <i className="ti ti-briefcase text-muted me-1" />
                {teacher.experience}
              </p>
            </div>
            <div className="col-12 col-sm-6">
              <p className="mb-0 fs-12">Joined</p>
              <p className="text-dark text-truncate mb-0">
                <i className="ti ti-calendar-plus text-muted me-1" />
                {teacher.joined}
              </p>
            </div>
          </div>
        </div>

        <div className="card-footer d-flex align-items-center justify-content-between flex-wrap gap-2">
          <div className="d-flex align-items-center gap-1">
            <button
              type="button"
              className="btn btn-outline-light bg-white btn-icon d-flex align-items-center justify-content-center rounded-circle flex-shrink-0 p-0"
              aria-label="View Profile"
              onClick={() => onProfile(teacher)}
            >
              <i className="ti ti-eye" />
            </button>
            <Link
              to={editLink}
              className="btn btn-outline-light bg-white btn-icon d-flex align-items-center justify-content-center rounded-circle flex-shrink-0 p-0"
              aria-label="Edit"
            >
              <i className="ti ti-edit" />
            </Link>
            <Link
              to={timetableLink}
              className="btn btn-outline-light bg-white btn-icon d-flex align-items-center justify-content-center rounded-circle flex-shrink-0 p-0"
              aria-label="Timetable"
            >
              <i className="ti ti-table" />
            </Link>
          </div>
          <Link to={fullProfile} className="btn btn-light btn-sm fw-semibold">
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TeacherCardItem;