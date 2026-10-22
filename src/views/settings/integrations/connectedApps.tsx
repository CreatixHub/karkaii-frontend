import { Link } from "react-router-dom";
import { all_routes } from "../../../routes/all_routes";
const ConnectedApps = () => {
  return (
  <>
  {/* Page Wrapper */}
  <div className="page-wrapper settings-profile">
    <div className="content content-two">
      <div className="d-md-flex d-block align-items-center justify-content-between border-bottom pb-3">
        <div className="my-auto mb-2">
          <h3 className="page-title mb-1">General Settings</h3>
          <nav>
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item">
                <Link to={all_routes.adminDashboard}>Dashboard</Link>
              </li>
              <li className="breadcrumb-item">
                <a href="javascript:void(0);">Settings</a>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                General Settings
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
        <a href="profile-settings.html" className="settings-toptabs-link">
          <span className="settings-toptabs-ic">
            <i className="ti ti-user-circle" />
          </span>
          Profile Settings
        </a>
        <a href="security-settings.html" className="settings-toptabs-link">
          <span className="settings-toptabs-ic">
            <i className="ti ti-shield-check" />
          </span>
          Security Settings
        </a>
        <a href="notifications-settings.html" className="settings-toptabs-link">
          <span className="settings-toptabs-ic">
            <i className="ti ti-bell" />
          </span>
          Notifications
        </a>
        <a href="connected-apps.html" className="settings-toptabs-link active">
          <span className="settings-toptabs-ic">
            <i className="ti ti-plug-connected" />
          </span>
          Connected Apps
        </a>
      </div>
      <div className="row">
        <div className="col-12">
          <div className="flex-fill">
            <div className="d-flex align-items-center justify-content-between flex-wrap border-bottom mb-3 pt-3">
              <div className="mb-3">
                <h4 className="fs-16 fw-medium">Connected Apps</h4>
                <p>Upload your photo &amp; personal details here</p>
              </div>
            </div>
            <div className="d-block">
              <div className="d-flex align-items-center justify-content-between flex-wrap border mb-3 p-3 pb-0 rounded bg-white">
                <div className="">
                  <div className="d-flex align-items-center">
                    <span className="flex-shrink-0 mb-3 me-2 border rounded p-2 d-flex align-items-center justify-content-center">
                      <img
                        src="assets/img/icons/connected-app-01.svg"
                        alt="Img"
                      />
                    </span>
                    <div className="mb-3">
                      <h5 className="fs-15">Slack</h5>
                      <p>
                        Team communication platform with channels for group
                        discussions and direct messaging.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mb-3">
                  <a
                    href="#"
                    className="btn btn-outline-primary"
                    data-bs-toggle="modal"
                    data-bs-target="#connect_app"
                  >
                    Connect
                  </a>
                </div>
              </div>
              <div className="d-flex align-items-center justify-content-between flex-wrap border mb-3 p-3 pb-0 rounded bg-white">
                <div className="">
                  <div className="d-flex align-items-center">
                    <span className="flex-shrink-0 mb-3 me-2 border rounded p-2 d-flex align-items-center justify-content-center">
                      <img
                        src="assets/img/icons/connected-app-02.svg"
                        alt="Img"
                      />
                    </span>
                    <div className="mb-3">
                      <h6>Google Calendar</h6>
                      <p>
                        Google Calendar is a web-based scheduling tool that
                        allows users to create, manage, and share events.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mb-3">
                  <a
                    href="#"
                    className="btn btn-outline-primary"
                    data-bs-toggle="modal"
                    data-bs-target="#connect_app_two"
                  >
                    Connect
                  </a>
                </div>
              </div>
              <div className="d-flex align-items-center justify-content-between flex-wrap border mb-3 p-3 pb-0 rounded bg-white">
                <div className="">
                  <div className="d-flex align-items-center">
                    <span className="flex-shrink-0 mb-3 me-2 border rounded p-2 d-flex align-items-center justify-content-center">
                      <img
                        src="assets/img/icons/connected-app-03.svg"
                        alt="Img"
                      />
                    </span>
                    <div className="mb-3">
                      <h6>Gmail</h6>
                      <p>
                        Gmail is a free email service by Google that offers
                        robust spam protection &amp; 15GB of storage.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mb-3">
                  <a
                    href="#"
                    className="btn btn-outline-primary"
                    data-bs-toggle="modal"
                    data-bs-target="#connect_app_three"
                  >
                    Connect
                  </a>
                </div>
              </div>
              <div className="d-flex align-items-center justify-content-between flex-wrap border mb-0 p-3 pb-0 rounded bg-white">
                <div className="">
                  <div className="d-flex align-items-center">
                    <span className="flex-shrink-0 mb-3 me-2 border rounded p-2 d-flex align-items-center justify-content-center">
                      <img
                        src="assets/img/icons/connected-app-04.svg"
                        alt="Img"
                      />
                    </span>
                    <div className="mb-3">
                      <h6>Github</h6>
                      <p>
                        GitHub is a web-based platform for version control and
                        collaboration, allowing developers to host and review
                        code
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mb-3">
                  <a
                    href="#"
                    className="btn btn-outline-primary"
                    data-bs-toggle="modal"
                    data-bs-target="#connect_app_four"
                  >
                    Connect
                  </a>
                </div>
              </div>
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

export default ConnectedApps