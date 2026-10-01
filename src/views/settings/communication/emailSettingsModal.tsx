
const EmailSettingsModal = () => {
  return (
    <>
  {/* ===================== REUSABLE EMAIL CONFIGURATION WORKSPACE ===================== */}
  <div
    className="offcanvas offcanvas-end eml-canvas"
    tabIndex={-1}
    id="eml_workspace"
    aria-labelledby="eml_workspace_label"
    role="region"
  >
    <div className="eml-canvas-head">
      <span className="eml-panel-ic">
        <i className="ti ti-server-2" />
      </span>
      <div className="flex-fill overflow-hidden">
        <h5 className="offcanvas-title mb-1" id="eml_workspace_label">
          Amazon SES — provider configuration
        </h5>
        <p className="fs-12 mb-0">
          Default provider · ap-south-1 · last changed 11 Jun 2026 by Ms. Latha
          Rao
        </p>
      </div>
      <span className="eml-badge is-ok">Healthy</span>
      <button
        type="button"
        className="btn-close ms-2"
        data-bs-dismiss="offcanvas"
        aria-label="Close"
      />
    </div>
    <div className="offcanvas-body eml-canvas-body">
      <div className="row g-4">
        <div className="col-xl-7">
          <div className="eml-sect">
            <h6 className="eml-sect-title">
              <i className="ti ti-file-description" />
              Configuration details
            </h6>
            <div className="eml-hdr">
              <span className="eml-hdr-key">Provider</span>
              <span className="eml-hdr-val">Amazon Simple Email Service</span>
              <span className="eml-hdr-ctl" />
            </div>
            <div className="eml-hdr">
              <span className="eml-hdr-key">Region</span>
              <span className="eml-hdr-val">ap-south-1 · Mumbai</span>
              <span className="eml-hdr-ctl" />
            </div>
            <div className="eml-hdr">
              <span className="eml-hdr-key">Account</span>
              <span className="eml-hdr-val">4471-2290-8814</span>
              <span className="eml-hdr-ctl" />
            </div>
            <div className="eml-hdr">
              <span className="eml-hdr-key">Connected</span>
              <span className="eml-hdr-val">11 Jun 2026 by Ms. Latha Rao</span>
              <span className="eml-hdr-ctl" />
            </div>
            <div className="eml-hdr">
              <span className="eml-hdr-key">Sending quota</span>
              <span className="eml-hdr-val">
                60,000 per day · 14 per second
              </span>
              <span className="eml-hdr-ctl" />
            </div>
            <div className="eml-hdr">
              <span className="eml-hdr-key">Reputation</span>
              <span className="eml-hdr-val">
                Bounce 0.31% · complaint 0.02%
              </span>
              <span className="eml-hdr-ctl" />
            </div>
          </div>
          <div className="eml-sect">
            <h6 className="eml-sect-title">
              <i className="ti ti-adjustments" />
              Current values
            </h6>
            <div className="eml-hdr">
              <span className="eml-hdr-key">Host</span>
              <span className="eml-hdr-val">
                email-smtp.ap-south-1.amazonaws.com
              </span>
              <span className="eml-hdr-ctl">
                <input
                  type="text"
                  className="eml-input is-mono"
                  defaultValue="email-smtp.ap-south-1.amazonaws.com"
                  aria-label="Setting value"
                />
              </span>
            </div>
            <div className="eml-hdr">
              <span className="eml-hdr-key">Port</span>
              <span className="eml-hdr-val">587</span>
              <span className="eml-hdr-ctl">
                <select className="eml-select" aria-label="Setting value">
                  <option>587</option>
                  <option>465</option>
                  <option>2587</option>
                </select>
              </span>
            </div>
            <div className="eml-hdr">
              <span className="eml-hdr-key">Encryption</span>
              <span className="eml-hdr-val">STARTTLS, required</span>
              <span className="eml-hdr-ctl">
                <select className="eml-select" aria-label="Setting value">
                  <option>STARTTLS (required)</option>
                  <option>SSL / implicit TLS</option>
                </select>
              </span>
            </div>
            <div className="eml-hdr">
              <span className="eml-hdr-key">Username</span>
              <span className="eml-hdr-val">AKIA••••7QK4</span>
              <span className="eml-hdr-ctl">
                <span className="eml-secret">
                  <i className="ti ti-key" />
                  IAM key
                </span>
              </span>
            </div>
            <div className="eml-hdr">
              <span className="eml-hdr-key">Password</span>
              <span className="eml-hdr-val">Encrypted at rest</span>
              <span className="eml-hdr-ctl">
                <span className="eml-secret">
                  <i className="ti ti-lock" />
                  44 chars
                </span>
              </span>
            </div>
            <div className="eml-hdr">
              <span className="eml-hdr-key">Timeout</span>
              <span className="eml-hdr-val">30 seconds</span>
              <span className="eml-hdr-ctl">
                <input
                  type="text"
                  className="eml-input is-mono"
                  defaultValue={30}
                  aria-label="Setting value"
                />
              </span>
            </div>
          </div>
          <div className="eml-sect">
            <h6 className="eml-sect-title">
              <i className="ti ti-terminal-2" />
              Last handshake
            </h6>
            <div className="eml-dns-rec">
              → EHLO mail.preskool.edu
              <br />← 250-STARTTLS 250-AUTH LOGIN PLAIN
              <br />→ AUTH LOGIN ∗∗∗∗∗∗
              <br />← 235 2.7.0 Authentication successful
              <br />← 221 2.0.0 Service closing transmission channel
            </div>
          </div>
        </div>
        <div className="col-xl-5">
          <div className="eml-sect">
            <h6 className="eml-sect-title">
              <i className="ti ti-circle-check" />
              Validation
            </h6>
            <div className="eml-check">
              <i className="ti ti-circle-check" />
              <div>
                Host reachable and accepting
                <span>Three addresses resolved, all responding.</span>
              </div>
            </div>
            <div className="eml-check">
              <i className="ti ti-circle-check" />
              <div>
                TLS 1.3 negotiated
                <span>Certificate valid until 14 Mar 2027.</span>
              </div>
            </div>
            <div className="eml-check">
              <i className="ti ti-circle-check" />
              <div>
                Credentials accepted
                <span>235 Authentication successful at 09:14:02.</span>
              </div>
            </div>
            <div className="eml-check is-warn">
              <i className="ti ti-alert-circle" />
              <div>
                Reverse DNS does not match
                <span>
                  A weak signal for strict receivers. Not blocking delivery.
                </span>
              </div>
            </div>
          </div>
          <div className="eml-sect">
            <h6 className="eml-sect-title">
              <i className="ti ti-info-circle" />
              Provider information
            </h6>
            <div className="eml-hdr">
              <span className="eml-hdr-key">Service</span>
              <span className="eml-hdr-val">Amazon SES v2</span>
              <span className="eml-hdr-ctl" />
            </div>
            <div className="eml-hdr">
              <span className="eml-hdr-key">Status page</span>
              <span className="eml-hdr-val">
                health.aws.amazon.com — no incidents
              </span>
              <span className="eml-hdr-ctl" />
            </div>
            <div className="eml-hdr">
              <span className="eml-hdr-key">Support tier</span>
              <span className="eml-hdr-val">Business · 1 hour response</span>
              <span className="eml-hdr-ctl" />
            </div>
            <div className="eml-hdr">
              <span className="eml-hdr-key">Cost this month</span>
              <span className="eml-hdr-val">₹3,860 · 48,210 messages</span>
              <span className="eml-hdr-ctl" />
            </div>
          </div>
          <div className="eml-sect">
            <h6 className="eml-sect-title">
              <i className="ti ti-hierarchy-2" />
              Dependencies
            </h6>
            <div className="d-flex align-items-center gap-2 flex-wrap mb-2">
              <span className="badge-meta">
                <i className="ti ti-world-check" />
                Verified domains
              </span>
              <span className="badge-meta">
                <i className="ti ti-key" />
                API keys
              </span>
              <span className="badge-meta">
                <i className="ti ti-mail-x" />
                Bounce return path
              </span>
              <span className="badge-meta">
                <i className="ti ti-stack-2" />
                Queue worker
              </span>
            </div>
            <p className="fs-12 text-muted mb-0">
              Changing the default provider would move 6 notification rules and
              10 templates onto a different route. Nothing is re-sent; only
              future mail is affected.
            </p>
          </div>
          <div className="eml-sect">
            <h6 className="eml-sect-title">
              <i className="ti ti-link" />
              Related settings
            </h6>
            <span className="badge-meta me-1 mb-1">
              <i className="ti ti-lock" />
              Transport security
            </span>
            <span className="badge-meta me-1 mb-1">
              <i className="ti ti-gauge" />
              Delivery limits
            </span>
            <span className="badge-meta me-1 mb-1">
              <i className="ti ti-refresh" />
              Retry policy
            </span>
            <span className="badge-meta me-1 mb-1">
              <i className="ti ti-shield-check" />
              DKIM signing
            </span>
          </div>
          <div className="eml-sect">
            <h6 className="eml-sect-title">
              <i className="ti ti-history" />
              Audit history
            </h6>
            <div className="eml-audit">
              <div className="eml-audit-when">
                <strong>01 Aug 2026</strong>09:14
              </div>
              <div className="eml-audit-what">
                Health check passed<span>System · 250 OK in 142 ms</span>
              </div>
            </div>
            <div className="eml-audit">
              <div className="eml-audit-when">
                <strong>31 Jul 2026</strong>16:40
              </div>
              <div className="eml-audit-what">
                Daily ceiling raised to 60,000<span>Ms. Latha Rao</span>
              </div>
            </div>
            <div className="eml-audit">
              <div className="eml-audit-when">
                <strong>11 Jun 2026</strong>09:30
              </div>
              <div className="eml-audit-what">
                IAM credentials rotated<span>System · 180-day policy</span>
              </div>
            </div>
            <div className="eml-audit">
              <div className="eml-audit-when">
                <strong>11 Jun 2026</strong>09:24
              </div>
              <div className="eml-audit-what">
                Provider set as default
                <span>Ms. Latha Rao · replaced SendGrid</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div className="eml-panel-foot justify-content-end">
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
        data-bs-target="#eml_test"
      >
        <i className="ti ti-plug-connected me-1" />
        Test connection
      </button>
      <button
        type="button"
        className="btn btn-primary d-inline-flex align-items-center"
        data-bs-toggle="modal"
        data-bs-target="#eml_smtp"
      >
        <i className="ti ti-device-floppy me-1" />
        Save configuration
      </button>
    </div>
  </div>
  {/* /Reusable Email Configuration Workspace */}
  {/* Configure SMTP */}
  <div
    className="modal fade"
    id="eml_smtp"
    tabIndex={-1}
    aria-labelledby="eml_smtp_l"
    aria-hidden="true"
    role="region"
  >
    <div className="modal-dialog modal-dialog-centered modal-lg">
      <div className="modal-content">
        <div className="eml-panel-band is-info">
          <span className="eml-panel-ic">
            <i className="ti ti-server-cog" />
          </span>
          <div className="flex-fill overflow-hidden">
            <h5 className="eml-panel-title mb-0" id="eml_smtp_l">
              Configure SMTP
            </h5>
            <p>Amazon SES · production</p>
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
            <div className="col-md-8">
              <label className="form-label" htmlFor="m_host">
                SMTP host
              </label>
              <input
                type="text"
                className="form-control"
                id="m_host"
                defaultValue="email-smtp.ap-south-1.amazonaws.com"
              />
            </div>
            <div className="col-md-4">
              <label className="form-label" htmlFor="m_port">
                Port
              </label>
              <select className="form-select" id="m_port">
                <option>587</option>
                <option>465</option>
                <option>25</option>
                <option>2587</option>
              </select>
            </div>
            <div className="col-md-6">
              <label className="form-label" htmlFor="m_enc">
                Encryption
              </label>
              <select className="form-select" id="m_enc">
                <option>STARTTLS (required)</option>
                <option>SSL / implicit TLS</option>
                <option>None</option>
              </select>
            </div>
            <div className="col-md-6">
              <label className="form-label" htmlFor="m_auth">
                Authentication
              </label>
              <select className="form-select" id="m_auth">
                <option>LOGIN</option>
                <option>PLAIN</option>
                <option>CRAM-MD5</option>
                <option>XOAUTH2</option>
              </select>
            </div>
            <div className="col-md-6">
              <label className="form-label" htmlFor="m_user">
                Username
              </label>
              <input
                type="text"
                className="form-control"
                id="m_user"
                defaultValue="AKIA••••••••••7QK4"
              />
            </div>
            <div className="col-md-6">
              <label className="form-label" htmlFor="m_pass">
                Password
              </label>
              <input
                type="password"
                autoComplete="current-password"
                className="form-control"
                id="m_pass"
                defaultValue="0000000000000000"
              />
            </div>
            <div className="col-md-6">
              <label className="form-label" htmlFor="m_to">
                Timeout (seconds)
              </label>
              <input
                type="text"
                className="form-control"
                id="m_to"
                defaultValue={30}
              />
            </div>
            <div className="col-md-6 d-flex align-items-end">
              <div className="form-check mb-2">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="m_verify"
                  defaultChecked
                />
                <label className="form-check-label fs-13" htmlFor="m_verify">
                  Verify the certificate chain
                </label>
              </div>
            </div>
          </div>
          <p className="fs-12 text-muted mb-0 mt-3">
            Saving runs a connection test first. If the handshake fails, the
            previous settings are kept.
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
  {/* /Configure SMTP */}
  {/* Add mail provider */}
  <div
    className="modal fade"
    id="eml_provider"
    tabIndex={-1}
    aria-labelledby="eml_provider_l"
    aria-hidden="true"
    role="region"
  >
    <div className="modal-dialog modal-dialog-centered">
      <div className="modal-content">
        <div className="eml-panel-band">
          <span className="eml-panel-ic">
            <i className="ti ti-plug-connected" />
          </span>
          <div className="flex-fill overflow-hidden">
            <h5 className="eml-panel-title mb-0" id="eml_provider_l">
              Add mail provider
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
            <label className="form-label" htmlFor="m_pv">
              Provider
            </label>
            <select className="form-select" id="m_pv">
              <option>Amazon SES</option>
              <option>Google Workspace</option>
              <option>Microsoft 365</option>
              <option>SendGrid</option>
              <option>Mailgun</option>
              <option>Postmark</option>
              <option>Custom SMTP relay</option>
            </select>
          </div>
          <div className="mb-3">
            <label className="form-label" htmlFor="m_pv_name">
              Display name
            </label>
            <input
              type="text"
              className="form-control"
              id="m_pv_name"
              placeholder="How this route appears in the provider list"
            />
          </div>
          <div className="mb-3">
            <label className="form-label" htmlFor="m_pv_auth">
              Authentication method
            </label>
            <select className="form-select" id="m_pv_auth">
              <option>API key</option>
              <option>OAuth 2.0</option>
              <option>Username and password</option>
              <option>None — trusted network</option>
            </select>
          </div>
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              id="m_pv_test"
              defaultChecked
            />
            <label className="form-check-label fs-13" htmlFor="m_pv_test">
              Run a connection test before saving
            </label>
          </div>
          <div className="form-check">
            <input className="form-check-input" type="checkbox" id="m_pv_def" />
            <label className="form-check-label fs-13" htmlFor="m_pv_def">
              Set as the default provider immediately
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
            Add provider
          </button>
        </div>
      </div>
    </div>
  </div>
  {/* /Add mail provider */}
  {/* Test connection */}
  <div
    className="modal fade"
    id="eml_test"
    tabIndex={-1}
    aria-labelledby="eml_test_l"
    aria-hidden="true"
    role="region"
  >
    <div className="modal-dialog modal-dialog-centered">
      <div className="modal-content">
        <div className="eml-panel-band is-ok">
          <span className="eml-panel-ic">
            <i className="ti ti-plug-connected" />
          </span>
          <div className="flex-fill overflow-hidden">
            <h5 className="eml-panel-title mb-0" id="eml_test_l">
              Test connection
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
            A handshake is opened against the configured host, authentication is
            attempted and the session is closed. Nothing is delivered to anyone.
          </p>
          <div className="eml-dns-rec">
            → EHLO mail.preskool.edu
            <br />← 250-smtp.preskool.edu Hello [103.21.58.14]
            <br />→ STARTTLS
            <br />← 220 2.0.0 Ready to start TLS
            <br />→ AUTH LOGIN ∗∗∗∗∗∗
            <br />← 235 2.7.0 Authentication successful
            <br />→ QUIT
            <br />← 221 2.0.0 Service closing transmission channel
          </div>
          <div className="d-flex align-items-center gap-3 flex-wrap mt-3">
            <span className="eml-badge is-ok">250 OK</span>
            <span className="fs-12 text-muted">
              TLS 1.3 · 142 ms · certificate valid until 14 Mar 2027
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
  {/* /Test connection */}
  {/* Send test email */}
  <div
    className="modal fade"
    id="eml_sendtest"
    tabIndex={-1}
    aria-labelledby="eml_sendtest_l"
    aria-hidden="true"
    role="region"
  >
    <div className="modal-dialog modal-dialog-centered">
      <div className="modal-content">
        <div className="eml-panel-band is-info">
          <span className="eml-panel-ic">
            <i className="ti ti-send" />
          </span>
          <div className="flex-fill overflow-hidden">
            <h5 className="eml-panel-title mb-0" id="eml_sendtest_l">
              Send test email
            </h5>
            <p>A real message to one address</p>
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
            <label className="form-label" htmlFor="m_st_to">
              Send to
            </label>
            <input
              type="email"
              className="form-control"
              id="m_st_to"
              defaultValue="it@preskool.edu"
            />
          </div>
          <div className="mb-3">
            <label className="form-label" htmlFor="m_st_tpl">
              Template
            </label>
            <select className="form-select" id="m_st_tpl">
              <option>Plain connection test</option>
              <option>Welcome Email</option>
              <option>Fee Reminder</option>
              <option>Attendance Alert</option>
              <option>Invoice Email</option>
            </select>
          </div>
          <div className="mb-3">
            <label className="form-label" htmlFor="m_st_id">
              Send as
            </label>
            <select className="form-select" id="m_st_id">
              <option>
                Preskool International School &lt;noreply@preskool.edu&gt;
              </option>
              <option>Preskool Accounts &lt;fees@preskool.edu&gt;</option>
            </select>
          </div>
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              id="m_st_hdr"
              defaultChecked
            />
            <label className="form-check-label fs-13" htmlFor="m_st_hdr">
              Include full message headers in the body, for diagnosis
            </label>
          </div>
          <p className="fs-12 text-muted mb-0 mt-2">
            Test sends count against the daily limit and appear in the delivery
            log.
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
  {/* /Send test email */}
  {/* Edit email template */}
  <div
    className="modal fade"
    id="eml_template"
    tabIndex={-1}
    aria-labelledby="eml_template_l"
    aria-hidden="true"
    role="region"
  >
    <div className="modal-dialog modal-dialog-centered modal-lg">
      <div className="modal-content">
        <div className="eml-panel-band">
          <span className="eml-panel-ic">
            <i className="ti ti-template" />
          </span>
          <div className="flex-fill overflow-hidden">
            <h5 className="eml-panel-title mb-0" id="eml_template_l">
              Edit email template
            </h5>
            <p>Fee Reminder · published</p>
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
              <label className="form-label" htmlFor="m_tp_sub">
                Subject
              </label>
              <input
                type="text"
                className="form-control"
                id="m_tp_sub"
                defaultValue="Fee due on {date} — {amount}"
              />
            </div>
            <div className="col-md-5">
              <label className="form-label" htmlFor="m_tp_id">
                Sender identity
              </label>
              <select className="form-select" id="m_tp_id">
                <option>Preskool Accounts</option>
                <option>Preskool International School</option>
              </select>
            </div>
            <div className="col-12">
              <label className="form-label" htmlFor="m_tp_body">
                Body
              </label>
              <textarea
                className="form-control"
                id="m_tp_body"
                rows={5}
                defaultValue={
                  "Dear {guardian},\n\t\t\t\t\t\n\t\t\t\t\tThe fee of {amount} for {student} is due on {date}. You can pay from the parent portal or at the accounts counter between 9:00 and 15:00."
                }
              />
            </div>
            <div className="col-12">
              <span className="eml-lbl">Available placeholders</span>
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
              <span className="badge-meta me-1">
                {"{"}invoice{"}"}
              </span>
            </div>
          </div>
          <div className="form-check mt-3">
            <input
              className="form-check-input"
              type="checkbox"
              id="m_tp_txt"
              defaultChecked
            />
            <label className="form-check-label fs-13" htmlFor="m_tp_txt">
              Regenerate the plain-text alternative from this body
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
            Save template
          </button>
        </div>
      </div>
    </div>
  </div>
  {/* /Edit email template */}
  {/* Export settings */}
  <div
    className="modal fade"
    id="eml_export"
    tabIndex={-1}
    aria-labelledby="eml_export_l"
    aria-hidden="true"
    role="region"
  >
    <div className="modal-dialog modal-dialog-centered">
      <div className="modal-content">
        <div className="eml-panel-band">
          <span className="eml-panel-ic">
            <i className="ti ti-download" />
          </span>
          <div className="flex-fill overflow-hidden">
            <h5 className="eml-panel-title mb-0" id="eml_export_l">
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
            <label className="form-label" htmlFor="m_ex_f">
              Format
            </label>
            <select className="form-select" id="m_ex_f">
              <option>JSON — re-importable</option>
              <option>PDF — for the IT audit</option>
              <option>CSV — settings list only</option>
            </select>
          </div>
          <span className="eml-lbl">Contents</span>
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              id="m_ex_1"
              defaultChecked
            />
            <label className="form-check-label fs-13" htmlFor="m_ex_1">
              SMTP, provider and delivery settings
            </label>
          </div>
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              id="m_ex_2"
              defaultChecked
            />
            <label className="form-check-label fs-13" htmlFor="m_ex_2">
              Templates and notification rules
            </label>
          </div>
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              id="m_ex_3"
              defaultChecked
            />
            <label className="form-check-label fs-13" htmlFor="m_ex_3">
              Audit history
            </label>
          </div>
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              id="m_ex_4"
              disabled
            />
            <label
              className="form-check-label fs-13 text-muted"
              htmlFor="m_ex_4"
            >
              Credentials and API keys — never exported
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
    id="eml_import"
    tabIndex={-1}
    aria-labelledby="eml_import_l"
    aria-hidden="true"
    role="region"
  >
    <div className="modal-dialog modal-dialog-centered">
      <div className="modal-content">
        <div className="eml-panel-band">
          <span className="eml-panel-ic">
            <i className="ti ti-upload" />
          </span>
          <div className="flex-fill overflow-hidden">
            <h5 className="eml-panel-title mb-0" id="eml_import_l">
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
            <label className="form-label" htmlFor="m_im_s">
              Source
            </label>
            <select className="form-select" id="m_im_s">
              <option>Configuration file (.json)</option>
              <option>Sunrise Public School</option>
              <option>Riverside Academy</option>
              <option>Previous year — 2025-26</option>
            </select>
          </div>
          <div className="mb-3">
            <label className="form-label" htmlFor="m_im_f">
              Configuration file
            </label>
            <input type="file" className="form-control" id="m_im_f" />
          </div>
          <span className="eml-lbl">Include</span>
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              id="m_im_1"
              defaultChecked
            />
            <label className="form-check-label fs-13" htmlFor="m_im_1">
              Delivery policies and notification rules
            </label>
          </div>
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              id="m_im_2"
              defaultChecked
            />
            <label className="form-check-label fs-13" htmlFor="m_im_2">
              Templates
            </label>
          </div>
          <div className="form-check">
            <input className="form-check-input" type="checkbox" id="m_im_3" />
            <label className="form-check-label fs-13" htmlFor="m_im_3">
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
  {/* Verify domain */}
  <div
    className="modal fade"
    id="eml_verify"
    tabIndex={-1}
    aria-labelledby="eml_verify_l"
    aria-hidden="true"
    role="region"
  >
    <div className="modal-dialog modal-dialog-centered">
      <div className="modal-content">
        <div className="eml-panel-band is-warn">
          <span className="eml-panel-ic">
            <i className="ti ti-world-check" />
          </span>
          <div className="flex-fill overflow-hidden">
            <h5 className="eml-panel-title mb-0" id="eml_verify_l">
              Verify domain
            </h5>
            <p>preskool.org · awaiting DNS</p>
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
            Publish this TXT record with your DNS host. Verification is checked
            every 15 minutes and usually completes within an hour.
          </p>
          <span className="eml-lbl">Record to publish</span>
          <div className="eml-dns-rec">
            _preskool-verify.preskool.org TXT
            <br />
            preskool-site-verification=8f21ba4c9de7
          </div>
          <div className="mt-3">
            <span className="eml-lbl">
              Then these will be added automatically
            </span>
            <span className="badge-meta me-1 mb-1">
              <i className="ti ti-signature" />
              DKIM key
            </span>
            <span className="badge-meta me-1 mb-1">
              <i className="ti ti-shield" />
              SPF include
            </span>
            <span className="badge-meta me-1 mb-1">
              <i className="ti ti-mail-x" />
              Bounce return path
            </span>
          </div>
          <div className="d-flex align-items-center gap-2 mt-3">
            <span className="eml-badge is-warn">Not found yet</span>
            <span className="fs-12 text-muted eml-mono">
              last checked 09:00
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
            Check now
          </button>
        </div>
      </div>
    </div>
  </div>
  {/* /Verify domain */}
  {/* Reset configuration */}
  <div
    className="modal fade"
    id="eml_reset"
    tabIndex={-1}
    aria-labelledby="eml_reset_l"
    aria-hidden="true"
    role="region"
  >
    <div className="modal-dialog modal-dialog-centered">
      <div className="modal-content">
        <div className="eml-panel-band is-bad">
          <span className="eml-panel-ic">
            <i className="ti ti-rotate-2" />
          </span>
          <div className="flex-fill overflow-hidden">
            <h5 className="eml-panel-title mb-0" id="eml_reset_l">
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
            Every email setting returns to the template default. Stored
            credentials are cleared and cannot be recovered. Templates, delivery
            logs and the suppression list are kept.
          </p>
          <div className="eml-check is-bad">
            <i className="ti ti-alert-triangle" />
            <div>
              8 providers disconnected
              <span>Each will need its credentials entered again.</span>
            </div>
          </div>
          <div className="eml-check is-bad">
            <i className="ti ti-alert-triangle" />
            <div>
              6 notification rules switched off
              <span>
                No automated mail leaves until a provider is reconnected.
              </span>
            </div>
          </div>
          <div className="eml-check is-warn">
            <i className="ti ti-alert-circle" />
            <div>
              6,142 queued messages held
              <span>
                They stay in the queue and resume once a route exists.
              </span>
            </div>
          </div>
          <div className="form-check mt-3">
            <input className="form-check-input" type="checkbox" id="m_rs_ok" />
            <label className="form-check-label fs-13" htmlFor="m_rs_ok">
              I understand the school will not be able to send email until a
              provider is reconnected.
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

export default EmailSettingsModal