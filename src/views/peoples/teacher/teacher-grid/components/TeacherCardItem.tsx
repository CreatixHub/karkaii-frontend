import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import ImageWithBasePath from '@core/common/imageWithBasePath';
import { all_routes } from '@/routes/all_routes';
import type { TeacherCard } from '../data/teachers.data';
import { metricFields } from '../data/teachers.data';
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

  // The template varies the name heading between h4, h5 and h6 across cards.
  const Heading = teacher.heading.tag;

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
                  <Link className="dropdown-item rounded-1" to={routes.editTeacher} onClick={() => onToggleMenu(null)}>
                    <i className="ti ti-edit-circle me-2" />
                    Edit Teacher
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item rounded-1" to={routes.classTimetable} onClick={() => onToggleMenu(null)}>
                    <i className="ti ti-table me-2" />
                    View Timetable
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item rounded-1" to={routes.classes} onClick={() => onToggleMenu(null)}>
                    <i className="ti ti-school me-2" />
                    View Classes
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item rounded-1" to={routes.chat} onClick={() => onToggleMenu(null)}>
                    <i className="ti ti-message me-2" />
                    Send Message
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item rounded-1" to={routes.email} onClick={() => onToggleMenu(null)}>
                    <i className="ti ti-mail me-2" />
                    Send Email
                  </Link>
                </li>
                <li>
                  <Link
                    className="dropdown-item rounded-1"
                    to={routes.attendanceReport}
                    onClick={() => onToggleMenu(null)}
                  >
                    <i className="ti ti-calendar-check me-2" />
                    Attendance Report
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item rounded-1" to={routes.payroll} onClick={() => onToggleMenu(null)}>
                    <i className="ti ti-moneybag me-2" />
                    Payroll Details
                  </Link>
                </li>
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
              <button
                type="button"
                className={`avatar avatar-lg${teacher.online ? ' online' : ''} flex-shrink-0 border-0 bg-transparent p-0`}
                aria-label={`View ${teacher.name}'s profile`}
                onClick={() => onProfile(teacher)}
              >
                <ImageWithBasePath
                  src={teacher.avatar}
                  className="img-fluid rounded-circle flex-shrink-0"
                  alt="img"
                />
              </button>
              <div className="ms-2 overflow-hidden">
                <div className="d-flex align-items-center flex-wrap gap-1 mb-1">
                  <Heading className={teacher.heading.className}>
                    <ActionLink
                      className="dt-name text-dark border-0 bg-transparent p-0"
                      onClick={() => onProfile(teacher)}
                    >
                      {teacher.name}
                    </ActionLink>
                  </Heading>
                  <span className={`badge ${teacher.employment.className}`}>{teacher.employment.label}</span>
                </div>
                <span className="fs-12 text-muted d-block">
                  <i className="ti ti-building-community me-1" />
                  {teacher.department}
                </span>
                <span className="fs-12 text-muted d-block">
                  <i className="ti ti-certificate me-1" />
                  {teacher.qualification}
                </span>
              </div>
            </div>
          </div>

          <div className="row g-2 mb-3">
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
              <p className="mb-0 fs-12">Branch</p>
              <p className="text-dark text-truncate mb-0">
                <i className="ti ti-building text-muted me-1" />
                {teacher.branch}
              </p>
            </div>
          </div>

          <div className="border rounded-2 p-2 mb-3">
            <div className="d-flex align-items-center justify-content-between flex-wrap gap-1 fs-12 text-muted">
              <span>
                <i className="ti ti-login me-1" />
                {teacher.lastLogin}
              </span>
              <span>
                <i className="ti ti-calendar-plus me-1" />
                {teacher.joined}
              </span>
            </div>
          </div>

          <p className="fs-12 text-uppercase text-muted mb-2">Summary Metrics</p>
          {teacher.metrics.map((metric, index) => (
            <div className={index === teacher.metrics.length - 1 ? 'mb-0' : 'mb-2'} key={metricFields[index].label}>
              <div className="d-flex align-items-center justify-content-between mb-1">
                <span className="fs-12">
                  <i className={`${metricFields[index].icon} me-1`} />
                  {metricFields[index].label}
                </span>
                <span className="fs-12 fw-medium text-dark">{metric.value}%</span>
              </div>
              <div className="progress progress-xs">
                <div
                  className={`progress-bar ${metric.bar}`}
                  role="progressbar"
                  style={{ width: `${metric.value}%` }}
                  aria-valuenow={metric.value}
                  aria-valuemin={0}
                  aria-valuemax={100}
                />
              </div>
            </div>
          ))}
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
              to={routes.editTeacher}
              className="btn btn-outline-light bg-white btn-icon d-flex align-items-center justify-content-center rounded-circle flex-shrink-0 p-0"
              aria-label="Edit"
            >
              <i className="ti ti-edit" />
            </Link>
            <Link
              to={routes.audioCall}
              className="btn btn-outline-light bg-white btn-icon d-flex align-items-center justify-content-center rounded-circle flex-shrink-0 p-0"
              aria-label="Call"
            >
              <i className="ti ti-phone" />
            </Link>
            <Link
              to={routes.chat}
              className="btn btn-outline-light bg-white btn-icon d-flex align-items-center justify-content-center rounded-circle flex-shrink-0 p-0"
              aria-label="Message"
            >
              <i className="ti ti-brand-hipchat" />
            </Link>
            <Link
              to={routes.classTimetable}
              className="btn btn-outline-light bg-white btn-icon d-flex align-items-center justify-content-center rounded-circle flex-shrink-0 p-0"
              aria-label="Timetable"
            >
              <i className="ti ti-table" />
            </Link>
          </div>
          <button
            type="button"
            className="btn btn-light btn-sm fw-semibold"
            onClick={() => onProfile(teacher)}
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeacherCardItem;
