import { Link } from "react-router-dom";
import { all_routes } from "../../../routes/all_routes";
const TaxRates = () => {
  return (
   <>
  {/* Page Wrapper */}
  <div className="page-wrapper settings-profile">
    <div className="content bg-white content-two">
      <div className="d-md-flex d-block align-items-center justify-content-between border-bottom pb-3">
        <div className="my-auto mb-2">
          <h3 className="page-title mb-1">Financial Settings</h3>
          <nav>
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item">
                <Link to={all_routes.adminDashboard}>Dashboard</Link>
              </li>
              <li className="breadcrumb-item">
                <a href="javascript:void(0);">Settings</a>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Financial Settings
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
          <div className="stats-card stats-card-finance stats-primary">
            <div className="stats-top">
              <span className="stats-icon">
                <i className="ti ti-report-money" />
              </span>
              <span className="stats-compare up">
                <i className="ti ti-arrow-up-right" />
                +2.0%
              </span>
            </div>
            <h3 className="stats-value mb-0">4</h3>
            <p className="stats-label">Total Tax Rates</p>
            <div className="stats-bars">
              <i style={{ height: "40%" }} />
              <i className="hi" style={{ height: "70%" }} />
              <i style={{ height: "55%" }} />
              <i className="hi" style={{ height: "85%" }} />
              <i style={{ height: "60%" }} />
              <i className="hi" style={{ height: "75%" }} />
            </div>
          </div>
        </div>
        <div className="col-xl-3 col-sm-6 d-flex">
          <div className="stats-card stats-card-finance stats-success">
            <div className="stats-top">
              <span className="stats-icon">
                <i className="ti ti-checks" />
              </span>
              <span className="stats-compare up">
                <i className="ti ti-arrow-up-right" />
                +1.5%
              </span>
            </div>
            <h3 className="stats-value mb-0">3</h3>
            <p className="stats-label">Active Rates</p>
            <div className="stats-bars">
              <i style={{ height: "40%" }} />
              <i className="hi" style={{ height: "70%" }} />
              <i style={{ height: "55%" }} />
              <i className="hi" style={{ height: "85%" }} />
              <i style={{ height: "60%" }} />
              <i className="hi" style={{ height: "75%" }} />
            </div>
          </div>
        </div>
        <div className="col-xl-3 col-sm-6 d-flex">
          <div className="stats-card stats-card-finance stats-warning">
            <div className="stats-top">
              <span className="stats-icon">
                <i className="ti ti-percentage" />
              </span>
              <span className="stats-compare up">
                <i className="ti ti-arrow-up-right" />
                +0.0%
              </span>
            </div>
            <h3 className="stats-value mb-0">16%</h3>
            <p className="stats-label">Highest Rate</p>
            <div className="stats-bars">
              <i style={{ height: "40%" }} />
              <i className="hi" style={{ height: "70%" }} />
              <i style={{ height: "55%" }} />
              <i className="hi" style={{ height: "85%" }} />
              <i style={{ height: "60%" }} />
              <i className="hi" style={{ height: "75%" }} />
            </div>
          </div>
        </div>
        <div className="col-xl-3 col-sm-6 d-flex">
          <div className="stats-card stats-card-finance stats-info">
            <div className="stats-top">
              <span className="stats-icon">
                <i className="ti ti-clock" />
              </span>
              <span className="stats-compare up">
                <i className="ti ti-arrow-up-right" />
                +0.8%
              </span>
            </div>
            <h3 className="stats-value mb-0">1</h3>
            <p className="stats-label">Pending Review</p>
            <div className="stats-bars">
              <i style={{ height: "40%" }} />
              <i className="hi" style={{ height: "70%" }} />
              <i style={{ height: "55%" }} />
              <i className="hi" style={{ height: "85%" }} />
              <i style={{ height: "60%" }} />
              <i className="hi" style={{ height: "75%" }} />
            </div>
          </div>
        </div>
      </div>
      {/* /Stats Cards */}
      <div className="settings-toptabs mt-3">
        <a href="payment-gateways.html" className="settings-toptabs-link">
          <span className="settings-toptabs-ic">
            <i className="ti ti-credit-card" />
          </span>
          Payment Gateway
        </a>
        <a href="tax-rates.html" className="settings-toptabs-link active">
          <span className="settings-toptabs-ic">
            <i className="ti ti-receipt-tax" />
          </span>
          Tax Rates
        </a>
      </div>
      <div className="row">
        <div className="col-12">
          <div className="flex-fill">
            <form action="tax-rates.html">
              <div className="d-flex align-items-center justify-content-between flex-wrap border-bottom pt-3 mb-3">
                <div className="mb-3">
                  <h4 className="mb-1 fs-16 fw-medium">Tax Rates</h4>
                  <p>Tax Rates Configuration</p>
                </div>
                <div className="mb-3">
                  <a
                    href="#"
                    className="btn btn-outline-light bg-white btn-icon me-2"
                    data-bs-toggle="modal"
                    data-bs-target="#add_tax_rate"
                  >
                    <i className="ti ti-plus" />
                  </a>
                  <button className="btn btn-light me-2" type="button">
                    Cancel
                  </button>
                  <button className="btn btn-primary" type="submit">
                    Save
                  </button>
                </div>
              </div>
              <div className="d-md-flex">
                <div className="flex-fill">
                  <div className="row">
                    <div className="col-xxl-4 col-lg-6">
                      <div className="mb-3">
                        <label className="form-label" htmlFor="vat">
                          VAT
                        </label>
                        <div className="position-relative">
                          <input
                            type="text"
                            className="form-control pe-5"
                            defaultValue="16%"
                            id="vat"
                          />
                          <div className="d-flex align-items-center position-absolute end-0 top-0 me-2 mt-2">
                            <a
                              href="#"
                              data-bs-toggle="modal"
                              data-bs-target="#edit_tax_rate"
                            >
                              <i className="ti ti-edit me-2" />
                            </a>
                            <a
                              href="#"
                              data-bs-toggle="modal"
                              data-bs-target="#delete-modal"
                            >
                              <i className="ti ti-trash" />
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-xxl-4 col-lg-6">
                      <div className="mb-3">
                        <label className="form-label" htmlFor="gst">
                          GST
                        </label>
                        <div className="position-relative">
                          <input
                            type="text"
                            className="form-control"
                            defaultValue="14%"
                            id="gst"
                          />
                          <div className="d-flex align-items-center position-absolute end-0 top-0 me-2 mt-2">
                            <a
                              href="#"
                              data-bs-toggle="modal"
                              data-bs-target="#edit_tax_rate"
                            >
                              <i className="ti ti-edit me-2" />
                            </a>
                            <a
                              href="#"
                              data-bs-toggle="modal"
                              data-bs-target="#delete-modal"
                            >
                              <i className="ti ti-trash" />
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-xxl-4 col-lg-6">
                      <div className="mb-3">
                        <label className="form-label" htmlFor="hst">
                          HST
                        </label>
                        <div className="position-relative">
                          <input
                            type="text"
                            className="form-control"
                            defaultValue="12%"
                            id="hst"
                          />
                          <div className="d-flex align-items-center position-absolute end-0 top-0 me-2 mt-2">
                            <a
                              href="#"
                              data-bs-toggle="modal"
                              data-bs-target="#edit_tax_rate"
                            >
                              <i className="ti ti-edit me-2" />
                            </a>
                            <a
                              href="#"
                              data-bs-toggle="modal"
                              data-bs-target="#delete-modal"
                            >
                              <i className="ti ti-trash" />
                            </a>
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
  </div>
  {/* /Page Wrapper */}
</>

  )
}

export default TaxRates