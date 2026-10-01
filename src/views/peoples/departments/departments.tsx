import { Link } from "react-router-dom";
import { all_routes } from "../../../routes/all_routes";
import DepartmentsModal from "./departmentsModal";

const Departments = () => {
  return (
    <>
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content dept-page">
          {/* Page Header */}
          <div className="d-md-flex d-block align-items-center justify-content-between flex-wrap gap-2 mb-3">
            <div className="my-auto mb-2">
              <h3 className="page-title mb-1">Department Management</h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={all_routes.adminDashboard}>Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <a href="#">HRM</a>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Department
                  </li>
                </ol>
              </nav>
            </div>
            <div className="d-flex my-xl-auto right-content align-items-center flex-wrap">
              <button
                type="button"
                className="btn btn-outline-light bg-white me-2 mb-2 d-inline-flex align-items-center"
                data-dept-refresh=""
              >
                <i className="ti ti-refresh me-1" />
                Refresh
              </button>
              <button
                type="button"
                className="btn btn-primary mb-2 d-inline-flex align-items-center"
                data-bs-toggle="modal"
                data-bs-target="#add_department"
              >
                <i className="ti ti-square-rounded-plus me-1" />
                Add Department
              </button>
            </div>
          </div>
          {/* /Page Header */}
          {/* Skeleton Loader */}
          <div id="dept_skeleton" className="d-none" aria-hidden="true">
            <div className="card is-loaded data-workspace classes-workspace mb-0">
              <div className="card-header border-bottom">
                <div className="skeleton-toolbar">
                  <div className="skeleton skeleton-search" />
                  <div className="skeleton skeleton-btn" />
                  <div className="skeleton skeleton-btn" />
                  <div className="skeleton skeleton-density ms-auto" />
                  <div className="skeleton skeleton-ico" />
                  <div className="skeleton skeleton-ico" />
                </div>
              </div>
              <div className="card-body">
                <div className="row g-3">
                  <div className="col-xxl-4 col-lg-5">
                    <div className="card mb-3">
                      <div className="card-body">
                        <div className="d-flex gap-3">
                          <span className="skeleton skeleton-avatar" />
                          <div className="flex-fill">
                            <div className="skeleton skeleton-line w-75 mb-2" />
                            <div className="skeleton skeleton-line w-50" />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="card mb-3">
                      <div className="card-body">
                        <div className="d-flex gap-3">
                          <span className="skeleton skeleton-avatar" />
                          <div className="flex-fill">
                            <div className="skeleton skeleton-line w-75 mb-2" />
                            <div className="skeleton skeleton-line w-50" />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="card mb-0">
                      <div className="card-body">
                        <div className="d-flex gap-3">
                          <span className="skeleton skeleton-avatar" />
                          <div className="flex-fill">
                            <div className="skeleton skeleton-line w-75 mb-2" />
                            <div className="skeleton skeleton-line w-50" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-xxl-8 col-lg-7">
                    <div className="card mb-0">
                      <div className="card-body">
                        <div className="d-flex gap-3 mb-4">
                          <span className="avatar avatar-xl skeleton rounded" />
                          <div className="flex-fill">
                            <div className="skeleton skeleton-line w-25 mb-2" />
                            <div className="skeleton skeleton-line w-75" />
                          </div>
                        </div>
                        <div className="row g-3 mb-4">
                          <div className="col-4">
                            <div className="skeleton skeleton-card" />
                          </div>
                          <div className="col-4">
                            <div className="skeleton skeleton-card" />
                          </div>
                          <div className="col-4">
                            <div className="skeleton skeleton-card" />
                          </div>
                        </div>
                        <div className="d-flex gap-3">
                          <div className="skeleton skeleton-card flex-fill" />
                          <div className="skeleton skeleton-card flex-fill" />
                          <div className="skeleton skeleton-card flex-fill" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* /Skeleton Loader */}
          <div id="dept_workspace">
            <div
              className="card mb-0 data-workspace classes-workspace is-loaded"
              id="dept_card"
            >
              {/* Sticky Management Toolbar */}
              <div className="card-header border-bottom sticky-top bg-white">
                <div className="page-toolbar">
                  <div className="search-toolbar">
                    <i className="ti ti-search search-toolbar-icon" />
                    <input
                      type="text"
                      id="deptSearch"
                      placeholder="Search department, code or head…"
                      aria-label="Search departments"
                    />
                    <span className="search-toolbar-kbd">⌘K</span>
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
                    </button>
                    <div className="dropdown-menu p-3 filter-menu">
                      <div className="row g-3">
                        <div className="col-6">
                          <label
                            className="form-label mb-1"
                            htmlFor="department-type"
                          >
                            Department Type
                          </label>
                          <select className="form-select" id="department-type">
                            <option value="">All</option>
                            <option>Academic</option>
                            <option>Administrative</option>
                            <option>Support</option>
                          </select>
                        </div>
                        <div className="col-6">
                          <label
                            className="form-label mb-1"
                            htmlFor="department-head"
                          >
                            Department Head
                          </label>
                          <select className="form-select" id="department-head">
                            <option value="">All</option>
                            <option>Kevin Larry</option>
                            <option>Teresa Susan</option>
                            <option>Daniel Josua</option>
                          </select>
                        </div>
                        <div className="col-6">
                          <label className="form-label mb-1" htmlFor="status">
                            Status
                          </label>
                          <select className="form-select" id="status">
                            <option value="">All</option>
                            <option>Active</option>
                            <option>Inactive</option>
                          </select>
                        </div>
                        <div className="col-6">
                          <label
                            className="form-label mb-1"
                            htmlFor="staff-count"
                          >
                            Staff Count
                          </label>
                          <select className="form-select" id="staff-count">
                            <option value="">All</option>
                            <option>Under 10</option>
                            <option>10 – 25</option>
                            <option>Over 25</option>
                          </select>
                        </div>
                      </div>
                      <div className="d-flex align-items-center justify-content-end gap-2 mt-3 pt-3 border-top">
                        <button type="button" className="btn btn-light btn-sm">
                          Reset
                        </button>
                        <button
                          type="button"
                          className="btn btn-primary btn-sm"
                        >
                          Apply
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="dropdown">
                    <button
                      type="button"
                      className="workspace-button dropdown-toggle"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <i className="ti ti-sort-ascending-2" />
                      Sort
                    </button>
                    <ul className="dropdown-menu p-2">
                      <li className="context-menu-head">Sort by</li>
                      <li>
                        <a
                          className="dropdown-item rounded-1 active"
                          href="#"
                        >
                          <i className="ti ti-abc me-2" />
                          Name (A–Z)
                        </a>
                      </li>
                      <li>
                        <a
                          className="dropdown-item rounded-1"
                          href="#"
                        >
                          <i className="ti ti-users me-2" />
                          Staff count
                        </a>
                      </li>
                      <li>
                        <a
                          className="dropdown-item rounded-1"
                          href="#"
                        >
                          <i className="ti ti-clock me-2" />
                          Recently added
                        </a>
                      </li>
                    </ul>
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
                    <ul className="dropdown-menu p-2">
                      <li className="context-menu-head">My Views</li>
                      <li>
                        <a
                          className="dropdown-item rounded-1 active"
                          href="#"
                        >
                          <i className="ti ti-layout-grid me-2" />
                          All Departments
                        </a>
                      </li>
                      <li>
                        <a
                          className="dropdown-item rounded-1"
                          href="#"
                        >
                          <i className="ti ti-school me-2" />
                          Academic Only
                        </a>
                      </li>
                      <li>
                        <a
                          className="dropdown-item rounded-1"
                          href="#"
                        >
                          <i className="ti ti-circle-x me-2" />
                          Inactive
                        </a>
                      </li>
                      <li>
                        <hr className="dropdown-divider" />
                      </li>
                      <li>
                        <a
                          className="dropdown-item rounded-1 text-primary"
                          href="#"
                        >
                          <i className="ti ti-plus me-2" />
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
                      aria-expanded="false"
                    >
                      <i className="ti ti-checkbox" />
                      Bulk Actions
                    </button>
                    <ul className="dropdown-menu p-2">
                      <li>
                        <a
                          className="dropdown-item rounded-1"
                          href="#"
                          data-bs-toggle="modal"
                          data-bs-target="#assign_staff"
                        >
                          <i className="ti ti-user-star me-2" />
                          Assign Head
                        </a>
                      </li>
                      <li>
                        <a
                          className="dropdown-item rounded-1"
                          href="#"
                        >
                          <i className="ti ti-toggle-left me-2" />
                          Change Status
                        </a>
                      </li>
                      <li>
                        <a
                          className="dropdown-item rounded-1"
                          href="#"
                        >
                          <i className="ti ti-file-export me-2" />
                          Export Selected
                        </a>
                      </li>
                      <li>
                        <a
                          className="dropdown-item rounded-1"
                          href="#"
                          data-dept-print=""
                        >
                          <i className="ti ti-printer me-2" />
                          Print
                        </a>
                      </li>
                      <li>
                        <a
                          className="dropdown-item rounded-1"
                          href="#"
                        >
                          <i className="ti ti-archive me-2" />
                          Archive
                        </a>
                      </li>
                      <li>
                        <a
                          className="dropdown-item rounded-1 text-danger"
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
                  <div className="dropdown">
                    <button
                      type="button"
                      className="workspace-button dropdown-toggle"
                      data-bs-toggle="dropdown"
                      data-bs-auto-close="outside"
                      aria-expanded="false"
                    >
                      <i className="ti ti-columns-3" />
                      Fields
                    </button>
                    <ul className="dropdown-menu p-2">
                      <li className="context-menu-head">Card fields</li>
                      <li>
                        <label className="dropdown-item">
                          <input
                            className="form-check-input me-2 mt-0"
                            type="checkbox"
                            data-dept-col="staff"
                            defaultChecked
                          />
                          Staff count
                        </label>
                      </li>
                      <li>
                        <label className="dropdown-item">
                          <input
                            className="form-check-input me-2 mt-0"
                            type="checkbox"
                            data-dept-col="teachers"
                            defaultChecked
                          />
                          Teachers count
                        </label>
                      </li>
                      <li>
                        <label className="dropdown-item">
                          <input
                            className="form-check-input me-2 mt-0"
                            type="checkbox"
                            data-dept-col="hod"
                            defaultChecked
                          />
                          Head of Department
                        </label>
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
                      data-dept-density="compact"
                      data-bs-toggle="tooltip"
                      title="Compact"
                      aria-label="Compact"
                    >
                      <i className="ti ti-baseline-density-small" />
                    </button>
                    <button
                      type="button"
                      className="active"
                      data-dept-density="default"
                      data-bs-toggle="tooltip"
                      title="Default"
                      aria-label="Default"
                    >
                      <i className="ti ti-baseline-density-medium" />
                    </button>
                  </div>
                  <button
                    type="button"
                    className="workspace-button workspace-button-icon"
                    data-dept-refresh=""
                    data-bs-toggle="tooltip"
                    title="Refresh"
                    aria-label="Refresh"
                  >
                    <i className="ti ti-refresh" />
                  </button>
                  <button
                    type="button"
                    className="workspace-button workspace-button-icon"
                    data-bs-toggle="modal"
                    data-bs-target="#add_department"
                    title="Import"
                    aria-label="Import"
                  >
                    <i className="ti ti-file-import" />
                  </button>
                  <div className="dropdown">
                    <button
                      type="button"
                      className="workspace-button workspace-button-icon"
                      data-bs-toggle="dropdown"
                      title="Export"
                      aria-label="Export"
                    >
                      <i className="ti ti-file-export" />
                    </button>
                    <ul className="dropdown-menu dropdown-menu-end p-2">
                      <li>
                        <a
                          className="dropdown-item rounded-1"
                          href="#"
                        >
                          <i className="ti ti-file-type-pdf me-2" />
                          Export as PDF
                        </a>
                      </li>
                      <li>
                        <a
                          className="dropdown-item rounded-1"
                          href="#"
                        >
                          <i className="ti ti-file-type-xls me-2" />
                          Export as Excel
                        </a>
                      </li>
                    </ul>
                  </div>
                  <button
                    type="button"
                    className="workspace-button workspace-button-icon"
                    data-dept-print=""
                    data-bs-toggle="tooltip"
                    title="Print"
                    aria-label="Print"
                  >
                    <i className="ti ti-printer" />
                  </button>
                  <button
                    type="button"
                    className="workspace-button workspace-button-icon"
                    data-dept-fullscreen=""
                    data-bs-toggle="tooltip"
                    title="Fullscreen"
                    aria-label="Fullscreen"
                  >
                    <i className="ti ti-arrows-maximize" />
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary btn-sm d-inline-flex align-items-center"
                    data-bs-toggle="modal"
                    data-bs-target="#add_department"
                  >
                    <i className="ti ti-square-rounded-plus me-1" />
                    Add
                  </button>
                </div>
                <div className="quick-filters">
                  <span className="text-muted fs-12 fw-semibold me-1">
                    <i className="ti ti-filter me-1" />
                    Filters:
                  </span>
                  <span className="badge badge-soft-primary d-inline-flex align-items-center">
                    Academic Year : 2024 / 2025{" "}
                    <a
                      href="#"
                      className="ms-1 text-primary"
                      aria-label="Remove"
                    >
                      <i className="ti ti-x" />
                    </a>
                  </span>
                  <span className="badge badge-soft-success d-inline-flex align-items-center">
                    Status : Active{" "}
                    <a
                      href="#"
                      className="ms-1 text-success"
                      aria-label="Remove"
                    >
                      <i className="ti ti-x" />
                    </a>
                  </span>
                  <a
                    href="#"
                    className="btn btn-link btn-sm text-primary"
                  >
                    Clear all
                  </a>
                </div>
              </div>
              {/* /Sticky Management Toolbar */}
              <div className="card-body">
                {/* Bulk Action Bar */}
                <div
                  id="dept_bulk"
                  className="d-none align-items-center justify-content-between bg-light rounded p-2 mb-3"
                >
                  <span>
                    <span className="fw-semibold dept-selected-count">0</span>{" "}
                    selected
                  </span>
                  <div className="d-flex gap-2 flex-wrap">
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-light bg-white"
                      data-bs-toggle="modal"
                      data-bs-target="#assign_staff"
                    >
                      <i className="ti ti-user-star me-1" />
                      Assign Head
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-light bg-white"
                    >
                      <i className="ti ti-toggle-left me-1" />
                      Change Status
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-light bg-white"
                    >
                      <i className="ti ti-file-export me-1" />
                      Export
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-light bg-white"
                      data-dept-print=""
                    >
                      <i className="ti ti-printer me-1" />
                      Print
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-light bg-white"
                    >
                      <i className="ti ti-archive me-1" />
                      Archive
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-danger"
                      data-bs-toggle="modal"
                      data-bs-target="#delete-modal"
                    >
                      <i className="ti ti-trash me-1" />
                      Delete
                    </button>
                  </div>
                </div>
                {/* /Bulk Action Bar */}
                <div className="row g-3">
                  {/* Master: Department Directory */}
                  <div className="col-xxl-4 col-lg-5">
                    <div className="d-flex align-items-center justify-content-between mb-3">
                      <div className="form-check mb-0">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="dept_select_all"
                        />
                        <label
                          className="form-check-label fs-13 text-muted ms-1"
                          htmlFor="dept_select_all"
                        >
                          Select all
                        </label>
                      </div>
                      <span className="badge badge-soft-primary">
                        10 Departments
                      </span>
                    </div>
                    <div
                      className="d-flex flex-column gap-3"
                      id="dept_list"
                      role="tablist"
                      aria-label="Departments"
                    >
                      <div
                        className="card card-hover mb-0 dept-item border-primary border-2 active"
                        data-dept-target="dept_0"
                        tabIndex={0}
                        aria-current="true"
                      >
                        <div className="card-body">
                          <div className="d-flex align-items-start">
                            <div className="form-check me-2">
                              <input
                                className="form-check-input dept-check"
                                type="checkbox"
                                aria-label="Select Admin"
                              />
                            </div>
                            <span className="avatar avatar-lg bg-primary-transparent text-primary rounded me-3 flex-shrink-0">
                              <i className="ti ti-shield-cog fs-24" />
                            </span>
                            <div className="flex-fill overflow-hidden">
                              <div className="d-flex align-items-center justify-content-between">
                                <h4 className="mb-0 text-truncate fs-15 fw-medium">
                                  Admin
                                </h4>
                                <div className="dropdown">
                                  <a
                                    href="#"
                                    className="btn btn-icon btn-sm rounded-circle flex-shrink-0"
                                    data-bs-toggle="dropdown"
                                    aria-label="Department menu"
                                  >
                                    <i className="ti ti-dots-vertical" />
                                  </a>
                                  <ul className="dropdown-menu dropdown-menu-end p-2">
                                    <li>
                                      <a
                                        className="dropdown-item rounded-1"
                                        href="#"
                                        data-bs-toggle="modal"
                                        data-bs-target="#department_details"
                                      >
                                        <i className="ti ti-eye me-2" />
                                        View
                                      </a>
                                    </li>
                                    <li>
                                      <a
                                        className="dropdown-item rounded-1"
                                        href="#"
                                        data-bs-toggle="modal"
                                        data-bs-target="#edit_department"
                                      >
                                        <i className="ti ti-edit me-2" />
                                        Edit
                                      </a>
                                    </li>
                                    <li>
                                      <a
                                        className="dropdown-item rounded-1"
                                        href="#"
                                        data-bs-toggle="modal"
                                        data-bs-target="#assign_staff"
                                      >
                                        <i className="ti ti-user-plus me-2" />
                                        Assign Staff
                                      </a>
                                    </li>
                                    <li>
                                      <a
                                        className="dropdown-item rounded-1"
                                        href="#"
                                        data-bs-toggle="modal"
                                        data-bs-target="#assign_subjects"
                                      >
                                        <i className="ti ti-book me-2" />
                                        Assign Subjects
                                      </a>
                                    </li>
                                    <li>
                                      <hr className="dropdown-divider" />
                                    </li>
                                    <li>
                                      <a
                                        className="dropdown-item rounded-1"
                                        href="#"
                                      >
                                        <i className="ti ti-copy me-2" />
                                        Duplicate
                                      </a>
                                    </li>
                                    <li>
                                      <a
                                        className="dropdown-item rounded-1"
                                        href="#"
                                      >
                                        <i className="ti ti-archive me-2" />
                                        Archive
                                      </a>
                                    </li>
                                    <li>
                                      <a
                                        className="dropdown-item rounded-1 text-danger"
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
                              <span className="fs-12 text-muted">D757248</span>
                              <div className="d-flex align-items-center mt-2 mb-2 dept-f-hod">
                                <span className="avatar avatar-xs me-1">
                                  <img
                                    src="assets/img/profiles/avatar-27.jpg"
                                    className="rounded-circle flex-shrink-0"
                                    alt="Kevin Larry"
                                  />
                                </span>
                                <span className="fs-12 text-dark">
                                  HoD: Kevin Larry
                                </span>
                              </div>
                              <div className="d-flex align-items-center flex-wrap gap-2">
                                <span className="badge badge-soft-secondary d-inline-flex align-items-center dept-f-staff">
                                  <i className="ti ti-users me-1" />
                                  24 Staff
                                </span>
                                <span className="badge badge-soft-info d-inline-flex align-items-center dept-f-teachers">
                                  <i className="ti ti-school me-1" />0 Teachers
                                </span>
                                <span className="badge badge-soft-success d-inline-flex align-items-center">
                                  <i className="ti ti-circle-filled fs-5 me-1" />
                                  Active
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div
                        className="card card-hover mb-0 dept-item"
                        data-dept-target="dept_1"
                        tabIndex={0}
                      >
                        <div className="card-body">
                          <div className="d-flex align-items-start">
                            <div className="form-check me-2">
                              <input
                                className="form-check-input dept-check"
                                type="checkbox"
                                aria-label="Select Finance"
                              />
                            </div>
                            <span className="avatar avatar-lg bg-success-transparent text-success rounded me-3 flex-shrink-0">
                              <i className="ti ti-report-money fs-24" />
                            </span>
                            <div className="flex-fill overflow-hidden">
                              <div className="d-flex align-items-center justify-content-between">
                                <h5 className="mb-0 text-truncate fs-15">
                                  Finance
                                </h5>
                                <div className="dropdown">
                                  <a
                                    href="#"
                                    className="btn btn-icon btn-sm rounded-circle flex-shrink-0"
                                    data-bs-toggle="dropdown"
                                    aria-label="Department menu"
                                  >
                                    <i className="ti ti-dots-vertical" />
                                  </a>
                                  <ul className="dropdown-menu dropdown-menu-end p-2">
                                    <li>
                                      <a
                                        className="dropdown-item rounded-1"
                                        href="#"
                                        data-bs-toggle="modal"
                                        data-bs-target="#department_details"
                                      >
                                        <i className="ti ti-eye me-2" />
                                        View
                                      </a>
                                    </li>
                                    <li>
                                      <a
                                        className="dropdown-item rounded-1"
                                        href="#"
                                        data-bs-toggle="modal"
                                        data-bs-target="#edit_department"
                                      >
                                        <i className="ti ti-edit me-2" />
                                        Edit
                                      </a>
                                    </li>
                                    <li>
                                      <a
                                        className="dropdown-item rounded-1"
                                        href="#"
                                        data-bs-toggle="modal"
                                        data-bs-target="#assign_staff"
                                      >
                                        <i className="ti ti-user-plus me-2" />
                                        Assign Staff
                                      </a>
                                    </li>
                                    <li>
                                      <a
                                        className="dropdown-item rounded-1"
                                        href="#"
                                        data-bs-toggle="modal"
                                        data-bs-target="#assign_subjects"
                                      >
                                        <i className="ti ti-book me-2" />
                                        Assign Subjects
                                      </a>
                                    </li>
                                    <li>
                                      <hr className="dropdown-divider" />
                                    </li>
                                    <li>
                                      <a
                                        className="dropdown-item rounded-1"
                                        href="#"
                                      >
                                        <i className="ti ti-copy me-2" />
                                        Duplicate
                                      </a>
                                    </li>
                                    <li>
                                      <a
                                        className="dropdown-item rounded-1"
                                        href="#"
                                      >
                                        <i className="ti ti-archive me-2" />
                                        Archive
                                      </a>
                                    </li>
                                    <li>
                                      <a
                                        className="dropdown-item rounded-1 text-danger"
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
                              <span className="fs-12 text-muted">D757247</span>
                              <div className="d-flex align-items-center mt-2 mb-2 dept-f-hod">
                                <span className="avatar avatar-xs me-1">
                                  <img
                                    src="assets/img/profiles/avatar-23.jpg"
                                    className="rounded-circle flex-shrink-0"
                                    alt="Teresa Susan"
                                  />
                                </span>
                                <span className="fs-12 text-dark">
                                  HoD: Teresa Susan
                                </span>
                              </div>
                              <div className="d-flex align-items-center flex-wrap gap-2">
                                <span className="badge badge-soft-secondary d-inline-flex align-items-center dept-f-staff">
                                  <i className="ti ti-users me-1" />
                                  14 Staff
                                </span>
                                <span className="badge badge-soft-info d-inline-flex align-items-center dept-f-teachers">
                                  <i className="ti ti-school me-1" />0 Teachers
                                </span>
                                <span className="badge badge-soft-success d-inline-flex align-items-center">
                                  <i className="ti ti-circle-filled fs-5 me-1" />
                                  Active
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div
                        className="card card-hover mb-0 dept-item"
                        data-dept-target="dept_2"
                        tabIndex={0}
                      >
                        <div className="card-body">
                          <div className="d-flex align-items-start">
                            <div className="form-check me-2">
                              <input
                                className="form-check-input dept-check"
                                type="checkbox"
                                aria-label="Select Academic"
                              />
                            </div>
                            <span className="avatar avatar-lg bg-info-transparent text-info rounded me-3 flex-shrink-0">
                              <i className="ti ti-school fs-24" />
                            </span>
                            <div className="flex-fill overflow-hidden">
                              <div className="d-flex align-items-center justify-content-between">
                                <h6 className="mb-0 text-truncate">Academic</h6>
                                <div className="dropdown">
                                  <a
                                    href="#"
                                    className="btn btn-icon btn-sm rounded-circle flex-shrink-0"
                                    data-bs-toggle="dropdown"
                                    aria-label="Department menu"
                                  >
                                    <i className="ti ti-dots-vertical" />
                                  </a>
                                  <ul className="dropdown-menu dropdown-menu-end p-2">
                                    <li>
                                      <a
                                        className="dropdown-item rounded-1"
                                        href="#"
                                        data-bs-toggle="modal"
                                        data-bs-target="#department_details"
                                      >
                                        <i className="ti ti-eye me-2" />
                                        View
                                      </a>
                                    </li>
                                    <li>
                                      <a
                                        className="dropdown-item rounded-1"
                                        href="#"
                                        data-bs-toggle="modal"
                                        data-bs-target="#edit_department"
                                      >
                                        <i className="ti ti-edit me-2" />
                                        Edit
                                      </a>
                                    </li>
                                    <li>
                                      <a
                                        className="dropdown-item rounded-1"
                                        href="#"
                                        data-bs-toggle="modal"
                                        data-bs-target="#assign_staff"
                                      >
                                        <i className="ti ti-user-plus me-2" />
                                        Assign Staff
                                      </a>
                                    </li>
                                    <li>
                                      <a
                                        className="dropdown-item rounded-1"
                                        href="#"
                                        data-bs-toggle="modal"
                                        data-bs-target="#assign_subjects"
                                      >
                                        <i className="ti ti-book me-2" />
                                        Assign Subjects
                                      </a>
                                    </li>
                                    <li>
                                      <hr className="dropdown-divider" />
                                    </li>
                                    <li>
                                      <a
                                        className="dropdown-item rounded-1"
                                        href="#"
                                      >
                                        <i className="ti ti-copy me-2" />
                                        Duplicate
                                      </a>
                                    </li>
                                    <li>
                                      <a
                                        className="dropdown-item rounded-1"
                                        href="#"
                                      >
                                        <i className="ti ti-archive me-2" />
                                        Archive
                                      </a>
                                    </li>
                                    <li>
                                      <a
                                        className="dropdown-item rounded-1 text-danger"
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
                              <span className="fs-12 text-muted">D757246</span>
                              <div className="d-flex align-items-center mt-2 mb-2 dept-f-hod">
                                <span className="avatar avatar-xs me-1">
                                  <img
                                    src="assets/img/profiles/avatar-25.jpg"
                                    className="rounded-circle flex-shrink-0"
                                    alt="Daniel Josua"
                                  />
                                </span>
                                <span className="fs-12 text-dark">
                                  HoD: Daniel Josua
                                </span>
                              </div>
                              <div className="d-flex align-items-center flex-wrap gap-2">
                                <span className="badge badge-soft-secondary d-inline-flex align-items-center dept-f-staff">
                                  <i className="ti ti-users me-1" />
                                  96 Staff
                                </span>
                                <span className="badge badge-soft-info d-inline-flex align-items-center dept-f-teachers">
                                  <i className="ti ti-school me-1" />
                                  72 Teachers
                                </span>
                                <span className="badge badge-soft-success d-inline-flex align-items-center">
                                  <i className="ti ti-circle-filled fs-5 me-1" />
                                  Active
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div
                        className="card card-hover mb-0 dept-item"
                        data-dept-target="dept_3"
                        tabIndex={0}
                      >
                        <div className="card-body">
                          <div className="d-flex align-items-start">
                            <div className="form-check me-2">
                              <input
                                className="form-check-input dept-check"
                                type="checkbox"
                                aria-label="Select Library"
                              />
                            </div>
                            <span className="avatar avatar-lg bg-warning-transparent text-warning rounded me-3 flex-shrink-0">
                              <i className="ti ti-books fs-24" />
                            </span>
                            <div className="flex-fill overflow-hidden">
                              <div className="d-flex align-items-center justify-content-between">
                                <h6 className="mb-0 text-truncate">Library</h6>
                                <div className="dropdown">
                                  <a
                                    href="#"
                                    className="btn btn-icon btn-sm rounded-circle flex-shrink-0"
                                    data-bs-toggle="dropdown"
                                    aria-label="Department menu"
                                  >
                                    <i className="ti ti-dots-vertical" />
                                  </a>
                                  <ul className="dropdown-menu dropdown-menu-end p-2">
                                    <li>
                                      <a
                                        className="dropdown-item rounded-1"
                                        href="#"
                                        data-bs-toggle="modal"
                                        data-bs-target="#department_details"
                                      >
                                        <i className="ti ti-eye me-2" />
                                        View
                                      </a>
                                    </li>
                                    <li>
                                      <a
                                        className="dropdown-item rounded-1"
                                        href="#"
                                        data-bs-toggle="modal"
                                        data-bs-target="#edit_department"
                                      >
                                        <i className="ti ti-edit me-2" />
                                        Edit
                                      </a>
                                    </li>
                                    <li>
                                      <a
                                        className="dropdown-item rounded-1"
                                        href="#"
                                        data-bs-toggle="modal"
                                        data-bs-target="#assign_staff"
                                      >
                                        <i className="ti ti-user-plus me-2" />
                                        Assign Staff
                                      </a>
                                    </li>
                                    <li>
                                      <a
                                        className="dropdown-item rounded-1"
                                        href="#"
                                        data-bs-toggle="modal"
                                        data-bs-target="#assign_subjects"
                                      >
                                        <i className="ti ti-book me-2" />
                                        Assign Subjects
                                      </a>
                                    </li>
                                    <li>
                                      <hr className="dropdown-divider" />
                                    </li>
                                    <li>
                                      <a
                                        className="dropdown-item rounded-1"
                                        href="#"
                                      >
                                        <i className="ti ti-copy me-2" />
                                        Duplicate
                                      </a>
                                    </li>
                                    <li>
                                      <a
                                        className="dropdown-item rounded-1"
                                        href="#"
                                      >
                                        <i className="ti ti-archive me-2" />
                                        Archive
                                      </a>
                                    </li>
                                    <li>
                                      <a
                                        className="dropdown-item rounded-1 text-danger"
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
                              <span className="fs-12 text-muted">D757245</span>
                              <div className="d-flex align-items-center mt-2 mb-2 dept-f-hod">
                                <span className="avatar avatar-xs me-1">
                                  <img
                                    src="assets/img/profiles/avatar-01.jpg"
                                    className="rounded-circle flex-shrink-0"
                                    alt="Hellana Robert"
                                  />
                                </span>
                                <span className="fs-12 text-dark">
                                  HoD: Hellana Robert
                                </span>
                              </div>
                              <div className="d-flex align-items-center flex-wrap gap-2">
                                <span className="badge badge-soft-secondary d-inline-flex align-items-center dept-f-staff">
                                  <i className="ti ti-users me-1" />8 Staff
                                </span>
                                <span className="badge badge-soft-info d-inline-flex align-items-center dept-f-teachers">
                                  <i className="ti ti-school me-1" />2 Teachers
                                </span>
                                <span className="badge badge-soft-success d-inline-flex align-items-center">
                                  <i className="ti ti-circle-filled fs-5 me-1" />
                                  Active
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div
                        className="card card-hover mb-0 dept-item"
                        data-dept-target="dept_4"
                        tabIndex={0}
                      >
                        <div className="card-body">
                          <div className="d-flex align-items-start">
                            <div className="form-check me-2">
                              <input
                                className="form-check-input dept-check"
                                type="checkbox"
                                aria-label="Select Health"
                              />
                            </div>
                            <span className="avatar avatar-lg bg-danger-transparent text-danger rounded me-3 flex-shrink-0">
                              <i className="ti ti-heartbeat fs-24" />
                            </span>
                            <div className="flex-fill overflow-hidden">
                              <div className="d-flex align-items-center justify-content-between">
                                <h6 className="mb-0 text-truncate">Health</h6>
                                <div className="dropdown">
                                  <a
                                    href="#"
                                    className="btn btn-icon btn-sm rounded-circle flex-shrink-0"
                                    data-bs-toggle="dropdown"
                                    aria-label="Department menu"
                                  >
                                    <i className="ti ti-dots-vertical" />
                                  </a>
                                  <ul className="dropdown-menu dropdown-menu-end p-2">
                                    <li>
                                      <a
                                        className="dropdown-item rounded-1"
                                        href="#"
                                        data-bs-toggle="modal"
                                        data-bs-target="#department_details"
                                      >
                                        <i className="ti ti-eye me-2" />
                                        View
                                      </a>
                                    </li>
                                    <li>
                                      <a
                                        className="dropdown-item rounded-1"
                                        href="#"
                                        data-bs-toggle="modal"
                                        data-bs-target="#edit_department"
                                      >
                                        <i className="ti ti-edit me-2" />
                                        Edit
                                      </a>
                                    </li>
                                    <li>
                                      <a
                                        className="dropdown-item rounded-1"
                                        href="#"
                                        data-bs-toggle="modal"
                                        data-bs-target="#assign_staff"
                                      >
                                        <i className="ti ti-user-plus me-2" />
                                        Assign Staff
                                      </a>
                                    </li>
                                    <li>
                                      <a
                                        className="dropdown-item rounded-1"
                                        href="#"
                                        data-bs-toggle="modal"
                                        data-bs-target="#assign_subjects"
                                      >
                                        <i className="ti ti-book me-2" />
                                        Assign Subjects
                                      </a>
                                    </li>
                                    <li>
                                      <hr className="dropdown-divider" />
                                    </li>
                                    <li>
                                      <a
                                        className="dropdown-item rounded-1"
                                        href="#"
                                      >
                                        <i className="ti ti-copy me-2" />
                                        Duplicate
                                      </a>
                                    </li>
                                    <li>
                                      <a
                                        className="dropdown-item rounded-1"
                                        href="#"
                                      >
                                        <i className="ti ti-archive me-2" />
                                        Archive
                                      </a>
                                    </li>
                                    <li>
                                      <a
                                        className="dropdown-item rounded-1 text-danger"
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
                              <span className="fs-12 text-muted">D757244</span>
                              <div className="d-flex align-items-center mt-2 mb-2 dept-f-hod">
                                <span className="avatar avatar-xs me-1">
                                  <img
                                    src="assets/img/profiles/avatar-02.jpg"
                                    className="rounded-circle flex-shrink-0"
                                    alt="Morgan Lee"
                                  />
                                </span>
                                <span className="fs-12 text-dark">
                                  HoD: Morgan Lee
                                </span>
                              </div>
                              <div className="d-flex align-items-center flex-wrap gap-2">
                                <span className="badge badge-soft-secondary d-inline-flex align-items-center dept-f-staff">
                                  <i className="ti ti-users me-1" />6 Staff
                                </span>
                                <span className="badge badge-soft-info d-inline-flex align-items-center dept-f-teachers">
                                  <i className="ti ti-school me-1" />0 Teachers
                                </span>
                                <span className="badge badge-soft-danger d-inline-flex align-items-center">
                                  <i className="ti ti-circle-filled fs-5 me-1" />
                                  Inactive
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div
                        className="card card-hover mb-0 dept-item"
                        data-dept-target="dept_5"
                        tabIndex={0}
                      >
                        <div className="card-body">
                          <div className="d-flex align-items-start">
                            <div className="form-check me-2">
                              <input
                                className="form-check-input dept-check"
                                type="checkbox"
                                aria-label="Select Transport"
                              />
                            </div>
                            <span className="avatar avatar-lg bg-secondary-transparent text-secondary rounded me-3 flex-shrink-0">
                              <i className="ti ti-bus fs-24" />
                            </span>
                            <div className="flex-fill overflow-hidden">
                              <div className="d-flex align-items-center justify-content-between">
                                <h6 className="mb-0 text-truncate">
                                  Transport
                                </h6>
                                <div className="dropdown">
                                  <a
                                    href="#"
                                    className="btn btn-icon btn-sm rounded-circle flex-shrink-0"
                                    data-bs-toggle="dropdown"
                                    aria-label="Department menu"
                                  >
                                    <i className="ti ti-dots-vertical" />
                                  </a>
                                  <ul className="dropdown-menu dropdown-menu-end p-2">
                                    <li>
                                      <a
                                        className="dropdown-item rounded-1"
                                        href="#"
                                        data-bs-toggle="modal"
                                        data-bs-target="#department_details"
                                      >
                                        <i className="ti ti-eye me-2" />
                                        View
                                      </a>
                                    </li>
                                    <li>
                                      <a
                                        className="dropdown-item rounded-1"
                                        href="#"
                                        data-bs-toggle="modal"
                                        data-bs-target="#edit_department"
                                      >
                                        <i className="ti ti-edit me-2" />
                                        Edit
                                      </a>
                                    </li>
                                    <li>
                                      <a
                                        className="dropdown-item rounded-1"
                                        href="#"
                                        data-bs-toggle="modal"
                                        data-bs-target="#assign_staff"
                                      >
                                        <i className="ti ti-user-plus me-2" />
                                        Assign Staff
                                      </a>
                                    </li>
                                    <li>
                                      <a
                                        className="dropdown-item rounded-1"
                                        href="#"
                                        data-bs-toggle="modal"
                                        data-bs-target="#assign_subjects"
                                      >
                                        <i className="ti ti-book me-2" />
                                        Assign Subjects
                                      </a>
                                    </li>
                                    <li>
                                      <hr className="dropdown-divider" />
                                    </li>
                                    <li>
                                      <a
                                        className="dropdown-item rounded-1"
                                        href="#"
                                      >
                                        <i className="ti ti-copy me-2" />
                                        Duplicate
                                      </a>
                                    </li>
                                    <li>
                                      <a
                                        className="dropdown-item rounded-1"
                                        href="#"
                                      >
                                        <i className="ti ti-archive me-2" />
                                        Archive
                                      </a>
                                    </li>
                                    <li>
                                      <a
                                        className="dropdown-item rounded-1 text-danger"
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
                              <span className="fs-12 text-muted">D757243</span>
                              <div className="d-flex align-items-center mt-2 mb-2 dept-f-hod">
                                <span className="avatar avatar-xs me-1">
                                  <img
                                    src="assets/img/profiles/avatar-03.jpg"
                                    className="rounded-circle flex-shrink-0"
                                    alt="Aaron Cole"
                                  />
                                </span>
                                <span className="fs-12 text-dark">
                                  HoD: Aaron Cole
                                </span>
                              </div>
                              <div className="d-flex align-items-center flex-wrap gap-2">
                                <span className="badge badge-soft-secondary d-inline-flex align-items-center dept-f-staff">
                                  <i className="ti ti-users me-1" />
                                  18 Staff
                                </span>
                                <span className="badge badge-soft-info d-inline-flex align-items-center dept-f-teachers">
                                  <i className="ti ti-school me-1" />0 Teachers
                                </span>
                                <span className="badge badge-soft-success d-inline-flex align-items-center">
                                  <i className="ti ti-circle-filled fs-5 me-1" />
                                  Active
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div
                        className="card card-hover mb-0 dept-item"
                        data-dept-target="dept_6"
                        tabIndex={0}
                      >
                        <div className="card-body">
                          <div className="d-flex align-items-start">
                            <div className="form-check me-2">
                              <input
                                className="form-check-input dept-check"
                                type="checkbox"
                                aria-label="Select Hostel"
                              />
                            </div>
                            <span className="avatar avatar-lg bg-purple-transparent text-purple rounded me-3 flex-shrink-0">
                              <i className="ti ti-building-fortress fs-24" />
                            </span>
                            <div className="flex-fill overflow-hidden">
                              <div className="d-flex align-items-center justify-content-between">
                                <h6 className="mb-0 text-truncate">Hostel</h6>
                                <div className="dropdown">
                                  <a
                                    href="#"
                                    className="btn btn-icon btn-sm rounded-circle flex-shrink-0"
                                    data-bs-toggle="dropdown"
                                    aria-label="Department menu"
                                  >
                                    <i className="ti ti-dots-vertical" />
                                  </a>
                                  <ul className="dropdown-menu dropdown-menu-end p-2">
                                    <li>
                                      <a
                                        className="dropdown-item rounded-1"
                                        href="#"
                                        data-bs-toggle="modal"
                                        data-bs-target="#department_details"
                                      >
                                        <i className="ti ti-eye me-2" />
                                        View
                                      </a>
                                    </li>
                                    <li>
                                      <a
                                        className="dropdown-item rounded-1"
                                        href="#"
                                        data-bs-toggle="modal"
                                        data-bs-target="#edit_department"
                                      >
                                        <i className="ti ti-edit me-2" />
                                        Edit
                                      </a>
                                    </li>
                                    <li>
                                      <a
                                        className="dropdown-item rounded-1"
                                        href="#"
                                        data-bs-toggle="modal"
                                        data-bs-target="#assign_staff"
                                      >
                                        <i className="ti ti-user-plus me-2" />
                                        Assign Staff
                                      </a>
                                    </li>
                                    <li>
                                      <a
                                        className="dropdown-item rounded-1"
                                        href="#"
                                        data-bs-toggle="modal"
                                        data-bs-target="#assign_subjects"
                                      >
                                        <i className="ti ti-book me-2" />
                                        Assign Subjects
                                      </a>
                                    </li>
                                    <li>
                                      <hr className="dropdown-divider" />
                                    </li>
                                    <li>
                                      <a
                                        className="dropdown-item rounded-1"
                                        href="#"
                                      >
                                        <i className="ti ti-copy me-2" />
                                        Duplicate
                                      </a>
                                    </li>
                                    <li>
                                      <a
                                        className="dropdown-item rounded-1"
                                        href="#"
                                      >
                                        <i className="ti ti-archive me-2" />
                                        Archive
                                      </a>
                                    </li>
                                    <li>
                                      <a
                                        className="dropdown-item rounded-1 text-danger"
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
                              <span className="fs-12 text-muted">D757242</span>
                              <div className="d-flex align-items-center mt-2 mb-2 dept-f-hod">
                                <span className="avatar avatar-xs me-1">
                                  <img
                                    src="assets/img/profiles/avatar-05.jpg"
                                    className="rounded-circle flex-shrink-0"
                                    alt="Nina Patel"
                                  />
                                </span>
                                <span className="fs-12 text-dark">
                                  HoD: Nina Patel
                                </span>
                              </div>
                              <div className="d-flex align-items-center flex-wrap gap-2">
                                <span className="badge badge-soft-secondary d-inline-flex align-items-center dept-f-staff">
                                  <i className="ti ti-users me-1" />
                                  22 Staff
                                </span>
                                <span className="badge badge-soft-info d-inline-flex align-items-center dept-f-teachers">
                                  <i className="ti ti-school me-1" />0 Teachers
                                </span>
                                <span className="badge badge-soft-success d-inline-flex align-items-center">
                                  <i className="ti ti-circle-filled fs-5 me-1" />
                                  Active
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div
                        className="card card-hover mb-0 dept-item"
                        data-dept-target="dept_7"
                        tabIndex={0}
                      >
                        <div className="card-body">
                          <div className="d-flex align-items-start">
                            <div className="form-check me-2">
                              <input
                                className="form-check-input dept-check"
                                type="checkbox"
                                aria-label="Select Management"
                              />
                            </div>
                            <span className="avatar avatar-lg bg-primary-transparent text-primary rounded me-3 flex-shrink-0">
                              <i className="ti ti-briefcase fs-24" />
                            </span>
                            <div className="flex-fill overflow-hidden">
                              <div className="d-flex align-items-center justify-content-between">
                                <h6 className="mb-0 text-truncate">
                                  Management
                                </h6>
                                <div className="dropdown">
                                  <a
                                    href="#"
                                    className="btn btn-icon btn-sm rounded-circle flex-shrink-0"
                                    data-bs-toggle="dropdown"
                                    aria-label="Department menu"
                                  >
                                    <i className="ti ti-dots-vertical" />
                                  </a>
                                  <ul className="dropdown-menu dropdown-menu-end p-2">
                                    <li>
                                      <a
                                        className="dropdown-item rounded-1"
                                        href="#"
                                        data-bs-toggle="modal"
                                        data-bs-target="#department_details"
                                      >
                                        <i className="ti ti-eye me-2" />
                                        View
                                      </a>
                                    </li>
                                    <li>
                                      <a
                                        className="dropdown-item rounded-1"
                                        href="#"
                                        data-bs-toggle="modal"
                                        data-bs-target="#edit_department"
                                      >
                                        <i className="ti ti-edit me-2" />
                                        Edit
                                      </a>
                                    </li>
                                    <li>
                                      <a
                                        className="dropdown-item rounded-1"
                                        href="#"
                                        data-bs-toggle="modal"
                                        data-bs-target="#assign_staff"
                                      >
                                        <i className="ti ti-user-plus me-2" />
                                        Assign Staff
                                      </a>
                                    </li>
                                    <li>
                                      <a
                                        className="dropdown-item rounded-1"
                                        href="#"
                                        data-bs-toggle="modal"
                                        data-bs-target="#assign_subjects"
                                      >
                                        <i className="ti ti-book me-2" />
                                        Assign Subjects
                                      </a>
                                    </li>
                                    <li>
                                      <hr className="dropdown-divider" />
                                    </li>
                                    <li>
                                      <a
                                        className="dropdown-item rounded-1"
                                        href="#"
                                      >
                                        <i className="ti ti-copy me-2" />
                                        Duplicate
                                      </a>
                                    </li>
                                    <li>
                                      <a
                                        className="dropdown-item rounded-1"
                                        href="#"
                                      >
                                        <i className="ti ti-archive me-2" />
                                        Archive
                                      </a>
                                    </li>
                                    <li>
                                      <a
                                        className="dropdown-item rounded-1 text-danger"
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
                              <span className="fs-12 text-muted">D757241</span>
                              <div className="d-flex align-items-center mt-2 mb-2 dept-f-hod">
                                <span className="avatar avatar-xs me-1">
                                  <img
                                    src="assets/img/profiles/avatar-06.jpg"
                                    className="rounded-circle flex-shrink-0"
                                    alt="Alan Poe"
                                  />
                                </span>
                                <span className="fs-12 text-dark">
                                  HoD: Alan Poe
                                </span>
                              </div>
                              <div className="d-flex align-items-center flex-wrap gap-2">
                                <span className="badge badge-soft-secondary d-inline-flex align-items-center dept-f-staff">
                                  <i className="ti ti-users me-1" />
                                  12 Staff
                                </span>
                                <span className="badge badge-soft-info d-inline-flex align-items-center dept-f-teachers">
                                  <i className="ti ti-school me-1" />0 Teachers
                                </span>
                                <span className="badge badge-soft-success d-inline-flex align-items-center">
                                  <i className="ti ti-circle-filled fs-5 me-1" />
                                  Active
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div
                        className="card card-hover mb-0 dept-item"
                        data-dept-target="dept_8"
                        tabIndex={0}
                      >
                        <div className="card-body">
                          <div className="d-flex align-items-start">
                            <div className="form-check me-2">
                              <input
                                className="form-check-input dept-check"
                                type="checkbox"
                                aria-label="Select Guidance"
                              />
                            </div>
                            <span className="avatar avatar-lg bg-info-transparent text-info rounded me-3 flex-shrink-0">
                              <i className="ti ti-user-heart fs-24" />
                            </span>
                            <div className="flex-fill overflow-hidden">
                              <div className="d-flex align-items-center justify-content-between">
                                <h6 className="mb-0 text-truncate">Guidance</h6>
                                <div className="dropdown">
                                  <a
                                    href="#"
                                    className="btn btn-icon btn-sm rounded-circle flex-shrink-0"
                                    data-bs-toggle="dropdown"
                                    aria-label="Department menu"
                                  >
                                    <i className="ti ti-dots-vertical" />
                                  </a>
                                  <ul className="dropdown-menu dropdown-menu-end p-2">
                                    <li>
                                      <a
                                        className="dropdown-item rounded-1"
                                        href="#"
                                        data-bs-toggle="modal"
                                        data-bs-target="#department_details"
                                      >
                                        <i className="ti ti-eye me-2" />
                                        View
                                      </a>
                                    </li>
                                    <li>
                                      <a
                                        className="dropdown-item rounded-1"
                                        href="#"
                                        data-bs-toggle="modal"
                                        data-bs-target="#edit_department"
                                      >
                                        <i className="ti ti-edit me-2" />
                                        Edit
                                      </a>
                                    </li>
                                    <li>
                                      <a
                                        className="dropdown-item rounded-1"
                                        href="#"
                                        data-bs-toggle="modal"
                                        data-bs-target="#assign_staff"
                                      >
                                        <i className="ti ti-user-plus me-2" />
                                        Assign Staff
                                      </a>
                                    </li>
                                    <li>
                                      <a
                                        className="dropdown-item rounded-1"
                                        href="#"
                                        data-bs-toggle="modal"
                                        data-bs-target="#assign_subjects"
                                      >
                                        <i className="ti ti-book me-2" />
                                        Assign Subjects
                                      </a>
                                    </li>
                                    <li>
                                      <hr className="dropdown-divider" />
                                    </li>
                                    <li>
                                      <a
                                        className="dropdown-item rounded-1"
                                        href="#"
                                      >
                                        <i className="ti ti-copy me-2" />
                                        Duplicate
                                      </a>
                                    </li>
                                    <li>
                                      <a
                                        className="dropdown-item rounded-1"
                                        href="#"
                                      >
                                        <i className="ti ti-archive me-2" />
                                        Archive
                                      </a>
                                    </li>
                                    <li>
                                      <a
                                        className="dropdown-item rounded-1 text-danger"
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
                              <span className="fs-12 text-muted">D757240</span>
                              <div className="d-flex align-items-center mt-2 mb-2 dept-f-hod">
                                <span className="avatar avatar-xs me-1">
                                  <img
                                    src="assets/img/profiles/avatar-07.jpg"
                                    className="rounded-circle flex-shrink-0"
                                    alt="Carla Reed"
                                  />
                                </span>
                                <span className="fs-12 text-dark">
                                  HoD: Carla Reed
                                </span>
                              </div>
                              <div className="d-flex align-items-center flex-wrap gap-2">
                                <span className="badge badge-soft-secondary d-inline-flex align-items-center dept-f-staff">
                                  <i className="ti ti-users me-1" />9 Staff
                                </span>
                                <span className="badge badge-soft-info d-inline-flex align-items-center dept-f-teachers">
                                  <i className="ti ti-school me-1" />4 Teachers
                                </span>
                                <span className="badge badge-soft-danger d-inline-flex align-items-center">
                                  <i className="ti ti-circle-filled fs-5 me-1" />
                                  Inactive
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div
                        className="card card-hover mb-0 dept-item"
                        data-dept-target="dept_9"
                        tabIndex={0}
                      >
                        <div className="card-body">
                          <div className="d-flex align-items-start">
                            <div className="form-check me-2">
                              <input
                                className="form-check-input dept-check"
                                type="checkbox"
                                aria-label="Select Sports"
                              />
                            </div>
                            <span className="avatar avatar-lg bg-success-transparent text-success rounded me-3 flex-shrink-0">
                              <i className="ti ti-ball-football fs-24" />
                            </span>
                            <div className="flex-fill overflow-hidden">
                              <div className="d-flex align-items-center justify-content-between">
                                <h6 className="mb-0 text-truncate">Sports</h6>
                                <div className="dropdown">
                                  <a
                                    href="#"
                                    className="btn btn-icon btn-sm rounded-circle flex-shrink-0"
                                    data-bs-toggle="dropdown"
                                    aria-label="Department menu"
                                  >
                                    <i className="ti ti-dots-vertical" />
                                  </a>
                                  <ul className="dropdown-menu dropdown-menu-end p-2">
                                    <li>
                                      <a
                                        className="dropdown-item rounded-1"
                                        href="#"
                                        data-bs-toggle="modal"
                                        data-bs-target="#department_details"
                                      >
                                        <i className="ti ti-eye me-2" />
                                        View
                                      </a>
                                    </li>
                                    <li>
                                      <a
                                        className="dropdown-item rounded-1"
                                        href="#"
                                        data-bs-toggle="modal"
                                        data-bs-target="#edit_department"
                                      >
                                        <i className="ti ti-edit me-2" />
                                        Edit
                                      </a>
                                    </li>
                                    <li>
                                      <a
                                        className="dropdown-item rounded-1"
                                        href="#"
                                        data-bs-toggle="modal"
                                        data-bs-target="#assign_staff"
                                      >
                                        <i className="ti ti-user-plus me-2" />
                                        Assign Staff
                                      </a>
                                    </li>
                                    <li>
                                      <a
                                        className="dropdown-item rounded-1"
                                        href="#"
                                        data-bs-toggle="modal"
                                        data-bs-target="#assign_subjects"
                                      >
                                        <i className="ti ti-book me-2" />
                                        Assign Subjects
                                      </a>
                                    </li>
                                    <li>
                                      <hr className="dropdown-divider" />
                                    </li>
                                    <li>
                                      <a
                                        className="dropdown-item rounded-1"
                                        href="#"
                                      >
                                        <i className="ti ti-copy me-2" />
                                        Duplicate
                                      </a>
                                    </li>
                                    <li>
                                      <a
                                        className="dropdown-item rounded-1"
                                        href="#"
                                      >
                                        <i className="ti ti-archive me-2" />
                                        Archive
                                      </a>
                                    </li>
                                    <li>
                                      <a
                                        className="dropdown-item rounded-1 text-danger"
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
                              <span className="fs-12 text-muted">D757239</span>
                              <div className="d-flex align-items-center mt-2 mb-2 dept-f-hod">
                                <span className="avatar avatar-xs me-1">
                                  <img
                                    src="assets/img/profiles/avatar-08.jpg"
                                    className="rounded-circle flex-shrink-0"
                                    alt="Rita Owen"
                                  />
                                </span>
                                <span className="fs-12 text-dark">
                                  HoD: Rita Owen
                                </span>
                              </div>
                              <div className="d-flex align-items-center flex-wrap gap-2">
                                <span className="badge badge-soft-secondary d-inline-flex align-items-center dept-f-staff">
                                  <i className="ti ti-users me-1" />
                                  16 Staff
                                </span>
                                <span className="badge badge-soft-info d-inline-flex align-items-center dept-f-teachers">
                                  <i className="ti ti-school me-1" />6 Teachers
                                </span>
                                <span className="badge badge-soft-success d-inline-flex align-items-center">
                                  <i className="ti ti-circle-filled fs-5 me-1" />
                                  Active
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Empty State */}
                    <div className="card mb-0 d-none" id="dept_empty">
                      <div className="card-body text-center py-5">
                        <span className="avatar avatar-xxl bg-primary-transparent text-primary rounded-circle flex-shrink-0 mx-auto mb-3">
                          <i className="ti ti-building-off display-6" />
                        </span>
                        <h5 className="mb-1">No Departments Found</h5>
                        <p className="text-muted mb-3">
                          Create a department to organize staff, subjects and
                          academic ownership across the campus.
                        </p>
                        <button
                          type="button"
                          className="btn btn-primary d-inline-flex align-items-center mx-auto"
                          data-bs-toggle="modal"
                          data-bs-target="#add_department"
                        >
                          <i className="ti ti-square-rounded-plus me-1" />
                          Create Department
                        </button>
                      </div>
                    </div>
                  </div>
                  {/* /Master */}
                  {/* Detail: Department Profile */}
                  <div className="col-xxl-8 col-lg-7">
                    <div className="dept-pane" id="dept_0">
                      <div className="card mb-0 dept-detail">
                        <div className="p-4 bg-primary-transparent rounded-top">
                          <div className="d-flex flex-wrap gap-3 align-items-start justify-content-between">
                            <div className="d-flex align-items-center mb-3 mb-xl-0">
                              <span className="avatar avatar-xl bg-white text-primary rounded me-3 flex-shrink-0">
                                <i className="ti ti-shield-cog fs-28" />
                              </span>
                              <div>
                                <div className="d-flex align-items-center flex-wrap gap-2 mb-1">
                                  <h4 className="mb-0">Admin</h4>
                                  <span className="badge bg-primary-transparent text-primary">
                                    D757248
                                  </span>
                                  <span className="badge badge-soft-success d-inline-flex align-items-center">
                                    <i className="ti ti-circle-filled fs-5 me-1" />
                                    Active
                                  </span>
                                </div>
                                <p className="mb-0 text-muted">
                                  Oversees institutional administration,
                                  records, correspondence and compliance across
                                  the campus.
                                </p>
                              </div>
                            </div>
                            <div className="d-flex align-items-center flex-wrap gap-1">
                              <a
                                href="#"
                                className="btn btn-outline-light bg-white btn-icon btn-sm rounded-circle flex-shrink-0"
                                data-bs-toggle="modal"
                                data-bs-target="#department_details"
                                title="View"
                                aria-label="View"
                              >
                                <i className="ti ti-eye" />
                              </a>
                              <a
                                href="#"
                                className="btn btn-outline-light bg-white btn-icon btn-sm rounded-circle flex-shrink-0"
                                data-bs-toggle="modal"
                                data-bs-target="#edit_department"
                                title="Edit"
                                aria-label="Edit"
                              >
                                <i className="ti ti-edit" />
                              </a>
                              <a
                                href="#"
                                className="btn btn-outline-light bg-white btn-icon btn-sm rounded-circle flex-shrink-0"
                                data-bs-toggle="modal"
                                data-bs-target="#assign_staff"
                                title="Assign Staff"
                                aria-label="Assign Staff"
                              >
                                <i className="ti ti-user-plus" />
                              </a>
                              <a
                                href="#"
                                className="btn btn-outline-light bg-white btn-icon btn-sm rounded-circle flex-shrink-0"
                                data-bs-toggle="modal"
                                data-bs-target="#assign_subjects"
                                title="Assign Subjects"
                                aria-label="Assign Subjects"
                              >
                                <i className="ti ti-book" />
                              </a>
                              <a
                                href="#"
                                className="btn btn-outline-light bg-white btn-icon btn-sm rounded-circle flex-shrink-0"
                                data-bs-toggle="modal"
                                data-bs-target="#edit_department"
                                title="Department Settings"
                                aria-label="Department Settings"
                              >
                                <i className="ti ti-settings" />
                              </a>
                              <a
                                href="#"
                                className="btn btn-outline-light bg-white btn-icon btn-sm rounded-circle flex-shrink-0"
                                data-dept-print=""
                                data-bs-toggle="tooltip"
                                title="Print"
                                aria-label="Print"
                              >
                                <i className="ti ti-printer" />
                              </a>
                              <div className="dropdown">
                                <a
                                  href="#"
                                  className="btn btn-outline-light bg-white btn-icon btn-sm rounded-circle flex-shrink-0"
                                  data-bs-toggle="dropdown"
                                  aria-label="More"
                                >
                                  <i className="ti ti-dots-vertical" />
                                </a>
                                <ul className="dropdown-menu dropdown-menu-end p-2">
                                  <li>
                                    <a
                                      className="dropdown-item rounded-1"
                                      href="#"
                                    >
                                      <i className="ti ti-copy me-2" />
                                      Duplicate
                                    </a>
                                  </li>
                                  <li>
                                    <a
                                      className="dropdown-item rounded-1"
                                      href="#"
                                    >
                                      <i className="ti ti-archive me-2" />
                                      Archive
                                    </a>
                                  </li>
                                  <li>
                                    <a
                                      className="dropdown-item rounded-1 text-danger"
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
                        </div>
                        <div className="card-body">
                          <h5 className="mb-3 fs-15">Department Information</h5>
                          <div className="row g-3 mb-4">
                            <div className="col-md-6 col-xl-4">
                              <div className="d-flex align-items-center">
                                <span className="avatar avatar-md bg-primary-transparent text-primary rounded me-2 flex-shrink-0">
                                  <i className="ti ti-user-star fs-20" />
                                </span>
                                <div className="overflow-hidden">
                                  <p className="fs-12 text-muted mb-0">
                                    Head of Department
                                  </p>
                                  <p className="mb-0 fw-medium text-dark text-truncate">
                                    Kevin Larry
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6 col-xl-4">
                              <div className="d-flex align-items-center">
                                <span className="avatar avatar-md bg-success-transparent text-success rounded me-2 flex-shrink-0">
                                  <i className="ti ti-phone fs-20" />
                                </span>
                                <div className="overflow-hidden">
                                  <p className="fs-12 text-muted mb-0">
                                    Contact Information
                                  </p>
                                  <p className="mb-0 fw-medium text-dark text-truncate">
                                    +1 46548 84400
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6 col-xl-4">
                              <div className="d-flex align-items-center">
                                <span className="avatar avatar-md bg-info-transparent text-info rounded me-2 flex-shrink-0">
                                  <i className="ti ti-map-pin fs-20" />
                                </span>
                                <div className="overflow-hidden">
                                  <p className="fs-12 text-muted mb-0">
                                    Location
                                  </p>
                                  <p className="mb-0 fw-medium text-dark text-truncate">
                                    Block A, Floor 1
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6 col-xl-4">
                              <div className="d-flex align-items-center">
                                <span className="avatar avatar-md bg-warning-transparent text-warning rounded me-2 flex-shrink-0">
                                  <i className="ti ti-calendar fs-20" />
                                </span>
                                <div className="overflow-hidden">
                                  <p className="fs-12 text-muted mb-0">
                                    Established Date
                                  </p>
                                  <p className="mb-0 fw-medium text-dark text-truncate">
                                    12 Jan 2015
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6 col-xl-4">
                              <div className="d-flex align-items-center">
                                <span className="avatar avatar-md bg-purple-transparent text-purple rounded me-2 flex-shrink-0">
                                  <i className="ti ti-users fs-20" />
                                </span>
                                <div className="overflow-hidden">
                                  <p className="fs-12 text-muted mb-0">
                                    Total Employees
                                  </p>
                                  <p className="mb-0 fw-medium text-dark text-truncate">
                                    24
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6 col-xl-4">
                              <div className="d-flex align-items-center">
                                <span className="avatar avatar-md bg-danger-transparent text-danger rounded me-2 flex-shrink-0">
                                  <i className="ti ti-book fs-20" />
                                </span>
                                <div className="overflow-hidden">
                                  <p className="fs-12 text-muted mb-0">
                                    Total Subjects
                                  </p>
                                  <p className="mb-0 fw-medium text-dark text-truncate">
                                    0
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6 col-xl-4">
                              <div className="d-flex align-items-center">
                                <span className="avatar avatar-md bg-secondary-transparent text-secondary rounded me-2 flex-shrink-0">
                                  <i className="ti ti-clipboard-list fs-20" />
                                </span>
                                <div className="overflow-hidden">
                                  <p className="fs-12 text-muted mb-0">
                                    Assigned Classes
                                  </p>
                                  <p className="mb-0 fw-medium text-dark text-truncate">
                                    0
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6 col-xl-4">
                              <div className="d-flex align-items-center">
                                <span className="avatar avatar-md bg-info-transparent text-info rounded me-2 flex-shrink-0">
                                  <i className="ti ti-school fs-20" />
                                </span>
                                <div className="overflow-hidden">
                                  <p className="fs-12 text-muted mb-0">
                                    Active Teachers
                                  </p>
                                  <p className="mb-0 fw-medium text-dark text-truncate">
                                    0
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6 col-xl-4">
                              <div className="d-flex align-items-center">
                                <span className="avatar avatar-md bg-primary-transparent text-primary rounded me-2 flex-shrink-0">
                                  <i className="ti ti-phone-plus fs-20" />
                                </span>
                                <div className="overflow-hidden">
                                  <p className="fs-12 text-muted mb-0">
                                    Office Extension
                                  </p>
                                  <p className="mb-0 fw-medium text-dark text-truncate">
                                    Ext. 101
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6 col-xl-4">
                              <div className="d-flex align-items-center">
                                <span className="avatar avatar-md bg-success-transparent text-success rounded me-2 flex-shrink-0">
                                  <i className="ti ti-mail fs-20" />
                                </span>
                                <div className="overflow-hidden">
                                  <p className="fs-12 text-muted mb-0">
                                    Department Email
                                  </p>
                                  <p className="mb-0 fw-medium text-dark text-truncate">
                                    admin@preskool.com
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="d-flex align-items-center justify-content-between mb-3">
                            <h6 className="mb-0">Assigned Staff</h6>
                            <a
                              href="#"
                              className="btn btn-sm btn-outline-light bg-white"
                              data-bs-toggle="modal"
                              data-bs-target="#assign_staff"
                            >
                              <i className="ti ti-user-plus me-1" />
                              Assign
                            </a>
                          </div>
                          <div className="row g-3 mb-4">
                            <div className="col-6">
                              <div className="card card-hover mb-0 h-100">
                                <div className="card-body text-center">
                                  <span className="avatar avatar-lg rounded-circle flex-shrink-0 mb-2">
                                    <img
                                      src="assets/img/teachers/teacher-01.jpg"
                                      className="rounded-circle flex-shrink-0"
                                      alt="Teresa Susan"
                                    />
                                  </span>
                                  <h6 className="mb-0 text-truncate">
                                    Teresa Susan
                                  </h6>
                                  <span className="fs-12 text-muted d-block mb-2">
                                    Senior Teacher
                                  </span>
                                  <div className="d-flex align-items-center justify-content-center flex-wrap gap-1 mb-2">
                                    <span className="badge badge-soft-primary">
                                      Physics
                                    </span>
                                    <span className="badge badge-soft-success">
                                      Active
                                    </span>
                                  </div>
                                  <a
                                    href="tel:+14654884498"
                                    className="fs-12 text-muted d-inline-flex align-items-center"
                                  >
                                    <i className="ti ti-phone me-1" />
                                    +1 46548 84498
                                  </a>
                                </div>
                              </div>
                            </div>
                            <div className="col-6">
                              <div className="card card-hover mb-0 h-100">
                                <div className="card-body text-center">
                                  <span className="avatar avatar-lg rounded-circle flex-shrink-0 mb-2">
                                    <img
                                      src="assets/img/teachers/teacher-02.jpg"
                                      className="rounded-circle flex-shrink-0"
                                      alt="John Doe"
                                    />
                                  </span>
                                  <h6 className="mb-0 text-truncate">
                                    John Doe
                                  </h6>
                                  <span className="fs-12 text-muted d-block mb-2">
                                    Coordinator
                                  </span>
                                  <div className="d-flex align-items-center justify-content-center flex-wrap gap-1 mb-2">
                                    <span className="badge badge-soft-primary">
                                      Science
                                    </span>
                                    <span className="badge badge-soft-success">
                                      Active
                                    </span>
                                  </div>
                                  <a
                                    href="tel:+14654811223"
                                    className="fs-12 text-muted d-inline-flex align-items-center"
                                  >
                                    <i className="ti ti-phone me-1" />
                                    +1 46548 11223
                                  </a>
                                </div>
                              </div>
                            </div>
                            <div className="col-6">
                              <div className="card card-hover mb-0 h-100">
                                <div className="card-body text-center">
                                  <span className="avatar avatar-lg rounded-circle flex-shrink-0 mb-2">
                                    <img
                                      src="assets/img/teachers/teacher-03.jpg"
                                      className="rounded-circle flex-shrink-0"
                                      alt="Hellana Robert"
                                    />
                                  </span>
                                  <h6 className="mb-0 text-truncate">
                                    Hellana Robert
                                  </h6>
                                  <span className="fs-12 text-muted d-block mb-2">
                                    Teacher
                                  </span>
                                  <div className="d-flex align-items-center justify-content-center flex-wrap gap-1 mb-2">
                                    <span className="badge badge-soft-primary">
                                      English
                                    </span>
                                    <span className="badge badge-soft-warning">
                                      On Leave
                                    </span>
                                  </div>
                                  <a
                                    href="tel:+14654855667"
                                    className="fs-12 text-muted d-inline-flex align-items-center"
                                  >
                                    <i className="ti ti-phone me-1" />
                                    +1 46548 55667
                                  </a>
                                </div>
                              </div>
                            </div>
                            <div className="col-6">
                              <div className="card card-hover mb-0 h-100">
                                <div className="card-body text-center">
                                  <span className="avatar avatar-lg rounded-circle flex-shrink-0 mb-2">
                                    <img
                                      src="assets/img/teachers/teacher-05.jpg"
                                      className="rounded-circle flex-shrink-0"
                                      alt="Morgan Lee"
                                    />
                                  </span>
                                  <h6 className="mb-0 text-truncate">
                                    Morgan Lee
                                  </h6>
                                  <span className="fs-12 text-muted d-block mb-2">
                                    Assistant
                                  </span>
                                  <div className="d-flex align-items-center justify-content-center flex-wrap gap-1 mb-2">
                                    <span className="badge badge-soft-primary">
                                      Maths
                                    </span>
                                    <span className="badge badge-soft-success">
                                      Active
                                    </span>
                                  </div>
                                  <a
                                    href="tel:+14654899001"
                                    className="fs-12 text-muted d-inline-flex align-items-center"
                                  >
                                    <i className="ti ti-phone me-1" />
                                    +1 46548 99001
                                  </a>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="d-flex align-items-center justify-content-between mb-3">
                            <h6 className="mb-0">Subjects</h6>
                            <a
                              href="#"
                              className="btn btn-sm btn-outline-light bg-white"
                              data-bs-toggle="modal"
                              data-bs-target="#assign_subjects"
                            >
                              <i className="ti ti-book me-1" />
                              Assign
                            </a>
                          </div>
                          <div className="row g-3">
                            <div className="col-sm-6 col-xl-4">
                              <div className="border rounded p-3 d-flex align-items-center">
                                <span className="avatar avatar-md bg-primary-transparent text-primary rounded me-2 flex-shrink-0">
                                  <i className="ti ti-book fs-20" />
                                </span>
                                <div className="overflow-hidden">
                                  <p className="mb-0 fw-medium text-dark text-truncate">
                                    Mathematics
                                  </p>
                                  <span className="fs-12 text-muted">
                                    MTH-101 · 6 Teachers
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="col-sm-6 col-xl-4">
                              <div className="border rounded p-3 d-flex align-items-center">
                                <span className="avatar avatar-md bg-info-transparent text-info rounded me-2 flex-shrink-0">
                                  <i className="ti ti-book fs-20" />
                                </span>
                                <div className="overflow-hidden">
                                  <p className="mb-0 fw-medium text-dark text-truncate">
                                    Physics
                                  </p>
                                  <span className="fs-12 text-muted">
                                    PHY-102 · 4 Teachers
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="col-sm-6 col-xl-4">
                              <div className="border rounded p-3 d-flex align-items-center">
                                <span className="avatar avatar-md bg-success-transparent text-success rounded me-2 flex-shrink-0">
                                  <i className="ti ti-book fs-20" />
                                </span>
                                <div className="overflow-hidden">
                                  <p className="mb-0 fw-medium text-dark text-truncate">
                                    Chemistry
                                  </p>
                                  <span className="fs-12 text-muted">
                                    CHM-103 · 3 Teachers
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="col-sm-6 col-xl-4">
                              <div className="border rounded p-3 d-flex align-items-center">
                                <span className="avatar avatar-md bg-warning-transparent text-warning rounded me-2 flex-shrink-0">
                                  <i className="ti ti-book fs-20" />
                                </span>
                                <div className="overflow-hidden">
                                  <p className="mb-0 fw-medium text-dark text-truncate">
                                    English
                                  </p>
                                  <span className="fs-12 text-muted">
                                    ENG-104 · 5 Teachers
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="col-sm-6 col-xl-4">
                              <div className="border rounded p-3 d-flex align-items-center">
                                <span className="avatar avatar-md bg-danger-transparent text-danger rounded me-2 flex-shrink-0">
                                  <i className="ti ti-book fs-20" />
                                </span>
                                <div className="overflow-hidden">
                                  <p className="mb-0 fw-medium text-dark text-truncate">
                                    Computer Science
                                  </p>
                                  <span className="fs-12 text-muted">
                                    CSC-105 · 4 Teachers
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="dept-pane d-none" id="dept_1">
                      <div className="card mb-0 dept-detail">
                        <div className="p-4 bg-success-transparent rounded-top">
                          <div className="d-xl-flex align-items-start justify-content-between">
                            <div className="d-flex align-items-center mb-3 mb-xl-0">
                              <span className="avatar avatar-xl bg-white text-success rounded me-3 flex-shrink-0">
                                <i className="ti ti-report-money fs-28" />
                              </span>
                              <div>
                                <div className="d-flex align-items-center flex-wrap gap-2 mb-1">
                                  <h4 className="mb-0">Finance</h4>
                                  <span className="badge bg-success-transparent text-success">
                                    D757247
                                  </span>
                                  <span className="badge badge-soft-success d-inline-flex align-items-center">
                                    <i className="ti ti-circle-filled fs-5 me-1" />
                                    Active
                                  </span>
                                </div>
                                <p className="mb-0 text-muted">
                                  Manages budgeting, fee collection, payroll,
                                  procurement and financial reporting.
                                </p>
                              </div>
                            </div>
                            <div className="d-flex align-items-center flex-wrap gap-1">
                              <a
                                href="#"
                                className="btn btn-outline-light bg-white btn-icon btn-sm rounded-circle flex-shrink-0"
                                data-bs-toggle="modal"
                                data-bs-target="#department_details"
                                title="View"
                                aria-label="View"
                              >
                                <i className="ti ti-eye" />
                              </a>
                              <a
                                href="#"
                                className="btn btn-outline-light bg-white btn-icon btn-sm rounded-circle flex-shrink-0"
                                data-bs-toggle="modal"
                                data-bs-target="#edit_department"
                                title="Edit"
                                aria-label="Edit"
                              >
                                <i className="ti ti-edit" />
                              </a>
                              <a
                                href="#"
                                className="btn btn-outline-light bg-white btn-icon btn-sm rounded-circle flex-shrink-0"
                                data-bs-toggle="modal"
                                data-bs-target="#assign_staff"
                                title="Assign Staff"
                                aria-label="Assign Staff"
                              >
                                <i className="ti ti-user-plus" />
                              </a>
                              <a
                                href="#"
                                className="btn btn-outline-light bg-white btn-icon btn-sm rounded-circle flex-shrink-0"
                                data-bs-toggle="modal"
                                data-bs-target="#assign_subjects"
                                title="Assign Subjects"
                                aria-label="Assign Subjects"
                              >
                                <i className="ti ti-book" />
                              </a>
                              <a
                                href="#"
                                className="btn btn-outline-light bg-white btn-icon btn-sm rounded-circle flex-shrink-0"
                                data-bs-toggle="modal"
                                data-bs-target="#edit_department"
                                title="Department Settings"
                                aria-label="Department Settings"
                              >
                                <i className="ti ti-settings" />
                              </a>
                              <a
                                href="#"
                                className="btn btn-outline-light bg-white btn-icon btn-sm rounded-circle flex-shrink-0"
                                data-dept-print=""
                                data-bs-toggle="tooltip"
                                title="Print"
                                aria-label="Print"
                              >
                                <i className="ti ti-printer" />
                              </a>
                              <div className="dropdown">
                                <a
                                  href="#"
                                  className="btn btn-outline-light bg-white btn-icon btn-sm rounded-circle flex-shrink-0"
                                  data-bs-toggle="dropdown"
                                  aria-label="More"
                                >
                                  <i className="ti ti-dots-vertical" />
                                </a>
                                <ul className="dropdown-menu dropdown-menu-end p-2">
                                  <li>
                                    <a
                                      className="dropdown-item rounded-1"
                                      href="#"
                                    >
                                      <i className="ti ti-copy me-2" />
                                      Duplicate
                                    </a>
                                  </li>
                                  <li>
                                    <a
                                      className="dropdown-item rounded-1"
                                      href="#"
                                    >
                                      <i className="ti ti-archive me-2" />
                                      Archive
                                    </a>
                                  </li>
                                  <li>
                                    <a
                                      className="dropdown-item rounded-1 text-danger"
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
                        </div>
                        <div className="card-body">
                          <h5 className="mb-3 fs-15">Department Information</h5>
                          <div className="row g-3 mb-4">
                            <div className="col-md-6 col-xl-4">
                              <div className="d-flex align-items-center">
                                <span className="avatar avatar-md bg-primary-transparent text-primary rounded me-2 flex-shrink-0">
                                  <i className="ti ti-user-star fs-20" />
                                </span>
                                <div className="overflow-hidden">
                                  <p className="fs-12 text-muted mb-0">
                                    Head of Department
                                  </p>
                                  <p className="mb-0 fw-medium text-dark text-truncate">
                                    Teresa Susan
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6 col-xl-4">
                              <div className="d-flex align-items-center">
                                <span className="avatar avatar-md bg-success-transparent text-success rounded me-2 flex-shrink-0">
                                  <i className="ti ti-phone fs-20" />
                                </span>
                                <div className="overflow-hidden">
                                  <p className="fs-12 text-muted mb-0">
                                    Contact Information
                                  </p>
                                  <p className="mb-0 fw-medium text-dark text-truncate">
                                    +1 46548 84401
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6 col-xl-4">
                              <div className="d-flex align-items-center">
                                <span className="avatar avatar-md bg-info-transparent text-info rounded me-2 flex-shrink-0">
                                  <i className="ti ti-map-pin fs-20" />
                                </span>
                                <div className="overflow-hidden">
                                  <p className="fs-12 text-muted mb-0">
                                    Location
                                  </p>
                                  <p className="mb-0 fw-medium text-dark text-truncate">
                                    Block A, Floor 2
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6 col-xl-4">
                              <div className="d-flex align-items-center">
                                <span className="avatar avatar-md bg-warning-transparent text-warning rounded me-2 flex-shrink-0">
                                  <i className="ti ti-calendar fs-20" />
                                </span>
                                <div className="overflow-hidden">
                                  <p className="fs-12 text-muted mb-0">
                                    Established Date
                                  </p>
                                  <p className="mb-0 fw-medium text-dark text-truncate">
                                    12 Jan 2016
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6 col-xl-4">
                              <div className="d-flex align-items-center">
                                <span className="avatar avatar-md bg-purple-transparent text-purple rounded me-2 flex-shrink-0">
                                  <i className="ti ti-users fs-20" />
                                </span>
                                <div className="overflow-hidden">
                                  <p className="fs-12 text-muted mb-0">
                                    Total Employees
                                  </p>
                                  <p className="mb-0 fw-medium text-dark text-truncate">
                                    14
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6 col-xl-4">
                              <div className="d-flex align-items-center">
                                <span className="avatar avatar-md bg-danger-transparent text-danger rounded me-2 flex-shrink-0">
                                  <i className="ti ti-book fs-20" />
                                </span>
                                <div className="overflow-hidden">
                                  <p className="fs-12 text-muted mb-0">
                                    Total Subjects
                                  </p>
                                  <p className="mb-0 fw-medium text-dark text-truncate">
                                    0
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6 col-xl-4">
                              <div className="d-flex align-items-center">
                                <span className="avatar avatar-md bg-secondary-transparent text-secondary rounded me-2 flex-shrink-0">
                                  <i className="ti ti-clipboard-list fs-20" />
                                </span>
                                <div className="overflow-hidden">
                                  <p className="fs-12 text-muted mb-0">
                                    Assigned Classes
                                  </p>
                                  <p className="mb-0 fw-medium text-dark text-truncate">
                                    0
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6 col-xl-4">
                              <div className="d-flex align-items-center">
                                <span className="avatar avatar-md bg-info-transparent text-info rounded me-2 flex-shrink-0">
                                  <i className="ti ti-school fs-20" />
                                </span>
                                <div className="overflow-hidden">
                                  <p className="fs-12 text-muted mb-0">
                                    Active Teachers
                                  </p>
                                  <p className="mb-0 fw-medium text-dark text-truncate">
                                    0
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6 col-xl-4">
                              <div className="d-flex align-items-center">
                                <span className="avatar avatar-md bg-primary-transparent text-primary rounded me-2 flex-shrink-0">
                                  <i className="ti ti-phone-plus fs-20" />
                                </span>
                                <div className="overflow-hidden">
                                  <p className="fs-12 text-muted mb-0">
                                    Office Extension
                                  </p>
                                  <p className="mb-0 fw-medium text-dark text-truncate">
                                    Ext. 102
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6 col-xl-4">
                              <div className="d-flex align-items-center">
                                <span className="avatar avatar-md bg-success-transparent text-success rounded me-2 flex-shrink-0">
                                  <i className="ti ti-mail fs-20" />
                                </span>
                                <div className="overflow-hidden">
                                  <p className="fs-12 text-muted mb-0">
                                    Department Email
                                  </p>
                                  <p className="mb-0 fw-medium text-dark text-truncate">
                                    finance@preskool.com
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="d-flex align-items-center justify-content-between mb-3">
                            <h6 className="mb-0">Assigned Staff</h6>
                            <a
                              href="#"
                              className="btn btn-sm btn-outline-light bg-white"
                              data-bs-toggle="modal"
                              data-bs-target="#assign_staff"
                            >
                              <i className="ti ti-user-plus me-1" />
                              Assign
                            </a>
                          </div>
                          <div className="row g-3 mb-4">
                            <div className="col-6">
                              <div className="card card-hover mb-0 h-100">
                                <div className="card-body text-center">
                                  <span className="avatar avatar-lg rounded-circle flex-shrink-0 mb-2">
                                    <img
                                      src="assets/img/teachers/teacher-01.jpg"
                                      className="rounded-circle flex-shrink-0"
                                      alt="Teresa Susan"
                                    />
                                  </span>
                                  <h6 className="mb-0 text-truncate">
                                    Teresa Susan
                                  </h6>
                                  <span className="fs-12 text-muted d-block mb-2">
                                    Senior Teacher
                                  </span>
                                  <div className="d-flex align-items-center justify-content-center flex-wrap gap-1 mb-2">
                                    <span className="badge badge-soft-primary">
                                      Physics
                                    </span>
                                    <span className="badge badge-soft-success">
                                      Active
                                    </span>
                                  </div>
                                  <a
                                    href="tel:+14654884498"
                                    className="fs-12 text-muted d-inline-flex align-items-center"
                                  >
                                    <i className="ti ti-phone me-1" />
                                    +1 46548 84498
                                  </a>
                                </div>
                              </div>
                            </div>
                            <div className="col-6">
                              <div className="card card-hover mb-0 h-100">
                                <div className="card-body text-center">
                                  <span className="avatar avatar-lg rounded-circle flex-shrink-0 mb-2">
                                    <img
                                      src="assets/img/teachers/teacher-02.jpg"
                                      className="rounded-circle flex-shrink-0"
                                      alt="John Doe"
                                    />
                                  </span>
                                  <h6 className="mb-0 text-truncate">
                                    John Doe
                                  </h6>
                                  <span className="fs-12 text-muted d-block mb-2">
                                    Coordinator
                                  </span>
                                  <div className="d-flex align-items-center justify-content-center flex-wrap gap-1 mb-2">
                                    <span className="badge badge-soft-primary">
                                      Science
                                    </span>
                                    <span className="badge badge-soft-success">
                                      Active
                                    </span>
                                  </div>
                                  <a
                                    href="tel:+14654811223"
                                    className="fs-12 text-muted d-inline-flex align-items-center"
                                  >
                                    <i className="ti ti-phone me-1" />
                                    +1 46548 11223
                                  </a>
                                </div>
                              </div>
                            </div>
                            <div className="col-6">
                              <div className="card card-hover mb-0 h-100">
                                <div className="card-body text-center">
                                  <span className="avatar avatar-lg rounded-circle flex-shrink-0 mb-2">
                                    <img
                                      src="assets/img/teachers/teacher-03.jpg"
                                      className="rounded-circle flex-shrink-0"
                                      alt="Hellana Robert"
                                    />
                                  </span>
                                  <h6 className="mb-0 text-truncate">
                                    Hellana Robert
                                  </h6>
                                  <span className="fs-12 text-muted d-block mb-2">
                                    Teacher
                                  </span>
                                  <div className="d-flex align-items-center justify-content-center flex-wrap gap-1 mb-2">
                                    <span className="badge badge-soft-primary">
                                      English
                                    </span>
                                    <span className="badge badge-soft-warning">
                                      On Leave
                                    </span>
                                  </div>
                                  <a
                                    href="tel:+14654855667"
                                    className="fs-12 text-muted d-inline-flex align-items-center"
                                  >
                                    <i className="ti ti-phone me-1" />
                                    +1 46548 55667
                                  </a>
                                </div>
                              </div>
                            </div>
                            <div className="col-6">
                              <div className="card card-hover mb-0 h-100">
                                <div className="card-body text-center">
                                  <span className="avatar avatar-lg rounded-circle flex-shrink-0 mb-2">
                                    <img
                                      src="assets/img/teachers/teacher-05.jpg"
                                      className="rounded-circle flex-shrink-0"
                                      alt="Morgan Lee"
                                    />
                                  </span>
                                  <h6 className="mb-0 text-truncate">
                                    Morgan Lee
                                  </h6>
                                  <span className="fs-12 text-muted d-block mb-2">
                                    Assistant
                                  </span>
                                  <div className="d-flex align-items-center justify-content-center flex-wrap gap-1 mb-2">
                                    <span className="badge badge-soft-primary">
                                      Maths
                                    </span>
                                    <span className="badge badge-soft-success">
                                      Active
                                    </span>
                                  </div>
                                  <a
                                    href="tel:+14654899001"
                                    className="fs-12 text-muted d-inline-flex align-items-center"
                                  >
                                    <i className="ti ti-phone me-1" />
                                    +1 46548 99001
                                  </a>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="d-flex align-items-center justify-content-between mb-3">
                            <h6 className="mb-0">Subjects</h6>
                            <a
                              href="#"
                              className="btn btn-sm btn-outline-light bg-white"
                              data-bs-toggle="modal"
                              data-bs-target="#assign_subjects"
                            >
                              <i className="ti ti-book me-1" />
                              Assign
                            </a>
                          </div>
                          <div className="row g-3">
                            <div className="col-sm-6 col-xl-4">
                              <div className="border rounded p-3 d-flex align-items-center">
                                <span className="avatar avatar-md bg-primary-transparent text-primary rounded me-2 flex-shrink-0">
                                  <i className="ti ti-book fs-20" />
                                </span>
                                <div className="overflow-hidden">
                                  <p className="mb-0 fw-medium text-dark text-truncate">
                                    Mathematics
                                  </p>
                                  <span className="fs-12 text-muted">
                                    MTH-101 · 6 Teachers
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="col-sm-6 col-xl-4">
                              <div className="border rounded p-3 d-flex align-items-center">
                                <span className="avatar avatar-md bg-info-transparent text-info rounded me-2 flex-shrink-0">
                                  <i className="ti ti-book fs-20" />
                                </span>
                                <div className="overflow-hidden">
                                  <p className="mb-0 fw-medium text-dark text-truncate">
                                    Physics
                                  </p>
                                  <span className="fs-12 text-muted">
                                    PHY-102 · 4 Teachers
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="col-sm-6 col-xl-4">
                              <div className="border rounded p-3 d-flex align-items-center">
                                <span className="avatar avatar-md bg-success-transparent text-success rounded me-2 flex-shrink-0">
                                  <i className="ti ti-book fs-20" />
                                </span>
                                <div className="overflow-hidden">
                                  <p className="mb-0 fw-medium text-dark text-truncate">
                                    Chemistry
                                  </p>
                                  <span className="fs-12 text-muted">
                                    CHM-103 · 3 Teachers
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="col-sm-6 col-xl-4">
                              <div className="border rounded p-3 d-flex align-items-center">
                                <span className="avatar avatar-md bg-warning-transparent text-warning rounded me-2 flex-shrink-0">
                                  <i className="ti ti-book fs-20" />
                                </span>
                                <div className="overflow-hidden">
                                  <p className="mb-0 fw-medium text-dark text-truncate">
                                    English
                                  </p>
                                  <span className="fs-12 text-muted">
                                    ENG-104 · 5 Teachers
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="col-sm-6 col-xl-4">
                              <div className="border rounded p-3 d-flex align-items-center">
                                <span className="avatar avatar-md bg-danger-transparent text-danger rounded me-2 flex-shrink-0">
                                  <i className="ti ti-book fs-20" />
                                </span>
                                <div className="overflow-hidden">
                                  <p className="mb-0 fw-medium text-dark text-truncate">
                                    Computer Science
                                  </p>
                                  <span className="fs-12 text-muted">
                                    CSC-105 · 4 Teachers
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="dept-pane d-none" id="dept_2">
                      <div className="card mb-0 dept-detail">
                        <div className="p-4 bg-info-transparent rounded-top">
                          <div className="d-xl-flex align-items-start justify-content-between">
                            <div className="d-flex align-items-center mb-3 mb-xl-0">
                              <span className="avatar avatar-xl bg-white text-info rounded me-3 flex-shrink-0">
                                <i className="ti ti-school fs-28" />
                              </span>
                              <div>
                                <div className="d-flex align-items-center flex-wrap gap-2 mb-1">
                                  <h4 className="mb-0">Academic</h4>
                                  <span className="badge bg-info-transparent text-info">
                                    D757246
                                  </span>
                                  <span className="badge badge-soft-success d-inline-flex align-items-center">
                                    <i className="ti ti-circle-filled fs-5 me-1" />
                                    Active
                                  </span>
                                </div>
                                <p className="mb-0 text-muted">
                                  Drives curriculum planning, examinations,
                                  teaching quality and academic outcomes.
                                </p>
                              </div>
                            </div>
                            <div className="d-flex align-items-center flex-wrap gap-1">
                              <a
                                href="#"
                                className="btn btn-outline-light bg-white btn-icon btn-sm rounded-circle flex-shrink-0"
                                data-bs-toggle="modal"
                                data-bs-target="#department_details"
                                title="View"
                                aria-label="View"
                              >
                                <i className="ti ti-eye" />
                              </a>
                              <a
                                href="#"
                                className="btn btn-outline-light bg-white btn-icon btn-sm rounded-circle flex-shrink-0"
                                data-bs-toggle="modal"
                                data-bs-target="#edit_department"
                                title="Edit"
                                aria-label="Edit"
                              >
                                <i className="ti ti-edit" />
                              </a>
                              <a
                                href="#"
                                className="btn btn-outline-light bg-white btn-icon btn-sm rounded-circle flex-shrink-0"
                                data-bs-toggle="modal"
                                data-bs-target="#assign_staff"
                                title="Assign Staff"
                                aria-label="Assign Staff"
                              >
                                <i className="ti ti-user-plus" />
                              </a>
                              <a
                                href="#"
                                className="btn btn-outline-light bg-white btn-icon btn-sm rounded-circle flex-shrink-0"
                                data-bs-toggle="modal"
                                data-bs-target="#assign_subjects"
                                title="Assign Subjects"
                                aria-label="Assign Subjects"
                              >
                                <i className="ti ti-book" />
                              </a>
                              <a
                                href="#"
                                className="btn btn-outline-light bg-white btn-icon btn-sm rounded-circle flex-shrink-0"
                                data-bs-toggle="modal"
                                data-bs-target="#edit_department"
                                title="Department Settings"
                                aria-label="Department Settings"
                              >
                                <i className="ti ti-settings" />
                              </a>
                              <a
                                href="#"
                                className="btn btn-outline-light bg-white btn-icon btn-sm rounded-circle flex-shrink-0"
                                data-dept-print=""
                                data-bs-toggle="tooltip"
                                title="Print"
                                aria-label="Print"
                              >
                                <i className="ti ti-printer" />
                              </a>
                              <div className="dropdown">
                                <a
                                  href="#"
                                  className="btn btn-outline-light bg-white btn-icon btn-sm rounded-circle flex-shrink-0"
                                  data-bs-toggle="dropdown"
                                  aria-label="More"
                                >
                                  <i className="ti ti-dots-vertical" />
                                </a>
                                <ul className="dropdown-menu dropdown-menu-end p-2">
                                  <li>
                                    <a
                                      className="dropdown-item rounded-1"
                                      href="#"
                                    >
                                      <i className="ti ti-copy me-2" />
                                      Duplicate
                                    </a>
                                  </li>
                                  <li>
                                    <a
                                      className="dropdown-item rounded-1"
                                      href="#"
                                    >
                                      <i className="ti ti-archive me-2" />
                                      Archive
                                    </a>
                                  </li>
                                  <li>
                                    <a
                                      className="dropdown-item rounded-1 text-danger"
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
                        </div>
                        <div className="card-body">
                          <h5 className="mb-3 fs-15">Department Information</h5>
                          <div className="row g-3 mb-4">
                            <div className="col-md-6 col-xl-4">
                              <div className="d-flex align-items-center">
                                <span className="avatar avatar-md bg-primary-transparent text-primary rounded me-2 flex-shrink-0">
                                  <i className="ti ti-user-star fs-20" />
                                </span>
                                <div className="overflow-hidden">
                                  <p className="fs-12 text-muted mb-0">
                                    Head of Department
                                  </p>
                                  <p className="mb-0 fw-medium text-dark text-truncate">
                                    Daniel Josua
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6 col-xl-4">
                              <div className="d-flex align-items-center">
                                <span className="avatar avatar-md bg-success-transparent text-success rounded me-2 flex-shrink-0">
                                  <i className="ti ti-phone fs-20" />
                                </span>
                                <div className="overflow-hidden">
                                  <p className="fs-12 text-muted mb-0">
                                    Contact Information
                                  </p>
                                  <p className="mb-0 fw-medium text-dark text-truncate">
                                    +1 46548 84402
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6 col-xl-4">
                              <div className="d-flex align-items-center">
                                <span className="avatar avatar-md bg-info-transparent text-info rounded me-2 flex-shrink-0">
                                  <i className="ti ti-map-pin fs-20" />
                                </span>
                                <div className="overflow-hidden">
                                  <p className="fs-12 text-muted mb-0">
                                    Location
                                  </p>
                                  <p className="mb-0 fw-medium text-dark text-truncate">
                                    Block A, Floor 3
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6 col-xl-4">
                              <div className="d-flex align-items-center">
                                <span className="avatar avatar-md bg-warning-transparent text-warning rounded me-2 flex-shrink-0">
                                  <i className="ti ti-calendar fs-20" />
                                </span>
                                <div className="overflow-hidden">
                                  <p className="fs-12 text-muted mb-0">
                                    Established Date
                                  </p>
                                  <p className="mb-0 fw-medium text-dark text-truncate">
                                    12 Jan 2017
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6 col-xl-4">
                              <div className="d-flex align-items-center">
                                <span className="avatar avatar-md bg-purple-transparent text-purple rounded me-2 flex-shrink-0">
                                  <i className="ti ti-users fs-20" />
                                </span>
                                <div className="overflow-hidden">
                                  <p className="fs-12 text-muted mb-0">
                                    Total Employees
                                  </p>
                                  <p className="mb-0 fw-medium text-dark text-truncate">
                                    96
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6 col-xl-4">
                              <div className="d-flex align-items-center">
                                <span className="avatar avatar-md bg-danger-transparent text-danger rounded me-2 flex-shrink-0">
                                  <i className="ti ti-book fs-20" />
                                </span>
                                <div className="overflow-hidden">
                                  <p className="fs-12 text-muted mb-0">
                                    Total Subjects
                                  </p>
                                  <p className="mb-0 fw-medium text-dark text-truncate">
                                    14
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6 col-xl-4">
                              <div className="d-flex align-items-center">
                                <span className="avatar avatar-md bg-secondary-transparent text-secondary rounded me-2 flex-shrink-0">
                                  <i className="ti ti-clipboard-list fs-20" />
                                </span>
                                <div className="overflow-hidden">
                                  <p className="fs-12 text-muted mb-0">
                                    Assigned Classes
                                  </p>
                                  <p className="mb-0 fw-medium text-dark text-truncate">
                                    24
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6 col-xl-4">
                              <div className="d-flex align-items-center">
                                <span className="avatar avatar-md bg-info-transparent text-info rounded me-2 flex-shrink-0">
                                  <i className="ti ti-school fs-20" />
                                </span>
                                <div className="overflow-hidden">
                                  <p className="fs-12 text-muted mb-0">
                                    Active Teachers
                                  </p>
                                  <p className="mb-0 fw-medium text-dark text-truncate">
                                    72
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6 col-xl-4">
                              <div className="d-flex align-items-center">
                                <span className="avatar avatar-md bg-primary-transparent text-primary rounded me-2 flex-shrink-0">
                                  <i className="ti ti-phone-plus fs-20" />
                                </span>
                                <div className="overflow-hidden">
                                  <p className="fs-12 text-muted mb-0">
                                    Office Extension
                                  </p>
                                  <p className="mb-0 fw-medium text-dark text-truncate">
                                    Ext. 103
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6 col-xl-4">
                              <div className="d-flex align-items-center">
                                <span className="avatar avatar-md bg-success-transparent text-success rounded me-2 flex-shrink-0">
                                  <i className="ti ti-mail fs-20" />
                                </span>
                                <div className="overflow-hidden">
                                  <p className="fs-12 text-muted mb-0">
                                    Department Email
                                  </p>
                                  <p className="mb-0 fw-medium text-dark text-truncate">
                                    academic@preskool.com
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="d-flex align-items-center justify-content-between mb-3">
                            <h6 className="mb-0">Assigned Staff</h6>
                            <a
                              href="#"
                              className="btn btn-sm btn-outline-light bg-white"
                              data-bs-toggle="modal"
                              data-bs-target="#assign_staff"
                            >
                              <i className="ti ti-user-plus me-1" />
                              Assign
                            </a>
                          </div>
                          <div className="row g-3 mb-4">
                            <div className="col-6">
                              <div className="card card-hover mb-0 h-100">
                                <div className="card-body text-center">
                                  <span className="avatar avatar-lg rounded-circle flex-shrink-0 mb-2">
                                    <img
                                      src="assets/img/teachers/teacher-01.jpg"
                                      className="rounded-circle flex-shrink-0"
                                      alt="Teresa Susan"
                                    />
                                  </span>
                                  <h6 className="mb-0 text-truncate">
                                    Teresa Susan
                                  </h6>
                                  <span className="fs-12 text-muted d-block mb-2">
                                    Senior Teacher
                                  </span>
                                  <div className="d-flex align-items-center justify-content-center flex-wrap gap-1 mb-2">
                                    <span className="badge badge-soft-primary">
                                      Physics
                                    </span>
                                    <span className="badge badge-soft-success">
                                      Active
                                    </span>
                                  </div>
                                  <a
                                    href="tel:+14654884498"
                                    className="fs-12 text-muted d-inline-flex align-items-center"
                                  >
                                    <i className="ti ti-phone me-1" />
                                    +1 46548 84498
                                  </a>
                                </div>
                              </div>
                            </div>
                            <div className="col-6">
                              <div className="card card-hover mb-0 h-100">
                                <div className="card-body text-center">
                                  <span className="avatar avatar-lg rounded-circle flex-shrink-0 mb-2">
                                    <img
                                      src="assets/img/teachers/teacher-02.jpg"
                                      className="rounded-circle flex-shrink-0"
                                      alt="John Doe"
                                    />
                                  </span>
                                  <h6 className="mb-0 text-truncate">
                                    John Doe
                                  </h6>
                                  <span className="fs-12 text-muted d-block mb-2">
                                    Coordinator
                                  </span>
                                  <div className="d-flex align-items-center justify-content-center flex-wrap gap-1 mb-2">
                                    <span className="badge badge-soft-primary">
                                      Science
                                    </span>
                                    <span className="badge badge-soft-success">
                                      Active
                                    </span>
                                  </div>
                                  <a
                                    href="tel:+14654811223"
                                    className="fs-12 text-muted d-inline-flex align-items-center"
                                  >
                                    <i className="ti ti-phone me-1" />
                                    +1 46548 11223
                                  </a>
                                </div>
                              </div>
                            </div>
                            <div className="col-6">
                              <div className="card card-hover mb-0 h-100">
                                <div className="card-body text-center">
                                  <span className="avatar avatar-lg rounded-circle flex-shrink-0 mb-2">
                                    <img
                                      src="assets/img/teachers/teacher-03.jpg"
                                      className="rounded-circle flex-shrink-0"
                                      alt="Hellana Robert"
                                    />
                                  </span>
                                  <h6 className="mb-0 text-truncate">
                                    Hellana Robert
                                  </h6>
                                  <span className="fs-12 text-muted d-block mb-2">
                                    Teacher
                                  </span>
                                  <div className="d-flex align-items-center justify-content-center flex-wrap gap-1 mb-2">
                                    <span className="badge badge-soft-primary">
                                      English
                                    </span>
                                    <span className="badge badge-soft-warning">
                                      On Leave
                                    </span>
                                  </div>
                                  <a
                                    href="tel:+14654855667"
                                    className="fs-12 text-muted d-inline-flex align-items-center"
                                  >
                                    <i className="ti ti-phone me-1" />
                                    +1 46548 55667
                                  </a>
                                </div>
                              </div>
                            </div>
                            <div className="col-6">
                              <div className="card card-hover mb-0 h-100">
                                <div className="card-body text-center">
                                  <span className="avatar avatar-lg rounded-circle flex-shrink-0 mb-2">
                                    <img
                                      src="assets/img/teachers/teacher-05.jpg"
                                      className="rounded-circle flex-shrink-0"
                                      alt="Morgan Lee"
                                    />
                                  </span>
                                  <h6 className="mb-0 text-truncate">
                                    Morgan Lee
                                  </h6>
                                  <span className="fs-12 text-muted d-block mb-2">
                                    Assistant
                                  </span>
                                  <div className="d-flex align-items-center justify-content-center flex-wrap gap-1 mb-2">
                                    <span className="badge badge-soft-primary">
                                      Maths
                                    </span>
                                    <span className="badge badge-soft-success">
                                      Active
                                    </span>
                                  </div>
                                  <a
                                    href="tel:+14654899001"
                                    className="fs-12 text-muted d-inline-flex align-items-center"
                                  >
                                    <i className="ti ti-phone me-1" />
                                    +1 46548 99001
                                  </a>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="d-flex align-items-center justify-content-between mb-3">
                            <h6 className="mb-0">Subjects</h6>
                            <a
                              href="#"
                              className="btn btn-sm btn-outline-light bg-white"
                              data-bs-toggle="modal"
                              data-bs-target="#assign_subjects"
                            >
                              <i className="ti ti-book me-1" />
                              Assign
                            </a>
                          </div>
                          <div className="row g-3">
                            <div className="col-sm-6 col-xl-4">
                              <div className="border rounded p-3 d-flex align-items-center">
                                <span className="avatar avatar-md bg-primary-transparent text-primary rounded me-2 flex-shrink-0">
                                  <i className="ti ti-book fs-20" />
                                </span>
                                <div className="overflow-hidden">
                                  <p className="mb-0 fw-medium text-dark text-truncate">
                                    Mathematics
                                  </p>
                                  <span className="fs-12 text-muted">
                                    MTH-101 · 6 Teachers
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="col-sm-6 col-xl-4">
                              <div className="border rounded p-3 d-flex align-items-center">
                                <span className="avatar avatar-md bg-info-transparent text-info rounded me-2 flex-shrink-0">
                                  <i className="ti ti-book fs-20" />
                                </span>
                                <div className="overflow-hidden">
                                  <p className="mb-0 fw-medium text-dark text-truncate">
                                    Physics
                                  </p>
                                  <span className="fs-12 text-muted">
                                    PHY-102 · 4 Teachers
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="col-sm-6 col-xl-4">
                              <div className="border rounded p-3 d-flex align-items-center">
                                <span className="avatar avatar-md bg-success-transparent text-success rounded me-2 flex-shrink-0">
                                  <i className="ti ti-book fs-20" />
                                </span>
                                <div className="overflow-hidden">
                                  <p className="mb-0 fw-medium text-dark text-truncate">
                                    Chemistry
                                  </p>
                                  <span className="fs-12 text-muted">
                                    CHM-103 · 3 Teachers
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="col-sm-6 col-xl-4">
                              <div className="border rounded p-3 d-flex align-items-center">
                                <span className="avatar avatar-md bg-warning-transparent text-warning rounded me-2 flex-shrink-0">
                                  <i className="ti ti-book fs-20" />
                                </span>
                                <div className="overflow-hidden">
                                  <p className="mb-0 fw-medium text-dark text-truncate">
                                    English
                                  </p>
                                  <span className="fs-12 text-muted">
                                    ENG-104 · 5 Teachers
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="col-sm-6 col-xl-4">
                              <div className="border rounded p-3 d-flex align-items-center">
                                <span className="avatar avatar-md bg-danger-transparent text-danger rounded me-2 flex-shrink-0">
                                  <i className="ti ti-book fs-20" />
                                </span>
                                <div className="overflow-hidden">
                                  <p className="mb-0 fw-medium text-dark text-truncate">
                                    Computer Science
                                  </p>
                                  <span className="fs-12 text-muted">
                                    CSC-105 · 4 Teachers
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="dept-pane d-none" id="dept_3">
                      <div className="card mb-0 dept-detail">
                        <div className="p-4 bg-warning-transparent rounded-top">
                          <div className="d-xl-flex align-items-start justify-content-between">
                            <div className="d-flex align-items-center mb-3 mb-xl-0">
                              <span className="avatar avatar-xl bg-white text-warning rounded me-3 flex-shrink-0">
                                <i className="ti ti-books fs-28" />
                              </span>
                              <div>
                                <div className="d-flex align-items-center flex-wrap gap-2 mb-1">
                                  <h4 className="mb-0">Library</h4>
                                  <span className="badge bg-warning-transparent text-warning">
                                    D757245
                                  </span>
                                  <span className="badge badge-soft-success d-inline-flex align-items-center">
                                    <i className="ti ti-circle-filled fs-5 me-1" />
                                    Active
                                  </span>
                                </div>
                                <p className="mb-0 text-muted">
                                  Maintains the library catalogue, digital
                                  resources, issue-return and reading programs.
                                </p>
                              </div>
                            </div>
                            <div className="d-flex align-items-center flex-wrap gap-1">
                              <a
                                href="#"
                                className="btn btn-outline-light bg-white btn-icon btn-sm rounded-circle flex-shrink-0"
                                data-bs-toggle="modal"
                                data-bs-target="#department_details"
                                title="View"
                                aria-label="View"
                              >
                                <i className="ti ti-eye" />
                              </a>
                              <a
                                href="#"
                                className="btn btn-outline-light bg-white btn-icon btn-sm rounded-circle flex-shrink-0"
                                data-bs-toggle="modal"
                                data-bs-target="#edit_department"
                                title="Edit"
                                aria-label="Edit"
                              >
                                <i className="ti ti-edit" />
                              </a>
                              <a
                                href="#"
                                className="btn btn-outline-light bg-white btn-icon btn-sm rounded-circle flex-shrink-0"
                                data-bs-toggle="modal"
                                data-bs-target="#assign_staff"
                                title="Assign Staff"
                                aria-label="Assign Staff"
                              >
                                <i className="ti ti-user-plus" />
                              </a>
                              <a
                                href="#"
                                className="btn btn-outline-light bg-white btn-icon btn-sm rounded-circle flex-shrink-0"
                                data-bs-toggle="modal"
                                data-bs-target="#assign_subjects"
                                title="Assign Subjects"
                                aria-label="Assign Subjects"
                              >
                                <i className="ti ti-book" />
                              </a>
                              <a
                                href="#"
                                className="btn btn-outline-light bg-white btn-icon btn-sm rounded-circle flex-shrink-0"
                                data-bs-toggle="modal"
                                data-bs-target="#edit_department"
                                title="Department Settings"
                                aria-label="Department Settings"
                              >
                                <i className="ti ti-settings" />
                              </a>
                              <a
                                href="#"
                                className="btn btn-outline-light bg-white btn-icon btn-sm rounded-circle flex-shrink-0"
                                data-dept-print=""
                                data-bs-toggle="tooltip"
                                title="Print"
                                aria-label="Print"
                              >
                                <i className="ti ti-printer" />
                              </a>
                              <div className="dropdown">
                                <a
                                  href="#"
                                  className="btn btn-outline-light bg-white btn-icon btn-sm rounded-circle flex-shrink-0"
                                  data-bs-toggle="dropdown"
                                  aria-label="More"
                                >
                                  <i className="ti ti-dots-vertical" />
                                </a>
                                <ul className="dropdown-menu dropdown-menu-end p-2">
                                  <li>
                                    <a
                                      className="dropdown-item rounded-1"
                                      href="#"
                                    >
                                      <i className="ti ti-copy me-2" />
                                      Duplicate
                                    </a>
                                  </li>
                                  <li>
                                    <a
                                      className="dropdown-item rounded-1"
                                      href="#"
                                    >
                                      <i className="ti ti-archive me-2" />
                                      Archive
                                    </a>
                                  </li>
                                  <li>
                                    <a
                                      className="dropdown-item rounded-1 text-danger"
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
                        </div>
                        <div className="card-body">
                          <h5 className="mb-3 fs-15">Department Information</h5>
                          <div className="row g-3 mb-4">
                            <div className="col-md-6 col-xl-4">
                              <div className="d-flex align-items-center">
                                <span className="avatar avatar-md bg-primary-transparent text-primary rounded me-2 flex-shrink-0">
                                  <i className="ti ti-user-star fs-20" />
                                </span>
                                <div className="overflow-hidden">
                                  <p className="fs-12 text-muted mb-0">
                                    Head of Department
                                  </p>
                                  <p className="mb-0 fw-medium text-dark text-truncate">
                                    Hellana Robert
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6 col-xl-4">
                              <div className="d-flex align-items-center">
                                <span className="avatar avatar-md bg-success-transparent text-success rounded me-2 flex-shrink-0">
                                  <i className="ti ti-phone fs-20" />
                                </span>
                                <div className="overflow-hidden">
                                  <p className="fs-12 text-muted mb-0">
                                    Contact Information
                                  </p>
                                  <p className="mb-0 fw-medium text-dark text-truncate">
                                    +1 46548 84403
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6 col-xl-4">
                              <div className="d-flex align-items-center">
                                <span className="avatar avatar-md bg-info-transparent text-info rounded me-2 flex-shrink-0">
                                  <i className="ti ti-map-pin fs-20" />
                                </span>
                                <div className="overflow-hidden">
                                  <p className="fs-12 text-muted mb-0">
                                    Location
                                  </p>
                                  <p className="mb-0 fw-medium text-dark text-truncate">
                                    Block A, Floor 1
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6 col-xl-4">
                              <div className="d-flex align-items-center">
                                <span className="avatar avatar-md bg-warning-transparent text-warning rounded me-2 flex-shrink-0">
                                  <i className="ti ti-calendar fs-20" />
                                </span>
                                <div className="overflow-hidden">
                                  <p className="fs-12 text-muted mb-0">
                                    Established Date
                                  </p>
                                  <p className="mb-0 fw-medium text-dark text-truncate">
                                    12 Jan 2018
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6 col-xl-4">
                              <div className="d-flex align-items-center">
                                <span className="avatar avatar-md bg-purple-transparent text-purple rounded me-2 flex-shrink-0">
                                  <i className="ti ti-users fs-20" />
                                </span>
                                <div className="overflow-hidden">
                                  <p className="fs-12 text-muted mb-0">
                                    Total Employees
                                  </p>
                                  <p className="mb-0 fw-medium text-dark text-truncate">
                                    8
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6 col-xl-4">
                              <div className="d-flex align-items-center">
                                <span className="avatar avatar-md bg-danger-transparent text-danger rounded me-2 flex-shrink-0">
                                  <i className="ti ti-book fs-20" />
                                </span>
                                <div className="overflow-hidden">
                                  <p className="fs-12 text-muted mb-0">
                                    Total Subjects
                                  </p>
                                  <p className="mb-0 fw-medium text-dark text-truncate">
                                    0
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6 col-xl-4">
                              <div className="d-flex align-items-center">
                                <span className="avatar avatar-md bg-secondary-transparent text-secondary rounded me-2 flex-shrink-0">
                                  <i className="ti ti-clipboard-list fs-20" />
                                </span>
                                <div className="overflow-hidden">
                                  <p className="fs-12 text-muted mb-0">
                                    Assigned Classes
                                  </p>
                                  <p className="mb-0 fw-medium text-dark text-truncate">
                                    0
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6 col-xl-4">
                              <div className="d-flex align-items-center">
                                <span className="avatar avatar-md bg-info-transparent text-info rounded me-2 flex-shrink-0">
                                  <i className="ti ti-school fs-20" />
                                </span>
                                <div className="overflow-hidden">
                                  <p className="fs-12 text-muted mb-0">
                                    Active Teachers
                                  </p>
                                  <p className="mb-0 fw-medium text-dark text-truncate">
                                    2
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6 col-xl-4">
                              <div className="d-flex align-items-center">
                                <span className="avatar avatar-md bg-primary-transparent text-primary rounded me-2 flex-shrink-0">
                                  <i className="ti ti-phone-plus fs-20" />
                                </span>
                                <div className="overflow-hidden">
                                  <p className="fs-12 text-muted mb-0">
                                    Office Extension
                                  </p>
                                  <p className="mb-0 fw-medium text-dark text-truncate">
                                    Ext. 104
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6 col-xl-4">
                              <div className="d-flex align-items-center">
                                <span className="avatar avatar-md bg-success-transparent text-success rounded me-2 flex-shrink-0">
                                  <i className="ti ti-mail fs-20" />
                                </span>
                                <div className="overflow-hidden">
                                  <p className="fs-12 text-muted mb-0">
                                    Department Email
                                  </p>
                                  <p className="mb-0 fw-medium text-dark text-truncate">
                                    library@preskool.com
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="d-flex align-items-center justify-content-between mb-3">
                            <h6 className="mb-0">Assigned Staff</h6>
                            <a
                              href="#"
                              className="btn btn-sm btn-outline-light bg-white"
                              data-bs-toggle="modal"
                              data-bs-target="#assign_staff"
                            >
                              <i className="ti ti-user-plus me-1" />
                              Assign
                            </a>
                          </div>
                          <div className="row g-3 mb-4">
                            <div className="col-6">
                              <div className="card card-hover mb-0 h-100">
                                <div className="card-body text-center">
                                  <span className="avatar avatar-lg rounded-circle flex-shrink-0 mb-2">
                                    <img
                                      src="assets/img/teachers/teacher-01.jpg"
                                      className="rounded-circle flex-shrink-0"
                                      alt="Teresa Susan"
                                    />
                                  </span>
                                  <h6 className="mb-0 text-truncate">
                                    Teresa Susan
                                  </h6>
                                  <span className="fs-12 text-muted d-block mb-2">
                                    Senior Teacher
                                  </span>
                                  <div className="d-flex align-items-center justify-content-center flex-wrap gap-1 mb-2">
                                    <span className="badge badge-soft-primary">
                                      Physics
                                    </span>
                                    <span className="badge badge-soft-success">
                                      Active
                                    </span>
                                  </div>
                                  <a
                                    href="tel:+14654884498"
                                    className="fs-12 text-muted d-inline-flex align-items-center"
                                  >
                                    <i className="ti ti-phone me-1" />
                                    +1 46548 84498
                                  </a>
                                </div>
                              </div>
                            </div>
                            <div className="col-6">
                              <div className="card card-hover mb-0 h-100">
                                <div className="card-body text-center">
                                  <span className="avatar avatar-lg rounded-circle flex-shrink-0 mb-2">
                                    <img
                                      src="assets/img/teachers/teacher-02.jpg"
                                      className="rounded-circle flex-shrink-0"
                                      alt="John Doe"
                                    />
                                  </span>
                                  <h6 className="mb-0 text-truncate">
                                    John Doe
                                  </h6>
                                  <span className="fs-12 text-muted d-block mb-2">
                                    Coordinator
                                  </span>
                                  <div className="d-flex align-items-center justify-content-center flex-wrap gap-1 mb-2">
                                    <span className="badge badge-soft-primary">
                                      Science
                                    </span>
                                    <span className="badge badge-soft-success">
                                      Active
                                    </span>
                                  </div>
                                  <a
                                    href="tel:+14654811223"
                                    className="fs-12 text-muted d-inline-flex align-items-center"
                                  >
                                    <i className="ti ti-phone me-1" />
                                    +1 46548 11223
                                  </a>
                                </div>
                              </div>
                            </div>
                            <div className="col-6">
                              <div className="card card-hover mb-0 h-100">
                                <div className="card-body text-center">
                                  <span className="avatar avatar-lg rounded-circle flex-shrink-0 mb-2">
                                    <img
                                      src="assets/img/teachers/teacher-03.jpg"
                                      className="rounded-circle flex-shrink-0"
                                      alt="Hellana Robert"
                                    />
                                  </span>
                                  <h6 className="mb-0 text-truncate">
                                    Hellana Robert
                                  </h6>
                                  <span className="fs-12 text-muted d-block mb-2">
                                    Teacher
                                  </span>
                                  <div className="d-flex align-items-center justify-content-center flex-wrap gap-1 mb-2">
                                    <span className="badge badge-soft-primary">
                                      English
                                    </span>
                                    <span className="badge badge-soft-warning">
                                      On Leave
                                    </span>
                                  </div>
                                  <a
                                    href="tel:+14654855667"
                                    className="fs-12 text-muted d-inline-flex align-items-center"
                                  >
                                    <i className="ti ti-phone me-1" />
                                    +1 46548 55667
                                  </a>
                                </div>
                              </div>
                            </div>
                            <div className="col-6">
                              <div className="card card-hover mb-0 h-100">
                                <div className="card-body text-center">
                                  <span className="avatar avatar-lg rounded-circle flex-shrink-0 mb-2">
                                    <img
                                      src="assets/img/teachers/teacher-05.jpg"
                                      className="rounded-circle flex-shrink-0"
                                      alt="Morgan Lee"
                                    />
                                  </span>
                                  <h6 className="mb-0 text-truncate">
                                    Morgan Lee
                                  </h6>
                                  <span className="fs-12 text-muted d-block mb-2">
                                    Assistant
                                  </span>
                                  <div className="d-flex align-items-center justify-content-center flex-wrap gap-1 mb-2">
                                    <span className="badge badge-soft-primary">
                                      Maths
                                    </span>
                                    <span className="badge badge-soft-success">
                                      Active
                                    </span>
                                  </div>
                                  <a
                                    href="tel:+14654899001"
                                    className="fs-12 text-muted d-inline-flex align-items-center"
                                  >
                                    <i className="ti ti-phone me-1" />
                                    +1 46548 99001
                                  </a>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="d-flex align-items-center justify-content-between mb-3">
                            <h6 className="mb-0">Subjects</h6>
                            <a
                              href="#"
                              className="btn btn-sm btn-outline-light bg-white"
                              data-bs-toggle="modal"
                              data-bs-target="#assign_subjects"
                            >
                              <i className="ti ti-book me-1" />
                              Assign
                            </a>
                          </div>
                          <div className="row g-3">
                            <div className="col-sm-6 col-xl-4">
                              <div className="border rounded p-3 d-flex align-items-center">
                                <span className="avatar avatar-md bg-primary-transparent text-primary rounded me-2 flex-shrink-0">
                                  <i className="ti ti-book fs-20" />
                                </span>
                                <div className="overflow-hidden">
                                  <p className="mb-0 fw-medium text-dark text-truncate">
                                    Mathematics
                                  </p>
                                  <span className="fs-12 text-muted">
                                    MTH-101 · 6 Teachers
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="col-sm-6 col-xl-4">
                              <div className="border rounded p-3 d-flex align-items-center">
                                <span className="avatar avatar-md bg-info-transparent text-info rounded me-2 flex-shrink-0">
                                  <i className="ti ti-book fs-20" />
                                </span>
                                <div className="overflow-hidden">
                                  <p className="mb-0 fw-medium text-dark text-truncate">
                                    Physics
                                  </p>
                                  <span className="fs-12 text-muted">
                                    PHY-102 · 4 Teachers
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="col-sm-6 col-xl-4">
                              <div className="border rounded p-3 d-flex align-items-center">
                                <span className="avatar avatar-md bg-success-transparent text-success rounded me-2 flex-shrink-0">
                                  <i className="ti ti-book fs-20" />
                                </span>
                                <div className="overflow-hidden">
                                  <p className="mb-0 fw-medium text-dark text-truncate">
                                    Chemistry
                                  </p>
                                  <span className="fs-12 text-muted">
                                    CHM-103 · 3 Teachers
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="col-sm-6 col-xl-4">
                              <div className="border rounded p-3 d-flex align-items-center">
                                <span className="avatar avatar-md bg-warning-transparent text-warning rounded me-2 flex-shrink-0">
                                  <i className="ti ti-book fs-20" />
                                </span>
                                <div className="overflow-hidden">
                                  <p className="mb-0 fw-medium text-dark text-truncate">
                                    English
                                  </p>
                                  <span className="fs-12 text-muted">
                                    ENG-104 · 5 Teachers
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="col-sm-6 col-xl-4">
                              <div className="border rounded p-3 d-flex align-items-center">
                                <span className="avatar avatar-md bg-danger-transparent text-danger rounded me-2 flex-shrink-0">
                                  <i className="ti ti-book fs-20" />
                                </span>
                                <div className="overflow-hidden">
                                  <p className="mb-0 fw-medium text-dark text-truncate">
                                    Computer Science
                                  </p>
                                  <span className="fs-12 text-muted">
                                    CSC-105 · 4 Teachers
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="dept-pane d-none" id="dept_4">
                      <div className="card mb-0 dept-detail">
                        <div className="p-4 bg-danger-transparent rounded-top">
                          <div className="d-xl-flex align-items-start justify-content-between">
                            <div className="d-flex align-items-center mb-3 mb-xl-0">
                              <span className="avatar avatar-xl bg-white text-danger rounded me-3 flex-shrink-0">
                                <i className="ti ti-heartbeat fs-28" />
                              </span>
                              <div>
                                <div className="d-flex align-items-center flex-wrap gap-2 mb-1">
                                  <h4 className="mb-0">Health</h4>
                                  <span className="badge bg-danger-transparent text-danger">
                                    D757244
                                  </span>
                                  <span className="badge badge-soft-danger d-inline-flex align-items-center">
                                    <i className="ti ti-circle-filled fs-5 me-1" />
                                    Inactive
                                  </span>
                                </div>
                                <p className="mb-0 text-muted">
                                  Runs the campus infirmary, medical records,
                                  health checks and wellness initiatives.
                                </p>
                              </div>
                            </div>
                            <div className="d-flex align-items-center flex-wrap gap-1">
                              <a
                                href="#"
                                className="btn btn-outline-light bg-white btn-icon btn-sm rounded-circle flex-shrink-0"
                                data-bs-toggle="modal"
                                data-bs-target="#department_details"
                                title="View"
                                aria-label="View"
                              >
                                <i className="ti ti-eye" />
                              </a>
                              <a
                                href="#"
                                className="btn btn-outline-light bg-white btn-icon btn-sm rounded-circle flex-shrink-0"
                                data-bs-toggle="modal"
                                data-bs-target="#edit_department"
                                title="Edit"
                                aria-label="Edit"
                              >
                                <i className="ti ti-edit" />
                              </a>
                              <a
                                href="#"
                                className="btn btn-outline-light bg-white btn-icon btn-sm rounded-circle flex-shrink-0"
                                data-bs-toggle="modal"
                                data-bs-target="#assign_staff"
                                title="Assign Staff"
                                aria-label="Assign Staff"
                              >
                                <i className="ti ti-user-plus" />
                              </a>
                              <a
                                href="#"
                                className="btn btn-outline-light bg-white btn-icon btn-sm rounded-circle flex-shrink-0"
                                data-bs-toggle="modal"
                                data-bs-target="#assign_subjects"
                                title="Assign Subjects"
                                aria-label="Assign Subjects"
                              >
                                <i className="ti ti-book" />
                              </a>
                              <a
                                href="#"
                                className="btn btn-outline-light bg-white btn-icon btn-sm rounded-circle flex-shrink-0"
                                data-bs-toggle="modal"
                                data-bs-target="#edit_department"
                                title="Department Settings"
                                aria-label="Department Settings"
                              >
                                <i className="ti ti-settings" />
                              </a>
                              <a
                                href="#"
                                className="btn btn-outline-light bg-white btn-icon btn-sm rounded-circle flex-shrink-0"
                                data-dept-print=""
                                data-bs-toggle="tooltip"
                                title="Print"
                                aria-label="Print"
                              >
                                <i className="ti ti-printer" />
                              </a>
                              <div className="dropdown">
                                <a
                                  href="#"
                                  className="btn btn-outline-light bg-white btn-icon btn-sm rounded-circle flex-shrink-0"
                                  data-bs-toggle="dropdown"
                                  aria-label="More"
                                >
                                  <i className="ti ti-dots-vertical" />
                                </a>
                                <ul className="dropdown-menu dropdown-menu-end p-2">
                                  <li>
                                    <a
                                      className="dropdown-item rounded-1"
                                      href="#"
                                    >
                                      <i className="ti ti-copy me-2" />
                                      Duplicate
                                    </a>
                                  </li>
                                  <li>
                                    <a
                                      className="dropdown-item rounded-1"
                                      href="#"
                                    >
                                      <i className="ti ti-archive me-2" />
                                      Archive
                                    </a>
                                  </li>
                                  <li>
                                    <a
                                      className="dropdown-item rounded-1 text-danger"
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
                        </div>
                        <div className="card-body">
                          <h5 className="mb-3 fs-15">Department Information</h5>
                          <div className="row g-3 mb-4">
                            <div className="col-md-6 col-xl-4">
                              <div className="d-flex align-items-center">
                                <span className="avatar avatar-md bg-primary-transparent text-primary rounded me-2 flex-shrink-0">
                                  <i className="ti ti-user-star fs-20" />
                                </span>
                                <div className="overflow-hidden">
                                  <p className="fs-12 text-muted mb-0">
                                    Head of Department
                                  </p>
                                  <p className="mb-0 fw-medium text-dark text-truncate">
                                    Morgan Lee
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6 col-xl-4">
                              <div className="d-flex align-items-center">
                                <span className="avatar avatar-md bg-success-transparent text-success rounded me-2 flex-shrink-0">
                                  <i className="ti ti-phone fs-20" />
                                </span>
                                <div className="overflow-hidden">
                                  <p className="fs-12 text-muted mb-0">
                                    Contact Information
                                  </p>
                                  <p className="mb-0 fw-medium text-dark text-truncate">
                                    +1 46548 84404
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6 col-xl-4">
                              <div className="d-flex align-items-center">
                                <span className="avatar avatar-md bg-info-transparent text-info rounded me-2 flex-shrink-0">
                                  <i className="ti ti-map-pin fs-20" />
                                </span>
                                <div className="overflow-hidden">
                                  <p className="fs-12 text-muted mb-0">
                                    Location
                                  </p>
                                  <p className="mb-0 fw-medium text-dark text-truncate">
                                    Block A, Floor 2
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6 col-xl-4">
                              <div className="d-flex align-items-center">
                                <span className="avatar avatar-md bg-warning-transparent text-warning rounded me-2 flex-shrink-0">
                                  <i className="ti ti-calendar fs-20" />
                                </span>
                                <div className="overflow-hidden">
                                  <p className="fs-12 text-muted mb-0">
                                    Established Date
                                  </p>
                                  <p className="mb-0 fw-medium text-dark text-truncate">
                                    12 Jan 2019
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6 col-xl-4">
                              <div className="d-flex align-items-center">
                                <span className="avatar avatar-md bg-purple-transparent text-purple rounded me-2 flex-shrink-0">
                                  <i className="ti ti-users fs-20" />
                                </span>
                                <div className="overflow-hidden">
                                  <p className="fs-12 text-muted mb-0">
                                    Total Employees
                                  </p>
                                  <p className="mb-0 fw-medium text-dark text-truncate">
                                    6
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6 col-xl-4">
                              <div className="d-flex align-items-center">
                                <span className="avatar avatar-md bg-danger-transparent text-danger rounded me-2 flex-shrink-0">
                                  <i className="ti ti-book fs-20" />
                                </span>
                                <div className="overflow-hidden">
                                  <p className="fs-12 text-muted mb-0">
                                    Total Subjects
                                  </p>
                                  <p className="mb-0 fw-medium text-dark text-truncate">
                                    0
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6 col-xl-4">
                              <div className="d-flex align-items-center">
                                <span className="avatar avatar-md bg-secondary-transparent text-secondary rounded me-2 flex-shrink-0">
                                  <i className="ti ti-clipboard-list fs-20" />
                                </span>
                                <div className="overflow-hidden">
                                  <p className="fs-12 text-muted mb-0">
                                    Assigned Classes
                                  </p>
                                  <p className="mb-0 fw-medium text-dark text-truncate">
                                    0
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6 col-xl-4">
                              <div className="d-flex align-items-center">
                                <span className="avatar avatar-md bg-info-transparent text-info rounded me-2 flex-shrink-0">
                                  <i className="ti ti-school fs-20" />
                                </span>
                                <div className="overflow-hidden">
                                  <p className="fs-12 text-muted mb-0">
                                    Active Teachers
                                  </p>
                                  <p className="mb-0 fw-medium text-dark text-truncate">
                                    0
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6 col-xl-4">
                              <div className="d-flex align-items-center">
                                <span className="avatar avatar-md bg-primary-transparent text-primary rounded me-2 flex-shrink-0">
                                  <i className="ti ti-phone-plus fs-20" />
                                </span>
                                <div className="overflow-hidden">
                                  <p className="fs-12 text-muted mb-0">
                                    Office Extension
                                  </p>
                                  <p className="mb-0 fw-medium text-dark text-truncate">
                                    Ext. 105
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6 col-xl-4">
                              <div className="d-flex align-items-center">
                                <span className="avatar avatar-md bg-success-transparent text-success rounded me-2 flex-shrink-0">
                                  <i className="ti ti-mail fs-20" />
                                </span>
                                <div className="overflow-hidden">
                                  <p className="fs-12 text-muted mb-0">
                                    Department Email
                                  </p>
                                  <p className="mb-0 fw-medium text-dark text-truncate">
                                    health@preskool.com
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="d-flex align-items-center justify-content-between mb-3">
                            <h6 className="mb-0">Assigned Staff</h6>
                            <a
                              href="#"
                              className="btn btn-sm btn-outline-light bg-white"
                              data-bs-toggle="modal"
                              data-bs-target="#assign_staff"
                            >
                              <i className="ti ti-user-plus me-1" />
                              Assign
                            </a>
                          </div>
                          <div className="row g-3 mb-4">
                            <div className="col-6">
                              <div className="card card-hover mb-0 h-100">
                                <div className="card-body text-center">
                                  <span className="avatar avatar-lg rounded-circle flex-shrink-0 mb-2">
                                    <img
                                      src="assets/img/teachers/teacher-01.jpg"
                                      className="rounded-circle flex-shrink-0"
                                      alt="Teresa Susan"
                                    />
                                  </span>
                                  <h6 className="mb-0 text-truncate">
                                    Teresa Susan
                                  </h6>
                                  <span className="fs-12 text-muted d-block mb-2">
                                    Senior Teacher
                                  </span>
                                  <div className="d-flex align-items-center justify-content-center flex-wrap gap-1 mb-2">
                                    <span className="badge badge-soft-primary">
                                      Physics
                                    </span>
                                    <span className="badge badge-soft-success">
                                      Active
                                    </span>
                                  </div>
                                  <a
                                    href="tel:+14654884498"
                                    className="fs-12 text-muted d-inline-flex align-items-center"
                                  >
                                    <i className="ti ti-phone me-1" />
                                    +1 46548 84498
                                  </a>
                                </div>
                              </div>
                            </div>
                            <div className="col-6">
                              <div className="card card-hover mb-0 h-100">
                                <div className="card-body text-center">
                                  <span className="avatar avatar-lg rounded-circle flex-shrink-0 mb-2">
                                    <img
                                      src="assets/img/teachers/teacher-02.jpg"
                                      className="rounded-circle flex-shrink-0"
                                      alt="John Doe"
                                    />
                                  </span>
                                  <h6 className="mb-0 text-truncate">
                                    John Doe
                                  </h6>
                                  <span className="fs-12 text-muted d-block mb-2">
                                    Coordinator
                                  </span>
                                  <div className="d-flex align-items-center justify-content-center flex-wrap gap-1 mb-2">
                                    <span className="badge badge-soft-primary">
                                      Science
                                    </span>
                                    <span className="badge badge-soft-success">
                                      Active
                                    </span>
                                  </div>
                                  <a
                                    href="tel:+14654811223"
                                    className="fs-12 text-muted d-inline-flex align-items-center"
                                  >
                                    <i className="ti ti-phone me-1" />
                                    +1 46548 11223
                                  </a>
                                </div>
                              </div>
                            </div>
                            <div className="col-6">
                              <div className="card card-hover mb-0 h-100">
                                <div className="card-body text-center">
                                  <span className="avatar avatar-lg rounded-circle flex-shrink-0 mb-2">
                                    <img
                                      src="assets/img/teachers/teacher-03.jpg"
                                      className="rounded-circle flex-shrink-0"
                                      alt="Hellana Robert"
                                    />
                                  </span>
                                  <h6 className="mb-0 text-truncate">
                                    Hellana Robert
                                  </h6>
                                  <span className="fs-12 text-muted d-block mb-2">
                                    Teacher
                                  </span>
                                  <div className="d-flex align-items-center justify-content-center flex-wrap gap-1 mb-2">
                                    <span className="badge badge-soft-primary">
                                      English
                                    </span>
                                    <span className="badge badge-soft-warning">
                                      On Leave
                                    </span>
                                  </div>
                                  <a
                                    href="tel:+14654855667"
                                    className="fs-12 text-muted d-inline-flex align-items-center"
                                  >
                                    <i className="ti ti-phone me-1" />
                                    +1 46548 55667
                                  </a>
                                </div>
                              </div>
                            </div>
                            <div className="col-6">
                              <div className="card card-hover mb-0 h-100">
                                <div className="card-body text-center">
                                  <span className="avatar avatar-lg rounded-circle flex-shrink-0 mb-2">
                                    <img
                                      src="assets/img/teachers/teacher-05.jpg"
                                      className="rounded-circle flex-shrink-0"
                                      alt="Morgan Lee"
                                    />
                                  </span>
                                  <h6 className="mb-0 text-truncate">
                                    Morgan Lee
                                  </h6>
                                  <span className="fs-12 text-muted d-block mb-2">
                                    Assistant
                                  </span>
                                  <div className="d-flex align-items-center justify-content-center flex-wrap gap-1 mb-2">
                                    <span className="badge badge-soft-primary">
                                      Maths
                                    </span>
                                    <span className="badge badge-soft-success">
                                      Active
                                    </span>
                                  </div>
                                  <a
                                    href="tel:+14654899001"
                                    className="fs-12 text-muted d-inline-flex align-items-center"
                                  >
                                    <i className="ti ti-phone me-1" />
                                    +1 46548 99001
                                  </a>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="d-flex align-items-center justify-content-between mb-3">
                            <h6 className="mb-0">Subjects</h6>
                            <a
                              href="#"
                              className="btn btn-sm btn-outline-light bg-white"
                              data-bs-toggle="modal"
                              data-bs-target="#assign_subjects"
                            >
                              <i className="ti ti-book me-1" />
                              Assign
                            </a>
                          </div>
                          <div className="row g-3">
                            <div className="col-sm-6 col-xl-4">
                              <div className="border rounded p-3 d-flex align-items-center">
                                <span className="avatar avatar-md bg-primary-transparent text-primary rounded me-2 flex-shrink-0">
                                  <i className="ti ti-book fs-20" />
                                </span>
                                <div className="overflow-hidden">
                                  <p className="mb-0 fw-medium text-dark text-truncate">
                                    Mathematics
                                  </p>
                                  <span className="fs-12 text-muted">
                                    MTH-101 · 6 Teachers
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="col-sm-6 col-xl-4">
                              <div className="border rounded p-3 d-flex align-items-center">
                                <span className="avatar avatar-md bg-info-transparent text-info rounded me-2 flex-shrink-0">
                                  <i className="ti ti-book fs-20" />
                                </span>
                                <div className="overflow-hidden">
                                  <p className="mb-0 fw-medium text-dark text-truncate">
                                    Physics
                                  </p>
                                  <span className="fs-12 text-muted">
                                    PHY-102 · 4 Teachers
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="col-sm-6 col-xl-4">
                              <div className="border rounded p-3 d-flex align-items-center">
                                <span className="avatar avatar-md bg-success-transparent text-success rounded me-2 flex-shrink-0">
                                  <i className="ti ti-book fs-20" />
                                </span>
                                <div className="overflow-hidden">
                                  <p className="mb-0 fw-medium text-dark text-truncate">
                                    Chemistry
                                  </p>
                                  <span className="fs-12 text-muted">
                                    CHM-103 · 3 Teachers
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="col-sm-6 col-xl-4">
                              <div className="border rounded p-3 d-flex align-items-center">
                                <span className="avatar avatar-md bg-warning-transparent text-warning rounded me-2 flex-shrink-0">
                                  <i className="ti ti-book fs-20" />
                                </span>
                                <div className="overflow-hidden">
                                  <p className="mb-0 fw-medium text-dark text-truncate">
                                    English
                                  </p>
                                  <span className="fs-12 text-muted">
                                    ENG-104 · 5 Teachers
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="col-sm-6 col-xl-4">
                              <div className="border rounded p-3 d-flex align-items-center">
                                <span className="avatar avatar-md bg-danger-transparent text-danger rounded me-2 flex-shrink-0">
                                  <i className="ti ti-book fs-20" />
                                </span>
                                <div className="overflow-hidden">
                                  <p className="mb-0 fw-medium text-dark text-truncate">
                                    Computer Science
                                  </p>
                                  <span className="fs-12 text-muted">
                                    CSC-105 · 4 Teachers
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="dept-pane d-none" id="dept_5">
                      <div className="card mb-0 dept-detail">
                        <div className="p-4 bg-secondary-transparent rounded-top">
                          <div className="d-xl-flex align-items-start justify-content-between">
                            <div className="d-flex align-items-center mb-3 mb-xl-0">
                              <span className="avatar avatar-xl bg-white text-secondary rounded me-3 flex-shrink-0">
                                <i className="ti ti-bus fs-28" />
                              </span>
                              <div>
                                <div className="d-flex align-items-center flex-wrap gap-2 mb-1">
                                  <h4 className="mb-0">Transport</h4>
                                  <span className="badge bg-secondary-transparent text-secondary">
                                    D757243
                                  </span>
                                  <span className="badge badge-soft-success d-inline-flex align-items-center">
                                    <i className="ti ti-circle-filled fs-5 me-1" />
                                    Active
                                  </span>
                                </div>
                                <p className="mb-0 text-muted">
                                  Coordinates routes, vehicles, drivers and
                                  student pickup logistics.
                                </p>
                              </div>
                            </div>
                            <div className="d-flex align-items-center flex-wrap gap-1">
                              <a
                                href="#"
                                className="btn btn-outline-light bg-white btn-icon btn-sm rounded-circle flex-shrink-0"
                                data-bs-toggle="modal"
                                data-bs-target="#department_details"
                                title="View"
                                aria-label="View"
                              >
                                <i className="ti ti-eye" />
                              </a>
                              <a
                                href="#"
                                className="btn btn-outline-light bg-white btn-icon btn-sm rounded-circle flex-shrink-0"
                                data-bs-toggle="modal"
                                data-bs-target="#edit_department"
                                title="Edit"
                                aria-label="Edit"
                              >
                                <i className="ti ti-edit" />
                              </a>
                              <a
                                href="#"
                                className="btn btn-outline-light bg-white btn-icon btn-sm rounded-circle flex-shrink-0"
                                data-bs-toggle="modal"
                                data-bs-target="#assign_staff"
                                title="Assign Staff"
                                aria-label="Assign Staff"
                              >
                                <i className="ti ti-user-plus" />
                              </a>
                              <a
                                href="#"
                                className="btn btn-outline-light bg-white btn-icon btn-sm rounded-circle flex-shrink-0"
                                data-bs-toggle="modal"
                                data-bs-target="#assign_subjects"
                                title="Assign Subjects"
                                aria-label="Assign Subjects"
                              >
                                <i className="ti ti-book" />
                              </a>
                              <a
                                href="#"
                                className="btn btn-outline-light bg-white btn-icon btn-sm rounded-circle flex-shrink-0"
                                data-bs-toggle="modal"
                                data-bs-target="#edit_department"
                                title="Department Settings"
                                aria-label="Department Settings"
                              >
                                <i className="ti ti-settings" />
                              </a>
                              <a
                                href="#"
                                className="btn btn-outline-light bg-white btn-icon btn-sm rounded-circle flex-shrink-0"
                                data-dept-print=""
                                data-bs-toggle="tooltip"
                                title="Print"
                                aria-label="Print"
                              >
                                <i className="ti ti-printer" />
                              </a>
                              <div className="dropdown">
                                <a
                                  href="#"
                                  className="btn btn-outline-light bg-white btn-icon btn-sm rounded-circle flex-shrink-0"
                                  data-bs-toggle="dropdown"
                                  aria-label="More"
                                >
                                  <i className="ti ti-dots-vertical" />
                                </a>
                                <ul className="dropdown-menu dropdown-menu-end p-2">
                                  <li>
                                    <a
                                      className="dropdown-item rounded-1"
                                      href="#"
                                    >
                                      <i className="ti ti-copy me-2" />
                                      Duplicate
                                    </a>
                                  </li>
                                  <li>
                                    <a
                                      className="dropdown-item rounded-1"
                                      href="#"
                                    >
                                      <i className="ti ti-archive me-2" />
                                      Archive
                                    </a>
                                  </li>
                                  <li>
                                    <a
                                      className="dropdown-item rounded-1 text-danger"
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
                        </div>
                        <div className="card-body">
                          <h5 className="mb-3 fs-15">Department Information</h5>
                          <div className="row g-3 mb-4">
                            <div className="col-md-6 col-xl-4">
                              <div className="d-flex align-items-center">
                                <span className="avatar avatar-md bg-primary-transparent text-primary rounded me-2 flex-shrink-0">
                                  <i className="ti ti-user-star fs-20" />
                                </span>
                                <div className="overflow-hidden">
                                  <p className="fs-12 text-muted mb-0">
                                    Head of Department
                                  </p>
                                  <p className="mb-0 fw-medium text-dark text-truncate">
                                    Aaron Cole
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6 col-xl-4">
                              <div className="d-flex align-items-center">
                                <span className="avatar avatar-md bg-success-transparent text-success rounded me-2 flex-shrink-0">
                                  <i className="ti ti-phone fs-20" />
                                </span>
                                <div className="overflow-hidden">
                                  <p className="fs-12 text-muted mb-0">
                                    Contact Information
                                  </p>
                                  <p className="mb-0 fw-medium text-dark text-truncate">
                                    +1 46548 84405
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6 col-xl-4">
                              <div className="d-flex align-items-center">
                                <span className="avatar avatar-md bg-info-transparent text-info rounded me-2 flex-shrink-0">
                                  <i className="ti ti-map-pin fs-20" />
                                </span>
                                <div className="overflow-hidden">
                                  <p className="fs-12 text-muted mb-0">
                                    Location
                                  </p>
                                  <p className="mb-0 fw-medium text-dark text-truncate">
                                    Block A, Floor 3
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6 col-xl-4">
                              <div className="d-flex align-items-center">
                                <span className="avatar avatar-md bg-warning-transparent text-warning rounded me-2 flex-shrink-0">
                                  <i className="ti ti-calendar fs-20" />
                                </span>
                                <div className="overflow-hidden">
                                  <p className="fs-12 text-muted mb-0">
                                    Established Date
                                  </p>
                                  <p className="mb-0 fw-medium text-dark text-truncate">
                                    12 Jan 2020
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6 col-xl-4">
                              <div className="d-flex align-items-center">
                                <span className="avatar avatar-md bg-purple-transparent text-purple rounded me-2 flex-shrink-0">
                                  <i className="ti ti-users fs-20" />
                                </span>
                                <div className="overflow-hidden">
                                  <p className="fs-12 text-muted mb-0">
                                    Total Employees
                                  </p>
                                  <p className="mb-0 fw-medium text-dark text-truncate">
                                    18
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6 col-xl-4">
                              <div className="d-flex align-items-center">
                                <span className="avatar avatar-md bg-danger-transparent text-danger rounded me-2 flex-shrink-0">
                                  <i className="ti ti-book fs-20" />
                                </span>
                                <div className="overflow-hidden">
                                  <p className="fs-12 text-muted mb-0">
                                    Total Subjects
                                  </p>
                                  <p className="mb-0 fw-medium text-dark text-truncate">
                                    0
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6 col-xl-4">
                              <div className="d-flex align-items-center">
                                <span className="avatar avatar-md bg-secondary-transparent text-secondary rounded me-2 flex-shrink-0">
                                  <i className="ti ti-clipboard-list fs-20" />
                                </span>
                                <div className="overflow-hidden">
                                  <p className="fs-12 text-muted mb-0">
                                    Assigned Classes
                                  </p>
                                  <p className="mb-0 fw-medium text-dark text-truncate">
                                    0
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6 col-xl-4">
                              <div className="d-flex align-items-center">
                                <span className="avatar avatar-md bg-info-transparent text-info rounded me-2 flex-shrink-0">
                                  <i className="ti ti-school fs-20" />
                                </span>
                                <div className="overflow-hidden">
                                  <p className="fs-12 text-muted mb-0">
                                    Active Teachers
                                  </p>
                                  <p className="mb-0 fw-medium text-dark text-truncate">
                                    0
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6 col-xl-4">
                              <div className="d-flex align-items-center">
                                <span className="avatar avatar-md bg-primary-transparent text-primary rounded me-2 flex-shrink-0">
                                  <i className="ti ti-phone-plus fs-20" />
                                </span>
                                <div className="overflow-hidden">
                                  <p className="fs-12 text-muted mb-0">
                                    Office Extension
                                  </p>
                                  <p className="mb-0 fw-medium text-dark text-truncate">
                                    Ext. 106
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6 col-xl-4">
                              <div className="d-flex align-items-center">
                                <span className="avatar avatar-md bg-success-transparent text-success rounded me-2 flex-shrink-0">
                                  <i className="ti ti-mail fs-20" />
                                </span>
                                <div className="overflow-hidden">
                                  <p className="fs-12 text-muted mb-0">
                                    Department Email
                                  </p>
                                  <p className="mb-0 fw-medium text-dark text-truncate">
                                    transport@preskool.com
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="d-flex align-items-center justify-content-between mb-3">
                            <h6 className="mb-0">Assigned Staff</h6>
                            <a
                              href="#"
                              className="btn btn-sm btn-outline-light bg-white"
                              data-bs-toggle="modal"
                              data-bs-target="#assign_staff"
                            >
                              <i className="ti ti-user-plus me-1" />
                              Assign
                            </a>
                          </div>
                          <div className="row g-3 mb-4">
                            <div className="col-6">
                              <div className="card card-hover mb-0 h-100">
                                <div className="card-body text-center">
                                  <span className="avatar avatar-lg rounded-circle flex-shrink-0 mb-2">
                                    <img
                                      src="assets/img/teachers/teacher-01.jpg"
                                      className="rounded-circle flex-shrink-0"
                                      alt="Teresa Susan"
                                    />
                                  </span>
                                  <h6 className="mb-0 text-truncate">
                                    Teresa Susan
                                  </h6>
                                  <span className="fs-12 text-muted d-block mb-2">
                                    Senior Teacher
                                  </span>
                                  <div className="d-flex align-items-center justify-content-center flex-wrap gap-1 mb-2">
                                    <span className="badge badge-soft-primary">
                                      Physics
                                    </span>
                                    <span className="badge badge-soft-success">
                                      Active
                                    </span>
                                  </div>
                                  <a
                                    href="tel:+14654884498"
                                    className="fs-12 text-muted d-inline-flex align-items-center"
                                  >
                                    <i className="ti ti-phone me-1" />
                                    +1 46548 84498
                                  </a>
                                </div>
                              </div>
                            </div>
                            <div className="col-6">
                              <div className="card card-hover mb-0 h-100">
                                <div className="card-body text-center">
                                  <span className="avatar avatar-lg rounded-circle flex-shrink-0 mb-2">
                                    <img
                                      src="assets/img/teachers/teacher-02.jpg"
                                      className="rounded-circle flex-shrink-0"
                                      alt="John Doe"
                                    />
                                  </span>
                                  <h6 className="mb-0 text-truncate">
                                    John Doe
                                  </h6>
                                  <span className="fs-12 text-muted d-block mb-2">
                                    Coordinator
                                  </span>
                                  <div className="d-flex align-items-center justify-content-center flex-wrap gap-1 mb-2">
                                    <span className="badge badge-soft-primary">
                                      Science
                                    </span>
                                    <span className="badge badge-soft-success">
                                      Active
                                    </span>
                                  </div>
                                  <a
                                    href="tel:+14654811223"
                                    className="fs-12 text-muted d-inline-flex align-items-center"
                                  >
                                    <i className="ti ti-phone me-1" />
                                    +1 46548 11223
                                  </a>
                                </div>
                              </div>
                            </div>
                            <div className="col-6">
                              <div className="card card-hover mb-0 h-100">
                                <div className="card-body text-center">
                                  <span className="avatar avatar-lg rounded-circle flex-shrink-0 mb-2">
                                    <img
                                      src="assets/img/teachers/teacher-03.jpg"
                                      className="rounded-circle flex-shrink-0"
                                      alt="Hellana Robert"
                                    />
                                  </span>
                                  <h6 className="mb-0 text-truncate">
                                    Hellana Robert
                                  </h6>
                                  <span className="fs-12 text-muted d-block mb-2">
                                    Teacher
                                  </span>
                                  <div className="d-flex align-items-center justify-content-center flex-wrap gap-1 mb-2">
                                    <span className="badge badge-soft-primary">
                                      English
                                    </span>
                                    <span className="badge badge-soft-warning">
                                      On Leave
                                    </span>
                                  </div>
                                  <a
                                    href="tel:+14654855667"
                                    className="fs-12 text-muted d-inline-flex align-items-center"
                                  >
                                    <i className="ti ti-phone me-1" />
                                    +1 46548 55667
                                  </a>
                                </div>
                              </div>
                            </div>
                            <div className="col-6">
                              <div className="card card-hover mb-0 h-100">
                                <div className="card-body text-center">
                                  <span className="avatar avatar-lg rounded-circle flex-shrink-0 mb-2">
                                    <img
                                      src="assets/img/teachers/teacher-05.jpg"
                                      className="rounded-circle flex-shrink-0"
                                      alt="Morgan Lee"
                                    />
                                  </span>
                                  <h6 className="mb-0 text-truncate">
                                    Morgan Lee
                                  </h6>
                                  <span className="fs-12 text-muted d-block mb-2">
                                    Assistant
                                  </span>
                                  <div className="d-flex align-items-center justify-content-center flex-wrap gap-1 mb-2">
                                    <span className="badge badge-soft-primary">
                                      Maths
                                    </span>
                                    <span className="badge badge-soft-success">
                                      Active
                                    </span>
                                  </div>
                                  <a
                                    href="tel:+14654899001"
                                    className="fs-12 text-muted d-inline-flex align-items-center"
                                  >
                                    <i className="ti ti-phone me-1" />
                                    +1 46548 99001
                                  </a>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="d-flex align-items-center justify-content-between mb-3">
                            <h6 className="mb-0">Subjects</h6>
                            <a
                              href="#"
                              className="btn btn-sm btn-outline-light bg-white"
                              data-bs-toggle="modal"
                              data-bs-target="#assign_subjects"
                            >
                              <i className="ti ti-book me-1" />
                              Assign
                            </a>
                          </div>
                          <div className="row g-3">
                            <div className="col-sm-6 col-xl-4">
                              <div className="border rounded p-3 d-flex align-items-center">
                                <span className="avatar avatar-md bg-primary-transparent text-primary rounded me-2 flex-shrink-0">
                                  <i className="ti ti-book fs-20" />
                                </span>
                                <div className="overflow-hidden">
                                  <p className="mb-0 fw-medium text-dark text-truncate">
                                    Mathematics
                                  </p>
                                  <span className="fs-12 text-muted">
                                    MTH-101 · 6 Teachers
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="col-sm-6 col-xl-4">
                              <div className="border rounded p-3 d-flex align-items-center">
                                <span className="avatar avatar-md bg-info-transparent text-info rounded me-2 flex-shrink-0">
                                  <i className="ti ti-book fs-20" />
                                </span>
                                <div className="overflow-hidden">
                                  <p className="mb-0 fw-medium text-dark text-truncate">
                                    Physics
                                  </p>
                                  <span className="fs-12 text-muted">
                                    PHY-102 · 4 Teachers
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="col-sm-6 col-xl-4">
                              <div className="border rounded p-3 d-flex align-items-center">
                                <span className="avatar avatar-md bg-success-transparent text-success rounded me-2 flex-shrink-0">
                                  <i className="ti ti-book fs-20" />
                                </span>
                                <div className="overflow-hidden">
                                  <p className="mb-0 fw-medium text-dark text-truncate">
                                    Chemistry
                                  </p>
                                  <span className="fs-12 text-muted">
                                    CHM-103 · 3 Teachers
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="col-sm-6 col-xl-4">
                              <div className="border rounded p-3 d-flex align-items-center">
                                <span className="avatar avatar-md bg-warning-transparent text-warning rounded me-2 flex-shrink-0">
                                  <i className="ti ti-book fs-20" />
                                </span>
                                <div className="overflow-hidden">
                                  <p className="mb-0 fw-medium text-dark text-truncate">
                                    English
                                  </p>
                                  <span className="fs-12 text-muted">
                                    ENG-104 · 5 Teachers
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="col-sm-6 col-xl-4">
                              <div className="border rounded p-3 d-flex align-items-center">
                                <span className="avatar avatar-md bg-danger-transparent text-danger rounded me-2 flex-shrink-0">
                                  <i className="ti ti-book fs-20" />
                                </span>
                                <div className="overflow-hidden">
                                  <p className="mb-0 fw-medium text-dark text-truncate">
                                    Computer Science
                                  </p>
                                  <span className="fs-12 text-muted">
                                    CSC-105 · 4 Teachers
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="dept-pane d-none" id="dept_6">
                      <div className="card mb-0 dept-detail">
                        <div className="p-4 bg-purple-transparent rounded-top">
                          <div className="d-xl-flex align-items-start justify-content-between">
                            <div className="d-flex align-items-center mb-3 mb-xl-0">
                              <span className="avatar avatar-xl bg-white text-purple rounded me-3 flex-shrink-0">
                                <i className="ti ti-building-fortress fs-28" />
                              </span>
                              <div>
                                <div className="d-flex align-items-center flex-wrap gap-2 mb-1">
                                  <h4 className="mb-0">Hostel</h4>
                                  <span className="badge bg-purple-transparent text-purple">
                                    D757242
                                  </span>
                                  <span className="badge badge-soft-success d-inline-flex align-items-center">
                                    <i className="ti ti-circle-filled fs-5 me-1" />
                                    Active
                                  </span>
                                </div>
                                <p className="mb-0 text-muted">
                                  Oversees residential blocks, wardens, mess and
                                  boarder welfare.
                                </p>
                              </div>
                            </div>
                            <div className="d-flex align-items-center flex-wrap gap-1">
                              <a
                                href="#"
                                className="btn btn-outline-light bg-white btn-icon btn-sm rounded-circle flex-shrink-0"
                                data-bs-toggle="modal"
                                data-bs-target="#department_details"
                                title="View"
                                aria-label="View"
                              >
                                <i className="ti ti-eye" />
                              </a>
                              <a
                                href="#"
                                className="btn btn-outline-light bg-white btn-icon btn-sm rounded-circle flex-shrink-0"
                                data-bs-toggle="modal"
                                data-bs-target="#edit_department"
                                title="Edit"
                                aria-label="Edit"
                              >
                                <i className="ti ti-edit" />
                              </a>
                              <a
                                href="#"
                                className="btn btn-outline-light bg-white btn-icon btn-sm rounded-circle flex-shrink-0"
                                data-bs-toggle="modal"
                                data-bs-target="#assign_staff"
                                title="Assign Staff"
                                aria-label="Assign Staff"
                              >
                                <i className="ti ti-user-plus" />
                              </a>
                              <a
                                href="#"
                                className="btn btn-outline-light bg-white btn-icon btn-sm rounded-circle flex-shrink-0"
                                data-bs-toggle="modal"
                                data-bs-target="#assign_subjects"
                                title="Assign Subjects"
                                aria-label="Assign Subjects"
                              >
                                <i className="ti ti-book" />
                              </a>
                              <a
                                href="#"
                                className="btn btn-outline-light bg-white btn-icon btn-sm rounded-circle flex-shrink-0"
                                data-bs-toggle="modal"
                                data-bs-target="#edit_department"
                                title="Department Settings"
                                aria-label="Department Settings"
                              >
                                <i className="ti ti-settings" />
                              </a>
                              <a
                                href="#"
                                className="btn btn-outline-light bg-white btn-icon btn-sm rounded-circle flex-shrink-0"
                                data-dept-print=""
                                data-bs-toggle="tooltip"
                                title="Print"
                                aria-label="Print"
                              >
                                <i className="ti ti-printer" />
                              </a>
                              <div className="dropdown">
                                <a
                                  href="#"
                                  className="btn btn-outline-light bg-white btn-icon btn-sm rounded-circle flex-shrink-0"
                                  data-bs-toggle="dropdown"
                                  aria-label="More"
                                >
                                  <i className="ti ti-dots-vertical" />
                                </a>
                                <ul className="dropdown-menu dropdown-menu-end p-2">
                                  <li>
                                    <a
                                      className="dropdown-item rounded-1"
                                      href="#"
                                    >
                                      <i className="ti ti-copy me-2" />
                                      Duplicate
                                    </a>
                                  </li>
                                  <li>
                                    <a
                                      className="dropdown-item rounded-1"
                                      href="#"
                                    >
                                      <i className="ti ti-archive me-2" />
                                      Archive
                                    </a>
                                  </li>
                                  <li>
                                    <a
                                      className="dropdown-item rounded-1 text-danger"
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
                        </div>
                        <div className="card-body">
                          <h5 className="mb-3 fs-15">Department Information</h5>
                          <div className="row g-3 mb-4">
                            <div className="col-md-6 col-xl-4">
                              <div className="d-flex align-items-center">
                                <span className="avatar avatar-md bg-primary-transparent text-primary rounded me-2 flex-shrink-0">
                                  <i className="ti ti-user-star fs-20" />
                                </span>
                                <div className="overflow-hidden">
                                  <p className="fs-12 text-muted mb-0">
                                    Head of Department
                                  </p>
                                  <p className="mb-0 fw-medium text-dark text-truncate">
                                    Nina Patel
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6 col-xl-4">
                              <div className="d-flex align-items-center">
                                <span className="avatar avatar-md bg-success-transparent text-success rounded me-2 flex-shrink-0">
                                  <i className="ti ti-phone fs-20" />
                                </span>
                                <div className="overflow-hidden">
                                  <p className="fs-12 text-muted mb-0">
                                    Contact Information
                                  </p>
                                  <p className="mb-0 fw-medium text-dark text-truncate">
                                    +1 46548 84406
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6 col-xl-4">
                              <div className="d-flex align-items-center">
                                <span className="avatar avatar-md bg-info-transparent text-info rounded me-2 flex-shrink-0">
                                  <i className="ti ti-map-pin fs-20" />
                                </span>
                                <div className="overflow-hidden">
                                  <p className="fs-12 text-muted mb-0">
                                    Location
                                  </p>
                                  <p className="mb-0 fw-medium text-dark text-truncate">
                                    Block A, Floor 1
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6 col-xl-4">
                              <div className="d-flex align-items-center">
                                <span className="avatar avatar-md bg-warning-transparent text-warning rounded me-2 flex-shrink-0">
                                  <i className="ti ti-calendar fs-20" />
                                </span>
                                <div className="overflow-hidden">
                                  <p className="fs-12 text-muted mb-0">
                                    Established Date
                                  </p>
                                  <p className="mb-0 fw-medium text-dark text-truncate">
                                    12 Jan 2015
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6 col-xl-4">
                              <div className="d-flex align-items-center">
                                <span className="avatar avatar-md bg-purple-transparent text-purple rounded me-2 flex-shrink-0">
                                  <i className="ti ti-users fs-20" />
                                </span>
                                <div className="overflow-hidden">
                                  <p className="fs-12 text-muted mb-0">
                                    Total Employees
                                  </p>
                                  <p className="mb-0 fw-medium text-dark text-truncate">
                                    22
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6 col-xl-4">
                              <div className="d-flex align-items-center">
                                <span className="avatar avatar-md bg-danger-transparent text-danger rounded me-2 flex-shrink-0">
                                  <i className="ti ti-book fs-20" />
                                </span>
                                <div className="overflow-hidden">
                                  <p className="fs-12 text-muted mb-0">
                                    Total Subjects
                                  </p>
                                  <p className="mb-0 fw-medium text-dark text-truncate">
                                    0
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6 col-xl-4">
                              <div className="d-flex align-items-center">
                                <span className="avatar avatar-md bg-secondary-transparent text-secondary rounded me-2 flex-shrink-0">
                                  <i className="ti ti-clipboard-list fs-20" />
                                </span>
                                <div className="overflow-hidden">
                                  <p className="fs-12 text-muted mb-0">
                                    Assigned Classes
                                  </p>
                                  <p className="mb-0 fw-medium text-dark text-truncate">
                                    0
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6 col-xl-4">
                              <div className="d-flex align-items-center">
                                <span className="avatar avatar-md bg-info-transparent text-info rounded me-2 flex-shrink-0">
                                  <i className="ti ti-school fs-20" />
                                </span>
                                <div className="overflow-hidden">
                                  <p className="fs-12 text-muted mb-0">
                                    Active Teachers
                                  </p>
                                  <p className="mb-0 fw-medium text-dark text-truncate">
                                    0
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6 col-xl-4">
                              <div className="d-flex align-items-center">
                                <span className="avatar avatar-md bg-primary-transparent text-primary rounded me-2 flex-shrink-0">
                                  <i className="ti ti-phone-plus fs-20" />
                                </span>
                                <div className="overflow-hidden">
                                  <p className="fs-12 text-muted mb-0">
                                    Office Extension
                                  </p>
                                  <p className="mb-0 fw-medium text-dark text-truncate">
                                    Ext. 107
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6 col-xl-4">
                              <div className="d-flex align-items-center">
                                <span className="avatar avatar-md bg-success-transparent text-success rounded me-2 flex-shrink-0">
                                  <i className="ti ti-mail fs-20" />
                                </span>
                                <div className="overflow-hidden">
                                  <p className="fs-12 text-muted mb-0">
                                    Department Email
                                  </p>
                                  <p className="mb-0 fw-medium text-dark text-truncate">
                                    hostel@preskool.com
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="d-flex align-items-center justify-content-between mb-3">
                            <h6 className="mb-0">Assigned Staff</h6>
                            <a
                              href="#"
                              className="btn btn-sm btn-outline-light bg-white"
                              data-bs-toggle="modal"
                              data-bs-target="#assign_staff"
                            >
                              <i className="ti ti-user-plus me-1" />
                              Assign
                            </a>
                          </div>
                          <div className="row g-3 mb-4">
                            <div className="col-6">
                              <div className="card card-hover mb-0 h-100">
                                <div className="card-body text-center">
                                  <span className="avatar avatar-lg rounded-circle flex-shrink-0 mb-2">
                                    <img
                                      src="assets/img/teachers/teacher-01.jpg"
                                      className="rounded-circle flex-shrink-0"
                                      alt="Teresa Susan"
                                    />
                                  </span>
                                  <h6 className="mb-0 text-truncate">
                                    Teresa Susan
                                  </h6>
                                  <span className="fs-12 text-muted d-block mb-2">
                                    Senior Teacher
                                  </span>
                                  <div className="d-flex align-items-center justify-content-center flex-wrap gap-1 mb-2">
                                    <span className="badge badge-soft-primary">
                                      Physics
                                    </span>
                                    <span className="badge badge-soft-success">
                                      Active
                                    </span>
                                  </div>
                                  <a
                                    href="tel:+14654884498"
                                    className="fs-12 text-muted d-inline-flex align-items-center"
                                  >
                                    <i className="ti ti-phone me-1" />
                                    +1 46548 84498
                                  </a>
                                </div>
                              </div>
                            </div>
                            <div className="col-6">
                              <div className="card card-hover mb-0 h-100">
                                <div className="card-body text-center">
                                  <span className="avatar avatar-lg rounded-circle flex-shrink-0 mb-2">
                                    <img
                                      src="assets/img/teachers/teacher-02.jpg"
                                      className="rounded-circle flex-shrink-0"
                                      alt="John Doe"
                                    />
                                  </span>
                                  <h6 className="mb-0 text-truncate">
                                    John Doe
                                  </h6>
                                  <span className="fs-12 text-muted d-block mb-2">
                                    Coordinator
                                  </span>
                                  <div className="d-flex align-items-center justify-content-center flex-wrap gap-1 mb-2">
                                    <span className="badge badge-soft-primary">
                                      Science
                                    </span>
                                    <span className="badge badge-soft-success">
                                      Active
                                    </span>
                                  </div>
                                  <a
                                    href="tel:+14654811223"
                                    className="fs-12 text-muted d-inline-flex align-items-center"
                                  >
                                    <i className="ti ti-phone me-1" />
                                    +1 46548 11223
                                  </a>
                                </div>
                              </div>
                            </div>
                            <div className="col-6">
                              <div className="card card-hover mb-0 h-100">
                                <div className="card-body text-center">
                                  <span className="avatar avatar-lg rounded-circle flex-shrink-0 mb-2">
                                    <img
                                      src="assets/img/teachers/teacher-03.jpg"
                                      className="rounded-circle flex-shrink-0"
                                      alt="Hellana Robert"
                                    />
                                  </span>
                                  <h6 className="mb-0 text-truncate">
                                    Hellana Robert
                                  </h6>
                                  <span className="fs-12 text-muted d-block mb-2">
                                    Teacher
                                  </span>
                                  <div className="d-flex align-items-center justify-content-center flex-wrap gap-1 mb-2">
                                    <span className="badge badge-soft-primary">
                                      English
                                    </span>
                                    <span className="badge badge-soft-warning">
                                      On Leave
                                    </span>
                                  </div>
                                  <a
                                    href="tel:+14654855667"
                                    className="fs-12 text-muted d-inline-flex align-items-center"
                                  >
                                    <i className="ti ti-phone me-1" />
                                    +1 46548 55667
                                  </a>
                                </div>
                              </div>
                            </div>
                            <div className="col-6">
                              <div className="card card-hover mb-0 h-100">
                                <div className="card-body text-center">
                                  <span className="avatar avatar-lg rounded-circle flex-shrink-0 mb-2">
                                    <img
                                      src="assets/img/teachers/teacher-05.jpg"
                                      className="rounded-circle flex-shrink-0"
                                      alt="Morgan Lee"
                                    />
                                  </span>
                                  <h6 className="mb-0 text-truncate">
                                    Morgan Lee
                                  </h6>
                                  <span className="fs-12 text-muted d-block mb-2">
                                    Assistant
                                  </span>
                                  <div className="d-flex align-items-center justify-content-center flex-wrap gap-1 mb-2">
                                    <span className="badge badge-soft-primary">
                                      Maths
                                    </span>
                                    <span className="badge badge-soft-success">
                                      Active
                                    </span>
                                  </div>
                                  <a
                                    href="tel:+14654899001"
                                    className="fs-12 text-muted d-inline-flex align-items-center"
                                  >
                                    <i className="ti ti-phone me-1" />
                                    +1 46548 99001
                                  </a>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="d-flex align-items-center justify-content-between mb-3">
                            <h6 className="mb-0">Subjects</h6>
                            <a
                              href="#"
                              className="btn btn-sm btn-outline-light bg-white"
                              data-bs-toggle="modal"
                              data-bs-target="#assign_subjects"
                            >
                              <i className="ti ti-book me-1" />
                              Assign
                            </a>
                          </div>
                          <div className="row g-3">
                            <div className="col-sm-6 col-xl-4">
                              <div className="border rounded p-3 d-flex align-items-center">
                                <span className="avatar avatar-md bg-primary-transparent text-primary rounded me-2 flex-shrink-0">
                                  <i className="ti ti-book fs-20" />
                                </span>
                                <div className="overflow-hidden">
                                  <p className="mb-0 fw-medium text-dark text-truncate">
                                    Mathematics
                                  </p>
                                  <span className="fs-12 text-muted">
                                    MTH-101 · 6 Teachers
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="col-sm-6 col-xl-4">
                              <div className="border rounded p-3 d-flex align-items-center">
                                <span className="avatar avatar-md bg-info-transparent text-info rounded me-2 flex-shrink-0">
                                  <i className="ti ti-book fs-20" />
                                </span>
                                <div className="overflow-hidden">
                                  <p className="mb-0 fw-medium text-dark text-truncate">
                                    Physics
                                  </p>
                                  <span className="fs-12 text-muted">
                                    PHY-102 · 4 Teachers
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="col-sm-6 col-xl-4">
                              <div className="border rounded p-3 d-flex align-items-center">
                                <span className="avatar avatar-md bg-success-transparent text-success rounded me-2 flex-shrink-0">
                                  <i className="ti ti-book fs-20" />
                                </span>
                                <div className="overflow-hidden">
                                  <p className="mb-0 fw-medium text-dark text-truncate">
                                    Chemistry
                                  </p>
                                  <span className="fs-12 text-muted">
                                    CHM-103 · 3 Teachers
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="col-sm-6 col-xl-4">
                              <div className="border rounded p-3 d-flex align-items-center">
                                <span className="avatar avatar-md bg-warning-transparent text-warning rounded me-2 flex-shrink-0">
                                  <i className="ti ti-book fs-20" />
                                </span>
                                <div className="overflow-hidden">
                                  <p className="mb-0 fw-medium text-dark text-truncate">
                                    English
                                  </p>
                                  <span className="fs-12 text-muted">
                                    ENG-104 · 5 Teachers
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="col-sm-6 col-xl-4">
                              <div className="border rounded p-3 d-flex align-items-center">
                                <span className="avatar avatar-md bg-danger-transparent text-danger rounded me-2 flex-shrink-0">
                                  <i className="ti ti-book fs-20" />
                                </span>
                                <div className="overflow-hidden">
                                  <p className="mb-0 fw-medium text-dark text-truncate">
                                    Computer Science
                                  </p>
                                  <span className="fs-12 text-muted">
                                    CSC-105 · 4 Teachers
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="dept-pane d-none" id="dept_7">
                      <div className="card mb-0 dept-detail">
                        <div className="p-4 bg-primary-transparent rounded-top">
                          <div className="d-xl-flex align-items-start justify-content-between">
                            <div className="d-flex align-items-center mb-3 mb-xl-0">
                              <span className="avatar avatar-xl bg-white text-primary rounded me-3 flex-shrink-0">
                                <i className="ti ti-briefcase fs-28" />
                              </span>
                              <div>
                                <div className="d-flex align-items-center flex-wrap gap-2 mb-1">
                                  <h4 className="mb-0">Management</h4>
                                  <span className="badge bg-primary-transparent text-primary">
                                    D757241
                                  </span>
                                  <span className="badge badge-soft-success d-inline-flex align-items-center">
                                    <i className="ti ti-circle-filled fs-5 me-1" />
                                    Active
                                  </span>
                                </div>
                                <p className="mb-0 text-muted">
                                  Strategic leadership, HR policy, staff
                                  onboarding and institutional planning.
                                </p>
                              </div>
                            </div>
                            <div className="d-flex align-items-center flex-wrap gap-1">
                              <a
                                href="#"
                                className="btn btn-outline-light bg-white btn-icon btn-sm rounded-circle flex-shrink-0"
                                data-bs-toggle="modal"
                                data-bs-target="#department_details"
                                title="View"
                                aria-label="View"
                              >
                                <i className="ti ti-eye" />
                              </a>
                              <a
                                href="#"
                                className="btn btn-outline-light bg-white btn-icon btn-sm rounded-circle flex-shrink-0"
                                data-bs-toggle="modal"
                                data-bs-target="#edit_department"
                                title="Edit"
                                aria-label="Edit"
                              >
                                <i className="ti ti-edit" />
                              </a>
                              <a
                                href="#"
                                className="btn btn-outline-light bg-white btn-icon btn-sm rounded-circle flex-shrink-0"
                                data-bs-toggle="modal"
                                data-bs-target="#assign_staff"
                                title="Assign Staff"
                                aria-label="Assign Staff"
                              >
                                <i className="ti ti-user-plus" />
                              </a>
                              <a
                                href="#"
                                className="btn btn-outline-light bg-white btn-icon btn-sm rounded-circle flex-shrink-0"
                                data-bs-toggle="modal"
                                data-bs-target="#assign_subjects"
                                title="Assign Subjects"
                                aria-label="Assign Subjects"
                              >
                                <i className="ti ti-book" />
                              </a>
                              <a
                                href="#"
                                className="btn btn-outline-light bg-white btn-icon btn-sm rounded-circle flex-shrink-0"
                                data-bs-toggle="modal"
                                data-bs-target="#edit_department"
                                title="Department Settings"
                                aria-label="Department Settings"
                              >
                                <i className="ti ti-settings" />
                              </a>
                              <a
                                href="#"
                                className="btn btn-outline-light bg-white btn-icon btn-sm rounded-circle flex-shrink-0"
                                data-dept-print=""
                                data-bs-toggle="tooltip"
                                title="Print"
                                aria-label="Print"
                              >
                                <i className="ti ti-printer" />
                              </a>
                              <div className="dropdown">
                                <a
                                  href="#"
                                  className="btn btn-outline-light bg-white btn-icon btn-sm rounded-circle flex-shrink-0"
                                  data-bs-toggle="dropdown"
                                  aria-label="More"
                                >
                                  <i className="ti ti-dots-vertical" />
                                </a>
                                <ul className="dropdown-menu dropdown-menu-end p-2">
                                  <li>
                                    <a
                                      className="dropdown-item rounded-1"
                                      href="#"
                                    >
                                      <i className="ti ti-copy me-2" />
                                      Duplicate
                                    </a>
                                  </li>
                                  <li>
                                    <a
                                      className="dropdown-item rounded-1"
                                      href="#"
                                    >
                                      <i className="ti ti-archive me-2" />
                                      Archive
                                    </a>
                                  </li>
                                  <li>
                                    <a
                                      className="dropdown-item rounded-1 text-danger"
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
                        </div>
                        <div className="card-body">
                          <h5 className="mb-3 fs-15">Department Information</h5>
                          <div className="row g-3 mb-4">
                            <div className="col-md-6 col-xl-4">
                              <div className="d-flex align-items-center">
                                <span className="avatar avatar-md bg-primary-transparent text-primary rounded me-2 flex-shrink-0">
                                  <i className="ti ti-user-star fs-20" />
                                </span>
                                <div className="overflow-hidden">
                                  <p className="fs-12 text-muted mb-0">
                                    Head of Department
                                  </p>
                                  <p className="mb-0 fw-medium text-dark text-truncate">
                                    Alan Poe
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6 col-xl-4">
                              <div className="d-flex align-items-center">
                                <span className="avatar avatar-md bg-success-transparent text-success rounded me-2 flex-shrink-0">
                                  <i className="ti ti-phone fs-20" />
                                </span>
                                <div className="overflow-hidden">
                                  <p className="fs-12 text-muted mb-0">
                                    Contact Information
                                  </p>
                                  <p className="mb-0 fw-medium text-dark text-truncate">
                                    +1 46548 84407
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6 col-xl-4">
                              <div className="d-flex align-items-center">
                                <span className="avatar avatar-md bg-info-transparent text-info rounded me-2 flex-shrink-0">
                                  <i className="ti ti-map-pin fs-20" />
                                </span>
                                <div className="overflow-hidden">
                                  <p className="fs-12 text-muted mb-0">
                                    Location
                                  </p>
                                  <p className="mb-0 fw-medium text-dark text-truncate">
                                    Block A, Floor 2
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6 col-xl-4">
                              <div className="d-flex align-items-center">
                                <span className="avatar avatar-md bg-warning-transparent text-warning rounded me-2 flex-shrink-0">
                                  <i className="ti ti-calendar fs-20" />
                                </span>
                                <div className="overflow-hidden">
                                  <p className="fs-12 text-muted mb-0">
                                    Established Date
                                  </p>
                                  <p className="mb-0 fw-medium text-dark text-truncate">
                                    12 Jan 2016
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6 col-xl-4">
                              <div className="d-flex align-items-center">
                                <span className="avatar avatar-md bg-purple-transparent text-purple rounded me-2 flex-shrink-0">
                                  <i className="ti ti-users fs-20" />
                                </span>
                                <div className="overflow-hidden">
                                  <p className="fs-12 text-muted mb-0">
                                    Total Employees
                                  </p>
                                  <p className="mb-0 fw-medium text-dark text-truncate">
                                    12
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6 col-xl-4">
                              <div className="d-flex align-items-center">
                                <span className="avatar avatar-md bg-danger-transparent text-danger rounded me-2 flex-shrink-0">
                                  <i className="ti ti-book fs-20" />
                                </span>
                                <div className="overflow-hidden">
                                  <p className="fs-12 text-muted mb-0">
                                    Total Subjects
                                  </p>
                                  <p className="mb-0 fw-medium text-dark text-truncate">
                                    0
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6 col-xl-4">
                              <div className="d-flex align-items-center">
                                <span className="avatar avatar-md bg-secondary-transparent text-secondary rounded me-2 flex-shrink-0">
                                  <i className="ti ti-clipboard-list fs-20" />
                                </span>
                                <div className="overflow-hidden">
                                  <p className="fs-12 text-muted mb-0">
                                    Assigned Classes
                                  </p>
                                  <p className="mb-0 fw-medium text-dark text-truncate">
                                    0
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6 col-xl-4">
                              <div className="d-flex align-items-center">
                                <span className="avatar avatar-md bg-info-transparent text-info rounded me-2 flex-shrink-0">
                                  <i className="ti ti-school fs-20" />
                                </span>
                                <div className="overflow-hidden">
                                  <p className="fs-12 text-muted mb-0">
                                    Active Teachers
                                  </p>
                                  <p className="mb-0 fw-medium text-dark text-truncate">
                                    0
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6 col-xl-4">
                              <div className="d-flex align-items-center">
                                <span className="avatar avatar-md bg-primary-transparent text-primary rounded me-2 flex-shrink-0">
                                  <i className="ti ti-phone-plus fs-20" />
                                </span>
                                <div className="overflow-hidden">
                                  <p className="fs-12 text-muted mb-0">
                                    Office Extension
                                  </p>
                                  <p className="mb-0 fw-medium text-dark text-truncate">
                                    Ext. 108
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6 col-xl-4">
                              <div className="d-flex align-items-center">
                                <span className="avatar avatar-md bg-success-transparent text-success rounded me-2 flex-shrink-0">
                                  <i className="ti ti-mail fs-20" />
                                </span>
                                <div className="overflow-hidden">
                                  <p className="fs-12 text-muted mb-0">
                                    Department Email
                                  </p>
                                  <p className="mb-0 fw-medium text-dark text-truncate">
                                    management@preskool.com
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="d-flex align-items-center justify-content-between mb-3">
                            <h6 className="mb-0">Assigned Staff</h6>
                            <a
                              href="#"
                              className="btn btn-sm btn-outline-light bg-white"
                              data-bs-toggle="modal"
                              data-bs-target="#assign_staff"
                            >
                              <i className="ti ti-user-plus me-1" />
                              Assign
                            </a>
                          </div>
                          <div className="row g-3 mb-4">
                            <div className="col-6">
                              <div className="card card-hover mb-0 h-100">
                                <div className="card-body text-center">
                                  <span className="avatar avatar-lg rounded-circle flex-shrink-0 mb-2">
                                    <img
                                      src="assets/img/teachers/teacher-01.jpg"
                                      className="rounded-circle flex-shrink-0"
                                      alt="Teresa Susan"
                                    />
                                  </span>
                                  <h6 className="mb-0 text-truncate">
                                    Teresa Susan
                                  </h6>
                                  <span className="fs-12 text-muted d-block mb-2">
                                    Senior Teacher
                                  </span>
                                  <div className="d-flex align-items-center justify-content-center flex-wrap gap-1 mb-2">
                                    <span className="badge badge-soft-primary">
                                      Physics
                                    </span>
                                    <span className="badge badge-soft-success">
                                      Active
                                    </span>
                                  </div>
                                  <a
                                    href="tel:+14654884498"
                                    className="fs-12 text-muted d-inline-flex align-items-center"
                                  >
                                    <i className="ti ti-phone me-1" />
                                    +1 46548 84498
                                  </a>
                                </div>
                              </div>
                            </div>
                            <div className="col-6">
                              <div className="card card-hover mb-0 h-100">
                                <div className="card-body text-center">
                                  <span className="avatar avatar-lg rounded-circle flex-shrink-0 mb-2">
                                    <img
                                      src="assets/img/teachers/teacher-02.jpg"
                                      className="rounded-circle flex-shrink-0"
                                      alt="John Doe"
                                    />
                                  </span>
                                  <h6 className="mb-0 text-truncate">
                                    John Doe
                                  </h6>
                                  <span className="fs-12 text-muted d-block mb-2">
                                    Coordinator
                                  </span>
                                  <div className="d-flex align-items-center justify-content-center flex-wrap gap-1 mb-2">
                                    <span className="badge badge-soft-primary">
                                      Science
                                    </span>
                                    <span className="badge badge-soft-success">
                                      Active
                                    </span>
                                  </div>
                                  <a
                                    href="tel:+14654811223"
                                    className="fs-12 text-muted d-inline-flex align-items-center"
                                  >
                                    <i className="ti ti-phone me-1" />
                                    +1 46548 11223
                                  </a>
                                </div>
                              </div>
                            </div>
                            <div className="col-6">
                              <div className="card card-hover mb-0 h-100">
                                <div className="card-body text-center">
                                  <span className="avatar avatar-lg rounded-circle flex-shrink-0 mb-2">
                                    <img
                                      src="assets/img/teachers/teacher-03.jpg"
                                      className="rounded-circle flex-shrink-0"
                                      alt="Hellana Robert"
                                    />
                                  </span>
                                  <h6 className="mb-0 text-truncate">
                                    Hellana Robert
                                  </h6>
                                  <span className="fs-12 text-muted d-block mb-2">
                                    Teacher
                                  </span>
                                  <div className="d-flex align-items-center justify-content-center flex-wrap gap-1 mb-2">
                                    <span className="badge badge-soft-primary">
                                      English
                                    </span>
                                    <span className="badge badge-soft-warning">
                                      On Leave
                                    </span>
                                  </div>
                                  <a
                                    href="tel:+14654855667"
                                    className="fs-12 text-muted d-inline-flex align-items-center"
                                  >
                                    <i className="ti ti-phone me-1" />
                                    +1 46548 55667
                                  </a>
                                </div>
                              </div>
                            </div>
                            <div className="col-6">
                              <div className="card card-hover mb-0 h-100">
                                <div className="card-body text-center">
                                  <span className="avatar avatar-lg rounded-circle flex-shrink-0 mb-2">
                                    <img
                                      src="assets/img/teachers/teacher-05.jpg"
                                      className="rounded-circle flex-shrink-0"
                                      alt="Morgan Lee"
                                    />
                                  </span>
                                  <h6 className="mb-0 text-truncate">
                                    Morgan Lee
                                  </h6>
                                  <span className="fs-12 text-muted d-block mb-2">
                                    Assistant
                                  </span>
                                  <div className="d-flex align-items-center justify-content-center flex-wrap gap-1 mb-2">
                                    <span className="badge badge-soft-primary">
                                      Maths
                                    </span>
                                    <span className="badge badge-soft-success">
                                      Active
                                    </span>
                                  </div>
                                  <a
                                    href="tel:+14654899001"
                                    className="fs-12 text-muted d-inline-flex align-items-center"
                                  >
                                    <i className="ti ti-phone me-1" />
                                    +1 46548 99001
                                  </a>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="d-flex align-items-center justify-content-between mb-3">
                            <h6 className="mb-0">Subjects</h6>
                            <a
                              href="#"
                              className="btn btn-sm btn-outline-light bg-white"
                              data-bs-toggle="modal"
                              data-bs-target="#assign_subjects"
                            >
                              <i className="ti ti-book me-1" />
                              Assign
                            </a>
                          </div>
                          <div className="row g-3">
                            <div className="col-sm-6 col-xl-4">
                              <div className="border rounded p-3 d-flex align-items-center">
                                <span className="avatar avatar-md bg-primary-transparent text-primary rounded me-2 flex-shrink-0">
                                  <i className="ti ti-book fs-20" />
                                </span>
                                <div className="overflow-hidden">
                                  <p className="mb-0 fw-medium text-dark text-truncate">
                                    Mathematics
                                  </p>
                                  <span className="fs-12 text-muted">
                                    MTH-101 · 6 Teachers
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="col-sm-6 col-xl-4">
                              <div className="border rounded p-3 d-flex align-items-center">
                                <span className="avatar avatar-md bg-info-transparent text-info rounded me-2 flex-shrink-0">
                                  <i className="ti ti-book fs-20" />
                                </span>
                                <div className="overflow-hidden">
                                  <p className="mb-0 fw-medium text-dark text-truncate">
                                    Physics
                                  </p>
                                  <span className="fs-12 text-muted">
                                    PHY-102 · 4 Teachers
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="col-sm-6 col-xl-4">
                              <div className="border rounded p-3 d-flex align-items-center">
                                <span className="avatar avatar-md bg-success-transparent text-success rounded me-2 flex-shrink-0">
                                  <i className="ti ti-book fs-20" />
                                </span>
                                <div className="overflow-hidden">
                                  <p className="mb-0 fw-medium text-dark text-truncate">
                                    Chemistry
                                  </p>
                                  <span className="fs-12 text-muted">
                                    CHM-103 · 3 Teachers
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="col-sm-6 col-xl-4">
                              <div className="border rounded p-3 d-flex align-items-center">
                                <span className="avatar avatar-md bg-warning-transparent text-warning rounded me-2 flex-shrink-0">
                                  <i className="ti ti-book fs-20" />
                                </span>
                                <div className="overflow-hidden">
                                  <p className="mb-0 fw-medium text-dark text-truncate">
                                    English
                                  </p>
                                  <span className="fs-12 text-muted">
                                    ENG-104 · 5 Teachers
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="col-sm-6 col-xl-4">
                              <div className="border rounded p-3 d-flex align-items-center">
                                <span className="avatar avatar-md bg-danger-transparent text-danger rounded me-2 flex-shrink-0">
                                  <i className="ti ti-book fs-20" />
                                </span>
                                <div className="overflow-hidden">
                                  <p className="mb-0 fw-medium text-dark text-truncate">
                                    Computer Science
                                  </p>
                                  <span className="fs-12 text-muted">
                                    CSC-105 · 4 Teachers
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="dept-pane d-none" id="dept_8">
                      <div className="card mb-0 dept-detail">
                        <div className="p-4 bg-info-transparent rounded-top">
                          <div className="d-xl-flex align-items-start justify-content-between">
                            <div className="d-flex align-items-center mb-3 mb-xl-0">
                              <span className="avatar avatar-xl bg-white text-info rounded me-3 flex-shrink-0">
                                <i className="ti ti-user-heart fs-28" />
                              </span>
                              <div>
                                <div className="d-flex align-items-center flex-wrap gap-2 mb-1">
                                  <h4 className="mb-0">Guidance</h4>
                                  <span className="badge bg-info-transparent text-info">
                                    D757240
                                  </span>
                                  <span className="badge badge-soft-danger d-inline-flex align-items-center">
                                    <i className="ti ti-circle-filled fs-5 me-1" />
                                    Inactive
                                  </span>
                                </div>
                                <p className="mb-0 text-muted">
                                  Provides counselling, career guidance and
                                  student support services.
                                </p>
                              </div>
                            </div>
                            <div className="d-flex align-items-center flex-wrap gap-1">
                              <a
                                href="#"
                                className="btn btn-outline-light bg-white btn-icon btn-sm rounded-circle flex-shrink-0"
                                data-bs-toggle="modal"
                                data-bs-target="#department_details"
                                title="View"
                                aria-label="View"
                              >
                                <i className="ti ti-eye" />
                              </a>
                              <a
                                href="#"
                                className="btn btn-outline-light bg-white btn-icon btn-sm rounded-circle flex-shrink-0"
                                data-bs-toggle="modal"
                                data-bs-target="#edit_department"
                                title="Edit"
                                aria-label="Edit"
                              >
                                <i className="ti ti-edit" />
                              </a>
                              <a
                                href="#"
                                className="btn btn-outline-light bg-white btn-icon btn-sm rounded-circle flex-shrink-0"
                                data-bs-toggle="modal"
                                data-bs-target="#assign_staff"
                                title="Assign Staff"
                                aria-label="Assign Staff"
                              >
                                <i className="ti ti-user-plus" />
                              </a>
                              <a
                                href="#"
                                className="btn btn-outline-light bg-white btn-icon btn-sm rounded-circle flex-shrink-0"
                                data-bs-toggle="modal"
                                data-bs-target="#assign_subjects"
                                title="Assign Subjects"
                                aria-label="Assign Subjects"
                              >
                                <i className="ti ti-book" />
                              </a>
                              <a
                                href="#"
                                className="btn btn-outline-light bg-white btn-icon btn-sm rounded-circle flex-shrink-0"
                                data-bs-toggle="modal"
                                data-bs-target="#edit_department"
                                title="Department Settings"
                                aria-label="Department Settings"
                              >
                                <i className="ti ti-settings" />
                              </a>
                              <a
                                href="#"
                                className="btn btn-outline-light bg-white btn-icon btn-sm rounded-circle flex-shrink-0"
                                data-dept-print=""
                                data-bs-toggle="tooltip"
                                title="Print"
                                aria-label="Print"
                              >
                                <i className="ti ti-printer" />
                              </a>
                              <div className="dropdown">
                                <a
                                  href="#"
                                  className="btn btn-outline-light bg-white btn-icon btn-sm rounded-circle flex-shrink-0"
                                  data-bs-toggle="dropdown"
                                  aria-label="More"
                                >
                                  <i className="ti ti-dots-vertical" />
                                </a>
                                <ul className="dropdown-menu dropdown-menu-end p-2">
                                  <li>
                                    <a
                                      className="dropdown-item rounded-1"
                                      href="#"
                                    >
                                      <i className="ti ti-copy me-2" />
                                      Duplicate
                                    </a>
                                  </li>
                                  <li>
                                    <a
                                      className="dropdown-item rounded-1"
                                      href="#"
                                    >
                                      <i className="ti ti-archive me-2" />
                                      Archive
                                    </a>
                                  </li>
                                  <li>
                                    <a
                                      className="dropdown-item rounded-1 text-danger"
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
                        </div>
                        <div className="card-body">
                          <h5 className="mb-3 fs-15">Department Information</h5>
                          <div className="row g-3 mb-4">
                            <div className="col-md-6 col-xl-4">
                              <div className="d-flex align-items-center">
                                <span className="avatar avatar-md bg-primary-transparent text-primary rounded me-2 flex-shrink-0">
                                  <i className="ti ti-user-star fs-20" />
                                </span>
                                <div className="overflow-hidden">
                                  <p className="fs-12 text-muted mb-0">
                                    Head of Department
                                  </p>
                                  <p className="mb-0 fw-medium text-dark text-truncate">
                                    Carla Reed
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6 col-xl-4">
                              <div className="d-flex align-items-center">
                                <span className="avatar avatar-md bg-success-transparent text-success rounded me-2 flex-shrink-0">
                                  <i className="ti ti-phone fs-20" />
                                </span>
                                <div className="overflow-hidden">
                                  <p className="fs-12 text-muted mb-0">
                                    Contact Information
                                  </p>
                                  <p className="mb-0 fw-medium text-dark text-truncate">
                                    +1 46548 84408
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6 col-xl-4">
                              <div className="d-flex align-items-center">
                                <span className="avatar avatar-md bg-info-transparent text-info rounded me-2 flex-shrink-0">
                                  <i className="ti ti-map-pin fs-20" />
                                </span>
                                <div className="overflow-hidden">
                                  <p className="fs-12 text-muted mb-0">
                                    Location
                                  </p>
                                  <p className="mb-0 fw-medium text-dark text-truncate">
                                    Block A, Floor 3
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6 col-xl-4">
                              <div className="d-flex align-items-center">
                                <span className="avatar avatar-md bg-warning-transparent text-warning rounded me-2 flex-shrink-0">
                                  <i className="ti ti-calendar fs-20" />
                                </span>
                                <div className="overflow-hidden">
                                  <p className="fs-12 text-muted mb-0">
                                    Established Date
                                  </p>
                                  <p className="mb-0 fw-medium text-dark text-truncate">
                                    12 Jan 2017
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6 col-xl-4">
                              <div className="d-flex align-items-center">
                                <span className="avatar avatar-md bg-purple-transparent text-purple rounded me-2 flex-shrink-0">
                                  <i className="ti ti-users fs-20" />
                                </span>
                                <div className="overflow-hidden">
                                  <p className="fs-12 text-muted mb-0">
                                    Total Employees
                                  </p>
                                  <p className="mb-0 fw-medium text-dark text-truncate">
                                    9
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6 col-xl-4">
                              <div className="d-flex align-items-center">
                                <span className="avatar avatar-md bg-danger-transparent text-danger rounded me-2 flex-shrink-0">
                                  <i className="ti ti-book fs-20" />
                                </span>
                                <div className="overflow-hidden">
                                  <p className="fs-12 text-muted mb-0">
                                    Total Subjects
                                  </p>
                                  <p className="mb-0 fw-medium text-dark text-truncate">
                                    2
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6 col-xl-4">
                              <div className="d-flex align-items-center">
                                <span className="avatar avatar-md bg-secondary-transparent text-secondary rounded me-2 flex-shrink-0">
                                  <i className="ti ti-clipboard-list fs-20" />
                                </span>
                                <div className="overflow-hidden">
                                  <p className="fs-12 text-muted mb-0">
                                    Assigned Classes
                                  </p>
                                  <p className="mb-0 fw-medium text-dark text-truncate">
                                    0
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6 col-xl-4">
                              <div className="d-flex align-items-center">
                                <span className="avatar avatar-md bg-info-transparent text-info rounded me-2 flex-shrink-0">
                                  <i className="ti ti-school fs-20" />
                                </span>
                                <div className="overflow-hidden">
                                  <p className="fs-12 text-muted mb-0">
                                    Active Teachers
                                  </p>
                                  <p className="mb-0 fw-medium text-dark text-truncate">
                                    4
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6 col-xl-4">
                              <div className="d-flex align-items-center">
                                <span className="avatar avatar-md bg-primary-transparent text-primary rounded me-2 flex-shrink-0">
                                  <i className="ti ti-phone-plus fs-20" />
                                </span>
                                <div className="overflow-hidden">
                                  <p className="fs-12 text-muted mb-0">
                                    Office Extension
                                  </p>
                                  <p className="mb-0 fw-medium text-dark text-truncate">
                                    Ext. 109
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6 col-xl-4">
                              <div className="d-flex align-items-center">
                                <span className="avatar avatar-md bg-success-transparent text-success rounded me-2 flex-shrink-0">
                                  <i className="ti ti-mail fs-20" />
                                </span>
                                <div className="overflow-hidden">
                                  <p className="fs-12 text-muted mb-0">
                                    Department Email
                                  </p>
                                  <p className="mb-0 fw-medium text-dark text-truncate">
                                    guidance@preskool.com
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="d-flex align-items-center justify-content-between mb-3">
                            <h6 className="mb-0">Assigned Staff</h6>
                            <a
                              href="#"
                              className="btn btn-sm btn-outline-light bg-white"
                              data-bs-toggle="modal"
                              data-bs-target="#assign_staff"
                            >
                              <i className="ti ti-user-plus me-1" />
                              Assign
                            </a>
                          </div>
                          <div className="row g-3 mb-4">
                            <div className="col-6">
                              <div className="card card-hover mb-0 h-100">
                                <div className="card-body text-center">
                                  <span className="avatar avatar-lg rounded-circle flex-shrink-0 mb-2">
                                    <img
                                      src="assets/img/teachers/teacher-01.jpg"
                                      className="rounded-circle flex-shrink-0"
                                      alt="Teresa Susan"
                                    />
                                  </span>
                                  <h6 className="mb-0 text-truncate">
                                    Teresa Susan
                                  </h6>
                                  <span className="fs-12 text-muted d-block mb-2">
                                    Senior Teacher
                                  </span>
                                  <div className="d-flex align-items-center justify-content-center flex-wrap gap-1 mb-2">
                                    <span className="badge badge-soft-primary">
                                      Physics
                                    </span>
                                    <span className="badge badge-soft-success">
                                      Active
                                    </span>
                                  </div>
                                  <a
                                    href="tel:+14654884498"
                                    className="fs-12 text-muted d-inline-flex align-items-center"
                                  >
                                    <i className="ti ti-phone me-1" />
                                    +1 46548 84498
                                  </a>
                                </div>
                              </div>
                            </div>
                            <div className="col-6">
                              <div className="card card-hover mb-0 h-100">
                                <div className="card-body text-center">
                                  <span className="avatar avatar-lg rounded-circle flex-shrink-0 mb-2">
                                    <img
                                      src="assets/img/teachers/teacher-02.jpg"
                                      className="rounded-circle flex-shrink-0"
                                      alt="John Doe"
                                    />
                                  </span>
                                  <h6 className="mb-0 text-truncate">
                                    John Doe
                                  </h6>
                                  <span className="fs-12 text-muted d-block mb-2">
                                    Coordinator
                                  </span>
                                  <div className="d-flex align-items-center justify-content-center flex-wrap gap-1 mb-2">
                                    <span className="badge badge-soft-primary">
                                      Science
                                    </span>
                                    <span className="badge badge-soft-success">
                                      Active
                                    </span>
                                  </div>
                                  <a
                                    href="tel:+14654811223"
                                    className="fs-12 text-muted d-inline-flex align-items-center"
                                  >
                                    <i className="ti ti-phone me-1" />
                                    +1 46548 11223
                                  </a>
                                </div>
                              </div>
                            </div>
                            <div className="col-6">
                              <div className="card card-hover mb-0 h-100">
                                <div className="card-body text-center">
                                  <span className="avatar avatar-lg rounded-circle flex-shrink-0 mb-2">
                                    <img
                                      src="assets/img/teachers/teacher-03.jpg"
                                      className="rounded-circle flex-shrink-0"
                                      alt="Hellana Robert"
                                    />
                                  </span>
                                  <h6 className="mb-0 text-truncate">
                                    Hellana Robert
                                  </h6>
                                  <span className="fs-12 text-muted d-block mb-2">
                                    Teacher
                                  </span>
                                  <div className="d-flex align-items-center justify-content-center flex-wrap gap-1 mb-2">
                                    <span className="badge badge-soft-primary">
                                      English
                                    </span>
                                    <span className="badge badge-soft-warning">
                                      On Leave
                                    </span>
                                  </div>
                                  <a
                                    href="tel:+14654855667"
                                    className="fs-12 text-muted d-inline-flex align-items-center"
                                  >
                                    <i className="ti ti-phone me-1" />
                                    +1 46548 55667
                                  </a>
                                </div>
                              </div>
                            </div>
                            <div className="col-6">
                              <div className="card card-hover mb-0 h-100">
                                <div className="card-body text-center">
                                  <span className="avatar avatar-lg rounded-circle flex-shrink-0 mb-2">
                                    <img
                                      src="assets/img/teachers/teacher-05.jpg"
                                      className="rounded-circle flex-shrink-0"
                                      alt="Morgan Lee"
                                    />
                                  </span>
                                  <h6 className="mb-0 text-truncate">
                                    Morgan Lee
                                  </h6>
                                  <span className="fs-12 text-muted d-block mb-2">
                                    Assistant
                                  </span>
                                  <div className="d-flex align-items-center justify-content-center flex-wrap gap-1 mb-2">
                                    <span className="badge badge-soft-primary">
                                      Maths
                                    </span>
                                    <span className="badge badge-soft-success">
                                      Active
                                    </span>
                                  </div>
                                  <a
                                    href="tel:+14654899001"
                                    className="fs-12 text-muted d-inline-flex align-items-center"
                                  >
                                    <i className="ti ti-phone me-1" />
                                    +1 46548 99001
                                  </a>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="d-flex align-items-center justify-content-between mb-3">
                            <h6 className="mb-0">Subjects</h6>
                            <a
                              href="#"
                              className="btn btn-sm btn-outline-light bg-white"
                              data-bs-toggle="modal"
                              data-bs-target="#assign_subjects"
                            >
                              <i className="ti ti-book me-1" />
                              Assign
                            </a>
                          </div>
                          <div className="row g-3">
                            <div className="col-sm-6 col-xl-4">
                              <div className="border rounded p-3 d-flex align-items-center">
                                <span className="avatar avatar-md bg-primary-transparent text-primary rounded me-2 flex-shrink-0">
                                  <i className="ti ti-book fs-20" />
                                </span>
                                <div className="overflow-hidden">
                                  <p className="mb-0 fw-medium text-dark text-truncate">
                                    Mathematics
                                  </p>
                                  <span className="fs-12 text-muted">
                                    MTH-101 · 6 Teachers
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="col-sm-6 col-xl-4">
                              <div className="border rounded p-3 d-flex align-items-center">
                                <span className="avatar avatar-md bg-info-transparent text-info rounded me-2 flex-shrink-0">
                                  <i className="ti ti-book fs-20" />
                                </span>
                                <div className="overflow-hidden">
                                  <p className="mb-0 fw-medium text-dark text-truncate">
                                    Physics
                                  </p>
                                  <span className="fs-12 text-muted">
                                    PHY-102 · 4 Teachers
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="col-sm-6 col-xl-4">
                              <div className="border rounded p-3 d-flex align-items-center">
                                <span className="avatar avatar-md bg-success-transparent text-success rounded me-2 flex-shrink-0">
                                  <i className="ti ti-book fs-20" />
                                </span>
                                <div className="overflow-hidden">
                                  <p className="mb-0 fw-medium text-dark text-truncate">
                                    Chemistry
                                  </p>
                                  <span className="fs-12 text-muted">
                                    CHM-103 · 3 Teachers
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="col-sm-6 col-xl-4">
                              <div className="border rounded p-3 d-flex align-items-center">
                                <span className="avatar avatar-md bg-warning-transparent text-warning rounded me-2 flex-shrink-0">
                                  <i className="ti ti-book fs-20" />
                                </span>
                                <div className="overflow-hidden">
                                  <p className="mb-0 fw-medium text-dark text-truncate">
                                    English
                                  </p>
                                  <span className="fs-12 text-muted">
                                    ENG-104 · 5 Teachers
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="col-sm-6 col-xl-4">
                              <div className="border rounded p-3 d-flex align-items-center">
                                <span className="avatar avatar-md bg-danger-transparent text-danger rounded me-2 flex-shrink-0">
                                  <i className="ti ti-book fs-20" />
                                </span>
                                <div className="overflow-hidden">
                                  <p className="mb-0 fw-medium text-dark text-truncate">
                                    Computer Science
                                  </p>
                                  <span className="fs-12 text-muted">
                                    CSC-105 · 4 Teachers
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="dept-pane d-none" id="dept_9">
                      <div className="card mb-0 dept-detail">
                        <div className="p-4 bg-success-transparent rounded-top">
                          <div className="d-xl-flex align-items-start justify-content-between">
                            <div className="d-flex align-items-center mb-3 mb-xl-0">
                              <span className="avatar avatar-xl bg-white text-success rounded me-3 flex-shrink-0">
                                <i className="ti ti-ball-football fs-28" />
                              </span>
                              <div>
                                <div className="d-flex align-items-center flex-wrap gap-2 mb-1">
                                  <h4 className="mb-0">Sports</h4>
                                  <span className="badge bg-success-transparent text-success">
                                    D757239
                                  </span>
                                  <span className="badge badge-soft-success d-inline-flex align-items-center">
                                    <i className="ti ti-circle-filled fs-5 me-1" />
                                    Active
                                  </span>
                                </div>
                                <p className="mb-0 text-muted">
                                  Manages physical education, coaching,
                                  tournaments and sports facilities.
                                </p>
                              </div>
                            </div>
                            <div className="d-flex align-items-center flex-wrap gap-1">
                              <a
                                href="#"
                                className="btn btn-outline-light bg-white btn-icon btn-sm rounded-circle flex-shrink-0"
                                data-bs-toggle="modal"
                                data-bs-target="#department_details"
                                title="View"
                                aria-label="View"
                              >
                                <i className="ti ti-eye" />
                              </a>
                              <a
                                href="#"
                                className="btn btn-outline-light bg-white btn-icon btn-sm rounded-circle flex-shrink-0"
                                data-bs-toggle="modal"
                                data-bs-target="#edit_department"
                                title="Edit"
                                aria-label="Edit"
                              >
                                <i className="ti ti-edit" />
                              </a>
                              <a
                                href="#"
                                className="btn btn-outline-light bg-white btn-icon btn-sm rounded-circle flex-shrink-0"
                                data-bs-toggle="modal"
                                data-bs-target="#assign_staff"
                                title="Assign Staff"
                                aria-label="Assign Staff"
                              >
                                <i className="ti ti-user-plus" />
                              </a>
                              <a
                                href="#"
                                className="btn btn-outline-light bg-white btn-icon btn-sm rounded-circle flex-shrink-0"
                                data-bs-toggle="modal"
                                data-bs-target="#assign_subjects"
                                title="Assign Subjects"
                                aria-label="Assign Subjects"
                              >
                                <i className="ti ti-book" />
                              </a>
                              <a
                                href="#"
                                className="btn btn-outline-light bg-white btn-icon btn-sm rounded-circle flex-shrink-0"
                                data-bs-toggle="modal"
                                data-bs-target="#edit_department"
                                title="Department Settings"
                                aria-label="Department Settings"
                              >
                                <i className="ti ti-settings" />
                              </a>
                              <a
                                href="#"
                                className="btn btn-outline-light bg-white btn-icon btn-sm rounded-circle flex-shrink-0"
                                data-dept-print=""
                                data-bs-toggle="tooltip"
                                title="Print"
                                aria-label="Print"
                              >
                                <i className="ti ti-printer" />
                              </a>
                              <div className="dropdown">
                                <a
                                  href="#"
                                  className="btn btn-outline-light bg-white btn-icon btn-sm rounded-circle flex-shrink-0"
                                  data-bs-toggle="dropdown"
                                  aria-label="More"
                                >
                                  <i className="ti ti-dots-vertical" />
                                </a>
                                <ul className="dropdown-menu dropdown-menu-end p-2">
                                  <li>
                                    <a
                                      className="dropdown-item rounded-1"
                                      href="#"
                                    >
                                      <i className="ti ti-copy me-2" />
                                      Duplicate
                                    </a>
                                  </li>
                                  <li>
                                    <a
                                      className="dropdown-item rounded-1"
                                      href="#"
                                    >
                                      <i className="ti ti-archive me-2" />
                                      Archive
                                    </a>
                                  </li>
                                  <li>
                                    <a
                                      className="dropdown-item rounded-1 text-danger"
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
                        </div>
                        <div className="card-body">
                          <h5 className="mb-3 fs-15">Department Information</h5>
                          <div className="row g-3 mb-4">
                            <div className="col-md-6 col-xl-4">
                              <div className="d-flex align-items-center">
                                <span className="avatar avatar-md bg-primary-transparent text-primary rounded me-2 flex-shrink-0">
                                  <i className="ti ti-user-star fs-20" />
                                </span>
                                <div className="overflow-hidden">
                                  <p className="fs-12 text-muted mb-0">
                                    Head of Department
                                  </p>
                                  <p className="mb-0 fw-medium text-dark text-truncate">
                                    Rita Owen
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6 col-xl-4">
                              <div className="d-flex align-items-center">
                                <span className="avatar avatar-md bg-success-transparent text-success rounded me-2 flex-shrink-0">
                                  <i className="ti ti-phone fs-20" />
                                </span>
                                <div className="overflow-hidden">
                                  <p className="fs-12 text-muted mb-0">
                                    Contact Information
                                  </p>
                                  <p className="mb-0 fw-medium text-dark text-truncate">
                                    +1 46548 84409
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6 col-xl-4">
                              <div className="d-flex align-items-center">
                                <span className="avatar avatar-md bg-info-transparent text-info rounded me-2 flex-shrink-0">
                                  <i className="ti ti-map-pin fs-20" />
                                </span>
                                <div className="overflow-hidden">
                                  <p className="fs-12 text-muted mb-0">
                                    Location
                                  </p>
                                  <p className="mb-0 fw-medium text-dark text-truncate">
                                    Block A, Floor 1
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6 col-xl-4">
                              <div className="d-flex align-items-center">
                                <span className="avatar avatar-md bg-warning-transparent text-warning rounded me-2 flex-shrink-0">
                                  <i className="ti ti-calendar fs-20" />
                                </span>
                                <div className="overflow-hidden">
                                  <p className="fs-12 text-muted mb-0">
                                    Established Date
                                  </p>
                                  <p className="mb-0 fw-medium text-dark text-truncate">
                                    12 Jan 2018
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6 col-xl-4">
                              <div className="d-flex align-items-center">
                                <span className="avatar avatar-md bg-purple-transparent text-purple rounded me-2 flex-shrink-0">
                                  <i className="ti ti-users fs-20" />
                                </span>
                                <div className="overflow-hidden">
                                  <p className="fs-12 text-muted mb-0">
                                    Total Employees
                                  </p>
                                  <p className="mb-0 fw-medium text-dark text-truncate">
                                    16
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6 col-xl-4">
                              <div className="d-flex align-items-center">
                                <span className="avatar avatar-md bg-danger-transparent text-danger rounded me-2 flex-shrink-0">
                                  <i className="ti ti-book fs-20" />
                                </span>
                                <div className="overflow-hidden">
                                  <p className="fs-12 text-muted mb-0">
                                    Total Subjects
                                  </p>
                                  <p className="mb-0 fw-medium text-dark text-truncate">
                                    3
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6 col-xl-4">
                              <div className="d-flex align-items-center">
                                <span className="avatar avatar-md bg-secondary-transparent text-secondary rounded me-2 flex-shrink-0">
                                  <i className="ti ti-clipboard-list fs-20" />
                                </span>
                                <div className="overflow-hidden">
                                  <p className="fs-12 text-muted mb-0">
                                    Assigned Classes
                                  </p>
                                  <p className="mb-0 fw-medium text-dark text-truncate">
                                    0
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6 col-xl-4">
                              <div className="d-flex align-items-center">
                                <span className="avatar avatar-md bg-info-transparent text-info rounded me-2 flex-shrink-0">
                                  <i className="ti ti-school fs-20" />
                                </span>
                                <div className="overflow-hidden">
                                  <p className="fs-12 text-muted mb-0">
                                    Active Teachers
                                  </p>
                                  <p className="mb-0 fw-medium text-dark text-truncate">
                                    6
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6 col-xl-4">
                              <div className="d-flex align-items-center">
                                <span className="avatar avatar-md bg-primary-transparent text-primary rounded me-2 flex-shrink-0">
                                  <i className="ti ti-phone-plus fs-20" />
                                </span>
                                <div className="overflow-hidden">
                                  <p className="fs-12 text-muted mb-0">
                                    Office Extension
                                  </p>
                                  <p className="mb-0 fw-medium text-dark text-truncate">
                                    Ext. 110
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6 col-xl-4">
                              <div className="d-flex align-items-center">
                                <span className="avatar avatar-md bg-success-transparent text-success rounded me-2 flex-shrink-0">
                                  <i className="ti ti-mail fs-20" />
                                </span>
                                <div className="overflow-hidden">
                                  <p className="fs-12 text-muted mb-0">
                                    Department Email
                                  </p>
                                  <p className="mb-0 fw-medium text-dark text-truncate">
                                    sports@preskool.com
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="d-flex align-items-center justify-content-between mb-3">
                            <h6 className="mb-0">Assigned Staff</h6>
                            <a
                              href="#"
                              className="btn btn-sm btn-outline-light bg-white"
                              data-bs-toggle="modal"
                              data-bs-target="#assign_staff"
                            >
                              <i className="ti ti-user-plus me-1" />
                              Assign
                            </a>
                          </div>
                          <div className="row g-3 mb-4">
                            <div className="col-6">
                              <div className="card card-hover mb-0 h-100">
                                <div className="card-body text-center">
                                  <span className="avatar avatar-lg rounded-circle flex-shrink-0 mb-2">
                                    <img
                                      src="assets/img/teachers/teacher-01.jpg"
                                      className="rounded-circle flex-shrink-0"
                                      alt="Teresa Susan"
                                    />
                                  </span>
                                  <h6 className="mb-0 text-truncate">
                                    Teresa Susan
                                  </h6>
                                  <span className="fs-12 text-muted d-block mb-2">
                                    Senior Teacher
                                  </span>
                                  <div className="d-flex align-items-center justify-content-center flex-wrap gap-1 mb-2">
                                    <span className="badge badge-soft-primary">
                                      Physics
                                    </span>
                                    <span className="badge badge-soft-success">
                                      Active
                                    </span>
                                  </div>
                                  <a
                                    href="tel:+14654884498"
                                    className="fs-12 text-muted d-inline-flex align-items-center"
                                  >
                                    <i className="ti ti-phone me-1" />
                                    +1 46548 84498
                                  </a>
                                </div>
                              </div>
                            </div>
                            <div className="col-6">
                              <div className="card card-hover mb-0 h-100">
                                <div className="card-body text-center">
                                  <span className="avatar avatar-lg rounded-circle flex-shrink-0 mb-2">
                                    <img
                                      src="assets/img/teachers/teacher-02.jpg"
                                      className="rounded-circle flex-shrink-0"
                                      alt="John Doe"
                                    />
                                  </span>
                                  <h6 className="mb-0 text-truncate">
                                    John Doe
                                  </h6>
                                  <span className="fs-12 text-muted d-block mb-2">
                                    Coordinator
                                  </span>
                                  <div className="d-flex align-items-center justify-content-center flex-wrap gap-1 mb-2">
                                    <span className="badge badge-soft-primary">
                                      Science
                                    </span>
                                    <span className="badge badge-soft-success">
                                      Active
                                    </span>
                                  </div>
                                  <a
                                    href="tel:+14654811223"
                                    className="fs-12 text-muted d-inline-flex align-items-center"
                                  >
                                    <i className="ti ti-phone me-1" />
                                    +1 46548 11223
                                  </a>
                                </div>
                              </div>
                            </div>
                            <div className="col-6">
                              <div className="card card-hover mb-0 h-100">
                                <div className="card-body text-center">
                                  <span className="avatar avatar-lg rounded-circle flex-shrink-0 mb-2">
                                    <img
                                      src="assets/img/teachers/teacher-03.jpg"
                                      className="rounded-circle flex-shrink-0"
                                      alt="Hellana Robert"
                                    />
                                  </span>
                                  <h6 className="mb-0 text-truncate">
                                    Hellana Robert
                                  </h6>
                                  <span className="fs-12 text-muted d-block mb-2">
                                    Teacher
                                  </span>
                                  <div className="d-flex align-items-center justify-content-center flex-wrap gap-1 mb-2">
                                    <span className="badge badge-soft-primary">
                                      English
                                    </span>
                                    <span className="badge badge-soft-warning">
                                      On Leave
                                    </span>
                                  </div>
                                  <a
                                    href="tel:+14654855667"
                                    className="fs-12 text-muted d-inline-flex align-items-center"
                                  >
                                    <i className="ti ti-phone me-1" />
                                    +1 46548 55667
                                  </a>
                                </div>
                              </div>
                            </div>
                            <div className="col-6">
                              <div className="card card-hover mb-0 h-100">
                                <div className="card-body text-center">
                                  <span className="avatar avatar-lg rounded-circle flex-shrink-0 mb-2">
                                    <img
                                      src="assets/img/teachers/teacher-05.jpg"
                                      className="rounded-circle flex-shrink-0"
                                      alt="Morgan Lee"
                                    />
                                  </span>
                                  <h6 className="mb-0 text-truncate">
                                    Morgan Lee
                                  </h6>
                                  <span className="fs-12 text-muted d-block mb-2">
                                    Assistant
                                  </span>
                                  <div className="d-flex align-items-center justify-content-center flex-wrap gap-1 mb-2">
                                    <span className="badge badge-soft-primary">
                                      Maths
                                    </span>
                                    <span className="badge badge-soft-success">
                                      Active
                                    </span>
                                  </div>
                                  <a
                                    href="tel:+14654899001"
                                    className="fs-12 text-muted d-inline-flex align-items-center"
                                  >
                                    <i className="ti ti-phone me-1" />
                                    +1 46548 99001
                                  </a>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="d-flex align-items-center justify-content-between mb-3">
                            <h6 className="mb-0">Subjects</h6>
                            <a
                              href="#"
                              className="btn btn-sm btn-outline-light bg-white"
                              data-bs-toggle="modal"
                              data-bs-target="#assign_subjects"
                            >
                              <i className="ti ti-book me-1" />
                              Assign
                            </a>
                          </div>
                          <div className="row g-3">
                            <div className="col-sm-6 col-xl-4">
                              <div className="border rounded p-3 d-flex align-items-center">
                                <span className="avatar avatar-md bg-primary-transparent text-primary rounded me-2 flex-shrink-0">
                                  <i className="ti ti-book fs-20" />
                                </span>
                                <div className="overflow-hidden">
                                  <p className="mb-0 fw-medium text-dark text-truncate">
                                    Mathematics
                                  </p>
                                  <span className="fs-12 text-muted">
                                    MTH-101 · 6 Teachers
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="col-sm-6 col-xl-4">
                              <div className="border rounded p-3 d-flex align-items-center">
                                <span className="avatar avatar-md bg-info-transparent text-info rounded me-2 flex-shrink-0">
                                  <i className="ti ti-book fs-20" />
                                </span>
                                <div className="overflow-hidden">
                                  <p className="mb-0 fw-medium text-dark text-truncate">
                                    Physics
                                  </p>
                                  <span className="fs-12 text-muted">
                                    PHY-102 · 4 Teachers
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="col-sm-6 col-xl-4">
                              <div className="border rounded p-3 d-flex align-items-center">
                                <span className="avatar avatar-md bg-success-transparent text-success rounded me-2 flex-shrink-0">
                                  <i className="ti ti-book fs-20" />
                                </span>
                                <div className="overflow-hidden">
                                  <p className="mb-0 fw-medium text-dark text-truncate">
                                    Chemistry
                                  </p>
                                  <span className="fs-12 text-muted">
                                    CHM-103 · 3 Teachers
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="col-sm-6 col-xl-4">
                              <div className="border rounded p-3 d-flex align-items-center">
                                <span className="avatar avatar-md bg-warning-transparent text-warning rounded me-2 flex-shrink-0">
                                  <i className="ti ti-book fs-20" />
                                </span>
                                <div className="overflow-hidden">
                                  <p className="mb-0 fw-medium text-dark text-truncate">
                                    English
                                  </p>
                                  <span className="fs-12 text-muted">
                                    ENG-104 · 5 Teachers
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="col-sm-6 col-xl-4">
                              <div className="border rounded p-3 d-flex align-items-center">
                                <span className="avatar avatar-md bg-danger-transparent text-danger rounded me-2 flex-shrink-0">
                                  <i className="ti ti-book fs-20" />
                                </span>
                                <div className="overflow-hidden">
                                  <p className="mb-0 fw-medium text-dark text-truncate">
                                    Computer Science
                                  </p>
                                  <span className="fs-12 text-muted">
                                    CSC-105 · 4 Teachers
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* /Detail */}
                </div>
              </div>
            </div>
          </div>
          {/* /dept_workspace */}
        </div>
      </div>
      {/* /Page Wrapper */}
      <DepartmentsModal/>
    </>
  );
};

export default Departments;
