import { Link } from "react-router-dom";
import { all_routes } from "../../../routes/all_routes";
const Language = () => {
  return (
   <>
  {/* Page Wrapper */}
  <div className="page-wrapper settings-profile">
    <div className="content content-two bg-white">
      <div className="d-md-flex d-block align-items-center justify-content-between border-bottom pb-3">
        <div className="my-auto mb-2">
          <h3 className="page-title mb-1">Website Settings</h3>
          <nav>
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item">
                <Link to={all_routes.adminDashboard}>Dashboard</Link>
              </li>
              <li className="breadcrumb-item">
                <a href="javascript:void(0);">Settings</a>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Website Settings
              </li>
            </ol>
          </nav>
        </div>
        <div className="d-flex my-xl-auto right-content align-items-center flex-wrap">
          <div className="pe-1 mb-2">
            <a
              href="#"
              className="btn btn-outline-light bg-white btn-icon"
              data-bs-toggle="tooltip"
              data-bs-placement="top"
              aria-label="Refresh"
              data-bs-original-title="Refresh"
            >
              <i className="ti ti-refresh" />
            </a>
          </div>
        </div>
      </div>
      <div className="settings-toptabs mt-3">
        <a href="company-settings.html" className="settings-toptabs-link">
          <span className="settings-toptabs-ic">
            <i className="ti ti-building" />
          </span>
          Company Settings
        </a>
        <a href="localization.html" className="settings-toptabs-link">
          <span className="settings-toptabs-ic">
            <i className="ti ti-language" />
          </span>
          Localization
        </a>
        <a href="prefixes.html" className="settings-toptabs-link">
          <span className="settings-toptabs-ic">
            <i className="ti ti-tag" />
          </span>
          Prefixes
        </a>
        <a href="preferences.html" className="settings-toptabs-link">
          <span className="settings-toptabs-ic">
            <i className="ti ti-adjustments" />
          </span>
          Preferences
        </a>
        <a href="social-authentication.html" className="settings-toptabs-link">
          <span className="settings-toptabs-ic">
            <i className="ti ti-share" />
          </span>
          Social Authentication
        </a>
        <a href="language.html" className="settings-toptabs-link active">
          <span className="settings-toptabs-ic">
            <i className="ti ti-world" />
          </span>
          Language
        </a>
      </div>
      <div className="row">
        <div className="col-12">
          <div className="d-flex align-items-center justify-content-between flex-wrap border-bottom pt-3 mb-3">
            <div className="mb-3">
              <h4 className="mb-1 fs-16 fw-medium">Language</h4>
              <p>Personalize your Language settings of your website</p>
            </div>
            <div className="mb-3">
              <a
                href="#"
                className="btn btn-light me-2"
                data-bs-toggle="modal"
                data-bs-target="#import_file"
              >
                <i className="ti ti-download me-2" />
                Import
              </a>
              <a
                href="#"
                className="btn btn-primary"
                data-bs-toggle="modal"
                data-bs-target="#add_language"
              >
                <i className="ti ti-square-rounded-plus-filled me-2" />
                Add Language
              </a>
            </div>
          </div>
          {/* Students List */}
          <div className="card">
            <div className="card-header d-flex align-items-center justify-content-between flex-wrap pb-0">
              <h4 className="mb-3">Language</h4>
              <div className="d-flex align-items-center flex-wrap">
                <div className="input-icon-start mb-3 me-2 position-relative">
                  <span className="icon-addon">
                    <i className="ti ti-calendar" />
                  </span>
                  <input
                    type="text"
                    className="form-control date-range bookingrange"
                    placeholder="Select"
                    defaultValue="Academic Year : 2024 / 2025"
                    aria-label="Select"
                  />
                </div>
                <div className="dropdown mb-3 me-2">
                  <a
                    href="javascript:void(0);"
                    className="btn btn-outline-light bg-white dropdown-toggle"
                    data-bs-toggle="dropdown"
                    data-bs-auto-close="outside"
                  >
                    <i className="ti ti-filter me-2" />
                    Filter
                  </a>
                  <div className="dropdown-menu drop-width">
                    <form action="language.html">
                      <div className="d-flex align-items-center border-bottom p-3">
                        <h4>Filter</h4>
                      </div>
                      <div className="p-3 pb-0 border-bottom">
                        <div className="row">
                          <div className="col-md-12">
                            <div className="mb-3">
                              <label className="form-label" htmlFor="language">
                                Language
                              </label>
                              <select className="select" id="language">
                                <option>Select</option>
                                <option>English</option>
                                <option>Arabic</option>
                                <option>Chinese</option>
                              </select>
                            </div>
                          </div>
                          <div className="col-md-12">
                            <div className="mb-3">
                              <label className="form-label" htmlFor="code">
                                Code
                              </label>
                              <select className="select" id="code">
                                <option>Select</option>
                                <option>en</option>
                                <option>ar</option>
                                <option>zh</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="p-3 d-flex align-items-center justify-content-end">
                        <a href="#" className="btn btn-light me-2">
                          Reset
                        </a>
                        <button type="submit" className="btn btn-primary">
                          Apply
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
                <div className="dropdown mb-3">
                  <a
                    href="javascript:void(0);"
                    className="btn btn-outline-light bg-white dropdown-toggle"
                    data-bs-toggle="dropdown"
                  >
                    <i className="ti ti-sort-ascending-2 me-2" />
                    Sort by A-Z
                  </a>
                  <ul className="dropdown-menu p-3">
                    <li>
                      <a
                        href="javascript:void(0);"
                        className="dropdown-item rounded-1"
                      >
                        Ascending
                      </a>
                    </li>
                    <li>
                      <a
                        href="javascript:void(0);"
                        className="dropdown-item rounded-1"
                      >
                        Descending
                      </a>
                    </li>
                    <li>
                      <a
                        href="javascript:void(0);"
                        className="dropdown-item rounded-1"
                      >
                        Recently Viewed
                      </a>
                    </li>
                    <li>
                      <a
                        href="javascript:void(0);"
                        className="dropdown-item rounded-1"
                      >
                        Recently Added
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="card-body p-0 py-3">
              {/* Student List */}
              <div className="custom-datatable-filter table-responsive">
                <table className="table datatable">
                  <thead className="thead-light">
                    <tr>
                      <th className="no-sort">
                        <div className="form-check form-check-md">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="select-all"
                            aria-label="Select all rows"
                          />
                        </div>
                      </th>
                      <th>Language</th>
                      <th>Code</th>
                      <th>RTL</th>
                      <th>Status </th>
                      <th className="no-sort">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <div className="form-check form-check-md">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            aria-label="Select row"
                          />
                        </div>
                      </td>
                      <td>English</td>
                      <td>en</td>
                      <td>
                        <div className="form-check form-switch">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            role="switch"
                            id="switch-sm"
                            aria-label="Select row"
                          />
                        </div>
                      </td>
                      <td>
                        <span className="badge badge-soft-success d-inline-flex align-items-center">
                          <i className="ti ti-circle-filled fs-5 me-1" />
                          Active
                        </span>
                      </td>
                      <td>
                        <div className="dropdown">
                          <a
                            href="#"
                            className="btn btn-white btn-icon btn-sm d-flex align-items-center justify-content-center rounded-circle flex-shrink-0 p-0"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                          >
                            <i className="ti ti-dots-vertical fs-14" />
                          </a>
                          <ul className="dropdown-menu dropdown-menu-right p-3">
                            <li>
                              <a className="dropdown-item rounded-1" href="#">
                                <i className="ti ti-language me-2" />
                                Make as Default
                              </a>
                            </li>
                            <li>
                              <a
                                className="dropdown-item rounded-1"
                                href="#"
                                data-bs-toggle="modal"
                                data-bs-target="#edit_language"
                              >
                                <i className="ti ti-edit-circle me-2" />
                                Edit
                              </a>
                            </li>
                            <li>
                              <a
                                className="dropdown-item rounded-1"
                                href="#"
                                data-bs-toggle="modal"
                                data-bs-target="#language_setup"
                              >
                                <i className="ti ti-settings me-2" />
                                Set up
                              </a>
                            </li>
                            <li>
                              <a
                                className="dropdown-item rounded-1"
                                href="#"
                                data-bs-toggle="modal"
                                data-bs-target="#delete-modal"
                              >
                                <i className="ti ti-trash-x me-2" />
                                Delete
                              </a>
                            </li>
                          </ul>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <div className="form-check form-check-md">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            aria-label="Select row"
                          />
                        </div>
                      </td>
                      <td>Arabic</td>
                      <td>ar</td>
                      <td>
                        <div className="form-check form-switch">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            role="switch"
                            id="switch-sm2"
                            aria-label="Select row"
                          />
                        </div>
                      </td>
                      <td>
                        <span className="badge badge-soft-success d-inline-flex align-items-center">
                          <i className="ti ti-circle-filled fs-5 me-1" />
                          Active
                        </span>
                      </td>
                      <td>
                        <div className="dropdown">
                          <a
                            href="#"
                            className="btn btn-white btn-icon btn-sm d-flex align-items-center justify-content-center rounded-circle flex-shrink-0 p-0"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                          >
                            <i className="ti ti-dots-vertical fs-14" />
                          </a>
                          <ul className="dropdown-menu dropdown-menu-right p-3">
                            <li>
                              <a className="dropdown-item rounded-1" href="#">
                                <i className="ti ti-language me-2" />
                                Make as Default
                              </a>
                            </li>
                            <li>
                              <a
                                className="dropdown-item rounded-1"
                                href="#"
                                data-bs-toggle="modal"
                                data-bs-target="#edit_language"
                              >
                                <i className="ti ti-edit-circle me-2" />
                                Edit
                              </a>
                            </li>
                            <li>
                              <a
                                className="dropdown-item rounded-1"
                                href="#"
                                data-bs-toggle="modal"
                                data-bs-target="#language_setup"
                              >
                                <i className="ti ti-settings me-2" />
                                Set up
                              </a>
                            </li>
                            <li>
                              <a
                                className="dropdown-item rounded-1"
                                href="#"
                                data-bs-toggle="modal"
                                data-bs-target="#delete-modal"
                              >
                                <i className="ti ti-trash-x me-2" />
                                Delete
                              </a>
                            </li>
                          </ul>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <div className="form-check form-check-md">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            aria-label="Select row"
                          />
                        </div>
                      </td>
                      <td>Chinese</td>
                      <td>zh</td>
                      <td>
                        <div className="form-check form-switch">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            role="switch"
                            id="switch-sm3"
                            aria-label="Select row"
                          />
                        </div>
                      </td>
                      <td>
                        <span className="badge badge-soft-success d-inline-flex align-items-center">
                          <i className="ti ti-circle-filled fs-5 me-1" />
                          Active
                        </span>
                      </td>
                      <td>
                        <div className="dropdown">
                          <a
                            href="#"
                            className="btn btn-white btn-icon btn-sm d-flex align-items-center justify-content-center rounded-circle flex-shrink-0 p-0"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                          >
                            <i className="ti ti-dots-vertical fs-14" />
                          </a>
                          <ul className="dropdown-menu dropdown-menu-right p-3">
                            <li>
                              <a className="dropdown-item rounded-1" href="#">
                                <i className="ti ti-language me-2" />
                                Make as Default
                              </a>
                            </li>
                            <li>
                              <a
                                className="dropdown-item rounded-1"
                                href="#"
                                data-bs-toggle="modal"
                                data-bs-target="#edit_language"
                              >
                                <i className="ti ti-edit-circle me-2" />
                                Edit
                              </a>
                            </li>
                            <li>
                              <a
                                className="dropdown-item rounded-1"
                                href="#"
                                data-bs-toggle="modal"
                                data-bs-target="#language_setup"
                              >
                                <i className="ti ti-settings me-2" />
                                Set up
                              </a>
                            </li>
                            <li>
                              <a
                                className="dropdown-item rounded-1"
                                href="#"
                                data-bs-toggle="modal"
                                data-bs-target="#delete-modal"
                              >
                                <i className="ti ti-trash-x me-2" />
                                Delete
                              </a>
                            </li>
                          </ul>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <div className="form-check form-check-md">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            aria-label="Select row"
                          />
                        </div>
                      </td>
                      <td>Hindi</td>
                      <td>hi</td>
                      <td>
                        <div className="form-check form-switch">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            role="switch"
                            id="switch-sm4"
                            aria-label="Select row"
                          />
                        </div>
                      </td>
                      <td>
                        <span className="badge badge-soft-success d-inline-flex align-items-center">
                          <i className="ti ti-circle-filled fs-5 me-1" />
                          Active
                        </span>
                      </td>
                      <td>
                        <div className="dropdown">
                          <a
                            href="#"
                            className="btn btn-white btn-icon btn-sm d-flex align-items-center justify-content-center rounded-circle flex-shrink-0 p-0"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                          >
                            <i className="ti ti-dots-vertical fs-14" />
                          </a>
                          <ul className="dropdown-menu dropdown-menu-right p-3">
                            <li>
                              <a className="dropdown-item rounded-1" href="#">
                                <i className="ti ti-language me-2" />
                                Make as Default
                              </a>
                            </li>
                            <li>
                              <a
                                className="dropdown-item rounded-1"
                                href="#"
                                data-bs-toggle="modal"
                                data-bs-target="#edit_language"
                              >
                                <i className="ti ti-edit-circle me-2" />
                                Edit
                              </a>
                            </li>
                            <li>
                              <a
                                className="dropdown-item rounded-1"
                                href="#"
                                data-bs-toggle="modal"
                                data-bs-target="#language_setup"
                              >
                                <i className="ti ti-settings me-2" />
                                Set up
                              </a>
                            </li>
                            <li>
                              <a
                                className="dropdown-item rounded-1"
                                href="#"
                                data-bs-toggle="modal"
                                data-bs-target="#delete-modal"
                              >
                                <i className="ti ti-trash-x me-2" />
                                Delete
                              </a>
                            </li>
                          </ul>
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
    </div>
  </div>
  {/* /Page Wrapper */}
</>

  )
}

export default Language