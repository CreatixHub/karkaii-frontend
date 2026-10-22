import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import ImageWithBasePath from '@core/common/imageWithBasePath';
import { all_routes } from '@/routes/all_routes';
import type { StudentCard } from '../data/students.data';
import type { StudentModalId } from '../data/studentsWorkspace.data';

const routes = all_routes;

export interface StudentCardItemProps {
  student: StudentCard;
  selected: boolean;
  onToggleSelect: (id: string) => void;
  menuOpen: boolean;
  onToggleMenu: (id: string | null) => void;
  onOpenModal: (modal: StudentModalId) => void;
  onPreview: (student: StudentCard) => void;
}

const StudentCardItem = ({
  student,
  selected,
  onToggleSelect,
  menuOpen,
  onToggleMenu,
  onOpenModal,
  onPreview,
}: StudentCardItemProps) => {
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

  return (
    <div className="col-xxl-3 col-xl-4 col-md-6 d-flex">
      <div className="card flex-fill mb-0">
        <div className="card-header d-flex align-items-center justify-content-between gap-2">
          <div className="d-flex align-items-center gap-2 overflow-hidden">
            <div className="form-check mb-0">
              <input
                className="form-check-input"
                type="checkbox"
                id={`pick_${student.admissionNo}`}
                aria-label={`Select ${student.name}`}
                checked={selected}
                onChange={() => onToggleSelect(student.id)}
              />
            </div>
            <span className="fs-12 fw-medium text-muted text-truncate">
              {student.admissionNo}
            </span>
          </div>

          <div className="d-flex align-items-center gap-2 flex-shrink-0">
            <span className={`d-inline-flex align-items-center fs-12 fw-medium text-${student.status.color}`}>
              <span className="status-dot me-1" />
              {student.status.label}
            </span>

            <div className="dropdown" ref={menuRef}>
              <button
                type="button"
                className="btn btn-icon btn-sm p-0 border-0 bg-transparent text-muted"
                aria-expanded={menuOpen}
                aria-label="Student actions"
                onClick={() => onToggleMenu(menuOpen ? null : student.id)}
              >
                <i className="ti ti-dots-vertical" />
              </button>

              <ul className={`dropdown-menu dropdown-menu-end p-2${menuOpen ? ' show' : ''}`}>
                <li className="context-menu-head">{student.name}</li>
                <li>
                  <button type="button" className="dropdown-item rounded-1" onClick={closeThen(() => {})}>
                    <i className="ti ti-star me-2" />
                    Add to Favourites
                  </button>
                </li>
                <li>
                  <Link className="dropdown-item rounded-1" to={routes.studentDetail} onClick={() => onToggleMenu(null)}>
                    <i className="ti ti-eye me-2" />
                    View Profile
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item rounded-1" to={routes.editStudent} onClick={() => onToggleMenu(null)}>
                    <i className="ti ti-edit-circle me-2" />
                    Edit Student
                  </Link>
                </li>
                <li>
                  <hr className="dropdown-divider my-2" />
                </li>
                <li>
                  <button type="button" className="dropdown-item rounded-1" onClick={closeThen(() => onOpenModal('attendance'))}>
                    <i className="ti ti-calendar-check me-2" />
                    Attendance
                  </button>
                </li>
                <li>
                  <button type="button" className="dropdown-item rounded-1" onClick={closeThen(() => onOpenModal('result'))}>
                    <i className="ti ti-file-certificate me-2" />
                    Marks
                  </button>
                </li>
                <li>
                  <button type="button" className="dropdown-item rounded-1" onClick={closeThen(() => onOpenModal('fees'))}>
                    <i className="ti ti-report-money me-2" />
                    Fee Details
                  </button>
                </li>
                <li>
                  <button type="button" className="dropdown-item rounded-1" onClick={closeThen(() => onPreview(student))}>
                    <i className="ti ti-users me-2" />
                    Parent Details
                  </button>
                </li>
                <li>
                  <hr className="dropdown-divider my-2" />
                </li>
                <li>
                  <button type="button" className="dropdown-item rounded-1" onClick={closeThen(() => onOpenModal('promote'))}>
                    <i className="ti ti-arrow-ramp-right-2 me-2" />
                    Promote Student
                  </button>
                </li>
                <li>
                  <Link className="dropdown-item rounded-1" to={routes.studentPromotion} onClick={() => onToggleMenu(null)}>
                    <i className="ti ti-transfer me-2" />
                    Transfer Student
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item rounded-1" to={routes.studentIdCards} onClick={() => onToggleMenu(null)}>
                    <i className="ti ti-id me-2" />
                    Download ID Card
                  </Link>
                </li>
                <li>
                  <button type="button" className="dropdown-item rounded-1" onClick={closeThen(() => onPreview(student))}>
                    <i className="ti ti-message-2 me-2" />
                    Send Message
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="card-body pb-2">
          {/* identity */}
          <div className="d-flex align-items-center gap-2 mb-3">
            <Link to={routes.studentDetail} className="avatar avatar-lg flex-shrink-0">
              <ImageWithBasePath
                src={student.avatar}
                className="img-fluid rounded-circle flex-shrink-0"
                alt={student.name}
              />
              <span
                className={`avatar-status avatar-status-sm avatar-status-inset ${student.presence}`}
                title="Online"
              />
            </Link>
            <div className="flex-fill overflow-hidden">
              <h4 className="mb-0 text-truncate fs-15 fw-medium">
                <Link to={routes.studentDetail}>{student.name}</Link>
              </h4>
              <p className="fs-12 text-muted mb-1 text-truncate">{student.meta}</p>
              <div className="d-flex align-items-center flex-wrap gap-1">
                {student.chips.map((chip) => (
                  <span className={`chip chip-soft ${chip.className}`} key={chip.label}>
                    {chip.label}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* academic facts */}
          <div className="row g-0 text-center border-top border-bottom py-2 mb-3">
            {[
              { label: 'Roll', value: student.roll, border: true },
              { label: 'Rank', value: student.rank, border: true },
              { label: 'Age', value: student.age, border: false },
            ].map((fact) => (
              <div className={`col-4 px-1${fact.border ? ' border-end' : ''}`} key={fact.label}>
                <span className="stat-caption d-block">{fact.label}</span>
                <span className="fw-semibold fs-13">{fact.value}</span>
              </div>
            ))}
          </div>

          {/* parent */}
          <div className="info-list-item info-list-item-sm d-flex align-items-center mb-3">
            <span className="avatar bg-body-secondary text-body-secondary flex-shrink-0">
              <i className="ti ti-user-shield" />
            </span>
            <div className="info-list-body">
              <b>{student.parent.name}</b>
              <span>{student.parent.info}</span>
            </div>
          </div>

          {/* statuses */}
          <div className="d-flex align-items-center flex-wrap gap-1">
            {student.badges.map((badge) => (
              <span className={`badge ${badge.className}`} key={badge.label}>
                <i className={`${badge.icon} me-1`} />
                {badge.label}
              </span>
            ))}
          </div>
        </div>

        <div className="card-footer d-flex align-items-center justify-content-between gap-2">
          <div className="d-flex align-items-center gap-1">
            <button
              type="button"
              className="btn btn-icon btn-sm p-0 border-0 bg-transparent text-muted"
              title="Call parent"
              aria-label="Call parent"
            >
              <i className="ti ti-phone" />
            </button>
            <button
              type="button"
              className="btn btn-icon btn-sm p-0 border-0 bg-transparent text-muted"
              title="Email"
              aria-label="Email"
            >
              <i className="ti ti-mail" />
            </button>
          </div>
          <button
            type="button"
            className="btn btn-sm btn-outline-primary fw-medium d-inline-flex align-items-center"
            onClick={() => onPreview(student)}
          >
            Quick View
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentCardItem;
