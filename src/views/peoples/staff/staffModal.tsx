
const StaffModal = () => {
  return (
    <>
  {/* Add Staff */}
  <div className="modal fade" id="add_staff">
    <div className="modal-dialog modal-dialog-centered modal-lg">
      <div className="modal-content">
        <div className="modal-header">
          <h4 className="modal-title">Add Staff</h4>
          <button
            type="button"
            className="btn-close custom-btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          >
            <i className="ti ti-x" />
          </button>
        </div>
        <form className="validated-form" noValidate>
          <div className="modal-body">
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label" htmlFor="employee-name">
                  Employee Name <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  required
                  id="employee-name"
                />
                <div className="invalid-feedback">Enter the employee name.</div>
              </div>
              <div className="col-md-6">
                <label className="form-label" htmlFor="employee-id">
                  Employee ID
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="STF-0000"
                  id="employee-id"
                />
              </div>
              <div className="col-md-6">
                <label className="form-label" htmlFor="department-2">
                  Department
                </label>
                <select className="form-select" id="department-2">
                  <option>Administration</option>
                  <option>Accounts</option>
                  <option>Library</option>
                  <option>Transport</option>
                  <option>Front Office</option>
                  <option>IT Support</option>
                  <option>Housekeeping</option>
                  <option>Security</option>
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label" htmlFor="designation-2">
                  Designation
                </label>
                <select className="form-select" id="designation-2">
                  <option>Admin Officer</option>
                  <option>Accountant</option>
                  <option>Librarian</option>
                  <option>Transport Coordinator</option>
                  <option>Receptionist</option>
                  <option>System Administrator</option>
                  <option>Supervisor</option>
                  <option>Cashier</option>
                  <option>Clerk</option>
                  <option>Security Head</option>
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label" htmlFor="email">
                  Email <span className="text-danger">*</span>
                </label>
                <input
                  type="email"
                  className="form-control"
                  required
                  id="email"
                />
                <div className="invalid-feedback">Enter a valid email.</div>
              </div>
              <div className="col-md-6">
                <label className="form-label" htmlFor="mobile-number">
                  Mobile Number
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="mobile-number"
                />
              </div>
              <div className="col-md-6">
                <label className="form-label" htmlFor="employment-type-2">
                  Employment Type
                </label>
                <select className="form-select" id="employment-type-2">
                  <option>Full Time</option>
                  <option>Part Time</option>
                  <option>Contract</option>
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label" htmlFor="joining-date-2">
                  Joining Date
                </label>
                <div className="input-icon-end position-relative">
                  <input
                    type="text"
                    className="form-control datetimepicker-dmy"
                    placeholder="dd/mm/yyyy"
                    id="joining-date-2"
                  />
                  <span className="input-icon-addon">
                    <i className="ti ti-calendar" />
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-light me-2"
              data-bs-dismiss="modal"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary form-submit"
              data-success="New staff member added."
            >
              Add Staff
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
  {/* /Add Staff */}
  {/* Edit Staff */}
  <div className="modal fade" id="edit_staff">
    <div className="modal-dialog modal-dialog-centered modal-lg">
      <div className="modal-content">
        <div className="modal-header">
          <h4 className="modal-title">Edit Staff</h4>
          <button
            type="button"
            className="btn-close custom-btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          >
            <i className="ti ti-x" />
          </button>
        </div>
        <form className="validated-form" noValidate>
          <div className="modal-body">
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label" htmlFor="employee-name-2">
                  Employee Name <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  defaultValue="Teresa Bru"
                  required
                  id="employee-name-2"
                />
                <div className="invalid-feedback">Enter the employee name.</div>
              </div>
              <div className="col-md-6">
                <label className="form-label" htmlFor="employee-id-2">
                  Employee ID
                </label>
                <input
                  type="text"
                  className="form-control"
                  defaultValue="STF-2001"
                  readOnly
                  id="employee-id-2"
                />
              </div>
              <div className="col-md-6">
                <label className="form-label" htmlFor="department-3">
                  Department
                </label>
                <select className="form-select" id="department-3">
                  <option>Administration</option>
                  <option>Accounts</option>
                  <option>Library</option>
                  <option>Transport</option>
                  <option>Front Office</option>
                  <option>IT Support</option>
                  <option>Housekeeping</option>
                  <option>Security</option>
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label" htmlFor="designation-3">
                  Designation
                </label>
                <select className="form-select" id="designation-3">
                  <option>Admin Officer</option>
                  <option>Accountant</option>
                  <option>Librarian</option>
                  <option>Transport Coordinator</option>
                  <option>Receptionist</option>
                  <option>System Administrator</option>
                  <option>Supervisor</option>
                  <option>Cashier</option>
                  <option>Clerk</option>
                  <option>Security Head</option>
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label" htmlFor="email-2">
                  Email <span className="text-danger">*</span>
                </label>
                <input
                  type="email"
                  className="form-control"
                  defaultValue="teresa.bru@example.com"
                  required
                  id="email-2"
                />
                <div className="invalid-feedback">Enter a valid email.</div>
              </div>
              <div className="col-md-6">
                <label className="form-label" htmlFor="mobile-number-2">
                  Mobile Number
                </label>
                <input
                  type="text"
                  className="form-control"
                  defaultValue="+1 546 8548 801"
                  id="mobile-number-2"
                />
              </div>
              <div className="col-md-6">
                <label className="form-label" htmlFor="employment-type-3">
                  Employment Type
                </label>
                <select className="form-select" id="employment-type-3">
                  <option>Full Time</option>
                  <option>Part Time</option>
                  <option>Contract</option>
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label" htmlFor="joining-date-3">
                  Joining Date
                </label>
                <div className="input-icon-end position-relative">
                  <input
                    type="text"
                    className="form-control datetimepicker-dmy"
                    defaultValue="12/06/2019"
                    id="joining-date-3"
                  />
                  <span className="input-icon-addon">
                    <i className="ti ti-calendar" />
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-light me-2"
              data-bs-dismiss="modal"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary form-submit"
              data-success="Staff details updated."
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
  {/* /Edit Staff */}
  {/* Staff Profile */}
  <div className="modal fade" id="staff_profile">
    <div className="modal-dialog modal-dialog-centered modal-lg">
      <div className="modal-content">
        <div className="modal-header">
          <h4 className="modal-title">Staff Profile</h4>
          <button
            type="button"
            className="btn-close custom-btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          >
            <i className="ti ti-x" />
          </button>
        </div>
        <div className="modal-body">
          <div className="d-flex align-items-center mb-3">
            <span className="avatar avatar-lg me-2 flex-shrink-0">
              <img
                src="assets/img/profiles/avatar-01.jpg"
                className="rounded-circle flex-shrink-0"
                alt="Teresa Bru"
              />
            </span>
            <div>
              <h5 className="mb-0">
                Teresa Bru{" "}
                <span className="dt-pill is-active ms-1">
                  <span className="dt-pill-dot" />
                  Active
                </span>
              </h5>
              <span className="fs-12 text-muted">
                STF-2001 · Admin Officer · Administration
              </span>
            </div>
          </div>
          <div className="row g-3">
            <div className="col-md-6">
              <h6 className="details-heading">
                <i className="ti ti-mail" />
                Contact
              </h6>
              <p className="fs-13 mb-0">
                teresa.bru@example.com · +1 546 8548 801
              </p>
            </div>
            <div className="col-md-6">
              <h6 className="details-heading">
                <i className="ti ti-building" />
                Branch
              </h6>
              <p className="fs-13 mb-0">Main Campus · Full Time.</p>
            </div>
            <div className="col-md-6">
              <h6 className="details-heading">
                <i className="ti ti-user-cog" />
                Reporting Manager
              </h6>
              <p className="fs-13 mb-0">Principal Office.</p>
            </div>
            <div className="col-md-6">
              <h6 className="details-heading">
                <i className="ti ti-briefcase" />
                Experience
              </h6>
              <p className="fs-13 mb-0">MBA · 9 years · Joined 12 Jun 2019.</p>
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <a href="#" className="btn btn-light me-2" data-bs-dismiss="modal">
            Close
          </a>
          <a
            href="#"
            className="btn btn-outline-primary me-2"
            data-bs-toggle="modal"
            data-bs-target="#staff_documents"
          >
            Documents
          </a>
          <a
            href="#"
            className="btn btn-primary"
            data-bs-toggle="modal"
            data-bs-target="#edit_staff"
          >
            Edit Staff
          </a>
        </div>
      </div>
    </div>
  </div>
  {/* /Staff Profile */}
  {/* Department Assignment */}
  <div className="modal fade" id="dept_assign">
    <div className="modal-dialog modal-dialog-centered">
      <div className="modal-content">
        <div className="modal-header">
          <h4 className="modal-title">Department Assignment</h4>
          <button
            type="button"
            className="btn-close custom-btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          >
            <i className="ti ti-x" />
          </button>
        </div>
        <form className="validated-form" noValidate>
          <div className="modal-body">
            <div className="row g-3">
              <div className="col-md-12">
                <label className="form-label" htmlFor="staff">
                  Staff
                </label>
                <input
                  type="text"
                  className="form-control"
                  defaultValue="Teresa Bru — STF-2001"
                  readOnly
                  id="staff"
                />
              </div>
              <div className="col-md-12">
                <label className="form-label" htmlFor="department-4">
                  Department <span className="text-danger">*</span>
                </label>
                <select className="form-select" required id="department-4">
                  <option value="">Select department</option>
                  <option>Administration</option>
                  <option>Accounts</option>
                  <option>Library</option>
                  <option>Transport</option>
                  <option>Front Office</option>
                  <option>IT Support</option>
                  <option>Housekeeping</option>
                  <option>Security</option>
                </select>
                <div className="invalid-feedback">Select a department.</div>
              </div>
              <div className="col-md-6">
                <label className="form-label" htmlFor="designation-4">
                  Designation
                </label>
                <select className="form-select" id="designation-4">
                  <option>Admin Officer</option>
                  <option>Accountant</option>
                  <option>Librarian</option>
                  <option>Transport Coordinator</option>
                  <option>Receptionist</option>
                  <option>System Administrator</option>
                  <option>Supervisor</option>
                  <option>Cashier</option>
                  <option>Clerk</option>
                  <option>Security Head</option>
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label" htmlFor="effective-date">
                  Effective Date
                </label>
                <div className="input-icon-end position-relative">
                  <input
                    type="text"
                    className="form-control datetimepicker-dmy"
                    defaultValue="24/07/2026"
                    id="effective-date"
                  />
                  <span className="input-icon-addon">
                    <i className="ti ti-calendar" />
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-light me-2"
              data-bs-dismiss="modal"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary form-submit"
              data-success="Department assigned to the staff member."
            >
              Assign Department
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
  {/* /Department Assignment */}
  {/* Document Management */}
  <div className="modal fade" id="staff_documents">
    <div className="modal-dialog modal-dialog-centered modal-lg">
      <div className="modal-content">
        <div className="modal-header">
          <h4 className="modal-title">Document Management</h4>
          <button
            type="button"
            className="btn-close custom-btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          >
            <i className="ti ti-x" />
          </button>
        </div>
        <div className="modal-body">
          <div className="table-responsive">
            <table className="table table-nowrap mb-3">
              <thead>
                <tr>
                  <th>Document</th>
                  <th>Reference</th>
                  <th>Uploaded</th>
                  <th>Status</th>
                  <th className="text-end">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <i className="ti ti-id me-1 text-primary" />
                    ID Proof
                  </td>
                  <td>ID-77890123</td>
                  <td>12 Jun 2019</td>
                  <td>
                    <span className="badge badge-soft-success">Verified</span>
                  </td>
                  <td className="text-end">
                    <a
                      href="#"
                      className="dt-ib"
                      title="Download"
                      data-cls-action="export_profile"
                    >
                      <i className="ti ti-download" />
                    </a>
                  </td>
                </tr>
                <tr>
                  <td>
                    <i className="ti ti-file-cv me-1 text-info" />
                    Resume
                  </td>
                  <td>CV-2019-441</td>
                  <td>10 Jun 2019</td>
                  <td>
                    <span className="badge badge-soft-success">Verified</span>
                  </td>
                  <td className="text-end">
                    <a
                      href="#"
                      className="dt-ib"
                      title="Download"
                      data-cls-action="export_profile"
                    >
                      <i className="ti ti-download" />
                    </a>
                  </td>
                </tr>
                <tr>
                  <td>
                    <i className="ti ti-file-text me-1 text-warning" />
                    Employment Contract
                  </td>
                  <td>EMP-2019-0091</td>
                  <td>12 Jun 2019</td>
                  <td>
                    <span className="badge badge-soft-success">Signed</span>
                  </td>
                  <td className="text-end">
                    <a
                      href="#"
                      className="dt-ib"
                      title="Download"
                      data-cls-action="export_profile"
                    >
                      <i className="ti ti-download" />
                    </a>
                  </td>
                </tr>
                <tr>
                  <td>
                    <i className="ti ti-certificate me-1 text-success" />
                    Certificates
                  </td>
                  <td>CRT-MBA-2016</td>
                  <td>12 Jun 2019</td>
                  <td>
                    <span className="badge badge-soft-warning">Pending</span>
                  </td>
                  <td className="text-end">
                    <a
                      href="#"
                      className="dt-ib"
                      title="Download"
                      data-cls-action="export_profile"
                    >
                      <i className="ti ti-download" />
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="stacked-dropdown">
            <i className="ti ti-cloud-upload" />
            <b>Upload a new document</b>
            <span className="fs-12 text-muted">
              PDF, JPG or PNG · max 10 MB
            </span>
            <input type="file" aria-label="Staff document" />
          </div>
        </div>
        <div className="modal-footer">
          <a href="#" className="btn btn-light" data-bs-dismiss="modal">
            Close
          </a>
        </div>
      </div>
    </div>
  </div>
  {/* /Document Management */}
  {/* Attendance Summary */}
  <div className="modal fade" id="attendance_summary">
    <div className="modal-dialog modal-dialog-centered modal-lg">
      <div className="modal-content">
        <div className="modal-header">
          <h4 className="modal-title">Attendance Summary</h4>
          <button
            type="button"
            className="btn-close custom-btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          >
            <i className="ti ti-x" />
          </button>
        </div>
        <div className="modal-body">
          <div className="d-flex flex-wrap gap-2 mb-3">
            <span className="badge badge-soft-success p-2">
              <i className="ti ti-calendar-check me-1" />
              Present 21
            </span>
            <span className="badge badge-soft-danger p-2">
              <i className="ti ti-calendar-x me-1" />
              Absent 1
            </span>
            <span className="badge badge-soft-warning p-2">
              <i className="ti ti-plane-departure me-1" />
              Leave 1
            </span>
            <span className="badge badge-soft-info p-2">
              <i className="ti ti-clock me-1" />
              Late 2
            </span>
          </div>
          <div className="table-responsive">
            <table className="table table-nowrap mb-0">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Check In</th>
                  <th>Check Out</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>22 Jul 2026</td>
                  <td>08:12 AM</td>
                  <td>04:35 PM</td>
                  <td>
                    <span className="badge badge-soft-success">Present</span>
                  </td>
                </tr>
                <tr>
                  <td>21 Jul 2026</td>
                  <td>08:40 AM</td>
                  <td>04:30 PM</td>
                  <td>
                    <span className="badge badge-soft-info">Late</span>
                  </td>
                </tr>
                <tr>
                  <td>20 Jul 2026</td>
                  <td>—</td>
                  <td>—</td>
                  <td>
                    <span className="badge badge-soft-warning">Leave</span>
                  </td>
                </tr>
                <tr>
                  <td>19 Jul 2026</td>
                  <td>08:05 AM</td>
                  <td>04:32 PM</td>
                  <td>
                    <span className="badge badge-soft-success">Present</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="modal-footer">
          <a href="#" className="btn btn-light" data-bs-dismiss="modal">
            Close
          </a>
        </div>
      </div>
    </div>
  </div>
  {/* /Attendance Summary */}
  {/* Performance Details */}
  <div className="modal fade" id="performance_details">
    <div className="modal-dialog modal-dialog-centered">
      <div className="modal-content">
        <div className="modal-header">
          <h4 className="modal-title">Performance Details</h4>
          <button
            type="button"
            className="btn-close custom-btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          >
            <i className="ti ti-x" />
          </button>
        </div>
        <div className="modal-body">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <span className="fs-13 fw-medium">Overall Rating</span>
            <span className="badge badge-soft-success">
              Exceeds Expectations
            </span>
          </div>
          <ul className="list-unstyled fs-13 mb-3">
            <li className="d-flex align-items-center justify-content-between py-2 border-bottom">
              <span className="text-muted">Punctuality</span>
              <span className="fw-medium">4.6 / 5</span>
            </li>
            <li className="d-flex align-items-center justify-content-between py-2 border-bottom">
              <span className="text-muted">Collaboration</span>
              <span className="fw-medium">4.4 / 5</span>
            </li>
            <li className="d-flex align-items-center justify-content-between py-2 border-bottom">
              <span className="text-muted">Task Ownership</span>
              <span className="fw-medium">4.7 / 5</span>
            </li>
            <li className="d-flex align-items-center justify-content-between py-2">
              <span className="text-muted">Last Review</span>
              <span className="fw-medium">Q1 2026</span>
            </li>
          </ul>
          <div className="alert alert-light border mb-0 fs-12" role="note">
            <i className="ti ti-info-circle me-1" />
            Next performance review is due next quarter.
          </div>
        </div>
        <div className="modal-footer">
          <a href="#" className="btn btn-light me-2" data-bs-dismiss="modal">
            Close
          </a>
          <a
            href="#"
            className="btn btn-primary"
            data-bs-toggle="modal"
            data-bs-target="#staff_profile"
          >
            View Profile
          </a>
        </div>
      </div>
    </div>
  </div>
  {/* /Performance Details */}
  {/* Import Staff */}
  <div
    className="modal fade"
    id="staff_import"
    tabIndex={-1}
    aria-hidden="true"
  >
    <div className="modal-dialog modal-dialog-centered">
      <div className="modal-content">
        <div className="modal-header">
          <h4 className="modal-title">Import Staff</h4>
          <button
            type="button"
            className="btn-close custom-btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          >
            <i className="ti ti-x" />
          </button>
        </div>
        <form className="validated-form" noValidate>
          <div className="modal-body">
            <div className="stacked-dropdown mb-3">
              <i className="ti ti-cloud-upload" />
              <b>Drop your CSV or Excel file here</b>
              <span className="fs-12 text-muted">
                or click to browse · max 10 MB
              </span>
              <input type="file" aria-label="Staff file" />
            </div>
            <div className="mb-3">
              <label className="form-label" htmlFor="import-mode">
                Import mode
              </label>
              <select className="form-select" id="import-mode">
                <option>Create new staff</option>
                <option>Update existing by employee ID</option>
                <option>Create and update</option>
              </select>
            </div>
            <div
              className="alert alert-light border d-flex align-items-start gap-2 mb-0"
              role="note"
            >
              <i className="ti ti-download fs-16" />
              <span className="fs-12">
                Not sure about the format? Download the template with all
                required columns and sample rows.
              </span>
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-light me-2"
              data-bs-dismiss="modal"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary form-submit"
              data-success="File queued — 10 staff validated."
            >
              Import
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
  {/* /Import Staff */}
  {/* Delete Modal */}
  <div className="modal fade" id="delete-modal">
    <div className="modal-dialog modal-dialog-centered">
      <div className="modal-content">
        <form action="staffs.html">
          <div className="modal-body text-center">
            <span className="delete-icon">
              <i className="ti ti-trash-x" />
            </span>
            <h4>Confirm Deletion</h4>
            <p>
              You want to delete all the marked items, this cant be undone once
              you delete.
            </p>
            <div className="d-flex justify-content-center">
              <a
                href="#"
                className="btn btn-light me-3"
                data-bs-dismiss="modal"
              >
                Cancel
              </a>
              <button type="submit" className="btn btn-danger">
                Yes, Delete
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
  {/* /Delete Modal */}
</>

  )
}

export default StaffModal