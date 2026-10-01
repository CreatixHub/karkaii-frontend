
const StorageModal = () => {
  return (
   <>
  {/* Connect Sms */}
  <div className="modal fade" id="connect_sms">
    <div className="modal-dialog modal-dialog-centered">
      <div className="modal-content">
        <div className="modal-header">
          <h4 className="modal-title">AWS Settings</h4>
          <button
            type="button"
            className="btn-close custom-btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          >
            <i className="ti ti-x" />
          </button>
        </div>
        <form action="storage.html">
          <div className="modal-body">
            <div className="row">
              <div className="col-md-12">
                <div className="mb-3">
                  <label className="form-label" htmlFor="aws-access-key">
                    AWS Access Key
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter AWS Access Key"
                    id="aws-access-key"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label" htmlFor="secret-key">
                    Secret Key
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter Secret Key"
                    id="secret-key"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label" htmlFor="bucket-name">
                    Bucket Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter Bucket Name"
                    id="bucket-name"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label" htmlFor="region">
                    Region
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter Region"
                    id="region"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label" htmlFor="base-url">
                    Base URL
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter Base URL"
                    id="base-url"
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
                      id="user4"
                      className="check"
                      defaultChecked
                    />
                    <label htmlFor="user4" className="checktoggle">
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
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
  {/* /Connect Sms */}
</>

  )
}

export default StorageModal