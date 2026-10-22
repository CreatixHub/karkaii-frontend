import { Link } from "react-router-dom";
import { all_routes } from "../../../routes/all_routes";
const SchoolSettings = () => {
  return (
    <>
  {/* Page Wrapper */}
  <div className="page-wrapper settings-profile">
    <div className="content bg-white content-two">
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
        <a href="school-settings.html" className="settings-toptabs-link active">
          <span className="settings-toptabs-ic">
            <i className="ti ti-settings" />
          </span>
          School Settings
        </a>
        <a href="religion.html" className="settings-toptabs-link">
          <span className="settings-toptabs-ic">
            <i className="ti ti-list-details" />
          </span>
          Religion
        </a>
      </div>
      <div className="row">
        <div className="col-12">
          <form action="school-settings.html">
            <div className="d-flex align-items-center justify-content-between flex-wrap border-bottom pt-3 mb-3">
              <div className="mb-3">
                <h4 className="mb-1 fs-16 fw-medium">School Settings</h4>
                <p>School Settings Configuration</p>
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
                  <div className="d-flex align-items-center justify-content-between flex-wrap border mb-3 p-3 pb-0 rounded">
                    <div className="row align-items-center flex-fill">
                      <div className="col-xxl-8 col-lg-6">
                        <div className="mb-3">
                          <h5 className="fs-15">School Name</h5>
                          <p>Shows name of your school</p>
                        </div>
                      </div>
                      <div className="col-xxl-4 col-lg-6">
                        <div className="mb-3">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Enter School Name"
                            aria-label="Enter School Name"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="d-flex align-items-center justify-content-between flex-wrap border mb-3 p-3 pb-0 rounded">
                    <div className="row align-items-center flex-fill">
                      <div className="col-xxl-8 col-lg-6">
                        <div className="mb-3">
                          <h6>Phone Number</h6>
                          <p>Shows phone number of your school</p>
                        </div>
                      </div>
                      <div className="col-xxl-4 col-lg-6">
                        <div className="mb-3">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Enter Phone Number"
                            aria-label="Enter Phone Number"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="d-flex align-items-center justify-content-between flex-wrap border mb-3 p-3 pb-0 rounded">
                    <div className="row align-items-center flex-fill">
                      <div className="col-xxl-8 col-lg-6">
                        <div className="mb-3">
                          <h6>Email</h6>
                          <p>Shows email of your school</p>
                        </div>
                      </div>
                      <div className="col-xxl-4 col-lg-6">
                        <div className="mb-3">
                          <input
                            type="email"
                            className="form-control"
                            placeholder="Enter Email"
                            aria-label="Enter Email"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="d-flex align-items-center justify-content-between flex-wrap border mb-3 p-3 pb-0 rounded">
                    <div className="row align-items-center flex-fill">
                      <div className="col-xxl-8 col-lg-6">
                        <div className="mb-3">
                          <h6>Fax</h6>
                          <p>Shows fax of your school</p>
                        </div>
                      </div>
                      <div className="col-xxl-4 col-lg-6">
                        <div className="mb-3">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Enter Fax"
                            aria-label="Enter Fax"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="d-flex align-items-center justify-content-between flex-wrap border mb-3 p-3 pb-0 rounded">
                    <div className="row align-items-center flex-fill">
                      <div className="col-xxl-8 col-lg-6">
                        <div className="mb-3">
                          <h6>Address</h6>
                          <p>Shows address of your school</p>
                        </div>
                      </div>
                      <div className="col-xxl-4 col-lg-6">
                        <div className="mb-3">
                          <textarea
                            rows={4}
                            className="form-control"
                            placeholder="Add Comment"
                            aria-label="Add Comment"
                            defaultValue={""}
                          />
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

export default SchoolSettings