import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import ImageWithBasePath from '@core/common/imageWithBasePath';
import { all_routes } from '@/routes/all_routes';
import type { GuardianRecord } from '../data/guardians.data';
import type { ColumnId } from '../data/guardiansWorkspace.data';

const routes = all_routes;

export interface GuardianCardItemProps {
  guardian: GuardianRecord;
  selected: boolean;
  /** Card sections the Columns menu is currently showing. */
  columns: Record<ColumnId, boolean>;
  onSelect: (id: string) => void;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onAction: (label: string, guardian: GuardianRecord) => void;
}

const GuardianCardItem = ({
  guardian,
  selected,
  columns,
  onSelect,
  onView,
  onEdit,
  onDelete,
  onAction,
}: GuardianCardItemProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const handlePointerDown = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) setMenuOpen(false);
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [menuOpen]);

  const g = guardian;

  /** Menu items that only fire a toast; navigation entries are rendered as links. */
  const runAction = (label: string) => {
    setMenuOpen(false);
    onAction(label, g);
  };

  return (
    <div className="col-12 col-xxl-4 col-md-6 d-flex">
      <div className="card flex-fill mb-3">
        <div className="card-header d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center">
            <div className="form-check form-check-md me-2">
              <input
                className="form-check-input"
                type="checkbox"
                aria-label={`Select ${g.name}`}
                checked={selected}
                onChange={() => onSelect(g.id)}
              />
            </div>
            <button type="button" className="link-primary fw-medium btn btn-link p-0" onClick={() => onView(g.id)}>
              {g.id}
            </button>
          </div>
          <div className="d-flex align-items-center">
            <span className={`badge ${g.statusBadgeClass} d-inline-flex align-items-center me-2`}>
              <i className="ti ti-circle-filled fs-8 me-1" />
              {g.status}
            </span>
            <div className="dropdown" ref={menuRef}>
              <button
                type="button"
                className="btn btn-white btn-icon btn-sm d-flex align-items-center justify-content-center rounded-circle flex-shrink-0 p-0"
                aria-expanded={menuOpen}
                aria-label={`Actions for ${g.name}`}
                onClick={() => setMenuOpen((open) => !open)}
              >
                <i className="ti ti-dots-vertical fs-14" />
              </button>
              <ul className={`dropdown-menu dropdown-menu-end p-3${menuOpen ? ' show' : ''}`}>
                <li>
                  <button
                    type="button"
                    className="dropdown-item rounded-1"
                    onClick={() => {
                      setMenuOpen(false);
                      onView(g.id);
                    }}
                  >
                    <i className="ti ti-eye me-2" />
                    View Details
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    className="dropdown-item rounded-1"
                    onClick={() => {
                      setMenuOpen(false);
                      onEdit(g.id);
                    }}
                  >
                    <i className="ti ti-edit-circle me-2" />
                    Edit Guardian
                  </button>
                </li>
                <li>
                  <Link className="dropdown-item rounded-1" to={routes.studentDetail} onClick={() => setMenuOpen(false)}>
                    <i className="ti ti-school me-2" />
                    View Students
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item rounded-1" to={routes.email} onClick={() => setMenuOpen(false)}>
                    <i className="ti ti-mail me-2" />
                    Send Email
                  </Link>
                </li>
                <li>
                  <Link
                    className="dropdown-item rounded-1"
                    to={routes.feeCollectionReport}
                    onClick={() => setMenuOpen(false)}
                  >
                    <i className="ti ti-report-money me-2" />
                    View Fee History
                  </Link>
                </li>
                <li>
                  <Link
                    className="dropdown-item rounded-1"
                    to={routes.attendanceReport}
                    onClick={() => setMenuOpen(false)}
                  >
                    <i className="ti ti-calendar-check me-2" />
                    Attendance Report
                  </Link>
                </li>
                <li>
                  <button type="button" className="dropdown-item rounded-1" onClick={() => runAction('Download Profile')}>
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
                    onClick={() => {
                      setMenuOpen(false);
                      onDelete(g.id);
                    }}
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
                className={`avatar avatar-lg flex-shrink-0 border-0 p-0 bg-transparent${g.online ? ' online' : ''}`}
                aria-label={`Open ${g.name} profile`}
                onClick={() => onView(g.id)}
              >
                <ImageWithBasePath
                  src={g.avatar}
                  className="img-fluid rounded-circle flex-shrink-0"
                  alt={g.name}
                />
              </button>
              <div className="ms-2 overflow-hidden">
                <div className="d-flex align-items-center flex-wrap gap-1 mb-1">
                  <h6 className="text-dark text-truncate mb-0">
                    <button type="button" className="btn btn-link p-0 text-dark" onClick={() => onView(g.id)}>
                      {g.name}
                    </button>
                  </h6>
                  {g.vip ? (
                    <span className="badge badge-soft-purple d-inline-flex align-items-center">
                      <i className="ti ti-crown me-1" />
                      VIP
                    </span>
                  ) : null}
                </div>
                <span className={`badge ${g.relationshipBadgeClass}`}>{g.relationship}</span>
                {columns.occupation ? (
                  <span className="fs-12 text-muted d-block mt-1">
                    <i className="ti ti-briefcase me-1" />
                    {g.occupation}
                  </span>
                ) : null}
              </div>
            </div>
          </div>

          <div className="row g-2 mb-3">
            <div className="col-6">
              <p className="mb-0 fs-12">Phone</p>
              <p className="text-dark text-truncate mb-0">
                <i className="ti ti-phone text-muted me-1" />
                {g.phone}
              </p>
            </div>
            <div className="col-6">
              <p className="mb-0 fs-12">Email</p>
              <p className="text-dark text-truncate mb-0">
                <i className="ti ti-mail text-muted me-1" />
                {g.email}
              </p>
            </div>
            <div className="col-6">
              <p className="mb-0 fs-12">Students</p>
              <p className="text-dark mb-0">
                <i className="ti ti-users text-muted me-1" />
                {g.studentsLabel}
              </p>
            </div>
            {columns.branch ? (
              <div className="col-6">
                <p className="mb-0 fs-12">Branch</p>
                <p className="text-dark text-truncate mb-0">
                  <i className="ti ti-building text-muted me-1" />
                  {g.branch}
                </p>
              </div>
            ) : null}
          </div>

          <div className="border rounded-2 p-2 mb-3">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <div className="d-flex align-items-center overflow-hidden">
                <Link to={routes.studentDetail} className="avatar avatar-sm flex-shrink-0 me-2">
                  <ImageWithBasePath
                    src={g.students.avatar}
                    className="img-fluid rounded-circle flex-shrink-0"
                    alt={g.students.names}
                  />
                </Link>
                <div className="overflow-hidden">
                  <p className="text-dark text-truncate mb-0 fs-13">{g.students.names}</p>
                  <span className="fs-12 text-muted">{g.students.classes}</span>
                </div>
              </div>
              <Link to={routes.studentDetail} className="link-primary fs-12">
                View
              </Link>
            </div>
            <p className="fs-12 text-muted mb-1">
              <i className="ti ti-map-pin me-1" />
              {g.address}
            </p>
            <p className="fs-12 text-muted mb-1">
              <i className="ti ti-urgent me-1" />
              Emergency: {g.emergencyPhone}
            </p>
            <div className="d-flex align-items-center justify-content-between flex-wrap gap-1 fs-12 text-muted">
              {columns.lastLogin ? (
                <span>
                  <i className="ti ti-login me-1" />
                  {g.lastLogin}
                </span>
              ) : (
                <span />
              )}
              <span>
                <i className="ti ti-calendar-plus me-1" />
                {g.createdDate}
              </span>
            </div>
          </div>

          {columns.performance ? (
            <>
              <p className="fs-12 text-uppercase text-muted mb-2">Performance</p>
              {g.performance.map((metric, index) => (
                <div className={index === g.performance.length - 1 ? 'mb-0' : 'mb-2'} key={metric.id}>
                  <div className="d-flex align-items-center justify-content-between mb-1">
                    <span className="fs-12">
                      <i className={`${metric.icon} me-1`} />
                      {metric.label}
                    </span>
                    <span className={`fs-12 fw-medium ${metric.readoutClass}`}>{metric.readout}</span>
                  </div>
                  <div className="progress progress-xs">
                    <div
                      className={`progress-bar ${metric.barClass}`}
                      role="progressbar"
                      style={{ width: `${metric.percent}%` }}
                      aria-valuenow={metric.percent}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label={metric.label}
                    />
                  </div>
                </div>
              ))}
            </>
          ) : null}
        </div>

        <div className="card-footer d-flex align-items-center justify-content-between flex-wrap gap-2">
          <div className="d-flex align-items-center gap-1">
            <button
              type="button"
              className="btn btn-outline-light bg-white btn-icon d-flex align-items-center justify-content-center rounded-circle flex-shrink-0 p-0"
              aria-label="View Profile"
              onClick={() => onView(g.id)}
            >
              <i className="ti ti-eye" />
            </button>
            <button
              type="button"
              className="btn btn-outline-light bg-white btn-icon d-flex align-items-center justify-content-center rounded-circle flex-shrink-0 p-0"
              aria-label="Edit"
              onClick={() => onEdit(g.id)}
            >
              <i className="ti ti-edit" />
            </button>
            <Link
              to={routes.studentDetail}
              className="btn btn-outline-light bg-white btn-icon d-flex align-items-center justify-content-center rounded-circle flex-shrink-0 p-0"
              aria-label="View Students"
            >
              <i className="ti ti-school" />
            </Link>
          </div>
          <button type="button" className="btn btn-light btn-sm fw-semibold" onClick={() => onView(g.id)}>
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default GuardianCardItem;
