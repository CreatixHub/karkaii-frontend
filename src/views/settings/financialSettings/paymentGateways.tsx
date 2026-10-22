import { Link } from "react-router-dom";
import { all_routes } from "../../../routes/all_routes";
const PaymentGateways = () => {
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
                <i className="ti ti-plug-connected" />
              </span>
              <span className="stats-compare up">
                <i className="ti ti-arrow-up-right" />
                +12%
              </span>
            </div>
            <h3 className="stats-value mb-0">15</h3>
            <p className="stats-label">Total Gateways</p>
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
                +8%
              </span>
            </div>
            <h3 className="stats-value mb-0">5</h3>
            <p className="stats-label">Connected Gateways</p>
            <div className="stats-bars">
              <i style={{ height: "45%" }} />
              <i className="hi" style={{ height: "65%" }} />
              <i style={{ height: "50%" }} />
              <i className="hi" style={{ height: "80%" }} />
              <i style={{ height: "58%" }} />
              <i className="hi" style={{ height: "70%" }} />
            </div>
          </div>
        </div>
        <div className="col-xl-3 col-sm-6 d-flex">
          <div className="stats-card stats-card-finance stats-warning">
            <div className="stats-top">
              <span className="stats-icon">
                <i className="ti ti-alert-triangle" />
              </span>
              <span className="stats-compare up">
                <i className="ti ti-arrow-up-right" />
                +2%
              </span>
            </div>
            <h3 className="stats-value mb-0">10</h3>
            <p className="stats-label">Not Connected</p>
            <div className="stats-bars">
              <i style={{ height: "35%" }} />
              <i className="hi" style={{ height: "60%" }} />
              <i style={{ height: "48%" }} />
              <i className="hi" style={{ height: "72%" }} />
              <i style={{ height: "52%" }} />
              <i className="hi" style={{ height: "65%" }} />
            </div>
          </div>
        </div>
        <div className="col-xl-3 col-sm-6 d-flex">
          <div className="stats-card stats-card-finance stats-info">
            <div className="stats-top">
              <span className="stats-icon">
                <i className="ti ti-shield-check" />
              </span>
              <span className="stats-compare up">
                <i className="ti ti-arrow-up-right" />
                +3%
              </span>
            </div>
            <h3 className="stats-value mb-0">98%</h3>
            <p className="stats-label">Transaction Success</p>
            <div className="stats-bars">
              <i style={{ height: "50%" }} />
              <i className="hi" style={{ height: "75%" }} />
              <i style={{ height: "60%" }} />
              <i className="hi" style={{ height: "90%" }} />
              <i style={{ height: "65%" }} />
              <i className="hi" style={{ height: "80%" }} />
            </div>
          </div>
        </div>
      </div>
      {/* /Stats Cards */}
      <div className="settings-toptabs mt-3">
        <a
          href="payment-gateways.html"
          className="settings-toptabs-link active"
        >
          <span className="settings-toptabs-ic">
            <i className="ti ti-credit-card" />
          </span>
          Payment Gateway
        </a>
        <a href="tax-rates.html" className="settings-toptabs-link">
          <span className="settings-toptabs-ic">
            <i className="ti ti-receipt-tax" />
          </span>
          Tax Rates
        </a>
      </div>
      <div className="row">
        <div className="col-12">
          <div className="flex-fill">
            <form action="payment-gateways.html">
              <div className="d-flex align-items-center justify-content-between flex-wrap border-bottom pt-3 mb-3">
                <div className="mb-3">
                  <h4 className="mb-1 fs-16 fw-medium">Payment Gateways</h4>
                  <p>Payments Settings Configuration</p>
                </div>
                <div className="mb-3">
                  <a
                    href="email.html"
                    className="btn btn-outline-light bg-white btn-icon me-2"
                  >
                    <i className="ti ti-mail-share" />
                  </a>
                  <button className="btn btn-light me-2" type="button">
                    Cancel
                  </button>
                  <button className="btn btn-primary" type="submit">
                    Save
                  </button>
                </div>
              </div>
              <div className="row">
                <div className="col-xxl-4 col-xl-6 d-flex">
                  <div className="card flex-fill">
                    <div className="card-header d-flex align-items-center justify-content-between border-0 mb-3 pb-0">
                      <span className="d-inline-flex align-items-center justify-content-center border rounded p-2">
                        <img
                          src="assets/img/payment-gateway/payment-gateway-01.svg"
                          alt="Img"
                        />
                      </span>
                      <div className="d-flex align-items-center">
                        <span className="badge bg-transparent-success text-success me-2">
                          Connected
                        </span>
                        <div className="status-toggle modal-status">
                          <input
                            type="checkbox"
                            id="user1"
                            className="check"
                            defaultChecked
                          />
                          <label htmlFor="user1" className="checktoggle">
                            {" "}
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="card-body pt-0">
                      <p>
                        PayPal is the faster, safer way to send and receive
                        money or make an online payment.
                      </p>
                    </div>
                    <div className="card-footer">
                      <a
                        href="#"
                        className="btn btn-outline-light d-flex justify-content-center align-items-center fw-semibold"
                        data-bs-toggle="modal"
                        data-bs-target="#connect_payment"
                      >
                        <i className="ti ti-tool me-2" />
                        View Integration
                      </a>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-4 col-xl-6 d-flex">
                  <div className="card flex-fill">
                    <div className="card-header d-flex align-items-center justify-content-between border-0 mb-3 pb-0">
                      <span className="d-inline-flex align-items-center justify-content-center border rounded p-2">
                        <img
                          src="assets/img/payment-gateway/payment-gateway-02.svg"
                          alt="Img"
                        />
                      </span>
                      <div className="d-flex align-items-center">
                        <span className="badge bg-transparent-dark text-dark me-2">
                          Not Connected
                        </span>
                        <div className="status-toggle modal-status">
                          <input type="checkbox" id="user2" className="check" />
                          <label htmlFor="user2" className="checktoggle">
                            {" "}
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="card-body pt-0">
                      <p>
                        APIs to accept credit cards, manage subscriptions, send
                        money.
                      </p>
                    </div>
                    <div className="card-footer">
                      <a
                        href="#"
                        className="btn btn-outline-light d-flex justify-content-center align-items-center fw-semibold"
                        data-bs-toggle="modal"
                        data-bs-target="#connect_payment"
                      >
                        <i className="ti ti-tool me-2" />
                        Connect Now
                      </a>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-4 col-xl-6 d-flex">
                  <div className="card flex-fill">
                    <div className="card-header d-flex align-items-center justify-content-between border-0 mb-3 pb-0">
                      <span className="d-inline-flex align-items-center justify-content-center border rounded p-2">
                        <img
                          src="assets/img/payment-gateway/payment-gateway-03.svg"
                          alt="Img"
                        />
                      </span>
                      <div className="d-flex align-items-center">
                        <span className="badge bg-transparent-dark text-dark me-2">
                          Not Connected
                        </span>
                        <div className="status-toggle modal-status">
                          <input type="checkbox" id="user3" className="check" />
                          <label htmlFor="user3" className="checktoggle">
                            {" "}
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="card-body pt-0">
                      <p>
                        Braintree offers more fraud protection and security
                        features.
                      </p>
                    </div>
                    <div className="card-footer">
                      <a
                        href="#"
                        className="btn btn-outline-light d-flex justify-content-center align-items-center fw-semibold"
                        data-bs-toggle="modal"
                        data-bs-target="#connect_payment"
                      >
                        <i className="ti ti-tool me-2" />
                        Connect Now
                      </a>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-4 col-xl-6 d-flex">
                  <div className="card flex-fill">
                    <div className="card-header d-flex align-items-center justify-content-between border-0 mb-3 pb-0">
                      <span className="d-inline-flex align-items-center justify-content-center border rounded p-2">
                        <img
                          src="assets/img/payment-gateway/payment-gateway-04.svg"
                          alt="Img"
                        />
                      </span>
                      <div className="d-flex align-items-center">
                        <span className="badge bg-transparent-dark text-dark me-2">
                          Not Connected
                        </span>
                        <div className="status-toggle modal-status">
                          <input type="checkbox" id="user4" className="check" />
                          <label htmlFor="user4" className="checktoggle">
                            {" "}
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="card-body pt-0">
                      <p>
                        Works stably and reliably and features are valuable and
                        necessary for any software.
                      </p>
                    </div>
                    <div className="card-footer">
                      <a
                        href="#"
                        className="btn btn-outline-light d-flex justify-content-center align-items-center fw-semibold"
                        data-bs-toggle="modal"
                        data-bs-target="#connect_payment"
                      >
                        <i className="ti ti-tool me-2" />
                        Connect Now
                      </a>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-4 col-xl-6 d-flex">
                  <div className="card flex-fill">
                    <div className="card-header d-flex align-items-center justify-content-between border-0 mb-3 pb-0">
                      <span className="d-inline-flex align-items-center justify-content-center border rounded p-2">
                        <img
                          src="assets/img/payment-gateway/payment-gateway-05.svg"
                          alt="Img"
                        />
                      </span>
                      <div className="d-flex align-items-center">
                        <span className="badge bg-transparent-success text-success me-2">
                          Connected
                        </span>
                        <div className="status-toggle modal-status">
                          <input
                            type="checkbox"
                            id="user5"
                            className="check"
                            defaultChecked
                          />
                          <label htmlFor="user5" className="checktoggle">
                            {" "}
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="card-body pt-0">
                      <p>
                        Razorpay is a comprehensive payment gateway and
                        financial solutions provider in India.
                      </p>
                    </div>
                    <div className="card-footer">
                      <a
                        href="#"
                        className="btn btn-outline-light d-flex justify-content-center align-items-center fw-semibold"
                        data-bs-toggle="modal"
                        data-bs-target="#connect_payment"
                      >
                        <i className="ti ti-tool me-2" />
                        View Integration
                      </a>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-4 col-xl-6 d-flex">
                  <div className="card flex-fill">
                    <div className="card-header d-flex align-items-center justify-content-between border-0 mb-3 pb-0">
                      <span className="d-inline-flex align-items-center justify-content-center border rounded p-2">
                        <img
                          src="assets/img/payment-gateway/payment-gateway-06.svg"
                          alt="Img"
                        />
                      </span>
                      <div className="d-flex align-items-center">
                        <span className="badge bg-transparent-dark text-dark me-2">
                          Not Connected
                        </span>
                        <div className="status-toggle modal-status">
                          <input type="checkbox" id="user6" className="check" />
                          <label htmlFor="user6" className="checktoggle">
                            {" "}
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="card-body pt-0">
                      <p>
                        Allows send international money transfers and payments
                        quickly with low fees.
                      </p>
                    </div>
                    <div className="card-footer">
                      <a
                        href="#"
                        className="btn btn-outline-light d-flex justify-content-center align-items-center fw-semibold"
                        data-bs-toggle="modal"
                        data-bs-target="#connect_payment"
                      >
                        <i className="ti ti-tool me-2" />
                        Connect Now
                      </a>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-4 col-xl-6 d-flex">
                  <div className="card flex-fill">
                    <div className="card-header d-flex align-items-center justify-content-between border-0 mb-3 pb-0">
                      <span className="d-inline-flex align-items-center justify-content-center border rounded p-2">
                        <img
                          src="assets/img/payment-gateway/payment-gateway-07.svg"
                          alt="Img"
                        />
                      </span>
                      <div className="d-flex align-items-center">
                        <span className="badge bg-transparent-dark text-dark me-2">
                          Not Connected
                        </span>
                        <div className="status-toggle modal-status">
                          <input type="checkbox" id="user7" className="check" />
                          <label htmlFor="user7" className="checktoggle">
                            {" "}
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="card-body pt-0">
                      <p>
                        Replaces your physical cards and cash with an easier,
                        safer, more private and secure{" "}
                      </p>
                    </div>
                    <div className="card-footer">
                      <a
                        href="#"
                        className="btn btn-outline-light d-flex justify-content-center align-items-center fw-semibold"
                        data-bs-toggle="modal"
                        data-bs-target="#connect_payment"
                      >
                        <i className="ti ti-tool me-2" />
                        Connect Now
                      </a>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-4 col-xl-6 d-flex">
                  <div className="card flex-fill">
                    <div className="card-header d-flex align-items-center justify-content-between border-0 mb-3 pb-0">
                      <span className="d-inline-flex align-items-center justify-content-center border rounded p-2">
                        <img
                          src="assets/img/payment-gateway/payment-gateway-08.svg"
                          alt="Img"
                        />
                      </span>
                      <div className="d-flex align-items-center">
                        <span className="badge bg-transparent-dark text-dark me-2">
                          Not Connected
                        </span>
                        <div className="status-toggle modal-status">
                          <input type="checkbox" id="user8" className="check" />
                          <label htmlFor="user8" className="checktoggle">
                            {" "}
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="card-body pt-0">
                      <p>
                        Fast, Low-Cost Solution for your International Business.
                      </p>
                    </div>
                    <div className="card-footer">
                      <a
                        href="#"
                        className="btn btn-outline-light d-flex justify-content-center align-items-center fw-semibold"
                        data-bs-toggle="modal"
                        data-bs-target="#connect_payment"
                      >
                        <i className="ti ti-tool me-2" />
                        Connect Now
                      </a>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-4 col-xl-6 d-flex">
                  <div className="card flex-fill">
                    <div className="card-header d-flex align-items-center justify-content-between border-0 mb-3 pb-0">
                      <span className="d-inline-flex align-items-center justify-content-center border rounded p-2">
                        <img
                          src="assets/img/payment-gateway/payment-gateway-09.svg"
                          alt="Img"
                        />
                      </span>
                      <div className="d-flex align-items-center">
                        <span className="badge bg-transparent-success text-success me-2">
                          Connected
                        </span>
                        <div className="status-toggle modal-status">
                          <input
                            type="checkbox"
                            id="user9"
                            className="check"
                            defaultChecked
                          />
                          <label htmlFor="user9" className="checktoggle">
                            {" "}
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="card-body pt-0">
                      <p>
                        Provide payment solution to individuals to make payments
                        using credit card.
                      </p>
                    </div>
                    <div className="card-footer">
                      <a
                        href="#"
                        className="btn btn-outline-light d-flex justify-content-center align-items-center fw-semibold"
                        data-bs-toggle="modal"
                        data-bs-target="#connect_payment"
                      >
                        <i className="ti ti-tool me-2" />
                        View Integration
                      </a>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-4 col-xl-6 d-flex">
                  <div className="card flex-fill">
                    <div className="card-header d-flex align-items-center justify-content-between border-0 mb-3 pb-0">
                      <span className="d-inline-flex align-items-center justify-content-center border rounded p-2">
                        <img
                          src="assets/img/payment-gateway/payment-gateway-10.svg"
                          alt="Img"
                        />
                      </span>
                      <div className="d-flex align-items-center">
                        <span className="badge bg-transparent-dark text-dark me-2">
                          Not Connected
                        </span>
                        <div className="status-toggle modal-status">
                          <input
                            type="checkbox"
                            id="user10"
                            className="check"
                          />
                          <label htmlFor="user10" className="checktoggle">
                            {" "}
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="card-body pt-0">
                      <p>
                        Paytm stands for Pay through mobile and it is India's
                        largest mobile payments.
                      </p>
                    </div>
                    <div className="card-footer">
                      <a
                        href="#"
                        className="btn btn-outline-light d-flex justify-content-center align-items-center fw-semibold"
                        data-bs-toggle="modal"
                        data-bs-target="#connect_payment"
                      >
                        <i className="ti ti-tool me-2" />
                        Connect Now
                      </a>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-4 col-xl-6 d-flex">
                  <div className="card flex-fill">
                    <div className="card-header d-flex align-items-center justify-content-between border-0 mb-3 pb-0">
                      <span className="d-inline-flex align-items-center justify-content-center border rounded p-2">
                        <img
                          src="assets/img/payment-gateway/payment-gateway-11.svg"
                          alt="Img"
                        />
                      </span>
                      <div className="d-flex align-items-center">
                        <span className="badge bg-transparent-success text-success me-2">
                          Connected
                        </span>
                        <div className="status-toggle modal-status">
                          <input
                            type="checkbox"
                            id="user11"
                            className="check"
                            defaultChecked
                          />
                          <label htmlFor="user11" className="checktoggle">
                            {" "}
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="card-body pt-0">
                      <p>
                        Online payment platform that enables to send and receive
                        money via emails.
                      </p>
                    </div>
                    <div className="card-footer">
                      <a
                        href="#"
                        className="btn btn-outline-light d-flex justify-content-center align-items-center fw-semibold"
                        data-bs-toggle="modal"
                        data-bs-target="#connect_payment"
                      >
                        <i className="ti ti-tool me-2" />
                        View Integration
                      </a>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-4 col-xl-6 d-flex">
                  <div className="card flex-fill">
                    <div className="card-header d-flex align-items-center justify-content-between border-0 mb-3 pb-0">
                      <span className="d-inline-flex align-items-center justify-content-center border rounded p-2">
                        <img
                          src="assets/img/payment-gateway/payment-gateway-12.svg"
                          alt="Img"
                        />
                      </span>
                      <div className="d-flex align-items-center">
                        <span className="badge bg-transparent-dark text-dark me-2">
                          Not Connected
                        </span>
                        <div className="status-toggle modal-status">
                          <input
                            type="checkbox"
                            id="user12"
                            className="check"
                          />
                          <label htmlFor="user12" className="checktoggle">
                            {" "}
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="card-body pt-0">
                      <p>
                        Midtrans provides the maximum number of payment methods
                        across payment gateways.
                      </p>
                    </div>
                    <div className="card-footer">
                      <a
                        href="#"
                        className="btn btn-outline-light d-flex justify-content-center align-items-center fw-semibold"
                        data-bs-toggle="modal"
                        data-bs-target="#connect_payment"
                      >
                        <i className="ti ti-tool me-2" />
                        Connect Now
                      </a>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-4 col-xl-6 d-flex">
                  <div className="card flex-fill">
                    <div className="card-header d-flex align-items-center justify-content-between border-0 mb-3 pb-0">
                      <span className="d-inline-flex align-items-center justify-content-center border rounded p-2">
                        <img
                          src="assets/img/payment-gateway/payment-gateway-13.svg"
                          alt="Img"
                        />
                      </span>
                      <div className="d-flex align-items-center">
                        <span className="badge bg-transparent-success text-success me-2">
                          Connected
                        </span>
                        <div className="status-toggle modal-status">
                          <input
                            type="checkbox"
                            id="user13"
                            className="check"
                            defaultChecked
                          />
                          <label htmlFor="user13" className="checktoggle">
                            {" "}
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="card-body pt-0">
                      <p>
                        PyTorch is a network through which your customers
                        transfer funds to you.
                      </p>
                    </div>
                    <div className="card-footer">
                      <a
                        href="#"
                        className="btn btn-outline-light d-flex justify-content-center align-items-center fw-semibold"
                        data-bs-toggle="modal"
                        data-bs-target="#connect_payment"
                      >
                        <i className="ti ti-tool me-2" />
                        View Integration
                      </a>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-4 col-xl-6 d-flex">
                  <div className="card flex-fill">
                    <div className="card-header d-flex align-items-center justify-content-between border-0 mb-3 pb-0">
                      <span className="d-inline-flex align-items-center justify-content-center border rounded p-2">
                        <img
                          src="assets/img/payment-gateway/payment-gateway-14.svg"
                          alt="Img"
                        />
                      </span>
                      <div className="d-flex align-items-center">
                        <span className="badge bg-transparent-dark text-dark me-2">
                          Not Connected
                        </span>
                        <div className="status-toggle modal-status">
                          <input
                            type="checkbox"
                            id="user14"
                            className="check"
                          />
                          <label htmlFor="user14" className="checktoggle">
                            {" "}
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="card-body pt-0">
                      <p>
                        Direct transfer of funds from one bank account into
                        another.
                      </p>
                    </div>
                    <div className="card-footer">
                      <a
                        href="#"
                        className="btn btn-outline-light d-flex justify-content-center align-items-center fw-semibold"
                        data-bs-toggle="modal"
                        data-bs-target="#connect_payment"
                      >
                        <i className="ti ti-tool me-2" />
                        Connect Now
                      </a>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-4 col-xl-6 d-flex">
                  <div className="card flex-fill">
                    <div className="card-header d-flex align-items-center justify-content-between border-0 mb-3 pb-0">
                      <span className="d-inline-flex align-items-center justify-content-center border rounded p-2">
                        <img
                          src="assets/img/payment-gateway/payment-gateway-15.svg"
                          alt="Img"
                        />
                      </span>
                      <div className="d-flex align-items-center">
                        <span className="badge bg-transparent-dark text-dark me-2">
                          Not Connected
                        </span>
                        <div className="status-toggle modal-status">
                          <input
                            type="checkbox"
                            id="user15"
                            className="check"
                          />
                          <label htmlFor="user15" className="checktoggle">
                            {" "}
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="card-body pt-0">
                      <p>
                        Indicating that goods must be paid for at the time of
                        delivery.{" "}
                      </p>
                    </div>
                    <div className="card-footer">
                      <a
                        href="#"
                        className="btn btn-outline-light d-flex justify-content-center align-items-center fw-semibold"
                        data-bs-toggle="modal"
                        data-bs-target="#connect_payment"
                      >
                        <i className="ti ti-tool me-2" />
                        Connect Now
                      </a>
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

export default PaymentGateways