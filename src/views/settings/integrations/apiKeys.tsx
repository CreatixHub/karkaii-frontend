import { Link } from "react-router-dom";
import { all_routes } from "../../../routes/all_routes";
const ApiKeys = () => {
  return (
  <>
  {/* Page Wrapper */}
  <div className="page-wrapper">
    <div className="content content-two">
      {/* Page Header */}
      <div className="d-md-flex d-block align-items-center justify-content-between flex-wrap gap-2 mb-3">
        <div className="my-auto mb-2">
          <h3 className="page-title mb-1">API Keys</h3>
          <nav>
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item">
                <Link to={all_routes.adminDashboard}>Dashboard</Link>
              </li>
              <li className="breadcrumb-item">
                <a href="javascript:void(0);">Administration</a>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                API Keys
              </li>
            </ol>
          </nav>
        </div>
        <div className="d-flex my-xl-auto right-content align-items-center flex-wrap">
          <button
            type="button"
            className="btn btn-outline-light bg-white me-2 mb-2 d-inline-flex align-items-center"
          >
            <i className="ti ti-refresh me-1" />
            Refresh
          </button>
        </div>
      </div>
      {/* /Page Header */}
      <div className="row">
        <div className="col-xl-3 col-lg-4 d-flex">
          <div className="card settings-index-card flex-fill mb-3 mb-lg-0">
            <div className="card-header">
              <h4 className="mb-0 fs-16 fw-medium">Settings</h4>
            </div>
            <div className="settings-index-nav">
              <a href="school-profile.html" className="settings-index-link">
                <span className="settings-index-ic">
                  <i className="ti ti-building" />
                </span>
                <span className="settings-index-label">School Profile</span>
                <i className="ti ti-chevron-right settings-index-arrow" />
              </a>
              <a href="academic-year.html" className="settings-index-link">
                <span className="settings-index-ic">
                  <i className="ti ti-calendar" />
                </span>
                <span className="settings-index-label">Academic Year</span>
                <i className="ti ti-chevron-right settings-index-arrow" />
              </a>
              <a href="class-settings.html" className="settings-index-link">
                <span className="settings-index-ic">
                  <i className="ti ti-school" />
                </span>
                <span className="settings-index-label">Class Settings</span>
                <i className="ti ti-chevron-right settings-index-arrow" />
              </a>
              <a href="subject-settings.html" className="settings-index-link">
                <span className="settings-index-ic">
                  <i className="ti ti-book" />
                </span>
                <span className="settings-index-label">Subject Settings</span>
                <i className="ti ti-chevron-right settings-index-arrow" />
              </a>
              <a href="grading-rules.html" className="settings-index-link">
                <span className="settings-index-ic">
                  <i className="ti ti-award" />
                </span>
                <span className="settings-index-label">Grading Rules</span>
                <i className="ti ti-chevron-right settings-index-arrow" />
              </a>
              <a href="exam-settings.html" className="settings-index-link">
                <span className="settings-index-ic">
                  <i className="ti ti-file-certificate" />
                </span>
                <span className="settings-index-label">Exam Settings</span>
                <i className="ti ti-chevron-right settings-index-arrow" />
              </a>
              <a href="payment-settings.html" className="settings-index-link">
                <span className="settings-index-ic">
                  <i className="ti ti-credit-card" />
                </span>
                <span className="settings-index-label">Payment Settings</span>
                <i className="ti ti-chevron-right settings-index-arrow" />
              </a>
              <a href="theme-settings.html" className="settings-index-link">
                <span className="settings-index-ic">
                  <i className="ti ti-palette" />
                </span>
                <span className="settings-index-label">Theme Settings</span>
                <i className="ti ti-chevron-right settings-index-arrow" />
              </a>
              <a href="backup-restore.html" className="settings-index-link">
                <span className="settings-index-ic">
                  <i className="ti ti-database" />
                </span>
                <span className="settings-index-label">
                  Backup &amp; Restore
                </span>
                <i className="ti ti-chevron-right settings-index-arrow" />
              </a>
            </div>
          </div>
        </div>
        <div className="col-xl-9 col-lg-8">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">API Keys</h5>
            </div>
            <div className="card-body">
              <form action="api-keys.html">
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label" htmlFor="institution">
                        Institution
                      </label>
                      <select className="select" id="institution">
                        <option>Global International</option>
                        <option>Sunrise Public School</option>
                        <option>Riverside Academy</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label" htmlFor="academic-year">
                        Academic Year
                      </label>
                      <select className="select" id="academic-year">
                        <option>2024 / 2025</option>
                        <option>2023 / 2024</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label" htmlFor="primary-contact">
                        Primary Contact
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="primary-contact"
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label" htmlFor="support-email">
                        Support Email
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="support-email"
                      />
                    </div>
                  </div>
                  <div className="col-md-12">
                    <hr className="my-2" />
                  </div>
                  <div className="col-md-12 mb-3">
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="status-title">
                        <h6 className="mb-1">Enable API Keys</h6>
                        <p className="mb-0 fs-13 text-muted">
                          Turn this configuration on or off for the institution
                        </p>
                      </div>
                      <div className="form-check form-switch">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          role="switch"
                          defaultChecked
                          aria-label="Toggle option"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-md-12 mb-3">
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="status-title">
                        <h6 className="mb-1">Send notifications</h6>
                        <p className="mb-0 fs-13 text-muted">
                          Notify administrators when this configuration changes
                        </p>
                      </div>
                      <div className="form-check form-switch">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          role="switch"
                          defaultChecked
                          aria-label="Toggle option"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-md-12 mb-3">
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="status-title">
                        <h6 className="mb-1">Require approval</h6>
                        <p className="mb-0 fs-13 text-muted">
                          Changes must be approved before they take effect
                        </p>
                      </div>
                      <div className="form-check form-switch">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          role="switch"
                          defaultChecked
                          aria-label="Toggle option"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-md-12">
                    <div className="mb-0">
                      <label className="form-label" htmlFor="notes">
                        Notes
                      </label>
                      <textarea
                        className="form-control"
                        rows={3}
                        placeholder="Internal notes for this setting"
                        id="notes"
                        defaultValue={""}
                      />
                    </div>
                  </div>
                </div>
                <div className="d-flex align-items-center justify-content-end gap-2 mt-3 pt-3 border-top">
                  <button type="reset" className="btn btn-light">
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  {/* /Page Wrapper */}
</>

  )
}

export default ApiKeys