

const DepartmentsModal = () => {
  return (
    <>
  {/* Assign Staff Modal */}
  <div className="modal fade" id="assign_staff">
    <div className="modal-dialog modal-dialog-centered modal-lg">
      <div className="modal-content">
        <div className="modal-header">
          <h4 className="modal-title">Assign Staff</h4>
          <button
            type="button"
            className="btn-close custom-btn-close"
            data-bs-dismiss="modal"
          >
            <i className="ti ti-x" />
          </button>
        </div>
        <form action="departments.html">
          <div className="modal-body">
            <div className="row">
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label" htmlFor="department">
                    Department
                  </label>
                  <select className="select" id="department">
                    <option>Admin</option>
                    <option>Finance</option>
                    <option>Academic</option>
                  </select>
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label" htmlFor="role">
                    Role
                  </label>
                  <select className="select" id="role">
                    <option>Head of Department</option>
                    <option>Coordinator</option>
                    <option>Member</option>
                  </select>
                </div>
              </div>
              <div className="col-md-12">
                <div className="mb-0">
                  <label className="form-label" htmlFor="select-staff">
                    Select Staff
                  </label>
                  <select
                    className="select select2"
                    multiple
                    id="select-staff"
                  >
                    <option>Teresa Susan</option>
                    <option>John Doe</option>
                    <option>Hellana Robert</option>
                    <option>Morgan Lee</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <a href="#" className="btn btn-light me-2" data-bs-dismiss="modal">
              Cancel
            </a>
            <button type="submit" className="btn btn-primary">
              Assign
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
  {/* /Assign Staff Modal */}
  {/* Assign Subjects Modal */}
  <div className="modal fade" id="assign_subjects">
    <div className="modal-dialog modal-dialog-centered modal-lg">
      <div className="modal-content">
        <div className="modal-header">
          <h4 className="modal-title">Assign Subjects</h4>
          <button
            type="button"
            className="btn-close custom-btn-close"
            data-bs-dismiss="modal"
          >
            <i className="ti ti-x" />
          </button>
        </div>
        <form action="departments.html">
          <div className="modal-body">
            <div className="mb-3">
              <label className="form-label" htmlFor="department-2">
                Department
              </label>
              <select className="select" id="department-2">
                <option>Academic</option>
                <option>Sports</option>
                <option>Guidance</option>
              </select>
            </div>
            <div className="mb-0">
              <label className="form-label" htmlFor="select-subjects">
                Select Subjects
              </label>
              <select
                className="select select2"
                multiple
                id="select-subjects"
              >
                <option>Mathematics</option>
                <option>Physics</option>
                <option>Chemistry</option>
                <option>English</option>
                <option>Computer Science</option>
              </select>
            </div>
          </div>
          <div className="modal-footer">
            <a href="#" className="btn btn-light me-2" data-bs-dismiss="modal">
              Cancel
            </a>
            <button type="submit" className="btn btn-primary">
              Assign
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
  {/* /Assign Subjects Modal */}
  {/* Department Details Modal */}
  <div className="modal fade" id="department_details">
    <div className="modal-dialog modal-dialog-centered modal-lg">
      <div className="modal-content">
        <div className="modal-header">
          <h4 className="modal-title">Department Details</h4>
          <button
            type="button"
            className="btn-close custom-btn-close"
            data-bs-dismiss="modal"
          >
            <i className="ti ti-x" />
          </button>
        </div>
        <div className="modal-body">
          <div className="d-flex align-items-center mb-3 pb-3 border-bottom">
            <span className="avatar avatar-lg bg-primary-transparent text-primary rounded me-3">
              <i className="ti ti-shield-cog fs-24" />
            </span>
            <div>
              <div className="d-flex align-items-center gap-2">
                <h5 className="mb-0">Admin</h5>
                <span className="badge bg-primary-transparent text-primary">
                  D757248
                </span>
                <span className="badge badge-soft-success">Active</span>
              </div>
              <p className="mb-0 text-muted fs-13">
                Oversees institutional administration, records and compliance.
              </p>
            </div>
          </div>
          <ul className="list-unstyled mb-0">
            <li className="d-flex justify-content-between py-1 fs-13">
              <span className="text-muted">Head of Department</span>
              <span className="text-dark">Kevin Larry</span>
            </li>
            <li className="d-flex justify-content-between py-1 fs-13">
              <span className="text-muted">Contact</span>
              <span className="text-dark">+1 46548 84400</span>
            </li>
            <li className="d-flex justify-content-between py-1 fs-13">
              <span className="text-muted">Location</span>
              <span className="text-dark">Block A, Ground Floor</span>
            </li>
            <li className="d-flex justify-content-between py-1 fs-13">
              <span className="text-muted">Established</span>
              <span className="text-dark">12 Jan 2015</span>
            </li>
            <li className="d-flex justify-content-between py-1 fs-13">
              <span className="text-muted">Total Employees</span>
              <span className="text-dark">24</span>
            </li>
            <li className="d-flex justify-content-between py-1 fs-13">
              <span className="text-muted">Office Extension</span>
              <span className="text-dark">Ext. 101</span>
            </li>
            <li className="d-flex justify-content-between py-1 fs-13">
              <span className="text-muted">Department Email</span>
              <span className="text-dark">admin@preskool.com</span>
            </li>
          </ul>
        </div>
        <div className="modal-footer">
          <a href="#" className="btn btn-light me-2" data-bs-dismiss="modal">
            Close
          </a>
          <button
            type="button"
            className="btn btn-primary"
            data-bs-toggle="modal"
            data-bs-target="#edit_department"
          >
            <i className="ti ti-edit me-1" />
            Edit Department
          </button>
        </div>
      </div>
    </div>
  </div>
  {/* /Department Details Modal */}
  {/* Add Department */}
  <div className="modal fade" id="add_department">
    <div className="modal-dialog modal-dialog-centered">
      <div className="modal-content">
        <div className="modal-header">
          <h4 className="modal-title">Add Department</h4>
          <button
            type="button"
            className="btn-close custom-btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          >
            <i className="ti ti-x" />
          </button>
        </div>
        <form action="departments.html">
          <div className="modal-body">
            <div className="row">
              <div className="col-md-12">
                <div className="mb-3">
                  <label className="form-label" htmlFor="department-name">
                    Department Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="department-name"
                  />
                </div>
              </div>
              <div className="d-flex align-items-center justify-content-between">
                <div className="status-title">
                  <h5>Status</h5>
                  <p>Change the Status by toggle </p>
                </div>
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    role="switch"
                    id="switch-sm"
                    aria-label="Toggle option"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <a href="#" className="btn btn-light me-2" data-bs-dismiss="modal">
              Cancel
            </a>
            <button type="submit" className="btn btn-primary">
              Add Department
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
  {/* Add Department */}
  {/* Edit Department */}
  <div className="modal fade" id="edit_department">
    <div className="modal-dialog modal-dialog-centered">
      <div className="modal-content">
        <div className="modal-header">
          <h4 className="modal-title">Edit Department</h4>
          <button
            type="button"
            className="btn-close custom-btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          >
            <i className="ti ti-x" />
          </button>
        </div>
        <form action="departments.html">
          <div className="modal-body">
            <div className="row">
              <div className="col-md-12">
                <div className="mb-3">
                  <label className="form-label" htmlFor="department-name-2">
                    Department Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter Department Name"
                    defaultValue="Admin"
                    id="department-name-2"
                  />
                </div>
              </div>
              <div className="d-flex align-items-center justify-content-between">
                <div className="status-title">
                  <h5>Status</h5>
                  <p>Change the Status by toggle </p>
                </div>
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    role="switch"
                    id="switch-sm2"
                    aria-label="Toggle option"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <a href="#" className="btn btn-light me-2" data-bs-dismiss="modal">
              Cancel
            </a>
            <button type="submit" className="btn btn-primary">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
  {/* Edit Department */}
  {/* Delete Modal */}
  <div className="modal fade" id="delete-modal">
    <div className="modal-dialog modal-dialog-centered">
      <div className="modal-content">
        <form action="departments.html">
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

export default DepartmentsModal