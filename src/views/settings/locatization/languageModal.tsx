
const LanguageModal = () => {
  return (
    <>
  {/* Add Language */}
  <div className="modal fade" id="add_language">
    <div className="modal-dialog modal-dialog-centered">
      <div className="modal-content">
        <div className="modal-header">
          <h4 className="modal-title">Add Language</h4>
          <button
            type="button"
            className="btn-close custom-btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          >
            <i className="ti ti-x" />
          </button>
        </div>
        <form action="language.html">
          <div className="modal-body">
            <div className="row">
              <div className="col-md-12">
                <div className="mb-3">
                  <label className="form-label" htmlFor="language-name">
                    Language Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter Language Name"
                    id="language-name"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label" htmlFor="code-2">
                    Code
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter Code"
                    id="code-2"
                  />
                </div>
                <div className="modal-satus-toggle d-flex align-items-center justify-content-between mb-3">
                  <div className="status-title">
                    <h5>RTL</h5>
                    <p>Change the Status by toggle </p>
                  </div>
                  <div className="status-toggle modal-status">
                    <input type="checkbox" id="user5" className="check" />
                    <label htmlFor="user5" className="checktoggle">
                      {" "}
                    </label>
                  </div>
                </div>
                <div className="modal-satus-toggle d-flex align-items-center justify-content-between">
                  <div className="status-title">
                    <h5>Status</h5>
                    <p>Change the Status by toggle </p>
                  </div>
                  <div className="status-toggle modal-status">
                    <input type="checkbox" id="user6" className="check" />
                    <label htmlFor="user6" className="checktoggle">
                      {" "}
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <a href="#" className="btn btn-light me-2" data-bs-dismiss="modal">
              Cancel
            </a>
            <button type="submit" className="btn btn-primary">
              Add Language
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
  {/* /Add Language */}
  {/* Edit Language */}
  <div className="modal fade" id="edit_language">
    <div className="modal-dialog modal-dialog-centered">
      <div className="modal-content">
        <div className="modal-header">
          <h4 className="modal-title">Edit Language</h4>
          <button
            type="button"
            className="btn-close custom-btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          >
            <i className="ti ti-x" />
          </button>
        </div>
        <form action="language.html">
          <div className="modal-body">
            <div className="row">
              <div className="col-md-12">
                <div className="mb-3">
                  <label className="form-label" htmlFor="language-name-2">
                    Language Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter Language Name"
                    defaultValue="English"
                    id="language-name-2"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label" htmlFor="code-3">
                    Code
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter Code"
                    defaultValue="en"
                    id="code-3"
                  />
                </div>
                <div className="modal-satus-toggle d-flex align-items-center justify-content-between mb-3">
                  <div className="status-title">
                    <h5>RTL</h5>
                    <p>Change the Status by toggle </p>
                  </div>
                  <div className="status-toggle modal-status">
                    <input
                      type="checkbox"
                      id="user7"
                      className="check"
                      defaultChecked
                    />
                    <label htmlFor="user7" className="checktoggle">
                      {" "}
                    </label>
                  </div>
                </div>
                <div className="modal-satus-toggle d-flex align-items-center justify-content-between">
                  <div className="status-title">
                    <h5>Status</h5>
                    <p>Change the Status by toggle </p>
                  </div>
                  <div className="status-toggle modal-status">
                    <input
                      type="checkbox"
                      id="user8"
                      className="check"
                      defaultChecked
                    />
                    <label htmlFor="user8" className="checktoggle">
                      {" "}
                    </label>
                  </div>
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
  {/* /Edit Language */}
  {/* Language Setup */}
  <div className="modal fade" id="language_setup">
    <div className="modal-dialog modal-dialog-centered  modal-xl">
      <div className="modal-content">
        <div className="modal-header">
          <h4 className="modal-title">Language Setup</h4>
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
          {/* Table Filter */}
          <div className="d-flex align-items-center justify-content-between flex-wrap">
            <div className="d-flex align-items-center">
              <h5 className="mb-3 me-2">Search Criteria</h5>
              <div className="dropdown mb-3 me-2">
                <a
                  href="javascript:void(0);"
                  className="btn btn-outline-light bg-white dropdown-toggle"
                  data-bs-toggle="dropdown"
                  data-bs-auto-close="outside"
                >
                  <i className="ti ti-filter me-2" />
                  Filter
                </a>
                <div className="dropdown-menu drop-width">
                  <form action="language.html">
                    <div className="d-flex align-items-center border-bottom p-3">
                      <h4>Filter</h4>
                    </div>
                    <div className="p-3 pb-0 border-bottom">
                      <div className="row">
                        <div className="col-md-12">
                          <div className="mb-3">
                            <label
                              className="form-label"
                              htmlFor="select-language"
                            >
                              Select Language
                            </label>
                            <select className="select" id="select-language">
                              <option>English</option>
                              <option>Arabic</option>
                              <option>Chinese</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="p-3 d-flex align-items-center justify-content-end">
                      <a href="#" className="btn btn-light me-3">
                        Reset
                      </a>
                      <button type="submit" className="btn btn-primary">
                        Apply
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
            <div className="dropdown mb-3">
              <a
                href="javascript:void(0);"
                className="btn btn-outline-light bg-white dropdown-toggle"
                data-bs-toggle="dropdown"
              >
                <i className="ti ti-sort-ascending-2 me-2" />
                Sort by A-Z
              </a>
              <ul className="dropdown-menu p-3">
                <li>
                  <a
                    href="javascript:void(0);"
                    className="dropdown-item rounded-1 active"
                  >
                    Ascending
                  </a>
                </li>
                <li>
                  <a
                    href="javascript:void(0);"
                    className="dropdown-item rounded-1"
                  >
                    Descending
                  </a>
                </li>
                <li>
                  <a
                    href="javascript:void(0);"
                    className="dropdown-item rounded-1"
                  >
                    Recently Viewed
                  </a>
                </li>
                <li>
                  <a
                    href="javascript:void(0);"
                    className="dropdown-item rounded-1"
                  >
                    Recently Added
                  </a>
                </li>
              </ul>
            </div>
          </div>
          {/* /Table Filter */}
          <div className="table-responsive">
            <div className="custom-table language-setup-table">
              <table className="table">
                <thead>
                  <tr>
                    <th>Default Phrases</th>
                    <th>Change Phrases</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Description</td>
                    <td>
                      <input
                        type="text"
                        className="form-control"
                        defaultValue="Text"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>Description</td>
                    <td>
                      <input
                        type="text"
                        className="form-control"
                        defaultValue="Text"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>Description</td>
                    <td>
                      <input
                        type="text"
                        className="form-control"
                        defaultValue="Text"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>Description</td>
                    <td>
                      <input
                        type="text"
                        className="form-control"
                        defaultValue="Text"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>Description</td>
                    <td>
                      <input
                        type="text"
                        className="form-control"
                        defaultValue="Text"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>Description</td>
                    <td>
                      <input
                        type="text"
                        className="form-control"
                        defaultValue="Text"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>Description</td>
                    <td>
                      <input
                        type="text"
                        className="form-control"
                        defaultValue="Text"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>Description</td>
                    <td>
                      <input
                        type="text"
                        className="form-control"
                        defaultValue="Text"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>Description</td>
                    <td>
                      <input
                        type="text"
                        className="form-control"
                        defaultValue="Text"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>Description</td>
                    <td>
                      <input
                        type="text"
                        className="form-control"
                        defaultValue="Text"
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
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
      </div>
    </div>
  </div>
  {/* /Language Setup */}
  {/* Import File */}
  <div className="modal fade" id="import_file">
    <div className="modal-dialog modal-dialog-centered">
      <div className="modal-content">
        <div className="modal-header">
          <h4 className="modal-title">Import Files</h4>
          <button
            type="button"
            className="btn-close custom-btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          >
            <i className="ti ti-x" />
          </button>
        </div>
        <form action="language.html">
          <div className="modal-body">
            <div className="row">
              <div className="col-md-12">
                <div className="mb-3">
                  <label className="form-label" htmlFor="module-name">
                    Module Name
                  </label>
                  <select className="select" id="module-name">
                    <option>Select</option>
                    <option>Students</option>
                    <option>Parents</option>
                    <option>Teachers</option>
                  </select>
                </div>
                <div className="mb-0">
                  <label className="form-label" htmlFor="language-2">
                    Language
                  </label>
                  <select className="select" id="language-2">
                    <option>Select</option>
                    <option>English</option>
                    <option>Arabic</option>
                    <option>Chinese</option>
                    <option>Hindi</option>
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
              Import
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
  {/* /Import File */}
  {/* Delete Modal */}
  <div className="modal fade" id="delete-modal">
    <div className="modal-dialog modal-dialog-centered">
      <div className="modal-content">
        <form action="language.html">
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
                href="javascript:void(0);"
                className="btn btn-light me-2"
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

export default LanguageModal