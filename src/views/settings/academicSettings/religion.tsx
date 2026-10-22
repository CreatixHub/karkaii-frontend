import { Link } from "react-router-dom";
import { all_routes } from "../../../routes/all_routes";
const Religion = () => {
  return (
   <>
  {/* Page Wrapper */}
  <div className="page-wrapper">
    <div className="content bg-white">
      <div className="d-md-flex d-block align-items-center justify-content-between border-bottom pb-3">
        <div className="my-auto mb-2">
          <h3 className="page-title mb-1">Academic Settings</h3>
          <nav>
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item">
                <Link to={all_routes.adminDashboard}>Dashboard</Link>
              </li>
              <li className="breadcrumb-item">
                <a href="javascript:void(0);">Settings</a>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Academic Settings
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
        <a href="school-settings.html" className="settings-toptabs-link">
          <span className="settings-toptabs-ic">
            <i className="ti ti-settings" />
          </span>
          School Settings
        </a>
        <a href="religion.html" className="settings-toptabs-link active">
          <span className="settings-toptabs-ic">
            <i className="ti ti-list-details" />
          </span>
          Religion
        </a>
      </div>
      <div className="row">
        <div className="col-12">
          <form action="religion.html">
            <div className="d-flex align-items-center justify-content-between flex-wrap border-bottom pt-3 mb-3">
              <div className="mb-3">
                <h4 className="mb-1 fs-16 fw-medium">Religion</h4>
                <p>Religion Settings Configuration</p>
              </div>
              <div className="mb-3">
                <a
                  href="#"
                  className="btn btn-outline-light bg-white btn-icon me-2"
                  data-bs-toggle="modal"
                  data-bs-target="#add_religion"
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
              <div className="row flex-fill">
                <div className="col-xxl-4 col-md-6">
                  <div className="d-flex align-items-center justify-content-between bg-white p-3 border rounded mb-3">
                    <h5 className="fs-15 fw-normal">Hindu</h5>
                    <div className="d-flex align-items-center">
                      <div className="status-toggle modal-status">
                        <input type="checkbox" id="user1" className="check" />
                        <label htmlFor="user1" className="checktoggle">
                          {" "}
                        </label>
                      </div>
                      <div className="d-flex align-items-center ms-3">
                        <a
                          href="#"
                          data-bs-toggle="modal"
                          data-bs-target="#edit_religion"
                        >
                          <i className="ti ti-edit me-2" />
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
                  </div>
                </div>
                <div className="col-xxl-4 col-md-6">
                  <div className="d-flex align-items-center justify-content-between bg-white p-3 border rounded mb-3">
                    <h5 className="fs-15 fw-normal">Christian</h5>
                    <div className="d-flex align-items-center">
                      <div className="status-toggle modal-status">
                        <input type="checkbox" id="user2" className="check" />
                        <label htmlFor="user2" className="checktoggle">
                          {" "}
                        </label>
                      </div>
                      <div className="d-flex align-items-center ms-3">
                        <a
                          href="#"
                          data-bs-toggle="modal"
                          data-bs-target="#edit_religion"
                        >
                          <i className="ti ti-edit me-2" />
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
                  </div>
                </div>
                <div className="col-xxl-4 col-md-6">
                  <div className="d-flex align-items-center justify-content-between bg-white p-3 border rounded mb-3">
                    <h5 className="fs-15 fw-normal">Islam</h5>
                    <div className="d-flex align-items-center">
                      <div className="status-toggle modal-status">
                        <input type="checkbox" id="user3" className="check" />
                        <label htmlFor="user3" className="checktoggle">
                          {" "}
                        </label>
                      </div>
                      <div className="d-flex align-items-center ms-3">
                        <a
                          href="#"
                          data-bs-toggle="modal"
                          data-bs-target="#edit_religion"
                        >
                          <i className="ti ti-edit me-2" />
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

export default Religion