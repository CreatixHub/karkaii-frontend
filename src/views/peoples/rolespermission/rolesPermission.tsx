import { Link } from "react-router-dom";
import { all_routes } from "../../../routes/all_routes";
import RolesPermissionModal from "./rolesPermissionModal"


const RolesPermission = () => {
  return (
   <>
  {/* Page Wrapper */}
  <div className="page-wrapper">
    <div className="content content-two">
      {/* Page Header */}
      <div className="d-md-flex d-block align-items-center justify-content-between flex-wrap gap-2 mb-4">
        <div className="my-auto mb-2">
          <h3 className="page-title mb-1">Roles &amp; Permissions</h3>
          <nav>
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item">
                <Link to={all_routes.adminDashboard}>Dashboard</Link>
              </li>
              <li className="breadcrumb-item">
                <a href="#">Administration</a>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Roles &amp; Permissions
              </li>
            </ol>
          </nav>
        </div>
        <div className="d-flex my-xl-auto right-content align-items-center flex-wrap gap-2">
          <button
            type="button"
            className="btn btn-outline-light bg-white fw-medium d-inline-flex align-items-center"
            data-rp-action="clone"
          >
            <i className="ti ti-copy me-1" />
            Clone Role
          </button>
          <button
            type="button"
            className="btn btn-outline-light bg-white fw-medium d-inline-flex align-items-center"
            data-rp-action="import"
          >
            <i className="ti ti-file-import me-1" />
            Import
          </button>
          <div className="dropdown">
            <a
              href="#"
              className="dropdown-toggle btn btn-outline-light bg-white fw-medium d-inline-flex align-items-center"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <i className="ti ti-file-export me-1" />
              Export
            </a>
            <ul className="dropdown-menu dropdown-menu-end p-2">
              <li>
                <a
                  href="#"
                  className="dropdown-item rounded-1"
                >
                  <i className="ti ti-file-type-pdf me-2" />
                  Export as PDF
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="dropdown-item rounded-1"
                >
                  <i className="ti ti-file-type-xls me-2" />
                  Export as Excel
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="dropdown-item rounded-1"
                >
                  <i className="ti ti-file-type-csv me-2" />
                  Export as CSV
                </a>
              </li>
            </ul>
          </div>
          <a
            href="audit-log.html"
            className="btn btn-outline-light bg-white fw-medium d-inline-flex align-items-center"
          >
            <i className="ti ti-history me-1" />
            Audit Logs
          </a>
          <button
            type="button"
            className="btn btn-primary d-inline-flex align-items-center"
            data-bs-toggle="modal"
            data-bs-target="#add_role"
          >
            <i className="ti ti-square-rounded-plus me-1" />
            Create Role
          </button>
        </div>
      </div>
      {/* /Page Header */}
      {/* Overview cards */}
      <div className="row g-3 mb-4">
        <div className="col-xl-3 col-sm-6 d-flex">
          <div className="stats-card stats-card-directory stats-primary">
            <span className="stats-avatar stats-icon">
              <i className="ti ti-shield-half" />
            </span>
            <div>
              <h3 className="stats-value mb-0">14</h3>
              <p className="stats-label">Total Roles</p>
              <span className="stats-role">+2 this month</span>
            </div>
          </div>
        </div>
        <div className="col-xl-3 col-sm-6 d-flex">
          <div className="stats-card stats-card-directory stats-purple">
            <span className="stats-avatar stats-icon">
              <i className="ti ti-shield-cog" />
            </span>
            <div>
              <h3 className="stats-value mb-0">6</h3>
              <p className="stats-label">Custom Roles</p>
              <span className="stats-role">User defined</span>
            </div>
          </div>
        </div>
        <div className="col-xl-3 col-sm-6 d-flex">
          <div className="stats-card stats-card-directory stats-success">
            <span className="stats-avatar stats-icon">
              <i className="ti ti-key" />
            </span>
            <div>
              <h3 className="stats-value mb-0">26</h3>
              <p className="stats-label">Permission Groups</p>
              <span className="stats-role">Modules mapped</span>
            </div>
          </div>
        </div>
        <div className="col-xl-3 col-sm-6 d-flex">
          <div className="stats-card stats-card-directory stats-warning">
            <span className="stats-avatar stats-icon">
              <i className="ti ti-clock-check" />
            </span>
            <div>
              <h3 className="stats-value mb-0">5</h3>
              <p className="stats-label">Pending Approvals</p>
              <span className="stats-role">Needs review</span>
            </div>
          </div>
        </div>
      </div>
      {/* /Overview cards */}
      {/* Workspace */}
      <div className="roles-page" id="rolePermWorkspace">
        <div className="row g-3">
          {/* ===================== ROLE DIRECTORY (left) ===================== */}
          <div className="col-12 col-xl-5 col-lg-12 d-flex">
            <div className="card flex-fill mb-0">
              <div className="card-header">
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <h4 className="mb-0 d-flex align-items-center fs-16 fw-medium">
                    <i className="ti ti-list-check text-primary me-2" />
                    Role Directory
                  </h4>
                  <span className="badge badge-soft-primary" id="rpRoleCount">
                    14
                  </span>
                </div>
                <div className="directory-search mb-3">
                  <i className="ti ti-search" />
                  <input
                    type="text"
                    className="form-control"
                    id="rpDirSearch"
                    placeholder="Search roles…"
                    aria-label="Search roles"
                  />
                </div>
                <div className="category-list">
                  <button
                    type="button"
                    className="category-row active"
                    data-rp-cat="all"
                  >
                    All
                  </button>
                  <button
                    type="button"
                    className="category-row"
                    data-rp-cat="system"
                  >
                    System
                  </button>
                  <button
                    type="button"
                    className="category-row"
                    data-rp-cat="custom"
                  >
                    Custom
                  </button>
                  <button
                    type="button"
                    className="category-row"
                    data-rp-cat="recent"
                  >
                    Recently Updated
                  </button>
                </div>
              </div>
              <div className="card-body d-flex flex-column">
                <div className="directory-list" id="rpDirList">
                  <div
                    className="role-card active"
                    data-rp-role=""
                    data-rp-cat="system recent"
                    data-name="Administrator"
                    data-desc="Full, unrestricted access to every module, setting and user across the institution."
                    data-icon="ti-crown"
                    data-users={12}
                    data-perms={248}
                    data-type="System Role"
                    data-status="Active"
                  >
                    <span className="role-card-icon role-icon-primary">
                      <i className="ti ti-crown" />
                    </span>
                    <div className="role-card-body">
                      <p className="role-card-name">Administrator</p>
                      <div className="role-card-meta">
                        <span>
                          <i className="ti ti-users" />
                          12 users
                        </span>
                        <span>
                          <i className="ti ti-key" />
                          248 perms
                        </span>
                        <span>
                          <i className="ti ti-clock" />
                          2h ago
                        </span>
                      </div>
                    </div>
                    <span className="role-card-dot" title="Active" />
                    <div className="dropdown" data-rp-menu="">
                      <button
                        type="button"
                        className="btn btn-icon btn-sm rounded-circle flex-shrink-0"
                        data-bs-toggle="dropdown"
                        aria-label="Role actions"
                      >
                        <i className="ti ti-dots-vertical" />
                      </button>
                      <ul className="dropdown-menu dropdown-menu-end">
                        <li>
                          <a
                            className="dropdown-item"
                            href="#"
                          >
                            <i className="ti ti-eye me-2" />
                            View
                          </a>
                        </li>
                        <li>
                          <a
                            className="dropdown-item"
                            href="#"
                            data-bs-toggle="modal"
                            data-bs-target="#edit_role"
                          >
                            <i className="ti ti-edit me-2" />
                            Edit
                          </a>
                        </li>
                        <li>
                          <a
                            className="dropdown-item"
                            href="#"
                            data-rp-action="clone"
                          >
                            <i className="ti ti-copy me-2" />
                            Clone
                          </a>
                        </li>
                        <li>
                          <a
                            className="dropdown-item"
                            href="#"
                            data-rp-action="compare"
                          >
                            <i className="ti ti-git-compare me-2" />
                            Compare
                          </a>
                        </li>
                        <li>
                          <hr className="dropdown-divider" />
                        </li>
                        <li>
                          <a
                            className="dropdown-item text-danger"
                            href="#"
                            data-bs-toggle="modal"
                            data-bs-target="#delete-modal"
                          >
                            <i className="ti ti-trash me-2" />
                            Delete
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div
                    className="role-card"
                    data-rp-role=""
                    data-rp-cat="system"
                    data-name="Principal"
                    data-desc="Institution-wide oversight with access to academics, staff, finance and reports."
                    data-icon="ti-user-star"
                    data-users={2}
                    data-perms={214}
                    data-type="System Role"
                    data-status="Active"
                  >
                    <span className="role-card-icon role-icon-indigo">
                      <i className="ti ti-user-star" />
                    </span>
                    <div className="role-card-body">
                      <p className="role-card-name">Principal</p>
                      <div className="role-card-meta">
                        <span>
                          <i className="ti ti-users" />2 users
                        </span>
                        <span>
                          <i className="ti ti-key" />
                          214 perms
                        </span>
                        <span>
                          <i className="ti ti-clock" />
                          1d ago
                        </span>
                      </div>
                    </div>
                    <span className="role-card-dot" title="Active" />
                    <div className="dropdown" data-rp-menu="">
                      <button
                        type="button"
                        className="btn btn-icon btn-sm rounded-circle flex-shrink-0"
                        data-bs-toggle="dropdown"
                        aria-label="Role actions"
                      >
                        <i className="ti ti-dots-vertical" />
                      </button>
                      <ul className="dropdown-menu dropdown-menu-end">
                        <li>
                          <a
                            className="dropdown-item"
                            href="#"
                          >
                            <i className="ti ti-eye me-2" />
                            View
                          </a>
                        </li>
                        <li>
                          <a
                            className="dropdown-item"
                            href="#"
                            data-bs-toggle="modal"
                            data-bs-target="#edit_role"
                          >
                            <i className="ti ti-edit me-2" />
                            Edit
                          </a>
                        </li>
                        <li>
                          <a
                            className="dropdown-item"
                            href="#"
                            data-rp-action="clone"
                          >
                            <i className="ti ti-copy me-2" />
                            Clone
                          </a>
                        </li>
                        <li>
                          <a
                            className="dropdown-item"
                            href="#"
                            data-rp-action="compare"
                          >
                            <i className="ti ti-git-compare me-2" />
                            Compare
                          </a>
                        </li>
                        <li>
                          <hr className="dropdown-divider" />
                        </li>
                        <li>
                          <a
                            className="dropdown-item text-danger"
                            href="#"
                            data-bs-toggle="modal"
                            data-bs-target="#delete-modal"
                          >
                            <i className="ti ti-trash me-2" />
                            Delete
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div
                    className="role-card"
                    data-rp-role=""
                    data-rp-cat="system"
                    data-name="Vice Principal"
                    data-desc="Supports the principal with academic and staff management privileges."
                    data-icon="ti-user-shield"
                    data-users={2}
                    data-perms={196}
                    data-type="System Role"
                    data-status="Active"
                  >
                    <span className="role-card-icon role-icon-indigo">
                      <i className="ti ti-user-shield" />
                    </span>
                    <div className="role-card-body">
                      <p className="role-card-name">Vice Principal</p>
                      <div className="role-card-meta">
                        <span>
                          <i className="ti ti-users" />2 users
                        </span>
                        <span>
                          <i className="ti ti-key" />
                          196 perms
                        </span>
                        <span>
                          <i className="ti ti-clock" />
                          3d ago
                        </span>
                      </div>
                    </div>
                    <span className="role-card-dot" title="Active" />
                    <div className="dropdown" data-rp-menu="">
                      <button
                        type="button"
                        className="btn btn-icon btn-sm rounded-circle flex-shrink-0"
                        data-bs-toggle="dropdown"
                        aria-label="Role actions"
                      >
                        <i className="ti ti-dots-vertical" />
                      </button>
                      <ul className="dropdown-menu dropdown-menu-end">
                        <li>
                          <a
                            className="dropdown-item"
                            href="#"
                          >
                            <i className="ti ti-eye me-2" />
                            View
                          </a>
                        </li>
                        <li>
                          <a
                            className="dropdown-item"
                            href="#"
                            data-bs-toggle="modal"
                            data-bs-target="#edit_role"
                          >
                            <i className="ti ti-edit me-2" />
                            Edit
                          </a>
                        </li>
                        <li>
                          <a
                            className="dropdown-item"
                            href="#"
                            data-rp-action="clone"
                          >
                            <i className="ti ti-copy me-2" />
                            Clone
                          </a>
                        </li>
                        <li>
                          <a
                            className="dropdown-item"
                            href="#"
                            data-rp-action="compare"
                          >
                            <i className="ti ti-git-compare me-2" />
                            Compare
                          </a>
                        </li>
                        <li>
                          <hr className="dropdown-divider" />
                        </li>
                        <li>
                          <a
                            className="dropdown-item text-danger"
                            href="#"
                            data-bs-toggle="modal"
                            data-bs-target="#delete-modal"
                          >
                            <i className="ti ti-trash me-2" />
                            Delete
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div
                    className="role-card"
                    data-rp-role=""
                    data-rp-cat="system recent"
                    data-name="Teacher"
                    data-desc="Access to assigned classes, attendance, assignments, homework and grades."
                    data-icon="ti-chalkboard"
                    data-users={86}
                    data-perms={92}
                    data-type="System Role"
                    data-status="Active"
                  >
                    <span className="role-card-icon role-icon-success">
                      <i className="ti ti-chalkboard" />
                    </span>
                    <div className="role-card-body">
                      <p className="role-card-name">Teacher</p>
                      <div className="role-card-meta">
                        <span>
                          <i className="ti ti-users" />
                          86 users
                        </span>
                        <span>
                          <i className="ti ti-key" />
                          92 perms
                        </span>
                        <span>
                          <i className="ti ti-clock" />
                          5h ago
                        </span>
                      </div>
                    </div>
                    <span className="role-card-dot" title="Active" />
                    <div className="dropdown" data-rp-menu="">
                      <button
                        type="button"
                        className="btn btn-icon btn-sm rounded-circle flex-shrink-0"
                        data-bs-toggle="dropdown"
                        aria-label="Role actions"
                      >
                        <i className="ti ti-dots-vertical" />
                      </button>
                      <ul className="dropdown-menu dropdown-menu-end">
                        <li>
                          <a
                            className="dropdown-item"
                            href="#"
                          >
                            <i className="ti ti-eye me-2" />
                            View
                          </a>
                        </li>
                        <li>
                          <a
                            className="dropdown-item"
                            href="#"
                            data-bs-toggle="modal"
                            data-bs-target="#edit_role"
                          >
                            <i className="ti ti-edit me-2" />
                            Edit
                          </a>
                        </li>
                        <li>
                          <a
                            className="dropdown-item"
                            href="#"
                            data-rp-action="clone"
                          >
                            <i className="ti ti-copy me-2" />
                            Clone
                          </a>
                        </li>
                        <li>
                          <a
                            className="dropdown-item"
                            href="#"
                            data-rp-action="compare"
                          >
                            <i className="ti ti-git-compare me-2" />
                            Compare
                          </a>
                        </li>
                        <li>
                          <hr className="dropdown-divider" />
                        </li>
                        <li>
                          <a
                            className="dropdown-item text-danger"
                            href="#"
                            data-bs-toggle="modal"
                            data-bs-target="#delete-modal"
                          >
                            <i className="ti ti-trash me-2" />
                            Delete
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div
                    className="role-card"
                    data-rp-role=""
                    data-rp-cat="custom recent"
                    data-name="Class Teacher"
                    data-desc="Extended teacher access for managing a class section and its students."
                    data-icon="ti-users-group"
                    data-users={24}
                    data-perms={104}
                    data-type="Custom Role"
                    data-status="Active"
                  >
                    <span className="role-card-icon role-icon-success">
                      <i className="ti ti-users-group" />
                    </span>
                    <div className="role-card-body">
                      <p className="role-card-name">Class Teacher</p>
                      <div className="role-card-meta">
                        <span>
                          <i className="ti ti-users" />
                          24 users
                        </span>
                        <span>
                          <i className="ti ti-key" />
                          104 perms
                        </span>
                        <span>
                          <i className="ti ti-clock" />
                          1d ago
                        </span>
                      </div>
                    </div>
                    <span className="role-card-dot" title="Active" />
                    <div className="dropdown" data-rp-menu="">
                      <button
                        type="button"
                        className="btn btn-icon btn-sm rounded-circle flex-shrink-0"
                        data-bs-toggle="dropdown"
                        aria-label="Role actions"
                      >
                        <i className="ti ti-dots-vertical" />
                      </button>
                      <ul className="dropdown-menu dropdown-menu-end">
                        <li>
                          <a
                            className="dropdown-item"
                            href="#"
                          >
                            <i className="ti ti-eye me-2" />
                            View
                          </a>
                        </li>
                        <li>
                          <a
                            className="dropdown-item"
                            href="#"
                            data-bs-toggle="modal"
                            data-bs-target="#edit_role"
                          >
                            <i className="ti ti-edit me-2" />
                            Edit
                          </a>
                        </li>
                        <li>
                          <a
                            className="dropdown-item"
                            href="#"
                            data-rp-action="clone"
                          >
                            <i className="ti ti-copy me-2" />
                            Clone
                          </a>
                        </li>
                        <li>
                          <a
                            className="dropdown-item"
                            href="#"
                            data-rp-action="compare"
                          >
                            <i className="ti ti-git-compare me-2" />
                            Compare
                          </a>
                        </li>
                        <li>
                          <hr className="dropdown-divider" />
                        </li>
                        <li>
                          <a
                            className="dropdown-item text-danger"
                            href="#"
                            data-bs-toggle="modal"
                            data-bs-target="#delete-modal"
                          >
                            <i className="ti ti-trash me-2" />
                            Delete
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div
                    className="role-card"
                    data-rp-role=""
                    data-rp-cat="system"
                    data-name="Student"
                    data-desc="Read access to timetable, assignments, results, library and fees."
                    data-icon="ti-school"
                    data-users={3256}
                    data-perms={28}
                    data-type="System Role"
                    data-status="Active"
                  >
                    <span className="role-card-icon role-icon-teal">
                      <i className="ti ti-school" />
                    </span>
                    <div className="role-card-body">
                      <p className="role-card-name">Student</p>
                      <div className="role-card-meta">
                        <span>
                          <i className="ti ti-users" />
                          3256 users
                        </span>
                        <span>
                          <i className="ti ti-key" />
                          28 perms
                        </span>
                        <span>
                          <i className="ti ti-clock" />
                          2d ago
                        </span>
                      </div>
                    </div>
                    <span className="role-card-dot" title="Active" />
                    <div className="dropdown" data-rp-menu="">
                      <button
                        type="button"
                        className="btn btn-icon btn-sm rounded-circle flex-shrink-0"
                        data-bs-toggle="dropdown"
                        aria-label="Role actions"
                      >
                        <i className="ti ti-dots-vertical" />
                      </button>
                      <ul className="dropdown-menu dropdown-menu-end">
                        <li>
                          <a
                            className="dropdown-item"
                            href="#"
                          >
                            <i className="ti ti-eye me-2" />
                            View
                          </a>
                        </li>
                        <li>
                          <a
                            className="dropdown-item"
                            href="#"
                            data-bs-toggle="modal"
                            data-bs-target="#edit_role"
                          >
                            <i className="ti ti-edit me-2" />
                            Edit
                          </a>
                        </li>
                        <li>
                          <a
                            className="dropdown-item"
                            href="#"
                            data-rp-action="clone"
                          >
                            <i className="ti ti-copy me-2" />
                            Clone
                          </a>
                        </li>
                        <li>
                          <a
                            className="dropdown-item"
                            href="#"
                            data-rp-action="compare"
                          >
                            <i className="ti ti-git-compare me-2" />
                            Compare
                          </a>
                        </li>
                        <li>
                          <hr className="dropdown-divider" />
                        </li>
                        <li>
                          <a
                            className="dropdown-item text-danger"
                            href="#"
                            data-bs-toggle="modal"
                            data-bs-target="#delete-modal"
                          >
                            <i className="ti ti-trash me-2" />
                            Delete
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div
                    className="role-card"
                    data-rp-role=""
                    data-rp-cat="system"
                    data-name="Parent"
                    data-desc="View child attendance, results, fees and school communication."
                    data-icon="ti-users"
                    data-users={2890}
                    data-perms={22}
                    data-type="System Role"
                    data-status="Active"
                  >
                    <span className="role-card-icon role-icon-purple">
                      <i className="ti ti-users" />
                    </span>
                    <div className="role-card-body">
                      <p className="role-card-name">Parent</p>
                      <div className="role-card-meta">
                        <span>
                          <i className="ti ti-users" />
                          2890 users
                        </span>
                        <span>
                          <i className="ti ti-key" />
                          22 perms
                        </span>
                        <span>
                          <i className="ti ti-clock" />
                          4d ago
                        </span>
                      </div>
                    </div>
                    <span className="role-card-dot" title="Active" />
                    <div className="dropdown" data-rp-menu="">
                      <button
                        type="button"
                        className="btn btn-icon btn-sm rounded-circle flex-shrink-0"
                        data-bs-toggle="dropdown"
                        aria-label="Role actions"
                      >
                        <i className="ti ti-dots-vertical" />
                      </button>
                      <ul className="dropdown-menu dropdown-menu-end">
                        <li>
                          <a
                            className="dropdown-item"
                            href="#"
                          >
                            <i className="ti ti-eye me-2" />
                            View
                          </a>
                        </li>
                        <li>
                          <a
                            className="dropdown-item"
                            href="#"
                            data-bs-toggle="modal"
                            data-bs-target="#edit_role"
                          >
                            <i className="ti ti-edit me-2" />
                            Edit
                          </a>
                        </li>
                        <li>
                          <a
                            className="dropdown-item"
                            href="#"
                            data-rp-action="clone"
                          >
                            <i className="ti ti-copy me-2" />
                            Clone
                          </a>
                        </li>
                        <li>
                          <a
                            className="dropdown-item"
                            href="#"
                            data-rp-action="compare"
                          >
                            <i className="ti ti-git-compare me-2" />
                            Compare
                          </a>
                        </li>
                        <li>
                          <hr className="dropdown-divider" />
                        </li>
                        <li>
                          <a
                            className="dropdown-item text-danger"
                            href="#"
                            data-bs-toggle="modal"
                            data-bs-target="#delete-modal"
                          >
                            <i className="ti ti-trash me-2" />
                            Delete
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div
                    className="role-card"
                    data-rp-role=""
                    data-rp-cat="custom recent"
                    data-name="Accountant"
                    data-desc="Manage fees, invoices, transactions and financial reports."
                    data-icon="ti-calculator"
                    data-users={4}
                    data-perms={76}
                    data-type="Custom Role"
                    data-status="Active"
                  >
                    <span className="role-card-icon role-icon-amber">
                      <i className="ti ti-calculator" />
                    </span>
                    <div className="role-card-body">
                      <p className="role-card-name">Accountant</p>
                      <div className="role-card-meta">
                        <span>
                          <i className="ti ti-users" />4 users
                        </span>
                        <span>
                          <i className="ti ti-key" />
                          76 perms
                        </span>
                        <span>
                          <i className="ti ti-clock" />
                          6h ago
                        </span>
                      </div>
                    </div>
                    <span className="role-card-dot" title="Active" />
                    <div className="dropdown" data-rp-menu="">
                      <button
                        type="button"
                        className="btn btn-icon btn-sm rounded-circle flex-shrink-0"
                        data-bs-toggle="dropdown"
                        aria-label="Role actions"
                      >
                        <i className="ti ti-dots-vertical" />
                      </button>
                      <ul className="dropdown-menu dropdown-menu-end">
                        <li>
                          <a
                            className="dropdown-item"
                            href="#"
                          >
                            <i className="ti ti-eye me-2" />
                            View
                          </a>
                        </li>
                        <li>
                          <a
                            className="dropdown-item"
                            href="#"
                            data-bs-toggle="modal"
                            data-bs-target="#edit_role"
                          >
                            <i className="ti ti-edit me-2" />
                            Edit
                          </a>
                        </li>
                        <li>
                          <a
                            className="dropdown-item"
                            href="#"
                            data-rp-action="clone"
                          >
                            <i className="ti ti-copy me-2" />
                            Clone
                          </a>
                        </li>
                        <li>
                          <a
                            className="dropdown-item"
                            href="#"
                            data-rp-action="compare"
                          >
                            <i className="ti ti-git-compare me-2" />
                            Compare
                          </a>
                        </li>
                        <li>
                          <hr className="dropdown-divider" />
                        </li>
                        <li>
                          <a
                            className="dropdown-item text-danger"
                            href="#"
                            data-bs-toggle="modal"
                            data-bs-target="#delete-modal"
                          >
                            <i className="ti ti-trash me-2" />
                            Delete
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div
                    className="role-card"
                    data-rp-role=""
                    data-rp-cat="custom"
                    data-name="HR"
                    data-desc="Manage staff records, payroll, leaves and departments."
                    data-icon="ti-briefcase"
                    data-users={3}
                    data-perms={88}
                    data-type="Custom Role"
                    data-status="Active"
                  >
                    <span className="role-card-icon role-icon-amber">
                      <i className="ti ti-briefcase" />
                    </span>
                    <div className="role-card-body">
                      <p className="role-card-name">HR</p>
                      <div className="role-card-meta">
                        <span>
                          <i className="ti ti-users" />3 users
                        </span>
                        <span>
                          <i className="ti ti-key" />
                          88 perms
                        </span>
                        <span>
                          <i className="ti ti-clock" />
                          1d ago
                        </span>
                      </div>
                    </div>
                    <span className="role-card-dot" title="Active" />
                    <div className="dropdown" data-rp-menu="">
                      <button
                        type="button"
                        className="btn btn-icon btn-sm rounded-circle flex-shrink-0"
                        data-bs-toggle="dropdown"
                        aria-label="Role actions"
                      >
                        <i className="ti ti-dots-vertical" />
                      </button>
                      <ul className="dropdown-menu dropdown-menu-end">
                        <li>
                          <a
                            className="dropdown-item"
                            href="#"
                          >
                            <i className="ti ti-eye me-2" />
                            View
                          </a>
                        </li>
                        <li>
                          <a
                            className="dropdown-item"
                            href="#"
                            data-bs-toggle="modal"
                            data-bs-target="#edit_role"
                          >
                            <i className="ti ti-edit me-2" />
                            Edit
                          </a>
                        </li>
                        <li>
                          <a
                            className="dropdown-item"
                            href="#"
                            data-rp-action="clone"
                          >
                            <i className="ti ti-copy me-2" />
                            Clone
                          </a>
                        </li>
                        <li>
                          <a
                            className="dropdown-item"
                            href="#"
                            data-rp-action="compare"
                          >
                            <i className="ti ti-git-compare me-2" />
                            Compare
                          </a>
                        </li>
                        <li>
                          <hr className="dropdown-divider" />
                        </li>
                        <li>
                          <a
                            className="dropdown-item text-danger"
                            href="#"
                            data-bs-toggle="modal"
                            data-bs-target="#delete-modal"
                          >
                            <i className="ti ti-trash me-2" />
                            Delete
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div
                    className="role-card"
                    data-rp-role=""
                    data-rp-cat="custom"
                    data-name="Librarian"
                    data-desc="Manage library members, books, issue and returns."
                    data-icon="ti-books"
                    data-users={2}
                    data-perms={54}
                    data-type="Custom Role"
                    data-status="Active"
                  >
                    <span className="role-card-icon role-icon-teal">
                      <i className="ti ti-books" />
                    </span>
                    <div className="role-card-body">
                      <p className="role-card-name">Librarian</p>
                      <div className="role-card-meta">
                        <span>
                          <i className="ti ti-users" />2 users
                        </span>
                        <span>
                          <i className="ti ti-key" />
                          54 perms
                        </span>
                        <span>
                          <i className="ti ti-clock" />
                          2d ago
                        </span>
                      </div>
                    </div>
                    <span className="role-card-dot" title="Active" />
                    <div className="dropdown" data-rp-menu="">
                      <button
                        type="button"
                        className="btn btn-icon btn-sm rounded-circle flex-shrink-0"
                        data-bs-toggle="dropdown"
                        aria-label="Role actions"
                      >
                        <i className="ti ti-dots-vertical" />
                      </button>
                      <ul className="dropdown-menu dropdown-menu-end">
                        <li>
                          <a
                            className="dropdown-item"
                            href="#"
                          >
                            <i className="ti ti-eye me-2" />
                            View
                          </a>
                        </li>
                        <li>
                          <a
                            className="dropdown-item"
                            href="#"
                            data-bs-toggle="modal"
                            data-bs-target="#edit_role"
                          >
                            <i className="ti ti-edit me-2" />
                            Edit
                          </a>
                        </li>
                        <li>
                          <a
                            className="dropdown-item"
                            href="#"
                            data-rp-action="clone"
                          >
                            <i className="ti ti-copy me-2" />
                            Clone
                          </a>
                        </li>
                        <li>
                          <a
                            className="dropdown-item"
                            href="#"
                            data-rp-action="compare"
                          >
                            <i className="ti ti-git-compare me-2" />
                            Compare
                          </a>
                        </li>
                        <li>
                          <hr className="dropdown-divider" />
                        </li>
                        <li>
                          <a
                            className="dropdown-item text-danger"
                            href="#"
                            data-bs-toggle="modal"
                            data-bs-target="#delete-modal"
                          >
                            <i className="ti ti-trash me-2" />
                            Delete
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div
                    className="role-card"
                    data-rp-role=""
                    data-rp-cat="custom"
                    data-name="Receptionist"
                    data-desc="Front-desk access to enquiries, visitors and communication."
                    data-icon="ti-bell"
                    data-users={2}
                    data-perms={41}
                    data-type="Custom Role"
                    data-status="Inactive"
                  >
                    <span className="role-card-icon role-icon-slate">
                      <i className="ti ti-bell" />
                    </span>
                    <div className="role-card-body">
                      <p className="role-card-name">Receptionist</p>
                      <div className="role-card-meta">
                        <span>
                          <i className="ti ti-users" />2 users
                        </span>
                        <span>
                          <i className="ti ti-key" />
                          41 perms
                        </span>
                        <span>
                          <i className="ti ti-clock" />
                          7d ago
                        </span>
                      </div>
                    </div>
                    <span className="role-card-dot off" title="Inactive" />
                    <div className="dropdown" data-rp-menu="">
                      <button
                        type="button"
                        className="btn btn-icon btn-sm rounded-circle flex-shrink-0"
                        data-bs-toggle="dropdown"
                        aria-label="Role actions"
                      >
                        <i className="ti ti-dots-vertical" />
                      </button>
                      <ul className="dropdown-menu dropdown-menu-end">
                        <li>
                          <a
                            className="dropdown-item"
                            href="#"
                          >
                            <i className="ti ti-eye me-2" />
                            View
                          </a>
                        </li>
                        <li>
                          <a
                            className="dropdown-item"
                            href="#"
                            data-bs-toggle="modal"
                            data-bs-target="#edit_role"
                          >
                            <i className="ti ti-edit me-2" />
                            Edit
                          </a>
                        </li>
                        <li>
                          <a
                            className="dropdown-item"
                            href="#"
                            data-rp-action="clone"
                          >
                            <i className="ti ti-copy me-2" />
                            Clone
                          </a>
                        </li>
                        <li>
                          <a
                            className="dropdown-item"
                            href="#"
                            data-rp-action="compare"
                          >
                            <i className="ti ti-git-compare me-2" />
                            Compare
                          </a>
                        </li>
                        <li>
                          <hr className="dropdown-divider" />
                        </li>
                        <li>
                          <a
                            className="dropdown-item text-danger"
                            href="#"
                            data-bs-toggle="modal"
                            data-bs-target="#delete-modal"
                          >
                            <i className="ti ti-trash me-2" />
                            Delete
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div
                    className="role-card"
                    data-rp-role=""
                    data-rp-cat="custom"
                    data-name="Transport Manager"
                    data-desc="Manage routes, vehicles, drivers and transport assignments."
                    data-icon="ti-bus"
                    data-users={1}
                    data-perms={48}
                    data-type="Custom Role"
                    data-status="Active"
                  >
                    <span className="role-card-icon role-icon-slate">
                      <i className="ti ti-bus" />
                    </span>
                    <div className="role-card-body">
                      <p className="role-card-name">Transport Manager</p>
                      <div className="role-card-meta">
                        <span>
                          <i className="ti ti-users" />1 users
                        </span>
                        <span>
                          <i className="ti ti-key" />
                          48 perms
                        </span>
                        <span>
                          <i className="ti ti-clock" />
                          3d ago
                        </span>
                      </div>
                    </div>
                    <span className="role-card-dot" title="Active" />
                    <div className="dropdown" data-rp-menu="">
                      <button
                        type="button"
                        className="btn btn-icon btn-sm rounded-circle flex-shrink-0"
                        data-bs-toggle="dropdown"
                        aria-label="Role actions"
                      >
                        <i className="ti ti-dots-vertical" />
                      </button>
                      <ul className="dropdown-menu dropdown-menu-end">
                        <li>
                          <a
                            className="dropdown-item"
                            href="#"
                          >
                            <i className="ti ti-eye me-2" />
                            View
                          </a>
                        </li>
                        <li>
                          <a
                            className="dropdown-item"
                            href="#"
                            data-bs-toggle="modal"
                            data-bs-target="#edit_role"
                          >
                            <i className="ti ti-edit me-2" />
                            Edit
                          </a>
                        </li>
                        <li>
                          <a
                            className="dropdown-item"
                            href="#"
                            data-rp-action="clone"
                          >
                            <i className="ti ti-copy me-2" />
                            Clone
                          </a>
                        </li>
                        <li>
                          <a
                            className="dropdown-item"
                            href="#"
                            data-rp-action="compare"
                          >
                            <i className="ti ti-git-compare me-2" />
                            Compare
                          </a>
                        </li>
                        <li>
                          <hr className="dropdown-divider" />
                        </li>
                        <li>
                          <a
                            className="dropdown-item text-danger"
                            href="#"
                            data-bs-toggle="modal"
                            data-bs-target="#delete-modal"
                          >
                            <i className="ti ti-trash me-2" />
                            Delete
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div
                    className="role-card"
                    data-rp-role=""
                    data-rp-cat="custom"
                    data-name="Hostel Manager"
                    data-desc="Manage hostels, rooms, allotments and wardens."
                    data-icon="ti-building"
                    data-users={1}
                    data-perms={46}
                    data-type="Custom Role"
                    data-status="Active"
                  >
                    <span className="role-card-icon role-icon-slate">
                      <i className="ti ti-building" />
                    </span>
                    <div className="role-card-body">
                      <p className="role-card-name">Hostel Manager</p>
                      <div className="role-card-meta">
                        <span>
                          <i className="ti ti-users" />1 users
                        </span>
                        <span>
                          <i className="ti ti-key" />
                          46 perms
                        </span>
                        <span>
                          <i className="ti ti-clock" />
                          5d ago
                        </span>
                      </div>
                    </div>
                    <span className="role-card-dot" title="Active" />
                    <div className="dropdown" data-rp-menu="">
                      <button
                        type="button"
                        className="btn btn-icon btn-sm rounded-circle flex-shrink-0"
                        data-bs-toggle="dropdown"
                        aria-label="Role actions"
                      >
                        <i className="ti ti-dots-vertical" />
                      </button>
                      <ul className="dropdown-menu dropdown-menu-end">
                        <li>
                          <a
                            className="dropdown-item"
                            href="#"
                          >
                            <i className="ti ti-eye me-2" />
                            View
                          </a>
                        </li>
                        <li>
                          <a
                            className="dropdown-item"
                            href="#"
                            data-bs-toggle="modal"
                            data-bs-target="#edit_role"
                          >
                            <i className="ti ti-edit me-2" />
                            Edit
                          </a>
                        </li>
                        <li>
                          <a
                            className="dropdown-item"
                            href="#"
                            data-rp-action="clone"
                          >
                            <i className="ti ti-copy me-2" />
                            Clone
                          </a>
                        </li>
                        <li>
                          <a
                            className="dropdown-item"
                            href="#"
                            data-rp-action="compare"
                          >
                            <i className="ti ti-git-compare me-2" />
                            Compare
                          </a>
                        </li>
                        <li>
                          <hr className="dropdown-divider" />
                        </li>
                        <li>
                          <a
                            className="dropdown-item text-danger"
                            href="#"
                            data-bs-toggle="modal"
                            data-bs-target="#delete-modal"
                          >
                            <i className="ti ti-trash me-2" />
                            Delete
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div
                    className="role-card"
                    data-rp-role=""
                    data-rp-cat="custom"
                    data-name="Exam Controller"
                    data-desc="Manage examinations, schedules, grades and results."
                    data-icon="ti-file-certificate"
                    data-users={2}
                    data-perms={63}
                    data-type="Custom Role"
                    data-status="Active"
                  >
                    <span className="role-card-icon role-icon-rose">
                      <i className="ti ti-file-certificate" />
                    </span>
                    <div className="role-card-body">
                      <p className="role-card-name">Exam Controller</p>
                      <div className="role-card-meta">
                        <span>
                          <i className="ti ti-users" />2 users
                        </span>
                        <span>
                          <i className="ti ti-key" />
                          63 perms
                        </span>
                        <span>
                          <i className="ti ti-clock" />
                          1d ago
                        </span>
                      </div>
                    </div>
                    <span className="role-card-dot" title="Active" />
                    <div className="dropdown" data-rp-menu="">
                      <button
                        type="button"
                        className="btn btn-icon btn-sm rounded-circle flex-shrink-0"
                        data-bs-toggle="dropdown"
                        aria-label="Role actions"
                      >
                        <i className="ti ti-dots-vertical" />
                      </button>
                      <ul className="dropdown-menu dropdown-menu-end">
                        <li>
                          <a
                            className="dropdown-item"
                            href="#"
                          >
                            <i className="ti ti-eye me-2" />
                            View
                          </a>
                        </li>
                        <li>
                          <a
                            className="dropdown-item"
                            href="#"
                            data-bs-toggle="modal"
                            data-bs-target="#edit_role"
                          >
                            <i className="ti ti-edit me-2" />
                            Edit
                          </a>
                        </li>
                        <li>
                          <a
                            className="dropdown-item"
                            href="#"
                            data-rp-action="clone"
                          >
                            <i className="ti ti-copy me-2" />
                            Clone
                          </a>
                        </li>
                        <li>
                          <a
                            className="dropdown-item"
                            href="#"
                            data-rp-action="compare"
                          >
                            <i className="ti ti-git-compare me-2" />
                            Compare
                          </a>
                        </li>
                        <li>
                          <hr className="dropdown-divider" />
                        </li>
                        <li>
                          <a
                            className="dropdown-item text-danger"
                            href="#"
                            data-bs-toggle="modal"
                            data-bs-target="#delete-modal"
                          >
                            <i className="ti ti-trash me-2" />
                            Delete
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                {/* Empty state */}
                <div className="text-center py-5 d-none" id="rpDirEmpty">
                  <span className="avatar avatar-xl rounded-circle flex-shrink-0 bg-primary-transparent text-primary mb-3">
                    <i className="ti ti-shield-off fs-30" />
                  </span>
                  <h5 className="mb-1">No Roles Found</h5>
                  <p className="text-muted mb-3">
                    Create your first role to manage user permissions.
                  </p>
                  <button
                    type="button"
                    className="btn btn-primary"
                    data-bs-toggle="modal"
                    data-bs-target="#add_role"
                  >
                    <i className="ti ti-square-rounded-plus me-1" />
                    Create Role
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* /Role Directory */}
          {/* ===================== PERMISSION WORKSPACE (right) ===================== */}
          <div className="col-12 col-xl-7 col-lg-12 d-flex">
            <div className="card flex-fill mb-0">
              <div className="card-header">
                <div className="workspace-head">
                  <span className="workspace-head-icon">
                    <i className="ti ti-shield-check" />
                  </span>
                  <div className="flex-fill">
                    <div className="d-flex align-items-center flex-wrap gap-2 mb-1">
                      <h4 className="mb-0" id="rpWsName">
                        Administrator
                      </h4>
                      <span
                        className="badge badge-soft-success"
                        id="rpWsStatus"
                      >
                        <i className="ti ti-circle-filled fs-8 me-1" />
                        Active
                      </span>
                      <span className="badge badge-soft-primary" id="rpWsType">
                        System Role
                      </span>
                    </div>
                    <p className="text-muted mb-2" id="rpWsDesc">
                      Full, unrestricted access to every module, setting and
                      user across the institution.
                    </p>
                    <div className="avatar-list-stacked avatar-group-sm">
                      <span className="avatar avatar-rounded">
                        <img
                          src="assets/img/profiles/avatar-27.jpg"
                          alt="user"
                        />
                      </span>
                      <span className="avatar avatar-rounded">
                        <img
                          src="assets/img/profiles/avatar-02.jpg"
                          alt="user"
                        />
                      </span>
                      <span className="avatar avatar-rounded">
                        <img
                          src="assets/img/profiles/avatar-03.jpg"
                          alt="user"
                        />
                      </span>
                      <span className="avatar avatar-rounded">
                        <img
                          src="assets/img/profiles/avatar-04.jpg"
                          alt="user"
                        />
                      </span>
                      <a
                        className="avatar avatar-rounded bg-primary text-white fs-12"
                        href="#"
                      >
                        +8
                      </a>
                    </div>
                  </div>
                  <div className="d-flex align-items-start gap-2">
                    <button
                      type="button"
                      className="btn btn-outline-light bg-white btn-icon"
                      data-bs-toggle="tooltip"
                      title="Clone Role"
                      data-rp-action="clone"
                    >
                      <i className="ti ti-copy" />
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-light bg-white btn-icon"
                      data-bs-toggle="modal"
                      data-bs-target="#edit_role"
                      title="Edit Role"
                    >
                      <i className="ti ti-edit" />
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-light bg-white btn-icon text-danger"
                      data-bs-toggle="modal"
                      data-bs-target="#delete-modal"
                      title="Delete Role"
                    >
                      <i className="ti ti-trash" />
                    </button>
                  </div>
                </div>
              </div>
              <div className="card-body">
                {/* Role information tiles */}
                <div className="row g-3 mb-4">
                  <div className="col-6 col-md-3">
                    <p className="fs-12 text-muted mb-1">Access Level</p>
                    <h5 className="mb-0 fs-15">
                      <span className="badge badge-soft-danger">
                        Super Admin
                      </span>
                    </h5>
                  </div>
                  <div className="col-6 col-md-3">
                    <p className="fs-12 text-muted mb-1">Created By</p>
                    <h6 className="mb-0">System</h6>
                  </div>
                  <div className="col-6 col-md-3">
                    <p className="fs-12 text-muted mb-1">Total Permissions</p>
                    <h6 className="mb-0">
                      248{" "}
                      <span className="text-muted fw-normal fs-12">/ 248</span>
                    </h6>
                  </div>
                  <div className="col-6 col-md-3">
                    <p className="fs-12 text-muted mb-1">Assigned Users</p>
                    <h6 className="mb-0">12</h6>
                  </div>
                </div>
                {/* Permission toolbar */}
                <div className="roles-toolbar mb-3">
                  <div className="search-field-roles">
                    <i className="ti ti-search" />
                    <input
                      type="text"
                      className="form-control"
                      id="rpPermSearch"
                      placeholder="Search permissions…"
                      aria-label="Search permissions"
                    />
                  </div>
                  <button
                    type="button"
                    className="btn btn-outline-light bg-white btn-sm"
                    data-rp-action="expand"
                  >
                    <i className="ti ti-arrows-down-up me-1" />
                    Expand All
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-light bg-white btn-sm"
                    data-rp-action="collapse"
                  >
                    <i className="ti ti-arrows-up-down me-1" />
                    Collapse All
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-light bg-white btn-sm"
                    data-rp-action="select_all"
                  >
                    <i className="ti ti-checks me-1" />
                    Select All
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-light bg-white btn-sm"
                    data-rp-action="clear_all"
                  >
                    <i className="ti ti-square-off me-1" />
                    Clear
                  </button>
                  <div className="dropdown">
                    <button
                      type="button"
                      className="btn btn-outline-light bg-white btn-sm dropdown-toggle"
                      data-bs-toggle="dropdown"
                    >
                      <i className="ti ti-bookmarks me-1" />
                      Presets
                    </button>
                    <ul className="dropdown-menu dropdown-menu-end p-2">
                      <li>
                        <a
                          href="#"
                          className="dropdown-item rounded-1"
                          data-rp-action="preset"
                        >
                          <i className="ti ti-eye me-2" />
                          Read Only
                        </a>
                      </li>
                      <li>
                        <a
                          href="#"
                          className="dropdown-item rounded-1"
                          data-rp-action="preset"
                        >
                          <i className="ti ti-edit me-2" />
                          Editor
                        </a>
                      </li>
                      <li>
                        <a
                          href="#"
                          className="dropdown-item rounded-1"
                          data-rp-action="preset"
                        >
                          <i className="ti ti-shield-check me-2" />
                          Manager
                        </a>
                      </li>
                      <li>
                        <a
                          href="#"
                          className="dropdown-item rounded-1"
                          data-rp-action="preset"
                        >
                          <i className="ti ti-crown me-2" />
                          Full Access
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
                {/* Permission modules accordion */}
                <div
                  className="accordion permission-module-list"
                  id="rpModules"
                >
                  <div
                    className="accordion-item"
                    data-rp-module=""
                    data-name="dashboard"
                  >
                    <h2 className="accordion-header">
                      <button
                        className="accordion-button collapsed"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#rpMod0"
                        aria-expanded="false"
                        aria-controls="rpMod0"
                      >
                        <span className="permission-module-icon">
                          <i className="ti ti-layout-dashboard" />
                        </span>
                        Dashboard
                        <span className="permission-module-count">
                          4 / 10 enabled
                        </span>
                      </button>
                    </h2>
                    <div id="rpMod0" className="accordion-collapse collapse">
                      <div className="accordion-body">
                        <div className="permission-grid">
                          <div className="permission-row">
                            <label htmlFor="rp-p-0-0">View</label>
                            <div className="form-check form-switch m-0">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                role="switch"
                                id="rp-p-0-0"
                                defaultChecked
                              />
                            </div>
                          </div>
                          <div className="permission-row">
                            <label htmlFor="rp-p-0-1">Create</label>
                            <div className="form-check form-switch m-0">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                role="switch"
                                id="rp-p-0-1"
                              />
                            </div>
                          </div>
                          <div className="permission-row">
                            <label htmlFor="rp-p-0-2">Edit</label>
                            <div className="form-check form-switch m-0">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                role="switch"
                                id="rp-p-0-2"
                              />
                            </div>
                          </div>
                          <div className="permission-row">
                            <label htmlFor="rp-p-0-3">Delete</label>
                            <div className="form-check form-switch m-0">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                role="switch"
                                id="rp-p-0-3"
                              />
                            </div>
                          </div>
                          <div className="permission-row">
                            <label htmlFor="rp-p-0-4">Import</label>
                            <div className="form-check form-switch m-0">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                role="switch"
                                id="rp-p-0-4"
                              />
                            </div>
                          </div>
                          <div className="permission-row">
                            <label htmlFor="rp-p-0-5">Export</label>
                            <div className="form-check form-switch m-0">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                role="switch"
                                id="rp-p-0-5"
                                defaultChecked
                              />
                            </div>
                          </div>
                          <div className="permission-row">
                            <label htmlFor="rp-p-0-6">Approve</label>
                            <div className="form-check form-switch m-0">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                role="switch"
                                id="rp-p-0-6"
                              />
                            </div>
                          </div>
                          <div className="permission-row">
                            <label htmlFor="rp-p-0-7">Print</label>
                            <div className="form-check form-switch m-0">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                role="switch"
                                id="rp-p-0-7"
                                defaultChecked
                              />
                            </div>
                          </div>
                          <div className="permission-row">
                            <label htmlFor="rp-p-0-8">Download</label>
                            <div className="form-check form-switch m-0">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                role="switch"
                                id="rp-p-0-8"
                                defaultChecked
                              />
                            </div>
                          </div>
                          <div className="permission-row">
                            <label htmlFor="rp-p-0-9">Manage</label>
                            <div className="form-check form-switch m-0">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                role="switch"
                                id="rp-p-0-9"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className="accordion-item"
                    data-rp-module=""
                    data-name="students"
                  >
                    <h2 className="accordion-header">
                      <button
                        className="accordion-button"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#rpMod1"
                        aria-expanded="true"
                        aria-controls="rpMod1"
                      >
                        <span className="permission-module-icon">
                          <i className="ti ti-school" />
                        </span>
                        Students
                        <span className="permission-module-count">
                          10 / 10 enabled
                        </span>
                      </button>
                    </h2>
                    <div id="rpMod1" className="accordion-collapse collapse">
                      <div className="accordion-body">
                        <div className="permission-grid">
                          <div className="permission-row">
                            <label htmlFor="rp-p-1-0">View</label>
                            <div className="form-check form-switch m-0">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                role="switch"
                                id="rp-p-1-0"
                                defaultChecked
                              />
                            </div>
                          </div>
                          <div className="permission-row">
                            <label htmlFor="rp-p-1-1">Create</label>
                            <div className="form-check form-switch m-0">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                role="switch"
                                id="rp-p-1-1"
                                defaultChecked
                              />
                            </div>
                          </div>
                          <div className="permission-row">
                            <label htmlFor="rp-p-1-2">Edit</label>
                            <div className="form-check form-switch m-0">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                role="switch"
                                id="rp-p-1-2"
                                defaultChecked
                              />
                            </div>
                          </div>
                          <div className="permission-row">
                            <label htmlFor="rp-p-1-3">Delete</label>
                            <div className="form-check form-switch m-0">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                role="switch"
                                id="rp-p-1-3"
                                defaultChecked
                              />
                            </div>
                          </div>
                          <div className="permission-row">
                            <label htmlFor="rp-p-1-4">Import</label>
                            <div className="form-check form-switch m-0">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                role="switch"
                                id="rp-p-1-4"
                                defaultChecked
                              />
                            </div>
                          </div>
                          <div className="permission-row">
                            <label htmlFor="rp-p-1-5">Export</label>
                            <div className="form-check form-switch m-0">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                role="switch"
                                id="rp-p-1-5"
                                defaultChecked
                              />
                            </div>
                          </div>
                          <div className="permission-row">
                            <label htmlFor="rp-p-1-6">Approve</label>
                            <div className="form-check form-switch m-0">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                role="switch"
                                id="rp-p-1-6"
                                defaultChecked
                              />
                            </div>
                          </div>
                          <div className="permission-row">
                            <label htmlFor="rp-p-1-7">Print</label>
                            <div className="form-check form-switch m-0">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                role="switch"
                                id="rp-p-1-7"
                                defaultChecked
                              />
                            </div>
                          </div>
                          <div className="permission-row">
                            <label htmlFor="rp-p-1-8">Download</label>
                            <div className="form-check form-switch m-0">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                role="switch"
                                id="rp-p-1-8"
                                defaultChecked
                              />
                            </div>
                          </div>
                          <div className="permission-row">
                            <label htmlFor="rp-p-1-9">Manage</label>
                            <div className="form-check form-switch m-0">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                role="switch"
                                id="rp-p-1-9"
                                defaultChecked
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className="accordion-item"
                    data-rp-module=""
                    data-name="admissions"
                  >
                    <h2 className="accordion-header">
                      <button
                        className="accordion-button collapsed"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#rpMod2"
                        aria-expanded="false"
                        aria-controls="rpMod2"
                      >
                        <span className="permission-module-icon">
                          <i className="ti ti-user-plus" />
                        </span>
                        Admissions
                        <span className="permission-module-count">
                          9 / 10 enabled
                        </span>
                      </button>
                    </h2>
                    <div id="rpMod2" className="accordion-collapse collapse">
                      <div className="accordion-body">
                        <div className="permission-grid">
                          <div className="permission-row">
                            <label htmlFor="rp-p-2-0">View</label>
                            <div className="form-check form-switch m-0">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                role="switch"
                                id="rp-p-2-0"
                                defaultChecked
                              />
                            </div>
                          </div>
                          <div className="permission-row">
                            <label htmlFor="rp-p-2-1">Create</label>
                            <div className="form-check form-switch m-0">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                role="switch"
                                id="rp-p-2-1"
                                defaultChecked
                              />
                            </div>
                          </div>
                          <div className="permission-row">
                            <label htmlFor="rp-p-2-2">Edit</label>
                            <div className="form-check form-switch m-0">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                role="switch"
                                id="rp-p-2-2"
                                defaultChecked
                              />
                            </div>
                          </div>
                          <div className="permission-row">
                            <label htmlFor="rp-p-2-3">Delete</label>
                            <div className="form-check form-switch m-0">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                role="switch"
                                id="rp-p-2-3"
                                defaultChecked
                              />
                            </div>
                          </div>
                          <div className="permission-row">
                            <label htmlFor="rp-p-2-4">Import</label>
                            <div className="form-check form-switch m-0">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                role="switch"
                                id="rp-p-2-4"
                              />
                            </div>
                          </div>
                          <div className="permission-row">
                            <label htmlFor="rp-p-2-5">Export</label>
                            <div className="form-check form-switch m-0">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                role="switch"
                                id="rp-p-2-5"
                                defaultChecked
                              />
                            </div>
                          </div>
                          <div className="permission-row">
                            <label htmlFor="rp-p-2-6">Approve</label>
                            <div className="form-check form-switch m-0">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                role="switch"
                                id="rp-p-2-6"
                                defaultChecked
                              />
                            </div>
                          </div>
                          <div className="permission-row">
                            <label htmlFor="rp-p-2-7">Print</label>
                            <div className="form-check form-switch m-0">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                role="switch"
                                id="rp-p-2-7"
                                defaultChecked
                              />
                            </div>
                          </div>
                          <div className="permission-row">
                            <label htmlFor="rp-p-2-8">Download</label>
                            <div className="form-check form-switch m-0">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                role="switch"
                                id="rp-p-2-8"
                                defaultChecked
                              />
                            </div>
                          </div>
                          <div className="permission-row">
                            <label htmlFor="rp-p-2-9">Manage</label>
                            <div className="form-check form-switch m-0">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                role="switch"
                                id="rp-p-2-9"
                                defaultChecked
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className="accordion-item"
                    data-rp-module=""
                    data-name="teachers"
                  >
                    <h2 className="accordion-header">
                      <button
                        className="accordion-button collapsed"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#rpMod3"
                        aria-expanded="false"
                        aria-controls="rpMod3"
                      >
                        <span className="permission-module-icon">
                          <i className="ti ti-users" />
                        </span>
                        Teachers
                        <span className="permission-module-count">
                          9 / 10 enabled
                        </span>
                      </button>
                    </h2>
                    <div id="rpMod3" className="accordion-collapse collapse">
                      <div className="accordion-body">
                        <div className="permission-grid">
                          <div className="permission-row">
                            <label htmlFor="rp-p-3-0">View</label>
                            <div className="form-check form-switch m-0">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                role="switch"
                                id="rp-p-3-0"
                                defaultChecked
                              />
                            </div>
                          </div>
                          <div className="permission-row">
                            <label htmlFor="rp-p-3-1">Create</label>
                            <div className="form-check form-switch m-0">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                role="switch"
                                id="rp-p-3-1"
                                defaultChecked
                              />
                            </div>
                          </div>
                          <div className="permission-row">
                            <label htmlFor="rp-p-3-2">Edit</label>
                            <div className="form-check form-switch m-0">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                role="switch"
                                id="rp-p-3-2"
                                defaultChecked
                              />
                            </div>
                          </div>
                          <div className="permission-row">
                            <label htmlFor="rp-p-3-3">Delete</label>
                            <div className="form-check form-switch m-0">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                role="switch"
                                id="rp-p-3-3"
                                defaultChecked
                              />
                            </div>
                          </div>
                          <div className="permission-row">
                            <label htmlFor="rp-p-3-4">Import</label>
                            <div className="form-check form-switch m-0">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                role="switch"
                                id="rp-p-3-4"
                                defaultChecked
                              />
                            </div>
                          </div>
                          <div className="permission-row">
                            <label htmlFor="rp-p-3-5">Export</label>
                            <div className="form-check form-switch m-0">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                role="switch"
                                id="rp-p-3-5"
                                defaultChecked
                              />
                            </div>
                          </div>
                          <div className="permission-row">
                            <label htmlFor="rp-p-3-6">Approve</label>
                            <div className="form-check form-switch m-0">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                role="switch"
                                id="rp-p-3-6"
                              />
                            </div>
                          </div>
                          <div className="permission-row">
                            <label htmlFor="rp-p-3-7">Print</label>
                            <div className="form-check form-switch m-0">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                role="switch"
                                id="rp-p-3-7"
                                defaultChecked
                              />
                            </div>
                          </div>
                          <div className="permission-row">
                            <label htmlFor="rp-p-3-8">Download</label>
                            <div className="form-check form-switch m-0">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                role="switch"
                                id="rp-p-3-8"
                                defaultChecked
                              />
                            </div>
                          </div>
                          <div className="permission-row">
                            <label htmlFor="rp-p-3-9">Manage</label>
                            <div className="form-check form-switch m-0">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                role="switch"
                                id="rp-p-3-9"
                                defaultChecked
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className="accordion-item"
                    data-rp-module=""
                    data-name="academics"
                  >
                    <h2 className="accordion-header">
                      <button
                        className="accordion-button collapsed"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#rpMod4"
                        aria-expanded="false"
                        aria-controls="rpMod4"
                      >
                        <span className="permission-module-icon">
                          <i className="ti ti-book" />
                        </span>
                        Academics
                        <span className="permission-module-count">
                          8 / 10 enabled
                        </span>
                      </button>
                    </h2>
                    <div id="rpMod4" className="accordion-collapse collapse">
                      <div className="accordion-body">
                        <div className="permission-grid">
                          <div className="permission-row">
                            <label htmlFor="rp-p-4-0">View</label>
                            <div className="form-check form-switch m-0">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                role="switch"
                                id="rp-p-4-0"
                                defaultChecked
                              />
                            </div>
                          </div>
                          <div className="permission-row">
                            <label htmlFor="rp-p-4-1">Create</label>
                            <div className="form-check form-switch m-0">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                role="switch"
                                id="rp-p-4-1"
                                defaultChecked
                              />
                            </div>
                          </div>
                          <div className="permission-row">
                            <label htmlFor="rp-p-4-2">Edit</label>
                            <div className="form-check form-switch m-0">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                role="switch"
                                id="rp-p-4-2"
                                defaultChecked
                              />
                            </div>
                          </div>
                          <div className="permission-row">
                            <label htmlFor="rp-p-4-3">Delete</label>
                            <div className="form-check form-switch m-0">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                role="switch"
                                id="rp-p-4-3"
                              />
                            </div>
                          </div>
                          <div className="permission-row">
                            <label htmlFor="rp-p-4-4">Import</label>
                            <div className="form-check form-switch m-0">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                role="switch"
                                id="rp-p-4-4"
                              />
                            </div>
                          </div>
                          <div className="permission-row">
                            <label htmlFor="rp-p-4-5">Export</label>
                            <div className="form-check form-switch m-0">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                role="switch"
                                id="rp-p-4-5"
                                defaultChecked
                              />
                            </div>
                          </div>
                          <div className="permission-row">
                            <label htmlFor="rp-p-4-6">Approve</label>
                            <div className="form-check form-switch m-0">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                role="switch"
                                id="rp-p-4-6"
                                defaultChecked
                              />
                            </div>
                          </div>
                          <div className="permission-row">
                            <label htmlFor="rp-p-4-7">Print</label>
                            <div className="form-check form-switch m-0">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                role="switch"
                                id="rp-p-4-7"
                                defaultChecked
                              />
                            </div>
                          </div>
                          <div className="permission-row">
                            <label htmlFor="rp-p-4-8">Download</label>
                            <div className="form-check form-switch m-0">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                role="switch"
                                id="rp-p-4-8"
                                defaultChecked
                              />
                            </div>
                          </div>
                          <div className="permission-row">
                            <label htmlFor="rp-p-4-9">Manage</label>
                            <div className="form-check form-switch m-0">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                role="switch"
                                id="rp-p-4-9"
                                defaultChecked
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className="accordion-item"
                    data-rp-module=""
                    data-name="attendance"
                  >
                    <h2 className="accordion-header">
                      <button
                        className="accordion-button collapsed"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#rpMod5"
                        aria-expanded="false"
                        aria-controls="rpMod5"
                      >
                        <span className="permission-module-icon">
                          <i className="ti ti-calendar-check" />
                        </span>
                        Attendance
                        <span className="permission-module-count">
                          9 / 10 enabled
                        </span>
                      </button>
                    </h2>
                    <div id="rpMod5" className="accordion-collapse collapse">
                      <div className="accordion-body">
                        <div className="permission-grid">
                          <div className="permission-row">
                            <label htmlFor="rp-p-5-0">View</label>
                            <div className="form-check form-switch m-0">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                role="switch"
                                id="rp-p-5-0"
                                defaultChecked
                              />
                            </div>
                          </div>
                          <div className="permission-row">
                            <label htmlFor="rp-p-5-1">Create</label>
                            <div className="form-check form-switch m-0">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                role="switch"
                                id="rp-p-5-1"
                                defaultChecked
                              />
                            </div>
                          </div>
                          <div className="permission-row">
                            <label htmlFor="rp-p-5-2">Edit</label>
                            <div className="form-check form-switch m-0">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                role="switch"
                                id="rp-p-5-2"
                                defaultChecked
                              />
                            </div>
                          </div>
                          <div className="permission-row">
                            <label htmlFor="rp-p-5-3">Delete</label>
                            <div className="form-check form-switch m-0">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                role="switch"
                                id="rp-p-5-3"
                              />
                            </div>
                          </div>
                          <div className="permission-row">
                            <label htmlFor="rp-p-5-4">Import</label>
                            <div className="form-check form-switch m-0">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                role="switch"
                                id="rp-p-5-4"
                                defaultChecked
                              />
                            </div>
                          </div>
                          <div className="permission-row">
                            <label htmlFor="rp-p-5-5">Export</label>
                            <div className="form-check form-switch m-0">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                role="switch"
                                id="rp-p-5-5"
                                defaultChecked
                              />
                            </div>
                          </div>
                          <div className="permission-row">
                            <label htmlFor="rp-p-5-6">Approve</label>
                            <div className="form-check form-switch m-0">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                role="switch"
                                id="rp-p-5-6"
                                defaultChecked
                              />
                            </div>
                          </div>
                          <div className="permission-row">
                            <label htmlFor="rp-p-5-7">Print</label>
                            <div className="form-check form-switch m-0">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                role="switch"
                                id="rp-p-5-7"
                                defaultChecked
                              />
                            </div>
                          </div>
                          <div className="permission-row">
                            <label htmlFor="rp-p-5-8">Download</label>
                            <div className="form-check form-switch m-0">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                role="switch"
                                id="rp-p-5-8"
                                defaultChecked
                              />
                            </div>
                          </div>
                          <div className="permission-row">
                            <label htmlFor="rp-p-5-9">Manage</label>
                            <div className="form-check form-switch m-0">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                role="switch"
                                id="rp-p-5-9"
                                defaultChecked
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className="accordion-item"
                    data-rp-module=""
                    data-name="examinations"
                  >
                    <h2 className="accordion-header">
                      <button
                        className="accordion-button collapsed"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#rpMod6"
                        aria-expanded="false"
                        aria-controls="rpMod6"
                      >
                        <span className="permission-module-icon">
                          <i className="ti ti-certificate" />
                        </span>
                        Examinations
                        <span className="permission-module-count">
                          9 / 10 enabled
                        </span>
                      </button>
                    </h2>
                    <div id="rpMod6" className="accordion-collapse collapse">
                      <div className="accordion-body">
                        <div className="permission-grid">
                          <div className="permission-row">
                            <label htmlFor="rp-p-6-0">View</label>
                            <div className="form-check form-switch m-0">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                role="switch"
                                id="rp-p-6-0"
                                defaultChecked
                              />
                            </div>
                          </div>
                          <div className="permission-row">
                            <label htmlFor="rp-p-6-1">Create</label>
                            <div className="form-check form-switch m-0">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                role="switch"
                                id="rp-p-6-1"
                                defaultChecked
                              />
                            </div>
                          </div>
                          <div className="permission-row">
                            <label htmlFor="rp-p-6-2">Edit</label>
                            <div className="form-check form-switch m-0">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                role="switch"
                                id="rp-p-6-2"
                                defaultChecked
                              />
                            </div>
                          </div>
                          <div className="permission-row">
                            <label htmlFor="rp-p-6-3">Delete</label>
                            <div className="form-check form-switch m-0">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                role="switch"
                                id="rp-p-6-3"
                                defaultChecked
                              />
                            </div>
                          </div>
                          <div className="permission-row">
                            <label htmlFor="rp-p-6-4">Import</label>
                            <div className="form-check form-switch m-0">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                role="switch"
                                id="rp-p-6-4"
                              />
                            </div>
                          </div>
                          <div className="permission-row">
                            <label htmlFor="rp-p-6-5">Export</label>
                            <div className="form-check form-switch m-0">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                role="switch"
                                id="rp-p-6-5"
                                defaultChecked
                              />
                            </div>
                          </div>
                          <div className="permission-row">
                            <label htmlFor="rp-p-6-6">Approve</label>
                            <div className="form-check form-switch m-0">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                role="switch"
                                id="rp-p-6-6"
                                defaultChecked
                              />
                            </div>
                          </div>
                          <div className="permission-row">
                            <label htmlFor="rp-p-6-7">Print</label>
                            <div className="form-check form-switch m-0">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                role="switch"
                                id="rp-p-6-7"
                                defaultChecked
                              />
                            </div>
                          </div>
                          <div className="permission-row">
                            <label htmlFor="rp-p-6-8">Download</label>
                            <div className="form-check form-switch m-0">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                role="switch"
                                id="rp-p-6-8"
                                defaultChecked
                              />
                            </div>
                          </div>
                          <div className="permission-row">
                            <label htmlFor="rp-p-6-9">Manage</label>
                            <div className="form-check form-switch m-0">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                role="switch"
                                id="rp-p-6-9"
                                defaultChecked
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className="accordion-item"
                    data-rp-module=""
                    data-name="finance"
                  >
                    <h2 className="accordion-header">
                      <button
                        className="accordion-button collapsed"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#rpMod7"
                        aria-expanded="false"
                        aria-controls="rpMod7"
                      >
                        <span className="permission-module-icon">
                          <i className="ti ti-cash" />
                        </span>
                        Finance
                        <span className="permission-module-count">
                          10 / 10 enabled
                        </span>
                      </button>
                    </h2>
                    <div id="rpMod7" className="accordion-collapse collapse">
                      <div className="accordion-body">
                        <div className="permission-grid">
                          <div className="permission-row">
                            <label htmlFor="rp-p-7-0">View</label>
                            <div className="form-check form-switch m-0">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                role="switch"
                                id="rp-p-7-0"
                                defaultChecked
                              />
                            </div>
                          </div>
                          <div className="permission-row">
                            <label htmlFor="rp-p-7-1">Create</label>
                            <div className="form-check form-switch m-0">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                role="switch"
                                id="rp-p-7-1"
                                defaultChecked
                              />
                            </div>
                          </div>
                          <div className="permission-row">
                            <label htmlFor="rp-p-7-2">Edit</label>
                            <div className="form-check form-switch m-0">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                role="switch"
                                id="rp-p-7-2"
                                defaultChecked
                              />
                            </div>
                          </div>
                          <div className="permission-row">
                            <label htmlFor="rp-p-7-3">Delete</label>
                            <div className="form-check form-switch m-0">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                role="switch"
                                id="rp-p-7-3"
                                defaultChecked
                              />
                            </div>
                          </div>
                          <div className="permission-row">
                            <label htmlFor="rp-p-7-4">Import</label>
                            <div className="form-check form-switch m-0">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                role="switch"
                                id="rp-p-7-4"
                                defaultChecked
                              />
                            </div>
                          </div>
                          <div className="permission-row">
                            <label htmlFor="rp-p-7-5">Export</label>
                            <div className="form-check form-switch m-0">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                role="switch"
                                id="rp-p-7-5"
                                defaultChecked
                              />
                            </div>
                          </div>
                          <div className="permission-row">
                            <label htmlFor="rp-p-7-6">Approve</label>
                            <div className="form-check form-switch m-0">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                role="switch"
                                id="rp-p-7-6"
                                defaultChecked
                              />
                            </div>
                          </div>
                          <div className="permission-row">
                            <label htmlFor="rp-p-7-7">Print</label>
                            <div className="form-check form-switch m-0">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                role="switch"
                                id="rp-p-7-7"
                                defaultChecked
                              />
                            </div>
                          </div>
                          <div className="permission-row">
                            <label htmlFor="rp-p-7-8">Download</label>
                            <div className="form-check form-switch m-0">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                role="switch"
                                id="rp-p-7-8"
                                defaultChecked
                              />
                            </div>
                          </div>
                          <div className="permission-row">
                            <label htmlFor="rp-p-7-9">Manage</label>
                            <div className="form-check form-switch m-0">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                role="switch"
                                id="rp-p-7-9"
                                defaultChecked
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* /Permission Workspace */}
        </div>
        {/* ===================== USER ASSIGNMENT + SECURITY ===================== */}
        <div className="row g-3 mt-1">
          {/* User Assignment */}
          <div className="col-12 col-xl-8 d-flex">
            <div className="card flex-fill mb-0">
              <div className="card-header d-flex align-items-center justify-content-between flex-wrap gap-3">
                <h3 className="mb-0 d-flex align-items-center fs-16 fw-medium">
                  <i className="ti ti-users text-primary me-2" />
                  User Assignment
                </h3>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  data-rp-action="assign"
                >
                  <i className="ti ti-user-plus me-1" />
                  Assign Users
                </button>
              </div>
              <div className="card-body">
                <div className="row g-3 mb-3">
                  <div className="col-6 col-md-3">
                    <p className="fs-12 text-muted mb-1">Total Assigned</p>
                    <h4 className="mb-0 fs-15 fw-medium">186</h4>
                  </div>
                  <div className="col-6 col-md-3">
                    <p className="fs-12 text-muted mb-1">Roles In Use</p>
                    <h5 className="mb-0 fs-15">
                      11{" "}
                      <span className="text-muted fw-normal fs-12">/ 14</span>
                    </h5>
                  </div>
                  <div className="col-6 col-md-3">
                    <p className="fs-12 text-muted mb-1">Pending Invites</p>
                    <h6 className="mb-0">4</h6>
                  </div>
                  <div className="col-6 col-md-3">
                    <p className="fs-12 text-muted mb-1">Unassigned Staff</p>
                    <h6 className="mb-0">7</h6>
                  </div>
                </div>
                <div className="row g-2 mb-3">
                  <div className="col-sm-6 col-xl-3">
                    <div className="directory-search">
                      <i className="ti ti-search" />
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Search user…"
                        aria-label="Search user…"
                      />
                    </div>
                  </div>
                  <div className="col-sm-6 col-xl-3">
                    <select
                      className="form-select"
                      aria-label="All Departments"
                    >
                      <option>All Departments</option>
                      <option>Science</option>
                      <option>Finance</option>
                      <option>Library</option>
                    </select>
                  </div>
                  <div className="col-sm-6 col-xl-3">
                    <select className="form-select" aria-label="All Branches">
                      <option>All Branches</option>
                      <option>Main Campus</option>
                      <option>North Branch</option>
                    </select>
                  </div>
                  <div className="col-sm-6 col-xl-3">
                    <select className="form-select" aria-label="All Status">
                      <option>All Status</option>
                      <option>Active</option>
                      <option>Inactive</option>
                    </select>
                  </div>
                </div>
                <div className="table-responsive">
                  <table className="table table-hover mb-0 align-middle">
                    <thead className="thead-light">
                      <tr>
                        <th>User</th>
                        <th>Department</th>
                        <th>Current Role</th>
                        <th className="text-end">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          <div className="d-flex align-items-center">
                            <span className="avatar avatar-md rounded-circle flex-shrink-0 me-2">
                              <img
                                src="assets/img/profiles/avatar-27.jpg"
                                alt="user"
                              />
                            </span>
                            <div>
                              <h6 className="fs-14 fw-semibold mb-0">
                                Kevin Larry
                              </h6>
                              <span className="fs-12 text-muted">
                                kevin.larry@karkaii.com
                              </span>
                            </div>
                          </div>
                        </td>
                        <td>IT &amp; Admin</td>
                        <td>
                          <span className="badge badge-soft-primary">
                            Administrator
                          </span>
                        </td>
                        <td className="text-end">
                          <button
                            type="button"
                            className="btn btn-outline-danger btn-sm"
                            data-rp-action="remove"
                          >
                            <i className="ti ti-user-minus me-1" />
                            Remove
                          </button>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <div className="d-flex align-items-center">
                            <span className="avatar avatar-md rounded-circle flex-shrink-0 me-2">
                              <img
                                src="assets/img/profiles/avatar-02.jpg"
                                alt="user"
                              />
                            </span>
                            <div>
                              <h6 className="fs-14 fw-semibold mb-0">
                                Sarah Mitchell
                              </h6>
                              <span className="fs-12 text-muted">
                                sarah.m@karkaii.com
                              </span>
                            </div>
                          </div>
                        </td>
                        <td>Science</td>
                        <td>
                          <span className="badge badge-soft-success">
                            Teacher
                          </span>
                        </td>
                        <td className="text-end">
                          <button
                            type="button"
                            className="btn btn-outline-primary btn-sm"
                            data-rp-action="assign"
                          >
                            <i className="ti ti-user-plus me-1" />
                            Assign
                          </button>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <div className="d-flex align-items-center">
                            <span className="avatar avatar-md rounded-circle flex-shrink-0 me-2">
                              <img
                                src="assets/img/profiles/avatar-03.jpg"
                                alt="user"
                              />
                            </span>
                            <div>
                              <h6 className="fs-14 fw-semibold mb-0">
                                James Wilson
                              </h6>
                              <span className="fs-12 text-muted">
                                james.w@karkaii.com
                              </span>
                            </div>
                          </div>
                        </td>
                        <td>Finance</td>
                        <td>
                          <span className="badge badge-soft-warning">
                            Accountant
                          </span>
                        </td>
                        <td className="text-end">
                          <button
                            type="button"
                            className="btn btn-outline-primary btn-sm"
                            data-rp-action="assign"
                          >
                            <i className="ti ti-user-plus me-1" />
                            Assign
                          </button>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <div className="d-flex align-items-center">
                            <span className="avatar avatar-md rounded-circle flex-shrink-0 me-2">
                              <img
                                src="assets/img/profiles/avatar-04.jpg"
                                alt="user"
                              />
                            </span>
                            <div>
                              <h6 className="fs-14 fw-semibold mb-0">
                                Emily Clarke
                              </h6>
                              <span className="fs-12 text-muted">
                                emily.c@karkaii.com
                              </span>
                            </div>
                          </div>
                        </td>
                        <td>Library</td>
                        <td>
                          <span className="badge badge-soft-teal">
                            Librarian
                          </span>
                        </td>
                        <td className="text-end">
                          <button
                            type="button"
                            className="btn btn-outline-danger btn-sm"
                            data-rp-action="remove"
                          >
                            <i className="ti ti-user-minus me-1" />
                            Remove
                          </button>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <div className="d-flex align-items-center">
                            <span className="avatar avatar-md rounded-circle flex-shrink-0 me-2">
                              <img
                                src="assets/img/profiles/avatar-05.jpg"
                                alt="user"
                              />
                            </span>
                            <div>
                              <h6 className="fs-14 fw-semibold mb-0">
                                Michael Chen
                              </h6>
                              <span className="fs-12 text-muted">
                                michael.chen@karkaii.com
                              </span>
                            </div>
                          </div>
                        </td>
                        <td>Transport</td>
                        <td>
                          <span className="badge badge-soft-info">
                            Transport Manager
                          </span>
                        </td>
                        <td className="text-end">
                          <button
                            type="button"
                            className="btn btn-outline-danger btn-sm"
                            data-rp-action="remove"
                          >
                            <i className="ti ti-user-minus me-1" />
                            Remove
                          </button>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <div className="d-flex align-items-center">
                            <span className="avatar avatar-md rounded-circle flex-shrink-0 me-2">
                              <img
                                src="assets/img/profiles/avatar-06.jpg"
                                alt="user"
                              />
                            </span>
                            <div>
                              <h6 className="fs-14 fw-semibold mb-0">
                                Priya Sharma
                              </h6>
                              <span className="fs-12 text-muted">
                                priya.sharma@karkaii.com
                              </span>
                            </div>
                          </div>
                        </td>
                        <td>Front Office</td>
                        <td>
                          <span className="badge badge-soft-secondary">
                            Receptionist
                          </span>
                        </td>
                        <td className="text-end">
                          <button
                            type="button"
                            className="btn btn-outline-primary btn-sm"
                            data-rp-action="assign"
                          >
                            <i className="ti ti-user-plus me-1" />
                            Assign
                          </button>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <div className="d-flex align-items-center">
                            <span className="avatar avatar-md rounded-circle flex-shrink-0 me-2">
                              <img
                                src="assets/img/profiles/avatar-07.jpg"
                                alt="user"
                              />
                            </span>
                            <div>
                              <h6 className="fs-14 fw-semibold mb-0">
                                Olivia Grant
                              </h6>
                              <span className="fs-12 text-muted">
                                olivia.grant@karkaii.com
                              </span>
                            </div>
                          </div>
                        </td>
                        <td>Hostel</td>
                        <td>
                          <span className="badge badge-soft-purple">
                            Hostel Manager
                          </span>
                        </td>
                        <td className="text-end">
                          <button
                            type="button"
                            className="btn btn-outline-danger btn-sm"
                            data-rp-action="remove"
                          >
                            <i className="ti ti-user-minus me-1" />
                            Remove
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="card-footer d-flex align-items-center justify-content-between flex-wrap gap-2">
                <span className="fs-13 text-muted">
                  Showing 7 of 186 assigned users
                </span>
                <a href="staffs.html" className="link-primary fs-13 fw-medium">
                  View All Users
                </a>
              </div>
            </div>
          </div>
          {/* Security Panel + Audit */}
          <div className="col-12 col-xl-4 d-flex">
            <div className="d-flex flex-column gap-3 flex-fill">
              {/* Security Score */}
              <div className="card mb-0">
                <div className="card-header">
                  <h5 className="mb-0 d-flex align-items-center">
                    <i className="ti ti-shield-lock text-primary me-2" />
                    Security Panel
                  </h5>
                </div>
                <div className="card-body">
                  <div className="score-block mb-3">
                    <div className="text-center">
                      <div className="score-value">82</div>
                      <div className="score-label">Score</div>
                    </div>
                  </div>
                  <div className="section-row">
                    <span className="section-label">
                      <i className="ti ti-alert-hexagon text-danger" />
                      Critical Permissions
                    </span>
                    <span className="fw-semibold">14</span>
                  </div>
                  <div className="section-row">
                    <span className="section-label">
                      <i className="ti ti-shield-bolt text-warning" />
                      High Risk Roles
                    </span>
                    <span className="fw-semibold">3</span>
                  </div>
                  <div className="section-row">
                    <span className="section-label">
                      <i className="ti ti-circle-off text-muted" />
                      Inactive Roles
                    </span>
                    <span className="fw-semibold">2</span>
                  </div>
                  <div className="section-row">
                    <span className="section-label">
                      <i className="ti ti-clock-exclamation text-primary" />
                      Pending Reviews
                    </span>
                    <span className="fw-semibold">5</span>
                  </div>
                  <div className="section-row">
                    <span className="section-label">
                      <i className="ti ti-calendar-check text-success" />
                      Last Security Audit
                    </span>
                    <span className="fw-semibold">2 days ago</span>
                  </div>
                </div>
              </div>
              {/* Audit History */}
              <div className="card mb-0 flex-fill">
                <div className="card-header d-flex align-items-center justify-content-between">
                  <h5 className="mb-0 d-flex align-items-center">
                    <i className="ti ti-history text-primary me-2" />
                    Audit History
                  </h5>
                  <a
                    href="audit-log.html"
                    className="link-primary fs-13 fw-medium"
                  >
                    View All
                  </a>
                </div>
                <div className="card-body">
                  <div className="roles-timeline">
                    <div className="roles-timeline-item">
                      <span className="roles-timeline-dot bg-primary">
                        <i className="ti ti-key fs-10" />
                      </span>
                      <p>
                        Permission changed on <b>Teacher</b>
                      </p>
                      <span className="roles-timeline-meta">
                        by Kevin Larry · 25 Jul 2026, 09:12 AM
                      </span>
                    </div>
                    <div className="roles-timeline-item">
                      <span className="roles-timeline-dot bg-success">
                        <i className="ti ti-user-plus fs-10" />
                      </span>
                      <p>
                        User <b>Sarah Mitchell</b> assigned to <b>Teacher</b>
                      </p>
                      <span className="roles-timeline-meta">
                        by Kevin Larry · 24 Jul 2026, 06:05 PM
                      </span>
                    </div>
                    <div className="roles-timeline-item">
                      <span className="roles-timeline-dot bg-warning">
                        <i className="ti ti-edit fs-10" />
                      </span>
                      <p>
                        Role <b>Accountant</b> updated
                      </p>
                      <span className="roles-timeline-meta">
                        by System · 22 Jul 2026, 11:40 AM
                      </span>
                    </div>
                    <div className="roles-timeline-item">
                      <span className="roles-timeline-dot bg-danger">
                        <i className="ti ti-user-minus fs-10" />
                      </span>
                      <p>
                        User <b>Olivia Grant</b> removed from{" "}
                        <b>Receptionist</b>
                      </p>
                      <span className="roles-timeline-meta">
                        by Kevin Larry · 20 Jul 2026, 04:30 PM
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /Workspace */}
      <div
        className="toast-stack-roles toast-container position-fixed bottom-0 end-0 p-3"
        id="rpToasts"
      />
    </div>
  </div>
  {/* /Page Wrapper */}
  <RolesPermissionModal/>
</>

  )
}

export default RolesPermission