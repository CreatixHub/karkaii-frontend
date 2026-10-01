import { Link } from "react-router-dom";
import { all_routes } from "../../../routes/all_routes";
const DeleteAccount = () => {
  return (
    <>
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content">
          {/* Page Header */}
          <div className="d-md-flex d-block align-items-center justify-content-between flex-wrap gap-2 mb-4">
            <div className="my-auto mb-2">
              <h3 className="page-title mb-1">Delete Account Requests</h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={all_routes.adminDashboard}>Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <a href="#">Administration</a>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Delete Account Requests
                  </li>
                </ol>
              </nav>
            </div>
            <div className="d-flex my-xl-auto right-content align-items-center flex-wrap gap-2">
              <div className="dropdown">
                <a
                  href="#"
                  className="dropdown-toggle btn btn-outline-light bg-white fw-medium d-inline-flex align-items-center"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i className="ti ti-file-export me-1" />
                  Export Requests
                </a>
                <ul className="dropdown-menu dropdown-menu-end p-2">
                  <li>
                    <a
                      href="#"
                      className="dropdown-item rounded-1"
                      data-dar-action="export_pdf"
                    >
                      <i className="ti ti-file-type-pdf me-2" />
                      Export as PDF
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="dropdown-item rounded-1"
                      data-dar-action="export_excel"
                    >
                      <i className="ti ti-file-type-xls me-2" />
                      Export as Excel
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="dropdown-item rounded-1"
                      data-dar-action="export_csv"
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
                      data-dar-action="bulk_approve"
                    >
                      <i className="ti ti-circle-check me-2" />
                      Approve Selected
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="dropdown-item rounded-1"
                      data-dar-action="bulk_reject"
                    >
                      <i className="ti ti-circle-x me-2" />
                      Reject Selected
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="dropdown-item rounded-1"
                      data-dar-action="export_csv"
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
                      Delete Permanently
                    </a>
                  </li>
                </ul>
              </div>
              <a
                href="security-settings.html"
                className="btn btn-outline-light bg-white fw-medium d-inline-flex align-items-center"
              >
                <i className="ti ti-settings me-1" />
                Settings
              </a>
            </div>
          </div>
          {/* /Page Header */}
          {/* Overview cards */}
          <div className="row g-3 mb-4">
            <div className="col-xl-3 col-sm-6 d-flex">
              <div className="stats-card stats-card-directory stats-primary">
                <span className="stats-avatar stats-icon">
                  <i className="ti ti-user-x" />
                </span>
                <div>
                  <h3 className="stats-value mb-0">128</h3>
                  <p className="stats-label">Total Requests</p>
                  <span className="stats-role">+6 this week</span>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-sm-6 d-flex">
              <div className="stats-card stats-card-directory stats-warning">
                <span className="stats-avatar stats-icon">
                  <i className="ti ti-clock-hour-4" />
                </span>
                <div>
                  <h3 className="stats-value mb-0">24</h3>
                  <p className="stats-label">Pending Review</p>
                  <span className="stats-role">Awaiting action</span>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-sm-6 d-flex">
              <div className="stats-card stats-card-directory stats-success">
                <span className="stats-avatar stats-icon">
                  <i className="ti ti-circle-check" />
                </span>
                <div>
                  <h3 className="stats-value mb-0">86</h3>
                  <p className="stats-label">Approved</p>
                  <span className="stats-role">67% of total</span>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-sm-6 d-flex">
              <div className="stats-card stats-card-directory stats-danger">
                <span className="stats-avatar stats-icon">
                  <i className="ti ti-circle-x" />
                </span>
                <div>
                  <h3 className="stats-value mb-0">18</h3>
                  <p className="stats-label">Rejected</p>
                  <span className="stats-role">Policy declined</span>
                </div>
              </div>
            </div>
          </div>
          {/* /Overview cards */}
          {/* Requests workspace */}
          <div className="card mb-4">
            <div
              className="data-workspace dar"
              id="delReqWorkspace"
              data-density="default"
            >
              {/* ===================== TOOLBAR ===================== */}
              <div className="card-header border-bottom">
                <div className="card-toolbar">
                  <div className="card-search">
                    <i className="ti ti-search card-search-ic" />
                    <input
                      type="text"
                      id="darSearch"
                      placeholder="Search ID, user, reason…"
                      aria-label="Search requests"
                    />
                    <span className="card-search-kbd" id="darSearchKbd">
                      ⌘K
                    </span>
                    <button
                      type="button"
                      className="card-search-x"
                      id="darSearchClear"
                      data-dar-action="clear_search"
                      aria-label="Clear search"
                      hidden
                    >
                      <i className="ti ti-x" />
                    </button>
                  </div>
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
                          data-dar-view="all"
                        >
                          <i className="ti ti-layout-list" />
                          All Requests
                          <span className="card-vcount" />
                        </a>
                      </li>
                      <li>
                        <a
                          className="dropdown-item"
                          href="#"
                          data-dar-view="Pending"
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
                          data-dar-view="Approved"
                        >
                          <i className="ti ti-circle-check" />
                          Approved
                          <span className="card-vcount" />
                        </a>
                      </li>
                      <li>
                        <a
                          className="dropdown-item"
                          href="#"
                          data-dar-view="Rejected"
                        >
                          <i className="ti ti-circle-x" />
                          Rejected
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
                          data-dar-action="save_view"
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
                      <span className="card-count" id="darFilterCount" hidden>
                        0
                      </span>
                    </button>
                    <div className="dropdown-menu p-3 card-filter-menu">
                      <div className="row g-3">
                        <div className="col-6">
                          <label
                            className="form-label mb-1"
                            htmlFor="user-type"
                          >
                            User Type
                          </label>
                          <select
                            className="form-select"
                            data-filter="Type"
                            id="user-type"
                          >
                            <option value="">All</option>
                            <option>Student</option>
                            <option>Teacher</option>
                            <option>Parent</option>
                            <option>Employee</option>
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
                            <option>Pending</option>
                            <option>Under Review</option>
                            <option>Approved</option>
                            <option>Rejected</option>
                            <option>Completed</option>
                            <option>Cancelled</option>
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
                            <option>Science</option>
                            <option>Transport</option>
                            <option>Library</option>
                            <option>Front Office</option>
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
                            <option>West Branch</option>
                          </select>
                        </div>
                        <div className="col-6">
                          <label
                            className="form-label mb-1"
                            htmlFor="request-date"
                          >
                            Request Date
                          </label>
                          <select
                            className="form-select"
                            data-filter="Date"
                            id="request-date"
                          >
                            <option value="">Any Time</option>
                            <option>2024</option>
                            <option>2023</option>
                          </select>
                        </div>
                        <div className="col-6">
                          <label
                            className="form-label mb-1"
                            htmlFor="approval-status"
                          >
                            Approval Status
                          </label>
                          <select
                            className="form-select"
                            data-filter="Approval"
                            id="approval-status"
                          >
                            <option value="">All</option>
                            <option>Manager</option>
                            <option>Administrator</option>
                            <option>Unassigned</option>
                          </select>
                        </div>
                      </div>
                      <div className="d-flex align-items-center justify-content-between gap-2 mt-3 pt-3 border-top">
                        <span className="fs-12 text-muted">
                          <b id="darFilterHits">8</b> of 8 requests match
                        </span>
                        <div className="d-flex gap-2">
                          <button
                            type="button"
                            className="btn btn-light btn-sm"
                            data-dar-action="clear_filters"
                          >
                            Reset
                          </button>
                          <button
                            type="button"
                            className="btn btn-primary btn-sm"
                            data-dar-action="apply_filters"
                          >
                            Search
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
                            data-dar-col="reqid"
                            defaultChecked
                          />
                          Request ID
                        </label>
                      </li>
                      <li>
                        <label className="dropdown-item">
                          <input
                            className="form-check-input me-2 mt-0"
                            type="checkbox"
                            data-dar-col="user"
                            defaultChecked
                          />
                          User
                        </label>
                      </li>
                      <li>
                        <label className="dropdown-item">
                          <input
                            className="form-check-input me-2 mt-0"
                            type="checkbox"
                            data-dar-col="usertype"
                            defaultChecked
                          />
                          User Type
                        </label>
                      </li>
                      <li>
                        <label className="dropdown-item">
                          <input
                            className="form-check-input me-2 mt-0"
                            type="checkbox"
                            data-dar-col="department"
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
                            data-dar-col="reason"
                            defaultChecked
                          />
                          Reason
                        </label>
                      </li>
                      <li>
                        <label className="dropdown-item">
                          <input
                            className="form-check-input me-2 mt-0"
                            type="checkbox"
                            data-dar-col="requested"
                            defaultChecked
                          />
                          Requested On
                        </label>
                      </li>
                      <li>
                        <label className="dropdown-item">
                          <input
                            className="form-check-input me-2 mt-0"
                            type="checkbox"
                            data-dar-col="reviewer"
                            defaultChecked
                          />
                          Reviewer
                        </label>
                      </li>
                      <li>
                        <label className="dropdown-item">
                          <input
                            className="form-check-input me-2 mt-0"
                            type="checkbox"
                            data-dar-col="deletion"
                            defaultChecked
                          />
                          Deletion Date
                        </label>
                      </li>
                      <li>
                        <hr className="dropdown-divider" />
                      </li>
                      <li>
                        <button
                          type="button"
                          className="dropdown-item text-primary"
                          data-dar-action="reset_columns"
                        >
                          <i className="ti ti-rotate" />
                          Show all columns
                        </button>
                      </li>
                    </ul>
                  </div>
                  <span className="flex-grow-1" />
                  <div
                    className="card-density"
                    role="group"
                    aria-label="Row density"
                  >
                    <button
                      type="button"
                      data-dar-density="compact"
                      data-bs-toggle="tooltip"
                      title="Compact"
                      aria-label="Compact rows"
                    >
                      <i className="ti ti-baseline-density-small" />
                    </button>
                    <button
                      type="button"
                      className="active"
                      data-dar-density="default"
                      data-bs-toggle="tooltip"
                      title="Default"
                      aria-label="Default rows"
                    >
                      <i className="ti ti-baseline-density-medium" />
                    </button>
                    <button
                      type="button"
                      data-dar-density="comfortable"
                      data-bs-toggle="tooltip"
                      title="Comfortable"
                      aria-label="Comfortable rows"
                    >
                      <i className="ti ti-baseline-density-large" />
                    </button>
                  </div>
                  <button
                    type="button"
                    className="card-btn card-btn-icon"
                    data-dar-action="refresh"
                    data-bs-toggle="tooltip"
                    title="Refresh"
                    aria-label="Refresh"
                  >
                    <i className="ti ti-refresh" />
                  </button>
                  <button
                    type="button"
                    className="card-btn card-btn-icon"
                    data-dar-action="export_csv"
                    data-bs-toggle="tooltip"
                    title="Export CSV"
                    aria-label="Export CSV"
                  >
                    <i className="ti ti-file-type-csv" />
                  </button>
                  <button
                    type="button"
                    className="card-btn card-btn-icon"
                    data-dar-action="export_excel"
                    data-bs-toggle="tooltip"
                    title="Export Excel"
                    aria-label="Export Excel"
                  >
                    <i className="ti ti-file-type-xls" />
                  </button>
                  <button
                    type="button"
                    className="card-btn card-btn-icon"
                    data-dar-action="print"
                    data-bs-toggle="tooltip"
                    title="Print"
                    aria-label="Print"
                  >
                    <i className="ti ti-printer" />
                  </button>
                  <button
                    type="button"
                    className="card-btn card-btn-icon"
                    data-dar-action="fullscreen"
                    data-bs-toggle="tooltip"
                    title="Fullscreen"
                    aria-label="Toggle fullscreen"
                    aria-pressed="false"
                  >
                    <i className="ti ti-arrows-maximize" />
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
                    data-dar-view="all"
                  >
                    <i className="ti ti-list" />
                    All Requests <span className="card-quick-count">8</span>
                  </button>
                  <button
                    type="button"
                    className="card-quick"
                    data-dar-view="Pending"
                  >
                    <i className="ti ti-clock" />
                    Pending <span className="card-quick-count">0</span>
                  </button>
                  <button
                    type="button"
                    className="card-quick"
                    data-dar-view="Approved"
                  >
                    <i className="ti ti-circle-check" />
                    Approved <span className="card-quick-count">0</span>
                  </button>
                  <button
                    type="button"
                    className="card-quick"
                    data-dar-view="Rejected"
                  >
                    <i className="ti ti-circle-x" />
                    Rejected <span className="card-quick-count">0</span>
                  </button>
                  <button
                    type="button"
                    className="card-quick"
                    data-dar-view="Student"
                  >
                    <i className="ti ti-school" />
                    Students <span className="card-quick-count">0</span>
                  </button>
                  <button
                    type="button"
                    className="card-quick"
                    data-dar-view="Teacher"
                  >
                    <i className="ti ti-user" />
                    Teachers <span className="card-quick-count">0</span>
                  </button>
                  <button
                    type="button"
                    className="card-quick"
                    data-dar-view="Parent"
                  >
                    <i className="ti ti-users-group" />
                    Parents <span className="card-quick-count">0</span>
                  </button>
                  <button
                    type="button"
                    className="card-quick"
                    data-dar-view="Employee"
                  >
                    <i className="ti ti-briefcase" />
                    Employees <span className="card-quick-count">0</span>
                  </button>
                  <button
                    type="button"
                    className="card-quick"
                    data-dar-view="recent"
                  >
                    <i className="ti ti-history" />
                    Recent <span className="card-quick-count">0</span>
                  </button>
                  <button
                    type="button"
                    className="card-quick"
                    data-dar-view="high"
                  >
                    <i className="ti ti-flag" />
                    High Priority <span className="card-quick-count">0</span>
                  </button>
                  <button
                    type="button"
                    className="btn btn-link btn-sm text-primary card-clear-quick"
                    id="darClearQuick"
                    data-dar-action="clear_filters"
                    hidden
                  >
                    Clear all
                  </button>
                </div>
                <div className="card-chips" aria-live="polite" />
              </div>
              {/* Bulk action bar */}
              <div
                className="bulk-selection"
                id="darBulk"
                role="region"
                aria-label="Bulk actions"
                hidden
              >
                <div className="bulk-selection-inner">
                  <span className="bulk-selection-count">
                    <b id="darCount">0</b> selected
                  </span>
                  <div className="d-flex flex-wrap gap-2">
                    <button
                      type="button"
                      className="btn btn-sm"
                      data-dar-action="bulk_approve"
                    >
                      <i className="ti ti-circle-check me-1" />
                      Bulk Approve
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm"
                      data-dar-action="bulk_reject"
                    >
                      <i className="ti ti-circle-x me-1" />
                      Bulk Reject
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm"
                      data-dar-action="more_info"
                    >
                      <i className="ti ti-info-circle me-1" />
                      Request Info
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm"
                      data-dar-action="export_csv"
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
                      Delete
                    </button>
                  </div>
                  <button
                    type="button"
                    className="bulk-selection-close"
                    data-dar-action="clear_sel"
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
                    Delete account requests with user, type, reason, status,
                    reviewer and expected deletion date
                  </caption>
                  <thead>
                    <tr>
                      <th className="dt-pin">
                        <input
                          type="checkbox"
                          className="dt-check"
                          id="darAll"
                          aria-label="Select all requests"
                        />
                      </th>
                      <th data-dar-col="reqid">Request ID</th>
                      <th
                        className="dt-sortable"
                        data-dar-col="user"
                        data-dar-sort="name"
                      >
                        User <i className="ti ti-arrows-sort dt-sort-ic" />
                        <span className="dt-resize" />
                      </th>
                      <th
                        className="dt-sortable"
                        data-dar-col="usertype"
                        data-dar-sort="usertype"
                      >
                        User Type <i className="ti ti-arrows-sort dt-sort-ic" />
                      </th>
                      <th data-dar-col="department">Department</th>
                      <th data-dar-col="reason">Reason</th>
                      <th
                        className="dt-sortable"
                        data-dar-col="requested"
                        data-dar-sort="requested"
                      >
                        Requested On{" "}
                        <i className="ti ti-arrows-sort dt-sort-ic" />
                      </th>
                      <th data-dar-col="status">Status</th>
                      <th data-dar-col="reviewer">Reviewer</th>
                      <th data-dar-col="deletion">Expected Deletion</th>
                      <th className="text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody id="darBody">
                    <tr
                      className="dt-row"
                      data-dar-status="Approved"
                      data-search="dr-1001 janet doe u461893 janet.d@preskool.com student class iii graduated approved recent"
                    >
                      <td className="dt-pin">
                        <input
                          type="checkbox"
                          className="dt-check record-row-check-dar"
                          aria-label="Select Janet Doe"
                        />
                      </td>
                      <td data-dar-col="reqid">
                        <a
                          href="#"
                          className="link-primary fw-semibold"
                        >
                          DR-1001
                        </a>
                      </td>
                      <td data-dar-col="user">
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
                              <span>U461893</span>
                              <span className="dt-dot">•</span>
                              <span>janet.d@preskool.com</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td data-dar-col="usertype">
                        <span className="badge badge-soft-primary">
                          Student
                        </span>
                      </td>
                      <td data-dar-col="department">Class III</td>
                      <td data-dar-col="reason">
                        <span className="closure-reason">
                          <span
                            className="closure-reason-text"
                            data-bs-toggle="tooltip"
                            title="Student has graduated and completed all enrolled courses."
                          >
                            Graduated
                          </span>
                        </span>
                      </td>
                      <td data-dar-col="requested">25 Mar 2024</td>
                      <td data-dar-col="status">
                        <span className="dt-pill is-active">
                          <span className="dt-pill-dot" />
                          Approved
                        </span>
                      </td>
                      <td data-dar-col="reviewer">
                        <div className="d-flex align-items-center">
                          <span className="avatar avatar-sm rounded-circle flex-shrink-0 me-2">
                            <img
                              src="assets/img/profiles/avatar-02.jpg"
                              alt="Sarah Mitchell"
                            />
                          </span>
                          <span className="fs-13">Sarah Mitchell</span>
                        </div>
                      </td>
                      <td data-dar-col="deletion">10 Apr 2024</td>
                      <td>
                        <div className="dt-actions">
                          <a
                            href="#"
                            className="dt-ib success"
                            title="Approve"
                            aria-label="Approve Janet Doe"
                            data-dar-action="approve"
                          >
                            <i className="ti ti-circle-check" />
                          </a>
                          <a
                            href="#"
                            className="dt-ib danger"
                            title="Reject"
                            aria-label="Reject Janet Doe"
                            data-dar-action="reject"
                          >
                            <i className="ti ti-circle-x" />
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
                                href="#"
                                data-dar-action="review"
                              >
                                <i className="ti ti-eye" />
                                View Request
                              </a>
                              <a
                                className="dropdown-item"
                                href="#"
                                data-dar-action="review"
                              >
                                <i className="ti ti-file-search" />
                                Review Details
                              </a>
                              <a
                                className="dropdown-item text-success"
                                href="#"
                                data-dar-action="approve"
                              >
                                <i className="ti ti-circle-check" />
                                Approve
                              </a>
                              <a
                                className="dropdown-item text-warning"
                                href="#"
                                data-dar-action="reject"
                              >
                                <i className="ti ti-circle-x" />
                                Reject
                              </a>
                              <a
                                className="dropdown-item"
                                href="#"
                                data-dar-action="more_info"
                              >
                                <i className="ti ti-info-circle" />
                                Request More Information
                              </a>
                              <a className="dropdown-item" href="profile.html">
                                <i className="ti ti-user-circle" />
                                View User Profile
                              </a>
                              <a
                                className="dropdown-item"
                                href="#"
                                data-dar-action="download"
                              >
                                <i className="ti ti-download" />
                                Download Report
                              </a>
                              <hr className="dropdown-divider" />
                              <a
                                className="dropdown-item text-danger"
                                href="#"
                                data-bs-toggle="modal"
                                data-bs-target="#delete-modal"
                              >
                                <i className="ti ti-trash-x" />
                                Delete Permanently
                              </a>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                    <tr
                      className="dt-row"
                      data-dar-status="Pending"
                      data-search="dr-1002 joann smith u461892 joann.s@preskool.com student class iv duplicate account pending recent high priority"
                    >
                      <td className="dt-pin">
                        <input
                          type="checkbox"
                          className="dt-check record-row-check-dar"
                          aria-label="Select Joann Smith"
                        />
                      </td>
                      <td data-dar-col="reqid">
                        <a
                          href="#"
                          className="link-primary fw-semibold"
                        >
                          DR-1002
                        </a>
                      </td>
                      <td data-dar-col="user">
                        <div className="dt-user">
                          <a href="profile.html" className="dt-avatar">
                            <img
                              src="assets/img/students/student-02.jpg"
                              alt="Joann Smith"
                            />
                            <span className="dt-presence" title="Offline" />
                          </a>
                          <div>
                            <a href="profile.html" className="dt-name">
                              Joann Smith
                            </a>
                            <div className="dt-sub">
                              <span>U461892</span>
                              <span className="dt-dot">•</span>
                              <span>joann.s@preskool.com</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td data-dar-col="usertype">
                        <span className="badge badge-soft-primary">
                          Student
                        </span>
                      </td>
                      <td data-dar-col="department">Class IV</td>
                      <td data-dar-col="reason">
                        <span className="closure-reason">
                          <span
                            className="closure-reason-text"
                            data-bs-toggle="tooltip"
                            title="Duplicate student profile created during a bulk import."
                          >
                            Duplicate Account
                          </span>
                        </span>
                      </td>
                      <td data-dar-col="requested">18 Mar 2024</td>
                      <td data-dar-col="status">
                        <span className="dt-pill is-pending">
                          <span className="dt-pill-dot" />
                          Pending
                        </span>
                      </td>
                      <td data-dar-col="reviewer">
                        <span className="badge badge-soft-secondary">
                          Unassigned
                        </span>
                      </td>
                      <td data-dar-col="deletion">
                        <span className="text-muted">—</span>
                      </td>
                      <td>
                        <div className="dt-actions">
                          <a
                            href="#"
                            className="dt-ib success"
                            title="Approve"
                            aria-label="Approve Joann Smith"
                            data-dar-action="approve"
                          >
                            <i className="ti ti-circle-check" />
                          </a>
                          <a
                            href="#"
                            className="dt-ib danger"
                            title="Reject"
                            aria-label="Reject Joann Smith"
                            data-dar-action="reject"
                          >
                            <i className="ti ti-circle-x" />
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
                                href="#"
                                data-dar-action="review"
                              >
                                <i className="ti ti-eye" />
                                View Request
                              </a>
                              <a
                                className="dropdown-item"
                                href="#"
                                data-dar-action="review"
                              >
                                <i className="ti ti-file-search" />
                                Review Details
                              </a>
                              <a
                                className="dropdown-item text-success"
                                href="#"
                                data-dar-action="approve"
                              >
                                <i className="ti ti-circle-check" />
                                Approve
                              </a>
                              <a
                                className="dropdown-item text-warning"
                                href="#"
                                data-dar-action="reject"
                              >
                                <i className="ti ti-circle-x" />
                                Reject
                              </a>
                              <a
                                className="dropdown-item"
                                href="#"
                                data-dar-action="more_info"
                              >
                                <i className="ti ti-info-circle" />
                                Request More Information
                              </a>
                              <a className="dropdown-item" href="profile.html">
                                <i className="ti ti-user-circle" />
                                View User Profile
                              </a>
                              <a
                                className="dropdown-item"
                                href="#"
                                data-dar-action="download"
                              >
                                <i className="ti ti-download" />
                                Download Report
                              </a>
                              <hr className="dropdown-divider" />
                              <a
                                className="dropdown-item text-danger"
                                href="#"
                                data-bs-toggle="modal"
                                data-bs-target="#delete-modal"
                              >
                                <i className="ti ti-trash-x" />
                                Delete Permanently
                              </a>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                    <tr
                      className="dt-row"
                      data-dar-status="Under Review"
                      data-search="dr-1003 marcus lee u461887 marcus.l@preskool.com employee transport employee left under review recent"
                    >
                      <td className="dt-pin">
                        <input
                          type="checkbox"
                          className="dt-check record-row-check-dar"
                          aria-label="Select Marcus Lee"
                        />
                      </td>
                      <td data-dar-col="reqid">
                        <a
                          href="#"
                          className="link-primary fw-semibold"
                        >
                          DR-1003
                        </a>
                      </td>
                      <td data-dar-col="user">
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
                              <span>U461887</span>
                              <span className="dt-dot">•</span>
                              <span>marcus.l@preskool.com</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td data-dar-col="usertype">
                        <span className="badge badge-soft-primary">
                          Employee
                        </span>
                      </td>
                      <td data-dar-col="department">Transport</td>
                      <td data-dar-col="reason">
                        <span className="closure-reason">
                          <span
                            className="closure-reason-text"
                            data-bs-toggle="tooltip"
                            title="Staff member resigned; offboarding currently in progress."
                          >
                            Employee Left
                          </span>
                        </span>
                      </td>
                      <td data-dar-col="requested">14 Mar 2024</td>
                      <td data-dar-col="status">
                        <span className="dt-pill is-review">
                          <span className="dt-pill-dot" />
                          Under Review
                        </span>
                      </td>
                      <td data-dar-col="reviewer">
                        <div className="d-flex align-items-center">
                          <span className="avatar avatar-sm rounded-circle flex-shrink-0 me-2">
                            <img
                              src="assets/img/profiles/avatar-03.jpg"
                              alt="James Wilson"
                            />
                          </span>
                          <span className="fs-13">James Wilson</span>
                        </div>
                      </td>
                      <td data-dar-col="deletion">28 Mar 2024</td>
                      <td>
                        <div className="dt-actions">
                          <a
                            href="#"
                            className="dt-ib success"
                            title="Approve"
                            aria-label="Approve Marcus Lee"
                            data-dar-action="approve"
                          >
                            <i className="ti ti-circle-check" />
                          </a>
                          <a
                            href="#"
                            className="dt-ib danger"
                            title="Reject"
                            aria-label="Reject Marcus Lee"
                            data-dar-action="reject"
                          >
                            <i className="ti ti-circle-x" />
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
                                href="#"
                                data-dar-action="review"
                              >
                                <i className="ti ti-eye" />
                                View Request
                              </a>
                              <a
                                className="dropdown-item"
                                href="#"
                                data-dar-action="review"
                              >
                                <i className="ti ti-file-search" />
                                Review Details
                              </a>
                              <a
                                className="dropdown-item text-success"
                                href="#"
                                data-dar-action="approve"
                              >
                                <i className="ti ti-circle-check" />
                                Approve
                              </a>
                              <a
                                className="dropdown-item text-warning"
                                href="#"
                                data-dar-action="reject"
                              >
                                <i className="ti ti-circle-x" />
                                Reject
                              </a>
                              <a
                                className="dropdown-item"
                                href="#"
                                data-dar-action="more_info"
                              >
                                <i className="ti ti-info-circle" />
                                Request More Information
                              </a>
                              <a className="dropdown-item" href="profile.html">
                                <i className="ti ti-user-circle" />
                                View User Profile
                              </a>
                              <a
                                className="dropdown-item"
                                href="#"
                                data-dar-action="download"
                              >
                                <i className="ti ti-download" />
                                Download Report
                              </a>
                              <hr className="dropdown-divider" />
                              <a
                                className="dropdown-item text-danger"
                                href="#"
                                data-bs-toggle="modal"
                                data-bs-target="#delete-modal"
                              >
                                <i className="ti ti-trash-x" />
                                Delete Permanently
                              </a>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                    <tr
                      className="dt-row"
                      data-dar-status="Rejected"
                      data-search="dr-1004 robert fox u461889 robert.fox@example.com parent — privacy concern rejected high priority"
                    >
                      <td className="dt-pin">
                        <input
                          type="checkbox"
                          className="dt-check record-row-check-dar"
                          aria-label="Select Robert Fox"
                        />
                      </td>
                      <td data-dar-col="reqid">
                        <a
                          href="#"
                          className="link-primary fw-semibold"
                        >
                          DR-1004
                        </a>
                      </td>
                      <td data-dar-col="user">
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
                              <span>U461889</span>
                              <span className="dt-dot">•</span>
                              <span>robert.fox@example.com</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td data-dar-col="usertype">
                        <span className="badge badge-soft-primary">Parent</span>
                      </td>
                      <td data-dar-col="department">—</td>
                      <td data-dar-col="reason">
                        <span className="closure-reason">
                          <span
                            className="closure-reason-text"
                            data-bs-toggle="tooltip"
                            title="Parent requested account closure citing personal privacy concerns."
                          >
                            Privacy Concern
                          </span>
                        </span>
                      </td>
                      <td data-dar-col="requested">27 Feb 2024</td>
                      <td data-dar-col="status">
                        <span className="dt-pill is-blocked">
                          <span className="dt-pill-dot" />
                          Rejected
                        </span>
                      </td>
                      <td data-dar-col="reviewer">
                        <div className="d-flex align-items-center">
                          <span className="avatar avatar-sm rounded-circle flex-shrink-0 me-2">
                            <img
                              src="assets/img/profiles/avatar-27.jpg"
                              alt="Kevin Larry"
                            />
                          </span>
                          <span className="fs-13">Kevin Larry</span>
                        </div>
                      </td>
                      <td data-dar-col="deletion">
                        <span className="text-muted">—</span>
                      </td>
                      <td>
                        <div className="dt-actions">
                          <a
                            href="#"
                            className="dt-ib success"
                            title="Approve"
                            aria-label="Approve Robert Fox"
                            data-dar-action="approve"
                          >
                            <i className="ti ti-circle-check" />
                          </a>
                          <a
                            href="#"
                            className="dt-ib danger"
                            title="Reject"
                            aria-label="Reject Robert Fox"
                            data-dar-action="reject"
                          >
                            <i className="ti ti-circle-x" />
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
                                href="#"
                                data-dar-action="review"
                              >
                                <i className="ti ti-eye" />
                                View Request
                              </a>
                              <a
                                className="dropdown-item"
                                href="#"
                                data-dar-action="review"
                              >
                                <i className="ti ti-file-search" />
                                Review Details
                              </a>
                              <a
                                className="dropdown-item text-success"
                                href="#"
                                data-dar-action="approve"
                              >
                                <i className="ti ti-circle-check" />
                                Approve
                              </a>
                              <a
                                className="dropdown-item text-warning"
                                href="#"
                                data-dar-action="reject"
                              >
                                <i className="ti ti-circle-x" />
                                Reject
                              </a>
                              <a
                                className="dropdown-item"
                                href="#"
                                data-dar-action="more_info"
                              >
                                <i className="ti ti-info-circle" />
                                Request More Information
                              </a>
                              <a className="dropdown-item" href="profile.html">
                                <i className="ti ti-user-circle" />
                                View User Profile
                              </a>
                              <a
                                className="dropdown-item"
                                href="#"
                                data-dar-action="download"
                              >
                                <i className="ti ti-download" />
                                Download Report
                              </a>
                              <hr className="dropdown-divider" />
                              <a
                                className="dropdown-item text-danger"
                                href="#"
                                data-bs-toggle="modal"
                                data-bs-target="#delete-modal"
                              >
                                <i className="ti ti-trash-x" />
                                Delete Permanently
                              </a>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                    <tr
                      className="dt-row"
                      data-dar-status="Completed"
                      data-search="dr-1005 emily clarke u461884 emily.c@preskool.com employee library no longer required completed "
                    >
                      <td className="dt-pin">
                        <input
                          type="checkbox"
                          className="dt-check record-row-check-dar"
                          aria-label="Select Emily Clarke"
                        />
                      </td>
                      <td data-dar-col="reqid">
                        <a
                          href="#"
                          className="link-primary fw-semibold"
                        >
                          DR-1005
                        </a>
                      </td>
                      <td data-dar-col="user">
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
                              <span>U461884</span>
                              <span className="dt-dot">•</span>
                              <span>emily.c@preskool.com</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td data-dar-col="usertype">
                        <span className="badge badge-soft-primary">
                          Employee
                        </span>
                      </td>
                      <td data-dar-col="department">Library</td>
                      <td data-dar-col="reason">
                        <span className="closure-reason">
                          <span
                            className="closure-reason-text"
                            data-bs-toggle="tooltip"
                            title="Temporary library assistant contract has ended."
                          >
                            No Longer Required
                          </span>
                        </span>
                      </td>
                      <td data-dar-col="requested">13 Feb 2024</td>
                      <td data-dar-col="status">
                        <span className="dt-pill is-completed">
                          <span className="dt-pill-dot" />
                          Completed
                        </span>
                      </td>
                      <td data-dar-col="reviewer">
                        <div className="d-flex align-items-center">
                          <span className="avatar avatar-sm rounded-circle flex-shrink-0 me-2">
                            <img
                              src="assets/img/profiles/avatar-27.jpg"
                              alt="Kevin Larry"
                            />
                          </span>
                          <span className="fs-13">Kevin Larry</span>
                        </div>
                      </td>
                      <td data-dar-col="deletion">20 Feb 2024</td>
                      <td>
                        <div className="dt-actions">
                          <a
                            href="#"
                            className="dt-ib success"
                            title="Approve"
                            aria-label="Approve Emily Clarke"
                            data-dar-action="approve"
                          >
                            <i className="ti ti-circle-check" />
                          </a>
                          <a
                            href="#"
                            className="dt-ib danger"
                            title="Reject"
                            aria-label="Reject Emily Clarke"
                            data-dar-action="reject"
                          >
                            <i className="ti ti-circle-x" />
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
                                href="#"
                                data-dar-action="review"
                              >
                                <i className="ti ti-eye" />
                                View Request
                              </a>
                              <a
                                className="dropdown-item"
                                href="#"
                                data-dar-action="review"
                              >
                                <i className="ti ti-file-search" />
                                Review Details
                              </a>
                              <a
                                className="dropdown-item text-success"
                                href="#"
                                data-dar-action="approve"
                              >
                                <i className="ti ti-circle-check" />
                                Approve
                              </a>
                              <a
                                className="dropdown-item text-warning"
                                href="#"
                                data-dar-action="reject"
                              >
                                <i className="ti ti-circle-x" />
                                Reject
                              </a>
                              <a
                                className="dropdown-item"
                                href="#"
                                data-dar-action="more_info"
                              >
                                <i className="ti ti-info-circle" />
                                Request More Information
                              </a>
                              <a className="dropdown-item" href="profile.html">
                                <i className="ti ti-user-circle" />
                                View User Profile
                              </a>
                              <a
                                className="dropdown-item"
                                href="#"
                                data-dar-action="download"
                              >
                                <i className="ti ti-download" />
                                Download Report
                              </a>
                              <hr className="dropdown-divider" />
                              <a
                                className="dropdown-item text-danger"
                                href="#"
                                data-bs-toggle="modal"
                                data-bs-target="#delete-modal"
                              >
                                <i className="ti ti-trash-x" />
                                Delete Permanently
                              </a>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                    <tr
                      className="dt-row"
                      data-dar-status="Under Review"
                      data-search="dr-1006 olivia grant u461886 olivia.g@preskool.com employee front office privacy concern under review high priority"
                    >
                      <td className="dt-pin">
                        <input
                          type="checkbox"
                          className="dt-check record-row-check-dar"
                          aria-label="Select Olivia Grant"
                        />
                      </td>
                      <td data-dar-col="reqid">
                        <a
                          href="#"
                          className="link-primary fw-semibold"
                        >
                          DR-1006
                        </a>
                      </td>
                      <td data-dar-col="user">
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
                              <span>U461886</span>
                              <span className="dt-dot">•</span>
                              <span>olivia.g@preskool.com</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td data-dar-col="usertype">
                        <span className="badge badge-soft-primary">
                          Employee
                        </span>
                      </td>
                      <td data-dar-col="department">Front Office</td>
                      <td data-dar-col="reason">
                        <span className="closure-reason">
                          <span
                            className="closure-reason-text"
                            data-bs-toggle="tooltip"
                            title="Formal data-protection erasure request submitted under GDPR Article 17 for all stored personal records."
                          >
                            Privacy Concern
                          </span>
                        </span>
                      </td>
                      <td data-dar-col="requested">11 Feb 2024</td>
                      <td data-dar-col="status">
                        <span className="dt-pill is-review">
                          <span className="dt-pill-dot" />
                          Under Review
                        </span>
                      </td>
                      <td data-dar-col="reviewer">
                        <div className="d-flex align-items-center">
                          <span className="avatar avatar-sm rounded-circle flex-shrink-0 me-2">
                            <img
                              src="assets/img/profiles/avatar-02.jpg"
                              alt="Sarah Mitchell"
                            />
                          </span>
                          <span className="fs-13">Sarah Mitchell</span>
                        </div>
                      </td>
                      <td data-dar-col="deletion">25 Feb 2024</td>
                      <td>
                        <div className="dt-actions">
                          <a
                            href="#"
                            className="dt-ib success"
                            title="Approve"
                            aria-label="Approve Olivia Grant"
                            data-dar-action="approve"
                          >
                            <i className="ti ti-circle-check" />
                          </a>
                          <a
                            href="#"
                            className="dt-ib danger"
                            title="Reject"
                            aria-label="Reject Olivia Grant"
                            data-dar-action="reject"
                          >
                            <i className="ti ti-circle-x" />
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
                                href="#"
                                data-dar-action="review"
                              >
                                <i className="ti ti-eye" />
                                View Request
                              </a>
                              <a
                                className="dropdown-item"
                                href="#"
                                data-dar-action="review"
                              >
                                <i className="ti ti-file-search" />
                                Review Details
                              </a>
                              <a
                                className="dropdown-item text-success"
                                href="#"
                                data-dar-action="approve"
                              >
                                <i className="ti ti-circle-check" />
                                Approve
                              </a>
                              <a
                                className="dropdown-item text-warning"
                                href="#"
                                data-dar-action="reject"
                              >
                                <i className="ti ti-circle-x" />
                                Reject
                              </a>
                              <a
                                className="dropdown-item"
                                href="#"
                                data-dar-action="more_info"
                              >
                                <i className="ti ti-info-circle" />
                                Request More Information
                              </a>
                              <a className="dropdown-item" href="profile.html">
                                <i className="ti ti-user-circle" />
                                View User Profile
                              </a>
                              <a
                                className="dropdown-item"
                                href="#"
                                data-dar-action="download"
                              >
                                <i className="ti ti-download" />
                                Download Report
                              </a>
                              <hr className="dropdown-divider" />
                              <a
                                className="dropdown-item text-danger"
                                href="#"
                                data-bs-toggle="modal"
                                data-bs-target="#delete-modal"
                              >
                                <i className="ti ti-trash-x" />
                                Delete Permanently
                              </a>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                    <tr
                      className="dt-row"
                      data-dar-status="Cancelled"
                      data-search="dr-1007 ryan cooper u461885 ryan.c@preskool.com teacher science other cancelled "
                    >
                      <td className="dt-pin">
                        <input
                          type="checkbox"
                          className="dt-check record-row-check-dar"
                          aria-label="Select Ryan Cooper"
                        />
                      </td>
                      <td data-dar-col="reqid">
                        <a
                          href="#"
                          className="link-primary fw-semibold"
                        >
                          DR-1007
                        </a>
                      </td>
                      <td data-dar-col="user">
                        <div className="dt-user">
                          <a href="profile.html" className="dt-avatar">
                            <img
                              src="assets/img/profiles/avatar-09.jpg"
                              alt="Ryan Cooper"
                            />
                            <span className="dt-presence on" title="Online" />
                          </a>
                          <div>
                            <a href="profile.html" className="dt-name">
                              Ryan Cooper
                            </a>
                            <div className="dt-sub">
                              <span>U461885</span>
                              <span className="dt-dot">•</span>
                              <span>ryan.c@preskool.com</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td data-dar-col="usertype">
                        <span className="badge badge-soft-primary">
                          Teacher
                        </span>
                      </td>
                      <td data-dar-col="department">Science</td>
                      <td data-dar-col="reason">
                        <span className="closure-reason">
                          <span
                            className="closure-reason-text"
                            data-bs-toggle="tooltip"
                            title="Requested removal of a legacy test account."
                          >
                            Other
                          </span>
                        </span>
                      </td>
                      <td data-dar-col="requested">24 Jan 2024</td>
                      <td data-dar-col="status">
                        <span className="dt-pill is-inactive">
                          <span className="dt-pill-dot" />
                          Cancelled
                        </span>
                      </td>
                      <td data-dar-col="reviewer">
                        <span className="badge badge-soft-secondary">
                          Unassigned
                        </span>
                      </td>
                      <td data-dar-col="deletion">
                        <span className="text-muted">—</span>
                      </td>
                      <td>
                        <div className="dt-actions">
                          <a
                            href="#"
                            className="dt-ib success"
                            title="Approve"
                            aria-label="Approve Ryan Cooper"
                            data-dar-action="approve"
                          >
                            <i className="ti ti-circle-check" />
                          </a>
                          <a
                            href="#"
                            className="dt-ib danger"
                            title="Reject"
                            aria-label="Reject Ryan Cooper"
                            data-dar-action="reject"
                          >
                            <i className="ti ti-circle-x" />
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
                                href="#"
                                data-dar-action="review"
                              >
                                <i className="ti ti-eye" />
                                View Request
                              </a>
                              <a
                                className="dropdown-item"
                                href="#"
                                data-dar-action="review"
                              >
                                <i className="ti ti-file-search" />
                                Review Details
                              </a>
                              <a
                                className="dropdown-item text-success"
                                href="#"
                                data-dar-action="approve"
                              >
                                <i className="ti ti-circle-check" />
                                Approve
                              </a>
                              <a
                                className="dropdown-item text-warning"
                                href="#"
                                data-dar-action="reject"
                              >
                                <i className="ti ti-circle-x" />
                                Reject
                              </a>
                              <a
                                className="dropdown-item"
                                href="#"
                                data-dar-action="more_info"
                              >
                                <i className="ti ti-info-circle" />
                                Request More Information
                              </a>
                              <a className="dropdown-item" href="profile.html">
                                <i className="ti ti-user-circle" />
                                View User Profile
                              </a>
                              <a
                                className="dropdown-item"
                                href="#"
                                data-dar-action="download"
                              >
                                <i className="ti ti-download" />
                                Download Report
                              </a>
                              <hr className="dropdown-divider" />
                              <a
                                className="dropdown-item text-danger"
                                href="#"
                                data-bs-toggle="modal"
                                data-bs-target="#delete-modal"
                              >
                                <i className="ti ti-trash-x" />
                                Delete Permanently
                              </a>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                    <tr
                      className="dt-row"
                      data-dar-status="Pending"
                      data-search="dr-1008 susan ray u461883 susan.r@preskool.com parent — duplicate account pending "
                    >
                      <td className="dt-pin">
                        <input
                          type="checkbox"
                          className="dt-check record-row-check-dar"
                          aria-label="Select Susan Ray"
                        />
                      </td>
                      <td data-dar-col="reqid">
                        <a
                          href="#"
                          className="link-primary fw-semibold"
                        >
                          DR-1008
                        </a>
                      </td>
                      <td data-dar-col="user">
                        <div className="dt-user">
                          <a href="profile.html" className="dt-avatar">
                            <img
                              src="assets/img/profiles/avatar-10.jpg"
                              alt="Susan Ray"
                            />
                            <span className="dt-presence" title="Offline" />
                          </a>
                          <div>
                            <a href="profile.html" className="dt-name">
                              Susan Ray
                            </a>
                            <div className="dt-sub">
                              <span>U461883</span>
                              <span className="dt-dot">•</span>
                              <span>susan.r@preskool.com</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td data-dar-col="usertype">
                        <span className="badge badge-soft-primary">Parent</span>
                      </td>
                      <td data-dar-col="department">—</td>
                      <td data-dar-col="reason">
                        <span className="closure-reason">
                          <span
                            className="closure-reason-text"
                            data-bs-toggle="tooltip"
                            title="Two parent accounts are linked to the same student record."
                          >
                            Duplicate Account
                          </span>
                        </span>
                      </td>
                      <td data-dar-col="requested">19 Jan 2024</td>
                      <td data-dar-col="status">
                        <span className="dt-pill is-pending">
                          <span className="dt-pill-dot" />
                          Pending
                        </span>
                      </td>
                      <td data-dar-col="reviewer">
                        <span className="badge badge-soft-secondary">
                          Unassigned
                        </span>
                      </td>
                      <td data-dar-col="deletion">
                        <span className="text-muted">—</span>
                      </td>
                      <td>
                        <div className="dt-actions">
                          <a
                            href="#"
                            className="dt-ib success"
                            title="Approve"
                            aria-label="Approve Susan Ray"
                            data-dar-action="approve"
                          >
                            <i className="ti ti-circle-check" />
                          </a>
                          <a
                            href="#"
                            className="dt-ib danger"
                            title="Reject"
                            aria-label="Reject Susan Ray"
                            data-dar-action="reject"
                          >
                            <i className="ti ti-circle-x" />
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
                                href="#"
                                data-dar-action="review"
                              >
                                <i className="ti ti-eye" />
                                View Request
                              </a>
                              <a
                                className="dropdown-item"
                                href="#"
                                data-dar-action="review"
                              >
                                <i className="ti ti-file-search" />
                                Review Details
                              </a>
                              <a
                                className="dropdown-item text-success"
                                href="#"
                                data-dar-action="approve"
                              >
                                <i className="ti ti-circle-check" />
                                Approve
                              </a>
                              <a
                                className="dropdown-item text-warning"
                                href="#"
                                data-dar-action="reject"
                              >
                                <i className="ti ti-circle-x" />
                                Reject
                              </a>
                              <a
                                className="dropdown-item"
                                href="#"
                                data-dar-action="more_info"
                              >
                                <i className="ti ti-info-circle" />
                                Request More Information
                              </a>
                              <a className="dropdown-item" href="profile.html">
                                <i className="ti ti-user-circle" />
                                View User Profile
                              </a>
                              <a
                                className="dropdown-item"
                                href="#"
                                data-dar-action="download"
                              >
                                <i className="ti ti-download" />
                                Download Report
                              </a>
                              <hr className="dropdown-divider" />
                              <a
                                className="dropdown-item text-danger"
                                href="#"
                                data-bs-toggle="modal"
                                data-bs-target="#delete-modal"
                              >
                                <i className="ti ti-trash-x" />
                                Delete Permanently
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
              <div className="card-empty" id="darEmpty">
                <div className="card-empty-art">
                  <i className="ti ti-user-check" />
                </div>
                <h4 className="fs-16 fw-medium">No Delete Requests Found</h4>
                <p>
                  All user accounts are currently active. Adjust your filters to
                  see more results.
                </p>
                <button
                  type="button"
                  className="btn btn-light"
                  data-dar-action="clear_filters"
                >
                  <i className="ti ti-rotate me-1" />
                  Reset filters
                </button>
              </div>
              {/* Pagination footer */}
              <div className="card-foot">
                <div className="card-foot-info">
                  Showing <span className="range-from">1</span>–
                  <span className="range-to">8</span> of{" "}
                  <span className="range-total">128</span> requests
                </div>
                <div className="card-foot-size">
                  <label className="mb-0">Rows:</label>
                  <select className="form-select" aria-label="Rows per page">
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                  </select>
                </div>
                <nav
                  className="card-pagination"
                  aria-label="Requests pagination"
                >
                  <button
                    type="button"
                    className="card-page-btn"
                    data-dar-action="page"
                    aria-label="First page"
                    disabled
                  >
                    <i className="ti ti-chevrons-left" />
                  </button>
                  <button
                    type="button"
                    className="card-page-btn"
                    data-dar-action="page"
                    aria-label="Previous page"
                    disabled
                  >
                    <i className="ti ti-chevron-left" />
                  </button>
                  <span className="card-page-numbers">
                    <button
                      type="button"
                      className="card-page-btn active"
                      data-dar-action="page"
                      aria-current="page"
                    >
                      1
                    </button>
                    <button
                      type="button"
                      className="card-page-btn"
                      data-dar-action="page"
                    >
                      2
                    </button>
                    <button
                      type="button"
                      className="card-page-btn"
                      data-dar-action="page"
                    >
                      3
                    </button>
                  </span>
                  <button
                    type="button"
                    className="card-page-btn"
                    data-dar-action="page"
                    aria-label="Next page"
                  >
                    <i className="ti ti-chevron-right" />
                  </button>
                  <button
                    type="button"
                    className="card-page-btn"
                    data-dar-action="page"
                    aria-label="Last page"
                  >
                    <i className="ti ti-chevrons-right" />
                  </button>
                </nav>
              </div>
              <div
                className="toast-stack toast-container"
                id="darToasts"
                aria-live="polite"
                aria-atomic="true"
              />
            </div>
          </div>
          {/* /Requests workspace */}
          {/* Approval workflow + Warning */}
          <div className="closure-page">
            <div className="row g-3">
              {/* Approval Workflow */}
              <div className="col-12 col-xl-8 d-flex">
                <div className="card flex-fill mb-0">
                  <div className="card-header d-flex align-items-center justify-content-between flex-wrap gap-3">
                    <h5 className="mb-0 d-flex align-items-center">
                      <i className="ti ti-route text-primary me-2" />
                      Approval Workflow
                    </h5>
                    <span className="badge badge-soft-primary">
                      Request DR-1003
                    </span>
                  </div>
                  <div className="card-body">
                    <div className="closure-flow">
                      <div className="closure-step is-done">
                        <span className="closure-step-icon">
                          <i className="ti ti-check" />
                        </span>
                        <p className="closure-step-title">Request Submitted</p>
                        <p className="closure-step-meta">
                          14 Mar 2024 · 09:12 AM
                        </p>
                        <span className="closure-step-review">
                          <i className="ti ti-user" />
                          Marcus Lee
                        </span>
                      </div>
                      <div className="closure-step is-active">
                        <span className="closure-step-icon">
                          <i className="ti ti-eye" />
                        </span>
                        <p className="closure-step-title">Under Review</p>
                        <p className="closure-step-meta">
                          15 Mar 2024 · 10:40 AM
                        </p>
                        <span className="closure-step-review">
                          <i className="ti ti-user" />
                          James Wilson
                        </span>
                      </div>
                      <div className="closure-step is-pending">
                        <span className="closure-step-icon">
                          <i className="ti ti-user-check" />
                        </span>
                        <p className="closure-step-title">Manager Approval</p>
                        <p className="closure-step-meta">Pending</p>
                        <span className="closure-step-review">
                          <i className="ti ti-user" />
                          Sarah Mitchell
                        </span>
                      </div>
                      <div className="closure-step is-pending">
                        <span className="closure-step-icon">
                          <i className="ti ti-shield-check" />
                        </span>
                        <p className="closure-step-title">Admin Approval</p>
                        <p className="closure-step-meta">Pending</p>
                        <span className="closure-step-review">
                          <i className="ti ti-user" />
                          Kevin Larry
                        </span>
                      </div>
                      <div className="closure-step is-pending">
                        <span className="closure-step-icon">
                          <i className="ti ti-calendar-time" />
                        </span>
                        <p className="closure-step-title">Deletion Scheduled</p>
                        <p className="closure-step-meta">Pending</p>
                        <span className="closure-step-review">
                          <i className="ti ti-robot" />
                          System
                        </span>
                      </div>
                      <div className="closure-step is-pending">
                        <span className="closure-step-icon">
                          <i className="ti ti-circle-check" />
                        </span>
                        <p className="closure-step-title">Completed</p>
                        <p className="closure-step-meta">Pending</p>
                        <span className="closure-step-review">
                          <i className="ti ti-robot" />
                          System
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Warning panel */}
              <div className="col-12 col-xl-4 d-flex">
                <div className="warning-panel flex-fill">
                  <div className="warning-panel-head">
                    <span className="warning-panel-icon">
                      <i className="ti ti-alert-triangle" />
                    </span>
                    <div>
                      <h5 className="mb-0">Before You Approve</h5>
                      <span className="fs-12 text-muted">
                        Compliance &amp; data-protection notice
                      </span>
                    </div>
                  </div>
                  <ul className="warning-panel-list">
                    <li>
                      <i className="ti ti-lock-off text-warning" />
                      <span>
                        Deleting an account will{" "}
                        <b>permanently remove access</b> to all school systems
                        and services.
                      </span>
                    </li>
                    <li>
                      <i className="ti ti-shield-lock text-warning" />
                      <span>
                        Personal data may be <b>anonymized</b> and retained only
                        where legally required.
                      </span>
                    </li>
                    <li>
                      <i className="ti ti-alert-hexagon text-danger" />
                      <span>
                        This action <b>cannot be undone</b> after final
                        confirmation and scheduling.
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          {/* /Approval workflow + Warning */}
          <div className="toast-stack-closure toast-container position-fixed bottom-0 end-0 p-3" />
          <div className="row align-items-center">
            <div className="col-md-12">
              <div className="datatable-paginate mt-4" />
            </div>
          </div>
        </div>
      </div>
      {/* /Page Wrapper */}
      <>
        {/* Delete Modal */}
        <div className="modal fade" id="delete-modal">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <form action="delete-account.html">
                <div className="modal-body text-center">
                  <span className="delete-icon">
                    <i className="ti ti-trash-x" />
                  </span>
                  <h4>Confirm Deletion</h4>
                  <p>
                    You want to delete all the marked items, this cant be undone
                    once you delete.
                  </p>
                  <div className="d-flex justify-content-center">
                    <a
                      href="#"
                      className="btn btn-light me-3"
                      data-bs-dismiss="modal"
                    >
                      Cancel
                    </a>
                    <button type="submit" className="btn btn-danger">
                      Yes, Delete
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
        {/* /Delete Modal */}
      </>
    </>
  );
};

export default DeleteAccount;
