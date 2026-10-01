import { Link } from "react-router-dom";
import { all_routes } from "../../../routes/all_routes";
const Staffs = () => {
  return (
    <>
  {/* Page Wrapper */}
  <div className="page-wrapper">
    <div className="content">
      {/* Page Header */}
      <div className="d-md-flex d-block align-items-center justify-content-between flex-wrap gap-2 mb-3">
        <div className="my-auto mb-2">
          <h3 className="page-title mb-1">Staff</h3>
          <nav>
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item">
                <Link to={all_routes.adminDashboard}>Dashboard</Link>
              </li>
              <li className="breadcrumb-item">
                <a href="#">HRM</a>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Staff
              </li>
            </ol>
          </nav>
        </div>
        {/* Page-level actions. Grid tools (search, filters, columns,
					 density, refresh) live in the workspace toolbar instead. */}
        <div className="d-flex my-xl-auto right-content align-items-center flex-wrap">
          <div className="me-2 mb-2">
            <a
              href="#"
              className="btn btn-outline-light bg-white btn-sm fw-medium d-inline-flex align-items-center"
              data-bs-toggle="modal"
              data-bs-target="#staff_import"
            >
              <i className="ti ti-file-import me-2" />
              Import Staff
            </a>
          </div>
          <div className="dropdown me-2 mb-2">
            <a
              href="#"
              className="dropdown-toggle btn btn-outline-light bg-white btn-sm fw-medium d-inline-flex align-items-center"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <i className="ti ti-file-export me-2" />
              Export Staff
            </a>
            <ul className="dropdown-menu dropdown-menu-end p-3">
              <li>
                <a
                  href="#"
                  className="dropdown-item rounded-1"
                  data-cls-action="export_pdf"
                >
                  <i className="ti ti-file-type-pdf me-2" />
                  Export as PDF
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="dropdown-item rounded-1"
                  data-cls-action="export_excel"
                >
                  <i className="ti ti-file-type-xls me-2" />
                  Export as Excel
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="dropdown-item rounded-1"
                  data-cls-action="export_csv"
                >
                  <i className="ti ti-file-type-csv me-2" />
                  Export as CSV
                </a>
              </li>
            </ul>
          </div>
          <div className="me-2 mb-2">
            <a
              href="#"
              className="btn btn-outline-light bg-white btn-sm fw-medium d-inline-flex align-items-center"
              data-cls-action="print_profile"
            >
              <i className="ti ti-printer me-2" />
              Print Staff List
            </a>
          </div>
          <div className="mb-2">
            <a
              href="#"
              data-bs-toggle="modal"
              data-bs-target="#add_staff"
              className="btn btn-primary btn-sm d-flex align-items-center"
            >
              <i className="ti ti-square-rounded-plus me-2" />
              Add Staff
            </a>
          </div>
        </div>
      </div>
      {/* /Page Header */}
      {/* Staff Workspace */}
      <div className="card">
        <div
          className="data-workspace classes-workspace"
          id="classWorkspace"
          data-density="default"
        >
          {/* ===================== TOOLBAR ===================== */}
          <div className="card-header border-bottom">
            <div className="page-toolbar">
              <div className="search-toolbar">
                <i className="ti ti-search search-toolbar-icon" />
                <input
                  type="text"
                  id="clsSearch"
                  placeholder="Search staff, employee ID, department, email or branch…"
                  aria-label="Search staff"
                />
                <span className="search-toolbar-kbd" id="clsSearchKbd">
                  ⌘K
                </span>
                <button
                  type="button"
                  className="search-clear"
                  id="clsSearchClear"
                  data-cls-action="clear_search"
                  aria-label="Clear search"
                  hidden
                >
                  <i className="ti ti-x" />
                </button>
              </div>
              <div className="dropdown">
                <button
                  type="button"
                  className="workspace-button dropdown-toggle"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i className="ti ti-bookmark" />
                  Saved Views
                </button>
                <ul className="dropdown-menu">
                  <li className="context-menu-head">My Views</li>
                  <li>
                    <a
                      className="dropdown-item"
                      href="#"
                      data-cls-view="all"
                    >
                      <i className="ti ti-layout-list" />
                      All Staff
                      <span className="view-count" />
                    </a>
                  </li>
                  <li>
                    <a
                      className="dropdown-item"
                      href="#"
                      data-cls-view="Active"
                    >
                      <i className="ti ti-circle-check" />
                      Active
                      <span className="view-count" />
                    </a>
                  </li>
                  <li>
                    <a
                      className="dropdown-item"
                      href="#"
                      data-cls-view="On Leave"
                    >
                      <i className="ti ti-plane-departure" />
                      On Leave
                      <span className="view-count" />
                    </a>
                  </li>
                  <li>
                    <a
                      className="dropdown-item"
                      href="#"
                      data-cls-view="Probation"
                    >
                      <i className="ti ti-hourglass" />
                      Probation
                      <span className="view-count" />
                    </a>
                  </li>
                  <li>
                    <a
                      className="dropdown-item"
                      href="#"
                      data-cls-view="Suspended"
                    >
                      <i className="ti ti-ban" />
                      Suspended
                      <span className="view-count" />
                    </a>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <a
                      className="dropdown-item text-primary"
                      href="#"
                      data-cls-action="save_view"
                    >
                      <i className="ti ti-plus" />
                      Save current view
                    </a>
                  </li>
                </ul>
              </div>
              <div className="dropdown">
                <button
                  type="button"
                  className="workspace-button dropdown-toggle"
                  data-bs-toggle="dropdown"
                  data-bs-auto-close="outside"
                  aria-expanded="false"
                >
                  <i className="ti ti-adjustments-horizontal" />
                  Filters
                  <span className="result-count" id="clsFilterCount" hidden>
                    0
                  </span>
                </button>
                <div className="dropdown-menu p-3 filter-menu">
                  <div className="row g-3">
                    <div className="col-6">
                      <label className="form-label mb-1" htmlFor="department">
                        Department
                      </label>
                      <select
                        className="form-select"
                        data-filter="Department"
                        id="department"
                      >
                        <option value="">All</option>
                        <option>Administration</option>
                        <option>Accounts</option>
                        <option>Library</option>
                        <option>Transport</option>
                        <option>Front Office</option>
                        <option>IT Support</option>
                        <option>Housekeeping</option>
                        <option>Security</option>
                      </select>
                    </div>
                    <div className="col-6">
                      <label className="form-label mb-1" htmlFor="designation">
                        Designation
                      </label>
                      <select
                        className="form-select"
                        data-filter="Designation"
                        id="designation"
                      >
                        <option value="">All</option>
                        <option>Admin Officer</option>
                        <option>Accountant</option>
                        <option>Librarian</option>
                        <option>Transport Coordinator</option>
                        <option>Receptionist</option>
                        <option>System Administrator</option>
                        <option>Supervisor</option>
                        <option>Cashier</option>
                        <option>Clerk</option>
                        <option>Security Head</option>
                      </select>
                    </div>
                    <div className="col-6">
                      <label className="form-label mb-1" htmlFor="staff-type">
                        Staff Type
                      </label>
                      <select
                        className="form-select"
                        data-filter="StaffType"
                        id="staff-type"
                      >
                        <option value="">All</option>
                        <option>Non-Teaching</option>
                        <option>Support</option>
                      </select>
                    </div>
                    <div className="col-6">
                      <label
                        className="form-label mb-1"
                        htmlFor="employment-type"
                      >
                        Employment Type
                      </label>
                      <select
                        className="form-select"
                        data-filter="Employment"
                        id="employment-type"
                      >
                        <option value="">All</option>
                        <option>Full Time</option>
                        <option>Contract</option>
                        <option>Part Time</option>
                      </select>
                    </div>
                    <div className="col-6">
                      <label className="form-label mb-1" htmlFor="gender">
                        Gender
                      </label>
                      <select
                        className="form-select"
                        data-filter="Gender"
                        id="gender"
                      >
                        <option value="">All</option>
                        <option>Male</option>
                        <option>Female</option>
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
                        <option>North Wing</option>
                        <option>South Wing</option>
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
                        <option>On Leave</option>
                        <option>Probation</option>
                        <option>Suspended</option>
                        <option>Inactive</option>
                      </select>
                    </div>
                    <div className="col-6">
                      <label className="form-label mb-1" htmlFor="joining-date">
                        Joining Date
                      </label>
                      <select
                        className="form-select"
                        data-filter="Joining"
                        id="joining-date"
                      >
                        <option value="">Any</option>
                        <option value={2023}>2023 &amp; later</option>
                        <option value={2020}>2020 – 2022</option>
                        <option value={201}>Before 2020</option>
                      </select>
                    </div>
                  </div>
                  <div className="d-flex align-items-center justify-content-between gap-2 mt-3 pt-3 border-top">
                    <span className="fs-12 text-muted">
                      <b id="clsFilterHits">10</b> of 10 staff match
                    </span>
                    <div className="d-flex gap-2">
                      <button
                        type="button"
                        className="btn btn-light btn-sm"
                        data-cls-action="clear_filters"
                      >
                        Reset
                      </button>
                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        data-cls-action="apply_filters"
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="dropdown">
                <button
                  type="button"
                  className="workspace-button dropdown-toggle"
                  data-bs-toggle="dropdown"
                  data-bs-auto-close="outside"
                  aria-expanded="false"
                >
                  <i className="ti ti-columns-3" />
                  Columns
                </button>
                <ul className="dropdown-menu p-2 column-menu">
                  <li className="context-menu-head">Toggle columns</li>
                  <li>
                    <label className="dropdown-item">
                      <input
                        className="form-check-input me-2 mt-0"
                        type="checkbox"
                        data-cls-col="staff"
                        defaultChecked
                      />
                      Staff
                    </label>
                  </li>
                  <li>
                    <label className="dropdown-item">
                      <input
                        className="form-check-input me-2 mt-0"
                        type="checkbox"
                        data-cls-col="contact"
                        defaultChecked
                      />
                      Contact Details
                    </label>
                  </li>
                  <li>
                    <label className="dropdown-item">
                      <input
                        className="form-check-input me-2 mt-0"
                        type="checkbox"
                        data-cls-col="work"
                        defaultChecked
                      />
                      Work Details
                    </label>
                  </li>
                  <li>
                    <label className="dropdown-item">
                      <input
                        className="form-check-input me-2 mt-0"
                        type="checkbox"
                        data-cls-col="status"
                        defaultChecked
                      />
                      Status
                    </label>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <button
                      type="button"
                      className="dropdown-item text-primary"
                      data-cls-action="reset_columns"
                    >
                      <i className="ti ti-rotate" />
                      Show all columns
                    </button>
                  </li>
                </ul>
              </div>
              <span className="flex-grow-1" />
              <div
                className="density-toggle"
                role="group"
                aria-label="Row density"
              >
                <button
                  type="button"
                  data-cls-density="compact"
                  data-bs-toggle="tooltip"
                  title="Compact"
                  aria-label="Compact rows"
                >
                  <i className="ti ti-baseline-density-small" />
                </button>
                <button
                  type="button"
                  className="active"
                  data-cls-density="default"
                  data-bs-toggle="tooltip"
                  title="Default"
                  aria-label="Default rows"
                >
                  <i className="ti ti-baseline-density-medium" />
                </button>
                <button
                  type="button"
                  data-cls-density="comfortable"
                  data-bs-toggle="tooltip"
                  title="Comfortable"
                  aria-label="Comfortable rows"
                >
                  <i className="ti ti-baseline-density-large" />
                </button>
              </div>
              <button
                type="button"
                className="workspace-button workspace-button-icon"
                data-cls-action="refresh"
                data-bs-toggle="tooltip"
                title="Refresh"
                aria-label="Refresh"
              >
                <i className="ti ti-refresh" />
              </button>
              <button
                type="button"
                className="workspace-button workspace-button-icon"
                data-cls-action="print_profile"
                data-bs-toggle="tooltip"
                title="Print Staff List"
                aria-label="Print Staff List"
              >
                <i className="ti ti-printer" />
              </button>
              <button
                type="button"
                className="workspace-button workspace-button-icon"
                data-cls-action="fullscreen"
                data-bs-toggle="tooltip"
                title="Fullscreen"
                aria-label="Toggle fullscreen"
                aria-pressed="false"
              >
                <i className="ti ti-arrows-maximize" />
              </button>
            </div>
            <div className="quick-filters">
              <span className="text-muted fs-12 fw-semibold me-1">Quick:</span>
              <button
                type="button"
                className="quick-filter"
                data-cls-view="Active"
              >
                <i className="ti ti-circle-check" />
                Active <span className="quick-filter-count">0</span>
              </button>
              <button
                type="button"
                className="quick-filter"
                data-cls-view="On Leave"
              >
                <i className="ti ti-plane-departure" />
                On Leave <span className="quick-filter-count">0</span>
              </button>
              <button
                type="button"
                className="quick-filter"
                data-cls-view="Probation"
              >
                <i className="ti ti-hourglass" />
                Probation <span className="quick-filter-count">0</span>
              </button>
              <button
                type="button"
                className="quick-filter"
                data-cls-view="Suspended"
              >
                <i className="ti ti-ban" />
                Suspended <span className="quick-filter-count">0</span>
              </button>
              <button
                type="button"
                className="quick-filter"
                data-cls-view="Inactive"
              >
                <i className="ti ti-circle-off" />
                Inactive <span className="quick-filter-count">0</span>
              </button>
              <button
                type="button"
                className="btn btn-link btn-sm text-primary quick-filter-clear"
                id="clsClearQuick"
                data-cls-action="clear_filters"
                hidden
              >
                Clear all
              </button>
              <div className="dropdown ms-auto">
                <button
                  type="button"
                  className="workspace-button dropdown-toggle"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i className="ti ti-sort-ascending-2" />
                  Sort
                </button>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li className="context-menu-head">Sort by</li>
                  <li>
                    <button
                      type="button"
                      className="dropdown-item"
                      data-cls-sort="name"
                    >
                      <i className="ti ti-abc" />
                      Employee Name (A–Z)
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      className="dropdown-item"
                      data-cls-sort="department"
                    >
                      <i className="ti ti-building" />
                      Department
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      className="dropdown-item"
                      data-cls-sort="experience"
                    >
                      <i className="ti ti-briefcase" />
                      Experience
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      className="dropdown-item"
                      data-cls-sort="joindate"
                    >
                      <i className="ti ti-calendar-event" />
                      Joining Date
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      className="dropdown-item active"
                      data-cls-sort="recent"
                    >
                      <i className="ti ti-clock" />
                      Recently updated
                    </button>
                  </li>
                </ul>
              </div>
            </div>
            <div className="filter-chips" aria-live="polite" />
          </div>
          {/* ===================== SKELETON ===================== */}
          <div className="skeleton-loader" aria-hidden="true">
            <div className="skeleton-head">
              <div className="skeleton-toolbar">
                <div className="skeleton skeleton-search" />
                <div className="skeleton skeleton-btn" />
                <div className="skeleton skeleton-btn" />
                <div className="skeleton skeleton-btn" />
                <div className="skeleton skeleton-density ms-auto" />
                <div className="skeleton skeleton-ico" />
                <div className="skeleton skeleton-ico" />
              </div>
              <div className="skeleton-quick">
                <div className="skeleton skeleton-chip" />
                <div className="skeleton skeleton-chip" />
                <div className="skeleton skeleton-chip" />
                <div className="skeleton skeleton-chip" />
                <div className="skeleton skeleton-chip" />
              </div>
            </div>
            <div className="skeleton-body">
              <div className="skeleton-row skeleton-thead">
                <span />
                <div className="skeleton skeleton-check" />
                <div className="skeleton skeleton-head" />
                <div className="skeleton skeleton-head" />
                <div className="skeleton skeleton-head" />
                <div className="skeleton skeleton-head" />
                <div className="skeleton skeleton-head skeleton-head-end" />
              </div>
              <div className="skeleton-row">
                <div className="skeleton skeleton-chev" />
                <div className="skeleton skeleton-check" />
                <div className="skeleton-cell">
                  <div className="skeleton skeleton-avatar" />
                  <div className="skeleton-stack">
                    <div className="skeleton skeleton-line" />
                    <div className="skeleton skeleton-line skeleton-thin" />
                  </div>
                </div>
                <div className="skeleton-stack">
                  <div className="skeleton skeleton-line" />
                  <div className="skeleton skeleton-line skeleton-thin" />
                </div>
                <div className="skeleton-stack">
                  <div className="skeleton skeleton-line" />
                  <div className="skeleton skeleton-line skeleton-thin" />
                </div>
                <div className="skeleton skeleton-pill" />
                <div className="skeleton-actions">
                  <div className="skeleton skeleton-circle" />
                  <div className="skeleton skeleton-circle" />
                  <div className="skeleton skeleton-circle" />
                  <div className="skeleton skeleton-circle" />
                </div>
              </div>
              <div className="skeleton-row">
                <div className="skeleton skeleton-chev" />
                <div className="skeleton skeleton-check" />
                <div className="skeleton-cell">
                  <div className="skeleton skeleton-avatar" />
                  <div className="skeleton-stack">
                    <div className="skeleton skeleton-line" />
                    <div className="skeleton skeleton-line skeleton-thin" />
                  </div>
                </div>
                <div className="skeleton-stack">
                  <div className="skeleton skeleton-line" />
                  <div className="skeleton skeleton-line skeleton-thin" />
                </div>
                <div className="skeleton-stack">
                  <div className="skeleton skeleton-line" />
                  <div className="skeleton skeleton-line skeleton-thin" />
                </div>
                <div className="skeleton skeleton-pill" />
                <div className="skeleton-actions">
                  <div className="skeleton skeleton-circle" />
                  <div className="skeleton skeleton-circle" />
                  <div className="skeleton skeleton-circle" />
                  <div className="skeleton skeleton-circle" />
                </div>
              </div>
              <div className="skeleton-row">
                <div className="skeleton skeleton-chev" />
                <div className="skeleton skeleton-check" />
                <div className="skeleton-cell">
                  <div className="skeleton skeleton-avatar" />
                  <div className="skeleton-stack">
                    <div className="skeleton skeleton-line" />
                    <div className="skeleton skeleton-line skeleton-thin" />
                  </div>
                </div>
                <div className="skeleton-stack">
                  <div className="skeleton skeleton-line" />
                  <div className="skeleton skeleton-line skeleton-thin" />
                </div>
                <div className="skeleton-stack">
                  <div className="skeleton skeleton-line" />
                  <div className="skeleton skeleton-line skeleton-thin" />
                </div>
                <div className="skeleton skeleton-pill" />
                <div className="skeleton-actions">
                  <div className="skeleton skeleton-circle" />
                  <div className="skeleton skeleton-circle" />
                  <div className="skeleton skeleton-circle" />
                  <div className="skeleton skeleton-circle" />
                </div>
              </div>
              <div className="skeleton-row">
                <div className="skeleton skeleton-chev" />
                <div className="skeleton skeleton-check" />
                <div className="skeleton-cell">
                  <div className="skeleton skeleton-avatar" />
                  <div className="skeleton-stack">
                    <div className="skeleton skeleton-line" />
                    <div className="skeleton skeleton-line skeleton-thin" />
                  </div>
                </div>
                <div className="skeleton-stack">
                  <div className="skeleton skeleton-line" />
                  <div className="skeleton skeleton-line skeleton-thin" />
                </div>
                <div className="skeleton-stack">
                  <div className="skeleton skeleton-line" />
                  <div className="skeleton skeleton-line skeleton-thin" />
                </div>
                <div className="skeleton skeleton-pill" />
                <div className="skeleton-actions">
                  <div className="skeleton skeleton-circle" />
                  <div className="skeleton skeleton-circle" />
                  <div className="skeleton skeleton-circle" />
                  <div className="skeleton skeleton-circle" />
                </div>
              </div>
              <div className="skeleton-row">
                <div className="skeleton skeleton-chev" />
                <div className="skeleton skeleton-check" />
                <div className="skeleton-cell">
                  <div className="skeleton skeleton-avatar" />
                  <div className="skeleton-stack">
                    <div className="skeleton skeleton-line" />
                    <div className="skeleton skeleton-line skeleton-thin" />
                  </div>
                </div>
                <div className="skeleton-stack">
                  <div className="skeleton skeleton-line" />
                  <div className="skeleton skeleton-line skeleton-thin" />
                </div>
                <div className="skeleton-stack">
                  <div className="skeleton skeleton-line" />
                  <div className="skeleton skeleton-line skeleton-thin" />
                </div>
                <div className="skeleton skeleton-pill" />
                <div className="skeleton-actions">
                  <div className="skeleton skeleton-circle" />
                  <div className="skeleton skeleton-circle" />
                  <div className="skeleton skeleton-circle" />
                  <div className="skeleton skeleton-circle" />
                </div>
              </div>
              <div className="skeleton-row">
                <div className="skeleton skeleton-chev" />
                <div className="skeleton skeleton-check" />
                <div className="skeleton-cell">
                  <div className="skeleton skeleton-avatar" />
                  <div className="skeleton-stack">
                    <div className="skeleton skeleton-line" />
                    <div className="skeleton skeleton-line skeleton-thin" />
                  </div>
                </div>
                <div className="skeleton-stack">
                  <div className="skeleton skeleton-line" />
                  <div className="skeleton skeleton-line skeleton-thin" />
                </div>
                <div className="skeleton-stack">
                  <div className="skeleton skeleton-line" />
                  <div className="skeleton skeleton-line skeleton-thin" />
                </div>
                <div className="skeleton skeleton-pill" />
                <div className="skeleton-actions">
                  <div className="skeleton skeleton-circle" />
                  <div className="skeleton skeleton-circle" />
                  <div className="skeleton skeleton-circle" />
                  <div className="skeleton skeleton-circle" />
                </div>
              </div>
            </div>
          </div>
          {/* ===================== LIVE CONTENT ===================== */}
          <div className="live-content">
            <div
              className="bulk-selection"
              id="clsBulk"
              role="region"
              aria-label="Bulk actions"
              hidden
            >
              <div className="bulk-selection-inner">
                <span className="bulk-selection-count">
                  <b id="clsCount">0</b> selected
                </span>
                <div className="d-flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="btn btn-sm"
                    data-cls-action="assign_dept"
                  >
                    <i className="ti ti-building-community me-1" />
                    Assign Department
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm"
                    data-cls-action="export_csv"
                  >
                    <i className="ti ti-file-export me-1" />
                    Export Selected
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm"
                    data-cls-action="print_profile"
                  >
                    <i className="ti ti-printer me-1" />
                    Print Profiles
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm"
                    data-cls-action="archive"
                  >
                    <i className="ti ti-archive me-1" />
                    Archive
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
                  data-cls-action="clear_sel"
                  aria-label="Clear selection"
                >
                  <i className="ti ti-x" />
                </button>
              </div>
            </div>
            {/* Table */}
            <div className="data-table dt-cards">
              <table className="table">
                <caption className="visually-hidden">
                  Staff list with contact and work details
                </caption>
                <thead>
                  <tr>
                    <th className="card-expand-toggle" />
                    <th className="dt-pin card-select">
                      <input
                        type="checkbox"
                        className="dt-check"
                        id="clsAll"
                        aria-label="Select all staff"
                      />
                    </th>
                    <th
                      className="dt-sortable"
                      data-cls-col="staff"
                      data-cls-sort="name"
                    >
                      Staff <i className="ti ti-arrows-sort dt-sort-ic" />
                      <span className="dt-resize" />
                    </th>
                    <th
                      className="dt-sortable"
                      data-cls-col="contact"
                      data-cls-sort="joindate"
                    >
                      Contact Details{" "}
                      <i className="ti ti-arrows-sort dt-sort-ic" />
                      <span className="dt-resize" />
                    </th>
                    <th
                      className="dt-sortable"
                      data-cls-col="work"
                      data-cls-sort="experience"
                    >
                      Work Details{" "}
                      <i className="ti ti-arrows-sort dt-sort-ic" />
                      <span className="dt-resize" />
                    </th>
                    <th
                      className="dt-sortable"
                      data-cls-col="status"
                      data-cls-sort="status"
                    >
                      Status <i className="ti ti-arrows-sort dt-sort-ic" />
                      <span className="dt-resize" />
                    </th>
                    <th className="text-end card-actions-row">Actions</th>
                  </tr>
                </thead>
                <tbody id="clsBody">
                  <tr
                    className="dt-row"
                    data-cls-status="Active"
                    data-search="teresa bru stf-2001 administration admin officer teresa.bru@example.com +1 546 8548 801 main campus full time active female"
                  >
                    <td>
                      <button
                        type="button"
                        className="dt-expand"
                        aria-label="Expand Teresa Bru"
                        aria-expanded="false"
                      >
                        <i className="ti ti-chevron-right" />
                      </button>
                    </td>
                    <td className="dt-pin">
                      <input
                        type="checkbox"
                        className="dt-check row-select-cell"
                        aria-label="Select Teresa Bru"
                      />
                    </td>
                    <td data-cls-col="staff">
                      <div className="dt-user">
                        <a
                          href="#"
                          className="dt-avatar avatar"
                          data-bs-toggle="modal"
                          data-bs-target="#staff_profile"
                        >
                          <img
                            src="assets/img/profiles/avatar-01.jpg"
                            className="rounded-circle flex-shrink-0"
                            alt="Teresa Bru"
                          />
                        </a>
                        <div>
                          <a
                            href="#"
                            className="dt-name"
                            data-bs-toggle="modal"
                            data-bs-target="#staff_profile"
                          >
                            Teresa Bru
                          </a>
                          <div className="dt-sub">
                            <span className="link-primary dt-code">
                              STF-2001
                            </span>
                          </div>
                          <div className="d-flex flex-wrap gap-1 mt-1">
                            <span className="badge badge-soft-primary">
                              <i className="ti ti-building me-1" />
                              <span className="dt-dept">Administration</span>
                            </span>
                            <span className="badge badge-soft-secondary">
                              <i className="ti ti-briefcase me-1" />
                              <span className="dt-desig">Admin Officer</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td data-cls-col="contact">
                      <ul className="list-unstyled mb-0 fs-12">
                        <li className="py-1 text-muted">
                          <i className="ti ti-mail me-1" />
                          <span className="dt-email">
                            teresa.bru@example.com
                          </span>
                        </li>
                        <li className="py-1 text-muted">
                          <i className="ti ti-phone me-1" />
                          <span className="dt-phone">+1 546 8548 801</span>
                        </li>
                        <li className="py-1">
                          <span className="badge badge-soft-info">
                            <i className="ti ti-map-pin me-1" />
                            <span className="dt-branch">Main Campus</span>
                          </span>{" "}
                          <span className="badge badge-soft-success">
                            <i className="ti ti-id-badge me-1" />
                            <span className="dt-emp">Full Time</span>
                          </span>
                        </li>
                        <li className="py-1 text-muted">
                          <i className="ti ti-calendar-event me-1" />
                          Joined{" "}
                          <span className="fw-medium text-dark dt-joined">
                            12 Jun 2019
                          </span>
                        </li>
                      </ul>
                    </td>
                    <td data-cls-col="work">
                      <ul className="list-unstyled mb-0 fs-12">
                        <li className="py-1 text-muted">
                          <i className="ti ti-user-cog me-1" />
                          Reports to{" "}
                          <span className="fw-medium text-dark">
                            Principal Office
                          </span>
                        </li>
                        <li className="py-1">
                          <span className="badge badge-soft-secondary">
                            <i className="ti ti-school me-1" />
                            MBA
                          </span>{" "}
                          <span className="badge badge-soft-info">
                            <i className="ti ti-briefcase me-1" />
                            <span className="dt-exp-val">9</span> yrs
                          </span>
                        </li>
                        <li className="py-1">
                          <span className="badge badge-soft-success">
                            <i className="ti ti-calendar-check me-1" />
                            Present
                          </span>
                        </li>
                        <li className="py-1 text-muted">
                          <i className="ti ti-clock me-1" />
                          Last login{" "}
                          <span className="fw-medium text-dark">
                            Today 08:12 AM
                          </span>
                        </li>
                      </ul>
                    </td>
                    <td data-cls-col="status">
                      <span className="dt-pill is-active">
                        <span className="dt-pill-dot" />
                        Active
                      </span>
                    </td>
                    <td>
                      <div className="dt-actions">
                        <a
                          href="#"
                          className="dt-ib"
                          title="View Profile"
                          aria-label="View Profile"
                          data-bs-toggle="modal"
                          data-bs-target="#staff_profile"
                          data-cls-action="view"
                        >
                          <i className="ti ti-eye" />
                        </a>
                        <a
                          href="#"
                          className="dt-ib"
                          title="Edit Staff"
                          aria-label="Edit Staff"
                          data-bs-toggle="modal"
                          data-bs-target="#edit_staff"
                        >
                          <i className="ti ti-edit" />
                        </a>
                        <a
                          href="#"
                          className="dt-ib"
                          title="Attendance History"
                          aria-label="Attendance History"
                          data-bs-toggle="modal"
                          data-bs-target="#attendance_summary"
                          data-cls-action="attendance"
                        >
                          <i className="ti ti-calendar-stats" />
                        </a>
                        <a
                          href="#"
                          className="dt-ib"
                          title="Assign Department"
                          aria-label="Assign Department"
                          data-bs-toggle="modal"
                          data-bs-target="#dept_assign"
                          data-cls-action="assign_dept"
                        >
                          <i className="ti ti-building-community" />
                        </a>
                        <a
                          href="#"
                          className="dt-ib"
                          title="Documents"
                          aria-label="Documents"
                          data-bs-toggle="modal"
                          data-bs-target="#staff_documents"
                          data-cls-action="documents"
                        >
                          <i className="ti ti-files" />
                        </a>
                        <a
                          href="#"
                          className="dt-ib"
                          title="Print Profile"
                          aria-label="Print Profile"
                          data-cls-action="print_profile"
                        >
                          <i className="ti ti-printer" />
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
                              data-bs-toggle="modal"
                              data-bs-target="#staff_profile"
                              data-cls-action="view"
                            >
                              <i className="ti ti-eye" />
                              View Profile
                            </a>
                            <a
                              className="dropdown-item"
                              href="#"
                              data-bs-toggle="modal"
                              data-bs-target="#edit_staff"
                            >
                              <i className="ti ti-edit" />
                              Edit Staff
                            </a>
                            <a
                              className="dropdown-item"
                              href="#"
                              data-bs-toggle="modal"
                              data-bs-target="#attendance_summary"
                              data-cls-action="attendance"
                            >
                              <i className="ti ti-calendar-stats" />
                              Attendance History
                            </a>
                            <a
                              className="dropdown-item"
                              href="staff-payroll.html"
                              data-cls-action="payroll"
                            >
                              <i className="ti ti-cash" />
                              Payroll Details
                            </a>
                            <a
                              className="dropdown-item"
                              href="staff-leaves.html"
                              data-cls-action="leave"
                            >
                              <i className="ti ti-calendar-off" />
                              Leave History
                            </a>
                            <a
                              className="dropdown-item"
                              href="#"
                              data-bs-toggle="modal"
                              data-bs-target="#performance_details"
                              data-cls-action="performance"
                            >
                              <i className="ti ti-award" />
                              Performance Review
                            </a>
                            <hr className="dropdown-divider" />
                            <a
                              className="dropdown-item"
                              href="#"
                              data-bs-toggle="modal"
                              data-bs-target="#dept_assign"
                              data-cls-action="transfer"
                            >
                              <i className="ti ti-transfer" />
                              Transfer Department
                            </a>
                            <a
                              className="dropdown-item text-warning"
                              href="#"
                              data-cls-action="reset_cred"
                            >
                              <i className="ti ti-key" />
                              Reset Credentials
                            </a>
                            <a
                              className="dropdown-item"
                              href="#"
                              data-cls-action="export_profile"
                            >
                              <i className="ti ti-file-export" />
                              Export Profile
                            </a>
                            <a
                              className="dropdown-item"
                              href="#"
                              data-cls-action="archive"
                            >
                              <i className="ti ti-archive" />
                              Archive
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
                  <tr className="dt-detail">
                    <td colSpan={7}>
                      <div className="dt-detail-inner">
                        <div className="row g-4">
                          <div className="col-xl-3 col-md-6">
                            <h4 className="details-heading fs-15 fw-medium">
                              <i className="ti ti-user" />
                              Employee Profile
                            </h4>
                            <div className="d-flex align-items-center gap-2 mb-3">
                              <span className="avatar avatar-md">
                                <img
                                  src="assets/img/profiles/avatar-01.jpg"
                                  className="rounded-circle flex-shrink-0"
                                  alt="Teresa Bru"
                                />
                              </span>
                              <div>
                                <span className="fw-medium d-block fs-13">
                                  Teresa Bru
                                </span>
                                <span className="fs-12 text-muted">
                                  STF-2001 · Admin Officer
                                </span>
                              </div>
                            </div>
                            <h5 className="details-heading fs-15">
                              <i className="ti ti-building" />
                              Employment Details
                            </h5>
                            <ul className="list-unstyled fs-12 mb-0">
                              <li className="d-flex align-items-center justify-content-between py-1">
                                <span className="text-muted">Department</span>
                                <span className="fw-medium">
                                  Administration
                                </span>
                              </li>
                              <li className="d-flex align-items-center justify-content-between py-1">
                                <span className="text-muted">Type</span>
                                <span className="fw-medium">Full Time</span>
                              </li>
                              <li className="d-flex align-items-center justify-content-between py-1">
                                <span className="text-muted">Reports to</span>
                                <span className="fw-medium">
                                  Principal Office
                                </span>
                              </li>
                            </ul>
                          </div>
                          <div className="col-xl-3 col-md-6">
                            <h6 className="details-heading">
                              <i className="ti ti-urgent" />
                              Emergency Contact
                            </h6>
                            <ul className="list-unstyled fs-12 text-muted mb-3">
                              <li className="py-1">
                                <i className="ti ti-user me-1" />
                                Next of Kin · Family
                              </li>
                              <li className="py-1">
                                <i className="ti ti-phone me-1" />
                                +1 546 8548 899
                              </li>
                            </ul>
                            <h6 className="details-heading">
                              <i className="ti ti-school" />
                              Qualifications
                            </h6>
                            <div className="d-flex flex-wrap gap-1">
                              <span className="badge badge-soft-secondary">
                                MBA
                              </span>
                              <span className="badge badge-soft-info">
                                9 yrs experience
                              </span>
                            </div>
                          </div>
                          <div className="col-xl-3 col-md-6">
                            <h6 className="details-heading">
                              <i className="ti ti-files" />
                              Documents
                            </h6>
                            <div className="d-flex flex-wrap gap-1 mb-3">
                              <span className="badge badge-soft-success">
                                ID Proof
                              </span>
                              <span className="badge badge-soft-info">
                                Resume
                              </span>
                              <span className="badge badge-soft-warning">
                                Contract
                              </span>
                              <span className="badge badge-soft-secondary">
                                Certificates
                              </span>
                            </div>
                            <h6 className="details-heading">
                              <i className="ti ti-calendar-check" />
                              Attendance Summary
                            </h6>
                            <ul className="list-unstyled fs-12 mb-0">
                              <li className="d-flex align-items-center justify-content-between py-1">
                                <span className="text-muted">Today</span>
                                <span className="fw-medium">Present</span>
                              </li>
                              <li className="d-flex align-items-center justify-content-between py-1">
                                <span className="text-muted">This Month</span>
                                <span className="fw-medium">21 / 23 days</span>
                              </li>
                            </ul>
                          </div>
                          <div className="col-xl-3 col-md-6">
                            <h6 className="details-heading">
                              <i className="ti ti-award" />
                              Performance Notes
                            </h6>
                            <p className="fs-12 text-muted mb-3">
                              Last review rated Exceeds Expectations. Next
                              review due next quarter.
                            </p>
                            <h6 className="details-heading">
                              <i className="ti ti-notes" />
                              Remarks
                            </h6>
                            <p className="fs-12 text-muted mb-2">
                              Active and in good standing.
                            </p>
                            <div className="d-flex gap-2">
                              <a
                                href="#"
                                className="btn btn-outline-light bg-white btn-sm flex-fill"
                                data-bs-toggle="modal"
                                data-bs-target="#staff_documents"
                              >
                                <i className="ti ti-files me-1" />
                                Docs
                              </a>
                              <a
                                href="#"
                                className="btn btn-primary btn-sm flex-fill"
                                data-bs-toggle="modal"
                                data-bs-target="#staff_profile"
                              >
                                <i className="ti ti-eye me-1" />
                                Profile
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr
                    className="dt-row"
                    data-cls-status="Active"
                    data-search="daniel josua stf-2002 accounts accountant daniel.josua@example.com +1 546 8548 802 main campus full time active male"
                  >
                    <td>
                      <button
                        type="button"
                        className="dt-expand"
                        aria-label="Expand Daniel Josua"
                        aria-expanded="false"
                      >
                        <i className="ti ti-chevron-right" />
                      </button>
                    </td>
                    <td className="dt-pin">
                      <input
                        type="checkbox"
                        className="dt-check row-select-cell"
                        aria-label="Select Daniel Josua"
                      />
                    </td>
                    <td data-cls-col="staff">
                      <div className="dt-user">
                        <a
                          href="#"
                          className="dt-avatar avatar"
                          data-bs-toggle="modal"
                          data-bs-target="#staff_profile"
                        >
                          <img
                            src="assets/img/profiles/avatar-02.jpg"
                            className="rounded-circle flex-shrink-0"
                            alt="Daniel Josua"
                          />
                        </a>
                        <div>
                          <a
                            href="#"
                            className="dt-name"
                            data-bs-toggle="modal"
                            data-bs-target="#staff_profile"
                          >
                            Daniel Josua
                          </a>
                          <div className="dt-sub">
                            <span className="link-primary dt-code">
                              STF-2002
                            </span>
                          </div>
                          <div className="d-flex flex-wrap gap-1 mt-1">
                            <span className="badge badge-soft-info">
                              <i className="ti ti-building me-1" />
                              <span className="dt-dept">Accounts</span>
                            </span>
                            <span className="badge badge-soft-secondary">
                              <i className="ti ti-briefcase me-1" />
                              <span className="dt-desig">Accountant</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td data-cls-col="contact">
                      <ul className="list-unstyled mb-0 fs-12">
                        <li className="py-1 text-muted">
                          <i className="ti ti-mail me-1" />
                          <span className="dt-email">
                            daniel.josua@example.com
                          </span>
                        </li>
                        <li className="py-1 text-muted">
                          <i className="ti ti-phone me-1" />
                          <span className="dt-phone">+1 546 8548 802</span>
                        </li>
                        <li className="py-1">
                          <span className="badge badge-soft-info">
                            <i className="ti ti-map-pin me-1" />
                            <span className="dt-branch">Main Campus</span>
                          </span>{" "}
                          <span className="badge badge-soft-success">
                            <i className="ti ti-id-badge me-1" />
                            <span className="dt-emp">Full Time</span>
                          </span>
                        </li>
                        <li className="py-1 text-muted">
                          <i className="ti ti-calendar-event me-1" />
                          Joined{" "}
                          <span className="fw-medium text-dark dt-joined">
                            18 Feb 2020
                          </span>
                        </li>
                      </ul>
                    </td>
                    <td data-cls-col="work">
                      <ul className="list-unstyled mb-0 fs-12">
                        <li className="py-1 text-muted">
                          <i className="ti ti-user-cog me-1" />
                          Reports to{" "}
                          <span className="fw-medium text-dark">
                            Finance Head
                          </span>
                        </li>
                        <li className="py-1">
                          <span className="badge badge-soft-secondary">
                            <i className="ti ti-school me-1" />
                            M.Com
                          </span>{" "}
                          <span className="badge badge-soft-info">
                            <i className="ti ti-briefcase me-1" />
                            <span className="dt-exp-val">7</span> yrs
                          </span>
                        </li>
                        <li className="py-1">
                          <span className="badge badge-soft-success">
                            <i className="ti ti-calendar-check me-1" />
                            Present
                          </span>
                        </li>
                        <li className="py-1 text-muted">
                          <i className="ti ti-clock me-1" />
                          Last login{" "}
                          <span className="fw-medium text-dark">
                            Today 08:40 AM
                          </span>
                        </li>
                      </ul>
                    </td>
                    <td data-cls-col="status">
                      <span className="dt-pill is-active">
                        <span className="dt-pill-dot" />
                        Active
                      </span>
                    </td>
                    <td>
                      <div className="dt-actions">
                        <a
                          href="#"
                          className="dt-ib"
                          title="View Profile"
                          aria-label="View Profile"
                          data-bs-toggle="modal"
                          data-bs-target="#staff_profile"
                          data-cls-action="view"
                        >
                          <i className="ti ti-eye" />
                        </a>
                        <a
                          href="#"
                          className="dt-ib"
                          title="Edit Staff"
                          aria-label="Edit Staff"
                          data-bs-toggle="modal"
                          data-bs-target="#edit_staff"
                        >
                          <i className="ti ti-edit" />
                        </a>
                        <a
                          href="#"
                          className="dt-ib"
                          title="Attendance History"
                          aria-label="Attendance History"
                          data-bs-toggle="modal"
                          data-bs-target="#attendance_summary"
                          data-cls-action="attendance"
                        >
                          <i className="ti ti-calendar-stats" />
                        </a>
                        <a
                          href="#"
                          className="dt-ib"
                          title="Assign Department"
                          aria-label="Assign Department"
                          data-bs-toggle="modal"
                          data-bs-target="#dept_assign"
                          data-cls-action="assign_dept"
                        >
                          <i className="ti ti-building-community" />
                        </a>
                        <a
                          href="#"
                          className="dt-ib"
                          title="Documents"
                          aria-label="Documents"
                          data-bs-toggle="modal"
                          data-bs-target="#staff_documents"
                          data-cls-action="documents"
                        >
                          <i className="ti ti-files" />
                        </a>
                        <a
                          href="#"
                          className="dt-ib"
                          title="Print Profile"
                          aria-label="Print Profile"
                          data-cls-action="print_profile"
                        >
                          <i className="ti ti-printer" />
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
                              data-bs-toggle="modal"
                              data-bs-target="#staff_profile"
                              data-cls-action="view"
                            >
                              <i className="ti ti-eye" />
                              View Profile
                            </a>
                            <a
                              className="dropdown-item"
                              href="#"
                              data-bs-toggle="modal"
                              data-bs-target="#edit_staff"
                            >
                              <i className="ti ti-edit" />
                              Edit Staff
                            </a>
                            <a
                              className="dropdown-item"
                              href="#"
                              data-bs-toggle="modal"
                              data-bs-target="#attendance_summary"
                              data-cls-action="attendance"
                            >
                              <i className="ti ti-calendar-stats" />
                              Attendance History
                            </a>
                            <a
                              className="dropdown-item"
                              href="staff-payroll.html"
                              data-cls-action="payroll"
                            >
                              <i className="ti ti-cash" />
                              Payroll Details
                            </a>
                            <a
                              className="dropdown-item"
                              href="staff-leaves.html"
                              data-cls-action="leave"
                            >
                              <i className="ti ti-calendar-off" />
                              Leave History
                            </a>
                            <a
                              className="dropdown-item"
                              href="#"
                              data-bs-toggle="modal"
                              data-bs-target="#performance_details"
                              data-cls-action="performance"
                            >
                              <i className="ti ti-award" />
                              Performance Review
                            </a>
                            <hr className="dropdown-divider" />
                            <a
                              className="dropdown-item"
                              href="#"
                              data-bs-toggle="modal"
                              data-bs-target="#dept_assign"
                              data-cls-action="transfer"
                            >
                              <i className="ti ti-transfer" />
                              Transfer Department
                            </a>
                            <a
                              className="dropdown-item text-warning"
                              href="#"
                              data-cls-action="reset_cred"
                            >
                              <i className="ti ti-key" />
                              Reset Credentials
                            </a>
                            <a
                              className="dropdown-item"
                              href="#"
                              data-cls-action="export_profile"
                            >
                              <i className="ti ti-file-export" />
                              Export Profile
                            </a>
                            <a
                              className="dropdown-item"
                              href="#"
                              data-cls-action="archive"
                            >
                              <i className="ti ti-archive" />
                              Archive
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
                  <tr className="dt-detail">
                    <td colSpan={7}>
                      <div className="dt-detail-inner">
                        <div className="row g-4">
                          <div className="col-xl-3 col-md-6">
                            <h6 className="details-heading">
                              <i className="ti ti-user" />
                              Employee Profile
                            </h6>
                            <div className="d-flex align-items-center gap-2 mb-3">
                              <span className="avatar avatar-md">
                                <img
                                  src="assets/img/profiles/avatar-02.jpg"
                                  className="rounded-circle flex-shrink-0"
                                  alt="Daniel Josua"
                                />
                              </span>
                              <div>
                                <span className="fw-medium d-block fs-13">
                                  Daniel Josua
                                </span>
                                <span className="fs-12 text-muted">
                                  STF-2002 · Accountant
                                </span>
                              </div>
                            </div>
                            <h6 className="details-heading">
                              <i className="ti ti-building" />
                              Employment Details
                            </h6>
                            <ul className="list-unstyled fs-12 mb-0">
                              <li className="d-flex align-items-center justify-content-between py-1">
                                <span className="text-muted">Department</span>
                                <span className="fw-medium">Accounts</span>
                              </li>
                              <li className="d-flex align-items-center justify-content-between py-1">
                                <span className="text-muted">Type</span>
                                <span className="fw-medium">Full Time</span>
                              </li>
                              <li className="d-flex align-items-center justify-content-between py-1">
                                <span className="text-muted">Reports to</span>
                                <span className="fw-medium">Finance Head</span>
                              </li>
                            </ul>
                          </div>
                          <div className="col-xl-3 col-md-6">
                            <h6 className="details-heading">
                              <i className="ti ti-urgent" />
                              Emergency Contact
                            </h6>
                            <ul className="list-unstyled fs-12 text-muted mb-3">
                              <li className="py-1">
                                <i className="ti ti-user me-1" />
                                Next of Kin · Family
                              </li>
                              <li className="py-1">
                                <i className="ti ti-phone me-1" />
                                +1 546 8548 899
                              </li>
                            </ul>
                            <h6 className="details-heading">
                              <i className="ti ti-school" />
                              Qualifications
                            </h6>
                            <div className="d-flex flex-wrap gap-1">
                              <span className="badge badge-soft-secondary">
                                M.Com
                              </span>
                              <span className="badge badge-soft-info">
                                7 yrs experience
                              </span>
                            </div>
                          </div>
                          <div className="col-xl-3 col-md-6">
                            <h6 className="details-heading">
                              <i className="ti ti-files" />
                              Documents
                            </h6>
                            <div className="d-flex flex-wrap gap-1 mb-3">
                              <span className="badge badge-soft-success">
                                ID Proof
                              </span>
                              <span className="badge badge-soft-info">
                                Resume
                              </span>
                              <span className="badge badge-soft-warning">
                                Contract
                              </span>
                              <span className="badge badge-soft-secondary">
                                Certificates
                              </span>
                            </div>
                            <h6 className="details-heading">
                              <i className="ti ti-calendar-check" />
                              Attendance Summary
                            </h6>
                            <ul className="list-unstyled fs-12 mb-0">
                              <li className="d-flex align-items-center justify-content-between py-1">
                                <span className="text-muted">Today</span>
                                <span className="fw-medium">Present</span>
                              </li>
                              <li className="d-flex align-items-center justify-content-between py-1">
                                <span className="text-muted">This Month</span>
                                <span className="fw-medium">21 / 23 days</span>
                              </li>
                            </ul>
                          </div>
                          <div className="col-xl-3 col-md-6">
                            <h6 className="details-heading">
                              <i className="ti ti-award" />
                              Performance Notes
                            </h6>
                            <p className="fs-12 text-muted mb-3">
                              Last review rated Exceeds Expectations. Next
                              review due next quarter.
                            </p>
                            <h6 className="details-heading">
                              <i className="ti ti-notes" />
                              Remarks
                            </h6>
                            <p className="fs-12 text-muted mb-2">
                              Active and in good standing.
                            </p>
                            <div className="d-flex gap-2">
                              <a
                                href="#"
                                className="btn btn-outline-light bg-white btn-sm flex-fill"
                                data-bs-toggle="modal"
                                data-bs-target="#staff_documents"
                              >
                                <i className="ti ti-files me-1" />
                                Docs
                              </a>
                              <a
                                href="#"
                                className="btn btn-primary btn-sm flex-fill"
                                data-bs-toggle="modal"
                                data-bs-target="#staff_profile"
                              >
                                <i className="ti ti-eye me-1" />
                                Profile
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr
                    className="dt-row"
                    data-cls-status="On Leave"
                    data-search="emily clark stf-2003 library librarian emily.clark@example.com +1 546 8548 803 north wing full time on leave female"
                  >
                    <td>
                      <button
                        type="button"
                        className="dt-expand"
                        aria-label="Expand Emily Clark"
                        aria-expanded="false"
                      >
                        <i className="ti ti-chevron-right" />
                      </button>
                    </td>
                    <td className="dt-pin">
                      <input
                        type="checkbox"
                        className="dt-check row-select-cell"
                        aria-label="Select Emily Clark"
                      />
                    </td>
                    <td data-cls-col="staff">
                      <div className="dt-user">
                        <a
                          href="#"
                          className="dt-avatar avatar"
                          data-bs-toggle="modal"
                          data-bs-target="#staff_profile"
                        >
                          <img
                            src="assets/img/profiles/avatar-03.jpg"
                            className="rounded-circle flex-shrink-0"
                            alt="Emily Clark"
                          />
                        </a>
                        <div>
                          <a
                            href="#"
                            className="dt-name"
                            data-bs-toggle="modal"
                            data-bs-target="#staff_profile"
                          >
                            Emily Clark
                          </a>
                          <div className="dt-sub">
                            <span className="link-primary dt-code">
                              STF-2003
                            </span>
                          </div>
                          <div className="d-flex flex-wrap gap-1 mt-1">
                            <span className="badge badge-soft-success">
                              <i className="ti ti-building me-1" />
                              <span className="dt-dept">Library</span>
                            </span>
                            <span className="badge badge-soft-secondary">
                              <i className="ti ti-briefcase me-1" />
                              <span className="dt-desig">Librarian</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td data-cls-col="contact">
                      <ul className="list-unstyled mb-0 fs-12">
                        <li className="py-1 text-muted">
                          <i className="ti ti-mail me-1" />
                          <span className="dt-email">
                            emily.clark@example.com
                          </span>
                        </li>
                        <li className="py-1 text-muted">
                          <i className="ti ti-phone me-1" />
                          <span className="dt-phone">+1 546 8548 803</span>
                        </li>
                        <li className="py-1">
                          <span className="badge badge-soft-info">
                            <i className="ti ti-map-pin me-1" />
                            <span className="dt-branch">North Wing</span>
                          </span>{" "}
                          <span className="badge badge-soft-success">
                            <i className="ti ti-id-badge me-1" />
                            <span className="dt-emp">Full Time</span>
                          </span>
                        </li>
                        <li className="py-1 text-muted">
                          <i className="ti ti-calendar-event me-1" />
                          Joined{" "}
                          <span className="fw-medium text-dark dt-joined">
                            05 Oct 2018
                          </span>
                        </li>
                      </ul>
                    </td>
                    <td data-cls-col="work">
                      <ul className="list-unstyled mb-0 fs-12">
                        <li className="py-1 text-muted">
                          <i className="ti ti-user-cog me-1" />
                          Reports to{" "}
                          <span className="fw-medium text-dark">
                            Academic Head
                          </span>
                        </li>
                        <li className="py-1">
                          <span className="badge badge-soft-secondary">
                            <i className="ti ti-school me-1" />
                            MLIS
                          </span>{" "}
                          <span className="badge badge-soft-info">
                            <i className="ti ti-briefcase me-1" />
                            <span className="dt-exp-val">11</span> yrs
                          </span>
                        </li>
                        <li className="py-1">
                          <span className="badge badge-soft-warning">
                            <i className="ti ti-calendar-check me-1" />
                            On Leave
                          </span>
                        </li>
                        <li className="py-1 text-muted">
                          <i className="ti ti-clock me-1" />
                          Last login{" "}
                          <span className="fw-medium text-dark">
                            Yesterday 04:20 PM
                          </span>
                        </li>
                      </ul>
                    </td>
                    <td data-cls-col="status">
                      <span className="dt-pill is-pending">
                        <i className="ti ti-plane-departure" />
                        On Leave
                      </span>
                    </td>
                    <td>
                      <div className="dt-actions">
                        <a
                          href="#"
                          className="dt-ib"
                          title="View Profile"
                          aria-label="View Profile"
                          data-bs-toggle="modal"
                          data-bs-target="#staff_profile"
                          data-cls-action="view"
                        >
                          <i className="ti ti-eye" />
                        </a>
                        <a
                          href="#"
                          className="dt-ib"
                          title="Edit Staff"
                          aria-label="Edit Staff"
                          data-bs-toggle="modal"
                          data-bs-target="#edit_staff"
                        >
                          <i className="ti ti-edit" />
                        </a>
                        <a
                          href="#"
                          className="dt-ib"
                          title="Attendance History"
                          aria-label="Attendance History"
                          data-bs-toggle="modal"
                          data-bs-target="#attendance_summary"
                          data-cls-action="attendance"
                        >
                          <i className="ti ti-calendar-stats" />
                        </a>
                        <a
                          href="#"
                          className="dt-ib"
                          title="Assign Department"
                          aria-label="Assign Department"
                          data-bs-toggle="modal"
                          data-bs-target="#dept_assign"
                          data-cls-action="assign_dept"
                        >
                          <i className="ti ti-building-community" />
                        </a>
                        <a
                          href="#"
                          className="dt-ib"
                          title="Documents"
                          aria-label="Documents"
                          data-bs-toggle="modal"
                          data-bs-target="#staff_documents"
                          data-cls-action="documents"
                        >
                          <i className="ti ti-files" />
                        </a>
                        <a
                          href="#"
                          className="dt-ib"
                          title="Print Profile"
                          aria-label="Print Profile"
                          data-cls-action="print_profile"
                        >
                          <i className="ti ti-printer" />
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
                              data-bs-toggle="modal"
                              data-bs-target="#staff_profile"
                              data-cls-action="view"
                            >
                              <i className="ti ti-eye" />
                              View Profile
                            </a>
                            <a
                              className="dropdown-item"
                              href="#"
                              data-bs-toggle="modal"
                              data-bs-target="#edit_staff"
                            >
                              <i className="ti ti-edit" />
                              Edit Staff
                            </a>
                            <a
                              className="dropdown-item"
                              href="#"
                              data-bs-toggle="modal"
                              data-bs-target="#attendance_summary"
                              data-cls-action="attendance"
                            >
                              <i className="ti ti-calendar-stats" />
                              Attendance History
                            </a>
                            <a
                              className="dropdown-item"
                              href="staff-payroll.html"
                              data-cls-action="payroll"
                            >
                              <i className="ti ti-cash" />
                              Payroll Details
                            </a>
                            <a
                              className="dropdown-item"
                              href="staff-leaves.html"
                              data-cls-action="leave"
                            >
                              <i className="ti ti-calendar-off" />
                              Leave History
                            </a>
                            <a
                              className="dropdown-item"
                              href="#"
                              data-bs-toggle="modal"
                              data-bs-target="#performance_details"
                              data-cls-action="performance"
                            >
                              <i className="ti ti-award" />
                              Performance Review
                            </a>
                            <hr className="dropdown-divider" />
                            <a
                              className="dropdown-item"
                              href="#"
                              data-bs-toggle="modal"
                              data-bs-target="#dept_assign"
                              data-cls-action="transfer"
                            >
                              <i className="ti ti-transfer" />
                              Transfer Department
                            </a>
                            <a
                              className="dropdown-item text-warning"
                              href="#"
                              data-cls-action="reset_cred"
                            >
                              <i className="ti ti-key" />
                              Reset Credentials
                            </a>
                            <a
                              className="dropdown-item"
                              href="#"
                              data-cls-action="export_profile"
                            >
                              <i className="ti ti-file-export" />
                              Export Profile
                            </a>
                            <a
                              className="dropdown-item"
                              href="#"
                              data-cls-action="archive"
                            >
                              <i className="ti ti-archive" />
                              Archive
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
                  <tr className="dt-detail">
                    <td colSpan={7}>
                      <div className="dt-detail-inner">
                        <div className="row g-4">
                          <div className="col-xl-3 col-md-6">
                            <h6 className="details-heading">
                              <i className="ti ti-user" />
                              Employee Profile
                            </h6>
                            <div className="d-flex align-items-center gap-2 mb-3">
                              <span className="avatar avatar-md">
                                <img
                                  src="assets/img/profiles/avatar-03.jpg"
                                  className="rounded-circle flex-shrink-0"
                                  alt="Emily Clark"
                                />
                              </span>
                              <div>
                                <span className="fw-medium d-block fs-13">
                                  Emily Clark
                                </span>
                                <span className="fs-12 text-muted">
                                  STF-2003 · Librarian
                                </span>
                              </div>
                            </div>
                            <h6 className="details-heading">
                              <i className="ti ti-building" />
                              Employment Details
                            </h6>
                            <ul className="list-unstyled fs-12 mb-0">
                              <li className="d-flex align-items-center justify-content-between py-1">
                                <span className="text-muted">Department</span>
                                <span className="fw-medium">Library</span>
                              </li>
                              <li className="d-flex align-items-center justify-content-between py-1">
                                <span className="text-muted">Type</span>
                                <span className="fw-medium">Full Time</span>
                              </li>
                              <li className="d-flex align-items-center justify-content-between py-1">
                                <span className="text-muted">Reports to</span>
                                <span className="fw-medium">Academic Head</span>
                              </li>
                            </ul>
                          </div>
                          <div className="col-xl-3 col-md-6">
                            <h6 className="details-heading">
                              <i className="ti ti-urgent" />
                              Emergency Contact
                            </h6>
                            <ul className="list-unstyled fs-12 text-muted mb-3">
                              <li className="py-1">
                                <i className="ti ti-user me-1" />
                                Next of Kin · Family
                              </li>
                              <li className="py-1">
                                <i className="ti ti-phone me-1" />
                                +1 546 8548 899
                              </li>
                            </ul>
                            <h6 className="details-heading">
                              <i className="ti ti-school" />
                              Qualifications
                            </h6>
                            <div className="d-flex flex-wrap gap-1">
                              <span className="badge badge-soft-secondary">
                                MLIS
                              </span>
                              <span className="badge badge-soft-info">
                                11 yrs experience
                              </span>
                            </div>
                          </div>
                          <div className="col-xl-3 col-md-6">
                            <h6 className="details-heading">
                              <i className="ti ti-files" />
                              Documents
                            </h6>
                            <div className="d-flex flex-wrap gap-1 mb-3">
                              <span className="badge badge-soft-success">
                                ID Proof
                              </span>
                              <span className="badge badge-soft-info">
                                Resume
                              </span>
                              <span className="badge badge-soft-warning">
                                Contract
                              </span>
                              <span className="badge badge-soft-secondary">
                                Certificates
                              </span>
                            </div>
                            <h6 className="details-heading">
                              <i className="ti ti-calendar-check" />
                              Attendance Summary
                            </h6>
                            <ul className="list-unstyled fs-12 mb-0">
                              <li className="d-flex align-items-center justify-content-between py-1">
                                <span className="text-muted">Today</span>
                                <span className="fw-medium">On Leave</span>
                              </li>
                              <li className="d-flex align-items-center justify-content-between py-1">
                                <span className="text-muted">This Month</span>
                                <span className="fw-medium">21 / 23 days</span>
                              </li>
                            </ul>
                          </div>
                          <div className="col-xl-3 col-md-6">
                            <h6 className="details-heading">
                              <i className="ti ti-award" />
                              Performance Notes
                            </h6>
                            <p className="fs-12 text-muted mb-3">
                              Last review rated Outstanding. Next review due
                              next quarter.
                            </p>
                            <h6 className="details-heading">
                              <i className="ti ti-notes" />
                              Remarks
                            </h6>
                            <p className="fs-12 text-muted mb-2">
                              On approved leave; back on the scheduled date.
                            </p>
                            <div className="d-flex gap-2">
                              <a
                                href="#"
                                className="btn btn-outline-light bg-white btn-sm flex-fill"
                                data-bs-toggle="modal"
                                data-bs-target="#staff_documents"
                              >
                                <i className="ti ti-files me-1" />
                                Docs
                              </a>
                              <a
                                href="#"
                                className="btn btn-primary btn-sm flex-fill"
                                data-bs-toggle="modal"
                                data-bs-target="#staff_profile"
                              >
                                <i className="ti ti-eye me-1" />
                                Profile
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr
                    className="dt-row"
                    data-cls-status="Active"
                    data-search="jacob ryan stf-2004 transport transport coordinator jacob.ryan@example.com +1 546 8548 804 main campus contract active male"
                  >
                    <td>
                      <button
                        type="button"
                        className="dt-expand"
                        aria-label="Expand Jacob Ryan"
                        aria-expanded="false"
                      >
                        <i className="ti ti-chevron-right" />
                      </button>
                    </td>
                    <td className="dt-pin">
                      <input
                        type="checkbox"
                        className="dt-check row-select-cell"
                        aria-label="Select Jacob Ryan"
                      />
                    </td>
                    <td data-cls-col="staff">
                      <div className="dt-user">
                        <a
                          href="#"
                          className="dt-avatar avatar"
                          data-bs-toggle="modal"
                          data-bs-target="#staff_profile"
                        >
                          <img
                            src="assets/img/profiles/avatar-04.jpg"
                            className="rounded-circle flex-shrink-0"
                            alt="Jacob Ryan"
                          />
                        </a>
                        <div>
                          <a
                            href="#"
                            className="dt-name"
                            data-bs-toggle="modal"
                            data-bs-target="#staff_profile"
                          >
                            Jacob Ryan
                          </a>
                          <div className="dt-sub">
                            <span className="link-primary dt-code">
                              STF-2004
                            </span>
                          </div>
                          <div className="d-flex flex-wrap gap-1 mt-1">
                            <span className="badge badge-soft-warning">
                              <i className="ti ti-building me-1" />
                              <span className="dt-dept">Transport</span>
                            </span>
                            <span className="badge badge-soft-secondary">
                              <i className="ti ti-briefcase me-1" />
                              <span className="dt-desig">
                                Transport Coordinator
                              </span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td data-cls-col="contact">
                      <ul className="list-unstyled mb-0 fs-12">
                        <li className="py-1 text-muted">
                          <i className="ti ti-mail me-1" />
                          <span className="dt-email">
                            jacob.ryan@example.com
                          </span>
                        </li>
                        <li className="py-1 text-muted">
                          <i className="ti ti-phone me-1" />
                          <span className="dt-phone">+1 546 8548 804</span>
                        </li>
                        <li className="py-1">
                          <span className="badge badge-soft-info">
                            <i className="ti ti-map-pin me-1" />
                            <span className="dt-branch">Main Campus</span>
                          </span>{" "}
                          <span className="badge badge-soft-warning">
                            <i className="ti ti-id-badge me-1" />
                            <span className="dt-emp">Contract</span>
                          </span>
                        </li>
                        <li className="py-1 text-muted">
                          <i className="ti ti-calendar-event me-1" />
                          Joined{" "}
                          <span className="fw-medium text-dark dt-joined">
                            20 May 2021
                          </span>
                        </li>
                      </ul>
                    </td>
                    <td data-cls-col="work">
                      <ul className="list-unstyled mb-0 fs-12">
                        <li className="py-1 text-muted">
                          <i className="ti ti-user-cog me-1" />
                          Reports to{" "}
                          <span className="fw-medium text-dark">
                            Operations Head
                          </span>
                        </li>
                        <li className="py-1">
                          <span className="badge badge-soft-secondary">
                            <i className="ti ti-school me-1" />
                            B.A.
                          </span>{" "}
                          <span className="badge badge-soft-info">
                            <i className="ti ti-briefcase me-1" />
                            <span className="dt-exp-val">5</span> yrs
                          </span>
                        </li>
                        <li className="py-1">
                          <span className="badge badge-soft-success">
                            <i className="ti ti-calendar-check me-1" />
                            Present
                          </span>
                        </li>
                        <li className="py-1 text-muted">
                          <i className="ti ti-clock me-1" />
                          Last login{" "}
                          <span className="fw-medium text-dark">
                            Today 07:55 AM
                          </span>
                        </li>
                      </ul>
                    </td>
                    <td data-cls-col="status">
                      <span className="dt-pill is-active">
                        <span className="dt-pill-dot" />
                        Active
                      </span>
                    </td>
                    <td>
                      <div className="dt-actions">
                        <a
                          href="#"
                          className="dt-ib"
                          title="View Profile"
                          aria-label="View Profile"
                          data-bs-toggle="modal"
                          data-bs-target="#staff_profile"
                          data-cls-action="view"
                        >
                          <i className="ti ti-eye" />
                        </a>
                        <a
                          href="#"
                          className="dt-ib"
                          title="Edit Staff"
                          aria-label="Edit Staff"
                          data-bs-toggle="modal"
                          data-bs-target="#edit_staff"
                        >
                          <i className="ti ti-edit" />
                        </a>
                        <a
                          href="#"
                          className="dt-ib"
                          title="Attendance History"
                          aria-label="Attendance History"
                          data-bs-toggle="modal"
                          data-bs-target="#attendance_summary"
                          data-cls-action="attendance"
                        >
                          <i className="ti ti-calendar-stats" />
                        </a>
                        <a
                          href="#"
                          className="dt-ib"
                          title="Assign Department"
                          aria-label="Assign Department"
                          data-bs-toggle="modal"
                          data-bs-target="#dept_assign"
                          data-cls-action="assign_dept"
                        >
                          <i className="ti ti-building-community" />
                        </a>
                        <a
                          href="#"
                          className="dt-ib"
                          title="Documents"
                          aria-label="Documents"
                          data-bs-toggle="modal"
                          data-bs-target="#staff_documents"
                          data-cls-action="documents"
                        >
                          <i className="ti ti-files" />
                        </a>
                        <a
                          href="#"
                          className="dt-ib"
                          title="Print Profile"
                          aria-label="Print Profile"
                          data-cls-action="print_profile"
                        >
                          <i className="ti ti-printer" />
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
                              data-bs-toggle="modal"
                              data-bs-target="#staff_profile"
                              data-cls-action="view"
                            >
                              <i className="ti ti-eye" />
                              View Profile
                            </a>
                            <a
                              className="dropdown-item"
                              href="#"
                              data-bs-toggle="modal"
                              data-bs-target="#edit_staff"
                            >
                              <i className="ti ti-edit" />
                              Edit Staff
                            </a>
                            <a
                              className="dropdown-item"
                              href="#"
                              data-bs-toggle="modal"
                              data-bs-target="#attendance_summary"
                              data-cls-action="attendance"
                            >
                              <i className="ti ti-calendar-stats" />
                              Attendance History
                            </a>
                            <a
                              className="dropdown-item"
                              href="staff-payroll.html"
                              data-cls-action="payroll"
                            >
                              <i className="ti ti-cash" />
                              Payroll Details
                            </a>
                            <a
                              className="dropdown-item"
                              href="staff-leaves.html"
                              data-cls-action="leave"
                            >
                              <i className="ti ti-calendar-off" />
                              Leave History
                            </a>
                            <a
                              className="dropdown-item"
                              href="#"
                              data-bs-toggle="modal"
                              data-bs-target="#performance_details"
                              data-cls-action="performance"
                            >
                              <i className="ti ti-award" />
                              Performance Review
                            </a>
                            <hr className="dropdown-divider" />
                            <a
                              className="dropdown-item"
                              href="#"
                              data-bs-toggle="modal"
                              data-bs-target="#dept_assign"
                              data-cls-action="transfer"
                            >
                              <i className="ti ti-transfer" />
                              Transfer Department
                            </a>
                            <a
                              className="dropdown-item text-warning"
                              href="#"
                              data-cls-action="reset_cred"
                            >
                              <i className="ti ti-key" />
                              Reset Credentials
                            </a>
                            <a
                              className="dropdown-item"
                              href="#"
                              data-cls-action="export_profile"
                            >
                              <i className="ti ti-file-export" />
                              Export Profile
                            </a>
                            <a
                              className="dropdown-item"
                              href="#"
                              data-cls-action="archive"
                            >
                              <i className="ti ti-archive" />
                              Archive
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
                  <tr className="dt-detail">
                    <td colSpan={7}>
                      <div className="dt-detail-inner">
                        <div className="row g-4">
                          <div className="col-xl-3 col-md-6">
                            <h6 className="details-heading">
                              <i className="ti ti-user" />
                              Employee Profile
                            </h6>
                            <div className="d-flex align-items-center gap-2 mb-3">
                              <span className="avatar avatar-md">
                                <img
                                  src="assets/img/profiles/avatar-04.jpg"
                                  className="rounded-circle flex-shrink-0"
                                  alt="Jacob Ryan"
                                />
                              </span>
                              <div>
                                <span className="fw-medium d-block fs-13">
                                  Jacob Ryan
                                </span>
                                <span className="fs-12 text-muted">
                                  STF-2004 · Transport Coordinator
                                </span>
                              </div>
                            </div>
                            <h6 className="details-heading">
                              <i className="ti ti-building" />
                              Employment Details
                            </h6>
                            <ul className="list-unstyled fs-12 mb-0">
                              <li className="d-flex align-items-center justify-content-between py-1">
                                <span className="text-muted">Department</span>
                                <span className="fw-medium">Transport</span>
                              </li>
                              <li className="d-flex align-items-center justify-content-between py-1">
                                <span className="text-muted">Type</span>
                                <span className="fw-medium">Contract</span>
                              </li>
                              <li className="d-flex align-items-center justify-content-between py-1">
                                <span className="text-muted">Reports to</span>
                                <span className="fw-medium">
                                  Operations Head
                                </span>
                              </li>
                            </ul>
                          </div>
                          <div className="col-xl-3 col-md-6">
                            <h6 className="details-heading">
                              <i className="ti ti-urgent" />
                              Emergency Contact
                            </h6>
                            <ul className="list-unstyled fs-12 text-muted mb-3">
                              <li className="py-1">
                                <i className="ti ti-user me-1" />
                                Next of Kin · Family
                              </li>
                              <li className="py-1">
                                <i className="ti ti-phone me-1" />
                                +1 546 8548 899
                              </li>
                            </ul>
                            <h6 className="details-heading">
                              <i className="ti ti-school" />
                              Qualifications
                            </h6>
                            <div className="d-flex flex-wrap gap-1">
                              <span className="badge badge-soft-secondary">
                                B.A.
                              </span>
                              <span className="badge badge-soft-info">
                                5 yrs experience
                              </span>
                            </div>
                          </div>
                          <div className="col-xl-3 col-md-6">
                            <h6 className="details-heading">
                              <i className="ti ti-files" />
                              Documents
                            </h6>
                            <div className="d-flex flex-wrap gap-1 mb-3">
                              <span className="badge badge-soft-success">
                                ID Proof
                              </span>
                              <span className="badge badge-soft-info">
                                Resume
                              </span>
                              <span className="badge badge-soft-warning">
                                Contract
                              </span>
                              <span className="badge badge-soft-secondary">
                                Certificates
                              </span>
                            </div>
                            <h6 className="details-heading">
                              <i className="ti ti-calendar-check" />
                              Attendance Summary
                            </h6>
                            <ul className="list-unstyled fs-12 mb-0">
                              <li className="d-flex align-items-center justify-content-between py-1">
                                <span className="text-muted">Today</span>
                                <span className="fw-medium">Present</span>
                              </li>
                              <li className="d-flex align-items-center justify-content-between py-1">
                                <span className="text-muted">This Month</span>
                                <span className="fw-medium">21 / 23 days</span>
                              </li>
                            </ul>
                          </div>
                          <div className="col-xl-3 col-md-6">
                            <h6 className="details-heading">
                              <i className="ti ti-award" />
                              Performance Notes
                            </h6>
                            <p className="fs-12 text-muted mb-3">
                              Last review rated Meets Expectations. Next review
                              due next quarter.
                            </p>
                            <h6 className="details-heading">
                              <i className="ti ti-notes" />
                              Remarks
                            </h6>
                            <p className="fs-12 text-muted mb-2">
                              Active and in good standing.
                            </p>
                            <div className="d-flex gap-2">
                              <a
                                href="#"
                                className="btn btn-outline-light bg-white btn-sm flex-fill"
                                data-bs-toggle="modal"
                                data-bs-target="#staff_documents"
                              >
                                <i className="ti ti-files me-1" />
                                Docs
                              </a>
                              <a
                                href="#"
                                className="btn btn-primary btn-sm flex-fill"
                                data-bs-toggle="modal"
                                data-bs-target="#staff_profile"
                              >
                                <i className="ti ti-eye me-1" />
                                Profile
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr
                    className="dt-row"
                    data-cls-status="Probation"
                    data-search="sophia miller stf-2005 front office receptionist sophia.miller@example.com +1 546 8548 805 south wing full time probation female"
                  >
                    <td>
                      <button
                        type="button"
                        className="dt-expand"
                        aria-label="Expand Sophia Miller"
                        aria-expanded="false"
                      >
                        <i className="ti ti-chevron-right" />
                      </button>
                    </td>
                    <td className="dt-pin">
                      <input
                        type="checkbox"
                        className="dt-check row-select-cell"
                        aria-label="Select Sophia Miller"
                      />
                    </td>
                    <td data-cls-col="staff">
                      <div className="dt-user">
                        <a
                          href="#"
                          className="dt-avatar avatar"
                          data-bs-toggle="modal"
                          data-bs-target="#staff_profile"
                        >
                          <img
                            src="assets/img/profiles/avatar-05.jpg"
                            className="rounded-circle flex-shrink-0"
                            alt="Sophia Miller"
                          />
                        </a>
                        <div>
                          <a
                            href="#"
                            className="dt-name"
                            data-bs-toggle="modal"
                            data-bs-target="#staff_profile"
                          >
                            Sophia Miller
                          </a>
                          <div className="dt-sub">
                            <span className="link-primary dt-code">
                              STF-2005
                            </span>
                          </div>
                          <div className="d-flex flex-wrap gap-1 mt-1">
                            <span className="badge badge-soft-purple">
                              <i className="ti ti-building me-1" />
                              <span className="dt-dept">Front Office</span>
                            </span>
                            <span className="badge badge-soft-secondary">
                              <i className="ti ti-briefcase me-1" />
                              <span className="dt-desig">Receptionist</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td data-cls-col="contact">
                      <ul className="list-unstyled mb-0 fs-12">
                        <li className="py-1 text-muted">
                          <i className="ti ti-mail me-1" />
                          <span className="dt-email">
                            sophia.miller@example.com
                          </span>
                        </li>
                        <li className="py-1 text-muted">
                          <i className="ti ti-phone me-1" />
                          <span className="dt-phone">+1 546 8548 805</span>
                        </li>
                        <li className="py-1">
                          <span className="badge badge-soft-info">
                            <i className="ti ti-map-pin me-1" />
                            <span className="dt-branch">South Wing</span>
                          </span>{" "}
                          <span className="badge badge-soft-success">
                            <i className="ti ti-id-badge me-1" />
                            <span className="dt-emp">Full Time</span>
                          </span>
                        </li>
                        <li className="py-1 text-muted">
                          <i className="ti ti-calendar-event me-1" />
                          Joined{" "}
                          <span className="fw-medium text-dark dt-joined">
                            14 Sep 2022
                          </span>
                        </li>
                      </ul>
                    </td>
                    <td data-cls-col="work">
                      <ul className="list-unstyled mb-0 fs-12">
                        <li className="py-1 text-muted">
                          <i className="ti ti-user-cog me-1" />
                          Reports to{" "}
                          <span className="fw-medium text-dark">
                            Admin Officer
                          </span>
                        </li>
                        <li className="py-1">
                          <span className="badge badge-soft-secondary">
                            <i className="ti ti-school me-1" />
                            B.Com
                          </span>{" "}
                          <span className="badge badge-soft-info">
                            <i className="ti ti-briefcase me-1" />
                            <span className="dt-exp-val">3</span> yrs
                          </span>
                        </li>
                        <li className="py-1">
                          <span className="badge badge-soft-success">
                            <i className="ti ti-calendar-check me-1" />
                            Present
                          </span>
                        </li>
                        <li className="py-1 text-muted">
                          <i className="ti ti-clock me-1" />
                          Last login{" "}
                          <span className="fw-medium text-dark">
                            Today 08:05 AM
                          </span>
                        </li>
                      </ul>
                    </td>
                    <td data-cls-col="status">
                      <span className="dt-pill is-new">
                        <i className="ti ti-hourglass" />
                        Probation
                      </span>
                    </td>
                    <td>
                      <div className="dt-actions">
                        <a
                          href="#"
                          className="dt-ib"
                          title="View Profile"
                          aria-label="View Profile"
                          data-bs-toggle="modal"
                          data-bs-target="#staff_profile"
                          data-cls-action="view"
                        >
                          <i className="ti ti-eye" />
                        </a>
                        <a
                          href="#"
                          className="dt-ib"
                          title="Edit Staff"
                          aria-label="Edit Staff"
                          data-bs-toggle="modal"
                          data-bs-target="#edit_staff"
                        >
                          <i className="ti ti-edit" />
                        </a>
                        <a
                          href="#"
                          className="dt-ib"
                          title="Attendance History"
                          aria-label="Attendance History"
                          data-bs-toggle="modal"
                          data-bs-target="#attendance_summary"
                          data-cls-action="attendance"
                        >
                          <i className="ti ti-calendar-stats" />
                        </a>
                        <a
                          href="#"
                          className="dt-ib"
                          title="Assign Department"
                          aria-label="Assign Department"
                          data-bs-toggle="modal"
                          data-bs-target="#dept_assign"
                          data-cls-action="assign_dept"
                        >
                          <i className="ti ti-building-community" />
                        </a>
                        <a
                          href="#"
                          className="dt-ib"
                          title="Documents"
                          aria-label="Documents"
                          data-bs-toggle="modal"
                          data-bs-target="#staff_documents"
                          data-cls-action="documents"
                        >
                          <i className="ti ti-files" />
                        </a>
                        <a
                          href="#"
                          className="dt-ib"
                          title="Print Profile"
                          aria-label="Print Profile"
                          data-cls-action="print_profile"
                        >
                          <i className="ti ti-printer" />
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
                              data-bs-toggle="modal"
                              data-bs-target="#staff_profile"
                              data-cls-action="view"
                            >
                              <i className="ti ti-eye" />
                              View Profile
                            </a>
                            <a
                              className="dropdown-item"
                              href="#"
                              data-bs-toggle="modal"
                              data-bs-target="#edit_staff"
                            >
                              <i className="ti ti-edit" />
                              Edit Staff
                            </a>
                            <a
                              className="dropdown-item"
                              href="#"
                              data-bs-toggle="modal"
                              data-bs-target="#attendance_summary"
                              data-cls-action="attendance"
                            >
                              <i className="ti ti-calendar-stats" />
                              Attendance History
                            </a>
                            <a
                              className="dropdown-item"
                              href="staff-payroll.html"
                              data-cls-action="payroll"
                            >
                              <i className="ti ti-cash" />
                              Payroll Details
                            </a>
                            <a
                              className="dropdown-item"
                              href="staff-leaves.html"
                              data-cls-action="leave"
                            >
                              <i className="ti ti-calendar-off" />
                              Leave History
                            </a>
                            <a
                              className="dropdown-item"
                              href="#"
                              data-bs-toggle="modal"
                              data-bs-target="#performance_details"
                              data-cls-action="performance"
                            >
                              <i className="ti ti-award" />
                              Performance Review
                            </a>
                            <hr className="dropdown-divider" />
                            <a
                              className="dropdown-item"
                              href="#"
                              data-bs-toggle="modal"
                              data-bs-target="#dept_assign"
                              data-cls-action="transfer"
                            >
                              <i className="ti ti-transfer" />
                              Transfer Department
                            </a>
                            <a
                              className="dropdown-item text-warning"
                              href="#"
                              data-cls-action="reset_cred"
                            >
                              <i className="ti ti-key" />
                              Reset Credentials
                            </a>
                            <a
                              className="dropdown-item"
                              href="#"
                              data-cls-action="export_profile"
                            >
                              <i className="ti ti-file-export" />
                              Export Profile
                            </a>
                            <a
                              className="dropdown-item"
                              href="#"
                              data-cls-action="archive"
                            >
                              <i className="ti ti-archive" />
                              Archive
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
                  <tr className="dt-detail">
                    <td colSpan={7}>
                      <div className="dt-detail-inner">
                        <div className="row g-4">
                          <div className="col-xl-3 col-md-6">
                            <h6 className="details-heading">
                              <i className="ti ti-user" />
                              Employee Profile
                            </h6>
                            <div className="d-flex align-items-center gap-2 mb-3">
                              <span className="avatar avatar-md">
                                <img
                                  src="assets/img/profiles/avatar-05.jpg"
                                  className="rounded-circle flex-shrink-0"
                                  alt="Sophia Miller"
                                />
                              </span>
                              <div>
                                <span className="fw-medium d-block fs-13">
                                  Sophia Miller
                                </span>
                                <span className="fs-12 text-muted">
                                  STF-2005 · Receptionist
                                </span>
                              </div>
                            </div>
                            <h6 className="details-heading">
                              <i className="ti ti-building" />
                              Employment Details
                            </h6>
                            <ul className="list-unstyled fs-12 mb-0">
                              <li className="d-flex align-items-center justify-content-between py-1">
                                <span className="text-muted">Department</span>
                                <span className="fw-medium">Front Office</span>
                              </li>
                              <li className="d-flex align-items-center justify-content-between py-1">
                                <span className="text-muted">Type</span>
                                <span className="fw-medium">Full Time</span>
                              </li>
                              <li className="d-flex align-items-center justify-content-between py-1">
                                <span className="text-muted">Reports to</span>
                                <span className="fw-medium">Admin Officer</span>
                              </li>
                            </ul>
                          </div>
                          <div className="col-xl-3 col-md-6">
                            <h6 className="details-heading">
                              <i className="ti ti-urgent" />
                              Emergency Contact
                            </h6>
                            <ul className="list-unstyled fs-12 text-muted mb-3">
                              <li className="py-1">
                                <i className="ti ti-user me-1" />
                                Next of Kin · Family
                              </li>
                              <li className="py-1">
                                <i className="ti ti-phone me-1" />
                                +1 546 8548 899
                              </li>
                            </ul>
                            <h6 className="details-heading">
                              <i className="ti ti-school" />
                              Qualifications
                            </h6>
                            <div className="d-flex flex-wrap gap-1">
                              <span className="badge badge-soft-secondary">
                                B.Com
                              </span>
                              <span className="badge badge-soft-info">
                                3 yrs experience
                              </span>
                            </div>
                          </div>
                          <div className="col-xl-3 col-md-6">
                            <h6 className="details-heading">
                              <i className="ti ti-files" />
                              Documents
                            </h6>
                            <div className="d-flex flex-wrap gap-1 mb-3">
                              <span className="badge badge-soft-success">
                                ID Proof
                              </span>
                              <span className="badge badge-soft-info">
                                Resume
                              </span>
                              <span className="badge badge-soft-warning">
                                Contract
                              </span>
                              <span className="badge badge-soft-secondary">
                                Certificates
                              </span>
                            </div>
                            <h6 className="details-heading">
                              <i className="ti ti-calendar-check" />
                              Attendance Summary
                            </h6>
                            <ul className="list-unstyled fs-12 mb-0">
                              <li className="d-flex align-items-center justify-content-between py-1">
                                <span className="text-muted">Today</span>
                                <span className="fw-medium">Present</span>
                              </li>
                              <li className="d-flex align-items-center justify-content-between py-1">
                                <span className="text-muted">This Month</span>
                                <span className="fw-medium">21 / 23 days</span>
                              </li>
                            </ul>
                          </div>
                          <div className="col-xl-3 col-md-6">
                            <h6 className="details-heading">
                              <i className="ti ti-award" />
                              Performance Notes
                            </h6>
                            <p className="fs-12 text-muted mb-3">
                              Last review rated Meets Expectations. Next review
                              due next quarter.
                            </p>
                            <h6 className="details-heading">
                              <i className="ti ti-notes" />
                              Remarks
                            </h6>
                            <p className="fs-12 text-muted mb-2">
                              On probation — confirmation review pending.
                            </p>
                            <div className="d-flex gap-2">
                              <a
                                href="#"
                                className="btn btn-outline-light bg-white btn-sm flex-fill"
                                data-bs-toggle="modal"
                                data-bs-target="#staff_documents"
                              >
                                <i className="ti ti-files me-1" />
                                Docs
                              </a>
                              <a
                                href="#"
                                className="btn btn-primary btn-sm flex-fill"
                                data-bs-toggle="modal"
                                data-bs-target="#staff_profile"
                              >
                                <i className="ti ti-eye me-1" />
                                Profile
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr
                    className="dt-row"
                    data-cls-status="Active"
                    data-search="michael scott stf-2006 it support system administrator michael.scott@example.com +1 546 8548 806 main campus full time active male"
                  >
                    <td>
                      <button
                        type="button"
                        className="dt-expand"
                        aria-label="Expand Michael Scott"
                        aria-expanded="false"
                      >
                        <i className="ti ti-chevron-right" />
                      </button>
                    </td>
                    <td className="dt-pin">
                      <input
                        type="checkbox"
                        className="dt-check row-select-cell"
                        aria-label="Select Michael Scott"
                      />
                    </td>
                    <td data-cls-col="staff">
                      <div className="dt-user">
                        <a
                          href="#"
                          className="dt-avatar avatar"
                          data-bs-toggle="modal"
                          data-bs-target="#staff_profile"
                        >
                          <img
                            src="assets/img/profiles/avatar-06.jpg"
                            className="rounded-circle flex-shrink-0"
                            alt="Michael Scott"
                          />
                        </a>
                        <div>
                          <a
                            href="#"
                            className="dt-name"
                            data-bs-toggle="modal"
                            data-bs-target="#staff_profile"
                          >
                            Michael Scott
                          </a>
                          <div className="dt-sub">
                            <span className="link-primary dt-code">
                              STF-2006
                            </span>
                          </div>
                          <div className="d-flex flex-wrap gap-1 mt-1">
                            <span className="badge badge-soft-teal">
                              <i className="ti ti-building me-1" />
                              <span className="dt-dept">IT Support</span>
                            </span>
                            <span className="badge badge-soft-secondary">
                              <i className="ti ti-briefcase me-1" />
                              <span className="dt-desig">
                                System Administrator
                              </span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td data-cls-col="contact">
                      <ul className="list-unstyled mb-0 fs-12">
                        <li className="py-1 text-muted">
                          <i className="ti ti-mail me-1" />
                          <span className="dt-email">
                            michael.scott@example.com
                          </span>
                        </li>
                        <li className="py-1 text-muted">
                          <i className="ti ti-phone me-1" />
                          <span className="dt-phone">+1 546 8548 806</span>
                        </li>
                        <li className="py-1">
                          <span className="badge badge-soft-info">
                            <i className="ti ti-map-pin me-1" />
                            <span className="dt-branch">Main Campus</span>
                          </span>{" "}
                          <span className="badge badge-soft-success">
                            <i className="ti ti-id-badge me-1" />
                            <span className="dt-emp">Full Time</span>
                          </span>
                        </li>
                        <li className="py-1 text-muted">
                          <i className="ti ti-calendar-event me-1" />
                          Joined{" "}
                          <span className="fw-medium text-dark dt-joined">
                            03 Jan 2017
                          </span>
                        </li>
                      </ul>
                    </td>
                    <td data-cls-col="work">
                      <ul className="list-unstyled mb-0 fs-12">
                        <li className="py-1 text-muted">
                          <i className="ti ti-user-cog me-1" />
                          Reports to{" "}
                          <span className="fw-medium text-dark">IT Head</span>
                        </li>
                        <li className="py-1">
                          <span className="badge badge-soft-secondary">
                            <i className="ti ti-school me-1" />
                            B.Tech
                          </span>{" "}
                          <span className="badge badge-soft-info">
                            <i className="ti ti-briefcase me-1" />
                            <span className="dt-exp-val">14</span> yrs
                          </span>
                        </li>
                        <li className="py-1">
                          <span className="badge badge-soft-success">
                            <i className="ti ti-calendar-check me-1" />
                            Present
                          </span>
                        </li>
                        <li className="py-1 text-muted">
                          <i className="ti ti-clock me-1" />
                          Last login{" "}
                          <span className="fw-medium text-dark">
                            Today 07:30 AM
                          </span>
                        </li>
                      </ul>
                    </td>
                    <td data-cls-col="status">
                      <span className="dt-pill is-active">
                        <span className="dt-pill-dot" />
                        Active
                      </span>
                    </td>
                    <td>
                      <div className="dt-actions">
                        <a
                          href="#"
                          className="dt-ib"
                          title="View Profile"
                          aria-label="View Profile"
                          data-bs-toggle="modal"
                          data-bs-target="#staff_profile"
                          data-cls-action="view"
                        >
                          <i className="ti ti-eye" />
                        </a>
                        <a
                          href="#"
                          className="dt-ib"
                          title="Edit Staff"
                          aria-label="Edit Staff"
                          data-bs-toggle="modal"
                          data-bs-target="#edit_staff"
                        >
                          <i className="ti ti-edit" />
                        </a>
                        <a
                          href="#"
                          className="dt-ib"
                          title="Attendance History"
                          aria-label="Attendance History"
                          data-bs-toggle="modal"
                          data-bs-target="#attendance_summary"
                          data-cls-action="attendance"
                        >
                          <i className="ti ti-calendar-stats" />
                        </a>
                        <a
                          href="#"
                          className="dt-ib"
                          title="Assign Department"
                          aria-label="Assign Department"
                          data-bs-toggle="modal"
                          data-bs-target="#dept_assign"
                          data-cls-action="assign_dept"
                        >
                          <i className="ti ti-building-community" />
                        </a>
                        <a
                          href="#"
                          className="dt-ib"
                          title="Documents"
                          aria-label="Documents"
                          data-bs-toggle="modal"
                          data-bs-target="#staff_documents"
                          data-cls-action="documents"
                        >
                          <i className="ti ti-files" />
                        </a>
                        <a
                          href="#"
                          className="dt-ib"
                          title="Print Profile"
                          aria-label="Print Profile"
                          data-cls-action="print_profile"
                        >
                          <i className="ti ti-printer" />
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
                              data-bs-toggle="modal"
                              data-bs-target="#staff_profile"
                              data-cls-action="view"
                            >
                              <i className="ti ti-eye" />
                              View Profile
                            </a>
                            <a
                              className="dropdown-item"
                              href="#"
                              data-bs-toggle="modal"
                              data-bs-target="#edit_staff"
                            >
                              <i className="ti ti-edit" />
                              Edit Staff
                            </a>
                            <a
                              className="dropdown-item"
                              href="#"
                              data-bs-toggle="modal"
                              data-bs-target="#attendance_summary"
                              data-cls-action="attendance"
                            >
                              <i className="ti ti-calendar-stats" />
                              Attendance History
                            </a>
                            <a
                              className="dropdown-item"
                              href="staff-payroll.html"
                              data-cls-action="payroll"
                            >
                              <i className="ti ti-cash" />
                              Payroll Details
                            </a>
                            <a
                              className="dropdown-item"
                              href="staff-leaves.html"
                              data-cls-action="leave"
                            >
                              <i className="ti ti-calendar-off" />
                              Leave History
                            </a>
                            <a
                              className="dropdown-item"
                              href="#"
                              data-bs-toggle="modal"
                              data-bs-target="#performance_details"
                              data-cls-action="performance"
                            >
                              <i className="ti ti-award" />
                              Performance Review
                            </a>
                            <hr className="dropdown-divider" />
                            <a
                              className="dropdown-item"
                              href="#"
                              data-bs-toggle="modal"
                              data-bs-target="#dept_assign"
                              data-cls-action="transfer"
                            >
                              <i className="ti ti-transfer" />
                              Transfer Department
                            </a>
                            <a
                              className="dropdown-item text-warning"
                              href="#"
                              data-cls-action="reset_cred"
                            >
                              <i className="ti ti-key" />
                              Reset Credentials
                            </a>
                            <a
                              className="dropdown-item"
                              href="#"
                              data-cls-action="export_profile"
                            >
                              <i className="ti ti-file-export" />
                              Export Profile
                            </a>
                            <a
                              className="dropdown-item"
                              href="#"
                              data-cls-action="archive"
                            >
                              <i className="ti ti-archive" />
                              Archive
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
                  <tr className="dt-detail">
                    <td colSpan={7}>
                      <div className="dt-detail-inner">
                        <div className="row g-4">
                          <div className="col-xl-3 col-md-6">
                            <h6 className="details-heading">
                              <i className="ti ti-user" />
                              Employee Profile
                            </h6>
                            <div className="d-flex align-items-center gap-2 mb-3">
                              <span className="avatar avatar-md">
                                <img
                                  src="assets/img/profiles/avatar-06.jpg"
                                  className="rounded-circle flex-shrink-0"
                                  alt="Michael Scott"
                                />
                              </span>
                              <div>
                                <span className="fw-medium d-block fs-13">
                                  Michael Scott
                                </span>
                                <span className="fs-12 text-muted">
                                  STF-2006 · System Administrator
                                </span>
                              </div>
                            </div>
                            <h6 className="details-heading">
                              <i className="ti ti-building" />
                              Employment Details
                            </h6>
                            <ul className="list-unstyled fs-12 mb-0">
                              <li className="d-flex align-items-center justify-content-between py-1">
                                <span className="text-muted">Department</span>
                                <span className="fw-medium">IT Support</span>
                              </li>
                              <li className="d-flex align-items-center justify-content-between py-1">
                                <span className="text-muted">Type</span>
                                <span className="fw-medium">Full Time</span>
                              </li>
                              <li className="d-flex align-items-center justify-content-between py-1">
                                <span className="text-muted">Reports to</span>
                                <span className="fw-medium">IT Head</span>
                              </li>
                            </ul>
                          </div>
                          <div className="col-xl-3 col-md-6">
                            <h6 className="details-heading">
                              <i className="ti ti-urgent" />
                              Emergency Contact
                            </h6>
                            <ul className="list-unstyled fs-12 text-muted mb-3">
                              <li className="py-1">
                                <i className="ti ti-user me-1" />
                                Next of Kin · Family
                              </li>
                              <li className="py-1">
                                <i className="ti ti-phone me-1" />
                                +1 546 8548 899
                              </li>
                            </ul>
                            <h6 className="details-heading">
                              <i className="ti ti-school" />
                              Qualifications
                            </h6>
                            <div className="d-flex flex-wrap gap-1">
                              <span className="badge badge-soft-secondary">
                                B.Tech
                              </span>
                              <span className="badge badge-soft-info">
                                14 yrs experience
                              </span>
                            </div>
                          </div>
                          <div className="col-xl-3 col-md-6">
                            <h6 className="details-heading">
                              <i className="ti ti-files" />
                              Documents
                            </h6>
                            <div className="d-flex flex-wrap gap-1 mb-3">
                              <span className="badge badge-soft-success">
                                ID Proof
                              </span>
                              <span className="badge badge-soft-info">
                                Resume
                              </span>
                              <span className="badge badge-soft-warning">
                                Contract
                              </span>
                              <span className="badge badge-soft-secondary">
                                Certificates
                              </span>
                            </div>
                            <h6 className="details-heading">
                              <i className="ti ti-calendar-check" />
                              Attendance Summary
                            </h6>
                            <ul className="list-unstyled fs-12 mb-0">
                              <li className="d-flex align-items-center justify-content-between py-1">
                                <span className="text-muted">Today</span>
                                <span className="fw-medium">Present</span>
                              </li>
                              <li className="d-flex align-items-center justify-content-between py-1">
                                <span className="text-muted">This Month</span>
                                <span className="fw-medium">21 / 23 days</span>
                              </li>
                            </ul>
                          </div>
                          <div className="col-xl-3 col-md-6">
                            <h6 className="details-heading">
                              <i className="ti ti-award" />
                              Performance Notes
                            </h6>
                            <p className="fs-12 text-muted mb-3">
                              Last review rated Outstanding. Next review due
                              next quarter.
                            </p>
                            <h6 className="details-heading">
                              <i className="ti ti-notes" />
                              Remarks
                            </h6>
                            <p className="fs-12 text-muted mb-2">
                              Active and in good standing.
                            </p>
                            <div className="d-flex gap-2">
                              <a
                                href="#"
                                className="btn btn-outline-light bg-white btn-sm flex-fill"
                                data-bs-toggle="modal"
                                data-bs-target="#staff_documents"
                              >
                                <i className="ti ti-files me-1" />
                                Docs
                              </a>
                              <a
                                href="#"
                                className="btn btn-primary btn-sm flex-fill"
                                data-bs-toggle="modal"
                                data-bs-target="#staff_profile"
                              >
                                <i className="ti ti-eye me-1" />
                                Profile
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr
                    className="dt-row"
                    data-cls-status="Active"
                    data-search="olivia turner stf-2007 housekeeping supervisor olivia.turner@example.com +1 546 8548 807 north wing part time active female"
                  >
                    <td>
                      <button
                        type="button"
                        className="dt-expand"
                        aria-label="Expand Olivia Turner"
                        aria-expanded="false"
                      >
                        <i className="ti ti-chevron-right" />
                      </button>
                    </td>
                    <td className="dt-pin">
                      <input
                        type="checkbox"
                        className="dt-check row-select-cell"
                        aria-label="Select Olivia Turner"
                      />
                    </td>
                    <td data-cls-col="staff">
                      <div className="dt-user">
                        <a
                          href="#"
                          className="dt-avatar avatar"
                          data-bs-toggle="modal"
                          data-bs-target="#staff_profile"
                        >
                          <img
                            src="assets/img/profiles/avatar-07.jpg"
                            className="rounded-circle flex-shrink-0"
                            alt="Olivia Turner"
                          />
                        </a>
                        <div>
                          <a
                            href="#"
                            className="dt-name"
                            data-bs-toggle="modal"
                            data-bs-target="#staff_profile"
                          >
                            Olivia Turner
                          </a>
                          <div className="dt-sub">
                            <span className="link-primary dt-code">
                              STF-2007
                            </span>
                          </div>
                          <div className="d-flex flex-wrap gap-1 mt-1">
                            <span className="badge badge-soft-pink">
                              <i className="ti ti-building me-1" />
                              <span className="dt-dept">Housekeeping</span>
                            </span>
                            <span className="badge badge-soft-secondary">
                              <i className="ti ti-briefcase me-1" />
                              <span className="dt-desig">Supervisor</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td data-cls-col="contact">
                      <ul className="list-unstyled mb-0 fs-12">
                        <li className="py-1 text-muted">
                          <i className="ti ti-mail me-1" />
                          <span className="dt-email">
                            olivia.turner@example.com
                          </span>
                        </li>
                        <li className="py-1 text-muted">
                          <i className="ti ti-phone me-1" />
                          <span className="dt-phone">+1 546 8548 807</span>
                        </li>
                        <li className="py-1">
                          <span className="badge badge-soft-info">
                            <i className="ti ti-map-pin me-1" />
                            <span className="dt-branch">North Wing</span>
                          </span>{" "}
                          <span className="badge badge-soft-secondary">
                            <i className="ti ti-id-badge me-1" />
                            <span className="dt-emp">Part Time</span>
                          </span>
                        </li>
                        <li className="py-1 text-muted">
                          <i className="ti ti-calendar-event me-1" />
                          Joined{" "}
                          <span className="fw-medium text-dark dt-joined">
                            01 Mar 2023
                          </span>
                        </li>
                      </ul>
                    </td>
                    <td data-cls-col="work">
                      <ul className="list-unstyled mb-0 fs-12">
                        <li className="py-1 text-muted">
                          <i className="ti ti-user-cog me-1" />
                          Reports to{" "}
                          <span className="fw-medium text-dark">
                            Operations Head
                          </span>
                        </li>
                        <li className="py-1">
                          <span className="badge badge-soft-secondary">
                            <i className="ti ti-school me-1" />
                            Diploma
                          </span>{" "}
                          <span className="badge badge-soft-info">
                            <i className="ti ti-briefcase me-1" />
                            <span className="dt-exp-val">4</span> yrs
                          </span>
                        </li>
                        <li className="py-1">
                          <span className="badge badge-soft-danger">
                            <i className="ti ti-calendar-check me-1" />
                            Absent
                          </span>
                        </li>
                        <li className="py-1 text-muted">
                          <i className="ti ti-clock me-1" />
                          Last login{" "}
                          <span className="fw-medium text-dark">
                            22 Jul 2026 05:10 PM
                          </span>
                        </li>
                      </ul>
                    </td>
                    <td data-cls-col="status">
                      <span className="dt-pill is-active">
                        <span className="dt-pill-dot" />
                        Active
                      </span>
                    </td>
                    <td>
                      <div className="dt-actions">
                        <a
                          href="#"
                          className="dt-ib"
                          title="View Profile"
                          aria-label="View Profile"
                          data-bs-toggle="modal"
                          data-bs-target="#staff_profile"
                          data-cls-action="view"
                        >
                          <i className="ti ti-eye" />
                        </a>
                        <a
                          href="#"
                          className="dt-ib"
                          title="Edit Staff"
                          aria-label="Edit Staff"
                          data-bs-toggle="modal"
                          data-bs-target="#edit_staff"
                        >
                          <i className="ti ti-edit" />
                        </a>
                        <a
                          href="#"
                          className="dt-ib"
                          title="Attendance History"
                          aria-label="Attendance History"
                          data-bs-toggle="modal"
                          data-bs-target="#attendance_summary"
                          data-cls-action="attendance"
                        >
                          <i className="ti ti-calendar-stats" />
                        </a>
                        <a
                          href="#"
                          className="dt-ib"
                          title="Assign Department"
                          aria-label="Assign Department"
                          data-bs-toggle="modal"
                          data-bs-target="#dept_assign"
                          data-cls-action="assign_dept"
                        >
                          <i className="ti ti-building-community" />
                        </a>
                        <a
                          href="#"
                          className="dt-ib"
                          title="Documents"
                          aria-label="Documents"
                          data-bs-toggle="modal"
                          data-bs-target="#staff_documents"
                          data-cls-action="documents"
                        >
                          <i className="ti ti-files" />
                        </a>
                        <a
                          href="#"
                          className="dt-ib"
                          title="Print Profile"
                          aria-label="Print Profile"
                          data-cls-action="print_profile"
                        >
                          <i className="ti ti-printer" />
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
                              data-bs-toggle="modal"
                              data-bs-target="#staff_profile"
                              data-cls-action="view"
                            >
                              <i className="ti ti-eye" />
                              View Profile
                            </a>
                            <a
                              className="dropdown-item"
                              href="#"
                              data-bs-toggle="modal"
                              data-bs-target="#edit_staff"
                            >
                              <i className="ti ti-edit" />
                              Edit Staff
                            </a>
                            <a
                              className="dropdown-item"
                              href="#"
                              data-bs-toggle="modal"
                              data-bs-target="#attendance_summary"
                              data-cls-action="attendance"
                            >
                              <i className="ti ti-calendar-stats" />
                              Attendance History
                            </a>
                            <a
                              className="dropdown-item"
                              href="staff-payroll.html"
                              data-cls-action="payroll"
                            >
                              <i className="ti ti-cash" />
                              Payroll Details
                            </a>
                            <a
                              className="dropdown-item"
                              href="staff-leaves.html"
                              data-cls-action="leave"
                            >
                              <i className="ti ti-calendar-off" />
                              Leave History
                            </a>
                            <a
                              className="dropdown-item"
                              href="#"
                              data-bs-toggle="modal"
                              data-bs-target="#performance_details"
                              data-cls-action="performance"
                            >
                              <i className="ti ti-award" />
                              Performance Review
                            </a>
                            <hr className="dropdown-divider" />
                            <a
                              className="dropdown-item"
                              href="#"
                              data-bs-toggle="modal"
                              data-bs-target="#dept_assign"
                              data-cls-action="transfer"
                            >
                              <i className="ti ti-transfer" />
                              Transfer Department
                            </a>
                            <a
                              className="dropdown-item text-warning"
                              href="#"
                              data-cls-action="reset_cred"
                            >
                              <i className="ti ti-key" />
                              Reset Credentials
                            </a>
                            <a
                              className="dropdown-item"
                              href="#"
                              data-cls-action="export_profile"
                            >
                              <i className="ti ti-file-export" />
                              Export Profile
                            </a>
                            <a
                              className="dropdown-item"
                              href="#"
                              data-cls-action="archive"
                            >
                              <i className="ti ti-archive" />
                              Archive
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
                  <tr className="dt-detail">
                    <td colSpan={7}>
                      <div className="dt-detail-inner">
                        <div className="row g-4">
                          <div className="col-xl-3 col-md-6">
                            <h6 className="details-heading">
                              <i className="ti ti-user" />
                              Employee Profile
                            </h6>
                            <div className="d-flex align-items-center gap-2 mb-3">
                              <span className="avatar avatar-md">
                                <img
                                  src="assets/img/profiles/avatar-07.jpg"
                                  className="rounded-circle flex-shrink-0"
                                  alt="Olivia Turner"
                                />
                              </span>
                              <div>
                                <span className="fw-medium d-block fs-13">
                                  Olivia Turner
                                </span>
                                <span className="fs-12 text-muted">
                                  STF-2007 · Supervisor
                                </span>
                              </div>
                            </div>
                            <h6 className="details-heading">
                              <i className="ti ti-building" />
                              Employment Details
                            </h6>
                            <ul className="list-unstyled fs-12 mb-0">
                              <li className="d-flex align-items-center justify-content-between py-1">
                                <span className="text-muted">Department</span>
                                <span className="fw-medium">Housekeeping</span>
                              </li>
                              <li className="d-flex align-items-center justify-content-between py-1">
                                <span className="text-muted">Type</span>
                                <span className="fw-medium">Part Time</span>
                              </li>
                              <li className="d-flex align-items-center justify-content-between py-1">
                                <span className="text-muted">Reports to</span>
                                <span className="fw-medium">
                                  Operations Head
                                </span>
                              </li>
                            </ul>
                          </div>
                          <div className="col-xl-3 col-md-6">
                            <h6 className="details-heading">
                              <i className="ti ti-urgent" />
                              Emergency Contact
                            </h6>
                            <ul className="list-unstyled fs-12 text-muted mb-3">
                              <li className="py-1">
                                <i className="ti ti-user me-1" />
                                Next of Kin · Family
                              </li>
                              <li className="py-1">
                                <i className="ti ti-phone me-1" />
                                +1 546 8548 899
                              </li>
                            </ul>
                            <h6 className="details-heading">
                              <i className="ti ti-school" />
                              Qualifications
                            </h6>
                            <div className="d-flex flex-wrap gap-1">
                              <span className="badge badge-soft-secondary">
                                Diploma
                              </span>
                              <span className="badge badge-soft-info">
                                4 yrs experience
                              </span>
                            </div>
                          </div>
                          <div className="col-xl-3 col-md-6">
                            <h6 className="details-heading">
                              <i className="ti ti-files" />
                              Documents
                            </h6>
                            <div className="d-flex flex-wrap gap-1 mb-3">
                              <span className="badge badge-soft-success">
                                ID Proof
                              </span>
                              <span className="badge badge-soft-info">
                                Resume
                              </span>
                              <span className="badge badge-soft-warning">
                                Contract
                              </span>
                              <span className="badge badge-soft-secondary">
                                Certificates
                              </span>
                            </div>
                            <h6 className="details-heading">
                              <i className="ti ti-calendar-check" />
                              Attendance Summary
                            </h6>
                            <ul className="list-unstyled fs-12 mb-0">
                              <li className="d-flex align-items-center justify-content-between py-1">
                                <span className="text-muted">Today</span>
                                <span className="fw-medium">Absent</span>
                              </li>
                              <li className="d-flex align-items-center justify-content-between py-1">
                                <span className="text-muted">This Month</span>
                                <span className="fw-medium">21 / 23 days</span>
                              </li>
                            </ul>
                          </div>
                          <div className="col-xl-3 col-md-6">
                            <h6 className="details-heading">
                              <i className="ti ti-award" />
                              Performance Notes
                            </h6>
                            <p className="fs-12 text-muted mb-3">
                              Last review rated Meets Expectations. Next review
                              due next quarter.
                            </p>
                            <h6 className="details-heading">
                              <i className="ti ti-notes" />
                              Remarks
                            </h6>
                            <p className="fs-12 text-muted mb-2">
                              Active and in good standing.
                            </p>
                            <div className="d-flex gap-2">
                              <a
                                href="#"
                                className="btn btn-outline-light bg-white btn-sm flex-fill"
                                data-bs-toggle="modal"
                                data-bs-target="#staff_documents"
                              >
                                <i className="ti ti-files me-1" />
                                Docs
                              </a>
                              <a
                                href="#"
                                className="btn btn-primary btn-sm flex-fill"
                                data-bs-toggle="modal"
                                data-bs-target="#staff_profile"
                              >
                                <i className="ti ti-eye me-1" />
                                Profile
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr
                    className="dt-row"
                    data-cls-status="Active"
                    data-search="william adams stf-2008 accounts cashier william.adams@example.com +1 546 8548 808 main campus full time active male"
                  >
                    <td>
                      <button
                        type="button"
                        className="dt-expand"
                        aria-label="Expand William Adams"
                        aria-expanded="false"
                      >
                        <i className="ti ti-chevron-right" />
                      </button>
                    </td>
                    <td className="dt-pin">
                      <input
                        type="checkbox"
                        className="dt-check row-select-cell"
                        aria-label="Select William Adams"
                      />
                    </td>
                    <td data-cls-col="staff">
                      <div className="dt-user">
                        <a
                          href="#"
                          className="dt-avatar avatar"
                          data-bs-toggle="modal"
                          data-bs-target="#staff_profile"
                        >
                          <img
                            src="assets/img/profiles/avatar-08.jpg"
                            className="rounded-circle flex-shrink-0"
                            alt="William Adams"
                          />
                        </a>
                        <div>
                          <a
                            href="#"
                            className="dt-name"
                            data-bs-toggle="modal"
                            data-bs-target="#staff_profile"
                          >
                            William Adams
                          </a>
                          <div className="dt-sub">
                            <span className="link-primary dt-code">
                              STF-2008
                            </span>
                          </div>
                          <div className="d-flex flex-wrap gap-1 mt-1">
                            <span className="badge badge-soft-secondary">
                              <i className="ti ti-building me-1" />
                              <span className="dt-dept">Accounts</span>
                            </span>
                            <span className="badge badge-soft-secondary">
                              <i className="ti ti-briefcase me-1" />
                              <span className="dt-desig">Cashier</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td data-cls-col="contact">
                      <ul className="list-unstyled mb-0 fs-12">
                        <li className="py-1 text-muted">
                          <i className="ti ti-mail me-1" />
                          <span className="dt-email">
                            william.adams@example.com
                          </span>
                        </li>
                        <li className="py-1 text-muted">
                          <i className="ti ti-phone me-1" />
                          <span className="dt-phone">+1 546 8548 808</span>
                        </li>
                        <li className="py-1">
                          <span className="badge badge-soft-info">
                            <i className="ti ti-map-pin me-1" />
                            <span className="dt-branch">Main Campus</span>
                          </span>{" "}
                          <span className="badge badge-soft-success">
                            <i className="ti ti-id-badge me-1" />
                            <span className="dt-emp">Full Time</span>
                          </span>
                        </li>
                        <li className="py-1 text-muted">
                          <i className="ti ti-calendar-event me-1" />
                          Joined{" "}
                          <span className="fw-medium text-dark dt-joined">
                            12 Jul 2015
                          </span>
                        </li>
                      </ul>
                    </td>
                    <td data-cls-col="work">
                      <ul className="list-unstyled mb-0 fs-12">
                        <li className="py-1 text-muted">
                          <i className="ti ti-user-cog me-1" />
                          Reports to{" "}
                          <span className="fw-medium text-dark">
                            Finance Head
                          </span>
                        </li>
                        <li className="py-1">
                          <span className="badge badge-soft-secondary">
                            <i className="ti ti-school me-1" />
                            B.Com
                          </span>{" "}
                          <span className="badge badge-soft-info">
                            <i className="ti ti-briefcase me-1" />
                            <span className="dt-exp-val">15</span> yrs
                          </span>
                        </li>
                        <li className="py-1">
                          <span className="badge badge-soft-success">
                            <i className="ti ti-calendar-check me-1" />
                            Present
                          </span>
                        </li>
                        <li className="py-1 text-muted">
                          <i className="ti ti-clock me-1" />
                          Last login{" "}
                          <span className="fw-medium text-dark">
                            Today 08:22 AM
                          </span>
                        </li>
                      </ul>
                    </td>
                    <td data-cls-col="status">
                      <span className="dt-pill is-active">
                        <span className="dt-pill-dot" />
                        Active
                      </span>
                    </td>
                    <td>
                      <div className="dt-actions">
                        <a
                          href="#"
                          className="dt-ib"
                          title="View Profile"
                          aria-label="View Profile"
                          data-bs-toggle="modal"
                          data-bs-target="#staff_profile"
                          data-cls-action="view"
                        >
                          <i className="ti ti-eye" />
                        </a>
                        <a
                          href="#"
                          className="dt-ib"
                          title="Edit Staff"
                          aria-label="Edit Staff"
                          data-bs-toggle="modal"
                          data-bs-target="#edit_staff"
                        >
                          <i className="ti ti-edit" />
                        </a>
                        <a
                          href="#"
                          className="dt-ib"
                          title="Attendance History"
                          aria-label="Attendance History"
                          data-bs-toggle="modal"
                          data-bs-target="#attendance_summary"
                          data-cls-action="attendance"
                        >
                          <i className="ti ti-calendar-stats" />
                        </a>
                        <a
                          href="#"
                          className="dt-ib"
                          title="Assign Department"
                          aria-label="Assign Department"
                          data-bs-toggle="modal"
                          data-bs-target="#dept_assign"
                          data-cls-action="assign_dept"
                        >
                          <i className="ti ti-building-community" />
                        </a>
                        <a
                          href="#"
                          className="dt-ib"
                          title="Documents"
                          aria-label="Documents"
                          data-bs-toggle="modal"
                          data-bs-target="#staff_documents"
                          data-cls-action="documents"
                        >
                          <i className="ti ti-files" />
                        </a>
                        <a
                          href="#"
                          className="dt-ib"
                          title="Print Profile"
                          aria-label="Print Profile"
                          data-cls-action="print_profile"
                        >
                          <i className="ti ti-printer" />
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
                              data-bs-toggle="modal"
                              data-bs-target="#staff_profile"
                              data-cls-action="view"
                            >
                              <i className="ti ti-eye" />
                              View Profile
                            </a>
                            <a
                              className="dropdown-item"
                              href="#"
                              data-bs-toggle="modal"
                              data-bs-target="#edit_staff"
                            >
                              <i className="ti ti-edit" />
                              Edit Staff
                            </a>
                            <a
                              className="dropdown-item"
                              href="#"
                              data-bs-toggle="modal"
                              data-bs-target="#attendance_summary"
                              data-cls-action="attendance"
                            >
                              <i className="ti ti-calendar-stats" />
                              Attendance History
                            </a>
                            <a
                              className="dropdown-item"
                              href="staff-payroll.html"
                              data-cls-action="payroll"
                            >
                              <i className="ti ti-cash" />
                              Payroll Details
                            </a>
                            <a
                              className="dropdown-item"
                              href="staff-leaves.html"
                              data-cls-action="leave"
                            >
                              <i className="ti ti-calendar-off" />
                              Leave History
                            </a>
                            <a
                              className="dropdown-item"
                              href="#"
                              data-bs-toggle="modal"
                              data-bs-target="#performance_details"
                              data-cls-action="performance"
                            >
                              <i className="ti ti-award" />
                              Performance Review
                            </a>
                            <hr className="dropdown-divider" />
                            <a
                              className="dropdown-item"
                              href="#"
                              data-bs-toggle="modal"
                              data-bs-target="#dept_assign"
                              data-cls-action="transfer"
                            >
                              <i className="ti ti-transfer" />
                              Transfer Department
                            </a>
                            <a
                              className="dropdown-item text-warning"
                              href="#"
                              data-cls-action="reset_cred"
                            >
                              <i className="ti ti-key" />
                              Reset Credentials
                            </a>
                            <a
                              className="dropdown-item"
                              href="#"
                              data-cls-action="export_profile"
                            >
                              <i className="ti ti-file-export" />
                              Export Profile
                            </a>
                            <a
                              className="dropdown-item"
                              href="#"
                              data-cls-action="archive"
                            >
                              <i className="ti ti-archive" />
                              Archive
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
                  <tr className="dt-detail">
                    <td colSpan={7}>
                      <div className="dt-detail-inner">
                        <div className="row g-4">
                          <div className="col-xl-3 col-md-6">
                            <h6 className="details-heading">
                              <i className="ti ti-user" />
                              Employee Profile
                            </h6>
                            <div className="d-flex align-items-center gap-2 mb-3">
                              <span className="avatar avatar-md">
                                <img
                                  src="assets/img/profiles/avatar-08.jpg"
                                  className="rounded-circle flex-shrink-0"
                                  alt="William Adams"
                                />
                              </span>
                              <div>
                                <span className="fw-medium d-block fs-13">
                                  William Adams
                                </span>
                                <span className="fs-12 text-muted">
                                  STF-2008 · Cashier
                                </span>
                              </div>
                            </div>
                            <h6 className="details-heading">
                              <i className="ti ti-building" />
                              Employment Details
                            </h6>
                            <ul className="list-unstyled fs-12 mb-0">
                              <li className="d-flex align-items-center justify-content-between py-1">
                                <span className="text-muted">Department</span>
                                <span className="fw-medium">Accounts</span>
                              </li>
                              <li className="d-flex align-items-center justify-content-between py-1">
                                <span className="text-muted">Type</span>
                                <span className="fw-medium">Full Time</span>
                              </li>
                              <li className="d-flex align-items-center justify-content-between py-1">
                                <span className="text-muted">Reports to</span>
                                <span className="fw-medium">Finance Head</span>
                              </li>
                            </ul>
                          </div>
                          <div className="col-xl-3 col-md-6">
                            <h6 className="details-heading">
                              <i className="ti ti-urgent" />
                              Emergency Contact
                            </h6>
                            <ul className="list-unstyled fs-12 text-muted mb-3">
                              <li className="py-1">
                                <i className="ti ti-user me-1" />
                                Next of Kin · Family
                              </li>
                              <li className="py-1">
                                <i className="ti ti-phone me-1" />
                                +1 546 8548 899
                              </li>
                            </ul>
                            <h6 className="details-heading">
                              <i className="ti ti-school" />
                              Qualifications
                            </h6>
                            <div className="d-flex flex-wrap gap-1">
                              <span className="badge badge-soft-secondary">
                                B.Com
                              </span>
                              <span className="badge badge-soft-info">
                                15 yrs experience
                              </span>
                            </div>
                          </div>
                          <div className="col-xl-3 col-md-6">
                            <h6 className="details-heading">
                              <i className="ti ti-files" />
                              Documents
                            </h6>
                            <div className="d-flex flex-wrap gap-1 mb-3">
                              <span className="badge badge-soft-success">
                                ID Proof
                              </span>
                              <span className="badge badge-soft-info">
                                Resume
                              </span>
                              <span className="badge badge-soft-warning">
                                Contract
                              </span>
                              <span className="badge badge-soft-secondary">
                                Certificates
                              </span>
                            </div>
                            <h6 className="details-heading">
                              <i className="ti ti-calendar-check" />
                              Attendance Summary
                            </h6>
                            <ul className="list-unstyled fs-12 mb-0">
                              <li className="d-flex align-items-center justify-content-between py-1">
                                <span className="text-muted">Today</span>
                                <span className="fw-medium">Present</span>
                              </li>
                              <li className="d-flex align-items-center justify-content-between py-1">
                                <span className="text-muted">This Month</span>
                                <span className="fw-medium">21 / 23 days</span>
                              </li>
                            </ul>
                          </div>
                          <div className="col-xl-3 col-md-6">
                            <h6 className="details-heading">
                              <i className="ti ti-award" />
                              Performance Notes
                            </h6>
                            <p className="fs-12 text-muted mb-3">
                              Last review rated Outstanding. Next review due
                              next quarter.
                            </p>
                            <h6 className="details-heading">
                              <i className="ti ti-notes" />
                              Remarks
                            </h6>
                            <p className="fs-12 text-muted mb-2">
                              Active and in good standing.
                            </p>
                            <div className="d-flex gap-2">
                              <a
                                href="#"
                                className="btn btn-outline-light bg-white btn-sm flex-fill"
                                data-bs-toggle="modal"
                                data-bs-target="#staff_documents"
                              >
                                <i className="ti ti-files me-1" />
                                Docs
                              </a>
                              <a
                                href="#"
                                className="btn btn-primary btn-sm flex-fill"
                                data-bs-toggle="modal"
                                data-bs-target="#staff_profile"
                              >
                                <i className="ti ti-eye me-1" />
                                Profile
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr
                    className="dt-row"
                    data-cls-status="Suspended"
                    data-search="ava robinson stf-2009 administration clerk ava.robinson@example.com +1 546 8548 809 south wing contract suspended female"
                  >
                    <td>
                      <button
                        type="button"
                        className="dt-expand"
                        aria-label="Expand Ava Robinson"
                        aria-expanded="false"
                      >
                        <i className="ti ti-chevron-right" />
                      </button>
                    </td>
                    <td className="dt-pin">
                      <input
                        type="checkbox"
                        className="dt-check row-select-cell"
                        aria-label="Select Ava Robinson"
                      />
                    </td>
                    <td data-cls-col="staff">
                      <div className="dt-user">
                        <a
                          href="#"
                          className="dt-avatar avatar"
                          data-bs-toggle="modal"
                          data-bs-target="#staff_profile"
                        >
                          <img
                            src="assets/img/profiles/avatar-09.jpg"
                            className="rounded-circle flex-shrink-0"
                            alt="Ava Robinson"
                          />
                        </a>
                        <div>
                          <a
                            href="#"
                            className="dt-name"
                            data-bs-toggle="modal"
                            data-bs-target="#staff_profile"
                          >
                            Ava Robinson
                          </a>
                          <div className="dt-sub">
                            <span className="link-primary dt-code">
                              STF-2009
                            </span>
                          </div>
                          <div className="d-flex flex-wrap gap-1 mt-1">
                            <span className="badge badge-soft-danger">
                              <i className="ti ti-building me-1" />
                              <span className="dt-dept">Administration</span>
                            </span>
                            <span className="badge badge-soft-secondary">
                              <i className="ti ti-briefcase me-1" />
                              <span className="dt-desig">Clerk</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td data-cls-col="contact">
                      <ul className="list-unstyled mb-0 fs-12">
                        <li className="py-1 text-muted">
                          <i className="ti ti-mail me-1" />
                          <span className="dt-email">
                            ava.robinson@example.com
                          </span>
                        </li>
                        <li className="py-1 text-muted">
                          <i className="ti ti-phone me-1" />
                          <span className="dt-phone">+1 546 8548 809</span>
                        </li>
                        <li className="py-1">
                          <span className="badge badge-soft-info">
                            <i className="ti ti-map-pin me-1" />
                            <span className="dt-branch">South Wing</span>
                          </span>{" "}
                          <span className="badge badge-soft-warning">
                            <i className="ti ti-id-badge me-1" />
                            <span className="dt-emp">Contract</span>
                          </span>
                        </li>
                        <li className="py-1 text-muted">
                          <i className="ti ti-calendar-event me-1" />
                          Joined{" "}
                          <span className="fw-medium text-dark dt-joined">
                            19 Apr 2014
                          </span>
                        </li>
                      </ul>
                    </td>
                    <td data-cls-col="work">
                      <ul className="list-unstyled mb-0 fs-12">
                        <li className="py-1 text-muted">
                          <i className="ti ti-user-cog me-1" />
                          Reports to{" "}
                          <span className="fw-medium text-dark">
                            Admin Officer
                          </span>
                        </li>
                        <li className="py-1">
                          <span className="badge badge-soft-secondary">
                            <i className="ti ti-school me-1" />
                            B.A.
                          </span>{" "}
                          <span className="badge badge-soft-info">
                            <i className="ti ti-briefcase me-1" />
                            <span className="dt-exp-val">16</span> yrs
                          </span>
                        </li>
                        <li className="py-1">
                          <span className="badge badge-soft-warning">
                            <i className="ti ti-calendar-check me-1" />
                            On Leave
                          </span>
                        </li>
                        <li className="py-1 text-muted">
                          <i className="ti ti-clock me-1" />
                          Last login{" "}
                          <span className="fw-medium text-dark">
                            20 Jul 2026 03:40 PM
                          </span>
                        </li>
                      </ul>
                    </td>
                    <td data-cls-col="status">
                      <span className="dt-pill is-emergency">
                        <i className="ti ti-ban" />
                        Suspended
                      </span>
                    </td>
                    <td>
                      <div className="dt-actions">
                        <a
                          href="#"
                          className="dt-ib"
                          title="View Profile"
                          aria-label="View Profile"
                          data-bs-toggle="modal"
                          data-bs-target="#staff_profile"
                          data-cls-action="view"
                        >
                          <i className="ti ti-eye" />
                        </a>
                        <a
                          href="#"
                          className="dt-ib"
                          title="Edit Staff"
                          aria-label="Edit Staff"
                          data-bs-toggle="modal"
                          data-bs-target="#edit_staff"
                        >
                          <i className="ti ti-edit" />
                        </a>
                        <a
                          href="#"
                          className="dt-ib"
                          title="Attendance History"
                          aria-label="Attendance History"
                          data-bs-toggle="modal"
                          data-bs-target="#attendance_summary"
                          data-cls-action="attendance"
                        >
                          <i className="ti ti-calendar-stats" />
                        </a>
                        <a
                          href="#"
                          className="dt-ib"
                          title="Assign Department"
                          aria-label="Assign Department"
                          data-bs-toggle="modal"
                          data-bs-target="#dept_assign"
                          data-cls-action="assign_dept"
                        >
                          <i className="ti ti-building-community" />
                        </a>
                        <a
                          href="#"
                          className="dt-ib"
                          title="Documents"
                          aria-label="Documents"
                          data-bs-toggle="modal"
                          data-bs-target="#staff_documents"
                          data-cls-action="documents"
                        >
                          <i className="ti ti-files" />
                        </a>
                        <a
                          href="#"
                          className="dt-ib"
                          title="Print Profile"
                          aria-label="Print Profile"
                          data-cls-action="print_profile"
                        >
                          <i className="ti ti-printer" />
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
                              data-bs-toggle="modal"
                              data-bs-target="#staff_profile"
                              data-cls-action="view"
                            >
                              <i className="ti ti-eye" />
                              View Profile
                            </a>
                            <a
                              className="dropdown-item"
                              href="#"
                              data-bs-toggle="modal"
                              data-bs-target="#edit_staff"
                            >
                              <i className="ti ti-edit" />
                              Edit Staff
                            </a>
                            <a
                              className="dropdown-item"
                              href="#"
                              data-bs-toggle="modal"
                              data-bs-target="#attendance_summary"
                              data-cls-action="attendance"
                            >
                              <i className="ti ti-calendar-stats" />
                              Attendance History
                            </a>
                            <a
                              className="dropdown-item"
                              href="staff-payroll.html"
                              data-cls-action="payroll"
                            >
                              <i className="ti ti-cash" />
                              Payroll Details
                            </a>
                            <a
                              className="dropdown-item"
                              href="staff-leaves.html"
                              data-cls-action="leave"
                            >
                              <i className="ti ti-calendar-off" />
                              Leave History
                            </a>
                            <a
                              className="dropdown-item"
                              href="#"
                              data-bs-toggle="modal"
                              data-bs-target="#performance_details"
                              data-cls-action="performance"
                            >
                              <i className="ti ti-award" />
                              Performance Review
                            </a>
                            <hr className="dropdown-divider" />
                            <a
                              className="dropdown-item"
                              href="#"
                              data-bs-toggle="modal"
                              data-bs-target="#dept_assign"
                              data-cls-action="transfer"
                            >
                              <i className="ti ti-transfer" />
                              Transfer Department
                            </a>
                            <a
                              className="dropdown-item text-warning"
                              href="#"
                              data-cls-action="reset_cred"
                            >
                              <i className="ti ti-key" />
                              Reset Credentials
                            </a>
                            <a
                              className="dropdown-item"
                              href="#"
                              data-cls-action="export_profile"
                            >
                              <i className="ti ti-file-export" />
                              Export Profile
                            </a>
                            <a
                              className="dropdown-item"
                              href="#"
                              data-cls-action="archive"
                            >
                              <i className="ti ti-archive" />
                              Archive
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
                  <tr className="dt-detail">
                    <td colSpan={7}>
                      <div className="dt-detail-inner">
                        <div className="row g-4">
                          <div className="col-xl-3 col-md-6">
                            <h6 className="details-heading">
                              <i className="ti ti-user" />
                              Employee Profile
                            </h6>
                            <div className="d-flex align-items-center gap-2 mb-3">
                              <span className="avatar avatar-md">
                                <img
                                  src="assets/img/profiles/avatar-09.jpg"
                                  className="rounded-circle flex-shrink-0"
                                  alt="Ava Robinson"
                                />
                              </span>
                              <div>
                                <span className="fw-medium d-block fs-13">
                                  Ava Robinson
                                </span>
                                <span className="fs-12 text-muted">
                                  STF-2009 · Clerk
                                </span>
                              </div>
                            </div>
                            <h6 className="details-heading">
                              <i className="ti ti-building" />
                              Employment Details
                            </h6>
                            <ul className="list-unstyled fs-12 mb-0">
                              <li className="d-flex align-items-center justify-content-between py-1">
                                <span className="text-muted">Department</span>
                                <span className="fw-medium">
                                  Administration
                                </span>
                              </li>
                              <li className="d-flex align-items-center justify-content-between py-1">
                                <span className="text-muted">Type</span>
                                <span className="fw-medium">Contract</span>
                              </li>
                              <li className="d-flex align-items-center justify-content-between py-1">
                                <span className="text-muted">Reports to</span>
                                <span className="fw-medium">Admin Officer</span>
                              </li>
                            </ul>
                          </div>
                          <div className="col-xl-3 col-md-6">
                            <h6 className="details-heading">
                              <i className="ti ti-urgent" />
                              Emergency Contact
                            </h6>
                            <ul className="list-unstyled fs-12 text-muted mb-3">
                              <li className="py-1">
                                <i className="ti ti-user me-1" />
                                Next of Kin · Family
                              </li>
                              <li className="py-1">
                                <i className="ti ti-phone me-1" />
                                +1 546 8548 899
                              </li>
                            </ul>
                            <h6 className="details-heading">
                              <i className="ti ti-school" />
                              Qualifications
                            </h6>
                            <div className="d-flex flex-wrap gap-1">
                              <span className="badge badge-soft-secondary">
                                B.A.
                              </span>
                              <span className="badge badge-soft-info">
                                16 yrs experience
                              </span>
                            </div>
                          </div>
                          <div className="col-xl-3 col-md-6">
                            <h6 className="details-heading">
                              <i className="ti ti-files" />
                              Documents
                            </h6>
                            <div className="d-flex flex-wrap gap-1 mb-3">
                              <span className="badge badge-soft-success">
                                ID Proof
                              </span>
                              <span className="badge badge-soft-info">
                                Resume
                              </span>
                              <span className="badge badge-soft-warning">
                                Contract
                              </span>
                              <span className="badge badge-soft-secondary">
                                Certificates
                              </span>
                            </div>
                            <h6 className="details-heading">
                              <i className="ti ti-calendar-check" />
                              Attendance Summary
                            </h6>
                            <ul className="list-unstyled fs-12 mb-0">
                              <li className="d-flex align-items-center justify-content-between py-1">
                                <span className="text-muted">Today</span>
                                <span className="fw-medium">On Leave</span>
                              </li>
                              <li className="d-flex align-items-center justify-content-between py-1">
                                <span className="text-muted">This Month</span>
                                <span className="fw-medium">21 / 23 days</span>
                              </li>
                            </ul>
                          </div>
                          <div className="col-xl-3 col-md-6">
                            <h6 className="details-heading">
                              <i className="ti ti-award" />
                              Performance Notes
                            </h6>
                            <p className="fs-12 text-muted mb-3">
                              Last review rated Outstanding. Next review due
                              next quarter.
                            </p>
                            <h6 className="details-heading">
                              <i className="ti ti-notes" />
                              Remarks
                            </h6>
                            <p className="fs-12 text-muted mb-2">
                              Suspended — pending internal review.
                            </p>
                            <div className="d-flex gap-2">
                              <a
                                href="#"
                                className="btn btn-outline-light bg-white btn-sm flex-fill"
                                data-bs-toggle="modal"
                                data-bs-target="#staff_documents"
                              >
                                <i className="ti ti-files me-1" />
                                Docs
                              </a>
                              <a
                                href="#"
                                className="btn btn-primary btn-sm flex-fill"
                                data-bs-toggle="modal"
                                data-bs-target="#staff_profile"
                              >
                                <i className="ti ti-eye me-1" />
                                Profile
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr
                    className="dt-row"
                    data-cls-status="Inactive"
                    data-search="ethan wright stf-2010 security security head ethan.wright@example.com +1 546 8548 810 main campus full time inactive male"
                  >
                    <td>
                      <button
                        type="button"
                        className="dt-expand"
                        aria-label="Expand Ethan Wright"
                        aria-expanded="false"
                      >
                        <i className="ti ti-chevron-right" />
                      </button>
                    </td>
                    <td className="dt-pin">
                      <input
                        type="checkbox"
                        className="dt-check row-select-cell"
                        aria-label="Select Ethan Wright"
                      />
                    </td>
                    <td data-cls-col="staff">
                      <div className="dt-user">
                        <a
                          href="#"
                          className="dt-avatar avatar"
                          data-bs-toggle="modal"
                          data-bs-target="#staff_profile"
                        >
                          <img
                            src="assets/img/profiles/avatar-10.jpg"
                            className="rounded-circle flex-shrink-0"
                            alt="Ethan Wright"
                          />
                        </a>
                        <div>
                          <a
                            href="#"
                            className="dt-name"
                            data-bs-toggle="modal"
                            data-bs-target="#staff_profile"
                          >
                            Ethan Wright
                          </a>
                          <div className="dt-sub">
                            <span className="link-primary dt-code">
                              STF-2010
                            </span>
                          </div>
                          <div className="d-flex flex-wrap gap-1 mt-1">
                            <span className="badge badge-soft-secondary">
                              <i className="ti ti-building me-1" />
                              <span className="dt-dept">Security</span>
                            </span>
                            <span className="badge badge-soft-secondary">
                              <i className="ti ti-briefcase me-1" />
                              <span className="dt-desig">Security Head</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td data-cls-col="contact">
                      <ul className="list-unstyled mb-0 fs-12">
                        <li className="py-1 text-muted">
                          <i className="ti ti-mail me-1" />
                          <span className="dt-email">
                            ethan.wright@example.com
                          </span>
                        </li>
                        <li className="py-1 text-muted">
                          <i className="ti ti-phone me-1" />
                          <span className="dt-phone">+1 546 8548 810</span>
                        </li>
                        <li className="py-1">
                          <span className="badge badge-soft-info">
                            <i className="ti ti-map-pin me-1" />
                            <span className="dt-branch">Main Campus</span>
                          </span>{" "}
                          <span className="badge badge-soft-success">
                            <i className="ti ti-id-badge me-1" />
                            <span className="dt-emp">Full Time</span>
                          </span>
                        </li>
                        <li className="py-1 text-muted">
                          <i className="ti ti-calendar-event me-1" />
                          Joined{" "}
                          <span className="fw-medium text-dark dt-joined">
                            09 Jan 2013
                          </span>
                        </li>
                      </ul>
                    </td>
                    <td data-cls-col="work">
                      <ul className="list-unstyled mb-0 fs-12">
                        <li className="py-1 text-muted">
                          <i className="ti ti-user-cog me-1" />
                          Reports to{" "}
                          <span className="fw-medium text-dark">
                            Operations Head
                          </span>
                        </li>
                        <li className="py-1">
                          <span className="badge badge-soft-secondary">
                            <i className="ti ti-school me-1" />
                            High School
                          </span>{" "}
                          <span className="badge badge-soft-info">
                            <i className="ti ti-briefcase me-1" />
                            <span className="dt-exp-val">17</span> yrs
                          </span>
                        </li>
                        <li className="py-1">
                          <span className="badge badge-soft-danger">
                            <i className="ti ti-calendar-check me-1" />
                            Absent
                          </span>
                        </li>
                        <li className="py-1 text-muted">
                          <i className="ti ti-clock me-1" />
                          Last login{" "}
                          <span className="fw-medium text-dark">
                            18 Nov 2025 09:10 AM
                          </span>
                        </li>
                      </ul>
                    </td>
                    <td data-cls-col="status">
                      <span className="dt-pill is-inactive">
                        <span className="dt-pill-dot" />
                        Inactive
                      </span>
                    </td>
                    <td>
                      <div className="dt-actions">
                        <a
                          href="#"
                          className="dt-ib"
                          title="View Profile"
                          aria-label="View Profile"
                          data-bs-toggle="modal"
                          data-bs-target="#staff_profile"
                          data-cls-action="view"
                        >
                          <i className="ti ti-eye" />
                        </a>
                        <a
                          href="#"
                          className="dt-ib"
                          title="Edit Staff"
                          aria-label="Edit Staff"
                          data-bs-toggle="modal"
                          data-bs-target="#edit_staff"
                        >
                          <i className="ti ti-edit" />
                        </a>
                        <a
                          href="#"
                          className="dt-ib"
                          title="Attendance History"
                          aria-label="Attendance History"
                          data-bs-toggle="modal"
                          data-bs-target="#attendance_summary"
                          data-cls-action="attendance"
                        >
                          <i className="ti ti-calendar-stats" />
                        </a>
                        <a
                          href="#"
                          className="dt-ib"
                          title="Assign Department"
                          aria-label="Assign Department"
                          data-bs-toggle="modal"
                          data-bs-target="#dept_assign"
                          data-cls-action="assign_dept"
                        >
                          <i className="ti ti-building-community" />
                        </a>
                        <a
                          href="#"
                          className="dt-ib"
                          title="Documents"
                          aria-label="Documents"
                          data-bs-toggle="modal"
                          data-bs-target="#staff_documents"
                          data-cls-action="documents"
                        >
                          <i className="ti ti-files" />
                        </a>
                        <a
                          href="#"
                          className="dt-ib"
                          title="Print Profile"
                          aria-label="Print Profile"
                          data-cls-action="print_profile"
                        >
                          <i className="ti ti-printer" />
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
                              data-bs-toggle="modal"
                              data-bs-target="#staff_profile"
                              data-cls-action="view"
                            >
                              <i className="ti ti-eye" />
                              View Profile
                            </a>
                            <a
                              className="dropdown-item"
                              href="#"
                              data-bs-toggle="modal"
                              data-bs-target="#edit_staff"
                            >
                              <i className="ti ti-edit" />
                              Edit Staff
                            </a>
                            <a
                              className="dropdown-item"
                              href="#"
                              data-bs-toggle="modal"
                              data-bs-target="#attendance_summary"
                              data-cls-action="attendance"
                            >
                              <i className="ti ti-calendar-stats" />
                              Attendance History
                            </a>
                            <a
                              className="dropdown-item"
                              href="staff-payroll.html"
                              data-cls-action="payroll"
                            >
                              <i className="ti ti-cash" />
                              Payroll Details
                            </a>
                            <a
                              className="dropdown-item"
                              href="staff-leaves.html"
                              data-cls-action="leave"
                            >
                              <i className="ti ti-calendar-off" />
                              Leave History
                            </a>
                            <a
                              className="dropdown-item"
                              href="#"
                              data-bs-toggle="modal"
                              data-bs-target="#performance_details"
                              data-cls-action="performance"
                            >
                              <i className="ti ti-award" />
                              Performance Review
                            </a>
                            <hr className="dropdown-divider" />
                            <a
                              className="dropdown-item"
                              href="#"
                              data-bs-toggle="modal"
                              data-bs-target="#dept_assign"
                              data-cls-action="transfer"
                            >
                              <i className="ti ti-transfer" />
                              Transfer Department
                            </a>
                            <a
                              className="dropdown-item text-warning"
                              href="#"
                              data-cls-action="reset_cred"
                            >
                              <i className="ti ti-key" />
                              Reset Credentials
                            </a>
                            <a
                              className="dropdown-item"
                              href="#"
                              data-cls-action="export_profile"
                            >
                              <i className="ti ti-file-export" />
                              Export Profile
                            </a>
                            <a
                              className="dropdown-item"
                              href="#"
                              data-cls-action="archive"
                            >
                              <i className="ti ti-archive" />
                              Archive
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
                  <tr className="dt-detail">
                    <td colSpan={7}>
                      <div className="dt-detail-inner">
                        <div className="row g-4">
                          <div className="col-xl-3 col-md-6">
                            <h6 className="details-heading">
                              <i className="ti ti-user" />
                              Employee Profile
                            </h6>
                            <div className="d-flex align-items-center gap-2 mb-3">
                              <span className="avatar avatar-md">
                                <img
                                  src="assets/img/profiles/avatar-10.jpg"
                                  className="rounded-circle flex-shrink-0"
                                  alt="Ethan Wright"
                                />
                              </span>
                              <div>
                                <span className="fw-medium d-block fs-13">
                                  Ethan Wright
                                </span>
                                <span className="fs-12 text-muted">
                                  STF-2010 · Security Head
                                </span>
                              </div>
                            </div>
                            <h6 className="details-heading">
                              <i className="ti ti-building" />
                              Employment Details
                            </h6>
                            <ul className="list-unstyled fs-12 mb-0">
                              <li className="d-flex align-items-center justify-content-between py-1">
                                <span className="text-muted">Department</span>
                                <span className="fw-medium">Security</span>
                              </li>
                              <li className="d-flex align-items-center justify-content-between py-1">
                                <span className="text-muted">Type</span>
                                <span className="fw-medium">Full Time</span>
                              </li>
                              <li className="d-flex align-items-center justify-content-between py-1">
                                <span className="text-muted">Reports to</span>
                                <span className="fw-medium">
                                  Operations Head
                                </span>
                              </li>
                            </ul>
                          </div>
                          <div className="col-xl-3 col-md-6">
                            <h6 className="details-heading">
                              <i className="ti ti-urgent" />
                              Emergency Contact
                            </h6>
                            <ul className="list-unstyled fs-12 text-muted mb-3">
                              <li className="py-1">
                                <i className="ti ti-user me-1" />
                                Next of Kin · Family
                              </li>
                              <li className="py-1">
                                <i className="ti ti-phone me-1" />
                                +1 546 8548 899
                              </li>
                            </ul>
                            <h6 className="details-heading">
                              <i className="ti ti-school" />
                              Qualifications
                            </h6>
                            <div className="d-flex flex-wrap gap-1">
                              <span className="badge badge-soft-secondary">
                                High School
                              </span>
                              <span className="badge badge-soft-info">
                                17 yrs experience
                              </span>
                            </div>
                          </div>
                          <div className="col-xl-3 col-md-6">
                            <h6 className="details-heading">
                              <i className="ti ti-files" />
                              Documents
                            </h6>
                            <div className="d-flex flex-wrap gap-1 mb-3">
                              <span className="badge badge-soft-success">
                                ID Proof
                              </span>
                              <span className="badge badge-soft-info">
                                Resume
                              </span>
                              <span className="badge badge-soft-warning">
                                Contract
                              </span>
                              <span className="badge badge-soft-secondary">
                                Certificates
                              </span>
                            </div>
                            <h6 className="details-heading">
                              <i className="ti ti-calendar-check" />
                              Attendance Summary
                            </h6>
                            <ul className="list-unstyled fs-12 mb-0">
                              <li className="d-flex align-items-center justify-content-between py-1">
                                <span className="text-muted">Today</span>
                                <span className="fw-medium">Absent</span>
                              </li>
                              <li className="d-flex align-items-center justify-content-between py-1">
                                <span className="text-muted">This Month</span>
                                <span className="fw-medium">21 / 23 days</span>
                              </li>
                            </ul>
                          </div>
                          <div className="col-xl-3 col-md-6">
                            <h6 className="details-heading">
                              <i className="ti ti-award" />
                              Performance Notes
                            </h6>
                            <p className="fs-12 text-muted mb-3">
                              Last review rated Outstanding. Next review due
                              next quarter.
                            </p>
                            <h6 className="details-heading">
                              <i className="ti ti-notes" />
                              Remarks
                            </h6>
                            <p className="fs-12 text-muted mb-2">
                              Inactive — separated from service, retained for
                              records.
                            </p>
                            <div className="d-flex gap-2">
                              <a
                                href="#"
                                className="btn btn-outline-light bg-white btn-sm flex-fill"
                                data-bs-toggle="modal"
                                data-bs-target="#staff_documents"
                              >
                                <i className="ti ti-files me-1" />
                                Docs
                              </a>
                              <a
                                href="#"
                                className="btn btn-primary btn-sm flex-fill"
                                data-bs-toggle="modal"
                                data-bs-target="#staff_profile"
                              >
                                <i className="ti ti-eye me-1" />
                                Profile
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            {/* Empty state */}
            <div className="workspace-empty-state" id="clsEmpty">
              <div className="workspace-empty-art">
                <i className="ti ti-users-off" />
              </div>
              <h5>No staff match your filters</h5>
              <p>
                Try adjusting your search terms or clearing the active filters
                to see more results.
              </p>
              <button
                type="button"
                className="btn btn-primary"
                data-cls-action="clear_filters"
              >
                <i className="ti ti-rotate me-1" />
                Reset filters
              </button>
            </div>
            {/* Footer */}
            <div className="workspace-footer">
              <div className="workspace-footer-info">
                Showing <span className="range-from">1</span>–
                <span className="range-to">10</span> of{" "}
                <span className="range-total">10</span> staff
              </div>
              <div className="workspace-footer-size">
                <label className="mb-0">Rows:</label>
                <select className="form-select" aria-label="Rows per page">
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
              </div>
              <nav
                className="workspace-pagination"
                aria-label="Staff pagination"
              >
                <button
                  type="button"
                  className="workspace-page-button"
                  data-cls-action="page"
                  aria-label="First page"
                  disabled
                >
                  <i className="ti ti-chevrons-left" />
                </button>
                <button
                  type="button"
                  className="workspace-page-button"
                  data-cls-action="page"
                  aria-label="Previous page"
                  disabled
                >
                  <i className="ti ti-chevron-left" />
                </button>
                <span className="workspace-page-numbers">
                  <button
                    type="button"
                    className="workspace-page-button active"
                    data-cls-action="page"
                    aria-current="page"
                  >
                    1
                  </button>
                </span>
                <button
                  type="button"
                  className="workspace-page-button"
                  data-cls-action="page"
                  aria-label="Next page"
                  disabled
                >
                  <i className="ti ti-chevron-right" />
                </button>
                <button
                  type="button"
                  className="workspace-page-button"
                  data-cls-action="page"
                  aria-label="Last page"
                  disabled
                >
                  <i className="ti ti-chevrons-right" />
                </button>
              </nav>
            </div>
          </div>
          <div
            className="toast-stack toast-container"
            id="clsToasts"
            aria-live="polite"
            aria-atomic="true"
          />
        </div>
      </div>
      {/* /Staff Workspace */}
    </div>
  </div>
  {/* /Page Wrapper */}
</>

  )
}

export default Staffs