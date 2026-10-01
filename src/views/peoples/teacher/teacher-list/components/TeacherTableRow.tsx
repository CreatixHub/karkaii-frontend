import { Link } from 'react-router-dom';
import ImageWithBasePath from '@core/common/imageWithBasePath';
import { all_routes } from '@/routes/all_routes';
import type { Teacher } from '../data/teachers.data';
import type { ColumnKey, TeacherModalId } from '../data/teacherWorkspace.data';
import { ActionLink } from '@components/workspace';

const routes = all_routes;

export interface TeacherTableRowProps {
  teacher: Teacher;
  columns: Record<ColumnKey, boolean>;
  selected: boolean;
  expanded: boolean;
  menuOpen: boolean;
  onToggleSelect: (key: string) => void;
  onToggleExpand: (key: string) => void;
  onToggleMenu: (key: string | null) => void;
  onAction: (action: string) => void;
  onOpenModal: (modal: TeacherModalId, teacher: Teacher) => void;
}

const TeacherTableRow = ({
  teacher,
  columns,
  selected,
  expanded,
  menuOpen,
  onToggleSelect,
  onToggleExpand,
  onToggleMenu,
  onAction,
  onOpenModal,
}: TeacherTableRowProps) => (
  <>
    <tr
      className={`dt-row${selected ? ' dt-selected' : ''}${expanded ? ' expanded' : ''}`}
      data-cls-status={teacher.status}
      data-search={teacher.search}
    >
      <td>
        <button
          type="button"
          className="dt-expand"
          aria-label={`Expand ${teacher.name}`}
          aria-expanded={expanded}
          onClick={() => onToggleExpand(teacher.key)}
        >
          <i className="ti ti-chevron-right" />
        </button>
      </td>
      <td className="dt-pin">
        <input
          type="checkbox"
          className="dt-check row-select-cell"
          aria-label={`Select ${teacher.name}`}
          checked={selected}
          onChange={() => onToggleSelect(teacher.key)}
        />
      </td>
      <td data-cls-col="teacher" hidden={!columns.teacher}>
        <div className="dt-user">
          <Link to={routes.teacherDetails} className="dt-avatar">
            <ImageWithBasePath src={teacher.avatar} alt={teacher.name} />
          </Link>
          <div>
            <Link to={routes.teacherDetails} className="dt-name">
              {teacher.name}
            </Link>
            <div className="dt-sub">
              <span className="link-primary">{teacher.id}</span>
            </div>
          </div>
        </div>
      </td>
      <td data-cls-col="status" hidden={!columns.status}>
        <span className={`dt-pill is-${teacher.status.toLowerCase()}`}>
          <span className="dt-pill-dot" />
          {teacher.status}
        </span>
      </td>
      <td data-cls-col="class" hidden={!columns.class}>
        {teacher.classes}
      </td>
      <td data-cls-col="subject" hidden={!columns.subject}>
        <span className="badge badge-soft-primary">{teacher.subject}</span>
      </td>
      <td data-cls-col="email" hidden={!columns.email}>
        <a href={`mailto:${teacher.email}`} className="link-primary">
          {teacher.email}
        </a>
      </td>
      <td data-cls-col="phone" hidden={!columns.phone}>
        {teacher.phone}
      </td>
      <td data-cls-col="join" hidden={!columns.join}>
        {teacher.dateOfJoin}
      </td>
      <td>
        <div className="dt-actions">
          <Link to={routes.teacherDetails} className="dt-ib" title="View Profile" aria-label="View">
            <i className="ti ti-eye" />
          </Link>
          <Link to={routes.editTeacher} className="dt-ib" title="Edit" aria-label="Edit">
            <i className="ti ti-edit" />
          </Link>
          <ActionLink
            className="dt-ib"
            title="Message"
            ariaLabel="Message"
            onClick={() => onAction('message')}
          >
            <i className="ti ti-message" />
          </ActionLink>
          <ActionLink
            className="dt-ib"
            title="Login Details"
            ariaLabel="Login Details"
            onClick={() => onOpenModal('login', teacher)}
          >
            <i className="ti ti-lock" />
          </ActionLink>
          <div className="dropdown">
            <ActionLink
              className="dt-ib"
              title="More"
              ariaLabel="More actions"
              ariaExpanded={menuOpen}
              onClick={() => onToggleMenu(menuOpen ? null : teacher.key)}
            >
              <i className="ti ti-dots-vertical" />
            </ActionLink>
            <div className={`dropdown-menu dropdown-menu-end${menuOpen ? ' show' : ''}`}>
              <Link className="dropdown-item" to={routes.teacherDetails}>
                <i className="ti ti-eye" />
                View Teacher
              </Link>
              <Link className="dropdown-item" to={routes.editTeacher}>
                <i className="ti ti-edit" />
                Edit
              </Link>
              <button
                type="button"
                className="dropdown-item"
                onClick={() => {
                  onToggleMenu(null);
                  onOpenModal('login', teacher);
                }}
              >
                <i className="ti ti-lock" />
                Login Details
              </button>
              <Link className="dropdown-item" to={routes.teachersRoutine}>
                <i className="ti ti-table" />
                Timetable
              </Link>
              <button
                type="button"
                className="dropdown-item"
                onClick={() => {
                  onToggleMenu(null);
                  onAction('message');
                }}
              >
                <i className="ti ti-message" />
                Message
              </button>
              <button
                type="button"
                className="dropdown-item"
                onClick={() => {
                  onToggleMenu(null);
                  onAction('email');
                }}
              >
                <i className="ti ti-mail" />
                Email
              </button>
              <hr className="dropdown-divider" />
              <button
                type="button"
                className="dropdown-item"
                onClick={() => {
                  onToggleMenu(null);
                  onAction('disable');
                }}
              >
                <i className="ti ti-toggle-right" />
                Disable
              </button>
              <button
                type="button"
                className="dropdown-item text-danger"
                onClick={() => {
                  onToggleMenu(null);
                  onOpenModal('delete', teacher);
                }}
              >
                <i className="ti ti-trash-x" />
                Delete
              </button>
            </div>
          </div>
        </div>
      </td>
    </tr>
    <tr className={`dt-detail${expanded ? ' open' : ''}`}>
      <td colSpan={10}>
        <div className="dt-detail-inner">
          <div className="row g-4">
            <div className="col-xl-3 col-md-6">
              <h6 className="details-heading">
                <i className="ti ti-address-book" />
                Contact
              </h6>
              <p className="fs-12 text-muted mb-1">
                <i className="ti ti-phone me-1" />
                {teacher.phone}
              </p>
              <p className="fs-12 text-muted mb-0">
                <i className="ti ti-mail me-1" />
                {teacher.email}
              </p>
              <h6 className="details-heading mt-3">
                <i className="ti ti-map-pin" />
                Address
              </h6>
              <p className="fs-12 text-muted mb-0">{teacher.detail.address}</p>
            </div>
            <div className="col-xl-3 col-md-6">
              <h6 className="details-heading">
                <i className="ti ti-book" />
                Teaching
              </h6>
              <div className="d-flex flex-wrap gap-1 mb-2">
                {teacher.detail.subjects.map((subject) => (
                  <span className="badge badge-soft-primary" key={subject}>
                    {subject}
                  </span>
                ))}
              </div>
              <h6 className="details-heading">
                <i className="ti ti-school" />
                Classes Handled
              </h6>
              <p className="fs-13 fw-medium mb-2">{teacher.detail.classesHandled}</p>
              <h6 className="details-heading">
                <i className="ti ti-gauge" />
                Class Load
              </h6>
              <div className={`meter ${teacher.detail.loadVariant}`}>
                <span style={{ width: teacher.detail.loadWidth }} />
              </div>
              <p className="fs-12 text-muted mt-1 mb-0">{teacher.detail.loadLabel}</p>
            </div>
            <div className="col-xl-3 col-md-6">
              <h6 className="details-heading">
                <i className="ti ti-id" />
                Details
              </h6>
              <ul className="list-unstyled fs-12 mb-0">
                <li className="d-flex align-items-center justify-content-between py-1">
                  <span className="text-muted">Teacher ID</span>
                  <span className="fw-medium">{teacher.id}</span>
                </li>
                <li className="d-flex align-items-center justify-content-between py-1">
                  <span className="text-muted">Date of Join</span>
                  <span className="fw-medium">{teacher.dateOfJoin}</span>
                </li>
                <li className="d-flex align-items-center justify-content-between py-1">
                  <span className="text-muted">Qualification</span>
                  <span className="fw-medium">{teacher.detail.qualification}</span>
                </li>
                <li className="d-flex align-items-center justify-content-between py-1">
                  <span className="text-muted">Experience</span>
                  <span className="fw-medium">{teacher.detail.experience}</span>
                </li>
              </ul>
            </div>
            <div className="col-xl-3 col-md-6">
              <h6 className="details-heading">
                <i className="ti ti-notes" />
                Quick Notes
              </h6>
              <p className="fs-12 text-muted mb-2">{teacher.detail.note}</p>
              <div className="d-flex gap-2">
                <Link
                  to={routes.teacherDetails}
                  className="btn btn-outline-light bg-white btn-sm flex-fill"
                >
                  <i className="ti ti-user me-1" />
                  Full Profile
                </Link>
                <button
                  type="button"
                  className="btn btn-primary btn-sm flex-fill"
                  onClick={() => onAction('message')}
                >
                  <i className="ti ti-message me-1" />
                  Message
                </button>
              </div>
            </div>
          </div>
        </div>
      </td>
    </tr>
  </>
);

export default TeacherTableRow;
