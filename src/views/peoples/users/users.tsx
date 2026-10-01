import { Link } from "react-router-dom";
import { all_routes } from "../../../routes/all_routes";
import UsersModal from "./usersModal";

const Users = () => {
  return (
    <>
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content content-two">
          {/* Page Header */}
          <div className="d-md-flex d-block align-items-center justify-content-between mb-4 flex-wrap gap-2 flex-wrap gap-2">
            <div className="my-auto mb-2">
              <h3 className="page-title mb-1">User Management</h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={all_routes.adminDashboard}>Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <a href="#">Administration</a>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Users
                  </li>
                </ol>
              </nav>
            </div>
            <div className="d-flex my-xl-auto right-content align-items-center flex-wrap gap-2">
              <a
                href="#"
                className="btn btn-outline-light bg-white fw-medium d-inline-flex align-items-center"
                data-bs-toggle="modal"
                data-bs-target="#user_import"
              >
                <i className="ti ti-file-import me-1" />
                Import
              </a>
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
                      data-usr-action="export_pdf"
                    >
                      <i className="ti ti-file-type-pdf me-2" />
                      Export as PDF
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="dropdown-item rounded-1"
                      data-usr-action="export_excel"
                    >
                      <i className="ti ti-file-type-xls me-2" />
                      Export as Excel
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="dropdown-item rounded-1"
                      data-usr-action="export_csv"
                    >
                      <i className="ti ti-file-type-csv me-2" />
                      Export as CSV
                    </a>
                  </li>
                </ul>
              </div>
              <div className="dropdown">
                <a
                  href="#"
                  className="dropdown-toggle btn btn-outline-light bg-white fw-medium d-inline-flex align-items-center"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i className="ti ti-settings-bolt me-1" />
                  Bulk Actions
                </a>
                <ul className="dropdown-menu dropdown-menu-end p-2">
                  <li>
                    <a
                      href="#"
                      className="dropdown-item rounded-1"
                      data-usr-action="activate"
                    >
                      <i className="ti ti-user-check me-2" />
                      Activate
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="dropdown-item rounded-1"
                      data-usr-action="deactivate"
                    >
                      <i className="ti ti-user-off me-2" />
                      Deactivate
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="dropdown-item rounded-1"
                      data-usr-action="assign_role"
                    >
                      <i className="ti ti-shield-half me-2" />
                      Assign Role
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="dropdown-item rounded-1"
                      data-usr-action="export_csv"
                    >
                      <i className="ti ti-download me-2" />
                      Export Selected
                    </a>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <a
                      href="#"
                      className="dropdown-item rounded-1 text-danger"
                      data-bs-toggle="modal"
                      data-bs-target="#delete-modal"
                    >
                      <i className="ti ti-trash me-2" />
                      Delete Selected
                    </a>
                  </li>
                </ul>
              </div>
              <a
                href="#"
                className="btn btn-primary d-inline-flex align-items-center"
                data-bs-toggle="modal"
                data-bs-target="#invite_user"
              >
                <i className="ti ti-square-rounded-plus me-1" />
                Add User
              </a>
            </div>
          </div>
          {/* /Page Header */}
          {/* Summary analytics cards */}
          <div className="row g-3 mb-4">
            <div className="col-xxl-3 col-sm-6 d-flex">
              <div className="stats-card stats-card-directory stats-primary">
                <span className="stats-avatar stats-icon">
                  <i className="ti ti-users" />
                </span>
                <div>
                  <h3 className="stats-value mb-0">1,248</h3>
                  <p className="stats-label">Total Users</p>
                  <span className="stats-role">+8.2% this month</span>
                </div>
              </div>
            </div>
            <div className="col-xxl-3 col-sm-6 d-flex">
              <div className="stats-card stats-card-directory stats-success">
                <span className="stats-avatar stats-icon">
                  <i className="ti ti-user-check" />
                </span>
                <div>
                  <h3 className="stats-value mb-0">1,102</h3>
                  <p className="stats-label">Active Users</p>
                  <span className="stats-role">+5.1% this month</span>
                </div>
              </div>
            </div>
            <div className="col-xxl-3 col-sm-6 d-flex">
              <div className="stats-card stats-card-directory stats-warning">
                <span className="stats-avatar stats-icon">
                  <i className="ti ti-mail-forward" />
                </span>
                <div>
                  <h3 className="stats-value mb-0">42</h3>
                  <p className="stats-label">Pending Invitations</p>
                  <span className="stats-role">9 expiring soon</span>
                </div>
              </div>
            </div>
            <div className="col-xxl-3 col-sm-6 d-flex">
              <div className="stats-card stats-card-directory stats-info">
                <span className="stats-avatar stats-icon">
                  <i className="ti ti-user-off" />
                </span>
                <div>
                  <h3 className="stats-value mb-0">146</h3>
                  <p className="stats-label">Inactive Users</p>
                  <span className="stats-role">Admin locked 18</span>
                </div>
              </div>
            </div>
          </div>
          {/* /Summary analytics cards */}
          <div>
            {/* Users List */}
            <div className="card mb-4">
              <div
                className="data-workspace usr"
                id="usersWorkspace"
                data-density="default"
              >
                {/* ===================== TOOLBAR ===================== */}
                <div className="card-header border-bottom">
                  <div className="card-toolbar">
                    {/* Global search */}
                    <div className="card-search">
                      <i className="ti ti-search card-search-ic" />
                      <input
                        type="text"
                        id="usrSearch"
                        placeholder="Search name, ID, email, role…"
                        aria-label="Search users"
                      />
                      <span className="card-search-kbd" id="usrSearchKbd">
                        ⌘K
                      </span>
                      <button
                        type="button"
                        className="card-search-x"
                        id="usrSearchClear"
                        data-usr-action="clear_search"
                        aria-label="Clear search"
                        hidden
                      >
                        <i className="ti ti-x" />
                      </button>
                    </div>
                    {/* Saved Views */}
                    <div className="dropdown">
                      <button
                        type="button"
                        className="card-btn dropdown-toggle"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        <i className="ti ti-bookmark" />
                        Saved Views
                      </button>
                      <ul className="dropdown-menu">
                        <li className="card-menu-head">My Views</li>
                        <li>
                          <a
                            className="dropdown-item"
                            href="#"
                            data-usr-view="all"
                          >
                            <i className="ti ti-layout-list" />
                            All Users
                            <span className="card-vcount" />
                          </a>
                        </li>
                        <li>
                          <a
                            className="dropdown-item"
                            href="#"
                            data-usr-view="Active"
                          >
                            <i className="ti ti-circle-check" />
                            Active
                            <span className="card-vcount" />
                          </a>
                        </li>
                        <li>
                          <a
                            className="dropdown-item"
                            href="#"
                            data-usr-view="Pending"
                          >
                            <i className="ti ti-clock" />
                            Pending
                            <span className="card-vcount" />
                          </a>
                        </li>
                        <li>
                          <a
                            className="dropdown-item"
                            href="#"
                            data-usr-view="Inactive"
                          >
                            <i className="ti ti-circle-x" />
                            Inactive
                            <span className="card-vcount" />
                          </a>
                        </li>
                        <li>
                          <a
                            className="dropdown-item"
                            href="#"
                            data-usr-view="Blocked"
                          >
                            <i className="ti ti-ban" />
                            Blocked
                            <span className="card-vcount" />
                          </a>
                        </li>
                        <li>
                          <hr className="dropdown-divider" />
                        </li>
                        <li>
                          <a
                            className="dropdown-item text-primary"
                            href="#"
                            data-usr-action="save_view"
                          >
                            <i className="ti ti-plus" />
                            Save current view
                          </a>
                        </li>
                      </ul>
                    </div>
                    {/* Advanced Filter */}
                    <div className="dropdown">
                      <button
                        type="button"
                        className="card-btn dropdown-toggle"
                        data-bs-toggle="dropdown"
                        data-bs-auto-close="outside"
                        aria-expanded="false"
                      >
                        <i className="ti ti-adjustments-horizontal" />
                        Filters
                        <span className="card-count" id="usrFilterCount" hidden>
                          0
                        </span>
                      </button>
                      <div className="dropdown-menu p-3 card-filter-menu">
                        <div className="row g-3">
                          <div className="col-6">
                            <label className="form-label mb-1" htmlFor="role">
                              Role
                            </label>
                            <select
                              className="form-select"
                              data-filter="Role"
                              id="role"
                            >
                              <option value="">All</option>
                              <option>Administrator</option>
                              <option>Teacher</option>
                              <option>Student</option>
                              <option>Parent</option>
                              <option>Accountant</option>
                              <option>Librarian</option>
                              <option>Receptionist</option>
                              <option>Transport</option>
                            </select>
                          </div>
                          <div className="col-6">
                            <label
                              className="form-label mb-1"
                              htmlFor="department"
                            >
                              Department
                            </label>
                            <select
                              className="form-select"
                              data-filter="Department"
                              id="department"
                            >
                              <option value="">All</option>
                              <option>IT &amp; Admin</option>
                              <option>Science</option>
                              <option>Finance</option>
                              <option>Library</option>
                              <option>Transport</option>
                              <option>Front Office</option>
                            </select>
                          </div>
                          <div className="col-6">
                            <label className="form-label mb-1" htmlFor="status">
                              Status
                            </label>
                            <select
                              className="form-select"
                              data-filter="Status"
                              id="status"
                            >
                              <option value="">All</option>
                              <option>Active</option>
                              <option>Inactive</option>
                              <option>Pending</option>
                              <option>Blocked</option>
                              <option>Suspended</option>
                            </select>
                          </div>
                          <div className="col-6">
                            <label className="form-label mb-1" htmlFor="branch">
                              Branch
                            </label>
                            <select
                              className="form-select"
                              data-filter="Branch"
                              id="branch"
                            >
                              <option value="">All</option>
                              <option>Main Campus</option>
                              <option>North Branch</option>
                              <option>South Branch</option>
                              <option>West Branch</option>
                            </select>
                          </div>
                          <div className="col-6">
                            <label className="form-label mb-1" htmlFor="class">
                              Class
                            </label>
                            <select
                              className="form-select"
                              data-filter="Class"
                              id="class"
                            >
                              <option value="">All</option>
                              <option>Class I</option>
                              <option>Class II</option>
                              <option>Class III</option>
                              <option>Class IV</option>
                              <option>Class V</option>
                            </select>
                          </div>
                          <div className="col-6">
                            <label
                              className="form-label mb-1"
                              htmlFor="date-joined"
                            >
                              Date Joined
                            </label>
                            <select
                              className="form-select"
                              data-filter="Joined"
                              id="date-joined"
                            >
                              <option value="">All</option>
                              <option>2024</option>
                              <option>2023</option>
                              <option>2022</option>
                            </select>
                          </div>
                        </div>
                        <div className="d-flex align-items-center justify-content-between gap-2 mt-3 pt-3 border-top">
                          <span className="fs-12 text-muted">
                            <b id="usrFilterHits">8</b> of 8 users match
                          </span>
                          <div className="d-flex gap-2">
                            <button
                              type="button"
                              className="btn btn-light btn-sm"
                              data-usr-action="clear_filters"
                            >
                              Reset
                            </button>
                            <button
                              type="button"
                              className="btn btn-primary btn-sm"
                              data-usr-action="apply_filters"
                            >
                              Apply
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Column Visibility */}
                    <div className="dropdown">
                      <button
                        type="button"
                        className="card-btn dropdown-toggle"
                        data-bs-toggle="dropdown"
                        data-bs-auto-close="outside"
                        aria-expanded="false"
                      >
                        <i className="ti ti-columns-3" />
                        Columns
                      </button>
                      <ul className="dropdown-menu p-2 card-col-menu">
                        <li className="card-menu-head">Toggle columns</li>
                        <li>
                          <label className="dropdown-item">
                            <input
                              className="form-check-input me-2 mt-0"
                              type="checkbox"
                              data-usr-col="user"
                              defaultChecked
                            />
                            Profile
                          </label>
                        </li>
                        <li>
                          <label className="dropdown-item">
                            <input
                              className="form-check-input me-2 mt-0"
                              type="checkbox"
                              data-usr-col="userid"
                              defaultChecked
                            />
                            User ID
                          </label>
                        </li>
                        <li>
                          <label className="dropdown-item">
                            <input
                              className="form-check-input me-2 mt-0"
                              type="checkbox"
                              data-usr-col="role"
                              defaultChecked
                            />
                            Role
                          </label>
                        </li>
                        <li>
                          <label className="dropdown-item">
                            <input
                              className="form-check-input me-2 mt-0"
                              type="checkbox"
                              data-usr-col="department"
                              defaultChecked
                            />
                            Department
                          </label>
                        </li>
                        <li>
                          <label className="dropdown-item">
                            <input
                              className="form-check-input me-2 mt-0"
                              type="checkbox"
                              data-usr-col="email"
                              defaultChecked
                            />
                            Email
                          </label>
                        </li>
                        <li>
                          <label className="dropdown-item">
                            <input
                              className="form-check-input me-2 mt-0"
                              type="checkbox"
                              data-usr-col="phone"
                              defaultChecked
                            />
                            Phone
                          </label>
                        </li>
                        <li>
                          <label className="dropdown-item">
                            <input
                              className="form-check-input me-2 mt-0"
                              type="checkbox"
                              data-usr-col="branch"
                              defaultChecked
                            />
                            Branch
                          </label>
                        </li>
                        <li>
                          <label className="dropdown-item">
                            <input
                              className="form-check-input me-2 mt-0"
                              type="checkbox"
                              data-usr-col="login"
                              defaultChecked
                            />
                            Last Login
                          </label>
                        </li>
                        <li>
                          <label className="dropdown-item">
                            <input
                              className="form-check-input me-2 mt-0"
                              type="checkbox"
                              data-usr-col="created"
                              defaultChecked
                            />
                            Created Date
                          </label>
                        </li>
                        <li>
                          <hr className="dropdown-divider" />
                        </li>
                        <li>
                          <button
                            type="button"
                            className="dropdown-item text-primary"
                            data-usr-action="reset_columns"
                          >
                            <i className="ti ti-rotate" />
                            Show all columns
                          </button>
                        </li>
                      </ul>
                    </div>
                    <span className="flex-grow-1" />
                    {/* Density */}
                    <div
                      className="card-density"
                      role="group"
                      aria-label="Row density"
                    >
                      <button
                        type="button"
                        data-usr-density="compact"
                        data-bs-toggle="tooltip"
                        title="Compact"
                        aria-label="Compact rows"
                      >
                        <i className="ti ti-baseline-density-small" />
                      </button>
                      <button
                        type="button"
                        className="active"
                        data-usr-density="default"
                        data-bs-toggle="tooltip"
                        title="Default"
                        aria-label="Default rows"
                      >
                        <i className="ti ti-baseline-density-medium" />
                      </button>
                      <button
                        type="button"
                        data-usr-density="comfortable"
                        data-bs-toggle="tooltip"
                        title="Comfortable"
                        aria-label="Comfortable rows"
                      >
                        <i className="ti ti-baseline-density-large" />
                      </button>
                    </div>
                    {/* Refresh */}
                    <button
                      type="button"
                      className="card-btn card-btn-icon"
                      data-usr-action="refresh"
                      data-bs-toggle="tooltip"
                      title="Refresh"
                      aria-label="Refresh"
                    >
                      <i className="ti ti-refresh" />
                    </button>
                    {/* Export CSV */}
                    <button
                      type="button"
                      className="card-btn card-btn-icon"
                      data-usr-action="export_csv"
                      data-bs-toggle="tooltip"
                      title="Export CSV"
                      aria-label="Export CSV"
                    >
                      <i className="ti ti-file-type-csv" />
                    </button>
                    {/* Export Excel */}
                    <button
                      type="button"
                      className="card-btn card-btn-icon"
                      data-usr-action="export_excel"
                      data-bs-toggle="tooltip"
                      title="Export Excel"
                      aria-label="Export Excel"
                    >
                      <i className="ti ti-file-type-xls" />
                    </button>
                    {/* Print */}
                    <button
                      type="button"
                      className="card-btn card-btn-icon"
                      data-usr-action="print"
                      data-bs-toggle="tooltip"
                      title="Print"
                      aria-label="Print"
                    >
                      <i className="ti ti-printer" />
                    </button>
                    {/* Fullscreen */}
                    <button
                      type="button"
                      className="card-btn card-btn-icon"
                      data-usr-action="fullscreen"
                      data-bs-toggle="tooltip"
                      title="Fullscreen"
                      aria-label="Toggle fullscreen"
                      aria-pressed="false"
                    >
                      <i className="ti ti-arrows-maximize" />
                    </button>
                    {/* Invite User */}
                    <button
                      type="button"
                      className="card-btn"
                      data-bs-toggle="modal"
                      data-bs-target="#invite_user"
                    >
                      <i className="ti ti-send" />
                      Invite
                    </button>
                  </div>
                  {/* Quick filter chips */}
                  <div className="card-quickbar">
                    <span className="text-muted fs-12 fw-semibold me-1">
                      Quick:
                    </span>
                    <button
                      type="button"
                      className="card-quick"
                      data-usr-view="all"
                    >
                      <i className="ti ti-users" />
                      All Users <span className="card-quick-count">8</span>
                    </button>
                    <button
                      type="button"
                      className="card-quick"
                      data-usr-view="Teacher"
                    >
                      <i className="ti ti-user" />
                      Teachers <span className="card-quick-count">0</span>
                    </button>
                    <button
                      type="button"
                      className="card-quick"
                      data-usr-view="Student"
                    >
                      <i className="ti ti-school" />
                      Students <span className="card-quick-count">0</span>
                    </button>
                    <button
                      type="button"
                      className="card-quick"
                      data-usr-view="Parent"
                    >
                      <i className="ti ti-users-group" />
                      Parents <span className="card-quick-count">0</span>
                    </button>
                    <button
                      type="button"
                      className="card-quick"
                      data-usr-view="Accountant"
                    >
                      <i className="ti ti-calculator" />
                      Accountants <span className="card-quick-count">0</span>
                    </button>
                    <button
                      type="button"
                      className="card-quick"
                      data-usr-view="Librarian"
                    >
                      <i className="ti ti-books" />
                      Librarians <span className="card-quick-count">0</span>
                    </button>
                    <button
                      type="button"
                      className="card-quick"
                      data-usr-view="Receptionist"
                    >
                      <i className="ti ti-bell" />
                      Receptionists <span className="card-quick-count">0</span>
                    </button>
                    <button
                      type="button"
                      className="card-quick"
                      data-usr-view="Transport"
                    >
                      <i className="ti ti-bus" />
                      Transport Staff{" "}
                      <span className="card-quick-count">0</span>
                    </button>
                    <button
                      type="button"
                      className="card-quick"
                      data-usr-view="Inactive"
                    >
                      <i className="ti ti-user-off" />
                      Inactive <span className="card-quick-count">0</span>
                    </button>
                    <button
                      type="button"
                      className="card-quick"
                      data-usr-view="Blocked"
                    >
                      <i className="ti ti-ban" />
                      Blocked <span className="card-quick-count">0</span>
                    </button>
                    <button
                      type="button"
                      className="btn btn-link btn-sm text-primary card-clear-quick"
                      id="usrClearQuick"
                      data-usr-action="clear_filters"
                      hidden
                    >
                      Clear all
                    </button>
                    <div className="dropdown ms-auto">
                      <button
                        type="button"
                        className="card-btn dropdown-toggle"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        <i className="ti ti-sort-ascending-2" />
                        Sort
                      </button>
                      <ul className="dropdown-menu dropdown-menu-end">
                        <li className="card-menu-head">Sort by</li>
                        <li>
                          <button
                            type="button"
                            className="dropdown-item active"
                            data-usr-sort="recent"
                          >
                            <i className="ti ti-clock" />
                            Recently updated
                          </button>
                        </li>
                        <li>
                          <button
                            type="button"
                            className="dropdown-item"
                            data-usr-sort="name"
                          >
                            <i className="ti ti-abc" />
                            Name (A–Z)
                          </button>
                        </li>
                        <li>
                          <button
                            type="button"
                            className="dropdown-item"
                            data-usr-sort="role"
                          >
                            <i className="ti ti-shield-half" />
                            Role
                          </button>
                        </li>
                        <li>
                          <button
                            type="button"
                            className="dropdown-item"
                            data-usr-sort="department"
                          >
                            <i className="ti ti-building" />
                            Department
                          </button>
                        </li>
                        <li>
                          <button
                            type="button"
                            className="dropdown-item"
                            data-usr-sort="created"
                          >
                            <i className="ti ti-calendar" />
                            Created date
                          </button>
                        </li>
                      </ul>
                    </div>
                  </div>
                  {/* Active filter chips */}
                  <div className="card-chips" aria-live="polite" />
                </div>
                {/* Bulk action bar */}
                <div
                  className="bulk-selection"
                  id="usrBulk"
                  role="region"
                  aria-label="Bulk actions"
                  hidden
                >
                  <div className="bulk-selection-inner">
                    <span className="bulk-selection-count">
                      <b id="usrCount">0</b> selected
                    </span>
                    <div className="d-flex flex-wrap gap-2">
                      <button
                        type="button"
                        className="btn btn-sm"
                        data-usr-action="activate"
                      >
                        <i className="ti ti-user-check me-1" />
                        Activate
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm"
                        data-usr-action="deactivate"
                      >
                        <i className="ti ti-user-off me-1" />
                        Deactivate
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm"
                        data-usr-action="assign_role"
                      >
                        <i className="ti ti-shield-half me-1" />
                        Assign Role
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm"
                        data-usr-action="reset_password"
                      >
                        <i className="ti ti-key me-1" />
                        Reset Password
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm"
                        data-bs-toggle="modal"
                        data-bs-target="#invite_user"
                      >
                        <i className="ti ti-mail me-1" />
                        Send Email
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm"
                        data-usr-action="export_csv"
                      >
                        <i className="ti ti-download me-1" />
                        Export
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm text-danger"
                        data-bs-toggle="modal"
                        data-bs-target="#delete-modal"
                      >
                        <i className="ti ti-trash me-1" />
                        Bulk Delete
                      </button>
                    </div>
                    <button
                      type="button"
                      className="bulk-selection-close"
                      data-usr-action="clear_sel"
                      aria-label="Clear selection"
                    >
                      <i className="ti ti-x" />
                    </button>
                  </div>
                </div>
                {/* ===================== TABLE ===================== */}
                <div className="data-table">
                  <table className="table">
                    <caption className="visually-hidden">
                      User list with role, department, contact, branch, status,
                      last login and created date
                    </caption>
                    <thead>
                      <tr>
                        <th className="dt-pin usr-c-check">
                          <input
                            type="checkbox"
                            className="dt-check"
                            id="usrAll"
                            aria-label="Select all users"
                          />
                        </th>
                        <th
                          className="dt-sortable"
                          data-usr-col="user"
                          data-usr-sort="name"
                        >
                          Profile <i className="ti ti-arrows-sort dt-sort-ic" />
                          <span className="dt-resize" />
                        </th>
                        <th data-usr-col="userid">User ID</th>
                        <th
                          className="dt-sortable"
                          data-usr-col="role"
                          data-usr-sort="role"
                        >
                          Role <i className="ti ti-arrows-sort dt-sort-ic" />
                          <span className="dt-resize" />
                        </th>
                        <th
                          className="dt-sortable"
                          data-usr-col="department"
                          data-usr-sort="department"
                        >
                          Department{" "}
                          <i className="ti ti-arrows-sort dt-sort-ic" />
                          <span className="dt-resize" />
                        </th>
                        <th data-usr-col="email">Email</th>
                        <th data-usr-col="phone">Phone</th>
                        <th data-usr-col="branch">Branch</th>
                        <th data-usr-col="status">Status</th>
                        <th
                          className="dt-sortable"
                          data-usr-col="login"
                          data-usr-sort="login"
                        >
                          Last Login{" "}
                          <i className="ti ti-arrows-sort dt-sort-ic" />
                        </th>
                        <th
                          className="dt-sortable"
                          data-usr-col="created"
                          data-usr-sort="created"
                        >
                          Created <i className="ti ti-arrows-sort dt-sort-ic" />
                        </th>
                        <th className="text-end usr-c-act">Actions</th>
                      </tr>
                    </thead>
                    <tbody id="usrBody">
                      <tr
                        className="dt-row"
                        data-usr-status="Active"
                        data-search="kevin larry u-1001 administrator it admin kevin.larry@preskool.com main campus active 2022 online"
                      >
                        <td className="dt-pin">
                          <input
                            type="checkbox"
                            className="dt-check usr-rowcheck"
                            aria-label="Select Kevin Larry"
                          />
                        </td>
                        <td data-usr-col="user">
                          <div className="dt-user">
                            <a href="profile.html" className="dt-avatar">
                              <img
                                src="assets/img/profiles/avatar-27.jpg"
                                alt="Kevin Larry"
                              />
                              <span className="dt-presence on" title="Online" />
                            </a>
                            <div>
                              <a href="profile.html" className="dt-name">
                                Kevin Larry
                              </a>
                              <div className="dt-sub">
                                <span>ID U-1001</span>
                                <span className="dt-dot">•</span>
                                <span>Online</span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td data-usr-col="userid">
                          <a href="profile.html" className="link-primary">
                            U-1001
                          </a>
                        </td>
                        <td data-usr-col="role">
                          <span className="badge badge-soft-primary d-inline-flex align-items-center">
                            <i className="ti ti-shield-check me-1" />
                            Administrator
                          </span>
                        </td>
                        <td data-usr-col="department">IT &amp; Admin</td>
                        <td data-usr-col="email">
                          <a
                            href="#"
                            className="text-truncate d-inline-block"
                            style={{ maxWidth: 180 }}
                          >
                            kevin.larry@preskool.com
                          </a>
                        </td>
                        <td data-usr-col="phone">+1 452 6589 214</td>
                        <td data-usr-col="branch">Main Campus</td>
                        <td data-usr-col="status">
                          <span className="dt-pill is-active">
                            <span className="dt-pill-dot" />
                            Active
                          </span>
                        </td>
                        <td data-usr-col="login">
                          <div className="dt-login">
                            <span className="dt-login-date">25 Jul 2026</span>{" "}
                            <span className="dt-login-time">09:12 AM</span>
                            <span className="dt-login-rel">
                              <i className="ti ti-clock" />2 hours ago
                            </span>
                          </div>
                        </td>
                        <td data-usr-col="created">12 Jan 2022</td>
                        <td>
                          <div className="dt-actions">
                            <a
                              href="profile.html"
                              className="dt-ib"
                              title="View Profile"
                              aria-label="View Kevin Larry"
                            >
                              <i className="ti ti-eye" />
                            </a>
                            <a
                              href="profile-settings.html"
                              className="dt-ib"
                              title="Edit"
                              aria-label="Edit Kevin Larry"
                            >
                              <i className="ti ti-edit" />
                            </a>
                            <a
                              href="#"
                              className="dt-ib"
                              title="Send Email"
                              aria-label="Email Kevin Larry"
                            >
                              <i className="ti ti-mail" />
                            </a>
                            <div className="dropdown">
                              <a
                                role="button"
                                tabIndex={0}
                                className="dt-ib"
                                data-bs-toggle="dropdown"
                                aria-label="More actions"
                                title="More"
                              >
                                <i className="ti ti-dots-vertical" />
                              </a>
                              <div className="dropdown-menu dropdown-menu-end">
                                <a
                                  className="dropdown-item"
                                  href="profile.html"
                                >
                                  <i className="ti ti-user-circle" />
                                  View Profile
                                </a>
                                <a
                                  className="dropdown-item"
                                  href="profile-settings.html"
                                >
                                  <i className="ti ti-edit" />
                                  Edit
                                </a>
                                <a
                                  className="dropdown-item"
                                  href="#"
                                >
                                  <i className="ti ti-key" />
                                  Reset Password
                                </a>
                                <a
                                  className="dropdown-item"
                                  href="roles-permission.html"
                                >
                                  <i className="ti ti-shield-half" />
                                  Assign Role
                                </a>
                                <a
                                  className="dropdown-item"
                                  href="roles-permission.html"
                                >
                                  <i className="ti ti-lock-cog" />
                                  Permissions
                                </a>
                                <a
                                  className="dropdown-item"
                                  href="#"
                                >
                                  <i className="ti ti-mail" />
                                  Send Email
                                </a>
                                <hr className="dropdown-divider" />
                                <a
                                  className="dropdown-item"
                                  href="#"
                                >
                                  <i className="ti ti-user-off" />
                                  Deactivate
                                </a>
                                <a
                                  className="dropdown-item text-danger"
                                  href="#"
                                  data-bs-toggle="modal"
                                  data-bs-target="#delete-modal"
                                >
                                  <i className="ti ti-trash-x" />
                                  Delete
                                </a>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                      <tr
                        className="dt-row"
                        data-usr-status="Active"
                        data-search="sarah mitchell u-1002 teacher science sarah.m@preskool.com main campus active 2022 online"
                      >
                        <td className="dt-pin">
                          <input
                            type="checkbox"
                            className="dt-check usr-rowcheck"
                            aria-label="Select Sarah Mitchell"
                          />
                        </td>
                        <td data-usr-col="user">
                          <div className="dt-user">
                            <a href="profile.html" className="dt-avatar">
                              <img
                                src="assets/img/profiles/avatar-02.jpg"
                                alt="Sarah Mitchell"
                              />
                              <span className="dt-presence on" title="Online" />
                            </a>
                            <div>
                              <a href="profile.html" className="dt-name">
                                Sarah Mitchell
                              </a>
                              <div className="dt-sub">
                                <span>ID U-1002</span>
                                <span className="dt-dot">•</span>
                                <span>Online</span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td data-usr-col="userid">
                          <a href="profile.html" className="link-primary">
                            U-1002
                          </a>
                        </td>
                        <td data-usr-col="role">
                          <span className="badge badge-soft-success d-inline-flex align-items-center">
                            <i className="ti ti-user me-1" />
                            Teacher
                          </span>
                        </td>
                        <td data-usr-col="department">Science</td>
                        <td data-usr-col="email">
                          <a
                            href="#"
                            className="text-truncate d-inline-block"
                            style={{ maxWidth: 180 }}
                          >
                            sarah.m@preskool.com
                          </a>
                        </td>
                        <td data-usr-col="phone">+1 336 5540 118</td>
                        <td data-usr-col="branch">Main Campus</td>
                        <td data-usr-col="status">
                          <span className="dt-pill is-active">
                            <span className="dt-pill-dot" />
                            Active
                          </span>
                        </td>
                        <td data-usr-col="login">
                          <div className="dt-login">
                            <span className="dt-login-date">25 Jul 2026</span>{" "}
                            <span className="dt-login-time">08:40 AM</span>
                            <span className="dt-login-rel">
                              <i className="ti ti-clock" />3 hours ago
                            </span>
                          </div>
                        </td>
                        <td data-usr-col="created">03 Mar 2022</td>
                        <td>
                          <div className="dt-actions">
                            <a
                              href="profile.html"
                              className="dt-ib"
                              title="View Profile"
                              aria-label="View Sarah Mitchell"
                            >
                              <i className="ti ti-eye" />
                            </a>
                            <a
                              href="profile-settings.html"
                              className="dt-ib"
                              title="Edit"
                              aria-label="Edit Sarah Mitchell"
                            >
                              <i className="ti ti-edit" />
                            </a>
                            <a
                              href="#"
                              className="dt-ib"
                              title="Send Email"
                              aria-label="Email Sarah Mitchell"
                            >
                              <i className="ti ti-mail" />
                            </a>
                            <div className="dropdown">
                              <a
                                role="button"
                                tabIndex={0}
                                className="dt-ib"
                                data-bs-toggle="dropdown"
                                aria-label="More actions"
                                title="More"
                              >
                                <i className="ti ti-dots-vertical" />
                              </a>
                              <div className="dropdown-menu dropdown-menu-end">
                                <a
                                  className="dropdown-item"
                                  href="profile.html"
                                >
                                  <i className="ti ti-user-circle" />
                                  View Profile
                                </a>
                                <a
                                  className="dropdown-item"
                                  href="profile-settings.html"
                                >
                                  <i className="ti ti-edit" />
                                  Edit
                                </a>
                                <a
                                  className="dropdown-item"
                                  href="#"
                                >
                                  <i className="ti ti-key" />
                                  Reset Password
                                </a>
                                <a
                                  className="dropdown-item"
                                  href="roles-permission.html"
                                >
                                  <i className="ti ti-shield-half" />
                                  Assign Role
                                </a>
                                <a
                                  className="dropdown-item"
                                  href="roles-permission.html"
                                >
                                  <i className="ti ti-lock-cog" />
                                  Permissions
                                </a>
                                <a
                                  className="dropdown-item"
                                  href="#"
                                >
                                  <i className="ti ti-mail" />
                                  Send Email
                                </a>
                                <hr className="dropdown-divider" />
                                <a
                                  className="dropdown-item"
                                  href="#"
                                >
                                  <i className="ti ti-user-off" />
                                  Deactivate
                                </a>
                                <a
                                  className="dropdown-item text-danger"
                                  href="#"
                                  data-bs-toggle="modal"
                                  data-bs-target="#delete-modal"
                                >
                                  <i className="ti ti-trash-x" />
                                  Delete
                                </a>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                      <tr
                        className="dt-row"
                        data-usr-status="Pending"
                        data-search="james wilson u-1003 accountant finance james.w@preskool.com north branch pending 2023"
                      >
                        <td className="dt-pin">
                          <input
                            type="checkbox"
                            className="dt-check usr-rowcheck"
                            aria-label="Select James Wilson"
                          />
                        </td>
                        <td data-usr-col="user">
                          <div className="dt-user">
                            <a href="profile.html" className="dt-avatar">
                              <img
                                src="assets/img/profiles/avatar-03.jpg"
                                alt="James Wilson"
                              />
                              <span className="dt-presence" title="Offline" />
                            </a>
                            <div>
                              <a href="profile.html" className="dt-name">
                                James Wilson
                              </a>
                              <div className="dt-sub">
                                <span>ID U-1003</span>
                                <span className="dt-dot">•</span>
                                <span>Invited</span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td data-usr-col="userid">
                          <a href="profile.html" className="link-primary">
                            U-1003
                          </a>
                        </td>
                        <td data-usr-col="role">
                          <span className="badge badge-soft-warning d-inline-flex align-items-center">
                            <i className="ti ti-calculator me-1" />
                            Accountant
                          </span>
                        </td>
                        <td data-usr-col="department">Finance</td>
                        <td data-usr-col="email">
                          <a
                            href="#"
                            className="text-truncate d-inline-block"
                            style={{ maxWidth: 180 }}
                          >
                            james.w@preskool.com
                          </a>
                        </td>
                        <td data-usr-col="phone">+1 774 2201 907</td>
                        <td data-usr-col="branch">North Branch</td>
                        <td data-usr-col="status">
                          <span className="dt-pill is-pending">
                            <span className="dt-pill-dot" />
                            Pending
                          </span>
                        </td>
                        <td data-usr-col="login">
                          <div className="dt-login">
                            <span className="dt-login-date">24 Jul 2026</span>{" "}
                            <span className="dt-login-time">06:05 PM</span>
                            <span className="dt-login-rel">
                              <i className="ti ti-clock" />1 day ago
                            </span>
                          </div>
                        </td>
                        <td data-usr-col="created">18 Jun 2023</td>
                        <td>
                          <div className="dt-actions">
                            <a
                              href="profile.html"
                              className="dt-ib"
                              title="View Profile"
                              aria-label="View James Wilson"
                            >
                              <i className="ti ti-eye" />
                            </a>
                            <a
                              href="profile-settings.html"
                              className="dt-ib"
                              title="Edit"
                              aria-label="Edit James Wilson"
                            >
                              <i className="ti ti-edit" />
                            </a>
                            <a
                              href="#"
                              className="dt-ib"
                              title="Send Email"
                              aria-label="Email James Wilson"
                            >
                              <i className="ti ti-mail" />
                            </a>
                            <div className="dropdown">
                              <a
                                role="button"
                                tabIndex={0}
                                className="dt-ib"
                                data-bs-toggle="dropdown"
                                aria-label="More actions"
                                title="More"
                              >
                                <i className="ti ti-dots-vertical" />
                              </a>
                              <div className="dropdown-menu dropdown-menu-end">
                                <a
                                  className="dropdown-item"
                                  href="profile.html"
                                >
                                  <i className="ti ti-user-circle" />
                                  View Profile
                                </a>
                                <a
                                  className="dropdown-item"
                                  href="profile-settings.html"
                                >
                                  <i className="ti ti-edit" />
                                  Edit
                                </a>
                                <a
                                  className="dropdown-item"
                                  href="#"
                                >
                                  <i className="ti ti-key" />
                                  Reset Password
                                </a>
                                <a
                                  className="dropdown-item"
                                  href="roles-permission.html"
                                >
                                  <i className="ti ti-shield-half" />
                                  Assign Role
                                </a>
                                <a
                                  className="dropdown-item"
                                  href="roles-permission.html"
                                >
                                  <i className="ti ti-lock-cog" />
                                  Permissions
                                </a>
                                <a
                                  className="dropdown-item"
                                  href="#"
                                >
                                  <i className="ti ti-mail" />
                                  Send Email
                                </a>
                                <hr className="dropdown-divider" />
                                <a
                                  className="dropdown-item"
                                  href="#"
                                >
                                  <i className="ti ti-user-off" />
                                  Deactivate
                                </a>
                                <a
                                  className="dropdown-item text-danger"
                                  href="#"
                                  data-bs-toggle="modal"
                                  data-bs-target="#delete-modal"
                                >
                                  <i className="ti ti-trash-x" />
                                  Delete
                                </a>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                      <tr
                        className="dt-row"
                        data-usr-status="Active"
                        data-search="emily clarke u-1004 librarian library emily.c@preskool.com main campus active 2022"
                      >
                        <td className="dt-pin">
                          <input
                            type="checkbox"
                            className="dt-check usr-rowcheck"
                            aria-label="Select Emily Clarke"
                          />
                        </td>
                        <td data-usr-col="user">
                          <div className="dt-user">
                            <a href="profile.html" className="dt-avatar">
                              <img
                                src="assets/img/profiles/avatar-04.jpg"
                                alt="Emily Clarke"
                              />
                              <span className="dt-presence" title="Offline" />
                            </a>
                            <div>
                              <a href="profile.html" className="dt-name">
                                Emily Clarke
                              </a>
                              <div className="dt-sub">
                                <span>ID U-1004</span>
                                <span className="dt-dot">•</span>
                                <span>Away</span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td data-usr-col="userid">
                          <a href="profile.html" className="link-primary">
                            U-1004
                          </a>
                        </td>
                        <td data-usr-col="role">
                          <span className="badge badge-soft-teal d-inline-flex align-items-center">
                            <i className="ti ti-books me-1" />
                            Librarian
                          </span>
                        </td>
                        <td data-usr-col="department">Library</td>
                        <td data-usr-col="email">
                          <a
                            href="#"
                            className="text-truncate d-inline-block"
                            style={{ maxWidth: 180 }}
                          >
                            emily.c@preskool.com
                          </a>
                        </td>
                        <td data-usr-col="phone">+1 908 4471 662</td>
                        <td data-usr-col="branch">Main Campus</td>
                        <td data-usr-col="status">
                          <span className="dt-pill is-active">
                            <span className="dt-pill-dot" />
                            Active
                          </span>
                        </td>
                        <td data-usr-col="login">
                          <div className="dt-login">
                            <span className="dt-login-date">25 Jul 2026</span>{" "}
                            <span className="dt-login-time">07:15 AM</span>
                            <span className="dt-login-rel">
                              <i className="ti ti-clock" />4 hours ago
                            </span>
                          </div>
                        </td>
                        <td data-usr-col="created">22 Sep 2022</td>
                        <td>
                          <div className="dt-actions">
                            <a
                              href="profile.html"
                              className="dt-ib"
                              title="View Profile"
                              aria-label="View Emily Clarke"
                            >
                              <i className="ti ti-eye" />
                            </a>
                            <a
                              href="profile-settings.html"
                              className="dt-ib"
                              title="Edit"
                              aria-label="Edit Emily Clarke"
                            >
                              <i className="ti ti-edit" />
                            </a>
                            <a
                              href="#"
                              className="dt-ib"
                              title="Send Email"
                              aria-label="Email Emily Clarke"
                            >
                              <i className="ti ti-mail" />
                            </a>
                            <div className="dropdown">
                              <a
                                role="button"
                                tabIndex={0}
                                className="dt-ib"
                                data-bs-toggle="dropdown"
                                aria-label="More actions"
                                title="More"
                              >
                                <i className="ti ti-dots-vertical" />
                              </a>
                              <div className="dropdown-menu dropdown-menu-end">
                                <a
                                  className="dropdown-item"
                                  href="profile.html"
                                >
                                  <i className="ti ti-user-circle" />
                                  View Profile
                                </a>
                                <a
                                  className="dropdown-item"
                                  href="profile-settings.html"
                                >
                                  <i className="ti ti-edit" />
                                  Edit
                                </a>
                                <a
                                  className="dropdown-item"
                                  href="#"
                                >
                                  <i className="ti ti-key" />
                                  Reset Password
                                </a>
                                <a
                                  className="dropdown-item"
                                  href="roles-permission.html"
                                >
                                  <i className="ti ti-shield-half" />
                                  Assign Role
                                </a>
                                <a
                                  className="dropdown-item"
                                  href="roles-permission.html"
                                >
                                  <i className="ti ti-lock-cog" />
                                  Permissions
                                </a>
                                <a
                                  className="dropdown-item"
                                  href="#"
                                >
                                  <i className="ti ti-mail" />
                                  Send Email
                                </a>
                                <hr className="dropdown-divider" />
                                <a
                                  className="dropdown-item"
                                  href="#"
                                >
                                  <i className="ti ti-user-off" />
                                  Deactivate
                                </a>
                                <a
                                  className="dropdown-item text-danger"
                                  href="#"
                                  data-bs-toggle="modal"
                                  data-bs-target="#delete-modal"
                                >
                                  <i className="ti ti-trash-x" />
                                  Delete
                                </a>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                      <tr
                        className="dt-row"
                        data-usr-status="Inactive"
                        data-search="robert fox u-1005 parent robert.fox@example.com inactive 2023"
                      >
                        <td className="dt-pin">
                          <input
                            type="checkbox"
                            className="dt-check usr-rowcheck"
                            aria-label="Select Robert Fox"
                          />
                        </td>
                        <td data-usr-col="user">
                          <div className="dt-user">
                            <a href="profile.html" className="dt-avatar">
                              <img
                                src="assets/img/profiles/avatar-05.jpg"
                                alt="Robert Fox"
                              />
                              <span className="dt-presence" title="Offline" />
                            </a>
                            <div>
                              <a href="profile.html" className="dt-name">
                                Robert Fox
                              </a>
                              <div className="dt-sub">
                                <span>ID U-1005</span>
                                <span className="dt-dot">•</span>
                                <span>Offline</span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td data-usr-col="userid">
                          <a href="profile.html" className="link-primary">
                            U-1005
                          </a>
                        </td>
                        <td data-usr-col="role">
                          <span className="badge badge-soft-purple d-inline-flex align-items-center">
                            <i className="ti ti-users-group me-1" />
                            Parent
                          </span>
                        </td>
                        <td data-usr-col="department">
                          <span className="text-muted">—</span>
                        </td>
                        <td data-usr-col="email">
                          <a
                            href="#"
                            className="text-truncate d-inline-block"
                            style={{ maxWidth: 180 }}
                          >
                            robert.fox@example.com
                          </a>
                        </td>
                        <td data-usr-col="phone">+1 565 6466 545</td>
                        <td data-usr-col="branch">
                          <span className="text-muted">—</span>
                        </td>
                        <td data-usr-col="status">
                          <span className="dt-pill is-inactive">
                            <span className="dt-pill-dot" />
                            Inactive
                          </span>
                        </td>
                        <td data-usr-col="login">
                          <div className="dt-login is-never">
                            <span className="dt-login-date">
                              Never signed in
                            </span>
                          </div>
                        </td>
                        <td data-usr-col="created">09 Nov 2023</td>
                        <td>
                          <div className="dt-actions">
                            <a
                              href="profile.html"
                              className="dt-ib"
                              title="View Profile"
                              aria-label="View Robert Fox"
                            >
                              <i className="ti ti-eye" />
                            </a>
                            <a
                              href="profile-settings.html"
                              className="dt-ib"
                              title="Edit"
                              aria-label="Edit Robert Fox"
                            >
                              <i className="ti ti-edit" />
                            </a>
                            <a
                              href="#"
                              className="dt-ib"
                              title="Send Email"
                              aria-label="Email Robert Fox"
                            >
                              <i className="ti ti-mail" />
                            </a>
                            <div className="dropdown">
                              <a
                                role="button"
                                tabIndex={0}
                                className="dt-ib"
                                data-bs-toggle="dropdown"
                                aria-label="More actions"
                                title="More"
                              >
                                <i className="ti ti-dots-vertical" />
                              </a>
                              <div className="dropdown-menu dropdown-menu-end">
                                <a
                                  className="dropdown-item"
                                  href="profile.html"
                                >
                                  <i className="ti ti-user-circle" />
                                  View Profile
                                </a>
                                <a
                                  className="dropdown-item"
                                  href="profile-settings.html"
                                >
                                  <i className="ti ti-edit" />
                                  Edit
                                </a>
                                <a
                                  className="dropdown-item"
                                  href="#"
                                >
                                  <i className="ti ti-key" />
                                  Reset Password
                                </a>
                                <a
                                  className="dropdown-item"
                                  href="roles-permission.html"
                                >
                                  <i className="ti ti-shield-half" />
                                  Assign Role
                                </a>
                                <a
                                  className="dropdown-item"
                                  href="roles-permission.html"
                                >
                                  <i className="ti ti-lock-cog" />
                                  Permissions
                                </a>
                                <a
                                  className="dropdown-item"
                                  href="#"
                                >
                                  <i className="ti ti-mail" />
                                  Send Email
                                </a>
                                <hr className="dropdown-divider" />
                                <a
                                  className="dropdown-item"
                                  href="#"
                                >
                                  <i className="ti ti-user-off" />
                                  Deactivate
                                </a>
                                <a
                                  className="dropdown-item text-danger"
                                  href="#"
                                  data-bs-toggle="modal"
                                  data-bs-target="#delete-modal"
                                >
                                  <i className="ti ti-trash-x" />
                                  Delete
                                </a>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                      <tr
                        className="dt-row"
                        data-usr-status="Active"
                        data-search="janet doe u-1006 student class iii janet.d@preskool.com west branch active 2024"
                      >
                        <td className="dt-pin">
                          <input
                            type="checkbox"
                            className="dt-check usr-rowcheck"
                            aria-label="Select Janet Doe"
                          />
                        </td>
                        <td data-usr-col="user">
                          <div className="dt-user">
                            <a href="profile.html" className="dt-avatar">
                              <img
                                src="assets/img/students/student-01.jpg"
                                alt="Janet Doe"
                              />
                              <span className="dt-presence on" title="Online" />
                            </a>
                            <div>
                              <a href="profile.html" className="dt-name">
                                Janet Doe
                              </a>
                              <div className="dt-sub">
                                <span>ID U-1006</span>
                                <span className="dt-dot">•</span>
                                <span>Online</span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td data-usr-col="userid">
                          <a href="profile.html" className="link-primary">
                            U-1006
                          </a>
                        </td>
                        <td data-usr-col="role">
                          <span className="badge badge-soft-info d-inline-flex align-items-center">
                            <i className="ti ti-school me-1" />
                            Student
                          </span>
                        </td>
                        <td data-usr-col="department">Class III</td>
                        <td data-usr-col="email">
                          <a
                            href="#"
                            className="text-truncate d-inline-block"
                            style={{ maxWidth: 180 }}
                          >
                            janet.d@preskool.com
                          </a>
                        </td>
                        <td data-usr-col="phone">+1 445 1120 330</td>
                        <td data-usr-col="branch">West Branch</td>
                        <td data-usr-col="status">
                          <span className="dt-pill is-active">
                            <span className="dt-pill-dot" />
                            Active
                          </span>
                        </td>
                        <td data-usr-col="login">
                          <div className="dt-login">
                            <span className="dt-login-date">25 Jul 2026</span>{" "}
                            <span className="dt-login-time">06:50 AM</span>
                            <span className="dt-login-rel">
                              <i className="ti ti-clock" />5 hours ago
                            </span>
                          </div>
                        </td>
                        <td data-usr-col="created">25 Mar 2024</td>
                        <td>
                          <div className="dt-actions">
                            <a
                              href="profile.html"
                              className="dt-ib"
                              title="View Profile"
                              aria-label="View Janet Doe"
                            >
                              <i className="ti ti-eye" />
                            </a>
                            <a
                              href="profile-settings.html"
                              className="dt-ib"
                              title="Edit"
                              aria-label="Edit Janet Doe"
                            >
                              <i className="ti ti-edit" />
                            </a>
                            <a
                              href="#"
                              className="dt-ib"
                              title="Send Email"
                              aria-label="Email Janet Doe"
                            >
                              <i className="ti ti-mail" />
                            </a>
                            <div className="dropdown">
                              <a
                                role="button"
                                tabIndex={0}
                                className="dt-ib"
                                data-bs-toggle="dropdown"
                                aria-label="More actions"
                                title="More"
                              >
                                <i className="ti ti-dots-vertical" />
                              </a>
                              <div className="dropdown-menu dropdown-menu-end">
                                <a
                                  className="dropdown-item"
                                  href="profile.html"
                                >
                                  <i className="ti ti-user-circle" />
                                  View Profile
                                </a>
                                <a
                                  className="dropdown-item"
                                  href="profile-settings.html"
                                >
                                  <i className="ti ti-edit" />
                                  Edit
                                </a>
                                <a
                                  className="dropdown-item"
                                  href="#"
                                >
                                  <i className="ti ti-key" />
                                  Reset Password
                                </a>
                                <a
                                  className="dropdown-item"
                                  href="roles-permission.html"
                                >
                                  <i className="ti ti-shield-half" />
                                  Assign Role
                                </a>
                                <a
                                  className="dropdown-item"
                                  href="roles-permission.html"
                                >
                                  <i className="ti ti-lock-cog" />
                                  Permissions
                                </a>
                                <a
                                  className="dropdown-item"
                                  href="#"
                                >
                                  <i className="ti ti-mail" />
                                  Send Email
                                </a>
                                <hr className="dropdown-divider" />
                                <a
                                  className="dropdown-item"
                                  href="#"
                                >
                                  <i className="ti ti-user-off" />
                                  Deactivate
                                </a>
                                <a
                                  className="dropdown-item text-danger"
                                  href="#"
                                  data-bs-toggle="modal"
                                  data-bs-target="#delete-modal"
                                >
                                  <i className="ti ti-trash-x" />
                                  Delete
                                </a>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                      <tr
                        className="dt-row"
                        data-usr-status="Suspended"
                        data-search="marcus lee u-1007 transport marcus.l@preskool.com south branch suspended 2023"
                      >
                        <td className="dt-pin">
                          <input
                            type="checkbox"
                            className="dt-check usr-rowcheck"
                            aria-label="Select Marcus Lee"
                          />
                        </td>
                        <td data-usr-col="user">
                          <div className="dt-user">
                            <a href="profile.html" className="dt-avatar">
                              <img
                                src="assets/img/profiles/avatar-07.jpg"
                                alt="Marcus Lee"
                              />
                              <span className="dt-presence" title="Offline" />
                            </a>
                            <div>
                              <a href="profile.html" className="dt-name">
                                Marcus Lee
                              </a>
                              <div className="dt-sub">
                                <span>ID U-1007</span>
                                <span className="dt-dot">•</span>
                                <span>Offline</span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td data-usr-col="userid">
                          <a href="profile.html" className="link-primary">
                            U-1007
                          </a>
                        </td>
                        <td data-usr-col="role">
                          <span className="badge badge-soft-secondary d-inline-flex align-items-center">
                            <i className="ti ti-bus me-1" />
                            Transport
                          </span>
                        </td>
                        <td data-usr-col="department">Transport</td>
                        <td data-usr-col="email">
                          <a
                            href="#"
                            className="text-truncate d-inline-block"
                            style={{ maxWidth: 180 }}
                          >
                            marcus.l@preskool.com
                          </a>
                        </td>
                        <td data-usr-col="phone">+1 220 8890 471</td>
                        <td data-usr-col="branch">South Branch</td>
                        <td data-usr-col="status">
                          <span className="dt-pill is-suspended">
                            <span className="dt-pill-dot" />
                            Suspended
                          </span>
                        </td>
                        <td data-usr-col="login">
                          <div className="dt-login">
                            <span className="dt-login-date">20 Jul 2026</span>{" "}
                            <span className="dt-login-time">04:30 PM</span>
                            <span className="dt-login-rel">
                              <i className="ti ti-clock" />5 days ago
                            </span>
                          </div>
                        </td>
                        <td data-usr-col="created">14 Feb 2023</td>
                        <td>
                          <div className="dt-actions">
                            <a
                              href="profile.html"
                              className="dt-ib"
                              title="View Profile"
                              aria-label="View Marcus Lee"
                            >
                              <i className="ti ti-eye" />
                            </a>
                            <a
                              href="profile-settings.html"
                              className="dt-ib"
                              title="Edit"
                              aria-label="Edit Marcus Lee"
                            >
                              <i className="ti ti-edit" />
                            </a>
                            <a
                              href="#"
                              className="dt-ib"
                              title="Send Email"
                              aria-label="Email Marcus Lee"
                            >
                              <i className="ti ti-mail" />
                            </a>
                            <div className="dropdown">
                              <a
                                role="button"
                                tabIndex={0}
                                className="dt-ib"
                                data-bs-toggle="dropdown"
                                aria-label="More actions"
                                title="More"
                              >
                                <i className="ti ti-dots-vertical" />
                              </a>
                              <div className="dropdown-menu dropdown-menu-end">
                                <a
                                  className="dropdown-item"
                                  href="profile.html"
                                >
                                  <i className="ti ti-user-circle" />
                                  View Profile
                                </a>
                                <a
                                  className="dropdown-item"
                                  href="profile-settings.html"
                                >
                                  <i className="ti ti-edit" />
                                  Edit
                                </a>
                                <a
                                  className="dropdown-item"
                                  href="#"
                                >
                                  <i className="ti ti-key" />
                                  Reset Password
                                </a>
                                <a
                                  className="dropdown-item"
                                  href="roles-permission.html"
                                >
                                  <i className="ti ti-shield-half" />
                                  Assign Role
                                </a>
                                <a
                                  className="dropdown-item"
                                  href="roles-permission.html"
                                >
                                  <i className="ti ti-lock-cog" />
                                  Permissions
                                </a>
                                <a
                                  className="dropdown-item"
                                  href="#"
                                >
                                  <i className="ti ti-mail" />
                                  Send Email
                                </a>
                                <hr className="dropdown-divider" />
                                <a
                                  className="dropdown-item"
                                  href="#"
                                >
                                  <i className="ti ti-user-off" />
                                  Deactivate
                                </a>
                                <a
                                  className="dropdown-item text-danger"
                                  href="#"
                                  data-bs-toggle="modal"
                                  data-bs-target="#delete-modal"
                                >
                                  <i className="ti ti-trash-x" />
                                  Delete
                                </a>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                      <tr
                        className="dt-row"
                        data-usr-status="Blocked"
                        data-search="olivia grant u-1008 receptionist front office olivia.g@preskool.com main campus blocked 2023"
                      >
                        <td className="dt-pin">
                          <input
                            type="checkbox"
                            className="dt-check usr-rowcheck"
                            aria-label="Select Olivia Grant"
                          />
                        </td>
                        <td data-usr-col="user">
                          <div className="dt-user">
                            <a href="profile.html" className="dt-avatar">
                              <img
                                src="assets/img/profiles/avatar-08.jpg"
                                alt="Olivia Grant"
                              />
                              <span className="dt-presence" title="Offline" />
                            </a>
                            <div>
                              <a href="profile.html" className="dt-name">
                                Olivia Grant
                              </a>
                              <div className="dt-sub">
                                <span>ID U-1008</span>
                                <span className="dt-dot">•</span>
                                <span>Blocked</span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td data-usr-col="userid">
                          <a href="profile.html" className="link-primary">
                            U-1008
                          </a>
                        </td>
                        <td data-usr-col="role">
                          <span className="badge badge-soft-skyblue d-inline-flex align-items-center">
                            <i className="ti ti-bell me-1" />
                            Receptionist
                          </span>
                        </td>
                        <td data-usr-col="department">Front Office</td>
                        <td data-usr-col="email">
                          <a
                            href="#"
                            className="text-truncate d-inline-block"
                            style={{ maxWidth: 180 }}
                          >
                            olivia.g@preskool.com
                          </a>
                        </td>
                        <td data-usr-col="phone">+1 661 3345 209</td>
                        <td data-usr-col="branch">Main Campus</td>
                        <td data-usr-col="status">
                          <span className="dt-pill is-blocked">
                            <span className="dt-pill-dot" />
                            Blocked
                          </span>
                        </td>
                        <td data-usr-col="login">
                          <div className="dt-login">
                            <span className="dt-login-date">18 Jul 2026</span>{" "}
                            <span className="dt-login-time">10:10 AM</span>
                            <span className="dt-login-rel">
                              <i className="ti ti-clock" />7 days ago
                            </span>
                          </div>
                        </td>
                        <td data-usr-col="created">30 Aug 2023</td>
                        <td>
                          <div className="dt-actions">
                            <a
                              href="profile.html"
                              className="dt-ib"
                              title="View Profile"
                              aria-label="View Olivia Grant"
                            >
                              <i className="ti ti-eye" />
                            </a>
                            <a
                              href="profile-settings.html"
                              className="dt-ib"
                              title="Edit"
                              aria-label="Edit Olivia Grant"
                            >
                              <i className="ti ti-edit" />
                            </a>
                            <a
                              href="#"
                              className="dt-ib"
                              title="Send Email"
                              aria-label="Email Olivia Grant"
                            >
                              <i className="ti ti-mail" />
                            </a>
                            <div className="dropdown">
                              <a
                                role="button"
                                tabIndex={0}
                                className="dt-ib"
                                data-bs-toggle="dropdown"
                                aria-label="More actions"
                                title="More"
                              >
                                <i className="ti ti-dots-vertical" />
                              </a>
                              <div className="dropdown-menu dropdown-menu-end">
                                <a
                                  className="dropdown-item"
                                  href="profile.html"
                                >
                                  <i className="ti ti-user-circle" />
                                  View Profile
                                </a>
                                <a
                                  className="dropdown-item"
                                  href="profile-settings.html"
                                >
                                  <i className="ti ti-edit" />
                                  Edit
                                </a>
                                <a
                                  className="dropdown-item"
                                  href="#"
                                >
                                  <i className="ti ti-key" />
                                  Reset Password
                                </a>
                                <a
                                  className="dropdown-item"
                                  href="roles-permission.html"
                                >
                                  <i className="ti ti-shield-half" />
                                  Assign Role
                                </a>
                                <a
                                  className="dropdown-item"
                                  href="roles-permission.html"
                                >
                                  <i className="ti ti-lock-cog" />
                                  Permissions
                                </a>
                                <a
                                  className="dropdown-item"
                                  href="#"
                                >
                                  <i className="ti ti-mail" />
                                  Send Email
                                </a>
                                <hr className="dropdown-divider" />
                                <a
                                  className="dropdown-item"
                                  href="#"
                                >
                                  <i className="ti ti-user-off" />
                                  Deactivate
                                </a>
                                <a
                                  className="dropdown-item text-danger"
                                  href="#"
                                  data-bs-toggle="modal"
                                  data-bs-target="#delete-modal"
                                >
                                  <i className="ti ti-trash-x" />
                                  Delete
                                </a>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                {/* Empty state */}
                <div className="card-empty" id="usrEmpty">
                  <div className="card-empty-art">
                    <i className="ti ti-user-search" />
                  </div>
                  <h4 className="fs-16 fw-medium">No Users Found</h4>
                  <p>
                    Adjust your filters or add a new user to see results here.
                  </p>
                  <div className="d-flex justify-content-center gap-2">
                    <button
                      type="button"
                      className="btn btn-light"
                      data-usr-action="clear_filters"
                    >
                      <i className="ti ti-rotate me-1" />
                      Reset filters
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary"
                      data-bs-toggle="modal"
                      data-bs-target="#invite_user"
                    >
                      <i className="ti ti-square-rounded-plus me-1" />
                      Add User
                    </button>
                  </div>
                </div>
                {/* Pagination footer */}
                <div className="card-foot">
                  <div className="card-foot-info">
                    Showing <span className="usr-range-from">1</span>–
                    <span className="usr-range-to">8</span>
                    of <span className="usr-range-total">1248</span> users
                  </div>
                  <div className="card-foot-size">
                    <label className="mb-0">Rows:</label>
                    <select className="form-select" aria-label="Rows per page">
                      <option value={10}>10</option>
                      <option value={25}>25</option>
                      <option value={50}>50</option>
                      <option value={100}>100</option>
                    </select>
                  </div>
                  <nav
                    className="card-pagination"
                    aria-label="Users pagination"
                  >
                    <button
                      type="button"
                      className="card-page-btn"
                      data-usr-action="page"
                      aria-label="First page"
                      disabled
                    >
                      <i className="ti ti-chevrons-left" />
                    </button>
                    <button
                      type="button"
                      className="card-page-btn"
                      data-usr-action="page"
                      aria-label="Previous page"
                      disabled
                    >
                      <i className="ti ti-chevron-left" />
                    </button>
                    <span className="card-page-numbers">
                      <button
                        type="button"
                        className="card-page-btn active"
                        data-usr-action="page"
                        aria-current="page"
                      >
                        1
                      </button>
                      <button
                        type="button"
                        className="card-page-btn"
                        data-usr-action="page"
                      >
                        2
                      </button>
                      <button
                        type="button"
                        className="card-page-btn"
                        data-usr-action="page"
                      >
                        3
                      </button>
                    </span>
                    <button
                      type="button"
                      className="card-page-btn"
                      data-usr-action="page"
                      aria-label="Next page"
                    >
                      <i className="ti ti-chevron-right" />
                    </button>
                    <button
                      type="button"
                      className="card-page-btn"
                      data-usr-action="page"
                      aria-label="Last page"
                    >
                      <i className="ti ti-chevrons-right" />
                    </button>
                  </nav>
                </div>
                <div
                  className="toast-stack toast-container"
                  id="usrToasts"
                  aria-live="polite"
                  aria-atomic="true"
                />
              </div>
            </div>
            {/* /Users List */}
            {/* ===================== LIVE INSIGHTS (full-width, below table) ===================== */}
            <section aria-label="Live user insights">
              <div className="row g-3">
                {/* Recent Registrations */}
                <div className="col-xl-4 col-md-6 d-flex">
                  <div className="card flex-fill mb-0">
                    <div className="card-header d-flex align-items-center justify-content-between">
                      <h5 className="mb-0 d-flex align-items-center">
                        <i className="ti ti-user-plus text-primary me-2" />
                        Recent Registrations
                      </h5>
                      <a
                        href="#"
                        className="link-primary fs-13 fw-medium"
                      >
                        View All
                      </a>
                    </div>
                    <div className="card-body p-0">
                      <div className="list-group list-group-flush">
                        <div className="list-group-item d-flex align-items-center px-3 py-3">
                          <span className="avatar avatar-md rounded-circle flex-shrink-0">
                            <img
                              src="assets/img/profiles/avatar-14.jpg"
                              alt="Aria Snow"
                            />
                          </span>
                          <div className="ms-2 overflow-hidden">
                            <h6 className="fs-14 fw-semibold text-truncate mb-0">
                              Aria Snow
                            </h6>
                            <p className="fs-12 text-muted mb-0">
                              Teacher · Science
                            </p>
                          </div>
                          <span className="badge badge-soft-primary ms-auto">
                            2 min
                          </span>
                        </div>
                        <div className="list-group-item d-flex align-items-center px-3 py-3">
                          <span className="avatar avatar-md rounded-circle flex-shrink-0">
                            <img
                              src="assets/img/profiles/avatar-15.jpg"
                              alt="Leo Ford"
                            />
                          </span>
                          <div className="ms-2 overflow-hidden">
                            <h6 className="fs-14 fw-semibold text-truncate mb-0">
                              Leo Ford
                            </h6>
                            <p className="fs-12 text-muted mb-0">Parent</p>
                          </div>
                          <span className="badge badge-soft-primary ms-auto">
                            26 min
                          </span>
                        </div>
                        <div className="list-group-item d-flex align-items-center px-3 py-3">
                          <span className="avatar avatar-md rounded-circle flex-shrink-0">
                            <img
                              src="assets/img/profiles/avatar-16.jpg"
                              alt="Mia Cole"
                            />
                          </span>
                          <div className="ms-2 overflow-hidden">
                            <h6 className="fs-14 fw-semibold text-truncate mb-0">
                              Mia Cole
                            </h6>
                            <p className="fs-12 text-muted mb-0">
                              Accountant · Finance
                            </p>
                          </div>
                          <span className="badge badge-soft-primary ms-auto">
                            1 hr
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Today at a Glance */}
                <div className="col-xl-4 col-md-6 d-flex">
                  <div className="card flex-fill mb-0">
                    <div className="card-header d-flex align-items-center justify-content-between">
                      <h5 className="mb-0 d-flex align-items-center">
                        <i className="ti ti-activity-heartbeat text-primary me-2" />
                        Today at a Glance
                      </h5>
                    </div>
                    <div className="card-body p-0">
                      <div className="list-group list-group-flush">
                        <div className="list-group-item d-flex align-items-center px-3 py-3">
                          <span className="avatar avatar-md rounded bg-success-transparent text-success flex-shrink-0">
                            <i className="ti ti-login-2 fs-18" />
                          </span>
                          <p className="mb-0 ms-2 fw-medium">Today's Logins</p>
                          <h5 className="mb-0 ms-auto text-success">318</h5>
                        </div>
                        <div className="list-group-item d-flex align-items-center px-3 py-3">
                          <span className="avatar avatar-md rounded bg-warning-transparent text-warning flex-shrink-0">
                            <i className="ti ti-mail-forward fs-18" />
                          </span>
                          <p className="mb-0 ms-2 fw-medium">
                            Pending Invitations
                          </p>
                          <h5 className="mb-0 ms-auto">42</h5>
                        </div>
                        <div className="list-group-item d-flex align-items-center px-3 py-3">
                          <span className="avatar avatar-md rounded bg-danger-transparent text-danger flex-shrink-0">
                            <i className="ti ti-lock-exclamation fs-18" />
                          </span>
                          <p className="mb-0 ms-2 fw-medium">
                            Failed Login Attempts
                          </p>
                          <h5 className="mb-0 ms-auto text-danger">27</h5>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* System Alerts */}
                <div className="col-xl-4 col-md-6 d-flex">
                  <div className="card flex-fill mb-0">
                    <div className="card-header d-flex align-items-center justify-content-between">
                      <h5 className="mb-0 d-flex align-items-center">
                        <i className="ti ti-alert-triangle text-primary me-2" />
                        System Alerts
                      </h5>
                      <span className="badge badge-soft-danger">3 New</span>
                    </div>
                    <div className="card-body p-0">
                      <div className="list-group list-group-flush">
                        <div className="list-group-item d-flex align-items-center px-3 py-3">
                          <span className="avatar avatar-md rounded bg-danger-transparent text-danger flex-shrink-0">
                            <i className="ti ti-shield-x fs-18" />
                          </span>
                          <div className="ms-2 overflow-hidden">
                            <h6 className="fs-14 fw-semibold text-truncate mb-0">
                              Multiple failed logins
                            </h6>
                            <p className="fs-12 text-muted mb-0">
                              Olivia Grant · Blocked
                            </p>
                          </div>
                        </div>
                        <div className="list-group-item d-flex align-items-center px-3 py-3">
                          <span className="avatar avatar-md rounded bg-warning-transparent text-warning flex-shrink-0">
                            <i className="ti ti-clock-exclamation fs-18" />
                          </span>
                          <div className="ms-2 overflow-hidden">
                            <h6 className="fs-14 fw-semibold text-truncate mb-0">
                              9 invitations expiring
                            </h6>
                            <p className="fs-12 text-muted mb-0">
                              Within 48 hours
                            </p>
                          </div>
                        </div>
                        <div className="list-group-item d-flex align-items-center px-3 py-3">
                          <span className="avatar avatar-md rounded bg-purple-transparent text-purple flex-shrink-0">
                            <i className="ti ti-user-shield fs-18" />
                          </span>
                          <div className="ms-2 overflow-hidden">
                            <h6 className="fs-14 fw-semibold text-truncate mb-0">
                              Role change requested
                            </h6>
                            <p className="fs-12 text-muted mb-0">
                              James Wilson · Accountant
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            {/* /Insights section */}
          </div>
        </div>
      </div>
      {/* /Page Wrapper */}
      <UsersModal />
    </>
  );
};

export default Users;
