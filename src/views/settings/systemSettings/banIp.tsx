import { Link } from "react-router-dom";
import { all_routes } from "../../../routes/all_routes";
const BanIp = () => {
  return (
    <>
  {/* Page Wrapper */}
  <div className="page-wrapper">
    <div className="content bg-white">
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
        <a href="storage.html" className="settings-toptabs-link">
          <span className="settings-toptabs-ic">
            <i className="ti ti-database" />
          </span>
          Storage
        </a>
        <a href="ban-ip.html" className="settings-toptabs-link active">
          <span className="settings-toptabs-ic">
            <i className="ti ti-ban" />
          </span>
          Ban IP Address
        </a>
      </div>
      <div className="row">
        <div className="col-12">
          <div className="flex-fill">
            <form action="ban-ip.html">
              <div className="d-flex align-items-center justify-content-between flex-wrap border-bottom pt-3 mb-3">
                <div className="mb-3">
                  <h4 className="mb-1 fs-16 fw-medium">Ban IP Address</h4>
                  <p>Ban IP Address Configuration</p>
                </div>
                <div className="mb-3">
                  <a
                    href="#"
                    className="btn btn-outline-light bg-white btn-icon me-2"
                    data-bs-toggle="modal"
                    data-bs-target="#add_ban_ip"
                  >
                    <i className="ti ti-plus" />
                  </a>
                </div>
              </div>
              <div className="row">
                <div className="col-xxl-4 col-md-6 d-flex">
                  <div className="card flex-fill">
                    <div className="card-header p-3 d-flex justify-content-between align-items-center">
                      <div className="d-flex align-items-center">
                        <span className="avatar avatar-sm rounded p-1 text-danger bg-soft-danger me-2">
                          <i className="ti ti-ban" />
                        </span>
                        <h5 className="fs-15">198.120.16.01</h5>
                      </div>
                      <div className="d-flex align-items-center">
                        <a
                          href="#"
                          className="me-2"
                          data-bs-toggle="modal"
                          data-bs-target="#edit_ban_ip"
                        >
                          <i className="ti ti-edit" />
                        </a>
                        <a
                          href="#"
                          data-bs-toggle="modal"
                          data-bs-target="#delete-modal"
                        >
                          <i className="ti ti-trash" />
                        </a>
                      </div>
                    </div>
                    <div className="card-body p-3">
                      <div className="d-flex align-items-center">
                        <span className="flex-shrink-0 d-block me-2">
                          <i className="ti ti-info-square-rounded" />
                        </span>
                        <p>
                          Temporarily block to protect user accounts from
                          internet fraudsters.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-4 col-md-6 d-flex">
                  <div className="card flex-fill">
                    <div className="card-header p-3 d-flex justify-content-between align-items-center">
                      <div className="d-flex align-items-center">
                        <span className="avatar avatar-sm rounded p-1 text-danger bg-soft-danger me-2">
                          <i className="ti ti-ban" />
                        </span>
                        <h6>198.160.11.20</h6>
                      </div>
                      <div className="d-flex align-items-center">
                        <a
                          href="#"
                          className="me-2"
                          data-bs-toggle="modal"
                          data-bs-target="#edit_ban_ip"
                        >
                          <i className="ti ti-edit" />
                        </a>
                        <a
                          href="#"
                          data-bs-toggle="modal"
                          data-bs-target="#delete-modal"
                        >
                          <i className="ti ti-trash" />
                        </a>
                      </div>
                    </div>
                    <div className="card-body p-3">
                      <div className="d-flex align-items-center">
                        <span className="flex-shrink-0 d-block me-2">
                          <i className="ti ti-info-square-rounded" />
                        </span>
                        <p>
                          Unauthorized access attempts, or other signs of a
                          potential security
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-4 col-md-6 d-flex">
                  <div className="card flex-fill">
                    <div className="card-header p-3 d-flex justify-content-between align-items-center">
                      <div className="d-flex align-items-center">
                        <span className="avatar avatar-sm rounded p-1 text-danger bg-soft-danger me-2">
                          <i className="ti ti-ban" />
                        </span>
                        <h6>198.123.10.2</h6>
                      </div>
                      <div className="d-flex align-items-center">
                        <a
                          href="#"
                          className="me-2"
                          data-bs-toggle="modal"
                          data-bs-target="#edit_ban_ip"
                        >
                          <i className="ti ti-edit" />
                        </a>
                        <a
                          href="#"
                          data-bs-toggle="modal"
                          data-bs-target="#delete-modal"
                        >
                          <i className="ti ti-trash" />
                        </a>
                      </div>
                    </div>
                    <div className="card-body p-3">
                      <div className="d-flex align-items-center">
                        <span className="flex-shrink-0 d-block me-2">
                          <i className="ti ti-info-square-rounded" />
                        </span>
                        <p>Trying to access restricted areas of the admin</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-4 col-md-6 d-flex">
                  <div className="card flex-fill">
                    <div className="card-header p-3 d-flex justify-content-between align-items-center">
                      <div className="d-flex align-items-center">
                        <span className="avatar avatar-sm rounded p-1 text-danger bg-soft-danger me-2">
                          <i className="ti ti-ban" />
                        </span>
                        <h6>198.110.01.05</h6>
                      </div>
                      <div className="d-flex align-items-center">
                        <a
                          href="#"
                          className="me-2"
                          data-bs-toggle="modal"
                          data-bs-target="#edit_ban_ip"
                        >
                          <i className="ti ti-edit" />
                        </a>
                        <a
                          href="#"
                          data-bs-toggle="modal"
                          data-bs-target="#delete-modal"
                        >
                          <i className="ti ti-trash" />
                        </a>
                      </div>
                    </div>
                    <div className="card-body p-3">
                      <div className="d-flex align-items-center">
                        <span className="flex-shrink-0 d-block me-2">
                          <i className="ti ti-info-square-rounded" />
                        </span>
                        <p>
                          Found downloading or uploading inappropriate content
                        </p>
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

export default BanIp