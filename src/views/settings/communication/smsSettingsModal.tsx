
const SmsSettingsModal = () => {
  return (
    <>
  {/* ===================== REUSABLE SMS CONFIGURATION WORKSPACE ===================== */}
  <div
    className="offcanvas offcanvas-end sms-canvas"
    tabIndex={-1}
    id="sms_workspace"
    aria-labelledby="sms_workspace_label"
    role="region"
  >
    <div className="sms-canvas-head">
      <span className="sms-card-ic">
        <i className="ti ti-building-broadcast-tower" />
      </span>
      <div className="flex-fill overflow-hidden">
        <h3
          className="offcanvas-title mb-1 fs-16 fw-medium"
          id="sms_workspace_label"
        >
          MSG91 — gateway configuration
        </h3>
        <p className="fs-12 text-muted mb-0">
          Default route · transactional · last changed 31 Jul 2026 by Ms. Latha
          Rao
        </p>
      </div>
      <span className="sms-badge is-ok">Connected</span>
      <button
        type="button"
        className="btn-close ms-2"
        data-bs-dismiss="offcanvas"
        aria-label="Close"
      />
    </div>
    <div className="offcanvas-body sms-canvas-body">
      <div className="row g-4">
        <div className="col-xl-7">
          <div className="sms-sect">
            <h4 className="sms-sect-title fs-15 fw-medium">
              <i className="ti ti-file-description" />
              Configuration details
            </h4>
            <div className="sms-line">
              <div className="sms-line-txt">
                <strong>Provider</strong>
                <p>MSG91 · Walkover Web Solutions</p>
              </div>
              <div className="sms-line-ctl" />
            </div>
            <div className="sms-line">
              <div className="sms-line-txt">
                <strong>Route</strong>
                <p>Transactional · domestic India</p>
              </div>
              <div className="sms-line-ctl" />
            </div>
            <div className="sms-line">
              <div className="sms-line-txt">
                <strong>Account</strong>
                <p>PRSK-441229</p>
              </div>
              <div className="sms-line-ctl" />
            </div>
            <div className="sms-line">
              <div className="sms-line-txt">
                <strong>Connected</strong>
                <p>14 Jan 2026 by Mr. R. Venkatesh</p>
              </div>
              <div className="sms-line-ctl" />
            </div>
            <div className="sms-line">
              <div className="sms-line-txt">
                <strong>Throughput</strong>
                <p>30 messages per second</p>
              </div>
              <div className="sms-line-ctl" />
            </div>
            <div className="sms-line">
              <div className="sms-line-txt">
                <strong>Delivery rate</strong>
                <p>98.6% over the last 30 days</p>
              </div>
              <div className="sms-line-ctl" />
            </div>
          </div>
          <div className="sms-sect">
            <h5 className="sms-sect-title fs-15">
              <i className="ti ti-adjustments" />
              Current values
            </h5>
            <div className="sms-line">
              <div className="sms-line-txt">
                <strong>API endpoint</strong>
                <p>https://api.msg91.com/api/v5/flow/</p>
              </div>
              <div className="sms-line-ctl">
                <input
                  type="text"
                  className="sms-input is-mono"
                  defaultValue="https://api.msg91.com/api/v5/flow/"
                  aria-label="Setting value"
                />
              </div>
            </div>
            <div className="sms-line">
              <div className="sms-line-txt">
                <strong>Auth key</strong>
                <p>4188••••••••••A1</p>
              </div>
              <div className="sms-line-ctl">
                <span className="sms-secret">
                  <i className="ti ti-key" />
                  Encrypted
                </span>
              </div>
            </div>
            <div className="sms-line">
              <div className="sms-line-txt">
                <strong>Default sender ID</strong>
                <p>PRSKOL</p>
              </div>
              <div className="sms-line-ctl">
                <select className="sms-select" aria-label="Setting value">
                  <option>PRSKOL</option>
                  <option>PRSKED</option>
                  <option>PRSKOT</option>
                </select>
              </div>
            </div>
            <div className="sms-line">
              <div className="sms-line-txt">
                <strong>Request timeout</strong>
                <p>15 seconds</p>
              </div>
              <div className="sms-line-ctl">
                <input
                  type="text"
                  className="sms-input is-mono"
                  defaultValue={15}
                  aria-label="Setting value"
                />
              </div>
            </div>
            <div className="sms-line">
              <div className="sms-line-txt">
                <strong>Retry attempts</strong>
                <p>3, with backoff</p>
              </div>
              <div className="sms-line-ctl">
                <input
                  type="text"
                  className="sms-input is-mono"
                  defaultValue={3}
                  aria-label="Setting value"
                />
              </div>
            </div>
          </div>
          <div className="sms-sect">
            <h6 className="sms-sect-title">
              <i className="ti ti-device-mobile" />
              How a message arrives
            </h6>
            <div className="row g-3">
              <div className="col-md-6">
                <div className="sms-phone">
                  <span className="sms-phone-from">PRSKOL · today 09:41</span>
                  <div className="sms-bubble">
                    Dear Mrs. Menon, fee of Rs 12,400 for Aarav K is due on 05
                    Aug. Pay at the portal or the counter. - Preskool
                  </div>
                  <span className="sms-phone-time">09:41</span>
                </div>
                <div className="sms-seg mt-2">
                  <span className="sms-seg-track sms-p-70">
                    <span />
                  </span>
                  <span className="sms-seg-n">112/160 · 1 SMS</span>
                </div>
              </div>
              <div className="col-md-6">
                <span className="sms-lbl">Delivery receipt</span>
                <div className="sms-code">
                  id&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;5f2a91c8e4b0
                  <br />
                  status&nbsp;&nbsp;&nbsp;DELIVRD
                  <br />
                  sender&nbsp;&nbsp;&nbsp;PRSKOL
                  <br />
                  segments&nbsp;1
                  <br />
                  elapsed&nbsp;&nbsp;4.02 s
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-5">
          <div className="sms-sect">
            <h6 className="sms-sect-title">
              <i className="ti ti-circle-check" />
              Validation
            </h6>
            <div className="sms-check">
              <i className="ti ti-circle-check" />
              <div>
                Endpoint reachable over HTTPS
                <span>TLS 1.3, certificate valid until 02 Feb 2027.</span>
              </div>
            </div>
            <div className="sms-check">
              <i className="ti ti-circle-check" />
              <div>
                Auth key accepted<span>Verified at 09:41:02 today.</span>
              </div>
            </div>
            <div className="sms-check">
              <i className="ti ti-circle-check" />
              <div>
                Sender ID permitted on this account
                <span>PRSKOL registered against the school’s DLT entity.</span>
              </div>
            </div>
            <div className="sms-check is-warn">
              <i className="ti ti-alert-circle" />
              <div>
                Credits below the alert threshold
                <span>
                  1,84,220 remaining, against a threshold of 2,00,000.
                </span>
              </div>
            </div>
          </div>
          <div className="sms-sect">
            <h6 className="sms-sect-title">
              <i className="ti ti-info-circle" />
              Provider information
            </h6>
            <div className="sms-line">
              <div className="sms-line-txt">
                <strong>Service</strong>
                <p>MSG91 Flow API v5</p>
              </div>
              <div className="sms-line-ctl" />
            </div>
            <div className="sms-line">
              <div className="sms-line-txt">
                <strong>Status page</strong>
                <p>status.msg91.com — no incidents</p>
              </div>
              <div className="sms-line-ctl" />
            </div>
            <div className="sms-line">
              <div className="sms-line-txt">
                <strong>Support</strong>
                <p>Business · 2 hour response</p>
              </div>
              <div className="sms-line-ctl" />
            </div>
            <div className="sms-line">
              <div className="sms-line-txt">
                <strong>Cost this month</strong>
                <p>₹20,196 · 1,12,200 messages</p>
              </div>
              <div className="sms-line-ctl" />
            </div>
          </div>
          <div className="sms-sect">
            <h6 className="sms-sect-title">
              <i className="ti ti-hierarchy-2" />
              Dependencies
            </h6>
            <div className="d-flex align-items-center gap-2 flex-wrap mb-2">
              <span className="badge-meta">
                <i className="ti ti-id-badge-2" />
                Sender IDs
              </span>
              <span className="badge-meta">
                <i className="ti ti-message-2" />
                DLT templates
              </span>
              <span className="badge-meta">
                <i className="ti ti-webhook" />
                Receipt callback
              </span>
              <span className="badge-meta">
                <i className="ti ti-stack-2" />
                Queue worker
              </span>
            </div>
            <p className="fs-12 text-muted mb-0">
              Changing the default route would move 7 notification rules and 10
              templates onto a different provider. Every template would need its
              DLT id re-mapped first, so this is not a switch to make in term
              time.
            </p>
          </div>
          <div className="sms-sect">
            <h6 className="sms-sect-title">
              <i className="ti ti-link" />
              Related settings
            </h6>
            <span className="badge-meta me-1 mb-1">
              <i className="ti ti-route" />
              Priority routing
            </span>
            <span className="badge-meta me-1 mb-1">
              <i className="ti ti-refresh" />
              Retry policy
            </span>
            <span className="badge-meta me-1 mb-1">
              <i className="ti ti-gauge" />
              Daily limits
            </span>
            <span className="badge-meta me-1 mb-1">
              <i className="ti ti-shield-lock" />
              IP allow-list
            </span>
          </div>
          <div className="sms-sect">
            <h6 className="sms-sect-title">
              <i className="ti ti-history" />
              Audit history
            </h6>
            <div className="sms-audit">
              <div className="sms-audit-when">
                <strong>01 Aug 2026</strong>09:41
              </div>
              <div className="sms-audit-what">
                Health check passed<span>System · 214 ms</span>
              </div>
            </div>
            <div className="sms-audit">
              <div className="sms-audit-when">
                <strong>31 Jul 2026</strong>17:20
              </div>
              <div className="sms-audit-what">
                Daily ceiling raised to 25,000<span>Ms. Latha Rao</span>
              </div>
            </div>
            <div className="sms-audit">
              <div className="sms-audit-when">
                <strong>12 Jul 2026</strong>09:15
              </div>
              <div className="sms-audit-what">
                Failover to Twilio armed<span>Mr. R. Venkatesh</span>
              </div>
            </div>
            <div className="sms-audit">
              <div className="sms-audit-when">
                <strong>14 Jan 2026</strong>15:00
              </div>
              <div className="sms-audit-what">
                Gateway connected and set as default
                <span>Mr. R. Venkatesh</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div className="sms-card-foot justify-content-end">
      <button
        type="button"
        className="btn btn-outline-light bg-white"
        data-bs-dismiss="offcanvas"
      >
        Close
      </button>
      <button
        type="button"
        className="btn btn-light d-inline-flex align-items-center"
        data-bs-toggle="modal"
        data-bs-target="#sms_test"
      >
        <i className="ti ti-plug-connected me-1" />
        Test gateway
      </button>
      <button
        type="button"
        className="btn btn-primary d-inline-flex align-items-center"
        data-bs-toggle="modal"
        data-bs-target="#sms_gateway"
      >
        <i className="ti ti-device-floppy me-1" />
        Save configuration
      </button>
    </div>
  </div>
  {/* /Reusable SMS Configuration Workspace */}
  {/* Configure SMS gateway */}
  <div
    className="modal fade"
    id="sms_gateway"
    tabIndex={-1}
    aria-labelledby="sms_gateway_l"
    aria-hidden="true"
    role="region"
  >
    <div className="modal-dialog modal-dialog-centered modal-lg">
      <div className="modal-content">
        <div className="sms-card-head">
          <span className="sms-card-ic">
            <i className="ti ti-router" />
          </span>
          <div className="flex-fill overflow-hidden">
            <h5 className="sms-card-title mb-0" id="sms_gateway_l">
              Configure SMS gateway
            </h5>
            <p>MSG91 · transactional route</p>
          </div>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          />
        </div>
        <div className="modal-body">
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label" htmlFor="g_name">
                Gateway name
              </label>
              <input
                type="text"
                className="form-control"
                id="g_name"
                defaultValue="MSG91 Transactional"
              />
            </div>
            <div className="col-md-6">
              <label className="form-label" htmlFor="g_sender">
                Default sender ID
              </label>
              <select className="form-select" id="g_sender">
                <option>PRSKOL</option>
                <option>PRSKED</option>
                <option>PRSKOT</option>
              </select>
            </div>
            <div className="col-12">
              <label className="form-label" htmlFor="g_url">
                API endpoint
              </label>
              <input
                type="text"
                className="form-control"
                id="g_url"
                defaultValue="https://api.msg91.com/api/v5/flow/"
              />
            </div>
            <div className="col-md-6">
              <label className="form-label" htmlFor="g_auth">
                Authentication
              </label>
              <select className="form-select" id="g_auth">
                <option>Auth key header</option>
                <option>Basic auth</option>
                <option>Bearer token</option>
                <option>HMAC signature</option>
              </select>
            </div>
            <div className="col-md-6">
              <label className="form-label" htmlFor="g_to">
                Request timeout (seconds)
              </label>
              <input
                type="text"
                className="form-control"
                id="g_to"
                defaultValue={15}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label" htmlFor="g_key">
                API key
              </label>
              <input
                type="text"
                className="form-control"
                id="g_key"
                defaultValue="4188••••••••••A1"
              />
            </div>
            <div className="col-md-6">
              <label className="form-label" htmlFor="g_sec">
                API secret
              </label>
              <input
                type="password"
                autoComplete="current-password"
                className="form-control"
                id="g_sec"
                placeholder="Not required by this provider"
              />
            </div>
          </div>
          <p className="fs-12 text-muted mb-0 mt-3">
            Saving runs a connection test first. If the gateway does not answer,
            the previous settings are kept.
          </p>
        </div>
        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-outline-light bg-white"
            data-bs-dismiss="modal"
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-primary"
            data-bs-dismiss="modal"
          >
            Save &amp; test
          </button>
        </div>
      </div>
    </div>
  </div>
  {/* /Configure SMS gateway */}
  {/* Add SMS provider */}
  <div
    className="modal fade"
    id="sms_provider"
    tabIndex={-1}
    aria-labelledby="sms_provider_l"
    aria-hidden="true"
    role="region"
  >
    <div className="modal-dialog modal-dialog-centered">
      <div className="modal-content">
        <div className="sms-card-head">
          <span className="sms-card-ic">
            <i className="ti ti-plug-connected" />
          </span>
          <div className="flex-fill overflow-hidden">
            <h5 className="sms-card-title mb-0" id="sms_provider_l">
              Add SMS provider
            </h5>
            <p>Configured now, made default later</p>
          </div>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          />
        </div>
        <div className="modal-body">
          <div className="mb-3">
            <label className="form-label" htmlFor="p_pv">
              Provider
            </label>
            <select className="form-select" id="p_pv">
              <option>MSG91</option>
              <option>Twilio</option>
              <option>Textlocal</option>
              <option>Vonage</option>
              <option>Plivo</option>
              <option>Clickatell</option>
              <option>AWS SNS</option>
              <option>Custom REST API</option>
            </select>
          </div>
          <div className="mb-3">
            <label className="form-label" htmlFor="p_route">
              Route
            </label>
            <select className="form-select" id="p_route">
              <option>Transactional — domestic</option>
              <option>Promotional — domestic</option>
              <option>International</option>
            </select>
          </div>
          <div className="mb-3">
            <label className="form-label" htmlFor="p_auth">
              Authentication method
            </label>
            <select className="form-select" id="p_auth">
              <option>API key</option>
              <option>Key and secret</option>
              <option>Basic auth</option>
              <option>IAM key</option>
            </select>
          </div>
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              id="p_test"
              defaultChecked
            />
            <label className="form-check-label fs-13" htmlFor="p_test">
              Run a connection test before saving
            </label>
          </div>
          <div className="form-check">
            <input className="form-check-input" type="checkbox" id="p_def" />
            <label className="form-check-label fs-13" htmlFor="p_def">
              Set as the default route immediately
            </label>
          </div>
          <p className="fs-12 text-muted mb-0 mt-2">
            A new provider needs every DLT template id re-mapped before it can
            carry traffic in India.
          </p>
        </div>
        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-outline-light bg-white"
            data-bs-dismiss="modal"
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-primary"
            data-bs-dismiss="modal"
          >
            Add provider
          </button>
        </div>
      </div>
    </div>
  </div>
  {/* /Add SMS provider */}
  {/* Test SMS gateway */}
  <div
    className="modal fade"
    id="sms_test"
    tabIndex={-1}
    aria-labelledby="sms_test_l"
    aria-hidden="true"
    role="region"
  >
    <div className="modal-dialog modal-dialog-centered">
      <div className="modal-content">
        <div className="sms-card-head">
          <span className="sms-card-ic is-ok">
            <i className="ti ti-plug-connected" />
          </span>
          <div className="flex-fill overflow-hidden">
            <h5 className="sms-card-title mb-0" id="sms_test_l">
              Test SMS gateway
            </h5>
            <p>No message is sent</p>
          </div>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          />
        </div>
        <div className="modal-body">
          <p className="fs-13 mb-3">
            The endpoint is called with a balance enquiry rather than a send.
            Nothing reaches a handset and no credit is used.
          </p>
          <div className="sms-code">
            GET https://api.msg91.com/api/v5/balance
            <br />
            authkey: 4188∗∗∗∗∗∗∗∗∗∗A1
            <br />
            <br />
            200 OK · 214 ms
            <br />
            {"{"}
            {"{"} "type": "success", "balance": 184220, "route": "4" {"}"}
            {"}"}
          </div>
          <div className="d-flex align-items-center gap-3 flex-wrap mt-3">
            <span className="sms-badge is-ok">200 OK</span>
            <span className="fs-12 text-muted">
              TLS 1.3 · 214 ms · 1,84,220 credits remaining
            </span>
          </div>
        </div>
        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-outline-light bg-white"
            data-bs-dismiss="modal"
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-primary"
            data-bs-dismiss="modal"
          >
            Run test again
          </button>
        </div>
      </div>
    </div>
  </div>
  {/* /Test SMS gateway */}
  {/* Send test message */}
  <div
    className="modal fade"
    id="sms_sendtest"
    tabIndex={-1}
    aria-labelledby="sms_sendtest_l"
    aria-hidden="true"
    role="region"
  >
    <div className="modal-dialog modal-dialog-centered">
      <div className="modal-content">
        <div className="sms-card-head">
          <span className="sms-card-ic is-ok">
            <i className="ti ti-send" />
          </span>
          <div className="flex-fill overflow-hidden">
            <h5 className="sms-card-title mb-0" id="sms_sendtest_l">
              Send test message
            </h5>
            <p>A real SMS to one number</p>
          </div>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          />
        </div>
        <div className="modal-body">
          <div className="mb-3">
            <label className="form-label" htmlFor="s_to">
              Send to
            </label>
            <input
              type="tel"
              className="form-control"
              id="s_to"
              defaultValue="+91 98765 44710"
            />
          </div>
          <div className="mb-3">
            <label className="form-label" htmlFor="s_tpl">
              Template
            </label>
            <select className="form-select" id="s_tpl">
              <option>Plain gateway test</option>
              <option>OTP Verification</option>
              <option>Fee Reminder</option>
              <option>Attendance Alert</option>
              <option>Exam Result</option>
            </select>
          </div>
          <div className="mb-3">
            <label className="form-label" htmlFor="s_sid">
              Send as
            </label>
            <select className="form-select" id="s_sid">
              <option>PRSKOL — transactional</option>
              <option>PRSKED — promotional</option>
              <option>PRSKOT — OTP</option>
            </select>
          </div>
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              id="s_dlr"
              defaultChecked
            />
            <label className="form-check-label fs-13" htmlFor="s_dlr">
              Wait for the delivery receipt and show the result
            </label>
          </div>
          <p className="fs-12 text-muted mb-0 mt-2">
            A test send uses one credit and appears in the delivery log.
          </p>
        </div>
        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-outline-light bg-white"
            data-bs-dismiss="modal"
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-primary"
            data-bs-dismiss="modal"
          >
            Send test
          </button>
        </div>
      </div>
    </div>
  </div>
  {/* /Send test message */}
  {/* Edit SMS template */}
  <div
    className="modal fade"
    id="sms_template"
    tabIndex={-1}
    aria-labelledby="sms_template_l"
    aria-hidden="true"
    role="region"
  >
    <div className="modal-dialog modal-dialog-centered modal-lg">
      <div className="modal-content">
        <div className="sms-card-head">
          <span className="sms-card-ic">
            <i className="ti ti-message-2" />
          </span>
          <div className="flex-fill overflow-hidden">
            <h5 className="sms-card-title mb-0" id="sms_template_l">
              Edit SMS template
            </h5>
            <p>Fee Reminder · live</p>
          </div>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          />
        </div>
        <div className="modal-body">
          <div className="row g-3">
            <div className="col-md-7">
              <label className="form-label" htmlFor="t_name">
                Template name
              </label>
              <input
                type="text"
                className="form-control"
                id="t_name"
                defaultValue="Fee Reminder"
              />
            </div>
            <div className="col-md-5">
              <label className="form-label" htmlFor="t_sid">
                Sender ID
              </label>
              <select className="form-select" id="t_sid">
                <option>PRSKOL</option>
                <option>PRSKED</option>
                <option>PRSKOT</option>
              </select>
            </div>
            <div className="col-12">
              <label className="form-label" htmlFor="t_body">
                Message body
              </label>
              <textarea
                className="form-control"
                id="t_body"
                rows={4}
                defaultValue={
                  "Dear {guardian}, fee of Rs {amount} for {student} is due on {date}. Pay at the portal or the counter. - Preskool"
                }
              />
            </div>
            <div className="col-md-7">
              <span className="sms-lbl">Placeholders</span>
              <span className="badge-meta me-1">
                {"{"}guardian{"}"}
              </span>
              <span className="badge-meta me-1">
                {"{"}student{"}"}
              </span>
              <span className="badge-meta me-1">
                {"{"}class{"}"}
              </span>
              <span className="badge-meta me-1">
                {"{"}amount{"}"}
              </span>
              <span className="badge-meta me-1">
                {"{"}date{"}"}
              </span>
            </div>
            <div className="col-md-5">
              <span className="sms-lbl">Length</span>
              <div className="sms-seg">
                <span className="sms-seg-track sms-p-95">
                  <span />
                </span>
                <span className="sms-seg-n">152/160 · 1 SMS</span>
              </div>
              <p className="fs-12 text-muted mb-0 mt-2">
                8 characters of headroom. Passing 160 would cost two messages
                each time.
              </p>
            </div>
            <div className="col-12">
              <label className="form-label" htmlFor="t_dlt">
                DLT template id
              </label>
              <input
                type="text"
                className="form-control"
                id="t_dlt"
                defaultValue="6512a9f4d3"
              />
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-outline-light bg-white"
            data-bs-dismiss="modal"
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-primary"
            data-bs-dismiss="modal"
          >
            Save template
          </button>
        </div>
      </div>
    </div>
  </div>
  {/* /Edit SMS template */}
  {/* Export settings */}
  <div
    className="modal fade"
    id="sms_export"
    tabIndex={-1}
    aria-labelledby="sms_export_l"
    aria-hidden="true"
    role="region"
  >
    <div className="modal-dialog modal-dialog-centered">
      <div className="modal-content">
        <div className="sms-card-head">
          <span className="sms-card-ic">
            <i className="ti ti-download" />
          </span>
          <div className="flex-fill overflow-hidden">
            <h5 className="sms-card-title mb-0" id="sms_export_l">
              Export settings
            </h5>
            <p>A snapshot of this configuration</p>
          </div>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          />
        </div>
        <div className="modal-body">
          <div className="mb-3">
            <label className="form-label" htmlFor="e_f">
              Format
            </label>
            <select className="form-select" id="e_f">
              <option>JSON — re-importable</option>
              <option>PDF — for the compliance file</option>
              <option>CSV — settings list only</option>
            </select>
          </div>
          <span className="sms-lbl">Contents</span>
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              id="e_1"
              defaultChecked
            />
            <label className="form-check-label fs-13" htmlFor="e_1">
              Gateway, provider and delivery settings
            </label>
          </div>
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              id="e_2"
              defaultChecked
            />
            <label className="form-check-label fs-13" htmlFor="e_2">
              Templates and notification rules
            </label>
          </div>
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              id="e_3"
              defaultChecked
            />
            <label className="form-check-label fs-13" htmlFor="e_3">
              Sender ID registrations and audit history
            </label>
          </div>
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              id="e_4"
              disabled
            />
            <label className="form-check-label fs-13 text-muted" htmlFor="e_4">
              API keys and secrets — never exported
            </label>
          </div>
        </div>
        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-outline-light bg-white"
            data-bs-dismiss="modal"
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-primary"
            data-bs-dismiss="modal"
          >
            Export
          </button>
        </div>
      </div>
    </div>
  </div>
  {/* /Export settings */}
  {/* Import settings */}
  <div
    className="modal fade"
    id="sms_import"
    tabIndex={-1}
    aria-labelledby="sms_import_l"
    aria-hidden="true"
    role="region"
  >
    <div className="modal-dialog modal-dialog-centered">
      <div className="modal-content">
        <div className="sms-card-head">
          <span className="sms-card-ic">
            <i className="ti ti-upload" />
          </span>
          <div className="flex-fill overflow-hidden">
            <h5 className="sms-card-title mb-0" id="sms_import_l">
              Import settings
            </h5>
            <p>From a file or another school</p>
          </div>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          />
        </div>
        <div className="modal-body">
          <div className="mb-3">
            <label className="form-label" htmlFor="i_s">
              Source
            </label>
            <select className="form-select" id="i_s">
              <option>Configuration file (.json)</option>
              <option>Sunrise Public School</option>
              <option>Riverside Academy</option>
              <option>Previous year — 2025-26</option>
            </select>
          </div>
          <div className="mb-3">
            <label className="form-label" htmlFor="i_f">
              Configuration file
            </label>
            <input type="file" className="form-control" id="i_f" />
          </div>
          <span className="sms-lbl">Include</span>
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              id="i_1"
              defaultChecked
            />
            <label className="form-check-label fs-13" htmlFor="i_1">
              Delivery, routing and retry policies
            </label>
          </div>
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              id="i_2"
              defaultChecked
            />
            <label className="form-check-label fs-13" htmlFor="i_2">
              Templates{" "}
              <span className="text-muted">
                — DLT ids will need re-approval under your own entity
              </span>
            </label>
          </div>
          <div className="form-check">
            <input className="form-check-input" type="checkbox" id="i_3" />
            <label className="form-check-label fs-13" htmlFor="i_3">
              Provider settings{" "}
              <span className="text-muted">
                — credentials are never carried across schools
              </span>
            </label>
          </div>
        </div>
        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-outline-light bg-white"
            data-bs-dismiss="modal"
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-primary"
            data-bs-dismiss="modal"
          >
            Import
          </button>
        </div>
      </div>
    </div>
  </div>
  {/* /Import settings */}
  {/* Verify sender ID */}
  <div
    className="modal fade"
    id="sms_verify"
    tabIndex={-1}
    aria-labelledby="sms_verify_l"
    aria-hidden="true"
    role="region"
  >
    <div className="modal-dialog modal-dialog-centered">
      <div className="modal-content">
        <div className="sms-card-head">
          <span className="sms-card-ic is-warn">
            <i className="ti ti-id-badge-2" />
          </span>
          <div className="flex-fill overflow-hidden">
            <h5 className="sms-card-title mb-0" id="sms_verify_l">
              Verify sender ID
            </h5>
            <p>PRSKEM · awaiting DLT approval</p>
          </div>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          />
        </div>
        <div className="modal-body">
          <p className="fs-13 mb-3">
            A sender ID is six fixed characters registered against the school’s
            principal entity. Approval is granted by the operator, not by this
            system, and usually takes two to five working days.
          </p>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label" htmlFor="v_sid">
                Sender ID
              </label>
              <input
                type="text"
                className="form-control text-uppercase"
                id="v_sid"
                defaultValue="PRSKEM"
                maxLength={6}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label" htmlFor="v_type">
                Type
              </label>
              <select className="form-select" id="v_type">
                <option>Transactional</option>
                <option>Promotional</option>
                <option>Service implicit</option>
              </select>
            </div>
            <div className="col-12">
              <label className="form-label" htmlFor="v_purpose">
                Stated purpose
              </label>
              <textarea
                className="form-control"
                id="v_purpose"
                rows={2}
                defaultValue={
                  "Emergency notices: closures, safety alerts and evacuation instructions to guardians."
                }
              />
            </div>
          </div>
          <div className="d-flex align-items-center gap-2 mt-3">
            <span className="sms-badge is-warn">Submitted 28 Jul</span>
            <span className="fs-12 text-muted">
              Emergency alerts fall back to PRSKOL until approval clears.
            </span>
          </div>
        </div>
        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-outline-light bg-white"
            data-bs-dismiss="modal"
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-primary"
            data-bs-dismiss="modal"
          >
            Check status
          </button>
        </div>
      </div>
    </div>
  </div>
  {/* /Verify sender ID */}
  {/* Reset configuration */}
  <div
    className="modal fade"
    id="sms_reset"
    tabIndex={-1}
    aria-labelledby="sms_reset_l"
    aria-hidden="true"
    role="region"
  >
    <div className="modal-dialog modal-dialog-centered">
      <div className="modal-content">
        <div className="sms-card-head">
          <span className="sms-card-ic is-bad">
            <i className="ti ti-rotate-2" />
          </span>
          <div className="flex-fill overflow-hidden">
            <h5 className="sms-card-title mb-0" id="sms_reset_l">
              Reset configuration
            </h5>
            <p>This disconnects every provider</p>
          </div>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          />
        </div>
        <div className="modal-body">
          <p className="fs-13 mb-3">
            Every SMS setting returns to the template default. Stored
            credentials are cleared and cannot be recovered. Templates, sender
            ID registrations and delivery logs are kept.
          </p>
          <div className="sms-check is-bad">
            <i className="ti ti-alert-triangle" />
            <div>
              8 providers disconnected
              <span>Each will need its credentials entered again.</span>
            </div>
          </div>
          <div className="sms-check is-bad">
            <i className="ti ti-alert-triangle" />
            <div>
              7 notification rules switched off
              <span>
                No automated text leaves until a route is reconnected —
                including OTP, so portal sign-in will fail.
              </span>
            </div>
          </div>
          <div className="sms-check is-warn">
            <i className="ti ti-alert-circle" />
            <div>
              412 queued messages held
              <span>
                They stay in the queue and resume once a route exists.
              </span>
            </div>
          </div>
          <div className="form-check mt-3">
            <input className="form-check-input" type="checkbox" id="r_ok" />
            <label className="form-check-label fs-13" htmlFor="r_ok">
              I understand that OTP delivery stops immediately and guardians
              will not be able to sign in to the portal.
            </label>
          </div>
        </div>
        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-outline-light bg-white"
            data-bs-dismiss="modal"
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-danger"
            data-bs-dismiss="modal"
          >
            Reset configuration
          </button>
        </div>
      </div>
    </div>
  </div>
  {/* /Reset configuration */}
</>

  )
}

export default SmsSettingsModal