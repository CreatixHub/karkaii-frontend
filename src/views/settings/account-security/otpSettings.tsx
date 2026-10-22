import { Link } from "react-router-dom";
import { all_routes } from "../../../routes/all_routes";
const OtpSettings = () => {
  return (
    <>
  {/* Page Wrapper */}
  <div className="page-wrapper settings-profile">
    <div className="content bg-white content-two">
      <div className="d-md-flex d-block align-items-center justify-content-between pb-3 mb-3 border-bottom">
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
            <a href="email-templates.html" className="acs-nav-link">
              <i className="ti ti-template" />
              <span className="acs-nav-txt">Email Templates</span>
            </a>
            <span className="acs-nav-hdr">Messaging</span>
            <a href="sms-settings.html" className="acs-nav-link">
              <i className="ti ti-message-2" />
              <span className="acs-nav-txt">SMS Settings</span>
            </a>
            <a href="otp-settings.html" className="acs-nav-link active">
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
            <form action="otp-settings.html">
              <div className="d-flex align-items-center justify-content-between flex-wrap border-bottom pt-3 mb-3">
                <div className="mb-3">
                  <h4 className="mb-1 fs-16 fw-medium">OTP</h4>
                  <p>OTP configuration</p>
                </div>
                <div className="mb-3">
                  <button className="btn btn-light me-2" type="button">
                    Cancel
                  </button>
                  <button className="btn btn-primary" type="submit">
                    Save
                  </button>
                </div>
              </div>
              <div className="d-md-flex">
                <div className="row flex-fill">
                  <div className="col-xl-10">
                    <div className="d-bock">
                      <div className="d-flex align-items-center justify-content-between flex-wrap border mb-3 p-3 pb-0 rounded">
                        <div className="row align-items-center flex-fill">
                          <div className="col-xxl-8 col-lg-6">
                            <div className="mb-3">
                              <h5 className="fs-15">OTP Type</h5>
                              <p>You can configure the type</p>
                            </div>
                          </div>
                          <div className="col-xxl-4 col-lg-6">
                            <div className="mb-3">
                              <select className="select" aria-label="SMS">
                                <option>SMS</option>
                                <option>Email</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="d-flex align-items-center justify-content-between flex-wrap border mb-3 p-3 pb-0 rounded">
                        <div className="row align-items-center flex-fill">
                          <div className="col-xxl-8 col-lg-6">
                            <div className="mb-3">
                              <h6>OTP Digit Limit</h6>
                              <p>Select size of the format</p>
                            </div>
                          </div>
                          <div className="col-xxl-4 col-lg-6">
                            <div className="mb-3">
                              <select className="select" aria-label="4">
                                <option>4</option>
                                <option>5</option>
                                <option>6</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="d-flex align-items-center justify-content-between flex-wrap border mb-3 p-3 pb-0 rounded">
                        <div className="row align-items-center flex-fill">
                          <div className="col-xxl-8 col-lg-6">
                            <div className="mb-3">
                              <h6>OTP Expire Time</h6>
                              <p>Select Expire time of OTP</p>
                            </div>
                          </div>
                          <div className="col-xxl-4 col-lg-6">
                            <div className="mb-3">
                              <select className="select" aria-label="5 mins">
                                <option>5 mins</option>
                                <option>2 mins</option>
                                <option>10 mins</option>
                              </select>
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

export default OtpSettings