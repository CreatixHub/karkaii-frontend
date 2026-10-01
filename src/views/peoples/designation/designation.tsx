import { Link } from "react-router-dom";
import { all_routes } from "../../../routes/all_routes";
import DesignationModal from "./designationModal";

const Designation = () => {
  return (
    <>
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content">
          {/* Page Header */}
          <div className="d-md-flex d-block align-items-center justify-content-between flex-wrap gap-2 mb-3">
            <div className="my-auto mb-2">
              <h3 className="page-title mb-1">Designation</h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={all_routes.adminDashboard}>Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <a href="#">HRM</a>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Designation
                  </li>
                </ol>
              </nav>
            </div>
            <div className="d-flex my-xl-auto right-content align-items-center flex-wrap">
              <div className="pe-1 mb-2">
                <a
                  href="#"
                  className="btn btn-outline-light bg-white btn-icon me-1"
                  data-bs-toggle="tooltip"
                  data-bs-placement="top"
                  aria-label="Refresh"
                  data-bs-original-title="Refresh"
                >
                  <i className="ti ti-refresh" />
                </a>
              </div>
              <div className="pe-1 mb-2">
                <button
                  type="button"
                  className="btn btn-outline-light bg-white btn-icon me-1"
                  data-bs-toggle="tooltip"
                  data-bs-placement="top"
                  aria-label="Print"
                  data-bs-original-title="Print"
                >
                  <i className="ti ti-printer" />
                </button>
              </div>
              <div className="dropdown me-2 mb-2">
                <a
                  href="#"
                  className="dropdown-toggle btn btn-light fw-medium d-inline-flex align-items-center"
                  data-bs-toggle="dropdown"
                >
                  <i className="ti ti-file-export me-2" />
                  Export
                </a>
                <ul className="dropdown-menu  dropdown-menu-end p-3">
                  <li>
                    <a
                      href="#"
                      className="dropdown-item rounded-1"
                    >
                      <i className="ti ti-file-type-pdf me-1" />
                      Export as PDF
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="dropdown-item rounded-1"
                    >
                      <i className="ti ti-file-type-xls me-1" />
                      Export as Excel{" "}
                    </a>
                  </li>
                </ul>
              </div>
              <div className="mb-2">
                <a
                  href="#"
                  className="btn btn-primary d-flex align-items-center"
                  data-bs-toggle="modal"
                  data-bs-target="#add_designation"
                >
                  <i className="ti ti-square-rounded-plus me-2" />
                  Add Designation
                </a>
              </div>
            </div>
          </div>
          {/* /Page Header */}
          {/* Students List */}
          <div className="card">
            <div className="card-header">
              <h4 className="mb-0">Designation</h4>
            </div>
            <div className="card-body p-0 py-3">
              {/* Student List */}
              <div className="data-table">
                <table className="table">
                  <caption className="visually-hidden">
                    Designation list with ID, name and status
                  </caption>
                  <thead>
                    <tr>
                      <th className="dt-pin">
                        <input
                          type="checkbox"
                          className="dt-check"
                          id="select-all"
                          aria-label="Select all designations"
                        />
                      </th>
                      <th>ID</th>
                      <th>Designation</th>
                      <th>Status</th>
                      <th className="text-end">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="dt-row">
                      <td className="dt-pin">
                        <input
                          type="checkbox"
                          className="dt-check"
                          aria-label="Select Technical Head"
                        />
                      </td>
                      <td>
                        <a href="#" className="link-primary">
                          DS748294
                        </a>
                      </td>
                      <td>
                        <span className="dt-name">Technical Head</span>
                      </td>
                      <td>
                        <span className="dt-pill is-active">
                          <span className="dt-pill-dot" />
                          Active
                        </span>
                      </td>
                      <td>
                        <div className="dt-actions justify-content-end">
                          <a
                            href="#"
                            className="dt-ib"
                            data-bs-toggle="modal"
                            data-bs-target="#edit_designation"
                            title="Edit"
                            aria-label="Edit"
                          >
                            <i className="ti ti-edit" />
                          </a>
                          <a
                            href="#"
                            className="dt-ib"
                            data-bs-toggle="modal"
                            data-bs-target="#delete-modal"
                            title="Delete"
                            aria-label="Delete"
                          >
                            <i className="ti ti-trash" />
                          </a>
                        </div>
                      </td>
                    </tr>
                    <tr className="dt-row">
                      <td className="dt-pin">
                        <input
                          type="checkbox"
                          className="dt-check"
                          aria-label="Select Accountant"
                        />
                      </td>
                      <td>
                        <a href="#" className="link-primary">
                          DS748293
                        </a>
                      </td>
                      <td>
                        <span className="dt-name">Accountant</span>
                      </td>
                      <td>
                        <span className="dt-pill is-active">
                          <span className="dt-pill-dot" />
                          Active
                        </span>
                      </td>
                      <td>
                        <div className="dt-actions justify-content-end">
                          <a
                            href="#"
                            className="dt-ib"
                            data-bs-toggle="modal"
                            data-bs-target="#edit_designation"
                            title="Edit"
                            aria-label="Edit"
                          >
                            <i className="ti ti-edit" />
                          </a>
                          <a
                            href="#"
                            className="dt-ib"
                            data-bs-toggle="modal"
                            data-bs-target="#delete-modal"
                            title="Delete"
                            aria-label="Delete"
                          >
                            <i className="ti ti-trash" />
                          </a>
                        </div>
                      </td>
                    </tr>
                    <tr className="dt-row">
                      <td className="dt-pin">
                        <input
                          type="checkbox"
                          className="dt-check"
                          aria-label="Select Teacher"
                        />
                      </td>
                      <td>
                        <a href="#" className="link-primary">
                          DS748292
                        </a>
                      </td>
                      <td>
                        <span className="dt-name">Teacher</span>
                      </td>
                      <td>
                        <span className="dt-pill is-active">
                          <span className="dt-pill-dot" />
                          Active
                        </span>
                      </td>
                      <td>
                        <div className="dt-actions justify-content-end">
                          <a
                            href="#"
                            className="dt-ib"
                            data-bs-toggle="modal"
                            data-bs-target="#edit_designation"
                            title="Edit"
                            aria-label="Edit"
                          >
                            <i className="ti ti-edit" />
                          </a>
                          <a
                            href="#"
                            className="dt-ib"
                            data-bs-toggle="modal"
                            data-bs-target="#delete-modal"
                            title="Delete"
                            aria-label="Delete"
                          >
                            <i className="ti ti-trash" />
                          </a>
                        </div>
                      </td>
                    </tr>
                    <tr className="dt-row">
                      <td className="dt-pin">
                        <input
                          type="checkbox"
                          className="dt-check"
                          aria-label="Select Librarian"
                        />
                      </td>
                      <td>
                        <a href="#" className="link-primary">
                          DS748291
                        </a>
                      </td>
                      <td>
                        <span className="dt-name">Librarian</span>
                      </td>
                      <td>
                        <span className="dt-pill is-active">
                          <span className="dt-pill-dot" />
                          Active
                        </span>
                      </td>
                      <td>
                        <div className="dt-actions justify-content-end">
                          <a
                            href="#"
                            className="dt-ib"
                            data-bs-toggle="modal"
                            data-bs-target="#edit_designation"
                            title="Edit"
                            aria-label="Edit"
                          >
                            <i className="ti ti-edit" />
                          </a>
                          <a
                            href="#"
                            className="dt-ib"
                            data-bs-toggle="modal"
                            data-bs-target="#delete-modal"
                            title="Delete"
                            aria-label="Delete"
                          >
                            <i className="ti ti-trash" />
                          </a>
                        </div>
                      </td>
                    </tr>
                    <tr className="dt-row">
                      <td className="dt-pin">
                        <input
                          type="checkbox"
                          className="dt-check"
                          aria-label="Select Doctor"
                        />
                      </td>
                      <td>
                        <a href="#" className="link-primary">
                          DS748290
                        </a>
                      </td>
                      <td>
                        <span className="dt-name">Doctor</span>
                      </td>
                      <td>
                        <span className="dt-pill is-inactive">
                          <span className="dt-pill-dot" />
                          Inactive
                        </span>
                      </td>
                      <td>
                        <div className="dt-actions justify-content-end">
                          <a
                            href="#"
                            className="dt-ib"
                            data-bs-toggle="modal"
                            data-bs-target="#edit_designation"
                            title="Edit"
                            aria-label="Edit"
                          >
                            <i className="ti ti-edit" />
                          </a>
                          <a
                            href="#"
                            className="dt-ib"
                            data-bs-toggle="modal"
                            data-bs-target="#delete-modal"
                            title="Delete"
                            aria-label="Delete"
                          >
                            <i className="ti ti-trash" />
                          </a>
                        </div>
                      </td>
                    </tr>
                    <tr className="dt-row">
                      <td className="dt-pin">
                        <input
                          type="checkbox"
                          className="dt-check"
                          aria-label="Select Driver"
                        />
                      </td>
                      <td>
                        <a href="#" className="link-primary">
                          DS748289
                        </a>
                      </td>
                      <td>
                        <span className="dt-name">Driver</span>
                      </td>
                      <td>
                        <span className="dt-pill is-active">
                          <span className="dt-pill-dot" />
                          Active
                        </span>
                      </td>
                      <td>
                        <div className="dt-actions justify-content-end">
                          <a
                            href="#"
                            className="dt-ib"
                            data-bs-toggle="modal"
                            data-bs-target="#edit_designation"
                            title="Edit"
                            aria-label="Edit"
                          >
                            <i className="ti ti-edit" />
                          </a>
                          <a
                            href="#"
                            className="dt-ib"
                            data-bs-toggle="modal"
                            data-bs-target="#delete-modal"
                            title="Delete"
                            aria-label="Delete"
                          >
                            <i className="ti ti-trash" />
                          </a>
                        </div>
                      </td>
                    </tr>
                    <tr className="dt-row">
                      <td className="dt-pin">
                        <input
                          type="checkbox"
                          className="dt-check"
                          aria-label="Select Warden"
                        />
                      </td>
                      <td>
                        <a href="#" className="link-primary">
                          DS748288
                        </a>
                      </td>
                      <td>
                        <span className="dt-name">Warden</span>
                      </td>
                      <td>
                        <span className="dt-pill is-active">
                          <span className="dt-pill-dot" />
                          Active
                        </span>
                      </td>
                      <td>
                        <div className="dt-actions justify-content-end">
                          <a
                            href="#"
                            className="dt-ib"
                            data-bs-toggle="modal"
                            data-bs-target="#edit_designation"
                            title="Edit"
                            aria-label="Edit"
                          >
                            <i className="ti ti-edit" />
                          </a>
                          <a
                            href="#"
                            className="dt-ib"
                            data-bs-toggle="modal"
                            data-bs-target="#delete-modal"
                            title="Delete"
                            aria-label="Delete"
                          >
                            <i className="ti ti-trash" />
                          </a>
                        </div>
                      </td>
                    </tr>
                    <tr className="dt-row">
                      <td className="dt-pin">
                        <input
                          type="checkbox"
                          className="dt-check"
                          aria-label="Select Receptionist"
                        />
                      </td>
                      <td>
                        <a href="#" className="link-primary">
                          DS748287
                        </a>
                      </td>
                      <td>
                        <span className="dt-name">Receptionist</span>
                      </td>
                      <td>
                        <span className="dt-pill is-active">
                          <span className="dt-pill-dot" />
                          Active
                        </span>
                      </td>
                      <td>
                        <div className="dt-actions justify-content-end">
                          <a
                            href="#"
                            className="dt-ib"
                            data-bs-toggle="modal"
                            data-bs-target="#edit_designation"
                            title="Edit"
                            aria-label="Edit"
                          >
                            <i className="ti ti-edit" />
                          </a>
                          <a
                            href="#"
                            className="dt-ib"
                            data-bs-toggle="modal"
                            data-bs-target="#delete-modal"
                            title="Delete"
                            aria-label="Delete"
                          >
                            <i className="ti ti-trash" />
                          </a>
                        </div>
                      </td>
                    </tr>
                    <tr className="dt-row">
                      <td className="dt-pin">
                        <input
                          type="checkbox"
                          className="dt-check"
                          aria-label="Select Therapist"
                        />
                      </td>
                      <td>
                        <a href="#" className="link-primary">
                          DS748286
                        </a>
                      </td>
                      <td>
                        <span className="dt-name">Therapist</span>
                      </td>
                      <td>
                        <span className="dt-pill is-inactive">
                          <span className="dt-pill-dot" />
                          Inactive
                        </span>
                      </td>
                      <td>
                        <div className="dt-actions justify-content-end">
                          <a
                            href="#"
                            className="dt-ib"
                            data-bs-toggle="modal"
                            data-bs-target="#edit_designation"
                            title="Edit"
                            aria-label="Edit"
                          >
                            <i className="ti ti-edit" />
                          </a>
                          <a
                            href="#"
                            className="dt-ib"
                            data-bs-toggle="modal"
                            data-bs-target="#delete-modal"
                            title="Delete"
                            aria-label="Delete"
                          >
                            <i className="ti ti-trash" />
                          </a>
                        </div>
                      </td>
                    </tr>
                    <tr className="dt-row">
                      <td className="dt-pin">
                        <input
                          type="checkbox"
                          className="dt-check"
                          aria-label="Select Coach"
                        />
                      </td>
                      <td>
                        <a href="#" className="link-primary">
                          DS748285
                        </a>
                      </td>
                      <td>
                        <span className="dt-name">Coach</span>
                      </td>
                      <td>
                        <span className="dt-pill is-active">
                          <span className="dt-pill-dot" />
                          Active
                        </span>
                      </td>
                      <td>
                        <div className="dt-actions justify-content-end">
                          <a
                            href="#"
                            className="dt-ib"
                            data-bs-toggle="modal"
                            data-bs-target="#edit_designation"
                            title="Edit"
                            aria-label="Edit"
                          >
                            <i className="ti ti-edit" />
                          </a>
                          <a
                            href="#"
                            className="dt-ib"
                            data-bs-toggle="modal"
                            data-bs-target="#delete-modal"
                            title="Delete"
                            aria-label="Delete"
                          >
                            <i className="ti ti-trash" />
                          </a>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              {/* /Student List */}
            </div>
          </div>
          {/* /Students List */}
        </div>
      </div>
      {/* /Page Wrapper */}
      <DesignationModal />
    </>
  );
};

export default Designation;
