const FormWizard = () => {
  return (
    <div>
      <div className="page-wrapper cardhead">

            <div className="content">

              {/* Page Header */}
              <div className="page-header">
                <div className="row">
                  <div className="col-sm-12">
                    <h3 className="page-title">Form Wizard</h3>
                  </div>
                </div>
              </div>
              {/* /Page Header */}

              <div className="row">

                {/* Lightbox */}
                <div className="col-lg-12">
                  <div className="card">
                    <div className="card-header">
                      <h4 className="card-title mb-0">Basic Wizard</h4>
                    </div>
                    <div className="card-body">
                      <div id="basic-pills-wizard" className="twitter-bs-wizard">
                        <ul className="nav nav-tabs twitter-bs-wizard-nav">
                          <li className="nav-item">
                            <a href="javascript:void(0);" className="nav-link border-0" data-bs-toggle="tab" data-bs-target="#seller-details">
                              <div className="step-icon" data-bs-toggle="tooltip" data-bs-placement="top" title="Seller Details">
                                <i className="far fa-user"></i>
                              </div>
                            </a>
                          </li>
                          <li className="nav-item">
                            <a href="javascript:void(0);" className="nav-link border-0" data-bs-toggle="tab" data-bs-target="#company-document">
                              <div className="step-icon" data-bs-toggle="tooltip" data-bs-placement="top" title="Company Document">
                                <i className="fas fa-map-pin"></i>
                              </div>
                            </a>
                          </li>

                          <li className="nav-item">
                            <a href="javascript:void(0);" className="nav-link border-0" data-bs-toggle="tab" data-bs-target="#bank-detail">
                              <div className="step-icon" data-bs-toggle="tooltip" data-bs-placement="top" title="Bank Details">
                                <i className="fas fa-credit-card"></i>
                              </div>
                            </a>
                          </li>
                        </ul>
                        {/* wizard-nav */}

                        <div className="tab-content twitter-bs-wizard-tab-content">
                          <div className="tab-pane show active" id="seller-details">
                            <div className="mb-4">
                              <h5>Enter Your Personal Details</h5>
                            </div>
                            <form>
                              <div className="row">
                                <div className="col-lg-6">
                                  <div className="mb-3">
                                    <label htmlFor="basicpill-firstname-input" className="form-label">First name</label>
                                    <input type="text" className="form-control" id="basicpill-firstname-input" />
                                  </div>
                                </div>
                                <div className="col-lg-6">
                                  <div className="mb-3">
                                    <label htmlFor="basicpill-lastname-input" className="form-label">Last name</label>
                                    <input type="text" className="form-control" id="basicpill-lastname-input" />
                                  </div>
                                </div>
                              </div>

                              <div className="row">
                                <div className="col-lg-6">
                                  <div className="mb-3">
                                    <label htmlFor="basicpill-phoneno-input" className="form-label">Phone</label>
                                    <input type="text" className="form-control" id="basicpill-phoneno-input" />
                                  </div>
                                </div>
                                <div className="col-lg-6">
                                  <div className="mb-3">
                                    <label htmlFor="basicpill-email-input" className="form-label">Email</label>
                                    <input type="email" className="form-control" id="basicpill-email-input" />
                                  </div>
                                </div>
                              </div>
                            </form>
                            <ul className="pager wizard twitter-bs-wizard-pager-link">
                              <li className="next"><a href="javascript: void(0);" className="btn btn-primary">Next <i className="bx bx-chevron-right ms-1"></i></a></li>
                            </ul>
                          </div>
                          {/* tab pane */}
                          <div className="tab-pane fade" id="company-document">
                            <div>
                            <div className="mb-4">
                              <h5>Enter Your Address</h5>
                            </div>
                            <form>
                              <div className="row">
                                <div className="col-lg-6">
                                  <div className="mb-3">
                                    <label htmlFor="basicpill-pancard-input" className="form-label">Address 1</label>
                                    <input type="text" className="form-control" id="basicpill-pancard-input" />
                                  </div>
                                </div>

                                <div className="col-lg-6">
                                  <div className="mb-3">
                                    <label htmlFor="basicpill-vatno-input" className="form-label">Address 2</label>
                                    <input type="text" className="form-control" id="basicpill-vatno-input" />
                                  </div>
                                </div>
                              </div>
                              <div className="row">
                                <div className="col-lg-6">
                                  <div className="mb-3">
                                    <label htmlFor="basicpill-cstno-input" className="form-label">Landmark</label>
                                    <input type="text" className="form-control" id="basicpill-cstno-input" />
                                  </div>
                                </div>

                                <div className="col-lg-6">
                                  <div className="mb-3">
                                    <label htmlFor="basicpill-servicetax-input" className="form-label">Town</label>
                                    <input type="text" className="form-control" id="basicpill-servicetax-input" />
                                  </div>
                                </div>
                              </div>
                            </form>
                            <ul className="pager wizard twitter-bs-wizard-pager-link">
                              <li className="previous"><a href="javascript: void(0);" className="btn btn-primary"><i className="bx bx-chevron-left me-1"></i> Previous</a></li>
                              <li className="next"><a href="javascript: void(0);" className="btn btn-primary">Next <i className="bx bx-chevron-right ms-1"></i></a></li>
                            </ul>
                            </div>
                          </div>
                          {/* tab pane */}
                          <div className="tab-pane fade" id="bank-detail">
                            <div>
                              <div className="mb-4">
                                <h5>Payment Details</h5>
                              </div>
                              <form>
                                <div className="row">
                                  <div className="col-lg-6">
                                    <div className="mb-3">
                                      <label htmlFor="basicpill-namecard-input" className="form-label">Name on Card</label>
                                      <input type="text" className="form-control" id="basicpill-namecard-input" />
                                    </div>
                                  </div>

                                  <div className="col-lg-6">
                                    <div className="mb-3">
                                      <label className="form-label" htmlFor="credit-card-type">Credit Card Type</label>
                                      <select className="form-select" id="credit-card-type">
                                          <option selected>Select Card Type</option>
                                          <option value="AE">American Express</option>
                                          <option value="VI">Visa</option>
                                          <option value="MC">MasterCard</option>
                                          <option value="DI">Discover</option>
                                      </select>
                                    </div>
                                  </div>
                                </div>
                                <div className="row">
                                  <div className="col-lg-6">
                                    <div className="mb-3">
                                      <label htmlFor="basicpill-cardno-input" className="form-label">Credit Card Number</label>
                                      <input type="text" className="form-control" id="basicpill-cardno-input" />
                                    </div>
                                  </div>

                                  <div className="col-lg-6">
                                    <div className="mb-3">
                                      <label htmlFor="basicpill-card-verification-input" className="form-label">Card Verification Number</label>
                                      <input type="text" className="form-control" id="basicpill-card-verification-input" />
                                    </div>
                                  </div>
                                </div>
                                <div className="row">
                                  <div className="col-lg-6">
                                    <div className="mb-3">
                                      <label htmlFor="basicpill-expiration-input" className="form-label">Expiration Date</label>
                                      <input type="text" className="form-control" id="basicpill-expiration-input" />
                                    </div>
                                  </div>
                                </div>
                              </form>
                              <ul className="pager wizard twitter-bs-wizard-pager-link">
                                <li className="previous"><a href="javascript: void(0);" className="btn btn-primary"><i className="bx bx-chevron-left me-1"></i> Previous</a></li>
                                <li className="float-end"><a href="form-wizard.html" className="btn btn-primary">Save
                                    Changes</a></li>
                              </ul>
                            </div>
                          </div>
                          {/* tab pane */}
                        </div>
                        {/* end tab content */}
                      </div>
                    </div>
                    {/* end card body */}
                  </div>
                </div>
                {/* /Wizard */}

              </div>

            </div>

          </div>
    </div>
  );
};

export default FormWizard;
