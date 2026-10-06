
const EmailSettings = () => {
  return (
    <>
  {/* Page Wrapper */}
  <div className="page-wrapper">
    <div className="content content-two">
      {/* ===================== 1. EMAIL WORKSPACE HERO ===================== */}
      <div className="eml-hero">
        <div className="eml-hero-id">
          <div className="eml-hero-top">
            <span className="eml-hero-crest">
              <i className="ti ti-mail-cog" />
            </span>
            <div className="flex-fill">
              <h1 className="eml-hero-title">Email Settings</h1>
              <p className="eml-hero-sub">
                Everything the school sends leaves through this configuration —
                the provider that carries it, the identity it carries, and the
                rules that decide when it goes out, retries or stops.
              </p>
            </div>
          </div>
          <div className="eml-chips">
            <span className="eml-chip">
              <i className="ti ti-server-2" />
              <span>Active provider</span>
              <b>Amazon SES</b>
            </span>
            <span className="eml-chip">
              <span className="eml-live" />
              <span>Delivery</span>
              <b>Healthy · 99.4% accepted</b>
            </span>
            <span className="eml-chip">
              <i className="ti ti-circle-check" />
              <span>Configuration</span>
              <b>Published</b>
            </span>
            <span className="eml-chip">
              <i className="ti ti-plug-connected" />
              <span>Last test connection</span>
              <b>Today, 09:14 AM</b>
            </span>
            <span className="eml-chip">
              <i className="ti ti-history" />
              <span>Last updated</span>
              <b>31 Jul 2026 by Ms. Latha Rao</b>
            </span>
          </div>
          <div className="eml-hero-actions">
            <button
              type="button"
              className="btn btn-primary d-inline-flex align-items-center"
              data-bs-toggle="modal"
              data-bs-target="#eml_smtp"
            >
              <i className="ti ti-device-floppy me-1" />
              Save settings
            </button>
            <button
              type="button"
              className="btn btn-outline-light bg-white d-inline-flex align-items-center"
              data-bs-toggle="modal"
              data-bs-target="#eml_test"
            >
              <i className="ti ti-plug-connected me-1" />
              Test connection
            </button>
            <button
              type="button"
              className="btn btn-outline-light bg-white d-inline-flex align-items-center"
              data-bs-toggle="modal"
              data-bs-target="#eml_sendtest"
            >
              <i className="ti ti-send me-1" />
              Send test mail
            </button>
            <button
              type="button"
              className="btn btn-outline-light bg-white d-inline-flex align-items-center"
              data-bs-toggle="modal"
              data-bs-target="#eml_export"
            >
              <i className="ti ti-download me-1" />
              Export configuration
            </button>
          </div>
        </div>
        <div className="eml-console">
          <div className="eml-console-head">
            <span className="eml-live" />
            <strong>smtp.karkaii.edu:587</strong>
            <span>last handshake</span>
          </div>
          <div className="eml-console-body">
            <div className="eml-console-line is-out">
              <span className="eml-console-dir">→</span>
              <span>EHLO mail.karkaii.edu</span>
            </div>
            <div className="eml-console-line is-in">
              <span className="eml-console-dir">←</span>
              <span>250-smtp.karkaii.edu Hello [103.21.58.14]</span>
            </div>
            <div className="eml-console-line is-in">
              <span className="eml-console-dir">←</span>
              <span>250-STARTTLS 250-AUTH LOGIN PLAIN</span>
            </div>
            <div className="eml-console-line is-out">
              <span className="eml-console-dir">→</span>
              <span>STARTTLS</span>
            </div>
            <div className="eml-console-line is-in">
              <span className="eml-console-dir">←</span>
              <span>220 2.0.0 Ready to start TLS</span>
            </div>
            <div className="eml-console-line is-out">
              <span className="eml-console-dir">→</span>
              <span>AUTH LOGIN ∗∗∗∗∗∗∗∗</span>
            </div>
            <div className="eml-console-line is-in is-ok">
              <span className="eml-console-dir">←</span>
              <span>235 2.7.0 Authentication successful</span>
            </div>
            <div className="eml-console-line is-out">
              <span className="eml-console-dir">→</span>
              <span>MAIL FROM:&lt;noreply@karkaii.edu&gt;</span>
            </div>
            <div className="eml-console-line is-in is-ok">
              <span className="eml-console-dir">←</span>
              <span>250 2.1.0 Sender OK</span>
            </div>
            <div className="eml-console-line is-out">
              <span className="eml-console-dir">→</span>
              <span>QUIT</span>
            </div>
            <div className="eml-console-line is-in">
              <span className="eml-console-dir">←</span>
              <span>221 2.0.0 Service closing transmission channel</span>
            </div>
          </div>
          <div className="eml-console-foot">
            <span className="eml-console-stat">
              <span>TLS</span>
              <b>1.3</b>
            </span>
            <span className="eml-console-stat">
              <span>Latency</span>
              <b>142 ms</b>
            </span>
            <span className="eml-console-stat">
              <span>Result</span>
              <b>250 OK</b>
            </span>
            <span className="eml-console-stat">
              <span>Checked</span>
              <b>09:14:02</b>
            </span>
          </div>
        </div>
      </div>
      {/* /Email Workspace Hero */}
      <div className="row g-4">
        {/* ===================== 2. STICKY SETTINGS NAVIGATION ===================== */}
        <div className="col-xxl-3 col-lg-4">
          <div
            className="eml-nav nav flex-column"
            role="tablist"
            aria-label="Email settings sections"
          >
            <div className="eml-nav-head">
              <span className="eml-nav-search">
                <i className="ti ti-search" />
                <input
                  type="search"
                  placeholder="Find a setting"
                  aria-label="Find a setting"
                />
              </span>
            </div>
            <div className="eml-nav-list">
              <button
                className="eml-nav-link active"
                id="emltab-general"
                data-bs-toggle="pill"
                data-bs-target="#emlpane-general"
                type="button"
                role="tab"
                aria-controls="emlpane-general"
                aria-selected="true"
              >
                <span className="eml-nav-n">01</span>
                <span>General</span>
                <span className="eml-live is-ok" />
              </button>
              <button
                className="eml-nav-link"
                id="emltab-smtp"
                data-bs-toggle="pill"
                data-bs-target="#emlpane-smtp"
                type="button"
                role="tab"
                aria-controls="emlpane-smtp"
                aria-selected="false"
              >
                <span className="eml-nav-n">02</span>
                <span>SMTP Configuration</span>
                <span className="eml-live is-ok" />
              </button>
              <button
                className="eml-nav-link"
                id="emltab-auth"
                data-bs-toggle="pill"
                data-bs-target="#emlpane-auth"
                type="button"
                role="tab"
                aria-controls="emlpane-auth"
                aria-selected="false"
              >
                <span className="eml-nav-n">03</span>
                <span>Authentication</span>
                <span className="eml-live is-ok" />
              </button>
              <button
                className="eml-nav-link"
                id="emltab-sender"
                data-bs-toggle="pill"
                data-bs-target="#emlpane-sender"
                type="button"
                role="tab"
                aria-controls="emlpane-sender"
                aria-selected="false"
              >
                <span className="eml-nav-n">04</span>
                <span>Sender Identity</span>
                <span className="eml-live is-warn" />
              </button>
              <button
                className="eml-nav-link"
                id="emltab-templates"
                data-bs-toggle="pill"
                data-bs-target="#emlpane-templates"
                type="button"
                role="tab"
                aria-controls="emlpane-templates"
                aria-selected="false"
              >
                <span className="eml-nav-n">05</span>
                <span>Templates</span>
                <span className="eml-live is-ok" />
              </button>
              <button
                className="eml-nav-link"
                id="emltab-notifications"
                data-bs-toggle="pill"
                data-bs-target="#emlpane-notifications"
                type="button"
                role="tab"
                aria-controls="emlpane-notifications"
                aria-selected="false"
              >
                <span className="eml-nav-n">06</span>
                <span>Notification Emails</span>
                <span className="eml-live is-ok" />
              </button>
              <button
                className="eml-nav-link"
                id="emltab-delivery"
                data-bs-toggle="pill"
                data-bs-target="#emlpane-delivery"
                type="button"
                role="tab"
                aria-controls="emlpane-delivery"
                aria-selected="false"
              >
                <span className="eml-nav-n">07</span>
                <span>Delivery Policies</span>
                <span className="eml-live is-ok" />
              </button>
              <button
                className="eml-nav-link"
                id="emltab-bounce"
                data-bs-toggle="pill"
                data-bs-target="#emlpane-bounce"
                type="button"
                role="tab"
                aria-controls="emlpane-bounce"
                aria-selected="false"
              >
                <span className="eml-nav-n">08</span>
                <span>Bounce Handling</span>
                <span className="eml-live is-warn" />
              </button>
              <button
                className="eml-nav-link"
                id="emltab-queue"
                data-bs-toggle="pill"
                data-bs-target="#emlpane-queue"
                type="button"
                role="tab"
                aria-controls="emlpane-queue"
                aria-selected="false"
              >
                <span className="eml-nav-n">09</span>
                <span>Email Queue</span>
                <span className="eml-live is-ok" />
              </button>
              <button
                className="eml-nav-link"
                id="emltab-logs"
                data-bs-toggle="pill"
                data-bs-target="#emlpane-logs"
                type="button"
                role="tab"
                aria-controls="emlpane-logs"
                aria-selected="false"
              >
                <span className="eml-nav-n">10</span>
                <span>Logs</span>
                <span className="eml-live is-ok" />
              </button>
              <button
                className="eml-nav-link"
                id="emltab-security"
                data-bs-toggle="pill"
                data-bs-target="#emlpane-security"
                type="button"
                role="tab"
                aria-controls="emlpane-security"
                aria-selected="false"
              >
                <span className="eml-nav-n">11</span>
                <span>Security</span>
                <span className="eml-live is-ok" />
              </button>
              <button
                className="eml-nav-link"
                id="emltab-advanced"
                data-bs-toggle="pill"
                data-bs-target="#emlpane-advanced"
                type="button"
                role="tab"
                aria-controls="emlpane-advanced"
                aria-selected="false"
              >
                <span className="eml-nav-n">12</span>
                <span>Advanced</span>
                <span className="eml-live is-off" />
              </button>
              <button
                className="eml-nav-link"
                id="emltab-audit"
                data-bs-toggle="pill"
                data-bs-target="#emlpane-audit"
                type="button"
                role="tab"
                aria-controls="emlpane-audit"
                aria-selected="false"
              >
                <span className="eml-nav-n">13</span>
                <span>Audit History</span>
                <span className="eml-live is-ok" />
              </button>
            </div>
            <div className="eml-nav-foot">
              <span className="eml-lbl">Sent this month</span>
              <p className="fs-13 mb-2">
                <b className="eml-mono">48,210</b>{" "}
                <span className="text-muted">
                  of 60,000 daily-limit equivalent
                </span>
              </p>
              <button
                type="button"
                className="btn btn-outline-light bg-white btn-sm w-100 d-inline-flex align-items-center justify-content-center"
                data-bs-toggle="modal"
                data-bs-target="#eml_import"
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
              id="emlpane-general"
              role="tabpanel"
              aria-labelledby="emltab-general"
              tabIndex={0}
            >
              <div className="d-flex align-items-end justify-content-between gap-3 flex-wrap mb-3">
                <div>
                  <span className="eml-lbl">Section 01</span>
                  <h2 className="eml-hero-title fs-20 mb-1">General</h2>
                  <p className="fs-13 text-muted mb-0">
                    How mail behaves before anything is written.
                  </p>
                </div>
              </div>
              <div className="row g-4">
                <div className="col-xxl-6 col-xl-12">
                  <div className="eml-panel">
                    <div className="eml-panel-band is-info">
                      <span className="eml-panel-ic">
                        <i className="ti ti-mail" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="eml-panel-title">Outbound mail</p>
                        <p>Applies to every message the system sends</p>
                      </div>
                      <span className="eml-badge is-ok">Enabled</span>
                    </div>
                    <div className="eml-panel-body">
                      <div className="eml-hdr">
                        <span className="eml-hdr-key">System email</span>
                        <span className="eml-hdr-val">
                          On — the ERP may send mail
                        </span>
                        <div className="eml-hdr-ctl">
                          <div className="form-check form-switch mb-0">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              role="switch"
                              id="eml_sw_1"
                              defaultChecked
                            />
                            <label
                              className="form-check-label visually-hidden"
                              htmlFor="eml_sw_1"
                            >
                              Enable
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="eml-hdr">
                        <span className="eml-hdr-key">Transport</span>
                        <span className="eml-hdr-val">
                          Amazon SES over SMTP
                        </span>
                        <span className="eml-hdr-ctl">
                          <select
                            className="eml-select"
                            aria-label="Setting value"
                          >
                            <option>Amazon SES</option>
                            <option>Google Workspace</option>
                            <option>Microsoft 365</option>
                            <option>Direct SMTP</option>
                          </select>
                        </span>
                      </div>
                      <div className="eml-hdr">
                        <span className="eml-hdr-key">Default charset</span>
                        <span className="eml-hdr-val">UTF-8</span>
                        <span className="eml-hdr-ctl">
                          <select
                            className="eml-select"
                            aria-label="Setting value"
                          >
                            <option>UTF-8</option>
                            <option>ISO-8859-1</option>
                          </select>
                        </span>
                      </div>
                      <div className="eml-hdr">
                        <span className="eml-hdr-key">Message format</span>
                        <span className="eml-hdr-val">
                          HTML with a plain-text alternative
                        </span>
                        <span className="eml-hdr-ctl">
                          <select
                            className="eml-select"
                            aria-label="Setting value"
                          >
                            <option>HTML + plain text</option>
                            <option>HTML only</option>
                            <option>Plain text only</option>
                          </select>
                        </span>
                      </div>
                      <div className="eml-hdr">
                        <span className="eml-hdr-key">Send window</span>
                        <span className="eml-hdr-val">Around the clock</span>
                        <span className="eml-hdr-ctl">
                          <select
                            className="eml-select"
                            aria-label="Setting value"
                          >
                            <option>24 hours</option>
                            <option>06:00 – 22:00</option>
                            <option>School hours only</option>
                          </select>
                        </span>
                      </div>
                    </div>
                    <div className="eml-panel-foot">
                      <span className="fs-12 text-muted">
                        5 settings · published
                      </span>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-light bg-white d-inline-flex align-items-center"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#eml_workspace"
                        aria-label="Open configuration workspace for Outbound mail"
                      >
                        <i className="ti ti-settings me-1" />
                        Configure
                      </button>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-6  col-xl-12">
                  <div className="eml-panel">
                    <div className="eml-panel-band">
                      <span className="eml-panel-ic">
                        <i className="ti ti-language" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="eml-panel-title">
                          Localisation &amp; footer
                        </p>
                        <p>What every message carries at the bottom</p>
                      </div>
                      <span className="eml-badge is-info">Shared</span>
                    </div>
                    <div className="eml-panel-body">
                      <div className="eml-hdr">
                        <span className="eml-hdr-key">Language</span>
                        <span className="eml-hdr-val">English (India)</span>
                        <span className="eml-hdr-ctl">
                          <select
                            className="eml-select"
                            aria-label="Setting value"
                          >
                            <option>English (India)</option>
                            <option>English (UK)</option>
                            <option>Tamil</option>
                            <option>Hindi</option>
                          </select>
                        </span>
                      </div>
                      <div className="eml-hdr">
                        <span className="eml-hdr-key">Time zone</span>
                        <span className="eml-hdr-val">
                          Asia/Kolkata (GMT +5:30)
                        </span>
                        <span className="eml-hdr-ctl">
                          <select
                            className="eml-select"
                            aria-label="Setting value"
                          >
                            <option>Asia/Kolkata</option>
                            <option>Asia/Dubai</option>
                            <option>UTC</option>
                          </select>
                        </span>
                      </div>
                      <div className="eml-hdr">
                        <span className="eml-hdr-key">Date format</span>
                        <span className="eml-hdr-val">
                          31 Jul 2026, 4:12 PM
                        </span>
                        <span className="eml-hdr-ctl">
                          <select
                            className="eml-select"
                            aria-label="Setting value"
                          >
                            <option>31 Jul 2026</option>
                            <option>2026-07-31</option>
                            <option>07/31/2026</option>
                          </select>
                        </span>
                      </div>
                      <div className="eml-hdr">
                        <span className="eml-hdr-key">Footer address</span>
                        <span className="eml-hdr-val">
                          Printed on every message for compliance
                        </span>
                        <span className="eml-hdr-ctl">
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-light bg-white"
                            data-bs-toggle="offcanvas"
                            data-bs-target="#eml_workspace"
                            aria-label="Open configuration workspace for Footer address"
                          >
                            Edit
                          </button>
                        </span>
                      </div>
                      <div className="eml-hdr">
                        <span className="eml-hdr-key">Unsubscribe link</span>
                        <span className="eml-hdr-val">
                          On newsletters only, never on transactional mail
                        </span>
                        <div className="eml-hdr-ctl">
                          <div className="form-check form-switch mb-0">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              role="switch"
                              id="eml_sw_2"
                              defaultChecked
                            />
                            <label
                              className="form-check-label visually-hidden"
                              htmlFor="eml_sw_2"
                            >
                              Enable
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="eml-panel-foot">
                      <span className="fs-12 text-muted">
                        5 settings · published
                      </span>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-light bg-white d-inline-flex align-items-center"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#eml_workspace"
                        aria-label="Open configuration workspace for Localisation"
                      >
                        <i className="ti ti-settings me-1" />
                        Configure
                      </button>
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <div className="eml-panel">
                    <div className="eml-panel-band is-warn">
                      <span className="eml-panel-ic">
                        <i className="ti ti-shield-lock" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="eml-panel-title">Safety rails</p>
                        <p>Guards that stop a mistake reaching every family</p>
                      </div>
                      <span className="eml-badge is-warn">1 off</span>
                    </div>
                    <div className="eml-panel-body">
                      <div className="eml-hdr">
                        <span className="eml-hdr-key">Sandbox mode</span>
                        <span className="eml-hdr-val">
                          Off — mail reaches real recipients
                        </span>
                        <div className="eml-hdr-ctl">
                          <div className="form-check form-switch mb-0">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              role="switch"
                              id="eml_sw_3"
                            />
                            <label
                              className="form-check-label visually-hidden"
                              htmlFor="eml_sw_3"
                            >
                              Enable
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="eml-hdr">
                        <span className="eml-hdr-key">
                          Recipient allow-list
                        </span>
                        <span className="eml-hdr-val">
                          Only used while sandbox is on
                        </span>
                        <span className="eml-hdr-ctl">
                          <span className="eml-secret">
                            <i className="ti ti-lock" />3 addresses
                          </span>
                        </span>
                      </div>
                      <div className="eml-hdr">
                        <span className="eml-hdr-key">
                          Bulk send confirmation
                        </span>
                        <span className="eml-hdr-val">
                          Ask before any send above 500 recipients
                        </span>
                        <div className="eml-hdr-ctl">
                          <div className="form-check form-switch mb-0">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              role="switch"
                              id="eml_sw_4"
                              defaultChecked
                            />
                            <label
                              className="form-check-label visually-hidden"
                              htmlFor="eml_sw_4"
                            >
                              Enable
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="eml-hdr">
                        <span className="eml-hdr-key">Daily send ceiling</span>
                        <span className="eml-hdr-val">
                          60,000 messages — refuses beyond this
                        </span>
                        <span className="eml-hdr-ctl">
                          <input
                            type="text"
                            className="eml-input is-mono"
                            defaultValue={60000}
                            aria-label="Setting value"
                          />
                        </span>
                      </div>
                      <div className="eml-hdr">
                        <span className="eml-hdr-key">Duplicate guard</span>
                        <span className="eml-hdr-val">
                          Block an identical message to the same address within
                          10 minutes
                        </span>
                        <div className="eml-hdr-ctl">
                          <div className="form-check form-switch mb-0">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              role="switch"
                              id="eml_sw_5"
                              defaultChecked
                            />
                            <label
                              className="form-check-label visually-hidden"
                              htmlFor="eml_sw_5"
                            >
                              Enable
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="eml-panel-foot">
                      <span className="fs-12 text-muted">
                        5 settings · 1 unpublished
                      </span>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-light bg-white d-inline-flex align-items-center"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#eml_workspace"
                        aria-label="Open configuration workspace for Safety rails"
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
              id="emlpane-smtp"
              role="tabpanel"
              aria-labelledby="emltab-smtp"
              tabIndex={0}
            >
              <div className="d-flex align-items-end justify-content-between gap-3 flex-wrap mb-3">
                <div>
                  <span className="eml-lbl">Section 02</span>
                  <h2 className="eml-hero-title fs-20 mb-1">
                    SMTP Configuration
                  </h2>
                  <p className="fs-13 text-muted mb-0">
                    The connection itself — where mail is handed over and how.
                  </p>
                </div>
              </div>
              <div className="row g-4">
                <div className="col-12">
                  <div className="eml-panel">
                    <div className="eml-panel-band is-info">
                      <span className="eml-panel-ic">
                        <i className="ti ti-server-2" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="eml-panel-title">SMTP host &amp; port</p>
                        <p>Where mail is handed over</p>
                      </div>
                      <span className="eml-badge is-ok">Connected</span>
                    </div>
                    <div className="eml-panel-body">
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
                        <span className="eml-hdr-val">587 — submission</span>
                        <span className="eml-hdr-ctl">
                          <select
                            className="eml-select"
                            aria-label="Setting value"
                          >
                            <option>587 — submission</option>
                            <option>465 — implicit TLS</option>
                            <option>25 — relay</option>
                            <option>2587 — alternate</option>
                          </select>
                        </span>
                      </div>
                      <div className="eml-hdr">
                        <span className="eml-hdr-key">Encryption</span>
                        <span className="eml-hdr-val">STARTTLS, required</span>
                        <span className="eml-hdr-ctl">
                          <select
                            className="eml-select"
                            aria-label="Setting value"
                          >
                            <option>STARTTLS (required)</option>
                            <option>SSL / implicit TLS</option>
                            <option>None — not recommended</option>
                          </select>
                        </span>
                      </div>
                      <div className="eml-hdr">
                        <span className="eml-hdr-key">Authentication</span>
                        <span className="eml-hdr-val">LOGIN over TLS</span>
                        <span className="eml-hdr-ctl">
                          <select
                            className="eml-select"
                            aria-label="Setting value"
                          >
                            <option>LOGIN</option>
                            <option>PLAIN</option>
                            <option>CRAM-MD5</option>
                            <option>XOAUTH2</option>
                          </select>
                        </span>
                      </div>
                    </div>
                    <div className="eml-panel-foot">
                      <span className="fs-12 text-muted">4 settings</span>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-light bg-white d-inline-flex align-items-center"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#eml_workspace"
                        aria-label="Open configuration workspace for SMTP host"
                      >
                        <i className="ti ti-settings me-1" />
                        Configure
                      </button>
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <div className="eml-panel">
                    <div className="eml-panel-band">
                      <span className="eml-panel-ic">
                        <i className="ti ti-key" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="eml-panel-title">Credentials</p>
                        <p>Held encrypted at rest</p>
                      </div>
                      <span className="eml-badge is-info">
                        Rotates in 129 days
                      </span>
                    </div>
                    <div className="eml-panel-body">
                      <div className="eml-hdr">
                        <span className="eml-hdr-key">Username</span>
                        <span className="eml-hdr-val">AKIA••••••••••7QK4</span>
                        <span className="eml-hdr-ctl">
                          <input
                            type="text"
                            className="eml-input is-mono"
                            defaultValue="AKIA••••••••••7QK4"
                            aria-label="Setting value"
                          />
                        </span>
                      </div>
                      <div className="eml-hdr">
                        <span className="eml-hdr-key">Password</span>
                        <span className="eml-hdr-val">
                          Stored encrypted, never displayed
                        </span>
                        <span className="eml-hdr-ctl">
                          <span className="eml-secret">
                            <i className="ti ti-key" />
                            44 chars · set 11 Jun
                          </span>
                        </span>
                      </div>
                      <div className="eml-hdr">
                        <span className="eml-hdr-key">Rotation</span>
                        <span className="eml-hdr-val">
                          Every 180 days — next on 08 Dec 2026
                        </span>
                        <span className="eml-hdr-ctl">
                          <select
                            className="eml-select"
                            aria-label="Setting value"
                          >
                            <option>Every 180 days</option>
                            <option>Every 90 days</option>
                            <option>Manual only</option>
                          </select>
                        </span>
                      </div>
                      <div className="eml-hdr">
                        <span className="eml-hdr-key">
                          Fallback credentials
                        </span>
                        <span className="eml-hdr-val">
                          Used only if the primary key is rejected
                        </span>
                        <div className="eml-hdr-ctl">
                          <div className="form-check form-switch mb-0">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              role="switch"
                              id="eml_sw_6"
                            />
                            <label
                              className="form-check-label visually-hidden"
                              htmlFor="eml_sw_6"
                            >
                              Enable
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="eml-panel-foot">
                      <span className="fs-12 text-muted">4 settings</span>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-light bg-white d-inline-flex align-items-center"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#eml_workspace"
                        aria-label="Open configuration workspace for SMTP credentials"
                      >
                        <i className="ti ti-settings me-1" />
                        Configure
                      </button>
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <div className="eml-panel">
                    <div className="eml-panel-band">
                      <span className="eml-panel-ic">
                        <i className="ti ti-adjustments-horizontal" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="eml-panel-title">
                          Timeouts &amp; connections
                        </p>
                        <p>How patient the sender should be</p>
                      </div>
                      <span className="eml-badge">Tuned</span>
                    </div>
                    <div className="eml-panel-body">
                      <div className="eml-hdr">
                        <span className="eml-hdr-key">Connection timeout</span>
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
                      <div className="eml-hdr">
                        <span className="eml-hdr-key">Read timeout</span>
                        <span className="eml-hdr-val">60 seconds</span>
                        <span className="eml-hdr-ctl">
                          <input
                            type="text"
                            className="eml-input is-mono"
                            defaultValue={60}
                            aria-label="Setting value"
                          />
                        </span>
                      </div>
                      <div className="eml-hdr">
                        <span className="eml-hdr-key">Keep-alive</span>
                        <span className="eml-hdr-val">
                          Reuse one connection for up to 100 messages
                        </span>
                        <div className="eml-hdr-ctl">
                          <div className="form-check form-switch mb-0">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              role="switch"
                              id="eml_sw_7"
                              defaultChecked
                            />
                            <label
                              className="form-check-label visually-hidden"
                              htmlFor="eml_sw_7"
                            >
                              Enable
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="eml-hdr">
                        <span className="eml-hdr-key">
                          Concurrent connections
                        </span>
                        <span className="eml-hdr-val">
                          8 — within the provider ceiling of 14
                        </span>
                        <span className="eml-hdr-ctl">
                          <input
                            type="text"
                            className="eml-input is-mono"
                            defaultValue={8}
                            aria-label="Setting value"
                          />
                        </span>
                      </div>
                      <div className="eml-hdr">
                        <span className="eml-hdr-key">Verify certificate</span>
                        <span className="eml-hdr-val">
                          Refuse to send if the certificate does not validate
                        </span>
                        <div className="eml-hdr-ctl">
                          <div className="form-check form-switch mb-0">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              role="switch"
                              id="eml_sw_8"
                              defaultChecked
                            />
                            <label
                              className="form-check-label visually-hidden"
                              htmlFor="eml_sw_8"
                            >
                              Enable
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="eml-panel-foot">
                      <span className="fs-12 text-muted">5 settings</span>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-light bg-white d-inline-flex align-items-center"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#eml_workspace"
                        aria-label="Open configuration workspace for Timeouts"
                      >
                        <i className="ti ti-settings me-1" />
                        Configure
                      </button>
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <div className="eml-panel">
                    <div className="eml-panel-band is-ok">
                      <span className="eml-panel-ic">
                        <i className="ti ti-activity-heartbeat" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="eml-panel-title">Connection status</p>
                        <p>Checked every 15 minutes</p>
                      </div>
                      <span className="eml-badge is-ok">250 OK</span>
                    </div>
                    <div className="eml-panel-body">
                      <div className="eml-check">
                        <i className="ti ti-circle-check" />
                        <div>
                          Host resolves and accepts connections
                          <span>
                            Resolved to 3 addresses in ap-south-1, all
                            reachable.
                          </span>
                        </div>
                      </div>
                      <div className="eml-check">
                        <i className="ti ti-circle-check" />
                        <div>
                          STARTTLS negotiated at TLS 1.3
                          <span>
                            Certificate valid until 14 Mar 2027, issued to
                            amazonaws.com.
                          </span>
                        </div>
                      </div>
                      <div className="eml-check">
                        <i className="ti ti-circle-check" />
                        <div>
                          Credentials accepted
                          <span>
                            235 Authentication successful, 09:14:02 today.
                          </span>
                        </div>
                      </div>
                      <div className="eml-check">
                        <i className="ti ti-circle-check" />
                        <div>
                          Sender address permitted
                          <span>
                            noreply@karkaii.edu is a verified identity on this
                            account.
                          </span>
                        </div>
                      </div>
                      <div className="eml-check is-warn">
                        <i className="ti ti-alert-circle" />
                        <div>
                          Reverse DNS does not match the sending host
                          <span>
                            Some strict receivers treat this as a weak signal.
                            It is not blocking delivery today.
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="eml-panel-foot">
                      <span className="fs-12 text-muted">
                        Latency 142 ms · 5 checks
                      </span>
                      <button
                        type="button"
                        className="btn btn-sm btn-primary d-inline-flex align-items-center"
                        data-bs-toggle="modal"
                        data-bs-target="#eml_test"
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
              id="emlpane-auth"
              role="tabpanel"
              aria-labelledby="emltab-auth"
              tabIndex={0}
            >
              <div className="d-flex align-items-end justify-content-between gap-3 flex-wrap mb-3">
                <div>
                  <span className="eml-lbl">Section 03</span>
                  <h2 className="eml-hero-title fs-20 mb-1">Authentication</h2>
                  <p className="fs-13 text-muted mb-0">
                    How the sender proves who it is, on the wire and to the
                    provider.
                  </p>
                </div>
              </div>
              <div className="row g-4">
                <div className="col-12">
                  <div className="eml-panel">
                    <div className="eml-panel-band is-ok">
                      <span className="eml-panel-ic">
                        <i className="ti ti-lock" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="eml-panel-title">SMTP authentication</p>
                        <p>How the sender proves who it is</p>
                      </div>
                      <span className="eml-badge is-ok">Enforced</span>
                    </div>
                    <div className="eml-panel-body">
                      <div className="eml-hdr">
                        <span className="eml-hdr-key">Require auth</span>
                        <span className="eml-hdr-val">
                          Refuse to send on an unauthenticated connection
                        </span>
                        <div className="eml-hdr-ctl">
                          <div className="form-check form-switch mb-0">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              role="switch"
                              id="eml_sw_17"
                              defaultChecked
                            />
                            <label
                              className="form-check-label visually-hidden"
                              htmlFor="eml_sw_17"
                            >
                              Enable
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="eml-hdr">
                        <span className="eml-hdr-key">Mechanism</span>
                        <span className="eml-hdr-val">LOGIN over TLS</span>
                        <span className="eml-hdr-ctl">
                          <select
                            className="eml-select"
                            aria-label="Setting value"
                          >
                            <option>LOGIN</option>
                            <option>PLAIN</option>
                            <option>CRAM-MD5</option>
                            <option>XOAUTH2</option>
                          </select>
                        </span>
                      </div>
                      <div className="eml-hdr">
                        <span className="eml-hdr-key">Anonymous relay</span>
                        <span className="eml-hdr-val">
                          Never permitted, on any port
                        </span>
                        <div className="eml-hdr-ctl">
                          <div className="form-check form-switch mb-0">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              role="switch"
                              id="eml_sw_18"
                            />
                            <label
                              className="form-check-label visually-hidden"
                              htmlFor="eml_sw_18"
                            >
                              Enable
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="eml-hdr">
                        <span className="eml-hdr-key">Failed auth lockout</span>
                        <span className="eml-hdr-val">
                          Stop trying after 5 rejections and raise an alert
                        </span>
                        <div className="eml-hdr-ctl">
                          <div className="form-check form-switch mb-0">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              role="switch"
                              id="eml_sw_19"
                              defaultChecked
                            />
                            <label
                              className="form-check-label visually-hidden"
                              htmlFor="eml_sw_19"
                            >
                              Enable
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="eml-panel-foot">
                      <span className="fs-12 text-muted">4 settings</span>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-light bg-white d-inline-flex align-items-center"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#eml_workspace"
                        aria-label="Open configuration workspace for SMTP authentication"
                      >
                        <i className="ti ti-settings me-1" />
                        Configure
                      </button>
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <div className="eml-panel">
                    <div className="eml-panel-band is-ok">
                      <span className="eml-panel-ic">
                        <i className="ti ti-certificate" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="eml-panel-title">Transport security</p>
                        <p>What happens on the wire</p>
                      </div>
                      <span className="eml-badge is-ok">TLS 1.3</span>
                    </div>
                    <div className="eml-panel-body">
                      <div className="eml-hdr">
                        <span className="eml-hdr-key">TLS</span>
                        <span className="eml-hdr-val">
                          Required — a plaintext session is abandoned
                        </span>
                        <div className="eml-hdr-ctl">
                          <div className="form-check form-switch mb-0">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              role="switch"
                              id="eml_sw_20"
                              defaultChecked
                            />
                            <label
                              className="form-check-label visually-hidden"
                              htmlFor="eml_sw_20"
                            >
                              Enable
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="eml-hdr">
                        <span className="eml-hdr-key">Minimum version</span>
                        <span className="eml-hdr-val">TLS 1.2</span>
                        <span className="eml-hdr-ctl">
                          <select
                            className="eml-select"
                            aria-label="Setting value"
                          >
                            <option>TLS 1.2</option>
                            <option>TLS 1.3</option>
                            <option>TLS 1.0 — not recommended</option>
                          </select>
                        </span>
                      </div>
                      <div className="eml-hdr">
                        <span className="eml-hdr-key">SSL / implicit TLS</span>
                        <span className="eml-hdr-val">
                          Only on port 465, not in use here
                        </span>
                        <div className="eml-hdr-ctl">
                          <div className="form-check form-switch mb-0">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              role="switch"
                              id="eml_sw_21"
                            />
                            <label
                              className="form-check-label visually-hidden"
                              htmlFor="eml_sw_21"
                            >
                              Enable
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="eml-hdr">
                        <span className="eml-hdr-key">
                          Certificate validation
                        </span>
                        <span className="eml-hdr-val">
                          Full chain and hostname verified
                        </span>
                        <div className="eml-hdr-ctl">
                          <div className="form-check form-switch mb-0">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              role="switch"
                              id="eml_sw_22"
                              defaultChecked
                            />
                            <label
                              className="form-check-label visually-hidden"
                              htmlFor="eml_sw_22"
                            >
                              Enable
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="eml-panel-foot">
                      <span className="fs-12 text-muted">4 settings</span>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-light bg-white d-inline-flex align-items-center"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#eml_workspace"
                        aria-label="Open configuration workspace for Transport security"
                      >
                        <i className="ti ti-settings me-1" />
                        Configure
                      </button>
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <span className="eml-lbl">OAuth connections</span>
                  <div className="row g-4">
                    <div className="col-12">
                      <div className="eml-panel">
                        <div className="eml-panel-band is-ok">
                          <span className="eml-panel-ic">
                            <i className="ti ti-brand-google" />
                          </span>
                          <div className="flex-fill overflow-hidden">
                            <p className="eml-panel-title">Google Workspace</p>
                            <p>gmail.send, gmail.compose</p>
                          </div>
                          <span className="eml-badge is-ok">Connected</span>
                        </div>
                        <div className="eml-panel-body">
                          <div className="eml-hdr">
                            <span className="eml-hdr-key">Account</span>
                            <span className="eml-hdr-val eml-mono">
                              mail-service@karkaii.edu
                            </span>
                            <span className="eml-hdr-ctl" />
                          </div>
                          <div className="eml-hdr">
                            <span className="eml-hdr-key">Token expires</span>
                            <span className="eml-hdr-val">
                              Auto-renewed hourly
                            </span>
                            <span className="eml-hdr-ctl" />
                          </div>
                          <div className="eml-hdr">
                            <span className="eml-hdr-key">Refresh</span>
                            <span className="eml-hdr-val">
                              Refresh token held
                            </span>
                            <span className="eml-hdr-ctl" />
                          </div>
                        </div>
                        <div className="eml-panel-foot">
                          <span className="fs-12 text-muted">
                            Granted 11 Jun 2026
                          </span>
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-light bg-white"
                            data-bs-toggle="offcanvas"
                            data-bs-target="#eml_workspace"
                            aria-label="Open configuration workspace for Google Workspace"
                          >
                            Details
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="eml-panel">
                        <div className="eml-panel-band is-ok">
                          <span className="eml-panel-ic">
                            <i className="ti ti-brand-windows" />
                          </span>
                          <div className="flex-fill overflow-hidden">
                            <p className="eml-panel-title">Microsoft 365</p>
                            <p>Mail.Send, SMTP.Send</p>
                          </div>
                          <span className="eml-badge is-ok">Connected</span>
                        </div>
                        <div className="eml-panel-body">
                          <div className="eml-hdr">
                            <span className="eml-hdr-key">Account</span>
                            <span className="eml-hdr-val eml-mono">
                              noreply@karkaii.edu
                            </span>
                            <span className="eml-hdr-ctl" />
                          </div>
                          <div className="eml-hdr">
                            <span className="eml-hdr-key">Token expires</span>
                            <span className="eml-hdr-val">14 Aug 2026</span>
                            <span className="eml-hdr-ctl" />
                          </div>
                          <div className="eml-hdr">
                            <span className="eml-hdr-key">Refresh</span>
                            <span className="eml-hdr-val">
                              Refresh token held
                            </span>
                            <span className="eml-hdr-ctl" />
                          </div>
                        </div>
                        <div className="eml-panel-foot">
                          <span className="fs-12 text-muted">
                            Granted 02 Feb 2026
                          </span>
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-light bg-white"
                            data-bs-toggle="offcanvas"
                            data-bs-target="#eml_workspace"
                            aria-label="Open configuration workspace for Microsoft 365"
                          >
                            Details
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="eml-panel">
                        <div className="eml-panel-band is-info">
                          <span className="eml-panel-ic">
                            <i className="ti ti-brand-aws" />
                          </span>
                          <div className="flex-fill overflow-hidden">
                            <p className="eml-panel-title">Amazon SES</p>
                            <p>ses:SendRawEmail</p>
                          </div>
                          <span className="eml-badge is-info">IAM key</span>
                        </div>
                        <div className="eml-panel-body">
                          <div className="eml-hdr">
                            <span className="eml-hdr-key">Account</span>
                            <span className="eml-hdr-val eml-mono">
                              AKIA••••7QK4
                            </span>
                            <span className="eml-hdr-ctl" />
                          </div>
                          <div className="eml-hdr">
                            <span className="eml-hdr-key">Token expires</span>
                            <span className="eml-hdr-val">Does not expire</span>
                            <span className="eml-hdr-ctl" />
                          </div>
                          <div className="eml-hdr">
                            <span className="eml-hdr-key">Refresh</span>
                            <span className="eml-hdr-val">
                              Rotated every 180 days
                            </span>
                            <span className="eml-hdr-ctl" />
                          </div>
                        </div>
                        <div className="eml-panel-foot">
                          <span className="fs-12 text-muted">
                            Rotated 11 Jun 2026
                          </span>
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-light bg-white"
                            data-bs-toggle="offcanvas"
                            data-bs-target="#eml_workspace"
                            aria-label="Open configuration workspace for Amazon SES"
                          >
                            Details
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="tab-pane fade"
              id="emlpane-sender"
              role="tabpanel"
              aria-labelledby="emltab-sender"
              tabIndex={0}
            >
              <div className="d-flex align-items-end justify-content-between gap-3 flex-wrap mb-3">
                <div>
                  <span className="eml-lbl">Section 04</span>
                  <h2 className="eml-hero-title fs-20 mb-1">Sender Identity</h2>
                  <p className="fs-13 text-muted mb-0">
                    The name, address and signature every message carries.
                  </p>
                </div>
              </div>
              <div className="row g-4">
                <div className="col-12">
                  <div className="eml-ident">
                    <div className="eml-ident-top">
                      <span className="eml-ident-av">PS</span>
                      <div className="flex-fill overflow-hidden">
                        <p className="eml-ident-name">
                          Karkaii International School
                        </p>
                        <p>noreply@karkaii.edu</p>
                      </div>
                      <span className="eml-seal">
                        <i className="ti ti-discount" />
                        Verified
                      </span>
                    </div>
                    <div>
                      <div className="eml-hdr">
                        <span className="eml-hdr-key">Organisation</span>
                        <span className="eml-hdr-val">
                          Karkaii International School
                        </span>
                        <span className="eml-hdr-ctl" />
                      </div>
                      <div className="eml-hdr">
                        <span className="eml-hdr-key">Reply-To</span>
                        <span className="eml-hdr-val eml-mono">
                          office@karkaii.edu
                        </span>
                        <span className="eml-hdr-ctl" />
                      </div>
                    </div>
                    <div className="eml-ident-sig">
                      <strong>Karkaii International School</strong>Karkaii
                      International School
                      <br />
                      12 Anna Salai, Chennai 600002
                      <br />
                      +91 44 4000 1200
                    </div>
                    <div className="eml-ident-foot">
                      <span className="fs-12 text-muted">
                        Default · used by 8 templates
                      </span>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-light bg-white"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#eml_workspace"
                        aria-label="Open configuration workspace for Karkaii International School"
                      >
                        Configure
                      </button>
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <div className="eml-ident">
                    <div className="eml-ident-top">
                      <span className="eml-ident-av">AC</span>
                      <div className="flex-fill overflow-hidden">
                        <p className="eml-ident-name">Karkaii Accounts</p>
                        <p>fees@karkaii.edu</p>
                      </div>
                      <span className="eml-seal">
                        <i className="ti ti-discount" />
                        Verified
                      </span>
                    </div>
                    <div>
                      <div className="eml-hdr">
                        <span className="eml-hdr-key">Organisation</span>
                        <span className="eml-hdr-val">
                          Karkaii International School
                        </span>
                        <span className="eml-hdr-ctl" />
                      </div>
                      <div className="eml-hdr">
                        <span className="eml-hdr-key">Reply-To</span>
                        <span className="eml-hdr-val eml-mono">
                          fees@karkaii.edu
                        </span>
                        <span className="eml-hdr-ctl" />
                      </div>
                    </div>
                    <div className="eml-ident-sig">
                      <strong>Karkaii Accounts</strong>Accounts Office ·
                      Karkaii
                      <br />
                      Counter hours 9:00 – 15:00
                      <br />
                      +91 44 4000 1204
                    </div>
                    <div className="eml-ident-foot">
                      <span className="fs-12 text-muted">
                        Used by fee and invoice mail
                      </span>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-light bg-white"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#eml_workspace"
                        aria-label="Open configuration workspace for Karkaii Accounts"
                      >
                        Configure
                      </button>
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <div className="eml-ident is-unverified">
                    <div className="eml-ident-top">
                      <span className="eml-ident-av">AD</span>
                      <div className="flex-fill overflow-hidden">
                        <p className="eml-ident-name">Admissions Office</p>
                        <p>admissions@karkaii.edu</p>
                      </div>
                      <span className="eml-seal is-warn">
                        <i className="ti ti-clock" />
                        Pending
                      </span>
                    </div>
                    <div>
                      <div className="eml-hdr">
                        <span className="eml-hdr-key">Organisation</span>
                        <span className="eml-hdr-val">
                          Karkaii International School
                        </span>
                        <span className="eml-hdr-ctl" />
                      </div>
                      <div className="eml-hdr">
                        <span className="eml-hdr-key">Reply-To</span>
                        <span className="eml-hdr-val eml-mono">
                          admissions@karkaii.edu
                        </span>
                        <span className="eml-hdr-ctl" />
                      </div>
                    </div>
                    <div className="eml-ident-sig">
                      <strong>Admissions Office</strong>Admissions Office ·
                      Karkaii
                      <br />
                      Enquiries answered within 2 working days
                    </div>
                    <div className="eml-ident-foot">
                      <span className="fs-12 text-muted">
                        Awaiting domain verification
                      </span>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-light bg-white"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#eml_workspace"
                        aria-label="Open configuration workspace for Admissions Office"
                      >
                        Configure
                      </button>
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <div className="eml-panel">
                    <div className="eml-panel-band">
                      <span className="eml-panel-ic">
                        <i className="ti ti-photo" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="eml-panel-title">Brand assets</p>
                        <p>What appears at the head of a message</p>
                      </div>
                      <span className="eml-badge is-ok">Set</span>
                    </div>
                    <div className="eml-panel-body">
                      <div className="eml-hdr">
                        <span className="eml-hdr-key">Header logo</span>
                        <span className="eml-hdr-val">
                          karkaii-mail-logo.png · 320 × 80
                        </span>
                        <span className="eml-hdr-ctl">
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-light bg-white"
                            data-bs-toggle="offcanvas"
                            data-bs-target="#eml_workspace"
                            aria-label="Open configuration workspace for Header logo"
                          >
                            Replace
                          </button>
                        </span>
                      </div>
                      <div className="eml-hdr">
                        <span className="eml-hdr-key">Accent colour</span>
                        <span className="eml-hdr-val">
                          #3D5EE1 — used on buttons and rules
                        </span>
                        <span className="eml-hdr-ctl">
                          <span className="eml-secret">#3D5EE1</span>
                        </span>
                      </div>
                      <div className="eml-hdr">
                        <span className="eml-hdr-key">Dark-mode logo</span>
                        <span className="eml-hdr-val">
                          Not set — the light logo is used everywhere
                        </span>
                        <span className="eml-hdr-ctl">
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-light bg-white"
                            data-bs-toggle="offcanvas"
                            data-bs-target="#eml_workspace"
                            aria-label="Open configuration workspace for Dark-mode logo"
                          >
                            Add
                          </button>
                        </span>
                      </div>
                      <div className="eml-hdr">
                        <span className="eml-hdr-key">Social links</span>
                        <span className="eml-hdr-val">
                          Facebook, X, Instagram, YouTube
                        </span>
                        <div className="eml-hdr-ctl">
                          <div className="form-check form-switch mb-0">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              role="switch"
                              id="eml_sw_23"
                              defaultChecked
                            />
                            <label
                              className="form-check-label visually-hidden"
                              htmlFor="eml_sw_23"
                            >
                              Enable
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="eml-panel-foot">
                      <span className="fs-12 text-muted">4 settings</span>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-light bg-white d-inline-flex align-items-center"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#eml_workspace"
                        aria-label="Open configuration workspace for Brand assets"
                      >
                        <i className="ti ti-settings me-1" />
                        Configure
                      </button>
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <div className="eml-panel">
                    <div className="eml-panel-band is-warn">
                      <span className="eml-panel-ic">
                        <i className="ti ti-world-check" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="eml-panel-title">Verified domains</p>
                        <p>Only a verified domain may appear in From</p>
                      </div>
                      <span className="eml-badge is-warn">1 pending</span>
                    </div>
                    <div className="eml-panel-body">
                      <div className="eml-hdr">
                        <span className="eml-hdr-key">karkaii.edu</span>
                        <span className="eml-hdr-val">
                          Verified 02 Feb 2026 — primary sending domain
                        </span>
                        <span className="eml-hdr-ctl">
                          <span className="eml-seal">
                            <i className="ti ti-check" />
                            Verified
                          </span>
                        </span>
                      </div>
                      <div className="eml-hdr">
                        <span className="eml-hdr-key">mail.karkaii.edu</span>
                        <span className="eml-hdr-val">
                          Verified 02 Feb 2026 — used for bounce return path
                        </span>
                        <span className="eml-hdr-ctl">
                          <span className="eml-seal">
                            <i className="ti ti-check" />
                            Verified
                          </span>
                        </span>
                      </div>
                      <div className="eml-hdr">
                        <span className="eml-hdr-key">karkaii.org</span>
                        <span className="eml-hdr-val">
                          Awaiting the TXT record to appear in DNS
                        </span>
                        <span className="eml-hdr-ctl">
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-light bg-white"
                            data-bs-toggle="modal"
                            data-bs-target="#eml_verify"
                          >
                            Verify
                          </button>
                        </span>
                      </div>
                    </div>
                    <div className="eml-panel-foot">
                      <span className="fs-12 text-muted">3 domains</span>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-light bg-white d-inline-flex align-items-center"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#eml_workspace"
                        aria-label="Open configuration workspace for Verified domains"
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
              id="emlpane-templates"
              role="tabpanel"
              aria-labelledby="emltab-templates"
              tabIndex={0}
            >
              <div className="d-flex align-items-end justify-content-between gap-3 flex-wrap mb-3">
                <div>
                  <span className="eml-lbl">Section 05</span>
                  <h2 className="eml-hero-title fs-20 mb-1">Templates</h2>
                  <p className="fs-13 text-muted mb-0">
                    Ten messages the system knows how to write.
                  </p>
                </div>
              </div>
              <div className="d-flex align-items-center justify-content-between gap-3 flex-wrap mb-3">
                <p className="fs-13 text-muted mb-0">
                  Ten templates, each with a plain-text alternative.
                  Placeholders in braces are filled from the student record at
                  send time.
                </p>
                <button
                  type="button"
                  className="btn btn-primary btn-sm d-inline-flex align-items-center"
                  data-bs-toggle="modal"
                  data-bs-target="#eml_template"
                >
                  <i className="ti ti-plus me-1" />
                  New template
                </button>
              </div>
              <div className="row g-4">
                <div className="col-xxl-3 col-lg-4 col-md-6">
                  <div className="eml-tpl">
                    <div className="eml-tpl-paper">
                      <div className="eml-tpl-act">
                        <button
                          type="button"
                          className="btn btn-sm btn-white border d-inline-flex align-items-center"
                          data-bs-toggle="offcanvas"
                          data-bs-target="#eml_workspace"
                          aria-label="Open configuration workspace for Welcome Email"
                        >
                          <i className="ti ti-eye" />
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-white border d-inline-flex align-items-center"
                          data-bs-toggle="modal"
                          data-bs-target="#eml_template"
                          aria-label="Customize Welcome Email"
                        >
                          <i className="ti ti-pencil" />
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-white border d-inline-flex align-items-center"
                          data-bs-toggle="modal"
                          data-bs-target="#eml_sendtest"
                          aria-label="Send test of Welcome Email"
                        >
                          <i className="ti ti-send" />
                        </button>
                      </div>
                      <span className="eml-tpl-sub">
                        Welcome to Karkaii, {"{"}student{"}"}
                      </span>
                      <div className="eml-tpl-lines">
                        <i />
                        <i />
                        <i />
                        <i />
                      </div>
                    </div>
                    <div className="eml-tpl-meta">
                      <div className="flex-fill overflow-hidden">
                        <p className="eml-tpl-name">Welcome Email</p>
                        <p>Sent on first login</p>
                      </div>
                      <span className="eml-badge is-ok">Published</span>
                    </div>
                    <div className="eml-tpl-foot">
                      <span>Edited 14 Jun</span>
                      <span className="eml-mono">HTML + text</span>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-3 col-lg-4 col-md-6">
                  <div className="eml-tpl">
                    <div className="eml-tpl-paper">
                      <div className="eml-tpl-act">
                        <button
                          type="button"
                          className="btn btn-sm btn-white border d-inline-flex align-items-center"
                          data-bs-toggle="offcanvas"
                          data-bs-target="#eml_workspace"
                          aria-label="Open configuration workspace for Admission Confirmation"
                        >
                          <i className="ti ti-eye" />
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-white border d-inline-flex align-items-center"
                          data-bs-toggle="modal"
                          data-bs-target="#eml_template"
                          aria-label="Customize Admission Confirmation"
                        >
                          <i className="ti ti-pencil" />
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-white border d-inline-flex align-items-center"
                          data-bs-toggle="modal"
                          data-bs-target="#eml_sendtest"
                          aria-label="Send test of Admission Confirmation"
                        >
                          <i className="ti ti-send" />
                        </button>
                      </div>
                      <span className="eml-tpl-sub">
                        Your admission is confirmed
                      </span>
                      <div className="eml-tpl-lines">
                        <i />
                        <i />
                        <i />
                        <i />
                      </div>
                    </div>
                    <div className="eml-tpl-meta">
                      <div className="flex-fill overflow-hidden">
                        <p className="eml-tpl-name">Admission Confirmation</p>
                        <p>Sent when a seat is allotted</p>
                      </div>
                      <span className="eml-badge is-ok">Published</span>
                    </div>
                    <div className="eml-tpl-foot">
                      <span>Edited 02 May</span>
                      <span className="eml-mono">HTML + text</span>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-3 col-lg-4 col-md-6">
                  <div className="eml-tpl">
                    <div className="eml-tpl-paper">
                      <div className="eml-tpl-act">
                        <button
                          type="button"
                          className="btn btn-sm btn-white border d-inline-flex align-items-center"
                          data-bs-toggle="offcanvas"
                          data-bs-target="#eml_workspace"
                          aria-label="Open configuration workspace for Fee Reminder"
                        >
                          <i className="ti ti-eye" />
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-white border d-inline-flex align-items-center"
                          data-bs-toggle="modal"
                          data-bs-target="#eml_template"
                          aria-label="Customize Fee Reminder"
                        >
                          <i className="ti ti-pencil" />
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-white border d-inline-flex align-items-center"
                          data-bs-toggle="modal"
                          data-bs-target="#eml_sendtest"
                          aria-label="Send test of Fee Reminder"
                        >
                          <i className="ti ti-send" />
                        </button>
                      </div>
                      <span className="eml-tpl-sub">
                        Fee due on {"{"}date{"}"} — {"{"}amount{"}"}
                      </span>
                      <div className="eml-tpl-lines">
                        <i />
                        <i />
                        <i />
                        <i />
                      </div>
                    </div>
                    <div className="eml-tpl-meta">
                      <div className="flex-fill overflow-hidden">
                        <p className="eml-tpl-name">Fee Reminder</p>
                        <p>Three before, one after the due date</p>
                      </div>
                      <span className="eml-badge is-ok">Published</span>
                    </div>
                    <div className="eml-tpl-foot">
                      <span>Edited 28 Jul</span>
                      <span className="eml-mono">HTML + text</span>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-3 col-lg-4 col-md-6">
                  <div className="eml-tpl">
                    <div className="eml-tpl-paper">
                      <div className="eml-tpl-act">
                        <button
                          type="button"
                          className="btn btn-sm btn-white border d-inline-flex align-items-center"
                          data-bs-toggle="offcanvas"
                          data-bs-target="#eml_workspace"
                          aria-label="Open configuration workspace for Attendance Alert"
                        >
                          <i className="ti ti-eye" />
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-white border d-inline-flex align-items-center"
                          data-bs-toggle="modal"
                          data-bs-target="#eml_template"
                          aria-label="Customize Attendance Alert"
                        >
                          <i className="ti ti-pencil" />
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-white border d-inline-flex align-items-center"
                          data-bs-toggle="modal"
                          data-bs-target="#eml_sendtest"
                          aria-label="Send test of Attendance Alert"
                        >
                          <i className="ti ti-send" />
                        </button>
                      </div>
                      <span className="eml-tpl-sub">
                        {"{"}student{"}"} was marked absent today
                      </span>
                      <div className="eml-tpl-lines">
                        <i />
                        <i />
                        <i />
                        <i />
                      </div>
                    </div>
                    <div className="eml-tpl-meta">
                      <div className="flex-fill overflow-hidden">
                        <p className="eml-tpl-name">Attendance Alert</p>
                        <p>Sent at 11:00 on an unexplained absence</p>
                      </div>
                      <span className="eml-badge is-ok">Published</span>
                    </div>
                    <div className="eml-tpl-foot">
                      <span>Edited 19 Jun</span>
                      <span className="eml-mono">HTML + text</span>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-3 col-lg-4 col-md-6">
                  <div className="eml-tpl">
                    <div className="eml-tpl-paper">
                      <div className="eml-tpl-act">
                        <button
                          type="button"
                          className="btn btn-sm btn-white border d-inline-flex align-items-center"
                          data-bs-toggle="offcanvas"
                          data-bs-target="#eml_workspace"
                          aria-label="Open configuration workspace for Exam Result"
                        >
                          <i className="ti ti-eye" />
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-white border d-inline-flex align-items-center"
                          data-bs-toggle="modal"
                          data-bs-target="#eml_template"
                          aria-label="Customize Exam Result"
                        >
                          <i className="ti ti-pencil" />
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-white border d-inline-flex align-items-center"
                          data-bs-toggle="modal"
                          data-bs-target="#eml_sendtest"
                          aria-label="Send test of Exam Result"
                        >
                          <i className="ti ti-send" />
                        </button>
                      </div>
                      <span className="eml-tpl-sub">
                        {"{"}exam{"}"} results are available
                      </span>
                      <div className="eml-tpl-lines">
                        <i />
                        <i />
                        <i />
                        <i />
                      </div>
                    </div>
                    <div className="eml-tpl-meta">
                      <div className="flex-fill overflow-hidden">
                        <p className="eml-tpl-name">Exam Result</p>
                        <p>Sent when results are released</p>
                      </div>
                      <span className="eml-badge is-ok">Published</span>
                    </div>
                    <div className="eml-tpl-foot">
                      <span>Edited 11 Jul</span>
                      <span className="eml-mono">HTML + text</span>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-3 col-lg-4 col-md-6">
                  <div className="eml-tpl">
                    <div className="eml-tpl-paper">
                      <div className="eml-tpl-act">
                        <button
                          type="button"
                          className="btn btn-sm btn-white border d-inline-flex align-items-center"
                          data-bs-toggle="offcanvas"
                          data-bs-target="#eml_workspace"
                          aria-label="Open configuration workspace for Parent Meeting"
                        >
                          <i className="ti ti-eye" />
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-white border d-inline-flex align-items-center"
                          data-bs-toggle="modal"
                          data-bs-target="#eml_template"
                          aria-label="Customize Parent Meeting"
                        >
                          <i className="ti ti-pencil" />
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-white border d-inline-flex align-items-center"
                          data-bs-toggle="modal"
                          data-bs-target="#eml_sendtest"
                          aria-label="Send test of Parent Meeting"
                        >
                          <i className="ti ti-send" />
                        </button>
                      </div>
                      <span className="eml-tpl-sub">
                        Parent–teacher meeting on {"{"}date{"}"}
                      </span>
                      <div className="eml-tpl-lines">
                        <i />
                        <i />
                        <i />
                        <i />
                      </div>
                    </div>
                    <div className="eml-tpl-meta">
                      <div className="flex-fill overflow-hidden">
                        <p className="eml-tpl-name">Parent Meeting</p>
                        <p>Sent when a slot is booked</p>
                      </div>
                      <span className="eml-badge is-ok">Published</span>
                    </div>
                    <div className="eml-tpl-foot">
                      <span>Edited 06 Jun</span>
                      <span className="eml-mono">HTML + text</span>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-3 col-lg-4 col-md-6">
                  <div className="eml-tpl is-draft">
                    <div className="eml-tpl-paper">
                      <div className="eml-tpl-act">
                        <button
                          type="button"
                          className="btn btn-sm btn-white border d-inline-flex align-items-center"
                          data-bs-toggle="offcanvas"
                          data-bs-target="#eml_workspace"
                          aria-label="Open configuration workspace for Homework Notification"
                        >
                          <i className="ti ti-eye" />
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-white border d-inline-flex align-items-center"
                          data-bs-toggle="modal"
                          data-bs-target="#eml_template"
                          aria-label="Customize Homework Notification"
                        >
                          <i className="ti ti-pencil" />
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-white border d-inline-flex align-items-center"
                          data-bs-toggle="modal"
                          data-bs-target="#eml_sendtest"
                          aria-label="Send test of Homework Notification"
                        >
                          <i className="ti ti-send" />
                        </button>
                      </div>
                      <span className="eml-tpl-sub">
                        Homework set for {"{"}subject{"}"}
                      </span>
                      <div className="eml-tpl-lines">
                        <i />
                        <i />
                        <i />
                        <i />
                      </div>
                    </div>
                    <div className="eml-tpl-meta">
                      <div className="flex-fill overflow-hidden">
                        <p className="eml-tpl-name">Homework Notification</p>
                        <p>Daily digest at 17:00</p>
                      </div>
                      <span className="eml-badge is-warn">Draft</span>
                    </div>
                    <div className="eml-tpl-foot">
                      <span>Edited yesterday</span>
                      <span className="eml-mono">HTML + text</span>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-3 col-lg-4 col-md-6">
                  <div className="eml-tpl">
                    <div className="eml-tpl-paper">
                      <div className="eml-tpl-act">
                        <button
                          type="button"
                          className="btn btn-sm btn-white border d-inline-flex align-items-center"
                          data-bs-toggle="offcanvas"
                          data-bs-target="#eml_workspace"
                          aria-label="Open configuration workspace for Password Reset"
                        >
                          <i className="ti ti-eye" />
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-white border d-inline-flex align-items-center"
                          data-bs-toggle="modal"
                          data-bs-target="#eml_template"
                          aria-label="Customize Password Reset"
                        >
                          <i className="ti ti-pencil" />
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-white border d-inline-flex align-items-center"
                          data-bs-toggle="modal"
                          data-bs-target="#eml_sendtest"
                          aria-label="Send test of Password Reset"
                        >
                          <i className="ti ti-send" />
                        </button>
                      </div>
                      <span className="eml-tpl-sub">
                        Reset your Karkaii password
                      </span>
                      <div className="eml-tpl-lines">
                        <i />
                        <i />
                        <i />
                        <i />
                      </div>
                    </div>
                    <div className="eml-tpl-meta">
                      <div className="flex-fill overflow-hidden">
                        <p className="eml-tpl-name">Password Reset</p>
                        <p>Sent on request, expires in 30 minutes</p>
                      </div>
                      <span className="eml-badge is-ok">Published</span>
                    </div>
                    <div className="eml-tpl-foot">
                      <span>Edited 22 Feb</span>
                      <span className="eml-mono">HTML + text</span>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-3 col-lg-4 col-md-6">
                  <div className="eml-tpl">
                    <div className="eml-tpl-paper">
                      <div className="eml-tpl-act">
                        <button
                          type="button"
                          className="btn btn-sm btn-white border d-inline-flex align-items-center"
                          data-bs-toggle="offcanvas"
                          data-bs-target="#eml_workspace"
                          aria-label="Open configuration workspace for Invoice Email"
                        >
                          <i className="ti ti-eye" />
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-white border d-inline-flex align-items-center"
                          data-bs-toggle="modal"
                          data-bs-target="#eml_template"
                          aria-label="Customize Invoice Email"
                        >
                          <i className="ti ti-pencil" />
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-white border d-inline-flex align-items-center"
                          data-bs-toggle="modal"
                          data-bs-target="#eml_sendtest"
                          aria-label="Send test of Invoice Email"
                        >
                          <i className="ti ti-send" />
                        </button>
                      </div>
                      <span className="eml-tpl-sub">
                        Invoice {"{"}number{"}"} from Karkaii
                      </span>
                      <div className="eml-tpl-lines">
                        <i />
                        <i />
                        <i />
                        <i />
                      </div>
                    </div>
                    <div className="eml-tpl-meta">
                      <div className="flex-fill overflow-hidden">
                        <p className="eml-tpl-name">Invoice Email</p>
                        <p>Attached as a PDF</p>
                      </div>
                      <span className="eml-badge is-ok">Published</span>
                    </div>
                    <div className="eml-tpl-foot">
                      <span>Edited 28 Jul</span>
                      <span className="eml-mono">HTML + text</span>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-3 col-lg-4 col-md-6">
                  <div className="eml-tpl is-draft">
                    <div className="eml-tpl-paper">
                      <div className="eml-tpl-act">
                        <button
                          type="button"
                          className="btn btn-sm btn-white border d-inline-flex align-items-center"
                          data-bs-toggle="offcanvas"
                          data-bs-target="#eml_workspace"
                          aria-label="Open configuration workspace for Newsletter"
                        >
                          <i className="ti ti-eye" />
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-white border d-inline-flex align-items-center"
                          data-bs-toggle="modal"
                          data-bs-target="#eml_template"
                          aria-label="Customize Newsletter"
                        >
                          <i className="ti ti-pencil" />
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-white border d-inline-flex align-items-center"
                          data-bs-toggle="modal"
                          data-bs-target="#eml_sendtest"
                          aria-label="Send test of Newsletter"
                        >
                          <i className="ti ti-send" />
                        </button>
                      </div>
                      <span className="eml-tpl-sub">
                        Karkaii monthly newsletter
                      </span>
                      <div className="eml-tpl-lines">
                        <i />
                        <i />
                        <i />
                        <i />
                      </div>
                    </div>
                    <div className="eml-tpl-meta">
                      <div className="flex-fill overflow-hidden">
                        <p className="eml-tpl-name">Newsletter</p>
                        <p>First working day of the month</p>
                      </div>
                      <span className="eml-badge is-warn">Draft</span>
                    </div>
                    <div className="eml-tpl-foot">
                      <span>Edited 30 Jul</span>
                      <span className="eml-mono">HTML + text</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="tab-pane fade"
              id="emlpane-notifications"
              role="tabpanel"
              aria-labelledby="emltab-notifications"
              tabIndex={0}
            >
              <div className="d-flex align-items-end justify-content-between gap-3 flex-wrap mb-3">
                <div>
                  <span className="eml-lbl">Section 06</span>
                  <h2 className="eml-hero-title fs-20 mb-1">
                    Notification Emails
                  </h2>
                  <p className="fs-13 text-muted mb-0">
                    What the system sends without being asked.
                  </p>
                </div>
              </div>
              <div className="d-flex align-items-center justify-content-between gap-3 flex-wrap mb-3">
                <p className="fs-13 text-muted mb-0">
                  What the system sends on its own. Each rule names who receives
                  it, so nothing reaches a family by accident.
                </p>
                <span className="eml-badge is-info">
                  Quiet hours 21:00 – 07:00
                </span>
              </div>
              <div className="eml-rule">
                <span className="eml-rule-ic">
                  <i className="ti ti-cash" />
                </span>
                <div className="eml-rule-body">
                  <strong>Fee due and overdue</strong>
                  <p>
                    3 reminders before the due date, 1 after. Never more than
                    one message a day per family.
                  </p>
                  <div className="d-flex align-items-center gap-2 flex-wrap mt-2">
                    <span className="badge-meta">
                      <i className="ti ti-users" />
                      Guardians with an open balance
                    </span>
                    <span className="badge-meta">
                      <i className="ti ti-send" />
                      Email + SMS
                    </span>
                  </div>
                </div>
                <div className="eml-rule-ctl">
                  <div className="form-check form-switch mb-0">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      role="switch"
                      id="eml_sw_24"
                      defaultChecked
                    />
                    <label
                      className="form-check-label visually-hidden"
                      htmlFor="eml_sw_24"
                    >
                      Enable
                    </label>
                  </div>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-light bg-white"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#eml_workspace"
                    aria-label="Open configuration workspace for Fee due and overdue"
                  >
                    Configure
                  </button>
                </div>
              </div>
              <div className="eml-rule">
                <span className="eml-rule-ic">
                  <i className="ti ti-calendar-x" />
                </span>
                <div className="eml-rule-body">
                  <strong>Unexplained absence</strong>
                  <p>
                    Sent at 11:00, once attendance is locked for the morning
                    session.
                  </p>
                  <div className="d-flex align-items-center gap-2 flex-wrap mt-2">
                    <span className="badge-meta">
                      <i className="ti ti-users" />
                      Guardians of the absent student
                    </span>
                    <span className="badge-meta">
                      <i className="ti ti-send" />
                      Email + SMS
                    </span>
                  </div>
                </div>
                <div className="eml-rule-ctl">
                  <div className="form-check form-switch mb-0">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      role="switch"
                      id="eml_sw_25"
                      defaultChecked
                    />
                    <label
                      className="form-check-label visually-hidden"
                      htmlFor="eml_sw_25"
                    >
                      Enable
                    </label>
                  </div>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-light bg-white"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#eml_workspace"
                    aria-label="Open configuration workspace for Unexplained absence"
                  >
                    Configure
                  </button>
                </div>
              </div>
              <div className="eml-rule">
                <span className="eml-rule-ic">
                  <i className="ti ti-file-certificate" />
                </span>
                <div className="eml-rule-body">
                  <strong>Results released</strong>
                  <p>
                    Held until the class teacher signs off, so no result reaches
                    a family early.
                  </p>
                  <div className="d-flex align-items-center gap-2 flex-wrap mt-2">
                    <span className="badge-meta">
                      <i className="ti ti-users" />
                      Guardians and the student
                    </span>
                    <span className="badge-meta">
                      <i className="ti ti-send" />
                      Email
                    </span>
                  </div>
                </div>
                <div className="eml-rule-ctl">
                  <div className="form-check form-switch mb-0">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      role="switch"
                      id="eml_sw_26"
                      defaultChecked
                    />
                    <label
                      className="form-check-label visually-hidden"
                      htmlFor="eml_sw_26"
                    >
                      Enable
                    </label>
                  </div>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-light bg-white"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#eml_workspace"
                    aria-label="Open configuration workspace for Results released"
                  >
                    Configure
                  </button>
                </div>
              </div>
              <div className="eml-rule is-off">
                <span className="eml-rule-ic">
                  <i className="ti ti-book" />
                </span>
                <div className="eml-rule-body">
                  <strong>Homework digest</strong>
                  <p>
                    Off while the template is a draft. Would send one digest at
                    17:00 rather than a message per subject.
                  </p>
                  <div className="d-flex align-items-center gap-2 flex-wrap mt-2">
                    <span className="badge-meta">
                      <i className="ti ti-users" />
                      Guardians of the class
                    </span>
                    <span className="badge-meta">
                      <i className="ti ti-send" />
                      Email
                    </span>
                  </div>
                </div>
                <div className="eml-rule-ctl">
                  <div className="form-check form-switch mb-0">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      role="switch"
                      id="eml_sw_27"
                    />
                    <label
                      className="form-check-label visually-hidden"
                      htmlFor="eml_sw_27"
                    >
                      Enable
                    </label>
                  </div>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-light bg-white"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#eml_workspace"
                    aria-label="Open configuration workspace for Homework digest"
                  >
                    Configure
                  </button>
                </div>
              </div>
              <div className="eml-rule">
                <span className="eml-rule-ic">
                  <i className="ti ti-users" />
                </span>
                <div className="eml-rule-body">
                  <strong>Parent-teacher meeting</strong>
                  <p>
                    Includes an .ics attachment so the slot lands in the
                    guardian’s calendar.
                  </p>
                  <div className="d-flex align-items-center gap-2 flex-wrap mt-2">
                    <span className="badge-meta">
                      <i className="ti ti-users" />
                      The booked guardian
                    </span>
                    <span className="badge-meta">
                      <i className="ti ti-send" />
                      Email + calendar invite
                    </span>
                  </div>
                </div>
                <div className="eml-rule-ctl">
                  <div className="form-check form-switch mb-0">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      role="switch"
                      id="eml_sw_28"
                      defaultChecked
                    />
                    <label
                      className="form-check-label visually-hidden"
                      htmlFor="eml_sw_28"
                    >
                      Enable
                    </label>
                  </div>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-light bg-white"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#eml_workspace"
                    aria-label="Open configuration workspace for Parent-teacher meeting"
                  >
                    Configure
                  </button>
                </div>
              </div>
              <div className="eml-rule">
                <span className="eml-rule-ic">
                  <i className="ti ti-alert-triangle" />
                </span>
                <div className="eml-rule-body">
                  <strong>System alerts</strong>
                  <p>
                    Delivery failures, provider outages and quota warnings.
                    Never sent to families.
                  </p>
                  <div className="d-flex align-items-center gap-2 flex-wrap mt-2">
                    <span className="badge-meta">
                      <i className="ti ti-users" />
                      Administrators only
                    </span>
                    <span className="badge-meta">
                      <i className="ti ti-send" />
                      Email
                    </span>
                  </div>
                </div>
                <div className="eml-rule-ctl">
                  <div className="form-check form-switch mb-0">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      role="switch"
                      id="eml_sw_29"
                      defaultChecked
                    />
                    <label
                      className="form-check-label visually-hidden"
                      htmlFor="eml_sw_29"
                    >
                      Enable
                    </label>
                  </div>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-light bg-white"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#eml_workspace"
                    aria-label="Open configuration workspace for System alerts"
                  >
                    Configure
                  </button>
                </div>
              </div>
            </div>
            <div
              className="tab-pane fade"
              id="emlpane-delivery"
              role="tabpanel"
              aria-labelledby="emltab-delivery"
              tabIndex={0}
            >
              <div className="d-flex align-items-end justify-content-between gap-3 flex-wrap mb-3">
                <div>
                  <span className="eml-lbl">Section 07</span>
                  <h2 className="eml-hero-title fs-20 mb-1">
                    Delivery Policies
                  </h2>
                  <p className="fs-13 text-muted mb-0">
                    Rate, retries, limits and which message goes first.
                  </p>
                </div>
              </div>
              <div className="row g-4">
                <div className="col-12">
                  <div className="eml-panel">
                    <div className="eml-panel-band is-info">
                      <span className="eml-panel-ic">
                        <i className="ti ti-stack-2" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="eml-panel-title">
                          Queue &amp; throughput
                        </p>
                        <p>How fast mail leaves the building</p>
                      </div>
                      <span className="eml-badge is-ok">Draining</span>
                    </div>
                    <div className="eml-panel-body">
                      <div className="eml-hdr">
                        <span className="eml-hdr-key">Queue mode</span>
                        <span className="eml-hdr-val">
                          Background worker, 4 threads
                        </span>
                        <span className="eml-hdr-ctl">
                          <select
                            className="eml-select"
                            aria-label="Setting value"
                          >
                            <option>Background worker</option>
                            <option>Immediate send</option>
                            <option>Cron batch</option>
                          </select>
                        </span>
                      </div>
                      <div className="eml-hdr">
                        <span className="eml-hdr-key">Send rate</span>
                        <span className="eml-hdr-val">
                          14 messages per second — the provider ceiling
                        </span>
                        <span className="eml-hdr-ctl">
                          <input
                            type="text"
                            className="eml-input is-mono"
                            defaultValue={14}
                            aria-label="Setting value"
                          />
                        </span>
                      </div>
                      <div className="eml-hdr">
                        <span className="eml-hdr-key">Batch size</span>
                        <span className="eml-hdr-val">
                          500 recipients per batch
                        </span>
                        <span className="eml-hdr-ctl">
                          <input
                            type="text"
                            className="eml-input is-mono"
                            defaultValue={500}
                            aria-label="Setting value"
                          />
                        </span>
                      </div>
                      <div className="eml-hdr">
                        <span className="eml-hdr-key">Delivery delay</span>
                        <span className="eml-hdr-val">
                          None for transactional, 30 minutes for bulk
                        </span>
                        <span className="eml-hdr-ctl">
                          <select
                            className="eml-select"
                            aria-label="Setting value"
                          >
                            <option>Bulk delayed 30 min</option>
                            <option>No delay</option>
                            <option>Bulk delayed 2 hours</option>
                          </select>
                        </span>
                      </div>
                    </div>
                    <div className="eml-panel-foot">
                      <span className="fs-12 text-muted">4 settings</span>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-light bg-white d-inline-flex align-items-center"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#eml_workspace"
                        aria-label="Open configuration workspace for Queue and throughput"
                      >
                        <i className="ti ti-settings me-1" />
                        Configure
                      </button>
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <div className="eml-panel">
                    <div className="eml-panel-band">
                      <span className="eml-panel-ic">
                        <i className="ti ti-refresh" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="eml-panel-title">Retry policy</p>
                        <p>What happens when a send does not succeed</p>
                      </div>
                      <span className="eml-badge">3 attempts</span>
                    </div>
                    <div className="eml-panel-body">
                      <div className="eml-hdr">
                        <span className="eml-hdr-key">Attempts</span>
                        <span className="eml-hdr-val">
                          3, then the message is failed
                        </span>
                        <span className="eml-hdr-ctl">
                          <input
                            type="text"
                            className="eml-input is-mono"
                            defaultValue={3}
                            aria-label="Setting value"
                          />
                        </span>
                      </div>
                      <div className="eml-hdr">
                        <span className="eml-hdr-key">Backoff</span>
                        <span className="eml-hdr-val">
                          5 min, 30 min, 2 hours
                        </span>
                        <span className="eml-hdr-ctl">
                          <select
                            className="eml-select"
                            aria-label="Setting value"
                          >
                            <option>
                              Exponential 5m / 30m / 2h
                            </option>
                            <option>Fixed 15 minutes</option>
                            <option>Fixed 1 hour</option>
                          </select>
                        </span>
                      </div>
                      <div className="eml-hdr">
                        <span className="eml-hdr-key">
                          Retry on soft bounce
                        </span>
                        <span className="eml-hdr-val">
                          A full mailbox or greylisting is worth retrying
                        </span>
                        <div className="eml-hdr-ctl">
                          <div className="form-check form-switch mb-0">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              role="switch"
                              id="eml_sw_30"
                              defaultChecked
                            />
                            <label
                              className="form-check-label visually-hidden"
                              htmlFor="eml_sw_30"
                            >
                              Enable
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="eml-hdr">
                        <span className="eml-hdr-key">
                          Retry on hard bounce
                        </span>
                        <span className="eml-hdr-val">
                          A dead address never becomes live
                        </span>
                        <div className="eml-hdr-ctl">
                          <div className="form-check form-switch mb-0">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              role="switch"
                              id="eml_sw_31"
                            />
                            <label
                              className="form-check-label visually-hidden"
                              htmlFor="eml_sw_31"
                            >
                              Enable
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="eml-panel-foot">
                      <span className="fs-12 text-muted">4 settings</span>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-light bg-white d-inline-flex align-items-center"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#eml_workspace"
                        aria-label="Open configuration workspace for Retry policy"
                      >
                        <i className="ti ti-settings me-1" />
                        Configure
                      </button>
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <div className="eml-panel">
                    <div className="eml-panel-band is-warn">
                      <span className="eml-panel-ic">
                        <i className="ti ti-gauge" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="eml-panel-title">Limits</p>
                        <p>Ceilings that protect the sending reputation</p>
                      </div>
                      <span className="eml-badge is-warn">80% of daily</span>
                    </div>
                    <div className="eml-panel-body">
                      <div className="eml-hdr">
                        <span className="eml-hdr-key">Daily limit</span>
                        <span className="eml-hdr-val">60,000 messages</span>
                        <span className="eml-hdr-ctl">
                          <input
                            type="text"
                            className="eml-input is-mono"
                            defaultValue={60000}
                            aria-label="Setting value"
                          />
                        </span>
                      </div>
                      <div className="eml-hdr">
                        <span className="eml-hdr-key">
                          Per-recipient daily cap
                        </span>
                        <span className="eml-hdr-val">
                          6 messages to one address
                        </span>
                        <span className="eml-hdr-ctl">
                          <input
                            type="text"
                            className="eml-input is-mono"
                            defaultValue={6}
                            aria-label="Setting value"
                          />
                        </span>
                      </div>
                      <div className="eml-hdr">
                        <span className="eml-hdr-key">Bulk send ceiling</span>
                        <span className="eml-hdr-val">
                          5,000 recipients per campaign
                        </span>
                        <span className="eml-hdr-ctl">
                          <input
                            type="text"
                            className="eml-input is-mono"
                            defaultValue={5000}
                            aria-label="Setting value"
                          />
                        </span>
                      </div>
                      <div className="eml-hdr">
                        <span className="eml-hdr-key">
                          On reaching the limit
                        </span>
                        <span className="eml-hdr-val">
                          Hold in the queue rather than fail
                        </span>
                        <span className="eml-hdr-ctl">
                          <select
                            className="eml-select"
                            aria-label="Setting value"
                          >
                            <option>Hold in queue</option>
                            <option>Fail immediately</option>
                            <option>Overflow to standby provider</option>
                          </select>
                        </span>
                      </div>
                    </div>
                    <div className="eml-panel-foot">
                      <span className="fs-12 text-muted">4 settings</span>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-light bg-white d-inline-flex align-items-center"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#eml_workspace"
                        aria-label="Open configuration workspace for Limits"
                      >
                        <i className="ti ti-settings me-1" />
                        Configure
                      </button>
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <div className="eml-panel">
                    <div className="eml-panel-band">
                      <span className="eml-panel-ic">
                        <i className="ti ti-flag" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="eml-panel-title">Priority levels</p>
                        <p>Which message overtakes which</p>
                      </div>
                      <span className="eml-badge is-info">4 levels</span>
                    </div>
                    <div className="eml-panel-body">
                      <div className="eml-hdr">
                        <span className="eml-hdr-key">Critical</span>
                        <span className="eml-hdr-val">
                          Password reset, security alerts — sent ahead of
                          everything
                        </span>
                        <span className="eml-hdr-ctl">
                          <span className="eml-badge is-bad">1</span>
                        </span>
                      </div>
                      <div className="eml-hdr">
                        <span className="eml-hdr-key">High</span>
                        <span className="eml-hdr-val">
                          Attendance alerts, results, admission letters
                        </span>
                        <span className="eml-hdr-ctl">
                          <span className="eml-badge is-warn">2</span>
                        </span>
                      </div>
                      <div className="eml-hdr">
                        <span className="eml-hdr-key">Normal</span>
                        <span className="eml-hdr-val">
                          Fee reminders, meeting confirmations, invoices
                        </span>
                        <span className="eml-hdr-ctl">
                          <span className="eml-badge is-info">3</span>
                        </span>
                      </div>
                      <div className="eml-hdr">
                        <span className="eml-hdr-key">Bulk</span>
                        <span className="eml-hdr-val">
                          Newsletters and digests — sent only when the queue is
                          quiet
                        </span>
                        <span className="eml-hdr-ctl">
                          <span className="eml-badge">4</span>
                        </span>
                      </div>
                    </div>
                    <div className="eml-panel-foot">
                      <span className="fs-12 text-muted">4 levels</span>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-light bg-white d-inline-flex align-items-center"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#eml_workspace"
                        aria-label="Open configuration workspace for Priority levels"
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
              id="emlpane-bounce"
              role="tabpanel"
              aria-labelledby="emltab-bounce"
              tabIndex={0}
            >
              <div className="d-flex align-items-end justify-content-between gap-3 flex-wrap mb-3">
                <div>
                  <span className="eml-lbl">Section 08</span>
                  <h2 className="eml-hero-title fs-20 mb-1">Bounce Handling</h2>
                  <p className="fs-13 text-muted mb-0">
                    What a rejection means and what follows it.
                  </p>
                </div>
              </div>
              <div className="row g-4">
                <div className="col-12">
                  <div className="eml-panel">
                    <div className="eml-panel-band is-warn">
                      <span className="eml-panel-ic">
                        <i className="ti ti-mail-x" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="eml-panel-title">Bounce policy</p>
                        <p>What a rejection means and what follows it</p>
                      </div>
                      <span className="eml-badge is-warn">2 today</span>
                    </div>
                    <div className="eml-panel-body">
                      <div className="eml-hdr">
                        <span className="eml-hdr-key">Return path</span>
                        <span className="eml-hdr-val">
                          bounce@mail.karkaii.edu
                        </span>
                        <span className="eml-hdr-ctl">
                          <input
                            type="text"
                            className="eml-input is-mono"
                            defaultValue="bounce@mail.karkaii.edu"
                            aria-label="Setting value"
                          />
                        </span>
                      </div>
                      <div className="eml-hdr">
                        <span className="eml-hdr-key">Hard bounce</span>
                        <span className="eml-hdr-val">
                          Suppress the address immediately
                        </span>
                        <span className="eml-hdr-ctl">
                          <select
                            className="eml-select"
                            aria-label="Setting value"
                          >
                            <option>Suppress immediately</option>
                            <option>Suppress after 2</option>
                            <option>Log only</option>
                          </select>
                        </span>
                      </div>
                      <div className="eml-hdr">
                        <span className="eml-hdr-key">Soft bounce</span>
                        <span className="eml-hdr-val">
                          Retry, then suppress after 5 consecutive failures
                        </span>
                        <span className="eml-hdr-ctl">
                          <input
                            type="text"
                            className="eml-input is-mono"
                            defaultValue={5}
                            aria-label="Setting value"
                          />
                        </span>
                      </div>
                      <div className="eml-hdr">
                        <span className="eml-hdr-key">
                          Complaint (spam report)
                        </span>
                        <span className="eml-hdr-val">
                          Suppress and notify an administrator
                        </span>
                        <div className="eml-hdr-ctl">
                          <div className="form-check form-switch mb-0">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              role="switch"
                              id="eml_sw_32"
                              defaultChecked
                            />
                            <label
                              className="form-check-label visually-hidden"
                              htmlFor="eml_sw_32"
                            >
                              Enable
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="eml-hdr">
                        <span className="eml-hdr-key">
                          Notify the class teacher
                        </span>
                        <span className="eml-hdr-val">
                          When a guardian address stops working
                        </span>
                        <div className="eml-hdr-ctl">
                          <div className="form-check form-switch mb-0">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              role="switch"
                              id="eml_sw_33"
                              defaultChecked
                            />
                            <label
                              className="form-check-label visually-hidden"
                              htmlFor="eml_sw_33"
                            >
                              Enable
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="eml-panel-foot">
                      <span className="fs-12 text-muted">
                        5 settings · 1 unpublished
                      </span>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-light bg-white d-inline-flex align-items-center"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#eml_workspace"
                        aria-label="Open configuration workspace for Bounce policy"
                      >
                        <i className="ti ti-settings me-1" />
                        Configure
                      </button>
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <div className="eml-panel">
                    <div className="eml-panel-band">
                      <span className="eml-panel-ic">
                        <i className="ti ti-shield-x" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="eml-panel-title">Spam protection</p>
                        <p>Keeping the domain trusted</p>
                      </div>
                      <span className="eml-badge is-ok">0.02% complaints</span>
                    </div>
                    <div className="eml-panel-body">
                      <div className="eml-hdr">
                        <span className="eml-hdr-key">
                          Complaint feedback loop
                        </span>
                        <span className="eml-hdr-val">
                          Registered with 4 mailbox providers
                        </span>
                        <div className="eml-hdr-ctl">
                          <div className="form-check form-switch mb-0">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              role="switch"
                              id="eml_sw_34"
                              defaultChecked
                            />
                            <label
                              className="form-check-label visually-hidden"
                              htmlFor="eml_sw_34"
                            >
                              Enable
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="eml-hdr">
                        <span className="eml-hdr-key">Content scan</span>
                        <span className="eml-hdr-val">
                          Warn before sending mail that scores as spam
                        </span>
                        <div className="eml-hdr-ctl">
                          <div className="form-check form-switch mb-0">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              role="switch"
                              id="eml_sw_35"
                              defaultChecked
                            />
                            <label
                              className="form-check-label visually-hidden"
                              htmlFor="eml_sw_35"
                            >
                              Enable
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="eml-hdr">
                        <span className="eml-hdr-key">Link rewriting</span>
                        <span className="eml-hdr-val">
                          Off — rewritten links reduce trust
                        </span>
                        <div className="eml-hdr-ctl">
                          <div className="form-check form-switch mb-0">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              role="switch"
                              id="eml_sw_36"
                            />
                            <label
                              className="form-check-label visually-hidden"
                              htmlFor="eml_sw_36"
                            >
                              Enable
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="eml-hdr">
                        <span className="eml-hdr-key">Reputation alerts</span>
                        <span className="eml-hdr-val">
                          Notify if the bounce rate passes 2%
                        </span>
                        <div className="eml-hdr-ctl">
                          <div className="form-check form-switch mb-0">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              role="switch"
                              id="eml_sw_37"
                              defaultChecked
                            />
                            <label
                              className="form-check-label visually-hidden"
                              htmlFor="eml_sw_37"
                            >
                              Enable
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="eml-panel-foot">
                      <span className="fs-12 text-muted">4 settings</span>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-light bg-white d-inline-flex align-items-center"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#eml_workspace"
                        aria-label="Open configuration workspace for Spam protection"
                      >
                        <i className="ti ti-settings me-1" />
                        Configure
                      </button>
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <span className="eml-lbl">Suppression list</span>
                  <div className="eml-empty">
                    <i className="ti ti-mail-off" />
                    <h3 className="fs-15 fw-medium">
                      No addresses suppressed this month
                    </h3>
                    <p>
                      Hard bounces and complaints land here and are never mailed
                      again until someone removes them. The list has been empty
                      since 04 Jul.
                    </p>
                    <button
                      type="button"
                      className="btn btn-outline-light bg-white btn-sm d-inline-flex align-items-center"
                      data-bs-toggle="offcanvas"
                      data-bs-target="#eml_workspace"
                      aria-label="Open configuration workspace for Suppression list"
                    >
                      <i className="ti ti-list-search me-1" />
                      View full history
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="tab-pane fade"
              id="emlpane-queue"
              role="tabpanel"
              aria-labelledby="emltab-queue"
              tabIndex={0}
            >
              <div className="d-flex align-items-end justify-content-between gap-3 flex-wrap mb-3">
                <div>
                  <span className="eml-lbl">Section 09</span>
                  <h2 className="eml-hero-title fs-20 mb-1">Email Queue</h2>
                  <p className="fs-13 text-muted mb-0">
                    What is waiting right now.
                  </p>
                </div>
              </div>
              <div className="d-flex align-items-center justify-content-between gap-3 flex-wrap mb-3">
                <div>
                  <p className="fs-13 mb-0">
                    <b className="eml-mono">6,142</b>{" "}
                    <span className="text-muted">
                      messages waiting · draining at 14/second · queue clears in
                      about 7 minutes
                    </span>
                  </p>
                </div>
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
              <div className="eml-q is-high">
                <div className="eml-q-body">
                  <strong>Password reset</strong>
                  <span>r.menon@gmail.com</span>
                </div>
                <div className="eml-q-side">
                  <span className="badge-meta">Critical</span>
                  <span className="eml-badge is-info">Sending</span>
                  <span className="fs-12 text-muted eml-mono">2 sec ago</span>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-light bg-white"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#eml_workspace"
                    aria-label="Open configuration workspace for Password reset"
                  >
                    Open
                  </button>
                </div>
              </div>
              <div className="eml-q is-normal">
                <div className="eml-q-body">
                  <strong>Fee reminder · batch 3 of 7</strong>
                  <span>1,284 recipients</span>
                </div>
                <div className="eml-q-side">
                  <span className="badge-meta">Normal</span>
                  <span className="eml-badge">Queued</span>
                  <span className="fs-12 text-muted eml-mono">in 40 sec</span>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-light bg-white"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#eml_workspace"
                    aria-label="Open configuration workspace for Fee reminder · batch 3 of 7"
                  >
                    Open
                  </button>
                </div>
              </div>
              <div className="eml-q is-normal">
                <div className="eml-q-body">
                  <strong>Invoice INV/2026-27/0912</strong>
                  <span>k.subramanian@outlook.com</span>
                </div>
                <div className="eml-q-side">
                  <span className="badge-meta">Normal</span>
                  <span className="eml-badge">Queued</span>
                  <span className="fs-12 text-muted eml-mono">in 1 min</span>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-light bg-white"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#eml_workspace"
                    aria-label="Open configuration workspace for Invoice INV/2026-27/0912"
                  >
                    Open
                  </button>
                </div>
              </div>
              <div className="eml-q is-high">
                <div className="eml-q-body">
                  <strong>Attendance alert · Class VII-B</strong>
                  <span>18 recipients</span>
                </div>
                <div className="eml-q-side">
                  <span className="badge-meta">High</span>
                  <span className="eml-badge">Queued</span>
                  <span className="fs-12 text-muted eml-mono">in 2 min</span>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-light bg-white"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#eml_workspace"
                    aria-label="Open configuration workspace for Attendance alert · Class VII-B"
                  >
                    Open
                  </button>
                </div>
              </div>
              <div className="eml-q is-low">
                <div className="eml-q-body">
                  <strong>Monthly newsletter</strong>
                  <span>4,806 recipients</span>
                </div>
                <div className="eml-q-side">
                  <span className="badge-meta">Bulk</span>
                  <span className="eml-badge is-warn">
                    Held — waiting for a quiet queue
                  </span>
                  <span className="fs-12 text-muted eml-mono">21:00</span>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-light bg-white"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#eml_workspace"
                    aria-label="Open configuration workspace for Monthly newsletter"
                  >
                    Open
                  </button>
                </div>
              </div>
              <div className="eml-q is-normal">
                <div className="eml-q-body">
                  <strong>Meeting confirmation</strong>
                  <span>s.iyer@yahoo.co.in</span>
                </div>
                <div className="eml-q-side">
                  <span className="badge-meta">Normal</span>
                  <span className="eml-badge is-warn">Retry 2 of 3</span>
                  <span className="fs-12 text-muted eml-mono">in 28 min</span>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-light bg-white"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#eml_workspace"
                    aria-label="Open configuration workspace for Meeting confirmation"
                  >
                    Open
                  </button>
                </div>
              </div>
            </div>
            <div
              className="tab-pane fade"
              id="emlpane-logs"
              role="tabpanel"
              aria-labelledby="emltab-logs"
              tabIndex={0}
            >
              <div className="d-flex align-items-end justify-content-between gap-3 flex-wrap mb-3">
                <div>
                  <span className="eml-lbl">Section 10</span>
                  <h2 className="eml-hero-title fs-20 mb-1">Logs</h2>
                  <p className="fs-13 text-muted mb-0">
                    What the provider said, in its own words.
                  </p>
                </div>
              </div>
              <div className="eml-panel">
                <div className="eml-panel-band">
                  <span className="eml-panel-ic">
                    <i className="ti ti-list-details" />
                  </span>
                  <div className="flex-fill overflow-hidden">
                    <p className="eml-panel-title">Delivery log</p>
                    <p>Last 10 events · retained for 90 days</p>
                  </div>
                  <span className="eml-badge is-ok">8 accepted</span>
                  <span className="eml-badge is-warn">2 deferred</span>
                  <span className="eml-badge is-bad">2 rejected</span>
                </div>
                <div className="eml-panel-body">
                  <div className="eml-log">
                    <span className="eml-log-t">2026-08-01 09:14:02</span>
                    <span>
                      <span className="eml-badge is-ok">250</span>
                    </span>
                    <span className="eml-log-msg">
                      noreply@karkaii.edu → r.menon@gmail.com · accepted, 142
                      ms
                    </span>
                  </div>
                  <div className="eml-log">
                    <span className="eml-log-t">2026-08-01 09:13:58</span>
                    <span>
                      <span className="eml-badge is-ok">250</span>
                    </span>
                    <span className="eml-log-msg">
                      noreply@karkaii.edu → 1,284 recipients · batch 2 of 7
                      accepted
                    </span>
                  </div>
                  <div className="eml-log is-warn">
                    <span className="eml-log-t">2026-08-01 09:12:41</span>
                    <span>
                      <span className="eml-badge is-warn">451</span>
                    </span>
                    <span className="eml-log-msg">
                      greylisted by mx1.yahoodns.net · retry scheduled in 5 min
                    </span>
                  </div>
                  <div className="eml-log">
                    <span className="eml-log-t">2026-08-01 09:11:19</span>
                    <span>
                      <span className="eml-badge is-ok">250</span>
                    </span>
                    <span className="eml-log-msg">
                      fees@karkaii.edu → k.subramanian@outlook.com · accepted,
                      118 ms
                    </span>
                  </div>
                  <div className="eml-log is-bad">
                    <span className="eml-log-t">2026-08-01 09:08:03</span>
                    <span>
                      <span className="eml-badge is-bad">550</span>
                    </span>
                    <span className="eml-log-msg">
                      user unknown · a.pillai@rediffmail.com · address
                      suppressed
                    </span>
                  </div>
                  <div className="eml-log">
                    <span className="eml-log-t">2026-08-01 09:05:44</span>
                    <span>
                      <span className="eml-badge is-ok">250</span>
                    </span>
                    <span className="eml-log-msg">
                      admissions@karkaii.edu → 34 recipients · accepted
                    </span>
                  </div>
                  <div className="eml-log is-warn">
                    <span className="eml-log-t">2026-08-01 08:59:12</span>
                    <span>
                      <span className="eml-badge is-warn">421</span>
                    </span>
                    <span className="eml-log-msg">
                      too many connections from this IP · rate reduced to 10/sec
                      for 60 s
                    </span>
                  </div>
                  <div className="eml-log">
                    <span className="eml-log-t">2026-08-01 08:54:30</span>
                    <span>
                      <span className="eml-badge is-ok">235</span>
                    </span>
                    <span className="eml-log-msg">
                      authentication successful ·
                      email-smtp.ap-south-1.amazonaws.com
                    </span>
                  </div>
                  <div className="eml-log is-bad">
                    <span className="eml-log-t">2026-08-01 08:41:07</span>
                    <span>
                      <span className="eml-badge is-bad">554</span>
                    </span>
                    <span className="eml-log-msg">
                      message rejected as spam · newsletter draft · not retried
                    </span>
                  </div>
                  <div className="eml-log">
                    <span className="eml-log-t">2026-08-01 08:30:00</span>
                    <span>
                      <span className="eml-badge is-ok">250</span>
                    </span>
                    <span className="eml-log-msg">
                      scheduled health check · connection verified, TLS 1.3
                    </span>
                  </div>
                </div>
                <div className="eml-panel-foot">
                  <span className="fs-12 text-muted">
                    Times are Asia/Kolkata
                  </span>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-light bg-white d-inline-flex align-items-center"
                    data-bs-toggle="modal"
                    data-bs-target="#eml_export"
                  >
                    <i className="ti ti-download me-1" />
                    Export log
                  </button>
                </div>
              </div>
            </div>
            <div
              className="tab-pane fade"
              id="emlpane-security"
              role="tabpanel"
              aria-labelledby="emltab-security"
              tabIndex={0}
            >
              <div className="d-flex align-items-end justify-content-between gap-3 flex-wrap mb-3">
                <div>
                  <span className="eml-lbl">Section 11</span>
                  <h2 className="eml-hero-title fs-20 mb-1">Security</h2>
                  <p className="fs-13 text-muted mb-0">
                    Domain authentication, keys and who may change any of this.
                  </p>
                </div>
              </div>
              <div className="row g-4">
                <div className="col-12">
                  <span className="eml-lbl">Domain authentication</span>
                  <div className="eml-dns">
                    <div className="eml-dns-top">
                      <h3 className="fs-15 fw-medium">DKIM</h3>
                      <p className="flex-fill">
                        Messages are signed so a receiver can prove they were
                        not altered
                      </p>
                      <span className="eml-seal">
                        <i className="ti ti-check" />
                        Pass
                      </span>
                    </div>
                    <div className="eml-dns-rec">
                      karkaii._domainkey.karkaii.edu TXT
                      <br />
                      v=DKIM1; k=rsa;
                      p=MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA7Xk…IDAQAB
                    </div>
                    <div className="d-flex align-items-center justify-content-between gap-2 flex-wrap mt-2">
                      <span className="fs-12 text-muted">
                        2048-bit · rotated 11 Jun 2026
                      </span>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-light bg-white"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#eml_workspace"
                        aria-label="Open configuration workspace for DKIM"
                      >
                        Details
                      </button>
                    </div>
                  </div>
                  <div className="eml-dns">
                    <div className="eml-dns-top">
                      <h4 className="fs-15 fw-medium">SPF</h4>
                      <p className="flex-fill">
                        Names the servers permitted to send as karkaii.edu
                      </p>
                      <span className="eml-seal">
                        <i className="ti ti-check" />
                        Pass
                      </span>
                    </div>
                    <div className="eml-dns-rec">
                      karkaii.edu TXT
                      <br />
                      v=spf1 include:amazonses.com include:_spf.google.com ~all
                    </div>
                    <div className="d-flex align-items-center justify-content-between gap-2 flex-wrap mt-2">
                      <span className="fs-12 text-muted">
                        2 includes · 4 of 10 DNS lookups used
                      </span>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-light bg-white"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#eml_workspace"
                        aria-label="Open configuration workspace for SPF"
                      >
                        Details
                      </button>
                    </div>
                  </div>
                  <div className="eml-dns">
                    <div className="eml-dns-top">
                      <h5 className="fs-15">DMARC</h5>
                      <p className="flex-fill">
                        Tells receivers what to do when DKIM or SPF fails
                      </p>
                      <span className="eml-seal is-warn">
                        <i className="ti ti-alert-triangle" />
                        Quarantine
                      </span>
                    </div>
                    <div className="eml-dns-rec">
                      _dmarc.karkaii.edu TXT
                      <br />
                      v=DMARC1; p=quarantine; rua=mailto:dmarc@karkaii.edu;
                      pct=100
                    </div>
                    <div className="d-flex align-items-center justify-content-between gap-2 flex-wrap mt-2">
                      <span className="fs-12 text-muted">
                        Policy is quarantine, not reject — move to reject once
                        the reports stay clean for 30 days
                      </span>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-light bg-white"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#eml_workspace"
                        aria-label="Open configuration workspace for DMARC"
                      >
                        Details
                      </button>
                    </div>
                  </div>
                  <div className="eml-dns">
                    <div className="eml-dns-top">
                      <h6>BIMI</h6>
                      <p className="flex-fill">
                        Shows the school crest beside the message in supporting
                        mailboxes
                      </p>
                      <span className="eml-seal is-bad">
                        <i className="ti ti-x" />
                        Not set
                      </span>
                    </div>
                    <div className="eml-dns-rec">
                      _bimi.karkaii.edu TXT
                      <br />— no record published —
                    </div>
                    <div className="d-flex align-items-center justify-content-between gap-2 flex-wrap mt-2">
                      <span className="fs-12 text-muted">
                        Requires DMARC at p=reject and a verified mark
                        certificate
                      </span>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-light bg-white"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#eml_workspace"
                        aria-label="Open configuration workspace for BIMI"
                      >
                        Details
                      </button>
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <div className="eml-panel">
                    <div className="eml-panel-band">
                      <span className="eml-panel-ic">
                        <i className="ti ti-key" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="eml-panel-title">API keys</p>
                        <p>Used by services that send on the school’s behalf</p>
                      </div>
                      <span className="eml-badge is-info">3 active</span>
                    </div>
                    <div className="eml-panel-body">
                      <div className="eml-hdr">
                        <span className="eml-hdr-key">Amazon SES</span>
                        <span className="eml-hdr-val">
                          AKIA••••7QK4 · created 11 Jun 2026
                        </span>
                        <span className="eml-hdr-ctl">
                          <span className="eml-secret">
                            <i className="ti ti-lock" />
                            Send only
                          </span>
                        </span>
                      </div>
                      <div className="eml-hdr">
                        <span className="eml-hdr-key">SendGrid</span>
                        <span className="eml-hdr-val">
                          SG.••••91cX · created 02 Feb 2026
                        </span>
                        <span className="eml-hdr-ctl">
                          <span className="eml-secret">
                            <i className="ti ti-lock" />
                            Send only
                          </span>
                        </span>
                      </div>
                      <div className="eml-hdr">
                        <span className="eml-hdr-key">Postmark</span>
                        <span className="eml-hdr-val">
                          pm-••••4dA2 · created 14 Apr 2026
                        </span>
                        <span className="eml-hdr-ctl">
                          <span className="eml-secret">
                            <i className="ti ti-lock" />
                            Send only
                          </span>
                        </span>
                      </div>
                      <div className="eml-hdr">
                        <span className="eml-hdr-key">Revoked</span>
                        <span className="eml-hdr-val">
                          Mailgun key removed on 09 Jul 2026
                        </span>
                        <span className="eml-hdr-ctl">
                          <span className="eml-badge is-bad">Revoked</span>
                        </span>
                      </div>
                    </div>
                    <div className="eml-panel-foot">
                      <span className="fs-12 text-muted">
                        Keys are never shown again after creation
                      </span>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-light bg-white d-inline-flex align-items-center"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#eml_workspace"
                        aria-label="Open configuration workspace for API keys"
                      >
                        <i className="ti ti-settings me-1" />
                        Configure
                      </button>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="eml-panel">
                      <div className="eml-panel-band is-ok">
                        <span className="eml-panel-ic">
                          <i className="ti ti-lock-check" />
                        </span>
                        <div className="flex-fill overflow-hidden">
                          <p className="eml-panel-title">
                            Access to these settings
                          </p>
                          <p>Who may change email configuration</p>
                        </div>
                        <span className="eml-badge is-ok">Restricted</span>
                      </div>
                      <div className="eml-panel-body">
                        <div className="eml-hdr">
                          <span className="eml-hdr-key">Permitted roles</span>
                          <span className="eml-hdr-val">
                            Super admin and IT administrator only
                          </span>
                          <span className="eml-hdr-ctl">
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-light bg-white"
                              data-bs-toggle="offcanvas"
                              data-bs-target="#eml_workspace"
                              aria-label="Open configuration workspace for Permitted roles"
                            >
                              Manage
                            </button>
                          </span>
                        </div>
                        <div className="eml-hdr">
                          <span className="eml-hdr-key">
                            Two-factor required
                          </span>
                          <span className="eml-hdr-val">
                            To save or publish any change here
                          </span>
                          <div className="eml-hdr-ctl">
                            <div className="form-check form-switch mb-0">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                role="switch"
                                id="eml_sw_38"
                                defaultChecked
                              />
                              <label
                                className="form-check-label visually-hidden"
                                htmlFor="eml_sw_38"
                              >
                                Enable
                              </label>
                            </div>
                          </div>
                        </div>
                        <div className="eml-hdr">
                          <span className="eml-hdr-key">Change approval</span>
                          <span className="eml-hdr-val">
                            A second administrator must approve a provider
                            change
                          </span>
                          <div className="eml-hdr-ctl">
                            <div className="form-check form-switch mb-0">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                role="switch"
                                id="eml_sw_39"
                                defaultChecked
                              />
                              <label
                                className="form-check-label visually-hidden"
                                htmlFor="eml_sw_39"
                              >
                                Enable
                              </label>
                            </div>
                          </div>
                        </div>
                        <div className="eml-hdr">
                          <span className="eml-hdr-key">Audit retention</span>
                          <span className="eml-hdr-val">3 academic years</span>
                          <span className="eml-hdr-ctl">
                            <select
                              className="eml-select"
                              aria-label="Setting value"
                            >
                              <option>3 academic years</option>
                              <option>1 year</option>
                              <option>Indefinite</option>
                            </select>
                          </span>
                        </div>
                      </div>
                      <div className="eml-panel-foot">
                        <span className="fs-12 text-muted">4 settings</span>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-light bg-white d-inline-flex align-items-center"
                          data-bs-toggle="offcanvas"
                          data-bs-target="#eml_workspace"
                          aria-label="Open configuration workspace for Access control"
                        >
                          <i className="ti ti-settings me-1" />
                          Configure
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="tab-pane fade"
              id="emlpane-advanced"
              role="tabpanel"
              aria-labelledby="emltab-advanced"
              tabIndex={0}
            >
              <div className="d-flex align-items-end justify-content-between gap-3 flex-wrap mb-3">
                <div>
                  <span className="eml-lbl">Section 12</span>
                  <h2 className="eml-hero-title fs-20 mb-1">Advanced</h2>
                  <p className="fs-13 text-muted mb-0">
                    Headers, webhooks, tracking and the reset switch.
                  </p>
                </div>
              </div>
              <div className="accordion eml-acc" id="emlAdvanced">
                <div className="accordion-item">
                  <h2 className="accordion-header" id="emlacc-hhdrs">
                    <button
                      className="accordion-button"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#emlacc-hdrs"
                      aria-expanded="true"
                      aria-controls="emlacc-hdrs"
                    >
                      <i className="ti ti-code" />
                      Custom headers
                      <span className="eml-badge is-info eml-acc-spacer">
                        4 headers
                      </span>
                    </button>
                  </h2>
                  <div
                    id="emlacc-hdrs"
                    className="accordion-collapse collapse show"
                    aria-labelledby="emlacc-hhdrs"
                    data-bs-parent="#emlAdvanced"
                    role="region"
                  >
                    <div className="accordion-body">
                      <div className="eml-hdr">
                        <span className="eml-hdr-key">X-Karkaii-Env</span>
                        <span className="eml-hdr-val eml-mono">production</span>
                        <span className="eml-hdr-ctl" />
                      </div>
                      <div className="eml-hdr">
                        <span className="eml-hdr-key">X-Karkaii-Module</span>
                        <span className="eml-hdr-val eml-mono">
                          {"{"}module{"}"}
                        </span>
                        <span className="eml-hdr-ctl" />
                      </div>
                      <div className="eml-hdr">
                        <span className="eml-hdr-key">List-Unsubscribe</span>
                        <span className="eml-hdr-val eml-mono">
                          &lt;https://karkaii.edu/u/{"{"}token{"}"}&gt;
                        </span>
                        <span className="eml-hdr-ctl" />
                      </div>
                      <div className="eml-hdr">
                        <span className="eml-hdr-key">Auto-Submitted</span>
                        <span className="eml-hdr-val eml-mono">
                          auto-generated
                        </span>
                        <span className="eml-hdr-ctl" />
                      </div>
                      <p className="fs-12 text-muted mb-0 mt-2">
                        Added to every outbound message. They help receivers
                        classify school mail correctly and let support trace a
                        message back to the module that sent it.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="accordion-item">
                  <h2 className="accordion-header" id="emlacc-hwebhook">
                    <button
                      className="accordion-button collapsed"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#emlacc-webhook"
                      aria-expanded="false"
                      aria-controls="emlacc-webhook"
                    >
                      <i className="ti ti-webhook" />
                      Delivery webhooks
                    </button>
                  </h2>
                  <div
                    id="emlacc-webhook"
                    className="accordion-collapse collapse"
                    aria-labelledby="emlacc-hwebhook"
                    data-bs-parent="#emlAdvanced"
                    role="region"
                  >
                    <div className="accordion-body">
                      <div className="eml-hdr">
                        <span className="eml-hdr-key">Endpoint</span>
                        <span className="eml-hdr-val eml-mono">
                          https://karkaii.edu/hooks/mail
                        </span>
                        <span className="eml-hdr-ctl" />
                      </div>
                      <div className="eml-hdr">
                        <span className="eml-hdr-key">Events</span>
                        <span className="eml-hdr-val">
                          delivered, bounced, complained, opened
                        </span>
                        <span className="eml-hdr-ctl" />
                      </div>
                      <div className="eml-hdr">
                        <span className="eml-hdr-key">Signing</span>
                        <span className="eml-hdr-val">
                          HMAC SHA-256, shared secret rotated yearly
                        </span>
                        <span className="eml-hdr-ctl" />
                      </div>
                      <div className="eml-hdr">
                        <span className="eml-hdr-key">Unsigned callbacks</span>
                        <span className="eml-hdr-val">
                          Discarded and logged
                        </span>
                        <span className="eml-hdr-ctl" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="accordion-item">
                  <h2 className="accordion-header" id="emlacc-htrack">
                    <button
                      className="accordion-button collapsed"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#emlacc-track"
                      aria-expanded="false"
                      aria-controls="emlacc-track"
                    >
                      <i className="ti ti-eye-check" />
                      Tracking
                      <span className="eml-badge is-warn eml-acc-spacer">
                        Limited by policy
                      </span>
                    </button>
                  </h2>
                  <div
                    id="emlacc-track"
                    className="accordion-collapse collapse"
                    aria-labelledby="emlacc-htrack"
                    data-bs-parent="#emlAdvanced"
                    role="region"
                  >
                    <div className="accordion-body">
                      <div className="eml-hdr">
                        <span className="eml-hdr-key">Open tracking</span>
                        <span className="eml-hdr-val">
                          Newsletters only
                          <small>
                            Transactional mail is never tracked, on principle
                            and to keep it out of the promotions tab.
                          </small>
                        </span>
                        <span className="eml-hdr-ctl" />
                      </div>
                      <div className="eml-hdr">
                        <span className="eml-hdr-key">Click tracking</span>
                        <span className="eml-hdr-val">
                          Off everywhere
                          <small>
                            Rewritten links harm deliverability and confuse
                            guardians who check where a link goes.
                          </small>
                        </span>
                        <span className="eml-hdr-ctl" />
                      </div>
                      <div className="eml-hdr">
                        <span className="eml-hdr-key">Retention</span>
                        <span className="eml-hdr-val">
                          Aggregate counts only, 90 days
                        </span>
                        <span className="eml-hdr-ctl" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="accordion-item">
                  <h2 className="accordion-header" id="emlacc-hreset">
                    <button
                      className="accordion-button collapsed"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#emlacc-reset"
                      aria-expanded="false"
                      aria-controls="emlacc-reset"
                    >
                      <i className="ti ti-alert-octagon" />
                      Reset configuration
                    </button>
                  </h2>
                  <div
                    id="emlacc-reset"
                    className="accordion-collapse collapse"
                    aria-labelledby="emlacc-hreset"
                    data-bs-parent="#emlAdvanced"
                    role="region"
                  >
                    <div className="accordion-body">
                      <p className="fs-13 text-muted">
                        Resetting returns every email setting to the template
                        default, disconnects all providers and clears stored
                        credentials. Templates, logs and the suppression list
                        are kept.
                      </p>
                      <button
                        type="button"
                        className="btn btn-outline-danger btn-sm d-inline-flex align-items-center"
                        data-bs-toggle="modal"
                        data-bs-target="#eml_reset"
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
              id="emlpane-audit"
              role="tabpanel"
              aria-labelledby="emltab-audit"
              tabIndex={0}
            >
              <div className="d-flex align-items-end justify-content-between gap-3 flex-wrap mb-3">
                <div>
                  <span className="eml-lbl">Section 13</span>
                  <h2 className="eml-hero-title fs-20 mb-1">Audit History</h2>
                  <p className="fs-13 text-muted mb-0">
                    Every change, with the name against it.
                  </p>
                </div>
              </div>
              <div className="eml-panel">
                <div className="eml-panel-band">
                  <span className="eml-panel-ic">
                    <i className="ti ti-history" />
                  </span>
                  <div className="flex-fill overflow-hidden">
                    <p className="eml-panel-title">Audit history</p>
                    <p>
                      Every change to email configuration, retained for 3
                      academic years
                    </p>
                  </div>
                  <span className="eml-badge">8 of 214 entries</span>
                </div>
                <div className="eml-panel-body">
                  <div className="eml-audit">
                    <div className="eml-audit-when">
                      <strong>01 Aug 2026</strong>09:14
                    </div>
                    <div className="eml-audit-what">
                      Connection test run against Amazon SES
                      <span>System · scheduled health check · 250 OK</span>
                    </div>
                  </div>
                  <div className="eml-audit">
                    <div className="eml-audit-when">
                      <strong>31 Jul 2026</strong>16:40
                    </div>
                    <div className="eml-audit-what">
                      Daily send ceiling raised from 40,000 to 60,000
                      <span>Ms. Latha Rao · approved by the Principal</span>
                    </div>
                  </div>
                  <div className="eml-audit">
                    <div className="eml-audit-when">
                      <strong>31 Jul 2026</strong>16:12
                    </div>
                    <div className="eml-audit-what">
                      Homework digest notification switched off
                      <span>Ms. Latha Rao · template still a draft</span>
                    </div>
                  </div>
                  <div className="eml-audit">
                    <div className="eml-audit-when">
                      <strong>30 Jul 2026</strong>11:05
                    </div>
                    <div className="eml-audit-what">
                      Newsletter template edited — footer address corrected
                      <span>Mr. R. Venkatesh</span>
                    </div>
                  </div>
                  <div className="eml-audit">
                    <div className="eml-audit-when">
                      <strong>28 Jul 2026</strong>14:22
                    </div>
                    <div className="eml-audit-what">
                      Fee reminder template edited — new payment ceiling
                      reflected<span>Ms. Latha Rao</span>
                    </div>
                  </div>
                  <div className="eml-audit">
                    <div className="eml-audit-when">
                      <strong>11 Jun 2026</strong>09:30
                    </div>
                    <div className="eml-audit-what">
                      SES credentials rotated
                      <span>System · 180-day rotation policy</span>
                    </div>
                  </div>
                  <div className="eml-audit">
                    <div className="eml-audit-when">
                      <strong>09 Jul 2026</strong>15:48
                    </div>
                    <div className="eml-audit-what">
                      Mailgun API key revoked
                      <span>Ms. Latha Rao · provider moved to standby</span>
                    </div>
                  </div>
                  <div className="eml-audit">
                    <div className="eml-audit-when">
                      <strong>02 Feb 2026</strong>10:00
                    </div>
                    <div className="eml-audit-what">
                      karkaii.edu verified as a sending domain
                      <span>System · DKIM, SPF and DMARC published</span>
                    </div>
                  </div>
                </div>
                <div className="eml-panel-foot">
                  <span className="fs-12 text-muted">
                    Entries cannot be edited or removed
                  </span>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-light bg-white d-inline-flex align-items-center"
                    data-bs-toggle="modal"
                    data-bs-target="#eml_export"
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
      {/* ===================== 9. MAIL ACTIVITY TIMELINE ===================== */}
      <div className="d-flex align-items-end justify-content-between gap-3 flex-wrap mt-5 mb-3">
        <div>
          <h2 className="eml-hero-title fs-20 mb-1">Mail activity</h2>
          <p className="fs-13 text-muted mb-0">
            From the day the provider was connected to what is still waiting to
            be published.
          </p>
        </div>
        <button
          type="button"
          className="btn btn-primary btn-sm d-inline-flex align-items-center"
          data-bs-toggle="modal"
          data-bs-target="#eml_smtp"
        >
          <i className="ti ti-rocket me-1" />
          Publish settings
        </button>
      </div>
      <div className="eml-tl">
        <div className="eml-tl-step is-done">
          <div className="eml-tl-when">
            <strong>11 Jun 2026</strong>09:30
          </div>
          <span className="eml-tl-dot">
            <i className="ti ti-plug-connected" />
          </span>
          <div className="eml-tl-body">
            <h3 className="fs-15 fw-medium">Provider connected</h3>
            <p>Amazon SES connected in ap-south-1 with a send-only IAM key.</p>
          </div>
        </div>
        <div className="eml-tl-step is-done">
          <div className="eml-tl-when">
            <strong>11 Jun 2026</strong>09:34
          </div>
          <span className="eml-tl-dot">
            <i className="ti ti-shield-check" />
          </span>
          <div className="eml-tl-body">
            <h4 className="fs-15 fw-medium">Authentication verified</h4>
            <p>
              DKIM signature validated, SPF include resolved, DMARC record found
              at quarantine.
            </p>
          </div>
        </div>
        <div className="eml-tl-step is-done">
          <div className="eml-tl-when">
            <strong>11 Jun 2026</strong>09:41
          </div>
          <span className="eml-tl-dot">
            <i className="ti ti-send" />
          </span>
          <div className="eml-tl-body">
            <h5 className="fs-15">Test email sent</h5>
            <p>
              A single message to the IT administrator, accepted with 250 in 138
              ms.
            </p>
          </div>
        </div>
        <div className="eml-tl-step is-done">
          <div className="eml-tl-when">
            <strong>11 Jun 2026</strong>09:41
          </div>
          <span className="eml-tl-dot">
            <i className="ti ti-mail-check" />
          </span>
          <div className="eml-tl-body">
            <h6>Delivery successful</h6>
            <p>
              Delivered to the inbox, not the promotions tab, with the crest
              rendered.
            </p>
          </div>
        </div>
        <div className="eml-tl-step is-current">
          <div className="eml-tl-when">
            <strong>31 Jul 2026</strong>16:40
          </div>
          <span className="eml-tl-dot">
            <i className="ti ti-pencil" />
          </span>
          <div className="eml-tl-body">
            <h6>Configuration updated</h6>
            <p>
              Daily ceiling raised to 60,000 and the homework digest switched
              off. Two changes are still drafts.
            </p>
          </div>
        </div>
        <div className="eml-tl-step">
          <div className="eml-tl-when">
            <strong>Pending</strong>—
          </div>
          <span className="eml-tl-dot">
            <i className="ti ti-rocket" />
          </span>
          <div className="eml-tl-body">
            <h6>Settings published</h6>
            <p>
              Publishing applies the drafts to every outbound message within a
              minute.
            </p>
          </div>
        </div>
      </div>
      {/* /Mail Activity Timeline */}
    </div>
  </div>
  {/* /Page Wrapper */}
</>

  )
}

export default EmailSettings