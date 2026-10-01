
const TaxRatesModal = () => {
  return (
   <>
  {/* Add Tax Rate */}
  <div className="modal fade" id="add_tax_rate">
    <div className="modal-dialog modal-dialog-centered">
      <div className="modal-content">
        <div className="modal-header">
          <h4 className="modal-title">Add Tax Rate</h4>
          <button
            type="button"
            className="btn-close custom-btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          >
            <i className="ti ti-x" />
          </button>
        </div>
        <form action="tax-rates.html">
          <div className="modal-body">
            <div className="row">
              <div className="col-md-12">
                <div className="mb-3">
                  <label className="form-label" htmlFor="name">
                    Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter Name"
                    id="name"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label" htmlFor="tax-rate">
                    Tax Rate %
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter Tax Rate"
                    id="tax-rate"
                  />
                </div>
                <div className="modal-satus-toggle d-flex align-items-center justify-content-between">
                  <div className="status-title">
                    <h5>Status</h5>
                    <p>Change the Status by toggle </p>
                  </div>
                  <div className="status-toggle modal-status">
                    <input type="checkbox" id="user1" className="check" />
                    <label htmlFor="user1" className="checktoggle">
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
              Add Tax Rate
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
  {/* /Add Tax Rate */}
  {/* Edit Tax Rate */}
  <div className="modal fade" id="edit_tax_rate">
    <div className="modal-dialog modal-dialog-centered">
      <div className="modal-content">
        <div className="modal-header">
          <h4 className="modal-title">Edit Tax Rate</h4>
          <button
            type="button"
            className="btn-close custom-btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          >
            <i className="ti ti-x" />
          </button>
        </div>
        <form action="tax-rates.html">
          <div className="modal-body">
            <div className="row">
              <div className="col-md-12">
                <div className="mb-3">
                  <label className="form-label" htmlFor="name-2">
                    Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter Name"
                    id="name-2"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label" htmlFor="tax-rate-2">
                    Tax Rate %
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter Tax Rate"
                    defaultValue="5%"
                    id="tax-rate-2"
                  />
                </div>
                <div className="modal-satus-toggle d-flex align-items-center justify-content-between">
                  <div className="status-title">
                    <h5>Status</h5>
                    <p>Change the Status by toggle </p>
                  </div>
                  <div className="status-toggle modal-status">
                    <input
                      type="checkbox"
                      id="user2"
                      className="check"
                      defaultChecked
                    />
                    <label htmlFor="user2" className="checktoggle">
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
  {/* /Edit Tax Rate */}
  {/* Delete Modal */}
  <div className="modal fade" id="delete-modal">
    <div className="modal-dialog modal-dialog-centered">
      <div className="modal-content">
        <form action="tax-rates.html">
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

export default TaxRatesModal