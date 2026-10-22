
const PaymentGatewaysModal = () => {
  return (
    <>
  {/* Add Payment Gateway */}
  <div className="modal fade" id="connect_payment">
    <div className="modal-dialog modal-dialog-centered">
      <div className="modal-content">
        <div className="modal-header">
          <h4 className="modal-title">Paypal</h4>
          <button
            type="button"
            className="btn-close custom-btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          >
            <i className="ti ti-x" />
          </button>
        </div>
        <form action="payment-gateways.html">
          <div className="modal-body">
            <div className="row">
              <div className="col-md-12">
                <div className="mb-3">
                  <label className="form-label" htmlFor="email-address">
                    Email Address
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter Email Address"
                    id="email-address"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label" htmlFor="api-key">
                    API Key
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter API Key"
                    id="api-key"
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
                <div className="modal-satus-toggle d-flex align-items-center justify-content-between">
                  <div className="status-title">
                    <h5>Status</h5>
                    <p>Change the Status by toggle </p>
                  </div>
                  <div className="status-toggle modal-status">
                    <input
                      type="checkbox"
                      id="user16"
                      className="check"
                      defaultChecked
                    />
                    <label htmlFor="user16" className="checktoggle">
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
  {/* /Add Payment Gateway */}
</>

  )
}

export default PaymentGatewaysModal