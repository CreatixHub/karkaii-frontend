import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import ImageWithBasePath from '@core/common/imageWithBasePath';
import { all_routes } from '@/routes/all_routes';
import type { ParentRecord } from '../data/parents.data';

const routes = all_routes;

const feeToneClass = (status: ParentRecord['performance']['feeStatus']) =>
  status === 'Paid' ? 'text-success' : status === 'Partial' ? 'text-warning' : 'text-danger';

const feeBarClass = (status: ParentRecord['performance']['feeStatus']) =>
  status === 'Paid' ? 'bg-success' : status === 'Partial' ? 'bg-warning' : 'bg-danger';

const barClass = (value: number) => (value >= 75 ? 'bg-success' : value >= 40 ? 'bg-info' : 'bg-danger');

export interface ParentCardItemProps {
  parent: ParentRecord;
  selected: boolean;
  onSelect: (id: string) => void;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const ParentCardItem = ({ parent, selected, onSelect, onView, onEdit, onDelete }: ParentCardItemProps) => {
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

  const p = parent;
  const childrenLabel = p.children.map((child) => child.name).join(', ');
  const childrenClasses = p.children.map((child) => child.classLabel).join(', ');

  return (
    <div className="col-xxl-4 col-md-6 d-flex">
      <div className="card flex-fill mb-3">
        <div className="card-header d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center">
            <div className="form-check form-check-md me-2">
              <input
                className="form-check-input"
                type="checkbox"
                aria-label={`Select ${p.name}`}
                checked={selected}
                onChange={() => onSelect(p.id)}
              />
            </div>
            <button type="button" className="link-primary fw-medium btn btn-link p-0" onClick={() => onView(p.id)}>
              {p.id}
            </button>
          </div>
          <div className="d-flex align-items-center">
            <span className={`badge ${p.statusBadgeClass} d-inline-flex align-items-center me-2`}>
              <i className="ti ti-circle-filled fs-8 me-1" />
              {p.status}
            </span>
            <div className="dropdown" ref={menuRef}>
              <button
                type="button"
                className="btn btn-white btn-icon btn-sm d-flex align-items-center justify-content-center rounded-circle flex-shrink-0 p-0"
                aria-expanded={menuOpen}
                aria-label="Row actions"
                onClick={() => setMenuOpen((open) => !open)}
              >
                <i className="ti ti-dots-vertical fs-14" />
              </button>
              <ul className={`dropdown-menu dropdown-menu-end p-3${menuOpen ? ' show' : ''}`}>
                <li>
                  <button
                    className="dropdown-item rounded-1"
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      onView(p.id);
                    }}
                  >
                    <i className="ti ti-eye me-2" />
                    View Details
                  </button>
                </li>
                <li>
                  <button
                    className="dropdown-item rounded-1"
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      onEdit(p.id);
                    }}
                  >
                    <i className="ti ti-edit-circle me-2" />
                    Edit Parent
                  </button>
                </li>
                <li>
                  <Link className="dropdown-item rounded-1" to={routes.studentDetail} onClick={() => setMenuOpen(false)}>
                    <i className="ti ti-school me-2" />
                    View Students
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item rounded-1" to={routes.chat} onClick={() => setMenuOpen(false)}>
                    <i className="ti ti-message me-2" />
                    Send Message
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item rounded-1" to={routes.email} onClick={() => setMenuOpen(false)}>
                    <i className="ti ti-mail me-2" />
                    Send Email
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item rounded-1" to={routes.feeCollectionReport} onClick={() => setMenuOpen(false)}>
                    <i className="ti ti-report-money me-2" />
                    View Fee History
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item rounded-1" to={routes.attendanceReport} onClick={() => setMenuOpen(false)}>
                    <i className="ti ti-calendar-check me-2" />
                    Attendance Report
                  </Link>
                </li>
                <li>
                  <button className="dropdown-item rounded-1" type="button" onClick={() => setMenuOpen(false)}>
                    <i className="ti ti-download me-2" />
                    Download Profile
                  </button>
                </li>
                <li>
                  <hr className="dropdown-divider my-2" />
                </li>
                <li>
                  <button
                    className="dropdown-item rounded-1 text-danger"
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      onDelete(p.id);
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
                className={`avatar avatar-lg flex-shrink-0 btn p-0 border-0${p.online ? ' online' : ''}`}
                onClick={() => onView(p.id)}
              >
                <ImageWithBasePath src={p.avatar} className="img-fluid rounded-circle flex-shrink-0" alt={p.name} />
              </button>
              <div className="ms-2 overflow-hidden">
                <div className="d-flex align-items-center flex-wrap gap-1 mb-1">
                  <h6 className="text-dark text-truncate mb-0">
                    <button type="button" className="btn btn-link p-0 text-dark" onClick={() => onView(p.id)}>
                      {p.name}
                    </button>
                  </h6>
                  {p.vip ? (
                    <span className="badge badge-soft-purple d-inline-flex align-items-center">
                      <i className="ti ti-crown me-1" />
                      VIP
                    </span>
                  ) : null}
                </div>
                <span className={`badge ${p.relationBadgeClass}`}>{p.relation}</span>
                <span className="fs-12 text-muted d-block mt-1">
                  <i className="ti ti-briefcase me-1" />
                  {p.occupation}
                </span>
              </div>
            </div>
          </div>
          <div className="row g-2 mb-3">
            <div className="col-12 col-sm-6">
              <p className="mb-0 fs-12">Phone</p>
              <p className="text-dark text-truncate mb-0">
                <i className="ti ti-phone text-muted me-1" />
                {p.phone}
              </p>
            </div>
            <div className="col-12 col-sm-6">
              <p className="mb-0 fs-12">Email</p>
              <p className="text-dark text-truncate mb-0">
                <i className="ti ti-mail text-muted me-1" />
                {p.email}
              </p>
            </div>
            <div className="col-12 col-sm-6">
              <p className="mb-0 fs-12">Students</p>
              <p className="text-dark mb-0">
                <i className="ti ti-users text-muted me-1" />
                {p.children.length} Assigned
              </p>
            </div>
            <div className="col-12 col-sm-6">
              <p className="mb-0 fs-12">Branch</p>
              <p className="text-dark text-truncate mb-0">
                <i className="ti ti-building text-muted me-1" />
                {p.branch}
              </p>
            </div>
          </div>
          <div className="border rounded-2 p-2 mb-3">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <div className="d-flex align-items-center overflow-hidden">
                <Link to={routes.studentDetail} className="avatar avatar-sm flex-shrink-0 me-2">
                  <ImageWithBasePath src={p.children[0].avatar} className="img-fluid rounded-circle flex-shrink-0" alt={p.children[0].name} />
                </Link>
                <div className="overflow-hidden">
                  <p className="text-dark text-truncate mb-0 fs-13">{childrenLabel}</p>
                  <span className="fs-12 text-muted">{childrenClasses}</span>
                </div>
              </div>
              <Link to={routes.studentDetail} className="link-primary fs-12">
                View
              </Link>
            </div>
            <p className="fs-12 text-muted mb-1">
              <i className="ti ti-map-pin me-1" />
              {p.address.split(',').slice(0, 2).join(',')}
            </p>
            <p className="fs-12 text-muted mb-1">
              <i className="ti ti-urgent me-1" />
              Emergency: {p.emergencyPhone}
            </p>
            <div className="d-flex align-items-center justify-content-between flex-wrap gap-1 fs-12 text-muted">
              <span>
                <i className="ti ti-login me-1" />
                Last login {p.lastLogin}
              </span>
              <span>
                <i className="ti ti-calendar-plus me-1" />
                {p.joined}
              </span>
            </div>
          </div>
          <p className="fs-12 text-uppercase text-muted mb-2">Performance</p>
          <div className="mb-2">
            <div className="d-flex align-items-center justify-content-between mb-1">
              <span className="fs-12">
                <i className="ti ti-report-money me-1" />
                Fee Payment
              </span>
              <span className={`fs-12 fw-medium ${feeToneClass(p.performance.feeStatus)}`}>{p.performance.feeStatus}</span>
            </div>
            <div className="progress progress-xs">
              <div
                className={`progress-bar ${feeBarClass(p.performance.feeStatus)}`}
                role="progressbar"
                style={{ width: `${p.performance.feePercent}%` }}
                aria-valuenow={p.performance.feePercent}
                aria-valuemin={0}
                aria-valuemax={100}
              />
            </div>
          </div>
          <div className="mb-2">
            <div className="d-flex align-items-center justify-content-between mb-1">
              <span className="fs-12">
                <i className="ti ti-users-group me-1" />
                PTM Attendance
              </span>
              <span className="fs-12 fw-medium text-dark">{p.performance.ptmAttendance}%</span>
            </div>
            <div className="progress progress-xs">
              <div
                className={`progress-bar ${barClass(p.performance.ptmAttendance)}`}
                role="progressbar"
                style={{ width: `${p.performance.ptmAttendance}%` }}
                aria-valuenow={p.performance.ptmAttendance}
                aria-valuemin={0}
                aria-valuemax={100}
              />
            </div>
          </div>
          <div className="mb-2">
            <div className="d-flex align-items-center justify-content-between mb-1">
              <span className="fs-12">
                <i className="ti ti-message-2 me-1" />
                Communication
              </span>
              <span className="fs-12 fw-medium text-dark">{p.performance.communication}%</span>
            </div>
            <div className="progress progress-xs">
              <div
                className="progress-bar bg-info"
                role="progressbar"
                style={{ width: `${p.performance.communication}%` }}
                aria-valuenow={p.performance.communication}
                aria-valuemin={0}
                aria-valuemax={100}
              />
            </div>
          </div>
          <div className="mb-0">
            <div className="d-flex align-items-center justify-content-between mb-1">
              <span className="fs-12">
                <i className="ti ti-device-mobile me-1" />
                Mobile App Usage
              </span>
              <span className="fs-12 fw-medium text-dark">{p.performance.mobileUsage}%</span>
            </div>
            <div className="progress progress-xs">
              <div
                className={`progress-bar ${barClass(p.performance.mobileUsage)}`}
                role="progressbar"
                style={{ width: `${p.performance.mobileUsage}%` }}
                aria-valuenow={p.performance.mobileUsage}
                aria-valuemin={0}
                aria-valuemax={100}
              />
            </div>
          </div>
        </div>
        <div className="card-footer d-flex align-items-center justify-content-between flex-wrap gap-2">
          <div className="d-flex align-items-center gap-1">
            <button
              type="button"
              className="btn btn-outline-light bg-white btn-icon d-flex align-items-center justify-content-center rounded-circle flex-shrink-0 p-0"
              aria-label="View Profile"
              onClick={() => onView(p.id)}
            >
              <i className="ti ti-eye" />
            </button>
            <button
              type="button"
              className="btn btn-outline-light bg-white btn-icon d-flex align-items-center justify-content-center rounded-circle flex-shrink-0 p-0"
              aria-label="Edit"
              onClick={() => onEdit(p.id)}
            >
              <i className="ti ti-edit" />
            </button>
            <Link
              to={routes.chat}
              className="btn btn-outline-light bg-white btn-icon d-flex align-items-center justify-content-center rounded-circle flex-shrink-0 p-0"
              aria-label="Message"
            >
              <i className="ti ti-brand-hipchat" />
            </Link>
            <Link
              to={routes.audioCall}
              className="btn btn-outline-light bg-white btn-icon d-flex align-items-center justify-content-center rounded-circle flex-shrink-0 p-0"
              aria-label="Call"
            >
              <i className="ti ti-phone" />
            </Link>
            <Link
              to={routes.studentDetail}
              className="btn btn-outline-light bg-white btn-icon d-flex align-items-center justify-content-center rounded-circle flex-shrink-0 p-0"
              aria-label="View Students"
            >
              <i className="ti ti-school" />
            </Link>
          </div>
          <button type="button" className="btn btn-light btn-sm fw-semibold" onClick={() => onView(p.id)}>
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default ParentCardItem;
