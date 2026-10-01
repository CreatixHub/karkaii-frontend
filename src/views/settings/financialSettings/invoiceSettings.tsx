import { Link } from "react-router-dom";
import { all_routes } from "../../../routes/all_routes";
const InvoiceSettings = () => {
  return (
   <>
  {/* Page Wrapper */}
  <div className="page-wrapper settings-profile">
    <div className="content bg-white content-two">
      <div className="d-md-flex d-block align-items-center justify-content-between border-bottom pb-3">
        <div className="my-auto mb-2">
          <h3 className="page-title mb-1">App Settings</h3>
          <nav>
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item">
                <Link to={all_routes.adminDashboard}>Dashboard</Link>
              </li>
              <li className="breadcrumb-item">
                <a href="javascript:void(0);">Settings</a>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                App Settings
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
                <i className="ti ti-receipt" />
              </span>
              <span className="stats-compare up">
                <i className="ti ti-arrow-up-right" />
                +8%
              </span>
            </div>
            <h3 className="stats-value mb-0">1,248</h3>
            <p className="stats-label">Total Invoices</p>
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
                <i className="ti ti-currency-dollar" />
              </span>
              <span className="stats-compare up">
                <i className="ti ti-arrow-up-right" />
                +12%
              </span>
            </div>
            <h3 className="stats-value mb-0">$86,420</h3>
            <p className="stats-label">Total Collected</p>
            <div className="stats-bars">
              <i style={{ height: "45%" }} />
              <i className="hi" style={{ height: "65%" }} />
              <i style={{ height: "50%" }} />
              <i className="hi" style={{ height: "90%" }} />
              <i style={{ height: "58%" }} />
              <i className="hi" style={{ height: "80%" }} />
            </div>
          </div>
        </div>
        <div className="col-xl-3 col-sm-6 d-flex">
          <div className="stats-card stats-card-finance stats-warning">
            <div className="stats-top">
              <span className="stats-icon">
                <i className="ti ti-clock-hour-4" />
              </span>
              <span className="stats-compare up">
                <i className="ti ti-arrow-up-right" />
                +0.4%
              </span>
            </div>
            <h3 className="stats-value mb-0">$4,150</h3>
            <p className="stats-label">Pending Amount</p>
            <div className="stats-bars">
              <i style={{ height: "35%" }} />
              <i className="hi" style={{ height: "60%" }} />
              <i style={{ height: "48%" }} />
              <i className="hi" style={{ height: "72%" }} />
              <i style={{ height: "52%" }} />
              <i className="hi" style={{ height: "68%" }} />
            </div>
          </div>
        </div>
        <div className="col-xl-3 col-sm-6 d-flex">
          <div className="stats-card stats-card-finance stats-info">
            <div className="stats-top">
              <span className="stats-icon">
                <i className="ti ti-alert-triangle" />
              </span>
              <span className="stats-compare down">
                <i className="ti ti-arrow-down-right" />
                -3.4%
              </span>
            </div>
            <h3 className="stats-value mb-0">$1,320</h3>
            <p className="stats-label">Overdue</p>
            <div className="stats-bars">
              <i style={{ height: "30%" }} />
              <i className="hi" style={{ height: "55%" }} />
              <i style={{ height: "42%" }} />
              <i className="hi" style={{ height: "78%" }} />
              <i style={{ height: "48%" }} />
              <i className="hi" style={{ height: "65%" }} />
            </div>
          </div>
        </div>
      </div>
      {/* /Stats Cards */}
      <div className="settings-toptabs mt-3">
        <a
          href="invoice-settings.html"
          className="settings-toptabs-link active"
        >
          <span className="settings-toptabs-ic">
            <i className="ti ti-file-invoice" />
          </span>
          Invoice Settings
        </a>
        <a href="custom-fields.html" className="settings-toptabs-link">
          <span className="settings-toptabs-ic">
            <i className="ti ti-forms" />
          </span>
          Custom Fields
        </a>
      </div>
      <div className="row">
        <div className="col-12">
          <div className="flex-fill">
            <form action="invoice-settings.html">
              <div className="d-flex align-items-center justify-content-between flex-wrap border-bottom pt-3 mb-3">
                <div className="mb-3">
                  <h4 className="mb-1 fs-16 fw-medium">Invoice Settings</h4>
                  <p>Collection of settings for Invoice</p>
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
                <div className="row flex-fill">
                  <div className="col-xl-10">
                    <div className="settings-middle-info invoice-setting-wrap">
                      <div className="row align-items-center mb-2">
                        <div className="col-xxl-7 col-lg-6">
                          <div className="invoice-info-title">
                            <h5 className="fs-15">Invoice Logo</h5>
                            <p>
                              Upload logo of you company to display in Invoice
                            </p>
                          </div>
                        </div>
                        <div className="col-xxl-5 col-lg-6">
                          <div className="card">
                            <div className="card-body">
                              <div className="d-flex justify-content-between mb-3">
                                <div className="d-flex align-items-center">
                                  <span className="avatar avatar-xl border rounded d-flex align-items-center justify-content-center p-2 me-2">
                                    <img
                                      src="assets/img/logo-small.svg"
                                      alt="Img"
                                    />
                                  </span>
                                  <h5>Logo</h5>
                                </div>
                                <div className="d-flex align-items-center">
                                  <a
                                    href="javascript:void(0);"
                                    className="text-primary border rounded fs-16 p-1 badge badge-primary-hover me-2"
                                  >
                                    <i className="ti ti-edit-circle" />
                                  </a>
                                  <a
                                    href="javascript:void(0);"
                                    className="text-danger border rounded fs-16 p-1 badge badge-danger-hover"
                                  >
                                    <i className="ti ti-trash-x" />
                                  </a>
                                </div>
                              </div>
                              <div className="profile-uploader profile-uploader-two mb-0">
                                <span className="d-block text-center lh-1 fs-24 mb-1">
                                  <i className="ti ti-upload" />
                                </span>
                                <div className="drag-upload-btn bg-transparent me-0 border-0">
                                  <p className="fs-12 mb-2">
                                    <span className="text-primary">
                                      Click to Upload
                                    </span>{" "}
                                    or drag and drop
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
                      <div className="d-flex align-items-center justify-content-between flex-wrap border mb-3 p-3 pb-0 rounded">
                        <div className="row align-items-center flex-fill">
                          <div className="col-xxl-7 col-lg-6">
                            <div className="mb-3">
                              <h6>Invoice Prefix</h6>
                              <p>Add prefix to your Invoice</p>
                            </div>
                          </div>
                          <div className="col-xxl-5 col-lg-6">
                            <div className="mb-3">
                              <input type="text" className="form-control" />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="d-flex align-items-center justify-content-between flex-wrap border mb-3 p-3 pb-0 rounded">
                        <div className="row align-items-center flex-fill">
                          <div className="col-xxl-7 col-lg-6">
                            <div className="mb-3">
                              <h6>Invoice Due</h6>
                              <p>Select due date to display in Invoice </p>
                            </div>
                          </div>
                          <div className="col-xxl-5 col-lg-6">
                            <div className="mb-3 d-flex align-items-center">
                              <div className="w-100">
                                <select className="select" aria-label="5">
                                  <option>5</option>
                                  <option>4</option>
                                  <option>3</option>
                                </select>
                              </div>
                              <span className="ms-3 d-block">Days</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="d-flex align-items-center justify-content-between flex-wrap border mb-3 p-3 pb-0 rounded">
                        <div className="row align-items-center flex-fill">
                          <div className="col-xxl-7 col-lg-6">
                            <div className="mb-3">
                              <h6>Invoice Round Off</h6>
                              <p>Value round off in invoice</p>
                            </div>
                          </div>
                          <div className="col-xxl-5 col-lg-6">
                            <div className="mb-3 d-flex align-items-center">
                              <div className="w-100">
                                <select
                                  className="select"
                                  aria-label="Roundoff Up"
                                >
                                  <option>Roundoff Up</option>
                                  <option>Roundoff Up</option>
                                </select>
                              </div>
                              <div className="status-toggle modal-status ms-3">
                                <input
                                  type="checkbox"
                                  id="user1"
                                  className="check"
                                />
                                <label htmlFor="user1" className="checktoggle">
                                  {" "}
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="d-flex align-items-center justify-content-between flex-wrap border mb-3 p-3 pb-0 rounded">
                        <div className="row align-items-center flex-fill">
                          <div className="col-xxl-7 col-lg-6">
                            <div className="mb-3">
                              <h6>Show Company Details</h6>
                              <p>Show/hide company details in invoice</p>
                            </div>
                          </div>
                          <div className="col-xxl-5 col-lg-6">
                            <div className="mb-3">
                              <div className="status-toggle modal-status">
                                <input
                                  type="checkbox"
                                  id="user2"
                                  className="check"
                                />
                                <label htmlFor="user2" className="checktoggle">
                                  {" "}
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="d-flex align-items-center justify-content-between flex-wrap border mb-3 p-3 pb-0 rounded">
                        <div className="row align-items-center flex-fill">
                          <div className="col-xxl-7 col-lg-6">
                            <div className="mb-3">
                              <h6>Invoice Header Terms</h6>
                              <p>Header Terms</p>
                            </div>
                          </div>
                          <div className="col-xxl-5 col-lg-6">
                            <div className="mb-3">
                              <textarea
                                rows={4}
                                className="form-control"
                                placeholder="Add Comment"
                                aria-label="Add Comment"
                                defaultValue={""}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="d-flex align-items-center justify-content-between flex-wrap border mb-3 p-3 pb-0 rounded">
                        <div className="row align-items-center flex-fill">
                          <div className="col-xxl-7 col-lg-6">
                            <div className="mb-3">
                              <h6>Invoice Footer Terms</h6>
                              <p>Footer Terms</p>
                            </div>
                          </div>
                          <div className="col-xxl-5 col-lg-6">
                            <div className="mb-3">
                              <textarea
                                rows={4}
                                className="form-control"
                                placeholder="Add Comment"
                                aria-label="Add Comment"
                                defaultValue={""}
                              />
                            </div>
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

export default InvoiceSettings