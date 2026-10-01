import { Link } from "react-router-dom";
import { all_routes } from "../../../routes/all_routes";
const Storage = () => {
  return (
   <>
  {/* Page Wrapper */}
  <div className="page-wrapper settings-profile">
    <div className="content bg-white content-two">
      <div className="d-md-flex d-block align-items-center justify-content-between border-bottom pb-3">
        <div className="my-auto mb-2">
          <h3 className="page-title mb-1">Other Settings</h3>
          <nav>
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item">
                <Link to={all_routes.adminDashboard}>Dashboard</Link>
              </li>
              <li className="breadcrumb-item">
                <a href="javascript:void(0);">Settings</a>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Other Settings
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
        <a href="storage.html" className="settings-toptabs-link active">
          <span className="settings-toptabs-ic">
            <i className="ti ti-database" />
          </span>
          Storage
        </a>
        <a href="ban-ip.html" className="settings-toptabs-link">
          <span className="settings-toptabs-ic">
            <i className="ti ti-ban" />
          </span>
          Ban IP Address
        </a>
      </div>
      <div className="row">
        <div className="col-12">
          <div className="flex-fill">
            <form action="storage.html">
              <div className="d-flex align-items-center justify-content-between flex-wrap border-bottom pt-3 mb-3">
                <div className="mb-3">
                  <h4 className="mb-1 fs-16 fw-medium">Storage</h4>
                  <p>Storage Settings Configuration</p>
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
              <div className="card">
                <div className="card-body p-3 pb-0">
                  <div className="row">
                    <div className="col-xxl-4 col-md-6">
                      <div className="d-flex align-items-center justify-content-between bg-white p-3 border rounded mb-3">
                        <div className="d-flex align-items-center">
                          <span className="avatar avatar-md rounded bg-light p-2 me-2">
                            <img
                              src="assets/img/icons/storage-icon-01.svg"
                              alt="Img"
                            />
                          </span>
                          <h5 className="fs-15">Local Storage</h5>
                        </div>
                        <div className="d-flex align-items-center">
                          <div className="status-toggle modal-status">
                            <input
                              type="checkbox"
                              id="user1"
                              className="check"
                            />
                            <label htmlFor="user1" className="checktoggle">
                              {" "}
                            </label>
                          </div>
                          <a
                            href="#"
                            className="btn btn-outline-light bg-white btn-icon ms-2"
                            data-bs-toggle="modal"
                            data-bs-target="#connect_sms"
                          >
                            <i className="ti ti-settings-cog" />
                          </a>
                        </div>
                      </div>
                    </div>
                    <div className="col-xxl-4 col-md-6">
                      <div className="d-flex align-items-center justify-content-between bg-white p-3 border rounded mb-3">
                        <div className="d-flex align-items-center">
                          <span className="avatar avatar-md rounded bg-light p-2 me-2">
                            <img
                              src="assets/img/icons/storage-icon-02.svg"
                              alt="Img"
                            />
                          </span>
                          <h6>AWS </h6>
                        </div>
                        <div className="d-flex align-items-center">
                          <div className="status-toggle modal-status">
                            <input
                              type="checkbox"
                              id="user2"
                              className="check"
                            />
                            <label htmlFor="user2" className="checktoggle">
                              {" "}
                            </label>
                          </div>
                          <a
                            href="#"
                            className="btn btn-outline-light bg-white btn-icon ms-2"
                            data-bs-toggle="modal"
                            data-bs-target="#connect_sms"
                          >
                            <i className="ti ti-settings-cog" />
                          </a>
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

export default Storage