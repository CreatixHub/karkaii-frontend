import { Link } from "react-router-dom";
import { all_routes } from "../../../routes/all_routes";
const SocialAuthentication = () => {
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
        <a
          href="social-authentication.html"
          className="settings-toptabs-link active"
        >
          <span className="settings-toptabs-ic">
            <i className="ti ti-share" />
          </span>
          Social Authentication
        </a>
        <a href="language.html" className="settings-toptabs-link">
          <span className="settings-toptabs-ic">
            <i className="ti ti-world" />
          </span>
          Language
        </a>
      </div>
      <div className="row">
        <div className="col-12">
          <form action="social-authentication.html">
            <div className="d-flex align-items-center justify-content-between flex-wrap border-bottom pt-3 mb-3">
              <div className="mb-3">
                <h4 className="mb-1 fs-16 fw-medium">Social Authentication</h4>
                <p>Personalize your path and settings of your website</p>
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
            <div className="d-md-flex d-block">
              <div className="flex-fill">
                <div className="row">
                  <div className="col-xxl-4 col-xl-6">
                    <div className="card">
                      <div className="card-header d-flex align-items-center justify-content-between border-0 mb-3 pb-0">
                        <div className="d-flex align-items-center">
                          <span className="avatar avatar-lg p-2 rounded bg-gray flex-shrink-0 me-2">
                            <img src="assets/img/icons/fb-icon.svg" alt="Img" />
                          </span>
                          <h5 className="fs-15">Facebook</h5>
                        </div>
                        <span className="badge bg-transparent-success text-success">
                          Connected
                        </span>
                      </div>
                      <div className="card-body pt-0">
                        <p>
                          Connect with friends, family and other people you
                          know. Let parents and staff sign in with their
                          existing Facebook account instead of creating a new
                          password.
                        </p>
                      </div>
                      <div className="card-footer d-flex justify-content-between align-items-center">
                        <div>
                          <a href="#" className="btn btn-outline-light">
                            <i className="ti ti-tool me-2" />
                            View Integration
                          </a>
                        </div>
                        <div className="status-toggle modal-status">
                          <input type="checkbox" id="user1" className="check" />
                          <label htmlFor="user1" className="checktoggle">
                            {" "}
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-xxl-4 col-xl-6">
                    <div className="card">
                      <div className="card-header d-flex align-items-center justify-content-between border-0 mb-3 pb-0">
                        <div className="d-flex align-items-center">
                          <span className="avatar avatar-lg p-2 rounded bg-gray flex-shrink-0 me-2">
                            <img
                              src="assets/img/icons/twitter-icon.svg"
                              alt="Img"
                            />
                          </span>
                          <h6>Twitter</h6>
                        </div>
                        <span className="badge bg-transparent-dark text-dark">
                          Not Connected
                        </span>
                      </div>
                      <div className="card-body pt-0">
                        <p>
                          Communicate and stay connected through the exchange of
                          quick, frequent messages
                        </p>
                      </div>
                      <div className="card-footer d-flex justify-content-between align-items-center">
                        <div>
                          <a href="#" className="btn btn-outline-light">
                            <i className="ti ti-tool me-2" />
                            View Integration
                          </a>
                        </div>
                        <div className="status-toggle modal-status">
                          <input type="checkbox" id="user2" className="check" />
                          <label htmlFor="user2" className="checktoggle">
                            {" "}
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-xxl-4 col-xl-6">
                    <div className="card">
                      <div className="card-header d-flex align-items-center justify-content-between border-0 mb-3 pb-0">
                        <div className="d-flex align-items-center">
                          <span className="avatar avatar-lg p-2 rounded bg-gray flex-shrink-0 me-2">
                            <img
                              src="assets/img/icons/google-icon.svg"
                              alt="Img"
                            />
                          </span>
                          <h6>Google</h6>
                        </div>
                        <span className="badge bg-transparent-dark text-dark">
                          Not Connected
                        </span>
                      </div>
                      <div className="card-body pt-0">
                        <p>
                          Google has many special features to help you find
                          exactly what you're looking for.
                        </p>
                      </div>
                      <div className="card-footer d-flex justify-content-between align-items-center">
                        <div>
                          <a href="#" className="btn btn-outline-light">
                            <i className="ti ti-tool me-2" />
                            View Integration
                          </a>
                        </div>
                        <div className="status-toggle modal-status">
                          <input type="checkbox" id="user3" className="check" />
                          <label htmlFor="user3" className="checktoggle">
                            {" "}
                          </label>
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
  {/* /Page Wrapper */}
</>

  )
}

export default SocialAuthentication