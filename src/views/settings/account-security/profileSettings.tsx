import { Link } from "react-router-dom";
import { all_routes } from "../../../routes/all_routes";
const ProfileSettings = () => {
  return (
   <>
  {/* Page Wrapper */}
  <div className="page-wrapper settings-profile">
    <div className="content">
      <div className="d-md-flex d-block align-items-center justify-content-between pb-3">
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
      {/* Stats Cards */}
      <div className="row g-3 mb-3">
        <div className="col-xl-3 col-sm-6 d-flex">
          <div className="stats-card stats-card-directory stats-primary">
            <span className="stats-avatar stats-icon">
              <i className="ti ti-shield-check" />
            </span>
            <div>
              <h3 className="stats-value mb-0">92%</h3>
              <p className="stats-label">Profile Completeness</p>
              <span className="stats-role">+2% this week</span>
            </div>
          </div>
        </div>
        <div className="col-xl-3 col-sm-6 d-flex">
          <div className="stats-card stats-card-directory stats-success">
            <span className="stats-avatar stats-icon">
              <i className="ti ti-key" />
            </span>
            <div>
              <h3 className="stats-value mb-0">Strong</h3>
              <p className="stats-label">Password Strength</p>
              <span className="stats-role">Updated recently</span>
            </div>
          </div>
        </div>
        <div className="col-xl-3 col-sm-6 d-flex">
          <div className="stats-card stats-card-directory stats-warning">
            <span className="stats-avatar stats-icon">
              <i className="ti ti-apps" />
            </span>
            <div>
              <h3 className="stats-value mb-0">4</h3>
              <p className="stats-label">Connected Apps</p>
              <span className="stats-role">No change</span>
            </div>
          </div>
        </div>
        <div className="col-xl-3 col-sm-6 d-flex">
          <div className="stats-card stats-card-directory stats-info">
            <span className="stats-avatar stats-icon">
              <i className="ti ti-clock-hour-4" />
            </span>
            <div>
              <h3 className="stats-value mb-0">3 Days</h3>
              <p className="stats-label">Last Updated</p>
              <span className="stats-role">Since last edit</span>
            </div>
          </div>
        </div>
      </div>
      {/* /Stats Cards */}
      <div className="settings-toptabs mt-3">
        <a
          href="profile-settings.html"
          className="settings-toptabs-link active"
        >
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
        <a href="connected-apps.html" className="settings-toptabs-link">
          <span className="settings-toptabs-ic">
            <i className="ti ti-plug-connected" />
          </span>
          Connected Apps
        </a>
      </div>
      <div className="row">
        <div className="col-12">
          <div className="flex-fill">
            <form action="profile-settings.html">
              <div className="d-flex align-items-center justify-content-between flex-wrap border-bottom pt-3 mb-3">
                <div className="mb-3">
                  <h4 className="mb-1 fs-16 fw-medium">Profile Settings</h4>
                  <p>Upload your photo &amp; personal details here</p>
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
                    <div className="card-header p-3">
                      <h5>Personal Information</h5>
                    </div>
                    <div className="card-body p-3 pb-0">
                      <div className="d-block d-xl-flex">
                        <div className="mb-3 flex-fill me-xl-3 me-0">
                          <label className="form-label" htmlFor="first-name">
                            First Name
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Enter First Name"
                            id="first-name"
                          />
                        </div>
                        <div className="mb-3 flex-fill">
                          <label className="form-label" htmlFor="last-name">
                            Last Name
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Enter Last Name"
                            id="last-name"
                          />
                        </div>
                      </div>
                      <div className="mb-3">
                        <label className="form-label" htmlFor="email-address">
                          Email Address
                        </label>
                        <input
                          type="email"
                          className="form-control"
                          placeholder="Enter Email"
                          id="email-address"
                        />
                      </div>
                      <div className="d-block d-xl-flex">
                        <div className="mb-3 flex-fill me-xl-3 me-0">
                          <label className="form-label" htmlFor="user-name">
                            User Name
                          </label>
                          <input
                            type="email"
                            className="form-control"
                            placeholder="Enter User Name"
                            id="user-name"
                          />
                        </div>
                        <div className="mb-3 flex-fill">
                          <label className="form-label" htmlFor="phone-number">
                            Phone Number
                          </label>
                          <input
                            type="email"
                            className="form-control"
                            placeholder="Enter Phone Number"
                            id="phone-number"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="card">
                    <div className="card-header p-3">
                      <h5>Address Information</h5>
                    </div>
                    <div className="card-body p-3 pb-0">
                      <div className="mb-3">
                        <label className="form-label" htmlFor="address">
                          Address
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter Address"
                          id="address"
                        />
                      </div>
                      <div className="d-block d-xl-flex">
                        <div className="mb-3 flex-fill me-xl-3 me-0">
                          <label className="form-label" htmlFor="country">
                            Country
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Enter Country"
                            id="country"
                          />
                        </div>
                        <div className="mb-3 flex-fill">
                          <label
                            className="form-label"
                            htmlFor="state-province"
                          >
                            State / Province
                          </label>
                          <input
                            type="email"
                            className="form-control"
                            placeholder="Enter State"
                            id="state-province"
                          />
                        </div>
                      </div>
                      <div className="d-block d-xl-flex">
                        <div className="mb-3 flex-fill me-xl-3 me-0">
                          <label className="form-label" htmlFor="city">
                            City
                          </label>
                          <input
                            type="email"
                            className="form-control"
                            placeholder="City"
                            id="city"
                          />
                        </div>
                        <div className="mb-3 flex-fill">
                          <label className="form-label" htmlFor="postal-code">
                            Postal Code
                          </label>
                          <input
                            type="email"
                            className="form-control"
                            placeholder="Enter Postal Code"
                            id="postal-code"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="settings-right-sidebar ms-md-3">
                  <div className="card">
                    <div className="card-header p-3">
                      <h5>Personal Information</h5>
                    </div>
                    <div className="card-body p-3 pb-0">
                      <div className="settings-profile-upload">
                        <span className="profile-pic">
                          <img
                            src="assets/img/profiles/avatar-27.jpg"
                            alt="Profile"
                          />
                        </span>
                        <div className="title-upload">
                          <h5>Edit Your Photo</h5>
                          <a href="#" className="me-2">
                            Delete{" "}
                          </a>
                          <a href="#" className="text-primary">
                            Update
                          </a>
                        </div>
                      </div>
                      <div className="profile-uploader profile-uploader-two">
                        <span className="upload-icon">
                          <i className="ti ti-upload" />
                        </span>
                        <div className="drag-upload-btn mb-0 border-0 pb-0 bg-transparent">
                          <p className="upload-btn">
                            <span>Click to Upload</span> or drag and drop
                          </p>
                          <h6>JPG or PNG</h6>
                          <h6>(Max 450 x 450 px)</h6>
                        </div>
                        <input
                          type="file"
                          className="form-control"
                          multiple
                          id="image_sign"
                        />
                        <div id="frames" />
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

export default ProfileSettings