import { Link } from "react-router-dom";
import { all_routes } from "../../../routes/all_routes";
const EmailTemplates = () => {
  return (
   <>
  {/* Page Wrapper */}
  <div className="page-wrapper">
    <div className="content bg-white">
      <div className="d-md-flex d-block align-items-center justify-content-between border-bottom pb-3">
        <div className="my-auto mb-2">
          <h3 className="page-title mb-1">System Settings</h3>
          <nav>
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item">
                <Link to={all_routes.adminDashboard}>Dashboard</Link>
              </li>
              <li className="breadcrumb-item">
                <a href="javascript:void(0);">Settings</a>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                System Settings
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
      <div className="row">
        <div className="col-xxl-3 col-xl-4">
          <div
            className="acs-nav nav flex-column"
            role="navigation"
            aria-label="Communication settings sections"
          >
            <span className="acs-nav-hdr">Email</span>
            <a href="email-settings.html" className="acs-nav-link">
              <i className="ti ti-mail" />
              <span className="acs-nav-txt">Email Settings</span>
            </a>
            <a href="email-templates.html" className="acs-nav-link active">
              <i className="ti ti-template" />
              <span className="acs-nav-txt">Email Templates</span>
            </a>
            <span className="acs-nav-hdr">Messaging</span>
            <a href="sms-settings.html" className="acs-nav-link">
              <i className="ti ti-message-2" />
              <span className="acs-nav-txt">SMS Settings</span>
            </a>
            <a href="otp-settings.html" className="acs-nav-link">
              <i className="ti ti-shield-lock" />
              <span className="acs-nav-txt">OTP</span>
            </a>
            <span className="acs-nav-hdr">Compliance</span>
            <a href="gdpr-cookies.html" className="acs-nav-link">
              <i className="ti ti-cookie" />
              <span className="acs-nav-txt">GDPR Cookies</span>
            </a>
          </div>
        </div>
        <div className="col-xxl-9 col-xl-8">
          <div className="flex-fill border-start ps-3">
            <form action="email-templates.html">
              <div className="d-flex align-items-center justify-content-between flex-wrap border-bottom pt-3 mb-3">
                <div className="mb-3">
                  <h4 className="mb-1 fs-16 fw-medium">Email Templates</h4>
                  <p>Email Templates Configuration</p>
                </div>
                <div className="mb-3">
                  <a
                    href="#"
                    className="btn btn-outline-light bg-white btn-icon me-2"
                    data-bs-toggle="modal"
                    data-bs-target="#add_email_template"
                  >
                    <i className="ti ti-plus" />
                  </a>
                  <button className="btn btn-light me-2" type="button">
                    Cancel
                  </button>
                  <button className="btn btn-primary" type="submit">
                    Save
                  </button>
                </div>
              </div>
              <div className="d-md-flex">
                <div className="flex-fill">
                  <div className="card">
                    <div className="card-body p-3 pb-0">
                      <div className="row">
                        <div className="col-xxl-4 col-md-6">
                          <div className="d-flex align-items-center justify-content-between bg-white p-3 border rounded mb-3">
                            <h5 className="fs-15 fw-normal">
                              Email Verification
                            </h5>
                            <div className="d-flex align-items-center">
                              <a
                                href="#"
                                className="btn btn-outline-light bg-white btn-icon me-2"
                                data-bs-toggle="modal"
                                data-bs-target="#edit_email_template"
                              >
                                <i className="ti ti-edit" />
                              </a>
                              <a
                                href="#"
                                className="btn btn-outline-light bg-white btn-icon"
                                data-bs-toggle="modal"
                                data-bs-target="#delete-modal"
                              >
                                <i className="ti ti-trash" />
                              </a>
                            </div>
                          </div>
                        </div>
                        <div className="col-xxl-4 col-md-6">
                          <div className="d-flex align-items-center justify-content-between bg-white p-3 border rounded mb-3">
                            <h5 className="fs-15 fw-normal">Welcome Email</h5>
                            <div className="d-flex align-items-center">
                              <a
                                href="#"
                                className="btn btn-outline-light bg-white btn-icon me-2"
                                data-bs-toggle="modal"
                                data-bs-target="#edit_email_template"
                              >
                                <i className="ti ti-edit" />
                              </a>
                              <a
                                href="#"
                                className="btn btn-outline-light bg-white btn-icon"
                                data-bs-toggle="modal"
                                data-bs-target="#delete-modal"
                              >
                                <i className="ti ti-trash" />
                              </a>
                            </div>
                          </div>
                        </div>
                        <div className="col-xxl-4 col-md-6">
                          <div className="d-flex align-items-center justify-content-between bg-white p-3 border rounded mb-3">
                            <h5 className="fs-15 fw-normal">
                              Feature Announcement
                            </h5>
                            <div className="d-flex align-items-center">
                              <a
                                href="#"
                                className="btn btn-outline-light bg-white btn-icon me-2"
                                data-bs-toggle="modal"
                                data-bs-target="#edit_email_template"
                              >
                                <i className="ti ti-edit" />
                              </a>
                              <a
                                href="#"
                                className="btn btn-outline-light bg-white btn-icon"
                                data-bs-toggle="modal"
                                data-bs-target="#delete-modal"
                              >
                                <i className="ti ti-trash" />
                              </a>
                            </div>
                          </div>
                        </div>
                        <div className="col-xxl-4 col-md-6">
                          <div className="d-flex align-items-center justify-content-between bg-white p-3 border rounded mb-3">
                            <h5 className="fs-15 fw-normal">
                              Plan Announcement
                            </h5>
                            <div className="d-flex align-items-center">
                              <a
                                href="#"
                                className="btn btn-outline-light bg-white btn-icon me-2"
                                data-bs-toggle="modal"
                                data-bs-target="#edit_email_template"
                              >
                                <i className="ti ti-edit" />
                              </a>
                              <a
                                href="#"
                                className="btn btn-outline-light bg-white btn-icon"
                                data-bs-toggle="modal"
                                data-bs-target="#delete-modal"
                              >
                                <i className="ti ti-trash" />
                              </a>
                            </div>
                          </div>
                        </div>
                        <div className="col-xxl-4 col-md-6">
                          <div className="d-flex align-items-center justify-content-between bg-white p-3 border rounded mb-3">
                            <h5 className="fs-15 fw-normal">User Remainder</h5>
                            <div className="d-flex align-items-center">
                              <a
                                href="#"
                                className="btn btn-outline-light bg-white btn-icon me-2"
                                data-bs-toggle="modal"
                                data-bs-target="#edit_email_template"
                              >
                                <i className="ti ti-edit" />
                              </a>
                              <a
                                href="#"
                                className="btn btn-outline-light bg-white btn-icon"
                                data-bs-toggle="modal"
                                data-bs-target="#delete-modal"
                              >
                                <i className="ti ti-trash" />
                              </a>
                            </div>
                          </div>
                        </div>
                        <div className="col-xxl-4 col-md-6">
                          <div className="d-flex align-items-center justify-content-between bg-white p-3 border rounded mb-3">
                            <h5 className="fs-15 fw-normal">
                              Feedback Request
                            </h5>
                            <div className="d-flex align-items-center">
                              <a
                                href="#"
                                className="btn btn-outline-light bg-white btn-icon me-2"
                                data-bs-toggle="modal"
                                data-bs-target="#edit_email_template"
                              >
                                <i className="ti ti-edit" />
                              </a>
                              <a
                                href="#"
                                className="btn btn-outline-light bg-white btn-icon"
                                data-bs-toggle="modal"
                                data-bs-target="#delete-modal"
                              >
                                <i className="ti ti-trash" />
                              </a>
                            </div>
                          </div>
                        </div>
                        <div className="col-xxl-4 col-md-6">
                          <div className="d-flex align-items-center justify-content-between bg-white p-3 border rounded mb-3">
                            <h5 className="fs-15 fw-normal">
                              Plan Removal Remainder
                            </h5>
                            <div className="d-flex align-items-center">
                              <a
                                href="#"
                                className="btn btn-outline-light bg-white btn-icon me-2"
                                data-bs-toggle="modal"
                                data-bs-target="#edit_email_template"
                              >
                                <i className="ti ti-edit" />
                              </a>
                              <a
                                href="#"
                                className="btn btn-outline-light bg-white btn-icon"
                                data-bs-toggle="modal"
                                data-bs-target="#delete-modal"
                              >
                                <i className="ti ti-trash" />
                              </a>
                            </div>
                          </div>
                        </div>
                        <div className="col-xxl-4 col-md-6">
                          <div className="d-flex align-items-center justify-content-between bg-white p-3 border rounded mb-3">
                            <h5 className="fs-15 fw-normal">Plan Expired</h5>
                            <div className="d-flex align-items-center">
                              <a
                                href="#"
                                className="btn btn-outline-light bg-white btn-icon me-2"
                                data-bs-toggle="modal"
                                data-bs-target="#edit_email_template"
                              >
                                <i className="ti ti-edit" />
                              </a>
                              <a
                                href="#"
                                className="btn btn-outline-light bg-white btn-icon"
                                data-bs-toggle="modal"
                                data-bs-target="#delete-modal"
                              >
                                <i className="ti ti-trash" />
                              </a>
                            </div>
                          </div>
                        </div>
                        <div className="col-xxl-4 col-md-6">
                          <div className="d-flex align-items-center justify-content-between bg-white p-3 border rounded mb-3">
                            <h5 className="fs-15 fw-normal">
                              Policy Update Notice
                            </h5>
                            <div className="d-flex align-items-center">
                              <a
                                href="#"
                                className="btn btn-outline-light bg-white btn-icon me-2"
                                data-bs-toggle="modal"
                                data-bs-target="#edit_email_template"
                              >
                                <i className="ti ti-edit" />
                              </a>
                              <a
                                href="#"
                                className="btn btn-outline-light bg-white btn-icon"
                                data-bs-toggle="modal"
                                data-bs-target="#delete-modal"
                              >
                                <i className="ti ti-trash" />
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
  {/* /Page Wrapper */}
</>

  )
}

export default EmailTemplates