import { Link } from "react-router-dom";
import { all_routes } from "../../../routes/all_routes";
const Prefixes = () => {
  return (
   <>
  {/* Page Wrapper */}
  <div className="page-wrapper settings-profile">
    <div className="content">
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
        <a href="prefixes.html" className="settings-toptabs-link active">
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
        <a href="language.html" className="settings-toptabs-link">
          <span className="settings-toptabs-ic">
            <i className="ti ti-world" />
          </span>
          Language
        </a>
      </div>
      <div className="row">
        <div className="col-12">
          <form action="prefixes.html">
            <div className="d-flex align-items-center justify-content-between flex-wrap border-bottom pt-3 mb-3">
              <div className="mb-3">
                <h4 className="mb-1 fs-16 fw-medium">Prefixes</h4>
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
                <div className="card">
                  <div className="card-body p-3 pb-0">
                    <div className="row">
                      <div className="col-xxl-3 col-xl-4 col-sm-6">
                        <div className="mb-3">
                          <label className="form-label" htmlFor="students">
                            Students
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="students"
                          />
                        </div>
                      </div>
                      <div className="col-xxl-3 col-xl-4 col-sm-6">
                        <div className="mb-3">
                          <label className="form-label" htmlFor="teachers">
                            Teachers
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="teachers"
                          />
                        </div>
                      </div>
                      <div className="col-xxl-3 col-xl-4 col-sm-6">
                        <div className="mb-3">
                          <label className="form-label" htmlFor="parents">
                            Parents
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="parents"
                          />
                        </div>
                      </div>
                      <div className="col-xxl-3 col-xl-4 col-sm-6">
                        <div className="mb-3">
                          <label className="form-label" htmlFor="guardians">
                            Guardians
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="guardians"
                          />
                        </div>
                      </div>
                      <div className="col-xxl-3 col-xl-4 col-sm-6">
                        <div className="mb-3">
                          <label className="form-label" htmlFor="subjects">
                            Subjects
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="subjects"
                          />
                        </div>
                      </div>
                      <div className="col-xxl-3 col-xl-4 col-sm-6">
                        <div className="mb-3">
                          <label className="form-label" htmlFor="class">
                            Class
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="class"
                          />
                        </div>
                      </div>
                      <div className="col-xxl-3 col-xl-4 col-sm-6">
                        <div className="mb-3">
                          <label className="form-label" htmlFor="sections">
                            Sections
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="sections"
                          />
                        </div>
                      </div>
                      <div className="col-xxl-3 col-xl-4 col-sm-6">
                        <div className="mb-3">
                          <label className="form-label" htmlFor="home-work">
                            Home Work
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="home-work"
                          />
                        </div>
                      </div>
                      <div className="col-xxl-3 col-xl-4 col-sm-6">
                        <div className="mb-3">
                          <label className="form-label" htmlFor="department">
                            Department
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="department"
                          />
                        </div>
                      </div>
                      <div className="col-xxl-3 col-xl-4 col-sm-6">
                        <div className="mb-3">
                          <label className="form-label" htmlFor="designation">
                            Designation
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="designation"
                          />
                        </div>
                      </div>
                      <div className="col-xxl-3 col-xl-4 col-sm-6">
                        <div className="mb-3">
                          <label className="form-label" htmlFor="notice-board">
                            Notice Board
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="notice-board"
                          />
                        </div>
                      </div>
                      <div className="col-xxl-3 col-xl-4 col-sm-6">
                        <div className="mb-3">
                          <label className="form-label" htmlFor="attendance">
                            Attendance
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="attendance"
                          />
                        </div>
                      </div>
                      <div className="col-xxl-3 col-xl-4 col-sm-6">
                        <div className="mb-3">
                          <label className="form-label" htmlFor="time-table">
                            Time Table
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="time-table"
                          />
                        </div>
                      </div>
                      <div className="col-xxl-3 col-xl-4 col-sm-6">
                        <div className="mb-3">
                          <label className="form-label" htmlFor="sports">
                            Sports
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="sports"
                          />
                        </div>
                      </div>
                      <div className="col-xxl-3 col-xl-4 col-sm-6">
                        <div className="mb-3">
                          <label className="form-label" htmlFor="syllabus">
                            Syllabus
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="syllabus"
                          />
                        </div>
                      </div>
                      <div className="col-xxl-3 col-xl-4 col-sm-6">
                        <div className="mb-3">
                          <label className="form-label" htmlFor="class-room">
                            Class Room
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="class-room"
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

export default Prefixes