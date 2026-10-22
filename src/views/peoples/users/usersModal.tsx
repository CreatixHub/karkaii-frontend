

const UsersModal = () => {
  return (
   <>
  {/* Add / Invite User Modal */}
  <div className="modal fade" id="invite_user" tabIndex={-1} aria-hidden="true">
    <div className="modal-dialog modal-dialog-centered">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">
            <i className="ti ti-square-rounded-plus me-2 text-primary" />
            Add New User
          </h5>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          />
        </div>
        <form action="users.html" className="usr-vform">
          <div className="modal-body">
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label" htmlFor="first-name">
                  First Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter first name"
                  required
                  id="first-name"
                />
              </div>
              <div className="col-md-6">
                <label className="form-label" htmlFor="last-name">
                  Last Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter last name"
                  required
                  id="last-name"
                />
              </div>
              <div className="col-md-12">
                <label className="form-label" htmlFor="email-address">
                  Email Address
                </label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="name@karkaii.com"
                  required
                  id="email-address"
                />
              </div>
              <div className="col-md-6">
                <label className="form-label" htmlFor="role-2">
                  Role
                </label>
                <select className="form-select" required id="role-2">
                  <option value="">Select role</option>
                  <option>Administrator</option>
                  <option>Teacher</option>
                  <option>Student</option>
                  <option>Parent</option>
                  <option>Accountant</option>
                  <option>Librarian</option>
                  <option>Receptionist</option>
                  <option>Transport</option>
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label" htmlFor="branch-2">
                  Branch
                </label>
                <select className="form-select" id="branch-2">
                  <option>Main Campus</option>
                  <option>North Branch</option>
                  <option>South Branch</option>
                  <option>West Branch</option>
                </select>
              </div>
              <div className="col-md-12">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="sendInvite"
                    defaultChecked
                  />
                  <label className="form-check-label" htmlFor="sendInvite">
                    Send an email invitation to set up the account
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-light"
              data-bs-dismiss="modal"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary usr-submit"
              data-success="User added and invitation sent."
            >
              Add User
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
  {/* /Add User Modal */}
  {/* Import Users Modal */}
  <div className="modal fade" id="user_import" tabIndex={-1} aria-hidden="true">
    <div className="modal-dialog modal-dialog-centered">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">
            <i className="ti ti-file-import me-2 text-primary" />
            Import Users
          </h5>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          />
        </div>
        <form action="users.html" className="usr-vform">
          <div className="modal-body">
            <p className="text-muted fs-13">
              Upload a CSV or Excel file to bulk import users. Download the{" "}
              <a href="#">sample template</a> to get started.
            </p>
            <label className="form-label" htmlFor="choose-file">
              Choose file
            </label>
            <input
              type="file"
              className="form-control"
              accept=".csv,.xls,.xlsx"
              required
              id="choose-file"
            />
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-light"
              data-bs-dismiss="modal"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary usr-submit"
              data-success="Users imported successfully."
            >
              Import
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
  {/* /Import Users Modal */}
  {/* Delete Modal */}
  <div className="modal fade" id="delete-modal">
    <div className="modal-dialog modal-dialog-centered">
      <div className="modal-content">
        <form action="users.html">
          <div className="modal-body text-center">
            <span className="delete-icon">
              <i className="ti ti-trash-x" />
            </span>
            <h4>Confirm Deletion</h4>
            <p>
              You want to delete the selected user(s). This action cannot be
              undone once you delete.
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

export default UsersModal