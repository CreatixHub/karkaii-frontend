
const SmsSettings = () => {
  return (
   <>
  {/* Page Wrapper */}
  <div className="page-wrapper">
    <div className="content content-two">
      {/* ===================== 1. SMS WORKSPACE HERO ===================== */}
      <div className="sms-hero">
        <div className="sms-hero-top">
          <span className="sms-hero-crest">
            <i className="ti ti-device-mobile-message" />
          </span>
          <div className="flex-fill">
            <h1 className="sms-hero-title">SMS Settings</h1>
            <p className="sms-hero-sub">
              Every text the school sends leaves through this configuration —
              the gateway that carries it, the sender ID it arrives under, and
              the rules that decide who receives it and when.
            </p>
          </div>
        </div>
        <div className="sms-hero-grid">
          <div className="sms-hero-cell">
            <span>Active provider</span>
            <strong>
              MSG91 <span className="sms-badge is-accent">Default</span>
            </strong>
          </div>
          <div className="sms-hero-cell">
            <span>Delivery status</span>
            <strong>Healthy · 98.6% delivered</strong>
          </div>
          <div className="sms-hero-cell">
            <span>Gateway status</span>
            <strong>Connected · 214 ms</strong>
          </div>
          <div className="sms-hero-cell">
            <span>Last test message</span>
            <strong>Today, 09:41 AM</strong>
          </div>
          <div className="sms-hero-cell">
            <span>Last updated</span>
            <strong>31 Jul 2026 · Ms. Latha Rao</strong>
          </div>
          <div className="sms-hero-cell">
            <span>Credits remaining</span>
            <strong>1,84,220 SMS</strong>
          </div>
        </div>
        <div className="sms-ladder">
          <div className="sms-ladder-leg">
            <span>Submitted</span>
            <strong>09:41:02.140</strong>
            <small>Queued by the ERP</small>
          </div>
          <div className="sms-ladder-leg">
            <span>Gateway accepted</span>
            <strong>+0.31 s</strong>
            <small>MSG91 returned id 5f2a91</small>
          </div>
          <div className="sms-ladder-leg">
            <span>Carrier accepted</span>
            <strong>+1.84 s</strong>
            <small>Airtel IN handed over</small>
          </div>
          <div className="sms-ladder-leg">
            <span>Delivered to handset</span>
            <strong>+4.02 s</strong>
            <small>DLR received · DELIVRD</small>
          </div>
        </div>
        <div className="sms-hero-actions">
          <button
            type="button"
            className="btn btn-primary d-inline-flex align-items-center"
            data-bs-toggle="modal"
            data-bs-target="#sms_gateway"
          >
            <i className="ti ti-device-floppy me-1" />
            Save settings
          </button>
          <button
            type="button"
            className="btn btn-outline-light bg-white d-inline-flex align-items-center"
            data-bs-toggle="modal"
            data-bs-target="#sms_test"
          >
            <i className="ti ti-plug-connected me-1" />
            Test SMS gateway
          </button>
          <button
            type="button"
            className="btn btn-outline-light bg-white d-inline-flex align-items-center"
            data-bs-toggle="modal"
            data-bs-target="#sms_sendtest"
          >
            <i className="ti ti-send me-1" />
            Send test message
          </button>
          <button
            type="button"
            className="btn btn-outline-light bg-white d-inline-flex align-items-center"
            data-bs-toggle="modal"
            data-bs-target="#sms_export"
          >
            <i className="ti ti-download me-1" />
            Export configuration
          </button>
        </div>
      </div>
      {/* /SMS Workspace Hero */}
      <div className="row g-4">
        {/* ===================== 2. STICKY SETTINGS NAVIGATION ===================== */}
        <div className="col-xxl-3 col-lg-4">
          <div
            className="sms-nav nav flex-column"
            role="tablist"
            aria-label="SMS settings sections"
          >
            <button
              className="sms-nav-link active"
              id="smstab-general"
              data-bs-toggle="pill"
              data-bs-target="#smspane-general"
              type="button"
              role="tab"
              aria-controls="smspane-general"
              aria-selected="true"
            >
              <i className="ti ti-adjustments" />
              <span className="sms-nav-txt">General</span>
              <span className="sms-nav-state">On</span>
            </button>
            <button
              className="sms-nav-link"
              id="smstab-gateway"
              data-bs-toggle="pill"
              data-bs-target="#smspane-gateway"
              type="button"
              role="tab"
              aria-controls="smspane-gateway"
              aria-selected="false"
            >
              <i className="ti ti-router" />
              <span className="sms-nav-txt">SMS Gateway</span>
              <span className="sms-nav-state">Live</span>
            </button>
            <button
              className="sms-nav-link"
              id="smstab-providers"
              data-bs-toggle="pill"
              data-bs-target="#smspane-providers"
              type="button"
              role="tab"
              aria-controls="smspane-providers"
              aria-selected="false"
            >
              <i className="ti ti-building-broadcast-tower" />
              <span className="sms-nav-txt">Providers</span>
              <span className="sms-nav-state">8</span>
            </button>
            <button
              className="sms-nav-link"
              id="smstab-senders"
              data-bs-toggle="pill"
              data-bs-target="#smspane-senders"
              type="button"
              role="tab"
              aria-controls="smspane-senders"
              aria-selected="false"
            >
              <i className="ti ti-id-badge-2" />
              <span className="sms-nav-txt">Sender IDs</span>
              <span className="sms-nav-state">4</span>
            </button>
            <button
              className="sms-nav-link"
              id="smstab-templates"
              data-bs-toggle="pill"
              data-bs-target="#smspane-templates"
              type="button"
              role="tab"
              aria-controls="smspane-templates"
              aria-selected="false"
            >
              <i className="ti ti-message-2" />
              <span className="sms-nav-txt">Templates</span>
              <span className="sms-nav-state">10</span>
            </button>
            <button
              className="sms-nav-link"
              id="smstab-rules"
              data-bs-toggle="pill"
              data-bs-target="#smspane-rules"
              type="button"
              role="tab"
              aria-controls="smspane-rules"
              aria-selected="false"
            >
              <i className="ti ti-bell-ringing" />
              <span className="sms-nav-txt">Notification Rules</span>
              <span className="sms-nav-state">7</span>
            </button>
            <button
              className="sms-nav-link"
              id="smstab-delivery"
              data-bs-toggle="pill"
              data-bs-target="#smspane-delivery"
              type="button"
              role="tab"
              aria-controls="smspane-delivery"
              aria-selected="false"
            >
              <i className="ti ti-send" />
              <span className="sms-nav-txt">Delivery Policies</span>
              <span className="sms-nav-state">Set</span>
            </button>
            <button
              className="sms-nav-link"
              id="smstab-routing"
              data-bs-toggle="pill"
              data-bs-target="#smspane-routing"
              type="button"
              role="tab"
              aria-controls="smspane-routing"
              aria-selected="false"
            >
              <i className="ti ti-route" />
              <span className="sms-nav-txt">Routing</span>
              <span className="sms-nav-state">3</span>
            </button>
            <button
              className="sms-nav-link"
              id="smstab-retry"
              data-bs-toggle="pill"
              data-bs-target="#smspane-retry"
              type="button"
              role="tab"
              aria-controls="smspane-retry"
              aria-selected="false"
            >
              <i className="ti ti-refresh" />
              <span className="sms-nav-txt">Retry Policies</span>
              <span className="sms-nav-state">3x</span>
            </button>
            <button
              className="sms-nav-link"
              id="smstab-queue"
              data-bs-toggle="pill"
              data-bs-target="#smspane-queue"
              type="button"
              role="tab"
              aria-controls="smspane-queue"
              aria-selected="false"
            >
              <i className="ti ti-stack-2" />
              <span className="sms-nav-txt">Message Queue</span>
              <span className="sms-nav-state">412</span>
            </button>
            <button
              className="sms-nav-link"
              id="smstab-logs"
              data-bs-toggle="pill"
              data-bs-target="#smspane-logs"
              type="button"
              role="tab"
              aria-controls="smspane-logs"
              aria-selected="false"
            >
              <i className="ti ti-list-details" />
              <span className="sms-nav-txt">Logs</span>
              <span className="sms-nav-state">90d</span>
            </button>
            <button
              className="sms-nav-link"
              id="smstab-security"
              data-bs-toggle="pill"
              data-bs-target="#smspane-security"
              type="button"
              role="tab"
              aria-controls="smspane-security"
              aria-selected="false"
            >
              <i className="ti ti-shield-lock" />
              <span className="sms-nav-txt">Security</span>
              <span className="sms-nav-state">Ok</span>
            </button>
            <button
              className="sms-nav-link"
              id="smstab-advanced"
              data-bs-toggle="pill"
              data-bs-target="#smspane-advanced"
              type="button"
              role="tab"
              aria-controls="smspane-advanced"
              aria-selected="false"
            >
              <i className="ti ti-terminal-2" />
              <span className="sms-nav-txt">Advanced</span>
              <span className="sms-nav-state" />
            </button>
            <button
              className="sms-nav-link"
              id="smstab-audit"
              data-bs-toggle="pill"
              data-bs-target="#smspane-audit"
              type="button"
              role="tab"
              aria-controls="smspane-audit"
              aria-selected="false"
            >
              <i className="ti ti-history" />
              <span className="sms-nav-txt">Audit History</span>
              <span className="sms-nav-state">186</span>
            </button>
            <div className="sms-nav-foot">
              <span className="sms-lbl">Credit balance</span>
              <div className="sms-credit sms-p-61 mb-2">
                <span />
              </div>
              <p className="fs-12 text-muted mb-2">
                <b className="sms-mono">1,84,220</b> of 3,00,000 purchased. At
                the current rate this lasts to about 12 Oct.
              </p>
              <button
                type="button"
                className="btn btn-outline-light bg-white btn-sm w-100 d-inline-flex align-items-center justify-content-center"
                data-bs-toggle="modal"
                data-bs-target="#sms_import"
              >
                <i className="ti ti-upload me-1" />
                Import settings
              </button>
            </div>
          </div>
        </div>
        {/* /Sticky Settings Navigation */}
        {/* ===================== 3&ndash;8. CONFIGURATION WORKSPACE ===================== */}
        <div className="col-xxl-9 col-lg-8">
          <div className="tab-content">
            <div
              className="tab-pane fade show active"
              id="smspane-general"
              role="tabpanel"
              aria-labelledby="smstab-general"
              tabIndex={0}
            >
              <div className="d-flex align-items-end justify-content-between gap-3 flex-wrap mb-3">
                <div>
                  <span className="sms-lbl">Section 01</span>
                  <h2 className="sms-hero-title fs-20 mb-1">General</h2>
                  <p className="fs-13 text-muted mb-0">
                    How SMS behaves before a single message is written.
                  </p>
                </div>
              </div>
              <div className="row g-4">
                <div className="col-12">
                  <div className="sms-card">
                    <div className="sms-card-head">
                      <span className="sms-card-ic">
                        <i className="ti ti-message-circle" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="sms-card-title">Outbound SMS</p>
                        <p>Applies to every message the system sends</p>
                      </div>
                      <span className="sms-badge is-ok">Enabled</span>
                    </div>
                    <div className="sms-card-body">
                      <div className="sms-line">
                        <div className="sms-line-txt">
                          <strong>System SMS</strong>
                          <p>On — the ERP may send text messages</p>
                        </div>
                        <div className="sms-line-ctl">
                          <div className="form-check form-switch mb-0">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              role="switch"
                              id="sms_sw_1"
                              defaultChecked
                            />
                            <label
                              className="form-check-label visually-hidden"
                              htmlFor="sms_sw_1"
                            >
                              Enable
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="sms-line">
                        <div className="sms-line-txt">
                          <strong>Default route</strong>
                          <p>MSG91 transactional</p>
                        </div>
                        <div className="sms-line-ctl">
                          <select
                            className="sms-select"
                            aria-label="Setting value"
                          >
                            <option>MSG91 transactional</option>
                            <option>Twilio</option>
                            <option>Textlocal</option>
                            <option>AWS SNS</option>
                          </select>
                        </div>
                      </div>
                      <div className="sms-line">
                        <div className="sms-line-txt">
                          <strong>Encoding</strong>
                          <p>GSM-7 — 160 characters per segment</p>
                        </div>
                        <div className="sms-line-ctl">
                          <select
                            className="sms-select"
                            aria-label="Setting value"
                          >
                            <option>GSM-7 (160 chars)</option>
                            <option>Unicode (70 chars)</option>
                            <option>Automatic</option>
                          </select>
                        </div>
                      </div>
                      <div className="sms-line">
                        <div className="sms-line-txt">
                          <strong>Country</strong>
                          <p>India (+91) — numbers stored in E.164</p>
                        </div>
                        <div className="sms-line-ctl">
                          <select
                            className="sms-select"
                            aria-label="Setting value"
                          >
                            <option>India (+91)</option>
                            <option>United Arab Emirates (+971)</option>
                            <option>United Kingdom (+44)</option>
                          </select>
                        </div>
                      </div>
                      <div className="sms-line">
                        <div className="sms-line-txt">
                          <strong>Send window</strong>
                          <p>Nothing sent between 21:00 and 09:00</p>
                        </div>
                        <div className="sms-line-ctl">
                          <select
                            className="sms-select"
                            aria-label="Setting value"
                          >
                            <option>09:00 – 21:00</option>
                            <option>24 hours</option>
                            <option>08:00 – 20:00</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className="sms-card-foot">
                      <span className="fs-12 text-muted">
                        5 settings · published
                      </span>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-light bg-white d-inline-flex align-items-center"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#sms_workspace"
                        aria-label="Open configuration workspace for Outbound SMS"
                      >
                        <i className="ti ti-settings me-1" />
                        Configure
                      </button>
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <div className="sms-card">
                    <div className="sms-card-head">
                      <span className="sms-card-ic">
                        <i className="ti ti-users" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="sms-card-title">Recipients</p>
                        <p>Who may be texted, and on which number</p>
                      </div>
                      <span className="sms-badge is-accent">
                        Guardian first
                      </span>
                    </div>
                    <div className="sms-card-body">
                      <div className="sms-line">
                        <div className="sms-line-txt">
                          <strong>Primary recipient</strong>
                          <p>
                            The guardian marked primary on the student record
                          </p>
                        </div>
                        <div className="sms-line-ctl">
                          <select
                            className="sms-select"
                            aria-label="Setting value"
                          >
                            <option>Primary guardian</option>
                            <option>Both guardians</option>
                            <option>Guardian and student</option>
                          </select>
                        </div>
                      </div>
                      <div className="sms-line">
                        <div className="sms-line-txt">
                          <strong>Fallback</strong>
                          <p>
                            Try the second guardian if the first number is
                            invalid
                          </p>
                        </div>
                        <div className="sms-line-ctl">
                          <div className="form-check form-switch mb-0">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              role="switch"
                              id="sms_sw_2"
                              defaultChecked
                            />
                            <label
                              className="form-check-label visually-hidden"
                              htmlFor="sms_sw_2"
                            >
                              Enable
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="sms-line">
                        <div className="sms-line-txt">
                          <strong>Student numbers</strong>
                          <p>Only for OTP and exam results, never for fees</p>
                        </div>
                        <div className="sms-line-ctl">
                          <div className="form-check form-switch mb-0">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              role="switch"
                              id="sms_sw_3"
                              defaultChecked
                            />
                            <label
                              className="form-check-label visually-hidden"
                              htmlFor="sms_sw_3"
                            >
                              Enable
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="sms-line">
                        <div className="sms-line-txt">
                          <strong>Staff numbers</strong>
                          <p>Used for internal alerts only</p>
                        </div>
                        <div className="sms-line-ctl">
                          <div className="form-check form-switch mb-0">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              role="switch"
                              id="sms_sw_4"
                              defaultChecked
                            />
                            <label
                              className="form-check-label visually-hidden"
                              htmlFor="sms_sw_4"
                            >
                              Enable
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="sms-line">
                        <div className="sms-line-txt">
                          <strong>Opt-out honoured</strong>
                          <p>
                            A guardian who replies STOP receives nothing but
                            emergencies
                          </p>
                        </div>
                        <div className="sms-line-ctl">
                          <div className="form-check form-switch mb-0">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              role="switch"
                              id="sms_sw_5"
                              defaultChecked
                            />
                            <label
                              className="form-check-label visually-hidden"
                              htmlFor="sms_sw_5"
                            >
                              Enable
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="sms-card-foot">
                      <span className="fs-12 text-muted">
                        5 settings · published
                      </span>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-light bg-white d-inline-flex align-items-center"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#sms_workspace"
                        aria-label="Open configuration workspace for Recipients"
                      >
                        <i className="ti ti-settings me-1" />
                        Configure
                      </button>
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <div className="sms-card">
                    <div className="sms-card-head">
                      <span className="sms-card-ic is-warn">
                        <i className="ti ti-shield-check" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="sms-card-title">Safety rails</p>
                        <p>Guards that stop a mistake reaching every family</p>
                      </div>
                      <span className="sms-badge is-warn">1 off</span>
                    </div>
                    <div className="sms-card-body">
                      <div className="sms-line">
                        <div className="sms-line-txt">
                          <strong>Test mode</strong>
                          <p>Off — messages reach real handsets</p>
                        </div>
                        <div className="sms-line-ctl">
                          <div className="form-check form-switch mb-0">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              role="switch"
                              id="sms_sw_6"
                            />
                            <label
                              className="form-check-label visually-hidden"
                              htmlFor="sms_sw_6"
                            >
                              Enable
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="sms-line">
                        <div className="sms-line-txt">
                          <strong>Test number list</strong>
                          <p>Used only while test mode is on</p>
                        </div>
                        <div className="sms-line-ctl">
                          <span className="sms-secret">
                            <i className="ti ti-lock" />4 numbers
                          </span>
                        </div>
                      </div>
                      <div className="sms-line">
                        <div className="sms-line-txt">
                          <strong>Bulk send confirmation</strong>
                          <p>Ask before any send above 200 recipients</p>
                        </div>
                        <div className="sms-line-ctl">
                          <div className="form-check form-switch mb-0">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              role="switch"
                              id="sms_sw_7"
                              defaultChecked
                            />
                            <label
                              className="form-check-label visually-hidden"
                              htmlFor="sms_sw_7"
                            >
                              Enable
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="sms-line">
                        <div className="sms-line-txt">
                          <strong>Daily ceiling</strong>
                          <p>25,000 messages — refuses beyond this</p>
                        </div>
                        <div className="sms-line-ctl">
                          <input
                            type="text"
                            className="sms-input is-mono"
                            defaultValue={25000}
                            aria-label="Setting value"
                          />
                        </div>
                      </div>
                      <div className="sms-line">
                        <div className="sms-line-txt">
                          <strong>Duplicate guard</strong>
                          <p>
                            Block the same text to the same number within 10
                            minutes
                          </p>
                        </div>
                        <div className="sms-line-ctl">
                          <div className="form-check form-switch mb-0">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              role="switch"
                              id="sms_sw_8"
                              defaultChecked
                            />
                            <label
                              className="form-check-label visually-hidden"
                              htmlFor="sms_sw_8"
                            >
                              Enable
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="sms-card-foot">
                      <span className="fs-12 text-muted">
                        5 settings · 1 unpublished
                      </span>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-light bg-white d-inline-flex align-items-center"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#sms_workspace"
                        aria-label="Open configuration workspace for Safety rails"
                      >
                        <i className="ti ti-settings me-1" />
                        Configure
                      </button>
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <div className="sms-card">
                    <div className="sms-card-head">
                      <span className="sms-card-ic is-warn">
                        <i className="ti ti-gavel" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="sms-card-title">Regulatory position</p>
                        <p>TRAI commercial communication rules</p>
                      </div>
                      <span className="sms-badge is-ok">Compliant</span>
                    </div>
                    <div className="sms-card-body">
                      <div className="sms-check">
                        <i className="ti ti-circle-check" />
                        <div>
                          Principal entity registered on the DLT platform
                          <span>
                            Entity id 1101459800000123456, registered 14 Jan
                            2026.
                          </span>
                        </div>
                      </div>
                      <div className="sms-check">
                        <i className="ti ti-circle-check" />
                        <div>
                          All active templates approved
                          <span>
                            10 of 10 carry a DLT template id. An unapproved
                            template cannot be sent.
                          </span>
                        </div>
                      </div>
                      <div className="sms-check">
                        <i className="ti ti-circle-check" />
                        <div>
                          Transactional and promotional traffic kept apart
                          <span>
                            Different sender IDs and different routes, as the
                            rules require.
                          </span>
                        </div>
                      </div>
                      <div className="sms-check is-warn">
                        <i className="ti ti-alert-circle" />
                        <div>
                          One sender ID awaiting approval
                          <span>
                            PRSKEM was submitted on 28 Jul. Emergency alerts
                            fall back to PRSKOL until it clears.
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="sms-card-foot">
                      <span className="fs-12 text-muted">
                        Reviewed 31 Jul 2026
                      </span>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-light bg-white d-inline-flex align-items-center"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#sms_workspace"
                        aria-label="Open configuration workspace for Regulatory position"
                      >
                        <i className="ti ti-settings me-1" />
                        Configure
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="tab-pane fade"
              id="smspane-gateway"
              role="tabpanel"
              aria-labelledby="smstab-gateway"
              tabIndex={0}
            >
              <div className="d-flex align-items-end justify-content-between gap-3 flex-wrap mb-3">
                <div>
                  <span className="sms-lbl">Section 02</span>
                  <h2 className="sms-hero-title fs-20 mb-1">SMS Gateway</h2>
                  <p className="fs-13 text-muted mb-0">
                    The connection itself — endpoint, credentials and what comes
                    back.
                  </p>
                </div>
              </div>
              <div className="row g-4">
                <div className="col-12">
                  <div className="sms-card">
                    <div className="sms-card-head">
                      <span className="sms-card-ic">
                        <i className="ti ti-router" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="sms-card-title">Gateway</p>
                        <p>Where messages are handed over</p>
                      </div>
                      <span className="sms-badge is-accent">MSG91</span>
                    </div>
                    <div className="sms-card-body">
                      <div className="sms-line">
                        <div className="sms-line-txt">
                          <strong>Gateway name</strong>
                          <p>MSG91 — transactional route</p>
                        </div>
                        <div className="sms-line-ctl">
                          <input
                            type="text"
                            className="sms-input"
                            defaultValue="MSG91 Transactional"
                            aria-label="Setting value"
                          />
                        </div>
                      </div>
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
                          <strong>Method</strong>
                          <p>POST with a JSON body</p>
                        </div>
                        <div className="sms-line-ctl">
                          <select
                            className="sms-select"
                            aria-label="Setting value"
                          >
                            <option>POST · JSON</option>
                            <option>POST · form</option>
                            <option>GET · query string</option>
                          </select>
                        </div>
                      </div>
                      <div className="sms-line">
                        <div className="sms-line-txt">
                          <strong>Default sender ID</strong>
                          <p>PRSKOL</p>
                        </div>
                        <div className="sms-line-ctl">
                          <span className="sms-secret">PRSKOL</span>
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
                    </div>
                    <div className="sms-card-foot">
                      <span className="fs-12 text-muted">5 settings</span>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-light bg-white d-inline-flex align-items-center"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#sms_workspace"
                        aria-label="Open configuration workspace for Gateway"
                      >
                        <i className="ti ti-settings me-1" />
                        Configure
                      </button>
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <div className="sms-card">
                    <div className="sms-card-head">
                      <span className="sms-card-ic">
                        <i className="ti ti-key" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="sms-card-title">Authentication</p>
                        <p>Held encrypted at rest, never displayed in full</p>
                      </div>
                      <span className="sms-badge is-ok">Verified</span>
                    </div>
                    <div className="sms-card-body">
                      <div className="sms-line">
                        <div className="sms-line-txt">
                          <strong>Method</strong>
                          <p>Auth key in the request header</p>
                        </div>
                        <div className="sms-line-ctl">
                          <select
                            className="sms-select"
                            aria-label="Setting value"
                          >
                            <option>Auth key header</option>
                            <option>Basic auth</option>
                            <option>Bearer token</option>
                            <option>HMAC signature</option>
                          </select>
                        </div>
                      </div>
                      <div className="sms-line">
                        <div className="sms-line-txt">
                          <strong>API key</strong>
                          <p>4188••••••••••A1</p>
                        </div>
                        <div className="sms-line-ctl">
                          <span className="sms-secret">
                            <i className="ti ti-key" />
                            Set 14 Jan
                          </span>
                        </div>
                      </div>
                      <div className="sms-line">
                        <div className="sms-line-txt">
                          <strong>API secret</strong>
                          <p>Not required by this provider</p>
                        </div>
                        <div className="sms-line-ctl">
                          <span className="sms-secret">
                            <i className="ti ti-minus" />
                            N/A
                          </span>
                        </div>
                      </div>
                      <div className="sms-line">
                        <div className="sms-line-txt">
                          <strong>Key rotation</strong>
                          <p>Every 180 days — next on 12 Jan 2027</p>
                        </div>
                        <div className="sms-line-ctl">
                          <select
                            className="sms-select"
                            aria-label="Setting value"
                          >
                            <option>Every 180 days</option>
                            <option>Every 90 days</option>
                            <option>Manual only</option>
                          </select>
                        </div>
                      </div>
                      <div className="sms-line">
                        <div className="sms-line-txt">
                          <strong>Callback signature</strong>
                          <p>
                            Delivery receipts are verified before they are
                            trusted
                          </p>
                        </div>
                        <div className="sms-line-ctl">
                          <div className="form-check form-switch mb-0">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              role="switch"
                              id="sms_sw_9"
                              defaultChecked
                            />
                            <label
                              className="form-check-label visually-hidden"
                              htmlFor="sms_sw_9"
                            >
                              Enable
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="sms-card-foot">
                      <span className="fs-12 text-muted">5 settings</span>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-light bg-white d-inline-flex align-items-center"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#sms_workspace"
                        aria-label="Open configuration workspace for Authentication"
                      >
                        <i className="ti ti-settings me-1" />
                        Configure
                      </button>
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <div className="sms-card">
                    <div className="sms-card-head">
                      <span className="sms-card-ic">
                        <i className="ti ti-api" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="sms-card-title">API endpoint</p>
                        <p>What the ERP posts, and what comes back</p>
                      </div>
                      <span className="sms-badge is-ok">200 OK</span>
                    </div>
                    <div className="sms-card-body">
                      <span className="sms-lbl mt-2">Request</span>
                      <div className="sms-code">
                        POST https://api.msg91.com/api/v5/flow/
                        <br />
                        authkey: 4188∗∗∗∗∗∗∗∗∗∗A1
                        <br />
                        {"{"} "template_id": "6512a9f4d3", "sender": "PRSKOL",
                        <br />
                        &nbsp;&nbsp;"short_url": "0", "recipients": [ … ] {"}"}
                      </div>
                      <span className="sms-lbl mt-3">Response</span>
                      <div className="sms-code">
                        {"{"} "type": "success", "message": "5f2a91c8e4b0" {"}"}
                      </div>
                      <p className="fs-12 text-muted mb-0 mt-3">
                        Delivery receipts arrive separately on the callback URL
                        below. A message is not counted as delivered until that
                        receipt is in.
                      </p>
                    </div>
                    <div className="sms-card-foot">
                      <span className="fs-12 text-muted">
                        Average round trip 214 ms
                      </span>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-light bg-white d-inline-flex align-items-center"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#sms_workspace"
                        aria-label="Open configuration workspace for API endpoint"
                      >
                        <i className="ti ti-settings me-1" />
                        Configure
                      </button>
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <div className="sms-card">
                    <div className="sms-card-head">
                      <span className="sms-card-ic is-ok">
                        <i className="ti ti-activity-heartbeat" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="sms-card-title">Connection status</p>
                        <p>Checked every 15 minutes</p>
                      </div>
                      <span className="sms-badge is-ok">Connected</span>
                    </div>
                    <div className="sms-card-body">
                      <div className="sms-check">
                        <i className="ti ti-circle-check" />
                        <div>
                          Endpoint reachable over HTTPS
                          <span>
                            TLS 1.3, certificate valid until 02 Feb 2027.
                          </span>
                        </div>
                      </div>
                      <div className="sms-check">
                        <i className="ti ti-circle-check" />
                        <div>
                          Auth key accepted
                          <span>Verified at 09:41:02 today.</span>
                        </div>
                      </div>
                      <div className="sms-check">
                        <i className="ti ti-circle-check" />
                        <div>
                          Sender ID PRSKOL permitted on this account
                          <span>
                            Registered against DLT entity 1101459800000123456.
                          </span>
                        </div>
                      </div>
                      <div className="sms-check">
                        <i className="ti ti-circle-check" />
                        <div>
                          Delivery receipt callback reachable
                          <span>Last receipt processed 12 seconds ago.</span>
                        </div>
                      </div>
                      <div className="sms-check is-warn">
                        <i className="ti ti-alert-circle" />
                        <div>
                          Credits below the 2,00,000 alert threshold
                          <span>
                            1,84,220 remaining. At the current rate this lasts
                            to about 12 Oct.
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="sms-card-foot">
                      <span className="fs-12 text-muted">
                        5 checks · 214 ms
                      </span>
                      <button
                        type="button"
                        className="btn btn-sm btn-primary d-inline-flex align-items-center"
                        data-bs-toggle="modal"
                        data-bs-target="#sms_test"
                      >
                        <i className="ti ti-plug-connected me-1" />
                        Test now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="tab-pane fade"
              id="smspane-providers"
              role="tabpanel"
              aria-labelledby="smstab-providers"
              tabIndex={0}
            >
              <div className="d-flex align-items-end justify-content-between gap-3 flex-wrap mb-3">
                <div>
                  <span className="sms-lbl">Section 03</span>
                  <h2 className="sms-hero-title fs-20 mb-1">Providers</h2>
                  <p className="fs-13 text-muted mb-0">
                    Eight configured routes, one carrying traffic.
                  </p>
                </div>
              </div>
              <div className="d-flex align-items-center justify-content-between gap-3 flex-wrap mb-3">
                <p className="fs-13 text-muted mb-0">
                  Only the default route carries traffic. The rest stay
                  configured so a failover is a switch rather than a rebuild.
                  Prices are per message on the domestic transactional route.
                </p>
                <button
                  type="button"
                  className="btn btn-primary btn-sm d-inline-flex align-items-center"
                  data-bs-toggle="modal"
                  data-bs-target="#sms_provider"
                >
                  <i className="ti ti-plus me-1" />
                  Add provider
                </button>
              </div>
              <div className="row g-4">
                <div className="col-xxl-3 col-xl-6 col-lg-6 col-md-6">
                  <div className="sms-gw is-default">
                    <div className="sms-gw-top">
                      <span className="sms-gw-mark">
                        <i className="ti ti-building-broadcast-tower" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="sms-gw-name">MSG91</p>
                        <p>api.msg91.com/api/v5</p>
                      </div>
                    </div>
                    <div className="d-flex align-items-center gap-2 flex-wrap">
                      <span className="sms-badge is-ok">Live</span>
                      <span className="badge-meta">
                        <i className="ti ti-key" />
                        Auth key
                      </span>
                    </div>
                    <div className="sms-gw-facts">
                      <div className="sms-gw-fact">
                        <span>Route</span>
                        <strong>IN</strong>
                      </div>
                      <div className="sms-gw-fact">
                        <span>Latency</span>
                        <strong>214 ms</strong>
                      </div>
                      <div className="sms-gw-fact">
                        <span>Per SMS</span>
                        <strong>₹0.18</strong>
                      </div>
                    </div>
                    <div className="sms-gw-foot">
                      <div className="form-check form-switch mb-0">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          role="switch"
                          id="sms_sw_10"
                          defaultChecked
                        />
                        <label
                          className="form-check-label visually-hidden"
                          htmlFor="sms_sw_10"
                        >
                          Enable
                        </label>
                      </div>
                      <div className="d-flex align-items-center gap-2">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-light bg-white"
                          data-bs-toggle="offcanvas"
                          data-bs-target="#sms_workspace"
                          aria-label="Open configuration workspace for MSG91"
                        >
                          Configure
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-light bg-white disabled"
                          data-bs-toggle="modal"
                          data-bs-target="#sms_provider"
                        >
                          Default
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-3 col-xl-6 col-lg-6 col-md-6">
                  <div className="sms-gw">
                    <div className="sms-gw-top">
                      <span className="sms-gw-mark">
                        <i className="ti ti-brand-twilio" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="sms-gw-name">Twilio</p>
                        <p>api.twilio.com/2010-04-01</p>
                      </div>
                    </div>
                    <div className="d-flex align-items-center gap-2 flex-wrap">
                      <span className="sms-badge is-ok">Standby</span>
                      <span className="badge-meta">
                        <i className="ti ti-key" />
                        Basic auth
                      </span>
                    </div>
                    <div className="sms-gw-facts">
                      <div className="sms-gw-fact">
                        <span>Route</span>
                        <strong>Global</strong>
                      </div>
                      <div className="sms-gw-fact">
                        <span>Latency</span>
                        <strong>412 ms</strong>
                      </div>
                      <div className="sms-gw-fact">
                        <span>Per SMS</span>
                        <strong>₹0.62</strong>
                      </div>
                    </div>
                    <div className="sms-gw-foot">
                      <div className="form-check form-switch mb-0">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          role="switch"
                          id="sms_sw_11"
                          defaultChecked
                        />
                        <label
                          className="form-check-label visually-hidden"
                          htmlFor="sms_sw_11"
                        >
                          Enable
                        </label>
                      </div>
                      <div className="d-flex align-items-center gap-2">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-light bg-white"
                          data-bs-toggle="offcanvas"
                          data-bs-target="#sms_workspace"
                          aria-label="Open configuration workspace for Twilio"
                        >
                          Configure
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-light bg-white"
                          data-bs-toggle="modal"
                          data-bs-target="#sms_provider"
                        >
                          Default
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-3 col-xl-6 col-lg-6 col-md-6">
                  <div className="sms-gw">
                    <div className="sms-gw-top">
                      <span className="sms-gw-mark">
                        <i className="ti ti-message-2-code" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="sms-gw-name">Textlocal</p>
                        <p>api.textlocal.in/send</p>
                      </div>
                    </div>
                    <div className="d-flex align-items-center gap-2 flex-wrap">
                      <span className="sms-badge is-ok">Standby</span>
                      <span className="badge-meta">
                        <i className="ti ti-key" />
                        API key
                      </span>
                    </div>
                    <div className="sms-gw-facts">
                      <div className="sms-gw-fact">
                        <span>Route</span>
                        <strong>IN</strong>
                      </div>
                      <div className="sms-gw-fact">
                        <span>Latency</span>
                        <strong>268 ms</strong>
                      </div>
                      <div className="sms-gw-fact">
                        <span>Per SMS</span>
                        <strong>₹0.21</strong>
                      </div>
                    </div>
                    <div className="sms-gw-foot">
                      <div className="form-check form-switch mb-0">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          role="switch"
                          id="sms_sw_12"
                          defaultChecked
                        />
                        <label
                          className="form-check-label visually-hidden"
                          htmlFor="sms_sw_12"
                        >
                          Enable
                        </label>
                      </div>
                      <div className="d-flex align-items-center gap-2">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-light bg-white"
                          data-bs-toggle="offcanvas"
                          data-bs-target="#sms_workspace"
                          aria-label="Open configuration workspace for Textlocal"
                        >
                          Configure
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-light bg-white"
                          data-bs-toggle="modal"
                          data-bs-target="#sms_provider"
                        >
                          Default
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-3 col-xl-6 col-lg-6 col-md-6">
                  <div className="sms-gw">
                    <div className="sms-gw-top">
                      <span className="sms-gw-mark">
                        <i className="ti ti-phone-calling" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="sms-gw-name">Vonage</p>
                        <p>rest.nexmo.com/sms</p>
                      </div>
                    </div>
                    <div className="d-flex align-items-center gap-2 flex-wrap">
                      <span className="sms-badge is-ok">Standby</span>
                      <span className="badge-meta">
                        <i className="ti ti-key" />
                        Key + secret
                      </span>
                    </div>
                    <div className="sms-gw-facts">
                      <div className="sms-gw-fact">
                        <span>Route</span>
                        <strong>Global</strong>
                      </div>
                      <div className="sms-gw-fact">
                        <span>Latency</span>
                        <strong>388 ms</strong>
                      </div>
                      <div className="sms-gw-fact">
                        <span>Per SMS</span>
                        <strong>₹0.58</strong>
                      </div>
                    </div>
                    <div className="sms-gw-foot">
                      <div className="form-check form-switch mb-0">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          role="switch"
                          id="sms_sw_13"
                          defaultChecked
                        />
                        <label
                          className="form-check-label visually-hidden"
                          htmlFor="sms_sw_13"
                        >
                          Enable
                        </label>
                      </div>
                      <div className="d-flex align-items-center gap-2">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-light bg-white"
                          data-bs-toggle="offcanvas"
                          data-bs-target="#sms_workspace"
                          aria-label="Open configuration workspace for Vonage"
                        >
                          Configure
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-light bg-white"
                          data-bs-toggle="modal"
                          data-bs-target="#sms_provider"
                        >
                          Default
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-3 col-xl-6 col-lg-6 col-md-6">
                  <div className="sms-gw">
                    <div className="sms-gw-top">
                      <span className="sms-gw-mark">
                        <i className="ti ti-cloud-network" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="sms-gw-name">Plivo</p>
                        <p>api.plivo.com/v1</p>
                      </div>
                    </div>
                    <div className="d-flex align-items-center gap-2 flex-wrap">
                      <span className="sms-badge is-warn">Degraded</span>
                      <span className="badge-meta">
                        <i className="ti ti-key" />
                        Basic auth
                      </span>
                    </div>
                    <div className="sms-gw-facts">
                      <div className="sms-gw-fact">
                        <span>Route</span>
                        <strong>Global</strong>
                      </div>
                      <div className="sms-gw-fact">
                        <span>Latency</span>
                        <strong>904 ms</strong>
                      </div>
                      <div className="sms-gw-fact">
                        <span>Per SMS</span>
                        <strong>₹0.54</strong>
                      </div>
                    </div>
                    <div className="sms-gw-foot">
                      <div className="form-check form-switch mb-0">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          role="switch"
                          id="sms_sw_14"
                          defaultChecked
                        />
                        <label
                          className="form-check-label visually-hidden"
                          htmlFor="sms_sw_14"
                        >
                          Enable
                        </label>
                      </div>
                      <div className="d-flex align-items-center gap-2">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-light bg-white"
                          data-bs-toggle="offcanvas"
                          data-bs-target="#sms_workspace"
                          aria-label="Open configuration workspace for Plivo"
                        >
                          Configure
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-light bg-white"
                          data-bs-toggle="modal"
                          data-bs-target="#sms_provider"
                        >
                          Default
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-3 col-xl-6 col-lg-6 col-md-6">
                  <div className="sms-gw">
                    <div className="sms-gw-top">
                      <span className="sms-gw-mark">
                        <i className="ti ti-messages" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="sms-gw-name">Clickatell</p>
                        <p>platform.clickatell.com</p>
                      </div>
                    </div>
                    <div className="d-flex align-items-center gap-2 flex-wrap">
                      <span className="sms-badge is-ok">Standby</span>
                      <span className="badge-meta">
                        <i className="ti ti-key" />
                        API key
                      </span>
                    </div>
                    <div className="sms-gw-facts">
                      <div className="sms-gw-fact">
                        <span>Route</span>
                        <strong>Global</strong>
                      </div>
                      <div className="sms-gw-fact">
                        <span>Latency</span>
                        <strong>441 ms</strong>
                      </div>
                      <div className="sms-gw-fact">
                        <span>Per SMS</span>
                        <strong>₹0.66</strong>
                      </div>
                    </div>
                    <div className="sms-gw-foot">
                      <div className="form-check form-switch mb-0">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          role="switch"
                          id="sms_sw_15"
                          defaultChecked
                        />
                        <label
                          className="form-check-label visually-hidden"
                          htmlFor="sms_sw_15"
                        >
                          Enable
                        </label>
                      </div>
                      <div className="d-flex align-items-center gap-2">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-light bg-white"
                          data-bs-toggle="offcanvas"
                          data-bs-target="#sms_workspace"
                          aria-label="Open configuration workspace for Clickatell"
                        >
                          Configure
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-light bg-white"
                          data-bs-toggle="modal"
                          data-bs-target="#sms_provider"
                        >
                          Default
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-3 col-xl-6 col-lg-6 col-md-6">
                  <div className="sms-gw">
                    <div className="sms-gw-top">
                      <span className="sms-gw-mark">
                        <i className="ti ti-brand-aws" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="sms-gw-name">AWS SNS</p>
                        <p>sns.ap-south-1.amazonaws.com</p>
                      </div>
                    </div>
                    <div className="d-flex align-items-center gap-2 flex-wrap">
                      <span className="sms-badge is-ok">Standby</span>
                      <span className="badge-meta">
                        <i className="ti ti-key" />
                        IAM key
                      </span>
                    </div>
                    <div className="sms-gw-facts">
                      <div className="sms-gw-fact">
                        <span>Route</span>
                        <strong>IN</strong>
                      </div>
                      <div className="sms-gw-fact">
                        <span>Latency</span>
                        <strong>196 ms</strong>
                      </div>
                      <div className="sms-gw-fact">
                        <span>Per SMS</span>
                        <strong>₹0.24</strong>
                      </div>
                    </div>
                    <div className="sms-gw-foot">
                      <div className="form-check form-switch mb-0">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          role="switch"
                          id="sms_sw_16"
                          defaultChecked
                        />
                        <label
                          className="form-check-label visually-hidden"
                          htmlFor="sms_sw_16"
                        >
                          Enable
                        </label>
                      </div>
                      <div className="d-flex align-items-center gap-2">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-light bg-white"
                          data-bs-toggle="offcanvas"
                          data-bs-target="#sms_workspace"
                          aria-label="Open configuration workspace for AWS SNS"
                        >
                          Configure
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-light bg-white"
                          data-bs-toggle="modal"
                          data-bs-target="#sms_provider"
                        >
                          Default
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-3 col-xl-6 col-lg-6 col-md-6">
                  <div className="sms-gw is-off">
                    <div className="sms-gw-top">
                      <span className="sms-gw-mark">
                        <i className="ti ti-plug-connected-x" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="sms-gw-name">Custom REST API</p>
                        <p>sms.karkaii.local/send</p>
                      </div>
                    </div>
                    <div className="d-flex align-items-center gap-2 flex-wrap">
                      <span className="sms-badge is-bad">Disabled</span>
                      <span className="badge-meta">
                        <i className="ti ti-key" />
                        None
                      </span>
                    </div>
                    <div className="sms-gw-facts">
                      <div className="sms-gw-fact">
                        <span>Route</span>
                        <strong>Local</strong>
                      </div>
                      <div className="sms-gw-fact">
                        <span>Latency</span>
                        <strong>—</strong>
                      </div>
                      <div className="sms-gw-fact">
                        <span>Per SMS</span>
                        <strong>—</strong>
                      </div>
                    </div>
                    <div className="sms-gw-foot">
                      <div className="form-check form-switch mb-0">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          role="switch"
                          id="sms_sw_17"
                        />
                        <label
                          className="form-check-label visually-hidden"
                          htmlFor="sms_sw_17"
                        >
                          Enable
                        </label>
                      </div>
                      <div className="d-flex align-items-center gap-2">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-light bg-white"
                          data-bs-toggle="offcanvas"
                          data-bs-target="#sms_workspace"
                          aria-label="Open configuration workspace for Custom REST API"
                        >
                          Configure
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-light bg-white disabled"
                          data-bs-toggle="modal"
                          data-bs-target="#sms_provider"
                        >
                          Default
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="tab-pane fade"
              id="smspane-senders"
              role="tabpanel"
              aria-labelledby="smstab-senders"
              tabIndex={0}
            >
              <div className="d-flex align-items-end justify-content-between gap-3 flex-wrap mb-3">
                <div>
                  <span className="sms-lbl">Section 04</span>
                  <h2 className="sms-hero-title fs-20 mb-1">Sender IDs</h2>
                  <p className="fs-13 text-muted mb-0">
                    The six characters a message arrives under.
                  </p>
                </div>
              </div>
              <div className="d-flex align-items-center justify-content-between gap-3 flex-wrap mb-3">
                <p className="fs-13 text-muted mb-0">
                  Six characters, fixed, approved by the regulator before a
                  single message can carry them. Transactional and promotional
                  traffic must use different IDs.
                </p>
                <button
                  type="button"
                  className="btn btn-primary btn-sm d-inline-flex align-items-center"
                  data-bs-toggle="modal"
                  data-bs-target="#sms_verify"
                >
                  <i className="ti ti-plus me-1" />
                  Register sender ID
                </button>
              </div>
              <div className="row g-4">
                <div className="col-xxl-3 col-lg-6">
                  <div className="sms-sid">
                    <div className="sms-plate">PRSKOL</div>
                    <div>
                      <p className="sms-sid-name">Transactional sender</p>
                      <p>Fees, attendance, results and admissions</p>
                    </div>
                    <div className="sms-sid-facts">
                      <div>
                        <span>Country</span>
                        <span>India (+91)</span>
                      </div>
                      <div>
                        <span>Type</span>
                        <span>Transactional</span>
                      </div>
                      <div>
                        <span>Characters</span>
                        <span>6 of 6</span>
                      </div>
                      <div>
                        <span>DLT registration</span>
                        <span>Approved 14 Jan 2026</span>
                      </div>
                      <div>
                        <span>Used by</span>
                        <span>7 templates</span>
                      </div>
                    </div>
                    <div className="sms-sid-foot">
                      <span className="sms-badge is-ok">Verified</span>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-light bg-white"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#sms_workspace"
                        aria-label="Open configuration workspace for Transactional sender"
                      >
                        Configure
                      </button>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-3 col-lg-6">
                  <div className="sms-sid">
                    <div className="sms-plate">PRSKED</div>
                    <div>
                      <p className="sms-sid-name">Promotional sender</p>
                      <p>Newsletters, events and open-day invitations</p>
                    </div>
                    <div className="sms-sid-facts">
                      <div>
                        <span>Country</span>
                        <span>India (+91)</span>
                      </div>
                      <div>
                        <span>Type</span>
                        <span>Promotional</span>
                      </div>
                      <div>
                        <span>Characters</span>
                        <span>6 of 6</span>
                      </div>
                      <div>
                        <span>DLT registration</span>
                        <span>Approved 22 Feb 2026</span>
                      </div>
                      <div>
                        <span>Used by</span>
                        <span>2 templates</span>
                      </div>
                    </div>
                    <div className="sms-sid-foot">
                      <span className="sms-badge is-ok">Verified</span>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-light bg-white"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#sms_workspace"
                        aria-label="Open configuration workspace for Promotional sender"
                      >
                        Configure
                      </button>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-3 col-lg-6">
                  <div className="sms-sid">
                    <div className="sms-plate">PRSKOT</div>
                    <div>
                      <p className="sms-sid-name">OTP sender</p>
                      <p>One-time passwords for portal sign-in</p>
                    </div>
                    <div className="sms-sid-facts">
                      <div>
                        <span>Country</span>
                        <span>India (+91)</span>
                      </div>
                      <div>
                        <span>Type</span>
                        <span>Service implicit</span>
                      </div>
                      <div>
                        <span>Characters</span>
                        <span>6 of 6</span>
                      </div>
                      <div>
                        <span>DLT registration</span>
                        <span>Approved 14 Jan 2026</span>
                      </div>
                      <div>
                        <span>Used by</span>
                        <span>1 template</span>
                      </div>
                    </div>
                    <div className="sms-sid-foot">
                      <span className="sms-badge is-ok">Verified</span>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-light bg-white"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#sms_workspace"
                        aria-label="Open configuration workspace for OTP sender"
                      >
                        Configure
                      </button>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-3 col-lg-6">
                  <div className="sms-sid is-pending">
                    <div className="sms-plate">PRSKEM</div>
                    <div>
                      <p className="sms-sid-name">Emergency sender</p>
                      <p>Closures, safety notices and evacuation alerts</p>
                    </div>
                    <div className="sms-sid-facts">
                      <div>
                        <span>Country</span>
                        <span>India (+91)</span>
                      </div>
                      <div>
                        <span>Type</span>
                        <span>Transactional</span>
                      </div>
                      <div>
                        <span>Characters</span>
                        <span>6 of 6</span>
                      </div>
                      <div>
                        <span>DLT registration</span>
                        <span>Submitted 28 Jul 2026</span>
                      </div>
                      <div>
                        <span>Used by</span>
                        <span>Falls back to PRSKOL</span>
                      </div>
                    </div>
                    <div className="sms-sid-foot">
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-light bg-white"
                        data-bs-toggle="modal"
                        data-bs-target="#sms_verify"
                      >
                        Verify
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-light bg-white"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#sms_workspace"
                        aria-label="Open configuration workspace for Emergency sender"
                      >
                        Configure
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="tab-pane fade"
              id="smspane-templates"
              role="tabpanel"
              aria-labelledby="smstab-templates"
              tabIndex={0}
            >
              <div className="d-flex align-items-end justify-content-between gap-3 flex-wrap mb-3">
                <div>
                  <span className="sms-lbl">Section 05</span>
                  <h2 className="sms-hero-title fs-20 mb-1">Templates</h2>
                  <p className="fs-13 text-muted mb-0">
                    Ten messages the system knows how to write.
                  </p>
                </div>
              </div>
              <div className="d-flex align-items-center justify-content-between gap-3 flex-wrap mb-3">
                <p className="fs-13 text-muted mb-0">
                  Each template is shown as it will arrive on a handset, with
                  its character count against the 160-character segment
                  boundary. Anything past 160 costs two messages.
                </p>
                <button
                  type="button"
                  className="btn btn-primary btn-sm d-inline-flex align-items-center"
                  data-bs-toggle="modal"
                  data-bs-target="#sms_template"
                >
                  <i className="ti ti-plus me-1" />
                  New template
                </button>
              </div>
              <div className="row g-4">
                <div className="col-xxl-3 col-lg-6 col-md-6">
                  <div className="sms-tpl">
                    <div className="sms-tpl-head">
                      <div className="flex-fill overflow-hidden">
                        <p className="sms-tpl-name">Admission Confirmation</p>
                        <p>Sent when a seat is allotted</p>
                      </div>
                      <span className="sms-badge is-ok">Live</span>
                    </div>
                    <div className="sms-tpl-body">
                      <div className="sms-phone">
                        <span className="sms-phone-from">PRSKOL</span>
                        <div className="sms-bubble">
                          Dear{" "}
                          <code>
                            {"{"}guardian{"}"}
                          </code>
                          , admission of{" "}
                          <code>
                            {"{"}student{"}"}
                          </code>{" "}
                          to Class{" "}
                          <code>
                            {"{"}class{"}"}
                          </code>{" "}
                          is confirmed. Report on{" "}
                          <code>
                            {"{"}date{"}"}
                          </code>
                          . - Karkaii
                        </div>
                        <span className="sms-phone-time">09:14</span>
                      </div>
                      <div className="sms-seg mt-2">
                        <span className="sms-seg-track sms-p-80">
                          <span />
                        </span>
                        <span className="sms-seg-n">128/160 · 1 SMS</span>
                      </div>
                    </div>
                    <div className="sms-tpl-foot">
                      <span className="badge-meta">
                        <i className="ti ti-clock" />
                        09:14
                      </span>
                      <div className="d-flex align-items-center gap-1">
                        <button
                          type="button"
                          className="btn btn-sm btn-white border"
                          data-bs-toggle="offcanvas"
                          data-bs-target="#sms_workspace"
                          aria-label="Open configuration workspace for Admission Confirmation"
                        >
                          <i className="ti ti-eye" />
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-white border"
                          data-bs-toggle="modal"
                          data-bs-target="#sms_template"
                          aria-label="Customize Admission Confirmation"
                        >
                          <i className="ti ti-pencil" />
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-white border"
                          data-bs-toggle="modal"
                          data-bs-target="#sms_sendtest"
                          aria-label="Send test of Admission Confirmation"
                        >
                          <i className="ti ti-send" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-3 col-lg-6 col-md-6">
                  <div className="sms-tpl">
                    <div className="sms-tpl-head">
                      <div className="flex-fill overflow-hidden">
                        <p className="sms-tpl-name">OTP Verification</p>
                        <p>Portal sign-in, expires in 10 minutes</p>
                      </div>
                      <span className="sms-badge is-ok">Live</span>
                    </div>
                    <div className="sms-tpl-body">
                      <div className="sms-phone">
                        <span className="sms-phone-from">PRSKOT</span>
                        <div className="sms-bubble">
                          <code>
                            {"{"}otp{"}"}
                          </code>{" "}
                          is your Karkaii verification code. Valid for 10
                          minutes. Do not share it. - Karkaii
                        </div>
                        <span className="sms-phone-time">09:41</span>
                      </div>
                      <div className="sms-seg mt-2">
                        <span className="sms-seg-track sms-p-60">
                          <span />
                        </span>
                        <span className="sms-seg-n">96/160 · 1 SMS</span>
                      </div>
                    </div>
                    <div className="sms-tpl-foot">
                      <span className="badge-meta">
                        <i className="ti ti-clock" />
                        09:41
                      </span>
                      <div className="d-flex align-items-center gap-1">
                        <button
                          type="button"
                          className="btn btn-sm btn-white border"
                          data-bs-toggle="offcanvas"
                          data-bs-target="#sms_workspace"
                          aria-label="Open configuration workspace for OTP Verification"
                        >
                          <i className="ti ti-eye" />
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-white border"
                          data-bs-toggle="modal"
                          data-bs-target="#sms_template"
                          aria-label="Customize OTP Verification"
                        >
                          <i className="ti ti-pencil" />
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-white border"
                          data-bs-toggle="modal"
                          data-bs-target="#sms_sendtest"
                          aria-label="Send test of OTP Verification"
                        >
                          <i className="ti ti-send" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-3 col-lg-6 col-md-6">
                  <div className="sms-tpl">
                    <div className="sms-tpl-head">
                      <div className="flex-fill overflow-hidden">
                        <p className="sms-tpl-name">Attendance Alert</p>
                        <p>Sent at 11:00 on an unexplained absence</p>
                      </div>
                      <span className="sms-badge is-ok">Live</span>
                    </div>
                    <div className="sms-tpl-body">
                      <div className="sms-phone">
                        <span className="sms-phone-from">PRSKOL</span>
                        <div className="sms-bubble">
                          Dear{" "}
                          <code>
                            {"{"}guardian{"}"}
                          </code>
                          ,{" "}
                          <code>
                            {"{"}student{"}"}
                          </code>{" "}
                          was marked absent today. Please contact the class
                          teacher. - Karkaii
                        </div>
                        <span className="sms-phone-time">11:00</span>
                      </div>
                      <div className="sms-seg mt-2">
                        <span className="sms-seg-track sms-p-78">
                          <span />
                        </span>
                        <span className="sms-seg-n">124/160 · 1 SMS</span>
                      </div>
                    </div>
                    <div className="sms-tpl-foot">
                      <span className="badge-meta">
                        <i className="ti ti-clock" />
                        11:00
                      </span>
                      <div className="d-flex align-items-center gap-1">
                        <button
                          type="button"
                          className="btn btn-sm btn-white border"
                          data-bs-toggle="offcanvas"
                          data-bs-target="#sms_workspace"
                          aria-label="Open configuration workspace for Attendance Alert"
                        >
                          <i className="ti ti-eye" />
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-white border"
                          data-bs-toggle="modal"
                          data-bs-target="#sms_template"
                          aria-label="Customize Attendance Alert"
                        >
                          <i className="ti ti-pencil" />
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-white border"
                          data-bs-toggle="modal"
                          data-bs-target="#sms_sendtest"
                          aria-label="Send test of Attendance Alert"
                        >
                          <i className="ti ti-send" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-3 col-lg-6 col-md-6">
                  <div className="sms-tpl">
                    <div className="sms-tpl-head">
                      <div className="flex-fill overflow-hidden">
                        <p className="sms-tpl-name">Fee Reminder</p>
                        <p>Three before the due date, one after</p>
                      </div>
                      <span className="sms-badge is-ok">Live</span>
                    </div>
                    <div className="sms-tpl-body">
                      <div className="sms-phone">
                        <span className="sms-phone-from">PRSKOL</span>
                        <div className="sms-bubble">
                          Dear{" "}
                          <code>
                            {"{"}guardian{"}"}
                          </code>
                          , fee of Rs{" "}
                          <code>
                            {"{"}amount{"}"}
                          </code>{" "}
                          for{" "}
                          <code>
                            {"{"}student{"}"}
                          </code>{" "}
                          is due on{" "}
                          <code>
                            {"{"}date{"}"}
                          </code>
                          . Pay at the portal or the counter. - Karkaii
                        </div>
                        <span className="sms-phone-time">10:00</span>
                      </div>
                      <div className="sms-seg mt-2">
                        <span className="sms-seg-track sms-p-95">
                          <span />
                        </span>
                        <span className="sms-seg-n">152/160 · 1 SMS</span>
                      </div>
                    </div>
                    <div className="sms-tpl-foot">
                      <span className="badge-meta">
                        <i className="ti ti-clock" />
                        10:00
                      </span>
                      <div className="d-flex align-items-center gap-1">
                        <button
                          type="button"
                          className="btn btn-sm btn-white border"
                          data-bs-toggle="offcanvas"
                          data-bs-target="#sms_workspace"
                          aria-label="Open configuration workspace for Fee Reminder"
                        >
                          <i className="ti ti-eye" />
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-white border"
                          data-bs-toggle="modal"
                          data-bs-target="#sms_template"
                          aria-label="Customize Fee Reminder"
                        >
                          <i className="ti ti-pencil" />
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-white border"
                          data-bs-toggle="modal"
                          data-bs-target="#sms_sendtest"
                          aria-label="Send test of Fee Reminder"
                        >
                          <i className="ti ti-send" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-3 col-lg-6 col-md-6">
                  <div className="sms-tpl">
                    <div className="sms-tpl-head">
                      <div className="flex-fill overflow-hidden">
                        <p className="sms-tpl-name">Exam Schedule</p>
                        <p>Sent when a timetable is published</p>
                      </div>
                      <span className="sms-badge is-ok">Live</span>
                    </div>
                    <div className="sms-tpl-body">
                      <div className="sms-phone">
                        <span className="sms-phone-from">PRSKOL</span>
                        <div className="sms-bubble">
                          <code>
                            {"{"}exam{"}"}
                          </code>{" "}
                          timetable for Class{" "}
                          <code>
                            {"{"}class{"}"}
                          </code>{" "}
                          is published. First paper on{" "}
                          <code>
                            {"{"}date{"}"}
                          </code>
                          . See the portal for the full schedule. - Karkaii
                        </div>
                        <span className="sms-phone-time">16:30</span>
                      </div>
                      <div className="sms-seg mt-2">
                        <span className="sms-seg-track sms-p-99">
                          <span />
                        </span>
                        <span className="sms-seg-n">158/160 · 1 SMS</span>
                      </div>
                    </div>
                    <div className="sms-tpl-foot">
                      <span className="badge-meta">
                        <i className="ti ti-clock" />
                        16:30
                      </span>
                      <div className="d-flex align-items-center gap-1">
                        <button
                          type="button"
                          className="btn btn-sm btn-white border"
                          data-bs-toggle="offcanvas"
                          data-bs-target="#sms_workspace"
                          aria-label="Open configuration workspace for Exam Schedule"
                        >
                          <i className="ti ti-eye" />
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-white border"
                          data-bs-toggle="modal"
                          data-bs-target="#sms_template"
                          aria-label="Customize Exam Schedule"
                        >
                          <i className="ti ti-pencil" />
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-white border"
                          data-bs-toggle="modal"
                          data-bs-target="#sms_sendtest"
                          aria-label="Send test of Exam Schedule"
                        >
                          <i className="ti ti-send" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-3 col-lg-6 col-md-6">
                  <div className="sms-tpl">
                    <div className="sms-tpl-head">
                      <div className="flex-fill overflow-hidden">
                        <p className="sms-tpl-name">Exam Result</p>
                        <p>Sent when results are released</p>
                      </div>
                      <span className="sms-badge is-ok">Live</span>
                    </div>
                    <div className="sms-tpl-body">
                      <div className="sms-phone">
                        <span className="sms-phone-from">PRSKOL</span>
                        <div className="sms-bubble">
                          Results for{" "}
                          <code>
                            {"{"}exam{"}"}
                          </code>{" "}
                          are out.{" "}
                          <code>
                            {"{"}student{"}"}
                          </code>{" "}
                          scored{" "}
                          <code>
                            {"{"}marks{"}"}
                          </code>
                          . The full report card is on the parent portal. -
                          Karkaii
                        </div>
                        <span className="sms-phone-time">17:00</span>
                      </div>
                      <div className="sms-seg mt-2">
                        <span className="sms-seg-track sms-p-88">
                          <span />
                        </span>
                        <span className="sms-seg-n">141/160 · 1 SMS</span>
                      </div>
                    </div>
                    <div className="sms-tpl-foot">
                      <span className="badge-meta">
                        <i className="ti ti-clock" />
                        17:00
                      </span>
                      <div className="d-flex align-items-center gap-1">
                        <button
                          type="button"
                          className="btn btn-sm btn-white border"
                          data-bs-toggle="offcanvas"
                          data-bs-target="#sms_workspace"
                          aria-label="Open configuration workspace for Exam Result"
                        >
                          <i className="ti ti-eye" />
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-white border"
                          data-bs-toggle="modal"
                          data-bs-target="#sms_template"
                          aria-label="Customize Exam Result"
                        >
                          <i className="ti ti-pencil" />
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-white border"
                          data-bs-toggle="modal"
                          data-bs-target="#sms_sendtest"
                          aria-label="Send test of Exam Result"
                        >
                          <i className="ti ti-send" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-3 col-lg-6 col-md-6">
                  <div className="sms-tpl is-draft">
                    <div className="sms-tpl-head">
                      <div className="flex-fill overflow-hidden">
                        <p className="sms-tpl-name">Homework Reminder</p>
                        <p>Daily digest at 17:00</p>
                      </div>
                      <span className="sms-badge is-warn">Draft</span>
                    </div>
                    <div className="sms-tpl-body">
                      <div className="sms-phone">
                        <span className="sms-phone-from">PRSKOL</span>
                        <div className="sms-bubble">
                          Homework set for{" "}
                          <code>
                            {"{"}student{"}"}
                          </code>{" "}
                          in{" "}
                          <code>
                            {"{"}subject{"}"}
                          </code>
                          , due{" "}
                          <code>
                            {"{"}date{"}"}
                          </code>
                          . Details on the portal. - Karkaii
                        </div>
                        <span className="sms-phone-time">17:00</span>
                      </div>
                      <div className="sms-seg mt-2">
                        <span className="sms-seg-track sms-p-70">
                          <span />
                        </span>
                        <span className="sms-seg-n">112/160 · 1 SMS</span>
                      </div>
                    </div>
                    <div className="sms-tpl-foot">
                      <span className="badge-meta">
                        <i className="ti ti-clock" />
                        17:00
                      </span>
                      <div className="d-flex align-items-center gap-1">
                        <button
                          type="button"
                          className="btn btn-sm btn-white border"
                          data-bs-toggle="offcanvas"
                          data-bs-target="#sms_workspace"
                          aria-label="Open configuration workspace for Homework Reminder"
                        >
                          <i className="ti ti-eye" />
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-white border"
                          data-bs-toggle="modal"
                          data-bs-target="#sms_template"
                          aria-label="Customize Homework Reminder"
                        >
                          <i className="ti ti-pencil" />
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-white border"
                          data-bs-toggle="modal"
                          data-bs-target="#sms_sendtest"
                          aria-label="Send test of Homework Reminder"
                        >
                          <i className="ti ti-send" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-3 col-lg-6 col-md-6">
                  <div className="sms-tpl">
                    <div className="sms-tpl-head">
                      <div className="flex-fill overflow-hidden">
                        <p className="sms-tpl-name">Holiday Notice</p>
                        <p>Sent the evening before</p>
                      </div>
                      <span className="sms-badge is-ok">Live</span>
                    </div>
                    <div className="sms-tpl-body">
                      <div className="sms-phone">
                        <span className="sms-phone-from">PRSKED</span>
                        <div className="sms-bubble">
                          The school will remain closed on{" "}
                          <code>
                            {"{"}date{"}"}
                          </code>{" "}
                          for{" "}
                          <code>
                            {"{"}reason{"}"}
                          </code>
                          . Classes resume as usual the following working day. -
                          Karkaii
                        </div>
                        <span className="sms-phone-time">18:00</span>
                      </div>
                      <div className="sms-seg mt-2">
                        <span className="sms-seg-track sms-p-93">
                          <span />
                        </span>
                        <span className="sms-seg-n">149/160 · 1 SMS</span>
                      </div>
                    </div>
                    <div className="sms-tpl-foot">
                      <span className="badge-meta">
                        <i className="ti ti-clock" />
                        18:00
                      </span>
                      <div className="d-flex align-items-center gap-1">
                        <button
                          type="button"
                          className="btn btn-sm btn-white border"
                          data-bs-toggle="offcanvas"
                          data-bs-target="#sms_workspace"
                          aria-label="Open configuration workspace for Holiday Notice"
                        >
                          <i className="ti ti-eye" />
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-white border"
                          data-bs-toggle="modal"
                          data-bs-target="#sms_template"
                          aria-label="Customize Holiday Notice"
                        >
                          <i className="ti ti-pencil" />
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-white border"
                          data-bs-toggle="modal"
                          data-bs-target="#sms_sendtest"
                          aria-label="Send test of Holiday Notice"
                        >
                          <i className="ti ti-send" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-3 col-lg-6 col-md-6">
                  <div className="sms-tpl">
                    <div className="sms-tpl-head">
                      <div className="flex-fill overflow-hidden">
                        <p className="sms-tpl-name">Emergency Alert</p>
                        <p>Sent manually, bypasses quiet hours</p>
                      </div>
                      <span className="sms-badge is-bad">Emergency</span>
                    </div>
                    <div className="sms-tpl-body">
                      <div className="sms-phone">
                        <span className="sms-phone-from">PRSKOL</span>
                        <div className="sms-bubble">
                          URGENT:{" "}
                          <code>
                            {"{"}message{"}"}
                          </code>
                          . Please collect{" "}
                          <code>
                            {"{"}student{"}"}
                          </code>{" "}
                          from the main gate. Do not reply to this message. Call
                          044 4000 1200. - Karkaii
                        </div>
                        <span className="sms-phone-time">Any</span>
                      </div>
                      <div className="sms-seg is-over mt-2">
                        <span className="sms-seg-track sms-p-100">
                          <span />
                        </span>
                        <span className="sms-seg-n">168/160 · 2 SMS</span>
                      </div>
                    </div>
                    <div className="sms-tpl-foot">
                      <span className="badge-meta">
                        <i className="ti ti-clock" />
                        Any
                      </span>
                      <div className="d-flex align-items-center gap-1">
                        <button
                          type="button"
                          className="btn btn-sm btn-white border"
                          data-bs-toggle="offcanvas"
                          data-bs-target="#sms_workspace"
                          aria-label="Open configuration workspace for Emergency Alert"
                        >
                          <i className="ti ti-eye" />
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-white border"
                          data-bs-toggle="modal"
                          data-bs-target="#sms_template"
                          aria-label="Customize Emergency Alert"
                        >
                          <i className="ti ti-pencil" />
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-white border"
                          data-bs-toggle="modal"
                          data-bs-target="#sms_sendtest"
                          aria-label="Send test of Emergency Alert"
                        >
                          <i className="ti ti-send" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-3 col-lg-6 col-md-6">
                  <div className="sms-tpl is-draft">
                    <div className="sms-tpl-head">
                      <div className="flex-fill overflow-hidden">
                        <p className="sms-tpl-name">Birthday Wishes</p>
                        <p>Sent on the morning of the day</p>
                      </div>
                      <span className="sms-badge is-warn">Draft</span>
                    </div>
                    <div className="sms-tpl-body">
                      <div className="sms-phone">
                        <span className="sms-phone-from">PRSKED</span>
                        <div className="sms-bubble">
                          Happy birthday{" "}
                          <code>
                            {"{"}student{"}"}
                          </code>
                          ! Everyone at Karkaii wishes you a wonderful year
                          ahead. - Karkaii
                        </div>
                        <span className="sms-phone-time">08:00</span>
                      </div>
                      <div className="sms-seg mt-2">
                        <span className="sms-seg-track sms-p-65">
                          <span />
                        </span>
                        <span className="sms-seg-n">104/160 · 1 SMS</span>
                      </div>
                    </div>
                    <div className="sms-tpl-foot">
                      <span className="badge-meta">
                        <i className="ti ti-clock" />
                        08:00
                      </span>
                      <div className="d-flex align-items-center gap-1">
                        <button
                          type="button"
                          className="btn btn-sm btn-white border"
                          data-bs-toggle="offcanvas"
                          data-bs-target="#sms_workspace"
                          aria-label="Open configuration workspace for Birthday Wishes"
                        >
                          <i className="ti ti-eye" />
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-white border"
                          data-bs-toggle="modal"
                          data-bs-target="#sms_template"
                          aria-label="Customize Birthday Wishes"
                        >
                          <i className="ti ti-pencil" />
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-white border"
                          data-bs-toggle="modal"
                          data-bs-target="#sms_sendtest"
                          aria-label="Send test of Birthday Wishes"
                        >
                          <i className="ti ti-send" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="tab-pane fade"
              id="smspane-rules"
              role="tabpanel"
              aria-labelledby="smstab-rules"
              tabIndex={0}
            >
              <div className="d-flex align-items-end justify-content-between gap-3 flex-wrap mb-3">
                <div>
                  <span className="sms-lbl">Section 06</span>
                  <h2 className="sms-hero-title fs-20 mb-1">
                    Notification Rules
                  </h2>
                  <p className="fs-13 text-muted mb-0">
                    What the system texts without being asked.
                  </p>
                </div>
              </div>
              <div className="d-flex align-items-center justify-content-between gap-3 flex-wrap mb-3">
                <p className="fs-13 text-muted mb-0">
                  What the system texts on its own. Each rule names its audience
                  and the sender ID it goes out under, so nothing reaches a
                  family on the wrong route.
                </p>
                <span className="sms-badge is-accent">
                  Quiet hours 21:00 – 09:00
                </span>
              </div>
              <div className="sms-rule">
                <span className="sms-rule-ic">
                  <i className="ti ti-calendar-x" />
                </span>
                <div className="sms-rule-body">
                  <strong>Unexplained absence</strong>
                  <p>
                    Sent once attendance is locked for the morning session, and
                    only if no leave was recorded.
                  </p>
                  <div className="d-flex align-items-center gap-2 flex-wrap mt-2">
                    <span className="badge-meta">
                      <i className="ti ti-users" />
                      Primary guardian
                    </span>
                    <span className="badge-meta">
                      <i className="ti ti-send" />
                      PRSKOL · 11:00
                    </span>
                  </div>
                </div>
                <div className="sms-rule-ctl">
                  <div className="form-check form-switch mb-0">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      role="switch"
                      id="sms_sw_18"
                      defaultChecked
                    />
                    <label
                      className="form-check-label visually-hidden"
                      htmlFor="sms_sw_18"
                    >
                      Enable
                    </label>
                  </div>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-light bg-white"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#sms_workspace"
                    aria-label="Open configuration workspace for Unexplained absence"
                  >
                    Configure
                  </button>
                </div>
              </div>
              <div className="sms-rule">
                <span className="sms-rule-ic">
                  <i className="ti ti-cash" />
                </span>
                <div className="sms-rule-body">
                  <strong>Fee due and overdue</strong>
                  <p>
                    Three reminders before the due date, one after. Never more
                    than one message a day per family.
                  </p>
                  <div className="d-flex align-items-center gap-2 flex-wrap mt-2">
                    <span className="badge-meta">
                      <i className="ti ti-users" />
                      Primary guardian
                    </span>
                    <span className="badge-meta">
                      <i className="ti ti-send" />
                      PRSKOL · 10:00
                    </span>
                  </div>
                </div>
                <div className="sms-rule-ctl">
                  <div className="form-check form-switch mb-0">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      role="switch"
                      id="sms_sw_19"
                      defaultChecked
                    />
                    <label
                      className="form-check-label visually-hidden"
                      htmlFor="sms_sw_19"
                    >
                      Enable
                    </label>
                  </div>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-light bg-white"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#sms_workspace"
                    aria-label="Open configuration workspace for Fee due and overdue"
                  >
                    Configure
                  </button>
                </div>
              </div>
              <div className="sms-rule">
                <span className="sms-rule-ic">
                  <i className="ti ti-lock" />
                </span>
                <div className="sms-rule-body">
                  <strong>OTP for portal sign-in</strong>
                  <p>
                    Highest priority route. Bypasses the queue and the send
                    window entirely.
                  </p>
                  <div className="d-flex align-items-center gap-2 flex-wrap mt-2">
                    <span className="badge-meta">
                      <i className="ti ti-users" />
                      The person signing in
                    </span>
                    <span className="badge-meta">
                      <i className="ti ti-send" />
                      PRSKOT · instant
                    </span>
                  </div>
                </div>
                <div className="sms-rule-ctl">
                  <div className="form-check form-switch mb-0">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      role="switch"
                      id="sms_sw_20"
                      defaultChecked
                    />
                    <label
                      className="form-check-label visually-hidden"
                      htmlFor="sms_sw_20"
                    >
                      Enable
                    </label>
                  </div>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-light bg-white"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#sms_workspace"
                    aria-label="Open configuration workspace for OTP for portal sign-in"
                  >
                    Configure
                  </button>
                </div>
              </div>
              <div className="sms-rule">
                <span className="sms-rule-ic">
                  <i className="ti ti-file-certificate" />
                </span>
                <div className="sms-rule-body">
                  <strong>Results released</strong>
                  <p>
                    Held until the class teacher signs off, so no result reaches
                    a family early.
                  </p>
                  <div className="d-flex align-items-center gap-2 flex-wrap mt-2">
                    <span className="badge-meta">
                      <i className="ti ti-users" />
                      Guardian and student
                    </span>
                    <span className="badge-meta">
                      <i className="ti ti-send" />
                      PRSKOL · 17:00
                    </span>
                  </div>
                </div>
                <div className="sms-rule-ctl">
                  <div className="form-check form-switch mb-0">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      role="switch"
                      id="sms_sw_21"
                      defaultChecked
                    />
                    <label
                      className="form-check-label visually-hidden"
                      htmlFor="sms_sw_21"
                    >
                      Enable
                    </label>
                  </div>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-light bg-white"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#sms_workspace"
                    aria-label="Open configuration workspace for Results released"
                  >
                    Configure
                  </button>
                </div>
              </div>
              <div className="sms-rule is-off">
                <span className="sms-rule-ic">
                  <i className="ti ti-book" />
                </span>
                <div className="sms-rule-body">
                  <strong>Homework digest</strong>
                  <p>
                    Off while the template is a draft. Would send one digest
                    rather than a message per subject.
                  </p>
                  <div className="d-flex align-items-center gap-2 flex-wrap mt-2">
                    <span className="badge-meta">
                      <i className="ti ti-users" />
                      Guardians of the class
                    </span>
                    <span className="badge-meta">
                      <i className="ti ti-send" />
                      PRSKOL · 17:00
                    </span>
                  </div>
                </div>
                <div className="sms-rule-ctl">
                  <div className="form-check form-switch mb-0">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      role="switch"
                      id="sms_sw_22"
                    />
                    <label
                      className="form-check-label visually-hidden"
                      htmlFor="sms_sw_22"
                    >
                      Enable
                    </label>
                  </div>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-light bg-white"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#sms_workspace"
                    aria-label="Open configuration workspace for Homework digest"
                  >
                    Configure
                  </button>
                </div>
              </div>
              <div className="sms-rule">
                <span className="sms-rule-ic">
                  <i className="ti ti-alert-triangle" />
                </span>
                <div className="sms-rule-body">
                  <strong>Emergency alert</strong>
                  <p>
                    Sent manually by the Principal or Vice-Principal only.
                    Ignores quiet hours and opt-outs.
                  </p>
                  <div className="d-flex align-items-center gap-2 flex-wrap mt-2">
                    <span className="badge-meta">
                      <i className="ti ti-users" />
                      Every guardian in scope
                    </span>
                    <span className="badge-meta">
                      <i className="ti ti-send" />
                      PRSKOL · immediate
                    </span>
                  </div>
                </div>
                <div className="sms-rule-ctl">
                  <div className="form-check form-switch mb-0">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      role="switch"
                      id="sms_sw_23"
                      defaultChecked
                    />
                    <label
                      className="form-check-label visually-hidden"
                      htmlFor="sms_sw_23"
                    >
                      Enable
                    </label>
                  </div>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-light bg-white"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#sms_workspace"
                    aria-label="Open configuration workspace for Emergency alert"
                  >
                    Configure
                  </button>
                </div>
              </div>
              <div className="sms-rule is-off">
                <span className="sms-rule-ic">
                  <i className="ti ti-cake" />
                </span>
                <div className="sms-rule-body">
                  <strong>Birthday wishes</strong>
                  <p>
                    Promotional route, so an opted-out family receives nothing.
                    Currently a draft.
                  </p>
                  <div className="d-flex align-items-center gap-2 flex-wrap mt-2">
                    <span className="badge-meta">
                      <i className="ti ti-users" />
                      The student
                    </span>
                    <span className="badge-meta">
                      <i className="ti ti-send" />
                      PRSKED · 08:00
                    </span>
                  </div>
                </div>
                <div className="sms-rule-ctl">
                  <div className="form-check form-switch mb-0">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      role="switch"
                      id="sms_sw_24"
                    />
                    <label
                      className="form-check-label visually-hidden"
                      htmlFor="sms_sw_24"
                    >
                      Enable
                    </label>
                  </div>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-light bg-white"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#sms_workspace"
                    aria-label="Open configuration workspace for Birthday wishes"
                  >
                    Configure
                  </button>
                </div>
              </div>
            </div>
            <div
              className="tab-pane fade"
              id="smspane-delivery"
              role="tabpanel"
              aria-labelledby="smstab-delivery"
              tabIndex={0}
            >
              <div className="d-flex align-items-end justify-content-between gap-3 flex-wrap mb-3">
                <div>
                  <span className="sms-lbl">Section 07</span>
                  <h2 className="sms-hero-title fs-20 mb-1">
                    Delivery Policies
                  </h2>
                  <p className="fs-13 text-muted mb-0">
                    What goes instantly, what waits, and what the ceilings are.
                  </p>
                </div>
              </div>
              <div className="row g-4">
                <div className="col-12">
                  <div className="sms-card">
                    <div className="sms-card-head">
                      <span className="sms-card-ic">
                        <i className="ti ti-bolt" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="sms-card-title">Instant delivery</p>
                        <p>What goes out the moment it is created</p>
                      </div>
                      <span className="sms-badge is-ok">4 types</span>
                    </div>
                    <div className="sms-card-body">
                      <div className="sms-line">
                        <div className="sms-line-txt">
                          <strong>OTP and password reset</strong>
                          <p>Never queued, never delayed</p>
                        </div>
                        <div className="sms-line-ctl">
                          <div className="form-check form-switch mb-0">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              role="switch"
                              id="sms_sw_25"
                              defaultChecked
                            />
                            <label
                              className="form-check-label visually-hidden"
                              htmlFor="sms_sw_25"
                            >
                              Enable
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="sms-line">
                        <div className="sms-line-txt">
                          <strong>Emergency alerts</strong>
                          <p>Bypasses quiet hours and the daily ceiling</p>
                        </div>
                        <div className="sms-line-ctl">
                          <div className="form-check form-switch mb-0">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              role="switch"
                              id="sms_sw_26"
                              defaultChecked
                            />
                            <label
                              className="form-check-label visually-hidden"
                              htmlFor="sms_sw_26"
                            >
                              Enable
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="sms-line">
                        <div className="sms-line-txt">
                          <strong>Absence alerts</strong>
                          <p>Sent as soon as attendance is locked</p>
                        </div>
                        <div className="sms-line-ctl">
                          <div className="form-check form-switch mb-0">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              role="switch"
                              id="sms_sw_27"
                              defaultChecked
                            />
                            <label
                              className="form-check-label visually-hidden"
                              htmlFor="sms_sw_27"
                            >
                              Enable
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="sms-line">
                        <div className="sms-line-txt">
                          <strong>Everything else</strong>
                          <p>Queued and sent at the configured rate</p>
                        </div>
                        <div className="sms-line-ctl">
                          <div className="form-check form-switch mb-0">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              role="switch"
                              id="sms_sw_28"
                            />
                            <label
                              className="form-check-label visually-hidden"
                              htmlFor="sms_sw_28"
                            >
                              Enable
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="sms-card-foot">
                      <span className="fs-12 text-muted">4 settings</span>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-light bg-white d-inline-flex align-items-center"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#sms_workspace"
                        aria-label="Open configuration workspace for Instant delivery"
                      >
                        <i className="ti ti-settings me-1" />
                        Configure
                      </button>
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <div className="sms-card">
                    <div className="sms-card-head">
                      <span className="sms-card-ic">
                        <i className="ti ti-calendar-time" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="sms-card-title">Scheduled messages</p>
                        <p>What waits for the right moment</p>
                      </div>
                      <span className="sms-badge is-accent">3 waiting</span>
                    </div>
                    <div className="sms-card-body">
                      <div className="sms-line">
                        <div className="sms-line-txt">
                          <strong>Send window</strong>
                          <p>Nothing leaves between 21:00 and 09:00</p>
                        </div>
                        <div className="sms-line-ctl">
                          <select
                            className="sms-select"
                            aria-label="Setting value"
                          >
                            <option>09:00 – 21:00</option>
                            <option>24 hours</option>
                            <option>08:00 – 20:00</option>
                          </select>
                        </div>
                      </div>
                      <div className="sms-line">
                        <div className="sms-line-txt">
                          <strong>Out-of-window behaviour</strong>
                          <p>Hold until the window opens</p>
                        </div>
                        <div className="sms-line-ctl">
                          <select
                            className="sms-select"
                            aria-label="Setting value"
                          >
                            <option>Hold until 09:00</option>
                            <option>Send anyway</option>
                            <option>Discard</option>
                          </select>
                        </div>
                      </div>
                      <div className="sms-line">
                        <div className="sms-line-txt">
                          <strong>Scheduled sends</strong>
                          <p>3 queued for tomorrow morning</p>
                        </div>
                        <div className="sms-line-ctl">
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-light bg-white"
                            data-bs-toggle="offcanvas"
                            data-bs-target="#sms_workspace"
                            aria-label="Open configuration workspace for Scheduled sends"
                          >
                            View
                          </button>
                        </div>
                      </div>
                      <div className="sms-line">
                        <div className="sms-line-txt">
                          <strong>Timezone</strong>
                          <p>Asia/Kolkata — the school’s local time</p>
                        </div>
                        <div className="sms-line-ctl">
                          <select
                            className="sms-select"
                            aria-label="Setting value"
                          >
                            <option>Asia/Kolkata</option>
                            <option>UTC</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className="sms-card-foot">
                      <span className="fs-12 text-muted">4 settings</span>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-light bg-white d-inline-flex align-items-center"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#sms_workspace"
                        aria-label="Open configuration workspace for Scheduled messages"
                      >
                        <i className="ti ti-settings me-1" />
                        Configure
                      </button>
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <div className="sms-card">
                    <div className="sms-card-head">
                      <span className="sms-card-ic is-warn">
                        <i className="ti ti-gauge" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="sms-card-title">Limits</p>
                        <p>Ceilings that protect the credit balance</p>
                      </div>
                      <span className="sms-badge is-warn">62% of daily</span>
                    </div>
                    <div className="sms-card-body">
                      <div className="sms-line">
                        <div className="sms-line-txt">
                          <strong>Daily limit</strong>
                          <p>25,000 messages</p>
                        </div>
                        <div className="sms-line-ctl">
                          <input
                            type="text"
                            className="sms-input is-mono"
                            defaultValue={25000}
                            aria-label="Setting value"
                          />
                        </div>
                      </div>
                      <div className="sms-line">
                        <div className="sms-line-txt">
                          <strong>Per-recipient daily cap</strong>
                          <p>4 messages to one number</p>
                        </div>
                        <div className="sms-line-ctl">
                          <input
                            type="text"
                            className="sms-input is-mono"
                            defaultValue={4}
                            aria-label="Setting value"
                          />
                        </div>
                      </div>
                      <div className="sms-line">
                        <div className="sms-line-txt">
                          <strong>Bulk send ceiling</strong>
                          <p>2,000 recipients per campaign</p>
                        </div>
                        <div className="sms-line-ctl">
                          <input
                            type="text"
                            className="sms-input is-mono"
                            defaultValue={2000}
                            aria-label="Setting value"
                          />
                        </div>
                      </div>
                      <div className="sms-line">
                        <div className="sms-line-txt">
                          <strong>On reaching the limit</strong>
                          <p>Hold in the queue rather than fail</p>
                        </div>
                        <div className="sms-line-ctl">
                          <select
                            className="sms-select"
                            aria-label="Setting value"
                          >
                            <option>Hold in queue</option>
                            <option>Fail immediately</option>
                            <option>Overflow to standby route</option>
                          </select>
                        </div>
                      </div>
                      <div className="sms-line">
                        <div className="sms-line-txt">
                          <strong>Low credit alert</strong>
                          <p>Notify when the balance falls below 2,00,000</p>
                        </div>
                        <div className="sms-line-ctl">
                          <div className="form-check form-switch mb-0">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              role="switch"
                              id="sms_sw_29"
                              defaultChecked
                            />
                            <label
                              className="form-check-label visually-hidden"
                              htmlFor="sms_sw_29"
                            >
                              Enable
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="sms-card-foot">
                      <span className="fs-12 text-muted">5 settings</span>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-light bg-white d-inline-flex align-items-center"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#sms_workspace"
                        aria-label="Open configuration workspace for Limits"
                      >
                        <i className="ti ti-settings me-1" />
                        Configure
                      </button>
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <div className="sms-card">
                    <div className="sms-card-head">
                      <span className="sms-card-ic">
                        <i className="ti ti-report-analytics" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="sms-card-title">Delivery reports</p>
                        <p>How the school learns what arrived</p>
                      </div>
                      <span className="sms-badge is-ok">DLR on</span>
                    </div>
                    <div className="sms-card-body">
                      <div className="sms-line">
                        <div className="sms-line-txt">
                          <strong>Delivery receipts</strong>
                          <p>
                            Requested on every message and recorded against it
                          </p>
                        </div>
                        <div className="sms-line-ctl">
                          <div className="form-check form-switch mb-0">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              role="switch"
                              id="sms_sw_30"
                              defaultChecked
                            />
                            <label
                              className="form-check-label visually-hidden"
                              htmlFor="sms_sw_30"
                            >
                              Enable
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="sms-line">
                        <div className="sms-line-txt">
                          <strong>Callback URL</strong>
                          <p>https://karkaii.edu/hooks/sms/dlr</p>
                        </div>
                        <div className="sms-line-ctl">
                          <input
                            type="text"
                            className="sms-input is-mono"
                            defaultValue="https://karkaii.edu/hooks/sms/dlr"
                            aria-label="Setting value"
                          />
                        </div>
                      </div>
                      <div className="sms-line">
                        <div className="sms-line-txt">
                          <strong>Failure notification</strong>
                          <p>
                            Alert the office when a number fails three times
                          </p>
                        </div>
                        <div className="sms-line-ctl">
                          <div className="form-check form-switch mb-0">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              role="switch"
                              id="sms_sw_31"
                              defaultChecked
                            />
                            <label
                              className="form-check-label visually-hidden"
                              htmlFor="sms_sw_31"
                            >
                              Enable
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="sms-line">
                        <div className="sms-line-txt">
                          <strong>Report retention</strong>
                          <p>90 days</p>
                        </div>
                        <div className="sms-line-ctl">
                          <select
                            className="sms-select"
                            aria-label="Setting value"
                          >
                            <option>90 days</option>
                            <option>1 year</option>
                            <option>3 academic years</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className="sms-card-foot">
                      <span className="fs-12 text-muted">4 settings</span>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-light bg-white d-inline-flex align-items-center"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#sms_workspace"
                        aria-label="Open configuration workspace for Delivery reports"
                      >
                        <i className="ti ti-settings me-1" />
                        Configure
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="tab-pane fade"
              id="smspane-routing"
              role="tabpanel"
              aria-labelledby="smstab-routing"
              tabIndex={0}
            >
              <div className="d-flex align-items-end justify-content-between gap-3 flex-wrap mb-3">
                <div>
                  <span className="sms-lbl">Section 08</span>
                  <h2 className="sms-hero-title fs-20 mb-1">Routing</h2>
                  <p className="fs-13 text-muted mb-0">
                    Which message travels which way.
                  </p>
                </div>
              </div>
              <p className="fs-13 text-muted mb-3">
                Which message travels which way. Priority routing exists because
                an OTP that arrives in ninety seconds is worthless, while a
                birthday message can wait.
              </p>
              <div className="row g-4">
                <div className="col-12">
                  <div className="sms-card">
                    <div className="sms-card-head">
                      <span className="sms-card-ic">
                        <i className="ti ti-route" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="sms-card-title">Priority routing</p>
                        <p>Which message overtakes which</p>
                      </div>
                      <span className="sms-badge is-accent">4 levels</span>
                    </div>
                    <div className="sms-card-body">
                      <div className="sms-line">
                        <div className="sms-line-txt">
                          <strong>Critical · OTP, emergency alerts</strong>
                          <p>Sent ahead of everything, on the fastest route</p>
                        </div>
                        <div className="sms-line-ctl">
                          <span className="sms-badge is-bad">1</span>
                        </div>
                      </div>
                      <div className="sms-line">
                        <div className="sms-line-txt">
                          <strong>High · absence, results, admissions</strong>
                          <p>Transactional route, sent within a minute</p>
                        </div>
                        <div className="sms-line-ctl">
                          <span className="sms-badge is-warn">2</span>
                        </div>
                      </div>
                      <div className="sms-line">
                        <div className="sms-line-txt">
                          <strong>Normal · fee reminders, schedules</strong>
                          <p>Transactional route, queued</p>
                        </div>
                        <div className="sms-line-ctl">
                          <span className="sms-badge is-accent">3</span>
                        </div>
                      </div>
                      <div className="sms-line">
                        <div className="sms-line-txt">
                          <strong>Bulk · newsletters, birthdays</strong>
                          <p>Promotional route, sent when the queue is quiet</p>
                        </div>
                        <div className="sms-line-ctl">
                          <span className="sms-badge">4</span>
                        </div>
                      </div>
                    </div>
                    <div className="sms-card-foot">
                      <span className="fs-12 text-muted">4 levels</span>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-light bg-white d-inline-flex align-items-center"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#sms_workspace"
                        aria-label="Open configuration workspace for Priority routing"
                      >
                        <i className="ti ti-settings me-1" />
                        Configure
                      </button>
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <div className="sms-card">
                    <div className="sms-card-head">
                      <span className="sms-card-ic">
                        <i className="ti ti-arrows-shuffle" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="sms-card-title">Failover</p>
                        <p>
                          What happens when the default route stops answering
                        </p>
                      </div>
                      <span className="sms-badge is-ok">Armed</span>
                    </div>
                    <div className="sms-card-body">
                      <div className="sms-line">
                        <div className="sms-line-txt">
                          <strong>Automatic failover</strong>
                          <p>
                            Switch to the standby provider after 3 consecutive
                            failures
                          </p>
                        </div>
                        <div className="sms-line-ctl">
                          <div className="form-check form-switch mb-0">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              role="switch"
                              id="sms_sw_32"
                              defaultChecked
                            />
                            <label
                              className="form-check-label visually-hidden"
                              htmlFor="sms_sw_32"
                            >
                              Enable
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="sms-line">
                        <div className="sms-line-txt">
                          <strong>Standby provider</strong>
                          <p>Twilio — costs more, so it is not the default</p>
                        </div>
                        <div className="sms-line-ctl">
                          <select
                            className="sms-select"
                            aria-label="Setting value"
                          >
                            <option>Twilio</option>
                            <option>Textlocal</option>
                            <option>AWS SNS</option>
                          </select>
                        </div>
                      </div>
                      <div className="sms-line">
                        <div className="sms-line-txt">
                          <strong>Failback</strong>
                          <p>
                            Return to MSG91 once it answers cleanly for 10
                            minutes
                          </p>
                        </div>
                        <div className="sms-line-ctl">
                          <div className="form-check form-switch mb-0">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              role="switch"
                              id="sms_sw_33"
                              defaultChecked
                            />
                            <label
                              className="form-check-label visually-hidden"
                              htmlFor="sms_sw_33"
                            >
                              Enable
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="sms-line">
                        <div className="sms-line-txt">
                          <strong>Notify on failover</strong>
                          <p>Alert the IT administrator immediately</p>
                        </div>
                        <div className="sms-line-ctl">
                          <div className="form-check form-switch mb-0">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              role="switch"
                              id="sms_sw_34"
                              defaultChecked
                            />
                            <label
                              className="form-check-label visually-hidden"
                              htmlFor="sms_sw_34"
                            >
                              Enable
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="sms-card-foot">
                      <span className="fs-12 text-muted">4 settings</span>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-light bg-white d-inline-flex align-items-center"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#sms_workspace"
                        aria-label="Open configuration workspace for Failover"
                      >
                        <i className="ti ti-settings me-1" />
                        Configure
                      </button>
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <span className="sms-lbl">Custom routing rules</span>
                  <div className="sms-empty">
                    <i className="ti ti-route-off" />
                    <h3 className="fs-15 fw-medium">No custom routing rules</h3>
                    <p>
                      Messages follow the priority table above. A custom rule
                      would let you send, for example, all traffic to a
                      particular operator through a different provider. Most
                      schools never need one.
                    </p>
                    <button
                      type="button"
                      className="btn btn-outline-light bg-white btn-sm d-inline-flex align-items-center"
                      data-bs-toggle="offcanvas"
                      data-bs-target="#sms_workspace"
                      aria-label="Open configuration workspace for Custom routing rules"
                    >
                      <i className="ti ti-plus me-1" />
                      Add a routing rule
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="tab-pane fade"
              id="smspane-retry"
              role="tabpanel"
              aria-labelledby="smstab-retry"
              tabIndex={0}
            >
              <div className="d-flex align-items-end justify-content-between gap-3 flex-wrap mb-3">
                <div>
                  <span className="sms-lbl">Section 09</span>
                  <h2 className="sms-hero-title fs-20 mb-1">Retry Policies</h2>
                  <p className="fs-13 text-muted mb-0">
                    What happens when a message does not arrive.
                  </p>
                </div>
              </div>
              <div className="row g-4">
                <div className="col-12">
                  <div className="sms-card">
                    <div className="sms-card-head">
                      <span className="sms-card-ic">
                        <i className="ti ti-refresh" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="sms-card-title">Retry attempts</p>
                        <p>How persistent the sender should be</p>
                      </div>
                      <span className="sms-badge">3 attempts</span>
                    </div>
                    <div className="sms-card-body">
                      <div className="sms-line">
                        <div className="sms-line-txt">
                          <strong>Attempts</strong>
                          <p>3, then the message is failed</p>
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
                      <div className="sms-line">
                        <div className="sms-line-txt">
                          <strong>Backoff</strong>
                          <p>2 min, 15 min, 1 hour</p>
                        </div>
                        <div className="sms-line-ctl">
                          <select
                            className="sms-select"
                            aria-label="Setting value"
                          >
                            <option>2 min / 15 min / 1 hour</option>
                            <option>Fixed 10 minutes</option>
                            <option>Fixed 30 minutes</option>
                          </select>
                        </div>
                      </div>
                      <div className="sms-line">
                        <div className="sms-line-txt">
                          <strong>Retry on the standby route</strong>
                          <p>
                            After the second failure, try a different provider
                          </p>
                        </div>
                        <div className="sms-line-ctl">
                          <div className="form-check form-switch mb-0">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              role="switch"
                              id="sms_sw_35"
                              defaultChecked
                            />
                            <label
                              className="form-check-label visually-hidden"
                              htmlFor="sms_sw_35"
                            >
                              Enable
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="sms-line">
                        <div className="sms-line-txt">
                          <strong>Give up after</strong>
                          <p>4 hours, whatever the attempt count</p>
                        </div>
                        <div className="sms-line-ctl">
                          <input
                            type="text"
                            className="sms-input is-mono"
                            defaultValue={4}
                            aria-label="Setting value"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="sms-card-foot">
                      <span className="fs-12 text-muted">4 settings</span>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-light bg-white d-inline-flex align-items-center"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#sms_workspace"
                        aria-label="Open configuration workspace for Retry attempts"
                      >
                        <i className="ti ti-settings me-1" />
                        Configure
                      </button>
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <div className="sms-card">
                    <div className="sms-card-head">
                      <span className="sms-card-ic is-warn">
                        <i className="ti ti-mail-off" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="sms-card-title">Failure handling</p>
                        <p>What happens once retries are exhausted</p>
                      </div>
                      <span className="sms-badge is-warn">18 today</span>
                    </div>
                    <div className="sms-card-body">
                      <div className="sms-line">
                        <div className="sms-line-txt">
                          <strong>Flag the number</strong>
                          <p>
                            Mark it on the student record for the office to
                            check
                          </p>
                        </div>
                        <div className="sms-line-ctl">
                          <div className="form-check form-switch mb-0">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              role="switch"
                              id="sms_sw_36"
                              defaultChecked
                            />
                            <label
                              className="form-check-label visually-hidden"
                              htmlFor="sms_sw_36"
                            >
                              Enable
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="sms-line">
                        <div className="sms-line-txt">
                          <strong>Fall back to email</strong>
                          <p>
                            Send the same content by email where an address
                            exists
                          </p>
                        </div>
                        <div className="sms-line-ctl">
                          <div className="form-check form-switch mb-0">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              role="switch"
                              id="sms_sw_37"
                              defaultChecked
                            />
                            <label
                              className="form-check-label visually-hidden"
                              htmlFor="sms_sw_37"
                            >
                              Enable
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="sms-line">
                        <div className="sms-line-txt">
                          <strong>Suppress after</strong>
                          <p>5 consecutive failures to the same number</p>
                        </div>
                        <div className="sms-line-ctl">
                          <input
                            type="text"
                            className="sms-input is-mono"
                            defaultValue={5}
                            aria-label="Setting value"
                          />
                        </div>
                      </div>
                      <div className="sms-line">
                        <div className="sms-line-txt">
                          <strong>Notify the class teacher</strong>
                          <p>When a guardian number stops working</p>
                        </div>
                        <div className="sms-line-ctl">
                          <div className="form-check form-switch mb-0">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              role="switch"
                              id="sms_sw_38"
                            />
                            <label
                              className="form-check-label visually-hidden"
                              htmlFor="sms_sw_38"
                            >
                              Enable
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="sms-card-foot">
                      <span className="fs-12 text-muted">
                        4 settings · 1 unpublished
                      </span>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-light bg-white d-inline-flex align-items-center"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#sms_workspace"
                        aria-label="Open configuration workspace for Failure handling"
                      >
                        <i className="ti ti-settings me-1" />
                        Configure
                      </button>
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <div className="sms-card">
                    <div className="sms-card-head">
                      <span className="sms-card-ic">
                        <i className="ti ti-list-check" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="sms-card-title">What is worth retrying</p>
                        <p>
                          A failure code says whether a second attempt has any
                          chance
                        </p>
                      </div>
                    </div>
                    <div className="sms-card-body">
                      <div className="sms-check">
                        <i className="ti ti-circle-check" />
                        <div>
                          <b className="sms-mono">ABSENT_SUB</b> — handset
                          switched off or out of coverage
                          <span>
                            Retried. The number is valid; the phone simply was
                            not reachable.
                          </span>
                        </div>
                      </div>
                      <div className="sms-check">
                        <i className="ti ti-circle-check" />
                        <div>
                          <b className="sms-mono">MEM_FULL</b> — message memory
                          full
                          <span>Retried. Often clears within the hour.</span>
                        </div>
                      </div>
                      <div className="sms-check">
                        <i className="ti ti-circle-check" />
                        <div>
                          <b className="sms-mono">TIMEOUT</b> — no response from
                          the carrier
                          <span>
                            Retried on the standby route rather than the same
                            one.
                          </span>
                        </div>
                      </div>
                      <div className="sms-check is-bad">
                        <i className="ti ti-circle-x" />
                        <div>
                          <b className="sms-mono">INVALID_NUM</b> — the number
                          does not exist
                          <span>
                            Never retried. Flagged on the student record for the
                            office to correct.
                          </span>
                        </div>
                      </div>
                      <div className="sms-check is-bad">
                        <i className="ti ti-circle-x" />
                        <div>
                          <b className="sms-mono">DND_REJECT</b> — the number is
                          on the do-not-disturb register
                          <span>
                            Never retried on the promotional route.
                            Transactional messages still reach it.
                          </span>
                        </div>
                      </div>
                      <div className="sms-check is-bad">
                        <i className="ti ti-circle-x" />
                        <div>
                          <b className="sms-mono">TEMPLATE_MISMATCH</b> — the
                          body does not match the approved template
                          <span>
                            Never retried. The template has to be corrected and
                            re-approved.
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="sms-card-foot">
                      <span className="fs-12 text-muted">
                        6 codes handled · anything unrecognised is retried once
                      </span>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-light bg-white d-inline-flex align-items-center"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#sms_workspace"
                        aria-label="Open configuration workspace for Retry codes"
                      >
                        <i className="ti ti-settings me-1" />
                        Configure
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="tab-pane fade"
              id="smspane-queue"
              role="tabpanel"
              aria-labelledby="smstab-queue"
              tabIndex={0}
            >
              <div className="d-flex align-items-end justify-content-between gap-3 flex-wrap mb-3">
                <div>
                  <span className="sms-lbl">Section 10</span>
                  <h2 className="sms-hero-title fs-20 mb-1">Message Queue</h2>
                  <p className="fs-13 text-muted mb-0">
                    What is waiting right now.
                  </p>
                </div>
              </div>
              <div className="d-flex align-items-center justify-content-between gap-3 flex-wrap mb-3">
                <p className="fs-13 mb-0">
                  <b className="sms-mono">412</b>{" "}
                  <span className="text-muted">
                    messages waiting · sending at 30 per second · the queue
                    clears in about 14 seconds, apart from what is held for the
                    send window
                  </span>
                </p>
                <div className="d-flex align-items-center gap-2">
                  <button
                    type="button"
                    className="btn btn-outline-light bg-white btn-sm d-inline-flex align-items-center"
                  >
                    <i className="ti ti-player-pause me-1" />
                    Pause queue
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-light bg-white btn-sm d-inline-flex align-items-center"
                  >
                    <i className="ti ti-refresh me-1" />
                    Retry failed
                  </button>
                </div>
              </div>
              <div className="sms-q">
                <span className="sms-badge is-accent">Sending</span>
                <div className="sms-q-body">
                  <strong>OTP verification</strong>
                  <span>+91 98••••4471</span>
                </div>
                <div className="sms-q-side">
                  <span className="badge-meta">Critical</span>
                  <span className="badge-meta">
                    <i className="ti ti-id-badge-2" />
                    PRSKOT
                  </span>
                  <span className="fs-12 text-muted sms-mono">now</span>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-light bg-white"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#sms_workspace"
                    aria-label="Open configuration workspace for OTP verification"
                  >
                    Open
                  </button>
                </div>
              </div>
              <div className="sms-q">
                <span className="sms-badge is-ok">Queued</span>
                <div className="sms-q-body">
                  <strong>Fee reminder · batch 2 of 5</strong>
                  <span>412 recipients</span>
                </div>
                <div className="sms-q-side">
                  <span className="badge-meta">Normal</span>
                  <span className="badge-meta">
                    <i className="ti ti-id-badge-2" />
                    PRSKOL
                  </span>
                  <span className="fs-12 text-muted sms-mono">in 30 sec</span>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-light bg-white"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#sms_workspace"
                    aria-label="Open configuration workspace for Fee reminder · batch 2 of 5"
                  >
                    Open
                  </button>
                </div>
              </div>
              <div className="sms-q">
                <span className="sms-badge is-ok">Queued</span>
                <div className="sms-q-body">
                  <strong>Attendance alert · Class VII-B</strong>
                  <span>18 recipients</span>
                </div>
                <div className="sms-q-side">
                  <span className="badge-meta">High</span>
                  <span className="badge-meta">
                    <i className="ti ti-id-badge-2" />
                    PRSKOL
                  </span>
                  <span className="fs-12 text-muted sms-mono">in 1 min</span>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-light bg-white"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#sms_workspace"
                    aria-label="Open configuration workspace for Attendance alert · Class VII-B"
                  >
                    Open
                  </button>
                </div>
              </div>
              <div className="sms-q">
                <span className="sms-badge is-ok">Queued</span>
                <div className="sms-q-body">
                  <strong>Exam schedule · Class X</strong>
                  <span>96 recipients</span>
                </div>
                <div className="sms-q-side">
                  <span className="badge-meta">Normal</span>
                  <span className="badge-meta">
                    <i className="ti ti-id-badge-2" />
                    PRSKOL
                  </span>
                  <span className="fs-12 text-muted sms-mono">in 2 min</span>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-light bg-white"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#sms_workspace"
                    aria-label="Open configuration workspace for Exam schedule · Class X"
                  >
                    Open
                  </button>
                </div>
              </div>
              <div className="sms-q">
                <span className="sms-badge is-warn">Held</span>
                <div className="sms-q-body">
                  <strong>Holiday notice</strong>
                  <span>1,284 recipients</span>
                </div>
                <div className="sms-q-side">
                  <span className="badge-meta">Bulk</span>
                  <span className="badge-meta">
                    <i className="ti ti-id-badge-2" />
                    PRSKED
                  </span>
                  <span className="fs-12 text-muted sms-mono">09:00</span>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-light bg-white"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#sms_workspace"
                    aria-label="Open configuration workspace for Holiday notice"
                  >
                    Open
                  </button>
                </div>
              </div>
              <div className="sms-q">
                <span className="sms-badge is-warn">Retry 2 of 3</span>
                <div className="sms-q-body">
                  <strong>Fee reminder</strong>
                  <span>+91 90••••8812</span>
                </div>
                <div className="sms-q-side">
                  <span className="badge-meta">Normal</span>
                  <span className="badge-meta">
                    <i className="ti ti-id-badge-2" />
                    PRSKOL
                  </span>
                  <span className="fs-12 text-muted sms-mono">in 13 min</span>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-light bg-white"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#sms_workspace"
                    aria-label="Open configuration workspace for Fee reminder"
                  >
                    Open
                  </button>
                </div>
              </div>
              <div className="sms-q">
                <span className="sms-badge is-bad">Blocked</span>
                <div className="sms-q-body">
                  <strong>Birthday wishes</strong>
                  <span>3 recipients</span>
                </div>
                <div className="sms-q-side">
                  <span className="badge-meta">Bulk</span>
                  <span className="badge-meta">
                    <i className="ti ti-id-badge-2" />
                    PRSKED
                  </span>
                  <span className="fs-12 text-muted sms-mono">—</span>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-light bg-white"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#sms_workspace"
                    aria-label="Open configuration workspace for Birthday wishes"
                  >
                    Open
                  </button>
                </div>
              </div>
            </div>
            <div
              className="tab-pane fade"
              id="smspane-logs"
              role="tabpanel"
              aria-labelledby="smstab-logs"
              tabIndex={0}
            >
              <div className="d-flex align-items-end justify-content-between gap-3 flex-wrap mb-3">
                <div>
                  <span className="sms-lbl">Section 11</span>
                  <h2 className="sms-hero-title fs-20 mb-1">Logs</h2>
                  <p className="fs-13 text-muted mb-0">
                    What the carrier said, in its own codes.
                  </p>
                </div>
              </div>
              <div className="sms-card">
                <div className="sms-card-head">
                  <span className="sms-card-ic">
                    <i className="ti ti-list-details" />
                  </span>
                  <div className="flex-fill overflow-hidden">
                    <p className="sms-card-title">Delivery log</p>
                    <p>Last 10 events · retained for 90 days</p>
                  </div>
                  <span className="sms-badge is-ok">6 delivered</span>
                  <span className="sms-badge is-warn">2 deferred</span>
                  <span className="sms-badge is-bad">2 refused</span>
                </div>
                <div className="sms-card-body">
                  <div className="sms-log">
                    <span className="sms-log-t">2026-08-01 09:41:06</span>
                    <span>
                      <span className="sms-badge is-ok">DELIVRD</span>
                    </span>
                    <span className="sms-log-msg">
                      +91 98••••4471 · PRSKOT · OTP · 1 SMS · 4.02 s
                    </span>
                  </div>
                  <div className="sms-log">
                    <span className="sms-log-t">2026-08-01 09:41:02</span>
                    <span>
                      <span className="sms-badge is-ok">SUBMITD</span>
                    </span>
                    <span className="sms-log-msg">
                      id 5f2a91c8e4b0 accepted by MSG91 · 214 ms
                    </span>
                  </div>
                  <div className="sms-log">
                    <span className="sms-log-t">2026-08-01 09:38:44</span>
                    <span>
                      <span className="sms-badge is-ok">DELIVRD</span>
                    </span>
                    <span className="sms-log-msg">
                      412 recipients · PRSKOL · fee reminder batch 1 · 408
                      delivered
                    </span>
                  </div>
                  <div className="sms-log is-warn">
                    <span className="sms-log-t">2026-08-01 09:38:44</span>
                    <span>
                      <span className="sms-badge is-warn">ABSENT_SUB</span>
                    </span>
                    <span className="sms-log-msg">
                      3 handsets unreachable · retry scheduled in 2 min
                    </span>
                  </div>
                  <div className="sms-log is-bad">
                    <span className="sms-log-t">2026-08-01 09:38:44</span>
                    <span>
                      <span className="sms-badge is-bad">INVALID_NUM</span>
                    </span>
                    <span className="sms-log-msg">
                      +91 87••••0092 · number flagged on the student record
                    </span>
                  </div>
                  <div className="sms-log">
                    <span className="sms-log-t">2026-08-01 09:20:11</span>
                    <span>
                      <span className="sms-badge is-ok">DELIVRD</span>
                    </span>
                    <span className="sms-log-msg">
                      18 recipients · PRSKOL · attendance alert VII-B · all
                      delivered
                    </span>
                  </div>
                  <div className="sms-log is-warn">
                    <span className="sms-log-t">2026-08-01 09:04:57</span>
                    <span>
                      <span className="sms-badge is-warn">THROTTLED</span>
                    </span>
                    <span className="sms-log-msg">
                      rate reduced to 20/sec for 30 s by the provider
                    </span>
                  </div>
                  <div className="sms-log">
                    <span className="sms-log-t">2026-08-01 09:00:00</span>
                    <span>
                      <span className="sms-badge is-ok">WINDOW</span>
                    </span>
                    <span className="sms-log-msg">
                      send window opened · 1,284 held messages released
                    </span>
                  </div>
                  <div className="sms-log is-bad">
                    <span className="sms-log-t">2026-07-31 21:14:38</span>
                    <span>
                      <span className="sms-badge is-bad">DND_REJECT</span>
                    </span>
                    <span className="sms-log-msg">
                      46 promotional messages refused · do-not-disturb register
                    </span>
                  </div>
                  <div className="sms-log">
                    <span className="sms-log-t">2026-07-31 20:58:02</span>
                    <span>
                      <span className="sms-badge is-ok">DELIVRD</span>
                    </span>
                    <span className="sms-log-msg">
                      96 recipients · PRSKOL · exam schedule Class X
                    </span>
                  </div>
                </div>
                <div className="sms-card-foot">
                  <span className="fs-12 text-muted">
                    Times are Asia/Kolkata · codes are as returned by the
                    carrier
                  </span>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-light bg-white d-inline-flex align-items-center"
                    data-bs-toggle="modal"
                    data-bs-target="#sms_export"
                  >
                    <i className="ti ti-download me-1" />
                    Export log
                  </button>
                </div>
              </div>
            </div>
            <div
              className="tab-pane fade"
              id="smspane-security"
              role="tabpanel"
              aria-labelledby="smstab-security"
              tabIndex={0}
            >
              <div className="d-flex align-items-end justify-content-between gap-3 flex-wrap mb-3">
                <div>
                  <span className="sms-lbl">Section 12</span>
                  <h2 className="sms-hero-title fs-20 mb-1">Security</h2>
                  <p className="fs-13 text-muted mb-0">
                    Credentials, rate limits, validation and the regulator.
                  </p>
                </div>
              </div>
              <div className="row g-4">
                <div className="col-12">
                  <div className="sms-card">
                    <div className="sms-card-head">
                      <span className="sms-card-ic is-ok">
                        <i className="ti ti-shield-lock" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="sms-card-title">
                          API authentication &amp; encryption
                        </p>
                        <p>How the ERP proves itself to the gateway</p>
                      </div>
                      <span className="sms-badge is-ok">Enforced</span>
                    </div>
                    <div className="sms-card-body">
                      <div className="sms-line">
                        <div className="sms-line-txt">
                          <strong>Transport</strong>
                          <p>HTTPS only — a plaintext request is refused</p>
                        </div>
                        <div className="sms-line-ctl">
                          <div className="form-check form-switch mb-0">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              role="switch"
                              id="sms_sw_39"
                              defaultChecked
                            />
                            <label
                              className="form-check-label visually-hidden"
                              htmlFor="sms_sw_39"
                            >
                              Enable
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="sms-line">
                        <div className="sms-line-txt">
                          <strong>Minimum TLS</strong>
                          <p>TLS 1.2</p>
                        </div>
                        <div className="sms-line-ctl">
                          <select
                            className="sms-select"
                            aria-label="Setting value"
                          >
                            <option>TLS 1.2</option>
                            <option>TLS 1.3</option>
                          </select>
                        </div>
                      </div>
                      <div className="sms-line">
                        <div className="sms-line-txt">
                          <strong>Credential storage</strong>
                          <p>Encrypted at rest with the application key</p>
                        </div>
                        <div className="sms-line-ctl">
                          <span className="sms-secret">
                            <i className="ti ti-lock" />
                            AES-256
                          </span>
                        </div>
                      </div>
                      <div className="sms-line">
                        <div className="sms-line-txt">
                          <strong>Callback signature</strong>
                          <p>
                            Delivery receipts verified before they are trusted
                          </p>
                        </div>
                        <div className="sms-line-ctl">
                          <div className="form-check form-switch mb-0">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              role="switch"
                              id="sms_sw_40"
                              defaultChecked
                            />
                            <label
                              className="form-check-label visually-hidden"
                              htmlFor="sms_sw_40"
                            >
                              Enable
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="sms-line">
                        <div className="sms-line-txt">
                          <strong>Unsigned callbacks</strong>
                          <p>Discarded and logged</p>
                        </div>
                        <div className="sms-line-ctl">
                          <div className="form-check form-switch mb-0">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              role="switch"
                              id="sms_sw_41"
                              defaultChecked
                            />
                            <label
                              className="form-check-label visually-hidden"
                              htmlFor="sms_sw_41"
                            >
                              Enable
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="sms-card-foot">
                      <span className="fs-12 text-muted">5 settings</span>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-light bg-white d-inline-flex align-items-center"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#sms_workspace"
                        aria-label="Open configuration workspace for API authentication"
                      >
                        <i className="ti ti-settings me-1" />
                        Configure
                      </button>
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <div className="sms-card">
                    <div className="sms-card-head">
                      <span className="sms-card-ic">
                        <i className="ti ti-network" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="sms-card-title">
                          IP allow-list &amp; rate limiting
                        </p>
                        <p>Who may reach the gateway, and how often</p>
                      </div>
                      <span className="sms-badge is-accent">3 addresses</span>
                    </div>
                    <div className="sms-card-body">
                      <div className="sms-line">
                        <div className="sms-line-txt">
                          <strong>IP allow-list</strong>
                          <p>
                            Only the school’s two servers and the office range
                          </p>
                        </div>
                        <div className="sms-line-ctl">
                          <span className="sms-secret">
                            <i className="ti ti-lock" />3 entries
                          </span>
                        </div>
                      </div>
                      <div className="sms-line">
                        <div className="sms-line-txt">
                          <strong>Rate limit</strong>
                          <p>30 requests per second</p>
                        </div>
                        <div className="sms-line-ctl">
                          <input
                            type="text"
                            className="sms-input is-mono"
                            defaultValue={30}
                            aria-label="Setting value"
                          />
                        </div>
                      </div>
                      <div className="sms-line">
                        <div className="sms-line-txt">
                          <strong>Burst allowance</strong>
                          <p>60 for up to 5 seconds</p>
                        </div>
                        <div className="sms-line-ctl">
                          <input
                            type="text"
                            className="sms-input is-mono"
                            defaultValue={60}
                            aria-label="Setting value"
                          />
                        </div>
                      </div>
                      <div className="sms-line">
                        <div className="sms-line-txt">
                          <strong>On exceeding</strong>
                          <p>Queue rather than refuse</p>
                        </div>
                        <div className="sms-line-ctl">
                          <select
                            className="sms-select"
                            aria-label="Setting value"
                          >
                            <option>Queue</option>
                            <option>Refuse with 429</option>
                            <option>Slow down</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className="sms-card-foot">
                      <span className="fs-12 text-muted">4 settings</span>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-light bg-white d-inline-flex align-items-center"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#sms_workspace"
                        aria-label="Open configuration workspace for IP allow-list"
                      >
                        <i className="ti ti-settings me-1" />
                        Configure
                      </button>
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <div className="sms-card">
                    <div className="sms-card-head">
                      <span className="sms-card-ic">
                        <i className="ti ti-filter" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="sms-card-title">
                          Message validation &amp; spam protection
                        </p>
                        <p>What is checked before a message leaves</p>
                      </div>
                      <span className="sms-badge is-ok">6 checks</span>
                    </div>
                    <div className="sms-card-body">
                      <div className="sms-line">
                        <div className="sms-line-txt">
                          <strong>Template match</strong>
                          <p>
                            The body must match its approved DLT template
                            exactly
                          </p>
                        </div>
                        <div className="sms-line-ctl">
                          <div className="form-check form-switch mb-0">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              role="switch"
                              id="sms_sw_42"
                              defaultChecked
                            />
                            <label
                              className="form-check-label visually-hidden"
                              htmlFor="sms_sw_42"
                            >
                              Enable
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="sms-line">
                        <div className="sms-line-txt">
                          <strong>Number format</strong>
                          <p>E.164 with a valid Indian prefix</p>
                        </div>
                        <div className="sms-line-ctl">
                          <div className="form-check form-switch mb-0">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              role="switch"
                              id="sms_sw_43"
                              defaultChecked
                            />
                            <label
                              className="form-check-label visually-hidden"
                              htmlFor="sms_sw_43"
                            >
                              Enable
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="sms-line">
                        <div className="sms-line-txt">
                          <strong>URL shortener</strong>
                          <p>
                            Off — shortened links are widely filtered as spam
                          </p>
                        </div>
                        <div className="sms-line-ctl">
                          <div className="form-check form-switch mb-0">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              role="switch"
                              id="sms_sw_44"
                            />
                            <label
                              className="form-check-label visually-hidden"
                              htmlFor="sms_sw_44"
                            >
                              Enable
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="sms-line">
                        <div className="sms-line-txt">
                          <strong>Blocked words</strong>
                          <p>Refuse messages containing 12 flagged terms</p>
                        </div>
                        <div className="sms-line-ctl">
                          <div className="form-check form-switch mb-0">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              role="switch"
                              id="sms_sw_45"
                              defaultChecked
                            />
                            <label
                              className="form-check-label visually-hidden"
                              htmlFor="sms_sw_45"
                            >
                              Enable
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="sms-line">
                        <div className="sms-line-txt">
                          <strong>Duplicate content guard</strong>
                          <p>Same body to the same number within 10 minutes</p>
                        </div>
                        <div className="sms-line-ctl">
                          <div className="form-check form-switch mb-0">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              role="switch"
                              id="sms_sw_46"
                              defaultChecked
                            />
                            <label
                              className="form-check-label visually-hidden"
                              htmlFor="sms_sw_46"
                            >
                              Enable
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="sms-card-foot">
                      <span className="fs-12 text-muted">5 settings</span>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-light bg-white d-inline-flex align-items-center"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#sms_workspace"
                        aria-label="Open configuration workspace for Message validation"
                      >
                        <i className="ti ti-settings me-1" />
                        Configure
                      </button>
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <div className="sms-card">
                    <div className="sms-card-head">
                      <span className="sms-card-ic is-ok">
                        <i className="ti ti-certificate" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="sms-card-title">Compliance status</p>
                        <p>DLT registration and consent</p>
                      </div>
                      <span className="sms-badge is-ok">Compliant</span>
                    </div>
                    <div className="sms-card-body">
                      <span className="sms-lbl mt-2">Principal entity</span>
                      <div className="sms-code">
                        Entity id&nbsp;&nbsp;1101459800000123456
                        <br />
                        Name&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;KARKAII
                        INTERNATIONAL SCHOOL
                        <br />
                        Operator&nbsp;&nbsp;Vodafone Idea DLT
                        <br />
                        Status&nbsp;&nbsp;&nbsp;&nbsp;Active since 14 Jan 2026
                      </div>
                      <div className="sms-check mt-2">
                        <i className="ti ti-circle-check" />
                        <div>
                          Consent held for every number on the promotional route
                          <span>
                            Collected at admission and renewable at any time
                            from the parent portal.
                          </span>
                        </div>
                      </div>
                      <div className="sms-check">
                        <i className="ti ti-circle-check" />
                        <div>
                          Opt-outs honoured within the hour
                          <span>
                            A guardian replying STOP is removed from promotional
                            traffic immediately.
                          </span>
                        </div>
                      </div>
                      <div className="sms-check is-warn">
                        <i className="ti ti-alert-circle" />
                        <div>
                          One sender ID awaiting approval
                          <span>
                            PRSKEM, submitted 28 Jul. Emergency alerts fall back
                            to PRSKOL meanwhile.
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="sms-card-foot">
                      <span className="fs-12 text-muted">
                        Reviewed 31 Jul 2026
                      </span>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-light bg-white d-inline-flex align-items-center"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#sms_workspace"
                        aria-label="Open configuration workspace for Compliance status"
                      >
                        <i className="ti ti-settings me-1" />
                        Configure
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="tab-pane fade"
              id="smspane-advanced"
              role="tabpanel"
              aria-labelledby="smstab-advanced"
              tabIndex={0}
            >
              <div className="d-flex align-items-end justify-content-between gap-3 flex-wrap mb-3">
                <div>
                  <span className="sms-lbl">Section 13</span>
                  <h2 className="sms-hero-title fs-20 mb-1">Advanced</h2>
                  <p className="fs-13 text-muted mb-0">
                    Payload, callbacks, encoding and the reset switch.
                  </p>
                </div>
              </div>
              <div className="accordion sms-acc" id="smsAdvanced">
                <div className="accordion-item">
                  <h2 className="accordion-header" id="smsacc-hpayload">
                    <button
                      className="accordion-button"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#smsacc-payload"
                      aria-expanded="true"
                      aria-controls="smsacc-payload"
                    >
                      <i className="ti ti-code" />
                      Request payload
                      <span className="sms-badge is-accent sms-acc-spacer">
                        JSON
                      </span>
                    </button>
                  </h2>
                  <div
                    id="smsacc-payload"
                    className="accordion-collapse collapse show"
                    aria-labelledby="smsacc-hpayload"
                    data-bs-parent="#smsAdvanced"
                    role="region"
                  >
                    <div className="accordion-body">
                      <div className="sms-code">
                        {"{"}
                        {"{"}
                        <br />
                        &nbsp;&nbsp;"template_id": "6512a9f4d3",
                        <br />
                        &nbsp;&nbsp;"sender": "PRSKOL",
                        <br />
                        &nbsp;&nbsp;"short_url": "0",
                        <br />
                        &nbsp;&nbsp;"recipients": [ {"{"}
                        {"{"} "mobiles": "9198∗∗∗∗4471", "student": "Aarav K",
                        "amount": "12,400" {"}"}
                        {"}"} ]<br />
                        {"}"}
                        {"}"}
                      </div>
                      <p className="fs-12 text-muted mb-0 mt-2">
                        Variables are substituted from the student record at
                        send time. The template id is fixed by the DLT
                        registration and cannot be changed here.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="accordion-item">
                  <h2 className="accordion-header" id="smsacc-hcallback">
                    <button
                      className="accordion-button collapsed"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#smsacc-callback"
                      aria-expanded="false"
                      aria-controls="smsacc-callback"
                    >
                      <i className="ti ti-webhook" />
                      Delivery receipt callback
                    </button>
                  </h2>
                  <div
                    id="smsacc-callback"
                    className="accordion-collapse collapse"
                    aria-labelledby="smsacc-hcallback"
                    data-bs-parent="#smsAdvanced"
                    role="region"
                  >
                    <div className="accordion-body">
                      <div className="sms-line">
                        <div className="sms-line-txt">
                          <strong>Endpoint</strong>
                          <p className="sms-mono">
                            https://karkaii.edu/hooks/sms/dlr
                          </p>
                        </div>
                      </div>
                      <div className="sms-line">
                        <div className="sms-line-txt">
                          <strong>Method</strong>
                          <p>POST, JSON body, one receipt per message</p>
                        </div>
                      </div>
                      <div className="sms-line">
                        <div className="sms-line-txt">
                          <strong>Signing</strong>
                          <p>
                            HMAC SHA-256 with a shared secret, rotated yearly
                          </p>
                        </div>
                      </div>
                      <div className="sms-line">
                        <div className="sms-line-txt">
                          <strong>Unsigned receipts</strong>
                          <p>
                            Discarded and logged — a forged receipt would mark
                            an undelivered message as delivered
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="accordion-item">
                  <h2 className="accordion-header" id="smsacc-hunicode">
                    <button
                      className="accordion-button collapsed"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#smsacc-unicode"
                      aria-expanded="false"
                      aria-controls="smsacc-unicode"
                    >
                      <i className="ti ti-language" />
                      Encoding &amp; segments
                      <span className="sms-badge is-warn sms-acc-spacer">
                        Costs money
                      </span>
                    </button>
                  </h2>
                  <div
                    id="smsacc-unicode"
                    className="accordion-collapse collapse"
                    aria-labelledby="smsacc-hunicode"
                    data-bs-parent="#smsAdvanced"
                    role="region"
                  >
                    <div className="accordion-body">
                      <div className="sms-line">
                        <div className="sms-line-txt">
                          <strong>GSM-7</strong>
                          <p>
                            160 characters per segment. The default, and what
                            every template above is written for.
                          </p>
                        </div>
                      </div>
                      <div className="sms-line">
                        <div className="sms-line-txt">
                          <strong>Unicode (UCS-2)</strong>
                          <p>
                            70 characters per segment. Triggered by a single
                            Tamil or Hindi character, or by a curly quote pasted
                            from a word processor.
                          </p>
                        </div>
                      </div>
                      <div className="sms-line">
                        <div className="sms-line-txt">
                          <strong>Automatic downgrade</strong>
                          <p>
                            Curly quotes and en-dashes are replaced with plain
                            equivalents before sending, which keeps most
                            messages inside one segment.
                          </p>
                        </div>
                      </div>
                      <p className="fs-12 text-muted mb-0 mt-2">
                        A message of 161 characters costs exactly twice as much
                        as one of 160. The template editor shows the count for
                        this reason.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="accordion-item">
                  <h2 className="accordion-header" id="smsacc-hreset">
                    <button
                      className="accordion-button collapsed"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#smsacc-reset"
                      aria-expanded="false"
                      aria-controls="smsacc-reset"
                    >
                      <i className="ti ti-alert-octagon" />
                      Reset configuration
                    </button>
                  </h2>
                  <div
                    id="smsacc-reset"
                    className="accordion-collapse collapse"
                    aria-labelledby="smsacc-hreset"
                    data-bs-parent="#smsAdvanced"
                    role="region"
                  >
                    <div className="accordion-body">
                      <p className="fs-13 text-muted">
                        Resetting returns every SMS setting to the template
                        default, disconnects all providers and clears stored
                        credentials. Templates, sender ID registrations and
                        delivery logs are kept.
                      </p>
                      <button
                        type="button"
                        className="btn btn-outline-danger btn-sm d-inline-flex align-items-center"
                        data-bs-toggle="modal"
                        data-bs-target="#sms_reset"
                      >
                        <i className="ti ti-rotate-2 me-1" />
                        Reset configuration
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="tab-pane fade"
              id="smspane-audit"
              role="tabpanel"
              aria-labelledby="smstab-audit"
              tabIndex={0}
            >
              <div className="d-flex align-items-end justify-content-between gap-3 flex-wrap mb-3">
                <div>
                  <span className="sms-lbl">Section 14</span>
                  <h2 className="sms-hero-title fs-20 mb-1">Audit History</h2>
                  <p className="fs-13 text-muted mb-0">
                    Every change, with the name against it.
                  </p>
                </div>
              </div>
              <div className="sms-card">
                <div className="sms-card-head">
                  <span className="sms-card-ic">
                    <i className="ti ti-history" />
                  </span>
                  <div className="flex-fill overflow-hidden">
                    <p className="sms-card-title">Audit history</p>
                    <p>
                      Every change to SMS configuration, retained for 3 academic
                      years
                    </p>
                  </div>
                  <span className="sms-badge">8 of 186 entries</span>
                </div>
                <div className="sms-card-body">
                  <div className="sms-audit">
                    <div className="sms-audit-when">
                      <strong>01 Aug 2026</strong>09:41
                    </div>
                    <div className="sms-audit-what">
                      Gateway connection test run against MSG91
                      <span>System · scheduled health check · 214 ms</span>
                    </div>
                  </div>
                  <div className="sms-audit">
                    <div className="sms-audit-when">
                      <strong>31 Jul 2026</strong>17:20
                    </div>
                    <div className="sms-audit-what">
                      Daily ceiling raised from 15,000 to 25,000
                      <span>Ms. Latha Rao · approved by the Principal</span>
                    </div>
                  </div>
                  <div className="sms-audit">
                    <div className="sms-audit-when">
                      <strong>31 Jul 2026</strong>16:55
                    </div>
                    <div className="sms-audit-what">
                      Homework reminder rule switched off
                      <span>Ms. Latha Rao · template still a draft</span>
                    </div>
                  </div>
                  <div className="sms-audit">
                    <div className="sms-audit-when">
                      <strong>28 Jul 2026</strong>11:30
                    </div>
                    <div className="sms-audit-what">
                      Sender ID PRSKEM submitted for DLT approval
                      <span>Mr. R. Venkatesh · emergency route</span>
                    </div>
                  </div>
                  <div className="sms-audit">
                    <div className="sms-audit-when">
                      <strong>24 Jul 2026</strong>14:02
                    </div>
                    <div className="sms-audit-what">
                      Fee reminder template shortened to 152 characters
                      <span>Ms. Latha Rao · was 168, cost two segments</span>
                    </div>
                  </div>
                  <div className="sms-audit">
                    <div className="sms-audit-when">
                      <strong>12 Jul 2026</strong>09:15
                    </div>
                    <div className="sms-audit-what">
                      Automatic failover to Twilio armed
                      <span>Mr. R. Venkatesh</span>
                    </div>
                  </div>
                  <div className="sms-audit">
                    <div className="sms-audit-when">
                      <strong>22 Feb 2026</strong>10:40
                    </div>
                    <div className="sms-audit-what">
                      Sender ID PRSKED approved
                      <span>System · promotional route</span>
                    </div>
                  </div>
                  <div className="sms-audit">
                    <div className="sms-audit-when">
                      <strong>14 Jan 2026</strong>15:00
                    </div>
                    <div className="sms-audit-what">
                      DLT entity registered and gateway connected
                      <span>Mr. R. Venkatesh · entity 1101459800000123456</span>
                    </div>
                  </div>
                </div>
                <div className="sms-card-foot">
                  <span className="fs-12 text-muted">
                    Entries cannot be edited or removed
                  </span>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-light bg-white d-inline-flex align-items-center"
                    data-bs-toggle="modal"
                    data-bs-target="#sms_export"
                  >
                    <i className="ti ti-download me-1" />
                    Export history
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* ===================== 9. MESSAGING TIMELINE ===================== */}
      <div className="d-flex align-items-end justify-content-between gap-3 flex-wrap mt-5 mb-3">
        <div>
          <h2 className="sms-hero-title fs-20 mb-1">Messaging timeline</h2>
          <p className="fs-13 text-muted mb-0">
            From the day the gateway was connected to what is still waiting to
            be published.
          </p>
        </div>
        <button
          type="button"
          className="btn btn-primary btn-sm d-inline-flex align-items-center"
          data-bs-toggle="modal"
          data-bs-target="#sms_gateway"
        >
          <i className="ti ti-rocket me-1" />
          Publish settings
        </button>
      </div>
      <div className="sms-trail">
        <div className="sms-trail-step is-done">
          <div className="sms-trail-top">
            <span className="sms-trail-n">
              <i className="ti ti-check" />
            </span>
            <div className="flex-fill overflow-hidden">
              <p className="sms-trail-title">Gateway connected</p>
              <span className="sms-trail-when">14 Jan 2026</span>
            </div>
          </div>
          <p className="sms-trail-txt">
            MSG91 connected on the transactional route with an auth key held
            encrypted.
          </p>
        </div>
        <div className="sms-trail-step is-done">
          <div className="sms-trail-top">
            <span className="sms-trail-n">
              <i className="ti ti-check" />
            </span>
            <div className="flex-fill overflow-hidden">
              <p className="sms-trail-title">API verified</p>
              <span className="sms-trail-when">14 Jan 2026</span>
            </div>
          </div>
          <p className="sms-trail-txt">
            Endpoint reachable over TLS 1.3 and the key accepted on the first
            attempt.
          </p>
        </div>
        <div className="sms-trail-step is-done">
          <div className="sms-trail-top">
            <span className="sms-trail-n">
              <i className="ti ti-check" />
            </span>
            <div className="flex-fill overflow-hidden">
              <p className="sms-trail-title">Test SMS sent</p>
              <span className="sms-trail-when">14 Jan 2026</span>
            </div>
          </div>
          <p className="sms-trail-txt">
            One message to the IT administrator, submitted in 208 ms.
          </p>
        </div>
        <div className="sms-trail-step is-done">
          <div className="sms-trail-top">
            <span className="sms-trail-n">
              <i className="ti ti-check" />
            </span>
            <div className="flex-fill overflow-hidden">
              <p className="sms-trail-title">Message delivered</p>
              <span className="sms-trail-when">14 Jan 2026</span>
            </div>
          </div>
          <p className="sms-trail-txt">
            Receipt returned DELIVRD in 3.9 seconds, under sender ID PRSKOL.
          </p>
        </div>
        <div className="sms-trail-step is-current">
          <div className="sms-trail-top">
            <span className="sms-trail-n">5</span>
            <div className="flex-fill overflow-hidden">
              <p className="sms-trail-title">Configuration updated</p>
              <span className="sms-trail-when">31 Jul 2026</span>
            </div>
          </div>
          <p className="sms-trail-txt">
            Daily ceiling raised to 25,000 and the homework reminder switched
            off. Two changes are still drafts.
          </p>
        </div>
        <div className="sms-trail-step">
          <div className="sms-trail-top">
            <span className="sms-trail-n">6</span>
            <div className="flex-fill overflow-hidden">
              <p className="sms-trail-title">Settings published</p>
              <span className="sms-trail-when">Pending</span>
            </div>
          </div>
          <p className="sms-trail-txt">
            Publishing applies the drafts to every outbound message within a
            minute.
          </p>
        </div>
      </div>
      {/* /Messaging Timeline */}
    </div>
  </div>
  {/* /Page Wrapper */}
</>

  )
}

export default SmsSettings