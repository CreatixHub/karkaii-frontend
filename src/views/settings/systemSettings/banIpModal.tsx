
const BanIpModal = () => {
  return (
    <>
  {/* Add Ban Ip */}
  <div className="modal fade" id="add_ban_ip">
    <div className="modal-dialog modal-dialog-centered">
      <div className="modal-content">
        <div className="modal-header">
          <h4 className="modal-title">Add Ban IP Address</h4>
          <button
            type="button"
            className="btn-close custom-btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          >
            <i className="ti ti-x" />
          </button>
        </div>
        <form action="ban-ip-address.html">
          <div className="modal-body">
            <div className="row">
              <div className="col-md-12">
                <div className="mb-3">
                  <label className="col-form-label" htmlFor="ip-address">
                    IP Address
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter IP Address"
                    id="ip-address"
                  />
                </div>
                <div className="mb-0">
                  <label className="col-form-label" htmlFor="reason">
                    Reason
                  </label>
                  <textarea
                    rows={4}
                    className="form-control"
                    placeholder="Add Comment"
                    id="reason"
                    defaultValue={""}
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
              Add IP Address
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
  {/* /Add Ban Ip */}
  {/* Edit Ban Ip */}
  <div className="modal fade" id="edit_ban_ip">
    <div className="modal-dialog modal-dialog-centered">
      <div className="modal-content">
        <div className="modal-header">
          <h4 className="modal-title">Edit Ban IP Address</h4>
          <button
            type="button"
            className="btn-close custom-btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          >
            <i className="ti ti-x" />
          </button>
        </div>
        <form action="ban-ip-address.html">
          <div className="modal-body">
            <div className="row">
              <div className="col-md-12">
                <div className="mb-3">
                  <label className="col-form-label" htmlFor="ip-address-2">
                    IP Address
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter IP Address"
                    defaultValue="198.120.16.01"
                    id="ip-address-2"
                  />
                </div>
                <div className="mb-0">
                  <label className="col-form-label" htmlFor="reason-2">
                    Reason
                  </label>
                  <textarea
                    rows={4}
                    className="form-control"
                    placeholder="Add Comment"
                    id="reason-2"
                    defaultValue={
                      "Temporarily block to protect user accounts from internet fraudsters."
                    }
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
  {/* /Edit Ban Ip */}
  {/* Delete Modal */}
  <div className="modal fade" id="delete-modal">
    <div className="modal-dialog modal-dialog-centered">
      <div className="modal-content">
        <form action="ban-ip-address.html">
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

export default BanIpModal